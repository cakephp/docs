集合
######################

.. php:namespace:: Cake\Collection

.. php:class:: Collection

集合类(Collection classes)提供了一组工具来操作数组或 ``Traversable(横穿)`` 
对象。如果你使用过underscore.js，你就能对 ``Traversable`` 对象所具有的功能有大致的
了解。

集合的实例是不可变的; 修改一个集合将会产生一个新的集合。这让使用
集合对象产生更少的副作用并且有更多的可预测性。

简单例子
=============

集合可以使用数组或者 ``Traversable`` 对象创建出来。每当你操作CakePHP中的
ORM时，你也会和集合发生作用。
集合的一个简单使用::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // 创建一个包含元素的新集合
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
====================

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

集合可以通过 ``each()`` 和 ``map()`` 方法来转换为一个新的集合。 
``each()`` 方法不会创建一个新的集合，但是能让你修改集合中的任意对象::

    $collection = new Collection($items);
    $collection = $collection->each(function ($value, $key) {
        echo "Element $key: $value";
    });


``each()`` 的返回值是一个集合对象。Each会迅速迭代集合同时将结果回调到
集合中的每个值上。

.. php:method:: map(callable $c)

``map()`` 方法会基于一开始的集合内的各对象产生回调影响后的输出结果，来创建一个
新集合::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function ($value, $key) {
        return $value * 2;
    });

    // $result的内容是 ['a' => 2, 'b' => 4, 'c' => 6];
    $result = $new->toArray();

``map()`` 通过迭代时逐渐更新内部项目来创建一个新的迭代器。

.. php:method:: extract($matcher)

``map()`` 的一个最常用的功能是从集合中选取一个单独的项目。如果你打算建一个由
个别属性值的元素组成的列表，你可以使用 ``extract()`` 方法::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result 内容是 ['mark', 'jose', 'barbara'];
    $result = $names->toArray();

集合中还存在着很多其它方法，你也可以使用点分割的表现方式来选取需要的项目。这个例子
将会返回一个从文章列表里提取的作者名（author names）的集合::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result 内容是 ['Maria', 'Stacy', 'Larry'];
    $result = $names->toArray();

最后，如果你使用的属性不被认为是一个正确的路径，你可以用一个回调方法返回它::

    $collection = new Collection($articles);
    $names = $collection->extract(function ($article) {
        return $article->author->name . ', ' . $article->author->last_name;
    });

时常有这么一回事，你需要选取（extract）一个在复杂的数组或对象中，被嵌套在其它结构
里面共同的键（这里指的是'number')。这种情况你可以用 ``{*}`` 来配对表路径的键。当你从
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

集合允许你在已有的集合的基础上创建一个由键值对组成的新的集合。
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

    // 当转换成数组后结果将会如下
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

    // 当转换成数组时结果将会如下
    [
        'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
        'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    ]

.. php:method:: stopWhen(callable $c)

你可以通过 ``stopWhen()`` 方法在任意点上停止迭代。在集合中使用这个方法时，如果某
一个元素传入可调用方法返回false，将会产生一个新的集合并停止产生其它返回结果::

    $items = [10, 20, 50, 1, 2];
    $collection = new Collection($items);

    $new = $collection->stopWhen(function ($value, $key) {
        // 在出现第一个大于30的值的时停止
        return $value > 30;
    });

    // $result 内容是 [10, 20];
    $result = $new->toArray();

.. php:method:: unfold(callable $c)

有时集合的内部项目包含有拥有更多内部项目的数组或迭代器。如果你希望让这些内部结构变得平行并且一次迭代就能遍历所有元素，你可以使用 ``unfold()`` 方法。它将会创建一个单一嵌套着每个元素的新集合::

    $items = [[1, 2, 3], [4, 5]];
    $collection = new Collection($items);
    $new = $collection->unfold();

    // $result 内容是 [1, 2, 3, 4, 5];
    $result = $new->toList();

当传递一个可调用函数到 ``unfold()`` 时，你可以控制原始的集合中的项目的哪一个来
执行unfolded（展开）操作。这在返回分页服务的数据时很有帮助::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // 返回一页结果的假想web服务
        return MyService::fetchPage($page)->toArray();
    });

    $allPagesItems = $items->toList();

如果你使用的是PHP 5.5+版本，你在 ``unfold()`` 中使用关键词 ``yield`` 来返回集合的
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

