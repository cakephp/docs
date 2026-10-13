# Piece of Cake 2

[Piece of Cake 2](https://github.com/pieceofcake2) は、CakePHP 2 のアプリケーションを現在の PHP で
動かし続けるためのコミュニティプロジェクトです。PHP 8.0 以降で動作する CakePHP 2.x のフォーク
[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) を中心に、アプリケーションスケルトン、
Bake プラグイン、主要な CakePHP 2 プラグインのフォークをメンテナンスしています。

CakePHP プロジェクトによる CakePHP 2.x のサポートは
[2021年6月に終了](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html)しました。
このフォークは CakePHP 2.10.24 をベースに、PHP への対応、バグ修正、セキュリティ修正を行っています。
新しい機能は追加しません。

::: warning
CakePHP 2 は既存のアプリケーションを保守するためのものです。新しくプロジェクトを始める場合は
[CakePHP 5](https://book.cakephp.org/5/ja/) を使ってください。
:::

## このドキュメントについて

このドキュメントは、CakePHP 2 のクックブックを、フォーク上で現在動いている CakePHP 2 に合わせて
更新したものです。Composer でのインストール、PHP 8、[pieceofcake2/app](https://github.com/pieceofcake2/app)
で使っているモダンなディレクトリ構成を前提に説明しています。本家の CakePHP 2.x のドキュメントと
異なるページは [本家ドキュメントからの変更点](/ja/pieceofcake2/changes) にまとめています。

## はじめに読むページ

- [インストール](/ja/installation) - 新しいアプリケーションを作る、または既存のアプリケーションを
  pieceofcake2/cakephp に切り替えます。
- [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) - 本家の CakePHP 2.10.24 から
  アプリケーションを移行する手順と、破壊的変更を説明します。
- [モダン構成への移行](/ja/appendices/migrating-to-the-modern-layout) - `app/` の構成から
  CakePHP 5 と同じ形の構成へ、段階的に移る方法を説明します。
- [脆弱性への対応](/ja/appendices/security-fixes) - フォークで修正した脆弱性と、必要な対応を説明します。
- [メンテナンスされているプラグイン](/ja/plugins/maintained-plugins) - PHP 8 向けにメンテナンスしているプラグインの一覧です。

## リソース

- [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) -
  [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)、
  [UPGRADE](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
- [pieceofcake2/app](https://github.com/pieceofcake2/app) - アプリケーションスケルトン
- [pieceofcake2/docs](https://github.com/pieceofcake2/docs) - このドキュメントのソース
