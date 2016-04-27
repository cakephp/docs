エラーと例外の処理
##################

..
    Error & Exception Handling
    ##########################
    
    Many of PHP's internal methods use errors to communicate failures. These errors
    Will need to be trapped and dealt with. CakePHP comes with default error
    Trapping that prints and or logs errors as they occur. This same error handler
    Is used to catch uncaught exceptions from controllers and other parts of your
    Application.

多くのPHP内部メソッドは失敗を伝えるためにエラーを使用します。
これらのエラーはトラップされ、対処される必要があるでしょう。
CakePHPはエラーが起きるとそれを表示しまたはログに記録する既定のエラートラップを備えています。
この同じエラーハンドラがあなたのアプリケーション中のコントローラや他の部分から
キャッチされなかった例外をつかまえるために用いられます。

.. _error-configuration:

エラーと例外の設定
==================

..
    Error & Exception Configuration
    ======================
    
    Error configuration is done inside your application's **config/app.php**
    file. By default CakePHP uses the ``ErrorHandler`` or ``ConsoleErrorHandler``
    class to trap errors and print/log the errors. You can replace this behavior by
    changing out the default error handler. The default error handler also handles
    uncaught exceptions.


エラーの設定はあなたのアプリケーションの **config/app.php** ファイル中で行われます。
既定ではCakePHPはエラーをトラップし、そのエラーを表示／ログに記録するために
``ErrorHandler`` または ``ConsoleErrorHandler`` クラスを使用します。

..
    Error handling accepts a few options that allow you to tailor error handling for
    your application:
    
    * ``errorLevel`` - int - The level of errors you are interested in capturing.
      Use the built-in php error constants, and bitmasks to select the level of
      error you are interested in.
    * ``trace`` - bool - Include stack traces for errors in log files. Stack
      traces will be included in the log after each error. This is helpful for
      finding where/when errors are being raised.
    * ``exceptionRenderer`` - string - The class responsible for rendering uncaught
      exceptions. If you choose a custom class you should place the file for that
      class in **src/Error**. This class needs to implement a ``render()`` method.
    * ``log`` - bool - When ``true``, exceptions + their stack traces will be
      logged to :php:class:`Cake\\Log\\Log`.
    * ``skipLog`` - array - An array of exception classnames that should not be
      logged. This is useful to remove NotFoundExceptions or other common, but
      uninteresting logs messages.
    * ``extraFatalErrorMemory`` - int - Set to the number of megabytes to increase
      the memory limit by when a fatal error is encountered. This allows breathing
      room to complete logging or error handling.

エラー処理はあなたのアプリケーション用のエラー処理を調整するためにいくつかのオプションを受け入れます:

* ``errorLevel`` - int - あなたが捕捉したいエラーレベル。
  組み込みのPHPエラー定数を使い、捕捉したいエラーレベルを選択するためにビットマスクします。
* ``trace`` - bool - ログファイル中にエラーのスタックトレースを含めます。
  スタックトレースはログ中の各エラーの後に含まれるでしょう。
  これはどこで／いつそのエラーが引き起こされたかを見つけるために役に立ちます。
* ``exceptionRenderer`` - string - キャッチされなかった例外を描画する役目を担うクラス。
  もしもカスタムクラスを選択する場合は **src/Error** 中にそのクラスのファイルを置くべきです。
  このクラスは ``render()`` メソッドを実装する必要があります。
* ``log`` - bool - ``true`` の時、 :php:class:`Cake\\Log\\Log` によって例外とそのスタックトレースがログに記録されます。
* ``skipLog`` - array - ログに記録されるべきではない例外クラス名の配列。
  これは NotFoundException や他のありふれた、でもログにはメッセージを残したくない例外を除外するのに役立ちます。
* ``extraFatalErrorMemory`` - int - 致命的エラーが起きた時にメモリの上限を増加させるためのメガバイト数を設定します。
  これはログの記録やエラー処理を完了するために猶予を与えます。

