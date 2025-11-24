エラーと例外の処理
##################

CakePHP アプリケーションには、エラー処理と例外処理が用意されています。
PHP エラーはトラップされ、表示またはログに記録されます。
キャッチされなかった例外はエラーページに自動的にレンダリングされます。

.. _error-configuration:

エラーと例外の設定
==================

エラーの設定はアプリケーションの **config/app.php** ファイル中で行われます。デフォルトでは、
CakePHP は PHP エラーと例外の両方を処理するために ``Cake\Error\ErrorHandler`` を使います。
エラーの設定を使用すると、アプリケーションのエラー処理をカスタマイズできます。
次のオプションをサポートします。

* ``errorLevel`` - int - あなたが捕捉したいエラーレベル。組み込みの PHP エラー定数を使い、
  捕捉したいエラーレベルを選択するためにビットマスクします。非推奨の警告を無効にするために、
  ``E_ALL ^ E_USER_DEPRECATED`` をセットすることができます。
* ``trace`` - bool - ログファイル中にエラーのスタックトレースを含めます。
  スタックトレースはログ中の各エラーの後に含まれるでしょう。
  これはどこで／いつそのエラーが引き起こされたかを見つけるために役に立ちます。
* ``exceptionRenderer`` - string - キャッチされなかった例外を描画する役目を担うクラス。
  もしもカスタムクラスを選択する場合は **src/Error** 中にそのクラスのファイルを置くべきです。
  このクラスは ``render()`` メソッドを実装する必要があります。
* ``log`` - bool - ``true`` の時、 :php:class:`Cake\\Log\\Log` によって例外と
  そのスタックトレースが  :php:class:`Cake\\Log\\Log` に記録されます。
* ``skipLog`` - array - ログに記録されるべきではない例外クラス名の配列。
  これは NotFoundException や他のありふれた、でもログにはメッセージを残したくない例外を
  除外するのに役立ちます。
* ``extraFatalErrorMemory`` - int - 致命的エラーが起きた時にメモリーの上限を増加させるための
  メガバイト数を設定します。これはログの記録やエラー処理を完了するために猶予を与えます。
* ``errorLogger`` - ``Cake\Error\ErrorLoggerInterface`` - エラーログの記録および未処理の
  例外を担当するクラス。デフォルトは ``Cake\Error\ErrorLogger``
* ``ignoredDeprecationPaths`` - array - 非推奨のエラーが無視されるべきパス（glob互換）のリスト。
  4.2.0で追加

エラーハンドラーは既定では、 ``debug`` が ``true`` の時にエラーを表示し、
``debug`` が ``false`` の時にエラーをログに記録します。
いずれも捕捉されるエラータイプは ``errorLevel`` によって制御されます。
致命的エラーのハンドラーは ``debug`` レベルや ``errorLevel`` とは独立して呼び出されますが、
その結果は ``debug`` レベルによって変わるでしょう。
致命的エラーに対する既定のふるまいは内部サーバーエラーページ (``debug`` 無効)
またはエラーメッセージ、ファイルおよび行を含むページ (``debug`` 有効) を表示します。

.. note::

    もしカスタムエラーハンドラーを使うなら、サポートされるオプションはあなたのハンドラーに依存します。


.. _deprecation-warnings:

非推奨の警告
--------------------

CakePHPは、非推奨の警告を使用して、機能が非推奨になったことを示します。
また、このシステムをプラグインやアプリケーションコードで使用することをお勧めします。
``deprecationWarning()`` を使用して非推奨の警告をトリガーできます。 ::

    deprecationWarning('The example() method is deprecated. Use getExample() instead.');

CakePHPまたはプラグインをアップグレードすると、新しい非推奨の警告が表示される場合があります。
いくつかの方法のいずれかで、非推奨の警告を一時的に無効にすることができます。

#. ``Error.errorLevel`` を ``E_ALL ^ E_USER_DEPRECATED`` に設定して、すべての非推奨警告を無視します。
#. ``Error.ignoredDeprecationPaths`` 設定オプションを使用して、glob互換の表現で非推奨を無視します。
   以下をご覧ください。 ::

        'Error' => [
            'ignoredDeprecationPaths' => [
                'vendors/company/contacts/*',
                'src/Models/*',
            ]
        ],

   アプリケーションにおける ``Models`` ディレクトリと ``Contacts`` プラグインからのすべての非推奨を無視します。

