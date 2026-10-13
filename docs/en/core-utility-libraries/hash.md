# Hash

`class` **Hash**

::: info Added in version 2.2
:::

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Hash class that allow you
to do just that.

CakePHP's Hash class can be called from any model or controller in
the same way Inflector is called. Example: `Hash::combine()`.

<a id="hash-path-syntax"></a>

## Hash path syntax

The path syntax described below is used by all the methods in `Hash`. Not all
parts of the path syntax are available in all methods. A path expression is
made of any number of tokens. Tokens are composed of two groups. Expressions,
are used to traverse the array data, while matchers are used to qualify
elements. You apply matchers to expression elements.

### Expression Types

| Expression | Definition |
|----|----|
| `{n}` | Represents a numeric key. Will match any string or numeric key. |
| `{s}` | Represents a string. Will match any string value including numeric string values. |
| `{*}` | Represents any value regardless of type. |
| `Foo` | Matches keys with the exact same value. |

All expression elements are supported by all methods. In addition to expression
elements, you can use attribute matching with certain methods. They are `extract()`,
`combine()`, `format()`, `check()`, `map()`, `reduce()`,
`apply()`, `sort()`, `insert()`, `remove()` and `nest()`.

### Attribute Matching Types

| Matcher | Definition |
|----|----|
| `[id]` | Match elements with a given array key. |
| `[id=2]` | Match elements with id equal to 2. |
| `[id!=2]` | Match elements with id not equal to 2. |
| `[id>2]` | Match elements with id greater than 2. |
| `[id>=2]` | Match elements with id greater than or equal to 2. |
| `[id<2]` | Match elements with id less than 2 |
| `[id<=2]` | Match elements with id less than or equal to 2. |
| `[text=/.../]` | Match elements that have values matching the regular expression inside `...`. |

Use matchers by appending them to the expression element (`{n}`, `{s}`, etc.) you wish to match.

So to return `id` fields where a `name` matches you can use paths using `{n}` and `{s}` to insert data into multiple
points:

``` php
$users = [
     [
        'id' => 123,
        'name'=> 'fred',
        'surname' => 'bloggs'
     ],
     [
        'id' => 245,
        'name' => 'fred',
        'surname' => 'smith'
     ],
     [
        'id' => 356,
        'name' => 'joe',
        'surname' => 'smith'
      ]
   ];     
$ids = Hash::extract($users, '{n}[name=fred].id');
// $ids will be [123, 245]
```

::: info Changed in version 2.5
Matcher support was added to `insert()` and `remove()`.
:::

`static` Hash::**get**(array $data, $path, $default = null)

rtype  
mixed

`get()` is a simplified version of `extract()`, it only supports direct
path expressions. Paths with `{n}`, `{s}` or matchers are not
supported. Use `get()` when you want exactly one value out of an array.
The optional third argument will be returned if the requested path is not
found in the array.

::: info Changed in version 2.5
The optional third argument `$default = null` was added.
:::

`static` Hash::**extract**(array $data, $path)

rtype  
array

