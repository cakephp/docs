エラーハンドリング
##################

2.0 で ``Object::cakeError()`` は削除されました。代わりに、たくさんの例外が追加されました。
かつてはすべてのコアクラスが cakeError を呼んでいましたが、いまでは例外を投げています。
あなたはアプリケーションコードの中でエラーをハンドルすることも、それを処理するための例外ハンドラを
構築することもできるのです。

CakePHP 2.0 ではエラーや例外をハンドルするための制御がかつてないほど数多く存在しています。
Configure を使って、好きなメソッドをデフォルトのエラーハンドラや例外ハンドラとして
設定しておくことができます。

エラーの設定
============

エラーの設定はあなたのアプリケーションの ``app/Config/core.php`` の中で行われています。
あなたのアプリケーションが PHP エラー（例外については :doc:`/development/exceptions` にて
別で説明します）を発生させるたびに呼び出されるコールバックを定義することができます。
コールバックは PHP が呼ぶことができるものなら無名関数であってもかまいません。
エラーをハンドルするデフォルトの設定は以下のようになっています。 ::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

エラーのハンドラを設定する際に使えるオプションが５つあります:

* ``handler`` - コールバック - エラーをハンドルするコールバックです。無名関数を含め、
  どんな種類の関数でもセット可能です。
* ``level`` - int - 捉えたいエラーのレベルです。PHP エラーの組み込み定数やビットマスクを使って、
  必要とするエラーレベルを選択することができます。
* ``trace`` - boolean - ログファイルにスタックトレースを含めるかどうかです。スタックトレースは
  それぞれのエラーのあとに書かれることになります。これがあれば、どこで、いつエラーが発生したのか
  調べやすくなります。
* ``consoleHandler`` - コールバック - コンソールでの実行中に発生したエラーをハンドルする
  コールバックです。未指定なら CakePHP のデフォルトハンドラが使われます。

デフォルトでは、エラーハンドラは ``debug`` > 0 の場合にエラーを表示し、``debug`` = 0 の場合に
ログに出力します。どちらの場合も捉えられるエラーのタイプは ``Error.level`` で制御します。
致命的なエラーのハンドラは、``debug`` レベルや ``Error.level`` の設定に関係なく呼び出されますが、
その結果は ``debug`` レベルに基づいて変わります。

.. note::

    独自のエラーハンドラを使う場合は、トレースの設定をしても（エラーをハンドルする関数内で
    それを扱わない限り）何も起こりません。

.. versionadded:: 2.2
    ``Error.consoleHandler`` オプションは 2.2 で追加されました。

.. versionchanged:: 2.2
    ``Error.handler`` と ``Error.consoleHandler`` は fatal なエラーコードも受け取ることに
    なります。デフォルトの振る舞いは（``debug`` が無効なら） internal server error のページを
    表示するか、もしくは、（``debug`` が有効なら）エラーメッセージ、ファイル名、行番号を伴った
    ページを表示するというものです。

独自のエラーハンドラを作成する
==============================

エラーハンドラはどのような種類のコールバックを使ってでも作ることができます。たとえば、
``AppError`` というクラスをエラーをハンドルするのに使うことができます。
その場合は次のようにすることになるでしょう。 ::

    //app/Config/core.php の中で
    Configure::write('Error.handler', 'AppError::handleError');

    //app/Config/bootstrap.php の中で
    App::uses('AppError', 'Lib');

    //app/Lib/AppError.php の中で
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            echo 'エラー発生！';
        }
    }

このクラス／メソッドはエラーが発生するたびに「エラー発生！」と表示します。どのような種類の
コールバックでも定義することができますので、PHP5.3 以降をお使いなのであれば無名関数を
使用することもできます。 ::

    Configure::write('Error.handler', function($code, $description, $file = null,
        $line = null, $context = null) {
        echo 'おっと、良くない事態発生';
    });

重要なことなので思い出していただきたいのは、設定されたエラーハンドラにより捉えられるエラーは
PHP エラーです。 :doc:`/development/exceptions` は、別に処理されます。

致命的 (fatal) エラーの振る舞いを変える
=======================================

CakePHP 2.2 以降、 ``Error.handler`` は致命的 (fatal) なエラーコードも受け取るようになりました。
もしも cake のエラーページを表示させたくないのなら、次のように処理を上書くことができます。 ::

    //app/Config/core.php の中で
    Configure::write('Error.handler', 'AppError::handleError');

    //app/Config/bootstrap.php の中で
    App::uses('AppError', 'Lib');

    //app/Lib/AppError.php の中で
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            list(, $level) = ErrorHandler::mapErrorCode($code);
            if ($level === LOG_ERR) {
                // 致命的エラーを無視する。PHP エラーのメッセージのみとする。
                return false;
            }
            return ErrorHandler::handleError(
                $code,
                $description,
                $file,
                $line,
                $context
            );
        }
    }

致命的エラーのデフォルトの振る舞いを維持したいなら、独自のハンドラから
``ErrorHandler::handleFatalError()`` を呼び出すことができます。


.. meta::
    :title lang=ja: Error Handling
    :keywords lang=ja: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error
