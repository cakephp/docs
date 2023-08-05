Fixture Upgrade
###############

As of 4.3.0 fixture schema and data management responsibilities were split.
Maintaining schema in fixture classes and migrations added complexity and
maintenance cost to applications. In 4.3.0 new APIs were added to enable you to
more easily re-use your existing migrations or schema management tools with
tests.

To upgrade to the new fixture system, you need to make a few updates:

#. First, remove the ``<listeners>`` block from your ``phpunit.xml``.
#. Add the following to your ``phpunit.xml``::

        <extensions>
            <extension class="\Cake\TestSuite\Fixture\PHPUnitExtension" />
        </extensions>

   This removes schema management from the test fixture manager. Instead your
   application needs to create/update schema at the beginning of each test run.
#. Next, update ``tests/bootstrap.php`` to create schema. There are a few
   different ways to create schema. Refer to :ref:`creating-test-database-schema`
   for the methods provided by CakePHP.
#. Then, remove all the ``$fields`` and ``$import`` properties from your fixtures.
   These properties are unused in the new fixture system.

Your tests should continue to pass, and you can experiment with
:ref:`fixture-state-management`. ``TransactionStrategy`` which yield significant
performance improvements. The trade-off with ``TransactionStrategy`` is that
your auto-increment values will no longer start at ``1`` with each test.

Legacy Fixture Documentation
================================

The following documentation applies only to the listener-based fixtures that are
the default prior to 4.3.0.

.. _fixture-schema:

Fixture Schema
--------------

We use ``$fields`` to specify which fields will be part of this table, and how
they are defined. The format used to define these fields is the same used with
:php:class:`Cake\\Database\\Schema\\Table`. The keys available for table
definition are:

type
    CakePHP internal data type. Currently supported:

    - ``string``: maps to ``VARCHAR``
    - ``char``: maps to ``CHAR``
    - ``uuid``: maps to ``UUID``
    - ``text``: maps to ``TEXT``
    - ``integer``: maps to ``INT``
    - ``biginteger``: maps to ``BIGINTEGER``
    - ``decimal``: maps to ``DECIMAL``
    - ``float``: maps to ``FLOAT``
    - ``datetime``: maps to ``DATETIME``
    - ``datetimefractional``: maps to ``DATETIME(6)`` or ``TIMESTAMP``
    - ``timestamp``: maps to ``TIMESTAMP``
    - ``timestampfractional``: maps to ``TIMESTAMP(6)`` or ``TIMESTAMP``
    - ``time``: maps to ``TIME``
    - ``date``: maps to ``DATE``
    - ``binary``: maps to ``BLOB``
length
    Set to the specific length the field should take.
precision
    Set the number of decimal places used on float & decimal fields.
null
    Set to either ``true`` (to allow NULLs) or ``false`` (to disallow NULLs).
default
    Default value the field takes.

Importing Table Information
---------------------------

Defining the schema in fixture files can be really handy when creating plugins
or libraries or if you are creating an application that needs to be portable
between database vendors. Redefining the schema in fixtures can become difficult
to maintain in larger applications. Because of this CakePHP provides the ability
to import the schema from an existing connection and use the reflected table
definition to create the table definition used in the test suite.

Let's start with an example. Assuming you have a table named articles, change the example
fixture given in the previous section
(**tests/Fixture/ArticlesFixture.php**) to::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
    }

If you want to use a different connection, use::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

Usually, you have a Table class along with your fixture. You can also
use that to retrieve the table name::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['model' => 'Articles'];
    }

It also supports plugin syntax.

You can naturally import your table definition from an existing model/table, but
have your records defined directly on the fixture as it was shown on previous
section. For example::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
        public $records = [
            [
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'modified' => '2007-03-18 10:41:31'
            ],
            [
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'modified' => '2007-03-18 10:43:31'
            ],
            [
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'modified' => '2007-03-18 10:45:31'
            ]
        ];
    }

Finally, it's possible to not load/create any schema in a fixture. This is useful if you
already have a test database setup with all the empty tables created. By
defining neither ``$fields`` nor ``$import``, a fixture will only insert its
records and truncate the records on each test method.
