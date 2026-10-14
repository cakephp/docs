# データソース

データソースはモデルとモデルが表現するデータの元（ソース）とを
仲立ちするものです。多くの場合、データは MySQL, PostgreSQL, Microsoft SQL Server
といったリレーショナルデータベースから取り出されます。
CakePHP にはデータベースごとのデータソースが同梱されています
(`pieceofcake2/cakephp` パッケージの `src/Cake/Model/Datasource/Database` を参照)。
いずれも PDO を使うため、対応する PDO エクステンションが必要です。

| データソース | 対応バージョン | PHP エクステンション |
|----|----|----|
| `Database/Mysql` | MySQL 5.6、5.7、8.0 以降 (MariaDB も判別します) | `pdo_mysql` |
| `Database/Postgres` | PostgreSQL 9.4 以降 | `pdo_pgsql` |
| `Database/Sqlite` | SQLite 3 | `pdo_sqlite` |
| `Database/Sqlserver` | Microsoft SQL Server 2022 以降 | `pdo_sqlsrv` |

> [!NOTE]
> 上記以外のデータソース (CSV/TSV ファイル、配列など) は
> [Datasources プラグイン](https://pieceofcake2.github.io/datasources/) にあります。

`config/database.php` (レガシーレイアウトでは `app/Config/database.php`)
でデータベースの接続設定を行うと、
モデルの操作全般において CakePHP は透過的に対応するデータソースを
使用します。このため、それらのデータソースに関する知識がなくても
利用できるようになっています。

## 接続設定

アプリケーションスケルトンには `config/database.php.default` が含まれています。
これを `config/database.php` にコピーして接続設定を編集してください。
接続ごとに `DATABASE_CONFIG` クラスの public プロパティを定義します。

``` php
// config/database.php
class DATABASE_CONFIG
{
    public $default = [
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'user',
        'password' => 'password',
        'database' => 'database_name',
        'prefix' => '',
        'encoding' => 'utf8mb4',
    ];
}
```

`encoding` の設定は接続時にドライバへ渡されます。MySQL では DSN に `charset=...` として、
PostgreSQL では `options='--client_encoding=...'` として追加されます。
接続後にエンコーディングを変更したい場合は、これまでどおり `setEncoding()` を使えます。

PostgreSQL の `sslmode` (`disable`、`allow`、`prefer`、`require` など) は、
設定したときだけ DSN に追加されます。省略した場合は PostgreSQL クライアントライブラリの
デフォルト値が使われます。

`flags` には PDO のコンストラクタに渡す PDO 属性を配列で指定します。
PHP 8.1 以降の `pdo_mysql` と `pdo_sqlite` は、整数や浮動小数点数のカラムを
文字列ではなく PHP の `int` や `float` で返します。
文字列との厳密な比較など、以前の動作に依存しているアプリケーションでは
`PDO::ATTR_STRINGIFY_FETCHES` を指定してください。

``` php
public $default = [
    'datasource' => 'Database/Mysql',
    // ...
    'flags' => [
        PDO::ATTR_STRINGIFY_FETCHES => true,
    ],
];
```

::: pieceofcake2
`encoding` の設定は接続後に `SET NAMES` を実行するのではなく
DSN で渡すようになり、PostgreSQL の `sslmode` のデフォルト値 `allow` はなくなりました。
MySQL と PostgreSQL のドライバには `getVersion()` などのメソッドが追加されているため、
これらを継承した独自ドライバでは実装が必要になる場合があります。
詳しくは [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。
:::

前述のソースはどれも `DboSource` から派生したもので、これにより
ほとんどのリレーショナルデータベースで共通な、いくつかのロジックを
集約しています。新しく RDBMS のデータソースを書いてみようという向きには、
まずこれらのどれかを手本にするとよいでしょう
（MySQL または SQLite が最もオススメです）。

ただし、多くの人はリモート REST API さらには LDAP サーバといった、
外部ソースに関するデータソースを書くことに興味を持っています。
なので、我々も現在これらに目を向けつつあるところです。

## データソースのための基本的な API

データソースには少なくとも `create`, `read`, `update`
および／または `delete` メソッドを実装することができ、また
『実装するべき』です。（現時点では、実際の各メソッドの特徴的な性質や
実装の詳細は重要ではありません。これらについては後述しています。）。
これらのメソッド以外については、特に必要でなければ実装する必要はありません。
さらに、もしリードオンリーのデータソースが必要なら、
`create`, `update`, `delete` これら３つの存在意義はありません。

すべての CRUD (CREATE/READ/UPDATE/DELETE) メソッドのために
実装しなければならないメソッド:

- `describe($model)`
- `listSources($data = null)`
- `calculate($model, $func, $params)`
- 少なくとも以下のうちのひとつ:
  - `create(Model $model, $fields = null, $values = null)`
  - `read(Model $model, $queryData = [], $recursive = null)`
  - `update(Model $model, $fields = null, $values = null, $conditions = null)`
  - `delete(Model $model, $id = null)`

モデルではなくデータソース自身の中で `$_schema` クラス属性を
定義することも可能です（これは非常に有用な場合もあります）。

これはそれほど特殊なケースではありません。
データソースをモデルに結合させてもなお、
`Model::find()/save()/delete()` はいつも通りに使えます。
また、これらのメソッドを呼ぶときに使われる妥当なデータ
および／またはパラメータも、データソース自身に渡されます。
このため、（たとえば Model::find へのオプションであれば
`'conditions'` のパースや `'limit'` さらにはデータソース
自身が使うカスタムパラメータといった）必要と思われるどんな
機能でも実装することができます。

## 実装例

自らデータソースを書き起こしたいと思う理由でよくあるのは、
いつもの `Model::find()/save()/delete()` メソッドを使って
サードパーティの API にアクセスしたいという場合です。
ここでは架空のリモート JSON ベースの API にアクセスする
データソースを書いてみましょう。 `FarAwaySource` という名前で
`src/Model/Datasource/FarAwaySource.php` に置くことにします:

``` php
// src/Model/Datasource/FarAwaySource.php
class FarAwaySource extends DataSource
{
    /**
     * データソースの説明（オプション）
     */
    public $description = 'A far away datasource';

    /**
     * デフォルトの設定オプション。これらは `config/database.php`
     * でカスタマイズされ、 `__construct()` の中でマージされます。
     */
    public $config = [
        'apiKey' => '',
    ];

    /**
     * create() や update() を行いたい（実装したい）場合、利用できる
     * 項目を指定する必要があります。たとえば固定情報やスキーマの
     * 移行など、CakeSchema でやる場合と同じ配列キーを使います。
     */
    protected $_schema = [
        'id' => [
            'type' => 'integer',
            'null' => false,
            'key' => 'primary',
            'length' => 11,
        ],
        'name' => [
            'type' => 'string',
            'null' => true,
            'length' => 255,
        ],
        'message' => [
            'type' => 'text',
            'null' => true,
        ],
    ];

    /**
     * HttpSocket を生成し、設定の調整を行う。
     */
    public function __construct($config)
    {
        parent::__construct($config);
        $this->Http = new HttpSocket();
    }

    /**
     * データソースは通常データベースに接続するので、データベース
     * なしでも動くようにいくらか調整する必要があります。
     */

    /**
     * listSources() はキャッシュ操作を行います。あなたはカスタム
     * データソースでも独自のやり方でキャッシュ機構を実装したいと思う
     * かもしれません。とりあえず、単に `return null` してください。
     */
    public function listSources($data = null)
    {
        return null;
    }

    /**
     * describe() はモデルに対して `Model::save()` のための
     * スキーマを伝えます。
     *
     * モデルごとに異なったスキーマを使いたい場合もあるかもしれませんが、
     * それでも単一のデータソースを使ってください。その場合、モデルに
     * 対して `schema` プロパティをセットし、ここでは単に
     * `$model->schema` を返すようにします。
     */
    public function describe($model)
    {
        return $this->_schema;
    }

    /**
     * calculate() はレコード数のカウント方法を決定します。これは
     * `update()` と `delete()` の動作を決めるのに必要です。
     *
     * ここでは実際にはレコードのカウントはせず、 `read()` に渡されるべき
     * 文字列を返します。これが実際のカウント処理を行います。
     * 最も簡単なのは、ここでは単に 'COUNT' という文字列を返しておき、
     * `read()` の中で `$data['fields'] === 'COUNT'` かどうかを
     * 聞くようにすることです。
     */
    public function calculate(Model $model, $func, $params = [])
    {
        return 'COUNT';
    }

    /**
     * CRUD のうちの R を実装します。 `Model::find()` への呼び出しは
     * ここに来ます。
     */
    public function read(
        Model $model,
        $queryData = [],
        $recursive = null,
    ) {
        /**
         * ここでは、前述の calculate() メソッドで返されるカウントの
         * 実際の処理を行います。リモートソースのチェックをするか、
         * またはそれ以外の方法でレコードカウントを取得します。
         * ここでは単に 1 を返しているので、 `update()` や
         * `delete()` ではレコードが存在するものとみなされます。
         */
        if ($queryData['fields'] === 'COUNT') {
            return [[['count' => 1]]];
        }
        /**
         * ここではリモートデータを取得およびデコードして返します。
         */
        $queryData['conditions']['apiKey'] = $this->config['apiKey'];
        $json = $this->Http->get(
            'http://example.com/api/list.json',
            $queryData['conditions'],
        );
        $res = json_decode($json, true);
        if (is_null($res)) {
            $error = json_last_error();
            throw new CakeException($error);
        }

        return [$model->alias => $res];
    }

    /**
     * CRUD のうちの C を実装します。 `Model::save()` への呼び出しのうち
     *  $model->id がセットされないケースがここに来ます。
     */
    public function create(Model $model, $fields = null, $values = null)
    {
        $data = array_combine($fields, $values);
        $data['apiKey'] = $this->config['apiKey'];
        $json = $this->Http->post('http://example.com/api/set.json', $data);
        $res = json_decode($json, true);
        if (is_null($res)) {
            $error = json_last_error();
            throw new CakeException($error);
        }

        return true;
    }

    /**
     * CRUD のうちの U を実装します。 `Model::save()` への呼び出しのうち
     *  $model->id がセットされているケースがここに来ます。リモートソース
     *  に依存するためここでは単に `$this->create()` をコールできます。
     */
    public function update(
        Model $model,
        $fields = null,
        $values = null,
        $conditions = null,
    ) {
        return $this->create($model, $fields, $values);
    }

    /**
     * CRUD のうちの D を実装します。
     * `Model::delete()` への呼び出しがここに来ます。
     */
    public function delete(Model $model, $id = null)
    {
        $json = $this->Http->get('http://example.com/api/remove.json', [
            'id' => $id[$model->alias . '.id'],
            'apiKey' => $this->config['apiKey'],
        ]);
        $res = json_decode($json, true);
        if (is_null($res)) {
            $error = json_last_error();
            throw new CakeException($error);
        }

        return true;
    }
}
```

データソースを構成するには `config/database.php`
ファイルの中で以下のように追加します:

``` php
public $faraway = [
    'datasource' => 'FarAwaySource',
    'apiKey' => '1234abcd',
];
```

そしてモデルの中でデータベースを以下のように使います:

``` php
class MyModel extends AppModel
{
    public $useDbConfig = 'faraway';
}
```

これで、使い慣れたモデルのメソッドを使ってリモートソースから
データを取り出せるようになります:

``` php
// Get all messages from 'Some Person'
$messages = $this->MyModel->find('all', [
    'conditions' => ['name' => 'Some Person'],
]);
```

> [!TIP]
> あなたの `read` メソッドで返される配列のインデックスが数値以外の場合、
> find のタイプで `'all'` 以外を使うと予期しない結果が返る場合があります。

同様に、新しいメッセージを保存できます:

``` php
$this->MyModel->save([
    'name' => 'Some Person',
    'message' => 'New Message',
]);
```

以前のメッセージを更新します:

``` php
$this->MyModel->id = 42;
$this->MyModel->save([
    'message' => 'Updated message',
]);
```

そしてそのメッセージを削除します:

``` php
$this->MyModel->delete(42);
```

## データソースのプラグイン化

データソースをパッケージにしてプラグインにすることもできます。

単にあなたのデータソースファイルを
`plugins/[YourPlugin]/Model/Datasource/[YourSource].php`
に置いて、それをプラグイン記法で参照するだけです:

``` php
public $faraway = [
    'datasource' => 'MyPlugin.FarAwaySource',
    'apiKey' => 'abcd1234',
];
```

## SQL Server に接続する

SQL Server のデータソースは、[pdo_sqlsrv と呼ばれるマイクロソフトの
PHP エクステンション](https://github.com/Microsoft/msphpsql) に依存しています。
この PHP エクステンションは PHP の基本構成には含まれておらず、
Microsoft ODBC Driver for SQL Server とあわせて別途インストールする必要があります。
どちらも Linux、macOS、Windows 用が提供されています。

このため、SQL Server が以下のようなエラー:

    Error: Database connection "Sqlserver" is missing, or could not be created.

を出す場合は、まず `pdo_sqlsrv` エクステンションと ODBC ドライバが正しくインストール
されているかどうかを確認して下さい。

SQL Server への接続設定は次のようになります。

``` php
public $default = [
    'datasource' => 'Database/Sqlserver',
    'persistent' => false,
    'host' => 'localhost',
    'port' => 1433,
    'login' => 'sa',
    'password' => 'secret',
    'database' => 'cakephp',
    'schema' => 'dbo',
    'encoding' => 'utf8',
    'options' => [
        'TrustServerCertificate' => 'yes',
        'Encrypt' => 'no',
    ],
];
```

- `port` は DSN のサーバー名の後ろに付加されます (`server=localhost,1433`)。
- `schema` はテーブルがあるスキーマです。デフォルトは `dbo` です。
  同じデータベースの複数のスキーマにあるテーブルを使う場合は、データベースを分けるのではなく、
  `schema` の値を変えた接続をスキーマごとに定義してください。
- `options` には追加の DSN キーワードを指定します。SSL/TLS の設定である
  `Encrypt` や `TrustServerCertificate` などです。
- `encoding` に `utf8` を指定すると、ドライバは文字列を UTF-8 で扱います。
- `pdo_sqlsrv` ドライバは持続的接続に対応していないため、`persistent` は `false` にしてください。

::: pieceofcake2
SQL Server データソースに `port` と `options` の設定が追加され、
`schema` のデフォルト値が `dbo` になりました。`Sqlserver` クラスを継承している場合、
`describe()` の戻り値の型が `array` と宣言され、`insertMulti()` は `bool` を返すようになりました。
詳しくは [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。
:::
