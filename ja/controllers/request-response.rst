リクエストとレスポンスオブジェクト
##################################

.. php:namespace:: Cake\Http

リクエストとレスポンスオブジェクトは、HTTP リクエストとレスポンスの周辺の抽象化を提供します。
CakePHP のリクエストオブジェクトは、入ってきたリクエストを省みることができる一方、
レスポンスオブジェクトは容易にコントローラから HTTP レスポンスを作成することができます。

.. index:: $this->request
.. _cake-request:

リクエスト
==========

.. php:class:: ServerRequest

``ServerRequest`` は、CakePHP で使用されるデフォルトのリクエストオブジェクトです。
リクエストデータへの応答と対話が中心的な機能となります。リクエストごとに Request は一つ作られ、
リクエストデータを使うアプリケーションの様々なレイヤーに参照が渡されます。
デフォルトのリクエストは ``$this->request`` に設定され、コントローラ、セル、ビュー、
ヘルパーの中で利用できます。またコントローラの参照を使うことでコンポーネントの中からも
アクセスすることが出来ます。 ``ServerRequest`` の役割は以下の通りです。

* GET, POST, そして FILES 配列を慣れ親しんだデータ構造に変換する処理を行います。
* リクエストに関連する内省的環境を提供します。送信されたヘッダやクライアントの IP アドレス、
  サーバが実行されているサブドメイン/ドメインの情報などが含まれます。
* リクエストパラメータへのアクセス方法をインデックス付き配列とオブジェクトのプロパティの
  両方の形式で提供します。

