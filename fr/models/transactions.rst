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
des roll back des transactions.

::

    $dataSource->begin();

    // Effectue certaine tâche

    if (/*all's well*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
    }

Les transactions imbriquées
---------------------------

Il est possible de commencer une transaction plusieurs fois en utilisant la
méthode :php:meth:`Datasource::begin()`. La transaction va seulement finir
quand le nombre de correspondance de `commit` et `rollback` avec ceux du début.

::

    $dataSource->begin();
    // Execute quelques tâches
    $dataSource->begin();
    // Quelques tâches en plus
    if (/*la dernière tâche ok*/) {
        $dataSource->commit();
    } else {
        $dataSource->rollback();
        // Changer quelque chose dans la tâche principale
    }
    $dataSource->commit();

Cela va réaliser une réelle transaction imbriquée si votre base de données le
supporte et qu'elle est activée dans la source de données. Les méthodes vont
toujours retourner true en mode transaction et quand l'imbrication n'est pas
supportée ou désactivée.

Si vous voulez utiliser plusieurs démarrages mais ne pas utiliser la
transaction imbriquée à partir de la base de données, désactivez-la en
utilisant ``$dataSource->useNestedTransactions = false;``. Elle ne va utiliser
que la transaction globale.

La transaction réelle imbriquée est désactivée par défaut. Activez-la en
utilisant ``$dataSource->useNestedTransactions = true;``.

.. meta::
    :title lang=fr: Transactions
    :keywords lang=fr: méthodes de transaction,source de données,rollback,data source,begin,commit,nested transaction
