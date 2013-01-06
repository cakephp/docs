Set
###

Gestionar correctamente las matrices puede ser una herramienta muy útil,
poderosa y puede ayudar a construir un código más optimizado y elegante.
Para esto, CakePHP ofrece un conjunto muy útil de utilidades estáticas
en la clase Set.

Se puede llamar a la clase Set de CakePHP desde cualquier modelo o
controlador, del mismo modo que se llama a Inflector. Por ejemplo,
Set::combine().

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

Inserta $data en un arreglo segun es definido en $path.

::

    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'files', array('name' => 'files'));
    /* $result ahora queda como: 
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
    /* $result ahora queda: 
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
    /* $result ahora queda como: 
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

Ordena un arreglo según cualquier valor, determinado por una ruta
compatible con Set.

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result ahora queda: 
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
    /* $result ahora queda: 
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
    /* $result ahora queda: 
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
    /* $result ahora queda: 
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

Set::reverse es básicamente el opuesto de Set::map. Convierte un objeto
en un arreglo. Si $object no es un objeto, reverse simplemente retornará
$object.

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
    $map = Set::map($a); // Convierte $a en un objeto de clase
    /* $map ahora queda como:
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
    /* $result ahora queda como:
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

    $result = Set::reverse($a['Post']); // Sólo retorna un arreglo
    /* $result ahora queda como: 
        Array
        (
            [id] => 1
            [title] => First Post
        )
    */
        

combine
=======

``array Set::combine ($data, $path1 = null, $path2 = null, $groupPath = null)``

