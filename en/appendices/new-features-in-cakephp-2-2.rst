New Features in CakePHP 2.2
###########################

Models
======

- ``Model::_findCount()`` will now call the custom find methods with
    ``$state = 'before'`` and ``$queryData['operation'] = 'count'``.
    In many cases custom finds already return correct counts for pagination,
    but ``'operation'`` key allows more flexibility to build other queries,
    or drop joins which are required for the custom finder itself.
    As the pagination of custom find methods never worked quite well it required
    workarounds for this in the model level, which are now no longer needed

Datasources
===========

- Dbo datasources now supports real nested transactions.

Pagination
==========

- Paginating custom finders will now return correct counts, see Model changes for more info.

Utility
=======

CakeTime
--------

- The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter in all relevant functions.
    So instead of numeric offset you can now pass in a timezone string or DateTimeZone object.
    Passing numeric offsets for ``$timezone`` parameter is still possible for backwards compatibility.

- New methods added:
    :php:meth:`CakeTime::toServer()`
    :php:meth:`CakeTime::timezone()`

Configuration
=============

- A new config parameter 'Config.timezone' is available which you can set to user's timezone string.
    eg. You can do ``Configure::write('Config.timezone', 'Europe/Paris')``.
    If a method of ``CakeTime`` class is called with ``$timezone`` parameter as null and 'Config.timezone' is set,
    then the value of 'Config.timezone' will be used. This feature allows you to set user's timezone just once
    instead of passing it each time in function calls.

Dispatcher Filters
==================

Event listeners can now be attached to the dispatcher calls, those will have the
ability to change the request information or the response before it is sent to
the client. Check the full documentation for this new features in
:doc:`/development/dispatch-filters`
 

Caching
=======

Redis Engine
------------

A new caching engine was added using the `phpredis extension <https://github.com/nicolasff/phpredis>`_
it is configured similarly to the Memcache engine. 

Cache groups
------------

It is now possible to tag or label cache keys under groups. This makes it
simpler to mass-delete cache entries associated to the same label. Groups are
declared at configuration time when creating the cache engine::

    <?php
    Cache::config(array(
        'engine' => 'Redis',
        ...
        'groups' => array('post', 'comment', 'user')
    ));

You can have as many groups as you like, but keep in mind they cannot be
dynamically modified.

A new ``Cache`` class method was added: ``clearGroup``. It takes the group name
and deletes all entries labeled with the same string.

Logging
-------

- The :php:class:`CakeLog` class now accepts the same log levels as defined in `RFC 5424 <http://tools.ietf.org/html/rfc5424>`_.  Several conveniences methods have also been added:

    * :php:meth:`CakeLog::emergency($message, $scope = array()`
    * :php:meth:`CakeLog::alert($message, $scope = array()`

- A third argument `$scope` has been added to `CakeLog::write`.  See :ref:`logging-scopes`.

- A new log engine: :php:class:`ConsoleLog` has been added.
