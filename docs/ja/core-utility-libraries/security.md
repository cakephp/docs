# Security

`class` **Security**

[Security ライブラリ](https://api.cakephp.org/2.x/class-Security.html) は、
データのハッシュ化や暗号化などのメソッドなどの基本的なセキュリティ分野を取り扱います。

> [!IMPORTANT]
> デフォルトでは、`Security::encrypt()` と `Security::decrypt()` は `mcrypt` エクステンションを使います。
> `mcrypt` は PHP 7.2 以降 PHP に同梱されていないため、`config/core.php` で OpenSSL を有効にしてください。
>
> ``` php
> Configure::write('Security.useOpenSsl', true);
> ```
>
> [pieceofcake2/app](https://pieceofcake2.github.io/app/) のスケルトン (v2.3.1 以降) から作成したアプリケーションには
> この行が含まれています。既存のアプリケーションでは追加してください。
>
> OpenSSL による実装は `mcrypt` と同じ形式で暗号化するため、以前に暗号化した値も復号できます。
> `Security::rijndael()` には OpenSSL による実装がなく、常に `mcrypt` が必要です。

## Security API

`static` Security::**cipher**( $text, $key )

戻り値の型: `string`

与えられたキーにを利用してテキストを暗号化・復号します。

``` php
// 'my_key' でテキストを暗号化する
$secret = Security::cipher('hello world', 'my_key');

// その後、テキストを復号する
$nosecret = Security::cipher($secret, 'my_key');
```

> [!WARNING]
> `cipher()` は、 **脆弱な** XOR 暗号を利用しています。従って、
> 重要で機密性の高いデータへ **使うべきではありません** 。
> このメソッドは、後方互換性のためだけに残されています。
> `CookieComponent` のデフォルトの暗号化タイプ `'cipher'` もこのメソッドを使っているため、
> 代わりに `'aes'` タイプを使ってください ([脆弱性への対応](/ja/appendices/security-fixes) を参照してください)。

`static` Security::**rijndael**($text, $key, $mode)

- `string $text`: 暗号化するテキスト
- `string $key`: 暗号化に利用するキー。32バイトより長くする必要があります。
- `string $mode`: モード。'encrypt' もしくは 'decrypt'

rijndael-256 暗号を使って、テキストを暗号化・復号します。
このメソッドを使うには PECL から [mcrypt エクステンション](https://pecl.php.net/package/mcrypt)
をインストールしておく必要があります。新しく書くコードでは、`Security.useOpenSsl` を有効にして
`Security::encrypt()` と `Security::decrypt()` を使うことをお勧めします。使い方は次のとおりです。

``` php
// データを暗号化
$encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

// その後、復号
$decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');
```

::: info Added in version 2.2
`Security::rijndael()` は、2.2 で追加されました。
:::

`static` Security::**encrypt**($text, $key, $hmacSalt = null)

- `string $plain`: 暗号化する値。
- `string $key`: 暗号キーとして使用する 256 ビット (32 バイト) キー。
- `string $hmacSalt`: HMAC 処理で使用するソルト。 null なら Security.salt を使用。

AES-256 で `$text` を暗号化します。 `$key` は、適切なパスワードのように
データの中の値はバラバラに分散した値にすべきです。戻り値は、HMAC チェックサムで
暗号化された値です。

このメソッドをパスワードの保存に **使用しないでください**。代わりに
`Security::hash()` などの一方行ハッシュメソッドを使用してください。
以下が使用例です。

``` php
// キーはどこかに格納されていて、後で復号に再利用されると仮定
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
$result = Security::encrypt($value, $key);
```

暗号化された値は、 `Security::decrypt()` で復号化されます。

::: info Added in version 2.5
:::

::: info Changed in version 2.10.8
`Security.useOpenSsl` を設定すると、`mcrypt` エクステンションの代わりに OpenSSL を利用します。
:::

`static` Security::**decrypt**($cipher, $key, $hmacSalt = null)

- `string $cipher`: 復号する暗号文字列。
- `string $key`: 暗号キーとして使用する 256 ビット (32 バイト) キー。
- `string $hmacSalt`: HMAC 処理で使用するソルト。 null なら Security.salt を使用。

事前に暗号化された値を復号します。 `$key` と `$hmacSalt` パラメータは、
暗号化に使用した値と一致しなければなりません。そうでなければ復号に失敗します。
以下が使用例です。

``` php
// キーはどこかに格納されていて、後で復号に再利用されると仮定
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

$cipher = $user['User']['secrets'];
$result = Security::decrypt($cipher, $key);
```

暗号キーや HMAC ソルトが変わったことで復号化できなかった場合は、 `false` を返します。

::: info Added in version 2.5
:::

::: info Changed in version 2.10.8
`Security.useOpenSsl` を設定すると、`mcrypt` エクステンションの代わりに OpenSSL を利用します。
:::

`static` Security::**hash**( $string, $type = NULL, $salt = false )

戻り値の型: `string`

与えられたハッシュ用メソッドを利用して、文字列からハッシュを生成します。
指定されなかった場合は、順次利用可能なメソッドで生成を試みます。
`$salt` を true にした場合、アプリケーションに設定した salt が利用されます。

``` php
// アプリケーションの salt 値を利用
$sha1 = Security::hash('CakePHP Framework', 'sha1', true);

// 独自の salt 値を利用する場合
$md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

// デフォルトのハッシュアルゴリズムを利用する場合
$hash = Security::hash('CakePHP Framework');
```

`hash()` は、 bcrypt のような別のセキュアなハッシュアルゴリズムにも対応しています。
bcrypt を使用した場合、わずかに使用方法が異なることに注意してください。
最初にハッシュを生成することは、他のアルゴリズムと同じ動作をします。

``` php
// bcrypt を使用してハッシュを作成
Security::setHash('blowfish');
$hash = Security::hash('CakePHP Framework');
```

他のハッシュタイプと異なる点は、プレーンテキストの値とハッシュ化した値を比較する際に、
以下のようにしなければならない点です。

``` php
// $storedPassword は、事前に生成された bcrypt ハッシュ
$newHash = Security::hash($newPassword, 'blowfish', $storedPassword);
```

bcrypt でハッシュ化された値を比較する時、元のハッシュ値は、 `$salt` パラメータに
設定しなければなりません。bcrypt は、同じ cost 値と salt 値を再利用することで、
同じ入力値を与えると同じ結果のハッシュが得られます。

::: info Changed in version 2.3
bcrypt への対応は、2.3 で追加されました。
:::

`static` Security::**setHash**( $hash )

戻り値の型: `void`

Security オブジェクトがデフォルトで利用するハッシュ化メソッドを設定します。
この操作は、 Security::hash() を利用する全てのオブジェクトへ影響します。