3.4.0 以降、 CakePHP のリクエストオブジェクトは、CakePHP の外部のライブラリを
使用しやすくするため `PSR-7 ServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_
を実装します。

リクエストパラメータ
--------------------

リクエストは、 ``getParam()`` メソッドを介して、ルーティングパラメータを用意しています。 ::

    $controllerName = $this->request->getParam('controller');

すべての :ref:`route-elements` は、このインタフェースを通してアクセスされます。

:ref:`route-elements` に加えて :ref:`passed-arguments` へのアクセスがしばしば必要になります。
これらは両方ともリクエストオブジェクトと同様に利用可能です。 ::

    // 渡された引数
    $passedArgs = $this->request->getParam('pass');

すべての渡された引数にアクセスする方法が提供されています。この中には CakePHP の内部で使っている
重要で役に立つパラメータが存在し、また、リクエストパラメータの中ですべて見つけられます。

* ``plugin`` リクエストを処理するプラグインです。プラグインが存在しない場合は null になります。
* ``controller`` 現在のリクエストを処理するコントローラです。
* ``action`` 現在のリクエストを処理するアクションです。
* ``prefix`` 現在のアクションのプレフィックスです。詳しくは、 :ref:`prefix-routing` をご覧ください。

クエリ文字列パラメータ
----------------------

.. php:method:: getQuery($name)

クエリ文字列パラメータは、 ``getQuery()`` メソッドを使って読み取ることができます。 ::

    // URL は /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

    // 3.4.0 より前
    $this->request->query('page');

query プロパティに直接アクセスするか、エラーが発生しない方法で URL クエリ配列を読むために
``query()`` メソッドを使用することができます。キーが存在しない場合、 ``null`` が返ります。 ::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // デフォルト値も提供できます。
    $foo = $this->request->getQuery('does_not_exist', 'default val');

``getQueryParams()`` を使用すると全てのクエリ文字列パラメータにアクセスできます。 ::

    $query = $this->request->getQueryParams();

.. versionadded:: 3.4.0
    ``getQueryParams()`` と ``getQuery()`` は 3.4.0 で追加されました。

リクエストのボディデータ
------------------------

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
よくあります。 ``application/x-www-form-urlencoded`` リクエストボディのデータは
``PUT`` と ``DELETE`` リクエストでは自動的に構文解析され ``$this->data`` に設定されます。
もし JSON や XML データを受け付けている場合、どうやってリクエストボディにアクセスすればいいのかに
ついては以下の説明を見て下さい。

入力されたデータにアクセスする場合、オプション機能でそれをデコードすることができます。
XML や JSON のリクエストボディのコンテンツと対話するときに便利です。
デコード機能のための追加のパラメータは、 ``input()`` の引数として渡すことができます。 ::

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

``json_decode`` で「結果を配列として受け取る」パラメータのように、デシリアライズメソッドの中には
呼び出し時に追加パラメータが必要なものがあります。同様に、 Xml を DOMDocument オブジェクトに
変換したい場合、 :php:meth:`~Cake\\Http\\ServerRequest::input()` は、
追加のパラメータを渡すことができます。 ::

    // PUT/POST アクションで投稿されたデータを XML エンコードで取得する
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

パス情報
--------

リクエストオブジェクトはまたアプリケーションのパスについての役立つ情報を提供しています。
``base`` や ``webroot`` 属性は URL の生成や、 アプリケーションが
サブディレクトリにいるのかどうかの決定に役立ちます。様々な属性が使用できます。 ::

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
  提供します。コールバックはパラメータとしてだけリクエストオブジェクトを受け取ります。

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
* ``is('requested')`` リクエストに、値が１のクエリパラメータ 「requested」があるかどうかを調べます。
* ``is('json')`` リクエストに 「json」 の拡張子を持ち 「application/json」
  MIME タイプを受付けるかどうかを調べます。
* ``is('xml')`` リクエストが 「xml」拡張子を持ち、「application/xml」または「text/xml」
  MIME タイプを受付けるかどうかを調べます。

.. versionadded:: 3.3.0
    3.3.0 から検出器は追加のパラメータが受け取れます。


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
-----------------------------

.. php:method:: getMethod()

リクエストの HTTP メソッドを返します。 ::

    // POST を出力
    echo $request->getMethod();

    // 3.4.0 より前
    echo $request->method();

アクションが受け入れる HTTP メソッドの制限
-----------------------------------------------

.. php:method:: allowMethod($methods)

許可された HTTP メソッドを設定します。
もしマッチしなかった場合、 ``MethodNotAllowedException`` を投げます。
405 レスポンスには、通過できるメソッドを持つ ``Allow`` ヘッダが含まれます。 ::

    public function delete()
    {
        // POST と DELETE のリクエストのみ受け入れます
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

HTTP ヘッダーの読み込み
-----------------------

リクエストで使われている ``HTTP_*`` ヘッダにアクセスできます。
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

リクエストのリファラを返します。

.. php:method:: clientIp()

現在アクセスしているクライアントの IP アドレスを返します。

プロキシヘッダの信頼
--------------------

アプリケーションがロードバランサの背後にあったり、クラウドサービス上で実行されている場合、
しばしばリクエストでロードバランサのホスト、ポートおよびスキームを取得します。
多くの場合、ロードバランサはまた、オリジナルの値として ``HTTP-X-Forwarded-*`` ヘッダーを送信します。
転送されたヘッダは、CakePHP によって使用されることはありません。リクエストオブジェクトで
これらのヘッダを使用するには、 ``trustProxy`` プロパティを ``true`` にを設定します。 ::

    $this->request->trustProxy = true;

    // これらのメソッドがプロキシのヘッダーを使用するようになります。
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Accept ヘッダの確認
-------------------

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

.. index:: $this->response

レスポンス
==========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` は、CakePHP のデフォルトのレスポンスクラスです。
いくつかの機能と HTTP レスポンスの生成をカプセル化します。
また送信予定のヘッダを調べるためにモックやスタブとしてテストの手助けをします。
:php:class:`Cake\\Http\\ServerRequest` と同様に、 :php:class:`Controller`,
:php:class:`RequestHandlerComponent` 及び :php:class:`Dispatcher` に以前あった多くのメソッドを
:php:class:`Cake\\Http\\Response` が統合します。
古いメソッドは非推奨になり、 :php:class:`Cake\\Http\\Response` の使用を推奨します。

