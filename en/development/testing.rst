Testing
#######

CakePHP comes with comprehensive testing support built-in. CakePHP comes with
integration for `PHPUnit <https://phpunit.de>`_. In addition to the features
offered by PHPUnit, CakePHP offers some additional features to make testing
easier. This section will cover installing PHPUnit, and getting started with
Unit Testing, and how you can use the extensions that CakePHP offers.

Installing PHPUnit
==================

CakePHP uses PHPUnit as its underlying test framework. PHPUnit is the de-facto
standard for unit testing in PHP. It offers a deep and powerful set of features
for making sure your code does what you think it does. PHPUnit can be installed
through using either a `PHAR package <https://phpunit.de/#download>`__ or
`Composer <https://getcomposer.org>`_.

Install PHPUnit with Composer
-----------------------------

To install PHPUnit with Composer:

.. code-block:: console

    $ php composer.phar require --dev phpunit/phpunit:"^10.1"

This will add the dependency to the ``require-dev`` section of your
``composer.json``, and then install PHPUnit along with any dependencies.

You can now run PHPUnit using:

.. code-block:: console

    $ vendor/bin/phpunit

Using the PHAR File
-------------------

After you have downloaded the **phpunit.phar** file, you can use it to run your
tests:

.. code-block:: console

    php phpunit.phar

.. tip::

    As a convenience you can make phpunit.phar available globally
    on Unix or Linux with the following:

    .. code-block:: shell

          chmod +x phpunit.phar
          sudo mv phpunit.phar /usr/local/bin/phpunit
          phpunit --version

    Please refer to the PHPUnit documentation for instructions regarding
    `Globally installing the PHPUnit PHAR on Windows <https://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Test Database Setup
===================

Remember to have debug enabled in your **config/app_local.php** file before running
any tests.  Before running any tests you should be sure to add a ``test``
datasource configuration to **config/app_local.php**. This configuration is used by
CakePHP for fixture tables and data::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'username' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database',
        ],
    ],

.. note::

    It's a good idea to make the test database and your actual database
    different databases. This will prevent embarrassing mistakes later.

Checking the Test Setup
=======================

After installing PHPUnit and setting up your ``test`` datasource configuration
you can make sure you're ready to write and run your own tests by running your
application's tests:

.. code-block:: console

    # For phpunit.phar
    $ php phpunit.phar

    # For Composer installed phpunit
    $ vendor/bin/phpunit

The above should run any tests you have, or let you know that no tests were run.
To run a specific test you can supply the path to the test as a parameter to
PHPUnit. For example, if you had a test case for ArticlesTable class you could
run it with:

.. code-block:: console

    $ vendor/bin/phpunit tests/TestCase/Model/Table/ArticlesTableTest

You should see a green bar with some additional information about the tests run,
and number passed.

.. note::

    If you are on a Windows system you probably won't see any colors.

Test Case Conventions
=====================

Like most things in CakePHP, test cases have some conventions. Concerning
tests:

#. PHP files containing tests should be in your
   ``tests/TestCase/[Type]`` directories.
#. The filenames of these files should end in **Test.php** instead
   of just .php.
#. The classes containing tests should extend ``Cake\TestSuite\TestCase``,
   ``Cake\TestSuite\IntegrationTestCase`` or ``\PHPUnit\Framework\TestCase``.
#. Like other classnames, the test case classnames should match the filename.
   **RouterTest.php** should contain ``class RouterTest extends TestCase``.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with ``test``, as in ``testPublished()``.
   You can also use the ``@test`` annotation to mark methods as test methods.

Creating Your First Test Case
=============================

In the following example, we'll create a test case for a very simple helper
method. The helper we're going to test will be formatting progress bar HTML.
Our helper looks like::

    namespace App\View\Helper;

    use Cake\View\Helper;

    class ProgressHelper extends Helper
    {
        public function bar($value)
        {
            $width = round($value / 100, 2) * 100;

            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

This is a very simple example, but it will be useful to show how you can create
a simple test case. After creating and saving our helper, we'll create the test
case file in **tests/TestCase/View/Helper/ProgressHelperTest.php**. In that file
we'll start with the following::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase
    {
        public function setUp(): void
        {
        }

        public function testBar(): void
        {
        }
    }

We'll flesh out this skeleton in a minute. We've added two methods to start
with. First is ``setUp()``. This method is called before every *test* method
in a test case class. Setup methods should initialize the objects needed for the
test, and do any configuration needed. In our setup method we'll add the
following::

    public function setUp(): void
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

Calling the parent method is important in test cases, as ``TestCase::setUp()``
does a number things like backing up the values in
:php:class:`~Cake\\Core\\Configure` and, storing the paths in
:php:class:`~Cake\\Core\\App`.

Next, we'll fill out the test method. We'll use some assertions to ensure that
our code creates the output we expect::

    public function testBar(): void
    {
        $result = $this->Progress->bar(90);
        $this->assertStringContainsString('width: 90%', $result);
        $this->assertStringContainsString('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertStringContainsString('width: 33%', $result);
    }

The above test is a simple one but shows the potential benefit of using test
cases. We use ``assertStringContainsString()`` to ensure that our helper is returning a
string that contains the content we expect. If the result did not contain the
expected content the test would fail, and we would know that our code is
incorrect.

By using test cases you can describe the relationship between a set of
known inputs and their expected output. This helps you be more confident of the
code you're writing as you can ensure that the code you wrote fulfills the
expectations and assertions your tests make. Additionally because tests are
code, they can be re-run whenever you make a change. This helps prevent
the creation of new bugs.

.. note::

    EventManager is refreshed for each test method. This means that when running
    multiple tests at once, you will lose your event listeners that were
    registered in config/bootstrap.php as the bootstrap is only executed once.

.. _running-tests:

Running Tests
=============

Once you have PHPUnit installed and some test cases written, you'll want to run
the test cases very frequently. It's a good idea to run tests before committing
any changes to help ensure you haven't broken anything.

By using ``phpunit`` you can run your application tests. To run your
application's tests you can simply run:

.. code-block:: console

    vendor/bin/phpunit

    php phpunit.phar

If you have cloned the `CakePHP source from GitHub <https://github.com/cakephp/cakephp>`__
and wish to run CakePHP's unit-tests don't forget to execute the following ``Composer``
command prior to running ``phpunit`` so that any dependencies are installed:

