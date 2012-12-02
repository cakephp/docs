例外(Exception)
###############

..
  Exceptions

例外(Exception)はあなたのアプリケーションの中で、さまざまな用途で使うことができるものです。
CakePHP ではロジックの間違いや誤用を指し示すのに内部的に例外を使っています。
CakePHP が発生させるすべての例外は :php:exc:`CakeException` を継承しており、
この基底クラスを継承したクラス／タスク固有の例外が存在します。

..
  Exceptions can be used for a variety of uses in your application.  CakePHP uses
  exceptions internally to indicate logic errors or misuse.  All of the exceptions
  CakePHP raises extend :php:exc:`CakeException`, and there are class/task
  specific exceptions that extend this base class.

CakePHP はまた、HTTP エラーで使うことのできる数多くの例外クラスを提供します。
詳細は :ref:`built-in-exceptions` のセクションを参照してください。

..
  CakePHP also provides a number of exception classes that you can use for HTTP
  errors.  See the section on :ref:`built-in-exceptions` for more information.

例外の設定
==========

..
  Exception configuration

例外の設定として使えるキーがいくつかあります::

    Configure::write('Exception', array(
        'handler' => 'ErrorHandler::handleException',
        'renderer' => 'ExceptionRenderer',
        'log' => true
    ));

..
  There are a few keys available for configuring exceptions::

* ``handler`` - callback - 例外をハンドルするコールバック。無名関数を含め、どんなコールバックタイプでも設定可能。
* ``renderer`` - string - キャッチされなかった例外をレンダリングする役目を担うクラス。
  独自のクラスを使う場合には、app/Lib/Error の下にそのクラスのファイルを置いてください。
  このクラスは ``render()`` メソッドを実装している必要があります。
* ``log`` - boolean - true を指定したなら、例外とそのスタックトレースが CakeLog に出力されます。
* ``consoleHandler`` - callback - コンソールで実行された場合に、例外をハンドルするのに使われるコールバック。未定義なら、CakePHP のデフォルトハンドラが使われます。

..
  * ``handler`` - callback - The callback to handle exceptions. You can set this to
    any callback type, including anonymous functions.
  * ``renderer`` - string - The class responsible for rendering uncaught exceptions.
    If you choose a custom class you should place the file for that class in app/Lib/Error.
    This class needs to implement a ``render()`` method.
  * ``log`` - boolean - When true, exceptions + their stack traces will be logged
    to CakeLog.
  * ``consoleHandler`` - callback - The callback used to handle exceptions, in a
    console context.  If undefined, CakePHP's default handler will be used.

例外のレンダリングはデフォルトでは HTML ページですが、設定を変更することでハンドラもしくはレンダラをカスタマイズできます。
ハンドラを変更した場合は例外のハンドルプロセスを完全に制御することができ、
一方、レンダラを変更した場合は、出力する形式や内容を簡単に変更できます。
こうして、アプリケーション固有の例外ハンドリングを組み込むことができるのです。

..
  Exception rendering by default displays an HTML page, you can customize either the
  handler or the renderer by changing the settings.  Changing the handler, allows
  you to take full control over the exception handling process, while changing
  the renderer allows you to easily change the output type/contents, as well as
  add in application specific exception handling.

.. versionadded:: 2.2
    ``Exception.consoleHandler`` オプションは 2.2 で追加されました。

..
    The ``Exception.consoleHandler`` option was added in 2.2.

例外クラス
==========

..
  Exception classes

CakePHP には多くの例外クラスが存在します。
旧来の ``cakeError()`` によるエラーメッセージはそれぞれの例外に置き代わっています。
例外は、継承したり、ロジックを組み込んだりという柔軟さも提供してくれます。
組み込みの例外ハンドリングでは、キャッチされなかった例外をどんなものであれキャッチし、有益な情報を表示します。
400番台のコードを特に使わない例外なら、Internal Server Error として扱われます。

