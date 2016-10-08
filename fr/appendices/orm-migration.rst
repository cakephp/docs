Guide de Migration du Nouvel ORM
################################

CakePHP 3.0 apporte un nouvel ORM qui a été réécrit de zéro.
Alors que l'ORM utilisé dans 1.x et 2.x nous a bien servi pendant un long
moment, il avait quelques problèmes que nous souhaitions régler.

* Frankenstein - est-ce un enregistrement, ou une table? Actuellement c'est les
  deux.
* API incohérente - Model::read() par exemple.
* Pas d'objet query - Les queries sont toujours définies comme des tableaux,
  ceci amène quelques limitations et restrictions. Par exemple, cela rend les
  unions et les sous-requêtes plus compliquées.
* Retourne des tableaux. C'est une plainte courante au sujet de CakePHP, et
  ceci a probablement réduit le passage à certains niveaux.
* Pas d'objet d'enregistrement - Ceci rend l'attachement de méthodes de format
  difficile/impossible.
* Containable - Devrait être une partie de l'ORM, pas un behaviour compliqué.
* Recursive - Ceci devrait être mieux contrôlé en définissant quelles
  associations sont inclues, et pas un niveau de récursivité.
* DboSource - C'est un calvaire, et le Model repose dessus plus que sur la
  source de données. Cette séparation pourrait être plus propre et plus simple.
* Validation - Devrait être séparée, c'est actuellement une énorme fonction
  ingérable. La rendre un peu plus réutilisable rendrait le framework plus
  extensible.

L'ORM dans CakePHP 3.0 résout ces problèmes et beaucoup d'autres encore. Le
nouvel ORM se focalise actuellement sur les stockages des données
relationnelles. Dans le future et à travers les plugins, nous ajouterons des
stockages non relationnels comme ElasticSearch et d'autres encore.

Design du nouvel ORM
====================

Le nouvel ORM résout de nombreux problèmes en ayant des classes plus
spécialisées et concentrées. Dans le passé vous utilisiez ``Model`` et une
Source de données pour toutes les opérations. Maintenant l'ORM est
séparé en plus de couches:

* ``Cake\Database\Connection`` - Fournit un moyen de créer et utiliser des
  connections indépendamment de la plateforme. Cette classe permet
  d'utiliser les transactions, d'exécuter les queries et d'accéder aux données
  du schema.
* ``Cake\Database\Dialect`` - Les classes dans ce namespace fournissent le SQL
  spécifique à une plateforme et transforment les queries pour fonctionner selon
  les limitations spécifiques de celle ci.
* ``Cake\Database\Type`` - Est la classe de passerelle vers le système
  de conversion de type de base de données de CakePHP. C'est un framework
  modulable pour l'ajout des types de colonnes abstraites et pour fournir des
  mappings entre base de données, les représentations de PHP et les liens PDO
  pour chaque type de données. Par exemple, les colonnes datetime sont
  maintenant représentées comme des instances ``DateTime`` dans votre code.
* ``Cake\ORM\Table`` - Le point d'entrée principal dans le nouvel ORM. Fournit
  l'accès à une table unique. Gère la définition d'association, utilise les
  behaviors et la création d'entités et d'objets query.
* ``Cake\ORM\Behavior`` - La classe de base pour les behaviors, qui agit de
  façon très similaire aux behaviors dans les versions précédentes de CakePHP.
* ``Cake\ORM\Query`` - Un générateur de requêtes simple basé sur les objets qui
  remplace les tableaux profondément imbriqués utilisés dans les versions
  précédentes de CakePHP.
* ``Cake\ORM\ResultSet`` - Une collection de résultats qui donne des outils
  puissants pour manipuler les données dans l'ensemble.
* ``Cake\ORM\Entity`` - Représente le résultat d'un enregistrement unique. Rend
  les données accessibles et sérialisable vers des formats divers en un tour de
  main.

Maintenant que vous êtes plus familier avec certaines des classes avec
lesquelles vous intéragissez le plus fréquemment dans le nouvel ORM, il est
bon de regarder les trois plus importantes classes. Les classes
``Table``, ``Query`` et ``Entity`` sont les grandes nouveautés du lifting du
nouvel ORM, et chacun sert un objectif différent.

Les Objets Table
----------------

