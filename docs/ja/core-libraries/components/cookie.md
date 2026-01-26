# Cookie

`class` **CookieComponent**(ComponentCollection $collection, array $settings = array())

Cookie コンポーネントは PHP に組み込まれている `setcookie` メソッドに関連するラッパーです。
コントローラーで Cookie を使ったコーディングをするのにとても便利な糖衣構文も多数含んでいます。
Cookie コンポーネントを使おうとする前に、コントローラーの \$components の配列に 'Cookie' を必ず加えてください。

## コントローラーのセットアップ

Cookie の発行や操作の設定をすることができる値を以下に示します。これらの値によって
Cookie コンポーネントがどのように動くかは、コントローラーの beforeFilter()
メソッドでも特別に設定できます。

<table style="width:99%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 14%" />
<col style="width: 66%" />
</colgroup>
<thead>
<tr>
<th>Cookie の変数</th>
<th>規定値</th>
<th>内容</th>
</tr>
</thead>
<tbody>
<tr>
<td>string $name</td>
<td>'CakeCookie'</td>
<td>Cookie の名前です。</td>
</tr>
<tr>
<td>string $key</td>
<td>null</td>
<td><p>この文字列は Cookie の値を暗号化するために使われます。 ランダムで特定されにくい文字列を使うべきです。</p>
<p>Rijndael 暗号化を使うときは32バイトより長い値にしなければなりません。</p></td>
</tr>
<tr>
<td>string $domain</td>
<td>''</td>
<td>Cookie を読むことができるドメインの名前を設定します。たとえば、 '.yourdomain.com' を使うと、あなたのサブドメイン全体 からのアクセスを許可します。</td>
</tr>
<tr>
<td>int または string $time</td>
<td>'5 Days'</td>
<td>Cookie が無効になる時間を設定します。整数ならば秒として解釈され、 0であればセッション Cookie として評価されます。すなわち、ブラウザを 終了したときに破棄されます。文字列を設定したときは、 PHP の strtotime() 関数を使って解釈されます。 write() メソッドの中で 直接設定することもできます。</td>
</tr>
<tr>
<td>string $path</td>
<td>'/'</td>
<td>Cookie が適用されるサーバーのパスを設定します。 $path に '/foo/' を設定した場合、この Cookie は、あなたのドメインの /foo/ と、 それ以下にあるすべてのサブディレクトリ( /foo/bar など) で有効に なります。既定ではドメイン全体で有効です。 write() メソッドで 直接指定することもできます。</td>
</tr>
<tr>
<td>boolean $secure</td>
<td>false</td>
<td>セキュアな HTTPS 接続を通してのみ Cookie を伝送するかを設定 します。 true に設定すると、セキュアな接続が確立しているときにのみ Cookie を発行するようになります。 write() メソッドで直接指定する こともできます。</td>
</tr>
<tr>
<td>boolean $httpOnly</td>
<td>false</td>
<td>true に設定すると HTTP のみで有効な Cookie を作成します。これらの Cookie は Javascript からアクセスすることはできません。</td>
</tr>
</tbody>
</table>

以下のサンプルコードは、 Cookie コンポーネントをコントローラーにインクルードする方法と、
セキュアな接続でのみ、 'example.com' というドメインの ‘/bakers/preferences/’
というパス以下で、1時間だけ有効な 'baker_id' という名前の HTTP のみで有効な
Cookie の初期設定をするための例です。 :

``` php
public $components = array('Cookie');

public function beforeFilter() {
    parent::beforeFilter();
    $this->Cookie->name = 'baker_id';
    $this->Cookie->time = 3600;  // または '1 hour'
    $this->Cookie->path = '/bakers/preferences/';
    $this->Cookie->domain = 'example.com';
    $this->Cookie->secure = true;  // セキュアな HTTPS で接続している時のみ発行されます
    $this->Cookie->key = 'qSI232qs*&sXOw!adre@34SAv!@*(XSL#$%)asGb$@11~_+!@#HKis~#^';
    $this->Cookie->httpOnly = true;
}
```

それでは、その他の Cookie コンポーネントのメソッドの使い方を見ていきましょう。

## コンポーネントの使い方

CookieComponent は Cookie を使った動作をするためにいくつかのメソッドを提供します。

`method` CookieComponent::**write**(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

`method` CookieComponent::**read**(mixed $key = null)

`method` CookieComponent::**check**($key)

`method` CookieComponent::**delete**(mixed $key)

`method` CookieComponent::**destroy**()

`method` CookieComponent::**type**($type)
