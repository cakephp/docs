エラーハンドリング
##################

..
  Error Handling

2.0 で ``Object::cakeError()`` は削除されました。代わりに、たくさんの exception が追加されました。
かつてはすべてのコアクラスが cakeError を呼んでいましたが、いまでは exception を投げています。
あなたはアプリケーションコードの中でエラーをハンドルすることも、それを処理するための例外ハンドラを構築することもできるのです。

..
  For 2.0 ``Object::cakeError()`` has been removed. Instead it has been replaced with
  a number of exceptions.  All of the core classes that previously called cakeError
  are now throwing exceptions.  This lets you either choose to handle the errors
  in your application code, or let the built in exception handling deal with them.

CakePHP 2.0 ではエラーや例外をハンドルするための制御がかつてないほど数多く存在しています。
configure を使って、好きなメソッドをデフォルトのエラーハンドラや例外ハンドラとして設定しておくことができます。

..
  There is more control than ever for error and exception handling in CakePHP 2.0.
  You can configure which methods you want to set as the default error handler,
  and exception handler using configure.

エラーの設定
============

..
  Error configuration

エラーの設定はあなたのアプリケーションの ``app/Config/core.php`` の中で行われています。
あなたのアプリケーションが PHP エラー（例外については :doc:`/development/exceptions` にて別で説明します）を発生させるたびに呼び出されるコールバックを定義することができます。
コールバックは PHP が呼ぶことができるものなら無名関数であってもかまいません。
エラーをハンドルするデフォルトの設定は以下のようになっています::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

..
  Error configuration is done inside your application's ``app/Config/core.php``
  file.  You can define a callback to be fired each time your application triggers
  any PHP error - exceptions are handled :doc:`/development/exceptions` separately.
  The callback can be any PHP callable, including an anonymous function.  The 
  default error handling configuration looks like::

エラーのハンドラを設定する際に使えるオプションが５つあります:

* ``handler`` - コールバック - エラーをハンドルするコールバックです。無名関数を含め、どんな種類の関数でもセット可能です。
* ``level`` - int - 捉えたいエラーのレベルです。PHP エラーの組み込み定数やビットマスクを使って、必要とするエラーレベルを選択することができます。
* ``trace`` - boolean - ログファイルにスタックトレースを含めるかどうかです。スタックトレースはそれぞれのエラーのあとに書かれることになります。これがあれば、どこで、いつエラーが発生したのか調べやすくなります。
* ``consoleHandler`` - コールバック - コンソールでの実行中に発生したエラーをハンドルするコールバックです。未指定なら CakePHP のデフォルトハンドラが使われます。

..
  You have 5 built-in options when configuring error handlers:
  * ``handler`` - callback - The callback to handle errors. You can set this to any
    callable type, including anonymous functions.
  * ``level`` - int - The level of errors you are interested in capturing. Use the 
    built-in php error constants, and bitmasks to select the level of error you 
    are interested in.
  * ``trace`` - boolean - Include stack traces for errors in log files.  Stack traces 
    will be included in the log after each error.  This is helpful for finding 
    where/when errors are being raised.
  * ``consoleHandler`` - callback - The callback used to handle errors when
    running in the console.  If undefined, CakePHP's default handlers will be
    used.

デフォルトでは、エラーハンドラは ``debug`` > 0 の場合にエラーを表示し、``debug`` = 0 の場合にログに出力します。
どちらの場合も捉えられるエラーのタイプは ``Error.level`` で制御します。
致命的なエラーのハンドラは、``debug`` レベルや ``Error.level`` の設定に関係なく呼び出されますが、その結果は ``debug`` レベルに基づいて変わります。

..
  ErrorHandler by default, displays errors when ``debug`` > 0, and logs errors when 
  debug = 0.  The type of errors captured in both cases is controlled by ``Error.level``.
  The fatal error handler will be called independent of ``debug`` level or ``Error.level``
  configuration, but the result will be different based on ``debug`` level.

.. note::

    独自のエラーハンドラを使う場合は、トレースの設定をしても（エラーをハンドルする関数内でそれを扱わない限り）何も起こりません。

