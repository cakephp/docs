セッション
##########

.. php:class:: SessionComponent(ComponentCollection $collection, array $settings = array())

..
  The CakePHP SessionComponent provides a way to persist client data
  between page requests. It acts as a wrapper for the ``$_SESSION`` as
  well as providing convenience methods for several ``$_SESSION``
  related functions.

CakePHP のセッション (Session) コンポーネントは、複数のページにわたってクライアントのデータを継続して保持する方法を提供します。このコンポーネントは $_SESSION 変数に関連したいくつかの便利なメソッドを持つラッパのように振舞います。

..
  Sessions can be configured in a number of ways in CakePHP.  For more
  information, you should see the :doc:`Session configuration </development/sessions>`
  documentation.

CakePHP ではセッションの複数の方法で設定を行えます。
詳しくは :doc:`セッションの設定 </development/sessions>` を参照してください。

..
  Interacting with Session data

セッションデータを伝達する
=============================

..
  The Session component is used to interact with session information.
  It includes basic CRUD functions as well as features for creating
  feedback messages to users.

セッションコンポーネントはセッション情報を伝えあうために使われます。
ユーザへ出力するメッセージの作成はもちろんのこと、基本的な CRUD 機能が含まれます。

..
  It should be noted that Array structures can be created in the
  Session by using :term:`dot notation`. So ``User.username`` would
  reference the following::

覚えておきたいことは、 :term:`ドット記法` により配列構造で作成可能ということです。
そのため ``User.username`` は、次のような値が参照されます。::

    array('User' => array(
        'username' => 'clark-kent@dailyplanet.com'
    ));

..
  Dots are used to indicate nested arrays. This notation is used for
  all Session component methods wherever a name/key is used.

ドット (.) は、多次元配列のために使われます。
この表記は、セッションコンポーネント内で使用されるどの name/key においても使われます。

.. php:method:: write($name, $value)

    ..
      Write to the Session puts $value into $name. $name can be a dot
      separated array. For example::

    $name のなかに、$value をセッションとして格納します。
    $name には、ドット記法の配列を使用できます。
    たとえば::

        $this->Session->write('Person.eyeColor', 'Green');

    ..
      This writes the value 'Green' to the session under Person =>
      eyeColor.

    これは 'Green' という値を、 Person => eyeColor というキーに書き込んでいます。

.. php:method:: read($name)

    ..
      Returns the value at $name in the Session. If $name is null the
      entire session will be returned. E.g::

    セッション内の $name というキーの値を返します。
    もし $name が null の場合、セッション全体の値を返します。::

        $green = $this->Session->read('Person.eyeColor');

    ..
      Retrieve the value Green from the session. Reading data that does not exist
      will return null.

    セッションから 'Green' という値を取り出します。
    キー存在しない場合は null が返されます。

.. php:method:: check($name)

    ..
      Used to check if a Session variable has been set. Returns true on
      existence and false on non-existence.

    セッションの値がセットされているかチェックするために使用します。
    存在する場合は true を、存在しない場合は false を返します。

.. php:method:: delete($name)

    ..
      Clear the session data at $name. E.g::

    $name キーのセッションをクリアします。
    例::

        $this->Session->delete('Person.eyeColor');

    ..
      Our session data no longer has the value 'Green', or the index
      eyeColor set. However, Person is still in the Session. To delete
      the entire Person information from the session use::

    セッションには 'Green' という値も eyeColor というキーも、もう存在しません。
    しかし、 Person というキーはまだあります。
    Person 全体を削除するためには次のようにします。::

        $this->Session->delete('Person');

.. php:method:: destroy()

    ..
      The ``destroy`` method will delete the session cookie and all
      session data stored in the temporary file system. It will then
      destroy the PHP session and then create a fresh session::

    ``destroy`` メソッドは、セッションクッキーと temporary file system 内のすべてのセッションデータを削除します。
    PHPセッションを無効にし、新鮮なセッションを作成します。::

        $this->Session->destroy();


..
  Creating notification messages

.. _creating-notification-messages:

通知メッセージの作成
==============================

