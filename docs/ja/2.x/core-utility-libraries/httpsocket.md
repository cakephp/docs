# HttpSocket

`class` **HttpSocket**(mixed $config = array())

CakePHP には、リクエストを簡単に行える HttpSocket クラスがあります。
それは、外部のウェブサービスやリモート API との通信に役に立ちます。

## リクエストの作成

異なる HTTP メソッドの多くの種類の HTTP リクエストを作成するために HttpSocket
が使えます。

`method` HttpSocket::**get**($uri, $query, $request)

`method` HttpSocket::**post**($uri, $data, $request)

`method` HttpSocket::**put**($uri, $data, $request)

`method` HttpSocket::**delete**($uri, $query, $request)

`method` HttpSocket::**patch**($uri, $data, $request)

`method` HttpSocket::**request**($request)

## レスポンスの処理

`HttpSocket` を使ったリクエストからのレスポンスは、 `HttpResponse` のインスタンスです。
このオブジェクトは、HTTP レスポンスの内容にアクセスするための、いくつかのアクセッサーメソッドを
持っています。このクラスは [ArrayAccess](https://www.php.net/manual/ja/class.arrayaccess.php) と
[\_\_toString()](https://www.php.net/manual/ja/language.oop5.magic.php#language.oop5.magic.tostring)
を実装していますので、 `$http->response` を配列として使用でき、リクエストメソッドの戻り値を
文字列として使用できます。 :

``` php
App::uses('HttpSocket', 'Network/Http');

$http = new HttpSocket();
$response = $http->get('https://cakephp.org');

// タイトルタグの存在をチェック
$titlePos = strpos($response->body, '<title>');

// レスポンスのステータスコードを取得
$code = $response->code;
```

`HttpResponse` は以下の属性を持ちます。

- `body` は HTTP レスポンスのボディを返します (通常の HTML)。
- `headers` は、ヘッダーの配列を返します。
- `cookies` は、新しいクッキーの配列を返します (他のリクエストのクッキーは保存されません)。
- `httpVersion` は、HTTP バージョンを文字列で返します (レスポンスの１行目から)。
- `code` は、HTTP ステータスコードを整数で返します。
- `reasonPhrase` は、HTTP ステータスコードと一緒の文字列を返します。
- `raw` は、手を加えていないサーバーからのレスポンスを返します。

`HttpResponse` は、以下のメソッドを持ちます。

- `body()` は、ボディを返します。
- `isOk()` は、ステータスコードが 200 かどうかを返します。
- `isRedirect()` は、ステータスコードが 301, 302, 303 もしくは 307 で
  *Location* ヘッダーがセットされているかどうかを返します。
- `getHeader()` は、ヘッダーを取得します。次のセクションをご覧ください。

### レスポンスのヘッダーを取得

コアの別の場所に従って、 HttpSocket はヘッダーの文字を変更しません。 `2616` には、
ヘッダーは大文字小文字を区別しないと書かれています。そして、 HttpSocket は
リモートホストが送った値を保存します。 :

    HTTP/1.1 200 OK
    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

`$response->headers` (もしくは `$response['header']`) は、実際に送られたキーを含みます。
安全にヘッダーフィールドへのアクセスするために、 `getHeader()` を使用することが最良です。
もし、ヘッダーが以下の場合、 :

    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

`getHeader()` で上記のヘッダーを取得できます。 :

``` php
// $response は HttpResponse のインスタンス。
// Content-Type を取得
$response->getHeader('Content-Type');

// date を取得
$response->getHeader('date');
```

ヘッダーは、大文字小文字の区別なく取得できます。

### リダイレクトレスポンスの自動処理

レスポンスがリダイレクトステータスコードの場合 (`HttpResponse::isRedirect` 参照)、
受信した *Location* ヘッダーに従って、自動的に追加のリクエスを行うことができます。 :

``` php
<?php
App::uses('HttpSocket', 'Network/Http');

$HttpSocket = new HttpSocket();
$response = $HttpSocket->get('http://example.com/redirecting_url', array(), array('redirect' => true));
```

*redirect* オプションは、以下の値を指定できます。

- **true** : すべてのリダイレクトするレスポンスは、一貫して新たなリクエストをします。
- **integer** : 設定した値は、リダイレクトする回数の最大値です。 (回数に達した後は、
  *redirect* 値を **false** とみなします。)
- **false** (デフォルト) : リダイレクトしません。

`$response` は、設定に従って戻ってくる最後のレスポンスになります。

### SSL 証明書の処理

SSL のサービスへのリクエストを作成する場合、 HttpSocket は、ピア検証で SSL 証明書の
検証を試みます。もし、証明書がピア検証に失敗したり、アクセス先のホスト名と一致しなかった場合、
接続は失敗し、例外が投げられます。デフォルトで、 HttpSocket は、SSL 証明書を確認するために
モジラ証明書認証局ファイルを使用します。どのように SSL 証明書を処理するか設定するために
以下のオプションが使えます。

- `ssl_verify_peer` false にセットすると、SSL の検証を無効にします。これは、\*\*非推奨\*\* です。
- `ssl_verify_host` 証明書を検証する際にホスト名の照合エラーを無視したい場合に false をセットします。
- `ssl_allow_self_signed` 自己署名証明書を受け入れられるようにするために true をセットします。
  これは、 `ssl_verify_peer` を有効にする必要があります。
- `ssl_cafile` SSL 証明書を検証するために使用したい証明書認証局ファイルの絶対パスをセットします。

これらのオプションは、コンストラクタの引数として指定します。 :

``` php
$socket = new HttpSocket(array(
    'ssl_allow_self_signed' => true
));
```

上記の socket で作られたすべてのリクエストは自己署名証明書を許可します。

::: info Added in version 2.3
SSL 証明書の検証は、 2.3 で追加されました。
:::

### 独自レスポンスクラスの作成

HttpSocket で使用する独自のレスポンスクラスを作成することができます。以下の内容で
`app/Lib/Network/Http/YourResponse.php` というファイルを作ることができました。 :

``` css
App::uses('HttpResponse', 'Network/Http');

class YourResponse extends HttpResponse {

    public function parseResponse($message) {
        parent::parseResponse($message);
        // Make what you want
    }
}
```

リクエストする前に、 responseClass プロパティを変更する必要があります。 :

``` php
App::uses('HttpSocket', 'Network/Http');

$http = new HttpSocket();
$http->responseClass = 'YourResponse';
```

::: info Changed in version 2.3
2.3.0 以降、 `HttpSocketResponse` を継承すべきです。これは、HTTP PECL 拡張の一般的な問題を回避します。
:::

### 結果のダウンロード

HttpSocket は、 <span class="title-ref">setContentResponse()</span> と呼ばれる新しいメソッドを持ちます。
このメソッドでリソースをセットすることによって、 <span class="title-ref">fwrite()</span> を使ってこのリソースに
内容を書き込ませられます。 ファイルをダウンロードするためには、以下のようにします。 :

``` php
App::uses('HttpSocket', 'Network/Http');

$http = new HttpSocket();
$f = fopen(TMP . 'bakery.xml', 'w');
$http->setContentResource($f);
$http->get('https://bakery.cakephp.org/comments.rss');
fclose($f);
```

> [!NOTE]
> ヘッダーはファイル内に含まれません。リソースに書き込まれる内容は本文のみです。
> リソースへの保存を無効にしたい場合は、 `$http->setContentResource(false)`
> を使います。

## 認証の利用

HttpSocket は、 HTTP ベーシック認証とダイジェスト認証に対応しています。
また、OAuth のようなプロトコルに対応するために独自の認証オブジェクトを作成することができます。
任意の認証システムを利用するためには、 `HttpSocket` インスタンスを設定する必要があります。 :

``` php
App::uses('HttpSocket', 'Network/Http');

$http = new HttpSocket();
$http->configAuth('Basic', 'user', 'password');
```

上記は、 `user` と `password` を証明情報としてベーシック認証 のための
`HttpSocket` インスタンスの設定です。

### 独自認証オブジェクトの作成

HttpSocket で利用するための独自の認証方法を作成することができます。
以下の内容で、 `app/Lib/Network/Http/YourMethodAuthentication.php`
ファイルを作成できました。 :

``` php
class YourMethodAuthentication {

/**
 * 認証
 *
 * @param HttpSocket $http
 * @param array $authInfo
 * @return void
 */
    public static function authentication(HttpSocket $http, &$authInfo) {
        // 何かをします。例えば、 $http->request['header']['Authentication'] の値をセット。
    }

}
```

独自認証を HttpSocket に設定するためには、新しい `configAuth()` メソッドを使用します。 :

``` php
$http->configAuth('YourMethod', array('config1' => 'value1', 'config2' => 'value2'));
$http->get('http://secure.your-site.com');
```

`authentication()` メソッドは、リクエストヘッダを追加するために呼ばれます。

### プロクシ経由で HttpSoket の利用

認証設定の一部で、プロクシ認証の設定ができます。同じ認証クラスの中で、プロクシ認証のための
独自のメソッドを作成します。 :

``` php
class YourMethodAuthentication {

/**
 * 認証
 *
 * @param HttpSocket $http
 * @param array $authInfo
 * @return void
 */
    public static function authentication(HttpSocket $http, &$authInfo) {
        // 何かします。例えば $http->request['header']['Authentication'] の値をセット。
    }

/**
 * プロクシ認証
 *
 * @param HttpSocket $http
 * @param array $proxyInfo
 * @return void
 */
    public static function proxyAuthentication(HttpSocket $http, &$proxyInfo) {
        // 何かします。例えば $http->request['header']['Proxy-Authentication'] の値をセット。
    }

}
```

> [!NOTE]
> プロクシを利用するためには、 `HttpSocket::configAuth()` と同様に
> `HttpSocket::configProxy()` を呼ばなければなりません。
