# Set

`class` **Set**

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Set class that allow you
to do just that.

CakePHP's Set class can be called from any model or controller in
the same way Inflector is called. Example: `Set::combine()`.

::: info Deprecated in version 2.2
The Set class has been deprecated in 2.2 in favour of the `Hash` class. It offers a more consistent interface and API.
:::

## Set-compatible Path syntax

The Path syntax is used by (for example) sort, and is used to
define a path.

Usage example (using `Set::sort()`):

``` php
$a = [
    0 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    1 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]],
    2 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
$result = Set::sort($a, '{n}.Person.name', 'asc');
/* result now looks like
 [
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
];
*/
```

As you can see in the example above, some things are wrapped in
{}'s, others not. In the table below, you can see which options are
available.

| Expression | Definition |
|----|----|
| {n} | Represents a numeric key |
| {s} | Represents a string |
| Foo | Any string (without enclosing brackets) is treated like a string literal. |
| {\[a-z\]+} | Any string enclosed in brackets (besides {n} and {s}) is interpreted as a regular expression. |

> This section needs to be expanded.

`static` Set::**apply**($path, $array, $callback, $options = [])

Return type: `mixed`

Apply a callback to the elements of an array extracted
by a Set::extract compatible path:

``` php
$data = [
    ['Movie' => ['id' => 1, 'title' => 'movie 3', 'rating' => 5]],
    ['Movie' => ['id' => 1, 'title' => 'movie 1', 'rating' => 1]],
    ['Movie' => ['id' => 1, 'title' => 'movie 2', 'rating' => 3]],
];

$result = Set::apply('/Movie/rating', $data, 'array_sum');
// result equals 9

$result = Set::apply('/Movie/title', $data, 'strtoupper', ['type' => 'map']);
// result equals ['MOVIE 3', 'MOVIE 1', 'MOVIE 2']
// $options are: - type : can be 'pass' uses call_user_func_array(), 'map' uses array_map(), or 'reduce' uses array_reduce()
```

`static` Set::**check**($data, $path = null)

Return type: `boolean/array`

Checks if a particular path is set in an array. If \$path is empty,
\$data will be returned instead of a boolean value:

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

Return type: `mixed`

Gets a value from an array or object that is contained in a given
path using an array path syntax, i.e.:

- "{n}.Person.{\[a-z\]+}" - Where "{n}" represents a numeric key,
  "Person" represents a string literal
- "{\[a-z\]+}" (i.e. any string literal enclosed in brackets besides
  {n} and {s}) is interpreted as a regular expression.

**Example 1**
:

``` php
$a = [
    ['Article' => ['id' => 1, 'title' => 'Article 1']],
    ['Article' => ['id' => 2, 'title' => 'Article 2']],
    ['Article' => ['id' => 3, 'title' => 'Article 3']],
];
$result = Set::classicExtract($a, '{n}.Article.id');
/* $result now looks like:
    [
        [0] => 1
        [1] => 2
        [2] => 3
    ]
*/
$result = Set::classicExtract($a, '{n}.Article.title');
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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

Return type: `array`

Creates an associative array using a \$path1 as the path to build
its keys, and optionally \$path2 as path to get the values. If
\$path2 is not specified, all values will be initialized to null
(useful for Set::merge). You can optionally group the values by
what is obtained when following the path specified in \$groupPath. :

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
/* $result now looks like:
    [
        [2] =>
        [14] =>
        [25] =>
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.non-existent');
/* $result now looks like:
    [
        [2] =>
        [14] =>
        [25] =>
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
/* $result now looks like:
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
/* $result now looks like:
    [
        [2] => Mariano Iglesias
        [14] => Larry E. Masters
        [25] => The Gwoo
    ]
*/

$result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
    [
        [mariano.iglesias: Mariano Iglesias] => 2
        [phpnut: Larry E. Masters] => 14
        [gwoo: The Gwoo] => 25
    ]
*/

$result = Set::combine($a, ['{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'], '{n}.User.id');
/* $result now looks like:
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

Return type: `boolean`

Determines if one Set or array contains the exact keys and values
of another:

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

Return type: `integer`

Counts the dimensions of an array. If \$all is set to false (which
is the default) it will only consider the dimension of the first
element in the array:

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

Return type: `array`

Computes the difference between a Set and an array, two Sets, or
two arrays:

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
/* $result now looks like:
    [
        [2] => [
                [name] => contact
            ]
    ]
*/
$result = Set::diff($a, []);
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
    [
        [0] => [
                [name] => main
            ]
    ]
*/
```

