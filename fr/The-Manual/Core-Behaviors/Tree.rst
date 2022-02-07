Tree
####

C'est assez courant de vouloir stocker ses données sous une forme
hiérarchique dans la table d'une base de données. Des exemples de tels
besoins pourraient être des catégories avec un nombre illimité de
sous-catégories, des données en relation avec un système de menu
multi-niveaux ou une représentation littérale d'une hiérarchie, comme
celle qui est utilisée pour stocker les objets de contrôle d'accès avec
la logique ACL.

Pour de petits arbres de données et les cas où les données n'ont que
quelques niveaux de profondeurs, c'est simple d'ajouter un champ
parent\_id à votre table et de l'utiliser pour savoir quel objet est le
parent de quel autre. En natif avec CakePHP, il existe cependant un
moyen puissant d'avoir les bénéfices de `la logique
MPTT <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_,
sans avoir à connaître les détails de l'implémentation technique - à
moins que ça ne vous intéresse ;).

Pré-requis
==========

Pour utiliser le comportement en Arbre (*TreeBehavior*), votre table
nécessite 3 champs tels que listés ci-dessous (tous sont des entiers) :

-  parent - le nom du champ par défaut est parent\_id, pour stocker l'id
   de l'objet parent.
-  left - le nom du champ par défaut est lft, pour stocker la valeur lft
   de la ligne courante.
-  right - le nom du champ par défaut est rght, pour stocker la valeur
   rght de la ligne courante.

Si vous êtes familier de la logique MPTT vous pouvez vous demander
pourquoi un champ parent existe - parce qu'il est tout bonnement plus
facile d'effectuer certaines tâches à l'usage, si un lien parent direct
est stocké en base, comme rechercher les enfants directs.

Le champ ``parent`` doit être capable d'avoir une valeur NULL ! Cela
pourrait sembler fonctionner, si vous donnez juste une valeur parente de
zéro aux éléments de premier niveau, mais réordonner l'arbre (et sans
doute d'autres opérations) échouera.

Utilisation basique
===================

Le comportement en arbre de données (Tree behavior) possède beaucoup de
fonctionnalités, mais commençons avec un exemple simple. Créons la table
suivante :

::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'Mes  Catégories', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, 'Fun', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'Sport', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surf', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'Tricot extrême', 3, 6, 7);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(6, 'Amis', 2, 9, 14);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(7, 'Gérard', 6, 10, 11);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(8, 'Gwendoline', 6, 12, 13);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(9, 'Travail', 1, 16, 29);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(10, 'Rapports', 9, 17, 22);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(11, 'Annuel', 10, 18, 19);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(12, 'Statut', 10, 20, 21);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(13, 'Voyages', 9, 23, 28);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(14, 'National', 13, 24, 25);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(15, 'International', 13, 26, 27);

Dans le but de vérifier que tout est défini correctement, nous pouvons
créer une méthode de test et afficher les contenus de notre arbre de
catégories, pour voir à quoi il ressemble. Avec un simple contrôleur :

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

et une définition de modèle encore plus simple :

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

Nous pouvons vérifier à quoi ressemble les données de notre arbre de
catégories, en visitant /categories. Vous devriez voir quelque chose
comme :

-  Mes Catégories

   -  Fun

      -  Sport

         -  Surf
         -  Tricto extrême

      -  Amis

         -  Gérard
         -  Gwendoline

   -  Travail

      -  Rapports

         -  Annuel
         -  Statut

      -  Voyages

         -  National
         -  International

Adding data
-----------

In the previous section, we used existing data and checked that it
looked hierarchal via the method ``generatetreelist``. However, usually
you would add your data in exactly the same way as you would for any
model. For example:

::

    // pseudo controller code
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Skating';
    $this->Category->save($data);

When using the tree behavior its not necessary to do any more than set
the parent\_id, and the tree behavior will take care of the rest. If you
don't set the parent\_id, the tree behavior will add to the tree making
your new addition a new top level entry:

::

    // pseudo controller code
    $data = array();
    $data['Category']['name'] =  'Other People\'s Categories';
    $this->Category->save($data);

Running the above two code snippets would alter your tree as follows:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme knitting
         -  Skating **New**

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Reports

         -  Annual
         -  Status

      -  Trips

         -  National
         -  International

-  Other People's Categories **New**

Modifying data
--------------

Modifying data is as transparent as adding new data. If you modify
something, but do not change the parent\_id field - the structure of
your data will remain unchanged. For example:

::

    // pseudo controller code
    $this->Category->id = 5; // id of Extreme knitting
    $this->Category->save(array('name' =>'Extreme fishing'));

The above code did not affect the parent\_id field - even if the
parent\_id is included in the data that is passed to save if the value
doesn't change, neither does the data structure. Therefore the tree of
data would now look like:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme fishing **Updated**
         -  Skating

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Reports

         -  Annual
         -  Status

      -  Trips

         -  National
         -  International

-  Other People's Categories

