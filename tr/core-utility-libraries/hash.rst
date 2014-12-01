Hash
####

.. php:class:: Hash

.. versionadded:: 2.2

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Hash class that allow you
to do just that.

CakePHP's Hash class can be called from any model or controller in
the same way Inflector is called. Example: :php:meth:`Hash::combine()`.

.. _hash-path-syntax:

Hash path syntax
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

.. versionchanged:: 2.5
    Matcher support was added to ``insert()`` and ``remove()``.

.. php:staticmethod:: get(array $data, $path)

    :rtype: mixed

    ``get()`` is a simplified version of ``extract()``, it only supports direct
    path expressions. Paths with ``{n}``, ``{s}`` or matchers are not
    supported. Use ``get()`` when you want exactly one value out of an array.

.. php:staticmethod:: extract(array $data, $path)

    :rtype: array

    ``Hash::extract()`` supports all expression, and matcher components of
    :ref:`hash-path-syntax`. You can use extract to retrieve data from arrays,
    along arbitrary paths quickly without having to loop through the data
    structures. Instead you use path expressions to qualify which elements you
    want returned ::

        // Common Usage:
        $users = $this->User->find("all");
        $results = Hash::extract($users, '{n}.User.id');
        // $results equals:
        // array(1,2,3,4,5,...);

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    :rtype: array

    Inserts $data into an array as defined by ``$path``::

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Hash::insert($a, 'files', array('name' => 'files'));
        // $result now looks like:
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
            [files] => Array
                (
                    [name] => files
                )
        )

    You can use paths using ``{n}`` and ``{s}`` to insert data into multiple
    points::

        $users = $this->User->find('all');
        $users = Hash::insert($users, '{n}.User.new', 'value');

    .. versionchanged:: 2.5
        As of 2.5.0 attribute matching expressions work with insert().


.. php:staticmethod:: remove(array $data, $path = null)

    :rtype: array

    Removes all elements from an array that match $path.::

        $a = array(
            'pages' => array('name' => 'page'),
            'files' => array('name' => 'files')
        );
        $result = Hash::remove($a, 'files');
        /* $result now looks like:
            Array
            (
                [pages] => Array
                    (
                        [name] => page
                    )

            )
        */

    Using ``{n}`` and ``{s}`` will allow you to remove multiple values at once.

    .. versionchanged:: 2.5
        As of 2.5.0 attribute matching expressions work with remove()

.. php:staticmethod:: combine(array $data, $keyPath = null, $valuePath = null, $groupPath = null)

    :rtype: array

    Creates an associative array using a $keyPath as the path to build its keys,
    and optionally $valuePath as path to get the values. If $valuePath is not
    specified, or doesn't match anything, values will be initialized to null.
    You can optionally group the values by what is obtained when following the
    path specified in $groupPath.::

        $a = array(
            array(
                'User' => array(
                    'id' => 2,
                    'group_id' => 1,
                    'Data' => array(
                        'user' => 'mariano.iglesias',
                        'name' => 'Mariano Iglesias'
                    )
                )
            ),
            array(
                'User' => array(
                    'id' => 14,
                    'group_id' => 2,
                    'Data' => array(
                        'user' => 'phpnut',
                        'name' => 'Larry E. Masters'
                    )
                )
            ),
        );

        $result = Hash::combine($a, '{n}.User.id');
        /* $result now looks like:
            Array
            (
                [2] =>
                [14] =>
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
        /* $result now looks like:
            Array
            (
                [2] => Array
                    (
                        [user] => mariano.iglesias
                        [name] => Mariano Iglesias
                    )
                [14] => Array
                    (
                        [user] => phpnut
                        [name] => Larry E. Masters
                    )
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name');
        /* $result now looks like:
            Array
            (
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
        /* $result now looks like:
            Array
            (
                [1] => Array
                    (
                        [2] => Array
                            (
                                [user] => mariano.iglesias
                                [name] => Mariano Iglesias
                            )
                    )
                [2] => Array
                    (
                        [14] => Array
                            (
                                [user] => phpnut
                                [name] => Larry E. Masters
                            )
                    )
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
        /* $result now looks like:
            Array
            (
                [1] => Array
                    (
                        [2] => Mariano Iglesias
                    )
                [2] => Array
                    (
                        [14] => Larry E. Masters
                    )
            )
        */

    You can provide array's for both $keyPath and $valuePath. If you do this,
    the first value will be used as a format string, for values extracted by the
    other paths::

        $result = Hash::combine(
            $a,
            '{n}.User.id',
            array('%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'),
            '{n}.User.group_id'
        );
        /* $result now looks like:
            Array
            (
                [1] => Array
                    (
                        [2] => mariano.iglesias: Mariano Iglesias
                    )
                [2] => Array
                    (
                        [14] => phpnut: Larry E. Masters
                    )
            )
        */

        $result = Hash::combine(
            $a,
            array('%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'),
            '{n}.User.id'
        );
        /* $result now looks like:
            Array
            (
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
            )
        */

