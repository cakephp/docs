Testing
#######

As of CakePHP 1.2 there is support for a comprehensive testing framework
built into CakePHP. The framework is an extension of the SimpleTest
framework for PHP. This section will discuss how to prepare for testing
and how to build and run your tests.

Preparing for testing
=====================

Ready to start testing? Good! Lets get going then!

Installing SimpleTest
---------------------

Installing SimpleTest

The testing framework provided with CakePHP 1.2 is built upon the
SimpleTest testing framework. SimpleTest is not shipped with the default
CakePHP installation, so we need to download it first. You can find it
here:
`https://simpletest.sourceforge.net/ <https://simpletest.sourceforge.net/>`_.

Fetch the latest version, and unzip the code to your vendors folder, or
your app/vendors folder, depending on your preference. You should now
have a vendors/simpletest directory with all SimpleTest files and
folders inside. Remember to have a DEBUG level of at least 1 in your
app/config/core.php file before running any tests!

If you have no test database connection defined in your
app/config/database.php, test tables will be created with a
``test_suite_`` prefix. You can create a ``$test`` database connection
to contain any test tables like the one below:

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

If the test database is available and CakePHP can connect to it, all
tables will be created in this database.

Running Core test cases
-----------------------

The release packages of CakePHP 1.2 do not ship with the core test
cases. In order to get these tests, you need to download from the
repository. All versions of CakePHP are currently located at the website
`https://code.cakephp.org/ <https://code.cakephp.org/>`_. You will need to
create a user account with personal key, and use Git to access the
repository.

To add the core tests to your existing application, uncompress the
downloaded nightly package into a temporary directory. Locate the
``/cake/tests`` directory from the repository and copy it (recursively)
into your ``/cake/tests`` folder.

The tests can then be accessed by browsing to
http://your.cake.domain/test.php - depending on how your specific setup
looks. Try executing one of the core test groups by clicking on the
corresponding link. Executing a test group might take a while, but you
should eventually see something like "2/2 test cases complete: 49
passes, 0 fails and 0 exceptions.".

Congratulations, you are now ready to start writing tests!

If you run all of the core tests at once or run core test groups most of
them will fail. This is known by the CakePHP developers and is normal so
don't panic. Instead, try running each of the core test cases
individually.

Testing overview - Unit testing vs. Web testing
===============================================

The CakePHP test framework supports two types of testing. One is Unit
Testing, where you test small parts of your code, such as a method in a
component or an action in a controller. The other type of testing
supported is Web Testing, where you automate the work of testing your
application through navigating pages, filling forms, clicking links and
so on.

Preparing test data
===================

About fixtures
--------------

When testing code that depends on models and data, one can use
**fixtures** as a way to generate temporary data tables loaded with
sample data that can be used by the test. The benefit of using fixtures
is that your test has no chance of disrupting live application data. In
addition, you can begin testing your code prior to actually developing
live content for an application.

CakePHP attempts to use the connection named ``$test`` in your
app/config/database.php configuration file. If this connection is not
usable, it will use the ``$default`` database configuration and create
the test tables in the database defined in that configuration. In either
case, it will add "test\_suite\_" to your own table prefix (if any) to
prevent collision with your existing tables.

CakePHP performs the following during the course of a fixture based test
case:

#. Creates tables for each of the fixtures needed
#. Populates tables with data, if data is provided in fixture
#. Runs test methods
#. Empties the fixture tables
#. Removes fixture tables from database

Creating fixtures
-----------------

When creating a fixture you will mainly define two things: how the table
is created (which fields are part of the table), and which records will
be initially populated to the test table. Let's then create our first
fixture, that will be used to test our own Article model. Create a file
named **article\_fixture.php** in your **app/tests/fixtures** directory,
with the following content:

If you are testing a plugin, see the section :doc:`/The-Manual/Common-Tasks-With-CakePHP/Testing`.

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 
     ?> 

