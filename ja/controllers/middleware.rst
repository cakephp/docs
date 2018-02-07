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
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` は、 ``X-Frame-Options``
  のようなセキュリティに関連するヘッダーをレスポンスに簡単に追加することができます。
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` は、難読化されたデータで
  Cookie を操作する必要がある場合に備えて、暗号化された Cookie を操作する機能を提供します。
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` は、アプリケーションに CSRF
  保護を追加します。

.. _using-middleware:

ミドルウェアの使用
==================

ミドルウェアは、アプリケーションの全体、または個々のルーティングスコープに適用できます。

全てのリクエストにミドルウェアを適用するには、 ``App\Application`` クラスの
``middleware`` メソッドを使用してください。
もし ``App\Application`` クラスを持っていない場合、詳しくは :ref:`adding-http-stack`
の当該のセクションを参照してください。アプリケーションの ``middleware`` フックメソッドは
リクエスト処理の開始時に呼ばれて、 ``MiddlewareQueue`` オブジェクトを加えることができます。 ::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware($middlewareQueue)
        {
            // ミドルウェアのキューにエラーハンドラーを結びつけます。
            $middlewareQueue->add(new ErrorHandlerMiddleware());
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

アプリケーション全体にミドルウェアを適用するだけでなく、 :ref:`connecting-scoped-middleware`
を使用して、特定のルートセットにミドルウェアを適用することができます。

プラグインからのミドルウェア追加
--------------------------------

アプリケーションによってミドルウェアのキューが準備された後に、 ``Server.buildMiddleware``
イベントが引き起こされます。このイベントはプラグインからミドルウェアを追加するのに便利です。
プラグインは、それらのブートストラップスクリプトの中でリスナーを登録することができて、
それらがミドルウェアを追加します。 ::

    // ContactManager プラグインの bootstrap.php の中で
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Server.buildMiddleware',
        function ($event, $middlewareQueue) {
            $middlewareQueue->add(new ContactPluginMiddleware());
        });

PSR-7 リクエストとレスポンス
============================

`PSR-7 リクエストとレスポンスインターフェイス <http://www.php-fig.org/psr/psr-7/>`__
の先頭でミドルウェアと新しい HTTP スタックは構築されます。すべてのミドルウェアは
これらのインターフェイスに触れることになりますが、コントローラー、コンポーネント
およびビューは *そうではありません* 。

リクエストとの対話
------------------

``RequestInterface`` は、リクエストのヘッダー、メソッド、 URI 、およびボディーと対話するための
メソッドを提供します。ヘッダーと対話するには、このようにします。 ::

    // ヘッダーをテキストとして読みます
    $value = $request->getHeaderLine('Content-Type');

    // ヘッダーを配列として読みます
    $value = $request->getHeader('Content-Type');

    // すべてのヘッダーを連想配列として読みます
    $headers = $request->getHeaders();

リクエストは、それらが持つクッキーやアップロードされたファイルへのアクセスも提供します。 ::

    // クッキーの値の配列を得ます。
    $cookies = $request->getCookieParams();

    // UploadedFile オブジェクトの配列を得ます
    $files = $request->getUploadedFiles();

    // ファイルデータを読みます。
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // ファイルを移動します。
    $files[0]->moveTo($targetPath);

リクエストは URI オブジェクトを持っており、それがリクエストされた URI と対話するための
メソッドを持っています。 ::

    // URI を得ます
    $uri = $request->getUri();

    // URI の中からデータを読み取ります。
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();

最後に、リクエストの‘属性’と対話することができます。 CakePHP はフレームワーク固有の
リクエストパラメーターを用いるためにこの属性を利用します。 CakePHP によって処理される
どのリクエストにおいても重要ないくつかの属性があります。

* ``base`` は、もしあればアプリケーションのベースディレクトリーを持っています。
* ``webroot`` は、アプリケーションの webroot ディレクトリーを持っています。
* ``params`` は、ルーティング規則が処理された後で、ルートマッチングの結果を持ちます。
* ``session`` は、 CakePHP の ``Session`` オブジェクトのインスタンスを持っています。
  セッションオブジェクトをどう使うかについての詳しい情報は :ref:`accessing-session-object`
  を参照してください。

