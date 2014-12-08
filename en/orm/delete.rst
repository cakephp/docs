Deleting Data
#############

CakePHP offers a few ways to delete records from your database.

.. _model-delete-entities:

Deleting Entities
=================

.. php:namespace:: Cake\ORM\Table

.. php:method:: delete(Entity $entity, $options = [])

Once you've loaded an entity you can delete it by calling the originating
table's delete method::

    // In a controller.
    $entity = $articles->get(2);
    $result = $articles->delete($entity);

When deleting entities a few things happen:

1. The ``Model.beforeDelete`` event is triggered. If this event is stopped, the
   delete will be aborted and the event's result will be returned.
2. The entity will be deleted.
3. All dependent associations will be deleted. If associations are being deleted
   as entities, additional events will be dispatched.
4. Any junction table records for BelongsToMany associations will be removed.
5. The ``Model.afterDelete`` event will be triggered.

By default all deletes happen within a transaction. You can disable the
transaction with the atomic option::

    $result = $articles->delete($entity, ['atomic' => false]);

Cascading Deletes
-----------------

When deleting entities, associated data can also be deleted. If your HasOne and
HasMany associations are configured as ``dependent``, delete operations will
'cascade' to those entities as well. By default entities in associated tables
are removed using :php:meth:`~Cake\\ORM\\Table::deleteAll()`. You can elect to
have the ORM load related entities, and delete them individually by setting the
``cascadeCallbacks`` option to ``true``. A sample HasMany association with both
these options enabled would be::

    // In a Table's initialize method.
    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    Setting ``cascadeCallbacks`` to ``true``, results in considerably slower deletes
    when compared to bulk deletes. The cascadeCallbacks option should only be
    enabled when your application has important work handled by event listeners.

Bulk Deletes
------------

.. php:method:: deleteAll($conditions)

There may be times when deleting rows one by one is not efficient or useful.
In these cases it is more performant to use a bulk-delete to remove many rows at
once::

    // Delete all the spam
    function destroySpam() {
        return $this->deleteAll(['is_spam' => true]);
    }

A bulk-delete will be considered successful if 1 or more rows are deleted.

.. warning::

    deleteAll will *not* trigger beforeDelete/afterDelete events. If you need those
    first load a collection of records and delete them.

.. _table-callbacks:

Deleting Data Using a Query
===========================

Unlike other query operations, you should not use ``find()`` to create delete queries.
Instead, create new a query object using ``query()``::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

Generally, it is easier to :ref:`delete data using entities <model-delete-entities>`.

