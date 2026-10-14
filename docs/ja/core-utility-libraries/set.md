# Set

`class` **Set**

このクラスは配列の管理をし、正しく使えば、よりスマートで、最適化されたコードを作るのにとても強力で便利なツールとなります。
CakePHPは、上記を可能にする非常に便利な静的ユーティリティ郡をSetクラスで提供します。

CakePHsのSetクラスはどのモデルやコントローラからも、Inflectorを呼ぶのと同じ方法で呼び出すことができます。
例: `Set::combine()`

::: info Deprecated in version 2.2
Set クラスは `Hash` クラスにその役割を譲り2.2で非推奨となりました。 Hashクラスはより一貫性を持つインターフェイスとAPIを提供します。
:::

## Set互換のパス記法

パス記法は（例えば）ソートに、またパスを定義するのに使われます。

使い方の例（ `Set::sort()` を使っています） :

``` php
$a = [
    0 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    1 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]],
    2 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
$result = Set::sort($a, '{n}.Person.name', 'asc');
/* 現在のresultは次のようになります
 [
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
];
*/
```

上記の例で見たように、{}で囲まれたものがあり、囲まれてないものもあります。
下記のテーブルでは、どのオプションが利用可能かを見ることができます。

| 表現 | 定義 |
|----|----|
| {n} | 数値添字の表現 |
| {s} | 文字列添字の表現 |
| Foo | 任意の文字列（括弧囲み無し） これは文字列リテラルなどとして扱われます。 |
| {\[a-z\]+} | 括弧で囲まれた任意の文字列({n}と{s}を除く) は正規表現と解釈されます。 |

> このセクションはメニュー化する必要がある(*need to be expanded*)

`static` Set::**apply**($path, $array, $callback, $options = [])

rtype  
mixed

Set::extract互換のパスで展開された配列の要素にコールバックを適用します :

``` php
$data = [
    ['Movie' => ['id' => 1, 'title' => 'movie 3', 'rating' => 5]],
    ['Movie' => ['id' => 1, 'title' => 'movie 1', 'rating' => 1]],
    ['Movie' => ['id' => 1, 'title' => 'movie 2', 'rating' => 3]],
];

$result = Set::apply('/Movie/rating', $data, 'array_sum');
// resultは 9 に等しい

$result = Set::apply('/Movie/title', $data, 'strtoupper', ['type' => 'map']);
// resultは ['MOVIE 3', 'MOVIE 1', 'MOVIE 2'] に等しい
// $options： - type : 'pass'はcall_user_func_array()、'map'はarray_map()、'reduce'はarray_reduce()、が利用できます。
```

`static` Set::**check**($data, $path = null)

rtype  
boolean/array

特定のパスが配列にセットされているかを調べます。
もし\$pathが空なら、真偽(*boolean*)値の代わりに\$dataを返します:

``` php
$set = [
    'My Index 1' => ['First' => 'The first item'],
];
$result = Set::check($set, 'My Index 1.First');
// $result == True
$result = Set::check($set, 'My Index 1');
// $result == True
$result = Set::check($set, []);
// $result == ['My Index 1' => ['First' => 'The first item']]
$set = [
    'My Index 1' => ['First' =>
        ['Second' =>
            ['Third' =>
                ['Fourth' => 'Heavy. Nesting.']]]],
];
$result = Set::check($set, 'My Index 1.First.Second');
// $result == True
$result = Set::check($set, 'My Index 1.First.Second.Third');
// $result == True
$result = Set::check($set, 'My Index 1.First.Second.Third.Fourth');
// $result == True
$result = Set::check($set, 'My Index 1.First.Seconds.Third.Fourth');
// $result == False
```

`static` Set::**classicExtract**($data, $path = null)

rtype  
array

配列やオブジェクトから、配列のパス記法で与えられたパスに含まれる値を返します。
配列のパス記法とは、すなわち次のことです。

- "{n}.Person.{\[a-z\]+}" - 「{n}」は整数のキーを表し、「Person」は文字列リテラルを表現します。
- 「{\[a-z\]+}」(すなわち {n} と {s} の他に、あらゆる文字列リテラルをブランケットで囲ったもの)は、正規表現として解釈されます。

**Example 1**
:

