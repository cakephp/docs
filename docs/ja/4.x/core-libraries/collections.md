# コレクション

`class` Cake\\Collection\\**Collection**

コレクションクラスは、配列または `Traversable` オブジェクトを操作するためのツールのセットを
提供します。もし今までに underscore.js を使用したことがあるなら、コレクションクラスに何を
期待できるかの考え方を理解しているはずです。

コレクションのインスタンスはイミュータブルです。コレクションを変更すると、
代わりに新しいコレクションを生成します。これは、操作が副作用を含まないので、
コレクションオブジェクトの働きがより予測可能になります。

## 簡単な例

コレクションは、配列または `Traversable` オブジェクトを使用して作成することができます。
また、CakePHP での ORM と対話するたびに、コレクションと対話することになるでしょう。
コレクションの簡単な使い方は次のようになります。 :

``` php
use Cake\Collection\Collection;

$items = ['a' => 1, 'b' => 2, 'c' => 3];
$collection = new Collection($items);

// １より大きい要素を含む
// 新しいコレクションを作成
$overOne = $collection->filter(function ($value, $key, $iterator) {
    return $value > 1;
});
```

また、 `new Collection()` の代わりに `collection()` ヘルパー関数を使用することができます。 :

``` php
$items = ['a' => 1, 'b' => 2, 'c' => 3];

   // 両方ともコレクションのインスタンスを作成します。
$collectionA = new Collection($items);
$collectionB = collection($items);
```

ヘルパーメソッドの利点は、 `(new Collection($items))` よりも連鎖が容易であるということです。

`Cake\Collection\CollectionTrait` は、あなたのアプリケーションにある任意の
`Traversable` オブジェクトにコレクションのような機能を統合することができます。

## メソッド一覧

|              |              |                 |     |
|--------------|--------------|-----------------|-----|
| `append`     | `appendItem` | `avg`           |     |
| `buffered`   | `chunk`      | `chunkWithKeys` |     |
| `combine`    | `compile`    | `contains`      |     |
| `countBy`    | `each`       | `every`         |     |
| `extract`    | `filter`     | `first`         |     |
| `firstMatch` | `groupBy`    | `indexBy`       |     |
| `insert`     | `isEmpty`    | `last`          |     |
| `listNested` | `map`        | `match`         |     |
| `max`        | `median`     | `min`           |     |
| `nest`       | `prepend`    | `prependItem`   |     |
| `reduce`     | `reject`     | `sample`        |     |
| `shuffle`    | `skip`       | `some`          |     |
| `sortBy`     | `stopWhen`   | `sumOf`         |     |
| `take`       | `through`    | `transpose`     |     |
| `unfold`     | `zip`        |                 |     |

## 反復

`method` Cake\\Collection\\Collection::**each**($callback)

コレクションは、 `each()` と `map()` メソッドで反復したり新しいコレクションに
変換することができます。 `each()` メソッドは新しいコレクションを作成しませんが、
コレクション内の任意のオブジェクトを変更できます。 :

``` php
$collection = new Collection($items);
$collection = $collection->each(function ($value, $key) {
    echo "要素 $key: $value";
});
```

`each()` の戻り値はコレクションオブジェクトです。即時にコレクション内の各値にコールバックを
適用する反復処理します。

`method` Cake\\Collection\\Collection::**map**($callback)

`map()` メソッドは、元のコレクション内の各オブジェクトに適用されるコールバックの出力に基づいて
新しいコレクションを作成します。 :

``` php
$items = ['a' => 1, 'b' => 2, 'c' => 3];
$collection = new Collection($items);

$new = $collection->map(function ($value, $key) {
    return $value * 2;
});

// $result には [2, 4, 6] が含まれています。
$result = $new->toList();

// $result には ['a' => 2, 'b' => 4, 'c' => 6] が含まれています。
$result = $new->toArray();
```

`map()` メソッドは、新しいイテレータを作成し、反復する時に得られた項目を遅延して作成します。

`method` Cake\\Collection\\Collection::**extract**($path)

`map()` 関数の最も一般的な用途の1つはコレクションから単一の列を抽出することです。
特定のプロパティーの値を含む要素のリストを構築したい場合は、 `extract()` メソッドを
使用することができます。 :

``` php
$collection = new Collection($people);
$names = $collection->extract('name');

// $result には ['mark', 'jose', 'barbara'] が含まれています。
$result = $names->toList();
```

コレクションクラス内の他の多くの関数と同様に、列を抽出するために、ドット区切りのパスを
指定することができます。この例では、記事のリストから著者名を含むコレクションを返します。 :

``` php
$collection = new Collection($articles);
$names = $collection->extract('author.name');

// $result には ['Maria', 'Stacy', 'Larry'] が含まれています。
$result = $names->toList();
```

最後に、あなたが取得したいプロパティーがパスで表現できない場合は、
それを返すようにコールバック関数を使用することができます。 :

``` php
$collection = new Collection($articles);
$names = $collection->extract(function ($article) {
    return $article->author->name . ', ' . $article->author->last_name;
});
```

