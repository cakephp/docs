# Configuration

Configuring a CakePHP application is a piece of cake. After you
have installed CakePHP, creating a basic web application requires
only that you setup a database configuration.

There are, however, other optional configuration steps you can take
in order to take advantage of CakePHP flexible architecture. You
can easily add to the functionality inherited from the CakePHP
core, configure additional/different URL mappings (routes), and
define additional/different inflections.

The application's configuration files live in the `config/` directory of
your project:

- `config/core.php` - core settings such as debug level, error handling,
  sessions, security salts and the internal caches.
- `config/bootstrap.php` - application bootstrapping: cache configurations,
  log configurations, plugin loading, custom inflections.
- `config/database.php` - database connections (copy it from
  `config/database.php.default`).
- `config/routes.php` - URL routing.
- `config/email.php` - email transport configurations (copy it from
  `config/email.php.default`).
- `config/acl.php`, `config/acl.ini.php` - ACL settings.
- `config/Schema/` - schema files, e.g. for database sessions and i18n.

The `CONFIG` constant points to this directory. In the legacy layout the same
files are in `app/Config/`, and `CONFIG` points there when the project has no
top-level `config/` directory. See [CakePHP Folder Structure](/getting-started/cakephp-folder-structure)
for both layouts.

<div class="index">

database.php, database.php.default

</div>

<a id="database-configuration"></a>

## Database Configuration

CakePHP expects database configuration details to be in a file at
`config/database.php`. An example database configuration file can
be found at `config/database.php.default`. A finished
configuration should look something like this:

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

The \$default connection array is used unless another connection is
specified by the `$useDbConfig` property in a model. For example, if
my application has an additional legacy database in addition to the
default one, I could use it in my models by creating a new \$legacy
database connection array similar to the \$default array, and by
setting `public $useDbConfig = 'legacy';` in the appropriate models.

Fill out the key/value pairs in the configuration array to best
suit your needs.

datasource  
The name of the datasource this configuration array is for.
The built-in database drivers are Database/Mysql, Database/Postgres,
Database/Sqlite and Database/Sqlserver. All of them use PDO, so the
matching PDO extension (`pdo_mysql`, `pdo_pgsql`, `pdo_sqlite` or `pdo_sqlsrv`)
must be installed.
You can use `plugin syntax` to indicate plugin datasource to use.

persistent  
Whether or not to use a persistent connection to the database. The
Sqlserver datasource does not support persistent connections and throws
an exception if this is set to true.

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
For SQL Server the port is appended to the host when connecting.

encoding  
Indicates the character set to use for the connection. This defaults to
the database's default encoding. If you wish to use UTF-8 encoding
with MySQL you must use 'utf8' or 'utf8mb4' without the hyphen.
The character set is passed in the PDO DSN when connecting
(`charset=...` for MySQL, `options='--client_encoding=...'` for PostgreSQL),
so no `SET NAMES` query is needed. For SQL Server, 'utf8' selects the
driver's UTF-8 encoding.

flags (*optional*)  
An array of PDO attributes passed to the PDO constructor. As of PHP 8.1,
the MySQL and SQLite PDO drivers return integer and float columns as PHP
integers and floats. If your application relies on the old behavior of
receiving strings, set `'flags' => [PDO::ATTR_STRINGIFY_FETCHES => true]`.

schema  
The schema to use. Used by PostgreSQL (defaults to `public`) and
SQL Server (defaults to `dbo`).

sslmode (*optional*)  
PostgreSQL only. The `sslmode` value added to the DSN, e.g. `'require'`.

options (*optional*)  
SQL Server only. An array of additional connection options that are added to
the DSN, e.g. `['TrustServerCertificate' => 'yes', 'Encrypt' => 'no']`.

::: pieceofcake2
The Sqlserver datasource targets SQL Server
2022 and newer. It reads the port from `port`, defaults `schema` to `dbo` and
accepts SSL/TLS settings in the `options` array. See the [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10).
:::

unix_socket  
Used by drivers that support it to connect via unix socket files. If you are
using PostgreSQL and want to use unix sockets, leave the host key blank.

