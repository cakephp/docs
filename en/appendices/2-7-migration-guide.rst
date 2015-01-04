2.7 Migration Guide
###################

CakePHP 2.7 is a fully API compatible upgrade from 2.6.  This page outlines
the changes and improvements made in 2.7.


Core
====

Configure
---------

- :php:meth:`Configure::consume()` has been added to read and delete from
  Configure in a single step.


Datasource
==========

CakeSession
-----------
- :php:meth:`CakeSession::consume()` has been added to read and delete from
  session in a single step.
- Argument `$renew` has been added to :php:meth:`CakeSession::clear()` to allow emptying the session
without forcing a new id and renewing the session. It defaults to ``true``.

Controller
==========

SessionComponent
----------------

- :php:meth:`SessionComponent::consume()` has been added to read and delete
  from session in a single step.


View
====

SessionHelper
-------------
- :php:meth:`SessionHelper::consume()` has been added to read and delete from
  session in a single step.


TestSuite
=========

ControllerTestCase
------------------
- :php:meth:`ControllerTestCase::testAction()` now supports an array as URL.
