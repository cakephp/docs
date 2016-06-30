其它方法和属性
##############

虽然 CakePHP 的模型函数能够满足你的需要，但不要忘记模型类只是：类，让你可以定义
自己的方法，或者定义自己的属性。

任何处理保存或读取数据的操作最好都写在模型类中。这个概念通常被称为胖模型。

::

    class Example extends AppModel {
        public function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day)' .
                ' and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

这个 ``getRecent()`` 方法现在可以在控制器中使用 。

::

    $recent = $this->Example->getRecent();

:php:meth:`Model::associations()`
=================================

获得关联::

    $result = $this->Example->associations();
    // $result 等于 array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')
    // $result equals array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

构建查询数组，用于数据源生成查询来获取数据。

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

把复杂的数据类型(数组或对象)拆分成单个字段值。

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

转义字段名，并加上模型名作为前缀。转义遵循当前数据库驱动的规则。

:php:meth:`Model::exists($id)`
==============================

如果有特定 ID 的记录存在，则返回 true。

若没有提供 ID，会调用 :php:meth:`Model::getID()` 方法获得当前记录的 ID 来确认，
然后在当前配置的数据源上执行 ``Model::find('count')``，以确定该记录在持久存储中
是否存在。

.. note ::

    $id 参数是 2.1 版本中新增的。在此之前该方法不带任何参数。

::

    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

返回上次查询所影响的行数。

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

获取与此模型关联的所有模型。

:php:meth:`Model::getColumnType(string $column)`
================================================

返回模型中的列的列类型。

:php:meth:`Model::getColumnTypes()`
===================================

返回(模型中)字段名和列类型的关联数组。

:php:meth:`Model::getID(integer $list = 0)`
===========================================

返回当前记录的 ID。

:php:meth:`Model::getInsertID()`
================================

返回此模型插入的最后一条记录的 ID。

:php:meth:`Model::getLastInsertID()`
====================================

``getInsertID()`` 的别名。

.. meta::
    :title lang=zh: Additional Methods and Properties
    :keywords lang=zh: model classes,model functions,model class,interval,array
