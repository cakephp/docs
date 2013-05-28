リクエストハンドリング
######################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $settings = array())

..
  The Request Handler component is used in CakePHP to obtain
  additional information about the HTTP requests that are made to
  your applications. You can use it to inform your controllers about
  Ajax as well as gain additional insight into content types that the
  client accepts and automatically changes to the appropriate layout
  when file extensions are enabled.

リクエストハンドラコンポーネントは、 HTTP リクエストについての追加情報を取得するために使われます。
クライアントが受付けるコンテンツタイプを得ることや、（設定している場合）拡張子にあわせたレイアウトファイルに自動的に変更することだけでなく、コントローラに Ajax についての情報を渡すことも可能です。

..
  By default RequestHandler will automatically detect Ajax requests
  based on the HTTP-X-Requested-With header that many javascript
  libraries use. When used in conjunction with
  :php:meth:`Router::parseExtensions()` RequestHandler will automatically switch
  the layout and view files to those that match the requested type.
  Furthermore, if a helper with the same name as the requested
  extension exists, it will be added to the Controllers Helper array.
  Lastly, if XML/JSON data is POST'ed to your Controllers, it will be
  parsed into an array which is assigned to ``$this->request->data``,
  and can then be saved as model data. In order to make use of
  RequestHandler it must be included in your $components array::

リクエストハンドラは初期状態で、多くの JavaScript ライブラリが使用している HTTP-X-Requested-With ヘッダに基づいた Ajax リクエストを自動的に判定します。
:php:meth:`Router::parseExtensions()` と組み合わせて使用することで、リクエストハンドラはリクエストの種類に応じて自動的にレイアウトとビューのファイルを切り替えます。
さらに、リクエストの拡張子と同じ名前のヘルパーが存在する場合、コントローラのヘルパーの設定をする配列に加えます。
また、 XML/JSON データをコントローラへ POST した場合、自動的に解析され ``$this->request->data`` の配列に割り当てられ、モデルデータとして保存可能です。
リクエストハンドラを利用するためには $components の配列に含めてください。::

    class WidgetController extends AppController {

        public $components = array('RequestHandler');

        // 以下略
    }

..
  Obtaining Request Information

リクエスト情報の取得
====================

..
  Request Handler has several methods that provide information about
  the client and its request.

リクエストハンドラはクライアントやリクエストについての情報を提供するいくつかのメソッドがあります。

.. php:method:: accepts($type = null)

    ..
      $type can be a string, or an array, or null. If a string, accepts
      will return true if the client accepts the content type. If an
      array is specified, accepts return true if any one of the content
      types is accepted by the client. If null returns an array of the
      content-types that the client accepts. For example::

    $type は、文字列・配列・ null のいずれかです。
    文字列の場合、そのコンテンツタイプをクライアントが受付ける場合に true を返します。
    配列の場合、そのなかのひとつを受付ける場合に true を返します。
    null の場合、クライアントが受付けるコンテンツタイプをすべて配列で返します。
    例::

        class PostsController extends AppController {

            public $components = array('RequestHandler');

            public function beforeFilter() {
                if ($this->RequestHandler->accepts('html')) {
                    // クライアントが HTML (text/html) のレスポンスを受付ける場合のみ実行されます
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // XMLのみ実行するコード
                }
                if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                    // XML か RSS か Atom の場合に実行される
                }
            }
        }

..
  Other request 'type' detection methods include:

ほかのリクエスト「型」の検出については、次のとおりです。:

.. php:method:: isXml()

    ..
      Returns true if the current request accepts XML as a response.

    現在のリクエストが応答として XML を受け入れる場合は true を返します。

.. php:method:: isRss()

    ..
      Returns true if the current request accepts RSS as a response.

    現在のリクエストが応答として RSS を受け入れる場合は true を返します。

.. php:method:: isAtom()

    ..
      Returns true if the current call accepts an Atom response, false
      otherwise.

    現在のリクエストが応答として Atom を受け入れる場合は true を返します。
    受け入れなければ false

