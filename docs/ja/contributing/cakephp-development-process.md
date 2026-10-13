# CakePHP の開発プロセス

ここでは、CakePHP 2 の Piece of Cake 2 フォークがどのようにメンテナンスされているかを説明します。
フォークは GitHub 上でコミュニティによってメンテナンスされています。議論はすべて
[pieceofcake2](https://github.com/pieceofcake2) の各リポジトリの Issue と Pull Request で行います。

## 目的

フォークは、既存の CakePHP 2 アプリケーションを現在の PHP で動かし続けるために存在します。
目指しているのは次のことです。

- PHP 8.x への対応を維持すること
- バグとセキュリティ問題を修正すること
- サポートしているすべての PHP バージョンとデータベースでテストが通る状態を保つこと
- CakePHP 5 への段階的な移行を支援すること (例えば、CakePHP 2 と CakePHP 5 の両方で
  使えるモダンなディレクトリ構成)

フォークは新機能を追加しません。新しいプロジェクトには CakePHP 5 を使ってください。

## ブランチ

フレームワークでメンテナンスしているブランチは `2.x` だけです。バグ修正、セキュリティ修正、
互換性のための変更はすべてこのブランチで行い、Pull Request もこのブランチに対して作成します。
本家 CakePHP のような保守ブランチ、開発ブランチ、機能ブランチの区別はありません。

## リリース

リリースは `2.x` ブランチのタグで、
[GitHub のリリース](https://github.com/pieceofcake2/cakephp/releases) と
[Packagist](https://packagist.org/packages/pieceofcake2/cakephp) に
`pieceofcake2/cakephp` として公開されます。フォークは CakePHP 2.10.24 から始まりました。

- 最初のリリースは、本家の 2.10.24 に続けて `2.10.24.1`、`2.10.24.2` のように番号が付けられました。
- その後のリリースは独自のバージョン番号で続いています。`2.11.0` でフレームワークが
  新しいディレクトリ構成に移り、`2.12.0` で Composer の classmap オートロードに切り替わり、
  `2.12.x` のリリースにはその上での修正が含まれます。

2.11.0 や 2.12.0 のようなマイナーリリースにはアプリケーションに影響する変更が含まれていたので、
更新する前にリリースノートを読んでください。各リリースの内容は
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md) に書かれています。
アプリケーションの変更が必要になる変更点と、本家 CakePHP 2.10.24 からの移行方法は
[UPGRADE ガイド](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
と、このドキュメントの [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) で説明しています。

## 参加するには

- バグを見つけたら、[チケット](tickets) の説明に従って Issue を作成してください。
  バグに対する最高の答えは、それを再現するテストを書くことです。
  フレームワークの `tests/TestCase` にあるテストが参考になります。
- 自分で修正したい場合は、[コード](code) の説明に従って Pull Request を送ってください。
- セキュリティ問題を見つけたら、[セキュリティ問題の報告](tickets#reporting-security-issues)
  の説明に従って非公開で報告してください。
