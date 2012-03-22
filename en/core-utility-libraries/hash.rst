Hash
###

.. php:class:: Hash

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
parts of the path syntax are available in all methods.  A path expression is
made of any number of tokens.  Tokens are composed of two groups.  Expresssions,
are used to traverse the array data, while matchers are used to qualify
elements.  You apply matchers to expression elements.

+--------------------------------+--------------------------------------------+
| Expression                     | Definition                                 |
+================================+============================================+
| ``{n}``                        | Represents a numeric key.  Will match      |
|                                | any string or numeric key.                 |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | Represents a string.  Will match any       |
|                                | any string value including numeric string  |
|                                | values.                                    |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | Matches keys with the exact same value.    |
+--------------------------------+--------------------------------------------+

All expression elements are supported all methods.  In addition to expression
elements you can use attribute matching with methods like ``extract()``.

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

.. php:staticmethod:: get(array $data, $path)

    :rtype: mixed

    ``get()`` is a simplified version of ``extract()``, it only supports direct
    path expressions.  Paths with ``{n}``, ``{s}`` or matchers are not
    supported.  Use ``get()`` when you want exactly one value out of an array.

.. php:staticmethod:: extract(array $data, $path)

    :rtype: array

    ``Hash::extract()`` supports all expression, and matcher components of
    :ref:`hash-path-syntax`. You can use extract to retrieve data from arrays,
    along arbitrary paths quickly without having to loop through the data
    structures.  Instead you use path expressions to qualify which elements you
    want returned ::

        <?php
        // Common Usage:
        $users = $this->User->find("all");
        $results = Hash::extract('{n}.User.id', $users);
        // results returns:
        // array(1,2,3,4,5,...);

.. php:staticmethod:: Hash::insert($data, $path, $values = null)

    :rtype: array

    Inserts $data into an array as defined by $path. This method only supports
    the expression types of :ref:`hash-path-syntax`::

        <?php
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
        $users = Set::insert($users, '{n}.User.new', 'value');

.. php:staticmethod:: remove($data, $path = null)

    :rtype: array

    Removes all elements from an array that match $path. This method supports
    all the expression elements of :ref:`hash-path-syntax`::

        <?php
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

.. php:staticmethod:: combine($data, $keyPath = null, $valuePath = null, $groupPath = null)

    :rtype: array

    Creates an associative array using a $keyPath as the path to build its keys,
    and optionally $valuePath as path to get the values. If $valuePath is not
    specified, or doesn't match anything, values will be initialized to null.
    You can optionally group the values by what is obtained when following the
    path specified in $groupPath.::

        <?php
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

    You can provide array's for both $keyPath and $valuePath.  If you do this,
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

.. php:staticmethod:: format($data, $format, $keys)

    :rtype: array

    Returns a series of values extracted from an array, formatted with a
    format string::

        <?php
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

        $res = Hash::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        )
        */

        $res = Hash::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        )
        */

.. php:staticmethod:: contains($val1, $val2 = null)

    :rtype: boolean

    Determines if one Hash or array contains the exact keys and values
    of another::

        <?php
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

.. php:staticmethod:: check($data, $path = null)

    :rtype: boolean

    Checks if a particular path is set in an array::

        <?php
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

.. php:staticmethod:: filter($var, $callback = array('Hash', 'filter'))

    :rtype: array

    Filters empty elements out of array, excluding '0'. You can also supply a
    custom $callback to filter the array elements.  You callback should return
    ``false`` to remove elements from the resulting array.::

        <?php
        $data = array(
            '0',
            false,
            true,
            0,
            array('one thing', 'I can tell you', 'is you got to be', false)
        );
        $res = Hash::filter();

        /* $res now looks like:
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

.. todo::

    Continue here.

.. php:staticmethod:: dimensions ($array = null)

    :rtype: integer

    Counts the dimensions of an array. This method will only 
    consider the dimension of the first element in the array::

        <?php
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
        $result = Hash::countDim($data);
        // $result == 2

.. php:staticmethod:: maxDimensions(array $data)

    Similar to :php:meth:`~Hash::dimensions()`, however this method returns,
    the deepest number of dimensions of any element in the array::

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::countDim($data, true);
        // $result == 3

.. php:staticmethod:: diff(array $val1, array $val2)

    :rtype: array

    Computes the difference between two arrays::

        <?php
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
        $result = Hash::diff($a, array());
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
                [1] => Array
                    (
                        [name] => about
                    )
            )
        */
        $result = Hash::diff(array(), $b);
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
                [1] => Array
                    (
                        [name] => about
                    )
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */

        $b = array(
            0 => array('name' => 'me'),
            1 => array('name' => 'about')
        );

        $result = Hash::diff($a, $b);
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
            )
        */





.. php:staticmethod:: flatten($data, $separator='.')

    :rtype: array

    Collapses a multi-dimensional array into a single dimension::

        <?php
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






