Query Builder
#############

.. php:namespace:: Cake\ORM

.. php:class:: Query

Le constructeur de requête de l'ORM fournit une interface facile à utiliser pour
créer et lancer les requêtes. En arrangeant les requêtes ensemble, vous pouvez
créer des requêtes avancées en utilisant les unions et les sous-requêtes avec
facilité.

Sous le capot, le constructeur de requête utilise les requêtes préparées de PDO
qui protègent contre les attaques d'injection SQL.

L'Objet Query
=============

La façon la plus simple de créer un objet ``Query`` est d'utiliser ``find()`` à
partir d'un objet ``Table``. Cette méthode va retourner une requête incomplète
prête à être modifiée. Vous pouvez aussi utiliser un objet table connection pour
accéder au niveau inférieur du constructeur de Requête qui n'inclut pas les
fonctionnalités de l'ORM, si nécessaire. Consultez la section
:ref:`database-queries` pour plus d'informations::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');

    // Commence une nouvelle requête.
    $query = $articles->find();

Depuis un controller, vous pouvez utiliser la variable de table créée
automatiquement par le système de conventions::

    // Inside ArticlesController.php

    $query = $this->Articles->find();

Récupérer les Lignes d'une Table
--------------------------------

::

    use Cake\ORM\TableRegistry;

    $query = TableRegistry::get('Articles')->find();

    foreach ($query as $article) {
        debug($article->title);
    }

Pour les exemples restants, imaginez que ``$articles`` est une
:php:class:`~Cake\\ORM\\Table`. Quand vous êtes dans des controllers, vous
pouvez utiliser ``$this->Articles`` plutôt que ``$articles``.

Presque chaque méthode dans un objet ``Query`` va retourner la même requête,
cela signifie que les objets ``Query`` sont lazy, et ne seront pas exécutés à
moins que vous lui disiez de le faire::

    $query->where(['id' => 1]); // Retourne le même objet query
    $query->order(['title' => 'DESC']); // Toujours le même objet, aucun SQL exécuté

Vous pouvez bien sûr chainer les méthodes que vous appelez sur les objets
Query::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

    foreach ($query as $article) {
        debug($article->created);
    }

Si vous essayez d'appeler ``debug()`` sur un objet Query, vous verrez son état
interne et le SQL qui sera exécuté dans la base de données::

    debug($articles->find()->where(['id' => 1]));

    // Affiche
    // ...
    // 'sql' => 'SELECT * FROM articles where id = ?'
    // ...

Vous pouvez exécuter une requête directement sans avoir à utiliser ``foreach``.
La façon la plus simple est d'appeler les méthodes ``all()`` ou ``toArray()``::

    $resultsIteratorObject = $articles
        ->find()
        ->where(['id >' => 1])
        ->all();

    foreach ($resultsIteratorObject as $article) {
        debug($article->id);
    }

    $resultsArray = $articles
        ->find()
        ->where(['id >' => 1])
        ->toArray();

    foreach ($resultsArray as $article) {
        debug($article->id);
    }

    debug($resultsArray[0]->title);

Dans l'exemple ci-dessus, ``$resultsIteratorObject`` sera une instance de
``Cake\ORM\ResultSet``, un objet que vous pouvez itérer et sur lequel vous
pouvez appliquer plusieurs méthodes d'extractions ou de traversement.

Souvent, il n'y a pas besoin d'appeler ``all()``, vous pouvez juste itérer
l'objet Query pour récupérer ses résultats. les objets Query peuvent également
être utilisés directement en tant qu'objet résultat; Essayer d'itérer la requête
en utilisant ``toArray()`` ou n'importe qu'elle méthode héritée de
:doc:`Collection </core-libraries/collections>`, aura pour résultat l'exécution
de la requête et la récupération des résultats.

Récupérez une Ligne Unique d'une Table
--------------------------------------

Vous pouvez utilisez la méthode ``first()`` pour récupérer le premier résultat
dans la requête::

    $article = $articles
        ->find()
        ->where(['id' => 1])
        ->first();

    debug($article->title);

Récupérer une Liste de Valeurs à Partir d'une Colonne
-----------------------------------------------------

::

    // Utilise la méthode extract() à partir de la libraire collections
    // Ceci exécute aussi la requête
    $allTitles = $articles->find()->extract('title');

    foreach ($allTitles as $title) {
        echo $title;
    }

Vous pouvez aussi récupérer une liste de clé-valeur à partir d'un résultat d'une
requête::

    $list = $articles->find('list');

    foreach ($list as $id => $title) {
        echo "$id : $title"
    }

Pour plus d'informations sur la façon de personnaliser les champs utilisés pour
remplir la liste, consultez la section :ref:`table-find-list`.

Les Requêtes sont des Objets Collection
---------------------------------------

Une fois que vous êtes familier avec les méthodes de l'objet Query, il est
fortement recommandé que vous consultiez la section
:doc:`Collection </core-libraries/collections>` pour améliorer vos compétences
dans le traversement efficace de données. En résumé, il est important de se
rappeler que tout ce que vous pouvez appeler sur un objet Collection, vous
pouvez aussi le faire avec un objet Query::

    // Utilise la méthode combine() à partir de la libraire collection
    // Ceci est équivalent au find('list')
    $keyValueList = $articles->find()->combine('id', 'title');

    // Un exemple avancé
    $results = $articles->find()
        ->where(['id >' => 1])
        ->order(['title' => 'DESC'])
        ->map(function ($row) { // map() est une méthode de collection, elle exécute la requête
            $row->trimmedTitle = trim($row->title);
            return $row;
        })
        ->combine('id', 'trimmedTitle') // combine() est une autre méthode de collection
        ->toArray(); // Aussi une méthode de la librairie collection

    foreach ($results as $id => $trimmedTitle) {
        echo "$id : $trimmedTitle";
    }

