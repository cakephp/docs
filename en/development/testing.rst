Testing
#######

CakePHP comes with comprehensive testing support built-in. CakePHP comes with
integration for `PHPUnit <http://phpunit.de>`_. In addition to the features
offered by PHPUnit, CakePHP offers some additional features to make testing
easier. This section will cover installing PHPUnit, and getting started with
Unit Testing, and how you can use the extensions that CakePHP offers.

Installing PHPUnit
==================

CakePHP uses PHPUnit as its underlying test framework. PHPUnit is the de-facto
standard for unit testing in PHP.  It offers a deep and powerful set of features
for making sure your code does what you think it does. PHPUnit can be installed
through using either a `PHAR package <http://phpunit.de/#download>`_ or `Composer
<http://getcomposer.org>`_.

Install PHPUnit with Composer
-----------------------------

To install PHPUnit with Composer, add the following to you application's
``require`` section in its ``composer.json``::

    "phpunit/phpunit": "*",

After updating your package.json, run Composer again inside your application
directory::

    $ php composer.phar install

You can now run PHPUnit using::

    $ bin/phpunit

Using the PHAR File
-------------------

After you have downloaded the ``phpunit.phar`` file, you can use it to run your
tests::

    php phpunit.phar


Test Database Setup
===================

Remember to have a debug level of at least 1 in your ``config/app.php``
file before running any tests.  Tests are not accessible via the web runner when
debug is equal to 0.  Before running any tests you should be sure to add a
``test`` datasource configuration to ``config/app.php``.  This
configuration is used by CakePHP for fixture tables and data::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database'
        ],
    ],

.. note::

    It's a good idea to make the test database and your actual database
    different databases. This will prevent embarrassing mistakes later.

Checking the Test Setup
=======================

After installing PHPUnit and setting up your ``test`` datasource configuration
you can make sure you're ready to write and run your own tests by running your
application's tests::

    // For system wide PHPUnit
    $ phpunit

    // For phpunit.phar
    $ php phpunit.phar

    // For Composer installed phpunit
    $ bin/phpunit

The above should run any tests you have, or let you know that no tests were run.
To run a specific test you can supply the path to the test as a parameter to
PHPUnit. For example, if you had a test case for ArticlesTable class you could
run it with::

    $ phpunit tests/TestCase/Model/Table/ArticlesTableTest

You should see a green bar with some additional information about the tests run,
and number passed.

.. note::

    If you are on a windows system you probably won't see any colours.

Test Case Conventions
=====================

Like most things in CakePHP, test cases have some conventions. Concerning
tests:

#. PHP files containing tests should be in your
   ``tests/TestCase/[Type]`` directories.
#. The filenames of these files should end in ``Test.php`` instead
   of just .php.
#. The classes containing tests should extend ``Cake\TestSuite\TestCase``,
   ``Cake\TestSuite\IntegrationTestCase`` or ``\PHPUnit_Framework_TestCase``.
#. Like other classnames, the test case classnames should match the filename.
   ``RouterTest.php`` should contain ``class RouterTest extends TestCase``.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with ``test``, as in ``testPublished()``.
   You can also use the ``@test`` annotation to mark methods as test methods.

Creating Your First Test Case
=============================

In the following example, we'll create a test case for a very simple helper
method. The helper we're going to test will be formatting progress bar HTML.
Our helper looks like::

    namespace App\View\Helper;

    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

This is a very simple example, but it will be useful to show how you can create
a simple test case. After creating and saving our helper, we'll create the test
case file in ``tests/TestCase/View/Helper/ProgressHelperTest.php``. In that file
we'll start with the following::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase {
        public function setUp() {

        }

        public function testBar() {

        }
    }

