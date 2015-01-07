Query Builder
#############

.. php:namespace:: Cake\ORM

.. php:class:: Query

Le constructeur de requête de l'ORM fournit une interface facile à utiliser
pour créer et lancer les requêtes. En arrangeant les requêtes ensemble,
vous pouvez créer des requêtes avancées en utilisant les unions et les
sous-requêtes avec facilité.

Sous le capot, le constructeur de requête utilise les requêtes préparées de
PDO qui protègent contre les attaques d'injection SQL.

Les objets Query sont lazily evaluated. Cela signifie qu'une requête n'est
pas exécutée jusqu'à ce qu'une des prochaines actions se fasse:

- La requête est itérée avec ``foreach()``.
- La méthode ``execute()`` de query est appelée. Elle retourne l'objet
  d'instruction sous-jacente, et va être utilisée avec les requêtes
  insert/update/delete.
- La méthode ``first()`` de query est appelée. Elle retourne le premier résultat 
  correspondant à l'instruction ``SELECT`` (ajoute LIMIT 1 à la requête). 
- La méthode ``all()`` de query est appelée. Elle retourne l'ensemble de
  résultats et peut seulement être utilisée avec les instructions ``SELECT``.
- La méthode ``toArray()`` de query est appelée.

Jusqu'à ce qu'une de ces conditions ne soient rencontrées, la requête peut être
modifiée avec du SQL supplémentaire envoyé à la base de données. Cela signifie
que si une Query n'a pas été évaluée, aucun SQL ne sera jamais envoyé à la
base de données. Une fois exécutée, la modification et la ré-évaluation
d'une requête va entraîner l'exécution de SQL supplémentaire.

Si vous souhaitez jeter un oeil sur le SQL que CakePHP génère, vous pouvez
activer les :ref:`logs de requête <database-query-logging>` de la base de
données.

L'Objet Query
=============

La façon la plus simple de créer un objet ``Query`` est d'utiliser ``find()``
à partir d'un objet ``Table``. Cette méthode va retourner une requête
incomplète prête à être modifiée. Vous pouvez aussi utiliser un objet table
connection pour accéder au niveau inférieur du constructeur de Requête
qui n'inclut pas les fonctionnalités de l'ORM, si nécessaire. Consultez la
section :ref:`database-queries` pour plus d'informations. Pour les exemples
suivants, en supposant que ``$articles`` est une
:php:class:`~Cake\\ORM\\Table`::

    // Commence une nouvelle requête.
    $query = $articles->find();

Presque chaque méthode dans un objet ``Query`` va retourner la même requête, cela
signifie que les objets ``Query`` sont lazy, et ne seront pas exécutés à moins
que vous lui disiez de le faire::

    $query->where(['id' => 1]); // Retourne le même objet query
    $query->order(['title' => 'DESC']); // Toujours le même objet, aucun SQL exécuté

Vous pouvez bien sûr chainer les méthodes que vous appelez sur les objets Query::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

Si vous essayez d'appeler ``debug()`` sur un objet Query, vous verrez son état
interne et le SQL qui sera executé dans la base de données::

    debug($articles->find()->where(['id' => 1]));

    // Affiche
    // ...
    // 'sql' => 'SELECT * FROM articles where id = ?'
    // ...

Une fois que vous êtes satisfaits avec la Query, vous pouvez l'exécuter. La
façon la plus simple est de soit appeler la méthode ``first()``, soit la
méthode ``all()``::

    $firstArticle = $articles
        ->find()
        ->where(['id' => 1])
        ->first();

    $allResults = $articles
        ->find()
        ->where(['id >' => 1])
        ->all();

Dans l'exemple ci-dessus, ``$allResults`` sera une instance de
``Cake\ORM\ResultSet``, un objet que vous pouvez itérer et appliquer
plusieurs extractions et traverser les méthodes. Souvent, il n'y a pas besoin
d'appeler ``all()``, vous pouvez juste itérer l'objet Query pour récupérer
ses résultats::

    // Itére les résultats
    foreach ($allResults as $result) {
     ...
    }

    // Ceci est équivalent à
    $query = $articles->find()->where(['id' => 1]);
    foreach ($query as $result) {
     ...
    }