Comment les Requêtes sont Évaluées Lazily
-----------------------------------------

Les objets Query sont évalués "lazily" (paresseusement). Cela signifie qu'une
requête n'est pas exécutée jusqu'à ce qu'une des prochaines actions se fasse:

- La requête est itérée avec ``foreach()``.
- La méthode ``execute()`` de query est appelée. Elle retourne l'objet
  d'instruction sous-jacente, et va être utilisée avec les requêtes
  insert/update/delete.
- La méthode ``first()`` de query est appelée. Elle retourne le premier résultat
  correspondant à l'instruction ``SELECT`` (ajoute LIMIT 1 à la requête).
- La méthode ``all()`` de query est appelée. Elle retourne l'ensemble de
  résultats et peut seulement être utilisée avec les instructions ``SELECT``.
- La méthode ``toArray()`` de query est appelée.

Jusqu'à ce qu'une de ces conditions soit rencontrée, la requête peut être
modifiée avec du SQL supplémentaire envoyé à la base de données. Cela signifie
que si une Query n'a pas été évaluée, aucun SQL ne sera jamais envoyé à la
base de données. Une fois exécutée, la modification et la ré-évaluation
d'une requête va entraîner l'exécution de SQL supplémentaire.

Si vous souhaitez jeter un œil sur le SQL que CakePHP génère, vous pouvez
activer les :ref:`logs de requête <database-query-logging>` de la base de
données.

Les sections suivantes vont vous montrer tout ce qu'il faut savoir sur
l'utilisation et la combinaison des méthodes de l'objet Query pour construire
des requêtes SQL et extraire les données.

Récupérer vos Données
=====================

La plupart des applications web utilisent beaucoup les requêtes de type
``SELECT``. CakePHP permet de construire ces requêtes en un clin d'œil. La
méthode ``select()`` vous permet de ne récupérer que les champs qui vous sont
nécessaires::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query as $row) {
        debug($row->title);
    }

Vous pouvez également définir des alias pour vos champs en fournissant les
champs en tant que tableau associatif::

    // Résultats dans SELECT id AS pk, title AS aliased_title, body ...
    $query = $articles->find();
    $query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);

Pour sélectionner des champs distincts, vous pouvez utiliser la méthode
``distinct()``::

    // Résultats dans SELECT DISTINCT country FROM ...
    $query = $articles->find();
    $query->select(['country'])
        ->distinct(['country']);

Pour définir certaines conditions basiques, vous pouvez utiliser la
méthode ``where()``::

    // Conditions sont combinées avec AND
    $query = $articles->find();
    $query->where(['title' => 'First Post', 'published' => true]);

    // Vous pouvez aussi appeler where() plusieurs fois
    $query = $articles->find();
    $query->where(['title' => 'First Post'])
        ->where(['published' => true]);

Consultez la section :ref:`advanced-query-conditions` pour trouver comment
construire des conditions ``WHERE`` plus complexes. Pour appliquer un tri,
vous pouvez utiliser la méthode ``order``::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

.. versionadded:: 3.0.12

    En plus de ``order``, les méthodes ``orderAsc`` et ``orderDesc`` peuvent
    être utilisées quand vous devez trier selon des expressions complexes::

        $query = $articles->find();
        $concat = $query->func()->concat([
            'title' => 'identifier',
            'synopsis' => 'identifier'
        ]);
        $query->orderAsc($concat);

Pour limiter le nombre de lignes ou définir la ligne offset, vous pouvez
utiliser les méthodes ``limit()`` et ``page()``::

    // Récupérer les lignes 50 à 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

Comme vous pouvez le voir sur les exemples précédents, toutes les méthodes
qui modifient la requête fournissent une interface fluide, vous permettant
de construire une requête avec des appels de méthode chaînés.

Sélectionner Tous les Champs d'une Table
----------------------------------------

Par défaut, une requête va sélectionner tous les champs d'une table sauf si vous
appelez la fonction ``select()`` vous-même et passez certains champs::

    // Sélectionne seulement id et title de la table articles
    $articles->find()->select(['id', 'title']);

Si vous souhaitez toujours sélectionner tous les champs d'une table après avoir
appelé ``select($fields)``, vous pouvez dans cette optique passer l'instance de
table à ``select()``::

    // Sélectionne seulement id et title de la table articles
    $query = $articlesTable->find();
    $query
        ->select(['slug' => $query->func()->concat(['title' => 'identifier', '-', 'id' => 'identifier'])])
        ->select($articlesTable); // Sélectionne tous les champs de articles

.. _using-sql-functions:

Utiliser les Fonctions SQL
--------------------------

L'ORM de CakePHP offre une abstraction pour les fonctions les plus communément
utilisées par SQL. Utiliser l'abstraction permet à l'ORM de sélectionner
l'intégration spécifique de la fonction pour la plateforme que vous souhaitez.
Par exemple, ``concat`` est intégré différemment dans MySQL, PostgreSQL et
SQL Server. Utiliser l'abstraction permet à votre code d'être portable::

    // Résultats dans SELECT COUNT(*) count FROM ...
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

Un certain nombre de fonctions communément utilisées peut être créé avec la
méthode ``func()``:

- ``sum()`` Calcule une somme. Les arguments sont traités comme des valeurs
  littérales.
- ``avg()`` Calcule une moyenne. Les arguments sont traités comme des valeurs
  littérales.
- ``min()`` Calcule le min d'une colonne. Les arguments sont traités comme des
  valeurs littérales.
- ``max()`` Calcule le max d'une colonne. Les arguments sont traités comme
  des valeurs littérales.
- ``count()`` Calcule le count. Les arguments sont traités comme des valeurs
  littérales.