当处理集合中包含有非常多数量的项目时，把它们批量处理或许比一个个处理更好一点。你
可以使用 ``chunk()`` 将一个集合分割成多个固定容量的数组::

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

与 :php:meth:`chunk()`相似，``chunkWithKeys()`` 允许你将一个集合保留着键分割
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

集合能够基于回调方法简单地过滤并创建新的集合。你能用 ``filter()`` 
创建一个符合回调标准元素构成的集合::

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

你可以用过滤方法来进行真伪测试。要检测是否集合中每个元素都符合测试条件的
话你可以使用 ``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function ($person) {
        return $person->age < 21;
    });

.. php:method:: some(callable $c)

你可以用 `some()`` 方法来检测集合中包含的元是否至少有一个符合过滤条件::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function ($person) {
        return $person->age < 21;
    });

.. php:method:: match(array $conditions)

你想要提取出一个只包含你指定属性的元素的新集合的话，你可以使用
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

``map()`` 的对立操作是 ``reduce()`` 。该方法能够从集合的所有元素中得到一
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

需要选取一个属性的最小值的话，可以使用 ``min()`` 方法，注意它会返回集合中拥有该最小值的
元素，而不仅仅是一个值::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $youngest->name;

你也能通过提供正确的路径或者一个回调函数来选择你要比较的属性::

    $collection = new Collection($people);
    $personYoungestChild = $collection->min(function ($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

.. php:method:: max(string|callable $callback, $type = SORT_NUMERIC)

以上用发也能应用到 ``max()`` 方法上，它将返回集合中拥有该属性最大值的的元素::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function ($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->min('dad.age');

.. php:method:: sumOf(string|callable $callback)

最后， ``sumOf()`` 方法会返回所有元素某项属性的和值::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

.. php:method:: avg($matcher = null)

该方法能计算集合中元素的平均值。选择一个复合路径或者函数来确定需要计算哪样属性的平均值::

    $items = [
       ['invoice' => ['total' => 100]],
       ['invoice' => ['total' => 200]],
    ];

    // 平均值: 150
    $average = (new Collection($items))->avg('invoice.total');

.. versionadded:: 3.5.0

.. php:method:: median($matcher = null)

该方法可计算一组元素的中间值。在参数中输入一个复合路径或者函数来确定需要计算哪样属性的中间值::

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

分组和统计（Grouping and Counting）
------------------------------------------

.. php:method:: groupBy($callback)

当集合的某项属性的值一样时，可以用不同的键来将它们结合到一个新的collection中::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');

    // 转化成数组后结果将会如下:
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

一般情况，可以提供一个点分割路径来选取嵌套结构的值或者提供你自己的回调函数来进行动态的结合::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

.. php:method:: countBy($callback)

如果想要知道不同的分组范围内的出现次数，你可以用 ``countBy()`` 方法。它的参数与上面已经
知道的 `groupBy`` 相同::

    $classResults = $students->countBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

    // 转化成数组后结果将会如下:
    ['approved' => 70, 'denied' => 20]

.. php:method:: indexBy($callback)

有些特定的时候你知道你想要用来分组的某元素的某属性时唯一的，这时候你可以使用 ``indexBy()`` 方法::

    $usersById = $users->indexBy('id');

    // 转化成数组后结果将会如下:
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

和 ``groupBy()`` 方法一样，你也能使用路径表属性或者回调函数::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function ($file) {
        return md5($file);
    });

.. php:method:: zip($elements)

使用 ``zip()`` 方法能够将不同集合中的元素结合到一起。它将返回一个元素结合后的集合,
其中处于集合中同一位置的元素将被结合到一起::

    $odds = new Collection([1, 3, 5]);
    $pairs = new Collection([2, 4, 6]);
    $combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]

你也能够一次性打包复数个集合::

    $years = new Collection([2013, 2014, 2015, 2016]);
    $salaries = [1000, 1500, 2000, 2300];
    $increments = [0, 500, 500, 300];

    $rows = $years->zip($salaries, $increments)->toList();
    // 结果:
    [
        [2013, 1000, 0],
        [2014, 1500, 500],
        [2015, 2000, 500],
        [2016, 2300, 300]
    ]