..
  There are a number of exception classes in CakePHP.  Each exception replaces
  a ``cakeError()`` error messages from the past.  Exceptions offer additional
  flexibility in that they can be extended and contain some logic.  The built
  in exception handling will capture any uncaught exceptions and render a useful
  page.  Exceptions that do not specifically use a 400 range code, will be
  treated as an Internal Server Error.

.. _built-in-exceptions:

CakePHP の組み込み例外
======================

..
  Built in Exceptions for CakePHP

内部的なフレームワーク例外の他にも、CakePHP 内部の組み込み例外で、HTTP 方式の例外がいくつか存在します。

..
  There are several built-in exceptions inside CakePHP, outside of the
  internal framework exceptions, there are several
  exceptions for HTTP methods

.. php:exception:: BadRequestException

    400 Bad Request エラーを発生させるために使います。

..
    Used for doing 400 Bad Request error.

.. php:exception::UnauthorizedException

    401 Not found エラーを発生させるために使います。

..
    Used for doing a 401 Not found error.

.. php:exception:: ForbiddenException

    403 Forbidden エラーを発生させるために使います。

..
    Used for doing a 403 Forbidden error.

.. php:exception:: NotFoundException

    404 Not found エラーを発生させるために使います。

..
    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    405 Method Not Allowed エラーを発生させるために使います。

..
    Used for doing a 405 Method Not Allowed error.

.. php:exception:: InternalErrorException

    500 Internal Server Error を発生させるために使います。

..
    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    501 Not Implemented Errors を発生させるために使います。

..
    Used for doing a 501 Not Implemented Errors.

あなたのコントローラが失敗のステータスや HTTP エラーを示すために、これらの例外を投げることができます。
下記は、見つからなかったものがある場合の、 404 ページをレンダリングする HTTP 例外の使用例です::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('この Post は見つかりませんでした');
        }
        $this->set('post', $post);
    }

..
  You can throw these exceptions from you controllers to indicate failure states,
  or HTTP errors. An example use of the HTTP exceptions could be rendering 404
  pages for items that have not been found::

HTTP エラー用の例外を使うことで、あなたのコードを奇麗に保つことができ、RESTフルなレスポンスをクライアントのアプリケーションとユーザに返すことができるのです。

..
  By using exceptions for HTTP errors, you can keep your code both clean, and give
  RESTful responses to client applications and users.

また、次に挙げるフレームワーク層の例外を使うこともできます。これらは CakePHP コアコンポーネントの多くから投げられているものです。

..
  In addition, the following framework layer exceptions are available, and will
  be thrown from a number of CakePHP core components:

.. php:exception:: MissingViewException

    選ばれた view ファイルが見つかりません。

..
    The chosen view file could not be found.

.. php:exception:: MissingLayoutException

    選ばれた layout が見つかりません。

..
    The chosen layout could not be found.

.. php:exception:: MissingHelperException

    ヘルパーが見つかりません。

..
    A helper was not found.

.. php:exception:: MissingBehaviorException

    設定で指定された behavior が見つかりません。

..
    A configured behavior could not be found.

.. php:exception:: MissingComponentException

    設定で指定されたコンポーネントが見つかりません。

..
    A configured component could not be found.

.. php:exception:: MissingTaskException

    設定で指定されたタスクが見つかりません。

..
    A configured task was not found.

.. php:exception:: MissingShellException

    Shell クラスが見つかりません。

..
    The shell class could not be found.

.. php:exception:: MissingShellMethodException

    選択された Shell クラスにこの名前のメソッドはありません。

..
    The chosen shell class has no method of that name.

.. php:exception:: MissingDatabaseException

    設定で指定されたデータベースが見つかりません。

..
    The configured database is missing.

.. php:exception:: MissingConnectionException

    モデルのコネクションが見つかりません。

..
    A model's connection is missing.

.. php:exception:: MissingTableException

    モデルのテーブルが見つかりません。

..
    A model's table is missing.

.. php:exception:: MissingActionException

    要求されたコントローラのアクションが見つかりません。