`static` Set::**enum**($select, $list = null)

Return type: `string`

The enum method works well when using HTML select elements. It
returns a value from an array list if the key exists.

If a comma separated \$list is passed arrays are numeric with the
key of the first being 0 \$list = 'no, yes' would translate to \$list
= [0 =\> 'no', 1 =\> 'yes'];

If an array is used, keys can be strings example: array('no' =\> 0,
'yes' =\> 1);

\$list defaults to 0 = no 1 = yes if param is not passed:

``` php
$res = Set::enum(1, 'one, two');
// $res is 'two'

$res = Set::enum('no', ['no' => 0, 'yes' => 1]);
// $res is 0

$res = Set::enum('first', ['first' => 'one', 'second' => 'two']);
// $res is 'one'
```

`static` Set::**extract**($path, $data = null, $options = [])

Return type: `mixed`

Set::extract uses basic XPath 2.0 syntax to return subsets of your
data from a find or a find all. This function allows you to
retrieve your data quickly without having to loop through multi
dimensional arrays or traverse through tree structures.

> [!NOTE]
> If `$path` does not contain a '/' the call will be delegated to
> `Set::classicExtract()`

``` php
// Common Usage:
$users = $this->User->find('all');
$results = Set::extract('/User/id', $users);
// results returns:
// [1,2,3,4,5,...];
```

Currently implemented selectors:

| Selector | Note |
|----|----|
| /User/id | Similar to the classic {n}.User.id |
| /User\[2\]/name | Selects the name of the second User |
| /User\[id\<2\] | Selects all Users with an id \< 2 |
| /User\[id\>2\]\[\<5\] | Selects all Users with an id \> 2 but 5 |
| /Post/Comment\[author_name=john\]/../name | Selects the name of all Posts that have at least one Comment written by john |
| /Posts\[title\] | Selects all Posts that have a 'title' key |
| /Comment/.\[1\] | Selects the contents of the first comment |
| /Comment/.\[:last\] | Selects the last comment |
| /Comment/.\[:first\] | Selects the first comment |
| /Comment\[text=/cakephp/i\] | Selects all comments that have a text matching the regex /cakephp/i |
| /Comment/@\* | Selects the key names of all comments Currently only absolute paths starting with a single '/' are supported. Please report any bugs as you find them. Suggestions for additional features are welcome. |

To learn more about Set::extract() refer to the function testExtract()
in `tests/TestCase/Utility/SetTest.php` of the `pieceofcake2/cakephp` repository.

`static` Set::**filter**($var)

Return type: `array`

Filters empty elements out of a route array, excluding '0':

``` php
$res = Set::filter(['0', false, true, 0, ['one thing', 'I can tell you', 'is you got to be', false]]);

/* $res now looks like:
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

Return type: `array`

Collapses a multi-dimensional array into a single dimension:

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
/* $res now looks like:
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

Return type: `array`

Returns a series of values extracted from an array, formatted in a
format string:

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

Return type: `array`

Inserts \$data into an array as defined by \$path. :

``` php
$a = [
    'pages' => ['name' => 'page'],
];
$result = Set::insert($a, 'files', ['name' => 'files']);
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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

Return type: `object`

This method Maps the contents of the Set object to an object
hierarchy while maintaining numeric keys as arrays of objects.

Basically, the map function turns array items into initialized
class objects. By default it turns an array into a stdClass Object,
however you can map values into any type of class. Example:
Set::map(\$array_of_values, 'nameOfYourClass');:

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