ssl_key  
The file path to the SSL key file. Must be combined with `ssl_cert`.
(Only supported by MySQL.)

ssl_cert  
The file path to the SSL certificate file. Must be combined with `ssl_key`.
(Only supported by MySQL.)

ssl_ca  
The file path to the SSL certificate authority. (Only supported by MySQL.)

settings  
An array of key/value pairs that should be sent to the database server as
`SET` commands when the connection is created. This option is only
supported by the Mysql, Postgres, and Sqlserver datasources at this time.

::: info Changed in version 2.4
The `settings`, `ssl_key`, `ssl_cert` and `ssl_ca` keys was added in 2.4.
:::

> [!NOTE]
> The prefix setting is for tables, **not** models. For example, if
> you create a join table for your Apple and Flavor models, you name
> it prefix_apples_flavors (**not**
> prefix_apples_prefix_flavors), and set your prefix setting to
> 'prefix\_'.

At this point, you might want to take a look at the
[CakePHP Conventions](../getting-started/cakephp-conventions). The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big_boxes, your model
BigBox, your controller BigBoxesController, everything just works
together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry_stores, and savory_cakes.

## Class Loading and Additional Class Paths

CakePHP framework classes are loaded by Composer's autoloader, so you never
need `App::uses()` for them. Your own classes can be autoloaded the same way by
adding a classmap to your application's `composer.json`, as the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton does:

``` json
"autoload": {
    "classmap": ["src/"]
}
```

With this in place, `App::uses()` calls for your controllers, models,
helpers and other classes in `src/` can be removed. Run
`composer dump-autoload` every time you add a new class file, so that the
classmap includes it. Plugins that do not support Composer autoloading still
need `App::uses()` (for example `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')`).

::: pieceofcake2
The framework is loaded through Composer's
classmap instead of include paths and its own `App::uses()` calls were removed.
Application code that still uses `App::uses()` keeps working.
:::

`App::uses()` and `App::build()` are still available. When `App::uses()` is
used, CakePHP looks for classes in the application directory (`src/`, or
`app/` in the legacy layout). Templates are also found in `templates/`,
locales in `resources/locales/` and plugins in `plugins/`.

It's occasionally useful to be able to share MVC classes between
applications on the same system. If you want the same controller in
both applications, you can use CakePHP's `config/bootstrap.php` to bring
these additional classes into view.

By using `App::build()` in `config/bootstrap.php` we can define additional
paths where CakePHP will look for classes:

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
> All additional path configuration should be done at the top of your application's
> bootstrap.php. This will ensure that the paths are available for the rest of your
> application.

<div class="index">

core.php, configuration

</div>

## Core Configuration

Each application in CakePHP contains a configuration file,
`config/core.php`, to determine CakePHP's internal behavior.
This file is a collection of Configure class
variable definitions and constant definitions that determine how
your application behaves. Before we dive into those particular
variables, you'll need to be familiar with `Configure`, CakePHP's
configuration registry class.

### CakePHP Core Configuration

The `Configure` class is used to manage a set of core CakePHP
configuration variables. These variables can be found in
`config/core.php`. Below is a description of each variable and
how it affects your CakePHP application.

debug  
Changes CakePHP debugging output.

- 0 = Production mode. No output.
- 1 = Show errors and warnings.
- 2 = Show errors, warnings, and SQL. \[SQL log is only shown when you
  add \$this-\>element('sql_dump') to your view or layout.\]

Error  
Configure the Error handler used to handle errors for your application.
By default `ErrorHandler::handleError()` is used. It will display
errors using `Debugger`, when debug \> 0
and log errors with `CakeLog` when debug = 0.

Sub-keys:

- `handler` - callback - The callback to handle errors. You can set this to any
  callback type, including anonymous functions.
- `level` - int - The level of errors you are interested in capturing.
- `trace` - boolean - Include stack traces for errors in log files.

Exception  
Configure the Exception handler used for uncaught exceptions. By default,
ErrorHandler::handleException() is used. It will display a HTML page for
the exception, and while debug \> 0, framework errors like
Missing Controller will be displayed. When debug = 0,
framework errors will be coerced into generic HTTP errors.
For more information on Exception handling, see the [Exceptions](exceptions)
section.

