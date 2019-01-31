4.0 Migration Guide
###################

CakePHP 4.0 contains breaking changes, and is not backwards compatible with 3.x
releases. Before attempting to upgrade to 4.0, first upgrade to 3.6 and resolve
all deprecation warnings.

To upgrade to 4.0.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

Deprecated Features Removed
===========================

All methods, properties and functionality that was emitting deprecation warnings
as of 3.6 have been removed.

Authentication functionality has been split into standalone plugins
`Authentication <https://github.com/cakephp/authentication>`__ and `Authorization <https://github.com/cakephp/authorization>`__.
The former RssHelper can be found as standalone `Feed plugin <https://github.com/dereuromark/cakephp-feed>`__ with similar functionality.

Breaking Changes
================

In addition to the removal of deprecated features there have been breaking
changes made:

Controller
----------

* ``Cake\Controller\Controller::referer()`` now defaults the ``local``
  parameter to true, instead of false. This makes using referer headers safer as
  they will be constrained to your application's domain by default.
* Controller method name matching when invoking actions is now case sensitive.
  For example if your controller method is ``forgetPassword()`` then using string
  ``forgotpassword`` in URL will not match as action name.

Database
--------

* ``BoolType`` no longer marshalls non-empty string values to ``true``. Instead
  non-boolean string values are converted to ``null``.


Http
----

* The default value of ``ServerRequest::getParam()`` when a parameter is missing
  is now ``null`` and not ``false``.
* ``Cake\Http\Client\Request::body()`` has been removed. Use ``getBody()`` or
  ``withBody()`` instead.
* ``Cake\Http\Client\Response::isOk()`` now returns ``true`` for all 2xx and 3xx
  response codes.
* ``Cake\Http\Cookie\Cookie::getExpiresTimestamp()`` now returns an integer.
  This makes it type match the one used in ``setcookie()``.
* ``Cake\Http\ServerRequest::referer()`` now returns ``null`` when the current
  request has no referer. Previously it would return ``/``.
* The Session cookie name is no longer set to ``CAKEPHP`` by default. Instead
  the default cookie name defined in your ``php.ini`` file is used. You can use
  the ``Session.cookie`` configuration option to set the cookie name.

Router
------

* ``RouteBuilder::resources()`` now inflects resource names to dasherized form
  instead of underscored by default in URLs. You can retain underscored
  inflection by using ``'inflect' => 'underscore'`` in ``$options`` argument.
* ``Router::plugin()`` and ``Router::prefix()`` now use plugin/prefix name in
  dasherized form in URL by default. You can retain underscored from (or any other
  custom path) by using ``'path'`` key in ``$options`` argument.

Database
--------

* Type mapping classes in ``Cake\Database\TypeInterface`` no longer inherit from
  ``Type``, and leverage ``BatchCastingInterface`` features now.
* ``Cake\Database\Type::map()`` only functions as a setter now. You must use
  ``Type::getMap()`` to inspect type instances.
* Date, Time, Timestamp, and Datetime column types now return immutable time
  objects by default now.

View
----

* Templates have been moved from ``src/Template/`` to ``templates/`` folder on
  app and plugin root. Special templates folder like ``Cell``, ``Element``,
  ``Email`` and ``Plugin`` have be renamed to lower case ``cell``, ``element``,
  ``email`` and ``plugin`` respectively.
* The template extension has also been changed from ``.ctp`` to ``.php``.
* ``Cake\View\View`` will re-render views if ``render()`` is called multiple
  times instead of returning ``null``.
* ``Cake\View\Helper\PaginatorHelper::hasPage()`` has had its arguments
  reversed. This makes it consistent with other paginator methods where the
  'model' is the second argument.
* ``Cake\View\Helper\UrlHelper::build()`` no longer accepts a boolean for the
  second parameter. You must use ``['fullBase' => true]`` instead.
* Constants ``View::NAME_ELEMENT`` and ``View::NAME_LAYOUT`` have been removed.
  You can use ``View::TYPE_ELEMENT`` and ``View::TYPE_LAYOUT``.

Mailer
------
* ``Email::set()`` has been removed. Use ``Email::setViewVars()`` instead.

Utility
-------
* ``Cake\Utility\Xml::fromArray()`` now requires an array for the ``$options``
  parameter.
* ``Cake\Filesystem\Folder::copy($to, array $options = [])`` and
  ``Cake\Filesystem\Folder::move($to, array $options = [])`` have now the target
  path extracted as first argument.
* The ``readFile`` option of ``Xml::build()`` is no longer true by default.
  Instead you must enable ``readFile`` to read local files.

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` and all implementations of this method have
  been removed. This method was a no-op in most cache drivers and was only used
  in file caching.

Miscellaneous
-------------

* Locale files have been moved from ``src/Locale`` to ``resources/locales``.
* The ``cacert.pem`` file that was bundled in CakePHP has been replaced by
  a dependency on `composer/ca-bundle <https://packagist.org/packages/composer/ca-bundle>_`.


New Features
============

Filesystem
----------

* This package is deprecated and will be removed in 5.0. It has a number of
  design problems and fixing this infrequently used package does not seem worth
  the effort when there are a great selection of packages already.

Error
-----

* If an error is raised by a controller action in a prefixed route,
  ``ErrorController`` will attempt to use a prefixed error template if one is
  available. This behavior is only applied when ``debug`` is off.

Http
----

* CakePHP now supports the `PSR-15: HTTP Server Request Handlers <https://www.php-fig.org/psr/psr-15/>_` specification.
  As a consequence the middlewares now implement ``Psr\Http\Server\MiddlewareInterface``.
  CakePHP 3.x style invokable double pass middlewares are still supported for backwards compatibility.
* ``Cake\Http\Client`` now follows `PSR-18: HTTP Client <https://www.php-fig.org/psr/psr-18/>_` specifications.
* ``Cake\Http\Client\Response::isSuccess()`` was added. This method returns true
  if the response status code is 2xx.

Mailer
------

* Email message generation responsibility has now been transferred to ``Cake\Mailer\Renderer``.
  This is mainly an architectural change and doesn't impact how
  ``Email`` class is used. The only difference is that you now need to use ``Email::setViewVars()``
  instead of ``Email::set()`` to set template variables.

View
----

* ``FormHelper`` now generates HTML5 validation messages for fields marked as
  required in an entity's ORM table class. This feature can be toggled with the
  ``autoSetCustomValidity`` class configuration option.