.. php:method:: isMobile()

    ..
      Returns true if user agent string matches a mobile web browser, or
      if the client accepts WAP content. The supported Mobile User Agent
      strings are:

    ユーザエージェントにモバイルブラウザの文字列を含む場合、もしくはクライアントが WAP コンテンツを受け入れる場合は true
    モバイルブラウザの User Agent 文字列は:

    -  Android
    -  AvantGo
    -  BlackBerry
    -  DoCoMo
    -  Fennec
    -  iPad
    -  iPhone
    -  iPod
    -  J2ME
    -  MIDP
    -  NetFront
    -  Nokia
    -  Opera Mini
    -  Opera Mobi
    -  PalmOS
    -  PalmSource
    -  portalmmm
    -  Plucker
    -  ReqwirelessWeb
    -  SonyEricsson
    -  Symbian
    -  UP.Browser
    -  webOS
    -  Windows CE
    -  Windows Phone OS
    -  Xiino

.. php:method:: isWap()

    ..
      Returns true if the client accepts WAP content.

    クライアントが WAP コンテンツを受け入れる場合は true

..
  All of the above request detection methods can be used in a similar
  fashion to filter functionality intended for specific content
  types. For example when responding to Ajax requests, you often will
  want to disable browser caching, and change the debug level.
  However, you want to allow caching for non-ajax requests. The
  following would accomplish that::

上記の全ての検出メソッドは、コンテンツタイプの特定するフィルタ機能と同様の方法で使用できます。
例えば、 Ajax のリクエストに応答するときには、頻繁にデバッグレベルを変更しブラウザのキャッシュを無効にしたいでしょう。
しかし、非 Ajax リクエストのときは反対にキャッシュを許可したいと思います。
そのようなときは次のようにします。::

        if ($this->request->is('ajax')) {
            $this->disableCache();
        }
        // コントローラのアクションの続き


..
  Obtaining Additional Client Information

クライアントについての追加情報を取得する
===========================================

.. php:method:: getAjaxVersion()

    ..
      Gets Prototype version if call is Ajax, otherwise empty string. The
      Prototype library sets a special "Prototype version" HTTP header.

    Ajax の呼び出しの場合は、 Prototype のバージョンを取得し、それ以外は空文字列になります。
    Prototype は、 "Prototype version" という特別な HTTP ヘッダをセットします。

..
  Automatically decoding request data

リクエストデータの自動デコード
===================================

.. php:method:: addInputType($type, $handler)

    ..
      :param string $type: The content type alias this attached decoder is for.
          e.g. 'json' or 'xml'
      :param array $handler: The handler information for the type.

    :param string $type: デコーダを紐づけるコンテンツタイプのエイリアス（例、 'json' 、 'xml' ）
    :param array $handler: $type のためのハンドラ

    ..
      Add a request data decoder. The handler should contain a callback, and any
      additional arguments for the callback.  The callback should return
      an array of data contained in the request input.  For example adding a CSV
      handler in your controllers' beforeFilter could look like::

    リクエストデータのデコーダを追加します。
    ハンドラはコールバックと、コールバックのための追加の変数を含めておくべきです。
    コールバックはリクエストの入力に含まれるデータの配列を返す必要があります。
    たとえば、コントローラの beforeFilter に CSV ハンドラを追加する場合::

        $parser = function ($data) {
            $rows = str_getcsv($data, "\n");
            foreach ($rows as &$row) {
                $row = str_getcsv($row, ',');
            }
            return $rows;
        };
        $this->RequestHandler->addInputType('csv', array($parser));

    ..
      The above example requires PHP 5.3, however you can use any
      `callable <http://php.net/callback>`_ for the handling function.  You can
      also pass additional arguments to the callback, this is useful for callbacks
      like ``json_decode``::

    上述の例は PHP 5.3 が必要です。
    しかしながら、ハンドラの関数としては、どの `callable <http://php.net/callback>`_ も利用できます。
    コールバックにはどのような引数を渡すこともでき、これは ``json_decode`` のようなコールバックのときに便利です::

        $this->RequestHandler->addInputType('json', array('json_decode', true));

    ..
      The above will make ``$this->request->data`` an array of the JSON input data,
      without the additional ``true`` you'd get a set of ``StdClass`` objects.

    上述の例は、 JSON によるデータを ``$this->request->data`` の配列にします。
    ``StdClass`` オブジェクトで取得したい場合は、引数の ``true`` なしになります。

