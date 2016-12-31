Global Constants and Functions
##############################

While most of your day-to-day work in CakePHP will be utilizing core
classes and methods, CakePHP features a number of global convenience
functions that may come in handy. Many of these functions are for use
with CakePHP classes (loading model or component classes), but many
others make working with arrays or strings a little easier.

We’ll also cover some of the constants available in CakePHP
applications. Using these constants will help make upgrades more smooth,
but are also convenient ways to point to certain files or directories in
your CakePHP application.

Global Functions
================

Here are CakePHP's globally available functions. Many of them are
convenience wrappers for long-named PHP functions, but some of them
(like ``uses()``) can be used to include code or perform other useful
functions. Chances are if you're constantly wanting a function to
accomplish an oft-used task, it's here.

\_\_
----

``__(string $string_id, boolean $return =  false)``

This function handles localization in CakePHP applications. The
``$string_id`` identifies the ID for a translation, and the second
parameter allows you to have the function automatically echo the string
(the default behavior), or return it for further processing (pass a
boolean true to enable this behavior).

Check out the :doc:`/The-Manual/Common-Tasks-With-CakePHP/Internationalization-Localization`
section for more information.

a
-

``a(mixed $one, $two, $three...)``

Returns an array of the parameters used to call the wrapping function.

::

    print_r(a('foo', 'bar')); 

    // output:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

This has been Deprecated and will be removed in 2.0 version. Use
**array()** instead.

aa
--

``aa(string $one, $two, $three...)``

Used to create associative arrays formed from the parameters used to
call the wrapping function.

::

    print_r(aa('a','b')); 

    // output:
    array(
        'a' => 'b'
    )

This has been Deprecated and will be removed in 2.0 version.

am
--

``am(array $one, $two, $three...)``

Merges all the arrays passed as parameters and returns the merged array.

Example:

::

        $arrTest1 = array('1'=>'Test1','2'=>'Test2');
        $arrTest2 = array('4'=>'Test4','5'=>'Test5');
        $arrFinal = am($arrTest1,$arrTest2);
        debug($arrFinal);

Output :

::

    Array
    (
        [0] => Test1
        [1] => Test2
        [2] => Test4
        [3] => Test5
    )

**am()** is similar **to array\_merge**

config
------

Can be used to load files from your application ``config``-folder via
include\_once. Function checks for existance before include and returns
boolean. Takes an optional number of arguments.

Example: ``config('some_file', 'myconfig');``

convertSlash
------------

``convertSlash(string $string)``

Converts forward slashes to underscores and removes the first and last
underscores in a string. Returns the converted string.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

If the application's DEBUG level is non-zero, $var is printed out. If
``$showHTML`` is true, the data is rendered to be browser-friendly.

Also see `Basic
Debugging <https://book.cakephp.org/view/1190/Basic-Debugging>`_

e
-

``e(mixed $data)``

Convenience wrapper for ``echo()``.

This has been Deprecated and will be removed in 2.0 version. Use
**echo()** instead

env
---

``env(string $key)``

Gets an environment variable from available sources. Used as a backup if
``$_SERVER`` or ``$_ENV`` are disabled.

This function also emulates PHP\_SELF and DOCUMENT\_ROOT on unsupporting
servers. In fact, it's a good idea to always use ``env()`` instead of
``$_SERVER`` or ``getenv()`` (especially if you plan to distribute the
code), since it's a full emulation wrapper.

fileExistsInPath
----------------

``fileExistsInPath(string $file)``

Checks to make sure that the supplied file is within the current PHP
include\_path. Returns a boolean result.

h
-

``h(string $text, string $charset = null)``

Convenience wrapper for ``htmlspecialchars()``.

ife
---

``ife($condition, $ifNotEmpty, $ifEmpty)``

Used for ternary-like operations. If the ``$condition`` is non-empty,
``$ifNotEmpty`` is returned, else ``$ifEmpty`` is returned.

This has been Deprecated and will be removed in 2.0 version.

low
---

``low(string $string)``

Convenience wrapper for ``strtolower()``.

This has been Deprecated and will be removed in 2.0 version. Use
**strtolower()** instead

pr
--

``pr(mixed $var)``

Convenience wrapper for ``print_r()``, with the addition of wrapping
<pre> tags around the output.

r
-

``r(string $search, string $replace, string  $subject)``

Convenience wrapper for ``str_replace()``.

This has been Deprecated and will be removed in 2.0 version. Use
**str\_replace()** instead

stripslashes\_deep
------------------

``stripslashes_deep(array $value)``

Recursively strips slashes from the supplied ``$value``. Returns the
modified array.

up
--

``up(string $string)``

Convenience wrapper for ``strtoupper()``.

This has been Deprecated and will be removed in 2.0 version. Use
**strtoupper()** instead

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Used to load CakePHP's core libraries (found in cake/libs/). Supply the
name of the library's file name without the '.php' extension.

This has been Deprecated and will be removed in 2.0 version.

Core Definition Constants
=========================

constant

Absolute path to the application’s...

APP

root directory.

APP\_PATH

app directory.

CACHE

cache files directory.

CAKE

cake directory.

COMPONENTS

components directory.

CONFIGS

configuration files directory.

CONTROLLER\_TESTS

controller tests directory.

CONTROLLERS

controllers directory.

CSS

CSS files directory.

DS

Short for PHP's DIRECTORY\_SEPARATOR, which is / on Linux and \\ on
windows.

ELEMENTS

elements directory.

HELPER\_TESTS

helper tests directory.

HELPERS

helpers directory.

IMAGES

images directory.

JS

JavaScript files directory (in the webroot).

LAYOUTS

layouts directory.

LIB\_TESTS

CakePHP Library tests directory.

LIBS

CakePHP libs directory.

LOGS

logs directory (in app).

MODEL\_TESTS

model tests directory.

MODELS

models directory.

SCRIPTS

Cake scripts directory.

TESTS

tests directory (parent for the models, controllers, etc. test
directories)

TMP

tmp directory.

VENDORS

vendors directory.

VIEWS

views directory.

WWW\_ROOT

full path to the webroot.
