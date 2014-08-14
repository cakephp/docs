Transactions
############

To perform a transaction, a model's table must be of a datasource
and type which supports transactions.

All transaction methods must be performed on a model's DataSource
object. To get a model's DataSource from within the model, use:

::

    $dataSource = $this->getDataSource();

You can then use the data source to start, commit, or roll back
transactions.

::

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
the number of ``commit`` and ``rollback`` calls match with ``begin``.

::

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

This will perform the real nested transaction if your database supports it and
it is enabled in the datasource. The methods will always return true when in
transaction mode and the nested is not supported or disabled.

If you want to use multiple begin's but not use the nested transaction from database,
disable it using ``$dataSource->useNestedTransactions = false;``. It will use only
one global transaction.

The real nested transaction is disabled by default. Enable it using
``$dataSource->useNestedTransactions = true;``.

.. meta::
    :title lang=en: Transactions
    :keywords lang=en: transaction methods,datasource,rollback,data source,begin,commit,nested transaction