``` php
$a = [
    ['Article' => ['id' => 1, 'title' => 'Article 1']],
    ['Article' => ['id' => 2, 'title' => 'Article 2']],
    ['Article' => ['id' => 3, 'title' => 'Article 3']],
];
$result = Set::classicExtract($a, '{n}.Article.id');
/* $result は現段階で次のようになります。:
    [
        [0] => 1
        [1] => 2
        [2] => 3
    ]
*/
$result = Set::classicExtract($a, '{n}.Article.title');
/* $result は現段階で次のようになります。:
    [
        [0] => Article 1
        [1] => Article 2
        [2] => Article 3
    ]
*/
$result = Set::classicExtract($a, '1.Article.title');
// $result == "Article 2"

$result = Set::classicExtract($a, '3.Article.title');
// $result == null
```

**Example 2**
:

``` php
$a = [
    0 => ['pages' => ['name' => 'page']],
    1 => ['fruites' => ['name' => 'fruit']],
    'test' => [['name' => 'jippi']],
    'dot.test' => [['name' => 'jippi']],
];

$result = Set::classicExtract($a, '{n}.{s}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [0] => page
            ]
        [1] => [
                [0] => fruit
            ]
    ]
*/
$result = Set::classicExtract($a, '{s}.{n}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [0] => jippi
            ]
        [1] => [
                [0] => jippi
            ]
    ]
*/
$result = Set::classicExtract($a, '{\w+}.{\w+}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [pages] => page
            ]
        [1] => [
                [fruites] => fruit
            ]
        [test] => [
                [0] => jippi
            ]
        [dot.test] => [
                [0] => jippi
            ]
    ]
*/
$result = Set::classicExtract($a, '{\d+}.{\w+}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [pages] => page
            ]
        [1] => [
                [fruites] => fruit
            ]
    ]
*/
$result = Set::classicExtract($a, '{n}.{\w+}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [pages] => page
            ]
        [1] => [
                [fruites] => fruit
            ]
    ]
*/
$result = Set::classicExtract($a, '{s}.{\d+}.name');
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [0] => jippi
            ]
        [1] => [
                [0] => jippi
            ]
    ]
*/
$result = Set::classicExtract($a, '{s}');
/* $result は現段階で次のようになります。:
    [

        [0] => [
                [0] => [
                        [name] => jippi
                    ]
            ]
        [1] => [
                [0] => [
                        [name] => jippi
                    ]
            ]
    ]
*/
$result = Set::classicExtract($a, '{[a-z]}');
/* $result は現段階で次のようになります。:
    [
        [test] => [
                [0] => [
                        [name] => jippi
                    ]
            ]

        [dot.test] => [
                [0] => [
                        [name] => jippi
                    ]
            ]
    ]
*/
$result = Set::classicExtract($a, '{dot\.test}.{n}');
/* $result は現段階で次のようになります。:
    [
        [dot.test] => [
                [0] => [
                        [name] => jippi
                    ]
            ]
    ]
*/
```

`static` Set::**combine**($data, $path1 = null, $path2 = null, $groupPath = null)

rtype  
array

このメソッドは \$path1 で指定されたパスをキーに、そしてオプションで \$path2 で指定されたパスを値に、連想配列を作成します。
もし \$path2 で指定されたパスが定義されていなかったら、全ての値は null として初期化されます(Set::merge で便利です)。
これらのパスの後に、オプションで \$groupPath を設定すると、それが指定するパスの値でグループ化することができます。 :