Crea un arreglo asociativo usando un $path1 como la ruta para construir
las llaves, y opcionalmente $path2 como la ruta para obtener los
valores. Si $path2 no es especificado, todos los valores serán
inicializados como null (lo cual es útil para Set::merge). Opcionalmente
se pueden agrupar los valores obtenidos según la ruta especificada en
$groupPath.

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
    /* $result ahora queda como: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existant');
    /* $result ahora queda como: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
        Array
        (
            [mariano.iglesias: Mariano Iglesias] => 2
            [phpnut: Larry E. Masters] => 14
            [gwoo: The Gwoo] => 25
        )
    */

    $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
    /* $result ahora queda como: 
        Array
        (
            [Mariano Iglesias: mariano.iglesias] => 2
            [Larry E. Masters: phpnut] => 14
            [The Gwoo: gwoo] => 25
        )       
    */

    $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');

    /* $result ahora queda como: 
        Array
        (
            [mariano.iglesias: 2] => Mariano Iglesias
            [phpnut: 14] => Larry E. Masters
            [gwoo: 25] => The Gwoo
        )
    */

    $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
    /* $result ahora queda como: 
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

Normaliza un string o arreglo lista.

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
    /* $result ahora queda como:
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
    /* $result ahora queda como:
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
    $result = Set::merge($a, $b); // Ahora mezclamos ambos y luego normalizamos
    /* $result ahora queda como:
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
    /* $result ahora queda:
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

Cuenta las dimensiones de un arreglo. Si $all está seteado como falso
(su valor por defecto) sólo se considerarán las dimensiones del primer
elemento en el arreglo.

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

Determina si dos Sets o arreglos son iguales.

::

    $result = Set::isEqual(array(1), array(1,1));
    // False
    $result = Set::isEqual(array(1), array(1));
    // True

diff
====

``array Set::diff ($val1, $val2 = null)``

Calcula la diferencia entre un Set y un arreglo, dos Sets, o dos
arreglos

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
    /* $result ahora queda: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result ahora queda: 
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
    /* $result ahora queda: 
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
    /* $result ahora queda: 
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

Verifica si una ruta particular está seteada en un arreglo

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

Elimina un elemento de un Set o arreglo según sea definido en una ruta
en la variable $path.

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );

    $result = Set::remove($a, 'files', array('name' => 'files'));
    /* $result ahora queda como: 
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

Obtiene un valor desde un arreglo u objeto que está contenido en una
ruta entregada usando una sintáxis de ruta de arreglo, es decir:

-  "{n}.Person.{[a-z]+}" - Donde "{n}" representa una llave numérica,
   "Person" representa una cadena literal
-  "{[a-z]+}" (es decir, cualquier string literal encerrado en llaves
   junto a {n} y {s}) es interpretado como una expresión regular.

**Ejemplo 1**

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $result = Set::extract($a, '{n}.Article.id');
    /* $result ahora queda:
        Array
        (
            [0] => 1
            [1] => 2
            [2] => 3
        )
    */
    $result = Set::extract($a, '{n}.Article.title');
    /* $result ahora queda:
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

**Ejemplo 2**

::

    $a = array(
        0 => array('pages' => array('name' => 'page')),
        1 => array('fruites'=> array('name' => 'fruit')),
        'test' => array(array('name' => 'jippi')),
        'dot.test' => array(array('name' => 'jippi'))
    );

    $result = Set::extract($a, '{n}.{s}.name');
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result Ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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
    /* $result ahora queda como: 
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

Set::matches puede ser usado para ver su un item o una ruta calza con
ciertas condiciones.

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

Set::extract utiliza la sintáxis básica XPath 2.0 para retornar
subconjuntos de la data resultante de un find(). Esta función permite
extraer datos rápidamente sin tener que hacer un ciclo a través de un
arreglos multidimensionales o de estructuras de árbol.

Si $path es un arreglo o $data es vacío la llamada se redirigirá a la
función Set::classicExtract.

::

    // Uso común:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // results retorna:
    // array(1,2,3,4,5,...);

Los seleccionadores implementados actualmente son:

+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| Seleccionador                              | Descripción                                                                                                  |
+============================================+==============================================================================================================+
| /User/id                                   | Similar al clásico {n}.User.id                                                                               |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /User[2]/name                              | Selecciona el nombre del segundo User                                                                        |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /User[id<2]                                | Selecciona todos los Users con un id < 2                                                                     |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /User[id>2][<5]                            | Selecciona todos los Users con un id > 2 pero < 5                                                            |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Post/Comment[author\_name=john]/../name   | Selecciona los nombres de todos los Posts que tienen al menos un comentario escrito por john                 |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Posts[title]                              | Selecciona todos los Post que tienen la llave 'title'                                                        |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Comment/.[1]                              | Selecciona el contenido del primer comentario                                                                |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Comment/.[:last]                          | Selecciona el último comentario                                                                              |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Comment/.[:first]                         | Selecciona el primer comentario                                                                              |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Comment[text=/cakephp/i]                  | Selecciona todos los comentarios que tienen un texto que calce con la expresión regular (regex) /cakephp/i   |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+
| /Comment/@\*                               | Selecciona todos los nombres clave de todos los comentarios                                                  |
+--------------------------------------------+--------------------------------------------------------------------------------------------------------------+

Actualmente, solo las rutas absolutas con un solo '/' están soportadas.
Por favor reporte cualquier bug que encuentre en ellas, y también las
sugerencias para futuras funcionalidades son bien recibidas.

Para aprender más acerca de Set::extract refiérase a la función
testExtract() en /cake/tests/cases/libs/set.test.php.

format
======

``array Set::format ($data, $format, $keys)``

Returns a series of values extracted from an array, formatted in a
format string.

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

The enum method works well when using html select elements. It returns a
value from an array list if the key exists.

If a comma separated $list is passed arrays are numeric with the key of
the first being 0 $list = 'no, yes' would translate to $list = array(0
=> 'no', 1 => 'yes');

If an array is used, keys can be strings example: array('no' => 0, 'yes'
=> 1);

$list defaults to 0 = no 1 = yes if param is not passed

::

    $res = Set::enum(1, 'one, two');
    // $res is 'two'

    $res = Set::enum('no', array('no' => 0, 'yes' => 1));
    // $res is 0

    $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
    // $res is 'one'

numeric
=======

``boolean Set::numeric ($array=null)``

Checks to see if all the values in the array are numeric

::


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

map
===

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

This method Maps the contents of the Set object to an object hierarchy
while maintaining numeric keys as arrays of objects.

Basically, the map function turns array items into initialized class
objects. By default it turns an array into a stdClass Object, however
you can map values into any type of class. Example:
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
        function sayHi() {
            echo 'Hi!';
        }
    }

    $mapped = Set::map($data, 'MyClass');
    //Now you can access all the properties as in the example above, 
    //but also you can call MyClass's methods
    $mapped->[0]->sayHi();

pushDiff
========

``array Set::pushDiff ($array1, $array2)``

This function merges two arrays and pushes the differences in array2 to
the bottom of the resultant array.

**Example 1**

::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
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

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
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

filter
======

``array Set::filter ($var, $isArray=null)``

Filtra los elementos vacíos de una ruta de arreglo, excluyendo el cero
'0'.

::

    $res = Set::filter(array('0', false, true, 0, array('una cosa', 'Te digo', 'es asi', false)));

    /* $res now looks like: 
        Array (
            [0] => 0
            [2] => 1
            [3] => 0
            [4] => Array
                (
                    [0] => una cosa
                    [1] => Te digo
                    [2] => es asi
                    [3] => 
                )
        )
    */

merge
=====

``array Set::merge ($arr1, $arr2=null)``

Esta función se puede considerar como un híbrido entre las funciones
array\_merge y arraymerge\_recursive, ambas de PHP. La diferencia esta
en que si un arreglo de llaves contiene otro arreglo entonces la función
se comporta recursivamente, a diferencia de array\_merge, pero no lo
hace si las llaves que contienen strings, a diferencia de
array\_merge\_recursive. Verifica el test de unidad para mas
información.

Esta función trabaja sobre un numero ilimitado de argumentos y hace un
casting como arreglos a los argumentos que no lo sean.

::

    $arry1 = array(
        array(
            'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
            'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
            'description' => 'Importing an sql dump'
        ),
        array(
            'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
            'name' => 'pbpaste | grep -i Impago | pbcopy',
            'description' => 'Eliminar las lineas que dicen "Impago".',
        )
    );
    $arry2 = 4;
    $arry3 = array(0=>"Arreglo de prueba", "gatos"=>"perros");
    $res = Set::merge($arry1, $arry2, $arry3);

    /* $res ahora queda como: 
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
                    [name] => pbpaste | grep -i Impago | pbcopy
                    [description] => Eliminar las lineas que dicen "Impago".
                )

            [2] => 4
            [3] => Arreglo de prueba
            [gatos] => perros
        )
    */

contains
========

``boolean Set::contains ($val1, $val2 = null)``

Determines if one Set or array contains the exact keys and values of
another.

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

