# Global Constants and Functions

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

## Global Functions

Here are CakePHP's globally available functions. Most of them
are just convenience wrappers for other CakePHP functionality,
such as debugging and translating content.

`function` **__(string $string_id, [$formatArgs])**

This function handles localization in CakePHP applications. The
`$string_id` identifies the ID for a translation. Strings
used for translations are treated as format strings for
`sprintf()`. You can supply additional arguments to replace
placeholders in your string:

``` text
__('You have %s unread messages', h($number));
```

> [!NOTE]
> Check out the
> [Internationalization & Localization](../core-libraries/internationalization-and-localization)
> section for more information.

`function` **__c(string $msg, integer $category, mixed $args = null)**

Note that the category must be specified with an I18n class constant, instead of
only the constant name. The values are:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__d(string $domain, string $msg, mixed $args = null)**

Allows you to override the current domain for a single message lookup.

Useful when internationalizing a plugin:
`echo __d('plugin_name', 'This is my plugin');`

`function` **__dc(string $domain, string $msg, integer $category, mixed $args = null)**

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

`function` **__dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)**

Allows you to override the current domain for a single plural message
lookup. It also allows you to specify a category. Returns correct plural
form of message identified by \$singular and \$plural for count \$count from
domain \$domain.

Note that the category must be specified with an I18n class constant, instead of
only the constant name. The values are:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)**

Allows you to override the current domain for a single plural message
lookup. Returns correct plural form of message identified by \$singular and
\$plural for count \$count from domain \$domain.

`function` **__x(string $context, string $singular, mixed $args = null)**

The context is a unique identifier for the translations string that makes it
unique within the same domain.

`function` **__xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)**

Returns correct plural form of the message identified by `$singular` and
`$plural` for count \$count. It also allows you to specify a context. Some
languages have more than one form for plural messages dependent on the
count.

The context is a unique identifier for the translations string that makes it
unique within the same domain.

`function` **__dx(string $domain, string $context, string $msg, mixed $args = null)**

Allows you to override the current domain for a single message lookup. It
also allows you to specify a context.

The context is a unique identifier for the translations string that makes it
unique within the same domain.

`function` **__dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)**

Allows you to override the current domain and context for a single plural
message lookup. Returns correct plural form of message identified by
\$singular and `$plural` for count \$count from domain \$domain. Some languages
have more than one form for plural messages dependent on the count.

The context is a unique identifier for the translation string that makes it
unique within the same domain.

`function` **__dxc(string $domain, string $context, string $msg, integer $category, mixed $args = null)**

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

`function` **__xc(string $context, string $msg, integer $count, integer $category, mixed $args = null)**

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

`function` **__dxcn(string $domain, string $context, string $singular, string $plural, integer $count, integer $category, mixed $args = null)**

Allows you to override the current domain for a single plural message
lookup. It also allows you to specify a category and a context.
Returns correct plural form of message identified by \$singular and \$plural
for count \$count from domain \$domain.

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

`function` **__n(string $singular, string $plural, integer $count, mixed $args = null)**

Returns correct plural form of message identified by \$singular and \$plural
for count \$count. Some languages have more than one form for plural
messages dependent on the count.

`function` **am(array $one, $two, $three...)**

Merges all the arrays passed as parameters and returns the merged
array.

`function` **config()**

Can be used to load files from your application `config`-folder
via include_once. Function checks for existence before include and
returns boolean. Takes an optional number of arguments.

Example: `config('some_file', 'myconfig');`

`function` **convertSlash(string $string)**

Converts forward slashes to underscores and removes the first and
last underscores in a string. Returns the converted string.

`function` **debug(mixed $var, boolean $showHtml = null, $showFrom = true)**

If the application's DEBUG level is non-zero, \$var is printed out.
If `$showHTML` is true or left as null, the data is rendered to be
browser-friendly.
If \$showFrom is not set to false, the debug output will start with the line from
which it was called.
Also see [Debugging](../development/debugging)

`function` **stackTrace(array $options = array())**

