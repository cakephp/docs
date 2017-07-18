O básico sobre banco de dados
#############################

A camada de acesso a banco de dados do CakePHP abstrai e fornece auxilio com
a maioria dos aspectos de lidar com bancos de dados relacionais como, manter
conexões com o servidor, contruir consultas, prevenir injeções SQL, inspecionar
e alterar schemas, e com debugging e profiling de consultas enviadas ao banco
de dados.

Tour Rápido
===========

As funções descritas nesse capítulo ilustram o que é possível fazer com a API
de acesso a banco de dados de baixo-nível. Se ao invés, você deseja aprender
mais sobre o ORM completo, você pode ler as seções :doc:`/orm/query-builder` e
:doc:`/orm/table-objects`.

A maneira mais fácil de crir uma conexão de banco de dados é usando uma string 
``DSN``::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::config('default', ['url' => $dsn]);

Uma vez criada, você pode acessar o objeto da conexo para iniciar a usá-lo::

    $connection = ConnectionManager::get('default');

Bancos de Dados Suportados
--------------------------

O CakePHP suporta os seguintes servidores de banco de dados relacionais:

* MySQL 5.1+
* SQLite 3
* PostgreSQL 8+
* SQLServer 2008+
* Oracle (atravéz de um plugin da comunidade)

Você precisará da extensão PDO correta instalada para cada um dos drivers de
banco de dados acima. As APIs processuais não são suportadas.
O banco de dados Oracle é suportado atravéz do plugin da comunidade
`Driver para Banco de Dados Oracle <https://github.com/CakeDC/cakephp-oracle-driver>`_

The Oracle database is supported through the
`Driver for Oracle Database <https://github.com/CakeDC/cakephp-oracle-driver>`_.

.. _running-select-statements:

Executando Instruções de Consulta
---------------------------------

Executar consultas SQL é uma moleza::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

Você pode usar prepared statement para inserir parâmetros::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

Também é possível usar tipos de dados complexos como argumentos::

    $results = $connection
        ->execute(
            'SELECT * FROM articles WHERE created >= :created',
            ['created' => DateTime('1 day ago')],
            ['created' => 'datetime']
        )
        ->fetchAll('assoc');

Ao invés de escrever a SQL manualmente, você pode usar o query builder::

    $results = $connection
        ->newQuery()
        ->select('*')
        ->from('articles')
        ->where(['created >' => new DateTime('1 day ago'), ['created' => 'datetime']])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Executando Instruções de Inserção
---------------------------------

Inserir registros no banco de dados é geralmente uma questão de algumas linhas::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Executando Instruções de Atualização
------------------------------------

Atualizar registros no banco de dados é igualmente intuitivo, o exemplo a seguir
atualizará o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);


Executando Instruções de Exclusão
---------------------------------

Da mesma forma, o método ``delete()`` é usado para excluír registros do banco de
dados, o exemplo a seguir exclui o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->delete('articles', ['id' => 10]);

.. _database-configuration:

Configuração
============

Por convenção, as conexões de banco de dados são configuradas em **config/app.php**. As
informações de conexão definida nesse arquivo são alimentadas em 
:php:class:`Cake\\Datasource\\ConnectionManager`, criando a configuração de
conexão que sua aplicação usará. Exemplo de informação de conexão pode ser
encontrada em **config/app.default.php**. Um exemplo de configuração de conexão
poderia parecer com::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'sekret',
            'database' => 'my_app',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ]
    ],

O exemplo acima criará a conexão 'default', com os parâmetros fornecidos. Você pode
definir quantas conexões quiser no seu arquivo de configuração. Você também pode
definir conexões adicionais em tempo de execução usando o método
:php:meth:`Cake\\Datasource\\ConnectionManager::config()`. Um exemplo disso seria::

    use Cake\Datasource\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'sekret',
        'database' => 'my_app',
        'encoding' => 'utf8',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);