- ``concat()`` Concatène deux valeurs ensemble. Les arguments sont traités
  comme des paramètres liés, à moins qu'ils ne soient marqués comme littéral.
- ``coalesce()`` Regroupe les valeurs. Les arguments sont traités comme des
  paramètres liés, à moins qu'ils ne soient marqués comme littéral.
- ``dateDiff()`` Récupère la différence entre deux dates/times. Les arguments
  sont traités comme des paramètres liés, à moins qu'ils ne soient marqués comme
  littéral.
- ``now()`` Prend soit 'time', soit 'date' comme argument vous permettant de
  récupérer soit le time courant, soit la date courante.
- ``extract()`` Retourne la partie de la date spécifiée de l'expression SQL.
- ``dateAdd()`` Ajoute l'unité de temps à l'expression de la date.
- ``dayOfWeek()`` Retourne une FunctionExpression représentant un appel à la
  fonction SQL WEEKDAY.

.. versionadded:: 3.1

    Les méthodes ``extract()``, ``dateAdd()`` et ``dayOfWeek()`` ont été
    ajoutées.

Quand vous fournissez des arguments pour les fonctions SQL, il y a deux types de
paramètres que vous pouvez utiliser; Les arguments littéraux et les paramètres
liés. Les paramètres d'identifaction/littéraux vous permettent de référencer les
colonnes ou les autres valeurs littérales de SQL. Les paramètres liés peuvent
être utilisés pour ajouter en toute sécurité les données d'utilisateur aux
fonctions SQL. Par exemple::

    $query = $articles->find()->innerJoinWith('Categories');
    $concat = $query->func()->concat([
        'Articles.title' => 'identifier',
        ' - CAT: ',
        'Categories.name' => 'identifier',
        ' - Age: ',
        '(DATEDIFF(NOW(), Articles.created))' => 'literal',
    ]);
    $query->select(['link_title' => $concat]);

En modifiant les arguments avec une valeur de ``literal``, l'ORM va savoir que
la clé doit être traitée comme une valeur SQL littérale. En modifiant les
arguments avec une valeur d'``identifier``, l'ORM va savoir que la clé doit être
traitée comme un identifieur de champ. Le code ci-dessus va générer le SQL
suivant sur MySQL::

    SELECT CONCAT(Articles.title, :c0, Categories.name, :c1, (DATEDIFF(NOW(), Articles.created))) FROM articles;

La valeur ``:c0`` aura le texte ``' - CAT:'`` lié quand la requête est exécutée.

En plus des fonctions ci-dessus, la méthode ``func()`` peut être utilisée pour
créer toute fonction générique SQL comme ``year``, ``date_format``,
``convert``, etc... Par exemple::

    $query = $articles->find();
    $year = $query->func()->year([
        'created' => 'identifier'
    ]);
    $time = $query->func()->date_format([
        'created' => 'identifier',
        "'%H:%i'" => 'literal'
    ]);
    $query->select([
        'yearCreated' => $year,
        'timeCreated' => $time
    ]);

Entraînera::

    SELECT YEAR(created) as yearCreated, DATE_FORMAT(created, '%H:%i') as timeCreated FROM articles;

Vous devriez penser à utiliser le constructeur de fonctions à chaque fois que
vous devez mettre des données non fiables dans des fonctions SQL ou des
procédures stockées::

    // Utilise une procédure stockée
    $query = $articles->find();
    $lev = $query->func()->levenshtein([$search, 'LOWER(title)' => 'literal']);
    $query->where(function ($exp) use ($lev) {
        return $exp->between($lev, 0, $tolerance);
    });

    // Le SQL généré serait
    WHERE levenshtein(:c0, lower(street)) BETWEEN :c1 AND :c2

Regroupements - Group et Having
-------------------------------

Quand vous utilisez les fonctions d'agrégation comme ``count`` et ``sum``, vous
pouvez utiliser les clauses ``group by`` et ``having``::

    $query = $articles->find();
    $query->select([
        'count' => $query->func()->count('view_count'),
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Instructions Case
-----------------

L'ORM offre également l'expression SQL ``case``. L'expression ``case`` permet
l'implémentation d'une logique ``if ... then ... else`` dans votre SQL. Cela
peut être utile pour créer des rapports sur des données que vous avez besoin
d'additionner ou de compter conditionnellement, ou si vous avez besoin de
données spécifiques basées sur une condition.

Si vous vouliez savoir combien d'articles sont publiés dans notre base de
données, nous pourrions utiliser le SQL suivant::

    SELECT
    COUNT(CASE WHEN published = 'Y' THEN 1 END) AS number_published,
    COUNT(CASE WHEN published = 'N' THEN 1 END) AS number_unpublished
    FROM articles

Pour faire ceci avec le générateur de requêtes, vous utiliseriez le code
suivant::

    $query = $articles->find();
    $publishedCase = $query->newExpr()
        ->addCase(
            $query->newExpr()->add(['published' => 'Y']),
            1,
            'integer'
        );
    $unpublishedCase = $query->newExpr()
        ->addCase(
            $query->newExpr()->add(['published' => 'N']),
            1,
            'integer'
        );

    $query->select([
        'number_published' => $query->func()->count($publishedCase),
        'number_unpublished' => $query->func()->count($unpublishedCase)
    ]);

La fonction ``addCase`` peut aussi chaîner ensemble plusieurs instructions pour
créer une logique ``if .. then .. [elseif .. then .. ] [ .. else ]`` dans
votre SQL.

Si nous souhaitions classer des villes selon des tailles de population SMALL,
MEDIUM, ou LARGE, nous pourrions faire ce qui suit::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->lt('population', 100000),
                    $q->newExpr()->between('population', 100000, 999000),
                    $q->newExpr()->gte('population', 999001),
                ],
                ['SMALL',  'MEDIUM', 'LARGE'], # les valeurs correspondantes aux conditions
                ['string', 'string', 'string'] # type de chaque valeur
            );
        });
    # WHERE CASE
    #   WHEN population < 100000 THEN 'SMALL'
    #   WHEN population BETWEEN 100000 AND 999000 THEN 'MEDIUM'
    #   WHEN population >= 999001 THEN 'LARGE'
    #   END