..
  Responding To Requests

リクエストへの応答
======================

..
  In addition to request detection RequestHandler also provides easy
  access to altering the output and content type mappings for your
  application.

リクエストの検出に加え、リクエストハンドラはアプリケーションが出力やコンテンツタイプのマッピングの変更を簡単にする機能も提供します。

.. php:method:: setContent($name, $type = null)

    ..
      -  $name string - The name or file extension of the Content-type
         ie. html, css, json, xml.
      -  $type mixed - The mime-type(s) that the Content-type maps to.

    -  $name string - Content-type の名前かファイルの拡張子（例、 html, css, json, xml ）
    -  $type mixed - Content-type に紐づけられる mime-type

    ..
      setContent adds/sets the Content-types for the given name. Allows
      content-types to be mapped to friendly aliases and or extensions.
      This allows RequestHandler to automatically respond to requests of
      each type in its startup method. If you are using
      Router::parseExtension, you should use the file extension as the
      name of the Content-type. Furthermore, these content types are used
      by prefers() and accepts().

    setContent は、 $name の Content-type を追加（設定）します。
    コンテンツタイプには、分かりやすいエイリアスや拡張子を割り当てることができます。
    これにより、リクエストハンドラはスタートアップメソッドの中で、自動的にリクエストの型に応じたレスポンスを判別します。
    Router::parseExtension を使用する場合、コンテンツタイプの名前として拡張子を使うようにするべきです。
    さらにそれらのコンテンツタイプは、 prefers() と accepts() で使われます。

    ..
      setContent is best used in the beforeFilter() of your controllers,
      as this will best leverage the automagicness of content-type
      aliases.

    コンテンツタイプの別名に対する自動的な動作の変更を効果的に行えるよう、setContent は、コントローラの beforeFilter() 内で使用されるのが最適です。

    ..
      The default mappings are:

    デフォルトのマッピング:

    -  **javascript** text/javascript
    -  **js** text/javascript
    -  **json** application/json
    -  **css** text/css
    -  **html** text/html, \*/\*
    -  **text** text/plain
    -  **txt** text/plain
    -  **csv** application/vnd.ms-excel, text/plain
    -  **form** application/x-www-form-urlencoded
    -  **file** multipart/form-data
    -  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
    -  **xhtml-mobile** application/vnd.wap.xhtml+xml
    -  **xml** application/xml, text/xml
    -  **rss** application/rss+xml
    -  **atom** application/atom+xml
    -  **amf** application/x-amf
    -  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript,
       image/vnd.wap.wbmp
    -  **wml** text/vnd.wap.wml
    -  **wmlscript** text/vnd.wap.wmlscript
    -  **wbmp** image/vnd.wap.wbmp
    -  **pdf** application/pdf
    -  **zip** application/x-zip
    -  **tar** application/x-tar

.. php:method:: prefers($type = null)

    ..
      Determines which content-types the client prefers. If no parameter
      is given the most likely content type is returned. If $type is an
      array the first type the client accepts will be returned.
      Preference is determined primarily by the file extension parsed by
      Router if one has been provided, and secondly by the list of
      content-types in HTTP\_ACCEPT.

    クライアントが好むコンテンツタイプを確定します。
    もしパラメータをセットしなければ、最も優先度の高いコンテンツタイプが返されます。
    $type を配列で渡した場合、クライアントが受け付けるものとマッチした最初の値が返されます。
    優先度はまず、もし Router で解析されたファイルの拡張子により確定されます。
    次に、 HTTP\_ACCEPT にあるコンテンツタイプのリストから選ばれます。

