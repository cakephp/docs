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

Paginating custom finders will now return correct counts, see Model changes for more info.

Utility
=======

CakeTime
--------

The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter in all relevant functions.
So instead of numeric offset you can now pass in a timezone string or DateTimeZone object.
Passing numeric offsets for ``$timezone`` parameter is still possible for backwards compatibility.
