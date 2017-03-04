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

Configuration is generally stored in either PHP or INI files, and loaded during
the application bootstrap. CakePHP comes with one configuration file by default,
but if required you can add additional configuration files and load them in
your application's bootstrap code. :php:class:`Cake\\Core\\Configure` is used
for global configuration, and classes like ``Cache`` provide ``config()``
methods to make configuration simple and transparent.

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

You can also use additional configuration files to provide environment specific
overrides. Each file loaded after **app.php** can redefine previously declared
values allowing you to customize configuration for development or staging
environments.

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

    - (bool) ``false`` - Doesn't do anything (default)
    - (bool) ``true`` - Appends the timestamp when debug is ``true``
    - (string) 'force' - Always appends the timestamp.

Database Configuration
----------------------

See the :ref:`Database Configuration <database-configuration>` for information
on configuring your database connections.

Caching Configuration
---------------------

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

Session Configuration
---------------------

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
When using ``Composer`` to generate your autoloader, you could do the following,
to provide fallback paths for controllers in your application::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }

The above would setup paths for both the ``App`` and ``App\Controller``
namespace. The first key will be searched, and if that path does not contain the
class/file the second key will be searched. You can also map a single namespace
to multiple directories with the following::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
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
won't end up breaking the MVC structure we've set in place.

You can access ``Configure`` from anywhere in your application::

    Configure::read('debug');

Writing Configuration data
--------------------------

.. php:staticmethod:: write($key, $value)

Use ``write()`` to store data in the application's configuration::

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
---------------------------

.. php:staticmethod:: read($key = null)