.. php:class:: ExceptionRenderer(Exception $exception)

例外処理の変更
==============

例外処理では、例外の処理方法を調整するいくつかの方法が用意されています。
それぞれのアプローチでは、例外処理プロセスの制御量が異なります。

#. *エラーテンプレートのカスタマイズ* 描画されたビューテンプレートを
   アプリケーション内の他のテンプレートと同様に変更できます。
#. *ErrorController のカスタマイズ* 例外ページの描画方法を制御できます。
#. *ExceptionRenderer のカスタマイズ* 例外ページとロギングの実行方法を制御できます。
#. *独自のエラーハンドラーの作成と登録* エラーと例外がどのように処理され、記録され、
   描画されるかを完全に制御することができます。

.. _error-views:

エラーテンプレートのカスタマイズ
================================

デフォルトのエラーハンドラは、 ``Cake\Error\ExceptionRenderer`` とアプリケーションの
``ErrorController`` の助けを借りて、アプリケーションで発生した全ての捕捉されない例外を描画します。

エラーページのビューは **templates/Error/** に配置されます。デフォルトでは、
すべての 4xx エラーは **error400.php** テンプレートを使い、
すべての 5xx エラーは **error500.php** を使います。
エラーテンプレートの変数は次のとおりです。

* ``message`` 例外メッセージ。
* ``code`` 例外コード。
* ``url`` リクエスト URL。
* ``error`` 例外オブジェクト。

デバッグモードでエラーが ``Cake\Core\Exception\Exception`` を継承した場合、
``getAttributes()`` によって返されたデータはビュー変数としても公開されます。

.. note::
    **error404** と **error500** テンプレートを表示するには ``debug`` を false に
    設定する必要があります。デバッグモードだと、 CakePHP の開発用エラーページが表示されます。

エラーページレイアウトのカスタマイズ
------------------------------------

デフォルトでは、エラーテンプレートは、レイアウトに **templates/layout/error.php** を使います。
``layout`` プロパティーを使って別のレイアウトを選ぶことができます。 ::

    // templates/Error/error400.php の中で
    $this->layout = 'my_error';

上記は、エラーページのレイアウトとして **templates/layout/my_error.php** を使用します。
CakePHP によって引き起こされる多くの例外は、特定のビューテンプレートをデバッグモードで描画します。
デバッグをオフにすると、CakePHP によって生成されたすべての例外は、ステータスコードに基づいて
**error400.php** または **error500.php** のいずれかを使用します。

ErrorController のカスタマイズ
==============================

``App\Controller\ErrorController`` クラスは CakePHP の例外レンダリングでエラーページビューを
描画するために使われ、すべての標準リクエストライフサイクルイベントを受け取ります。
このクラスを変更することで、どのコンポーネントが使用され、どのテンプレートが描画されるかを制御できます。

アプリケーション内で :ref:`プレフィックスルーティング <prefix-routing>` を利用している場合は、
それぞれのルーティングプレフィックスに対してカスタムエラーコントローラーを作成できます。
例えば、 ``Admin`` プレフィックスの場合は以下のクラスを作成することができます。 ::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        /**
         * Initialization hook method.
         *
         * @return void
         */
        public function initialize(): void
        {
            $this->loadComponent('RequestHandler');
        }

        /**
         * beforeRender callback.
         *
         * @param \Cake\Event\EventInterface $event Event.
         * @return void
         */
        public function beforeRender(EventInterface $event)
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

このコントローラーは、プレフィックス付きのコントローラーでエラーが発生したときにのみ利用できます。
そして、必要に応じてプレフィックス固有のロジック/テンプレートを定義できます。

ExceptionRenderer の変更
========================

例外レンダリングとロギングプロセス全体を制御したい場合は **config/app.php** の
``Error.exceptionRenderer`` オプションを使用して、例外ページをレンダリングするクラスを
選択することができます。ExceptionRenderer の変更は、アプリケーション固有の
例外クラスに対してカスタムエラーページを提供する場合に便利です。

