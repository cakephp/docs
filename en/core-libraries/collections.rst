.. _collection-objects:

.. php:namespace:: Cake\Collection

Collections
###########

.. php:class:: Collection

The collection classes provide a set of tools to manipulate arrays or
``Traversable`` objects. If you have ever used underscore.js you have an idea of
what you can expect from the collection classes.

Collection instances are immutable, modifying a collection will instead generate
a new collection. This makes working with collection objects more predictable as
operations are side-effect free.

Quick Example
=============

Collections can be created using an array or Traversable object. You'll also
interact with collections every time you interact with the ORM in CakePHP.
A simple use of a Collection would be::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // Create a new collection containing elements
    // with a value greater than one.
    $overOne = $collection->filter(function($value, $key, $iterator) {
        return $value > 1;
    });

The :php:trait:`~Cake\\Collection\\CollectionTrait` allows you to integrate
collection like features into any Traversable object you have in your
application as well.

Iterating
=========

Collections can be iterated and or transformed into new collections with the
``each`` and ``map`` methods. The ``each`` method will not create a new
collection, but will allow you to modify any objects within the collection::

    $collection = new Collection($items);
    $collection = $collection->each(function($value, $key) {
        echo "Element $key: $value";
    });

The return of ``each()`` will be the collection object. Each will iterate the
collection immediately applying the callback to each value in the collection.
The ``map()`` method will create a new collection based on the output of the
callback being applied to each object in the original collection::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function($value, $key) {
        return $value * 2;
    });

    // $result contains [2, 4, 6];
    $result = $new->toArray();

The ``map()`` method will create a new iterator, that lazily creates
the resulting items when iterated.

Filtering
=========

Collections make it easy to filter and create new collections based on
the result of callback functions. You can use ``filter()`` to create a new
collection of elements matching a criteria callback::

    $collection = new Collection($people);
    $ladies = $collection->filter(function($person, $key) {
        return $person->gender === 'female';
    });
    $guys = $collection->filter(function($person, $key) {
        return $person->gender === 'male';
    });

The inverse of ``filter()`` is ``reject()``. This method does a negative filter,
removing elements that match the filter function::

    $collection = new Collection($people);
    $ladies = $collection->reject(function($person, $key) {
        return $person->gender === 'male';
    });

You can do truth tests with filter functions. To see if every element in
a collection matches a test you can use ``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function($person) {
        return $person->age < 21;
    });

You can see if the collection contains at least one element matching a filter
function using the ``some()`` method::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function($person) {
        return $person->age < 21;
    });

If you need to extract a new collection containing only the elements that
contain a given set of properties you should use the ``match()`` method::

    $collection = new Collection($comments);
    $commentsFromMark = $collection->match(['user.name' => 'Mark']);

The property name can be a dot separated path. You can traverse into nested
entities and match the values they contain. When you only need the first
matching element from a collection, you can use ``firstMatch()``::

    $collection = new Collection($comments);
    $comment = $collection->firstMatch([
        'user.name' => 'Mark',
        'active' => true
    ]);

As you can see from the above, both ``match()`` and ``firstMatch()`` allow you to provide multiple conditions
to match on. In addition the conditions can be for different paths allowing you
to express complex conditions to match against.

Aggregation
===========

One of the most common uses for a ``map`` function is to extract a single column
from a collection. If you are looking to build a list of elements containing the
values for a particular property, you can use the ``extract`` method::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result contains ['mark', 'jose', 'barbara'];
    $result = $names->toArray();

As with many other functions in the collection class, you are allowed to specify
a dot separated path for extracting columns, this example will return
a collection containing the author names from a list of articles::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result contains ['Maria', 'Stacy', 'Larry'];
    $result = $names->toArray();

Finally, if the property you are looking after cannot be expressed as a path,
you can use a callback function to return it::

    $collection = new Collection($articles);
    $names = $collection->extract(function($article) {
        return $article->author->name ', ' . $article->author->last_name;
    });

