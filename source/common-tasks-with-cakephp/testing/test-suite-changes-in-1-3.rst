4.7.13 Test Suite changes in 1.3
--------------------------------

The TestSuite harness for 1.3 was heavily refactored and partially
rebuilt. The number of constants and global functions have been
greatly reduced. Also the number of classes used by the test suite
has been reduced and refactored. You **must** update
``app/webroot/test.php`` to continue using the test suite. We hope
that this will be the last time that a change is required to
``app/webroot/test.php``.

**Removed Constants**


-  ``CAKE_TEST_OUTPUT``
-  ``RUN_TEST_LINK``
-  ``BASE``
-  ``CAKE_TEST_OUTPUT_TEXT``
-  ``CAKE_TEST_OUTPUT_HTML``

These constants have all been replaced with instance variables on
the reporters and the ability to switch reporters.

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
refactored/rewritten into ``CakeTestSuiteDispatcher`` and the
relevant reporter classes. This made the test suite more modular
and easier to extend.

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
increase readability of the messages. If you have other tools built
upon the testsuite console, be sure to update those tools with the
new formatting.

**CodeCoverageManager changes**


-  ``CodeCoverageManager::start()``'s functionality has been moved
   to ``CodeCoverageManager::init()``
-  ``CodeCoverageManager::start()`` now starts coverage generation.
-  ``CodeCoverageManager::stop()`` pauses collection
-  ``CodeCoverageManager::clear()`` stops and clears collected
   coverage reports.

4.7.13 Test Suite changes in 1.3
--------------------------------

The TestSuite harness for 1.3 was heavily refactored and partially
rebuilt. The number of constants and global functions have been
greatly reduced. Also the number of classes used by the test suite
has been reduced and refactored. You **must** update
``app/webroot/test.php`` to continue using the test suite. We hope
that this will be the last time that a change is required to
``app/webroot/test.php``.

**Removed Constants**


-  ``CAKE_TEST_OUTPUT``
-  ``RUN_TEST_LINK``
-  ``BASE``
-  ``CAKE_TEST_OUTPUT_TEXT``
-  ``CAKE_TEST_OUTPUT_HTML``

These constants have all been replaced with instance variables on
the reporters and the ability to switch reporters.

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
refactored/rewritten into ``CakeTestSuiteDispatcher`` and the
relevant reporter classes. This made the test suite more modular
and easier to extend.

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
increase readability of the messages. If you have other tools built
upon the testsuite console, be sure to update those tools with the
new formatting.

**CodeCoverageManager changes**


-  ``CodeCoverageManager::start()``'s functionality has been moved
   to ``CodeCoverageManager::init()``
-  ``CodeCoverageManager::start()`` now starts coverage generation.
-  ``CodeCoverageManager::stop()`` pauses collection
-  ``CodeCoverageManager::clear()`` stops and clears collected
   coverage reports.
