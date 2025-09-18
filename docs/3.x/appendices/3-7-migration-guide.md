# 3.7 Migration Guide

CakePHP 3.7 is an API compatible upgrade from 3.6. This page outlines the
changes and improvements made in 3.7.

To upgrade to 3.7.x run the following composer command:

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.7.*"
```

## Deprecations

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function until 4.0.0 after which they will be removed.

- `Cake\Form\Form::errors()` is deprecated. Use `getErrors()` instead.
- `Cake\Http\Client\Response::$headers` is deprecated. Use `getHeaders()` or
  `getHeaderLine()` instead.
- `Cake\Http\Client\Response::$body` is deprecated. Use `getStringBody()`
  instead.
- `Cake\Http\Client\Response::$json` is deprecated. Use `getJson()`
  instead.
- `Cake\Http\Client\Response::$xml` is deprecated. Use `getXml()`
  instead.
- `Cake\Http\Client\Response::$cookies` is deprecated. Use `getCookies()`
  instead.
- `Cake\Http\Client\Response::$code` is deprecated. Use `getStatusCode()`
  instead.
- `Cake\Http\Client\Response::body()` is deprecated. Use `getStringBody()`
  instead.
- `Cake\ORM\Association::className()` has been deprecated. Use
  `getClassName()` and `setClassName()` instead.
- Using `Cake\Database\Query::join()` to read information is deprecated.
  Instead use `Query::clause('join')`.
- Using `Cake\Database\Query::from()` to read information is deprecated.
  Instead use `Query::clause('from')`.
- `Cake\Database\Connection::logQueries()` is deprecated. Use
  `enableQueryLogging()` and `isQueryLoggingEnabled()` instead.
- The string/array parameter set for `Cake\Http\Response::withCookie()` is
  deprecated. Instead you need to pass in `Cake\Http\Cookie\Cookie` instances.
- `Cake\Validation\Validation::cc()` has been renamed to `creditCard()`.
- `Cake\View\ViewVarsTrait::viewOptions()` is deprecated. Use
  `viewBuilder()->setOptions()` instead.
- `Cake\View\View::$request` is protected now. Use
  `View::getRequest()/setRequest()` to access a View's request instance in
  other contexts.
- `Cake\View\View::$response` is protected now. Use
  `View::getResponse()/setResponse()` to access a View's response instance in
  other contexts.
- `Cake\View\View::$templatePath` is protected now. Use
  `getTemplatePath()/setTemplatePath()` instead.
- `Cake\View\View::$template` is protected now. Use
  `getTemplate()/setTemplate()` instead.
- `Cake\View\View::$layout` is protected now. Use `getLayout()/setLayout()`
  instead.
- `Cake\View\View::$layoutPath` is protected now. Use
  `getLayoutPath()/setLayoutPath()` instead.
- `Cake\View\View::$autoLayout` is protected now. Use
  `enableAutoLayout()/isAutoLayoutEnabled()` instead.
- `Cake\View\View::$theme` is protected now. Use
  `getTheme()/setTheme()` instead.
- `Cake\View\View::$subDir` is protected now. Use `getSubDir()/setSubDir()` instead.
- `Cake\View\View::$plugin` is protected now. Use `getPlugin()/setPlugin()`
  instead.
- `Cake\View\View::$name` is protected now. Use `getName()/setName()`
  instead.
- `Cake\View\View::$elementCache` is protected now. Use
  `getElementCache()/setElementCache()` instead.
- `Cake\View\View::$Blocks` is protected now. Use public methods on View to
  interact with blocks.
- `Cake\View\View:$helpers` is protected now. Use `helpers()` to interact
  with the HelperRegistry instead.
- `Cake\View\View::$uuids` is deprecated and will be removed in 4.0
- `Cake\View\View::uuid()` is deprecated and will be removed in 4.0
- `Cake\View\Cell::$template` is protected now. Use
  `viewBuilder()->getTemplate()/setTemplate()` instead.
- `Cake\View\Cell::$plugin` is protected now. Use
  `viewBuilder()->getPlugin()/setPlugin()` instead.
- `Cake\View\Cell::$helpers` is protected now. Use
  `viewBuilder()->getHelpers()/setHelpers()` instead.
- `Cake\View\Cell::$action` is protected now.
- `Cake\View\Cell::$args` is protected now.
- `Cake\View\Cell::$View` is protected now.
- `Cake\View\Cell::$request` is protected now.
- `Cake\View\Cell::$response` is protected now.
- `Cake\View\ViewVarsTrait::$viewVars` is deprecated. This public property
  will be removed in 4.0.0. Use `set()` instead.
- `Cake\Filesystem\Folder::normalizePath()` is deprecated. You should use
  `correctSlashFor()` instead.
- `Cake\Mailer\Email::setConfigTransport()` is deprecated. Use
  `Cake\Mailer\TransportFactory::setConfig()` instead.
- `Cake\Mailer\Email::getConfigTransport()` is deprecated. Use
  `Cake\Mailer\TransportFactory::getConfig()` instead.
- `Cake\Mailer\Email::configTransport()` is deprecated. Use
  `Cake\Mailer\TransportFactory::getConfig()/setConfig()` instead.
- `Cake\Mailer\Email::configuredTransport()` is deprecated. Use
  `Cake\Mailer\TransportFactory::configured()` instead.
- `Cake\Mailer\Email::dropTransport()` is deprecated. Use
  `Cake\Mailer\TransportFactory::drop()` instead.
- Following view related methods of `Cake\Mailer\Email` have been deprecated:
  `setTemplate()`, `getTemplate()`, `setLayout()`, `getLayout()`,
  `setTheme()`, `getTheme()`, `setHelpers()`, `getHelpers()`.
  Use the same methods through Email's view builder instead. For e.g.
  `$email->viewBuilder()->getTemplate()`.
- `Cake\Mailer\Mailer::layout()` is deprecated.
  Use `$mailer->viewBuilder()->setLayout()` instead.
- `Helper::$theme` is removed. Use `View::getTheme()` instead.
- `Helper::$plugin` is removed. Use `View::getPlugin()` instead.
- `Helper::$fieldset` and `Helper::$tags` are deprecated as they are unused.
- `Helper::$helpers` is now protected and should not be accessed from outside
  a helper class.
- `Helper::$request` is removed.
  Use `View::getRequest()`, `View::setRequest()` instead.
- `Cake\Core\Plugin::load()` and `loadAll()` are deprecated. Instead you
  should use `Application::addPlugin()`.
- `Cake\Core\Plugin::unload()` is deprecated. Use
  `Plugin::getCollection()->remove()` or `clear()` instead.
- The following properties of `Cake\Error\ExceptionRender` are now protected:
  `$error`, `$controller`, `$template` and `$method`.
- Using underscored fixtures names in `TestCase::$fixtures` is deprecated.
  Use CamelCased names instead. For e.g. `app.FooBar`, `plugin.MyPlugin.FooBar`.

## Soft Deprecations

The following methods, properties and features have been deprecated but will not
be removed until 5.0.0:

- `Cake\TestSuite\ConsoleIntegrationTestCase` is deprecated. You should
  include `Cake\TestSuite\ConsoleIntegrationTestTrait` into your test case
  class instead.

## Behavior Changes

- `Cake\Database\Type\IntegerType` will now raise an exception when values
  are not numeric when preparing SQL statements and converting database results
  to PHP types.
- `Cake\Database\Statement\StatementDecorator::fetchAll()` now returns an
  empty array instead of `false` when no result is found.
- `Cake\Database\Statement\BufferedStatement` no longer inherits from
  `StatementDecorator` and no longer implements the `IteratorAggregate`
  interface. Instead it directly implements the `Iterator` interface to better
  support using statements with collections.
- When marshalling data from the request into entities, the ORM will now convert
  non-scalar data into `null` for boolean, integer, float, and decimal types.
- `ExceptionRenderer` will now **always** call handler methods for custom
  application exception classes. Previously, custom exception class handler
  methods would only be invoked in debug mode.
- `Router::url()` will now default the `_method` key to `GET` when
  generating URLs with `Router::url()`.

## New Features

### Cache

- The `ArrayEngine` was added. This engine provides an ephemeral in memory
  cache implementation. It is ideal for test suites or long running processes
  where you don't want persistent cache storage.

### Database

- `Cake\Database\FunctionsBuilder::rand()` was added.

### Datasource

- `Paginator` will now match unprefixed `sort` values in the query string to
  the primary model if there also exists a matching model prefixed default sort
  field. As an example, if your controller defines a default sort of
  `['Users.name' => 'desc']` you can now use either `Users.name` or `name`
  as your sort key.

### Error

- `ExceptionRenderer` will now look for prefixed error controllers when
  handling exceptions. This allows you to define custom error controller logic
  for each routing prefix in your application.
- `ErrorHandlerMiddleware` will now include previous exceptions in logging.

### Filesystem

- `Cake\Filesystem\Folder::normalizeFullPath()` was added.

### Form

- `Cake\Form\Form::setData()` was added. This method makes defining default
  values for forms simpler.
- `Cake\Form\Form::getData()` was added.

### Http

- `Cake\Http\ServerRequest::setTrustedProxies()` was added.
- `Cake\Http\Client` will now default to use a Curl based adapter if the
  `curl` extension is installed.
- New constants have been added to the `SecurityHeadersMiddleware`. The new
  constants are used to build the components of HTTP headers.

### Mailer

- `Cake\Mailer\TransportFactory` and `Cake\Mailer\TransportRegistry` were
  added. This class extracts transport creation out of Email, allowing Email to
  become simpler in the future.

### ORM

- `Cake\ORM\EntityTrait::hasErrors()` was added. This method can be used to
  check whether or not an entity has errors more efficiently than
  `getErrors()` does.
- Updating has many association data now respects `_ids`. This makes patching
  has many associations work the same as creating new entities, and creates
  consistency with belongs to many associations.

### Shell

- `cake i18n extract` has a new `--relative-paths` option that makes path
  comments in POT files relative to the application root directory instead of
  absolute paths.
- `cake i18n extract` has a new `--marker-error` option that enables
  reporting of translation functions that use non-static values as comments in
  POT files.

### TestSuite

- New assertion methods were added to `IntegrationTestCase`:
  - `assertResponseNotEquals()`
  - `assertHeaderNotContains()`
  - `assertRedirectNotContains()`
  - `assertFlashElement()`
  - `assertFlashElementAt()`
- The custom assertions provided by `IntegrationTestCase` and
  `ConsoleIntegrationTestCase` are now implemented through constraint classes.
- `TestCase::loadPlugins()`, `removePlugins()` and `clearPlugins()` were
  added to make working with dynamically loaded plugins easier now that
  `Plugin::load()` and `Plugin::unload()` are deprecated.
- `getMockForModel()` now supports `null` for the `$methods` parameter.
  This allows you to create mocks that still execute the original code. This
  aligns the behavior with how PHPUnit mock objects work.
- Added `EmailTrait` to help facilitate testing emails.
- The default messages for integration assertions have been improved to provide
  more context from the exception that was raised if possible.

### Utility

- `Cake\Utility\Text::getTransliterator()` was added.
- `Cake\Utility\Text::setTransliterator()` was added.
- `Cake\Utility\Xml::loadHtml()` was added.

### Validation

- `Cake\Validation\Validation::iban()` was added for validating international
  bank account numbers.
- `Cake\Validation\Validator::allowEmptyString()`, `allowEmptyArray()`,
  `allowEmptyDate()`, `allowEmptyTime()`, `allowEmptyDateTime()`, and
  `allowEmptyFile()` were added. These new methods replace `allowEmpty()`
  and give you more control over what a field should consider empty.

### View

- `FormHelper` now supports a `confirmJs` template variable which allows the
  javascript snippet generated for confirmation boxes to be customized.
- `FormHelper` now has a `autoSetCustomValidity` option for setting HTML5
  validity messages from custom validation messages. See: [Html5 Validity Messages](../views/helpers/form#html5-validity-messages)
- `ViewBuilder` had `setVar()`, `setVars()`, `getVar()`, `getVars()` and
  `hasVar()` added. These methods will replace the public `viewVars`
  property defined in `ViewVarsTrait`.
- `PaginatorHelper` will now match unprefixed sort keys to model prefixed ones
  on the default model. This allow smooth operation with the changes made in
  `Cake\Datasource\Paginator`
- `FormHelper` will now read `maxLength` validator rules and use them to
  automatically define the `maxlength` attribute on HTML inputs if a max
  length is not provided in the input options.
