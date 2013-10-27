Configuration
#############

Configuring a CakePHP application is a piece of cake. After you
have installed CakePHP, creating a basic web application requires
only that you setup a database configuration.

There are, however, other optional configuration steps you can take
in order to take advantage of CakePHP flexible architecture. You
can easily add to the functionality inherited from the CakePHP
core, configure additional/different URL mappings (routes), and
define additional/different inflections.

.. index:: app.php, app.php.default

.. index:: configuration

Configuring your application
============================

While CakePHP is a conventions over configuration framework, it still exposes
a number of configuration options that allow you to tailor CakePHP for your
needs. We've tried to ship CakePHP with useful defaults to get you developing more
rapidly.

Configuration is generally stored in either PHP or INI files, and loaded during
the application bootstrap. CakePHP comes with one configuration file by default,
but if required you can add additional configuration files and load them in
``App/Config/bootstrap.php``. :php:class:`Cake\\Core\\Configure` is used for
general configuration, and the adapter based classes provide ``config()``
methods to make configuration simple and transparent.

Loading additional configuration files
--------------------------------------

If your application has many configuration options it can be helpful to split
configuration into multiple files. After creating each of the files in your
``App/Config/`` directory you can load them during bootstrap.php::

    use Cake\Core\Configure;
    use Cake\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app.php', 'default', false);
    Configure::load('other_config.php', 'default');

You can also use additional configuration files to provide enviroment specific
overrides. Each file loaded after ``app.php`` can redefine previously declared
values allowing you to customize configuration for development or staging
environments.

General configuration
---------------------

Below is a description of the variables and how they affects your CakePHP
application.

debug
    Changes CakePHP debugging output. 0 = Production mode. No output. 1 = Show
    errors and warnings. 2 = Show errors, warnings, and enable SQL logging. SQL
    log is only shown when you add ``$this->element('sql_dump');`` to your view
    or layout.
App.namespace
    The namespace to find app classes under.
App.baseUrl
    Un-comment this definition if you **don’t** plan to use Apache’s
    mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess
    files too.
App.base
    The base directory the app resides in. If false this
    will be auto detected.
App.encoding
    Define what encoding your application uses.  This encoding
    is used to generate the charset in the layout, and encode entities.
    It should match the encoding values specified for your database.
App.webroot
    The webroot directory.
App.www_root
    The file path to webroot.
App.fullBaseUrl
    The fully qualified domain name (including protocol) to your application's
    root. This is used when generating absolute URLs. By default this is value
    is generated using the $_SERVER environment. However, you should define it
    manually to optimize performance or if you are concerned about people
    manipulating the ``Host`` header.
App.imageBaseUrl
    Web path to the public images directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
App.cssBaseUrl
    Web path to the public css directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
App.jsBaseUrl
    Web path to the public js directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
Security.salt
    A random string used in security hashing. This value is also used as the
    HMAC salt when doing symetric encryption.
Asset.timestamp
    Appends a timestamp which is last modified time of the particular
    file at the end of asset files urls (CSS, JavaScript, Image) when
    using proper helpers.
    Valid values:
    (bool) false - Doesn't do anything (default)
    (bool) true - Appends the timestamp when debug > 0
    (string) 'force' - Always appends the timestamp.
Acl.classname, Acl.database
    Used for CakePHP’s Access Control List functionality. See
    the Access Control Lists chapter for more information.

.. _database-configuration:

Database Configuration
======================

By convention database connections are configured in
``App/Config/app.php``. The connection information defined in this file,
is fed into :php:class:`Cake\\Database\\ConnectionManager` creating connection
configuration your application will be using. Sample connection information can
be found in ``App/Config/app.default.php``. A sample connection
configuration would look like::


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

The above will create a 'default' connection, with the provided parameters.  You
can also define additional connections at runtime using
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

The ``default`` connection is used unless another connection is
specified by the ``$useDbConfig`` property in a model. For example, if
my application has an additional legacy database in addition to the
default one, I could use it in my models by creating a new $legacy
database connection array similar to the $default array, and by
setting ``public $useDbConfig = 'legacy';`` in the appropriate models.

Fill out the key/value pairs in the configuration array to best
suit your needs.

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
    The file path to the SSL key file. (Only supported by MySQL, requires PHP
    5.3.7+).
ssl_cert
    The file path to the SSL certificate file. (Only supported by MySQL,
    requires PHP 5.3.7+).
ssl_ca
    The file path to the SSL certificate authority. (Only supported by MySQL,
    requires PHP 5.3.7+).
settings
    An array of key/value pairs that should be sent to the database server as
    ``SET`` commands when the connection is created. This option is only
    supported by MySQL, Postgres, and SQLserver at this time.
dsn
    A full PDO compatible data source name.

