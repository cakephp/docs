ミドルウェア
############

ミドルウェアオブジェクトは、再利用可能で構成可能なリクエスト処理、あるいは
レスポンス構築処理の層でアプリケーションを「ラップ」する機能を提供します。
視覚的には、アプリケーションは中央で終了し、ミドルウェアはタマネギのように
アプリの周囲を包み込みます。ここでは、Routes、Assets、例外処理、および
CORS ヘッダーミドルウェアでラップされたアプリケーションを確認できます。

.. image:: /_static/img/middleware-setup.png

アプリケーションによってリクエストが処理されると、最も外側のミドルウェアから
リクエストが入力されます。各ミドルウェアは、リクエスト/レスポンスを次のレイヤーに委譲するか、
またはレスポンスを返すことができます。レスポンスを返すことで、下位層がリクエストを見なくなります。
たとえば、開発中にプラグインの画像のリクエストを処理する AssetMiddleware がその例です。

.. image:: /_static/img/middleware-request.png

ミドルウェアがリクエストを処理するアクションを受け取らない場合、コントローラーが用意され、
そのアクションを呼び出すか、例外が発生してエラーページが生成されます。

ミドルウェアは CakePHP における新しい HTTP スタックの部分で、 PSR-7 のリクエスト
およびレスポンスのインターフェイスを活用しています。 PSR-7 標準の活用によって、
`Packagist <https://packagist.org>`__ で利用可能な、あらゆる PSR-7 互換の
ミドルウェアを使うことができます。

CakePHP のミドルウェア
=======================

CakePHP はウェブアプリケーションの一般的なタスクを処理するいくつかのミドルウェアを提供します。

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` はラップされたミドルウェアからくる
  例外を捕まえ、 :doc:`/development/errors` の例外ハンドラーを使ってエラーページを描画します。
* ``Cake\Routing\AssetMiddleware`` はリクエストが、プラグインの webroot フォルダー
  あるいはテーマのそれに格納された CSS 、 JavaScript または画像ファイルといった、
  テーマまたはプラグインのアセットファイルを参照するかどうかを確認します。
* ``Cake\Routing\Middleware\RoutingMiddleware`` は受け取った URL を解析して、
  リクエストにルーティングパラメーターを割り当てるために ``Router`` を使用します。
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` はブラウザーによって送られる
  ``Accept-Language`` ヘッダーによって自動で言語を切り替えられるようにします。
* ``Cake\Http\Middleware\HttpsEnforcerMiddleware`` の利用はHTTPSを要求します。
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` は、 ``X-Frame-Options``
  のようなセキュリティに関連するヘッダーをレスポンスに簡単に追加することができます。
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` は、難読化されたデータで
  Cookie を操作する必要がある場合に備えて、暗号化された Cookie を操作する機能を提供します。
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` は、アプリケーションに CSRF
  保護を追加します。
* ``Cake\Http\Middleware\BodyParserMiddleware`` は ``Content-Type`` ヘッダーに基づいて
  JSON, XML, その他のエンコードされたリクエストボディーをデコードすることができます。
* ``Cake\Http\Middleware\CspMiddleware`` を使用すると、
  アプリケーションに Content-Security-Policy ヘッダを追加するのがより簡単になります。

.. _using-middleware:

ミドルウェアの使用
==================

ミドルウェアは、アプリケーションの全体、または個々のルーティングスコープに適用できます。

全てのリクエストにミドルウェアを適用するには、 ``App\Application`` クラスの
``middleware`` メソッドを使用してください。
アプリケーションの ``middleware`` フックメソッドはリクエスト処理の開始時に呼ばれて、
``MiddlewareQueue`` オブジェクトを加えることができます。 ::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // ミドルウェアのキューにエラーハンドラーを結びつけます。
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            return $middlewareQueue;
        }
    }

``MiddlewareQueue`` の末尾に追加するだけではなくて、さまざまな操作をすることができます。 ::

        $layer = new \App\Middleware\CustomMiddleware;

        // 追加されたミドルウェアは行列の末尾になります。
        $middlewareQueue->add($layer);

        // 追加されたミドルウェアは行列の先頭になります。
        $middlewareQueue->prepend($layer);

        // 特定の位置に挿入します。もし位置が範囲外の場合、
        // 末尾に追加されます。
        $middlewareQueue->insertAt(2, $layer);

        // 別のミドルウェアの前に挿入します。
        // もしその名前のクラスが見つからない場合、
        // 例外が発生します。
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // 別のミドルウェアの後に挿入します。
        // もしその名前のクラスが見つからない場合、
        // ミドルウェアは末尾に追加されます。
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );


If your middleware is only applicable to a subset of routes or individual
controllers you can use :ref:`Route scoped middleware <route-scoped-middleware>`,
or :ref:`Controller middleware <controller-middleware>`.

プラグインからのミドルウェア追加
--------------------------------

プラグインは ``middleware`` フックメソッドを使って、
ミドルウェアをアプリケーションのミドルウェアキューに適用することができます。 ::

    // ContactManager プラグインの bootstrap.php の中で
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;

    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            $middlewareQueue->add(new ContactManagerContextMiddleware());

            return $middlewareQueue;
        }
    }

ミドルウェアの作成
==================

ミドルウェアは無名関数（クロージャ）として、あるいは呼び出し可能なクラスとしても実装できます。
また、 ``Psr\Http\\ServerMiddlewareInterface`` を拡張するクラスとして実装することもできます。
クロージャは小さな課題に適している一方で、テストを行うのを難しくしますし、複雑な ``Application``
クラスを作ってしまいます。 CakePHP のミドルウェアクラスは、いくつかの規約を持っています。

* ミドルウェアクラスのファイルは **src/Middleware** に置かれるべきです。例えば
  **src/Middleware/CorsMiddleware.php** です。
* ミドルウェアクラスには ``Middleware`` と接尾語が付けられるべきです。例えば
  ``LinkMiddleware`` です。
* ミドルウェアは、 ``Psr\Http\ServerMiddlewareInterface``` を実装しなければなりません。

