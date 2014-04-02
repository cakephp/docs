Set
###

.. php:class:: Set

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Set class that allow you
to do just that.

CakePHP's Set class can be called from any model or controller in
the same way Inflector is called. Example: :php:meth:`Set::combine()`.

.. deprecated:: 2.2
    The Set class has been deprecated in 2.2 in favour of the :php:class:`Hash`
    class. It offers a more consistent interface and API.

Set-compatible Path syntax
==========================

The Path syntax is used by (for example) sort, and is used to
define a path.

Usage example (using :php:func:`Set::sort()`)::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff'), 'Friend' => array(array('name' => 'Nate'))),
        1 => array('Person' => array('name' => 'Tracy'),'Friend' => array(array('name' => 'Lindsay'))),
        2 => array('Person' => array('name' => 'Adam'),'Friend' => array(array('name' => 'Bob')))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* result now looks like
     array(
        0 => array('Person' => array('name' => 'Adam'),'Friend' => array(array('name' => 'Bob'))),
        1 => array('Person' => array('name' => 'Jeff'), 'Friend' => array(array('name' => 'Nate'))),
        2 => array('Person' => array('name' => 'Tracy'),'Friend' => array(array('name' => 'Lindsay')))
    );
    */

As you can see in the example above, some things are wrapped in
{}'s, others not. In the table below, you can see which options are
available.

+--------------------------------+--------------------------------------------+
| Expression                     | Definition                                 |
+================================+============================================+
| {n}                            | Represents a numeric key                   |
+--------------------------------+--------------------------------------------+
| {s}                            | Represents a string                        |
+--------------------------------+--------------------------------------------+
| Foo                            | Any string (without enclosing brackets)    |
|                                | is treated like a string literal.          |
+--------------------------------+--------------------------------------------+
| {[a-z]+}                       | Any string enclosed in brackets (besides   |
|                                | {n} and {s}) is interpreted as a regular   |
|                                | expression.                                |
+--------------------------------+--------------------------------------------+

.. todo:

    This section needs to be expanded.

.. php:staticmethod:: apply($path, $array, $callback, $options = array())

    :rtype: mixed

    Apply a callback to the elements of an array extracted
    by a Set::extract compatible path::

        $data = array(
            array('Movie' => array('id' => 1, 'title' => 'movie 3', 'rating' => 5)),
            array('Movie' => array('id' => 1, 'title' => 'movie 1', 'rating' => 1)),
            array('Movie' => array('id' => 1, 'title' => 'movie 2', 'rating' => 3)),
        );

        $result = Set::apply('/Movie/rating', $data, 'array_sum');
        // result equals 9

        $result = Set::apply('/Movie/title', $data, 'strtoupper', array('type' => 'map'));
        // result equals array('MOVIE 3', 'MOVIE 1', 'MOVIE 2')
        // $options are: - type : can be 'pass' uses call_user_func_array(), 'map' uses array_map(), or 'reduce' uses array_reduce()


.. php:staticmethod:: check($data, $path = null)

    :rtype: boolean/array

    Checks if a particular path is set in an array. If $path is empty,
    $data will be returned instead of a boolean value::

        $set = array(
            'My Index 1' => array('First' => 'The first item')
        );
        $result = Set::check($set, 'My Index 1.First');
        // $result == True
        $result = Set::check($set, 'My Index 1');
        // $result == True
        $result = Set::check($set, array());
        // $result == array('My Index 1' => array('First' => 'The first item'))
        $set = array(
            'My Index 1' => array('First' =>
                array('Second' =>
                    array('Third' =>
                        array('Fourth' => 'Heavy. Nesting.'))))
        );
        $result = Set::check($set, 'My Index 1.First.Second');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Second.Third');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == False


