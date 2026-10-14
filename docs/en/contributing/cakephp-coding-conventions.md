# Coding Standards

CakePHP developers will use the following coding standards. It is the CakePHP
coding standard of CakePHP 5, which is based on
[PSR-12](https://www.php-fig.org/psr/psr-12/), with a few exclusions for code
that has no namespaces and uses the CakePHP 2 naming conventions. The code
samples in this book follow it as well.

It is recommended that others developing applications and plugins follow the
same standard: your code then looks like the framework code, and a later move
to CakePHP 5 needs fewer formatting changes.

The standard is checked automatically by
[PHP_CodeSniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer) with the
`CakePHP` ruleset of
[cakephp/cakephp-codesniffer](https://github.com/cakephp/cakephp-codesniffer)
5.x and a project `phpcs.xml` file. Where this page and the result of `phpcs`
disagree, `phpcs` is authoritative. Contributions to the `pieceofcake2/*`
repositories must pass `vendor/bin/phpcs` with no errors and no warnings (see
[Coding Standard](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#coding-standard)
in the contribution guide). If you maintain code written for the
original CakePHP 2 standard, see
[Differences from the Original CakePHP 2 Standard](#differences-from-the-original-cakephp-2-standard).

## Checking Your Code

The framework and the [pieceofcake2/app](https://pieceofcake2.github.io/app/)
application skeleton install the sniffer as a development dependency. To add it to an
existing application, run:

``` bash
composer require --dev cakephp/cakephp-codesniffer:^5.0
```

Composer asks whether to allow the `dealerdirect/phpcodesniffer-composer-installer`
plugin, which registers the CakePHP ruleset with PHP_CodeSniffer. Allow it, or
add it to `composer.json` yourself:

``` json
{
    "config": {
        "allow-plugins": {
            "dealerdirect/phpcodesniffer-composer-installer": true
        }
    }
}
```

Then add a `phpcs.xml` file to the root of your project (see
[A phpcs.xml for your application](#a-phpcs-xml-for-your-application)).
PHP_CodeSniffer reads it automatically, so you can run the checks without any
arguments:

``` bash
# Report violations
vendor/bin/phpcs

# Fix the violations that can be fixed automatically
vendor/bin/phpcbf

# Check only part of the code
vendor/bin/phpcs src/Controller
```

Neither the framework nor the skeleton defines Composer scripts such as
`cs-check` or `cs-fix`; call `phpcs` and `phpcbf` directly. The framework's
continuous integration runs
`vendor/bin/phpcs` on every pull request, so run it before you submit your
changes.

`phpcbf` fixes most whitespace, array syntax, brace placement and quoting
issues. Rules such as missing doc comments, method names or unused variables
have to be fixed by hand.

## Language

All code and comments should be written in English.

## Tests

Every change needs tests that pass before it is merged; a bug fix needs a test
that fails without the fix. See
[Working on a Change](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#working-on-a-change)
in the contribution guide.

## Indentation and Whitespace

Indent with four spaces. Tabs are not allowed:

``` php
$booleanVariable = true;
$stringVariable = 'moose';
if ($booleanVariable) {
    echo 'Boolean value is true';
    if ($stringVariable === 'moose') {
        echo 'We have encountered a moose';
    }
}
```

Files use Unix line endings (LF), end with a single newline, and have no
trailing whitespace. The framework and the application skeleton ship an
`.editorconfig` file with these settings, which most editors pick up.

The sniffer also checks blank lines:

- Do not use more than one blank line in a row.
- Do not put a blank line right after the opening brace or right before the
  closing brace of a class or method.
- Separate methods with one blank line.
- Put a blank line before a `return` statement, unless it is the first
  statement of its block.

## Line Length

Line length is not checked: the framework's `phpcs.xml` excludes the
`Generic.Files.LineLength` sniff because much of the CakePHP 2 code base has
long lines. Keep lines readable anyway; around 120 characters is a good limit
for new code.

## Arrays

Use the short array syntax. Multi-line arrays have one element per line and a
trailing comma after the last element. Single-line arrays have no trailing
comma:

``` php
$users = ['John', 'Hans', 'Arne'];

$options = [
    'conditions' => ['Article.published' => true],
    'order' => ['Article.created' => 'DESC'],
    'limit' => 20,
];
```

Use `[$a, $b] = $pair;` instead of `list($a, $b) = $pair;`.

## Function Calls

Functions are called without a space between the function name and the
opening parenthesis, with one space after each comma, and with one space on
both sides of the assignment operator:

``` php
$var = foo($bar, $bar2, $bar3);
```

When a call does not fit on one line, put each argument on its own line. The
opening parenthesis is the last thing on the first line, the closing
parenthesis is on a line by itself, and the last argument has a trailing comma:

``` php
$matches = array_intersect_key(
    $this->_listeners,
    array_flip(
        preg_grep($matchPattern, array_keys($this->_listeners), 0),
    ),
);
```

instead of:

``` php
$matches = array_intersect_key($this->_listeners,
                array_flip(preg_grep($matchPattern,
                    array_keys($this->_listeners), 0)));
```

Always use parentheses when you create an object, even without arguments:

``` php
$dispatcher = new Dispatcher();
```

## Control Structures

Control structures are for example `if`, `for`, `foreach`, `while` and
`switch`. Below is an example with `if`:

``` php
if ($expr1 || $expr2) {
    // action 1
} elseif (!$expr3 && $expr4) {
    // action 2
} else {
    // default action
}
```

- Put one space between the keyword and the opening parenthesis, and one space
  between the closing parenthesis and the opening brace.
- Always use curly braces, even when they are not needed. They make the code
  easier to read and lead to fewer logic errors.
- The opening brace goes on the same line as the control structure. The
  closing brace goes on its own line, at the same indentation level as the
  control structure. The statements inside the braces start on a new line and
  are indented one more level.
- Use `elseif`, not `else if`.
- Use `&&` and `||`, not `and` and `or`.
- Do not call `count()` or a similar function in the condition of a `for`
  loop. Assign the result to a variable first.

``` php
// wrong: no braces, statement on the same line
if ($expr) statement();

// wrong: no braces
if ($expr)
    statement();

// good
if ($expr) {
    statement();
}

// wrong: count() in the loop condition
for ($i = 0; $i < count($items); $i++) {
}

// good
$count = count($items);
for ($i = 0; $i < $count; $i++) {
}
```

Assignments inside a condition are allowed, and are common in the CakePHP 2
code base:

``` php
while ($row = $result->fetch()) {
    // ...
}
```

Keep them to simple cases like this one. If an assignment in a condition could
be mistaken for a comparison, assign the value on a separate line.

### Ternary Operator

Ternary operators are permissible when the entire ternary operation fits on
one line. Longer ternaries should be split into `if`/`else` statements.
Ternary operators should never be nested.

Use the null coalescing operator when you check whether a value is set, and the
short ternary operator when you fall back to another value. The sniffer reports
the long forms:

``` php
// good
$variable = $options['variable'] ?? true;
$title = $title ?: 'Untitled';

// reported by the sniffer
$variable = isset($options['variable']) ? $options['variable'] : true;
$title = $title ? $title : 'Untitled';

// nested ternaries are bad
$variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;
```

### Template Files

In template files (`.ctp` files in `templates/`), use the alternative syntax
for control structures. It is easier to read in templates that mix PHP and
HTML. The control structures can be in a larger PHP block, or in separate PHP
tags:

``` php
<?php
if ($isAdmin):
    echo '<p>You are the admin user.</p>';
endif;
?>
<p>The following is also acceptable:</p>
<?php if ($isAdmin): ?>
    <p>You are the admin user.</p>
<?php endif; ?>
```

A closing PHP tag (`?>`) is allowed at the end of `.ctp` files. The
`phpcs.xml` of the application skeleton does not check `templates/`, so these
rules are not enforced there.

## Comparison

Always be as strict as possible. If a non-strict comparison is deliberate,
add a comment so that it is not mistaken for a mistake.

To check whether a variable is null, use a strict check:

``` php
if ($value === null) {
    // ...
}
```

Put the value you compare against on the right side. "Yoda" comparisons are
reported by the sniffer:

``` php
// not allowed
if (null === $this->foo()) {
    // ...
}

// good
if ($this->foo() === null) {
    // ...
}
```

## Class and Method Definitions

The opening brace of a class or method goes on its own line. Declare the
visibility of every property, method and class constant, and do not use the
`var` keyword:

``` php
class Article extends AppModel
{
    /**
     * Number of articles on a page.
     *
     * @var int
     */
    public const PER_PAGE = 20;

    /**
     * Default find options.
     *
     * @var array
     */
    protected $_defaults = [];

    /**
     * Connects to the given data source.
     *
     * @param array|string $dns Connection settings or a DSN string.
     * @param bool $persistent Whether to use a persistent connection.
     * @return bool
     */
    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!$dnsInfo || !$dnsInfo['phpType']) {
            return $this->addError();
        }

        return true;
    }
}
```

Parameters with a default value should be placed last in the function
definition. Try to make your functions return something, at least `true` or
`false`, so it can be determined whether the call was successful.

Closures and arrow functions follow the same rules. Write arrow functions
without a space after `fn`:

``` php
$callback = function ($item) use ($prefix) {
    return $prefix . $item;
};
$ids = array_map(fn($row) => $row['Article']['id'], $rows);
```

### Type Declarations

CakePHP 2 APIs do not use native parameter, property or return type
declarations, so they are not required. The framework's `phpcs.xml` excludes the
type hint rules of the CakePHP 5 standard, and `declare(strict_types=1)` is not
required either. Describe the types in the DocBlock instead.

The application `phpcs.xml` excludes only the parameter and property type
rules. A method therefore needs either a native return type or a `@return`
annotation, and test methods in `tests/TestCase/` need native return types,
which PHPUnit 9 requires for methods such as `setUp(): void` anyway.

You can still type hint arguments that expect objects or arrays:

``` php
/**
 * Some method description.
 *
 * @param Model $Model The model to use.
 * @param array $array Some array value.
 * @param bool $boolean Some boolean value.
 * @return void
 */
public function foo(Model $Model, array $array, $boolean)
{
}
```

Here `$Model` must be an instance of `Model` and `$array` must be an `array`.

If you want to allow `$array` to also be an instance of `ArrayObject`, do not
type hint it as `array`, because `array` accepts only the primitive type:

``` php
/**
 * Some method description.
 *
 * @param ArrayObject|array $array Some array value.
 * @return void
 */
public function foo($array)
{
}
```

If you override a framework method, keep its signature. Adding native types to
an overriding method causes fatal errors when the parent method has none.

## Method Chaining

Method chaining should have multiple methods spread across separate lines,
indented by four spaces:

``` php
$email->from('foo@example.com')
    ->to('bar@example.com')
    ->subject('A great message')
    ->send();
```

## DocBlocks

Every method and function needs a DocBlock, except in test cases. All comment
blocks, with the exception of the first block in a file, should be preceded by
a newline.

Inside a DocBlock, put one blank line between the description and the tags,
and no blank lines between the tags. DocBlocks for properties must use the
multi-line form; one-line comments such as `/** @var string */` are reported.

### File Header DocBlock

The framework files start with a file header DocBlock like this one:

``` php
<?php
/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @since         X.Y.Z
 * @license       https://www.opensource.org/licenses/mit-license.php MIT License
 */
```

The included [phpDocumentor](https://phpdoc.org) tags are:

- [@copyright](https://docs.phpdoc.org/guide/references/phpdoc/tags/copyright.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@license](https://docs.phpdoc.org/guide/references/phpdoc/tags/license.html)

### Class DocBlocks

Class DocBlocks should look like this:

``` php
/**
 * Short description of the class.
 *
 * Long description of class.
 * Can use multiple lines.
 *
 * @property Comment $Comment
 * @deprecated 2.12.0 Use Bar instead.
 * @see Bar
 * @link https://pieceofcake2.github.io/docs/foo
 */
class Foo
{
}
```

Class DocBlocks may contain the following
[phpDocumentor](https://phpdoc.org) tags:

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  Using the `@deprecated <version> <description>` format, where `version` and
  `description` are mandatory.
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@property](https://docs.phpdoc.org/guide/references/phpdoc/tags/property.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@uses](https://docs.phpdoc.org/guide/references/phpdoc/tags/uses.html)

`@property` is useful in CakePHP 2 to document the models, components and
helpers that are attached to a class at runtime, so that IDEs and static
analysis tools know about them.

### Property DocBlocks

Property DocBlocks should look like this:

``` php
/**
 * Description of property.
 *
 * @var string|null
 * @deprecated 2.12.0 Use $_bla instead.
 * @see Bar::$_bla
 */
protected $_bar = null;
```

Property DocBlocks may contain the following
[phpDocumentor](https://phpdoc.org) tags:

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  Using the `@deprecated <version> <description>` format, where `version` and
  `description` are mandatory.
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@var](https://docs.phpdoc.org/guide/references/phpdoc/tags/var.html)

### Method/Function DocBlocks

Method and function DocBlocks should look like this:

``` php
/**
 * Short description of the method.
 *
 * Long description of method.
 * Can use multiple lines.
 *
 * @param string $param1 First parameter.
 * @param array|null $param2 Second parameter.
 * @return array An array of cakes.
 * @throws Exception If something goes wrong.
 * @link https://pieceofcake2.github.io/docs/foo#bar
 * @deprecated 2.12.0 Use Bar::baz instead.
 * @see Bar::baz
 */
public function bar($param1, $param2 = null)
{
}
```

Method and function DocBlocks may contain the following
[phpDocumentor](https://phpdoc.org) tags:

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  Using the `@deprecated <version> <description>` format, where `version` and
  `description` are mandatory.
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@param](https://docs.phpdoc.org/guide/references/phpdoc/tags/param.html)
- [@return](https://docs.phpdoc.org/guide/references/phpdoc/tags/return.html)
- [@throws](https://docs.phpdoc.org/guide/references/phpdoc/tags/throws.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@uses](https://docs.phpdoc.org/guide/references/phpdoc/tags/uses.html)

If a method only overrides a parent method without changing its documentation,
you can write `@inheritDoc` (without braces) as the only content of the
DocBlock.

### Variable Types

Variable types for use in DocBlocks:

| Type     | Description |
|----------|-------------|
| mixed    | A variable with undefined (or multiple) type. |
| int      | Integer type variable (whole number). |
| float    | Float type (point number). |
| bool     | Logical type (true or false). |
| string   | String type (any value in `" "` or `' '`). |
| null     | Null type. Usually used in conjunction with another type. |
| array    | Array type. |
| object   | Object type. A specific class name should be used if possible. |
| resource | Resource type (returned by for example `fopen()`). |
| callable | Callable function. |

Use the short type names (`int`, `bool`), not `integer` or `boolean`.
Remember that when you specify the type as mixed, you should indicate whether
it is unknown, or what the possible types are.

You can also combine types using the pipe character. Put `null` last:

    int|bool
    string|null

For more than two types it is usually best to just use `mixed`.

When returning the object itself, e.g. for chaining, use `$this`:

``` php
/**
 * Foo function.
 *
 * @return $this
 */
public function foo()
{
    return $this;
}
```

## Strings

Use single quotes for strings that contain no variables or escape sequences.
Use double quotes only when you need interpolation or escape sequences:

``` php
$name = 'Article';
$message = "Saved {$count} articles\n";
```

## Including Files

`include`, `require`, `include_once` and `require_once` are written without
parentheses:

``` php
// wrong: parentheses
require_once('ClassFileName.php');
require_once ($class);

// good: no parentheses
require_once 'ClassFileName.php';
require_once $class;
```

In most cases you do not need to include class files at all. Classes are
loaded by Composer's autoloader, or with `App::uses()` for classes that the
autoloader does not know about, such as plugin classes. When you include files
with classes or libraries, always use `require_once`.

## PHP Tags

Always use long tags (`<?php`) instead of short tags (`<?`). The short echo
tag `<?=` may be used in templates.

## Error Suppression

Avoid the `@` error suppression operator. The sniffer reports it as a
warning. Check for the error condition instead, or handle the error.

## Naming Convention

### Functions

Write all functions in camelBack:

``` php
function longFunctionName()
{
}
```

### Classes

Class names should be written in CamelCase, for example:

``` php
class ExampleClass
{
}
```

### Variables

Variable names should be as descriptive as possible, but also as short as
possible. Normal variables should start with a lowercase letter, and should be
written in camelBack in case of multiple words. Variables referencing objects
should in some way associate to the class the variable is an object of.
CakePHP 2 also uses variables named after a class, such as `$Model` for a model
instance, and the sniffer allows them:

``` php
$user = 'John';
$users = ['John', 'Hans', 'Arne'];

$dispatcher = new Dispatcher();
$Model = ClassRegistry::init('Article');
```

### Member Visibility

Use PHP's `private` and `protected` keywords for methods and variables.
Additionally, protected method or variable names start with a single
underscore (`_`). Public method names must not start with an underscore. For
example:

``` php
class A
{
    protected $_iAmAProtectedVariable;

    protected function _iAmAProtectedMethod()
    {
        /* ... */
    }
}
```

Private methods or variable names start with a double underscore (`__`). For
example:

``` php
class A
{
    private $__iAmAPrivateVariable;

    private function __iAmAPrivateMethod()
    {
        /* ... */
    }
}
```

Try to avoid private methods or variables, though, in favor of protected ones.
The latter can be accessed or modified by subclasses, whereas private ones
prevent extension or re-use. Private visibility also makes testing much more
difficult.

Controller actions with a routing prefix, such as `admin_index()`, are not in
camelBack. The `phpcs.xml` files of the framework and the application skeleton allow
these names in controllers.

### Example Addresses

For all example URL and mail addresses use "example.com", "example.org" and
"example.net", for example:

- Email: <someone@example.com>
- WWW: `https://www.example.com`
- FTP: `ftp://ftp.example.com`

The "example.com" domain name has been reserved for this (see
[RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)) and is recommended for use
in documentation or as examples.

### Files

File names which do not contain classes should be lowercased and underscored,
for example:

    long_file_name.php

### Casting

For casting we use:

| Type     | Description |
|----------|-------------|
| (bool)   | Cast to boolean. |
| (int)    | Cast to integer. |
| (float)  | Cast to float. |
| (string) | Cast to string. |
| (array)  | Cast to array. |
| (object) | Cast to object. |

Write the cast without a space before the value, and use the short forms:
`(int)$var`, not `(integer) $var`. Use `(int)$var` instead of `intval($var)`
and `(float)$var` instead of `floatval($var)` when applicable.

### Constants

Constants should be defined in capital letters:

``` php
define('CONSTANT', 1);
```

If a constant name consists of multiple words, they should be separated by an
underscore character, for example:

``` php
define('LONG_NAMED_CONSTANT', 2);
```

Class constants must declare their visibility:

``` php
class Article extends AppModel
{
    public const STATUS_PUBLISHED = 1;
}
```

## Other Rules

The CakePHP ruleset contains more checks than this page can list. Some that
often come up in CakePHP 2 code:

- `sizeof()` is reported; use `count()`.
- Unused local variables and duplicated assignments are reported.
- Useless parentheses, for example around a single variable, are reported.
- Deprecated PHP functions are reported.

Run `vendor/bin/phpcs -s` to see the name of the sniff that reported a
violation. You can look up the sniff in the
[CakePHP ruleset](https://github.com/cakephp/cakephp-codesniffer/blob/5.x/CakePHP/ruleset.xml).

## The Exclusions Used for CakePHP 2

The CakePHP 5 standard assumes namespaced code with native type declarations.
The framework's
[`phpcs.xml`](https://github.com/pieceofcake2/cakephp/blob/2.x/phpcs.xml)
therefore excludes these rules:

| Rules | Why |
|-------|-----|
| `PSR1.Classes.ClassDeclaration.MissingNamespace`, `PSR1.Files.SideEffects.FoundWithSymbols`, `Squiz.Classes.ClassFileName.NoMatch` | Classes live in the global namespace and may be loaded with `App::uses()`, which PSR-1 sees as a side effect. File names follow CakePHP 2 conventions. |
| `SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace`, `SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName` | Without namespaces, `use` statements and fully qualified names in annotations are not needed. |
| `SlevomatCodingStandard.TypeHints` | CakePHP 2 APIs do not use native type declarations. |
| `Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps`, `Zend.NamingConventions.ValidVariableName.PublicHasUnderscore`, `Zend.NamingConventions.ValidVariableName.PublicVarHasUnderscore` | CakePHP 2 uses names such as `$Model` and `$_locale`, and public properties with an underscore prefix. |
| `SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition` | `while ($row = $result->fetch())` is a common CakePHP 2 pattern. |
| `CakePHP.Commenting.FunctionComment.SpacingAfter`, `Generic.Files.LineLength` | Blank lines after doc comments are allowed, and line length is not checked. |

It also adds `Generic.Formatting.MultipleStatementAlignment` with a
`maxPadding` of 1, so that `=` signs of consecutive assignments are not padded
with extra spaces for alignment, and relaxes some rules only for specific paths. For example,
non-camelBack method names are allowed in controllers and shells (for
prefixed actions such as `admin_index()`), several classes per file and
missing doc comments are allowed in tests, and the `DATABASE_CONFIG` class name
is allowed in `database.php`.

## A phpcs.xml for Your Application

The [pieceofcake2/app](https://pieceofcake2.github.io/app/) skeleton ships the
following `phpcs.xml` for the modern directory layout. It uses the same
exclusions as the framework, except that it excludes only the parameter and
property type rules and requires native return types in `tests/TestCase/`:

``` xml
<?xml version="1.0"?>
<ruleset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/squizlabs/php_codesniffer/phpcs.xsd">
    <config name="php_version" value="80000"/>

    <arg value="ps"/>
    <arg name="colors"/>
    <arg name="parallel" value="100"/>
    <arg name="extensions" value="php,php.default"/>

    <file>./config</file>
    <file>./src</file>
    <file>./tests</file>

    <rule ref="CakePHP">
        <!-- ===== Namespace and Class Rules ===== -->
        <!-- CakePHP2 uses App::uses() instead of namespaces -->
        <exclude name="PSR1.Classes.ClassDeclaration.MissingNamespace"/>
        <!-- CakePHP2 uses App::uses() which PSR1 considers side effects -->
        <exclude name="PSR1.Files.SideEffects.FoundWithSymbols"/>
        <!-- Don't enforce filename matching class name (CakePHP2 has specific conventions) -->
        <exclude name="Squiz.Classes.ClassFileName.NoMatch"/>

        <!-- ===== Namespace/Import Rules ===== -->
        <!-- Allow fully qualified class names without namespace (CakePHP2 uses global namespace) -->
        <exclude name="SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace"/>
        <!-- Don't require fully qualified class names in annotations (CakePHP2 has no namespaces) -->
        <exclude name="SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName"/>

        <!-- ===== Type Hints Rules ===== -->
        <!-- Exclude type hints rules as CakePHP2 doesn't support PHP 7+ type declarations -->
        <exclude name="SlevomatCodingStandard.TypeHints.PropertyTypeHint"/>
        <exclude name="SlevomatCodingStandard.TypeHints.ParameterTypeHint"/>
        <exclude name="SlevomatCodingStandard.TypeHints.DeclareStrictTypes.DeclareStrictTypesMissing"/>

        <!-- ===== Variable Naming Rules ===== -->
        <!-- Allow CakePHP2 style variable naming ($Model, $LinkModel, $_locale, etc.) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps"/>
        <!-- Allow underscore in public properties (CakePHP2 convention) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.PublicHasUnderscore"/>
        <!-- Allow double underscore public properties (CakePHP2 internal convention) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.PublicVarHasUnderscore"/>

        <!-- ===== Control Structure Rules ===== -->
        <!-- Allow assignment in conditions (common pattern in CakePHP2: while ($row = $result->fetch())) -->
        <exclude name="SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition"/>

        <!-- ===== Formatting Rules ===== -->
        <!-- Allow blank lines after function comments (CakePHP2 style) -->
        <exclude name="CakePHP.Commenting.FunctionComment.SpacingAfter"/>
        <!-- Exclude line length checks for CakePHP2 -->
        <exclude name="Generic.Files.LineLength"/>
    </rule>

    <!-- Include additional whitespace checking rule -->
    <rule ref="Generic.Formatting.MultipleStatementAlignment">
        <properties>
            <property name="maxPadding" value="1"/>
        </properties>
    </rule>

    <rule ref="CakePHP.Commenting.FunctionComment.Missing">
        <exclude-pattern>tests/TestCase/*</exclude-pattern>
    </rule>

    <!-- Allow multiple classes in test files only (CakePHP2 test pattern) -->
    <rule ref="PSR1.Classes.ClassDeclaration.MultipleClasses">
        <exclude-pattern>tests/TestCase/*</exclude-pattern>
    </rule>

    <!-- Allow non-camelCase method names in Controllers (CakePHP2 action naming convention) -->
    <rule ref="PSR1.Methods.CamelCapsMethodName.NotCamelCaps">
        <exclude-pattern>src/Controller/*</exclude-pattern>
        <exclude-pattern>src/Console/Command/*</exclude-pattern>
        <exclude-pattern>src/Model/Behavior/*</exclude-pattern>
    </rule>

    <!-- Require return type hints for Test/Case only -->
    <rule ref="SlevomatCodingStandard.TypeHints.ReturnTypeHint.MissingNativeTypeHint">
        <include-pattern>tests/TestCase/*</include-pattern>
    </rule>

    <rule ref="Squiz.Classes.ValidClassName.NotPascalCase">
        <exclude-pattern>config/database.php</exclude-pattern>
    </rule>

    <rule ref="Squiz.PHP.NonExecutableCode.Unreachable">
        <exclude-pattern>config/acl.ini.php</exclude-pattern>
    </rule>
</ruleset>
```

If your application uses the legacy `app/` layout, change the `<file>`
entries and the patterns to the legacy paths, for example `./app/Config`,
`./app/Controller`, `./app/Model` and `./app/Test` instead of `./config`,
`./src` and `./tests`, and `app/Controller/*` and `app/Test/Case/*` instead of
`src/Controller/*` and `tests/TestCase/*`.

To introduce the standard into an existing application, run `phpcbf` once
and commit the result separately from other changes, then fix the remaining
violations step by step. You can check a single directory at a time by passing
its path to `phpcs`.

## Differences from the Original CakePHP 2 Standard

If you maintain code written for the original CakePHP 2 standard, these are
the changes you will notice most:

| Original CakePHP 2 standard | Current standard |
|-----------------------------|------------------|
| Indentation with one tab | Indentation with four spaces |
| `array()` | `[]` |
| Opening brace of classes and methods on the same line | Opening brace of classes and methods on its own line |
| No trailing commas | Trailing comma in multi-line arrays, calls and declarations |
| 100 characters soft and 120 characters hard line limit | Line length is not checked |
| No assignments in conditions | Assignments in conditions are allowed |
| `isset($a) ? $a : $b` | `$a ?? $b` |
| `$a ? $a : $b` | `$a ?: $b` |
| `else if` discouraged | `else if` not allowed; use `elseif` |
| Visibility of class constants optional | Visibility required on constants, properties and methods |
| `/** @var string */` allowed on properties | Multi-line property DocBlocks |
