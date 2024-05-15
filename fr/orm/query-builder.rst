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
prête à être modifiée. Vous pouvez aussi utiliser un objet de connexion à une
table pour accéder à un constructeur de requête de plus bas niveau qui n'inclut
pas les fonctionnalités de l'ORM, si nécessaire. Consultez la section
:ref:`database-queries` pour plus d'informations::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articles = $this->getTableLocator()->get('Articles');

    // Commence une nouvelle requête.
    $query = $articles->find();

Depuis un controller, vous pouvez utiliser la variable de table créée
automatiquement par le système de conventions::

    // À l'intérieur de ArticlesController.php

    $query = $this->Articles->find();

Récupérer les Lignes d'une Table
--------------------------------

::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $query = $this->getTableLocator()->get('Articles')->find();

    foreach ($query->all() as $article) {
        debug($article->title);
    }

Pour les exemples restants, imaginez que ``$articles`` est une
:php:class:`~Cake\\ORM\\Table`. Quand vous êtes dans des controllers, vous
pouvez utiliser ``$this->Articles`` plutôt que ``$articles``.

Presque toutes les méthodes d'un objet ``Query`` retournent la requête
elle-même.
cela signifie que les objets ``Query`` sont lazy, et ne seront pas exécutés à
moins que vous ne lui disiez de le faire::

    $query->where(['id' => 1]); // Retourne le même objet query
    $query->order(['title' => 'DESC']); // Toujours le même objet, aucun SQL exécuté

Vous pouvez bien sûr chainer les méthodes que vous appelez sur les objets
Query::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

    foreach ($query->all() as $article) {
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
        ->all()
        ->toList();

    foreach ($resultsArray as $article) {
        debug($article->id);
    }

    debug($resultsArray[0]->title);

Dans l'exemple ci-dessus, ``$resultsIteratorObject`` sera une instance de
``Cake\ORM\ResultSet``, un objet que vous pouvez itérer et sur lequel vous
pouvez appliquer plusieurs méthodes d'extraction ou de traversée.

Souvent, il n'y a pas besoin d'appeler ``all()``, vous pouvez juste itérer
l'objet Query pour récupérer ses résultats. les objets Query peuvent également
être utilisés directement en tant qu'objet résultat. Essayer d'itérer la requête
en utilisant ``toList()`` ou n'importe qu'elle méthode héritée de
:doc:`Collection </core-libraries/collections>`, provoquera l'exécution
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
    $allTitles = $articles->find()->all()->extract('title');

    foreach ($allTitles as $title) {
        echo $title;
    }

Vous pouvez aussi récupérer une liste de clés-valeurs à partir du résultat d'une
requête::

    $list = $articles->find('list')->all();
    foreach ($list as $id => $title) {
        echo "$id : $title"
    }

Pour plus d'informations sur la façon de personnaliser les champs utilisés pour
remplir la liste, consultez la section :ref:`table-find-list`.

Les Requêtes sont des Objets Collection
---------------------------------------

Une fois que vous êtes familier avec les méthodes de l'objet Query, il est
fortement recommandé de consulter la section
:doc:`Collection </core-libraries/collections>` pour améliorer vos compétences
sur une traversée efficace des données. En résumé, il est important de se
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

Les objets Query sont évalués paresseusement (*lazily*). Cela signifie qu'une
requête n'est pas exécutée jusqu'à ce qu'une des actions suivantes soit lancée:

- La requête est itérée avec ``foreach()``.
- La méthode ``execute()`` est appelée. Elle retourne l'objet d'instruction
  (*statement*) sous-jacent, et est faite pour être utilisée avec les requêtes
  insert/update/delete.
- La méthode ``first()`` est appelée. Elle retourne le premier résultat
  correspondant à l'instruction ``SELECT`` (elle ajoute ``LIMIT 1`` à la
  requête).
- La méthode ``all()`` est appelée. Elle retourne l'ensemble des résultats et
  peut seulement être utilisée avec les instructions ``SELECT``.
- La méthode ``toList()`` ou ``toArray()`` est appelée.

Tant qu'aucune de ces conditions n'est rencontrée, la requête peut être
modifiée sans qu'aucun nouveau code SQL ne soit envoyé à la base de données.
Cela signifie aussi que si une Query n'a pas été évaluée, aucun SQL ne sera
envoyé à la base de données. Une fois exécutée, la modification suivie de la
ré-évaluation de la requête va entraîner l'exécution du SQL supplémentaire. Si
une requête est exécutée plusieurs fois d'affilée sans avoir été modifiée
entre-temps, elle renvoie la même référence.

Si vous souhaitez jeter un œil sur le SQL que CakePHP génère, vous pouvez
activer les :ref:`logs de requête <database-query-logging>`.

Récupérer vos Données
=====================
CakePHP permet de construire simplement des requêtes ``SELECT``. La
méthode ``select()`` vous permet de ne récupérer que les champs qui vous sont
nécessaires::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query->all() as $row) {
        debug($row->title);
    }

Vous pouvez également définir des alias pour vos champs en les définissant dans
un tableau associatif::

    // Génère SELECT id AS pk, titre AS alias_de_titre, contenu ...
    $query = $articles->find();
    $query->select(['pk' => 'id', 'alias_de_titre' => 'titre', 'contenu']);

Pour sélectionner les valeurs distinctes dans des champs, vous pouvez utiliser
la méthode ``distinct()``::

    // Génère SELECT DISTINCT pays FROM ...
    $query = $articles->find();
    $query->select(['pays'])
        ->distinct(['pays']);

Pour définir certaines conditions basiques, vous pouvez utiliser la
méthode ``where()``::

    // Les conditions sont combinées par défaut avec AND
    $query = $articles->find();
    $query->where(['titre' => 'Premier Post', 'published' => true]);

    // Vous pouvez aussi appeler where() plusieurs fois
    $query = $articles->find();
    $query->where(['titre' => 'Premier Post'])
        ->where(['published' => true]);

Vous pouvez aussi passer une fonction anonyme à la méthode ``where()``. La
fonction anonyme recevra une instance de
``\Cake\Database\Expression\QueryExpression`` en premier argument, et
``\Cake\ORM\Query`` pour le second::

    $query = $articles->find();
    $query->where(function (QueryExpression $exp, Query $q) {
        return $exp->eq('published', true);
    });

Consultez la section :ref:`advanced-query-conditions` pour voir comment
construire des conditions ``WHERE`` plus complexes.

Sélectionner Certains Champs d'une Table
----------------------------------------

    // Sélectionne seulement id et titre dans la table articles
    $articles->find()->select(['id', 'titre']);