しばしば、他の構造の内部に深くネストされている複数の配列やオブジェクトに存在する共通のキーで
プロパティーを抽出する必要があります。これらの例については、パスのキーに `{*}` マッチャを
使用することができます。このマッチャは、 HasMany や BelongsToMany の関連データを照合する時に
便利です。 :

``` php
$data = [
    [
        'name' => 'James',
        'phone_numbers' => [
            ['number' => 'number-1'],
            ['number' => 'number-2'],
            ['number' => 'number-3'],
        ]
    ],
    [
        'name' => 'James',
        'phone_numbers' => [
            ['number' => 'number-4'],
            ['number' => 'number-5'],
        ]
    ]
];

$numbers = (new Collection($data))->extract('phone_numbers.{*}.number');
$numbers->toList();
// 戻り値は ['number-1', 'number-2', 'number-3', 'number-4', 'number-5']
```

この最後の例では、 他の例とは異なり `toList()` メソッドを使用していますが、
おそらく重複したキーで結果を取得する場合に重要になります。 `toList()` メソッドを
使用することにより、重複するキーが存在する場合でも、すべての値を取得することが保証されます。

`Cake\Utility\Hash::extract()` とは異なり、このメソッドは
`{*}` ワイルドカードのみをサポートしています。
他のすべてのワイルドカードと属性のマッチャはサポートされていません。

`method` Cake\\Collection\\Collection::**combine**($keyPath, $valuePath, $groupPath = null)

既存のコレクションの中のキーと値から作られた新しいコレクションを作成することができます。
キーと値の両方のパスは、ドット記法のパスで指定することができます。 :

``` php
$items = [
    ['id' => 1, 'name' => 'foo', 'parent' => 'a'],
    ['id' => 2, 'name' => 'bar', 'parent' => 'b'],
    ['id' => 3, 'name' => 'baz', 'parent' => 'a'],
];
$combined = (new Collection($items))->combine('id', 'name');

// 配列に変換すると、結果は次のようになります。
[
    1 => 'foo',
    2 => 'bar',
    3 => 'baz',
];
```

また、オプションでパスに基づいた結果のグループ化に `groupPath` を使用することができます。 :

``` php
$combined = (new Collection($items))->combine('id', 'name', 'parent');

// 配列に変換すると、結果は次のようになります。
[
    'a' => [1 => 'foo', 3 => 'baz'],
    'b' => [2 => 'bar']
];
```

最後に、動的にキーと値とグループのパスを構築するために *クロージャー* を使用することができます。
例えば、エンティティーや(ORM によって `Cake/Time` インスタンスに変換された) 日付で作業する場合、
日付で結果をグループ化するのによいでしょう。 :

``` php
$combined = (new Collection($entities))->combine(
    'id',
    function ($entity) { return $entity; },
    function ($entity) { return $entity->date->toDateString(); }
);

// 配列に変換すると、結果は次のようになります。
[
    'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
]
```

`method` Cake\\Collection\\Collection::**stopWhen**(callable $c)

`stopWhen()` メソッドを使用して、任意の時点で反復を停止することができます。
コレクションの中でこのメソッドを呼び出すと、新しいコレクションを作成し、要素のいずれかで、
渡された callable が false を返した場合、結果の引き渡しを停止します。 :

``` php
$items = [10, 20, 50, 1, 2];
$collection = new Collection($items);

$new = $collection->stopWhen(function ($value, $key) {
    // 30 より大きい最初の値で停止します。
    return $value > 30;
});

// $result には [10, 20] が含まれています。
$result = $new->toList();
```

`method` Cake\\Collection\\Collection::**unfold**(callable $callback)

時々、コレクション内の要素に、複数の要素を持つ配列やイテレータが含まれています。
すべての要素に対して一回の反復で済むように内部構造を平坦化したい場合は、
`unfold()` メソッドが使用できます。これは、コレクション内のネストされた
すべての単一の要素をもたらす新しいコレクションを作成します。 :

``` php
$items = [[1, 2, 3], [4, 5]];
$collection = new Collection($items);
$new = $collection->unfold();

// $result には [1, 2, 3, 4, 5] が含まれています。
$result = $new->toList();
```

`unfold()` に callable を渡すとき、 要素が元のコレクション内の各項目から
展開されるかを制御することができます。これは、ページ制御するサービスからのデータを
得るのに便利です。 :

``` php
$pages = [1, 2, 3, 4];
$collection = new Collection($pages);
$items = $collection->unfold(function ($page, $key) {
    // 結果のページを返す架空のウェブサービス
    return MyService::fetchPage($page)->toList();
});

$allPagesItems = $items->toList();
```

PHP 5.5 以降を使用している場合は、 コレクション内の各アイテムを必要なだけ
複数の要素として返すために `unfold()` の中で `yield` キーワードを使用することができます。 :

``` php
$oddNumbers = [1, 3, 5, 7];
$collection = new Collection($oddNumbers);
$new = $collection->unfold(function ($oddNumber) {
    yield $oddNumber;
    yield $oddNumber + 1;
});

// $result には [1, 2, 3, 4, 5, 6, 7, 8] が含まれています。
$result = $new->toList();
```

