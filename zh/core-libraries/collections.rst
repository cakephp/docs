Collections
###########

.. php:namespace:: Cake\Collection

.. php:class:: Collection

集合类(Collection classes)提供了一组工具来操作数组或 ``Traversable(横穿)`` 
对象。如果你使用过underscore.js，你就能对 ``Traversable`` 对象所具有的功能有大致的
了解。

Collection的实例是不可变的; 修改一个Collection将会产生一个新的Collection。这让使用
Collection对象产生更少的副作用并且有更多的可预测性。

简单例子
=============

Collections可以使用数组或者 ``Traversable`` 对象创建出来。每当你操作CakePHP中的
ORM时，你也会和Collections发生作用。
Collection的一个简单使用::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // 创建一个包含元素的新Collection
    // 拥有比1大的值。
    $overOne = $collection->filter(function ($value, $key, $iterator) {
        return $value > 1;
    });

你也可以使用 ``collection()`` 这种helper（辅助）方法来替代 ``new
Collection()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];

    // 这两个都创建出Collection实例.
    $collectionA = new Collection($items);
    $collectionB = collection($items);

使用helper方法的优点是比 ``new Collection($items)`` 更容易建立连接。

:php:trait:`~Cake\\Collection\\CollectionTrait` 能让你将类似collection的功能都
任意地整合进应用中已有的 ``Traversable`` 对象。

方法（Methods）列表
===============

.. csv-table::
    :class: docutils internal-toc

    :php:meth:`append`, :php:meth:`avg`, :php:meth:`buffered`, :php:meth:`chunk`
    :php:meth:`chunkWithKeys`, :php:meth:`combine`, :php:meth:`compile`, :php:meth:`contains`
    :php:meth:`countBy`, :php:meth:`each`, :php:meth:`every`, :php:meth:`extract`
    :php:meth:`filter`, :php:meth:`first`, :php:meth:`groupBy`, :php:meth:`indexBy`
    :php:meth:`insert`, :php:meth:`isEmpty`, :php:meth:`last`, :php:meth:`listNested`
    :php:meth:`map`, :php:meth:`match`, :php:meth:`max`, :php:meth:`median`
    :php:meth:`min`, :php:meth:`nest`, :php:meth:`reduce`, :php:meth:`reject`
    :php:meth:`sample`, :php:meth:`shuffle`, :php:meth:`skip`, :php:meth:`some`
    :php:meth:`sortBy`, :php:meth:`stopWhen`, :php:meth:`sumOf`, :php:meth:`take`
    :php:meth:`through`, :php:meth:`transpose`, :php:meth:`unfold`, :php:meth:`zip`

迭代（Iterating）
===================

.. php:method:: each(callable $c)

Collections 可以通过 ``each()`` 和 ``map()`` 方法来转换为一个新的Collections。 
``each()`` 方法不会创建一个新的Collection，但是能让你修改Collection中的任意对象::

    $collection = new Collection($items);
    $collection = $collection->each(function ($value, $key) {
        echo "Element $key: $value";
    });


``each()`` 的返回值是一个Collection对象。Each会迅速迭代Collection同时将结果回调到
Collection中的每个值上。

.. php:method:: map(callable $c) 
``map()``方法会基于一开始的Collection内的各对象产生回调影响后的输出结果，来创建一个
新Collection::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function ($value, $key) {
        return $value * 2;
    });

    // $result的内容是 ['a' => 2, 'b' => 4, 'c' => 6];
    $result = $new->toArray();

``map()`` 通过迭代时逐渐更新内部项目来创建一个新的迭代器。

.. php:method:: extract($matcher)

``map()`` 的一个最常用的功能是从Collection中选取一个单独的项目。如果你打算建一个由
个别属性值的元素组成的列表，你可以使用 ``extract()`` 方法::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result 内容是 ['mark', 'jose', 'barbara'];
    $result = $names->toArray();

Collection中还存在着很多其它方法，你也可以使用点分割的表现方式来选取需要的项目。这个例子
将会返回一个从文章列表里提取的作者名（author names）的Collection::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result 内容是 ['Maria', 'Stacy', 'Larry'];
    $result = $names->toArray();

最后，如果你使用的属性不被认为是一个正确的路劲，你可以用一个回调方法返回它::

    $collection = new Collection($articles);
    $names = $collection->extract(function ($article) {
        return $article->author->name . ', ' . $article->author->last_name;
    });

时常有这么一回事，你需要选取（extract）一个在复杂的数组或对象中，被嵌套在其它结构
里面共同的键（这里指的是'number')。这种情况你可以用 ``{*}`` 来配对表路劲的键。当你从
HasMany（有很多）和BelongsToMany（属于很多）的关联数据中进行选取时，这种匹配方式会很实用::

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
    // Returns ['number-1', 'number-2', 'number-3', 'number-4', 'number-5']