``` php
$result = Set::combine([], '{n}.User.id', '{n}.User.Data');
// $result == [];

$result = Set::combine('', '{n}.User.id', '{n}.User.Data');
// $result == [];

$a = [
    [
        'User' => [
            'id' => 2,
            'group_id' => 1,
            'Data' => [
                'user' => 'mariano.iglesias',
                'name' => 'Mariano Iglesias',
            ],
        ],
    ],
    [
        'User' => [
            'id' => 14,
            'group_id' => 2,
            'Data' => [
                'user' => 'phpnut',
                'name' => 'Larry E. Masters',
            ],
        ],
    ],
    [
        'User' => [
            'id' => 25,
            'group_id' => 1,
            'Data' => [
                'user' => 'gwoo',
                'name' => 'The Gwoo',
            ],
        ],
    ],
];
$result = Set::combine($a, '{n}.User.id');
/* $result は現段階で次のようになります。:
    [
        [2] =>
        [14] =>
        [25] =>
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.non-existent');
/* $result は現段階で次のようになります。:
    [
        [2] =>
        [14] =>
        [25] =>
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
/* $result は現段階で次のようになります。:
    [
        [2] => [
                [user] => mariano.iglesias
                [name] => Mariano Iglesias
            ]
        [14] => [
                [user] => phpnut
                [name] => Larry E. Masters
            ]
        [25] => [
                [user] => gwoo
                [name] => The Gwoo
            ]
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name');
/* $result は現段階で次のようになります。:
    [
        [2] => Mariano Iglesias
        [14] => Larry E. Masters
        [25] => The Gwoo
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
/* $result は現段階で次のようになります。:
    [
        [1] => [
                [2] => [
                        [user] => mariano.iglesias
                        [name] => Mariano Iglesias
                    ]
                [25] => [
                        [user] => gwoo
                        [name] => The Gwoo
                    ]
            ]
        [2] => [
                [14] => [
                        [user] => phpnut
                        [name] => Larry E. Masters
                    ]
            ]
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
/* $result は現段階で次のようになります。:
    [
        [1] => [
                [2] => Mariano Iglesias
                [25] => The Gwoo
            ]
        [2] => [
                [14] => Larry E. Masters
            ]
    ]
*/

$result = Set::combine($a, '{n}.User.id', ['{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'], '{n}.User.group_id');
/* $result は現段階で次のようになります。:
    [
        [1] => [
                [2] => mariano.iglesias: Mariano Iglesias
                [25] => gwoo: The Gwoo
            ]
        [2] => [
                [14] => phpnut: Larry E. Masters
            ]
    ]
*/

$result = Set::combine($a, ['{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'], '{n}.User.id');
/* $result は現段階で次のようになります。:
    [
        [mariano.iglesias: Mariano Iglesias] => 2
        [phpnut: Larry E. Masters] => 14
        [gwoo: The Gwoo] => 25
    ]
*/

$result = Set::combine($a, ['{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'], '{n}.User.id');
/* $result は現段階で次のようになります。:
    [
        [Mariano Iglesias: mariano.iglesias] => 2
        [Larry E. Masters: phpnut] => 14
        [The Gwoo: gwoo] => 25
    ]
*/

$result = Set::combine($a, ['%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'], '{n}.User.Data.name');

/* $result now looks like:
    [
        [mariano.iglesias: 2] => Mariano Iglesias
        [phpnut: 14] => Larry E. Masters
        [gwoo: 25] => The Gwoo
    ]
*/

$result = Set::combine($a, ['%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'], '{n}.User.Data.name');
/* $result now looks like:
    [
        [2: mariano.iglesias] => Mariano Iglesias
        [14: phpnut] => Larry E. Masters
        [25: gwoo] => The Gwoo
    ]
*/
```

`static` Set::**contains**($val1, $val2 = null)

rtype  
boolean

一つの配列が、もう片方の配列のキーと値を正確に含んでいるかを確認します。:

``` php
$a = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
];
$b = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
    2 => ['name' => 'contact'],
    'a' => 'b',
];

$result = Set::contains($a, $a);
// True
$result = Set::contains($a, $b);
// False
$result = Set::contains($b, $a);
// True
```

`static` Set::**countDim **($array = null, $all = false, $count = 0)

rtype  
integer

配列の次元の数を数えます。
もし \$all を false (デフォルトの値です) に設定すると、配列の最初の要素を配列の次元の数とみなします。:

``` php
$data = ['one', '2', 'three'];
$result = Set::countDim($data);
// $result == 1

$data = ['1' => '1.1', '2', '3'];
$result = Set::countDim($data);
// $result == 1

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => '3.1.1']];
$result = Set::countDim($data);
// $result == 2

$data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
$result = Set::countDim($data);
// $result == 1

$data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
$result = Set::countDim($data, true);
// $result == 2

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($data);
// $result == 2

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($data, true);
// $result == 3

$data = ['1' => ['1.1' => '1.1.1'], ['2' => ['2.1' => ['2.1.1' => '2.1.1.1']]], '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($data, true);
// $result == 4

$data = ['1' => ['1.1' => '1.1.1'], ['2' => ['2.1' => ['2.1.1' => ['2.1.1.1']]]], '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($data, true);
// $result == 5

$data = ['1' => ['1.1' => '1.1.1'], ['2' => ['2.1' => ['2.1.1' => ['2.1.1.1' => '2.1.1.1.1']]]], '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($data, true);
// $result == 5

$set = ['1' => ['1.1' => '1.1.1'], ['2' => ['2.1' => ['2.1.1' => ['2.1.1.1' => '2.1.1.1.1']]]], '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Set::countDim($set, false, 0);
// $result == 2

$result = Set::countDim($set, true);
// $result == 5
```

`static` Set::**diff**($val1, $val2 = null)

rtype  
array

