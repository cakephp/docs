# リクエストとレスポンスオブジェクト

CakePHP 2.0 では新しくリクエストとレスポンスのオブジェクトが追加されました。
以前のバージョンではこれらのオブジェクトは配列で表現されており、
また関連するメソッドは `RequestHandlerComponent`, `Router`,
`Dispatcher`, `Controller` に分散していました。そのため、
リクエストにどのような情報が含まれているかを正確に表すオブジェクトは存在しませんでした。
バージョン 2.0 において `CakeRequest` と `CakeResponse` は
上記の目的で使用されます。

<div class="index">

\$this-\>request

</div>

<a id="cake-request"></a>

# CakeRequest

`CakeRequest` は CakePHP で使われるデフォルトのリクエストオブジェクトです。
リクエストデータへの応答と対話が中心的な機能となります。リクエストごとに `CakeRequest`
は一つ作られ、リクエストデータを使うアプリケーションの様々なレイヤーに参照が渡されます。
デフォルトの `CakeRequest` は `$this->request` に設定され、コントローラ、ビュー、
ヘルパーの中で利用できます。またコントローラの参照を使うことでコンポーネントの中からも
アクセスすることが出来ます。 `CakeRequest` の役割は以下の通りです。

- GET, POST, そして FILES 配列を慣れ親しんだデータ構造に変換する処理を行います。
- リクエストに関連する内省的環境を提供します。送信されたヘッダやクライアントの IP アドレス、
  サーバが実行されているサブドメイン/ドメインの情報などが含まれます。
- リクエストパラメータへのアクセス方法をインデックス付き配列とオブジェクトのプロパティの
  両方の形式で提供します。

## リクエストパラメータへのアクセス

`CakeRequest` はリクエストパラメータにアクセスするためにいくつかのインターフェイスを
提供しています。一つ目の方法は、添字付き配列です。二つ目の方法は `$this->request->params`
を経由する方法です。三つ目はオブジェクトのプロパティとしてアクセスする方法です。 :

``` php
$this->request->controller;
$this->request['controller'];
$this->request->params['controller'];
```

