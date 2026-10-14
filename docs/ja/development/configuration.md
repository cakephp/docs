# 構成設定

CakePHP アプリケーションの設定は非常に簡単です。CakePHP の
インストールができたら、基本的な Web アプリを作り、それに必要な
データベース設定をセットアップしてみましょう。

もちろん CakePHP の柔軟なアーキテクチャの利点を活用するため、
いろいろなオプションの設定手順も用意されています。CakePHP
コアから継承された機能に簡単な追加を行なうことで、たとえば URL
マッピングルール(route)を追加／設定したり、単語の語尾変化
ルール(inflection)を追加／変更したりできます。

アプリケーションの設定ファイルは、プロジェクトの `config/` ディレクトリに置きます。

- `config/core.php` - デバッグレベル、エラー処理、セッション、セキュリティ用のソルト、
  内部キャッシュなどのコア設定
- `config/bootstrap.php` - アプリケーションの起動処理。キャッシュやログの設定、
  プラグインの読み込み、独自の inflection など
- `config/database.php` - データベース接続 (`config/database.php.default` をコピーして作成します)
- `config/routes.php` - URL のルーティング
- `config/email.php` - メール送信の設定 (`config/email.php.default` をコピーして作成します)
- `config/acl.php`、`config/acl.ini.php` - ACL の設定
- `config/Schema/` - データベースセッションや i18n 用のスキーマファイル

`CONFIG` 定数はこのディレクトリを指します。レガシー構成では同じファイルが `app/Config/`
にあり、プロジェクトのトップレベルに `config/` ディレクトリが無い場合は `CONFIG` がそちらを
指します。両方の構成については [CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure)
を参照してください。

<div class="index">

database.php, database.php.default

</div>

<a id="database-configuration"></a>

## データベース設定

CakePHP では、データベースの詳細設定は `config/database.php`
ファイルに記載されていることを前提としています。
`config/database.php.default` ファイルにデータベースの設定例が
記載されています。設定後の内容は、たとえば以下のようになります。

``` php
// config/database.php
class DATABASE_CONFIG
{
    public $default = [
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'cakephpuser',
        'password' => 'c4k3roxx!',
        'database' => 'my_cakephp_project',
        'prefix' => '',
        'encoding' => 'utf8mb4',
    ];
}
```

モデルの中で `$useDbConfig` プロパティが指定されない場合は、
\$default という名の接続用配列が使われます。たとえばあなたの
アプリケーションで、デフォルトのデータベース以外にも従来から
使っている(legacy)データベースを使う必要がある場合、モデルの中で
\$default 配列と同様の形式で新しいデータベース \$legacy を作り、
さらに適切なモデルの中で `public $useDbConfig = 'legacy';`
のように書きます。

設定配列の中のキー／値のペアを、
あなたの要求に合うように適切に設定してください。

datasource  
この設定配列が使うデータソースの名前。
組み込みのデータベースドライバーは Database/Mysql、Database/Postgres、
Database/Sqlite、Database/Sqlserver です。いずれも PDO を使うので、対応する PDO 拡張
(`pdo_mysql`、`pdo_pgsql`、`pdo_sqlite`、`pdo_sqlsrv`) がインストールされている必要があります。
プラグインに含まれるデータソースを使う場合は `プラグイン記法`
という書式で指定します。

persistent  
データベースへの永続的接続を使うかどうか。Sqlserver データソースは永続的接続に
対応しておらず、true を指定すると例外が発生します。

host  
データソースサーバのホスト名（またはIPアドレス）

login  
データベースアカウントのユーザ名

password  
データベースアカウントのパスワード

database  
この接続で利用するデータベース名

prefix (*オプション*)  
データベース中のすべてのテーブル名の前にこの prefix を付加する。
prefix を使わない場合は空文字列のままにします。

port (*オプション*)  
サーバに接続するための TCP ポート番号または Unix ソケット。
SQL Server では、接続時にホスト名の後ろにポート番号が付加されます。

encoding  
接続で使用する文字コード。デフォルトはそのデータベースのデフォルト値です。
MySQL で UTF-8 を使いたい場合は、'utf8' または 'utf8mb4'（ハイフンなし）と指定してください。
文字コードは接続時に PDO の DSN で渡されます (MySQL は `charset=...`、PostgreSQL は
`options='--client_encoding=...'`)。そのため `SET NAMES` クエリは発行されません。
SQL Server では 'utf8' を指定するとドライバーの UTF-8 エンコーディングが使われます。

flags (*オプション*)  
PDO のコンストラクタに渡す PDO 属性の配列。PHP 8.1 以降、MySQL と SQLite の PDO
ドライバーは整数型と浮動小数点型のカラムを PHP の int と float で返します。
従来どおり文字列で受け取る必要がある場合は
`'flags' => [PDO::ATTR_STRINGIFY_FETCHES => true]` を指定してください。