The counterpart of a ``map`` operation is usually a ``reduce``, this function
will help you build a single result out of all the elements in a collection::

    $totalPrice = $collection->reduce(function($orderLine, $accumulated) {
        return $accumulated + $orderLine->price;
    }, 0);

In the above example, ``$totalPrice`` will be the sum of all single prices
contained in the collection. Note the second argument for the ``reduce``
function, it takes the initial value for the reduce operation you are
performing::

    $allTags = $collection->reduce(function($article, $accumulated) {
        return array_merge($accumulated, $article->tags);
    }, []);

To extract the minimum value for a collection, based on a property, just use the
``min`` function, this will return the full element from the collection and not
just the smallest value found::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $yougest->name;

You are also able to express the property to compare by providing a path or a
callback function::

    $collection = new Collection($people);
    $personYougestChild = $collection->min(function($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

The same can be applied to the ``max`` function, which will return a single
element from the collection having the highest property value::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->min('dad.age');

Grouping and Counting
---------------------

Collection values can be grouped by different keys in a new collection when they
share the same value for a property::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy' 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');

    //Result will look like this when converted to array:
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

As usual, it is possible to provide either a dot separated path for nested
properties or your own callback function to generate the groups dynamically::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function($student) {
        retrun $student->grade > 6 ? 'approved' : 'reproved';
    });

If you only wish to know the number of occurrences per group, you can do so by
using the ``countBy`` method, it takes the same arguments as ``groupBy`` so it
should be already familiar to you::

    $classResults = $students->countBy(function($student) {
        retrun $student->grade > 6 ? 'approved' : 'reproved';
    });

    //Result could look like this when converted to array:
    ['approved' => 70, 'reproved' => 20]

There will be certain cases where you know an element is unique for the property
you want to group by. If you wish a single result per group, you can use the
function ``indexBy``::

    $usersById = $users->indexBy('id');

    //When converted to array result could look like
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

As with the ``groupBy`` function you can also use a property path or
a callback::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function($file) {
        return md5($file);
    });

Sorting
=======

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

The ``sortBy`` method is flexible enough to let you specify an extractor
function that will let you select dynamically the value to use for comparing two
different values in the collection::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function($article) {
        return $article->author->name . '-' . $article->title;
    });

In order to specify in which direction the collection should be sorted, you need
to provide either ``SORT_ASC`` or ``SORT_DESC`` as the second parameter for
sorting in ascending or descending direction respectively. By default,
collections are sorted in ascending direction::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

Sometimes you will need to specify which type of data you are trying to compare
so that you get consistent results. For this purpose you should supply as third
argument in the ``sortBy`` function one of the following constants:

- **SORT_NUMERIC**: For comparing numbers
- **SORT_STRING**: For comparing string values
- **SORT_NATURAL**: For sorting string containing numbers and you'd like those
  numbers to be order in a natural way. For example showing "10" after "2".
- **SORT_LOCALE_STRING**: For comparing strings based on the current locale.

By default ``SORT_NUMERIC`` is used::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    If is often expensive to iterate sorted collections more than once, if you
    plan to do so, consider converting the collection to an array or simply use
    the ``compile`` method on it.

Other Methods
=============

Collections allow you to quickly check if they contain one particular
value: by using the ``contains`` method::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

Comparisons are performed using the ``===`` operator. If you wish to do looser
comparison types you can use the ``some`` method.

Sometimes you may wish to show a collection of values in a random order. In
order to create a new collection that will return each value in a randomized
position, use the ``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // This could return ['b' => 2, 'c' => 3, 'a' => 1]
    $collection->shuffle()->toArray();

Withdrawing Elements
--------------------

Shuffling a collection is often useful when doing quick statistical analysis,
another common operation when doing this sort of tasks is withdrawing a few
random values out of a collection so that more tests can be performed on those.
For example, if you wanted to select 5 random users to which you'd like to apply
some A/B tests to, you can use the ``sample`` function::

    $collection = new Colllection($people);

    // withdraw maximum 20 random users from this collection
    $testSubjects = $collection->sample(20);

