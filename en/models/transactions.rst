Transactions
############

To perform a transaction, a model's tables must be of a type that
supports transactions.

All transaction methods must be performed on a model's DataSource
object. To get a model's DataSource from within the model, use:

::

    <?php
    $dataSource = $this->getDataSource();

You can then use the data source to start, commit, or roll back
transactions.

::

    <?php
    $dataSource->begin();

    // Perform some tasks

    if (/*all's well*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
    }

Nested Transactions
-------------------

It is possible to start a transaction several times using the
:php:meth:`Datasource::begin()` method. The transaction will finish only when
the number of `commit` and `rollback` match with begin's.

::

    <?php
    $dataSource->begin();
    // Perform some tasks
    $dataSource->begin();
    // More few tasks
    if (/*latest task ok*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
        // Change something in main task
    }
    $dataSource->commit();

This will perform the nested transaction if your database supports it. The methods
will always return true when in transaction mode and the nested is not supported.

If you want to use multiple begin's but not use the nested transaction from database,
disable it using ``$dataSource->nestedTransaction = false;``. It will use only
the global transaction.

.. meta::
    :title lang=en: Transactions
    :keywords lang=en: transaction methods,datasource,rollback,data source,begin,commit,nested transaction