Les objets Table sont la passerelle vers vos données. Ils gèrent plusieurs des
tâches que le ``Model`` faisait dans les versions précédentes. Les classes de
Table gèrent les tâches telles que:

- Créer des queries.
- Fournir des finders.
- Valider et sauvegarder des entités.
- Supprimer des entités.
- Définir & accéder aux associations.
- Déclencher les événements de callback.
- Interagir avec les behaviors.

Le chapitre de la documentation sur :doc:`/orm/table-objects` fournit bien plus
de détails sur la façon d'utiliser les objets de table que ce guide.
Généralement quand on déplace le code du model existant,
il va finir dans un objet Table. Les objets Table ne contiennent aucun
SQL dépendant de la plateforme. A la place, ils collaborent avec les entités et
le générateur de requêtes pour faire leur travail. Les objets Table
intéragissent aussi avec les behaviors et d'autres parties à travers les
événements publiés.

Les Objets Query
----------------

Alors que celles-ci ne sont pas des classes que vous allez construire vous-même,
le code de votre application fera un usage intensif du
:doc:`Générateur de Requêtes </orm/query-builder>` qui est central dans le
nouvel ORM. Le générateur de requêtes facilite la construction de requêtes
simples ou complexes incluant celles qui étaient précédemment très difficiles
dans CakePHP comme ``HAVING``, ``UNION`` et les sous-requêtes.

Les différents appels de find() que votre application utilise couramment
auront besoin d'être mis à jour pour utiliser le nouveau générateur de requête.
L'objet Query est responsable de la façon de contenir les données pour
réaliser une requête sans l'exécuter. Elle collabore avec la connection/dialect
pour générer le SQL spécifique à la plateforme qui est exécutée en créant un
``ResultSet`` en sortie.

Les Objets Entity
-----------------

Dans les versions précédentes de CakePHP la classe ``Model`` retournait
des tableaux idiots qui ne contenaient pas de logique ou de behavior. Alors
que la communauté rendait cela accessible et moins douloureux avec les
projets comme CakeEntity, le tableau de résutlats était souvent une source
de difficulté pour beaucoup de développeurs. Pour CakePHP 3.0, l'ORM
retourne toujours l'ensemble des résultats en objet à moins que vous ne
désactiviez explicitement cette fonctionnalité. Le chapitre sur
:doc:`/orm/entities` couvre les différentes tâches que vous pouvez accomplir
avec les entities.

Les entities sont créées en choisissant l'une des deux façons suivantes. Soit
en chargeant les données à partir de la base de données, soit en convertissant
les données de requête en entities. Une fois créées, les entities vous
permettent de manipuler les données qu'elles contiennent et font persister leurs
données en collaborant avec les objets Table.

Différences Clé
===============

Le nouvel ORM est un grand renouveau par rapport à la couche ``Model``
existante. Il y a plusieurs différences importantes à comprendre sur la façon
dont le nouvel ORM opère et comment mettre à jour votre code.

Les Règles d'Inflection Mises à Jour
------------------------------------

Vous avez peut-être noté que les classes Table ont un nom pluralisé. En plus
d'avoir les noms pluralisés, les associations se réfèrent aussi à la forme
plurielle. C'est en opposition par rapport au ``Model`` où les noms et
associations étaient au singulier. Il y avait plusieurs raisons pour ce
changement:

* Les classes de Table représentent des **collections** de données, pas des
  enregistrements uniques.
* Les associations lient les tables ensemble, décrivant les relations entre
  plusieurs choses.

Alors que les conventions pour les objets Table sont de toujours utiliser
les formes plurielles, les propriétés d'association de votre entitie seront
remplies en se basant sur le type d'association.

.. note::

    Les associations BelongsTo et HasOne utiliseront la forme au singulier,
    tandis que HasMany et BelongsToMany (HABTM) utiliseront la forme plurielle.

Le changement de convention pour les objects Table est plus apparent lors de
la construction de queries. A la place d'expressions de requêtes comme::

    // Faux
    $query->where(['User.active' => 1]);

Vous avez besoin d'utiliser la forme au pluriel::

    // Correct
    $query->where(['Users.active' => 1]);

Find retourne un Objet Query
----------------------------

