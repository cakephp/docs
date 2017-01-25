3.4 Migration Guide
###################

CakePHP 3.4 is an API compatible upgrade from 3.3. This page outlines the
changes and improvements made in 3.4.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function until 4.0.0 after which they will be removed.

Request & Response Deprecations
-------------------------------

The bulk of deprecations for 3.4 are in the ``Request`` and ``Response``
objects. The existing methods that modify objects in-place are now deprecated,
and superseded by methods that follow the immutable object patterns described in
the PSR-7 standard.

Several properties on ``Cake\Network\Request`` have been deprecated:

* ``Request::$params`` is deprecated. Use ``Request::getParam()`` instead.
* ``Request::$data`` is deprecated. Use ``Request::getData()`` instead.
* ``Request::$query`` is deprecated. Use ``Request::getQuery()`` instead.
* ``Request::$cookies`` is deprecated. Use ``Request::getCookie()`` instead.
* ``Request::$base`` is deprecated. Use ``Request::getAttribute('base')`` instead.
* ``Request::$webroot`` is deprecated. Use ``Request::getAttribute('webroot')`` instead.
* ``Request::$here`` is deprecated. Use ``Request::here()`` instead.
* ``Request::$_session`` was renamed to ``Request::$session``.

A number of methods on ``Cake\Network\Request`` have been deprecated:

* ``__get()`` & ``__isset()`` methods are deprecated. Use ``getParam()`` instead.
* ``method()`` is deprecated. Use ``getMethod()`` instead.
* ``setInput()`` is deprecated. Use ``withBody()`` instead.
* The ``ArrayAccess`` methods have all been deprecated.
* ``Request::param()`` is deprecated. Use ``Request::getParam()`` instead.
* ``Request::data()`` is deprecated. Use ``Request::getData()`` instead.
* ``Request::query()`` is deprecated. Use ``Request::getQuery()`` instead.
* ``Request::cookie()`` is deprecated. Use ``Request::getCookie()`` instead.

Several methods on ``Cake\Network\Response`` have been deprecated because they
either overlap the PSR-7 methods, or are made obsolete by the PSR-7 stack:

* ``Response::header()`` is deprecated. Use ``getHeaderLine()``, ``hasHeader()`` or
  ``Response::getHeader()`` instead.
* ``Response::body()`` is deprecated. Use ``Response::withBody()`` instead.
* ``Response::statusCode()`` is deprecated. Use ``Response::getStatusCode()`` instead.
* ``Response::httpCodes()`` This method should no longer be used. CakePHP now supports all
  standards recommended status codes.
* ``Response::protocol()`` is deprecated. Use ``Response::getProtocolVersion()`` instead.
* ``send()``, ``sendHeaders()``, ``_sendHeader()``, ``_sendContent()``,
  ``_setCookies()``, ``_setContentType()``, and ``stop()`` are deprecated and
  made obsolete by the PSR-7 HTTP stack.

With responses heading towards immutable object patterns as recommended by the
PSR-7 standards, a number of 'helper' methods in ``Response`` have been
deprecated and immutable variants are now recommended:

* ``Response::location()`` would become ``Response::withLocation()``
* ``Response::disableCache()`` would become ``Response::withDisabledCache()``
* ``Response::type()`` would become ``Response::withType()``
* ``Response::charset()`` would become ``Response::withCharset()``
* ``Response::cache()`` would become ``Response::withCache()``
* ``Response::modified()`` would become ``Response::withModified()``
* ``Response::expires()`` would become ``Response::withExpires()``
* ``Response::sharable()`` would become ``Response::withSharable()``
* ``Response::maxAge()`` would become ``Response::withMaxAge()``
* ``Response::vary()`` would become ``Response::withVary()``
* ``Response::etag()`` would become ``Response::withEtag()``
* ``Response::compress()`` would become ``Response::withCompression()``
* ``Response::length()`` would become ``Response::withLength()``
* ``Response::mustRevalidate()`` would become ``Response::withMustRevalidate()``
* ``Response::notModified()`` would become ``Response::withNotModified()``
* ``Response::cookie()`` would become ``Response::withCookie()``
* ``Response::file()`` would become ``Response::withFile()``
* ``Response::download()`` would become ``Response::withDownload()``

Please see the :ref:`adopting-immutable-responses` section for more information
before updating your code as using responses through the immutable methods will
require additional changes.

Other Deprecations
------------------

