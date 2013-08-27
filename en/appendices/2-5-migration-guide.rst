2.5 Migration Guide
###################

CakePHP 2.5 is a fully API compatible upgrade from 2.4.  This page outlines
the changes and improvements made in 2.5.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::addDetector()` now supports ``options`` which
  accepts an array of valid options when creating param based detectors.

Routing
=======

Router
------

- :php:meth:`Router::mapResources()` accepts ``connectOptions`` key in the
  ``$options`` argument. See :ref:`custom-rest-routing` for more details.

Utility
=======

Hash
----

- :php:meth:`Hash::insert()` and :php:meth:`Hash::remove()` now support matcher
  expressions in their path selectors.
