Récupérer les Données et les Ensembles de Résultats
###################################################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Tandis que les objets table fournissent une abstraction autour d'un 'dépôt' ou
d'une collection d'objets, Les objets 'entity' correspondent à ce que vous
obtenez quand vous faites une requête sur des enregistrements individuels.
Dans la mesure où cette section parle des différentes façons de trouver et
charger les entities, vous pouvez lire préalablement la section
:doc:`/orm/entities` pour en savoir plus sur les entities.

Déboguer les Queries et les ResultSets
======================================

Étant donné que l'ORM retourne maintenant des Collections et des Entities,
déboguer ces objets peut être plus compliqué qu'avec les versions précédentes
de CakePHP. Il y a désormais plusieurs façons d'inspecter les données
retournées par l'ORM.

- ``debug($query)`` Montre le SQL et les paramètres liés, ne montre pas les
  résultats.
- ``debug($query->all())`` Montre les propriétés de ResultSet (pas les
  résultats).
- ``debug($query->toList())`` Montre les résultats dans un tableau.
- ``debug(iterator_to_array($query))`` Montre les résultats de la requête
  formatés en tableau.
- ``debug($query->toArray())`` Une façon facile de montrer chacun des résultats.
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` Résultats plus lisibles.
- ``debug($query->first())`` Montre les propriétés d'une seule entity.
- ``debug((string)$query->first())`` Montre les propriétés d'une seule entity en
  JSON.

Récupérer une Entity Unique avec une Clé Primaire
=================================================

.. php:method:: get($id, $options = [])

Quand vous modifiez ou visualisez des entities et leurs données liées, il est
souvent pratique de charger une entity unique à partir de la base de données.
Vous pouvez faire ceci en utilisant ``get()``::

    // Dans un controller ou dans une méthode de table.

    // Récupère un article unique
    $article = $articles->get($id);

    // Récupère un article unique, et les commentaires liés
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

Si l'opération get ne trouve aucun résultat, une
``Cake\Datasource\Exception\RecordNotFoundException`` sera levée. Vous pouvez
soit attraper cette exception vous-même, soit permettre à CakePHP de la
convertir en une erreur 404.

Comme ``find()``, ``get()`` a un cache intégré. Vous pouvez utiliser l'option
``cache`` quand vous appelez ``get()`` pour appliquer la mise en cache::

    // Dans un controller ou dans une méthode de table.

    // Utiliser une configuration de cache quelconque,
    // ou une instance de CacheEngine & une clé générée
    $article = $articles->get($id, [
        'cache' => 'cache_personnalise',
    ]);

    // Utilise une configuration de cache quelconque,
    // ou une instance de CacheEngine & une clé spécifique
    $article = $articles->get($id, [
        'cache' => 'cache_personnalise', 'key' => 'ma_cle'
    ]);

    // Désactive explicitement la mise en cache
    $article = $articles->get($id, [
        'cache' => false
    ]);

Une autre possibilité est de faire un ``get()`` d'une entity en utilisant
:ref:`custom-find-methods`. Par exemple si vous souhaitez récupérer toutes les
traductions pour une entity, vous pouvez le faire en utilisant l'option
``finder``::

    $article = $articles->get($id, [
        'finder' => 'traductions',
    ]);

Utiliser les Finders pour Charger les Données
=============================================

.. php:method:: find($type, $options = [])

Avant de travailler avec les entities, vous devrez les charger. La façon la
plus facile de le faire est d'utiliser la méthode ``find``. La méthode find
est un moyen simple et extensible pour trouver les données qui vous
intéressent::

    // Dans un controller ou dans une méthode de table.

    // Trouver tous les articles
    $query = $articles->find('all');

La valeur retournée par une méthode ``find`` est toujours un objet
:php:class:`Cake\\ORM\\Query`. La classe Query vous permet de réaffiner une
requête après l'avoir créée. Les objets Query sont évalués *lazily*, et ne
s'exécutent qu'à partir du moment où vous commencez à récupérer des lignes, les
convertissez en tableau, ou quand la méthode ``all()`` est appelée::

    // Dans un controller ou dans une méthode de table.

    // Trouver tous les articles.
    // À ce niveau, la requête n'est pas lancée.
    $query = $articles->find('all');

    // L'itération va exécuter la requête.
    foreach ($query->all() as $row) {
    }

    // Appeler all() va exécuter la requête
    // et retourner l'ensemble des résultats.
    $results = $query->all();

    // Une fois le résultat obtenu, nous pouvons en récupérer toutes les lignes
    $data = $results->toList();

    // Convertir la requête en tableau associatif va l'exécuter.
    $data = $query->toArray();

.. note::

    Une fois que vous avez commencé une requête, vous pouvez utiliser
    l'interface :doc:`/orm/query-builder` pour construire des requêtes
    plus complexes, ajouter des conditions supplémentaires, des limites, ou
    inclure des associations en utilisant l'interface fluide.

::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

Vous pouvez aussi fournir à ``find()`` plusieurs options couramment utilisées.
Cela peut être utile pour les tests puisqu'il y a peu de méthodes à mocker::

    // Dans un controller ou dans une méthode de table
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

La liste des options supportées par find() est :

- ``conditions`` fournit des conditions pour la clause WHERE de la requête.
- ``limit`` définit le nombre de lignes que vous voulez.
- ``offset`` définit l'offset de la page que vous souhaitez. Vous pouvez aussi
  utiliser ``page`` pour faciliter le calcul.
- ``contain`` définit les associations à charger en eager.
- ``fields`` limite les champs chargés dans l'entity. Le fait de ne pas charger
  tous les champs peut cependant faire que les entities se comportent de manière
  inappropriée.
- ``group`` ajoute une clause GROUP BY à votre requête. C'est utile quand vous
  utilisez des fonctions d'agrégation.
- ``having`` ajoute une clause HAVING à votre requête.
- ``join`` définit les jointures personnalisées supplémentaires.
- ``order`` trie l'ensemble des résultats.

Les options qui ne sont pas dans cette liste seront passées aux écouteurs de
beforeFind, où ils pourront être utilisés pour modifier l'objet requête. Vous pouvez utiliser
la méthode ``getOptions`` sur un objet query pour récupérer les options
utilisées. Bien que vous puissiez passer des objets requête à vos controllers,
nous vous recommandons plutôt de les rassembler dans des
:ref:`custom-find-methods`. En utilisant des méthodes finder personnalisées,
vous pourrez réutiliser vos requêtes et cela facilitera les tests.

Par défaut, les requêtes et les result sets renverront des objets
:doc:`/orm/entities`. Vous pouvez récupérer des tableaux basiques en désactivant
l'hydratation::

    $query->disableHydration();

    // $data est le ResultSet qui contient le tableau de données.
    $data = $query->all();

.. _table-find-first:

Récupérer les Premiers Résultats
================================

La méthode ``first()`` vous permet de récupérer seulement la première ligne
d'une requête. Si la requête n'a pas été exécutée, une clause ``LIMIT 1``
sera appliquée::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();

Cette approche remplace le ``find('first')`` des versions précédentes de
CakePHP. Vous pouvez aussi utiliser la méthode ``get()`` si vous recherchez les
entities par leur clé primaire.

.. note::

    La méthode ``first()`` renverra ``null`` si aucun résultat n'est trouvé.

Récupérer un Nombre de Résultats
================================

Une fois que vous avez créé un objet query, vous pouvez utiliser la méthode
``count()`` pour récupérer un décompte des résultats de cette query::

    // Dans un controller ou une méthode de table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

Consultez :ref:`query-count` pour d'autres utilisations de la méthode
``count()``.

.. _table-find-list:

Trouver les Paires de Clé/Valeur
================================

Cette fonctionnalité est pratique pour générer un tableau associatif de données
à partir des données de votre application. C'est notamment très utile pour la
création des elements `<select>`. CakePHP fournit une méthode simple à utiliser
pour générer des listes de données::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Les données ressemblent maintenant à ceci
    $data = [
        1 => 'Premier post',
        2 => 'Mon deuxième article',
    ];

Sans autre option, les clés de ``$data`` correspondront à la clé primaire de
votre table, tandis que les valeurs seront celles du champ désigné dans le
paramètre 'displayField' de la table. Le 'displayField' par défaut est ``title``
ou ``name``. Vous pouvez utiliser la méthode ``setDisplayField()`` de la table
pour configurer le champ à afficher::

    class ArticlesTable extends Table
    {

        public function initialize(array $config): void
        {
            $this->setDisplayField('label');
        }
    }

Au moment où vous appelez ``list``, vous pouvez configurer les champs utilisés
comme clé et comme valeur respectivement avec les options ``keyField`` et
``valueField``::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'label'
    ]);
    $data = $query->toArray();

    // Les données ressemblent maintenant à
    $data = [
        'premier-post' => 'Premier post',
        'mon-deuxieme-article' => 'Mon deuxième article',
    ];

Les résultats peuvent être regroupés. C'est utile quand vous voulez organiser
valeurs en sous-groupes, ou que vous voulez construire des elements
``<optgroup>`` avec ``FormHelper``::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'label',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // Les données ressemblent maintenant à
    $data = [
        1 => [
            'premier-post' => 'Premier post',
            'mon-deuxieme-article' => 'Mon deuxième article',
        ],
        2 => [
            // Les articles d'autres auteurs.
        ]
    ];

Vous pouvez aussi créer une liste de données à partir d'associations pouvant
être réalisées avec une jointure::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);

Les expressions ``keyField``, ``valueField``, et ``groupField`` font référence
au chemin des attributs dans les entités, et non sur des colonnes de la base de
données. Vous pouvez donc utiliser des champs virtuels dans les résultats de
``find(list)``.

Personnaliser la Sortie Clé-Valeur
----------------------------------

Pour finir, il est possible d'utiliser les closures pour accéder aux méthodes de
mutation des entities dans vos finds list. ::

    // Dans votre Entity Authors, créez un champ virtuel
    // à utiliser en tant que champ à afficher:
    protected function _getLibelle()
    {
        return $this->_fields['first_name'] . ' ' . $this->_fields['last_name']
          . ' / ' . __('User ID %s', $this->_fields['user_id']);
    }

Cet exemple montre l'utilisation de la méthode accesseur ``_getLabel()``
dans l'entity Author. ::

    // Dans vos finders/controller:
    $query = $articles->find('list', [
            'keyField' => 'id',
            'valueField' => function ($article) {
                return $article->author->get('label');
            }
        ])
        ->contain('Authors');


Vous pouvez aussi récupérer le libellé directement dans la liste en utilisant. ::

    // Dans AuthorsTable::initialize():
    $this->setDisplayField('label'); // Va utiliser Author::_getLabel()
    // Dans vos finders/controller:
    $query = $authors->find('list'); // Va utiliser AuthorsTable::getDisplayField()

Trouver des Données Filées
==========================

Le finder ``find('threaded')`` retourne des entities imbriquées qui sont filées
ensemble grâce à un champ servant de clé. Par défaut, ce champ est
``parent_id``. Ce finder vous permet d'accéder aux données stockées dans une
table de style 'liste adjacente'. Toutes les entities qui correspondent à un
``parent_id`` donné sont placées sous l'attribut ``children``::

    // Dans un controller ou dans une méthode table.
    $query = $comments->find('threaded');

    // Expanded les valeurs par défaut
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

Les clés ``parentField`` et ``keyField`` peuvent être utilisées pour définir
les champs qui vont servir au filage.

.. tip::
    Si vous devez gérer des données en arbre plus compliquées, utiliser de
    préférence le :doc:`/orm/behaviors/tree`.

.. _custom-find-methods:

Méthodes Finder Personnalisées
==============================

Les exemples ci-dessus montrent comment utiliser les finders intégrés ``all``
et ``list``. Cependant, il est possible et recommandé d'implémenter vos propres
méthodes finder. Les méthodes finder sont idéales pour rassembler des requêtes
utilisées couramment, ce qui vous permet de fournir une abstraction facile à
utiliser pour de nombreux détails de la requête. Les méthodes finder sont
définies en créant des méthodes nomméed par convention ``findFoo``, où ``Foo``
est le nom que vous souhaitez donner à votre finder. Par exemple, si nous
voulons ajouter à notre table d'articles un finder servant à rechercher parmi
les articles d'un certain auteur, nous ferions ceci::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function findEcritPar(Query $query, array $options)
        {
            $user = $options['user'];

            return $query->where(['author_id' => $user->id]);
        }

    }

    $query = $articles->find('ecritPar', ['user' => $userEntity]);

Les méthodes finder peuvent modifier la requête comme il se doit, ou utiliser
l'argument ``$options`` pour personnaliser l'opération finder selon la logique
souhaitée. Vous pouvez aussi 'empiler' les finders, ce qui permet d'exprimer
sans effort des requêtes complexes. En supposant que vous ayez à la fois des
finders 'published' et 'recent', vous pourriez très bien faire ceci::

    $query = $articles->find('published')->find('recent');

Bien que tous les exemples que nous avons cités jusqu'ici montrent des finders
qui s'appliquent sur des tables, il est aussi possible de définir des méthodes
finder sur des :doc:`/orm/behaviors`.

Si vous devez modifier les résultats après qu'ils ont été récupérés, vous
pouvez utiliser une fonction :ref:`map-reduce`. Les fonctionnalités de map
reduce remplacent le callback 'afterFind' présent dans les précédentes versions
de CakePHP.

.. _dynamic-finders:

Finders Dynamiques
==================

L'ORM de CakePHP fournit des finders construits dynamiquement, qui vous
permettent d'exprimer des requêtes simples sans écrire de code particulier.
Par exemple, admettons que vous recherchiez un utilisateur à partir de son
*username*. Vous pourriez procéder ainsi::

    // Dans un controller
    // Les deux appels suivants sont équivalents.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

Les finders dynamiques permettent même de filtrer sur plusieurs champs à la
fois::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

Vous pouvez aussi créer des conditions ``OR``::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

Vous pouvez utiliser des conditions OR ou AND, mais vous ne pouvez pas combiner
les deux dans un même finder dynamique. Les autres options de requête comme
``contain`` ne sont pas non plus supportées par les finders dynamiques. Vous
devrez utiliser des :ref:`custom-find-methods` pour encapsuler des requêtes plus
complexes. Pour finir, vous pouvez aussi combiner les finders dynamiques avec
des finders personnalisés::

    $query = $users->findTrollsByUsername('bro');

Ce qui se traduirait ainsi::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

Une fois que vous avez un objet query créé à partir d'un finder dynamique, vous
devrez appeler ``first()`` si vous souhaitez récupérer le premier résultat.

.. note::

    Bien que les finders dynamiques facilitent la gestion des requêtes, ils
    introduisent de petites contraintes. Vous ne pouvez pas appeler des méthodes
    ``findBy`` à partir d'un objet Query. Si vous voulez enchaîner des finders,
    le finder dynamique doit donc être appelé en premier.

Récupérer les Données Associées
===============================

Pour récupérer des données associées, ou filtrer selon les données associées, il
y a deux façons de procéder:

- utiliser des fonctions de requêtage de l'ORM de CakePHP telles que
  ``contain()`` et ``matching()``
- utiliser des fonctions de jointures telles que ``innerJoin()``,
  ``leftJoin()``, et ``rightJoin()``.

Vous devriez utiliser ``contain()`` quand vous voulez charger le modèle primaire
et ses données associées. Bien que ``contain()`` vous permette d'appliquer des
conditions supplémentaires sur les associations chargées, vous ne pouvez pas
filtrer le modèle primaire en fonction des données associées. Pour plus de
détails sur ``contain()``, consultez :ref:`eager-loading-associations`.

Vous devriez utiliser ``matching()`` quand vous souhaitez filtrer le modèle
primaire en fonction des données associées. Par exemple, quand vous voulez
charger tous les articles auxquels est associé un tag spécifique. Pour plus de
détails sur ``matching()``, consultez :ref:`filtering-by-associated-data`.

Si vous préférez utiliser les fonctions de jointure, vous pouvez consulter
:ref:`adding-joins` pour plus d'informations.

.. _eager-loading-associations:

Eager Loading des Associations Via Contain
==========================================

Par défaut, CakePHP ne charge **aucune** donnée associée lors de l'utilisation
de ``find()``. Vous devez faire un 'contain' ou charger en eager chaque
association que vous souhaitez voir figurer dans vos résultats.

.. start-contain

L'eager loading aide à éviter la plupart des problèmes potentiels de performance
qui entourent le lazy loading dans un ORM. Les requêtes générées par eager
loading peuvent davantage tirer parti des jointures, ce qui permet de créer des
requêtes plus efficaces. Dans CakePHP, vous utilisez la méthode 'contain' pour
indiquer quelles associations doivent être chargées en eager::

    // Dans un controller ou une méthode de table.

    // En option du find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // En méthode sur un objet query
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

Ceci va charger les auteurs et commentaires liés à chaque article du *result
set*. Vous pouvez charger des associations imbriquées en utilisant les tableaux
imbriqués pour définir les associations à charger::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

Au choix, vous pouvez aussi exprimer des associations imbriquées en utilisant la
notation par points::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

Vous pouvez charger les associations en eager aussi profondément que vous le
souhaitez::

    $query = $produits->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

Vous pouvez sélectionner des champs de toutes les associations en utilisant
plusieurs appels à ``contain()``::

    $query = $this->find()->select([
        'Realestates.id',
        'Realestates.title',
        'Realestates.description'
    ])
    ->contain([
        'RealestatesAttributes' => [
            'Attributes' => [
                'fields' => [
                    // Les champs dépendant d'un alias doivent inclure le préfixe
                    // du modèle dans contain() pour être mappés correctement.
                    'Attributes__name' => 'attr_name'
                ]
            ]
        ]
    ])
    ->contain([
        'RealestatesAttributes' => [
            'fields' => [
                'RealestatesAttributes.realestate_id',
                'RealestatesAttributes.value'
            ]
        ]
    ])
    ->where($condition);

Si vous avez besoin de réinitialiser les *contain* sur une requête, vous pouvez
définir le second argument à ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

.. note::

    Les noms d'association dans les appels à ``contain()`` doivent respecter la
    casse (majuscules/minuscules) avec lequelle votre association a été définie,
    et non pas selon le nom de la propriété utilisée pour accéder aux données
    associées depuis l'entity. Par exemple, si vous avez déclaré une association
    par ``belongsTo('Users')``, alors vous devez utiliser ``contain('Users')``
    et pas ``contain('users')`` ni ``contain('user')``.

Passer des Conditions à Contain
-------------------------------

Avec l'utilisation de ``contain()``, vous pouvez restreindre les données
retournées par les associations et les filtrer par conditions. Pour spécifier
des conditions, passez une fonction anonyme qui reçoit en premier argument la
query, de type ``\Cake\ORM\Query``::

    // Dans un controller ou une méthode de table.
    $query = $articles->find()->contain('Comments', function (Query $q) {
        return $q
            ->select(['contenu', 'author_id'])
            ->where(['Comments.approved' => true]);
    });

Cela fonctionne aussi pour la pagination au niveau du Controller::

    $this->paginate['contain'] = [
        'Comments' => function (Query $query) {
            return $query->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
        }
    ];

.. warning::

    Si vous constatez qu'il manque des entités associées, vérifiez que les
    champs de clés étrangères sont bien sélectionnés dans la requête. Sans les
    clés étrangères, l'ORM ne peut pas retrouver les lignes correspondantes.

Il est aussi possible de restreindre les associations imbriquées en utilisant la
notation par point::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function (Query $q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

Dans cet exemple, vous obtiendrez les auteurs même s'ils n'ont pas
de profil publié. Pour ne récupérer que les auteurs avec un profil publié,
utilisez :ref:`matching() <filtering-by-associated-data>`.

Si vous avez des finders personnalisés dans votre table associée,
vous pouvez les utiliser à l'intérieur de ``contain()``::

    // Récupère tous les articles, mais récupère seulement les commentaires qui
    // sont approuvés et populaires.
    $query = $articles->find()->contain('Comments', function ($q) {
        return $q->find('approved')->find('popular');
    });

.. note::

    Pour les associations ``BelongsTo`` et ``HasOne``, seules les clauses
    ``where`` et ``select`` sont utilisées lors du chargement par ``contain()``.
    Avec ``HasMany`` et ``BelongsToMany``, toutes les clauses sont valides,
    telles que ``order()``.

Vous pouvez contrôler plus que les simples clauses utilisées par ``contain()``.
Si vous passez un tableau avec l'association, vous pouvez surcharger
``foreignKey``, ``joinType`` et ``strategy``. Reportez-vous à
:doc:`/orm/associations` pour plus de détails sur la valeur par défaut et les
options de chaque type d'association.

Vous pouvez passer ``false`` comme nouvelle valeur de ``foreignKey`` pour
désactiver complètement les contraintes liées aux clés étrangères.
Utilisez l'option ``queryBuilder`` pour personnaliser la requête quand vous
passez un tableau::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function (Query $q) {
                return $q->where(/* ... */); // Conditions complètes pour le filtrage
            }
        ]
    ]);

Si vous avez limité les champs que vous chargez avec ``select()`` mais que
vous souhaitez aussi charger les champs des associations avec contain,
vous pouvez passer l'objet association à ``select()``::

    // Sélectionne id & title de articles, mais aussi tous les champs de Users.
    $query = $articles->find()
        ->select(['id', 'title'])
        ->select($articles->Users)
        ->contain(['Users']);

Autre possibilité, si vous avez des associations multiples, vous pouvez utiliser
``enableAutoFields()``::

    // Sélectionne id & title de articles, mais tous les champs de
    // Users, Comments et Tags.
    $query->select(['id', 'title'])
        ->contain(['Comments', 'Tags'])
        ->enableAutoFields(true)
        ->contain(['Users' => function(Query $q) {
            return $q->autoFields(true);
        }]);

Trier les Associations Contain
------------------------------

Quand vous chargez des associations HasMany et BelongsToMany, vous pouvez
utiliser l'option ``sort`` pour trier les données dans ces associations::

    $query->contain([
        'Comments' => [
            'sort' => ['Comments.created' => 'DESC']
        ]
    ]);

.. end-contain

.. _filtering-by-associated-data:

Filtrer par les Données Associées Via Matching et Joins
=======================================================

.. start-filtering

Un cas de requête couramment utilisé avec les associations consiste à trouver
les enregistrements qui correspondent à certaines données associées. Par exemple
si vous avez une association 'Articles belongsToMany Tags', vous voudrez
probablement trouver les Articles qui portent le tag *CakePHP*. C'est
extrêmement simple à faire avec l'ORM de CakePHP::

    // Dans un controller ou une méthode de table.

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

Vous pouvez aussi appliquer cette stratégie aux associations HasMany. Par
exemple si 'Authors HasMany Articles', vous pouvez trouver tous les auteurs
ayant publié un article récemment en écrivant ceci::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

La syntaxe de ``contain()``, qui doit déjà vous être familière, permet aussi de
filtrer des associations imbriquées::

    // Dans un controller ou une méthode de table.
    $query = $produits->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japon']);
        }
    );

    // Récupère les articles qui ont été commentés par 'markstory',
    // en passant une variable.
    // Utiliser la notation par points plutôt que des appels imbriqués à matching()
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    Dans la mesure où cette fonction va créer un ``INNER JOIN``, il serait
    judicieux d'utiliser ``distinct`` dans la requête. Sinon, vous risquez
    d'obtenir des doublons si les conditions posées ne l'excluent pas par
    principe. Dans notre exemple, cela peut être le cas si un utilisateur
    commente plusieurs fois le même article.

Les données des associations qui correspondent aux conditions (données
*matchées*) seront disponibles
dans l'attribut ``_matchingData`` des entities. Si vous utilisez à la fois
``match`` et ``contain`` sur la même association, vous pouvez vous attendre à
avoir à la fois la propriété ``_matchingData`` et la propriété standard
d'association dans vos résultats.

Utiliser innerJoinWith
----------------------

Utiliser la fonction ``matching()``, comme nous l'avons vu précédemment, va
créer un ``INNER JOIN`` avec l'association spécifiée et va aussi charger les
champs dans un ensemble de résultats.

Il peut arriver que vous veuillez utiliser ``matching()`` mais que vous n'êtes
pas intéressé par le chargement des champs de l'association. Dans ce cas, vous
pouvez utiliser ``innerJoinWith()``::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

La méthode ``innerJoinWith()`` fonctionne de la même manière que ``matching()``,
ce qui signifie que vous pouvez utiliser la notation par points pour faire des
jointures pour les associations imbriquées profondément::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japon']);
        }
    );

Si vous voulez à la fois poser des conditions sur certains champs de
l'association et charger d'autres champs de cette même association, vous pouvez
parfaitement combiner ``innerJoinWith()`` et ``contain()``.
L'exemple ci-dessous filtre les Articles qui ont des Tags spécifiques et charge
ces Tags::

    $filter = ['Tags.name' => 'CakePHP'];
    $query = $articles->find()
        ->distinct($articles->getPrimaryKey())
        ->contain('Tags', function (Query $q) use ($filter) {
            return $q->where($filter);
        })
        ->innerJoinWith('Tags', function (Query $q) use ($filter) {
            return $q->where($filter);
        });

.. note::
    Si vous utilisez ``innerJoinWith()`` et que vous voulez sélectionner des
    champs de cette association avec ``select()``, vous devez utiliser un alias
    pour les noms des champs::

        $query
            ->select(['country_name' => 'Countries.name'])
            ->innerJoinWith('Countries');

    Sinon, vous verrez les données dans ``_matchingData``, comme cela a été
    décrit ci-dessous à propos de ``matching()``. C'est un angle mort de
    ``matching()``, qui ne sait pas que vous avez sélectionné des champs.

.. warning::
    Vous ne devez pas combiner ``innerJoinWith()`` and ``matching()`` pour la
    même association. Cela produirait de multiple requêtes ``INNER JOIN`` et ne
    réaliserait pas ce que vous en attendez.

Utiliser notMatching
--------------------

L'opposé de ``matching()`` est ``notMatching()``. Cette fonction va changer
la requête pour qu'elle filtre les résultats qui n'ont pas de relation avec
l'association spécifiée::

    // Dans un controller ou une méthode de table.

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => 'ennuyeux']);
        });

L'exemple ci-dessus va trouver tous les articles qui n'ont pas été taggés avec
le mot ``ennuyeux``. Vous pouvez aussi utiliser cette méthode avec les
associations HasMany. Vous pouvez, par exemple, trouver tous les auteurs qui
n'ont publié aucun article dans les 10 derniers jours::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

Il est aussi possible d'utiliser cette méthode pour filtrer les enregistrements
qui ne matchent pas des associations imbriquées. Par exemple, vous pouvez
trouver les articles qui n'ont pas été commentés par un utilisateur précis::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });

Puisque les articles n'ayant absolument aucun commentaire satisfont aussi cette
condition, vous aurez intérêt à combiner ``matching()`` et ``notMatching()``
dans cette requête. L'exemple suivant recherchera les articles ayant au moins un
commentaire, mais non commentés par un utilisateur précis::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    Comme ``notMatching()`` va créer un ``LEFT JOIN``, vous pouvez envisager
    d'appeler ``distinct`` sur la requête pour éviter d'obtenir des lignes
    dupliquées.

Gardez à l'esprit que le contraire de la fonction ``matching()``,
``notMatching()``, ne va pas ajouter de données à la propriété ``_matchingData``
dans les résultats.

Utiliser leftJoinWith
---------------------

Dans certaines situations, vous aurez à calculer un résultat à partir d'une
association, sans avoir à charger tous ses enregistrements. Par
exemple, si vous voulez charger le nombre total de commentaires d'un article, en
parallèle des données de l'article, vous pouvez utiliser la fonction
``leftJoinWith()``::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->group(['Articles.id'])
        ->enableAutoFields(true);

Le résultat de cette requête contiendra les données de l'article et la propriété
``total_comments`` pour chacun d'eux.

``leftJoinWith()`` peut aussi être utilisée avec des associations imbriquées.
C'est utile par exemple pour rechercher, pour chaque auteur, le nombre
d'articles taggés avec un certain mot::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'redoutable']);
        })
        ->group(['Authors.id'])
        ->enableAutoFields(true);

Cette fonction ne va charger aucune colonne des associations spécifiées dans les
résultats.

.. end-filtering

Changer les Stratégies de Récupération
======================================

Comme cela a été dit, vous pouvez personnaliser la stratégie (*strategy*)
utilisée par une association dans un ``contain()``.

Si vous observez les options des :doc:`associations </orm/associations>`
``BelongsTo`` et ``HasOne``, vous constaterez que la stratégie par défaut 'join'
et le type de jointure (``joinType``) 'INNER' peuvent être remplacés par
'select'::

    $query = $articles->find()->contain([
        'Comments' => [
            'strategy' => 'select',
        ]
    ]);

Cela peut être utile lorsque vous avez besoin de conditions qui ne font pas bon
ménage avec une jointure. Cela ouvre aussi la possibilité de requêter des tables
entre lesquelles vous n'avez pas l'autorisation de faire des jointures, par
exemple des tables se trouvant dans deux bases de données différentes.

Habituellement, vous définisser la stratégie d'une association quand vous la
définissez, dans la méthode ``Table::initialize()``, mais vous pouvez changer
manuellement la stratégie de façon permanente::

    $articles->Comments->setStrategy('select');

Récupération Avec la Stratégie de Sous-Requête
----------------------------------------------

Quand vos tables grandissent en taille, la récupération des associations
peut ralentir sensiblement, en particulier si vous faites de grandes requêtes en
une fois. Un bon moyen d'optimiser le chargement des associations ``hasMany`` et
``belongsToMany`` est d'utiliser la stratégie ``subquery``::

    $query = $articles->find()->contain([
        'Comments' => [
                'strategy' => 'subquery',
                'queryBuilder' => function ($q) {
                    return $q->where(['Comments.approved' => true]);
                }
        ]
    ]);

Le résultat va rester le même que pour la stratégie par défaut, mais
ceci peut grandement améliorer la requête et son temps de récupération dans
certaines bases de données, en particulier cela va permettre de récupérer des
grandes portions de données en même temps dans les bases de données qui
limitent le nombre de paramètres liés par requête, comme **Microsoft SQL
Server**.

Lazy loading des Associations
=============================

CakePHP propose le chargement de vos associations en eager. Cependant il y a des
cas où vous aurez besoin de charger les associations en lazy. Consultez les
sections :ref:`lazy-load-associations` et
:ref:`loading-additional-associations` pour plus d'informations.

Travailler sur les Résultats (Result Sets)
===========================================

Une fois qu'une requête est exécutée avec ``all()``, vous récupérez une
instance de :php:class:`Cake\\ORM\\ResultSet`. Cet objet propose des outils
puissants pour manipuler les données renvoyées par vos requêtes. Comme les
objets Query, un ResultSet est une
:doc:`Collection </core-libraries/collections>` et vous
pouvez donc appeler sur celui-ci n'importe quelle méthode propre aux
collections.

Les objets ResultSet vont charger les lignes paresseusement (*lazily*) à partir
de la requête préparée sous-jacente. Par défaut, les résultats seront mis en
mémoire tampon, vous permettant ainsi de parcourir les résultats plusieurs fois,
ou de mettre les résultats en cache et d'itérer dessus. Si vous travaillez sur
un ensemble de données trop large pour tenir en mémoire, vous pouvez désactiver
la mise en mémoire tampon depuis la requête pour travailler sur les résultats à
la volée::

    $query->disableBufferedResults();

Stopper la mise en mémoire tampon appelle quelques mises en garde:

#. Vous ne pourrez itérer les résultats qu'une seule fois.
#. Vous ne pourrez pas non plus itérer et mettre en cache les résultats.
#. La mise en mémoire tampon ne peut pas être désactivée pour les requêtes qui
   chargent en eager les associations hasMany ou belongsToMany, puisque ces
   types d'association nécessitent le chargement en eager de tous les résultats
   afin de générer les requêtes dépendantes.

.. warning::

    Traiter les résultats à la volée continuera d'allouer l'espace mémoire
    nécessaire pour la totalité des résultats lorsque vous utilisez PostgreSQL
    et SQL Server. Ceci est dû à des limitations dans PDO.

Les ResultSets vous permettent de mettre en cache, de sérialiser ou d'encoder en
JSON les résultats::

    // Dans un controller ou une méthode de table.
    $results = $query->all();

    // Serialisé
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

La sérialisation des ResultSets et l'encodage en JSON fonctionnent comme vous
pouvez vous y attendre. Les données sérialisées peuvent être désérialisées en un
ResultSet fonctionnel. La conversion en JSON respecte la configuration des
champs cachés et des champs virtuels dans tous les objets entity inclus dans le
ResultSet.

Les ResultSets sont des objets 'Collection' et supportent les mêmes méthodes que
les :doc:`objets collection </core-libraries/collections>`. Par exemple, vous
pouvez extraire une liste des tags uniques sur une collection d'articles en
exécutant::

    // Dans un controller ou une méthode de table.
    $query = $articles->find()->contain(['Tags']);

    $reducer = function ($output, $value) {
        if (!in_array($value, $output)) {
            $output[] = $value;
        }

        return $output;
    };

    $uniqueTags = $query->all()
        ->extract('tags.name')
        ->reduce($reducer, []);

Ci-dessous quelques autres exemples de méthodes de collection utilisées avec des
ResultSets::

    // Filtre les lignes sur une propriété calculée
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // Crée un tableau associatif depuis les propriétés du résultat
    $results = $articles->find()->contain(['Authors'])->all();

    $authorsList = $results->combine('id', 'author.name');

Le chapitre :doc:`/core-libraries/collections` comporte plus de détails sur
ce qu'on peut faire avec les fonctionnalités des collections sur des ResultSets.
La section :ref:`format-results` montre comment ajouter des champs calculés, ou
remplacer le ResutSet.

Récupérer le Premier & Dernier enregistrement à partir d'un ResultSet
---------------------------------------------------------------------

Vous pouvez utiliser les méthodes ``first()`` et ``last()`` pour récupérer
respectivement le premier et le dernier enregistrement d'un ResultSet::

    $result = $articles->find('all')->all();

    // Récupère le premier et/ou le dernier résultat.
    $row = $result->first();
    $row = $result->last();

Récupérer une Ligne Spécifique d'un ResultSet
---------------------------------------------

Vous pouvez utiliser ``skip()`` et ``first()`` pour récupérer un enregistrement
arbitraire à partir d'un ensemble de résultats::

    $result = $articles->find('all')->all();

    // Récupère le 5ème enregistrement
    $row = $result->skip(4)->first();

Vérifier si une Requête ou un ResultSet est vide
------------------------------------------------

Vous pouvez utiliser la méthode ``isEmpty()`` sur un objet Query ou ResultSet
pour savoir s'il contient au moins une ligne. Appeler ``isEmpty()`` sur un
objet Query va exécuter la requête::

    // Vérifie une requête.
    $query->isEmpty();

    // Vérifie les résultats.
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

Charger des Associations Supplémentaires
----------------------------------------

Une fois que vous avez créé un ResultSet, vous pourriez vouloir charger en eager
des associations supplémentaires. C'est le moment idéal pour charger
paresseusement des données en eager. Vous pouvez charger des associations
supplémentaires en utilisant ``loadInto()``::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

Vous pouvez charger en eager des données additionnelles dans une entity unique
ou une collection d'entities.

.. _map-reduce:

Modifier les Résultats avec Map/Reduce
======================================

La plupart du temps, les opérations ``find`` nécessitent un traitement
après-coup des données de la base de données. Les accesseurs (*getters*) des
entities peuvent s'occuper de générer la plupart des propriétés virtuelles ou
des formats de données particuliers ; néanmoins vous serez parfois amené à
changer la structure des données de façon plus radicale.

Pour ces situations, l'objet ``Query`` propose la méthode ``mapReduce()``, qui
est une façon de traiter les résultats après qu'ils ont été récupérés dans la
base de données.

Un exemple classique de changement de structure de données est le regroupement
des résultats selon certaines conditions. Nous pouvons utiliser la fonction
``mapReduce()`` pour cette tâche. Nous avons besoin de deux
fonctions appelées ``$mapper`` et ``$reducer``.
La fonction ``$mapper`` reçoit en premier argument un résultat de la base de
données, en second argument la clé d'itération et en troisième elle reçoit une
instance de la routine ``MapReduce`` en train d'être éxecutée::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

Dans cet exemple, ``$mapper`` calcule le statut d'un article, soit publié soit
non publié. Ensuite il appelle ``emitIntermediate()`` sur l'instance
``MapReduce``. Cette méthode insère l'article dans la liste des articles soit
sous l'étiquette 'publié', soit sous l'étiquette 'non publié'.

La prochaine étape dans le processus de map-reduce est la consolidation des
résultats finaux. La fonction ``$reducer`` sera appelée sur chaque statut créé
dans le mapper, de manière à ce que vous puissiez faire des traitements
supplémentaires. Cette fonction va recevoir la liste des articles d'un certain
"tas" en premier paramètre, le nom du tas à traiter en second paramètre, et à
nouveau, comme pour la fonction ``mapper()``, l'instance de la routine
``MapReduce`` en troisième paramètre. Dans notre exemple, nous n'avons pas
besoin de retraiter les listes d'articles une fois qu'elles sont constituées,
donc nous nous contentons d'émettre (*emit*) les résultats finaux::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

Pour finir, nous pouvons passer ces deux fonctions pour exécuter le
regroupement::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer)
        ->all();

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("Il y a %d articles avec le statut %s", count($articles), $status);
    }

Ce qui va afficher la sortie suivante::

    Il y a 4 articles avec le statut published
    Il y a 5 articles avec le statut unpublished

Bien sûr, ceci est un exemple simple qui pourrait être résolu d'une autre
façon sans l'aide d'un traitement map-reduce. Maintenant, regardons un autre
exemple dans lequel la fonction reducer sera nécessaire pour faire quelque
chose de plus que d'émettre les résultats.

Pour calculer les mots mentionnés le plus souvent dans les articles contenant
des informations sur CakePHP, comme d'habitude nous avons besoin d'une fonction
mapper::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos($article['body'], 'cakephp') === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

Elle vérifie d'abord si le mot "cakephp" est dans le corps de l'article, et
ensuite coupe le corps en mots individuels. Chaque mot va créer son propre
``tas``, où chaque id d'article sera stocké. Maintenant réduisons nos
résultats pour extraire seulement le décompte du nombre de mots::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

Pour finir, nous mettons tout ensemble::

    $nbMots = $articles->find()
        ->where(['published' => true])
        ->andWhere(['publication_date >=' => new DateTime('2014-01-01')])
        ->disableHydration()
        ->mapReduce($mapper, $reducer)
        ->all();

Ceci pourrait retourner un tableau très grand si nous ne purgeons pas les petits
mots, mais cela pourrait ressembler à ceci::

    [
        'cakephp' => 100,
        'génial' => 39,
        'impressionnant' => 57,
        'remarquable' => 10,
        'hallucinant' => 83
    ]

Un dernier exemple et vous serez un expert de map-reduce. Imaginez que vous
ayez une table ``amis`` et que vous souhaitiez trouver les "faux amis"
dans notre base de données ou, autrement dit, des gens qui ne se suivent pas
mutuellement. Commençons avec notre fonction ``mapper()``::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_user_id']);
        $mr->emitIntermediate(-$rel['source_user_id'], $rel['target_user_id']);
    };

Le tableau intermédiaire ressemblera à ceci::

    [
        1 => [2, 3, 4, 5, -3, -5],
        2 => [-1],
        3 => [-1, 1, 6],
        4 => [-1],
        5 => [-1, 1],
        6 => [-3],
        ...
    ]

La clé de premier niveau étant un utilisateur, les nombres positifs indiquent
que l'utilisateur suit d'autres utilisateurs et les nombres négatifs qu'il est
suivi par d'autres utilisateurs.

Maintenant, il est temps de la réduire. Pour chaque appel au reducer, il va
recevoir une liste de followers par utilisateur::

    $reducer = function ($friends, $user, $mr) {
        $fakeFriends = [];

        foreach ($friends as $friend) {
            if ($friend > 0 && !in_array(-$friend, $friends)) {
                $fakeFriends[] = $friend;
            }
        }

        if ($fakeFriends) {
            $mr->emit($fakeFriends, $user);
        }
    };

Et nous fournissons nos fonctions à la requête::

    $fakeFriends = $friends->find()
        ->disableHydration()
        ->mapReduce($mapper, $reducer)
        ->all();

Ceci retournerait un tableau ressemblant à::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

Ce tableau final signifie, par exemple, que l'utilisateur avec l'id
``1`` suit les utilisateurs ``2`` et ``4``, mais ceux-ci ne suivent pas
``1`` de leur côté.

Empiler Plusieurs Opérations
----------------------------

L'utilisation de `mapReduce` dans une requête ne va pas l'exécuter
immédiatement. L'opération va être enregistrée pour être lancée dès que
l'on tentera de récupérer le premier résultat.
Ceci vous permet de continuer à chainer les méthodes et les filtres
sur la requête même après avoir ajouté une routine map-reduce::

    $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // Plus loin dans votre app:
    $query->where(['created >=' => new DateTime('1 day ago')]);

C'est particulièrement utile pour construire des méthodes finder personnalisées
comme décrit dans la section :ref:`custom-find-methods`::

    public function findPublished(Query $query, array $options)
    {
        return $query->where(['published' => true]);
    }

    public function findRecent(Query $query, array $options)
    {
        return $query->where(['created >=' => new DateTime('1 day ago')]);
    }

    public function findCommonWords(Query $query, array $options)
    {
        // Comme dans l'exemple précédent sur la fréquence des mots
        $mapper = ...;
        $reducer = ...;

        return $query->mapReduce($mapper, $reducer);
    }

    $motsCourant = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

De plus, il est aussi possible d'empiler plusieurs opérations ``mapReduce``
pour une même requête. Par exemple, si nous souhaitons avoir les mots les
plus couramment utilisés pour les articles, mais ensuite les filtrer pour
retourner uniquement les mots qui étaient mentionnés plus de 20 fois tout au
long des articles::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper)->all();

Retirer Toutes les Opérations Map-reduce Empilées
-------------------------------------------------

Dans certaines circonstances vous pourriez vouloir modifier un objet ``Query``
pour que les opérations ``mapReduce`` prévues ne soient pas exécutées du tout.
Vous pouvez le faire en appelant la méthode avec les deux paramètres à null et
le troisième paramètre (overwrite) à ``true``::

    $query->mapReduce(null, null, true);

