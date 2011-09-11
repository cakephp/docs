Testing
#######

CakePHP comes with comprehensive testing support built-in.  CakePHP comes with
integration for `PHPUnit <http://phpunit.de>`_.  In addition to the features
offered by PHPUnit, CakePHP offers some additional features to make testing
easier. This section will cover installing PHPUnit, and getting started with
Unit Testing, and how you can use the extensions that CakePHP offers.

Installing PHPUnit
==================

CakePHP uses PHPUnit as its underlying test framework.  PHPUnit is the de-facto
standard for unit testing in PHP.  It offers a deep and powerful set of features
for making sure your code does what you think it does.  PHPUnit can be installed
through the `pear installer <http://pear.php.net>`_.  To install PHPUnit run the
following::

    pear upgrade PEAR
    pear config-set auto_discover 1
    pear install pear.phpunit.de/PHPUnit

.. note::

    Depending on your system's configuration, you make need to run the previous
    commands with ``sudo``

Test database setup
===================

Remember to have a debug level of at least 1 in your ``app/Config/core.php`` 
file before running any tests.  Tests are not accessible via the web runner when
debug is equal to 0.  Before running any tests you should be sure to add a
``$test`` database configuration.  This configuration is used by CakePHP for
fixture tables and data::

    <?php
    var $test = array(
        'datasource' => 'Datasource/Mysql',
        'persistent' => false,
        'host' => 'dbhost',
        'login' => 'dblogin',
        'password' => 'dbpassword',
        'database' => 'test_database'
    );

.. note::

    Its a good idea to make the test database and your actual database
    different databases.  This will prevent any embarrasing mistakes later.

Checking the test setup
=======================

After installing PHPUnit and setting up your ``$test`` database configuration
you can make sure you're ready to write and run your own tests by running one of
the core tests. There are two built-in runners for testing, we'll start off by
using the web runner. The tests can then be accessed by browsing to
http://localhost/your_app/test.php. You should see a list of the core test
cases.  Click on the 'AllConfigure' test.  You should see a green bar with some
additional information about the tests run, and number passed.

Congratulations, you are now ready to start writing tests!

Test case conventions
=====================

Like most things in CakePHP, test cases have some conventions. concerning
tests:

#. PHP files containing tests should be in your
   ``app/Test/Case/[Type]`` directories.
#. The filenames of these files should end in ``Test.php`` instead
   of just .php.
#. The classes containing tests should extend ``CakeTestCase`` or
   ``PHPUnit_Framework_TestCase``.
#. Like other classnames, the test case classnames should match the filename.
   ``RouterTest.php`` should contain ``class RouterTest extends CakeTestCase``.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with ``test``, as in ``testPublished()``.
   You can also use the ``@test`` annotation to mark methods as test methods.

When you have created a test case, you can execute it by browsing
to ``http://localhost/you_app/test.php`` (depending on
how your specific setup looks). Click App test cases, and
then click the link to your specific file.  You can run tests from the command
line using the testsuite shell::

    ./Console/cake testsuite app Model/Post

For example, would run the tests for your Post model.

Creating your first test case
=============================

In the following example, we'll create a test case for a very simple helper
method.  The helper we're going to test will be formatting progress bar HTML.
Our helper looks like::

    <?php
    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

This is a very simple example, but it will be useful to show how you can create
a simple test case.  After creating and saving our helper, we'll create the test
case file in ``app/Test/Case/View/Helper/ProgressHelperTest.php``.  In that file
we'll start with the following::

    <?php
    App::uses('ProgressHelper', 'View/Helper');
    App::uses('View', 'View');

    class ProgressHelperTest extends CakeTestCase {
        public function setUp() {
        
        }

        public function testBar() {

        }
    }

We'll flesh out this skeleton in a minute.  We've added two methods to start
with.  First is ``setUp()``.  This method is called before every *test* method
in a test case class.  Setup methods should initialze the objects needed for the
test, and do any configuration needed.  In our setup method we'll add the
following::

    <?php
    public function setUp() {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgresHelper($View);
    }

Calling the parent method is important in test cases, as CakeTestCase::setUp()
does a number things like backing up the values in :php:class:`Configure` and,
storing the paths in :php:class:`App`.

Next, we'll fill out the test method.  We'll use some assertions to ensure that
our code creates the output we expect::

    <?php
    public funtion testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

