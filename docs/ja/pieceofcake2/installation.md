# pieceofcake2 フォークのインストール

::: pieceofcake2
このページは **pieceofcake2 フォーク** 固有の内容で、本家 CakePHP 2.x のドキュメントには含まれません。
:::

## 動作要件

- PHP 8.0, 8.1, 8.2, 8.3, 8.4, 8.5
- [Composer](https://getcomposer.org/)。Composer を使わないインストール（アーカイブの展開、
  `CAKE_CORE_INCLUDE_PATH` や `include_path` の設定）は **サポートしません**。
- 対応データベースのいずれか
  - MySQL 5.6, 5.7, 8.0 以降（`pdo_mysql`）
  - PostgreSQL 9.4 以降（`pdo_pgsql`）
  - SQLite 3（`pdo_sqlite`）
  - Microsoft SQL Server 2022 以降（`pdo_sqlsrv`）

PHP 拡張:

- `mbstring`: **強く推奨**。無い場合は Symfony の polyfill を使いますが、polyfill には
  `mb_encode_mimeheader()` が無いため、`CakeEmail` はヘッダーのエンコードに
  `Multibyte::mimeEncode()` を使います。
- `intl`: 任意。`strftime()` の代わりに `IntlDateFormatter` を使います。拡張が無い場合は
  Symfony の polyfill を使います。
- `openssl`: 任意。SSL/TLS 接続と AES 暗号化に必要です。
- `mcrypt`: 任意（PHP 7.1 以降は非推奨）。旧来の AES 暗号化でのみ使います。

::: info
このフォークは CakePHP **2.10.24** をベースにしています。それより古い 2.x を使っている場合は、
まず PHP 7.4 上で `cakephp/cakephp:2.10.24` に上げてください。
[アップグレードガイド](/ja/pieceofcake2/upgrade) を参照してください。
:::

## Composer でインストールする

```bash
composer require pieceofcake2/cakephp
```

または `composer.json` に追加して `composer update` を実行します。

```json
{
    "require": {
        "pieceofcake2/cakephp": "^2.12"
    }
}
```

既存のアプリケーションを移行する場合は、`require` から `cakephp/cakephp` を削除し、
代わりに `pieceofcake2/cakephp` を追加します。

### `replace` の仕組み

`pieceofcake2/cakephp` の `composer.json` には `"replace": {"cakephp/cakephp": "^2.0"}`
が宣言されています。そのため Composer はこのパッケージを `cakephp/cakephp` として扱い、
`cakephp/cakephp:^2.x` に依存するプラグインやパッケージもそのままインストールでき、動作します。
両方のパッケージを同時に require しないでください。

## インストール後の作業

このフォークは Composer のオートローダー経由でのみフレームワークを読み込むため、
アプリケーションのディスパッチャーファイル（`index.php`、`test.php`、コンソールの `cake`）を
更新する必要があります。

### レガシー構成（`app/` ディレクトリ）

アプリケーションスケルトンを含む Bake プラグインをインストールし、そこからディスパッチャーファイルを
コピーします。

```bash
# Bake プラグインをインストール
composer require --dev pieceofcake2/bake

# Web 用ディスパッチャーをコピー
cp plugins/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp plugins/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php

# コンソール用ディスパッチャーをコピー
cp plugins/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake

# 古いディスパッチャーファイルがあれば削除
rm -f app/Console/cake.bat app/Console/cake.php
```

::: tip
上記のパスは、Composer が CakePHP プラグインを `plugins/` にインストールする前提です。
プロジェクトの `installer-paths` 設定が異なる場合は、`plugins/Bake/` の部分を読み替えてください。
:::

### モダン構成（`src/` ディレクトリ）

CakePHP 5 風の構成（プロジェクト直下に `config/`、`src/`、`templates/`、`webroot/`）を
使うアプリケーションでは、次のファイルが必要です。

- `config/define.php`
- `bin/cake`
- `webroot/index.php`
- `webroot/test.php`

これらは [pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンからコピーしてください。
構成の全体像は [ディレクトリ構成](/ja/pieceofcake2/directory-structure) を参照してください。

モダン構成では、自分のクラスも Composer の classmap でオートロードできます。

```json
{
    "autoload": {
        "classmap": ["src/"]
    }
}
```

クラスファイルを追加したら `composer dump-autoload` を実行してください。

## Bake プラグイン

Bake（コード生成）はコアから削除され、
[pieceofcake2/bake](https://github.com/pieceofcake2/bake) として提供されています。

```bash
composer require --dev pieceofcake2/bake
```

`app/Config/bootstrap.php`（レガシー構成）または `config/bootstrap.php`（モダン構成）で
読み込みます。

```php
CakePlugin::load('Bake');
```

1.3 から 2.0 へのアップグレード用の `UpgradeShell` も
[pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade) に移りました。
ほとんどのアプリケーションでは不要です。

## スケルトンから新しいプロジェクトを作る

アプリケーションスケルトンは [pieceofcake2/app](https://github.com/pieceofcake2/app)
として提供されており、モダン構成を採用しています。

::: warning
新規プロジェクトを CakePHP 2.x で始めないでください。
[CakePHP 5.x](https://book.cakephp.org/5/ja/) を使ってください。スケルトンは主に、
既存アプリケーションを移行する際の参考実装です。
:::

## 次に読むページ

- [アップグレードガイド](/ja/pieceofcake2/upgrade): CakePHP 2.10.24 からの破壊的変更
- [ディレクトリ構成](/ja/pieceofcake2/directory-structure): レガシー構成とモダン構成
- [セキュリティ](/ja/pieceofcake2/security): セキュリティ修正と推奨設定
