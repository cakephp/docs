# CounterCache

`class` Cake\\ORM\\Behavior\\**CounterCacheBehavior**

多くの場合、ウェブアプリケーションは関連するオブジェクトの数を表示する必要があります。
たとえば、記事のリストを表示するときに、記事のコメントの数を表示することができます。
または、ユーザーを表示するときに、彼女が持っている友人/フォロワーの数を表示することもできます。
CounterCache ビヘイビアーは、これらの状況を想定しています。
CounterCache は、呼び出されたときにオプションで割り当てられた関連モデルのフィールドを更新します。
フィールドはデータベースに存在し、INT 型でなければなりません。

## 基本的な使用方法

他のビヘイビアーと同様に CounterCache ビヘイビアーを有効にしますが、
いくつかのリレーションとそれらのそれぞれに格納されるフィールド数を設定するまでは何も行いません。
以下の例を使用して、各記事のコメント数を次のようにキャッシュすることができます。 :

``` php
class CommentsTable extends Table
{
    public function initialize(array $config): void
    {
        $this->addBehavior('CounterCache', [
            'Articles' => ['comment_count']
        ]);
    }
}
```

CounterCache の設定は、リレーション名のマップとそのリレーションに対する具体的な設定でなければなりません。

カウンターの値は、エンティティーが保存または削除されるたびに更新されます。
`updateAll()` または `deleteAll()` を使用するか、作成した SQL を実行すると、
カウンターは更新 **されません。**

## 高度な使用方法

キャッシュされたカウンターを関連するすべてのレコードより少なく保つ必要がある場合は、
カウンター値を生成するために追加の条件またはファインダーメソッドを指定できます。 :

``` php
// 特定の find メソッドを使用する。
// find(published) の場合
$this->addBehavior('CounterCache', [
    'Articles' => [
        'comment_count' => [
            'finder' => 'published'
        ]
    ]
]);
```

カスタムファインダーメソッドがない場合は、代わりにレコードを検索するための条件の配列を指定できます。 :

``` php
$this->addBehavior('CounterCache', [
    'Articles' => [
        'comment_count' => [
            'conditions' => ['Comments.spam' => false]
        ]
    ]
]);
```

CounterCache で複数のフィールドを更新する場合（条件付きカウントと基本カウントの両方を表示するなど）、
これらのフィールドを配列に追加できます。 :

``` php
$this->addBehavior('CounterCache', [
    'Articles' => ['comment_count',
        'published_comment_count' => [
            'finder' => 'published'
        ]
    ]
]);
```

独自の CounterCache フィールド値を計算する場合は、 `ignoreDirty` オプションを
`true` に設定します。
これにより、前に dirty を設定した場合、フィールドが再計算されなくなります。 :

``` php
$this->addBehavior('CounterCache', [
    'Articles' => [
        'comment_count' => [
            'ignoreDirty' => true
        ]
    ]
]);
```

最後に、カスタムファインダーと条件が適切でない場合は、コールバックメソッドを提供することができます。
この呼び出し可能オブジェクトは、格納するカウント値を返さなければなりません。 :

``` php
$this->addBehavior('CounterCache', [
    'Articles' => [
        'rating_avg' => function ($event, $entity, $table, $original) {
            return 4.5;
        }
    ]
]);
```

あなたの関数は、カウンター列の更新をスキップするために `false` を返したり、
カウント値を生成した `Query` オブジェクトを返すことができます。
`Query` オブジェクトを返すと、そのクエリーは update 文のサブクエリーとして使われます。
`$table` パラメーターは、便宜上、ビヘイビアーを保持している (ターゲット関係ではない)
テーブルオブジェクトを参照します。コールバックは、 `$original` に `false` が設定されて
少なくとも1回呼び出されます。
entity-update がアソシエーションを変更した場合、コールバックは `true` で *2回* 呼び出され、
戻り値は *以前* に関連付けられたアイテムのカウンターを更新します。

> [!NOTE]
> CounterCache ビヘイビアーは、 `belongsTo` アソシエーションに対してのみ機能します。
> たとえば、 "Comments belongsTo Articles" の場合、Article テーブルの `comment_count`
> を生成するために、 CommentsCache ビヘイビアーを `CommentsTable` に追加する必要があります。
>
> これを `belongsToMany` アソシエーションに対して機能させることは可能ですが、
> アソシエーションオプションで設定されたカスタム `through` テーブルで CounterCache
> ビヘイビアーを有効にして `cascadeCallbacks` 設定オプションを true にする必要があります。
> カスタム JOIN テーブルを設定する方法は [Using The Through Option](../../orm/associations#using-the-through-option) を参照してください。
