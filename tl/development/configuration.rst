Configuration
#############

While conventions remove the need to configure all of CakePHP, you'll still need
to configure a few things like your database credentials.

Additionally, there are optional configuration options that allow you to swap
out default values & implementations with ones tailored to your application.

.. index:: app.php, app.php.default

.. index:: configuration

Configuring your Application
============================

<<<<<<< HEAD
Configuration is generally stored in either PHP or INI files, and loaded during
the application bootstrap. CakePHP comes with one configuration file by default,
but if required you can add additional configuration files and load them in
your application's bootstrap code. :php:class:`Cake\\Core\\Configure` is used
for global configuration, and classes like ``Cache`` provide ``config()``
methods to make configuration simple and transparent.
=======
The $default connection array is used unless another connection is
specified by the ``$useDbConfig`` property in a model. For example, if
my application has an additional legacy database in addition to the
default one, I could use it in my models by creating a new $legacy
database connection array similar to the $default array, and by
setting ``public $useDbConfig = 'legacy';`` in the appropriate models.

Fill out the key/value pairs in the configuration array to best
suit your needs.

datasource
    The name of the datasource this configuration array is for.
    Examples: Database/Mysql, Database/Sqlserver, Database/Postgres, Database/Sqlite.
    You can use :term:`plugin syntax` to indicate plugin datasource to use.
persistent
    Whether or not to use a persistent connection to the database. When using
    SQLServer you should not enable persistent connections as it causes
    difficult to diagnose crashes in older versions of CakePHP or, as of version
    2.10.2, an exception will be thrown.
host
    The database server's hostname (or IP address).
login
    The username for the account.
password
    The password for the account.
database
    The name of the database for this connection to use.
prefix (*optional*)
    The string that prefixes every table name in the database. If your
    tables don't have prefixes, set this to an empty string.
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
    using PostgreSQL and want to use unix sockets, leave the host key blank.
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
    supported by the Mysql, Postgres, and Sqlserver datasources at this time.

.. versionchanged:: 2.4
    The ``settings``, ``ssl_key``, ``ssl_cert`` and ``ssl_ca`` keys
    was added in 2.4.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Loading Additional Configuration Files
--------------------------------------

