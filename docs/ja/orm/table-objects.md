# テーブルオブジェクト

`class` Cake\\ORM\\**Table**

テーブルオブジェクトは特定のテーブルに保存されたエンティティーのコレクションへのアクセスを提供します。
それぞれのテーブルは、与えられたテーブルによって繋がれた関連付けられたテーブルクラスを持ちます。
もし、与えられたテーブルの振る舞いをカスタマイズする必要ないなら、CakePHP はテーブルのインスタンスを
作ります。

テーブルオブジェクトと ORM を作る前に　[データベースへの接続](../orm/database-basics#database-configuration)
がなされているか確かめましょう。

## 基本的な使い方

まずはじめにテーブルクラスを作ってください。これらのクラスは **src/Model/Table** に作ります。
テーブルは、リレーショナルデータベースに特化したモデルコレクションです。
そして、CakePHP の ORM の中で、あなたのデータベースへの主なインターフェースです。
最も基本的なテーブルクラスは次のようになります。 :

``` php
// src/Model/Table/ArticlesTable.php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
}
```

このクラスで使用するテーブル名を ORM に伝えていないことに注目してください。規約により、
テーブルオブジェクトは、クラス名を小文字とアンダースコアー区切りにした名前のテーブルを使用します。
上記の例では `articles` テーブルが使用されます。テーブルクラスが `BlogPosts`
という名前の場合、テーブルは `blog_posts` と名付けてください。
あなたは、 `setTable()` メソッドを使用することでテーブルを指定できます。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setTable('my_table');
    }
}
```

テーブルを指定した時は、命名規則は適用されません。規約により、ORM はそれぞれのテーブルが
`id` という名前の主キーを持っていることを前提としています。もし主キーの名前を変更する
必要がある場合、 `setPrimaryKey()` メソッドが使用できます。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setPrimaryKey('my_id');
    }
}
```

### テーブルが使うエンティティークラスのカスタマイズ

デフォルトではテーブルオブジェクトは命名規則に従った Entity クラスを使います。
たとえば、 `ArticlesTable` というテーブルクラスの名前だったらエンティティーは `Article`
に、 `PurchaseOrdersTable` というテーブルクラスの名前だったらエンティティーは `PurchaseOrder`
になります。もし命名規約に従わない場合は、 `setEntityClass()` メソッドで設定を変えられます。 :

``` php
class PurchaseOrdersTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setEntityClass('App\Model\Entity\PO');
    }
}
```

上記の例では、テーブルオブジェクトはコンストラクターの最後に呼ばれる `initialize()`
メソッドを持ちます。コンストラクターをオーバーライドする代わりに、
このメソッドで初期化することを推奨します。

### テーブルクラスのインスタンスを取得する

テーブルにクエリーを実行する前に、テーブルインスタンスを取得する必要があります。
`TableLocator` クラスを使用することで取得できます。 :

``` php
// コントローラー内で

$articles = $this->getTableLocator()->get('Articles');
```

