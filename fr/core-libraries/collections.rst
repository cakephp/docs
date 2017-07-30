Collections
###########

.. php:namespace:: Cake\Collection

.. php:class:: Collection

Les classes collection fournissent un ensemble d'outils pour manipuler les
tableaux ou les objets ``Traversable``. Si vous avez déjà utilisé
underscore.js, vous avez une idée de ce que vous pouvez attendre des classes
collection.

Les instances Collection sont immutables, modifier une collection va plutôt
générer une nouvelle collection. Cela rend le travail avec les objets collection
plus prévisible puisque les opérations sont sans effets collatéraux.

Exemple Rapide
==============

Les Collections peuvent être créées en utilisant un tableau ou un objet
Traversable. Vous allez aussi interagir avec les collections à chaque fois que
vous faites une interaction avec l'ORM de CakePHP. Une utilisation simple de
Collection serait::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // Crée une nouvelle collection contenant des éléments
    // avec une valeur supérieure à un.
    $overOne = $collection->filter(function ($value, $key, $iterator) {
        return $value > 1;
    });

Vous pouvez aussi utiliser la fonction ``collection()`` à la place de ``new
Collection()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];

    // Les deux créent une instance de Collection.
    $collectionA = new Collection($items);
    $collectionB = collection($items);

Le bénéfice de cette méthode est qu'il est plus facile de chaîner par rapport à
``(new Collection($items))``.

:php:trait:`~Cake\\Collection\\CollectionTrait` vous permet également
d'intégrer des fonctionnalités semblables aux Collections pour tout objet
``Traversable`` de votre application.

Liste des Méthodes
==================

.. table::
    :class: docutils internal-toc

    +---------------------------------------------------+----------------------+------------------------+
    | :php:meth:`append`        | :php:meth:`avg`       | :php:meth:`buffered` | :php:meth:`combine`    |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`compile`       | :php:meth:`contains`  | :php:meth:`countBy`  | :php:meth:`chunk`      |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`chunkWithKeys` | :php:meth:`each`      | :php:meth:`every`    | :php:meth:`extract`    |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`filter`        | :php:meth:`first`     | :php:meth:`groupBy`  | :php:meth:`indexBy`    |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`insert`        | :php:meth:`isEmpty`   | :php:meth:`last`     | :php:meth:`listNested` |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`map`           | :php:meth:`match`     | :php:meth:`max`      | :php:meth:`median`     |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`min`           | :php:meth:`nest`      | :php:meth:`reduce`   | :php:meth:`reject`     |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`sample`        | :php:meth:`shuffle`   | :php:meth:`skip`     | :php:meth:`some`       |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`sortBy`        | :php:meth:`stopWhen`  | :php:meth:`sumOf`    | :php:meth:`take`       |
    +---------------------------+-----------------------+----------------------+------------------------+
    | :php:meth:`through`       | :php:meth:`transpose` | :php:meth:`unfold`   | :php:meth:`zip`        |
    +---------------------------+-----------------------+----------------------+------------------------+

Faire une Itération
===================

.. php:method:: each(callable $c)

Les Collections peuvent être itérées et/ou transformées en nouvelles
collections avec les méthodes ``each()`` et ``map()``. La méthode ``each()``
ne va pas créer une nouvelle collection, mais va vous permettre de modifier tout
objet dans la collection::

    $collection = new Collection($items);
    $collection = $collection->each(function ($value, $key) {
        echo "Element $key: $value";
    });

Le retour de ``each()`` sera un objet collection. Each va itérer la collection
en appliquant immédiatement le callback pour chaque valeur de la collection.

.. php:method:: map(callable $c)

La méthode ``map()`` va créer une nouvelle collection basée sur la sortie du
callback étant appliqué à chaque objet dans la collection originelle::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function ($value, $key) {
        return $value * 2;
    });

    // $result contient ['a' => 2, 'b' => 4, 'c' => 6];
    $result = $new->toArray();

La méthode ``map()`` va créer un nouvel itérateur, qui va créer automatiquement
les objets résultants quand ils sont itérés.

.. php:method:: extract($matcher)

Une des utilisations les plus courantes de la fonction ``map()`` est
l'extraction d'une colonne unique d'une collection. Si vous souhaitez construire
une liste d'éléments contenant les valeurs pour une propriété en particulier,
vous pouvez utiliser la méthode ``extract()``::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result contient ['mark', 'jose', 'barbara'];
    $result = $names->toArray();

