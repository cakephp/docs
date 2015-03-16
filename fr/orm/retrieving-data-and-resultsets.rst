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

Récupérer une Entity Unique avec une Clé Primaire
=================================================

.. php:method:: get($id, $options = [])

C'est souvent pratique de charger une entity unique à partir de la base de
données quand vous modifiez ou visualisez les entities et leurs données liées.
Vous pouvez faire ceci facilement en utilisant ``get()``::

    // Dans un controller ou dans une méthode table.

    // Récupère un article unique
    $article = $articles->get($id);

    // Récupère un article unique, et les commentaires liés
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

Si l'opération get ne trouve aucun résultat, une
``Cake\ORM\Error\RecordNotFoundException`` sera levée. Vous pouvez soit
attraper cette exception vous-même, ou permettre à CakePHP de la convertir en
une erreur 404.

Comme ``find()``, get a un cache intégré. Vous pouvez utiliser l'option
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

    // Appeler execute va exécuter la requête
    // et retourne l'ensemble de résultats.
    $results = $query->all();

    // Convertir la requête en tableau va l'exécuter.
    $results = $query->toArray();

.. note::

    Une fois que vous avez commencé une requête, vous pouvez utiliser
    l'interface :doc:`/orm/query-builder` pour construire des requêtes
    plus complexes, d'ajouter des conditions supplémentaires, des limites,
    ou d'inclure des associations en utilisant l'interface courante.

.. code-block:: php

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
requêtes plus facilement et faciliter les tests.

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

Récupérer un Nombre de Résultats
================================

Une fois que vous avez créé un objet query, vous pouvez utiliser la méthode
``count()`` pour récupérer un nombre de résultats de cette query::

    // Dans un controller ou une méthode de table.
    $query = $articles->find('all', [
        'where' => ['Articles.title LIKE' => '%Ovens%']
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
        'keyField' => 'slug', 'valueField' => 'title'
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
        'keyField' => 'slug', 'valueField' => 'title',
        'groupField' => ['author_id']
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

Trouver des Données Threaded
============================

Le finder ``find('threaded')`` retourne les entities imbriquées qui sont
threaded ensemble à travers un champ clé. Par défaut, ce champ est
``parent_id``. Ce finder vous permet d'accéder facilement aux données stockées
dans une table de style 'liste adjacente'. Toutes les entities qui matchent
un ``parent_id`` donné sont placées sous l'attribut ``children``::

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

Finders Dynamiques
==================

L'ORM de CakePHP fournit des méthodes de finder construites dynamiquement qui
vous permettent de facilement exprimer des requêtes simples sans aucun code
supplémentaire. Par exemple si vous vouliez trouver un utilisateur selon son
username, vous pourriez faire::

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

.. note::

    Alors que les finders dynamiques facilitent la gestion des requêtes, ils
    entraînent des coûts de performance supplémentaires.

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

Avec l'utilisation de ``contain``, vous pouvez restreindre les données
retournées par les associations et les filtrer par conditions::

    // Dans un controller ou une méthode de table.

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

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
associée, vous pouvez les utiliser à l'intérieur de ``contain``::

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
pouvez appeler ``contain`` pour ne pas ajouter les contraintes ``foreignKey``
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

Si vous avez limité les champs que vous chargez avec ``select()`` mais aussi
que vous souhaitez charger les champs en dehors d'associations avec contain,
vous pouvez utiliser ``autoFields()``::

    // Select id & title de articles, mais tous les champs de Users.
    $query->select(['id', 'title'])
        ->contain(['Users'])
        ->autoFields(true);

Filtrer par les Données Associées
---------------------------------

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

Filtrer des associations profondes est étonnement facile, et la syntaxe doit
déjà vous être familière::

    // Dans un controller ou une table de méthode.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // Récupère les articles uniques qui étaient commentés par 'markstory'
    // en utilisant la variable passée
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    Comme cette fonction va créer un ``INNER JOIN``, vous pouvez appeler
    ``distinct`` sur le find de la requête puisque vous aurez des lignes
    dupliquées si les conditions ne les filtrent pas déjà. Ceci peut être le
    cas, par exemple, quand les mêmes utilisateurs commentent plus d'une fois
    un article unique.

Les données des associations qui sont 'matchés' (appairés) seront disponibles
dans l'attribut ``_matchingData`` des entities. Si vous utilisez à la fois
match et contain sur la même association, vous pouvez vous attendre à recevoir
à la fois la propriété ``_matchingData`` et la propriété standard d'association
dans vos résultats.

.. end-contain

Lazy loading des Associations
-----------------------------

Bien que CakePHP facilite le chargement en eager de vos associations, il y a des
cas où vous devrez charger en lazy les associations. Vous devez vous référer
à la section :ref:`lazy-load-associations` pour plus d'informations.

Travailler avec des Ensembles de Résultat
=========================================

Une fois qu'une requête est exécutée avec ``all()``, vous récupèrerez une
instance de :php:class:`Cake\\ORM\ResultSet`. Cet objet offre des manières
puissantes de manipuler les données résultantes à partir de vos requêtes.

Les objets d'ensemble de résultat vont charger lazily les lignes à partir
de la requête préparée underlying.
Par défaut, les résultats seront buffered dans la mémoire vous permettant
d'itérer un ensemble de résultats plusieurs fois, ou de mettre en cache et
d'itérer les résultats. Si vous devez travailler sur un ensemble de données qui
ne rentre pas dans la mémoire, vous pouvez désactiver le buffering sur la
requête pour stream les résultats::

    $query->bufferResults(false);

Stopper le buffering nécessite quelques mises en garde:

#. Vous ne pourrez plus itérer un ensemble de résultats plus d'une fois.
#. Vous ne pourrez plus aussi itérer et mettre en cache les résultats.
#. Le buffering ne peut pas être désactivé pour les requêtes qui chargent en
   eager les associations hasMany ou belongsToMany, puisque ces types
   d'association nécessitent le chargement en eager de tous les résultats
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
:ref:`objets collection<collection-objects>`. Par exemple, vous pouvez extraire
une liste des tags uniques sur une collection d'articles assez facilement::

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

Le chapitre :doc:`/core-libraries/collections` comporte plus de détails sur
ce qui peut être fait avec les ensembles de résultat en utilisant les
fonctionnalités des collections.
