# PHPUnit 10 Upgrade

With CakePHP 5 the minimum PHPUnit version has changed from `^8.5 || ^9.3` to `^10.1`. This introduces a few breaking changes from PHPUnit as well as from CakePHP's side.

## phpunit.xml adjustments

It is recommended to let PHPUnit update its configuration file via the following command:

    vendor/bin/phpunit --migrate-configuration

> [!NOTE]
> Make sure you are already on PHPUnit 10 via `vendor/bin/phpunit --version` before executing this command!

With this command out of the way your `phpunit.xml` already has most of the recommended changes present.

### New event system

PHPUnit 10 removed the old hook system and introduced a new [Event system](https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner)
which requires the following code in your `phpunit.xml` to be adjusted from:

``` php
<extensions>
  <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
</extensions>
```

to:

``` php
<extensions>
  <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
</extensions>
```

## `->withConsecutive()` has been removed

You can convert the removed `->withConsecutive()` method to a
working interim solution like you can see here:

``` php
->withConsecutive(['firstCallArg'], ['secondCallArg'])
```

should be converted to:

``` php
->with(
    ...self::withConsecutive(['firstCallArg'], ['secondCallArg'])
)
```

the static `self::withConsecutive()` method has been added via the `Cake\TestSuite\PHPUnitConsecutiveTrait`
to the base `Cake\TestSuite\TestCase` class so you don't have to manually add that trait to your Testcase classes.

## data providers have to be static

If your testcases leverage the data provider feature of PHPUnit then
you have to adjust your data providers to be static:

``` php
public function myProvider(): array
```

should be converted to:

``` text
public static function myProvider(): array
```
