Email
#####

.. php:namespace:: Cake\Mailer

.. warning::
    バージョン 3.1 以前では、 ``Email`` と ``Transport`` クラスは
    ``Cake\Mailer`` 名前空間の代わりに ``Cake\Network\Email`` 名前空間の下にありました。

.. php:class:: Email(mixed $profile = null)

``Email`` は、メール送信の新しいクラスです。このクラスを使用すると、
アプリケーションの任意の場所からメール送信できます。

基本的な使用法
==============

まず最初に、クラスがロードされていることを確認する必要があります。 ::

    use Cake\Mailer\Email;

``Email`` をロードしたら、次のようにメールを送信することができます。 ::

    $email = new Email('default');
    $email->setFrom(['me@example.com' => 'My Site'])
        ->setTo('you@example.com')
        ->setSubject('About')
        ->send('My message');

``Email`` のセッターメソッドは、クラスのインスタンスを返すので、
メソッド・チェーンでプロパティを設定することができます。

``Email`` は、受信者を定義するためのいくつかの方法があります - ``setTo()`` 、 ``setCc()`` 、
``setBcc()`` 、 ``addTo()`` 、 ``addCc()`` そして ``addBcc()`` 。主な違いは最初の3つは、
すでに設定されていたものを上書きし、後者は単にそれぞれのフィールドに複数の受信者を追加することです。 ::

    $email = new Email();
    $email->setTo('to@example.com', 'To Example');
    $email->addTo('to2@example.com', 'To2 Example');
    // メールの To 受信者は to@example.com と to2@example.com
    $email->setTo('test@example.com', 'ToTest Example');
    // メールの To 受信者は test@example.com

送り主の選択
------------

他の人々に代わってメールを送信するとき、Sender ヘッダーを使用して、
元の送り主を定義することは良い考えです。 ``setSender()`` を使用して行えます。 ::

    $email = new Email();
    $email->setSender('app@example.com', 'MyApp emailer');

.. note::

    別の人の代わりにメール送信するときに送り主 (envelop sender) をセットするのは良い考えです。
    これは、配信失敗に関するメッセージの受信を防ぐことができます。

.. _email-configuration:

設定
====

``Email`` のデフォルトの設定は、 ``config()`` と ``configTransport()`` を使用して作成されます。
**config/app.php** ファイルにメールの設定を書いておきましょう。
**config/app.default.php** ファイルは、このファイルの設定例です。
**config/app.php** にメール設定を定義することは必須ではありません。
``Email`` はそのファイルの設定なしでも利用可能で、すべての構成を個別に設定したり、
設定の配列をロードするためのメソッドを使用ことができます。

プロファイルおよびトランスポートを定義することにより、アプリケーションコードにおいて
設定データの自由を保ち、メンテナンスおよび配備をより困難にする重複を避けることができます。

あらかじめ定義された設定をロードするには、 ``setProfile()`` メソッドを使用するか、
または ``Email`` のコンストラクタに渡すことができます。 ::

    $email = new Email();
    $email->setProfile('default');

    // または、コンストラクタ内で
    $email = new Email('default');

設定名の文字列を渡す代わりに、オプションの配列をロードすることもできます。 ::

    $email = new Email();
    $email->setProfile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // または、コンストラクタ内で
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. versionchanged:: 3.1
    ``Email`` インスタンスが作成された時に ``default`` メールプロファイルが自動的に設定されます。

トランスポートの設定
--------------------

.. php:staticmethod:: setConfigTransport($key, $config)