Une différence importante dans le nouvel ORM est qu'appeler ``find`` sur une
table ne va pas retourner les résultats immédiatement, mais va retourner un
objet Query; cela sert dans plusieurs cas.

Il est possible de modifier les requêtes plus tard, après avoir appeler
``find``::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    $query->where(['author_id' => 1])->order(['title' => 'DESC']);

Il est possible d'empiler les finders personnalisés pour ajouter les conditions
à la suite, pour trier, limiter et toute autre clause pour la même requête
avant qu'elle ne soit exécutée::

    $query = $articles->find('approved')->find('popular');
    $query->find('latest');

Vous pouvez composer des requêtes l'une dans l'autre pour créer des
sous-requêtes plus facilement que jamais::

    $query = $articles->find('approved');
    $favoritesQuery = $article->find('favorites', ['for' => $user]);
    $query->where(['id' => $favoritesQuery->select(['id'])]);

Vous pouvez décorer les requêtes avec des itérateurs et des méthodes d'appel
sans même toucher à la base de données, c'est bien quand vous avez des parties
de votre view mise en cache et avez les résultats pris à partir de la base de
données qui n'est en fait pas nécessaire::

    // Pas de requêtes faites dans cet exemple!
    $results = $articles->find()
        ->order(['title' => 'DESC'])
        ->formatResults(function ($results) {
            return $results->extract('title');
        });

Les requêtes peuvent être vues comme un objet de résultat, essayant d'itérer la
requête, appelant ``toArray()`` ou toute méthode héritée de
:doc:`collection </core-libraries/collections>`, va faire que la requête sera
exécutée et les résultats vous seront retournés.

La plus grande différence que vous trouverez quand vous venez de CakePHP 2.x est
que ``find('first')`` n'existe plus. Il existe un remplacement trivial pour
cela et il s'agit de la méthode ``first()``::

    // Avant
    $article = $this->Article->find('first');

    // Maintenant
    $article = $this->Articles->find()->first();

    // Avant
    $article = $this->Article->find('first', [
        'conditions' => ['author_id' => 1]
    ]);

    // Maintenant
    $article = $this->Articles->find('all', [
        'conditions' => ['author_id' => 1]
    ])->first();

    // Peut aussi être écrit
    $article = $this->Articles->find()
        ->where(['author_id' => 1])
        ->first();

Si vous chargez un enregistrement unique par sa clé primaire, il serait mieux
de juste appeler ``get()``::

    $article = $this->Articles->get(10);

Changements de la méthode Finder
--------------------------------

Retourner un objet Query à partir d'une méthode find a plusieurs avantages,
mais vient avec un coût pour les gens migrant de 2.x. Si vous aviez quelques
méthodes find personnalisées dans vos models, elles auront besoin de quelques
modifications. C'est de cette façon que vous créez les méthodes finder
personnalisées dans 3.0::

    class ArticlesTable
    {

        public function findPopular(Query $query, array $options)
        {
            return $query->where(['times_viewed' > 1000]);
        }

        public function findFavorites(Query $query, array $options)
        {
            $for = $options['for'];
            return $query->matching('Users.Favorites', function ($q) use ($for) {
                return $q->where(['Favorites.user_id' => $for]);
            });
        }
    }

Comme vous pouvez le voir, ils sont assez simples, ils obtiennent un objet
Query à la place d'un tableau et doivent retourner un objet Query en retour.
Pour 2.x, les utilisateurs qui implémentaient la logique afterFind dans les
finders personnalisés, vous devez regarder la section :ref:`map-reduce`, ou
utiliser les :doc:`collections </core-libraries/collections>`. Si dans vos
models, vous aviez pour habitude d'avoir un afterFind pour toutes les
opérations de find, vous pouvez migrer ce code d'une des façons suivantes:

1. Surcharger la méthode constructeur de votre entity et faire le formatage supplémentaire ici.
2. Créer des méthodes accesseurs dans votre entity pour créer les propriétés virtuelles.
3. Redéfinir ``findAll()`` et utiliser ``formatResults``.

Dans le 3ème cas ci-dessus, votre code ressemblerait à::

    public function findAll(Query $query, array $options)
    {
        return $query->formatResults(function ($results) {
            return $results->map(function ($row) {
                // Votre logique afterfind
            });
        })
    }

