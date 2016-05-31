エラーと例外の処理
##################

多くのPHP内部メソッドは失敗を伝えるためにエラーを使用します。
これらのエラーはトラップされ、対処される必要があるでしょう。
CakePHPはエラーが起きるとそれを表示しまたはログに記録する既定のエラートラップを備えています。
この同じエラーハンドラがあなたのアプリケーション中のコントローラや他の部分から
キャッチされなかった例外をつかまえるために用いられます。

.. _error-configuration:

エラーと例外の設定
==================

エラーの設定はあなたのアプリケーションの **config/app.php** ファイル中で行われます。
既定ではCakePHPはエラーをトラップし、そのエラーを表示／ログに記録するために
``ErrorHandler`` または ``ConsoleErrorHandler`` クラスを使用します。

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

エラーハンドラは既定では、``debug`` が ``true`` の時にエラーを表示し、
``debug`` が ``false`` の時にエラーをログに記録します。
いずれも捕捉されるエラータイプは ``errorLevel`` によって制御されます。
致命的エラーのハンドラは ``debug`` レベルや ``errorLevel`` とは独立して呼び出されますが、
その結果は ``debug`` レベルによって変わるでしょう。
致命的エラーに対する既定のふるまいは内部サーバーエラーページ（``debug`` 無効）
またはエラーメッセージ、ファイルおよび行を含むページ（``debug`` 有効）を表示します。

.. note::

    もしカスタムエラーハンドラを使うなら、サポートされるオプションはあなたのハンドラに依存します。

独自エラーハンドラの作成
========================

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

``BaseErrorHandler`` は二つの抽象メソッドを定義しています。
``_displayError()`` はエラーが引き起こされた時に使われます。
``_displayException()`` メソッドはキャッチされなかった例外がある時に呼ばれます。

致命的エラーのふるまい変更
==========================

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

CakePHPにはいくつかの例外クラスがあります。
組み込みの例外処理ではキャッチされなかったあらゆる例外を捕捉しページを描画するでしょう。
例外は400番台のコードは使わず、内部サーバーエラーとして扱われるでしょう。

.. _built-in-exceptions:

CakePHP用の組み込みの例外
=========================

HTTPの例外
----------

CakePHP内部のいくつかの組み込みの例外には、内部的なフレームワークの例外の他に、
HTTPメソッド用のいくつかの例外があります。

.. php:exception:: BadRequestException

    400 Bad Request エラーに使われます。 

.. php:exception:: UnauthorizedException

    401 Unauthorized エラーに使われます。

.. php:exception:: ForbiddenException

    403 Forbidden エラーに使われます。

.. versionadded:: 3.1

    InvalidCsrfTokenExceptionが追加されました。

.. php:exception:: InvalidCsrfTokenException

    無効なCSRFトークンによって引き起こされた403エラーに使われます。

.. php:exception:: NotFoundException

    404 Not Found エラーに使われます。

.. php:exception:: MethodNotAllowedException

    405 Method Not Allowed エラーに使われます。



.. php:exception:: NotAcceptableException

    406 Not Acceptable エラーに使われます。
    
    .. versionadded:: 3.1.7 NotAcceptableExceptionが追加されました。

.. php:exception:: ConflictException

    409 Conflict エラーに使われます。

    .. versionadded:: 3.1.7 ConflictExceptionが追加されました。

.. php:exception:: GoneException

    410 Gone エラーに使われます。

    .. versionadded:: 3.1.7 GoneExceptionが追加されました。

HTTP 4xx エラーステータスコードの詳細は :rfc:`2616#section-10.4` を参照。

.. php:exception:: InternalErrorException

    500 Internal Server Error に使われます。

.. php:exception:: NotImplementedException

    501 Not Implemented エラーに使われます。



.. php:exception:: ServiceUnavailableException

    503 Service Unavailable エラーに使われます。

    .. versionadded:: 3.1.7 Service Unavailableが追加されました。

HTTP 5xx エラーステータスコードの詳細は :rfc:`2616#section-10.5` を参照。

