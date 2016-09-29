Récupérer les Données et les Ensembles de Résultats
###################################################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Alors que les objets table fournissent une abstraction autour d'un 'dépôt' ou
d'une collection d'objets, quand vous faîtes une requête pour des
enregistrements individuels, vous récupérez des objets 'entity'. Cette section
parle des différentes façons pour trouver et charger les entities, mais vous
pouvez lire la section :doc:`/orm/entities` pour plus d'informations sur les
entities.

Débugger les Queries et les ResultSets
======================================

Etant donné que l'ORM retourne maintenant des Collections et des Entities,
débugger ces objets peut être plus compliqué qu'avec les versions précédentes
de CakePHP. Il y a maintenant plusieurs façons d'inspecter les données
retournées par l'ORM.

- ``debug($query)`` Montre le SQL et les paramètres liés, ne montre pas les
  résultats.
- ``debug($query->all())`` Montre les propriétés de ResultSet (pas les
  résultats).
- ``debug($query->toArray())`` Une façon facile de montrer chacun des résultats.
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` Résultats plus lisibles.
- ``debug($query->first())`` Montre les propriétés de la première entity que
  votre requête retournera.
- ``debug((string)$query->first())`` Montre les propriétés de la première entity
  que votre requête retournera en JSON.

Récupérer une Entity Unique avec une Clé Primaire
=================================================

.. php:method:: get($id, $options = [])

C'est souvent pratique de charger une entity unique à partir de la base de
données quand vous modifiez ou visualisez les entities et leurs données liées.
Vous pouvez faire ceci en utilisant ``get()``::

    // Dans un controller ou dans une méthode table.

    // Récupère un article unique
    $article = $articles->get($id);

    // Récupère un article unique, et les commentaires liés
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

Si l'opération get ne trouve aucun résultat, une
``Cake\Datasource\Exception\RecordNotFoundException`` sera levée. Vous pouvez
soit attraper cette exception vous-même, ou permettre à CakePHP de la convertir
en une erreur 404.

Comme ``find()``, ``get()`` a un cache intégré. Vous pouvez utiliser l'option
``cache`` quand vous appelez ``get()`` pour appliquer la mise en cache::

    // Dans un controller ou dans une méthode table.

    // Utilise toute config de cache ou une instance de CacheEngine & une clé générée
    $article = $articles->get($id, [
        'cache' => 'custom',
    ]);

    // Utilise toute config de cache ou une instance de CacheEngine & une clé spécifique
    $article = $articles->get($id, [
        'cache' => 'custom', 'key' => 'mykey'
    ]);

    // Désactive explicitement la mise en cache
    $article = $articles->get($id, [
        'cache' => false
    ]);

En option, vous pouvez faire un ``get()`` d'une entity en utilisant
:ref:`custom-find-methods`. Par exemple vous souhaitez récupérer toutes les
traductions pour une entity. Vous pouvez le faire en utilisant l'option
``finder``::

    $article = $articles->get($id, [
        'finder' => 'translations',
    ]);

Utiliser les Finders pour Charger les Données
=============================================

.. php:method:: find($type, $options = [])

Avant de travailler avec les entities, vous devrez les charger. La façon la
plus facile de le faire est d'utiliser la méthode ``find``. La méthode find
est un moyen facile et extensible pour trouver les données qui vous
intéressent::

    // Dans un controller ou dans une méthode table.

    // Trouver tous les articles
    $query = $articles->find('all');

La valeur retournée de toute méthode ``find`` est toujours un objet
:php:class:`Cake\\ORM\\Query`. La classe Query vous permet de redéfinir
une requête plus tard après l'avoir créée. Les objets Query sont évalués
lazily, et ne s'exécutent qu'à partir du moment où vous commencez à récupérer
des lignes, les convertissez en tableau, ou quand la méthode
``all()`` est appelée::

    // Dans un controller ou dans une méthode table.

    // Trouver tous les articles.
    // A ce niveau, la requête n'est pas lancée.
    $query = $articles->find('all');

    // L'itération va exécuter la requête.
    foreach ($query as $row) {
    }

    // Appeler all() va exécuter la requête
    // et retourne l'ensemble de résultats.
    $results = $query->all();

    // Once we have a result set we can get all the rows
    $data = $results->toArray();

    // Convertir la requête en tableau va l'exécuter.
    $results = $query->toArray();

.. note::

    Une fois que vous avez commencé une requête, vous pouvez utiliser
    l'interface :doc:`/orm/query-builder` pour construire des requêtes
    plus complexes, d'ajouter des conditions supplémentaires, des limites,
    ou d'inclure des associations en utilisant l'interface courante.

::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

Vous pouvez aussi fournir plusieurs options couramment utilisées avec
``find()``. Ceci peut aider pour le test puisqu'il y a peu de méthodes à
mocker::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

La liste d'options supportées par find() sont:

- ``conditions`` fournit des conditions pour la clause WHERE de la requête.
- ``limit`` Définit le nombre de lignes que vous voulez.
- ``offset`` Définit l'offset de la page que vous souhaitez. Vous pouvez aussi
  utiliser ``page`` pour faciliter le calcul.
- ``contain`` définit les associations à charger en eager.
- ``fields`` limite les champs chargés dans l'entity. Charger seulement quelques
  champs peut faire que les entities se comportent de manière incorrecte.
- ``group`` ajoute une clause GROUP BY à votre requête. C'est utile quand vous
  utilisez les fonctions d'agrégation.
- ``having`` ajoute une clause HAVING à votre requête.
- ``join`` définit les jointures personnalisées supplémentaires.
- ``order`` ordonne l'ensemble des résultats.

Toute option qui n'est pas dans la liste sera passée aux écouteurs de beforeFind
où ils peuvent être utilisés pour modifier l'objet requête. Vous pouvez utiliser
la méthode ``getOptions`` sur un objet query pour récupérer les options
utilisées. Alors que vous pouvez très facilement passer des objets requête à
vos controllers, nous recommandons que vous fassiez plutôt des packages de vos
requêtes en tant que :ref:`custom-find-methods`.
Utiliser des méthodes finder personnalisées va vous laisser réutiliser vos
requêtes et faciliter les tests.

Par défaut, les requêtes et les ensembles de résultat seront retournés
en objets :doc:`/orm/entities`. Vous pouvez récupérer des tableaux basiques en
désactivant l'hydratation::

    $query->hydrate(false);

    // $data est le ResultSet qui contient le tableau de données.
    $data = $query->all();

.. _table-find-first:

Récupérer les Premiers Résultats
================================

La méthode ``first()`` vous permet de récupérer seulement la première ligne
à partir d'une query. Si la query n'a pas été exécutée, une clause ``LIMIT 1``
sera appliquée::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('all', [
        'order' => ['Article.created' => 'DESC']
    ]);
    $row = $query->first();

Cette approche remplace le ``find('first')`` des versions précédentes de
CakePHP. Vous pouvez aussi utiliser la méthode ``get()`` si vous chargez les
entities avec leur clé primaire.

.. note::

    La méthode ``first()`` va retourner ``null`` si aucun résultat n'est trouvé.

Récupérer un Nombre de Résultats
================================

Une fois que vous avez créé un objet query, vous pouvez utiliser la méthode
``count()`` pour récupérer un nombre de résultats de cette query::

    // Dans un controller ou une méthode de table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

Consultez :ref:`query-count` pour l'utilisation supplémentaire de la méthode
``count()``.

.. _table-find-list:

Trouver les Paires de Clé/Valeur
================================

C'est souvent pratique pour générer un tableau associatif de données à partir
des données de votre application. Par exemple, c'est très utile quand vous
créez des elements `<select>`. CakePHP fournit une méthode simple à utiliser
pour générer des 'lists' de données::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Les données ressemblent maintenant à ceci
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

Avec aucune option supplémentaire, les clés de ``$data`` seront la clé primaire
de votre table, alors que les valeurs seront le 'displayField' (champAAfficher)
de la table. Vous pouvez utiliser la méthode ``displayField()`` sur un objet
table pour configurer le champ à afficher sur une table::

    class Articles extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

Quand vous appelez ``list``, vous pouvez configurer les champs utilisés pour
la clé et la valeur avec respectivement les options ``keyField`` et
``valueField``::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // Les données ressemblent maintenant à
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Les résultats peuvent être groupés en des ensembles imbriqués. C'est utile
quand vous voulez des ensembles bucketed ou que vous voulez construire des
elements ``<optgroup>`` avec FormHelper::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // Les données ressemblent maintenant à
    $data = [
        1 => [
            'first-post' => 'First post',
            'second-article-i-wrote' => 'Second article I wrote',
        ],
        2 => [
            // Plus de données.
        ]
    ];

Vous pouvez aussi créer une liste de données à partir des associations qui
peuvent être atteintes avec les jointures::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);

Enfin il est possible d'utiliser les closures pour accéder aux méthodes de
mutation des entities dans vos finds list. Cet exemple vous montre l'utilisation
de la méthode de mutation ``_getFullName()`` de l'entity Author::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => function ($e) {
            return $e->author->get('full_name');
        }
    ]);

Vous pouvez aussi récupérer le nom complet directement dans la liste en
utilisant. ::

    $this->displayField('full_name');
    $query = $authors->find('list');

Trouver des Données Threaded
============================

Le finder ``find('threaded')`` retourne les entities imbriquées qui sont
threaded ensemble à travers un champ clé. Par défaut, ce champ est
``parent_id``. Ce finder vous permet d'accéder aux données stockées dans une
table de style 'liste adjacente'. Toutes les entities qui matchent un
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
les champs sur lesquels le threading va être.

.. tip::
    Si vous devez gérer des données en arbre plus compliquées, pensez à
    utiliser :doc:`/orm/behaviors/tree` à la place.

.. _custom-find-methods:

Méthodes Finder Personnalisées
==============================

Les exemples ci-dessus montrent la façon d'utiliser les finders intégrés
``all`` et ``list``. Cependant, il est possible et recommandé d'intégrer
vos propres méthodes finder. Les méthodes finder sont idéales pour faire
des packages de requêtes utilisées couramment, vous permettant de faire
abstraction de détails de a requête en une méthode facile à utiliser. Les
méthodes finder sont définies en créant les méthodes en suivant la convention
``findFoo`` où ``Foo`` est le nom du finder que vous souhaitez créer. Par
exemple si nous voulons ajouter un finder à notre table articles pour trouver
des articles publiés, nous ferions ce qui suit::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options)
        {
            $query->where([
                'Articles.published' => true,
                'Articles.moderated' => true
            ]);
            return $query;
        }

    }

    // Dans un controller ou dans une méthode table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published');

Les méthodes finder peuvent modifier la requête comme ceci, ou utiliser
``$options`` pour personnaliser l'opération finder avec la logique
d'application concernée. Vous pouvez aussi 'stack' les finders, vous
permettant de faire des requêtes complexes sans efforts. En supposant que
vous avez à la fois les finders 'published' et 'recent', vous pouvez faire
ce qui suit::

    // Dans un controller ou dans une méthode de table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

Alors que les exemples pour l'instant ont montré les méthodes finder sur les
classes table, les méthodes finder peuvent aussi être définies sur les
:doc:`/orm/behaviors`.

Si vous devez modifier les résultats après qu'ils ont été récupérés, vous
pouvez utiliser une fonction :ref:`map-reduce` pour modifier les résultats.
Les fonctionnalités de map reduce remplacent le callback 'afterFind' qu'on
avait dans les versions précédentes de CakePHP.

.. _dynamic-finders:

Finders Dynamiques
==================

L'ORM de CakePHP fournit des méthodes de finder construites dynamiquement qui
vous permettent d'exprimer des requêtes simples sans aucun code supplémentaire.
Par exemple si vous vouliez trouver un utilisateur selon son username, vous
pourriez faire::

    // Dans un controller
    // Les deux appels suivants sont équivalents.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // Dans une méthode de table
    $users = TableRegistry::get('Users');
    // Les deux appels suivants sont équivalents.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

Lors de l'utilisation de finders dynamiques, vous pouvez faire des contraintes
sur plusieurs champs::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

Vous pouvez aussi créer des conditions ``OR``::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

Alors que vous pouvez utiliser des conditions OR ou AND, vous ne pouvez pas
combiner les deux dans un finder unique dynamique. Les autres options de requête
comme ``contain`` ne sont aussi pas supportées avec les finders dynamiques. Vous
devrez utiliser :ref:`custom-find-methods` pour encapsuler plus de requêtes
complexes. Dernier point, vous pouvez aussi combiner les finders dynamiques
avec des finders personnalisés::

    $query = $users->findTrollsByUsername('bro');

Ce qui est au-dessus se traduirait dans ce qui suit::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

Une fois que vous avez un objet query à partir d'un finder dynamique, vous
devrez appeler ``first()`` si vous souhaitez le premier résultat.

.. note::

    Alors que les finders dynamiques facilitent la gestion des requêtes, ils
    entraînent des coûts de performance supplémentaires.

Récupérer les Données Associées
===============================

Quand vous voulez récupérer des données associées, ou filtrer selon les données
associées, il y a deux façons:

- utiliser les fonctions query de l'ORM de CakePHP comme ``contain()`` et
  ``matching()``
- utiliser les fonctions de jointures comme ``innerJoin()``, ``leftJoin()``, et
  ``rightJoin()``

Vous pouvez utiliser ``contain()`` quand vous voulez charger le model primaire
et ses données associées. Alors que ``contain()`` va vous laisser appliquer
des conditions supplémentaires aux associations chargées, vous ne pouvez pas
donner des contraintes au model primaire selon les associations. Pour plus de
détails sur ``contain()``, consultez :ref:`eager-loading-associations`.

Vous pouvez utiliser ``matching()`` quand vous souhaitez donner des contraintes
au model primaire selon les associations. Par exemple, vous voulez charger tous
les articles qui ont un tag spécifique. Pour plus de détails sur ``matching()``,
consultez :ref:`filtering-by-associated-data`.

Si vous préférez utiliser les fonctions de jointure, vous pouvez consulter
:ref:`adding-joins` pour plus d'informations.

.. _eager-loading-associations:

Eager Loading des Associations
==============================

Par défaut, CakePHP ne charge **aucune** donnée associée lors de l'utilisation
de ``find()``. Vous devez faire un 'contain' ou charger en eager chaque
association que vous souhaitez charger dans vos résultats.

.. start-contain

Chaque Eager loading évite plusieurs problèmes potentiels de chargement
lors du lazy loading dans un ORM. Les requêtes générées par le eager loading
peuvent augmenter l'impact des jointures, permettant de faire des
requêtes plus efficaces. Dans CakePHP vous définissez des associations chargées
en eager en utilisant la méthode 'contain'::

    // Dans un controller ou une méthode de table.

    // En option du find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // En méthode sut un objet query
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

Ce qui est au-dessus va charger les auteurs et commentaires liés pour chaque
article de l'ensemble de résultats. Vous pouvez charger les associations
imbriquées en utilisant les tableaux imbriqués pour définir les
associations à charger::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

D'une autre façon, vous pouvez exprimer des associations imbriquées en utilisant
la notation par point::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

Vous pouvez charger les associations en eager aussi profondément que vous le
souhaitez::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

Si vous avez besoin de remettre les contain sur une requête, vous pouvez
définir le second argument à ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

Passer des Conditions à Contain
-------------------------------

Avec l'utilisation de ``contain()``, vous pouvez restreindre les données
retournées par les associations et les filtrer par conditions::

    // Dans un controller ou une méthode de table.

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

Cela fonctionne aussi pour la pagination au niveau du Controller::

    $this->paginate['contain'] = [
        'Comments' => function (\Cake\ORM\Query $query) {
            return $query->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
        }
    ];

.. note::

    Quand vous limitez les champs qui sont récupérés d'une association, vous
    **devez** vous assurer que les colonnes de clé étrangère soient
    sélectionnées. Ne pas sélectionner les champs de clé étrangère va entraîner
    la non présence des données associées dans le résultat final.

Il est aussi possible de restreindre les associations imbriquées profondément
en utilisant la notation par point::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

Si vous avez défini certaines méthodes de finder personnalisées dans votre table
associée, vous pouvez les utiliser à l'intérieur de ``contain()``::

    // Récupère tous les articles, mais récupère seulement les commentaires qui
    // sont approuvés et populaires.
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    Pour les associations ``BelongsTo`` et ``HasOne``, seules les clauses
    ``where`` et ``select`` sont utilisées lors du chargement des
    enregistrements associés. Pour le reste des types d'association, vous pouvez
    utiliser chaque clause que l'objet query fournit.

Si vous devez prendre le contrôle total d'une requête qui est générée, vous
pouvez appeler ``contain()`` pour ne pas ajouter les contraintes ``foreignKey``
à la requête générée. Dans ce cas, vous devez utiliser un tableau en passant
``foreignKey`` et ``queryBuilder``::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...); // Full conditions for filtering
            }
        ]
    ]);

Si vous avez limité les champs que vous chargez avec ``select()`` mais que
vous souhaitez aussi charger les champs enlevés des associations avec contain,
vous pouvez passer l'objet association à ``select()``::

    // Sélectionne id & title de articles, mais tous les champs enlevés pour Users.
    $query = $articles->find()
        ->select(['id', 'title'])
        ->select($articlesTable->Users)
        ->contain(['Users']);

D'une autre façon, si vous pouvez faire des associations multiples, vous
pouvez utiliser ``autoFields()``::

    // Sélectionne id & title de articles, mais tous les champs enlevés de
    // Users, Comments et Tags.
    $query->select(['id', 'title'])
        ->contain(['Comments', 'Tags'])
        ->autoFields(true)
        ->contain(['Users' => function($q) {
            return $q->autoFields(true);
        }]);

.. versionadded:: 3.1
    La sélection des colonnes via un objet association a été ajouté dans 3.1

Ordonner les Associations Contain
---------------------------------

Quand vous chargez des associations HasMany et BelongsToMany, vous pouvez
utiliser l'option ``sort`` pour ordonner les données dans ces associations::

    $query->contain([
        'Comments' => [
            'sort' => ['Comment.created' => 'DESC']
        ]
    ]);

.. end-contain

.. _filtering-by-associated-data:

Filtrer par les Données Associées
---------------------------------

.. start-filtering

Un cas de requête couramment fait avec les associations est de trouver les
enregistrements qui 'matchent' les données associées spécifiques. Par exemple
si vous avez 'Articles belongsToMany Tags', vous aurez probablement envie de
trouver les Articles qui ont le tag CakePHP. C'est extrêmement simple
à faire avec l'ORM de CakePHP::

    // Dans un controller ou table de méthode.

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

Vous pouvez aussi appliquer cette stratégie aux associations HasMany. Par
exemple si 'Authors HasMany Articles', vous pouvez trouver tous les auteurs
avec les articles récemment publiés en utilisant ce qui suit::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

Filtrer des associations imbriquées est étonnamment facile, et la syntaxe doit
déjà vous être familière::

    // Dans un controller ou une table de méthode.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // Récupère les articles uniques qui étaient commentés par 'markstory'
    // en utilisant la variable passée
    // Les chemins avec points doivent être utilisés plutôt que les appels
    // imbriqués de matching()
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    Comme cette fonction va créer un ``INNER JOIN``, vous pouvez appeler
    ``distinct`` sur le find de la requête puisque vous aurez des lignes
    dupliquées si les conditions ne les excluent pas déjà. Ceci peut être le
    cas, par exemple, quand les mêmes utilisateurs commentent plus d'une fois
    un article unique.

Les données des associations qui sont 'matchés' (appairés) seront disponibles
dans l'attribut ``_matchingData`` des entities. Si vous utilisez à la fois
match et contain sur la même association, vous pouvez vous attendre à recevoir
à la fois la propriété ``_matchingData`` et la propriété standard d'association
dans vos résultats.

Utiliser innerJoinWith
~~~~~~~~~~~~~~~~~~~~~~

Utiliser la fonction ``matching()``, comme nous l'avons vu précédemment, va
créer un ``INNER JOIN`` avec l'association spécifiée et va aussi charger les
champs dans un ensemble de résultats.

Il peut arriver que vous vouliez utiliser ``matching()`` mais que vous n'êtes
pas intéressé par le chargement des champs dans un ensemble de résultats. Dans
ce cas, vous pouvez utiliser ``innerJoinWith()``::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

La méthode ``innerJoinWith()`` fonctionne de la même manière que ``matching()``,
ce qui signifie que vous pouvez utiliser la notation par points pour faire des
jointures pour les associations imbriquées profondément::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

De même, la seule différence est qu'aucune colonne supplémentaire ne sera
ajoutée à l'ensemble de résultats et aucune propriété ``_matchingData`` ne sera
définie.

.. versionadded:: 3.1
    Query::innerJoinWith() a été ajoutée dans 3.1

Utiliser notMatching
~~~~~~~~~~~~~~~~~~~~

L'opposé de ``matching()`` est ``notMatching()``. Cette fonction va changer
la requête pour qu'elle filtre les résultats qui n'ont pas de relation avec
l'association spécifiée::

    // Dans un controller ou une méthode de table.

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => 'boring']);
        });

L'exemple ci-dessus va trouver tous les articles qui n'étaient pas taggés avec
le mot ``boring``. Vous pouvez aussi utiliser cette méthode avec les
associations HasMany. Vous pouvez, par exemple, trouver tous les auteurs qui
n'ont aucun article dans les 10 derniers jours::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

Il est aussi possible d'utiliser cette méthode pour filtrer les enregistrements
qui ne matchent pas les associations profondes. Par exemple, vous pouvez
trouver les articles qui n'ont pas été commentés par un utilisateur précis::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });

Puisque les articles avec aucun commentaire satisfont aussi la condition
du dessus, vous pouvez combiner ``matching()`` et ``notMatching()`` dans la
même requête. L'exemple suivant va trouver les articles ayant au moins un
commentaire, mais non commentés par un utilisateur précis::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    Comme ``notMatching()`` va créer un ``LEFT JOIN``, vous pouvez envisager
    d'appeler ``distinct`` sur la requête find puisque sinon vous allez avoir
    des lignes dupliquées.

Gardez à l'esprit que le contraire de la fonction ``matching()``,
``notMatching()`` ne va pas ajouter toutes les données à la propriété
``_matchingData`` dans les résultats.

.. versionadded:: 3.1
    Query::notMatching() a été ajoutée dans 3.1

Utiliser leftJoinWith
~~~~~~~~~~~~~~~~~~~~~

Dans certaines situations, vous aurez à calculer un résultat selon une
association, sans avoir à charger tous les enregistrements. Par
exemple, si vous voulez charger le nombre total de commentaires qu'un article
a, ainsi que toutes les données de l'article, vous pouvez utiliser la fonction
``leftJoinWith()``::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->group(['Articles.id'])
        ->autoFields(true);

Le résultat de la requête ci-dessus va contenir les données de l'article et
la propriété ``total_comments`` pour chacun d'eux.

``leftJoinWith()`` peut aussi être utilisée avec des associations profondes.
C'est utile par exemple pour rapporter le nombre d'articles taggés par l'auteur
avec un certain mot::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'awesome']);
        })
        ->group(['Authors.id'])
        ->autoFields(true);

Cette fonction ne va charger aucune colonne des associations spécifiées dans
l'ensemble de résultats.

.. versionadded:: 3.1
    Query::leftJoinWith() a été ajoutée dans 3.1

.. end-filtering

Changer les Stratégies de Récupération
--------------------------------------

Comme vous le savez peut-être déjà, les associations ``belongsTo`` et ``hasOne``
sont chargées en utilisant un ``JOIN`` dans la requête du finder principal.
Bien que ceci améliore la requête et la vitesse de récupération des données et
permet de créer des conditions plus parlantes lors de la récupération des
données, cela peut devenir un problème quand vous devez appliquer certaines
clauses à la requête finder pour l'association, comme ``order()`` ou
``limit()``.

Par exemple, si vous souhaitez récupérer le premier commentaire d'un article
en association::

   $articles->hasOne('FirstComment', [
        'className' => 'Comments',
        'foreignKey' => 'article_id'
   ]);

Afin de récupérer correctement les données de cette association, nous devrons
dire à la requête d'utiliser la stratégie ``select``, puisque nous voulons
trier selon une colonne en particulier::

    $query = $articles->find()->contain([
        'FirstComment' => [
                'strategy' => 'select',
                'queryBuilder' => function ($q) {
                    return $q->order(['FirstComment.created' =>'ASC'])->limit(1);
                }
        ]
    ]);

Changer la stratégie de façon dynamique de cette façon va seulement l'appliquer
pour une requête spécifique. Si vous souhaitez rendre le changement de stratégie
permanent, vous pouvez faire::

    $articles->FirstComment->strategy('select');

Utiliser la stratégie ``select`` est aussi une bonne façon de faire des
associations avec des tables d'une autre base de données, puisqu'il ne serait
pas possible de récupérer des enregistrements en utilisant ``joins``.

Récupération Avec la Stratégie de Sous-Requête
----------------------------------------------

Avec la taille de vos tables qui grandit, la récupération des associations
peut devenir lente, spécialement si vous faîtes des grandes requêtes en une
fois. Un bon moyen d'optimiser le chargement des associations ``hasMany`` et
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
grandes portions de données en même temps, dans des bases de données qui
limitent le nombre de paramètres liés par requête, comme le **Serveur Microsoft
SQL**.

Vous pouvez aussi rendre la stratégie pour les associations permanente en
faisant::

    $articles->Comments->strategy('subquery');

Lazy loading des Associations
-----------------------------

Bien que CakePHP facilite le chargement en eager de vos associations, il y a des
cas où vous devrez charger en lazy les associations. Vous devez vous référer
aux sections :ref:`lazy-load-associations` et
:ref:`loading-additional-associations` pour plus d'informations.

Travailler avec des Ensembles de Résultat
=========================================

Une fois qu'une requête est exécutée avec ``all()``, vous récupèrerez une
instance de :php:class:`Cake\\ORM\\ResultSet`. Cet objet permet de manipuler les
données résultantes de vos requêtes. Comme les objets Query, les ensembles de
résultats sont une :doc:`Collection </core-libraries/collections>` et vous
pouvez utiliser toute méthode de collection sur des objets ResultSet.

Les objets ResultSet vont charger lazily les lignes à partir de la requête
préparée sous-jacente.
Par défaut, les résultats seront mis en mémoire vous permettant
d'itérer un ensemble de résultats plusieurs fois, ou de mettre en cache et
d'itérer les résultats. Si vous devez travailler sur un ensemble de données qui
ne rentre pas dans la mémoire, vous pouvez désactiver la mise en mémoire sur la
requête pour faire un stream des résultats::

    $query->bufferResults(false);

Stopper la mise en mémoire tampon nécessite quelques mises en garde:

#. Vous ne pourrez plus itérer un ensemble de résultats plus d'une fois.
#. Vous ne pourrez plus aussi itérer et mettre en cache les résultats.
#. La mise en mémoire tampon ne peut pas être désactivé pour les requêtes qui
   chargent en eager les associations hasMany ou belongsToMany, puisque ces
   types d'association nécessitent le chargement en eager de tous les résultats
   pour que les requêtes dépendantes puissent être générées. Cette
   limitation n'est pas présente lorsque l'on utilise la stratégie ``subquery``
   pour ces associations.

.. warning::

    Les résultats de streaming alloueront toujours l'espace mémoire nécessaire
    pour les résultats complets lorsque vous utilisez PostgreSQL et SQL Server.
    Ceci est dû à des limitations dans PDO.

Les ensembles de résultat vous permettent de mettre en cache/serializer ou
d'encoder en JSON les résultats pour les résultats d'une API::

    // Dans un controller ou une méthode de table.
    $results = $query->all();

    // Serializé
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

Les sérialisations et encodage en JSON des ensembles de résultats fonctionne
comme vous pouvez vous attendre. Les données sérialisées peuvent être
désérializées en un ensemble de résultats de travail. Convertir en JSON
garde les configurations de champ caché & virtuel sur tous les objets
entity dans un ensemble de résultat.

En plus de faciliter la sérialisation, les ensembles de résultats sont un
objet 'Collection' et supportent les mêmes méthodes que les
:doc:`objets collection </core-libraries/collections>`. Par exemple, vous
pouvez extraire une liste des tags uniques sur une collection d'articles en
exécutant::

    // Dans un controller ou une méthode de table.
    $articles = TableRegistry::get('Articles');
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

Ci-dessous quelques autres exemples des méthodes de collection utilisées
avec des ensembles de données::

    // Filtre les lignes sur une propriété calculée
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // Crée un tableau associatif depuis les propriétés du résultat
    $articles = TableRegistry::get('Articles');
    $results = $articles->find()->contain(['Authors'])->all();

    $authorList = $results->combine('id', 'author.name');

Le chapitre :doc:`/core-libraries/collections` comporte plus de détails sur
ce qui peut être fait avec les ensembles de résultat en utilisant les
fonctionnalités des collections.

Récupérer le Premier & Dernier enregistrement à partir d'un ResultSet
---------------------------------------------------------------------

Vous pouvez utiliser les méthodes ``first()`` et ``last()`` pour récupérer
les enregistrements respectifs à partir d'un ensemble de résultats::

    $result = $articles->find('all')->all();

    // Récupère le premier et/ou le dernier résultat.
    $row = $result->first();
    $row = $result->last();

Récupérer un Index arbitraire à partir d'un ResultSet
-----------------------------------------------------

Vous pouvez utiliser ``skip()`` et ``first()`` pour récupérer un enregistrement
arbitraire à partir d'un ensemble de résultats::

    $result = $articles->find('all')->all();

    // Récupère le 5ème enregistrement
    $row = $result->skip(4)->first();

Vérifier si une Requête Query ou un ResultSet est vide
------------------------------------------------------

Vous pouvez utiliser la méthode ``isEmpty()`` sur un objet Query ou ResultSet
pour voir s'il contient au moins une colonne. Appeler ``isEmpty()`` sur un
objet Query va évaluer la requête::

    // VérifieCheck une requête.
    $query->isEmpty();

    // Vérifie les résultats.
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

Chargement d'Associations Additionnelles
----------------------------------------

Une fois que vous avez créé un ensemble de résultats, vous pourriez vouloir
charger en eager des associations additionnelles. C'est le moment idéal pour charger
des données. Vous pouvez charger des associations additionnelles en utilisant
``loadInto()``::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

Vous pouvez charger en eager des données additionnelles dans une entity unique
ou une collection d'entites.

.. versionadded: 3.1
    Table::loadInto() was added in 3.1

.. _map-reduce:

Modifier les Résultats avec Map/Reduce
======================================

La plupart du temps, les opérations ``find`` nécessitent un traitement
postérieur des données qui se trouvent dans la base de données. Alors que les
méthodes ``getter`` des ``entities`` peuvent s'occuper de la plupart de la
génération de propriété virtuelle ou un formatage de données spéciales, parfois
vous devez changer la structure des données d'une façon plus fondamentale.

Pour ces cas, l'objet ``Query`` offre la méthode ``mapReduce()``, qui est une
façon de traiter les résultats une fois qu'ils ont été récupérés dans la
base de données.

Un exemple habituel de changement de structure de données est le groupement de
résultats basé sur certaines conditions. Pour cette tâche, nous
pouvons utiliser la fonction ``mapReduce()``. Nous avons besoin de deux
fonctions appelables ``$mapper`` et ``$reducer``.
La callable ``$mapper`` reçoit le résultat courant de la base de données en
premier argument, la clé d'itération en second paramètre et finalement elle
reçoit une instance de la routine ``MapReduce`` qu'elle lance::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

Dans l'exemple ci-dessus, ``$mapper`` calcule le statut d'un article, soit
publié (published) soit non publié (unpublished), ensuite il appelle
``emitIntermediate()`` sur l'instance ``MapReduce``. Cette méthode stocke
l'article dans la liste des articles avec pour label soit publié (published)
ou non publié (unpublished).

La prochaine étape dans le processus de map-reduce  est de consolider les
résultats finaux. Pour chaque statut créé dans le mapper, la fonction
``$reducer`` va être appelée donc vous pouvez faire des traitements
supplémentaires. Cette fonction va recevoir la liste des articles dans un
"bucket" particulier en premier paramètre, le nom du "bucket" dont il a
besoin pour faire le traitement en second paramètre, et encore une fois, comme
dans la fonction ``mapper()``, l'instance de la routine ``MapReduce`` en
troisième paramètre. Dans notre exemple, nous n'avons pas fait de traitement
supplémentaire, donc nous avons juste ``emit()`` les résultats finaux::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

Finalement, nous pouvons mettre ces deux fonctions ensemble pour faire le
groupement::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer);

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("The are %d %s articles", count($articles), $status);
    }

Ce qui est au-dessus va afficher les lignes suivantes::

    There are 4 published articles
    There are 5 unpublished articles

Bien sûr, ceci est un exemple simple qui pourrait être solutionné d'une autre
façon sans l'aide d'un traitement map-reduce. Maintenant, regardons un autre
exemple dans lequel la fonction reducer sera nécessaire pour faire quelque
chose de plus que d'émettre les résultats.

Calculer les mots mentionnés le plus souvent, où les articles contiennent
l'information sur CakePHP, comme d'habitude nous avons besoin d'une fonction
mapper::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos('cakephp', $article['body']) === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

Elle vérifie d'abord si le mot "cakephp" est dans le corps de l'article, et
ensuite coupe le corps en mots individuels. Chaque mot va créer son propre
``bucket`` où chaque id d'article sera stocké. Maintenant réduisons nos
résultats pour extraire seulement le compte::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

Finalement, nous mettons tout ensemble::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

Ceci pourrait retourner un tableau très grand si nous ne nettoyons pas les mots
interdits, mais il pourrait ressembler à ceci::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

Un dernier exemple et vous serez un expert de map-reduce. Imaginez que vous
avez une table de ``friends`` et que vous souhaitiez trouver les "fake friends"
dans notre base de données ou, autrement dit, les gens qui ne se suivent pas
mutuellement. Commençons avec notre fonction ``mapper()``::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

Nous avons juste dupliqué nos données pour avoir une liste d'utilisateurs que
chaque utilisateur suit. Maintenant, il est temps de la réduire. Pour chaque
appel au reducer, il va recevoir une liste de followers par utilisateur::

    // liste de $friends ressemblera à des nombres répétés
    // ce qui signifie que les relations existent dans les deux directions
    [2, 5, 100, 2, 4]

    $reducer = function ($friendsList, $user, $mr) {
        $friends = array_count_values($friendsList);
        foreach ($friends as $friend => $count) {
            if ($count < 2) {
                $mr->emit($friend, $user);
            }
        }
    }

Et nous fournissons nos fonctions à la requête::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer)
        ->toArray();

Ceci retournerait un tableau similaire à ceci::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

Les tableaux résultants signifient, par exemple, que l'utilisateur avec l'id
``1`` suit les utilisateurs ``2`` and ``4``, mais ceux-ci ne suivent pas
``1`` de leur côté.


Stacking Multiple Operations
----------------------------

L'utilisation de `mapReduce` dans une requête ne va pas l'exécuter
immédiatement. L'opération va être enregistrée pour être lancée dès que
l'on tentera de récupérer le premier résultat.
Ceci vous permet de continuer à chainer les méthodes et les filtres
à la requête même après avoir ajouté une routine map-reduce::

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
        // Same as in the common words example in the previous section
        $mapper = ...;
        $reducer = ...;
        return $query->mapReduce($mapper, $reducer);
    }

    $commonWords = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

En plus, il est aussi possible d'empiler plus d'une opération ``mapReduce``
pour une requête unique. Par exemple, si nous souhaitons avoir les mots les
plus couramment utilisés pour les articles, mais ensuite les filtrer pour
seulement retourner les mots qui étaient mentionnés plus de 20 fois tout au long
des articles::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper);

Retirer Toutes les Opérations Map-reduce Empilées
-------------------------------------------------

Dans les mêmes circonstances vous voulez modifier un objet ``Query`` pour
que les opérations ``mapReduce`` ne soient pas exécutées du tout. Ceci peut
être fait en appelant la méthode avec les deux paramètres à null et le troisième
paramètre (overwrite) à ``true``::

    $query->mapReduce(null, null, true);
