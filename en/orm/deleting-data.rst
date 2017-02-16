Deleting Data
#############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(Entity $entity, $options = [])

Once you've loaded an entity you can delete it by calling the originating
table's delete method::

    // In a controller.
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

When deleting entities a few things happen:

1. The :ref:`delete rules <application-rules>` will be applied. If the rules
   fail, deletion will be prevented.
2. The ``Model.beforeDelete`` event is triggered. If this event is stopped, the
   delete will be aborted and the event's result will be returned.
3. The entity will be deleted.
4. All dependent associations will be deleted. If associations are being deleted
   as entities, additional events will be dispatched.
5. Any junction table records for BelongsToMany associations will be removed.
6. The ``Model.afterDelete`` event will be triggered.

By default all deletes happen within a transaction. You can disable the
transaction with the atomic option::

    $result = $this->Articles->delete($entity, ['atomic' => false]);

Cascading Deletes
-----------------

When deleting entities, associated data can also be deleted. If your HasOne and
HasMany associations are configured as ``dependent``, delete operations will
'cascade' to those entities as well. By default entities in associated tables
are removed using :php:meth:`Cake\\ORM\\Table::deleteAll()`. You can elect to
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
    function destroySpam()
    {
        return $this->deleteAll(['is_spam' => true]);
    }

A bulk-delete will be considered successful if 1 or more rows are deleted.

.. warning::

    deleteAll will *not* trigger beforeDelete/afterDelete events. If you need those
    first load a collection of records and delete them.

Strict Deletes
--------------

.. php:method:: deleteOrFail($entity, $options = [])


Using this method will throw an :php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException`
if the entity is new, has no primary key value, application rules checks failed
or the delete was aborted by a callback.

If you want to track down the entity that failed to save, you can use the
:php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()` method::

        try {
            $table->deleteOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

As this internally perfoms a :php:meth:`Cake\\ORM\\Table::delete()` call, all corresponding delete events will be triggered.

.. versionadded:: 3.4.1