# 本家のアドバイザリ

このページでは、CakePHP 2.x に関係する本家 CakePHP プロジェクトのセキュリティアドバイザリと、
`pieceofcake2/cakephp` での対応状況をまとめています。対応状況は、フォークの
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)、
[UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)、
[セキュリティアドバイザリ](https://github.com/pieceofcake2/cakephp/security/advisories) に基づいています。
各修正の詳細とアプリケーション側で必要な対応は [脆弱性への対応](/ja/security/fixes) を参照してください。

<a id="status"></a>

## 対応状況

| 本家のアドバイザリ | 概要 | フォークでの対応状況 |
|--------------------|------|----------------------|
| [CVE-2015-8379](https://nvd.nist.gov/vuln/detail/CVE-2015-8379) | `_method` パラメーターによる CSRF 対策の回避 | 2.11.0 で修正 (本家のパッチのバックポート) |
| [CVE-2020-15400](https://nvd.nist.gov/vuln/detail/CVE-2020-15400) | CSRF トークンの固定化 | 2.11.0 で修正 (CakePHP 3.x・4.x と同じく HMAC で署名したトークン) |
| CVE-2026-77634 | メールヘッダーインジェクション。本家では CakePHP 4.x・5.x で修正 | CakePHP 2 の同等の脆弱性を 2.12.5 で修正 ([GHSA-4f9q-3c4x-52cv](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-4f9q-3c4x-52cv)) |
| CVE-2026-48820 | テンプレート名のパストラバーサル。本家では CakePHP 4.x・5.x で修正 | CakePHP 2 の同等の脆弱性を 2.12.5 で修正 ([GHSA-w2mh-x92p-5p95](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-w2mh-x92p-5p95)) |
| CVE-2026-55590 | `cakephp/authentication` プラグインのログイン後のリダイレクトの問題 | 対象外: このプラグインは CakePHP 2 には含まれません。`AuthComponent` の同様の問題は 2.12.5 で修正 ([GHSA-x4p9-p4cx-gxwx](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-x4p9-p4cx-gxwx)) |

`'readFile' => false` を指定した `Xml::build()` の SSRF
([GHSA-wgww-24w3-wfqp](https://github.com/pieceofcake2/cakephp/security/advisories/GHSA-wgww-24w3-wfqp)、
2.12.3 で修正) はフォークで見つかったもので、本家のアドバイザリはありません。

<a id="not-listed"></a>

## ここに無いアドバイザリ

フォークでは、上記以外の本家のアドバイザリについての評価を公開していません。そのため、このページでは
「影響なし」としたアドバイザリは掲載していません。本家 CakePHP のアドバイザリが `pieceofcake2/cakephp`
にも影響すると思われる場合は、[脆弱性の報告](/ja/security/reporting) の方法で非公開で報告してください。