Comme plusieurs autres fonctions dans la classe ``Collection``, vous pouvez
spécifier un chemin séparé de points pour extraire les colonnes. Cet exemple va
retourner une collection contenant les noms d'auteurs à partir d'une liste
d'articles::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result contient ['Maria', 'Stacy', 'Larry'];
    $result = $names->toArray();

Finalement, si la propriété que vous recherchez ne peut être exprimée en chemin,
vous pouvez utiliser une fonction de callback pour la retourner::

    $collection = new Collection($articles);
    $names = $collection->extract(function ($article) {
        return $article->author->name . ', ' . $article->author->last_name;
    });

Vous aurez souvent besoin d'extraire une clé commune présente dans plusieurs
tableaux ou objets qui sont imbriqués profondément dans d'autres structures.
Dans ces cas-là, vous pouvez utilisez le matcher ``{*}`` dans la clé du chemin.
Ce matcher est souvent utile quand vous faîtes correspondre des données
d'association HasMany et BelongsToMany::

    $data = [
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-1'],
                ['number' => 'number-2'],
                ['number' => 'number-3'],
            ]
        ],
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-4'],
                ['number' => 'number-5'],
            ]
        ]
    ];

    $numbers = (new Collection($data))->extract('phone_numbers.{*}.number');
    $numbers->toList();
    // Retourne ['number-1', 'number-2', 'number-3', 'number-4', 'number-5']

Ce dernier exemple utilise ``toList()`` au contraire des autres exemples, ce qui
est important quand vous récupérez des résultats avec de possibles clés
dupliquées. En utilisant ``toList()``, nous aurons la garantie de récupérer
toutes les valeurs même s'il y a des clés dupliquées.

.. php:method:: combine($keyPath, $valuePath, $groupPath = null)

Les collections vous permettent de créer une nouvelle collection à partir des
clés et des valeurs d'une collection existante. Les chemins de clé et de valeur
peuvent être spécifiés avec la notation par point des chemins::

    $items = [
        ['id' => 1, 'name' => 'foo', 'parent' => 'a'],
        ['id' => 2, 'name' => 'bar', 'parent' => 'b'],
        ['id' => 3, 'name' => 'baz', 'parent' => 'a'],
    ];
    $combined = (new Collection($items))->combine('id', 'name');

    // Le résultat ressemble à ceci quand il est converti en tableau
    [
        1 => 'foo',
        2 => 'bar',
        3 => 'baz',
    ];

Vous pouvez aussi utiliser ``groupPath`` en option pour grouper les résultats
basés sur un chemin::

    $combined = (new Collection($items))->combine('id', 'name', 'parent');

    // Le résultat ressemble à ceci quand il est converti en tableau
    [
        'a' => [1 => 'foo', 3 => 'baz'],
        'b' => [2 => 'bar']
    ];

Finalement vous pouvez utiliser les *closures* pour construire les
chemins des clés/valeurs/groupes de façon dynamique, par exemple quand vous
travaillez avec les entities et les dates (convertis en instances ``Cake/Time``
par l'ORM) vous pourriez grouper les résultats par date::

    $combined = (new Collection($entities))->combine(
        'id',
        function ($entity) { return $entity; },
        function ($entity) { return $entity->date->toDateString(); }
    );

    // Le résultat va ressembler à ceci quand il sera converti en tableau
    [
        'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
        'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    ]

.. php:method:: stopWhen(callable $c)

Vous pouvez stopper l'itération à n'importe quel point en utilisant la méthode
``stopWhen()``. L'appeler dans une collection va en créer une qui va stopper le
retour des résultats si le callable passé retourne false pour l'un des
éléments::

    $items = [10, 20, 50, 1, 2];
    $collection = new Collection($items);

    $new = $collection->stopWhen(function ($value, $key) {
        // Stop on the first value bigger than 30
        return $value > 30;
    });

    // $result contient [10, 20];
    $result = $new->toArray();

.. php:method:: unfold(callable $c)

Parfois les items internes d'une collection vont contenir des tableaux ou des
itérateurs avec plus d'items. Si vous souhaitez aplatir la structure interne
pour itérer une fois tous les éléments, vous pouvez utiliser la méthode
``unfold()``. Cela va créer une nouvelle collection qui va produire l'élément
unique imbriqué dans la collection::

    $items = [[1, 2, 3], [4, 5]];
    $collection = new Collection($items);
    $new = $collection->unfold();

    // $result contient [1, 2, 3, 4, 5];
    $result = $new->toList();

Quand vous passez un callable à ``unfold()``, vous pouvez contrôler les éléments
qui vont être révélés à partir de chaque item dans la collection originale.
C'est utile pour retourner les données à partir des services paginés::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // Un service web imaginaire qui retourne une page de résultats
        return MyService::fetchPage($page)->toArray();
    });

    $allPagesItems = $items->toList();