A chaque fois qu'il y a moins de conditions qu'il n'y a de valeurs, ``addCase``
va automatiquement produire une instruction ``if .. then .. else``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->eq('population', 0),
                ],
                ['DESERTED', 'INHABITED'], # valeurs correspondantes aux conditions
                ['string', 'string'] # type de chaque valeur
            );
        });
    # WHERE CASE
    #   WHEN population = 0 THEN 'DESERTED' ELSE 'INHABITED' END

Récupérer des Tableaux plutôt que des Entities
----------------------------------------------

Bien que les ensembles de résultats en objet de l'ORM soient puissants, créer
des entities n'est parfois pas nécessaire. Par exemple, quand vous accédez aux
données agrégées, la construction d'une Entity peut ne pas être utile. Le
processus de conversion des résultats de la base de données en entities est
appelé hydratation. Si vous souhaitez désactiver ce processus, vous pouvez
faire ceci::

    $query = $articles->find();
    $query->hydrate(false); // Résultats en tableaux plutôt qu'en entities
    $result = $query->toList(); // Exécute la requête et retourne le tableau

Après avoir exécuté ces lignes, votre résultat devrait ressembler à quelque
chose comme ceci::

    [
        ['id' => 1, 'title' => 'First Article', 'body' => 'Article 1 body' ...],
        ['id' => 2, 'title' => 'Second Article', 'body' => 'Article 2 body' ...],
        ...
    ]

.. _format-results:

Ajouter des Champs Calculés
===========================

Après vos requêtes, vous aurez peut-être besoin de faire des traitements
postérieurs. Si vous voulez ajouter quelques champs calculés ou des données
dérivées, vous pouvez utiliser la méthode ``formatResults()``. C'est une
façon légère de mapper les ensembles de résultats. Si vous avez besoin de plus de
contrôle sur le processus, ou que vous souhaitez réduire les résultats, vous
devriez utiliser la fonctionnalité de :ref:`Map/Reduce <map-reduce>` à la
place. Si vous faîtes une requête d'une liste de personnes, vous pourriez
calculer leur âge avec le formateur de résultats::

    // En supposant que nous avons construit les champs, les conditions et les contain.
    $query->formatResults(function (\Cake\Collection\CollectionInterface  $results) {
        return $results->map(function ($row) {
            $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
            return $row;
        });
    });

Comme vous pouvez le voir dans l'exemple ci-dessus, les callbacks de formatage
récupéreront un ``ResultSetDecorator`` en premier argument. Le second argument
sera l'instance Query sur laquelle le formateur a été attaché. L'argument
``$results`` peut être traversé et modifié autant que nécessaire.

Les formateurs de résultat sont nécessaires pour retourner un objet itérateur,
qui sera utilisé comme valeur retournée pour la requête. Les fonctions de
formateurs sont appliquées après que toutes les routines
Map/Reduce soient exécutées. Les formateurs de résultat peuvent aussi être
appliqués dans les associations ``contain``. CakePHP va s'assurer que vos
formateurs sont bien scopés. Par exemple, faire ce qui suit fonctionnera
comme vous pouvez vous y attendre::

    // Dans une méthode dans la table Articles
    $query->contain(['Authors' => function ($q) {
        return $q->formatResults(function (\Cake\Collection\CollectionInterface $authors) {
            return $authors->map(function ($author) {
                $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
                return $author;
            });
        });
    }]);

    // Récupère les résultats
    $results = $query->all();

    // Affiche 29
    echo $results->first()->author->age;

Comme vu précédemment, les formateurs attachés aux constructeurs de requête
associées sont limités pour agir seulement sur les données dans l'association.
CakePHP va s'assurer que les valeurs calculées soient insérées dans la bonne
entity.

.. _advanced-query-conditions:

Conditions Avancées
===================

Le constructeur de requête facilite la construction de clauses ``where``
complexes. Les conditions groupées peuvent être exprimées en fournissant
une combinaison de ``where()``, ``andWhere()`` et ``orWhere()``. La méthode
``where()`` fonctionne de manière similaire aux tableaux de conditions des
versions précédentes de CakePHP::

    $query = $articles->find()
        ->where([
            'author_id' => 3,
            'OR' => [['view_count' => 2], ['view_count' => 3]],
        ]);

Ce qui précède générerait le code SQL::

    SELECT * FROM articles WHERE author_id = 3 AND (view_count = 2 OR view_count = 3)

Si vous préférez éviter des tableaux imbriqués profondément, vous pouvez
utiliser les méthodes ``orWhere()`` et ``andWhere()`` pour construire vos
requêtes. Chaque méthode définit l'opérateur de combinaison utilisé entre
les conditions courante et précédente. Par exemple::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3]);

Ce qui précède générerait le code SQL::

    SELECT * FROM articles WHERE (author_id = 2 OR author_id = 3)

En combinant ``orWhere()`` et ``andWhere()``, vous pouvez exprimer des
conditions complexes qui utilisent un mix d'opérateurs::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3])
        ->andWhere([
            'published' => true,
            'view_count >' => 10
        ])
        ->orWhere(['promoted' => true]);

Ce qui précède générerait le code SQL::

    SELECT *
    FROM articles
    WHERE (promoted = true
    OR (
      (published = true AND view_count > 10)
      AND (author_id = 2 OR author_id = 3)
    ))