..
    The requested controller action could not be found.

.. php:exception:: MissingControllerException

    要求されたコントローラが見つかりません。

..
    The requested controller could not be found.

.. php:exception:: PrivateActionException

    private なアクションにアクセスしています。
    private や protected、_ で始まるアクションにアクセスしているか、prefix されたルートに誤ってアクセスしようとしています。

..
    Private action access.  Either accessing
    private/protected/_ prefixed actions, or trying
    to access prefixed routes incorrectly.

.. php:exception:: CakeException

    CakePHP での例外の基底クラスです。CakePHP によって投げられるフレームワーク層のすべての例外はこのクラスを継承しています。

..
    Base exception class in CakePHP.  All framework layer exceptions thrown by
    CakePHP will extend this class.

これらの例外クラスはすべて :php:exc:`CakeException` を継承しています。
CakeException を継承することで、独自の 'フレームワーク' エラーを作ることができます。
CakePHP が投げる標準的な例外もすべて、CakeException を継承しています。

..
  These exception classes all extend :php:exc:`CakeException`.
  By extending CakeException, you can create your own 'framework' errors.
  All of the standard Exceptions that CakePHP will throw also extend CakeException.

.. versionadded:: 2.3
    CakeBaseException が追加されました。

..
    CakeBaseException was added

.. php:exception:: CakeBaseException

    CakePHP での例外の基底クラスです。
    前述の CakeExceptions と HttpExceptions はすべて、このクラスを継承しています。

..
    Base exception class in CakePHP.
    All CakeExceptions and HttpExceptions above extend this class.

.. php:method:: responseHeader($header = null, $value = null)

    :php:func:`CakeResponse::header()` を参照してください。

..
    See :php:func:`CakeResponse::header()`

HTTP 例外と Cake 例外はすべて、CakeBaseException クラスを継承しており、このクラスはレスポンスにヘッダーを加えるメソッドを持っています。
405 MethodNotAllowedException を投げる場合について例を挙げると、RFC2616 ではこう言っています：
「レスポンスは、要求されたリソースへの正しいメソッドのリストを含む Allow ヘッダーを含有していなければ【なりません】。」

..
  All Http and Cake exceptions extend the CakeBaseException class, which has a method
  to add headers to the response. For instance when throwing a 405 MethodNotAllowedException
  the rfc2616 says:
  "The response MUST include an Allow header containing a list of valid methods for the requested resource."

コントローラでの HTTP 例外の使用
================================

..
  Using HTTP exceptions in your controllers