`method` Cake\\Collection\\Collection::**chunk**($chunkSize)

コレクション内の大量のアイテムを扱う場合には、一つ一つの要素を処理する代わりにバッチ処理が適しています。
コレクションをある程度の大きさの複数の配列に分割するために、 `chunk()` 関数を使用することができます。 :

``` php
$items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
$collection = new Collection($items);
$chunked = $collection->chunk(2);
$chunked->toList(); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]]
```

`chunk` 関数は、例えばデータベースの結果のために、バッチ処理を行う場合、 特に便利です。 :

``` php
$collection = new Collection($articles);
$collection->map(function ($article) {
        // article のプロパティーを変更します。
        $article->property = 'changed';
    })
    ->chunk(20)
    ->each(function ($batch) {
        myBulkSave($batch); // この関数は、バッチごとに呼び出されます。
    });
```

`method` Cake\\Collection\\Collection::**chunkWithKeys**($chunkSize)

`chunk()` 同様、 `chunkWithKeys()` は、コレクションを小さい塊に薄切りにしますが、
キーは保持されます。これは、連想配列を分割するのに便利です。 :

``` php
$collection = new Collection([
    'a' => 1,
    'b' => 2,
    'c' => 3,
    'd' => [4, 5]
]);
$chunked = $collection->chunkWithKeys(2)->toList();
// 作成物
[
    ['a' => 1, 'b' => 2],
    ['c' => 3, 'd' => [4, 5]]
]
```

## フィルタリング

`method` Cake\\Collection\\Collection::**filter**($callback)

コレクションは、コールバック関数の結果に基づいてフィルタリングし、新しいコレクションを作成が容易になります。
基準のコールバックに一致する要素の新しいコレクションを作成するには、 `filter()` を使用することができます。 :

``` php
$collection = new Collection($people);
$ladies = $collection->filter(function ($person, $key) {
    return $person->gender === 'female';
});
$guys = $collection->filter(function ($person, $key) {
    return $person->gender === 'male';
});
```

`method` Cake\\Collection\\Collection::**reject**(callable $c)

`filter()` の逆の関数は `reject()` です。このメソッドは、打ち消しのフィルタリングを行い、
フィルター関数に一致する要素を削除します。 :

``` php
$collection = new Collection($people);
$ladies = $collection->reject(function ($person, $key) {
    return $person->gender === 'male';
});
```

`method` Cake\\Collection\\Collection::**every**($callback)

フィルター関数で真偽のテストを行うことができます。コレクション内のすべての要素が条件を
満たしているかどうかを確認するには、 `every()` が使用できます。 :

``` php
$collection = new Collection($people);
$allYoungPeople = $collection->every(function ($person) {
    return $person->age < 21;
});
```

`method` Cake\\Collection\\Collection::**some**($callback)

フィルター関数に合致する要素が、コレクションに少なくとも１つ含まれているかどうかを
`some()` メソッドを使用して確認することができます。 :

``` php
$collection = new Collection($people);
$hasYoungPeople = $collection->some(function ($person) {
    return $person->age < 21;
});
```

`method` Cake\\Collection\\Collection::**match**($conditions)

指定したプロパティーを持つ要素のみを含んだ新しいコレクションを抽出する場合、
`match()` メソッドを使用しましょう。 :

``` php
$collection = new Collection($comments);
$commentsFromMark = $collection->match(['user.name' => 'Mark']);
```

`method` Cake\\Collection\\Collection::**firstMatch**($conditions)

プロパティー名は、ドット区切りのパスになります。ネストされたエンティティーを横断し、
それらに含まれる値を一致させることができます。コレクションから、最初に一致した要素が必要な場合、
`firstMatch()` を使用することができます。 :

``` php
$collection = new Collection($comments);
$comment = $collection->firstMatch([
    'user.name' => 'Mark',
    'active' => true
]);
```

上記の通り、 `match()` と `firstMatch()` の両方は、一致させたい複数の条件を指定できます。
また、条件は、異なるパスで、一致する複雑な条件を表現することができます。

## 集約

`method` Cake\\Collection\\Collection::**reduce**($callback, $initial)

`map()` の反対の操作は、一般的には `reduce` です。
この関数を使用すると、コレクション内のすべての要素から１つの結果を得ることができます。 :

``` php
$totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
    return $accumulated + $orderLine->price;
}, 0);
```

上記の例では、 `$totalPrice` は、コレクションに含まれるすべての価格の合計になります。
`reduce()` 関数の第二引数に、reduce 操作を開始するための初期値を渡していることに注意してください。 :

``` php
$allTags = $collection->reduce(function ($accumulated, $article) {
    return array_merge($accumulated, $article->tags);
}, []);
```

`method` Cake\\Collection\\Collection::**min**(string|callable $callback, $type = SORT_NUMERIC)

プロパティーに基づいて、コレクションの最小値を抽出するには、 `min()` 関数を使用します。
これは、コレクションから、見つかったプロパティーの最小値だけでなく完全な要素を返します。 :

