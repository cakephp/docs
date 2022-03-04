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
:ref:`connexion à la base de données <database-configuration>`.

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

        public function initialize(array $config): void
        {
            $this->setTable('my_table');
        }

    }

Aucune convention d'inflexion ne sera appliquée quand on spécifie une table.
Par convention, l'ORM s'attend aussi à ce que chaque table ait une clé primaire
avec le nom de ``id``. Si vous avez besoin de modifier ceci, vous pouvez
utiliser la méthode ``setPrimaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->setPrimaryKey('my_id');
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
        public function initialize(array $config): void
        {
            $this->setEntityClass('App\Model\Entity\PO');
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
``TableLocator``::

    // Dans un controller
    $articles = $this->getTableLocator()->get('Articles');

Le TableLocator fournit les diverses dépendances pour construire la table,
et maintient un registre de toutes les instances de table construites,
facilitant la construction de relations et la configuration l'ORM. Regardez
:ref:`table-locator-usage` pour plus d'informations.

Si votre classe table est dans un plugin, assurez-vous d'utiliser le bon nom
pour votre classe table. Ne pas le faire peut entraîner des résultats non voulus
dans les règles de validation, ou que les callbacks ne soient pas récupérés car
une classe par défaut est utilisée à la place de votre classe souhaitée. Pour
charger correctement les classes table de votre plugin, utilisez ce qui suit::

    // Table de plugin
    $articlesTable = $this->getTableLocator()->get('PluginName.Articles');

    // Table de plugin préfixé par Vendor
    $articlesTable = $this->getTableLocator()->get('VendorName/PluginName.Articles');

.. _table-callbacks:

Callbacks du Cycle de Vie
=========================

Comme vous l'avez vu ci-dessus les objets table déclenchent un certain nombre
d'events. Les events sont utiles si vous souhaitez ajouter de la logique dans
l'ORM sans faire de sous-classe et sans réécrire les méthodes. Les écouteurs
(*listeners*) d'events peuvent être définis dans les classes de table ou de
behavior. Vous pouvez aussi utiliser le gestionnaire d'events d'une table pour y
lier des écouteurs dedans.

Lors de l'utilisation des méthodes de callback, les behaviors attachés dans la
méthode ``initialize()`` déclencheront leurs écouteurs **avant** que les
méthodes de callback de la table ne soient déclenchées. Ceci suit la même
séquence que les controllers et les components.

Pour ajouter un écouteur d'events à une classe Table ou à un Behavior,
implémentez simplement les signatures de méthodes comme décrit ci-dessus.
Consultez les :doc:`/core-libraries/events` pour avoir plus de détails sur la
façon d'utiliser le sous-système d'events::

    // Dans un controller
    $articles->save($article, ['variablePerso1' => 'votreValeur1']);
    
    // Dans ArticlesTable.php
    public function afterSave(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $variablePerso = $options['variablePerso1']; // 'votreValeur1'
        $options['variablePerso2'] = 'votreValeur2';    
    }  
    
    public function afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $variablePerso = $options['variablePerso1']; // 'votreValeur1'
        $variablePerso = $options['variablePerso2']; // 'votreValeur2'
    }

Liste des Events
----------------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.afterMarshal``
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

.. php:method:: initialize(EventInterface $event, ArrayObject $data, ArrayObject $options)

L'event ``Model.initialize`` est déclenché après que les méthodes de
constructeur et initialize ont été appelées. Les classes ``Table`` n'écoutent pas
cet event par défaut, et utilisent plutôt la méthode hook ``initialize``.

Pour répondre à l'event ``Model.initialize``, vous pouvez créer une classe
écouteur qui implémente ``EventListenerInterface``::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return [
                'Model.initialize' => 'initializeEvent',
            ];
        }
        public function initializeEvent($event): void
        {
            $table = $event->getSubject();
            // faire quelque chose ici
        }
    }

et attacher l'écouteur au ``EventManager`` ainsi::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

Ceci va appeler ``initializeEvent`` quand une classe ``Table`` est construite.

beforeMarshal
-------------

.. php:method:: beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)

L'event ``Model.beforeMarshal`` est déclenché avant que les données de requête
ne soient converties en entities. Consultez la documentation
:ref:`before-marshal` pour plus d'informations.

afterMarshal
------------

.. php:method:: afterMarshal(EventInterface $event, EntityInterface $entity, ArrayObject $data, ArrayObject $options)

L'event ``Model.afterMarshal`` est déclenché après que les données de requête
ont été converties en entities.Les gestionnaires d'events obtiendront les
entities converties, les données originales de la requête et les options
fournies à ``patchEntity()`` ou ``newEntity()``.

beforeFind
----------