.. php:staticmethod:: classicExtract($data, $path = null)

    :rtype: mixed

    Gets a value from an array or object that is contained in a given
    path using an array path syntax, i.e.:

    -  "{n}.Person.{[a-z]+}" - Where "{n}" represents a numeric key,
       "Person" represents a string literal
    -  "{[a-z]+}" (i.e. any string literal enclosed in brackets besides
       {n} and {s}) is interpreted as a regular expression.

    **Example 1**
    ::

        $a = array(
            array('Article' => array('id' => 1, 'title' => 'Article 1')),
            array('Article' => array('id' => 2, 'title' => 'Article 2')),
            array('Article' => array('id' => 3, 'title' => 'Article 3'))
        );
        $result = Set::classicExtract($a, '{n}.Article.id');
        /* $result now looks like:
            Array
            (
                [0] => 1
                [1] => 2
                [2] => 3
            )
        */
        $result = Set::classicExtract($a, '{n}.Article.title');
        /* $result now looks like:
            Array
            (
                [0] => Article 1
                [1] => Article 2
                [2] => Article 3
            )
        */
        $result = Set::classicExtract($a, '1.Article.title');
        // $result == "Article 2"

        $result = Set::classicExtract($a, '3.Article.title');
        // $result == null

    **Example 2**
    ::

        $a = array(
            0 => array('pages' => array('name' => 'page')),
            1 => array('fruites' => array('name' => 'fruit')),
            'test' => array(array('name' => 'jippi')),
            'dot.test' => array(array('name' => 'jippi'))
        );

        $result = Set::classicExtract($a, '{n}.{s}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [0] => page
                    )
                [1] => Array
                    (
                        [0] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a, '{s}.{n}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [0] => jippi
                    )
                [1] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{\w+}.{\w+}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
                [test] => Array
                    (
                        [0] => jippi
                    )
                [dot.test] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{\d+}.{\w+}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a,'{n}.{\w+}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a,'{s}.{\d+}.name');
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [0] => jippi
                    )
                [1] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{s}');
        /* $result now looks like:
            Array
            (

                [0] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
                [1] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */
        $result = Set::classicExtract($a,'{[a-z]}');
        /* $result now looks like:
            Array
            (
                [test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )

                [dot.test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */
        $result = Set::classicExtract($a, '{dot\.test}.{n}');
        /* $result now looks like:
            Array
            (
                [dot.test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */


.. php:staticmethod:: combine($data, $path1 = null, $path2 = null, $groupPath = null)

    :rtype: array

    Creates an associative array using a $path1 as the path to build
    its keys, and optionally $path2 as path to get the values. If
    $path2 is not specified, all values will be initialized to null
    (useful for Set::merge). You can optionally group the values by
    what is obtained when following the path specified in $groupPath.::

        $result = Set::combine(array(), '{n}.User.id', '{n}.User.Data');
        // $result == array();

        $result = Set::combine('', '{n}.User.id', '{n}.User.Data');
        // $result == array();

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
            array(
                'User' => array(
                    'id' => 25,
                    'group_id' => 1,
                    'Data' => array(
                        'user' => 'gwoo',
                        'name' => 'The Gwoo'
                    )
                )
            )
        );
        $result = Set::combine($a, '{n}.User.id');
        /* $result now looks like:
            Array
            (
                [2] =>
                [14] =>
                [25] =>
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existent');
        /* $result now looks like:
            Array
            (
                [2] =>
                [14] =>
                [25] =>
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
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
                [25] => Array
                    (
                        [user] => gwoo
                        [name] => The Gwoo
                    )
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name');
        /* $result now looks like:
            Array
            (
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
                [25] => The Gwoo
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
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
                        [25] => Array
                            (
                                [user] => gwoo
                                [name] => The Gwoo
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

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
        /* $result now looks like:
            Array
            (
                [1] => Array
                    (
                        [2] => Mariano Iglesias
                        [25] => The Gwoo
                    )
                [2] => Array
                    (
                        [14] => Larry E. Masters
                    )
            )
        */

        $result = Set::combine($a, '{n}.User.id', array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.group_id');
        /* $result now looks like:
            Array
            (
                [1] => Array
                    (
                        [2] => mariano.iglesias: Mariano Iglesias
                        [25] => gwoo: The Gwoo
                    )
                [2] => Array
                    (
                        [14] => phpnut: Larry E. Masters
                    )
            )
        */

        $result = Set::combine($a, array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
        /* $result now looks like:
            Array
            (
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
                [gwoo: The Gwoo] => 25
            )
        */

        $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
        /* $result now looks like:
            Array
            (
                [Mariano Iglesias: mariano.iglesias] => 2
                [Larry E. Masters: phpnut] => 14
                [The Gwoo: gwoo] => 25
            )
        */

        $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');

        /* $result now looks like:
            Array
            (
                [mariano.iglesias: 2] => Mariano Iglesias
                [phpnut: 14] => Larry E. Masters
                [gwoo: 25] => The Gwoo
            )
        */

        $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
        /* $result now looks like:
            Array
            (
                [2: mariano.iglesias] => Mariano Iglesias
                [14: phpnut] => Larry E. Masters
                [25: gwoo] => The Gwoo
            )
        */


.. php:staticmethod:: contains($val1, $val2 = null)

    :rtype: boolean

    Determines if one Set or array contains the exact keys and values
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

        $result = Set::contains($a, $a);
        // True
        $result = Set::contains($a, $b);
        // False
        $result = Set::contains($b, $a);
        // True


.. php:staticmethod:: countDim ($array = null, $all = false, $count = 0)

    :rtype: integer

    Counts the dimensions of an array. If $all is set to false (which
    is the default) it will only consider the dimension of the first
    element in the array::

        $data = array('one', '2', 'three');
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3');
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data);
        // $result == 2

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 3

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => '2.1.1.1'))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 4

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 5

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 5

        $set = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($set, false, 0);
        // $result == 2

        $result = Set::countDim($set, true);
        // $result == 5