``` php
$collection = new Collection($people);
$youngest = $collection->min('age');

echo $youngest->name;
```

また、パスまたはコールバック関数を指定することで、比較するプロパティーを表現することができます。 :

``` php
$collection = new Collection($people);
$personYoungestChild = $collection->min(function ($person) {
    return $person->child->age;
});

$personWithYoungestDad = $collection->min('dad.age');
```

`method` Cake\\Collection\\Collection::**max**(string|callable $callback, $type = SORT_NUMERIC)

同様に、 `max()` 関数を使用すると、コレクションから最も高いプロパティー値を持つ要素を返します。 :

``` php
$collection = new Collection($people);
$oldest = $collection->max('age');

$personOldestChild = $collection->max(function ($person) {
    return $person->child->age;
});

$personWithOldestDad = $collection->max('dad.age');
```

`method` Cake\\Collection\\Collection::**sumOf**($path = null)

最後に、 `sumOf()` メソッドは、すべての要素のプロパティーの合計を返します。 :

``` php
$collection = new Collection($people);
$sumOfAges =  $collection->sumOf('age');

$sumOfChildrenAges = $collection->sumOf(function ($person) {
    return $person->child->age;
});

$sumOfDadAges = $collection->sumOf('dad.age');
```

`method` Cake\\Collection\\Collection::**avg**($path = null)

コレクション内の要素の平均値を計算します。必要に応じて、平均値を生成するためのマッチャーパスや
値を抽出する関数を指定してください。 :

``` php
$items = [
   ['invoice' => ['total' => 100]],
   ['invoice' => ['total' => 200]],
];

// 平均値: 150
$average = (new Collection($items))->avg('invoice.total');
```

`method` Cake\\Collection\\Collection::**median**($path = null)

要素の集合の中央値を計算します。必要に応じて、中央値を生成するためのマッチャーパスや
値を抽出する関数を指定してください。 :

``` php
$items = [
  ['invoice' => ['total' => 400]],
  ['invoice' => ['total' => 500]],
  ['invoice' => ['total' => 100]],
  ['invoice' => ['total' => 333]],
  ['invoice' => ['total' => 200]],
];

// 中央値: 333
$median = (new Collection($items))->median('invoice.total');
```

### グループ化とカウント

`method` Cake\\Collection\\Collection::**groupBy**($callback)

コレクションの要素がプロパティーに同じ値を持つ場合、キー別にグループ化した
新しいコレクションを作ることができます。 :

``` php
$students = [
    ['name' => 'Mark', 'grade' => 9],
    ['name' => 'Andrew', 'grade' => 10],
    ['name' => 'Stacy', 'grade' => 10],
    ['name' => 'Barbara', 'grade' => 9]
];
$collection = new Collection($students);
$studentsByGrade = $collection->groupBy('grade');

// 配列に変換すると、結果は次のようになります。
[
  10 => [
    ['name' => 'Andrew', 'grade' => 10],
    ['name' => 'Stacy', 'grade' => 10]
  ],
  9 => [
    ['name' => 'Mark', 'grade' => 9],
    ['name' => 'Barbara', 'grade' => 9]
  ]
]
```

例のごとく、動的にグループを生成するために、ネストされたプロパティーのドットで区切られたパス
または独自のコールバック関数のいずれかを指定することができます。 :

``` php
$commentsByUserId = $comments->groupBy('user.id');

$classResults = $students->groupBy(function ($student) {
    return $student->grade > 6 ? 'approved' : 'denied';
});
```

`method` Cake\\Collection\\Collection::**countBy**($callback)

グループごとの出現数を知りたい場合は、 `countBy()` メソッドを使用して行うことができます。
それは既にあなたもご存知の `groupBy` と同じ引数を受け取ります。 :

``` php
$classResults = $students->countBy(function ($student) {
    return $student->grade > 6 ? 'approved' : 'denied';
});

// 配列に変換すると、結果は次のようになります。
['approved' => 70, 'denied' => 20]
```

`method` Cake\\Collection\\Collection::**indexBy**($callback)

グループ化したいプロパティーに対して要素が一意であることがわかっている一定のケースがあります。
グループごとに単一の結果が欲しいなら、 `indexBy()` 関数を使用することができます。 :

``` php
$usersById = $users->indexBy('id');

// 配列に変換すると、結果は次のようになります。
[
    1 => 'markstory',
    3 => 'jose_zap',
    4 => 'jrbasso'
]
```

`groupBy()` 関数と同じように、プロパティーパスまたはコールバックを使用することができます。 :

``` php
$articlesByAuthorId = $articles->indexBy('author.id');

$filesByHash = $files->indexBy(function ($file) {
    return md5($file);
});
```

`method` Cake\\Collection\\Collection::**zip**($items)

`zip()` メソッドを使用して、異なるコレクションの要素をグループ化することができます。
このメソッドは、各コレクションから同じ位置に配置されている要素をグループ化する配列の
新しいコレクションを返します。 :

