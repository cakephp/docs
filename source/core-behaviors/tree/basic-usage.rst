6.4.2 Basic Usage
-----------------

The tree behavior has a lot packed into it, but let's start with a
simple example - create the following database table and put some
data in it:

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

For the purpose of checking that everything is setup correctly, we
can create a test method and output the contents of our category
tree to see what it looks like. With a simple controller:

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

and an even simpler model definition:

::

    <?php
    // app/models/category.php
    class Category extends AppModel {
        var $name = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

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
~~~~~~~~~~~

In the previous section, we used existing data and checked that it
looked hierarchal via the method ``generatetreelist``. However,
usually you would add your data in exactly the same way as you
would for any model. For example:

::

    // pseudo controller code
    $data['Category']['parent_id'] =  3;
    $data['Category']['name'] =  'Skating';
    $this->Category->save($data);

When using the tree behavior its not necessary to do any more than
set the parent\_id, and the tree behavior will take care of the
rest. If you don't set the parent\_id, the tree behavior will add
to the tree making your new addition a new top level entry:

::

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
   ~~~~~~~~~~~~~~

   Modifying data is as transparent as adding new data. If you modify
   something, but do not change the parent\_id field - the structure
   of your data will remain unchanged. For example:

   ::

       // pseudo controller code
       $this->Category->id = 5; // id of Extreme knitting
       $this->Category->save(array('name' =>'Extreme fishing'));

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
      following code:

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
      ~~~~~~~~~~~~~

      The tree behavior provides a number of ways to manage deleting
      data. To start with the simplest example; let's say that the
      reports category is no longer useful. To remove it
      *and any children it may have* just call delete as you would for
      any model. For example with the following code:

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
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      Using and manipulating hierarchical data can be a tricky business.
      In addition to the core find methods, with the tree behavior there
      are a few more tree-orientated permutations at your disposal.

      Most tree behavior methods return and rely on data being sorted by
      the ``lft`` field. If you call ``find()`` and do not order by
      ``lft``, or call a tree behavior method and pass a sort order, you
      may get undesirable results.

      Children
      ^^^^^^^^

      The ``children`` method takes the primary key value (the id) of a
      row and returns the children, by default in the order they appear
      in the tree. The second optional parameter defines whether or not
      only direct children should be returned. Using the example data
      from the previous section:

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
      -  **$fields**: Single string field name or array of fields to
         include in the return
      -  **$order**: SQL string of ORDER BY conditions
      -  **$limit**: SQL LIMIT statement
      -  **$page**: for accessing paged results
      -  **$recursive**: Number of levels deep for recursive associated
         Models

      Counting children
      ^^^^^^^^^^^^^^^^^

      As with the method ``children``, ``childCount`` takes the primary
      key value (the id) of a row and returns how many children it has.
      The second optional parameter defines whether or not only direct
      children are counted. Using the example data from the previous
      section:

      ::

          $totalChildren = $this->Category->childCount(1); // will output 11
          // -- or --
          $this->Category->id = 1;
          $directChildren = $this->Category->childCount(); // will output 11
          
          // Only counts the direct descendants of this category
          $numChildren = $this->Category->childCount(1, true); // will output 2

      generatetreelist
      ^^^^^^^^^^^^^^^^

      ``generatetreelist ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

      This method will return data similar to
      ```find('list')`` <http://docs.cakephp.org/view/1022/find-list>`_, with an indented prefix
      to show the structure of your data. Below is an example of what you
      can expect this method to return.

      

      
      -  ``$conditions`` - Uses the same conditional options as find().
      -  ``$keyPath`` - Path to the field to use for the key.
      -  ``$valuePath`` - Path to the field to use for the label.
      -  ``$spacer`` - The string to use in front of each item to
         indicate depth.
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
      ^^^^^^^^^^^^^

      This convenience function will, as the name suggests, return the
      parent node for any node, or *false* if the node has no parent (its
      the root node). For example:

      ::

          $parent = $this->Category->getparentnode(2); //<- id for fun
          // $parent contains All categories

      getpath
      ^^^^^^^

      ``getpath( $id = null, $fields = null, $recursive = null )``

      The 'path' when refering to hierachial data is how you get from
      where you are to the top. So for example the path from the category
      "International" is:

      
      -  My Categories
         
         -  ...
         -  Work
            
            -  Trips
               
               -  ...
               -  International




      Using the id of "International" getpath will return each of the
      parents in turn (starting from the top).

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


