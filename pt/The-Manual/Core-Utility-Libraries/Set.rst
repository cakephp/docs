Set
###

Gerenciamento de arrays, se feito corretamente, pode ser uma útil e
poderosa ferramenta para desenvolver código melhor e mais otimizado. O
CakePHP dispõe de um conjunto muito útil de utilitários estáticos na
classe Set que lhe permitem fazer exatamente isso.

A classe Set do CakePHP pode ser chamada a partir de qualquer model ou
controller da mesma maneira que a classe Inflector é chamada. Por
exemplo, ``Set::combine()``.

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

Insere $data em um array definido por $path.

::

    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'files', array('name' => 'files'));
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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

Ordena um array por qualquer valor, dado por um caminho no estilo
compreendido pelo Set.

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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

Set::reverse é basicamente o contrário do Set::map. Ele converte um
objeto em um array. Se $object não for um objeto, o método simplesmente
retorna o próprio $object.

::

    $result = Set::reverse(null);
    // Null
    $result = Set::reverse(false);
    // false
    $a = array(
        'Post' => array('id'=> 1, 'title' => 'First Post'),
        'Comment' => array(
            array('id'=> 1, 'title' => 'First Comment'),
            array('id'=> 2, 'title' => 'Second Comment')
        ),
        'Tag' => array(
            array('id'=> 1, 'title' => 'First Tag'),
            array('id'=> 2, 'title' => 'Second Tag')
        ),
    );
    $map = Set::map($a); // Turn $a into a class object
    /* $map agora se parece com: 
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
    /* $result agora se parece com: 
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

    $result = Set::reverse($a['Post']); // Apenas retorna o array
    /* $result agora se parece com: 
        Array
        (
            [id] => 1
            [title] => First Post
        )
    */
        

combine
=======

``array Set::combine ($data, $path1 = null, $path2 = null, $groupPath = null)``

Cria um array associativo usando $path1 como caminho para construir as
chaves e, opcionalmente, $path2 para seus valores. Se $path2 não for
especificado, todos os valores serão inicializados com null (útil para
uso com o Set::merge). Você também pode opcionalmente agrupar os valores
que serão obtidos ao se seguir o caminho dado em $groupPath.

::


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
    /* $result agora se parece com: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existant');
    /* $result agora se parece com: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
        Array
        (
            [mariano.iglesias: Mariano Iglesias] => 2
            [phpnut: Larry E. Masters] => 14
            [gwoo: The Gwoo] => 25
        )
    */

    $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
    /* $result agora se parece com: 
        Array
        (
            [Mariano Iglesias: mariano.iglesias] => 2
            [Larry E. Masters: phpnut] => 14
            [The Gwoo: gwoo] => 25
        )       
    */

    $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');

    /* $result agora se parece com: 
        Array
        (
            [mariano.iglesias: 2] => Mariano Iglesias
            [phpnut: 14] => Larry E. Masters
            [gwoo: 25] => The Gwoo
        )
    */

    $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
    /* $result agora se parece com: 
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

Normaliza uma lista de strings ou de arrays.

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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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

Conta a quantidade de dimensões de um array. Se $all for definido para
false (que é o valor padrão), o método irá considerar apenas a dimensão
do primeiro elemento do array.

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
        

diff
====

``array Set::diff ($val1, $val2 = null)``

Calcula a diferença entre um Set e um array, entre dois Sets, ou entre
dois arrays.

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
    /* $result agora se parece com: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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
    /* $result agora se parece com: 
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

Verifica se um dado caminho está definido em um array.

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

``boolean Set::remove ($list, $path = null)``

Remove o elemento definido por $path de um Set ou array.

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );

    $result = Set::remove($a, 'files', array('name' => 'files'));
    /* $result agora se parece com: 
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

Obtém o valor a partir de um array ou de um objeto que esteja contido
num dado path usando uma sintaxe de paths em array, p.ex., Gets a value
from an array or object that is contained in a given path using an array
path syntax, i.e.:

-  "{n}.Person.{[a-z]+}" - Em que "{n}" representa um índice numérico,
   "Person" representa um string literal
-  "{[a-z]+}" (i.e., qualquer string literal delimitada por chaves entre
   {n} e {s}) é interpretada como uma expressão regular.

**Exemplo 1**

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $result = Set::extract($a, '{n}.Article.id');
    /* $result agora se parece com:
        Array
        (
            [0] => 1
            [1] => 2
            [2] => 3
        )
    */
    $result = Set::extract($a, '{n}.Article.title');
    /* $result agora se parece com:
        Array
        (
            [0] => Article 1
            [1] => Article 2
            [2] => Article 3
        )
    */
    $result = Set::extract($a, '1.Article.title');
    // $result == "Article 2"

    $result = Set::extract($a, '3.Article.title');
    // $result == null

