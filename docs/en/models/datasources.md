# DataSources

DataSources are the link between models and the source of data that
models represent. In many cases, the data is retrieved from a
relational database such as MySQL, PostgreSQL or Microsoft SQL Server. CakePHP is
distributed with several database-specific datasources (see the
class files in `src/Cake/Model/Datasource/Database` of the
`pieceofcake2/cakephp` package). All of them use PDO, so the matching PDO
extension must be installed:

| Datasource | Supported versions | PHP extension |
|----|----|----|
| `Database/Mysql` | MySQL 5.6, 5.7, 8.0+ (MariaDB is also detected) | `pdo_mysql` |
| `Database/Postgres` | PostgreSQL 9.4+ | `pdo_pgsql` |
| `Database/Sqlite` | SQLite 3 | `pdo_sqlite` |
| `Database/Sqlserver` | Microsoft SQL Server 2022+ | `pdo_sqlsrv` |

> [!NOTE]
> You can find additional datasources (CSV/TSV files, arrays and more) in the
> [Datasources plugin](https://github.com/pieceofcake2/datasources).

When specifying a database connection configuration in
`config/database.php` (`app/Config/database.php` in the legacy layout),
CakePHP transparently uses the corresponding
database datasource for all model operations. So, even though you might not have
known about datasources, you've been using them all along.

## Connection Settings

The application skeleton ships `config/database.php.default`; copy it to
`config/database.php` and edit the connections. Each connection is a public
property of the `DATABASE_CONFIG` class:

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

The `encoding` setting is passed to the driver when the connection is opened:
for MySQL it is added to the DSN as `charset=...`, and for PostgreSQL as
`options='--client_encoding=...'`. You can still change the encoding of an open
connection with `setEncoding()`.

For PostgreSQL, the `sslmode` setting (`disable`, `allow`, `prefer`,
`require`, ...) is added to the DSN only when you set it. If you leave it out,
the default of the PostgreSQL client library applies.

The `flags` setting is an array of PDO attributes passed to the PDO
constructor. On PHP 8.1 and later, `pdo_mysql` and `pdo_sqlite` return
integer and float columns as PHP `int` and `float` instead of strings. If your
application relies on the old behavior (for example strict comparisons with
strings), set `PDO::ATTR_STRINGIFY_FETCHES`:

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
The `encoding` setting is passed in the
DSN instead of running `SET NAMES` after connecting, and PostgreSQL `sslmode`
no longer defaults to `allow`. The MySQL and PostgreSQL drivers have new
methods such as `getVersion()`, which custom drivers extending them may need
to implement. See the [migration guide](/appendices/migrating-from-cakephp-2-10).
:::

All of the above sources derive from a base `DboSource` class, which
aggregates some logic that is common to most relational databases. If you decide
to write a RDBMS datasource, working from one of these (e.g. MySQL, or SQLite)
is your best bet.

Most people, however, are interested in writing datasources for external sources
of data, such as remote REST APIs or even an LDAP server. So that's what we're
going to look at now.

## Basic API For DataSources

A datasource can, and *should* implement at least one of the
following methods: `create`, `read`, `update` and/or
`delete` (the actual method signatures & implementation details
are not important for the moment, and will be described later). You
need not implement more of the methods listed above than necessary
- if you need a read-only datasource, there's no reason to
implement `create`, `update`, and `delete`.

Methods that must be implemented for all CRUD methods:

- `describe($model)`
- `listSources($data = null)`
- `calculate($model, $func, $params)`
- At least one of:
  - `create(Model $model, $fields = null, $values = null)`
  - `read(Model $model, $queryData = [], $recursive = null)`
  - `update(Model $model, $fields = null, $values = null, $conditions = null)`
  - `delete(Model $model, $id = null)`

It is also possible (and sometimes quite useful) to define the
`$_schema` class attribute inside the datasource itself, instead
of in the model.

And that's pretty much all there is to it. By coupling this
datasource to a model, you are then able to use
`Model::find()/save()/delete()` as you would normally, and the appropriate
data and/or parameters used to call those methods will be passed on
to the datasource itself, where you can decide to implement
whichever features you need (e.g. Model::find options such as
`'conditions'` parsing, `'limit'` or even your own custom
parameters).

## An Example

A common reason you would want to write your own datasource is when you would
like to access a 3rd party API using the usual `Model::find()/save()/delete()`
methods. Let's write a datasource that will access a fictitious remote JSON
based API. We'll call it `FarAwaySource` and we'll put it in
`src/Model/Datasource/FarAwaySource.php`:

``` php
// src/Model/Datasource/FarAwaySource.php
class FarAwaySource extends DataSource
{
    /**
     * An optional description of your datasource
     */
    public $description = 'A far away datasource';

    /**
     * Our default config options. These options will be customized in our
     * `config/database.php` and will be merged in the `__construct()`.
     */
    public $config = [
        'apiKey' => '',
    ];

    /**
     * If we want to create() or update() we need to specify the fields
     * available. We use the same array keys as we do with CakeSchema, eg.
     * fixtures and schema migrations.
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
     * Create our HttpSocket and handle any config tweaks.
     */
    public function __construct($config)
    {
        parent::__construct($config);
        $this->Http = new HttpSocket();
    }

    /**
     * Since datasources normally connect to a database there are a few things
     * we must change to get them to work without a database.
     */

    /**
     * listSources() is for caching. You'll likely want to implement caching in
     * your own way with a custom datasource. So just `return null`.
     */
    public function listSources($data = null)
    {
        return null;
    }

    /**
     * describe() tells the model your schema for `Model::save()`.
     *
     * You may want a different schema for each model but still use a single
     * datasource. If this is your case then set a `schema` property on your
     * models and simply return `$model->schema` here instead.
     */
    public function describe($model)
    {
        return $this->_schema;
    }

    /**
     * calculate() is for determining how we will count the records and is
     * required to get `update()` and `delete()` to work.
     *
     * We don't count the records here but return a string to be passed to
     * `read()` which will do the actual counting. The easiest way is to just
     * return the string 'COUNT' and check for it in `read()` where
     * `$data['fields'] === 'COUNT'`.
     */
    public function calculate(Model $model, $func, $params = [])
    {
        return 'COUNT';
    }

    /**
     * Implement the R in CRUD. Calls to `Model::find()` arrive here.
     */
    public function read(
        Model $model,
        $queryData = [],
        $recursive = null,
    ) {
        /**
         * Here we do the actual count as instructed by our calculate()
         * method above. We could either check the remote source or some
         * other way to get the record count. Here we'll simply return 1 so
         * `update()` and `delete()` will assume the record exists.
         */
        if ($queryData['fields'] === 'COUNT') {
            return [[['count' => 1]]];
        }
        /**
         * Now we get, decode and return the remote data.
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
     * Implement the C in CRUD. Calls to `Model::save()` without $model->id
     * set arrive here.
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
     * Implement the U in CRUD. Calls to `Model::save()` with $Model->id
     * set arrive here. Depending on the remote source you can just call
     * `$this->create()`.
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
     * Implement the D in CRUD. Calls to `Model::delete()` arrive here.
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

We can then configure the datasource in our `config/database.php` file
by adding something like this:

``` php
public $faraway = [
    'datasource' => 'FarAwaySource',
    'apiKey' => '1234abcd',
];
```

Then use the database config in our models like this:

``` php
class MyModel extends AppModel
{
    public $useDbConfig = 'faraway';
}
```

We can retrieve data from our remote source using the familiar model methods:

``` php
// Get all messages from 'Some Person'
$messages = $this->MyModel->find('all', [
    'conditions' => ['name' => 'Some Person'],
]);
```

> [!TIP]
> Using find types other than `'all'` can have unexpected results if the
> result of your `read` method is not a numerically indexed array.

Similarly we can save a new message:

``` php
$this->MyModel->save([
    'name' => 'Some Person',
    'message' => 'New Message',
]);
```

Update the previous message:

``` php
$this->MyModel->id = 42;
$this->MyModel->save([
    'message' => 'Updated message',
]);
```

And delete the message:

``` php
$this->MyModel->delete(42);
```

## Plugin DataSources

You can also package Datasources into plugins.

Simply place your datasource file into
`plugins/[YourPlugin]/Model/Datasource/[YourSource].php`
and refer to it using the plugin notation:

``` php
public $faraway = [
    'datasource' => 'MyPlugin.FarAwaySource',
    'apiKey' => 'abcd1234',
];
```

## Connecting to SQL Server

The Sqlserver datasource depends on
[Microsoft's PHP extension called pdo_sqlsrv](https://github.com/Microsoft/msphpsql).
This PHP extension is not included in the base installation of PHP and must be
installed separately, together with the Microsoft ODBC Driver for SQL Server.
Both are available for Linux, macOS and Windows.

So if the Sqlserver Datasource errors out with:

    Error: Database connection "Sqlserver" is missing, or could not be created.

First check if the `pdo_sqlsrv` extension and the ODBC driver are installed
properly.

A SQL Server connection looks like this:

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

- `port` is appended to the server name in the DSN (`server=localhost,1433`).
- `schema` is the schema that holds your tables. It defaults to `dbo`. To use
  tables in several schemas of the same database, define one connection per
  schema with a different `schema` value instead of creating several databases.
- `options` is a list of additional DSN keywords, such as the SSL/TLS settings
  `Encrypt` and `TrustServerCertificate`.
- `encoding` set to `utf8` makes the driver use UTF-8 for strings.
- `persistent` must be `false`; the `pdo_sqlsrv` driver does not support
  persistent connections.

::: pieceofcake2
The SQL Server datasource gained the
`port` and `options` settings and defaults `schema` to `dbo`. If you extend the
`Sqlserver` class, `describe()` now declares an `array` return type and
`insertMulti()` returns `bool`. See the [migration guide](/appendices/migrating-from-cakephp-2-10).
:::