``` php
$odds = new Collection([1, 3, 5]);
$pairs = new Collection([2, 4, 6]);
$combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]
```

また、一度に複数のコレクションを zip することができます。 :

``` php
$years = new Collection([2013, 2014, 2015, 2016]);
$salaries = [1000, 1500, 2000, 2300];
$increments = [0, 500, 500, 300];

$rows = $years->zip($salaries, $increments)->toList();
// 戻り値：
[
    [2013, 1000, 0],
    [2014, 1500, 500],
    [2015, 2000, 500],
    [2016, 2300, 300]
]
```

既にお見せした通り、 `zip()` メソッドは、多次元配列を転置するのに非常に便利です。 :

``` php
$data = [
    2014 => ['jan' => 100, 'feb' => 200],
    2015 => ['jan' => 300, 'feb' => 500],
    2016 => ['jan' => 400, 'feb' => 600],
]

// jan と feb のデータを取得

$firstYear = new Collection(array_shift($data));
$firstYear->zip($data[0], $data[1])->toList();

// また PHP >= 5.6 で $firstYear->zip(...$data)

// 戻り値
[
    [100, 300, 400],
    [200, 500, 600]
]
```

## ソート

`method` Cake\\Collection\\Collection::**sortBy**($callback, $order = SORT_DESC, $sort = SORT_NUMERIC)

コレクションの値は、カラムまたはカスタム関数に基づいて昇順または降順でソートすることができます。
コレクションの値から新たにソートされたコレクションを作成するには、 `sortBy` を使用することができます。 :

``` php
$collection = new Collection($people);
$sorted = $collection->sortBy('age');
```

上で見たように、コレクションの値に存在するカラム名またはプロパティー名を渡すことで並べ替えることができます。
また、代わりにドット表記を使用して、プロパティーのパスを指定することができます。
次の例では、その著者の名前で記事をソートします。 :

``` php
$collection = new Collection($articles);
$sorted = $collection->sortBy('author.name');
```

`sortBy()` メソッドは、コレクション内の２つの異なる値を比較する値を動的に選択する抽出関数を
指定するのに十分な柔軟性があります。 :

``` php
$collection = new Collection($articles);
$sorted = $collection->sortBy(function ($article) {
    return $article->author->name . '-' . $article->title;
});
```

コレクションのソート順を指定するには、昇順や降順にソートするために、２番目のパラメーターに
`SORT_ASC` や `SORT_DESC` のどちらかを指定する必要があります。
デフォルトでは、コレクションは降順にソートされます。 :

``` php
$collection = new Collection($people);
$sorted = $collection->sortBy('age', SORT_ASC);
```

時には、一貫性のある結果を得るように、比較しようとしているデータのタイプを指定する必要があります。
この目的のためには、 `sortBy()` 関数の第３引数に次のいずれかの定数を指定する必要があります。

- **SORT_NUMERIC**: 数字を比較
- **SORT_STRING**: 文字列値を比較
- **SORT_NATURAL**: 数字を含む文字列をソート。これらの数字は、自然な方法の並び順になります。
  例: "2" の後に "10" を表示。
- **SORT_LOCALE_STRING**: 現在のロケールに基づいて文字列を比較。

デフォルトでは、 `SORT_NUMERIC` が使用されます。 :

``` php
$collection = new Collection($articles);
$sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);
```

<div class="warning">

<div class="title">

Warning

</div>

  複数回ソートされたコレクションで反復処理することは高コストです。そのような計画をしている場合、  
コレクションを配列への変換を検討したり、 単純に `compile()` メソッドを使用してください。

</div>

## ツリーデータの操作

`method` Cake\\Collection\\Collection::**nest**($idPath, $parentPath)

全てのデータが、線形に表現できるわけではありません。
コレクションは、簡単に階層またはネストされた構造を、構築したり平坦化することができます。
親の識別子プロパティーによって子がグループ化されるような、ネストされた構造を作成するには、
`nest()` メソッドが簡単です。

この関数には、２つのパラメーターが必要です。
１つ目は、項目の識別子を表すプロパティーです。
２つ目のパラメーターは、親項目の識別子を表すプロパティーの名前です。 :

``` php
$collection = new Collection([
    ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
    ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
    ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
    ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
    ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
    ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
]);

$collection->nest('id', 'parent_id')->toList();
// 戻り値
[
    [
        'id' => 1,
        'parent_id' => null,
        'name' => 'Birds',
        'children' => [
            ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds', 'children' => []],
            ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle', 'children' => []],
            ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull', 'children' => []],
        ]
    ],
    [
        'id' => 6,
        'parent_id' => null,
        'name' => 'Fish',
        'children' => [
            ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish', 'children' => []],
        ]
    ]
];
```

子要素は、コレクション内の各項目の `children` プロパティーの中にネストされています。
このデータ表現のタイプは、メニューを描画したり、ツリー内の特定のレベルまでの要素を走査するのに便利です。

`method` Cake\\Collection\\Collection::**listNested**($order = 'desc', $nestingKey = 'children')