.. note::

    The prefix setting is for tables, **not** models. For example, if
    you create a join table for your Apple and Flavor models, you name
    it prefix\_apples\_flavors (**not**
    prefix\_apples\_prefix\_flavors), and set your prefix setting to
    'prefix\_'.

At this point, you might want to take a look at the
:doc:`/getting-started/cakephp-conventions`. The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big\_boxes, your model
BigBox, your controller BigBoxesController, everything just works
together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry\_stores, and savory\_cakes.


Caching Configuration
---------------------

See the :ref:`cache-configuration` for information on configuring caching in
CakePHP.

Error and Exception handling configuration
------------------------------------------

See the sections on :ref:`error-configuration` and
:ref:`exception-configuration` for information on configuring error and
exception handlers.

Logging configuration
---------------------

See the :ref:`log-configuration` for information on configuring logging in
CakePHP.

Email configuration
-------------------

See the :ref:`email-configuration` for information on configuring email presets in
CakePHP.

Session configuration
---------------------

See the :ref:`session-configuration` for information on configuring session
handling in CakePHP.

Routing configuration
---------------------

See :ref:`routes-configuration` for more information on configuring routing and
creating routes for your application.

Configuration Constants
-----------------------

While most configuration options are handled by Configure, there
are a few constants that CakePHP uses during runtime.

.. php:const:: LOG_ERROR

    Error constant. Used for differentiating error logging and
    debugging. Currently PHP supports LOG\_DEBUG.

.. _additional-class-paths:

Additional Class Paths
======================

Additional class paths are setup through the autoloaders your application uses.
When using ``composer`` to generate your autoloader, you could do the following,
to provide fallback paths for controllers in your application::

    "autoload": {
        "psr-0": {
            "App\\Controller": "/path/to/directory",
            "App\": "."
        }
    }

The above would setup paths for both the ``App`` and ``App\Controller``
namespace. The first key will be searched, and if that path does not contain the
class/file the second key will be searched. You can also map a single namespace
to multiple directories with the following::

    "autoload": {
        "psr-0": {
            "App\": [".", "/path/to/directory"]
        }
    }

View and plugin paths
---------------------

Since views and plugins are not classes, they cannot have an autoloader
configured. CakePHP provides two configure variables to setup additional paths
for these resources. In your ``App/Config/app.php`` you can set these
variables::

    $config = [
        // More configuration
        'App' => [
            'paths' => [
                'views' => [APP . 'View/', APP . 'View2/'],
                'plugins' => [ROOT . '/Plugin/', '/path/to/other/plugins/']
            ]
        ]
    ];

Paths should be suffixed with ``/``, or they will not work properly.


.. _inflection-configuration:

Inflection Configuration
========================

Cake's naming conventions can be really nice - you can name your
database table big\_boxes, your model BigBox, your controller
BigBoxesController, and everything just works together
automatically. The way CakePHP knows how to tie things together is
by *inflecting* the words between their singular and plural forms.

There are occasions (especially for our non-English speaking
friends) where you may run into situations where CakePHP's
inflector (the class that pluralizes, singularizes, camelCases, and
under\_scores) might not work as you'd like. If CakePHP won't
recognize your Foci or Fish, you can tell CakePHP about your
special cases.

Loading custom inflections
--------------------------

You can use :php:meth:`Cake\Utility\Inflector::rules()` in the file
``app/Config/bootstrap.php`` to load custom inflections::

    Inflector::rules('singular', [
        'rules' => ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'],
        'uninflected' => ['singulars'],
        'irregular' => ['spins' => 'spinor']
    ]);

or::

    Inflector::rules('plural', [
        'irregular' => ['phylum' => 'phyla']
    ]);

Will merge the supplied rules into the inflection sets defined in
lib/Cake/Utility/Inflector.php, with the added rules taking precedence
over the core rules.

Configure Class
===============

.. php:namespace:: Cake\Core

.. php:class:: Configure

Despite few things needing to be configured in CakePHP, it's
sometimes useful to have your own configuration rules for your
application. In the past you may have defined custom configuration
values by defining variable or constants in some files. Doing so
forces you to include that configuration file every time you needed
to use those values.

CakePHP's Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure we've set in place.

This class can be called from anywhere within your application, in a static
context::

    Configure::read('debug');

.. php:staticmethod:: write($key, $value)

    :param string $key: The key to write, can use be a :term:`dot notation` value.
    :param mixed $value: The value to store.

    Use ``write()`` to store data in the application's configuration::

        Configure::write('Company.name','Pizza, Inc.');
        Configure::write('Company.slogan','Pizza for your body and soul');

    .. note::

        The :term:`dot notation` used in the ``$key`` parameter can be used to
        organize your configuration settings into logical groups.

    The above example could also be written in a single call::

        Configure::write(
            'Company', array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul')
        );

    You can use ``Configure::write('debug', $int)`` to switch between
    debug and production modes on the fly. This is especially handy for
    AMF or JSON interactions where debugging information can cause
    parsing problems.

