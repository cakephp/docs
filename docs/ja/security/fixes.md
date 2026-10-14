# 脆弱性への対応

CakePHP 2.x は 2021年6月にサポートが終了し、CakePHP チームによるセキュリティ修正のリリースも
終了しました。Piece of Cake 2 フォークでは、CakePHP 2.x に影響する脆弱性の修正を続けています。
このページでは、フォークで修正した脆弱性とその他のセキュリティ関連の変更、
そしてアプリケーション側で必要な対応を説明します。

脆弱性の報告方法は [脆弱性の報告](/ja/security/reporting) を、本家 CakePHP のアドバイザリへの対応状況は
[本家のアドバイザリ](/ja/security/upstream-advisories) を参照してください。

## 修正した脆弱性

| ID | 概要 | 修正バージョン |
|----|------|----------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | `_method` パラメーターや独自の HTTP メソッドによる CSRF 対策の回避 | 2.11.0 |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF トークンの固定化 | 2.11.0 |
| [GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp) | SSRF: `'readFile' => false` でも `Xml::build()` が `https://` の URL を取得する | 2.12.3 |
| [GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv) | `SmtpTransport` と `MailTransport` のメールヘッダーインジェクション（CVE-2026-77634 に相当する CakePHP 2 の脆弱性） | 2.12.5 |
| [GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95) | ビュー・レイアウト・エレメント名のパストラバーサル（CVE-2026-48820 に相当する CakePHP 2 の脆弱性） | 2.12.5 |
| [GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx) | プロトコル相対 URL の `Auth.redirect` によるログイン後のオープンリダイレクト | 2.12.5 |

