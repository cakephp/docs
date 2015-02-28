.. php:namespace:: Cake\Collection

.. _collection-objects:

Collections
###########

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

Le :php:trait:`~Cake\\Collection\\CollectionTrait` vous permet également
d'intégrer des fonctionnalité semblables aux collections pour tout objet
``Traversable`` de votre application.

Liste des Méthodes
==================

* :php:meth:`each`
* :php:meth:`map`
* :php:meth:`extract`
* :php:meth:`combine`
* :php:meth:`stopWhen`
* :php:meth:`unfold`
* :php:meth:`filter`
* :php:meth:`reject`
* :php:meth:`every`
* :php:meth:`some`
* :php:meth:`match`
* :php:meth:`reduce`
* :php:meth:`min`
* :php:meth:`max`
* :php:meth:`groupBy`
* :php:meth:`countBy`
* :php:meth:`indexBy`
* :php:meth:`sortBy`
* :php:meth:`nest`
* :php:meth:`listNested`
* :php:meth:`contains`
* :php:meth:`shuffle`
* :php:meth:`sample`
* :php:meth:`take`
* :php:meth:`append`
* :php:meth:`insert`
* :php:meth:`buffered`
* :php:meth:`compile`

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

    // $result contient [2, 4, 6];
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

Comme plusieurs autres fonctions dans la classe collection, vous pouvez
spécifier un chemin séparé de points pour extraire les colonnes. Cet exemple va
retourner une collection contenant les noms d'auteur à partir d'une liste
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

    // Le résultat ressemblera à ceci quand il est converti en tableau
    [
        1 => 'foo',
        2 => 'bar',
        3 => 'baz',
    ];

Vous pouvez aussi utiliser ``groupPath`` en option pour grouper les résultats
basés sur un chemin::

    $combined = (new Collection($items))->combine('id', 'name', 'parent');

    // Le résultat va ressembler à ceci quand converti en tableau
    [
        'a' => [1 => 'foo', 3 => 'baz'],
        'b' => [2 => 'bar']
    ];

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
    $allElements = $collection->unfold();

    // $result contient [1, 2, 3, 4, 5];
    $result = $new->toArray(false);

Quand vous passez un callable à ``unfold()``, vous pouvez contrôler les éléments
qui vont être révélés à partir de chaque item dans la collection originale.
C'est utile pour retourner les données à partir des services paginés::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // Un service web imaginaire qui retourne une page de résultats
        return MyService::fetchPage($page)->toArray();
    });

    $allPagesItems = $items->toArray(false);

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

Comme vous pouvez le voir ci-dessus, les deux méthodes ``match()`` et
``firstMatch()`` vous permettent de fournir plusieurs conditions qui
correspondent. En plus, les conditions peuvent être pour différents chemins,
vous permettant d'exprimer des conditions complexes à faire correspondre.

Agrégation
==========

.. php:method:: reduce(callable $c)

The counterpart of a ``map()`` operation is usually a ``reduce``. This
function will help you build a single result out of all the elements in a
collection::

    $totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
        return $accumulated + $orderLine->price;
    }, 0);

In the above example, ``$totalPrice`` will be the sum of all single prices
contained in the collection. Note the second argument for the ``reduce()``
function, it takes the initial value for the reduce operation you are
performing::

    $allTags = $collection->reduce(function ($accumulated, $article) {
        return array_merge($accumulated, $article->tags);
    }, []);

.. php:method:: min(string|callable $callback, $type = SORT_NUMERIC)

To extract the minimum value for a collection based on a property, just use the
``min()`` function. This will return the full element from the collection and
not just the smallest value found::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $yougest->name;