カスタム例外レンダラークラスは **src/Error** に配置する必要があります。
アプリケーションで ``App\Exception\MissingWidgetException`` を使用して欠落している
ウィジェットを示すとしましょう。このエラーが処理されたときに特定のエラーページを
レンダリングする例外レンダラーを作成することができます。 ::

    // src/Error/AppExceptionRenderer.php の中で
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->response;

            return $response->withStringBody('おっとウィジェットが見つからない！');
        }
    }

    // config/app.php の中で
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

上記は ``MissingWidgetException`` 型のあらゆる例外を処理し、
それらのアプリケーション例外を表示／処理するためのカスタム処理ができるようにします。

例外レンダリングメソッドは、引数として処理される例外を受け取り、
``Response`` オブジェクトを返さなければなりません。
また、CakePHP のエラーを処理する際にロジックを追加するメソッドを実装することもできます。 ::

    // src/Error/AppExceptionRenderer.php の中で
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function notFound($error)
        {
            // NotFoundException オブジェクトで何かをします。
        }
    }

ErrorController クラスの変更
----------------------------

例外レンダラーは、例外の描画に使用されるコントローラーを指定します。
例外を描画するコントローラーを変更したい場合は、例外レンダラーの
``_getController()`` メソッドをオーバーライドしてください。 ::

    // src/Error/AppExceptionRenderer の中で
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController()
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


独自エラーハンドラーの作成
==========================

エラーハンドラーを置き換えることによって、エラーおよび例外処理プロセス全体をカスタマイズできます。
``Cake\Error\BaseErrorHandler`` を継承することでエラーを処理するためのカスタムロジックを提供できます。
たとえば、エラーを処理するために ``AppError`` というクラスを使うことができます。 ::

    // config/bootstrap.php の中で
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // src/Error/AppError.php の中で
    namespace App\Error;

    use Cake\Error\ErrorHandler;
    use Throwable;

    class AppError extends ErrorHandler
    {
        protected function _displayError(array $error, bool $debug): void
        {
            echo 'エラーがありました！';
        }

        protected function _displayException(Throwable $exception): void
        {
            echo '例外がありました！';
        }
    }

Then we can register our error handler as the PHP error handler::

    // In config/bootstrap.php
    use App\Error\AppError;

    if (PHP_SAPI !== 'cli') {
        $errorHandler = new AppError();
        $errorHandler->register();
    }

Finally, we can use our error handler in the ``ErrorHandlerMiddleware``::

    // in src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $error = new AppError(Configure::read('Error'));
        $middleware->add(new ErrorHandlerMiddleware($error));

        return $middleware;
    }

For console error handling, you should extend ``Cake\Error\ConsoleErrorHandler`` instead::

    // In /src/Error/AppConsoleErrorHandler.php
    namespace App\Error;
    use Cake\Error\ConsoleErrorHandler;

    class AppConsoleErrorHandler extends ConsoleErrorHandler {

        protected function _displayException(Throwable $exception): void {
            parent::_displayException($exception);
            if (isset($exception->queryString)) {
                $this->_stderr->write('Query String: ' . $exception->queryString);
            }
        }

    }

``BaseErrorHandler`` は二つの抽象メソッドを定義しています。
``_displayError()`` はエラーが引き起こされた時に使われます。
``_displayException()`` メソッドはキャッチされなかった例外がある時に呼ばれます。

致命的エラーのふるまい変更
--------------------------

既定のエラーハンドラーは致命的エラーを例外に変換し
エラーページを描画するための例外処理方法を再利用します。
もし標準のエラーページを表示したくない場合は、あなたはそれをオーバーライドできます。 ::

    // src/Error/AppError.php の中で
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // 他のメソッド

        public function handleFatalError(int $code, string $description, string $file, int $line): bool
        {
            echo '致命的エラーが発生しました';
        }
    }


Custom Error Logging
====================