这个例子和其它例子不同，使用的是 ``toList()`` 方法。这是个我们在有可能有相同的键的时候
也能得到结果的重要方法。 ``toList()`` 方法允许我们在即使有很多键重复的情况下也能得到所
有的值。

不同于 :php:meth:`Cake\\Utility\\Hash::extract()` ，这个方法只允许 ``{*}`` 通配符。
并不支持其它的通配符和匹配属性。

.. php:method:: combine($keyPath, $valuePath, $groupPath = null)

Collections允许你在已有的Collection的基础上创建一个由键值对组成的新的Collection。
键和值的路径都可以使用点记法来表示::

    $items = [
        ['id' => 1, 'name' => 'foo', 'parent' => 'a'],
        ['id' => 2, 'name' => 'bar', 'parent' => 'b'],
        ['id' => 3, 'name' => 'baz', 'parent' => 'a'],
    ];
    $combined = (new Collection($items))->combine('id', 'name');

    // Result will look like this when converted to array
    [
        1 => 'foo',
        2 => 'bar',
        3 => 'baz',
    ];

你也可以选择性地使用 ``groupPath`` 来将基于键值对的结果分组::

    $combined = (new Collection($items))->combine('id', 'name', 'parent');

    // Result will look like this when converted to array
    [
        'a' => [1 => 'foo', 3 => 'baz'],
        'b' => [2 => 'bar']
    ];

最后你可以用 *closures* 来动态地构建一个keys/values/groups路径，比方说当你需要用到entities（实体）和dates（日期）时（被ORM转换成了 ``Cake/Time`` 的实例），你可能会想要将结果根据日期（date）进行分组::

    $combined = (new Collection($entities))->combine(
        'id',
        function ($entity) { return $entity; },
        function ($entity) { return $entity->date->toDateString(); }
    );

    // 当转换成数组时结果将会像以下
    [
        'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
        'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    ]

.. php:method:: stopWhen(callable $c)

你可以通过 ``stopWhen()`` 方法在任意点上停止迭代。在Collection中使用这个方法时，如果某
一个元素传入可调用方法返回false，将会产生一个新的Collection并停止产生其它返回结果::

    $items = [10, 20, 50, 1, 2];
    $collection = new Collection($items);

    $new = $collection->stopWhen(function ($value, $key) {
        // 在出现第一个大于30的值的时停止
        return $value > 30;
    });

    // $result 内容是 [10, 20];
    $result = $new->toArray();

.. php:method:: unfold(callable $c)

有时Collection的内部项目包含有拥有更多内部项目的数组或迭代器。如果你希望让这些内部结构变得平行并且一次迭代就能遍历所有元素，你可以使用 ``unfold()`` 方法。它将会创建一个单一嵌套着每个元素的新Collection::

    $items = [[1, 2, 3], [4, 5]];
    $collection = new Collection($items);
    $new = $collection->unfold();

    // $result 内容是 [1, 2, 3, 4, 5];
    $result = $new->toList();

当传递一个可调用函数到 ``unfold()`` 时，你可以控制原始的Collection中的项目的哪一个来
执行unfolded（展开）操作。这在返回分页服务的数据时很有帮助::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // 返回一页结果的假想web服务
        return MyService::fetchPage($page)->toArray();
    });

    $allPagesItems = $items->toList();

如果你使用的是PHP 5.5+版本，你在 ``unfold()`` 中使用关键词 ``yield`` 来返回Collection的
每个项目中你需要数量的元素::

    $oddNumbers = [1, 3, 5, 7];
    $collection = new Collection($oddNumbers);
    $new = $collection->unfold(function ($oddNumber) {
        yield $oddNumber;
        yield $oddNumber + 1;
    });

    // $result 内容是 [1, 2, 3, 4, 5, 6, 7, 8];
    $result = $new->toList();


.. php:method:: chunk($chunkSize)

当处理Collection中包含有非常多数量的项目时，把它们批量处理或许比一个个处理更好一点。你
可以使用 ``chunk()`` 将一个Collection分割成多个固定容量的数组::

    $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    $collection = new Collection($items);
    $chunked = $collection->chunk(2);
    $chunked->toList(); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]]

``chunk`` 方法在进行批量处理时非常有用，用一个数据库结果来举例子::

    $collection = new Collection($articles);
    $collection->map(function ($article) {
            // Change a property in the article
            $article->property = 'changed';
        })
        ->chunk(20)
        ->each(function ($batch) {
            myBulkSave($batch); // 该方法将会被每个批量处理（batch）调用
        });

.. php:method:: chunkWithKeys($chunkSize)

