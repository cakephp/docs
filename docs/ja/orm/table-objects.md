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

    public function initialize(array $config)
    {
        $this->setTable('my_table');

        // 3.4 より前
        $this->table('my_table');
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
    public function initialize(array $config)
    {
        $this->setPrimaryKey('my_id');

        // 3.4 より前
        $this->primaryKey('my_id');
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
    public function initialize(array $config)
    {
        $this->setEntityClass('App\Model\Entity\PO');

        // 3.4 より前
        $this->entityClass('App\Model\Entity\PO');
    }
}
```

上記の例では、テーブルオブジェクトはコンストラクターの最後に呼ばれる `initialize()`
メソッドを持ちます。コンストラクターをオーバーライドする代わりに、
このメソッドで初期化することを推奨します。

### テーブルクラスのインスタンスを取得する

テーブルにクエリーを実行する前に、テーブルインスタンスを取得する必要があります。
`TableRegistry` クラスを使用することで取得できます。 :

``` php
// コントローラーやテーブルのメソッド内で
use Cake\ORM\TableRegistry;

// Prior to 3.6 use TableRegistry::get('Articles')
$articles = TableRegistry::getTableLocator()->get('Articles');
```

TableRegistry クラスはテーブルを作るための様々な依存関係を提供します。
そして、作成されたすべてのテーブルインスタンスの設定を維持し、リレーションの構築と
ORM の設定を簡単にしてくれます。詳細は [Table Registry Usage](#table-registry-usage) をご覧ください。

テーブルクラスがプラグインの中にある場合、あなたのテーブルクラスのために正しい名前を
必ず使用してください。それに失敗すると、デフォルトのクラスが正しいクラスの代わりに使われてしまい、
バリデーションルールやコールバックが呼ばれないなどの結果を生じます。プラグインのテーブルクラスを
正しくロードするために、次のように使用してください。 :

``` php
// プラグインの Table
// Prior to 3.6 use TableRegistry::get('PluginName.Articles')
$articlesTable = TableRegistry::getTableLocator()->get('PluginName.Articles');

// ベンダープレフィックス付きのプラグイン Table
// Prior to 3.6 use TableRegistry::get('VendorName/PluginName.Articles')
$articlesTable = TableRegistry::getTableLocator()->get('VendorName/PluginName.Articles');
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
イベントサブシステムの使い方の詳細は [イベントシステム](../core-libraries/events) をご覧ください。

### イベント一覧

- `Model.initialize`
- `Model.beforeMarshal`
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

`method` Cake\\ORM\\Table::**initialize**(Event $event, ArrayObject $data, ArrayObject $options)

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
```

そして、以下のように `EventManager` にリスナーを追加します。 :

``` php
use Cake\Event\EventManager;
$listener = new ModelInitializeListener();
EventManager::instance()->attach($listener);
```

これは、任意の `Table` クラスが構築されたとき、 `initializeEvent` を呼びます。

### beforeMarshal

`method` Cake\\ORM\\Table::**beforeMarshal**(Event $event, ArrayObject $data, ArrayObject $options)

`Model.beforeMarshal` イベントは、リクエストデータがエンティティーに変換される前に発行されます。
詳細は [Before Marshal](../orm/saving-data#before-marshal) をご覧ください。

### beforeFind

`method` Cake\\ORM\\Table::**beforeFind**(Event $event, Query $query, ArrayObject $options, $primary)

`Model.beforeFind` イベントは各 find 操作の前に発行されます。イベントを止めて戻り値を返すことで
find を完全にバイパスできます。 \$query インスタンスに対してなされた全ての変更は find 処理の間
維持されます。 `$primary` パラメーターは、これがルートクエリーなのか、それともアソシエーションの
クエリーなのかを示します。クエリーに含まれる全てのアソシエーションで `Model.beforeFind`
イベントが呼ばれます。 JOIN を使うアソシエーションに対しては、ダミーのクエリーが渡されます。
イベントリスナーでは、追加のフィールド、検索条件、 JOIN や結果のフォーマッターを設定出来ます。
これらのオプションや機能はルートクエリーにコピーされます。

ユーザーの役職に基づいて find の操作を制限したり、現在の負荷状況に基づいてキャッシュの判断をしたり
するために、このコールバックを利用できるかもしれません。

CakePHP の旧バージョンでは `afterFind` コールバックがありましたが、 [Map Reduce](../orm/retrieving-data-and-resultsets#map-reduce)
機能とエンティティーのコンストラクターに置き換えられました。

### buildValidator

`method` Cake\\ORM\\Table::**buildValidator**(Event $event, Validator $validator, $name)

`Model.buildValidator` イベントは `$name` バリデーターが作られた時に発行されます。
ビヘイビアーは、バリデーションメソッドに追加するために、このフックが使用できます。

### buildRules

`method` Cake\\ORM\\Table::**buildRules**(Event $event, RulesChecker $rules)

`Model.buildRules` イベントはルールインスタンスが作られた後と、
Table の `beforeRules()` メソッドが呼ばれた後に発行されます。

### beforeRules

`method` Cake\\ORM\\Table::**beforeRules**(Event $event, EntityInterface $entity, ArrayObject $options, $operation)

`Model.beforeRules` イベントはエンティティーにルールが適用される前に発行されます。
このイベントが止まると、チェックのためのルールを停止して、適用したルールの結果を
セットすることができます。

### afterRules

`method` Cake\\ORM\\Table::**afterRules**(Event $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

`Model.afterRules` イベントはルールがエンティティーに適用された後に発行されます。
このイベントが止まると、操作をチェックするためのルールの結果の値を返すことができます。

### beforeSave

`method` Cake\\ORM\\Table::**beforeSave**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.beforeSave` イベントはエンティティーが保存する前に発行されます。
このイベントを止めることによって、保存を停止できます。イベントが停止すると、
このイベントの結果が返されます。
イベントを停止する方法は、 [こちら](../core-libraries/events#stopping-events) に記載されています。

### afterSave

`method` Cake\\ORM\\Table::**afterSave**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.afterSave` イベントはエンティティーを保存した後に発行されます。

### afterSaveCommit

`method` Cake\\ORM\\Table::**afterSaveCommit**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.afterSaveCommit` イベントは、保存処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 `save()` が直接呼ばれた最初のテーブルだけに引き起こされます。
save が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

### beforeDelete

`method` Cake\\ORM\\Table::**beforeDelete**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.beforeDelete` イベントはエンティティーを削除する前に発行されます。
このイベントを停止することによって、削除を中止できます。イベントが停止すると、
このイベントの結果が返されます。
イベントを停止する方法は、 [こちら](../core-libraries/events#stopping-events) に記載されています。

### afterDelete

`method` Cake\\ORM\\Table::**afterDelete**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.afterDelete` イベントはエンティティーが削除された後に発行されます。

### afterDeleteCommit

`method` Cake\\ORM\\Table::**afterDeleteCommit**(Event $event, EntityInterface $entity, ArrayObject $options)

`Model.afterDeleteCommit` イベントは、削除処理がラップされたトランザクションが
コミットされた後に発行されます。データベース操作が暗黙的にコミットされる非アトミックな保存でも
引き起こされます。イベントは、 `delete()` が直接呼ばれた最初のテーブルだけに引き起こされます。
delete が呼ばれる前にトランザクションが始まっている場合、イベントは起こりません。

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
```

<!-- end-behaviors -->

CakePHP によって提供されるビヘイビアーを含む、ビヘイビアーに関する詳細は [ビヘイビアー](../orm/behaviors)
の章をご覧ください。

## 接続設定

デフォルトでは、全てのテーブルインスタンスは `default` データベース接続を使用します。
もし、複数のデータベース接続を使用している場合、どのコネクションを使用してテーブルを
設定したくなるでしょう。これは、 `defaultConnectionName()` メソッドで出来ます。 :

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public static function defaultConnectionName() {
        return 'slavedb';
    }
}
```

> [!NOTE]
> `defaultConnectionName()` メソッドはスタティックで **なければなりません** 。

## TableRegistry の利用

`class` Cake\\ORM\\**TableRegistry**

これまで見てきたように、TableRegistry クラスは　factory/registry を
アプリケーションのテーブルインスタンスにアクセスするために使うことを簡単にします。
これには他にも便利な機能があります。

### テーブルオブジェクトの設定

`static` Cake\\ORM\\TableRegistry::**get**($alias, $config)

テーブルをレジストリーからロードする時に、依存関係をカスタマイズするか、
`$options` 配列が用意するモックオブジェクトを使います。 :

``` php
$articles = TableRegistry::getTableLocator()->get('Articles', [
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

また、事前にレジストリーを `config()` メソッドを使って設定できます。
設定データは *エイリアスごと* に保存され、オブジェクトの
`initialize()` メソッドで上書きできます。 :

``` php
TableRegistry::config('Users', ['table' => 'my_users']);
```

> [!NOTE]
> そのエイリアスにアクセスする前か、\*\*最初\*\* のアクセス時だけテーブルの設定が可能です。
> レジストリーが投入された後に設定しても効果がありません。

> [!NOTE]
> <span class="title-ref">CakeORMTableRegistry</span> のスタティック API は 3.6.0 で非推奨になりました。
> 代わりにテーブルロケーターを直接使用してください。

### レジストリーの初期化（追加設定の消去）

`static` Cake\\ORM\\TableRegistry::**clear**()

テストケースで、レジストリーをフラッシュしたいこともあるでしょう。
モックオブジェクトを使う時やテーブルの依存関係を設定する時に便利です。 :

``` php
TableRegistry::clear();
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
