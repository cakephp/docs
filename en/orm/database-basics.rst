Database Basics
###############

.. php:namespace:: Cake\Database

The ORM and database access in CakePHP has been totally rebuilt for 3.0.
It features a new fluent API for building queries, improved schema
reflection/generation, a flexible type system and more.

.. _database-configuration:

Configuration
=============

By convention database connections are configured in ``App/Config/app.php``. The
connection information defined in this file is fed into
:php:class:`Cake\\Database\\ConnectionManager` creating the connection configuration
your application will be using. Sample connection information can be found in
``App/Config/app.default.php``. A sample connection configuration would look
like::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'login' => 'my_app',
            'password' => 'sekret',
            'database' => 'my_app',
            'prefix' => false,
            'encoding' => 'utf8',
            'timezone' => 'UTC'
        ]
    ],

The above will create a 'default' connection, with the provided parameters. You
can define as many connections as you want in your configuration file. You can
also define additional connections at runtime using
:php:meth:`Cake\\Database\\ConnectionManager::config()`. An example of that
would be::

    use Cake\Database\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'my_app',
        'password' => 'sekret',
        'database' => 'my_app',
        'prefix' => false,
        'encoding' => 'utf8',
        'timezone' => 'UTC'
    ]);

By default, all Table objects will use the ``default`` connection. To
use a non-default connection, see :ref:`configuring-table-connections`.

There are a number of keys supported in database configuration. A full list is
as follows:

className
    The class name of the driver used to power the connection. This can either
    be a short classname using :term:`plugin syntax`, a fully namespaced name, or
    a constructed driver instance. Examples of short classnames are Mysql,
    Sqlite, Postgres, and Sqlserver.
persistent
    Whether or not to use a persistent connection to the database.
host
    The database server's hostname (or IP address).
login
    The username for the account.
password
    The password for the account.
database
    The name of the database for this connection to use.
port (*optional*)
    The TCP port or Unix socket used to connect to the server.
encoding
    Indicates the character set to use when sending SQL statements to
    the server. This defaults to the database's default encoding for
    all databases other than DB2. If you wish to use UTF-8 encoding
    with mysql/mysqli connections you must use 'utf8' without the
    hyphen.
timezone
    Server timezone to set.
schema
    Used in PostgreSQL database setups to specify which schema to use.
unix_socket
    Used by drivers that support it to connect via Unix socket files. If you are
    using Postgres and want to use Unix sockets, leave the host key blank.
ssl_key
    The file path to the SSL key file. (Only supported by MySQL).
ssl_cert
    The file path to the SSL certificate file. (Only supported by MySQL).
ssl_ca
    The file path to the SSL certificate authority. (Only supported by MySQL).
init
    A list of queries that should be sent to the database server as
    when the connection is created. This option is only
    supported by MySQL, Postgres, and SQL Server at this time.
dsn
    A full PDO compatible data source name.
log
    Set to true to enable query logging. When enabled queries will be logged
    at a ``debug`` level with the ``queriesLog`` scope.
quoteIdentifiers
    Set to true if you are using reserved words or special characters in your
    table or column names. Enabling this setting will result in queries built using the
    :ref:`query-builder` having identifiers quoted when creating SQL. It should be
    noted that this decreases performance because each query needs to be traversed
    and manipulated before being executed.
flags
    An associative array of PDO constants that should be passed to the
    underlying PDO instance. See the PDO documentation for the flags supported
    by the driver you are using.

At this point, you might want to take a look at the
:doc:`/getting-started/cakephp-conventions`. The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big\_boxes, your table
BigBoxesTable, and your controller BigBoxesController, everything will
work together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry\_stores, and savory\_cakes.


Managing Connections
====================

.. php:class:: ConnectionManager

The ``ConnectionManager`` class acts as a registry to access database connections your
application has. It provides a place that other objects can get references to
existing connections.

Accessing Connections
---------------------

.. php:staticmethod:: get($name)

Once configured connections can be fetched using
:php:meth:`Cake\\Database\\ConnectionManager::get()`. This method will
construct and load a connection if it has not been built before, or return the
existing known connection::

    use Cake\Database\ConnectionManager;

    $conn = ConnectionManager::get('default');

Attempting to load connections that do not exist will throw an exception.

Creating Connections at Runtime
-------------------------------

.. php:staticmethod:: create($name, $config)

The ``create`` method allows you to define new connections that are not defined
in your configuration files at runtime::

    $conn = ConnectionManager::create('my_connection', $config);

See the :ref:`database-configuration` for more information on the configuration
data used when creating connections.


.. _database-data-types:

Data Types
==========

.. php:class:: Type

Since not every database vendor includes the same set of data types, or
the same names for similar data types, CakePHP provides a set of abstracted
data types for use with the database layer. The types CakePHP supports are:

string
    Generally backed by CHAR or VARCHAR columns. Using the ``fixed`` option
    will force a CHAR column.
text
    Maps to TEXT types
uuid
    Maps to the UUID type if a database provides one, otherwise this will
    generate a CHAR(36) field.
integer
    Maps to the INTEGER type provided by the database.
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
    booleans.
binary
    Maps to the BLOB or BYTEA type provided by the database.
date
    Maps to a timezone naive DATE column type.
datetime
    Maps to a timezone naive DATETIME column type. In postgres this turns into
    a TIMESTAMP type.
timestamp
    Maps to the TIMESTAMP type.
time
    Maps to a TIME type in all databases.

These types are used in both the schema reflection features that CakePHP
provides, and schema generation features CakePHP uses when using test fixtures.

Each type can also provide translation functions between PHP and SQL
representations. These methods are invoked based on the type hints provided when
doing queries. For example a column that is marked as 'datetime' will
automatically convert input parameters from ``DateTime`` instances into a
timestamp or formatted datestrings. Likewise, 'binary' columns will accept file
handles, and generate file handles when reading data.

Adding Custom Types
-------------------

.. php:staticmethod:: map($name, $class)

If you need to use vendor specific types that are not built into CakePHP you can
add additional new types to CakePHP's type system. Type classes are expected to
implement the following methods:

* toPHP
* toDatabase
* toStatement

An easy way to fulfill the basic interface is to extend
:php:class:`Cake\Database\Type`. For example if we wanted to add a JSON type,
we could make the following type class::

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type;

    class JsonType extends Type {

        public function toPHP($value, Driver $driver) {
            if ($value === null) {
                return null;
            }
            return json_decode($value, true);
        }

        public function toDatabase($value, Driver $driver) {
            return json_encode($value);
        }

    }

By default the ``toStatement`` method will treat values as strings which will
work for our new type. Once we've created our new type, we need to add it into
the type mapping. During our application bootstrap we should do the following::

    use Cake\Database\Type;

    Type::map('json', 'App\Database\Type\JsonType');

We can then overload the reflected schema data to use our new type, and
CakePHP's database layer will automatically convert our JSON data when creating
queries.

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

    $stmt = $conn->query('UPDATE posts SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

The ``query`` method does not allow for additional parameters. If you need
additional parameters you should use the ``execute()`` method, which allows for
placeholders to be used::

    $stmt = $conn->execute(
        'UPDATE posts SET published = ? WHERE id = ?',
        [1, 2]
    );

Without any type hinting information, ``execute`` will assume all placeholders
are string values. If you need to bind specific types of data, you can use their
abstract type names when creating a query::

    $stmt = $conn->execute(
        'UPDATE posts SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

This allows you to use rich data types in your applications and properly convert
them into SQL statements. The last and most flexible way of creating queries is
to use the :ref:`query-builder`. This apporach allows you to build complex and
expressive queries without having to use platform specific SQL::

    $query = $conn->newQuery();
    $query->update('posts')
        ->set(['publised' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

When using the query builder, no SQL will be sent to the database server until
the ``execute()`` method is called, or the query is iterated. Iterating a query
will first execute it and then start iterating over the result set::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('posts')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Do something with the row.
    }

.. note::

    When you have an instance of :php:class:`Cake\\ORM\\Query` you can use
    ``all()`` to get the result set for SELECT queries.

Using Transactions
-------------------

The connection objects provide you a few simple ways you do database
transactions. The most basic way of doing transactions is through the ``begin``,
``commit`` and ``rollback`` methods, which map to their SQL equivalents::

    $conn->begin();
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

In addition to this interface connection instances also provide the
``transactional`` method which makes handling the begin/commit/rollback calls
much simpler::

    $conn->transactional(function($conn) {
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    });

In addition to basic queries, you can execute more complex queries using either
the :ref:`query-builder` or :ref:`table-objects`. The transactional method will
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
``execute()`` method returns a statement with the provided values bound to it. While
``prepare()`` returns an incomplete statement::

    // Statements from execute will have values bound to them already.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Statements from prepare will be parameters for placeholders.
    // You need to bind parameters before attempting to execute it.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Once you've prepared a statement you can bind additional data and execute it.

Binding Values
--------------

Once you've created a prepared statement, you may need to bind additional data.
You can bind multiple values at once using the ``bind`` method, or bind
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
    $stmt->bindValue(0, true, 'boolean');
    $stmt->bindValue(1, new DateTime('2013-01-01'), 'date');

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
    foreach ($stmt as $row) {
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

Query Logging
=============

Query logging can be enabled when configuring your connection by setting the
``log`` option to true. You can also toggle query logging at runtime, using
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

    $conn->quoteIdentifiers(true);

When enabled, identifier quoting will cause additional query traversal that
converts all identifiers into ``IdentifierExpression`` objects.

.. note::

    SQL snippets contained in QueryExpression objects will not be modified.

