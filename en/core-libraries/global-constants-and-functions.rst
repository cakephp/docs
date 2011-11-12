Global Constants and Functions
##############################

While most of your day-to-day work in CakePHP will be utilizing
core classes and methods, CakePHP features a number of global
convenience functions that may come in handy. Many of these
functions are for use with CakePHP classes (loading model or
component classes), but many others make working with arrays or
strings a little easier.

We’ll also cover some of the constants available in CakePHP
applications. Using these constants will help make upgrades more
smooth, but are also convenient ways to point to certain files or
directories in your CakePHP application.

Global Functions
================

Here are CakePHP's globally available functions. Many of them are
convenience wrappers for long-named PHP functions, but some of them
(like ``uses()``) can be used to include code or perform other
useful functions. Chances are if you're constantly wanting a
function to accomplish an oft-used task, it's here.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    This function handles localization in CakePHP applications. The
    ``$string_id`` identifies the ID for a translation.  Strings
    used for translations are treated as format strings for 
    ``sprintf()``.  You can supply additional arguments to replace
    placeholders in your string::

        <?php
        __('You have %s unread messages', $number);

    .. note::

        Check out the
        :doc:`/core-libraries/internationalization-and-localization`
        section for more information.

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
    If ``$showHTML`` is trueor left null, the data is rendered to be
    browser-friendly.
    If $showFrom is not set to false, the debug output will start with the line from
    which it was called
    Also see :doc:`/development/debugging`

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

.. php:function:: h(string $text, string $charset = null)

    Convenience wrapper for ``htmlspecialchars()``.


.. php:function:: pr(mixed $var)

    Convenience wrapper for ``print_r()``, with the addition of
    wrapping <pre> tags around the output.

.. php:function:: stripslashes_deep(array $value)

    Recursively strips slashes from the supplied ``$value``. Returns
    the modified array.



Core Definition Constants
=========================

Most of the following constants refer to paths in your application.

.. php:const:: APP

   root directory.

.. php:const:: APP\_PATH

   app directory.

.. php:const:: CACHE

    cache files directory.

.. php:const:: CAKE

    cake directory.

.. php:const:: CONTROLLER\_TESTS

    controller tests directory.

.. php:const:: CSS

    CSS files directory.

.. php:const:: DS

    Short for PHP's DIRECTORY\_SEPARATOR, which is / on Linux and \\ on windows.

.. php:const:: HELPER\_TESTS

    helper tests directory.

.. php:const:: IMAGES

    images directory.

.. php:const:: JS

    JavaScript files directory (in the webroot).

.. php:const:: LIB\_TESTS

    CakePHP Library tests directory.

.. php:const:: LIBS

    CakePHP libs directory.

.. php:const:: LOGS

    logs directory (in app).

.. php:const:: MODEL\_TESTS

    model tests directory.

.. php:const:: SCRIPTS

    Cake scripts directory.

.. php:const:: TESTS

    tests directory (parent for the models, controllers, etc. test directories)

.. php:const:: TMP

    tmp directory.

.. php:const:: VENDORS

    vendors directory.

.. php:const:: WWW\_ROOT

    full path to the webroot.


.. meta::
    :title lang=en: Global Constants and Functions
    :keywords lang=en: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,sprintf,arrays,parameters,existence,translations