En utilisant les fonctions en paramètres pour ``orWhere()`` et ``andWhere()``,
vous pouvez organiser ensemble les conditions avec les objets expression::

    $query = $articles->find()
        ->where(['title LIKE' => '%First%'])
        ->andWhere(function ($exp) {
            return $exp->or_([
                'author_id' => 2,
                'is_highlighted' => true
            ]);
        });

Ce qui précède générerait le code SQL::

    SELECT *
    FROM articles
    WHERE ((author_id = 2 OR is_highlighted = 1)
    AND title LIKE '%First%')

Les objets expression qui sont passés dans les fonctions ``where()`` ont deux
types de méthodes. Les premiers types de méthode sont des **combinateurs**.
Les méthodes ``and_()`` et ``or_()`` créent de nouveaux objets expression qui
changent **la façon dont** les conditions sont combinées. Les seconds types de
méthode sont les **conditions**. Les conditions sont ajoutées dans une
expression où elles sont combinées avec le combinateur courant.

Par exemple, appeler ``$exp->and_(...)`` va créer un nouvel objet ``Expression``
qui combine toutes les conditions qu'il contient avec ``AND``. Alors que
``$exp->or_()`` va créer un nouvel objet ``Expression`` qui combine toutes les
conditions qui lui sont ajoutées avec ``OR``. Un exemple d'ajout de conditions
avec une objet ``Expression`` serait::

    $query = $articles->find()
        ->where(function ($exp) {
            return $exp
                ->eq('author_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('view_count', 10);
        });

Puisque nous avons commencé à utiliser ``where()``, nous n'avons pas besoin
d'appeler ``and_()``, puisqu'elle est appelée implicitement. Un peu de la même
façon que nous n'appellerions pas ``or_()`` si nous avons commencé notre requête
avec ``orWhere()``. Le code ci-dessus montre quelques nouvelles méthodes de
conditions combinées avec ``AND``. Le code SQL résultant serait::

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count >= 10)

Cependant, si nous souhaitons utiliser les deux conditions ``AND`` & ``OR``,
nous pourrions faire ce qui suit::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->add($orConditions)
                ->eq('published', true)
                ->gte('view_count', 10);
        });

Ce qui générerait le code SQL suivant::

    SELECT *
    FROM articles
    WHERE (
    (author_id = 2 OR author_id = 5)
    AND published = 1
    AND view_count > 10)

Les méthodes ``or_()`` et ``and_()`` vous permettent aussi d'utiliser les
fonctions en paramètres. C'est souvent plus facile à lire que les méthodes
chaînées::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(function ($or) {
                return $or->eq('author_id', 2)
                    ->eq('author_id', 5);
            });
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

Vous pouvez faire une négation des sous-expressions en utilisant ``not()``::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

Ce qui générerait le code SQL suivant::

    SELECT *
    FROM articles
    WHERE (
    NOT (author_id = 2 OR author_id = 5)
    AND view_count <= 10)

Il est aussi possible de construire les expressions en utilisant les fonctions
SQL::

    $query = $articles->find()
        ->where(function ($exp, $q) {
            $year = $q->func()->year([
                'created' => 'identifier'
            ]);
            return $exp
                ->gte($year, 2014)
                ->eq('published', true);
        });

Ce qui générerait le code SQL suivant::

    SELECT *
    FROM articles
    WHERE (
    YEAR(created) >= 2014
    AND published = 1
    )


Quand vous utilisez les objets expression, vous pouvez utiliser les méthodes
suivantes pour créer des conditions:

- ``eq()`` Crée une condition d'égalité::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->eq('population', '10000');
        });
    # WHERE population = 10000

- ``notEq()`` Crée une condition d'inégalité::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notEq('population', '10000');
        });
    # WHERE population != 10000

- ``like()`` Crée une condition en utilisant l'opérateur ``LIKE``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->like('name', '%A%');
        });
    # WHERE name LIKE "%A%"

- ``notLike()`` Crée une condition négative de type ``LIKE``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notLike('name', '%A%');
        });
    # WHERE name NOT LIKE "%A%"

- ``in()`` Crée une condition en utilisant ``IN``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->in('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id IN ('AFG', 'USA', 'EST')

- ``notIn()`` Crée une condition négative en utilisant ``IN``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notIn('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id NOT IN ('AFG', 'USA', 'EST')

- ``gt()`` Crée une condition ``>``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->gt('population', '10000');
        });
    # WHERE population > 10000

- ``gte()`` Crée une condition ``>=``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->gte('population', '10000');
        });
    # WHERE population >= 10000

- ``lt()`` Crée une condition ``<``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->lt('population', '10000');
        });
    # WHERE population < 10000

- ``lte()`` Crée une condition ``<=``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->lte('population', '10000');
        });
    # WHERE population <= 10000

- ``isNull()`` Crée une condition ``IS NULL``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->isNull('population');
        });
    # WHERE (population) IS NULL

- ``isNotNull()`` Crée une condition négative ``IS NULL``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->isNotNull('population');
        });
    # WHERE (population) IS NOT NULL

- ``between()`` Crée une condition ``BETWEEN``::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->between('population', 999, 5000000);
        });
    # WHERE population BETWEEN 999 AND 5000000,

- ``exists()`` Crée une condition en utilisant ``EXISTS``::

    $subquery = $cities->find()
		->select(['id'])
        ->where(function ($exp, $q) {
			return $exp->equalFields('countries.id', 'cities.country_id');
        })
		->andWhere(['population >', 5000000]);

    $query = $countries->find()
        ->where(function ($exp, $q) use ($subquery) {
            return $exp->exists($subquery);
        });
    # WHERE EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)