The above test is a simple one but shows the potential benefit of using test
cases.  We use ``assertContains()`` to ensure that our helper is returning a
string that contains the content we expect.  If the result did not contain the
expected content the test would fail, and we would know that our code is
incorrect. 

By using test cases you can easily describe the relationship between a set of
known inputs and their expected output.  This helps you be more confident of the
code you're writing as you can easily check that the code you wrote fulfills the
expectations and assertions your tests make.  Additionally because tests are
code, they are easy to re-run whenever you make a change.  This helps prevent
the creation of new bugs.

.. _running-tests:

Running tests
=============

Once you have PHPUnit installed and some test cases written, you'll want to run
the test cases very frequently.  Its a good idea to run tests before committing
any changes to help ensure you haven't broken anything.

Running tests from a browser
----------------------------

.. todo::

    Complete this section. Add filtering and coverage reporting.

Running tests from command line
-------------------------------

CakePHP provides a ``testsuite`` shell for running tests.  You can run app, core
and plugin tests easily using the testsuite shell.  It accepts all the arguments
you would expect to find on the normal PHPUnit command line tool as well. From
your app directory you can do the following to run tests::

    # Run a model tests in the app
    ./Console/cake testsuite app Model/Article

    # Run a component test in a plugin
    ./Console/cake testsuite DebugKit Controller/Component/ToolbarComponent

    # Run the configure class test in CakePHP
    ./Console/cake testsuite core Core/Configure

.. todo::

    Add filtering and coverage generation.

Creating test suites
====================

