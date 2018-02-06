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
<<<<<<< HEAD
    ``$string_id`` identifies the ID for a translation. You can supply
    additional arguments to replace placeholders in your string::
=======
    ``$string_id`` identifies the ID for a translation. Strings
    used for translations are treated as format strings for
    ``sprintf()``. You can supply additional arguments to replace
    placeholders in your string::

        __('You have %s unread messages', h($number));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

        __('You have {0} unread messages', $number);

    You can also provide a name-indexed array of replacements::

        __('You have {unread} unread messages', ['unread' => $number]);

    .. note::

        Check out the
        :doc:`/core-libraries/internationalization-and-localization` section for
        more information.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Allows you to override the current domain for a single message lookup.

    Useful when internationalizing a plugin:
    ``echo __d('plugin_name', 'This is my plugin');``

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

<<<<<<< HEAD
.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)
=======
.. php:function:: __x(string $context, string $singular, mixed $args = null)

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Returns correct plural form of the message identified by ``$singular`` and
    ``$plural`` for count $count. It also allows you to specify a context. Some
    languages have more than one form for plural messages dependent on the
    count.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Allows you to override the current domain for a single message lookup. It
    also allows you to specify a context.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Allows you to override the current domain and context for a single plural
    message lookup. Returns correct plural form of message identified by
    $singular and ``$plural`` for count $count from domain $domain. Some languages
    have more than one form for plural messages dependent on the count.

    The context is a unique identifier for the translation string that makes it
    unique within the same domain.

.. php:function:: __dxc(string $domain, string $context, string $msg, integer $category, mixed $args = null)

    Allows you to override the current domain for a single message
    lookup. It also allows you to specify a category and a context.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __xc(string $context, string $msg, integer $count, integer $category, mixed $args = null)

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __dxcn(string $domain, string $context, string $singular, string $plural, integer $count, integer $category, mixed $args = null)

    Allows you to override the current domain for a single plural message
    lookup. It also allows you to specify a category and a context. 
    Returns correct plural form of message identified by $singular and $plural 
    for count $count from domain $domain.

    The context is a unique identifier for the translations string that makes it
    unique within the same domain.

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

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

    .. versionchanged:: 3.3.0
        Calling this method will return passed ``$var``, so that you can, for instance,
        place it in return statements.

    If the core ``$debug`` variable is ``true``, ``$var`` is printed out.
    If ``$showHTML`` is ``true`` or left as ``null``, the data is rendered to be
    browser-friendly. If ``$showFrom`` is not set to ``false``, the debug output
    will start with the line from which it was called. Also see
    :doc:`/development/debugging`

.. php:function:: dd(mixed $var, boolean $showHtml = null)

    It behaves like ``debug()``, but execution is also halted.
    If the core ``$debug`` variable is ``true``, ``$var`` is printed.
    If ``$showHTML`` is ``true`` or left as ``null``, the data is rendered to be
    browser-friendly. Also see :doc:`/development/debugging`

.. php:function:: pr(mixed $var)

<<<<<<< HEAD
    .. versionchanged:: 3.3.0
        Calling this method will return passed ``$var``, so that you can, for instance,
        place it in return statements.
=======
.. php:function:: stackTrace(array $options = array())
    :noindex:

    If the application's DEBUG level is non-zero, the stack trace is printed out.

.. php:function:: env(string $key)
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    Convenience wrapper for ``print_r()``, with the addition of
    wrapping ``<pre>`` tags around the output.

.. php:function:: pj(mixed $var)

    .. versionchanged:: 3.3.0
        Calling this method will return passed ``$var``, so that you can, for instance,
        place it in return statements.

    JSON pretty print convenience function, with the addition of
    wrapping ``<pre>`` tags around the output.

    It is meant for debugging the JSON representation of objects and arrays.

.. php:function:: env(string $key, string $default = null)

    .. versionchanged:: 3.1.1
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
<<<<<<< HEAD
=======

    Path to the app/Config directory.

    .. versionadded:: 2.10.0

.. php:const:: CORE_PATH

   Path to the root directory with ending directory slash.

.. php:const:: CSS

    Path to the public CSS directory.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

   Path to the config directory.

.. php:const:: CORE_PATH

   Path to the root directory with ending directory slash.

.. php:const:: DS

<<<<<<< HEAD
    Short for PHP's ``DIRECTORY_SEPARATOR``, which is ``/`` on Linux and ``\``
    on Windows.
=======
    Short for PHP's DIRECTORY\_SEPARATOR, which is / on Linux and \\ on Windows.

.. php:const:: FULL_BASE_URL

    Full URL prefix. Such as ``https://example.com``

    .. deprecated:: 2.4
        This constant is deprecated, you should use :php:meth:`Router::fullBaseUrl()` instead.

.. php:const:: IMAGES

    Path to the public images directory.

    .. deprecated:: 2.4

.. php:const:: IMAGES_URL

    Web path to the public images directory.

    .. deprecated:: 2.4
        Use config value ``App.imageBaseUrl`` instead.

.. php:const:: JS

    Path to the public JavaScript directory.

    .. deprecated:: 2.4

.. php:const:: JS_URL

    Web path to the js files directory.

    .. deprecated:: 2.4
        Use config value ``App.jsBaseUrl`` instead.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

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
    :keywords lang=en: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,arrays,parameters,existence,translations
