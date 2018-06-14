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

Authentication functionality has been splitted into standalone plugins `Authentication <https://github.com/cakephp/authentication>`__ and `Authorization <https://github.com/cakephp/authorization>`__.
The former RssHelper can be found as standalone `Feed plugin <https://github.com/dereuromark/cakephp-feed>`__ with similar functionality.

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
* ``Cake\Database\Type::map()`` only functions as a setter now. You must use
  ``Type::getMap()`` to inspect type instances.
* ``Cake\Http\Client\Response::isOk()`` now returns ``true`` for all 2xx and 3xx
  response codes.
* Date, Time, Timestamp, and Datetime column times now return immutable time
  objects by default now.
* ``Cake\View\View`` will re-render views if ``render()`` is called multiple
  times instead of returning ``null``.
* ``Cake\View\Helper\PaginatorHelper::hasPage()`` has had its arguments
  reversed. This makes it consistent with other paginator methods where the
  'model' is the second argument.
* ``Cake\Utility\Xml::fromArray()`` now requires an array for the ``$options``
  parameter.
* ``Cake\Filesystem\Folder::copy($to, array $options = [])`` and
  ``Cake\Filesystem\Folder::move($to, array $options = [])`` have now the target
  path extracted as first argument.


New Features
============

Http
----

* ``Cake\Http\Client\Response::isSuccess()`` was added. This method returns true
  if the response status code is 2xx.
