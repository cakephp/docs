2.3 Migration Guide
###################

CakePHP 2.3 is a fully API compatible upgrade from 2.2.  This page outlines
the changes and improvements made in 2.3.

Caching
=======

- FileEngine is always the default cache engine.  In the past a number of people
  had difficulty setting up and deploying APC correctly both in cli + web.
  Using files should make setting up CakePHP simpler for new developers.

Component
=========

PaginatorComponent
------------------

- PaginatorComponent now supports the ``findType`` option.  This can be used to
  specify what find method you want used for pagination.  This is a bit easier
  to manage and set than the 0'th index.

Model
=====

Validation
----------

- Missing validation methods will **always** trigger errors now instead of
  only in development mode.

Network
=======

CakeResponse
------------

- :php:meth:`CakeResponse::file()` was added.

CakeEmail
---------

- The ``contentDisposition`` option was added to
  :php:meth:`CakeEmail::attachments()`.  This allows you to disable the
  Content-Disposition header added to attached files.


View
====

- MediaView is deprecated, and you can use new features in
  :php:class:`CakeResponse` to achieve the same results.
-

Testing
=======

- A core fixture for the default ``cake_sessions`` table was added. You can use
  it by adding ``core.cake_sessions`` to your fixture list.


