Les Objets Table
################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Les objets Table fournissent un accès à la collection des entities stockées
dans une table spécifique. Chaque table dans votre application devra avoir une
classe Table associée qui est utilisée pour interagir avec une table donnée. Si
vous n'avez pas besoin de personnaliser le comportement d'une table donnée,
CakePHP va générer une instance Table à utiliser pour vous.

Avant d'essayer d'utiliser les objets Table et l'ORM, vous devriez vous assurer
que vous avez configuré votre
:ref:`connection à la base de données <database-configuration>`.

Utilisation Basique
===================

Pour commencer, créez une classe Table. Ces classes se trouvent dans
**src/Model/Table**. Les Tables sont une collection de type model spécifique
aux bases de données relationnelles, et sont l'interface principale pour votre
base de données dans l'ORM de CakePHP. La classe table la plus basique devrait
ressembler à ceci::

    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Notez que nous ne disons pas à l'ORM quelle table utiliser pour notre classe.
Par convention, les objets Table vont utiliser une table avec la notation en
minuscule et avec des underscores pour le nom de la classe. Dans l'exemple du
dessus, la table ``articles`` va être utilisée. Si notre classe table était
nommée ``BlogPosts``, votre table serait nommée ``blog_posts``. Vous pouvez
spécifier la table en utilisant la méthode ``setTable()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->setTable('my_table');

            // Avant 3.4.0
            $this->table('my_table');
        }

    }

Aucune convention d'inflection ne sera appliquée quand on spécifie une table.
Par convention, l'ORM s'attend aussi à ce que chaque table ait une clé primaire
avec le nom de ``id``. Si vous avez besoin de modifier ceci, vous pouvez
utiliser la méthode ``setPrimaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setPrimaryKey('my_id');

            // Avant 3.4.0
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
utiliser la méthode ``setEntityClass()`` pour changer les choses::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setEntityClass('App\Model\Entity\PO');

            // Avant 3.4.0
            $this->entityClass('App\Model\Entity\PO');
        }
    }

Comme vu dans les exemples ci-dessus, les objets Table ont une méthode
``initialize()`` qui est appelée à la fin du constructeur. Il est recommandé
d'utiliser cette méthode pour placer la logique d'initialisation au lieu
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
et maintient un registre de toutes les instances de table construites,
facilitant la construction de relations et la configuration l'ORM. Regardez
:ref:`table-registry-usage` pour plus d'informations.

Si votre classe table est dans un plugin, assurez-vous d'utiliser le bon nom
pour votre classe table. Ne pas le faire peut entraîner des résultats non voulus
dans les règles de validation, ou que les callbacks ne soient pas récupérés car
une classe par défaut est utilisée à la place de votre classe souhaitée. Pour
charger correctement les classes table de votre plugin, utilisez ce qui suit::

    // Table de plugin
    $articlesTable = TableRegistry::get('PluginName.Articles');

    // Table de plugin préfixé par Vendor
    $articlesTable = TableRegistry::get('VendorName/PluginName.Articles');

.. _table-callbacks:

Callbacks du Cycle de Vie
=========================

Comme vous l'avez vu ci-dessus les objets table déclenchent un certain nombre
d'events. Les events sont des hook utiles si vous souhaitez et ajouter de la
logique dans l'ORM sans faire de sous-classe ou sans surcharger les
méthodes. Les écouteurs d'event peuvent être définis dans les classes
table ou behavior. Vous pouvez aussi utiliser un gestionnaire d'event
de table pour lier les écouteurs dedans.

Lors de l'utilisation des méthodes callback des behaviors attachés dans la
méthode ``initialize()`` va voir ses écouteurs lancés **avant** que les
méthodes de callback de la table ne soient déclenchées. Ceci suit la même
séquence que les controllers & les components.

Pour ajouter un écouteur d'event à une classe Table ou un Behavior,
implémentez simplement les signatures de méthode comme décrit ci-dessus.
Consultez les :doc:`/core-libraries/events` pour avoir plus de détails sur la
façon d'utiliser le sous-système d'events.