schema  
使用するスキーマ。PostgreSQL (デフォルトは `public`) と
SQL Server (デフォルトは `dbo`) で使われます。

sslmode (*オプション*)  
PostgreSQL のみ。DSN に付加する `sslmode` の値です (例: `'require'`)。

options (*オプション*)  
SQL Server のみ。DSN に付加する接続オプションの配列です
(例: `['TrustServerCertificate' => 'yes', 'Encrypt' => 'no']`)。

::: pieceofcake2
Sqlserver データソースは SQL Server 2022 以降を対象としています。
ポートは `port` から読み取り、`schema` のデフォルトは `dbo` で、SSL/TLS の設定は `options`
配列で指定します。[CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。
:::

unix_socket  
UNIX のソケットファイル経由での接続をサポートするドライバで使われます。
PostgreSQL を Unix ソケット経由で使いたい場合、ホスト(host)の設定値は
ブランクのままにしておきます。

ssl_key  
SSL キーファイルへのパス。`ssl_cert` と組み合わせて指定します（MySQL のみサポート）

ssl_cert  
SSL 証明書ファイルへのパス。`ssl_key` と組み合わせて指定します（MySQL のみサポート）

ssl_ca  
SSL CA ファイルへのパス（MySQL のみサポート）

settings  
キー／値のペアを持つ配列を指定すると、データベースサーバへの
接続が確立された後、これらが `SET` コマンドとしてサーバに
送られます。現時点では MySQL, Postgres, SQLserver のみでの
サポートです。

::: info Changed in version 2.4
`settings`, `ssl_key`, `ssl_cert`, `ssl_ca` キーは 2.4 で追加されました。
:::

> [!NOTE]
> prefix 設定はテーブルに対して適用されますが、モデルには **適用されません** 。
> たとえばあなたが自分の Apple and Flavor モデル用に JOIN テーブルを
> 作る場合、そのテーブル名は（prefix_apples_prefix_flavors **ではなく** ）
> prefix_apples_flavors とし、prefix 設定は 'prefix\_' としてください。

ここで、一度 [CakePHP の規約](../getting-started/cakephp-conventions)
を見ておくことをおすすめします。テーブル（およびいくつかのカラム）
に関する正確なネーミングルールを適用することで、自由に Cake の
能力を引き出すことができ、またいくつかの設定作業を省略できます。
たとえば、あなたのデータベーステーブルの名前を big_boxes 、
モデル名を BigBox 、コントローラー名を BigBoxesController
とすることで、すべての機能が自動的に有効になります。慣習として、
データベーステーブル名はアンダースコア、小文字、複数形にします。
たとえば bakers, pastry_stores, savory_cakes のようにします。

## クラスの読み込みと追加のクラスパス

CakePHP フレームワークのクラスは Composer のオートローダーで読み込まれるので、
`App::uses()` を書く必要はありません。アプリケーションのクラスも、
[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンのように
`composer.json` に classmap を追加すれば同じようにオートロードできます。

``` json
"autoload": {
    "classmap": ["src/"]
}
```

こうしておけば、`src/` にあるコントローラー、モデル、ヘルパーなどのクラスに対する
`App::uses()` は削除できます。新しいクラスファイルを追加したら、classmap に含まれるように
毎回 `composer dump-autoload` を実行してください。Composer のオートロードに対応していない
プラグインでは、引き続き `App::uses()` が必要です
(例: `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')`)。

::: pieceofcake2
フレームワークは include path ではなく Composer の classmap で
読み込まれるようになり、フレームワーク内の `App::uses()` は削除されました。
`App::uses()` を使っているアプリケーションのコードはそのまま動きます。
:::

`App::uses()` と `App::build()` は引き続き使えます。`App::uses()` を使った場合、
CakePHP はアプリケーションディレクトリ (`src/`、レガシー構成では `app/`) からクラスを探します。
テンプレートは `templates/`、ロケールは `resources/locales/`、プラグインは `plugins/` からも探します。

同一システム上の複数のアプリケーション間で MVC クラスを共有できると
有用な場合があります。両方のアプリケーションで同一のコントローラーを
持たせたい場合、CakePHP の `config/bootstrap.php` を使ってそれらの追加クラスを
読み込ませることができます。

`config/bootstrap.php` の中で `App::build()` を使うと、CakePHP
がクラスを検索する際の追加パスを定義できます。

``` php
App::build([
    'Model' => [
        '/path/to/models',
        '/next/path/to/models',
    ],
    'Model/Behavior' => [
        '/path/to/behaviors',
        '/next/path/to/behaviors',
    ],
    'Model/Datasource' => [
        '/path/to/datasources',
        '/next/path/to/datasources',
    ],
    'Model/Datasource/Database' => [
        '/path/to/databases',
        '/next/path/to/database',
    ],
    'Model/Datasource/Session' => [
        '/path/to/sessions',
        '/next/path/to/sessions',
    ],
    'Controller' => [
        '/path/to/controllers',
        '/next/path/to/controllers',
    ],
    'Controller/Component' => [
        '/path/to/components',
        '/next/path/to/components',
    ],
    'Controller/Component/Auth' => [
        '/path/to/auths',
        '/next/path/to/auths',
    ],
    'Controller/Component/Acl' => [
        '/path/to/acls',
        '/next/path/to/acls',
    ],
    'View' => [
        '/path/to/views',
        '/next/path/to/views',
    ],
    'View/Helper' => [
        '/path/to/helpers',
        '/next/path/to/helpers',
    ],
    'Console' => [
        '/path/to/consoles',
        '/next/path/to/consoles',
    ],
    'Console/Command' => [
        '/path/to/commands',
        '/next/path/to/commands',
    ],
    'Console/Command/Task' => [
        '/path/to/tasks',
        '/next/path/to/tasks',
    ],
    'Lib' => [
        '/path/to/libs',
        '/next/path/to/libs',
    ],
    'Locale' => [
        '/path/to/locales',
        '/next/path/to/locales',
    ],
    'Vendor' => [
        '/path/to/vendors',
        '/next/path/to/vendors',
    ],
    'Plugin' => [
        '/path/to/plugins',
        '/next/path/to/plugins',
    ],
]);
```

> [!NOTE]
> 追加パスの設定は、すべて bootstrap.php の先頭で行ってください。
> こうすることで、アプリケーションのそれ以降の処理でこれらのパスが
> 有効になります。

<div class="index">

core.php, configuration

</div>

## コア（中核部）設定

CakePHP の各アプリケーションには、CakePHP 内部の振る舞いを決めるための
設定ファイルが含まれます。それは `config/core.php` です。
このファイルは設定用クラス変数や、あなたのアプリケーションが
どう振る舞うかを決めるための定数の定義の集まりです。それぞれの
変数を見て行く前に、まずは CakePHP の設定レジストリである
`Configure` を押さえておく必要があります。

### CakePHP のコア設定

`Configure` クラスは、CakePHP コアの設定用変数群を
管理するために使われます。これらの変数は `config/core.php`
にあります。それぞれの変数の定義や、それらがあなたの CakePHP
アプリケーションにどう影響するのかを以下に示します。

debug  
CakePHP のデバッグ出力を制御します。
0 = 本番モード。出力を行いません。
1 = エラーや警告を出力します。
2 = エラーや警告、および SQL を出力します。
\[ SQL のログは、ビューやレイアウト内で
\$this-\>element('sql_dump') をしている場合にのみ表示されます。 \]

Error  
あなたのアプリケーションのエラーを処理するためのエラーハンドラー
を設定します。デフォルトでは `ErrorHandler::handleError()`
が使われます。これは、debug \> 0 の場合は `Debugger` を使ってエラーを表示し、
debug = 0 の場合は `CakeLog` でエラーをログに出力します。

サブキー:

- `handler` - callback - エラーを処理するためのコールバック関数。
  これには無名関数を含む、あらゆるタイプのコールバックを指定可能です。
- `level` - int - 捕捉したいエラーのレベル。
- `trace` - boolean - ログファイルにエラーのスタックトレースを出力。

Exception  
捕捉されていない例外に対して使われる、例外ハンドラーを設定します。
デフォルトでは ErrorHandler::handleException() が使われます。
これは例外の HTML ページを表示し、さらに debug \> 0 の場合であれば、
コントローラーがないといったフレームワークのエラーも表示します。
debug = 0 の場合、フレームワークのエラーは強制的に一般的な HTTP
レベルのエラーに変換されます。例外ハンドリングに関する詳細は
[Exceptions](exceptions) セクションを参照してください。

<div id="core-configuration-baseurl">

App.baseUrl  
もしあなたのサーバで mod_rewrite （や、その他の互換モジュール）
を使いたくない、もしくは使えない場合、CakePHP 組み込みの優れた
URL のしくみを使うことになります。 `config/core.php`
で以下のような行のコメントを外して有効にしてください。

``` php
Configure::write('App.baseUrl', env('SCRIPT_NAME'));
```

さらに、`webroot/.htaccess` ファイルを削除します。レガシー構成の場合は、
以下の .htaccess ファイルを削除します。

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess

これであなたの URL は、たとえば
www.example.com/controllername/actionname/param
ではなく
www.example.com/index.php/controllername/actionname/param
として扱われます。

もし CakePHP を Apache 以外の環境にインストールしようとしている
場合、それぞれのサーバで URL 書き換えを行なう方法について、
[URLリライティング](../installation/url-rewriting) に記載があります。

App.fullBaseUrl  
アプリケーションのルートへの完全修飾ドメイン名 (プロトコルを含む)。
アプリケーション内の任意の URL 生成に特定のドメイン URL を使用するように
CakePHP を設定するには、この設定変数をセットしてください。
これにより、完全なベース URL の自動検出が無効になり、CLI （メール送信など）
からのリンクの生成に役立ちます。アプリケーションがサブフォルダーで実行されている場合は、
`App.base` も設定する必要があります。

App.base  
app のあるベースディレクトリー。アプリケーションがサブフォルダーで実行され、
`App.fullBaseUrl` が設定されている場合に使用する必要があります。

App.encoding  
あなたのアプリケーションで使用しているエンコーディングを定義します。
このエンコーディングは、レイアウトの中の charset やエンティティ
のエンコードを生成するのに使われます。この指定はあなたのデータベース
で使用しているエンコーディングと一致させる必要があります。

Routing.prefixes  
admin のような CakePHP の接頭辞(prefix)ルーティングを活用
したい場合はコメントを外して有効にします。この変数には使用したい
ルーティングの接頭辞名の配列を指定します。詳細は後述します。

Cache.disable  
true にすると、サイト全体のキャッシュを無効にします。
これを行なうと、 `Cache` に対するすべての
read/write は失敗します。

Cache.check  
true にすると、ビューのキャッシュを有効にします。さらにコントローラー
の中でも指定する必要がありますが、この変数はこれらの設定の検出
を行います。

Session  
セッション機能に関して使われる設定の配列です。デフォルトのプリセット
定義として 'defaults' キーが使われますが、ここで宣言されている設定は
デフォルトの設定を上書きします。

サブキー

- `cookie` - 使用するクッキーの名前。デフォルトは 'CAKEPHP'。

- `timeout` - セッションの有効期間（単位：分）。
  この timeout は CakePHP が制御します。

- `cookieTimeout` - セッションクッキーを有効にしたい期間（単位：分）。

- `checkAgent` - セッションの開始時にユーザーエージェント文字列を
  チェックするかどうか。セッションの途中でユーザーエージェント文字列が
  変わるクライアントに対応する場合は false にしてください。

- `defaults` - あなたのセッションの基本構成として使用する
  デフォルト設定。php, cake, cache, database という４種類の
  ビルトイン機構があります。

- `handler` - ユーザー独自のセッションハンドラーとして使えます。
  `session_save_handler` と一緒に使える callable の配列か、
  `CakeSessionHandlerInterface` を実装したクラス名を `engine` キーに持つ配列を指定します。
  このオプションを有効にすると、ini 配列に `session.save_handler` が自動的に追加されます。

- `autoRegenerate` - この設定を有効にすると、セッションを毎回
  自動生成し、セッション ID が頻繁に変わります。詳細は
  `CakeSession::$requestCountdown` を参照してください。

- `cacheLimiter` - セッションクッキーで使用するキャッシュ制御ヘッダー。
  指定できる値は [session_cache_limiter()](https://www.php.net/session_cache_limiter)
  を参照してください。

- `ini` - ini の値として追加で設定したい連想配列。

ビルトインのデフォルトは以下の通りです。

- 'php' - あなたの php.ini で定義されている設定を使う
- 'cake' - セッションファイルを CakePHP の `tmp/sessions` ディレクトリに保存する
- 'database' - CakePHP のデータベースセッションを使う
- 'cache' - セッションの保存に Cache クラスを使う

カスタムセッションハンドラーを定義する場合、
`src/Model/Datasource/Session/<name>.php` に記載します。
そのクラスは `CakeSessionHandlerInterface` を
実装している必要があります。
また `Session.handler.engine` を \<name\> に設定してください。

データベースセッションを使うには、cake のシェルコマンド
`bin/cake schema create Sessions` を使って、
`config/Schema/sessions.php` のスキーマからテーブルを作成します。

詳しくは [セッション](sessions) を参照してください。

Security.salt  
セキュリティ関連のハッシュ処理で使われるランダムな文字列。CSRF トークンやフォーム改ざん防止用
トークンの署名、`CookieComponent` のデフォルトの暗号化キーにも使われます。
アプリケーションごとに一意な値に変更し、秘密にしておいてください。
スケルトンのデフォルト値のままだと、CakePHP が警告を表示します。

::: pieceofcake2
`SecurityComponent` が発行する CSRF トークンは
`Security.salt` を使った HMAC で署名されるようになりました (CVE-2020-15400)。
ソルトを変更すると、発行済みのトークンは無効になります。
[脆弱性への対応](/ja/appendices/security-fixes) を参照してください。
:::

Security.cipherSeed  
`Security::cipher()` で文字列を暗号化／復号化するのに使われるランダムな文字列（数字のみ）。
このメソッドを使うのは `CookieComponent` の暗号化タイプ `'cipher'` だけです。
このタイプは脆弱で、後方互換性のためだけに残されています。Cookie には `'aes'` タイプを使ってください。

Security.useOpenSsl  
true にすると、`Security::encrypt()` と `Security::decrypt()` (つまり Cookie の暗号化タイプ
`'aes'`) が mcrypt ではなく OpenSSL を使います。mcrypt 拡張は PHP 7.2 以降同梱されていないので、
`config/core.php` で有効にしてください。

``` php
Configure::write('Security.useOpenSsl', true);
```

デフォルトは false です。[pieceofcake2/app](https://github.com/pieceofcake2/app) のスケルトン (v2.3.1 以降) から
作成したアプリケーションにはこの行が含まれています。既存のアプリケーションでは追加してください。

Asset.timestamp  
適切なヘルパーを使っている場合、静的ファイルの URL
(CSS, JavaScript, 画像) の末尾に個々のファイルの最終更新時刻
を表すタイムスタンプを追加します。
有効な値は以下の通りです。
(boolean) false - 何もしない（デフォルト）
(boolean) true - debug \> 0 の場合にタイムスタンプを付加
(string) 'force' - debug \>= 0 の場合にタイムスタンプを付加

Acl.classname, Acl.database  
CakePHP のアクセス制御リスト(ACL)機能で使われる定数。
詳細はアクセス制御リストの章を参照してください。

</div>

> [!NOTE]
> キャッシュの設定も core.php にあります。これについては後述します。

`Configure` クラスは、コアの設定をその場で読み書き
するのに使われます。これは、たとえばあなたのアプリケーションの
限られた範囲でデバッグ設定を有効にしたい場合などに特に便利です。

### 構成用定数

ほとんどの構成用設定は Configure によって処理されますが、実行時に
CakePHP が参照する定数がいくつか存在します。

`constant` **LOG_ERROR**

エラー定数。エラーログ出力とデバッグを区別するのに使われます。
現在 PHP は LOG_DEBUG をサポートします。

### コアのキャッシュ設定

CakePHP は内部的に `_cake_model_` と `_cake_core_`
という２つのキャッシュ設定を使います。`_cake_core_` はファイルの
パスやオブジェクトの格納位置を保存するのに使われ、`_cake_model_`
はスキーマの定義やデータソースのソース一覧を保存するのに使われます。
これらはリクエストのたびに参照されるので、APCu や Memcached のような
高速なキャッシュストレージを使うことをおすすめします。デフォルト
では debug \> 0 の場合、いずれの設定も 10 秒おきに有効期限が切れます。
どちらも `config/core.php` の末尾で定義されています。

使用できるキャッシュエンジンは File、Apc (APCu 拡張が読み込まれていれば APCu を使います)、
Memcached、Memcache、Redis です。

::: pieceofcake2
Xcache と Wincache のキャッシュエンジンは削除されました。
これらを使っている設定は、上記のいずれかのエンジンに切り替えてください。
:::

`Cache` に保存されたすべてのキャッシュデータと同じく、
`Cache::clear()` を使ってクリアできます。

## Configure クラス

`class` **Configure**

CakePHP では設定が必要な項目はほとんどありませんが、あなたの
アプリケーション固有の設定ルールを作ることが有用な場合もあります。
あなたは過去に、いくつかのファイルの中で変数や定数を定義することで、
独自の設定値を持たせていたようなケースがあったかもしれません。
この方法では、これらの値を使うために毎回設定ファイルを
インクルードする必要がありました。

CakePHP の Configure クラスは、アプリケーションや実行時固有の値を
保存したり取り出したりするのに使います。注意していただきたいのですが、
このクラスは、その中にいかなるものでも格納することができ、さらにあなたの
コードのいかなる箇所でもそれらを使うことができてしまいます。
これにより、CakePHP のデザインの元になっている MVC パターンを
壊してしまうことになりかねません。 Configure クラスのそもそもの目的は、
多数のオブジェクト間で共有できる変数群の集中管理です。
"convention over configuration（設定より規約）"の世界の中で生きようと
する努力を怠らず、せっかく私たちが整えた MVC 構造という環境を壊すことの
ないようにしてください。

このクラスは、あなたのアプリケーション中の静的なコンテキストにおいて、
いかなるところからでも呼び出せるようになっています。

``` php
Configure::read('debug');
```

`static` Configure::**write**($key, $value)

param string \$key  
書き込むキー。 `ドット記法` が使えます。

param mixed \$value  
保存する値

アプリケーションの設定の中で `write()` を使ってデータを格納します。

``` php
Configure::write('Company.name', 'Pizza, Inc.');
Configure::write('Company.slogan', 'Pizza for your body and soul');
```

> [!NOTE]
> `$key` パラメーターで使われる `ドット記法` により、
> あなたの構成設定値を論理的にグループ化できます。

直前の例は、以下のような単一の呼び出しとしても書けます。

``` php
Configure::write(
    'Company',
    [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul',
    ],
);
```

`Configure::write('debug', $int)` を使えば、その場で動的に
デバッグモードと本番モードを行ったり来たりできます。特に、
JSON や XML のレスポンスではデバッグ情報がパースエラーの原因と
なりがちなので、それを防ぐのに有効です。

`static` Configure::**read**($key = null)

param string \$key  
読み込むキー。 `ドット記法` が使えます。

アプリケーションから設定データを読み込むのに使います。デフォルトは
CakePHP で重要な debug 値です。何らかのキーが指定されたらその
データを返します。前述の write() の例を元に、そのデータを呼び出して
みましょう。

``` php
Configure::read('Company.name');    // 'Pizza, Inc.' が返されます
Configure::read('Company.slogan');  // 'Pizza for your body and soul'
                                    // が返されます

Configure::read('Company');

// 返される値:
['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];
```

\$key を指定しない場合、 Configure にあるすべての値を返します。指定された \$key に関連する
値が存在しない場合、 null を返します。

`static` Configure::**consume**($key)

param string \$key  
読み込むキー。 `ドット記法` が使えます。

Configure からキーを読み込み、同時に削除します。値の読み込みと削除を
1 回の操作で行いたい場合に便利です。

`static` Configure::**check**($key)

param string \$key  
チェックするキー。

key/path が存在し、かつ null でない値を持つかどうかをチェックします。

::: info Added in version 2.3
`Configure::check()` は 2.3 で追加されました。
:::

`static` Configure::**delete**($key)

param string \$key  
削除するキー。 `ドット記法` が使えます。

アプリケーションの設定から情報を削除します。

``` php
Configure::delete('Company.name');
```

`static` Configure::**version**()

現在のアプリケーションで動いている CakePHP のバージョンを返します。

`static` Configure::**config**($name, $reader)

param string \$name  
接続中のリーダー（読み込み機構）の名前

param ConfigReaderInterface \$reader  
接続されるリーダーのインスタンス

Configure に設定リーダーを接続します。接続されたリーダーは、
設定ファイルをロードするのに使われます。設定ファイルを読み込む
方法の詳細は [設定ファイルのロード](#loading-configuration-files) をご覧ください。

`static` Configure::**configured**($name = null)

param string \$name  
チェックするリーダーの名前。指定しない場合、
接続されているすべてのリーダーの一覧が返されます。

指定された名前のリーダーが接続されているかをチェックするか、
または接続されたリーダーの一覧を取得します。

`static` Configure::**drop**($name)

接続されているリーダーオブジェクトを削除します。

## 設定ファイルを読み書きする

CakePHP には２つのビルトインの設定ファイル用リーダーが備わっています。
`PhpReader` は PHP の設定ファイルを読むことができますが、
Configure も歴史的にこれと同じフォーマットのファイルを読めるように
なっています。 `IniReader` は ini 形式の設定ファイルを
読むことができます。ini ファイルの仕様については
[PHP documentation](https://www.php.net/parse_ini_file) を参照してください。
コアの設定ファイルリーダーを使うには、そのリーダーを
`Configure::config()` で Configure に接続してください。

``` php
// CONFIG (config/) から設定ファイルを読み込む
Configure::config('default', new PhpReader());

// 別のパスから設定ファイルを読み込む
Configure::config('default', new PhpReader('/path/to/your/config/files/'));
```

どちらのリーダーも、デフォルトでは `CONFIG` ディレクトリから読み込みます。
`Configure::load('MyPlugin.my_file')` のようにプラグイン記法を使うと、
プラグインの `Config/` ディレクトリから読み込みます。

Configure に複数のリーダーを接続することができます。それぞれの
リーダーは異なった種類の設定ファイル、もしくは異なったタイプの
ソースを読みます。Configure に備わっている他のメソッドを使って
接続されたリーダーとやりとりすることもできます。
`Configure::configured()` を使って接続されている
リーダーの別名を取得できます。

``` php
// 接続されたリーダーの別名の配列を取得する
Configure::configured();

// 特定のリーダーが接続されているかをチェック
Configure::configured('default');
```

接続されているリーダーを取り外すこともできます。
`Configure::drop('default')` はデフォルトリーダーの別名を
取り外します。これ以降、そのリーダーを介した設定ファイルの読み込みは
失敗します。

<a id="loading-configuration-files"></a>

### 設定ファイルのロード

`static` Configure::**load**($key, $config = 'default', $merge = true)

param string \$key  
ロードする設定ファイルの識別子

param string \$config  
設定されたリーダーの別名

param boolean \$merge  
読まれたファイルの中身をマージするか、
それとも既存の値を上書きするか。

Configure に設定リーダーを接続して、設定ファイルを読み込みます。

``` php
// リーダーオブジェクト 'default' を使って config/my_file.php をロードする
Configure::load('my_file', 'default');
```

ロードされた設定ファイルは、そのデータを Configure にある既存の
実行時設定とマージします。また、既存の実行時設定を上書きして
新しい値を追加することもできます。 `$merge` を false にすると、
値は既存の設定には上書きされません。

### 設定ファイルを生成／変更する

`static` Configure::**dump**($key, $config = 'default', $keys = [])

param string \$key  
ファイル名、または生成されるストレージ設定

param string \$config  
データを格納するリーダーの名前

param array \$keys  
保存したいトップレベルのキーのリスト。デフォルトは
すべてのキー。

Configure にある全部または一部のデータをダンプして、ファイルまたは
設定リーダーでサポートされているストレージシステムに格納します。
シリアライズのフォーマットは \$config として接続されている設定
リーダーにより決定されます。たとえば 'default' のアダプターが
`PhpReader` なら、生成されたファイルは
`PhpReader` で読み込みが可能な PHP の設定ファイルになります。

'default' リーダーが PhpReader のインスタンスだとして、Configure
にあるすべてのデータを `my_config.php` というファイルに保存します。

``` php
Configure::dump('my_config.php', 'default');
```

エラーハンドラー設定だけを保存します。

``` php
Configure::dump('error.php', 'default', ['Error', 'Exception']);
```

`Configure::dump()` は `Configure::load()` で読める形式の
設定ファイルを変更または上書きするのにも使えます。

::: info Added in version 2.2
`Configure::dump()` は 2.2 で追加されました。
:::

### 実行時設定を保存する

`static` Configure::**store**($name, $cacheConfig = 'default', $data = null)

param string \$name  
キャッシュファイルのストレージキー

param string \$cacheConfig  
設定データを保存するキャッシュ設定の名前

param mixed \$data  
保存するデータ、null にすると Configure 中のすべての
データを保存。

将来取り出して使えるように、実行時設定の値を保存することもできます。
configure は現在のリクエストの値しか記憶しないので、何らかの変更した
値を後続するリクエストでも使いたい場合は、それらを保存しておく
必要があります。

``` php
// 'default' キャッシュにある 'user_1234' キーの中の現在の設定を保存する
Configure::store('user_1234', 'default');
```

保存された設定データは `Cache` クラス内で永続的データになります。
これにより、 `Cache` が扱えるストレージエンジンにおいて、
設定情報を保存できます。

### 実行時設定を呼び出す

`static` Configure::**restore**($name, $cacheConfig = 'default')

param string \$name  
ロードするストレージキー

param string \$cacheConfig  
データをロードするキャッシュ設定

実行時設定を保存した後は、おそらくそこに再度アクセスして値を取り出す
ことになります。これは `Configure::restore()` により行います。

``` php
// キャッシュから実行時設定を取り出す
Configure::restore('user_1234', 'default');
```

設定情報を取り出す際は、保存した時に使ったものと同じキャッシュから、
同じキーを使って取り出すことが重要です。取り出された情報は、
既存の実行時設定の上にマージされます。

## 独自の設定用リーダーを作成する

設定用リーダーは CakePHP の中で拡張可能な部品です。このため、
あなたのアプリケーションとプラグインの中で、設定用リーダーを
新たに作成することも可能です。設定用リーダーは
`ConfigReaderInterface` を実装する必要があります。
このインターフェースでは `read()` と `dump()` メソッドが定義されています。
たとえば、あなたが本当に XML ファイルが好きなら、あなたのアプリケーションのために
シンプルな XML 設定リーダーを作ることもできます。

``` php
// src/Lib/Configure/MyXmlReader.php
class MyXmlReader implements ConfigReaderInterface
{
    protected $_path;

    public function __construct($path = null)
    {
        if (!$path) {
            $path = CONFIG;
        }
        $this->_path = $path;
    }

    public function read($key)
    {
        $xml = Xml::build($this->_path . $key . '.xml');

        return Xml::toArray($xml);
    }

    // 2.3 以降は dump() メソッドも必須です
    public function dump($key, $data)
    {
        // データをファイルに書き出すコード
    }
}
```

`config/bootstrap.php` でこのリーダーを接続して利用できます。

``` php
Configure::config('xml', new MyXmlReader());
// ...

Configure::load('my_xml');
```

`src/` を Composer の classmap でオートロードしていれば、`composer dump-autoload`
の後はリーダークラスが自動的に読み込まれます。classmap を使っていない場合は、
先に `App::uses('MyXmlReader', 'Configure');` でクラスを読み込んでください。

> [!WARNING]
> 独自の設定クラスに `XmlReader` という名前を付けるのはおすすめしません。
> PHP には同じ名前の組み込みクラス
> [XMLReader](https://www.php.net/manual/ja/book.xmlreader.php) があるからです。

設定リーダーの `read()` メソッドは、 `$key` という名前のリソースが
保持する設定情報の配列を返さなければなりません。

`interface` **ConfigReaderInterface**

`Configure` で設定データを読んだり保存したりするクラスで
使われるインターフェースを定義します。

`method` ConfigReaderInterface::**read**($key)

`method` ConfigReaderInterface::**dump**($key, $data)

::: info Added in version 2.3
`ConfigReaderInterface::dump()` は 2.3 で追加されました。
:::

`exception` **ConfigureException**

設定データをロード／保存／復元する際にエラーが発生すると、この例外が投げられます。
`ConfigReaderInterface` の実装は、エラーが発生した場合にこの例外を投げる必要があります。

### ビルトインの設定リーダー

`class` **PhpReader**

`class` **IniReader**

<a id="inflection-configuration"></a>

## Inflection(語尾変化)設定

CakePHP の命名規約は実に優れています。あなたのデータベーステーブルに
big_boxes 、モデルに BigBox 、コントローラーに BigBoxesController
と名前をつけてもらえれば、これですべてが自動的に動作します。
CakePHP はそれぞれの部品を関連付けるにあたり、それぞれの単語の
単数形と複数形を *inflecting(語尾の変化)* によって把握します。

ここで、CakePHP の `Inflector` （複数形、単数形、
キャメルケース、アンダースコアへの相互変換を司るクラス）が
思ったように動かないケースを想定してみましょう。これは特に、
英語話者ではない人たちにとって起こりがちです。もし CakePHP
があなたの Foci （訳注：focus（焦点）の複数形）や Fish （訳注：
同じ種類の魚の場合は単複同型）を認識してくれない場合、CakePHP
にあなたの特別なケースについて教えることができます。

### カスタム inflection のロード

カスタム inflection をロードするには `config/bootstrap.php`
ファイルの中に `Inflector::rules()` を書きます。

``` php
Inflector::rules('singular', [
    'rules' => [
        '/^(bil)er$/i' => '\1',
        '/^(inflec|contribu)tors$/i' => '\1ta',
    ],
    'uninflected' => ['singulars'],
    'irregular' => ['spins' => 'spinor'],
]);
```

または

``` php
Inflector::rules('plural', ['irregular' => ['phylum' => 'phyla']]);
```

これらのコードは、指定されたルールをフレームワークの `src/Cake/Utility/Inflector.php`
(`vendor/pieceofcake2/cakephp/src/Cake/Utility/Inflector.php`) で定義されている
inflection セットにマージし、コアのルールより優先度の高いルールとして追加します。

## CakePHP の起動(bootstrap)

もし何らかの追加設定が必要な場合、`config/bootstrap.php`
にある CakePHP の bootstrap ファイルを使います。このファイルは
CakePHP のコアな起動処理の直後に実行されます。

このファイルは起動時における多くの共通的な処理に適しています。

- 便利な関数群を定義
- グローバル定数群の登録
- 追加のモデル、ビュー、コントローラーへのパスを定義
- キャッシュ設定の作成
- inflection の構成
- 設定ファイルの読み込み

何かを bootstrap ファイルに追加する場合は、MVC ソフトウェアの
デザインパターンを守るよう注意してください。コントローラーで使うための
独自のフォーマット関数をここに入れたくなるかもしれません。

ぜひその誘惑と戦ってください。その先に、必ず良いことがありますよ。

また、何かを `AppController` クラスに入れることを考慮する
必要があるかもしれません。このクラスはあなたのアプリケーションの
すべてのコントローラーの親クラスです。 `AppController`
はあなたのコントローラーすべてにおいて使われるコールバックや
メソッドを定義するための便利な場所です。
