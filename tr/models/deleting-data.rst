Deleting Data
#############

CakePHP's Model class offers a few ways to delete records from your database.

.. _model-delete:

delete
======

``delete(integer $id = null, boolean $cascade = true);``

Deletes the record identified by $id. By default, also deletes
records dependent on the record specified to be deleted.

For example, when deleting a User record that is tied to many
Recipe records (User 'hasMany' or 'hasAndBelongsToMany' Recipes):

-  if $cascade is set to true, the related Recipe records are also
   deleted if the model's dependent-value is set to true.
-  if $cascade is set to false, the Recipe records will remain
   after the User has been deleted.

If your database supports foreign keys and cascading deletes, it's often more
efficient to rely on that feature than CakePHP's cascading. The one benefit to
using the cascade feature of ``Model::delete()`` is that it allows you to
leverage behaviors and model callbacks::

    $this->Comment->delete($this->request->data('Comment.id'));

You can hook custom logic into the delete process using the ``beforeDelete`` and
``afterDelete`` callbacks present in both Models and Behaviors. See
:doc:`/models/callback-methods` for more information.

.. _model-deleteall:

deleteAll
=========

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

``deleteAll()`` is similar to ``delete()``, except that
``deleteAll()`` will delete all records that match the supplied
conditions. The ``$conditions`` array should be supplied as a SQL
fragment or array.

* **conditions** Conditions to match
* **cascade** Boolean, Set to true to delete records that depend on
  this record
* **callbacks** Boolean, Run callbacks

Return boolean True on success, false on failure.

Example::

    // Delete with array conditions similar to find()
    $this->Comment->deleteAll(array('Comment.spam' => true), false);

If you delete with either callbacks and/or cascade, rows will be found and then
deleted. This will often result in more queries being issued. Associations will
be reset before the matched records are deleted in deleteAll(). If you use
bindModel() or unbindModel() to change the associations, you should set
**reset** to ``false``.

.. note::

    deleteAll() will return true even if no records are deleted, as the conditions
    for the delete query were successful and no matching records remain.


.. meta::
    :title lang=en: Deleting Data
    :keywords lang=en: doc models,custom logic,callback methods,model class,database model,callbacks,information model,request data,deleteall,fragment,leverage,array,cakephp,failure,recipes,benefit,delete,data model