Liste des Events
----------------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.beforeFind``
* ``Model.buildValidator``
* ``Model.buildRules``
* ``Model.beforeRules``
* ``Model.afterRules``
* ``Model.beforeSave``
* ``Model.afterSave``
* ``Model.afterSaveCommit``
* ``Model.beforeDelete``
* ``Model.afterDelete``
* ``Model.afterDeleteCommit``

initialize
----------

.. php:method:: initialize(Event $event, ArrayObject $data, ArrayObject $options)

L'event ``Model.initialize`` est déclenché après que les méthodes de
constructeur et initialize sont appelées. Les classes ``Table`` n'écoutent pas
cet event par défaut, et utilisent plutôt la méthode hook ``initialize``.

Pour répondre à l'event ``Model.initialize``, vous pouvez créer une classe
écouteur qui implémente ``EventListenerInterface``::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return array(
                'Model.initialize' => 'initializeEvent',
            );
        }
        public function initializeEvent($event)
        {
            $table = $event->getSubject();
            // faire quelque chose ici
        }
    }

et attacher l'écouteur à ``EventManager`` comme ce qui suit::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

Ceci va appeler ``initializeEvent`` quand une classe ``Table`` est construite.

beforeMarshal
-------------

.. php:method:: beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)

L'event ``Model.beforeMarshal`` est déclenché avant que les données de request
ne soient converties en entities. Consultez la documentation
:ref:`before-marshal` pour plus d'informations.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, $primary)

L'event ``Model.beforeFind`` est lancé avant chaque opération find. En
stoppant l'event et en fournissant une valeur de retour, vous pouvez
outrepasser entièrement l'opération find. Tout changement fait à l'instance
$query sera retenu pour le reste du find. Le paramètre ``$primary`` indique
si oui ou non ceci est la requête racine ou une requête associée. Toutes les
associations participant à une requête vont avoir un event
``Model.beforeFind`` déclenché. Pour les associations qui utilisent les joins,
une requête factice sera fournie. Dans votre écouteur d'event, vous pouvez
définir des champs supplémentaires, des conditions, des joins ou des formateurs
de résultat. Ces options/fonctionnalités seront copiées dans la requête racine.

Vous pouvez utiliser ce callback pour restreindre les opérations find basées
sur le rôle de l'utilisateur, ou prendre des décisions de mise en cache basées
sur le chargement courant.

Dans les versions précédentes de CakePHP, il y avait un callback ``afterFind``,
ceci a été remplacé par les fonctionnalités de :ref:`map-reduce` et les
constructeurs d'entity.

buildValidator
--------------

.. php:method:: buildValidator(Event $event, Validator $validator, $name)

L'event ``Model.buildValidator`` est déclenché lorsque le validator ``$name``
est créé. Les behaviors peuvent utiliser ce hook pour ajouter des méthodes
de validation.

buildRules
----------

.. php:method:: buildRules(Event $event, RulesChecker $rules)

L'event ``Model.buildRules`` est déclenché après qu'une instance de règles a été
créée et après que la méthode ``buildRules()`` de la table a été appelée.

beforeRules
-----------

.. php:method:: beforeRules(Event $event, EntityInterface $entity, ArrayObject $options, $operation)

L'event ``Model.beforeRules`` est déclenché avant que les règles n'aient été
appliquées à une entity. En stoppant cet event, vous pouvez retourner la valeur
finale de l'opération de vérification des règles.

afterRules
----------