The ``$name`` variable is extremely significant. If you omit it, cake
will use the wrong table names when it sets up your test database, and
you'll get strange errors that are difficult to debug. If you use PHP
5.2, you might be used to writing model classes without ``$name``, but
you must remember to include it in your fixture files. You can also
specify the table name to be created by including a ``$table`` variable
in the fixture.

We use $fields to specify which fields will be part of this table, on
how they are defined. The format used to define these fields is the same
used in the function **generateColumnSchema()** defined on Cake's
database engine classes (for example, on file dbo\_mysql.php.) Let's see
the available attributes a field can take and their meaning:

type
    CakePHP internal data type. Currently supported: string (maps to
    VARCHAR), text (maps to TEXT), integer (maps to INT), float (maps to
    FLOAT), datetime (maps to DATETIME), timestamp (maps to TIMESTAMP),
    time (maps to TIME), date (maps to DATE), and binary (maps to BLOB)
key
    set to primary to make the field AUTO\_INCREMENT, and a PRIMARY KEY
    for the table.
length
    set to the specific length the field should take.
null
    set to either true (to allow NULLs) or false (to disallow NULLs)
default
    default value the field takes.

We lastly can set a set of records that will be populated after the test
table is created. The format is fairly straight forward and needs little
further explanation. Just keep in mind that each record in the $records
array must have a key for **every** field specified in the $fields
array. If a field for a particular record needs to have a NULL value,
just specify the value of that key as NULL.

Importing table information and records
---------------------------------------

Your application may have already working models with real data
associated to them, and you might decide to test your model with that
data. It would be then a duplicate effort to have to define the table
definition and/or records on your fixtures. Fortunately, there's a way
for you to define that table definition and/or records for a particular
fixture come from an existing model or an existing table.
Let's start with an example. Assuming you have a model named Article
available in your application (that maps to a table named articles),
change the example fixture given in the previous section
(**app/tests/fixtures/article\_fixture.php**) to:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

This statement tells the test suite to import your table definition from
the table linked to the model called Article. You can use any model
available in your application. The statement above does not import
records, you can do so by changing it to:

::

    <?php   
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

If on the other hand you have a table created but no model available for
it, you can specify that your import will take place by reading that
table information instead. For example:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

Will import table definition from a table called 'articles' using your
CakePHP database connection named 'default'. If you want to change the
connection to use just do:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'other'); 
       } 
       ?> 

Since it uses your CakePHP database connection, if there's any table
prefix declared it will be automatically used when fetching table
information. The two snippets above do not import records from the
table. To force the fixture to also import its records, change it to:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

You can naturally import your table definition from an existing
model/table, but have your records defined directly on the fixture as it
was shown on previous section. For example:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
              ); 
       } 
     ?> 

Creating tests
==============

First, lets go through a number of rules, or guidelines, concerning
tests:

#. PHP files containing tests should be in your
   **app/tests/cases/[some\_folder]**.
#. The filenames of these files should end in **.test.php** instead of
   just .php.
#. The classes containing tests should extend **CakeTestCase** or
   **CakeWebTestCase**.
#. The name of any method containing a test (i.e. containing an
   assertion) should begin with **test**, as in **testPublished()**.

When you have created a test case, you can execute it by browsing to
**http://your.cake.domain/cake\_folder/test.php** (depending on how your
specific setup looks) and clicking App test cases, and then click the
link to your specific file.

CakeTestCase Callback Methods
-----------------------------

If you want to sneak in some logic just before or after an individual
CakeTestCase method, and/or before or after your entire CakeTestCase,
the following callbacks are available:

**start()**
 First method called in a *test case*.

**end()**
 Last method called in a *test case*.

**startCase()**
 called before a *test case* is started.

**endCase()**
 called after a *test case* has run.

**before($method)**
 Announces the start of a *test method*.

**after($method)**
 Announces the end of a *test method*.

**startTest($method)**
 Called just before a *test method* is executed.

**endTest($method)**
 Called just after a *test method* has completed.

Testing models
==============

Creating a test case
--------------------

