6.4.4 Data Integrity
--------------------

Due to the nature of complex self referential data structures such
as trees and linked lists, they can occasionally become broken by a
careless call. Take heart, for all is not lost! The Tree Behavior
contains several previously undocumented features designed to
recover from such situations.

Recover
~~~~~~~

``recover(&$model, $mode = 'parent', $missingParentAction = null)``

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

::

    // Rebuild all the left and right fields based on the parent_id
    $this->Category->recover();
    // or
    $this->Category->recover('parent');
     
    // Rebuild all the parent_id's based on the lft and rght fields
    $this->Category->recover('tree');

Reorder
~~~~~~~

``reorder(&$model, $options = array())``

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
following possible keys by default, all of which are optional:

::

    array(
        'id' => null,
        'field' => $model->displayField,
        'order' => 'ASC',
        'verify' => true
    )

Verify
~~~~~~

``verify(&$model)``

Returns ``true`` if the tree is valid otherwise an array of errors,
with fields for type, incorrect index and message.

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
