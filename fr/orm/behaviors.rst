Behaviors (Comportements)
#########################

Les behaviors (comportements) sont une manière d'organiser et de réutiliser
la logique de la couche Model. Conceptuellement, ils sont similaires aux traits.
Cependant, les behaviors sont implémentés en classes séparées. Ceci leur permet
de hook dans le cycle de vie des callbacks que les models emettent, tout en
fournissant des fonctionnalités de type trait.

Les Behaviors fournissent une façon pratique de packager un behavior qui est
commun à plusieurs models. Par exemple, CakePHP inclut un ``TimestampBehavior``.
Plusieurs models voudront des champs timestamp, et la logique pour gérer ces
champs n'est pas spécifique à un seul model. C'est dans ce genre de scénario
que les behaviors sont utiles.

Utiliser les Behaviors
======================

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

Behaviors du Coeur
==================

.. include:: ../core-libraries/toc-behaviors.rst
    :start-after: start-toc
    :end-before: end-toc

Créer un Behavior
=================

Dans les exemples suivants, nous allons créer un ``SluggableBehavior`` très
simple. Ce behavior va nous autoriser à remplir un champ slug avec les
résultats de ``Inflector::slug()`` basé sur un autre champ.

Avant de créer notre behavior, nous devrions comprendre les conventions pour
les behaviors:

- Les fichiers Behavior sont localisés dans ``App/Model/Behavior``, ou dans
  ``MyPlugin\Model\Behavior``.
- Les classes de Behavior devraient être dans le namespace
  ``App\Model\Behavior``, ou le namespace ``MyPlugin\Model\Behavior``.
- Les noms de classe de Behavior finissent par ``Behavior``.
- Les Behaviors étendent ``Cake\ORM\Behavior``.

Pour créer notre behavior sluggable. Mettez ce qui suit dans
``App/Model/Behavior/SluggableBehavior.php``::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior {
    }

Nous pouvons maintenant ajouter ce behavior à l'une de nos classes de table.
Dans cet exemple, nous allons utiliser un ``ArticlesTable``, puisque articles
ont souvent des propriétés slug pour créer de belles URLs::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->addBehavior('Sluggable');
        }
    }

Notre nouveau behavior ne fait pas beaucoup plus en ce moment. Ensuite, nous
allons ajouter une méthode mixin et un event listener pour que lorque nous
sauvegardons les entities, nous puissions automatiquement slugger un champ.

Définir les Méthodes Mixin
--------------------------

Toute méthode public définie sur un behavior sera ajoutée en méthode 'mixin'
sur l'objet table sur laquelle elle est attachée. Si vous attachez deux
behaviors qui fournissent les mêmes méthodes, une exception sera levée.
Si un behavior fournit la même méthode en classe de table, la méthode du
behavior ne sera pas appelable à partir de la table. Les méthodes mixin de
Behavior vont recevoir exactement les mêmes arguments qui sont fournies à la
table. Par exemple, si notre SluggableBehavior définit la méthode suivante::

    public function slug($value) {
        return Inflector::slug($value, $this->_config['replacement']);
    }

It could be invoked using::

    $slug = $articles->slug('My article name');

Limiter ou renommer les Méthodes Mixin Exposed
----------------------------------------------

Lors de la création de behaviors, il peut y avoir des situations où vous ne
voulez pas montrer les méthodes public en méthodes mixin. Dans ces cas, vous
pouvez utiliser la clé de configuration ``implementedMethods`` pour renommer
ou exclure les méthodes mixin. Par exemple si vous voulez préfixer notre méthode
slug(), nous pourrions faire ce qui suit::

    public $_defaultConfig = [
        'implementedMethods' => [
            'slug' => 'superSlug',
        ]
    ];

Appliquer cette configuration rendra votre ``slug()`` non appelable, cependant
elle va ajouter une méthode mixin ``superSlug()`` à la table. Notablement, si
notre behavior implémentait d'autres méthodes public, ils **n'auraient** pas
été disponible en méthodes mixin avec la configuration ci-dessus.

Depuis que les méthodes montrées sont décidées par configuration, vous pouvez
aussi renommer/retirer les méthodes mixin lors de l'ajout d'un behavior à la
table. Par exemple::

    // Dans une méhode initialize() de la table.
    $this->addBehavior('Sluggable', [
        'implementedMethods' => [
            'slug' => 'superSlug',
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

    use Cake\Event\Event;
    use Cake\ORM\Behavior;
    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class SluggableBehavior extends Behavior {
        proteted $_defaultConfig = [
            'field' => 'title',
            'slug' => 'slug',
            'replacement' => '-',
        ];

        public function slug(Entity $entity) {
            $config = $this->config();
            $value = $entity->get($config['field']);
            $entity->set($config['slug'], Inflector::slug($value, $config['replacement']));
        }

        public function beforeSave(Event $event, Entity $entity) {
            $this->slug($entity);
        }

    }

Le code ci-dessus montre quelques fonctionnalités intéréssentes des behaviors:

- Les Behaviors peuvent définir des méthodes callback en définissant des
  méthodes qui suivent les conventions :ref:`table-callbacks`.
- Les Behaviors peuvent définir une propriété de configuration par défaut. Cette
  propriété est fusionnée avec les overrides lorqu'un behavior est attaché à
  la table.

Définir des Finders
-------------------

Maintenant que nous sommes capable de sauvegarder les articles avec les valeurs
de slug, nous allons implémenter une méthode de find afin de pouvoir
facilement récupérer les articles par leur slug. Les méthodes find de behavior
utilisent les mêmes conventions que les :ref:`custom-find-methods`. Notre
méthode ``find('slug')`` ressemblerait à ceci::

    public function findSlug(Query $query, array $options = []) {
        return $query->where(['slug' => $options['slug']]);
    }

Une fois que notre behavior a la méthode ci-dessus, nous pouvons l'appeler::

    $article = $articles->find('slug', ['slug' => $value])->first();

Limiter ou renommer les Méthodes de Exposed Finder
--------------------------------------------------

Lors de la création de behaviors, il peut y avoir des situations où vous ne
voulez pas montrer les méthodes find, ou vous avez besoin de renommer les
finders pour éviter les méthodes dupliquées. Dans ces cas, vous pouvez utiliser
la clé de configuration ``implementedFinders`` pour renommer ou exclure les
méthodes find. Par exemple, si vous voulez renommer notre méthode
``find(slug)``, nous pourrions faire ce qui suit::

    public $_defaultConfig = [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ];

Utliser cette configuration fera que ``find('slug')`` attrapera une erreur.
Cepedant, cela rendra ``find('slugged')`` disponible. Notamment si notre
behavior implémente d'autres méthodes find, elles **ne** seront pas disponible
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