与 :php:meth:`chunk()`相似，``chunkWithKeys()`` 允许你将一个Collection保留着键分割
成更小的几部分进行处理。这在分割关联数组时十分有用::
 
    $collection = new Collection([
        'a' => 1,
        'b' => 2,
        'c' => 3,
        'd' => [4, 5]
    ]);
    $chunked = $collection->chunkWithKeys(2)->toList();
    // Creates
    [
        ['a' => 1, 'b' => 2],
        ['c' => 3, 'd' => [4, 5]]
    ]

.. versionadded:: 3.4.0
    ``chunkWithKeys()`` was added in 3.4.0

过滤（Filtering）
==================

.. php:method:: filter(callable $c)

Collections能够基于回调方法简单地过滤并创建新的Collection。你能用 ``filter()`` 
创建一个符合回调标准元素构成的Collection::

    $collection = new Collection($people);
    $ladies = $collection->filter(function ($person, $key) {
        return $person->gender === 'female';
    });
    $guys = $collection->filter(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: reject(callable $c)

与 ``filter()`` 对立的是 ``reject()``。该方法执行一个消极过滤，它将符合过滤条件的元素
都删除::

    $collection = new Collection($people);
    $ladies = $collection->reject(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: every(callable $c)

你可以用过滤方法来进行真伪测试。要检测是否Collection中每个元素都符合测试条件的
话你可以使用 ``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function ($person) {
        return $person->age < 21;
    });

.. php:method:: some(callable $c)

你可以用 `some()`` 方法来检测Collection中包含的元是否至少有一个符合过滤条件::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function ($person) {
        return $person->age < 21;
    });

.. php:method:: match(array $conditions)

你想要提取出一个只包含你指定属性的元素的新Collection的话，你可以使用
``match()`` 方法::

    $collection = new Collection($comments);
    $commentsFromMark = $collection->match(['user.name' => 'Mark']);

.. php:method:: firstMatch(array $conditions)

属性名可以用点记法表示。你可以遍历过嵌套着的实例并匹配它们的值，当你只需要第一个匹配
的元素时，你可以用 ``firstMatch()``::

    $collection = new Collection($comments);
    $comment = $collection->firstMatch([
        'user.name' => 'Mark',
        'active' => true
    ]);

就像你在上面看到的那样， ``match()`` 和 ``firstMatch()`` 都让你能用复数条件进行匹配。
另外，条件能用于不同的路径，能够允许你用复杂的方式表现。

集成（Aggregation）
======================

.. php:method:: reduce(callable $c)

``map()`` 的对立操作是 ``reduce()`` 。该方法能够从Collection的所有元素中得到一
个单一的结果::

    $totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
        return $accumulated + $orderLine->price;
    }, 0);

在上面例子中， ``$totalPrice`` 将是集合中所有单价的总和。需要注意 ``reduce()`` 
的第二个参数将为reduce操作传递一个初期值::

    $allTags = $collection->reduce(function ($accumulated, $article) {
        return array_merge($accumulated, $article->tags);
    }, []);

.. php:method:: min(string|callable $callback, $type = SORT_NUMERIC)

To extract the minimum value for a collection based on a property, just use the
``min()`` function. This will return the full element from the collection and
not just the smallest value found::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $youngest->name;

You are also able to express the property to compare by providing a path or a
callback function::

    $collection = new Collection($people);
    $personYoungestChild = $collection->min(function ($person) {
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

Finally, the ``sumOf()`` method will return the sum of a property of all
elements::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

.. php:method:: avg($matcher = null)

Calculate the average value of the elements in the collection. Optionally
provide a matcher path, or function to extract values to generate the average
for::

    $items = [
       ['invoice' => ['total' => 100]],
       ['invoice' => ['total' => 200]],
    ];

    // Average: 150
    $average = (new Collection($items))->avg('invoice.total');

.. versionadded:: 3.5.0

.. php:method:: median($matcher = null)

Calculate the median value of a set of elements. Optionally provide a matcher
path, or function to extract values to generate the median for::

    $items = [
      ['invoice' => ['total' => 400]],
      ['invoice' => ['total' => 500]],
      ['invoice' => ['total' => 100]],
      ['invoice' => ['total' => 333]],
      ['invoice' => ['total' => 200]],
    ];

    // Median: 333
    $median = (new Collection($items))->median('invoice.total');

.. versionadded:: 3.5.0

Grouping and Counting
---------------------

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

.. php:method:: zip($elements)

The elements of different collections can be grouped together using the
``zip()`` method. It will return a new collection containing an array grouping
the elements from each collection that are placed at the same position::

    $odds = new Collection([1, 3, 5]);
    $pairs = new Collection([2, 4, 6]);
    $combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]

You can also zip multiple collections at once::

    $years = new Collection([2013, 2014, 2015, 2016]);
    $salaries = [1000, 1500, 2000, 2300];
    $increments = [0, 500, 500, 300];

    $rows = $years->zip($salaries, $increments)->toList();
    // Returns:
    [
        [2013, 1000, 0],
        [2014, 1500, 500],
        [2015, 2000, 500],
        [2016, 2300, 300]
    ]

As you can already see, the ``zip()`` method is very useful for transposing
multidimensional arrays::

    $data = [
        2014 => ['jan' => 100, 'feb' => 200],
        2015 => ['jan' => 300, 'feb' => 500],
        2016 => ['jan' => 400, 'feb' => 600],
    ]

    // Getting jan and feb data together

    $firstYear = new Collection(array_shift($data));
    $firstYear->zip($data[0], $data[1])->toList();

    // Or $firstYear->zip(...$data) in PHP >= 5.6

    // Returns
    [
        [100, 300, 400],
        [200, 500, 600]
    ]

Sorting
=======

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
collections are sorted in descending direction::

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

    It is often expensive to iterate sorted collections more than once. If you
    plan to do so, consider converting the collection to an array or simply use
    the ``compile()`` method on it.

Working with Tree Data
======================

.. php:method:: nest($idPath, $parentPath)

Not all data is meant to be represented in a linear way. Collections make it
easier to construct and flatten hierarchical or nested structures. Creating
a nested structure where children are grouped by a parent identifier property is
easy with the ``nest()`` method.

Two parameters are required for this function. The first one is the property
representing the item identifier. The second parameter is the name of the
property representing the identifier for the parent item::

    $collection = new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
    ]);

    $collection->nest('id', 'parent_id')->toArray();
    // Returns
    [
        [
            'id' => 1,
            'parent_id' => null,
            'name' => 'Birds',
            'children' => [
                ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds', 'children' => []],
                ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle', 'children' => []],
                ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull', 'children' => []],
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
a tree structure back into a linear structure. It takes two parameters; the
first one is the traversing mode (asc, desc or leaves), and the second one is
the name of the property containing the children for each element in the
collection.

Taking the input the nested collection built in the previous example, we can
flatten it::

    $nested->listNested()->toList();

    // Returns
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
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

Other Methods
=============

.. php:method:: isEmpty()

Allows you to see if a collection contains any elements::

    $collection = new Collection([]);
    // Returns true
    $collection->isEmpty();

    $collection = new Collection([1]);
    // Returns false
    $collection->isEmpty();

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

    // This could return [2, 3, 1]
    $collection->shuffle()->toArray();

.. php:method:: transpose()

When you transpose a collection, you get a new collection containing a row made
of the each of the original columns::

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
    ``Collection::transpose()`` was added in 3.3.0.

Withdrawing Elements
--------------------

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

.. php:method:: skip(int $positions)

While the second argument of ``take()`` can help you skip some elements before
getting them from the collection, you can also use ``skip()`` for the same
purpose as a way to take the rest of the elements after a certain position::

    $collection = new Collection([1, 2, 3, 4]);
    $allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]

.. php:method:: first()

One of the most common uses of ``take()`` is getting the first element in the
collection. A shortcut method for achieving the same goal is using the
``first()`` method::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->first(); // Returns 5

.. php:method:: last()

Similarly, you can get the last element of a collection using the ``last()``
method::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->last(); // Returns 2

Expanding Collections
---------------------

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
    ``toList()`` in order to drop the keys and preserve all values.

Modifiying Elements
-------------------

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

Making Collection Methods Reusable
----------------------------------

Using closures for collection methods is great when the work to be done is small
and focused, but it can get messy very quickly. This becomes more obvious when
a lot of different methods need to be called or when the length of the closure
methods is more than just a few lines.

There are also cases when the logic used for the collection methods can be
reused in multiple parts of your application. It is recommended that you
consider extracting complex collection logic to separate classes. For example,
imagine a lengthy closure like this one::

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

This can be refactored by creating another class::

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

Sometimes a chain of collection method calls can become reusable in other parts
of your application, but only if they are called in that specific order. In
those cases you can use ``through()`` in combination with a class implementing
``__invoke`` to distribute your handy data processing calls::

        $collection
                ->map(new ShippingCostCalculator)
                ->map(new TotalOrderCalculator)
                ->map(new GiftCardPriceReducer)
                ->buffered()
               ...

The above method calls can be extracted into a new class so they don't need to
be repeated every time::

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


        // Now you can use the through() method to call all methods at once
        $collection->through(new FinalCheckOutRowProcessor);

Optimizing Collections
----------------------

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
    $collection = $collection->map(function ($item) {
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

Making Collections Rewindable
-----------------------------

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

Cloning Collections
-------------------

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
    :title lang=en: Collections
    :keywords lang=en: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold, through