`Hash::extract()` supports all expression, and matcher components of
[Hash Path Syntax](#hash-path-syntax). You can use extract to retrieve data from arrays,
along arbitrary paths quickly without having to loop through the data
structures. Instead you use path expressions to qualify which elements you
want returned :

``` php
// Common Usage:
$users = $this->User->find("all");
$results = Hash::extract($users, '{n}.User.id');
// $results equals:
// [1,2,3,4,5,...];
```

`static` Hash::**insert**(array $data, $path, $values = null)

rtype  
array

Inserts \$data into an array as defined by `$path`:

``` php
$a = [
    'pages' => ['name' => 'page']
];
$result = Hash::insert($a, 'files', ['name' => 'files']);
// $result now looks like:

[
    [pages] => 
        [
            [name] => page
        ]
    [files] => 
        [
            [name] => files
        ]
]
```

You can use paths using `{n}` and `{s}` to insert data into multiple
points:

``` php
$users = $this->User->find('all');
$users = Hash::insert($users, '{n}.User.new', 'value');
```

::: info Changed in version 2.5
As of 2.5.0 attribute matching expressions work with insert().
:::

`static` Hash::**remove**(array $data, $path)

rtype  
array

Removes all elements from an array that match \$path. :

``` php
$a = [
    'pages' => ['name' => 'page'],
    'files' => ['name' => 'files']
];
$result = Hash::remove($a, 'files');
/* $result now looks like:
    [
        [pages] => [
                [name] => page
            ]

    ]
*/
```

Using `{n}` and `{s}` will allow you to remove multiple values at once.

::: info Changed in version 2.5
As of 2.5.0 attribute matching expressions work with remove()
:::

`static` Hash::**combine**(array $data, $keyPath, $valuePath = null, $groupPath = null)

rtype  
array

Creates an associative array using a \$keyPath as the path to build its keys,
and optionally \$valuePath as path to get the values. If \$valuePath is not
specified, or doesn't match anything, values will be initialized to null.
You can optionally group the values by what is obtained when following the
path specified in \$groupPath. :

``` php
$a = [
    [
        'User' => [
            'id' => 2,
            'group_id' => 1,
            'Data' => [
                'user' => 'mariano.iglesias',
                'name' => 'Mariano Iglesias'
            ]
        ]
    ],
    [
        'User' => [
            'id' => 14,
            'group_id' => 2,
            'Data' => [
                'user' => 'phpnut',
                'name' => 'Larry E. Masters'
            ]
        ]
    ],
];

$result = Hash::combine($a, '{n}.User.id');
/* $result now looks like:
    [
        [2] =>
        [14] =>
    ]
*/

$result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
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
    ]
*/

$result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name');
/* $result now looks like:
    [
        [2] => Mariano Iglesias
        [14] => Larry E. Masters
    ]
*/

$result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
/* $result now looks like:
    [
        [1] => [
                [2] => [
                        [user] => mariano.iglesias
                        [name] => Mariano Iglesias
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

$result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
/* $result now looks like:
    [
        [1] => [
                [2] => Mariano Iglesias
            ]
        [2] => [
                [14] => Larry E. Masters
            ]
    ]
*/
```

You can provide array's for both \$keyPath and \$valuePath. If you do this,
the first value will be used as a format string, for values extracted by the
other paths:

``` php
$result = Hash::combine(
    $a,
    '{n}.User.id',
    ['%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'],
    '{n}.User.group_id'
);
/* $result now looks like:
    [
        [1] => [
                [2] => mariano.iglesias: Mariano Iglesias
            ]
        [2] => [
                [14] => phpnut: Larry E. Masters
            ]
    ]
*/

$result = Hash::combine(
    $a,
    ['%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'],
    '{n}.User.id'
);
/* $result now looks like:
    [
        [mariano.iglesias: Mariano Iglesias] => 2
        [phpnut: Larry E. Masters] => 14
    ]
*/
```

`static` Hash::**format**(array $data, array $paths, $format)

rtype  
array

Returns a series of values extracted from an array, formatted with a
format string:

``` php
$data = [
    [
        'Person' => [
            'first_name' => 'Nate',
            'last_name' => 'Abele',
            'city' => 'Boston',
            'state' => 'MA',
            'something' => '42'
        ]
    ],
    [
        'Person' => [
            'first_name' => 'Larry',
            'last_name' => 'Masters',
            'city' => 'Boondock',
            'state' => 'TN',
            'something' => '{0}'
        ]
    ],
    [
        'Person' => [
            'first_name' => 'Garrett',
            'last_name' => 'Woodworth',
            'city' => 'Venice Beach',
            'state' => 'CA',
            'something' => '{1}'
        ]
    ]
];

$res = Hash::format($data, ['{n}.Person.first_name', '{n}.Person.something'], '%2$d, %1$s');
/*
[
    [0] => 42, Nate
    [1] => 0, Larry
    [2] => 0, Garrett
]
*/

$res = Hash::format($data, ['{n}.Person.first_name', '{n}.Person.something'], '%1$s, %2$d');
/*
[
    [0] => Nate, 42
    [1] => Larry, 0
    [2] => Garrett, 0
]
*/
```

`static` Hash::**contains**(array $data, array $needle)

rtype  
boolean

Determines if one Hash or array contains the exact keys and values
of another:

``` php
$a = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about']
];
$b = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
    2 => ['name' => 'contact'],
    'a' => 'b'
];

$result = Hash::contains($a, $a);
// true
$result = Hash::contains($a, $b);
// false
$result = Hash::contains($b, $a);
// true
```

`static` Hash::**check**(array $data, string $path = null)

rtype  
boolean

Checks if a particular path is set in an array:

``` php
$set = [
    'My Index 1' => ['First' => 'The first item']
];
$result = Hash::check($set, 'My Index 1.First');
// $result == True

$result = Hash::check($set, 'My Index 1');
// $result == True

$set = [
    'My Index 1' => ['First' =>
        ['Second' =>
            ['Third' =>
                ['Fourth' => 'Heavy. Nesting.']]]]
];
$result = Hash::check($set, 'My Index 1.First.Second');
// $result == True

$result = Hash::check($set, 'My Index 1.First.Second.Third');
// $result == True

$result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
// $result == True

$result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
// $result == False
```

`static` Hash::**filter**(array $data, $callback = ['Hash', 'filter'])

rtype  
array

Filters empty elements out of array, excluding '0'. You can also supply a
custom \$callback to filter the array elements. Your callback should return
`false` to remove elements from the resulting array:

``` php
$data = [
    '0',
    false,
    true,
    0,
    ['one thing', 'I can tell you', 'is you got to be', false]
];
$res = Hash::filter($data);

/* $data now looks like:
    [
        [0] => 0
        [2] => true
        [3] => 0
        [4] => [
                [0] => one thing
                [1] => I can tell you
                [2] => is you got to be
            ]
    ]
*/
```

`static` Hash::**flatten**(array $data, string $separator = '.')

rtype  
array

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
$res = Hash::flatten($arr);
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

`static` Hash::**expand**(array $data, string $separator = '.')

rtype  
array

Expands an array that was previously flattened with
`Hash::flatten()`:

``` php
$data = [
    '0.Post.id' => 1,
    '0.Post.title' => First Post,
    '0.Author.id' => 1,
    '0.Author.user' => Kyle,
    '1.Post.id' => 2,
    '1.Post.title' => Second Post,
    '1.Author.id' => 3,
    '1.Author.user' => Crystal,
];
$res = Hash::expand($data);
/* $res now looks like:
[
    [
        'Post' => ['id' => '1', 'title' => 'First Post'],
        'Author' => ['id' => '1', 'user' => 'Kyle'],
    ],
    [
        'Post' => ['id' => '2', 'title' => 'Second Post'],
        'Author' => ['id' => '3', 'user' => 'Crystal'],
    ],
];
*/
```

`static` Hash::**merge**(array $data, array $merge[, array $n])

rtype  
array

This function can be thought of as a hybrid between PHP's
`array_merge` and `array_merge_recursive`. The difference to the two
is that if an array key contains another array then the function
behaves recursive (unlike `array_merge`) but does not do if for keys
containing strings (unlike `array_merge_recursive`).

> [!NOTE]
> This function will work with an unlimited amount of arguments and
> typecasts non-array parameters into arrays.

``` php
$array = [
    [
        'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
        'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
        'description' => 'Importing an sql dump'
    ],
    [
        'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
        'name' => 'pbpaste | grep -i Unpaid | pbcopy',
        'description' => 'Remove all lines that say "Unpaid".',
    ]
];
$arrayB = 4;
$arrayC = [0 => "test array", "cats" => "dogs", "people" => 1267];
$arrayD = ["cats" => "felines", "dog" => "angry"];
$res = Hash::merge($array, $arrayB, $arrayC, $arrayD);

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

`static` Hash::**numeric**(array $data)

rtype  
boolean

Checks to see if all the values in the array are numeric:

``` php
$data = ['one'];
$res = Hash::numeric(array_keys($data));
// $res is true

$data = [1 => 'one'];
$res = Hash::numeric($data);
// $res is false
```

`static` Hash::**dimensions **(array $data)

rtype  
integer

Counts the dimensions of an array. This method will only
consider the dimension of the first element in the array:

``` php
$data = ['one', '2', 'three'];
$result = Hash::dimensions($data);
// $result == 1

$data = ['1' => '1.1', '2', '3'];
$result = Hash::dimensions($data);
// $result == 1

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => '3.1.1']];
$result = Hash::dimensions($data);
// $result == 2

