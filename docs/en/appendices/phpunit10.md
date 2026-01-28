# PHPUnit Migration Guide

This guide covers the PHPUnit version requirements and migration steps for CakePHP 5.x applications.

## Current Requirements

CakePHP 5.x requires **PHPUnit ^11.5.3 or ^12.1.3**. This means:

- PHPUnit 11.5.3+ requires **PHP 8.2** or later
- PHPUnit 12.1.3+ requires **PHP 8.3** or later

> [!NOTE]
> PHPUnit 10 is no longer supported in CakePHP 5.x. If you are still on PHPUnit 10,
> you must upgrade to PHPUnit 11 or 12.

## phpunit.xml adjustments

It is recommended to let PHPUnit update its configuration file via the following command:

    vendor/bin/phpunit --migrate-configuration

> [!NOTE]
> Make sure you verify your PHPUnit version via `vendor/bin/phpunit --version` before executing this command!

### Extension Configuration

CakePHP's fixture extension uses PHPUnit's event system. Your `phpunit.xml` should have:

``` xml
<extensions>
  <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
</extensions>
```

## Migrating from PHPUnit 10 to 11

### Annotations to Attributes

PHPUnit 11 deprecates docblock annotations and PHPUnit 12 removes them entirely.
You should migrate to PHP 8 attributes:

``` php
// Old way (deprecated in PHPUnit 11, removed in PHPUnit 12)
/**
 * @dataProvider myProvider
 */
public function testSomething($value): void
{
}

// New way (required for PHPUnit 12+)
use PHPUnit\Framework\Attributes\DataProvider;

#[DataProvider('myProvider')]
public function testSomething($value): void
{
}
```

Common attributes to use:

| Old Annotation | New Attribute |
|---------------|---------------|
| `@test` | `#[Test]` |
| `@dataProvider name` | `#[DataProvider('name')]` |
| `@depends methodName` | `#[Depends('methodName')]` |
| `@group name` | `#[Group('name')]` |
| `@covers ClassName` | `#[CoversClass(ClassName::class)]` |
| `@uses ClassName` | `#[UsesClass(ClassName::class)]` |

Remember to import the attribute classes from `PHPUnit\Framework\Attributes`.

### Data Providers Must Be Static

Data provider methods must be both `public` and `static`:

``` php
// Required format
public static function myProvider(): array
{
    return [
        ['value1'],
        ['value2'],
    ];
}
```

### Test Double Changes

PHPUnit 11 made changes to mock object creation:

- **Use `createStub()`** when you only need to stub return values and don't need
  to verify method calls
- **Use `createMock()`** when you need to set expectations and verify interactions

``` php
// For isolating dependencies (no expectations)
$stub = $this->createStub(SomeClass::class);
$stub->method('getValue')->willReturn('test');

// For testing object communication (with expectations)
$mock = $this->createMock(SomeClass::class);
$mock->expects($this->once())
    ->method('doSomething')
    ->with('argument');
```

> [!WARNING]
> Configuring expectations (like `expects()`) on objects created with `createStub()`
> triggers deprecation warnings in PHPUnit 11 and errors in PHPUnit 12.

## Migrating from PHPUnit 11 to 12

PHPUnit 12 requires **PHP 8.3** or later and enforces all deprecations from PHPUnit 11:

- Docblock annotations are completely removed
- Expectations on stubs are no longer allowed
- Abstract class and trait mocking methods are removed

Run your test suite with PHPUnit 11.5 and resolve all deprecation warnings before
upgrading to PHPUnit 12.

## CakePHP Test Utilities

### withConsecutive() Replacement

The removed `->withConsecutive()` method can be replaced using CakePHP's trait:

``` php
// Old way (removed in PHPUnit 10+)
->withConsecutive(['firstCallArg'], ['secondCallArg'])

// New way using CakePHP's trait
->with(
    ...self::withConsecutive(['firstCallArg'], ['secondCallArg'])
)
```

The static `self::withConsecutive()` method is provided via the `Cake\TestSuite\PHPUnitConsecutiveTrait`
which is automatically included in the base `Cake\TestSuite\TestCase` class.

## Upgrade Checklist

Before upgrading PHPUnit versions, ensure:

1. Your test suite runs without deprecation warnings on your current PHPUnit version
2. All data providers are `public static` methods
3. You're using attributes instead of annotations (required for PHPUnit 12)
4. Mock expectations are only used with `createMock()`, not `createStub()`
5. Run `vendor/bin/phpunit --migrate-configuration` after upgrading
