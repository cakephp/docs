3.7.5 Deleting Data
-------------------

These methods can be used to remove data.

.. _model-delete:

delete
~~~~~~

``delete(int $id = null, boolean $cascade = true);``

Deletes the record identified by $id. By default, also deletes
records dependent on the record specified to be deleted.

For example, when deleting a User record that is tied to many
Recipe records (User 'hasMany' or 'hasAndBelongsToMany' Recipes):


-  if $cascade is set to true, the related Recipe records are also
   deleted if the models dependent-value is set to true.
-  if $cascade is set to false, the Recipe records will remain
   after the User has been deleted.

.. _model-deleteall:

deleteAll
~~~~~~~~~

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

Same as with ``delete()`` and ``remove()``, except that
``deleteAll()`` deletes all records that match the supplied
conditions. The ``$conditions`` array should be supplied as an SQL
fragment or array.

**conditions** Conditions to match
**cascade** Boolean, Set to true to delete records that depend on
this record
**callbacks** Boolean, Run callbacks
Return boolean True on success, false on failure
