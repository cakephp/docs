.. Collections

コレクション
############

..
  Components, Helpers, Behaviors and Tasks all share a similar structure and set
  of behaviors.  For 2.0, they were given a unified API for interacting with
  collections of similar objects.  The collection objects in CakePHP, give you
  a uniform way to interact with several different kinds of objects in your
  application.

コンポーネント、ヘルパー、ビヘイビアそしてタスクは皆、似たような構造と一連の振る舞いを共有しています。
2.0では、同種のオブジェクトのコレクションとやり取りできる統一APIがそれらに与えられました。
CakePHPのこのコレクションオブジェクトは、アプリケーション内の様々な異なる種類のオブジェクトとのやり取りにおいて統一された方法を提供します。

..
  While the examples below, will use Components, the same behavior can be expected
  for Helpers, Behaviors, and Tasks in addition to Components.

以下においてはコンポーネントを例に用いることになりますが、同じ振舞いはコンポーネントの他にもヘルパー、ビヘイビア、そしてタスクに期待出来ます。

.. Loading and unloading objects

オブジェクトのロードとアンロード
================================

..
  Loading objects on every kind of collection can be done using the ``load()``
  method::

すべての種類のコレクションにおいて、オブジェクトのロードは ``load()`` メソッドを使えば可能になります::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

..
  When loading a component, if the component is not currently loaded into the
  collection, a new instance will be created.  If the component is already loaded,
  another instance will not be created.  When loading components, you can also
  provide additional configuration for them::

あるコンポーネントをロードする時点において、そのコンポーネントがコレクションにロードされていないなら新しいインスタンスが生成されます。
もし既にそのコンポーネントがロードされているなら、別のインスタンスは新たに生成されません。
ロードする際に、コンポーネントに設定を追加することもできます::

    $this->Cookie = $this->Components->load('Cookie', array('name' => 'sweet'));

..
  Any keys & values provided will be passed to the Component's constructor.  The
  one exception to this rule is ``className``.  ClassName is a special key that is
  used to alias objects in a collection.  This allows you to have component names
  that do not reflect the classnames, which can be helpful when extending core
  components::

設定を追加したどんなキーも値もコンポーネントのコンストラクタに渡されることになるでしょう。
このルールの一つの例外は ``className`` です。 ``className`` は、コレクションにおけるオブジェクトのエイリアスとして用いられる特別なキーです。
これにより、クラス名を反映させないコンポーネント名（コアのコンポーネントを拡張する際に便利です）を使えるようになります::

    $this->Auth = $this->Components->load('Auth', array('className' => 'MyCustomAuth'));
    $this->Auth->user(); // 実際には MyCustomAuth::user() が使用されます

..
  The inverse of loading an object, is unloading it.  Unloaded objects are removed
  from memory, and will not have additional callbacks triggered on them::

オブジェクトのロードの逆を行うこと、それがアンロードするということです。
アンロードされたオブジェクトはメモリから消去され、それによりトリガーされるコールバックを追加されることもありません::

    $this->Components->unload('Cookie');
    $this->Cookie->read(); // Fatal error.

.. Triggering callbacks

コールバックのトリガー
======================

..
  Callbacks are supported by collection objects.  When a collection has a callback
  triggered, that method will be called on all enabled objects in the collection.
  You can pass parameters to the callback loop as well::

コレクションオブジェクトはコールバックをサポートします。
トリガーされたコールバックをコレクションが持っていると、そのメソッドはコレクション内の実行可能（enabled）なすべてのオブジェクトに対してコールされます。
さらに、パラメータをコールバックのループに渡すことも出来ます::

    $this->Behaviors->trigger('afterFind', array($this, $results, $primary));

..
  In the above ``$this`` would be passed as the first argument to every
  behavior's afterFind method. There are several options that can be used to
  control how callbacks are fired:

上の例において ``$this`` は全てのビヘイビアの afterFind メソッドに第一引数として渡されます。
コールバックの起動の仕方を制御できる様々なオプションがあります:

..
  - ``breakOn`` Set to the value or values you want the callback propagation to stop on.
    Can either be a scalar value, or an array of values to break on. Defaults to ``false``.

- ``breakOn`` で、コールバックの伝播を停止させるための値（一つでも複数でも好きなだけ）をセットします。
  停止条件はスカラー値でも配列でも構いません。デフォルトは ``false``

..
  - ``break`` Set to true to enabled breaking. When a trigger is broken, the last returned value
    will be returned.  If used in combination with ``collectReturn`` the collected results will be returned.
    Defaults to ``false``.

- ``break`` で停止できるかどうかを設定します。トリガーが破棄されたときは最後の戻り値が戻されます。
  ``collectReturn`` と組み合わせて用いられたときは、複数の結果がまとめて返されます。
  デフォルトは ``false``

..
  - ``collectReturn`` Set to true to collect the return of each object into an array.
    This array of return values will be returned from the trigger() call. Defaults to ``false``.

- ``collectReturn`` 各々のオブジェクトの戻り値を配列に格納するために true をセットします。
  この配列は trigger() メソッドの呼び出しから返されます。デフォルトは ``false``

