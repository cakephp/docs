New ORM upgrade guide
#####################

CakePHP 3.0 features a new ORM that has been re-written from the ground up.
While the ORM used in 1.x and 2.x has served us well for a long time it had
a few issues that we wanted to fix.

* Frankenstein - is it a record, or a table? Currently its both.
* Inconsistent API - Model::read() for example.
* No query object - Queries are always defined as arrays, this has some
  limitations and restrictions. For example it makes doing unions and
  sub-queries much harder.
* Returns arrays.  This is a common complaint about CakePHP, and has probably
  reduced adoption at some levels.
* No record object - This makes attaching formatting methods
  difficult/impossible.
* Containable - Should be part of the ORM, not a crazy hacky behaviour.
* Recursive - This should be better controlled as defining which associations
  are included, not a level of recursiveness.
* DboSource - It is a beast, and Model relies on it more than datasource.  That
  separation could be cleaner and simpler.
* Validation - Should be separate, its a giant crazy function right now.  Making
  it a reusable bit would make the framework more extensible.

The ORM in CakePHP 3.0 solves these and many more problems. The new ORM
focuses on relational data stores right now. In the future and through plugins
we will add non relational stores like ElasticSearch and others.

Design of the new ORM
=====================

The new ORM solves several problems by having more specialized and focused
classes. In the past you would use ``Model`` and a Datasource for all
operations. Now the ORM is split into more layers:

* ``Cake\Database\Connection`` - Provides a platform independent way to create
  and use connections. This class provides a way to use transactions,
  execute queries and access schema data.
* ``Cake\Database\Dialect`` - The classes in this namespace provide platform
  specific SQL and transform queries to work around platform specific
  limitations.
* ``Cake\Database\Type`` - Is the gateway class to CakePHP database type
  conversion system. It is a pluggable framework for adding abstract column
  types and providing mappings between database,  PHP representations and PDO
  bindings for each data type. For example datetime columns are represented as
  ``DateTime`` instances in your code now.
* ``Cake\ORM\Table`` - The main entry point into the new ORM. Provides access
  to a single table. Handles the definition of assocation, use of behaviors and
  creation of entities and query objects.
* ``Cake\ORM\Behavior`` - The base class for behaviors, which act very similar
  to behaviors in previous versions of CakePHP.
* ``Cake\ORM\Query`` - A fluent object based query builder that replaces
  the deeply nested arrays used in previous versions of CakePHP.
* ``Cake\ORM\ResultSet`` - A collection of results that gives powerful tools
  for manipulating data in aggregate.
* ``Cake\ORM\Entity`` - Represents a single row result. Makes accessing data
  and serializing to various formats a snap.

Now that you are more familiar with some of the classes you'll interact with
most frequently in the new ORM it is good to look at the three most important
classes. The ``Table``, ``Query`` and ``Entity`` classes do much of the heavy
lifting in the new ORM, and each serves a different purpose.

Table objects
-------------

Table objects are the gateway into your data. They handle many of the tasks that
``Model`` did in previous releases. Table classes handle tasks like:

- Creating queries.
- Providing finders.
- Validating and saving entities.
- Deleting entities.
- Defining & accessing associations.
- Triggering callback events.
- Interacting with behaviors.

The documentation chapter on :doc:`/orm/table-objects` provides far more detail
on how to use table objects than this guide can. Generally when moving existing
model code over it will end up in a table object. Table objects don't contain
any platform dependent SQL. Instead they collaborate with entities and the query
builder to do their work. Table objects also interact with behaviors and other
interested parties through published events.

Query objects
-------------

While these are not classes you will build yourself, your application code will
make extensive use of the :doc:`/orm/query-builder` which is central to the new
ORM. The query builder makes it easy to build simple or complex queries
including those that were previosuly very difficult in CakePHP like ``HAVING``,
``UNION`` and sub-queries.

The various find() calls your application has currently will need to be updated
to use the new query builder. The Query object is responsible for containing the
data to make a query without executing the query itself. It collaborates with
the connection/dialect to generate platform specific SQL which is executed
creating a ``ResultSet`` as the output.

