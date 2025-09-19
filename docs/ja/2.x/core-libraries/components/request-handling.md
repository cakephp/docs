# リクエストハンドリング

`class` **RequestHandlerComponent**(ComponentCollection $collection, array $settings = array())

RequestHandler コンポーネントは、 HTTP リクエストについての追加情報を取得するために
使われます。クライアントが受付けるコンテンツタイプを得ることや、（設定している場合）
拡張子にあわせたレイアウトファイルに自動的に変更することだけでなく、コントローラに
AJAX についての情報を渡すことも可能です。

RequestHandler は初期状態で、多くの JavaScript ライブラリが使用している
HTTP-X-Requested-With ヘッダに基づいた AJAX リクエストを自動的に判定します。
`Router::parseExtensions()` と組み合わせて使用することで、
RequestHandler はリクエストの種類に応じて自動的にレイアウトとビューのファイルを
切り替えます。さらに、リクエストの拡張子と同じ名前のヘルパーが存在する場合、
コントローラのヘルパーの設定をする配列に加えます。また、 XML/JSON データをコントローラへ
POST した場合、自動的に解析され `$this->request->data` 配列に割り当てられ、
モデルデータとして保存可能です。 RequestHandler を利用するためには \$components 配列に
含めてください。 :

``` php
class WidgetController extends AppController {

    public $components = array('RequestHandler');

    // 以下略
}
```

## リクエスト情報の取得

RequestHandler はクライアントやリクエストについての情報を提供するいくつかのメソッドが
あります。

`method` RequestHandlerComponent::**accepts**($type = null)

リクエストの「型」を検出する他のメソッドは、次のとおりです。

`method` RequestHandlerComponent::**isXml**()

`method` RequestHandlerComponent::**isRss**()

`method` RequestHandlerComponent::**isAtom**()

`method` RequestHandlerComponent::**isMobile**()

`method` RequestHandlerComponent::**isWap**()

上記の全ての検出メソッドは、特定のコンテンツタイプを対象にしたフィルタ機能と同様の方法で使用できます。
例えば、 AJAX のリクエストに応答するときには、頻繁にデバッグレベルを変更しブラウザのキャッシュを
無効にしたいでしょう。ただし、非 AJAX リクエストのときは反対にキャッシュを許可したいと思います。
そのようなときは次のようにします。 :

``` php
if ($this->request->is('ajax')) {
    $this->disableCache();
}
// コントローラのアクションの続き
```

## クライアントについての追加情報を取得する

`method` RequestHandlerComponent::**getAjaxVersion**()

## リクエストデータの自動デコード

`method` RequestHandlerComponent::**addInputType**($type, $handler)

## リクエストへの応答

リクエストの検出に加え、RequestHandler はアプリケーションが出力やコンテンツタイプの
マッピングの変更を簡単にする機能も提供します。

`method` RequestHandlerComponent::**setContent**($name, $type = null)

`method` RequestHandlerComponent::**prefers**($type = null)

`method` RequestHandlerComponent::**renderAs**($controller, $type)

`method` RequestHandlerComponent::**respondAs**($type, $options)

`method` RequestHandlerComponent::**responseType**()

## HTTP キャッシュバリデーションの活用

::: info Added in version 2.1
:::

HTTP キャッシュバリデーションモデルは、クライアントへのレスポンスにコピーを使用するかどうかを
判断する（リバースプロキシとして知られる）キャッシュゲートウェイを使用する処理です。
このモデルでは、主に帯域幅を節約しますが、正しく使用することで応答時間の短縮や、いくつかの
CPU の処理を節約することができます。

コントローラで RequestHandler を有効化するとビューが描画される前に、自動的にチェックを行います。
このチェックでは、前回クライアントが要求してからレスポンスに変更がないかを判断するため、
レスポンスオブジェクトと元のリクエストを比較します。

レスポンスが変更無いと見なされる場合、ビューの描画処理は行われず、クライアントには何も返さず
処理時間を短縮、帯域幅を節約します。レスポンスステータスコードは <span class="title-ref">304 Not Modified</span>
にセットされます。

自動的なチェックは、 `checkHttpCache` を false にすることで行わないように
することができます。 :

``` php
public $components = array(
    'RequestHandler' => array(
        'checkHttpCache' => false
));
```

## カスタム ViewClasses の利用

::: info Added in version 2.3
:::

JsonView/XmlView を利用する場合、カスタムビュークラスでデフォルトのシリアライズ方法を上書きしたり、
独自のカスタムクラスを追加したい場合があるでしょう。

その場合、既存のタイプや新規タイプのクラスをマッピングすることができます。

`method` RequestHandlerComponent::**viewClassMap**($type, $viewClass)

`viewClassMap` を使って、自動的にセットすることも可能です。 :

``` php
public $components = array(
    'RequestHandler' => array(
        'viewClassMap' => array(
            'json' => 'ApiKit.MyJson',
            'xml' => 'ApiKit.MyXml',
            'csv' => 'ApiKit.Csv'
        )
));
```