コントローラのアクションから失敗を示すために、 HTTP 関連のどの例外でも投げることができます。例::

    public function view($id) {
        $post = $this->Post->read(null, $id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

..
  You can throw any of the HTTP related exceptions from your controller actions
  to indicate failure states.  For example::

上記の例では、 :php:exc:`NotFoundException` をキャッチし、処理するために設定してある ``Exception.handler`` が呼び出されることになります。
これは、デフォルトではエラーページが生成され、例外がログに出力されます。

..
  The above would cause the configured ``Exception.handler`` to catch and
  process the :php:exc:`NotFoundException`.  By default this will create an error page,
  and log the exception.

.. _error-views:

例外のレンダラ
==============

..
  Exception Renderer

.. php:class:: ExceptionRenderer(Exception $exception)

ExceptionRenderer クラスは ``CakeErrorController`` を活用して、あなたのアプリケーションから投げられるすべての例外について、エラーページのレンダリングを処理します。

..
  The ExceptionRenderer class with the help of ``CakeErrorController`` takes care of rendering
  the error pages for all the exceptions thrown by you application.

エラーページの view は ``app/View/Errors/`` に置きます。
4xx、5xx エラー用の view ファイルはそれぞれ ``error400.ctp`` 、 ``error500.ctp`` が使われます。
必要に応じてこれらをカスタマイスすることができます。
デフォルトでは、``app/Layouts/default.ctp`` がエラーページにも使われます。
もし別のレイアウト、例えば ``app/Layouts/my_error.ctp`` を独自のエラーページとして使いたいという場合は、
単純に、それらのエラー view を編集して、``error400.ctp`` と ``error500.ctp`` に ``$this->layout = 'my_error';`` のステートメントを加えてください。

..
  The error page views are located at ``app/View/Errors/``. For all 4xx and 5xx errors
  the view files ``error400.ctp`` and ``error500.ctp`` are used respectively. You can 
  customize them as per your needs. By default your ``app/Layouts/default.ctp`` is used
  for error pages too. If for eg. you want to use another layout ``app/Layouts/my_error.ctp``
  for your error pages, then simply edit the error views and add the statement
  ``$this->layout = 'my_error';`` to the ``error400.ctp`` and ``error500.ctp``.

フレームワーク層の例外はそれぞれ、自身の view ファイルをコアテンプレートの中に持っていますが、
それらは開発時にのみ使われるものですから、カスタマイズを思い悩む必要はまったくありません。
デバッグモードが OFF の場合は、フレームワーク層の例外はすべて ``InternalErrorException`` に変換されます。

..
  Each framework layer exception has its own view file located in the core templates but
  you really don't need to bother customizing them as they are used only during development.
  With debug turned off all framework layer exceptions are converted to ``InternalErrorException``.

.. index:: application exceptions

独自のアプリケーション例外を作成する
====================================

..
  Creating your own application exceptions

組み込みの `SPL 例外 <http://php.net/manual/ja/spl.exceptions.php>`_ 、 ``Exception`` そのもの、 :php:exc:`CakeException` のいずれかを使って独自のアプリケーション例外を作ることができます。
Exception や SPL 例外を継承したアプリケーション例外は本番モードでは 500 エラーとして扱われます。
:php:exc:`CakeException` は特別で、 :php:exc:`CakeException` のオブジェクトはすべて、扱うコードに応じて 500 か 404 のどちらかのエラーを強制されます。
開発モードでは、:php:exc:`CakeException` のオブジェクトは単純にクラス名と一致する新しいテンプレートを必要とし、これにて有益な情報を提供します。
独自のアプリケーション次の例外が含まれていたなら::

    class MissingWidgetException extends CakeException {};

..
  You can create your own application exceptions using any of the built
  in `SPL exceptions <http://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
  itself, or :php:exc:`CakeException`.  Application exceptions that extend
  Exception or the SPL exceptions will be treated as 500 error in production mode.
  :php:exc:`CakeException` is special in that all :php:exc:`CakeException` objects
  are coerced into into either 500 or 404 errors depending on the code they use.
  When in development mode :php:exc:`CakeException` objects simply need a new template
  that matches the class name in order to provide useful information.  If your
  application contained the following exception::

``app/View/Errors/missing_widget.ctp`` を作成することにより、素晴らしい開発用エラーを提供させられます。
本番モードでは、上記のエラーは 500 エラーとして扱われます。
継承元の :php:exc:`CakeException` のコンストラクタにデータのハッシュマップを渡すことができます。
それらのハッシュマップは messageTemplate の中にも、開発モードでエラーを表示するのに使われる view の中にも、付け加えられます。
これにより、あなたのエラーによりたくさんのコンテキストを提供することで、豊富なデータを持つ例外を作ることができるのです。
また、ネイティブな ``__toString()`` メソッドで通常で使われることになるメッセージテンプレートを提供することができます::

    class MissingWidgetException extends CakeException {
        protected $_messageTemplate = '%s が見つかりません。';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));

..
  You could provide nice development errors, by creating
  ``app/View/Errors/missing_widget.ctp``.  When in production mode, the above
  error would be treated as a 500 error.  The constructor for :php:exc:`CakeException`
  has been extended, allowing you to pass in hashes of data.  These hashes are
  interpolated into the the messageTemplate, as well as into the view that is used
  to represent the error in development mode.  This allows you to create data rich
  exceptions, by providing more context for your errors.  You can also provide a message
  template which allows the native ``__toString()`` methods to work as normal::

組み込みの例外ハンドラでこれがキャッチされると、あなたのエラー view テンプレート内で変数 ``$widget`` の値を得ることができます。
また、例外を string にキャストしたり、例外の ``getMessage()`` メソッドを使ったりした場合は、 ``Pointy が見つかりません。`` が得られます。
これにより、CakePHP が内部的に使っているのと同じように、簡単に素早く、独自のリッチな開発用エラーが作成できるのです。

..
  When caught by the built in exception handler, you would get a ``$widget``
  variable in your error view template. In addition if you cast the exception
  as a string or use its ``getMessage()`` method you will get
  ``Seems that Pointy is missing.``. This allows you easily and quickly create
  your own rich development errors, just like CakePHP uses internally.


独自のステータスコードを作成する
--------------------------------

..
  Creating custom status codes

例外を生成する際にコードを変えることで、独自の HTTP ステータスコードを作成することができます::

    throw new MissingWidgetHelperException('それはここではありません', 501);

..
  You can create custom HTTP status codes by changing the code used when
  creating an exception::

上記ではレスポンスコード ``501`` を作成します。好きな HTTP ステータスコードを使うことができます。
開発モードで、あなたの例外が特にテンプレートを持っておらず、 ``500`` 以上のコードを使うなら、 ``error500`` テンプレートが使われることなります。
その他のコードの場合は ``error400`` テンプレートが使われることになります。
あなたの独自例外にエラーテンプレートを定義している場合は、開発モードならそのテンプレートが使われることになります。
本番モードでも、あなた独自の例外にロジックをハンドリングさせたいなら、次のセクションを参照してください。

..
  Will create a ``501`` response code, you can use any HTTP status code
  you want. In development, if your exception doesn't have a specific
  template, and you use a code equal to or greater than ``500`` you will
  see the ``error500`` template. For any other error code you'll get the
  ``error400`` template. If you have defined an error template for your
  custom exception, that template will be used in development mode.
  If you'd like your own exception handling logic even in production,
  see the next section.


あなた独自の例外ハンドラの継承と実装
====================================

..
  Extending and implementing your own Exception handlers

アプリケーション固有の例外ハンドラを実装する方法はいくつかあります。
方法により、例外ハンドリング処理の制御できる範囲に違いがあります。

..
  You can implement application specific exception handling in one of a
  few ways.  Each approach gives you different amounts of control over
  the exception handling process.

- ``Configure::write('Exception.handler', 'YourClass::yourMethod');`` をセットする方法。
- ``AppController::appError()`` を作成する方法。
- ``Configure::write('Exception.renderer', 'YourClass');`` をセットする方法。

..
  - Set ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
  - Create ``AppController::appError();``
  - Set ``Configure::write('Exception.renderer', 'YourClass');``

次のいくつかのセクションでは、さまざまな方法とそれらが持つメリットについて詳しく説明します。

..
  In the next few sections, we will detail the various approaches and the benefits each has.

`Exception.handler` を使って独自の例外ハンドラを作成する
========================================================

..
  Create your own Exception handler with `Exception.handler`

あなた独自の例外ハンドラを作成すれば、例外ハンドリング処理のすべてを完全に制御できるようになります。
選択したクラスは、あなたの ``app/Config/bootstrap.php`` でロードすべきものですので、どんな例外でもハンドリングすることができます。
どのようなコールバックタイプでも定義することができます。
``Exception.handler`` をセットすることにより、CakePHP は他のすべての例外設定を無視します。
独自の例外ハンドリングをセットアップする場合は次のようになります::

    // app/Config/core.php の中で
    Configure::write('Exception.handler', 'AppExceptionHandler::handle');

    // app/Config/bootstrap.php の中で
    App::uses('AppExceptionHandler', 'Lib');

    // app/Lib/AppExceptionHandler.php の中で
    class AppExceptionHandler {
        public static function handle($error) {
            echo 'Oh noes! ' . $error->getMessage();
            // ...
        }
        // ...
    }

..
  Creating your own exception handler gives you full control over the exception
  handling process.  The class you choose should be loaded in your
  ``app/Config/bootstrap.php``, so it's available to handle any exceptions. You can
  define the handler as any callback type. By settings ``Exception.handler`` CakePHP
  will ignore all other Exception settings.  A sample custom exception handling setup
  could look like::

``handleException`` の中ではどのようなコードでも走らせることができます。
上記の例では単純に「Oh noes! 」＋例外のメッセージを表示しています。
例外ハンドラはどのようなコールバックタイプでも（PHP 5.3 を使っているなら無名関数でも）定義することができます::

    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });

..
  You can run any code you wish inside ``handleException``.  The code above would
  simple print 'Oh noes! ' plus the exception message.  You can define exception
  handlers as any type of callback, even an anonymous function if you are
  using PHP 5.3::

独自の例外ハンドラを作成することで、アプリケーション例外についての独自のエラーハンドリングを提供することができます。
例外ハンドラとして提供されるメソッド内で、下記のようにすることができます::

    // app/Lib/AppErrorHandler.php の中で
    class AppErrorHandler {
        public static function handleException($error) {
            if ($error instanceof MissingWidgetException) {
                return self::handleMissingWidget($error);
            }
            // その他、各種処理
        }
    }

..
  By creating a custom exception handler you can provide custom error handling for
  application exceptions. In the method provided as the exception handler you
  could do the following::

.. index:: appError

AppController::appError() を使う
=================================

..
  Using AppController::appError();

独自の例外ハンドラを実装する代わりに、このメソッドを実装します。
これはそもそも下位互換のためのものであり、新しいアプリケーション用としては推奨されません。
このコントローラのメソッドは、デフォルトの例外レンダリングの代わりに呼ばれます。
唯一の引数には投げられた例外が渡されます。
このメソッドの中で独自のエラーハンドリングを実装します::

    class AppController extends Controller {
        public function appError($error) {
            // ここに独自ロジックを書きます。
        }
    }

..
  Implementing this method is an alternative to implementing a custom exception
  handler.  It's primarily provided for backwards compatibility, and is not
  recommended for new applications. This controller method is called instead of
  the default exception rendering.  It receives the thrown exception as its only
  argument.  You should implement your error handling in that method::

Exception.renderer を使って独自のレンダラを使用し、アプリケーション例外をハンドリングする
=========================================================================================

..
  Using a custom renderer with Exception.renderer to handle application exceptions

例外ハンドリングの制御はしたくないが、例外のレンダリングについては変更したいのならば、 ``Configure::write('Exception.renderer', 'AppExceptionRenderer');`` を使うことで、例外ページをレンダリングするクラスを選択することができます。
デフォルトでは、:php:class`ExceptionRenderer` が使われます。
独自の例外レンダラクラスは ``app/Lib/Error`` の中に置いてください。
もしくは、bootstrap にて指定された Lib のパスの中にある、 ``Error`` ディレクトリ内に置いてください。
独自の例外レンダリングクラスの中であなたはアプリケーション固有のエラーに特化したハンドリングを提供することができます::

    // app/Lib/Error/AppExceptionRenderer.php の中で
    App::uses('ExceptionRenderer', 'Error');

    class AppExceptionRenderer extends ExceptionRenderer {
        public function missingWidget($error) {
            echo 'おっと、widget が見つかりません！';
        }
    }

..
  If you don't want to take control of the exception handling, but want to change
  how exceptions are rendered you can use ``Configure::write('Exception.renderer',
  'AppExceptionRenderer');`` to choose a class that will render exception pages.
  By default :php:class`ExceptionRenderer` is used.  Your custom exception
  renderer class should be placed in ``app/Lib/Error``.  Or an ``Error```
  directory in any bootstrapped Lib path. In a custom exception rendering class
  you can provide specialized handling for application specific errors::

上記の例では、``MissingWidgetException`` 型のすべての例外をハンドリングし、独自の表示／ハンドリングロジックをそれら例外のために提供できます。
例外ハンドリングメソッドはハンドリングする例外を引数で受け取ります。

..
  The above would handle any exceptions of the type ``MissingWidgetException``,
  and allow you to provide custom display/handling logic for those application
  exceptions.  Exception handling methods get the exception being handled as
  their argument.

.. note::

    独自のレンダラはそのコンストラクタ内での例外を予期すべきであり、レンダリングメソッドを実装すべきです。
    そうしていない場合、さらなる別のエラーが発生してしまいます。

..
    Your custom renderer should expect an exception in its constructor, and
    implement a render method. Failing to do so will cause additional errors.

.. note::

    独自の ``Exception.handler`` を使っているなら、その実装の中でそれを参照していない限り、この設定は何の効果もありません。

..
    If you are using a custom ``Exception.handler`` this setting will have
    no effect. Unless you reference it inside your implementation.

例外をハンドリングする独自のコントローラを作成する
--------------------------------------------------

..
  Creating a custom controller to handle exceptions

あなたの ExceptionRenderer のサブクラス内で ``_getController`` メソッドを使うことで、あなたのエラーをハンドリングする独自のコントローラを返すことができます。
エラーがいつも確実に表示されるように通常のコールバックをいくつか削除している ``CakeErrorController`` を CakePHP はデフォルトで使います。
しかしながら、あなたのアプリケーション内では独自のエラーハンドリングがもっと必要になるかもしれません。
あなたの ``AppExceptionRenderer`` クラス内で ``_getController`` を実装することにより、好きなコントローラを使うことができます::

    class AppExceptionRenderer extends ExceptionRenderer {
        protected function _getController($exception) {
            App::uses('SuperCustomError', 'Controller');
            return new SuperCustomErrorController();
        }
    }

..
  In your ExceptionRenderer sub-class, you can use the ``_getController``
  method to allow you to return a custom controller to handle your errors.
  By default CakePHP uses ``CakeErrorController`` which omits a few of the normal
  callbacks to help ensure errors always display.  However, you may need a more
  custom error handling controller in your application.  By implementing
  ``_getController`` in your ``AppExceptionRenderer`` class, you can use any
  controller you want::

別の方法として、コアの  CakeErrorController を単に書き換えて ``app/Controller`` の下に置くということができます。
エラーハンドリング用の独自コントローラを使う場合は、必要なセットアップをあなたのコンストラクタ内かレンダリングメソッド内ですべて行えているかよく確認してください。
それらは組み込みの ``ErrorHandler`` クラスが直接呼び出す唯一の方法となるからです。

..
  Alternatively, you could just override the core CakeErrorController,
  by including one in ``app/Controller``.  If you are using a custom
  controller for error handling, make sure you do all the setup you need
  in your constructor, or the render method.  As those are the only methods
  that the built-in ``ErrorHandler`` class directly call.


例外のログ出力
--------------

..
  Logging exceptions

あなたの core.php で ``Exception.log`` に true をセットすることで、組み込みの例外ハンドリングを使って ErrorHandler が扱うすべての例外をログに出力することができます。
これを有効にすることで、すべての例外が :php:class:`CakeLog` と設定で指定された logger に出力されることになります。

..
  Using the built-in exception handling, you can log all the exceptions
  that are dealt with by ErrorHandler by setting ``Exception.log`` to true
  in your core.php. Enabling this will log every exception to :php:class:`CakeLog`
  and the configured loggers.

.. note::

    独自の ``Exception.handler`` を使っているなら、その実装の中でそれを参照していない限り、この設定は何の効果もありません。

..
    If you are using a custom ``Exception.handler`` this setting will have
    no effect. Unless you reference it inside your implementation.

.. meta::
    :title lang=en: Exceptions
    :keywords lang=en: uncaught exceptions,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