.. php:staticmethod:: map($class = 'stdClass', $tmp = 'stdClass')

    :rtype: object

    This method Maps the contents of the Hash object to an object
    hierarchy while maintaining numeric keys as arrays of objects.

    Basically, the map function turns array items into initialized
    class objects. By default it turns an array into a stdClass Object,
    however you can map values into any type of class. Example:
    Hash::map($array\_of\_values, 'nameOfYourClass');::

        <?php
        $data = array(
            array(
                "IndexedPage" => array(
                    "id" => 1,
                    "url" => 'http://blah.com/',
                    'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                    'get_vars' => '',
                    'redirect' => '',
                    'created' => "1195055503",
                    'updated' => "1195055503",
                )
            ),
            array(
                "IndexedPage" => array(
                    "id" => 2,
                    "url" => 'http://blah.com/',
                    'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                    'get_vars' => '',
                    'redirect' => '',
                    'created' => "1195055503",
                    'updated' => "1195055503",
                ),
            )
        );
        $mapped = Hash::map($data);

        /* $mapped now looks like:

            Array
            (
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

            )

        */

    Using Hash::map() with a custom class for second parameter:

    ::

        class MyClass {
            public function sayHi() {
                echo 'Hi!';
            }
        }

        $mapped = Hash::map($data, 'MyClass');
        //Now you can access all the properties as in the example above,
        //but also you can call MyClass's methods
        $mapped->[0]->sayHi();


