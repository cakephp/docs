レジストリーオブジェクト
########################

レジストリークラスは、指定されたオブジェクト型のロードされたインスタンスの、
作成および取得する簡単な方法を提供します。
コンポーネント、ヘルパー、タスク、およびビヘイビアーのレジストリークラスがあります。

以下の例ではコンポーネントを使用しますが、コンポーネントに加えて、ヘルパー、ビヘイビアー、
およびタスクに同じ動作を期待することができます。

オブジェクトのロード
====================

オブジェクトはその場で add<レジストリーオブジェクト>() でロードすることができます。
例::

    $this->loadComponent('Acl.Acl');
    $this->addHelper('Flash')

これは、 ``Acl`` プロパティーと ``Flash`` ヘルパーをロードしています。
設定も同様に、その場で行なうことができます。例::

    $this->loadComponent('Cookie', ['name' => 'sweet']);

提供される任意のキーと値は、コンポーネントのコンストラクターに渡されます。このルールの唯一の例外は、
``className`` です。クラス名は、レジストリーのエイリアスオブジェクトに使用される特殊なキーです。
これは、クラス名を反映していないコンポーネント名を持つことができ、コアコンポーネントを拡張する際に
役立ちます。 ::

    $this->Auth = $this->loadComponent('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // 実態は MyCustomAuth::user();

コールバックトリガー
====================

コールバックは、レジストリーオブジェクトによって提供されていません。
アプリケーションのすべてのイベント/コールバックをディスパッチするために
:doc:`events system </core-libraries/events>` を使用する必要があります。

コールバックの無効化
====================

以前のバージョンでは、コレクションオブジェクトは、コールバックを受けるオブジェクトを無効にする
``disable()`` メソッドを提供していました。
現在、これを実現するためには、イベントシステムの機能を使用する必要があります。
たとえば、次のようにコンポーネントのコールバックを無効にすることができます。 ::

    // Auth コールバックを無効化
    $this->eventManager()->off($this->Auth);

    // Auth コールバックを再度有効化
    $this->eventManager()->on($this->Auth);

.. meta::
    :title lang=ja: Object Registry
    :keywords lang=ja: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