失敗の状態やHTTPエラーを示すためにあなたのコントローラからこれらの例外を投げることができます。
HTTPの例外の使用例はアイテムが見つからなかった場合に404ページを描画することでしょう::

    use Cake\Network\Exception\NotFoundException;
    
    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('記事が見つかりません'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

HTTPエラー用の例外を使うことで、あなたのコードを綺麗にし、
かつRESTfulなレスポンスをアプリケーションのクライアントやユーザーに返すことができます。

その他の組み込みの例外
----------------------

加えて、以下のフレームワーク層の例外が利用可能で、
そしていくつかのCakePHPのコアコンポーネントから投げられるでしょう。

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

    選択されたビューファイルが見つかりません。

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    設定されたコンポーネントが見つかりません。

.. php:exception:: MissingActionException

    要求されたコントローラのアクションが見つかりません。

.. php:exception:: PrivateActionException

    private／protected／_が前置されたアクションへのアクセス。

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    コンソールライブラリクラスがエラーに遭遇しました。

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

    データベースドライバが見つかりません。

.. php:exception:: MissingExtensionException

    データベースドライバのためのPHP拡張がありません。

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    モデルのテーブルが見つかりません。

.. php:exception:: MissingEntityException

    モデルのエンティティが見つかりません。

.. php:exception:: MissingBehaviorException

    モデルのビヘイビアが見つかりません。

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

    要求されたレコードが見つかりません。
    これはHTTPレスポンスヘッダに404を設定しもするでしょう。

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    要求されたコントローラが見つかりません。

.. php:exception:: MissingRouteException

    要求されたURLはルーティングの逆引きができないか解析できません。

.. php:exception:: MissingDispatcherFilterException

    ディスパッチャフィルタが見つかりません。

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    CakePHPでの基底例外クラス。
    CakePHPによって投げられるすべてのフレームワーク層の例外はこのクラスを継承するでしょう。

これらの例外クラスはすべて :php:exc:`Exception` を継承します。
Exception を継承することにより、あなたは独自の‘フレームワーク’エラーを作ることができます。
CakePHPが投げるであろう標準の例外もすべてExceptionを継承します。

.. php:method:: responseHeader($header = null, $value = null)

    :php:func:`Cake\\Network\\Request::header()` 参照

すべてのHttpとCakeの例外はExceptionクラスを継承し、
レスポンスにヘッダを追加するためのメソッドを持っています。
RFC2616 MethodNotAllowedExceptionは言っています::

    「レスポンスは要求されたリソースに有効なメソッドの一覧を含むAllowヘッダを含まなければ【ならない】」


コントローラ中でのHTTPの例外の使用
==================================

失敗の状態を示すためにあたなのコントローラのアクションからあらゆるHTTP関連の例外を投げることができます。
たとえば::

    use Cake\Network\Exception\NotFoundException;
    
    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('記事が見つかりません'));
        }
        $this->set('article', 'article');
        $this->set('_serialize', ['article']);
    }

上記は :php:exc:`NotFoundException` をキャッチして処理するための例外ハンドラを設定するでしょう。
既定ではエラーページを作り、例外をログに記録するでしょう。

.. _error-views:

例外のレンダラ
==============

.. php:class:: ExceptionRenderer(Exception $exception)

``ErrorController`` の手助けをするExceptionRendererクラスは
あなたのアプリケーションによって投げられたすべての例外のためのエラーページを処理します。

