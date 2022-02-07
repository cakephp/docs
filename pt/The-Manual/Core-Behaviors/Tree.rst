Tree (Árvore)
#############

É comum necessitar exibir dados hierárquiamente de alguma tabela do
banco de dados. Exemplos de tais dados podem ser categorias com
subcategorias, com diversos níveis, dados relativos a um sistema de menu
com multiníveis ou assim como uma representação de hirearquia, como é
utilizado para armazenar os objetos do ACL.

Para pequenas árvores de dados, ou quando os dados possuem apenas alguns
níveis, é simples adicionar campos como parent\_id, e utilizar esse
campo para determinar o parente do dados, assim conseguindo exibir em
uma estrutura hierárquica. Bundled com o cake no entanto, provem um
poderoso behavior que permite usar os benefícios do `MPTT
logic <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_,
sem se preocupar com com nada de técnica, ao menos que você quiser ;)

Requisitos
==========

Para usar o Tree behaviour, sua tabela da base de dados precisa dos três
campos que estão listados a seguir (todos são inteiros):

-  pai - nome do campo padrão é parent\_id, usado para armazenar o id do
   objeto pai
-  esquerda - nome do campo padrão é lft, usado para armazenar o valor
   da esquerda da atual linha.
-  direita - nome do campo padrão é rght, usado para armazenar o valor
   da direita da atual linha.

Se você está acostumado com a lógica MPTT, irá se perguntar o porquê de
haver um campo pai - simplesmente porque é mais fácil fazer determinadas
tarefas se existir um link para o pai armazenado na base de dados -
como, por exemplo, quais filhos estão ligados diretamente a um item pai.

Uso Básico
==========

O behavior tree tem bastante funcionalidade dentro dele, porém vamos
começar com um simples exemplo - criamos a tabela no banco de dados e
vamos por alguns dados:

::

    CREATE TABLE categorias (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        nome VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(1, 'Minhas categorias', NULL, 1, 30);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(2, 'Divertidos', 1, 2, 15);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(3, 'Esportes', 2, 3, 8);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surf', 3, 4, 5);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(5, 'Padel', 3, 6, 7);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(6, 'Amigos', 2, 9, 14);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(7, 'Thiago', 6, 10, 11);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(8, 'Geraldo', 6, 12, 13);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(9, 'Trabalho', 1, 16, 29);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(10, 'Relatórios', 9, 17, 22);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(11, 'Anuais', 10, 18, 19);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(12, 'Status', 10, 20, 21);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(13, 'Viagens', 9, 23, 28);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(14, 'Nacionais', 13, 24, 25);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(15, 'Internacionais', 13, 26, 27);

Com o intuito de verificar se tudo está correto, nós podemos criar um
método de teste e mostrar os conteúdos da nossa árvore de categoria para
ver o que aparece. Com um simples controller:

::

    <?php
    class CategoriasController extends AppController {

            var $name = 'categorias';
            
            function index() {
                    $this->data = $this->Categoria->generatetreelist(null, null, null, '&nbsp;&nbsp;&nbsp;');
                    debug ($this->data); die;       
            }
    }
    ?>

an an even simpler model definition:

::

    <?php
    // app/models/categoria.php
    class Categoria extends AppModel {
        var $name = 'Categoria';
        var $actsAs = array('Tree');
    }
    ?>

Nós podemos verificar que a nossa árvore de categoria mostra, acessando
/categorias Você ira ver algo do tipo:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

Adicionar dados
---------------

Na sessão anterior, nos usamos uma data existente e verificamos como
ficou a hirearquia usando o méotodo ``generatetreelist``. No entando,
geralmente é necessário você adicionar os dados da mesma maneira que
qualquer outro modelo. Por exemplo:

::

    // pseudo controller code
    $data['Categoria']['parent_id'] =  3;
    $data['Categoria']['name'] =  'Skating';
    $this->Categoria->save($data);

Quando usamos o tree behavior isto não é necessário fazer nada a mais,
apenas setar o parent\_id e o tree behavior vai cudar do resto. Se você
não setar o parent\_id, o tree behavior vai adicionar na árvore uma nova
entrada no nível do topo:

::

    // pseudo controller code
    $data = array();
    $data['Category']['name'] =  'Other People\'s Categories';
    $this->Category->save($data);

Rodando os dois códigos acima, você ira receber os seguintes resultados:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel
         -  Skating **New**

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Nova Categoria **New**

Modificando dados
-----------------

A modificação de dados é tão transparente como a adição de novos dados.
Se você modificar alguma coisa, mas não alterar o campo parent\_id - a
estrutura de seus dados permanecerão inalterados. Por exemplo:

::

    // pseudo controller code
    $this->Category->id = 5; // id do Padel
    $this->Category->save(array('name' =>'Pesca Extrema'));

O código acima não afeta o campo parent\_id - mesmo que o parent\_id
seja incluído nos dados que são passados para serem salvos, se o valor
não muda, a estrutura de dados não é alterada. Portanto a árvore de
dados passaria a ser semelhante a:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Pesca Extrema **Atualizado**
         -  Skating

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Categorias de outras pessoas

Movendo dados em torno de sua árvore é também um caso simples. Vamos
dizer que a Pesca Extrema não pertence ao abrigo Sport, mas deve estar
localizado nas Categorias de outras pessoas. Com o seguinte código:

::

    // pseudo controller code
    $this->Category->id = 5; // id do Pesca Extrema
    $newParentId = $this->Category->field('id', array('name' => 'Categorias de outras pessoas'));
    $this->Category->save(array('parent_id' => $newParentId)); 

Como era de esperar que a estrutura fosse modificada para:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Skating

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Categorias de outras pessoas

   -  Pesca Extrema **Movido**

Deletando dados
---------------

O tree behaviour provem maneiras de deletar dados. Para começar podemos
fazer um simples exemplo para testar; vamos dizer que a categoria
"relatórios", não é tão usada. Para remover isso *e todas os filhos que
este tem* apenas chame o delete igual usamos para qualquer modelo. Para
exemplificar segue o código:

::

    // pseudo controller code
    $this->Categoria->id = 10;
    $this->Categoria->delete();

A árvore de categoria deve ficar como em baixo:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel
         -  Skating

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Nova Categoria

Querying and using your data
----------------------------

Using and manipulating hierarchical data can be a tricky business. In
addition to the core find methods, with the tree behavior there are a
few more tree-orientated permutations at your disposal.

Most tree behavior methods return and rely on data being sorted by the
``lft`` field. If you call ``find()`` and do not order by ``lft``, or
call a tree behavior method and pass a sort order, you may get
undesirable results.

Children
~~~~~~~~

The ``children`` method takes the primary key value (the id) of a row
and returns the children, by default in the order they appear in the
tree. The second optional parameter defines whether or not only direct
children should be returned. Using the example data from the previous
section:

::

    $allChildren = $this->Category->children(1); // a flat array with 11 items
    // -- or --
    $this->Category->id = 1;
    $allChildren = $this->Category->children(); // a flat array with 11 items

    // Only return direct children
    $directChildren = $this->Category->children(1, true); // a flat array with 2 items

If you want a recursive array use ``find('threaded')``

**Parameters for this function include:**

-  **$id**: The ID of the record to look up
-  **$direct**: Set to true to return only the direct descendants
-  **$fields**: Single string field name or array of fields to include
   in the return
-  **$order**: SQL string of ORDER BY conditions
-  **$limit**: SQL LIMIT statement
-  **$page**: for accessing paged results
-  **$recursive**: Number of levels deep for recursive associated Models

Counting children
~~~~~~~~~~~~~~~~~

As with the method ``children``, ``childCount`` takes the primary key
value (the id) of a row and returns how many children it has. The second
optional parameter defines whether or not only direct children are
counted. Using the example data from the previous section:

::

    $totalChildren = $this->Category->childCount(1); // will output 11
    // -- or --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // will output 11

    // Only counts the direct descendants of this category
    $numChildren = $this->Category->childCount(1, true); // will output 2

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

This method will return data similar to
```find('list')`` </pt/view/1022/find-list>`_, with an indented prefix
to show the structure of your data. Below is an example of what you can
expect this method to return.

-  ``$conditions`` - Uses the same conditional options as find().
-  ``$keyPath`` - Path to the field to use for the key.
-  ``$valuePath`` - Path to the field to use for the label.
-  ``$spacer`` - The string to use in front of each item to indicate
   depth.
-  ``$recursive`` - The number of levels deep to fetch associated
   records

All the parameters are optional, with the following defaults:

-  ``$conditions`` = ``null``
-  ``$keyPath`` = Model's primary key
-  ``$valuePath`` = Model's displayField
-  ``$spacer`` = ``'_'``
-  ``$recursive`` = Model's recursive setting

::

    $treelist = $this->Category->generatetreelist();

Output:

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

This convenience function will, as the name suggests, return the parent
node for any node, or *false* if the node has no parent (its the root
node). For example:

::

    $parent = $this->Category->getparentnode(2); //<- id for fun
    // $parent contains All categories

getpath
~~~~~~~

``getpath( $id = null, $fields = null, $recursive = null )``

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

Advanced Usage
==============

The tree behavior doesn't only work in the background, there are a
number of specific methods defined in the behavior to cater for all your
hierarchical data needs, and any unexpected problems that might arise in
the process.

moveDown
--------

Used to move a single node down the tree. You need to provide the ID of
the element to be moved and a positive number of how many positions the
node should be moved down. All child nodes for the specified node will
also be moved.

If the node is the last child, or is a top level node with no subsequent
node this method will return false.

Here is an example of a controller action (in a controller named
Categories) that moves a specified node down the tree:

::

    function movedown($name = null, $delta = null) {
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('There is no category named ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Please provide the number of positions the field should be moved down.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        }

For example, if you'd like to move the "Sport" category one position
down, you would request: /categories/movedown/Sport/1.

moveUp
------

Used to move a single node up the tree. You need to provide the ID of
the element to be moved and a positive number of how many positions the
node should be moved up. All child nodes will also be moved.

If the node is the first child, or is a top level node with no previous
node this method will return false.

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
                $this->Category->moveUp($this->Category->id, abs($delta));
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

``removeFromTree($id=null, $delete=false)``

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </pt/view/1316/delete>`_, which for a model
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