Si vous utilisez PHP 5.5+, vous pouvez utiliser le mot clé ``yield`` à l'intérieur
de ``unfold()`` pour renvoyer autant d'éléments pour chaque item dans la collection
que besoin::

    $oddNumbers = [1, 3, 5, 7];
    $collection = new Collection($oddNumbers);
    $new = $collection->unfold(function ($oddNumber) {
        yield $oddNumber;
        yield $oddNumber + 1;
    });

    // $result contient [1, 2, 3, 4, 5, 6, 7, 8];
    $result = $new->toList();

.. php:method:: chunk($chunkSize)

Quand vous gérez des grandes quantités d'items dans une collection, il peut
paraître sensé d'agir sur les éléments en lots plutôt qu'un par un. Pour séparer
une collection en plusieurs tableaux d'une certaine taille, vous pouvez utiliser
la fonction ``chunk()``::

    $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    $collection = new Collection($items);
    $chunked = $collection->chunk(2);
    $chunked->toList(); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]]

La fonction ``chunk`` est particulièrement utile quand vous faîtes des
opérations en lots, par exemple avec les résultats d'une base de données::

    $collection = new Collection($articles);
    $collection->map(function ($article) {
            // Change une propriété de l'article
            $article->property = 'changed';
        })
        ->chunk(20)
        ->each(function ($batch) {
            myBulkSave($batch); // Cette fonction sera appelée pour chaque lot
        });


.. php:method:: chunkWithKeys($chunkSize)

Tout comme :php:meth:`chunk()`, ``chunkWithKeys()`` vous permet de découper une
collection en plusieurs tableaux plus petits mais en préservant les clés. Ceci
est particulièrement utile quand vous avez besoin de découper des tableaux
associatifs::

    $collection = new Collection([
        'a' => 1,
        'b' => 2,
        'c' => 3,
        'd' => [4, 5]
    ]);
    $chunked = $collection->chunkWithKeys(2)->toList();
    // Va créer
    [
        ['a' => 1, 'b' => 2],
        ['c' => 3, 'd' => [4, 5]]
    ]

.. versionadded:: 3.4.0
    ``chunkWithKeys()`` a été ajoutée dans la version 3.4.0

Filtrer
=======

.. php:method:: filter(callable $c)

Les collections permettent de filtrer et de créer facilement les nouvelles
collections basées sur le résultat de fonctions callback. Vous pouvez utiliser
``filter()`` pour créer une nouvelle collection d'éléments qui matchent un
critère callback::

    $collection = new Collection($people);
    $ladies = $collection->filter(function ($person, $key) {
        return $person->gender === 'female';
    });
    $guys = $collection->filter(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: reject(callable $c)

L'inverse de ``filter()`` est ``reject()``. Cette méthode fait un filtre
négatif, retirant les éléments qui matchent la fonction filter::

    $collection = new Collection($people);
    $ladies = $collection->reject(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: every(callable $c)

Vous pouvez faire des tests de vérité avec les fonctions filter. Pour voir si
chaque élément dans une collection matche un test, vous pouvez utiliser
``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function ($person) {
        return $person->age < 21;
    });

.. php:method:: some(callable $c)

Vous pouvez regarder si la collection contient au moins un élément matchant une
fonction filter en utilisant la méthode ``some()``::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function ($person) {
        return $person->age < 21;
    });

.. php:method:: match(array $conditions)

Si vous avez besoin d'extraire une nouvelle collection contenant seulement les
éléments qui contiennent un ensemble donné de propriétés, vous devez utiliser
la méthode ``match()``::

    $collection = new Collection($comments);
    $commentsFromMark = $collection->match(['user.name' => 'Mark']);

.. php:method:: firstMatch(array $conditions)

Le nom de la propriété peut être un chemin séparé par des points. Vous pouvez
traverser des entities imbriquées et matcher les valeurs qu'elles contiennent.
Quand vous avez besoin de seulement matcher le premier élément d'une collection,
vous pouvez utiliser ``firstMatch()``::

    $collection = new Collection($comments);
    $comment = $collection->firstMatch([
        'user.name' => 'Mark',
        'active' => true
    ]);

Comme vous pouvez le voir ci-dessus, les méthodes ``match()`` et
``firstMatch()`` vous permettent de fournir plusieurs conditions à matcher. De
plus, les conditions peuvent être utilisées sur des chemins différents, vous
permettant d'exprimer des conditions complexes à faire correspondre.

Agrégation
==========