.. php:method:: beforeFind(EventInterface $event, Query $query, ArrayObject $options, $primary)

L'event ``Model.beforeFind`` est lancé avant chaque opération find. En
arrêtant l'événement et en alimentant la requête avec un jeu de résultats
personnalisé, vous pouvez ignorer complètement l'opération de recherche::

    public function beforeFind(EventInterface $event, Query $query, ArrayObject $options, $primary)
    {
        if (/* ... */) {
            $event->stopPropagation();
            $query->setResult(new \Cake\Datasource\ResultSetDecorator([]));

            return;
        }
        // ...
    }

Dans cet exemple, aucun autre événement ``beforeFind`` ne sera déclenché sur
la table associée ou ses comportements attachés (bien que les événements de
comportement soient généralement appelés plus tôt compte tenu de leurs
priorités par défaut), et la requête renverra le jeu de résultats vide qui a
été transmis via ``Query::setResult()``.

Tout changement fait à l'instance ``$query`` sera retenu pour le reste du find.
Le paramètre ``$primary`` indique si oui ou non ceci est la requête racine ou
une requête associée. Un event ``Model.beforeFind`` sera déclenché dans toutes
les associations participant à la requête. Pour les associations qui
utilisent des jointures, une requête factice sera fournie. Dans votre écouteur
d'event, vous pouvez définir des champs supplémentaires, des conditions, des
jointures ou des formateurs de résultat. Ces options/fonctionnalités seront
copiées dans la requête racine.

Dans les versions précédentes de CakePHP, il y avait un callback ``afterFind``,
qui a été remplacé par les fonctionnalités de :ref:`map-reduce` et les
constructeurs d'entity.

buildValidator
--------------

.. php:method:: buildValidator(EventInterface $event, Validator $validator, $name)

L'event ``Model.buildValidator`` est déclenché lorsque le validator ``$name``
est créé. Les behaviors peuvent utiliser ce hook pour ajouter des méthodes
de validation.

buildRules
----------

.. php:method:: buildRules(EventInterface $event, RulesChecker $rules)

L'event ``Model.buildRules`` est déclenché après qu'une instance de règles a été
créée et après que la méthode ``buildRules()`` de la table a été appelée.

beforeRules
-----------

.. php:method:: beforeRules(EventInterface $event, EntityInterface $entity, ArrayObject $options, $operation)

L'event ``Model.beforeRules`` est déclenché avant que les règles n'aient été
appliquées à une entity. En stoppant cet event, vous pouvez retourner la valeur
finale de l'opération de vérification des règles.

afterRules
----------