セットと配列、二つのセット、あるいは二つの配列の間の差分を計算します。 :

``` php
$a = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
];
$b = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
    2 => ['name' => 'contact'],
];

$result = Set::diff($a, $b);
/* $result は現段階で次のようになります。:
    [
        [2] => [
                [name] => contact
            ]
    ]
*/
$result = Set::diff($a, []);
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [name] => main
            ]
        [1] => [
                [name] => about
            ]
    ]
*/
$result = Set::diff([], $b);
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [name] => main
            ]
        [1] => [
                [name] => about
            ]
        [2] => [
                [name] => contact
            ]
    ]
*/

$b = [
    0 => ['name' => 'me'],
    1 => ['name' => 'about'],
];

$result = Set::diff($a, $b);
/* $result は現段階で次のようになります。:
    [
        [0] => [
                [name] => main
            ]
    ]
*/
```

`static` Set::**enum**($select, $list = null)

rtype  
string

enumメソッドは、HTMLのselect要素を使う時にうまく機能します。
これは配列のリストから、キーが存在するものの値を返します。

もし \$list にカンマ区切りで値を渡すと、0から始まる配列として構成されます。
たとえば \$list に「no, yes」を渡すと、 \$list = [0 =\> 'no', 1 =\> 'yes'] となります。

もし配列が使われると、キーを文字列にすることができます。
例: ['no' =\> 0, 'yes' =\> 1];

もしパラメータが渡されなかった場合の \$list のデフォルトは 0 = no 1 = yes です。:

``` php
$res = Set::enum(1, 'one, two');
// $res は「two」になる

$res = Set::enum('no', ['no' => 0, 'yes' => 1]);
// $res は「0」になる

$res = Set::enum('first', ['first' => 'one', 'second' => 'two']);
// $res は「one」になる
```

`static` Set::**extract**($path, $data = null, $options = [])

rtype  
array

Set::extract は、 find あるいは findAll で得られたデータのサブセットを、基本的な XPath 2.0 のシンタックスを使って返します。
この関数を使うと、多次元配列にループを使ったり、木構造を走査することをせずに、データを速やかに検索することができます。

> [!NOTE]
> もし `$path` が'/'を含まない場合は、 `Set::classicExtract()` に処理が委譲されます

``` php
// 一般的な使い方:
$users = $this->User->find('all');
$results = Set::extract('/User/id', $users);
// $results はこのようになります:
// [1,2,3,4,5,...];
```

現在実装されているセレクタは次の通りです。

| セレクタ | 備考 |
|----|----|
| /User/id | 古典的な{n}.User.id に似ています。 |
| /User\[2\]/name | 二番目の User の名前を選びます。 |
| /User\[id\<2\] | id が 2 より小さい User を全て選びます。 |
| /User\[id\>2\]\[\<5\] | id が 2 より大きく、 5 より小さい User を全て選びます。 |
| /Post/Comment\[author_name=john\]/../name | john によって書かれた Comment を少なくとも 一つ持つ全ての Post の名前を選びます。 |
| /Posts\[title\] | 「title」キーを持つ全ての Post を選びます。 |
| /Comment/.\[1\] | 最初の Comment のコンテンツを選びます。 |
| /Comment/.\[:last\] | 最後の Comment を選びます。 |
| /Comment/.\[:first\] | 最初の Comment を選びます。 |
| /Comment\[text=/cakephp/i\] | 正規表現で /cakephp/i にマッチする text を持つ全ての Comment を選びます。 |
| /Comment/@\* | 全てのコメントのキー名を選びます。 現在のところ、単一の「/」を使った 絶対パスのみサポートされています。 バグを発見したら、それを報告してください。 また機能追加の提案も歓迎します。 |

より詳しくSet::extract()について学ぶには、`pieceofcake2/cakephp` リポジトリの `tests/TestCase/Utility/SetTest.php` の中の testExtract() 関数を参照してください。

`static` Set::**filter**($var)

rtype  
array

ルート配列から空の要素を除きます。
「0」の要素は除きません:

``` php
$res = Set::filter(['0', false, true, 0, ['one thing', 'I can tell you', 'is you got to be', false]]);

/* $res は現段階で次のようになります。:
    [
        [0] => 0
        [2] => 1
        [3] => 0
        [4] => [
                [0] => one thing
                [1] => I can tell you
                [2] => is you got to be
            ]
    ]
*/
```

`static` Set::**flatten**($data, $separator = '.')

rtype  
array

多次元配列を1次元配列に潰します:

