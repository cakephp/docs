# テスト

CakePHP にはテストのための包括的なフレームワークが組み込まれています。CakePHP は
[PHPUnit](https://phpunit.de) と統合されています。PHPUnit が提供する機能に加えて、
CakePHP はテストをより簡単にする機能を提供します。このセクションでは PHPUnit のインストールから
ユニットテストのはじめ方、そして、CakePHP が提供する拡張機能について説明します。

<a id="types-of-tests"></a>

## テストの種類

CakePHP アプリケーションのテストは、通常次のレベルで行います。

- **ユニットテスト** は、モデル、コンポーネント、ヘルパー、ライブラリクラスなど 1 つのクラスを
  PHPUnit のプロセス内でテストします。[フィクスチャ](#fixtures) でテスト用データベースに
  既知のデータを用意します。テストの大部分はユニットテストにするのがよいでしょう。
  実行が速く、壊れたコードの場所がすぐにわかります。
- **コントローラーのテスト** は、`ControllerTestCase::testAction()` を使って
  HTTP サーバーを使わずに PHPUnit のプロセス内でコントローラーにリクエストを送り、
  戻り値、ビュー変数、描画されたビュー、リダイレクト先を確認します。こちらも数ミリ秒で実行できます。
  [コントローラーのテスト](#testing-controllers) を参照してください。
- **統合テスト** は、CakePHP 5 からのバックポートである `IntegrationTestTrait` を使い、本物の
  ディスパッチャーを通して本物のコントローラーとコンポーネントにリクエストを送り、レスポンス、
  セッション、Cookie、フラッシュメッセージ、送信されたメールを確認します。こちらも HTTP サーバーを
  使わずに PHPUnit のプロセス内で実行します。[統合テスト](/ja/development/integration-testing) を
  参照してください。
- **ブラウザーによる E2E (エンドツーエンド) テスト** は、Web サーバーでアプリケーションを起動し、
  本物のブラウザーで操作します。JavaScript、Cookie、セッション、`SecurityComponent` の
  トークンも含めて確認できます。実行に時間がかかるため、主要な操作の流れに絞って使います。
  [E2E テスト](/ja/development/e2e-testing) を参照してください。

`ControllerTestCase` と `testAction()` は引き続きサポートされています。新しくコントローラーのテストを
書くときは、通常は統合テストのほうが適しています。モックが少なくて済み、`SecurityComponent` の
トークン、リダイレクト、エラーページを本番と同じようにテストできるためです。

このページではユニットテストとコントローラーのテストについて説明します。

## PHPUnit のインストール

CakePHP のテストフレームワークは、PHPUnit を基礎としています。PHPUnit は PHP の
ユニットテストにおいてデファクトスタンダードとなっています。それはあなたが思い通りのコードを
確実に書くための、深遠で強力な機能を提供します。

CakePHP 2 のテストには PHPUnit 9.6 を使います。`composer.json` があるディレクトリで
次のコマンドを実行し、開発用の依存パッケージとしてインストールしてください。

``` bash
composer require --dev phpunit/phpunit:^9.6
```

[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンでは `require-dev` に
`phpunit/phpunit` が含まれているので、`composer install` を実行するだけで済みます。
PHPUnit は CakePHP と同じく Composer のオートローダーで読み込まれ、`phpunit` コマンドは
`vendor/bin/phpunit` にインストールされます。

::: pieceofcake2
Piece of Cake 2 フォークでは、PHPUnit 3.7 (または 4.x/5.x) ではなく PHPUnit 9.6 でテストを
実行します。`setUp()` などのライフサイクルメソッドには戻り値の型 `: void` が必要です。
また `PHPUnit_Framework_TestCase`、`staticExpects()`、`assertInternalType()`、
`@expectedException` アノテーションなど、PHPUnit から削除された API は使えません。
[PHPUnit 9.6 への移行](/ja/appendices/phpunit-9-migration-hints) を参照してください。
:::

<a id="test-database-setup"></a>

## テスト用データベースのセットアップ

テストを実行する前に、 `config/core.php` のデバッグレベルを必ず 1 以上にしておきましょう。
デバッグレベルが 0 のとき、テストライブラリはウェブランナーからアクセスすることができません。
テストを実行する前には、必ず `config/database.php` に `$test` のデータベース設定を
追加しましょう。この設定は CakePHP のフィクスチャテーブルやデータで使われます。

``` php
public $test = [
    'datasource' => 'Database/Mysql',
    'persistent' => false,
    'host' => 'dbhost',
    'login' => 'dblogin',
    'password' => 'dbpassword',
    'database' => 'test_database',
];
```

レガシーな `app/` 構成では、これらのファイルは `app/Config/core.php` と
`app/Config/database.php` です。

> [!NOTE]
> テストデータベースは実際のデータベースとは別のデータベースを作成することをお勧めします。
> 後々に起こりうる厄介な失敗を防ぐことができます。

## テストが実行できるか確認する

PHPUnit のインストールと `$test` データベースの設定が済んだら、プロジェクトのルートで
PHPUnit を実行してみましょう。

``` bash
vendor/bin/phpunit
```

PHPUnit はプロジェクトルートの `phpunit.xml.dist` を読み込みます
([テストの実行](#running-tests) を参照してください)。PHPUnit がエラーなく起動して終了すれば、
セットアップはできています。まだテストを書いていなければ、実行されたテストがないと表示されるだけです。

おめでとうございます！テストを書く準備が整いました！

<a id="test-case-conventions"></a>

## テストケースの規約

CakePHP におけるほとんどのことがそうであるように、テストケースにもいくつか規約があります。
規約は以下のとおりです。

1.  テストを含む PHP ファイルは、 `tests/TestCase/[Type]` というディレクトリに置きます。
2.  ファイル名の最後は必ずただ .php とだけ書くのではなく `Test.php` とします。
3.  テストを含むクラスは必ず `CakeTestCase` または `ControllerTestCase` 、
    `PHPUnit\Framework\TestCase` を継承します。
4.  他のクラスと同じく、テストケースのクラスを書いたファイル名もクラス名と同じにします。たとえば、
    `RouterTest.php` は `class RouterTest extends CakeTestCase`
    を含んでいなければなりません。
5.  テストを含むメソッド (つまりアサーションを含むメソッド) はいずれも `testPublished()`
    といったように `test` で始まる名前にします。 `@test` というアノテーションをメソッドに
    マークすることでテストメソッドとすることもできます。

テストケースはプロジェクトルートの `tests/TestCase` に、フィクスチャは `tests/Fixture` に置きます。
CakePHP は `tests/` ディレクトリがあればそれを使い、無ければレガシー構成の `app/Test/Case` と
`app/Test/Fixture` を使います。両方の構成については
[CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure) を参照してください。

テストケースを作成したら、コマンドラインから PHPUnit または test シェルで実行できます。

``` bash
vendor/bin/phpunit tests/TestCase/Model/PostTest.php
bin/cake test app Model/Post
```

この例では、Post モデルをテストしています。

## 最初のテストケースを作成する

一例として、非常に簡単なヘルパーメソッドのためのテストケースを作成します。
これからテストのために作成するメソッドは HTML でプログレスバーを作成します。
おおよそこのような感じです。

``` php
// src/View/Helper/ProgressHelper.php
class ProgressHelper extends AppHelper
{
    public function bar($value)
    {
        $width = round($value / 100, 2) * 100;

        return sprintf(
            '<div class="progress-container">
                <div class="progress-bar" style="width: %s%%"></div>
            </div>',
            $width,
        );
    }
}
```

非常に簡単な例ですが、シンプルなテストケースを作成する方法をお見せするのに役立つことでしょう。
ヘルパーを作成し、保存したら、 `tests/TestCase/View/Helper/ProgressHelperTest.php`
にテストケースのファイルを作成します。このファイルにまず、以下のように書き込みます。

``` php
// tests/TestCase/View/Helper/ProgressHelperTest.php
App::uses('ProgressHelper', 'View/Helper');

class ProgressHelperTest extends CakeTestCase
{
    public $Progress;

    public function setUp(): void
    {
    }

    public function testBar()
    {
    }
}
```

`Controller` や `View` といった CakePHP 自体のクラスは Composer のオートローダーで
読み込まれるので、`App::uses()` が必要なのはアプリケーションのクラスだけです。

ここからすぐに中身を増やしていきます。まずはメソッドを2つ加えました。
ひとつは `setUp()` です。このメソッドはこのテストケースクラスのテストメソッドが
呼び出される前に毎回呼び出されます。セットアップメソッドはテストに必要なオブジェクトの
初期化や設定を行います。PHPUnit 9 の決まりにより、`setUp()` は戻り値の型 `void` を
付けて宣言する必要があります。今回のセットアップメソッドには次のように書き加えます。

``` php
public function setUp(): void
{
    parent::setUp();
    $Controller = new Controller();
    $View = new View($Controller);
    $this->Progress = new ProgressHelper($View);
}
```

テストケースで親クラスのメソッドを呼ぶことは重要です。 `CakeTestCase::setUp()`
は `Configure` の値をバックアップしたり、 `App` のパスを保存したりといった
いくつかの作業をしているからです。

次に、テストメソッドの内容を充実させていきます。あなたの書いたコードが期待した結果を
出力するかどうか保証するため、アサーションを使います。

``` php
public function testBar()
{
    $result = $this->Progress->bar(90);
    $this->assertStringContainsString('width: 90%', $result);
    $this->assertStringContainsString('progress-bar', $result);

    $result = $this->Progress->bar(33.3333333);
    $this->assertStringContainsString('width: 33%', $result);
}
```

上記のテストはシンプルですが、テストケースを使うことによる利益の可能性を示しています。
このコードでは `assertStringContainsString()` を使うことで、ヘルパーが返した値に、
期待した文字列が含まれていることを保証しています。もし期待した文字列が含まれていなければ
テストは失敗し、コードが正しくないことがわかります。PHPUnit 9 の `assertContains()` は
配列などの iterable しか受け付けないため、文字列には `assertStringContainsString()` か
CakePHP の `assertTextContains()` を使ってください。

テストケースを使うことにより、 あなたは既知の入力セットと期待される出力結果との関係を
簡単に記述することができます。これにより、あなたの書いたコードが期待した動作を満たしているかどうか
簡単に確かめることができます。あなたはより自信を持ってコードを書くことができるようになる
手助けをしてくれます。
くわえて、テストはコードなので、変更を加えたときに再度実行することが容易となります。
これは新たなバグの生成を防ぐ手助けをしてくれるでしょう。

<a id="running-tests"></a>

## テストの実行

PHPUnit をインストールし、テストケースをいくつか書いたら、テストを何度も何度も実行したくなるでしょう。
何らかの変更をコミットする前に、テストを実行することで何も壊していないか確認することはとてもいい考えです。

テストはコマンドラインから実行することをお勧めします。
[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンのプロジェクトルートには、
CakePHP 用に PHPUnit を設定する `phpunit.xml.dist` があります。

``` xml
<phpunit bootstrap="./tests/bootstrap.php"
         backupGlobals="true"
         stderr="true"
         colors="true">
    <listeners>
        <listener class="CakeFixtureInjector" file="./vendor/pieceofcake2/cakephp/src/Cake/TestSuite/Fixture/CakeFixtureInjector.php"/>
    </listeners>
    <testsuites>
        <testsuite name="All Tests">
            <directory>./tests/TestCase/</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

`bootstrap` に指定した `tests/bootstrap.php` は、アプリケーションのパスを定義して
CakePHP を読み込みます。`CakeFixtureInjector` リスナーはテストごとに
[フィクスチャ](#fixtures) を作成・削除します。このリスナーが登録されていないと
フィクスチャは使えません。`stderr="true"` はセッションを使うテストを動かすための設定です
([セッションを利用するテストの実行](#running-tests-that-use-sessions) を参照してください)。
プロジェクトにこのファイルがまだ無ければ、スケルトンからコピーしてください。

<a id="run-tests-from-command-line"></a>

### コマンドラインからのテスト実行

プロジェクトのルートで PHPUnit を実行します。引数を付けなければ `tests/TestCase/` の
すべてのテストを実行します。ディレクトリやファイルを指定することもできます。

``` bash
# すべてのテストを実行する
vendor/bin/phpunit

# ディレクトリ内のテストを実行する
vendor/bin/phpunit tests/TestCase/Model

# ひとつのテストケースを実行する
vendor/bin/phpunit tests/TestCase/Model/ArticleTest.php
```

CakePHP はテストを実行するための `test` シェルも提供しています。test シェルを使うことで
アプリやコア、プラグインのテストを実行できます。また、コマンドラインから通常どおり PHPUnit を
使う際に利用できる引数をすべて使うことができます。PHPUnit が `phpunit.xml.dist` を
見つけられるよう、プロジェクトのルートから実行してください。

``` bash
# アプリのモデルのテストを実行する
bin/cake test app Model/Article

# プラグインのコンポーネントのテストを実行する
bin/cake test DebugKit Controller/Component/ToolbarComponent

# CakePHP の Configure クラスのテストを実行する
bin/cake test core Core/Configure
```

テストケースは `tests/TestCase/` (プラグインの場合はプラグインの `tests/TestCase/` か
`Test/Case/`) からの相対パスで、末尾の `Test.php` を除いて指定します。
レガシーな `app/` 構成では、`bin/cake` の代わりにプロジェクトルートから `vendor/bin/cake` を、
または `app` ディレクトリから `Console/cake` を使います。

> [!NOTE]
> セッションと相互作用するテストを実行するときは、基本的に `--stderr` オプションを使うように
> するとうまくいきます。これにより、 *headers_sent warning* によってテストが失敗する問題が
> 解決するでしょう。スケルトンの `phpunit.xml.dist` では `stderr="true"` が設定済みです。

::: info Changed in version 2.1
`test` シェルは 2.1 で追加されました。2.0 の `testsuite` シェルは現在も利用できますが、 こちらを使うことをおすすめします。
:::

`bin/cake test app` のようにカテゴリーだけを指定して `test` シェルを実行すると、
利用できるテストケースの一覧が表示され、実行するテストを選ぶことができます。
一覧には、アプリケーションまたはプラグインの `tests/TestCase/` にあるテストケースが表示されます。
`tests/TestCase/` が無い場合は、レガシー構成の `Test/Case/` ディレクトリから探します。

#### テストケースのフィルタリング

たくさんのテストケースがあると、その中からサブセットだけをテストしたいときや、失敗したテストだけを
実行したいときがあると思います。コマンドラインからテストメソッドをフィルタリングするときは
以下のようにします。

``` bash
vendor/bin/phpunit tests/TestCase/Model/ArticleTest.php --filter testPublished
bin/cake test core Console/ConsoleOutput --filter testWriteArray
```

実行したいテストメソッドは、大文字小文字を区別する正規表現を使ってフィルタリングすることができます。

<a id="generating-code-coverage"></a>

#### コードカバレッジの生成

コマンドラインから PHPUnit に組み込まれたコードカバレッジツールを用いて、コードカバレッジの
レポートを生成することができます。コードカバレッジには [Xdebug](https://xdebug.org)
(coverage モード) か [PCOV](https://github.com/krakjoe/pcov) 拡張が必要です。
PHPUnit はカバレッジの結果を含む静的な HTML ファイルをいくつか生成します。
テストケースのカバレッジを生成するには以下のようにします。

``` bash
vendor/bin/phpunit tests/TestCase/Model/ArticleTest.php --coverage-html tmp/coverage
bin/cake test app Model/Article --coverage-html tmp/coverage
```

カバレッジの結果は `tmp/coverage` ディレクトリに出力されます。
ブラウザで `tmp/coverage/index.html` を開くと結果を確認できます。
スケルトンの `phpunit.xml.dist` では、カバレッジの対象を `src/` 内のファイルに限定しています。

<a id="running-tests-that-use-sessions"></a>

#### セッションを利用するテストの実行

コマンドラインからセッションを利用するテストを実行するときは、 `--stderr` フラグを付ける
(または `phpunit.xml.dist` で `stderr="true"` を設定する) 必要があります。
そうしないと、セッションが動作しない原因となります。
PHPUnit はデフォルトでは標準出力にテストの進行状況を出力しますが、
これによって PHP はヘッダが送信されたと認識するため、セッションの開始が妨害されます。
PHPUnit の出力先を標準エラーに切り替えることで、この問題を避けることができます。

### ブラウザからテストを実行する

CakePHP はテストを実行するためのウェブベースのインタフェースも提供しており、ブラウザを通して
テストを実行することができます。ウェブランナーは `index.php` と同じ階層にある
`webroot/test.php` で、[pieceofcake2/app](https://pieceofcake2.github.io/app/)
スケルトンに含まれています。`http://localhost/your_app/test.php` からアクセスできます。
デバッグレベルが 1 以上のときだけ利用できます。

テストランナーを起動したら、あなたのアプリとコア、プラグインのテストスイートを実行できます。
それぞれのリンクをクリックするとテストケースを実行し、結果を表示します。
テストケースの一覧は `test` シェルと同じディレクトリから作られます。
`http://localhost/your_app/test.php?case=Model/Article` のように
URL でテストケースを指定して実行することもできます。

ウェブランナーは主に互換性のために残されています。`phpunit.xml.dist` の設定が使われ、
CI でも使われるコマンドラインでの実行をお勧めします。

#### コードカバレッジの確認

[Xdebug](https://xdebug.org) をインストールしてあればコードカバレッジの結果を見ることができます。
コードカバレッジはあなたの書いたテストが網羅していないコードの部分があるか知るために有用です。
また、将来テストを追加するべきか決定するときにも有用ですし、テストの進捗率を計測する
指標のひとつとしても一役買ってくれます。

![Code Coverage](/code-coverage.png)

インラインコードカバレッジでは緑色の行は実行したことを示しています。緑色の行にポインタを置くと、
どのテストがカバーしているか示してくれます。実行されなかった行は赤で示されます。これはテストが
うまく働かなかったことを示します。
グレーの行は Xdebug によって実行できないと考えられた行です。

## テストケースのライフサイクルコールバック

テストケースは以下のようにいくつかのライフサイクルコールバックを持っており、
テストの際に使うことができます。

- `setUp` はテストメソッドの前に毎回呼ばれます。 テストされるオブジェクトの生成や、テストのための
  データの初期化に使われるべきです。 `parent::setUp()` を呼び出すのを忘れてはいけません。
- `tearDown` はテストメソッドの後に毎回呼ばれます。テストが完了した後のクリーンアップに
  使われるべきです。 `parent::tearDown()` を忘れてはいけません。
- `setUpBeforeClass` はクラスのテストメソッドを実行する前に一度だけ呼ばれます。このメソッドは
  *static* でなければなりません。
- `tearDownAfterClass` はクラスのテストメソッドをすべて実行した後に一度だけ呼ばれます。
  このメソッドは *static* でなければなりません。

PHPUnit 9 ではこれらのメソッドは戻り値の型 `void` 付きで宣言されています。オーバーライドする側も
同じ型を宣言しないと、PHP の Fatal error になります。

``` php
public function setUp(): void
public function tearDown(): void
public static function setUpBeforeClass(): void
public static function tearDownAfterClass(): void
```

<a id="fixtures"></a>

## フィクスチャ

テストコードの挙動がデータベースやモデルに依存するとき、テストに使うためのテーブルを生成し、
一時的なデータをロードするために **フィクスチャ** を使うことができます。フィクスチャを使うことにより、
実際のアプリケーションに使われているデータに惑わされることなくテストができるというメリットがあります。
加えて、アプリケーションのためのコンテンツを実際に用意するより先にコードをテストすることができます。

このとき、CakePHP は設定ファイル `config/database.php` にある `$test` という名前の
データベース接続設定を使います。この接続が使えないときは例外が発生し、フィクスチャを使うことができません。

CakePHP はフィクスチャに基づいたテストケースを実行するにあたり、以下の動作をします。

1.  各フィクスチャで必要なテーブルを作成する
2.  フィクスチャにデータが存在すれば、それをテーブルに投入する
3.  テストメソッドを実行する
4.  フィクスチャのテーブルを空にする
5.  データベースからフィクスチャが作成していたテーブルを削除する

これらの処理は `CakeFixtureInjector` リスナーが行います。[テストの実行](#running-tests)
で示したように、このリスナーを `phpunit.xml.dist` に登録しておく必要があります。

### フィクスチャの作成

フィクスチャを作成するときは主にふたつのことを定義します。ひとつはどのようなフィールドを持った
テーブルを作成するか、もうひとつは初期状態でどのようなレコードをテーブルに配置するかです。
それでは最初のフィクスチャを作成してみましょう。この例では Article モデルのフィクスチャを作成します。
`tests/Fixture` というディレクトリに `ArticleFixture.php` という名前のファイルを作成し、
以下のとおりに記述してください。

``` php
// tests/Fixture/ArticleFixture.php
class ArticleFixture extends CakeTestFixture
{
    // 任意。
    // 異なるテスト用データソースにフィクスチャを読み込む時にこのプロパティを指定してください。
    public $useDbConfig = 'test';
    public $fields = [
        'id' => ['type' => 'integer', 'key' => 'primary'],
        'title' => [
            'type' => 'string',
            'length' => 255,
            'null' => false,
        ],
        'body' => 'text',
        'published' => [
            'type' => 'integer',
            'default' => '0',
            'null' => false,
        ],
        'created' => 'datetime',
        'updated' => 'datetime',
    ];
    public $records = [
        [
            'id' => 1,
            'title' => 'First Article',
            'body' => 'First Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:39:23',
            'updated' => '2007-03-18 10:41:31',
        ],
        [
            'id' => 2,
            'title' => 'Second Article',
            'body' => 'Second Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:41:23',
            'updated' => '2007-03-18 10:43:31',
        ],
        [
            'id' => 3,
            'title' => 'Third Article',
            'body' => 'Third Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:43:23',
            'updated' => '2007-03-18 10:45:31',
        ],
    ];
}
```

`$useDbConfig` プロパティはフィクスチャが使うデータソースの定義をします。
複数のデータソースを使うときは、モデルのデータソースと合わせてフィクスチャを
作るようにします。ただし、 `test_` というプレフィックスをつけてください。
たとえば、 `mydb` というデータソースを使うモデルの場合は、フィクスチャの
データソースを `test_mydb` とします。もし `test_mydb` の接続が
存在しなかったときは、モデルはデフォルトの `test` データソースを使います。
テストを実行するときにアプリケーションのデータを誤って消してしまう可能性を減らすため、
フィクスチャのデータソースには `test` の接頭辞が必ず付きます。

`$fields` ではテーブルを構成するフィールドと、その定義を記述します。
フィールドの定義には `CakeSchema` と同じ書式を使います。
テーブルの定義で特に重要な変数を以下に示します。

`type`  
CakePHP の内部型定義です。現在サポートしているのは以下の型です  
- `string`: `VARCHAR` と対応
- `text`: `TEXT` と対応
- `biginteger`: `BIGINT` と対応
- `smallinteger`: `SMALLINT` と対応
- `tinyinteger`: データベースプラットフォームに応じて `TINYINT` または
  `SMALLINT` と対応
- `integer`: `INT` と対応
- `float`: `FLOAT` と対応
- `decimal`: `DECIMAL` と対応
- `datetime`: `DATETIME` と対応
- `timestamp`: `TIMESTAMP` と対応
- `time`: `TIME` と対応
- `date`: `DATE` と対応
- `binary`: `BLOB` と対応
- `boolean`: `BOOLEAN` (または MySQL の `TINYINT(1)`) と対応

`key`  
`primary` を設定するとフィールドに *field AUTO_INCREMENT* と *PRIMARY KEY* が適用されます。

`length`  
フィールドが許容するサイズを設定します。

`null`  
`true` ( *NULL* を許容する)または `false` ( *NULL* を許容しない)のいずれかを設定します。

`default`  
フィールドの規定値を設定します。

フィクスチャのテーブルを作成してから、そのテーブルに投入するレコードを定義することができます。
`$records` はレコードの配列であり、データの書式もとても簡単です。
`$records` の各アイテムはひとつの行を表し、カラム名と値の連想配列で構成されます。
\$records の持つ配列は各要素 **ごとに** `$fields` で指定した特定のキーを
持たなければならないことを覚えておいてください。あるフィールドの値を `null` と
したいときは、そのキーの値を `null` とします。

### 動的データとフィクスチャ

レコードのフィクスチャをクラスプロパティとして定義すると、関数を使ったり、フィクスチャの定義に
他の動的なデータを使用することは易しいものではありません。
解決策として、 `$records` をフィクスチャクラスの関数 init() で定義するという方法があります。
たとえば、「created」と「updated」のタイムスタンプに今日の日付を反映させたいのであれば、
以下のようにするとよいでしょう。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $fields = [
        'id' => ['type' => 'integer', 'key' => 'primary'],
        'title' => ['type' => 'string', 'length' => 255, 'null' => false],
        'body' => 'text',
        'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
        'created' => 'datetime',
        'updated' => 'datetime',
    ];

    public function init()
    {
        $this->records = [
            [
                'id' => 1,
                'title' => 'First Article',
                'body' => 'First Article Body',
                'published' => '1',
                'created' => date('Y-m-d H:i:s'),
                'updated' => date('Y-m-d H:i:s'),
            ],
        ];
        parent::init();
    }
}
```

`init()` をオーバーライドするときは `parent::init()` を呼び出すのを忘れないようにしましょう。

> [!NOTE]
> 2.x のフィクスチャは、外部キー制約を処理しないことに注意してください。

### テーブル情報とレコードのインポート

アプリケーションに動作するモデルがあり、モデルが扱うテーブルに実際のデータがある場合、
そのデータとモデルをテストに使いたいと思うことがあるでしょう。
しかし、そのためにわざわざテーブルとフィクスチャの定義をすることは
二重の努力となってしまうでしょう。幸いにも CakePHP には、既存のモデルとテーブルから
特定のフィクスチャのテーブルとレコードを定義する方法があります。

例を見てみましょう。アプリケーション中に「Article」という名前のモデルがあり、
それが「articles」というテーブルにマップされているとします。前節で作成した
例のフィクスチャ (`tests/Fixture/ArticleFixture.php`) を、
次のように書き換えてください。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = 'Article';
}
```

この構文は、「Article」モデルにリンクしたテーブルから、テーブル定義を読み込むよう
統合テストツール (test suite) に伝えます。モデルは、アプリケーションに存在する全てのものを扱えます。
上記の構文では「Article」のスキーマを読み込むだけなのでレコードを読み込みません。読み込むためには
コードを次のように変更してください。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = ['model' => 'Article', 'records' => true];
}
```

一方、モデルが存在しないテーブルの場合はどうするのでしょうか。その場合、代わりにテーブルの情報を
読み込むよう定義することができます。例は次の通りです。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = ['table' => 'articles'];
}
```

この例では「articles」というテーブルから定義をインポートします。このとき CakePHP は
「default」という名前のデータベース接続設定を使います。これを変更したい場合は
次のように書き換えます。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = ['table' => 'articles', 'connection' => 'other'];
}
```

CakePHP のデータベース接続においてテーブル名のプレフィックスが指定されていたら、テーブル情報を
取得するときにそのプレフィックスは自動的に使用されます。また、前述したふたつの例において、
レコードは読み込まれません。読み込むには、次のようにします。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = ['table' => 'articles', 'records' => true];
}
```

既存のテーブルやモデルからテーブルの定義をインポートすることができますが、前節で紹介したように
フィクスチャに対して読み込むレコードを直接定義することができます。方法は例のとおりです。

``` php
class ArticleFixture extends CakeTestFixture
{
    public $import = 'Article';
    public $records = [
        [
            'id' => 1,
            'title' => 'First Article',
            'body' => 'First Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:39:23',
            'updated' => '2007-03-18 10:41:31',
        ],
        [
            'id' => 2,
            'title' => 'Second Article',
            'body' => 'Second Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:41:23',
            'updated' => '2007-03-18 10:43:31',
        ],
        [
            'id' => 3,
            'title' => 'Third Article',
            'body' => 'Third Article Body',
            'published' => '1',
            'created' => '2007-03-18 10:43:23',
            'updated' => '2007-03-18 10:45:31',
        ],
    ];
}
```

### テストケースからのフィクスチャの読み込み

フィクスチャを作成したらそれらをテストで使いたくなることでしょう。
各テストケースではクエリの実行に際して必要となるモデルのフィクスチャをロードすることができます。
フィクスチャをロードするには、テストケースに `$fixtures` プロパティを設定します。

``` php
class ArticleTest extends CakeTestCase
{
    public $fixtures = ['app.article', 'app.comment'];
}
```

上記の例では、「Article」と「Comment」フィクスチャをアプリケーションの
`tests/Fixture` ディレクトリからロードします。同じように CakePHP のコアや
プラグインからもロードすることができます。

``` php
class ArticleTest extends CakeTestCase
{
    public $fixtures = ['plugin.debug_kit.article', 'core.comment'];
}
```

`core` のプレフィックスを使えば CakePHP から、プラグイン名をプレフィックスとして使えば
その名前のプラグインからフィクスチャをロードします。

フィクスチャのロードは `CakeTestCase::$autoFixtures` を
`false` に設定したあと、テストメソッドの中で
`CakeTestCase::loadFixtures()` を使って制御することもできます。

``` php
class ArticleTest extends CakeTestCase
{
    public $fixtures = ['app.article', 'app.comment'];
    public $autoFixtures = false;

    public function testMyFunction()
    {
        $this->loadFixtures('Article', 'Comment');
    }
}
```

2.5.0 から、サブディレクトリ中のフィクスチャをロードできます。複数ディレクトリを使用することは、
大規模なアプリケーションで、フィクスチャを整理しやすくします。サブディレクトリ中のフィクスチャを
ロードするためには、フィクスチャ名にサブディレクトリを加えてください。

``` php
class ArticleTest extends CakeTestCase
{
    public $fixtures = ['app.blog/article', 'app.blog/comment'];
}
```

上記の例では、両方のフィクスチャは、 `tests/Fixture/blog/` からロードされます。

::: info Changed in version 2.5
2.5.0 から、サブディレクトリ中のフィクスチャをロードできます。
:::

## モデルのテスト

まず `src/Model/Article.php` に「Article」モデルを定義しましょう。以下のように記述します。

``` php
// src/Model/Article.php
class Article extends AppModel
{
    public function published($fields = null)
    {
        $params = [
            'conditions' => [
                $this->name . '.published' => 1,
            ],
            'fields' => $fields,
        ];

        return $this->find('all', $params);
    }
}
```

このモデルの機能をテストするために、このモデルの定義とフィクスチャを使って
テストのセットアップを行います。CakePHP のテストスイートはテストの独立性を
確保するため、ごく最小限のファイルしかロードしません。
そこで、まずはモデルをロードするところからはじめなければなりません。
この場合、すでに定義した「Article」モデルのことを指します。

それでは `ArticleTest.php` というファイルを `tests/TestCase/Model`
というディレクトリに作成し、以下のように記述しましょう。

``` php
// tests/TestCase/Model/ArticleTest.php
App::uses('Article', 'Model');

class ArticleTest extends CakeTestCase
{
    public $fixtures = ['app.article'];
}
```

このテストケースでは `$fixtures` にこの章で今まで定義してきたフィクスチャを設定します。
クエリを実行するにあたり、必要なフィクスチャをすべてインクルードするのを忘れないでください。

> [!NOTE]
> `$useDbConfig` プロパティを指定することで、テストモデルの
> データベースをオーバーライドできます。テーブルが正しいデータベースで
> 生成されるように、関連するフィクスチャが同じ値を使うことを確認してください。

### テストメソッドの作成

それでは「Article」モデルの「published()」メソッドのためのテストメソッドを書き加えます。
`tests/TestCase/Model/ArticleTest.php` を編集して、以下のようにしてください。

``` php
// tests/TestCase/Model/ArticleTest.php
App::uses('Article', 'Model');

class ArticleTest extends CakeTestCase
{
    public $fixtures = ['app.article'];
    public $Article;

    public function setUp(): void
    {
        parent::setUp();
        $this->Article = ClassRegistry::init('Article');
    }

    public function testPublished()
    {
        $result = $this->Article->published(['id', 'title']);
        $expected = [
            ['Article' => ['id' => 1, 'title' => 'First Article']],
            ['Article' => ['id' => 2, 'title' => 'Second Article']],
            ['Article' => ['id' => 3, 'title' => 'Third Article']],
        ];

        $this->assertEquals($expected, $result);
    }
}
```

`testPublished()` というメソッドを追加したのがお分かりでしょう。
まず `Article` モデルのインスタンスを作成し、次に `published()` メソッドを実行します。
`$expected` には、初期状態でどのようなレコードが「articles」テーブルに投入されているかを
知っている上で、期待する値として適切なものを設定します。
実行結果と期待した値が同じであるかは `assertEquals` メソッドを使ってテストします。
[テストの実行](#running-tests) には、テストケースを実行するためのより詳しい情報があります。

> [!NOTE]
> テストのためにモデルをセットアップするときは、テスト用のデータベース接続を
> 使うようにするために必ず `ClassRegistry::init('YourModelName');`
> を使ってください。

### モデルのメソッドのモック化

テストを記述しているとき、モデルのモックメソッドが欲しくなるときがあるでしょう。
モデルのテストモックを作成するために `getMockForModel` を使いましょう。
このメソッドは、通常のモックで起こるリフレクションされたプロパティの問題を回避し、
モックがテスト用のデータベース接続を使うようにしてくれます。

``` php
public function testSendingEmails()
{
    $model = $this->getMockForModel('EmailVerification', ['send']);
    $model->expects($this->once())
        ->method('send')
        ->willReturn(true);

    $model->verifyEmail('test@example.com');
}
```

シグネチャは `getMockForModel($model, $methods = [], $config = [])` です。
`$methods` に指定したメソッドだけが置き換えられます。空の場合は、すべてのメソッドが
`null` を返すスタブに置き換えられます。

::: info Added in version 2.3
CakeTestCase::getMockForModel() は 2.3 で追加されました。
:::

### モックオブジェクトと例外のテスト

その他のクラスには PHPUnit 自体の API を使います。`createMock()` はクラスのすべてのメソッドを
置き換えます。`getMockBuilder()` を使うと、置き換えるメソッドやオブジェクトの生成方法を
指定できます。

``` php
public function testNotify()
{
    $transport = $this->createMock(MailTransport::class);
    $transport->expects($this->once())
        ->method('send')
        ->willReturn(['headers' => '', 'message' => '']);

    $request = $this->getMockBuilder(CakeRequest::class)
        ->onlyMethods(['is'])
        ->getMock();
    $request->method('is')->willReturn(true);

    // ...
}
```

既存のテストがそのまま動くよう、`CakeTestCase` には従来の
`getMock($originalClassName, $methods = [], array $arguments = [], ...)` メソッドも
残されています。これは `getMockBuilder()` を使って実装されていますが、非推奨です。
新しいテストでは `createMock()` か `getMockBuilder()` を使ってください。
モックオブジェクトは `PHPUnit\Framework\MockObject\MockObject` のインスタンスなので、
テストケースで型ヒントに使うことができます。

コードが例外を投げることをテストするには、例外を投げるコードの前で `expectException()` を
呼び出します。`@expectedException` アノテーションはサポートされなくなりました。

``` php
public function testInvalidKey()
{
    $this->expectException(ConfigureException::class);
    $this->expectExceptionMessage('Invalid key');

    // 例外を投げるコード
}
```

<a id="testing-controllers"></a>

## コントローラーのテスト

ヘルパーやモデル、コンポーネントも同様に、CakePHP は `ControllerTestCase` という
コントローラーのテストに特化したクラスを提供します。
このクラスをコントローラーのテストケースの親クラスとすることで、
コントローラーのテストケースを `testAction()` というメソッドでより簡単にすることができます。
`ControllerTestCase` は擬似的にコンポーネントやモデルを動かすだけでなく、
`Controller::redirect()` のように潜在的にテストが難しいメソッドの
テストも簡単にしてくれます。

> [!TIP]
> コントローラーをモックにせず、本物のディスパッチャーを通してテストするには `IntegrationTestTrait` を
> 使います。[統合テスト](/ja/development/integration-testing) を参照してください。

下記のように、「Article」モデルに対応した典型的なコントローラーがあるとします。

``` php
// src/Controller/ArticlesController.php
App::uses('AppController', 'Controller');

class ArticlesController extends AppController
{
    public $helpers = ['Form', 'Html'];

    public function index($short = null)
    {
        if (!empty($this->request->data)) {
            $this->Article->save($this->request->data);
        }
        if (!empty($short)) {
            $result = $this->Article->find('all', ['id', 'title']);
        } else {
            $result = $this->Article->find('all');
        }

        if (isset($this->params['requested'])) {
            return $result;
        }

        $this->set('title', 'Articles');
        $this->set('articles', $result);
    }
}
```

ディレクトリ `tests/TestCase/Controller` に `ArticlesControllerTest.php`
というファイルを作成し、次のように記述します。

``` php
// tests/TestCase/Controller/ArticlesControllerTest.php
class ArticlesControllerTest extends ControllerTestCase
{
    public $fixtures = ['app.article'];

    public function testIndex()
    {
        $result = $this->testAction('/articles/index');
        debug($result);
    }

    public function testIndexShort()
    {
        $result = $this->testAction('/articles/index/short');
        debug($result);
    }

    public function testIndexShortGetRenderedHtml()
    {
        $result = $this->testAction(
            '/articles/index/short',
            ['return' => 'contents'],
        );
        debug($result);
    }

    public function testIndexShortGetViewVars()
    {
        $result = $this->testAction(
            '/articles/index/short',
            ['return' => 'vars'],
        );
        debug($result);
    }

    public function testIndexPostData()
    {
        $data = [
            'Article' => [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body',
            ],
        ];
        $result = $this->testAction(
            '/articles/index',
            ['data' => $data, 'method' => 'post'],
        );
        debug($result);
    }
}
```

この例はコントローラーのテストに testAction を使う方法のいくつかを示しています。
`testAction` の第１引数は常にテストする URL を取ります。CakePHP はリクエストを作成し、
コントローラーとアクションにディスパッチします。なお、PHPUnit はアサーションのないテストを
risky として報告します。実際のテストでは `debug()` の代わりにアサーションを書いてください。

`redirect()` を含むアクションやリダイレクトに従う他のコードをテストするときは、
リダイレクトの際 return することは通常良い考えです。
この理由はテスト中、 `redirect()` が mock されており、通常通り終了しないからです。
そしてあなたのコードを終了する代わりに、リダイレクトを追跡して実行を継続します。
例を示します。

``` php
App::uses('AppController', 'Controller');

class ArticlesController extends AppController
{
    public function add()
    {
        if ($this->request->is('post')) {
            if ($this->Article->save($this->request->data)) {
                $this->redirect(['action' => 'index']);
            }
        }
        // more code
    }
}
```

上記のコードをテストすると、リダイレクトに到達したにもかかわらず `// more code` が
実行されてしまいます。代わりに、このようなコードを書くべきです。

``` php
App::uses('AppController', 'Controller');

class ArticlesController extends AppController
{
    public function add()
    {
        if ($this->request->is('post')) {
            if ($this->Article->save($this->request->data)) {
                return $this->redirect(['action' => 'index']);
            }
        }
        // more code
    }
}
```

この例ではメソッドがリダイレクトに到達した際にreturnするので、 `// more code` は実行されません。

### GETリクエストのシミュレート

上の例の `testIndexPostData()` では、 `testAction()` は POST だけでなく
GET リクエストのアクションとしても使えます。 `data` キーによって
POST されるであろう値を設定します。規定ではすべてのリクエストはPOSTと扱われます。
GET リクエストをシミュレートしたい場合は `method` キーを設定します。

``` php
public function testAdding()
{
    $data = [
        'Post' => [
            'title' => 'New post',
            'body' => 'Secret sauce',
        ],
    ];
    $this->testAction('/posts/add', ['data' => $data, 'method' => 'get']);
    // some assertions.
}
```

`data` キーは GET リクエストのクエリ文字列のパラメータをシミュレートするときに使われます。

### returnする値の選択

コントローラーのアクションが成功したかどうかを調査する方法はいくつかから選択することができます。
それぞれは違った方法であなたのコードが期待した動きをしているか保証するための手段を提供します。

- `vars` ビューの値を取得します。
- `view` レイアウト以外の描画されるビューを取得します。
- `contents` レイアウトを含む描画されるビューを取得します。
- `result` コントローラーのアクションが返す値を取得します。requestAction メソッドの
  テストに対して有用です。

規定値は `result` です。 戻り値の属性を `result` 以外にしない限り、
テストケース内で他の種類の戻り値の属性にアクセスすることができます。

``` php
public function testIndex()
{
    $this->testAction('/posts/index');
    $this->assertIsArray($this->vars['posts']);
}
```

### テストアクションによるモックの使用

コンポーネントやモデルの一部または全部をモックにより置き換えたい時があるでしょう。
そういったときは `ControllerTestCase::generate()` を使うとよいでしょう。
`generate()` はコントローラーのモックを生成する面倒な作業を引き受けてくれます。
テストで使われるコントローラーを決定したら、同時にモデルとコンポーネントの
モックを生成できます。

``` php
$Posts = $this->generate('Posts', [
    'methods' => [
        'isAuthorized',
    ],
    'models' => [
        'Post' => ['save'],
    ],
    'components' => [
        'RequestHandler' => ['isPut'],
        'Email' => ['send'],
        'Session',
    ],
]);
```

上の例では `isAuthorized` というメソッドをスタブにしている `PostsController` のモックを
作成しました。付属された Post モデルはスタブの `save()` メソッドを持っていて、
付属されたコンポーネントも、めいめいにスタブされたメソッドを持っています。
上の例での Session のように、メソッドを渡さなければクラス全体をスタブにできます。

生成されたコントローラーはテストのために自動的に使われます。
自動的な生成を有効にするには、テストケースの `autoMock` という変数にtrueを設定します。
`autoMock` が false であれば、オリジナルのコントローラーがテストに使われるでしょう。

生成されたコントローラーのレスポンスオブジェクトは、
常にヘッダーを送信しないモックを使って置き換えられます。
`generate()` か `testAction()` を使ったあとは、 `$this->controller` から
コントローラーのオブジェクトにアクセスできます。

### より複雑な例

もっとも単純なフォームでは、 `testAction()` は作成したテスト用コントローラーや、
モックされたすべてのモデルやコンポーネントを含め自動的に作成されたものを使い、
`PostsController::index()` を実行します。
テストの結果は `vars` や `contents` 、 `view` 、 `return` といった
プロパティに格納されます。送信されたヘッダー情報には `headers` から
アクセスすることができ、リダイレクトを確認することができます。

``` php
public function testAdd()
{
    $Posts = $this->generate('Posts', [
        'components' => [
            'Session',
            'Email' => ['send'],
        ],
    ]);
    $Posts->Session
        ->expects($this->once())
        ->method('setFlash');
    $Posts->Email
        ->expects($this->once())
        ->method('send')
        ->willReturn(true);

    $this->testAction('/posts/add', [
        'data' => [
            'Post' => ['title' => 'New Post'],
        ],
    ]);
    $this->assertStringContainsString('/posts', $this->headers['Location']);
}

public function testAddGet()
{
    $this->testAction('/posts/add', [
        'method' => 'GET',
        'return' => 'contents',
    ]);
    $this->assertMatchesRegularExpression('/<html/', $this->contents);
    $this->assertMatchesRegularExpression('/<form/', $this->view);
}
```

ここでは、 `testAction()` と `generate()` メソッドの少々複雑な使用例を示しています。
まず、テストするコントローラーを作成し、 `SessionComponent` をモックします。
SessionComponent がモックされたことで、それを用いたテストメソッドの実行が可能となります。

`PostsController::add()` が index にリダイレクトを実行し、
メールを送信したあと、flash メッセージを設定すればテストは合格です。
例のために、レンダリングされたコンテンツ全体を確かめることでレイアウトがロードされたか、
また、formタグのためにビューをチェックするかどうかを確認するため、同様にチェックします。
見てのとおり、コントローラーをテストする自由度と、モックを扱う容易さは、
これらの変更により大きく拡張されます。

PHPUnit では静的メソッドをモックにできません。`AuthComponent::user()` のような静的メソッドが
返す値を制御したいときは、そのメソッドが読み取るデータを用意します。たとえば、アクションを
呼ぶ前にログインユーザーをセッションに書き込みます。

``` php
public function testAdd()
{
    $this->generate('Posts', [
        'components' => [
            'Session',
        ],
    ]);
    CakeSession::write('Auth.User', ['id' => 2, 'username' => 'mark']);

    $this->testAction('/posts/add', ['method' => 'get']);
    // some assertions.
}
```

### JSON を返すコントローラーのテスト

JSON はウェブサービスの構築において、とても馴染み深く、かつ基本的なフォーマットです。
CakePHP を用いたウェブサービスのエンドポイントのテストはとてもシンプルです。
JSON を返すコントローラーの簡単な例を示します。

``` php
// src/Controller/MarkersController.php
class MarkersController extends AppController
{
    public $autoRender = false;

    public function index()
    {
        $data = $this->Marker->find('first');
        $this->response->body(json_encode($data));
    }
}
```

ウェブサービスが適切なレスポンスを返しているか確認するテストを作成しましょう。
`tests/TestCase/Controller/MarkersControllerTest.php`
というファイルを以下のように作成します。

``` php
// tests/TestCase/Controller/MarkersControllerTest.php
class MarkersControllerTest extends ControllerTestCase
{
    public function testIndex()
    {
        $result = $this->testAction('/markers/index.json');
        $result = json_decode($result, true);
        $expected = [
            'Marker' => ['id' => 1, 'lng' => 66, 'lat' => 45],
        ];
        $this->assertEquals($expected, $result);
    }
}
```

## ビューのテスト

一般的に、ほとんどのアプリケーションは、直接 HTML コードをテストしません。
そのため、多くの場合、テストは壊れやすく、メンテナンスが困難になっています。
`ControllerTestCase` を使用して機能テストを書くときに 'view' に
`return` オプションを設定することで、レンダリングされたビューの内容を調べることができます。
これによりビューの内容をテストすることは可能ですが、より堅牢でメンテナンスしやすい統合/ビューテストは
[Selenium webdriver](https://www.selenium.dev/) のようなツールを使うことで実現できます。

## コンポーネントのテスト

`PagematronComponent` というコンポーネントがアプリケーションにあったとしましょう。
このコンポーネントは、このコンポーネントを使用している全てのコントローラーにおいて、
ページネーションの limit 値を設定する手助けをします。例としてコンポーネントが、
`src/Controller/Component/PagematronComponent.php` にあったとします。

``` php
// src/Controller/Component/PagematronComponent.php
class PagematronComponent extends Component
{
    public $Controller = null;

    public function startup(Controller $controller)
    {
        parent::startup($controller);
        $this->Controller = $controller;
        // コントローラーがページネーションを使っているか確かめる
        if (!isset($this->Controller->paginate)) {
            $this->Controller->paginate = [];
        }
    }

    public function adjust($length = 'short')
    {
        switch ($length) {
            case 'long':
                $this->Controller->paginate['limit'] = 100;
                break;
            case 'medium':
                $this->Controller->paginate['limit'] = 50;
                break;
            default:
                $this->Controller->paginate['limit'] = 20;
                break;
        }
    }
}
```

ページネーションの `limit` 値がコンポーネントの `adjust` メソッドによって
正しく設定されているかテストを書くことができます。このように
`tests/TestCase/Controller/Component/PagematronComponentTest.php`
というファイルを作成します。

``` php
// tests/TestCase/Controller/Component/PagematronComponentTest.php
App::uses('PagematronComponent', 'Controller/Component');

// テストの対象となる偽物のコントローラー
class TestPagematronController extends Controller
{
    public $paginate = null;
}

class PagematronComponentTest extends CakeTestCase
{
    public $PagematronComponent = null;
    public $Controller = null;

    public function setUp(): void
    {
        parent::setUp();
        // コンポーネントと偽のテストコントローラーをセットアップする
        $Collection = new ComponentCollection();
        $this->PagematronComponent = new PagematronComponent($Collection);
        $CakeRequest = new CakeRequest();
        $CakeResponse = new CakeResponse();
        $this->Controller = new TestPagematronController($CakeRequest, $CakeResponse);
        $this->PagematronComponent->startup($this->Controller);
    }

    public function testAdjust()
    {
        // 異なる値の設定を用いて adjust メソッドをテストする
        $this->PagematronComponent->adjust();
        $this->assertEquals(20, $this->Controller->paginate['limit']);

        $this->PagematronComponent->adjust('medium');
        $this->assertEquals(50, $this->Controller->paginate['limit']);

        $this->PagematronComponent->adjust('long');
        $this->assertEquals(100, $this->Controller->paginate['limit']);
    }

    public function tearDown(): void
    {
        parent::tearDown();
        // 終了した後のお掃除
        unset($this->PagematronComponent);
        unset($this->Controller);
    }
}
```

## ヘルパーのテスト

ヘルパークラスも十分な量のロジックが構築されているのであれば、
テストケースによって機能を満たしているか確認することは重要です。

はじめに、テストのための例として、ヘルパーを作成します。 `CurrencyRendererHelper` は、
ビューで通貨の表示を補助するための、 `usd()` という唯一の単純なメソッドを持っています。

``` php
// src/View/Helper/CurrencyRendererHelper.php
class CurrencyRendererHelper extends AppHelper
{
    public function usd($amount)
    {
        return 'USD ' . number_format($amount, 2, '.', ',');
    }
}
```

このメソッドは、小数点以下2桁を表示し、小数点としてドット、3桁ごとの区切りとして
カンマを使用するフォーマットで数字を表し、さらに 'USD' という文字列を数字の先頭に置きます。

それではテストを作成します。

``` php
// tests/TestCase/View/Helper/CurrencyRendererHelperTest.php
App::uses('CurrencyRendererHelper', 'View/Helper');

class CurrencyRendererHelperTest extends CakeTestCase
{
    public $CurrencyRenderer = null;

    /**
     * ここでヘルパーをインスタンス化する
     */
    public function setUp(): void
    {
        parent::setUp();
        $Controller = new Controller();
        $View = new View($Controller);
        $this->CurrencyRenderer = new CurrencyRendererHelper($View);
    }

    /**
     * usd() 関数をテストする
     */
    public function testUsd()
    {
        $this->assertEquals('USD 5.30', $this->CurrencyRenderer->usd(5.30));

        // 常に小数点第二桁までになるべき
        $this->assertEquals('USD 1.00', $this->CurrencyRenderer->usd(1));
        $this->assertEquals('USD 2.05', $this->CurrencyRenderer->usd(2.05));

        // 3桁ごとの区切り文字をテスト
        $this->assertEquals('USD 12,000.70', $this->CurrencyRenderer->usd(12000.70));
    }
}
```

ここで、 `usd()` を異なるパラメータで呼び出すことで、このテストスイートは
期待した値と同じ値を返しているかを確かめています。

ファイルに保存しテストを実行します。これにより、グリーンバーと
1つのテスト、4つのアサーションに成功したことを指し示すメッセージを見ることができるでしょう。

## テストスイートの作成

いくつかのテストを同時に実行したいときはテストスイートを作成することができます。テストスイートはいくつかの
テストケースから構成されています。 `CakeTestSuite` は少しばかりですがファイルシステムをベースに
簡単にテストスイートを作成するためのメソッドを提供します。すべてのモデルに対してのテストスイートを
作成したいときは、 `tests/TestCase/AllModelTest.php` を作成します。内容は以下のとおりです。

``` php
// tests/TestCase/AllModelTest.php
class AllModelTest extends CakeTestSuite
{
    public static function suite()
    {
        $suite = new CakeTestSuite('All model tests');
        $suite->addTestDirectory(TESTS . 'TestCase/Model');

        return $suite;
    }
}
```

上のコードは `tests/TestCase/Model/` のフォルダ以下に見つかったテストケースをすべてグループ化します。
定数 `TESTS` は `tests/` ディレクトリを指します (レガシー構成では `app/Test/` を指し、
テストケースは `TESTS . 'Case'` にあります)。
個別にファイルを追加するときは `$suite->addTestFile($filename);` を使います。
あるディレクトリから再帰的にすべてのテストをグループ化する場合は以下のようにします。

``` php
$suite->addTestDirectoryRecursive(TESTS . 'TestCase/Model');
```

この例では、 `tests/TestCase/Model` のディレクトリ以下のすべてのテストをグループ化します。
アプリケーションのテストをすべて実行するスイートを構築するためにテストスイートを使用することができます。

``` php
// tests/TestCase/AllTestsTest.php
class AllTestsTest extends CakeTestSuite
{
    public static function suite()
    {
        $suite = new CakeTestSuite('All tests');
        $suite->addTestDirectoryRecursive(TESTS . 'TestCase');

        return $suite;
    }
}
```

そして、コマンドライン上でこのテストを実行することができます。

``` bash
bin/cake test app AllTests
```

PHPUnit を直接実行する場合は、`phpunit.xml.dist` の `<testsuites>` で実行するテストが
指定されているので、`vendor/bin/phpunit` のために `AllTests` スイートを用意する必要はありません。
`phpunit.xml.dist` が探索するディレクトリにスイートのファイルを置くと、同じテストが
2回実行されてしまうので注意してください。

## プラグインのテスト作成

プラグインのテストは、プラグインのフォルダ内の指定されたディレクトリに作成します。

``` text
plugins/
    Blog/
        tests/
            TestCase/
            Fixture/
```

プラグインではレガシーな `Test/Case` と `Test/Fixture` ディレクトリも使えます。
CakePHP はプラグイン内に `tests/TestCase` と `tests/Fixture` があればそれを使い、
無ければ `Test/Case` と `Test/Fixture` を使います。レガシーなアプリケーション構成では、
プラグインは `plugins/` ではなく `app/Plugin/` に置かれます。

これらは通常のテストと同じように実行できますが、クラスをインポートするときにプラグインの
命名規則を使うことを覚えておいてください。これはこの本のプラグインの章で紹介した `BlogPost`
モデルのテストケースの例です。他のテストとの違いは、最初の行で 'Blog.BlogPost' を
インポートしているところです。またプラグインのフィクスチャも `plugin.blog.blog_post`
というプレフィックスをつける必要があります。

``` php
// plugins/Blog/tests/TestCase/Model/BlogPostTest.php
App::uses('BlogPost', 'Blog.Model');

class BlogPostTest extends CakeTestCase
{
    // プラグインのフィクスチャは plugins/Blog/tests/Fixture/ に配置される
    public $fixtures = ['plugin.blog.blog_post'];
    public $BlogPost;

    public function testSomething()
    {
        // ClassRegistry はテスト用のデータベースコネクションをモデルが使うようにしてくれる
        $this->BlogPost = ClassRegistry::init('Blog.BlogPost');

        // その他の有用なテストをここに書く
        $this->assertIsObject($this->BlogPost);
    }
}
```

アプリケーションのテストでプラグインのフィクスチャを使いたいときは、 `$fixtures` の
配列で `plugin.pluginName.fixtureName` という構文を使うことで参照できます。

プラグインのテストケースは、 `bin/cake test Blog Model/BlogPost` のように
test シェルで実行できます。

<a id="integration-with-jenkins"></a>

## 継続的インテグレーション

GitHub Actions や Jenkins で、プッシュのたびにテストを自動で実行する方法は
[継続的インテグレーション](/ja/development/continuous-integration) を参照してください。