Let's say we already have our Article model defined on
app/models/article.php, which looks like this:

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $conditions = array( 
                      $this->name . '.published' => 1 
                  ); 
                   
                  return $this->findAll($conditions, $fields); 
              } 
       
       } 
     ?> 

We now want to set up a test that will use this model definition, but
through fixtures, to test some functionality in the model. CakePHP test
suite loads a very minimum set of files (to keep tests isolated), so we
have to start by loading our parent model (in this case the Article
model which we already defined), and then inform the test suite that we
want to test this model by specifying which DB configuration it should
use. CakePHP test suite enables a DB configuration named **test** that
is used for all models that rely on fixtures. Setting $useDbConfig to
this configuration will let CakePHP know that this model uses the test
suite database connection.

CakePHP Models will only use the test DB config if they rely on fixtures
in your testcase!

Since we also want to reuse all our existing model code we will create
a test model that will extend from Article, set $useDbConfig and $name
appropiately. Let's now create a file named **article.test.php** in your
**app/tests/cases/models** directory, with the following contents:

::

     <?php  
       App::import('Model','Article'); 

       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

We have created the ArticleTestCase. In variable **$fixtures** we define
the set of fixtures that we'll use.

If your model is associated with other models, you will need to include
ALL the fixtures for each associated model even if you don't use them.
For example: A hasMany B hasMany C hasMany D. In ATestCase you will have
to include fixtures for a, b, c and d.

Creating a test method
----------------------

