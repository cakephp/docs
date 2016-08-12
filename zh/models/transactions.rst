事务
####

要执行事务，模型所对应的表必须属于支持事务的数据源和类型。

所有的事务方法必须用模型的数据源对象来执行。要在模型中获得模型的数据源，请用：

::

    $dataSource = $this->getDataSource();

接着你就可以使用数据源来开始、提交或者回滚事务。

::

    $dataSource->begin();

    // 执行一些任务

    if (/*一切正常*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
    }

嵌套事务
--------

可以使用 :php:meth:`Datasource::begin()` 方法多次开始事务。只有当 ``commit`` 与 
``rollback`` 方法的调用次数与 ``begin`` 方法的调用次数相等时，事务才会结束::

    $dataSource->begin();
    // 执行一些任务
    $dataSource->begin();
    // 再执行几个任务
    if (/*最后的任务成功*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
        // 在主任务中改变一些东西
    }
    $dataSource->commit();

如果数据库支持嵌套事务、并且在数据源中开启嵌套事务支持，才会真的执行嵌套事务。如
果不支持嵌套事务或者嵌套事务支持被关闭，在事务模式中，这些方法总是会返回 true。

如果你想多次开始事务、但不使用数据库的嵌套事务，可以使用 
``$dataSource->useNestedTransactions = false;`` 来关闭嵌套事务支持。这会仅使用一
个全局事务。

实际的嵌套事务默认为关闭。使用 ``$dataSource->useNestedTransactions = true;`` 来
开启它。

.. meta::
    :title lang=zh: Transactions
    :keywords lang=zh: transaction methods,datasource,rollback,data source,begin,commit,nested transaction
