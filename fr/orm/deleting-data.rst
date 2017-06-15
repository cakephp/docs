Supprimer des Données
#####################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(Entity $entity, $options = [])

Une fois que vous avez chargé une entity, vous pouvez la supprimer en appelant
la méthode delete de la table d'origine::

    // Dans un controller.
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

Quand vous supprimez des entities, quelques actions se passent:

1. Les :ref:`règles de suppression <application-rules>` seront appliquées. Si
   les règles échouent, la suppression sera empêchée.
2. L'évènement ``Model.beforeDelete`` est déclenché. Si cet évènement est
   arrêté, la suppression sera abandonnée et les résultats de l'évènement seront
   retournés.
3. L'entity sera supprimée.
4. Toutes les associations dépendantes seront supprimées. Si les associations
   sont supprimées en tant qu'entities, des événements supplémentaires seront
   dispatchés.
5. Tout enregistrement de table jointe pour les associations BelongsToMany
   sera retirées.
6. L'évènement ``Model.afterDelete`` sera déclenché.

Par défaut, toutes les suppressions se passent dans une transaction. Vous
pouvez désactiver la transaction avec l'option atomic::

    $result = $this->Articles->delete($entity, ['atomic' => false]);

Suppression en Cascade
----------------------

Quand les entities sont supprimées, les données associées peuvent aussi être
supprimées. Si vos associations HasOne et HasMany sont configurées avec
``dependent``, les opérations de suppression se feront aussi en 'cascade'
sur leurs entitites. Par défaut, les entities dans les tables associées sont
retirées en utilisant :php:meth:`Cake\\ORM\\Table::deleteAll()`. Vous pouvez
choisir que l'ORM charge les entities liées et les supprime individuellement
en configurant l'option ``cascadeCallbacks`` à ``true``. Un exemple
d'association HasMany avec ces deux options activées serait::

    // Dans une méthode initialize de Table.
    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    Définir ``cascadeCallbacks`` à ``true``, entrainera  des lenteurs
    supplémentaires des suppressions par rapport aux suppressions de masse.
    L'option cascadeCallbacks doit seulement être activée quand votre
    application a un travail important de gestion des écouteurs d'événements.

Suppressions en Masse
---------------------

.. php:method:: deleteAll($conditions)

Il peut arriver des fois où la suppression de lignes une par une n'est pas
efficace ou utile. Dans ces cas, il est plus performant d'utiliser une
suppression en masse pour retirer plusieurs lignes en une fois::

    // Supprime tous les spams
    function destroySpam()
    {
        return $this->deleteAll(['is_spam' => true]);
    }

Une suppression en masse va être considérée comme réussie si une ou plusieurs
lignes ont été supprimées.

.. warning::

    deleteAll *ne* va *pas* déclencher les événements beforeDelete/afterDelete.
    Si vous avez besoin d'eux, chargez d'abord une collection d'enregistrements
    et supprimez les.

Suppressions strictes
---------------------

.. php:method:: deleteOrFail($entity, $options = [])

Utiliser cette méthode lancera une :php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException`
si :

* l'entity est _new_ (si elle n'a jamais été persistée)
* l'entity n'a pas de valeur pour sa clé primaire
* les règles de validation ont échoué
* la suppression a été annulée via un _callback_.

Si vous voulez trouver l'entity qui n'a pas pu être sauvegardée, vous pouvez
utiliser la méthode :php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()`::

        try {
            $table->deleteOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

Puisque cette méthode utilise la méthode :php:meth:`Cake\\ORM\\Table::delete()`,
tous les événements de ``delete`` seront déclenchés.

.. versionadded:: 3.4.1