..
    ErrorHandler by default, displays errors when ``debug`` is ``true``, and logs
    errors when debug is ``false``. The type of errors captured in both cases is
    controlled by ``errorLevel``. The fatal error handler will be called independent
    of ``debug`` level or ``errorLevel`` configuration, but the result will be
    different based on ``debug`` level. The default behavior for fatal errors is
    show a page to internal server error (``debug`` disabled) or a page with the
    message, file and line (``debug`` enabled).

エラーハンドラは既定では、``debug`` が ``true`` の時にエラーを表示し、
``debug`` が ``false`` の時にエラーをログに記録します。
いずれも捕捉されるエラータイプは ``errorLevel`` によって制御されます。
致命的エラーのハンドラは ``debug`` レベルや ``errorLevel`` とは独立して呼び出されますが、
その結果は ``debug`` レベルによって変わるでしょう。
致命的エラーに対する既定のふるまいは内部サーバーエラーページ（``debug`` 無効）
またはエラーメッセージ、ファイルおよび行を含むページ（``debug`` 有効）を表示します。

.. note::

    もしカスタムエラーハンドラを使うなら、サポートされるオプションはあなたのハンドラに依存します。

..
        If you use a custom error handler, the supported options will
        depend on your handler.

独自エラーハンドラの作成
========================

..
    Creating your Own Error Handler
    ========================
    
    You can create an error handler out of any callback type. For example you could
    use a class called ``AppError`` to handle your errors. By extending the
    ``BaseErrorHandler`` you can supply custom logic for handling errors.
    An example would be::

あなたはコールバックタイプからエラーハンドラを作り出すことができます。
たとえばあなたのエラーを処理するために ``AppError`` というクラスを使うことができます。
``BaseErrorHandler`` を継承することでエラーを処理するためのカスタムロジックを提供できます。
一つ例は::

    // config/bootstrap.php の中で
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // src/Error/AppError.php の中で
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        public function _displayError($error, $debug)
        {
            return 'エラーがありました！';
        }
        public function _displayException($exception)
        {
            return '例外がありました！';
        }
    }

..
    The ``BaseErrorHandler`` defines two abstract methods. ``_displayError()`` is
    used when errors are triggered. The ``_displayException()`` method is called
    when there is an uncaught exception.

``BaseErrorHandler`` は二つの抽象メソッドを定義しています。
``_displayError()`` はエラーが引き起こされた時に使われます。
``_displayException()`` メソッドはキャッチされなかった例外がある時に呼ばれます。

致命的エラーのふるまい変更
==========================

..
    Changing Fatal Error Behavior
    =============================
    
    The default error handlers convert fatal errors into exceptions and re-use the
    exception handling logic to render an error page. If you do not want to show the
    standard error page, you can override it like::

既定のエラーハンドラは致命的エラーを例外に変換し
エラーページを描画するための例外処理方法を再利用します。
もし標準のエラーページを表示したくない場合は、あなたはそれをオーバーライドできます::

    // config/bootstrap.php の中で
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // src/Error/AppError.php の中で
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // 他のメソッド

        public function handleFatalError($code, $description, $file, $line)
        {
            return '致命的エラーが発生しました';
        }
    }

.. php:namespace:: Cake\Network\Exception

例外クラス
==========

..
    Exception Classes
    =================
    
    There are a number of exception classes in CakePHP. The built in exception
    handling will capture any uncaught exceptions and render a useful page.
    Exceptions that do not specifically use a 400 range code, will be treated as an
    Internal Server Error.

CakePHPにはいくつかの例外クラスがあります。
組み込みの例外処理ではキャッチされなかったあらゆる例外を捕捉しページを描画するでしょう。
例外は400番台のコードは使わず、内部サーバーエラーとして扱われるでしょう。

.. _built-in-exceptions:

CakePHP用の組み込みの例外
=========================

..
    Built in Exceptions for CakePHP
    ===============================
    
    HTTP Exceptions
    ---------------
    
    There are several built-in exceptions inside CakePHP, outside of the
    internal framework exceptions, there are several
    exceptions for HTTP methods

HTTPの例外
----------

CakePHP内部のいくつかの組み込みの例外には、内部的なフレームワークの例外の他に、
HTTPメソッド用のいくつかの例外があります。

.. php:exception:: BadRequestException

    400 Bad Request エラーに使われます。 
