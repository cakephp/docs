6.4.3 Advanced Usage
--------------------

The tree behavior doesn't only work in the background, there are a
number of specific methods defined in the behavior to cater for all
your hierarchical data needs, and any unexpected problems that
might arise in the process.

moveDown
~~~~~~~~

Used to move a single node down the tree. You need to provide the
ID of the element to be moved and a positive number of how many
positions the node should be moved down. All child nodes for the
specified node will also be moved.

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


#. ``function movedown($name = null, $delta = null) {``
#. ``$cat = $this->Category->findByName($name);``
#. ``if (empty($cat)) {``
#. ``$this->Session->setFlash('There is no category named ' . $name);``
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``
#. ````
#. ``$this->Category->id = $cat['Category']['id'];``
#. ````
#. ``if ($delta > 0) {``
#. ``$this->Category->moveDown($this->Category->id, abs($delta));``
#. ``} else {``
#. ``$this->Session->setFlash('Please provide the number of positions the field should be moved down.');``
#. ``}``
#. ````
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``

For example, if you'd like to move the "Sport" category one
position down, you would request: /categories/movedown/Sport/1.

moveUp
~~~~~~

Used to move a single node up the tree. You need to provide the ID
of the element to be moved and a positive number of how many
positions the node should be moved up. All child nodes will also be
moved.

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


#. ``function moveup($name = null, $delta = null){``
#. ``$cat = $this->Category->findByName($name);``
#. ``if (empty($cat)) {``
#. ``$this->Session->setFlash('There is no category named ' . $name);``
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``
#. ````
#. ``$this->Category->id = $cat['Category']['id'];``
#. ````
#. ``if ($delta > 0) {``
#. ``$this->Category->moveUp($this->Category->id, abs($delta));``
#. ``} else {``
#. ``$this->Session->setFlash('Please provide a number of positions the category should be moved up.');``
#. ``}``
#. ````
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ````
#. ``}``

For example, if you would like to move the category "Gwendolyn" up
one position you would request /categories/moveup/Gwendolyn/1. Now
the order of Friends will be Gwendolyn, Gerald.

removeFromTree
~~~~~~~~~~~~~~