Vous avez peut-être noté que les finders personnalisés reçoivent
un tableau d'options, vous pouvez passer toute information supplémentaire
à votre finder en utilisant ce paramètre. C'est une bonne nouvelle pour la
migration de gens à partir de 2.x. Chacune des clés de requêtées qui a été
utilisée dans les versions précédentes sera convertie automatiquement pour
vous dans 3.x vers les bonnes fonctions::

    // Ceci fonctionne dans les deux CakePHP 2.x et 3.0
    $articles = $this->Articles->find('all', [
        'fields' => ['id', 'title'],
        'conditions' => [
            'OR' => ['title' => 'Cake', 'author_id' => 1],
            'published' => true
        ],
        'contain' => ['Authors'], // Le seul changement! (notez le pluriel)
        'order' => ['title' => 'DESC'],
        'limit' => 10,
    ]);

Si votre application utilise des :ref:`dynamic-finders` ou 'magiques', vous
devrez adapter ces appels. Dans 3.x, les méthodes ``findAllBy*`` ont été
retirées, à la place ``findBy*`` retourne toujours un objet query. Pour
récupérer le premier résultat, vous devrez utiliser la méthode ``first()``::

    $article = $this->Articles->findByTitle('Un super post!')->first();

Heureusement, la migration à partir des versions anciennes n'est pas aussi
difficile qu'il y paraît, la plupart des fonctionnalités que nous avons ajoutées
vous aide à retirer le code puisque vous pouvez mieux exprimer vos exigences
en utilisant le nouvel ORM et en même temps les wrappers de compatibilité vous
aideront à réécrire ces petites différences d'une façon rapide et sans douleur.

Une des autres améliorations sympas dans 3.x autour des méthodes finder est que
les behaviors peuvent implémenter les méthodes finder sans aucun soucis. En
définissant simplement une méthode avec un nom matchant et la signature sur un
Behavior le finder sera automatiquement disponible sur toute table sur laquelle
le behavior est attaché.

Recursive et ContainableBehavior Retirés.
-----------------------------------------

Dans les versions précédentes de CakePHP, vous deviez utiliser
``recursive``, ``bindModel()``, ``unbindModel()`` et ``ContainableBehavior``
pour réduire les données chargées pour l'ensemble des associations que
vous souhaitiez. Une tactique habituelle pour gérer les
associations était de définir ``recursive`` à ``-1`` et d'utiliser Containable
pour gérer toutes les associations. Dans CakePHP 3.0 ContainableBehavior,
recursive, bindModel, et unbindModel ont été retirées. A la place, la méthode
``contain()`` a été favorisée pour être une fonctionnalité du cœur du
query builder. Les associations sont seulement chargées si elles sont
explicitement activées. Par exemple::

    $query = $this->Articles->find('all');

Va **seulement** charger les données à partir de la table ``articles`` puisque
aucune association n'a été inclue. Pour charger les articles et leurs auteurs
liés, vous feriez::

    $query = $this->Articles->find('all')->contain(['Authors']);

En chargeant seulement les données associées qui on été spécifiquement requêtées
vous ne passez pas votre temps à vous battre avec l'ORM à essayer d'obtenir
seulement les données que vous souhaitez.

Pas d'Event afterFind ou de Champs Virtuels
-------------------------------------------

Dans les versions précédentes de CakePHP, vous aviez besoin de rendre
extensive l'utilisation du callback ``afterFind`` et des champs virtuels afin
de créer des propriétés de données générées. Ces fonctionnalités ont été
retirées dans 3.0. Du fait de la façon dont ResultSets génèrent itérativement
les entities, le callback ``afterFind`` n'était pas possible.
afterFind et les champs virtuels peuvent tous deux largement être remplacés par
les propriétés virtuelles sur les entities. Par exemple si votre entité User
a les deux colonnes first et last name, vous pouvez ajouter un accesseur pour
`full_name` et générer la propriété à la volée::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        public function getFullName()
        {
            return $this->first_name . '  ' $this->last_name;
        }
    }

Une fois définie, vous pouvez accéder à votre nouvelle propriété en utilisant
``$user->full_name``. L'utilisation des fonctionnalités :ref:`map-reduce`
de l'ORM vous permettent de construire des données agrégées à partir de vos
résultats, ce qui était souvent un autre cas d'utilisation callback ``afterFind``.