.. code-block:: console

    composer install

From your application's root directory. To run tests for a plugin that is part
of your application source, first ``cd`` into the plugin directory, then use
``phpunit`` command that matches how you installed phpunit:

.. code-block:: console

    cd plugins

    ../vendor/bin/phpunit

    php ../phpunit.phar

To run tests on a standalone plugin, you should first install the project in
a separate directory and install its dependencies:

.. code-block:: console

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    php ~/phpunit.phar

Filtering Test Cases
--------------------

When you have larger test cases, you will often want to run a subset of the test
methods when you are trying to work on a single failing case. With the
CLI runner you can use an option to filter test methods:

.. code-block:: console

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

The filter parameter is used as a case-sensitive regular expression for
filtering which test methods to run.

Generating Code Coverage
------------------------

You can generate code coverage reports from the command line using PHPUnit's
built-in code coverage tools. PHPUnit will generate a set of static HTML files
containing the coverage results. You can generate coverage for a test case by
doing the following:

.. code-block:: console

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

This will put the coverage results in your application's webroot directory. You
should be able to view the results by going to
``http://localhost/your_app/coverage``.

You can also use ``phpdbg`` to generate coverage instead of xdebug.
``phpdbg`` is generally faster at generating coverage:

.. code-block:: console

    $ phpdbg -qrr phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Combining Test Suites for Plugins
---------------------------------

Often times your application will be composed of several plugins. In these
situations it can be pretty tedious to run tests for each plugin. You can make
running tests for each of the plugins that compose your application by adding
additional ``<testsuite>`` sections to your application's **phpunit.xml.dist**
file:

.. code-block:: xml

    <testsuites>
        <testsuite name="app">
            <directory>tests/TestCase/</directory>
        </testsuite>

        <!-- Add your plugin suites -->
        <testsuite name="forum">
            <directory>plugins/Forum/tests/TestCase/</directory>
        </testsuite>
    </testsuites>

Any additional test suites added to the ``<testsuites>`` element will
automatically be run when you use ``phpunit``.

If you are using ``<testsuites>`` to use fixtures from plugins that you have
installed with composer, the plugin's ``composer.json`` file should add the
fixture namespace to the autoload section. Example::

    "autoload-dev": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests/Fixture/"
        }
    },

Test Case Lifecycle Callbacks
=============================

Test cases have a number of lifecycle callbacks you can use when doing testing:

* ``setUp`` is called before every test method. Should be used to create the
  objects that are going to be tested, and initialize any data for the test.
  Always remember to call ``parent::setUp()``
* ``tearDown`` is called after every test method. Should be used to cleanup after
  the test is complete. Always remember to call ``parent::tearDown()``.
* ``setupBeforeClass`` is called once before test methods in a case are started.
  This method must be *static*.
* ``tearDownAfterClass`` is called once after test methods in a case are started.
  This method must be *static*.

.. _test-fixtures:

Fixtures
========

When testing code that depends on models and the database, one can use
**fixtures** as a way to create initial state for your application's tests.
By using fixture data you can reduce repetitive setup steps in your tests.
Fixtures are well suited to data that is common or shared amongst many or all of
your tests. Data that is only needed in a subset of tests should be created in
tests as needed.

CakePHP uses the connection named ``test`` in your **config/app.php**
configuration file. If this connection is not usable, an exception will be
raised and you will not be able to use database fixtures.

CakePHP performs the following during the course of a test run:

#. Creates tables for each of the fixtures needed.
#. Populates tables with data.
#. Runs test methods.
#. Empties the fixture tables.

The schema for fixtures is created at the beginning of a test run via migrations
or a SQL dump file.

Test Connections
----------------

By default CakePHP will alias each connection in your application. Each
connection defined in your application's bootstrap that does not start with
``test_`` will have a ``test_`` prefixed alias created. Aliasing connections
ensures, you don't accidentally use the wrong connection in test cases.
Connection aliasing is transparent to the rest of your application. For example
if you use the 'default' connection, instead you will get the ``test``
connection in test cases. If you use the 'replica' connection, the test suite
will attempt to use 'test_replica'.

.. _fixture-phpunit-configuration:

PHPUnit Configuration
---------------------

Before you can use fixtures you should double check that your ``phpunit.xml``
contains the fixture extension:

.. code-block:: xml

    <!-- in phpunit.xml -->
    <!-- Setup the extension for fixtures -->
    <extensions>
        <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
    </extensions>

The extension is included in your application and plugins generated by ``bake``
by default.

.. _creating-test-database-schema:

Creating Schema in Tests
-----------------------------

You can generate test database schema either via CakePHP's migrations, loading
a SQL dump file or using another external schema management tool. You should
create your schema in your application's ``tests/bootstrap.php`` file.

Creating Schema with Migrations
-------------------------------

If you use CakePHP's `migrations plugin <https://book.cakephp.org/migrations>`_ to manage your
application's schema, you can reuse those migrations to generate your test
database schema as well::

    // in tests/bootstrap.php
    use Migrations\TestSuite\Migrator;

    $migrator = new Migrator();

    // Simple setup for with no plugins
    $migrator->run();

    // Run migrations for a plugin
    $migrator->run(['plugin' => 'Contacts']);

    // Run the Documents migrations on the test_docs connection.
    $migrator->run(['plugin' => 'Documents', 'connection' => 'test_docs']);

If you need to run multiple sets of migrations, those can be run as follows::

    $migrator->runMany([
        // Run app migrations on test connection.
        ['connection' => 'test'],
        // Run Contacts migrations on test connection.
        ['plugin' => 'Contacts'],
        // Run Documents migrations on test_docs connection.
        ['plugin' => 'Documents', 'connection' => 'test_docs']
    ]);

