Transactions
############

Pour effectuer une transaction, les tables d'un model doivent être d'un type 
qui supporte les transactions.

Toutes les méthodes de transaction doivent être effectuées sur un objet de 
Source de Données. Pour obtenir le model de Source de Données à partir du 
model, utilisez:

::

    $dataSource = $this->getDataSource();

Vous pouvez utiliser la source de données pour commencer, committer, ou faire 
des transactions roll back.

::

    $dataSource->begin();
    
    // Effectue certaine tâche
    
    if (/*all's well*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
    }

Transaction nesting support. Maintenant, il est possible de démarrer 
une transaction à plusieurs reprises. Il ne peut être que committé si la 
méthode de validation est appelée la même quantité de fois.


.. meta::
    :title lang=fr: Transactions
    :keywords lang=fr: méthodes de transaction,source de données,rollback
