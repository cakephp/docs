# Mailer

`class` Cake\\Mailer\\**Mailer**(string|array|null $profile = null)

`Mailer` は、メール送信の新しいクラスです。このクラスを使用すると、
アプリケーションの任意の場所からメール送信できます。

## 基本的な使用法

まず最初に、クラスがロードされていることを確認する必要があります。 :

``` php
use Cake\Mailer\Mailer;
```

`Mailer` をロードしたら、次のようにメールを送信することができます。 :

``` php
$mailer = new Mailer('default');
$mailer->setFrom(['me@example.com' => 'My Site'])
    ->setTo('you@example.com')
    ->setSubject('About')
    ->deliver('My message');
```

`Mailer` のセッターメソッドは、クラスのインスタンスを返すので、
メソッド・チェーンでプロパティーを設定することができます。

`Mailer` は、受信者を定義するためのいくつかの方法があります - `setTo()` 、 `setCc()` 、
`setBcc()` 、 `addTo()` 、 `addCc()` そして `addBcc()` 。主な違いは最初の3つは、
すでに設定されていたものを上書きし、後者は単にそれぞれのフィールドに複数の受信者を追加することです。 :

``` php
$mailer = new Mailer();
$mailer->setTo('to@example.com', 'To Example');
$mailer->addTo('to2@example.com', 'To2 Example');
// メールの To 受信者は to@example.com と to2@example.com
$mailer->setTo('test@example.com', 'ToTest Example');
// メールの To 受信者は test@example.com
```

### 送り主の選択

他の人々に代わってメールを送信するとき、Sender ヘッダーを使用して、
元の送り主を定義することは良い考えです。 `setSender()` を使用して行えます。 :

``` php
$mailer = new Mailer();
$mailer->setSender('app@example.com', 'MyApp emailer');
```

> [!NOTE]
> 別の人の代わりにメール送信するときに送り主 (envelope sender) をセットするのは良い考えです。
> これは、配信失敗に関するメッセージの受信を防ぐことができます。

## 設定

メーラーのプロファイルとメールのトランスポートは、アプリケーションの
設定ファイルを使用して作成されます。 `Email` と `EmailTransport` は
それぞれメーラーのプロファイルとメールのトランスポート設定を定義します。
アプリケーションのブートストラップ設定は `setConfig()` を使用することにより
`Configure` から　`Mailer` および `TransportFactory` クラスに渡されます。
プロファイルおよびトランスポートを定義することにより、アプリケーションコードにおいて
設定データの自由を保ち、メンテナンスおよび配備をより困難にする重複を避けることができます。

あらかじめ定義された設定をロードするには、 `setProfile()` メソッドを使用するか、
または `Mailer` のコンストラクターに渡すことができます。 :

``` php
$mailer = new Mailer();
$mailer->setProfile('default');

// または、コンストラクター内で
$mailer = new Mailer('default');
```

設定名の文字列を渡す代わりに、オプションの配列をロードすることもできます。 :

``` php
$mailer = new Mailer();
$mailer->setProfile(['from' => 'me@example.org', 'transport' => 'my_custom']);

// または、コンストラクター内で
$mailer = new Mailer(['from' => 'me@example.org', 'transport' => 'my_custom']);
```

### 設定プロファイル

配信プロファイルを定義すると、再利用可能なプロファイルに共通のメール設定を統合することができます。
アプリケーションは、必要な数のプロファイルを持つことができます。次の設定キーが使用されます。

- `'from'`: 送信者のメールアドレスまたは配列。 `Mailer::setFrom()` を参照。
- `'sender'`: 実際の送信者のメールアドレスまたは配列。 `Mailer::setSender()` を参照。
- `'to'`: 宛先のメールアドレスまたは配列。 `Mailer::setTo()` を参照。
- `'cc'`: CC のメールアドレスまたは配列。 `Mailer::setCc()` を参照。
- `'bcc'`: BCC のメールアドレスまたは配列。 `Mailer::setCcc()` を参照。
- `'replyTo'`: メールの返信先のメールアドレスまたは配列。 `Mailer::setReplyTo()` を参照。
- `'readReceipt'`: 開封通知先メールアドレスまたはアドレスの配列。 `Mailer::setReadReceipt()` を参照。
- `'returnPath'`: エラーの返信先メールアドレスまたはアドレスの配列。 `Mailer::setReturnPath()` を参照。
- `'messageId'`: メールのメッセージID。 `Mailer::setMessageId()` を参照。
- `'subject'`: メッセージのサブジェクト。 `Mailer::setSubject()` を参照。
- `'message'`: メッセージ本文。レンダリングされた本文を使用する場合は、 この項目を設定しないでください。
- `'priority'`: メールの優先度 (数値。通常は 1 から 5 で、1 が最高)。
- `'headers'`: ヘッダー情報。 `Mailer::setHeaders()` を参照。
- `'viewRender'`: レンダリングされた本文を使用する場合は、ビュークラス名をセット。
  `Mailer::viewRender()` を参照。