As opções de configuração também podem ser fornecidas como uma string :term:`DSN`.
Isso é útil ao trabalhar com variáveis de ambiente ou :term:`PaaS` providers::

    ConnectionManager::config('default', [
        'url' => 'mysql://my_app:sekret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

Ao usar uma string DSN, você pode definir qualquer parâmetros/opções adicionais como
argumentos de query string.

Por padrão, todos objetos Table usará a conexão ``default``. Para usar
uma conexão não-padrão, consulte :ref:`configuring-table-connections`.

Existem várias keys suportadas na configuração de banco de dados. Uma lista
completa é a seguinte:

className
    The fully namespaced class name of the class that represents the connection to a database server.
    This class is responsible for loading the database driver, providing SQL
    transaction mechanisms and preparing SQL statements among other things.
driver
    The class name of the driver used to implements all specificities for
    a database engine. This can either be a short classname using :term:`plugin syntax`,
    a fully namespaced name, or a constructed driver instance.
    Examples of short classnames are Mysql, Sqlite, Postgres, and Sqlserver.
persistent
    Whether or not to use a persistent connection to the database.
host
    The database server's hostname (or IP address).
username
    The username for the account.
password
    The password for the account.
database
    The name of the database for this connection to use. Avoid using ``.`` in
    your database name. Because of how it complicates identifier quoting CakePHP
    does not support ``.`` in database names. The path to your SQLite database
    should be an absolute path (e.g. ``ROOT . DS . 'my_app.db'``) to avoid
    incorrect paths caused by relative paths.
port (*optional*)
    The TCP port or Unix socket used to connect to the server.
encoding
    Indicates the character set to use when sending SQL statements to
    the server. This defaults to the database's default encoding for
    all databases other than DB2. If you wish to use UTF-8 encoding
    with MySQL connections you must use 'utf8' without the
    hyphen.
timezone
    Server timezone to set.
schema
    Used in PostgreSQL database setups to specify which schema to use.
unix_socket
    Used by drivers that support it to connect via Unix socket files. If you are
    using PostgreSQL and want to use Unix sockets, leave the host key blank.
ssl_key
    The file path to the SSL key file. (Only supported by MySQL).
ssl_cert
    The file path to the SSL certificate file. (Only supported by MySQL).
ssl_ca
    The file path to the SSL certificate authority. (Only supported by MySQL).
init
    A list of queries that should be sent to the database server as
    when the connection is created.
log
    Set to ``true`` to enable query logging. When enabled queries will be logged
    at a ``debug`` level with the ``queriesLog`` scope.
quoteIdentifiers
    Set to ``true`` if you are using reserved words or special characters in
    your table or column names. Enabling this setting will result in queries
    built using the :doc:`/orm/query-builder` having identifiers quoted when
    creating SQL. It should be noted that this decreases performance because
    each query needs to be traversed and manipulated before being executed.
flags
    An associative array of PDO constants that should be passed to the
    underlying PDO instance. See the PDO documentation for the flags supported
    by the driver you are using.
cacheMetadata
    Either boolean ``true``, or a string containing the cache configuration to
    store meta data in. Having metadata caching disable is not advised and can
    result in very poor performance. See the :ref:`database-metadata-cache`
    section for more information.

At this point, you might want to take a look at the
:doc:`/intro/conventions`. The correct naming for your tables (and the addition
of some columns) can score you some free functionality and help you avoid
configuration. For example, if you name your database table big\_boxes, your
table BigBoxesTable, and your controller BigBoxesController, everything will
work together automatically. By convention, use underscores, lower case, and
plural forms for your database table names - for example: bakers,
pastry\_stores, and savory\_cakes.

.. php:namespace:: Cake\Datasource

Managing Connections
====================

.. php:class:: ConnectionManager

The ``ConnectionManager`` class acts as a registry to access database
connections your application has. It provides a place that other objects can get
references to existing connections.

Accessing Connections
---------------------

.. php:staticmethod:: get($name)

Once configured connections can be fetched using
:php:meth:`Cake\\Datasource\\ConnectionManager::get()`. This method will
construct and load a connection if it has not been built before, or return the
existing known connection::

    use Cake\Datasource\ConnectionManager;

    $conn = ConnectionManager::get('default');

Attempting to load connections that do not exist will throw an exception.

Creating Connections at Runtime
-------------------------------

Using ``config()`` and ``get()`` you can create new connections that are not
defined in your configuration files at runtime::

    ConnectionManager::config('my_connection', $config);
    $conn = ConnectionManager::get('my_connection');

See the :ref:`database-configuration` for more information on the configuration
data used when creating connections.

.. _database-data-types:

.. php:namespace:: Cake\Database

Data Types
==========

.. php:class:: Type

Since not every database vendor includes the same set of data types, or
the same names for similar data types, CakePHP provides a set of abstracted
data types for use with the database layer. The types CakePHP supports are:

string
    Generally backed by CHAR or VARCHAR columns. Using the ``fixed`` option
    will force a CHAR column. In SQL Server, NCHAR and NVARCHAR types are used.
text
    Maps to TEXT types.
uuid
    Maps to the UUID type if a database provides one, otherwise this will
    generate a CHAR(36) field.
integer
    Maps to the INTEGER type provided by the database. BIT is not yet supported
    at this moment.
biginteger
    Maps to the BIGINT type provided by the database.
float
    Maps to either DOUBLE or FLOAT depending on the database. The ``precision``
    option can be used to define the precision used.
decimal
    Maps to the DECIMAL type. Supports the ``length`` and  ``precision``
    options.
boolean
    Maps to BOOLEAN except in MySQL, where TINYINT(1) is used to represent
    booleans. BIT(1) is not yet supported at this moment.
binary
    Maps to the BLOB or BYTEA type provided by the database.
date
    Maps to a timezone naive DATE column type. The return value of this column
    type is :php:class:`Cake\\I18n\\Date` which extends the native ``DateTime``
    class.
datetime
    Maps to a timezone naive DATETIME column type. In PostgreSQL, and SQL Server
    this turns into a TIMESTAMP type. The default return value of this column
    type is :php:class:`Cake\\I18n\\Time` which extends the built-in
    ``DateTime`` class and `Chronos <https://github.com/cakephp/chronos>`_.
timestamp
    Maps to the TIMESTAMP type.
time
    Maps to a TIME type in all databases.
json
    Maps to a JSON type if it's available, otherwise it maps to TEXT. The 'json'
    type was added in 3.3.0

These types are used in both the schema reflection features that CakePHP
provides, and schema generation features CakePHP uses when using test fixtures.

Each type can also provide translation functions between PHP and SQL
representations. These methods are invoked based on the type hints provided when
doing queries. For example a column that is marked as 'datetime' will
automatically convert input parameters from ``DateTime`` instances into a
timestamp or formatted datestrings. Likewise, 'binary' columns will accept file
handles, and generate file handles when reading data.

.. _adding-custom-database-types:

Adding Custom Types
-------------------

.. php:staticmethod:: map($name, $class)

If you need to use vendor specific types that are not built into CakePHP you can
add additional new types to CakePHP's type system. Type classes are expected to
implement the following methods:

* ``toPHP``: Casts given value from a database type to a PHP equivalent.
* ``toDatabase``: Casts given value from a PHP type to one acceptable by a database.
* ``toStatement``: Casts given value to its Statement equivalent.
* ``marshal``: Marshals flat data into PHP objects.

An easy way to fulfill the basic interface is to extend
:php:class:`Cake\\Database\\Type`. For example if we wanted to add a JSON type,
we could make the following type class::

    // in src/Database/Type/JsonType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type;
    use PDO;

    class JsonType extends Type
    {

        public function toPHP($value, Driver $driver)
        {
            if ($value === null) {
                return null;
            }
            return json_decode($value, true);
        }

        public function marshal($value)
        {
            if (is_array($value) || $value === null) {
                return $value;
            }
            return json_decode($value, true);
        }

        public function toDatabase($value, Driver $driver)
        {
            return json_encode($value);
        }

        public function toStatement($value, Driver $driver)
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }
            return PDO::PARAM_STR;
        }

    }