``` php
$arr = [
    [
        'Post' => ['id' => '1', 'title' => 'First Post'],
        'Author' => ['id' => '1', 'user' => 'Kyle'],
    ],
    [
        'Post' => ['id' => '2', 'title' => 'Second Post'],
        'Author' => ['id' => '3', 'user' => 'Crystal'],
    ],
];
$res = Set::flatten($arr);
/* $res は現段階で次のようになります。:
    [
        [0.Post.id] => 1
        [0.Post.title] => First Post
        [0.Author.id] => 1
        [0.Author.user] => Kyle
        [1.Post.id] => 2
        [1.Post.title] => Second Post
        [1.Author.id] => 3
        [1.Author.user] => Crystal
    ]
*/
```

`static` Set::**format**($data, $format, $keys)

rtype  
array

配列から、文字列にフォーマットしたものを抜粋して返します:

``` php
$data = [
    ['Person' => ['first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42']],
    ['Person' => ['first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}']],
    ['Person' => ['first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}']],
];

$res = Set::format($data, '{1}, {0}', ['{n}.Person.first_name', '{n}.Person.last_name']);
/*
[
    [0] => Abele, Nate
    [1] => Masters, Larry
    [2] => Woodworth, Garrett
]
*/

$res = Set::format($data, '{0}, {1}', ['{n}.Person.city', '{n}.Person.state']);
/*
[
    [0] => Boston, MA
    [1] => Boondock, TN
    [2] => Venice Beach, CA
]
*/
$res = Set::format($data, '{{0}, {1}}', ['{n}.Person.city', '{n}.Person.state']);
/*
[
    [0] => {Boston, MA}
    [1] => {Boondock, TN}
    [2] => {Venice Beach, CA}
]
*/
$res = Set::format($data, '{%2$d, %1$s}', ['{n}.Person.something', '{n}.Person.something']);
/*
[
    [0] => {42, 42}
    [1] => {0, {0}}
    [2] => {0, {1}}
]
*/
$res = Set::format($data, '%2$d, %1$s', ['{n}.Person.first_name', '{n}.Person.something']);
/*
[
    [0] => 42, Nate
    [1] => 0, Larry
    [2] => 0, Garrett
]
*/
$res = Set::format($data, '%1$s, %2$d', ['{n}.Person.first_name', '{n}.Person.something']);
/*
[
    [0] => Nate, 42
    [1] => Larry, 0
    [2] => Garrett, 0
]
*/
```

`static` Set::**insert **($list, $path, $data = null)

rtype  
array

\$path で定義された配列の中に \$data を挿入します。:

``` php
$a = [
    'pages' => ['name' => 'page'],
];
$result = Set::insert($a, 'files', ['name' => 'files']);
/* $result は現段階で次のようになります。:
    [
        [pages] => [
                [name] => page
            ]
        [files] => [
                [name] => files
            ]
    ]
*/

$a = [
    'pages' => ['name' => 'page'],
];
$result = Set::insert($a, 'pages.name', []);
/* $result は現段階で次のようになります。:
    [
        [pages] => [
                [name] => [
                    ]
            ]
    ]
*/

$a = [
    'pages' => [
        0 => ['name' => 'main'],
        1 => ['name' => 'about'],
    ],
];
$result = Set::insert($a, 'pages.1.vars', ['title' => 'page title']);
/* $result は現段階で次のようになります。:
    [
        [pages] => [
                [0] => [
                        [name] => main
                    ]
                [1] => [
                        [name] => about
                        [vars] => [
                                [title] => page title
                            ]
                    ]
            ]
    ]
*/
```

`static` Set::**map**($class = 'stdClass', $tmp = 'stdClass')

rtype  
object

このメソッドは、Setオブジェクトのコンテンツを、数値添字をオブジェクトの配列として保ちながら、ひとつのオブジェクトにマッピングします。

基本的に、map関数は配列の要素を初期化されたクラスオブジェクトに変換します。
デフォルトでは、この関数は配列を stdClass オブジェクトに変換しますが、任意のタイプのクラスを指定することができます。
例：Set::map(\$array_of_values, 'nameOfYourClass');:

``` php
$data = [
    [
        'IndexedPage' => [
            'id' => 1,
            'url' => 'http://blah.com/',
            'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
            'get_vars' => '',
            'redirect' => '',
            'created' => '1195055503',
            'updated' => '1195055503',
        ],
    ],
    [
        'IndexedPage' => [
            'id' => 2,
            'url' => 'http://blah.com/',
            'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
            'get_vars' => '',
            'redirect' => '',
            'created' => '1195055503',
            'updated' => '1195055503',
        ],
    ],
];
$mapped = Set::map($data);

/* $mapped は現段階で次のようになります。:

    [
        [0] => stdClass Object
            (
                [_name_] => IndexedPage
                [id] => 1
                [url] => http://blah.com/
                [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                [get_vars] =>
                [redirect] =>
                [created] => 1195055503
                [updated] => 1195055503
            )

        [1] => stdClass Object
            (
                [_name_] => IndexedPage
                [id] => 2
                [url] => http://blah.com/
                [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                [get_vars] =>
                [redirect] =>
                [created] => 1195055503
                [updated] => 1195055503
            )

    ]

*/
```

2番目の引数で独自のクラスを用いたSet::map()の使用方法:

``` php
class MyClass
{
    public function sayHi()
    {
        echo 'Hi!';
    }
}

$mapped = Set::map($data, 'MyClass');
//現在、上記の例のようにすべてのプロパティにアクセスすることができますが、
//MyClassのメソッドもまた呼ぶことができます
$mapped->[0]->sayHi();
```

`static` Set::**matches**($conditions, $data = [], $i = null, $length = null)

rtype  
boolean

Set::matches は単一のアイテムあるいは与えられた XPath が、ある条件にマッチするかどうかを確認します:

``` php
$a = [
    ['Article' => ['id' => 1, 'title' => 'Article 1']],
    ['Article' => ['id' => 2, 'title' => 'Article 2']],
    ['Article' => ['id' => 3, 'title' => 'Article 3']],
];
$res = Set::matches(['id>2'], $a[1]['Article']);
// returns false
$res = Set::matches(['id>=2'], $a[1]['Article']);
// returns true
$res = Set::matches(['id>=3'], $a[1]['Article']);
// returns false
$res = Set::matches(['id<=2'], $a[1]['Article']);
// returns true
$res = Set::matches(['id<2'], $a[1]['Article']);
// returns false
$res = Set::matches(['id>1'], $a[1]['Article']);
// returns true
$res = Set::matches(['id>1', 'id<3', 'id!=0'], $a[1]['Article']);
// returns true
$res = Set::matches(['3'], null, 3);
// returns true
$res = Set::matches(['5'], null, 5);
// returns true
$res = Set::matches(['id'], $a[1]['Article']);
// returns true
$res = Set::matches(['id', 'title'], $a[1]['Article']);
// returns true
$res = Set::matches(['non-existent'], $a[1]['Article']);
// returns false
$res = Set::matches('/Article[id=2]', $a);
// returns true
$res = Set::matches('/Article[id=4]', $a);
// returns false
$res = Set::matches([], $a);
// returns true
```

`static` Set::**merge**($arr1, $arr2 = null)

rtype  
array

この関数は PHP の array_merge と array_merge_recursive を混ぜ合わせたものと見なすことができます。
array_merge と異なる点は、もし配列のキーが他の配列に含まれていたら、再帰的に振舞うことです。
array_merge_recursive と異なる点は、キーが文字列に含まれていたら、再帰的な処理を行わないことです。
詳しい情報は、単体テストを見てください。

> [!NOTE]
> この関数は引数を無制限に渡すことができ、配列でないパラメータは配列に型を変換します。

``` php
$arry1 = [
    [
        'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
        'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
        'description' => 'Importing an sql dump',
    ],
    [
        'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
        'name' => 'pbpaste | grep -i Unpaid | pbcopy',
        'description' => 'Remove all lines that say "Unpaid".',
    ],
];
$arry2 = 4;
$arry3 = [0 => 'test array', 'cats' => 'dogs', 'people' => 1267];
$arry4 = ['cats' => 'felines', 'dog' => 'angry'];
$res = Set::merge($arry1, $arry2, $arry3, $arry4);

/* $res は現段階で次のようになります。:
[
    [0] => [
            [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
            [name] => mysql raleigh-workshop-08 < 2008-09-05.sql
            [description] => Importing an sql dump
        ]

    [1] => [
            [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
            [name] => pbpaste | grep -i Unpaid | pbcopy
            [description] => Remove all lines that say "Unpaid".
        ]

    [2] => 4
    [3] => test array
    [cats] => felines
    [people] => 1267
    [dog] => angry
]
*/
```

`static` Set::**nest**($data, $options = [])

rtype  
array

フラットな配列を引数にとり、ネストされた配列を返します:

``` php
$data = [
    ['ModelName' => ['id' => 1, 'parent_id' => null]],
    ['ModelName' => ['id' => 2, 'parent_id' => 1]],
    ['ModelName' => ['id' => 3, 'parent_id' => 1]],
    ['ModelName' => ['id' => 4, 'parent_id' => 1]],
    ['ModelName' => ['id' => 5, 'parent_id' => 1]],
    ['ModelName' => ['id' => 6, 'parent_id' => null]],
    ['ModelName' => ['id' => 7, 'parent_id' => 6]],
    ['ModelName' => ['id' => 8, 'parent_id' => 6]],
    ['ModelName' => ['id' => 9, 'parent_id' => 6]],
    ['ModelName' => ['id' => 10, 'parent_id' => 6]],
];

$result = Set::nest($data, ['root' => 6]);

/* $result は現段階で次のようになります。:
    [
        (int) 0 => [
            'ModelName' => [
                'id' => (int) 6,
                'parent_id' => null
            ],
            'children' => [
                (int) 0 => [
                    'ModelName' => [
                        'id' => (int) 7,
                        'parent_id' => (int) 6
                    ],
                    'children' => []
                ],
                (int) 1 => [
                    'ModelName' => [
                        'id' => (int) 8,
                        'parent_id' => (int) 6
                    ],
                    'children' => []
                ],
                (int) 2 => [
                    'ModelName' => [
                        'id' => (int) 9,
                        'parent_id' => (int) 6
                    ],
                    'children' => []
                ],
                (int) 3 => [
                    'ModelName' => [
                        'id' => (int) 10,
                        'parent_id' => (int) 6
                    ],
                    'children' => []
                ]
            ]
        ]
    ] */
```

`static` Set::**normalize**($list, $assoc = true, $sep = ',', $trim = true)

rtype  
array

文字列や配列のリストを正規化します。:

``` php
$a = [
    'Tree',
    'CounterCache',
    'Upload' => [
        'folder' => 'products',
        'fields' => ['image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id'],
    ],
];
$b = [
    'Cacheable' => ['enabled' => false],
    'Limit',
    'Bindable',
    'Validator',
    'Transactional',
];
$result = Set::normalize($a);
/* $result は現段階で次のようになります。:
    [
        [Tree] =>
        [CounterCache] =>
        [Upload] => [
                [folder] => products
                [fields] => [
                        [0] => image_1_id
                        [1] => image_2_id
                        [2] => image_3_id
                        [3] => image_4_id
                        [4] => image_5_id
                    ]
            ]
    ]
*/
$result = Set::normalize($b);
/* $result は現段階で次のようになります。:
    [
        [Cacheable] => [
                [enabled] =>
            ]

        [Limit] =>
        [Bindable] =>
        [Validator] =>
        [Transactional] =>
    ]
*/
$result = Set::merge($a, $b);
/* $result は現段階で次のようになります。:
    [
        [0] => Tree
        [1] => CounterCache
        [Upload] => [
                [folder] => products
                [fields] => [
                        [0] => image_1_id
                        [1] => image_2_id
                        [2] => image_3_id
                        [3] => image_4_id
                        [4] => image_5_id
                    ]

            ]
        [Cacheable] => [
                [enabled] =>
            ]
        [2] => Limit
        [3] => Bindable
        [4] => Validator
        [5] => Transactional
    ]
*/
$result = Set::normalize(Set::merge($a, $b)); // 2つをマージして正規化します
/* $result は現段階で次のようになります。:
    [
        [Tree] =>
        [CounterCache] =>
        [Upload] => [
                [folder] => products
                [fields] => [
                        [0] => image_1_id
                        [1] => image_2_id
                        [2] => image_3_id
                        [3] => image_4_id
                        [4] => image_5_id
                    ]

            ]
        [Cacheable] => [
                [enabled] =>
            ]
        [Limit] =>
        [Bindable] =>
        [Validator] =>
        [Transactional] =>
    ]
*/
```

`static` Set::**numeric**($array=null)

rtype  
boolean

配列の全ての値が数字かどうかチェックします:

``` php
$data = ['one'];
$res = Set::numeric(array_keys($data));

// $res は true

$data = [1 => 'one'];
$res = Set::numeric($data);

// $res は false

$data = ['one'];
$res = Set::numeric($data);

// $res は false

$data = ['one' => 'two'];
$res = Set::numeric($data);

// $res は false

$data = ['one' => 1];
$res = Set::numeric($data);

// $res は true

$data = [0];
$res = Set::numeric($data);

// $res は true

$data = ['one', 'two', 'three', 'four', 'five'];
$res = Set::numeric(array_keys($data));

// $res は true

$data = [1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five'];
$res = Set::numeric(array_keys($data));

// $res は true

$data = ['1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five'];
$res = Set::numeric(array_keys($data));

// $res は true

$data = ['one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five'];
$res = Set::numeric(array_keys($data));

// $res は false
```

