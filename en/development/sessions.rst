Sessions
########

CakePHP provides a wrapper and suite of utility features on top of PHP's native
``session`` extension. Sessions allow you to identify unique users across
requests and store persistent data for specific users. Unlike Cookies, session
data is not available on the client side. Usage of ``$_SESSION`` is generally
avoided in CakePHP, and instead usage of the Session classes is preferred.

.. _session-configuration:

Session Configuration
=====================

Session configuration is generally defined in ``/config/app.php``. The available
options are:

* ``Session.timeout`` - The number of *minutes* before CakePHP's session
  handler expires the session.

* ``Session.defaults`` - Allows you to use the built-in default session
  configurations as a base for your session configuration. See below for the
  built-in defaults.

* ``Session.handler`` - Allows you to define a custom session handler. The core
  database and cache session handlers use this. See below for additional
  information on Session handlers.

* ``Session.ini`` - Allows you to set additional session ini settings for your
  config. This combined with ``Session.handler`` replace the custom session
  handling features of previous versions

* ``Session.cookie`` - The name of the cookie to use. Defaults to 'CAKEPHP'.

* ``Session.cookiePath`` - The url path for which session cookie is set. Maps to
  the ``session.cookie_path`` php.ini config. Defaults to base path of app.

CakePHP's defaults ``session.cookie_secure`` to ``true``, when your application
is on an SSL protocol. If your application serves from both SSL and non-SSL
protocols, then you might have problems with sessions being lost. If you need
access to the session on both SSL and non-SSL domains you will want to disable
this::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

The session cookie path defaults to app's base path. To change this you can use
the ``session.cookie_path`` ini value. For example if you want your session to
persist across all subdomains you can do::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/',
            'session.cookie_domain' => '.yourdomain.com'
        ]
    ]);

By default PHP sets the session cookie to expire as soon as the browser is
closed, regardless of the configured ``Session.timeout`` value. The cookie
timeout is controlled by the ``session.cookie_lifetime`` ini value and can be
configured using::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            // Invalidate the cookie after 30 minutes without visiting
            // any page on the site.
            'session.cookie_lifetime' => 1800
        ]
    ]);

The difference between ``Session.timeout`` and the ``session.cookie_lifetime``
value is that the latter relies on the client telling the truth about the
cookie. If you require stricter timeout checking, without relying on what the
client reports, you should use ``Session.timeout``.

Please note that ``Session.timeout`` corresponds to the total time of
inactivity for a user (i.e. the time without visiting any page where the session
is used), and does not limit the total amount of minutes a user can stay
on the site.

Built-in Session Handlers & Configuration
=========================================

CakePHP comes with several built-in session configurations. You can either use
these as the basis for your session configuration, or you can create a fully
custom solution. To use defaults, simply set the 'defaults' key to the name of
the default you want to use. You can then override any sub setting by declaring
it in your Session config::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

The above will use the built-in 'php' session configuration. You could augment
part or all of it by doing the following::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 // 3 days
    ]);

The above overrides the timeout and cookie name for the 'php' session
configuration. The built-in configurations are:

* ``php`` - Saves sessions with the standard settings in your php.ini file.
* ``cake`` - Saves sessions as files inside ``tmp/sessions``. This is a
  good option when on hosts that don't allow you to write outside your own home
  dir.
* ``database`` - Use the built-in database sessions. See below for more
  information.
* ``cache`` - Use the built-in cache sessions. See below for more information.

Session Handlers
----------------

Session handlers can also be defined in the session config array.  By defining
the 'handler.engine' config key, you can name the class name, or provide
a handler instance.  The class/object must implement the
native PHP ``SessionHandlerInterface``. Implementing this interface will allow
``Session`` to automatically map the methods for the handler. Both the core
Cache and Database session handlers use this method for saving sessions.
Additional settings for the handler should be placed inside the handler array.
You can then read those values out from inside your handler::

    'Session' => [
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

The above shows how you could setup the Database session handler with an
application model. When using class names as your handler.engine, CakePHP will
expect to find your class in the ``Network\Session`` namespace. For example, if
you had an ``AppSessionHandler`` class,  the file should be
**src/Network/Session/AppSessionHandler.php**, and the class name should be
``App\Network\Session\AppSessionHandler``. You can also use session handlers
from inside plugins. By setting the engine to ``MyPlugin.PluginSessionHandler``.

Database Sessions
-----------------

If you need to use a database to store your session data, configure as follows::

    'Session' => [
        'defaults' => 'database'
    ]

This configuration will require a database table, having this schema::

  CREATE TABLE `sessions` (
    `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP, # Optional
    `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, # Optional
    `data` blob DEFAULT NULL,
    `expires` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

You can find a copy of the schema for the sessions table in the application
skeleton in ``config/schema/sessions.sql``.

You can also use your own ``Table`` class to handle the saving of the sessions::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

The above will tell Session to use the built-in 'database' defaults, and
specify that a Table called ``CustomSessions`` will be the delegate for saving
session information to the database.

Cache Sessions
--------------

The Cache class can be used to store sessions as well. This allows you to store
sessions in a cache like APC, Memcached, or XCache. There are some caveats to
using cache sessions, in that if you exhaust the cache space, sessions will
start to expire as records are evicted.

To use Cache based sessions you can configure you Session config like::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session'
        ]
    ]);

