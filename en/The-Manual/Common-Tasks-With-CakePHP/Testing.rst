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

The testing framework provided with CakePHP 1.3 is built upon the
SimpleTest testing framework. SimpleTest is not shipped with the default
CakePHP installation, so we need to download it first. You can find it
here:
`http://simpletest.sourceforge.net/ <http://simpletest.sourceforge.net/>`_.

Fetch the latest version, and unzip the code to your vendors folder, or
your app/vendors folder, depending on your preference. You should now
have a vendors/simpletest directory with all SimpleTest files and
folders inside. Remember to have a DEBUG level of at least 1 in your
app/config/core.php file before running any tests!

There is a new version of SimpleTest 1.1alpha that does not work with
CakePHP. Please use 1.0.1.

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

After installing Simpletest, you can run the core test cases. They are
part of every packaged release and can also be found in the `git
repository <https://github.com/cakephp/cakephp>`_.

The tests can then be accessed by browsing to
http://your.cake.domain/test.php
(http://path-to-app/app/webroot/test.php if mod\_rewrite is disabled) -
depending on how your specific setup looks. Try executing one of the
core test groups by clicking on the corresponding link. Executing a test
group might take a while, but you should eventually see something like
"2/2 test cases complete: 49 passes, 0 fails and 0 exceptions.".

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
the test tables in the database defined in that configuration. If the
default connection is used, the test suite will use "test\_suite\_" as a
prefix to help prevent collision with your existing tables.

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
you must remember to include it in your fixture files.

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

Your application may have already working models with real data associated to
them, and you might decide to test your model with that data. It would be then
a duplicate effort to have to define the table definition and/or records on your
fixtures. Fortunately, there's a way for you to define that table definition
and/or records for a particular fixture come from an existing model or an
existing table.  Let's start with an example. Assuming you have a model named
Article available in your application (that maps to a table named articles),
change the example fixture given in the previous section
(**app/tests/fixtures/article\_fixture.php**) to::

     <?php
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       }


This statement tells the test suite to import your table definition from the
table linked to the model called Article. You can use any model available in
your application. The statement above does not import records, you can do so by
changing it to::

    <?php
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }

If on the other hand you have a table created but no model available for it, you
can specify that your import will take place by reading that table information
instead. For example::

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
                  $params = array( 
                        'conditions' => array(
                              $this->name . '.published' => 1 
                        ),
                        'fields' => $fields
                  ); 
                   
                  return $this->find('all',$params); 
              } 
       
       } 
     ?> 

We now want to set up a test that will use this model definition, but
through fixtures, to test some functionality in the model. CakePHP test
suite loads a very minimum set of files (to keep tests isolated), so we
have to start by loading our parent model (in this case the Article
model which we already defined), and then inform the test suite that we
want to test this model by specifying which DB configuration it should
use. CakePHP test suite enables a DB configuration named **test\_suite**
that is used for all models that rely on fixtures. Setting $useDbConfig
to this configuration will let CakePHP know that this model uses the
test suite database connection.

CakePHP Models will only use the test\_suite DB config if they rely on
fixtures in your testcase!

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
results. See `http://mark-story.com/posts/view/testing-cakephp-controllers-the-hard-way <http://mark-story.com/posts/view/testing-cakephp-controllers-the-hard-way>`_ for a possible fix.

Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's important to make
sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for Components.  Suppose we
have a helper called CurrencyRendererHelper located in
``app/views/helpers/currency_renderer.php`` with its accompanying test case file
located in ``app/tests/cases/helpers/currency_renderer.test.php``

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
testing <http://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
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
extend. By creating a new reporter and making a request with a matching
``output`` GET parameter you can get test results with a custom
reporter.

Reporters generate the visible output from the test suite. There are two
built in reporters: Text and Html. By default all web requests use the
Html reporter. You can create your own reporters by creating files in
your app/libs. For example you could create the file
``app/libs/test_suite/reporters/my_reporter.php`` and in it create the
following:

::

    require_once CAKE_TEST_LIB . 'reporter' . DS . 'cake_base_reporter.php';

    class MyReporter extends CakeBaseReporter {
        //methods go here.
    }

