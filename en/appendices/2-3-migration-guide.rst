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

SecurityComponent
------------------

- SecurityComponent now supports the ``unlockedActions`` option. This can be used to
  disable all security checks for any actions listed in this option.

RequestHandlerComponent
-----------------------

- RequestHandlerComponent has a new method ``viewClassMap()`` which is used to map a type
  to view classname. You can add ``$settings['viewClassMap']`` for automatically setting
  the correct viewClass based on extension/content type.

Console
=======

- The ``server`` shell was added.  You can use this to start the PHP5.4
  webserver for your CakePHP application.

Error
=====

Exceptions
----------

- CakeBaseException was added, which all core Exceptions now extend. The base exception
  class also introduces the ``responseHeader()`` method which can be called on created Exception instances
  to add headers for the response, as Exceptions dont reuse any response instance.

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

Routing
=======

Router
------

- Support for ``tel:``, ``sms:`` were added to :php:meth:`Router::url()`.

View
====

- MediaView is deprecated, and you can use new features in
  :php:class:`CakeResponse` to achieve the same results.
- Serialization in Json and Xml views has been moved to ``_serialize()``

Helpers
=======

FormHelper
----------

- :php:meth:`FormHelper::select()` now accepts a list of values in the disabled
  attribute. The list should contain the values you want disabled.

Testing
=======

- A core fixture for the default ``cake_sessions`` table was added. You can use
  it by adding ``core.cake_sessions`` to your fixture list.


Utility
=======

Debugger
--------

- php:meth:`Debugger::exportVar()` now outputs private and protected properties
  in PHP >= 5.3.0.

Security
--------

- Support for `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_
  was added.  See the :php:class:`Security::hash()` documentation for more
  information on how to use bcrypt.