就像你看到的， ``zip()`` 方法在转换多重数组时非常实用::

    $data = [
        2014 => ['jan' => 100, 'feb' => 200],
        2015 => ['jan' => 300, 'feb' => 500],
        2016 => ['jan' => 400, 'feb' => 600],
    ]

    // 把'jan'和'feb'数据打包到一起

    $firstYear = new Collection(array_shift($data));
    $firstYear->zip($data[0], $data[1])->toList();

    // 或者 $firstYear->zip(...$data) 当 PHP >= 5.6

    // 结果
    [
        [100, 300, 400],
        [200, 500, 600]
    ]

排序（Sorting）
==============

.. php:method:: sortBy($callback)

集合的值可以基于某一列或者一个自定义函数来升序或降序排列。使用 ``sortBy`` 
你可以根据集合中的某项值来生成一个排序过的::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age');

像上面那样，你可以传递一个拥有值的列名或者属性名来排序。你也能用点分割的方法来指定属性
路径。下面一个例子将会根据作者的名字对作品进行排序::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('author.name');

``sortBy()`` 方法可以让你柔软地定义一个提取功能动态地选择集合中两个值的比较值::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function ($article) {
        return $article->author->name . '-' . $article->title;
    });

为了定义集合要如何排序，你可以提供 ``SORT_ASC`` 或者 ``SORT_DESC`` 当作第二个参数以确定
要“升序”还是“降序”。默认情况下，集合会自动选择降序::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

有时你需要定义你用来比较的是哪一类数据。这种情况你需要在 ``sortBy()`` 方法中提供第三个
参数，参数需要在以下定数中选择一个:

- **SORT_NUMERIC**: 用于比较数值
- **SORT_STRING**: 用于比较字符串的值
- **SORT_NATURAL**: 对包含数字的字符串进行排序时，那些数字会以自然顺序排列。比方说"10"会显示在"2"的后面
- **SORT_LOCALE_STRING**: 根据当前环境来比较字符串

默认情况下, ``SORT_NUMERIC`` 将自动使用::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    一次以上用迭代来对集合///////////////////////////////进行排序通常比较麻烦。如果你打算这么做，可以考虑将集合
    转换成数组或者对它简单使用 ``compile()`` 方法。 

使用树结构（Tree Data）数据
==============================

.. php:method:: nest($idPath, $parentPath)

并非所有数据都是用线形表示的。集合可以让复杂的嵌套构造变得更加平坦化和结构化。
用 ``nest()`` 方法能够很容易创建一个根据父元素的标识符属性来把子元素分组的嵌套结构。

此方法需要两个参数。第一个参数是用来辨别元素的属性，第二个参数是识别关系的标识符属性名::

    $collection = new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
    ]);

    $collection->nest('id', 'parent_id')->toArray();
    // 结果
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

子元素嵌套在集合中的每个元素的 ``children`` 属性里面。这样的数据表现方式对于展示某些品目
或者将元素放置到树结构的确定的层级上时会比较有帮助。

.. php:method:: listNested($dir = 'desc', $nestingKey = 'children')

将 ``nest()`` 进行反转的是 ``listNested()`` 。该方法能够将一个树结构变成一个线形结构。它
需要两个参数，第一参数决定运行模式（升序，降序，或者保持不变），第二个是指向集合中各元素的子元素的属性名。

输入之前的例子中构建的嵌套结构，我们可以展开它::

    $nested->listNested()->toList();

    // 结果
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

