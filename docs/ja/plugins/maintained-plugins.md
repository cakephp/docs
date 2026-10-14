# メンテナンスされているプラグイン

[Piece of Cake 2](https://github.com/pieceofcake2) プロジェクトは、フレームワークのフォークに加えて、
関連するリポジトリと、主要な CakePHP 2 プラグインのフォークをメンテナンスしています。
メンテナンスしているプラグインはすべて PHP 8.x に対応しており、CI で
[PHPStan](/ja/development/static-analysis) のレベル 5 によるチェックを行っています。

## コアリポジトリ

- [CakePHP](https://github.com/pieceofcake2/cakephp) - CakePHP 2.x フレームワーク
- [App Skeleton](https://github.com/pieceofcake2/app) - アプリケーションスケルトン
- [Plugin Skeleton](https://github.com/pieceofcake2/plugin) - プラグインスケルトン
- [Bake Plugin](https://github.com/pieceofcake2/bake) - コード生成ツール
- [Upgrade Plugin](https://github.com/pieceofcake2/upgrade) - アップグレード用ユーティリティ（CakePHP 1.3 から 2.0）

## 開発ツール

- [PHPStan CakePHP](https://github.com/pieceofcake2/phpstan-cakephp2) - 静的解析用の PHPStan 拡張
  ([静的解析](/ja/development/static-analysis) を参照してください)
- [E2E Test](https://github.com/pieceofcake2/e2e-test) - PHPUnit と Symfony Panther による
  ブラウザでの E2E テスト (Chrome、PC とスマートフォン)
  ([ドキュメント](https://github.com/pieceofcake2/e2e-test/blob/1.x/docs/README.md) (英語))

## メンテナンスしているプラグイン

### デバッグ

- [DebugKit Plugin](https://github.com/pieceofcake2/debug_kit) - デバッグツールバー
  ([ドキュメント](https://github.com/pieceofcake2/debug_kit/blob/2.x/docs/README.md))

### インフラ

- [Aws Plugin](https://github.com/pieceofcake2/aws) - AWS SDK との連携
- [Bref Plugin](https://github.com/pieceofcake2/bref) - Bref による AWS Lambda へのデプロイ

### ログとモニタリング

- [Monolog Plugin](https://github.com/pieceofcake2/monolog) - Monolog との連携
- [Sentry Plugin](https://github.com/pieceofcake2/sentry) - エラーの追跡とモニタリング

### テンプレート

- [TwigView Plugin](https://github.com/pieceofcake2/twig-view) - Twig テンプレートエンジン
- [CsvView Plugin](https://github.com/pieceofcake2/csv-view) - CSV 用のビュークラス

### ビューヘルパー

- [Markdown Plugin](https://github.com/pieceofcake2/markdown) - Markdown ヘルパー
- [MenuBuilder Plugin](https://github.com/pieceofcake2/menu_builder) - ナビゲーションメニューのヘルパー
- [Vite Plugin](https://github.com/pieceofcake2/vite) - 開発サーバーにも対応した Vite のアセットヘルパー
- [WebpackEncore Plugin](https://github.com/pieceofcake2/webpack-encore) - Webpack Encore のアセットヘルパー

### フォームとバリデーション

- [Xform Plugin](https://github.com/pieceofcake2/xform) - 拡張フォームヘルパー
- [Cakeplus Plugin](https://github.com/pieceofcake2/cakeplus) - フォーム関連のユーティリティと機能拡張
- [Captcha Plugin](https://github.com/pieceofcake2/captcha) - CAPTCHA ウィジェットの表示とサーバー側での検証。
  Cloudflare Turnstile (デフォルト)、Google reCAPTCHA v2/v3、hCaptcha に対応
  ([ドキュメント](https://github.com/pieceofcake2/captcha/blob/1.x/docs/README.md) (英語))

### データベース

- [Datasources Plugin](https://github.com/pieceofcake2/datasources) - 追加のデータソース（CSV / TSV ファイル、配列など）

### 認証と認可

- [Authenticate Plugin](https://github.com/pieceofcake2/authenticate) - 認証クラス
- [AclExtras Plugin](https://github.com/pieceofcake2/acl_extras) - ACL テーブルを管理するコンソールツール

### ファイル

- [Upload Plugin](https://github.com/pieceofcake2/upload) - ファイルアップロードの処理
- [Imagine Plugin](https://github.com/pieceofcake2/imagine) - 画像処理ライブラリのラッパー
- [CakePdf Plugin](https://github.com/pieceofcake2/cakepdf) - PDF の生成

### SEO

- [Seo Plugin](https://github.com/pieceofcake2/seo) - 検索エンジン最適化
- [Sitemap Plugin](https://github.com/pieceofcake2/sitemap) - サイトマップの生成

### 国際化

- [Localized Plugin](https://github.com/pieceofcake2/localized) - ローカライズ用のユーティリティ

## プラグインのインストール

プラグインは Composer でインストールし、通常どおり `CakePlugin::load()` で読み込みます。
パッケージ名や設定方法は各リポジトリの README を参照してください。
[モダン構成](/ja/appendices/migrating-to-the-modern-layout) では、`installer-paths` の設定により
Composer がプラグインを `plugins/` にインストールします。

Composer のオートロードに対応していないプラグインでは、そのクラスに対して引き続き `App::uses()`
が必要です。たとえば `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')` のように書きます。

## コントリビューション

プロジェクトでは、バグ報告（特に PHP 8.x の互換性の問題）、セキュリティ脆弱性の報告、
プルリクエストを歓迎しています。