If you want several of your test to run at the same time, you can
try creating a test group. Create a file in **/app/tests/groups/**
and name it something like **your\_test\_group\_name.group.php**.
In this file, extend **TestSuite** and import test as follows:

::

    <?php
    class TryGroupTest extends TestSuite {
      var $label = 'try';
      function tryGroupTest() {
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models');
      }
    }
    ?>

The code above will group all test cases found in the
``/app/tests/cases/models/`` folder. To add an individual file, use
``TestManager::addTestFile($this, filename)``.


Fixtures
========

When testing code that depends on models and the database, one can use
**fixtures** as a way to generate temporary data tables loaded with
sample data that can be used by the test. The benefit of using
fixtures is that your test has no chance of disrupting live
application data. In addition, you can begin testing your code
prior to actually developing live content for an application.

CakePHP uses the connection named ``$test`` in your
``app/Config/database.php`` configuration file. If this connection is
not usable, an exception will be raised and you will not be able to use database
fixtures.

CakePHP performs the following during the course of a fixture based
test case:

#. Creates tables for each of the fixtures needed.
#. Populates tables with data, if data is provided in fixture.
#. Runs test methods.
#. Empties the fixture tables.
#. Removes fixture tables from database.

Creating fixtures
-----------------

When creating a fixture you will mainly define two things: how the
table is created (which fields are part of the table), and which
records will be initially populated to the table. Let's 
create our first fixture, that will be used to test our own Article
model. Create a file named ``ArticleFixture.php`` in your
``app/Test/Fixture`` directory, with the following content::

    <?php
    class ArticleFixture extends CakeTestFixture { 

          public $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          public $records = array( 
              array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 

We use ``$fields`` to specify which fields will be part of this table,
and how they are defined. The format used to define these fields is
the same used with :php:class:`CakeSchema`.  The keys available for table
definition are:

type
    CakePHP internal data type. Currently supported: string (maps to
    VARCHAR), text (maps to TEXT), integer (maps to INT), float (maps
    to FLOAT), datetime (maps to DATETIME), timestamp (maps to
    TIMESTAMP), time (maps to TIME), date (maps to DATE), and binary
    (maps to BLOB)
key
    set to primary to make the field AUTO\_INCREMENT, and a PRIMARY KEY
    for the table.
length
    set to the specific length the field should take.
null
    set to either true (to allow NULLs) or false (to disallow NULLs)
default
    default value the field takes.

We can define a set of records that will be populated after the fixture table is
created. The format is fairly straight forward, ``$records`` is an array of
records.  Each item in ``$records`` should be a single row.  Inside each row,
should be an associative array of the columns and values for the row.  Just keep
in mind that each record in the $records array must have a key for **every**
field specified in the ``$fields`` array. If a field for a particular record needs
to have a NULL value, just specify the value of that key as NULL.

Importing table information and records
---------------------------------------

Your application may have already working models with real data
associated to them, and you might decide to test your application with
that data. It would be then a duplicate effort to have to define
the table definition and/or records on your fixtures. Fortunately,
there's a way for you to define that table definition and/or
records for a particular fixture come from an existing model or an
existing table.

Let's start with an example. Assuming you have a model named
Article available in your application (that maps to a table named
articles), change the example fixture given in the previous section
(``app/Test/Fixture/ArticleFixture.php``) to::

    <?php  
    class ArticleFixture extends CakeTestFixture { 
        public $import = 'Article'; 
    } 

This statement tells the test suite to import your table definition from the
table linked to the model called Article. You can use any model available in
your application. The statement will only import the Article schema, and  does
not import records. To import records you can do the following::

    <?php
    class ArticleFixture extends CakeTestFixture {
        public $import = array('model' => 'Article', 'records' => true);
    }

If on the other hand you have a table created but no model
available for it, you can specify that your import will take place
by reading that table information instead. For example::

    <?php  
    class ArticleFixture extends CakeTestFixture { 
        public $import = array('table' => 'articles'); 
    } 

Will import table definition from a table called 'articles' using
your CakePHP database connection named 'default'. If you want to
use a different connection use::

     <?php  
     class ArticleFixture extends CakeTestFixture { 
        public $import = array('table' => 'articles', 'connection' => 'other'); 
     } 

Since it uses your CakePHP database connection, if there's any
table prefix declared it will be automatically used when fetching
table information. The two snippets above do not import records
from the table. To force the fixture to also import its records,
change the import to::

     <?php  
     class ArticleFixture extends CakeTestFixture { 
        public $import = array('table' => 'articles', 'records' => true);
     } 

You can naturally import your table definition from an existing
model/table, but have your records defined directly on the fixture
as it was shown on previous section. For example::

     <?php
     class ArticleFixture extends CakeTestFixture {
          public $import = 'Article';
          public $records = array(
              array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'),
              array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'),
              array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31')
          );
       }

Loading fixtures in your test cases
-----------------------------------

After you've created your fixtures, you'll want to use them in your test cases.
In each test case you should load the fixtures you will need.  You should load a
fixture for every model that will have a query run against it.  To load fixtures
you define the ``$fixtures`` property in your model::

    <?php
    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
    }

The above will load the Article and Comment fixtures from the application's
Fixture directory.  You can also load fixtures from CakePHP core, or plugins::

    <?php
    class ArticleTest extends CakeTestCase {
        public $fixtures = array('debug_kit.article', 'core.comment');
    }

Using the ``core`` prefix will load fixtures from CakePHP, and using a plugin
name as the prefix, will load the fixture from the named plugin.

Testcase lifecycle callbacks
============================

Test cases have a number of lifecycle callbacks you can use when doing testing:

* ``setUp`` is called before every test method.  Should be used to create the
  objects that are going to be tested, and initialize any data for the test.
  Always remember to call ``parent::setUp()``
* ``tearDown`` is called after every test method.  Should be used to cleanup after
  the test is complete. Always remember to call ``parent::tearDown()``.
* ``setupBeforeClass`` is called once before test methods in a case are started.
  This method must be *static*.
* ``tearDownAfterClass`` is called once after test methods in a case are started.
  This method must be *static*.

Testing models
==============

Let's say we already have our Article model defined on
``app/Model/Article.php``, which looks like this::

     <?php  
     class Article extends AppModel { 
            public function published($fields = null) { 
                $params = array( 
                      'conditions' => array(
                            $this->name . '.published' => 1 
                      ),
                      'fields' => $fields
                ); 
                 
                return $this->find('all',$params); 
            }
     
     } 

We now want to set up a test that will use this model definition, but through
fixtures, to test some functionality in the model.  CakePHP test suite loads a
very minimum set of files (to keep tests isolated), so we have to start by
loading our model - in this case the Article model which we already defined.

Let's now create a file named ``ArticleTest.php`` in your
``app/Test/Case/Model`` directory, with the following contents::

     <?php  
      App::uses('Article', 'Model'); 
      
      class ArticleTestCase extends CakeTestCase { 
            public $fixtures = array('app.article');
      } 

In our test cases' variable ``$fixtures`` we define the set of fixtures that
we'll use.  You should remember to include all the fixtures that will have
queries run aganist them.

Creating a test method
----------------------

Let's now add a method to test the function published() in the
Article model. Edit the file
``app/Test/Case/Model/ArticleTest.php`` so it now looks like
this::

    <?php
    App::uses('Article', 'Model');

    class ArticleTestCase extends CakeTestCase {
        public $fixtures = array('app.article');

        public function setup() {
            parent::setUp();
            $this->Article = ClassRegistry::init('Article');
        }

        function testPublished() {
            $result = $this->Article->published(array('id', 'title'));
            $expected = array(
                array('Article' => array( 'id' => 1, 'title' => 'First Article' )),
                array('Article' => array( 'id' => 2, 'title' => 'Second Article' )),
                array('Article' => array( 'id' => 3, 'title' => 'Third Article' ))
            );

            $this->assertEquals($expected, $result);
        }
    }

You can see we have added a method called ``testPublished()``. We start by
creating an instance of our ``Article`` model, and then run our ``published()``
method. In ``$expected`` we set what we expect should be the proper result (that
we know since we have defined which records are initally populated to the
article table.) We test that the result equals our expectation by using the
``assertEquals`` method. See the :ref:`running-tests` section for more
information on how to run your test case.


Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's
important to make sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for
Components. Suppose we have a helper called CurrencyRendererHelper
located in ``app/views/helpers/currency_renderer.php`` with its
accompanying test case file located in
``app/tests/cases/helpers/currency_renderer.test.php``

Creating Helper test, part I
----------------------------

First of all we will define the responsibilities of our
CurrencyRendererHelper. Basically, it will have two methods just
for demonstration purpose:

function usd($amount)
This function will receive the amount to render. It will take 2
decimal digits filling empty space with zeros and prefix 'USD'.

function euro($amount)
This function will do the same as usd() but prefix the output with
'EUR'. Just to make it a bit more complex, we will also wrap the
result in span tags::

    <span class="euro"></span> 

Let's create the tests first::

    <?php
    
    //Import the helper to be tested.
    //If the tested helper were using some other helper, like Html, 
    //it should be impoorted in this line, and instantialized in startTest().
    App::import('Helper', 'CurrencyRenderer');
    
    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;
    
        //Here we instantiate our helper, and all other helpers we need.
        public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }
    
        //testing usd() function.
        public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            //We should always have 2 decimal digits.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            //Testing the thousands separator
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }
    }

Here, we call ``usd()`` with different parameters and tell the test
suite to check if the returned values are equal to what is
expected.

Executing the test now will result in errors (because
currencyRendererHelper doesn't even exist yet) showing that we have
3 fails.

Once we know what our method should do, we can write the method
itself::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot,
thousands separator to comma, and prefix the formatted number with
'USD' string.

Save this in app/views/helpers/currency\_renderer.php and execute
the test. You should see a green bar and messaging indicating 4
passes.

Testing components
==================

Lets assume that we want to test a component called
TransporterComponent, which uses a model called Transporter to
provide functionality for other controllers. We will use four
files:


-  A component called Transporters found in
   **app/controllers/components/transporter.php**
-  A model called Transporter found in
   **app/models/transporter.php**
-  A fixture called TransporterTestFixture found in
   **app/tests/fixtures/transporter\_fixture.php**
-  The testing code found in
   **app/tests/cases/transporter.test.php**

Initializing the component
--------------------------

Since :doc:`/controllers/components`
we need a controller to access the data in the model.

If the startup() function of the component looks like this:::

    <?php
    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }

then we can just design a really simple fake class::

    class FakeTransporterController {} 

and assign values into it like this::

    <?php
    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 

Creating a test method
----------------------

Just create a class that extends CakeTestCase and start writing
tests!

::

    <?php
    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');
        function testGetTransporter() {
            $this->TransporterComponentTest = new TransporterComponent();
            $controller = new FakeTransporterController();
            $controller->Transporter = new TransporterTest();
            $this->TransporterComponentTest->startup(&$controller);

            $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden");
            $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx");

            $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden");
            $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx");

            $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden");
            $this->assertEqual($result, 3, "GL is best for 410xx-419xx");

            $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway");
            $this->assertEqual($result, 0, "Noone can service Norway");
        }
    }

Testing controllers
===================

Say you have a typical articles controller, with its corresponding
model, and it looks like this::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>

Create a file named articles\_controller.test.php in your
app/tests/cases/controllers directory and put the following
inside::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Starting Test Case</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Ending Test Case</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>Starting method ' . $method . '</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 

The testAction method
---------------------

The new thing here is the **testAction** method. The first argument
of that method is the Cake url of the controller action to be
tested, as in '/articles/index/short'.

The second argument is an array of parameters, consisting of:

return
    Set to what you want returned.
    Valid values are:
    
    -  'vars' - You get the view vars available after executing action
    -  'view' - You get The rendered view, without the layout
    -  'contents' - You get the rendered view's complete html,
       including the layout
    -  'result' - You get the returned value when action uses
       $this->params['requested'].

    The default is 'result'.
fixturize
    Set to true if you want your models auto-fixturized (so your
    application tables get copied, along with their records, to test
    tables so if you change data it does not affect your real
    application.) If you set 'fixturize' to an array of models, then
    only those models will be auto-fixturized while the other will
    remain with live tables. If you wish to use your fixture files with
    testAction() do not use fixturize, and instead just use fixtures as
    you normally would.
method
    set to 'post' or 'get' if you want to pass data to the controller
data
    the data to be passed. Set it to be an associative array consisting
    of fields => value. Take a look at
    ``function testIndexPostFixturized()`` in above test case to see
    how we emulate posting form data for a new article submission.

Pitfalls
--------

If you use testAction to test a method in a controller that does a
redirect, your test will terminate immediately, not yielding any
results.
See
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
for a possible fix.



Creating tests for plugins
==========================

Tests for plugins are created in their own directory inside the
plugins folder.::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

They work just like normal tests but you have to remember to use
the naming conventions for plugins when importing classes. This is
an example of a testcase for the PizzaOrder model from the plugins
chapter of this manual. A difference from other tests is in the
first line where 'Pizza.PizzaOrder' is imported. You also need to
prefix your plugin fixtures with '``plugin.plugin_name.``'.

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');

    class PizzaOrderCase extends CakeTestCase {

        // Plugin fixtures located in /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;

        function testSomething() {
            // ClassRegistry makes the model use the test database connection
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');

            // do some useful test here
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>

If you want to use plugin fixtures in the app tests you can
reference them using 'plugin.pluginName.fixtureName' syntax in the
$fixtures array.



Customizing the test reporter
-----------------------------

The standard test reporter is **very** minimalistic. If you want
more shiny output to impress someone, fear not, it is actually very
easy to extend. By creating a new reporter and making a request
with a matching ``output`` GET parameter you can get test results
with a custom reporter.

Reporters generate the visible output from the test suite. There
are two built in reporters: Text and Html. By default all web
requests use the Html reporter. You can create your own reporters
by creating files in your app/libs. For example you could create
the file ``app/libs/test_suite/reporters/my_reporter.php`` and in
it create the following:

::

    require_once CAKE_TEST_LIB . 'reporter' . DS . 'cake_base_reporter.php';
    
    class MyReporter extends CakeBaseReporter {
        //methods go here.
    }

Extending ``CakeBaseReporter`` or one of its subclasses is not
required, but strongly suggested as you may get missing errors
otherwise. ``CakeBaseReporter`` encapsulates a few common test
suite features such as test case timing and code coverage report
generation. You can use your custom reporter by setting the
``output`` query string parameter to the reporter name minus
'reporter'. For the example above you would set ``output=my`` to
use your custom reporter.

Test Reporter methods
---------------------

Reporters have a number of methods used to generate the various
parts of a Test suite response.

paintDocumentStart()
    Paints the start of the response from the test suite. Used to paint
    things like head elements in an html page.
paintTestMenu()
    Paints a menu of available test cases.
testCaseList()
    Retrieves and paints the list of tests cases.
groupCaseList()
    Retrieves and paints the list of group tests.
paintHeader()
    Prints before the test case/group test is started.
paintPass()
    Prints everytime a test case has passed. Use $this->getTestList()
    to get an array of information pertaining to the test, and $message
    to get the test result. Remember to call
    parent::paintPass($message).
paintFail()
    Prints everytime a test case has failed. Remember to call
    parent::paintFail($message).
paintSkip()
    Prints everytime a test case has been skipped. Remember to call
    parent::paintSkip($message).
paintException()
    Prints everytime there is an uncaught exception. Remember to call
    parent::paintException($message).
    /dd
paintError()
    Prints everytime an error is raised. Remember to call
    parent::paintError($message).
paintFooter()
    Prints when the test case/group test is over, i.e. when all test
    cases has been executed.
paintDocumentEnd()
    Paints the end of the response from the test suite. Used to paint
    things like footer elements in an html page.

