# メンテナンスされているプラグイン

[Piece of Cake 2](https://github.com/pieceofcake2) プロジェクトは、フレームワークのフォークに加えて、
関連するリポジトリと、主要な CakePHP 2 プラグインのフォークをメンテナンスしています。
メンテナンスしているプラグインはすべて PHP 8.x に対応しており、CI で
[PHPStan](/ja/development/static-analysis) のレベル 5 によるチェックを行っています。
各名前はそのパッケージのドキュメントサイト (英語) にリンクしています。ドキュメントサイトがないものは
GitHub のリポジトリにリンクしています。

## コアリポジトリ

- [CakePHP](https://github.com/pieceofcake2/cakephp) - CakePHP 2.x フレームワーク
- [App Skeleton](https://pieceofcake2.github.io/app/) - アプリケーションスケルトン
- [Plugin Skeleton](https://github.com/pieceofcake2/plugin) - プラグインスケルトン
- [Bake Plugin](https://pieceofcake2.github.io/bake/) - コード生成ツール
- [Upgrade Plugin](https://pieceofcake2.github.io/upgrade/) - アップグレード用ユーティリティ（CakePHP 1.3 から 2.0）

## 開発ツール

- [PHPStan CakePHP](https://pieceofcake2.github.io/phpstan-cakephp2/) - 静的解析用の PHPStan 拡張
  ([静的解析](/ja/development/static-analysis) を参照してください)
- [E2E Test](https://pieceofcake2.github.io/e2e-test/) - PHPUnit と Symfony Panther による
  ブラウザでの E2E テスト (Chrome、PC とスマートフォン)
  ([E2E テスト](/ja/development/e2e-testing) を参照してください)

## メンテナンスしているプラグイン

### デバッグ

- [DebugKit Plugin](https://pieceofcake2.github.io/debug_kit/) - デバッグツールバー

### インフラ

- [Aws Plugin](https://pieceofcake2.github.io/aws/) - AWS SDK との連携
- [AsyncAws Plugin](https://pieceofcake2.github.io/async-aws/) - AsyncAws との連携
- [Bref Plugin](https://github.com/pieceofcake2/bref) - Bref による AWS Lambda へのデプロイ

### ログとモニタリング

- [Monolog Plugin](https://pieceofcake2.github.io/monolog/) - Monolog との連携
- [Sentry Plugin](https://pieceofcake2.github.io/sentry/) - エラーの追跡とモニタリング

### テンプレート

- [TwigView Plugin](https://pieceofcake2.github.io/twig-view/) - Twig テンプレートエンジン
- [CsvView Plugin](https://pieceofcake2.github.io/csv-view/) - CSV 用のビュークラス

### ビューヘルパー

- [Markdown Plugin](https://pieceofcake2.github.io/markdown/) - Markdown ヘルパー
- [MenuBuilder Plugin](https://pieceofcake2.github.io/menu_builder/) - ナビゲーションメニューのヘルパー
- [Vite Plugin](https://pieceofcake2.github.io/vite/) - 開発サーバーにも対応した Vite のアセットヘルパー
- [WebpackEncore Plugin](https://pieceofcake2.github.io/webpack-encore/) - Webpack Encore のアセットヘルパー

### フォームとバリデーション

- [Xform Plugin](https://pieceofcake2.github.io/xform/) - 拡張フォームヘルパー
- [Cakeplus Plugin](https://pieceofcake2.github.io/cakeplus/) - フォーム関連のユーティリティと機能拡張
- [Captcha Plugin](https://pieceofcake2.github.io/captcha/) - CAPTCHA ウィジェットの表示とサーバー側での検証。
  Cloudflare Turnstile (デフォルト)、Google reCAPTCHA v2/v3、hCaptcha に対応

### データベース

- [Datasources Plugin](https://pieceofcake2.github.io/datasources/) - 追加のデータソース（CSV / TSV ファイル、配列など）

### 認証と認可

- [Authenticate Plugin](https://pieceofcake2.github.io/authenticate/) - 認証クラス
- [AclExtras Plugin](https://pieceofcake2.github.io/acl_extras/) - ACL テーブルを管理するコンソールツール

### ファイル

- [Upload Plugin](https://pieceofcake2.github.io/upload/) - ファイルアップロードの処理
- [Imagine Plugin](https://pieceofcake2.github.io/imagine/) - 画像処理ライブラリのラッパー
- [CakePdf Plugin](https://pieceofcake2.github.io/cakepdf/) - PDF の生成

### SEO

- [Seo Plugin](https://pieceofcake2.github.io/seo/) - 検索エンジン最適化
- [Sitemap Plugin](https://pieceofcake2.github.io/sitemap/) - サイトマップの生成

### 国際化

- [Localized Plugin](https://pieceofcake2.github.io/localized/) - ローカライズ用のユーティリティ

## プラグインのインストール

プラグインは Composer でインストールし、通常どおり `CakePlugin::load()` で読み込みます。
パッケージ名や設定方法は各プラグインのドキュメントサイトを参照してください。
[モダン構成](/ja/appendices/migrating-to-the-modern-layout) では、`installer-paths` の設定により
Composer がプラグインを `plugins/` にインストールします。

Composer のオートロードに対応していないプラグインでは、そのクラスに対して引き続き `App::uses()`
が必要です。たとえば `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')` のように書きます。

## コントリビューション

プロジェクトでは、バグ報告（特に PHP 8.x の互換性の問題）、セキュリティ脆弱性の報告、
プルリクエストを歓迎しています。
