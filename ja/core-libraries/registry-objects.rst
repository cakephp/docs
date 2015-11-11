..
    Registry Objects

レジストリオブジェクト
######################

..
    The registry classes provide a simple way to create and retrieve loaded
    instances of a given object type. There are registry classes for Components,
    Helpers, Tasks, and Behaviors.

レジストリクラスは、指定されたオブジェクト型のロードされたインスタンスの、作成および取得する簡単な方法を提供します。
コンポーネント、ヘルパー、タスク、およびビヘイビアのレジストリクラスがあります。

..
    While the examples below will use Components, the same behavior can be expected
    for Helpers, Behaviors, and Tasks in addition to Components.

以下の例ではコンポーネントを使用しますが、コンポーネントに加えて、ヘルパー、ビヘイビア、およびタスクに同じ動作を期待することができます。

..
    Loading Objects

オブジェクトのロード
====================

..
    Objects can be loaded on-the-fly using add<registry-object>()
    Example::

オブジェクトはその場で<registry-object>()を追加してロードすることができます。
例::

    $this->loadComponent('Acl.Acl');
    $this->addHelper('Flash')

..
    This will result in the ``Toolbar`` property and ``Flash`` helper being loaded.
    Configuration can also be set on-the-fly. Example::

これは、 ``Toolbar`` プロパティと ``Flash`` ヘルパーをロードしています。
設定も同様に、その場で行なうことができます。例::

    $this->loadComponent('Cookie', ['name' => 'sweet']);

..
    Any keys and values provided will be passed to the Component's constructor.  The
    one exception to this rule is ``className``.  Classname is a special key that is
    used to alias objects in a registry.  This allows you to have component names
    that do not reflect the classnames, which can be helpful when extending core
    components::
..
    $this->Auth = $this->loadComponent('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // Actually using MyCustomAuth::user();

提供される任意のキーと値は、コンポーネントのコンストラクタに渡されます。
このルールの唯一の例外は、 ``className`` です。
クラス名は、レジストリのエイリアスオブジェクトに使用される特殊なキーです。
これは、クラス名を反映していないコンポーネント名を持つことができ、コアコンポーネントを拡張する際に役立ちます。::

    $this->Auth = $this->loadComponent('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // 実態は MyCustomAuth::user();

..
    Triggering Callbacks

コールバックトリガー
====================

..
    Callbacks are not provided by registry objects. You should use the
    :doc:`events system </core-libraries/events>` to dispatch any events/callbacks
    for your application.

コールバックは、レジストリオブジェクトによって提供されていません。
アプリケーションのすべてのイベント/コールバックをディスパッチするために :doc:`events system </core-libraries/events>` を使用する必要があります。

..
    Disabling Callbacks

コールバックの無効化
====================

..
    In previous versions, collection objects provided a ``disable()`` method to disable
    objects from receiving callbacks. You should use the features in the events system to
    accomplish this now. For example, you could disable component callbacks in the
    following way::
..
    // Remove Auth from callbacks.
    $this->eventManager()->off($this->Auth);
..
    // Re-enable Auth for callbacks.
    $this->eventManager()->on($this->Auth);

以前のバージョンでは、コレクションオブジェクトは、コールバックを受けるオブジェクトを無効にする ``disable()`` メソッドを提供していました。
現在、これを実現するためには、イベントシステムの機能を使用する必要があります。
たとえば、次のようにコンポーネントのコールバックを無効にすることができます。::

    // Authコールバックを無効化
    $this->eventManager()->off($this->Auth);

    // Authコールバックを再度有効化
    $this->eventManager()->on($this->Auth);


.. meta::
    :title lang=ja: Object Registry
    :keywords lang=ja: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
