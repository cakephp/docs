Cake's Global Constants And Functions
#####################################

Here are some globally available constants and functions that you might
find useful as you build your application with Cake.

Global Functions
================

Here are Cake's globally available functions. Many of them are
convenience wrappers for long-named PHP functions, but some of them
(like vendor() and uses()) can be used to include code, or perform other
useful functions. Chances are if you're wanting a nice little function
to do something annoying over and over, it's here.

-  **config**

Loads Cake's core configuration file. Returns true on success.

-  **uses**
-  string *$lib1*
-  string *$lib2...*

Used to load Cake's core libaries (found in **cake/libs/**). Supply the
name of the lib filename without the '.php' extension::

    uses('sanitize', 'security');

-  **vendor**
-  string *$lib1*
-  string *$lib2...*

Used to load external libraries found in the /vendors directory. Supply
the name of the lib filename without the '.php' extension::

    vendor('myWebService', 'nusoap');

-  **debug**
-  mixed *$var*
-  boolean *$showHtml = false*

If the application's DEBUG level is non-zero, the $var is printed out.
If $showHTML is true, the data is rendered to be browser-friendly.

-  **a**

Returns an array of the parameters used to call the wrapping function::

    function someFunction()
    {
        echo print_r(a('foo', 'bar'));
    }

    someFunction();

    // output:

    array(
        [0] => 'foo',
        [1] => 'bar'
    )

-  **aa**

Used to create associative arrays formed from the parameters used to
call the wrapping function::

    echo aa('a','b'); // output: array( 'a' => 'b' )

-  **e**
-  string *$text*

Convenience wrapper for echo().

-  **low**

Convenience wrapper for strtolower().

-  **up**

Convenience wrapper for strtoupper().

-  **r**
-  string *$search*
-  string *$replace*
-  string *$subject*

Convenience wrapper for str\_replace().

-  **pr**
-  mixed *$data*

Convenience function equivalent to:

echo "<pre>" . print\_r($data) . "</pre>";

Only prints out information if DEBUG is non-zero.

-  **am**
-  array *$array1*
-  array *$array2...*

Merges and returns the arrays supplied in the parameters.

-  **env**
-  string *$key*

Gets an environment variable from available sources. Used as a backup if
$\_SERVER or $\_ENV are disabled.

This function also emulates PHP\_SELF and DOCUMENT\_ROOT on unsupporting
servers. In fact, it's a good idea to always use env() instead of
$\_SERVER or getenv() (especially if you plan to distribute the code),
since it's a full emulation wrapper.

-  **cache**
-  string *$path*
-  string *$expires*
-  string *$target = 'cache'*

Writes the data in $data to the path in /app/tmp specified by $path as a
cache. The expiration time specified by $expires must be a valid
strtotime() string. The $target of the cached data can either be 'cache'
or 'public'.

-  **clearCache**
-  string *$search*
-  string *$path = 'views'*
-  string *$ext*

Used to delete files in the cache directories, or clear contents of
cache directories.

If $search is a string, matching cache directory or file names will be
removed from the cache. The $search parameter can also be passed as an
array of names of files/directories to be cleared. If empty, all files
in /app/tmp/cache/views will be cleared.

The $path parameter can be used to specify which directory inside of
/tmp/cache is to be cleared. Defaults to 'views'.

The $ext param is used to specify files with a certain file extention
you wish to clear.

-  **stripslashes\_deep**
-  array *$array*

Recursively strips slashes from all values in an array.

-  **countdim**
-  array *$array*

Returns the number of dimensions in the supplied array.

-  **fileExistsInPath**
-  string *$file*

Searches the current include path for a given filename. Returns the path
to that file if found, false if not found.

-  **convertSlash**
-  string *$string*

Converts forward slashes to underscores and removes first and last
underscores in a string.

CakePHP Core Definition Constants
=================================

ACL\_CLASSNAME

the name of the class currently performing and managing ACL for CakePHP.
This constant is in place to allow for users to integrate third party
classes.

ACL\_FILENAME

the name of the file where the class ACL\_CLASSNAME can be found inside
of.

AUTO\_SESSION

if set to false, session\_start() is not automatically called during
requests to the application.

CACHE\_CHECK

if set to false, view caching is turned off for the entire application

CAKE\_SECURITY

determines the level of session security for the application in
accordance with CAKE\_SESSION\_TIMEOUT. Can be set to 'low', 'medium',
or 'high'. Depending on the setting, CAKE\_SESSION\_TIMEOUT is
multiplied according to the following:

#. low: 300

#. medium: 100

#. high: 10

CAKE\_SESSION\_COOKIE

the name of session cookie for the application.

CAKE\_SESSION\_SAVE

set to 'php', 'file', or 'database'.

#. php: Cake uses PHP's default session handling (usually defined in
   php.ini)

#. file: Session data is stored and managed in /tmp

#. database: Cake's database session handling is used (see `Chapter "The
   Cake Session
   Component" <https://book.cakephp.org/view/322/the-cake-session-component>`_
   for more details).

CAKE\_SESSION\_STRING

a random string used in session mangement

CAKE\_SESSION\_TABLE

the name of the table for storing session data (if CAKE\_SESSION\_SAVE
== 'database'). Do not include a prefix here if one has already been
specified for the default database connection.

