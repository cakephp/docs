Tree
####

.. php:class:: TreeBehavior()

It's fairly common to want to store hierarchical data in a database
table. Examples of such data might be categories with unlimited
subcategories, data related to a multilevel menu system or a
literal representation of hierarchy such as is used to store access
control objects with ACL logic.

For small trees of data, or where the data is only a few levels
deep it is simple to add a parent\_id field to your database table
and use this to keep track of which item is the parent of what.
Bundled with cake however, is a powerful behavior which allows you
to use the benefits of
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_
without worrying about any of the intricacies of the technique -
unless you want to ;).

Requirements
============

To use the tree behavior, your database table needs 3 fields as
listed below (all are ints):

-  parent - default fieldname is parent\_id, to store the id of the
   parent object
-  left - default fieldname is lft, to store the lft value of the
   current row.
-  right - default fieldname is rght, to store the rght value of
   the current row.

If you are familiar with MPTT logic you may wonder why a parent
field exists - quite simply it's easier to do certain tasks if a
direct parent link is stored on the database - such as finding
direct children.

.. note::

    The ``parent`` field must be able to have a NULL value! It might
    seem to work if you just give the top elements a parent value of
    zero, but reordering the tree (and possible other operations) will
    fail.

Basic Usage
===========

The tree behavior has a lot packed into it, but let's start with a
simple example - create the following database table and put some
data in it::

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

For the purpose of checking that everything is setup correctly, we
can create a test method and output the contents of our category
tree to see what it looks like. With a simple controller::

    <?php
    class CategoriesController extends AppController {
    
        public $name = 'Categories';
    
        function index() {
            $data = $this->Category->generateTreeList(null, null, null, '&nbsp;&nbsp;&nbsp;');
            debug($data); die;       
        }
    }

and an even simpler model definition:::

    <?php
    // app/Model/Category.php
    class Category extends AppModel {
        public $name = 'Category';
        public $actsAs = array('Tree');
    }

We can check what our category tree data looks like by visiting
/categories You should see something like this:


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




Adding data
-----------

In the previous section, we used existing data and checked that it
looked hierarchal via the method ``generateTreeList``. However,
usually you would add your data in exactly the same way as you
would for any model. For example::

    <?php
    // pseudo controller code
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Skating';
    $this->Category->save($data);

When using the tree behavior it's not necessary to do any more than
set the parent\_id, and the tree behavior will take care of the
rest. If you don't set the parent\_id, the tree behavior will add
to the tree making your new addition a new top level entry::

    <?php
    // pseudo controller code
    $data = array();
    $data['Category']['name'] =  'Other People\'s Categories';
    $this->Category->save($data);

Running the above two code snippets would alter your tree as
follows:


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
something, but do not change the parent\_id field - the structure
of your data will remain unchanged. For example::

    <?php
    // pseudo controller code
    $this->Category->id = 5; // id of Extreme knitting
    $this->Category->save(array('name' => 'Extreme fishing'));

The above code did not affect the parent\_id field - even if the
parent\_id is included in the data that is passed to save if the
value doesn't change, neither does the data structure. Therefore
the tree of data would now look like:


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

Moving data around in your tree is also a simple affair. Let's say
that Extreme fishing does not belong under Sport, but instead
should be located under Other People's Categories. With the
following code::

  <?php
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

The tree behavior provides a number of ways to manage deleting
data. To start with the simplest example; let's say that the
reports category is no longer useful. To remove it
*and any children it may have* just call delete as you would for
any model. For example with the following code::

  <?php
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

Using and manipulating hierarchical data can be a tricky business.
In addition to the core find methods, with the tree behavior there
are a few more tree-orientated permutations at your disposal.

.. note::

    Most tree behavior methods return and rely on data being sorted by
    the ``lft`` field. If you call ``find()`` and do not order by
    ``lft``, or call a tree behavior method and pass a sort order, you
    may get undesirable results.


