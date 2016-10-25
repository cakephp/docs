CakeEmail
#########

.. php:class:: CakeEmail(mixed $config = null)

``CakeEmail`` は、メール送信の新しいクラスです。このクラスを使うと、アプリケーションの
任意の場所からメールを送信できます。コントローラの中で EmailComponent を使うことに加えて、
シェルやモデルからもメール送信できます。

このクラスは、 :php:class:`EmailComponent` を置き換えるもので、より柔軟にメール送信できます。
例えば、既存の SMTP や Mail トランスポートの代わりにメールを送信するための独自のトランスポートを
作成することができます。

基本的な使い方
==============

まず最初に、 :php:meth:`App::uses()` を使って、クラスがロードできるようにします。 ::

    App::uses('CakeEmail', 'Network/Email');

CakeEmail の使い方は、 :php:class:`EmailComponent` の使い方に似ていますが、
属性の代わりにメソッドを使用します。例::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'));
    $Email->to('you@example.com');
    $Email->subject('About');
    $Email->send('My message');

これを単純化にするため、すべてのセッターメソッドは、クラスのインスタンスを返します。
上記は以下のように書き換えられます。 ::

    $Email = new CakeEmail();
    $Email->from(array('me@example.com' => 'My Site'))
        ->to('you@example.com')
        ->subject('About')
        ->send('My message');

送り主の選択
-------------------

他の人々に代わってメールを送信するとき、Sender ヘッダーを使用して、元の送り主を定義することは
良い考えです。 ``sender()`` を使用して行えます。 ::

    $Email = new CakeEmail();
    $Email->sender('app@example.com', 'MyApp emailer');

.. note::

    別の人の代わりにメール送信するときに送り主 (envelop sender) をセットするのは良い考えです。
    これは、配信失敗に関するメッセージの受信を防ぐことができます。

設定
=============

データベースの設定と同様に、メールの設定は、一つのクラスの中に集約することができます。

``EmailConfig`` クラスとともに ``app/Config/email.php`` ファイルを作成してください。
``app/Config/email.php.default`` が、このファイルの参考になります。

``CakeEmail`` は、設定にアクセスするため ``EmailConfig`` のインスタンスを作成します。
もし、設定中に動的にデータをセットしたい場合、コンストラクターを使用することができます。 ::

    class EmailConfig {
        public function __construct() {
            // Do conditional assignments here.
        }
    }

``app/Config/email.php`` の作成は必須ではありません。 ``CakeEmail`` は、そのファイルを
使わずに使用できます。そして、全ての設定を別々にセットするために各々のメソッドを使用したり、
設定の配列をロードすることができます。

``EmailConfig`` から設定をロードするためには、 ``config()`` メソッドの使用したり、
``CakeEmail`` のコンストラクタで指定することができます。 ::

    $Email = new CakeEmail();
    $Email->config('default');

    //コンストラクタで指定::
    $Email = new CakeEmail('default');

    // 2.7 からは、未指定の場合 'default' 設定を使用
    $Email = new CakeEmail();

