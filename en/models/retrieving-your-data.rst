Retrieving Your Data
####################

As stated before, one of the roles of the Model layer is to get data from multiple types of storage.
The CakePHP Model class comes with some functions that will help you search for this data, sort it,
paginate it, and filter it. The most common function you will use in models is :php:meth:`Model::find()`

.. _model-find:

find
====

``find(string $type = 'first', array $params = array())``

Find is the multifunctional workhorse of all model data-retrieval functions.
``$type`` can be ``'all'``, ``'first'``, ``'count'``, ``'list'``,
``'neighbors'`` or ``'threaded'``, or any custom finder you can define.
Keep in mind that ``$type`` is case-sensitive. Using an upper case character
(for example, ``All``) will not produce the expected results.

``$params`` is used to pass all parameters to the various types of find(),
and has the following possible keys by default, all of which are
optional::

    array(
        'conditions' => array('Model.field' => $thisValue), //array of conditions
        'recursive' => 1, //int
        //array of field names
        'fields' => array('Model.field1', 'DISTINCT Model.field2'),
        //string or array defining order
        'order' => array('Model.created', 'Model.field3 DESC'),
        'group' => array('Model.field'), //fields to GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset' => n, //int
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

It's also possible to add and use other parameters. Some types of find() 
and behaviors make use of this ability, and your own model methods can, too.

If your find() operation fails to match any records, you will get an empty array.

.. _model-find-first:

find('first')
=============

``find('first', $params)`` will return one result. You'd use this for any case
where you expect only one result. Below are a couple of simple (controller code)
examples::

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

In the first example, no parameters at all are passed to find, so
no conditions or sort order will be used. The format
returned from ``find('first')`` call is of the form::

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

``find('count', $params)`` returns an integer value. Below are a
couple of simple (controller code) examples::

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

    Don't pass ``fields`` as an array to ``find('count')``. You would
    only need to specify fields for a DISTINCT count (since otherwise,
    the count is always the same, dictated by the conditions).

.. _model-find-all:

find('all')
===========

``find('all', $params)`` returns an array of potentially multiple results.
It is, in fact, the mechanism used by all ``find()`` variants, as
well as ``paginate``. Below are a couple of simple (controller
code) examples::

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

    In the above example, ``$allAuthors`` will contain every user in the
    users table. There will be no condition applied to the find, since none
    were passed.

The results of a call to ``find('all')`` will be of the following
form::

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

``find('list', $params)`` returns an indexed array, useful for any
place where you would want a list, such as for populating input select
boxes. Below are a couple of simple (controller code) examples::

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

    In the above example, ``$allAuthors`` will contain every user in the
    users table. There will be no condition applied to the find, since none
    were passed.

The results of a call to ``find('list')`` will be in the following
form::

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

When calling ``find('list')``, the ``fields`` passed are used to
determine what should be used as the array key and value, and
optionally what to group the results by. By default, the primary key
for the model is used for the key, and the display field (which can
be configured using the model attribute
:ref:`model-displayField`) is used for the value.
Some further examples to clarify::

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

With the above code example, the resultant vars would look
something like this::


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

``find('threaded', $params)`` returns a nested array, and is
appropriate if you want to use the ``parent_id`` field of your
model data to build nested results. Below are a couple of simple
(controller code) examples::

    public function some_function() {
        // ...
        $allCategories = $this->Category->find('threaded');
        $comments = $this->Comment->find('threaded', array(
            'conditions' => array('article_id' => 50)
        ));
        // ...
    }

.. tip::

    A better way to deal with nested data is using the :doc:`/core-libraries/behaviors/tree`
    behavior

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The results of a
call to ``find('threaded')`` will be of the following form::

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

The order in which results appear can be changed, as it is influenced by the
order of processing. For example, if ``'order' => 'name ASC'`` is
passed in the params to ``find('threaded')``, the results will
appear in name order. Any order can be used; there is no
built-in requirement of this method for the top result to be
returned first.

.. warning::

    If you specify ``fields``, you need to always include the
    id and parent_id (or their current aliases)::

        public function some_function() {
            $categories = $this->Category->find('threaded', array(
                'fields' => array('id', 'name', 'parent_id')
            ));
        }

    Otherwise, the returned array will not be of the expected nested structure from above.

.. _model-find-neighbors:

find('neighbors')
=================

``find('neighbors', $params)`` will perform a find similar to 'first', but will
return the row before and after the one you request. Below is a simple
(controller code) example:

::

    public function some_function() {
        $neighbors = $this->Article->find(
            'neighbors',
            array('field' => 'id', 'value' => 3)
        );
    }

You can see in this example the two required elements of the
``$params`` array: field and value. Other elements are still
allowed as with any other find. (For example: If your model acts as
containable, then you can specify 'contain' in ``$params``.) The
result returned from a ``find('neighbors')`` call is in the form:

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

    Note how the result always contains only two root elements: prev
    and next. This function does not honor a model's default recursive
    var. The recursive setting must be passed in the parameters on each
    call.

.. _model-custom-find:

Creating custom find types
==========================

The ``find`` method is flexible enough to accept your custom finders. This is
done by declaring your own types in a model variable and by implementing a special
function in your model class.

A Model Find Type is a shortcut to find() options. For example, the following two finds are equivalent

::

    $this->User->find('first');
    $this->User->find('all', array('limit' => 1));

The following are core find types:

* ``first``
* ``all``
* ``count``
* ``list``
* ``threaded``
* ``neighbors``

But what about other types? Let's say you want a finder for all published articles in your database. The first
change you need to do is add your type to the :php:attr:`Model::$findMethods` variable in the model

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);
    }