Alors que les champs virtuels ne sont plus une fonctionnalité de l'ORM,
l'ajout des champs calculés est facile à faire dans les méthodes finder. En
utilisant le query builder et les objets expression, vous pouvez atteindre
les mêmes résultats que les champs virtuels, cela donne::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {
        public function findAverage(Query $query, array $options = [])
        {
            $avg = $query->func()->avg('rating');
            $query->select(['average' => $avg]);
            return $query;
        }
    }

Les Associations Ne sont Plus Définies en Propriétés
----------------------------------------------------

Dans les versions précédentes de CakePHP, les diverses associations que vos
models avaient, ont été définies dans les propriétés comme ``$belongsTo`` et
``$hasMany``. Dans CakePHP 3.0, les associations sont créées avec les méthodes.
L'utilisation de méthodes vous permet de mettre de côté plusieurs définitions
de classes de limitations, et fournissent seulement une façon de définir les
associations. Votre méthode ``initialize()`` et toutes les autres parties de
votre code d'application, interagit avec la même API lors de la
manipulation des associations::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Movies');
            $this->hasOne('Rating');
            $this->hasMany('Comments')
            $this->belongsToMany('Tags')
        }

    }

Comme vous pouvez le voir de l'exemple ci-dessus, chaque type d'association
utilise une méthode pour créer l'association. Une autre différence est que
``hasAndBelongsToMany`` a été renommée en ``belongsToMany``. Pour en apprendre
plus sur la création des associations dans 3.0, regardez la section sur
:doc:`les associations </orm/associations>`.

Une autre amélioration bienvenue de CakePHP est la capacité de créer votre
propre classe d'associations. Si vous avez des types d'association qui ne sont
pas couverts par les types de relations intégrées, vous pouvez créer une
sous-classe ``Association`` personnalisée et définir la logique d'association
dont vous avez besoin.

Validation n'est plus Définie Comme une Propriété
-------------------------------------------------

Comme les associations, les règles de validation ont été définies comme une
propriété de classe dans les versions précédentes de CakePHP. Ce tableau
sera ensuite transformé paresseusement en un objet ``ModelValidator``. Cette
étape de transformation ajoutée en couche d'indirection, compliquant les
changements de règle lors de l'exécution. De plus, les règles de validation
étant définies comme propriété rendait difficile pour un model d'avoir
plusieurs ensembles de règles de validation. Dans CakePHP 3.0, on a remédié à
deux de ces problèmes. Les règles de validation sont toujours construites
avec un objet ``Validator``, et il est trivial d'avoir plusieurs ensembles de
règles::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;
    use Cake\Validation\Validator;

    class ReviewsTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator->requirePresence('body')
                ->add('body', 'length', [
                    'rule' => ['minLength', 20],
                    'message' => 'Reviews must be 20 characters or more',
                ])
                ->add('user_id', 'numeric', [
                    'rule' => 'numeric'
                ]);
            return $validator;
        }

    }

Vous pouvez définir autant de méthodes de validation que vous souhaitez. Chaque
méthode doit être préfixée avec ``validation`` et accepte un argument
``$validator``.

Dans les versions précédentes de CakePHP, la 'validation' et les callbacks liés
couvraient quelques utilisations liées mais différentes. Dans CakePHP 3.0, ce
qui était avant appelé validation est maintenant séparé en deux concepts:

#. Validation du type de données et du format.
#. Vérification des règles métiers.

La validation est maintenant appliquée avant que les entities de l'ORM
ne soient créées à partir des données de request. Cette étape permet de
vous assurer que les données correspondent au type de données, au format et
à la forme de base que votre application attend. Vous pouvez utiliser
vos validateurs quand vous convertissez en entities les données de request en
utilisant l'option ``validate``. Consultez la documentation
:ref:`converting-request-data` pour plus d'informations.