メールメッセージは、トランスポートによって配信されます。さまざまなトランスポートを使用すると、
PHP の ``mail()`` 関数や SMTP サーバでメッセージを送信したり、
デバッグが捗るようメッセージを送信しないこともできます。トランスポートを設定すると、
アプリケーションのコードの外に、設定データを保持することができ、
単純に設定データを変更できるのでデプロイが簡単になります。
トランスポートの設定例は、次のようになります。 ::

    use Cake\Mailer\Email;

    // サンプル Mail 設定
    Email::setConfigTransport('default', [
        'className' => 'Mail'
    ]);

    // サンプル SMTP 設定
    Email::setConfigTransport('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

Gmail のように、SSL SMTP サーバを設定することができます。これを行うには、 host に
``ssl://`` プレフィックスをつけて、それに伴い port の値を設定してください。
また、 ``tls`` オプションを使用して TLS SMTP を有効にすることもできます。 ::

    use Cake\Mailer\Email;

    Email::setConfigTransport('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

上記の設定では、メールメッセージの TLS 通信を可能にします。

.. warning::
    あなたのグーグルアカウントでこれを動作させるためには安全性の低いアプリへのアクセスを
    有効にする必要があります: `安全性の低いアプリがアカウントにアクセスするのを許可する
    <https://support.google.com/accounts/answer/6010255>`__ 。

.. note::

    SSL + SMTP を使用するには、PHP のインストール時に SSL が設定されている必要があります。

設定オプションは、 :term:`DSN` 文字列として指定することもできます。
これは、環境変数を使ったり :term:`PaaS` プロバイダで動作する場合に便利です。 ::

    Email::setConfigTransport('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:465?tls=true',
    ]);

DSN 文字列を使用するときは、クエリ文字列引数として任意の追加のパラメータやオプションを
定義することができます。

.. php:staticmethod:: dropTransport($key)

設定が完了すると、トランスポートを変更することはできません。
トランスポートを変更するためには、まずこれを取り消してから再設定する必要があります。

.. _email-configurations:

設定プロファイル
----------------

配信プロファイルを定義すると、再利用可能なプロファイルに共通のメール設定を統合することができます。
アプリケーションは、必要な数のプロファイルを持つことができます。次の設定キーが使用されます。

- ``'from'``: 送信者のメールアドレスまたは配列。 ``Email::setFrom()`` を参照。
- ``'sender'``: 実際の送信者のメールアドレスまたは配列。 ``Email::setSender()`` を参照。
- ``'to'``: 宛先のメールアドレスまたは配列。 ``Email::setTo()`` を参照。
- ``'cc'``: CC のメールアドレスまたは配列。 ``Email::setCc()`` を参照。
- ``'bcc'``: BCC のメールアドレスまたは配列。 ``Email::setBcc()`` を参照。
- ``'replyTo'``: メールの返信先のメールアドレスまたは配列。 ``Email::setReplyTo()`` を参照。
- ``'readReceipt'``: 開封通知先メールアドレスまたはアドレスの配列。 ``Email::setReadReceipt()`` を参照。
- ``'returnPath'``: エラーの返信先メールアドレスまたはアドレスの配列。 ``Email::setReturnPath()`` を参照。
- ``'messageId'``: メールのメッセージID。 ``Email::setMessageId()`` を参照。
- ``'subject'``: メッセージのサブジェクト。 ``Email::setSubject()`` を参照。
- ``'message'``: メッセージ本文。レンダリングされた本文を使用する場合は、 この項目を設定しないでください。
- ``'priority'``: メールの優先度 (数値。通常は 1 から 5 で、1 が最高)。
- ``'headers'``: ヘッダー情報。 ``Email::setHeaders()`` を参照。
- ``'viewRender'``: レンダリングされた本文を使用する場合は、ビュークラス名をセット。
  ``Email::setViewRender()`` を参照。
- ``'template'``: レンダリングされた本文を使用する場合は、テンプレート名をセット。
  ``Email::setTemplate()`` を参照。
- ``'theme'``: テンプレートをレンダリングする際のテーマ。 ``Email::setTheme()`` を参照。
- ``'layout'``: レンダリングされた本文を使用する場合、描画するレイアウトをセット。
  レイアウトなしでテンプレートをレンダリングしたい場合は、このフィールドに null をセット。
  ``Email::setLayout()`` を参照。
- ``'viewVars'``: レンダリングされた本文を使用する場合は、ビューで使用する変数の配列をセット。
  ``Email::setViewVars()`` を参照。
- ``'attachments'``: 添付ファイルの一覧。 ``Email::setAttachments()`` を参照。
- ``'emailFormat'``: メールの書式 (html, text または both) ``Email::setEmailFormat()`` を参照。
- ``'transport'``: トランスポート名。 :php:meth:`~Cake\\Mailer\\Email::setConfigTransport()` を参照。
- ``'log'``: メールヘッダとメッセージをログに記録するログレベル。
  ``true`` なら LOG_DEBUG を使用します。 ``CakeLog::write()`` を参照。
- ``'helpers'``: メールテンプレート内で使用するヘルパーの配列。 ``Email::setHelpers()`` 。

これらの設定の全ては ``'from'`` を除いてオプションです。

.. note::

    メールアドレスや配列で使用する上記のキーの値 (from, to, cc 他）は、関連するメソッドの第一引数として
    渡されます。例をあげると ``Email::setFrom('my@example.com', 'My Site')`` は、設定の中では
    ``'from' => ['my@example.com' => 'My Site']`` と定義されます。

ヘッダの設定
============

``Email`` の中に、自由にヘッダーをセットできます。Email を使用する際、
独自のヘッダーにプレフィックスの ``X-`` をつけることを忘れないでください。

``Email::setHeaders()`` と ``Email::addHeaders()`` を参照してください。

テンプレートメールの送信
========================

メールはしばしば単純なテキストメッセージを超えたものになります。それを容易にするために
CakePHP は、 :doc:`ビューレイヤー </views>` を使用してメールを送信することができます。

メールのテンプレートは、 あなたのアプリケーションの ``Template`` ディレクトリ内の
``Email`` と呼ばれる特別なフォルダに置かれます。メールのビューは、
普通のビューと同様にレイアウトとエレメントを使用します。 ::

    $email = new Email();
    $email
        ->setTemplate('welcome')
        ->setLayout('fancy')
        ->setEmailFormat('html')
        ->setTo('bob@example.com')
        ->setFrom('app@domain.com')
        ->send();

上記は、ビューとして **src/Template/Email/html/welcome.ctp** を使用し、
レイアウトとして **src/Template/Layout/Email/html/fancy.ctp** を使用します。
以下のように、マルチパートのテンプレートメールを送信することもできます。 ::

    $email = new Email();
    $email
        ->setTemplate('welcome')
        ->setLayout('fancy')
        ->setEmailFormat('both')
        ->setTo('bob@example.com')
        ->setFrom('app@domain.com')
        ->send();

この例では、次のテンプレートファイルを使用します。

* **src/Template/Email/text/welcome.ctp**
* **src/Template/Layout/Email/text/fancy.ctp**
* **src/Template/Email/html/welcome.ctp**
* **src/Template/Layout/Email/html/fancy.ctp**

テンプレートメールを送信する時、 ``text`` 、 ``html`` と ``both`` のうちの
どれかを送信オプションとして指定します。

``Email::setViewVars()`` でビューの変数をセットできます。 ::

    $email = new Email('templated');
    $email->setViewVars(['value' => 12345]);

以下のようにメールテンプレート内で使用します。 ::

    <p>あなたの値は次のとおりです: <b><?= $value ?></b></p>

メールでも普通のテンプレートファイルと同様にヘルパーを使用できます。
デフォルトでは、 ``HtmlHelper`` のみがロードされます。 
``setHelpers()`` メソッドを使うことで追加でヘルパーをロードできます。 ::

    $email->setHelpers(['Html', 'Custom', 'Text']);

ヘルパーを設定する時は、’Html’ を含めて下さい。そうしなければ、メールテンプレートにロードされません。

もし、プラグインの中でテンプレートを使用してメール送信したい場合、おなじみの :term:`プラグイン記法`
を使います。 ::

    $email = new Email();
    $email->setTemplate('Blog.new_comment');
    $email->setLayout('Blog.auto_message');

上記の例は、 Blog プラグインのテンプレートとレイアウトを使用しています。

いくつかのケースで、プラグインで用意されたデフォルトのテンプレートを上書きしたい場合があるかもしれません。
``Email::setTheme()`` メソッドを使って適切なテーマを使用することを Email に伝えることによって行います。 ::

    $email = new Email();
    $email->setTemplate('Blog.new_comment');
    $email->setLayout('Blog.auto_message');
    $email->setTheme('TestTheme');

これは、Blog プラグインを更新せずにあなたのテーマの ``new_comment`` テンプレートで上書きできます。
テンプレートファイルは、以下のパスで作成する必要があります:
**src/Template/Plugin/TestTheme/Plugin/Blog/Email/text/new_comment.ctp**

添付ファイルの送信
==================

.. php:method:: setAttachments($attachments)

メールにファイルを添付することができます。添付するファイルの種類や、
宛先のメールクライアントにどのようなファイル名で送りたいのかによって幾つかの異なる書式があります。

1. 文字列: ``$email->setAttachments('/full/file/path/file.png')`` は、
   file.png というファイル名でこのファイルを添付します。
2. 配列: ``$email->setAttachments(['/full/file/path/file.png'])`` は、
   文字列の場合と同じ振る舞いをします。
3. キー付き配列:
   ``$email->setAttachments(['photo.png' => '/full/some_hash.png'])`` は、
   photo.png というファイル名で some_hash.png ファイルを添付します。
   受信者からは、some_hash.png ではなく photo.png として見えます。
4. ネストした配列::

    $email->setAttachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

   上記は、異なる mimetype と独自のコンテンツID を添付します
   (添付をインラインに変換する場合にコンテンツIDをセットします)。
   mimetype と contentId はこの形式のオプションです。

   4.1. ``contentId`` を指定した時、HTML 内で ``<img src="cid:my-content-id">``
   のようにファイルを使用できます。

   4.2. 添付の ``Content-Disposition`` ヘッダーを無効にするために
   ``contentDisposition`` オプションを使用できます。これは、outlook を使って
   ical の招待状をクライアントに送る時に便利です。

   4.3. ``file`` オプションの代わりに ``data`` オプションを使うと、
   ファイル本文を文字列として添付することができます。これは、ファイルパスを指定せずに
   添付することができます。

トランスポートの使用
====================

トランスポートは、様々なプロトコルや方法でメールを送信するために設計されたクラスです。
CakePHP は、 Mail (デフォルト)、 Debug と SMTP トランスポートをサポートします。

これらの送信方法を設定するためには、 :php:meth:`Cake\\Mailer\\Email::setTransport()`
メソッドを使用するか、設定内で transport を指定する必要があります。 ::

    $email = new Email();

    // Email::setConfigTransport() を使ってすでに設定されたトランスポート名を使用
    $email->setTransport('gmail');

    // 構築されたオブジェクトを使用
    $transport = new DebugTransport();
    $email->setTransport($transport);

独自のトランスポートの作成
--------------------------

SwiftMailer のような他のメールシステムを使うために独自のトランスポートを作成することができます。
トランスポートを作るためには、(Example という名前のトランスポートの場合）最初に
**src/Mailer/Transport/ExampleTransport.php** ファイルを作成してください。
作成開始時点のファイルは次のようになります。 ::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Email;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Email $email)
        {
            // 何かをします。
        }
    }

独自のロジックで、 ``send(Email $email)`` メソッドを実装してください。
オプションで、 ``setConfig($config)`` メソッドも実装できます。
``setConfig()`` は、 send() の前に呼ばれ、ユーザーの設定を受け取ることができます
デフォルトでは、このメソッドは、 protected な変数 ``$_config`` に設定内容をセットします。

もし、送信前にトランスポート上のメソッドを追加で呼ぶ必要がある場合、
トランスポートのインスタンスを取得するために :php:meth:`Cake\\Mailer\\Email::getTransport()`
が使えます。例::

    $yourInstance = $email->getTransport()->transportClass();
    $yourInstance->myCustomMethod();
    $email->send();

アドレス検証ルールの緩和
------------------------

.. php:method:: setEmailPattern($pattern)

もし、規約に準拠していないアドレスに送信するときにバリデーションに問題がある場合、
メールアドレスのバリデーションに使用するパターンを緩和することができます。
いくつかの日本の ISP に送信するときに必要になります。 ::

    $email = new Email('default');

    // 規約に準拠しないアドレスに送信できるように
    // メールのパターンを緩和します。
    $email->setEmailPattern($newPattern);


メッセージの即時送信
====================

しばしば、メールの素早い送信が必要で、送信ごとに毎回設定のセットアップが必要ないことがあります。
そのような目的のために :php:meth:`Cake\\Mailer\\Email::deliver()` が用意されています。

:php:meth:`Cake\\Mailer\\Email::config()` で設定を作成したり、
``Email::deliver()`` スタティックメソッドにすべての必要なオプションを配列で指定することができます。
例::

    Email::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);