By default the ``toStatement()`` method will treat values as strings which will
work for our new type. Once we've created our new type, we need to add it into
the type mapping. During our application bootstrap we should do the following::

    use Cake\Database\Type;

    Type::map('json', 'App\Database\Type\JsonType');

.. versionadded:: 3.3.0
    The JsonType described in this example was added to the core.

We can then overload the reflected schema data to use our new type, and
CakePHP's database layer will automatically convert our JSON data when creating
queries. You can use the custom types you've created by mapping the types in
your Table's :ref:`_initializeSchema() method <saving-complex-types>`::

    use Cake\Database\Schema\TableSchema;

    class WidgetsTable extends Table
    {

        protected function _initializeSchema(TableSchema $schema)
        {
            $schema->columnType('widget_prefs', 'json');
            return $schema;
        }

    }

.. _mapping-custom-datatypes-to-sql-expressions:

Mapping Custom Datatypes to SQL Expressions
-------------------------------------------

.. versionadded:: 3.3.0
    Support for mapping custom data types to SQL expressions was added in 3.3.0.

The previous example maps a custom datatype for a 'json' column type which is
easily represented as a string in a SQL statement. Complex SQL data
types cannot be represented as strings/integers in SQL queries. When working
with these datatypes your Type class needs to implement the
``Cake\Database\Type\ExpressionTypeInterface`` interface. This interface lets
your custom type represent a value as a SQL expression. As an example, we'll
build a simple Type class for handling ``POINT`` type data out of MySQL. First
we'll define a 'value' object that we can use to represent ``POINT`` data in
PHP::

    // in src/Database/Point.php
    namespace App\Database;

    // Our value object is immutable.
    class Point
    {
        protected $_lat;
        protected $_long;

        // Factory method.
        public static function parse($value)
        {
            // Parse the data from MySQL.
            return new static($value[0], $value[1]);
        }

        public function __construct($lat, $long)
        {
            $this->_lat = $lat;
            $this->_long = $long;
        }

        public function lat()
        {
            return $this->_lat;
        }

        public function long()
        {
            return $this->_long;
        }
    }