* The public properties on ``Cake\Event\Event`` are deprecated, new methods have
  been added to read/write the relevant properties.
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
* ``Cake\Database\Schema\Table`` has been renamed to
  ``Cake\Database\Schema\TableSchema``. The previous name was confusing to a number
  of users.
* The ``fieldList`` option for  ``Cake\ORM\Table::newEntity()`` and
  ``patchEntity()`` has been renamed to ``fields`` to be more consistent with
  other parts of the ORM.
* ``Router::parse()`` is deprecated. ``Router::parseRequest()`` should be used
  instead as it accepts a request and gives more control/flexibility in handling
  incoming requests.
* ``Route::parse()`` is deprecated. ``Route::parseRequest()`` should be used
  instead as it accepts a request and gives more control/flexibility in handling
  incoming requests.

Deprecated Combined Get/Set Methods
-----------------------------------

In the past CakePHP has leveraged 'modal' methods that operate as provide both
a get/set mode. These methods complicate IDE autocompletion and our ability
to add stricter return types in the future. For these reasons, combined get/set
methods are being split into separate get and set methods.

The following is a list of methods that are deprecated and replaced with
``getX`` and ``setX`` methods:

``Cake\Console\ConsoleOptionParser``
    * ``command()``
    * ``description()``
    * ``epilog()``
``Cake\Database\Connection``
    * ``driver()``
    * ``schemaCollection()``
    * ``useSavePoints()`` (now ``enableSavePoints()``/``isSavePointsEnabled()``)
``Cake\Database\Driver``
    * ``autoQuoting`` (now ``enableAutoQuoting()``/``isAutoQuotingEnabled()``)
``Cake\Database\Expression\FunctionExpression``
    * ``name()``
``Cake\Database\Expression\QueryExpression``
    * ``tieWith()`` (now ``setConjunction()``/``getConjunction()``)
``Cake\Database\Expression\ValuesExpression``
    * ``columns()``
    * ``query()``
``Cake\Database\Query``
    * ``connection()``
    * ``selectTypeMap()``
    * ``bufferResults()`` (now ``enableBufferedResults()``/``isBufferedResultsEnabled()``)
``Cake\Database\Schema\CachedCollection``
    * ``cacheMetadata()``
``Cake\Database\Schema\TableSchema``
    * ``options()``
    * ``temporary()`` (now ``setTemporary()``/``isTemporary()``)
``Cake\Database\TypeMap``
    * ``defaults()``
    * ``types()``
``Cake\Database\TypeMapTrait``
    * ``typeMap()``
    * ``defaultTypes()``
``Cake\ORM\EagerLoadable``
    * ``config()``
    * setter part of ``canBeJoined()`` (now ``setCanBeJoined()``)
``Cake\ORM\EagerLoader``
    * ``matching()`` (``getMatching()`` will have to be called after ``setMatching()``
      to keep the old behavior)
    * ``autoFields()`` (now ``enableAutoFields()``/``isAutoFieldsEnabled()``)
``Cake\ORM\Locator\TableLocator``
    * ``config()``
``Cake\ORM\Query``
    * ``eagerLoader()``
``Cake\ORM\Table``
    * ``table()``
    * ``alias()``
    * ``registryAlias()``
    * ``connection()``
    * ``schema()``
    * ``primaryKey()``
    * ``displayField()``
    * ``entityClass()``
``Cake\Mailer\Email``
    * ``from()``
    * ``sender()``
    * ``replyTo()``
    * ``readReceipt()``
    * ``returnPath()``
    * ``to()``
    * ``cc()``
    * ``bcc()``
    * ``charset()``
    * ``headerCharset()``
    * ``emailPattern()``
    * ``subject()``
    * ``template()`` (now ``setTemplate()``/``getTemplate()`` and ``setLayout()``/``getLayout()``)
    * ``viewRender()`` (now ``setViewRenderer()``/``getViewRenderer()``)
    * ``viewVars()``
    * ``theme()``
    * ``helpers()``
    * ``emailFormat()``
    * ``transport()``
    * ``messageId()``
    * ``domain()``
    * ``attachments()``
    * ``configTransport()``
    * ``profile()``
``Cake\Validation\Validator``
    * ``provider()``
``Cake\View\StringTemplateTrait``
    * ``templates()``
``Cake\View\ViewBuilder``
    * ``templatePath()``
    * ``layoutPath()``
    * ``plugin()``
    * ``helpers()``
    * ``theme()``
    * ``template()``
    * ``layout()``
    * ``options()``
    * ``name()``
    * ``className()``
    * ``autoLayout()`` (now ``enableAutoLayout()``/``isAutoLayoutEnabled()``)