いずれの脆弱性も本家の CakePHP 2.10.24 に存在し、CakePHP チームによる修正はリリースされません。
`cakephp/cakephp` を使っているアプリケーションは、`pieceofcake2/cakephp` に切り替えると修正を適用できます。
`pieceofcake2/cakephp` は `cakephp/cakephp` を `replace` として宣言しています。PHP 8.0 以降が必要です。
[CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。

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

### `'readFile' => false` を指定した `Xml::build()` の SSRF {#xml-build-ssrf}

`Xml::build()` は、入力がファイルパスや URL の場合、ローカルファイルを読み込んだり URL から取得したりします。
`'readFile' => false` オプションはこれを無効にし、ユーザーの入力を安全に渡せるようにするためのものです。
しかし条件式の括弧が 1 組欠けていたため、`'readFile' => false` を指定しても `https://` の URL は取得されていました。
入力を操作できる攻撃者は、サーバーから任意の `https://` の URL へリクエストを送らせることができました
（サーバーサイドリクエストフォージェリ）。`http://` の URL とローカルファイルは影響を受けません。

この不具合は CakePHP 2.6.6 で `readFile` オプションが追加されたときに入り込んだもので
（[995d8d2](https://github.com/cakephp/cakephp/commit/995d8d22c6)）、それ以降のすべての 2.x に存在します。
2.12.3 で修正しました（[PR #33](https://github.com/pieceofcake2/cakephp/pull/33)）。
`'readFile' => false` を指定すると `http://` と `https://` のどちらの URL も取得せず、`XmlException` を投げます。
セキュリティアドバイザリ [GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp) を参照してください。

**必要な対応:** 2.12.3 以降に更新してください。ユーザーの入力を渡す可能性がある場合は `'readFile' => false` を指定してください。
`'readFile' => false` を指定したまま `https://` の URL を取得させていたコードは、オプションを削除する（既定値は `true`）か、
`HttpSocket` などで自分で文書を取得して XML 文字列を渡すように変更してください。

### `SmtpTransport` と `MailTransport` のメールヘッダーインジェクション {#email-header-injection}

`SmtpTransport` は、ヘッダーの値から改行を取り除かずに、メッセージのヘッダーを SMTP の `DATA` コマンドに書き込んでいました。
`MailTransport` は、ヘッダーの値、件名、宛先から `\r\n` を取り除いていましたが、単独の `\r` や `\n` は残していました。
多くのメールサーバーは、これらも改行として扱います。`CakeEmail::setHeaders()` や `addHeaders()` で設定する独自のヘッダーなど、
メールのヘッダーにユーザーの入力を使っているアプリケーションでは、攻撃者が `Bcc:` などのヘッダーを追加したり、
メッセージの本文を始めたりできました。

これは CakePHP 4.x・5.x で修正された CVE-2026-77634 に相当する、CakePHP 2 の脆弱性です。2.12.5 で修正しました。
`SmtpTransport` はヘッダーの名前と値から CR と LF を取り除き、折り返したヘッダー行
（長いヘッダーを MIME エンコードしたときのような、改行の後に空白が続く行）だけを残します。
`MailTransport` は単独の `\r` と `\n` も取り除きます。
セキュリティアドバイザリ [GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv) を参照してください。

**必要な対応:** 2.12.5 以降に更新してください。ヘッダーの値に改行を入れてヘッダーを追加していたコードは、
`CakeEmail::setHeaders()` や `addHeaders()` にヘッダーを 1 つずつ渡すように変更してください。
すぐに更新できない場合は、ヘッダーの値、件名、アドレスに使うユーザーの入力から CR と LF を取り除いてください。

### ビュー・レイアウト・エレメント名のパストラバーサル {#view-path-traversal}

`View` は、ビュー・レイアウト・エレメントの名前から見つけたファイルがビューのパスの中にあるかどうかを確認していませんでした。
`$this->element('widgets/' . $type)` のように、アプリケーションがユーザーの入力から名前を組み立てている場合、
`..` を含む名前でサーバー上の別のファイルを指定でき、そのファイルが PHP のテンプレートとして読み込まれ実行されました。

これは CakePHP 4.x・5.x で修正された CVE-2026-48820 に相当する、CakePHP 2 の脆弱性です。2.12.5 で修正しました。
名前に `..` が含まれる場合、ファイルの実際のパスがビューのパス（`App::path('View')` とプラグインやテーマのビューのパス）の中に
なければなりません。それ以外のファイルは存在しないものとして扱います。`element()` はエレメントが無い場合と同じ動作になり、
`elementExists()` は `false` を返し、ビューとレイアウトは `MissingViewException` と `MissingLayoutException` を投げます。
ビューのパスの中に収まる名前は、これまでどおり使えます。
セキュリティアドバイザリ [GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95) を参照してください。

**必要な対応:** 2.12.5 以降に更新してください。`../../other/file` のような名前でビューのパスの外にあるテンプレートを
表示している場合は、そのテンプレートをビューのパスに移動してください。ビュー・レイアウト・エレメントの名前をユーザーの入力から
組み立てないでください。組み立てる場合は、先に許可リストで入力を確認してください。

### `AuthComponent` のログイン後のオープンリダイレクト {#auth-redirect}

ログインしていないユーザーが保護されたアクションにアクセスすると、`AuthComponent` はアクセスされた URL を
セッションの `Auth.redirect` に保存し、ログインに成功すると `AuthComponent::redirectUrl()` がその URL を返します。
ブラウザーは、`//` や、`/\`・`\\` のようにバックスラッシュを使った形で始まる URL を別のホストの URL として扱います。
そのため、パスが `//` で始まる細工したリンクを使うと、ログイン後にユーザーを攻撃者のサイトへリダイレクトさせることができました
（オープンリダイレクト）。

CakePHP 2 についての本家のアドバイザリはありません。`cakephp/authentication` プラグインの CVE-2026-55590 に似た問題です。
2.12.5 で修正しました。`redirectUrl()` は保存された URL の先頭のスラッシュとバックスラッシュを 1 つの `/` にまとめるため、
リダイレクト先は常に同じホストになります。
セキュリティアドバイザリ [GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx) を参照してください。

**必要な対応:** 2.12.5 以降に更新してください。コードの変更は不要です。すぐに更新できない場合は、
リダイレクトする前に `Auth.redirect` の値を確認し、`//`、`/\`、`\/`、`\\` で始まる値を拒否してください。

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

mcrypt 拡張は PHP 7.2 以降同梱されておらず、[PECL](https://pecl.php.net/package/mcrypt) から入れる必要があります。mcrypt が無い場合、`Security::encrypt()`、`Security::decrypt()`、
`CookieComponent` の `'aes'` タイプは、OpenSSL を有効にした場合にのみ動作します。

```php
// config/core.php
Configure::write('Security.useOpenSsl', true);
```

[pieceofcake2/app](https://pieceofcake2.github.io/app/) のスケルトン (v2.3.1 以降) から作成したアプリケーションには
この行が含まれています。既存のアプリケーションでは追加してください。

`Security::rijndael()` と Cookie の `'rijndael'` タイプは、常に mcrypt が必要です。
[アップグレードガイド](/ja/appendices/migrating-from-cakephp-2-10#enable-openssl) も参照してください。

### CookieComponent の `cipher` タイプ

`CookieComponent` の暗号化タイプの既定値は `'cipher'` で、XOR ベースの `Security::cipher()` を使います。
これは安全ではなく、シード値（`Security.cipherSeed`）の扱いも float から int への未定義の変換に依存しています。
代わりに `'aes'` を使ってください。タイプは `$components` の `'type'` で設定します。

```php
public $components = [
    'Cookie' => ['type' => 'aes'],
];
```

`beforeFilter()` で `$this->Cookie->type('aes');` を呼び出して設定することもできます。

::: pieceofcake2
`$components` の `'type'` は v2.12.3 から反映されます。v2.12.2 以前では無視され、
Cookie は `'cipher'` で暗号化されていました。
:::

::: warning
暗号化タイプを変更すると、既存のクッキーは読み取れなくなります。移行期間中は両方のタイプを受け付けるなど、
移行の手順を計画してください。
:::

### XML の外部エンティティ

`Xml::build()` は、`'loadEntities' => true` を指定しない限り `<!ENTITY` の定義を読み込みません。
信頼できない XML を解析するときは、既定値のまま使ってください。

`Xml::build()` は、入力がファイルパスや URL の場合、ローカルファイルを読み込んだり URL から取得したりします。
ユーザーの入力を `Xml::build()` に渡す場合は、`'readFile' => false` を指定するか（[上記](#xml-build-ssrf) を参照）、
`<` で始まるかどうかなど、XML 文字列であることを確認してから渡してください。
