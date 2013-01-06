セッション
##########

セッション(\ *Session*)コンポーネントに自然に相当するものとして、セッションヘルパーはコンポーネントの機能の多くの部分を実現し、ビューの中で使えるようにします。セッションヘルパーは自動的にビューに追加されるので、コントローラの
``$helpers`` に追加する必要はありません。

セッションヘルパーとセッションコンポーネントの大きな違いは、ヘルパーはセッションに値を書き込むことができ\ *ない*\ ということです。

セッションコンポーネントによって、ドット区切りの記法でデータを書き込みと読み込みを行います。

::

        array('User' => 
                array('username' => 'super@example.com')
        );

この配列の構造において、ネストされた配列であることをドットで示す「User.username」によってノードにアクセスすることができます。この記法は
$key が使われるセッションヘルパーの全てのメソッドで使用します。

メソッド
========

read($key)

セッションを読み込む。セッションのコンテンツに依存し、文字列または配列を返します。

id()

現在のセッション ID を返します。

check($key)

キーがセッションに存在するかどうか調べます。キーの存在をブール値で返します。

flash($key)

$\_SESSION.Message の内容を出力します。これはセッションコンポーネントの
setFlash() メソッドと関連して使用されます。

error()

もし存在すれば、セッション中の最新のエラーを返します。

flash
=====

flash メソッドは ``setFlash()``
でセットされたデフォルトのキーを利用します。セッション中の特定のキーを検索することができます。例えば、
Auth
コンポーネントは、自身のセッションメッセージを全て「auth」キーにセットします。

::

    // コントローラのコード
    $this->Session->setFlash('My Message');

    // ビューの中
    $session->flash();
    // "<div id='flashMessage' class='message'>My Message</div>" を出力する

    // もしセットされていれば、 AuthComponent のセッションメッセージを出力する
    $session->flash('auth');

Using Flash for Success and Failure
-----------------------------------

In some web sites, particularly administration backoffice web
applications it is often expected that the result of an operation
requested by the user has associated feedback as to whether the
operation succeeded or not. This is a classic usage for the flash
mechanism since we only want to show the user the result once and not
keep the message.

One way to achieve this is to use Session->flash() with the layout
parameter. With the layout parameter we can be in control of the
resultant html for the message.

In the controller you might typically have code:

::

    if ($user_was_deleted) {
        $this->Session->setFlash('The user was deleted successfully.', 'flash_success');
    } else {
        $this->Session->setFlash('The user could not be deleted.', 'flash_failure');
    }

The flash\_success and flash\_failure parameter represents a layout file
to place in the root app/views/layouts folder, e.g.
app/views/layouts/flash\_success.ctp,
app/views/layouts/flash\_failure.ctp

Inside the flash\_success layout file would be something like this:

::

        echo "<div class=\"flash flash_success\">{$content_for_layout}</div>";

The final step is in your main view file where the result is to be
displayed to add simply

::

    <?php $session->flash(); ?>

And of course you can then add to your CSS a selector for div.flash,
div.flash\_success and div.flash\_failure
