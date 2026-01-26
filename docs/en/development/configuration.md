# Configuration

While conventions remove the need to configure all of CakePHP, you'll still need
to configure a few things like your database credentials.

Additionally, there are optional configuration options that allow you to swap
out default values & implementations with ones tailored to your application.

<div class="index">

app.php, app_local.example.php

</div>

<div class="index">

configuration

</div>

## Configuring your Application

Your application will come with a few configuration files located in the
**config** directory. By default CakePHP uses PHP files for its configuration,
but you can switch to INI or JSON files if you'd prefer.

Configuration files are loaded at the beginning of each request during your
application's 'bootstrap' process. Configuration is loaded into
`Cake\Core\Configure` and is used to configure the various services
provided by CakePHP and your application.

The application skeleton features a **config/app.php** file which should contain
configuration that doesn't vary across the various environments your application
is deployed in. The **config/app_local.php** file should contain the
configuration data that varies between environments and shouldn't be checked
into version control. Both of these files reference environment variables
through the `env()` function that enables configuration values to set though
the server environment.

### Loading Additional Configuration Files

If your application has many configuration options it can be helpful to split
configuration into multiple files. After creating each of the files in your
**config/** directory you can load them in **bootstrap.php**:

``` php
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

Configure::config('default', new PhpConfig());
Configure::load('app', 'default', false);
Configure::load('other_config', 'default');
```

<a id="environment-variables"></a>

## Environment Variables

Many modern cloud providers, like Heroku, let you define environment
variables for configuration data. You can configure your CakePHP through
environment variables in the [12factor app style](https://12factor.net/).
Environment variables allow your application to require less state making your
application easier to manage when it is deployed across a number of
environments.

As you can see in your **app.php**, the `env()` function is used to read
configuration from the environment, and build the application configuration.
CakePHP uses `DSN` strings for databases, logs, email transports and cache
configurations allowing you to easily vary these libraries in each environment.

For local development, CakePHP leverages [dotenv](https://github.com/josegonzalez/php-dotenv) to allow easy local development using
environment variables. You will see a `config/.env.example` in your
application. By copying this file into `config/.env` and customizing the
values you can configure your application.

You should avoid committing the `config/.env` file to your repository and
instead use the `config/.env.example` as a template with placeholder values so
everyone on your team knows what environment variables are in use and what
should go in each one.

Once your environment variables have been set, you can use `env()` to read
data from the environment:

``` php
$debug = env('APP_DEBUG', false);
```

The second value passed to the env function is the default value. This value
will be used if no environment variable exists for the given key.

::: info Changed in version 3.5.0
dotenv library support was added to the application skeleton.
:::

::: info Changed in version 3.5.1
dotenv library support is now opt in. You must uncomment the appropriate block of code in `config/bootstrap.php`
:::

### General Configuration

Below is a description of the variables and how they affect your CakePHP
application.

debug  
Changes CakePHP debugging output. `false` = Production mode. No error
messages, errors, or warnings shown. `true` = Errors and warnings shown.

App.namespace  
The namespace to find app classes under.

> [!NOTE]
> When changing the namespace in your configuration, you will also
> need to update your **composer.json** file to use this namespace
> as well. Additionally, create a new autoloader by running
> `php composer.phar dump-autoload`.

<div id="core-configuration-baseurl">

App.baseUrl  
Un-comment this definition if you **don’t** plan to use Apache’s
mod_rewrite with CakePHP. Don’t forget to remove your .htaccess
files too.

App.base  
The base directory the app resides in. If `false` this
will be auto detected. If not `false`, ensure your string starts
with a <span class="title-ref">/</span> and does NOT end with a <span class="title-ref">/</span>. E.g., <span class="title-ref">/basedir</span> is a valid
App.base. Otherwise, the AuthComponent will not work properly.

App.encoding  
Define what encoding your application uses. This encoding
is used to generate the charset in the layout, and encode entities.
It should match the encoding values specified for your database.

App.webroot  
The webroot directory.

App.wwwRoot  
The file path to webroot.

App.fullBaseUrl  
The fully qualified domain name (including protocol), e.g. `https://app.example.org`, to your application's
root. This is used when generating absolute URLs. By default this value
is generated using the `$_SERVER` environment. However, you should define it
manually to optimize performance or if you are concerned about people
manipulating the `Host` header.
In a CLI context (from shells) the <span class="title-ref">fullBaseUrl</span> cannot be read from \$\_SERVER,
as there is no webserver involved. You do need to specify it yourself if
you do need to generate URLs from a shell (e.g. when sending emails).

App.imageBaseUrl  
Web path to the public images directory under webroot. If you are using
a `CDN` you should set this value to the CDN's location.

App.cssBaseUrl  
Web path to the public css directory under webroot. If you are using
a `CDN` you should set this value to the CDN's location.

App.jsBaseUrl  
Web path to the public js directory under webroot. If you are using
a `CDN` you should set this value to the CDN's location.

App.paths  
Configure paths for non class based resources. Supports the
`plugins`, `templates`, `locales` subkeys, which allow the definition
of paths for plugins, view templates and locale files respectively.

App.uploadedFilesAsObjects  
Defines whether uploaded files are being represented as objects (`true`),
or arrays (`false`). This option is being treated as disabled by default.
See the [File Uploads section](../controllers/request-response#request-file-uploads) in the Request &
Response Objects chapter for more information.

::: info Added in version 3.9.0
Support for uploaded files as objects in the request data was added in version 3.9.0
:::

Security.salt  
A random string used in hashing. This value is also used as the
HMAC salt when doing symetric encryption.

Asset.timestamp  
Appends a timestamp which is last modified time of the particular
file at the end of asset files URLs (CSS, JavaScript, Image) when
using proper helpers. Valid values:

- (bool) `false` - Doesn't do anything (default)
- (bool) `true` - Appends the timestamp when debug is `true`
- (string) 'force' - Always appends the timestamp.

::: info Changed in version 3.6.0
As of 3.6.0, you can override this global setting when linking assets using the `timestamp` option.
:::

Asset.cacheTime  
Sets the asset cache time. This determines the http header `Cache-Control`'s
`max-age`, and the http header's `Expire`'s time for assets.
This can take anything that you version of PHP's [strtotime function](https://php.net/manual/en/function.strtotime.php) can take.
The default is `+1 day`.

</div>

### Using a CDN

To use a CDN for loading your static assets, change `App.imageBaseUrl`,
`App.cssBaseUrl`, `App.jsBaseUrl` to point the CDN URI, for example:
`https://mycdn.example.com/` (note the trailing `/`).

All images, scripts and styles loaded via HtmlHelper will prepend the absolute
CDN path, matching the same relative path used in the application. Please note
there is a specific use case when using plugin based assets: plugins will not
use the plugin's prefix when absolute `...BaseUrl` URI is used, for example By
default:

- `$this->Helper->assetUrl('TestPlugin.logo.png')` resolves to `test_plugin/logo.png`

If you set `App.imageBaseUrl` to `https://mycdn.example.com/`:

- `$this->Helper->assetUrl('TestPlugin.logo.png')` resolves to `https://mycdn.example.com/logo.png`.

### Database Configuration

See the [Database Configuration](../orm/database-basics#database-configuration) for information
on configuring your database connections.

### Caching Configuration

See the [Caching Configuration](../core-libraries/caching#cache-configuration) for information on
configuring caching in CakePHP.

### Error and Exception Handling Configuration

See the [Error and Exception Configuration](../development/errors#error-configuration) for
information on configuring error and exception handlers.

### Logging Configuration

See the [Log Configuration](../core-libraries/logging#log-configuration) for information on configuring logging in
CakePHP.

### Email Configuration

See the [Email Configuration](../core-libraries/email#email-configuration) for information on
configuring email presets in CakePHP.

### Session Configuration

See the [Session Configuration](../development/sessions#session-configuration) for information on configuring session
handling in CakePHP.

### Routing configuration

See the [Routes Configuration](../development/routing#routes-configuration) for more information
on configuring routing and creating routes for your application.

<a id="additional-class-paths"></a>

## Additional Class Paths

Additional class paths are setup through the autoloaders your application uses.
When using `composer` to generate your autoloader, you could do the following,
to provide fallback paths for controllers in your application:

``` json
"autoload": {
    "psr-4": {
        "App\\Controller\\": "/path/to/directory/with/controller/folders/",
        "App\\": "src/"
    }
}
```

The above would setup paths for both the `App` and `App\Controller`
namespace. The first key will be searched, and if that path does not contain the
class/file the second key will be searched. You can also map a single namespace
to multiple directories with the following:

``` json
"autoload": {
    "psr-4": {
        "App\\": ["src/", "/path/to/directory/"]
    }
}
```

### Plugin, View Template and Locale Paths

Since plugins, view templates and locales are not classes, they cannot have an
autoloader configured. CakePHP provides three Configure variables to setup additional
paths for these resources. In your **config/app.php** you can set these variables:

``` text
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
```

Paths should end with a directory separator, or they will not work properly.

## Inflection Configuration

See the [Inflection Configuration](../core-libraries/inflector#inflection-configuration) docs for more information.

## Configure Class

`class` Cake\\Core\\**Configure**

CakePHP's Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure CakePHP provides.

### Writing Configuration data

`static` Cake\\Core\\Configure::**write**($key, $value)

Use `write()` to store data in the application's configuration:

``` php
Configure::write('Company.name','Pizza, Inc.');
Configure::write('Company.slogan','Pizza for your body and soul');
```

> [!NOTE]
> The `dot notation` used in the `$key` parameter can be used to
> organize your configuration settings into logical groups.

The above example could also be written in a single call:

``` php
Configure::write('Company', [
    'name' => 'Pizza, Inc.',
    'slogan' => 'Pizza for your body and soul'
]);
```

You can use `Configure::write('debug', $bool)` to switch between debug and
production modes on the fly. This is especially handy for JSON interactions
where debugging information can cause parsing problems.

### Reading Configuration Data

`static` Cake\\Core\\Configure::**read**($key = null, $default = null)

Used to read configuration data from the application. If a key is supplied, the
data is returned. Using our examples from write() above, we can read that data
back:

``` php
// Returns 'Pizza Inc.'
Configure::read('Company.name');

// Returns 'Pizza for your body and soul'
Configure::read('Company.slogan');

Configure::read('Company');
// Returns:
['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

// Returns 'fallback' as Company.nope is undefined.
Configure::read('Company.nope', 'fallback');
```

If `$key` is left null, all values in Configure will be returned.

::: info Changed in version 3.5.0
The `$default` parameter was added in 3.5.0
:::

`static` Cake\\Core\\Configure::**readOrFail**($key)

Reads configuration data just like `Cake\Core\Configure::read`
but expects to find a key/value pair. In case the requested pair does not
exist, a `RuntimeException` will be thrown:

``` php
Configure::readOrFail('Company.name');    // Yields: 'Pizza, Inc.'
Configure::readOrFail('Company.geolocation');  // Will throw an exception

Configure::readOrFail('Company');

// Yields:
['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];
```

::: info Added in version 3.1.7
`Configure::readOrFail()` was added in 3.1.7
:::

### Checking to see if Configuration Data is Defined

`static` Cake\\Core\\Configure::**check**($key)

Used to check if a key/path exists and has non-null value:

``` php
$exists = Configure::check('Company.name');
```

### Deleting Configuration Data

`static` Cake\\Core\\Configure::**delete**($key)

Used to delete information from the application's configuration:

``` php
Configure::delete('Company.name');
```

### Reading & Deleting Configuration Data

`static` Cake\\Core\\Configure::**consume**($key)

Read and delete a key from Configure. This is useful when you want to
combine reading and deleting values in a single operation.

`static` Cake\\Core\\Configure::**consumeOrFail**($key)

Consumes configuration data just like `Cake\Core\Configure::consume`
but expects to find a key/value pair. In case the requested pair does not
exist, a `RuntimeException` will be thrown:

``` php
Configure::consumeOrFail('Company.name');    // Yields: 'Pizza, Inc.'
Configure::consumeOrFail('Company.geolocation');  // Will throw an exception

Configure::consumeOrFail('Company');

// Yields:
['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];
```

::: info Added in version 3.6.0
`Configure::readOrFail()` was added in 3.6.0
:::

## Reading and writing configuration files

`static` Cake\\Core\\Configure::**config**($name, $engine)

CakePHP comes with two built-in configuration file engines.
`Cake\Core\Configure\Engine\PhpConfig` is able to read PHP config
files, in the same format that Configure has historically read.
`Cake\Core\Configure\Engine\IniConfig` is able to read ini config
files. See the [PHP documentation](https://php.net/parse_ini_file) for more
information on the specifics of ini files. To use a core config engine, you'll
need to attach it to Configure using `Configure::config()`:

``` php
use Cake\Core\Configure\Engine\PhpConfig;

// Read config files from config
Configure::config('default', new PhpConfig());

// Read config files from another path.
Configure::config('default', new PhpConfig('/path/to/your/config/files/'));
```

You can have multiple engines attached to Configure, each reading different
kinds or sources of configuration files. You can interact with attached engines
using a few other methods on Configure. To check which engine aliases are
attached you can use `Configure::configured()`:

``` php
// Get the array of aliases for attached engines.
Configure::configured();

// Check if a specific engine is attached
Configure::configured('default');
```

`static` Cake\\Core\\Configure::**drop**($name)

You can also remove attached engines. `Configure::drop('default')`
would remove the default engine alias. Any future attempts to load configuration
files with that engine would fail:

``` php
Configure::drop('default');
```

<a id="loading-configuration-files"></a>

### Loading Configuration Files

`static` Cake\\Core\\Configure::**load**($key, $config = 'default', $merge = true)

Once you've attached a config engine to Configure you can load configuration
files:

``` php
// Load my_file.php using the 'default' engine object.
Configure::load('my_file', 'default');
```

Loaded configuration files merge their data with the existing runtime
configuration in Configure. This allows you to overwrite and add new values into
the existing runtime configuration. By setting `$merge` to `true`, values
will not ever overwrite the existing configuration.

### Creating or Modifying Configuration Files

`static` Cake\\Core\\Configure::**dump**($key, $config = 'default', $keys = [])

Dumps all or some of the data in Configure into a file or storage system
supported by a config engine. The serialization format is decided by the config
engine attached as \$config. For example, if the 'default' engine is
a `Cake\Core\Configure\Engine\PhpConfig`, the generated file will be
a PHP configuration file loadable by the
`Cake\Core\Configure\Engine\PhpConfig`

Given that the 'default' engine is an instance of PhpConfig.
Save all data in Configure to the file \`my_config.php\`:

``` php
Configure::dump('my_config', 'default');
```

Save only the error handling configuration:

``` php
Configure::dump('error', 'default', ['Error', 'Exception']);
```

`Configure::dump()` can be used to either modify or overwrite
configuration files that are readable with `Configure::load()`

### Storing Runtime Configuration

`static` Cake\\Core\\Configure::**store**($name, $cacheConfig = 'default', $data = null)

You can also store runtime configuration values for use in a future request.
Since configure only remembers values for the current request, you will
need to store any modified configuration information if you want to
use it in subsequent requests:

``` php
// Store the current configuration in the 'user_1234' key in the 'default' cache.
Configure::store('user_1234', 'default');
```

Stored configuration data is persisted in the named cache configuration. See the
[Caching](../core-libraries/caching) documentation for more information on caching.

### Restoring Runtime Configuration

`static` Cake\\Core\\Configure::**restore**($name, $cacheConfig = 'default')

Once you've stored runtime configuration, you'll probably need to restore it
so you can access it again. `Configure::restore()` does exactly that:

``` php
// Restore runtime configuration from the cache.
Configure::restore('user_1234', 'default');
```

When restoring configuration information it's important to restore it with
the same key, and cache configuration as was used to store it. Restored
information is merged on top of the existing runtime configuration.

### Configuration Engines

CakePHP provides the ability to load configuration files from a number of
different sources, and features a pluggable system for [creating your own
configuration engines](https://api.cakephp.org/3.x/class-Cake.Core.Configure.ConfigEngineInterface.html).
The built in configuration engines are:

- [JsonConfig](https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.JsonConfig.html)
- [IniConfig](https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.IniConfig.html)
- [PhpConfig](https://api.cakephp.org/3.x/class-Cake.Core.Configure.Engine.PhpConfig.html)

By default your application will use `PhpConfig`.

## Bootstrapping CakePHP

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
your controllers. As you'll see in the [Controllers](../controllers) and [Views](../views)
sections there are better ways you add custom logic to your application.

<a id="application-bootstrap"></a>

### Application::bootstrap()

In addition to the **config/bootstrap.php** file which should be used to
configure low-level concerns of your application, you can also use the
`Application::bootstrap()` hook method to load/initialize plugins, and attach
global event listeners:

``` php
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

        $this->addPlugin('MyPlugin', ['bootstrap' => true, 'routes' => true]);
    }
}
```

Loading plugins/events in `Application::bootstrap()` makes
[Integration Testing](../development/testing#integration-testing) easier as events and routes will be re-processed on
each test method.

## Disabling Generic Tables

While utilizing generic table classes - also called auto-tables - when quickly
creating new applications and baking models is useful, generic table class can
make debugging more difficult in some scenarios.

You can check if any query was emitted from a generic table class via DebugKit
via the SQL panel in DebugKit. If you're still having trouble diagnosing an
issue that could be caused by auto-tables, you can throw an exception when
CakePHP implicitly uses a generic `Cake\ORM\Table` instead of your concrete
class like so:

``` php
// In your bootstrap.php
use Cake\Event\EventManager;
// Prior to 3.6 use Cake\Network\Exception\InteralErrorException
use Cake\Http\Exception\InternalErrorException;

$isCakeBakeShellRunning = (PHP_SAPI === 'cli' && isset($argv[1]) && $argv[1] === 'bake');
if (!$isCakeBakeShellRunning) {
    EventManager::instance()->on('Model.initialize', function($event) {
        $subject = $event->getSubject();
        if (get_class($subject) === 'Cake\ORM\Table') {
            $msg = sprintf(
                'Missing table class or incorrect alias when registering table class for database table %s.',
                $subject->getTable());
            throw new InternalErrorException($msg);
        }
    });
}
```
