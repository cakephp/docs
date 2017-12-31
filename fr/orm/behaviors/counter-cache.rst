CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

Souvent les applications web doivent afficher le nombre d'objets liés. Par
exemple, quand vous montrez une liste d'articles, vous voulez peut-être
afficher combien de commentaires ils ont. Ou quand vous montrez un utilisateur,
vous voulez montrer le nombre d'amis/de followers qu'il a. Le behavior
CounterCache est présent pour ces situations. CounterCache va mettre à jour
un champ dans les models associés assignés dans les options quand il est
invoqué. Les champs doivent exister dans la base de données et être de type
INT.

Usage Basique
=============

Vous activez le behavior CounterCache comme tous les autres behaviors, mais
il ne fera rien jusqu'à ce que vous configuriez quelques relations et le
nombre de champs qui doivent être stockés sur chacun d'eux. Utiliser notre
exemple ci-dessous, nous pourrions mettre en cache le nombre de commentaires
pour chaque article avec ce qui suit::

    class CommentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('CounterCache', [
                'Articles' => ['comment_count']
            ]);
        }
    }

La configuration de CounterCache doit être composée de noms de relations et
de la configuration spécifique pour cette relation.

La valeur du compteur sera mise à jour à chaque fois qu'une entity est
sauvegardée ou supprimée. Le compteur **ne va pas** être mis à jour lorsque
vous utilisez ``updateAll()`` ou ``deleteAll()``, ou que vous executez du SQL
que vous avez écrit.

Usage Avancée
=============

Si vous avez besoin de garder un compteur mis en cache pour moins que tous les
enregistrements liés, vous pouvez fournir des conditions supplémentaires ou
des méthodes finder pour générer une valeur du compteur::

    // Utilise une méthode find spécifique.
    // Dans ce cas find(published)
    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

Si vous n'avez pas de méthode de finder personnalisé, vous pouvez fournir
un tableau de conditions pour trouver les enregistrements à la place::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'conditions' => ['Comments.spam' => false]
            ]
        ]
    ]);

Si vous voulez que CounterCache mette à jour plusieurs champs, par exemple
deux champs qui montrent un compte conditionnel et un compte basique,
vous pouvez ajouter ces champs dans le tableau::

    $this->addBehavior('CounterCache', [
        'Articles' => ['comment_count',
            'published_comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

Si vous souhaitez calculer la valeur du champ de ``CounterCache`` par vous-même,
vous pouvez définir l'option ``ignoreDirty`` à ``true``. Cela empêchera le
champ d'être recalculé automatiquement si vous l'avez définit ``dirty`` avant::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'ignoreDirty' => true
            ]
        ]
    ]);

Enfin, si un finder personnalisé et les conditions ne sont pas réunies, vous
pouvez fournir une méthode de callback. Cette méthode retourne la valeur du
compteur à stocker::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'rating_avg' => function ($event, $entity, $table) {
                return 4.5;
            }
        ]
    ]);

.. note::

    Le comportement CounterCache fonctionne uniquement pour les associations
    ``belongsTo``. Par exemple pour "Comments belongsTo Articles", vous devez
    ajouter le behavior CounterCache à la ``CommentsTable`` pour pouvoir
    générer ``comment_count`` pour la table Articles.

    Il est cependant possible de le faire fonctionner pour les associations
    ``belongsToMany``. Vous devez activer le comportement CounterCache dans
    une table ``through`` personnalisée configurée en tant qu'option
    d'association. Référez-vous à la configuration des tables de jointure en
    :ref:`utilisant l'option 'through' <using-the-through-option>`.