`nest()` の逆の関数は `listNested()` です。このメソッドは、ツリー構造を線形構造に
戻すように平坦にすることができます。このメソッドは、2つのパラメーターを持ちます。
1つ目は、走査モード（昇順、降順または、そのまま）であり、
2つ目は、コレクション内の各要素の子を含むプロパティー名です。

前の例で構築したネストされたコレクションを入力として利用し、それを平らにすることができます。 :

``` php
$nested->listNested()->toList();

// 戻り値
[
    ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
    ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
    ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
    ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
    ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
    ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
]
```

デフォルトでは、ツリーはルートから末端へと走査されます。
また、ツリーの中の末端の要素のみを返すように指示することができます。 :

``` php
$nested->listNested('leaves')->toList();

// 戻り値
[
    ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
    ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
    ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
]
```

ツリーをネストされたリストに変換すると、リスト出力の書式設定方法を設定するには、
`printer()` メソッドを使用することができます。 :

``` php
$nested->listNested()->printer('name', 'id', '--')->toArray();

// 戻り値
[
    3 => 'Eagle',
    4 => 'Seagull',
    5 -> '--Clown Fish',
]
```

`printer()` メソッドはまた、キーとまたは値を生成するためにコールバックを使用することができます。 :

``` php
$nested->listNested()->printer(
    function ($el) {
        return $el->name;
    },
    function ($el) {
        return $el->id;
    }
);
```

## その他のメソッド

`method` Cake\\Collection\\Collection::**isEmpty**()

コレクションに要素が含まれているかどうかを確認することができます。 :

``` php
$collection = new Collection([]);
// 戻り値は true
$collection->isEmpty();

$collection = new Collection([1]);
// 戻り値は false
$collection->isEmpty();
```

`method` Cake\\Collection\\Collection::**contains**($value)

コレクションは、 `contains()` メソッドを使用して、ある特定の値が含まれているかどうかを、
すぐに確認することができます。 :

``` php
$items = ['a' => 1, 'b' => 2, 'c' => 3];
$collection = new Collection($items);
$hasThree = $collection->contains(3);
```

比較は `===` 演算子を使用して実行されます。
緩い比較タイプを行いたい場合は、 `some()` メソッドを使用することができます。

`method` Cake\\Collection\\Collection::**shuffle**()

時には、コレクションでランダムな順序の値を表示したいこともあるでしょう。
ランダムな位置にそれぞれの値を返す新しいコレクションを作成するためには、
`shuffle` を使用してください。 :

``` php
$collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

// これは [2, 3, 1] を返します。
$collection->shuffle()->toList();
```

`method` Cake\\Collection\\Collection::**transpose**()

コレクションを transpose (行列の転置) すると、元の列のそれぞれで作られた行を含む
新しいコレクションを取得します。 :

``` php
$items = [
   ['Products', '2012', '2013', '2014'],
   ['Product A', '200', '100', '50'],
   ['Product B', '300', '200', '100'],
   ['Product C', '400', '300', '200'],
]
$transpose = (new Collection($items))->transpose()->toList();

// 戻り値
[
    ['Products', 'Product A', 'Product B', 'Product C'],
    ['2012', '200', '300', '400'],
    ['2013', '100', '200', '300'],
    ['2014', '50', '100', '200'],
]
```

### 要素の取り出し

`method` Cake\\Collection\\Collection::**sample**($length = 10)

手早く統計分析を行うときにコレクションをシャッフルすることが有用であることが多いです。
この種のタスクを行う一般的な操作は、より多くのテストが実行できるよう、コレクションから、
いくつかのランダムな値を取り出します。例えば、いくつかの A/B テストを適用したい５ユーザーを
ランダムに選びたい場合、 `sample()` 関数を使用することができます。 :

``` php
$collection = new Collection($people);

// このコレクションからランダムに最大 20 ユーザーを取り出します。
$testSubjects = $collection->sample(20);
```

`sample()` は、最大で最初の引数で指定した値の数だけ取り出します。
sample を満たすためのコレクション内に十分な要素がない場合、
ランダムな順序で全てのコレクションが返されます。

`method` Cake\\Collection\\Collection::**take**($length, $offset)

コレクションのスライスを取り出したいときは、 `take()` 関数を使用してください。
その関数は二番目の引数で渡されたポジションから開始して、最初の引数で指定した値の数だけの
新しいコレクションを作成します。 :

``` php
$topFive = $collection->sortBy('age')->take(5);

// ポジション 4 から始まるコレクションから５人取り出します。
$nextTopFive = $collection->sortBy('age')->take(5, 4);
```

ポジションはゼロが基準なので、最初のポジション番号は `0` です。

`method` Cake\\Collection\\Collection::**skip**($length)

`take()` の第二引数は、コレクションから取得する前にいくつかの要素をスキップすることができますが、
特定のポジションの後にある残りの要素を取る方法として、同じ目的のために `skip()` を使用できます。 :

``` php
$collection = new Collection([1, 2, 3, 4]);
$allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]
```

`method` Cake\\Collection\\Collection::**first**()

