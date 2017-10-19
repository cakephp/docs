テーブルオブジェクト
####################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

テーブルオブジェクトは特定のテーブルに保存されたエンティティーのコレクションへのアクセスを提供します。
それぞれのテーブルは、与えられたテーブルによって繋がれた関連付けられたテーブルクラスを持ちます。
もし、与えられたテーブルの振る舞いをカスタマイズする必要ないなら、CakePHP はテーブルのインスタンスを
作ります。

テーブルオブジェクトと ORM を作る前に　:ref:`データベースへの接続 <database-configuration>`
がなされているか確かめましょう。

基本的な使い方
==============

まずはじめにテーブルクラスを作ってください。これらのクラスは **src/Model/Table** に作ります。
テーブルは、リレーショナルデータベースに特化したモデルコレクションです。
そして、CakePHP の ORM の中で、あなたのデータベースへの主なインターフェースです。
最も基本的なテーブルクラスは次のようになります。 ::

    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

このクラスで使用するテーブル名を ORM に伝えていないことに注目してください。規約により、
テーブルオブジェクトは、クラス名を小文字とアンダースコアー区切りにした名前のテーブルを使用します。
上記の例では ``articles`` テーブルが使用されます。テーブルクラスが ``BlogPosts``
という名前の場合、テーブルは ``blog_posts`` と名付けてください。
あなたは、 ``setTable()`` メソッドを使用することでテーブルを指定できます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->setTable('my_table');

            // 3.4 より前
            $this->table('my_table');
        }

    }

テーブルを指定した時は、命名規則は適用されません。規約により、ORM はそれぞれのテーブルが
``id`` という名前の主キーを持っていることを前提としています。もし主キーの名前を変更する
必要がある場合、 ``setPrimaryKey()`` メソッドが使用できます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setPrimaryKey('my_id');

            // 3.4 より前
            $this->primaryKey('my_id');
        }
    }

テーブルが使うエンティティークラスのカスタマイズ
------------------------------------------------

デフォルトではテーブルオブジェクトは命名規則に従った Entity クラスを使います。
たとえば、 ``ArticlesTable`` というテーブルクラスの名前だったらエンティティーは ``Article``
に、 ``PurchaseOrdersTable`` というテーブルクラスの名前だったらエンティティーは ``PurchaseOrder``
になります。もし命名規約に従わない場合は、 ``setEntityClass()`` メソッドで設定を変えられます。 ::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setEntityClass('App\Model\Entity\PO');

            // 3.4 より前
            $this->entityClass('App\Model\Entity\PO');
        }
    }

上記の例では、テーブルオブジェクトはコンストラクターの最後に呼ばれる ``initialize()``
メソッドを持ちます。コンストラクターをオーバーライドする代わりに、
このメソッドで初期化することを推奨します。

テーブルクラスのインスタンスを取得する
--------------------------------------

テーブルにクエリーを実行する前に、テーブルインスタンスを取得する必要があります。
``TableRegistry`` クラスを使用することで取得できます。 ::

    // コントローラーやテーブルのメソッド内で
    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

TableRegistry クラスはテーブルを作るための様々な依存関係を提供します。
そして、作成されたすべてのテーブルインスタンスの設定を維持し、リレーションの構築と
ORM の設定を簡単にしてくれます。詳細は :ref:`table-registry-usage` をご覧ください。

テーブルクラスがプラグインの中にある場合、あなたのテーブルクラスのために正しい名前を
必ず使用してください。それに失敗すると、デフォルトのクラスが正しいクラスの代わりに使われてしまい、
バリデーションルールやコールバックが呼ばれないなどの結果を生じます。プラグインのテーブルクラスを
正しくロードするために、次のように使用してください。 ::

    // プラグインの Table
    $articlesTable = TableRegistry::get('PluginName.Articles');

    // ベンダープレフィックス付きのプラグイン Table
    $articlesTable = TableRegistry::get('VendorName/PluginName.Articles');

.. _table-callbacks:

コールバックのライフサイクル　
============================

上記で示した通り、テーブルオブジェクトは、いろいろなイベントを起こします。イベンドは、
ORM 内でフックしたり、サブクラス化やメソッドをオーバーライドせずにロジックを加えたい時に便利です。
イベントリスナーはテーブルクラスやビヘイビアークラスで定義できます。
また、テーブルのイベントマネージャーをリスナーをバインドするために使えます。