- ``notExists()`` Crée une condition négative en utilisant ``EXISTS``::

    $subquery = $cities->find()
		->select(['id'])
        ->where(function ($exp, $q) {
			return $exp->equalFields('countries.id', 'cities.country_id');
        })
		->andWhere(['population >', 5000000]);

    $query = $countries->find()
        ->where(function ($exp, $q) use ($subquery) {
            return $exp->notExists($subquery);
        });
    # WHERE NOT EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)

Dans les cas où vous ne pouvez ou ne voulez pas utiliser les méthodes du
constructeur pour créer les conditions que vous voulez, vous pouvez utiliser du
code SQL dans des clauses where::

    // Compare deux champs l'un avec l'autre
    $query->where(['Categories.parent_id != Parents.id']);

.. warning::

    Les noms de champs utilisés dans les expressions et le code SQL ne doivent
    **jamais** contenir de contenu non fiable.
    Référez-vous à la section :ref:`using-sql-functions` pour savoir comment
    inclure des données non fiables de manière sécurisée dans vos appels de
    fonctions.

Créer automatiquement des Clauses IN
------------------------------------

Quand vous construisez des requêtes en utilisant l'ORM, vous n'avez
généralement pas besoin d'indiquer les types de données des colonnes avec
lesquelles vous interagissez, puisque CakePHP peut déduire les types en se
basant sur les données du schéma. Si dans vos requêtes, vous souhaitez que
CakePHP convertisse automatiquement l'égalité en comparaisons ``IN``, vous
devez indiquer les types de données des colonnes::

    $query = $articles->find()
        ->where(['id' => $ids], ['id' => 'integer[]']);

    // Or include IN to automatically cast to an array.
    $query = $articles->find()
        ->where(['id IN' => $ids]);

Ce qui est au-dessus va automatiquement créer ``id IN (...)`` plutôt que
``id = ?``. Ceci peut être utile quand vous ne savez pas si vous allez
récupérer un scalaire ou un tableau de paramètres. Le suffixe ``[]`` sur un
nom de type de données indique au constructeur de requête que vous souhaitez
que les données soient gérées en tableau. Si les données ne sont pas un tableau,
elles vont d'abord être converties en tableau. Après cela, chaque valeur dans
le tableau va être convertie en utilisant le
:ref:`système type <database-data-types>`. Ceci fonctionne aussi avec les types
complexes. Par exemple, vous pourriez prendre une liste d'objets DateTime
en utilisant::

    $query = $articles->find()
        ->where(['post_date' => $dates], ['post_date' => 'date[]']);

Création Automatique de IS NULL
-------------------------------

Quand une valeur d'une condition s'attend à être ``null`` ou tout autre valeur,
vous pouvez utiliser l'opérateur ``IS`` pour créer automatiquement la bonne
expression::

    $query = $categories->find()
        ->where(['parent_id IS' => $parentId]);


Ce qui précède va créer ``parent_id` = :c1`` ou ``parent_id IS NULL`` selon le
type de ``$parentId``.

Création Automatique de IS NOT NULL
-----------------------------------

Quand une valeur d'une condition s'attend à être ``null`` ou tout autre valeur,
vous pouvez utiliser l'opérateur ``IS NOT`` pour créer automatiquement la bonne
expression::

    $query = $categories->find()
        ->where(['parent_id IS NOT' => $parentId]);


Ce qui précède va créer ``parent_id` != :c1`` ou ``parent_id IS NOT NULL``
selon le type de ``$parentId``.

Raw Expressions
---------------

Quand vous ne pouvez pas construire le code SQL, vous devez utiliser le
constructeur de requête, vous pouvez utiliser les objets ``Expression`` pour
ajouter des extraits de code SQL à vos requêtes::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['two' => $expr]);

Les objets ``Expression`` peuvent être utilisés avec les méthodes du
constructeur de requête comme ``where()``, ``limit()``, ``group()``,
``select()`` et d'autres méthodes.

.. warning::

    Utiliser les objets ``Expression`` vous laisse vulnérable aux injections SQL.
    Vous devrez évitez d'interpoler les données d'utilisateur dans les
    expressions.

Récupérer les Résultats
=======================

Une fois que vous avez fait votre requête, vous voudrez récupérer des lignes
résultantes. Il y a plusieurs façons de faire ceci::

    // Itérer la requête
    foreach ($query as $row) {
        // Do stuff.
    }

    // Récupérer les résultats
    $results = $query->all();

Vous pouvez utiliser toutes les méthodes
:doc:`des Collections </core-libraries/collections>` sur vos objets
query pour traiter préalablement ou transformer les résultats::

    // Utilise une des méthodes collection.
    $ids = $query->map(function ($row) {
        return $row->id;
    });

    $maxAge = $query->max(function ($max) {
        return $max->age;
    });

Vous pouvez utiliser ``first()`` ou ``firstOrFail()`` pour récupérer un
enregistrement unique. Ces méthodes vont modifier la requête en ajoutant
une clause ``LIMIT 1``::

    // Récupère uniquement la première ligne
    $row = $query->first();

    // Récupère la première ligne ou une exception.
    $row = $query->firstOrFail();

.. _query-count:

Retourner le Nombre Total des Enregistrements
---------------------------------------------

En utilisant un objet query unique, il est possible d'obtenir le nombre total
de lignes trouvées pour un ensemble de conditions::

    $total = $articles->find()->where(['is_active' => true])->count();

La méthode ``count()`` va ignorer les clauses ``limit``, ``offset`` et ``page``,
donc ce qui suit va retourner les mêmes résultats::

    $total = $articles->find()->where(['is_active' => true])->limit(10)->count();

C'est utile quand vous avez besoin de savoir la taille totale de l'ensemble des
résultats en avance, sans avoir à construire un autre objet ``Query``. De cette
façon, tous les résultats formatés et les routines map-reduce sont ignorées
quand vous utilisez la méthode ``count()``.