.. php:staticmethod:: format(array $data, array $paths, $format)

    :rtype: array

    Returns a series of values extracted from an array, formatted with a
    format string::

        $data = array(
            array(
                'Person' => array(
                    'first_name' => 'Nate',
                    'last_name' => 'Abele',
                    'city' => 'Boston',
                    'state' => 'MA',
                    'something' => '42'
                )
            ),
            array(
                'Person' => array(
                    'first_name' => 'Larry',
                    'last_name' => 'Masters',
                    'city' => 'Boondock',
                    'state' => 'TN',
                    'something' => '{0}'
                )
            ),
            array(
                'Person' => array(
                    'first_name' => 'Garrett',
                    'last_name' => 'Woodworth',
                    'city' => 'Venice Beach',
                    'state' => 'CA',
                    'something' => '{1}'
                )
            )
        );

        $res = Hash::format($data, array('{n}.Person.first_name', '{n}.Person.something'), '%2$d, %1$s');
        /*
        Array
        (
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        )
        */

        $res = Hash::format($data, array('{n}.Person.first_name', '{n}.Person.something'), '%1$s, %2$d');
        /*
        Array
        (
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        )
        */

.. php:staticmethod:: contains(array $data, array $needle)

    :rtype: boolean

    Determines if one Hash or array contains the exact keys and values
    of another::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact'),
            'a' => 'b'
        );

        $result = Hash::contains($a, $a);
        // true
        $result = Hash::contains($a, $b);
        // false
        $result = Hash::contains($b, $a);
        // true

.. php:staticmethod:: check(array $data, string $path = null)

    :rtype: boolean

    Checks if a particular path is set in an array::

        $set = array(
            'My Index 1' => array('First' => 'The first item')
        );
        $result = Hash::check($set, 'My Index 1.First');
        // $result == True

        $result = Hash::check($set, 'My Index 1');
        // $result == True

        $set = array(
            'My Index 1' => array('First' =>
                array('Second' =>
                    array('Third' =>
                        array('Fourth' => 'Heavy. Nesting.'))))
        );
        $result = Hash::check($set, 'My Index 1.First.Second');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == False

.. php:staticmethod:: filter(array $data, $callback = array('Hash', 'filter'))

    :rtype: array

    Filters empty elements out of array, excluding '0'. You can also supply a
    custom $callback to filter the array elements. You callback should return
    ``false`` to remove elements from the resulting array::

        $data = array(
            '0',
            false,
            true,
            0,
            array('one thing', 'I can tell you', 'is you got to be', false)
        );
        $res = Hash::filter($data);

        /* $data now looks like:
            Array (
                [0] => 0
                [2] => true
                [3] => 0
                [4] => Array
                    (
                        [0] => one thing
                        [1] => I can tell you
                        [2] => is you got to be
                    )
            )
        */

.. php:staticmethod:: flatten(array $data, string $separator = '.')

    :rtype: array

    Collapses a multi-dimensional array into a single dimension::

        $arr = array(
            array(
                'Post' => array('id' => '1', 'title' => 'First Post'),
                'Author' => array('id' => '1', 'user' => 'Kyle'),
            ),
            array(
                'Post' => array('id' => '2', 'title' => 'Second Post'),
                'Author' => array('id' => '3', 'user' => 'Crystal'),
            ),
        );
        $res = Hash::flatten($arr);
        /* $res now looks like:
            Array (
                [0.Post.id] => 1
                [0.Post.title] => First Post
                [0.Author.id] => 1
                [0.Author.user] => Kyle
                [1.Post.id] => 2
                [1.Post.title] => Second Post
                [1.Author.id] => 3
                [1.Author.user] => Crystal
            )
        */

