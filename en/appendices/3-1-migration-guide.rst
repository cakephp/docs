3.1 Migration Guide
###################

CakePHP 3.1 is a fully API compatible upgrade from 3.0. This page outlines
the changes and improvements made in 3.1.

Routing
=======

- The default route class has been changed to ``DashedRoute`` in the
  ``cakephp/app`` repo. Your current code base is not affected by this, but it is
  recommended to use this route class from now on.
- Name prefix options were added to the various route builder methods. See the
  :ref:`named-routes` section for more information.

Console
=======

- ``Shell::dispatchShell()`` no longer outputs the welcome message from the
  dispatched shell.
- The ``breakpoint()`` helper function has been added. This function provides
  a snippet of code that can be put into ``eval()`` to trigger an interactive
  console. This is very helpful when debugging in test cases, or other CLI
  scripts.
- The ``--verbose`` and ``--quiet`` console options now control stdout/stderr
  logging output levels.

Shell Helpers Added
-------------------

- Console applications can now create helper classes that encapsulate re-usable
  blocks of output logic. See the :doc:`/console-and-shells/helpers` section
  for more information.

RoutesShell
-----------

- RoutesShell has been added and now provides you a simple to use CLI
  interface for testing and debugging routes. See the
  :doc:`/console-and-shells/routes-shell` section for more information.

Controller
==========

- The following Controller properties are now deprecated:

  * layout
  * view - replaced with ``template``
  * theme
  * autoLayout
  * viewPath - replaced with ``templatePath``
  * viewClass - replaced with ``className``
  * layoutPath

  Instead of setting these properties on your controllers, you should set them
  on the view using methods with matching names::

    // In a controller, instead of
    $this->layout = 'advanced';

    // You should use
    $this->viewBuilder()->layout('advanced');

These methods should be called after you've determined which view class will be
used by a controller/action.

AuthComponent
-------------

- New config option ``storage`` has been added. It contains the storage class name that
  ``AuthComponent`` uses to store user record. By default ``SessionStorage`` is used.
  If using a stateless authenticator you should configure ``AuthComponent`` to
  use ``MemoryStorage`` instead.
- New config option ``checkAuthIn`` has been added. It contains the name of the
  event for which auth checks should be done. By default ``Controller.startup``
  is used, but you can set it to ``Controller.initialize`` if you want
  authentication to be checked before you controller's ``beforeFilter()`` method
  is run.
- The options ``scope`` and ``contain`` for authenticator classes have been
  deprecated. Instead, use the new ``finder`` option to configure a custom finder
  method and modify the query used to find a user there.
- The logic for setting ``Auth.redirect`` session variable, which is used to get
  the URL to be redirected to after login, has been changed. It is now set only when
  trying to access a protected URL without authentication. So ``Auth::redirectUrl()``
  returns the protected URL after login. Under normal circumstances, when a user
  directly accesses the login page, ``Auth::redirectUrl()`` returns the value set
  for ``loginRedirect`` config.

FlashComponent
--------------

- ``FlashComponent`` now stacks Flash messages when set with the ``set()``
  or ``__call()`` method. This means that the structure in the Session for
  stored Flash messages has changed.

CsrfComponent
-------------

- CSRF cookie expiry time can now be set as a ``strtotime()`` compatible value.
- Invalid CSRF tokens will now throw
  a ``Cake\Network\Exception\InvalidCsrfTokenException`` instead of the
  ``Cake\Network\Exception\ForbiddenException``.

RequestHandlerComponent
-----------------------

- ``RequestHandlerComponent`` now switches the layout and template based on
  the parsed extension or ``Accept`` header in the ``beforeRender()`` callback
  instead of ``startup()``.
- ``addInputType()`` and ``viewClassMap()`` are deprecated. You should use
  ``config()`` to modify this configuration data at runtime.
- When ``inputTypeMap`` or ``viewClassMap`` are defined in the component
  settings, they will *overwrite* the default values. This change makes it
  possible to remove the default configuration.

Network
=======

Http\Client
-----------

- The default mime type used when sending requests has changed. Previously
  ``multipart/form-data`` would always be used. In 3.1, ``multipart/form-data``
  is only used when file uploads are present. When there are no file uploads,
  ``application/x-www-form-urlencoded`` is used instead.

ORM
===

You can now :ref:`Lazily Eager Load Associations
<loading-additional-associations>`. This feature allows you to conditionally
load additional associations into a result set, entity or collection of
entities.

The ``patchEntity()`` and ``newEntity()`` method now support the ``onlyIds``
option. This option allows you to restrict hasMany/belongsToMany association
marshalling to only use the ``_ids`` list. This option defaults to ``false``.

Query
-----

- ``Query::notMatching()`` was added.
- ``Query::leftJoinWith()`` was added.
- ``Query::innerJoinWith()`` was added.
- ``Query::select()`` now supports ``Table`` and ``Association`` objects as
  parameters. These parameter types will select all the columns on the provided
  table or association instance's target table.
- ``Query::distinct()`` now accepts a string to distinct on a single column.
- ``Table::loadInto()`` was added.
- ``EXTRACT``, ``DATE_ADD`` and ``DAYOFWEEK`` raw SQL functions have been
  abstracted to ``extract()``, ``dateAdd()`` and ``dayOfWeek()``.

View
====

- You can now set ``_serialized`` to ``true`` for ``JsonView`` and ``XmlView``
  to serialize all view variables instead of explicitly specifying them.
- ``View::$viewPath`` is deprecated. You should use ``View::templatePath()``
  instead.
- ``View::$view`` is deprecated. You should use ``View::template()``
  instead.
- ``View::TYPE_VIEW`` is deprecated. You should use ``View::TYPE_TEMPLATE``
  instead.

Helper
======

SessionHelper
-------------

- The ``SessionHelper`` has been deprecated. You can use
  ``$this->request->session()`` directly.

FlashHelper
-----------

- ``FlashHelper`` can render multiple messages if multiple messages where
  set with the ``FlashComponent``. Each message will be rendered in its own
  element. Messages will be rendered in the order they were set.

FormHelper
----------

- New option ``templateVars`` has been added. ``templateVars`` allows you to
  pass additional variables to your custom form control templates.

Email
=====

- ``Email`` and ``Transport`` classes have been moved under the ``Cake\Mailer``
  namespace. Their former namespaces are still usable as class aliases have
  been set for them.
- The ``default`` email profile is now automatically set when an ``Email``
  instance is created. This behavior is similar to what is done in 2.x.

Mailer
------

- The ``Mailer`` class was added. This class helps create reusable emails in an
  application.

I18n
====

Time
----

- ``Time::fromNow()`` has been added. This method makes it easier to calculate
  differences from 'now'.
- ``Time::i18nFormat()`` now supports non-gregorian calendars when formatting
  dates.

Validation
==========

- ``Validation::geoCoordinate()`` was added.
- ``Validation::latitude()`` was added.
- ``Validation::longitude()`` was added.
- ``Validation::isInteger()`` was added.
- ``Validation::ascii()`` was added.
- ``Validation::utf8()`` was added.

Testing
=======

TestFixture
-----------

``model`` key is now supported to retrieve the table name for importing.