Used to read configuration data from the application. Defaults to
CakePHP's important debug value. If a key is supplied, the data is
returned. Using our examples from write() above, we can read that
data back::

    Configure::read('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  // Yields: 'Pizza for your body
                                        // and soul'

    Configure::read('Company');

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

If $key is left null, all values in Configure will be returned.


.. php:staticmethod:: readOrFail($key)

Reads configuration data just like :php:meth:`Cake\\Core\\Configure::read`
but expects to find a key/value pair. In case the requested pair does not
exist, a :php:class:`RuntimeException` will be thrown::

    Configure::readOrFail('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Will throw an exception

    Configure::readOrFail('Company');

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

.. php:staticmethod:: config($name, $engine)

CakePHP comes with two built-in configuration file engines.
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` is able to read PHP config
files, in the same format that Configure has historically read.
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` is able to read ini config
files.  See the `PHP documentation <http://php.net/parse_ini_file>`_ for more
information on the specifics of ini files.  To use a core config engine, you'll
need to attach it to Configure using :php:meth:`Configure::config()`::

    use Cake\Core\Configure\Engine\PhpConfig;

    // Read config files from config
    Configure::config('default', new PhpConfig());

    // Read config files from another path.
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

You can have multiple engines attached to Configure, each reading different
kinds or sources of configuration files. You can interact with attached engines
using a few other methods on Configure. To check which engine aliases are
attached you can use :php:meth:`Configure::configured()`::

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

Creating your Own Configuration Engines
=======================================

Since configuration engines are an extensible part of CakePHP, you can create
configuration engines in your application and plugins.  Configuration engines
need to implement the
:php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface`.  This interface
defines a read method, as the only required method.  If you like XML
files, you could create a simple Xml config engine for you application::

    // In src/Configure/Engine/XmlConfig.php
    namespace App\Configure\Engine;

    use Cake\Core\Configure\ConfigEngineInterface;
    use Cake\Utility\Xml;

    class XmlConfig implements ConfigEngineInterface
    {

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

        public function dump($key, array $data)
        {
            // Code to dump data to file
        }
    }

In your **config/bootstrap.php** you could attach this engine and use it::

    use App\Configure\Engine\XmlConfig;

    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml', 'xml');

The ``read()`` method of a config engine, must return an array of the
configuration information that the resource named ``$key`` contains.

.. php:namespace:: Cake\Core\Configure

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

Built-in Configuration Engines
==============================

.. php:namespace:: Cake\Core\Configure\Engine

PHP Configuration Files
-----------------------

.. php:class:: PhpConfig

Allows you to read configuration files that are stored as plain PHP files.
You can read either files from your app's config or from plugin configs
directories by using :term:`plugin syntax`. Files *must* return an array.
An example configuration file would look like::

    return [
        'debug' => 0,
        'Security' => [
            'salt' => 'its-secret'
        ],
        'App' => [
            'namespace' => 'App'
        ]
    ];

Load your custom configuration file by inserting the following in
**config/bootstrap.php**::

    Configure::load('customConfig');

Ini Configuration Files
-----------------------

.. php:class:: IniConfig

Allows you to read configuration files that are stored as plain .ini files.
The ini files must be compatible with php's ``parse_ini_file()`` function, and
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


Json Configuration Files
------------------------

.. php:class:: JsonConfig

Allows you to read / dump configuration files that are stored as JSON encoded
strings in .json files.

An example JSON file would look like::

    {
        "debug": false,
        "App": {
            "namespace": "MyApp"
        },
        "Security": {
            "salt": "its-secret"
        }
    }


Bootstrapping CakePHP
=====================

If you have any additional configuration needs, you should add them to your
application's **config/bootstrap.php** file. This file is included before each
request, and CLI command.

This file is ideal for a number of common bootstrapping tasks:

- Defining convenience functions.
- Declaring constants.
- Defining cache configuration.
- Defining logging configuration.
- Loading custom inflections.
- Loading configuration files.

It might be tempting to place formatting functions there in order to use them in
your controllers. As you'll see in the :doc:`/controllers` and :doc:`/views`
sections there are better ways you add custom logic to your application.

.. _application-bootstrap:

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

Environment Variables
=====================

Some of the modern cloud providers, like Heroku, let you define environment
variables. By defining environment variables, you can configure your CakePHP
app as an 12factor app. Following the
`12factor app instructions <http://12factor.net/>`_ is a good way to create a
stateless app, and to ease the deployment of your app.
This means for example, that if you need to change your database, you'll just
need to modify a DATABASE_URL variable on your host configuration without the
need to change it in your source code.

As you can see in your **app.php**, the following variables are concerned:

- ``DEBUG`` (``0`` or ``1``)
- ``APP_ENCODING`` (ie UTF-8)
- ``APP_DEFAULT_LOCALE`` (ie ``en_US``)
- ``SECURITY_SALT``
- ``CACHE_DEFAULT_URL`` (ie ``File:///?prefix=myapp_&serialize=true&timeout=3600&path=../tmp/cache/``)
- ``CACHE_CAKECORE_URL`` (ie ``File:///?prefix=myapp_cake_core_&serialize=true&timeout=3600&path=../tmp/cache/persistent/``)
- ``CACHE_CAKEMODEL_URL`` (ie ``File:///?prefix=myapp_cake_model_&serialize=true&timeout=3600&path=../tmp/cache/models/``)
- ``EMAIL_TRANSPORT_DEFAULT_URL`` (ie ``smtp://user:password@hostname:port?tls=null&client=null&timeout=30``)
- ``DATABASE_URL`` (ie ``mysql://user:pass@db/my_app``)
- ``DATABASE_TEST_URL`` (ie ``mysql://user:pass@db/test_my_app``)
- ``LOG_DEBUG_URL`` (ie ``file:///?levels[]=notice&levels[]=info&levels[]=debug&file=debug&path=../logs/``)
- ``LOG_ERROR_URL`` (ie ``file:///?levels[]=warning&levels[]=error&levels[]=critical&levels[]=alert&levels[]=emergency&file=error&path=../logs/``)

As you can see in the examples, we define some options configuration as
:term:`DSN` strings. This is the case for databases, logs, email transport and
cache configurations.

If the environment variables are not defined in your environment, CakePHP will
use the values that are defined in the **app.php**. You can use
`php-dotenv library <https://github.com/josegonzalez/php-dotenv>`_ to use
environment variables in a local development. See the Readme instructions of the
library for more information.


Disabling Generic Tables
========================

While utilizing generic table classes - also called auto-tables - when quickly
creating new applications and baking models is useful, generic table class make
debugging more difficult at the same time.

You can see if any query was fired off from a generic table class via DebugKit
by select the history tab, select an http request and then selecting the SQL tab
in DebugKit. 

If that is not sufficient, you can throw an exeception if CakePHP is implicitly
working off a generic ``Cake\ORM\Table`` instead of your ``App\ORM\ConcreteTable``
class like so::

    // In your bootstrap.php
    use Cake\Event\EventManager;
    use Cake\Network\Exception\InternalErrorException;
    
    EventManager::instance()->on('Model.initialize', function($event) {
        $subject = $event->getSubject();
        if (get_class($subject === 'Cake\ORM\Table') {
            $msg = sprintf(
                'Missing table class or incorrect alias when registering table class for database table %s.',
                $subject->getTable());
            throw new InternalErrorException($msg);
        }
    });

.. meta::
    :title lang=en: Configuration
    :keywords lang=en: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web,auto tables,auto-tables,generic table,class
