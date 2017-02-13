ElasticSearch
#############

ElasticSearch プラグインは、`elasticsearch <https://www.elastic.co/products/elasticsearch>`_
の上に ORM のような抽象化を提供します。そのプラグインは、テストの作成、
ドキュメントのインデックス作成、インデックスをより簡単に検索などの機能を提供します。

インストール
============

ElasticSearch プラグインをインストールするには、 ``composer`` が利用できます。(composer.json
ファイルが置かれている) アプリケーションの ROOT ディレクトリから次のコマンドを実行します。 ::

    php composer.phar require cakephp/elastic-search "@stable"

以下の1行をあなたのアプリケーションの **config/bootstrap.php** ファイルに追加する必要があります。 ::

    Plugin::load('Cake/ElasticSearch', ['bootstrap' => true]);

追加で 'elastic' のデータソースの接続を **config/app.php** ファイルに設定する必要があります。
設定例は以下のようになります。 ::

    // config/app.php の中で
    'Datasources' => [
        // 他のデータソース
        'elastic' => [
            'className' => 'Cake\ElasticSearch\Datasource\Connection',
            'driver' => 'Cake\ElasticSearch\Datasource\Connection',
            'host' => '127.0.0.1',
            'port' => 9200,
            'index' => 'my_apps_index',
        ],
    ]

概要
====

ElasticSearch プラグインは elasticsearch インデックスと作用することを簡単にし、
:doc:`/orm` に似たインタフェースを提供します。まず最初に ``Type`` オブジェクトを
作成しなければいけません。 ``Type`` オブジェクトは elasticsearch 内では "Repository"
もしくは Table のようなクラスです。 ::

    // src/Model/Type/ArticlesType.php の中で
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
    }

コントローラーで Type クラスを利用できます。 ::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // 'Elastic' プロバイダーを利用して Type を読み込む
        $this->loadModel('Articles', 'Elastic');
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                $this->Flash->success('It saved');
            }
        }
        $this->set(compact('article'));
    }

インデックスされた articles の基本的なビューを作成する必要があります。 ::

    // src/Template/Articles/add.ctp の中で
    <?= $this->Form->create($article) ?>
    <?= $this->Form->input('title') ?>
    <?= $this->Form->input('body') ?>
    <?= $this->Form->button('Save') ?>
    <?= $this->Form->end() ?>

これで、フォームの送信が可能になり、新しいドキュメントが elasticsearch に追加されました。

Document オブジェクト
=====================

ORM と同様に、Elasticsearch ODM は :doc:`/orm/entities` のようなクラスを使用しています。
継承しなければならない基底クラスは ``Cake\ElasticSearch\Document`` です。
Document クラスは、アプリケーションやプラグイン内の ``Model\Document`` 名前空間に配置します。 ::

    namespace App\Model\Document;

    class Article extends Document
    {
    }

elasticsearch からのデータで Document を動作させるコンストラクタロジックの外側、
インターフェースと ``Document`` によって提供される機能は、 :doc:`/orm/entities`
内にあるものと同じです。

インデックス付きドキュメントの検索
==================================

いくつかのドキュメントをインデックスに登録した後、あなたはそれらを検索したいと思うでしょう。
ElasticSearch プラグインを使用すると、検索クエリを構築するためのクエリビルダーを提供します。 ::

    $query = $this->Articles->find()
        ->where([
            'title' => 'special',
            'or' => [
                'tags in' => ['cake', 'php'],
                'tags not in' => ['c#', 'java']
            ]
        ]);

    foreach ($query as $article) {
        echo $article->title;
    }

フィルタリング条件を追加するために ``FilterBuilder`` を使用することができます。 ::

    $query->where(function ($builder) {
        return $builder->and(
            $builder->gt('views', 99),
            $builder->term('author.name', 'sally')
        );
    });

`FilterBuilder のソース
<https://github.com/cakephp/elastic-search/blob/master/src/FilterBuilder.php>`_
は、多くの一般的に使用されるメソッドの例となるメソッドの完全なリストを持っています。

データのバリデーションとアプリケーションルールの使用
====================================================

ORMと同様に、ElasticSearch プラグインは、ドキュメントをマーシャリングするときに
データを検証することができます。リクエストデータのバリデート、およびアプリケーションルールの
適用は、リレーショナルORMと同じ動作をします。詳細については、:ref:`validating-request-data` と
:ref:`application-rules` のセクションをご覧ください。

.. ネストされたバリデータに関する情報を必要としています。

新しいドキュメントの保存
========================

elasticsearch にいくつかのデータをインデックスする準備ができたら、最初にインデックスが付けられる
``Document`` にデータを変換する必要があります。 ::

    $article = $this->Articles->newEntity($data);
    if ($this->Articles->save($article)) {
        // Document はインデックスされました
    }