Les objets Query peuvent aussi être utilisés directement comme un objet
résultat; en essayant d'itérer la requête, appeler ``toArray`` ou une méthode
héritée de :ref:`Collection<collection-objects>`, cela va entraîner l'exécution
de la requête et les résultats vous seront retournés::

    // Ceci exécute la requête et retourne un tableau de résultats
    $resultsIntoAnArray = $articles->find()->where(['id >' => 1])->toArray();

    // Utilise la méthode combine() à partir de la librairie collections
    // This executes the query
    $keyValueList = $articles->find()->combine('id', 'title');

    // Utilise la méthode extract() à partir de la librairie collections
    // Ceci exécute aussi la requête
    $allTitles = $articles->find()->extract('title');

Une fois que vous êtes familié avec les méthodes de l'objet Query, il est
fortement recommandé que vous consultiez la section
:ref:`Collection<collection-objects>` pour améliorer vos compétences dans
le traversement efficace de données. En résumé, il est important de se
rappeler que tout ce que vous pouvez appeler sur un objet Collection, vous
pouvez aussi le faire avec un objet Query::

    // Un exemple avancé
    $results = $articles->find()
        ->where(['id >' => 1])
        ->order(['title' => 'DESC'])
        ->map(function ($row) { // map() est une méthode de collection, elle exécute la requête
            $row->trimmedTitle = trim($row->title);
            return $row;
        });
        ->combine('id', 'trimmedTitle') // combine() est une autre méthode de collection
        ->toArray(); // Aussi une méthode de la librairie collections

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

Pour définir certaines conditions basiques, vous pouvez utiliser avec la
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

Pour limiter le nombre de lignes ou définir la ligne offset, vous pouvez
utiliser les méthodes ``limit()`` et ``page()``::

    // Récupérer les lignes 50 à 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

Comme vous pouvez le voir sur les exemples précédents, toutes les méthodes
qui modifient la requête fournissent une interface fluide, vous permettant
de construire une requête avec des appels de méthode chaînés.

Utiliser les Fonctions SQL
--------------------------

L'ORM de CakePHP offre une abstraction pour les fonctions les plus communément
utilisées par SQL. Utiliser l'abstraction permet à l'ORM de sélectionner
l'intégration spécifique de la fonction pour la plateforme que vous souhaitez.
Par exemple, ``concat`` est intégré différemment dans MySQL, Postgres et
SQLServer. Utiliser l'abstraction permet à votre code d'être portable::

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

Quand vous fournissez des arguments pour les fonctions SQL, il y a deux types
de paramètres que vous pouvez utiliser; Les arguments littéraux et les
paramètres liés. Les paramètres liés vous permettent de référencer les colonnes
ou les autres valeurs littérales de SQL. Les paramètres liés peuvent être
utilisés pour ajouter en toute sécurité les données d'utilisateur aux fonctions
SQL. Par exemple::

    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'literal',
        ' NEW'
    ]);
    $query->select(['title' => $concat]);

En modifiant les arguments avec une valeur de ``literal``, l'ORM va savoir que
la clé doit être traitée comme une valeur SQL littérale. Le code ci-dessus
génèrera le code SQL suivant en MySQL::

    SELECT CONCAT(title, :c0) FROM articles;

La valeur ``:c0`` aura le texte ``' NEW'`` lié quand la requête est exécutée.

En plus des fonctions ci-dessus, la méthode ``func()`` peut être utilisée pour
créer toute fonction générique SQL comme ``year``, ``date_format``,
``convert``, etc... Par exemple::

    $query = $articles->find();
    $year = $query->func()->year([
        'created' => 'literal'
    ]);
    $time = $query->func()->date_format([
        'created' => 'literal',
        "'%H:%i'" => 'literal'
    ]);
    $query->select([
        'yearCreated' => $year,
        'timeCreated' => $time
    ]);

Entrainera::

    SELECT YEAR(created) as yearCreated, DATE_FORMAT(created, '%H:%i') as timeCreated FROM articles;

Regroupements - Group et Having
-------------------------------