Using ``runMany()`` will ensure that plugins that share a database don't drop
tables as each set of migrations is run.

The migrations plugin will only run unapplied migrations, and will reset
migrations if your current migration head differs from the applied migrations.

You can also configure how migrations should be run in tests in your datasources
configuration. See the :doc:`migrations docs </migrations>` for more information.

Creating Schema with Abstract Schema
------------------------------------

For plugins that need to define schema in tests, but don't need or want to have
dependencies on migrations, you can define schema as a structured array of
tables. This format is not recommended for application development as it can be
time-consuming to maintain.

Each table can define ``columns``, ``constraints``, and ``indexes``.
An example table would be::

     return [
       'articles' => [
          'columns' => [
              'id' => [
                  'type' => 'integer',
              ],
              'author_id' => [
                  'type' => 'integer',
                  'null' => true,
              ],
              'title' => [
                  'type' => 'string',
                  'null' => true,
              ],
              'body' => 'text',
              'published' => [
                  'type' => 'string',
                  'length' => 1,
                  'default' => 'N',
              ],
          ],
          'constraints' => [
              'primary' => [
                  'type' => 'primary',
                  'columns' => [
                      'id',
                  ],
              ],
          ],
       ],
       // More tables.
    ];

The options available to ``columns``, ``indexes`` and ``constraints`` match the
attributes that are available in CakePHP's schema reflection APIs. Tables are
created incrementally and you must take care to ensure that tables are created
before foreign key references are made. Once you have created your schema file
you can load it in your ``tests/bootstrap.php`` with::

    $loader = new SchemaLoader();
    $loader->loadInternalFile($pathToSchemaFile);

Creating Schema with SQL Dump Files
-----------------------------------

To load a SQL dump file you can use the following::

    // in tests/bootstrap.php
    use Cake\TestSuite\Fixture\SchemaLoader;

    // Load one or more SQL files.
    (new SchemaLoader())->loadSqlFiles('path/to/schema.sql', 'test');

At the beginning of each test run ``SchemaLoader`` will drop all tables in the
connection and rebuild tables based on the provided schema file.

.. _fixture-state-management:

Fixture State Managers
----------------------

By default CakePHP resets fixture state at the end of each test by truncating
all the tables in the database. This operation can become expensive as your
application grows. By using ``TransactionStrategy`` each test method will be run
inside a transaction that is rolled back at the end of the test. This can yield
improved performance but requires your tests not heavily rely on static fixture
data, as auto-increment values are not reset before each test.

The fixture state management strategy can be defined within the test case::

    use Cake\TestSuite\TestCase;
    use Cake\TestSuite\Fixture\FixtureStrategyInterface;
    use Cake\TestSuite\Fixture\TransactionStrategy;

    class ArticlesTableTest extends TestCase
    {
        /**
         * Create the fixtures strategy used for this test case.
         * You can use a base class/trait to change multiple classes.
         */
        protected function getFixtureStrategy(): FixtureStrategyInterface
        {
            return new TransactionStrategy();
        }
    }

Creating Fixtures
-----------------

Fixtures defines the records that will be inserted into the test database at the
beginning of each test. Let's create our first fixture, that will be
used to test our own Article model. Create a file named **ArticlesFixture.php**
in your **tests/Fixture** directory, with the following content::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
          // Optional. Set this property to load fixtures to a different test datasource
          public $connection = 'test';

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

.. note::

    It is recommended to not manually add values to auto incremental columns,
    as it interferes with the sequence generation in PostgreSQL and SQLServer.

The ``$connection`` property defines the datasource of which the fixture will
use.  If your application uses multiple datasources, you should make the
fixtures match the model's datasources but prefixed with ``test_``.
For example if your model uses the ``mydb`` datasource, your fixture should use
the ``test_mydb`` datasource. If the ``test_mydb`` connection doesn't exist,
your models will use the default ``test`` datasource. Fixture datasources must
be prefixed with ``test`` to reduce the possibility of accidentally truncating
all your application's data when running tests.

We can define a set of records that will be populated after the fixture table is
created. The format is fairly straight forward, ``$records`` is an array of
records. Each item in ``$records`` should be a single row. Inside each row,
should be an associative array of the columns and values for the row. Just keep
in mind that each record in the ``$records`` array must have the same keys as
rows are bulk inserted.

As you evolve your schema your fixture records may accumulate unused or
unsupported fields. You can enable ``strictFields`` on a fixture to have errors
raised when a record contains fields that are not defined in the schema::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
        protected $strictFields = true;

        // rest of fixture
    }

The ``strictFields`` mode can be useful in catching typos or when you want to
enforce stricter maintenance of test data.

.. versionadded:: 5.2.0
    ``TestFixture::$strictFields`` was added.


Dynamic Data
------------