$data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
$result = Hash::dimensions($data);
// $result == 1

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Hash::dimensions($data);
// $result == 2
```

`static` Hash::**maxDimensions**(array $data)

Similar to `~Hash::dimensions()`, however this method returns,
the deepest number of dimensions of any element in the array:

``` php
$data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
$result = Hash::maxDimensions($data);
// $result == 2

$data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
$result = Hash::maxDimensions($data);
// $result == 3
```

`static` Hash::**map**(array $data, $path, $function)

Creates a new array, by extracting \$path, and mapping \$function
across the results. You can use both expression and matching elements with
this method:

``` php
// Call the noop function $this->noop() on every element of $data
$result = Hash::map($data, "{n}", [$this, 'noop']);

function noop($array)
{
 // Do stuff to array and return the result
 return $array;
}
```

`static` Hash::**reduce**(array $data, $path, $function)

Creates a single value, by extracting \$path, and reducing the extracted
results with \$function. You can use both expression and matching elements
with this method.

`static` Hash::**apply**(array $data, $path, $function)

Apply a callback to a set of extracted values using \$function. The function
will get the extracted values as the first argument.

`static` Hash::**sort**(array $data, $path, $dir, $type = 'regular')

rtype  
array

Sorts an array by any value, determined by a [Hash Path Syntax](#hash-path-syntax)
Only expression elements are supported by this method:

``` php
$a = [
    0 => ['Person' => ['name' => 'Jeff']],
    1 => ['Shirt' => ['color' => 'black']]
];
$result = Hash::sort($a, '{n}.Person.name', 'asc');
/* $result now looks like:
    [
        [0] => [
                [Shirt] => [
                        [color] => black
                    ]
            ]
        [1] => [
                [Person] => [
                        [name] => Jeff
                    ]
            ]
    ]
*/
```

`$dir` can be either `asc` or `desc`. `$type`
can be one of the following values:

- `regular` for regular sorting.
- `numeric` for sorting values as their numeric equivalents.
- `string` for sorting values as their string value.
- `natural` for sorting values in a human friendly way. Will
  sort `foo10` below `foo2` as an example. Natural sorting
  requires PHP 5.4 or greater.

::: info Added in version 2.8
The `$type` option now supports an array and the `ignoreCase` option enabled case-insensitive sorting.
:::

`static` Hash::**diff**(array $data, array $compare)

rtype  
array

Computes the difference between two arrays:

``` php
$a = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about']
];
$b = [
    0 => ['name' => 'main'],
    1 => ['name' => 'about'],
    2 => ['name' => 'contact']
];

