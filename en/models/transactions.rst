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

Transaction nesting support. Now it is possible to start a transaction several times. It will only be committed if the commit method is called the same amount of times.


.. meta::
    :title lang=en: Transactions
    :keywords lang=en: transaction methods,datasource,rollback,data source