To use functions or other dynamic data in your fixture records you can define
your records in the fixture's ``init()`` method::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
        public function init(): void
        {
            $this->records = [
                [
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'modified' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

.. note::
    When overriding ``init()`` remember to always call ``parent::init()``.

Loading Fixtures in your Test Cases
-----------------------------------

After you've created your fixtures, you'll want to use them in your test cases.
In each test case you should load the fixtures you will need. You should load a
fixture for every model that will have a query run against it. To load fixtures
you define the ``$fixtures`` property in your model::

    class ArticlesTest extends TestCase
    {
        protected $fixtures = ['app.Articles', 'app.Comments'];
    }

As of 4.1.0 you can use ``getFixtures()`` to define your fixture list with
a method::

    public function getFixtures(): array
    {
        return [
            'app.Articles',
            'app.Comments',
        ];
    }

The above will load the Article and Comment fixtures from the application's
Fixture directory. You can also load fixtures from CakePHP core, or plugins::

    class ArticlesTest extends TestCase
    {
        protected $fixtures = [
            'plugin.DebugKit.Articles',
            'plugin.MyVendorName/MyPlugin.Messages',
            'core.Comments',
        ];
    }

Using the ``core`` prefix will load fixtures from CakePHP, and using a plugin
name as the prefix, will load the fixture from the named plugin.

You can load fixtures in subdirectories. Using multiple directories can make it
easier to organize your fixtures if you have a larger application. To load
fixtures in subdirectories, simply include the subdirectory name in the fixture
name::

    class ArticlesTest extends CakeTestCase
    {
        protected $fixtures = ['app.Blog/Articles', 'app.Blog/Comments'];
    }

In the above example, both fixtures would be loaded from
``tests/Fixture/Blog/``.

You can also directly include fixtures by FQCN::

    public function getFixtures(): array
    {
        return [
            UsersFixture::class,
            ArticlesFixture::class,
        ];
    }


Fixture Factories
-----------------

As your application grows, so does the number and the size of your test
fixtures. You might find it difficult to maintain them and to keep track of
their content. The `fixture factories plugin
<https://github.com/vierge-noire/cakephp-fixture-factories>`_ proposes an
alternative for large sized applications.

The plugin uses the `test suite light plugin <https://github.com/vierge-noire/cakephp-test-suite-light>`_
in order to truncate all dirty tables before each test.

The following command will help you bake your factories::

    bin/cake bake fixture_factory -h

Once your factories are
`tuned <https://github.com/vierge-noire/cakephp-fixture-factories/blob/main/docs/factories.md>`_,
you are ready to create test fixtures in no time.

Unnecessary interaction with the database will slow down your tests as well as
your application. You can create test fixtures without persisting them which can
be useful for testing methods without DB interaction::

    $article = ArticleFactory::make()->getEntity();

In order to persist::

    $article = ArticleFactory::make()->persist();

The factories help creating associated fixtures too.
Assuming that articles belongs to many authors, we can now, for example,
create 5 articles each with 2 authors::

    $articles = ArticleFactory::make(5)->with('Authors', 2)->getEntities();

Note that the fixture factories do not require any fixture creation or
declaration. Still, they are fully compatible with the fixtures that come with
cakephp. You will find additional insights and documentation `here
<https://github.com/vierge-noire/cakephp-fixture-factories>`_.

Loading Routes in Tests
=======================

If you are testing mailers, controller components or other classes that require
routes and resolving URLs, you will need to load routes. During
the ``setUp()`` of a class or during individual test methods you can use
``loadRoutes()`` to ensure your application routes are loaded::

    public function setUp(): void
    {
        parent::setUp();
        $this->loadRoutes();
    }

This method will build an instance of your ``Application`` and call the
``routes()`` method on it. If your ``Application`` class requires specialized
constructor parameters you can provide those to ``loadRoutes($constructorArgs)``.

Creating Routes in Tests
------------------------

Sometimes it may be be necessary to dynamically add routes in tests, for example
when developing plugins, or applications that are extensible.

Just like loading existing application routes, this can be done during ``setup()``
of a test method, and/or in the individual test methods themselves::

    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Router;
    use Cake\TestSuite\TestCase;

    class PluginHelperTest extends TestCase
    {
        protected RouteBuilder $routeBuilder;

        public function setUp(): void
        {
            parent::setUp();

            $this->routeBuilder = Router::createRouteBuilder('/');
            $this->routeBuilder->scope('/', function (RouteBuilder $routes) {
                $routes->setRouteClass(DashedRoute::class);
                $routes->get(
                    '/test/view/{id}',
                    ['controller' => 'Tests', 'action' => 'view']
                );
                // ...
            });

            // ...
        }
    }

This will create a new route builder instance that will merge connected routes
into the same route collection used by all other route builder instances that
may already exist, or are yet to be created in the environment.

Loading Plugins in Tests
------------------------

If your application would dynamically load plugins, you can use
``loadPlugins()`` to load one or more plugins during tests::

    public function testMethodUsingPluginResources()
    {
        $this->loadPlugins(['Company/Cms']);
        // Test logic that requires Company/Cms to be loaded.
    }

Testing Table Classes
=====================

Let's say we already have our Articles Table class defined in
**src/Model/Table/ArticlesTable.php**, and it looks like::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query\SelectQuery;

    class ArticlesTable extends Table
    {
        public function findPublished(SelectQuery $query): SelectQuery
        {
            $query->where([
                $this->getAlias() . '.published' => 1
            ]);

            return $query;
        }
    }

We now want to set up a test that will test this table class. Let's now create
a file named **ArticlesTableTest.php** in your **tests/TestCase/Model/Table** directory,
with the following contents::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.Articles'];
    }

In our test cases' variable ``$fixtures`` we define the set of fixtures that
we'll use. You should remember to include all the fixtures that will have
queries run against them.

Creating a Test Method
----------------------

Let's now add a method to test the function ``published()`` in the Articles
table. Edit the file **tests/TestCase/Model/Table/ArticlesTableTest.php** so it
now looks like this::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.Articles'];

        public function setUp(): void
        {
            parent::setUp();
            $this->Articles = $this->getTableLocator()->get('Articles');
        }

        public function testFindPublished(): void
        {
            $query = $this->Articles->find('published')->select(['id', 'title']);
            $this->assertInstanceOf('Cake\ORM\Query\SelectQuery', $query);
            $result = $query->enableHydration(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

You can see we have added a method called ``testFindPublished()``. We start by
creating an instance of our ``ArticlesTable`` class, and then run our
``find('published')`` method. In ``$expected`` we set what we expect should be
the proper result (that we know since we have defined which records are
initially populated to the article table.) We test that the result equals our
expectation by using the ``assertEquals()`` method. See the :ref:`running-tests`
section for more information on how to run your test case.

Using the fixture factories, the test would now look like this::

    namespace App\Test\TestCase\Model\Table;

    use App\Test\Factory\ArticleFactory;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public function testFindPublished(): void
        {
            // Persist 3 published articles
            $articles = ArticleFactory::make(['published' => 1], 3)->persist();
            // Persist 2 unpublished articles
            ArticleFactory::make(['published' => 0], 2)->persist();

            $result = ArticleFactory::find('published')->find('list')->toArray();

            $expected = [
                $articles[0]->id => $articles[0]->title,
                $articles[1]->id => $articles[1]->title,
                $articles[2]->id => $articles[2]->title,
            ];

            $this->assertEquals($expected, $result);
        }
    }

No fixtures need to be loaded. The 5 articles created will exist only in this test. The
static method ``::find()`` will query the database without using the table ``ArticlesTable``
and it's events.

Mocking Model Methods
---------------------

There will be times you'll want to mock methods on models when testing them. You
should use ``getMockForModel`` to create testing mocks of table classes. It
avoids issues with reflected properties that normal mocks have::

    public function testSendingEmails(): void
    {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

In your ``tearDown()`` method be sure to remove the mock with::

    $this->getTableLocator()->clear();

.. _integration-testing:

Controller Integration Testing
==============================

While you can test controller classes in a similar fashion to Helpers, Models,
and Components, CakePHP offers a specialized ``IntegrationTestTrait`` trait.
Using this trait in your controller test cases allows you to
test controllers from a high level.

If you are unfamiliar with integration testing, it is a testing approach that
allows you to test multiple units in concert. The integration testing
features in CakePHP simulate an HTTP request being handled by your application.
For example, testing your controller will also exercise any components, models
and helpers that would be involved in handling a given request. This gives you a
more high level test of your application and all its working parts.

Say you have a typical ArticlesController, and its corresponding model. The
controller code looks like::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function index($short = null)
        {
            if ($this->request->is('post')) {
                $article = $this->Articles->newEntity($this->request->getData());
                if ($this->Articles->save($article)) {
                    // Redirect as per PRG pattern
                    return $this->redirect(['action' => 'index']);
                }
            }
            if (!empty($short)) {
                $result = $this->Articles->find('all', fields: ['id', 'title'])->all();
            } else {
                $result = $this->Articles->find()->all();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

Create a file named **ArticlesControllerTest.php** in your
**tests/TestCase/Controller** directory and put the following inside::

    namespace App\Test\TestCase\Controller;

    use Cake\TestSuite\IntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class ArticlesControllerTest extends TestCase
    {
        use IntegrationTestTrait;

        protected $fixtures = ['app.Articles'];

        public function testIndex(): void
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // More asserts.
        }

        public function testIndexQueryData(): void
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // More asserts.
        }

        public function testIndexShort(): void
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // More asserts.
        }

        public function testIndexPostData(): void
        {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles', $data);

            $this->assertResponseSuccess();
            $articles = $this->getTableLocator()->get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

This example shows a few of the request sending methods and a few of the
assertions that ``IntegrationTestTrait`` provides. Before you can do any
assertions you'll need to dispatch a request. You can use one of the following
methods to send a request:

* ``get()`` Sends a GET request.
* ``post()`` Sends a POST request.
* ``put()`` Sends a PUT request.
* ``delete()`` Sends a DELETE request.
* ``patch()`` Sends a PATCH request.
* ``options()`` Sends an OPTIONS request.
* ``head()`` Sends a HEAD request.

All of the methods except ``get()`` and ``delete()`` accept a second parameter
that allows you to send a request body. After dispatching a request you can use
the various assertions provided by ``IntegrationTestTrait`` or PHPUnit to
ensure your request had the correct side-effects.

Setting up the Request
----------------------

The ``IntegrationTestTrait`` trait comes with a number of helpers to
to configure the requests you will send to your application under test::

    // Set cookies
    $this->cookie('name', 'Uncle Bob');

    // Set session data
    $this->session(['Auth.User.id' => 1]);

    // Configure headers and merge with the existing request
    $this->configRequest([
        'headers' => ['Accept' => 'application/json']
    ]);

    // Replace the existing request. Added in 5.1.0
    $this->replaceRequest([
        'headers' => ['Accept' => 'application/json']
    ]);


The state set by these helper methods is reset in the ``tearDown()`` method.

.. versionadded:: 5.1.0
    ``replaceRequest()`` was added.

Testing Actions Protected by CsrfProtectionMiddleware or FormProtectionComponent
--------------------------------------------------------------------------------

When testing actions protected by either ``CsrfProtectionMiddleware`` or ``FormProtectionComponent`` you
can enable automatic token generation to ensure your tests won't fail due to
token mismatches::

    public function testAdd(): void
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'Exciting news!']);
    }

It is also important to enable debug in tests that use tokens to prevent the
``FormProtectionComponent`` from thinking the debug token is being used in a non-debug
environment. When testing with other methods like ``requireSecure()`` you
can use ``configRequest()`` to set the correct environment variables::

    // Fake out SSL connections.
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

If your action requires unlocked fields you can declare them with
``setUnlockedFields()``::

    $this->setUnlockedFields(['dynamic_field']);

Integration Testing PSR-7 Middleware
------------------------------------

Integration testing can also be used to test your entire PSR-7 application and
:doc:`/controllers/middleware`. By default ``IntegrationTestTrait`` will
auto-detect the presence of an ``App\Application`` class and automatically
enable integration testing of your Application.

You can customize the application class name used, and the constructor
arguments, by using the ``configApplication()`` method::

    public function setUp(): void
    {
        $this->configApplication('App\App', [CONFIG]);
    }

You should also take care to try and use :ref:`application-bootstrap` to load
any plugins containing events/routes. Doing so will ensure that your
events/routes are connected for each test case. Alternatively if you wish to
load plugins manually in a test you can use the ``loadPlugins()`` method.

Testing with Encrypted Cookies
------------------------------

If you use the :ref:`encrypted-cookie-middleware` in your
application, there are helper methods for setting encrypted cookies in your
test cases::

    // Set a cookie using AES and the default key.
    $this->cookieEncrypted('my_cookie', 'Some secret values');

    // Assume this action modifies the cookie.
    $this->get('/articles/index');

    $this->assertCookieEncrypted('An updated value', 'my_cookie');

Testing Flash Messages
----------------------

If you want to assert the presence of flash messages in the session and not the
rendered HTML, you can use ``enableRetainFlashMessages()`` in your tests to
retain flash messages in the session so you can write assertions::

    // Enable retention of flash messages instead of consuming them.
    $this->enableRetainFlashMessages();
    $this->get('/articles/delete/9999');

    $this->assertSession('That article does not exist', 'Flash.flash.0.message');

    // Assert a flash message in the 'flash' key.
    $this->assertFlashMessage('Article deleted', 'flash');

    // Assert the second flash message, also  in the 'flash' key.
    $this->assertFlashMessageAt(1, 'Article really deleted');

    // Assert a flash message in the 'auth' key at the first position
    $this->assertFlashMessageAt(0, 'You are not allowed to enter this dungeon!', 'auth');

    // Assert a flash messages uses the error element
    $this->assertFlashElement('Flash/error');

    // Assert the second flash message element
    $this->assertFlashElementAt(1, 'Flash/error');

Testing a JSON Responding Controller
------------------------------------

JSON is a friendly and common format to use when building a web service.
Testing the endpoints of your web service is very simple with CakePHP. Let us
begin with a simple example controller that responds in JSON::

    use Cake\View\JsonView;

    class MarkersController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set('marker', $marker);
            $this->viewBuilder()->setOption('serialize', ['marker']);
        }
    }

