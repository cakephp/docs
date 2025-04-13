Database Basics
###############

The CakePHP database access layer abstracts and provides help with most aspects
of dealing with relational databases such as, keeping connections to the server,
building queries, preventing SQL injections, inspecting and altering schemas,
and with debugging and profiling queries sent to the database.

Quick Tour
==========

The functions described in this chapter illustrate what is possible to do with
the lower-level database access API. If instead you want to learn more about the
complete ORM, you can read the :doc:`/orm/query-builder` and
:doc:`/orm/table-objects` sections.

The easiest way to create a database connection is using a ``DSN`` string::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::setConfig('default', ['url' => $dsn]);

Once created, you can access the connection object to start using it::

    $connection = ConnectionManager::get('default');

.. note::
    For supported databases, see :doc:`installation notes </installation>`.

.. _running-select-statements:

Running Select Statements
-------------------------

Running raw SQL queries is a breeze::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

You can use prepared statements to insert parameters::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

It is also possible to use complex data types as arguments::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
    $results = $connection
        ->execute(
            'SELECT * FROM articles WHERE created >= :created',
            ['created' => new DateTime('1 day ago')],
            ['created' => 'datetime']
        )
        ->fetchAll('assoc');

Instead of writing the SQL manually, you can use the query builder::

    // Prior to 4.5 use $connection->query() instead.
    $results = $connection
        ->selectQuery('*', 'articles')
        ->where(['created >' => new DateTime('1 day ago')], ['created' => 'datetime'])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Running Insert Statements
-------------------------

Inserting rows in the database is usually a matter of a couple lines::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Running Update Statements
-------------------------

Updating rows in the database is equally intuitive, the following example will
update the article with **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);

Running Delete Statements
-------------------------

Similarly, the ``delete()`` method is used to delete rows from the database, the
following example deletes the article with **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->delete('articles', ['id' => 10]);

.. _database-configuration:

Configuration
=============

By convention database connections are configured in **config/app.php**. The
connection information defined in this file is fed into
:php:class:`Cake\\Datasource\\ConnectionManager` creating the connection configuration
your application will be using. Sample connection information can be found in
**config/app.default.php**. A sample connection configuration would look
like::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'secret',
            'database' => 'my_app',
            'encoding' => 'utf8mb4',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ],
    ],

The above will create a 'default' connection, with the provided parameters. You
can define as many connections as you want in your configuration file. You can
also define additional connections at runtime using
:php:meth:`Cake\\Datasource\\ConnectionManager::setConfig()`. An example of that
would be::

    use Cake\Datasource\ConnectionManager;

    ConnectionManager::setConfig('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'secret',
        'database' => 'my_app',
        'encoding' => 'utf8mb4',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);

