Hash
####

.. php:class:: Hash

.. versionadded:: 2.2

配列マネジメントはとても強力かつ便利なツールであり、適切に使いさえすれば、
よりスマートでより最適化されたコードを書くことができるようになるものです。
CakePHP ではとても便利なユーティリティ群を Hash クラスの中に
static で用意しており、まさにこれをするのに使えます。

CakePHP の Hash クラスは Inflector クラスと同様で、どのモデルや
コントローラからでも呼ぶことができます。 例: :php:meth:`Hash::combine()`。

.. _hash-path-syntax:

Hash パス構文
=============

下記のパス構文は ``Hash`` が持つすべてのメソッドで使われるものです。
ただし、すべてのパス構文が、すべてのメソッドで使用可能であるとは限りません。
パスの式はいくつものトークンで構成されます。トークンは、配列データの移動に使う『式』と、
要素を絞り込む『マッチャー』の２つのグループに大きく分けられます。
マッチャーは要素の式に対して適用することができます。

式の種類
----------------

+--------------------------------+--------------------------------------------+
| 式                             | 説明                                       |
+================================+============================================+
| ``{n}``                        | 数値キーを意味する。どんな文字列キーでも   |
|                                | 数値型のキーでも一致する。                 |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | 文字列キーを意味する。数値文字列を含め、   |
|                                | どんな文字列でも一致する。                 |
+--------------------------------+--------------------------------------------+
| ``{*}``                        | 型に関係なく任意の値を表す。               |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | 完全に同じ値だった場合のみ一致する。       |
+--------------------------------+--------------------------------------------+

要素の式はいずれも、すべてのメソッドで使うことができます。特定のメソッドでは、
要素の式に加え、 属性で絞り込むこともできます。該当するメソッドは、
``extract()``,　``combine()``, ``format()``, ``check()``, ``map()``, ``reduce()``,
``apply()``, ``sort()``, ``insert()``, ``remove()`` と ``nest()`` です。


属性の絞り込み種別
------------------------

+--------------------------------+--------------------------------------------+
| マッチャー                     | 説明                                       |
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

.. versionchanged:: 2.5
    ``insert()`` と ``remove()`` にマッチャーのサポートが追加されました。

.. php:staticmethod:: get(array $data, $path, $default = null)

    :rtype: mixed

    ``get()`` は ``extract()`` のシンプル版で、直接的に指定するパス式のみがサポートされます。
    ``{n}`` や ``{s}`` 、マッチャーを使ったパスはサポートされません。
    配列から１つの値だけを取り出したい場合に ``get()`` を使ってください。

.. php:staticmethod:: extract(array $data, $path)

    :rtype: array

    ``Hash::extract()`` は :ref:`hash-path-syntax` にあるすべての式とマッチャーを
    サポートします。extract を使うことで、配列から好きなパスに沿ったデータを手早く
    取り出すことができます。もはやデータ構造をループする必要はありません。
    その代わりに欲しい要素を絞り込むパス式を使うのです::

        // 共通の使い方:
        $users = $this->user->find("all");
        $results = Hash::extract($users, '{n}.user.id');
        // $results は以下のとおり:
        // array(1,2,3,4,5,...);

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    :rtype: array

    $data を ``$path`` の定義に従って配列の中に挿入します。　::

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


    ``{n}`` や ``{s}`` を使ったパスを使うことで、複数のポイントにデータを挿入することが
    できます::

        $users = $this->User->find('all');
        $users = Hash::insert($users, '{n}.User.new', 'value');

    .. versionchanged:: 2.5
        2.5.0 から、 insert() で属性のマッチャー表現が動作します。

.. php:staticmethod:: remove(array $data, $path)

    :rtype: array

    $path に合致するすべての要素を配列から削除します。 ::

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

    .. versionchanged:: 2.5
       2.5.0 から、 insert() で属性のマッチャー表現が動作します。

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
    その場合は、配列の１要素目はフォーマット文字列とみなされ、
    ２要素目以降のパスで取得された値のために使われます::

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

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    :rtype: array

    この関数は PHP の ``array_merge`` と ``array_merge_recursive`` の
    両方の機能を持っていると考えることができます。この２つの関数との違いは、一方の配列キーが
    もう一方に含まれていた場合には (``array_merge`` と違って) 再帰的に動きますが、
    含まれていなかった場合には (``array_merge_recursive`` と違って) 再帰的には動きません。

    .. note::

        この関数の引数の個数に制限はありません。また、配列以外が引数に指定された場合は
        配列へとキャストされます。

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

.. php:staticmethod:: numeric(array $data)

    :rtype: boolean

    配列内のすべての値が数値であるかをチェックします::

        $data = array('one');
        $res = Hash::numeric(array_keys($data));
        // $res は true

        $data = array(1 => 'one');
        $res = Hash::numeric($data);
        // $res は false

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

.. php:staticmethod:: maxDimensions(array $data)

    :php:meth:`~Hash::dimensions()` に似ていますが、このメソッドは配列内にあるもっとも大きな次元数を返します::

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::countDim($data, true);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    $path で抽出し、各要素に $function を割り当て（map）ることで新たな配列を作ります。
    このメソッドでは式とマッチャーの両方を使うことができます。

.. php:staticmethod:: reduce(array $data, $path, $function)

    $path で抽出し、抽出結果を $function で縮小（reduce）することでを単一の値を作ります。
    このメソッドでは式とマッチャーの両方を使うことができます。

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
    * ``natural`` : ヒューマン・フレンドリー・ソート。例えば、 ``foo10`` が ``foo2``
      の下に配置される。このソートには PHP 5.4 以上が必要。

    .. versionadded:: 2.8
        ``$type`` オプションは、配列に対応しました。 ``ignoreCase`` オプションは、
        大文字小文字の区別しないソートを有効にします。

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

.. php:staticmethod:: normalize(array $data, $assoc = true)

    :rtype: array

    配列を正規化します。 ``$assoc`` が true なら、連想配列へと正規化された配列が
    返ります。値を持つ数値キーは null を持つ文字列キーへと変換されます。
    配列を正規化すると、 :php:meth:`Hash::merge()` で扱いやすくなります::

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

.. php:staticmethod:: nest(array $data, array $options = array())

    平坦な配列から、多次元配列もしくはスレッド状（threaded）の構造化データを生成します。
    ``Model::find('threaded')`` のようなメソッドで使われます。

    **オプション:**

    - ``children`` : 子の配列のために使われる戻り値のキー名。デフォルトは 'children'。
    - ``idPath`` : 各要素を識別するためのキーを指すパス。
      :php:meth:`Hash::extract()` と同様に指定する。デフォルトは ``{n}.$alias.id``
    - ``parentPath`` : 各要素の親を識別するためのキーを指すパス。
      :php:meth:`Hash::extract()` と同様に指定する。デフォルトは ``{n}.$alias.parent_id``
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


.. meta::
    :title lang=ja: Hash
    :keywords lang=ja: array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
