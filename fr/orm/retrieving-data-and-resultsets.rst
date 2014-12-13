Retrieving Data & Results Sets
##############################

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

Si l'opération get ne trouve aucun résultats, une
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
fournit un moyen facile et extensible pour trouver les données qui vous
intéressent::

    // Dans un controller ou dans une méthode table.

    // Trouver tous les articles
    $query = $articles->find('all');

La valeur retournée de toute méthode ``find`` est toujours un objet
:php:class:`Cake\\ORM\\Query`. La classe Query vous permet de redéfinir
une requête plus tard après l'avoir créée. Les objets Query sont évalués
lazily, et ne s'exéxutent qu'à partir du moment où vous commencer à récupérer
des lignes, les convertisser en tableau, ou quand la méthode
``all()`` est appelée::

    // Dans un controller ou dans une méthode table.

    // Trouver tous les articles.
    // A ce niveau, la requête n'est pas lancée.
    $query = $articles->find('all');

    // L'itération va exécuter la requête.
    foreach ($query as $row) {
    }

    // Appeler execute va exceuter la requête
    // et retourne l'ensemble de résultats.
    $results = $query->all();

    // Convertir la requête en tableau va l'exécuter.
    $results = $query->toArray();

Une fois que vous avez commencé une requête, vous pouvez utiliser l'interface
:doc:`/orm/query-builder` pour construire des requêtes plus complexes, d'ajouter
des conditions supplémentaires, des limites, ou d'inclure des associations
en utilisant l'interface courante::

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

- ``conditions`` fournit conditions pour la clause WHERE de la requête.
- ``limit`` Définit le nombre de lignes que vous voulez.
- ``offset`` Définit l'offset de la page que vous souhaitez. Vous pouvez aussi
  utiliser ``page`` pour faciliter le calcul.
- ``contain`` définit les associations à charger en eager.
- ``fields`` limite les champs chargés dans l'entity. Charger seulement quelques
  champs peut faire que les entities se comportent de manière incorrecte.
- ``group`` ajoute une clause GROUP BY à votre requête. C'est utile quand vous
  utiliser les fonctions d'aggrégation.
- ``having`` ajoute une clause HAVING à votre requête.
- ``join`` définit les jointures personnalisées supplémentaires.
- ``order`` ordonne l'ensemble de résultats.

Toute option qui n'est pas dans la liste sera passée aux listeners de beforeFind
où ils peuvent être utilisés pour modifier l'objet requête. Vous pouvez utiliser
la méthode ``getOptions`` sur un objet query pour récupérer les options
utilisées. While you can very easily pass query objects to your controllers,
we recommend that you package your queries up as :ref:`custom-find-methods` instead.
Using custom finder methods will let you re-use your queries more easily and make
testing easier.

By default queries and result sets will return :doc:`/orm/entities` objects. You
can retrieve basic arrays by disabling hydration::

    $query->hydrate(false);

    // $data is ResultSet that contains array data.
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

Getting a Count of Results
==========================

