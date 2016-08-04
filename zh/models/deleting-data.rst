删除数据
########

CakePHP的模型类提供了多种从数据库中删除记录的方法。

.. _model-delete:

delete方法
==========

``delete(int $id = null, boolean $cascade = true);``

删除指定$id的记录。默认情况下，会级联删除依赖于该记录的所有记录。

例如，当删除一个User，User关联了许多条Recipe记录(使用 'hasMany' 或'hasAndBelongsToMany' 来关联Recipes)。

-  如果$cascade设置为true,并且被关联的模型中dependent属性值为true,删除User的同时会删除关联的Recipe记录。
-  如果$cascade设置为false,删除User不会删除关联的Recipe记录。

如果你使用的数据库支持外键和级联删除，会比CakePHP自带的级联删除效率更高。
使用模型中的 ``Model::delete()`` 方法好处之一是支持使用行为及回调方法::

    $this->Comment->delete($this->request->data('Comment.id'));

在处理删除操作中，可以在自定义业务逻辑使用 ``beforeDelete`` 和 ``afterDelete`` 回调方法。
这些方法位于模型和行为中。更多信息参见
:doc:`/models/callback-methods`。

.. note::

	如果你删除一条带有依赖（*dependent*）关联记录的记录，而其中某个 delete 回调
	函数，例如 ``beforeDelete``，返回 ``false``，那么这不会阻止事件的进一步传播，
	也不会改变最初的 ``delete`` 方法的返回值。

.. _model-deleteall:

deleteAll
=========

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

``deleteAll()`` 与 ``delete()`` 类似，将删除匹配条件的所有记录。
``$conditions`` 作为条件可以是SQL语句片段或数组形式。

* **conditions** 匹配的条件
* **cascade** 布尔型，设置true，会导致级联删除
* **callbacks** 布尔型, 执行回调函数

执行成功返回true，失败返回false。

Example::

    // 与 find() 方法类似，删除满足条件的记录
    $this->Comment->deleteAll(array('Comment.spam' => true), false);

如果通过回调方法和(或)级联方式删除记录，这往往会导致更多的查询。在deleteAll() 中匹配的记录被删除前，关联会重置。如果是使用bindModel()或unbindModel()来改变关联，应该设置 **reset** 为 ``false``。

.. note::

    如果删除条件执行正确但没有找到匹配的记录，造成没有任何记录被删除，deleteAll() 也将返回true。

.. meta::
    :title lang=zh: Deleting Data
    :keywords lang=zh: doc models,custom logic,callback methods,model class,database model,callbacks,information model,request data,deleteall,fragment,leverage,array,cakephp,failure,recipes,benefit,delete,data model
