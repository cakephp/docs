Les Objets Table
################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Les objets Table fournissent un accès à la collection des entities stockées
dans une table spécifique. Chaque table dans votre application devra avoir une
classe Table associée qui est utilisée pour interagir avec une table
donnée. Si vous n'avez pas besoin de personnaliser le behavior d'une table
donnée, CakePHP va générer une instance Table à utiliser pour vous.

Avant d'essayer d'utiliser les objets Table et l'ORM, vous devriez vous assurer
que vous avez configuré votre
:ref:`connection à la base de données <database-configuration>`.

Utilisation Basique
===================

Pour commencer, créez une classe Table. Ces classes se trouvent dans
``src/Model/Table``. Les Tables sont une collection de type model spécifique
aux bases de données relationnelles, et sont l'interface principal pour
votre base de données dans l'ORM de CakePHP. La classe table la plus
basique devrait ressembler à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Notez que nous ne disons pas à l'ORM quelle table utiliser pour notre classe.
Par convention, les objets table vont utiliser une table avec la notation en
minuscule et avec des underscores pour le nom de la classe. Dans l'exemple du
dessus, la table ``articles`` va être utilisée. Si notre classe table était
nommée ``BlogPosts``, votre table serait nommée ``blog_posts``. Vous pouvez
spécifier la table en utilisant la méthode ``table()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->table('my_table');
        }

    }

Aucune convention d'inflection ne sera appliquée quand on spécifie une table.
Par convention, l'ORM s'attend aussi à ce que chaque table ait une clé primaire
avec le nom de ``id``. Si vous avez besoin de modifier ceci, vous pouvez
utiliser la méthode ``primaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->primaryKey('my_id');
        }
    }


Personnaliser la Classe Entity qu'une Table Utilise
---------------------------------------------------

Par défaut, les objets table utilisent une classe entity basée sur les
conventions de nommage. Par exemple, si votre classe de table est appelée
``ArticlesTable`` l'entity sera ``Article``. Si la classe table est
``PurchaseOrdersTable`` l'entity sera ``PurchaseOrder``. Cependant si vous
souhaitez utiliser une entity qui ne suit pas les conventions, vous pouvez
utiliser la méthode ``entityClass`` pour changer les choses::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->entityClass('App\Model\PO');
        }
    }

Comme vu dans les exemples ci-dessus, les objets Table ont une méthode
``initialize()`` qui est appelée à la fin du constructeur. Il est recommandé que
vous utilisiez cette méthode pour faire la logique d'initialisation au lieu
de surcharger le constructeur.

Obtenir les Instances d'une Classe Table
----------------------------------------

Avant de pouvoir requêter sur une table, vous aurez besoin d'obtenir une
instance de la table. Vous pouvez faire ceci en utilisant la classe
``TableRegistry``::

    // Dans un controller ou dans une méthode de table.
    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

La classe TableRegistry fournit les divers dépendances pour construire la table,
et maintenir un registre de toutes les instances de table construites,
faciliter la construction de relations et configurer l'ORM. Regardez
:ref:`table-registry-usage` pour plus d'informations.

.. _table-callbacks:

Lifecycle Callbacks
===================

Comme vous l'avez vu ci-dessus les objets table déclenchent un certain nombre
d'événements. Les événements sont utiles si vous souhaitez hook dans l'ORM
et ajouter de la logique sans faire de sous-classe ou sans surcharger les
méthodes. Les écouteurs d'événement peuvent être définis dans les classes
table ou behavior. Vous pouvez aussi utiliser un gestionnaire d'événement
de table pour lier les écouteurs dedans.

Lors de l'utilisation des méthodes callback des behaviors attachés dans la
méthode ``initialize`` va voir ses écouteurs lancés **avant** que les
méthodes de callback de la table ne soient déclenchées. Ceci suit la même
séquence que les controllers & les components.

Pour ajouter un écouteur d'événement à une classe Table ou un Behavior,
implémentez simplement les signatures de méthode comme décrit ci-dessus.
Consultez les :doc:`/core-libraries/events` pour avoir plus de détails sur la
façon d'utiliser le sous-système d'événements.

beforeMarshal
-------------

.. php:method:: beforeMarshal(Event $event, ArrayObject $data, $options)

L'event ``Model.beforeMarshal`` est déclenché avant que les données de request
ne soient converties en entities. Consultez la documentation
:ref:`before-marshal` pour plus d'informations.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, boolean $primary)

L'événement ``Model.beforeFind`` est lancé avant chaque opération find. En
stoppant l'événement et en fournissant une valeur de retour, vous pouvez
outrepasser entièrement l'opération find. Tout changement fait à l'instance
$query sera retenu pour le reste du find. Le paramètre ``$primary`` indique
si oui ou non ceci est la requête racine ou une requête associée. Toutes les
associations participant à une requête vont avoir un événement
``Model.beforeFind`` déclenché. Pour les associations qui utilisent les joins,
une requête dummy sera fournie. Dans votre écouteur d'événement, vous pouvez
définir des champs supplémentaires, des conditions, des joins ou des formatteurs
de résultat. Ces options/fonctionnalités seront copiées dans la requête racine.

