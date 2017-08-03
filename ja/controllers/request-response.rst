リクエストとレスポンスオブジェクト
##################################

.. php:namespace:: Cake\Http

リクエストとレスポンスオブジェクトは、HTTP リクエストとレスポンスの周辺の抽象化を提供します。
CakePHP のリクエストオブジェクトは、入ってきたリクエストを省みることができる一方、
レスポンスオブジェクトは容易にコントローラーから HTTP レスポンスを作成することができます。

.. index:: $this->request
.. _cake-request:

リクエスト
==========

.. php:class:: ServerRequest

``ServerRequest`` は、CakePHP で使用されるデフォルトのリクエストオブジェクトです。
リクエストデータへの応答と対話が中心的な機能となります。リクエストごとに Request は一つ作られ、
リクエストデータを使うアプリケーションの様々なレイヤーに参照が渡されます。
デフォルトのリクエストは ``$this->request`` に設定され、コントローラー、セル、ビュー、
ヘルパーの中で利用できます。またコントローラーの参照を使うことでコンポーネントの中からも
アクセスすることが出来ます。 ``ServerRequest`` の役割は以下の通りです。

* GET, POST, そして FILES 配列を慣れ親しんだデータ構造に変換する処理を行います。
* リクエストに関連する内省的環境を提供します。送信されたヘッダーやクライアントの IP アドレス、
  サーバーが実行されているサブドメイン/ドメインの情報などが含まれます。
* リクエストパラメーターへのアクセス方法をインデックス付き配列とオブジェクトのプロパティーの
  両方の形式で提供します。

3.4.0 以降、 CakePHP のリクエストオブジェクトは、CakePHP の外部のライブラリーを
使用しやすくするため `PSR-7 ServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_
を実装します。

リクエストパラメーター
----------------------

リクエストは、 ``getParam()`` メソッドを介して、ルーティングパラメーターを用意しています。 ::

    $controllerName = $this->request->getParam('controller');

    // 3.4.0 より前
    $controllerName = $this->request->param('controller');

すべての :ref:`route-elements` は、このインターフェイスを通してアクセスされます。

:ref:`route-elements` に加えて :ref:`passed-arguments` へのアクセスがしばしば必要になります。
これらは両方ともリクエストオブジェクトと同様に利用可能です。 ::

    // 渡された引数
    $passedArgs = $this->request->getParam('pass');

すべての渡された引数にアクセスする方法が提供されています。この中には CakePHP の内部で使っている
重要で役に立つパラメーターが存在し、また、リクエストパラメーターの中ですべて見つけられます。

* ``plugin`` リクエストを処理するプラグインです。プラグインが存在しない場合は null になります。
* ``controller`` 現在のリクエストを処理するコントローラーです。
* ``action`` 現在のリクエストを処理するアクションです。
* ``prefix`` 現在のアクションのプレフィックスです。詳しくは、 :ref:`prefix-routing` をご覧ください。

クエリー文字列パラメーター
--------------------------

.. php:method:: getQuery($name)

クエリー文字列パラメーターは、 ``getQuery()`` メソッドを使って読み取ることができます。 ::

    // URL は /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

    // 3.4.0 より前
    $this->request->query('page');

query プロパティーに直接アクセスするか、エラーが発生しない方法で URL クエリー配列を読むために
``getQuery()`` メソッドを使用することができます。キーが存在しない場合、 ``null`` が返ります。 ::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // デフォルト値も提供できます。
    $foo = $this->request->getQuery('does_not_exist', 'default val');

``getQueryParams()`` を使用すると全てのクエリー文字列パラメーターにアクセスできます。 ::

    $query = $this->request->getQueryParams();

.. versionadded:: 3.4.0
    ``getQueryParams()`` と ``getQuery()`` は 3.4.0 で追加されました。

リクエストのボディーデータ
--------------------------

.. php:method:: getData($name, $default = null)

すべての POST データは :php:meth:`Cake\\Http\\ServerRequest::getData()` を使ってアクセスされます。
フォームデータが ``data`` 接頭辞を含んでいる場合、接頭辞は取り除かれるでしょう。例えば::

    // name 属性が 'MyModel[title]' の入力は次のようにアクセスします。
    $title = $this->request->getData('MyModel.title');

キーが存在しない場合、 ``null`` が返ります。 ::

    $foo = $this->request->getData('Value.that.does.not.exist');
    // $foo == null

PUT、PATCH または DELETE データ
-------------------------------

.. php:method:: input($callback, [$options])

REST サービスを構築しているとき ``PUT`` と ``DELETE`` リクエストのデータを受付けることが
よくあります。 ``application/x-www-form-urlencoded`` リクエストボディーのデータは
``PUT`` と ``DELETE`` リクエストでは自動的に構文解析され ``$this->data`` に設定されます。
もし JSON や XML データを受け付けている場合、どうやってリクエストボディーにアクセスすればいいのかに
ついては以下の説明を見て下さい。

入力されたデータにアクセスする場合、オプション機能でそれをデコードすることができます。
XML や JSON のリクエストボディーのコンテンツと対話するときに便利です。
デコード機能のための追加のパラメーターは、 ``input()`` の引数として渡すことができます。 ::

    $jsonData = $this->request->input('json_decode');

環境変数 ($ _SERVER と $ _ENV より)
-----------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` は、 ``env()`` グローバル関数のラッパーで、グローバルな
``$_SERVER`` や ``$_ENV`` を変更することなくゲッター/セッターとして動作します。 ::

    // ホストの取得
    $host = $this->request->env('HTTP_HOST');

    // 値を設定。一般的にはテストに役立ちます。
    $this->request->env('REQUEST_METHOD', 'POST');