コールバックメソッドを使うとき、 ``initialize()`` メソッドで追加されたビヘイビアーは、
テーブルコールバックメソッドが開始する **前に** 呼ばれるリスナーを持ちます。
これは、コントローラーやコンポーネントと同じ流れに従います。

イベントリスナーにテーブルクラスやビヘイビアーを追加するには、単純にメソッド名を以下の様に使います。
イベントサブシステムの使い方の詳細は :doc:`/core-libraries/events` をご覧ください。

イベント一覧
------------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.beforeFind``
* ``Model.buildValidator``
* ``Model.buildRules``
* ``Model.beforeRules``
* ``Model.afterRules``
* ``Model.beforeSave``
* ``Model.afterSave``
* ``Model.afterSaveCommit``
* ``Model.beforeDelete``
* ``Model.afterDelete``
* ``Model.afterDeleteCommit``

initialize
----------

.. php:method:: initialize(Event $event, ArrayObject $data, ArrayObject $options)

``Model.initialize`` イベントは、コンストラクターと initialize メソッドが呼ばれた後に発行されます。
デフォルトでは、 ``Table`` クラスは、このイベントを購読しません。そして、代わりに ``initialize``
フックメソッドを使います。

``Model.initialize`` イベントに応答するために、 ``EventListenerInterface``
を実装したリスナークラスを作成することができます。 ::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return array(
                'Model.initialize' => 'initializeEvent',
            );
        }
        public function initializeEvent($event)
        {
            $table = $event->getSubject();
            // ここで何かする
        }
    }

そして、以下のように ``EventManager`` にリスナーを追加します。 ::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

これは、任意の ``Table`` クラスが構築されたとき、  ``initializeEvent`` を呼びます。

beforeMarshal
-------------

.. php:method:: beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)

``Model.beforeMarshal`` イベントは、リクエストデータがエンティティーに変換される前に発行されます。
詳細は :ref:`before-marshal` をご覧ください。

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, $primary)

``Model.beforeFind`` イベントは find する前に発行されます。イベントを止めて戻り値を返すことで
find を完全にバイパスできます。 $query インスタンスによってなされた全ての変更は find
に影響します。 ``$primary`` パラメーターは、これがルートクエリー、もしくは関連付けられた
クエリーであるかどうかの指標となります。クエリーに含まれる全てのアソシエーションで、
``Model.beforeFind`` イベントが呼ばれます。アソシエーションが JOIN を使うために
ダミークエリーが用意されています。イベントリスナーで追加のフィールド、検索条件、
JOIN や結果のフォーマットを設定出来ます。これらのオプションや機能はルートクエリーにコピーされます。

ユーザーのロールをもとに find の操作を制限したり、現在のロードをもとにキャッシュの判断をするために、
このコールバックを使います。

CakePHP の旧バージョンでは ``afterFind`` コールバックがありましたが、 :ref:`map-reduce`
機能とエンティティーのコンストラクターに置き換えられました。

buildValidator
---------------

.. php:method:: buildValidator(Event $event, Validator $validator, $name)

``Model.buildValidator`` イベントは ``$name`` バリデーターが作られた時に発行されます。
ビヘイビアーは、バリデーションメソッドに追加するために、このフックが使用できます。

buildRules
----------

.. php:method:: buildRules(Event $event, RulesChecker $rules)

``Model.buildRules`` イベントはルールインスタンスが作られた後と、
Table の ``beforeRules()`` メソッドが呼ばれた後に発行されます。

beforeRules
--------------

.. php:method:: beforeRules(Event $event, EntityInterface $entity, ArrayObject $options, $operation)

``Model.beforeRules`` イベントはエンティティーにルールが適用される前に発行されます。
このイベントが止まると、チェックのためのルールを停止して、適用したルールの結果を
セットすることができます。

afterRules
--------------