/* $mapped now looks like:

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

Using Set::map() with a custom class for second parameter:

``` php
class MyClass
{
    public function sayHi()
    {
        echo 'Hi!';
    }
}

$mapped = Set::map($data, 'MyClass');
//Now you can access all the properties as in the example above,
//but also you can call MyClass's methods
$mapped->[0]->sayHi();
```

`static` Set::**matches**($conditions, $data = [], $i = null, $length = null)

Return type: `boolean`

Set::matches can be used to see if a single item or a given xpath
match certain conditions. :

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

Return type: `array`

This function can be thought of as a hybrid between PHP's
array_merge and array_merge_recursive. The difference to the two
is that if an array key contains another array then the function
behaves recursive (unlike array_merge) but does not do if for keys
containing strings (unlike array_merge_recursive). See the unit
test for more information.

> [!NOTE]
> This function will work with an unlimited amount of arguments and
> typecasts non-array parameters into arrays.

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

/* $res now looks like:
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

Return type: `array`

Takes in a flat array and returns a nested array:

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

/* $result now looks like:
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

Return type: `array`

Normalizes a string or array list. :

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
/* $result now looks like:
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
/* $result now looks like:
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
/* $result now looks like:
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
$result = Set::normalize(Set::merge($a, $b)); // Now merge the two and normalize
/* $result now looks like:
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

Return type: `boolean`

Checks to see if all the values in the array are numeric:

``` php
$data = ['one'];
$res = Set::numeric(array_keys($data));

// $res is true

$data = [1 => 'one'];
$res = Set::numeric($data);

// $res is false

$data = ['one'];
$res = Set::numeric($data);

// $res is false

$data = ['one' => 'two'];
$res = Set::numeric($data);

// $res is false

$data = ['one' => 1];
$res = Set::numeric($data);

// $res is true

$data = [0];
$res = Set::numeric($data);

// $res is true

$data = ['one', 'two', 'three', 'four', 'five'];
$res = Set::numeric(array_keys($data));

// $res is true

$data = [1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five'];
$res = Set::numeric(array_keys($data));

// $res is true

$data = ['1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five'];
$res = Set::numeric(array_keys($data));

// $res is true

$data = ['one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five'];
$res = Set::numeric(array_keys($data));

// $res is false
```

`static` Set::**pushDiff**($array1, $array2)

Return type: `array`

This function merges two arrays and pushes the differences in
array2 to the bottom of the resultant array.

**Example 1**
:

``` php
$array1 = ['ModelOne' => ['id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2']];
$array2 = ['ModelOne' => ['id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3']];
$res = Set::pushDiff($array1, $array2);

/* $res now looks like:
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
/* $res now looks like:
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

Return type: `array`

Removes an element from a Set or array as defined by \$path:

``` php
$a = [
    'pages' => ['name' => 'page'],
    'files' => ['name' => 'files'],
];

$result = Set::remove($a, 'files');
/* $result now looks like:
    [
        [pages] => [
                [name] => page
            ]

    ]
*/
```

`static` Set::**reverse**($object)

Return type: `array`

Set::reverse is basically the opposite of `Set::map`. It converts an
object into an array. If \$object is not an object, reverse will
simply return \$object. :

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
$map = Set::map($a); // Turn $a into a class object
/* $map now looks like:
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
/* $result now looks like:
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

$result = Set::reverse($a['Post']); // Just return the array
/* $result now looks like:
    [
        [id] => 1
        [title] => First Post
    ]
*/
```

`static` Set::**sort**($data, $path, $dir)

Return type: `array`

Sorts an array by any value, determined by a Set-compatible path:

``` php
$a = [
    0 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    1 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]],
    2 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
$result = Set::sort($a, '{n}.Person.name', 'asc');
/* $result now looks like:
[
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
];
*/

$result = Set::sort($a, '{n}.Person.name', 'desc');
/* $result now looks like:
[
    2 => ['Person' => ['name' => 'Tracy'],'Friend' => [['name' => 'Lindsay']]]
    1 => ['Person' => ['name' => 'Jeff'], 'Friend' => [['name' => 'Nate']]],
    0 => ['Person' => ['name' => 'Adam'],'Friend' => [['name' => 'Bob']]],
];
*/
```
