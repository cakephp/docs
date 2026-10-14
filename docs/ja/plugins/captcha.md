# Captcha

[pieceofcake2/captcha](https://github.com/pieceofcake2/captcha) プラグインは、CAPTCHA で
フォームをボットから守ります。`CaptchaHelper` が CAPTCHA プロバイダーのウィジェットをフォームに
表示し、`CaptchaComponent` がウィジェットによってフォームに追加されたトークンをプロバイダーに送って、
アクションの実行前に結果を確認します。

対応しているプロバイダーは次のとおりです。

| プロバイダー | `provider` の設定値 |
| --- | --- |
| [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | `turnstile` (デフォルト) |
| [Google reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display) (チェックボックス) | `recaptcha_v2` |
| [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) (スコア) | `recaptcha_v3` |
| [hCaptcha](https://docs.hcaptcha.com/) | `hcaptcha` |

独自のプロバイダーを追加することもできます。このページでは主な使い方を説明します。すべての
オプションについては [プラグインのドキュメント](https://github.com/pieceofcake2/captcha/blob/1.x/docs/README.md) (英語)
を参照してください。

![CakePHP 2 のフォームに表示した Turnstile のウィジェット](/captcha-turnstile.png)

<a id="installation"></a>

## インストール

このプラグインには PHP 8.0 以上と pieceofcake2/cakephp 2.12 以上が必要です。
Composer でインストールします。

```bash
composer require pieceofcake2/captcha
```

パッケージのタイプは `cakephp-plugin` なので、`composer/installers` がプラグインのディレクトリに
インストールします。アプリケーションの `composer.json` には、それに合わせた `installer-paths` の
設定が必要です ([composer.json の設定](/ja/installation#configuring-composer-json) を参照してください)。

| 構成 | `installer-paths` |
| --- | --- |
| モダンな構成 (`plugins/`) | `"plugins/{$name}/": ["type:cakephp-plugin"]` |
| 従来の構成 (`app/Plugin/`) | `"app/Plugin/{$name}/": ["type:cakephp-plugin"]` |

次に、`config/bootstrap.php` (従来の構成では `app/Config/bootstrap.php`) でプラグインを
読み込みます。`CakePlugin::loadAll()` を使っている場合は不要です。

```php
CakePlugin::load('Captcha');
```

<a id="configuration"></a>

## 設定

プロバイダーの管理画面でサイトキーとシークレットキーを作成し、`Configure::write()` で設定します。
たとえば `config/bootstrap.php` に次のように書きます。

```php
Configure::write('Captcha', [
    'provider' => 'turnstile',
    'siteKey' => env('CAPTCHA_SITE_KEY'),
    'secretKey' => env('CAPTCHA_SECRET_KEY'),
]);
```

キーはリポジトリにコミットしないでください。サーバーの環境変数に設定し、`env()` で読み込みます。
[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンでは、開発中は
`config/.env` に書くこともできます。

主な設定は次のとおりです。

| キー | デフォルト | 説明 |
| --- | --- | --- |
| `provider` | `turnstile` | `turnstile`、`recaptcha_v2`、`recaptcha_v3`、`hcaptcha`、または独自のプロバイダーのクラス名 |
| `siteKey` | | 公開されるサイトキー。ページに出力されます |
| `secretKey` | | シークレットキー。プロバイダーの検証用エンドポイントにだけ送られます |
| `action` | | アクション名。ウィジェットに出力され (Turnstile、reCAPTCHA v3)、検証レスポンスの action と比較されます |
| `hostname` | | 期待するホスト名、またはホスト名のリスト。コンポーネントでは `true` で現在のリクエストのホストを使います |
| `scoreThreshold` | `0.5` | reCAPTCHA v3 のみ: 最低スコア |
| `timeout` | `10` | 検証リクエストのタイムアウト (秒) |
| `language` | | ウィジェットの言語 |

`theme` や `size` など、プロバイダーのウィジェットのオプションもここで設定できます。ヘルパーと
コンポーネントの設定はこの設定にマージされるので、コントローラーごとに違う設定や、別のプロバイダーを
使うこともできます。

<a id="rendering-the-widget"></a>

## ウィジェットの表示

コントローラー (または `AppController`) にヘルパーを追加し、フォームの中で `widget()` を呼び出します。

```php
// src/Controller/ContactsController.php
class ContactsController extends AppController
{
    public $helpers = ['Captcha.Captcha' => ['theme' => 'light']];
}
```

```php
<?php
// templates/Contacts/add.ctp
echo $this->Form->create('Contact');
echo $this->Form->input('name');
echo $this->Form->input('email');
echo $this->Form->input('message');
echo $this->Captcha->widget();
echo $this->Form->end('Send');
```

`widget()` はプロバイダーのスクリプト (ページごとに 1 回) とウィジェットのコンテナーを出力します。
ユーザーが CAPTCHA を解くと、プロバイダーのスクリプトがトークンを持つ hidden フィールド
(Turnstile では `cf-turnstile-response` など) をフォームに追加します。`widget()` のオプションは
設定より優先されます。たとえば `['theme' => 'dark', 'size' => 'compact']` のように指定でき、
それ以外のキーは HTML 属性になります。

ウィジェットは `FormHelper` でトークンのフィールドのロックを解除するので、`SecurityComponent` で
保護されたフォームもブラックホールに送られません。スクリプトを `<head>` に出力したい場合は、
`$this->Captcha->script(['block' => 'script'])` を呼び出し、`widget()` には `'script' => false`
を渡してください。

<a id="verifying-the-token"></a>

## トークンの検証

<a id="automatic-verification"></a>

### 自動検証

コントローラーにコンポーネントを追加し、保護するアクションを指定します。

```php
// src/Controller/ContactsController.php
class ContactsController extends AppController
{
    public $components = [
        'Captcha.Captcha' => [
            'actions' => ['add'],
            'flashOptions' => ['element' => 'error'],
        ],
    ];

    public $helpers = ['Captcha.Captcha'];

    public function add()
    {
        if ($this->request->is('post')) {
            $this->Contact->create();
            if ($this->Contact->save($this->request->data)) {
                return $this->redirect(['action' => 'thanks']);
            }
        }
    }
}
```

指定したアクション (すべてのアクションの場合は `['*']`) では、コンポーネントが `startup()`、つまり
`beforeFilter()` の後でアクションの前にトークンを検証します。検証するのは `POST`、`PUT`、`PATCH` の
リクエストだけ (`methods` の設定) なので、`GET` ではアクションがそのままフォームを表示します。
検証に失敗したときの動作は `onFailure` の設定で決まります。

| `onFailure` | 動作 |
| --- | --- |
| `redirect` (デフォルト) | `FlashComponent` で `flash` のメッセージを設定し、`redirect` (デフォルトはリファラー) にリダイレクトします |
| `exception` | `exception` のクラス (デフォルトは `ForbiddenException`) を投げます |
| `none` | 結果を記録するだけです。アクションで結果を確認します |

コンポーネントのそれ以外の設定はプロバイダーの設定になり、`Configure::read('Captcha')` より
優先されます。

<a id="redisplaying-the-form"></a>

### フォームの再表示

`redirect` では送信されたデータが失われます。入力された内容のままフォームを再表示するには、
`'onFailure' => 'none'` を指定し、アクションで結果を確認します。

```php
public $components = [
    'Captcha.Captcha' => ['actions' => ['add'], 'onFailure' => 'none'],
];

public function add()
{
    if ($this->request->is('post')) {
        $this->Contact->set($this->request->data);
        if (!$this->Captcha->verify()) {
            $this->Contact->invalidate('captcha', __('Please complete the CAPTCHA.'));
        } elseif ($this->Contact->save()) {
            return $this->redirect(['action' => 'thanks']);
        }
    }
}
```

トークンは 1 回しか検証できませんが、`verify()` は自動検証の結果を再利用するので、トークンが
もう一度プロバイダーに送られることはありません。

<a id="manual-verification"></a>

### 手動での検証

`actions` を指定しなければコンポーネントは自動では何もしないので、自分で `verify()` を呼び出します。

```php
if (!$this->Captcha->verify()) {
    $errors = $this->Captcha->getErrors(); // 例: ['timeout-or-duplicate']
    $this->Flash->error(__('Please try again.'));

    return $this->redirect(['action' => 'add']);
}
```

`verify(?string $token = null, array $settings = [])` は、トークンを渡さなければリクエストデータから
読み取ります。`$settings` はこの呼び出しに限って設定を上書きします (例: `['action' => 'login']`)。
`getResult()` は最後の `CaptchaResult` を返し、`isSuccess()`、`getErrors()`、`getHostname()`、
`getAction()`、`getScore()` を使えます。

`getErrors()` は、`invalid-input-response` や `timeout-or-duplicate` などプロバイダーの
エラーコードと、プラグインが追加するコードを返します。プラグインのコードには
`missing-input-response` (トークンが送信されていない)、`verification-unavailable`
(ネットワークエラー、タイムアウト、エラーレスポンス)、`hostname-mismatch`、`action-mismatch`、
`score-too-low` などがあります。コントローラーの外では `CaptchaVerifier` で同じようにトークンを
検証できます。プラグインのドキュメントを参照してください。

<a id="recaptcha-v3"></a>

## reCAPTCHA v3

reCAPTCHA v3 は問題を表示せず、リクエストごとに 0.0 (ボットの可能性が高い) から 1.0 (人間の
可能性が高い) のスコアを返します。`recaptcha_v3` では、`widget()` は hidden の入力欄と小さな
スクリプトを出力します。トークンは 2 分で期限切れになるため、スクリプトはフォームの送信時に
トークンを取得します。

ヘルパーとコンポーネントの両方で使われるように、`Captcha` の設定で `provider` を `recaptcha_v3`
にしてください。検証レスポンスの action は設定した action と一致する必要があるので、
ウィジェットとコンポーネントでは同じアクション名を使います。

```php
// templates/Contacts/add.ctp
echo $this->Captcha->widget(['action' => 'contact']);
```

```php
// src/Controller/ContactsController.php
public $components = [
    'Captcha.Captcha' => [
        'actions' => ['add'],
        'action' => 'contact',
        'scoreThreshold' => 0.7,
    ],
];
```

`action` のデフォルトは `submit` です。スコアが `scoreThreshold` (デフォルト `0.5`) より低い
リクエストは `score-too-low` で失敗します。リクエストを拒否する代わりに追加の確認を求めるなど、
自分で判断したい場合は、`scoreThreshold` を `false` にして
`$this->Captcha->getResult()->getScore()` を読んでください。

<a id="security-notes"></a>

## セキュリティに関する注意

- **必ずサーバーで検証してください。** ウィジェットだけでは何も守れません。リクエストを処理する前に、
  コンポーネントでトークンを検証してください。
- **失敗時は拒否します。** トークンやシークレットキーがない場合、ネットワークエラー、タイムアウト、
  エラーレスポンス、不正なレスポンスは、すべて検証の失敗になります。
- **ホスト名とアクション**: `hostname` (コンポーネントでは `true` も可) を設定すると、ほかのサイトで
  解かれたトークンを拒否できます。`action` を設定すると、トークンをフォームに結び付けられます。
- **プロキシの背後でのクライアント IP**: コンポーネントはクライアントの IP アドレスをプロバイダーに
  送ります。デフォルトでは `REMOTE_ADDR` を使うので、リバースプロキシやロードバランサーの背後では
  プロキシのアドレスになります。`'trustProxy' => true` は、プロキシが `X-Forwarded-For` ヘッダー
  (`'hostname' => true` の場合は `X-Forwarded-Host` も) を上書きする場合にだけ設定してください。
  そうでないと、クライアントがこれらのヘッダーを偽装できます。
- **秘密情報**: シークレットキーとトークンはログに出力されません。失敗は `captcha` スコープの
  警告としてログに記録されます。
- **Content Security Policy**: CSP を使う場合は、`nonce` の設定で nonce を渡し、プロバイダーの
  ホストを許可してください。ホストの一覧はプラグインのドキュメントにあります。

<a id="testing"></a>

## テスト

各プロバイダーはテスト用のキーを公開しています。開発や自動テストでは使えますが、本番環境では
絶対に使わないでください。Turnstile では、サイトキー `1x00000000000000000000AA` とシークレットキー
`1x0000000000000000000000000000000AA` の組み合わせは常に成功し、シークレットキー
`2x0000000000000000000000000000000AA` は常に失敗します。テスト用のキーの検証レスポンスには
ホスト名 `example.com` が入っているので、テスト用のキーでは `hostname` を設定しないでください。
reCAPTCHA v2 と hCaptcha のテスト用のキーはプラグインのドキュメントにあります。reCAPTCHA v3 には
テスト用のキーはありません。

ユニットテストやコントローラーのテストでは、リクエストがテストの外に出ないように、モックした
`HttpSocket` をコンポーネントに渡します。

```php
$http = $this->getMockBuilder(HttpSocket::class)->onlyMethods(['post'])->getMock();
$response = new HttpSocketResponse();
$response->code = 200;
$response->body = '{"success":true,"hostname":"example.com"}';
$http->method('post')->willReturn($response);

$this->Controller->Captcha->setHttpSocket($http);
```

このプラグインは `SecurityComponent` と一緒に使えるので、
[pieceofcake2/e2e-test](/ja/development/e2e-testing) によるブラウザーのテストでも、テスト用の
キーを使って保護されたフォームを送信できます。E2E テストはデフォルトで外部のホストをブロックするので、
`challenges.cloudflare.com` などプロバイダーのホストを `browser.allowedHosts` オプションに
追加してください。
