# 2.3 Migration Guide

CakePHP 2.3 is a fully API compatible upgrade from 2.2. This page outlines
the changes and improvements made in 2.3.

## Constants

An application can now easily define `CACHE` and `LOGS`,
as they are conditionally defined by CakePHP now.

## Caching

- FileEngine is always the default cache engine. In the past a number of people
  had difficulty setting up and deploying APC correctly both in CLI + web.
  Using files should make setting up CakePHP simpler for new developers.
- <span class="title-ref">Configure::write('Cache.viewPrefix', 'YOURPREFIX');</span> has been added to <span class="title-ref">core.php</span>
  to allow multiple domains/languages per setup.

## Component

### AuthComponent

- A new property `AuthComponent::$unauthorizedRedirect` has been added.
  - For default `true` value user is redirected to referrer URL upon authorization failure.
  - If set to a string or array user is redirected to that URL.
  - If set to false a ForbiddenException exception is thrown instead of redirecting.
- A new authenticate adapter has been added to support blowfish/bcrypt hashed
  passwords. You can now use `Blowfish` in your `$authenticate` array to
  allow bcrypt passwords to be used.
- `AuthComponent::redirect()` has been deprecated.
  Use `AuthComponent::redirectUrl()` instead.

### PaginatorComponent

- PaginatorComponent now supports the `findType` option. This can be used to
  specify what find method you want used for pagination. This is a bit easier
  to manage and set than the 0'th index.
- PaginatorComponent now throws a <span class="title-ref">NotFoundException</span> when trying to access a page
  which is out of range (i.e. requested page is greater than total page count).

### SecurityComponent

- SecurityComponent now supports the `unlockedActions` option. This can be used to
  disable all security checks for any actions listed in this option.

### RequestHandlerComponent

- `RequestHandlerComponent::viewClassMap()` has been added, which is used to map a type
  to view class name. You can add `$settings['viewClassMap']` for automatically setting
  the correct viewClass based on extension/content type.

### CookieComponent

- `CookieComponent::check()` was added. This method works the same as
  `CakeSession::check()` does.

## Console

- The `server` shell was added. You can use this to start the PHP5.4
  webserver for your CakePHP application.
- Baking a new project now sets the application's cache prefix to the name of
  the application.

## I18n

### L10n

- `nld` is now the default locale for Dutch as specified by ISO 639-3 and `dut` its alias.
  The locale folders have to be adjusted accordingly (from <span class="title-ref">/Locale/dut/</span> to <span class="title-ref">/Locale/nld/</span>).
- Albanian is now `sqi`, Basque is now `eus`, Chinese is now `zho`, Tibetan is now `bod`,
  Czech is now `ces`, Farsi is now `fas`, French is now `fra`, Icelandic is now `isl`,
  Macedonian is now `mkd`, Malaysian is now `msa`, Romanian is now `ron`, Serbian is now `srp`
  and Slovak is now `slk`. The corresponding locale folders have to be adjusted, as well.

## Core

### CakePlugin

- `CakePlugin::load()` can now take a new `ignoreMissing` option. Setting it to true will
  prevent file include errors when you try to load routes or bootstrap but they don't exist for a plugin.
  So essentially you can now use the following statement which will load all plugins and their routes and
  bootstrap for whatever plugin it can find::
  `CakePlugin::loadAll(array(array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)))`

### Configure

- `Configure::check()` was added. This method works the same as
  `CakeSession::check()` does.
- `ConfigReaderInterface::dump()` was added. Please ensure any custom readers you have now
  implement a `dump()` method.
- The `$key` parameter of `IniReader::dump()` now supports keys like <span class="title-ref">PluginName.keyname</span>
  similar to `PhpReader::dump()`.

## Error

### Exceptions

- CakeBaseException was added, which all core Exceptions now extend. The base exception
  class also introduces the `responseHeader()` method which can be called on created Exception instances
  to add headers for the response, as Exceptions don't reuse any response instance.

## Model

- Support for the biginteger type was added to all core datasources, and
  fixtures.
- Support for `FULLTEXT` indexes was added for the MySQL driver.

### Models

- `Model::find('list')` now sets the `recursive` based on the max
  containment depth or recursive value. When list is used with
  ContainableBehavior.
- `Model::find('first')` will now return an empty array when no records are found.

### Validation

- Missing validation methods will **always** trigger errors now instead of
  only in development mode.

## Network

### SmtpTransport

- TLS/SSL support was added for SMTP connections.

### CakeRequest

- `CakeRequest::onlyAllow()` was added.
- `CakeRequest::query()` was added.

### CakeResponse

- `CakeResponse::file()` was added.
- The content types <span class="title-ref">application/javascript</span>, <span class="title-ref">application/xml</span>,
  <span class="title-ref">application/rss+xml</span> now also send the application charset.

