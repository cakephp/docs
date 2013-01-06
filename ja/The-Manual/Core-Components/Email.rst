電子メール
##########

電子メール(\ *Email*)コンポーネントは、シンプルなメール送信機能を
CakePHP アプリケーションに付け加えます。レイアウトとビューにおける ctp
ファイルと同じ考えを使って、テキスト、 HTML
またはその両方を送信できます。 PHP にビルトインされている mail 関数や
SMTP
サーバを使用する送信がサポートされています。また、フラッシュメッセージを使ったデバッグモードも備えています。ファイル添付や、いくつかの基本的なヘッダのチェックやフィルタリングをサポートしています。できないこともいろいろありますが、すぐに利用できます。

クラスの属性と変数
==================

``EmailComponent::send()`` を呼び出す前にセットする値があります。

to

メッセージを送信するアドレス。文字列。

cc

メッセージを CC で送信する複数のアドレスを配列でセットする。

bcc

メッセージを BCC(\ *blind carbon copy*)
で送信する複数のアドレスを配列でセットする。

replyTo

返信先のアドレス。文字列。

from

送信元のアドレス。文字列。

subject

メッセージの件名。文字列。

template

``app/views/elements/email/html/`` と ``app/views/elements/email/text/``
に設置する、 Email メッセージの要素。

layout

``app/views/layouts/email/html/`` と ``app/views/layouts/email/text/``
に設置する、 Email のレイアウト。

lineLength

自動的に改行を入れる長さ。デフォルトは70。整数。

sendAs

どのようにメッセージを送信するかの指定。\ ``text``\ (テキスト)、``html``\ (HTML)
または ``both``\ (両方) のいずれかを指定する。

attachments

添付するファイルを配列でセットする。絶対または相対パスを指定。

delivery

どのようにメッセージを送信するかをセットする。 ``mail``\ 、
``smtp``\ (これを選ぶには smtpOptions の設定が必須。)、 ``debug``
のいずれかを指定。

smtpOptions

SMTP メーラーのための設定を連想配列でセットする。 ``port``\ 、
``host``\ 、 ``timeout``\ 、 ``username``\ 、 ``password``
をセットする。

他にも設定できる項目がありますが、詳しくは API
ドキュメントを参照してください。

複数の電子メールをループで送信する
----------------------------------

複数の電子メールをループを使って送信するには、電子メールのフィールドをリセットするため、
Email コンポーネントの reset
メソッドを呼び、プロパティを再度設定しなおす必要があります。

::

    $this->Email->reset()

基本的なメッセージを送信する
============================

テンプレートを使わずメッセージを送信するには、本文を単純に文字列で
send() メソッドに渡してください。次のようになります。

::

    $this->Email->from    = 'Somebody <somebody@example.com>';
    $this->Email->to      = 'Somebody Else <somebody.else@example.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Hello message body!');

レイアウトのセットアップ
------------------------

テキストと HTML
の両方でメールを送信する場合、それらに対するレイアウトファイルを用意する必要があり、それらのレイアウトを電子メールメッセージのデフォルトに指定しなければなりません。これらのレイアウトファイルは、ブラウザにビューで表示する時にセットアップするものと同じようなものです。最小構成で、
``app/views/layouts/``
ディレクトリに次のような構造でセットアップする必要があります。

::

        email/
            html/
                default.ctp
            text/
                default.ctp

これらのファイルは、デフォルトのメッセージのためのレイアウトテンプレートです。例は次のようになります。

``email/text/default.ctp``

::

        <?php echo $content_for_layout; ?>

``email/html/default.ctp``

::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>

メッセージ本文用に電子メールの要素をセットアップする
----------------------------------------------------

``app/views/elements/email/`` に ``text`` と ``html``
というフォルダを作成します。どちらか片方だけ送信するという場合でない限り、両方作成します。両方のフォルダで、
``$this->set()`` または send() メソッドの ``$contents``
パラメータを参照するテンプレートを作成してください。簡単な例を次に示します。この例において、テンプレート名は
``simple_message.ctp`` とします。

``text``

::

     Dear <?php echo $User['first']. ' ' . $User['last'] ?>,
       Thank you for your interest.

``html``

::

     <p>Dear <?php echo $User['first']. ' ' . $User['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>

コントローラ
------------

このコンポーネントを使うには、コントローラ中で ``$components``
配列に要素を追記するか、配列そのものを新規作成します。

::

    <?php
    var $components = array('Email');
    ?>

この例では、 $id
で識別したユーザに電子メールメッセージを送信するプライベートなメソッドを作成しています。(この例は
User モデルを使うコントローラ中であることを前提としています。)

::

     
    <?php
    function _sendNewUserMail($id) {
        $User = $this->User->read(null,$id);
        $this->Email->to = $User['User']['email'];
        $this->Email->bcc = array('secret@example.com');  
        $this->Email->subject = 'Welcome to our really cool thing';
        $this->Email->replyTo = 'support@example.com';
        $this->Email->from = 'Cool Web App <app@example.com>';
        $this->Email->template = 'simple_message'; // note no '.ctp'
        // 'html'(HTML)、'text'(テキスト)、または'both'(両方)で送信。(デフォルトは 'text')。
        $this->Email->sendAs = 'both'; // 良い感じのメールを送りたいのでこうします。
        // ビュー変数をいつもどおりに渡す。
        $this->set('User', $User);
        // send() に変数を渡さないでください。
        $this->Email->send();
     }
    ?>

メッセージが送信できたら、他のメソッドから呼び出すことが出来ます

::

     
    $this->_sendNewUserMail( $this->User->id );

SMTP を使用してメールを送信する
===============================

SMTP
サーバを利用して電子メールを送信するには、まず基本的なメッセージの送信と同じようなセットアップを行います。そして送信するメソッドに
``smtp`` をセットし、 Email オブジェクトの ``smtpOptions``
プロパティに必要な値をセットします。 SMTP
エラーが発生したら、コンポーネントに ``smtpError``
プロパティが生成されますので、それでエラー内容を確認してください

::

       /* SMTP のオプション */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'your.smtp.server',
            'username'=>'your_smtp_username',
            'password'=>'your_smtp_password');

        /* 送信のメソッドをセットする */
        $this->Email->delivery = 'smtp';

        /* send() に変数を渡さないでください。 */
        $this->Email->send();

        /* SMTP エラーを確認する。 */
        $this->set('smtp-errors', $this->Email->smtpError);

使用する SMTP サーバが認証を必要とするなら、例の中に登場する
``smtpOptions`` の username と password
というパラメータの定義を忘れないようにしてください。