..
  - ``triggerDisabled`` Will trigger the callback on all objects in the collection even the non-enabled
    objects. Defaults to false.

- ``triggerDisabled`` は、コレクション内の無効化したオブジェクトに対してさえも全てコールバックをトリガーします。
  デフォルトは ``false``

..
  - ``modParams`` Allows each object the callback gets called on to modify the parameters to the next object.
    Setting modParams to an integer value will allow you to modify the parameter with that index.
    Any non-null value will modify the parameter index indicated.
    Defaults to false.

- ``modParams`` は、コールバックに渡された各オブジェクトに、次のオブジェクトへ渡されるパラメータに変更を加えることを許可します。
  modParams を整数値に設定している場合、それをインデックスとしたパラメータに対する変更を許可します。
  非NULLの値なら何であれ、そのインデクスが指し示すパラメータの変更を許可します。
  デフォルトは ``false``

.. Canceling a callback loop

コールバックループのキャンセル
------------------------------

..
  Using the ``break`` and ``breakOn`` options you can cancel a callback loop
  midway similar to stopping event propagation in JavaScript::

``break`` や ``breakOn`` オプションを用いることで、コールバックループを JavaScript におけるイベント伝播を停止させるような感じで途中でキャンセルすることができます::

    $this->Behaviors->trigger(
        'beforeFind',
        array($this, $query),
        array('break' => true, 'breakOn' => false)
    );

..
  In the above example, if any behavior returns ``false`` from its beforeFind
  method, no further callbacks will be called. In addition, the return of
  ``trigger()`` will be false.

上の例では、全てのビヘイビアが beforeFind メソッドから ``false`` を返すなら、それ以上コールバックが呼ばれることはありません。
ちなみに、 ``trigger()`` の戻り値は false になるはずです。

.. Enabling and disabling objects

オブジェクトの有効化と無効化
============================

..
  Once an object is loaded into a collection you may need to disable it.
  Disabling an object in a collection prevents future callbacks from being fired
  on that object unless the ``triggerDisabled`` option is used::

一度コレクションにロードしたオブジェクトを無効化したくなることがあるかもしれません。
コレクション内のオブジェクトを無効化することで、それ以降、 ``triggerDisabled`` オプションを用いない場合のコールバックの発火を防ぎます::

    // HtmlHelper を無効化
    $this->Helpers->disable('Html');

    // その後、そのヘルパーを再有効化
    $this->Helpers->enable('Html');


..
  Disabled objects can still have their normal methods and properties used. The
  primary difference between an enabled and disabled object is with regards to
  callbacks. You can interrogate a collection about the enabled objects, or check
  if a specific object is still enabled using ``enabled()``::

無効化されたオブジェクトはまだそれらの通常のメソッドとプロパティを持っています。
有効状態と無効状態の根本的な違いはコールバックに関してです。
``enabled()`` メソッドを用いることで、有効オブジェクトに何があるのかを問い合わせたり、特定のオブジェクトがまだ有効であるのかをチェックすることが出来ます::

    // あるヘルパーが有効かどうかをチェックします
    $this->Helpers->enabled('Html');

    // $enabled はこの時点で有効なヘルパーの配列です
    $enabled = $this->Helpers->enabled();

.. Object callback priorities

オブジェクトのコールバックのプロパティ
======================================

..
  You can prioritize the triggering object callbacks similar to event callbacks.
  The handling of priority values and order of triggering is the same as
  explained :ref:`here <event-priorities>`.
  Here's how you can specify priority at declaration time::

イベントコールバックに対して行うのと同じように、オブジェクトコールバックをトリガーする順番を指定することが出来ます。
プライオリティ値とトリガーの順番との取り扱いは :ref:`ここ <event-priorities>` の説明と同じです。
宣言時にプライオリティを設定できる方法は次に示します::

    class SomeController {
        public $components = array(
            'Foo', //Foo はデフォルトのプライオリティ 10 を持ちます
            'Bar' => array('priority' => 9) //Bar のコールバックは Foo's の前にトリガーされます
        );

        public $helpers = array(
            'Cache' => array('priority' => 12), //Cache のコールバックは最後に
                                                //トリガーされるでしょう
            'Asset',
            'Utility' //Utility は Asset と同じプライオリティ 10 を持ち、そのコールバックは
                      //Asset のものよりあとにトリガーされます
        );
    }


    class Post {
        public $actsAs = array(
            'DoFirst' => array('priority' => 1),
            'Media'
        );
    }

..
  When dynamically loading objects to a collection you can specify the priority like this::

コレクションへ動的にオブジェクトをロードした場合、こんな感じで優先順位を指定出来ます::

    $this->MyComponent = $this->Components->load('MyComponent', array('priority' => 9));


..
  You can also change priorities at run time using the ``ObjectCollection::setPriority()`` function::

``ObjectCollection::setPriority()`` メソッドを用いることで、
実行途中に優先順位を変更することも出来ます::

    //オブジェクトがひとつの場合
    $this->Components->setPriority('Foo', 2);

    //オブジェクトが複数の場合
    $this->Behaviors->setPriority(array('Object1' => 8, 'Object2' => 9));


.. meta::
    :title lang=ja: コレクション
    :keywords lang=ja: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
