Behaviors (Comportements)
#########################

Les behaviors (comportements) sont une manière d'organiser et de réutiliser
la logique de la couche Model. Conceptuellement, ils sont similaires aux traits.
Cependant, les behaviors sont implémentés en classes séparées. Ceci leur permet
de s'insérer dans le cycle de vie des callbacks que les models émettent, tout en
fournissant des fonctionnalités de type trait.

Les Behaviors fournissent une façon pratique de packager un behavior qui est
commun à plusieurs models. Par exemple, CakePHP intègre un
``TimestampBehavior``. Plusieurs models voudront des champs timestamp, et la
logique pour gérer ces champs n'est pas spécifique à un seul model. C'est dans
ce genre de scénario que les behaviors sont utiles.

Utiliser les Behaviors
======================

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

Behaviors du Cœur
==================

.. toctree::
    :maxdepth: 1

    /orm/behaviors/counter-cache
    /orm/behaviors/timestamp
    /orm/behaviors/translate
    /orm/behaviors/tree

Créer un Behavior
=================

Dans les exemples suivants, nous allons créer un ``SluggableBehavior`` très
simple. Ce behavior va nous autoriser à remplir un champ slug avec les
résultats de ``Inflector::slug()`` basé sur un autre champ.

Avant de créer notre behavior, nous devrions comprendre les conventions pour
les behaviors:

- Les fichiers Behavior sont localisés dans **src/Model/Behavior**, ou dans
  ``MyPlugin\Model\Behavior``.
- Les classes de Behavior devraient être dans le namespace
  ``App\Model\Behavior``, ou le namespace ``MyPlugin\Model\Behavior``.
- Les noms de classe de Behavior finissent par ``Behavior``.
- Les Behaviors étendent ``Cake\ORM\Behavior``.

Pour créer notre behavior sluggable. Mettez ce qui suit dans
**src/Model/Behavior/SluggableBehavior.php**::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {
    }

Comme les tables, les behaviors ont également un hook ``initialize()`` où vous
pouvez mettre le code d'initialisation, si nécessaire::

    public function initialize(array $config)
    {
        // Code d'initialisation ici
    }

Nous pouvons maintenant ajouter ce behavior à l'une de nos classes de table.
Dans cet exemple, nous allons utiliser un ``ArticlesTable``, puisque les
articles ont souvent des propriétés slug pour créer de belles URLs::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Sluggable');
        }
    }

Notre nouveau behavior ne fait pas beaucoup plus pour le moment. Ensuite, nous
allons ajouter une méthode mixin et un event listener pour que lorsque nous
sauvegarderons les entities, nous puissions automatiquement slugger un champ.

Définir les Méthodes Mixin
--------------------------

Toute méthode public définie sur un behavior sera ajoutée en méthode 'mixin'
sur l'objet table sur laquelle il est attaché. Si vous attachez deux
behaviors qui fournissent les mêmes méthodes, une exception sera levée.
Si un behavior fournit la même méthode en classe de table, la méthode du
behavior ne sera pas appelable à partir de la table. Les méthodes mixin de
Behavior vont recevoir exactement les mêmes arguments qui sont fournis à la
table. Par exemple, si notre SluggableBehavior définit la méthode suivante::

    public function slug($value)
    {
        return Inflector::slug($value, $this->_config['replacement']);
    }

Il pourrait être invoqué de la façon suivante::

    $slug = $articles->slug('My article name');

Limiter ou renommer les Méthodes Mixin Exposed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Lors de la création de behaviors, il peut y avoir des situations où vous ne
voulez pas montrer les méthodes public en méthodes mixin. Dans ces cas, vous
pouvez utiliser la clé de configuration ``implementedMethods`` pour renommer
ou exclure les méthodes mixin. Par exemple si nous voulions préfixer notre
méthode slug(), nous pourrions faire ce qui suit::

    protected $_defaultConfig = [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ];

Appliquer cette configuration rendra votre ``slug()`` non appelable, cependant
elle va ajouter une méthode mixin ``superSlug()`` à la table. Cependant, si
notre behavior implémentait d'autres méthodes public, elles **n'auraient** pas
été disponibles en méthodes mixin avec la configuration ci-dessus.

Alors que les méthodes montrées sont définies par configuration, vous pouvez
aussi renommer/retirer les méthodes mixin lors de l'ajout d'un behavior à la
table. Par exemple::

    // Dans une méthode initialize() de la table.
    $this->addBehavior('Sluggable', [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ]);

Définir des Event Listeners
---------------------------

Maintenant que notre behavior a une méthode mixin pour slugger les champs, nous
pouvons implémenter un listener de callback pour slugger automatiquement un
champ quand les entities sont sauvegardées. Nous allons aussi modifier notre
méthode slug pour accepter une entity plutôt que juste une valeur plain. Notre
behavior devrait maintenant ressembler à ceci::

    namespace App\Model\Behavior;

    use Cake\Datasource\EntityInterface;
    use Cake\Event\Event;
    use Cake\ORM\Behavior;
    use Cake\ORM\Entity;
    use Cake\ORM\Query;
    use Cake\Utility\Inflector;

    class SluggableBehavior extends Behavior
    {
        protected $_defaultConfig = [
            'field' => 'title',
            'slug' => 'slug',
            'replacement' => '-',
        ];

        public function slug(Entity $entity)
        {
            $config = $this->config();
            $value = $entity->get($config['field']);
            $entity->set($config['slug'], Inflector::slug($value, $config['replacement']));
        }

        public function beforeSave(Event $event, EntityInterface $entity)
        {
            $this->slug($entity);
        }

    }

