Constants & Functions
#####################

While most of your day-to-day work in CakePHP will be utilizing core classes and
methods, CakePHP features a number of global convenience functions that may come
in handy. Many of these functions are for use with CakePHP classes (loading
model or component classes), but many others make working with arrays or
strings a little easier.

We'll also cover some of the constants available in CakePHP applications. Using
these constants will help make upgrades more smooth, but are also convenient
ways to point to certain files or directories in your CakePHP application.

Global Functions
================

Here are CakePHP's globally available functions. Most of them are just
convenience wrappers for other CakePHP functionality, such as debugging and
translating content.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    This function handles localization in CakePHP applications. The
    ``$string_id`` identifies the ID for a translation. Strings used for
    translations are treated as format strings for ``sprintf()``. You can supply
    additional arguments to replace placeholders in your string::

        __('You have {0} unread messages', $number);

    .. note::

        Check out the
        :doc:`/core-libraries/internationalization-and-localization` section for
        more information.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Allows you to override the current domain for a single message lookup.

    Useful when internationalizing a plugin:
    ``echo __d('PluginName', 'This is my plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Allows you to override the current domain for a single plural message
    lookup. Returns correct plural form of message identified by ``$singular``
    and ``$plural`` for count ``$count`` from domain ``$domain``.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Allows you to override the current domain for a single message lookup. It
    also allows you to specify a context.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Allows you to override the current domain for a single plural message
    lookup. It also allows you to specify a context. Returns correct plural
    form of message identified by ``$singular`` and ``$plural`` for count
    ``$count`` from domain ``$domain``. Some languages have more than one form
    for plural messages dependent on the count.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Returns correct plural form of message identified by ``$singular`` and
    ``$plural`` for count ``$count``. Some languages have more than one form for
    plural messages dependent on the count.

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Returns correct plural form of message identified by ``$singular`` and
    ``$plural`` for count ``$count`` from domain ``$domain``. It also allows you
    to specify a context. Some languages have more than one form for plural
    messages dependent on the count.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: collection(mixed $items)

    Convenience wrapper for instantiating a new :php:class:`Cake\\Collection\\Collection`
    object, wrapping the passed argument. The ``$items`` parameter takes either
    a ``Traversable`` object or an array.

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    If the core ``$debug`` variable is ``true``, ``$var`` is printed out.
    If ``$showHTML`` is ``true`` or left as ``null``, the data is rendered to be
    browser-friendly. If ``$showFrom`` is not set to ``false``, the debug output
    will start with the line from which it was called. Also see
    :doc:`/development/debugging`

.. php:function:: env(string $key, string $default = null)

    .. versionadded:: 3.1.1
        The ``$default`` parameter has been added.

    Gets an environment variable from available sources. Used as a backup if
    ``$_SERVER`` or ``$_ENV`` are disabled.

    This function also emulates ``PHP_SELF`` and ``DOCUMENT_ROOT`` on
    unsupporting servers. In fact, it's a good idea to always use ``env()``
    instead of ``$_SERVER`` or ``getenv()`` (especially if you plan to
    distribute the code), since it's a full emulation wrapper.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Convenience wrapper for ``htmlspecialchars()``.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Splits a dot syntax plugin name into its plugin and class name. If ``$name``
    does not have a dot, then index 0 will be ``null``.

    Commonly used like ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: namespaceSplit(string $class)

    Split the namespace from the classname.

    Commonly used like ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``

.. php:function:: pr(mixed $var)

    Convenience wrapper for ``print_r()``, with the addition of wrapping
    ``<pre>`` tags around the output.

.. php:function:: pj(mixed $var)

    JSON pretty print convenience function, with the addition of
    wrapping ``<pre>`` tags around the output.

    It is meant for debugging the JSON representation of objects and arrays.

Core Definition Constants
=========================

Most of the following constants refer to paths in your application.

.. php:const:: APP

   Absolute path to your application directory, including a trailing slash.

.. php:const:: APP_DIR

    Equals ``app`` or the name of your application directory.

.. php:const:: CACHE

    Path to the cache files directory. It can be shared between hosts in a
    multi-server setup.

.. php:const:: CAKE

    Path to the cake directory.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Path to the root lib directory.

.. php:const:: CONFIG

   Path to the config directory.

.. php:const:: CORE_PATH

   Path to the root directory with ending directory slash.

.. php:const:: DS

    Short for PHP's ``DIRECTORY_SEPARATOR``, which is ``/`` on Linux and ``\\``
    on Windows.

.. php:const:: LOGS

    Path to the logs directory.

.. php:const:: ROOT

    Path to the root directory.

.. php:const:: TESTS

    Path to the tests directory.

.. php:const:: TMP

    Path to the temporary files directory.

.. php:const:: WWW\_ROOT

    Full path to the webroot.


Timing Definition Constants
===========================

.. php:const:: TIME_START

    Unix timestamp in microseconds as a float from when the application started.

.. php:const:: SECOND

    Equals 1

.. php:const:: MINUTE

    Equals 60

.. php:const:: HOUR

    Equals 3600

.. php:const:: DAY

    Equals 86400

.. php:const:: WEEK

    Equals 604800

.. php:const:: MONTH

    Equals 2592000

.. php:const:: YEAR

    Equals 31536000


.. meta::
    :title lang=en: Global Constants and Functions
    :keywords lang=en: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,sprintf,arrays,parameters,existence,translations
