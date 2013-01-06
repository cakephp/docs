Set
###

正しく実装された配列の管理機能は、よりスマートに、より最適化されたコードを構築するための大変パワフルで便利なツールになります。
CakePHP はこれを可能にするとても便利な静的ユーティリティのセットを、 Set
クラスで提供します。

CakePHP の Set クラスはあらゆるモデルとコントローラにおいて、 Inflector
と同じようにコールできます。例: Set::combine()

Set-compatible Path syntax
==========================

The Path syntax is used by (for example) sort, and is used to define a
path.

Usage example (using Set::sort()):

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
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

As you can see in the example above, some things are wrapped in {}'s,
others not. In the table below, you can see which options are available.

Expression

Definition

{n}

Represents a numeric key

{s}

Represents a string

Foo

Any string (without enclosing brackets) is treated like a string
literal.

{[a-z]+}

Any string enclosed in brackets (besides {n} and {s}) is interpreted as
a regular expression.

This section needs to be expanded.

insert
======

``array Set::insert ($list, $path, $data = null)``

$path で定義された配列の中に $data を挿入します。

::

    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'files', array('name' => 'files'));
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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

sort
====

``array Set::sort ($data, $path, $dir)``

Set 互換のパスで確定したあらゆる値で配列をソートします。

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result は現段階で次のようになります。: 
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

    $result = Set::sort($a, '{n}.Shirt', 'asc');
    /* $result は現段階で次のようになります。: 
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

    $result = Set::sort($a, '{n}', 'desc');
    /* $result は現段階で次のようになります。: 
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

    $result = Set::sort($a, '{n}.{n}', 'asc');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [0] => Array
                (
                    [0] => 3
                    [1] => 2
                    [2] => 1
                )
            [1] => Array
                (
                    [0] => 3
                    [1] => 4
                    [2] => 5
                )
            [2] => Array
                (
                    [0] => 7
                    [1] => 6
                    [2] => 4
                )
        )
    */

reverse
=======

``array Set::reverse ($object)``

Set::reverse は基本的に Set::map
の逆を行います。これは、オブジェクトを配列に変換します。もし $object
がオブジェクトでなかったら、単純に $object を返します。

::

    $result = Set::reverse(null);
    // Null
    $result = Set::reverse(false);
    // false
    $a = array(
        'Post' => array('id'=> 1, 'title' => '最初の投稿'),
        'Comment' => array(
            array('id'=> 1, 'title' => '最初のコメント'),
            array('id'=> 2, 'title' => '二番目のコメント')
        ),
        'Tag' => array(
            array('id'=> 1, 'title' => '最初のタグ'),
            array('id'=> 2, 'title' => '二番目のタグ')
        ),
    );
    $map = Set::map($a); // $a をクラスオブジェクトに変換する
    /* $map は現段階で次のようになります。:
        stdClass Object
        (
            [_name_] => Post
            [id] => 1
            [title] => 最初の投稿
            [Comment] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => 最初のコメント
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => 二番目のコメント
                        )
                )
            [Tag] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => 最初のタグ
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => 二番目のタグ
                        )
                )
        )
    */

    $result = Set::reverse($map);
    /* $result は現段階で次のようになります。:
        Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [title] => 最初の投稿
                    [Comment] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => 最初のコメント
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => 二番目のコメント
                                )
                        )
                    [Tag] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => 最初のタグ
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => 二番目のタグ
                                )
                        )
                )
        )
    */

    $result = Set::reverse($a['Post']); // ただ配列を返します
    /* $result は現段階で次のようになります。: 
        Array
        (
            [id] => 1
            [title] => First Post
        )
    */
        

combine
=======

``array Set::combine ($data, $path1 = null, $path2 = null, $groupPath = null)``

このメソッドは $path1 で指定されたパスをキーに、そしてオプションで
$path2 で指定されたパスを値に、連想配列を作成します。もし $path2
で指定されたパスが定義されていなかったら、全ての値は null
として初期化されます(Set::merge
で便利です)。これらのパスの後に、オプションで $groupPath
を設定すると、それが指定するパスの値でグループ化することができます。