.. php:class:: TreeBehavior

    .. php:method:: children($id = null, $direct = false, $fields = null, $order = null, $limit = null, $page = 1, $recursive = null)
    
    :param $id: The ID of the record to look up
    :param $direct: Set to true to return only the direct descendants
    :param $fields: Single string field name or array of fields to include in the return
    :param $order: SQL string of ORDER BY conditions
    :param $limit: SQL LIMIT statement
    :param $page: for accessing paged results
    :param $recursive: Number of levels deep for recursive associated Models

    The ``children`` method takes the primary key value (the id) of a
    row and returns the children, by default in the order they appear
    in the tree. The second optional parameter defines whether or not
    only direct children should be returned. Using the example data
    from the previous section::

        <?php
        $allChildren = $this->Category->children(1); // a flat array with 11 items
        // -- or --
        $this->Category->id = 1;
        $allChildren = $this->Category->children(); // a flat array with 11 items
  
        // Only return direct children
        $directChildren = $this->Category->children(1, true); // a flat array with 2 items

    .. note::

        If you want a recursive array use ``find('threaded')``

    .. php:method:: childCount($id = null, $direct = false)

    As with the method ``children``, ``childCount`` takes the primary
    key value (the id) of a row and returns how many children it has.
    The second optional parameter defines whether or not only direct
    children are counted. Using the example data from the previous
    section::

        <?php
        $totalChildren = $this->Category->childCount(1); // will output 11
        // -- or --
        $this->Category->id = 1;
        $directChildren = $this->Category->childCount(); // will output 11
    
        // Only counts the direct descendants of this category
        $numChildren = $this->Category->childCount(1, true); // will output 2

    .. php:method:: generateTreeList ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)

    :param $conditions: Uses the same conditional options as find().
    :param $keyPath: Path to the field to use for the key.
    :param $valuePath: Path to the field to use for the label.
    :param $spacer: The string to use in front of each item to indicate depth.
    :param $recursive: The number of levels deep to fetch associated records

    This method will return data similar to
    :ref:`model-find-list`, with an indented prefix
    to show the structure of your data. Below is an example of what you
    can expect this method to return::

      <?php
      $treelist = $this->Category->generateTreeList();

    Output::

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

    .. php:method:: getParentNode()

    This convenience function will, as the name suggests, return the
    parent node for any node, or *false* if the node has no parent (it's
    the root node). For example::

        <?php
        $parent = $this->Category->getParentNode(2); //<- id for fun
        // $parent contains All categories

    .. php:method:: getPath( $id = null, $fields = null, $recursive = null )

    The 'path' when referring to hierarchal data is how you get from
    where you are to the top. So for example the path from the category
    "International" is:


    -  My Categories
 
     -  ...
     -  Work
    
        -  Trips
       
           -  ...
           -  International




    Using the id of "International" getPath will return each of the
    parents in turn (starting from the top).::

        <?php
        $parents = $this->Category->getPath(15);

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
    number of specific methods defined in the behavior to cater for all
    your hierarchical data needs, and any unexpected problems that
    might arise in the process.

    .. php:method:: moveDown()

    Used to move a single node down the tree. You need to provide the
    ID of the element to be moved and a positive number of how many
    positions the node should be moved down. All child nodes for the
    specified node will also be moved.

    Here is an example of a controller action (in a controller named
    Categories) that moves a specified node down the tree::

        <?php
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

    For example, if you'd like to move the "Sport" category one
    position down, you would request: /categories/movedown/Sport/1.

    .. php:method:: moveUp()

    Used to move a single node up the tree. You need to provide the ID
    of the element to be moved and a positive number of how many
    positions the node should be moved up. All child nodes will also be
    moved.

    Here's an example of a controller action (in a controller named
    Categories) that moves a node up the tree::

        <?php
        function moveup($name = null, $delta = null) {
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

    For example, if you would like to move the category "Gwendolyn" up
    one position you would request /categories/moveup/Gwendolyn/1. Now
    the order of Friends will be Gwendolyn, Gerald.

    .. php:method:: removeFromTree($id=null, $delete=false)

    Using this method will either delete or move a node but retain its
    sub-tree, which will be reparented one level higher. It offers more
    control than :ref:`model-delete`, which for a model
    using the tree behavior will remove the specified node and all of
    its children.

    Taking the following tree as a starting point:


    -  My Categories

       -  Fun

          -  Sport

             -  Surfing
             -  Extreme knitting
             -  Skating




    Running the following code with the id for 'Sport'::

        <?php
        $this->Node->removeFromTree($id); 

    The Sport node will be become a top level node:


    -  My Categories

       -  Fun

          -  Surfing
          -  Extreme knitting
          -  Skating


    -  Sport **Moved**

    This demonstrates the default behavior of ``removeFromTree`` of
    moving the node to have no parent, and re-parenting all children.

    If however the following code snippet was used with the id for
    'Sport'::

        <?php
        $this->Node->removeFromTree($id, true); 

    The tree would become


    -  My Categories

       -  Fun

          -  Surfing
          -  Extreme knitting
          -  Skating



    This demonstrates the alternate use for ``removeFromTree``, the
    children have been reparented and 'Sport' has been deleted.

    .. php:method:: reorder(array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true))

    Reorders the nodes (and child nodes) of the tree according to the
    field and direction specified in the parameters. This method does
    not change the parent of any node.::

        <?php
        $model->reorder(array(
            'id' => ,    //id of record to use as top node for reordering, default: $Model->id
            'field' => , //which field to use in reordering, default: $Model->displayField
            'order' => , //direction to order, default: 'ASC'
            'verify' =>  //whether or not to verify the tree before reorder, default: true
        ));

    .. note::

        If you have saved your data or made other operations on the model,
        you might want to set ``$model->id = null`` before calling
        ``reorder``. Otherwise only the current node and it's children will
        be reordered.