..
    If you use a custom error handler, the trace setting will have no effect, 
    unless you refer to it in your error handling function.

.. versionadded:: 2.2
    ``Error.consoleHandler`` オプションは 2.2 で追加されました。

..
    The ``Error.consoleHandler`` option was added in 2.2.

.. versionchanged:: 2.2
    ``Error.handler`` と ``Error.consoleHandler`` は fatal なエラーコードも受け取ることになります。デフォルトの振る舞いは（``debug`` が無効なら） internal server error のページを表示するか、もしくは、（``debug`` が有効なら）エラーメッセージ、ファイル名、行番号を伴ったページを表示するというものです。

..
    The ``Error.handler`` and ``Error.consoleHandler`` will receive the fatal error
    codes as well. The default behavior is show a page to internal server error
    (``debug`` disabled) or a page with the message, file and line (``debug`` enabled).


独自のエラーハンドラを作成する
==============================

..
  Creating your own error handler

エラーハンドラはどのような種類のコールバックを使ってでも作ることができます。たとえば、``AppError`` というクラスをエラーをハンドルするのに使うことができます。その場合は次のようにすることになるでしょう::

    //app/Config/core.php の中で
    Configure::write('Error.handler', 'AppError::handleError');

    //app/Config/bootstrap.php の中で
    App::uses('AppError', 'Lib');

    //app/Lib/AppError.php の中で
    class AppError {
        public static function handleError($code, $description, $file = null, $line = null, $context = null) {
            echo 'エラー発生！';
        }
    }

..
  You can create an error handler out of any callback type.  For example you could 
  use a class called ``AppError`` to handle your errors.  The following would 
  need to be done::

このクラス／メソッドはエラーが発生するたびに「エラー発生！」と表示します。
どのような種類のコールバックでも定義することができますので、PHP5.3 以降をお使いなのであれば無名関数を使用することもできます::

    Configure::write('Error.handler', function($code, $description, $file = null, $line = null, $context = null) {
        echo 'おっと、良くない事態発生';
    });

..
  This class/method will print out 'There has been an error!' each time an error 
  occurs.  Since you can define an error handler as any callback type, you could
  use an anonymous function if you are using PHP5.3 or greater.::

重要なことなので思い出していただきたいのは、設定されたエラーハンドラにより捉えられるエラーは PHP エラーであり、カスタムエラーをハンドルする必要があるなら、 :doc:`/development/exceptions` の設定も扱いたくなるかもしれないということです。

..
  It is important to remember that errors captured by the configured error handler will be php
  errors, and that if you need custom error handling, you probably also want to configure
  :doc:`/development/exceptions` handling as well.


致命的(fatal)エラーの振る舞いを変える
=====================================

..
  Changing fatal error behavior

CakePHP 2.2 以降、``Error.handler`` は致命的(fatal)なエラーコードも受け取るようになりました。
もしも cake のエラーページを表示させたくないのなら、次のように処理を上書くことができます::

    //app/Config/core.php の中で
    Configure::write('Error.handler', 'AppError::handleError');

    //app/Config/bootstrap.php の中で
    App::uses('AppError', 'Lib');

    //app/Lib/AppError.php の中で
    class AppError {
        public static function handleError($code, $description, $file = null, $line = null, $context = null) {
            list(, $level) = ErrorHandler::mapErrorCode($code);
            if ($level === LOG_ERROR) {
                // 致命的エラーを無視する。PHP エラーのメッセージのみとする。
                return false;
            }
            return ErrorHandler::handleError($code, $description, $file, $line, $context);
        }
    }

..
  Since CakePHP 2.2 the ``Error.handler`` will receive the fatal error codes as well.
  If you do not want to show the cake error page, you can override it like::

致命的エラーのデフォルトの振る舞いを維持したいなら、独自のハンドラから ``ErrorHandler::handleFatalError()`` を呼び出すことができます。

..
  If you want to keep the default fatal error behavior, you can call ``ErrorHandler::handleFatalError()``
  from your custom handler.

.. meta::
    :title lang=en: Error Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error
