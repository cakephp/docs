Arboles (Tree)
##############

Es muy común que se desea almacenar datos jerárquicos en una tabla de
base de datos. Ejemplos de estos datos pueden ser: categorías con
subcategorías ilimitadas, los datos relativos a un sistema de menús
multinivel o una representación literal de la jerarquía tal como se
utiliza para almacenar objetos de control de acceso con la lógica ACL.

Para pequeños árboles de datos, o cuando los datos son de sólo unos
pocos niveles de profundidad es simple añadir un campo parent\_id a su
tabla de base de datos y utilizar este para hacer un seguimiento de cual
item es padre de quien. Sin embargo, Cake Viene equipado con este
paquete, pero con un comportamiento de gran alcance que le permite
utilizar los beneficios de la lógica
`MPTT <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_
sin preocuparse de cualquiera de los entresijos de la técnica - a menos
que ud lo desee ;).

Requerimientos
==============

Para poder usar la funcionalidad de árbol, la tabla de la base de datos
debe tener los 3 campos listados a continuación (enteros todos):

-  padre - el nombre por defecto del campo es **parent\_id**, para
   almacenar el id del objeto padre
-  izquierda - el nombre por defecto del campo es **lft**, para
   almacenar el valor lft de la fila actual.
-  deracha - el nombre por defecto del campo es **rght**, para almacenar
   el valor rght de la fila actual.

Si esta familiarizado con la lógina MPTT ud puede preguntarse por que el
campos parent existe - simplemente es más facil de realizar ciertas
tareas si existe un enlace directo al padre almacenado en la base de
datos - tales como la búsquera de los hijos directos.

Uso Básico
==========

El comportamiento de arbol tiene muchas cosas incluidas, pero empecemos
con un simple ejemplo - crearemos una pequeña tabla en una base de datos
y le agregaremos algunos datos:

::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'Mis Categorias', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, 'Diversion', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'Deportes', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surfing', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'Alpinismo', 3, 6, 7);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(6, 'Amigos', 2, 9, 14);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(7, 'Gerald', 6, 10, 11);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(8, 'Gwendolyn', 6, 12, 13);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(9, 'Trabajo', 1, 16, 29);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(10, 'Reportes', 9, 17, 22);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(11, 'Anual', 10, 18, 19);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(12, 'Status', 10, 20, 21);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(13, 'Viajes', 9, 23, 28);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(14, 'Nacional', 13, 24, 25);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(15, 'Internacional', 13, 26, 27);

Para el propósito de verificar que todo está configurado correctamente,
podemos crear un metodo de testeo y obtener los contenidos de nuestro
arbol de categorias para ver como queda. Con un simple controlador:

::

    <?php
    class CategoriesController extends AppController {

            var $name = 'Categories';
            
            function index() {
                    $this->data = $this->Category->generatetreelist(null, null, null, '&nbsp;&nbsp;&nbsp;');
                    debug ($this->data); die;       
            }
    }
    ?>

y un metodo aun mas simple en el modelo:

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

Podemos verificar como se ve que nuestro arbol de categoria visitando
/categories Deberias ver algo como:

-  Mis Categorias

   -  Diversion

      -  Deportes

         -  Surfing
         -  Alpinismo

      -  Amigos

         -  Gerald
         -  Gwendolyn

   -  Trabajo

      -  Reportes

         -  Anual
         -  Status

      -  Viajes

         -  Nacional
         -  Internacional

Agregando datos
---------------

En la seccion anterior, usamos datos pre-existentes y chequeamos que se
vieran en forma jerarquica con el método ``generatetreelist``. Sin
embargo, usualmente agregaríamos los datos de la misma forma que lo
hariamos con cualquier modelo. Por ejemplo:

::

    // pseudo código del controlador
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Skating';
    $this->Category->save($data);

Cuando se usa el comportamiento de arbol no es necesario hacer nada mas
que configurar el parent\_id, y el comportamiento de arbol se encargara
del resto. Si no se setea el parent\_id el comportamiento de arbol lo
agregara al arbol como una entrada en el nivel superior:

::

    // pseudo codigo controlador
    $data = array();
    $data['Category']['name'] =  'Otra Categoria';
    $this->Category->save($data);

Ejecutando estos dos trozos de código alterará el árbol como sigue:

-  Mis Categorias

   -  Diversion

      -  Deportes

         -  Surfing
         -  Alpinismo
         -  Skating **New**

      -  Amigos

         -  Gerald
         -  Gwendolyn

   -  Trabajo

      -  Reportes

         -  Anual
         -  Status

      -  Viajes

         -  Nacional
         -  Internacional

-  Otra Categoria **New**

Modificando datos
-----------------

Modificar datos es tan transparente como agregar nuevos datos. Si
modificas algo, pero no modificas el campo parent\_id - la estructura de
tus datos permanecera inalterada. Por ejemplo:

::

    // pseudo codigo  de controlador
    $this->Category->id = 5; // id de Alpinismo
    $this->Category->save(array('name' =>'Pesca'));

El codigo anterior no modifica el parent\_id - incluso si el parent\_id
es incluido en los datos que son pasados al método save, si el valor no
ha sido cambiado, tampoco lo hace la estructura de datos. Entonces, el
arbol de datos queda:

-  Mis Categorias

   -  Diversion

      -  Deportes

         -  Surfing
         -  Pesca **Updated**
         -  Skating

      -  Amigos

         -  Gerald
         -  Gwendolyn

   -  Trabajo

      -  Reportes

         -  Anual
         -  Status

      -  Viajes

         -  Nacional
         -  Internacional

-  Otra Categoria

Mover un dato a traves del arbol tambien es simple. Digamos que Pesca no
pertenece a Deportes, sino que deberia estar en Otra Categoria. Con el
siguiente código:

::

    // pseudo codigo de controlador
    $this->Category->id = 5; // id of Pesca
    $newParentId = $this->Category->field('id', array('name' => 'Otra Categoria'));
    $this->Category->save(array('parent_id' => $newParentId)); 

Como es de esperar la estructura queda modificada a:

-  Mis Categorias

   -  Diversion

      -  Deportes

         -  Surfing
         -  Skating

      -  Amigos

         -  Gerald
         -  Gwendolyn

   -  Trabajo

      -  Reportes

         -  Anual
         -  Status

      -  Viajes

         -  Nacional
         -  Internacional

-  Otra Categoria

   -  Pesca **Movido**

Borrando datos
--------------

El comportamiento de arbol provee algunas formas para manejar la
eliminación de datos. Para comenzar con un ejemplo simple, diremos que
la categoria deportes ya no es necesaria. Para eliminarla *y cualquier
hijo que ella tenga* basta llamar a delete tal como lo harias en
cualquier modelo. Por ejemplo, en el siguiente código:

::

    // pseudo codigo de controlador
    $this->Category->id = 10;
    $this->Category->delete();

El arbol de categorias sería modificado como sigue:

-  Mis Categorias

   -  Diversion

      -  Deportes

         -  Surfing
         -  Skating

      -  Amigos

         -  Gerald
         -  Gwendolyn

   -  Trabajo

      -  Viajes

         -  Nacional
         -  Internacional

-  Otras Categorias

   -  Pesca

Haciendo consultas y usando tus datos
-------------------------------------

Usar y manipular datos jerarquicos puede ser algo complejo. Ademas de
los metodos de busqueda del nucleo como find(), con los arboles tenemos
unos cuantos metodos más para su manipulacion.

Muchos metodos del comportamiento de arbol devuelven y se apoyan en el
orden del campo ``lft``. Si llamas a ``find()`` y no ordenas por el
campo ``lft``, o llamas algun metodo de arboles entregandole un tipo de
ordenamiento, quizas obtengas resultados no deseados.

El método children
~~~~~~~~~~~~~~~~~~

El método ``children`` toma la llave primaria (id) de una fila y retorna
los hijos, por defecto en el roden en que aparecen en el árbol. El
segundo parámetro es opcional y define si se entregan o no sólo los
hijos directos. Usando el ejemplo de la sección anterior:

::

    $allChildren = $this->Category->children(1); // un arreglo plano con 11 valores
    // -- o bien --
    $this->Category->id = 1;
    $allChildren = $this->Category->children(); // un arreglo plano con 11 valores

    // Retornar solo los hijos directos
    $directChildren = $this->Category->children(1, true); //un arreglo plano con 2 valores

Si quieres un arreglo recursivo utiliza ``find('threaded')``

Contando los hijos
~~~~~~~~~~~~~~~~~~

Tal como el método ``children``, ``childCount`` toma la llave primaria
(id) y retorna cuantos hijos tiene. El segundo parámetro es opcional y
define si se contarán o no los hijos directos. Usando los datos del
ejemplo anterior:

::

    $totalChildren = $this->Category->childCount(1); // entrega 11
    // -- o bien --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // entrega 11

    //Solo los hijos directos
    $numChildren = $this->Category->childCount(1, true); // entrega 2

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist($conditions = null, $keyPath = null, $valuePath = null, $spacer= '_', $recursive = null)``

Este método retorna la data de forma similar a find('list'), mostrando
la data identada mediante el uso de un prefijo. A continuación se
muestra un ejemplo de los que se debe esperar de este método. Vea el api
para más información acerca de los parámetros.

::

    array(
        [1] =>  "My Categories",
        [2] =>  "_Fun",
        [3] =>  "__Sport",
        [4] =>  "___Surfing",
        [16] => "___Skating",
        [6] =>  "__Friends",
        [7] =>  "___Gerald",
        [8] =>  "___Gwendolyn",
        [9] =>  "_Work",
        [13] => "__Trips",
        [14] => "___National",
        [15] => "___International",
        [17] => "Other People's Categories",
        [5] =>  "_Extreme fishing"
    )

getparentnode
~~~~~~~~~~~~~

Esta función devolverá, como el nombre lo indica, el nodo padre de
cualquier nodo. En caso de que el nodo no tenga un padre, entonces
devolverá falso. (Por ejemplo, el nodo raiz). Ejemplo:

::

    $parent = $this->Category->getparentnode(2); //<- id de Diversión
    // $parent contiene al padre del nodo Diversión, es decir, el nodo raíz.

getpath
~~~~~~~

The 'path' when refering to hierachial data is how you get from where
you are to the top. So for example the path from the category
"International" is:

-  My Categories

   -  ...
   -  Work

      -  Trips

         -  ...
         -  International

Using the id of "International" getpath will return each of the parents
in turn (starting from the top).

::

    $parents = $this->Category->getpath(15);

::

    // contents of $parents
    array(
        [0] =>  array('Category' => array('id' => 1, 'name' => 'My Categories', ..)),
        [1] =>  array('Category' => array('id' => 9, 'name' => 'Work', ..)),
        [2] =>  array('Category' => array('id' => 13, 'name' => 'Trips', ..)),
        [3] =>  array('Category' => array('id' => 15, 'name' => 'International', ..)),
    )

Uso Avanzado
============

Este comportamiento de modelo no sólo trabaja en segundo plano, hay una
gran variedad de métodos específicos definidos en este comportamiento
para antender todas tus necesidades de datos jerárquicos, y cualquier
problema inesperado que pueda surgir en el proceso.

moveDown
--------

Utilizado para mover un único nodo hacia abajo del árbol. Debes indicar
el *ID* del elemento a mover y un número entero positivo de cuantas
posiciones el nodo debería ser movido hacia abajo. Todos los nodos hijos
del nodo a mover también serán movidos

Un ejemplo de una acción de controlador (en un controlador llamado
Categories) que mueve un nodo hacia abajo del arbol:

::

    function movedown($name = null, $delta = null) {
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('No hay una categoría de nombre ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Por favor indique el número de posiciones que el nodo debe ser movido hacia abajo.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        }

Por ejemplo, si quicieras mover la categoría "Sport" un nivel hacia
abajo, deberías llamar a: /categories/movedown/Sport/1.

moveUp
------

Used to move a single node up the tree. You need to provide the ID of
the element to be moved and a positive number of how many positions the
node should be moved up. All child nodes will also be moved.

Here's an example of a controller action (in a controller named
Categories) that moves a node up the tree:

::

    function moveup($name = null, $delta = null){
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('There is no category named ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveup($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Please provide a number of positions the category should be moved up.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        
        }

For example, if you would like to move the category "Gwendolyn" up one
position you would request /categories/moveup/Gwendolyn/1. Now the order
of Friends will be Gwendolyn, Gerald.

removeFromTree
--------------

::

  removeFromTree($id=null, $delete=false)

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </es/view/690/delete>`_, which for a model
using the tree behavior will remove the specified node and all of its
children.