.. php:method:: reduce(callable $c)

La contrepartie de l'opération ``map()`` est habituellement un ``reduce``. Cette
fonction va vous aider à construire un résultat unique à partir de tous les
éléments d'une collection::

    $totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
        return $accumulated + $orderLine->price;
    }, 0);

Dans l'exemple ci-dessus, ``$totalPrice`` va être la somme de tous les prix
uniques qui se trouvent dans la collection. Remarquez le deuxième argument
pour la fonction ``reduce()``, il prend la valeur initiale pour l'opération
``reduce`` que vous souhaitez faire::

    $allTags = $collection->reduce(function ($accumulated, $article) {
        return array_merge($accumulated, $article->tags);
    }, []);

.. php:method:: min(string|callable $callback, $type = SORT_NUMERIC)

Pour extraire la valeur minimum pour une collection basée sur une propriété,
utilisez juste la fonction ``min()``. Celle-ci va retourner l'élément complet
à partir de la collection et pas seulement la plus petite valeur trouvée::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $youngest->name;

Vous pouvez aussi exprimer la propriété à comparer en fournissant un chemin ou
une fonction callback::

    $collection = new Collection($people);
    $personYoungestChild = $collection->min(function ($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

.. php:method:: max(string|callable $callback, $type = SORT_NUMERIC)

La même chose peut être appliquée à la fonction ``max()``, qui retourne un
élément unique à partir de la collection ayant la valeur de propriété la plus
élevée::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function ($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->min('dad.age');

.. php:method:: sumOf(string|callable $callback)

Pour finir, la méthode ``sumOf()`` va retourner la somme d'une propriété de tous
les éléments::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

.. php:method:: avg($matcher = null)

Calcule la moyenne des éléments de la collection. Vous pouvez passer, en
option, un "path" à matcher ou une fonction pour extraire les valeurs pour
lesquelles vous souhaitez générer la moyenne::

    $items = [
       ['invoice' => ['total' => 100]],
       ['invoice' => ['total' => 200]],
    ];

    // Moyenne : 150
    $average = (new Collection($items))->avg('invoice.total');

.. versionadded:: 3.5.0

.. php:method:: median($matcher = null)

Calcule la valeur médianne d'un jeu d'élément. Vous pouvez passer, en
option, un "path" à matcher ou une fonction pour extraire les valeurs pour
lesquelles vous souhaitez calculer la valeur médianne::

    $items = [
      ['invoice' => ['total' => 400]],
      ['invoice' => ['total' => 500]],
      ['invoice' => ['total' => 100]],
      ['invoice' => ['total' => 333]],
      ['invoice' => ['total' => 200]],
    ];

    // Valeur médiane : 333
    $median = (new Collection($items))->median('invoice.total');

.. versionadded:: 3.5.0

Grouper et Compter
------------------

.. php:method:: groupBy($callback)

Les valeurs d'une collection peuvent être groupées avec des clés différentes
dans une nouvelle collection quand elles partagent la même valeur pour une
propriété::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');

    // Le résultat ressemble à ceci quand il est converti en tableau:
    [
      10 => [
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10]
      ],
      9 => [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Barbara', 'grade' => 9]
      ]
    ]

Comme d'habitude, il est possible de fournir soit un chemin séparé de points
pour les propriétés imbriquées ou votre propre fonction de callback pour générer
les groupes dynamiquement::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

.. php:method:: countBy($callback)

Si vous souhaitez seulement connaître le nombre d'occurrences par groupe, vous
pouvez le faire en utilisant la méthode ``countBy()``. Elle prend les mêmes
arguments que ``groupBy`` donc cela devrait vous être déjà familier::

    $classResults = $students->countBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

Result could look like this when converted to array:
    ['approved' => 70, 'denied' => 20]

.. php:method:: indexBy($callback)

Il y aura des cas où vous savez qu'un élément est unique pour la
propriété selon laquelle vous souhaitez faire un ``groupBy()``. Si vous
souhaitez un unique résultat par groupe, vous pouvez utiliser la fonction
``indexBy()``::

    $usersById = $users->indexBy('id');

    // Quand il est converti en tableau, le résultat pourrait ressembler à ceci
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

Comme avec la fonction ``groupBy()``, vous pouvez aussi utiliser un chemin de
propriété ou un callback::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function ($file) {
        return md5($file);
    });

.. php:method:: zip($elements)

Les éléments de différentes collections peuvent être groupés ensemble en
utilisant la méthode ``zip()``. Elle retournera une nouvelle collection
contenant un tableau regroupant les éléments de chaque collection qui sont
placés à la même position::

    $odds = new Collection([1, 3, 5]);
    $pairs = new Collection([2, 4, 6]);
    $combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]