You are also able to express the property to compare by providing a path or a
callback function::

    $collection = new Collection($people);
    $personYougestChild = $collection->min(function ($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

.. php:method:: max(string|callable $callback, $type = SORT_NUMERIC)

The same can be applied to the ``max()`` function, which will return a single
element from the collection having the highest property value::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function ($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->min('dad.age');

.. php:method:: sumOf(string|callable $callback)

Finally, the ``sumOf`` method will return the sum of a property of all
elements::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

Grouper et Compter
------------------

.. php:method:: groupBy($callback)

Collection values can be grouped by different keys in a new collection when they
share the same value for a property::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');

    // Result will look like this when converted to array:
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

As usual, it is possible to provide either a dot-separated path for nested
properties or your own callback function to generate the groups dynamically::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

.. php:method:: countBy($callback)

If you only wish to know the number of occurrences per group, you can do so by
using the ``countBy()`` method. It takes the same arguments as ``groupBy`` so it
should be already familiar to you::

    $classResults = $students->countBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

    // Result could look like this when converted to array:
    ['approved' => 70, 'denied' => 20]

.. php:method:: indexBy($callback)

There will be certain cases where you know an element is unique for the property
you want to group by. If you wish a single result per group, you can use the
function ``indexBy()``::

    $usersById = $users->indexBy('id');

    // When converted to array result could look like
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

As with the ``groupBy()`` function you can also use a property path or
a callback::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function ($file) {
        return md5($file);
    });

Trier
=====

.. php:method:: sortBy($callback)

Collection values can be sorted in ascending or descending order based on
a column or custom function. To create a new sorted collection out of the values
of another one, you can use ``sortBy``::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age');

As seen above, you can sort by passing the name of a column or property that
is present in the collection values. You are also able to specify a property
path instead using the dot notation. The next example will sort articles by
their author's name::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('author.name');

The ``sortBy()`` method is flexible enough to let you specify an extractor
function that will let you dynamically select the value to use for comparing two
different values in the collection::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function ($article) {
        return $article->author->name . '-' . $article->title;
    });

In order to specify in which direction the collection should be sorted, you need
to provide either ``SORT_ASC`` or ``SORT_DESC`` as the second parameter for
sorting in ascending or descending direction respectively. By default,
collections are sorted in ascending direction::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

Sometimes you will need to specify which type of data you are trying to compare
so that you get consistent results. For this purpose, you should supply a third
argument in the ``sortBy()`` function with one of the following constants:

- **SORT_NUMERIC**: For comparing numbers
- **SORT_STRING**: For comparing string values
- **SORT_NATURAL**: For sorting string containing numbers and you'd like those
  numbers to be order in a natural way. For example: showing "10" after "2".
- **SORT_LOCALE_STRING**: For comparing strings based on the current locale.

By default, ``SORT_NUMERIC`` is used::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    If is often expensive to iterate sorted collections more than once. If you
    plan to do so, consider converting the collection to an array or simply use
    the ``compile()`` method on it.

Utiliser des Données en Arbre
=============================

.. php:method:: nest($idPath, $parentPath)

Not all data is meant to be represented in a linear way. Collections make it
easier to construct and flatten hierarchical or nested structures. Creating
a nested structure where children are grouped by a parent identifier property is
easy with the ``nest()`` method.

Two parameters are required for this function. The first one is the property
representing the item identifier. The second parameter is the name of the
property representing the identifier for the parent item::

    $items new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null], 'name' => 'Fish'],
    ]);

    $collection->nest('id', 'parent_id')->toArray();
    // Returns
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

Children elements are nested inside the ``children`` property inside each of the
items in the collection. This type of data representation is helpful for
rendering menus or traversing elements up to certain level in the tree.

.. php:method:: listNested($dir = 'desc', $nestingKey = 'children')

The inverse of ``nest()`` is ``listNested()``. This method allows you to flatten
a tree structure back into a linear structure. It takes two parameters, the
first one is the traversing mode (asc, desc or leaves), and the second one is
the name of the property containing the children for each element in the
collection.

Taking the input the nested collection built in the previous example, we can
flatten it::

    $nested->listNested()->toArray();

    // Returns
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