We'll flesh out this skeleton in a minute. We've added two methods to start
with. First is ``setUp()``. This method is called before every *test* method
in a test case class. Setup methods should initialize the objects needed for the
test, and do any configuration needed. In our setup method we'll add the
following::

    public function setUp() {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

Calling the parent method is important in test cases, as TestCase::setUp()
does a number things like backing up the values in :php:class:`~Cake\\Core\\Configure` and,
storing the paths in :php:class:`~Cake\\Core\\App`.

Next, we'll fill out the test method. We'll use some assertions to ensure that
our code creates the output we expect::

    public function testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

The above test is a simple one but shows the potential benefit of using test
cases. We use ``assertContains()`` to ensure that our helper is returning a
string that contains the content we expect. If the result did not contain the
expected content the test would fail, and we would know that our code is
incorrect.

By using test cases you can easily describe the relationship between a set of
known inputs and their expected output. This helps you be more confident of the
code you're writing as you can easily check that the code you wrote fulfills the
expectations and assertions your tests make. Additionally because tests are
code, they are easy to re-run whenever you make a change. This helps prevent
the creation of new bugs.

.. _running-tests:

Running Tests
=============

Once you have PHPUnit installed and some test cases written, you'll want to run
the test cases very frequently. It's a good idea to run tests before committing
any changes to help ensure you haven't broken anything.

By using ``phpunit`` you can run your application and plugin tests. To run your
application's tests you can simply run::

    $ phpunit

From your application's root directory. To run a plugin's tests, first ``cd``
into the plugin directory, then use ``phpunit`` to run the tests.

Filtering Test Cases
--------------------

When you have larger test cases, you will often want to run a subset of the test
methods when you are trying to work on a single failing case. With the
CLI runner you can use an option to filter test methods::

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

The filter parameter is used as a case-sensitive regular expression for filtering
which test methods to run.

Generating Code Coverage
------------------------

You can generate code coverage reports from the command line using PHPUnit's
built-in code coverage tools. PHPUnit will generate a set of static HTML files
containing the coverage results. You can generate coverage for a test case by
doing the following::

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

This will put the coverage results in your application's webroot directory. You
should be able to view the results by going to
``http://localhost/your_app/coverage``.

Combining Test Suites for Plugins
---------------------------------

Often times your application will be composed of several plugins. In these
situations it can be pretty tedious to run tests for each plugin. You can make
running tests for each of the plugins that compose your application by adding
additional ``<testsuite>`` sections to your application's ``phpunit.xml`` file::

    <testsuites>
        <testsuite name="App Test Suite">
            <directory>./tests/TestCase</directory>
        </testsuite>

        <!-- Add your plugin suites -->
        <testsuite name="Forum plugin">
            <directory>./plugins/Forum/tests/TestCase</directory>
        </testsuite>
    </testsuites>

Any additional test suites added to the ``<testsuites>`` element will
automatically be run when you use ``phpunit``.

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
**fixtures** as a way to generate temporary data tables loaded with sample data
that can be used by the test. The benefit of using fixtures is that your test
has no chance of disrupting live application data. In addition, you can begin
testing your code prior to actually developing live content for an application.

CakePHP uses the connection named ``test`` in your ``config/datasources.php``
configuration file. If this connection is not usable, an exception will be
raised and you will not be able to use database fixtures.

CakePHP performs the following during the course of a fixture based
test case:

#. Creates tables for each of the fixtures needed.
#. Populates tables with data, if data is provided in fixture.
#. Runs test methods.
#. Empties the fixture tables.
#. Removes fixture tables from database.

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

Creating Fixtures
-----------------

When creating a fixture you will mainly define two things: how the table is
created (which fields are part of the table), and which records will be
initially populated to the table. Let's create our first fixture, that will be
used to test our own Article model. Create a file named ``ArticlesFixture.php``
in your ``tests/Fixture`` directory, with the following content::

    namespace App\Test\Fixture;

    use Cake\Test\TestFixture;

    class ArticlesFixture extends TestFixture {

          // Optional. Set this property to load fixtures to a different test datasource
          public $connection = 'test';

          public $fields = [
              'id' => ['type' => 'integer'],
              'title' => ['type' => 'string', 'length' => 255, 'null' => false],
              'body' => 'text',
              'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
              'created' => 'datetime',
              'updated' => 'datetime',
              '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']]
              ]
          ];
          public $records = [
              [
                  'id' => 1,
                  'title' => 'First Article',
                  'body' => 'First Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:39:23',
                  'updated' => '2007-03-18 10:41:31'
              ],
              [
                  'id' => 2,
                  'title' => 'Second Article',
                  'body' => 'Second Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:41:23',
                  'updated' => '2007-03-18 10:43:31'
              ],
              [
                  'id' => 3,
                  'title' => 'Third Article',
                  'body' => 'Third Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:43:23',
                  'updated' => '2007-03-18 10:45:31'
              ]
          ];
     }