``Response`` は次のような共通のレスポンスをラップするためのインターフェイスを提供します。

* リダイレクトのヘッダを送信。
* コンテンツタイプヘッダの送信。
* 任意のヘッダの送信。
* レスポンスボディの送信。

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

大抵の場合、追加のコンテンツタイプはコントローラの :php:meth:`~Controller::beforeFilter()`
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
        // レスポンスオブジェクトを返すとコントローラがビューの描画を中止します
        return $response;
    }

    // 3.4.0 より前
    $file = $this->Attachments->getFile($id);
    $this->response->file($file['path']);
    // レスポンスオブジェクトを返すとコントローラがビューの描画を中止します
    return $this->response;

上記の例のようにメソッドにファイルのパスを渡す必要があります。CakePHP は、
`Cake\\Http\\Reponse::$_mimeTypes` に登録された、よく知られるファイルタイプであれば
正しいコンテンツタイプヘッダを送ります。 :php:meth:`Cake\\Http\\Response::withFile()` を呼ぶ前に
:php:meth:`Cake\\Http\\Response::withType()` メソッドを使って、新しいタイプを追加できます。

もし、あなたが望むなら、 オプションを明記することによって、ブラウザ上に表示する代わりにファイルを
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

        // レスポンスオブジェクトを返すとコントローラがビューの描画を中止します
        return $response;
    }

ヘッダの設定
------------

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

セットされた際、ヘッダは送られません。これらのヘッダは、 ``Cake\Http\Server`` によって
レスポンスが実際に送られるまで保持されます。

便利なメソッド :php:meth:`Cake\\Http\\Response::withLocation()` を使うと
直接リダイレクトヘッダの設定や取得ができます。

ボディの設定
------------

.. php:method:: withStringBody($string)

レスポンスボディとして文字列を設定するには、次のようにします。 ::

    // ボディの中に文字列をセット
    $response = $response->withStringBody('My Body');

    // json レスポンスにしたい場合
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. versionadded:: 3.4.3
    ``withStringBody()`` は 3.4.3 で追加されました。

.. php:method:: withBody($body)

``withBody()`` を使って、 :php:class:`Zend\\Diactoros\\MessageTrait` によって提供される
レスポンスボディを設定するには、 ::

    $response = $response->withBody($stream);

    // 3.4.0 より前でボディを設定
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

ブラウザキャッシュとの対話
--------------------------

.. php:method:: withDisableCache()

時々、コントローラアクションの結果をキャッシュしないようにブラウザに強制する必要がでてきます。
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
``withCache()`` メソッドは、第一引数に ``Last-Modified`` ヘッダの値を設定します。
第二引数に ``Expires`` ヘッダと ``max-age`` ディレクティブの値を設定します。
Cache-Control の ``public`` ディレクティブも設定されます。

.. _cake-response-caching:

HTTP キャッシュのチューニング
-----------------------------

アプリケーションの速度を改善するための簡単で最善の方法の一つは HTTP キャッシュを使う事です。
このキャッシュモデルの元では、modified time, response entity tag などいくつかのヘッダを
設定することでレスポンスのキャッシュコピーを使うべきかどうかをクライアントが決定できるように
助ける事が求められます。

キャッシュやデータが変更されたときに無効化(更新)するロジックのコードを持つのではなく、
HTTP は二つのモデル、expiration と validation を使います。これらは大抵の場合、
自身でキャッシュを管理するよりかなり単純です。

:php:meth:`Cake\\Http\\Response::withCache()` と独立して、HTTP キャッシュヘッダを
チューニングするための様々なメソッドが使えます。この点に関して、ブラウザやリバースプロキシの
キャッシュよりも有利だと言えます。


Cache Control ヘッダ
~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