Si vous souhaitez sélectionner à nouveau tous les champs d'une table après avoir
appelé ``select($fields)``, vous pouvez passer l'instance de table à
``select()``::

    // Sélectionne tous les champs de la table articles
    // ainsi qu'un champ calculé slug
    $query = $articlesTable->find();
    $query
        ->select(['slug' => $query->func()->concat(['titre' => 'identifier', '-', 'id' => 'identifier'])])
        ->select($articlesTable); // Sélectionne tous les champs de articles

Si vous souhaitez sélectionner tous les champs d'une table sauf quelques-uns,
vous pouvez utiliser ``selectAllExcept()``::

    $query = $articlesTable->find();

    // Obtenir tous les champs sauf le champ published
    $query->selectAllExcept($articlesTable, ['published']);

Vous pouvez aussi passer un objet ``Association`` quand vous travaillez avec des
associations.

.. _using-sql-functions:

Utiliser les Fonctions SQL
--------------------------

L'ORM de CakePHP offre une abstraction pour les fonctions SQL les plus
communément utilisées. Cette abstraction permet à l'ORM de sélectionner
l'implémentation de la fonction voulue spécifique à la plateforme.
Par exemple, ``concat`` est implémentée différemment dans MySQL, PostgreSQL et
SQL Server. L'abstraction permet à votre code d'être portable::

    // Génère SELECT COUNT(*) count FROM ...
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

