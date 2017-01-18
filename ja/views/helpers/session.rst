セッション
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: SessionHelper(View $view, array $config = [])

.. deprecated:: 3.0.0
    SessionHelperは3.xで非推奨になりました。代わりに、
    :doc:`FlashHelper </views/helpers/flash>` を使用するか、 :ref:`セッションオブジェクトへアクセス<accessing-session-object>` する必要があります。

セッションオブジェクトの★自然な対応として、セッションヘルパーはオブジェクトの機能のほとんどを複製し、
それをあなたのビューで利用できるようにします。
As a natural counterpart to the Session object, the Session
Helper replicates most of the object's functionality and makes it
available in your view.

セッションヘルパーとセッションオブジェクトの主な違いは、
ヘルパーがセッションに書き込む能力を持た *ない* ことです。

セッションオブジェクトと同様に、データは :term:`dot notation` 配列構造を使用して読み取られます。::

    ['User' => [
        'username' => 'super@example.com'
    ]];

以前の配列構造では、ノードは ``User.username`` によってアクセスされ、ドットはネストされた配列を示します。
この記法は、 ``$key`` が使用されている場合でも、すべてのセッションヘルパーメソッドに使用されます。
Given the previous array structure, the node would be accessed by
``User.username``, with the dot indicating the nested array. This
notation is used for all Session helper methods wherever a ``$key`` is
used.

.. php:method:: read(string $key)

    :rtype: mixed

    セッションから読み込みます。
    セッションの内容に応じて文字列または配列を返します。

.. php:method:: check(string $key)

    :rtype: boolean

    キーがセッション内にあるかどうかを確認します。
    キーの存在を表すbooleanを返します。

.. meta::
    :title lang=ja: セッションヘルパー
    :description lang=ja: セッションヘルパーはほとんどの機能を複製し、あなたのViewから利用できるようにします。
    :keywords lang=ja: session helper,flash messages,session flash,session read,session check
