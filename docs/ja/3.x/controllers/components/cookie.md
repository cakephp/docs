# クッキー

`class` Cake\\Controller\\Component\\**CookieComponent**(ComponentRegistry $collection, array $config = [])

CookieComponent は PHP に組み込まれている `setcookie()` メソッドのラッパーです。
このコンポーネントは、 Cookie の扱いを容易にし、 Cookie のデータを暗号化します。
CookieComponent で追加されたクッキーは、コントローラーのアクションが完了した場合にのみ送られます。

<div class="deprecated">

3.5.0
クッキーは、 `ServerRequest` で利用できます。 [Request Cookies](../../controllers/request-response#request-cookies) をご覧ください。
クッキーの暗号化は [Encrypted Cookie Middleware](../../controllers/middleware#encrypted-cookie-middleware) をご覧ください。

</div>

## Cookie の設定

Cookie はグローバルでも、トップレベルの名前ごとでも、どちらでも設定できます。
グローバル設定のデータはトップレベル設定に統合されますので、異なる部分の上書きさえすればよいです。
グローバルに設定するには、 `config()` メソッドを使用します。 :

``` php
$this->Cookie->config('path', '/');
$this->Cookie->config([
    'expires' => '+10 days',
    'httpOnly' => true
]);
```

特定のキーで設定するには `configKey()` メソッドを使用します。 :

``` php
$this->Cookie->configKey('User', 'path', '/');
$this->Cookie->configKey('User', [
    'expires' => '+10 days',
    'httpOnly' => true
]);
```

Cookie の設定、オプションついて

expires  
Cookie が無効になる時間を設定します。デフォルトは1ヶ月です。

path  
Cookie を有効にするパスを設定します。もしパスが '/foo/' で設定されていた場合、
Cookie は /foo/ ディレクトリーとサブディレクトリー (例: /foo/bar/) でのみ有効になります。
デフォルトは、アプリケーションの基本パスです。

domain  
Cookie が有効なドメイン。
example.com の全てのサブドメインで Cookie を有効にするには、 '.example.com' に
ドメインをセットしてください。

secure  
Cookie がセキュアな HTTPS 接続上でのみ転送されるべきであることを示します。このオプションを
`true` に設定した場合、 Cookie はセキュアな接続時のみ発行されるようになります。

key  
暗号化された Cookie が有効な時に使われる暗号化キー。
デフォルトは Security.salt です。

httpOnly  
このオプションに `true` を設定すると、 HTTP のみの Cookie を生成します。
HTTP のみの Cookie は JavaScript からアクセスできません。デフォルトは `false` です。

encryption  
暗号化のタイプを設定します。デフォルトは <span class="title-ref">aes</span> です。
互換性のために <span class="title-ref">rijndael</span> を設定することもできます。

## コンポーネントの使い方

CookieComponent は、いくつかのメソッドを提供します。

`method` Cake\\Controller\\Component\\CookieComponent::**write**(mixed $key, mixed $value = null)

`method` Cake\\Controller\\Component\\CookieComponent::**read**(mixed $key = null)

`method` Cake\\Controller\\Component\\CookieComponent::**check**($key)

`method` Cake\\Controller\\Component\\CookieComponent::**delete**(mixed $key)