$result = Hash::diff($a, $b);
/* $result now looks like:
    [
        [2] => [
                [name] => contact
            ]
    ]
*/
```

`static` Hash::**mergeDiff**(array $data, array $compare)

rtype  
array

This function merges two arrays and pushes the differences in
data to the bottom of the resultant array.

**Example 1**
:

``` php
$array1 = ['ModelOne' => ['id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2']];
$array2 = ['ModelOne' => ['id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3']];
$res = Hash::mergeDiff($array1, $array2);

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
$array1 = ["a" => "b", 1 => 20938, "c" => "string"];
$array2 = ["b" => "b", 3 => 238, "c" => "string", ["extra_field"]];
$res = Hash::mergeDiff($array1, $array2);
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

`static` Hash::**normalize**(array $data, $assoc = true)

rtype  
array

Normalizes an array. If `$assoc` is true, the resulting array will be
normalized to be an associative array. Numeric keys with values, will be
converted to string keys with null values. Normalizing an array, makes using
the results with `Hash::merge()` easier:

``` php
$a = ['Tree', 'CounterCache',
    'Upload' => [
        'folder' => 'products',
        'fields' => ['image_1_id', 'image_2_id']
    ]
];
$result = Hash::normalize($a);
/* $result now looks like:
    [
        [Tree] => null
        [CounterCache] => null
        [Upload] => [
                [folder] => products
                [fields] => [
                        [0] => image_1_id
                        [1] => image_2_id
                    ]
            ]
    ]
*/

$b = [
    'Cacheable' => ['enabled' => false],
    'Limit',
    'Bindable',
    'Validator',
    'Transactional'
];
$result = Hash::normalize($b);
/* $result now looks like:
    [
        [Cacheable] => [
                [enabled] => false
            ]

        [Limit] => null
        [Bindable] => null
        [Validator] => null
        [Transactional] => null
    ]
*/
```

`static` Hash::**nest**(array $data, array $options = [])

Takes a flat array set, and creates a nested, or threaded data structure.
Used by methods like `Model::find('threaded')`.

**Options:**

- `children` The key name to use in the result set for children. Defaults
  to 'children'.
- `idPath` The path to a key that identifies each entry. Should be
  compatible with `Hash::extract()`. Defaults to `{n}.$alias.id`
- `parentPath` The path to a key that identifies the parent of each entry.
  Should be compatible with `Hash::extract()`. Defaults to `{n}.$alias.parent_id`
- `root` The id of the desired top-most result.

Example:

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
    ['ModelName' => ['id' => 10, 'parent_id' => 6]]
];

$result = Hash::nest($data, ['root' => 6]);
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
    ]
    */
```