Moving data around in your tree is also a simple affair. Let's say that
Extreme fishing does not belong under Sport, but instead should be
located under Other People's Categories. With the following code:

::

    // pseudo controller code
    $this->Category->id = 5; // id of Extreme fishing
    $newParentId = $this->Category->field('id', array('name' => 'Other People\'s Categories'));
    $this->Category->save(array('parent_id' => $newParentId)); 

As would be expected the structure would be modified to:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Skating

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Reports

         -  Annual
         -  Status

      -  Trips

         -  National
         -  International

-  Other People's Categories

   -  Extreme fishing **Moved**

Deleting data
-------------

The tree behavior provides a number of ways to manage deleting data. To
start with the simplest example; let's say that the reports category is
no longer useful. To remove it *and any children it may have* just call
delete as you would for any model. For example with the following code:

::

    // pseudo controller code
    $this->Category->id = 10;
    $this->Category->delete();

The category tree would be modified as follows:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Skating

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Trips

         -  National
         -  International

-  Other People's Categories

   -  Extreme fishing

Interroger et utiliser vos données
----------------------------------

Utiliser et manipuler des données hiérarchisées peut s'avérer assez
difficile. C'est pourquoi le comportement tree met à votre disposition
quelques méthodes de permutations en plus des méthodes find de bases.

La plupart des méthodes de tree se basent et renvoient des données
triées en fonction du champ ``lft``. Si vous appelez ``find()`` sans
trier en fonction de ``lft``, ou si vous faites une demande de tri sur
un tree, vous risquez d'obtenir des résultats inattendus.

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

childCount
~~~~~~~~~~

Cette méthode compte les enfants d'un enregistrement donnée. Vous pouvez
avoir le nombre total de descendants ou seulement les descendants
directs.

::

    // Compte tous les sous catégories descendantes de la catégorie avec l'id = 5
    $numChildren = $this->Category->childCount(5);
    // -- or --
    $this->Category->id = 5;
    $numChildren = $this->Category->childCount();

    // Compte seulement les descendants directs
    $numChildren = $this->Category->childCount(5, true);

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist (&$model, $conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

Cette méthode retourne des données similaires à un find('list'), avec un
préfixe d'indentation pour mettre en évidence la structure de l'arbre.
Voici un exemple de rendu de cette méthode.

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

L'utilitée de cette fonction est, comme son nom l'indique, de retourner
la node parente d'une node, ou *false* si la node n'as pas de node
parente (node racine). Exemple:

::

    $parent = $this->Category->getparentnode(2); //<- id pour fun
    // $parent contient All categories

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

Autres méthodes
===============

Le comportement en arbre de données (Tree behavior) ne travaille pas
seulement en arrière plan, il y a une certains nombres de méthodes
spécifiques définies dans ce comportemant (bahavior) qui peuvent être
appélées directement : Ci-dessous une description brève et un exemple
pour chacune d'entre elles:

moveDown
--------

Utilisé pour descendre un noeud dans l'arbre hiérarchique. Vous devez
spécifier l'id de l'élément à descendre et un entier positif spécifiant
de combien de positions le noeud devrait être descendu. Tous les
sous-noeuds seront également déplacés dans l'arbre.

Ci-dessus un exemple d'une action d'un contrôleur (dans un contrôleur
nommé Categories) qui déplace un noeud spécifique dans l'arbre
hiérarchique:

::

    function movedown($title = null, $delta = null) {
            $cat = $this->Category->findByTitle($title);
            if (empty($cat)) {
                $this->Session->setFlash('Aucune catégorie ne porte le nom ' . $title);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de préciser de combien de crans le noeud doit être déplacé'); 
            }
        
            $this->redirect(array('action' => 'show'), null, true);
        }

Par exemple, si vous vouliez déplacer la catégories "Cookies" d'un cran
vers la bas, votre requête serait : /categories/movedown/Cookies/1.

moveUp
------

Utilisé pour déplacer vers le haut un seul nœud dans l'arbre
hiérarchique. Vous devez spécifier l'id de l'élément à déplacer et un
entier positif spécifiant de combien de positions le nœud devra être
déplacé. Tous les nœuds enfants seront également déplacés.

Ci-dessous un exemple d'une action de contrôleur (dans un contrôleur
nommé Categories) qui déplace un nœud spécifique dans l'arbre :

::

    function moveup($name = null, $delta = null){
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('Il n\'y a pas de catégorie nommée ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveup($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Merci de préciser de combien de positions la catégorie doit être montée.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        
        }

Par exemple, si vous voulez déplacer la catégorie "Gwendolyn" d'un cran
vers le haut, votre requête sera : /categories/moveup/Gwendolyn/1.
Maintenant l'ordre de Friends sera Gwendolyn, Gerald.

removeFromTree
--------------

``removeFromTree($id=null, $delete=false)``

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </fr/view/1316/delete>`_, which for a model
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

Cette méthode peut être utilisée pour trier hiérarchiquement les
données.

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