ミドルウェアは ``$handler->handle()`` を呼ぶか、独自のレスポンスを作成することによって、レスポンスを
返すことができます。我々の単純なミドルウェアで、両方のオプションを見ることができます。 ::

    // src/Middleware/TrackingCookieMiddleware.php の中で
    namespace App\Middleware;

    use Cake\Http\Cookie\Cookie;
    use Cake\I18n\Time;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\RequestHandlerInterface;
    use Psr\Http\Server\MiddlewareInterface;

    class TrackingCookieMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface
        {
            // Calling $handler->handle()  を呼ぶことで、アプリケーションのキューの中で
            // *次の* ミドルウェアにコントロールを任せます。
            $response = $handler->handle($request);

            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie(new Cookie(
                    'landing_page',
                    $request->getRequestTarget(),
                    $expiry
                ));
            }

            return $response;
        }
    }

さて、我々はごく単純なミドルウェアを作成しましたので、それを我々のアプリケーションに
加えてみましょう。 ::

    // src/Application.php の中で
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // 単純なミドルウェアをキューに追加します
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // もう少しミドルウェアをキューに追加します

            return $middlewareQueue;
        }
    }


.. _routing-middleware:

ルーティングミドルウェア
========================

ルーティングミドルウェアは、アプリケーションのルートの適用や、リクエストが実行するプラグイン、
コントローラー、アクションを解決することができます。起動時間を向上させるために、
アプリケーションで使用されているルートコレクションをキャッシュすることができます。
キャッシュされたルートを有効にするために、目的の :ref:`キャッシュ設定 <cache-configuration>`
をパラメーターとして指定します。 ::

    // Application.php の中で
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

上記は、生成されたルートコレクションを格納するために ``routing`` キャッシュエンジンを使用します。


.. _encrypted-cookie-middleware:

クッキー暗号化ミドルウェア
==========================

アプリケーションが難読化してユーザーの改ざんから保護したいデータを含むクッキーがある場合、
CakePHP のクッキー暗号化ミドルウェアを使用して、ミドルウェア経由でクッキーデータを透過的に
暗号化や復号化することができます。 クッキーデータは、OpenSSL 経由で AES を使用して
暗号化されます。 ::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // 保護するクッキーの名前
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlewareQueue->add($cookies);

.. note::
    クッキーデータで使用する暗号化キーは、クッキーデータ *のみ* に使用することを
    お勧めします。

このミドルウェアが使用する暗号化アルゴリズムとパディングスタイルは、
CakePHP の以前のバージョンの ``CookieComponent`` と後方互換性があります。

.. _body-parser-middleware:

ボディパーサミドルウェア
========================

アプリケーションが JSON、XML、またはその他のエンコードされたリクエストボディを受け入れる場合、
``BodyParserMiddleware`` を使用すると、それらのリクエストを配列にデコードして、
``$request->getParsedData()`` および ``$request->getData()`` で利用可能です。
デフォルトでは ``json`` ボディのみがパースされますが、オプションでXMLパースを有効にすることができます。
独自のパーサーを定義することもできます。 ::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // JSONのみがパースされます。
    $bodies = new BodyParserMiddleware();

    // XMLパースを有効にする
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // JSONパースを無効にする
    $bodies = new BodyParserMiddleware(['json' => false]);

    // content-type ヘッダーの値にマッチする独自のパーサを
    // それらをパース可能な callable に追加します。
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use a CSV parsing library.
        return Csv::parse($body);
    });

.. meta::
    :title lang=ja: Http ミドルウェア
    :keywords lang=ja: http, ミドルウェア, psr-7, リクエスト, レスポンス, wsgi, アプリケーション, baseapplication, https