``removeFromTree($id=null, $delete=false)``

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </view/1316/delete>`_, which for a model
using the tree behavior will remove the specified node and all of
its children.

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


#. ``$this->Node->removeFromTree($id);``

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
'Sport'

::

    $this->Node->removeFromTree($id,true); 


#. ``$this->Node->removeFromTree($id,true);``

The tree would become


-  My Categories
   
   -  Fun
      
      -  Surfing
      -  Extreme knitting
      -  Skating



This demonstrates the alternate use for ``removeFromTree``, the
children have been reparented and 'Sport' has been deleted.

reorder
~~~~~~~

``reorder ( array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true) )``

Reorders the nodes (and child nodes) of the tree according to the
field and direction specified in the parameters. This method does
not change the parent of any node.

::

    $model->reorder(array(
        'id' => ,    //id of record to use as top node for reordering, default: $Model->id
        'field' => , //which field to use in reordering, default: $Model->displayField
        'order' => , //direction to order, default: 'ASC'
        'verify' =>  //whether or not to verify the tree before reorder, default: true
    ));


#. ``$model->reorder(array(``
#. ``'id' => ,    //id of record to use as top node for reordering, default: $Model->id``
#. ``'field' => , //which field to use in reordering, default: $Model->displayField``
#. ``'order' => , //direction to order, default: 'ASC'``
#. ``'verify' =>  //whether or not to verify the tree before reorder, default: true``
#. ``));``

If you have saved your data or made other operations on the model,
you might want to set ``$model->id = null`` before calling
``reorder``. Otherwise only the current node and it's children will
be reordered.

6.4.3 Advanced Usage
--------------------

The tree behavior doesn't only work in the background, there are a
number of specific methods defined in the behavior to cater for all
your hierarchical data needs, and any unexpected problems that
might arise in the process.

moveDown
~~~~~~~~

Used to move a single node down the tree. You need to provide the
ID of the element to be moved and a positive number of how many
positions the node should be moved down. All child nodes for the
specified node will also be moved.

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


#. ``function movedown($name = null, $delta = null) {``
#. ``$cat = $this->Category->findByName($name);``
#. ``if (empty($cat)) {``
#. ``$this->Session->setFlash('There is no category named ' . $name);``
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``
#. ````
#. ``$this->Category->id = $cat['Category']['id'];``
#. ````
#. ``if ($delta > 0) {``
#. ``$this->Category->moveDown($this->Category->id, abs($delta));``
#. ``} else {``
#. ``$this->Session->setFlash('Please provide the number of positions the field should be moved down.');``
#. ``}``
#. ````
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``

For example, if you'd like to move the "Sport" category one
position down, you would request: /categories/movedown/Sport/1.

moveUp
~~~~~~

Used to move a single node up the tree. You need to provide the ID
of the element to be moved and a positive number of how many
positions the node should be moved up. All child nodes will also be
moved.

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


#. ``function moveup($name = null, $delta = null){``
#. ``$cat = $this->Category->findByName($name);``
#. ``if (empty($cat)) {``
#. ``$this->Session->setFlash('There is no category named ' . $name);``
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ``}``
#. ````
#. ``$this->Category->id = $cat['Category']['id'];``
#. ````
#. ``if ($delta > 0) {``
#. ``$this->Category->moveUp($this->Category->id, abs($delta));``
#. ``} else {``
#. ``$this->Session->setFlash('Please provide a number of positions the category should be moved up.');``
#. ``}``
#. ````
#. ``$this->redirect(array('action' => 'index'), null, true);``
#. ````
#. ``}``

For example, if you would like to move the category "Gwendolyn" up
one position you would request /categories/moveup/Gwendolyn/1. Now
the order of Friends will be Gwendolyn, Gerald.

removeFromTree
~~~~~~~~~~~~~~

``removeFromTree($id=null, $delete=false)``

Using this method wil either delete or move a node but retain its
sub-tree, which will be reparented one level higher. It offers more
control than ```delete()`` </view/1316/delete>`_, which for a model
using the tree behavior will remove the specified node and all of
its children.

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


#. ``$this->Node->removeFromTree($id);``

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
'Sport'

::

    $this->Node->removeFromTree($id,true); 


#. ``$this->Node->removeFromTree($id,true);``

The tree would become


-  My Categories
   
   -  Fun
      
      -  Surfing
      -  Extreme knitting
      -  Skating



This demonstrates the alternate use for ``removeFromTree``, the
children have been reparented and 'Sport' has been deleted.

reorder
~~~~~~~

``reorder ( array('id' => null, 'field' => $Model->displayField, 'order' => 'ASC', 'verify' => true) )``

Reorders the nodes (and child nodes) of the tree according to the
field and direction specified in the parameters. This method does
not change the parent of any node.

::

    $model->reorder(array(
        'id' => ,    //id of record to use as top node for reordering, default: $Model->id
        'field' => , //which field to use in reordering, default: $Model->displayField
        'order' => , //direction to order, default: 'ASC'
        'verify' =>  //whether or not to verify the tree before reorder, default: true
    ));


#. ``$model->reorder(array(``
#. ``'id' => ,    //id of record to use as top node for reordering, default: $Model->id``
#. ``'field' => , //which field to use in reordering, default: $Model->displayField``
#. ``'order' => , //direction to order, default: 'ASC'``
#. ``'verify' =>  //whether or not to verify the tree before reorder, default: true``
#. ``));``

If you have saved your data or made other operations on the model,
you might want to set ``$model->id = null`` before calling
``reorder``. Otherwise only the current node and it's children will
be reordered.