With our value object created, we'll need a Type class to map data into this
value object and into SQL expressions::

    namespace App\Database\Type;

    use App\Database\Point;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\Type as BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, Driver $d)
        {
            return Point::parse($value);
        }

        public function marshal($value)
        {
            if (is_string($value)) {
                $value = explode(',', $value);
            }
            if (is_array($value)) {
                return new Point($value[0], $value[1]);
            }
            return null;
        }

        public function toExpression($value)
        {
            if ($value instanceof Point) {
                return new FunctionExpression(
                    'POINT',
                    [
                        $value->lat(),
                        $value->long()
                    ]
                );
            }
            if (is_array($value)) {
                return new FunctionExpression('POINT', [$value[0], $value[1]]);
            }
            // Handle other cases.
        }
    }

The above class does a few interesting things:

* The ``toPHP`` method handles parsing the SQL query results into a value
  object.
* The ``marshal`` method handles converting, data such as given request data, into our value object.
  We're going to accept string values like ``'10.24,12.34`` and arrays for now.
* The ``toExpression`` method handles converting our value object into the
  equivalent SQL expressions. In our example the resulting SQL would be
  something like ``POINT(10.24, 12.34)``.

Once we've built our custom type, we'll need to :ref:`connect our type
to our table class <saving-complex-types>`.

.. _immutable-datetime-mapping:

Enabling Immutable DateTime Objects
-----------------------------------

.. versionadded:: 3.2
    Immutable date/time objects were added in 3.2.

Because Date/Time objects are easily mutated in place, CakePHP allows you to
enable immutable value objects. This is best done in your application's
**config/bootstrap.php** file::

    Type::build('datetime')->useImmutable();
    Type::build('date')->useImmutable();
    Type::build('time')->useImmutable();
    Type::build('timestamp')->useImmutable();

.. note::
    New applications will have immutable objects enabled by default.

Connection Classes
==================

.. php:class:: Connection

Connection classes provide a simple interface to interact with database
connections in a consistent way. They are intended as a more abstract interface to
the driver layer and provide features for executing queries, logging queries, and doing
transactional operations.