### CakeEmail

- The `contentDisposition` option was added to
  `CakeEmail::attachments()`. This allows you to disable the
  Content-Disposition header added to attached files.

### HttpSocket

- `HttpSocket` now verifies SSL certificates by default. If you are
  using self-signed certificates or connecting through proxies you may need to
  use some of the new options to augment this behavior. See
  [Http Socket Ssl Options](../core-utility-libraries/httpsocket#http-socket-ssl-options) for more information.
- `HttpResponse` was renamed to `HttpSocketResponse`. This
  avoids a common issue with the HTTP PECL extension. There is an
  `HttpResponse` class provided as well for compatibility reasons.

## Routing

### Router

- Support for `tel:`, `sms:` were added to `Router::url()`.

## View

- MediaView is deprecated, and you can use new features in
  `CakeResponse` to achieve the same results.
- Serialization in Json and Xml views has been moved to `_serialize()`
- beforeRender and afterRender callbacks are now being called in Json and Xml
  views when using view templates.
- `View::fetch()` now has a `$default` argument. This argument can
  be used to provide a default value should a block be empty.
- `View::prepend()` has been added to allow prepending content to
  existing block.
- `XmlView` now uses the `_rootNode` view variable to customize the
  top level XML node.
- `View::elementExists()` was added. You can use this method to check
  if elements exist before using them.
- `View::element()` had the `ignoreMissing` option added. You can
  use this to suppress the errors triggered by missing view elements.
- `View::startIfEmpty()` was added.

### Layout

- The doctype for layout files in the app folder and the bake templates in the
  cake package has been changed from XHTML to HTML5.

## Helpers

- New property `Helper::$settings` has been added for your helper setting. The
  `$settings` parameter of `Helper::__construct()` is merged with
  `Helper::$settings`.

### FormHelper

- `FormHelper::select()` now accepts a list of values in the disabled
  attribute. Combined with `'multiple' => 'checkbox'`, this allows you to
  provide a list of values you want disabled.
- `FormHelper::postLink()` now accepts a `method` key. This allows
  you to create link forms using HTTP methods other than POST.
- When creating inputs with `FormHelper::input()` you can now set the
  `errorMessage` option to false. This will disable the error message display,
  but leave the error class names intact.
- The FormHelper now also adds the HTML5 `required` attribute to your input
  elements based on validation rules for a field. If you have a "Cancel" button
  in your form which submits the form then you should add `'formnovalidate' => true`
  to your button options to prevent the triggering of validation in HTML. You
  can also prevent the validation triggering for the whole form by adding
  `'novalidate' => true` in your FormHelper::create() options.
- `FormHelper::input()` now generates input elements of type `tel`
  and `email` based on field names if `type` option is not specified.

### HtmlHelper

- `HtmlHelper::getCrumbList()` now has the `separator`,
  `firstClass` and `lastClass` options. These allow you to better control
  the HTML this method generates.

### TextHelper

- `TextHelper::tail()` was added to truncate text starting from the end.
- <span class="title-ref">ending</span> in `TextHelper::truncate()` is deprecated in favor of <span class="title-ref">ellipsis</span>

### PaginatorHelper

- `PaginatorHelper::numbers()` now has a new option `currentTag` to
  allow specifying extra tag for wrapping current page number.
- For methods: `PaginatorHelper::prev()` and `PaginatorHelper::next()` it
  is now possible to set the `tag` option to `false` to disable the wrapper.
  Also a new option <span class="title-ref">disabledTag</span> has been added for these two methods.

## Testing

- A core fixture for the default `cake_sessions` table was added. You can use
  it by adding `core.cake_sessions` to your fixture list.
- `CakeTestCase::getMockForModel()` was added. This simplifies getting
  mock objects for models.

## Utility

### CakeNumber

- `CakeNumber::fromReadableSize()` was added.
- `CakeNumber::formatDelta()` was added.
- `CakeNumber::defaultCurrency()` was added.

### Folder

- `Folder::copy()` and `Folder::move()` now support the
  ability to merge the target and source directories in addition to
  skip/overwrite.

### String

- `String::tail()` was added to truncate text starting from the end.
- <span class="title-ref">ending</span> in `String::truncate()` is deprecated in favor of <span class="title-ref">ellipsis</span>

### Debugger

- `Debugger::exportVar()` now outputs private and protected properties
  in PHP \>= 5.3.0.

### Security

- Support for [bcrypt](https://codahale.com/how-to-safely-store-a-password/)
  was added. See the `Security::hash()` documentation for more
  information on how to use bcrypt.

### Validation

- `Validation::fileSize()` was added.

### ObjectCollection

- `ObjectCollection::attached()` was deprecated in favor of the new
  method `ObjectCollection::loaded()`. This unifies the access to the
  ObjectCollection as load()/unload() already replaced attach()/detach().