If your application has many configuration options it can be helpful to split
configuration into multiple files. After creating each of the files in your
**config/** directory you can load them in **bootstrap.php**::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

<<<<<<< HEAD
You can also use additional configuration files to provide environment specific
overrides. Each file loaded after **app.php** can redefine previously declared
values allowing you to customize configuration for development or staging
environments.
=======
    Add information about specific options for different database
    vendors, such as Microsoft SQL Server, PostgreSQL and MySQL.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

General Configuration
---------------------

Below is a description of the variables and how they affect your CakePHP
application.

debug
    Changes CakePHP debugging output. ``false`` = Production mode. No error
    messages, errors, or warnings shown. ``true`` = Errors and warnings shown.
App.namespace
    The namespace to find app classes under.

    .. note::

        When changing the namespace in your configuration, you will also
        need to update your **composer.json** file to use this namespace
        as well. Additionally, create a new autoloader by running
        ``php composer.phar dumpautoload``.

.. _core-configuration-baseurl:

App.baseUrl
    Un-comment this definition if you **don’t** plan to use Apache’s
    mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess
    files too.
App.base
    The base directory the app resides in. If ``false`` this
    will be auto detected. If not ``false``, ensure your string starts
    with a `/` and does NOT end with a `/`. E.g., `/basedir` is a valid
    App.base. Otherwise, the AuthComponent will not work properly.
App.encoding
    Define what encoding your application uses.  This encoding
    is used to generate the charset in the layout, and encode entities.
    It should match the encoding values specified for your database.
App.webroot
    The webroot directory.
App.wwwRoot
    The file path to webroot.
App.fullBaseUrl
    The fully qualified domain name (including protocol) to your application's
    root. This is used when generating absolute URLs. By default this value
    is generated using the $_SERVER environment. However, you should define it
    manually to optimize performance or if you are concerned about people
    manipulating the ``Host`` header.
    In a CLI context (from shells) the `fullBaseUrl` cannot be read from $_SERVER,
    as there is no webserver involved. You do need to specify it yourself if
    you do need to generate URLs from a shell (e.g. when sending emails).
App.imageBaseUrl
    Web path to the public images directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
App.cssBaseUrl
    Web path to the public css directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
App.jsBaseUrl
    Web path to the public js directory under webroot. If you are using
    a :term:`CDN` you should set this value to the CDN's location.
App.paths
    Configure paths for non class based resources. Supports the
    ``plugins``, ``templates``, ``locales`` subkeys, which allow the definition
    of paths for plugins, view templates and locale files respectively.
Security.salt
    A random string used in hashing. This value is also used as the
    HMAC salt when doing symetric encryption.
Asset.timestamp
    Appends a timestamp which is last modified time of the particular
    file at the end of asset files URLs (CSS, JavaScript, Image) when
    using proper helpers.
    Valid values:

<<<<<<< HEAD
    - (bool) ``false`` - Doesn't do anything (default)
    - (bool) ``true`` - Appends the timestamp when debug is ``true``
    - (string) 'force' - Always appends the timestamp.
=======
Each application in CakePHP contains a configuration file,
``app/Config/core.php``, to determine CakePHP's internal behavior.
This file is a collection of Configure class
variable definitions and constant definitions that determine how
your application behaves. Before we dive into those particular
variables, you'll need to be familiar with :php:class:`Configure`, CakePHP's
configuration registry class.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Database Configuration
----------------------

See the :ref:`Database Configuration <database-configuration>` for information
on configuring your database connections.

<<<<<<< HEAD
Caching Configuration
---------------------
=======
debug
    Changes CakePHP debugging output.

    * 0 = Production mode. No output.
    * 1 = Show errors and warnings.
    * 2 = Show errors, warnings, and SQL. [SQL log is only shown when you
      add $this->element('sql\_dump') to your view or layout.]

Error
    Configure the Error handler used to handle errors for your application.
    By default :php:meth:`ErrorHandler::handleError()` is used. It will display
    errors using :php:class:`Debugger`, when debug > 0
    and log errors with :php:class:`CakeLog` when debug = 0.

    Sub-keys:

    * ``handler`` - callback - The callback to handle errors. You can set this to any
      callback type, including anonymous functions.
    * ``level`` - int - The level of errors you are interested in capturing.
    * ``trace`` - boolean - Include stack traces for errors in log files.

Exception
    Configure the Exception handler used for uncaught exceptions. By default,
    ErrorHandler::handleException() is used. It will display a HTML page for
    the exception, and while debug > 0, framework errors like
    Missing Controller will be displayed. When debug = 0,
    framework errors will be coerced into generic HTTP errors.
    For more information on Exception handling, see the :doc:`exceptions`
    section.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

See the :ref:`Caching Configuration <cache-configuration>` for information on
configuring caching in CakePHP.

Error and Exception Handling Configuration
------------------------------------------

See the :ref:`Error and Exception Configuration <error-configuration>` for
information on configuring error and exception handlers.

Logging Configuration
---------------------

See the :ref:`log-configuration` for information on configuring logging in
CakePHP.

Email Configuration
-------------------

See the :ref:`Email Configuration <email-configuration>` for information on
configuring email presets in CakePHP.

<<<<<<< HEAD
Session Configuration
---------------------
=======
    If you are installing CakePHP on a webserver besides Apache, you
    can find instructions for getting URL rewriting working for other
    servers under the :doc:`/installation/url-rewriting` section.
App.fullBaseUrl
    The fully qualified domain name (including protocol) to your application’s root. 
    To configure CakePHP to use a particular domain URL for any URL 
    generation inside the application, set this configuration 
    variable. This will override the automatic detection of full 
    base URL and can be useful when generating links from the CLI 
    (e.g. sending emails). If the application runs in a subfolder, 
    you should also set ``App.base``.
App.base
    The base directory the app resides in. Should be used if the application runs 
    in a subfolder and ``App.fullBaseUrl`` is set.
App.encoding
    Define what encoding your application uses. This encoding
    is used to generate the charset in the layout, and encode entities.
    It should match the encoding values specified for your database.
Routing.prefixes
    Un-comment this definition if you'd like to take advantage of
    CakePHP prefixed routes like admin. Set this variable with an array
    of prefix names of the routes you'd like to use. More on this
    later.
Cache.disable
    When set to true, persistent caching is disabled site-wide.
    This will make all read/writes to :php:class:`Cache` fail.
Cache.check
    If set to true, enables view caching. Enabling is still needed in
    the controllers, but this variable enables the detection of those
    settings.
Session
    Contains an array of settings to use for session configuration. The defaults key is
    used to define a default preset to use for sessions, any settings declared here will override
    the settings of the default config.

    Sub-keys

    * ``name`` - The name of the cookie to use. Defaults to 'CAKEPHP'
    * ``timeout`` - The number of minutes you want sessions to live for.
      This timeout is handled by CakePHP
    * ``cookieTimeout`` - The number of minutes you want session cookies to live for.
    * ``checkAgent`` - Do you want the user agent to be checked when starting sessions?
      You might want to set the value to false, when dealing with older versions of
      IE, Chrome Frame or certain web-browsing devices and AJAX
    * ``defaults`` - The default configuration set to use as a basis for your session.
      There are four builtins: php, cake, cache, database.
    * ``handler`` - Can be used to enable a custom session handler.
      Expects an array of callables, that can be used with `session_save_handler`.
      Using this option will automatically add `session.save_handler` to the ini array.
    * ``autoRegenerate`` - Enabling this setting, turns on automatic renewal
      of sessions, and sessionids that change frequently.
      See :php:attr:`CakeSession::$requestCountdown`.
    * ``ini`` - An associative array of additional ini values to set.

    The built-in defaults are:

    * 'php' - Uses settings defined in your php.ini.
    * 'cake' - Saves session files in CakePHP's /tmp directory.
    * 'database' - Uses CakePHP's database sessions.
    * 'cache' - Use the Cache class to save sessions.

    To define a custom session handler, save it at ``app/Model/Datasource/Session/<name>.php``.
    Make sure the class implements :php:interface:`CakeSessionHandlerInterface`
    and set Session.handler to <name>

    To use database sessions, run the ``app/Config/Schema/sessions.php`` schema using
    the cake shell command: ``cake schema create Sessions``
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

See the :ref:`session-configuration` for information on configuring session
handling in CakePHP.

Routing configuration
---------------------

See the :ref:`Routes Configuration <routes-configuration>` for more information
on configuring routing and creating routes for your application.

.. _additional-class-paths:

Additional Class Paths
======================

Additional class paths are setup through the autoloaders your application uses.
When using ``composer`` to generate your autoloader, you could do the following,
to provide fallback paths for controllers in your application::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders/",
            "App\\": "src/"
        }
    }

The above would setup paths for both the ``App`` and ``App\Controller``
namespace. The first key will be searched, and if that path does not contain the
class/file the second key will be searched. You can also map a single namespace
to multiple directories with the following::

    "autoload": {
        "psr-4": {
            "App\\": ["src/", "/path/to/directory/"]
        }
    }

Plugin, View Template and Locale Paths
--------------------------------------

Since plugins, view templates and locales are not classes, they cannot have an
autoloader configured. CakePHP provides three Configure variables to setup additional
paths for these resources. In your **config/app.php** you can set these variables::

    return [
        // More configuration
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/path/to/other/plugins/'
                ],
                'templates' => [
                    APP . 'Template' . DS,
                    APP . 'Template2' . DS
                ],
                'locales' => [
                    APP . 'Locale' . DS
                ]
            ]
        ]
    ];

Paths should end with a directory separator, or they will not work properly.

Inflection Configuration
========================

See the :ref:`inflection-configuration` docs for more information.

.. _environment-variables:

Environment Variables
=====================

Many modern cloud providers, like Heroku, let you define environment
variables for configuration data. You can configure your CakePHP through
environment variables in the `12factor app style <http://12factor.net/>`_.
Environment variables allow your application to require less state making your
application easier to manage when it is deployed across a number of
environments.

As you can see in your **app.php**, the ``env()`` function is used to read
configuration from the environment, and build the application configuration.
CakePHP uses :term:`DSN` strings for databases, logs, email transports and cache
configurations allowing you to easily vary these libraries in each environment.

<<<<<<< HEAD
For local development, CakePHP leverages `dotenv
<https://github.com/josegonzalez/php-dotenv>`_ to allow easy local development using
environment variables. You will see a ``config/.env.default`` in your
application. By copying this file into ``config/.env`` and customizing the
values you can configure your application.

You should avoid committing the ``config/.env`` file to your repository and
instead use the ``config/.env.default`` as a template with placeholder values so
everyone on your team knows what environment variables are in use and what
should go in each one.

Once your environment variables have been set, you can use ``env()`` to read
data from the environment::

    $debug = env('APP_DEBUG', false);

The second value passed to the env function is the default value. This value
will be used if no environment variable exists for the given key.

.. versionchanged:: 3.5.0
    dotenv library support was added to the application skeleton.

=======
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
Configure Class
===============

.. php:namespace:: Cake\Core

.. php:class:: Configure

CakePHP's Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure CakePHP provides.

Writing Configuration data
--------------------------

.. php:staticmethod:: write($key, $value)

<<<<<<< HEAD
Use ``write()`` to store data in the application's configuration::
=======
    :param string $key: The key to write, can be a :term:`dot notation` value.
    :param mixed $value: The value to store.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

.. note::

    The :term:`dot notation` used in the ``$key`` parameter can be used to
    organize your configuration settings into logical groups.

The above example could also be written in a single call::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

You can use ``Configure::write('debug', $bool)`` to switch between debug and
production modes on the fly. This is especially handy for JSON interactions
where debugging information can cause parsing problems.

Reading Configuration Data
--------------------------

<<<<<<< HEAD
.. php:staticmethod:: read($key = null, $default = null)
=======
    :param string $key: The key to read, can be a :term:`dot notation` value
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Used to read configuration data from the application. If a key is supplied, the
data is returned. Using our examples from write() above, we can read that data
back::

    // Returns 'Pizza Inc.'
    Configure::read('Company.name');

    // Returns 'Pizza for your body and soul'
    Configure::read('Company.slogan');

    Configure::read('Company');
    // Returns:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

<<<<<<< HEAD
    // Returns 'fallback' as Company.nope is undefined.
    Configure::read('Company.nope', 'fallback');
=======
    If $key is left null, all values in Configure will be returned. If the value
    corresponding to the specified $key does not exist then null will be
    returned.

.. php:staticmethod:: consume($key)

    :param string $key: The key to read, can use be a :term:`dot notation` value

    Read and delete a key from Configure. This is useful when you want to
    combine reading and deleting values in a single operation.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

If ``$key`` is left null, all values in Configure will be returned.

.. versionchanged:: 3.5.0
    The ``$default`` parameter was added in 3.5.0

.. php:staticmethod:: readOrFail($key)

Reads configuration data just like :php:meth:`Cake\\Core\\Configure::read`
but expects to find a key/value pair. In case the requested pair does not
exist, a :php:class:`RuntimeException` will be thrown::

    Configure::readOrFail('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Will throw an exception

<<<<<<< HEAD
    Configure::readOrFail('Company');
=======
    :param string $key: The key to delete, can be a :term:`dot notation` value
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

.. versionadded:: 3.1.7
    ``Configure::readOrFail()`` was added in 3.1.7

Checking to see if Configuration Data is Defined
------------------------------------------------

.. php:staticmethod:: check($key)

Used to check if a key/path exists and has non-null value::

    $exists = Configure::check('Company.name');

Deleting Configuration Data
---------------------------

.. php:staticmethod:: delete($key)

Used to delete information from the application's configuration::

    Configure::delete('Company.name');

Reading & Deleting Configuration Data
-------------------------------------

.. php:staticmethod:: consume($key)

Read and delete a key from Configure. This is useful when you want to
combine reading and deleting values in a single operation.

Reading and writing configuration files
=======================================

<<<<<<< HEAD
.. php:staticmethod:: config($name, $engine)

CakePHP comes with two built-in configuration file engines.
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` is able to read PHP config
files, in the same format that Configure has historically read.
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` is able to read ini config
files.  See the `PHP documentation <http://php.net/parse_ini_file>`_ for more
information on the specifics of ini files.  To use a core config engine, you'll
need to attach it to Configure using :php:meth:`Configure::config()`::
=======
CakePHP comes with two built-in configuration file readers.
:php:class:`PhpReader` is able to read PHP config files, in the same
format that Configure has historically read. :php:class:`IniReader` is
able to read ini config files. See the `PHP documentation <https://secure.php.net/parse_ini_file>`_
for more information on the specifics of ini files.
To use a core config reader, you'll need to attach it to Configure
using :php:meth:`Configure::config()`::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    use Cake\Core\Configure\Engine\PhpConfig;

    // Read config files from config
    Configure::config('default', new PhpConfig());

    // Read config files from another path.
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

<<<<<<< HEAD
You can have multiple engines attached to Configure, each reading different
kinds or sources of configuration files. You can interact with attached engines
using a few other methods on Configure. To check which engine aliases are
attached you can use :php:meth:`Configure::configured()`::
=======
You can have multiple readers attached to Configure, each reading
different kinds of configuration files, or reading from
different types of sources. You can interact with attached readers
using a few other methods on Configure. To see which reader
aliases are attached you can use :php:meth:`Configure::configured()`::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Get the array of aliases for attached engines.
    Configure::configured();

    // Check if a specific engine is attached
    Configure::configured('default');

.. php:staticmethod:: drop($name)

You can also remove attached engines. ``Configure::drop('default')``
would remove the default engine alias. Any future attempts to load configuration
files with that engine would fail::

    Configure::drop('default');

.. _loading-configuration-files:

Loading Configuration Files
---------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

Once you've attached a config engine to Configure you can load configuration
files::

    // Load my_file.php using the 'default' engine object.
    Configure::load('my_file', 'default');

Loaded configuration files merge their data with the existing runtime
configuration in Configure. This allows you to overwrite and add new values into
the existing runtime configuration. By setting ``$merge`` to ``true``, values
will not ever overwrite the existing configuration.

Creating or Modifying Configuration Files
-----------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

Dumps all or some of the data in Configure into a file or storage system
supported by a config engine. The serialization format is decided by the config
engine attached as $config. For example, if the 'default' engine is
a :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`, the generated file will be
a PHP configuration file loadable by the
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`

Given that the 'default' engine is an instance of PhpConfig.
Save all data in Configure to the file `my_config.php`::

    Configure::dump('my_config', 'default');

Save only the error handling configuration::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` can be used to either modify or overwrite
configuration files that are readable with :php:meth:`Configure::load()`

Storing Runtime Configuration
-----------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

You can also store runtime configuration values for use in a future request.
Since configure only remembers values for the current request, you will
need to store any modified configuration information if you want to
use it in subsequent requests::

    // Store the current configuration in the 'user_1234' key in the 'default' cache.
    Configure::store('user_1234', 'default');

Stored configuration data is persisted in the named cache configuration. See the
:doc:`/core-libraries/caching` documentation for more information on caching.

Restoring Runtime Configuration
-------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

Once you've stored runtime configuration, you'll probably need to restore it
so you can access it again. ``Configure::restore()`` does exactly that::

    // Restore runtime configuration from the cache.
    Configure::restore('user_1234', 'default');

When restoring configuration information it's important to restore it with
the same key, and cache configuration as was used to store it. Restored
information is merged on top of the existing runtime configuration.

<<<<<<< HEAD
Configuration Engines
---------------------

CakePHP provides the ability to load configuration files from a number of
different sources, and features a pluggable system for `creating your own
configuration engines
<https://api.cakephp.org/3.x/class-Cake.Core.Configure.ConfigEngineInterface.html>`__.
The built in configuration engines are:
=======
Creating your own Configuration readers
=======================================

Since configuration readers are an extensible part of CakePHP,
you can create configuration readers in your application and plugins.
Configuration readers need to implement the :php:interface:`ConfigReaderInterface`.
This interface defines a read method, as the only required method.
If you really like XML files, you could create a simple Xml config
reader for you application::

    // in app/Lib/Configure/MyXmlReader.php
    App::uses('Xml', 'Utility');
    class MyXmlReader implements ConfigReaderInterface {
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

In your ``app/Config/bootstrap.php`` you could attach this reader and use it::

    App::uses('MyXmlReader', 'Configure');
    Configure::config('xml', new MyXmlReader());
    ...

    Configure::load('my_xml');

.. warning::

        It is not a good idea to call your custom configure class ``XmlReader`` because that
        class name is an internal PHP one already:
        `XMLReader <https://secure.php.net/manual/en/book.xmlreader.php>`_

The ``read()`` method of a config reader, must return an array of the configuration information
that the resource named ``$key`` contains.

.. php:interface:: ConfigReaderInterface

    Defines the interface used by classes that read configuration data and
    store it in :php:class:`Configure`

.. php:method:: read($key)

    :param string $key: The key name or identifier to load.

    This method should load/parse the configuration data identified by ``$key``
    and return an array of data in the file.

.. php:method:: dump($key, $data)

    :param string $key: The identifier to write to.
    :param array $data: The data to dump.

    This method should dump/store the provided configuration data to a key identified by ``$key``.

.. versionadded:: 2.3
    ``ConfigReaderInterface::dump()`` was added in 2.3.

.. php:exception:: ConfigureException

    Thrown when errors occur when loading/storing/restoring configuration data.
    :php:interface:`ConfigReaderInterface` implementations should throw this
    exception when they encounter an error.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

* `JsonConfig <https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.JsonConfig.html>`__
* `IniConfig <https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.IniConfig.html>`__
* `PhpConfig <https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.PhpConfig.html>`__

By default your application will use ``PhpConfig``.

Bootstrapping CakePHP
=====================

If you have any additional configuration needs, you should add them to your
application's **config/bootstrap.php** file. This file is included before each
request, and CLI command.

<<<<<<< HEAD
This file is ideal for a number of common bootstrapping tasks:
=======
    Load your custom configuration file by inserting the following in app/Config/bootstrap.php::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

- Defining convenience functions.
- Declaring constants.
- Defining cache configuration.
- Defining logging configuration.
- Loading custom inflections.
- Loading configuration files.

It might be tempting to place formatting functions there in order to use them in
your controllers. As you'll see in the :doc:`/controllers` and :doc:`/views`
sections there are better ways you add custom logic to your application.

<<<<<<< HEAD
.. _application-bootstrap:
=======
    Allows you to read configuration files that are stored as plain .ini files.
    The ini files must be compatible with PHP's ``parse_ini_file`` function, and
    benefit from the following improvements
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Application::bootstrap()
------------------------

In addition to the **config/bootstrap.php** file which should be used to
configure low-level concerns of your application, you can also use the
``Application::bootstrap()`` hook method to load/initialize plugins, and attach
global event listeners::

    // in src/Application.php
    namespace App;

    use Cake\Core\Plugin;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // Call the parent to `require_once` config/bootstrap.php
            parent::bootstrap();

            Plugin::load('MyPlugin', ['bootstrap' => true, 'routes' => true]);
        }
    }

Loading plugins/events in ``Application::bootstrap()`` makes
:ref:`integration-testing` easier as events and routes will be re-processed on
each test method.

Disabling Generic Tables
========================

<<<<<<< HEAD
While utilizing generic table classes - also called auto-tables - when quickly
creating new applications and baking models is useful, generic table class can
make debugging more difficult in some scenarios.

You can check if any query was emitted from a generic table class via DebugKit
via the SQL panel in DebugKit. If you're still having trouble diagnosing an
issue that could be caused by auto-tables, you can throw an exception when
CakePHP implicitly uses a generic ``Cake\ORM\Table`` instead of your concrete
class like so::

    // In your bootstrap.php
    use Cake\Event\EventManager;
    use Cake\Network\Exception\InternalErrorException;

    $isCakeBakeShellRunning = (PHP_SAPI === 'cli' && isset($argv[1]) && $argv[1] === 'bake');
    if (!$isCakeBakeShellRunning) {
        EventManager::instance()->on('Model.initialize', function($event) {
            $subject = $event->getSubject();
            if (get_class($subject === 'Cake\ORM\Table') {
                $msg = sprintf(
                    'Missing table class or incorrect alias when registering table class for database table %s.',
                    $subject->getTable());
                throw new InternalErrorException($msg);
            }
        });
    }
=======
CakePHP's naming conventions can be really nice - you can name your
database table big_boxes, your model BigBox, your controller
BigBoxesController, and everything just works together
automatically. The way CakePHP knows how to tie things together is
by *inflecting* the words between their singular and plural forms.

There are occasions (especially for our non-English speaking
friends) where you may run into situations where CakePHP's
:php:class:`Inflector` (the class that pluralizes, singularizes, camelCases, and
under\_scores) might not work as you'd like. If CakePHP won't
recognize your Foci or Fish, you can tell CakePHP about your
special cases.

Loading custom inflections
--------------------------

You can use :php:meth:`Inflector::rules()` in the file
``app/Config/bootstrap.php`` to load custom inflections::

    Inflector::rules('singular', array(
        'rules' => array(
            '/^(bil)er$/i' => '\1',
            '/^(inflec|contribu)tors$/i' => '\1ta'
        ),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

or::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

Will merge the supplied rules into the inflection sets defined in
lib/Cake/Utility/Inflector.php, with the added rules taking precedence
over the core rules.

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

>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

.. meta::
    :title lang=en: Configuration
    :keywords lang=en: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web,auto tables,auto-tables,generic table,class