``EmailConfig`` 内に設定名の文字列をセットする代わりに、設定の配列をロードすることもできます。 ::

    $Email = new CakeEmail();
    $Email->config(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

    //または、コンストラクタ内で::
    $Email = new CakeEmail(array('from' => 'me@example.org', 'transport' => 'MyCustom'));

.. note::
    
    email のヘッダーや本文を記録するログレベルを設定するために ``$Email->config()``
    もしくはコンストラクタを使用してください。 ``$Email->config(array('log' => true));``
    を使用する時、 LOG_DEBUG を使用します。 ``CakeLog::write()`` をご覧ください。

Gmail のような SSL SMTP サーバの設定ができます。設定するためには、 ``'ssl://'`` のように
ホストのプレフィックスを付けて、対応するポート番号を設定します。例::

    class EmailConfig {
        public $gmail = array(
            'host' => 'ssl://smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp'
        );
    }

接続レベルの暗号化に TLS が使いたい場合は、 ``tls://`` を使用できます。

.. warning::
    あなたのグーグルアカウントでこれを動作させるためには安全性の低いアプリへのアクセスを
    有効にする必要があります: `安全性の低いアプリがアカウントにアクセスするのを許可する
    <https://support.google.com/accounts/answer/6010255?hl=ja>`__

.. note::

    ssl:// や tls:// の機能を使用するためには、 PHP インストール時に SSL 設定を行う
    必要があります。

2.3.0 では、 ``tls`` オプションを使用して STARTTLS SMTP 拡張を有効にできます。 ::

    class EmailConfig {
        public $gmail = array(
            'host' => 'smtp.gmail.com',
            'port' => 465,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'transport' => 'Smtp',
            'tls' => true
        );
    }

上記の設定は、Eメールのメッセージを STARTTLS 通信を有効化します。

.. versionadded:: 2.3
    2.3 から TLS 送信のサポートが追加されました。


.. _email-configurations:

設定
--------------

以下の設定キーを使用します。

- ``'from'``: 送信者のメールアドレスまたは配列。 ``CakeEmail::from()`` を参照。
- ``'sender'``: 実際の送信者のメールアドレスまたは配列。 ``CakeEmail::sender()`` を参照。
- ``'to'``: 宛先のメールアドレスまたは配列。 ``CakeEmail::to()`` を参照。
- ``'cc'``: CCのメールアドレスまたは配列。 ``CakeEmail::cc()`` を参照。
- ``'bcc'``: BCC のメールアドレスまたは配列。 ``CakeEmail::bcc()`` を参照。
- ``'replyTo'``: メールの返信先のメールアドレスまたは配列。 ``CakeEmail::replyTo()`` を参照。
- ``'readReceipt'``: 開封通知先メールアドレスまたはアドレスの配列。 ``CakeEmail::readReceipt()``
  を参照。
- ``'returnPath'``: エラーの返信先メールアドレスまたはアドレスの配列。 
  ``CakeEmail::returnPath()`` を参照。
- ``'messageId'``: メッセージID。 ``CakeEmail::messageId()`` を参照。
- ``'subject'``: メッセージのサブジェクト。 ``CakeEmail::subject()`` を参照。
- ``'message'``: メッセージ本文。レンダリングされた本文を使用する場合は、
  この項目を設定しないでください。
- ``'headers'``: ヘッダー情報。 ``CakeEmail::setHeaders()`` を参照。
- ``'viewRender'``: レンダリングされた本文を使用する場合は、ビュークラス名をセット。
  ``CakeEmail::viewRender()`` を参照。
- ``'template'``: レンダリングされた本文を使用する場合は、テンプレート名をセット。
  ``CakeEmail::template()`` を参照。
- ``'theme'``: テンプレートをレンダリングする際のテーマ。 ``CakeEmail::theme()`` を参照。
- ``'layout'``: レンダリングされた本文を使用する場合、描画するレイアウトをセット。
  レイアウトなしでテンプレートをレンダリングしたい場合は、このフィールドに null をセット。
  ``CakeEmail::template()`` を参照。
- ``'viewVars'``: レンダリングされた本文を使用する場合は、ビューで使用する変数の配列をセット。
  ``CakeEmail::viewVars()`` を参照。
- ``'attachments'``: 添付ファイルの一覧。 ``CakeEmail::attachments()`` を参照。
- ``'emailFormat'``: メールの書式 (html, text または both) ``CakeEmail::emailFormat()``
  を参照。
- ``'transport'``: トランスポート名。 ``CakeEmail::transport()`` を参照。
- ``'helpers'``: メールテンプレート内で使用するヘルパーの配列。

これらの設定の全ては ``'from'`` を除いてオプションです。多くの設定を配列で登録する場合、
設定は、 :php:meth:`CakeEmail::config()` メソッド内で行います。そして、
トランスポートクラスの ``config()`` に渡されます。例えば、SMTP トランスポートを使用している場合、
ホスト名、ポート、その他の設定を渡します。

.. note::

    メールアドレスや配列で使用する上記のキーの値 (from, to, cc 他）は、関連するメソッドの第一引数として
    渡されます。例をあげると ``CakeEmail::from('my@example.com', 'My Site')`` は、設定の中では
    ``'from' => array('my@example.com' => 'My Site')`` と定義されます。

ヘッダーのセット
-----------------

``CakeEmail`` の中に、自由にヘッダーをセットできます。CakeEmail を使用する際、
独自のヘッダーにプレフィックスの ``X-`` をつけることを忘れないでください。

``CakeEmail::setHeaders()`` と ``CakeEmail::addHeaders()`` をご覧ください。

テンプレートメールの送信
------------------------

メールは、ほとんどの場合シンプルなテキストメッセージです。それを容易にするために
CakePHP は、 :doc:`ビューレイヤー </views>` を使用してメールを送信することができます。

メールのテンプレートは、 あなたのアプリケーションの ``View`` ディレクトリ内の
``Emails`` と呼ばれる特別なフォルダに置かれます。メールのビューは、
普通のビューと同様にレイアウトとエレメントを使用します。 ::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

上記は、ビューとして ``app/View/Emails/html/welcome.ctp`` を使用し、
レイアウトとして ``app/View/Layouts/Email/html/fancy.ctp`` を使用します。
以下のように、マルチパートのテンプレートメールを送信することもできます。 ::

    $Email = new CakeEmail();
    $Email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

この例では、以下のビューファイルを使用します。

* ``app/View/Emails/text/welcome.ctp``
* ``app/View/Layouts/Emails/text/fancy.ctp``
* ``app/View/Emails/html/welcome.ctp``
* ``app/View/Layouts/Emails/html/fancy.ctp``

テンプレートメールを送信する時、 ``text`` 、 ``html`` と ``both`` のうちの
どれかを送信オプションとして指定します。

``CakeEmail::viewVars()`` でビューの変数をセットできます。 ::

    $Email = new CakeEmail('templated');
    $Email->viewVars(array('value' => 12345));

以下のようにメールテンプレート内で使用します。 ::

    <p>Here is your value: <b><?php echo $value; ?></b></p>

メールでも普通のビューファイルと同様にヘルパーを使用できます。
デフォルトでは、 :php:class:`HtmlHelper` のみがロードされます。 ``helpers()``
メソッドを使うことで追加でヘルパーをロードできます。 ::

    $Email->helpers(array('Html', 'Custom', 'Text'));

ヘルパーを設定する時は、'Html' を含めて下さい。そうしなければ、メールテンプレートに
ロードされません。

もし、プラグインの中でテンプレートを使用してメール送信したい場合、おなじみの :term:`プラグイン記法`
を使います。 ::

    $Email = new CakeEmail();
    $Email->template('Blog.new_comment', 'Blog.auto_message');

上記の例は、 Blog プラグインのテンプレートを使用しています。

いくつかのケースで、プラグインで用意されたデフォルトのテンプレートを上書きしたい場合が
あるかもしれません。 ``CakeEmail::theme()`` メソッドを使って適切なテーマを使用することを
CakeEmail に伝えることによって行います。 ::

    $Email = new CakeEmail();
    $Email->template('Blog.new_comment', 'Blog.auto_message');
    $Email->theme('TestTheme');

これは、Blog プラグインを更新せずにあなたのテーマの `new_comment` テンプレートで上書きできます。
テンプレートファイルは、以下のパスで作成する必要があります: 
``APP/View/Themed/TestTheme/Blog/Emails/text/new_comment.ctp``.

添付の送信
-------------------

.. php:method:: attachments($attachments = null)

メールにファイルを添付することができます。添付するファイルの種類や、
宛先のメールクライアントにどのようなファイル名で送りたいのかによって
幾つかの異なる書式があります。

1. 文字列: ``$Email->attachments('/full/file/path/file.png')`` は、
   file.png というファイル名でこのファイルを添付します。
2. 配列: ``$Email->attachments(array('/full/file/path/file.png'))`` は、
   文字列の場合と同じ振る舞いをします。
3. キー付き配列:
   ``$Email->attachments(array('photo.png' => '/full/some_hash.png'))`` は、
   photo.png というファイル名で some_hash.png ファイルを添付します。
   受信者からは、some_hash.png ではなく photo.png として見えます。
4. ネストした配列::

    $Email->attachments(array(
        'photo.png' => array(
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        )
    ));

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

.. versionchanged:: 2.3
    ``contentDisposition`` オプションが追加されました。

.. versionchanged:: 2.4
    ``data`` オプションが追加されました。

トランスポートの利用
--------------------

トランスポートは、様々なプロトコルや方法で E メールを送信するために設計されたクラスです。
CakePHP は、 Mail (デフォルト)、 Debug と SMTP トランスポートをサポートします。

これらの送信方法を設定するためには、 :php:meth:`CakeEmail::transport()` メソッドを
使用するか、設定内で transport を指定する必要があります。

独自のトランスポートの作成
~~~~~~~~~~~~~~~~~~~~~~~~~~

SwiftMailer のような他のメールシステムを使うために独自のトランスポートを作成することができます。
トランスポートを作るためには、(Example という名前のトランスポートの場合）最初に
``app/Lib/Network/Email/ExampleTransport.php`` ファイルを作成してください。 
作成開始時点のファイルは以下のようになります。 ::

    App::uses('AbstractTransport', 'Network/Email');

    class ExampleTransport extends AbstractTransport {

        public function send(CakeEmail $Email) {
            // magic inside!
        }

    }

独自のロジックで、 ``send(CakeEmail $Email)`` メソッドを実装してください。
オプションで、 ``config($config`` メソッドも実装できます。 ``config()`` は、
send() の前に呼ばれ、ユーザーの設定を受け取ることができます。デフォルトでは、
このメソッドは、 protected な変数 ``$_config`` に設定内容をセットします。

もし、送信前にトランスポート上のメソッドを追加で呼ぶ必要がある場合、
トランスポートのインスタンスを取得するために :php:meth:`CakeEmail::transportClass()`
が使えます。例::

    $yourInstance = $Email->transport('your')->transportClass();
    $yourInstance->myCustomMethod();
    $Email->send();

アドレスバリデーションの緩和
---------------------------------

.. php:method:: emailPattern($pattern = null)

もし、規約に準拠していないアドレスに送信するときにバリデーションに問題がある場合、
メールアドレスのバリデーションに使用するパターンを緩和することができます。
いくつかの日本の ISP に送信するときに必要になります。 ::

    $email = new CakeEmail('default');

    // 規約に準拠しないアドレスに送信できるように
    // メールのパターンを緩和します。
    $email->emailPattern($newPattern);

.. versionadded:: 2.4


メッセージの即時送信
========================

しばしば、メールの素早い送信が必要で、送信ごとに毎回設定のセットアップが必要ないことがあります。
そのような目的のために :php:meth:`CakeEmail::deliver()` が用意されています。

``EmailConfig`` 内で設定を作成したり、 ``CakeEmail::deliver()`` スタティックメソッドに
すべての必要なオプションを配列で指定することができます。 例::

    CakeEmail::deliver('you@example.com', 'Subject', 'Message', array('from' => 'me@example.com'));

このメソッドは、 you@example.com 宛に、 me@example.com から、サブジェクト「Subject」、
本文「Message」でメールを送信します。

``deliver()`` の戻り値は、 すべての設定を持つ :php:class:`CakeEmail` インスタンスです。
もし、メールを送信せず送信前に幾つか設定変更したい場合、第５引数に false
をセットしてインスタンスを取得してください。

第３引数には、メッセージの本文か、レンダリングされた本文を使用時には変数の配列を指定します。

第４引数は、設定の配列や ``EmailConfig`` 内の設定名の文字列を指定します。

もしあなたが望むのなら、サブジェクトと本文に null をセットして、すべての設定を
(配列か ``EmailConfig`` を使用して)第４引数で指定できます。


CLI からのメール送信
=======================

.. versionchanged:: 2.2

    ``domain()`` メソッドは、 2.2 で追加されました。

シェルやタスクなどの CLI スクリプトでメールを送信するとき、CakeEmail に使用するドメイン名を
セットしなければなりません。(ホスト名が CLI 環境にないとき) ドメイン名は、メッセージ ID
のホスト名として使用されます。 ::

    $Email->domain('www.example.org');
    // メッセージ ID は ``<UUID@>`` (無効) の代わりに、
    // ``<UUID@www.example.org>`` (有効) を返します。

正しいメッセージ ID は、スパムフォルダーへ振り分けられることを防ぐのに役立ちます。
メール本文にリンクを生成したい場合、 ``App.fullBaseUrl`` を設定する必要があります。

.. meta::
    :title lang=ja: CakeEmail
    :keywords lang=ja: sending mail,email sender,envelope sender,php class,database configuration,sending emails,meth,shells,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