Extending ``CakeBaseReporter`` or one of its subclasses is not required,
but strongly suggested as you may get missing errors otherwise.
``CakeBaseReporter`` encapsulates a few common test suite features such
as test case timing and code coverage report generation. You can use
your custom reporter by setting the ``output`` query string parameter to
the reporter name minus 'reporter'. For the example above you would set
``output=my`` to use your custom reporter.

Test Reporter methods
---------------------

Reporters have a number of methods used to generate the various parts of
a Test suite response.

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
    Prints everytime a test case has passed. Use $this->getTestList() to
    get an array of information pertaining to the test, and $message to
    get the test result. Remember to call parent::paintPass($message).
paintFail()
    Prints everytime a test case has failed. Remember to call
    parent::paintFail($message).
paintSkip()
    Prints everytime a test case has been skipped. Remember to call
    parent::paintSkip($message).
paintException()
    Prints everytime there is an uncaught exception. Remember to call
    parent::paintException($message).
    Prints everytime an error is raised. Remember to call
    parent::paintError($message).
paintFooter()
    Prints when the test case/group test is over, i.e. when all test
    cases has been executed.
paintDocumentEnd()
    Paints the end of the response from the test suite. Used to paint
    things like footer elements in an html page.

Grouping tests
--------------

If you want several of your test to run at the same time, you can try
creating a test group. Create a file in **/app/tests/groups/** and name
it something like **your\_test\_group\_name.group.php**. In this file,
extend **TestSuite** and import test as follows:

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

    cake testsuite app models/my_model

Test Suite changes in 1.3
=========================

The TestSuite harness for 1.3 was heavily refactored and partially
rebuilt. The number of constants and global functions have been greatly
reduced. Also the number of classes used by the test suite has been
reduced and refactored. You **must** update ``app/webroot/test.php`` to
continue using the test suite. We hope that this will be the last time
that a change is required to ``app/webroot/test.php``.

**Removed Constants**

-  ``CAKE_TEST_OUTPUT``
-  ``RUN_TEST_LINK``
-  ``BASE``
-  ``CAKE_TEST_OUTPUT_TEXT``
-  ``CAKE_TEST_OUTPUT_HTML``

These constants have all been replaced with instance variables on the
reporters and the ability to switch reporters.

**Removed functions**

-  ``CakePHPTestHeader()``
-  ``CakePHPTestSuiteHeader()``
-  ``CakePHPTestSuiteFooter()``
-  ``CakeTestsGetReporter()``
-  ``CakePHPTestRunMore()``
-  ``CakePHPTestAnalyzeCodeCoverage()``
-  ``CakePHPTestGroupTestList()``
-  ``CakePHPTestCaseList()``

These methods and the logic they contained have been
refactored/rewritten into ``CakeTestSuiteDispatcher`` and the relevant
reporter classes. This made the test suite more modular and easier to
extend.

**Removed Classes**

-  HtmlTestManager
-  TextTestManager
-  CliTestManager

These classes became obsolete as logic was consolidated into the
reporter classes.

**Modified methods/classes**

The following methods have been changed as noted.

-  ``TestManager::getExtension()`` is no longer static.
-  ``TestManager::runAllTests()`` is no longer static.
-  ``TestManager::runGroupTest()`` is no longer static.
-  ``TestManager::runTestCase()`` is no longer static.
-  ``TestManager::getTestCaseList()`` is no longer static.
-  ``TestManager::getGroupTestList()`` is no longer static.

**testsuite Console changes**

The output of errors, exceptions, and failures from the testsuite
console tool have been updated to remove redundant information and
increase readability of the messages. If you have other tools built upon
the testsuite console, be sure to update those tools with the new
formatting.

**CodeCoverageManager changes**

-  ``CodeCoverageManager::start()``'s functionality has been moved to
   ``CodeCoverageManager::init()``
-  ``CodeCoverageManager::start()`` now starts coverage generation.
-  ``CodeCoverageManager::stop()`` pauses collection
-  ``CodeCoverageManager::clear()`` stops and clears collected coverage
   reports.