``sample`` will take at most the number of values you specify in the first argument,
if there are not enough elements in the collection to satisfy the sample, the
full collection in a random order is returned.

Whenever you want to take a slice of a collection use the ``take`` function, it
will create a new collection with at most the number of values you specify in the
first argument, starting from the position passed in the second argument::

    $topFive = $collection->sortBy('age')->take(5);

    // Take 5 people from the collection starting from position 4
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

Positions are zero-based, therefore the first position number is ``0``.

Expanding Collections
---------------------

You can compose multiple collections into a single one. This enables you to
gather data from various sources, concatenate it and apply other collection
functions to it very smoothly. The ``append`` method will return a new
collection containing the values from both sources::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // Tweets containing cakefest from both sources
    $myTimeline->filter(function($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. warning::

    When appending from different sources you can expect some keys from both
    collections to be the same, for example when appending two simple arrays.
    This can present a problem when converting a collection to an array using
    ``toArray``. If you do not want values from one collection to override
    others in the previous one based on their key, make sure that you call
    ``toArray(false)`` in order to drop the keys and preserve all values.

Modifiying Elements
-------------------

At times, you may have two separate sets of data that you would like to insert
the elements of one set into each of the elements of the other set. This is
a very common case when you fetch data from a data source that does not support
data merging or joins natively.

Collections offer an ``insert`` method that will allow you to insert each of the
elements in one collection into a property inside each of elements of another
collection::

    $users = [
        ['username' => 'mark'],
        ['username' => 'juan'],
        ['username' => 'jose']
    ];

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript'],
        ['Javascript', 'Prolog'],
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

When converted to an array, the ``$merged`` collection will look like this::

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

The first parameter for the ``insert`` method is a dot separated path of
properties to follow so that the elements can be inserted at that position. The
second argument is anything that can be converted to a collection object.

Please observe that elements are inserted by the position they are found, thus,
the first element of the second collection is merged into the first
element of the first collection.

If there are not enough elements in the second collection to insert into the
first one, then the target property will be filled with ``null`` values::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript'],
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

    // Will yield

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => null]
    ];

The ``insert`` method can operate array elements or objects implementing the
``ArrayAccess`` interface.

Optimizing Collections
----------------------

Collections often perform most operations that you create using its functions in
a lazy way. This means that even though you can call a function, it does not
mean it is executed right away. This is true for a great deal of functions in
this class. Lazy evaluation allows allows you to save resources in situations
where you don't use all the values in a collection. You might not use all the
values when iteration stops early, or when an exception/failure case is reached
early.

Additionally lazy evaluation helps speed up some operations, consider the
following example::

    $collection = new Collection($oneMillionItems);
    $collection->map(function($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

Had collections not being lazy, we would have executed one million operations,
even though we only wanted to show 30 elements out of it. Instead, our map
operation was only applied to the 30 elements we used. We can also
derive benefits from this lazy evaluation even for smaller collections when we
do more than one operation on them, for example calling ``map`` twice and then
``filter``.

Lazy evaluation comes with its downside too, you could be doing the same
operations more than once if you optimize it first. Consider now this example::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function($item) {
        return $item > 30;
    });

If we iterate both ``youngerThan30`` and ``olderThan30`` collection we would be,
unfortunately, executing the ``extract`` operation twice. This is because
collections are immutable and the lazy extracting operation would be done for
both filters.

Luckily we can overcome this issue with a single function. If you plan to reuse
the values from certain operations more than once, you can compile the results
into another collection using the ``compile`` function::

    $ages = $collection->extract('age')->compile();
    $youngerThan30 = ...
    $olderThan30 = ...

Now when the those 2 collections are iterated, they will only call the
extracting operation once.

.. meta::
    :title lang=en: Collections
    :keywords lang=en: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert
