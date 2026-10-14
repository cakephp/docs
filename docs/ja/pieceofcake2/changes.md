# 本家ドキュメントからの変更点

このドキュメントは CakePHP 2.x のクックブックをもとにしています。このページでは、Piece of Cake 2 フォーク上の
CakePHP 2 と本家の CakePHP 2.10.24 との違いをまとめ、本家のドキュメントから変更したページを一覧にしています。

## CakePHP 2.10.24 との違い

| 項目 | 本家 CakePHP 2.10.24 | Piece of Cake 2 フォーク | 参照 |
|------|----------------------|--------------------------|------|
| PHP | PHP 5.3〜7.4 | PHP 8.0〜8.5 | [インストール](/ja/installation) |
| インストール | アーカイブのダウンロード、PEAR、Composer | Composer のみ（`pieceofcake2/cakephp`） | [インストール](/ja/installation) |
| Composer でのプラグイン | 任意 | `composer/installers` の設定が必須 | [composer.json の設定](/ja/installation#configuring-composer-json) |
| アプリケーションの構成 | `app/` | モダン構成（`src/`、`templates/`、`config/` など）または `app/` | [CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure) |
| フレームワークの配置 | `lib/Cake/` | `vendor/pieceofcake2/cakephp/src/Cake/` | [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) |
| クラスの読み込み | `App::uses()` | Composer の classmap。`App::uses()` は Composer が知らないクラスにのみ使用 | [コントローラ](/ja/controllers#autoloading-classes) |
| Bake | コアのシェル | [pieceofcake2/bake](https://github.com/pieceofcake2/bake) プラグイン | [Bake でコード生成](/ja/console-and-shells/code-generation-with-bake) |
| UpgradeShell | コアのシェル | [pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade) プラグイン | [アップグレードシェル](/ja/console-and-shells/upgrade-shell) |
| キャッシュエンジン | Xcache と Wincache を含む | Xcache と Wincache を削除 | [キャッシュ](/ja/core-libraries/caching) |
| テスト | PHPUnit 3.7 | PHPUnit 9.6 | [テスト](/ja/development/testing) |
| コーディング規約 | CakePHP 2 の規約（タブ、`array()`） | CakePHP 5 の codesniffer（4 スペース、`[]`） | [コーディング規約](/ja/contributing/cakephp-coding-conventions) |
| CSRF 対策 | 署名なしのトークン。一部のメソッドは検証されない | HMAC で署名したトークン。GET・HEAD・OPTIONS 以外はすべて検証 | [脆弱性への対応](/ja/appendices/security-fixes) |
| SSL 証明書 | 同梱の `cacert.pem`（2016年） | システムの CA バンドルまたは composer/ca-bundle | [脆弱性への対応](/ja/appendices/security-fixes) |
| `String` クラス | `CakeText` の別名 | 削除。`CakeText` を使用 | [CakeText](/ja/core-utility-libraries/string) |
| `'readFile' => false` を指定した `Xml::build()` | `https://` の URL は取得される (SSRF) | ファイルも URL も読み込まない | [脆弱性への対応](/ja/appendices/security-fixes#xml-build-ssrf) |
| `$components` での CookieComponent の `'type'` | 無視される（常に `'cipher'`） | 反映される | [Cookie](/ja/core-libraries/components/cookie) |
| `cake server` のデフォルトポート | 80 | 8765 | [インストール](/ja/installation#development-server) |

破壊的変更の一覧は [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) と
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md) を参照してください。

## このドキュメントで変更したページ

以下の変更に加えて、すべてのサンプルコードは CakePHP 5 のコーディング規約（短い配列構文、
クラスとメソッドの波括弧を次の行に置く書き方）に合わせ、パスはモダンなディレクトリ構成で記載しています。

### 新しいページ

- [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10)
- [モダン構成への移行](/ja/appendices/migrating-to-the-modern-layout)
- [脆弱性への対応](/ja/appendices/security-fixes)
- [PHPUnit 9.6 への移行](/ja/appendices/phpunit-9-migration-hints)
- [メンテナンスされているプラグイン](/ja/plugins/maintained-plugins)

### はじめに

- [インストール](/ja/installation)
  - 動作要件: PHP 8.0〜8.5、Composer、MySQL 5.6 以上など対応 DB、mbstring/intl/openssl の説明
  - `composer create-project pieceofcake2/app` による新規作成 (モダンな構成) と database.php、salt/cipherSeed の設定
  - 既存アプリケーション: cakephp/cakephp を pieceofcake2/cakephp に置き換え、ディスパッチャファイルを更新
  - アーカイブ/git でのダウンロード、include_path によるコア共有、サブディレクトリでの開発用設定を削除
  - パーミッションの対象を tmp/ と logs/ に変更、ビルトインサーバ (`bin/cake server`) と webroot/ 向けバーチャルホストの例を追加
  - ビルトインサーバのデフォルトポートは 8765 (v2.12.3 より前は 80 だったことを変更点として記載)
  - 「composer.json の設定」を追加: 最小限の composer.json、cakephp-plugin パッケージのために composer/installers の allow-plugins と plugins/{$name}/ への installer-paths が必須であることを説明
- [応用インストール](/ja/installation/advanced-installation)
  - PEAR でのインストール、旧来の Composer/bake によるプロジェクト作成、CAKE_CORE_INCLUDE_PATH によるコア共有を削除
  - Composer 設定の詳細を追加: replace、プラグインの installer-paths、classmap オートロード、exclude-from-classmap
  - パスの変更は config/define.php (ROOT、APP_DIR、WEBROOT_DIR、WWW_ROOT、VENDORS) で行う方法に書き換え、webroot を移動する例を追加
- [URLリライティング](/ja/installation/url-rewriting)
  - 例はドキュメントルートを webroot/ とする前提に変更、.htaccess をスケルトンの内容に更新、従来の構成の .htaccess は簡単な説明のみに
  - nginx の例を PHP-FPM ソケット向けに更新、IIS の web.config を webroot/ に配置、リンク切れ (Web Platform Installer、virtualhostx、Apache wiki) を削除
- [CakePHP の規約](/ja/getting-started/cakephp-conventions)
  - ファイルの場所を src/ と templates/ に変更、String::uuid を CakeText::uuid() に変更
- [CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure)
  - モダンな構成 (bin、config、logs、plugins、resources/locales、src、templates、tests、tmp、vendor、webroot) の説明に書き換え、従来の app/ との対応表を追加
  - 従来の app/ 構成からモダンな構成へ移行する手順を追加
- [CakePHP の構造](/ja/getting-started/cakephp-structure)
  - AppController/AppHelper/AppModel、ルート、レイアウト、エレメントのパスをモダンな構成に変更
  - 例を非推奨の EmailComponent と JsHelper から AuthComponent と FormHelper に変更

### CakePHP 概要

- [CakePHPって何？使う理由は？](/ja/cakephp-overview/what-is-cakephp-why-use-it)
  - 機能一覧を PHP 8.0〜8.5、Bake プラグイン、Composer に更新、Bake がコアから分離された旨を記載
- [情報の探し方](/ja/cakephp-overview/where-to-get-help)
  - Piece of Cake 2 の GitHub Issue を追加、IRC (freenode) と Google グループを削除、テストケースの場所を更新

### コントローラー

- [コントローラ](/ja/controllers)
  - パスをモダンレイアウト (src/Controller、templates/、plugins/) に変更し、従来の app/ レイアウトは補足として記載
  - 「クラスの読み込み」節を追加: Composer の classmap オートロードにより App::uses() が不要になること、引き続き必要な場合
- [リクエストとレスポンスオブジェクト](/ja/controllers/request-response)
  - ディスパッチャのパスを webroot/index.php に変更し、レスポンスのモック例を PHPUnit 9 の getMockBuilder() に変更
- [ページコントローラ](/ja/controllers/pages-controller)
  - パスを src/Controller と templates/Pages に変更し、コピー元を lib/Cake から app スケルトンまたは Bake プラグインに変更
- [Scaffolding](/ja/controllers/scaffolding)
  - パスを src/Model、config/core.php、templates/ に変更し、Bake をプラグインとして案内
- [コンポーネント](/ja/controllers/components)
  - コンポーネントのパスを src/Controller/Component に変更し、サンプルから App::uses() を削除、コードスタイルを修正

### ビュー

- [ビュー](/ja/views)
  - テンプレート、レイアウト、エレメントのパスを templates/ に、ビュークラスを src/View に変更し、従来の app/View との対応表を掲載
  - 冒頭の Flash/AMF や SOAP の例を削除し、TwigView プラグインへのリンクを追加
  - エレメントキャッシュの例の構文エラーを修正し、独自ビュークラスの例から App::uses() を削除
- [メディアビュー](/ja/views/media-view)
  - サンプルのパスを ROOT と WWW_ROOT で指定するよう変更し、相対パスが webroot ではなく APP 基準で解決されることを訂正
- [JSONとXMLビュー](/ja/views/json-and-xml-views)
  - サンプルのビューファイルのパスを templates/Posts/json/index.ctp に変更
- [テーマ](/ja/views/themes)
  - テーマのパスを templates/Themed と webroot/ に変更し、プラグインのアセットの例を plugins/ に変更
- [ヘルパー](/ja/views/helpers)
  - ヘルパーのパスを src/View/Helper に変更し、サンプルから App::uses() を削除して classmap オートロードの説明を追加、Bakery への言及をプラグイン一覧へのリンクに変更

### モデル

- [モデル](/ja/models)
  - モデルと AppModel は `src/Model/` に配置、AppModel はコアに含まれない、`App::uses()` は classmap を使わない場合のみ必要
- [アソシエーション: モデル同士を繋ぐ](/ja/models/associations-linking-models-together)
  - モデルファイルのパスを src/Model/ に変更
- [データを保存する](/ja/models/saving-your-data)
  - 例のファイルコメントを src/Controller/ と templates/ に変更
- [データバリデーション](/ja/models/data-validation)
  - ローカライズしたバリデーションクラスは src/Validation (classmap または App::uses() で読み込み)、Localized プラグインのリンクを pieceofcake2/localized に変更、Windows/mod_php の注記を削除
- [コールバックメソッド](/ja/models/callback-methods)
  - 例のパスを src/Model/ に変更
- [ビヘイビア](/ja/models/behaviors)
  - ビヘイビアは src/Model/Behavior、コアのビヘイビアは vendor/pieceofcake2/cakephp/src/Cake/Model/Behavior
  - コミュニティのビヘイビアは CakePHP Bakery ではなくメンテナンスされているプラグインへのリンクに変更
- [データソース](/ja/models/datasources)
  - 対応データベース・バージョン・PDO エクステンションの表、「接続設定」節を追加 (config/database.php、DSN での encoding、PostgreSQL の sslmode、PHP 8.1 のネイティブ型と ATTR_STRINGIFY_FETCHES)
  - SQL Server: Windows 専用の Native Client ではなく ODBC ドライバ、port・schema (デフォルト dbo)・options・persistent の設定を説明
  - データソースの例とプラグインのパスを src/Model/Datasource と plugins/ に変更
  - 旧 cakephp/datasources リポジトリの代わりに pieceofcake2/datasources プラグインへリンク
- [モデルの属性](/ja/models/model-attributes)
  - データベース設定ファイルのパスを config/database.php に変更

### コアライブラリ

- [キャッシュ](/ja/core-libraries/caching)
  - エンジン一覧から Xcache と Wincache を削除 (変更点の注記あり)。Apc エンジンは APCu を使うと説明
  - 設定ファイルのパスを config/bootstrap.php、config/core.php、src/Lib/Cache/Engine に変更。PHP 5.3 に関する記述を削除
- [イベントシステム](/ja/core-libraries/events)
  - 例のパスを src/Lib/Event、config/bootstrap.php、config/events.php に変更。App::uses と PHP 5.3 の記述を削除し、Composer のクラスマップによるオートロードを説明
- [グローバル定数およびグローバル関数](/ja/core-libraries/global-constants-and-functions)
  - パス定数をモダンレイアウトの値で説明 (APP=src/、CONFIG=config/、TESTS=tests/、TMP=tmp/、LOGS=logs/、WWW_ROOT=webroot/)。レガシーの app/ の値は一度だけ言及
  - CAKE、CAKE_CORE_INCLUDE_PATH、CORE_PATH は vendor/pieceofcake2/cakephp/src を指すと説明。新しい CORE_ROOT 定数を追加
- [国際化と地域化](/ja/core-libraries/internationalization-and-localization)
  - ロケールファイルの場所を resources/locales に変更 (レガシーの app/Locale も検索される)。プラグインの翻訳は plugins/&lt;Plugin>/Locale
  - モダンレイアウト向けの i18n extract の例を追加: bin/cake i18n extract --paths src,templates --output resources/locales
- [ロギング](/ja/core-libraries/logging)
  - デフォルトのログディレクトリを logs/ (LOGS 定数) に変更。独自ログエンジンは src/Lib と plugins/ に配置。例から App::uses を削除
- [Translate](/ja/core-libraries/behaviors/translate)
  - i18n テーブル初期化コマンドを bin/cake i18n に変更
- [Tree](/ja/core-libraries/behaviors/tree)
  - 例のパスを src/Model/Category.php に変更
- [アクセス制御リスト](/ja/core-libraries/components/access-control-lists)
  - パスを config/ (core.php、acl.ini.php、database.php、Schema/db_acl.sql) に変更。コマンドは bin/cake。コアのモデルは vendor/pieceofcake2/cakephp/src/Cake/Model
- [認証](/ja/core-libraries/components/authentication)
  - 独自の認証・認可・ハッシャークラスを src/Controller/Component/Auth に配置。レイアウトは templates/Layouts。App::uses を削除
- [Cookie](/ja/core-libraries/components/cookie)
  - 例で type('aes') と Security.useOpenSsl を使用。デフォルトの 'cipher' は脆弱で 'rijndael' は mcrypt が必要という警告を追加
  - タイプは `$components` の `'Cookie' => ['type' => 'aes']` で設定 (type() でも設定可能)。v2.12.3 より前はこの設定が無視されていたことを変更点として記載。pieceofcake2/app v2.3.1 のスケルトンでは Security.useOpenSsl が有効
- [フラッシュ](/ja/core-libraries/components/flash)
  - フラッシュ用エレメントの場所を templates/Elements/Flash に変更
- [セキュリティ](/ja/core-libraries/components/security-component)
  - 変更点の注記: CSRF トークンの HMAC 署名 (CVE-2020-15400) と _method で上書きしたリクエストの検証 (CVE-2015-8379)
- [CacheHelper](/ja/core-libraries/helpers/cache)
  - Cache.check の設定場所を config/core.php に変更
- [FlashHelper](/ja/core-libraries/helpers/flash)
  - フラッシュ用エレメントは templates/Elements/Flash。コアの default/success/error エレメントはアプリケーション側で上書きできると説明
- [JsHelper](/ja/core-libraries/helpers/js)
  - パスを webroot/js と templates/Layouts に変更。PHP4/PHP5 のメソッドチェーンに関する記述を削除
- [PaginatorHelper](/ja/core-libraries/helpers/paginator)
  - 例のパスを templates/Posts/index.ctp に変更
- [RssHelper](/ja/core-libraries/helpers/rss)
  - パスを config/routes.php、templates/Layouts/rss、templates/Posts/rss に変更
- [TextHelper](/ja/core-libraries/helpers/text)
  - String クラスへの言及を CakeText に変更
- [TimeHelper](/ja/core-libraries/helpers/time)
  - タイムゾーンの設定場所を config/core.php に変更

### コアユーティリティライブラリ

- [App クラス](/ja/core-utility-libraries/app)
  - クラスのローディングを Composer の classmap オートロード前提に書き直し、App::uses() は Composer が把握しないクラス (classmap なしのアプリケーションクラス、Composer 非対応プラグイン) にのみ必要
  - コアクラスのオーバーライドは src/Lib に置き App::uses() で登録、exclude-from-classmap の注意を追加
  - ベンダーファイル: Composer のライブラリは読み込み不要、手作業で置くファイルは vendors/、プラグインのパスは plugins/、CakePHP 1.3 から 2.0 への移行に関する記述を削除
- [CakeEmail](/ja/core-utility-libraries/email)
  - 設定は config/email.php、テンプレートは templates/Emails と templates/Layouts/Emails、独自トランスポートは src/Lib/Network/Email、EmailComponent との比較と App::uses() を削除
  - Gmail は廃止された「安全性の低いアプリ」設定の代わりにアプリパスワードを使用、STARTTLS の例はポート 587、MailTransport::_mail() の型付きシグネチャの変更点を注記
- [Folder & File](/ja/core-utility-libraries/file-folder)
  - Folder と File はオートロードされるため App::uses() を削除
- [Hash](/ja/core-utility-libraries/hash)
  - natural ソートの PHP 5.4 要件の記述を削除
- [HttpSocket](/ja/core-utility-libraries/httpsocket)
  - CA 証明書 (システムの CA バンドルと composer/ca-bundle へのフォールバック) を本文で説明、独自レスポンス・認証クラスは src/Lib/Network/Http に置き HttpSocketResponse を継承、App::uses() と Bakery の URL を削除
- [CakeNumber](/ja/core-utility-libraries/number)
  - 例から不要な App::uses() を削除
- [データのサニタイズ](/ja/core-utility-libraries/sanitize)
  - Sanitize は CakePHP 3.0 以降に存在しないと記述 (「削除予定」から変更)
- [Security](/ja/core-utility-libraries/security)
  - mcrypt は PHP 7.2 以降同梱されないため config/core.php で Security.useOpenSsl を有効にすること (互換の形式)、rijndael() は PECL の mcrypt が必要、Cookie の 'cipher' タイプへの警告を本文で説明
  - pieceofcake2/app のスケルトン (v2.3.1 以降) では Security.useOpenSsl が有効になっていることを追記
- [Set](/ja/core-utility-libraries/set)
  - テストファイルのパスを tests/TestCase/Utility/SetTest.php に変更
- [CakeText](/ja/core-utility-libraries/string)
  - String クラスの非推奨の説明と例の App::uses() を削除し、String クラス削除の変更点を 1 つの注記にまとめた
- [CakeTime](/ja/core-utility-libraries/time)
  - strftime() 形式のフォーマットを本文で説明 (php81_bc/strftime 経由の IntlDateFormatter、英語以外には intl が必要)、例の構文エラーを修正し App::uses() を削除
- [XML](/ja/core-utility-libraries/xml)
  - CakePHP 1.3 の「今までの方法」との比較と App::uses() を削除、Xml::build() のオプション (return、デフォルト false の loadEntities、readFile、parseHuge) とユーザー入力を渡す際の警告を追記、誤った例を修正
  - `readFile` でファイルと URL の両方の読み込みを無効にできることを記載し、ユーザー入力の例で `'readFile' => false` を使用。v2.12.3 より前は https の URL が取得されていたことを変更点として記載

### コンソール & シェル

- [シェルとタスクとコンソール](/ja/console-and-shells)
  - コンソールは `bin/cake` (または `vendor/bin/cake`) で起動し、シェルは `src/Console/Command/` に置く形に変更。レガシーの `app/Console/cake` は補足のみ
  - コンソールの起動メッセージとコアシェル一覧を v2.12.2 の内容に更新 (bake と upgrade はプラグインに移動)
  - `lib/Cake/Console` をシステムパスに追加する手順 (Windows の手順、cake.bat) を削除
  - タスクの動的ロードの例を、コアから削除された ProjectTask ではなくアプリケーションのタスクに変更
- [Bakeでコード生成](/ja/console-and-shells/code-generation-with-bake)
  - pieceofcake2/bake プラグイン向けに書き直し: Composer でのインストール、`CakePlugin::load('Bake')`、`bin/cake bake` コマンド
  - Bake がモデル、コントローラ、ビュー、テスト、フィクスチャを書き出す場所をモダンレイアウトとレガシーレイアウトについて記載 (pieceofcake2/bake 1.0.3 以降では templates/、tests/TestCase/、tests/Fixture/)
  - bake テーマの場所を更新 (`plugins/Bake/Console/Templates/default`、`src/Console/Templates/[theme]`)。`lib/Cake/Console/Templates` の記述を削除
- [スキーマの管理とマイグレーション](/ja/console-and-shells/schema-management-and-migrations)
  - コマンドを `bin/cake schema` に変更。スキーマファイルの場所を `config/Schema` に変更
- [ACLShell](/ja/console-and-shells/acl-shell)
  - コマンドを `bin/cake` に変更
- [Completion シェル](/ja/console-and-shells/completion-shell)
  - コマンドを `bin/cake` に変更。Bake プラグインのシェルは `Bake.bake` として例示し、コマンド一覧からコアの `bake`/`upgrade` を削除
- [cronjobに登録してシェルを実行する](/ja/console-and-shells/cron-jobs)
  - cron の例を `cd /path/to/my_app && bin/cake` に変更
- [Shell ヘルパー](/ja/console-and-shells/helpers)
  - 独自ヘルパーの例を修正: クラス名とファイル名には `ShellHelper` サフィックスが必要 (`src/Console/Helper/HeadingShellHelper.php`)、`App::uses()` は不要
  - `output()` の例で引数を配列で渡すように修正 (文字列やクロージャを直接渡すと PHP 8 で TypeError になる)
- [I18N シェル](/ja/console-and-shells/i18n-shell)
  - 抽出の例で `src` と `templates` をスキャンし `resources/locales` に出力するよう変更。この場合モデルのバリデーションメッセージは抽出されない点を追記
- [テストシェル](/ja/console-and-shells/testsuite-shell)
  - `bin/cake test app AllTests` の例と、Composer でインストールする PHPUnit 9.6 の説明を追加
- [アップグレードシェル](/ja/console-and-shells/upgrade-shell)
  - pieceofcake2/upgrade プラグイン向けに書き直し (Composer でインストールし `CakePlugin::load('Upgrade')` でロード)。手動でダウンロード・コピーする手順を削除

### 開発

- [構成設定](/ja/development/configuration)
  - 設定ファイルを `config/` 基準で説明 (core、bootstrap、database、routes、email、acl、Schema)。レガシーの `app/Config/` と `CONFIG` 定数は本文で説明
  - データベース: 組み込み PDO ドライバーを列挙、`encoding` は DSN で渡す、`flags` (PHP 8.1 の `ATTR_STRINGIFY_FETCHES`)、`schema` (PostgreSQL/SQL Server)、`sslmode`、`options` を追加、PHP 5.3.7 の記述を削除
  - 変更点: SQL Server ドライバーは SQL Server 2022 以降が対象、`port`/`schema`/`options` の扱い
  - クラスの読み込みを Composer classmap 前提で書き直し (`composer dump-autoload`、`App::uses()` はオートロード非対応プラグインのみ)。フレームワークの classmap 移行を変更点として記載
  - コア設定: Session のサブキー `name` を `cookie` に修正、`cacheLimiter` を追加、ハンドラーとスキーマのパスと `bin/cake` をモダン構成に。App.baseUrl 用の .htaccess 削除を構成別に記載
  - セキュリティ: `Security.salt` の用途を記載し、CSRF トークンの HMAC 署名を変更点として記載。`cipherSeed` は脆弱な Cookie 'cipher' 専用。`Security.useOpenSsl` を追加 (PHP 8 で encrypt()/Cookie 'aes' に必須。pieceofcake2/app v2.3.1 のスケルトンでは有効)
  - キャッシュ: 使用可能なエンジンを列挙 (File、Apc/APCu、Memcached、Memcache、Redis)。Xcache/Wincache の削除を変更点として記載
  - 設定リーダー: デフォルトの読み込み先は `CONFIG`。独自リーダーの例を `src/Lib/Configure` に移し、プロパティを宣言 (PHP 8.2)、`App::uses()` を削除。ja の例のクラス名を PHP の XMLReader と衝突する `XmlReader` から `MyXmlReader` に変更。ConfigReaderInterface/ConfigureException の説明を修正
  - Inflector のパス `src/Cake/Utility/Inflector.php` と `config/bootstrap.php` を本文に反映。古い IE/Chrome Frame や AMF/SOAP の例を更新。ja: `$merge` の説明を修正し `Configure::consume()` を追加
- [ルーティング](/ja/development/routing)
  - ルート設定ファイルのパスを config/routes.php に変更（従来の app/Config/routes.php はフォルダ構造ページへのリンク付きで併記）
  - 組み込みルートの場所を vendor/pieceofcake2/cakephp/config/routes.php に修正し、無効化は config/routes.php の require 行を削除すると説明
  - プレフィックスルーティング: Routing.prefixes は config/core.php、ビューは templates/Users/admin_edit.ctp
  - カスタムルートクラスは src/Routing/Route に置き、App::uses() ではなく Composer の classmap（composer dump-autoload）でオートロード
  - コード例: パスのコメントを新レイアウトに統一し、渡された引数の例を正しい PHP クラスに修正
  - ja: 他のページからのリンクが機能するよう明示的なアンカー (routes-configuration、connecting-routes、route-elements、prefix-routing、route-conditions、passed-arguments、named-parameters) を追加
- [セッション](/ja/development/sessions)
  - パスをモダン構成に更新 (`tmp/sessions`、`src/Model/Datasource/Session/`、`config/Schema/sessions.php`、`bin/cake schema create sessions`)。レガシーのパスは本文で補足
  - ハンドラーの例を修正: callable は 6 つ、`userAgent` ではなく `checkAgent`、ini キーに `session.` を付与。callable 形式が PHP 8.4 で非推奨であることを記載
  - 変更点: `SessionHandlerAdapter` によりハンドラーが `session.use_strict_mode` (PHP 8.6 でデフォルト) に対応。独自の `read()`/`destroy()` への要件を記載
  - キャッシュセッションの説明から Xcache を削除 (APCu、Memcached、Redis)。ComboSession の例は APCu を使い `App::uses()` を削除、モダン構成のパスに。コードブロックを PHP 指定に修正
- [ディスパッチャー・フィルター](/ja/development/dispatch-filters)
  - フィルターは config/bootstrap.php で設定し、アプリのフィルタークラスは src/Routing/Filter、プラグインのものは plugins/MyPlugin/Routing/Filter に配置
  - フレームワーククラスの App::uses() と PHP 5.3 のクロージャに関する注記を削除し、composer dump-autoload と設定付き指定時の class_exists() 要件を追記
  - 例の不正なクロージャ記述と崩れたマークアップを修正
  - （日本語版）優先度とプラグイン記法に関する誤訳を修正
- [例外(Exception)](/ja/development/exceptions)
  - 組み込み例外の一覧で欠けていた例外クラス名を表形式で復元
  - パスをモダン構成（templates/Errors、templates/Layouts、src/Lib/Error、config/core.php）に変更し、Exception.skipLog を追記
  - 例外ハンドラはすべての Throwable を受け取ることを説明し、例を Throwable 型に変更、PHP 5.3 の注意書きとフレームワーククラスの App::uses() を削除
  - 変更点: Composer クラスマップのため、アプリでの CakeErrorController の上書きは確実ではない。_getController() を使う
- [エラーハンドリング](/ja/development/errors)
  - パスと例をモダン構成（config/core.php、config/bootstrap.php、src/Lib/AppError.php）に変更
  - Error.extraFatalErrorMemory とエラーの出力先（logs/error.log、logs/debug.log）を追記
  - 変更点: PHP 8 で @ 抑制を正しく扱うため、デフォルトハンドラは error_reporting() & $code で判定
  - PHP 7/8 の Error オブジェクト（TypeError など）は例外ハンドラに渡ること、PHP 8 では $context が渡されないことを説明
  - PHP 5.3 の注意書きを削除し、ハンドラの例を PHP 8 向けに更新
- [デバッグ](/ja/development/debugging)
  - debug() のシグネチャを更新し、trace/excerpt の例をフォークのパスに変更、invoke() を getInstance() に置き換え
  - ログの出力先を logs/（debug.log/error.log）に変更し、Object を CakeObject に、App::uses('CakeLog') を削除
  - DebugKit: pieceofcake2/debug_kit を Composer でインストールし、config/bootstrap.php で読み込む。フォークの DebugKit のドキュメントへのリンクを追加
- [テスト](/ja/development/testing)
  - PHPUnit 9.6 を Composer (require-dev) でインストール。PHPUnit 3.7/4.x/5.x、.phar、オートローダー回避策の手順を削除
  - テストケースは tests/TestCase、フィクスチャは tests/Fixture、設定は config/ に変更。レガシーな app/Test 構成は代替として記載
  - テストの実行: phpunit.xml.dist (tests/bootstrap.php、CakeFixtureInjector リスナー、stderr) を使う vendor/bin/phpunit と bin/cake test を説明。lib/Cake/Console/cake と --app の例を削除
  - テストケースの一覧表示 (ケース指定なしの bin/cake test app、ウェブランナーの一覧) は tests/TestCase を探し、無ければ Test/Case を探す
  - ウェブランナー: スケルトンの webroot/test.php、?case= でケースを指定して実行。コマンドラインでの実行を推奨
  - コード例を PHPUnit 9 向けに更新: setUp()/tearDown(): void、assertStringContainsString、assertIsArray、assertMatchesRegularExpression、willReturn()、PHPUnit\Framework\TestCase
  - createMock()/getMockBuilder()、非推奨の CakeTestCase::getMock()、getMockForModel() のシグネチャ、expectException() の節を追加
  - staticExpects() の例をセッションへの Auth.User 書き込みに置き換え
  - カバレッジには Xdebug か PCOV が必要。出力先を tmp/coverage に変更
  - テストスイートは TESTS . 'TestCase' を使用。phpunit.xml.dist を使う場合 AllTests は不要と記載
  - プラグインのテストは plugins/&lt;Name>/tests/TestCase (Test/Case も可)
  - Jenkins: composer install の手順、config/database.php、vendor/bin/phpunit、jenkins.io へのリンク
- [REST](/ja/development/rest)
  - パスを config/routes.php、src/Controller、templates/Recipes/xml に更新
  - HTTP メソッド上書きの優先順位を修正（X-HTTP-Method-Override ヘッダが _method より優先）
  - ja: custom-rest-routing アンカーを明示的に追加

### チュートリアル & 例

- [チュートリアルと例](/ja/tutorials-and-examples)
  - CakePackages と Bakery へのリンクを、メンテナンスされているプラグインのページへのリンクに置き換え
- [シンプルな認証と承認のアプリケーション](/ja/tutorials-and-examples/blog-auth-example/auth)
  - パスを `src/` と `templates/` に更新。不要な `App::uses()` を削除。UsersController を Bake プラグインで生成したものとして説明
  - `posts.user_id` を `INT UNSIGNED` で追加するよう変更 (MySQL 8 では整数の表示幅が非推奨)
- [ブログチュートリアル](/ja/tutorials-and-examples/blog/blog)
  - セットアップを書き直し: `composer create-project pieceofcake2/app blog`、PHP 8.0 以上、`bin/cake server` によるビルトインサーバ (デフォルトのポートは 8765)。アーカイブのダウンロードと git clone の手順を削除
  - パスを `config/database.php`、`config/core.php`、`tmp/`、`logs/` に更新。MySQL の設定例で `utf8mb4` を使用
  - mod_rewrite の節を短い「Apache を使う場合」の節 (DocumentRoot は `webroot/`) に置き換え
- [ブログチュートリアル - レイヤーの追加](/ja/tutorials-and-examples/blog/part-two)
  - ファイルの配置を `src/Model`、`src/Controller`、`templates/Posts`、`config/routes.php` に変更
  - `view()` と `delete()` の引数を `$id = null` にし、ID がない場合に PHP 8 で ArgumentCountError ではなく NotFoundException になるよう修正
- [ACL を制御するシンプルなアプリケーション - パート2](/ja/tutorials-and-examples/simple-acl-controlled-application/part-two)
  - AclExtras を Composer (`pieceofcake2/acl_extras`) で `plugins/AclExtras` にインストールし、`bin/cake AclExtras.AclExtras` で実行
  - Session のフラッシュメッセージを FlashComponent/FlashHelper に置き換え。`login()` アクションの全体を記載
- [ACLを制御するシンプルなアプリケーション](/ja/tutorials-and-examples/simple-acl-controlled-application/simple-acl-controlled-application)
  - `composer create-project pieceofcake2/app acl` によるセットアップ、`config/bootstrap.php` での Bake プラグインのロード、`bin/cake` コマンド、モダンなパスに変更
  - SQL を MySQL 8 で動くよう修正: 予約語の `groups` をクォートし、整数の表示幅を削除
  - 非推奨の `AuthComponent::password()` の代わりに BlowfishPasswordHasher でパスワードをハッシュ化 (カラムは VARCHAR(255))。パスワードがない場合 beforeSave で触れないよう修正
  - AppController で FlashComponent/FlashHelper をロード (bake したコントローラが使用)。ログインで Flash と `url` 指定の `Form->create()` を使用。CakePHP 2.0 用の `allow('*')` を削除
  - Bake はビューを `templates/<Controller>/` に書き出す (pieceofcake2/bake 1.0.3 以降)。ビューを移動する手順を削除

### プラグイン

- [プラグイン](/ja/plugins)
  - CakePHP 2 プラグインの PHP 8 対応状況を説明し、Piece of Cake 2 がメンテナンスするフォークへのリンクを追加
- [プラグインの作成](/ja/plugins/how-to-create-plugins)
  - プラグインのパスを plugins/ に、ビューの上書きを templates/Plugin に変更し、プラグイン内部の構成とテストディレクトリを説明、プラグインのコードで App::uses() を残す理由を記載
  - Bake のコマンドを Bake プラグインの bin/cake に変更し、欠けていたアセットのプラグイン記法の例を追加、flash/ フォルダを削除
  - 公開方法: plugins.cakephp.org と awesome-cakephp への言及を削除し、composer.json の例 (type cakephp-plugin、composer/installers、installer-name) を追加
- [プラグインのインストール](/ja/plugins/how-to-install-plugins)
  - Composer を標準のインストール方法とし (pieceofcake2/debug_kit の例、plugins/ 用の composer/installers と installer-paths)、手動や Git でのインストールも plugins/ と https の URL に変更
  - プラグインは config/bootstrap.php でロードすることと、プラグインのクラスに App::uses() が必要な場合を記載
  - プラグインを plugins/&lt;Name>/ にインストールするために composer.json の installer-paths と allow-plugins (composer/installers、Composer 2.2 以降) の設定が必須であることを明記
- [プラグインの使い方](/ja/plugins/how-to-use-plugins)
  - プラグインのロードを config/bootstrap.php で行うことと、プラグインの Config/ 内のファイルの場所を記載し、schema コマンドを bin/cake に変更

### 貢献

- [貢献](/ja/contributing)
  - 貢献先は GitHub の pieceofcake2/* リポジトリ (フレームワーク、アプリケーションスケルトン、プラグイン、ドキュメント)
  - 貢献の手順は Organization の CONTRIBUTING.md で説明し、この章のページは概要とその各セクションへのリンクを記載
- [ドキュメント](/ja/contributing/documentation)
  - ドキュメントは pieceofcake2/docs (2.x)、Markdown と VitePress、GitHub Actions でデプロイ、bin/dev-server.sh でローカル確認。メンテナンスは en/ja のみ。Jenkins、IRC、ドキュメントチームのメールを削除
  - reStructuredText/Sphinx のフォーマットガイドを Markdown/VitePress のガイドに置き換え (見出しとアンカー、リンク、コードブロック、アラート、info/pieceofcake2 コンテナ、取り込み)、pieceofcake2/docs の README に記載
- [チケット](/ja/contributing/tickets)
  - Issue は pieceofcake2/* リポジトリへ。報告前に CHANGELOG と移行ガイドを確認。質問は Stack Overflow (IRC と Google グループを削除)
  - セキュリティ問題は SECURITY.md に従い GitHub の非公開の脆弱性報告 (Security タブの Report a vulnerability) で報告。security@cakephp.org を削除
  - 報告の詳細は CONTRIBUTING.md と SECURITY.md へのリンク
- [コード](/ja/contributing/code)
  - セットアップ: PHP 8.0 以上と Composer。PHPUnit 9.6、PHP_CodeSniffer、PHPStan は開発用依存としてインストール。PHP 5.3、mcrypt、PHPUnit 3.7 の要件を削除
  - 「テストの実行」を新設: tests/config/database.php を vendor/pieceofcake2/app/config にコピーし、DB 環境変数でデータベースを選んで vendor/bin/phpunit と vendor/bin/phpcs を実行
  - メンテナンスするブランチは 2.x のみ。upstream/2.x から作業し Pull Request も 2.x に送る。2.next/4.0 の説明と Cake Software Foundation への帰属の記述を削除
  - セットアップ、テストの実行、Pull Request の手順は CONTRIBUTING.md へのリンク
- [コーディング規約](/ja/contributing/cakephp-coding-conventions)
  - CakePHP 5 ベースの規約 (cakephp/cakephp-codesniffer ^5.0、PSR-12) に書き直し: 4 スペース、配列の短縮構文、末尾カンマ、クラス/メソッドの中括弧は次の行、elseif、ヨーダ記法禁止、?? と ?:、定数のアクセス権、ドキュメントブロックのルール
  - phpcs/phpcbf のインストールと実行方法、フレームワークの phpcs.xml にある CakePHP 2 用の除外、pieceofcake2/app のアプリケーション用 phpcs.xml (従来構成のパスも)、本家 CakePHP 2 の規約との違いの表を追加
- [後方互換性ガイド](/ja/contributing/backwards-compatibility)
  - 書き直し: フォークのリリースで変わること (キャッシュエンジン、ディレクトリ構成、オートロードなど互換性のない変更を含んだリリースもある)、移行ガイド。貢献者向けガイドラインは CONTRIBUTING.md へのリンク。本家のセマンティックバージョニングの表を削除
- [CakePHP の開発プロセス](/ja/contributing/cakephp-development-process)
  - フォークのメンテナンス中心のプロセスに書き直し: バージョン番号 (2.10.24.x、2.11.0、2.12.x)。目的、ブランチ、リリースは CONTRIBUTING.md へのリンク。IRC と本家のブランチモデルを削除

### 付録

- [脆弱性への対応](/ja/appendices/security-fixes)
  - `'readFile' => false` を指定した `Xml::build()` の SSRF (2.12.3 で修正) を追加。Cookie のタイプを `$components` で設定。Security.useOpenSsl のスケルトンについての注記
- [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10)
  - v2.12.3 の節を追加 (Xml::build() の SSRF 修正、Cookie の `'type'` 設定、ServerShell のポート、テストケースの一覧、SQL Server の ERRMODE)。Cookie の例で `$components` を使用
- [SimpleTest から PHPUnit 3.7 への移行](/ja/appendices/phpunit-migration-hints)
  - 題を「SimpleTest から PHPUnit 3.7 への移行」に変更し、PHPUnit 9.6 への移行ガイドへのリンクを追加

### 追加トピック

- [デプロイ](/ja/deployment)
  - ドキュメントルート、core.php、プラグインのシンボリックリンクのパスをモダンな構成に変更
  - `composer install --no-dev --optimize-autoloader` と開発用プラグインの条件付き読み込みを追加

### その他

- [Welcome](/ja/index)
  - サポート対象外の警告をフォーク向けに書き換え (本家では EOL、新規は CakePHP 5)
  - PDF/EPUB ダウンロードの案内を削除し、ソースへのリンクとインストールの項目を追加