Let's now add a method to test the function published() in the Article
model. Edit the file **app/tests/cases/models/article.test.php** so it
now looks like this:

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article =& ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => 'First Article' )),
                    array('Article' => array( 'id' => 2, 'title' => 'Second Article' )),
                    array('Article' => array( 'id' => 3, 'title' => 'Third Article' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    

You can see we have added a method called **testPublished()**. We start
by creating an instance of our fixture based **Article** model, and then
run our **published()** method. In **$expected** we set what we expect
should be the proper result (that we know since we have defined which
records are initally populated to the article table.) We test that the
result equals our expectation by using the **assertEqual** method. See
the section Creating Tests for information on how to run the test.

Testing controllers
===================

Creating a test case
--------------------

Say you have a typical articles controller, with its corresponding
model, and it looks like this:

::

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
app/tests/cases/controllers directory and put the following inside:

::

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

The new thing here is the **testAction** method. The first argument of
that method is the Cake url of the controller action to be tested, as in
'/articles/index/short'.

The second argument is an array of parameters, consisting of:

return
    Set to what you want returned.
     Valid values are:

    -  'vars' - You get the view vars available after executing action
    -  'view' - You get The rendered view, without the layout
    -  'contents' - You get the rendered view's complete html, including
       the layout
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
    ``function testIndexPostFixturized()`` in above test case to see how
    we emulate posting form data for a new article submission.

Pitfalls
--------

If you use testAction to test a method in a controller that does a
redirect, your test will terminate immediately, not yielding any
results.
See `https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
for a possible fix.

For an in-depth explanation of controller testing please see this blog
post by Mark Story `Testing CakePHP Controllers the hard
way <https://mark-story.com/posts/view/testing-cakephp-controllers-the-hard-way>`_.

Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's important
to make sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for Components.
Suppose we have a helper called CurrencyRendererHelper located in
``app/views/helpers/currency_renderer.php`` with its accompanying test
case file located in
``app/tests/cases/helpers/currency_renderer.test.php``

Creating Helper test, part I
----------------------------

First of all we will define the responsibilities of our
CurrencyRendererHelper. Basically, it will have two methods just for
demonstration purpose:

function usd($amount)

This function will receive the amount to render. It will take 2 decimal
digits filling empty space with zeros and prefix 'USD'.

function euro($amount)

This function will do the same as usd() but prefix the output with
'EUR'. Just to make it a bit more complex, we will also wrap the result
in span tags:

::

    <span class="euro"></span> 

Let's create the tests first:

::

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
suite to check if the returned values are equal to what is expected.

Executing the test now will result in errors (because
currencyRendererHelper doesn't even exist yet) showing that we have 3
fails.

Once we know what our method should do, we can write the method itself:

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot, thousands
separator to comma, and prefix the formatted number with 'USD' string.

Save this in app/views/helpers/currency\_renderer.php and execute the
test. You should see a green bar and messaging indicating 4 passes.

Testing components
==================

Lets assume that we want to test a component called
TransporterComponent, which uses a model called Transporter to provide
functionality for other controllers. We will use four files:

-  A component called Transporters found in
   **app/controllers/components/transporter.php**
-  A model called Transporter found in **app/models/transporter.php**
-  A fixture called TransporterTestFixture found in
   **app/tests/fixtures/transporter\_fixture.php**
-  The testing code found in **app/tests/cases/transporter.test.php**

Initializing the component
--------------------------

Since :doc:`/The-Manual/Developing-with-CakePHP/Components` we need a controller to access the
data in the model.

If the startup() function of the component looks like this:

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }

then we can just design a really simple fake class:

::

    class FakeTransporterController {} 

and assign values into it like this:

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 

Creating a test method
----------------------

Just create a class that extends CakeTestCase and start writing tests!

::

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
     

Web testing - Testing views
===========================

Most, if not all, CakePHP projects result in a web application. While
unit tests are an excellent way to test small parts of functionality,
you might also want to test the functionality on a large scale. The
**CakeWebTestCase** class provides a good way of doing this testing from
a user point-of-view.

About CakeWebTestCase
---------------------

**CakeWebTestCase** is a direct extension of the SimpleTest WebTestCase,
without any extra functionality. All the functionality found in the
`SimpleTest documentation for Web
testing <https://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
is also available here. This also means that no functionality other than
that of SimpleTest is available. This means that you cannot use
fixtures, and **all web test cases involving updating/saving to the
database will permanently change your database values**. Test results
are often based on what values the database holds, so making sure the
database contains the values you expect is part of the testing
procedure.

Creating a test
---------------

In keeping with the other testing conventions, you should create your
view tests in tests/cases/views. You can, of course, put those tests
anywhere but following the conventions whenever possible is always a
good idea. So let's create the file
tests/cases/views/complete\_web.test.php

First, when you want to write web tests, you must remember to extend
**CakeWebTestCase** instead of CakeTestCase:

::

    class CompleteWebTestCase extends CakeWebTestCase

If you need to do some preparation before you start the test, create a
constructor:

::

    function CompleteWebTestCase(){
      //Do stuff here
    }

When writing the actual test cases, the first thing you need to do is
get some output to look at. This can be done by doing a **get** or
**post** request, using **get()**\ or **post()** respectively. Both
these methods take a full url as the first parameter. This can be
dynamically fetched if we assume that the test script is located under
http://your.domain/cake/folder/webroot/test.php by typing:

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));

You can then do gets and posts using Cake urls, like this:

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);

The second parameter to the post method, **$data**, is an associative
array containing the post data in Cake format:

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");

When you have requested the page you can do all sorts of asserts on it,
using standard SimpleTest web test methods.

Walking through a page
----------------------

CakeWebTest also gives you an option to navigate through your page by
clicking links or images, filling forms and clicking buttons. Please
refer to the SimpleTest documentation for more information on that.

Testing plugins
===============

Tests for plugins are created in their own directory inside the plugins
folder.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

They work just like normal tests but you have to remember to use the
naming conventions for plugins when importing classes. This is an
example of a testcase for the PizzaOrder model from the plugins chapter
of this manual. A difference from other tests is in the first line where
'Pizza.PizzaOrder' is imported. You also need to prefix your plugin
fixtures with '``plugin.plugin_name.``\ '.

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

If you want to use plugin fixtures in the app tests you can reference
them using 'plugin.pluginName.fixtureName' syntax in the $fixtures
array.

That is all there is to it.

Miscellaneous
=============

Customizing the test reporter
-----------------------------

The standard test reporter is **very** minimalistic. If you want more
shiny output to impress someone, fear not, it is actually very easy to
extend.
The only danger is that you have to fiddle with core Cake code,
specifically **/cake/tests/libs/cake\_reporter.php**.

To change the test output you can override the following methods:

paintHeader()
    Prints before the test is started.
paintPass()
    Prints everytime a test case has passed. Use $this->getTestList() to
    get an array of information pertaining to the test, and $message to
    get the test result. Remember to call parent::paintPass($message).
paintFail()
    Prints everytime a test case has failed. Remember to call
    parent::paintFail($message).
paintFooter()
    Prints when the test is over, i.e. when all test cases has been
    executed.

If, when running paintPass and paintFail, you want to hide the parent
output, enclose the call in html comment tags, as in:

::

    echo "\n<!-- ";
    parent::paintFail($message);
    echo " -->\n";

A sample **cake\_reporter.php**\ setup that creates a table to hold the
test results follows:

::

    <?php
     /**
     * CakePHP(tm) Tests <https://trac.cakephp.org/wiki/Developement/TestSuite>
     * Copyright 2005-2008, Cake Software Foundation, Inc.
     *                              1785 E. Sahara Avenue, Suite 490-204
     *                              Las Vegas, Nevada 89104
     *
     *  Licensed under The Open Group Test Suite License
     *  Redistributions of files must retain the above copyright notice.
     */
     class CakeHtmlReporter extends HtmlReporter {
     function CakeHtmlReporter($characterSet = 'UTF-8') {
     parent::HtmlReporter($characterSet);
     }
     
    function paintHeader($testName) {
      $this->sendNoCacheHeaders();
      $baseUrl = BASE;
      print "<h2>$testName</h2>\n";
      print "<table style=\"\"><th>Res.</th><th>Test case</th><th>Message</th>\n";
      flush();
     }

     function paintFooter($testName) {
       $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
       print "</table>\n";
       print "<div style=\"";
       print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
       print "\">";
       print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
       print " test cases complete:\n";
       print "<strong>" . $this->getPassCount() . "</strong> passes, ";
       print "<strong>" . $this->getFailCount() . "</strong> fails and ";
       print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
       print "</div>\n";
     }

     function paintPass($message) {
       parent::paintPass($message);
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden;                  border-right: hidden\">\n";
       print "\t\t<span style=\"color: green;\">Pass</span>: \n";
       echo "\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       array_shift($breadcrumb);
       array_shift($breadcrumb);
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $message = split('at \[', $message);
       print "-&gt;$message[0]<br />\n\n";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function paintFail($message) {
       echo "\n<!-- ";
       parent::paintFail($message);
       echo " -->\n";
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "\t\t<span style=\"color: red;\">Fail</span>: \n";
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "$message";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function _getCss() {
       return parent::_getCss() . ' .pass { color: green; }';
     }
     
     }
     ?>

Grouping tests
--------------

If you want several of your test to run at the same time, you can try
creating a test group. Create a file in **/app/tests/groups/** and name
it something like **your\_test\_group\_name.group.php**. In this file,
extend **GroupTest** and import test as follows:

::

    <?php 
    class TryGroupTest extends GroupTest { 
      var $label = 'try'; 
      function tryGroupTest() { 
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models'); 
      } 
    } 
    ?> 

The code above will group all test cases found in the
**/app/tests/cases/models/** folder. To add an individual file, use
**TestManager::addTestFile**\ ($this, filename).

Running tests in the Command Line
=================================

If you have simpletest installed you can run your tests from the command
line of your application.

from **app/**

::

    cake testsuite help

::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix

    Examples: 
            cake testsuite app all
            cake testsuite core all

            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller

            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set

            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket

            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'

    Code Coverage Analysis: 


    Append 'cov' to any of the above in order to enable code coverage analysis

As the help menu suggests, you'll be able to run all, part, or just a
single test case from your app, plugin, or core, right from the command
line.

If you have a model test of **test/models/my\_model.test.php** you'd run
just that test case by running:

::

    cake testsuite app case models/my_model

