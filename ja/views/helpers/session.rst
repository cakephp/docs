Session
#######

.. php:namespace:: Cake\View\Helper

.. php:class:: SessionHelper(View $view, array $config = [])

.. deprecated:: 3.0.0
    SessionHelperは3.xで非推奨になりました。代わりに、
    :doc:`FlashHelper </views/helpers/flash>` を使用するか、 :ref:`セッションオブジェクトへアクセス<accessing-session-object>` する必要があります。

SessionヘルパーはSessionオブジェクトのほとんどの機能を複製し、それをビューで利用できるようにします。

SessionヘルパーとSessionオブジェクトの主な違いは、
ヘルパーがセッションに書き込む能力を *持たない* ことです。

Sessionオブジェクトと同様に、データは :term:`ドット記法` 配列構造を使用して読み取られます。::

    ['User' => [
        'username' => 'super@example.com'
    ]];

上記の配列構造では、ノードは ``User.username`` によってアクセスされ、ドットはネストされた配列を示します。
この記法は、 ``$key`` が使用されている、すべてのSessionヘルパーメソッドで使用されます。

.. php:method:: read(string $key)

    :rtype: mixed

    セッションから読み込みます。
    セッションの内容に応じて文字列または配列を返します。

.. php:method:: check(string $key)

    :rtype: boolean

    キーがセッション内にあるかどうかを確認します。
    キーの存在を表すbooleanを返します。

.. meta::
    :title lang=ja: Sessionヘルパー
    :description lang=ja: SessionヘルパーはSessionオブジェクトのほとんどの機能を複製し、それをビューから利用できるようにします。
    :keywords lang=ja: Sessionヘルパー,フラッシュメッセージ,セッションフラッシュ,セッションリード,セッションチェック
    :keywords lang=en: session helper,flash messages,session flash,session read,session check
