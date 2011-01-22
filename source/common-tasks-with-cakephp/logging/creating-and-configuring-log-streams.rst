4.6.3 Creating and configuring log streams
------------------------------------------

Log stream handlers can be part of your application, or part of
plugins. If for example you had a database logger called
``DataBaseLogger``. As part of your application it would be placed
in ``app/libs/log/data_base_logger.php``. As part of a plugin it
would be placed in
``app/plugins/my_plugin/libs/log/data_base_logger.php``. When
configured ``CakeLog`` will attempt to load Configuring log streams
is done by calling ``CakeLog::config()``. Configuring our
DataBaseLogger would look like

::

    //for app/libs
    CakeLog::config('otherFile', array(
        'engine' => 'DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));
    
    //for plugin called LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

When configuring a log stream the ``engine`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log stream's constructor as an array.

::

    class DataBaseLogger {
        function __construct($options = array()) {
            //...
        }
    }

CakePHP has no requirements for Log streams other than that they
must implement a ``write`` method. This write method must take two
parameters ``$type, $message`` in that order. ``$type`` is the
string type of the logged message, core values are ``error``,
``warning``, ``info`` and ``debug``. In addition you can define
your own types by using them when you call ``CakeLog::write``.

It should be noted that you will encounter errors when trying to
configure application level loggers from ``app/config/core.php``.
This is because paths are not yet bootstrapped. Configuring of
loggers should be done in ``app/config/bootstrap.php`` to ensure
classes are properly loaded.
