Hash
####

.. php:class:: Hash

.. versionadded:: 2.2

配列マネジメントはとても強力かつ便利なツールであり、適切に使いさえすれば、よりスマートでより最適化されたコードを書くことができるようになるものです。
CakePHP ではとても便利なユーティリティ群を Hash クラスの中に static で用意しており、まさにこれをするのに使えます。

..
  Array management, if done right, can be a very powerful and useful
  tool for building smarter, more optimized code. CakePHP offers a
  very useful set of static utilities in the Hash class that allow you
  to do just that.

CakePHP の Hash クラスは Inflector クラスと同様で、どのモデルやコントローラからでも呼ぶことができます。 例: :php:meth:`Hash::combine()`。

..
  CakePHP's Hash class can be called from any model or controller in
  the same way Inflector is called. Example: :php:meth:`Hash::combine()`.

.. _hash-path-syntax:

Hash パス構文
=================

..
  Hash path syntax

下記のパス構文は ``Hash`` が持つすべてのメソッドで使われるものです。
ただし、すべてのパス構文が、すべてのメソッドで使用可能であるとは限りません。
パスの式はいくつものトークンで構成されます。
トークンは、配列データの移動に使う『式』と、要素を絞り込む『マッチャ』の２つのグループに大きく分けられます。
マッチャは要素の式に対して適用することができます。

..
  The path syntax described below is used by all the methods in ``Hash``. Not all
  parts of the path syntax are available in all methods.  A path expression is
  made of any number of tokens.  Tokens are composed of two groups.  Expressions,
  are used to traverse the array data, while matchers are used to qualify
  elements.  You apply matchers to expression elements.

+--------------------------------+--------------------------------------------+
| 式                             | 説明                                       |
+================================+============================================+
| ``{n}``                        | 数値キーを意味する。どんな文字列キーでも   |
|                                | 数値型のキーでも一致する。                 |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | 文字列キーを意味する。数値文字列を含め、   |
|                                | どんな文字列でも一致する。                 |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | 完全に同じ値だった場合のみ一致する。       |
+--------------------------------+--------------------------------------------+

..
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

要素の式はいずれも、すべてのメソッドで使うことができます。要素の式に加え、 ``extract()`` のようなメソッドで属性で絞り込むこともできます。

..
  All expression elements are supported all methods.  In addition to expression
  elements you can use attribute matching with methods like ``extract()``.

+--------------------------------+--------------------------------------------+
| マッチャ                       | 説明                                       |
+================================+============================================+
| ``[id]``                       | 記述されたキーと一致する要素に絞り込む。   |
+--------------------------------+--------------------------------------------+
| ``[id=2]``                     | id が 2 となっている要素に絞り込む。       |
+--------------------------------+--------------------------------------------+
| ``[id!=2]``                    | id が 2 ではない要素に絞り込む。           |
+--------------------------------+--------------------------------------------+
| ``[id>2]``                     | id が 2 より大きい要素に絞り込む。         |
+--------------------------------+--------------------------------------------+
| ``[id>=2]``                    | id が 2 以上の要素に絞り込む。             |
+--------------------------------+--------------------------------------------+
| ``[id<2]``                     | id が 2 より小さい要素に絞り込む。         |
+--------------------------------+--------------------------------------------+
| ``[id<=2]``                    | id が 2 以下の要素に絞り込む。             |
+--------------------------------+--------------------------------------------+
| ``[text=/.../]``               | 正規表現 ``...`` と合致する値を持っている  |
|                                | 要素に絞り込む。                           |
+--------------------------------+--------------------------------------------+

..
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

    ``get()`` は ``extract()`` のシンプル版で、直接的に指定するパス式のみがサポートされます。 
    ``{n}`` や ``{s}`` 、マッチャを使ったパスはサポートされません。
    配列から１つの値だけを取り出したい場合に ``get()`` を使ってください。

..
  ``get()`` is a simplified version of ``extract()``, it only supports direct
  path expressions.  Paths with ``{n}``, ``{s}`` or matchers are not
  supported.  Use ``get()`` when you want exactly one value out of an array.

