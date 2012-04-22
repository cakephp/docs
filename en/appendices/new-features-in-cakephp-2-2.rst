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
    then thevalue of 'Config.timezone' will be used. This feature allows you to set user's timezone just once
    instead of passing it each time in function calls.

Dispatcher Filters
==================

Event listeners can now be attached to the dispatcher calls, those will have the
ability to change the request information or the response before it is sent to
the client. Check the full documentation for this new features in
:doc:`/development/dispatch-filters`
 
