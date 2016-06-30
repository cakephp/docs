错误处理
########

2.0中 ``Object::cakeError()`` 已经被移除。被很多异常处理取代。
所有的核心类中之前被命名为cakeError，现在会抛出异常。这让你要么在应用程序的代码中处理错误
要么使用内建的异常处理来处理它们。

在CakePHP 2.0中有更多的关于错误和异常处理的控制。可以配置用哪些方法设置为默认的错误处理程序
和异常处理程序。


错误配置
========

错误配置在应用程序的 ``app/Config/core.php`` 文件中，可以定义一个当每次程序遇到错误被触发的回调函数。
异常配置部分见 :doc:`/development/exceptions` ，回调函数可以是任何PHP调用的函数，也可以是匿名函数。
默认的错误处理配置可以是这样::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

有5个内置的选项来配置错误处理:

* ``handler`` - callback - 处理错误的回调函数，可以设置为任何的可调用的类型，包括匿名函数。
* ``level`` - int - 希望捕获的错误等级，使用php内建的错误常量或数字代号。
* ``trace`` - boolean - 是否在log文件中记录错误的堆栈跟踪。堆栈跟踪会在每次错误后被记录。当查找错误在何地/何时发生很有用。
* ``consoleHandler`` - callback - 当运行在命令行中处理错误的回调函数。如果未定义，会使用CakePHP默认的处理方法。

默认下，当 ``debug`` > 0才会显示错误内容，当debug = 0才会记录日志错误。
这两种情况受 ``Error.level`` 控制。致命错误处理独立于 ``debug`` 等级或 ``Error.level`` 配置，
但是结果与基于 ``debug`` 等级不同。

.. note::

    如果使用自定义错误处理，并不会影响追踪设置，除非指定错误处理函数。

.. versionadded:: 2.2
    ``Error.consoleHandler`` 选项

.. versionchanged:: 2.2
    ``Error.handler`` 和 ``Error.consoleHandler`` 同样会接收致命错误代码。默认会显示internal server error
    的页面错误(当` `debug`` 禁用)或包含相关文件，行的页面，(当启用 ``debug`` )。

创建自己的错误处理
==================

可以从任何回调类型创建一个错误处理程序。例如可以
创建一个为 ``AppError`` 的类来处理你的错误。需要这么做::

    //in app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //in app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //in app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            echo 'There has been an error!';
        }
    }

当每次发生错误时，这个类/方法将输出'There has been an error!'。由于可以定义一个错误处理作为任何回调类型，
在PHP5.3或更高版本可以使用一个匿名函数。 ::

    Configure::write('Error.handler', function($code, $description, $file = null, $line = null, $context = null) {
        echo 'Oh no something bad happened';
    });

切记,配置的错误处理程序捕获到的错误是php错误。
如果你需要自定义错误处理,可能同样需要配置异常 :doc:`/development/exceptions`。

改变致命错误行为
================

从CakePHP 2.2 起 ``Error.handler`` 同样接收代码导致的致命错误。如果不想显示cake的错误页面，可以重写::

    //in app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //in app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //in app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            list(, $level) = ErrorHandler::mapErrorCode($code);
            if ($level === LOG_ERR) {
                // Ignore fatal error. It will keep the PHP error message only
                return false;
            }
            return ErrorHandler::handleError($code, $description, $file, $line, $context);
        }
    }

若要保持默认的致命错误行为，可以自定义处理中调用 ``ErrorHandler::handleFatalError()``。

.. meta::
    :title lang=zh: Error Handling
    :keywords lang=zh: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error
