# Piece of Cake 2

::: pieceofcake2
このページは **Piece of Cake 2** 固有の内容で、本家 CakePHP 2.x のドキュメントには含まれません。
このドキュメント全体で、このような枠で囲まれた部分は Piece of Cake 2 にのみ当てはまる内容です。
:::

[Piece of Cake 2](https://github.com/pieceofcake2) は、CakePHP 2.x を PHP 8.0 以降で動作させるための
コミュニティメンテナンス版フォークです。本家 CakePHP 2.x は
[2021年6月にサポートを終了](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html)しています。

::: warning
**新規プロジェクトで CakePHP 2.x を使わないでください。** このフォークは既存のレガシーアプリケーションを
動かし続けるためのものです。新規プロジェクトには [CakePHP 5.x](https://book.cakephp.org/5/ja/) を使ってください。
:::

## 動作要件

- PHP 8.0, 8.1, 8.2, 8.3, 8.4, 8.5
- Composer（Composer を使わないインストールはサポートしません）
- MySQL 5.6 以降、PostgreSQL 9.4 以降、SQLite 3、Microsoft SQL Server 2022 以降

このフォークは CakePHP **2.10.24** をベースにしています。それより前のバージョンはサポートしません。

## インストール

```json
{
    "require": {
        "pieceofcake2/cakephp": "^2.10"
    }
}
```

`pieceofcake2/cakephp` は Composer の `replace` で `cakephp/cakephp` を置き換えるため、
`cakephp/cakephp:^2.x` に依存するプラグインもそのまま動作します。

## リソース

- [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) - フレームワーク本体
- [pieceofcake2/app](https://github.com/pieceofcake2/app) - アプリケーションスケルトン
- [pieceofcake2/bake](https://github.com/pieceofcake2/bake) - Bake プラグイン（コアから分離）
- [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
- [UPGRADE](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