Once you have created a query object, you can use the ``count()`` method to get
a result count of that query::

    // In a controller or table method.
    $query = $articles->find('all', [
        'where' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

See :ref:`query-count` for additional usage of the ``count()`` method.

.. _table-find-list:

Trouver les Paires de Clé/Valeur
================================

C'est souvent pratique pour générer un tableau associatif de données à partir
des données de votre applications. Par exemple, c'est très utile quand vous
créez des elements `<select>`. CakePHP fournit une méthode simple à utiliser
pour générer des 'lists' de données::

    // Dans un controller ou dans une méthode table.
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

    class Articles extends Table {

        public function initialize(array $config) {
            $this->displayField('title');
        }
    }

Quand vous appelez ``list``, vous pouvez configurer les champs utilisés pour
la clé et la valeur avec respectivement les options ``idField`` et
``valueField``::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('list', [
        'idField' => 'slug', 'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // Les données ressemblent maintenant à
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Les résultats peuvent être groupés en des ensembles imbriqués. C'est utile
quand vous voulez des ensemble bucketed ou que vous voulez construire des
elements ``<optgroup>`` avec FormHelper::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('list', [
        'idField' => 'slug', 'valueField' => 'title',
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
            // More data.
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
        'idField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

Les clés ``parentField`` et ``idField`` peuvent être utilisées pour définir
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

    class ArticlesTable extends Table {

        public function findPublished(Query $query, array $options) {
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
``$options`` pour personnaliser l'opérarion finder avec la logique
d'application concernée. Vous pouvez aussi 'stack' les finders, vous
permettant de faire des requêtes complexes sans efforts. En supposant que
vous avez à la fois les finders 'published' et 'recent', vous pouvez faire
ce qui suit::

    // Dans un controller ou dans une méthode table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

Alors que les exemples pour l'instant ont montré les méthodes finder sur les
classes table, les méthodes finder peuvent aussi être définies sur les
:doc:`/orm/behaviors`.

Si vous devez modifier les résultats après qu'ils ont été récupérés, vous
pouvez utiliser une fonction :ref:`map-reduce` pour modifier les résultats.
Les fonctionnalités de map reduce remplace le callback 'afterFind' qu'on
avait dans les versions précédentes de CakePHP.

Dynamic Finders
===============

CakePHP's ORM provides dynamically constructed finder methods which allow you to
easily express simple queries with no additional code. For example if you wanted
to find a user by username you could do::

    // The following two calls are equal.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

When using dynamic finders you can constrain on multiple fields::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

You can also create ``OR`` conditions::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

While you can use either OR or AND conditions, you cannot combine the two in
a single dynamic finder. Other query options like ``contain`` are also not
supported with dynamic finders. You should use :ref:`custom-find-methods` to
encapsulate more complex queries.  Lastly, you can also combine dynamic finders
with custom finders::

    $query = $users->findTrollsByUsername('bro');

The above would translate into the following::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

.. note::

    While dynamic finders make it simple to express queries, they come with some
    additional performance overhead.


Eager Loading Associations
==========================

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results.

.. start-contain

Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you define eager loaded associations using the 'contain' method::

    // In a controller or table method.

    // As an option to find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // As a method on the query object
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

The above will load the related author and comments for each article in the
result set. You can load nested associations using nested arrays to define the
associations to be loaded::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

Alternatively, you can express nested associations using the dot notation::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

You can eager load associations as deep as you like::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

Passing Conditions to Contain
-----------------------------

When using ``contain`` you are able to restrict the data returned by the
associations and filter them by conditions::

    // In a controller or table method.

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

.. note::

    When you limit the fields that are fetched from an association, you **must**
    ensure that the foreign key columns are selected. Failing to select foreign
    key fields will cause associated data to not be present in the final result.

It is also possible to restrict deeply nested associations using the dot
notation::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

If you have defined some custom finder methods in your associated table, you can
use them inside ``contain``::

    // Bring all articles, but only bring the comments that are approved and
    // popular.
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    For ``BelongsTo`` and ``HasOne`` associations only the ``where`` and
    ``select`` clauses are used when loading the associated records. For the
    rest of the association types you can use every clause that the query object
    provides.

If you need full control over the query that is generated, you can tell ``contain``
to not append the ``foreignKey`` constraints to the generated query. In that
case you should use an array passing ``foreignKey`` and ``queryBuilder``::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...) // Full conditions for filtering
            }
        ]
    ]);

If you have limited the fields you are loading with ``select()`` but also want to
load fields off of contained associations, you can use ``autoFields()``::

    // Select id & title from articles, but all fields off of Users.
    $query->select(['id', 'title'])
        ->contain(['Users'])
        ->autoFields(true);

Filtering by Associated Data
----------------------------

A fairly common query case with associations is finding records 'matching'
specific associated data. For example if you have 'Articles belongsToMany Tags'
you will probably want to find Articles that have the CakePHP tag. This is
extremely simple to do with the ORM in CakePHP::

    // In a controller or table method.

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

You can apply this strategy to HasMany associations as well. For example if
'Authors HasMany Articles', you could find all the authors with recently
published articles using the following::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

Filtering by deep associations is surprisingly easy, and the syntax should be
already familiar to you::

    // In a controller or table method.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Country.name' => 'Japan'])
        }
    );

    // Bring unique articles that were commented by 'markstory' using passed variable
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username])
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't filter them already. This might be the case, for example,
    when the same users comments more than once on a single article.

.. end-contain

Lazy Loading Associations
-------------------------

While CakePHP makes it easy to eager load your associations, there may be cases
where you need to lazy-load associations. You should refer to the
:ref:`lazy-load-associations` section for more information.

Working with Result Sets
========================

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results. If you need to disable
buffering because you are working with a data set that does not fit into memory you
can disable buffering on the query to stream results::

    $query->bufferResults(false);

.. warning::

    Streaming results is not possible when using SQLite, or queries with eager
    loaded hasMany or belongsToMany associations.

Result sets allow you to easily cache/serialize or JSON encode results for API results::

    // In a controller or table method.
    $results = $query->all();

    // Serialized
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

Both serializing and JSON encoding result sets work as you would expect. The
serialized data can be unserialized into a working result set. Converting to
JSON respects hidden & virtual field settings on all entity objects
within a result set.

In addition to making serialization easy, result sets are a 'Collection' object and
support the same methods that :ref:`collection objects<collection-objects>`
do. For example, you can extract a list of unique tags on a collection of
articles quite easily::

    // In a controller or table method.
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

The :doc:`/core-libraries/collections` chapter has more detail on what can be
done with result sets using the collections features.