`TableLocator` はテーブルを作るための様々な依存関係を提供します。
そして、作成されたすべてのテーブルインスタンスの設定を維持し、リレーションの構築と
ORM の設定を簡単にしてくれます。詳細は [Table Locator Usage](#table-locator-usage) をご覧ください。

テーブルクラスがプラグインの中にある場合、あなたのテーブルクラスのために正しい名前を
必ず使用してください。それに失敗すると、デフォルトのクラスが正しいクラスの代わりに使われてしまい、
バリデーションルールやコールバックが呼ばれないなどの結果を生じます。プラグインのテーブルクラスを
正しくロードするために、次のように使用してください。 :

``` php
// プラグインの Table
$articlesTable = $this->getTableLocator()->get('PluginName.Articles');

// ベンダープレフィックス付きのプラグイン Table
$articlesTable = $this->getTableLocator()->get('VendorName/PluginName.Articles');
```

## コールバックのライフサイクル

上記で示した通り、テーブルオブジェクトは、いろいろなイベントを起こします。イベントは、
ORM 内でフックしたり、サブクラス化やメソッドをオーバーライドせずにロジックを加えたい時に便利です。
イベントリスナーはテーブルクラスやビヘイビアークラスで定義できます。
また、テーブルのイベントマネージャーをリスナーをバインドするために使えます。

コールバックメソッドを使うとき、 `initialize()` メソッドで追加されたビヘイビアーは、
テーブルコールバックメソッドが開始する **前に** 呼ばれるリスナーを持ちます。
これは、コントローラーやコンポーネントと同じ流れに従います。

イベントリスナーにテーブルクラスやビヘイビアーを追加するには、単純にメソッド名を以下の様に使います。
イベントサブシステムの使い方の詳細は [イベントシステム](../core-libraries/events) をご覧ください。:

``` php
// コントローラー内で
$articles->save($article, ['customVariable1' => 'yourValue1']);

// ArticlesTable.php内で
public function afterSave(Event $event, EntityInterface $entity, ArrayObject $options)
{
    $customVariable = $options['customVariable1'];  // 'yourValue1'
    $options['customVariable2'] = 'yourValue2';
}

public function afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)
{
    $customVariable = $options['customVariable1'];  // 'yourValue1'
    $customVariable = $options['customVariable2'];  // 'yourValue2'
}
```

### イベント一覧

- `Model.initialize`
- `Model.beforeMarshal`
- `Model.afterMarshal`
- `Model.beforeFind`
- `Model.buildValidator`
- `Model.buildRules`
- `Model.beforeRules`
- `Model.afterRules`
- `Model.beforeSave`
- `Model.afterSave`
- `Model.afterSaveCommit`
- `Model.beforeDelete`
- `Model.afterDelete`
- `Model.afterDeleteCommit`

### initialize

`method` Cake\\ORM\\Table::**initialize**(EventInterface $event, ArrayObject $data, ArrayObject $options)

`Model.initialize` イベントは、コンストラクターと initialize メソッドが呼ばれた後に発行されます。
デフォルトでは、 `Table` クラスは、このイベントを購読しません。そして、代わりに `initialize`
フックメソッドを使います。

`Model.initialize` イベントに応答するために、 `EventListenerInterface`
を実装したリスナークラスを作成することができます。 :

``` php
use Cake\Event\EventListenerInterface;
class ModelInitializeListener implements EventListenerInterface
{
    public function implementedEvents()
    {
        return [
            'Model.initialize' => 'initializeEvent',
        ];
    }

    public function initializeEvent($event): void
    {
        $table = $event->getSubject();
        // ここで何かする
    }
}
```

そして、以下のように `EventManager` にリスナーを追加します。 :

``` php
use Cake\Event\EventManager;
$listener = new ModelInitializeListener();
EventManager::instance()->attach($listener);
```

これは、任意の `Table` クラスが構築されたとき、 `initializeEvent` を呼びます。

### beforeMarshal

`method` Cake\\ORM\\Table::**beforeMarshal**(EventInterface $event, ArrayObject $data, ArrayObject $options)

`Model.beforeMarshal` イベントは、リクエストデータがエンティティーに変換される前に発行されます。
詳細は [Before Marshal](../orm/saving-data#before-marshal) をご覧ください。

### afterMarshal

`method` Cake\\ORM\\Table::**afterMarshal**(EventInterface $event, EntityInterface $entity, ArrayObject $data, ArrayObject $options)

The `Model.afterMarshal` イベントは、リクエストデータがエンティティーに変換された後に発行されます。
イベントハンドラは、変換されたエンティティ、元のリクエストデータ、および `patchEntity()` または `newEntity()` 呼び出しに提供されたオプションを取得します。

::: info Added in version 4.1.0
:::

### beforeFind

`method` Cake\\ORM\\Table::**beforeFind**(EventInterface $event, Query $query, ArrayObject $options, $primary)

`Model.beforeFind` イベントは、各検索操作の前に発生します。
イベントを停止し、クエリにカスタム結果セットを渡すことにより、検索操作を完全にバイパスできます。:

``` php
public function beforeFind(EventInterface $event, Query $query, ArrayObject $options, $primary)
{
    if (/* ... */) {
        $event->stopPropagation();
        $query->setResult(new \Cake\Datasource\ResultSetDecorator([]));

        return;
    }
    // ...
}
```

この例では、関連するテーブルまたはそのアタッチされたビヘイビアーで `beforeFind` イベントはトリガーされません。
ただし、振る舞いイベントは通常、デフォルトの優先順位が与えられているため、以前に呼び出されます。
クエリは `Query::setResult()` を介して渡された空の結果セットを返します。

イベントを止めて戻り値を返すことで find を完全にバイパスできます。 `$query`
インスタンスに対してなされた全ての変更は find 処理の間
維持されます。 `$primary` パラメーターは、これがルートクエリーなのか、それともアソシエーションの
クエリーなのかを示します。クエリーに含まれる全てのアソシエーションで `Model.beforeFind`
イベントが呼ばれます。 JOIN を使うアソシエーションに対しては、ダミーのクエリーが渡されます。
イベントリスナーでは、追加のフィールド、検索条件、 JOIN や結果のフォーマッターを設定出来ます。
これらのオプションや機能はルートクエリーにコピーされます。

CakePHP の旧バージョンでは `afterFind` コールバックがありましたが、 [Map Reduce](../orm/retrieving-data-and-resultsets#map-reduce)
機能とエンティティーのコンストラクターに置き換えられました。

### buildValidator

`method` Cake\\ORM\\Table::**buildValidator**(EventInterface $event, Validator $validator, $name)

`Model.buildValidator` イベントは `$name` バリデーターが作られた時に発行されます。
ビヘイビアーは、バリデーションメソッドに追加するために、このフックが使用できます。

### buildRules

`method` Cake\\ORM\\Table::**buildRules**(EventInterface $event, RulesChecker $rules)

`Model.buildRules` イベントはルールインスタンスが作られた後と、
Table の `beforeRules()` メソッドが呼ばれた後に発行されます。

### beforeRules

`method` Cake\\ORM\\Table::**beforeRules**(EventInterface $event, EntityInterface $entity, ArrayObject $options, $operation)

`Model.beforeRules` イベントはエンティティーにルールが適用される前に発行されます。
このイベントが止まると、チェックのためのルールを停止して、適用したルールの結果を
セットすることができます。

### afterRules

`method` Cake\\ORM\\Table::**afterRules(EventInterface $event, EntityInterface $entity, ArrayObject $options, bool $result, string $operation): bool**()

`Model.afterRules` イベントはルールがエンティティーに適用された後に発行されます。
このイベントが止まると、操作をチェックするためのルールの結果の値を返すことができます。

### beforeSave

`method` Cake\\ORM\\Table::**beforeSave**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.beforeSave` イベントはエンティティーが保存する前に発行されます。
このイベントを止めることによって、保存を停止できます。イベントが停止すると、
このイベントの結果が返されます。

### afterSave

`method` Cake\\ORM\\Table::**afterSave**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.afterSave` イベントはエンティティーを保存した後に発行されます。

### afterSaveCommit

`method` Cake\\ORM\\Table::**afterSaveCommit**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.afterSaveCommit` イベントは、保存処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 `save()` が直接呼ばれた最初のテーブルだけに引き起こされます。
save が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

### beforeDelete

`method` Cake\\ORM\\Table::**beforeDelete**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.beforeDelete` イベントはエンティティーを削除する前に発行されます。
このイベントを停止することによって、削除を中止できます。イベントが停止すると、
このイベントの結果が返されます。

### afterDelete

`method` Cake\\ORM\\Table::**afterDelete**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.afterDelete` イベントはエンティティーが削除された後に発行されます。

### afterDeleteCommit

`method` Cake\\ORM\\Table::**afterDeleteCommit**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

`Model.afterDeleteCommit` イベントは、削除処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 `delete()` が直接呼ばれた最初のテーブルだけに引き起こされます。
delete が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

### Stopping Table Events

保存を継続しないようにするには、コールバックでイベントの伝搬を停止するだけです:

``` php
public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
{
    if (...) {
        $event->stopPropagation();
        $event->setResult(false);

        return;
    }
    ...
}
```

また、コールバックからfalseを返すこともできます。これはイベントの伝播を止めるのと同じ効果があります。

### Callback priorities

テーブルやビヘイビアでイベントを使用する際には、優先順位とリスナーが付く順番に注意してください。
ビヘイビアイベントは、テーブルイベントの前にアタッチされます。
デフォルトの優先順位では、ビヘイビアのコールバックが同名のテーブルイベントの **前** にトリガーされます。

例えば、テーブルが `TreeBehavior` を使用している場合、
`TreeBehavior::beforeDelete()` メソッドは、テーブルの `beforeDelete()` メソッドよりも先に呼び出されてしまい、
テーブルのメソッドで削除される子要素のレコードを操作することはできません。

イベントの優先順位を管理するには、いくつかの方法があります:

1.  `priority` オプションを使って、ビヘイビアのリスナーの **優先度** を変更します。
    これは、ビヘイビアの **すべての** コールバックメソッドの優先度を変更します。

    Behavior:

    ``` php
    // In a Table initialize() method
    $this->addBehavior('Tree', [
        // Default value is 10 and listeners are dispatched from the
        // lowest to highest priority.
        'priority' => 2,
    ]);
    ```

2.  `Model.implementedEvents()` メソッドを使用し、 `Table` クラスの `priority` を変更します。
    これにより、コールバック関数ごとに異なる優先度を割り当てることができます:

    ``` php
    // In a Table class.
    public function implementedEvents()
    {
        $events = parent::implementedEvents();
        $events['Model.beforeDelete'] = [
            'callable' => 'beforeDelete',
            'priority' => 3
        ];

        return $events;
    }
    ```

## ビヘイビアー

`method` Cake\\ORM\\Table::**addBehavior**($name, array $options = [])

<!-- start-behaviors -->

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

<!-- end-behaviors -->

CakePHP によって提供されるビヘイビアーを含む、ビヘイビアーに関する詳細は [ビヘイビアー](../orm/behaviors)
の章をご覧ください。

## 接続設定

デフォルトでは、全てのテーブルインスタンスは `default` データベース接続を使用します。
もし、複数のデータベース接続を使用している場合、それぞれのコネクションを使用してテーブルを
設定したくなるでしょう。これは、 `defaultConnectionName()` メソッドで出来ます。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public static function defaultConnectionName(): string {
        return 'replica_db';
    }
}
```

> [!NOTE]
> `defaultConnectionName()` メソッドはスタティックで **なければなりません** 。

## TableLocator の利用<span id="table-registry-usage"></span>

`class` Cake\\ORM\\**TableLocator**

これまで見てきたように、TableLocator クラスは　factory/registry を
アプリケーションのテーブルインスタンスにアクセスするために使うことを簡単にします。
これには他にも便利な機能があります。

### テーブルオブジェクトの設定

`static` Cake\\ORM\\TableLocator::**get**($alias, $config)

テーブルをレジストリーからロードする時に、依存関係をカスタマイズするか、
`$options` 配列が用意するモックオブジェクトを使います。 :

``` php
$articles = FactoryLocator::get('Table')->get('Articles', [
    'className' => 'App\Custom\ArticlesTable',
    'table' => 'my_articles',
    'connection' => $connectionObject,
    'schema' => $schemaObject,
    'entityClass' => 'Custom\EntityClass',
    'eventManager' => $eventManager,
    'behaviors' => $behaviorRegistry
]);
```

接続とスキーマ設定に注意して下さい。それらは文字列変数ではなくオブジェクトです。
この接続は `Cake\Database\Connection` のオブジェクトと
スキーマの `Cake\Database\Schema\Collection` を扱います。

> [!NOTE]
> テーブルは `initialize()` メソッドで追加の設定を行う場合、それらの値は
> レジストリーの設定を上書きします。

また、事前にレジストリーを `setConfig()` メソッドを使って設定できます。
設定データは *エイリアスごと* に保存され、オブジェクトの
`initialize()` メソッドで上書きできます。 :

``` php
FactoryLocator::get('Table')->setConfig('Users', ['table' => 'my_users']);
```

> [!NOTE]
> そのエイリアスにアクセスする前か、\*\*最初\*\* のアクセス時だけテーブルの設定が可能です。
> レジストリーが投入された後に設定しても効果がありません。

### レジストリーの初期化

`method` Cake\\ORM\\TableLocator::**clear**()

テストケースで、レジストリーをフラッシュしたいこともあるでしょう。
モックオブジェクトを使う時やテーブルの依存関係を設定する時に便利です。 :

``` php
FactoryLocator::get('Table')->clear();
```

### ORM クラスを配置する名前空間の設定

もし、規約に従わない場合、おそらくテーブルやエンティティークラスは CakePHP によって検知されません。
これを修正するために、 `Cake\Core\Configure::write` メソッドで名前空間をセットできます。
例えば、 :

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

は、次のように設定されます。 :

``` php
Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');
```