<div id="core-configuration-baseurl">

App.baseUrl  
If you don't want or can't get mod_rewrite (or some other
compatible module) up and running on your server, you'll need to
use CakePHP's built-in pretty URLs. In `config/core.php`,
uncomment the line that looks like:

``` php
Configure::write('App.baseUrl', env('SCRIPT_NAME'));
```

Also remove the `webroot/.htaccess` file. In the legacy layout, remove
these .htaccess files:

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the [URL Rewriting](../installation/url-rewriting) section.

App.fullBaseUrl  
The fully qualified domain name (including protocol) to your application’s root.
To configure CakePHP to use a particular domain URL for any URL
generation inside the application, set this configuration
variable. This will override the automatic detection of full
base URL and can be useful when generating links from the CLI
(e.g. sending emails). If the application runs in a subfolder,
you should also set `App.base`.

App.base  
The base directory the app resides in. Should be used if the application runs
in a subfolder and `App.fullBaseUrl` is set.

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
This will make all read/writes to `Cache` fail.

Cache.check  
If set to true, enables view caching. Enabling is still needed in
the controllers, but this variable enables the detection of those
settings.

Session  
Contains an array of settings to use for session configuration. The defaults key is
used to define a default preset to use for sessions, any settings declared here will override
the settings of the default config.

Sub-keys

- `cookie` - The name of the cookie to use. Defaults to 'CAKEPHP'
- `timeout` - The number of minutes you want sessions to live for.
  This timeout is handled by CakePHP
- `cookieTimeout` - The number of minutes you want session cookies to live for.
- `checkAgent` - Do you want the user agent to be checked when starting sessions?
  You might want to set the value to false for clients that change their user
  agent string during a session.
- `defaults` - The default configuration set to use as a basis for your session.
  There are four builtins: php, cake, cache, database.
- `handler` - Can be used to enable a custom session handler.
  Expects an array of callables, that can be used with `session_save_handler`,
  or an array with an `engine` key naming a class that implements
  `CakeSessionHandlerInterface`.
  Using this option will automatically add `session.save_handler` to the ini array.
- `autoRegenerate` - Enabling this setting, turns on automatic renewal
  of sessions, and sessionids that change frequently.
  See `CakeSession::$requestCountdown`.
