Sessions
########

CakePHP provides a wrapper and suite of utility features on top of PHP's native
``session`` extension. Sessions allow you to identify unique users across the
requests and store persistent data for specific users. Unlike Cookies, session
data is not available on the client side. Usage of ``$_SESSION`` is generally
avoided in CakePHP, and instead usage of the Session classes is preferred.


Session Configuration
=====================

Session configuration is stored in ``Configure`` under the top
level ``Session`` key, and a number of options are available:

* ``Session.cookie`` - Change the name of the session cookie.

* ``Session.timeout`` - The number of *minutes* before CakePHP's session handler expires the session.
  This affects ``Session.autoRegenerate`` (below), and is handled by CakeSession.

* ``Session.cookieTimeout`` - The number of *minutes* before the session cookie expires.
  If this is undefined, it will use the same value as ``Session.timeout``.
  This affects the session cookie, and is handled by PHP itself.

* ``Session.checkAgent`` - Should the user agent be checked, on each request. If
  the user agent does not match the session will be destroyed.

* ``Session.autoRegenerate`` - Enabling this setting, turns on automatic
  renewal of sessions, and session ids that change frequently. Enabling this
  value will use the session's ``Config.countdown`` value to keep track of requests.
  Once the countdown reaches 0, the session id will be regenerated. This is a
  good option to use for applications that need frequently
  changing session ids for security reasons. You can control the number of requests
  needed to regenerate the session by modifying :php:attr:`CakeSession::$requestCountdown`.

* ``Session.defaults`` - Allows you to use one the built-in default session
  configurations as a base for your session configuration.

* ``Session.handler`` - Allows you to define a custom session handler. The core
  database and cache session handlers use this. This option replaces
  ``Session.save`` in previous versions. See below for additional information on
  Session handlers.

* ``Session.ini`` - Allows you to set additional session ini settings for your
  config. This combined with ``Session.handler`` replace the custom session
  handling features of previous versions

CakePHP's defaults to setting ``session.cookie_secure`` to true, when your
application is on an SSL protocol. If your application serves from both SSL and
non-SSL protocols, then you might have problems with sessions being lost. If
you need access to the session on both SSL and non-SSL domains you will want to
disable this::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_secure' => false
        )
    ));

Session cookie paths default to ``/`` in 2.0, to change this you can use the
``session.cookie_path`` ini flag to the directory path of your application::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_path' => '/app/dir'
        )
    ));

Built-in Session handlers & configuration
=========================================

CakePHP comes with several built-in session configurations. You can either use
these as the basis for your session configuration, or you can create a fully
custom solution. To use defaults, simply set the 'defaults' key to the name of
the default you want to use. You can then override any sub setting by declaring
it in your Session config::

    Configure::write('Session', array(
        'defaults' => 'php'
    ));

The above will use the built-in 'php' session configuration. You could augment
part or all of it by doing the following::


    Configure::write('Session', array(
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 //3 days
    ));

The above overrides the timeout and cookie name for the 'php' session
configuration. The built-in configurations are:

* ``php`` - Saves sessions with the standard settings in your php.ini file.
* ``cake`` - Saves sessions as files inside ``app/tmp/sessions``. This is a
  good option when on hosts that don't allow you to write outside your own home
  dir.
* ``database`` - Use the built-in database sessions. See below for more information.
* ``cache`` - Use the built-in cache sessions. See below for more information.

Session Handlers
----------------

Session handlers can also be defined in the session config array. When defined
they allow you to map the various ``session_save_handler`` values to a class or
object you want to use for session saving. There are two ways to use the
'handler'. The first is to provide an array with 5 callables. These callables
are then applied to ``session_set_save_handler``::

    Configure::write('Session', array(
        'userAgent' => false,
        'cookie' => 'my_cookie',
        'timeout' => 600,
        'handler' => array(
            array('Foo', 'open'),
            array('Foo', 'close'),
            array('Foo', 'read'),
            array('Foo', 'write'),
            array('Foo', 'destroy'),
            array('Foo', 'gc'),
        ),
        'ini' => array(
            'cookie_secure' => 1,
            'use_trans_sid' => 0
        )
    ));

The second mode is to define an 'engine' key. This key should be a class name
that implements ``CakeSessionHandlerInterface``. Implementing this interface
will allow CakeSession to automatically map the methods for the handler. Both
the core Cache and Database session handlers use this method for saving
sessions. Additional settings for the handler should be placed inside the
handler array. You can then read those values out from inside your handler.