.. php:staticmethod:: expand(array $data, string $separator = '.')

    :rtype: array

    Expands an array that was previously flattened with
    :php:meth:`Hash::flatten()`::

        $data = array(
            '0.Post.id' => 1,
            '0.Post.title' => First Post,
            '0.Author.id' => 1,
            '0.Author.user' => Kyle,
            '1.Post.id' => 2,
            '1.Post.title' => Second Post,
            '1.Author.id' => 3,
            '1.Author.user' => Crystal,
        );
        $res = Hash::expand($data);
        /* $res now looks like:
        array(
            array(
                'Post' => array('id' => '1', 'title' => 'First Post'),
                'Author' => array('id' => '1', 'user' => 'Kyle'),
            ),
            array(
                'Post' => array('id' => '2', 'title' => 'Second Post'),
                'Author' => array('id' => '3', 'user' => 'Crystal'),
            ),
        );
        */

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    :rtype: array

    This function can be thought of as a hybrid between PHP's
    ``array_merge`` and ``array_merge_recursive``. The difference to the two
    is that if an array key contains another array then the function
    behaves recursive (unlike ``array_merge``) but does not do if for keys
    containing strings (unlike ``array_merge_recursive``).

    .. note::

        This function will work with an unlimited amount of arguments and
        typecasts non-array parameters into arrays.

    ::

        $array = array(
            array(
                'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
                'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
                'description' => 'Importing an sql dump'
            ),
            array(
                'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
                'name' => 'pbpaste | grep -i Unpaid | pbcopy',
                'description' => 'Remove all lines that say "Unpaid".',
            )
        );
        $arrayB = 4;
        $arrayC = array(0 => "test array", "cats" => "dogs", "people" => 1267);
        $arrayD = array("cats" => "felines", "dog" => "angry");
        $res = Hash::merge($array, $arrayB, $arrayC, $arrayD);

        /* $res now looks like:
        Array
        (
            [0] => Array
                (
                    [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                    [name] => mysql raleigh-workshop-08 < 2008-09-05.sql
                    [description] => Importing an sql dump
                )
            [1] => Array
                (
                    [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                    [name] => pbpaste | grep -i Unpaid | pbcopy
                    [description] => Remove all lines that say "Unpaid".
                )
            [2] => 4
            [3] => test array
            [cats] => felines
            [people] => 1267
            [dog] => angry
        )
        */

.. php:staticmethod:: numeric(array $data)

    :rtype: boolean

    Checks to see if all the values in the array are numeric::

        $data = array('one');
        $res = Hash::numeric(array_keys($data));
        // $res is true

        $data = array(1 => 'one');
        $res = Hash::numeric($data);
        // $res is false

.. php:staticmethod:: dimensions (array $data)

    :rtype: integer

    Counts the dimensions of an array. This method will only
    consider the dimension of the first element in the array::

        $data = array('one', '2', 'three');
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3');
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data);
        // $result == 2

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::dimensions($data);
        // $result == 2

.. php:staticmethod:: maxDimensions(array $data)

    Similar to :php:meth:`~Hash::dimensions()`, however this method returns,
    the deepest number of dimensions of any element in the array::

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::maxDimensions($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::maxDimensions($data, true);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    Creates a new array, by extracting $path, and mapping $function
    across the results. You can use both expression and matching elements with
    this method::

        //call the noop function $this->noop() on every element of $data
        $result = Hash::map($data, "{n}", array($this, 'noop'));

        function noop($array) {
         //do stuff to array and return the result
         return $array;
        }

.. php:staticmethod:: reduce(array $data, $path, $function)

    Creates a single value, by extracting $path, and reducing the extracted
    results with $function. You can use both expression and matching elements
    with this method.

.. php:staticmethod:: apply(array $data, $path, $function)

    Apply a callback to a set of extracted values using $function. The function
    will get the extracted values as the first argument.

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    :rtype: array

    Sorts an array by any value, determined by a :ref:`hash-path-syntax`
    Only expression elements are supported by this method::

        $a = array(
            0 => array('Person' => array('name' => 'Jeff')),
            1 => array('Shirt' => array('color' => 'black'))
        );
        $result = Hash::sort($a, '{n}.Person.name', 'asc');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [Shirt] => Array
                            (
                                [color] => black
                            )
                    )
                [1] => Array
                    (
                        [Person] => Array
                            (
                                [name] => Jeff
                            )
                    )
            )
        */

    ``$dir`` can be either ``asc`` or ``desc``. ``$type``
    can be one of the following values:

    * ``regular`` for regular sorting.
    * ``numeric`` for sorting values as their numeric equivalents.
    * ``string`` for sorting values as their string value.
    * ``natural`` for sorting values in a human friendly way. Will
      sort ``foo10`` below ``foo2`` as an example. Natural sorting
      requires PHP 5.4 or greater.