Quand vous utilisez les fonctions d'aggrégation comme ``count`` et ``sum``, vous
pouvez utiliser les clauses ``group by`` et ``having``::

    $query = $articles->find();
    $query->select([
        'count' => $query->func()->count('view_count'),
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Désactiver l'Hydration
----------------------

Alors que les ensembles de résultats en objet de l'ORM sont puissants,
l'hydratation des entities n'est parfois pas nécessaire. Par exemple, quand
vous accédez aux données aggrégées, la construction d'une Entity peut ne pas
être utile. Dans ces situations, vous pouvez désactiver l'hydratation d'une
entity::

    $query = $articles->find();
    $query->hydrate(false);

.. note::

    Quand l'hydration est désactivée, les résultats seront retournés en
    tableaux basiques.

Instructions Case
-----------------

L'ORM offre également l'expression SQL ``case``. L'expression ``case`` permet
l'implémentation d'une logique ``if ... then ... else`` dans votre SQL. Cela
peut être utile pour créer des rapports sur des données que vous avez besoin
d'additionner ou de compter conditionnellement, ou si vous avez besoin de données
spécifiques basées sur une condition.

Si vous vouliez savoir combien d'articles sont publiés dans notre base de
données, vous auriez besoin de générer le SQL suivant::

    SELECT SUM(CASE published = 'Y' THEN 1 ELSE 0) AS number_published, SUM(CASE published = 'N' THEN 1 ELSE 0) AS number_unpublished
    FROM articles GROUP BY published

Pour faire ceci avec le générateur de requêtes , vous utiliseriez le code suivant::

    $query = $articles->find();
    $publishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'Y']), 1, 'integer');
    $notPublishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'N']), 1, 'integer');

    $query->select([
        'number_published' => $query->func()->sum($publishedCase),
        'number_unpublished' => $query->func()->sum($unpublishedCase)
    ])
    ->group('published');

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
vous pouvez facilement organiser ensemble les conditions avec les objets
expression::

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
``$exp->or_()`` va créer un nouvel objet ``Expression`` qui combine toutes
les conditions qui lui sont ajoutées avec ``OR``. Un exemple d'ajout de
conditions avec une objet ``Expression`` serait::

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
avec ``orWhere()``. Le code ci-dessus montre quelques nouvelles méthodes
de conditions combinées avec ``AND``. Le code SQL résultant serait::

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10)

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
                'created' => 'literal'
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

- ``eq()`` Créé une condition d'égalité.
- ``notEq()`` Créé une condition d'inégalité
- ``like()`` Créé une condition en utilisant l'opérateur ``LIKE``.
- ``notLike()`` Créé une condition négative ``LIKE``.
- ``in()`` Créé une condition en utilisant ``IN``.
- ``notIn()`` Créé une condition négative en utilisant ``IN``.
- ``gt()`` Créé une condition ``>``.
- ``gte()`` Créé une condition ``>=``.
- ``lt()`` Créé une condition ``<``.
- ``lte()`` Créé une condition ``<=``.
- ``isNull()`` Créé une condition ``IS NULL``.
- ``isNotNull()`` Créé une condition négative ``IS NULL``.

Créer automatiquement des Clauses IN
------------------------------------

Quand vous construisez des requêtes en utilisant l'ORM, vous n'avez
généralement pas besoin d'indiquer les types de données des colonnes avec
lesquelles vous intéragissez, puisque CakePHP peut déduire les types en se
basant sur les données du :ref:`schéma <namespace-Cake\Database\Schema>`. 
Si dans vos requêtes, vous souhaitez que
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
constructeur de requête, vous pouvez utiliser les objets ``Expression`` pour ajouter
des extraits de code SQL à vos requêtes::

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

Vous pouvez utiliser les méthodes
:doc:`any of the collection </core-libraries/collections>` sur vos objets
query pour traiter préalablement ou transformer les résultats::

    // Utilise une des méthodes collection.
    $ids = $query->map(function ($row) {
        return $row->id;
    });

    $maxAge = $query->max(function ($row) {
        return $max->age;
    });

Vous pouvez utiliser ``first`` ou ``firstOrFail`` pour récupérer un
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
ou pour modifier la requête pour retirer les parties couteuses non nécessaires
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
personnalisés ou à travers des écouteurs d'événement.

Quand les résultats pour une requête mise en cache sont récupérés, ce qui suit
va arriver:

1. L'événement ``Model.beforeFind`` est déclenché.
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

Comme vu précédemment, lors de l'ajout de ``join``, l'alias peut être la clé du tableau
externe. Les conditions ``join`` peuvent être aussi exprimées en tableau de
conditions::

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
        ], ['a.created' => 'datetime', 'c.moderated' => 'boolean']);

