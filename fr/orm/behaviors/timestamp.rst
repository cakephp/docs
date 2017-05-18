Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

Le behavior timestamp permet à vos objets de table de mettre à jour un ou
plusieurs timestamps sur chaque évènement de model. C'est principalement utilisé
pour remplir les données dans les champs ``created`` et ``modified``.
Cependant, avec quelques configurations supplémentaires, vous pouvez mettre à
jour la colonne timestamp/datetime sur chaque évènement qu'une table publie.

Utilisation Basique
===================

Vous activez le behavior timestamp comme tout autre behavior::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

La configuration par défaut va faire ce qui suit:

- Quand une nouvelle entity est sauvegardée, les champs ``created`` et
  ``modified`` seront définis avec le time courant.
- Quand une entity est mise à jour, le champ ``modified`` est défini au time
  courant.

Utiliser et Configurer le Behavior
==================================

Si vous avez besoin de modifier les champs avec des noms différents, ou si vous
souhaitez mettre à jour le timestamp supplémentaire sur des événements
personnalisés, vous pouvez utiliser quelques configurations supplémentaires::

    class OrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'updated_at' => 'always',
                    ],
                    'Orders.completed' => [
                        'completed_at' => 'always'
                    ]
                ]
            ]);
        }
    }

Comme vous pouvez le voir au-dessus, en plus de l'évènement standard
``Model.beforeSave``, nous mettons aussi à jour la colonne ``completed_at``
quand les ordres sont complétés.

Mettre à jour les Timestamps sur les Entities
=============================================

Parfois, vous souhaitez mettre à jour uniquement les timestamps sur une entity
sans changer aucune autre propriété. On fait parfois référence au
'touching' d'un enregistrement. Dans CakePHP, vous pouvez utiliser la méthode
``touch()`` pour faire exactement ceci::

    // Touch basé sur l'évènement Model.beforeSave.
    $articles->touch($article);

    // Touch basé sur un évènement spécifique.
    $orders->touch($order, 'Orders.completed');

Après avoir sauvegardé l'entity, le champ est mis à jour.

Toucher les enregistrements peut être utile quand vous souhaitez signaler
qu'une ressource parente a changé quand une ressource enfante est créée/mise
à jour. Par exemple: mettre à jour un article quand un nouveau commentaire
est ajouté.

Sauvegardez les Mises à Jour sans Modifier les Timestamps
=========================================================

Pour désactiver la modification automatique de la colonne timestamp ``updated``
quand vous sauvegardez une entity, vous pouvez marquer l'attribut avec 'dirty'::

    // Marquer la colonne modified avec dirty
    // la valeur actuelle à définir lors de la mise à jour.
    $order->dirty('modified', true);

