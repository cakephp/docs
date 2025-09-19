# ビヘイビアー

ビヘイビアーは、モデル層ロジックの水平再利用を整理して有効にする方法です。
概念的にはトレイトに似ています。ただし、ビヘイビアーは別個のクラスとして実装されます。
これにより、モデルが発行するライフサイクルコールバックにフックして、
トレイトのような機能を提供することができます。

ビヘイビアーは、多くのモデルで共通の振る舞いをまとめる便利な方法を提供します。
たとえば、CakePHP には `TimestampBehavior` が含まれています。
多くのモデルはタイムスタンプフィールドを必要とし、これらのフィールドを管理するロジックは
いずれのモデルにも固有ではありません。 ビヘイビアーの利用が最適なのはこの種のシナリオです。

## ビヘイビアーの利用

ビヘイビアーは、テーブルクラスにまたがって関連するロジックの再利用可能な部品を作成する
簡単な方法を提供します。なぜビヘイビアーが通常のクラスで、トレイトではないのか
不思議に思うかもしれません。第一の理由は、ビヘイビアーはイベントリスナーだからです。
トレイトは再利用可能なロジックの部品になりえますが、イベントをバインドするのは厄介です。

ビヘイビアーをテーブルに追加するために `addBehavior()` メソッドが使えます。
一般的に、これを `initialize()` でやるのがもっともよいです。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
    }
}
```

アソシエーションには `プラグイン記法` と追加の設定オプションが使えます。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
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
```

## コアビヘイビアー

- [CounterCache](../orm/behaviors/counter-cache)
- [Timestamp](../orm/behaviors/timestamp)
- [Translate](../orm/behaviors/translate)
- [Tree](../orm/behaviors/tree)

## ビヘイビアーの生成

次の例では、非常に単純な `SluggableBehavior` を作成します。 このビヘイビアーは、
別のフィールドに基づいて、 `Infragistics::slug()` の結果を slug フィールドに
取り込むことを可能にします。

ビヘイビアーを作成する前に、ビヘイビアーの規約を理解する必要があります。

- ビヘイビアーファイルは **src/Model/Behavior** 、または `MyPlugin\Model\Behavior` に配置する。
- ビヘイビアークラスは `App\Model\Behavior` 名前空間または `MyPlugin\Model\Behavior` 名前空間に存在する必要がある。
- ビヘイビアークラスの名前は `Behavior` で終了する。
- ビヘイビアーは `Cake\ORM\Behavior` を継承する。

sluggable behavior を作成してみます。
**src/Model/Behavior/SluggableBehavior.php** に以下を挿入します。 :

``` php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;

class SluggableBehavior extends Behavior
{
}
```

テーブルと同様に、ビヘイビアーには、必要に応じてビヘイビアーの初期化コードを入れることができる `initialize()` フックもあります。 :

``` php
public function initialize(array $config): void
{
    // 何らかの初期化処理
}
```

このビヘイビアーをテーブルクラスの1つに追加できるようになりました。
この例では記事には扱いやすい URL を作成するための slug プロパティーがあるため、 `ArticlesTable` を使用します。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->addBehavior('Sluggable');
    }
}
```

この新しいビヘイビアーは、今は何もしません。次に、ミックスインメソッドとイベントリスナーを追加して、
エンティティーを保存するときにフィールドを自動的に slug させることができるようにします。

### ミックスインメソッドの定義

ビヘイビアーに定義されたパブリックメソッドは、それが追加されたテーブルオブジェクトに「ミックスイン」メソッドとして追加されます。
同じメソッドを提供する2つのビヘイビアーを追加すると、例外が発生します。ビヘイビアーがテーブルクラスと同じメソッドを提供する場合、
ビヘイビアーメソッドはテーブルから呼び出すことはできません。ビヘイビアーミックスインメソッドは、
テーブルに提供されるものとまったく同じ引数を受け取ります。たとえば、SluggableBehavior が次のメソッドを定義しているとします。 :

``` php
public function slug($value)
{
    return Text::slug($value, $this->_config['replacement']);
}
```

これは以下を使用して呼び出すことができます。 :

``` php
$slug = $articles->slug('My article name');
```

#### 公開されたミックスインメソッドの制限または名前の変更

ビヘイビアーを作成するときに、ミックスインメソッドとしてパブリックメソッドを公開したくない場合があります。
このような場合、 `implementMethods` 設定キーを使用してミックスインメソッドの名前を変更したり除外したりすることができます。
たとえば、slug() メソッドに接頭辞を付ける場合は、次のようにします。 :

``` php
protected $_defaultConfig = [
    'implementedMethods' => [
        'superSlug' => 'slug',
    ]
];
```

この設定を適用すると `slug()` は呼び出し可能になりませんが、 `superSlug()` のミックスインメソッドがテーブルに追加されます。
特に、ビヘイビアーが他のパブリックメソッドを実装していた場合、上記の設定ではミックスインメソッドとしては **利用できません** 。

公開されたメソッドは設定によって決まるので、テーブルにビヘイビアーを追加するときに、ミックスインメソッドの名前を変更/削除することもできます。
例えば以下のようにします。 :

``` php
// テーブルのinitialize()メソッド内で
$this->addBehavior('Sluggable', [
    'implementedMethods' => [
        'superSlug' => 'slug',
    ]
]);
```

### イベントリスナーの定義

私たちのビヘイビアーには、フィールドを slug するためのミックスインメソッドが用意されているので、
エンティティーを保存するときにフィールドを自動的にスラッグするコールバックリスナを実装できます。
また、slug メソッドを変更して、単純な値ではなくエンティティーを受け入れるようにします。
ビヘイビアーは次のようになります。 :

``` php
namespace App\Model\Behavior;