Vous pouvez utiliser ce callback pour restreindre les opérations find basées
sur le rôle de l'utilisateur, ou faire des décisions de mise en cache basées sur
le chargement courant.

Dans les versions précédentes de CakePHP, il y avait un callback ``afterFind``,
ceci a été remplacé par les fonctionnalités de :ref:`map-reduce` et les
constructeurs d'entity.

buildValidator
---------------

.. php:method:: buildValidator(Event $event, Validator $validator, $name)

The ``Model.buildValidator`` event is fired when ``$name`` validator is created.
Behaviors, can use this hook to add in validation methods.

buildRules
----------

.. php:method:: buildRules(Event $event, RulesChecker $rules)

The ``Model.buildRules`` event is fired before after a rules instance has been
created and the table's ``beforeRules()`` method has been called.

beforeRules
--------------

.. php:method:: beforeRules(Event $event, Entity $entity, ArrayObject $options, $operation)

The ``Model.beforeRules`` event is fired before an entity has rules applied. By
stopping this event, you can return the final value of the rules checking
operation.

afterRules
--------------

.. php:method:: afterRules(Event $event, Entity $entity, bool $result, $operation)

The ``Model.afterRules`` event is fired after an entity has rules applied. By
stopping this event, you can return the final value of the rules checking
operation.

beforeSave
----------

.. php:method:: beforeSave(Event $event, Entity $entity, ArrayObject $options)

L'événement ``Model.beforeSave`` est lancé avant que chaque entity ne soit
sauvegardée. Stopper cet événement va annuler l'opération de sauvegarde. Quand
l'événement est stoppé, le résultat de l'événement sera retourné.

afterSave
---------

.. php:method:: afterSave(Event $event, Entity $entity, ArrayObject $options)

L'événement ``Model.afterSave`` est lancé après qu'une entity ne soit
sauvegardée.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, Entity $entity, ArrayObject $options)

L'événement ``Model.beforeDelete`` est lancé avant qu'une entity ne soit
supprimée. En stoppant cet événement, vous allez annuler l'opération de
suppression.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, Entity $entity, ArrayObject $options)

Lancé après qu'une entity a été supprimée.

Behaviors
=========

.. php:method:: addBehavior($name, $config = [])

.. start-behaviors

Les Behaviors fournissent une façon facile de créer des parties de logique
réutilisables horizontalement liées aux classes table. Vous vous demandez
peut-être pourquoi les behaviors sont des classes classiques et non des
traits. La première raison est les écouteurs d'événement. Alors que les traits
permettent de réutiliser des parties de logique, ils compliqueraient la
liaison des événements.

Pour ajouter un behavior à votre table, vous pouvez appeler la méthode
``addBehavior``. Généralement, le meilleur endroit pour le faire est dans la
méthode ``initialize``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Comme pour les associations, vous pouvez utiliser la :term:`syntaxe de plugin`
et fournir des options de configuration supplémentaires::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

Vous pouvez en savoir plus sur les behaviors, y compris sur les behaviors
fournis par CakePHP dans le chapitre sur les :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configurer les Connexions
=========================

Par défaut, toutes les instances de table utilisent la connexion à la base
de données ``default``. Si votre application utilise plusieurs connexions à la
base de données, vous voudrez peut-être configurer quelles tables utilisent
quelles connexions. C'est avec la méthode ``defaultConnectionName``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName() {
            return 'slavedb';
        }
    }

.. note::

    La méthode ``defaultConnectionName`` **doit** être statique.

.. _table-registry-usage:

Utiliser la TableRegistry
=========================

.. php:class:: TableRegistry

Comme nous l'avons vu précédemment, la classe TableRegistry fournit un moyen
facile de factory/registry pour accéder aux instances des tables de vos
applications. Elle fournit aussi quelques autres fonctionnalités utiles.

Configurer les Objets Table
---------------------------

.. php:staticmethod:: get($alias, $config)

Lors du chargement des tables à partir du registry, vous pouvez personnaliser
leurs dépendances, ou utiliser les objets mock en fournissant un tableau
``$options``::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connection,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

.. note::

    Si votre table fait aussi une configuration supplémentaire dans sa méthode
    ``initialize()``, ces valeurs vont écraser celles fournies au registre.

Vous pouvez aussi pré-configurer le registre en utilsant la méthode
``config()``. Les données de configuration sont stockées *par alias*, et peuvent
être surchargées par une méthode ``initialize()`` de l'objet::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    Vous pouvez configurer une table avant ou pendant la **première** fois
    où vous accédez à l'alias. Faire ceci après que le registre est rempli va
    n'avoir aucun effet.

Flushing le Registry
--------------------

.. php:staticmethod:: clear()

Pendant les cas de test, vous voulez flush la registry. Faire ceci est souvent
utile quand vous utilisez les objets mock, ou modifier les dépendances d'une
table::

    TableRegistry::clear();
