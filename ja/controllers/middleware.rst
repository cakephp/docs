ミドルウェア
############

ミドルウェアオブジェクトは、再利用可能で構成可能なリクエスト処理、あるいは
レスポンス構築処理の層でアプリケーションを‘ラップ’する機能を提供します。
ミドルウェアは CakePHP における新しい HTTP スタックの部分で、 PSR7 のリクエスト
およびレスポンスのインターフェイスを活用しています。 PSR7 標準の活用によって、
`Packagist <https://packagist.org>`__ で利用可能な、あらゆる PSR7 互換の
ミドルウェアを使うことができます。

CakePHP はいくつかのミドルウェアを既成で提供します。

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` はラップされたミドルウェアからくる
  例外を捕まえ、 :doc:`/development/errors` の例外ハンドラを使ってエラーページを描画します。
* ``Cake\Routing\AssetMiddleware`` はリクエストが、プラグインの webroot フォルダ
  あるいはテーマのそれに格納された CSS 、 JavaScript または画像ファイルといった、
  テーマまたはプラグインのアセットファイルを参照するかどうかを確認します。
* ``Cake\Routing\Middleware\RoutingMiddleware`` は受け取った URL を解析して、
  リクエストにルーティングパラメータを割り当てるために ``Router`` を使用します。
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` はブラウザによって送られる
  ``Accept-Language`` ヘッダによって自動で言語を切り替えられるようにします。

.. _using-middleware:

ミドルウェアの使用
==================

``App\Application`` クラスの ``middleware`` メソッドの中でミドルウェアを加えることができます。
もし ``App\Application`` クラスを持っていない場合、詳しくは :ref:`adding-http-stack`
の当該のセクションを参照してください。アプリケーションの ``middleware`` フックメソッドは
リクエスト処理の中で早くに呼ばれて、 ``Middleware`` オブジェクトを加えることができます。 ::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware($middleware)
        {
            // ミドルウェアのキューにエラーハンドラを結びつけます。
            $middleware->add(new ErrorHandlerMiddleware());
            return $middleware;
        }
    }

``MiddlewareQueue`` の末尾に追加するだけではなくて、さまざまな操作をすることができます。 ::

        $layer = new \App\Middleware\CustomMiddleware;

        // 追加されたミドルウェアは行列の末尾になります。
        $middleware->add($layer);

        // 追加されたミドルウェアは行列の先頭になります。
        $middleware->prepend($layer);

        // 特定の位置に挿入します。もし位置が範囲外の場合、
        // 末尾に追加されます。
        $middleware->insertAt(2, $layer);

        // 別のミドルウェアの前に挿入します。
        // もしその名前のクラスが見つからない場合、
        // 例外が発生します。
        $middleware->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // 別のミドルウェアの後に挿入します。
        // もしその名前のクラスが見つからない場合、
        // ミドルウェアは末尾に追加されます。
        $middleware->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

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
        function ($event, $middleware) {
            $middleware->add(new ContactPluginMiddleware());
        });

PSR7 リクエストとレスポンス
===========================

`PSR7 リクエストとレスポンスインターフェイス <http://www.php-fig.org/psr/psr-7/>`__ 
の先頭でミドルウェアと新しい HTTP スタックは構築されます。すべてのミドルウェアは
これらのインターフェイスに触れることになりますが、コントローラ、コンポーネント
およびビューは *そうではありません* 。

リクエストとの対話
------------------

``RequestInterface`` は、リクエストのヘッダ、メソッド、 URI 、およびボディと対話するための
メソッドを提供します。ヘッダと対話するには、このようにします。 ::

    // ヘッダをテキストとして読みます
    $value = $request->getHeaderLine(‘Content-Type’);

    // ヘッダを配列として読みます
    $value = $request->getHeader(‘Content-Type’);

    // すべてのヘッダを連想配列として読みます
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
リクエストパラメータを用いるためにこの属性を利用します。 CakePHP によって処理される
どのリクエストにおいても重要ないくつかの属性があります。

* ``base`` は、もしあればアプリケーションのベースディレクトリを持っています。
* ``webroot`` は、アプリケーションの webroot ディレクトリを持っています。
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

多くの場合、リクエスト上でヘッダとレスポンスのボディを設定することになるでしょう。 ::

    // ヘッダとステータスコードを割り当てます
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Pragma', 'no-cache')
        ->withStatus(422);

    // ボディに書き込みます
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
#. ミドルウェアは PSR7 ``ResponseInterface`` を実装したオブジェクトを返さなければなりません。

ミドルウェアは ``$next`` を呼ぶか、独自のレスポンスを作成することによって、レスポンスを
返すことができます。我々の単純なミドルウェアで、両方のオプションを見ることができます。 ::

    // src/Middleware/TrackingCookieMiddleware.php の中で
    namespace App\Middleware;

    class TrackingCookieMiddleware
    {
        public function __invoke($request, $response, $next)
        {
            // $next() を呼ぶことで、アプリケーションのキューの中で
            // *次の* ミドルウェアにコントロールを任せます。
            $response = $next($request, $response);

            // レスポンスを変更する時には、 next を呼んだ *後に*
            // それを行うべきです。
            if (!$request->cookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
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
        public function middleware($middleware)
        {
            // 単純なミドルウェアをキューに追加します
            $middleware->add(new TrackingCookieMiddleware());

            // もう少しミドルウェアをキューに追加します

            return $middleware;
        }
    }

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

これら二つの手順が完了すると、アプリケーション／プラグインのディスパッチフィルタを
HTTP ミドルウェアとして再実装を始める準備が整います。

もし、テストを実行する場合は、 `app スケルトン
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_ から、
ファイルの内容をコピーして **tests/bootstrap.php** を更新することも必要になります。

.. meta::
    :title lang=ja: Http ミドルウェア
    :keywords lang=ja: http, ミドルウェア, psr7, リクエスト, レスポンス, wsgi, アプリケーション, baseapplication