`static` Set::**pushDiff**($array1, $array2)

rtype  
array

この関数は二つの配列を統合し、戻り値の配列の最後に array2 の差分を追加します。

**Example 1**
:

``` php
$array1 = ['ModelOne' => ['id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2']];
$array2 = ['ModelOne' => ['id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3']];
$res = Set::pushDiff($array1, $array2);

/* $res は現段階で次のようになります。:
    [
        [ModelOne] => [
                [id] => 1001
                [field_one] => a1.m1.f1
                [field_two] => a1.m1.f2
                [field_three] => a3.m1.f3
            ]
    ]
*/
```

**Example 2**
:

``` php
$array1 = ['a' => 'b', 1 => 20938, 'c' => 'string'];
$array2 = ['b' => 'b', 3 => 238, 'c' => 'string', ['extra_field']];
$res = Set::pushDiff($array1, $array2);
/* $res は現段階で次のようになります。:
    [
        [a] => b
        [1] => 20938
        [c] => string
        [b] => b
        [3] => 238
        [4] => [
                [0] => extra_field
            ]
    ]
*/
```

`static` Set::**remove**($list, $path = null)

rtype  
array

セットや配列の中のから、\$pathで定義されたパスの要素を削除します。:

``` php
$a = [
    'pages' => ['name' => 'page'],
    'files' => ['name' => 'files'],
];

$result = Set::remove($a, 'files');
/* $result は現段階で次のようになります。:
    [
        [pages] => [
                [name] => page
            ]

    ]
*/
```

`static` Set::**reverse**($object)

rtype  
array

Set::reverse は基本的に `Set::map` の逆を行います。
これは、オブジェクトを配列に変換します。
もし \$object がオブジェクトでなかったら、単純に \$object を返します。:

``` php
$result = Set::reverse(null);
// Null
$result = Set::reverse(false);
// false
$a = [
    'Post' => ['id' => 1, 'title' => 'First Post'],
    'Comment' => [
        ['id' => 1, 'title' => 'First Comment'],
        ['id' => 2, 'title' => 'Second Comment'],
    ],
    'Tag' => [
        ['id' => 1, 'title' => 'First Tag'],
        ['id' => 2, 'title' => 'Second Tag'],
    ],
];
$map = Set::map($a); // $a をクラスオブジェクトに変換する
/* $map は現段階で次のようになります。:
    stdClass Object
    (
        [_name_] => Post
        [id] => 1
        [title] => First Post
        [Comment] => [
                [0] => stdClass Object
                    (
                        [id] => 1
                        [title] => First Comment
                    )
                [1] => stdClass Object
                    (
                        [id] => 2
                        [title] => Second Comment
                    )
            ]
        [Tag] => [
                [0] => stdClass Object
                    (
                        [id] => 1
                        [title] => First Tag
                    )
                [1] => stdClass Object
                    (
                        [id] => 2
                        [title] => Second Tag
                    )
            ]
    )
*/

$result = Set::reverse($map);
/* $result は現段階で次のようになります。:
    [
        [Post] => [
                [id] => 1
                [title] => First Post
                [Comment] => [
                        [0] => [
                                [id] => 1
                                [title] => First Comment
                            ]
                        [1] => [
                                [id] => 2
                                [title] => Second Comment
                            ]
                    ]
                [Tag] => [
                        [0] => [
                                [id] => 1
                                [title] => First Tag
                            ]
                        [1] => [
                                [id] => 2
                                [title] => Second Tag
                            ]
                    ]
            ]
    ]
*/

$result = Set::reverse($a['Post']); // ただ配列を返します
/* $result は現段階で次のようになります。:
    [
        [id] => 1
        [title] => First Post
    ]
*/
```

`static` Set::**sort**($data, $path, $dir)

rtype  
array

Set 互換のパスで確定したあらゆる値で配列をソートします。:

``` php
$a = [
    0 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    1 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]],
    2 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
$result = Set::sort($a, '{n}.Person.name', 'asc');
/* $result は現段階で次のようになります。:
[
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
];
*/

$result = Set::sort($a, '{n}.Person.name', 'desc');
/* $result は現段階で次のようになります。:
[
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
*/
```
