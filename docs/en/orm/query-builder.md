# Query Builder

`class` Cake\\ORM\\**Query**

The ORM's query builder provides a simple to use fluent interface for creating
and running queries. By composing queries together, you can create advanced
queries using unions and subqueries with ease.

Underneath the covers, the query builder uses PDO prepared statements which
protect against SQL injection attacks.

## The Query Object

The easiest way to create a `Query` object is to use `find()` from a
`Table` object. This method will return an incomplete query ready to be
modified. You can also use a table's connection object to access the lower level
Query builder that does not include ORM features, if necessary. See the
[Database Queries](../orm/database-basics#database-queries) section for more information:

``` php
use Cake\ORM\TableRegistry;

// Prior to 3.6 use TableRegistry::get('Articles')
$articles = TableRegistry::getTableLocator()->get('Articles');

// Start a new query.
$query = $articles->find();
```

When inside a controller, you can use the automatic table variable that is
created using the conventions system:

``` php
// Inside ArticlesController.php

$query = $this->Articles->find();
```

### Selecting Rows From A Table

``` php
use Cake\ORM\TableRegistry;

// Prior to 3.6 use TableRegistry::get('Articles')
$query = TableRegistry::getTableLocator()->get('Articles')->find();

foreach ($query as $article) {
    debug($article->title);
}
```

For the remaining examples, assume that `$articles` is a
`Cake\ORM\Table`. When inside controllers, you can use
`$this->Articles` instead of `$articles`.

Almost every method in a `Query` object will return the same query, this means
that `Query` objects are lazy, and will not be executed unless you tell them
to:

``` php
$query->where(['id' => 1]); // Return the same query object
$query->order(['title' => 'DESC']); // Still same object, no SQL executed
```

You can of course chain the methods you call on Query objects:

``` php
$query = $articles
    ->find()
    ->select(['id', 'name'])
    ->where(['id !=' => 1])
    ->order(['created' => 'DESC']);

foreach ($query as $article) {
    debug($article->created);
}
```

If you try to call `debug()` on a Query object, you will see its internal
state and the SQL that will be executed in the database:

``` php
debug($articles->find()->where(['id' => 1]));

// Outputs
// ...
// 'sql' => 'SELECT * FROM articles where id = ?'
// ...
```

You can execute a query directly without having to use `foreach` on it.
The easiest way is to either call the `all()` or `toList()` methods:

``` php
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
    ->toList();

foreach ($resultsArray as $article) {
    debug($article->id);
}

debug($resultsArray[0]->title);
```

In the above example, `$resultsIteratorObject` will be an instance of
`Cake\ORM\ResultSet`, an object you can iterate and apply several extracting
and traversing methods on.

Often, there is no need to call `all()`, you can simply iterate the
Query object to get its results. Query objects can also be used directly as the
result object; trying to iterate the query, calling `toList()` or some of the
methods inherited from [Collection](../core-libraries/collections), will
result in the query being executed and results returned to you.

### Selecting A Single Row From A Table

You can use the `first()` method to get the first result in the query:

``` php
$article = $articles
    ->find()
    ->where(['id' => 1])
    ->first();

debug($article->title);
```

### Getting A List Of Values From A Column

``` php
// Use the extract() method from the collections library
// This executes the query as well
$allTitles = $articles->find()->extract('title');

foreach ($allTitles as $title) {
    echo $title;
}
```

You can also get a key-value list out of a query result:

``` php
$list = $articles->find('list');

foreach ($list as $id => $title) {
    echo "$id : $title"
}
```

For more information on how to customize the fields used for populating the list
refer to [Table Find List](../orm/retrieving-data-and-resultsets#table-find-list) section.

### Queries Are Collection Objects

Once you get familiar with the Query object methods, it is strongly encouraged
that you visit the [Collection](../core-libraries/collections) section to
improve your skills in efficiently traversing the data. In short, it is
important to remember that anything you can call on a Collection object, you
can also do in a Query object:

``` php
// Use the combine() method from the collections library
// This is equivalent to find('list')
$keyValueList = $articles->find()->combine('id', 'title');

// An advanced example
$results = $articles->find()
    ->where(['id >' => 1])
    ->order(['title' => 'DESC'])
    ->map(function ($row) { // map() is a collection method, it executes the query
        $row->trimmedTitle = trim($row->title);
        return $row;
    })
    ->combine('id', 'trimmedTitle') // combine() is another collection method
    ->toArray(); // Also a collections library method

foreach ($results as $id => $trimmedTitle) {
    echo "$id : $trimmedTitle";
}
```

### Queries Are Lazily Evaluated

Query objects are lazily evaluated. This means a query is not executed until one
of the following things occur:

- The query is iterated with `foreach()`.
- The query's `execute()` method is called. This will return the underlying
  statement object, and is to be used with insert/update/delete queries.
- The query's `first()` method is called. This will return the first result in the set
  built by `SELECT` (it adds `LIMIT 1` to the query).
- The query's `all()` method is called. This will return the result set and
  can only be used with `SELECT` statements.
- The query's `toList()` or `toArray()` method is called.

Until one of these conditions are met, the query can be modified without additional
SQL being sent to the database. It also means that if a Query hasn't been
evaluated, no SQL is ever sent to the database. Once executed, modifying and
re-evaluating a query will result in additional SQL being run.

If you want to take a look at what SQL CakePHP is generating, you can turn
database [query logging](../orm/database-basics#database-query-logging) on.

## Selecting Data

CakePHP makes building `SELECT` queries simple. To limit the fields fetched,
you can use the `select()` method:

``` php
$query = $articles->find();
$query->select(['id', 'title', 'body']);
foreach ($query as $row) {
    debug($row->title);
}
```

You can set aliases for fields by providing fields as an associative array:

``` php
// Results in SELECT id AS pk, title AS aliased_title, body ...
$query = $articles->find();
$query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);
```

To select distinct fields, you can use the `distinct()` method:

``` php
// Results in SELECT DISTINCT country FROM ...
$query = $articles->find();
$query->select(['country'])
    ->distinct(['country']);
```

To set some basic conditions you can use the `where()` method:

``` php
// Conditions are combined with AND
$query = $articles->find();
$query->where(['title' => 'First Post', 'published' => true]);

// You can call where() multiple times
$query = $articles->find();
$query->where(['title' => 'First Post'])
    ->where(['published' => true]);
```

You can also pass an anonymous function to the `where()` method. The passed
anonymous function will receive an instance of
`\Cake\Database\Expression\QueryExpression` as its first argument, and
`\Cake\ORM\Query` as its second:

``` php
$query = $articles->find();
$query->where(function (QueryExpression $exp, Query $q) {
    return $exp->eq('published', true);
});
```

See the [Advanced Query Conditions](#advanced-query-conditions) section to find out how to construct
more complex `WHERE` conditions.

### Selecting Specific Fields

By default a query will select all fields from a table, the exception is when you
call the `select()` function yourself and pass certain fields:

``` php
// Only select id and title from the articles table
$articles->find()->select(['id', 'title']);
```

If you wish to still select all fields from a table after having called
`select($fields)`, you can pass the table instance to `select()` for this
purpose:

``` php
// Only all fields from the articles table including
// a calculated slug field.
$query = $articlesTable->find();
$query
    ->select(['slug' => $query->func()->concat(['title' => 'identifier', '-', 'id' => 'identifier'])])
    ->select($articlesTable); // Select all fields from articles
```

::: info Added in version 3.1
Passing a table object to select() was added in 3.1.
:::

If you want to select all but a few fields on a table, you can use
`selectAllExcept()`:

``` php
$query = $articlesTable->find();

// Get all fields except the published field.
$query->selectAllExcept($articlesTable, ['published']);
```

You can also pass an `Association` object when working with contained
associations.

::: info Added in version 3.6.0
The `selectAllExcept()` method was added.
:::

<a id="using-sql-functions"></a>

### Using SQL Functions

CakePHP's ORM offers abstraction for some commonly used SQL functions. Using the
abstraction allows the ORM to select the platform specific implementation of the
function you want. For example, `concat` is implemented differently in MySQL,
PostgreSQL and SQL Server. Using the abstraction allows your code to be
portable:

``` php
// Results in SELECT COUNT(*) count FROM ...
$query = $articles->find();
$query->select(['count' => $query->func()->count('*')]);
```

A number of commonly used functions can be created with the `func()` method:

`rand()`  
Generate a random value between 0 and 1 via SQL.

`sum()`  
Calculate a sum. <span class="title-ref">Assumes arguments are literal values.</span>

`avg()`  
Calculate an average. <span class="title-ref">Assumes arguments are literal values.</span>

`min()`  
Calculate the min of a column. <span class="title-ref">Assumes arguments are literal values.</span>

`max()`  
Calculate the max of a column. <span class="title-ref">Assumes arguments are literal values.</span>

`count()`  
Calculate the count. <span class="title-ref">Assumes arguments are literal values.</span>

`concat()`  
Concatenate two values together. <span class="title-ref">Assumes arguments are bound parameters.</span>

`coalesce()`  
Coalesce values. <span class="title-ref">Assumes arguments are bound parameters.</span>

`dateDiff()`  
Get the difference between two dates/times. <span class="title-ref">Assumes arguments are bound parameters.</span>

`now()`  
Defaults to returning date and time, but accepts 'time' or 'date' to return only
those values.

`extract()`  
Returns the specified date part from the SQL expression.

`dateAdd()`  
Add the time unit to the date expression.

`dayOfWeek()`  
Returns a FunctionExpression representing a call to SQL WEEKDAY function.

::: info Added in version 3.1
`extract()`, `dateAdd()` and `dayOfWeek()` methods have been added.
:::

::: info Added in version 3.7
`rand()` was added.
:::

#### Function Arguments

SQL functions called through `func()` can accept SQL identifiers, literal values,
bound parameters or other `ExpressionInterface` instances as arguments:

``` php
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
```

Both `literal` and `identifier` arguments allow you to reference other columns
and SQL literals while `identifier` will be appropriately quoted if auto-quoting
is enabled. If not marked as literal or identifier, arguments will be bound
parameters allowing you to safely pass user data to the function.

The above example generates something like this in MYSQL.

``` sql
SELECT CONCAT(
    Articles.title,
    :c0,
    Categories.name,
    :c1,
    (DATEDIFF(NOW(), Articles.created))
) FROM articles;
```

The `:c0` argument will have `' - CAT:'` text bound when the query is
executed. The `dateDiff` expression was translated to the appropriate SQL.

#### Custom Functions

If `func()` does not already wrap the SQL function you need, you can call
it directly through `func()` and still safely pass arguments and user data
as described. Make sure you pass the appropriate argument type for custom
functions or they will be treated as bound parameters:

``` php
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
```

These custom function would generate something like this in MYSQL:

``` sql
SELECT YEAR(created) as yearCreated,
       DATE_FORMAT(created, '%H:%i') as timeCreated
FROM articles;
```

> [!NOTE]
> Use `func()` to pass untrusted user data to any SQL function.

### Ordering Results

To apply ordering, you can use the `order` method:

``` php
$query = $articles->find()
    ->order(['title' => 'ASC', 'id' => 'ASC']);
```

When calling `order()` multiple times on a query, multiple clauses will be
appended. However, when using finders you may sometimes need to overwrite the
`ORDER BY`. Set the second parameter of `order()` (as well as
`orderAsc()` or `orderDesc()`) to `Query::OVERWRITE` or to `true`:

``` php
$query = $articles->find()
    ->order(['title' => 'ASC']);
// Later, overwrite the ORDER BY clause instead of appending to it.
$query = $articles->find()
    ->order(['created' => 'DESC'], Query::OVERWRITE);
```

The `orderAsc` and `orderDesc` methods can be used when you need to sort on
complex expressions:

``` php
$query = $articles->find();
$concat = $query->func()->concat([
    'title' => 'identifier',
    'synopsis' => 'identifier'
]);
$query->orderAsc($concat);
```

To build complex order clauses, use a Closure to build order expressions:

``` php
$query->orderAsc(function (QueryExpression $exp, Query $query) {
    return $exp->addCase(...);
});
```

::: info Added in version 3.9.0
Using a closure with `orderDesc` and `orderAsc` was added in 3.9.0.
:::

### Limiting Results

To limit the number of rows or set the row offset you can use the `limit()`
and `page()` methods:

``` php
// Fetch rows 50 to 100
$query = $articles->find()
    ->limit(50)
    ->page(2);
```

As you can see from the examples above, all the methods that modify the query
provide a fluent interface, allowing you to build a query through chained method
calls.

### Aggregates - Group and Having

When using aggregate functions like `count` and `sum` you may want to use
`group by` and `having` clauses:

``` php
$query = $articles->find();
$query->select([
    'count' => $query->func()->count('view_count'),
    'published_date' => 'DATE(created)'
])
->group('published_date')
->having(['count >' => 3]);
```

### Case Statements

The ORM also offers the SQL `case` expression. The `case` expression allows
for implementing `if ... then ... else` logic inside your SQL. This can be useful
for reporting on data where you need to conditionally sum or count data, or where you
need to specific data based on a condition.

If we wished to know how many published articles are in our database, we could use the following SQL:

``` sql
SELECT
COUNT(CASE WHEN published = 'Y' THEN 1 END) AS number_published,
COUNT(CASE WHEN published = 'N' THEN 1 END) AS number_unpublished
FROM articles
```

To do this with the query builder, we'd use the following code:

``` php
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
```

The `addCase` function can also chain together multiple statements to create
`if .. then .. [elseif .. then .. ] [ .. else ]` logic inside your SQL.

If we wanted to classify cities into SMALL, MEDIUM, or LARGE based on population
size, we could do the following:

``` php
$query = $cities->find()
    ->where(function (QueryExpression $exp, Query $q) {
        return $exp->addCase(
            [
                $q->newExpr()->lt('population', 100000),
                $q->newExpr()->between('population', 100000, 999000),
                $q->newExpr()->gte('population', 999001),
            ],
            ['SMALL',  'MEDIUM', 'LARGE'], # values matching conditions
            ['string', 'string', 'string'] # type of each value
        );
    });
# WHERE CASE
#   WHEN population < 100000 THEN 'SMALL'
#   WHEN population BETWEEN 100000 AND 999000 THEN 'MEDIUM'
#   WHEN population >= 999001 THEN 'LARGE'
#   END
```

Any time there are fewer case conditions than values, `addCase` will
automatically produce an `if .. then .. else` statement:

``` php
$query = $cities->find()
    ->where(function (QueryExpression $exp, Query $q) {
        return $exp->addCase(
            [
                $q->newExpr()->eq('population', 0),
            ],
            ['DESERTED', 'INHABITED'], # values matching conditions
            ['string', 'string'] # type of each value
        );
    });
# WHERE CASE
#   WHEN population = 0 THEN 'DESERTED' ELSE 'INHABITED' END
```

### Fetching Arrays Instead of Entities

While ORMs and object result sets are powerful, creating entities is sometimes
unnecessary. For example, when accessing aggregated data, building an Entity may
not make sense. The process of converting the database results to entities is
called hydration. If you wish to disable this process you can do this:

``` php
$query = $articles->find();
$query->enableHydration(false); // Results as arrays instead of entities
$result = $query->toList(); // Execute the query and return the array
```

After executing those lines, your result should look similar to this:

``` php
[
    ['id' => 1, 'title' => 'First Article', 'body' => 'Article 1 body' ...],
    ['id' => 2, 'title' => 'Second Article', 'body' => 'Article 2 body' ...],
    ...
]
```

<a id="format-results"></a>

### Adding Calculated Fields

After your queries, you may need to do some post-processing. If you need to add
a few calculated fields or derived data, you can use the `formatResults()`
method. This is a lightweight way to map over the result sets. If you need more
control over the process, or want to reduce results you should use
the [Map/Reduce](../orm/retrieving-data-and-resultsets#map-reduce) feature instead. If you were querying a list
of people, you could calculate their age with a result formatter:

``` php
// Assuming we have built the fields, conditions and containments.
$query->formatResults(function (\Cake\Collection\CollectionInterface $results) {
    return $results->map(function ($row) {
        $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
        return $row;
    });
});
```

As you can see in the example above, formatting callbacks will get a
`ResultSetDecorator` as their first argument. The second argument will be
the Query instance the formatter was attached to. The `$results` argument can
be traversed and modified as necessary.

Result formatters are required to return an iterator object, which will be used
as the return value for the query. Formatter functions are applied after all the
Map/Reduce routines have been executed. Result formatters can be applied from
within contained associations as well. CakePHP will ensure that your formatters
are properly scoped. For example, doing the following would work as you may
expect:

``` php
// In a method in the Articles table
$query->contain(['Authors' => function ($q) {
    return $q->formatResults(function (\Cake\Collection\CollectionInterface $authors) {
        return $authors->map(function ($author) {
            $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
            return $author;
        });
    });
}]);

// Get results
$results = $query->all();

// Outputs 29
echo $results->first()->author->age;
```

As seen above, the formatters attached to associated query builders are scoped
to operate only on the data in the association. CakePHP will ensure that
computed values are inserted into the correct entity.

<a id="advanced-query-conditions"></a>

## Advanced Conditions

The query builder makes it simple to build complex `where` clauses.
Grouped conditions can be expressed by providing combining `where()` and
expression objects. For simple queries, you can build conditions using
an array of conditions:

``` php
$query = $articles->find()
    ->where([
        'author_id' => 3,
        'OR' => [['view_count' => 2], ['view_count' => 3]],
    ]);
```

The above would generate SQL like:

``` sql
SELECT * FROM articles WHERE author_id = 3 AND (view_count = 2 OR view_count = 3)
```

::: info Deprecated in version 3.5.0
`Query::orWhere()` creates hard to predict SQL based on the current query state. Use `Query::where()` instead as it has more predictable and easier to understand behavior.
:::

If you'd prefer to avoid deeply nested arrays, you can use the callback form of
`where()` to build your queries. The callback accepts a QueryExpression which allows
you to use the expression builder interface to build more complex conditions without arrays.
For example:

``` php
$query = $articles->find()->where(function (QueryExpression $exp, Query $query) {
    // Use add() to add multiple conditions for the same field.
    $author = $query->newExpr()->or(['author_id' => 3])->add(['author_id' => 2]);
    $published = $query->newExpr()->and(['published' => true, 'view_count' => 10]);

    return $exp->or([
        'promoted' => true,
        $query->newExpr()->and([$author, $published])
    ]);
});
```

The above generates SQL similar to:

``` sql
SELECT *
FROM articles
WHERE (
    (
        (author_id = 2 OR author_id = 3)
        AND
        (published = 1 AND view_count > 10)
    )
    OR promoted = 1
)
```

The `QueryExpression` passed to the callback allows you to use both
**combinators** and **conditions** to build the full expression.

Combinators  
These create new `QueryExpression` objects and set how the conditions added
to that expression are joined together.

- `and()` creates new expression objects that joins all conditions with `AND`.
- `or()` creates new expression objects that joins all conditions with `OR`.

Conditions  
These are added to the expression and automatically joined together
depending on which combinator was used.

The `QueryExpression` passed to the callback function defaults to `and()`:

``` php
$query = $articles->find()
    ->where(function (QueryExpression $exp) {
        return $exp
            ->eq('author_id', 2)
            ->eq('published', true)
            ->notEq('spam', true)
            ->gt('view_count', 10);
    });
```

In this example, the conditions `eq`, `notEq` and `gt` are
joined together by `AND`:

``` sql
SELECT *
FROM articles
WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10
)
```

You can build an expression with multiple **combinators** by using the `add` condition:

``` php
$query = $articles->find()
    ->where(function (QueryExpression $exp) {
        $orConditions = $exp->or(['author_id' => 2])
            ->eq('author_id', 5);
        return $exp
            ->add($orConditions)
            ->eq('published', true)
            ->gte('view_count', 10);
    });
```

Which would generate the SQL similar to:

``` sql
SELECT *
FROM articles
WHERE (
    (author_id = 2 OR author_id = 5)
    AND published = 1
    AND view_count >= 10
)
```

The **combinators** also allow you pass in a callback which takes
the new expression object as a parameter if you want to separate
the method chaining:

``` php
$query = $articles->find()
    ->where(function (QueryExpression $exp) {
        $orConditions = $exp->or(function (QueryExpression $or) {
            return $or->eq('author_id', 2)
                ->eq('author_id', 5);
        });
        return $exp
            ->not($orConditions)
            ->lte('view_count', 10);
    });
```

You can negate sub-expressions using `not()`:

``` php
$query = $articles->find()
    ->where(function (QueryExpression $exp) {
        $orConditions = $exp->or(['author_id' => 2])
            ->eq('author_id', 5);
        return $exp
            ->not($orConditions)
            ->lte('view_count', 10);
    });
```

Which will generate the following SQL looking like:

``` sql
SELECT *
FROM articles
WHERE (
    NOT (author_id = 2 OR author_id = 5)
    AND view_count <= 10
)
```

It is also possible to build expressions using SQL functions:

``` php
$query = $articles->find()
    ->where(function (QueryExpression $exp, Query $q) {
        $year = $q->func()->year([
            'created' => 'identifier'
        ]);
        return $exp
            ->gte($year, 2014)
            ->eq('published', true);
    });
```

Which will generate the following SQL looking like:

``` sql
SELECT *
FROM articles
WHERE (
    YEAR(created) >= 2014
    AND published = 1
)
```

When using the expression objects you can use the following methods to create
conditions:

- `eq()` Creates an equality condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->eq('population', '10000');
      });
  # WHERE population = 10000
  ```

- `notEq()` Creates an inequality condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->notEq('population', '10000');
      });
  # WHERE population != 10000
  ```

- `like()` Creates a condition using the `LIKE` operator:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->like('name', '%A%');
      });
  # WHERE name LIKE "%A%"
  ```

- `notLike()` Creates a negated `LIKE` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->notLike('name', '%A%');
      });
  # WHERE name NOT LIKE "%A%"
  ```

- `in()` Create a condition using `IN`:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->in('country_id', ['AFG', 'USA', 'EST']);
      });
  # WHERE country_id IN ('AFG', 'USA', 'EST')
  ```

- `notIn()` Create a negated condition using `IN`:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->notIn('country_id', ['AFG', 'USA', 'EST']);
      });
  # WHERE country_id NOT IN ('AFG', 'USA', 'EST')
  ```