Le code ci-dessus montre quelques fonctionnalités intéressantes des behaviors:

- Les Behaviors peuvent définir des méthodes callback en définissant des
  méthodes qui suivent les conventions des :ref:`table-callbacks`.
- Les Behaviors peuvent définir une propriété de configuration par défaut. Cette
  propriété est fusionnée avec les valeurs données lorsqu'un behavior est
  attaché à la table.

Pour empêcher l'enregistrement de continuer, arrêtez simplement la propagation
de l'évènement dans votre callback::

    public function beforeSave(Event $event, EntityInterface $entity)
    {
        if (...) {
            $event->stopPropagation();
            return;
        }
        $this->slug($entity);
    }

Définir des Finders
-------------------

Maintenant que nous sommes capable de sauvegarder les articles avec les valeurs
de slug, nous allons implémenter une méthode de find afin de pouvoir récupérer
les articles par leur slug. Les méthodes find de behavior utilisent les mêmes
conventions que les :ref:`custom-find-methods`. Notre méthode ``find('slug')``
ressemblerait à ceci::

    public function findSlug(Query $query, array $options)
    {
        return $query->where(['slug' => $options['slug']]);
    }

Une fois que notre behavior a la méthode ci-dessus, nous pouvons l'appeler::

    $article = $articles->find('slug', ['slug' => $value])->first();

Limiter ou renommer les Méthodes de Finder Exposed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Lors de la création de behaviors, il peut y avoir des situations où vous ne
voulez pas montrer les méthodes find, ou vous avez besoin de renommer les
finders pour éviter les méthodes dupliquées. Dans ces cas, vous pouvez utiliser
la clé de configuration ``implementedFinders`` pour renommer ou exclure les
méthodes find. Par exemple, si vous vouliez renommer votre méthode
``find(slug)``, vous pourriez faire ce qui suit::

    protected $_defaultConfig = [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ];

Utiliser cette configuration fera que ``find('slug')`` attrapera une erreur.
Cependant, cela rendra ``find('slugged')`` disponible. Notamment si notre
behavior implémente d'autres méthodes find, elles **ne** seront pas disponibles
puisqu'elles ne sont pas inclues dans la configuration.

Depuis que les méthodes montrées sont décidées par configuration, vous pouvez
aussi renommer/retirer les méthodes find lors de l'ajout d'un behavior à la
table. Par exemple::

    // Dans la méthode initialize() de la table.
    $this->addBehavior('Sluggable', [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ]);

Transformer les Données de la Requête en Propriétés de l'Entity
===============================================================

Les Behaviors peuvent définir de la logique sur la façon dont les champs
personnalisés qu'ils fournissent sont marshalled en implémentant
``Cake\ORM\PropertyMarshalInterface``. Cette interface nécessite une méthode
unique à implémenter::

    public function buildMarhshalMap($marshaller, $map, $options)
    {
        return [
            'custom_behavior_field' => function ($value, $entity) {
                // Transform the value as necessary
                return $value . '123';
            }
        ];
    }

``TranslateBehavior`` a une implémentation non banal de cette interface que vous
pouvez aller consulter.

.. versionadded:: 3.3.0
    La possibilité pour les behaviors de participer au marshalling a été ajoutée
    dans la version 3.3.0

Retirer les Behaviors Chargés
=============================

Pour retirer un behavior de votre table, vous pouvez appeler la méthode
``removeBehavior()``::

    // Retire le behavior chargé
    $this->removeBehavior('Sluggable');

Accéder aux Behaviors Chargés
=============================

Une fois que vous avez attaché les behaviors à votre instance de Table, vous
pouvez interroger les behaviors chargés ou accéder à des behaviors
spécifiques en utilisant le ``BehaviorRegistry``::

    // Regarde les behaviors qui sont chargés
    $table->behaviors()->loaded();

    // Vérifie si un behavior spécifique est chargé.
    // N'utilisez pas les préfixes de plugin.
    $table->behaviors()->has('CounterCache');

    // Récupère un behavior chargé
    // N'utilisez pas les préfixes de plugin.
    $table->behaviors()->get('CounterCache');

Re-configurer les Behaviors Chargés
-----------------------------------

Pour modifier la configuration d'un behavior déjà chargé, vous pouvez combiner
la commande ``BehaviorRegistry::get`` avec la commande ``config`` fournie par
le trait ``InstanceConfigTrait``.

Par exemple si une classe parente (par ex ``AppTable``) charge le behavior
``Timestamp``, vous pouvez faire ce qui suit pour ajouter, modifier ou retirer
les configurations pour le behavior. Dans ce cas, nous ajouterons un event pour
lequel nous souhaitons que Timestamp réponde::

    namespace App\Model\Table;

    use App\Model\Table\AppTable; // similar to AppController

    class UsersTable extends AppTable
    {
        public function initialize(array $options)
        {
            parent::initialize($options);

            // par ex si notre parent appelle $this->addBehavior('Timestamp');
            // et que nous souhaitons ajouter un event supplémentaire
            if ($this->behaviors()->has('Timestamp') {
                $this->behaviors()->get('Timestamp')->config([
                    'events' => [
                        'Users.login' => [
                            'last_login' => 'always'
                        ],
                    ],
                ]);
            }
        }
    }