.. php:method:: renderAs($controller, $type)

    ..
      :param Controller $controller: Controller Reference
      :param string $type: friendly content type name to render content for ex.
         xml, rss.

    :param Controller $controller: コントローラの参照
    :param string $type: コンテンツを描画する、使いやすいコンテンツタイプの名前。例えば xml や rss 。

    ..
      Change the render mode of a controller to the specified type. Will
      also append the appropriate helper to the controller's helper array
      if available and not already in the array.

    任意の型でコントローラの出力のモードを変更します。
    また、適切なヘルパーが存在し、それがコントローラ中のヘルパー配列で指定されていなければ、これを追加します。

.. php:method:: respondAs($type, $options)

    ..
      :param string $type: Friendly content type name ex. xml, rss or a full
         content type like application/x-shockwave
      :param array $options: If $type is a friendly type name that has more than
         one content association, $index is used to select the content
         type.

    :param string $type: xml や rss といったコンテンツタイプの名前か、 application/x-shockwave といった完全な名前
    :param array $options: 指定したコンテンツタイプが複数のコンテンツに関連付いている場合、どれを使うかを $index で指定します。

    ..
      Sets the response header based on content-type map names.

    コンテンツタイプにマップした名前に基づき、応答するヘッダをセットします。

.. php:method:: responseType()

    ..
      Returns the current response type Content-type header or null if
      one has yet to be set.

    現在の応答するコンテンツタイプのヘッダをの型を返します。もしセットされていなければ null を返します。

..
  Taking advantage of HTTP cache validation

HTTP キャッシュバリデーションの活用
=========================================

.. versionadded:: 2.1

..
  The HTTP cache validation model is one of the processes used for cache
  gateways, also known as reverse proxies, to determine if they can serve a
  stored copy of a response to the client. Under this model, you mostly save
  bandwidth, but when used correctly you can also save some CPU processing,
  reducing this way response times.

HTTP キャッシュバリデーションモデルは、クライアントへのレスポンスにコピーを使用するかどうかを判断する（リバースプロキシとして知られる）キャッシュゲートウェイを使用する処理です。
このモデルでは、主に帯域幅を節約しますが、正しく使用することで応答時間の短縮や、いくつかのCPUの処理を節約することができます。

..
  Enabling the RequestHandlerComponent in your controller automatically activates
  a check done before rendering the view. This check compares the response object
  against the original request to determine whether the response was not modified
  since the last time the client asked for it.

コントローラでリクエストハンドラを有効化するとビューが描画される前に、自動的にチェックを行います。
このチェックでは、前回クライアントが要求してからレスポンスに変更がないかを判断するため、レスポンスオブジェクトと元のリクエストを比較します。

..
  If response is evaluated as not modified, then the view rendering process is
  stopped, saving processing time an  no content is returned to the client, saving
  bandwidth. The response status code is then set to `304 Not Modified`.

レスポンスが変更無いと見なされる場合、ビューの描画処理は行われず、クライアントには何も返さず処理時間を短縮、帯域幅を節約します。
レスポンスステータスコードは `304 Not Modified` にセットされます。

..
  You can opt-out this automatic checking by setting the ``checkHttpCache``
  setting to false::

自動的なチェックは、 ``checkHttpCache`` を false にすることで行わないようにすることができます。::

    public $components = array(
        'RequestHandler' => array(
            'checkHttpCache' => false
    ));

カスタム ViewClasses の利用
=============================

.. versionadded:: 2.3

..
    When using JsonView/XmlView you might want to override the default serialization
    with a custom View class, or add View classes for other types.

    You can map existing and new types to your custom classes.

JsonView/XmlView を利用する場合、カスタムビュークラスの優先順位をデフォルトの順番から上書きしたり、独自のカスタムクラスを追加したい場合があるでしょう。

その場合、既存のタイプや新規タイプのクラスをマッピングすることができます。


.. php:method:: viewClassMap($type, $viewClass)

    :param string|array $type: タイプ名の文字列または配列 ``array('json' => 'MyJson')`` のフォーマット
    :param string $viewClass: ``View`` を取り除いたビュークラス名

``viewClassMap`` を使って、自動的にセットすることも可能です。 ::

    public $components = array(
        'RequestHandler' => array(
            'viewClassMap' => array(
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            )
    ));