Vous pouvez également zipper des cllections multiples d'un coup::

    $years = new Collection([2013, 2014, 2015, 2016]);
    $salaries = [1000, 1500, 2000, 2300];
    $increments = [0, 500, 500, 300];

    $rows = $years->zip($salaries, $increments)->toList();
    // Retourne:
    [
        [2013, 1000, 0],
        [2014, 1500, 500],
        [2015, 2000, 500],
        [2016, 2300, 300]
    ]

Comme vous avez pu le voir, la méthode ``zip()`` est très utile pour transposer
des tableaux multidimensionnels::

    $data = [
        2014 => ['jan' => 100, 'feb' => 200],
        2015 => ['jan' => 300, 'feb' => 500],
        2016 => ['jan' => 400, 'feb' => 600],
    ]

    // Récupérer les données de jan et fev ensemble

    $firstYear = new Collection(array_shift($data));
    $firstYear->zip($data[0], $data[1])->toList();

    // Ou $firstYear->zip(...$data) in PHP >= 5.6

    // Retourne
    [
        [100, 300, 400],
        [200, 500, 600]
    ]

Trier
=====

.. php:method:: sortBy($callback)

Les valeurs de collection peuvent être triées par ordre croissant ou
décroissant basé sur une colonne ou une fonction personnalisée. Pour créer une
nouvelle collection triée à partir de valeurs d'une autre, vous pouvez utiliser
``sortBy``::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age');

Comme vu ci-dessus, vous pouvez trier en passant le nom d'une colonne ou d'une
propriété qui est présente dans les valeurs de la collection. Vous pouvez aussi
spécifier un chemin de propriété à la place de la notation par point. L'exemple
suivant va trier les articles par leur nom d'auteur::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('author.name');

La méthode ``sortBy()`` est assez flexible pour vous laisser spécifier une
fonction d'extracteur qui vous laisse sélectionner dynamiquement la valeur à
utiliser pour comparer deux valeurs différentes dans la collection::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function ($article) {
        return $article->author->name . '-' . $article->title;
    });

Afin de spécifier la direction dans laquelle la collection doit être triée, vous
devez fournir soit ``SORT_ASC`` soit ``SORT_DESC`` en deuxième paramètre pour
trier respectivement par ordre croissant ou décroissant. Par défaut, les
collections sont triées par ordre décroissant::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

Parfois vous devez spécifier le type de données que vous essayez de comparer
pour avoir des résultats cohérents. A cet effet, vous devez fournir
un troisième argument dans la fonction ``sortBy()`` avec une des constantes
suivantes:

- **SORT_NUMERIC**: Pour comparer les nombres
- **SORT_STRING**: Pour comparer les valeurs de chaîne
- **SORT_NATURAL**: Pour trier une chaîne contenant des nombres que vous
  souhaitez trier de façon naturelle. Par exemple, afficher "10" après "2".
- **SORT_LOCALE_STRING**: Pour comparer les chaînes basées sur la locale
  courante.

Par défaut, ``SORT_NUMERIC`` est utilisée::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    Il est souvent coûteux d'itérer les collections triées plus d'une fois. Si
    vous voulez le faire, pensez à convertir la collection en tableau ou
    utilisez simplement la méthode ``compile()`` dessus.

Utiliser des Données en Arbre
=============================

.. php:method:: nest($idPath, $parentPath)

Toutes les données ne sont pas destinées à être représentées de façon linéaire.
Les collections facilitent la construction et l'aplatissement de structures
hiérarchiques ou imbriquées. Créer une structure imbriquée où les enfants sont
groupés selon une propriété identifier parente est facile avec la méthode
``nest()``.

Deux paramètres sont requis pour cette fonction. La première est la propriété
représentant l'identifier de l'item. Le second paramètre est le nom de la
propriété représentant l'identifier pour l'item parent::

    $items new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null], 'name' => 'Fish'],
    ]);

    $collection->nest('id', 'parent_id')->toArray();
    // Retourne
    [
        [
            'id' => 1,
            'parent_id' => null,
            'name' => 'Bird',
            'children' => [
                [
                    'id' => 2,
                    'parent_id' => 1,
                    'name' => 'Land Birds',
                    'children' => [
                        ['id' => 3, 'name' => 'Eagle', 'parent_id' => 2]
                    ]
                ],
                ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull',  'children' => []],
            ]
        ],
        [
            'id' => 6,
            'parent_id' => null,
            'name' => 'Fish',
            'children' => [
                ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish', 'children' => []],
            ]
        ]
    ];

