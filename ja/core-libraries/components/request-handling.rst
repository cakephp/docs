リクエストハンドリング
######################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $settings = array())

RequestHandler コンポーネントは、 HTTP リクエストについての追加情報を取得するために
使われます。クライアントが受付けるコンテンツタイプを得ることや、（設定している場合）
拡張子にあわせたレイアウトファイルに自動的に変更することだけでなく、コントローラに
AJAX についての情報を渡すことも可能です。

RequestHandler は初期状態で、多くの JavaScript ライブラリが使用している
HTTP-X-Requested-With ヘッダに基づいた AJAX リクエストを自動的に判定します。
:php:meth:`Router::parseExtensions()` と組み合わせて使用することで、
RequestHandler はリクエストの種類に応じて自動的にレイアウトとビューのファイルを
切り替えます。さらに、リクエストの拡張子と同じ名前のヘルパーが存在する場合、
コントローラのヘルパーの設定をする配列に加えます。また、 XML/JSON データをコントローラへ
POST した場合、自動的に解析され ``$this->request->data`` 配列に割り当てられ、
モデルデータとして保存可能です。 RequestHandler を利用するためには $components 配列に
含めてください。 ::

    class WidgetController extends AppController {

        public $components = array('RequestHandler');

        // 以下略
    }

リクエスト情報の取得
====================

RequestHandler はクライアントやリクエストについての情報を提供するいくつかのメソッドが
あります。

.. php:method:: accepts($type = null)

    $type は、文字列・配列・ null のいずれかです。
    文字列の場合、そのコンテンツタイプをクライアントが受付ける場合に true を返します。
    配列の場合、そのなかのひとつを受付ける場合に true を返します。
    null の場合、クライアントが受付けるコンテンツタイプをすべて配列で返します。
    例::

        class PostsController extends AppController {

            public $components = array('RequestHandler');

            public function beforeFilter() {
                if ($this->RequestHandler->accepts('html')) {
                    // クライアントが HTML (text/html) のレスポンスを
                    // 受付ける場合のみコードが実行されます。
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // XML のみ実行するコード
                }
                if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                    // クライアントが XML か RSS か Atom のいずれかを
		    // 受付ける場合にコードが実行されます。
                }
            }
        }

リクエストの「型」を検出する他のメソッドは、次のとおりです。

.. php:method:: isXml()

    現在のリクエストが XML のレスポンスを受付ける場合は true を返します。

.. php:method:: isRss()

    現在のリクエストが RSS のレスポンスを受付ける場合は true を返します。

.. php:method:: isAtom()

    現在のリクエストが Atom のレスポンスを受付ける場合は true を返します。
    受け入れなければ false

.. php:method:: isMobile()

    ユーザーエージェントにモバイルブラウザの文字列を含む場合、もしくはクライアントが
    WAP コンテンツを受付ける場合は true を返します。
    サポートされているモバイルブラウザのユーザーエージェント文字列は次の通りです。

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

    クライアントが WAP コンテンツを受付ける場合は true を返します。

上記の全ての検出メソッドは、特定のコンテンツタイプを対象にしたフィルタ機能と同様の方法で使用できます。
例えば、 AJAX のリクエストに応答するときには、頻繁にデバッグレベルを変更しブラウザのキャッシュを
無効にしたいでしょう。ただし、非 AJAX リクエストのときは反対にキャッシュを許可したいと思います。
そのようなときは次のようにします。 ::

        if ($this->request->is('ajax')) {
            $this->disableCache();
        }
        // コントローラのアクションの続き


クライアントについての追加情報を取得する
========================================

.. php:method:: getAjaxVersion()

    AJAX の呼び出しの場合は、 Prototype のバージョンを取得し、それ以外は空文字列になります。
    Prototype は、 "Prototype version" という特別な HTTP ヘッダをセットします。

リクエストデータの自動デコード
==============================

.. php:method:: addInputType($type, $handler)

    :param string $type: デコーダを紐づけるコンテンツタイプのエイリアス
       （例、 'json' 、 'xml' ）
    :param array $handler: $type のためのハンドラ

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

    上記の例は PHP 5.3 が必要です。しかしながら、ハンドラの関数としては、どの
    `callable <http://php.net/callback>`_ も利用できます。コールバックには追加の
    引数を渡すこともでき、これは ``json_decode`` のようなコールバックのときに便利です。 ::

        $this->RequestHandler->addInputType('json', array('json_decode', true));

    上記の例は、 JSON によるデータを ``$this->request->data`` の配列にします。
    ``stdClass`` オブジェクトで取得したい場合は、引数の ``true`` なしになります。

