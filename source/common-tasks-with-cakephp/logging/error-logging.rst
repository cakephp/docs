4.6.5 Error logging
-------------------

Errors are now logged when ``Configure::write('debug', 0);``. You
can use ``Configure::write('log', $val)``, to control which errors
are logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.

4.6.5 Error logging
-------------------

Errors are now logged when ``Configure::write('debug', 0);``. You
can use ``Configure::write('log', $val)``, to control which errors
are logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.
