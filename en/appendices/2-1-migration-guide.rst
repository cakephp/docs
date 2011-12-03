2.1 Migration Guide
###################

CakePHP 2.1 is a fully API compatible upgrade from 2.0.  This page outlines the
changes and improvements made for 2.1.

Exceptions
==========

The default exception rendering now includes more detailed stack traces
including file exceprts and argument dumps for all functions in the stack.


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

- :php:meth:`File::info()` includes filesize information.

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

Helpers
=======

TextHelper
----------

- :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
  :php:meth:`TextHelper::autoLinkEmails()` now HTML escape their input by
  default.  You can control this with the ``escape`` option.

View
====

Content type views
------------------

Two new view classes have been added to CakePHP.  A new :php:class:`JsonView`
and :php:class:`XmlView` allow you to easily generate XML and JSON views.  You
can learn more about these classes in the section on
:doc:`/views/json-and-xml-views`

Testing
=======

- Web test runner now displays the PHPUnit version number.
