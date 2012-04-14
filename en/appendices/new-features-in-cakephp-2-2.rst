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

- Dbo datasources now supports real transactions.

Pagination
==========

Paginating custom finders will now return correct counts, see Model changes for more info.