Notez que la plupart des fonctions acceptent un argument supplémentaire pour
spécifier le type de données à lier aux arguments et/ou le type de la valeur à
retourner, par exemple::

    $query->select(['minDate' => $query->func()->min('date', ['date']);

Pour plus de détails, lisez la documentation de
:php:class:`Cake\\Database\\FunctionsBuilder`.

Vous pouvez accéder aux *wrappers* existants de plusieurs fonctions SQL grâce à
``Query::func()``:

``rand()``
    Génère un nombre aléatoire entre 0 et 1 via SQL.
``sum()``
    Calcule une somme. `Les arguments sont considérés comme des valeurs
    littérales.`
``avg()``
    Calcule une moyenne. `Les arguments sont considérés comme des valeurs
    littérales.`
``min()``
    Calcule le minimum d'une colonne. `Les arguments sont considérés comme des
    valeurs littérales.`
``max()``
    Calcule le maximum d'une colonne. `Les arguments sont considérés comme des
    valeurs littérales.`
``count()``
    Calcule le nombre de valeurs. `Les arguments sont considérés comme des
    valeurs littérales.`
``concat()``
    Concatène deux valeurs. `Les arguments sont considérés comme des paramètres
    liés.`
``coalesce()``
    Renvoie la première expression dont la valeur n'est pas NULL. `Les arguments
    sont considérés comme des paramètres liés.`
``dateDiff()``
    Récupère la différence entre deux dates/heures. `Les arguments sont
    considérés comme des paramètres liés.`
``now()``
    Renvoie la date et l'heure courantes par défaut, mais accepte 'time' ou
    'date' comme argument pour récupérer seulement l'heure ou la date courante.
``extract()``
    Renvoie une partie de la date spécifiée dans une expression SQL.
``dateAdd()``
    Ajoute une unité de temps à l'expression de date.
``dayOfWeek()``
    Renvoie une FunctionExpression représentant un appel à la fonction SQL
    WEEKDAY.

Fonctions de fenêtrage
^^^^^^^^^^^^^^^^^^^^^^

Ces fonctions de fenêtrage (*window-only*) contiennent une expression de
fenêtrage par défaut:

``rowNumber()``
    Renvoie une expression Aggregate pour la fonction SQL ``ROW_NUMBER()``.
``lag()``
    Renvoie une expression Aggregate pour la fonction SQL ``LAG()``.
``lead()``
    Renvoie une expression Aggregate pour la fonction SQL ``LEAD()``.

Quand vous fournissez des arguments pour les fonctions SQL, il y a deux types de
paramètres que vous pouvez utiliser: les arguments littéraux et les paramètres
liés. Les paramètres d'identification/littéraux vous permettent de référencer
les colonnes ou d'autres valeurs littérales en SQL. Les paramètres liés peuvent
être utilisés pour ajouter en toute sécurité les données utilisateur aux
fonctions SQL. Par exemple::

    $query = $articles->find()->innerJoinWith('Categories');
    $concat = $query->func()->concat([
        'Articles.title' => 'identifier',
        ' - CAT: ',
        'Categories.name' => 'identifier',
        ' - Age: ',
        $query->func()->dateDiff([
            'NOW()' => 'literal',
            'Articles.created' => 'identifier'
        ])
    ]);
    $query->select(['link_title' => $concat]);

Vous pouvez faire référence à d'autres colonnes ou expressions SQL littérales
aussi bien avec ``literal`` qu'avec ``identifier``, cependant ``identifier``
ajoutera des quotes dans les cas appropriés si l'auto-quoting a été activé. Les
arguments qui ne sont pas marqués comme *literal* ni *identifier* seront
utilisés comme des paramètres liés, qui serviront à passer des données
utilisateur à la fonction. Le code ci-dessus va générer le SQL suivant sur
MySQL:

.. code-block:: mysql

    SELECT CONCAT(
        Articles.title,
        :c0,
        Categories.name,
        :c1,
        (DATEDIFF(NOW(), Articles.created))
    ) FROM articles;

La valeur ``:c0`` aura le texte ``' - CAT:'`` lié quand la requête est exécutée.
L'expression ``datediff`` a été transcrite en SQL de façon appropriée.

Fonctions Personnalisées
^^^^^^^^^^^^^^^^^^^^^^^^

Si ``func()`` ne propose pas déjà un *wrap* de la fonction SQL dont vous avez
besoin, vous pouvez l'appeler directement à travers ``func()`` et passer des
arguments et des données utilisateur en toute sécurité comme décrit ci-dessus.
Assurez-vous de passer les bons types d'arguments aux fonctions personnalisées,
sans quoi ils seront traités comme des paramètres liés::

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

Entraînera:

.. code-block:: mysql

    SELECT YEAR(created) as yearCreated,
           DATE_FORMAT(created, '%H:%i') as timeCreated
    FROM articles;

.. note::
    Utilisez ``func()`` pour passer des données externes (non fiables) à
    n'importe quelle fonction SQL.

Trier les résultats
-------------------

Pour appliquer un tri, vous pouvez utiliser la méthode ``order``::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

Si vous appelez ``order()`` plusieurs fois sur la même requête, les clauses
s'ajouteront les unes aux autres. Néanmoins, quand vous utiliserez les finders,
vous aurez parfois besoin de remplacer la clause ``ORDER BY`` déjà définie.
Passez ``Query::OVERWRITE`` ou ``true`` au second paramètre de ``order()`` (idem
pour ``orderAsc()`` ou ``orderDesc()``)::

    $query = $articles->find()
        ->order(['title' => 'ASC']);
    // Plus tard, remplacez la clause ORDER BY au lieu de la compléter.
    $query = $articles->find()
        ->order(['created' => 'DESC'], Query::OVERWRITE);

Vous pouvez utiliser les méthodes ``orderAsc`` et ``orderDesc`` pour trier selon
des expressions complexes::

    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'identifier',
        'synopsis' => 'identifier'
    ]);
    $query->orderAsc($concat);

Pour construire des clauses de tri complexes, utilisez une Closure::

    $query->orderAsc(function (QueryExpression $exp, Query $query) {
        return $exp->addCase(/* ... */);
     });

Limiter les Résultats
---------------------

Pour limiter le nombre de lignes, ou définir un offset, utilisez les méthodes
``limit()`` et ``page()``::

    // Récupérer les lignes 50 à 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

Comme vous pouvez le voir sur cet exemple, toutes les méthodes qui modifient la
requête proposent une interface fluide, vous permettant de construire une
requête par l'appel de méthodes chaînées.

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
données, nous pourrions utiliser le SQL suivant:

.. code-block:: sql

    SELECT
    COUNT(CASE WHEN published = 'Y' THEN 1 END) AS number_published,
    COUNT(CASE WHEN published = 'N' THEN 1 END) AS number_unpublished
    FROM articles

Pour faire ceci avec le générateur de requêtes, vous utiliseriez le code
suivant::

    $query = $articles->find();
    $publishedCase = $query->newExpr()
        ->case()
        ->when(['published' => 'Y'])
        ->then(1);
    $unpublishedCase = $query->newExpr()
        ->case()
        ->when(['published' => 'N'])
        ->then(1);

    $query->select([
        'number_published' => $query->func()->count($publishedCase),
        'number_unpublished' => $query->func()->count($unpublishedCase)
    ]);

La méthode ``when()`` accepte des extraits de code SQL, des conditions en
tableau, et des ``Closure`` pour les situations où vous avez besoin d'une
logique supplémentaire pour construire les cas. Si nous souhaitions classer des
villes selon des tailles de population PETITE, MOYENNE, ou GRANDE, nous
pourrions le faire ainsi::

    $query = $cities->find();
    $sizing = $query->newExpr()->case()
        ->when(['population <' => 100000])
        ->then('PETITE')
        ->when($query->newExpr()->between('population', 100000, 999000))
        ->then('MOYENNE')
        ->when(['population >=' => 999001])
        ->then('GRANDE');
    $query = $query->select(['size' => $sizing]);
    # SELECT CASE
    #   WHEN population < 100000 THEN 'PETITE'
    #   WHEN population BETWEEN 100000 AND 999000 THEN 'MOYENNE'
    #   WHEN population >= 999001 THEN 'GRANDE'
    #   END AS size

Il faut que vous fassiez attention lorsque vous incluez dans des expression
*case* des données fournies par l'utilisateur, car cela peut créer des
vulnérabilités aux injections SQL::

    // Non sécurisé. *Ne pas* utiliser
    $case->when($requestData['published']);

    // Au lieu de cela, passez les données utilisateur en valeurs dans un
    // tableau de conditions
    $case->when(['published' => $requestData['published']]);

Pour des scénarios plus complexes, vous pouvez utiliser les objets
``QueryExpression`` et les valeurs liées::

    $userValue = $query->newExpr()
        ->case()
        ->when($query->newExpr('population >= :userData'))
        ->then(123, 'integer');

    $query->select(['val' => $userValue])
        ->bind(':userData', $requestData['value'], 'integer');

L'utilisation des valeurs liées permet d'insérer des données utilisateur en
toute sécurité dans des bouts de code SQL bruts complexes. ``then()``,
``when()`` et ``else()`` essayeront de deviner le type de valeur en se basant
sur le type de paramètre. Si vous avez besoin de lier une valeur d'un type
différent, vous pouvez déclarer le type souhaité::

    $case->when(['published' => true])->then('1', 'integer');

Vous pouvez créer des conditions ``if ... then ... else`` en utilisant
``else()``::

    $published = $query->newExpr()
        ->case()
        ->when(['published' => true])
        ->then('Y');
        ->else('N');

    # CASE WHEN published = true THEN 'Y' ELSE 'N' END;

Il est également possible créer une variable simple en passant une valeur à
``case()``:

    $published = $query->newExpr()
        ->case($query->identifier('published'))
        ->when(true)
        ->then('Y');
        ->else('N');

   # CASE published WHEN true THEN 'Y' ELSE 'N' END;

Avant 4.3.0, vous deviez utiliser::

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

Si nous souhaitions classer des villes selon des tailles de population PETITE,
MOYENNE, ou GRANDE, nous pourrions le faire ainsi::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->lt('population', 100000),
                    $q->newExpr()->between('population', 100000, 999000),
                    $q->newExpr()->gte('population', 999001),
                ],
                ['PETITE',  'MOYENNE', 'GRANDE'], # valeurs correspondant aux conditions
                ['string', 'string', 'string']    # type de chaque valeur
            );
        });
    # WHERE CASE
    #   WHEN population < 100000 THEN 'PETITE'
    #   WHEN population BETWEEN 100000 AND 999000 THEN 'MOYENNE'
    #   WHEN population >= 999001 THEN 'GRANDE'
    #   END

S'il y a moins de conditions que de valeurs, ``addCase``
va automatiquement produire une instruction ``if .. then .. else``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->eq('population', 0),
                ],
                ['DESERTE', 'INHABITEE'], # valeurs correspondant aux conditions
                ['string', 'string']      # type de chaque valeur
            );
        });
    # WHERE CASE
    #   WHEN population = 0 THEN 'DESERTE' ELSE 'INHABITEE' END

Récupérer des Tableaux plutôt que des Entities
----------------------------------------------

Bien que les ensembles de résultats en objet de l'ORM soient puissants, créer
des entities est parfois superflu. Par exemple, quand vous accédez à des
données agrégées, la construction d'une Entity n'a pas vraiment de sens. Le
processus de conversion des résultats de la base de données en entities est
appelé hydratation. Si vous souhaitez désactiver ce processus, vous pouvez
faire ceci::

    $query = $articles->find();
    $query->enableHydration(false); // Résultats en tableaux plutôt qu'en entities
    $result = $query->toList(); // Exécute la requête et retourne le tableau

Après avoir exécuté ces lignes, votre résultat devrait ressembler à quelque
chose comme ceci::

    [
        ['id' => 1, 'title' => 'Premier Article', 'body' => 'Corps de l\'article 1' ...],
        ['id' => 2, 'title' => 'Deuxième Article', 'body' => 'Corps de l\'article 2' ...],
        ...
    ]

.. _format-results:

Ajouter des Champs Calculés
===========================

Après vos requêtes, vous aurez peut-être besoin de faire des traitements
postérieurs. Si vous voulez ajouter quelques champs calculés ou des données
dérivées, vous pouvez utiliser la méthode ``formatResults()``. C'est une
façon légère d'appliquer une fonction sur les ensembles de résultats. Si vous
avez besoin de plus de contrôle sur le processus, ou si vous souhaitez réduire
les résultats, vous devriez plutôt utiliser la fonctionnalité de
:ref:`Map/Reduce <map-reduce>`. Si vous requêtiez sur une liste de personnes,
vous pourriez calculer leur âge avec un formateur de résultats (*result
formatter*)::

    // En supposant que nous avons construit les champs, les conditions et les contain.
    $query->formatResults(function (\Cake\Collection\CollectionInterface $results) {
        return $results->map(function ($row) {
            $row['age'] = $row['date_de_naissance']->diff(new \DateTime)->y;

            return $row;
        });
    });

Comme vous pouvez le voir dans cet exemple, les callbacks de formatage
récupéreront un ``ResultSetDecorator`` en premier argument. Le second argument
sera l'instance Query sur laquelle le formateur a été attaché. L'argument
``$results`` peut être traversé et modifié autant que nécessaire.

Les formateurs de résultat deivent retourner un objet itérateur,
qui sera utilisé comme valeur retournée pour la requête. Les fonctions de
formatage sont appliquées après que toutes les routines Map/Reduce auront été
exécutées. Les formateurs de résultat peuvent aussi être
appliqués depuis des associations ``contain``. CakePHP va s'assurer que vos
formateurs s'appliquent au bon périmètre. Par exemple, ceci fonctionnera
comme vous pouvez vous y attendre::

    // Dans une méthode dans la table Articles
    $query->contain(['Auteurs' => function ($q) {
        return $q->formatResults(function (\Cake\Collection\CollectionInterface $auteurs) {
            return $auteurs->map(function ($auteur) {
                $auteur['age'] = $auteur['date_de_naissance']->diff(new \DateTime)->y;

                return $auteur;
            });
        });
    }]);

    // Récupère les résultats
    $results = $query->all();

    // Affiche 29
    echo $results->first()->auteur->age;

Comme vu précédemment, les formateurs attachés aux constructeurs de requête
associées sont limités pour agir seulement sur les données de l'association.
CakePHP va s'assurer que les valeurs calculées soient insérées dans la bonne
entity.

.. _advanced-query-conditions:

Conditions Avancées
===================

Le constructeur de requête facilite la construction de clauses ``where``
complexes. Les conditions groupées peuvent être exprimées en fournissant
une combinaison de ``where()`` et d'objets représentant une expression. Pour les
requêtes simples, vous pouvez construire des conditions en utilisant un tableau
de conditions::

    $query = $articles->find()
        ->where([
            'auteur_id' => 3,
            'OR' => [['nombre_de_vues' => 2], ['nombre_de_vues' => 3]],
        ]);

Ce qui précède générerait le code SQL:

.. code-block:: sql

    SELECT * FROM articles WHERE auteur_id = 3 AND (nombre_de_vues = 2 OR nombre_de_vues = 3)

Si vous préférez éviter des tableaux avec de nombreux niveaux imbriqués, vous pouvez
utiliser ``where()`` avec une fonction de rappel pour construire vos requêtes.
La fonction de rappel prend une QueryExpression, ce qui vous permet d'utiliser
l'interface du constructeur d'expression pour construire des conditions
complexes sans utiliser de tableaux. Par exemple::

    $query = $articles->find()->where(function (QueryExpression $exp, Query $query) {
        // Utilisez add() pour ajouter des conditions multiples sur le même champ.
        $auteur = $query->newExpr()->or(['auteur_id' => 3])->add(['auteur_id' => 2]);
        $published = $query->newExpr()->and(['published' => true, 'nombre_de_vues' => 10]);

        return $exp->or([
            'promoted' => true,
            $query->newExpr()->and([$auteur, $published])
        ]);
    });

Ce qui précède générerait le code SQL:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
        (
            (auteur_id = 2 OR auteur_id = 3)
            AND
            (published = 1 AND nombre_de_vues = 10)
        )
        OR promoted = 1
    )

La ``QueryExpression`` passée à la fonction de rappel vous permet d'utiliser à
la fois les **combinators** et les **conditions** pour construire votre
expression globale.

Combinators
    Ils créent de nouveaux objets ``QueryExpression`` et définissent la façon
    dont les conditions ajoutées à cette expression sont combinées.
    - ``and()`` crée un nouvel objet expression qui combine toutes les conditions avec ``AND``.
    - ``or()``  crée un nouvel objet expression qui combine toutes les conditions avec ``OR``.

Conditions
    Elles sont ajoutées à l'expression et combinées automatiquement selon le
    combinator qui a été utilisé.

La ``QueryExpression`` passée à la fonction de rappel est par défaut ``and()``::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            return $exp
                ->eq('auteur_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('nombre_de_vues', 10);
        });

Puisque nous avons commencé à utiliser ``where()``, nous n'avons pas besoin
d'appeler ``and()``, puisqu'elle est appelée implicitement. Le code ci-dessus
montre quelques nouvelles méthodes de conditions combinées avec ``AND``. Le code
SQL résultant serait:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
    auteur_id = 2
    AND published = 1
    AND spam != 1
    AND nombre_de_vues > 10)

Cependant, si nous souhaitons utiliser les deux conditions ``AND`` & ``OR``,
nous pouvons faire ceci::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or(['auteur_id' => 2])
                ->eq('auteur_id', 5);

            return $exp
                ->add($orConditions)
                ->eq('published', true)
                ->gte('nombre_de_vues', 10);
        });

Ce qui générerait le code SQL suivant:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
        (auteur_id = 2 OR auteur_id = 5)
        AND published = 1
        AND nombre_de_vues > 10
    )

Les **combinators** vous autorisent aussi à passer une fonction de rappel, qui
prend en paramètre un nouvel objet expression, si vous voulez scinder le
chaînage des méthodes::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or(function (QueryExpression $or) {
                return $or->eq('auteur_id', 2)
                    ->eq('auteur_id', 5);
            });

            return $exp
                ->not($orConditions)
                ->lte('nombre_de_vues', 10);
        });

Vous pouvez faire une négation des sous-expressions en utilisant ``not()``::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or(['author_id' => 2])
                ->eq('author_id', 5);

            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

Ce qui générerait le code SQL suivant:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
        NOT (auteur_id = 2 OR auteur_id = 5)
        AND view_count <= 10
    )

Il est aussi possible de construire les expressions en utilisant les fonctions
SQL::

    $query = $articles->find()
        ->where(function (QueryExpression $exp, Query $q) {
            $year = $q->func()->year([
                'created' => 'identifier'
            ]);

            return $exp
                ->gte($year, 2014)
                ->eq('published', true);
        });

Ce qui générerait le code SQL suivant:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
        YEAR(created) >= 2014
        AND published = 1
    )

Quand vous utilisez les objets expression, vous pouvez utiliser les méthodes
suivantes pour créer des conditions:

- ``eq()`` Crée une condition d'égalité::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->eq('population', '10000');
        });
    # WHERE population = 10000

- ``notEq()`` Crée une condition d'inégalité::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notEq('population', '10000');
        });
    # WHERE population != 10000

- ``like()`` Crée une condition en utilisant l'opérateur ``LIKE``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->like('name', '%A%');
        });
    # WHERE name LIKE "%A%"

- ``notLike()`` Crée une condition négative de type ``LIKE``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notLike('name', '%A%');
        });
    # WHERE name NOT LIKE "%A%"

- ``in()`` Crée une condition en utilisant ``IN``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->in('pays_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE pays_id IN ('AFG', 'USA', 'EST')

- ``notIn()`` Crée une condition négative en utilisant ``IN``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notIn('pays_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE pays_id NOT IN ('AFG', 'USA', 'EST')

- ``gt()`` Crée une condition ``>``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->gt('population', '10000');
        });
    # WHERE population > 10000

- ``gte()`` Crée une condition ``>=``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->gte('population', '10000');
        });
    # WHERE population >= 10000

- ``lt()`` Crée une condition ``<``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->lt('population', '10000');
        });
    # WHERE population < 10000

- ``lte()`` Crée une condition ``<=``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->lte('population', '10000');
        });
    # WHERE population <= 10000

- ``isNull()`` Crée une condition ``IS NULL``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->isNull('population');
        });
    # WHERE (population) IS NULL

- ``isNotNull()`` Crée une condition négative ``IS NULL``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->isNotNull('population');
        });
    # WHERE (population) IS NOT NULL

- ``between()`` Crée une condition ``BETWEEN``::

    $query = $villes->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->between('population', 999, 5000000);
        });
    # WHERE population BETWEEN 999 AND 5000000,

- ``exists()`` Crée une condition en utilisant ``EXISTS``::

    $subquery = $villes->find()
        ->select(['id'])
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->equalFields('pays.id', 'villes.pays_id');
        })
      ->andWhere(['population >', 5000000]);

    $query = $pays->find()
        ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
            return $exp->exists($subquery);
        });
    # WHERE EXISTS (SELECT id FROM villes WHERE pays.id = villes.pays_id AND population > 5000000)

- ``notExists()`` Crée une condition négative en utilisant ``EXISTS``::

    $subquery = $villes->find()
        ->select(['id'])
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->equalFields('pays.id', 'villes.pays_id');
        })
      ->andWhere(['population >', 5000000]);

    $query = $pays->find()
        ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
            return $exp->notExists($subquery);
        });
    # WHERE NOT EXISTS (SELECT id FROM villes WHERE pays.id = villes.pays_id AND population > 5000000)

Les objets expression devraient couvrir la plupart des fonctions et expressions
communément utilisées. Si vous vous sentez incapable de créer les conditions
voulues avec des expressions, vous vous sentirez peut-être capable d'utiliser
``bind()`` pour lier manuellement les paramètres aux conditions::

    $query = $villes->find()
        ->where([
            'date_debut BETWEEN :debut AND :fin'
        ])
        ->bind(':debut', '2014-01-01', 'date')
        ->bind(':fin',   '2014-12-31', 'date');

Dans les cas où vous ne pouvez ou ne voulez pas utiliser les méthodes du
constructeur pour créer les conditions que vous voulez, vous pouvez utiliser du
code SQL dans des clauses where::

    // Compare deux champs l'un avec l'autre
    $query->where(['Categories.parent_id != Parents.id']);

.. warning::

    Les noms de champs utilisés dans les expressions et le code SQL ne doivent
    **jamais** contenir de contenu non fiable, sinon vous ouvrez la porte à une
    injection SQL.
    Référez-vous à la section :ref:`using-sql-functions` pour savoir comment
    inclure des données non fiables de manière sécurisée dans vos appels de
    fonctions.

Utiliser des Identificateurs dans des Expressions
-------------------------------------------------

Quand vous avez besoin de faire référence à une colonne ou à un identificateur
SQL dans vos requêtes, vous pouvez utiliser la méthode ``identifier()``::

    $query = $pays->find();
    $query->select([
            'year' => $query->func()->year([$query->identifier('created')])
        ])
        ->where(function ($exp, $query) {
            return $exp->gt('population', 100000);
        });

.. warning::

    Pour prévenir les injections SQL, les expressions Identifier ne doivent
    jamais contenir de données non fiables.

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

    // Ou bien incluez IN pour caster automatiquement en tableau
    $query = $articles->find()
        ->where(['id IN' => $ids]);

Ceci va créer automatiquement ``id IN (...)`` plutôt que
``id = ?``. Cela peut être utile quand vous ne savez pas si vous allez
récupérer un scalaire ou un tableau de paramètres. Le suffixe ``[]`` sur un
nom de type de données indique au constructeur de requête que vous souhaitez
que les données soient gérées en tableau. Si les données ne sont pas un tableau,
elles vont d'abord être converties en tableau. Après cela, chaque valeur dans
le tableau va être convertie en utilisant le
:ref:`système de types <database-data-types>`. Cela fonctionne aussi avec des types
complexes. Par exemple, vous pourriez prendre une liste d'objets DateTime
en utilisant::

    $query = $articles->find()
        ->where(['post_date' => $dates], ['post_date' => 'date[]']);

Création Automatique de IS NULL
-------------------------------

Quand une valeur dans une condition est supposée être ``null``, ou bien une
valeur quelconque,
vous pouvez utiliser l'opérateur ``IS`` pour créer automatiquement la bonne
expression::

    $query = $categories->find()
        ->where(['parent_id IS' => $parentId]);

Ce code va créer ``parent_id` = :c1`` ou ``parent_id IS NULL`` selon le
type de ``$parentId``.

Création Automatique de IS NOT NULL
-----------------------------------

Quand une valeur dans une condition est supposée ne pas être ``null``, ou ne pas
être une valeur quelconque,
vous pouvez utiliser l'opérateur ``IS NOT`` pour créer automatiquement la bonne
expression::

    $query = $categories->find()
        ->where(['parent_id IS NOT' => $parentId]);

Ce code va créer ``parent_id` != :c1`` ou ``parent_id IS NOT NULL``
selon le type de ``$parentId``.

Raw Expressions
---------------

Si le constructeur de requêtes ne vous permet pas de construire le code SQL
que vous souhaitez, vous pouvez utiliser les objets ``Expression`` pour
ajouter directement du code SQL à vos requêtes::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['deux' => $expr]);

Les objets ``Expression`` peuvent être utilisés avec n'importe quelle méthode du
constructeur de requêtes comme ``where()``, ``limit()``, ``group()``,
``select()`` et bien d'autres.

.. warning::

    Les objets ``Expression`` vous rendent vulnérable aux injections SQL.
    Vous devez absolument éviter d'utiliser dans les expressions des données
    venant d'une source non fiable.

Récupérer les Résultats
=======================

Une fois que vous aurez fait votre requête, vous voudrez récupérer les
résultats. Il y a plusieurs façons de faire::

    // Itérer la requête
    foreach ($query as $row) {
        // Faire le boulot.
    }

    // Récupérer les résultats
    $results = $query->all();

Vous pouvez utiliser toutes les méthodes des
:doc:`collections </core-libraries/collections>` sur vos objets
query pour retraiter ou transformer les résultats::

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

Retourner le Nombre Total d'Enregistrements
-------------------------------------------

Il est possible d'obtenir le nombre total de lignes trouvées pour un ensemble de
conditions en utilisant un seul objet query::

    $total = $articles->find()->where(['is_active' => true])->count();

La méthode ``count()`` va ignorer les clauses ``limit``, ``offset`` et ``page``,
donc ce qui suit va retourner les mêmes résultats::

    $total = $articles->find()->where(['is_active' => true])->limit(10)->count();

C'est utile quand vous avez besoin de connaître le nombre de résultats à
l'avance, sans avoir à construire un autre objet ``Query``. De la même façon,
tous les formatages de résultats et les routines map-reduce sont ignorées
quand vous utilisez la méthode ``count()``.

De plus, il est possible d'obtenir le nombre total de lignes pour une requête
contenant des clauses group by sans avoir à réécrire la requête de quelque façon
que ce soit. Par exemple, considérons la requête qui permet de récupérer les ids
d'article et leurs nombres de commentaires::

    $query = $articles->find();
    $query->select(['Articles.id', $query->func()->count('Comments.id')])
        ->matching('Comments')
        ->group(['Articles.id']);
    $total = $query->count();

Après avoir compté, la requête peut toujours être utilisée pour récupérer les
enregistrements associés::

    $list = $query->all();

Vous voudrez parfois fournir une méthode alternative pour compter le nombre
total d'enregistrements d'une requête. Un cas d'utilisation courante de cette
fonctionnalité est de fournir une valeur mise en cache ou une estimation du
nombre total de lignes, ou de modifier la requête pour retirer les parties
coûteuses non nécessaires comme les left joins. Ceci devient particulièrement
pratique quand vous utilisez le système de pagination intégré à CakePHP qui
appelle la méthode ``count()``::

    $query = $query->where(['is_active' => true])->counter(function ($query) {
        return 100000;
    });
    $query->count(); // Retourne 100000

Dans l'exemple ci-dessus, quand le component Pagination appellera la méthode
count, il recevra le nombre de lignes estimé codé en dur.

.. _caching-query-results:

Mettre en Cache les Résultats Chargés
-------------------------------------

Quand vous récupérez des entities qui ne changent pas souvent, vous voudrez
peut-être mettre en cache les résultats. La classe ``Query`` facilite cela::

    $query->cache('recent_articles');

va activer la mise en cache des résultats de la requête. Si un seul
argument est fourni à ``cache()`` alors c'est la configuration du cache
'default' qui sera utilisée. Vous pouvez contrôler la configuration de cache à
utiliser avec le deuxième paramètre::

    // Nom de la config.
    $query->cache('recent_articles', 'dbResults');

    // Instance de CacheEngine
    $query->cache('recent_articles', $memcache);

En plus de supporter les clés statiques, la méthode ``cache()`` accepte une
fonction pour générer la clé. La fonction que vous lui donnez va recevoir la
requête en argument. Vous pouvez ensuite lire les aspects de la requête pour
générer dynamiquement la clé de mise en cache::

    // Génère une clé basée sur un checksum simple
    // de la clause where de la requête
    $query->cache(function ($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

La méthode cache facilite l'ajout des résultats mis en cache à vos finders
personnalisés ou à travers des écouteurs d'évènements.

Quand les résultats d'une requête mise en cache sont récupérés, voici ce qui va
se passer:

1. Si la requête a des résultats, ceux-ci vont être retournés.
2. La clé du cache va être déterminée et les données du cache vont être lues.
   Si les données du cache ne sont pas vides, ces résultats vont être retournés.
3. Si le cache est manquant, la requête sera exécutée, l'événement ``Model.beforeFind``
   sera déclenché, et un nouveau ``ResultSet`` sera créé. Ce ``ResultSet``
   sera écrit dans le cache et retourné.

.. note::

    Vous ne pouvez pas mettre en cache un résultat de requête streaming.

Charger des Associations
========================

Le constructeur peut vous aider à récupérer les données de plusieurs tables à la
fois avec un minimum de requêtes. Pour pouvoir récupérer les données associées,
vous devez d'abord configurer les associations entre
les tables comme décrit dans la section :doc:`/orm/associations`. Cette
technique de requêtes combinées pour récupérer les données associées à partir
d'autres tables est appelé **eager loading**.

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-contain
    :end-before: end-contain

Filtrer selon les Données Associées
-----------------------------------

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-filtering
    :end-before: end-filtering

.. _adding-joins:

Ajouter des Jointures
---------------------

En plus de charger les données liées avec ``contain()``, vous pouvez aussi
ajouter des jointures supplémentaires avec le constructeur de requête::

    $query = $articles->find()
        ->join([
            'table' => 'comments',
            'alias' => 'c',
            'type' => 'LEFT',
            'conditions' => 'c.article_id = articles.id',
        ]);

Vous pouvez ajouter plusieurs jointures en même temps en passant un tableau
associatif avec plusieurs ``join``::

    $query = $articles->find()
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

Lors de la création de ``join`` à la main, et l'utilisation de conditions à
partir d'un tableau, vous devez fournir les types de données pour chaque colonne
dans les conditions du ``join``. En fournissant les types de données pour les
conditions de ``join``, l'ORM peut convertir correctement les types de données
en code SQL. En plus de ``join()`` vous pouvez utiliser ``rightJoin()``,
``leftJoin()`` et ``innerJoin()`` pour créer les jointures::

    // Jointure avec un alias et des conditions littérales
    $query = $articles->find();
    $query->leftJoin(
        ['Auteurs' => 'auteurs'],
        ['Auteurs.id = Articles.auteur_id']);

    // Jointure avec un alias, tableau de conditions, et types
    $query = $articles->find();
    $query->innerJoin(
        ['Auteurs' => 'auteurs'],
        [
        'Auteurs.promoted' => true,
        'Auteurs.created' => new DateTime('-5 days'),
        'Auteurs.id = Articles.auteur_id'
        ],
        ['Auteurs.promoted' => 'boolean', 'Auteurs.created' => 'datetime']);

Notez que si vous définissez l'option ``quoteIdentifiers`` à ``true`` quand vous
configurez votre ``Connection``, les conditions de jointure entre deux champs de
tables doivent être définies de cette manière::

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

Cela permet de s'assurer que tous les ``identifiers`` seront bien quotés dans la
requête générée, permettant d'éviter des erreurs avec certains drivers
(PostgreSQL notamment).

Insérer des Données
===================

Contrairement aux exemples précédents, vous ne devez pas utiliser ``find()``
pour créer des requêtes d'insertion. À la place, créez un nouvel objet ``Query``
en utilisant ``query()``::

    $query = $articles->query();
    $query->insert(['titre', 'corps'])
        ->values([
            'titre' => 'Premier post',
            'corps' => 'Un corps de texte'
        ])
        ->execute();

Pour insérer plusieurs lignes en une seule requête, vous pouvez chaîner la
méthode ``values()`` autant de fois que nécessaire::

    $query = $articles->query();
    $query->insert(['titre', 'corps'])
        ->values([
            'titre' => 'Premier post',
            'corps' => 'Un corps de texte'
        ])
        ->values([
            'titre' => 'Second post',
            'corps' => 'Un autre corps de texte'
        ])
        ->execute();

Généralement, il est plus facile d'insérer des données en utilisant les
entities et :php:meth:`~Cake\\ORM\\Table::save()`. En composant des requêtes
``SELECT`` et ``INSERT`` ensemble, vous pouvez créer des requêtes du style
``INSERT INTO ... SELECT``::

    $select = $articles->find()
        ->select(['titre', 'corps', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['titre', 'corps', 'published'])
        ->values($select)
        ->execute();

.. note::
    L'insertion d'enregistrements avec le constructeur de requêtes ne va pas
    déclencher les événements comme ``Model.afterSave``. À la place, vous pouvez
    utiliser :doc:`l'ORM pour sauvegarder les données </orm/saving-data>`.

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
    La mise à jour d'enregistrements avec le constructeur de requêtes ne va pas
    déclencher les événements comme ``Model.afterSave``. À la place, vous pouvez
    utiliser :doc:`l'ORM pour sauvegarder des données </orm/saving-data>`.

Suppression des Données
=======================

Comme pour les requêtes d'insertion, vous ne devez pas utiliser ``find()``
pour créer des requêtes de suppression. À la place, créez un nouvel objet de
requête en utilisant ``query()``::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

Généralement, il est plus facile de supprimer les données en utilisant les
entities et :php:meth:`~Cake\\ORM\\Table::delete()`.

Prévention des Injections SQL
=============================

Bien que l'ORM et les couches d'abstraction de base de données vous prémunisse
de la plupart des problèmes relatifs aux injections SQL, il est toujours
possible de vous rendre vulnérable en raison d'une utilisation inappropriée.

Lorsque vous utilisez des tableaux de conditions, la clé (la partie à gauche)
aussi bien que les valeurs simples ne doivent pas contenir de données
utilisateur::

    $query->where([
        // Utiliser cette clé est dangereux car elle sera insérée telle quelle
        // dans la requête générée
        $userData => $value,

        // Même chose pour les valeurs simples : il est
        // dangereux de les utiliser avec des données utilisateur
        $userData,
        "MATCH (comment) AGAINST ($userData)",
        'created < NOW() - ' . $userData
    ]);

Lorsque vous utilisez le constructeur d'expressions, les noms de colonnes ne
doivent pas contenir de données provenant d'utilisateurs::

    $query->where(function (QueryExpression $exp) use ($userData, $values) {
        // Dans toutes les expressions, les noms de colonnes ne sont pas sûrs.
        return $exp->in($userData, $values);
    });

Lorsque vous construisez des expressions de fonctions, les noms de fonctions ne
doivent jamais contenir de données provenant d'utilisateurs::

    // Non sécurisé.
    $query->func()->{$userData}($arg1);

    // L'utilisation d'un tableau de données utilisateurs
    // dans une fonction n'est également pas sécurisée
    $query->func()->coalesce($userData);

Les expressions brutes ne sont jamais sécurisées::

    $expr = $query->newExpr()->add($userData);
    $query->select(['deux' => $expr]);

Lier les Valeurs (Binding)
--------------------------

Il est possible de vous prémunir contre de nombreuses situations à risque en
utilisant les *bindings*. De la même manière que vous pouvez
:ref:`lier des valeurs pour les requêtes préparées <database-basics-binding-values>`,
des valeurs peuvent être liées aux requêtes en utilisant la méthode
:php:meth:`Cake\\Database\\Query::bind()`.

L'exemple ci-dessous est une alternative sûre à la version donnée
plus haut, qui était vulnérable à une injection SQL::

    $query
        ->where([
            'MATCH (comment) AGAINST (:userData)',
            'created < NOW() - :moreUserData'
        ])
        ->bind(':userData', $userData, 'string')
        ->bind(':moreUserData', $moreUserData, 'datetime');

.. note::

    Contrairement à :php:meth:`Cake\\Database\\StatementInterface::bindValue()`,
    ``Query::bind()`` a besoin que vous passiez les "placeholders" en incluant
    les deux-points (``:``) !

Requêtes Plus Complexes
=======================

Si votre application a besoin de recourir à des requêtes plus complexes, vous
pouvez en écrire de nombreuses manières avec le constructeur de requêtes ORM.

Unions
------

Les unions sont créées en composant une ou plusieurs requêtes select ensemble::

    $inReview = $articles->find()
        ->where(['a_relire' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

Vous pouvez créer les requêtes ``UNION ALL`` en utilisant la méthode
``unionAll()``::

    $inReview = $articles->find()
        ->where(['a_relire' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

Sous-Requêtes
-------------

Les sous-requêtes vous permettent de combiner des requêtes et de construire des
conditions et des résultats basés sur les résultats d'autres requêtes::

    $matchingComment = $articles->getAssociation('Comments')->find()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id IN' => $matchingComment]);

Les sous-requêtes sont acceptées partout où une expression de requête peut être
utilisée. Par exemple, dans les méthodes ``select()`` et ``join()``. L'exemple
ci-dessus utilise un objet ``Orm\Query`` standard qui générera des alias. Ces
alias peuvent complexifier le référencement des résultats dans la requête
englobante. Depuis 4.2.0 vous pouvez utiliser ``Table::subquery()`` pour créer
une instance de requête spécialisée qui ne générera pas d'alias::

    $comments = $articles->getAssociation('Comments')->getTarget();

    $matchingComment = $comments->subquery()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id IN' => $matchingComment]);

Ajouter des Clauses de Verrouillage
-----------------------------------

La plupart des fournisseurs de bases de données relationnelles supportent la
pose de verrous pendant les opérations SELECT. Pour cela, vous pouvez utiliser
la méthode ``epilog()``::

    // Dans MySQL
    $query->epilog('FOR UPDATE');

La méthode ``epilog()`` vous permet d'ajouter du SQL brut à la fin des requêtes.
Vous ne devez jamais insérer des données utilisateur dans ``epilog()``.

Fonctions de Fenêtrage (Window Functions)
-----------------------------------------

Les fonctions de fenêtrage (*window functions*) vous permettent d'effectuer des
calculs en utilisant des lignes relatives à la ligne courante. Elles sont
couramment utilisées pour calculer des totaux ou des positions dans des
sous-ensembles de lignes dans une requête. Par exemple si vous nous voulons
connaître la date du plus ancien et du plus récent commentaires sur chaque
article, nous pouvons utiliser des fonctions de fenêtrage::

    $query = $articles->find();
    $query->select([
        'Articles.id',
        'Articles.titre',
        'Articles.user_id'
        'premier_commentaire' => $query->func()
            ->min('Comments.created')
            ->partition('Comments.article_id'),
        'dernier_commentaire' => $query->func()
            ->max('Comments.created')
            ->partition('Comments.article_id'),
    ])
    ->innerJoinWith('Comments');

Ce code générerait du SQL ressemblant à:

.. code-block:: sql

    SELECT
        Articles.id,
        Articles.titre,
        Articles.user_id
        MIN(Comments.created) OVER (PARTITION BY Comments.article_id) AS premier_commentaire,
        MAX(Comments.created) OVER (PARTITION BY Comments.article_id) AS dernier_commentaire,
    FROM articles AS Articles
    INNER JOIN comments AS Comments

Les expressions de fenêtrage peuvent s'appliquer à la plupart des fonctions
d'agrégation. Toutes les fonctions d'agrégation pour lesquelle cake propose une
abstraction avec un wrapper dans ``FunctionsBuilder`` retourneront une
``AggregateExpression`` qui vous permet d'y rattacher une expression de
fenêtrage. Vous pouvez créer des fonctions d'agrégation personnalisées avec
``FunctionsBuilder::aggregate()``.

Ce sont les fonctionnalités de fenêtrage les plus communément supportées. La
plupart des fonctionnalités sont fournies par ``AggregateExpresion``, mais
assurez-vous de suivre la documentation de votre base de données sur
leur utilisation et leurs restrictions.

- ``order($fields)`` Trie les groupes agrégés de la même façon que ORDER BY.
- ``partition($expressions)`` Ajoute une ou plusieurs partitions à la fenêtre
  à partir des noms de colonnes.
- ``rows($start, $end)`` Définit un offset de lignes qui précèdent et/ou suivent
  la ligne en cours et qui devraient être incluses dans la fonction
  d'agrégation.
- ``range($start, $end)`` Définit une plage de valeurs de lignes qui précèdent
  et/ou suivent la ligne en cours et qui devraient être incluses dans la
  fonction d'agrégation. Cela évalue les valeurs sur la base du champ de
  ``order()``.

Si vous avez besoin d'utiliser une même expression de fenêtrage à plusieurs
reprises, vous pouvez créer des fenêtres nommées en utilisant la méthode
``window()``::

    $query = $articles->find();

    // Définit une fenêtre nommée
    $query->window('article_concerne', function ($window, $query) {
        $window->partition('Comments.article_id');

        return $window;
    });

    $query->select([
        'Articles.id',
        'Articles.titre',
        'Articles.user_id'
        'premier_commentaire' => $query->func()
            ->min('Comments.created')
            ->over('article_concerne'),
        'dernier_commentaire' => $query->func()
            ->max('Comments.created')
            ->over('article_concerne'),
    ]);

Common Table Expressions
------------------------

Les *Common Table Expressions* ou CTE sont utiles pour construire des requêtes
dans lesquelles vous devez rassembler les résultats de plusieurs petites
requêtes. Ils peuvent avoir la même utilité que les vues de base de données ou
que les résultats de sous-requêtes. Les *Common Table Expression* se
différencient des tables dérivées et des vues sur plusieurs points:

#. Contrairement aux vues, vous n'avez pas besoin de maintenir un schéma pour
   les CTE. Le schéma est basé implicitement sur le result set de l'expression.
#. Vous pouvez faire plusieurs références aux résultats d'une CTE sans
   dégradation de performance, contrairement aux jointures de sous-requêtes.

À titre d'exemple, récupérons une liste de clients et le nombre de commandes
qu'ils ont passées. En SQL nous utiliserions:

.. code-block:: sql

    WITH commandes_par_client AS (
        SELECT COUNT(*) AS nb_commandes, client_id FROM commandes GROUP BY client_id
    )
    SELECT nom, commandes_par_client.nb_commandes
    FROM clients
    INNER JOIN commandes_par_client ON commandes_par_client.client_id = clients.id

Pour construire cette requête avec le constructeur de requêtes, nous
utiliserions::

    // Démarrer la requête finale
    $query = $this->Clients->find();

    // Attacher une common table expression
    $query->with(function ($cte) {
        // Créer une sous-requête à utiliser dans notre CTE
        $q = $this->Commandes->subquery();
        $q->select([
            'nb_commandes' => $q->func()->count('*'),
            'client_id'
        ])
        ->group('client_id');

        // Attacher la nouvelle requête à notre CTE
        return $cte
            ->name('commandes_par_client')
            ->query($q);
    });

    // Terminer la construction de la requête finale
    $query->select([
        'name',
        'nb_commandes' => 'commandes_par_client.nb_commandes',
    ])
    ->join([
        // Définir la jointure avec notre CTE
        'commandes_par_client' => [
            'table' => 'commandes_par_client',
            'conditions' => 'commandes_par_client.client_id = Clients.id'
        ]
    ]);

Exécuter des Requêtes Complexes
-------------------------------

Bien que le constructeur de requêtes permette la construction de la plupart des
requêtes, les requêtes très complexes peuvent être fastidieuses et compliquées
à construire. Vous pourrez être tenté
:ref:`d'exécuter votre propre code SQL directement <running-select-statements>`.

L'exécution directe de code SQL vous permet d'affiner la requête qui sera lancée.
Cependant, cela vous empêchera d'utiliser ``contain`` ou toute autre
fonctionnalité de plus haut niveau de l'ORM.