.. php:method:: afterRules(Event $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

L'event ``Model.afterRules`` est déclenché après que les règles soient
appliquées à une entity. En stoppant cet event, vous pouvez retourner la valeur
finale de l'opération de vérification des règles.

beforeSave
----------

.. php:method:: beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.beforeSave`` est déclenché avant que chaque entity ne soit
sauvegardée. Stopper cet event va annuler l'opération de sauvegarde. Quand
l'event est stoppé, le résultat de l'event sera retourné.

afterSave
---------

.. php:method:: afterSave(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterSave`` est déclenché après qu'une entity ne soit
sauvegardée.

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterSaveCommit`` est lancé après que la transaction, dans
laquelle l'opération de sauvegarde est fournie, a été committée. Il est aussi
déclenché pour des sauvegardes non atomic, quand les opérations sur la base de
données sont implicitement committées. L'event est déclenché seulement pour
la table primaire sur laquelle ``save()`` est directement appelée. L'event
n'est pas déclenché si une transaction est démarrée avant l'appel de save.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.beforeDelete`` est déclenché avant qu'une entity ne soit
supprimée. En stoppant cet event, vous allez annuler l'opération de
suppression.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterDelete`` est déclenché après qu'une entity a été supprimée.

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(Event $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterDeleteCommit`` est lancé après que la transaction, dans
laquelle l'opération de sauvegarde est fournie, a été committée. Il est aussi
déclenché pour des suppressions non atomic, quand les opérations sur la base de
données sont implicitement committées. L'event est décenché seulement pour
la table primaire sur laquelle ``delete()`` est directement appelée. L'event
n'est pas déclenché si une transaction est démarrée avant l'appel de delete.


Behaviors
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Les Behaviors fournissent une façon facile de créer des parties de logique
réutilisables horizontalement liées aux classes table. Vous vous demandez
peut-être pourquoi les behaviors sont des classes classiques et non des
traits. La première raison est les écouteurs d'event. Alors que les traits
permettent de réutiliser des parties de logique, ils compliqueraient la
liaison des events.

Pour ajouter un behavior à votre table, vous pouvez appeler la méthode
``addBehavior()``. Généralement, le meilleur endroit pour le faire est dans la
méthode ``initialize()``::

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
quelles connexions. C'est avec la méthode ``defaultConnectionName()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName() {
            return 'replica_db';
        }
    }

.. note::

    La méthode ``defaultConnectionName()`` **doit** être statique.

.. _table-registry-usage:

Utiliser le TableRegistry
=========================

.. php:class:: TableRegistry

Comme nous l'avons vu précédemment, la classe TableRegistry fournit un
registre/fabrique facile d'utilisation pour accéder aux instances des tables
de vos applications. Elle fournit aussi quelques autres fonctionnalités utiles.

Configurer les Objets Table
---------------------------

.. php:staticmethod:: get($alias, $config)

Lors du chargement des tables à partir du registry, vous pouvez personnaliser
leurs dépendances, ou utiliser les objets factices en fournissant un tableau
``$options``::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

Remarquez les paramètres de configurations de la connexion et du schéma, ils
ne sont pas des valeurs de type string mais des objets. La connection va
prendre un objet ``Cake\Database\Connection`` et un schéma
``Cake\Database\Schema\Collection``.

.. note::

    Si votre table fait aussi une configuration supplémentaire dans sa méthode
    ``initialize()``, ces valeurs vont écraser celles fournies au registre.

Vous pouvez aussi pré-configurer le registre en utilisant la méthode
``config()``. Les données de configuration sont stockées *par alias*, et peuvent
être surchargées par une méthode ``initialize()`` de l'objet::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    Vous pouvez configurer une table avant ou pendant la **première** fois
    où vous accédez à l'alias. Faire ceci après que le registre est rempli
    n'aura aucun effet.

Vider le Registre
-----------------

.. php:staticmethod:: clear()

Pendant les cas de test, vous voudrez vider le registre. Faire ceci est souvent
utile quand vous utilisez les objets factices, ou modifiez les dépendances d'une
table::

    TableRegistry::clear();

Configurer le Namespace pour Localiser les Classes de l'ORM
-----------------------------------------------------------

Si vous n'avez pas suivi les conventions, il est probable que vos classes
Table ou Entity ne soient pas detectées par CakePHP. Pour régler cela, vous
pouvez définir un namespace avec la méthode ``Cake\Core\Configure::write``.
Par exemple::

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

Serait configuré avec::

    Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');