默认情况下，树结构的头部到末尾都会被转化。你可以指示它仅仅返回树结构最末端的元素::

    $nested->listNested()->toArray();

    // 结果
  。  [
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

一旦你将一个树结构转换成列表结构，使用 ``printer()`` 方法能够设置列表的输出方式::

    $nested->listNested()->printer('name', 'id', '--')->toArray();

    // Returns
    [
        3 => 'Eagle',
        4 => 'Seagull',
        5 -> '--Clown Fish',
    ]

``printer()`` 方法也可以让你使用回调函数来生成键或者值::

    $nested->listNested()->printer(
        function ($el) {
            return $el->name;
        },
        function ($el) {
            return $el->id;
        }
    );

其它方法
=============

.. php:method:: isEmpty()

可以让你知道一个集合是否有包含元素::

    $collection = new Collection([]);
    // 结果为 true
    $collection->isEmpty();

    $collection = new Collection([1]);
    // 结果为 false
    $collection->isEmpty();

.. php:method:: contains($value)

使用 ``contains()`` 方法能让你快速检查集合是否包含某个特定的值::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

其中的比较是通过 ``===`` 来执行的，如果你希望执行一个松散的比较，
你可以使用 ``some()`` 方法。

.. php:method:: shuffle()

有时你可能希望随机显示集合的值。要生成一个各个值被分配到随机位置的集合的话，可以使用 
``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // This could return [2, 3, 1]
    $collection->shuffle()->toArray();

.. php:method:: transpose()

当你翻转一个集合时，你能得到每一行都由原先在同一列上的元素组成的集合::

     $items = [
        ['Products', '2012', '2013', '2014'],
        ['Product A', '200', '100', '50'],
        ['Product B', '300', '200', '100'],
        ['Product C', '400', '300', '200'],
     ]
     $transpose = (new Collection($items))->transpose()->toList();

     // 返回
     [
         ['Products', 'Product A', 'Product B', 'Product C'],
         ['2012', '200', '300', '400'],
         ['2013', '100', '200', '300'],
         ['2014', '50', '100', '200'],
     ]

.. versionadded:: 3.3.0
    ``Collection::transpose()`` 追加于 3.3.0.

抽取元素
--------------------

.. php:method:: sample(int $size)

当做一个快速的静态分析时，对一个集合的元素进行随机化的处理比较常见。另一个比较常见的处理是，
从集合中抽取几个随机的值出来以进行更多的测试。比方说你想要随机抽取5名用户来进行A/B测试，你
可以使用 ``sample()`` 方法::

    $collection = new Collection($people);

    // 从集合中随机抽取最大20名用户
    $testSubjects = $collection->sample(20);


``sample()`` 会根据你定义的第一个参数来决定最大的抽取数。如果集合中没有足够数量的元
素来满足样本要求，那么将返回元素被随机排列过后的整个元素本身。

.. php:method:: take(int $size, int $from)

无论何时你想要集合中的某一部分的时候，可以使用 ``take()`` 方法，它会创建一个数量为你在
第一个参数中定义的，同时位置由你传的第二个参数定义的新集合::

    $topFive = $collection->sortBy('age')->take(5);

    // 从位置4开始在集合中抽取5个人
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

位置是从0开始的，所以第一个位置其实是``0``。

.. php:method:: skip(int $positions)

像 ``take()`` 的第二个参数能够让你从集合中取值时略过一些元素，你也可以用 ``skip()`` 
来拿到某个位置之后余下的元素::

    $collection = new Collection([1, 2, 3, 4]);
    $allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]

.. php:method:: first()

一个 ``take()`` 的最常用的用法是取得集合的第一个元素。一个快捷方法 ``first()`` 也能
让你得到相同的效果::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->first(); // Returns 5

.. php:method:: last()

