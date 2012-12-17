2.3 Migration Guide
###################

CakePHP 2.3 is a fully API compatible upgrade from 2.2.  This page outlines
the changes and improvements made in 2.3.

Constants
=========

An application can now easily define :php:const:`CACHE` and :php:const:`LOGS`,
as they are conditionally defined by CakePHP now.

Caching
=======

- FileEngine is always the default cache engine.  In the past a number of people
  had difficulty setting up and deploying APC correctly both in cli + web.
  Using files should make setting up CakePHP simpler for new developers.

- `Configure::write('Cache.viewPrefix', 'YOURPREFIX');` has been added to `core.php` to allow multiple domains/languages per application.
per setup.

Component
=========

AuthComponent
-------------
- A new property ``AuthComponent::$unauthorizedRedirect`` has been added.
  If set to false a ForbiddenException exception is thrown instead of redirecting
  user to referrer url.

- A new authenticate adapter has been added to support blowfish/bcrypt hashed
  passwords.  You can now use ``Blowfish`` in your ``$authenticate`` array to
  allow bcrypt passwords to be used.

PaginatorComponent
------------------

- PaginatorComponent now supports the ``findType`` option.  This can be used to
  specify what find method you want used for pagination.  This is a bit easier
  to manage and set than the 0'th index.

SecurityComponent
-----------------

- SecurityComponent now supports the ``unlockedActions`` option. This can be used to
  disable all security checks for any actions listed in this option.

RequestHandlerComponent
-----------------------

- :php:meth:`RequestHandlerComponent::viewClassMap()` has been added, which is used to map a type
  to view classname. You can add ``$settings['viewClassMap']`` for automatically setting
  the correct viewClass based on extension/content type.

CookieComponent
---------------

- :php:meth:`CookieComponent::check()` was added.  This method works the same as
  :php:meth:`CakeSession::check()` does.

Console
=======

- The ``server`` shell was added.  You can use this to start the PHP5.4
  webserver for your CakePHP application.
- Baking a new project now sets the application's cache prefix to the name of
  the application.

I18n
====

L10n
----

- ``nld`` is now the default locale for Dutch as specified by ISO 639-3 and ``dut`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/dut/` to `/Locale/nld/`).
- Albanian is now ``sqi``, Basque is now ``eus``, Chinese is now ``zho``, Tibetan is now ``bod``,
  Czech is now ``ces``, Farsi is now ``fas``, French is now ``fra``, Icelandic is now ``isl``,
  Macedonian is now ``mkd``, Malaysian is now ``msa``, Romanian is now ``ron``, Serbian is now ``srp``
  and Slovak is now ``slk``. The corresponding locale folders have to be adjusted, as well.

Core
====

Configure
---------

- :php:meth:`Configure::check()` was added.  This method works the same as
  :php:meth:`CakeSession::check()` does.

- :php:meth:`ConfigReaderInterface::dump()` was added. Please ensure any custom readers you have now
  implement a ``dump()`` method.

- The ``$key`` parameter of :php:meth:`IniReader::dump()` now supports keys like `PluginName.keyname`
  similar to ``PhpReader::dump()``.

Error
=====

Exceptions
----------

- CakeBaseException was added, which all core Exceptions now extend. The base exception
  class also introduces the ``responseHeader()`` method which can be called on created Exception instances
  to add headers for the response, as Exceptions don't reuse any response instance.

Model
=====

- Support for the biginteger type was added to all core datasources, and
  fixtures.
- Support for ``FULLTEXT`` indexes was added for the MySQL driver.


Models
------

- ``Model::find('list')`` now sets the ``recursive`` based on the max
  containment depth or recursive value.  When list is used with
  ContainableBehavior.
- ``Model::find('first')`` will now return an empty array when no records are found.

Validation
----------

- Missing validation methods will **always** trigger errors now instead of
  only in development mode.

Network
=======

SmtpTransport
-------------

- TLS/SSL support was added for SMTP connections.

CakeRequest
-----------

- :php:meth:`CakeRequest::onlyAllow()` was added.
- :php:meth:`CakeRequest::query()` was added.

CakeResponse
------------

- :php:meth:`CakeResponse::file()` was added.

CakeEmail
---------

