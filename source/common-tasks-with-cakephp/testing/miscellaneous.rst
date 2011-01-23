4.7.11 Miscellaneous
--------------------

Customizing the test reporter
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
~~~~~~~~~~~~~~~~~~~~~

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

Grouping tests
~~~~~~~~~~~~~~

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