キャッシュ制御ヘッダは expiration モデルの元で使われ、複数の指示を含んでいます。
ブラウザやプロキシがどのようにキャッシュされたコンテンツを扱うのかをその指示で変更することができます。
``Cache-Control`` ヘッダは以下の通りです。 ::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` のいくつかのユーティリティメソッドを用いることで、最終的に有効な ``Cache-Control``
ヘッダを生成します。一つ目は、 ``withSharable()`` メソッドです。
このメソッドは異なるユーザやクライアントの間で共有出来ることを考慮されたレスポンスかどうかを示します。
このメソッドは実際には、このヘッダが ``public`` または ``private`` のどちらなのかを制御しています。
private としてレスポンスを設定することは、レスポンスのすべてまたはその一部が特定のユーザ用であることを
示しています。共有キャッシュのメリットを活かすためにはコントロールディレクティブを public に設定する
必要があります。

このメソッドの二番目のパラメータはキャッシュの ``max-age`` を指定するために使われます。このパラメータは
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

``Response`` は ``Cache-Control`` ヘッダの中で各コンポーネントを設定するための分割されたメソッドを
公開しています。

Expiration ヘッダ
~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

``Expires`` ヘッダに、レスポンスが古いと見なされる日時を設定できます。
このヘッダーは ``withExpires()`` メソッドを使って設定されます。 ::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

またこのメソッドは、:php:class:`DateTime` インスタンスや :php:class:`DateTime` クラスによって
構文解析可能な文字列を受け付けます。

Etag ヘッダ
~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

HTTP におけるキャッシュの検証はコンテンツが定期的に変化するような場合によく使われ、
キャッシュが古いと見なせる場合にのみレスポンスコンテンツが生成されることをアプリケーションに求めます。
このモデルのもとでは、クライアントはページを直接使う代わりにキャッシュの中に保存し続け、
アプリケーションに毎回リソースが変更されたかどうかを尋ねます。
これは画像や他のアセットといった静的なリソースに対して使われる場合が多いです。

``withEtag()`` メソッド (entity tag と呼ばれる) は要求されたリソースを
識別するための一意な文字列です。大抵の場合はファイルのチェックサムのようなもので、
リソースが一致するかどうかを調べるためにキャッシュはチェックサムを比較するでしょう。

実際にこのヘッダを使うメリットを得るためには、手動で
``checkNotModified()`` メソッドを呼び出すかコントローラに
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

    ほとんどのプロキシユーザーは、おそらくパフォーマンスと互換性の理由から、Etags の代わりに
    Last Modified ヘッダーの使用を検討してください。

Last Modified ヘッダ
~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

HTTP キャッシュの検証モデルのもとでは、リソースが最後に変更された日時を示すために
``Last-Modified`` ヘッダを設定することができます。このヘッダを設定すると CakePHP が
キャッシュしているクライアントにレスポンスが変更されたのかどうかを返答する手助けとなります。

実際にこのヘッダを使うメリットを得るためには、
``checkNotModified()`` メソッドを呼び出すかコントローラに
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

Vary ヘッダ
~~~~~~~~~~~

.. php:method:: withVary($header)

時には同じ URL で異なるコンテンツを提供したいと思うかもしれません。
これは多国語対応ページがある場合やブラウザごとに異なる HTML を返すようなケースでしばしばおこります。
そのような状況では ``Vary`` ヘッダを使えます。 ::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Not-Modified レスポンスの送信
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

リクエストオブジェクトとレスポンスのキャッシュヘッダを比較し、まだキャッシュが有効かどうかを決定します。
もしまだ有効な場合、レスポンスのコンテンツは削除され `304 Not Modified` ヘッダが送られます。 ::

    // コントローラアクションの中で
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _cors-headers:

クロスオリジンリクエストヘッダ（CORS）の設定
============================================

3.2 から、 `HTTP アクセス制御
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__ 関連の
ヘッダーを定義するために、流れるようなインターフェースの ``cors()`` メソッドが使用できます。 ::

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
========================================

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

.. meta::
    :title lang=ja: リクエストとレスポンスオブジェクト
    :keywords lang=ja: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
