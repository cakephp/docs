5.1 Upgrade Guide
#################

The 5.1.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.


New Features
============

Http
----

- ``SecurityHeadersMiddleware::setPermissionsPolicy()`` was added. This method
  adds the ability to define ``permissions-policy`` header values.
