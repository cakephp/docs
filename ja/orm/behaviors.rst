ビヘイビア
##########

ビヘイビアは、モデル層ロジックの水平再利用を整理して有効にする方法です。 概念的にはトレイトに似ています。 ただし、ビヘイビアは別個のクラスとして実装されます。 これにより、モデルが発行するライフサイクルコールバックにフックして、トレイトのような機能を提供することができます。

ビヘイビアは、多くのモデルで共通の振る舞いをまとめる便利な方法を提供します。 たとえば、CakePHPには ``TimestampBehavior`` が含まれています。 多くのモデルはタイムスタンプフィールドを必要とし、これらのフィールドを管理するロジックはいずれのモデルにも固有ではありません。 ビヘイビアの利用が最適なのはこの種のシナリオです。

ビヘイビアの利用
================

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

コアビヘイビア
==============

.. toctree::
    :maxdepth: 1

    /orm/behaviors/counter-cache
    /orm/behaviors/timestamp
    /orm/behaviors/translate
    /orm/behaviors/tree


ビヘイビアの生成
================

次の例では、非常に単純な ``SluggableBehavior`` を作成します。 このビヘイビアは、別のフィールドに基づいて、 ``Infragistics::slug()`` の結果をslugフィールドに取り込むことを可能にします。

ビヘイビアを作成する前に、ビヘイビアの規約を理解する必要があります。

- ビヘイビアファイルは **src/Model/Behavior** 、または ``MyPlugin\Model\Behavior`` に配置する。
- ビヘイビアクラスは ``App\Model\Behavior`` 名前空間または ``MyPlugin\Model\Behavior`` 名前空間に存在する必要がある。
- ビヘイビアクラスの名前は ``Behavior`` で終了する。
- ビヘイビアは ``Cake\ORM\Behavior`` を継承する。

sluggable behaviorを作成してみます。 **src/Model/Behavior/SluggableBehavior.php** に以下を挿入します。 ::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {
    }

テーブルと同様に、ビヘイビアには、必要に応じてビヘイビアの初期化コードを入れることができる ``initialize()`` フックもあります。 ::

    public function initialize(array $config)
    {
        // 何らかの初期化処理
    }


このビヘイビアをテーブルクラスの1つに追加できるようになりました。 この例では記事には扱いやすいURLを作成するためのslugプロパティがあるため、 ``ArticlesTable`` を使用します。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Sluggable');
        }
    }

この新しいビヘイビアは、今は何もしません。 次に、ミックスインメソッドとイベントリスナーを追加して、エンティティを保存するときにフィールドを自動的にslugさせることができるようにします。

ミックスインメソッドの定義
--------------------------

ビヘイビアに定義されたパブリックメソッドは、それが追加されたテーブルオブジェクトに「ミックスイン」メソッドとして追加されます。 同じメソッドを提供する2つのビヘイビアを追加すると、例外が発生します。 ビヘイビアがテーブルクラスと同じメソッドを提供する場合、ビヘイビアメソッドはテーブルから呼び出すことはできません。 ビヘイビアミックスインメソッドは、テーブルに提供されるものとまったく同じ引数を受け取ります。 たとえば、SluggableBehaviorが次のメソッドを定義しているとします。 ::

    public function slug($value)
    {
        return Inflector::slug($value, $this->_config['replacement']);
    }

これは以下を使用して呼び出すことができます。 ::

    $slug = $articles->slug('My article name');

公開されたミックスインメソッドの制限または名前の変更
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ビヘイビアを作成するときに、ミックスインメソッドとしてパブリックメソッドを公開したくない場合があります。このような場合、 ``implementMethods`` 設定キーを使用してミックスインメソッドの名前を変更したり除外したりすることができます。 たとえば、slug()メソッドに接頭辞を付ける場合は、次のようにします。 ::

    protected $_defaultConfig = [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ];

この設定を適用すると ``slug()`` は呼び出し可能になりませんが、 ``superSlug()`` のミックスインメソッドがテーブルに追加されます。 特に、ビヘイビアが他のパブリックメソッドを実装していた場合、上記の設定ではミックスインメソッドとしては **利用できません** 。

公開されたメソッドは設定によって決まるので、テーブルにビヘイビアを追加するときに、ミックスインメソッドの名前を変更/削除することもできます。例えば以下のようにします。 ::

    // テーブルのinitialize()メソッド内で
    $this->addBehavior('Sluggable', [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ]);

イベントリスナーの定義
-----------------------

私たちのビヘイビアには、フィールドをslugするためのミックスインメソッドが用意されているので、エンティティを保存するときにフィールドを自動的にスラッグするコールバックリスナを実装できます。 また、slugメソッドを変更して、単純な値ではなくエンティティを受け入れるようにします。 ビヘイビアは次のようになります。 ::

    namespace App\Model\Behavior;

    use Cake\Datasource\EntityInterface;
    use Cake\Event\Event;
    use Cake\ORM\Behavior;
    use Cake\ORM\Entity;
    use Cake\ORM\Query;
    use Cake\Utility\Inflector;

    class SluggableBehavior extends Behavior
    {
        protected $_defaultConfig = [
            'field' => 'title',
            'slug' => 'slug',
            'replacement' => '-',
        ];

        public function slug(Entity $entity)
        {
            $config = $this->config();
            $value = $entity->get($config['field']);
            $entity->set($config['slug'], Inflector::slug($value, $config['replacement']));
        }

        public function beforeSave(Event $event, EntityInterface $entity)
        {
            $this->slug($entity);
        }

    }