..    Used for doing 400 Bad Request error.

.. php:exception:: UnauthorizedException

    401 Unauthorized エラーに使われます。
..    Used for doing a 401 Unauthorized error.

.. php:exception:: ForbiddenException

    403 Forbidden エラーに使われます。
..    Used for doing a 403 Forbidden error.

.. versionadded:: 3.1

    InvalidCsrfTokenExceptionが追加されました。

.. php:exception:: InvalidCsrfTokenException

    無効なCSRFトークンによって引き起こされた403エラーに使われます。
..    Used for doing a 403 error caused by an invalid CSRF token.

.. php:exception:: NotFoundException

    404 Not Found エラーに使われます。
..    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    405 Method Not Allowed エラーに使われます。
..    Used for doing a 405 Method Not Allowed error.

.. php:exception:: NotAcceptableException

    406 Not Acceptable エラーに使われます。

    .. versionadded:: 3.1.7 NotAcceptableExceptionが追加されました。
..    Used for doing a 406 Not Acceptable error.
    
.. php:exception:: ConflictException

    409 Conflict エラーに使われます。

    .. versionadded:: 3.1.7 ConflictExceptionが追加されました。
..    Used for doing a 409 Conflict error.

.. php:exception:: GoneException

    410 Gone エラーに使われます。

    .. versionadded:: 3.1.7 GoneExceptionが追加されました。
..    Used for doing a 410 Gone error.

.. For more details on HTTP 4xx error status codes see :rfc:`2616#section-10.4`.

HTTP 4xx エラーステータスコードの詳細は :rfc:`2616#section-10.4` を参照。

.. php:exception:: InternalErrorException

    500 Internal Server Error に使われます。
..    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    501 Not Implemented エラーに使われます。
..    Used for doing a 501 Not Implemented Errors.

.. php:exception:: ServiceUnavailableException

    503 Service Unavailable エラーに使われます。

    .. versionadded:: 3.1.7 Service Unavailableが追加されました。
..    Used for doing a 503 Service Unavailable error.

.. For more details on HTTP 5xx error status codes see :rfc:`2616#section-10.5`.

HTTP 5xx エラーステータスコードの詳細は :rfc:`2616#section-10.5` を参照。

..
    You can throw these exceptions from your controllers to indicate failure states,
    or HTTP errors. An example use of the HTTP exceptions could be rendering 404
    pages for items that have not been found::

失敗の状態やHTTPエラーを示すためにあなたのコントローラからこれらの例外を投げることができます。
HTTPの例外の使用例はアイテムが見つからなかった場合に404ページを描画することでしょう::

    use Cake\Network\Exception\NotFoundException;
    
    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

..
    By using exceptions for HTTP errors, you can keep your code both clean, and give
    RESTful responses to client applications and users.

HTTPエラー用の例外を使うことで、あなたのコードを綺麗にし、
かつRESTfulなレスポンスをアプリケーションのクライアントやユーザーに返すことができます。

その他の組み込みの例外
----------------------
..
    Other Built In Exceptions
    -------------------------
    
    In addition, the following framework layer exceptions are available, and will
    be thrown from a number of CakePHP core components:

加えて、以下のフレームワーク層の例外が利用可能で、
そしていくつかのCakePHPのコアコンポーネントから投げられるでしょう。

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException

    選択されたビュークラスが見つかりません。
..    The chosen view class could not be found.

.. php:exception:: MissingTemplateException

    選択されたテンプレートファイルが見つかりません。
..    The chosen template file could not be found.

.. php:exception:: MissingLayoutException

    選択されたレイアウトが見つかりません。
..    The chosen layout could not be found.

.. php:exception:: MissingHelperException

    選択されたヘルパーが見つかりません。
..    The chosen helper could not be found.

.. php:exception:: MissingElementException

    選択されたエレメントのファイルが見つかりません。
..    The chosen element file could not be found.

.. php:exception:: MissingCellException

    選択されたセルクラスが見つかりません。
..    The chosen cell class could not be found.

.. php:exception:: MissingCellViewException

    選択されたビューファイルが見つかりません。
..    The chosen cell view file could not be found.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    設定されたコンポーネントが見つかりません。
..    A configured component could not be found.

