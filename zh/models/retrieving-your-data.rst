检索数据
########

如前所述，模型层的角色之一是从多种类型的存储中获取数据。CakePHP 的模型类拥有一些
功能，能够帮助你搜索数据、把数据排序、分页以及过滤。模型中最常用的功能是
:php:meth:`Model::find()` 方法。

.. _model-find:

find
====

``find(string $type = 'first', array $params = array())``

find 方法是所有检索数据方法中的多功能机器。``$type`` 参数值可以是 ``'all'`` 、
``'first'`` 、 ``'count'`` 、 ``'list'`` 、``'neighbors'`` 或 ``'threaded'``，或
者任何自定义查询类型。切记 ``$type`` 是大小写敏感的。使用大写字母(如 ``All`` )将
无法得到期望的结果。

``$params`` 用于向各种类型的 find() 方法传递所有参数，默认有如下的键，都是可选的::

    array(
        'conditions' => array('Model.field' => $thisValue), //查询条件数组
        'recursive' => 1, //整型
        //字段名数组
        'fields' => array('Model.field1', 'DISTINCT Model.field2'),
        //定义排序的字符串或者数组
        'order' => array('Model.created', 'Model.field3 DESC'),
        'group' => array('Model.field'), //用来分组(*GROUP BY*)的字段
        'limit' => n, //整型
        'page' => n, //整型
        'offset' => n, //整型
        'callbacks' => true //其他值可以是 false, 'before', 'after'
    )

也可以添加和使用额外的参数。一些 find() 类型和行为利用这个特性，你自己的模型方法
也可以这么做。

如果你的 find() 操作无法匹配到任何记录，你会得到一个空数组。

.. _model-find-first:

find('first')
=============

``find('first', $params)`` 只返回一条记录。你可以把它用于任何只想得到一条记录的
情况。以下是几个简单的(控制器代码)例子::

    public function some_function() {
        // ...
        $semiRandomArticle = $this->Article->find('first');
        $lastCreated = $this->Article->find('first', array(
            'order' => array('Article.created' => 'desc')
        ));
        $specificallyThisOne = $this->Article->find('first', array(
            'conditions' => array('Article.id' => 1)
        ));
        // ...
    }