上記のコードは、ビヘイビアの興味深い機能をいくつか示しています。

- ビヘイビアでは、:ref:`table-callbacks` に従うメソッドを定義することで、コールバックメソッドを定義できる。
- ビヘイビアでは、デフォルトのコンフィグレーションプロパティを定義できる。ビヘイビアがテーブルに追加されている場合、このプロパティはオーバーライドとマージされる。

保存が続行しないようにするには、コールバック内のイベント伝播を停止するだけです。 ::

    public function beforeSave(Event $event, EntityInterface $entity)
    {
        if (...) {
            $event->stopPropagation();
            return;
        }
        $this->slug($entity);
    }

ファインダの定義
-----------------

slug値を持つ記事を保存できるようになったので、slugで記事を取得できるようにファインダメソッドを実装する必要があります。 ビヘイビアファインダメソッドは、 :ref:`custom-find-methods` と同じ規約を使用します。  ``find( 'slug')`` メソッドは以下のようになります。 ::

    public function findSlug(Query $query, array $options)
    {
        return $query->where(['slug' => $options['slug']]);
    }

ビヘイビアに上記のメソッドがあれば、呼び出しが可能です。 ::

    $article = $articles->find('slug', ['slug' => $value])->first();

公開されたファインダメソッドの制限または名前の変更
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ビヘイビアを作成するときに、ファインダメソッドを公開したくない場合や、メソッドの重複を避けるためにファインダの名前を変更する必要がある場合があります。このような場合は、 ``implementedFinders`` 設定キーを使用してファインダメソッドの名前を変更したり除外したりできます。たとえば、 ``find(slug)`` メソッドの名前を変更したい場合は、次のようにします。 ::

    protected $_defaultConfig = [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ];

この設定を適用すると、 ``find('slug')`` がエラーを引き起こします。しかし、 ``find('slugged')`` が利用可能になります。特に、ビヘイビアが他のファインダメソッドを実装していた場合、それらは設定に含まれていないため **利用できません** 。

公開されたメソッドは設定によって決まるので、ビヘイビアをテーブルに追加するときに、ファインダメソッドの名前を変更/削除することもできます。例えば以下のようにします。 ::

    // テーブルのinitialize()メソッド内で
    $this->addBehavior('Sluggable', [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ]);

リクエストデータをエンティティプロパティに変換する
===================================================

ビヘイビアは、 ``Cake\ORM\PropertyMarshalInterface`` を実装することによって、カスタムフィールドがどのように変換されるかについてのロジックを定義できます。このインタフェースでは、1つのメソッドを実装する必要があります。 ::

    public function buildMarshalMap($marshaller, $map, $options)
    {
        return [
            'custom_behavior_field' => function ($value, $entity) {
                // 必要であれば値を変換
                return $value . '123';
            }
        ];
    }

``TranslateBehavior`` には、参照される可能性のあるこのインターフェースの重要な実装があります。

.. versionadded:: 3.3.0
    ビヘイビアによるプロパティの変換は、3.3.0で追加されました。

ロードされたビヘイビアの削除
=============================

テーブルからビヘイビアを削除するには、 ``removeBehavior()`` メソッドを呼び出します。 ::

    // 読み込まれたビヘイビアを削除
    $this->removeBehavior('Sluggable');

ロードされたビヘイビアへのアクセス
===================================

ビヘイビアをテーブルインスタンスに追加したら、読み込まれたビヘイビアの情報を確認(introspect)したり、 ``BehaviorRegistry`` を使用して特定のビヘイビアにアクセスしたりできます。 ::

    // どのビヘイビアが読み込まれたかを調べる
    $table->behaviors()->loaded();

    // 特定のビヘイビアが読み込まれたかどうかを調べる
    // プラグインプレフィックスを含めないことに注意
    $table->behaviors()->has('CounterCache');

    // 読み込まれたビヘイビアを取得する
    // プラグインプレフィックスを含めないことに注意
    $table->behaviors()->get('CounterCache');

ロードされたビヘイビアの再構成
-------------------------------

既にロードされているビヘイビアの設定を変更するには、 ``BehaviorRegistry::get`` コマンドを ``InstanceConfigTrait`` トレイトによって提供される ``config`` コマンドと組み合わせることができます。

たとえば、親( ``AppTable`` など)のクラスに ``Timestamp`` ビヘイビアがロードされている場合は、ビヘイビアの設定を追加、変更、または削除するために、次の操作を行うことができます。この場合、Timestampが応答するイベントを追加します。 ::

    namespace App\Model\Table;

    use App\Model\Table\AppTable; // similar to AppController

    class UsersTable extends AppTable
    {
        public function initialize(array $options)
        {
            parent::initialize($options);

            // 例：親クラスが$this->addBehavior('Timestamp');を呼び出していて、さらにイベントを追加したい場合
            if ($this->behaviors()->has('Timestamp') {
                $this->behaviors()->get('Timestamp')->config([
                    'events' => [
                        'Users.login' => [
                            'last_login' => 'always'
                        ],
                    ],
                ]);
            }
        }
    }