.. php:exception:: MissingActionException

    要求されたコントローラのアクションが見つかりません。
..    The requested controller action could not be found.

.. php:exception:: PrivateActionException

    private／protected／_が前置されたアクションへのアクセス。
..    Accessing private/protected/_ prefixed actions.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    コンソールライブラリクラスがエラーに遭遇しました。
..    A console library class encounter an error.

.. php:exception:: MissingTaskException

    設定されたタスクが見つかりません。
..    A configured task could not found.

.. php:exception:: MissingShellException

    シェルクラスが見つかりません。
..    The shell class could not be found.

.. php:exception:: MissingShellMethodException

    選択されたシェルクラスが該当の名前のメソッドを持っていません。
..    The chosen shell class has no method of that name.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException

    モデルの接続がありません。
..    A model's connection is missing.

.. php:exception:: MissingDriverException

    データベースドライバが見つかりません。
..    A database driver could not be found.

.. php:exception:: MissingExtensionException

    データベースドライバのためのPHP拡張がありません。
..    A PHP extension is missing for the database driver.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    モデルのテーブルが見つかりません。
..    A model's table could not be found.

.. php:exception:: MissingEntityException

    モデルのエンティティが見つかりません。
..    A model's entity could not be found.

.. php:exception:: MissingBehaviorException

    モデルのビヘイビアが見つかりません。
..    A model's behavior could not be found.

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

    要求されたレコードが見つかりません。
    これはHTTPレスポンスヘッダに404を設定しもするでしょう。
..    The requested record could not be found. This will also set HTTP response
      headers to 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    要求されたコントローラが見つかりません。
..    The requested controller could not be found.

.. php:exception:: MissingRouteException

    要求されたURLはルーティングの逆引きができないか解析できません。
..    The requested URL cannot be reverse routed or cannot be parsed.

.. php:exception:: MissingDispatcherFilterException

    ディスパッチャフィルタが見つかりません。
..    The dispatcher filter could not be found.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    CakePHPでの基底例外クラス。
    CakePHPによって投げられるすべてのフレームワーク層の例外はこのクラスを継承するでしょう。
..    Base exception class in CakePHP. All framework layer exceptions thrown by
      CakePHP will extend this class.

..
    These exception classes all extend :php:exc:`Exception`.
    By extending Exception, you can create your own 'framework' errors.
    All of the standard Exceptions that CakePHP will throw also extend Exception.

これらの例外クラスはすべて :php:exc:`Exception` を継承します。
Exception を継承することにより、あなたは独自の‘フレームワーク’エラーを作ることができます。
CakePHPが投げるであろう標準の例外もすべてExceptionを継承します。

.. php:method:: responseHeader($header = null, $value = null)

    :php:func:`Cake\\Network\\Request::header()` 参照

..
    All Http and Cake exceptions extend the Exception class, which has a method
    To add headers to the response. For instance when throwing a 405
    MethodNotAllowedException the rfc2616 says::
    
        "The response MUST include an Allow header containing a list of valid
        methods for the requested resource."

すべてのHttpとCakeの例外はExceptionクラスを継承し、
レスポンスにヘッダを追加するためのメソッドを持っています。
RFC2616 MethodNotAllowedExceptionは言っています::

    「レスポンスは要求されたリソースに有効なメソッドの一覧を含むAllowヘッダを含まなければ【ならない】」


コントローラ中でのHTTPの例外の使用
==================================

..
    Using HTTP Exceptions in your Controllers
    =========================================
    
    You can throw any of the HTTP related exceptions from your controller actions
    to indicate failure states. For example::
    
失敗の状態を示すためにあたなのコントローラのアクションからあらゆるHTTP関連の例外を投げることができます。
たとえば::

        use Cake\Network\Exception\NotFoundException;
        
        public function view($id = null)
        {
            $article = $this->Articles->findById($id)->first();
            if (empty($article)) {
                throw new NotFoundException(__('Article not found'));
            }
            $this->set('article', 'article');
            $this->set('_serialize', ['article']);
        }

..
    The above would cause the configured exception handler to catch and
    process the :php:exc:`NotFoundException`. By default this will create an error
    page, and log the exception.

