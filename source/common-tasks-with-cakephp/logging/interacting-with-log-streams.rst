4.6.4 Interacting with log streams
----------------------------------

You can introspect the configured streams with
``CakeLog::configured()``. The return of ``configured()`` is an
array of all the currently configured streams. You can remove
streams using ``CakeLog::drop($key)``. Once a log stream has been
dropped it will no longer receive messages.