``getServerParams()`` を使用すると、全ての環境変数にアクセスできます。 ::

    $env = $this->request->getServerParams();

.. versionadded:: 3.4.0
    ``getServerParams()`` は、3.4.0 で追加されました。

XML または JSON データ
----------------------

:doc:`/development/rest` を採用しているアプリケーションでは URL エンコードされていない
post 形式でデータを交換することがしばしばあります。 :php:meth:`~Cake\\Http\\ServerRequest::input()`
を使用すると、任意の形式の入力データを読み込むことができます。
デコード関数が提供されることでデシリアライズされたコンテンツを受け取ることができます。 ::

    // PUT/POST アクションで投稿されたデータを JSON 形式にエンコードで取得する
    $jsonData = $this->request->input('json_decode');

``json_decode`` で「結果を配列として受け取る」パラメーターのように、デシリアライズメソッドの中には
呼び出し時に追加パラメーターが必要なものがあります。同様に、 Xml を DOMDocument オブジェクトに
変換したい場合、 :php:meth:`~Cake\\Http\\ServerRequest::input()` は、
追加のパラメーターを渡すことができます。 ::

    // PUT/POST アクションで投稿されたデータを XML エンコードで取得する
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

パス情報
--------

リクエストオブジェクトはまたアプリケーションのパスについての役立つ情報を提供しています。
``base`` や ``webroot`` 属性は URL の生成や、 アプリケーションが
サブディレクトリーにいるのかどうかの決定に役立ちます。様々な属性が使用できます。 ::

    // 現在のリクエスト URL が /subdir/articles/edit/1?page=1 であると仮定

    // /subdir/articles/edit/1?page=1 を保持
    $here = $request->here();

    // /subdir を保持
    $base = $request->getAttribute('base');

    // /subdir/ を保持
    $base = $request->getAttribute('base');

    // 3.4.0 より前
    $webroot = $request->webroot;
    $base = $request->base;

.. _check-the-request:

リクエストの状態をチェック
--------------------------

.. php:method:: is($type, $args...)

リクエストオブジェクトは、特定のリクエストに一定の条件を検査する簡単な方法を提供します。
``is()`` メソッドを使用することで、多くの一般的な条件を確認するだけでなく、
他のアプリケーション固有の要求基準を検査することができます。 ::

    $isPost = $this->request->is('post');

新しい種類の検出器を作成するために :php:meth:`Cake\\Http\\ServerRequest::addDetector()`
を使用することで利用可能なリクエスト検出器を拡張することができます。4種類の異なる検出器を作成できます。

* 環境変数の比較 - 環境変数の比較、 :php:func:`env()` から取得された値と提供された値が
  等しいかどうかを比較します。
* パターン値の比較 - パターン値の比較では :php:func:`env()` から取得された値と正規表現を比較します。
* オプションベースの比較 - オプションベースの比較では正規表現を作成するためにオプションのリストを使います。
  既に定義済みのオプション検出器を追加するための呼び出しはオプションをマージするでしょう。
* コールバック検出器 - コールバック検出器はチェックをハンドリングするために 'callback' タイプを
  提供します。コールバックはパラメーターとしてだけリクエストオブジェクトを受け取ります。

.. php:method:: addDetector($name, $options)

いくつかの例::

    // environment detector の追加
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // pattern value detector の追加
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // option detector の追加
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // callback detector を追加。有効な callable 形式でなければなりません。
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // 追加の引数を使用する検出器を追加。3.3.0 以降。
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->getParam('controller') === $name;
        }
    );