**Exemplo 2**

::

    $a = array(
        0 => array('pages' => array('name' => 'page')),
        1 => array('fruites'=> array('name' => 'fruit')),
        'test' => array(array('name' => 'jippi')),
        'dot.test' => array(array('name' => 'jippi'))
    );

    $result = Set::extract($a, '{n}.{s}.name');
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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
    /* $result agora se parece com:
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

Set::matches pode ser usado para verificar se um único ítem ou um dado
XPath corresponde a determinadas condições.

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $res=Set::matches(array('id>2'), $a[1]['Article']);
    // retorna false
    $res=Set::matches(array('id>=2'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('id>=3'), $a[1]['Article']);
    // retorna false
    $res=Set::matches(array('id<=2'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('id<2'), $a[1]['Article']);
    // retorna false
    $res=Set::matches(array('id>1'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('3'), null, 3);
    // retorna true
    $res=Set::matches(array('5'), null, 5);
    // retorna true
    $res=Set::matches(array('id'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('id', 'title'), $a[1]['Article']);
    // retorna true
    $res=Set::matches(array('non-existant'), $a[1]['Article']);
    // retorna false
    $res=Set::matches('/Article[id=2]', $a);
    // retorna true
    $res=Set::matches('/Article[id=4]', $a);
    // retorna false
    $res=Set::matches(array(), $a);
    // retorna true

extract
=======

``array Set::extract ($path, $data=null, $options=array())``

Set::extract utiliza sintaxe básica de XPath 2.0 para retornar
subconjunto de seus dados a partir de uma consulta de um find ou de um
find all. Este método permite que você obtenha seus dados rapidamente
sem precisar varrê-los em arrays multidimensionais ou percorrê-los como
estruturas em árvore.

Se $path for um array ou se $data estiver vazio, então a chamada é
delegada para Set::classicExtract.

::

    // Uso comum:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // result contém:
    // array(1,2,3,4,5,...);

Seletores atualmente implementados:

+--------------------------------------------+-------------------------------------------------------------------------------------------+
| Seletor                                    | Observação                                                                                |
+============================================+===========================================================================================+
| /User/id                                   | Semelhante ao clássico {n}.User.id                                                        |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /User[2]/name                              | Seleciona o nome do segundo usuário                                                       |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /User[id<2]                                | Seleciona todos os usuários com id < 2                                                    |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /User[id>2][<5]                            | Seleciona todos os usuários com um id > 2 e < 5                                           |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Post/Comment[author\_name=john]/../name   | Seleciona o nome de todos os Pots que tenham pelo menos um comentário escrito por john    |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Posts[title]                              | Seleciona todos os Posts que possuam um índice 'title'                                    |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Comment/.[1]                              | Seleciona o conteúdo do primeiro comentário                                               |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Comment/.[:last]                          | Seleciona o último comentário                                                             |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Comment/.[:first]                         | Seleciona o primeiro comentário                                                           |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Comment[text=/cakephp/i]                  | Seleciona todos os comentários com texto que corresponda à expressão regular /cakephp/i   |
+--------------------------------------------+-------------------------------------------------------------------------------------------+
| /Comment/@\*                               | Seleciona os nomes dos índices de todos os comentários                                    |
+--------------------------------------------+-------------------------------------------------------------------------------------------+

Atualmente apenas caminhos absolutos, começando com uma única '/' são
suportados. Por favor, reporte quaisquer bugs assim que você os
encontrar. Sugestões para recursos adicionais são bem-vindas.

Para saber mais sobre Set::extract() não deixe de ver a função
testExtract() no arquivo /cake/tests/cases/libs/set.test.php.

format
======

``array Set::format ($data, $format, $keys)``

Retorna uma série de valores extraídos a partir de array, num formato de
string.

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

O método enum funciona bem quando usado com elementos select do HTML.
Ele retorna um valor a partir de uma lista de array se o índice existir.

Se um conjunto de valores separados por vírgulas for informado em $list,
o item correspondente a um dado índice numérico ($select) será
retornado, sendo que ao primeiro item corresponde o índice 0. No caso,
$list = 'no, yes,' é equivalente a $list = array(0 => 'no', 1 => 'yes');

Se um array for usado, os índices podem ser strings, por exemplo:
array('no' => 0, 'yes' => 1);

Se $list não for informado, serão assumidos os valores 0 = no 1 = yes.

::

    $res = Set::enum(1, 'one, two');
    // $res é 'two'

    $res = Set::enum('no', array('no' => 0, 'yes' => 1));
    // $res é 0

    $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
    // $res é 'one'

numeric
=======

``array Set::numeric ($array=null)``

Verifica se todos os valores do array são numéricos.

::


        $data = array('one');
        $res = Set::numeric(array_keys($data));
        
        // $res é true
        
        $data = array(1 => 'one');
        $res = Set::numeric($data);

        // $res é false
        
        $data = array('one');
        $res = Set::numeric($data);
        
        // $res é false
        
        $data = array('one' => 'two');
        $res = Set::numeric($data);
        
        // $res é false
        
        $data = array('one' => 1);
        $res = Set::numeric($data);
        
        // $res é true
        
        $data = array(0);
        $res = Set::numeric($data);
        
        // $res é true
        
        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res é true
        
        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res é true
        
        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res é true
        
        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res é false

map
===

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

Este método mapeia o conteúdo do objeto Set para uma hierarquia de
objetos enquanto mantém os índices numéricos como arrays de objetos.

Basicamente, o método map converte um array de itens em objetos
não-inicializados de classes. Por padrão, ele converte um array para um
objeto da classe stdClass, no entanto, você pode mapear os valores para
qualquer tipo de classe. Por exemplo, Set::map($array\_de\_valores,
'nomeDeSuaClasse');

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

    /* $mapped agora se parece com:

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

Chamando Set::map() com uma classe específica como segundo parâmetro:

::

    class MyClass {
        function sayHi() {
            echo 'Hi!';
        }
    }

    $mapped = Set::map($data, 'MyClass');
    // Agora você pode acessar todas as propriedades como no exemplo acima, 
    // mas você também pode chamar os métodos de MyClass
    $mapped->[0]->sayHi();

pushDiff
========

``array Set::pushDiff ($array1, $array2)``

Este método mescla dois arrays e retorna as diferenças entre o array1
para o final do array resultante.

**Exemplo 1**

::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
    $res = Set::pushDiff($array1, $array2);

    /* $res agora se parece com:
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

**Exemplo 2**

::

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
    $res = Set::pushDiff($array1, $array2);
    /* $res agora se parece com:
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

Filtros esvaziam elementos a partir de um array de rotas, excluindo o
excluding '0'.

::

    $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));

    /* $res agora se parece com:
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

Este método pode ser compreendido como um híbrido entre as funções
array\_merge e array\_merge\_recursive do PHP. A diferença entre as duas
é que se um índice de um array contiver outro array, então o método se
comporta recursivamente (diferentemente do array\_merge) mas não se o
array contiver índices apenas com strings (diferentemente do
array\_merge\_recursive). Veja o teste unitário para mais informações.

Este método irá funcionar com uma quantidade ilimitada de argumentos e
parâmetros não-array convertidos em arrays.

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
    $arry3 = array(0=>"test array", "cats"=>"dogs", "people" => 1267);
    $arry4 = array("cats"=>"felines", "dog"=>"angry");
    $res = Set::merge($arry1, $arry2, $arry3, $arry4);

    /* $res agora se parece com: 
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

contains
========

``boolean Set::contains ($val1, $val2 = null)``

Determina se um Set ou um array contém os índices e valores exatos de um
outro Set ou array.

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

