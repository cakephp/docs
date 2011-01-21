3.7.3 Retrieving Your Data
--------------------------

find
~~~~

``find($type, $params)``

Find is the multifunctional workhorse of all model data-retrieval
functions. ``$type`` can be either ``'all'``, ``'first'``,
``'count'``, ``'list'``, ``'neighbors'`` or ``'threaded'``. The
default find type is ``'first'``. Keep in mind that ``$type`` is
case sensitive. Using a upper case character (for example
``'All'``) will not produce the expected results.

``$params`` is used to pass all parameters to the various finds,
and has the following possible keys by default - all of which are
optional:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //array of conditions
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //array of field names
        'order' => array('Model.created', 'Model.field3 DESC'), //string or array defining order
        'group' => array('Model.field'), //fields to GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset'=>n, //int   
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

It's also possible to add and use other parameters, as is made use
of by some find types, behaviors and of course possible with your
own model methods

More information about model callbacks is available
`here </view/1048/Callback-Methods>`_

find('first')
^^^^^^^^^^^^^

``find('first', $params)``

'first' is the default find type, and will return one result, you'd
use this for any use where you expect only one result. Below are a
couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $this->Article->order = null; // resetting if it's set
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulating the model having a default order
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

In the first example, no parameters at all are passed to find -
therefore no conditions or sort order will be used. The format
returned from ``find('first')`` call is of the form:

::

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

There are no additional parameters used by ``find('first')``.

find('count')
^^^^^^^^^^^^^

``find('count', $params)``

``find('count', $params)`` returns an integer value. Below are a
couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

Don't pass ``fields`` as an array to ``find('count')``. You would
only need to specify fields for a DISTINCT count (since otherwise,
the count is always the same - dictated by the conditions).

There are no additional parameters used by ``find('count')``.

find('all')
^^^^^^^^^^^

``find('all', $params)``

``find('all')`` returns an array of (potentially multiple) results.
It is in fact the mechanism used by all ``find()`` variants, as
well as ``paginate``. Below are a couple of simple (controller
code) examples:

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none
were passed.

The results of a call to ``find('all')`` will be of the following
form:

::

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

There are no additional parameters used by ``find('all')``.

find('list')
^^^^^^^^^^^^

``find('list', $params)``

``find('list', $params)`` returns an indexed array, useful for any
use where you would want a list such as for populating input select
boxes. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
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
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none
were passed.

The results of a call to ``find('list')`` will be in the following
form:

::

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

When calling ``find('list')`` the ``fields`` passed are used to
determine what should be used as the array key, value and
optionally what to group the results by. By default the primary key
for the model is used for the key, and the display field (which can
be configured using the model attribute
`displayField </view/1062/displayField>`_) is used for the value.
Some further examples to clarify:.

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

With the above code example, the resultant vars would look
something like this:

::

    
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

find('threaded')
^^^^^^^^^^^^^^^^

``find('threaded', $params)``

``find('threaded', $params)`` returns a nested array, and is
appropriate if you want to use the ``parent_id`` field of your
model data to build nested results. Below are a couple of simple
(controller code) examples:

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42))); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

It is not necessary to use `the Tree behavior </view/1339/Tree>`_
to use this method - but all desired results must be possible to be
found in a single query.

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The second example
makes use of the data structure used by the
`Tree behavior </view/1339/Tree>`_ the return a partial, nested,
result for ``$aCategory`` and everything below it. The results of a
call to ``find('threaded')`` will be of the following form:

::

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

The order results appear can be changed as it is influence by the
order of processing. For example, if ``'order' => 'name ASC'`` is
passed in the params to ``find('threaded')``, the results will
appear in name order. Likewise any order can be used, there is no
inbuilt requirement of this method for the top result to be
returned first.

There are no additional parameters used by ``find('threaded')``.

find('neighbors')
^^^^^^^^^^^^^^^^^

``find('neighbors', $params)``