リクエストへの応答
==================

リクエストの検出に加え、RequestHandler はアプリケーションが出力やコンテンツタイプの
マッピングの変更を簡単にする機能も提供します。

.. php:method:: setContent($name, $type = null)

    :param string  $name: Content-type の名前かファイルの拡張子
       （例、 html, css, json, xml ）
    :param mixed $type: Content-type に紐づけられる mime-type

    setContent は、 $name の Content-type を追加（設定）します。
    コンテンツタイプには、分かりやすいエイリアスや拡張子を割り当てることができます。
    これにより、リクエストハンドラはスタートアップメソッドの中で、自動的にリクエストの
    型に応じたレスポンスを判別します。 Router::parseExtension を使用する場合、
    コンテンツタイプの名前として拡張子を使うようにするべきです。
    さらにそれらのコンテンツタイプは、 prefers() と accepts() で使われます。

    コンテンツタイプの別名に対する自動的な動作の変更を効果的に行えるよう、
    setContent は、コントローラの beforeFilter() 内で使用されるのが最適です。

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

    クライアントが好むコンテンツタイプを確定します。パラメータを省略した場合は、
    最も可能性の高いコンテンツタイプが返されます。$type を配列で渡した場合、
    クライアントが受け付けるものとマッチした最初の値が返されます。
    優先度はまず、もし Router で解析されたファイルの拡張子により確定されます。
    次に、 HTTP\_ACCEPT にあるコンテンツタイプのリストから選ばれます。

.. php:method:: renderAs($controller, $type)

    :param Controller $controller: コントローラの参照
    :param string $type: コンテンツを描画する、使いやすいコンテンツタイプの名前。例えば
       xml や rss 。

    指定した型に、コントローラの出力モードを変更します。また、適切なヘルパーが存在し、
    それがコントローラ中のヘルパー配列で指定されていなければ、これを追加します。

.. php:method:: respondAs($type, $options)

    :param string $type: xml や rss といったコンテンツタイプの名前か、
       application/x-shockwave といった完全な名前
    :param array $options: 指定したコンテンツタイプが複数のコンテンツに関連付いている場合、
       どれを使うかを $index で指定します。

    コンテンツタイプにマップした名前に基づき、応答するヘッダをセットします。

.. php:method:: responseType()

    現在の応答するコンテンツタイプのヘッダをの型を返します。もしセットされていなければ
    null を返します。

HTTP キャッシュバリデーションの活用
===================================

.. versionadded:: 2.1

HTTP キャッシュバリデーションモデルは、クライアントへのレスポンスにコピーを使用するかどうかを
判断する（リバースプロキシとして知られる）キャッシュゲートウェイを使用する処理です。
このモデルでは、主に帯域幅を節約しますが、正しく使用することで応答時間の短縮や、いくつかの
CPU の処理を節約することができます。

コントローラで RequestHandler を有効化するとビューが描画される前に、自動的にチェックを行います。
このチェックでは、前回クライアントが要求してからレスポンスに変更がないかを判断するため、
レスポンスオブジェクトと元のリクエストを比較します。

レスポンスが変更無いと見なされる場合、ビューの描画処理は行われず、クライアントには何も返さず
処理時間を短縮、帯域幅を節約します。レスポンスステータスコードは `304 Not Modified`
にセットされます。

自動的なチェックは、 ``checkHttpCache`` を false にすることで行わないように
することができます。 ::

    public $components = array(
        'RequestHandler' => array(
            'checkHttpCache' => false
    ));

カスタム ViewClasses の利用
===========================

.. versionadded:: 2.3

JsonView/XmlView を利用する場合、カスタムビュークラスでデフォルトのシリアライズ方法を上書きしたり、
独自のカスタムクラスを追加したい場合があるでしょう。

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


.. meta::
    :title lang=ja: リクエストハンドリング
    :keywords lang=ja: ハンドラコンポーネント,javascript ライブラリ,パブリックコンポーネント,null 戻り値,モデルデータ,リクエストデータ,コンテンツタイプ,ファイル拡張子,ajax,meth,配列,結合,cakephp,insight,php
