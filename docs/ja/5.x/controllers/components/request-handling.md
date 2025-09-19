# リクエストハンドリング

`class` **RequestHandlerComponent**(ComponentCollection $collection, array $config = [])

RequestHandler コンポーネントは、 アプリケーションに対する HTTP リクエストについての追加情報を
取得するために CakePHP で使用されています。それは、クライアントが好むコンテンツタイプが何かを知り、
自動的にリクエストの入力を解析し、コンテンツタイプをビュークラスやテンプレートのパスとマップする方法を
定義することができます。

RequestHandler は初期状態で、多くの JavaScript ライブラリーが使用している `X-Requested-With`
ヘッダーに基づいた AJAX リクエストを自動的に判定します。
`Cake\Routing\Router::extensions()` と組み合わせて使用することで、
RequestHandler は、自動的に HTML 以外のメディアタイプに対応したレイアウトとテンプレートファイルを
切り替えます。さらに、リクエストの拡張子と同じ名前のヘルパーが存在する場合、コントローラーのヘルパーの
設定をする配列に加えます。最後に、 XML/JSON データをコントローラーへ POST した場合、自動的に解析され
`$this->request->getData()` 配列に割り当てられ、モデルデータとして保存可能です。
RequestHandler を利用するためには `initialize()` メソッドに含めてください。 :

``` php
class WidgetsController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

    // 以下省略
}
```

## リクエスト情報の取得

RequestHandler はクライアントやリクエストについての情報を提供するいくつかのメソッドがあります。

`method` RequestHandlerComponent::**accepts**($type = null)

リクエスト「型」を検出する他のメソッドは、次のとおりです。

`method` RequestHandlerComponent::**isXml**()

`method` RequestHandlerComponent::**isRss**()

`method` RequestHandlerComponent::**isAtom**()

`method` RequestHandlerComponent::**isMobile**()

`method` RequestHandlerComponent::**isWap**()

上記の全ての検出メソッドは、特定のコンテンツタイプを対象にしたフィルター機能と同様の方法で使用できます。
例えば、 AJAX のリクエストに応答するときには、ブラウザーのキャッシュを無効にして、デバッグレベルを
変更したいでしょう。ただし、非 AJAX リクエストのときは反対にキャッシュを許可したいと思います。
そのようなときは次のようにします。 :

``` php
if ($this->request->is('ajax')) {
    $this->response->disableCache();
}
// コントローラーのアクションの続き
```

## リクエストデータの自動デコード

この機能はバージョン4.0において `RequestHandlerComponent` から削除されました。
代わりに [Body Parser Middleware](../../controllers/middleware#body-parser-middleware) を使用してください。

## コンテンツタイプの設定を確認

`method` RequestHandlerComponent::**prefers**($type = null)

クライアントが好むコンテンツタイプを判定します。
パラメーターを省略した場合は、最も可能性の高いコンテンツタイプが返されます。
\$type を配列で渡した場合、クライアントが受け付けるものとマッチした最初の値が返されます。
設定はまず、もし Router で解析されたファイルの拡張子により確定されます。
次に、 `HTTP_ACCEPT` にあるコンテンツタイプのリストから選ばれます。 :

``` php
$this->RequestHandler->prefers('json');
```

## リクエストへの応答

`method` RequestHandlerComponent::**renderAs**($controller, $type)

指定した型に、コントローラーの出力モードを変更します。適切なヘルパーが存在し、
それがコントローラー中のヘルパー配列で指定されていなければ、これを追加します。 :

``` php
// コントローラーに xml レスポンスの出力を強制。
$this->RequestHandler->renderAs($this, 'xml');
```

このメソッドは、現在のコンテンツタイプに一致するヘルパーを追加しようとします。
例えば、 `rss` として出力する場合、 `RssHelper` が追加されます。

`method` RequestHandlerComponent::**respondAs**($type, $options)

コンテンツタイプにマップした名前に基づき、応答するヘッダーをセットします。
このメソッドは、一度に多くのレスポンスプロパティーを設定することができます。 :

``` php
$this->RequestHandler->respondAs('xml', [
    // ダウンロードを強制
    'attachment' => true,
    'charset' => 'UTF-8'
]);
```

`method` RequestHandlerComponent::**responseType**()

現在の応答するコンテンツタイプのヘッダーをの型を返します。もしセットされていなければ null を返します。

## HTTP キャッシュバリデーションの活用

HTTP キャッシュバリデーションモデルは、クライアントへのレスポンスにコピーを使用するかどうかを
判断する（リバースプロキシーとして知られる）キャッシュゲートウェイを使用する処理です。
このモデルでは、主に帯域幅を節約しますが、正しく使用することで応答時間の短縮や、いくつかの
CPU の処理を節約することができます。

コントローラーで RequestHandlerComponent を有効化すると、ビューが描画される前に、自動的に
チェックを行います。このチェックでは、前回クライアントが要求してからレスポンスに変更がないかを
判断するため、レスポンスオブジェクトと元のリクエストを比較します。

レスポンスが変更無いと見なされる場合、ビューの描画処理は行われず、クライアントには何も返さず
処理時間を短縮、帯域幅を節約します。レスポンスステータスコードは `304 Not Modified`
にセットされます。

自動的なチェックは、 `checkHttpCache` を `false` にすることで
行わないようにすることができます。 :

``` php
public function initialize(): void
{
    parent::initialize();
    $this->loadComponent('RequestHandler', [
        'checkHttpCache' => false
    ]);
}
```

## カスタムビュークラスの利用

JsonView/XmlView を利用する場合、カスタムビュークラスでデフォルトのシリアライズ方法を上書きしたり、
独自のカスタムクラスを追加したい場合があるでしょう。

その場合、既存のタイプや新規タイプのクラスをマッピングすることができます。
また、 `viewClassMap` 設定を使用して、これを自動的に設定することができます。 :

``` php
public function initialize(): void
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
```