By default, the tree is traversed from the root to the leaves. You can also
instruct it to only return the leaf elements in the tree::

    $nested->listNested()->toArray();

    // Returns
    [
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

Autres Méthodes
===============

.. php:method:: contains($value)

Collections allow you to quickly check if they contain one particular
value: by using the ``contains()`` method::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

Comparisons are performed using the ``===`` operator. If you wish to do looser
comparison types you can use the ``some()`` method.

.. php:method:: shuffle()

Sometimes you may wish to show a collection of values in a random order. In
order to create a new collection that will return each value in a randomized
position, use the ``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // This could return ['b' => 2, 'c' => 3, 'a' => 1]
    $collection->shuffle()->toArray();

Retrait d'Eléments
------------------

.. php:method:: sample(int $size)

Shuffling a collection is often useful when doing quick statistical analysis.
Another common operation when doing this sort of task is withdrawing a few
random values out of a collection so that more tests can be performed on those.
For example, if you wanted to select 5 random users to which you'd like to apply
some A/B tests to, you can use the ``sample()`` function::

    $collection = new Collection($people);

    // Withdraw maximum 20 random users from this collection
    $testSubjects = $collection->sample(20);

``sample()`` will take at most the number of values you specify in the first
argument. If there are not enough elements in the collection to satisfy the
sample, the full collection in a random order is returned.

.. php:method:: take(int $size, int $from)

Whenever you want to take a slice of a collection use the ``take()`` function,
it will create a new collection with at most the number of values you specify in
the first argument, starting from the position passed in the second argument::

    $topFive = $collection->sortBy('age')->take(5);

    // Take 5 people from the collection starting from position 4
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

Positions are zero-based, therefore the first position number is ``0``.

Agrandir les Collections
------------------------

.. php:method:: append(array|Traversable $items)

You can compose multiple collections into a single one. This enables you to
gather data from various sources, concatenate it, and apply other collection
functions to it very smoothly. The ``append()`` method will return a new
collection containing the values from both sources::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // Tweets containing cakefest from both sources
    $myTimeline->filter(function ($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. warning::

    When appending from different sources, you can expect some keys from both
    collections to be the same. For example, when appending two simple arrays.
    This can present a problem when converting a collection to an array using
    ``toArray()``. If you do not want values from one collection to override
    others in the previous one based on their key, make sure that you call
    ``toArray(false)`` in order to drop the keys and preserve all values.

Modification d'Eléments
-----------------------

.. php:method:: insert(string $path, array|Traversable $items)

At times, you may have two separate sets of data that you would like to insert
the elements of one set into each of the elements of the other set. This is
a very common case when you fetch data from a data source that does not support
data-merging or joins natively.

Collections offer an ``insert()`` method that will allow you to insert each of
the elements in one collection into a property inside each of the elements of
another collection::

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

When converted to an array, the ``$merged`` collection will look like this::

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

The first parameter for the ``insert()`` method is a dot-separated path of
properties to follow so that the elements can be inserted at that position. The
second argument is anything that can be converted to a collection object.

Please observe that elements are inserted by the position they are found, thus,
the first element of the second collection is merged into the first
element of the first collection.

If there are not enough elements in the second collection to insert into the
first one, then the target property will be filled with ``null`` values::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

    // Will yield
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => null]
    ];

The ``insert()`` method can operate array elements or objects implementing the
``ArrayAccess`` interface.

Optimiser les Collections
-------------------------

.. php:method:: buffered()

Collections often perform most operations that you create using its functions in
a lazy way. This means that even though you can call a function, it does not
mean it is executed right away. This is true for a great deal of functions in
this class. Lazy evaluation allows you to save resources in situations
where you don't use all the values in a collection. You might not use all the
values when iteration stops early, or when an exception/failure case is reached
early.

Additionally, lazy evaluation helps speed up some operations. Consider the
following example::

    $collection = new Collection($oneMillionItems);
    $collection->map(function ($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

Had the collections not been lazy, we would have executed one million operations,
even though we only wanted to show 30 elements out of it. Instead, our map
operation was only applied to the 30 elements we used. We can also
derive benefits from this lazy evaluation for smaller collections when we
do more than one operation on them. For example: calling ``map()`` twice and
then ``filter()``.

Lazy evaluation comes with its downside too. You could be doing the same
operations more than once if you optimize a collection prematurely. Consider
this example::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function ($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function ($item) {
        return $item > 30;
    });

If we iterate both ``youngerThan30`` and ``olderThan30``, the collection would
unfortunately execute the ``extract()`` operation twice. This is because
collections are immutable and the lazy-extracting operation would be done for
both filters.

Luckily we can overcome this issue with a single function. If you plan to reuse
the values from certain operations more than once, you can compile the results
into another collection using the ``buffered()`` function::

    $ages = $collection->extract('age')->buffered();
    $youngerThan30 = ...
    $olderThan30 = ...

Now, when both collections are iterated, they will only call the
extracting operation once.

Rendre les Collections Rembobinables
------------------------------------

The ``buffered()`` method is also useful for converting non-rewindable iterators
into collections that can be iterated more than once::

    // In PHP 5.5+
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

Sometimes you need to get a clone of the elements from another
collection. This is useful when you need to iterate the same set from different
places at the same time. In order to clone a collection out of another use the
``compile()`` method::

    $ages = $collection->extract('age')->compile();

    foreach ($ages as $age) {
        foreach ($collection as $element) {
            echo h($element->name) . ' - ' . $age;
        }
    }

.. meta::
    :title lang=fr: Collections
    :keywords lang=fr: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold
