# Migrating Tests to PHPUnit 9.6

The original CakePHP 2.x ran its tests on PHPUnit 3.7. CakePHP 2 on the Piece of
Cake 2 fork uses PHPUnit 9.6, which supports PHP 8. Test cases written for
PHPUnit 3.7 need a few changes before they run. This page lists the changes you
are most likely to need. See [Testing](/development/testing) for how to write
and run tests.

## Installing and running PHPUnit

Install PHPUnit with Composer as a development dependency:

```bash
composer require --dev phpunit/phpunit:^9.6
```

The [pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton contains a
`phpunit.xml.dist` that loads `tests/bootstrap.php` and registers the
`CakeFixtureInjector` listener, which loads fixtures:

```xml
<listeners>
    <listener class="CakeFixtureInjector" file="./vendor/pieceofcake2/cakephp/src/Cake/TestSuite/Fixture/CakeFixtureInjector.php"/>
</listeners>
```

Run the tests with PHPUnit or with the test shell:

```bash
vendor/bin/phpunit
bin/cake test app Model/Post
```

## Class names

PHPUnit classes are namespaced. `CakeTestCase` and `CakeTestSuite` already
extend the new classes, so test cases that extend `CakeTestCase` only need
changes where they refer to PHPUnit classes directly:

| PHPUnit 3.7 | PHPUnit 9.6 |
|-------------|-------------|
| `PHPUnit_Framework_TestCase` | `PHPUnit\Framework\TestCase` |
| `PHPUnit_Framework_TestSuite` | `PHPUnit\Framework\TestSuite` |
| `PHPUnit_Framework_MockObject_MockObject` | `PHPUnit\Framework\MockObject\MockObject` |
| `PHPUnit_Framework_Error` | `PHPUnit\Framework\Error\Error` |

## Template methods need return types

`setUp()`, `tearDown()` and the other template methods must declare a `void`
return type, because `TestCase` declares them that way:

```php
public function setUp(): void
{
    parent::setUp();
    $this->Post = ClassRegistry::init('Post');
}

public function tearDown(): void
{
    unset($this->Post);
    parent::tearDown();
}

public static function setUpBeforeClass(): void
{
}
```

The same applies to `tearDownAfterClass()`, `assertPreConditions()` and
`assertPostConditions()`.

## Expecting exceptions

The `@expectedException` annotations and `setExpectedException()` were
removed. Declare the expected exception in the test method before the code that
throws it. This example is a `ControllerTestCase`:

```php
public function testViewMissingPost()
{
    $this->expectException(NotFoundException::class);
    $this->expectExceptionMessage('Invalid post');

    $this->testAction('/posts/view/999');
}
```

## Mock objects

`getMock()` was removed from PHPUnit. `CakeTestCase` still provides a
`getMock()` method so that existing tests keep working, but it is deprecated.
Use `createMock()` or `getMockBuilder()` in new tests:

```php
// PHPUnit 3.7
$Socket = $this->getMock('HttpSocket', ['get']);

// PHPUnit 9.6
$Socket = $this->getMockBuilder(HttpSocket::class)
    ->onlyMethods(['get'])
    ->getMock();

// Mock every method with the default behavior
$Socket = $this->createMock(HttpSocket::class);
```

`onlyMethods()` accepts only methods that exist in the class. Use `addMethods()`
for methods that do not exist yet. `getMockForModel()` of `CakeTestCase` still
works as before.

`staticExpects()` was removed, and `at()` is deprecated. Prefer expectations
that do not depend on the order of calls.

## Assertions

Several assertions were removed or renamed:

| PHPUnit 3.7 | PHPUnit 9.6 |
|-------------|-------------|
| `assertInternalType('array', $x)` | `assertIsArray($x)` (also `assertIsString()`, `assertIsInt()`, `assertIsBool()`, ...) |
| `assertContains('needle', $string)` | `assertStringContainsString('needle', $string)` or `assertTextContains()` |
| `assertNotContains('needle', $string)` | `assertStringNotContainsString('needle', $string)` or `assertTextNotContains()` |
| `assertRegExp()` / `assertNotRegExp()` | `assertMatchesRegularExpression()` / `assertDoesNotMatchRegularExpression()` |
| `assertEquals($expected, $actual, '', $delta)` | `assertEqualsWithDelta($expected, $actual, $delta)` |
| `assertEquals(..., $canonicalize = true)` | `assertEqualsCanonicalizing()` |
| `assertAttributeEquals()` and other `assertAttribute*()` | Test the public API instead of protected properties |
| `assertFileNotExists()` | `assertFileDoesNotExist()` |

`assertContains()` and `assertNotContains()` still work for arrays and
iterables.

The SimpleTest compatibility methods of `CakeTestCase`, such as
`assertEqual()`, `assertIdentical()`, `assertPattern()` and `assertIsA()`,
still exist but are deprecated. Use the standard PHPUnit assertions in new
tests.

## Test file locations

In the modern directory layout, test cases are in `tests/TestCase/` and
fixtures in `tests/Fixture/`. See [Testing](/development/testing) for details,
and [Migrating to the Modern Layout](/appendices/migrating-to-the-modern-layout)
if you are moving tests from `app/Test/`.
