Tree (Baumstruktur)
###################

Es ist ganz normal auch hierarchische Daten in einer Datenbank zu
speichern. Zum Beispiel möchte man Kategorien mit unbegrenzten
Unterkategorien oder Daten in einem unbegrenzten Multilevel Menüsystem
speichern. Auch die ACL Logik basiert auf einer Baumstruktur.

Für kleine Bäume - oder wo nur wenige Level tief Daten verschachtelt
werden - reicht es aus, eine ``parent_id`` zu haben. Anhand dieser lässt
sich dann leicht die Hierarchische Struktur ablesen. Zusammen mit
cakePHP kommt ein mächtiges Verhalten (``Behavior``), das sich ``Tree``
nennt. Mit diesem ist es möglich, sogenannte `MPTT
Bäume <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_
aufzubauen und zu bedienen. Und das alles, ohne sich näher mit der
Technik auseinandersetzen zu müssen, solange man das nicht möchte ;).

Anforderungen
=============

Um das Baumverhalten zu benutzen, muss Deine Tabelle folgende 3 Felder
haben. Alle Felder sind als ``int``-Wert angegeben.

-  parent - Standard ist ``parent_id``, speichert die Beziehung zum
   übergeordnetem Element
-  Links - Standard ist ``lft``, speichert die Beziehung nach links der
   aktuellen Zeile.
-  Rechts - Standard ist ``rght``, speichert die Beziehung nach rechts
   der aktuellen Zeile.

Wenn Du Dich mit der MPTT Logik auskennst, wunderst Du Dich vielleicht
warum man noch die ``parent_id`` benötigt. Das ist ganz einfach: Manche
Dinge lassen sich eben noch einfacher und schneller lösen, wenn man die
``parent_id`` noch hat - zum Beispiel um alle Kinder-Elemente zu finden.

Grundsätzliche Benutzung
========================

Im tree-Behavior sind viele Komponenten enthalten, aber an dieser Stelle
wird zunächst mit einem einfachen Beispiel begonnen, in dem die folgende
Datenbank mit einigen Daten erzeugt wird:

::

    CREATE TABLE categories (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(1, 'My Categories', NULL, 1, 30);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(2, 'Fun', 1, 2, 15);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(3, 'Sport', 2, 3, 8);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surfing', 3, 4, 5);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(5, 'Extreme knitting', 3, 6, 7);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(6, 'Friends', 2, 9, 14);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(7, 'Gerald', 6, 10, 11);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(8, 'Gwendolyn', 6, 12, 13);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(9, 'Work', 1, 16, 29);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(10, 'Reports', 9, 17, 22);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(11, 'Annual', 10, 18, 19);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(12, 'Status', 10, 20, 21);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(13, 'Trips', 9, 23, 28);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(14, 'National', 13, 24, 25);
    INSERT INTO `categories` (`id`, `name`, `parent_id`, `lft`, `rght`) VALUES(15, 'International', 13, 26, 27);

Um zu testen, ob alles korrekt installiert wurde, kann man eine
Test-Methode erzeugen und den Inhalt des Kategorie-Trees ausgeben
lassen. Dies geht mit folgendem, einfachen Controller:

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

und dieser noch einfacheren Model-Definition:

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

Durch Aufrufen von /categories kann getestet werden, wie der Tree
aussieht. Der Tree sollte in etwa so aussehen:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme knitting

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

Daten hinzufügen
----------------

Im vorherigen Abschnitt wurden vorhandene Daten genutzt und
sichergestellt, dass diese mit der Methode ``generatetreelist``
hierarchisch dargestellt wurden. Das Hinzufügen von Daten funktioniert
normalerweise so wie bei jedem anderen Model auch. Siehe dazu folgendes
Beispiel:

::

    // pseudo controller code
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Skating';
    $this->Category->save($data);

Bei Verwendung des Tree-Behaviors ist es nicht notwendig, mehr als
parent\_id zu setzen, da das Tree-Behavior den Rest übernimmt. Wird
parent\_id nicht gesetzt, wird das neue Element als neues Top-Element
eingefügt:

::

    // pseudo controller code
    $data = array();
    $data['Category']['name'] =  'Other People\'s Categories';
    $this->Category->save($data);

Das Ausführen dieser beiden Code-Schnipsel führt folgende Veränderungen
am Baum durch:

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

Daten löschen
-------------

Das tree-Behavior stellt mehrere Möglichkeiten zum Löschen von Daten zur
Verfügung. Um mit dem einfachsten Beispiel zu beginnen sagen wir, dass
die Kategorie reports nicht mehr benötigt wird. Um diese Kategorie *und
eventuell vorhandene Kinder* zu löschen, ruft man einfach delete so auf,
wie man das bei jedem beliebigen Model auch tun würde, z.B. mit dem
folgenden Code:

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

Kindknoten zählen
~~~~~~~~~~~~~~~~~

Genauso woe die Methode ``children``, erwartet auch ``childCount`` den
primary key value (das id-Feld) eines Datensatzes und liefert uns die
Anzahl der Kindknoten zurück. Der zweite optionale Parameter gibt an, ob
nur direkte Kindknoten der nachfolgenden Generation gezählt werden
sollen. Wir benutzen einfach das Beispiel aus der vorherigen Sektion:

::

    $totalChildren = $this->Category->childCount(1); // gibt 11 zurück
    // -- or --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // gibt 11 zurück

    // Nur Kindknoten der direkt nachfolgenden Generation jeder Kategorie werden gezählt
    $numChildren = $this->Category->childCount(1, true); // gibt 2 zurück

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

This method will return data similar to find('list'), with an indented
prefix to show the structure of your data. Below is an example of what
you can expect this method to return see the api for the other find-like
parameters.

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
control than ```delete()`` </de/view/690/delete>`_, which for a model
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