Error handlers use instances of ``Cake\Error\ErrorLoggingInterface`` to create
log messages and log them to the appropriate place. You can replace the error
logger using the ``Error.errorLogger`` configure value. An example error
logger::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Log errors and unhandled exceptions to `Cake\Log\Log`
     */
    class ErrorLogger implements ErrorLoggerInterface
    {
        /**
         * @inheritDoc
         */
        public function logMessage($level, string $message, array $context = []): bool
        {
            // Log PHP Errors
        }

        public function log(Throwable $exception, ?ServerRequestInterface $request = null): bool
        {
            // Log exceptions.
        }
    }

.. index:: application exceptions

独自アプリケーション例外の作成
==============================

組み込みの `SPL の例外 <https://php.net/manual/en/spl.exceptions.php>`_ 、
``Exception`` そのもの、または :php:exc:`Cake\\Core\\Exception\\Exception`
のいずれかを使って、独自のアプリケーション例外を作ることができます。
もしアプリケーションが以下の例外を含んでいたなら::


    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
    }

**templates/Error/missing_widget.php** を作ることで、素晴らしい開発用エラーを提供できるでしょう。
本番モードでは、上記のエラーは 500 エラーとして扱われ、 **error500** テンプレートを使用するでしょう。

例外コードが ``400`` と ``506`` の間にある場合、例外コードは HTTP レスポンスコードとして使用されます。

:php:exc:`Cake\\Core\\Exception\\Exception` のコンストラクターが継承されており、
追加のデータを渡すことができます。それら追加のデータは ``_messageTemplate`` に差し込まれます。
これにより、エラー用の多くのコンテキスト提供して、データ豊富な例外を作ることができます。 ::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        // コンテキストデータはこのフォーマット文字列に差し込まれます。
        protected $_messageTemplate = '%s が見当たらないようです。';

        // デフォルトの例外コードも設定できます。
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

レンダリングされると、このビューテンプレートには ``$widget`` 変数が設定されます。
もしその例外を文字列にキャストするかその ``getMessage()`` メソッドを使うと
``Pointy が見当たらないようです。`` を得られるでしょう。

例外のログ記録
--------------

組み込みの例外処理を使うと、 **config/app.php** 中で ``log`` オプションに ``true`` を設定することで
ErrorHandler によって対処されるすべての例外をログに記録することができます。
これを有効にすることで :php:class:`Cake\\Log\\Log` と設定済みのロガーに各例外の記録が残るでしょう。

.. note::

    もしもカスタム例外ハンドラーを使用している場合、
    あなたの実装の中でそれを参照しない限り、この設定は効果がないでしょう。

.. php:namespace:: Cake\Http\Exception

.. _built-in-exceptions:

CakePHP 用の組み込みの例外
==========================

HTTP の例外
-----------

CakePHP 内部のいくつかの組み込みの例外には、内部的なフレームワークの例外の他に、
HTTP メソッド用のいくつかの例外があります。

.. php:exception:: BadRequestException

    400 Bad Request エラーに使われます。

.. php:exception:: UnauthorizedException

    401 Unauthorized エラーに使われます。

.. php:exception:: ForbiddenException

    403 Forbidden エラーに使われます。

.. php:exception:: InvalidCsrfTokenException

    無効な CSRF トークンによって引き起こされた 403 エラーに使われます。

.. php:exception:: NotFoundException

    404 Not Found エラーに使われます。

.. php:exception:: MethodNotAllowedException

    405 Method Not Allowed エラーに使われます。

.. php:exception:: NotAcceptableException

    406 Not Acceptable エラーに使われます。

.. php:exception:: ConflictException

    409 Conflict エラーに使われます。

.. php:exception:: GoneException

    410 Gone エラーに使われます。

HTTP 4xx エラーステータスコードの詳細は :rfc:`2616#section-10.4` をご覧ください。

.. php:exception:: InternalErrorException

    500 Internal Server Error に使われます。

.. php:exception:: NotImplementedException

    501 Not Implemented エラーに使われます。

.. php:exception:: ServiceUnavailableException

    503 Service Unavailable エラーに使われます。

HTTP 5xx エラーステータスコードの詳細は :rfc:`2616#section-10.5` をご覧ください。