このメソッドは、 you@example.com 宛に、 me@example.com から、サブジェクト「Subject」、
本文「Message」でメールを送信します。

``deliver()`` の戻り値は、 すべての設定を持つ :php:class:`Cake\\Mailer\\Email` インスタンスです。
もし、メールを送信せず送信前に幾つか設定変更したい場合、第５引数に ``false`` をセットしてインスタンスを
取得してください。

第３引数には、メッセージの本文か、レンダリングされた本文を使用時には変数の配列を指定します。

第４引数は、設定の配列や ``Configure`` 内の設定名の文字列を指定します。

もしあなたが望むのなら、サブジェクトと本文に null をセットして、すべての設定を
(配列か ``Configure`` を使用して) 第４引数で指定できます。
全ての設定を知るために :ref:`設定 <email-configurations>` 一覧を確認してください。


CLI からのメール送信
====================

シェルやタスクなどの CLI スクリプトでメールを送信するとき、CakeEmail に使用するドメイン名を
セットしなければなりません。(ホスト名が CLI 環境にないとき) ドメイン名は、メッセージ ID
のホスト名として使用されます。 ::

    $email->setDomain('www.example.org');
    // メッセージ ID は ``<UUID@>`` (無効) の代わりに、
    // ``<UUID@www.example.org>`` (有効) を返します。