.. php:staticmethod:: matches($conditions, $data=array(), $i = null, $length=null)

    :rtype: boolean

    Hash::matches can be used to see if a single item or a given xpath
    match certain conditions.::

        <?php
        $a = array(
            array('Article' => array('id' => 1, 'title' => 'Article 1')),
            array('Article' => array('id' => 2, 'title' => 'Article 2')),
            array('Article' => array('id' => 3, 'title' => 'Article 3')));
        $res=Hash::matches(array('id>2'), $a[1]['Article']);
        // returns false
        $res=Hash::matches(array('id>=2'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('id>=3'), $a[1]['Article']);
        // returns false
        $res=Hash::matches(array('id<=2'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('id<2'), $a[1]['Article']);
        // returns false
        $res=Hash::matches(array('id>1'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('3'), null, 3);
        // returns true
        $res=Hash::matches(array('5'), null, 5);
        // returns true
        $res=Hash::matches(array('id'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('id', 'title'), $a[1]['Article']);
        // returns true
        $res=Hash::matches(array('non-existent'), $a[1]['Article']);
        // returns false
        $res=Hash::matches('/Article[id=2]', $a);
        // returns true
        $res=Hash::matches('/Article[id=4]', $a);
        // returns false
        $res=Hash::matches(array(), $a);
        // returns true


.. php:staticmethod:: merge($arr1, $arr2=null)

    :rtype: array

    This function can be thought of as a hybrid between PHP's
    array\_merge and array\_merge\_recursive. The difference to the two
    is that if an array key contains another array then the function
    behaves recursive (unlike array\_merge) but does not do if for keys
    containing strings (unlike array\_merge\_recursive). See the unit
    test for more information.

    .. note::

        This function will work with an unlimited amount of arguments and
        typecasts non-array parameters into arrays.

    ::

        <?php
        $arry1 = array(
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
        $arry2 = 4;
        $arry3 = array(0 => "test array", "cats" => "dogs", "people" => 1267);
        $arry4 = array("cats" => "felines", "dog" => "angry");
        $res = Hash::merge($arry1, $arry2, $arry3, $arry4);

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


.. php:staticmethod:: normalize($list, $assoc = true, $sep = ',', $trim = true)

    :rtype: array

    Normalizes a string or array list.::

        <?php
        $a = array('Tree', 'CounterCache',
                'Upload' => array(
                    'folder' => 'products',
                    'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')));
        $b =  array('Cacheable' => array('enabled' => false),
                'Limit',
                'Bindable',
                'Validator',
                'Transactional');
        $result = Hash::normalize($a);
        /* $result now looks like:
            Array
            (
                [Tree] =>
                [CounterCache] =>
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )
                    )
            )
        */
        $result = Hash::normalize($b);
        /* $result now looks like:
            Array
            (
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )

                [Limit] =>
                [Bindable] =>
                [Validator] =>
                [Transactional] =>
            )
        */
        $result = Hash::merge($a, $b); // Now merge the two and normalize
        /* $result now looks like:
            Array
            (
                [0] => Tree
                [1] => CounterCache
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )

                    )
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )
                [2] => Limit
                [3] => Bindable
                [4] => Validator
                [5] => Transactional
            )
        */
        $result = Hash::normalize(Hash::merge($a, $b));
        /* $result now looks like:
            Array
            (
                [Tree] =>
                [CounterCache] =>
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )

                    )
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )
                [Limit] =>
                [Bindable] =>
                [Validator] =>
                [Transactional] =>
            )
        */


.. php:staticmethod:: numeric($array=null)

    :rtype: boolean

    Checks to see if all the values in the array are numeric::

        <?php
        $data = array('one');
        $res = Hash::numeric(array_keys($data));

        // $res is true

        $data = array(1 => 'one');
        $res = Hash::numeric($data);

        // $res is false

        $data = array('one');
        $res = Hash::numeric($data);

        // $res is false

        $data = array('one' => 'two');
        $res = Hash::numeric($data);

        // $res is false

        $data = array('one' => 1);
        $res = Hash::numeric($data);

        // $res is true

        $data = array(0);
        $res = Hash::numeric($data);

        // $res is true

        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Hash::numeric(array_keys($data));

        // $res is true

        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Hash::numeric(array_keys($data));

        // $res is true

        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Hash::numeric(array_keys($data));

        // $res is true

        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Hash::numeric(array_keys($data));

        // $res is false


.. php:staticmethod:: pushDiff($array1, $array2)

    :rtype: array

    This function merges two arrays and pushes the differences in
    array2 to the bottom of the resultant array.

    **Example 1**
    ::

        <?php
        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Hash::pushDiff($array1, $array2);

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

        <?php
        $array1 = array("a" => "b", 1 => 20938, "c" => "string");
        $array2 = array("b" => "b", 3 => 238, "c" => "string", array("extra_field"));
        $res = Hash::pushDiff($array1, $array2);
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


.. php:staticmethod:: remove($list, $path = null)

    :rtype: array

    Removes an element from a Hash or array as defined by $path::

        <?php
        $a = array(
            'pages'     => array('name' => 'page'),
            'files'     => array('name' => 'files')
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


.. php:staticmethod:: reverse($object)

    :rtype: array

    Hash::reverse is basically the opposite of :php:func:`Hash::map`. It converts an
    object into an array. If $object is not an object, reverse will
    simply return $object.::

        <?php
        $result = Hash::reverse(null);
        // Null
        $result = Hash::reverse(false);
        // false
        $a = array(
            'Post' => array('id' => 1, 'title' => 'First Post'),
            'Comment' => array(
                array('id' => 1, 'title' => 'First Comment'),
                array('id' => 2, 'title' => 'Second Comment')
            ),
            'Tag' => array(
                array('id' => 1, 'title' => 'First Tag'),
                array('id' => 2, 'title' => 'Second Tag')
            ),
        );
        $map = Hash::map($a); // Turn $a into a class object
        /* $map now looks like:
            stdClass Object
            (
                [_name_] => Post
                [id] => 1
                [title] => First Post
                [Comment] => Array
                    (
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
                    )
                [Tag] => Array
                    (
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
                    )
            )
        */

        $result = Hash::reverse($map);
        /* $result now looks like:
            Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First Post
                        [Comment] => Array
                            (
                                [0] => Array
                                    (
                                        [id] => 1
                                        [title] => First Comment
                                    )
                                [1] => Array
                                    (
                                        [id] => 2
                                        [title] => Second Comment
                                    )
                            )
                        [Tag] => Array
                            (
                                [0] => Array
                                    (
                                        [id] => 1
                                        [title] => First Tag
                                    )
                                [1] => Array
                                    (
                                        [id] => 2
                                        [title] => Second Tag
                                    )
                            )
                    )
            )
        */

        $result = Hash::reverse($a['Post']); // Just return the array
        /* $result now looks like:
            Array
            (
                [id] => 1
                [title] => First Post
            )
        */


.. php:staticmethod:: sort($data, $path, $dir)

    :rtype: array

    Sorts an array by any value, determined by a Hash-compatible path::

        <?php
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

        $result = Hash::sort($a, '{n}.Shirt', 'asc');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [Person] => Array
                            (
                                [name] => Jeff
                            )
                    )
                [1] => Array
                    (
                        [Shirt] => Array
                            (
                                [color] => black
                            )
                    )
            )
        */

        $result = Hash::sort($a, '{n}', 'desc');
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

        $a = array(
            array(7,6,4),
            array(3,4,5),
            array(3,2,1),
        );

.. php:staticmethod:: apply($path, $array, $callback, $options = array())

		    :rtype: mixed

		    Apply a callback to the elements of an array extracted
		    by a Hash::extract compatible path::

		        <?php
		        $data = array(
		            array('Movie' => array('id' => 1, 'title' => 'movie 3', 'rating' => 5)),
		            array('Movie' => array('id' => 1, 'title' => 'movie 1', 'rating' => 1)),
		            array('Movie' => array('id' => 1, 'title' => 'movie 2', 'rating' => 3)),
		        );

		        $result = Hash::apply('/Movie/rating', $data, 'array_sum');
		        // result equals 9

		        $result = Hash::apply('/Movie/title', $data, 'strtoupper', array('type' => 'map'));
		        // result equals array('MOVIE 3', 'MOVIE 1', 'MOVIE 2')
		        // $options are: - type : can be 'pass' uses call_user_func_array(), 'map' uses array_map(), or 'reduce' uses array_reduce()

.. php:staticmethod:: nest($data, $options = array())

		    :rtype: array

		    Takes in a flat array and returns a nested array::

		        <?php
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