The ``$connection`` property defines the datasource of which the fixture will
use.  If your application uses multiple datasources, you should make the
fixtures match the model's datasources but prefixed with ``test_``.
For example if your model uses the ``mydb`` datasource, your fixture should use
the ``test_mydb`` datasource. If the ``test_mydb`` connection doesn't exist,
your models will use the default ``test`` datasource. Fixture datasources must
be prefixed with ``test`` to reduce the possibility of accidentally truncating
all your application's data when running tests.

We use ``$fields`` to specify which fields will be part of this table,
and how they are defined. The format used to define these fields is
the same used with :php:class:`Cake\\Database\\Schema\\Table`. The keys available for table
definition are:

type
    CakePHP internal data type. Currently supported:

    - ``string``: maps to ``VARCHAR`` or ``CHAR``
    - ``uuid``: maps to ``UUID``
    - ``text``: maps to ``TEXT``
    - ``integer``: maps to ``INT``
    - ``biginteger``: maps to ``BIGINTEGER``
    - ``decimal``: maps to ``DECIMAL``
    - ``float``: maps to ``FLOAT``
    - ``datetime``: maps to ``DATETIME``
    - ``timestamp``: maps to ``TIMESTAMP``
    - ``time``: maps to ``TIME``
    - ``date``: maps to ``DATE``
    - ``binary``: maps to ``BLOB``
fixed
    Used with string types to create CHAR columns in platforms that support
    them.
length
    Set to the specific length the field should take.
precision
    Set the number of decimal places used on float & decimal fields.
null
    Set to either ``true`` (to allow NULLs) or ``false`` (to disallow NULLs).
default
    Default value the field takes.

We can define a set of records that will be populated after the fixture table is
created. The format is fairly straight forward, ``$records`` is an array of
records. Each item in ``$records`` should be a single row. Inside each row,
should be an associative array of the columns and values for the row. Just keep
in mind that each record in the $records array must have a key for **every**
field specified in the ``$fields`` array. If a field for a particular record needs
to have a ``null`` value, just specify the value of that key as ``null``.

Dynamic Data and Fixtures
-------------------------