.. php:staticmethod:: extract(array $data, $path)

    :rtype: array

    ``Hash::extract()`` は :ref:`hash-path-syntax` にあるすべての式とマッチャをサポートします。
    extract を使うことで、配列から好きなパスに沿ったデータを手早く取り出すことができます。もはやデータ構造をループする必要はありません。
    その代わりに欲しい要素を絞り込むパス式を使うのです::

        // 共通の使い方:
        $users = $this->user->find("all");
        $results = hash::extract($users, '{n}.user.id');
        // $results は以下のとおり:
        // array(1,2,3,4,5,...);

..
  ``Hash::extract()`` supports all expression, and matcher components of
  :ref:`hash-path-syntax`. You can use extract to retrieve data from arrays,
  along arbitrary paths quickly without having to loop through the data
  structures.  Instead you use path expressions to qualify which elements you
  want returned ::

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    :rtype: array

    $data を $path の定義に従って配列の中に挿入します。このメソッドは :ref:`hash-path-syntax` にある『式』タイプだけをサポートします::

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Hash::insert($a, 'files', array('name' => 'files'));
        // $result は以下のようになります:
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

    
    ``{n}`` や ``{s}`` を使ったパスを使うことで、複数のポイントにデータを挿入することができます::

        $users = $this->User->find('all');
        $users = Hash::insert($users, '{n}.User.new', 'value');

..
  Inserts $data into an array as defined by $path. This method only supports
  the expression types of :ref:`hash-path-syntax`::

..
  You can use paths using ``{n}`` and ``{s}`` to insert data into multiple
  points::

.. php:staticmethod:: remove(array $data, $path = null)

    :rtype: array

    $path に合致するすべての要素を配列から削除します。
    このメソッドは :ref:`hash-path-syntax` にあるすべての式をサポートします::

        $a = array(
            'pages' => array('name' => 'page'),
            'files' => array('name' => 'files')
        );
        $result = Hash::remove($a, 'files');
        /* $result は以下のようになります:
            Array
            (
                [pages] => Array
                    (
                        [name] => page
                    )

            )
        */

    ``{n}`` や ``{s}`` を使うことで、複数の値を一度に削除することができます。

..
    Removes all elements from an array that match $path. This method supports
    all the expression elements of :ref:`hash-path-syntax`::

..
    Using ``{n}`` and ``{s}`` will allow you to remove multiple values at once.

.. php:staticmethod:: combine(array $data, $keyPath = null, $valuePath = null, $groupPath = null)

    :rtype: array

    $keyPath のパスをキー、$valuePath （省略可） のパスを値として使って連想配列を作ります。
    $valuePath が省略された場合や、$valuePath に合致するものが無かった場合は、値は null で初期化されます。
    $groupPath が指定された場合は、そのパスにしたがって生成したものをグルーピングします::

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
        /* $result は以下のようになります:
            Array
            (
                [2] =>
                [14] =>
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
        /* $result は以下のようになります:
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
        /* $result は以下のようになります:
            Array
            (
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
        /* $result は以下のようになります:
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
        /* $result は以下のようになります:
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

    $keyPath と $valuePath の両方とも、配列を指定することができます。
    その場合は、配列の１要素目はフォーマット文字列とみなされ、２要素目以降のパスで取得された値のために使われます::

        $result = Hash::combine(
            $a,
            '{n}.User.id',
            array('%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'),
            '{n}.User.group_id'
        );
        /* $result は以下のようになります:
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
        /* $result は以下のようになります:
            Array
            (
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
            )
        */

..
    Creates an associative array using a $keyPath as the path to build its keys,
    and optionally $valuePath as path to get the values. If $valuePath is not
    specified, or doesn't match anything, values will be initialized to null.
    You can optionally group the values by what is obtained when following the
    path specified in $groupPath.::

..
    You can provide array's for both $keyPath and $valuePath.  If you do this,
    the first value will be used as a format string, for values extracted by the
    other paths::

.. php:staticmethod:: format(array $data, array $paths, $format)

    :rtype: array

    配列から取り出し、フォーマット文字列でフォーマットされた文字列の配列を返します::

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

..
    Returns a series of values extracted from an array, formatted with a
    format string::

.. php:staticmethod:: contains(array $data, array $needle)

    :rtype: boolean

    一方のハッシュや配列の中に、もう一方のキーと値が厳密に見てすべて存在しているかを判定します::

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

..
    Determines if one Hash or array contains the exact keys and values
    of another::

