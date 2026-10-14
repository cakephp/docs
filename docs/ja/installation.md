# インストール

CakePHP は [Composer](https://getcomposer.org) を使ってインストールします。
最小構成で必要なものは、ウェブサーバと PHP、Composer です。
このマニュアルでは主に(最も一般的である) Apache でのセットアップに主眼を置いていますが、
CakePHP を nginx や lighttpd、Microsoft IIS のような様々なウェブサーバで走らせるよう設定することもできます。

> [!WARNING]
> CakePHP 2 は既存アプリケーションの保守のためのものです。
> 新しくプロジェクトを始める場合は [CakePHP 5](https://book.cakephp.org/5/ja/) を使ってください。

## システム要件

- HTTPサーバー。例: Apache。mod_rewriteが推奨されますが、必須ではありません。
- PHP 8.0、8.1、8.2、8.3、8.4、8.5
- [Composer](https://getcomposer.org)

技術的にはデータベースエンジンは必ずしも必要ではありませんが、ほとんどのアプリケーションはこれを活用することが想像できます。
CakePHPは種々のデータベース・ストレージのエンジンをサポートしています。

- MySQL 5.6、5.7、8.0 以上 (`pdo_mysql`)
- PostgreSQL 9.4 以上 (`pdo_pgsql`)
- SQLite 3 (`pdo_sqlite`)
- Microsoft SQL Server 2022 以上 (`pdo_sqlsrv`)

> [!NOTE]
> 組み込みのドライバは全てPDOを必要とします。
> 正しいPDO拡張モジュールがインストールされているか必ず確かめてください。

CakePHP は次の PHP 拡張モジュールも使用します。

- `mbstring` は強く推奨します。無い場合は Symfony の polyfill が使われます。
  polyfill には `mb_encode_mimeheader()` が無いため、`CakeEmail` はメールヘッダーのエンコードに
  `Multibyte::mimeEncode()` を使います。
- `intl` は任意です。非推奨となった `strftime()` の代わりに日付の書式化に使われます。
  無い場合は Symfony の polyfill が使われます。
- `openssl` は任意ですが、SSL/TLS 接続と [Security](core-utility-libraries/security)
  による AES 暗号化には必要です。

::: pieceofcake2
PHP 8.0 以上が必要です。CakePHP は Composer の
オートローダーからのみ読み込まれます (`CAKE_CORE_INCLUDE_PATH` や `include_path` による設定は廃止されました)。
フォークは CakePHP 2.10.24 をベースにしています。それより古い 2.x を使っている場合は、
[アップグレードガイド](/ja/appendices/migrating-from-cakephp-2-10) に従い、先に PHP 7.4 上で
`cakephp/cakephp` 2.10.24 に上げてください。
:::

## ライセンス

CakePHPはMIT Licenseの元にライセンスされています。
これは著作権(*copyright*)の提示が全く改変されていない状態で残されているという条件の元で、ソースコードを自由に更新、配布、再公開できることを意味します。
また、自由にCakePHPを宣伝やクローズソースのアプリケーションに組み込むこともできます。

## Composer のインストール

Composer をまだ入れていない場合は、[公式の Composer ドキュメント](https://getcomposer.org/download/)
に従ってインストールしてください。Windows では
[Composer の Windows インストーラ](https://github.com/composer/windows-setup/releases/) を使えます。
このマニュアルの例では、`composer` コマンドに `PATH` が通っているものとします。

## 新しいアプリケーションの作成

アプリケーションのスケルトンは [pieceofcake2/app](https://github.com/pieceofcake2/app)
パッケージとして提供されています。Composer の `create-project` コマンドで新しいアプリケーションを作成します。

```bash
composer create-project pieceofcake2/app my_app
```

`my_app` ディレクトリが作られ、CakePHP (`pieceofcake2/cakephp`) が `vendor/` にインストールされます。
開発用の依存パッケージとして [Bake](console-and-shells/code-generation-with-bake) と
[DebugKit](https://github.com/pieceofcake2/debug_kit) プラグインもインストールされます
([DebugKit のドキュメント](https://github.com/pieceofcake2/debug_kit/blob/2.x/docs/README.md) を参照してください)。
スケルトンのディレクトリ構成は次のとおりです。

```text
my_app/
    bin/cake            コンソール
    config/             設定ファイル
    logs/               ログファイル
    plugins/            Composer でインストールしたプラグイン
    resources/locales/  翻訳ファイル
    src/                コントローラ、モデル、ヘルパー、シェル
    templates/          ビューテンプレート、レイアウト、エレメント
    tests/              テストとフィクスチャ
    tmp/                キャッシュ、セッション
    vendor/             CakePHP を含む Composer パッケージ
    webroot/            ドキュメントルート
```

詳しくは [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure) を参照してください。

続いて設定を済ませます。

1. `config/database.php.default` を `config/database.php` にコピーし、データベースの接続設定を記入します。
   [データベース設定](development/configuration#database-configuration) を参照してください。
2. `config/core.php` の `Security.salt` と `Security.cipherSeed` の値を変更します。
   スケルトンに入っている値は誰でも知っているサンプル値なので、実際のアプリケーションでは使わないでください。

ファイルを編集する代わりに、デバッグレベル、セキュリティ用のソルト、データベースの設定を
環境変数でセットすることもできます。開発環境では、`config/.env.example` を `config/.env` に
コピーして編集します。[環境変数](development/configuration#environment-variables) を参照してください。

スケルトンの `composer.json` には、[composer.json の設定](#configuring-composer-json) で説明するプラグイン用の設定が
すでに含まれています。ファイルを編集するときも、この設定は残しておいてください。

## 既存のアプリケーションへの導入

Composer で `cakephp/cakephp` を使っているアプリケーションでは、`composer.json` の `require` にある
`cakephp/cakephp` を `pieceofcake2/cakephp` に置き換えます。
また、[composer.json の設定](#configuring-composer-json) で説明する `config` と `extra` の設定が無ければ追加します。
そのうえで `composer update` を実行します。`pieceofcake2/cakephp` は `cakephp/cakephp` を
置き換える (replace する) パッケージとして宣言されているので、`cakephp/cakephp` 2.x に依存する
プラグインやパッケージもそのままインストールでき、動作します。両方のパッケージを同時に require しないでください。

CakePHP は Composer のオートローダーからのみ読み込まれるため、アプリケーションのディスパッチャファイル
(`index.php`、`test.php`、コンソールの `cake` スクリプト) を新しいものに置き換える必要があります。

モダンな構成のアプリケーションでは、[pieceofcake2/app](https://github.com/pieceofcake2/app)
スケルトンから `config/define.php`、`bin/cake`、`webroot/index.php`、`webroot/test.php` をコピーします。

従来の `app/` 構成のアプリケーションでは、アプリケーションのテンプレートを含む Bake プラグインをインストールし、
そこからディスパッチャファイルをコピーします。

```bash
composer require --dev pieceofcake2/bake

cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php
cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake

# Windows 用バッチファイルと PHP ラッパーは使われなくなりました
rm -f app/Console/cake.bat app/Console/cake.php
```

従来の構成では、[composer.json の設定](#configuring-composer-json) にある `installer-paths` によって、
Composer が CakePHP のプラグインを `app/Plugin/` にインストールします。

従来の構成のアプリケーションは、あとからディレクトリ単位で少しずつモダンな構成に移行できます。
2 つの構成の対応関係は [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure) を、
CakePHP 2.10.24 からのその他の変更点は [アップグレードガイド](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。

## composer.json の設定 {#configuring-composer-json}

CakePHP アプリケーションの最小限の `composer.json` は次のようになります。

```json
{
    "name": "example/my-app",
    "type": "project",
    "require": {
        "php": ">=8.0",
        "pieceofcake2/cakephp": "^2.12"
    },
    "autoload": {
        "classmap": ["src/"]
    },
    "config": {
        "allow-plugins": {
            "composer/installers": true
        }
    },
    "extra": {
        "installer-paths": {
            "plugins/{$name}/": ["type:cakephp-plugin"]
        }
    }
}
```

`config` と `extra` の設定は必須です。

- CakePHP 2 のプラグインは `cakephp-plugin` タイプの Composer パッケージとして公開されており、
  [composer/installers](https://github.com/composer/installers) パッケージによってインストールされます。
  `installer-paths` の設定により、プラグインは `CakePlugin::load()` が探す `plugins/<Name>/` にインストールされます。
  この設定が無いとプラグインは別のディレクトリにインストールされ、CakePHP から見つけられません。
- Composer 2.2 以降では、`composer/installers` のように Composer プラグインとして動作するパッケージを
  `config.allow-plugins` で許可する必要があります。許可していないと Composer は確認を求めるか実行を拒否し、
  プラグインが `plugins/` にインストールされません。

従来の `app/` の構成のアプリケーションでは、プラグインを `app/Plugin/` にインストールします。

```json
"extra": {
    "installer-paths": {
        "app/Plugin/{$name}/": ["type:cakephp-plugin"]
    }
}
```

CakePHP は `src/Plugin/` または `app/Plugin/` と、プロジェクト直下の `plugins/` からプラグインを探すため、
従来の構成のアプリケーションで `plugins/` を使い続けることもできます。

`classmap` の設定は任意です。`src/` にあるアプリケーションのクラスを Composer でオートロードできるようになり、
`App::uses()` が不要になります。新しいクラスファイルを追加したら `composer dump-autoload` を実行してください。
クラスを `App::uses()` で読み込むアプリケーションでは省略できます。
詳しくは [応用インストール](installation/advanced-installation) を参照してください。

## パーミッション

CakePHP は、幾つかの操作のために `tmp/` ディレクトリを使用します。
モデルのdescriptionや、ビューのキャッシュ、セッション情報などです。
ログファイルは `logs/` に書き込まれます。

従って、`tmp/` と `logs/` ディレクトリ、およびそのサブディレクトリ全てに、ウェブサーバーのユーザによる書き込み権限があることを確認してください。
従来の構成では、これらは `app/tmp/` と `app/tmp/logs/` です。

一般的な課題として、これらのディレクトリは、ウェブサーバとコマンドラインユーザの両方で書き込み権限が必要なことがあります。
UNIXシステム上で ウェブサーバユーザとコマンドラインユーザが異なる場合、パーミッションのプロパティ設定を確保するために、あなたのプロジェクト内で一度だけ以下のコマンドを実行してください。

``` text
HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
setfacl -R -m u:${HTTPDUSER}:rwx tmp logs
setfacl -R -d -m u:${HTTPDUSER}:rwx tmp logs
```

## 開発用サーバ {#development-server}

アプリケーションを手早く試すには、PHP のビルトインウェブサーバを使うのが簡単です。
`server` シェルで起動できます。

```bash
bin/cake server
```

これで <http://localhost:8765/> でアプリケーションにアクセスできます。
ポートは `-p`、ホスト名は `-H`、ドキュメントルートは `-d` で変更できます。

::: pieceofcake2
v2.12.3 からデフォルトのポートは 8765 です。それより前のバージョンでは、`-p` を省略するとポート 80 で待ち受けていました。
:::

> [!WARNING]
> ビルトインサーバは開発専用です。運用環境では決して使わないでください。

## ウェブサーバの設定

運用環境では (開発時でも Apache などのウェブサーバを使う場合は)、ウェブサーバのドキュメントルートを
アプリケーションの `webroot/` ディレクトリ (従来の構成では `app/webroot/`) に設定します。
こうするとウェブからアクセスできるのは `webroot/` 内のファイルだけになり、設定ファイルやソースコード、
`vendor/` はドキュメントルートの外に置かれます。

アプリケーションを `/var/www/my_app` にインストールした場合、Apache のバーチャルホストは次のようになります。

``` text
<VirtualHost *:80>
    ServerName www.example.com
    DocumentRoot /var/www/my_app/webroot

    <Directory /var/www/my_app/webroot>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

`webroot/` の `.htaccess` がすべてのリクエストを `index.php` に書き換えるので、
mod_rewrite を有効にし、`AllowOverride` でそれを許可しておく必要があります。
もしウェブサーバが適切に設定されていれば、 <http://www.example.com> で CakePHP アプリケーションがアクセス可能になっているはずです。

nginx、lighttpd、IIS での設定や mod_rewrite のトラブルシューティングについては
[URLリライティング](installation/url-rewriting) を参照してください。
アプリケーションのディレクトリを別の場所に配置したい場合は [応用インストール](installation/advanced-installation) を参照してください。

公開する前には [デプロイ](deployment) も読んでおいてください。

## 動作確認

それでは、実際に CakePHP を動作させてみましょう。
アプリケーションの URL、たとえば開発用サーバなら <http://localhost:8765/>、
あるいは <http://www.example.com/> をブラウザで開いてみましょう。
この時点では、CakePHP のデフォルトのホーム画面が表示され、`tmp/` ディレクトリに書き込めるか、
キャッシュが動作しているか、データベースに接続できるかが確認できます。

おめでとうございます!
[CakePHP の最初のアプリケーションを作る](getting-started)
準備ができました。

動きませんか？
もし PHP のタイムゾーンに関連するエラーが出るなら、 `config/core.php` の中のとある一行のコメントを外し、
サーバのタイムゾーンを設定してください。

``` php
/**
 * Uncomment this line and correct your server timezone to fix
 * any date & time related errors.
 */
date_default_timezone_set('UTC');
```
