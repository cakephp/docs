Hash
####

.. php:namespace:: Cake\Utility

.. php:class:: Hash

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Hash class that allow you
to do just that.

CakePHP's Hash class can be called from any model or controller in
the same way Inflector is called. Example: :php:meth:`Hash::combine()`.

.. _hash-path-syntax:

Hash Path Syntax
================

The path syntax described below is used by all the methods in ``Hash``. Not all
parts of the path syntax are available in all methods. A path expression is
made of any number of tokens. Tokens are composed of two groups. Expressions,
are used to traverse the array data, while matchers are used to qualify
elements. You apply matchers to expression elements.

Expression Types
----------------

+--------------------------------+--------------------------------------------+
| Expression                     | Definition                                 |
+================================+============================================+
| ``{n}``                        | Represents a numeric key. Will match       |
|                                | any string or numeric key.                 |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | Represents a string. Will match any        |
|                                | string value including numeric string      |
|                                | values.                                    |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | Matches keys with the exact same value.    |
+--------------------------------+--------------------------------------------+

All expression elements are supported by all methods. In addition to expression
elements, you can use attribute matching with certain methods. They are ``extract()``,
``combine()``, ``format()``, ``check()``, ``map()``, ``reduce()``,
``apply()``, ``sort()``, ``insert()``, ``remove()`` and ``nest()``.

Attribute Matching Types
------------------------

+--------------------------------+--------------------------------------------+
| Matcher                        | Definition                                 |
+================================+============================================+
| ``[id]``                       | Match elements with a given array key.     |
+--------------------------------+--------------------------------------------+
| ``[id=2]``                     | Match elements with id equal to 2.         |
+--------------------------------+--------------------------------------------+
| ``[id!=2]``                    | Match elements with id not equal to 2.     |
+--------------------------------+--------------------------------------------+
| ``[id>2]``                     | Match elements with id greater than 2.     |
+--------------------------------+--------------------------------------------+
| ``[id>=2]``                    | Match elements with id greater than        |
|                                | or equal to 2.                             |
+--------------------------------+--------------------------------------------+
| ``[id<2]``                     | Match elements with id less than 2         |
+--------------------------------+--------------------------------------------+
| ``[id<=2]``                    | Match elements with id less than           |
|                                | or equal to 2.                             |
+--------------------------------+--------------------------------------------+
| ``[text=/.../]``               | Match elements that have values matching   |
|                                | the regular expression inside ``...``.     |
+--------------------------------+--------------------------------------------+

.. php:staticmethod:: get(array|\ArrayAccess $data, $path, $default = null)

    ``get()`` is a simplified version of ``extract()``, it only supports direct
    path expressions. Paths with ``{n}``, ``{s}`` or matchers are not
    supported. Use ``get()`` when you want exactly one value out of an array. If
    a matching path is not found the default value will be returned.