Les éléments enfants sont imbriqués dans la propriété ``children`` à l'intérieur
de chacun des items dans la collection. Cette représentation de type de données
aide à rendre les menus ou à traverser les éléments vers le haut à un certain
niveau dans l'arbre.

.. php:method:: listNested($dir = 'desc', $nestingKey = 'children')

L'inverse de ``nest()`` est ``listNested()``. Cette méthode vous permet
d'aplatir une structure en arbre en structure linéaire. Elle prend deux
paramètres, le premier est le mode de traversement (asc, desc ou leaves), et
le deuxième est le nom de la propriété contenant les enfants pour chaque élément
dans la collection.

Considérons la collection imbriquée intégrée dans l'exemple précédent, nous
pouvons l'aplatir::

    $nested->listNested()->toList();

    // Retourne
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

Par défaut, l'arbre est traversé de la racine vers les feuilles. Vous pouvez
également demander à retourner seulement les éléments feuilles de l'arbre::

    $nested->listNested()->toArray();

    // Retourne
    [
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

Once you have converted a tree into a nested list, you can use the ``printer()``
method to configure how the list output should be formatted::

    $nested->listNested()->printer('name', 'id', '--')->toArray();

    // Returns
    [
        3 => 'Eagle',
        4 => 'Seagull',
        5 -> '--Clown Fish',
    ]

The ``printer()`` method also lets you use a callback to generate the keys and
or values::

    $nested->listNested()->printer(
        function ($el) {
            return $el->name;
        },
        function ($el) {
            return $el->id;
        }
    );

Autres Méthodes
===============

.. php:method:: isEmpty()

Vous permet de voir si une collection contient un élément::

    $collection = new Collection([]);
    // Returns true
    $collection->isEmpty();

    $collection = new Collection([1]);
    // Returns false
    $collection->isEmpty();

.. php:method:: contains($value)

Les collections vous permettent de vérifier rapidement si elles contiennent
une valeur particulière: en utilisant la méthode ``contains()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

Les comparaisons sont effectuées en utilisant l'opérateur ``===``. Si vous
souhaitez faire des types de comparaison non stricte, vous pouvez utiliser la
méthode ``some()``.

.. php:method:: shuffle()

Parfois vous pouvez souhaiter montrer une collection de valeurs dans un ordre
au hasard. Afin de créer une nouvelle collection qui va retourner chaque valeur
dans une position au hasard, utilisez ``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // Ceci pourrait retourner [2, 3, 1]
    $collection->shuffle()->toArray();

.. php:method:: transpose()

Quand vous transposez une collection, vous récupérez une nouvelle collection
contenant une colonne avec chacune des colonnes originales::

     $items = [
        ['Products', '2012', '2013', '2014'],
        ['Product A', '200', '100', '50'],
        ['Product B', '300', '200', '100'],
        ['Product C', '400', '300', '200'],
     ]
     $transpose = (new Collection($items))->transpose()->toList();

     // Returns
     [
         ['Products', 'Product A', 'Product B', 'Product C'],
         ['2012', '200', '300', '400'],
         ['2013', '100', '200', '300'],
         ['2014', '50', '100', '200'],
     ]

.. versionadded:: 3.3.0
    ``Collection::transpose()`` a été ajoutée dans la version 3.3.0.

Retrait d'Eléments
------------------

.. php:method:: sample(int $size)

Remanier une collection est souvent utile quand vous faites des statistiques
d'analyse rapides. Une autre opération habituelle quand vous faites ce type
de tâches est d'extraire quelques valeurs au hasard en dehors de la
collection pour que plus de tests puissent être effectués dessus. Par exemple,
si vous souhaitez sélectionner 5 utilisateurs au hasard auxquels vous voulez
appliquer des tests A/B, vous pouvez utiliser la fonction ``sample()``::

    $collection = new Collection($people);

    // Extrait au maximum 20 utilisateurs au hasard de la collection
    $testSubjects = $collection->sample(20);

``sample()`` va prendre au moins le nombre de valeurs que vous spécifiez dans
le premier argument. S'il n'y a pas assez d'éléments dans la collection qui
satisfont le sample, la collection sera retournée en entier dans un ordre au
hasard.

.. php:method:: take(int $size, int $from)

Quand vous souhaitez prendre une partie d'une collection, utilisez la fonction
``take()``, cela va créer une nouvelle collection avec au moins le nombre de
valeurs que vous spécifiez dans le premier argument, en commençant par la
position passée dans le second argument::

    $topFive = $collection->sortBy('age')->take(5);

    // Prenons 5 personnes d'une collection en commençant par la position 4
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

Les positions sont basées sur zéro, donc le premier nombre de la position est
``0``.

.. php:method:: skip(int $positions)

Alors que le second argument de ``take()`` peut vous aider à exclure quelques
éléments avant de les récupérer depuis une collection, vous pouvez également
utiliser ``skip()`` pour récupérer le reste des éléments après une certaine
position::

    $collection = new Collection([1, 2, 3, 4]);
    $allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]