- `gt()` Create a `>` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->gt('population', '10000');
      });
  # WHERE population > 10000
  ```

- `gte()` Create a `>=` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->gte('population', '10000');
      });
  # WHERE population >= 10000
  ```

- `lt()` Create a `<` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->lt('population', '10000');
      });
  # WHERE population < 10000
  ```

- `lte()` Create a `<=` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->lte('population', '10000');
      });
  # WHERE population <= 10000
  ```

- `isNull()` Create an `IS NULL` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->isNull('population');
      });
  # WHERE (population) IS NULL
  ```

- `isNotNull()` Create a negated `IS NULL` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->isNotNull('population');
      });
  # WHERE (population) IS NOT NULL
  ```

- `between()` Create a `BETWEEN` condition:

  ``` php
  $query = $cities->find()
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->between('population', 999, 5000000);
      });
  # WHERE population BETWEEN 999 AND 5000000,
  ```

- `exists()` Create a condition using `EXISTS`:

  ``` php
  $subquery = $cities->find()
      ->select(['id'])
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->equalFields('countries.id', 'cities.country_id');
      })
      ->andWhere(['population >' => 5000000]);

  $query = $countries->find()
      ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
          return $exp->exists($subquery);
      });
  # WHERE EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)
  ```

- `notExists()` Create a negated condition using `EXISTS`:

  ``` php
  $subquery = $cities->find()
      ->select(['id'])
      ->where(function (QueryExpression $exp, Query $q) {
          return $exp->equalFields('countries.id', 'cities.country_id');
      })
      ->andWhere(['population >' => 5000000]);

  $query = $countries->find()
      ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
          return $exp->notExists($subquery);
      });
  # WHERE NOT EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)
  ```