.. _database-queries:

Executing Queries
-----------------

.. php:method:: query($sql)

Once you've gotten a connection object, you'll probably want to issue some
queries with it. CakePHP's database abstraction layer provides wrapper features
on top of PDO and native drivers. These wrappers provide a similar interface to
PDO. There are a few different ways you can run queries depending on the type of
query you need to run and what kind of results you need back. The most basic
method is ``query()`` which allows you to run already completed SQL queries::

    $stmt = $conn->query('UPDATE articles SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

The ``query()`` method does not allow for additional parameters. If you need
additional parameters you should use the ``execute()`` method, which allows for
placeholders to be used::

    $stmt = $conn->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Without any type hinting information, ``execute`` will assume all placeholders
are string values. If you need to bind specific types of data, you can use their
abstract type names when creating a query::

    $stmt = $conn->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

This allows you to use rich data types in your applications and properly convert
them into SQL statements. The last and most flexible way of creating queries is
to use the :doc:`/orm/query-builder`. This approach allows you to build complex and
expressive queries without having to use platform specific SQL::

    $query = $conn->newQuery();
    $query->update('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

When using the query builder, no SQL will be sent to the database server until
the ``execute()`` method is called, or the query is iterated. Iterating a query
will first execute it and then start iterating over the result set::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Do something with the row.
    }

.. note::

    When you have an instance of :php:class:`Cake\\ORM\\Query` you can use
    ``all()`` to get the result set for SELECT queries.

Using Transactions
------------------

The connection objects provide you a few simple ways you do database
transactions. The most basic way of doing transactions is through the ``begin()``,
``commit()`` and ``rollback()`` methods, which map to their SQL equivalents::

    $conn->begin();
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

In addition to this interface connection instances also provide the
``transactional()`` method which makes handling the begin/commit/rollback calls
much simpler::

    $conn->transactional(function ($conn) {
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    });

In addition to basic queries, you can execute more complex queries using either
the :doc:`/orm/query-builder` or :doc:`/orm/table-objects`. The transactional method will
do the following:

- Call ``begin``.
- Call the provided closure.
- If the closure raises an exception, a rollback will be issued. The original
  exception will be re-thrown.
- If the closure returns ``false``, a rollback will be issued.
- If the closure executes successfully, the transaction will be committed.

Interacting with Statements
===========================

When using the lower level database API, you will often encounter statement
objects. These objects allow you to manipulate the underlying prepared statement
from the driver. After creating and executing a query object, or using
``execute()`` you will have a ``StatementDecorator`` instance. It wraps the
underlying basic statement object and provides a few additional features.

Preparing a Statement
---------------------

You can create a statement object using ``execute()``, or ``prepare()``. The
``execute()`` method returns a statement with the provided values bound to it.
While ``prepare()`` returns an incomplete statement::

    // Statements from execute will have values bound to them already.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Statements from prepare will be parameters for placeholders.
    // You need to bind parameters before attempting to execute it.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Once you've prepared a statement you can bind additional data and execute it.

.. _database-basics-binding-values:

Binding Values
--------------

Once you've created a prepared statement, you may need to bind additional data.
You can bind multiple values at once using the ``bind()`` method, or bind
individual elements using ``bindValue``::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Bind multiple values
    $stmt->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Bind a single value
    $stmt->bindValue(1, true, 'boolean');
    $stmt->bindValue(2, new DateTime('2013-01-01'), 'date');

When creating statements you can also use named array keys instead of
positional ones::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Bind multiple values
    $stmt->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Bind a single value
    $stmt->bindValue('published', true, 'boolean');
    $stmt->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::

    You cannot mix positional and named array keys in the same statement.

Executing & Fetching Rows
-------------------------

After preparing a statement and binding data to it, you can execute it and fetch
rows. Statements should be executed using the ``execute()`` method. Once
executed, results can be fetched using ``fetch()``, ``fetchAll()`` or iterating
the statement::

    $stmt->execute();

    // Read one row.
    $row = $stmt->fetch('assoc');

    // Read all rows.
    $rows = $stmt->fetchAll('assoc');

    // Read rows through iteration.
    foreach ($rows as $row) {
        // Do work
    }

.. note::

    Reading rows through iteration will fetch rows in 'both' mode. This means
    you will get both the numerically indexed and associatively indexed results.


Getting Row Counts
------------------

After executing a statement, you can fetch the number of affected rows::

    $rowCount = count($stmt);
    $rowCount = $stmt->rowCount();


Checking Error Codes
--------------------

If your query was not successful, you can get related error information
using the ``errorCode()`` and ``errorInfo()`` methods. These methods work the
same way as the ones provided by PDO::

    $code = $stmt->errorCode();
    $info = $stmt->errorInfo();

.. todo::
    Possibly document CallbackStatement and BufferedStatement

.. _database-query-logging:

Query Logging
=============

Query logging can be enabled when configuring your connection by setting the
``log`` option to ``true``. You can also toggle query logging at runtime, using
``logQueries``::

    // Turn query logging on.
    $conn->logQueries(true);

    // Turn query logging off
    $conn->logQueries(false);

When query logging is enabled, queries will be logged to
:php:class:`Cake\\Log\\Log` using the 'debug' level, and the 'queriesLog' scope.
You will need to have a logger configured to capture this level & scope. Logging
to ``stderr`` can be useful when working on unit tests, and logging to
files/syslog can be useful when working with web requests::

    use Cake\Log\Log;

    // Console logging
    Log::config('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // File logging
    Log::config('queries', [
        'className' => 'File',
        'path' => LOGS,
        'file' => 'queries.log',
        'scopes' => ['queriesLog']
    ]);

.. note::

    Query logging is only intended for debugging/development uses. You should
    never leave query logging on in production as it will negatively impact the
    performance of your application.

.. _identifier-quoting:

Identifier Quoting
==================

By default CakePHP does **not** quote identifiers in generated SQL queries. The
reason for this is identifier quoting has a few drawbacks:

* Performance overhead - Quoting identifiers is much slower and complex than not doing it.
* Not necessary in most cases - In non-legacy databases that follow CakePHP's
  conventions there is no reason to quote identifiers.

If you are using a legacy schema that requires identifier quoting you can enable
it using the ``quoteIdentifiers`` setting in your
:ref:`database-configuration`. You can also enable this feature at runtime::

    $conn->driver()->autoQuoting(true);

When enabled, identifier quoting will cause additional query traversal that
converts all identifiers into ``IdentifierExpression`` objects.

.. note::

    SQL snippets contained in QueryExpression objects will not be modified.

.. _database-metadata-cache:

Metadata Caching
================

CakePHP's ORM uses database reflection to determine the schema, indexes and
foreign keys your application contains. Because this metadata changes
infrequently and can be expensive to access, it is typically cached. By default,
metadata is stored in the ``_cake_model_`` cache configuration. You can define
a custom cache configuration using the ``cacheMetatdata`` option in your
datasource configuration::

    'Datasources' => [
        'default' => [
            // Other keys go here.

            // Use the 'orm_metadata' cache config for metadata.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

You can also configure the metadata caching at runtime with the
``cacheMetadata()`` method::

    // Disable the cache
    $connection->cacheMetadata(false);

    // Enable the cache
    $connection->cacheMetadata(true);

    // Use a custom cache config
    $connection->cacheMetadata('orm_metadata');

CakePHP also includes a CLI tool for managing metadata caches. See the
:doc:`/console-and-shells/orm-cache` chapter for more information.

Creating Databases
==================

If you want to create a connection without selecting a database you can omit
the database name::

    $dsn = 'mysql://root:password@localhost/';

You can now use your connection object to execute queries that create/modify
databases. For example to create a database::

    $connection->query("CREATE DATABASE IF NOT EXISTS my_database");

.. note::

    When creating a database it is a good idea to set the character set and
    collation parameters. If these values are missing, the database will set
    whatever system default values it uses.

.. meta::
    :title lang=en: Database Basics
    :keywords lang=en: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,database,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,caching