Now we create the file **tests/TestCase/Controller/MarkersControllerTest.php**
and make sure our web service is returning the proper response::

    class MarkersControllerTest extends IntegrationTestCase
    {
        use IntegrationTestTrait;

        public function testGet(): void
        {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $this->get('/markers/view/1.json');

            // Check that the response was a 200
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, (string)$this->_response->getBody());
        }
    }

We use the ``JSON_PRETTY_PRINT`` option as CakePHP's built in JsonView will use
that option when ``debug`` is enabled.

Testing with file uploads
-------------------------

Simulating file uploads is straightforward when you use the default
":ref:`uploaded files as objects <request-file-uploads>`" mode. You can simply
create instances that implement
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__
(the default implementation currently used by CakePHP is
``\Laminas\Diactoros\UploadedFile``), and pass them in your test request data.
In the CLI environment such objects will by default pass validation checks that
test whether the file was uploaded via HTTP. The same is not true for array style
data as found in ``$_FILES``, it would fail that check.

In order to simulate exactly how the uploaded file objects would be present on
a regular request, you not only need to pass them in the request data, but you also
need to pass them to the test request configuration via the ``files`` option. It's
not technically necessary though unless your code accesses uploaded files via the
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` or
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()` methods.

Let's assume articles have a teaser image, and a ``Articles hasMany Attachments``
association, the form would look like something like this accordingly, where one
image file, and multiple attachments/files would be accepted::

    <?= $this->Form->create($article, ['type' => 'file']) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('teaser_image', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.description']) ?>
    <?= $this->Form->control('attachments.1.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.1.description']) ?>
    <?= $this->Form->button('Submit') ?>
    <?= $this->Form->end() ?>

