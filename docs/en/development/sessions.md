# Sessions

CakePHP provides a wrapper and suite of utility features on top of PHP's native
`session` extension. Sessions allow you to identify unique users across the
requests and store persistent data for specific users. Unlike Cookies, session
data is not available on the client side. Usage of `$_SESSION` is generally
avoided in CakePHP, and instead usage of the Session classes is preferred.

## Session Configuration

Session configuration is stored in `Configure` under the top
level `Session` key, and a number of options are available:

- `Session.cookie` - Change the name of the session cookie.
- `Session.timeout` - The number of *minutes* before CakePHP's session handler expires the session.
  This affects `Session.autoRegenerate` (below), and is handled by CakeSession.
- `Session.cookieTimeout` - The number of *minutes* before the session cookie expires.
  If this is undefined, it will use the same value as `Session.timeout`.
  This affects the session cookie, and is handled by PHP itself.
- `Session.checkAgent` - Should the user agent be checked, on each request. If
  the user agent does not match the session will be destroyed.
- `Session.autoRegenerate` - Enabling this setting, turns on automatic
  renewal of sessions, and session ids that change frequently. Enabling this
  value will use the session's `Config.countdown` value to keep track of requests.
  Once the countdown reaches 0, the session id will be regenerated. This is a
  good option to use for applications that need frequently
  changing session ids for security reasons. You can control the number of requests
  needed to regenerate the session by modifying `CakeSession::$requestCountdown`.
- `Session.defaults` - Allows you to use one the built-in default session
  configurations as a base for your session configuration.
- `Session.handler` - Allows you to define a custom session handler. The core
  database and cache session handlers use this. This option replaces
  `Session.save` in previous versions. See below for additional information on
  Session handlers.
- `Session.ini` - Allows you to set additional session ini settings for your
  config. This combined with `Session.handler` replace the custom session
  handling features of previous versions
- `Session.cacheLimiter` - Allows you define the cache control headers used
  for the session cookie. The default is `must-revalidate`. This option was
  added in 2.8.0.

CakePHP's defaults to setting `session.cookie_secure` to true, when your
application is on an SSL protocol. If your application serves from both SSL and
non-SSL protocols, then you might have problems with sessions being lost. If
you need access to the session on both SSL and non-SSL domains you will want to
disable this:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_secure' => false
    ]
]);
```

Session cookie paths default to the application's base path (`/` when the
application is served from the document root). To change this you can use the
`session.cookie_path` ini flag to the directory path of your application:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_path' => '/app/dir'
    ]
]);
```

If you are using php's default session settings, take note that
session.gc_maxlifetime can override your setting for timeout. The default is
24 minutes. Change this in your ini settings to get it to match longer
sessions:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'timeout' => 2160, // 36 hours
    'ini' => [
        'session.gc_maxlifetime' => 129600 // 36 hours
    ]
]);
```

## Built-in Session handlers & configuration

CakePHP comes with several built-in session configurations. You can either use
these as the basis for your session configuration, or you can create a fully
custom solution. To use defaults, simply set the 'defaults' key to the name of
the default you want to use. You can then override any sub setting by declaring
it in your Session config:

``` php
Configure::write('Session', [
    'defaults' => 'php'
]);
```

The above will use the built-in 'php' session configuration. You could augment
part or all of it by doing the following:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'cookie' => 'my_app',
    'timeout' => 4320 //3 days
]);
```

The above overrides the timeout and cookie name for the 'php' session
configuration. The built-in configurations are:

- `php` - Saves sessions with the standard settings in your php.ini file.
- `cake` - Saves sessions as files inside `tmp/sessions` (`app/tmp/sessions`
  in the legacy layout). This is a good option when you want session files kept
  with the application instead of in PHP's global session directory.
- `database` - Use the built-in database sessions. See below for more information.
- `cache` - Use the built-in cache sessions. See below for more information.

### Session Handlers

Session handlers can also be defined in the session config array. When defined
they allow you to map the various `session_save_handler` values to a class or
object you want to use for session saving. There are two ways to use the
'handler'. The first is to provide an array with 6 callables. These callables
are then applied to `session_set_save_handler`:

``` php
Configure::write('Session', [
    'checkAgent' => false,
    'cookie' => 'my_cookie',
    'timeout' => 600,
    'handler' => [
        ['Foo', 'open'],
        ['Foo', 'close'],
        ['Foo', 'read'],
        ['Foo', 'write'],
        ['Foo', 'destroy'],
        ['Foo', 'gc'],
    ],
    'ini' => [
        'session.cookie_secure' => 1,
        'session.use_trans_sid' => 0,
    ],
]);
```

This form is passed directly to `session_set_save_handler()`. Passing
separate callables to that function is deprecated as of PHP 8.4, so prefer the
second form for new code.

The second mode is to define an 'engine' key. This key should be a class name
that implements `CakeSessionHandlerInterface`. Implementing this interface
will allow CakeSession to automatically map the methods for the handler. Both
the core Cache and Database session handlers use this method for saving
sessions. Additional settings for the handler should be placed inside the
handler array. You can then read those values out from inside your handler.

You can also use session handlers from inside plugins. By setting the engine to
something like `MyPlugin.PluginSessionHandler`. This will load and use the
`PluginSessionHandler` class from inside the MyPlugin of your application.

### CakeSessionHandlerInterface

This interface is used for all custom session handlers inside CakePHP, and can
be used to create custom user land session handlers. Simply implement the
interface in your class and set `Session.handler.engine` to the class name
you've created. Put the class in `src/Model/Datasource/Session/$classname.php`
(`app/Model/Datasource/Session/` in the legacy layout). So if your class name is
`AppSessionHandler` the file should be
`src/Model/Datasource/Session/AppSessionHandler.php`. With Composer classmap
autoloading the class is found from the classmap; otherwise CakePHP loads it
from that directory.