Lors de la création de ``join`` à la main, et l'utilisation d'un tableau basé
sur les conditions, vous devez fournir les types de données pour chaque colonne
dans les conditions du ``join``. En fournissant les types de données pour les
conditions de ``join``, l'ORM peut convertir correctement les types de données en
code SQL.

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

Généralement, il est plus facile d'insérer des données en utilisant les
entities et :php:meth:`~Cake\\ORM\\Table::save()`. En composant des requêtes
``SELECT`` et ``INSERT`` ensemble, vous pouvez créer des requêtes de style
``INSERT INTO ... SELECT`` ::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['title', 'body', 'published'])
        ->values($select)
        ->execute();

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
``unionAll``::

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
facilement calculer leur âge avec le formatteur de résultats::

    // En supposant que nous avons construit les champs, les conditions et les contain.
    $query->formatResults(function (\Cake\Datasource\ResultSetInterface $results, \Cake\Database\Query $query) {
        return $results->map(function ($row) {
            $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
            return $row;
        });
    });

Comme vous pouvez le voir dans l'exemple ci-dessus, les callbacks de formattage
récupéreront un ``ResultSetDecorator`` en premier argument. Le second argument
sera l'instance Query sur laquelle le formatteur a été attaché. L'argument
``$results`` peut être traversé et modifié autant que nécessaire.

Les formatteurs de résultat sont nécessaires pour retourner un objet itérateur,
qui sera utilisé comme valeur retournée pour la requête. Les fonctions de
formatteurs sont appliquées après que toutes les routines
Map/Reduce soient exécutées. Les formatteurs de résultat peuvent aussi être
appliqués dans les associations ``contain``. CakePHP va s'assurer que vos
formatteurs sont bien scopés. Par exemple, faire ce qui suit fonctionnera
comme vous pouvez vous y attendre::

    // Dans une méthode dans la table Articles
    $query->contain(['Authors' => function ($q) {
        return $q->formatResults(function ($authors) {
            return $authors->map(function ($author) {
                $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
                return $author;
            });
        });
    });

    // Récupère les résultats
    $results = $query->all();

    // Affiche 29
    echo $results->first()->author->age;

Comme vu précédemment, les formatteurs attachés aux constructeurs de requête
associées sont limités pour agir seulement sur les données dans l'association.
CakePHP va s'assurer que les valeurs calculées soient insérées dans la bonne
``entity``.

.. _map-reduce:

Modifier les Résultats avec Map/Reduce
======================================

La plupart du temps, les opérations ``find`` nécessitent un traitement postérieur
des données qui se trouvent dans la base de données. Alors que les méthodes
``getter`` des ``entities`` peuvent s'occuper de la plupart de la génération de
propriété virtuelle ou un formattage de données spéciales, parfois vous devez
changer la structure des données d'une façon plus fondamentale.

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
``emitIntermediate()`` sur l'instance ``MapReduce``. La méthode stocke
l'article dans la liste des articles avec pour label soit publié (published)
ou non publié (unpublished).

La prochaine étape dans le processus de map-reduce  est de consolider les
résultats finaux. Pour chaque statut créé dans le mapper, la fonction
``$reducer`` va être appelée donc vous pouvez faire des traitements
supplémentaires. Cette fonction va recevoir la liste des articles dans un
``bucket`` particulier en premier paramètre, le nom du ``bucket`` dont il a
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
mutuellement. Commençons avec notre fonction ``mapper``::

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
immédiatemment. L'opération va être enregistrée pour être lancée dès que
l'on tentera de réucpérer le premier résultat.
Ceci vous permet de continuer à chainer les méthodes et les filtres
à la requête même après avoir ajouté une routine map-reduce::

   $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // Plus loin dans votre app:
    $query->where(['created >=' => new DateTime('1 day ago')]);

C'est particulièrement utile pour construire des méthodes finder personnalisées
 comme décrit dans la section :ref:`custom-find-methods`::

    public function findPublished(Query $query, array $options]) {
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

Dans les mêmes circonstances vous voulez modifier un objer ``Query`` pour
que les opérations ``mapReduce`` ne soient pas exécutées du tout. Ceci peut
être facilement fait en appelant la méthode avec les deux paramètres à
null et le troisième paramètre (overwrite) à ``true``::

    $query->mapReduce(null, null, true);