.. php:method:: afterRules(EventInterface $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

L'event ``Model.afterRules`` est déclenché après que les règles soient
appliquées à une entity. En stoppant cet event, vous pouvez retourner la valeur
finale de l'opération de vérification des règles.

beforeSave
----------

.. php:method:: beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.beforeSave`` est déclenché avant que chaque entity ne soit
sauvegardée. Stopper cet event va annuler l'opération de sauvegarde. Quand
l'event est stoppé, le résultat de l'event sera retourné.
La manière de stopper un event est documentée :ref:`ici <stopping-events>`.

afterSave
---------

.. php:method:: afterSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterSave`` est déclenché après qu'une entity ne soit
sauvegardée.

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterSaveCommit`` est lancé après que la transaction, dans
laquelle l'opération de sauvegarde est fournie, a été committée. Il est aussi
déclenché pour des sauvegardes non atomic, quand les opérations sur la base de
données sont implicitement committées. L'event est déclenché seulement pour
la table primaire sur laquelle ``save()`` est directement appelée. L'event
n'est pas déclenché si une transaction est démarrée avant l'appel de save.

beforeDelete
------------

.. php:method:: beforeDelete(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.beforeDelete`` est déclenché avant qu'une entity ne soit
supprimée. En stoppant cet event, vous allez annuler l'opération de
suppression. Quand l'event est stoppé le résultat de l'event sera retourné.

afterDelete
-----------

.. php:method:: afterDelete(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterDelete`` est déclenché après qu'une entity a été supprimée.

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(EventInterface $event, EntityInterface $entity, ArrayObject $options)

L'event ``Model.afterDeleteCommit`` est lancé après que la transaction, dans
laquelle l'opération de sauvegarde est fournie, a été committée. Il est aussi
déclenché pour des suppressions non atomic, quand les opérations sur la base de
données sont implicitement committées. L'event est décenché seulement pour
la table primaire sur laquelle ``delete()`` est directement appelée. L'event
n'est pas déclenché si une transaction est démarrée avant l'appel de delete.

Stopper des Events de Table
---------------------------
Pour empêcher la sauvegarde de se poursuivre, arrêtez simplement la propagation
de l'event dans votre callback::

    public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if (...) {
            $event->stopPropagation();
            $event->setResult(false);
            return;
        }
        ...
    }

Alternativement, vous pouvez aussi renvoyer false depuis votre callback. Cela a
le même effet d'arrêt de la propagation.

Priorités de Callbacks
----------------------

Quand vous utilisez des events sur vos tables et vos behaviors, ayez en tête la
priorité et l'ordre dans lequel les écouteurs sont attachés. Les events des
behaviors sont attachés avant ceux des tables. Avec les priorités par défaut,
cela signifie que les callbacks de behaviors seront déclenchés **avant** l'event
de la table ayant le même nom.

À titre d'exemple, si votre Table utilise ``TreeBehavior``, la méthode
``TreeBehavior::beforeDelete()`` sera appelée avant la méthode
``beforeDelete()`` de votre table, et ne pourra pas travailler avec les nœuds
enfantsde l'enregistrement qui est en train d'être supprimé dans la méthode de
votre Table.

Vous avez plusieurs façons de gérer les priorités d'events:

#. Changez la priorité des écouteurs d'un Behavior en utilisant l'option
   ``priority``. Cela modifiera la priorité de **toutes** les méthodes de
   callback dans le Behavior::

        // Dans la méthode initialize() d'une Table
        $this->addBehavior('Tree', [
            // La valeur par défaut est 10, et les écouteurs sont déclenchés de
            // la plus faible valeur de priorité à la plus haute.
            'priority' => 2,
        ]);

#. Modifiez la priorité dans votre classe ``Table`` en utilisant la méthode
   ``Model.implementedEvents()``. Cela vous permet d'assigner une priorité
   différente pour chaque fonction de callback::

        // Dans une classe Table.
        public function implementedEvents()
        {
            $events = parent::implementedEvents();
            $events['Model.beforeDelete'] = [
                'callable' => 'beforeDelete',
                'priority' => 3
            ];

Behaviors
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Les Behaviors fournissent un moyen de créer des parties de logique
réutilisables horizontalement liées aux classes table. Vous vous demandez
peut-être pourquoi les behaviors sont des classes classiques et non des
traits. La raison principale tient aux écouteurs d'event. Alors que les traits
permettent de réutiliser des parties de logique, ils compliqueraient la
liaison des events.

Pour ajouter un behavior à votre table, vous pouvez appeler la méthode
``addBehavior()``. Généralement, le meilleur endroit pour le faire est dans la
méthode ``initialize()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
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
        public function initialize(array $config): void
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
base de données, vous voudrez peut-être configurer quelle table utilise
quelle connexion. C'est le rôle de la méthode ``defaultConnectionName()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName(): string {
            return 'replica_db';
        }
    }

.. note::

    La méthode ``defaultConnectionName()`` **doit** être statique.

.. _table-registry-usage:
.. _table-locator-usage:

Utiliser le TableLocator
========================

.. php:class:: TableLocator

Comme nous l'avons vu précédemment, la classe TableLocator fournit un
registre/fabrique facile d'utilisation pour accéder aux instances des tables
de vos applications. Elle fournit aussi quelques autres fonctionnalités utiles.

Configurer les Objets Table
---------------------------

.. php:method:: get($alias, $config)

Lors du chargement des tables à partir du registry, vous pouvez personnaliser
leurs dépendances, ou utiliser les objets factices en fournissant un tableau
``$options``::

    $articles = FactoryLocator::get('Table')->get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

Remarquez les paramètres de configurations de la connexion et du schéma, ils
ne sont pas des valeurs de type string mais des objets. La connexion va
prendre un objet ``Cake\Database\Connection`` et un schéma
``Cake\Database\Schema\Collection``.

.. note::

    Si votre table fait aussi une configuration supplémentaire dans sa méthode
    ``initialize()``, ces valeurs vont écraser celles fournies au registre.

Vous pouvez aussi pré-configurer le registre en utilisant la méthode
``setConfig()``. Les données de configuration sont stockées *par alias*, et peuvent
être surchargées par une méthode ``initialize()`` de l'objet::

    FactoryLocator::get('Table')->setConfig('Users', ['table' => 'my_users']);

.. note::

    Vous pouvez configurer une table avant ou pendant la **première** fois
    où vous accédez à l'alias. Faire ceci après que le registre est rempli
    n'aura aucun effet.

Vider le Registre
-----------------

.. php:method:: clear()

Pendant les cas de test, vous voudrez vider le registre. Faire ceci est souvent
utile quand vous utilisez les objets factices, ou modifiez les dépendances d'une
table::

    FactoryLocator::get('Table')->clear();

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