.. _adopting-immutable-responses:

Adopting Immutable Responses
============================

Before you migrate your code to use the new response methods you should be aware
of the conceptual differences the new methods have. The immutable methods are
generally indicated using a ``with`` prefix. For example, ``withLocation()``.
Because these methods operate in an immutable context, they return *new*
instances which you need to assign to variables or properties. If you had
controller code that looked like::

    $response = $this->response;
    $response->location('/login')
    $response->header('X-something', 'a value');

If you were to simply find & replace method names your code would break. Instead
you must now use code that looks like::

    $this->response = $this->response
        ->withLocation('/login')
        ->withHeader('X-something', 'a value');

There are a few key differences:

#. The result of your changes is re-assigned to ``$this->response``. This is
   critical to preserving the intent of the above code.
#. The setter methods can all be chained together. This allows you to skip
   storing all the intermediate objects.

Component Migration Tips
------------------------

In previous versions of CakePHP, Components often held onto references to both
the request and response, in order to make changes later. Before you adopt the
immutable methods you should use the response attached to the Controller::

    // In a component method (not a callback)
    $this->response->header('X-Rate-Limit', $this->remaining);

    // Should become
    $controller = $this->getController();
    $controller->response = $controller->response->withHeader('X-Rate-Limit', $this->remaining);

In component callbacks you can use the event object to access the
response/controller::

    public function beforeRender($event)
    {
        $controller = $event->getSubject();
        $controller->response = $controller->response->withHeader('X-Teapot', 1);
    }

.. tip::
    Instead of holding onto references of Responses, always get the current
    response from the controller, and re-assign the response property when you
    are done.

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may affect your application:

* ``ORM\Query`` results will not typecast aliased columns based on the original
  column's type. For example if you alias ``created`` to ``created_time`` you
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
* ``Mailer\Email`` will now autodetect attachment content types using
  ``mime_content_type`` if a content-type is not provided. Previously
  attachments would have defaulted to 'application/octet-stream'.

Visibility Changes
==================

* ``MailerAwareTrait::getMailer()`` will now become protected.
* ``CellTrait::cell()`` will now become protected.

If the above traits are used in controllers, their public methods could be
accessed by default routing as actions. These changes help protect your
controllers. If you need the methods to remain public you will need to update
your ``use`` statement to look like::

    use CellTrait {
        cell as public;
    }
    use MailerAwareTrait {
        getMailer as public;
    }


Collection
==========

* ``CollectionInterface::chunkWithKeys()`` was added. User land implementations
  of the ``CollectionInterface`` will need to implement this method now.
* ``Collection::chunkWithKeys()`` was added.

Error
=====

* ``Debugger::setOutputMask()`` and ``Debugger::outputMask()`` were added. These
  methods allow you to configure properties/array keys that should be masked
  from output generated by Debugger (for instance, when calling ``debug()``).

Event
=====

* ``Event::getData()`` was added.
* ``Event::setData()`` was added.
* ``Event::getResult()`` was added.
* ``Event::setResult()`` was added.

I18n
====

* You can now customize the behavior of the fallback message loader. See
  :ref:`creating-generic-translators` for more information.

Routing
=======

* ``RouteBuilder::prefix()`` now accepts an array of defaults to add to each
  connected route.
* Routes can now match only specific hosts through the ``_host`` option.

HtmlHelper
==========

* ``HtmlHelper::scriptBlock()`` no longer wraps the JavaScript code in ``<![CDATA[ ]]``
  tag by default. The ``safe`` option which controls this behavior now defaults
  to ``false``. Using ``<![CDATA[ ]]`` tag was only required for XHTML which is
  no longer the dominant doctype used for HTML pages.

BreadcrumbsHelper
=================

* ``BreadcrumbsHelper::reset()`` was added. This method lets you clear out
  existing crumbs.

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
* ``FormHelper::input()`` is deprecated. Use ``FormHelper::control()`` instead.
* ``FormHelper::inputs()`` is deprecated. Use ``FormHelper::controls()`` instead.
* ``FormHelper::allInputs()`` is deprecated. Use ``FormHelper::allControls()`` instead.

Validation
==========

* ``Validation::falsey()`` and ``Validation::truthy()`` were added.

TranslateBehavior
=================

* ``TranslateBehavior::translationField()`` was added.

PluginShell
===========

* ``cake plugin load`` and ``cake plugin unload`` now support a ``--cli``
  option, which updates the ``bootstrap_cli.php`` instead.