上記はすべて同じ値にアクセスします。パラメータへアクセスする方法が複数あることで
既存のアプリケーションの移植が楽になるかもしれません。
すべての [Route Elements](../development/routing#route-elements) はこのインターフェイスを通してアクセスされます。

[Route Elements](../development/routing#route-elements) に加えて [Passed Arguments](../development/routing#passed-arguments) や [Named Parameters](../development/routing#named-parameters)
へのアクセスがしばしば必要になります。これらは両方ともリクエストオブジェクトと同様に利用可能です。 :

``` php
// 渡された引数
$this->request->pass;
$this->request['pass'];
$this->request->params['pass'];

// 名前付きパラメータ
$this->request->named;
$this->request['named'];
$this->request->params['named'];
```

すべての渡された引数と名前付きパラメータにアクセスする方法が提供されています。この中には
CakePHP の内部で使っている重要で役に立つパラメータが存在し、また、リクエストパラメータの中で
すべて見つけられます。

- `plugin` リクエストを処理するプラグインです。プラグインが存在しない場合は null です。
- `controller` 現在のリクエストを処理するコントローラです。
- `action` 現在のリクエストを処理するアクションです。
- `prefix` 現在のアクションのプレフィックスです。詳しくは、 [Prefix Routing](../development/routing#prefix-routing) をご覧ください。
- `bare` リクエストが `~Controller::requestAction()` から始まり
  bare オプションを含んでいたとき定義されます。生のリクエストは描画されたレイアウトを持ちません。
- `requested` アクションが `~Controller::requestAction()` から始まったとき定義され
  true が設定されます。

## クエリ文字列パラメータにアクセス

クエリ文字列パラメータは `CakeRequest::$query` を使って読み出すことができます。 :

``` php
// url は /posts/index?page=1&sort=title
$this->request->query['page'];

// 配列を経由してアクセスできます
// Note: 後方互換アクセッサです。将来のバージョンで非推奨になります。
$this->request['url']['page'];
```

`~CakeRequest::$query` プロパティに直接アクセスするか、エラーが発生しない方法で
URL クエリ配列を読むために `CakeRequest::query()` を使うことができます。
キーが存在しない場合、 `null` が返ります。 :

``` php
$foo = $this->request->query('value_that_does_not_exist');
// $foo === null
```

## POST データにアクセス

すべての POST データは `CakeRequest::$data` を使ってアクセスされます。
フォームデータが `data` 接頭辞を含んでいる場合、接頭辞は取り除かれるでしょう。例えば:

``` php
// name 属性が 'data[Post][title]' だった入力は次のようにアクセスします。
$this->request->data['Post']['title'];
```

`~CakeRequest::$data` プロパティに直接アクセスするか、エラーが発生しない方法で
data 配列を読むために `CakeRequest::data()` を使うことができます。
キーが存在しない場合、 `null` が返ります。 :

``` php
$foo = $this->request->data('Value.that.does.not.exist');
// $foo == null
```

## PUT または POST データにアクセス

::: info Added in version 2.2
:::

REST サービスを構築しているとき `PUT` と `DELETE` リクエストのデータを受け付けることが
よくあります。2.2 において `application/x-www-form-urlencoded` リクエストボディのデータは
`PUT` と `DELETE` リクエストでは自動的に構文解析され `$this->data` に設定されます。
もし JSON や XML データを受け付けている場合、どうやってリクエストボディにアクセスすればいいのかに
ついては以下の説明を見て下さい。

## XML または JSON データにアクセス

[REST](../development/rest) を採用しているアプリケーションでは URL エンコードされていない
post 形式でデータを交換することがしばしばあります。 `CakeRequest::input()`
を使用すると、任意の形式の入力データを読み込むことができます。
デコード関数が提供されることでデシリアライズされたコンテンツを受け取ることができます。 :

``` php
// PUT/POST アクションで投稿されたデータを JSON 形式にエンコードで取得する
$data = $this->request->input('json_decode');
```

`json_decode` の 'as array' パラメータや XML を DOMDocument オブジェクトに変換したい時のように、
デシリアライズメソッドの中には呼び出し時に追加パラメータが必要なものがあるので
`CakeRequest::input()` は追加パラメータを渡せるようになっています。 :

``` php
// PUT/POST アクションで投稿されたデータを Xml エンコードで取得する
$data = $this->request->input('Xml::build', array('return' => 'domdocument'));
```

## パス情報にアクセス

`CakeRequest` はまたアプリケーションのパスについての役立つ情報を提供しています。
`CakeRequest::$base` と `CakeRequest::$webroot` は URL の生成や、
アプリケーションがサブディレクトリにいるのかどうかの決定に役立ちます。

## リクエストを調べる

さまざまなリクエストの状態を検出するために以前は `RequestHandlerComponent` を
使う必要がありました。これらのメソッドは `CakeRequest` に移動され後方互換を保ちつつ
新しいインターフェイスが提供されています。使い方は以下の通りです。 :

``` php
$this->request->is('post');
$this->request->isPost(); // 非推奨
```

どちらのメソッド呼び出しも同じ値を返します。 今のところ、`RequestHandlerComponent` にて、
後方互換のためのメソッドが利用できますが、非推奨で 3.0.0 で削除されます。
また、新しい種類の検出器 (detector) を作成するために `CakeRequest::addDetector()` を
使うことでリクエスト検出器を簡単に拡張することができます。4種類の異なる検出器を作成できます。

- 環境変数の比較 - 環境変数の比較、 `env()` から取得された値と提供された値が
  等しいかどうかを比較します。
- パターン値の比較 - パターン値の比較では `env()` から取得された値と正規表現を比較します。
- オプションベースの比較 - オプションベースの比較では正規表現を作成するためにオプションのリストを使います。
  既に定義済みのオプション検出器を追加するための呼び出しはオプションをマージするでしょう。
- コールバック検出器 - コールバック検出器はチェックをハンドリングするために 'callback' タイプを提供します。
  コールバックはパラメータとしてだけリクエストオブジェクトを受け取ります。

いくつかの例を示します。 :

``` php
// environment detector を追加する
$this->request->addDetector(
    'post',
    array('env' => 'REQUEST_METHOD', 'value' => 'POST')
);

// pattern value detector を追加する
$this->request->addDetector(
    'iphone',
    array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i')
);

// option detector を追加する
$this->request->addDetector('internalIp', array(
    'env' => 'CLIENT_IP',
    'options' => array('192.168.0.101', '192.168.0.100')
));

// callback detector を追加する。匿名関数か通常のコールバックが指定可能。
$this->request->addDetector(
    'awesome',
    array('callback' => function ($request) {
        return isset($request->awesome);
    })
);
```

`CakeRequest` には `CakeRequest::domain()`,
`CakeRequest::subdomains()` や `CakeRequest::host()` といった
サブドメインを扱うのに役立つメソッドがあるため、少し楽ができます。

利用可能な組み込みの検出器は以下の通りです。

- `is('get')` 現在のリクエストが GET かどうかを調べます。
- `is('put')` 現在のリクエストが PUT かどうかを調べます。
- `is('post')` 現在のリクエストが POST かどうかを調べます。
- `is('delete')` 現在のリクエストが DELETE かどうかを調べます。
- `is('head')` 現在のリクエストが HEAD かどうかを調べます。
- `is('options')` 現在のリクエストが OPTIONS かどうかを調べます。
- `is('ajax')` 現在のリクエストが X-Requested-With = XMLHttpRequest に由来するものか
  どうかを調べます。
- `is('ssl')` リクエストが SSL 経由かどうかを調べます。
- `is('flash')` リクエストに Flash の User-Agent があるかどうかを調べます。
- `is('mobile')` リクエストがモバイルエージェントの共通リストに由来しているかどうかを調べます。

## CakeRequest と RequestHandlerComponent

`CakeRequest` が提供している多くの機能は以前、 `RequestHandlerComponent`
の中にあったので、CakePHP 2.0 にどのように収まるのかを理解するために再考する必要がありました。
2.0 において `RequestHandlerComponent` はパトロン (sugar daddy) として振るいます。
`CakeRequest` が提供するユーティリティの最上位に砂糖のレイヤーを提供しています。
レイアウトの切り替えやコンテンツタイプや ajax を基にしたビューといった砂糖は
`RequestHandlerComponent` の領域です。ユーティリティと砂糖のクラスを分離することで
欲しいもの、必要なものの取捨選択が簡単になるでしょう。

## リクエストの他要素と対話する

`CakeRequest` はリクエストに関する様々なことを内省 (introspect) するために使えます。
また、検出器によって様々なプロパティやメソッドからの他の情報を発見できます。

- `$this->request->webroot` は webroot ディレクトリを含みます。
- `$this->request->base` は基本パスを含みます。
- `$this->request->here` は現在のリクエストへの完全なアドレスを含みます。
- `$this->request->query` はクエリ文字列パラメータを含みます。

## CakeRequest API

`class` **CakeRequest**

`method` CakeRequest::**domain**($tldLength = 1)

`method` CakeRequest::**subdomains**($tldLength = 1)

`method` CakeRequest::**host**()

`method` CakeRequest::**method**()

`method` CakeRequest::**onlyAllow**($methods)

`method` CakeRequest::**allowMethod**($methods)

`method` CakeRequest::**referer**($local = false)

`method` CakeRequest::**clientIp**($safe = true)

`method` CakeRequest::**header**($name)

`method` CakeRequest::**input**($callback, [$options])

`method` CakeRequest::**data**($key)

`method` CakeRequest::**is**($check)

`method` CakeRequest::**addDetector**($name, $callback)

`method` CakeRequest::**accepts**($type = null)

`static` CakeRequest::**acceptLanguage**($language = null)

クライアントが受付けるすべての言語を取得します。また、
特定の言語が受付られるかどうかを調べます。

受付ける言語のリストを取得:

``` css
CakeRequest::acceptLanguage();
```

特定の言語が受付られるかどうかの確認:

``` css
CakeRequest::acceptLanguage('es-es');
```

`method` CakeRequest::**param**($name)

<div class="index">

\$this-\>response

</div>

# CakeResponse

`CakeResponse` は CakePHP のデフォルトのレスポンスクラスです。
いくつかの機能と HTTP レスポンスの生成をカプセル化します。
また送信予定のヘッダを調べるためにモックやスタブとしてテストの手助けをします。
`CakeRequest` のように `CakeResponse` は `Controller` や
`RequestHandlerComponent` や `Dispatcher` に以前からある
多くのメソッドを強化します。古いメソッドは非推奨になり `CakeResponse` の使用が推奨されます。

`CakeResponse` は次のような共通のレスポンスをラップするためのインターフェイスを提供します。

- リダイレクトのヘッダの送信。
- コンテンツタイプヘッダの送信。
- 任意のヘッダの送信。
- レスポンスボディの送信。

## レスポンスクラスの変更

CakePHP はデフォルトで `CakeResponse` を使います。
`CakeResponse` は柔軟かつ透過的なクラスです。
もし、このクラスをアプリケーション固有のクラスに置き換える必要がある場合、
`app/webroot/index.php` の中で `CakeResponse` を置き換えることができます。
これにより、アプリケーションのすべてのコントローラが `CakeResponse` の代わりに
`CustomResponse` を使うようになります。またコントローラの中で `$this->response`
を設定することでレスポンスインスタンスを置き換えることができます。
レスポンスオブジェクトのオーバーライドは `~CakeResponse::header()`
とやりとりするメソッドをスタブ化しやすくするので、テストで使いやすいです。
詳しくは [Cakeresponse Testing](#cakeresponse-testing) を参照して下さい。

## コンテンツタイプの扱い

`CakeResponse::type()` を使うことでアプリケーションレスポンスの
コンテンツタイプを制御することができます。もし `CakeResponse` に組み込まれていない
コンテンツタイプを扱う必要がある場合、以下のように `CakeResponse::type()` を使って
設定することができます。 :

``` php
// vCard タイプを追加
$this->response->type(array('vcf' => 'text/v-card'));

// レスポンスのコンテンツタイプを vcard に設定
$this->response->type('vcf');
```

大抵の場合、追加のコンテンツタイプはコントローラの `~Controller::beforeFilter()`
コールバックの中で設定したいと思うので、
`RequestHandlerComponent` が提供するビューの自動切り替え機能を活用できます。

## ファイルの送信

リクエストに対するレスポンスとしてファイルを送りたいときがあります。
バージョン 2.3 より前は、 `MediaView` を使うことができました。
2.3 以降から `MediaView` は非推奨になり `CakeResponse::file()` を使って
ファイルを送信します。 :

``` php
public function sendFile($id) {
    $file = $this->Attachment->getFile($id);
    this->response->file($file['path']);
    // レスポンスオブジェクトを返すとコントローラがビューの描画を中止します
    return $this->response;
}
```

上記の例のようにメソッドにファイルのパスを渡す必要があります。
CakePHP は、`CakeResponse::$_mimeTypes` に登録された、よく知られるファイルタイプであれば
正しいコンテンツタイプヘッダを送ります。 `CakeResponse::file()` を呼ぶ前に
`CakeResponse::type()` メソッドを使って、新しいタイプを追加できます。

もし、あなたが望むなら、 オプションを明記することによって、ブラウザ上に表示する代わりに
ファイルをダウンロードさせることができます。 :

``` php
$this->response->file(
    $file['path'],
    array('download' => true, 'name' => 'foo')
);
```

## 文字列をファイルとして送信

動的に生成された pdf や ics のようにディスクに存在しないファイルを返すことができます。 :

``` php
public function sendIcs() {
    $icsString = $this->Calendar->generateIcs();
    $this->response->body($icsString);
    $this->response->type('ics');

    // 任意のダウンロードファイル名を指定できます
    $this->response->download('filename_for_download.ics');

    // レスポンスオブジェクトを返すとコントローラがビューの描画を中止します
    return $this->response;
}
```

## ヘッダの設定

ヘッダの設定は `CakeResponse::header()` メソッドで行われます。
このメソッドは少し違ったパラメータ設定と一緒に呼ばれます。 :

``` php
// ヘッダを一つ設定する
$this->response->header('Location', 'http://example.com');

// 複数ヘッダを設定する
$this->response->header(array(
    'Location' => 'http://example.com',
    'X-Extra' => 'My header'
));
$this->response->header(array(
    'WWW-Authenticate: Negotiate',
    'Content-type: application/pdf'
));
```

同じ `~CakeResponse::header()` を複数回設定すると、
普通の header 呼び出しと同じように、以前の値を上書きしていしまいます。
`CakeResponse::header()` が呼び出されなければヘッダは送られません。
これらのヘッダはレスポンスが実際に送られるまでバッファリングされます。

::: info Added in version 2.4
:::

`CakeResponse::location()` を使うと直接 リダイレクトヘッダの設定や取得ができます。

## ブラウザキャッシュとの対話

時々、コントローラアクションの結果をキャッシュしないようにブラウザに強制する必要がでてきます。
`CakeResponse::disableCache()` はそういった目的で使われます。 :

``` php
public function index() {
    // 何か行う
    $this->response->disableCache();
}
```

> [!WARNING]
> Internet Explorer にファイルを送ろうとしている場合、SSL ドメインからのダウンロードと一緒に
> disableCache() を使うことをエラーにすることができます。

また、`CakeResponse::cache()` を使ってクライアントにレスポンスを
キャッシュして欲しいことを伝えられます。 :

``` php
public function index() {
    //do something
    $this->response->cache('-1 minute', '+5 days');
}
```

上記の例では、訪問者の体感スピード向上のため、クライアントにレスポンス結果を5日間
キャッシュするように伝えています。 `CakeResponse::cache()` は、
第一引数に `Last-Modified` ヘッダの値を設定します。
第二引数に `Expires` ヘッダと `max-age` ディレクティブの値を設定します。
Cache-Control の `public` ディレクティブも設定されます。

## HTTP キャッシュのチューニング

アプリケーションの速度を改善するための簡単で最善の方法の一つは HTTP キャッシュを使う事です。
このキャッシュモデルの元では、modified time, response entity tag などいくつかのヘッダを
設定することでレスポンスのキャッシュコピーを使うべきかどうかをクライアントが決定できるように
助ける事が求められます。

キャッシュやデータが変更されたときに無効化(更新)するロジックのコードを持つのではなく、
HTTP は二つのモデル、expiration と validation を使います。これらは大抵の場合、
自身でキャッシュを管理するよりかなり単純です。

`CakeResponse::cache()` と独立して、HTTP キャッシュヘッダを
チューニングするための様々なメソッドが使えます。
この点に関して、ブラウザやリバースプロキシのキャッシュよりも有利だと言えます。

### Cache Control ヘッダ

::: info Added in version 2.1
:::

キャッシュ制御ヘッダは expiration モデルの元で使われ、複数の指示を含んでいます。
ブラウザやプロキシがどのようにキャッシュされたコンテンツを扱うのかをその指示で変更することができます。
Cache-Control ヘッダは以下の通りです。 :

    Cache-Control: private, max-age=3600, must-revalidate

`CakeResponse` のいくつかのユーティリティメソッドを用いることで、最終的に有効な
`Cache-Control` ヘッダを生成します。 一つ目は、`CakeResponse::sharable()` メソッドです。
このメソッドは異なるユーザやクライアントの間で共有出来ることを考慮されたレスポンスかどうかを示します。
このメソッドは実際には、このヘッダが <span class="title-ref">public</span> または <span class="title-ref">private</span> のどちらなのかを制御しています。
private としてレスポンスを設定することは、レスポンスのすべてまたはその一部が特定のユーザ用であることを示しています。
共有キャッシュのメリットを活かすためにはコントロールディレクティブを public に設定する必要があります。

このメソッドの二番目のパラメータはキャッシュの <span class="title-ref">max-age</span> を指定するために使われます。
このパラメータはレスポンスが古いと見なされる秒数を表しています。 :

``` php
public function view() {
    ...
    // Cache-Control を 3600 秒の間、public として設定
    $this->response->sharable(true, 3600);
}

public function my_data() {
    ...
    // Cache-Control を 3600 秒の間、private として設定
    $this->response->sharable(false, 3600);
}
```

`CakeResponse` は `Cache-Control` ヘッダの中で各コンポーネントを
設定するための分割されたメソッドを公開しています。

### Expiration ヘッダ

::: info Added in version 2.1
:::

`Expires` ヘッダに、レスポンスが古いと見なされる日時を設定できます。
このヘッダは `CakeResponse::expires()` メソッドを使って設定されます。 :

``` php
public function view() {
    $this->response->expires('+5 days');
}
```

またこのメソッドは、`DateTime` インスタンスや `DateTime`
クラスによって構文解析可能な文字列を受け付けます。

### Etag ヘッダ

::: info Added in version 2.1
:::

HTTP におけるキャッシュの検証はコンテンツが定期的に変化するような場合によく使われ、
キャッシュが古いと見なせる場合にのみレスポンスコンテンツが生成されることをアプリケーションに求めます。
このモデルのもとでは、クライアントはページを直接使う代わりにキャッシュの中に保存し続け、
アプリケーションに毎回リソースが変更されたかどうかを尋ねます。
これは画像や他のアセットといった静的なリソースに対して使われる場合が多いです。

`~CakeResponse::etab()` メソッド (entity tag と呼ばれる) は要求されたリソースを
識別するための一意な文字列です。大抵の場合はファイルのチェックサムのようなもので、
リソースが一致するかどうかを調べるためにキャッシュはチェックサムを比較するでしょう。

実際にこのヘッダを使うメリットを得るためには、手動で `CakeResponse::checkNotModified()`
メソッドを呼び出すかコントローラに `RequestHandlerComponent`
を読み込まなければなりません。 :

``` php
public function index() {
    $articles = $this->Article->find('all');
    $this->response->etag($this->Article->generateHash($articles));
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }
    ...
}
```

### Last Modified ヘッダ

::: info Added in version 2.1
:::

HTTP キャッシュの検証モデルのもとでは、リソースが最後に変更された日時を示すために
`Last-Modified` ヘッダを設定することができます。このヘッダを設定すると CakePHP が
キャッシュしているクライアントにレスポンスが変更されたのかどうかを返答する手助けとなります。

実際にこのヘッダを使うメリットを得るためには、 `CakeResponse::checkNotModified()`
メソッドを呼び出すかコントローラに `RequestHandlerComponent` を読み込まなければなりません。 :

``` php
public function view() {
    $article = $this->Article->find('first');
    $this->response->modified($article['Article']['modified']);
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }
    ...
}
```

### Vary ヘッダ

時には同じ URL で異なるコンテンツを提供したいと思うかもしれません。
これは多国語対応ページがある場合やブラウザごとに異なる HTML を返すようなケースでしばしばおこります。
そのような状況では `Vary` ヘッダを使えます。 :

``` php
$this->response->vary('User-Agent');
$this->response->vary('Accept-Encoding', 'User-Agent');
$this->response->vary('Accept-Language');
```

## CakeResponse とテスト

コントローラとコンポーネントのテストが簡単に実施できた時、
`CakeResponse` を使っていて良かったと思うかもしれません。
いくつものオブジェクトを横断して使われるメソッドの代わりに、コントローラとコンポーネントが
`CakeResponse` に委譲しているのをまねる(mock)オブジェクトを準備するだけでよくなります。
このことで'単体'テストを作りやすくなり、コントローラのテスト実施が簡単になります。 :

``` php
public function testSomething() {
    $this->controller->response = $this->getMock('CakeResponse');
    $this->controller->response->expects($this->once())->method('header');
    // ...
}
```

さらに、CLI からヘッダ設定を試みた時に起こる「ヘッダ送信エラー」を避けるために
モックを使うことができるので、コマンドラインからより簡単にテストを実行できます。

## CakeResponse API

`class` **CakeResponse**

`method` CakeResponse::**header**($header = null, $value = null)

`method` CakeResponse::**location**($url = null)

`method` CakeResponse::**charset**($charset = null)

`method` CakeResponse::**type**($contentType = null)

`method` CakeResponse::**cache**($since, $time = '+1 day')

`method` CakeResponse::**disableCache**()

`method` CakeResponse::**sharable**($public = null, $time = null)

`method` CakeResponse::**expires**($time = null)

`method` CakeResponse::**etag**($tag = null, $weak = false)

`method` CakeResponse::**modified**($time = null)

`method` CakeResponse::**checkNotModified**(CakeRequest $request)

`method` CakeResponse::**compress**()

`method` CakeResponse::**download**($filename)

`method` CakeResponse::**statusCode**($code = null)

`method` CakeResponse::**body**($content = null)

`method` CakeResponse::**send**()

`method` CakeResponse::**file**($path, $options = array())