``reorder ( array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true) )``

Reorders the nodes (and child nodes) of the tree according to the field
and direction specified in the parameters. This method does not change
the parent of any node.

::

    $model->reorder(array(
        'id' => ,    //id of record to use as top node for reordering, default: $Model->id
        'field' => , //which field to use in reordering, default: $Model->displayField
        'order' => , //direction to order, default: 'ASC'
        'verify' =>  //whether or not to verify the tree before reorder, default: true
    ));

If you have saved your data or made other operations on the model, you
might want to set ``$model->id = null`` before calling ``reorder``.
Otherwise only the current node and it's children will be reordered.

Data Integrity
==============

Due to the nature of complex self referential data structures such as
trees and linked lists, they can occasionally become broken by a
careless call. Take heart, for all is not lost! The Tree Behavior
contains several previously undocumented features designed to recover
from such situations.

Recover
-------

``recover(&$model, $mode = 'parent', $missingParentAction = null)``

The ``mode`` parameter is used to specify the source of info that is
valid/correct. The opposite source of data will be populated based upon
that source of info. E.g. if the MPTT fields are corrupt or empty, with
the ``$mode 'parent'`` the values of the ``parent_id`` field will be
used to populate the left and right fields. The ``missingParentAction``
parameter only applies to "parent" mode and determines what to do if the
parent field contains an id that is not present.