De plus, il est possible de retourner le nombre total pour une requête contenant
des clauses group by sans avoir à réécrire la requête en aucune façon. Par
exemple, considérons la requête qui permet de récupérer les ids d'article et
leur nombre de commentaires::

    $query = $articles->find();
    $query->select(['Articles.id', $query->func()->count('Comments.id')])
        ->matching('Comments')
        ->group(['Articles.id']);
    $total = $query->count();

Après avoir compté, la requête peut toujours être utilisée pour récupérer les
enregistrements associés::

    $list = $query->all();

Parfois, vous voulez fournir une méthode alternative pour compter le nombre
total d'enregistrements d'une requête. Un cas d'utilisation courante pour ceci
est pour fournir une valeur mise en cache ou un nombre estimé total de lignes,
ou pour modifier la requête pour retirer les parties coûteuses non nécessaires
comme les left joins. Ceci devient particulièrement pratique quand vous utilisez
le système de pagination intégré à CakePHP qui appelle la méthode ``count()``::

    $query = $query->where(['is_active' => true])->counter(function ($query) {
        return 100000;
    });
    $query->count(); // Retourne 100000

Dans l'exemple ci-dessus, quand le component pagination appelle la méthode
count, elle va recevoir le nombre de lignes estimées écrit en dur.

.. _caching-query-results:

Mettre en Cache les Résultats Chargés
-------------------------------------

Quand vous récupérez les entities qui ne changent pas souvent, vous voudrez
peut-être mettre en cache les résultats. La classe ``Query`` facilite cela::

    $query->cache('recent_articles');

Va activer la mise en cache l'ensemble des résultats de la requête. Si un seul
argument est fourni à ``cache()`` alors la configuration du cache 'default'
va être utilisée. Vous pouvez contrôler la configuration du cache à utiliser
avec le deuxième paramètre::

    // Nom de la config.
    $query->cache('recent_articles', 'dbResults');

    // Instance de CacheEngine
    $query->cache('recent_articles', $memcache);

En plus de supporter les clés statiques, la méthode ``cache()`` accepte une
fonction pour générer la clé. La fonction que vous lui donnez, va recevoir la
requête en argument. Vous pouvez ensuite lire les aspects de la requête pour
générer dynamiquement la clé mise en cache::

    // Génère une clé basée sur un checksum simple
    // de la clause where de la requête
    $query->cache(function ($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

La méthode cache facilite l'ajout des résultats mis en cache à vos finders
personnalisés ou à travers des écouteurs d'évènement.

Quand les résultats pour une requête mise en cache sont récupérés, ce qui suit
va arriver:

1. L'évènement ``Model.beforeFind`` est déclenché.
2. Si la requête a des ensembles de résultats, ceux-ci vont être retournés.
3. La clé du cache va être déterminée et les données du cache vont être lues.
   Si les données du cache sont vides, ces résultats vont être retournés.
4. Si le cache n'est pas présent, la requête sera exécutée et un nouveau
   ``ResultSet`` sera créé. Ce ``ResultSet`` sera écrit dans le cache et sera
   retourné.

.. note::

    Vous ne pouvez pas mettre en cache un résultat de requête streaming.

Chargement des Associations
===========================

Le constructeur peut vous aider à retrouver les données de plusieurs tables en
même temps avec le minimum de requêtes. Pour pouvoir
récupérer les données associées, vous devez configurer les associations entre
les tables comme décrit dans la section :doc:`/orm/associations`. Cette
technique de requêtes combinées pour récupérer les données associées à partir
d'autres tables est appelé **eager loading**.

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-contain
    :end-before: end-contain

Filtering by Associated Data
----------------------------

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-filtering
    :end-before: end-filtering

.. _adding-joins:

Ajouter des Jointures
---------------------

En plus de charger les données liées avec ``contain()``, vous pouvez aussi
ajouter des jointures supplémentaires avec le constructeur de requête::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'table' => 'comments',
            'alias' => 'c',
            'type' => 'LEFT',
            'conditions' => 'c.article_id = articles.id',
        ]);

Vous pouvez ajouter plusieurs jointures en même temps en passant un tableau
associatif avec plusieurs ``join``::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => 'c.article_id = articles.id',
            ],
            'u' => [
                'table' => 'users',
                'type' => 'INNER',
                'conditions' => 'u.id = articles.user_id',
            ]
        ]);

Comme vu précédemment, lors de l'ajout de ``join``, l'alias peut être la clé du
tableau externe. Les conditions ``join`` peuvent être aussi exprimées en tableau
de conditions::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.created >' => new DateTime('-5 days'),
                    'c.moderated' => true,
                    'c.article_id = articles.id'
                ]
            ],
        ], ['c.created' => 'datetime', 'c.moderated' => 'boolean']);

Lors de la création de ``join`` à la main, et l'utilisation d'un tableau basé
sur les conditions, vous devez fournir les types de données pour chaque colonne
dans les conditions du ``join``. En fournissant les types de données pour les
conditions de ``join``, l'ORM peut convertir correctement les types de données
en code SQL. En plus de ``join()`` vous pouvez utiliser ``rightJoin()``,
``leftJoin()`` et ``innerJoin()`` pour créer les jointures::

    // Jointure avec un alias et des conditions
    $query = $articles->find();
    $query->leftJoin(
        ['Authors' => 'authors'],
        ['Authors.id = Articles.author_id']
    );

    // Jointure avec un alias, tableau de conditions, et de types
    $query = $articles->find();
    $query->innerJoin(
        ['Authors' => 'authors'],
        [
            'Authors.promoted' => true,
            'Authors.created' => new DateTime('-5 days'),
            'Authors.id = Articles.author_id'
        ],
        ['Authors.promoted' => 'boolean', 'Authors.created' => 'datetime']
    );

