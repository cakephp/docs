2.5 Migration Guide
###################

CakePHP 2.5 is a fully API compatible upgrade from 2.4.  This page outlines
the changes and improvements made in 2.5.

Cache
=====

- A new adapter has been added for ``Memcached``. This new adapter uses
  ext/memcached instead of ext/memcache. It supports improved performance and
  shared persistent connections.
- The ``Memcache`` adapter is now deprecated in favor of ``Memcached``.
- :php:meth:`Cache::remember()` was added.
- :php:meth:`Cache::config()` now accepts ``database`` key when used with
  :php:class:`RedisEngine` in order to use non-default database number.

Console
=======

SchemaShell
-----------

- The ``create`` and ``update`` subcommands now have a ``yes`` option. The
  ``yes`` option allows you to skip the various interactive questions forcing
  a yes reply.

CompletionShell
---------------

- The :doc:`CompletionShell </console-and-shells/completion-shell>` was added.
  It aims to assist in the creation of autocompletion libraries for shell
  environments like bash, or zsh. No shell scripts are included in CakePHP, but
  the underlying tools are now available.

Controller
==========

AuthComponent
-------------

- ``loggedIn()`` is now deprecated and will be removed in 3.0.
- When using ``ajaxLogin``, AuthComponent will now return a ``403`` status code
  instead of a ``200`` when the user is un-authenticated.

CookieComponent
---------------

- :php:class:`CookieComponent` can use the new AES-256 encryption offered by
  :php:class:`Security`. You can enable this by calling
  :php:meth:`CookieComponent::type()` with 'aes'.

RequestHandlerComponent
-----------------------

- :php:meth:`RequestHandlerComponent::renderAs()` no longer sets ``Controller::$ext``.
  It caused problems when using a non default extension for views.

AclComponent
------------

- ACL node lookup failures are now logged directly. The call to
  ``trigger_error()`` has been removed.

Scaffold
--------
- Dynamic Scaffold is now deprecated and will be removed in 3.0.


Core
====

App
---

- ``App::pluginPath()`` has been deprecated. ``CakePlugin::path()`` should be used instead.


CakePlugin
----------

- :php:meth:`CakePlugin::loadAll()` now merges the defaults and plugin specific options as
  intuitively expected. See the test cases for details.

Event
=====

EventManager
------------

Events bound to the global manager are now fired in priority order with events
bound to a local manager. This can cause listeners to be fired in a different
order than they were in previous releases. Instead of all global listeners being triggered,
and then instance listeners being fired afterwards, the two sets of listeners
are combined into one list of listeners based on their priorities and then fired
as one set. Global listeners of a given priority are still fired before instance
listeners.

I18n
====

- The :php:class:`I18n` class has several new constants. These constants allow you
  to replace hardcoded integers with readable values. e.g.
  ``I18n::LC_MESSAGES``.


Model
=====

- Unsigned integers are now supported by datasources that provide them (MySQL).
  You can set the ``unsigned`` option to true in your schema/fixture files to
  start using this feature.
- Joins included in queries are now added **after** joins from associations are
  added. This makes it easier to join tables that depend on generated
  associations.

Network
=======

CakeEmail
---------

- Email addresses in CakeEmail are now validated with ``filter_var`` by default.
  This relaxes the email address rules allowing internal email addresses like
  ``root@localhost`` for example.
- You can now specify ``layout`` key in email config array without having to
  specify ``template`` key.

CakeRequest
-----------

- :php:meth:`CakeRequest::addDetector()` now supports ``options`` which
  accepts an array of valid options when creating param based detectors.

- ``CakeRequest::onlyAllow()`` has been deprecated. As replacement a new method named
  :php:meth:`CakeRequest::allowMethod()` has been added with identical functionality.
  The new method name is more intuitive and better conveys what the method does.

CakeSession
-----------

- Sessions will not be started if they are known to be empty. If the session
  cookie cannot be found, a session will not be started until a write operation
  is done.


Routing
=======

Router
------

- :php:meth:`Router::mapResources()` accepts ``connectOptions`` key in the
  ``$options`` argument. See :ref:`custom-rest-routing` for more details.

Utility
=======

Debugger
--------

- ``Debugger::dump()`` and ``Debugger::log()`` now support a ``$depth``
  parameter. This new parameter makes it easy to output more deeply nested
  object structures.

Hash
----

- :php:meth:`Hash::insert()` and :php:meth:`Hash::remove()` now support matcher
  expressions in their path selectors.

File
----

- :php:meth:`File::replaceText()` was added. This method allows you to easily
  replace text in a file using ``str_replace``.


Folder
------

- :php:meth:`Folder::addPathElement()` now accepts an array for the ``$element``
  parameter.

Security
--------

- :php:meth:`Security::encrypt()` and :php:meth:`Security::decrypt()` were
  added. These methods expose a very simple API to access AES-256 symmetric encryption.
  They should be used in favour of the ``cipher()`` and ``rijndael()`` methods.

Validation
----------

- The third param for :php:meth:`Validation::inList()` and :php:meth:`Validation::multiple()` has been
  modified from `$strict` to `$caseInsensitive`. `$strict` has been dropped as it was working incorrectly
  and could easily backfire.
  You can now set this param to true for case insensitive comparison. The default is false and
  will compare the value and list case sensitive as before.

- ``$mimeTypes`` parameter of :php:meth:`Validation::mimeType()` can also be a
  regex string. Also now when ``$mimeTypes`` is an array it's values are lowercased.


Logging
=======

FileLog
-------

- CakeLog does not auto-configure itself anymore. As a result log files will not be auto-created
  anymore if no stream is listening. Please make sure you got at least one default engine set up
  if you want to listen to all types and levels.

Error
=====

ExceptionRenderer
-----------------

The ExceptionRenderer now populates the error templates with "code", "message" and "url" variables.
"name" has been deprecated but is still available. This unifies the variables across all error templates.

Testing
=======

- Fixture files can now be placed in sub-directories. You can use fixtures in
  subdirectories by including the directory name after the ``.``. For example,
  `app.my_dir/article` will load ``App/Test/Fixture/my_dir/ArticleFixture``. It
  should be noted that the fixture directory will not be inflected or modified
  in any way.
- Fixtures can now set ``$canUseMemory`` to false to disable the memory storage
  engine being used in MySQL.

View
====

View
----

- ``$title_for_layout`` is deprecated. Use ``$this->fetch('title');`` and
  ``$this->assign('title', 'your-page-title');`` instead.
- :php:meth:`View::get()` now accepts a second argument to provide a default
  value.

FormHelper
----------

- FormHelper will now generate file inputs for ``binary`` field types now.
- :php:meth:`FormHelper::end()` had a second parameter added. This parameter
  lets you pass additional properties to the fields used for securing forms in
  conjunction with SecurityComponent.
- :php:meth:`FormHelper::end()` and :php:meth:`FormHelper::secure()` allow you
  to pass additional options that are turned into attributes on the generated
  hidden inputs. This is useful when you want to use the HTML5 ``form`` attribute.
- :php:meth:`FormHelper::postLink()` now allows you to buffer the generated form
  tag instead of returning it with the link. This helps avoiding nested form tags.

PaginationHelper
----------------

- :php:meth:`PaginatorHelper::sort()` now has a ``lock`` option to create pagination sort links with
  the default direction only.

ScaffoldView
------------

- Dynamic Scaffold is now deprecated and will be removed in 3.0.