This will configure Session to use the ``CacheSession`` class as the
delegate for saving the sessions. You can use the 'config' key which cache
configuration to use. The default cache configuration is ``'default'``.

Setting ini directives
======================

The built-in defaults attempt to provide a common base for session
configuration. You may need to tweak specific ini flags as well. CakePHP
exposes the ability to customize the ini settings for both default
configurations, as well as custom ones. The ``ini`` key in the session settings,
allows you to specify individual configuration values. For example you can use
it to control settings like ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MyCookie',
            'session.cookie_lifetime' => 1800, // Valid for 30 minutes
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);


Creating a Custom Session Handler
=================================

Creating a custom session handler is straightforward in CakePHP. In this
example we'll create a session handler that stores sessions both in the Cache
(APC) and the database. This gives us the best of fast IO of APC,
without having to worry about sessions evaporating when the cache fills up.

First we'll need to create our custom class and put it in
**src/Network/Session/ComboSession.php**. The class should look
something like::

    namespace App\Network\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Network\Session\DatabaseSession;

    class ComboSession extends DatabaseSession
    {
        public $cacheKey;

        public function __construct()
        {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // Read data from the session.
        public function read($id)
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // Write data into the session.
        public function write($id, $data)
        {
            Cache::write($id, $data, $this->cacheKey);
            return parent::write($id, $data);
        }

        // Destroy a session.
        public function destroy($id)
        {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // Removes expired sessions.
        public function gc($expires = null)
        {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Our class extends the built-in ``DatabaseSession`` so we don't have to duplicate
all of its logic and behavior. We wrap each operation with
a :php:class:`Cake\\Cache\\Cache` operation. This lets us fetch sessions from
the fast cache, and not have to worry about what happens when we fill the cache.
Using this session handler is also easy. In your **app.php** make the session
block look like the following::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        ]
    ],
    // Make sure to add a apc cache config
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Now our application will start using our custom session handler for reading and
writing session data.


.. php:class:: Session

.. _accessing-session-object:

Accessing the Session Object
============================

You can access the session data any place you have access to a request object.
This means the session is accessible from:

* Controllers
* Views
* Helpers
* Cells
* Components

In addition to the basic session object, you can also use the
:php:class:`Cake\\View\\Helper\\SessionHelper` to interact with the session in
your views. A basic example of session usage would be::

    $name = $this->request->session()->read('User.name');

    // If you are accessing the session multiple times,
    // you will probably want a local variable.
    $session = $this->request->session();
    $name = $session->read('User.name');

Reading & Writing Session Data
==============================

.. php:method:: read($key)

You can read values from the session using :php:meth:`Hash::extract()`
compatible syntax::

    $session->read('Config.language');

.. php:method:: write($key, $value)

``$key`` should be the dot separated path you wish to write ``$value`` to::

    $session->write('Config.language', 'en');

You may also specify one or multiple hashes like so::

    $session->write([
      'Config.theme' => 'blue',
      'Config.language' => 'en',
    ]);

.. php:method:: delete($key)

When you need to delete data from the session, you can use ``delete()``::

    $session->delete('Some.value');

.. php:staticmethod:: consume($key)

When you need to read and delete data from the session, you can use
``consume()``::

    $session->consume('Some.value');

.. php:method:: check($key)

If you want to see if data exists in the session, you can use ``check()``::

    if ($session->check('Config.language')) {
        // Config.language exists and is not null.
    }

Destroying the Session
======================

.. php:method:: destroy()

Destroying the session is useful when users log out. To destroy a session, use
the ``destroy()`` method::

    $session->destroy();

Destroying a session will remove all serverside data in the session, but will
**not** remove the session cookie.

Rotating Session Identifiers
============================

.. php:method:: renew()

While ``AuthComponent`` automatically renews the session id when users login and
logout, you may need to rotate the session id's manually. To do this use the
``renew()`` method::

    $session->renew();

Flash Messages
==============

Flash messages are small messages displayed to end users once. They are often
used to present error messages, or confirm that actions took place successfully.

To set and display flash messages you should use
:doc:`/controllers/components/flash` and
:doc:`/views/helpers/flash`

.. meta::
    :title lang=en: Sessions
    :keywords lang=en: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
