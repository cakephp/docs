2.1 Migration Guide
###################

CakePHP 2.1 is a fully API compatible upgrade from 2.0. This page outlines the
changes and improvements made for 2.1.

AppController, AppHelper, AppModel and AppShell
===============================================

These classes are now required to be part of the app directory, as they were
removed from the CakePHP core. If you do not already have these classes, you
can use the following while upgrading::

    // app/View/Helper/AppHelper.php
    App::uses('Helper', 'View');
    class AppHelper extends Helper {
    }

    // app/Model/AppModel.php
    App::uses('Model', 'Model');
    class AppModel extends Model {
    }

    // app/Controller/AppController.php
    App::uses('Controller', 'Controller');
    class AppController extends Controller {
    }

    // app/Console/Command/AppShell.php
    App::uses('Shell', 'Console');
    class AppShell extends Shell {
    }

If your application already has these files/classes you don't need to do
anything.
Additionally if you were using the core PagesController, you would need to copy
this to your app/Controller directory as well.

.htaccess files
===============

The default ``.htaccess`` files have changed, you should remember to update them
or update your webservers URL re-writing scheme to match the changes done in
``.htaccess``


Models
======

- The ``beforeDelete`` callback will be fired before behaviors beforeDelete callbacks.
  This makes it consistent with the rest of the events triggered in the model layer.
- ``Model::find('threaded')`` now accepts ``$options['parent']`` if using other field
  then ``parent_id``. Also if the model has TreeBehavior attached and set up with other
  parent field, the threaded find will by default use that.
- Parameters for queries using prepared statements will now be part of the SQL
  dump.
- Validation arrays can now be more specific with when a field is required.
  The ``required`` key now accepts ``create`` and ``update``. These values will
  make a field required when creating or updating.
- Model now has a ``schemaName`` property. If your application switches
  datasources by modifying :php:attr:`Model::$useDbConfig` you should also
  modify ``schemaName`` or use :php:meth:`Model::setDataSource()` method which
  handles this for you.

CakeSession
-----------

.. versionchanged:: 2.1.1
    CakeSession no longer sets the P3P header, as this is the responsibility of your application.
    More info see ticket `#2515 <http://cakephp.lighthouseapp.com/projects/42648/tickets/2515-cakephp-20-session-p3p-header-doesnt-work-in-an-iframe>`_ in lighthouse

Behaviors
=========

TranslateBehavior
-----------------

- :php:class:`I18nModel` has been moved into a separate file.

Exceptions
==========

The default exception rendering now includes more detailed stack traces
including file excerpts and argument dumps for all functions in the stack.


Utility
=======

Debugger
--------

- :php:func:`Debugger::getType()` has been added. It can be used to get the type of
  variables.
- :php:func:`Debugger::exportVar()` has been modified to create more readable
  and useful output.

debug()
-------

`debug()` now uses :php:class:`Debugger` internally. This makes it consistent
with Debugger, and takes advantage of improvements made there.

Set
---

- :php:func:`Set::nest()` has been added. It takes in a flat array and returns a nested array

File
----

- :php:meth:`File::info()` includes filesize & mimetype information.
- :php:meth:`File::mime()` was added.

Cache
-----

- :php:class:`CacheEngine` has been moved into a separate file.

Configure
---------

- :php:class:`ConfigReaderInterface` has been moved into a separate file.

App
---

- :php:meth:`App::build()` now has the ability to register new packages using
  ``App::REGISTER``. See :ref:`app-build-register` for more information.
- Classes that could not be found on configured paths will be searched inside
  ``APP`` as a fallback path. This makes autoloading nested directories in
  ``app/Vendor`` easier.

Console
=======

Test Shell
----------

A new TestShell has been added. It reduces the typing required to run unit
tests, and offers a file path based UI::

    ./Console/cake test app Model/Post
    ./Console/cake test app Controller/PostsController
    ./Console/cake test Plugin View/Helper/MyHelper

The old testsuite shell and its syntax are still available.

General
-------

- Generated files no longer contain timestamps with the generation datetime.

Routing
=======

Router
------

