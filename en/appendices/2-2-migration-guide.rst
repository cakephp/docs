2.2 Migration Guide
###################

CakePHP 2.2 is a fully API compatible upgrade from 2.0/2.1.  This page outlines the
changes and improvements made for 2.2.

Models
======

- ``Model::_findCount()`` will now call the custom find methods with
    ``$state = 'before'`` and ``$queryData['operation'] = 'count'``.
    In many cases custom finds already return correct counts for pagination,
    but ``'operation'`` key allows more flexibility to build other queries,
    or drop joins which are required for the custom finder itself.
    As the pagination of custom find methods never worked quite well it required
    workarounds for this in the model level, which are now no longer needed

Testing
=======

- The webrunner now includes links to re-run a test with debug output.


Error Handling
==============

- When repeat exceptions, or exception are raised when rendering error pages,
  the new ``error`` layout will be used.  It's recommended to not use additional
  helpers in this layout as its intended for development level errors only. This
  fixes issues with fatal errors in rendering error pages due to helper usage in
  the ``default`` layout.
- It is important to copy the ``app/View/Layouts/error.ctp`` into your app
  directory.  Failing to do so will make error page rendering fail.
- You can now configure application specific console error handling.  By setting
  ``Error.consoleHandler``, and ``Exception.consoleHandler`` you can define the
  callback that will handle errors/exceptions raised in console applications.

Network
=======

CakeEmail
---------

- :php:meth:`CakeEmail::charset()` and :php:meth:`CakeEmail::headerCharset()`
  were added.

- :php:meth:`CakeEmail::theme()` was added.

Utility
=======

Set
---

- :php:meth:`Set::expand()` was added.

Helpers
=======

FormHelper
----------

- FormHelper now better handles adding required classes to inputs.  It now
  honours the ``on`` key.
