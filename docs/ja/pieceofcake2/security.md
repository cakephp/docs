# セキュリティ

::: pieceofcake2
このページは **pieceofcake2 フォーク** 固有の内容で、本家 CakePHP 2.x のドキュメントには含まれません。
pieceofcake2/cakephp でのセキュリティ関連の変更と、アプリケーションで見直すべき設定をまとめています。
:::

## 本家 CakePHP 2.10.24 の既知の脆弱性

本家 CakePHP 2.10.24 には、次の脆弱性が報告されています。

| CVE | 内容 | フォークでの対応状況 |
|-----|------|----------------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | `_method` パラメーターによる CSRF 保護の回避 | [c0fb45e](https://github.com/pieceofcake2/cakephp/commit/c0fb45e79) で修正、テストは [PR #6](https://github.com/pieceofcake2/cakephp/pull/6) |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF トークンの固定化（XSS と組み合わせて悪用可能） | [PR #5](https://github.com/pieceofcake2/cakephp/pull/5) で修正 |

- **CVE-2015-8379**: 修正は完全に適用済みで、`_method` パラメーターの扱いと独自の HTTP メソッドに
  ついてのテストもあります。安全なメソッド（GET、HEAD、OPTIONS）は対象外で、それ以外のメソッドは
  すべて CSRF トークンを必要とします。
- **CVE-2020-15400**: HMAC で署名した CSRF トークンで修正しました。次の節を参照してください。

## CSRF トークン

`SecurityComponent` の CSRF トークンは署名付きになりました
（[PR #5](https://github.com/pieceofcake2/cakephp/pull/5)）。

- 新しいトークンには、アプリケーションの `Security.salt` を使った HMAC-SHA1 の署名が付きます。
  そのため、攻撃者が XSS や物理的なアクセスによってトークンを固定化することはできません。
- トークンの形式は base64 エンコードで、16 バイトのランダムな値の後に 20 バイトの HMAC が続きます。
- 既存の（旧形式の）トークンも引き続き有効なので、対応は不要です。

::: tip
トークンは `Security.salt` に結び付くため、`core.php` ではデフォルト値ではなく、
アプリケーションごとに固有の秘密の値を設定してください。
:::

## SSL/TLS 証明書の検証

このフォークは証明書の検証に [`composer/ca-bundle`](https://github.com/composer/ca-bundle) を
使います（[PR #15](https://github.com/pieceofcake2/cakephp/pull/15)）。

- **システムの CA 証明書**: OpenSSL のデフォルトの証明書バンドル（`openssl.cafile` または
  `openssl.capath`）があればそれを使います。
- **フォールバック**: 無い場合は、composer/ca-bundle がメンテナンスしている Mozilla の CA バンドルを使います。
- **自動更新**: 証明書は Composer 経由で更新されます。
- 古い静的ファイル `lib/Cake/Config/cacert.pem`（最終更新 2016 年）は削除しました。

そのため、`CakeSocket` や `HttpSocket` による HTTPS 接続（外部 API の呼び出しなど）では、最新の
ルート証明書で証明書が検証されます。ソケットの設定で `context.ssl.cafile` や `context.ssl.capath`
を自分で指定している場合は、その設定が使われます。削除された `cacert.pem` を参照していたコードは
修正が必要です。

## XML の解析（XXE）

`Xml::build()` は、`'loadEntities' => true` を渡さない限り `<!ENTITY` 定義を読み込みません。
これにより XML 外部実体（XXE）攻撃を防いでいます。信頼できない XML を解析するときは、
デフォルトのままにしてください。

また `Xml::build()` は、入力がパスや URL の場合にローカルファイルやリモートの URL を読み込みます
（後方互換性のため `'readFile' => true` がデフォルト）。ユーザーのデータを `Xml::build()` に
渡す場合は無効にしてください。

```php
$xml = Xml::build($userInput, ['readFile' => false]);
```

## CookieComponent の `cipher` タイプ

`CookieComponent` のデフォルトの暗号化タイプ `'cipher'` は安全ではありません。

- XOR ベースの暗号である `Security::cipher()` を使っており、暗号学的に弱い
- シード値 `mt_srand((int)(float)Configure::read('Security.cipherSeed'))` は float から int への
  変換に関する未定義の挙動に依存しており、一貫性が保証されない

::: warning
CakePHP のソースコード自体に次のように書かれています。
"Cipher is horribly insecure and only the default because of backwards
compatibility. In new applications you should always change this to 'aes' or
'rijndael'."
（cipher はきわめて安全性が低く、後方互換性のためだけにデフォルトになっている。新しいアプリケーションでは必ず 'aes' か 'rijndael' に変更すること。）
:::

`'aes'`（または `'rijndael'`）に切り替えてください。

```php
public $components = [
    'Cookie' => [
        'type' => 'aes',
    ],
];

// コントローラーのアクション内で設定する場合
$this->Cookie->type('aes');
```

::: danger
暗号化タイプを変更すると、既存のクッキーは無効になります。移行期間中は両方のタイプに対応するなど、
移行の方針を計画してください。
:::

mcrypt を通常使えない PHP 8 では、`'aes'` は `core.php` で OpenSSL を有効にした場合にだけ
動作します。`'rijndael'` は常に mcrypt を必要とします。

```php
Configure::write('Security.useOpenSsl', true);
```

[アップグレードガイド](/ja/pieceofcake2/upgrade#enable-openssl) を参照してください。

## 脆弱性の報告

CakePHP のコアチームは 2.x をメンテナンスしていません。フォークで見つけたセキュリティ上の問題は、
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) を通じて
[Piece of Cake 2](https://github.com/pieceofcake2) プロジェクトに報告してください。