Entity objects
--------------

In previous versions of CakePHP the ``Model`` class returned dumb arrays that
could not contain any logic or behavior. While the community made this
short-coming less painful with projects like CakeEntity, the array results were
often a short coming that caused many developers trouble. For CakePHP 3.0, the
ORM always returns object result sets unless you explicitly disable that
feature. The chapter on :doc:`/orm/entities` covers the various tasks you can
accomplish with entities.

Entities are created in one of two ways. Either by loading data from the
database, or converting request data into entities. Once created entities allow
you to manipulate the data they contain and persist their data by collaborating
with table objects.

Key differences
===============

The new ORM is a large departure from the existing ``Model`` layer, there are
many important differences that are important in understanding how the new ORM
operates and how to update your code.

Inflection rules updated
------------------------

You may have noticed that table classes have a pluralized name. In addition to
tables having pluralized names, associations are also referred to in the plural
form. This is in contrast to Model where names and associations were singular.
There were a few reasons for this change:

* Table classes represent **collections** of data, not single rows.
* Associations link tables together, describing the relations between many
  things.

While the conventions for table objects are to always use plural forms, your
entities will have their association properties populated based on the
association type. BelongsTo and HasOne associations will use the singular form,
while HasMany and BelongsToMany (HABTM) will use plural forms. The convention
change for table objects is most apparent when building queries. Instead of
expressing queries like::

    // Wrong
    $query->where(['User.active' => 1]);

You need to use the plural form::

    // Correct
    $query->where(['Users.active' => 1]);

Find returns a query object
---------------------------

TODO

Finder method changes
---------------------

TODO


Recursive and ContainableBehavior removed.
------------------------------------------

In previous versions of CakePHP you needed to use ``recursive``,
``bindModel()``, ``unbindModel()`` and ``ContainableBehavior`` to reduce the
loaded data to the set of associations you were interested in. A common tactic
to manage associations was to set ``recursive`` to ``-1`` and use Containable to
manage all associations. In CakePHP 3.0 ContainableBehavior, recursive,
bindModel, and unbindModel have all been removed. Instead the ``contain()``
method has been promoted to be a core feature of the query builder. Associations
are only loaded if they are explicitly turned on. For example::

    $query = $this->Articles->find('all');

Will **only** load data from the ``articles`` table as no associations have been
included. To load articles and their related authors you would do::

    $query = $this->Articles->find('all')->contain(['Authors']);

By only loading associated data that has been specifically requested you spend
less time fighting the ORM trying to get only the data you want.

No afterFind event or virtual fields
------------------------------------

In previous versions of CakePHP you needed to make extensive use of the
``afterFind`` callback and virtual fields in order to create generated data
properties. These features have been removed in 3.0. Because of how ResultSets
iteratively generate entities, the ``afterFind`` callback was not possible.
Both afterFind and virtual fields can largely be replaced with virtual
properies on entities. For example if your User entity has both first and last
name columns you can add an accessor for `full_name` and generate the property
on the fly::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entitiy {
        public function getFullName() {
            return $this->first_name . '  ' $this->last_name;
        }
    }

Once defined you can access your new property using ``$user->full_name``.
Using the :ref:`map-reduce` features of the ORM allow you to build aggregated
data from your results, which is another use case that the ``afterFind``
callback was often used for.

While virtual fields are no longer an explicit feature of the ORM, adding
calculated fields is easy to do in your finder methods. By using the query
builder and expression objects you can achieve the same results that virtual
fields gave::

    namespace App\Model\Repository;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table {
        function findAverage(Query $query, array $options = []) {
            $avg = $query->newExpr()->add('AVG(rating)');
            $query->select(['average' => $avg]);
            return $query;
        }
    }

Validation and associations no longer properties
------------------------------------------------

TODO

Identifier quoting disabled by default
--------------------------------------

TODO

Updating behaviors
==================

* Base class changed.
* Mixin method signature changes.
* Event method signature changes.

