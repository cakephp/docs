3.4 Migration Guide
###################

CakePHP 3.4 is an API compatible upgrade from 3.3. This page outlines the
changes and improvements made in 3.4.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
elements will continue to function until 4.0.0 after which they will be removed.

* The public properties on ``Cake\Event\Event`` are deprecated, new methods have
  been added to read/write the relevant properties.
* Several properties on ``Cake\Network\Request`` have been deprecated:

  * ``Request::$params`` is deprecated. Use ``Request::param()`` instead.
  * ``Request::$data`` is deprecated. Use ``Request::data()`` instead.
  * ``Request::$query`` is deprecated. Use ``Request::query()`` instead.
  * ``Request::$cookies`` is deprecated. Use ``Request::cookie()`` instead.
  * ``Request::$base`` is deprecated. Use ``Request::getAttribute('base')`` instead.
  * ``Request::$webroot`` is deprecated. Use ``Request::getAttribute('webroot')`` instead.
  * ``Request::$here`` is deprecated. Use ``Request::here()`` instead.
  * ``Request::$_session`` was renamed to ``Request::$session``.

* A number of methods on ``Cake\Network\Request`` have been deprecated:

  * The setter modes for ``query()``, ``data()`` and ``param()`` are deprecated.
  * ``__get()`` & ``__isset()`` methods are deprecated. Use ``param()`` instead.
  * ``method()`` is deprecated. Use ``getMethod()`` instead.
  * ``setInput()`` is deprecated. Use ``withBody()`` instead.
  * The ``ArrayAccess`` methods have all been deprecated.

* The ``Auth.redirect`` session variable is no longer used. Instead a query
  string parameter is used to store the redirect URL.
* ``AuthComponent`` no longer stores redirect URLs when the unauthorized URL is
  not a ``GET`` action.
* The ``ajaxLogin`` option for ``AuthComponent`` is deprecated. You should use the
  ``403`` status code to trigger the correct behavior in clientside code now.
* The ``beforeRedirect`` method of ``RequestHandlerComponent`` is now
  deprecated.
* The ``306`` status code in ``Cake\Network\Response`` is now deprecated and has
  its status phrase changed to 'Unused' as this status code is non-standard.

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may effect your application:

* ``ORM\Query`` results will not typecast aliased columns based on the original
  columns type. For example if you alias ``created`` to ``created_time`` you
  will now get a ``Time`` object back instead of a string.
* Internal ORM traits used to build Association classes have been removed and
  replaced with new internal APIs. This shouldn't impact your applications, but
  may if you have created custom association types.
* ``AuthComponent`` now uses a query string to store the redirect URL when an
  unauthenticated user is redirected to the login page. Previously, this redirect
  was stored in the session. Using the query string allows for better
  multi-browser experience.
* Database Schema reflection now treats unknown column types as ``string`` and
  not ``text``. A visible impact of this is that ``FormHelper`` will generate
  text inputs instead of textarea elements for unknown column types.
* ``AuthComponent`` no longer stores the flash messages it creates under the
  'auth' key. They are now rendered with the 'error' template under the
  'default' flash message key. This simplifies using ``AuthComponent``.
* ``Mailer\Email`` will now autodetect attachement content types using
  ``mime_content_type`` if a content-type is not provided. Previously
  attachments would have defaulted to 'application/octet-stream'.

Collection
==========

* ``CollectionInterface::chunkWithKeys()`` was added. User land implementations
  of the ``CollectionInterface`` will need to implement this method now.
* ``Collection::chunkWithKeys()`` was added.

Event
=====

* ``Event::data()`` was added.
* ``Event::setData()`` was added.
* ``Event::result()`` was added.
* ``Event::setResult()`` was added.


I18n
====

* You can now customize the behavior of the fallback message loader. See
  :ref:`creating-generic-translators` for more information.

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` now uses an HTML elipsis instead of '...' in
  the default templates.
* ``PaginatorHelper::total()`` was added to enable reading the total number of
  pages for the currently paginated results.
* ``PaginatorHelper::generateUrlParams()`` was added as a lower level URL
  building method.
* ``PaginatorHelper::meta()`` can now create links for 'first', 'last'.

FormHelper
==========

* You can now configure the sources which FormHelper reads from. This makes
  creating GET forms simpler. See :ref:`form-values-from-query-string` for more
  information.

Validation
==========

* ``Validation::falsey()`` and ``Validation::truthy()`` were added.