- `cacheLimiter` - The cache control headers used for the session cookie.
  See [session_cache_limiter()](https://www.php.net/session_cache_limiter) for
  accepted values.
- `ini` - An associative array of additional ini values to set.

The built-in defaults are:

- 'php' - Uses settings defined in your php.ini.
- 'cake' - Saves session files in CakePHP's `tmp/sessions` directory.
- 'database' - Uses CakePHP's database sessions.
- 'cache' - Use the Cache class to save sessions.

To define a custom session handler, save it at `src/Model/Datasource/Session/<name>.php`.
Make sure the class implements `CakeSessionHandlerInterface`
and set `Session.handler.engine` to \<name\>.

To use database sessions, create the table from the `config/Schema/sessions.php`
schema using the cake shell command: `bin/cake schema create Sessions`

See [Sessions](sessions) for more details.

Security.salt  
A random string used in security hashing. It is also used to sign CSRF
tokens and form tampering tokens, and as the default key for
`CookieComponent`. Change it to a secret value unique to your application;
CakePHP shows a notice while the default value from the skeleton is in use.

::: pieceofcake2
CSRF tokens issued by `SecurityComponent`
are signed with an HMAC using `Security.salt` (CVE-2020-15400). Changing the salt
invalidates outstanding tokens. See [Security Fixes](/appendices/security-fixes).
:::

Security.cipherSeed  
A random numeric string (digits only) used to encrypt/decrypt
strings with `Security::cipher()`. That method is used only by the
`'cipher'` encryption type of `CookieComponent`, which is weak and kept
for backwards compatibility. Use the `'aes'` type for cookies instead.

Security.useOpenSsl  
When true, `Security::encrypt()` and `Security::decrypt()` (and therefore
the `'aes'` cookie encryption type) use OpenSSL instead of mcrypt. The mcrypt
extension is not bundled with PHP 7.2 and later, so enable it in `config/core.php`:

``` php
Configure::write('Security.useOpenSsl', true);
```

The default is false. Applications created from the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton (v2.3.1 and
later) already have this line; add it to existing applications.

Asset.timestamp  
Appends a timestamp which is last modified time of the particular
file at the end of asset files URLs (CSS, JavaScript, Image) when
using proper helpers.
Valid values:
(boolean) false - Doesn't do anything (default)
(boolean) true - Appends the timestamp when debug \> 0
(string) 'force' - Appends the timestamp when debug \>= 0

Acl.classname, Acl.database  
Constants used for CakePHP's Access Control List functionality. See
the Access Control Lists chapter for more information.

</div>

> [!NOTE]
> Cache configuration is also found in core.php — We'll be covering
> that later on, so stay tuned.

The `Configure` class can be used to read and write core
configuration settings on the fly. This can be especially handy if
you want to turn the debug setting on for a limited section of
logic in your application, for instance.

### Configuration Constants

While most configuration options are handled by Configure, there
are a few constants that CakePHP uses during runtime.

`constant` **LOG_ERROR**

Error constant. Used for differentiating error logging and
debugging. Currently PHP supports LOG_DEBUG.

### Core Cache Configuration

CakePHP uses two cache configurations internally. `_cake_model_` and `_cake_core_`.
`_cake_core_` is used to store file paths, and object locations. `_cake_model_` is
used to store schema descriptions, and source listings for datasources. Using a fast
cache storage like APCu or Memcached is recommended for these configurations, as
they are read on every request. By default both of these configurations expire every
10 seconds when debug is greater than 0. Both are defined at the end of
`config/core.php`.

The available cache engines are File, Apc (which uses the APCu extension when it
is loaded), Memcached, Memcache and Redis.

::: pieceofcake2
The Xcache and Wincache cache engines were
removed. Switch any configuration that uses them to one of the engines above.
:::

As with all cached data stored in `Cache` you can clear data using
`Cache::clear()`.

## Configure Class

`class` **Configure**

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

This class can be called from
anywhere within your application, in a static context:

``` php
Configure::read('debug');
```

`static` Configure::**write**($key, $value)

param string \$key  
The key to write, can be a `dot notation` value.

param mixed \$value  
The value to store.

Use `write()` to store data in the application's configuration:

``` php
Configure::write('Company.name', 'Pizza, Inc.');
Configure::write('Company.slogan', 'Pizza for your body and soul');
```

> [!NOTE]
> The `dot notation` used in the `$key` parameter can be used to
> organize your configuration settings into logical groups.

The above example could also be written in a single call:

``` php
Configure::write(
    'Company',
    [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul',
    ],
);
```

You can use `Configure::write('debug', $int)` to switch between
debug and production modes on the fly. This is especially handy for
JSON or XML responses where debugging information can cause
parsing problems.

`static` Configure::**read**($key = null)

param string \$key  
The key to read, can be a `dot notation` value

Used to read configuration data from the application. Defaults to
CakePHP's important debug value. If a key is supplied, the data is
returned. Using our examples from write() above, we can read that
data back:

``` php
Configure::read('Company.name'); // yields: 'Pizza, Inc.'
Configure::read('Company.slogan'); // yields: 'Pizza for your body and soul'

Configure::read('Company');

// yields:
['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];
```

If \$key is left null, all values in Configure will be returned. If the value
corresponding to the specified \$key does not exist then null will be
returned.

`static` Configure::**consume**($key)

param string \$key  
The key to read, can use be a `dot notation` value

Read and delete a key from Configure. This is useful when you want to
combine reading and deleting values in a single operation.

`static` Configure::**check**($key)

param string \$key  
The key to check.

Used to check if a key/path exists and has not-null value.

::: info Added in version 2.3
`Configure::check()` was added in 2.3
:::

`static` Configure::**delete**($key)

param string \$key  
The key to delete, can be a `dot notation` value

Used to delete information from the application's configuration:

``` php
Configure::delete('Company.name');
```

`static` Configure::**version**()

Returns the CakePHP version for the current application.

`static` Configure::**config**($name, $reader)

param string \$name  
The name of the reader being attached.

param ConfigReaderInterface \$reader  
The reader instance being attached.

Attach a configuration reader to Configure. Attached readers can
then be used to load configuration files. See [Loading Configuration Files](#loading-configuration-files)
for more information on how to read configuration files.

`static` Configure::**configured**($name = null)

param string \$name  
The name of the reader to check, if null
a list of all attached readers will be returned.

Either check that a reader with a given name is attached, or get
the list of attached readers.

`static` Configure::**drop**($name)

Drops a connected reader object.

## Reading and writing configuration files

CakePHP comes with two built-in configuration file readers.
`PhpReader` is able to read PHP config files, in the same
format that Configure has historically read. `IniReader` is
able to read ini config files. See the [PHP documentation](https://www.php.net/parse_ini_file)
for more information on the specifics of ini files.
To use a core config reader, you'll need to attach it to Configure
using `Configure::config()`:

``` php
// Read config files from CONFIG (config/)
Configure::config('default', new PhpReader());

// Read config files from another path.
Configure::config('default', new PhpReader('/path/to/your/config/files/'));
```

Both readers read from the `CONFIG` directory by default, and from a plugin's
`Config/` directory when you use plugin syntax such as
`Configure::load('MyPlugin.my_file')`.

You can have multiple readers attached to Configure, each reading
different kinds of configuration files, or reading from
different types of sources. You can interact with attached readers
using a few other methods on Configure. To see which reader
aliases are attached you can use `Configure::configured()`:

``` php
// Get the array of aliases for attached readers.
Configure::configured();

// Check if a specific reader is attached
Configure::configured('default');
```

You can also remove attached readers. `Configure::drop('default')`
would remove the default reader alias. Any future attempts to load configuration
files with that reader would fail.

<a id="loading-configuration-files"></a>

### Loading configuration files

`static` Configure::**load**($key, $config = 'default', $merge = true)

param string \$key  
The identifier of the configuration file to load.

param string \$config  
The alias of the configured reader.

param boolean \$merge  
Whether or not the contents of the read file
should be merged, or overwrite the existing values.

Once you've attached a config reader to Configure you can load configuration files:

``` php
// Load config/my_file.php using the 'default' reader object.
Configure::load('my_file', 'default');
```

Loaded configuration files merge their data with the existing runtime configuration
in Configure. This allows you to overwrite and add new values
into the existing runtime configuration. By setting `$merge` to false, values
will not ever overwrite the existing configuration.

### Creating or modifying configuration files

`static` Configure::**dump**($key, $config = 'default', $keys = [])

param string \$key  
The name of the file/stored configuration to be created.

param string \$config  
The name of the reader to store the data with.

param array \$keys  
The list of top-level keys to save. Defaults to all
keys.

Dumps all or some of the data in Configure into a file or storage system
supported by a config reader. The serialization format
is decided by the config reader attached as \$config. For example, if the
'default' adapter is a `PhpReader`, the generated file will be a PHP
configuration file loadable by the `PhpReader`

Given that the 'default' reader is an instance of PhpReader.
Save all data in Configure to the file \`my_config.php\`:

``` php
Configure::dump('my_config.php', 'default');
```

Save only the error handling configuration:

``` php
Configure::dump('error.php', 'default', ['Error', 'Exception']);
```

`Configure::dump()` can be used to either modify or overwrite
configuration files that are readable with `Configure::load()`

::: info Added in version 2.2
`Configure::dump()` was added in 2.2.
:::

### Storing runtime configuration

`static` Configure::**store**($name, $cacheConfig = 'default', $data = null)

param string \$name  
The storage key for the cache file.

param string \$cacheConfig  
The name of the cache configuration to store the
configuration data with.

param mixed \$data  
Either the data to store, or leave null to store all data
in Configure.

You can also store runtime configuration values for use in a future request.
Since configure only remembers values for the current request, you will
need to store any modified configuration information if you want to
use it in subsequent requests:

``` php
// Store the current configuration in the 'user_1234' key in the 'default' cache.
Configure::store('user_1234', 'default');
```

Stored configuration data is persisted in the `Cache` class. This allows
you to store Configuration information in any storage engine that `Cache` can talk to.

### Restoring runtime configuration

`static` Configure::**restore**($name, $cacheConfig = 'default')

param string \$name  
The storage key to load.

param string \$cacheConfig  
The cache configuration to load the data from.

Once you've stored runtime configuration, you'll probably need to restore it
so you can access it again. `Configure::restore()` does exactly that:

``` php
// restore runtime configuration from the cache.
Configure::restore('user_1234', 'default');
```

When restoring configuration information it's important to restore it with
the same key, and cache configuration as was used to store it. Restored
information is merged on top of the existing runtime configuration.

## Creating your own Configuration readers

Since configuration readers are an extensible part of CakePHP,
you can create configuration readers in your application and plugins.
Configuration readers need to implement the `ConfigReaderInterface`.
This interface defines a `read()` and a `dump()` method.
If you really like XML files, you could create a simple Xml config
reader for you application:

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

    /**
     * As of 2.3 a dump() method is also required
     */
    public function dump($key, $data)
    {
        // code to dump data to file
    }
}
```

In your `config/bootstrap.php` you could attach this reader and use it:

``` php
Configure::config('xml', new MyXmlReader());
// ...

Configure::load('my_xml');
```

With Composer classmap autoloading for `src/`, the reader class is found
automatically after `composer dump-autoload`. Without it, load the class
first with `App::uses('MyXmlReader', 'Configure');`.

> [!WARNING]
> It is not a good idea to call your custom configure class `XmlReader` because that
> class name is an internal PHP one already:
> [XMLReader](https://www.php.net/manual/en/book.xmlreader.php)

The `read()` method of a config reader, must return an array of the configuration information
that the resource named `$key` contains.

`interface` **ConfigReaderInterface**

Defines the interface used by classes that read configuration data and
store it in `Configure`

`method` ConfigReaderInterface::**read**($key)

`method` ConfigReaderInterface::**dump**($key, $data)

::: info Added in version 2.3
`ConfigReaderInterface::dump()` was added in 2.3.
:::

`exception` **ConfigureException**

Thrown when errors occur when loading/storing/restoring configuration data.
`ConfigReaderInterface` implementations should throw this exception when they
encounter an error.

### Built-in Configuration readers

`class` **PhpReader**

`class` **IniReader**

<a id="inflection-configuration"></a>

## Inflection Configuration

CakePHP's naming conventions can be really nice - you can name your
database table big_boxes, your model BigBox, your controller
BigBoxesController, and everything just works together
automatically. The way CakePHP knows how to tie things together is
by *inflecting* the words between their singular and plural forms.

There are occasions (especially for our non-English speaking
friends) where you may run into situations where CakePHP's
`Inflector` (the class that pluralizes, singularizes, camelCases, and
under_scores) might not work as you'd like. If CakePHP won't
recognize your Foci or Fish, you can tell CakePHP about your
special cases.

### Loading custom inflections

You can use `Inflector::rules()` in the file
`config/bootstrap.php` to load custom inflections:

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

or:

``` php
Inflector::rules('plural', ['irregular' => ['phylum' => 'phyla']]);
```

Will merge the supplied rules into the inflection sets defined in
the framework's `src/Cake/Utility/Inflector.php`
(`vendor/pieceofcake2/cakephp/src/Cake/Utility/Inflector.php`), with the
added rules taking precedence over the core rules.

## Bootstrapping CakePHP

If you have any additional configuration needs, use CakePHP's
bootstrap file, found in `config/bootstrap.php`. This file is
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

You might also consider placing things in the `AppController` class.
This class is a parent class to all of the controllers in your
application. `AppController` is a handy place to use controller
callbacks and define methods to be used by all of your
controllers.