- `'template'`: レンダリングされた本文を使用する場合は、テンプレート名をセット。
  `ViewBuilder::setTemplate()` を参照。
- `'theme'`: テンプレートをレンダリングする際のテーマ。 `ViewBuilder::setTheme()` を参照。
- `'layout'`: レンダリングされた本文を使用する場合、描画するレイアウトをセット。
  レイアウトなしでテンプレートをレンダリングしたい場合は、このフィールドに null をセット。
  `ViewBuilder::setTemplate()` を参照。
- `'viewVars'`: レンダリングされた本文を使用する場合は、ビューで使用する変数の配列をセット。
  `Mailer::setViewVars()` を参照。
- `'attachments'`: 添付ファイルの一覧。 `Mailer::setAttachments()` を参照。
- `'emailFormat'`: メールの書式 (html, text または both) `Mailer::setEmailFormat()` を参照。
- `'transport'`: トランスポート名。 トランスポート設定を参照。
- `'log'`: メールヘッダーとメッセージをログに記録するログレベル。
  `true` なら LOG_DEBUG を使用します。 [Logging Levels](../core-libraries/logging#logging-levels) を参照。
  ログはスコープ名 `email` で出力されることに注意してください。 [Logging Scopes](../core-libraries/logging#logging-scopes) を参照。
- `'helpers'`: メールテンプレート内で使用するヘルパーの配列。 `ViewBuilder::setHelpers()` 。

> [!NOTE]
> メールアドレスや配列で使用する上記のキーの値 (from, to, cc 他）は、関連するメソッドの第一引数として
> 渡されます。例をあげると `$mailer->setFrom('my@example.com', 'My Site')` は、設定の中では
> `'from' => ['my@example.com' => 'My Site']` と定義されます。

## ヘッダーの設定

`Mailer` の中に、自由にヘッダーをセットできます。Email を使用する際、
独自のヘッダーにプレフィックスの `X-` をつけることを忘れないでください。

`Mailer::setHeaders()` と `Mailer::addHeaders()` を参照してください。

## テンプレートメールの送信

メールはしばしば単純なテキストメッセージを超えたものになります。それを容易にするために
CakePHP は、 [ビューレイヤー](../views) を使用してメールを送信することができます。

メールのテンプレートは、 `templates/email` と呼ばれる特別なフォルダーに置かれます。
メールのビューは、普通のビューと同様にレイアウトとエレメントを使用します。 :

``` php
$mailer = new Mailer();
$mailer
            ->setEmailFormat('html')
            ->setTo('bob@example.com')
            ->setFrom('app@domain.com')
            ->viewBuilder()
                ->setTemplate('welcome')
                ->setLayout('fancy');

$mailer->deliver();
```

上記は、ビューとして **templates/email/html/welcome.php** を使用し、
レイアウトとして **templates/layout/email/html/fancy.php** を使用します。
以下のように、マルチパートのテンプレートメールを送信することもできます。 :

``` php
$mailer = new Mailer();
$mailer
            ->setEmailFormat('both')
            ->setTo('bob@example.com')
            ->setFrom('app@domain.com')
            ->viewBuilder()
                ->setTemplate('welcome')
                ->setLayout('fancy');

$mailer->deliver();
```

この例では、次のテンプレートファイルを使用します。

- **templates/email/text/welcome.php**
- **templates/layout/email/text/fancy.php**
- **templates/email/html/welcome.php**
- **templates/layout/email/html/fancy.php**

テンプレートメールを送信する時、 `text` 、 `html` と `both` のうちの
どれかを送信オプションとして指定します。

`Mailer :: viewBuilder()` で取得されたビュービルダーのインスタンスを使用して、
コントローラーで行うことと似たように、すべてのビュー関連の設定をすることができます。

`Mailer::setViewVars()` でビューの変数をセットできます。 :

``` php
$mailer = new Mailer('templated');
$mailer->setViewVars(['value' => 12345]);
```

または、 ビュービルダーのメソッド
`ViewBuilder::setVar()` および `ViewBuilder::setVars()` を使用できます。

以下のようにメールテンプレート内で使用します。 :

``` html
<p>あなたの値は次のとおりです: <b><?= $value ?></b></p>
```

メールでも普通のテンプレートファイルと同様にヘルパーを使用できます。
デフォルトでは、 `HtmlHelper` のみがロードされます。
`ViewBuilder::setHelpers()` メソッドを使うことで追加でヘルパーをロードできます。 :

``` php
$mailer->viewBuilder()->setHelpers(['Html', 'Custom', 'Text']);
```

ヘルパーを設定する時は、’Html’ を含めて下さい。そうしなければ、メールテンプレートにロードされません。

もし、プラグインの中でテンプレートを使用してメール送信したい場合、おなじみの `プラグイン記法`
を使います。 :

``` php
$mailer = new Mailer();
$mailer->viewBuilder()->setTemplate('Blog.new_comment');
```

上記の例は、 Blog プラグインのテンプレートとレイアウトを使用しています。

いくつかのケースで、プラグインで用意されたデフォルトのテンプレートを上書きしたい場合があるかもしれません。
テーマを利用して行うことができます。 :

``` php
$mailer->viewBuilder()
    ->setTemplate('Blog.new_comment')
    ->setLayout('Blog.auto_message')
    ->setTheme('TestTheme');
```

これは、Blog プラグインを更新せずにあなたのテーマの `new_comment` テンプレートで上書きできます。
テンプレートファイルは、以下のパスで作成する必要があります:
**templates/plugin/TestTheme/plugin/Blog/email/text/new_comment.php**

## 添付ファイルの送信

`method` Cake\\Mailer\\Mailer::**setAttachments**($attachments)

メールにファイルを添付することができます。添付するファイルの種類や、
宛先のメールクライアントにどのようなファイル名で送りたいのかによって幾つかの異なる書式があります。

1.  配列: `$email->attachments(['/full/file/path/file.png'])` は、 文字列の場合と同じ振る舞いをします。

2.  キー付き配列:　
    `$mailer->setAttachments(['photo.png' => '/full/some_hash.png'])` は、
    photo.png というファイル名で some_hash.png ファイルを添付します。
    受信者からは、some_hash.png ではなく photo.png として見えます。

3.  ネストした配列:

    ``` php
    $mailer->setAttachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);
    ```

    上記は、異なる mimetype と独自のコンテンツID を添付します
    (添付をインラインに変換する場合にコンテンツIDをセットします)。
    mimetype と contentId はこの形式のオプションです。

    3.1. `contentId` を指定した時、HTML 内で `<img src="cid:my-content-id">`
    のようにファイルを使用できます。

    3.2. 添付の `Content-Disposition` ヘッダーを無効にするために
    `contentDisposition` オプションを使用できます。これは、outlook を使って
    ical の招待状をクライアントに送る時に便利です。

    3.3. `file` オプションの代わりに `data` オプションを使うと、
    ファイル本文を文字列として添付することができます。これは、ファイルパスを指定せずに
    添付することができます。

### アドレス検証ルールの緩和

`method` Cake\\Mailer\\Mailer::**setEmailPattern**($pattern)

もし、規約に準拠していないアドレスに送信するときにバリデーションに問題がある場合、
メールアドレスのバリデーションに使用するパターンを緩和することができます。
いくつかの ISP に送信するときに必要になります。 :

``` php
$mailer = new Mailer('default');

// 規約に準拠しないアドレスに送信できるように
// メールのパターンを緩和します。
$mailer->setEmailPattern($newPattern);
```

## メッセージの即時送信

しばしば、メールの素早い送信が必要で、送信ごとに毎回設定のセットアップが必要ないことがあります。
そのような目的のために `Cake\Mailer\Email::deliver()` が用意されています。

`Cake\Mailer\Email::config()` で設定を作成したり、
`Email::deliver()` スタティックメソッドにすべての必要なオプションを配列で指定することができます。
例:

``` css
Email::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);
```

このメソッドは、 「you@example.com」宛に、「me@example.com」から、件名「Subject」、
本文「Message」でメールを送信します。

`deliver()` の戻り値は、 すべての設定を持つ `Cake\Mailer\Email` インスタンスです。
もし、メールを送信せず送信前に幾つか設定変更したい場合、第５引数に `false` をセットしてインスタンスを
取得してください。

第３引数には、メッセージの本文か、レンダリングされた本文を使用時には変数の配列を指定します。

第４引数は、設定の配列や `Configure` 内の設定名の文字列を指定します。

もしあなたが望むのなら、サブジェクトと本文に null をセットして、すべての設定を
(配列か `Configure` を使用して) 第４引数で指定できます。
全ての設定を知るために [設定](#email-configurations) 一覧を確認してください。

## CLI からのメール送信

シェルやタスクなどの CLI スクリプトでメールを送信するとき、Email に使用するドメイン名を
セットしなければなりません。(ホスト名が CLI 環境にないとき) ドメイン名は、メッセージ ID
のホスト名として使用されます。 :

``` php
$mailer->setDomain('www.example.org');
// メッセージ ID は ``<UUID@>`` (無効) の代わりに、
// ``<UUID@www.example.org>`` (有効) を返します。
```

正しいメッセージ ID は、迷惑メールフォルダーへ振り分けられることを防ぐのに役立ちます。

## 再利用可能なメールの作成

`Mailer` は、アプリケーション全体で再利用可能なメールを作成することができます。
また、一ヶ所に複数のメール設定を格納するために使用することができます。
これは、コードを DRY に保つことができますし、アプリケーション内の他の領域から、
メールの設定ノイズを除外します。

この例では、ユーザー関連のメールが含まれている `Mailer` を作成します。
`UserMailer` を作成するには、 **src/Mailer/UserMailer.php** ファイルを作成します。
ファイルの内容は次のようになります。 :

``` php
namespace App\Mailer;

use Cake\Mailer\Mailer;

class UserMailer extends Mailer
{
    public function welcome($user)
    {
        $this
            ->setTo($user->email)
            ->setSubject(sprintf('Welcome %s', $user->name))
            ->viewBuilder()
                ->setTemplate('welcome_mail'); // デフォルトでテンプレートはメソッドと同じ名前が使われます。
    }

    public function resetPassword($user)
    {
        $this
            ->setTo($user->email)
            ->setSubject('Reset password')
            ->setViewVars(['token' => $user->token]);
    }
}
```

この例では、2つのメソッドを作成しました。１つは、ウェルカムメールを送信するため、もう１つは、
パスワードのリセットメールを送信するためのものです。これらの各メソッドは、
ユーザー `Entity` を受け取り、各メールを設定するために、そのプロパティーを利用しています。

これで、アプリケーション内のどこからでも、ユーザー関連のメールを送信するために
`UserMailer` を使用することができます。例えば、ウェルカムメールを送信したいのであれば、
以下のようにするとよいでしょう。 :

``` php
namespace App\Controller;

use Cake\Mailer\MailerAwareTrait;

class UsersController extends AppController
{
    use MailerAwareTrait;

    public function register()
    {
        $user = $this->Users->newEmptyEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData())
            if ($this->Users->save($user)) {
                $this->getMailer('User')->send('welcome', [$user]);
            }
        }
        $this->set('user', $user);
    }
}
```

アプリケーションのコードからユーザーへのウェルカムメールの送信を完全に分離したい場合、
`UserMailer` が `Model.afterSave` イベントを受け取ることができます。
イベントを受け取ることによって、アプリケーションのユーザー関連のクラスは、
メール関連のロジックや命令から完全に解放されます。
たとえば、 `UserMailer` に以下を追加することができます。 :

``` php
public function implementedEvents()
{
    return [
        'Model.afterSave' => 'onRegistration'
    ];
}

public function onRegistration(EventInterface $event, EntityInterface $entity, ArrayObject $options)
{
    if ($entity->isNew()) {
        $this->send('welcome', [$entity]);
    }
}
```

Mailer オブジェクトは、イベントリスナーとして登録され、 `onRegistration()` メソッドは
`Model.afterSave` イベントが起こるたびに呼び出されます。 :

``` php
// Users イベントマネージャへアタッチする
$this->Users->getEventManager()->on($this->getMailer('User'));
```

> [!NOTE]
> イベントリスナーオブジェクトを登録する方法については、
> [Registering Event Listeners](../core-libraries/events#registering-event-listeners) のドキュメントを参照してください。

## トランスポートの設定

メールメッセージは、トランスポートによって配信されます。さまざまなトランスポートを使用すると、
PHP の `mail()` 関数や SMTP サーバーでメッセージを送信したり、
デバッグが捗るようメッセージを送信しないこともできます。トランスポートを設定すると、
アプリケーションのコードの外に、設定データを保持することができ、
単純に設定データを変更できるのでデプロイが簡単になります。
トランスポートの設定例は、次のようになります。 :

``` text
// config/app.php の中で
'EmailTransport' => [
    // Mail構成の例
    'default' => [
        'className' => 'Mail',
    ],
    // SMTP構成の例
    'gmail' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]
],
```

`TransportFactory::setConfig()` を利用して設定することもできます。:

``` php
use Cake\Mailer\TransportFactory;

// STMPトランスポートを定義する
TransportFactory::setConfig('gmail', [
    'host' => 'ssl://smtp.gmail.com',
    'port' => 465,
    'username' => 'my@gmail.com',
    'password' => 'secret',
    'className' => 'Smtp'
]);
```

Gmail のように、SSL SMTP サーバーを設定することができます。これを行うには、 host に
`ssl://` プレフィックスをつけて、それに伴い port の値を設定してください。
また、 `tls` オプションを使用して TLS SMTP を有効にすることもできます。 :

``` php
use Cake\Mailer\TransportFactory;

TransportFactory::setConfig('gmail', [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'username' => 'my@gmail.com',
    'password' => 'secret',
    'className' => 'Smtp',
    'tls' => true
]);
```

上記の設定では、メールメッセージの TLS 通信を可能にします。

特定のトランスポートを使用するようにメーラーを構成するには、
`Cake\Mailer\Mailer::setTransport()` メソッドを使用するか、
設定にトランスポートを含めることができます。 :

``` php
// TransportFactory::setConfig() を使用して設定済の名前付きトランスポートを使用します。
$mailer->setTransport('gmail');

// 構築されたオブジェクトを使用します。
$mailer->setTransport(new \Cake\Mailer\Transport\DebugTransport());
```

> [!WARNING]
> あなたのグーグルアカウントでこれを動作させるためには安全性の低いアプリへのアクセスを
> 有効にする必要があります: [安全性の低いアプリがアカウントにアクセスするのを許可する](https://support.google.com/accounts/answer/6010255) 。

> [!NOTE]
> [Gmail の SMTP 設定](https://support.google.com/a/answer/176600?hl=ja) 。

> [!NOTE]
> SSL + SMTP を使用するには、PHP のインストール時に SSL が設定されている必要があります。

設定オプションは、 `DSN` 文字列として指定することもできます。
これは、環境変数を使ったり `PaaS` プロバイダーで動作する場合に便利です。 :

``` css
TransportFactory::setConfig('default', [
    'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:587?tls=true',
]);
```

DSN 文字列を使用するときは、クエリー文字列引数として任意の追加のパラメーターやオプションを
定義することができます。

`static` Cake\\Mailer\\Mailer::**drop**($key)

設定が完了すると、トランスポートを変更することはできません。
トランスポートを変更するためには、まずこれを取り消してから再設定する必要があります。

### 独自のトランスポートの作成

SwiftMailer のような他のメールシステムを使うために独自のトランスポートを作成することができます。
トランスポートを作るためには、(Example という名前のトランスポートの場合）最初に
**src/Mailer/Transport/ExampleTransport.php** ファイルを作成してください。
作成開始時点のファイルは次のようになります。 :

``` php
namespace App\Mailer\Transport;

use Cake\Mailer\AbstractTransport;
use Cake\Mailer\Message;

class ExampleTransport extends AbstractTransport
{
    public function send(Message $message): array
    {
        // 何かをします。
    }
}
```

独自のロジックで、 `send(Mailer $mailer)` メソッドを実装してください。

## Mailerを利用しないメール送信

`Mailer` は、`Cake\Mailer\Message`、`Cake\Mailer\Renderer`、
および`Cake\Mailer\AbstractTransport` 間の橋渡しをするより高いレベルの抽象化クラスであり、
メールの設定と配信を簡単にするクラスです。

必要であれば、これらのクラスを `Mailer` で直接使用することもできます。

例 :

``` php
$render = new \Cake\Mailer\Renderer();
$render->viewBuilder()
    ->setTemplate('custom')
    ->setLayout('sparkly');

$message = new \Cake\Mailer\Message();
$message
    ->setFrom('admin@cakephp.org')
    ->setTo('user@foo.com')
    ->setBody($render->render());

$transport = new \Cake\Mailer\Transport\MailTransport();
$result = $transport->send($message);
```

`Renderer` の使用をスキップして、メッセージ本文を直接設定することもできます
`Message::setBodyText()` および `Message::setBodyHtml()` メソッドを使用します。

## メールのテスト

メールをテストするためには、テストケースに `Cake\TestSuite\EmailTrait` を追加します。
`MailerTrait` は、PHPUnitのフックを使用して、アプリケーションのメールトランスポートをプロキシに置き換えます。
プロキシはメールのメッセージをインターセプトし、配信されるメールに対してアサーションを実行することを可能とします。

テストケースにトレイトを追加してメールのテストを開始します。
メールでURLを生成する必要がある場合はルートを読み込みます。 :

``` php
namespace App\Test\TestCase\Mailer;

use App\Mailer\WelcomeMailer;
use App\Model\Entity\User;

use Cake\TestSuite\EmailTrait;
use Cake\TestSuite\TestCase;

class WelcomeMailerTestCase extends TestCase
{
    use EmailTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->loadRoutes();
    }
}
```

新しいユーザーが登録したときにウェルカムメールを配信するメーラーがあるとします。
件名と本文にユーザーの名前が含まれていることを確認したい場合は、以下のようにします。 :

``` php
//  WelcomeMailerTestCase クラスにて
public function testName()
{
    $user = new User([
        'name' => 'Alice Alittea',
        'email' => 'alice@example.org',
    ]);
    $mailer = new WelcomeMailer();
    $mailer->send('welcome', [$user]);

    $this->assertMailSentTo($user->email);
    $this->assertMailContainsText('こんにちは。' . $user->name);
    $this->assertMailContainsText('CakePHPへようこそ！');
}
```

## アサーションメソッド

`Cake\TestSuite\EmailTrait` トレイトは次のアサーションを提供します。 :

``` php
// 期待した数のメールが送信されたことをアサート
$this->assertMailCount($count);

// メールが送信されていないことをアサート
$this->assertNoMailSent();

// アドレスに対してメールが送信されたことをアサート
$this->assertMailSentTo($address);

// アドレスからメールが送信されたことをアサート
$this->assertMailSentFrom($address);

// メールに期待した内容が含まれていることをアサート
$this->assertMailContains($contents);

// メールに期待したHTMLコンテンツが含まれていることをアサート
$this->assertMailContainsHtml($contents);

// メールに期待したテキストコンテンツが含まれていることをアサート
$this->assertMailContainsText($contents);

// メールにメールゲッター内の期待値が含まれていることをアサート（例："subject"）
$this->assertMailSentWith($expected, $parameter);

// 特定のインデックスのメールがアドレスに対して送信されたことをアサート
$this->assertMailSentToAt($at, $address);

// 特定のインデックスのメールがアドレスから送信されたことをアサート
$this->assertMailSentFromAt($at, $address);

// 特定のインデックスのメールに期待した内容が含まれていることをアサート
$this->assertMailContainsAt($at, $contents);

// 特定のインデックスのメールに期待したHTMLコンテンツが含まれていることをアサート
$this->assertMailContainsHtmlAt($at, $contents);

// 特定のインデックスのメールに期待したテキストコンテンツが含まれていることをアサート
$this->assertMailContainsTextAt($at, $contents);

//  メールに添付ファイルが含まれていることをアサート
$this->assertMailContainsAttachment('test.png');

// 特定のインデックスのメールにメールゲッター内の期待値が含まれていることをアサート（例："subject"）
$this->assertMailSentWithAt($at, $expected, $parameter);
```