相似地，你也能用 `last()`` 方法来取得集合最后一个元素::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->last(); // Returns 2

集合扩展
---------------------

.. php:method:: append(array|Traversable $items)

你也可以把复数个集合组合成一个。这让你能够从不同的资源中聚集数据，并把它们串联起来，
然后更顺畅地使用其它的集合方法。 ``append()`` 方法将返回一个包含着两边资源值的新集合::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // 两边资源中包含cakefest的Tweets
    $myTimeline->filter(function ($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. warning::

    当从不同的资源处进行增加合并时，你可以预期到两个集中有一样的键的存在。举个例子，当
    你合并两个简单的数组，这种情况将会在你用 ``toArray()`` 把集合转换为数组时出现问题。
    如果你不想要一个集合中的值因为键相同而覆盖掉另一集合中的值，你需要确保使用 ``toList()`` 
    来去掉它们的键而表示整个集合的值。

元素的更新
-------------------

.. php:method:: insert(string $path, array|Traversable $items)

有时，你或许有两个不同数据的集合，你想要将其中一组的元素插入到另一组中间去。这是一个从
没有支持数据结合以及合并的资源中取得数据的常见例子。

集合提供一个 ``insert()`` 方法让你可以将集合中的各个元素注入到另一个集合中::

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

当转换成数组之后， ``$merged`` 集合将会时::

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

``insert()`` 的第一个参数是一个点分割路径，用来指定元素将要插入的位置。第二个参数是
任意的你想要转化成集合的对象。

请注意要素是根据它们的位置顺序进行插入的，因此，第二个集合的第一个元素会合并到第一个集
合的第一个元素中。

如果第二个集合中没有足够的元素插入到第一个集合中，那么对应的属性将会是 ``null``::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

    // 结果
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => null]
    ];

``insert()`` 方法可以操作包含 ``ArrayAccess`` 接口的数组元素或者对象。

让集合的方法重复使用
----------------------------------

使用集合闭包方法在工作小或者明确的时候非常有效，但是它也容易很快陷入麻烦。这在需要使用
大量不同方法时或者闭包方法不仅仅只有几行时比较明显。

有些情况你用于集合方法的逻辑可以在你应用的许多地方重复利用。这中种情况建议你将复杂的集合
逻辑抽取出来定义成一个类。举个例子，想象一下下面一样的长的闭包方法::

        $collection
                ->map(function ($row, $key) {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // 后面有更多的代码...

                    return $modifiedRow;
                });

它可以通过创建另一个类来重构::

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

                    // 后面有更多代码...

                    return $modifiedRow;
                }
        }

        // 在你的map()函数使用这些逻辑
        $collection->map(new TotalOrderCalculator)


.. php:method:: through(callable $c)

有时一个集合连锁使用一些方法也能够被重复利用，不过它们必须按照特定的顺序。在这些情况中，你可以用 ``through()`` 
来与一个包含了 ``__invoke`` 的类组合以构建方便的数据调取::

        $collection
                ->map(new ShippingCostCalculator)
                ->map(new TotalOrderCalculator)
                ->map(new GiftCardPriceReducer)
                ->buffered()
               ...

以上的方法可以被提取进一个新的类中，这样就不需要每次都重复调用它们::

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


        // 现在你能使用 through() 方法来一次性调用所有方法
        $collection->through(new FinalCheckOutRowProcessor);

集合优化
----------------------

.. php:method:: buffered()

集合一般在大多数情况下创建新集合时会延迟使用函数。这意味着即使你调用一个函数也不等于马上就
会执行它。在这个类中的大多数函数都是这种情况。延迟评价在你不使用集合中的全部的值时能够节约
资源。当迭代器早早停止的时候你或许并没有用到所有的值，或者一个例外/失败提前出现。

另外，延迟评价帮助某些操作的速度提高。思考一下下面的例子::

    $collection = new Collection($oneMillionItems);
    $collection = $collection->map(function ($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

如果集合没有延迟处理，即使我们只想要取出30个元素我们也将不得不处理百万条数据。相对地，
map操作仅仅会作用到我们使用的30条元素。即使是很小的集合，当我使用复数回操作时也能够从
延迟评价中得到好处。举个例子：调用 ``map()`` 两回然后调用 ``filter()`` 。

延迟评价也有它的缺点。如果你早期对集合进行优化，你会执行多次相同的操作。考虑一下下面的例子::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function ($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function ($item) {
        return $item > 30;
    });

如果我们两次迭代 ``youngerThan30`` 和 ``olderThan30``，集合将需要执行 ``extract()`` 操作两次。
这是因为集合时不变的，延迟的抽出操作将会为两个过滤器使用。

幸运的是我们可以用一个简单的方法来克服这个问题。如果你打算从确定的操作中不止一次重复利用某些值，你
能用 ``buffered()`` 方法将一个结果编入另一个集合中::

    $ages = $collection->extract('age')->buffered();
    $youngerThan30 = ...
    $olderThan30 = ...

现在，当两个集合进行迭代时，它们只会调取抽出操作一次。

让集合能够迭代回
-----------------------------

``buffered()`` 方法在将non-rewindable的迭代器转化为集合时会比较实用，因为这样可以迭代一次以上::

    // 在 PHP 5.5+
    public function results()
    {
        ...
        foreach ($transientElements as $e) {
            yield $e;
        }
    }
    $rewindable = (new Collection(results()))->buffered();

复制集合
-------------------

.. php:method:: compile(bool $preserveKeys = true)

有时候你需要从其它的集合中克隆出元素。这在你需要在不同地方同时迭代相同的一组元素时非常有帮助。
``compile()`` 方法可以从另一个集合中克隆出一个::

    $ages = $collection->extract('age')->compile();

    foreach ($ages as $age) {
        foreach ($collection as $element) {
            echo h($element->name) . ' - ' . $age;
        }
    }

.. meta::
    :title lang=zh: Collections
    :keywords lang=en: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold, through
