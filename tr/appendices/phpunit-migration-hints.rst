PHPUnit Migration Hints
#######################

Migrating your test cases to `PHPUnit 3.5 <http://www.phpunit.de/manual/current/en/>`_
will hopefully be a fairly pain free transition. However, there are a few known
differences between test cases under PHPUnit and
`SimpleTest <http://www.simpletest.org/>`_.

Installing PHPUnit
==================

Installing from PEAR (Recommended)
----------------------------------

PHPUnit recommends it be installed via the PEAR installer, to do so run the
following commands::

    pear channel-discover pear.phpunit.de
    pear channel-discover components.ez.no
    pear channel-discover pear.symfony-project.com

This has to be done only once. Now the `PEAR Installer <http://pear.php.net/>`_
can be used to install packages from the PHPUnit channel::

    pear install phpunit/PHPUnit

Installing manually
-------------------

In addition to PEAR, CakePHP also supports placing the PHPUnit directory inside
one of your vendors directories along with all its dependencies. Doing so is
generally not recommended as PHPUnit is complicated to install as it is composed
of many PEAR packages. Installing with the PEAR installer is easier and faster.

If you do wish to install PHPUnit manually, you'll need to place it and all of
its dependencies inside your applications ``Vendor`` directory.

Differences between SimpleTest
==============================

There are a number of differences between SimpleTest and PHPUnit. The following
is an attempt to list the most frequently encountered differences.

startCase() and endCase()
-------------------------

These methods are no longer supported. Use the static methods PHPUnit provides:
``setupBeforeClass`` and ``tearDownAfterClass``.

start(), end(), before() and after()
------------------------------------

These methods were part of SimpleTest's test case initialization. ``start()`` and
``end()`` have no replacements. You can use ``setUp()`` and ``tearDown()`` to
replace ``before()`` and ``after()``.

setUp() and tearDown()
----------------------

In the past the methods ``setUp``, ``tearDown``, ``startTest`` and ``endTest``
where supported, and caused confusion as they looked almost like the same thing
but in some cases you should use one or the other.

In the new CakePHP test suite, it is recommended to use only ``setUp`` and
``tearDown``. The methods startTest and endTest are still supported but are
deprecated.

getTests
--------

The method ``getTests`` is no longer supported. You can use filters instead. The
web test runner now takes an additional query string parameter that allows you
to specify a basic regular expression. This regular expression is used to
restrict the methods that are run::

    e.g. filter=myMethod

Only tests containing the string ``myMethod`` will be run on the next refresh.
The cake test shell also supports a --filter option to filter methods.

Assertion methods
-----------------

Many of the assertion methods have slightly different names between PHPUnit and
SimpleTest. Where possible :php:class:`CakeTestCase` provides a wrapper for the
SimpleTest method names. These compatibility wrappers will be removed in 2.1.0.
The following methods will be affected.

* ``assertEqual`` -> ``assertEquals``
* ``assertNotEqual`` -> ``assertNotEquals``
* ``assertPattern`` -> ``assertRegExp``
* ``assertIdentical`` -> ``assertSame``
* ``assertNotIdentical`` -> ``assertNotSame``
* ``assertNoPattern`` -> ``assertNotRegExp``
* ``assertNoErrors`` -> no replacement
* ``expectError`` -> ``setExpectedException``
* ``expectException`` -> ``setExpectedException``
* ``assertReference`` -> ``assertSame``
* ``assertIsA`` -> ``assertType``

Some methods take their arguments in different orders, be sure to check the
methods you are using when updating them.

Mock expectations
-----------------

Mock objects are dramatically different between PHPUnit and SimpleTest. There is
no compatibility wrapper between them. Updating mock object usage can be a
painful process but we hope the following tips help you in your migration. It's
highly recommended you familiarize yourself with the `PHPUnit Mock object <http://www.phpunit.de/manual/current/en/test-doubles.html#test-doubles.mock-objects>`_
documentation.

Replacing method calls
~~~~~~~~~~~~~~~~~~~~~~

The following regular expressions should help update some of your more
straightforward mock object expectations.

Replace expectOnce() no params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    expectOnce\(([^\)]+)\);
    expects(\$this->once())->method($1);

Replace expectOnce() with params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    expectOnce\(([^,]+), array\((.+)\)\);
    expects(\$this->once())->method($1)->with($2);

Replace expectAt()
^^^^^^^^^^^^^^^^^^

::

    expectAt\((\d+), (.+), array\((.+)\)\);
    expects(\$this->at($1))->method($2)->with($3);

Replace expectNever
^^^^^^^^^^^^^^^^^^^

::

    expectNever\(([^\)]+)\);
    expects(\$this->never())->method($1);

Replace setReturnValue
^^^^^^^^^^^^^^^^^^^^^^

::

    setReturnValue\(([^,]+), (.+)\);
    expects(\$this->once())->method($1)->will($this->returnValue($2));

Replace setReturnValueAt
^^^^^^^^^^^^^^^^^^^^^^^^

::

    setReturnValueAt((\d+), ([^,]+), (.+));
    expects(\$this->at($1))->method($2)->will($this->returnValue($3));

Group tests
-----------

Group tests have been removed as PHPUnit treats individual test cases and test
suites as composable entities in the runner. You can place group tests inside
the cases directory and use ``PHPUnit_Framework_TestSuite`` as a base class. An
example Testsuite would look like::

    class AllJavascriptHelpersTest extends PHPUnit_Framework_TestSuite {

    /**
     * Suite define the tests for this suite
     *
     * @return void
     */
        public static function suite() {
            $suite = new PHPUnit_Framework_TestSuite('JsHelper and all Engine Helpers');

            $helperTestPath = CORE_TEST_CASES . DS . 'View' . DS . 'Helper' . DS;
            $suite->addTestFile($helperTestPath . 'JsHelperTest.php');
            $suite->addTestFile($helperTestPath . 'JqueryEngineHelperTest.php');
            $suite->addTestFile($helperTestPath . 'MootoolsEngineHelperTest.php');
            $suite->addTestFile($helperTestPath . 'PrototypeEngineHelperTest.php');
            return $suite;
        }
    }

``TestManger`` no longer has methods to add tests to group tests either. It is
recommended that you use the methods PHPUnit offers.


.. meta::
    :title lang=en: PHPUnit Migration Hints
    :keywords lang=en: free transition,vendor directory,static methods,teardown,test cases,pear,dependencies,test case,replacements,phpunit,migration,simpletest,cakephp,discover channel