.. php:method:: afterRules(Event $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

``Model.afterRules`` イベントはルールがエンティティーに適用された後に発行されます。
このイベントが止まると、操作をチェックするためのルールの結果の値を返すことができます。

beforeSave
----------

.. php:method:: beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.beforeSave`` イベントはエンティティーが保存する前に発行されます。
このイベントを止めることによって、保存を停止できます。イベントが停止すると、
このイベントの結果が返されます。
イベントを停止する方法は、 :ref:`こちら <stopping-events>` に記載されています。

afterSave
---------

.. php:method:: afterSave(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.afterSave`` イベントはエンティティーを保存した後に発行されます。

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.afterSaveCommit`` イベントは、保存処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 ``save()`` が直接呼ばれた最初のテーブルだけに引き起こされます。
save が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.beforeDelete`` イベントはエンティティーを削除する前に発行されます。
このイベントを停止することによって、削除を中止できます。イベントが停止すると、
このイベントの結果が返されます。
イベントを停止する方法は、 :ref:`こちら <stopping-events>` に記載されています。

afterDelete
-----------

.. php:method:: afterDelete(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.afterDelete`` イベントはエンティティーが削除された後に発行されます。

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(Event $event, EntityInterface $entity, ArrayObject $options)

``Model.afterDeleteCommit`` イベントは、削除処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 ``delete()`` が直接呼ばれた最初のテーブルだけに引き起こされます。
delete が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

ビヘイビアー
============

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

ビヘイビアーは、テーブルクラスにまたがって関連するロジックの再利用可能な部品を作成する
簡単な方法を提供します。なぜビヘイビアーが通常のクラスで、トレイトではないのか
不思議に思うかもしれません。第一の理由は、ビヘイビアーはイベントリスナーだからです。
トレイトは再利用可能なロジックの部品になりえますが、イベントをバインドするのは厄介です。

ビヘイビアーをテーブルに追加するために ``addBehavior()`` メソッドが使えます。
一般的に、これを ``initialize()`` でやるのがもっともよいです。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

アソシエーションには :term:`プラグイン記法` と追加の設定オプションが使えます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

CakePHP によって提供されるビヘイビアーを含む、ビヘイビアーに関する詳細は :doc:`/orm/behaviors`
の章をご覧ください。


.. _configuring-table-connections:

接続設定
========

デフォルトでは、全てのテーブルインスタンスは ``default`` データベース接続を使用します。
もし、複数のデータベース接続を使用している場合、どのコネクションを使用してテーブルを
設定したくなるでしょう。これは、 ``defaultConnectionName()`` メソッドで出来ます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName() {
            return 'slavedb';
        }
    }

.. note::

    ``defaultConnectionName()`` メソッドはスタティックで **なければなりません** 。

.. _table-registry-usage:

TableRegistry の利用
====================

.. php:class:: TableRegistry

これまで見てきたように、TableRegistry クラスは　factory/registry を
アプリケーションのテーブルインスタンスにアクセスするために使うことを簡単にします。
これには他にも便利な機能があります。

テーブルオブジェクトの設定
--------------------------

.. php:staticmethod:: get($alias, $config)

テーブルをレジストリーからロードする時に、依存関係をカスタマイズするか、
``$options`` 配列が用意するモックオブジェクトを使います。 ::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

接続とスキーマ設定に注意して下さい。それらは文字列変数ではなくオブジェクトです。
この接続は ``Cake\Database\Connection`` のオブジェクトと
スキーマの ``Cake\Database\Schema\Collection`` を扱います。

.. note::

    テーブルは ``initialize()`` メソッドで追加の設定を行う場合、それらの値は
    レジストリーの設定を上書きします。

また、事前にレジストリーを ``config()`` メソッドを使って設定できます。
設定データは *エイリアスごと* に保存され、オブジェクトの
``initialize()`` メソッドで上書きできます。 ::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    そのエイリアスにアクセスする前か、**最初** のアクセス時だけテーブルの設定が可能です。
    レジストリーが投入された後に設定しても効果がありません。

レジストリーの初期化（追加設定の消去）
--------------------------------------

.. php:staticmethod:: clear()

テストケースで、レジストリーをフラッシュしたいこともあるでしょう。
モックオブジェクトを使う時やテーブルの依存関係を設定する時に便利です。 ::

    TableRegistry::clear();

ORM クラスを配置する名前空間の設定
-----------------------------------

もし、規約に従わない場合、おそらくテーブルやエンティティークラスは CakePHP によって検知されません。
これを修正するために、 ``Cake\Core\Configure::write`` メソッドで名前空間をセットできます。
例えば、 ::

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

は、次のように設定されます。 ::

    Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');

