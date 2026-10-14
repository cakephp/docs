# CakePHP 2.10 からの移行

このガイドでは、本家の CakePHP 2.10.24 から pieceofcake2/cakephp へアプリケーションを移行する手順と、
破壊的変更を説明します。内容は [UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md) にもとづいています。

## 前提条件

このフォークに移行する前に、次の条件を満たしていることを確認してください。

- アプリケーションが PHP 7.4 で動作している
- CakePHP 2.10.24 を使っている（それより前のバージョンはサポートしません）
- 依存関係を Composer で管理している

## 本家 CakePHP 2.x からの移行

1. **まず CakePHP 2.10.24 に上げる**: それより古いバージョンを使っている場合は、PHP 7.4 上で
   `cakephp/cakephp:2.10.24` に更新します
2. **PHP 7.4 での互換性を確保する**: PHP 8.x に移行する前に、アプリケーションが PHP 7.4 で
   完全に動作している必要があります
3. **Composer の設定を変更する**: `composer.json` の `cakephp/cakephp` を
   `pieceofcake2/cakephp` に置き換え、プラグインが `app/Plugin/`（モダン構成では `plugins/`）にインストールされるよう
   `composer/installers` の設定を追加します。この設定は必須です。
   [composer.json の設定](/ja/installation#configuring-composer-json) を参照してください。
4. **PHP をアップグレードする**: PHP 8.0 以降に更新します
5. **十分にテストする**: アプリケーションのテストスイートを実行し、互換性を確認します

## v2.12.3

v2.12.3 の変更のうち、すでにフォークで動いているアプリケーションに影響する可能性があるものです。

### `Xml::build()` の `readFile` オプションで https の URL も取得しない ([PR #33](https://github.com/pieceofcake2/cakephp/pull/33))

- **セキュリティ修正 (SSRF)**: `Xml::build($input, ['readFile' => false])` は、括弧が 1 組欠けていたため
  `https://` の URL を取得していました（本家の CakePHP 2.x から引き継いだ不具合です）。
  `'readFile' => false` を指定すると、`http://` と `https://` のどちらの URL も取得せず、`XmlException` を投げます。
  [脆弱性への対応](/ja/appendices/security-fixes#xml-build-ssrf) も参照してください。

**移行:**

- リモートからの読み込みを無効にするために `'readFile' => false` を指定している場合は、対応不要です。
  ドキュメントどおりに動作するようになりました。
- `'readFile' => false` を指定したまま `Xml::build()` に `https://` の URL を取得させていた場合は、
  オプションを削除する（既定値は `true`）か、`HttpSocket` などで自分で文書を取得して XML 文字列を渡してください。

### CookieComponent が `'type'` の設定を反映する ([PR #34](https://github.com/pieceofcake2/cakephp/pull/34))

- `CookieComponent` は `$components` で指定した `'type'`（例: `'Cookie' => ['type' => 'aes']`）を反映するようになりました。
  これまではこの設定が黙って無視され、Cookie は安全でないデフォルトの `'cipher'` で暗号化されていました。

**移行:**

- コントローラーの `$components` で `'type'` を設定している場合、Cookie はそのタイプで書き込まれるようになり、
  `'cipher'` で書き込まれた既存の Cookie は復号できなくなります。他の暗号化タイプの変更と同じように切り替えを計画してください。
- `'aes'` を使う場合、mcrypt 拡張がインストールされていなければ `Configure::write('Security.useOpenSsl', true);`
  を設定してください（[OpenSSL を有効にする](#enable-openssl) を参照）。
- 不正な `'type'` を設定すると、`CookieComponent::type()` と同じく `E_USER_WARNING` を発生させ、`'cipher'` を使います。

### テストケースの一覧が `tests/TestCase` 構成に対応 ([PR #35](https://github.com/pieceofcake2/cakephp/pull/35))

- `CakeTestLoader::generateTestList()` は、アプリケーションとプラグインの `tests/TestCase` からテストケースを探し、
  無ければレガシー構成の `Test/Case` を探すようになりました。これまではモダン構成で一覧が空になり、
  テストケース名を指定しない `bin/cake test app` / `bin/cake test <Plugin>` や Web のテストランナーに
  テストケースが表示されませんでした。

**移行:**

- 対応不要です。

### SQL Server ドライバーがデフォルトで `PDO::ATTR_ERRMODE` を設定 ([PR #36](https://github.com/pieceofcake2/cakephp/pull/36))

- `Sqlserver::connect()` は、他のドライバーと同じく `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION` を
  `'flags'` の設定にマージするようになりました。演算子の優先順位の不具合により、これまでこのデフォルトは適用されていませんでした。

**移行:**

- 対応不要です。PHP 8 の PDO はもともと `PDO::ERRMODE_EXCEPTION` がデフォルトで、
  `'flags'` で指定した `PDO::ATTR_ERRMODE` の値はこれまでどおり優先されます。

### ServerShell のデフォルトポートを 8765 に変更 ([PR #37](https://github.com/pieceofcake2/cakephp/pull/37))

- `bin/cake server` は、多くのシステムで root 権限が必要な `80` ではなく、デフォルトでポート `8765` で待ち受けるようになりました
  （CakePHP 3 以降と同じです）。
- `ServerShell::DEFAULT_PORT` は `8765` になりました。

**移行:**

- ポート 80 を使い続ける場合は、`bin/cake server -p 80` のように明示的に指定してください。

## 破壊的変更

### インストール後の作業

#### レガシー構成の場合（`app/` ディレクトリ）

インストール後、Bake プラグインをインストールし、ディスパッチャーファイルをコピーします。

```bash
# Bake プラグインをインストール
composer require --dev pieceofcake2/bake

# Web 用ディスパッチャーをコピー
cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php

# コンソール用ディスパッチャーをコピー
cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake
```

#### モダン構成の場合（`src/` ディレクトリ）

次のファイルを更新する必要があります。

- `config/define.php`
- `bin/cake`
- `webroot/index.php`
- `webroot/test.php`

CakePHP 2.x と 5.x の両方に対応したモダンなアプリケーションスケルトンは
[`pieceofcake2/app`](https://github.com/pieceofcake2/app) を参照してください。
[インストール](/ja/installation) と
[ディレクトリ構成](/ja/appendices/migrating-to-the-modern-layout) も参照してください。

### ディレクトリ構成のモダン化（[PR #21](https://github.com/pieceofcake2/cakephp/pull/21)）

- **ディレクトリ構成を現在の標準的な形に再編しました**
- `lib/Cake/` → `src/Cake/`（フレームワークのソースコード）
- `lib/Cake/Test/Case/` → `tests/TestCase/`（フレームワークのテスト）
- `lib/Cake/Test/Fixture/` → `tests/Fixture/`（テストフィクスチャ）
- `lib/Cake/Console/cake` → `bin/cake`（コンソール実行ファイル）
- `lib/Cake/Config/` → `config/`（フレームワークの設定ファイルをルート直下へ）
- `lib/Cake/View/` と `lib/Cake/Templates/` → `templates/`（フレームワークのデフォルトテンプレートをルート直下へ）
- すべての設定ファイルとパスをそれに合わせて更新
- フレームワークのルートディレクトリを指す `CORE_ROOT` 定数を追加

**モダンなテストディレクトリのサポート:**

- アプリケーションとプラグインで、モダンな `tests/TestCase/` と `tests/Fixture/` の構成を使えるようになりました
- テストスイートは `Test/Case/`（従来）と `tests/TestCase/`（モダン）の両方を自動検出します
- フィクスチャローダーは `Test/Fixture/` と `tests/Fixture/` の両方に対応します
- アプリケーションのテストを段階的にモダン構成へ移行できます
- 破壊的変更はありません。両方の構成を同時に使えます

**移行:**

- フレームワークを依存パッケージとして使っているアプリケーションでは対応不要です
- `bin/cake`（Composer でインストールした場合は `vendor/bin/cake`）がプロジェクトの構成を自動で判別します
- モダンな `src/` 構成と従来の `app/` 構成のどちらでも自動的に動作します
- アプリケーションのテストは、必要に応じて `app/Test/Case/` から `app/tests/TestCase/` へ
  自分のペースで移行できます

**コンソール実行ファイルの改善:**

- `bin/cake` は Composer のオートローダーからプロジェクトのルートを自動検出します
- 手動の設定は不要で、どのプロジェクト構成でもそのまま動作します
- モダン（`src/`）と従来（`app/`）のアプリケーションディレクトリに対応します

### Composer オートロードへの移行（[PR #22](https://github.com/pieceofcake2/cakephp/pull/22)）

フレームワークは include_path によるクラス読み込みから Composer の classmap オートロードに
移行しました。クラスの読み込みが単純になり、現在の PHP ツールとの互換性も向上します。

**変更点:**

- CakePHP フレームワークのクラスから `App::uses()` 宣言を削除しました（798 箇所）
- CakePHP フレームワークのクラスは Composer の classmap オートローダーで自動的に読み込まれます
- アプリケーションのクラスも、Composer の classmap オートロードを設定すれば自動で読み込めます（下記の「移行」を参照）
- アプリケーションのクラスを継承するフレームワークのクラスでは、引き続き `App::uses()` を使います
  - `App::uses('AppController', 'Controller')` - CakeErrorController 用
  - `App::uses('AppModel', 'Model')` - I18nModel、AcoAction、Permission 用
  - `App::uses('AppShell', 'Console/Command')` - すべてのコアシェルコマンド用
  - `App::uses('AppHelper', 'View/Helper')` - すべてのコアヘルパー用

**移行:**

**新規プロジェクト、またはモダン構成（`src/`）の場合:**

- 推奨: `composer.json` に classmap オートロードの設定を追加します
  （[pieceofcake2/app](https://github.com/pieceofcake2/app) と同様）。

  ```json
  {
    "autoload": {
      "classmap": ["src/"]
    }
  }
  ```

**レガシーなプロジェクト（`app/` ディレクトリ）の場合:**

- 対応不要です。既存のアプリケーションは変更なしで動作し続けます
- アプリケーションのクラスに対するフレームワーク側の `App::uses()` 呼び出しで後方互換性を保っています

**プラグインのクラス:**

- Composer オートロードに対応していないプラグインでは、これまでどおり `App::uses()` で
  クラスを読み込む必要があります。

  ```php
  App::uses('MyPluginHelper', 'MyPlugin.View/Helper');
  ```

- プラグインのドキュメントにオートロード対応と書かれていれば、`App::uses()` は不要な場合があります

**独自オートローダーによる上書き（任意）:**

特定のクラスについてオートロードの挙動を上書きしたい場合は、独自のオートローダーを prepend
フラグ付きで登録し、Composer のオートローダーより優先させます。

```php
// 例: classmap ベースの独自オートローダー
$customClassMap = [
    'MyCustomClass' => '/path/to/MyCustomClass.php',
    'AnotherClass' => '/path/to/AnotherClass.php',
];

spl_autoload_register(function ($class) use ($customClassMap) {
    if (isset($customClassMap[$class])) {
        require $customClassMap[$class];
        return true;
    }
    return false;
}, true, true); // throw=true, prepend=true（Composer より優先）
```

**引数の意味:**

- 1 つ目の `true`: オートローダーの登録に失敗したら例外を投げる
- 2 つ目の `true`: オートローダーのキューの先頭に追加する（Composer のオートローダーより優先される）

**クラス名重複の警告:**

classmap に同じ名前のクラスが複数あると、`composer install` や `composer dump-autoload` の際に
Composer が警告を出します。

```text
Warning: Ambiguous class resolution, "AppController" was found in both "/path/to/vendor/pieceofcake2/app/src/Controller/AppController.php" and "/path/to/your-app/src/Controller/AppController.php", the first will be used.
```

この警告を防ぎ、正しいクラスが読み込まれるようにするには、`composer.json` で
`exclude-from-classmap` を使います。

```json
{
  "autoload": {
    "classmap": ["src/"],
    "exclude-from-classmap": [
      "vendor/pieceofcake2/app/src/Controller/AppController.php",
      "vendor/pieceofcake2/app/src/Model/AppModel.php"
    ]
  },
  "autoload-dev": {
    ...
  }
}
```

これにより Composer は classmap の生成時に指定したファイルを無視し、アプリケーションの
基底クラスとの衝突を防げます。

### Bake プラグインの分離（[PR #17](https://github.com/pieceofcake2/cakephp/pull/17)）

- **Bake の機能を別プラグインに分離しました**
  （[pieceofcake2/bake](https://github.com/pieceofcake2/bake)）
- `BakeShell` とすべての Bake タスクをコアから削除しました（`BakeTask`、`ModelTask`、
  `ControllerTask`、`ViewTask`、`FixtureTask`、`TestTask`、`TemplateTask`、`ProjectTask`、
  `PluginTask`、`DbConfigTask`、`CommandTask`）
- アプリケーションスケルトンのテンプレートを `lib/Cake/Console/Templates/skel/` から Bake プラグインへ移動しました
- ディスパッチャーファイル（`index.php`、`test.php`、`cake`）は Bake プラグインに含まれるようになりました
- Bake プラグインをインストールしないと、コンソールの bake コマンドは使えません

**移行:**

1. Bake プラグインを個別にインストールします: `composer require --dev pieceofcake2/bake`
2. `app/Config/bootstrap.php` でプラグインを読み込みます。

   ```php
   CakePlugin::load('Bake');
   ```

3. 必要に応じて Bake プラグインからディスパッチャーファイルをコピーします（新規プロジェクトの場合）

**変更の理由:**

- Bake の機能を独立して開発・バージョン管理できる
- コアフレームワークのサイズを減らせる
- ほとんどのアプリケーションは本番環境で Bake を必要としない

### 旧 Upgrade プラグインの分離（[PR #19](https://github.com/pieceofcake2/cakephp/pull/19)）

- **旧来のアップグレード機能を別プラグインに分離しました**
  （[pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade)）
- `UpgradeShell` をコアから削除しました
- Upgrade プラグインをインストールしないと、旧来のアップグレードコマンド（1.3 → 2.0）は使えません

**移行:**

::: info
Upgrade プラグインが必要になるのは CakePHP 1.3 のアプリケーションを 2.0 に上げる場合だけで、
2025 年の時点ではきわめてまれです。ほとんどの利用者には不要です。
:::

CakePHP 1.3 のアプリケーションを 2.0 に上げる必要がある場合は、Upgrade プラグインを個別に
インストールします。

```bash
composer require --dev pieceofcake2/upgrade
```

そのうえで `app/Config/bootstrap.php` でプラグインを読み込みます。

```php
CakePlugin::load('Upgrade');
```

**変更の理由:**

- コアフレームワークのサイズを減らせる
- Upgrade プラグインは CakePHP 1.3 から 2.0 へのアップグレードにしか使わない
- 2025 年の時点でこの機能を必要とする人はほとんどいない

### Composer によるインストールが必須に（[PR #14](https://github.com/pieceofcake2/cakephp/pull/14)）

- **Composer を使わないインストールはサポートしなくなりました**
- ディスパッチャーファイル（`app/webroot/index.php`、`app/webroot/test.php`、`app/Console/cake`）は
  Composer のオートロードを必要とします
- ディスパッチャーファイルから `CAKE_CORE_INCLUDE_PATH` を手動で検出する処理を削除しました
- `include_path` を操作する処理を削除しました
- 旧来の `app/Vendor/cakephp/cakephp` パスの検出を削除しました
- `app/Console/cake.bat` と `app/Console/cake.php` を削除しました（Windows 用バッチファイルと
  PHP ラッパーは不要になりました）

**移行:**

1. 依存関係を Composer で管理していることを確認します
2. Bake プラグインをインストールします: `composer require --dev pieceofcake2/bake`
3. 更新されたディスパッチャーファイルを `app/Plugin/Bake/Console/Templates/skel/` から
   アプリケーションにコピーします。

   ```bash
   cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
   cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php
   cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
   ```

4. 古いディスパッチャーファイルがあれば削除します。

   ```bash
   rm -f app/Console/cake.bat app/Console/cake.php
   ```

5. `composer install` を実行し、すべての依存パッケージが正しく読み込まれるようにします

### キャッシュエンジンの削除（[PR #4](https://github.com/pieceofcake2/cakephp/pull/4)）

- **Xcache** のサポートを削除しました（PHP 7.0 以降に非対応）
- **Wincache** のサポートを削除しました（PHP 8.x 向けに保守されていない）

**移行:**

- これらのキャッシュエンジンを使っている場合は、Redis、Memcached、APCu のいずれかに移行してください

### データベースドライバーへのメソッド追加（[PR #3](https://github.com/pieceofcake2/cakephp/pull/3)）

- データベースドライバーに新しいメソッドを追加しました（独自のドライバー実装がある場合は問題になる可能性があります）

**MySQL ドライバー（Mysql.php）:**

- `getVersion(): string` - MySQL / MariaDB / Aurora MySQL のバージョンを返す
- `getServerType(): string` - 'MySQL'、'MariaDB'、'Aurora MySQL' のいずれかを返す
- `utf8mb4Supported(): bool` - utf8mb4 文字セットに対応しているかを調べる
- `integerDisplayWidthDeprecated(): bool` - 整数型の表示幅が非推奨か（MySQL 8.0.17 以降）を調べる

**PostgreSQL ドライバー（Postgres.php）:**

- `getVersion(): string` - PostgreSQL のバージョンを返す

**移行:**

- これらのクラスを継承した独自のデータベースドライバーがある場合は、これらのメソッドを実装してください

### データベースの文字セット設定の変更（[PR #11](https://github.com/pieceofcake2/cakephp/pull/11)）

- 文字セットの設定を `SET NAMES` から DSN の接続オプションに移しました
- **MySQL**: 文字セットを DSN に含めます（例: `mysql:...;charset=utf8`）
- **PostgreSQL**: クライアントエンコーディングを DSN の options で指定します
  （例: `pgsql:...;options='--client_encoding=UTF8'`）
- **PostgreSQL**: DSN の `sslmode` パラメーターは省略可能になりました

**移行:**

- 対応不要です。変更は後方互換です
- 実行時に変更する場合は、引き続き `setEncoding()` メソッドを使えます
- 文字セットを DSN で指定するため、接続処理が効率的になります

### SQL Server ドライバーの更新（[PR #9](https://github.com/pieceofcake2/cakephp/pull/9)）

#### 設定の形式

- **スキーマ**: `schema` の設定で接続に使う SQL Server のスキーマを指定します。既定値は `dbo` です。
  1 つのデータベースの複数のスキーマにあるテーブルを使う場合は、スキーマごとに接続を定義します。

  ```php
  public $default = [
      'datasource' => 'Database/Sqlserver',
      'host' => 'localhost',
      'port' => 1433,
      'login' => 'user',
      'password' => 'password',
      'database' => 'my_app',
      'schema' => 'dbo',
  ];
  ```

- **接続オプション**: SSL/TLS のオプションは `options` 配列で指定します

  ```php
  'options' => [
      'TrustServerCertificate' => 'yes',
      'Encrypt' => 'no',
  ]
  ```

- **ポートの設定**: ポートは個別に指定します（サーバー名に自動的に付加されます）

#### メソッドシグネチャの変更

- `describe($model): array` - 戻り値の型を明示しました
- `insertMulti()` - `void` ではなく `bool` を返すようになりました

**移行:**

- テーブルが `dbo` 以外のスキーマにある場合は `schema` を設定します
- DSN に直接 SSL/TLS オプションを書いている場合は `options` 配列に移します
- Sqlserver クラスを継承している場合は、メソッドシグネチャを合わせてください

### メール関数の更新（[PR #10](https://github.com/pieceofcake2/cakephp/pull/10)）

- `MailTransport::_mail()` のメソッドシグネチャが厳密な型付きに変わりました
- 変更前: `protected function _mail($to, $subject, $message, $headers, $params = null)`
- 変更後: `protected function _mail(string $to, string $subject, string $message, array|string $headers = [], string $params = ''): void`

**移行:**

- `MailTransport` クラスを継承していなければ対応不要です
- 継承している場合は、厳密な型に合わせてメソッドシグネチャを更新してください

### CSRF トークンのセキュリティ強化（[PR #5](https://github.com/pieceofcake2/cakephp/pull/5)）

- 新しい CSRF トークンは HMAC-SHA1 の署名を使います（CVE-2020-15400 への対策）
- トークンの形式は base64 エンコード（16 バイトの値 + 20 バイトの HMAC）に変わりました

**移行:**

- **対応不要です**。自動的に適用され、後方互換です
- 既存のトークンも引き続き有効です
- 新しいトークンは強化された方式で生成されます

詳しくは [セキュリティ](/ja/appendices/security-fixes) を参照してください。

### strftime() の置き換え

- `strftime()` は PHP 8.1 で非推奨になり、PHP 8.2 で削除されました
- 代わりに Symfony の ICU Polyfill を介して `IntlDateFormatter` を使います
- 互換性のために `PHP81_BC\strftime` にフォールバックします

**移行:**

- ほとんどの日付フォーマットは同じ結果になります
- 境界的なケースでは出力がわずかに異なる場合があります
- アプリケーションの日付フォーマットをテストしてください

### 開発ツールの更新

#### PHP CodeSniffer（[PR #8](https://github.com/pieceofcake2/cakephp/pull/8)）

- 1.0.0 から 5.3 に更新しました
- 自動フォーマットによる修正を適用しました

**移行:**

- 開発時のみの変更です
- 独自のコーディング規約を使っている場合は `phpcs.xml` を更新してください

[コーディング規約](/ja/contributing/cakephp-coding-conventions) を参照してください。

#### PHPUnit の互換性

- フレームワークのテストを PHPUnit 9.6 に移行しました
- 非推奨の PHPUnit 機能はすべて修正しました

**移行:**

- 非推奨の PHPUnit 機能を使っている場合は、テストを更新してください

### PHP 8 構文へのモダン化（[PR #7](https://github.com/pieceofcake2/cakephp/pull/7)）

- コードベースを PHP 8 の構文に書き換えました

**変更点:**

- `array()` → `[]`
- `get_class()` → `::class`
- 配列の分割代入で `list()` → `[]`
- `dirname(__FILE__)` → `__DIR__`
- null 合体演算子を追加
- ネイティブの `str_contains()`、`str_starts_with()`、`str_ends_with()` を使用

**移行:**

- **対応不要です**。構文の変更のみで、機能の変更はありません

### CookieComponent の 'cipher' タイプは安全ではないため置き換えが必要

- `CookieComponent` のデフォルトの暗号化タイプ `'cipher'` はきわめて安全性が低い方式です

::: warning
CakePHP のソースコードのコメントにも次のように書かれています。

> "Cipher is horribly insecure and only the default because of backwards
> compatibility. In new applications you should always change this to 'aes' or
> 'rijndael'."

（cipher はきわめて安全性が低く、後方互換性のためだけにデフォルトになっている。新しいアプリケーションでは必ず 'aes' か 'rijndael' に変更すること。）
:::

**'cipher' が安全でない理由:**

- XOR による暗号化を行う `Security::cipher()` を使っている（暗号学的に弱い）
- `Security.cipherSeed` を float から int へ変換する際の挙動が未定義
- シード値 `mt_srand((int)(float)Configure::read('Security.cipherSeed'))` の一貫性が保証されない
- 機密データの保護には適さない

**移行:**

```php
// 旧（安全でない。使わないこと）
public $components = [
    'Cookie' => [
        'type' => 'cipher'  // デフォルト。きわめて安全性が低い
    ]
];

// 新（推奨）
public $components = [
    'Cookie' => [
        'type' => 'aes',
    ],
];
```

`beforeFilter()` で `$this->Cookie->type('aes');` を呼び出して設定することもできます。

::: pieceofcake2
`$components` の `'type'` は v2.12.3 から反映されます。v2.12.2 以前では無視され、
Cookie は `'cipher'` で暗号化されていました。
:::

PHP 8 では `'aes'` を使う場合も `Security.useOpenSsl` の設定が必要です。下記の
[OpenSSL を有効にする](#enable-openssl) を参照してください。

::: danger
暗号化タイプを変更すると、既存のクッキーは無効になります。移行期間中は両方のタイプに対応するなど、
移行の方針を計画してください。
:::

## PHP 8 移行時の補足

以下は UPGRADE.md には書かれていませんが、PHP 8 へ移行するアプリケーションでよく問題になる点です。

### `Security::encrypt()` と AES クッキーで OpenSSL を有効にする {#enable-openssl}

`mcrypt` 拡張は PHP 7.2 以降同梱されておらず、通常はインストールされていません（[PECL](https://pecl.php.net/package/mcrypt) から入れることはできます）。
`Security::encrypt()` と `Security::decrypt()` は `Security.useOpenSsl` が有効な場合にだけ
OpenSSL を使い、そうでなければ `mcrypt_*` 関数を呼び出して失敗します。これらのメソッドを使う
`CookieComponent` の `'aes'` タイプも同様です。フレームワークのデフォルトではこの設定は有効になっていません。
[pieceofcake2/app](https://github.com/pieceofcake2/app) のスケルトン (v2.3.1 以降) から作成したアプリケーションでは
`config/core.php` で有効になっています。既存のアプリケーションでは、`app/Config/core.php`（レガシー構成）または
`config/core.php`（モダン構成）に追加してください。

```php
Configure::write('Security.useOpenSsl', true);
```

::: warning
クッキーの `'rijndael'` タイプと `Security::rijndael()` は常に mcrypt を必要とします。
mcrypt の無い PHP 8 環境では、`Security.useOpenSsl` を有効にしたうえで `'aes'` を使ってください。
:::

### `String` クラスの削除

非推奨だった `String` ユーティリティクラスは削除されました（`string` は PHP 7 から予約語です）。
代わりに `CakeText` を使ってください。

```php
// 変更前
App::uses('String', 'Utility');
$uuid = String::uuid();

// 変更後
$uuid = CakeText::uuid();
```