Since records for a fixture are declared as a class property, you cannot easily
use functions or other dynamic data to define fixtures. To solve this problem,
you can define ``$records`` in the init() function of your fixture. For example
if you wanted all the created and updated timestamps to reflect today's date you
could do the following::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture {

        public $fields = [
            'id' => ['type' => 'integer'],
            'title' => ['type' => 'string', 'length' => 255, 'null' => false],
            'body' => 'text',
            'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
            'created' => 'datetime',
            'updated' => 'datetime',
            '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']],
            ]
        ];

        public function init() {
            $this->records = [
                [
                    'id' => 1,
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'updated' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

When overriding ``init()`` remember to always call ``parent::init()``.

Importing Table Information
---------------------------

Defining the schema in fixture files can be really handy when creating plugins
or libraries or if you are creating an application that needs to easily be
portable. Redefining the schema in fixtures can become difficult to maintain in
larger applications. Because of this CakePHP provides the ability to import the
schema from an existing connection and use the reflected table definition to
create the table definition used in the test suite.

Let's start with an example. Assuming you have a table named articles available
in your application, change the example fixture given in the previous section
(``tests/Fixture/ArticlesFixture.php``) to::


    class ArticlesFixture extends TestFixture {
        public $import = ['table' => 'articles']
    }

If you want to use a different connection use::

    class ArticlesFixture extends TestFixture {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }


You can naturally import your table definition from an existing
model/table, but have your records defined directly on the fixture
as it was shown on previous section. For example::

    class ArticlesFixture extends TestFixture {
        public $import = ['table' => 'articles'];
        public $records = [
            [
              'id' => 1,
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'updated' => '2007-03-18 10:41:31'
            ],
            [
              'id' => 2,
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'updated' => '2007-03-18 10:43:31'
            ],
            [
              'id' => 3,
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'updated' => '2007-03-18 10:45:31'
            ]
        ];
    }

Finally, you can not load/create any schema in a fixture. This is useful if you
already have a test database setup with all the empty tables created. By
defining neither ``$fields`` or ``$import`` a fixture will only insert its
records and truncate the records on each test method.

Loading Fixtures in your Test Cases
-----------------------------------

After you've created your fixtures, you'll want to use them in your test cases.
In each test case you should load the fixtures you will need. You should load a
fixture for every model that will have a query run against it. To load fixtures
you define the ``$fixtures`` property in your model::

    class ArticlesTest extends TestCase {
        public $fixtures = ['app.articles', 'app.comments'];
    }

The above will load the Article and Comment fixtures from the application's
Fixture directory. You can also load fixtures from CakePHP core, or plugins::

    class ArticlesTest extends TestCase {
        public $fixtures = ['plugin.debug_kit.articles', 'core.comments'];
    }

Using the ``core`` prefix will load fixtures from CakePHP, and using a plugin
name as the prefix, will load the fixture from the named plugin.

You can control when your fixtures are loaded by setting
:php:attr:`Cake\\TestSuite\\TestCase::$autoFixtures` to ``false`` and later load them using
:php:meth:`Cake\\TestSuite\\TestCase::loadFixtures()`::

    class ArticlesTest extends TestCase {
        public $fixtures = ['app.articles', 'app.comments'];
        public $autoFixtures = false;

        public function testMyFunction() {
            $this->loadFixtures('Article', 'Comment');
        }
    }

You can load fixtures in subdirectories. Using multiple directories
can make it easier to organize your fixtures if you have a larger application.
To load fixtures in subdirectories, simply include the subdirectory name in the
fixture name::

    class ArticlesTest extends CakeTestCase {
        public $fixtures = ['app.blog/articles', 'app.blog/comments'];
    }

In the above example, both fixtures would be loaded from
``tests/Fixture/blog/``.

Testing Tables
==============

Let's say we already have our Articles Table class defined in
``src/Model/Table/ArticlesTable.php``, and it looks like::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table {

        public function findPublished(Query $query, array $options) {
            $query->where([
                $this->alias() . '.published' => 1
            ]);
            return $query;
        }
    }

We now want to set up a test that will test this table class. Let's now create
a file named ``ArticlesTableTest.php`` in your ``tests/TestCase/Model/Table`` directory,
with the following contents::

    namespace App\Test\TestCase\Model\Table;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticleTest extends TestCase {
        public $fixtures = ['app.articles'];
    }

In our test cases' variable ``$fixtures`` we define the set of fixtures that
we'll use. You should remember to include all the fixtures that will have
queries run against them.

Creating a Test Method
----------------------

Let's now add a method to test the function published() in the Article model.
Edit the file ``tests/TestCase/Model/Table/ArticlesTableTest.php`` so it now
looks like this::

    namespace App\Test\TestCase\Model\Table;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticleTest extends TestCase {
        public $fixtures = ['app.articles'];

        public function setUp() {
            parent::setUp();
            $this->Articles = TableRegistry::get('Articles');
        }

        public function testFindPublished() {
            $query = $this->Articles->find('published');
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->hydrate(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

You can see we have added a method called ``testPublished()``. We start by
creating an instance of our ``ArticlesTable`` class, and then run our
``find('published')`` method. In ``$expected`` we set what we expect should be
the proper result (that we know since we have defined which records are
initially populated to the article table.) We test that the result equals our
expectation by using the ``assertEquals`` method. See the :ref:`running-tests`
section for more information on how to run your test case.


Mocking Model Methods
---------------------

There will be times you'll want to mock methods on models when testing them. You should
use ``getMockForModel`` to create testing mocks of table classes. It avoids issues
with reflected properties that normal mocks have::

    public function testSendingEmails() {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

.. _integration-testing:

Controller Integration Testing
===============================

While you can test controller classes in a similar fashion to Helpers, Models,
and Components, CakePHP offers a specialized ``IntegrationTestCase`` class.
Using this class as the base class for your controller test cases allows you to
more easily do integration testing with your controllers.

If you are unfamiliar with integration testing, it is a testing approach that
makes it easy to test multiple units in concert. The integration testing
features in CakePHP simulate an HTTP request being handled by your application.
For example, testing your controller will also exercise any components, models
and helpers that would be involved in handling a given request. This gives you a
more high level test of your application and all its working parts.

Say you have a typical Articles controller, and its corresponding
model. The controller code looks like::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController {
        public $helpers = ['Form', 'Html'];

        public function index($short = null) {
            if (!empty($this->request->data)) {
                $article = $this->Articles->newEntity($this->request->data);
                $this->Articles->save($article);
            }
            if (!empty($short)) {
                $result = $this->Article->find('all', [
                    'fields' => ['id', 'title']
                ]);
            } else {
                $result = $this->Article->find();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

Create a file named ``ArticlesControllerTest.php`` in your
``tests/TestCase/Controller`` directory and put the following inside::

    namespace App\Test\TestCase\Controller;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\IntegrationTestCase;

    class ArticlesControllerTest extends IntegrationTestCase {
        public $fixtures = ['app.articles'];

        public function testIndex() {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // More asserts.
        }

        public function testIndexQueryData() {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // More asserts.
        }

        public function testIndexShort() {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // More asserts.
        }

        public function testIndexPostData() {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles/add', $data);

            $this->assertResponseOk();
            $articles = TableRegistry::get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

This example shows a few of the request sending methods and a few of the
assertions that ``IntegrationTestCase`` provides. Before you can do any
assertions you'll need to dispatch a request. You can use one of the following
methods to send a request:

* ``get()`` Sends a GET request.
* ``post()`` Sends a POST request.
* ``put()`` Sends a PUT request.
* ``delete()`` Sends a DELETE request.
* ``patch()`` Sends a PATCH request.

All of the methods except ``get()`` and ``delete()`` accept a second parameter
that allows you to send a request body. After dispatching a request you can use
the various assertions provided by ``IntegrationTestCase`` or by PHPUnit to
ensure your request had the correct side-effects.

Assertion methods
-----------------

The ``IntegrationTestCase`` class provides a number of assertion methods that
make testing responses much simpler. Some examples are::

    // Check for a 2xx response code
    $this->assertResponseOk();

    // Check for a 4xx response code
    $this->assertResponseError();

    // Check for a 5xx response code
    $this->assertResponseFailure();

    // Check the Location header
    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);

    // Assert content in the response
    $this->assertResponseContains('You won!');

    // Assert layout
    $this->assertLayout('default');

    // Assert which template was rendered (if any)
    $this->assertTemplate('index');

    // Assert data in the session
    $this->assertSession(1, 'Auth.User.id');

    // Assert response header.
    $this->assertHeader('Content-Type', 'application/json');

    // Assert view variables
    $this->assertEquals('jose', $this->viewVariable('user.username'));

    // Assert cookies in the response
    $this->assertEquals('1', $this->cookies());


Testing a JSON Responding Controller
------------------------------------

JSON is a friendly and common format to use when building a web service.
Testing the endpoints of your web service is very simple with CakePHP. Let us
begin with a simple example controller that responds in JSON::

    class MarkersController extends AppController {
        public $components = ['RequestHandler'];

        public function view($id) {
            $marker = $this->Markers->get($id);
            $this->set([
                '_serialize' => ['marker'],
                'marker' => $marker,
            ]);
        }
    }

Now we create the file ``tests/TestCase/Controller/MarkersControllerTest.php``
and make sure our web service is returning the proper response::

    class MarkersControllerTest extends IntegrationTestCase {

        public function testGet() {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // Check that the response was a 200
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, $this->_response->body());
        }
    }

We use the ``JSON_PRETTY_PRINT`` option as CakePHP's built in JsonView will use
that option when ``debug`` is enabled.

Testing Views
=============

Generally most applications will not directly test their HTML code. Doing so is
often results in fragile, difficult to maintain test suites that are prone to
breaking. When writing functional tests using :php:class:`IntegrationTestCase`
you can inspect the rendered view content by setting the ``return`` option to
'view'. While it is possible to test view content using IntegrationTestCase,
a more robust and maintable integration/view testing can be accomplished using
tools like `Selenium webdriver <http://seleniumhq.org>`_.


Testing Components
==================

Let's pretend we have a component called PagematronComponent in our application.
This component helps us set the pagination limit value across all the
controllers that use it. Here is our example component located in
``app/Controller/Component/PagematronComponent.php``::

    class PagematronComponent extends Component {
        public $controller = null;

        public function setController($controller) {
            $this->controller = $controller;
            // Make sure the controller is using pagination
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(Event $event) {
            $this->setController($event->subject());
        }

        public function adjust($length = 'short') {
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

Now we can write tests to ensure our paginate ``limit`` parameter is being
set correctly by the ``adjust`` method in our component. We create the file
``tests/TestCase/Controller/Component/PagematronComponentTest.php``::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentCollection;
    use Cake\Network\Request;
    use Cake\Network\Response;

    class PagematronComponentTest extends TestCase {

        public $component = null;
        public $controller = null;

        public function setUp() {
            parent::setUp();
            // Setup our component and fake test controller
            $collection = new ComponentCollection();
            $this->component = new PagematronComponent($collection);

            $request = new Request();
            $response = new Response();
            $this->controller = $this->getMock(
                'Cake\Controller\Controller',
                [],
                [$request, $response]
            );
            $this->component->setController($this->controller);
        }

        public function testAdjust() {
            // Test our adjust method with different parameter settings
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown() {
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

    class CurrencyRendererHelper extends Helper {
        public function usd($amount) {
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

    class CurrencyRendererHelperTest extends TestCase {

        public $helper = null;

        // Here we instantiate our helper
        public function setUp() {
            parent::setUp();
            $view = new View();
            $this->helper = new CurrencyRendererHelper($view);
        }

        // Testing the usd() function
        public function testUsd() {
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

Creating Test Suites
====================

If you want several of your tests to run at the same time, you can create a test
suite. A test suite is composed of several test cases.  You can either create
test suites in your application's ``phpunit.xml`` file, or by creating suite
classes using ``CakeTestSuite``. Using ``phpunit.xml`` is good when you only
need simple include/exclude rules to define your test suite. A simple example
would be

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

``CakeTestSuite`` offers several methods for easily creating test suites based
on the file system. It allows you to run any code you want to prepare your test
suite. If we wanted to create a test suite for all our model tests we could
would create ``tests/TestCase/AllModelTest.php``. Put the following in it::

    class AllModelTest extends TestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All model tests');
            $suite->addTestDirectory(TESTS . 'Case/Model');
            return $suite;
        }
    }

The code above will group all test cases found in the
``tests/TestCase/Model/`` folder. To add an individual file, use
``$suite->addTestFile($filename);``. You can recursively add a directory
for all tests using::

    $suite->addTestDirectoryRecursive(TESTS . 'TestCase');

Would recursively add all test cases in the ``tests/TestCase/``
directory.

Creating Tests for Plugins
==========================

Tests for plugins are created in their own directory inside the
plugins folder.::

    /app
        /Plugin
            /Blog
                /Test
                    /TestCase
                    /Fixture

They work just like normal tests but you have to remember to use
the naming conventions for plugins when importing classes. This is
an example of a testcase for the ``BlogPost`` model from the plugins
chapter of this manual. A difference from other tests is in the
first line where 'Blog.BlogPost' is imported. You also need to
prefix your plugin fixtures with ``plugin.blog.blog_posts``::

    namespace Blog\Test\TestCase\Model;

    use Blog\Model\BlogPost;
    use Cake\TestSuite\TestCase;

    class BlogPostTest extends TestCase {

        // Plugin fixtures located in /plugins/Blog/tests/Fixture/
        public $fixtures = ['plugin.blog.blog_posts'];
        public $BlogPost;

        public function testSomething() {
            // Test something.
        }
    }

If you want to use plugin fixtures in the app tests you can
reference them using ``plugin.pluginName.fixtureName`` syntax in the
``$fixtures`` array.

Generating Tests with Bake
==========================

If you use :doc:`bake </console-and-shells/code-generation-with-bake>` to
generate scaffolding, it will also generate test stubs. If you need to
re-generate test case skeletons, or if you want to generate test skeletons for
code you wrote, you can use ``bake``:

.. code-block:: bash

    bin/cake bake test <type> <name>

``<type>`` should be one of:

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Cell

While ``<name>`` should be the name of the object you want to bake a test
skeleton for.

Integration with Jenkins
========================

`Jenkins <http://jenkins-ci.org>`_ is a continuous integration server, that can
help you automate the running of your test cases. This helps ensure that all
your tests stay passing and your application is always ready.

Integrating a CakePHP application with Jenkins is fairly straightforward. The
following assumes you've already installed Jenkins on \*nix system, and are able
to administer it. You also know how to create jobs, and run builds. If you are
unsure of any of these, refer to the `Jenkins documentation <http://jenkins-ci.org/>`_ .

Create a Job
------------

Start off by creating a job for your application, and connect your repository
so that jenkins can access your code.

Add Test Database Config
------------------------

Using a separate database just for Jenkins is generally a good idea, as it stops
bleed through and avoids a number of basic problems. Once you've created a new
database in a database server that jenkins can access (usually localhost). Add
a *shell script step* to the build that contains the following:

.. code-block:: bash

    cat > config/app_local.php <<'CONFIG'
    <?php
    $config = [
        'Datasources' => [
            'test' => [
                'datasource' => 'Database/Mysql',
                'host'       => 'localhost',
                'database'   => 'jenkins_test',
                'login'      => 'jenkins',
                'password'   => 'cakephp_jenkins',
                'encoding'   => 'utf8'
            ]
        ]
    ];
    CONFIG

Then uncomment the following line in your ``config/bootstrap.php`` file::

    //Configure::load('app_local.php', 'default');

By creating an ``app_local.php`` file, you have an easy way to define
configuration specific to Jenkins. You can use this same configuration file to
override any other configuration files you need on Jenkins.

It's often a good idea to drop and re-create the database before each build as
well. This insulates you from chained failures, where one broken build causes
others to fail. Add another *shell script step* to the build that contains the
following::

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

Add your Tests
--------------

Add another *shell script step* to your build. In this step install your
dependencies and run the tests for your application. Creating a junit log file,
or clover coverage is often a nice bonus, as it gives you a nice graphical view
of your testing results:

.. code-block:: bash

    # Download Composer if it is missing.
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer| php
    # Install dependencies
    php composer.phar install
    bin/phpunit --log-junit junit.xml --coverage-clover clover.xml

If you use clover coverage, or the junit results, make sure to configure those
in Jenkins as well. Failing to configure those steps will mean you won't see the results.

Run a Build
-----------

You should be able to run a build now. Check the console output and make any
necessary changes to get a passing build.

.. meta::
    :title lang=en: Testing
    :keywords lang=en: web runner,phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