.. php:staticmethod:: diff($val1, $val2 = null)

    :rtype: array

    Computes the difference between a Set and an array, two Sets, or
    two arrays::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact')
        );

        $result = Set::diff($a, $b);
        /* $result now looks like:
            Array
            (
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */
        $result = Set::diff($a, array());
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
        $result = Set::diff(array(), $b);
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

        $result = Set::diff($a, $b);
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
            )
        */


.. php:staticmethod:: enum($select, $list = null)

    :rtype: string

    The enum method works well when using HTML select elements. It
    returns a value from an array list if the key exists.

    If a comma separated $list is passed arrays are numeric with the
    key of the first being 0 $list = 'no, yes' would translate to $list
    = array(0 => 'no', 1 => 'yes');

    If an array is used, keys can be strings example: array('no' => 0,
    'yes' => 1);

    $list defaults to 0 = no 1 = yes if param is not passed::

        $res = Set::enum(1, 'one, two');
        // $res is 'two'

        $res = Set::enum('no', array('no' => 0, 'yes' => 1));
        // $res is 0

        $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
        // $res is 'one'


.. php:staticmethod:: extract($path, $data = null, $options = array())

    :rtype: mixed

    Set::extract uses basic XPath 2.0 syntax to return subsets of your
    data from a find or a find all. This function allows you to
    retrieve your data quickly without having to loop through multi
    dimensional arrays or traverse through tree structures.

    .. note::

        If ``$path`` does not contain a '/' the call will be delegated to
        :php:meth:`Set::classicExtract()`

    ::

        // Common Usage:
        $users = $this->User->find("all");
        $results = Set::extract('/User/id', $users);
        // results returns:
        // array(1,2,3,4,5,...);

    Currently implemented selectors:

    +------------------------------------------+--------------------------------------------+
    | Selector                                 | Note                                       |
    +==========================================+============================================+
    | /User/id                                 | Similar to the classic {n}.User.id         |
    +------------------------------------------+--------------------------------------------+
    | /User[2]/name                            | Selects the name of the second User        |
    +------------------------------------------+--------------------------------------------+
    | /User[id<2]                              | Selects all Users with an id < 2           |
    +------------------------------------------+--------------------------------------------+
    | /User[id>2][<5]                          | Selects all Users with an id > 2 but 5     |
    +------------------------------------------+--------------------------------------------+
    | /Post/Comment[author\_name=john]/../name | Selects the name of all Posts that have at |
    |                                          | least one Comment written by john          |
    +------------------------------------------+--------------------------------------------+
    | /Posts[title]                            | Selects all Posts that have a 'title' key  |
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[1]                            | Selects the contents of the first comment  |
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[:last]                        | Selects the last comment                   |
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[:first]                       | Selects the first comment                  |
    +------------------------------------------+--------------------------------------------+
    | /Comment[text=/cakephp/i]                | Selects all comments that have a text      |
    |                                          | matching the regex /cakephp/i              |
    +------------------------------------------+--------------------------------------------+
    | /Comment/\@\*                            | Selects the key names of all comments      |
    |                                          | Currently only absolute paths starting with|
    |                                          | a single '/' are supported. Please report  |
    |                                          | any bugs as you find them. Suggestions for |
    |                                          | additional features are welcome.           |
    +------------------------------------------+--------------------------------------------+

    To learn more about Set::extract() refer to the function testExtract()
    in ``/lib/Cake/Test/Case/Utility/SetTest.php``.


