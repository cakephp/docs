CounterCache Tool
#################

The CounterCacheCommand provides a CLI tool for rebuilding the counter caches
in your application and plugin models. It can be used in maintenance and
recovery operations, or to populate new counter caches added to your
application.

.. code-block:: console

   bin/cake counter_cache --assoc Comments Articles

This would rebuild the ``Comments`` related counters on the ``Articles`` table.
For very large tables you may need to rebuild counters in batches. You can use
the ``--limit`` and ``--page`` options to incrementally rebuild counter state.

.. code-block:: console

   bin/cake counter_cache --assoc Comments --limit 100 --page 2 Articles

When ``limit`` and ``page`` are used, records will be ordered by the table's
primary key.

.. versionadded:: 5.2.0
