2.3 Migration Guide
###################

CakePHP 2.3 is a fully API compatible upgrade from 2.2.  This page outlines
the changes and improvements made in 2.3.

Caching
=======

- FileEngine is always the default cache engine.  In the past a number of people
  had difficulty setting up and deploying APC correctly both in cli + web.
  Using files should make setting up CakePHP simpler for new developers.

Model
=====

Validation
----------

- Missing validation methods will **always** trigger errors now instead of
  only in development mode.

Network
=======

- :php:meth:`CakeResponse::file()` was added.


View
====

- MediaView is deprecated, and you can use new features in
  :php:class:`CakeResponse` to achieve the same results.
-
