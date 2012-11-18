ログの記録(Logging)
###################

CakePHP
コア「Configure」クラスの設定は、内部で何が起きているのかを知るための有益な手段です。しかしながら、起きていることの情報をディスクにログデータとして保存したい場合が出てくるでしょう。SOAP
や AJAX
といった技術に依存することが多くなるにつれ、デバッグはより困難になります。

ログの記録(\ *Logging*)は、アプリケーションが実行されていくにつれ何が起きているのかを知るための手段です。たとえば、「実行された検索の条件は何か？」「ユーザに表示されたエラーの種類は何なのか？」「ある特定のクエリが出現する頻度はどれくらいか？」といったことです。

CakePHP
データをログに記録するのは簡単で、ほとんどのクラスの親となっている「Object」クラスで定義されている「log()」関数を呼び出すだけです。Model、Controller、Component
他、ほとんど全ての CakePHP
のクラス中で、この機能を使ってデータをログに記録できます。

log 関数を使う
==============

「log()」
関数にはふたつの引数をあたえます。ひとつめは、ログファイルに記録したいメッセージです。デフォルトでは、ログは
app/tmp/logs/error.log に記録されます。

::

    // CakePHP のクラス中で log 関数を実行する
     
    $this->log("Something didn't work!");
     
    // app/tmp/logs/error.log に、次のように追加される
     
    2007-11-02 10:22:02 Error: Something didn't work!

第二引数では、記録するログのタイプを定義します。
指定しなかった場合、前述したエラーログのパスに書き出す LOG\_ERROR
がデフォルトで定義されます。もし LOG\_DEBUG
に設定した場合は、デバッグログとして app/tmp/logs/debug.log
にログが出力されます。

::

    // CakePHP のクラス中で log 関数を実行する
     
    $this->log('A debugging message.', LOG_DEBUG);
     
    // error.log ではなく app/tmp/logs/debug.log に、次のように追加される
    //Results in this being appended to app/tmp/logs/debug.log (rather than error.log)
     
    2007-11-02 10:22:02 Error: A debugging message.

ログ機能を正しく動作させるためには、ウェブサーバが実行されるユーザが
app/tmp ディレクトリに書き込み権限を持つ必要があります。

Using the default FileLog class
===============================

While CakeLog can be configured to write to a number of user configured
logging adapters, it also comes with a default logging configuration.
This configuration is identical to how CakeLog behaved in CakePHP 1.2.
The default logging configuration will be used any time there are *no
other* logging adapters configured. Once a logging adapter has been
configured you will need to also configure FileLog if you want file
logging to continue.

As its name implies FileLog writes log messages to files. The type of
log message being written determines the name of the file the message is
stored in. If a type is not supplied, LOG\_ERROR is used which writes to
the error log. The default log location is ``app/tmp/logs/$type.log``

::

    //Executing this inside a CakePHP class:
     $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Something didn't work!

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file you
wish to write logs to.

::

    //called statically
    CakeLog::write('activity', 'A special message for activity logging');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    2007-11-02 10:22:02 Activity: A special message for activity logging

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
``CakeLog::config()``. FileLog accepts a ``path`` which allows for
custom paths to be used.

::

    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ));

Creating and configuring log streams
====================================

Log stream handlers can be part of your application, or part of plugins.
If for example you had a database logger called ``DataBaseLogger`` as
part of your application it would be placed in
``app/libs/log/data_base_logger.php``; as part of a plugin it would be
placed in ``app/plugins/my_plugin/libs/log/data_base_logger.php``. When
configured, ``CakeLog`` will attempt to load. Configuring log streams is
done by calling ``CakeLog::config()``. Configuring our DataBaseLogger
would look like

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

When configuring a log stream the ``engine`` parameter is used to locate
and load the log handler. All of the other configuration properties are
passed to the log stream's constructor as an array.

::

    class DataBaseLogger {
        function __construct($options = array()) {
            //...
        }
    }

CakePHP has no requirements for Log streams other than that they must
implement a ``write`` method. This write method must take two parameters
``$type, $message`` in that order. ``$type`` is the string type of the
logged message, core values are ``error``, ``warning``, ``info`` and
``debug``. In addition you can define your own types by using them when
you call ``CakeLog::write``.

It should be noted that you will encounter errors when trying to
configure application level loggers from ``app/config/core.php``. This
is because paths are not yet bootstrapped. Configuring of loggers should
be done in ``app/config/bootstrap.php`` to ensure classes are properly
loaded.

Interacting with log streams
============================

You can introspect the configured streams with
``CakeLog::configured()``. The return of ``configured()`` is an array of
all the currently configured streams. You can remove streams using
``CakeLog::drop($key)``. Once a log stream has been dropped it will no
longer receive messages.

Error logging
=============

Errors are now logged when ``Configure::write('debug', 0);``. You can
use ``Configure::write('log', $val)``, to control which errors are
logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.