`take()` の最も一般的な用途の1つは、コレクションの最初の要素を取得することです。
同じ目標を達成するためのショートカットメソッドとして `first()` メソッドを使用しています。 :

``` php
$collection = new Collection([5, 4, 3, 2]);
$collection->first(); // 戻り値は 5
```

`method` Cake\\Collection\\Collection::**last**()

同様に、`last()` メソッドを使用して、コレクションの最後の要素を取得することができます。 :

``` php
$collection = new Collection([5, 4, 3, 2]);
$collection->last(); // 戻り値は 2
```

### コレクションの拡張

`method` Cake\\Collection\\Collection::**append**(array|Traversable $items)

複数のコレクションから１つのコレクションを作成することができます。
これは、さまざまなソースからデータを収集し、それを連結し、
非常にスムーズに他のコレクション関数を適用することができます。
`append()` メソッドは両方のソースの値を含む新しいコレクションを返します。 :

``` php
$cakephpTweets = new Collection($tweets);
$myTimeline = $cakephpTweets->append($phpTweets);

// 両方のソースから cakefest を含むつぶやき
$myTimeline->filter(function ($tweet) {
    return strpos($tweet, 'cakefest');
});
```

`method` Cake\\Collection\\Collection::**appendItem**($value, $key)

オプションのキーを持つアイテムをコレクションに追加できます。
コレクション内の既存のキーを指定した場合、値は上書きされません。 :

``` php
$cakephpTweets = new Collection($tweets);
$myTimeline = $cakephpTweets->appendItem($newTweet, 99);
```

`method` Cake\\Collection\\Collection::**prepend**($items)

`prepend()` メソッドは両方のソースの値を含む新しいコレクションを返します。 :

``` php
$cakephpTweets = new Collection($tweets);
$myTimeline = $cakephpTweets->prepend($phpTweets);
```

`method` Cake\\Collection\\Collection::**prependItem**($value, $key)

オプションのキーを持つアイテムをコレクションに追加できます。
コレクション内の既存のキーを指定した場合、値は上書きされません。 :

``` php
$cakephpTweets = new Collection($tweets);
$myTimeline = $cakephpTweets->prependItem($newTweet, 99);
```

> [!WARNING]
> 異なるソースから追加するときは、両方のコレクションのいくつかのキーが同じこともありえます。
> 例えば、2つの単純な配列を付加します。これは、 `toArray()` を使用してコレクションを
> 配列に変換するときに問題を示すことができます。あるコレクションの値で、キーを基にして
> 以前のコレクションの値を上書きしたくないなら、キーを削除して、すべての値を保持するために
> `toList()` を呼び出すことを確認してください。

### 要素の更新

`method` Cake\\Collection\\Collection::**insert**($path, $items)

時には、２つの別々のデータの集合があり、一方の集合の要素を、
他方のそれぞれの要素に挿入したいこともあるでしょう。もともとデータのマージや結合を
サポートしないデータソースからデータを取得する際に非常に一般的なケースです。

あるコレクションの各要素を別のコレクションの各要素のプロパティーに挿入することができる
`insert()` メソッドを提供します。 :

``` php
$users = [
    ['username' => 'mark'],
    ['username' => 'juan'],
    ['username' => 'jose']
];

$languages = [
    ['PHP', 'Python', 'Ruby'],
    ['Bash', 'PHP', 'Javascript'],
    ['Javascript', 'Prolog']
];

$merged = (new Collection($users))->insert('skills', $languages);
```

配列に変換すると、 `$merged` コレクションは、次のようになります。 :

``` php
[
    ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
    ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
    ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
];
```

`insert()` メソッドの最初のパラメーターは、要素がその位置に挿入することができるように示した
プロパティーのドット区切りのパスです。第２引数は、コレクションオブジェクトに変換することができるものです。

要素が順番に挿入されていることを確認してください。第２のコレクションの最初の要素は、
第１のコレクションの最初の要素にマージされます。

第１のコレクションに挿入する第２のコレクションに十分な要素が存在しない場合、
対象のプロパティーは、 `null` 値が入力されます。 :

``` php
$languages = [
    ['PHP', 'Python', 'Ruby'],
    ['Bash', 'PHP', 'Javascript']
];

$merged = (new Collection($users))->insert('skills', $languages);

// 結果
[
    ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
    ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
    ['username' => 'jose', 'skills' => null]
];
```

`insert()` メソッドは、配列の要素や `ArrayAccess` インターフェイスを実装するオブジェクトを
操作することができます。

### コレクションメソッドの再利用

コレクションのメソッドにクロージャーを使用することは、
なすべき仕事が小さくて目的に合うと素晴らしいのですが、とてもすぐに厄介な事になります。
異なる多くのメソッドの呼び出しが必要だったり、クロージャーメソッドの長さが数行では収まらないときに、
より顕著になります。

コレクションのメソッドで使用されるロジックは、アプリケーションの複数の部分で再利用できる場合もあります。
複雑なコレクションのロジックを抽出してクラスに分離することを検討してください。
例えば、このような長いクロージャーを想像してください。 :

