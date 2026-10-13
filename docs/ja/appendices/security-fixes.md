# 脆弱性への対応

CakePHP 2.x は 2021年6月にサポートが終了し、CakePHP チームによるセキュリティ修正のリリースも
終了しました。Piece of Cake 2 フォークでは、CakePHP 2.x に影響する脆弱性の修正を続けています。
このページでは、フォークで修正した脆弱性とその他のセキュリティ関連の変更、
そしてアプリケーション側で必要な対応を説明します。

## 脆弱性の報告

セキュリティの問題は、公開の issue やプルリクエストでは報告しないでください。
GitHub の非公開の脆弱性報告を使ってください。対象のリポジトリ
（たとえば [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)）を開き、
**Security** タブの **Report a vulnerability** から報告できます。
詳しくは [セキュリティポリシー](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
を参照してください。

## 修正した脆弱性

| CVE | 概要 | 修正バージョン |
|-----|------|----------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | `_method` パラメーターや独自の HTTP メソッドによる CSRF 対策の回避 | 2.11.0 |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF トークンの固定化 | 2.11.0 |

どちらの脆弱性も、本家の CakePHP 2.10.24 に存在します。

### CVE-2015-8379: `_method` パラメーターによる CSRF 対策の回避

`SecurityComponent` は、POST・PUT・DELETE・PATCH のリクエストでのみ CSRF トークンを検証していました。
それ以外の HTTP メソッドを使ったリクエストは、直接送信した場合も `_method` パラメーターで
メソッドを上書きした場合も、CSRF の検証を通らずに処理されていました。

フォークでは、GET・HEAD・OPTIONS 以外のすべてのリクエストで CSRF トークンを検証します。
この修正は本家 CakePHP のパッチをバックポートしたもので
（[c0fb45e](https://github.com/pieceofcake2/cakephp/commit/c0fb45e79)）、
テストは [PR #6](https://github.com/pieceofcake2/cakephp/pull/6) で追加しています。

**必要な対応:** 独自の HTTP メソッドを CSRF の検証対象外として使っていなければ、対応は不要です。
そのようなリクエストには有効な CSRF トークンが必要になります。トークンを送れない場合は、
そのアクションを `SecurityComponent::$unlockedActions` に追加してください。

### CVE-2020-15400: CSRF トークンの固定化

CSRF トークンはセッションに保存されたランダムな値でした。XSS などでセッションに書き込める攻撃者は、
トークンを固定して CSRF 攻撃に利用できました。

フォークでは、CakePHP 3.x・4.x と同じく HMAC で署名したトークンを生成します
（[PR #5](https://github.com/pieceofcake2/cakephp/pull/5)）。トークンは 16 バイトのランダムな値と、
その値を `Security.salt` で署名した HMAC-SHA1 を base64 でエンコードしたものです。
アプリケーションのソルトで署名されていないトークンは拒否され、署名の比較は定数時間で行います。

**必要な対応:** コードの変更は不要です。アップグレード前に発行したトークンも、有効期限までは受け付けます。
署名はソルトに依存するため、各アプリケーションの `config/core.php` で、スケルトンに含まれる値ではなく
アプリケーション固有の秘密の `Security.salt` を設定してください。

## その他のセキュリティ関連の変更

### SSL/TLS 証明書の検証

本家の CakePHP 2.x は、同梱の `lib/Cake/Config/cacert.pem` で HTTPS の証明書を検証していましたが、
このファイルは 2016年から更新されていませんでした。フォークではこのファイルを削除し、
[composer/ca-bundle](https://github.com/composer/ca-bundle) を使います
（[PR #15](https://github.com/pieceofcake2/cakephp/pull/15)、2.11.0 で修正）。

- OpenSSL がシステムの CA バンドルを提供している場合（`openssl.cafile` または `openssl.capath`）は、それを使います。
- それ以外の場合は、composer/ca-bundle に含まれる Mozilla の CA バンドルを使います。このバンドルは Composer で更新できます。

これは `CakeSocket` と `HttpSocket` に適用されます。`context.ssl.cafile` や `context.ssl.capath` を
自分で設定している場合は、その設定が使われます。

**必要な対応:** 削除された `cacert.pem` を参照しているコードを修正し、`composer/ca-bundle` を最新に保ってください。

### PHP 8 での暗号化

PHP 8 には mcrypt 拡張がありません。そのため、`Security::encrypt()`、`Security::decrypt()`、
`CookieComponent` の `'aes'` タイプは、OpenSSL を有効にした場合にのみ動作します。

```php
// config/core.php
Configure::write('Security.useOpenSsl', true);
```

`Security::rijndael()` と Cookie の `'rijndael'` タイプは、常に mcrypt が必要です。
[アップグレードガイド](/ja/appendices/migrating-from-cakephp-2-10#enable-openssl) も参照してください。

### CookieComponent の `cipher` タイプ

`CookieComponent` の暗号化タイプの既定値は `'cipher'` で、XOR ベースの `Security::cipher()` を使います。
これは安全ではなく、シード値（`Security.cipherSeed`）の扱いも float から int への未定義の変換に依存しています。
代わりに `'aes'` を使ってください。タイプは `$components` の設定では変更できないため、
`CookieComponent::type()` を呼び出します。

```php
public function beforeFilter()
{
    parent::beforeFilter();
    $this->Cookie->type('aes');
}
```

::: warning
暗号化タイプを変更すると、既存のクッキーは読み取れなくなります。移行期間中は両方のタイプを受け付けるなど、
移行の手順を計画してください。
:::

### XML の外部エンティティ

`Xml::build()` は、`'loadEntities' => true` を指定しない限り `<!ENTITY` の定義を読み込みません。
信頼できない XML を解析するときは、既定値のまま使ってください。

`Xml::build()` は、入力がファイルパスや URL の場合、ローカルファイルを読み込んだり URL から取得したりします。
ユーザーの入力を `Xml::build()` に渡す場合は、`<` で始まるかどうかなど、XML 文字列であることを確認してから渡してください。
