PHPUnit Migration Hints
#######################

Migrating your test cases to PHPUnit 3.5 will hopefully be a fairly pain free
transition. However, there are a few known differences between test cases under
PHPUnit and SimpleTest.

Installing PHPUnit
==================

Installing from PEAR (Recommended)
----------------------------------

PHPUnit recommends it be installed via the pear installer, to do so run the
following commands::

    pear channel-discover pear.phpunit.de
    pear channel-discover components.ez.no
    pear channel-discover pear.symfony-project.com

This has to be done only once. Now the PEAR Installer can be used to install
packages from the PHPUnit channel::

    pear install phpunit/PHPUnit

Installing manually
-------------------

In addition to pear, CakePHP also supports placing the PHPUnit directory inside
one of your vendors directories along with all its dependencies.

To do so, you need downlad a couple of projects and put in your vendors.
Instruction below::

    Go to http://github.com/sebastianbergmann/phpunit and download the version 3.5.5.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/PHPUnit to YOUR_PROJECT/app/vendors/PHPUnit
    
    Go to http://github.com/sebastianbergmann/phpunit-mock-objects and download the version 1.0.3.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/PHPUnit to YOUR_PROJECT/app/vendors/PHPUnit
    
    Go to http://github.com/sebastianbergmann/php-code-coverage and download the version 1.0.2.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/PHP to YOUR_PROJECT/app/vendors/PHP
    
    Go to http://github.com/sebastianbergmann/php-token-stream and download the version 1.0.1.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/PHP to YOUR_PROJECT/app/vendors/PHP
    
    Go to http://github.com/sebastianbergmann/php-timer and download the version 1.0.0.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/PHP to YOUR_PROJECT/app/vendors/PHP
    
    Go to http://github.com/sebastianbergmann/php-file-iterator and download the version 1.2.3.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/File to YOUR_PROJECT/app/vendors/File
    
    Go to http://github.com/sebastianbergmann/php-text-template and download the version 1.0.0.
    Extract the zip/tgz in a temporary directory and move sebastianbergmann*/Text to YOUR_PROJECT/app/vendors/Text

To automate this task, you can execute the below commands in *UNIX/cygwin/mingw.

::

    cd /YOUR_APPLICATION/vendors
    mkdir -p /tmp/cake_phpunit
    wget --no-check-certificate https://github.com/sebastianbergmann/phpunit/tarball/3.5.5 -O /tmp/cake_phpunit/phpunit.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/phpunit-mock-objects/tarball/1.0.3 -O /tmp/cake_phpunit/mock_objects.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/php-code-coverage/tarball/1.0.2 -O /tmp/cake_phpunit/code_coverage.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/php-token-stream/tarball/1.0.1 -O /tmp/cake_phpunit/token_stream.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/php-timer/tarball/1.0.0 -O /tmp/cake_phpunit/timer.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/php-file-iterator/tarball/1.2.3 -O /tmp/cake_phpunit/file_iterator.tgz
    wget --no-check-certificate https://github.com/sebastianbergmann/php-text-template/tarball/1.0.0 -O /tmp/cake_phpunit/text_template.tgz
    tar zxvf /tmp/cake_phpunit/phpunit.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/mock_objects.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/code_coverage.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/token_stream.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/timer.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/file_iterator.tgz -C /tmp/cake_phpunit/
    tar zxvf /tmp/cake_phpunit/text_template.tgz -C /tmp/cake_phpunit/
    mv /tmp/cake_phpunit/sebastianbergmann-phpunit-9243529/PHPUnit ./
    mv /tmp/cake_phpunit/sebastianbergmann-phpunit-mock-objects-3f46dd2/PHPUnit/* ./PHPUnit/
    mv /tmp/cake_phpunit/sebastianbergmann-php-code-coverage-c45df64/PHP ./
    mv /tmp/cake_phpunit/sebastianbergmann-php-token-stream-9d3c637/PHP/* ./PHP/
    mv /tmp/cake_phpunit/sebastianbergmann-php-timer-683d142/PHP/* ./PHP/
    mv /tmp/cake_phpunit/sebastianbergmann-php-file-iterator-67c4399/File ./
    mv /tmp/cake_phpunit/sebastianbergmann-php-text-template-c6d79d7/Text ./
    rm -rf /tmp/cake_phpunit

Differences between SimpleTest
==============================

There are a number of differences between SimpleTest and PHPUnit. The following
is an attempt to list the most frequently encountered differences.

startCase() and endCase()
-------------------------

These methods are no longer supported. Use the static methods PHPUnit provides.
setupBeforeClass and tearDownAfterClass.

start(), end(), before() and after()
------------------------------------

These methods were part of SimpleTest's test case initialization. start() and
end() have no replacements. You can use setUp() and tearDown() to replace
before() and after().

setUp() and tearDown()
----------------------

In the past the methods setUp, tearDown, startTest and endTest where supported,
and caused confusion as they looked almost as the same thing but in some cases
you should use one or the other.

In the new CakePHP test suite, it is recommended to use only setUp and tearDown.
The methods startTest and endTest are still supported but are deprecated.

getTests
--------

The method getTests is no longer supported. You can use filters instead. The web
test runner now takes an additional query string parameter that allows you to
specify a basic regular expression. This regular expression is used to restrict
the methods that are run.

::

    e.g. filter=myMethod

Only tests containing the string myMethod will be run on the next refresh. The
cake testsuite shell also supports a -filter option to filter methods.

Assertion methods
-----------------

Many of the assertion methods have slightly different names between PHPUnit and
SimpleTest. Where possible CakeTestCase provides a wrapper for the SimpleTest
method names. These compatibility wrappers will be removed in 2.1.0. The
following methods will be affected.

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
painful process but we hope the following tips help you in your migration. Its
highly recommended you familiarize yourself with the PHPUnit Mock object
documentation.

Replacing method calls
~~~~~~~~~~~~~~~~~~~~~~

The following regular expressions should help update some of your more
straightforward mock object expectations.

Replace expectOnce() no params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

expectOnce\(([^\)]+)\);
expects(\$this->once())->method($1);

Replace expectOnce() with params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

expectOnce\(([^,]+), array\((.+)\)\);
expects(\$this->once())->method($1)->with($2);

Replace expectAt()
^^^^^^^^^^^^^^^^^^

expectAt\((\d+), (.+), array\((.+)\)\);
expects(\$this->at($1))->method($2)->with($3);

Replace expectNever
^^^^^^^^^^^^^^^^^^^

expectNever\(([^\)]+)\);
expects(\$this->never())->method($1);

Replace setReturnValue

setReturnValue\(([^,]+), (.+)\);
expects(\$this->once())->method($1)->will($this->returnValue($2));

Replace setReturnValueAt

setReturnValueAt((\d+), ([^,]+), (.+));
expects(\$this->at($1))->method($2)->will($this->returnValue($3));

Group tests

Group tests have been removed as PHPUnit treats individual test cases and test suites as composable entities in the runner. You can place group tests inside the cases directory and use PHPUnit_Framework_TestSuite as a base class. An example Testsuite would look like:

<?php
class AllJavascriptHelpersTest extends PHPUnit_Framework_TestSuite {

/**
 * Suite define the tests for this suite
 *
 * @return void
 */
    public static function suite() {
        $suite = new PHPUnit_Framework_TestSuite('Js Helper and all Engine Helpers');

        $helperTestPath = CORE_TEST_CASES . DS . 'libs' . DS . 'view' . DS . 'helpers' . DS;
        $suite->addTestFile($helperTestPath . 'js.test.php');
        $suite->addTestFile($helperTestPath . 'jquery_engine.test.php');
        $suite->addTestFile($helperTestPath . 'mootools_engine.test.php');
        $suite->addTestFile($helperTestPath . 'prototype_engine.test.php');
        return $suite;
    }
}

TestManger no longer has methods to add tests to group tests either. It is recommended that you use the methods PHPUnit offers.