.. php:staticmethod:: filter($var)

    :rtype: array

    Filters empty elements out of a route array, excluding '0'::

        $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));

        /* $res now looks like:
            Array (
                [0] => 0
                [2] => 1
                [3] => 0
                [4] => Array
                    (
                        [0] => one thing
                        [1] => I can tell you
                        [2] => is you got to be
                    )
            )
        */


.. php:staticmethod:: flatten($data, $separator = '.')

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
        $res = Set::flatten($arr);
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


.. php:staticmethod:: format($data, $format, $keys)

    :rtype: array

    Returns a series of values extracted from an array, formatted in a
    format string::

        $data = array(
            array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
            array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
            array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}'))
        );

        $res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));
        /*
        Array
        (
            [0] => Abele, Nate
            [1] => Masters, Larry
            [2] => Woodworth, Garrett
        )
        */

        $res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));
        /*
        Array
        (
            [0] => Boston, MA
            [1] => Boondock, TN
            [2] => Venice Beach, CA
        )
        */
        $res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));
        /*
        Array
        (
            [0] => {Boston, MA}
            [1] => {Boondock, TN}
            [2] => {Venice Beach, CA}
        )
        */
        $res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));
        /*
        Array
        (
            [0] => {42, 42}
            [1] => {0, {0}}
            [2] => {0, {1}}
        )
        */
        $res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        )
        */
        $res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        )
        */


.. php:staticmethod:: Set::insert ($list, $path, $data = null)

    :rtype: array

    Inserts $data into an array as defined by $path.::

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Set::insert($a, 'files', array('name' => 'files'));
        /* $result now looks like:
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
        */

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Set::insert($a, 'pages.name', array());
        /* $result now looks like:
            Array
            (
                [pages] => Array
                    (
                        [name] => Array
                            (
                            )
                    )
            )
        */

        $a = array(
            'pages' => array(
                0 => array('name' => 'main'),
                1 => array('name' => 'about')
            )
        );
        $result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));
        /* $result now looks like:
            Array
            (
                [pages] => Array
                    (
                        [0] => Array
                            (
                                [name] => main
                            )
                        [1] => Array
                            (
                                [name] => about
                                [vars] => Array
                                    (
                                        [title] => page title
                                    )
                            )
                    )
            )
        */


.. php:staticmethod:: map($class = 'stdClass', $tmp = 'stdClass')

    :rtype: object

    This method Maps the contents of the Set object to an object
    hierarchy while maintaining numeric keys as arrays of objects.

    Basically, the map function turns array items into initialized
    class objects. By default it turns an array into a stdClass Object,
    however you can map values into any type of class. Example:
    Set::map($array\_of\_values, 'nameOfYourClass');::

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
        $mapped = Set::map($data);

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

    Using Set::map() with a custom class for second parameter:

    ::

        class MyClass {
            public function sayHi() {
                echo 'Hi!';
            }
        }

        $mapped = Set::map($data, 'MyClass');
        //Now you can access all the properties as in the example above,
        //but also you can call MyClass's methods
        $mapped->[0]->sayHi();