レスポンスとの対話
------------------

サーバーレスポンスを作成するために利用できるメソッドは、 :ref:`httpclient-response-objects`
と対話する時に利用できるものと同じです。インターフェイスは同じですが、利用シナリオは
異なっています。

レスポンスを変更する時には、レスポンスが **不変** であることを覚えておくことが重要です。
すべてのセッターメソッドの結果を格納することをいつでも覚えていてください。例えばこのように。 ::

    // これは $response を変更 *しません* 。新しいオブジェクトが
    // 変数に代入されませんでした。
    $response->withHeader('Content-Type', 'application/json');

    // これは動きます！
    $newResponse = $response->withHeader('Content-Type', 'application/json');

多くの場合、リクエスト上でヘッダーとレスポンスのボディーを設定することになるでしょう。 ::

    // ヘッダーとステータスコードを割り当てます
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Pragma', 'no-cache')
        ->withStatus(422);

    // ボディーに書き込みます
    $body = $response->getBody();
    $body->write(json_encode(['errno' => $errorCode]));

ミドルウェアの作成
==================

ミドルウェアは無名関数（クロージャ）として、あるいは呼び出し可能なクラスとしても実装できます。
クロージャは小さな課題に適している一方で、テストを行うのを難しくしますし、複雑な ``Application``
クラスを作ってしまいます。 CakePHP のミドルウェアクラスは、いくつかの規約を持っています。

* ミドルウェアクラスのファイルは **src/Middleware** に置かれるべきです。例えば
  **src/Middleware/CorsMiddleware.php** です。
* ミドルウェアクラスには ``Middleware`` と接尾語が付けられるべきです。例えば
  ``LinkMiddleware`` です。
* ミドルウェアはミドルウェアのプロトコルを実装することを期待されています。

（まだ）正式のインターフェイスではありませんが、ミドルウェアは緩やかなインターフェイス
あるいは‘プロトコル’を持っています。そのプロトコルとは下記のようなものです。

#. ミドルウェアは ``__invoke($request, $response, $next)`` を実装しなければなりません。
#. ミドルウェアは PSR-7 ``ResponseInterface`` を実装したオブジェクトを返さなければなりません。

ミドルウェアは ``$next`` を呼ぶか、独自のレスポンスを作成することによって、レスポンスを
返すことができます。我々の単純なミドルウェアで、両方のオプションを見ることができます。 ::

    // src/Middleware/TrackingCookieMiddleware.php の中で
    namespace App\Middleware;
    use Cake\I18n\Time;

    class TrackingCookieMiddleware
    {
        public function __invoke($request, $response, $next)
        {
            // $next() を呼ぶことで、アプリケーションのキューの中で
            // *次の* ミドルウェアにコントロールを任せます。
            $response = $next($request, $response);

            // レスポンスを変更する時には、 next を呼んだ *後に*
            // それを行うべきです。
            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie('landing_page' ,[
                    'value' => $request->here(),
                    'expire' => $expiry->format('U'),
                ]);
            }
            return $response;
        }
    }

さて、我々はごく単純なミドルウェアを作成しましたので、それを我々のアプリケーションに
加えてみましょう。 ::

    // src/Application.php の中で
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;

    class Application
    {
        public function middleware($middlewareQueue)
        {
            // 単純なミドルウェアをキューに追加します
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // もう少しミドルウェアをキューに追加します

            return $middlewareQueue;
        }
    }

.. _security-header-middleware:

セキュリティヘッダーの追加
==========================

``SecurityHeaderMiddleware`` レイヤーは、アプリケーションにセキュリティ関連の
ヘッダーを簡単に適用することができます。いったんミドルウェアをセットアップすると、
レスポンスに次のヘッダーを適用します。

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

このミドルウェアは、アプリケーションのミドルウェアスタックに適用される前に、
流れるようなインターフェースを使用して設定されます。 ::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $headers = new SecurityHeadersMiddleware();
    $headers
        ->setCrossDomainPolicy()
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->setXssProtection()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($headers);