- Routes can now use a special ``/**`` syntax to include all trailing arguments
  as a single passed argument. See the section on :ref:`connecting-routes` for
  more information.
- :php:meth:`Router::resourceMap()` was added.
- :php:meth:`Router::defaultRouteClass()` was added. This method allows you to
  set the default route class used for all future routes that are connected.

Network
=======

CakeRequest
-----------

- Added ``is('requested')`` and ``isRequested()`` for detecting requestAction.

CakeResponse
------------

- Added :php:meth:`CakeResponse::cookie()` for setting cookies.
- Added a number of methods for :ref:`cake-response-caching`

Controller
==========

Controller
----------

- :php:attr:`Controller::$uses` was modified the default value is now ``true``
  instead of false. Additionally different values are handled slightly
  differently, but will behave the same in most cases.

    - ``true`` Will load the default model and merge with AppController.
    - An array will load those models and merge with AppController.
    - An empty array will not load any models other than those declared in the
      base class.
    - ``false`` will not load any models, and will not merge with the base class
      either.


Components
==========

AuthComponent
-------------

- :php:meth:`AuthComponent::allow()` no longer accepts ``allow('*')`` as a wildcard
  for all actions. Just use ``allow()``. This unifies the API between allow()
  and deny().
- ``recursive`` option was added to all authentication adapters. Allows you to
  more easily control the associations stored in the session.


AclComponent
------------

- :php:class:`AclComponent` no longer lowercases and inflects the class name used for
  ``Acl.classname``. Instead it uses the provided value as is.
- Acl backend implementations should now be put in ``Controller/Component/Acl``.
- Acl implementations should be moved into the Component/Acl directory from
  Component. For example if your Acl class was called ``CustomAclComponent``,
  and was in ``Controller/Component/CustomAclComponent.php``.
  It should be moved into ``Controller/Component/Acl/CustomAcl.php``, and be
  named ``CustomAcl``.
- :php:class:`DbAcl` has been moved into a separate file.
- :php:class:`IniAcl` has been moved into a separate file.
- :php:class:`AclInterface` has been moved into a separate file.

Helpers
=======

TextHelper
----------

- :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
  :php:meth:`TextHelper::autoLinkEmails()` now HTML escape their input by
  default. You can control this with the ``escape`` option.

HtmlHelper
----------

- :php:meth:`HtmlHelper::script()` had a ``block`` option added.
- :php:meth:`HtmlHelper::scriptBlock()` had a ``block`` option added.
- :php:meth:`HtmlHelper::css()` had a ``block`` option added.
- :php:meth:`HtmlHelper::meta()` had a ``block`` option added.
- The ``$startText`` parameter of :php:meth:`HtmlHelper::getCrumbs()` can now be
  an array. This gives more control and flexibility over the first crumb link.
- :php:meth:`HtmlHelper::docType()` now defaults to HTML5.
- :php:meth:`HtmlHelper::image()` now has a ``fullBase`` option.
- :php:meth:`HtmlHelper::media()` has been added. You can use this method to
  create HTML5 audio/video elements.
- :term:`plugin syntax` support has been added for
  :php:meth:`HtmlHelper::script()`, :php:meth:`HtmlHelper::css()`, :php:meth:`HtmlHelper::image()`.
  You can now easily link to plugin assets using ``Plugin.asset``.
- :php:meth:`HtmlHelper::getCrumbList()` had the ``$startText`` parameter added.


View
====

- :php:attr:`View::$output` is deprecated.
- ``$content_for_layout`` is deprecated. Use ``$this->fetch('content');``
  instead.
- ``$scripts_for_layout`` is deprecated. Use the following instead::

        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');

  ``$scripts_for_layout`` is still available, but the :ref:`view blocks <view-blocks>` API
  gives a more extensible & flexible replacement.
- The ``Plugin.view`` syntax is now available everywhere. You can use this
  syntax anywhere you reference the name of a view, layout or element.
- The ``$options['plugin']`` option for :php:meth:`~View::element()` is
  deprecated. You should use ``Plugin.element_name`` instead.

Content type views
------------------

Two new view classes have been added to CakePHP. A new :php:class:`JsonView`
and :php:class:`XmlView` allow you to easily generate XML and JSON views. You
can learn more about these classes in the section on
:doc:`/views/json-and-xml-views`

Extending views
---------------

:php:class:`View` has a new method allowing you to wrap or 'extend' a
view/element/layout with another file. See the section on
:ref:`extending-views` for more information on this feature.

Themes
------

The ``ThemeView`` class is deprecated in favor of the ``View`` class. Simply
setting ``$this->theme = 'MyTheme'`` will enable theme support, and all custom
View classes which extend from ``ThemeView`` should extend ``View``.

View blocks
-----------

View blocks are a flexible way to create slots or blocks in your views. Blocks
replace ``$scripts_for_layout`` with a more robust and flexible API. See the
section on :ref:`view-blocks` for more information.


Helpers
=======

New callbacks
-------------

Two new callbacks have been added to Helpers.
:php:meth:`Helper::beforeRenderFile()` and :php:meth:`Helper::afterRenderFile()`
these new callbacks are fired before/after every view fragment is rendered.
This includes elements, layouts and views.

CacheHelper
-----------

- ``<!--nocache-->`` tags now work inside elements correctly.

FormHelper
----------

- FormHelper now omits disabled fields from the secured fields hash. This makes
  working with :php:class:`SecurityComponent` and disabled inputs easier.
- The ``between`` option when used in conjunction with radio inputs, now behaves
  differently. The ``between`` value is now placed between the legend and first
  input elements.
- The ``hiddenField`` option with checkbox inputs can now be set to a specific
  value such as 'N' rather than just 0.
- The ``for`` attribute for date + time inputs now reflects the first generated
  input. This may result in the for attribute changing for generated datetime
  inputs.
- The ``type`` attribute for :php:meth:`FormHelper::button()` can be removed now. It still
  defaults to 'submit'.
- :php:meth:`FormHelper::radio()` now allows you to disable all options.
  You can do this by setting either ``'disabled' => true`` or ``'disabled' => 'disabled'``
  in the ``$attributes`` array.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` now has a ``currentClass`` option.


Testing
=======

- Web test runner now displays the PHPUnit version number.
- Web test runner now defaults to displaying app tests.
- Fixtures can be created in different datasources other than $test.
- Models loaded using the ClassRegistry and using another datasource will get
  their datasource name prepended with ``test_`` (e.g datasource `master` will
  try to use `test_master` in the testsuite)
- Test cases are generated with class specific setup methods.

Events
======

- A new generic events system has been built and it replaced the way callbacks
  were dispatched. This should not represent any change to your code.
- You can dispatch your own events and attach callbacks to them at will, useful
  for inter-plugin communication and easier decoupling of your classes.