CAKE\_SESSION\_TIMEOUT

number of seconds until session timeout. This figure is multiplied by
CAKE\_SECURITY.

COMPRESS\_CSS

if set to true, CSS style sheets are compressed on output. This requires
a /var/cache directory writable by the webserver. To use, reference your
style sheets using /ccss (rather than /css) or use Controller::cssTag().

DEBUG

defines the level of error reporting and debug output the CakePHP
application will render. Can be set to an integer from 0 to 3.

#. 0: Production mode. No error output, no debug messages shown.

#. 1: Development mode. Warnings and errors shown, along with debug
   messages.

#. 2: Same as in 1, but with SQL output.

#. 3: Same as in 2, but with full dump of current object (usually the
   Controller).

LOG\_ERROR

Error constant. Used for differentiating error logging and debugging.
Currently PHP supports LOG\_DEBUG.

MAX\_MD5SIZE

The maximum size (in bytes) to perform an md5() hash upon.

WEBSERVICES

If set to true, Cake's bulit in webservices functionality is turned on.

CakePHP Path Constants
======================

+---------------------+-------------------------------------------------------------------------------------------+
| APP                 | the path to the application's directory.                                                  |
+---------------------+-------------------------------------------------------------------------------------------+
| APP\_DIR            | the name of the current application's app directory.                                      |
+---------------------+-------------------------------------------------------------------------------------------+
| APP\_PATH           | absolute path to the application's app directory.                                         |
+---------------------+-------------------------------------------------------------------------------------------+
| CACHE               | path to the cache files directory.                                                        |
+---------------------+-------------------------------------------------------------------------------------------+
| CAKE                | path to the application's cake directory.                                                 |
+---------------------+-------------------------------------------------------------------------------------------+
| COMPONENTS          | path to the application's components directory.                                           |
+---------------------+-------------------------------------------------------------------------------------------+
| CONFIGS             | path to the configuration files directory.                                                |
+---------------------+-------------------------------------------------------------------------------------------+
| CONTROLLER\_TESTS   | path to the controller tests directory.                                                   |
+---------------------+-------------------------------------------------------------------------------------------+
| CONTROLLERS         | path to the application's controllers.                                                    |
+---------------------+-------------------------------------------------------------------------------------------+
| CSS                 | path to the CSS files directory.                                                          |
+---------------------+-------------------------------------------------------------------------------------------+
| ELEMENTS            | path to the elements directory.                                                           |
+---------------------+-------------------------------------------------------------------------------------------+
| HELPER\_TESTS       | path to the helper tests directory.                                                       |
+---------------------+-------------------------------------------------------------------------------------------+
| HELPERS             | path to the helpers directory.                                                            |
+---------------------+-------------------------------------------------------------------------------------------+
| INFLECTIONS         | path to the inflections directory (usually inside the configuration directory).           |
+---------------------+-------------------------------------------------------------------------------------------+
| JS                  | path to the JavaScript files directory.                                                   |
+---------------------+-------------------------------------------------------------------------------------------+
| LAYOUTS             | path to the layouts directory.                                                            |
+---------------------+-------------------------------------------------------------------------------------------+
| LIB\_TESTS          | path to the Cake Library tests directory.                                                 |
+---------------------+-------------------------------------------------------------------------------------------+
| LIBS                | path to the Cake libs directory.                                                          |
+---------------------+-------------------------------------------------------------------------------------------+
| LOGS                | path to the logs directory.                                                               |
+---------------------+-------------------------------------------------------------------------------------------+
| MODEL\_TESTS        | path to the model tests directory.                                                        |
+---------------------+-------------------------------------------------------------------------------------------+
| MODELS              | path to the models directory.                                                             |
+---------------------+-------------------------------------------------------------------------------------------+
| SCRIPTS             | path to the Cake scripts directory.                                                       |
+---------------------+-------------------------------------------------------------------------------------------+
| TESTS               | path to the tests directory (parent for the models, controllers, etc. test directories)   |
+---------------------+-------------------------------------------------------------------------------------------+
| TMP                 | path to the tmp directory.                                                                |
+---------------------+-------------------------------------------------------------------------------------------+
| VENDORS             | path to the vendors directory.                                                            |
+---------------------+-------------------------------------------------------------------------------------------+
| VIEWS               | path to the views directory.                                                              |
+---------------------+-------------------------------------------------------------------------------------------+

CakePHP Webroot Configuration Paths
===================================

+-----------------------------+----------------------------------------------------------------------+
| CORE\_PATH                  | path to the Cake core libraries.                                     |
+-----------------------------+----------------------------------------------------------------------+
| WWW\_ROOT                   | path to the application's webroot directory                          |
+-----------------------------+----------------------------------------------------------------------+
| CAKE\_CORE\_INCLUDE\_PATH   | path to the Cake core libraries.                                     |
+-----------------------------+----------------------------------------------------------------------+
| ROOT                        | the name of the directory parent to the base index.php of CakePHP.   |
+-----------------------------+----------------------------------------------------------------------+
| WEBROOT\_DIR                | the name of the application's webroot directory.                     |
+-----------------------------+----------------------------------------------------------------------+

 
