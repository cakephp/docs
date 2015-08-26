SessionHelper
#############

.. php:class:: SessionHelper(View $view, array $settings = array())

Session コンポーネントの自然な対応として、 Session ヘルパーは
コンポーネントの大半の機能を、ビューの中で使用可能にします。

Session ヘルパーと Session コンポーネントの大きな違いはヘルパーは
セッションへの書き込みが *出来ない* ことです。

Session コンポーネントと同じく、データは
:term:`ドット記法` の配列構造で読み込みます::

    array('User' => array(
        'username' => 'super@example.com'
    ));

ご覧の配列構造には、ノードに ``User.username`` といった形で、ドット
(.) で表された入れ子配列でアクセスします。

.. php:method:: read(string $key)

    :rtype: mixed

    セッションを読み込みます。文字列か配列か、セッションの内容によって\
    どちらかを返します。

.. php:method:: consume($name)

    :rtype: mixed

    セッションから値の読み込みと削除をします。このメソッドは、読み込みと削除を一つの操作で
    行いたい場合に便利です。

.. php:method:: check(string $key)

    :rtype: boolean

    セッションに指定のキーがあるか確認します。キーの存在を示すブール型を返します。

.. php:method:: error()

    :rtype: string

    セッション内で最後に直面したエラーを返します。

.. php:method:: valid()

    :rtype: boolean

    セッションがビュー内で妥当が確認するのに使用します。

通知やフラッシュメッセージの表示
================================

.. php:method:: flash(string $key = 'flash', array $params = array())

    .. deprecated:: 2.7.0
        フラッシュメッセージを表示するには :doc:`/core-libraries/helpers/flash` を
        使用してください。

    :ref:`creating-notification-messages` で述べたように、フィードバック
    用にワンタイム通知を作成することが出来ます。メッセージを
    :php:meth:`SessionComponent::setFlash()` で作成したら表示したくなる
    でしょう。一度メッセージを表示すると、メッセージは削除され表示されなく
    なります::

        echo $this->Session->flash();

    上記はシンプルなメッセージを下記の HTML に沿って出力します:

    .. code-block:: html

        <div id="flashMessage" class="message">
            Your stuff has been saved.
        </div>

    コンポーネントメソッドと同じく、追加プロパティをセットし使用する
    エレメントをカスタマイズすることも出来ます。コントローラー内で以下の
    ようなコードを書くことも出来ます::

        // in a controller
        $this->Session->setFlash('The user could not be deleted.');

    このメッセージを出力する時、メッセージを表示するのに使用する
    エレメントを選択出来ます::

        // in a layout.
        echo $this->Session->flash('flash', array('element' => 'failure'));

    これは ``View/Elements/failure.ctp`` を使ってメッセージを書きます。
    メッセージテキストは、エレメント内の ``$message`` として使用可能です。

    失敗時のエレメントには、以下のようなものを含みます:

    .. code-block:: php

        <div class="flash flash-failure">
            <?php echo h($message); ?>
        </div>

    追加パラメーターを ``flash()`` メソッドに渡すことも出来ます。
    これによってカスタマイズしたメッセージを生成することが出来ます。 ::

        // In the controller
        $this->Session->setFlash('Thanks for your payment');

        // In the layout.
        echo $this->Session->flash('flash', array(
            'params' => array('name' => $user['User']['name'])
            'element' => 'payment'
        ));

        // View/Elements/payment.ctp
        <div class="flash payment">
            <?php printf($message, h($name)); ?>
        </div>

    .. note::
        CakePHP は、デフォルトではフラッシュメッセージを HTML エスケープしません。
        もしリクエストやユーザーデータをフラッシュメッセージに含める場合は、
        メッセージを整形するときにそれらを :php:func:`h` でエスケープするべきです。


.. meta::
    :title lang=ja: SessionHelper
    :description lang=ja: As a natural counterpart to the Session Component, the Session Helper replicates most of the component's functionality and makes it available in your view.
    :keywords lang=ja: session helper,flash messages,session flash,session read,session check
