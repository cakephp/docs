# Coding Standards

::: pieceofcake2
This page is specific to the **pieceofcake2 fork** and is not part of the
original CakePHP 2.x documentation. It replaces the rules described in
[Coding Standards](/contributing/cakephp-coding-conventions) for code in the
fork.
:::

## The standard used by the fork

pieceofcake2/cakephp checks its code with
[cakephp/cakephp-codesniffer](https://github.com/cakephp/cakephp-codesniffer)
**^5.0**, the coding standard of CakePHP 5 (based on PSR-12), instead of the
1.x sniffer used by the original 2.x branch
([PR #8](https://github.com/pieceofcake2/cakephp/pull/8)). The whole code base
was reformatted with `phpcbf` and modernized to PHP 8 syntax
([PR #7](https://github.com/pieceofcake2/cakephp/pull/7)).

Because CakePHP 2 has no namespaces, uses `App::uses()`, and has its own naming
conventions, some rules of the CakePHP 5 standard are excluded in the fork's
[`phpcs.xml`](https://github.com/pieceofcake2/cakephp/blob/2.x/phpcs.xml):

| Group | Excluded rules | Why |
|-------|----------------|-----|
| Namespace and class | `PSR1.Classes.ClassDeclaration.MissingNamespace`, `PSR1.Files.SideEffects.FoundWithSymbols`, `Squiz.Classes.ClassFileName.NoMatch` | Classes live in the global namespace and are loaded with `App::uses()`, which PSR-1 sees as a side effect. File names follow CakePHP 2 conventions. |
| Namespace / import | `SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace`, `SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName` | Without namespaces, `use` imports and fully qualified names in annotations make no sense. |
| Type hints | `SlevomatCodingStandard.TypeHints` | CakePHP 2 APIs do not use native parameter, property and return type declarations. |
| Variable naming | `Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps`, `...PublicHasUnderscore`, `...PublicVarHasUnderscore` | CakePHP 2 uses `$Model`, `$LinkModel`, `$_locale` style names and underscore-prefixed properties. |
| Control structures | `SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition` | Patterns such as `while ($row = $result->fetch())` are common in CakePHP 2. |
| Formatting | `CakePHP.Commenting.FunctionComment.SpacingAfter`, `Generic.Files.LineLength` | Blank lines after doc comments are allowed, and line length is not checked. |

In addition, `phpcs.xml`:

- adds `Generic.Formatting.MultipleStatementAlignment` with `maxPadding` 1;
- relaxes some rules only for specific paths, for example
  `PSR1.Methods.CamelCapsMethodName.NotCamelCaps` for controllers and shells
  (action names such as `admin_index`), `PSR1.Classes.ClassDeclaration.MultipleClasses`
  and missing doc comments in tests, `Squiz.Classes.ValidClassName.NotPascalCase`
  for `database.php` (`DATABASE_CONFIG`), and deprecated functions
  (`libxml_disable_entity_loader`, `mcrypt_*`, `strftime`) in the few core files
  that still need them.

## Differences from the original 2.x conventions

The [original conventions](/contributing/cakephp-coding-conventions) describe
the CakePHP 2.x style. Code formatted with the fork's standard differs mainly in
these points:

| Original CakePHP 2.x | pieceofcake2 fork (CakePHP 5 sniffer) |
|----------------------|----------------------------------------|
| Indentation with one tab | Indentation with 4 spaces |
| `[]` | Short array syntax `[]` |
| Opening brace of a method on the same line | Opening brace of classes and methods on its own line (PSR-12) |
| 100 characters soft / 120 hard line limit | Line length is not checked (`Generic.Files.LineLength` excluded) |
| No inline assignment in control structures | Assignment in conditions is allowed |

For example, a method in the fork looks like this:

```php
public function connection($dns, $persistent = false)
{
    if (is_array($dns)) {
        $dnsInfo = $dns;
    } else {
        $dnsInfo = BD::parseDNS($dns);
    }

    return $dnsInfo;
}
```

The framework keeps the CakePHP 2 naming conventions (CamelCase classes,
camelBack methods, `_` prefix for protected members). The other rules of the
original page remain a useful guide; where they conflict with the sniffer, the
result of `phpcs` with the fork's `phpcs.xml` is authoritative.

## Running the checks

The fork's `composer.json` has no `cs-check` / `cs-fix` scripts; run
PHP_CodeSniffer directly. It picks up `phpcs.xml` from the project root:

```bash
# Check
vendor/bin/phpcs

# Fix automatically where possible
vendor/bin/phpcbf
```

You can pass a path to check part of the code, e.g. `vendor/bin/phpcs src/Controller`.

## Recommended setup for applications

Applications are not required to follow the fork's standard, but using the same
one keeps your code consistent with the framework and makes a later move to
CakePHP 5 easier. Install the sniffer as a development dependency:

```bash
composer require --dev cakephp/cakephp-codesniffer:^5.0
```

Allow the installer plugin in `composer.json` (as in
[pieceofcake2/app](https://github.com/pieceofcake2/app)):

```json
{
    "config": {
        "allow-plugins": {
            "dealerdirect/phpcodesniffer-composer-installer": true
        }
    }
}
```

Then add a `phpcs.xml` to the project root. This is the one shipped with
pieceofcake2/app (modern layout). For the legacy layout, change the `<file>`
entries and exclude patterns to `app/Config`, `app/Controller`, `app/Test/Case`,
etc.

```xml
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

Compared to the framework's `phpcs.xml`, the application version excludes only
the property and parameter type hint rules (and `declare(strict_types=1)`), and
requires native return types in test cases (`tests/TestCase/*`), where PHPUnit
9.6 methods such as `setUp(): void` need them anyway.
