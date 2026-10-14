# CakePHP の開発プロセス

ここでは、CakePHP 2 の Piece of Cake 2 フォークがどのようにメンテナンスされているかを説明します。
フォークは GitHub 上でコミュニティによってメンテナンスされています。議論はすべて
[pieceofcake2](https://github.com/pieceofcake2) の各リポジトリの Issue と Pull Request で行います。

フォークは、既存の CakePHP 2 アプリケーションを現在の PHP で動かし続けるために存在します。
新機能は追加しません。新しいプロジェクトには CakePHP 5 を使ってください。
フォークの目的、メンテナンスしている唯一のブランチ、リリースの方法は
コントリビューションガイド (英語) で説明しています。

- [Scope](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#scope)
- [Branches and Releases](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#branches-and-releases)

## バージョン番号

リリースは [GitHub のリリース](https://github.com/pieceofcake2/cakephp/releases) と
[Packagist](https://packagist.org/packages/pieceofcake2/cakephp) に
`pieceofcake2/cakephp` として公開されます。フォークは CakePHP 2.10.24 から始まりました。

- 最初のリリースは、本家の 2.10.24 に続けて `2.10.24.1`、`2.10.24.2` のように番号が付けられました。
- その後のリリースは独自のバージョン番号で続いています。`2.11.0` でフレームワークが
  新しいディレクトリ構成に移り、`2.12.0` で Composer の classmap オートロードに切り替わり、
  `2.12.x` のリリースにはその上での修正が含まれます。

2.11.0 や 2.12.0 のようなマイナーリリースにはアプリケーションに影響する変更が含まれていたので、
更新する前にリリースノートを読んでください。[後方互換性ガイド](backwards-compatibility) を参照してください。

## 参加するには

- バグを見つけたら、[チケット](tickets) の説明に従って Issue を作成してください。
  バグに対する最高の答えは、それを再現するテストを書くことです。
  フレームワークの `tests/TestCase` にあるテストが参考になります。
- 自分で修正したい場合は、[コード](code) の説明に従って Pull Request を送ってください。
- セキュリティ問題を見つけたら、[セキュリティ問題の報告](tickets#reporting-security-issues)
  の説明に従って非公開で報告してください。
