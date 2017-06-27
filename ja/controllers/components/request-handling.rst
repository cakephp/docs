リクエストハンドリング
######################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $config = [])

RequestHandler コンポーネントは、 アプリケーションに対する HTTP リクエストについての追加情報を
取得するために CakePHP で使用されています。それは、クライアントが好むコンテンツタイプが何かを知り、
自動的にリクエストの入力を解析し、コンテンツタイプをビュークラスやテンプレートのパスとマップする方法を
定義することができます。

RequestHandler は初期状態で、多くの JavaScript ライブラリーが使用している ``X-Requested-With``
ヘッダーに基づいた AJAX リクエストを自動的に判定します。
:php:meth:`Cake\\Routing\\Router::extensions()` と組み合わせて使用することで、
RequestHandler は、自動的に HTML 以外のメディアタイプに対応したレイアウトとテンプレートファイルを
切り替えます。さらに、リクエストの拡張子と同じ名前のヘルパーが存在する場合、コントローラーのヘルパーの
設定をする配列に加えます。最後に、 XML/JSON データをコントローラーへ POST した場合、自動的に解析され
``$this->request->getData()`` 配列に割り当てられ、モデルデータとして保存可能です。
RequestHandler を利用するためには ``initialize()`` メソッドに含めてください。 ::

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        // 以下省略
    }

リクエスト情報の取得
====================

RequestHandler はクライアントやリクエストについての情報を提供するいくつかのメソッドがあります。

.. php:method:: accepts($type = null)

    $type は、文字列・配列・ null のいずれかです。
    文字列の場合、そのコンテンツタイプをクライアントが受付ける場合に ``true`` を返します。
    配列の場合、そのなかのひとつを受付ける場合に ``true`` を返します。
    null の場合、クライアントが受付けるコンテンツタイプをすべて配列で返します。
    例::

        class ArticlesController extends AppController
        {

            public function initialize()
            {
                parent::initialize();
                $this->loadComponent('RequestHandler');
            }

            public function beforeFilter(Event $event)
            {
                if ($this->RequestHandler->accepts('html')) {
                    // クライアントが HTML (text/html) のレスポンスを
                    // 受付ける場合のみコードが実行されます。
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // XML のみ実行するコード
                }
                if ($this->RequestHandler->accepts(['xml', 'rss', 'atom'])) {
                    // クライアントが XML か RSS か Atom のいずれかを
                    // 受け付ける場合にコードが実行されます。
                }
            }
        }

リクエスト「型」を検出する他のメソッドは、次のとおりです。

.. php:method:: isXml()

    現在のリクエストが XML のレスポンスを受付ける場合は ``true`` を返します。

.. php:method:: isRss()

    現在のリクエストが RSS のレスポンスを受付ける場合は ``true`` を返します。

.. php:method:: isAtom()

    現在の呼び出しが Atom のレスポンスを受付ける場合は ``true`` を返します。
    そうでなければ false を返します。

.. php:method:: isMobile()

    ユーザーエージェントにモバイルブラウザーの文字列を含む場合、もしくはクライアントが
    WAP コンテンツを受け入れる場合は ``true`` を返します。
    サポートされているモバイルユーザーエージェント文字列は次のとおりです。

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

    クライアントが WAP コンテンツを受付ける場合は ``true`` を返します。

上記の全ての検出メソッドは、特定のコンテンツタイプを対象にしたフィルター機能と同様の方法で使用できます。
例えば、 AJAX のリクエストに応答するときには、ブラウザーのキャッシュを無効にして、デバッグレベルを
変更したいでしょう。ただし、非 AJAX リクエストのときは反対にキャッシュを許可したいと思います。
そのようなときは次のようにします。 ::

        if ($this->request->is('ajax')) {
            $this->response->disableCache();
        }
        // コントローラーのアクションの続き

リクエストデータの自動デコード
==============================

リクエストデータのデコーダーを追加します。
ハンドラーは、コールバックとコールバックのための追加の変数を含める必要があります。
コールバックは、リクエストの入力に含まれるデータの配列を返す必要があります。
たとえば、 CSV ハンドラーを追加する場合::

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $parser = function ($data) {
                $rows = str_getcsv($data, "\n");
                foreach ($rows as &$row) {
                    $row = str_getcsv($row, ',');
                }
                return $rows;
            };
            $this->loadComponent('RequestHandler', [
                'inputTypeMap' => [
                    'csv' => [$parser]
                ]
            ]);
        }
    }

