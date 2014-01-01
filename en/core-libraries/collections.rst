.. _collection-objects:

.. php:namespace:: Cake\Collection

Collections
###########

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

* reject, every, some, match, firstMatch,


Aggregation
===========

* min, max, reduce, extract, groupBy, indexBy, countBy,

Sorting
=======

* sortBy

Other methods
=============

* contains, reduce, shuffle, sample, take, append, compile


.. meta::
    :title lang=en: Collections
    :keywords lang=en: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
