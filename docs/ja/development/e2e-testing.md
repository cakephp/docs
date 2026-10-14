# E2E テスト

E2E (エンドツーエンド) テストは、アプリケーションを本物のブラウザーで開き、ユーザーと同じように
操作します。リンクをクリックし、フォームに入力し、ボタンを押して、画面に表示される内容を確認します。
[pieceofcake2/e2e-test](https://pieceofcake2.github.io/e2e-test/) パッケージを使うと、
CakePHP 2 アプリケーションにブラウザーによる E2E テストを追加できます。このパッケージは
PHP のビルトイン Web サーバーでアプリケーションを起動し、
[Symfony Panther](https://github.com/symfony/panther) でヘッドレス Chrome を操作して、
PHPUnit 9.6 でテストを実行します。テストケースは `CakeTestCase` を継承するので、
`$fixtures` はほかのテストと同じように使えます。

このページでは、E2E テストが役に立つ場面、セットアップの方法、テストの書き方を説明します。
すべてのオプションとメソッドについては
[パッケージのドキュメント](https://pieceofcake2.github.io/e2e-test/) (英語)
を参照してください。

<a id="when-to-use-e2e-tests"></a>

## E2E テストを使う場面

CakePHP アプリケーションのテストは、通常 3 つのレベルで行います
([テストの種類](/ja/development/testing#types-of-tests) を参照してください)。

| | ユニットテスト | コントローラーのテスト (`testAction()`) | E2E テスト |
| --- | --- | --- | --- |
| 実行場所 | PHPUnit のプロセス内 | PHPUnit のプロセス内 (HTTP なし) | 本物の HTTP サーバーと本物の Chrome |
| 速度 | 数ミリ秒 | 1 リクエストあたり数ミリ秒 | 1 テストあたり数秒 |
| JavaScript、CSS、レイアウト | なし | なし | あり |
| Cookie、セッション、リダイレクト | - | シミュレーション | 本物 |
| `SecurityComponent` のトークン | - | 通常は無効化またはモック | 実際のフォームの本物のトークン |
| ビュー変数、戻り値 | 確認できる | 確認できる | 確認できない (ユーザーに見えるものだけ) |
| 準備 | 不要 | 不要 | Chrome、chromedriver、サーバー用のテストデータベース |

E2E テストが適しているのは次のような場合です。

- 会員登録、購入手続き、複数ステップのフォームなど、複数のページにまたがる操作の流れ
- JavaScript、レイアウト、レスポンシブデザイン、ブラウザーに依存する機能
- `SecurityComponent` で保護されたフォームや、テンプレートで使うヘルパー。コントローラーのテストでは
  通常トークンの検証を回避するため、ここでの誤りはブラウザーでしか見つかりません。

モデル、コンポーネント、コントローラーのロジックや、ステータスコード、境界条件は、ユニットテストと
コントローラーのテストで確認してください。E2E テストはどれもアプリケーション全体をブラウザーで
動かすため、1 つに数秒かかります。数を絞り、主要な操作の流れに集中させましょう。

<a id="how-it-works"></a>

## 仕組み

このパッケージは CakePHP のプラグインではなくライブラリ (名前空間 `Pieceofcake2\E2ETest\`) なので、
`CakePlugin::load()` で読み込む必要はありません。次のクラスで構成されています。

- `Server`: `php -S` とルータースクリプトでアプリケーションを起動します。サーバーはキャッシュ、
  ログ、セッション用に専用の一時ディレクトリを使います。
- `Environment`: テストの実行中、サーバーと *デバイス* (デフォルトは `pc` と `mobile`) ごとの
  ヘッドレス Chrome を保持します。
- `E2EExtension`: 最初のテストの前にサーバーを起動し、最後のテストの後にサーバーとブラウザーを
  停止する PHPUnit の拡張です。
- `E2ETestCase`: `visit()`、`fillField()`、`pressButton()`、`assertSeeText()` などの
  ブラウザー用ヘルパーとアサーションを備えた `CakeTestCase` です。

各テストの前に `CakeFixtureInjector` が `$fixtures` をテスト用データベースに読み込み、
アプリケーションのサーバーは同じデータベースを読みます。ブラウザーは実行中ずっと開いたままですが、
Cookie とストレージはテストごとに消去されます。

<a id="requirements"></a>

## 動作要件

- PHP 8.0 以上。Composer は PHP 8.0 では Panther 2.1、PHP 8.1 以上では Panther 2.4 を
  インストールします (Panther 2.2 以降は PHP 8.1 が必要です)。
- pieceofcake2/cakephp 2.12 以上と PHPUnit 9.6
- Google Chrome または Chromium と、同じメジャーバージョンの chromedriver
- `dom` 拡張

macOS と Linux で動作します。Windows でも動くはずですが、テストはしていません。

<a id="installation"></a>

## インストール

開発用の依存パッケージとしてインストールします。

```bash
composer require --dev pieceofcake2/e2e-test
```

chromedriver は、インストールされている Chrome とメジャーバージョンが一致している必要があります。
[bdi](https://github.com/dbrekelmans/bdi) を使うのが最も簡単です。bdi は Chrome を検出し、
対応するドライバーを Panther が探す場所である `drivers/chromedriver` にダウンロードします。

```bash
composer require --dev dbrekelmans/bdi
vendor/bin/bdi detect drivers
```

Chrome が自動更新されたら `bdi` をもう一度実行し、`/drivers` を `.gitignore` に追加してください。
環境変数 `PANTHER_CHROME_DRIVER_BINARY` と `PANTHER_CHROME_BINARY` でバイナリの場所を
指定することもできます。macOS でダウンロードしたドライバーがブロックされる場合は
`xattr -d com.apple.quarantine drivers/chromedriver` を実行してください。root で動く
コンテナーでは `PANTHER_NO_SANDBOX=1` を設定します。

<a id="setup"></a>

## セットアップ

例では [pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンのモダンな構成を使います。
E2E テストには専用の PHPUnit 設定ファイルとディレクトリを用意します。

```text
your-app/
├── phpunit.xml.dist          # unit and controller tests (unchanged)
├── phpunit.e2e.xml.dist      # E2E tests
└── tests/
    ├── bootstrap.php         # your test bootstrap (unchanged)
    └── E2E/
        ├── bootstrap.php     # loads tests/bootstrap.php and configures the server
        └── ContactFormTest.php
```

<a id="phpunit-configuration"></a>

### PHPUnit の設定

E2E テストは別の設定ファイルに分けます。こうすると `vendor/bin/phpunit` は速いままで、
Chrome も不要です。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- phpunit.e2e.xml.dist -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="tests/E2E/bootstrap.php"
         backupGlobals="false"
         stderr="true"
         colors="true">
    <php>
        <ini name="memory_limit" value="-1"/>
        <env name="DEBUG" value="0"/>
    </php>

    <!-- アプリケーションのサーバーを起動し、最後にサーバーとブラウザーを停止する -->
    <extensions>
        <extension class="Pieceofcake2\E2ETest\PHPUnit\E2EExtension"/>
    </extensions>

    <!-- ほかのテストと同じように $fixtures をテスト用データベースに読み込む -->
    <listeners>
        <listener class="CakeFixtureInjector" file="./vendor/pieceofcake2/cakephp/src/Cake/TestSuite/Fixture/CakeFixtureInjector.php"/>
    </listeners>

    <testsuites>
        <testsuite name="E2E">
            <directory>tests/E2E/</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

サーバーとブラウザーは static プロパティに保持されるため、`backupGlobals="false"` が必要です。

<a id="the-bootstrap-file"></a>

### ブートストラップファイル

`tests/E2E/bootstrap.php` は通常のテスト用ブートストラップを読み込み、
`Environment::configure()` でアプリケーションのサーバーを設定します。

```php
<?php
// tests/E2E/bootstrap.php

use Pieceofcake2\E2ETest\Environment;

require dirname(__DIR__) . '/bootstrap.php';

// サーバーはデータベースの設定を DB_* から読む (pieceofcake2/app の config/database.php)。
// CakeTestCase がフィクスチャを読み込むテスト用データベースを指定する。
$database = [];
foreach (['DATASOURCE', 'HOST', 'PORT', 'USERNAME', 'PASSWORD', 'DATABASE'] as $name) {
    $value = getenv('DB_TEST_' . $name);
    $database['DB_' . $name] = $value === false ? null : $value;
}

Environment::configure([
    'server' => [
        'env' => $database + [
            'DEBUG' => getenv('E2E_DEBUG') ?: '0',
            // テストから本物のメールを送らない
            'EMAIL_TRANSPORT' => 'Debug',
        ],
    ],
    'browser' => [
        'lang' => 'en-US',
    ],
    'artifactsDir' => dirname(__DIR__) . DS . 'E2E' . DS . 'artifacts',
]);
```

サーバーのプロセスはテストのプロセスの環境変数を引き継ぎ、そのうえで `server.env` を適用します。
`null` は引き継いだ変数を削除し、`''` は空文字列を設定します。pieceofcake2/app では本物の環境変数が
`config/.env` より優先されるので、この方法で設定ファイルを変更せずにサーバー専用の設定を渡せます。
よく使うのは、サーバーのデータベース、`DEBUG=0`、暗号化された Cookie を読めるようにするための
固定のソルト (`SECURITY_SALT`、`SECURITY_CIPHER_SEED`)、メールのトランスポート、外部サービスを
無効にする空の設定です。

<a id="the-router-script"></a>

### ルータースクリプト

PHP のビルトイン Web サーバーには、ファイルではないリクエストをすべて `webroot/index.php` に渡す
ルータースクリプトが必要です。パッケージにはルータースクリプトが含まれており、デフォルトでそれを
使います。このスクリプトは、既存のファイル (CSS、JavaScript、画像) をそのまま返し、`TMP` と
`LOGS` を定義してサーバーのキャッシュ、ログ、セッションを専用の一時ディレクトリに書き込ませ、
CakePHP がベースパスを正しく検出できるように `SCRIPT_NAME` を設定します。開発用の `tmp/` と
`logs/` には書き込みません。

独自のルーターが必要なのは、ほかの定数を定義するなど、アプリケーションの起動前に処理を追加したい
場合だけです。[ルーターの例](https://github.com/pieceofcake2/e2e-test/blob/1.x/docs/examples/router.php)
をコピーし、`server.router` オプションにそのパスを設定してください。

<a id="legacy-layout"></a>

### 従来の構成

ドキュメントルートは自動的に検出されます。モダンな構成では `webroot/`、従来の `app/` 構成では
`app/webroot/` です。従来の構成では、E2E 用のブートストラップファイルとテストは通常
`app/Test/E2E/` に置き、PHPUnit の設定ファイルもそこを指定します。失敗時のファイルは
デフォルトで `app/tmp/e2e-artifacts/` に保存されます。パスを明示的に設定することもできます。

```php
<?php

use Pieceofcake2\E2ETest\Environment;

Environment::configure([
    'server' => [
        'workingDir' => ROOT,
        'docroot' => ROOT . DS . 'app' . DS . 'webroot',
    ],
]);
```

`app/webroot/index.php` では、ルーターより先に `TMP` や `LOGS` を定義しないでください。
従来のファイルでは定義していません。

<a id="the-test-database"></a>

### テスト用データベース

ブラウザーに見えるのはサーバーが読めるデータだけです。そのため、サーバーは `CakeTestCase` が
フィクスチャを読み込むデータベース、つまり `test` データソースを使う必要があります。
上のブートストラップファイルでは、`DB_TEST_*` の値を `DB_*` としてサーバーに渡しています。

- テストに開発用のデータベースを使わないでください。
- 開くページで使うテーブルをすべて `$fixtures` に指定してください。テーブルがないとサーバーで
  エラーになります。
- テストに必要なレコードは、ページを開く前にテストの中でモデルを使って作成してください。
  フォームの結果はページだけでなくデータベースでも確認します。テストのプロセスとサーバーは
  同じデータベースを使います。
- SQLite の `:memory:` はプロセス間で共有できません。データベースファイルかデータベースサーバーを
  使い、同じデータベースに対して E2E テストを並列に実行しないでください。

<a id="mail"></a>

### メール

アプリケーションのサーバーは別のプロセスなので、サーバーが送ったメールをテストのプロセスで
受け取ることはできません。テストから本物のメールを送らないように、環境変数でトランスポートを選べる
ようにして `Debug` を使ってください。`DebugTransport` はメールを送信せずに内容を返します。

```php
// config/email.php
class EmailConfig
{
    public $default = [
        'transport' => 'Mail',
        'from' => 'you@localhost',
        'log' => true,
    ];

    public function __construct()
    {
        if (env('EMAIL_TRANSPORT')) {
            $this->default['transport'] = env('EMAIL_TRANSPORT');
        }
    }
}
```

`'log' => true` を設定すると、`CakeEmail` はすべてのメールをサーバーのログに書き込むので、
テストから読むことができます。

```php
$log = (string)file_get_contents(Environment::server()->logsDir() . 'debug.log');
$this->assertStringContainsString('To: jane@example.com', $log);
```

<a id="writing-tests"></a>

## テストを書く

<a id="a-complete-example"></a>

### 完全な例

`/contacts/add` にお問い合わせフォームがあるとします。`Contact` モデルは名前と有効なメール
アドレスを必須とし、コントローラーはメッセージを保存した後 `/contacts/thanks` にリダイレクト
します。テンプレートでは、テストが探すラベルを使っています。

```php
<?php
// templates/Contacts/add.ctp
?>
<h1>Contact us</h1>
<?= $this->Form->create('Contact') ?>
<?= $this->Form->input('name', ['label' => 'Your name']) ?>
<?= $this->Form->input('email', ['label' => 'Email address']) ?>
<?= $this->Form->input('topic_id', ['label' => 'Topic']) ?>
<?= $this->Form->input('message') ?>
<?= $this->Form->input('agree', ['type' => 'checkbox', 'label' => 'I agree to the terms']) ?>
<?= $this->Form->end('Send') ?>
```

テストでは、バリデーションエラー、PC のブラウザーからの送信、スマートフォンでの同じフォームを
確認します。

```php
<?php
// tests/E2E/ContactFormTest.php

use Pieceofcake2\E2ETest\TestSuite\E2ETestCase;

class ContactFormTest extends E2ETestCase
{
    /**
     * Fixtures
     *
     * @var array<string>
     */
    public $fixtures = ['app.contact', 'app.topic'];

    /**
     * Required fields are reported and what was entered is kept.
     *
     * @return void
     */
    public function testValidationErrors(): void
    {
        $this->visit('/contacts/add');
        $this->fillField('Email address', 'not an email');
        $this->pressButton('Send');

        $this->assertCurrentPath('/contacts/add');
        $this->assertSeeText('Enter your name.');
        $this->assertSeeText('Enter a valid email address.');
        $this->assertFieldValue('not an email', 'Email address');
    }

    /**
     * A valid message is saved and the thank-you page is shown.
     *
     * @return void
     */
    public function testSend(): void
    {
        $this->visit('/contacts/add');
        $this->fillField('Your name', 'Jane Doe');
        $this->fillField('Email address', 'jane@example.com');
        $this->selectOption('Topic', 'Billing');
        $this->fillField('Message', 'Please send me an invoice.');
        $this->checkLabel('I agree to the terms');
        $this->pressButton('Send');

        $this->assertCurrentPath('/contacts/thanks');
        $this->assertSeeText('Thank you for your message.');

        // ブラウザーとテストは同じテスト用データベースを使う
        $contact = ClassRegistry::init('Contact')->find('first', [
            'order' => ['Contact.id' => 'DESC'],
        ]);
        $this->assertSame('jane@example.com', $contact['Contact']['email']);
    }

    /**
     * The form fits a phone screen and can be sent from it.
     *
     * @return void
     */
    public function testMobile(): void
    {
        $mobile = $this->mobile();
        $this->visit('/contacts/add', $mobile);
        $this->assertSeeText('Contact us', $mobile);
        $this->assertNoHorizontalOverflow($mobile);

        $this->submitForm('Send', [
            'Your name' => 'Jane Doe',
            'Email address' => 'jane@example.com',
            'Topic' => 'Billing',
            'I agree to the terms' => true,
        ], $mobile);
        $this->assertCurrentPath('/contacts/thanks', $mobile);
    }
}
```

E2E テストを安定させるための原則は次のとおりです。

- ユーザーと同じ方法で要素を探してください。CSS クラスではなく、リンクのテキスト、ボタンの
  テキスト、ラベルを使います。
- ページを読み込む操作は次のページを待ちます。JavaScript の結果は明示的に待ち、`sleep()` は
  使わないでください。
- 結果はページだけでなくデータベースでも確認してください。
- 1 つのテストでは 1 つの流れだけを確認し、各テストに必要なデータはそのテストで作成してください。

<a id="helpers"></a>

### ヘルパー

ヘルパーはすべて `E2ETestCase` の protected メソッドです。最後の引数には使うブラウザーを
指定できます (`?Client $client = null`)。省略すると `pc` のブラウザーを使います。

**ページの移動と読み取り**

```php
$this->visit('/articles?page=2');
$this->assertCurrentPath('/articles?page=2');
$this->assertPageTitle('Articles');

$this->assertSeeText('First article'); // 表示されているテキストだけ
$this->assertNotSeeText('Draft');
$this->assertResponseContains('data-id="1"'); // HTML (JavaScript 実行後の DOM)
$this->assertElementVisible('nav .pagination');

$this->clickLink('Next');
$this->assertSame('Articles', $this->page()->filter('h1')->text());
```

`visit()` (別名 `get()`) はパスまたは絶対 URL を開き、`clickLink()` は表示されているリンクを
テキストで探してクリックします。`assertSeeText()` は表示されているテキスト (`innerText`) を確認します。
マークアップを確認する `assertResponseContains()` よりも、こちらを優先して使ってください。
`page()` は現在のページの Symfony DomCrawler を返し、`bodyText()`、`pageSource()`、
`currentPath()`、`currentUrl()` はそれぞれテキスト、HTML、現在の場所を返します。

**フォーム**

フィールドは `name`、`id`、ラベルのテキストで探します。

```php
$this->fillField('Email address', 'jane@example.com'); // ラベルのテキスト
$this->fillField('data[User][email]', 'jane@example.com'); // name
$this->selectOption('Country', 'Japan'); // option のテキスト、または value
$this->check('Send me the newsletter');
$this->uncheck('Send me the newsletter');
$this->checkLabel('I agree to the terms'); // ユーザーと同じようにラベルをクリックする
$this->attachFile('Attachment', TESTS . 'Fixture' . DS . 'files' . DS . 'invoice.pdf');
$this->pressButton('Save'); // 次のページを待つ
$this->assertFieldValue('jane@example.com', 'Email address');
```

`submitForm()` は、複数のフィールドへの入力とボタンの押下を 1 回の呼び出しで行います。
テキストフィールドとセレクトボックスには文字列、チェックボックスには真偽値、ラジオボタンには値、
複数選択のセレクトボックスには配列、ファイルフィールドにはパスを指定します。
`SecurityComponent` で保護されたフォームも、ブラウザーが本物のトークンを送信するので、そのまま
動きます。JavaScript でフィールドを追加したり変更したりする場合は、実際のユーザーのためにも
必要なとおり、そのフィールドのロックを解除してください (`$this->Form->unlockField()`)。

**待機**

`clickLink()`、`pressButton()`、`submitForm()` は、次のページが読み込まれてから戻ります。
それ以外の場合は結果を待ちます。

```php
$this->pressButton('Load more', null, false); // JavaScript のボタン: 新しいページはない
$this->waitForElement('.spinner');
$this->waitForText('20 more articles');
$this->waitForElementToDisappear('.spinner');
$this->waitUntil(fn($client) => $client->executeScript('return window.appReady === true;'));
```

待機は 10 秒 (`waitTimeout` オプションまたは環境変数 `E2E_WAIT_TIMEOUT`) でタイムアウトし、
現在のパスを含むメッセージでテストが失敗します。`waitForNavigation()` は独自の操作を実行して
次のページを待ちます。

**PC とスマートフォン**

`pc` (1280x1024) と `mobile` (390x844、Chrome のモバイルエミュレーションと iPhone の
User-Agent) の 2 つのデバイスが設定されています。デバイスごとに別のブラウザーで、Cookie も
別々です。スマートフォンで操作するにはヘルパーの最後の引数に `$this->mobile()` を渡し、
追加したデバイスを使うには `$this->client('tablet')` のように渡します。
`assertNoHorizontalOverflow()` は、ページが画面より広い場合に失敗します。デバイスの変更や
追加は `devices` オプションで行います。

**ウィンドウと Cookie**

```php
$original = $this->waitForNewWindow(fn() => $this->click('#privacy-policy-link'));
$this->assertSeeText('Privacy policy'); // 新しいウィンドウで
$this->closeOtherWindows(null, $original);

$this->assertCookieIsSet('CAKEPHP'); // セッションの Cookie
$this->deleteCookie('remember_me');
$this->assertCookieNotSet('remember_me');
```

`CookieComponent` が書き込んだ値は、実際のユーザーの場合と同じく、ブラウザーでは暗号化されています。

<a id="your-own-base-class"></a>

### 独自の基底クラス

ログインなどのアプリケーション固有のヘルパーは、E2E テスト用の基底クラスにまとめてください。
フォームからログインすると、ユーザーと同じ操作をテストでき、セッションの保存方法にも依存しません。

```php
<?php
// tests/E2E/AppE2ETestCase.php

use Pieceofcake2\E2ETest\TestSuite\E2ETestCase;
use Symfony\Component\Panther\Client;
use Symfony\Component\Panther\DomCrawler\Crawler;

abstract class AppE2ETestCase extends E2ETestCase
{
    /**
     * Tables every page needs
     *
     * @var array<string>
     */
    public $fixtures = ['app.user'];

    /**
     * Logs in through the login form, like a user does.
     *
     * @param string $email Email address
     * @param string $password Password
     * @param \Symfony\Component\Panther\Client|null $client Browser
     * @return \Symfony\Component\Panther\DomCrawler\Crawler The page after logging in
     */
    protected function login(
        string $email = 'admin@example.com',
        string $password = 'password',
        ?Client $client = null,
    ): Crawler {
        $this->visit('/users/login', $client);

        return $this->submitForm('Log in', [
            'data[User][email]' => $email,
            'data[User][password]' => $password,
        ], $client);
    }
}
```

PHPUnit が読み込むのは名前が `Test.php` で終わるファイルだけなので、基底クラスは
`tests/E2E/bootstrap.php` で require するか、`composer.json` の `autoload-dev` の
classmap に `tests/E2E/` を追加してください。

各テストの前に、起動済みのブラウザーはそれぞれ余分なウィンドウを閉じ、Cookie、`localStorage`、
`sessionStorage` を削除します。そのため、どのテストもログアウトした状態で始まります。Cookie を
削除するために、ブラウザーは最初にアプリケーションの `/favicon.ico` を開きます。アプリケーションに
`favicon.ico` がない場合は、`resetPath` オプションにほかの静的ファイルを指定してください。

<a id="failure-screenshots-and-html"></a>

## 失敗時のスクリーンショットと HTML

テストが失敗またはエラーになると、起動済みのブラウザーごとに次のファイルが保存されます。

| ファイル | 内容 |
| --- | --- |
| `<Class>-<test>-pc.png` | 表示領域のスクリーンショット |
| `<Class>-<test>-pc.html` | HTML (DOM)。1 行目は URL |
| `<Class>-<test>-mobile.png` / `.html` | スマートフォンのブラウザーを起動していた場合は、その同じファイル |
| `<Class>-<test>-logs.txt` | サーバーの各ログの末尾: リクエストと PHP のエラー、`error.log`、`debug.log` |

保存先は `artifactsDir` のディレクトリです。デフォルトは `tmp/e2e-artifacts/`、上の
ブートストラップの例では `tests/E2E/artifacts/` で、環境変数 `E2E_ARTIFACTS_DIR` でも
指定できます。元の失敗は必ず報告されます。

![お問い合わせフォームのテストが失敗したときに保存されたスクリーンショット](/e2e-failure-screenshot.png)

これらのファイルにはテストデータのページとログが含まれるので、テストデータには架空のものを
使ってください。`onNotSuccessfulTest()` をオーバーライドする場合は、親クラスのメソッドを
呼び出してください。

<a id="running-the-tests"></a>

## テストの実行

```bash
# すべての E2E テスト
vendor/bin/phpunit -c phpunit.e2e.xml.dist

# 1 つのテストケース
vendor/bin/phpunit -c phpunit.e2e.xml.dist --filter ContactFormTest

# ブラウザーの動きを見る
PANTHER_NO_HEADLESS=1 vendor/bin/phpunit -c phpunit.e2e.xml.dist --filter testSend
```

ブラウザーはデフォルトでヘッドレスで動きます。`PANTHER_NO_HEADLESS=1` を指定するとウィンドウが
表示されるので、テストを書くときやデバッグするときに便利です。環境変数は設定より優先されるので、
開発者や CI はファイルを編集せずにポートやバイナリを変更できます。

| 環境変数 | 説明 |
| --- | --- |
| `E2E_PORT` | アプリケーションのサーバーのポート (デフォルト: 空いているポート) |
| `E2E_KEEP_TMP` | `1` で実行後もサーバーの一時ディレクトリ (ログ、セッション) を残す |
| `E2E_ARTIFACTS_DIR` | 失敗時のスクリーンショット、HTML、ログの保存先 |
| `E2E_WAIT_TIMEOUT` | ヘルパーがページや要素を待つ秒数 (デフォルト `10`) |
| `PANTHER_CHROME_DRIVER_BINARY`、`PANTHER_CHROME_BINARY` | chromedriver と Chrome のパス |
| `PANTHER_NO_HEADLESS` | `1` でブラウザーのウィンドウを表示する |
| `PANTHER_NO_SANDBOX` | `1` で `--no-sandbox` を追加する (root で動くコンテナー) |

<a id="continuous-integration"></a>

## 継続的インテグレーション

GitHub Actions では、データベースのサービスと、chromedriver とバージョンの合った Chrome を用意した
専用のジョブで E2E テストを実行し、ジョブが失敗したら失敗時のファイルをアップロードします。
主なステップは次のとおりです。

```yaml
    steps:
      # ... checkout, setup-php, composer install

      - name: Setup Chrome
        id: setup-chrome
        uses: browser-actions/setup-chrome@v2
        with:
          chrome-version: stable
          install-chromedriver: true

      - name: Run E2E tests
        env:
          PANTHER_CHROME_BINARY: ${{ steps.setup-chrome.outputs.chrome-path }}
          PANTHER_CHROME_DRIVER_BINARY: ${{ steps.setup-chrome.outputs.chromedriver-path }}
          PANTHER_NO_SANDBOX: 1
        run: vendor/bin/phpunit -c phpunit.e2e.xml.dist

      - name: Upload E2E artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v7
        with:
          name: e2e-artifacts
          path: tests/E2E/artifacts/
          retention-days: 7
          if-no-files-found: ignore
```

[ワークフローの全体](https://github.com/pieceofcake2/e2e-test/blob/1.x/docs/examples/e2e.yml) では、
テスト用データベースとして MySQL も用意しています。ビルドで CSS や JavaScript のファイルを生成する
場合は、E2E のステップの前にビルドしてください。スタイルシートがない場合は
`assertStylesheetsLoaded()` が失敗します。

<a id="tips"></a>

## ヒント

- **テスト用データベース**: テスト専用のデータベースを使い、[テスト用データベース](#the-test-database)
  のようにサーバーに渡してください。
- **メール**: サーバーでは `Debug` トランスポートを使い、[メール](#mail) のようにログを読んでください。
- **分離された tmp と logs**: サーバーはキャッシュ、ログ、セッションを専用の一時ディレクトリに
  書き込みます。`E2E_KEEP_TMP=1` を指定すると実行後も残り、
  `Environment::server()->tmpDir()` でそのパスを取得できます。
- **sleep を使わない**: `waitForText()`、`waitForElement()`、`waitUntil()` で結果を待ってください。
  遅い CI マシンでは、待機を追加するのではなく `E2E_WAIT_TIMEOUT` を増やしてください。
- **外部ホスト**: Chrome はアプリケーションのホストしか名前解決しないので、アクセス解析、広告、
  Web フォント、CDN は読み込まれず、テストが遅くなったり失敗したりしません。ページに必要なホストは
  `browser.allowedHosts` オプションに追加するか、テストではファイルをローカルから配信してください。
- **デバッグ出力**: サーバーにデバッグ用のフラグ (ブートストラップの例では `E2E_DEBUG=1`) を渡すと、
  `SecurityComponent` がリクエストをブラックホールに送った理由など、CakePHP のエラーページを
  確認できます。
- **アップロード**: ブラウザーからアップロードしたファイルはサーバーが保存します。テストでは
  アップロード先を一時ディレクトリにするか、`tearDown()` でファイルを削除してください。

<a id="troubleshooting"></a>

## トラブルシューティング

**"This version of ChromeDriver only supports Chrome version N"**: chromedriver と Chrome の
メジャーバージョンが異なります。`vendor/bin/bdi detect drivers` をもう一度実行するか、
`PANTHER_CHROME_BINARY` に対応する Chrome を指定してください。

**Docker や CI で Chrome が起動時にクラッシュする** (`session not created`、
`DevToolsActivePort file doesn't exist`): `PANTHER_NO_SANDBOX=1` を設定してください。

**すべてのページがエラーになる、または "Missing database table"**: サーバーがテスト用データベースを
使っていないか、`$fixtures` にテーブルが足りません。`server.env` を確認し、失敗時のファイルの
保存先にある `<test>-logs.txt` を読んでください。

**リクエストのたびにログアウトする**: サーバーは HTTP で動くため、ブラウザーは secure 属性付きの
セッション Cookie を破棄します。`Secure` 属性を設定で切り替えられるようにし、E2E 用のサーバーでは
無効にしてください。Cookie の `domain` や `App.fullBaseUrl` が `127.0.0.1:<port>` と異なる場合も
同じことが起こります。サーバーは自身の URL を環境変数 `E2E_BASE_URL` で渡します。

**フォームがブラックホールに送られる**: フォームと `SecurityComponent` のトークンが一致していません。
たとえば JavaScript で追加したフィールドのロックが解除されていない場合です。サーバーでデバッグを
有効にすると理由がわかります。E2E テストのためにコンポーネントを無効にしないでください。こうした
誤りを見つけることが E2E テストを書く理由の 1 つです。

**ページにあるのにテキストが見つからない**: `assertSeeText()` は、CSS の `text-transform` を
適用した後の、表示されているテキストだけを見ます。スクリーンショットと比べるか、マークアップには
`assertResponseContains()` を使ってください。

そのほかの問題については、パッケージのドキュメントの
[トラブルシューティング](https://pieceofcake2.github.io/e2e-test/#troubleshooting) (英語)
を参照してください。

<a id="api-reference"></a>

## API リファレンス

[パッケージのドキュメント](https://pieceofcake2.github.io/e2e-test/) (英語) では、
すべての設定オプション、`E2ETestCase` と `BrowserTestTrait` のすべてのヘルパーとアサーション、
`Environment`、`Server`、`ChromeClientFactory`、`E2EExtension` の各クラスを説明しています。
`BrowserTestTrait` は、フィクスチャが不要なテストのために通常の PHPUnit の `TestCase` でも使えます。
ブラウザーのオブジェクトは Panther のクライアントなので、Panther と php-webdriver の機能も
すべて使えます。
