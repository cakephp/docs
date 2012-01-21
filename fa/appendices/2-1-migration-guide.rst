2.1 Migration Guide
###################

CakePHP 2.1 is a fully API compatible upgrade from 2.0.  This page outlines the
changes and improvements made for 2.1.

AppController, AppHelper, and AppModel
======================================

These classes are now required to be part of the app directory, as they were
removed from the CakePHP core.  If you do not already have these classes, you
can use the following while upgrading::

    // app/View/Helper/AppHelper.php
    <?php
    App::uses('Helper', 'View');
    class AppHelper extends Helper {
    }

    // app/Model/AppModel.php
    <?php
    App::uses('Model', 'Model');
    class AppModel extends Model {
    }

    // app/Controller/AppController.php
    <?php
    App::uses('Controller', 'Controller');
    class AppController extends Controller {
    }

If your application already has these files/classes you don't need to do
anything.
Additionally if you were using the core PagesController, you would need to copy
this to your app/Controller directory as well.

Models
======

- The ``beforeDelete`` callback will be fired before behaviors beforeDelete callbacks.
  This makes it consistent with the rest of the events triggered in the model layer.
- ``Model::find('threaded')`` now triggers a warning when called on models
  without a ``parent_id`` field.


Exceptions
==========

The default exception rendering now includes more detailed stack traces
including file excerpts and argument dumps for all functions in the stack.


Utility
=======

Debugger
--------

- :php:func:`Debugger::getType()` has been added.  It can be used to get the type of
  variables.
- :php:func:`Debugger::exportVar()` has been modified to create more readable
  and useful output.

debug()
-------

`debug()` now uses :php:class:`Debugger` internally.  This makes it consistent
with Debugger, and takes advantage of improvements made there.


File
----

- :php:meth:`File::info()` includes filesize & mimetype information.
- :php:meth:`File::mime()` was added.

Console
=======

Test Shell
----------

A new TestShell has been added. It reduces the typing required to run unit
tests, and offers a file path based UI::

    # Run the post model tests
    Console/cake test app/Model/Post.php
    Console/cake test app/Controller/PostsController.php

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

Components
==========

AuthComponent
-------------

- :php:meth:`AuthComponent::allow()` no longer accepts ``allow('*')`` as a wildcard
  for all actions.  Just use ``allow()``.  This unifies the API between allow()
  and deny().
- ``recursive`` option was added to all authentication adapters.  Allows you to
  more eaisly control the associations stored in the session.

Helpers
=======

TextHelper
----------

- :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
  :php:meth:`TextHelper::autoLinkEmails()` now HTML escape their input by
  default.  You can control this with the ``escape`` option.

HtmlHelper
----------

- :php:meth:`HtmlHelper::script()` had a ``block`` option added.
- :php:meth:`HtmlHelper::css()` had a ``block`` option added.
- :php:meth:`HtmlHelper::meta()` had a ``block`` option added.
- The ``$startText`` parameter of :php:meth:`HtmlHelper::getCrumbs()` can now be
  an array.  This gives more control and flexibility over the first crumb link.

View
====

- :php:attr:`View::$output` is deprecated.
- ``$content_for_layout`` is deprecated.  Use ``$this->fetch('content');``
  instead.
- ``$scripts_for_layout`` is deprecated.  Use the following instead::

        <?php
        $this->fetch('meta');
        $this->fetch('css');
        $this->fetch('script');

  ``$scripts_for_layout`` is still available, but the :ref:`view blocks <view-blocks>` API
  gives a more extensible & flexible replacement.
- The ``Plugin.view`` syntax is now available everywhere.  You can use this
  syntax anywhere you reference the name of a view, layout or element.
- The ``$options['plugin']`` option for :php:meth:`~View::element()` is
  deprecated.  You should use ``Plugin.element_name`` instead.

Content type views
------------------

Two new view classes have been added to CakePHP.  A new :php:class:`JsonView`
and :php:class:`XmlView` allow you to easily generate XML and JSON views.  You
can learn more about these classes in the section on
:doc:`/views/json-and-xml-views`

Extending views
---------------

:php:class:`View` has a new method allowing you to wrap or 'extend' a
view/element/layout with another file.  See the section on
:ref:`extending-views` for more information on this feature.

View blocks
-----------

View blocks are a flexible way to create slots or blocks in your views.  Blocks
replace ``$scripts_for_layout`` with a more robust and flexible API.  See the
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

Testing
=======

- Web test runner now displays the PHPUnit version number.
- Web test runner now defaults to displaying app tests.
- Fixtures can be created in different datasources other than $test.
- Models loaded using the ClassRegistry and using another datasource will get
  their datasource name prepended with ``test_`` (e.g datasource `master` will
  try to use `test_master` in the testsuite)

Events
======

- A new generic events system has been built and it replaced the way callbacks
  were dispatched. This should not represent any change to your code.
- You can dispatch your own events and attach callbacks to them at will, useful
  for inter-plugin communication and easier decoupling of your classes.
