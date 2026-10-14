# セキュリティ

CakePHP 2.x は 2021年6月にサポートが終了し、CakePHP チームによるセキュリティ修正のリリースも
終了しました。pieceofcake2 のフォークでは、CakePHP 2.x に影響する脆弱性の修正を続けています。
このセクションでは、セキュリティ修正の対象となるバージョン、脆弱性の報告方法、修正した脆弱性、
そして CakePHP 2 のアプリケーションを安全に運用するための設定を説明します。

- [脆弱性の報告](/ja/security/reporting): セキュリティの問題を非公開で報告する方法と、報告した後の流れ
- [脆弱性への対応](/ja/security/fixes): フォークで修正した脆弱性と、アプリケーション側で必要な対応
- [本家のアドバイザリ](/ja/security/upstream-advisories): CakePHP 2.x に関係する本家 CakePHP のアドバイザリへの対応状況
- [セキュリティチェックリスト](/ja/security/hardening): 本番環境で運用する前に確認する設定

<a id="supported-versions"></a>

## サポートするバージョン

pieceofcake2 Organization の [セキュリティポリシー](https://github.com/pieceofcake2/.github/blob/master/SECURITY.md)
は、独自の `SECURITY.md` を持つリポジトリを除き、[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)
やプラグインのフォークを含む Organization のすべてのリポジトリに適用されます。ポリシーには次のように定められています。

- セキュリティ修正は、各パッケージの最新のリリースに対して提供します。`pieceofcake2/cakephp` の場合は、
  `2.x` の最新のリリースです。
- 本家の CakePHP 2.x で見つかった脆弱性のうち、フォークにも影響するものは対象に含みます。

これまでのセキュリティ修正は、2.12.3 や 2.12.5 のように、現在のマイナーバージョンのパッチリリースとして
リリースしています。修正を適用するには、アプリケーションを最新のリリースに保ってください。

```bash
composer update pieceofcake2/cakephp
```

本家の `cakephp/cakephp` 2.10.24 を使っているアプリケーションには、修正は提供されません。
`pieceofcake2/cakephp` への切り替えについては [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10)
を参照してください。

<a id="announcements"></a>

## 修正の告知

脆弱性を修正したときは、次の場所で告知します。

- **GitHub のセキュリティアドバイザリ。** 影響を受けるリポジトリでアドバイザリを公開します。
  たとえば pieceofcake2/cakephp の [Security Advisories](https://github.com/pieceofcake2/cakephp/security/advisories)
  のページです。アドバイザリには、影響を受けるバージョンと修正したバージョンを記載します。
  必要に応じて CVE も申請します。
- **CHANGELOG。** [CHANGELOG.md](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
  のリリースノートに「Security Fixes」のセクションを設け、アドバイザリへのリンクを記載します。
  アプリケーション側で必要な変更は [UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
  で説明します。
- **このドキュメント。** [脆弱性への対応](/ja/security/fixes) に、修正したすべての脆弱性の説明と
  アプリケーション側で必要な対応をまとめています。各リリースの変更点は
  [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) で説明しています。

新しいリリースの通知を受け取るには、GitHub で [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp)
リポジトリを Watch してください (**Watch** > **Custom** > **Releases**)。