Taking the following tree as a starting point:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme knitting
         -  Skating

Running the following code with the id for 'Sport'

::

    $this->Node->removeFromTree($id); 

The Sport node will be become a top level node:

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

-  Sport **Moved**

This demonstrates the default behavior of ``removeFromTree`` of moving
the node to have no parent, and re-parenting all children.

If however the following code snippet was used with the id for 'Sport'

::

    $this->Node->removeFromTree($id,true); 

The tree would become

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

This demonstrates the alternate use for ``removeFromTree``, the children
have been reparented and 'Sport' has been deleted.

reorder
-------

This method can be used to sort hierarchical data.

Data Integrity
==============

Due to the nature of complex self referential data structures such as
trees and linked lists, they can occasionally become broken by a
careless call. Take heart, for all is not lost! The Tree Behavior
contains several previously undocumented features designed to recover
from such situations.

These functions that may save you some time are:

recover(&$model, $mode = 'parent', $missingParentAction = null)

The mode parameter is used to specify the source of info that is
valid/correct. The opposite source of data will be populated based upon
that source of info. E.g. if the MPTT fields are corrupt or empty, with
the $mode 'parent' the values of the parent\_id field will be used to
populate the left and right fields. The missingParentAction parameter
only applies to "parent" mode and determines what to do if the parent
field contains an id that is not present.

reorder(&$model, $options = array())

Reorders the nodes (and child nodes) of the tree according to the field
and direction specified in the parameters. This method does not change
the parent of any node.

The options array contains the values 'id' => null, 'field' =>
$model->displayField, 'order' => 'ASC', and 'verify' => true, by
default.

verify(&$model)

Returns true if the tree is valid otherwise an array of (type, incorrect
left/right index, message).