.. php:staticmethod:: diff(array $data, array $compare)

    :rtype: array

    Computes the difference between two arrays::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact')
        );

        $result = Hash::diff($a, $b);
        /* $result now looks like:
            Array
            (
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    :rtype: array

    This function merges two arrays and pushes the differences in
    data to the bottom of the resultant array.

    **Example 1**
    ::

        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Hash::mergeDiff($array1, $array2);

        /* $res now looks like:
            Array
            (
                [ModelOne] => Array
                    (
                        [id] => 1001
                        [field_one] => a1.m1.f1
                        [field_two] => a1.m1.f2
                        [field_three] => a3.m1.f3
                    )
            )
        */

    **Example 2**
    ::

        $array1 = array("a" => "b", 1 => 20938, "c" => "string");
        $array2 = array("b" => "b", 3 => 238, "c" => "string", array("extra_field"));
        $res = Hash::mergeDiff($array1, $array2);
        /* $res now looks like:
            Array
            (
                [a] => b
                [1] => 20938
                [c] => string
                [b] => b
                [3] => 238
                [4] => Array
                    (
                        [0] => extra_field
                    )
            )
        */

.. php:staticmethod:: normalize(array $data, $assoc = true)

    :rtype: array

    Normalizes an array. If ``$assoc`` is true, the resulting array will be
    normalized to be an associative array. Numeric keys with values, will be
    converted to string keys with null values. Normalizing an array, makes using
    the results with :php:meth:`Hash::merge()` easier::

        $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id')
            )
        );
        $result = Hash::normalize($a);
        /* $result now looks like:
            Array
            (
                [Tree] => null
                [CounterCache] => null
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                            )
                    )
            )
        */

        $b = array(
            'Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional'
        );
        $result = Hash::normalize($b);
        /* $result now looks like:
            Array
            (
                [Cacheable] => Array
                    (
                        [enabled] => false
                    )

                [Limit] => null
                [Bindable] => null
                [Validator] => null
                [Transactional] => null
            )
        */

.. php:staticmethod:: nest(array $data, array $options = array())

    Takes a flat array set, and creates a nested, or threaded data structure.
    Used by methods like ``Model::find('threaded')``.

    **Options:**

    - ``children`` The key name to use in the result set for children. Defaults
      to 'children'.
    - ``idPath`` The path to a key that identifies each entry. Should be
      compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.id``
    - ``parentPath`` The path to a key that identifies the parent of each entry.
      Should be compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.parent_id``
    - ``root`` The id of the desired top-most result.

    Example::

        $data = array(
            array('ModelName' => array('id' => 1, 'parent_id' => null)),
            array('ModelName' => array('id' => 2, 'parent_id' => 1)),
            array('ModelName' => array('id' => 3, 'parent_id' => 1)),
            array('ModelName' => array('id' => 4, 'parent_id' => 1)),
            array('ModelName' => array('id' => 5, 'parent_id' => 1)),
            array('ModelName' => array('id' => 6, 'parent_id' => null)),
            array('ModelName' => array('id' => 7, 'parent_id' => 6)),
            array('ModelName' => array('id' => 8, 'parent_id' => 6)),
            array('ModelName' => array('id' => 9, 'parent_id' => 6)),
            array('ModelName' => array('id' => 10, 'parent_id' => 6))
        );

        $result = Hash::nest($data, array('root' => 6));
        /* $result now looks like:
        array(
                (int) 0 => array(
                    'ModelName' => array(
                        'id' => (int) 6,
                        'parent_id' => null
                    ),
                    'children' => array(
                        (int) 0 => array(
                            'ModelName' => array(
                                'id' => (int) 7,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 1 => array(
                            'ModelName' => array(
                                'id' => (int) 8,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 2 => array(
                            'ModelName' => array(
                                'id' => (int) 9,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 3 => array(
                            'ModelName' => array(
                                'id' => (int) 10,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        )
                    )
                )
            )
            */


.. meta::
    :title lang=en: Hash
    :keywords lang=en: array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