CakePHP registers your handler with PHP through `SessionHandlerAdapter`, which
also handles `session.use_strict_mode`: an incoming session ID is accepted only
when your `read()` returns a non-empty string for it. Make `read()` return `''`
for unknown IDs, and make `destroy()` return `true` for sessions that were never
written, as the core `CacheSession` and `DatabaseSession` do.

::: pieceofcake2
Session handlers support
`session.use_strict_mode`, which PHP 8.6 enables by default. Unknown session IDs
are rejected and a new ID is generated, so a custom handler whose `read()` returns
a non-empty value for unknown IDs, or whose `destroy()` fails for them, must be updated.
:::

### Database sessions

The changes in session configuration change how you define database sessions.
Most of the time you will only need to set `Session.handler.model` in your
configuration as well as choose the database defaults:

``` php
Configure::write('Session', [
    'defaults' => 'database',
    'handler' => [
        'model' => 'CustomSession'
    ]
]);
```

The above will tell CakeSession to use the built-in 'database' defaults, and
specify that a model called `CustomSession` will be the delegate for saving
session information to the database.

If you do not need a fully custom session handler, but still require
database-backed session storage, you can simplify the above code to:

``` php
Configure::write('Session', [
    'defaults' => 'database'
]);
```

This configuration will require a database table to be added with
at least these fields:

``` sql
CREATE TABLE `cake_sessions` (
  `id` varchar(255) NOT NULL DEFAULT '',
  `data` text,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

You can also use the schema shell to create this table using the schema file
`config/Schema/sessions.php` provided in the app skeleton:

``` bash
$ bin/cake schema create sessions
```

### Cache Sessions

The Cache class can be used to store sessions as well. This allows you to store
sessions in a cache like APCu, Memcached or Redis. There are some caveats to
using cache sessions, in that if you exhaust the cache space, sessions will
start to expire as records are evicted.

To use Cache based sessions you can configure you Session config like:

``` php
Configure::write('Session', [
    'defaults' => 'cache',
    'handler' => [
        'config' => 'session'
    ]
]);
```

This will configure CakeSession to use the `CacheSession` class as the
delegate for saving the sessions. You can use the 'config' key which cache
configuration to use. The default cache configuration is `'default'`.

## Setting ini directives

The built-in defaults attempt to provide a common base for session
configuration. You may need to tweak specific ini flags as well. CakePHP
exposes the ability to customize the ini settings for both default
configurations, as well as custom ones. The `ini` key in the session settings,
allows you to specify individual configuration values. For example you can use
it to control settings like `session.gc_divisor`:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.gc_divisor' => 1000,
        'session.cookie_httponly' => true
    ]
]);
```

## Creating a custom session handler

Creating a custom session handler is straightforward in CakePHP. In this
example we'll create a session handler that stores sessions both in the Cache
(APCu) and the database. This gives us the best of fast IO of APCu,
without having to worry about sessions evaporating when the cache fills up.

First we'll need to create our custom class and put it in
`src/Model/Datasource/Session/ComboSession.php`. The class should look
something like:

``` php
// src/Model/Datasource/Session/ComboSession.php
class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface
{
    public $cacheKey;

    public function __construct()
    {
        $this->cacheKey = Configure::read('Session.handler.cache');
        parent::__construct();
    }

    // read data from the session.
    public function read($id)
    {
        $result = Cache::read($id, $this->cacheKey);
        if ($result) {
            return $result;
        }
        return parent::read($id);
    }

    // write data into the session.
    public function write($id, $data)
    {
        Cache::write($id, $data, $this->cacheKey);
        return parent::write($id, $data);
    }

    // destroy a session.
    public function destroy($id)
    {
        Cache::delete($id, $this->cacheKey);
        return parent::destroy($id);
    }

    // removes expired sessions.
    public function gc($expires = null)
    {
        Cache::gc($this->cacheKey);
        return parent::gc($expires);
    }
}
```

Our class extends the built-in `DatabaseSession` so we don't have to duplicate
all of its logic and behavior. We wrap each operation with a `Cache`
operation. This lets us fetch sessions from the fast cache, and not have to
worry about what happens when we fill the cache. Using this session handler is
also easy. In your `config/core.php` make the session block look like the following:

``` php
Configure::write('Session', [
    'defaults' => 'database',
    'handler' => [
        'engine' => 'ComboSession',
        'model' => 'Session',
        'cache' => 'apc',
    ],
]);

// Make sure to add an apc cache config (uses APCu)
Cache::config('apc', ['engine' => 'Apc']);
```

Now our application will start using our custom session handler for reading &
writing session data.

`class` **CakeSession**

## Reading & writing session data

Depending on the context you are in, your application has different classes
that provide access to the session. In controllers you can use
`SessionComponent`. In the view, you can use
`SessionHelper`. In any part of your application you can use
`CakeSession` to access the session as well. Like the other interfaces to the
session, `CakeSession` provides a simple CRUD interface.

`static` CakeSession::**read**($key)

You can read values from the session using `Set::classicExtract()`
compatible syntax:

``` php
CakeSession::read('Config.language');
```

`static` CakeSession::**write**($key, $value)

`$key` should be the dot separated path you wish to write `$value` to:

``` php
CakeSession::write('Config.language', 'eng');
```

`static` CakeSession::**delete**($key)

When you need to delete data from the session, you can use delete:

``` php
CakeSession::delete('Config.language');
```

You should also see the documentation on
[Sessions](../core-libraries/components/sessions) and
[SessionHelper](../core-libraries/helpers/session) for how to access Session data
in the controller and view.