.. php:staticmethod:: read($key = null)

    :param string $key: The key to read, can use be a :term:`dot notation` value

    Used to read configuration data from the application. Defaults to
    CakePHP's important debug value. If a key is supplied, the data is
    returned. Using our examples from write() above, we can read that
    data back::

        Configure::read('Company.name');    //yields: 'Pizza, Inc.'
        Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'

        Configure::read('Company');

        //yields:
        array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

    If $key is left null, all values in Configure will be returned.

.. php:staticmethod:: check($key)

    :param string $key: The key to check.

    Used to check if a key/path exists and has not-null value.

.. php:staticmethod:: delete($key)

    :param string $key: The key to delete, can use be a :term:`dot notation` value

    Used to delete information from the application's configuration::

        Configure::delete('Company.name');

.. php:staticmethod:: version()

    Returns the CakePHP version for the current application.

.. php:staticmethod:: consume($key)

    Read and delete a key from Configure. This is useful when you want to
    combine reading and deleting values in a single operation.

    .. versionadded:: 3.0

.. php:staticmethod:: config($name, $engine)

    :param string $name: The name of the engine being attached.
    :param ConfigEngineInterface $engine: The engine instance being attached.

    Attach a configuration reader to Configure. Attached readers can
    then be used to load configuration files. See :ref:`loading-configuration-files`
    for more information on how to read configuration files.

.. php:staticmethod:: configured($name = null)

    :param string $name: The name of the engine to check, if null
        a list of all attached engines will be returned.

    Either check that a engine with a given name is attached, or get
    the list of attached engines.

.. php:staticmethod:: drop($name)

    Drops a connected engine object.


Reading and writing configuration files
=======================================

CakePHP comes with two built-in configuration file engines.
:php:class:`Cake\\Configure\\Engine\\PhpConfig` is able to read PHP config files, in the same
format that Configure has historically read. :php:class:`Cake\\Configure\\Engine\\IniConfig` is
able to read ini config files.  See the `PHP documentation <http://php.net/parse_ini_file>`_
for more information on the specifics of ini files.
To use a core config engine, you'll need to attach it to Configure
using :php:meth:`Configure::config()`::

    use Cake\\Configure\\Engine\\PhpConfig;
    // Read config files from app/Config
    Configure::config('default', new PhpConfig());

    // Read config files from another path.
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

You can have multiple engines attached to Configure, each reading
different kinds of configuration files, or reading from
different types of sources. You can interact with attached engines
using a few other methods on Configure. To see check which engine
aliases are attached you can use :php:meth:`Configure::configured()`::

    // Get the array of aliases for attached engines.
    Configure::configured();

    // Check if a specific engine is attached
    Configure::configured('default');

You can also remove attached engines. ``Configure::drop('default')``
would remove the default engine alias. Any future attempts to load configuration
files with that engine would fail.


.. _loading-configuration-files:

Loading configuration files
---------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

    :param string $key: The identifier of the configuration file to load.
    :param string $config: The alias of the configured engine.
    :param boolean $merge: Whether or not the contents of the read file
        should be merged, or overwrite the existing values.

Once you've attached a config engine to Configure you can load configuration files::

    // Load my_file.php using the 'default' engine object.
    Configure::load('my_file', 'default');

Loaded configuration files merge their data with the existing runtime configuration
in Configure. This allows you to overwrite and add new values
into the existing runtime configuration. By setting ``$merge`` to true, values
will not ever overwrite the existing configuration.

Creating or modifying configuration files
-----------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = array())

    :param string $key: The name of the file/stored configuration to be created.
    :param string $config: The name of the engine to store the data with.
    :param array $keys: The list of top-level keys to save.  Defaults to all
        keys.

Dumps all or some of the data in Configure into a file or storage system
supported by a config engine. The serialization format
is decided by the config engine attached as $config. For example, if the
'default' engine is a :php:class:`Cake\\Configure\\Engine\\PhpConfig`, the generated file will be a PHP
configuration file loadable by the :php:class:`Cake\\Configure\\Engine\\PhpConfig`

Given that the 'default' engine is an instance of PhpConfig.
Save all data in Configure to the file `my_config.php`::

    Configure::dump('my_config.php', 'default');