``` php
$collection
        ->map(function ($row, $key) {
            if (!empty($row['items'])) {
                $row['total'] = collection($row['items'])->sumOf('price');
            }

            if (!empty($row['total'])) {
                $row['tax_amount'] = $row['total'] * 0.25;
            }

            // コードが続きます・・・

            return $modifiedRow;
        });
```

これは、別のクラスを作成することでリファクタリングすることができます。 :

``` php
class TotalOrderCalculator
{
        public function __invoke($row, $key)
        {
            if (!empty($row['items'])) {
                $row['total'] = collection($row['items'])->sumOf('price');
            }

            if (!empty($row['total'])) {
                $row['tax_amount'] = $row['total'] * 0.25;
            }

            // コードが続きます・・・

            return $modifiedRow;
        }
}

// map() 呼び出しでロジックを使用
$collection->map(new TotalOrderCalculator)
```

`method` Cake\\Collection\\Collection::**through**($callback)

時々、コレクションメソッド呼び出しの連鎖は、特定の順序で呼び出された場合にのみ、
アプリケーションの他の部分で再利用可能になります。これらの例では、
便利なデータ処理の呼び出しを割り当てるために `__invoke` を実装したクラスと組み合わせて
`through()` を使用することができます。 :

``` php
$collection
        ->map(new ShippingCostCalculator)
        ->map(new TotalOrderCalculator)
        ->map(new GiftCardPriceReducer)
        ->buffered()
       ...
```

上記のメソッド呼び出しは、毎回繰り返す必要がないように、新しいクラスに抽出することができます。 :

``` php
class FinalCheckOutRowProcessor
{
        public function __invoke($collection)
        {
                return $collection
                        ->map(new ShippingCostCalculator)
                        ->map(new TotalOrderCalculator)
                        ->map(new GiftCardPriceReducer)
                        ->buffered()
                       ...
        }
}

// 一度に全てのメソッドを呼び出すために through() メソッドを使用できます。
$collection->through(new FinalCheckOutRowProcessor);
```

### コレクションの最適化

`method` Cake\\Collection\\Collection::**buffered**()

コレクションは、多くの場合、その関数の使用を遅延して作成する操作を実行します。
これは、関数を呼び出すことができていても、それはすぐに実行されないことを意味します。
これは、このクラス内の多くの関数についても同様です。
遅延評価は、コレクション内のすべての値を使用していない状況で資源を節約することができます。
反復が早期に停止した場合、または例外や失敗事例が早期に到達したときは、
すべての値を使用しない場合があります。

また、遅延評価は、いくつかの操作をスピードアップするのに役立ちます。
次の例を考えてみましょう。 :

``` php
$collection = new Collection($oneMillionItems);
$collection = $collection->map(function ($item) {
    return $item * 2;
});
$itemsToShow = $collection->take(30);
```

コレクションに遅延評価がなかったら、そのうち 30 の要素だけを見せたかったにもかかわらず、
100 万の操作を実行しているでしょう。
代わりに、 map の操作は、使用した 30 の要素にのみ適用しました。
小さいコレクションでも、複数の操作を行うとき、遅延評価から利益を得ることができます。
たとえば、 `map()` を２回と `filter()` の呼び出しなどです。

遅延評価にも欠点があります。早い段階でコレクションを最適化する場合は、
複数回同じ操作を行うことができました。この例を考えてみましょう。 :

``` php
$ages = $collection->extract('age');

$youngerThan30 = $ages->filter(function ($item) {
    return $item < 30;
});

$olderThan30 = $ages->filter(function ($item) {
    return $item > 30;
});
```

`youngerThan30` と `olderThan30` の両方を反復する場合、
コレクションは残念ながら二度 `extract()` 操作を実行します。
コレクションは不変であり、遅延抽出操作は両方のフィルターのために行われることになるためです。

幸いにも、一つの関数で、この問題を克服することができます。
特定操作の値を複数回再利用する場合は、 `buffered()` 関数を使用して
別のコレクションに結果をコンパイルすることができます。 :

``` php
$ages = $collection->extract('age')->buffered();
$youngerThan30 = ...
$olderThan30 = ...
```

両方のコレクションを反復処理しているときに、抽出操作を一度だけ呼び出します。

### 巻き戻し可能なコレクションの作成

`buffered()` メソッドは、巻き戻せないイテレータを複数回繰り返し可能なコレクションに
変換するのに便利です。 :

``` php
// PHP 5.5 以上で
public function results()
{
    ...
    foreach ($transientElements as $e) {
        yield $e;
    }
}
$rewindable = (new Collection(results()))->buffered();
```

### コレクションの複製

`method` Cake\\Collection\\Collection::**compile**($preserveKeys = true)

時には、別のコレクションから要素の複製を取得する必要があります。
同時に異なる場所から同じセットを反復処理する必要がある場合に便利です。
別のコレクションからコレクションを複製するために `compile()` メソッドを使用します。 :

``` php
$ages = $collection->extract('age')->compile();

foreach ($ages as $age) {
    foreach ($collection as $element) {
        echo h($element->name) . ' - ' . $age;
    }
}
```