::


    $result = Set::combine(array(), '{n}.User.id', '{n}.User.Data');
    // $result == array();

    $result = Set::combine('', '{n}.User.id', '{n}.User.Data');
    // $result == array();

    $a = array(
        array('User' => array('id' => 2, 'group_id' => 1,
            'Data' => array('user' => 'mariano.iglesias','name' => 'Mariano Iglesias'))),
        array('User' => array('id' => 14, 'group_id' => 2,
            'Data' => array('user' => 'phpnut', 'name' => 'Larry E. Masters'))),
        array('User' => array('id' => 25, 'group_id' => 1,
            'Data' => array('user' => 'gwoo','name' => 'The Gwoo'))));

    $result = Set::combine($a, '{n}.User.id');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existant');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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

    $result = Set::combine($a, '{n}.User.id');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
        Array
        (
            [mariano.iglesias: Mariano Iglesias] => 2
            [phpnut: Larry E. Masters] => 14
            [gwoo: The Gwoo] => 25
        )
    */

    $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [Mariano Iglesias: mariano.iglesias] => 2
            [Larry E. Masters: phpnut] => 14
            [The Gwoo: gwoo] => 25
        )       
    */

    $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');

    /* $result は現段階で次のようになります。: 
        Array
        (
            [mariano.iglesias: 2] => Mariano Iglesias
            [phpnut: 14] => Larry E. Masters
            [gwoo: 25] => The Gwoo
        )
    */

    $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2: mariano.iglesias] => Mariano Iglesias
            [14: phpnut] => Larry E. Masters
            [25: gwoo] => The Gwoo
        )
    */

normalize
=========

``array Set::normalize ($list, $assoc = true, $sep = ',', $trim = true)``

文字列や配列のリストを正規化します。

::

    $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')));
    $b =  array('Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional');
    $result = Set::normalize($a);
    /* $result は現段階で次のようになります。:
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
    /* $result は現段階で次のようになります。:
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
    $result = Set::merge($a, $b); // Now merge the two and normalize
    /* $result は現段階で次のようになります。:
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
    $result = Set::normalize(Set::merge($a, $b));
    /* $result は現段階で次のようになります。:
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

countDim
========

``integer Set::countDim ($array = null, $all = false, $count = 0)``

配列の次元の数を数えます。もし $all を false (デフォルトの値です)
に設定すると、配列の最初の要素を配列の次元の数とみなします。

::

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
        

isEqual
=======

``boolean Set::isEqual ($val1, $val2 = null)``

二つのセットあるいは配列が等しいか調べます。

::

    $result = Set::isEqual(array(1), array(1,1));
    // False
    $result = Set::isEqual(array(1), array(1));
    // True

``boolean Set::contains ($val1, $val2 = null)``

一つのセットあるいは配列がもう片方の配列を同じキーと値のペアを持つか調べます。

::

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

diff
====

``array Set::diff ($val1, $val2 = null)``

セットと配列、二つのセット、あるいは二つの配列の間の差分を測ります。

::

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
    /* $result は現段階で次のようになります。: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
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
    /* $result は現段階で次のようになります。: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
        )
    */

check
=====

``boolean Set::check ($data, $path = null)``

配列中で特定のパスがセットされているかを確認します。

::

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

remove
======

``array Set::remove ($list, $path = null)``

セットや配列の中のから、定義されたパスの要素を削除します。

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );

    $result = Set::remove($a, 'files', array('name' => 'files'));
    /* $result は現段階で次のようになります。: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )

        )
    */

classicExtract
==============

``array Set::classicExtract ($data, $path = null)``

配列やオブジェクトから、配列のパスのシンタックスで与えられたパスに含まれる値を返します。配列のパスのシンタックスとは、すなわち次のことです。

-  "{n}.Person.{[a-z]+}" -
   「{n}」は整数のキーを表し、「Person」は文字列リテラルを表現します。
-  「{[a-z]+}」(すなわち {n} と {s}
   の他に、あらゆる文字列リテラルをブランケットで囲ったもの)は、正規表現として解釈されます。