.. php:method:: first()

Un des cas d'utilisation les plus courant de ``take()`` est de récupérer le
premier élément d'un collection. Une moyen plus rapide d'arriver au même
résultat est d'utiliser la méthode ``first()``::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->first(); // Retourne 5

.. php:method:: last()

De la même manière, vous pouvez récupérer le dernier élément d'une collection
en utilisant la méthode ``last()``::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->last(); // Returns 2

Agrandir les Collections
------------------------

.. php:method:: append(array|Traversable $items)

Vous pouvez regrouper plusieurs collections en une collection unique. Ceci vous
permet de recueillir des données provenant de diverses sources, de concaténer
et de lui appliquer d'autres fonctions de collection très en douceur. La méthode
``append()`` va retourner une nouvelle collection contenant les valeurs à partir
des deux sources::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // Tweets contenant cakefest à partir des deux sources
    $myTimeline->filter(function ($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. warning::

    Quand vous ajoutez différentes sources, vous pouvez avoir certaines clés
    des deux collections qui sont les mêmes. Par exemple, quand vous ajoutez
    deux tableaux unidimensionnels. Ceci peut entraîner un problème quand vous
    convertissez une collection en un tableau en utilisant ``toArray()``. Si
    vous ne voulez pas que des valeurs d'une collection surchargent les autres
    dans la précédente basée sur leur clé, assurez-vous que vous appelez
    ``toList()`` afin de supprimer les clés et de préserver toutes les
    valeurs.

Modification d'Eléments
-----------------------

.. php:method:: insert(string $path, array|Traversable $items)

A certains moments, vous pourriez avoir à séparer des ensembles de données que
vous souhaiteriez, pour insérer les éléments d'un ensemble dans chacun des
éléments de l'autre ensemble. C'est un cas très courant quand vous récupérez
les données à partir d'une source de données qui ne supporte pas la fusion de
données ou les jointures nativement.

Les collections ont une méthode ``insert()`` qui vous permet d'insérer chacun
des éléments dans une collection dans une propriété dans chacun des éléments
d'une autre collection::

    $users = [
        ['username' => 'mark'],
        ['username' => 'juan'],
        ['username' => 'jose']
    ];

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript'],
        ['Javascript', 'Prolog']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

Une fois convertie en un tableau, la collection ``$merged`` va ressembler à ceci::

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

Le premier paramètre de la méthode ``insert()`` est un chemin séparé par des
points des propriétés à suivre pour que les éléments puissent être insérés à
cette position. Le second argument est tout ce qui peut être converti en
objets collection.

Veuillez noter que les éléments sont insérés par la position dans laquelle
ils sont trouvés, ainsi le premier élément de la deuxième collection est
fusionné dans le premier élément de la première collection.

S'il y a assez d'éléments de la seconde collection à insérer dans la première,
alors la propriété cible va être remplie avec les valeurs ``null``::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

    // Va retourner
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => null]
    ];

La méthode ``insert()`` peut opérer sur des éléments tableau ou des objets qui
implémentent l'interface ``ArrayAccess``.

Créer des Méthodes de Collection Réutilisables
----------------------------------------------

Utiliser une ``Closure`` pour les méthodes de Collection est optimal lorsque le
travail à accomplir est petit et ciblé, mais cela peut devenir gênant très
rapidement. Cela devient plus évident quand beaucoup de méthodes différentes
doivent être appelées ou lorsque la longueur des méthodes de la ``Closure`` est
de plus de quelques lignes.

Il y a aussi des cas où la logique utilisée pour les méthodes de Collection peut
être réutilisée dans plusieurs parties de votre application. Il est préférable
d'envisager d'éclater la logique d'ensemble complexe dans des classes séparées.
Par exemple, imaginez une longue restriction comme celle-ci::

        $collection
                ->map(function ($row, $key) {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // More code here...

                    return $modifiedRow;
                });

Cela peut être remodeler en créant une autre classe::

        class TotalOrderCalculator
        {

                public function __invoke($row, $key)
                {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // More code here...

                    return $modifiedRow;
                }
        }

        // Use the logic in your map() call
        $collection->map(new TotalOrderCalculator)