ハンドラー関数として、任意の `callable <http://php.net/callback>`_ を利用できます。
コールバックには追加の引数を渡すこともでき、これは ``json_decode`` のような
コールバックのときに便利です。 ::

    $this->RequestHandler->addInputType('json', ['json_decode', true]);

    // 3.1.0 以降では、以下を使用してください
    $this->RequestHandler->config('inputTypeMap.json', ['json_decode', true]);

上記の例は、 JSON によるデータを ``$this->request->getData()`` の配列にします。
``stdClass`` オブジェクトで取得したい場合は、引数の ``true`` なしになります。

.. deprecated:: 3.1.0
    3.1.0 から ``addInputType()`` メソッドは非推奨です。
    実行時に入力タイプを追加するには、 ``config()`` を使用してください。

コンテンツタイプの設定を確認
============================

.. php:method:: prefers($type = null)

クライアントが好むコンテンツタイプを判定します。
パラメーターを省略した場合は、最も可能性の高いコンテンツタイプが返されます。
$type を配列で渡した場合、クライアントが受け付けるものとマッチした最初の値が返されます。
設定はまず、もし Router で解析されたファイルの拡張子により確定されます。
次に、 ``HTTP\_ACCEPT`` にあるコンテンツタイプのリストから選ばれます。 ::

    $this->RequestHandler->prefers('json');

リクエストへの応答
==================

.. php:method:: renderAs($controller, $type)

指定した型に、コントローラーの出力モードを変更します。適切なヘルパーが存在し、
それがコントローラー中のヘルパー配列で指定されていなければ、これを追加します。 ::

    // コントローラーに xml レスポンスの出力を強制。
    $this->RequestHandler->renderAs($this, 'xml');

このメソッドは、現在のコンテンツタイプに一致するヘルパーを追加しようとします。
例えば、 ``rss`` として出力する場合、 ``RssHelper`` が追加されます。

.. php:method:: respondAs($type, $options)

コンテンツタイプにマップした名前に基づき、応答するヘッダーをセットします。
このメソッドは、一度に多くのレスポンスプロパティーを設定することができます。 ::

    $this->RequestHandler->respondAs('xml', [
        // ダウンロードを強制
        'attachment' => true,
        'charset' => 'UTF-8'
    ]);

.. php:method:: responseType()

現在の応答するコンテンツタイプのヘッダーをの型を返します。もしセットされていなければ null を返します。


HTTP キャッシュバリデーションの活用
===================================

HTTP キャッシュバリデーションモデルは、クライアントへのレスポンスにコピーを使用するかどうかを
判断する（リバースプロキシーとして知られる）キャッシュゲートウェイを使用する処理です。
このモデルでは、主に帯域幅を節約しますが、正しく使用することで応答時間の短縮や、いくつかの
CPU の処理を節約することができます。

コントローラーで RequestHandlerComponent を有効化すると、ビューが描画される前に、自動的に
チェックを行います。このチェックでは、前回クライアントが要求してからレスポンスに変更がないかを
判断するため、レスポンスオブジェクトと元のリクエストを比較します。

レスポンスが変更無いと見なされる場合、ビューの描画処理は行われず、クライアントには何も返さず
処理時間を短縮、帯域幅を節約します。レスポンスステータスコードは ``304 Not Modified``
にセットされます。

自動的なチェックは、 ``checkHttpCache`` を ``false`` にすることで
行わないようにすることができます。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'checkHttpCache' => false
        ]);
    }

カスタムビュークラスの利用
==========================

JsonView/XmlView を利用する場合、カスタムビュークラスでデフォルトのシリアライズ方法を上書きしたり、
独自のカスタムクラスを追加したい場合があるでしょう。

その場合、既存のタイプや新規タイプのクラスをマッピングすることができます。
また、 ``viewClassMap`` 設定を使用して、これを自動的に設定することができます。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => [
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            ]
        ]);
    }

.. deprecated:: 3.1.0
    3.1.0 から ``viewClassMap()`` メソッドは非推奨です。
    実行時に viewClassMap を変更するには、 ``config()`` を使用してください。

.. meta::
    :title lang=ja: リクエストハンドリング
    :keywords lang=ja: ハンドラーコンポーネント,javascript ライブラリー,パブリックコンポーネント,null 戻り値,モデルデータ,リクエストデータ,コンテンツタイプ,ファイル拡張子,ajax,meth,配列,結合,cakephp,insight,php