.. versionadded:: 3.5.0
    ``SecurityHeadersMiddleware`` は 3.5.0 で追加されました。

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

.. versionadded:: 3.5.0
    ``EncryptedCookieMiddleware`` は 3.5.0 で追加されました。

.. _csrf-middleware:

クロスサイトリクエストフォージェリー (CSRF) ミドルウェア
========================================================

CSRF 保護は、ミドルウェアスタックに ``CsrfProtectionMiddleware`` を適用することにより、
アプリケーション全体または特定のスコープに適用できます。 ::

    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    $options = [
        // ...
    ];
    $csrf = new CsrfProtectionMiddleware($options);

    $middlewareQueue->add($csrf);

オプションは、ミドルウェアのコンストラクタに渡すことができます。
利用可能な設定オプションは次の通りです。

- ``cookieName`` 送信するクッキー名。デフォルトは ``csrfToken`` 。
- ``expiry`` CSRF トークンの有効期限。デフォルトは、ブラウザーセッション。
- ``secure`` クッキーにセキュアフラグをセットするかどうか。
  これは、HTTPS 接続でのみクッキーが設定され、通常の HTTP 経由での試みは失敗します。
  デフォルトは ``false`` 。
- ``httpOnly`` クッキーに HttpOnly フラグをセットするかどうか。デフォルトは ``false`` 。
- ``field`` 確認するフォームフィールド。デフォルトは ``_csrfToken`` 。
  これを変更するには、FormHelper の設定も必要です。

有効にすると、リクエストオブジェクトの現在の CSRF トークンにアクセスできます。 ::

    $token = $this->request->getParam('_csrfToken');

.. versionadded:: 3.5.0
    ``CsrfProtectionMiddleware`` は 3.5.0 で追加されました。

FormHelper との統合
-------------------

``CsrfProtectionMiddleware`` は、シームレスに ``FormHelper`` と統合されます。
``FormHelper`` でフォームを作成するたびに、CSRF トークンを含む隠しフィールドを
挿入します。

.. note::

    CSRF 保護を使用する場合は、常に ``FormHelper`` でフォームを開始する必要があります。
    そうしないと、各フォームに hidden 入力を手動で作成する必要があります。

CSRF 保護と AJAX リクエスト
---------------------------

リクエストデータパラメータに加えて、特別な ``X-CSRF-Token`` ヘッダーを通じて
CSRF トークンを送信することができます。ヘッダーを使用すると、重厚な JavaScript
アプリケーションや XML/JSON ベースの API エンドポイントに CSRF トークンを簡単に
統合することができます。

CSRF トークンは、クッキーの ``csrfToken`` で取得されます。

.. _adding-http-stack:

既存アプリケーションへの新しい HTTP スタック追加
================================================

既存のアプリケーションで HTTP ミドルウェアを使うには、アプリケーションにいくつかの
変更を行わなければなりません。

#. まず **webroot/index.php** を更新します。 `app スケルトン
   <https://github.com/cakephp/app/tree/master/webroot/index.php>`__ から
   ファイルの内容をコピーしてください。
#. ``Application`` クラスを作成します。どのようにするかについては上の :ref:`using-middleware`
   セクションを参照してください。もしくは `app スケルトン
   <https://github.com/cakephp/app/tree/master/src/Application.php>`__
   の中の例をコピーしてください。
#. **config/requirements.php** が作成します。もし存在しない場合、 `app スケルトン
   <https://github.com/cakephp/app/blob/master/config/requirements.php>`__ から
   内容を追加してください。

これら三つの手順が完了すると、アプリケーション／プラグインのディスパッチフィルターを
HTTP ミドルウェアとして再実装を始める準備が整います。

もし、テストを実行する場合は、 `app スケルトン
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_ から、
ファイルの内容をコピーして **tests/bootstrap.php** を更新することも必要になります。

.. meta::
    :title lang=ja: Http ミドルウェア
    :keywords lang=ja: http, ミドルウェア, psr-7, リクエスト, レスポンス, wsgi, アプリケーション, baseapplication
