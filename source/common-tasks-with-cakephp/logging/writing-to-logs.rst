4.6.1 Writing to logs
---------------------

Writing to the log files can be done in 2 different ways. The first
is to use the static ``CakeLog::write()`` method.

::

    CakeLog::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any
class that extends ``Object``. Calling log() will internally call
CakeLog::write().

::

    //Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are written to sequentially each time
``CakeLog::write()`` is called. You do not need to configure a
stream in order to use logging. If no streams are configured when
the log is written to, a ``default`` stream using the core
``FileLog`` class will be configured to output into
``app/tmp/logs/`` just as CakeLog did in CakePHP 1.2
