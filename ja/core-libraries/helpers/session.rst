..
  SessionHelper
  #############

セッションヘルパー
##################

.. php:class:: SessionHelper(View $view, array $settings = array())

..
  As a natural counterpart to the Session Component, the Session
  Helper replicates most of the components functionality and makes it
  available in your view. The Session Helper is no longer
  automatically added to your view — so it is necessary to add it to
  the ``$helpers`` array in your controller.

セッションコンポーネントの自然な対応として、セッションヘルパーは\
コンポーネントの大半の機能を、ビューの中で使用可能にします。\
セッションヘルパーはもはや自動的にビューに追加されることはありません。\
つまりコントローラー内の ``$helpers`` 配列に手動で追加する必要があります。

..
  The major difference between the Session Helper and the Session
  Component is that the helper does *not* have the ability to write
  to the session.

セッションヘルパーとセッションコンポーネントの大きな違いはヘルパーは\
セッションへの書き込みが *出来ない* ことです。

..
  As with the Session Component, data is read by using
  :term:`dot notation` array structures::

セッションコンポーネントと同じく、データは
:term:`ドット記法` の配列構造で読み込みます::

    array('User' => array(
        'username' => 'super@example.com'
    ));

..
  Given the previous array structure, the node would be accessed by
  ``User.username``, with the dot indicating the nested array. This
  notation is used for all Session helper methods wherever a ``$key`` is
  used.

ご覧の配列構造には、ノードに ``User.username`` といった形で、ドット \
(.) で表された入れ子配列でアクセスします。

.. php:method:: read(string $key)

    :rtype: mixed

    ..
      Read from the Session. Returns a string or array depending on the
      contents of the session.

    セッションを読み込みます。文字列か配列か、セッションの内容によって\
    どちらかを返します。

.. php:method:: check(string $key)

    :rtype: boolean

    ..
      Check to see if a key is in the Session. Returns a boolean on the
      key's existence.

    セッションに指定のキーがあるか確認します。ブール型でキーの有無を\
    返します。

.. php:method:: error()

    :rtype: string

    ..
      Returns last error encountered in a session.

    セッション内で最後に直面したエラーを返します。

.. php:method:: valid()

    :rtype: boolean

    ..
      Used to check is a session is valid in a view.

    セッションがビュー内で妥当が確認するのに使用します。

..
  Displaying notifications or flash messages
  ==========================================

通知やフラッシュメッセージの表示
================================

.. php:method:: flash(string $key = 'flash', array $params = array())

    :rtype: string

    ..
      As explained in :ref:`creating-notification-messages` you can
      create one-time notifications for feedback. After creating messages 
      with :php:meth:`SessionComponent::setFlash()` you will want to 
      display them. Once a message is displayed, it will be removed and 
      not displayed again::

    :ref:`creating-notification-messages` で述べたように、フィードバック\
    用にワンタイム通知を作成することが出来ます。メッセージを \
    :php:meth:`SessionComponent::setFlash()` で作成したら表示したくなる\
    でしょう。一度メッセージを表示すると、メッセージは削除され表示されなく\
    なります::

        echo $this->Session->flash();

    ..
      The above will output a simple message, with the following html::

    上記はシンプルなメッセージを下記の html に沿って出力します::

        <div id="flashMessage" class="message">
            Your stuff has been saved.
        </div>

    ..
      As with the component method you can set additional properties
      and customize which element is used. In the controller you might 
      have code like::

    コンポーネントメソッドと同じく、追加プロパティをセットし使用する \
    html 要素をカスタマイズすることも出来ます。コントローラー内で以下の\
    ようなコードを書くことも出来ます::

        // in a controller
        $this->Session->setFlash('The user could not be deleted.');

    ..
      When outputting this message, you can choose the element used to display
      this message::

    このメッセージを出力する時、メッセージを表示するのに使用する \
    html 要素を選択出来ます::

        // in a layout.
        echo $this->Session->flash('flash', array('element' => 'failure'));

    ..
      This would use ``View/Elements/failure.ctp`` to render the message.  The 
      message text would be available as ``$message`` in the element.

    これは ``View/Elements/failure.ctp`` を使ってメッセージを書きます。\
    メッセージテキストは html 要素内の ``$message`` として使用可能です。

    ..
      Inside the failure element file would be something like
      this::

    フェイルオーバー用 html ファイルは以下のようになります::

        <div class="flash flash-failure">
            <?php echo $message; ?>
        </div>

    ..
      You can also pass additional parameters into the ``flash()`` method, which
      allow you to generate customized messages::

    追加パラメーターを ``flash()`` メソッドに渡すことも出来ます。\
    これによってカスタマイズしたメッセージを生成することが出来ます::

        // In the controller
        $this->Session->setFlash('Thanks for your payment %s');

        // In the layout.
        echo $this->Session->flash('flash', array(
            'params' => array('name' => $user['User']['name'])
            'element' => 'payment'
        ));
        
        // View/Elements/payment.ctp
        <div class="flash payment">
            <?php printf($message, h($name)); ?>
        </div>