失敗の状態や HTTP エラーを示すためにあなたのコントローラーからこれらの例外を投げることができます。
HTTP の例外の使用例はアイテムが見つからなかった場合に 404 ページを描画することでしょう。 ::

    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('記事が見つかりません'));
        }
        $this->set('article', $article);
        $this->viewBuilder()->setOption('serialize', ['article']);
    }

HTTP エラー用の例外を使うことで、あなたのコードを綺麗にし、
かつ RESTful なレスポンスをアプリケーションのクライアントやユーザーに返すことができます。

コントローラー中での HTTP の例外の使用
--------------------------------------

失敗の状態を示すためにコントローラーのアクションからあらゆる
HTTP 関連の例外を投げることができます。例::

    use Cake\Network\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('記事が見つかりません'));
        }
        $this->set('article', 'article');
        $this->viewBuilder()->setOption('serialize', ['article']);
    }

上記は :php:exc:`NotFoundException` をキャッチして処理するための例外ハンドラーを設定するでしょう。
デフォルトではエラーページを作り、例外をログに記録するでしょう。

その他の組み込みの例外
----------------------

さらに、CakePHP は次の例外を使用します。

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException

    選択されたビュークラスが見つかりません。

.. php:exception:: MissingTemplateException

    選択されたテンプレートファイルが見つかりません。

.. php:exception:: MissingLayoutException

    選択されたレイアウトが見つかりません。

.. php:exception:: MissingHelperException

    選択されたヘルパーが見つかりません。

.. php:exception:: MissingElementException

    選択されたエレメントのファイルが見つかりません。

.. php:exception:: MissingCellException

    選択されたセルクラスが見つかりません。

.. php:exception:: MissingCellViewException

    選択されたセルのビューファイルが見つかりません。

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    設定されたコンポーネントが見つかりません。

.. php:exception:: MissingActionException

    要求されたコントローラーのアクションが見つかりません。

.. php:exception:: PrivateActionException

    private／protected／_ が前置されたアクションへのアクセス。

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    コンソールライブラリークラスがエラーに遭遇しました。

.. php:exception:: MissingTaskException

    設定されたタスクが見つかりません。

.. php:exception:: MissingShellException

    シェルクラスが見つかりません。

.. php:exception:: MissingShellMethodException

    選択されたシェルクラスが該当の名前のメソッドを持っていません。

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException

    モデルの接続がありません。

.. php:exception:: MissingDriverException

    データベースドライバーが見つかりません。

.. php:exception:: MissingExtensionException

    データベースドライバーのための PHP 拡張がありません。

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    モデルのテーブルが見つかりません。

.. php:exception:: MissingEntityException

    モデルのエンティティーが見つかりません。

.. php:exception:: MissingBehaviorException

    モデルのビヘイビアーが見つかりません。

.. php:exception:: PersistenceFailedException

    :php:meth:`Cake\\ORM\\Table::saveOrFail()` や
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()` を使用しましたが、
    エンティティーは、保存/削除されませんでした。

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

    要求されたレコードが見つかりません。
    これにより HTTP 応答ヘッダーも 404  に設定されます。

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    要求されたコントローラーが見つかりません。

.. php:exception:: MissingRouteException

    要求された URL はルーティングの逆引きができないか解析できません。

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    CakePHP での基底例外クラス。
    CakePHP によって投げられるすべてのフレームワーク層の例外はこのクラスを継承するでしょう。

これらの例外クラスはすべて :php:exc:`Exception` を継承します。
Exception を継承することにより、あなたは独自の‘フレームワーク’エラーを作ることができます。


.. php:method:: responseHeader($header = null, $value = null)

    :php:func:`Cake\\Network\\Request::header()` をご覧ください。

すべての Http と Cake の例外は Exception クラスを継承し、
レスポンスにヘッダーを追加するためのメソッドを持っています。
例えば、405 MethodNotAllowdException を投げる時、RFC2616 によると::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."

    「レスポンスは要求されたリソースに有効なメソッドの一覧を含むAllowヘッダーを含まなければ【ならない】」

.. meta::
    :title lang=ja: エラーと例外の処理
    :keywords lang=ja: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
