# Deleting Data

`class` Cake\\ORM\\**Table**

`method` Cake\\ORM\\Table::**delete**(EntityInterface $entity, array $options = [])

Once you've loaded an entity you can delete it by calling the originating
table's delete method:

``` php
// In a controller.
$entity = $this->Articles->get(2);
$result = $this->Articles->delete($entity);
```

When deleting entities a few things happen:

1.  The [delete rules](../orm/validation#application-rules) will be applied. If the rules
    fail, deletion will be prevented.
2.  The `Model.beforeDelete` event is triggered. If this event is stopped, the
    delete will be aborted and the event's result will be returned.
3.  The entity will be deleted.
4.  All dependent associations will be deleted. If associations are being deleted
    as entities, additional events will be dispatched.
5.  Any junction table records for BelongsToMany associations will be removed.
6.  The `Model.afterDelete` event will be triggered.

By default all deletes happen within a transaction. You can disable the
transaction with the atomic option:

``` php
$result = $this->Articles->delete($entity, ['atomic' => false]);
```

The `$options` parameter supports the following options:

- `atomic` Defaults to true. When true the deletion happens within
  a transaction.
- `checkRules` Defaults to true. Check deletion rules before deleting
  records.

## Cascading Deletes

When deleting entities, associated data can also be deleted. If your HasOne and
HasMany associations are configured as `dependent`, delete operations will
'cascade' to those entities as well. By default entities in associated tables
are removed using `Cake\ORM\Table::deleteAll()`. You can elect to
have the ORM load related entities, and delete them individually by setting the
`cascadeCallbacks` option to `true`. A sample HasMany association with both
these options enabled would be:

``` php
// In a Table's initialize method.
$this->hasMany('Comments', [
    'dependent' => true,
    'cascadeCallbacks' => true,
]);
```

> [!NOTE]
> Setting `cascadeCallbacks` to `true`, results in considerably slower deletes
> when compared to bulk deletes. The cascadeCallbacks option should only be
> enabled when your application has important work handled by event listeners.

## Bulk Deletes

`method` Cake\\ORM\\Table::**deleteMany**(iterable $entities, array $options = [])

If you have an array of entities you want to delete you can use `deleteMany()`
to delete them in a single transaction:

``` php
// Get a boolean indicating success
$success = $this->Articles->deleteMany($entities);

// Will throw a PersistenceFailedException if any entity cannot be deleted.
$this->Articles->deleteManyOrFail($entities);
```

The `$options` for these methods are the same as `delete()`. Deleting
records with these method **will** trigger events.

`method` Cake\\ORM\\Table::**deleteAll**($conditions)

There may be times when deleting rows one by one is not efficient or useful.
In these cases it is more performant to use a bulk-delete to remove many rows at
once:

``` php
// Delete all the spam
public function destroySpam()
{
    return $this->deleteAll(['is_spam' => true]);
}
```

A bulk-delete will be considered successful if 1 or more rows are deleted. The
function returns the number of deleted records as an integer.

> [!WARNING]
> deleteAll will *not* trigger beforeDelete/afterDelete events.
> If you need callbacks triggered, first load the entities with `find()`
> and delete them in a loop.

## Strict Deletes

`method` Cake\\ORM\\Table::**deleteOrFail**(EntityInterface $entity, array $options = [])

Using this method will throw an
`Cake\ORM\Exception\PersistenceFailedException` if:

- the entity is new
- the entity has no primary key value
- application rules checks failed
- the delete was aborted by a callback.

If you want to track down the entity that failed to delete, you can use the
`Cake\ORM\Exception\PersistenceFailedException::getEntity()` method:

``` php
try {
    $table->deleteOrFail($entity);
} catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
    echo $e->getEntity();
}
```

As this internally performs a `Cake\ORM\Table::delete()` call, all
corresponding delete events will be triggered.
