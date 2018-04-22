4.0 Migration Guide
###################

CakePHP 4.0 contains breaking changes, and is not backwards compatible with 3.x
releases. Before attempting to upgrade to 4.0, first upgrade to 3.6 and resolve
all deprecation warnings.

To upgrade to 4.0.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

Deprecated Features Removed
===========================

All methods, properties and functionality that was emitting deprecation warnings
as of 3.6 have been removed.

Breaking Changes
================

In addition to the removal of deprecated features there have been breaking
changes made:

* The Session cookie name is no longer set to ``CAKEPHP`` by default. Instead
  the default cookie name defined in your ``php.ini`` file is used. You can use
  the ``Session.cookie`` configuration option to set the cookie name.
* The default value of ``ServerRequest::getParam()`` when a parameter is missing
  is now ``null`` and not ``false``.
* Type mapping classes in ``Cake\Database\TypeInterface`` no longer inherit from
  ``Type``, and leverage ``BatchCastingInterface`` features now.