``Request`` は、 :php:meth:`Cake\\Http\\ServerRequest::domain()` 、
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` 、
:php:meth:`Cake\\Http\\ServerRequest::host()` のようにサブドメインで
アプリケーションを助けるためのメソッドを含みます。

利用可能な組み込みの検出器は以下の通りです。

* ``is('get')`` 現在のリクエストが GET かどうかを調べます。
* ``is('put')`` 現在のリクエストが PUT かどうかを調べます。
* ``is('patch')`` 現在のリクエストが PATCH かどうかを調べます。
* ``is('post')`` 現在のリクエストが POST かどうかを調べます。
* ``is('delete')`` 現在のリクエストが DELETE かどうかを調べます。
* ``is('head')`` 現在のリクエストが HEAD かどうかを調べます。
* ``is('options')`` 現在のリクエストが OPTIONS かどうかを調べます。
* ``is('ajax')`` 現在のリクエストが X-Requested-With = XMLHttpRequest
  に由来するものかどうかを調べます。
* ``is('ssl')`` リクエストが SSL 経由かどうかを調べます。
* ``is('flash')`` リクエストに Flash の User-Agent があるかどうかを調べます。
* ``is('requested')`` リクエストに、値が１のクエリーパラメーター 「requested」があるかどうかを調べます。
* ``is('json')`` リクエストに 「json」 の拡張子を持ち 「application/json」
  MIME タイプを受付けるかどうかを調べます。
* ``is('xml')`` リクエストが 「xml」拡張子を持ち、「application/xml」または「text/xml」
  MIME タイプを受付けるかどうかを調べます。

.. versionadded:: 3.3.0
    3.3.0 から検出器は追加のパラメーターが受け取れます。


セッションデータ
----------------

特定のリクエストのセッションにアクセスするには、 ``session()`` メソッドを使用します。 ::

    $userName = $this->request->session()->read('Auth.User.name');

詳細については、セッションオブジェクトを使用する方法のための :doc:`/development/sessions`
ドキュメントを参照してください。

ホストとドメイン名
------------------

.. php:method:: domain($tldLength = 1)

アプリケーションが実行されているドメイン名を返します。 ::

    // 'example.org' を表示
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

アプリケーションが実行されているサブドメインを配列で返します。 ::

    // 'my.dev.example.org' の場合、 ['my', 'dev'] を返す 
    $subdomains = $request->subdomains();

.. php:method:: host()

アプリケーションのホスト名を返します。 ::

    // 'my.dev.example.org' を表示
    echo $request->host();

HTTP メソッドの読み込み
-----------------------

.. php:method:: getMethod()

リクエストの HTTP メソッドを返します。 ::

    // POST を出力
    echo $request->getMethod();

    // 3.4.0 より前
    echo $request->method();

アクションが受け入れる HTTP メソッドの制限
-------------------------------------------

.. php:method:: allowMethod($methods)

許可された HTTP メソッドを設定します。
もしマッチしなかった場合、 ``MethodNotAllowedException`` を投げます。
405 レスポンスには、通過できるメソッドを持つ ``Allow`` ヘッダーが含まれます。 ::

    public function delete()
    {
        // POST と DELETE のリクエストのみ受け入れます
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

HTTP ヘッダーの読み込み
-----------------------

リクエストで使われている ``HTTP_*`` ヘッダーにアクセスできます。
例えば::

    // 文字列としてヘッダーを取得
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // 全ての値を配列で取得
    $acceptHeader = $this->request->getHeader('Accept');

    // ヘッダーの存在を確認
    $hasAcceptHeader = $this->request->hasHeader('Accept');

    // 3.4.0 より前
    $userAgent = $this->request->header('User-Agent');

いくつかの apache インストール環境では、 ``Authorization`` ヘッダーにアクセスできませんが、
CakePHP は、必要に応じて apache 固有のメソッドを介して利用できるようにします。

.. php:method:: referer($local = false)

リクエストのリファラーを返します。

.. php:method:: clientIp()

現在アクセスしているクライアントの IP アドレスを返します。

プロキシーヘッダーの信頼
------------------------

アプリケーションがロードバランサーの背後にあったり、クラウドサービス上で実行されている場合、
しばしばリクエストでロードバランサーのホスト、ポートおよびスキームを取得します。
多くの場合、ロードバランサーはまた、オリジナルの値として ``HTTP-X-Forwarded-*`` ヘッダーを送信します。
転送されたヘッダーは、CakePHP によって使用されることはありません。リクエストオブジェクトで
これらのヘッダーを使用するには、 ``trustProxy`` プロパティーを ``true`` にを設定します。 ::

    $this->request->trustProxy = true;

    // これらのメソッドがプロキシーのヘッダーを使用するようになります。
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Accept ヘッダーの確認
---------------------

.. php:method:: accepts($type = null)

クライアントがどのコンテンツタイプを受付けるかを調べます。また、特定のコンテンツタイプが
受付られるかどうかを調べます。

すべてのタイプを取得::

    $accepts = $this->request->accepts();

あるタイプについての確認::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

クライアントが受付けるすべての言語を取得します。また、特定の言語が受付られるかどうかを調べます。

受付られる言語のリストを取得::

    $acceptsLanguages = $this->request->acceptLanguage();

特定の言語が受付られるかどうかの確認::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. _request-cookies:

Cookies
-------

Request cookies can be read through a number of methods::

    // Get the cookie value, or null if the cookie is missing.
    $rememberMe = $this->request->getCookie('remember_me');

    // Read the value, or get the default of 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Get all cookies as an hash
    $cookies = $this->request->getCookieParams();

    // Get a CookieCollection instance (starting with 3.5.0)
    $cookies = $this->request->getCookieCollection()

See the :php:class:`Cake\\Http\\Cookie\\CookieCollection` documentation for how
to work with cookie collection.

.. versionadded:: 3.5.0
    ``ServerRequest::getCookieCollection()`` was added in 3.5.0

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like :php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolidates a number of methods previously found on :php:class:`Controller`,
:php:class:`RequestHandlerComponent` and :php:class:`Dispatcher`. The old
methods are deprecated in favour of using :php:class:`Cake\\Http\\Response`.

``Response`` provides an interface to wrap the common response-related
tasks such as:

* Sending headers for redirects.
* Sending content type headers.
* Sending any header.
* Sending the response body.

Dealing with Content Types
--------------------------

.. php:method:: withType($contentType = null)

You can control the Content-Type of your application's responses with
:php:meth:`Cake\\Http\\Response::withType()`. If your application needs to deal
with content types that are not built into Response, you can map them with
``type()`` as well::

    // Add a vCard type
    $this->response->type(['vcf' => 'text/v-card']);

    // Set the response Content-Type to vcard.
    $this->response = $this->response->withType('vcf');

    // Prior to 3.4.0
    $this->response->type('vcf');

Usually, you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can leverage the
automatic view switching features of :php:class:`RequestHandlerComponent` if you
are using it.

.. _cake-response-file:

Sending Files
-------------

.. php:method:: withFile($path, $options = [])

There are times when you want to send files as responses for your requests.
You can accomplish that by using :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Return the response to prevent controller from trying to render
        // a view.
        return $response;
    }

    // Prior to 3.4.0
    $file = $this->Attachments->getFile($id);
    $this->response->file($file['path']);
    // Return the response to prevent controller from trying to render
    // a view.
    return $this->response;

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed
in `Cake\\Http\\Reponse::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Http\\Response::withFile()` by using the
:php:meth:`Cake\\Http\\Response::withType()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

    // Prior to 3.4.0
    $this->response->file(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

The supported options are:

name
    The name allows you to specify an alternate file name to be sent to
    the user.
download
    A boolean value indicating whether headers should be set to force
    download.

Sending a String as File
------------------------

You can respond with a file that does not exist on the disk, such as a pdf or an
ics generated on the fly from a string::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;
        $response->body($icsString);

        $response = $response->withType('ics');

        // Optionally force file download
        $response = $response->withDownload('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view.
        return $response;
    }

Callbacks can also return the body as a string::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Setting Headers
---------------

.. php:method:: withHeader($header, $value)

Setting headers is done with the :php:meth:`Cake\\Http\\Response::withHeader()`
method. Like all of the PSR-7 interface methods, this method returns a *new*
instance with the new header::

    // Add/replace a header
    $response = $response->withHeader('X-Extra', 'My header');

    // Set multiple headers
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Append a value to an existing header
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

    // Prior to 3.4.0 - Set a header
    $this->response->header('Location', 'http://example.com');

Headers are not sent when set. Instead, they are held until the response is
emitted by ``Cake\Http\Server``.

You can now use the convenience method
:php:meth:`Cake\\Http\\Response::withLocation()` to directly set or get the
redirect location header.

Setting the Body
----------------

.. php:method:: withStringBody($string)

To set a string as the response body, do the following::

    // Set a string into the body
    $response = $response->withStringBody('My Body');

    // If you want a json response
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. versionadded:: 3.4.3
    ``withStringBody()`` was added in 3.4.3

.. php:method:: withBody($body)

To set the response body, use the ``withBody()`` method, which is provided by the
:php:class:`Zend\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

    // Prior to 3.4.0 - Set the body
    $this->response->body('My Body');

Be sure that ``$stream`` is a :php:class:`Psr\\Http\\Message\\StreamInterface` object.
See below on how to create a new stream.

You can also stream responses from files using :php:class:`Zend\\Diactoros\\Stream` streams::

    // To stream from a file
    use Zend\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

You can also stream responses from a callback using the ``CallbackStream``. This
is useful when you have resources like images, CSV files or PDFs you need to
stream to the client::

    // Streaming from a callback
    use Cake\Http\CallbackStream;

    // Create an image.
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

    // Prior to 3.4.0 you can use the following to create streaming responses.
    $file = fopen('/some/file.png', 'r');
    $this->response->body(function () use ($file) {
        rewind($file);
        fpassthru($file);
        fclose($file);
    });

Setting the Character Set
-------------------------

.. php:method:: withCharset($charset)

Sets the charset that will be used in the response::

    $this->response = $this->response->withCharset('UTF-8');

    // Prior to 3.4.0
    $this->response->charset('UTF-8');

Interacting with Browser Caching
--------------------------------

.. php:method:: withDisabledCache()

You sometimes need to force browsers not to cache the results of a controller
action. :php:meth:`Cake\\Http\\Response::withDisabledCache()` is intended for just
that::

    public function index()
    {
        // Disable caching
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Disabling caching from SSL domains while trying to send
    files to Internet Explorer can result in errors.

.. php:method:: withCache($since, $time = '+1 day')

You can also tell clients that you want them to cache responses. By using
:php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Enable caching
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience.
The ``withCache()`` method sets the ``Last-Modified`` value to the first
argument. ``Expires`` header and the ``max-age`` directive are set based on the
second parameter. Cache-Control's ``public`` directive is set as well.

.. _cake-response-caching:

Fine Tuning HTTP Cache
----------------------

One of the best and easiest ways of speeding up your application is to use HTTP
cache. Under this caching model, you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time and response entity tag.

Rather than forcing you to code the logic for caching and for invalidating
(refreshing) it once the data has changed, HTTP uses two models, expiration and
validation, which usually are much simpler to use.

Apart from using :php:meth:`Cake\\Http\\Response::withCache()`, you can also use
many other methods to fine-tune HTTP cache headers to take advantage of browser
or reverse proxy caching.

The Cache Control Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Used under the expiration model, this header contains multiple indicators that
can change the way browsers or proxies use the cached content. A
``Cache-Control`` header can look like this::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` class helps you set this header with some utility methods that will
produce a final valid ``Cache-Control`` header. The first is the
``withSharable()`` method, which indicates whether a response is to be
considered sharable across different users or clients. This method actually
controls the ``public`` or ``private`` part of this header.  Setting a response
as private indicates that all or part of it is intended for a single user. To
take advantage of shared caches, the control directive must be set as public.

The second parameter of this method is used to specify a ``max-age`` for the
cache, which is the number of seconds after which the response is no longer
considered fresh::

    public function view()
    {
        // ...
        // Set the Cache-Control as public for 3600 seconds
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Set the Cache-Control as private for 3600 seconds
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` exposes separate methods for setting each of the directives in
the ``Cache-Control`` header.

The Expiration Header
~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

You can set the ``Expires`` header to a date and time after which the response
is no longer considered fresh. This header can be set using the
``withExpires()`` method::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

This method also accepts a :php:class:`DateTime` instance or any string that can
be parsed by the :php:class:`DateTime` class.

The Etag Header
~~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The ``withEtag()`` method (called entity tag) is a string
that uniquely identifies the requested resource, as a checksum does for a file,
in order to determine whether it matches a cached resource.

To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::

    Most proxy users should probably consider using the Last Modified Header
    instead of Etags for performance and compatibility reasons.

The Last Modified Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

Also, under the HTTP cache validation model, you can set the ``Last-Modified``
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether the
response was modified or not based on their cache.


To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

The Vary Header
~~~~~~~~~~~~~~~

.. php:method:: withVary($header)

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the ``Vary``
header::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Sending Not-Modified Responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the `304 Not Modified` header::

    // In a controller action.
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Setting Cookies
===============

Cookies can be added to response using either an array or a :php:class:`Cookie``
object::

    // Add a cookie as an array using the immutable API (3.4.0+)
    $this->response = $this->response->withCookie('remember_me', [
        'value' => 'yes',
        'path' => '/',
        'httpOnly' => true,
        'secure' => false,
        'expire' => strtotime('+1 year')
    ]);

    // Before 3.4.0
    $this->response->cookie('remember', [
        'value' => 'yes',
        'path' => '/',
        'httpOnly' => true,
        'secure' => false,
        'expire' => strtotime('+1 year')
    ]);

See the :ref:`creating-cookies` section for how to use the cookie object.


.. index:: $this->response

レスポンス
==========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` は、CakePHP のデフォルトのレスポンスクラスです。
いくつかの機能と HTTP レスポンスの生成をカプセル化します。
また送信予定のヘッダーを調べるためにモックやスタブとしてテストの手助けをします。
:php:class:`Cake\\Http\\ServerRequest` と同様に、 :php:class:`Controller`,
:php:class:`RequestHandlerComponent` 及び :php:class:`Dispatcher` に以前あった多くのメソッドを
:php:class:`Cake\\Http\\Response` が統合します。
古いメソッドは非推奨になり、 :php:class:`Cake\\Http\\Response` の使用を推奨します。

``Response`` は次のような共通のレスポンスをラップするためのインターフェイスを提供します。

* リダイレクトのヘッダーを送信。
* コンテンツタイプヘッダーの送信。
* 任意のヘッダーの送信。
* レスポンスボディーの送信。

コンテンツタイプの扱い
----------------------

.. php:method:: withType($contentType = null)

:php:meth:`Cake\\Http\\Response::withType()` を使用して、アプリケーションのレスポンスの
コンテンツタイプを制御することができます。アプリケーションが Response に組み込まれていない
コンテンツの種類に対処する必要がある場合は、以下のように ``type()`` を使って設定することができます。 ::

    // vCard タイプを追加
    $this->response->type(['vcf' => 'text/v-card']);

    // レスポンスのコンテンツタイプを vcard に設定
    $this->response = $this->response->withType('vcf');

    // 3.4.0 より前
    $this->response->type('vcf');

大抵の場合、追加のコンテンツタイプはコントローラーの :php:meth:`~Controller::beforeFilter()`
コールバックの中で設定したいと思うので、 :php:class:`RequestHandlerComponent` が提供する
ビューの自動切り替え機能を活用できます。

.. _cake-response-file:

ファイルの送信
--------------

.. php:method:: withFile($path, $options = [])

リクエストに対する応答としてファイルを送信する機会があります。
:php:meth:`Cake\\Http\\Response::withFile()` を使用してそれを達成することができます。 ::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // レスポンスオブジェクトを返すとコントローラーがビューの描画を中止します
        return $response;
    }

    // 3.4.0 より前
    $file = $this->Attachments->getFile($id);
    $this->response->file($file['path']);
    // レスポンスオブジェクトを返すとコントローラーがビューの描画を中止します
    return $this->response;

上記の例のようにメソッドにファイルのパスを渡す必要があります。CakePHP は、
`Cake\\Http\\Reponse::$_mimeTypes` に登録された、よく知られるファイルタイプであれば
正しいコンテンツタイプヘッダーを送ります。 :php:meth:`Cake\\Http\\Response::withFile()` を呼ぶ前に
:php:meth:`Cake\\Http\\Response::withType()` メソッドを使って、新しいタイプを追加できます。

もし、あなたが望むなら、 オプションを明記することによって、ブラウザー上に表示する代わりにファイルを
ダウンロードさせることができます。 ::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

    // 3.4.0 より前
    $this->response->file(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

サポートされているオプションは次のとおりです。

name
    name は、ユーザーに送信される代替ファイル名を指定することができます。
download
    ヘッダーでダウンロードを強制するように設定する必要があるかどうかを示すブール値。

文字列をファイルとして送信
--------------------------

動的に生成された pdf や ics のようにディスク上に存在しないファイルを返すことができます。 ::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;
        $response->body($icsString);

        $response = $response->withType('ics');

        // 任意のダウンロードファイル名を指定できます
        $response = $response->withDownload('filename_for_download.ics');

        // レスポンスオブジェクトを返すとコントローラーがビューの描画を中止します
        return $response;
    }

ヘッダーの設定
--------------

.. php:method:: withHeader($header, $value)

ヘッダーの設定は :php:meth:`Cake\\Http\\Response::withHeader()` メソッドで行われます。
すべての PSR-7 インターフェイスのメソッドと同様に、このメソッドは新しいヘッダーを含む
*新しい* インスタンスを返します。 ::

    // 一つのヘッダーを追加/置換
    $response = $response->withHeader('X-Extra', 'My header');

    // 一度に複数ヘッダーを設定
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // 既存のヘッダーに値を追加
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

    // 3.4.0 より前 - 一つのヘッダーを設定
    $this->response->header('Location', 'http://example.com');

セットされた際、ヘッダーは送られません。これらのヘッダーは、 ``Cake\Http\Server`` によって
レスポンスが実際に送られるまで保持されます。

便利なメソッド :php:meth:`Cake\\Http\\Response::withLocation()` を使うと
直接リダイレクトヘッダーの設定や取得ができます。

ボディーの設定
--------------

.. php:method:: withStringBody($string)

レスポンスボディーとして文字列を設定するには、次のようにします。 ::

    // ボディーの中に文字列をセット
    $response = $response->withStringBody('My Body');

    // json レスポンスにしたい場合
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. versionadded:: 3.4.3
    ``withStringBody()`` は 3.4.3 で追加されました。

.. php:method:: withBody($body)

``withBody()`` を使って、 :php:class:`Zend\\Diactoros\\MessageTrait` によって提供される
レスポンスボディーを設定するには、 ::

    $response = $response->withBody($stream);

    // 3.4.0 より前でボディーを設定
    $this->response->body('My Body');

``$stream`` が :php:class:`Psr\\Http\\Message\\StreamInterface`
オブジェクトであることを確認してください。新しいストリームを作成する方法は、以下をご覧ください。

:php:class:`Zend\\Diactoros\\Stream` ストリームを使用して、
ファイルからレスポンスをストリーム化することもできます。 ::

    // ファイルからのストリーム化
    use Zend\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

また、 ``CallbackStream`` を使用してコールバックをストリーム化できます。
クライアントへストリーム化する必要のある画像、CSV ファイル もしくは PDF
のようなリソースがある場合に便利です。 ::

    // コールバックからのストリーム化
    use Cake\Http\CallbackStream;

    // 画像の作成
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

    // 3.4.0 より前では、次のようにストリーミングレスポンスを作成することができます。
    $file = fopen('/some/file.png', 'r');
    $this->response->body(function () use ($file) {
        rewind($file);
        fpassthru($file);
        fclose($file);
    });

文字コードの設定
----------------

.. php:method:: withCharset($charset)

レスポンスの中で使われる文字コードの種類を設定します。 ::

    $this->response = $this->response->withCharset('UTF-8');

    // 3.4.0 より前
    $this->response->charset('UTF-8');

ブラウザーキャッシュとの対話
----------------------------

.. php:method:: withDisableCache()

時々、コントローラーアクションの結果をキャッシュしないようにブラウザーに強制する必要がでてきます。
:php:meth:`Cake\\Http\\Response::disableCache()` はそういった目的で使われます。 ::

    public function index()
    {
        // キャッシュの無効化
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Internet Explorer にファイルを送ろうとしている場合、SSL ドメインからの
    キャッシュを無効にすることで結果をエラーにすることができます。

.. php:method:: withCache($since, $time = '+1 day')

クライアントにレスポンスをキャッシュして欲しいことを伝えられます。
:php:meth:`Cake\\Http\\Response::withCache()` を使って::

    public function index()
    {
        // キャッシュの有効化
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

上記の例では、訪問者の体感スピード向上のため、クライアントにレスポンス結果を
5日間キャッシュするように伝えています。
``withCache()`` メソッドは、第一引数に ``Last-Modified`` ヘッダーの値を設定します。
第二引数に ``Expires`` ヘッダーと ``max-age`` ディレクティブの値を設定します。
Cache-Control の ``public`` ディレクティブも設定されます。

.. _cake-response-caching:

HTTP キャッシュのチューニング
-----------------------------

アプリケーションの速度を改善するための簡単で最善の方法の一つは HTTP キャッシュを使う事です。
このキャッシュモデルの元では、modified time, response entity tag などいくつかのヘッダーを
設定することでレスポンスのキャッシュコピーを使うべきかどうかをクライアントが決定できるように
助ける事が求められます。

キャッシュやデータが変更されたときに無効化(更新)するロジックのコードを持つのではなく、
HTTP は二つのモデル、expiration と validation を使います。これらは大抵の場合、
自身でキャッシュを管理するよりかなり単純です。

:php:meth:`Cake\\Http\\Response::withCache()` と独立して、HTTP キャッシュヘッダーを
チューニングするための様々なメソッドが使えます。この点に関して、ブラウザーやリバースプロキシーの
キャッシュよりも有利だと言えます。


Cache Control ヘッダー
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

キャッシュ制御ヘッダーは expiration モデルの元で使われ、複数の指示を含んでいます。
ブラウザーやプロキシーがどのようにキャッシュされたコンテンツを扱うのかをその指示で変更することができます。
``Cache-Control`` ヘッダーは以下の通りです。 ::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` のいくつかのユーティリティメソッドを用いることで、最終的に有効な ``Cache-Control``
ヘッダーを生成します。一つ目は、 ``withSharable()`` メソッドです。
このメソッドは異なるユーザーやクライアントの間で共有出来ることを考慮されたレスポンスかどうかを示します。
このメソッドは実際には、このヘッダーが ``public`` または ``private`` のどちらなのかを制御しています。
private としてレスポンスを設定することは、レスポンスのすべてまたはその一部が特定のユーザー用であることを
示しています。共有キャッシュのメリットを活かすためにはコントロールディレクティブを public に設定する
必要があります。

このメソッドの二番目のパラメーターはキャッシュの ``max-age`` を指定するために使われます。このパラメーターは
レスポンスが古いと見なされる秒数を表しています。 ::

    public function view()
    {
        // ...
        // Cache-Control を 3600 秒の間、public として設定
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Cache-Control を 3600 秒の間、private として設定
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` は ``Cache-Control`` ヘッダーの中で各コンポーネントを設定するための分割されたメソッドを
公開しています。

Expiration ヘッダー
~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

``Expires`` ヘッダーに、レスポンスが古いと見なされる日時を設定できます。
このヘッダーは ``withExpires()`` メソッドを使って設定されます。 ::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

またこのメソッドは、:php:class:`DateTime` インスタンスや :php:class:`DateTime` クラスによって
構文解析可能な文字列を受け付けます。

Etag ヘッダー
~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

HTTP におけるキャッシュの検証はコンテンツが定期的に変化するような場合によく使われ、
キャッシュが古いと見なせる場合にのみレスポンスコンテンツが生成されることをアプリケーションに求めます。
このモデルのもとでは、クライアントはページを直接使う代わりにキャッシュの中に保存し続け、
アプリケーションに毎回リソースが変更されたかどうかを尋ねます。
これは画像や他のアセットといった静的なリソースに対して使われる場合が多いです。

``withEtag()`` メソッド (entity tag と呼ばれる) は要求されたリソースを
識別するための一意な文字列です。大抵の場合はファイルのチェックサムのようなもので、
リソースが一致するかどうかを調べるためにキャッシュはチェックサムを比較するでしょう。

実際にこのヘッダーを使うメリットを得るためには、手動で
``checkNotModified()`` メソッドを呼び出すかコントローラーに
:doc:`/controllers/components/request-handling` を読み込まなければなりません。 ::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::

    ほとんどのプロキシーユーザーは、おそらくパフォーマンスと互換性の理由から、Etags の代わりに
    Last Modified ヘッダーの使用を検討してください。

Last Modified ヘッダー
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

HTTP キャッシュの検証モデルのもとでは、リソースが最後に変更された日時を示すために
``Last-Modified`` ヘッダーを設定することができます。このヘッダーを設定すると CakePHP が
キャッシュしているクライアントにレスポンスが変更されたのかどうかを返答する手助けとなります。

実際にこのヘッダーを使うメリットを得るためには、
``checkNotModified()`` メソッドを呼び出すかコントローラーに
:doc:`/controllers/components/request-handling` を読み込まなければなりません。 ::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

Vary ヘッダー
~~~~~~~~~~~~~

.. php:method:: withVary($header)

時には同じ URL で異なるコンテンツを提供したいと思うかもしれません。
これは多国語対応ページがある場合やブラウザーごとに異なる HTML を返すようなケースでしばしばおこります。
そのような状況では ``Vary`` ヘッダーを使えます。 ::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Not-Modified レスポンスの送信
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

リクエストオブジェクトとレスポンスのキャッシュヘッダーを比較し、まだキャッシュが有効かどうかを決定します。
もしまだ有効な場合、レスポンスのコンテンツは削除され `304 Not Modified` ヘッダーが送られます。 ::

    // コントローラーアクションの中で
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _cors-headers:

クロスオリジンリクエストヘッダー（CORS）の設定
==============================================

3.2 から、 `HTTP アクセス制御
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__ 関連の
ヘッダーを定義するために、流れるようなインターフェイスの ``cors()`` メソッドが使用できます。 ::

    $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

以下の基準が満たされた場合のみ、 CORS 関連ヘッダーはレスポンスに適用されます。

1. リクエストは ``Origin`` ヘッダーがあります。
2. リクエストの ``Origin`` 値が許可された Origin 値のいずれかと一致します。

.. versionadded:: 3.2
    ``CorsBuilder`` は 3.2 で追加されました。

不変レスポンスに伴うよくある失敗
=================================

CakePHP 3.4.0 以降、レスポンスオブジェクトはレスポンスを不変オブジェクトとして扱う
いくつかのメソッドを提供しています。不変オブジェクトは、偶発的な副作用の追跡を困難になるのを予防し、
その変更順序のリファクタリングに起因するメソッド呼び出しに起因する間違いを減らします。
それらは多くの利点を提供しますが、不変オブジェクトには慣れが必要です。
``with`` で始まるメソッドは、レスポンスに対して不変な方法で動作し、
**常に** 、 **新しい** インスタンスを返します。変更されたインスタンスを保持し忘れるのは、
不変オブジェクトを扱うときに人々が最も頻繁にする失敗です。 ::

    $this->response->withHeader('X-CakePHP', 'yes!');

上記のコードでは、レスポンスは ``X-CakePHP`` ヘッダーがありません。
``withHeader()`` メソッドの戻り値を保持していないためです。
上記のコードを修正するには、次のように記述します。 ::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

Cookie Collections
==================

.. php:class:: CookieCollection

``CookieCollection`` objects are accessible from the request and response objects.
They let you interact with groups of cookies using immutable patterns, which
allow the immutability of the request and response to be preserved.

.. _creating-cookies:

Creating Cookies
----------------

``Cookie`` objects can be defined through constructor objects, or by using the
fluent interface that follows immutable patterns::

    use Cake\Http\Cookie\Cookie;

    // All arguments in the constructor
    $cookie = new Cookie(
        'remember_me', // name
        1, // value
        new DateTime('+1 year'), // expiration time, if applicable
        '/', // path, if applicable
        'example.com', // domain, if applicable
        false, // secure only?
        true // http only ?
    );

    // Using the builder methods
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Once you have created a cookie, you can add it to a new or existing
``CookieCollection``::

    use Cake\Http\Cookie\CookieCollection;

    // Create a new collection
    $cookies = new CookieCollection([$cookie]);

    // Add to an existing collection
    $cookies = $cookies->add($cookie);

    // Remove a cookie by name
    $cookies = $cookies->remove('remember_me');

.. note::
    Remember that collections are immutable and adding cookies into, or removing
    cookies from a collection, creates a *new* collection object.

You should use the ``withCookie()`` method to add cookies to ``Response``
objects as it is simpler to use::

    $response = $this->response->withCookie($cookie);

Cookies set to responses can be encrypted using the
:ref:`encrypted-cookie-middleware`.

Reading Cookies
---------------

Once you have a ``CookieCollection`` instance, you can access the cookies it
contains::

    // Check if a cookie exists
    $cookies->has('remember_me');

    // Get the number of cookies in the collection
    count($cookies);

    // Get a cookie instance
    $cookie = $cookies->get('remember_me');

Once you have a ``Cookie`` object you can interact with it's state and modify
it. Keep in mind that cookies are immutable, so you'll need to update the
collection if you modify a cookie::

    // Get the value
    $value = $cookie->getValue()

    // Access data inside a JSON value
    $id = $cookie->read('User.id');

    // Check state
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. versionadded:: 3.5.0
    ``CookieCollection`` and ``Cookie`` were added in 3.5.0.

.. meta::
    :title lang=ja: リクエストとレスポンスオブジェクト
    :keywords lang=ja: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