**例1**

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => '記事1')),
        array('Article' => array('id' => 2, 'title' => '記事2')),
        array('Article' => array('id' => 3, 'title' => '記事3')));
    $result = Set::extract($a, '{n}.Article.id');
    /* $result は現段階で次のようになります。:
        Array
        (
            [0] => 1
            [1] => 2
            [2] => 3
        )
    */
    $result = Set::extract($a, '{n}.Article.title');
    /* $result は現段階で次のようになります。:
        Array
        (
            [0] => 記事1
            [1] => 記事2
            [2] => 記事3
        )
    */
    $result = Set::extract($a, '1.Article.title');
    // $result == "記事2"

    $result = Set::extract($a, '3.Article.title');
    // $result == null

**例2**

::

    $a = array(
        0 => array('pages' => array('name' => 'page')),
        1 => array('fruites'=> array('name' => 'fruit')),
        'test' => array(array('name' => 'jippi')),
        'dot.test' => array(array('name' => 'jippi'))
    );

    $result = Set::extract($a, '{n}.{s}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a, '{s}.{n}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{\w+}.{\w+}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{\d+}.{\w+}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{n}.{\w+}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{s}.{\d+}.name');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{s}');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a,'{[a-z]}');
    /* $result は現段階で次のようになります。: 
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
    $result = Set::extract($a, '{dot\.test}.{n}');
    /* $result は現段階で次のようになります。: 
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

matches
=======

``boolean Set::matches ($conditions, $data=array(), $i = null, $length=null)``

Set::matches は単一のアイテムあるいは与えられた XPath
が、ある条件にマッチするかどうかを確認します。

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $res=Set::matches(array('id>2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>=3'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id<=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id<2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>1'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('3'), null, 3);
    // returns true
    $res=Set::matches(array('5'), null, 5);
    // returns true
    $res=Set::matches(array('id'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id', 'title'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('non-existant'), $a[1]['Article']);
    // returns false
    $res=Set::matches('/Article[id=2]', $a);
    // returns true
    $res=Set::matches('/Article[id=4]', $a);
    // returns false
    $res=Set::matches(array(), $a);
    // returns true

extract
=======

``array Set::extract ($path, $data=null, $options=array())``

Set::extract は、 find あるいは findAll
で得られたデータのサブセットを、基本的な XPath 2.0
のシンタックスを使って返します。この関数を使うと、多次元配列にループを使ったり、木構造を走査することをせずに、データを速やかに検索することができます。

もし $path が配列だったり、 $data が空だった場合は、 Set::classicExtract
に委ねられます。

::

    // 一般的な使い方:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // $results はこのようになります:
    // array(1,2,3,4,5,...);

今のところ実行できるセレクタは次の通りです。

+--------------------------------------------+------------------------------------------------------------------------------------+
| セレクタ                                   | 備考                                                                               |
+============================================+====================================================================================+
| /User/id                                   | 古典的な {n}.User.id に似ています。                                                |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /User[2]/name                              | 二番目の User の名前を選びます。                                                   |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /User[id<2]                                | id が 2 より大きい User を全て選びます。                                           |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /User[id>2][<5]                            | id が 2 より大きく、 5 より小さい User を全て選びます。                            |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Post/Comment[author\_name=john]/../name   | john によって書かれた Comment を少なくとも一つ持つ全ての Post の名前を選びます。   |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Posts[title]                              | 「name」キーを持つ全ての Post を選びます。                                         |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Comment/.[1]                              | 最初の Comment のコンテンツを選びます。                                            |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Comment/.[:last]                          | 最後の Comment を選びます。                                                        |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Comment/.[:first]                         | 最初の Comment を選びます。                                                        |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Comment[text=/cakephp/i]                  | 正規表現で /cakephp/i にマッチする text を持つ全ての Comment を選びます。          |
+--------------------------------------------+------------------------------------------------------------------------------------+
| /Comment/@\*                               | Comment の全てのキーの名前を選びます。                                             |
+--------------------------------------------+------------------------------------------------------------------------------------+

現在のところ、単一の「/」を使った絶対パスのみサポートされています。バグを発見したら、それを報告してください。また機能追加の提案も歓迎します。

Set::extract() についてより詳しく知りたい場合は、
/cake/tests/cases/libs/set.test.php にある testExtract()
を参照してください。

format
======

``array Set::format ($data, $format, $keys)``

配列から、文字列にフォーマットしたものを抜粋して返します。

::

    $data = array(
        array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
        array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
        array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));

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

enum
====

``string Set::enum ($select, $list=null)``

enum メソッドは HTML の select
要素を使う時にうまく機能します。これは配列のリストから、キーが存在するものの値を返します。

もし $list
にカンマ区切りで値を渡すと、0から始まる配列として構成されます。たとえば
$list に「no, yes」を渡すと、 $list = array(0 => 'no', 1 => 'yes')
となります。

もし配列が使われると、キーを文字列にすることができます。例: array('no'
=> 0, 'yes' => 1);

もしパラメータが渡されなかった場合の $list のデフォルトは 0 = no 1 = yes
です。

::

    $res = Set::enum(1, 'one, two');
    // $res は「two」になる

    $res = Set::enum('no', array('no' => 0, 'yes' => 1));
    // $res は「0」になる

    $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
    // $res は「one」になる

numeric
=======

``array Set::numeric ($array=null)``

配列の全ての値が数字かどうかチェックします。

::


        $data = array('one');
        $res = Set::numeric(array_keys($data));
        
        // $res は true
        
        $data = array(1 => 'one');
        $res = Set::numeric($data);

        // $res は false
        
        $data = array('one');
        $res = Set::numeric($data);
        
        // $res は false
        
        $data = array('one' => 'two');
        $res = Set::numeric($data);
        
        // $res は false
        
        $data = array('one' => 1);
        $res = Set::numeric($data);
        
        // $res は true
        
        $data = array(0);
        $res = Set::numeric($data);
        
        // $res は true
        
        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res は true
        
        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res は true
        
        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res は true
        
        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res は false

map
===

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

このメソッドは Set
オブジェクトのコンテンツを、オブジェクトを整数のキーの値としてもつ、オブジェクトの構造にマップします。

基本的には map
関数は配列アイテムを初期化されたクラスオブジェクトに変換します。デフォルトでは、この関数は配列を
stdClass
オブジェクトに変換しますが、任意のタイプのクラスを指定することができます。例:
Set::map($array\_of\_values, 'nameOfYourClass');

::

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

    /* $mapped は現段階で次のようになります。:

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

pushDiff
========

``array Set::pushDiff ($array1, $array2)``

この関数は二つの配列を統合し、戻り値の配列の最後に array2
の差分を追加します。

**例1**

::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
    $res = Set::pushDiff($array1, $array2);

    /* $res は現段階で次のようになります。: 
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

**例2**

::

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
    $res = Set::pushDiff($array1, $array2);
    /* $res は現段階で次のようになります。: 
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

filter
======

``array Set::filter ($var, $isArray=null)``

ルート配列から空の要素を除きます。「0」の要素は除きません。

::

    $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));

    /* $res は現段階で次のようになります。: 
        Array (
            [0] => 0
            [2] => 1
            [3] => 0
            [4] => Array
                (
                    [0] => one thing
                    [1] => I can tell you
                    [2] => is you got to be
                    [3] => 
                )
        )
    */

merge
=====

``array Set::merge ($arr1, $arr2=null)``

この関数は PHP の array\_merge と array\_merge\_recursive
を混ぜ合わせたものと見なすことができます。 array\_merge
と異なる点は、もし配列のキーが他の配列に含まれていたら、再帰的に振舞うことです。
array\_merge\_recursive
と異なる点は、キーが文字列に含まれていたら、再帰的な処理を行わないことです。さらなる情報を得るためには、単体テストを見てください。

この関数は引数を無制限に渡すことができ、配列でないパラメータは配列に型を変換します。

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
    $arry3 = "This is a String";
    $arry3 = array(0=>"test array", "cats"=>"dogs");
    $res = Set::merge($arry1, $arry2, $arry3);

    /* $res は現段階で次のようになります。: 
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
            [cats] => dogs
        )
    */

contains
========

``boolean Set::contains ($val1, $val2 = null)``

一つの配列が、もう片方の配列のキーと値を正確に含んでいるかを確認します。

::

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