Available ``$mode`` options:

-  ``'parent'`` - use the existing ``parent_id``'s to update the ``lft``
   and ``rght`` fields
-  ``'tree'`` - use the existing ``lft`` and ``rght`` fields to update
   ``parent_id``

Available ``missingParentActions`` options when using ``mode='parent'``:

-  ``null`` - do nothing and carry on
-  ``'return'`` - do nothing and return
-  ``'delete'`` - delete the node
-  ``int`` - set the parent\_id to this id

::

    // Rebuild all the left and right fields based on the parent_id
    $this->Category->recover();
    // or
    $this->Category->recover('parent');
     
    // Rebuild all the parent_id's based on the lft and rght fields
    $this->Category->recover('tree');

Reorder
-------

``reorder(&$model, $options = array())``

Reorders the nodes (and child nodes) of the tree according to the field
and direction specified in the parameters. This method does not change
the parent of any node.

Reordering affects all nodes in the tree by default, however the
following options can affect the process:

-  ``'id'`` - only reorder nodes below this node.
-  ``'field``' - field to use for sorting, default is the
   ``displayField`` for the model.
-  ``'order'`` - ``'ASC'`` for ascending, ``'DESC'`` for descending
   sort.
-  ``'verify'`` - whether or not to verify the tree prior to resorting.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

::

    array(
        'id' => null,
        'field' => $model->displayField,
        'order' => 'ASC',
        'verify' => true
    )

Verify
------

``verify(&$model)``

Returns ``true`` if the tree is valid otherwise an array of errors, with
fields for type, incorrect index and message.

Each record in the output array is an array of the form (type, id,
message)

-  ``type`` is either ``'index'`` or ``'node'``
-  ``'id'`` is the id of the erroneous node.
-  ``'message'`` depends on the error

::

        $this->Categories->verify();

Example output:

::

    Array
    (
        [0] => Array
            (
                [0] => node
                [1] => 3
                [2] => left and right values identical
            )
        [1] => Array
            (
                [0] => node
                [1] => 2
                [2] => The parent node 999 doesn't exist
            )
        [10] => Array
            (
                [0] => index
                [1] => 123
                [2] => missing
            )
        [99] => Array
            (
                [0] => node
                [1] => 163
                [2] => left greater than right
            )

    )