.. php:staticmethod:: matches($conditions, $data = array(), $i = null, $length = null)

    :rtype: boolean

    Set::matches can be used to see if a single item or a given xpath
    match certain conditions.::

        $a = array(
            array('Article' => array('id' => 1, 'title' => 'Article 1')),
            array('Article' => array('id' => 2, 'title' => 'Article 2')),
            array('Article' => array('id' => 3, 'title' => 'Article 3'))
        );
        $res = Set::matches(array('id>2'), $a[1]['Article']);
        // returns false
        $res = Set::matches(array('id>=2'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('id>=3'), $a[1]['Article']);
        // returns false
        $res = Set::matches(array('id<=2'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('id<2'), $a[1]['Article']);
        // returns false
        $res = Set::matches(array('id>1'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('3'), null, 3);
        // returns true
        $res = Set::matches(array('5'), null, 5);
        // returns true
        $res = Set::matches(array('id'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('id', 'title'), $a[1]['Article']);
        // returns true
        $res = Set::matches(array('non-existent'), $a[1]['Article']);
        // returns false
        $res = Set::matches('/Article[id=2]', $a);
        // returns true
        $res = Set::matches('/Article[id=4]', $a);
        // returns false
        $res = Set::matches(array(), $a);
        // returns true


.. php:staticmethod:: merge($arr1, $arr2 = null)

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
        $arry3 = array(0 => 'test array', 'cats' => 'dogs', 'people' => 1267);
        $arry4 = array('cats' => 'felines', 'dog' => 'angry');
        $res = Set::merge($arry1, $arry2, $arry3, $arry4);

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


.. php:staticmethod:: nest($data, $options = array())

    :rtype: array

    Takes in a flat array and returns a nested array::

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

        $result = Set::nest($data, array('root' => 6));

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
            ) */


.. php:staticmethod:: normalize($list, $assoc = true, $sep = ',', $trim = true)

    :rtype: array

    Normalizes a string or array list.::

        $a = array(
            'Tree',
            'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')
            )
        );
        $b = array(
            'Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional'
        );
        $result = Set::normalize($a);
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
        $result = Set::normalize($b);
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
        $result = Set::merge($a, $b);
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
        $result = Set::normalize(Set::merge($a, $b)); // Now merge the two and normalize
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

        $data = array('one');
        $res = Set::numeric(array_keys($data));

        // $res is true

        $data = array(1 => 'one');
        $res = Set::numeric($data);

        // $res is false

        $data = array('one');
        $res = Set::numeric($data);

        // $res is false

        $data = array('one' => 'two');
        $res = Set::numeric($data);

        // $res is false

        $data = array('one' => 1);
        $res = Set::numeric($data);

        // $res is true

        $data = array(0);
        $res = Set::numeric($data);

        // $res is true

        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));

        // $res is true

        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));

        // $res is true

        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));

        // $res is true

        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));

        // $res is false


.. php:staticmethod:: pushDiff($array1, $array2)

    :rtype: array

    This function merges two arrays and pushes the differences in
    array2 to the bottom of the resultant array.

    **Example 1**
    ::

        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Set::pushDiff($array1, $array2);

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
        $res = Set::pushDiff($array1, $array2);
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

    Removes an element from a Set or array as defined by $path::

        $a = array(
            'pages' => array('name' => 'page'),
            'files' => array('name' => 'files')
        );

        $result = Set::remove($a, 'files');
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

    Set::reverse is basically the opposite of :php:func:`Set::map`. It converts an
    object into an array. If $object is not an object, reverse will
    simply return $object.::

        $result = Set::reverse(null);
        // Null
        $result = Set::reverse(false);
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
        $map = Set::map($a); // Turn $a into a class object
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

        $result = Set::reverse($map);
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

        $result = Set::reverse($a['Post']); // Just return the array
        /* $result now looks like:
            Array
            (
                [id] => 1
                [title] => First Post
            )
        */


.. php:staticmethod:: sort($data, $path, $dir)

    :rtype: array

    Sorts an array by any value, determined by a Set-compatible path::

        $a = array(
            0 => array('Person' => array('name' => 'Jeff'), 'Friend' => array(array('name' => 'Nate'))),
            1 => array('Person' => array('name' => 'Tracy'),'Friend' => array(array('name' => 'Lindsay'))),
            2 => array('Person' => array('name' => 'Adam'),'Friend' => array(array('name' => 'Bob')))
        );
        $result = Set::sort($a, '{n}.Person.name', 'asc');
        /* $result now looks like:
        array(
            0 => array('Person' => array('name' => 'Adam'),'Friend' => array(array('name' => 'Bob'))),
            1 => array('Person' => array('name' => 'Jeff'), 'Friend' => array(array('name' => 'Nate'))),
            2 => array('Person' => array('name' => 'Tracy'),'Friend' => array(array('name' => 'Lindsay')))
        );
        */

        $result = Set::sort($a, '{n}.Person.name', 'desc');
        /* $result now looks like:
        array(
            2 => array('Person' => array('name' => 'Tracy'),'Friend' => array(array('name' => 'Lindsay')))
            1 => array('Person' => array('name' => 'Jeff'), 'Friend' => array(array('name' => 'Nate'))),
            0 => array('Person' => array('name' => 'Adam'),'Friend' => array(array('name' => 'Bob'))),
        );
        */

.. meta::
    :title lang=en: Set
    :keywords lang=en: array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