You can also use session handlers from inside plugins. By setting the engine to
something like ``MyPlugin.PluginSessionHandler``. This will load and use the
``PluginSessionHandler`` class from inside the MyPlugin of your application.


CakeSessionHandlerInterface
---------------------------

This interface is used for all custom session handlers inside CakePHP, and can
be used to create custom user land session handlers. Simply implement the
interface in your class and set ``Session.handler.engine``  to the class name
you've created. CakePHP will attempt to load the handler from inside
``app/Model/Datasource/Session/$classname.php``. So if your class name is
``AppSessionHandler`` the file should be
``app/Model/Datasource/Session/AppSessionHandler.php``.

Database sessions
-----------------

The changes in session configuration change how you define database sessions.
Most of the time you will only need to set ``Session.handler.model`` in your
configuration as well as choose the database defaults::


    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'model' => 'CustomSession'
        )
    ));

The above will tell CakeSession to use the built-in 'database' defaults, and
specify that a model called ``CustomSession`` will be the delegate for saving
session information to the database.

If you do not need a fully custom session handler, but still require
database-backed session storage, you can simplify the above code to::

    Configure::write('Session', array(
        'defaults' => 'database'
    ));

This configuration will require a database table to be added with
at least these fields::

    CREATE TABLE `cake_sessions` (
      `id` varchar(255) NOT NULL DEFAULT '',
      `data` text,
      `expires` int(11) DEFAULT NULL,
      PRIMARY KEY (`id`)
    );

You can also use the schema shell to create this table using the schema file
provided in the default app skeleton::

    $ Console/cake schema create sessions

Cache Sessions
--------------

The Cache class can be used to store sessions as well. This allows you to store
sessions in a cache like APC, memcache, or Xcache. There are some caveats to
using cache sessions, in that if you exhaust the cache space, sessions will
start to expire as records are evicted.

To use Cache based sessions you can configure you Session config like::

    Configure::write('Session', array(
        'defaults' => 'cache',
        'handler' => array(
            'config' => 'session'
        )
    ));

This will configure CakeSession to use the ``CacheSession`` class as the
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

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        )
    ));


Creating a custom session handler
=================================

Creating a custom session handler is straightforward in CakePHP. In this
example we'll create a session handler that stores sessions both in the Cache
(apc) and the database. This gives us the best of fast IO of apc,
without having to worry about sessions evaporating when the cache fills up.

First we'll need to create our custom class and put it in
``app/Model/Datasource/Session/ComboSession.php``. The class should look
something like::

    App::uses('DatabaseSession', 'Model/Datasource/Session');

    class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface {
        public $cacheKey;

        public function __construct() {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // read data from the session.
        public function read($id) {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // write data into the session.
        public function write($id, $data) {
            Cache::write($id, $data, $this->cacheKey);
            return parent::write($id, $data);
        }

        // destroy a session.
        public function destroy($id) {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // removes expired sessions.
        public function gc($expires = null) {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Our class extends the built-in ``DatabaseSession`` so we don't have to duplicate
all of its logic and behavior. We wrap each operation with a :php:class:`Cache`
operation. This lets us fetch sessions from the fast cache, and not have to
worry about what happens when we fill the cache. Using this session handler is
also easy. In your ``core.php`` make the session block look like the following::

    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        )
    ));

    // Make sure to add a apc cache config
    Cache::config('apc', array('engine' => 'Apc'));

Now our application will start using our custom session handler for reading &
writing session data.


.. php:class:: CakeSession

Reading & writing session data
==============================

Depending on the context you are in, your application has different classes
that provide access to the session. In controllers you can use
:php:class:`SessionComponent`. In the view, you can use
:php:class:`SessionHelper`. In any part of your application you can use
``CakeSession`` to access the session as well. Like the other interfaces to the
session, ``CakeSession`` provides a simple CRUD interface.

.. php:staticmethod:: read($key)

You can read values from the session using :php:meth:`Set::classicExtract()`
compatible syntax::

    CakeSession::read('Config.language');

.. php:staticmethod:: write($key, $value)

``$key`` should be the dot separated path you wish to write ``$value`` to::

    CakeSession::write('Config.language', 'eng');

.. php:staticmethod:: delete($key)

When you need to delete data from the session, you can use delete::

    CakeSession::delete('Config.language');

You should also see the documentation on
:doc:`/core-libraries/components/sessions` and
:doc:`/core-libraries/helpers/session` for how to access Session data
in the controller and view.


.. meta::
    :title lang=en: Sessions
    :keywords lang=en: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