In situations when you can't get, or don't want to use the builder methods to
create the conditions you want you can also use snippets of SQL in where
clauses:

``` php
// Compare two fields to each other
$query->where(['Categories.parent_id != Parents.id']);
```

> [!WARNING]
> The field names used in expressions, and SQL snippets should **never**
> contain untrusted content. See the [Using Sql Functions](#using-sql-functions) section for
> how to safely include unsafe data into function calls.

### Using Identifiers in Expressions

When you need to reference a column or SQL identifier in your queries you can
use the `identifier()` method:

``` php
$query = $countries->find();
$query->select([
        'year' => $query->func()->year([$query->identifier('created')])
    ])
    ->where(function ($exp, $query) {
        return $exp->gt('population', 100000);
    });
```

You can use `identifier()` in comparisons to aggregations too:

``` php
$query = $this->Orders->find();
$query->select(['Customers.customer_name', 'total_orders' => $query->func()->count('Orders.order_id')])
    ->contain('Customers')
    ->group(['Customers.customer_name'])
    ->having(['total_orders >=' => $query->identifier('Customers.minimum_order_count')]);
```

> [!WARNING]
> To prevent SQL injections, Identifier expressions should never have
> untrusted data passed into them.

::: info Added in version 3.6.0
`Query::identifier()` was added in 3.6.0
:::

### Automatically Creating IN Clauses

When building queries using the ORM, you will generally not have to indicate the
data types of the columns you are interacting with, as CakePHP can infer the
types based on the schema data. If in your queries you'd like CakePHP to
automatically convert equality to `IN` comparisons, you'll need to indicate
the column data type:

``` php
$query = $articles->find()
    ->where(['id' => $ids], ['id' => 'integer[]']);

// Or include IN to automatically cast to an array.
$query = $articles->find()
    ->where(['id IN' => $ids]);
```

The above will automatically create `id IN (...)` instead of `id = ?`. This
can be useful when you do not know whether you will get a scalar or array of
parameters. The `[]` suffix on any data type name indicates to the query
builder that you want the data handled as an array. If the data is not an array,
it will first be cast to an array. After that, each value in the array will
be cast using the [type system](../orm/database-basics#database-data-types). This works with
complex types as well. For example, you could take a list of DateTime objects
using:

``` php
$query = $articles->find()
    ->where(['post_date' => $dates], ['post_date' => 'date[]']);
```

### Automatic IS NULL Creation

When a condition value is expected to be `null` or any other value, you can
use the `IS` operator to automatically create the correct expression:

``` php
$query = $categories->find()
    ->where(['parent_id IS' => $parentId]);
```

The above will create `` parent_id` = :c1 `` or `parent_id IS NULL` depending on
the type of `$parentId`

### Automatic IS NOT NULL Creation

When a condition value is expected not to be `null` or any other value, you
can use the `IS NOT` operator to automatically create the correct expression:

``` php
$query = $categories->find()
    ->where(['parent_id IS NOT' => $parentId]);
```

The above will create `` parent_id` != :c1 `` or `parent_id IS NOT NULL`
depending on the type of `$parentId`

### Raw Expressions

When you cannot construct the SQL you need using the query builder, you can use
expression objects to add snippets of SQL to your queries:

``` php
$query = $articles->find();
$expr = $query->newExpr()->add('1 + 1');
$query->select(['two' => $expr]);
```

`Expression` objects can be used with any query builder methods like
`where()`, `limit()`, `group()`, `select()` and many other methods.

> [!WARNING]
> Using expression objects leaves you vulnerable to SQL injection. You should
> never use untrusted data into expressions.

## Getting Results

Once you've made your query, you'll want to retrieve rows from it. There are
a few ways of doing this:

``` php
// Iterate the query
foreach ($query as $row) {
    // Do stuff.
}

// Get the results
$results = $query->all();
```

You can use [any of the collection](../core-libraries/collections) methods
on your query objects to pre-process or transform the results:

``` php
// Use one of the collection methods.
$ids = $query->map(function ($row) {
    return $row->id;
});

$maxAge = $query->max(function ($max) {
    return $max->age;
});
```

You can use `first` or `firstOrFail` to retrieve a single record. These
methods will alter the query adding a `LIMIT 1` clause:

``` php
// Get just the first row
$row = $query->first();

// Get the first row or an exception.
$row = $query->firstOrFail();
```

<a id="query-count"></a>

### Returning the Total Count of Records

Using a single query object, it is possible to obtain the total number of rows
found for a set of conditions:

``` php
$total = $articles->find()->where(['is_active' => true])->count();
```

The `count()` method will ignore the `limit`, `offset` and `page`
clauses, thus the following will return the same result:

``` php
$total = $articles->find()->where(['is_active' => true])->limit(10)->count();
```

This is useful when you need to know the total result set size in advance,
without having to construct another `Query` object. Likewise, all result
formatting and map-reduce routines are ignored when using the `count()`
method.

Moreover, it is possible to return the total count for a query containing group
by clauses without having to rewrite the query in any way. For example, consider
this query for retrieving article ids and their comments count:

``` php
$query = $articles->find();
$query->select(['Articles.id', $query->func()->count('Comments.id')])
    ->matching('Comments')
    ->group(['Articles.id']);
$total = $query->count();
```

After counting, the query can still be used for fetching the associated
records:

``` php
$list = $query->all();
```

Sometimes, you may want to provide an alternate method for counting the total
records of a query. One common use case for this is providing
a cached value or an estimate of the total rows, or to alter the query to remove
expensive unneeded parts such as left joins. This becomes particularly handy
when using the CakePHP built-in pagination system which calls the `count()`
method:

``` php
$query = $query->where(['is_active' => true])->counter(function ($query) {
    return 100000;
});
$query->count(); // Returns 100000
```

In the example above, when the pagination component calls the count method, it
will receive the estimated hard-coded number of rows.

<a id="caching-query-results"></a>

### Caching Loaded Results

When fetching entities that don't change often you may want to cache the
results. The `Query` class makes this simple:

``` php
$query->cache('recent_articles');
```

Will enable caching on the query's result set. If only one argument is provided
to `cache()` then the 'default' cache configuration will be used. You can
control which caching configuration is used with the second parameter:

``` php
// String config name.
$query->cache('recent_articles', 'dbResults');

// Instance of CacheEngine
$query->cache('recent_articles', $memcache);
```

In addition to supporting static keys, the `cache()` method accepts a function
to generate the key. The function you give it will receive the query as an
argument. You can then read aspects of the query to dynamically generate the
cache key:

``` php
// Generate a key based on a simple checksum
// of the query's where clause
$query->cache(function ($q) {
    return 'articles-' . md5(serialize($q->clause('where')));
});
```

The cache method makes it simple to add cached results to your custom finders or
through event listeners.

When the results for a cached query are fetched the following happens:

1.  The `Model.beforeFind` event is triggered.
2.  If the query has results set, those will be returned.
3.  The cache key will be resolved and cache data will be read. If the cache data
    is not empty, those results will be returned.
4.  If the cache misses, the query will be executed and a new `ResultSet` will be
    created. This `ResultSet` will be written to the cache and returned.

> [!NOTE]
> You cannot cache a streaming query result.

## Loading Associations

The builder can help you retrieve data from multiple tables at the same time
with the minimum amount of queries possible. To be able to fetch associated
data, you first need to setup associations between the tables as described in
the [Associations - Linking Tables Together](../orm/associations) section. This technique of combining queries
to fetch associated data from other tables is called **eager loading**.

<!--@include: ./retrieving-data-and-resultsets.md{514,718}-->

### Filtering by Associated Data

<!--@include: ./retrieving-data-and-resultsets.md{726,950}-->

<a id="adding-joins"></a>

### Adding Joins

In addition to loading related data with `contain()`, you can also add
additional joins with the query builder:

``` php
$query = $articles->find()
    ->join([
        'table' => 'comments',
        'alias' => 'c',
        'type' => 'LEFT',
        'conditions' => 'c.article_id = articles.id',
    ]);
```

You can append multiple joins at the same time by passing an associative array
with multiple joins:

``` php
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
```

As seen above, when adding joins the alias can be the outer array key. Join
conditions can also be expressed as an array of conditions:

``` php
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
```

When creating joins by hand and using array based conditions, you need to
provide the datatypes for each column in the join conditions. By providing
datatypes for the join conditions, the ORM can correctly convert data types into
SQL. In addition to `join()` you can use `rightJoin()`, `leftJoin()` and
`innerJoin()` to create joins:

``` php
// Join with an alias and string conditions
$query = $articles->find();
$query->leftJoin(
    ['Authors' => 'authors'],
    ['Authors.id = Articles.author_id']);

// Join with an alias, array conditions, and types
$query = $articles->find();
$query->innerJoin(
    ['Authors' => 'authors'],
    [
    'Authors.promoted' => true,
    'Authors.created' => new DateTime('-5 days'),
    'Authors.id = Articles.author_id'
    ],
    ['Authors.promoted' => 'boolean', 'Authors.created' => 'datetime']);
```

It should be noted that if you set the `quoteIdentifiers` option to `true` when
defining your `Connection`, join conditions between table fields should be set as follow:

``` php
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
```

This ensures that all of your identifiers will be quoted across the Query, avoiding errors with
some database Drivers (PostgreSQL notably)

## Inserting Data

Unlike earlier examples, you should not use `find()` to create insert queries.
Instead, create a new `Query` object using `query()`:

``` php
$query = $articles->query();
$query->insert(['title', 'body'])
    ->values([
        'title' => 'First post',
        'body' => 'Some body text'
    ])
    ->execute();
```

To insert multiple rows with only one query, you can chain the `values()`
method as many times as you need:

``` php
$query = $articles->query();
$query->insert(['title', 'body'])
    ->values([
        'title' => 'First post',
        'body' => 'Some body text'
    ])
    ->values([
        'title' => 'Second post',
        'body' => 'Another body text'
    ])
    ->execute();
```

Generally, it is easier to insert data using entities and
`Cake\ORM\Table::save()`. By composing a `SELECT` and
`INSERT` query together, you can create `INSERT INTO ... SELECT` style
queries:

``` php
$select = $articles->find()
    ->select(['title', 'body', 'published'])
    ->where(['id' => 3]);

$query = $articles->query()
    ->insert(['title', 'body', 'published'])
    ->values($select)
    ->execute();
```

> [!NOTE]
> Inserting records with the query builder will not trigger events such as
> `Model.afterSave`. Instead you should use the [ORM to save
> data](../orm/saving-data).

<a id="query-builder-updating-data"></a>

## Updating Data

As with insert queries, you should not use `find()` to create update queries.
Instead, create new a `Query` object using `query()`:

``` php
$query = $articles->query();
$query->update()
    ->set(['published' => true])
    ->where(['id' => $id])
    ->execute();
```

Generally, it is easier to update data using entities and
`Cake\ORM\Table::patchEntity()`.

> [!NOTE]
> Updating records with the query builder will not trigger events such as
> `Model.afterSave`. Instead you should use the [ORM to save
> data](../orm/saving-data).

## Deleting Data

As with insert queries, you should not use `find()` to create delete queries.
Instead, create new a query object using `query()`:

``` php
$query = $articles->query();
$query->delete()
    ->where(['id' => $id])
    ->execute();
```

Generally, it is easier to delete data using entities and
`Cake\ORM\Table::delete()`.

## SQL Injection Prevention

While the ORM and database abstraction layers prevent most SQL injections
issues, it is still possible to leave yourself vulnerable through improper use.

When using condition arrays, the key/left-hand side as well as single value
entries must not contain user data:

``` php
$query->where([
    // Data on the key/left-hand side is unsafe, as it will be
    // inserted into the generated query as-is
    $userData => $value,

    // The same applies to single value entries, they are not
    // safe to use with user data in any form
    $userData,
    "MATCH (comment) AGAINST ($userData)",
    'created < NOW() - ' . $userData
]);
```

When using the expression builder, column names must not contain user data:

``` php
$query->where(function (QueryExpression $exp) use ($userData, $values) {
    // Column names in all expressions are not safe.
    return $exp->in($userData, $values);
});
```

When building function expressions, function names should never contain user
data:

``` php
// Not safe.
$query->func()->{$userData}($arg1);

// Also not safe to use an array of
// user data in a function expression
$query->func()->coalesce($userData);
```

Raw expressions are never safe:

``` php
$expr = $query->newExpr()->add($userData);
$query->select(['two' => $expr]);
```

### Binding values

It is possible to protect against many unsafe situations by using bindings.
Similar to [binding values to prepared statements](../orm/database-basics#database-basics-binding-values),
values can be bound to queries using the `Cake\Database\Query::bind()`
method.

The following example would be a safe variant of the unsafe, SQL injection prone
example given above:

``` php
$query
    ->where([
        'MATCH (comment) AGAINST (:userData)',
        'created < NOW() - :moreUserData'
    ])
    ->bind(':userData', $userData, 'string')
    ->bind(':moreUserData', $moreUserData, 'datetime');
```

> [!NOTE]
> Unlike `Cake\Database\StatementInterface::bindValue()`,
> `Query::bind()` requires to pass the named placeholders including the
> colon!

## More Complex Queries

The query builder is capable of building complex queries like `UNION` queries
and sub-queries.

### Unions

Unions are created by composing one or more select queries together:

``` php
$inReview = $articles->find()
    ->where(['need_review' => true]);

$unpublished = $articles->find()
    ->where(['published' => false]);

$unpublished->union($inReview);
```

You can create `UNION ALL` queries using the `unionAll()` method:

``` php
$inReview = $articles->find()
    ->where(['need_review' => true]);

$unpublished = $articles->find()
    ->where(['published' => false]);

$unpublished->unionAll($inReview);
```

### Subqueries

Subqueries are a powerful feature in relational databases and building them in
CakePHP is fairly intuitive. By composing queries together, you can make
subqueries:

``` php
// Prior to 3.6.0 use association() instead.
$matchingComment = $articles->getAssociation('Comments')->find()
    ->select(['article_id'])
    ->distinct()
    ->where(['comment LIKE' => '%CakePHP%']);

$query = $articles->find()
    ->where(['id IN' => $matchingComment]);
```

Subqueries are accepted anywhere a query expression can be used. For example, in
the `select()` and `join()` methods.

### Adding Locking Statements

Most relational database vendors support taking out locks when doing select
operations. You can use the `epilog()` method for this:

``` php
// In MySQL
$query->epilog('FOR UPDATE');
```

The `epilog()` method allows you to append raw SQL to the end of queries. You
should never put raw user data into `epilog()`.

### Executing Complex Queries

While the query builder makes it easy to build most queries, very complex
queries can be tedious and complicated to build. You may want to [execute
the desired SQL directly](../orm/database-basics#running-select-statements).

Executing SQL directly allows you to fine tune the query that will be run.
However, doing so doesn't let you use `contain` or other higher level ORM
features.