.. php:staticmethod:: check(array $data, string $path = null)

    :rtype: boolean

    配列の中に特定のパスがセットされているかをチェックします::

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

..
    Checks if a particular path is set in an array::

.. php:staticmethod:: filter(array $data, $callback = array('Hash', 'filter'))

    :rtype: array

    配列から空の要素（ただし '0' 以外）を取り除きます。
    また、カスタム引数 $callback を指定することで配列の要素を抽出することができます。
    コールバック関数が ``false`` を返した場合、その要素は配列から取り除かれます::

        $data = array(
            '0',
            false,
            true,
            0,
            array('one thing', 'I can tell you', 'is you got to be', false)
        );
        $res = Hash::filter($data);

        /* $data は以下のとおり:
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

..
    Filters empty elements out of array, excluding '0'. You can also supply a
    custom $callback to filter the array elements. You callback should return
    ``false`` to remove elements from the resulting array::

.. php:staticmethod:: flatten(array $data, string $separator = '.')

    :rtype: array

    多次元配列を１次元配列へと平坦化します::

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
        /* $res は以下のようになります:
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

..
    Collapses a multi-dimensional array into a single dimension::

.. php:staticmethod:: expand(array $data, string $separator = '.')

    :rtype: array

    :php:meth:`Hash::flatten()`:: によって前もって平坦化された配列を再構築します::

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
        /* $res は以下のとおり:
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

..
    Expands an array that was previously flattened with
    :php:meth:`Hash::flatten()`::

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    :rtype: array

    この関数は PHP の ``array_merge`` と ``array_merge_recursive`` の両方の機能を持っていると考えることができます。
    この２つの関数との違いは、一方の配列キーがもう一方に含まれていた場合には（``array_merge`` と違って） recursive （再帰的）に動きますが、含まれていなかった場合には（``array_merge_recursive`` と違って）recursive には動きません。

    .. note::

        この関数の引数の個数に制限はありません。また、配列以外が引数に指定された場合は配列へとキャストされます。

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

        /* $res は以下のとおり:
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

..
    This function can be thought of as a hybrid between PHP's
    ``array_merge`` and ``array_merge_recursive``. The difference to the two
    is that if an array key contains another array then the function
    behaves recursive (unlike ``array_merge``) but does not do if for keys
    containing strings (unlike ``array_merge_recursive``).

..
    .. note::
        This function will work with an unlimited amount of arguments and
        typecasts non-array parameters into arrays.

.. php:staticmethod:: numeric(array $data)

    :rtype: boolean

    配列内のすべての値が数値であるかをチェックします::

        $data = array('one');
        $res = Hash::numeric(array_keys($data));
        // $res は true

        $data = array(1 => 'one');
        $res = Hash::numeric($data);
        // $res は false

..
    Checks to see if all the values in the array are numeric::

.. php:staticmethod:: dimensions (array $data)

    :rtype: integer

    配列の次元数を数えます。このメソッドは配列の１つ目の要素だけを見て次元を判定します::

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

..
    Counts the dimensions of an array. This method will only 
    consider the dimension of the first element in the array::

.. php:staticmethod:: maxDimensions(array $data)

    :php:meth:`~Hash::dimensions()` に似ていますが、このメソッドは配列内にあるもっとも大きな次元数を返します::

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::countDim($data, true);
        // $result == 3

..
    Similar to :php:meth:`~Hash::dimensions()`, however this method returns,
    the deepest number of dimensions of any element in the array::

.. php:staticmethod:: map(array $data, $path, $function)

    $path で抽出し、各要素に $function を割り当て（map）ることで新たな配列を作ります。このメソッドでは式とマッチャの両方を使うことができます。

..
    Creates a new array, by extracting $path, and mapping $function
    across the results. You can use both expression and matching elements with
    this method.

.. php:staticmethod:: reduce(array $data, $path, $function)

    $path で抽出し、抽出結果を $function で縮小（reduce）することでを単一の値を作ります。このメソッドでは式とマッチャの両方を使うことができます。

..
    Creates a single value, by extracting $path, and reducing the extracted
    results with $function. You can use both expression and matching elements
    with this method.

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    :rtype: array

    :ref:`hash-path-syntax` によって、どの次元のどの値によってでもソートすることができます。
    このメソッドでは式のみがサポートされます::

        $a = array(
            0 => array('Person' => array('name' => 'Jeff')),
            1 => array('Shirt' => array('color' => 'black'))
        );
        $result = Hash::sort($a, '{n}.Person.name', 'asc');
        /* $result は以下のとおり:
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

    ``$dir`` には ``asc`` もしくは ``desc`` を指定することができます。
    ``$type`` には次のいずれかを指定することができます。

    * ``regular`` : 通常のソート。
    * ``numeric`` : 数値とみなしてソート。
    * ``string``  : 文字列としてソート。
    * ``natural`` : ヒューマン・フレンドリー・ソート。例えば、 ``foo10`` が ``foo2`` の下に配置される。このソートには PHP 5.4 以上が必要。

..
    Sorts an array by any value, determined by a :ref:`hash-path-syntax`
    Only expression elements are supported by this method::

..
    ``$dir`` can be either ``asc`` or ``desc``.  ``$type``
    can be one of the following values:

..
    * ``regular`` for regular sorting.
    * ``numeric`` for sorting values as their numeric equivalents.
    * ``string`` for sorting values as their string value.
    * ``natural`` for sorting values in a human friendly way.  Will
      sort ``foo10`` below ``foo2`` as an example. Natural sorting
      requires PHP 5.4 or greater.

.. php:staticmethod:: diff(array $data, array $compare)

    :rtype: array

    ２つの配列の差分を計算します::

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
        /* $result は以下のとおり:
            Array
            (
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */

..
    Computes the difference between two arrays::

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    :rtype: array

    この関数は２つの配列をマージし、差分は、その結果の配列の下部に push します。

    **例１**
    ::

        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Hash::mergeDiff($array1, $array2);

        /* $res は以下のとおり:
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

    **例２**
    ::

        $array1 = array("a" => "b", 1 => 20938, "c" => "string");
        $array2 = array("b" => "b", 3 => 238, "c" => "string", array("extra_field"));
        $res = Hash::mergeDiff($array1, $array2);
        /* $res は以下のとおり:
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

..
    This function merges two arrays and pushes the differences in
    data to the bottom of the resultant array.

.. php:staticmethod:: normalize(array $data, $assoc = true)

    :rtype: array

    配列をノーマライズします。``$assoc`` が true なら、連想配列へとノーマライズされた配列が返ります。
    値を持つ数値キーは null を持つ文字列キーへと変換されます。
    配列をノーマライズすると、 :php:meth:`Hash::merge()` で扱いやすくなります::

        $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id')
            )
        );
        $result = Hash::normalize($a);
        /* $result は以下のとおり:
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
        /* $result は以下のとおり:
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

..
    Normalizes an array. If ``$assoc`` is true, the resulting array will be
    normalized to be an associative array.  Numeric keys with values, will be
    converted to string keys with null values. Normalizing an array, makes using
    the results with :php:meth:`Hash::merge()` easier::

.. php:staticmethod:: nest(array $data, array $options = array())

    平坦な配列から、多次元配列もしくはスレッド状（threaded）の構造化データを生成します。
    ``Model::find('threaded')`` のようなメソッドで使われます。

    **オプション:**

    - ``children`` : 子の配列のために使われる戻り値のキー名。デフォルトは 'children'。
    - ``idPath`` : 各要素を識別するためのキーを指すパス。 :php:meth:`Hash::extract()` と同様に指定する。デフォルトは ``{n}.$alias.id``
    - ``parentPath`` : 各要素の親を識別するためのキーを指すパス。 :php:meth:`Hash::extract()` と同様に指定する。デフォルトは ``{n}.$alias.parent_id``
    - ``root`` : 最上位となる要素の id 。

    例::

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
        /* $result は以下のとおり:
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

..
    Takes a flat array set, and creates a nested, or threaded data structure.
    Used by methods like ``Model::find('threaded')``.

..
    Example::

..
    - ``children`` The key name to use in the result set for children. Defaults
      to 'children'.
    - ``idPath`` The path to a key that identifies each entry. Should be
      compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.id``
    - ``parentPath`` The path to a key that identifies the parent of each entry.
      Should be compatible with :php:meth:`Hash::extract()`. Defaults to ``{n}.$alias.parent_id``
    - ``root`` The id of the desired top-most result.


.. meta::
    :title lang=en: Hash
    :keywords lang=en: array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