- The ``contentDisposition`` option was added to
  :php:meth:`CakeEmail::attachments()`.  This allows you to disable the
  Content-Disposition header added to attached files.

HttpSocket
----------

- :php:class:`HttpSocket` now verifies SSL certificates by default. If you are
  using self-signed certificates or connecting through proxies you may need to
  use some of the new options to augment this behavior. See
  :ref:`http-socket-ssl-options` for more information.
- ``HttpResponse`` was renamed to ``HttpSocketResponse``.  This
  avoids a common issue with the http pecl extension. There is an
  ``HttpResponse`` class provided as well for compatibility reasons.

Routing
=======

Router
------

- Support for ``tel:``, ``sms:`` were added to :php:meth:`Router::url()`.

View
====

- MediaView is deprecated, and you can use new features in
  :php:class:`CakeResponse` to achieve the same results.
- Serialization in Json and Xml views has been moved to ``_serialize()``
- beforeRender and afterRender callbacks are now being called in Json and Xml
  views when using view templates.
- :php:meth:`View::fetch()` now has a ``$default`` argument. This argument can
  be used to provide a default value should a block be empty.
- :php:meth:`View::prepend()` has been added to allow prepending content to
  existing block.
- :php:class:`XmlView` now uses the ``_rootNode`` view variable to customize the
  top level XML node.
- :php:meth:`View::elementExists()` was added. You can use this method to check
  if elements exist before using them.
- :php:meth:`View::element()` had the ``ignoreMissing`` option added. You can
  use this to suppress the errors triggered by missing view elements.
- :php:meth:`View::startIfEmpty()` was added.


Helpers
=======

- New property ``Helper::$settings`` has been added for your helper setting. The
  ``$settings`` parameter of ``Helper::__construct()`` is merged with
  ``Helper::$settings``.

FormHelper
----------

- :php:meth:`FormHelper::select()` now accepts a list of values in the disabled
  attribute. Combined with ``'multiple' => 'checkbox'``, this allows you to
  provide a list of values you want disabled.
- :php:meth:`FormHelper::postLink()` now accepts a ``method`` key.  This allows
  you to create link forms using HTTP methods other than POST.
- When creating inputs with ``input()`` you can now set the ``errorMessage`` option to
  false. This will disable the error message display, but leave the error
  classnames intact.

HtmlHelper
----------

- :php:meth:`HtmlHelper::getCrumbList()` now has the ``separator``,
  ``firstClass`` and ``lastClass`` options.  These allow you to better control
  the HTML this method generates.

TextHelper
----------

- :php:meth:`TextHelper::tail()` was added to truncate text starting from the end.
- `ending` in :php:meth:`TextHelper::truncate()` is deprecated in favor of `ellipsis`

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` now has a new option ``currentTag`` to
  allow specifying extra tag for wrapping current page number.
- For methods: :php:meth:`PaginatorHelper::prev()` and :php:meth:`PaginatorHelper::next()` it
  is now possible to set the ``tag`` option to ``false`` to disable the wrapper.


Testing
=======

- A core fixture for the default ``cake_sessions`` table was added. You can use
  it by adding ``core.cake_sessions`` to your fixture list.
- :php:meth:`CakeTestCase::getMockForModel()` was added. This simplifies getting
  mock objects for models.

Utility
=======

CakeNumber
----------

- :php:meth:`CakeNumber::fromReadableSize()` was added.
- :php:meth:`CakeNumber::formatDelta()` was added.
- :php:meth:`CakeNumber::defaultCurrency()` was added.

Folder
------

- :php:meth:`Folder::copy()` and :php:meth:`Folder::move()` now support the
  ability to merge the target and source directories in addition to
  skip/overwrite.


String
------

- :php:meth:`String::tail()` was added to truncate text starting from the end.
- `ending` in :php:meth:`String::truncate()` is deprecated in favor of `ellipsis`

Debugger
--------

- :php:meth:`Debugger::exportVar()` now outputs private and protected properties
  in PHP >= 5.3.0.

Security
--------

- Support for `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_
  was added.  See the :php:class:`Security::hash()` documentation for more
  information on how to use bcrypt.

Validation
----------

- :php:meth:`Validation::fileSize()` was added.
