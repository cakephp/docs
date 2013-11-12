Database basics
###############

The ORM and database access in CakePHP has been totally rebuilt for 3.0.
It features a new fluent API for building queries, improved schema
reflection/generation, a flexible type system and more.

.. _database-configuration:

Configuration
=============

By convention database connections are configured in ``App/Config/app.php``. The
connection information defined in this file, is fed into
:php:class:`Cake\\Database\\ConnectionManager` creating connection configuration
your application will be using. Sample connection information can be found in
``App/Config/app.default.php``. A sample connection configuration would look
like::


    'Datasources' => [
        'default' => [
            'className' => 'Mysql',
            'database' => 'my_app',
            'login' => 'my_app',
            'password' => 'sekret',
            'host' => 'localhost',
            'encoding' => 'utf8',
        ]
    ],

The above will create a 'default' connection, with the provided parameters. You
can define as many connections as you want in your configuration file. You can
also define additional connections at runtime using
:php:meth:`Cake\\Database\\ConnectionManager::config()`. An example of that
would be::

    use Cake\Database\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Mysql',
        'database' => 'my_app',
        'login' => 'my_app',
        'password' => 'sekret',
        'host' => 'localhost',
        'encoding' => 'utf8',
    ]);

By default, all Table objects will use the ``default`` connection. To
use a non-default connection, see :ref:`configuring-table-connections`.

There are a number of keys supported in database configuration. A full list is
as follows:

className
    The class name of the driver used to power the connection. This can either
    be a short classname using :ref:`plugin-syntax`, a fully namespaced name, or
    a constructed driver instance. Examples of short classnames are Mysql,
    Sqlite, Postgres, Sqlserver.
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
schema
    Used in PostgreSQL database setups to specify which schema to use.
unix_socket
    Used by drivers that support it to connect via unix socket files. If you are
    using postgres and want to use unix sockets, leave the host key blank.
ssl_key
    The file path to the SSL key file. (Only supported by MySQL).
ssl_cert
    The file path to the SSL certificate file. (Only supported by MySQL).
ssl_ca
    The file path to the SSL certificate authority. (Only supported by MySQL).
settings
    An array of key/value pairs that should be sent to the database server as
    ``SET`` commands when the connection is created. This option is only
    supported by MySQL, Postgres, and SQLserver at this time.
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

At this point, you might want to take a look at the
:doc:`/getting-started/cakephp-conventions`. The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big\_boxes, your model
BigBoxes, your controller BigBoxesController, everything just works
together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry\_stores, and savory\_cakes.


Getting connections
===================

Once configured connections can be fetched using
:php:meth:`Cake\\Database\\ConnectionManager::get()`. This method will
construct and load a connection if it has not been built before, or return the
existing known connection::

    use Cake\Database\ConnectionManager;

    $conn = ConnectionManager::get('default');

Attempting to load connections that do not exist will throw an exception.

Data types
==========

Since not every database vendor includes the same set of data types, or even
uses similar names for similar data types. CakePHP provides a set of abstracted
data types for use with the database layer. The types CakePHP supports are:

string
    Generally backed by CHAR or VARCHAR columns. Using the ``fixed`` option
    will force a CHAR column.
text
uuid
    UUID
integer
biginteger
float
decimal
boolean
binary
date
datetime
timestamp
time


Each type also provides translation
functions between PHP and SQL representations. This allows for ``DateTime``
instances to be accepted/returned when dealing with ``date``, ``datetime``, or
``timestamp`` column types.

Creating custom types
---------------------

If you need to use vendor specific types that are not built into CakePHP you can
add additional new types to CakePHP's type system.

.. todo:: Complete


Executing queries
=================

Once you've gotten a connection object, you'll probably want to issue some
queries with it. CakePHP's database abstraction layer provides wrapper features
on top of PDO and native drivers. These wrappers provide a similar interface to
PDO. There are a few different ways you can run queries depending on the type of
query you need to run and what kind of results you need back. The most basic
method is ``query()`` which allows you to run already completed SQL queries::

    $stmt = $conn->query('UPDATE posts SET published = 1 WHERE id = 2');

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

Interacting with statements
===========================



Using transactions
===================

Query logging
=============

Identifier quoting
==================