.. php:staticmethod:: extract(array|\ArrayAccess $data, $path)

    ``Hash::extract()`` supports all expression, and matcher components of
    :ref:`hash-path-syntax`. You can use extract to retrieve data from arrays
    or object implementing ``ArrayAccess`` interface, along arbitrary paths
    quickly without having to loop through the data structures. Instead you
    use path expressions to qualify which elements you want returned ::

        // Common Usage:
        $users = [
            ['id' => 1, 'name' => 'mark'],
            ['id' => 2, 'name' => 'jane'],
            ['id' => 3, 'name' => 'sally'],
            ['id' => 4, 'name' => 'jose'],
        ];
        $results = Hash::extract($users, '{n}.id');
        // $results equals:
        // [1,2,3,4];

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    Inserts ``$values`` into an array as defined by ``$path``::

        $a = [
            'pages' => ['name' => 'page']
        ];
        $result = Hash::insert($a, 'files', ['name' => 'files']);
        // $result now looks like:
        [
            [pages] => [
                [name] => page
            ]
            [files] => [
                [name] => files
            ]
        ]

    You can use paths using ``{n}`` and ``{s}`` to insert data into multiple
    points::

        $users = Hash::insert($users, '{n}.new', 'value');

    Attribute matchers work with ``insert()`` as well::

        $data = [
            0 => ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::insert($data, '{n}[up].Item[id=4].new', 9);
        /* $result now looks like:
            [
                ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth', 'new' => 9]],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: remove(array $data, $path = null)

    Removes all elements from an array that match ``$path``. ::

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

    Using ``{n}`` and ``{s}`` will allow you to remove multiple values at once.
    You can also use attribute matchers with ``remove()``::

        $data = [
            0 => ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['clear' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::remove($data, '{n}[clear].Item[id=4]');
        /* $result now looks like:
            [
                ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['clear' => true],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: combine(array $data, $keyPath = null, $valuePath = null, $groupPath = null)

    Creates an associative array using a ``$keyPath`` as the path to build its keys,
    and optionally ``$valuePath`` as path to get the values. If ``$valuePath`` is not
    specified, or doesn't match anything, values will be initialized to null.
    You can optionally group the values by what is obtained when following the
    path specified in ``$groupPath``. ::

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

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.user');
        /* $result now looks like:
            [
                [2] => 'mariano.iglesias'
                [14] => 'phpnut'
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

    You can provide arrays for both ``$keyPath`` and ``$valuePath``. If you do this,
    the first value will be used as a format string, for values extracted by the
    other paths::

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

.. php:staticmethod:: format(array $data, array $paths, $format)

    Returns a series of values extracted from an array, formatted with a
    format string::

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

.. php:staticmethod:: contains(array $data, array $needle)

    Determines if one Hash or array contains the exact keys and values
    of another::

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

.. php:staticmethod:: check(array $data, string $path = null)

    Checks if a particular path is set in an array::

        $set = [
            'My Index 1' => ['First' => 'The first item']
        ];
        $result = Hash::check($set, 'My Index 1.First');
        // $result == true

        $result = Hash::check($set, 'My Index 1');
        // $result == true

        $set = [
            'My Index 1' => [
                'First' => [
                    'Second' => [
                        'Third' => [
                            'Fourth' => 'Heavy. Nesting.'
                        ]
                    ]
                ]
            ]
        ];
        $result = Hash::check($set, 'My Index 1.First.Second');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Second.Third');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == false

.. php:staticmethod:: filter(array $data, $callback = ['Hash', 'filter'])

    Filters empty elements out of array, excluding '0'. You can also supply a
    custom ``$callback`` to filter the array elements. You callback should
    return ``false`` to remove elements from the resulting array::

        $data = [
            '0',
            false,
            true,
            0,
            ['one thing', 'I can tell you', 'is you got to be', false]
        ];
        $res = Hash::filter($data);

        /* $res now looks like:
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

.. php:staticmethod:: flatten(array $data, string $separator = '.')

    Collapses a multi-dimensional array into a single dimension::

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

.. php:staticmethod:: expand(array $data, string $separator = '.')

    Expands an array that was previously flattened with
    :php:meth:`Hash::flatten()`::

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

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    This function can be thought of as a hybrid between PHP's
    ``array_merge`` and ``array_merge_recursive``. The difference to the two
    is that if an array key contains another array then the function
    behaves recursive (unlike ``array_merge``) but does not do if for keys
    containing strings (unlike ``array_merge_recursive``).

    .. note::

        This function will work with an unlimited amount of arguments and
        typecasts non-array parameters into arrays.

    ::

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

.. php:staticmethod:: numeric(array $data)

    Checks to see if all the values in the array are numeric::

        $data = ['one'];
        $res = Hash::numeric(array_keys($data));
        // $res is true

        $data = [1 => 'one'];
        $res = Hash::numeric($data);
        // $res is false

.. php:staticmethod:: dimensions (array $data)

    Counts the dimensions of an array. This method will only
    consider the dimension of the first element in the array::

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

.. php:staticmethod:: maxDimensions(array $data)

    Similar to :php:meth:`~Hash::dimensions()`, however this method returns,
    the deepest number of dimensions of any element in the array::

        $data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
        $result = Hash::maxDimensions($data);
        // $result == 2

        $data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
        $result = Hash::maxDimensions($data);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    Creates a new array, by extracting ``$path``, and mapping ``$function``
    across the results. You can use both expression and matching elements with
    this method::

        // Call the noop function $this->noop() on every element of $data
        $result = Hash::map($data, "{n}", [$this, 'noop']);

        public function noop(array $array)
        {
            // Do stuff to array and return the result
            return $array;
        }

.. php:staticmethod:: reduce(array $data, $path, $function)

    Creates a single value, by extracting ``$path``, and reducing the extracted
    results with ``$function``. You can use both expression and matching elements
    with this method.

.. php:staticmethod:: apply(array $data, $path, $function)

    Apply a callback to a set of extracted values using ``$function``. The function
    will get the extracted values as the first argument::

        $data = [
            ['date' => '01-01-2016', 'booked' => true],
            ['date' => '01-01-2016', 'booked' => false],
            ['date' => '02-01-2016', 'booked' => true]
        ];
        $result = Hash::apply($data, '{n}[booked=true].date', 'array_count_values');
        /* $result now looks like:
            [
                '01-01-2016' => 1,
                '02-01-2016' => 1,
            ]
        */

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    Sorts an array by any value, determined by a :ref:`hash-path-syntax`
    Only expression elements are supported by this method::

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

    ``$dir`` can be either ``asc`` or ``desc``. ``$type``
    can be one of the following values:

    * ``regular`` for regular sorting.
    * ``numeric`` for sorting values as their numeric equivalents.
    * ``string`` for sorting values as their string value.
    * ``natural`` for sorting values in a human friendly way. Will
      sort ``foo10`` below ``foo2`` as an example.

.. php:staticmethod:: diff(array $data, array $compare)

    Computes the difference between two arrays::

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

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    This function merges two arrays and pushes the differences in
    data to the bottom of the resultant array.

    **Example 1**
    ::

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

    **Example 2**
    ::

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

.. php:staticmethod:: normalize(array $data, $assoc = true)

    Normalizes an array. If ``$assoc`` is ``true``, the resulting array will be
    normalized to be an associative array. Numeric keys with values, will be
    converted to string keys with null values. Normalizing an array, makes using
    the results with :php:meth:`Hash::merge()` easier::

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

.. php:staticmethod:: nest(array $data, array $options = [])

    Takes a flat array set, and creates a nested, or threaded data structure.

    **Options:**

    - ``children`` The key name to use in the result set for children. Defaults
      to 'children'.
    - ``idPath`` The path to a key that identifies each entry. Should be
      compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.id``
    - ``parentPath`` The path to a key that identifies the parent of each entry.
      Should be compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.parent_id``
    - ``root`` The id of the desired top-most result.

    For example, if you had the following array of data::

        $data = [
            ['ThreadPost' => ['id' => 1, 'parent_id' => null]],
            ['ThreadPost' => ['id' => 2, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 3, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 4, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 5, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 6, 'parent_id' => null]],
            ['ThreadPost' => ['id' => 7, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 8, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 9, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 10, 'parent_id' => 6]]
        ];

        $result = Hash::nest($data, ['root' => 6]);
        /* $result now looks like:
            [
                (int) 0 => [
                    'ThreadPost' => [
                        'id' => (int) 6,
                        'parent_id' => null
                    ],
                    'children' => [
                        (int) 0 => [
                            'ThreadPost' => [
                                'id' => (int) 7,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 1 => [
                            'ThreadPost' => [
                                'id' => (int) 8,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 2 => [
                            'ThreadPost' => [
                                'id' => (int) 9,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 3 => [
                            'ThreadPost' => [
                                'id' => (int) 10,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ]
                    ]
                ]
            ]
            */


.. meta::
    :title lang=en: Hash
    :keywords lang=en: array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
