データの削除
############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(Entity $entity, $options = [])

Once you've loaded an entity you can delete it by calling the originating
table's delete method::

一度読み込んだエンティティは、テーブル本来の削除メソッドを呼びだすことによって削除することが出来ます::

    // In a controller.
    // コントローラーの中
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

When deleting entities a few things happen:

エンティティ削除時には、いくつかのことが起こります:

1. The :ref:`delete rules <application-rules>` will be applied. If the rules
   fail, deletion will be prevented.

1. :ref:`削除ルール <application-rules>` が適用されます。 ルールのチェックに失敗した場合、削除は中止されます。

2. The ``Model.beforeDelete`` event is triggered. If this event is stopped, the
   delete will be aborted and the event's result will be returned.

2. ``Model.beforeDelete`` イベントが起動されます。このイベントが停止した場合、削除は失敗し、イベントの戻り値が返されます。

3. The entity will be deleted.

3. エンティティが削除されます。

4. All dependent associations will be deleted. If associations are being deleted
   as entities, additional events will be dispatched.

4. 全ての依存関係が削除されます。依存関係にあるエンティティが削除されるとき、追加のイベントが送信されます。

5. Any junction table records for BelongsToMany associations will be removed.

5. BelongsToManyアソシエーションにより、任意の結合テーブルのレコードは削除されます。

6. The ``Model.afterDelete`` event will be triggered.

6. ``Model.afterDelete`` イベントが起動されます。

By default all deletes happen within a transaction. You can disable the
transaction with the atomic option::

デフォルトでは、一回のトランザクションの中で全ての削除が行われますが、atomic オプションで無効化することも出来ます。

    $result = $this->Articles->delete($entity, ['atomic' => false]);

連鎖削除
--------

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