Configuration options can also be provided as a :term:`DSN` string. This is
useful when working with environment variables or :term:`PaaS` providers::

    ConnectionManager::setConfig('default', [
        'url' => 'mysql://my_app:sekret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

When using a DSN string you can define any additional parameters/options as
query string arguments.

By default, all Table objects will use the ``default`` connection. To
use a non-default connection, see :ref:`configuring-table-connections`.

There are a number of keys supported in database configuration. A full list is
as follows:

className
    The fully namespaced class name of the class that represents the connection to a database server.
    This class is responsible for loading the database driver, providing SQL
    transaction mechanisms and preparing SQL statements among other things.
driver
    The class name of the driver used to implement all specificities for
    a database engine. This can either be a short classname using :term:`plugin syntax`,
    a fully namespaced name, or a constructed driver instance.
    Examples of short classnames are Mysql, Sqlite, Postgres, and Sqlserver.
persistent
    Whether or not to use a persistent connection to the database. This option
    is not supported by SqlServer. An exception is thrown if you attempt to set
    ``persistent`` to ``true`` with SqlServer.
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
    should be an absolute path (for example, ``ROOT . DS . 'my_app.db'``) to avoid
    incorrect paths caused by relative paths.
port (*optional*)
    The TCP port or Unix socket used to connect to the server.
encoding
    Indicates the character set to use when sending SQL statements to
    the server. This defaults to the database's default encoding for
    all databases other than DB2.
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
    store meta data in. Having metadata caching disabled by setting it to ``false``
    is not advised and can result in very poor performance. See the
    :ref:`database-metadata-cache` section for more information.
mask
    Set the permissions on the generated database file. (Only supported by SQLite)
cache
    The ``cache`` flag to send to SQLite.
mode
    The ``mode`` flag value to send to SQLite.


At this point, you might want to take a look at the
:doc:`/intro/conventions`. The correct naming for your tables (and the addition
of some columns) can score you some free functionality and help you avoid
configuration. For example, if you name your database table big\_boxes, your
table BigBoxesTable, and your controller BigBoxesController, everything will
work together automatically. By convention, use underscores, lower case, and
plural forms for your database table names - for example: bakers,
pastry\_stores, and savory\_cakes.

.. note::

    If your MySQL server is configured with ``skip-character-set-client-handshake``
    then you MUST use the ``flags`` config to set your charset encoding. For example::

        'flags' => [\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8']

.. _read-and-write-connections:

Read and Write Connections
==========================

Connections can have separate read and write roles. Read
roles are expected to represent read-only replicas and write roles are expected
to be the default connection and support write operations.

Read roles are configured by providing a ``read`` key in the connection config.
Write roles are configured by providing a ``write`` key.

Role configurations override the values in the shared connection config. If the read
and write role configurations are the same, a single connection to the database is used
for both::

    'default' => [
        'driver' => 'mysql',
        'username' => '...',
        'password' => '...',
        'database' => '...',
        'read' => [
            'host' => 'read-db.example.com',
        ],
        'write' => [
            'host' => 'write-db.example.com',
        ]
    ];

You can specify the same value for both ``read`` and ``write`` key without creating
multiple connections to the database.

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

    $connection = ConnectionManager::get('default');

Attempting to load connections that do not exist will throw an exception.

Creating Connections at Runtime
-------------------------------

Using ``setConfig()`` and ``get()`` you can create new connections that are not
defined in your configuration files at runtime::

    ConnectionManager::setConfig('my_connection', $config);
    $connection = ConnectionManager::get('my_connection');

See the :ref:`database-configuration` for more information on the configuration
data used when creating connections.

.. _database-data-types:

.. php:namespace:: Cake\Database

Data Types
==========

.. php:class:: TypeFactory

Since not every database vendor includes the same set of data types, or
the same names for similar data types, CakePHP provides a set of abstracted
data types for use with the database layer. The types CakePHP supports are:

string
    Maps to ``VARCHAR`` type. In SQL Server the ``NVARCHAR`` types are used.
char
    Maps to ``CHAR`` type. In SQL Server the ``NCHAR`` type is used.
text
    Maps to ``TEXT`` types.
uuid
    Maps to the UUID type if a database provides one, otherwise this will
    generate a ``CHAR(36)`` field.
binaryuuid
    Maps to the UUID type if the database provides one, otherwise this will
    generate a ``BINARY(16)`` column
nativeuuid
    Maps to the UUID type in MySQL with MariaDb. In all other databases,
    ``nativeuuid`` is an alias for ``uuid``.
integer
    Maps to the ``INTEGER`` type provided by the database. BIT is not yet supported
    at this moment.
smallinteger
    Maps to the ``SMALLINT`` type provided by the database.
tinyinteger
    Maps to the ``TINYINT`` or ``SMALLINT`` type provided by the database. In MySQL
    ``TINYINT(1)`` is treated as a boolean.
biginteger
    Maps to the ``BIGINT`` type provided by the database.
float
    Maps to either ``DOUBLE`` or ``FLOAT`` depending on the database. The ``precision``
    option can be used to define the precision used.
decimal
    Maps to the ``DECIMAL`` type. Supports the ``length`` and  ``precision``
    options. Values for decimal type ares be represented as strings (not as float
    as some might expect). This is because decimal types are used to represent
    exact numeric values in databases and using float type for them in PHP can
    potentially lead to precision loss.

    If you want the values to be `float` in your PHP code then consider using
    `FLOAT` or `DOUBLE` type columns in your database. Also, depending on your use
    case you can explicitly map your decimal columns to `float` type in your table
    schema.
boolean
    Maps to ``BOOLEAN`` except in MySQL, where ``TINYINT(1)`` is used to represent
    booleans. ``BIT(1)`` is not yet supported at this moment.
binary
    Maps to the ``BLOB`` or ``BYTEA`` type provided by the database.
date
    Maps to a native ``DATE`` column type. The return value of this column
    type is :php:class:`Cake\\I18n\\Date` which emulates the date related
    methods of PHP's ``DateTime`` class.
datetime
    See :ref:`datetime-type`.
datetimefractional
    See :ref:`datetime-type`.
timestamp
    Maps to the ``TIMESTAMP`` type.
timestampfractional
    Maps to the ``TIMESTAMP(N)`` type.
time
    Maps to a ``TIME`` type in all databases.
json
    Maps to a ``JSON`` type if it's available, otherwise it maps to ``TEXT``.
enum
    See :ref:`enum-type`.
geometry
    Maps to a generic geometry storage type.
point
    Maps to a single point in geospatial storage.
linestring
    Maps to a single line in geospatial storage.
polygon
    Maps to a single polygon in geospatial storage.

These types are used in both the schema reflection features that CakePHP
provides, and schema generation features CakePHP uses when using test fixtures.

Each type can also provide translation functions between PHP and SQL
representations. These methods are invoked based on the type hints provided when
doing queries. For example a column that is marked as 'datetime' will
automatically convert input parameters from ``DateTime`` instances into a
timestamp or formatted datestrings. Likewise, 'binary' columns will accept file
handles, and generate file handles when reading data.

.. versionchanged:: 5.1.0
   The ``geometry``, ``point``, ``linestring``, and ``polygon`` types were
   added.

.. versionchanged:: 5.2.0
    The ``nativeuuid`` type was added.

.. _datetime-type:

DateTime Type
-------------

.. php:class:: DateTimeType

Maps to a native ``DATETIME`` column type. In PostgreSQL and SQL Server this
turns into a ``TIMESTAMP`` type. The default return value of this column type is
:php:class:`Cake\\I18n\\DateTime` which extends `Chronos
<https://github.com/cakephp/chronos>`_ and the native ``DateTimeImmutable``.

.. php:method:: setTimezone(string|\DateTimeZone|null $timezone)

If your database server's timezone does not match your application's PHP timezone
then you can use this method to specify your database's timezone. This timezone
will then used when converting PHP objects to database's datetime string and
vice versa.

.. php:class:: DateTimeFractionalType

Can be used to map datetime columns that contain microseconds such as
``DATETIME(6)`` in MySQL. To use this type you need to add it as a mapped type::

    // in config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeFractionalType;

    // Overwrite the default datetime type with a more precise one.
    TypeFactory::map('datetime', DateTimeFractionalType::class);

.. php:class:: DateTimeTimezoneType

Can be used to map datetime columns that contain time zones such as
``TIMESTAMPTZ`` in PostgreSQL. To use this type you need to add it as a mapped type::

    // in config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeTimezoneType;

    // Overwrite the default datetime type with a more precise one.
    TypeFactory::map('datetime', DateTimeTimezoneType::class);

.. _enum-type:

Enum Type
---------

.. php:class:: EnumType

Maps a `BackedEnum <https://www.php.net/manual/en/language.enumerations.backed.php>`_ to a string or integer column.
To use this type you need to specify which column is associated to which BackedEnum inside the table class::

    use App\Model\Enum\ArticleStatus;
    use Cake\Database\Type\EnumType;

    // in src/Model/Table/ArticlesTable.php
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->getSchema()->setColumnType('status', EnumType::from(ArticleStatus::class));
    }

Where ``ArticleStatus`` contains something like::

    namespace App\Model\Enum;

    enum ArticleStatus: string
    {
        case Published = 'Y';
        case Unpublished = 'N';
    }

CakePHP recommends a few conventions for enums:

- Enum classnames should follow ``{Entity}{ColumnName}`` style to enable
  detection while running bake and to aid with project consistency.
- Enum cases should use CamelCase style.
- Enums should implement the ``Cake\Database\Type\EnumLabelInterface`` to
  improve compatibility with bake, and ``FormHelper``.

Geospatial Types
----------------

The ``geometry``, ``point``, ``linestring``, and ``polygon`` types are also known
as the "geospatial types". CakePHP offers limited support for geospatial
columns. Currently they can be defined in migrations, read in schema reflection,
and have values set as text.

.. versionadded:: 5.1.0
   Geospatial schema types were added.

.. _adding-custom-database-types:

Adding Custom Types
-------------------

.. php:class:: TypeFactory
.. php:staticmethod:: map($name, $class)

If you need to use vendor specific types that are not built into CakePHP you can
add additional new types to CakePHP's type system. Type classes are expected to
implement the following methods:

* ``toPHP``: Casts given value from a database type to a PHP equivalent.
* ``toDatabase``: Casts given value from a PHP type to one acceptable by a database.
* ``toStatement``: Casts given value to its Statement equivalent.
* ``marshal``: Marshals flat data into PHP objects.

To fulfill the basic interface, extend :php:class:`Cake\\Database\\Type`.
For example if we wanted to add a PointMutation type, we could make the following type
class::

    // in src/Database/Type/PointMutationType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type\BaseType;
    use PDO;

    class PointMutationType extends BaseType
    {
        public function toPHP(mixed $value, Driver $driver): mixed
        {
            if ($value === null) {
                return null;
            }

            return $this->pmDecode($valu

        public function marshal(mixed $value): mixed
        {
            if (is_array($value) || $value === null) {
                return $value;
            }

            return $this->pmDecode($value);
        }

        public function toDatabase(mixed $value, Driver $driver): mixed
        {
            return sprintf('%d%s>%s', $value['position'], $value['from'], $value['to']);
        }

        public function toStatement(mixed $value, Driver $driver): int
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }

            return PDO::PARAM_STR;
        }

        protected function pmDecode(mixed $value): mixed
        {
            if (preg_match('/^(\d+)([a-zA-Z])>([a-zA-Z])$/', $value, $matches)) {
                return [
                    'position' => (int) $matches[1],
                    'from' => $matches[2],
                    'to' => $matches[3]
                ];
            }

            return null;
        }
    }

By default the ``toStatement()`` method will treat values as strings which will
work for our new type.

Connecting Custom Datatypes to Schema Reflection and Generation
---------------------------------------------------------------

Once we've created our new type, we need to add it into
the type mapping. During our application bootstrap we should do the following::

    use Cake\Database\TypeFactory;

    TypeFactory::map('point_mutation', \App\Database\Type\PointMutationType:class);


We then have two ways to use our datatype in our models.

#. The first path is to overwrite the reflected schema data to use our new type.
#. The second is to implement ``Cake\Database\Type\ColumnSchemaAwareInterface``
   and define the SQL column type and reflection logic.

Overwriting the reflected schema with our custom type will enable CakePHP's
database layer to automatically convert PointMutation data when creating queries. In your
Table's :ref:`getSchema() method <saving-complex-types>` add the

following::

    class WidgetsTable extends Table
    {
        public function initialize(array $config): void
        {
            return parent::getSchema()->setColumnType('mutation', 'point_mutation');

        }
    }

Implementing ``ColumnSchemaAwareInterface`` gives you more control over
custom datatypes.  This avoids overwriting schema definitions if your
datatype has an unambiguous SQL column definition. For example, we could have
our PointMutation type be used anytime a ``TEXT`` column with a specific comment is
used::

    // in src/Database/Type/PointMutationType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ColumnSchemaAwareInterface;
    use Cake\Database\Schema\TableSchemaInterface;
    use PDO;

    class PointMutationType extends BaseType
        implements ColumnSchemaAwareInterface
    {
        // other methods from earlier

        /**
         * Convert abstract schema definition into a driver specific
         * SQL snippet that can be used in a CREATE TABLE statement.
         *
         * Returning null will fall through to CakePHP's built-in types.
         */
        public function getColumnSql(
            TableSchemaInterface $schema,
            string $column,
            Driver $driver
        ): ?string {
            $data = $schema->getColumn($column);
            $sql = $driver->quoteIdentifier($column);
            $sql .= ' JSON';
            if (isset($data['null']) && $data['null'] === false) {
                $sql .= ' NOT NULL';
            }

            return $sql;
        }

        /**
         * Convert the column data returned from schema reflection
         * into the abstract schema data.
         *
         * Returning null will fall through to CakePHP's built-in types.
         */
        public function convertColumnDefinition(
            array $definition,
            Driver $driver
        ): ?array {
            return [
                'type' => $this->_name,
                'length' => null,
            ];
        }

The ``$definition`` data passed to ``convertColumnDefinition()`` will contain
the following keys. All keys will exist but may contain ``null`` if the key has
no value for the current database driver:

- ``length`` The length of a column if available..
- ``precision`` The precision of the column if available.
- ``scale`` Can be included for SQLServer connections.

.. _mapping-custom-datatypes-to-sql-expressions:

Mapping Custom Datatypes to SQL Expressions
-------------------------------------------

The previous example maps a custom datatype for a 'point_mutation' column type
which is easily represented as a string in a SQL statement. Complex SQL data
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
            // Parse the WKB data from MySQL.
            $unpacked = unpack('x4/corder/Ltype/dlat/dlong', $value);

            return new static($unpacked['lat'], $unpacked['long']);
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
    use Cake\Database\Driver;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\ExpressionInterface;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, Driver $d): mixed
        {
            return $value === null ? null : Point::parse($value);
        }

        public function marshal($value): mixed
        {
            if (is_string($value)) {
                $value = explode(',', $value);
            }
            if (is_array($value)) {
                return new Point($value[0], $value[1]);
            }

            return null;
        }

        public function toExpression($value): ExpressionInterface
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

        public function toDatabase($value, Driver $driver): mixed
        {
            return $value;
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

.. php:method:: execute(string $sql, array $params = [], array $types = []): \Cake\Database\StatementInterface

Once you've gotten a connection object, you'll probably want to issue some
queries with it. CakePHP's database abstraction layer provides wrapper features
on top of PDO and native drivers. These wrappers provide a similar interface to
PDO. There are a few different ways you can run queries depending on the type of
query you need to run and what kind of results you need back. The most basic
method is ``execute()`` which allows you to run complet SQL queries::

    $statement = $connection->execute('UPDATE articles SET published = 1 WHERE id = 2');

For parameterized queries use the 2nd argument::

    $statement = $connection->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Without any type hinting information, ``execute`` will assume all placeholders
are string values. If you need to bind specific types of data, you can use their
abstract type names when creating a query::

    $statement = $connection->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: selectQuery()

These methods allow you to use rich data types in your applications and properly convert
them into SQL statements. The last and most flexible way of creating queries is
to use the :doc:`/orm/query-builder`. This approach allows you to build complex and
expressive queries without having to use platform specific SQL. When using the
query builder, no SQL will be sent to the database server until the ``execute()``
method is called, or the query is iterated. Iterating a query will first execute
it and then start iterating over the result set::

    $query = $connection->selectQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Do something with the row.
    }

.. note::

    Instead of iterating the ``$query`` you can also call it's ``all()`` method
    to get the results.

.. php:method:: updateQuery()

This method provides you a builder for ``UPDATE`` queries::

    $query = $connection->updateQuery('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $statement = $query->execute();

.. php:method:: insertQuery()

This method provides you a builder for ``INSERT`` queries::

    $query = $connection->insertQuery();
    $query->into('articles')
        ->columns(['title'])
        ->values(['1st article']);
    $statement = $query->execute();

.. php:method:: deleteQuery()

This method provides you a builder for ``DELETE`` queries::

    $query = $connection->deleteQuery();
    $query->delete('articles')
        ->where(['id' => 2]);
    $statement = $query->execute();

Using Transactions
------------------

The connection objects provide you a few simple ways you do database
transactions. The most basic way of doing transactions is through the ``begin()``,
``commit()`` and ``rollback()`` methods, which map to their SQL equivalents::

    $connection->begin();
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $connection->commit();

.. php:method:: transactional(callable $callback)

In addition to this interface connection instances also provide the
``transactional()`` method which makes handling the begin/commit/rollback calls
much simpler::

    $connection->transactional(function ($connection) {
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
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
``execute()`` you will have a ``StatementInterface`` instance.

Executing & Fetching Rows
-------------------------

Once a query is executed using ``execute()``, results can be fetched using
``fetch()``, ``fetchAll()``::

    $statement->execute();

    // Read one row.
    $row = $statement->fetch('assoc');

    // Read all rows.
    $rows = $statement->fetchAll('assoc');

Getting affected Row Counts
---------------------------

After executing a statement, you can fetch the number of affected rows::

    $rowCount = $statement->rowCount();

Checking Error Codes
--------------------

If your query was not successful, you can get related error information
using the ``errorCode()`` and ``errorInfo()`` methods. These methods work the
same way as the ones provided by PDO::

    $code = $statement->errorCode();
    $info = $statement->errorInfo();

.. _database-query-logging:

Query Logging
=============

Query logging can be enabled when configuring your connection by setting the
``log`` option to ``true``.

When query logging is enabled, queries will be logged to
:php:class:`Cake\\Log\\Log` using the 'debug' level, and the 'queriesLog' scope.
You will need to have a logger configured to capture this level & scope. Logging
to ``stderr`` can be useful when working on unit tests, and logging to
files/syslog can be useful when working with web requests::

    use Cake\Log\Log;

    // Console logging
    Log::setConfig('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // File logging
    Log::setConfig('queries', [
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

    $connection->getDriver()->enableAutoQuoting();

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
:doc:`/console-commands/schema-cache` chapter for more information.

Creating Databases
==================

If you want to create a connection without selecting a database you can omit
the database name::

    $dsn = 'mysql://root:password@localhost/';
    ConnectionManager::setConfig('setup', ['url' => $dsn]);

You can now use your connection object to execute queries that create/modify
databases. For example to create a database::

    $connection = ConnectionManager::get('setup');
    $connection->execute("CREATE DATABASE IF NOT EXISTS my_database");

.. note::

    When creating a database it is a good idea to set the character set and
    collation parameters (e.g. ``DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci``). 
    If these values are missing, the database will set whatever system default values it uses.

.. meta::
    :title lang=en: Database Basics
    :keywords lang=en: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,database,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,caching