.. php:method:: setFlash(string $message, string $element = 'default', array $params = array(), string $key = 'flash')

    :rtype: void

    ..
      Often in web applications, you will need to display a one-time notification
      message to the user after processing a form or acknowledging data.
      In CakePHP, these are referred to as "flash messages".  You can set flash
      message with the SessionComponent and display them with the
      :php:meth:`SessionHelper::flash()`. To set a message, use ``setFlash``::

    Webアプリケーションではしばしば、フォームの処理やデータの受け取り時に、一回限りの通知をユーザに対して表示したいときがあります。
    このような通知を CakePHP では、 "flash message" と呼んでいます。
    セッションコンポーネントによって flash message をセットし、 :php:meth:`SessionHelper::flash()` を使用し表示します。
    メッセージのセットは、 ``setFlash`` を使用します。::

        // controller にて
        $this->Session->setFlash('Your stuff has been saved.');

    ..
      This will create a one-time message that can be displayed to the user,
      using the SessionHelper::

    ユーザに表示する一回限りのメッセージが作成されます。
    セッションヘルパーを使用します。::

        // view にて
        echo $this->Session->flash();

        // このように出力されます
        <div id="flashMessage" class="message">
            保存しました
        </div>

    ..
      You can use the additional parameters of ``setFlash()`` to create
      different kinds of flash messages.  For example, error and positive
      notifications may look differently.  CakePHP gives you a way to do that.
      Using the ``$key`` parameter you can store multiple messages, which can be
      output separately::

    ほかの種類の flash message を表示するために ``setFlash()`` に追加のパラメータを設定できます。
    たとえば、エラー・成功・注意に別の見た目にするかもしれません。
    CakePHP は、そのような場合のやり方を用意しています。
    ``$key`` パラメータを使い、多数のメッセージを保存し、別々に出力することができます。::

        // bad message をセット
        $this->Session->setFlash('Something bad.', 'default', array(), 'bad');

        // good message をセット
        $this->Session->setFlash('Something good.', 'default', array(), 'good');

    ..
      In the view, these messages can be output and styled differently::

    ビュー内にて、次のように別々の見た目で出力できます。::

        // viewにて
        echo $this->Session->flash('good');
        echo $this->Session->flash('bad');

    ..
      The ``$element`` parameter allows you to control which element 
      (located in ``/app/View/Elements``) should be used to render the
      message in. In the element the message is available as ``$message``.
      First we set the flash in our controller::

    ``$element`` パラメータは、 ``/app/View/Elements`` 内のどのエレメントを使用しメッセージを表示するかに使います。
    エレメント内では ``$message`` によってメッセージを利用できます。
    まずコントローラ内でメッセージをセットします。::

        $this->Session->setFlash('Something custom!', 'flash_custom');

    ..
      Then we create the file ``app/View/Elements/flash_custom.ctp`` and build our
      custom flash element::

    エレメントファイル ``app/View/Elements/flash_custom.ctp`` を作成し、特別な表示がされるようにします::

        <div id="myCustomFlash"><?php echo $message; ?></div>

    ..
      ``$params`` allows you to pass additional view variables to the
      rendered layout. Parameters can be passed affecting the rendered div, for 
      example adding "class" in the $params array will apply a class to the
      ``div`` output using ``$this->Session->flash()`` in your layout or view.::

    ``$params`` は追加の変数をビューに渡します。
    パラメータは描画した div に影響を及ぼします。
    たとえば、配列 $params に "class" を追加し、レイアウトやビュー内で ``$this->Session->flash()`` を使用し ``div`` に class を適用します。::

        $this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'));

    ..
      The output from using ``$this->Session->flash()`` with the above example
      would be::

    上述の例で ``$this->Session->flash()`` を使用した出力は次のようになります。::

        <div id="flashMessage" class="example_class">Example message text</div>

    ..
      To use an element from a plugin just specify the plugin in the 
      ``$params``::

    ``$params`` 内でプラグインの使用を明示し、プラグイン内のエレメントを使用するには次のようにします。::

        // /app/Plugin/Comment/View/Elements/flash_no_spam.ctp が使用されます
        $this->Session->setFlash('Message!', 'flash_no_spam', array('plugin' => 'Comment'));