ドキュメントをマーシャリングするとき、 ``associated`` キーを使用してマーシャリングしたい
埋め込みドキュメントを指定することができます。 ::

    $article = $this->Articles->newEntity($data, ['associated' => ['Comments']]);

ドキュメントを保存すると、次のイベントがトリガされます：

* ``Model.beforeSave`` - ドキュメントが保存される前に発生します。
  このイベントを停止することによって保存操作を防ぐことができます。
* ``Model.buildRules`` - ルールチェッカーが最初に構築されているときに発生します。
* ``Model.afterSave`` - ドキュメントが保存された後に発生します。

.. note::
    親ドキュメントとすべての埋め込みドキュメントを1つの操作で保存するため、
    埋め込みドキュメントのためのイベントはありません。


既存ドキュメントの更新
======================

データの再インデックスが必要な場合、既存のエンティティにパッチを適用すると再保存できます。 ::

    $query = $this->Articles->find()->where(['user.name' => 'jill']);
    foreach ($query as $doc) {
        $doc->set($newProperties);
        $this->Articles->save($doc);
    }

ドキュメントの削除
==================

ドキュメントを検索した後、それを削除することができます。 ::

    $doc = $this->Articles->get($id);
    $this->Articles->delete($doc);

また、特定の条件に一致するドキュメントを削除することができます。 ::

    $this->Articles->deleteAll(['user.name' => 'bob']);

埋め込みドキュメント
====================

埋め込みドキュメントを定義することで、ドキュメント内の特定のプロパティのパスに
エンティティクラスを添付することができます。これは、親ドキュメント内のドキュメントに
独自の振る舞いを提供することができます。たとえば、あなたが記事に埋め込まれたコメントは、
特定のアプリケーション固有のメソッドを持っている場合があります。あなたが埋め込みドキュメントを
定義するために ``embedOne`` と ``embedMany`` を使用することができます。 ::

    // in src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
        public function initialize()
        {
            $this->embedOne('User');
            $this->embedMany('Comments', [
                'entityClass' => 'MyComment'
            ]);
        }
    }

上記の ``Article`` ドキュメント上の2つの埋め込みドキュメントを作成します。
``User`` 埋め込みは ``App\Model\Document\User`` のインスタンスに ``user`` プロパティを変換します。
プロパティ名と一致していないクラス名を使用する埋め込みコメントを得るためには、カスタムクラス名を
設定するための ``entityClass`` オプションを使用することができます。

埋め込みドキュメントをセットアップしたら、 ``find()`` と ``get`` の結果は
正しい埋め込みドキュメントクラスのオブジェクトを返します。 ::

    $article = $this->Articles->get($id);
    // App\Model\Document\User のインスタンス
    $article->user;

    // App\Model\Document\Comment インスタンスの配列
    $article->comments;

Type インスタンスの取得
=======================

ORM と同様に、ElasticSearch プラグインは ``Type`` のインスタンスを取得するための
ファクトリ/レジストリを提供します。 ::

    use Cake\ElasticSearch\TypeRegistry;

    $articles = TypeRegistry::get('Articles');

レジストリのフラッシュ
----------------------

テストケースの中で、レジストリをフラッシュすることができます。
そうすることでモックオブジェクトを使用したり、Type の依存関係を変更する際に便利です。 ::

    TypeRegistry::flush();

テストフィクスチャ
==================

ElasticSearch プラグインは、シームレスなテストスイートの統合を提供します。ちょうどデータベースの
フィクスチャのように、elasticsearch のためのテストフィクスチャを作成することができます。
次のように Articles タイプのテストフィクスチャを定義することができます。 ::

    namespace App\Test\Fixture;

    use Cake\ElasticSearch\TestSuite\TestFixture;

    /**
     * Articles fixture
     */
    class ArticlesFixture extends TestFixture
    {
        /**
         * The table/type for this fixture.
         *
         * @var string
         */
        public $table = 'articles';

        /**
         * The mapping data.
         *
         * @var array
         */
        public $schema = [
            'id' => ['type' => 'integer'],
            'user' => [
                'type' => 'nested',
                'properties' => [
                    'username' => ['type' => 'string'],
                ]
            ]
            'title' => ['type' => 'string'],
            'body' => ['type' => 'string'],
        ];

        public $records = [
            [
                'user' => [
                    'username' => 'billy'
                ],
                'title' => 'First Post',
                'body' => 'Some content'
            ]
        ];
    }

``schema`` プロパティは `ネイティブ elasticsearch マッピングフォーマット
<https://www.elastic.co/guide/en/elasticsearch/reference/1.5/mapping.html>`_ を使用します。
安全にタイプ名およびトップレベルの ``properties`` キーを省略することができます。
フィクスチャが作成されたら、あなたのテストの ``fixtures`` プロパティに含めることによって、
あなたのテストケースで使用することができます。 ::

    public $fixtures = ['app.articles'];