:ref:`Les règles d'Application <application-rules>` vous permettent de définir
les règles qui s'assurent que vos règles d'application, l'état et les flux de
travail sont remplis. Les règles sont définies dans la méthode ``buildRules()``
de votre Table. Les behaviors peuvent ajouter des règles en utilisant la méthode
``buildRules()``. Un exemple de méthode ``buildRules()`` pour notre table
articles pourrait être::

    // Dans src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\RulesChecker;

    class ArticlesTable extends Table
    {
        public function buildRules(RulesChecker $rules)
        {
            $rules->add($rules->existsIn('user_id', 'Users'));
            $rules->add(
                function ($article, $options) {
                    return ($article->published && empty($article->reviewer));
                },
                'isReviewed',
                [
                    'errorField' => 'published',
                    'message' => 'Articles must be reviewed before publishing.'
                ]
            );
            return $rules;
        }
    }

Identifier Quoting Désactivé par Défaut
---------------------------------------

Dans le passé, CakePHP a toujours quoté les identifieurs. Parser les bouts de
code SQL et tenter de quoter les identifiers étaient tous les deux des source
d'erreurs et coûteuses. Si vous suivez les conventions que CakePHP définit,
les coûts du identifier quoting l'emporte sur tout avantage qu'il fournisse.
Puisque ce identifier quoting a été désactivé par défaut dans 3.0. Vous devriez
seulement activer le identifier quoting si vous utilisez les noms de colonne ou
les noms de table qui contiennent des caractères spéciaux ou sont des mots
réservés. Si nécessaire, vous pouvez activer identifier quoting lors de la
configuration d'une connection::

    // Dans config/app.php
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Driver\Mysql',
            'username' => 'root',
            'password' => 'super_secret',
            'host' => 'localhost',
            'database' => 'cakephp',
            'quoteIdentifiers' => true
        ]
    ],

.. note::

    Les identifiers dans les objets ``QueryExpression`` ne seront pas quotés, et
    vous aurez besoin de les quoter manuellement ou d'utiliser les objets
    IdentifierExpression.

Mise à jour des behaviors
=========================

Comme la plupart des fonctionnalités liées à l'ORM, les behaviors ont aussi
changé dans 3.0. Ils attachent maintenant les instances à ``Table`` qui sont
les descendants conceptuels de la classe ``Model`` dans les versions précédentes
de CakePHP. Il y a quelques petites différences clés par rapport aux behaviors
de CakePHP 2.x:

- Les Behaviors ne sont plus partagés par plusieurs tables. Cela signifie
  que vous n'avez plus à 'donner un namespace' aux configurations stockés dans
  behavior. Chaque table utilisant un behavior va créer sa propre instance.
- Les signatures de méthode pour les méthodes mixin a changé.
- Les signatures de méthode pour les méthodes de callback a changé.
- La classe de base pour les behaviors a changé.
- Les Behaviors peuvent ajouter des méthodes find.

Nouvelle classe de Base
-----------------------

La classe de base pour les behaviors a changé. Les Behaviors doivent maintenant
étendre ``Cake\ORM\Behavior``; si un behavior n'étend pas cette classe, une
exception sera lancée. En plus du changement de classe de base, le constructeur
pour les behaviors a été modifié, et la méthode ``startup()`` a été retirée.
Les Behaviors qui ont besoin d'accéder à la table à laquelle ils sont attachés,
doivent définir un constructeur::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {

        protected $_table;

        public function __construct(Table $table, array $config)
        {
            parent::__construct($table, $config);
            $this->_table = $table;
        }

    }

Changements de Signature des Méthodes Mixin
-------------------------------------------

Les Behaviors continuent d'offrir la possibilité d'ajouter les méthodes
'mixin' à des objets Table, cependant la signature de méthode pour ces méthodes
a changé. Dans CakePHP 3.0, les méthodes mixin du behavior peuvent attendre les
**mêmes** arguments fournis à la table 'method'. Par exemple::

    // Supposons que la table a une méthode slug() fournie par un behavior.
    $table->slug($someValue);

Le behavior qui fournit la méthode ``slug()`` va recevoir seulement 1 argument,
et ses méthodes signature doivent ressembler à ceci::

    public function slug($value)
    {
        // code ici.
    }

Changements de Signature de Méthode de Callback
-----------------------------------------------

Les callbacks de Behavior ont été unifiés avec les autres méthodes listener.
Au lieu de leurs arguments précédents, ils attendent un objet event en premier
argument::

    public function beforeFind(Event $event, Query $query, array $options)
    {
        // code.
    }

Regardez :ref:`table-callbacks` pour les signatures de tous les callbacks
auquel un behavior peut souscrire.
