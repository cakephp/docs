セッション
##########

CakePHP
のセッション(\ *Session*)コンポーネントは、一つのクライアントが複数のページに遷移する間、ある特定のデータを継続して保持する方法を提供します。このコンポーネントは
$\_SESSION
変数に関連したいくつかの便利なメソッドを持つラッパのように振舞います。

セッションを保持するには、いくつかの方法があります。デフォルトは PHP
によって提供される方法で、他にも選択肢が存在します。

cake
    セッションをファイルとして app の tmp/sessions
    ディレクトリに保存します。
database
    セッションを CakePHP のデータベースに保存します。
cache
    Cache::config()
    で設定されたキャッシュエンジンを使います。キャッシュしたデータとセッションを格納するために、複数のアプリケーションサーバから使えるようセットアップした
    Memcache を利用する場合にとても便利です。
php
    デフォルトではこの設定になっています。php.ini
    の設定に従い、セッションファイルを保存します。

デフォルトのセッションハンドリングのメソッドを切り替えるには、
Session.save
の設定を変更してください。もし「database」を選択するのなら、「Session.database」設定のコメントを外し、
app/config にある SQL ファイルを実行してください。

メソッド
========

セッションコンポーネントは、セッション情報を相互的にやりとりするために使用します。
このコンポーネントには、基本的な CRUD
の機能、ユーザに対するフィードバックメッセージの作成機能が含まれます。

セッション中に配列の構造のデータを保存したい場合は、ドット区切りの記法を用いることに注意してください。
たとえば、セッション中で「User.username」となっているデータは、次のようにすることで参照します。

::

        array('User' => 
                array('username' => 'clarkKent@dailyplanet.com')
        );

ドットはネストされた配列を示します。
この記法はセッションコンポーネントのメソッドで $name
と書かれたところ全てで使用されます。

write
-----

``write($name, $value)``

セッションの $name で指定されたものに $value の値を書き込みます。
次の例の通り、 $name にはドット区切りで配列が指定できます。

::

    $this->Session->write('Person.eyeColor', 'Green');

この例では、セッションの「Person =>
eyeColor」に、「Green」という値を書き込んでいます。

setFlash
--------

``setFlash($message, $layout = 'default', $params = array(), $key = 'flash')``

ビューで出力するために使用するセッション変数をセットします。$layout で
``/app/views/layouts``
にあるものを指定することで、メッセージを表示する時にどのレイアウトを使用するかをコントロールできます。\ ``$layout``
を「default」のままにしておいた場合、メッセージは次のコードでラップされます。

::

    <div id="flashMessage" class="message"> [message] </div>

$params
では、表示されるレイアウトに追加のビュー変数を渡すことができます。$key
には Message 配列の $messages
インデックスをセットします。デフォルトは「flash」です。

パラメータでは、レンダリングされる div
タグに影響を与えることができます。たとえば、 $params
配列に「class」をキーとして値を与えると、 ``$session->flash()``
で出力したレイアウトの ``div`` タグの中に class 属性を付与します。

::

    $this->Session->setFlash('メッセージテキストの例', 'default', array('class' => 'example_class'))

このとき、\ ``$session->flash()`` による出力は、次のようになります。

::

    <div id="flashMessage" class="example_class">メッセージテキストの例</div>

read
----

``read($name)``

Session の中の $name の値を返します。 $name に null
を渡すと、セッション全体を返します。例は次の通りです。

::

    $green = $this->Session->read('Person.eyeColor');

セッションから「Green」が取得されます。

check
-----

``check($name)``

セッション中に $name で指定した値が存在するかチェックします。 存在すれば
true を、存在しなければ false を返します。

delete
------

``delete($name) /* または */ del($name)``

$name
で指定したセッションのデータをクリアします。次の例を参照してください。

::

    $this->Session->del('Person.eyeColor');

これでセッションデータの「eyeColor」というキーにはもう「Green」という値が存在しません。
しかし、「Person」というキーはまだセッション中に存在します。
「Person」の情報をセッションから削除するには、次のようにしてください。

::

    $this->Session->del('Person');

destroy
-------

``destroy``
メソッドは、まずセッションクッキーと一時ファイルシステムに保存されていた全てのセッションデータを破棄します。
次に、 PHP セッションを破棄し、そして新しいセッションを開始します。

::

    $this->Session->destroy()

error
-----

``error()``

あるセッションで最後に発生したエラーを特定します。