'neighbors' will perform a find similar to 'first', but will return
the row before and after the one you request. Below is a simple
(controller code) example:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

You can see in this example the two required elements of the
``$params`` array: field and value. Other elements are still
allowed as with any other find (Ex: If your model acts as
containable, then you can specify 'contain' in ``$params``). The
format returned from a ``find('neighbors')`` call is in the form:

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

Note how the result always contains only two root elements: prev
and next. This function does not honor a model's default recursive
var. The recursive setting must be passed in the parameters on each
call.

Does not honor the recursive attribute on a model. You must set the
recursive param to utilize the recursive feature.

findAllBy
~~~~~~~~~

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $rercursive)``

These magic functions can be used as a shortcut to search your
tables by a certain field. Just add the name of the field (in
CamelCase format) to the end of these functions, and supply the
criteria for that field as the first parameter.

PHP5 findAllBy<x> Example
Corresponding SQL Fragment
$this->Product->findAllByOrderStatus(‘3’);
Product.order\_status = 3
$this->Recipe->findAllByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findAllByLastName(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findAllById(7);
Cake.id = 7
$this->User->findAllByUserName(‘psychic’, array(),
array('User.user\_name => 'asc'));
User.user\_name = ‘psychic’ ORDER BY User.user\_name ASC
PHP4 users have to use this function a little differently due to
some case-insensitivity in PHP4:

PHP4 findAllBy<x> Example
Corresponding SQL Fragment
$this->Product->findAllByOrder\_status(‘3’);
Product.order\_status = 3
$this->Recipe->findAllByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findAllByLast\_name(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findAllById(7);
Cake.id = 7
$this->User->findAllByUser\_name(‘psychic’);
User.user\_name = ‘psychic’
The returned result is an array formatted just as it would be from
findAll().

findBy
~~~~~~

``findBy<fieldName>(string $value);``

The findBy magic functions also accept some optional parameters:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``

These magic functions can be used as a shortcut to search your
tables by a certain field. Just add the name of the field (in
CamelCase format) to the end of these functions, and supply the
criteria for that field as the first parameter.

PHP5 findBy<x> Example
Corresponding SQL Fragment
$this->Product->findByOrderStatus(‘3’);
Product.order\_status = 3
$this->Recipe->findByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findByLastName(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findById(7);
Cake.id = 7
$this->User->findByUserName(‘psychic’);
User.user\_name = ‘psychic’
PHP4 users have to use this function a little differently due to
some case-insensitivity in PHP4:

PHP4 findBy<x> Example
Corresponding SQL Fragment
$this->Product->findByOrder\_status(‘3’);
Product.order\_status = 3
$this->Recipe->findByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findByLast\_name(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findById(7);
Cake.id = 7
$this->User->findByUser\_name(‘psychic’);
User.user\_name = ‘psychic’
findBy() functions like find('first',...), while findAllBy()
functions like find('all',...).

In either case, the returned result is an array formatted just as
it would be from find() or findAll(), respectively.

query
~~~~~

``query(string $query)``

SQL calls that you can't or don't want to make via other model
methods (this should only rarely be necessary) can be made using
the model's ``query()`` method.

If you’re ever using this method in your application, be sure to
check out CakePHP’s
`Sanitize library </view/1183/Data-Sanitization>`_, which aids in
cleaning up user-provided data from injection and cross-site
scripting attacks.

``query()`` does not honour $Model->cachequeries as its
functionality is inherently disjoint from that of the calling
model. To avoid caching calls to query, supply a second argument of
false, ie: ``query($query, $cachequeries = false)``

``query()`` uses the table name in the query as the array key for
the returned data, rather than the model name. For example,

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

might return

::

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
rewritten:

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

which returns

::

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

This syntax and the corresponding array structure is valid for
MySQL only. Cake does not provide any data abstraction when running
queries manually, so exact results will vary between databases.

field
~~~~~

``field(string $name, array $conditions = null, string $order = null)``

Returns the value of a single field, specified as ``$name``, from
the first record matched by $conditions as ordered by $order. If no
conditions are passed and the model id is set, will return the
field value for the current model result. If no matching record is
found returns false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // echo the name for row id 22
    
    echo $this->Post->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // echo the name of the last created instance

read()
~~~~~~

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

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // gets the rating of the record being deleted.
       $name = $this->read('name', 2); // gets the name of a second record.
       $rating = $this->read('rating'); // gets the rating of the second record.
       $this->id = $id3; //
       $this->Article->read(); // reads a third record
       $record = $this->data // stores the third record in $record
       ...
    }

Notice that the third call to ``read()`` fetches the rating of the
same record read before. That is because ``read()`` changes
``Model::$id`` to any value passed as ``$id``. Lines 6-8
demonstrate how ``read()`` changes the current model data.
``read()`` will also unset all validation errors on the model. If
you would like to keep them, use ``find('first')`` instead.

Complex Find Conditions
~~~~~~~~~~~~~~~~~~~~~~~

Most of the model's find calls involve passing sets of conditions
in one way or another. The simplest approach to this is to use a
WHERE clause snippet of SQL. If you find yourself needing more
control, you can use arrays.

Using arrays is clearer and easier to read, and also makes it very
easy to build queries. This syntax also breaks out the elements of
your query (fields, values, operators, etc.) into discrete,
manipulatable parts. This allows CakePHP to generate the most
efficient query possible, ensure proper SQL syntax, and properly
escape each individual part of the query.

At it's most basic, an array-based query looks like this:

::

    $conditions = array("Post.title" => "This is a post");
    //Example usage with a model:
    $this->Post->find('first', array('conditions' => $conditions));

The structure here is fairly self-explanatory: it will find any
post where the title equals "This is a post". Note that we could
have used just "title" as the field name, but when building
queries, it is good practice to always specify the model name, as
it improves the clarity of the code, and helps prevent collisions
in the future, should you choose to change your schema.

What about other types of matches? These are equally simple. Let's
say we wanted to find all the posts where the title is not "This is
a post":

::

    array("Post.title <>" => "This is a post")

Notice the '<>' that follows the field name. CakePHP can parse out
any valid SQL comparison operator, including match expressions
using LIKE, BETWEEN, or REGEX, as long as you leave a space between
field name and the operator. The one exception here is IN
(...)-style matches. Let's say you wanted to find posts where the
title was in a given set of values:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

To do a NOT IN(...) match to find posts where the title is not in
the given set of values:

::

    array(
        "NOT" => array("Post.title" => array("First post", "Second post", "Third post"))
    )

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

You can also create finds that compare two fields in the database

::

    array("Post.created = Post.modified")

This above example will return posts where the created date is
equal to the modified date (ie it will return posts that have never
been modified).

Remember that if you find yourself unable to form a WHERE clause in
this method (ex. boolean operations), you can always specify it as
a string like:

::

    array(
        'Model.field & 8 = 1',
        //other conditions as usual
    )

By default, CakePHP joins multiple conditions with boolean AND;
which means, the snippet above would only match posts that have
been created in the past two weeks, and have a title that matches
one in the given set. However, we could just as easily find posts
that match either condition:

::

    array( "OR" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake accepts all valid SQL boolean operations, including AND, OR,
NOT, XOR, etc., and they can be upper or lower case, whichever you
prefer. These conditions are also infinitely nest-able. Let's say
you had a belongsTo relationship between Posts and Authors. Let's
say you wanted to find all the posts that contained a certain
keyword (“magic”) or were created in the past two weeks, but you
want to restrict your search to posts written by Bob:

::

    array (
        "Author.name" => "Bob", 
        "OR" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

If you need to set multiple conditions on the same field, like when
you want to do a LIKE search with multiple terms, you can do so by
using conditions similar to:
::

     array(
        'OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
        )
    );

Cake can also check for null fields. In this example, the query
will return records where the post title is not null:

::

    array ("NOT" => array (
            "Post.title" => null
        )
    )

To handle BETWEEN queries, you can use the following:

::

    array('Post.id BETWEEN ? AND ?' => array(1,10))

Note: CakePHP will quote the numeric values depending on the field
type in your DB.

How about GROUP BY?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

The data returned for this would be in the following format:

::

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
        [1] => Array....

A quick example of doing a DISTINCT query. You can use other
operators, such as MIN(), MAX(), etc., in a similar fashion

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

You can create very complex conditions, by nesting multiple
condition arrays:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.city' => 'CA')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

Which produces the following SQL:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`
    
    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

**Sub-queries**

For the example, imagine we have a "users" table with "id", "name"
and "status". The status can be "A", "B" or "C". And we want to get
all the users that have status different than "B" using sub-query.

In order to achieve that we are going to get the model data source
and ask it to build the query as if we were calling a find method,
but it will just return the SQL statement. After that we make an
expression and add it to the conditions array.

::

    $conditionsSubQuery['"User2"."status"'] = 'B';
    
    $dbo = $this->User->getDataSource();
    $subQuery = $dbo->buildStatement(
        array(
            'fields' => array('"User2"."id"'),
            'table' => $dbo->fullTableName($this->User),
            'alias' => 'User2',
            'limit' => null,
            'offset' => null,
            'joins' => array(),
            'conditions' => $conditionsSubQuery,
            'order' => null,
            'group' => null
        ),
        $this->User
    );
    $subQuery = ' "User"."id" NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $dbo->expression($subQuery);
    
    $conditions[] = $subQueryExpression;
    
    $this->User->find('all', compact('conditions'));

This should generate the following SQL:

::

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

Also, if you need to pass just part of your query as raw SQL as the
above, datasource **expressions** with raw SQL work for any part of
the find query.

3.7.3 Retrieving Your Data
--------------------------

find
~~~~

``find($type, $params)``

Find is the multifunctional workhorse of all model data-retrieval
functions. ``$type`` can be either ``'all'``, ``'first'``,
``'count'``, ``'list'``, ``'neighbors'`` or ``'threaded'``. The
default find type is ``'first'``. Keep in mind that ``$type`` is
case sensitive. Using a upper case character (for example
``'All'``) will not produce the expected results.

``$params`` is used to pass all parameters to the various finds,
and has the following possible keys by default - all of which are
optional:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //array of conditions
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //array of field names
        'order' => array('Model.created', 'Model.field3 DESC'), //string or array defining order
        'group' => array('Model.field'), //fields to GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset'=>n, //int   
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

It's also possible to add and use other parameters, as is made use
of by some find types, behaviors and of course possible with your
own model methods

More information about model callbacks is available
`here </view/1048/Callback-Methods>`_

find('first')
^^^^^^^^^^^^^

``find('first', $params)``

'first' is the default find type, and will return one result, you'd
use this for any use where you expect only one result. Below are a
couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $this->Article->order = null; // resetting if it's set
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulating the model having a default order
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

In the first example, no parameters at all are passed to find -
therefore no conditions or sort order will be used. The format
returned from ``find('first')`` call is of the form:

::

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

There are no additional parameters used by ``find('first')``.

find('count')
^^^^^^^^^^^^^

``find('count', $params)``

``find('count', $params)`` returns an integer value. Below are a
couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

Don't pass ``fields`` as an array to ``find('count')``. You would
only need to specify fields for a DISTINCT count (since otherwise,
the count is always the same - dictated by the conditions).

There are no additional parameters used by ``find('count')``.

find('all')
^^^^^^^^^^^

``find('all', $params)``

``find('all')`` returns an array of (potentially multiple) results.
It is in fact the mechanism used by all ``find()`` variants, as
well as ``paginate``. Below are a couple of simple (controller
code) examples:

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none
were passed.

The results of a call to ``find('all')`` will be of the following
form:

::

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

There are no additional parameters used by ``find('all')``.

find('list')
^^^^^^^^^^^^

``find('list', $params)``

``find('list', $params)`` returns an indexed array, useful for any
use where you would want a list such as for populating input select
boxes. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
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
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none
were passed.

The results of a call to ``find('list')`` will be in the following
form:

::

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

When calling ``find('list')`` the ``fields`` passed are used to
determine what should be used as the array key, value and
optionally what to group the results by. By default the primary key
for the model is used for the key, and the display field (which can
be configured using the model attribute
`displayField </view/1062/displayField>`_) is used for the value.
Some further examples to clarify:.

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

With the above code example, the resultant vars would look
something like this:

::

    
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

find('threaded')
^^^^^^^^^^^^^^^^

``find('threaded', $params)``

``find('threaded', $params)`` returns a nested array, and is
appropriate if you want to use the ``parent_id`` field of your
model data to build nested results. Below are a couple of simple
(controller code) examples:

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42))); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

It is not necessary to use `the Tree behavior </view/1339/Tree>`_
to use this method - but all desired results must be possible to be
found in a single query.

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The second example
makes use of the data structure used by the
`Tree behavior </view/1339/Tree>`_ the return a partial, nested,
result for ``$aCategory`` and everything below it. The results of a
call to ``find('threaded')`` will be of the following form:

::

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

The order results appear can be changed as it is influence by the
order of processing. For example, if ``'order' => 'name ASC'`` is
passed in the params to ``find('threaded')``, the results will
appear in name order. Likewise any order can be used, there is no
inbuilt requirement of this method for the top result to be
returned first.

There are no additional parameters used by ``find('threaded')``.

find('neighbors')
^^^^^^^^^^^^^^^^^

``find('neighbors', $params)``

'neighbors' will perform a find similar to 'first', but will return
the row before and after the one you request. Below is a simple
(controller code) example:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

You can see in this example the two required elements of the
``$params`` array: field and value. Other elements are still
allowed as with any other find (Ex: If your model acts as
containable, then you can specify 'contain' in ``$params``). The
format returned from a ``find('neighbors')`` call is in the form:

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

Note how the result always contains only two root elements: prev
and next. This function does not honor a model's default recursive
var. The recursive setting must be passed in the parameters on each
call.

Does not honor the recursive attribute on a model. You must set the
recursive param to utilize the recursive feature.

findAllBy
~~~~~~~~~

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $rercursive)``

These magic functions can be used as a shortcut to search your
tables by a certain field. Just add the name of the field (in
CamelCase format) to the end of these functions, and supply the
criteria for that field as the first parameter.

PHP5 findAllBy<x> Example
Corresponding SQL Fragment
$this->Product->findAllByOrderStatus(‘3’);
Product.order\_status = 3
$this->Recipe->findAllByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findAllByLastName(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findAllById(7);
Cake.id = 7
$this->User->findAllByUserName(‘psychic’, array(),
array('User.user\_name => 'asc'));
User.user\_name = ‘psychic’ ORDER BY User.user\_name ASC
PHP4 users have to use this function a little differently due to
some case-insensitivity in PHP4:

PHP4 findAllBy<x> Example
Corresponding SQL Fragment
$this->Product->findAllByOrder\_status(‘3’);
Product.order\_status = 3
$this->Recipe->findAllByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findAllByLast\_name(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findAllById(7);
Cake.id = 7
$this->User->findAllByUser\_name(‘psychic’);
User.user\_name = ‘psychic’
The returned result is an array formatted just as it would be from
findAll().

findBy
~~~~~~

``findBy<fieldName>(string $value);``

The findBy magic functions also accept some optional parameters:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``

These magic functions can be used as a shortcut to search your
tables by a certain field. Just add the name of the field (in
CamelCase format) to the end of these functions, and supply the
criteria for that field as the first parameter.

PHP5 findBy<x> Example
Corresponding SQL Fragment
$this->Product->findByOrderStatus(‘3’);
Product.order\_status = 3
$this->Recipe->findByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findByLastName(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findById(7);
Cake.id = 7
$this->User->findByUserName(‘psychic’);
User.user\_name = ‘psychic’
PHP4 users have to use this function a little differently due to
some case-insensitivity in PHP4:

PHP4 findBy<x> Example
Corresponding SQL Fragment
$this->Product->findByOrder\_status(‘3’);
Product.order\_status = 3
$this->Recipe->findByType(‘Cookie’);
Recipe.type = ‘Cookie’
$this->User->findByLast\_name(‘Anderson’);
User.last\_name = ‘Anderson’
$this->Cake->findById(7);
Cake.id = 7
$this->User->findByUser\_name(‘psychic’);
User.user\_name = ‘psychic’
findBy() functions like find('first',...), while findAllBy()
functions like find('all',...).

In either case, the returned result is an array formatted just as
it would be from find() or findAll(), respectively.

query
~~~~~

``query(string $query)``

SQL calls that you can't or don't want to make via other model
methods (this should only rarely be necessary) can be made using
the model's ``query()`` method.

If you’re ever using this method in your application, be sure to
check out CakePHP’s
`Sanitize library </view/1183/Data-Sanitization>`_, which aids in
cleaning up user-provided data from injection and cross-site
scripting attacks.

``query()`` does not honour $Model->cachequeries as its
functionality is inherently disjoint from that of the calling
model. To avoid caching calls to query, supply a second argument of
false, ie: ``query($query, $cachequeries = false)``

``query()`` uses the table name in the query as the array key for
the returned data, rather than the model name. For example,

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

might return

::

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
rewritten:

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

which returns

::

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

This syntax and the corresponding array structure is valid for
MySQL only. Cake does not provide any data abstraction when running
queries manually, so exact results will vary between databases.

field
~~~~~

``field(string $name, array $conditions = null, string $order = null)``

Returns the value of a single field, specified as ``$name``, from
the first record matched by $conditions as ordered by $order. If no
conditions are passed and the model id is set, will return the
field value for the current model result. If no matching record is
found returns false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // echo the name for row id 22
    
    echo $this->Post->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // echo the name of the last created instance

read()
~~~~~~

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

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // gets the rating of the record being deleted.
       $name = $this->read('name', 2); // gets the name of a second record.
       $rating = $this->read('rating'); // gets the rating of the second record.
       $this->id = $id3; //
       $this->Article->read(); // reads a third record
       $record = $this->data // stores the third record in $record
       ...
    }

Notice that the third call to ``read()`` fetches the rating of the
same record read before. That is because ``read()`` changes
``Model::$id`` to any value passed as ``$id``. Lines 6-8
demonstrate how ``read()`` changes the current model data.
``read()`` will also unset all validation errors on the model. If
you would like to keep them, use ``find('first')`` instead.

Complex Find Conditions
~~~~~~~~~~~~~~~~~~~~~~~

Most of the model's find calls involve passing sets of conditions
in one way or another. The simplest approach to this is to use a
WHERE clause snippet of SQL. If you find yourself needing more
control, you can use arrays.

Using arrays is clearer and easier to read, and also makes it very
easy to build queries. This syntax also breaks out the elements of
your query (fields, values, operators, etc.) into discrete,
manipulatable parts. This allows CakePHP to generate the most
efficient query possible, ensure proper SQL syntax, and properly
escape each individual part of the query.

At it's most basic, an array-based query looks like this:

::

    $conditions = array("Post.title" => "This is a post");
    //Example usage with a model:
    $this->Post->find('first', array('conditions' => $conditions));

The structure here is fairly self-explanatory: it will find any
post where the title equals "This is a post". Note that we could
have used just "title" as the field name, but when building
queries, it is good practice to always specify the model name, as
it improves the clarity of the code, and helps prevent collisions
in the future, should you choose to change your schema.

What about other types of matches? These are equally simple. Let's
say we wanted to find all the posts where the title is not "This is
a post":

::

    array("Post.title <>" => "This is a post")

Notice the '<>' that follows the field name. CakePHP can parse out
any valid SQL comparison operator, including match expressions
using LIKE, BETWEEN, or REGEX, as long as you leave a space between
field name and the operator. The one exception here is IN
(...)-style matches. Let's say you wanted to find posts where the
title was in a given set of values:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

To do a NOT IN(...) match to find posts where the title is not in
the given set of values:

::

    array(
        "NOT" => array("Post.title" => array("First post", "Second post", "Third post"))
    )

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

You can also create finds that compare two fields in the database

::

    array("Post.created = Post.modified")

This above example will return posts where the created date is
equal to the modified date (ie it will return posts that have never
been modified).

Remember that if you find yourself unable to form a WHERE clause in
this method (ex. boolean operations), you can always specify it as
a string like:

::

    array(
        'Model.field & 8 = 1',
        //other conditions as usual
    )

By default, CakePHP joins multiple conditions with boolean AND;
which means, the snippet above would only match posts that have
been created in the past two weeks, and have a title that matches
one in the given set. However, we could just as easily find posts
that match either condition:

::

    array( "OR" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake accepts all valid SQL boolean operations, including AND, OR,
NOT, XOR, etc., and they can be upper or lower case, whichever you
prefer. These conditions are also infinitely nest-able. Let's say
you had a belongsTo relationship between Posts and Authors. Let's
say you wanted to find all the posts that contained a certain
keyword (“magic”) or were created in the past two weeks, but you
want to restrict your search to posts written by Bob:

::

    array (
        "Author.name" => "Bob", 
        "OR" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

If you need to set multiple conditions on the same field, like when
you want to do a LIKE search with multiple terms, you can do so by
using conditions similar to:
::

     array(
        'OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
        )
    );

Cake can also check for null fields. In this example, the query
will return records where the post title is not null:

::

    array ("NOT" => array (
            "Post.title" => null
        )
    )

To handle BETWEEN queries, you can use the following:

::

    array('Post.id BETWEEN ? AND ?' => array(1,10))

Note: CakePHP will quote the numeric values depending on the field
type in your DB.

How about GROUP BY?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

The data returned for this would be in the following format:

::

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
        [1] => Array....

A quick example of doing a DISTINCT query. You can use other
operators, such as MIN(), MAX(), etc., in a similar fashion

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

You can create very complex conditions, by nesting multiple
condition arrays:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.city' => 'CA')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

Which produces the following SQL:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`
    
    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

**Sub-queries**

For the example, imagine we have a "users" table with "id", "name"
and "status". The status can be "A", "B" or "C". And we want to get
all the users that have status different than "B" using sub-query.

In order to achieve that we are going to get the model data source
and ask it to build the query as if we were calling a find method,
but it will just return the SQL statement. After that we make an
expression and add it to the conditions array.

::

    $conditionsSubQuery['"User2"."status"'] = 'B';
    
    $dbo = $this->User->getDataSource();
    $subQuery = $dbo->buildStatement(
        array(
            'fields' => array('"User2"."id"'),
            'table' => $dbo->fullTableName($this->User),
            'alias' => 'User2',
            'limit' => null,
            'offset' => null,
            'joins' => array(),
            'conditions' => $conditionsSubQuery,
            'order' => null,
            'group' => null
        ),
        $this->User
    );
    $subQuery = ' "User"."id" NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $dbo->expression($subQuery);
    
    $conditions[] = $subQueryExpression;
    
    $this->User->find('all', compact('conditions'));

This should generate the following SQL:

::

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

Also, if you need to pass just part of your query as raw SQL as the
above, datasource **expressions** with raw SQL work for any part of
the find query.
