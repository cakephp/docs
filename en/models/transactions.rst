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
    $dataSource->begin($this);
    
    // Perform some tasks
    
    if (/*all's well*/) {
        $dataSource->commit($this);
    } else {
        $dataSource->rollback($this);
    }

Nested transactions are currently not supported. If a nested
transaction is started, a commit will return false on the parent
transaction.


.. meta::
    :title lang=en: Transactions
    :keywords lang=en: transaction methods,datasource,rollback,data source