正しいメッセージ ID は、迷惑メールフォルダーへ振り分けられることを防ぐのに役立ちます。


再利用可能なメールの作成
========================

.. versionadded:: 3.1.0

Mailer は、アプリケーション全体で再利用可能なメールを作成することができます。
また、一ヶ所に複数のメール設定を格納するために使用することができます。
これは、コードを DRY に保つことができますし、アプリケーション内の他の領域から、
メールの設定ノイズを除外します。

この例では、ユーザー関連のメールが含まれている ``Mailer`` を作成します。
``UserMailer`` を作成するには、 **src/Mailer/UserMailer.php** ファイルを作成します。
ファイルの内容は次のようになります。 ::

    namespace App\Mailer;

    use Cake\Mailer\Mailer;

    class UserMailer extends Mailer
    {
        public function welcome($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject(sprintf('Welcome %s', $user->name))
                ->setTemplate('welcome_mail') // デフォルトでテンプレートはメソッドと同じ名前が使われます。
                ->setLayout('custom');
        }

        public function resetPassword($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject('Reset password')
                ->set(['token' => $user->token]);
        }
    }

この例では、2つのメソッドを作成しました。１つは、ウェルカムメールを送信するため、もう１つは、
パスワードのリセットメールを送信するためのものです。これらの各メソッドは、
ユーザー ``Entity`` を受け取り、各メールを設定するために、そのプロパティを利用しています。

これで、アプリケーション内のどこからでも、ユーザー関連のメールを送信するために
``UserMailer`` を使用することができます。例えば、ウェルカムメールを送信したいのであれば、
以下のようにするとよいでしょう。 ::

    namespace App\Controller;

    use Cake\Mailer\MailerAwareTrait;

    class UsersController extends AppController
    {
        use MailerAwareTrait;

        public function register()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData())
                if ($this->Users->save($user)) {
                    $this->getMailer('User')->send('welcome', [$user]);
                }
            }
            $this->set('user', $user);
        }
    }

アプリケーションのコードからユーザへのウェルカムメールの送信を完全に分離したい場合、
``UserMailer`` が ``Model.afterSave`` イベントを受け取ることができます。
イベントを受け取ることによって、アプリケーションのユーザ関連のクラスは、
メール関連のロジックや命令から完全に解放されます。
たとえば、 ``UserMailer`` に以下を追加することができます。 ::

    public function implementedEvents()
    {
        return [
            'Model.afterSave' => 'onRegistration'
        ];
    }

    public function onRegistration(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }


.. meta::
    :title lang=ja: Email
    :keywords lang=ja: sending mail,email sender,envelope sender,php class,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
