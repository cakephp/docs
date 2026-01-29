# PHPUnit Upgrade

This guide covers the PHPUnit version requirements and migration steps for CakePHP 5.x applications.

## Current Requirements

CakePHP 5.x requires **PHPUnit ^11.5.3 or ^12.1.3**. This means:

- PHPUnit 11.5.3+ requires **PHP 8.2** or later
- PHPUnit 12.1.3+ requires **PHP 8.3** or later

> [!NOTE]
> PHPUnit 10 is no longer supported in CakePHP 5.x. If you are still on PHPUnit 10,
> you must upgrade to PHPUnit 11 or 12.

## phpunit.xml Adjustments

It is recommended to let PHPUnit update its configuration file via the following command:

    vendor/bin/phpunit --migrate-configuration

> [!NOTE]
> Run `vendor/bin/phpunit --version` to check your current PHPUnit version before executing migration commands.

With this command out of the way your `phpunit.xml` already has most of the recommended changes present.

### Extension Configuration

PHPUnit 10 removed the old hook system and introduced a new [Event system](https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner)
which requires the following code in your `phpunit.xml` to be adjusted from:

``` xml
<extensions>
  <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
</extensions>
```

to:

``` xml
<extensions>
  <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
</extensions>
```

## PHPUnit 9 to 10

### `->withConsecutive()` Removed

You can convert the removed `->withConsecutive()` method to a
working interim solution like you can see here:

``` php
->withConsecutive(['firstCallArg'], ['secondCallArg'])
```

should be converted to:

``` php
->with(
    ...self::withConsecutive(['firstCallArg'], ['secondCallArg']),
)
```

The static `self::withConsecutive()` method has been added via the `Cake\TestSuite\PHPUnitConsecutiveTrait`
to the base `Cake\TestSuite\TestCase` class so you don't have to manually add that trait to your TestCase classes.

### Data Providers Must Be Static

If your test cases leverage the data provider feature of PHPUnit then
you have to adjust your data providers to be static:

``` php
public function myProvider(): array
```

should be converted to:

``` php
public static function myProvider(): array
```

## PHPUnit 10 to 11

PHPUnit 11 requires PHP 8.2 or later.

### Annotations Deprecated

PHPUnit 11 deprecates annotations in docblocks. You should migrate to PHP 8 attributes:

``` php
// Before (deprecated)
/**
 * @dataProvider myProvider
 */
public function testSomething(): void

// After
#[DataProvider('myProvider')]
public function testSomething(): void
```

Common attribute replacements:

| Annotation | Attribute |
| ---------- | --------- |
| `@dataProvider` | `#[DataProvider('methodName')]` |
| `@depends` | `#[Depends('methodName')]` |
| `@group` | `#[Group('name')]` |
| `@covers` | `#[CoversClass(ClassName::class)]` |
| `@test` | `#[Test]` |

Remember to import the attribute classes from `PHPUnit\Framework\Attributes`.

### Test Doubles for Abstract Classes Deprecated

Methods for creating mock objects for abstract classes and traits are hard-deprecated. Testing traits in isolation from the classes that use them is discouraged.

### Stub Expectations Deprecated

Configuring expectations on an object created with `createStub()` triggers a deprecation warning:

``` php
// Avoid - will warn in PHPUnit 11
$stub = $this->createStub(SomeClass::class);
$stub->expects($this->once())->method('foo');

// Use createMock() instead when you need expectations
$mock = $this->createMock(SomeClass::class);
$mock->expects($this->once())->method('foo');
```

### Test Class Naming

Test class names must match their file names. A test in `FooTest.php` must have a class named `FooTest`.

## PHPUnit 11 to 12

PHPUnit 12 requires PHP 8.3 or later.

### Annotations Removed

Support for docblock annotations has been removed. All tests must use PHP 8 attributes.

### Test Doubles for Abstract Classes Removed

Methods for creating mock objects for abstract classes and traits have been removed entirely.

### Stub Expectations Removed

Configuring expectations on objects created with `createStub()` no longer works. Use `createMock()` for test doubles that need expectation configuration.

## Using Rector for Automated Migration

[Rector](https://getrector.com/) can automate many of these changes:

``` bash
composer require --dev rector/rector rector/rector-phpunit

# Create rector.php config
vendor/bin/rector init

# Run rector
vendor/bin/rector process tests/
```

Configure Rector with PHPUnit rulesets to handle data provider static conversion, annotation to attribute migration, and other changes automatically.

## Upgrade Checklist

Before upgrading PHPUnit versions, ensure:

1. Your test suite runs without deprecation warnings on your current PHPUnit version
2. All data providers are `public static` methods
3. You are using attributes instead of annotations (required for PHPUnit 12)
4. Mock expectations only use `createMock()`, not `createStub()`
5. Run `vendor/bin/phpunit --migrate-configuration` after upgrading