The test that would simulate the corresponding request could look like this::

    public function testAddWithUploads(): void
    {
        $teaserImage = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.jpg', // stream or path to file representing the temp file
            12345,                    // the filesize in bytes
            \UPLOAD_ERR_OK,           // the upload/error status
            'teaser.jpg',             // the filename as sent by the client
            'image/jpeg'              // the mimetype as sent by the client
        );

        $textAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.txt',
            'text/plain'
        );

        $pdfAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.pdf',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.pdf',
            'application/pdf'
        );

        // This is the data accessible via `$this->request->getUploadedFile()`
        // and `$this->request->getUploadedFiles()`.
        $this->configRequest([
            'files' => [
                'teaser_image' => $teaserImage,
                'attachments' => [
                    0 => [
                        'attachment' => $textAttachment,
                    ],
                    1 => [
                        'attachment' => $pdfAttachment,
                    ],
                ],
            ],
        ]);

        // This is the data accessible via `$this->request->getData()`.
        $postData = [
            'title' => 'New Article',
            'teaser_image' => $teaserImage,
            'attachments' => [
                0 => [
                    'attachment' => $textAttachment,
                    'description' => 'Text attachment',
                ],
                1 => [
                    'attachment' => $pdfAttachment,
                    'description' => 'PDF attachment',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('The article was saved successfully');
        $this->assertFileExists('/path/to/uploads/teaser.jpg');
        $this->assertFileExists('/path/to/uploads/attachment.txt');
        $this->assertFileExists('/path/to/uploads/attachment.pdf');
    }

.. tip::

    If you configure the test request with files, then it *must* match the
    structure of your POST data (but only include the uploaded file objects)!

Likewise you can simulate `upload errors <https://www.php.net/manual/en/features.file-upload.errors.php>`_
or otherwise invalid files that do not pass validation::

    public function testAddWithInvalidUploads(): void
    {
        $missingTeaserImageUpload = new \Laminas\Diactoros\UploadedFile(
            '',
            0,
            \UPLOAD_ERR_NO_FILE,
            '',
            ''
        );

        $uploadFailureAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            1234567890,
            \UPLOAD_ERR_INI_SIZE,
            'attachment.txt',
            'text/plain'
        );

        $invalidTypeAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.exe',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.exe',
            'application/vnd.microsoft.portable-executable'
        );

        $this->configRequest([
            'files' => [
                'teaser_image' => $missingTeaserImageUpload,
                'attachments' => [
                    0 => [
                        'file' => $uploadFailureAttachment,
                    ],
                    1 => [
                        'file' => $invalidTypeAttachment,
                    ],
                ],
            ],
        ]);

        $postData = [
            'title' => 'New Article',
            'teaser_image' => $missingTeaserImageUpload,
            'attachments' => [
                0 => [
                    'file' => $uploadFailureAttachment,
                    'description' => 'Upload failure attachment',
                ],
                1 => [
                    'file' => $invalidTypeAttachment,
                    'description' => 'Invalid type attachment',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('The article could not be saved');
        $this->assertResponseContains('A teaser image is required');
        $this->assertResponseContains('Max allowed filesize exceeded');
        $this->assertResponseContains('Unsupported file type');
        $this->assertFileNotExists('/path/to/uploads/teaser.jpg');
        $this->assertFileNotExists('/path/to/uploads/attachment.txt');
        $this->assertFileNotExists('/path/to/uploads/attachment.exe');
    }

Disabling Error Handling Middleware in Tests
--------------------------------------------

When debugging tests that are failing because your application is encountering
errors it can be helpful to temporarily disable the error handling middleware to
allow the underlying error to bubble up. You can use
``disableErrorHandlerMiddleware()`` to do this::

    public function testGetMissing(): void
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

In the above example, the test would fail and the underlying exception message
and stack trace would be displayed instead of the rendered error page being
checked.

Assertion methods
-----------------

The ``IntegrationTestTrait`` trait provides a number of assertion methods that
make testing responses much simpler. Some examples are::

    // Check for a 2xx response code
    $this->assertResponseOk();

    // Check for a 2xx/3xx response code
    $this->assertResponseSuccess();

    // Check for a 4xx response code
    $this->assertResponseError();

    // Check for a 5xx response code
    $this->assertResponseFailure();

    // Check for a specific response code, for example, 200
    $this->assertResponseCode(200);

    // Check the Location header
    $this->assertRedirect(['controller' => 'Articles', 'action' => 'index']);

    // Check that no Location header has been set
    $this->assertNoRedirect();

    // Check a part of the Location header
    $this->assertRedirectContains('/articles/edit/');

    // Assert location header does not contain
    $this->assertRedirectNotContains('/articles/edit/');

    // Assert not empty response content
    $this->assertResponseNotEmpty();

    // Assert empty response content
    $this->assertResponseEmpty();

    // Assert response content
    $this->assertResponseEquals('Yeah!');

    // Assert response content doesn't equal
    $this->assertResponseNotEquals('No!');

    // Assert partial response content
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');

    // Assert file sent back
    $this->assertFileResponse('/absolute/path/to/file.ext');

    // Assert layout
    $this->assertLayout('default');

    // Assert which template was rendered (if any)
    $this->assertTemplate('index');

    // Assert data in the session
    $this->assertSession(1, 'Auth.User.id');

    // Assert response header.
    $this->assertHeader('Content-Type', 'application/json');
    $this->assertHeaderContains('Content-Type', 'html');

    // Assert content-type header doesn't contain xml
    $this->assertHeaderNotContains('Content-Type', 'xml');

    // Assert view variables
    $user =  $this->viewVariable('user');
    $this->assertEquals('jose', $user->username);

    // Assert cookie values in the response
    $this->assertCookie('1', 'thingid');

    // Assert a cookie is or is not present
    $this->assertCookieIsSet('remember_me');
    $this->assertCookieNotSet('remember_me');

    // Check the content type
    $this->assertContentType('application/json');

In addition to the above assertion methods, you can also use all of the
assertions in `TestSuite
<https://api.cakephp.org/5.x/class-Cake.TestSuite.TestCase.html>`_ and those
found in `PHPUnit
<https://phpunit.de/manual/current/en/appendixes.assertions.html>`__.

Comparing test results to a file
--------------------------------

For some types of test, it may be easier to compare the result of a test to the
contents of a file - for example, when testing the rendered output of a view.
The ``StringCompareTrait`` adds a simple assert method for this purpose.

Usage involves using the trait, setting the comparison base path and calling
``assertSameAsFile``::

    use Cake\TestSuite\StringCompareTrait;
    use Cake\TestSuite\TestCase;

    class SomeTest extends TestCase
    {
        use StringCompareTrait;

        public function setUp(): void
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample(): void
        {
            $result = ...;
            $this->assertSameAsFile('example.php', $result);
        }
    }

The above example will compare ``$result`` to the contents of the file
``APP/tests/comparisons/example.php``.

A mechanism is provided to write/update test files, by setting the environment
variable ``UPDATE_TEST_COMPARISON_FILES``, which will create and/or update test
comparison files as they are referenced:

.. code-block:: console

    phpunit
    ...
    FAILURES!
    Tests: 6, Assertions: 7, Failures: 1

    UPDATE_TEST_COMPARISON_FILES=1 phpunit
    ...
    OK (6 tests, 7 assertions)

    git status
    ...
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   tests/comparisons/example.php


Console Integration Testing
===========================

See :ref:`console-integration-testing` for how to test console commands.

Mocking Injected Dependencies
=============================

See :ref:`mocking-services-in-tests` for how to replace services injected with
the dependency injection container in your integration tests.

Mocking HTTP Client Responses
=============================

See :ref:`httpclient-testing` to know how to create mock responses to external APIs.

Testing Views
=============

Generally most applications will not directly test their HTML code. Doing so is
often results in fragile, difficult to maintain test suites that are prone to
breaking. When writing functional tests using :php:class:`IntegrationTestTrait`
you can inspect the rendered view content by setting the ``return`` option to
'view'. While it is possible to test view content using ``IntegrationTestTrait``,
a more robust and maintainable integration/view testing can be accomplished
using tools like `Selenium webdriver <https://www.selenium.dev/>`_.

Testing Components
==================

Let's pretend we have a component called PagematronComponent in our application.
This component helps us set the pagination limit value across all the
controllers that use it. Here is our example component located in
**src/Controller/Component/PagematronComponent.php**::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // Make sure the controller is using pagination
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(EventInterface $event)
        {
            $this->setController($event->getSubject());
        }

        public function adjust($length = 'short'): void
        {
            switch ($length) {
                case 'long':
                    $this->controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->controller->paginate['limit'] = 50;
                break;
                default:
                    $this->controller->paginate['limit'] = 20;
                break;
            }
        }
    }

Now we can write tests to ensure our paginate ``limit`` parameter is being set
correctly by the ``adjust()`` method in our component. We create the file
**tests/TestCase/Controller/Component/PagematronComponentTest.php**::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentRegistry;
    use Cake\Event\Event;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {
        protected $component;
        protected $controller;

        public function setUp(): void
        {
            parent::setUp();
            // Setup our component and provide it a basic controller.
            // If your component relies on Application features, use AppController.
            $request = new ServerRequest();
            $response = new Response();
            $this->controller = new Controller($request);
            $registry = new ComponentRegistry($this->controller);

            $this->component = new PagematronComponent($registry);
            $event = new Event('Controller.startup', $this->controller);
            $this->component->startup($event);
        }

        public function testAdjust(): void
        {
            // Test our adjust method with different parameter settings
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown(): void
        {
            parent::tearDown();
            // Clean up after we're done
            unset($this->component, $this->controller);
        }
    }

Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's
important to make sure those classes are covered by test cases.

First we create an example helper to test. The ``CurrencyRendererHelper`` will
help us display currencies in our views and for simplicity only has one method
``usd()``::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function usd($amount): string
        {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot, thousands
separator to comma, and prefix the formatted number with 'USD' string.

Now we create our tests::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase
    {
        public $helper = null;

        // Here we instantiate our helper
        public function setUp(): void
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // Testing the usd() function
        public function testUsd(): void
        {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // We should always have 2 decimal digits
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // Testing the thousands separator
            $this->assertEquals(
              'USD 12,000.70',
              $this->helper->usd(12000.70)
            );
        }
    }

Here, we call ``usd()`` with different parameters and tell the test suite to
check if the returned values are equal to what is expected.

Save this and execute the test. You should see a green bar and messaging
indicating 1 pass and 4 assertions.

When you are testing a Helper which uses other helpers, be sure to mock the
View clases ``loadHelpers`` method.

.. _testing-events:

Testing Events
==============

The :doc:`/core-libraries/events` is a great way to decouple your application
code, but sometimes when testing, you tend to test the results of events in the
test cases that execute those events. This is an additional form of coupling
that can be removed by using ``assertEventFired`` and ``assertEventFiredWith``
instead.

Expanding on the Orders example, say we have the following tables::

    class OrdersTable extends Table
    {
        public function place($order): bool
        {
            if ($this->save($order)) {
                // moved cart removal to CartsTable
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->getEventManager()->dispatch($event);

                return true;
            }

            return false;
        }
    }

    class CartsTable extends Table
    {
        public function initialize()
        {
            // Models don't share the same event manager instance,
            // so we need to use the global instance to listen to
            // events from other models
            \Cake\Event\EventManager::instance()->on(
                'Model.Order.afterPlace',
                callable: [$this, 'removeFromCart']
            );
        }

        public function removeFromCart(EventInterface $event): void
        {
            $order = $event->getData('order');
            $this->delete($order->cart_id);
        }
    }

.. note::
    To assert that events are fired, you must first enable
    :ref:`tracking-events` on the event manager you wish to assert against.

To test the ``OrdersTable`` above, we enable tracking in ``setUp()`` then assert
that the event was fired, and assert that the ``$order`` entity was passed in
the event data::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {
        protected $fixtures = ['app.Orders'];

        public function setUp(): void
        {
            parent::setUp();
            $this->Orders = $this->getTableLocator()->get('Orders');
            // enable event tracking
            $this->Orders->getEventManager()->setEventList(new EventList());
        }

        public function testPlace(): void
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->getEventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->getEventManager());
        }
    }

By default, the global ``EventManager`` is used for assertions, so testing
global events does not require passing the event manager::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

Testing Email
=============

See :ref:`email-testing` for information on testing email.

Testing Logging
===============

See :ref:`log-testing` for information on testing log messages.

Creating Test Suites
====================

If you want several of your tests to run at the same time, you can create a test
suite. A test suite is composed of several test cases.  You can either create
test suites in your application's **phpunit.xml** file. A simple example
would be:

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

Creating Tests for Plugins
==========================

Tests for plugins are created in their own directory inside the plugins
folder. ::

    /src
    /plugins
        /Blog
            /tests
                /TestCase
                /Fixture

They work just like normal tests but you have to remember to use the naming
conventions for plugins when importing classes. This is an example of a testcase
for the ``BlogPost`` model from the plugins chapter of this manual. A difference
from other tests is in the first line where 'Blog.BlogPost' is imported. You
also need to prefix your plugin fixtures with ``plugin.Blog.BlogPosts``::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {
        // Plugin fixtures located in /plugins/Blog/tests/Fixture/
        protected $fixtures = ['plugin.Blog.BlogPosts'];

        public function testSomething(): void
        {
            // Test something.
        }
    }

If you want to use plugin fixtures in the app tests you can
reference them using ``plugin.pluginName.fixtureName`` syntax in the
``$fixtures`` array. Additionally if you use vendor plugin name or fixture
directories you can use the following: ``plugin.vendorName/pluginName.folderName/fixtureName``.

Before you can use fixtures you should ensure you have the :ref:`fixture
listener <fixture-phpunit-configuration>` configured in your ``phpunit.xml``
file. You should also ensure that your fixtures are loadable. Ensure the
following is present in your **composer.json** file::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
        }
    }

.. note::

    Remember to run ``composer.phar dumpautoload`` when adding new autoload
    mappings.

Generating Tests with Bake
==========================

If you use :doc:`bake </bake/usage>` to
generate scaffolding, it will also generate test stubs. If you need to
re-generate test case skeletons, or if you want to generate test skeletons for
code you wrote, you can use ``bake``:

.. code-block:: console

    bin/cake bake test <type> <name>

``<type>`` should be one of:

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Task
#. ShellHelper
#. Cell
#. Form
#. Mailer
#. Command

While ``<name>`` should be the name of the object you want to bake a test
skeleton for.

.. meta::
    :title lang=en: Testing
    :keywords lang=en: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