Notez que si vous définissez l'option ``quoteIdentifiers`` à ``true`` quand vous
configurez votre ``Connection``, les conditions mettant en relation deux champs
de tables différentes doivent être définies de cette manière::

    $query = $articles->find()
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.article_id' => new \Cake\Database\Expression\IdentifierExpression('articles.id')
                ]
            ],
        ]);

Cela permet de s'assurer que tous les ``identifiers`` sont bien quotés dans la
requête générée, permettant d'éviter des erreurs avec certains drivers
(PostgreSQL notamment).

Insérer des Données
===================

Au contraire des exemples précédents, vous ne devez pas utiliser ``find()`` pour
créer des requêtes d'insertion. A la place, créez un nouvel objet ``Query``
en utilisant ``query()``::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->execute();

Pour insérer plusieurs lignes en une seule requête, vous pouvez chaîner la
méthode ``values()`` autant de fois que nécessaire::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->values([
            'title' => 'Second post',
            'body' => 'Another body text'
        ])
        ->execute();

Généralement, il est plus facile d'insérer des données en utilisant les
entities et :php:meth:`~Cake\\ORM\\Table::save()`. En composant des requêtes
``SELECT`` et ``INSERT`` ensemble, vous pouvez créer des requêtes de style
``INSERT INTO ... SELECT``::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['title', 'body', 'published'])
        ->values($select)
        ->execute();

.. note::
    Ajouter des enregistrements avec le constructeur de requêtes ne va pas
    déclencher les events comme ``Model.afterSave``. À la place, vous pouvez
    utiliser :doc:`l'ORM pour sauvegardes les données </orm/saving-data>`.

.. _query-builder-updating-data:

Mettre à Jour les Données
=========================

Comme pour les requêtes d'insertion, vous ne devez pas utiliser ``find()`` pour
créer des requêtes de mise à jour. A la place, créez un nouvel objet ``Query``
en utilisant ``query()``::

    $query = $articles->query();
    $query->update()
        ->set(['published' => true])
        ->where(['id' => $id])
        ->execute();

Généralement, il est plus facile de mettre à jour des données en utilisant des
entities et :php:meth:`~Cake\\ORM\\Table::patchEntity()`.

.. note::
    Mettre à jour des enregistrements avec le constructeur de requêtes ne va pas
    déclencher les events comme ``Model.afterSave``. À la place, vous pouvez
    utiliser :doc:`l'ORM pour sauvegarder des données </orm/saving-data>`.

Suppression des Données
=======================

Comme pour les requêtes d'insertion, vous ne devez pas utiliser ``find()``
pour créer des requêtes de suppression. A la place, créez un nouvel objet de
requête en utilisant ``query()``::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

Généralement, il est plus facile de supprimer les données en utilisant les
entities et :php:meth:`~Cake\\ORM\\Table::delete()`.

Prévention contre les Injections SQL
====================================

Alors que l'ORM et les couches d'abstraction de base de données empêchent la
plupart des problèmes relatifs aux injections SQL, il est toujours possible que
vous soyez vulnérables face à une utilisation incorrecte. Lorsque vous utilisez
le constructeur de fonctions, les noms de colonnes ne doivent pas contenir de
données provenant d'utilisateurs::

    $query->where(function ($exp) use ($userData, $values) {
        // Les noms de colonnes dans toutes les expressions ne sont pas sûrs.
        return $exp->in($userData, $values);
    });

Lorsque vous construisez des expressions, les noms de fonctions ne doivent
jamais contenir de données provenant d'utilisateurs::

    // Non sécurisé.
    $query->func()->{$userData}($arg1);

    // L'utilisation d'un tableau de données utilisateurs
    // dans une fonction n'est également pas sécurisée
    $query->func()->coalesce($userData);

Les expressions brutes ne sont jamais sécurisées::

    $expr = $query->newExpr()->add($userData);
    $query->select(['two' => $expr]);

Plus de Requêtes Complexes
==========================

Le constructeur de requête est capable de construire des requêtes complexes
comme les requêtes ``UNION`` et sous-requêtes.

Unions
------

Les unions sont créées en composant une ou plusieurs requêtes select ensemble::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

Vous pouvez créer les requêtes ``UNION ALL`` en utilisant la méthode
``unionAll()``::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

Sous-Requêtes
-------------

Les sous-requêtes sont une fonctionnalité puissante dans les bases de données
relationnelles et les construire dans CakePHP est assez intuitif. En composant
les requêtes ensemble, vous pouvez faire des sous-requêtes::

    $matchingComment = $articles->association('Comments')->find()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id' => $matchingComment]);

Les sous-requêtes sont acceptées partout où une expression query peut être
utilisée. Par exemple, dans les méthodes ``select()`` et ``join()``.

Adding Locking Statements
-------------------------

Most relational database vendors support taking out locks when doing select
operations. You can use the ``epilog()`` method for this::

    // In MySQL
    $query->epilog('FOR UPDATE');

The ``epilog()`` method allows you to append raw SQL to the end of queries. You
should never put raw user data into ``epilog()``.

Exécuter des Requêtes Complexes
-------------------------------

Bien que le constructeur de requêtes facilite la construction de la plupart des
requêtes, les requêtes très complexes peuvent être fastidieuses et compliquées
à construire. Vous voudrez surement vous référer à :ref:`l'exécution
directe du SQL souhaité <running-select-statements>`.

Exécuter directement le SQL vous permet d'affiner la requête qui sera utilisée.
Cependant, cela vous empêchera d'utiliser ``contain`` ou toute autre
fonctionnalité de plus haut niveau de l'ORM.