.. php:method:: through(callable $c)

Parfois une suite d'appels de méthodes de Collection peut devenir réutilisable
dans d'autres parties de votre application, mais seulement si elles sont
appelées dans cet ordre précis. Dans ces cas, vous pouvez utiliser les
``through()`` en combinaison avec une classe implémentant ``__invoke`` pour
répartir vos traitements de données::

        $collection
                ->map(new ShippingCostCalculator)
                ->map(new TotalOrderCalculator)
                ->map(new GiftCardPriceReducer)
                ->buffered()
               ...

Les appels aux méthodes ci-dessus, peuvent être regroupés dans une nouvelle
classe permettant de ne pas être répétés à chaque fois::

        class FinalCheckOutRowProcessor
        {

                public function __invoke($collection)
                {
                        return $collection
                                ->map(new ShippingCostCalculator)
                                ->map(new TotalOrderCalculator)
                                ->map(new GiftCardPriceReducer)
                                ->buffered()
                               ...
                }
        }


        // Maintenant vous pouvez utiliser la méthode through() pour appeler toutes les méthodes en une fois
        $collection->through(new FinalCheckOutRowProcessor);

Optimiser les Collections
-------------------------

.. php:method:: buffered()

Les collections effectuent souvent la plupart des opérations que vous créez
en utilisant ses fonctions de façon lazy. Ceci signifie que même si vous pouvez
appeler une fonction, cela ne signifie pas qu'elle est exécutée de la bonne
manière. C'est vrai pour une grande quantité de fonctions de cette classe.
L'évaluation lazy vous permet de gagner des ressources dans des situations
où vous n'utilisez pas toutes les valeurs d'une collection. Vous pouvez ne pas
utiliser toutes les valeurs quand l'itération stoppe rapidement, ou quand une
exception/un échec se produit rapidement.

De plus, l'évaluation lazy aide à accélérer certaines operations. Considérez
l'exemple suivant::

    $collection = new Collection($oneMillionItems);
    $collection = $collection->map(function ($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

Si nous avions des collections non lazy, nous aurions dû executer un million
d'opérations, même si nous voulions seulement montrer 30 éléments. A la
place, notre opération map a été seulement appliquée aux 30 éléments que nous
avons utilisés. Nous pouvons aussi tirer des bénéfices de l'évaluation lazy
pour des collections plus petites quand nous faisons plus qu'une opération sur
elles. Par exemple: appeler ``map()`` deux fois et ensuite ``filter()``.

L'évaluation lazy a aussi ses inconvénients. Vous pourriez faire les mêmes
opérations plus d'une fois si vous optimisiez une collection prématurément.
Considérons cet exemple::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function ($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function ($item) {
        return $item > 30;
    });

Si nous itérons ``youngerThan30`` et ``olderThan30``, la collection exécuterait
malheureusement l'opération ``extract()`` deux fois. C'est parce que les
collections sont immutables et l'opération d'extraction lazy serait fait pour
les deux filtres.

Heureusement, nous pouvons passer outre ce problème avec une simple fonction. Si
vous planifiez de réutiliser les valeurs à partir de certaines opérations plus
d'une fois, vous pouvez compiler les résultats dans une autre collection en
utilisant la fonction ``buffered()``::

    $ages = $collection->extract('age')->buffered();
    $youngerThan30 = ...
    $olderThan30 = ...

Maintenant quand les deux collections sont itérées, elles vont seulement appeler
l'opération d'extraction en une fois.

Rendre les Collections Rembobinables
------------------------------------

La méthode ``buffered()`` est aussi utile pour convertir des itérateurs
non-rembobinables dans des collections qui peuvent être itérées plus d'une
fois::

    // Dans PHP 5.5+
    public function results()
    {
        ...
        foreach ($transientElements as $e) {
            yield $e;
        }
    }
    $rewindable = (new Collection(results()))->buffered();

Clonage de Collection
---------------------

.. php:method:: compile(bool $preserveKeys = true)

Parfois vous devez cloner un des éléments à partir d'une collection. C'est
utile quand vous avez besoin d'itérer le même ensemble à partir d'endroits
différents au même moment. Afin de cloner une collection à partir d'une autre,
utilisez la méthode ``compile()``::

    $ages = $collection->extract('age')->compile();

    foreach ($ages as $age) {
        foreach ($collection as $element) {
            echo h($element->name) . ' - ' . $age;
        }
    }

.. meta::
    :title lang=fr: Collections
    :keywords lang=fr: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold, through