Basically this is just telling CakePHP to accept the value ``available`` as the first
argument of the ``find`` function. The next step is to implement the function ``_findAvailable``.
This is done by convention. If you wanted to implement a finder called ``myFancySearch``, then
the method to implement would be named ``_findMyFancySearch``.

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

This all comes together in the following example (controller code):

::

    class ArticlesController extends AppController {

        // Will find all published articles and order them by the created column
        public function index() {
            $articles = $this->Article->find('available', array(
                'order' => array('created' => 'desc')
            ));
        }

    }

The special ``_find[Type]`` methods receive three arguments as shown above. The first one
means the state of the query execution, which could be either ``before`` or ``after``. It
is done this way because this function is just a sort of callback function that has the
ability to modify the query before it is done, or to modify the results after they are fetched.

Typically the first thing to check in our custom find function is the state of the query.
The ``before`` state is the moment to modify the query, bind new associations, apply more
behaviors, and interpret any special key that is passed in the second argument of ``find``. This
state requires you to return the $query argument (modified or not).

The ``after`` state is the perfect place to inspect the results, inject new data, process it in order
to return it in another format, or do whatever you like to the recently fetched data. This state
requires you to return the $results array (modified or not).

You can create as many custom finders as you like, and they are a great way of reusing code in
your application across models.

It is also possible to paginate via a custom find type as follows:

::

    class ArticlesController extends AppController {

        // Will paginate all published articles
        public function index() {
            $this->paginate = array('available');
            $articles = $this->paginate();
            $this->set(compact('articles'));
        }

    }

Setting the ``$this->paginate`` property as above on the controller will result in the ``type``
of the find becoming ``available``, and will also allow you to continue to modify the find results.

To simply return the count of a custom find type, call ``count`` like you normally would, but pass in the 
find type in an array for the second argument.

::

    class ArticlesController extends AppController {

        // Will find the count of all published articles (using the available find defined above)
        public function index() {
            $count = $this->Article->find('count', array(
                'type' => 'available'
            ));
        }
    }

If your pagination page count is becoming corrupt, it may be necessary to add the following code to
your ``AppModel``, which should fix the pagination count:

::

    class AppModel extends Model {

    /**
     * Removes 'fields' key from count query on custom finds when it is an array,
     * as it will completely break the Model::_findCount() call
     *
     * @param string $state Either "before" or "after"
     * @param array $query
     * @param array $results
     * @return int The number of records found, or false
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

You no longer need to override _findCount for fixing incorrect count results.
The ``'before'`` state of your custom finder will now be called again with
$query['operation'] = 'count'. The returned $query will be used in ``_findCount()``
If necessary, you can distinguish by checking the ``'operation'`` key
and return a different ``$query``::

    protected function _findAvailable($state, $query, $results = array()) {
        if ($state === 'before') {
            $query['conditions']['Article.published'] = true;
            if (!empty($query['operation']) && $query['operation'] === 'count') {
                return $query;
            }
            $query['joins'] = array(
                //array of required joins
            );
            return $query;
        }
        return $results;
    }

Magic Find Types
================

These magic functions can be used as a shortcut to search your
tables by a certain field. Just add the name of the field (in
CamelCase format) to the end of these functions, and supply the
criteria for that field as the first parameter.

findAllBy() functions will return results in a format like ``find('all')``,
while findBy() return in the same format as ``find('first')``

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| findAllBy<x> Example                                                                     | Corresponding SQL Fragment                                 |
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

The returned result is an array formatted just as it would be from ``find('all')``.

findBy
------

``findBy<fieldName>(string $value);``

The findBy magic functions also accept some optional parameters:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``


+------------------------------------------------------------+-------------------------------------------------------+
| findBy<x> Example                                          | Corresponding SQL Fragment                            |
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

findBy() functions return results like ``find('first')``

.. _model-query:

:php:meth:`Model::query()`
==========================

``query(string $query)``

SQL calls that you can't or don't want to make via other model
methods can be made using the model's ``query()`` method
(though this should only rarely be necessary).

If you use this method, be sure to properly escape all parameters using the
``value()`` method on the database driver. Failing to escape parameters
will create SQL injection vulnerabilities.

.. note::

    ``query()`` does not honor $Model->cacheQueries as its
    functionality is inherently disjoint from that of the calling
    model. To avoid caching calls to query, supply a second argument of
    false, ie: ``query($query, $cachequeries = false)``

``query()`` uses the table name in the query as the array key for
the returned data, rather than the model name. For example::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

might return::

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

To use the model name as the array key, and get a result consistent
with that returned by the Find methods, the query can be
rewritten::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

which returns::

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

    This syntax and the corresponding array structure is valid for
    MySQL only. CakePHP does not provide any data abstraction when running
    queries manually, so exact results will vary between databases.

:php:meth:`Model::field()`
==========================

``field(string $name, array $conditions = null, string $order = null)``

Returns the value of a single field, specified as ``$name``, from
the first record matched by $conditions as ordered by $order. If no
conditions are passed and the model id is set, it will return the
field value for the current model result. If no matching record is
found, it returns false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // echo the name for row id 22

    // echo the name of the last created instance
    echo $this->Post->field(
        'name',
        array('created <' => date('Y-m-d H:i:s')),
        'created DESC'
    );

:php:meth:`Model::read()`
=========================

``read($fields, $id)``

``read()`` is a method used to set the current model data
(``Model::$data``)--such as during edits--but it can also be used
in other circumstances to retrieve a single record from the
database.

``$fields`` is used to pass a single field name, as a string, or an
array of field names; if left empty, all fields will be fetched.

``$id`` specifies the ID of the record to be read. By default, the
currently selected record, as specified by ``Model::$id``, is used.
Passing a different value to ``$id`` will cause that record to be
selected.

``read()`` always returns an array (even if only a single field
name is requested). Use ``field`` to retrieve the value of a single
field.

.. warning::

    As the ``read`` method overwrites any information stored in the ``data`` and ``id``
    property of the model, you should be very careful when using this function in general,
    especially using it in the model callback functions such as ``beforeValidate`` and
    ``beforeSave``. Generally the ``find`` function provides a more robust and easy to work
    with API than the ``read`` method.

Complex Find Conditions
=======================

Most of the model's find calls involve passing sets of conditions
in one way or another. In general, CakePHP prefers using arrays for
expressing any conditions that need to be put after the WHERE clause
in any SQL query.

Using arrays is clearer and easier to read, and also makes it very
easy to build queries. This syntax also breaks out the elements of
your query (fields, values, operators, etc.) into discrete,
manipulatable parts. This allows CakePHP to generate the most
efficient query possible, ensure proper SQL syntax, and properly
escape each individual part of the query. Using the array syntax
also enables CakePHP to secure your queries against any SQL injection attack.

.. warning::

    CakePHP only escapes the array values. You should **never** put user data
    into the keys. Doing so will make you vulnerable to SQL injections.

At its most basic, an array-based query looks like this::

    $conditions = array("Post.title" => "This is a post", "Post.author_id" => 1);
    // Example usage with a model:
    $this->Post->find('first', array('conditions' => $conditions));

The structure here is fairly self-explanatory: it will find any
post where the title equals "This is a post" and the author id is equal to 1. Note
that we could have used just "title" as the field name, but when building
queries, it is good practice to always specify the model name, as
it improves the clarity of the code, and helps prevent collisions
in the future, should you choose to change your schema.

What about other types of matches? These are equally simple. Let's
say we wanted to find all the posts where the title is not "This is
a post"::

    array("Post.title !=" => "This is a post")

Notice the '!=' that follows the field name. CakePHP can parse out
any valid SQL comparison operator, including match expressions
using LIKE, BETWEEN, or REGEX, as long as you leave a space between
field name and the operator. The one exception here is IN
(...)-style matches. Let's say you wanted to find posts where the
title was in a given set of values::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

To do a NOT IN(...) match to find posts where the title is not in
the given set of values, do the following::

    array(
        "NOT" => array(
            "Post.title" => array("First post", "Second post", "Third post")
        )
    )

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

You can also create finds that compare two fields in the database::

    array("Post.created = Post.modified")

The above example will return posts where the created date is
equal to the modified date (that is, it will return posts that have never
been modified).

Remember that if you find yourself unable to form a WHERE clause in
this method (for example, boolean operations), you can always specify it as
a string like::

    array(
        'Model.field & 8 = 1',
        // other conditions as usual
    )

By default, CakePHP joins multiple conditions with boolean AND.
This means the snippet above would only match posts that have
been created in the past two weeks, and have a title that matches
one in the given set. However, we could just as easily find posts
that match either condition::

    array("OR" => array(
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    ))

CakePHP accepts all valid SQL boolean operations, including AND, OR,
NOT, XOR, etc., and they can be upper or lower case, whichever you
prefer. These conditions are also infinitely nestable. Let's say
you had a belongsTo relationship between Posts and Authors. Let's
say you wanted to find all the posts that contained a certain
keyword ("magic") or were created in the past two weeks, but you
wanted to restrict your search to posts written by Bob::

    array(
        "Author.name" => "Bob",
        "OR" => array(
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

If you need to set multiple conditions on the same field, like when
you want to do a LIKE search with multiple terms, you can do so by
using conditions similar to::

    array('OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
    ))

CakePHP can also check for null fields. In this example, the query
will return records where the post title is not null::

    array("NOT" => array(
            "Post.title" => null
        )
    )

To handle BETWEEN queries, you can use the following::

    array('Post.read_count BETWEEN ? AND ?' => array(1,10))

.. note::

    CakePHP will quote the numeric values depending on the field
    type in your DB.

How about GROUP BY?::

    array(
        'fields' => array(
            'Product.type',
            'MIN(Product.price) as price'
        ),
        'group' => 'Product.type'
    )

The data returned for this would be in the following format::

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

A quick example of doing a DISTINCT query. You can use other
operators, such as MIN(), MAX(), etc., in a similar fashion::

    array(
        'fields' => array('DISTINCT (User.name) AS my_column_name'),
        'order' = >array('User.id DESC')
    )

You can create very complex conditions by nesting multiple
condition arrays::

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

which produces the following SQL::

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

Sub-queries
-----------

For this example, imagine that we have a "users" table with "id", "name"
and "status". The status can be "A", "B" or "C". We want to retrieve
all the users that have status other than "B" using a sub-query.

In order to achieve that, we are going to get the model data source
and ask it to build the query as if we were calling a find() method,
but it will just return the SQL statement. After that we make an
expression and add it to the conditions array::

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

This should generate the following SQL::

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

Also, if you need to pass just part of your query as raw SQL as 
above, datasource **expressions** with raw SQL work for any part of
the find query.

.. _prepared-statements:

Prepared Statements
-------------------

Should you need even more control over your queries, you can make use of prepared
statements. This allows you to talk directly to the database driver and send any
custom query you like::

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
    :title lang=en: Retrieving Your Data
    :keywords lang=en: upper case character,array model,order array,controller code,retrieval functions,model layer,model methods,model class,model data,data retrieval,field names,workhorse,desc,neighbors,parameters,storage,models