Data Integrity
==============

    Due to the nature of complex self referential data structures such
    as trees and linked lists, they can occasionally become broken by a
    careless call. Take heart, for all is not lost! The Tree Behavior
    contains several previously undocumented features designed to
    recover from such situations.

    .. php:method:: recover($mode = 'parent', $missingParentAction = null)

    The ``mode`` parameter is used to specify the source of info that
    is valid/correct. The opposite source of data will be populated
    based upon that source of info. E.g. if the MPTT fields are corrupt
    or empty, with the ``$mode 'parent'`` the values of the
    ``parent_id`` field will be used to populate the left and right
    fields. The ``missingParentAction`` parameter only applies to
    "parent" mode and determines what to do if the parent field
    contains an id that is not present.

    Available ``$mode`` options:

    -  ``'parent'`` - use the existing ``parent_id``'s to update the
       ``lft`` and ``rght`` fields
    -  ``'tree'`` - use the existing ``lft`` and ``rght`` fields to
       update ``parent_id``

    Available ``missingParentActions`` options when using
    ``mode='parent'``:

    -  ``null`` - do nothing and carry on
    -  ``'return'`` - do nothing and return
    -  ``'delete'`` - delete the node
    -  ``int`` - set the parent\_id to this id

    Example::

        <?php
        // Rebuild all the left and right fields based on the parent_id
        $this->Category->recover();
        // or
        $this->Category->recover('parent');
     
        // Rebuild all the parent_id's based on the lft and rght fields
        $this->Category->recover('tree');


    .. php:method:: reorder($options = array())

    Reorders the nodes (and child nodes) of the tree according to the
    field and direction specified in the parameters. This method does
    not change the parent of any node.

    Reordering affects all nodes in the tree by default, however the
    following options can affect the process:

    -  ``'id'`` - only reorder nodes below this node.
    -  ``'field``' - field to use for sorting, default is the
       ``displayField`` for the model.
    -  ``'order'`` - ``'ASC'`` for ascending, ``'DESC'`` for descending
       sort.
    -  ``'verify'`` - whether or not to verify the tree prior to
       resorting.

    ``$options`` is used to pass all extra parameters, and has the
    following possible keys by default, all of which are optional::

        array(
            'id' => null,
            'field' => $model->displayField,
            'order' => 'ASC',
            'verify' => true
        )


    .. php:method:: verify()

    Returns ``true`` if the tree is valid otherwise an array of errors,
    with fields for type, incorrect index and message.

    Each record in the output array is an array of the form (type, id,
    message)

    -  ``type`` is either ``'index'`` or ``'node'``
    -  ``'id'`` is the id of the erroneous node.
    -  ``'message'`` depends on the error

    Example Use::

        <?php
        $this->Category->verify();

    Example output::

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



.. meta::
    :title lang=en: Tree
    :keywords lang=en: auto increment,literal representation,parent id,table categories,database table,hierarchical data,null value,menu system,intricacies,access control,hierarchy,logic,elements,trees