エラーページのビューは **src/Template/Error/** に配置されます。
すべての4xxと5xxエラー用のテンプレートファイル **error400.ctp** と **error500.ctp** がそれぞれ使われます。
必要に応じてそれらをカスタマイズすることができます。
既定では **src/Template/Layout/default.ctp** もエラーページに使われます。
たとえばもしも、他のレイアウト **src/Template/Layout/my_error.ctp** をエラーページに使いたい場合、
単純にエラー用ビューを編集して ``$this->layout = 'my_error';`` という文を
**error400.ctp** と **error500.ctp** に追加してください。

各フレームワーク層の例外はコアのテンプレートに置かれた個別のビューファイル持っていますが
それらは開発中の間にのみ使われますのでそれらのカスタマイズに悩む必要はまったくありません。

.. index:: application exceptions

独自のアプリケーション例外の作成
================================

組み込みの `SPLの例外 <http://php.net/manual/en/spl.exceptions.php>`_ 、``Exception`` そのもの、
または :php:exc:`Cake\\Core\\Exception\\Exception` のいずれかを使って
あなた独自のアプリケーション例外を作ることができます。
もしあなたのアプリケーションが以下の例外を含んでいたなら::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {};

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

組み込みの例外ハンドラにキャッチされた時、あなたはエラービューテンプレート中に ``$widget`` 変数を得られるでしょう。
加えてもしその例外を文字列にキャストするかその ``getMessage()`` メソッドを使うと ``%s が見当たらないようです。`` を得られるでしょう。
これにより、ちょうどCakePHPが内部的に使っているように、あなた独自の富んだ開発用エラーを手早く作ることができます。

カスタムステータスコードの作成
------------------------------

例外を生成する際にコードを変えることでカスタムHTTPステータスコードを作ることができます::
    
        throw new MissingWidgetHelperException('それはここにはありません', 501);

これは501のレスポンスコードを作るでしょうが、あなたが望むあらゆるHTTPステータスコードを使うことができます。
開発中は、もしあなたの例外が特定のテンプレートを持っておらず、かつ500番以上のコードを使うと
**error500.ctp** テンプレートが表示されるでしょう。他のあらゆるエラーコードでは **error400.ctp** テンプレートになるでしょう。
もしカスタムの例外用のエラーテンプレートを定義している場合、そのテンプレートが開発中は使われるでしょう。
もし本番でもあなた独自の例外処理方法が欲しい場合は次の節を参照してください。


独自の例外ハンドラの継承と実装
==============================

あなたはいくつかの方法でアプリケーション固有の例外処理を実装することができます。
各方法ごとに、例外処理工程における異なる量の制御権をあなたに与えます。

- 独自のカスタムエラーハンドラの作成と登録
- CakePHPによって提供される ``BaseErrorHandler`` の継承
- 既定のエラーハンドラに ``exceptionRenderer`` オプションの設定

次の節では、さまざまな方法とそれらが各々持つ利点について詳述します。

独自の例外ハンドラの作成と登録
------------------------------

独自の例外ハンドラの作成は、例外処理工程における全制御権をあなたに与えます。
この場合には、あなたは ``set_exception_handler`` を自分で呼ばなければならないでしょう。

BaseErrorHandlerの継承
----------------------

:ref:`error-configuration` の節にこの例があります。

既定のハンドラのexceptionRendererオプションの使用
-------------------------------------------------

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

上記は ``MissingWidgetException`` 型のあらゆる例外を処理し、
それらのアプリケーション例外を表示／処理するためのカスタム処理ができるようにします。
例外処理メソッドは、引数として処理される例外を受け取ります。
あなたのカスタム例外処理は文字列または ``Response`` オブジェクトを返すことができます。
``Response`` オブジェクトの返却はそれのレスポンスに対する全制御権をあなたに与えます。
  
.. note::

    カスタムレンダラはコンストラクタで例外を受け取るのを期待し、renderメソッドを実装します。
    
    もしもカスタム例外処理を使っている場合、レンダラの設定変更は効果がありません。
    あなたの実装の中であなたがそれを参照しない限り。

例外処理のためのカスタムコントローラ作成
----------------------------------------

慣例ではCakePHPはもし存在すれば ``App\Controller\ErrorController`` を使います。
このクラスを実装することで、エラーページ出力のカスタマイズの設定に依存しない方法を提供します。

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

エラーコントローラは、カスタムであろうと慣例のままであろうと、エラーページの表示に使われ、
すべての標準のリクエストライフサイクルイベントを受け取ります。

例外のログ記録
--------------

組み込みの例外処理を使うと、 **config/app.php** 中で ``log`` オプションに ``true`` を設定することで
ErrorHandler によって対処されるすべての例外をログに記録することができます。
これを有効にすることで :php:class:`Cake\\Log\\Log` と設定済みのロガーに各例外の記録が残るでしょう。

.. note::

    もしもカスタム例外処理を使っている場合、この設定は効果がないでしょう。
    あなたの実装の中であなたがそれを参照しない限り。

.. meta::
    :title lang=ja: エラーと例外の処理
    :keywords lang=ja: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