上記は :php:exc:`NotFoundException` をキャッチして処理するための例外ハンドラを設定するでしょう。
既定ではエラーページを作り、例外をログに記録するでしょう。

.. _error-views:

例外のレンダラ
==============

..
  Exception Renderer
  ==================

.. php:class:: ExceptionRenderer(Exception $exception)

``ErrorController`` の手助けをするExceptionRendererクラスは
あなたのアプリケーションによって投げられたすべての例外のためのエラーページを処理します。

..
    The ExceptionRenderer class with the help of ``ErrorController`` takes care of
    rendering the error pages for all the exceptions thrown by you application.
    
    The error page views are located at **src/Template/Error/**. For all 4xx and
    5xx errors the template files **error400.ctp** and **error500.ctp** are used
    respectively. You can customize them as per your needs. By default your
    **src/Template/Layout/default.ctp** is used for error pages too. If for
    example, you want to use another layout **src/Template/Layout/my_error.ctp**
    for your error pages, simply edit the error views and add the statement
    ``$this->layout = 'my_error';`` to the **error400.ctp** and **error500.ctp**.
 
エラーページのビューは **src/Template/Error/** に配置されます。
すべての4xxと5xxエラー用のテンプレートファイル **error400.ctp** と **error500.ctp** がそれぞれ使われます。
必要に応じてそれらをカスタマイズすることができます。
既定では **src/Template/Layout/default.ctp** もエラーページに使われます。
たとえばもしも、他のレイアウト **src/Template/Layout/my_error.ctp** をエラーページに使いたい場合、
単純にエラー用ビューを編集して ``$this->layout = 'my_error';`` という文を
**error400.ctp** と **error500.ctp** に追加してください。

..
    Each framework layer exception has its own view file located in the core
    templates but you really don't need to bother customizing them as they are used
    only during development. With debug turned off all framework layer exceptions
    are converted to ``InternalErrorException``.

各フレームワーク層の例外はコアのテンプレートに置かれた個別のビューファイル持っていますが
それらは開発中の間にのみ使われますのでそれらのカスタマイズに悩む必要はまったくありません。

.. index:: application exceptions

独自のアプリケーション例外の作成
================================

..
    Creating your own Application Exceptions
    ========================================
    
    You can create your own application exceptions using any of the built in `SPL
    exceptions <http://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
    itself, or :php:exc:`Cake\\Core\\Exception\\Exception`.
    If your application contained the following exception::

組み込みの `SPLの例外 <http://php.net/manual/en/spl.exceptions.php>`_ 、``Exception`` そのもの、
または :php:exc:`Cake\\Core\\Exception\\Exception` のいずれかを使って
あなた独自のアプリケーション例外を作ることができます。
もしあなたのアプリケーションが以下の例外を含んでいたなら::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {};

..
    You could provide nice development errors, by creating
    **src/Template/Error/missing_widget.ctp**. When in production mode, the above
    error would be treated as a 500 error. The constructor for
    :php:exc:`Cake\\Core\\Exception\\Exception` has been extended, allowing you to
    pass in hashes of data. These hashes are interpolated into the the
    messageTemplate, as well as into the view that is used to represent the error
    in development mode. This allows you to create data rich exceptions, by
    providing more context for your errors. You can also provide a message template
    which allows the native ``__toString()`` methods to work as normal::

**src/Template/Error/missing_widget.ctp** を作ることで、素晴らしい開発用エラーを提供できるでしょう。
本番モードでは、上記のエラーは500エラーとして扱われるでしょう。
:php:exc:`Cake\\Core\\Exception\\Exception` のコンストラクタが継承されており、
データの連想配列を渡すことができます。それらの連想配列はメッセージテンプレートに差し込まれ、
開発モードでのエラーを表示するため使われるビューにも同様に差し込まれます。
これにより、エラー用の多くのコンテキスト提供して、データ豊富な例外を作ることができます。
ネイティブの ``__toString()`` メソッドを正常に動作させるメッセージテンプレートを提供することもできます::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        protected $_messageTemplate = '%s が見当たらないようです。';
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

..
    When caught by the built in exception handler, you would get a ``$widget``
    variable in your error view template. In addition if you cast the exception
    as a string or use its ``getMessage()`` method you will get
    ``Seems that Pointy is missing.``. This allows you to quickly create
    your own rich development errors, just like CakePHP uses internally.

組み込みの例外ハンドラにキャッチされた時、あなたはエラービューテンプレート中に ``$widget`` 変数を得られるでしょう。
加えてもしその例外を文字列にキャストするかその ``getMessage()`` メソッドを使うと ``%s が見当たらないようです。`` を得られるでしょう。
これにより、ちょうどCakePHPが内部的に使っているように、あなた独自の富んだ開発用エラーを手早く作ることができます。

カスタムステータスコードの作成
------------------------------

..
    Creating Custom Status Codes
    ----------------------------
    
    You can create custom HTTP status codes by changing the code used when
    creating an exception::

例外を生成する際にコードを変えることでカスタムHTTPステータスコードを作ることができます::
    
        throw new MissingWidgetHelperException('それはここにはありません', 501);

..    
    Will create a 501 response code, you can use any HTTP status code
    you want. In development, if your exception doesn't have a specific
    template, and you use a code equal to or greater than 500 you will
    see the **error500.ctp** template. For any other error code you'll get the
    **error400.ctp** template. If you have defined an error template for your
    custom exception, that template will be used in development mode.
    If you'd like your own exception handling logic even in production,
    see the next section.

これは501のレスポンスコードを作るでしょうが、あなたが望むあらゆるHTTPステータスコードを使うことができます。
開発中は、もしあなたの例外が特定のテンプレートを持っておらず、かつ500番以上のコードを使うと
**error500.ctp** テンプレートが表示されるでしょう。他のあらゆるエラーコードでは **error400.ctp** テンプレートになるでしょう。
もしカスタムの例外用のエラーテンプレートを定義している場合、そのテンプレートが開発中は使われるでしょう。
もし本番でもあなた独自の例外処理方法が欲しい場合は次の節を参照してください。


独自の例外ハンドラの継承と実装
==============================

..
    Extending and Implementing your own Exception Handlers
    ======================================================
    
    You can implement application specific exception handling in one of a
    few ways. Each approach gives you different amounts of control over
    the exception handling process.

あなたはいくつかの方法でアプリケーション固有の例外処理を実装することができます。
各方法ごとに、例外処理工程における異なる量の制御権をあなたに与えます。

..
    - Create and register your own custom error handlers.
    - Extend the ``BaseErrorHandler`` provided by CakePHP.
    - Set the ``exceptionRenderer`` option on the default error handler.

- 独自のカスタムエラーハンドラの作成と登録
- CakePHPによって提供される ``BaseErrorHandler`` の継承
- 既定のエラーハンドラに ``exceptionRenderer`` オプションの設定

..
    In the next few sections, we will detail the various approaches and the
    benefits each has.

次の節では、さまざまな方法とそれらが各々持つ利点について詳述します。

独自の例外ハンドラの作成と登録
------------------------------

..
    Create and Register your own Exception Handler
    ----------------------------------------------
    
    Creating your own exception handler gives you full control over the exception
    handling process. You will have to call ``set_exception_handler`` yourself in
    this situation.

独自の例外ハンドラの作成は、例外処理工程における全制御権をあなたに与えます。
この場合には、あなたは ``set_exception_handler`` を自分で呼ばなければならないでしょう。

BaseErrorHandlerの継承
----------------------

..
    Extend the BaseErrorHandler
    ---------------------------
    
    The :ref:`error-configuration` section has an example of this.

:ref:`error-configuration` の節にこの例があります。

既定のハンドラのexceptionRendererオプションの使用
-------------------------------------------------

..
    Using the exceptionRenderer Option of the Default Handler
    ---------------------------------------------------------
    
    If you don't want to take control of the exception handling, but want to change
    how exceptions are rendered you can use the ``exceptionRenderer`` option in
    **config/app.php** to choose a class that will render exception pages. By
    default :php:class:`Cake\\Core\\Exception\\ExceptionRenderer` is used. Your
    custom exception renderer class should be placed in **src/Error**. In a custom
    exception rendering class you can provide specialized handling for application
    specific errors::

もし例外処理の制御権を得る必要はないものの、どのように例外が描画されるを変更したい場合は
例外ページを描画するであろうクラスを選択するために
**config/app.php** 中の ``exceptionRenderer`` オプションを使うことができます::

    // src/Error/AppExceptionRenderer.php の中で
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            return 'おっとウィジェットが見つからない！';
        }
    }


    // config/app.php の中で
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

..
    The above would handle any exceptions of the type ``MissingWidgetException``,
    and allow you to provide custom display/handling logic for those application
    exceptions. Exception handling methods get the exception being handled as
    their argument. Your custom exception rendering can return either a string or
    a ``Response`` object. Returning a ``Response`` will give you full control
    over the response.

上記は ``MissingWidgetException`` 型のあらゆる例外を処理し、
それらのアプリケーション例外を表示／処理するためのカスタム処理ができるようにします。
例外処理メソッドは、引数として処理される例外を受け取ります。
あなたのカスタム例外処理は文字列または ``Response`` オブジェクトを返すことができます。
``Response`` オブジェクトの返却はそれのレスポンスに対する全制御権をあなたに与えます。
  
.. note::

    カスタムレンダラはコンストラクタで例外を受け取るのを期待し、renderメソッドを実装します。
    
    もしもカスタム例外処理を使っている場合、レンダラの設定変更は効果がありません。
    あなたの実装の中であなたがそれを参照しない限り。

..
        Your custom renderer should expect an exception in its constructor, and
        implement a render method. Failing to do so will cause additional errors.
    
        If you are using a custom exception handling, configuring the renderer will
        have no effect. Unless you reference it inside your implementation.

例外処理のためのカスタムコントローラ作成
----------------------------------------

..
    Creating a Custom Controller to Handle Exceptions
    -------------------------------------------------
    
    By convention CakePHP will use ``App\Controller\ErrorController`` if it exists.
    Implementing this class can give you a configuration free way of customizing
    error page output.

慣例ではCakePHPはもし存在すれば ``App\Controller\ErrorController`` を使います。
このクラスを実装することで、エラーページ出力のカスタマイズの設定に依存しない方法を提供します。

..
    If you are using custom exception renderer, you can use the ``_getController()``
    method to return a customize the controller.  By implementing
    ``_getController()`` in your exception renderer you can use any controller you
    want::

もしあなたがカスタム例外レンダラを使っているのであれば、
カスタマイズコントローラを返すために ``_getController()`` メソッドを使うことができます。
例外レンダラの中で``_getController()`` を実装することにより
あなたが望むあらゆるコントローラを使うことができます::

    // src/Error/AppExceptionRenderer の中で
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController($exception)
        {
            return new SuperCustomErrorController();
        }
    }

    // config/app.php の中で
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

..
    The error controller, whether custom or conventional, is used to render the
    error page view and receives all the standard request life-cycle events.

エラーコントローラは、カスタムであろうと慣例のままであろうと、エラーページの表示に使われ、
すべての標準のリクエストライフサイクルイベントを受け取ります。

例外のログ記録
--------------

..
    Logging Exceptions
    ------------------
    
    Using the built-in exception handling, you can log all the exceptions that are
    dealt with by ErrorHandler by setting the ``log`` option to ``true`` in your
    **config/app.php**. Enabling this will log every exception to
    :php:class:`Cake\\Log\\Log` and the configured loggers.

組み込みの例外処理を使うと、 **config/app.php** 中で ``log`` オプションに ``true`` を設定することで
ErrorHandler によって対処されるすべての例外をログに記録することができます。
これを有効にすることで :php:class:`Cake\\Log\\Log` と設定済みのロガーに各例外の記録が残るでしょう。

.. note::

    もしもカスタム例外処理を使っている場合、この設定は効果がないでしょう。
    あなたの実装の中であなたがそれを参照しない限り。
..
        If you are using a custom exception handler this setting will have
        no effect. Unless you reference it inside your implementation.

.. meta::
    :title lang=ja: エラーと例外の処理
    :keywords lang=ja: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