在第一个示例中，没有向 find 方法传递任何参数，所以不使用任何条件和排序。
``find('first')`` 方法调用返回的格式如下::

    Array
    (
        [ModelName] => Array
            (
                [id] => 83
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

        [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )
    )

.. _model-find-count:

find('count')
=============

``find('count', $params)`` 返回一个整数值。以下是几个简单的(控制器代码)例子::

    public function some_function() {
        // ...
        $total = $this->Article->find('count');
        $pending = $this->Article->find('count', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $authors = $this->Article->User->find('count');
        $publishedAuthors = $this->Article->find('count', array(
           'fields' => 'DISTINCT Article.user_id',
           'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    不要把数组形式的 ``fields`` 参数传递给 ``find('count')`` 方法。只需为
    DISTINCT count 指定字段(因为其它情况下，计数结果总是相同的，仅取决于条件)。

.. _model-find-all:

find('all')
===========

``find('all', $params)`` 返回一个数组，可能包含多个结果。实际上这是所有的
``find()`` 方法的变体、包括 ``paginate`` 方法使用的内在机制。下面是一些简单的(
控制器代码)示例::

    public function some_function() {
        // ...
        $allArticles = $this->Article->find('all');
        $pending = $this->Article->find('all', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('all');
        $allPublishedAuthors = $this->Article->User->find('all', array(
            'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    上面的例子中，``$allAuthors`` 包含 users 表的中的每个用户。因为没有传入任何
    条件，所以 find 方法将不会使用任何条件。

``find('all')`` 方法调用返回的结果具有如下格式::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

            )
    )

.. _model-find-list:

find('list')
============

``find('list', $params)`` 返回一个索引数组，可用于任何需要列表的场合，比如在生成
填充 select 输入元素的列表框。下面是一些简单的(控制器代码)示例::

    public function some_function() {
        // ...
        $allArticles = $this->Article->find('list');
        $pending = $this->Article->find('list', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('list');
        $allPublishedAuthors = $this->Article->find('list', array(
            'fields' => array('User.id', 'User.name'),
            'conditions' => array('Article.status !=' => 'pending'),
            'recursive' => 0
        ));
        // ...
    }

.. note::

    上面的例子中，``$allAuthors`` 将包含 users 表的所有用户。因为没有传入任何条
    件，所以 find 方法将不会使用任何条件。

调用 ``find('list')`` 的结果具有如下格式::

    Array
    (
        //[id] => 'displayValue',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

当调用 ``find('list')`` 时，传入的 ``fields`` 参数用于决定用什么(字段)作为数组的
键和值、以及(可选的)用什么(字段)来把结果分组。默认情况下，模型的主键用作键，显示
列(*display field*，可以用模型的 :ref:`model-displayField` 属性来配置)当作值。下
面用更深入的示例来说明::

    public function some_function() {
        // ...
        $justusernames = $this->Article->User->find('list', array(
            'fields' => array('User.username')
        ));
        $usernameMap = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name')
        ));
        $usernameGroups = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name', 'User.group')
        ));
        // ...
    }

使用上面的代码示例，结果变量类似下面这样::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['User'] => Array
        (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
        )

        ['Admin'] => Array
        (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
        )

    )

.. _model-find-threaded:

find('threaded')
================

``find('threaded', $params)`` 返回一个嵌套数组，适用于想使用模型数据的
``parent_id`` 字段来建立嵌套结果的情况。下面是几个简单的(控制器代码)示例::

    public function some_function() {
        // ...
        $allCategories = $this->Category->find('threaded');
        $comments = $this->Comment->find('threaded', array(
            'conditions' => array('article_id' => 50)
        ));
        // ...
    }

.. tip::

    处理嵌套数据的更好的方法是使用 :doc:`/core-libraries/behaviors/tree` 行为。

在上面的例子中，``$allCategories`` 将包含一个代表整个分类结构的嵌套数组。调用
``find('threaded')`` 的结果具有如下格式::

    Array
    (
        [0] => Array
        (
            [ModelName] => Array
            (
                [id] => 83
                [parent_id] => null
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

            [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

            [children] => Array
            (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                        [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [children] => Array
                    (
                    )
                )
                ...
            )
        )
    )

结果出现的顺序是可以改变的，因为它受处理的顺序的影响。例如，如果将
``'order' => 'name ASC'`` 在 params 参数中传递给 ``find('threaded')`` 方法，结果
将按 name 的顺序排列。任何顺序都可以；此方法没有内置的要顶层的结果最先返回的要求。

.. warning::

    如果指定了 ``fields``, 就总是要包含 id 和 parent_id (或者它们的当前别名)::

        public function some_function() {
            $categories = $this->Category->find('threaded', array(
                'fields' => array('id', 'name', 'parent_id')
            ));
        }

    否则，返回的数组将不是预期的象上面那样的嵌套结构。

.. _model-find-neighbors:

find('neighbors')
=================

``find('neighbors', $params)`` 方法执行的查找与 'first' 类似, 但返回查询的记录的
前一条和后一条记录。下面是一个简单的(控制器代码)示例：

::

    public function some_function() {
        $neighbors = $this->Article->find(
            'neighbors',
            array('field' => 'id', 'value' => 3)
        );
    }

在本例中可以看到，``$params`` 数组的两个必要元素：field 和 value。如同其它形式的
find 方法一样，其它元素仍然允许。(例如：如果模型采用 containable 行为，则可以在
``$params`` 参数中指定 'contain'。) 调用 ``find('neighbors')`` 返回的结果格式如
下：

::

    Array
    (
        [prev] => Array
        (
            [ModelName] => Array
            (
                [id] => 2
                [field1] => value1
                [field2] => value2
                ...
            )
            [AssociatedModelName] => Array
            (
                [id] => 151
                [field1] => value1
                [field2] => value2
                ...
            )
        )
        [next] => Array
        (
            [ModelName] => Array
            (
                [id] => 4
                [field1] => value1
                [field2] => value2
                ...
            )
            [AssociatedModelName] => Array
            (
                [id] => 122
                [field1] => value1
                [field2] => value2
                ...
            )
        )
    )

.. note::

    注意，结果总是只包含两个根元素：prev 和 next。此功能不遵循模型默认的
    recursive 变量。recursive 设置必须在每次调用中在参数中传入。

.. _model-custom-find:

创建自定义查询类型
==================

``find`` 方法足够灵活，能够接收我们自定义的查找类型，这是通过在模型变量中定义自
己的(查找)类型、并在模型类中实现特殊的函数来实现的。

模型的查找类型是 find() 选项的快捷方式。例如，如下两种 find 是等价的：

::

    $this->User->find('first');
    $this->User->find('all', array('limit' => 1));

以下是核心查找类型：:

* ``first``
* ``all``
* ``count``
* ``list``
* ``threaded``
* ``neighbors``

那么其它的类型呢？比如你要一个在数据库中查找所有已发表的文章的查找类型。首先要做
的改动是把自定义类型添加到模型的 :php:attr:`Model::$findMethods` 变量中。

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);
    }

基本上这只是让 CakePHP 接受值 ``available`` 作为 ``find`` 函数的第一个参数。接下
来要实现 ``_findAvailable`` 函数。这是约定。如果想实现叫做 ``myFancySearch`` 的
查找函数，那么要实现的方法就要命名为 ``_findMyFancySearch``。

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);

        protected function _findAvailable($state, $query, $results = array()) {
            if ($state === 'before') {
                $query['conditions']['Article.published'] = true;
                return $query;
            }
            return $results;
        }
    }

所有这些加在一起，就可以有下面这样的例子(控制器代码)：

::

    class ArticlesController extends AppController {

        // 将会查找所有已发表的文章，并以 created 列排序
        public function index() {
            $articles = $this->Article->find('available', array(
                'order' => array('created' => 'desc')
            ));
        }

    }

如上所示，这个特殊的方法 ``_find[Type]`` 接收三个参数。第一个参数为查询运行的状
态，这可以是 ``before`` 或 ``after``。采用这种方式是因为此函数只是一种回调函数，
可以在查询结束前修改查询，或者在获取结果后对结果进行修改。

通常在该自定义查询方法中要检查的第一件事情是查询的状态。在 ``before`` 状态下，可
以修改查询、绑定新的关联、应用更多的行为，以及解释任何在 ``find`` 方法的第二个参
数中传入的特别的键。这个状态要求返回 $query 参数(修改过或没有任何改变)。

``after`` 状态是理想的时机，来检测查询结果，注入新的数据，处理以便于以另外一种格
式返回，或者对刚获取的数据做任何想做的事情。此状态需要你返回 $results 数组(修改
过或没有任何改变)。

可以创建任意多想要的自定义查找，这也是复用应用程序各个模型代码的好方法。

还可以象下面这样使用'findType'选项，通过自定义的查找类型对结果进行分页：

::

    class ArticlesController extends AppController {

        // 将会对所有已发布的文章进行分页
        public function index() {
            $this->paginate = array('findType' => 'available');
            $articles = $this->paginate();
            $this->set(compact('articles'));
        }

    }


象上面这样设置控制器的 ``$this->paginate`` 属性，会导致查找的 ``type`` 变成
``available``，而且也让你可以继续修改查找结果。

要简单地返回自定义查找类型的计数，象平常那样调用 ``count`` 方法，但在第二个参数
中传入包含查找类型的数组。

::

    class ArticlesController extends AppController {

        // 会得到所有已发表文章的数量(使用上面定义的 available 查找类型)
        public function index() {
            $count = $this->Article->find('count', array(
                'type' => 'available'
            ));
        }
    }

如果你的分页页数损坏了，也许必须在 ``AppModel`` 中添加如下代码，就能修复分页计数
了：

::

    class AppModel extends Model {

    /**
     * 当 'fields' 键是数组时，从自定义查找的计数查询中删除 'fields' 键，因为它
     * 会彻底破坏对 Model::_findCount() 的调用
     *
     * @param string $state "before" 或 "after"
     * @param array $query
     * @param array $results
     * @return int 找到的记录数，或 false
     * @access protected
     * @see Model::find()
     */
        protected function _findCount($state, $query, $results = array()) {
            if ($state === 'before') {
                if (isset($query['type']) &&
                    isset($this->findMethods[$query['type']])) {
                    $query = $this->{
                        '_find' . ucfirst($query['type'])
                    }('before', $query);
                    if (!empty($query['fields']) && is_array($query['fields'])) {
                        if (!preg_match('/^count/i', current($query['fields']))) {
                            unset($query['fields']);
                        }
                    }
                }
            }
            return parent::_findCount($state, $query, $results);
        }

    }
    ?>


.. versionchanged:: 2.2

不必再需要重载 _findCount 方法来修复不正确的计数结果。自定义查找的 ``'before'``
状态现在会用 $query['operation'] = 'count' 再次调用。返回的 $query 会用于
``_findCount()``。如果必要，你可以通过检查 ``'operation'`` 键来区分，并返回不同
的 ``$query``::

    protected function _findAvailable($state, $query, $results = array()) {
        if ($state === 'before') {
            $query['conditions']['Article.published'] = true;
            if (!empty($query['operation']) && $query['operation'] === 'count') {
                return $query;
            }
            $query['joins'] = array(
                //需要的 joins 数组
            );
            return $query;
        }
        return $results;
    }

魔法查找类型
============

这些魔法函数可以用作搜寻表中特定字段的快捷方式。只要在这些函数末尾添加字段名(驼
峰命名格式)，并且提供字段的条件作为第一个参数。

findAllBy() 函数返回象 ``find('all')`` 方法返回的格式的结果，而 findBy() 返回与
``find('first')`` 相同的格式。

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| findAllBy<x> 示例                                                                        | 对应的SQL片段                                              |
+==========================================================================================+============================================================+
| ``$this->Product->findAllByOrderStatus('3');``                                           | ``Product.order_status = 3``                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Recipe->findAllByType('Cookie');``                                              | ``Recipe.type = 'Cookie'``                                 |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('Anderson');``                                          | ``User.last_name = 'Anderson'``                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Cake->findAllById(7);``                                                         | ``Cake.id = 7``                                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByEmailOrUsername('jhon', 'jhon');``                               | ``User.email = 'jhon' OR User.username = 'jhon';``         |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByUsernameAndPassword('jhon', '123');``                            | ``User.username = 'jhon' AND User.password = '123';``      |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('psychic', array(), array('User.user_name => 'asc'));`` | ``User.last_name = 'psychic' ORDER BY User.user_name ASC`` |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

返回结果数组的格式与 ``find('all')`` 的返回值格式一样。

自定义魔法查询（*Finders*）
------------------------------

自 2.8 版本开始，你可以使用任何带有魔法方法接口的自定义查询方法。例如，如果模型实现了 ``published`` 查询，你就可以通过魔法 ``findBy`` 方法来使用这些查询::

    $results = $this->Article->findPublishedByAuthorId(5);

    // 等同于
    $this->Article->find('published', array(
        'conditions' => array('Article.author_id' => 5)
    ));

.. versionadded:: 2.8.0
    2.8.0 版本增加了自定义魔法查询。

findBy
------

``findBy<fieldName>(string $value);``

findBy 魔法函数同样接受一些可选参数:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``


+------------------------------------------------------------+-------------------------------------------------------+
| findBy<x> 示例                                             | 对应的SQL片段                                         |
+============================================================+=======================================================+
| ``$this->Product->findByOrderStatus('3');``                | ``Product.order_status = 3``                          |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Recipe->findByType('Cookie');``                   | ``Recipe.type = 'Cookie'``                            |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByLastName('Anderson');``               | ``User.last_name = 'Anderson';``                      |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByEmailOrUsername('jhon', 'jhon');``    | ``User.email = 'jhon' OR User.username = 'jhon';``    |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByUsernameAndPassword('jhon', '123');`` | ``User.username = 'jhon' AND User.password = '123';`` |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Cake->findById(7);``                              | ``Cake.id = 7``                                       |
+------------------------------------------------------------+-------------------------------------------------------+

findBy() 函数返回的结果类似于 ``find('first')``。

.. _model-query:

:php:meth:`Model::query()`
==========================

``query(string $query)``

你无法或者不想通过其它方模型法实现的 SQL 调用，可以使用模型的 ``query()`` 方法实
现(虽然这很少有必要)。

如果使用该方法，请确保正确使用数据库驱动的 ``value()`` 方法转义(*escape*)所有参
数。不转义参数会造成 SQL 注入漏洞。

.. note::

    ``query()`` 不理会 $Model->cacheQueries，因为其功能与调用的模型根本毫无关系。
    为避免对调用查询的缓存，将第二个参数设置为 false，例如：
    ``query($query, $cachequeries = false)``。

``query()`` 在查询中使用表名而不是模型名作为返回数据数组的键。例如::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

可能返回::

    Array
    (
        [0] => Array
        (
            [pictures] => Array
            (
                [id] => 1304
                [user_id] => 759
            )
        )

        [1] => Array
        (
            [pictures] => Array
            (
                [id] => 1305
                [user_id] => 759
            )
        )
    )

要使用模型名作为数组键，并返回与 Find 方法一致的结果，可以将查询写成::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

这会返回::

    Array
    (
        [0] => Array
        (
            [Picture] => Array
            (
                [id] => 1304
                [user_id] => 759
            )
        )

        [1] => Array
        (
            [Picture] => Array
            (
                [id] => 1305
                [user_id] => 759
            )
        )
    )

.. note::

    此语法及相应的数组结构仅对 MySQL 有效。在手动运行查询时，CakePHP 不提供任何
    对数据的抽象，所以真正的结果对不同的数据库将有所不同。

:php:meth:`Model::field()`
==========================

``field(string $name, array $conditions = null, string $order = null)``

返回符合 $conditions 条件、按照 $order 排序的第一条记录中以 ``$name`` 命名的单一
列的值。如果没有传递条件，并且设置了模型的 id，则返回当前模型结果的那一列的值。
如果没有匹配的记录，则返回 false。

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // 显示 id 为 22 的行的 name 列

    // 显示最后创建的实例的 name 列
    echo $this->Post->field(
        'name',
        array('created <' => date('Y-m-d H:i:s')),
        'created DESC'
    );

:php:meth:`Model::read()`
=========================

``read($fields, $id)``

``read()`` 方法用于设置当前模型数据(``Model::$data``) —— 例如在编辑过程中 —— 但
是也可以在其他情况下从数据库中获取单条记录。

``$fields`` 用来以字符串传递单个字段名、或者字段名称数组；如果为空，则读取所有字
段。

``$id`` 指定要读取的记录的 ID，默认会使用由 ``Model::$id`` 指定的当前选中记录。
传递不同的值给 ``$id`` 参数就会使该条记录被选中。

``read()`` 方法总是返回数组(即使仅请求一个字段名)。使用 ``field`` 方法来获取单个字段的值。

.. warning::

    由于 ``read`` 方法覆盖任何存储在模型的 ``data`` 和 ``id`` 属性中的数据，通常
    使用此功能是要非常小心，尤其在类似 ``beforeValidate`` 和 ``beforeSave`` 等模
    型回调函数中。通常而言，``find`` 方法提供了比 ``read`` 方法更健壮和易用的
    API。

复杂的查找条件
==============

大多数模型的 find 调用会涉及用这种或者那种方式传入一些查询条件。通常，CakePHP 更
倾向于使用数组来表示在 SQL 查询中要放在 WHERE 子句后面的任何条件。

使用数组更清晰易读，而且很易于构建查询。这种语法也把查询元素(字段、数值、运算符，
等等)分成离散的可操作的部分。这让 CakePHP 能够生成尽可能高效的查询，保证正确的
SQL 语法，并且正确地转义(*escape*)查询的每一个部分。使用数组语法也让 CakePHP 能
够保护你的查询免受 SQL 注入的攻击。

.. warning::

    CakePHP 只转义(*escape*)数组的值。你 **永远不** 应当把用户数据放入键中。这么
    做会让你容易遭受 SQL 注入的攻击。

最基本的基于数组的查询类似于这样::

    $conditions = array("Post.title" => "This is a post", "Post.author_id" => 1);
    // 使用模型的用法示例:
    $this->Post->find('first', array('conditions' => $conditions));

这里的结构是相当不言自明的：这将查找标题(*title*)等于"This is a post"、作者
(*author*) id 等于 1 的文章。注意，我们可以只用"title"作为字段名称，但是在构建查
询时，好的做法是总是指定模型名称，因为这使代码更明确，并且有助于预防将来的冲突，
如果你决定改变数据结构的话。

其它的匹配类型呢？同样简单。比如说我们要查找所有标题(*title*)不是"This is a
post"的文章::

    array("Post.title !=" => "This is a post")

注意，跟在字段名称之后的'!='。CakePHP 能解析任何合法的 SQL 比较操作符，包括使用
``LIKE`` 、 ``BETWEEN`` 或者 ``REGEX`` 的匹配表达式，只要你用空格分隔开列名和操
作符。这里唯一的例外是 ``IN`` (...) 这样的匹配条件。比如说要查找标题(*title*)列
为给定的一组值之一的文章::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

要使用 NOT IN(...) 匹配条件来查找标题(*title*)不在给定的一组值之内的文章，那么这
样做::

    array(
        "NOT" => array(
            "Post.title" => array("First post", "Second post", "Third post")
        )
    )

要向条件中添加更多的过滤，简单到只要给数组添加更多的键/值对::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

还可以创建对比数据库中两个字段的查询::

    array("Post.created = Post.modified")

上面的例子将返回创建日期和编辑日期相同的文章(即，返回从来没被编辑过的文章)。

记住，如果你发现不能用这种方法生成 ``WHERE`` 子句(例如，逻辑运算)，你总是可以使
用字符串来指定，比如::

    array(
        'Model.field & 8 = 1',
        // 其它条件照旧
    )

默认情况下，CakePHP 使用逻辑 ``AND`` 来连接多个条件。这意味着，上面的代码片段仅
匹配近两星期内创建的、并且标题(*title*)符合给定的一组标题之一的文章。不过，我们
也可以同样容易地查找符合任一条件的文章::

    array("OR" => array(
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    ))

CakePHP 接受所有合法的 SQL 逻辑运算符，包括 ``AND`` 、 ``OR`` 、 ``NOT`` 、
``XOR``，等等，而且大小写都可以，随你选择。这些条件还可以无限制嵌套。比如说
Posts 和 Authors 模型之间有 belongsTo 关系，而且要查找所有包含特定关键词("magic"
)或者在两星期内创建的、但仅由用户 Bob 发布的文章::

    array(
        "Author.name" => "Bob",
        "OR" => array(
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

如果需要在同一个字段上设置多个条件，比如想要执行一个带有多个 ``LIKE`` 条件的搜索，
可以使用类似如下的条件::

    array('OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
    ))

也可以使用通配符操作符 ``ILIKE`` 和 ``RLIKE`` (RLIKE 自 2.6 版本起)。

CakePHP 还能检查 null 字段。在本例中，查询将返回标题(*title*)不为 null 的记录::

    array("NOT" => array(
            "Post.title" => null
        )
    )

要处理 ``BETWEEN`` 查询，可以使用下面的方法::

    array('Post.read_count BETWEEN ? AND ?' => array(1,10))

.. note::

    CakePHP 会根据数据库中字段的类型来决定是否为数字值加上引号。

如何处理 GROUP BY？::

    array(
        'fields' => array(
            'Product.type',
            'MIN(Product.price) as price'
        ),
        'group' => 'Product.type'
    )

这个查询返回的数据具有如下格式::

    Array
    (
        [0] => Array
        (
            [Product] => Array
            (
                [type] => Clothing
            )
            [0] => Array
            (
                [price] => 32
            )
        )
        [1] => Array
        ...

下面是使用 ``DISTINCT`` 查询的简单示例。可以按类似的方式使用其它操作符，比如
``MIN()`` 、 ``MAX()``，等等::

    array(
        'fields' => array('DISTINCT (User.name) AS my_column_name'),
        'order' = >array('User.id DESC')
    )

通过嵌套多个条件数组，可以构建非常复杂的条件::

    array(
        'OR' => array(
            array('Company.name' => 'Future Holdings'),
            array('Company.city' => 'CA')
        ),
        'AND' => array(
            array(
                'OR' => array(
                    array('Company.status' => 'active'),
                    'NOT' => array(
                        array('Company.status' => array('inactive', 'suspended'))
                    )
                )
            )
        )
    )

这生成如下 SQL::

    SELECT `Company`.`id`, `Company`.`name`,
    `Company`.`description`, `Company`.`location`,
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`city` = 'CA'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

子查询
------

本例中，想象我们有一个带有"id"、"name"和"status"列的"users"表。status 列可以是
"A"、"B" 或者 "C"。我们要使用子查询获取所有 status 列不是"B"的用户(*users*)。

为了达到此目的，我们将获取模型的数据源，让它构建查询，就像我们调用 find() 方法那
样，但是只让它返回 SQL 语句。然后，我们生成表达式，并将其添加到条件数组中::

    $conditionsSubQuery['"User2"."status"'] = 'B';

    $db = $this->User->getDataSource();
    $subQuery = $db->buildStatement(
        array(
            'fields'     => array('"User2"."id"'),
            'table'      => $db->fullTableName($this->User),
            'alias'      => 'User2',
            'limit'      => null,
            'offset'     => null,
            'joins'      => array(),
            'conditions' => $conditionsSubQuery,
            'order'      => null,
            'group'      => null
        ),
        $this->User
    );
    $subQuery = ' "User"."id" NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $db->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->User->find('all', compact('conditions'));

这会生成如下 SQL::

    SELECT
        "User"."id" AS "User__id",
        "User"."name" AS "User__name",
        "User"."status" AS "User__status"
    FROM
        "users" AS "User"
    WHERE
        "User"."id" NOT IN (
            SELECT
                "User2"."id"
            FROM
                "users" AS "User2"
            WHERE
                "User2"."status" = 'B'
        )

另外，如果需要象上面那样传递原生 SQL 作为部分查询，带有原生 SQL 的数据源
**表达式** 在 find 查询的任意部分都可以使用。

.. _prepared-statements:

预处理语句
----------

如果还需要对查询有更多控制，可以使用预处理语句。它让你可以直接与数据库驱动对话，
并且传递任何需要的自定义查询::

    $db = $this->getDataSource();
    $db->fetchAll(
        'SELECT * from users where username = ? AND password = ?',
        array('jhon', '12345')
    );
    $db->fetchAll(
        'SELECT * from users where username = :username AND password = :password',
        array('username' => 'jhon','password' => '12345')
    );



.. meta::
    :title lang=zh: Retrieving Your Data
    :keywords lang=zh: upper case character,array model,order array,controller code,retrieval functions,model layer,model methods,model class,model data,data retrieval,field names,workhorse,desc,neighbors,parameters,storage,models