Save only the error handling configuration::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` can be used to either modify or overwrite
configuration files that are readable with :php:meth:`Configure::load()`


Storing runtime configuration
-----------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

    :param string $name: The storage key for the cache file.
    :param string $cacheConfig: The name of the cache configuration to store the
        configuration data with.
    :param mixed $data: Either the data to store, or leave null to store all data
        in Configure.

You can also store runtime configuration values for use in a future request.
Since configure only remembers values for the current request, you will
need to store any modified configuration information if you want to
use it in subsequent requests::

    // Store the current configuration in the 'user_1234' key in the 'default' cache.
    Configure::store('user_1234', 'default');

Stored configuration data is persisted in the :php:class:`Cache` class. This allows
you to store Configuration information in any storage engine that :php:class:`Cache` can talk to.

Restoring runtime configuration
-------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

    :param string $name: The storage key to load.
    :param string $cacheConfig: The cache configuration to load the data from.

Once you've stored runtime configuration, you'll probably need to restore it
so you can access it again. ``Configure::restore()`` does exactly that::

    // restore runtime configuration from the cache.
    Configure::restore('user_1234', 'default');

When restoring configuration information it's important to restore it with
the same key, and cache configuration as was used to store it. Restored
information is merged on top of the existing runtime configuration.

Creating your own Configuration engines
=======================================

Since configuration engines are an extensible part of CakePHP,
you can create configuration engines in your application and plugins.
Configuration engines need to implement the :php:interface:`Cake\\Configure\\ConfigEngineInterface`.
This interface defines a read method, as the only required method.
If you really like XML files, you could create a simple Xml config
engine for you application::

    // in app/Lib/Configure/Engine/XmlConfig.php
    use Cake\\Utility\\Xml;

    class XmlConfig implements ConfigEngineInterface {
        public function __construct($path = null) {
            if (!$path) {
                $path = APP . 'Config' . DS;
            }
            $this->_path = $path;
        }

        public function read($key) {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }

        // As of 2.3 a dump() method is also required
        public function dump($key, $data) {
            // code to dump data to file
        }
    }

In your ``app/Config/bootstrap.php`` you could attach this engine and use it::

    use Cake\\Configure\\Engine\\XmlConfig;
    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml');

The ``read()`` method of a config engine, must return an array of the configuration information
that the resource named ``$key`` contains.

.. php:namespace:: Cake\Configure

.. php:interface:: ConfigEngineInterface

    Defines the interface used by classes that read configuration data and
    store it in :php:class:`Configure`

.. php:method:: read($key)

    :param string $key: The key name or identifier to load.

    This method should load/parse the configuration data identified by ``$key``
    and return an array of data in the file.

.. php:method:: dump($key)

    :param string $key: The identifier to write to.
    :param array $data: The data to dump.

    This method should dump/store the provided configuration data to a key identified by ``$key``.

.. php:exception:: ConfigureException

    Thrown when errors occur when loading/storing/restoring configuration data.
    :php:interface:`ConfigEngineInterface` implementations should throw this
    error when they encounter an error.

Built-in Configuration engines
------------------------------

.. php:class:: PhpConfig

    Allows you to read configuration files that are stored as plain PHP files.
    You can read either files from your ``app/Config`` or from plugin configs
    directories by using :term:`plugin syntax`. Files **must** contain a ``$config``
    variable. An example configuration file would look like::

        $config = [
            'debug' => 0,
            'Security' => [
                'salt' => 'its-secret'
            ],
            'App' => [
                'namespace' => 'App'
            ]
        ];

    Files without ``$config`` will cause an :php:exc:`ConfigureException`

    Load your custom configuration file by inserting the following in app/Config/bootstrap.php::

        <?php
        Configure::load('customConfig');

.. php:class:: IniConfig

    Allows you to read configuration files that are stored as plain .ini files.
    The ini files must be compatible with php's ``parse_ini_file`` function, and
    benefit from the following improvements

    * dot separated values are expanded into arrays.
    * boolean-ish values like 'on' and 'off' are converted to booleans.

    An example ini file would look like::

        debug = 0

        [Security]
        salt = its-secret

        [App]
        namespace = App

    The above ini file, would result in the same end configuration data
    as the PHP example above. Array structures can be created either
    through dot separated values, or sections. Sections can contain
    dot separated keys for deeper nesting.

Bootstrapping CakePHP
=====================

If you have any additional configuration needs, use CakePHP's
bootstrap file, found in app/Config/bootstrap.php. This file is
executed just after CakePHP's core bootstrapping.

This file is ideal for a number of common bootstrapping tasks:

- Defining convenience functions.
- Registering global constants.
- Defining additional model, view, and controller paths.
- Creating cache configurations.
- Configuring inflections.
- Loading configuration files.

Be careful to maintain the MVC software design pattern when you add
things to the bootstrap file: it might be tempting to place
formatting functions there in order to use them in your
controllers.

Resist the urge. You'll be glad you did later on down the line.

You might also consider placing things in the :php:class:`AppController` class.
This class is a parent class to all of the controllers in your
application. :php:class:`AppController` is a handy place to use controller
callbacks and define methods to be used by all of your
controllers.


.. meta::
    :title lang=en: Configuration
    :keywords lang=en: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
