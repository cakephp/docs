Global Constants and Functions
##############################

While most of your day-to-day work in CakePHP will be utilizing
core classes and methods, CakePHP features a number of global
convenience functions that may come in handy. Many of these
functions are for use with CakePHP classes (loading model or
component classes), but many others make working with arrays or
strings a little easier.

We'll also cover some of the constants available in CakePHP
applications. Using these constants will help make upgrades more
smooth, but are also convenient ways to point to certain files or
directories in your CakePHP application.

Global Functions
================

Here are CakePHP's globally available functions. Most of them
are just convenience wrappers for other CakePHP functionality,
such as debugging and translating content.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    This function handles localization in CakePHP applications. The
    ``$string_id`` identifies the ID for a translation. Strings
    used for translations are treated as format strings for
    ``sprintf()``. You can supply additional arguments to replace
    placeholders in your string::

        __('You have %s unread messages', h($number));

    .. note::

        Check out the
        :doc:`/core-libraries/internationalization-and-localization`
        section for more information.

.. php:function:: __c(string $msg, integer $category, mixed $args = null)

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Allows you to override the current domain for a single message lookup.

    Useful when internationalizing a plugin:
    ``echo __d('plugin_name', 'This is my plugin');``

.. php:function:: __dc(string $domain, string $msg, integer $category, mixed $args = null)

    Allows you to override the current domain for a single message lookup. It
    also allows you to specify a category.

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)

    Allows you to override the current domain for a single plural message
    lookup. It also allows you to specify a category. Returns correct plural
    form of message identified by $singular and $plural for count $count from
    domain $domain.

    Note that the category must be specified with an I18n class constant, instead of
    only the constant name. The values are:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Allows you to override the current domain for a single plural message
    lookup. Returns correct plural form of message identified by $singular and
    $plural for count $count from domain $domain.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Returns correct plural form of message identified by $singular and $plural
    for count $count. Some languages have more than one form for plural
    messages dependent on the count.

.. php:function:: am(array $one, $two, $three...)

    Merges all the arrays passed as parameters and returns the merged
    array.

.. php:function:: config()

    Can be used to load files from your application ``config``-folder
    via include\_once. Function checks for existence before include and
    returns boolean. Takes an optional number of arguments.

    Example: ``config('some_file', 'myconfig');``

.. php:function:: convertSlash(string $string)

    Converts forward slashes to underscores and removes the first and
    last underscores in a string. Returns the converted string.

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    If the application's DEBUG level is non-zero, $var is printed out.
    If ``$showHTML`` is true or left as null, the data is rendered to be
    browser-friendly.
    If $showFrom is not set to false, the debug output will start with the line from
    which it was called.
    Also see :doc:`/development/debugging`

.. php:function:: stackTrace(array $options = array())
    :noindex:

    If the application's DEBUG level is non-zero, the stack trace is printed out.

.. php:function:: env(string $key)

    Gets an environment variable from available sources. Used as a
    backup if ``$_SERVER`` or ``$_ENV`` are disabled.

    This function also emulates PHP\_SELF and DOCUMENT\_ROOT on
    unsupporting servers. In fact, it's a good idea to always use
    ``env()`` instead of ``$_SERVER`` or ``getenv()`` (especially if
    you plan to distribute the code), since it's a full emulation
    wrapper.

.. php:function:: fileExistsInPath(string $file)

    Checks to make sure that the supplied file is within the current
    PHP include\_path. Returns a boolean result.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Convenience wrapper for ``htmlspecialchars()``.

.. php:function:: LogError(string $message)

    Shortcut to :php:meth:`Log::write()`.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Splits a dot syntax plugin name into its plugin and class name. If $name
    does not have a dot, then index 0 will be null.

    Commonly used like ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: pr(mixed $var)

    Convenience wrapper for ``print_r()``, with the addition of
    wrapping <pre> tags around the output.

.. php:function:: sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)

    Sorts given $array by key $sortby.

.. php:function:: stripslashes_deep(array $value)

    Recursively strips slashes from the supplied ``$value``. Returns
    the modified array.

Core Definition Constants
=========================

Most of the following constants refer to paths in your application.

.. php:const:: APP

   Absolute path to your application directory, including a trailing slash.

.. php:const:: APP_DIR

    Equals ``app`` or the name of your application directory.

.. php:const:: APPLIBS

    Path to the application's Lib directory.

.. php:const:: CACHE

    Path to the cache files directory. It can be shared between hosts in a
    multi-server setup.

.. php:const:: CAKE

    Path to the cake directory.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Path to the root lib directory.

.. php:const:: CONFIG

    Path to the app/Config directory.

    .. versionadded:: 2.10.0

.. php:const:: CORE_PATH

   Path to the root directory with ending directory slash.

.. php:const:: CSS

    Path to the public CSS directory.

    .. deprecated:: 2.4

.. php:const:: CSS_URL

    Web path to the CSS files directory.

    .. deprecated:: 2.4
        Use config value ``App.cssBaseUrl`` instead.

.. php:const:: DS

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

.. php:const:: LOGS

    Path to the logs directory.

.. php:const:: ROOT

    Path to the root directory.

.. php:const:: TESTS

    Path to the tests directory.

.. php:const:: TMP

    Path to the temporary files directory.

.. php:const:: VENDORS

    Path to the vendors directory.

.. php:const:: WEBROOT_DIR

    Equals ``webroot`` or the name of your webroot directory.

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