If the application's DEBUG level is non-zero, the stack trace is printed out.

`function` **env(string $key)**

Gets an environment variable from available sources. Used as a
backup if `$_SERVER` or `$_ENV` are disabled.

This function also emulates PHP_SELF and DOCUMENT_ROOT on
unsupporting servers. In fact, it's a good idea to always use
`env()` instead of `$_SERVER` or `getenv()` (especially if
you plan to distribute the code), since it's a full emulation
wrapper.

`function` **fileExistsInPath(string $file)**

Checks to make sure that the supplied file is within the current
PHP include_path. Returns a boolean result.

`function` **h(string $text, boolean $double = true, string $charset = null)**

Convenience wrapper for `htmlspecialchars()`.

`function` **LogError(string $message)**

Shortcut to `Log::write()`.

`function` **pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)**

Splits a dot syntax plugin name into its plugin and class name. If \$name
does not have a dot, then index 0 will be null.

Commonly used like `list($plugin, $name) = pluginSplit('Users.User');`

`function` **pr(mixed $var)**

Convenience wrapper for `print_r()`, with the addition of
wrapping \<pre\> tags around the output.

`function` **sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)**

Sorts given \$array by key \$sortby.

`function` **stripslashes_deep(array $value)**

Recursively strips slashes from the supplied `$value`. Returns
the modified array.

## Core Definition Constants

Most of the following constants refer to paths in your application.

`constant` **APP**

Absolute path to your application directory, including a trailing slash.

`constant` **APP_DIR**

Equals `app` or the name of your application directory.

`constant` **APPLIBS**

Path to the application's Lib directory.

`constant` **CACHE**

Path to the cache files directory. It can be shared between hosts in a
multi-server setup.

`constant` **CAKE**

Path to the cake directory.

`constant` **CAKE_CORE_INCLUDE_PATH**

Path to the root lib directory.

`constant` **CONFIG**

Path to the app/Config directory.

::: info Added in version 2.10.0
:::

`constant` **CORE_PATH**

Path to the root directory with ending directory slash.

`constant` **CSS**

Path to the public CSS directory.

::: info Deprecated in version 2.4
:::

`constant` **CSS_URL**

Web path to the CSS files directory.

::: info Deprecated in version 2.4
Use config value `App.cssBaseUrl` instead.
:::

`constant` **DS**

Short for PHP's DIRECTORY_SEPARATOR, which is / on Linux and \\ on Windows.

`constant` **FULL_BASE_URL**

Full URL prefix. Such as `https://example.com`

::: info Deprecated in version 2.4
This constant is deprecated, you should use `Router::fullBaseUrl()` instead.
:::

`constant` **IMAGES**

Path to the public images directory.

::: info Deprecated in version 2.4
:::

`constant` **IMAGES_URL**

Web path to the public images directory.

::: info Deprecated in version 2.4
Use config value `App.imageBaseUrl` instead.
:::

`constant` **JS**

Path to the public JavaScript directory.

::: info Deprecated in version 2.4
:::

`constant` **JS_URL**

Web path to the js files directory.

::: info Deprecated in version 2.4
Use config value `App.jsBaseUrl` instead.
:::

`constant` **LOGS**

Path to the logs directory.

`constant` **ROOT**

Path to the root directory.

`constant` **TESTS**

Path to the tests directory.

`constant` **TMP**

Path to the temporary files directory.

`constant` **VENDORS**

Path to the vendors directory.

`constant` **WEBROOT_DIR**

Equals `webroot` or the name of your webroot directory.

`constant` **WWW_ROOT**

Full path to the webroot.

## Timing Definition Constants

`constant` **TIME_START**

Unix timestamp in microseconds as a float from when the application started.

`constant` **SECOND**

Equals 1

`constant` **MINUTE**

Equals 60

`constant` **HOUR**

Equals 3600

`constant` **DAY**

Equals 86400

`constant` **WEEK**

Equals 604800

`constant` **MONTH**

Equals 2592000

`constant` **YEAR**

Equals 31536000