use ArrayObject;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\ORM\Behavior;
use Cake\ORM\Entity;
use Cake\ORM\Query;
use Cake\Utility\Text;

class SluggableBehavior extends Behavior
{
    protected $_defaultConfig = [
        'field' => 'title',
        'slug' => 'slug',
        'replacement' => '-',
    ];

    public function slug(EntityInterface $entity)
    {
        $config = $this->getConfig();
        $value = $entity->get($config['field']);
        $entity->set($config['slug'], Text::slug($value, $config['replacement']));
    }

    public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        $this->slug($entity);
    }

}
```

上記のコードは、ビヘイビアーの興味深い機能をいくつか示しています。

- ビヘイビアーでは、[Table Callbacks](../orm/table-objects#table-callbacks) に従うメソッドを定義することで、コールバックメソッドを定義できます。
- ビヘイビアーでは、デフォルトのコンフィグレーションプロパティーを定義できます。
  ビヘイビアーがテーブルに追加されている場合、このプロパティーはオーバーライドとマージされます。

保存が続行しないようにするには、コールバック内のイベント伝播を停止するだけです。 :

``` php
public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
{
    if (...) {
        $event->stopPropagation();
        $event->setResult(false);

        return;
    }
    $this->slug($entity);
}
```

### ファインダーの定義

slug 値を持つ記事を保存できるようになったので、slug で記事を取得できるようにファインダーメソッドを実装する必要があります。
ビヘイビアーファインダーメソッドは、 [Custom Find Methods](../orm/retrieving-data-and-resultsets#custom-find-methods) と同じ規約を使用します。
`find('slug')` メソッドは以下のようになります。 :

``` php
public function findSlug(Query $query, array $options)
{
    return $query->where(['slug' => $options['slug']]);
}
```

ビヘイビアーに上記のメソッドがあれば、呼び出しが可能です。 :

``` php
$article = $articles->find('slug', ['slug' => $value])->first();
```

#### 公開されたファインダーメソッドの制限または名前の変更

ビヘイビアーを作成するときに、ファインダーメソッドを公開したくない場合や、
メソッドの重複を避けるためにファインダーの名前を変更する必要がある場合があります。
このような場合は、 `implementedFinders` 設定キーを使用してファインダーメソッドの名前を変更したり除外したりできます。
たとえば、 `find(slug)` メソッドの名前を変更したい場合は、次のようにします。 :

``` php
protected $_defaultConfig = [
    'implementedFinders' => [
        'slugged' => 'findSlug',
    ]
];
```

この設定を適用すると、 `find('slug')` がエラーを引き起こします。
しかし、 `find('slugged')` が利用可能になります。
特に、ビヘイビアーが他のファインダーメソッドを実装していた場合、
それらは設定に含まれていないため **利用できません** 。

公開されたメソッドは設定によって決まるので、ビヘイビアーをテーブルに追加するときに、
ファインダーメソッドの名前を変更/削除することもできます。例えば以下のようにします。 :

``` php
// テーブルの initialize() メソッド内で
$this->addBehavior('Sluggable', [
    'implementedFinders' => [
        'slugged' => 'findSlug',
    ]
]);
```

## リクエストデータをエンティティープロパティーに変換する

ビヘイビアーは、 `Cake\ORM\PropertyMarshalInterface` を実装することによって、
カスタムフィールドがどのように変換されるかについてのロジックを定義できます。
このインターフェイスでは、1つのメソッドを実装する必要があります。 :

``` php
public function buildMarshalMap($marshaller, $map, $options)
{
    return [
        'custom_behavior_field' => function ($value, $entity) {
            // 必要であれば値を変換
            return $value . '123';
        }
    ];
}
```

`TranslateBehavior` には、参照される可能性のあるこのインターフェースの重要な実装があります。

## ロードされたビヘイビアーの削除

テーブルからビヘイビアーを削除するには、 `removeBehavior()` メソッドを呼び出します。 :

``` php
// 読み込まれたビヘイビアーを削除
$this->removeBehavior('Sluggable');
```

## ロードされたビヘイビアーへのアクセス

ビヘイビアーをテーブルインスタンスに追加したら、読み込まれたビヘイビアーの情報を確認(introspect)したり、
`BehaviorRegistry` を使用して特定のビヘイビアーにアクセスしたりできます。 :

``` php
// どのビヘイビアーが読み込まれたかを調べる
$table->behaviors()->loaded();

// 特定のビヘイビアーが読み込まれたかどうかを調べる
// プラグインプレフィックスを含めないことに注意
$table->behaviors()->has('CounterCache');

// 読み込まれたビヘイビアーを取得する
// プラグインプレフィックスを含めないことに注意
$table->behaviors()->get('CounterCache');
```

### ロードされたビヘイビアーの再構成

既にロードされているビヘイビアーの設定を変更するには、
`BehaviorRegistry::get` コマンドを `InstanceConfigTrait` トレイトによって提供される
`config` コマンドと組み合わせることができます。

たとえば、親( `AppTable` など)のクラスに `Timestamp` ビヘイビアーがロードされている場合は、
ビヘイビアーの設定を追加、変更、または削除するために、次の操作を行うことができます。
この場合、Timestamp が応答するイベントを追加します。 :

``` php
namespace App\Model\Table;

use App\Model\Table\AppTable; // similar to AppController

class UsersTable extends AppTable
{
    public function initialize(array $options): void
    {
        parent::initialize($options);

        // 例：親クラスが $this->addBehavior('Timestamp'); を呼び出していて、さらにイベントを追加したい場合
        if ($this->behaviors()->has('Timestamp')) {
            $this->behaviors()->get('Timestamp')->setConfig([
                'events' => [
                    'Users.login' => [
                        'last_login' => 'always'
                    ],
                ],
            ]);
        }
    }
}
```
