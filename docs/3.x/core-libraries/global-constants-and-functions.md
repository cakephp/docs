# Constants & Functions

While most of your day-to-day work in CakePHP will be utilizing core classes and
methods, CakePHP features a number of global convenience functions that may come
in handy. Many of these functions are for use with CakePHP classes (loading
model or component classes), but many others make working with arrays or
strings a little easier.

We'll also cover some of the constants available in CakePHP applications. Using
these constants will help make upgrades more smooth, but are also convenient
ways to point to certain files or directories in your CakePHP application.

## Global Functions

Here are CakePHP's globally available functions. Most of them are just
convenience wrappers for other CakePHP functionality, such as debugging and
translating content.

> This function handles localization in CakePHP applications. The
> `$string_id` identifies the ID for a translation. You can supply
> additional arguments to replace placeholders in your string:
>
>     __('You have {0} unread messages', $number);
>
> You can also provide a name-indexed array of replacements:
>
>     __('You have {unread} unread messages', ['unread' => $number]);
>
> > [!NOTE]
> > Check out the
> > [Internationalization & Localization](../core-libraries/internationalization-and-localization) section for
> > more information.
>
> Allows you to override the current domain for a single message lookup.
>
> Useful when internationalizing a plugin:
> `echo __d('PluginName', 'This is my plugin');`
>
> Allows you to override the current domain for a single plural message
> lookup. Returns correct plural form of message identified by `$singular`
> and `$plural` for count `$count` from domain `$domain`.
>
> Allows you to override the current domain for a single message lookup. It
> also allows you to specify a context.
>
> The context is a unique identifier for the translations string that makes it
> unique within the same domain.
>
> Allows you to override the current domain for a single plural message
> lookup. It also allows you to specify a context. Returns correct plural
> form of message identified by `$singular` and `$plural` for count
> `$count` from domain `$domain`. Some languages have more than one form
> for plural messages dependent on the count.
>
> The context is a unique identifier for the translations string that makes it
> unique within the same domain.
>
> Returns correct plural form of message identified by `$singular` and
> `$plural` for count `$count`. Some languages have more than one form for
> plural messages dependent on the count.
>
> The context is a unique identifier for the translations string that makes it
> unique within the same domain.
>
> Returns correct plural form of message identified by `$singular` and
> `$plural` for count `$count` from domain `$domain`. It also allows you
> to specify a context. Some languages have more than one form for plural
> messages dependent on the count.
>
> The context is a unique identifier for the translations string that makes it
> unique within the same domain.
>
> Convenience wrapper for instantiating a new `Cake\Collection\Collection`
> object, wrapping the passed argument. The `$items` parameter takes either
> a `Traversable` object or an array.
>
> ::: info Changed in version 3.3.0
> Calling this method will return passed `$var`, so that you can, for instance,place it in return statements.
> :::
>
> If the core `$debug` variable is `true`, `$var` is printed out.
> If `$showHTML` is `true` or left as `null`, the data is rendered to be
> browser-friendly. If `$showFrom` is not set to `false`, the debug output
> will start with the line from which it was called. Also see
> [Debugging](../development/debugging)
>
> It behaves like `debug()`, but execution is also halted.
> If the core `$debug` variable is `true`, `$var` is printed.
> If `$showHTML` is `true` or left as `null`, the data is rendered to be
> browser-friendly. Also see [Debugging](../development/debugging)
>
> ::: info Changed in version 3.3.0
> Calling this method will return passed `$var`, so that you can, for instance,place it in return statements.
> :::
>
> Convenience wrapper for `print_r()`, with the addition of
> wrapping `<pre>` tags around the output.
>
> ::: info Changed in version 3.3.0
> Calling this method will return passed `$var`, so that you can, for instance,place it in return statements.
> :::
>
> JSON pretty print convenience function, with the addition of
> wrapping `<pre>` tags around the output.
>
> It is meant for debugging the JSON representation of objects and arrays.
>
> ::: info Changed in version 3.1.1
> The `$default` parameter has been added.
> :::
>
> Gets an environment variable from available sources. Used as a backup if
> `$_SERVER` or `$_ENV` are disabled.
>
> This function also emulates `PHP_SELF` and `DOCUMENT_ROOT` on
> unsupporting servers. In fact, it's a good idea to always use `env()`
> instead of `$_SERVER` or `getenv()` (especially if you plan to
> distribute the code), since it's a full emulation wrapper.
>
> Convenience wrapper for `htmlspecialchars()`.
>
> Splits a dot syntax plugin name into its plugin and class name. If `$name`
> does not have a dot, then index 0 will be `null`.
>
> Commonly used like `list($plugin, $name) = pluginSplit('Users.User');`
>
> Split the namespace from the classname.
>
> Commonly used like `list($namespace, $className) = namespaceSplit('Cake\Core\App');`

## Core Definition Constants

Most of the following constants refer to paths in your application.

> Absolute path to your application directory, including a trailing slash.
>
> > Equals `app` or the name of your application directory.
> >
> > Path to the cache files directory. It can be shared between hosts in a
> > multi-server setup.
> >
> > Path to the cake directory.
> >
> > Path to the root lib directory.
>
> Path to the config directory.
>
> Path to the CakePHP directory with ending directory slash.
>
> > Short for PHP's `DIRECTORY_SEPARATOR`, which is `/` on Linux and `\`
> > on Windows.
> >
> > Path to the logs directory.
> >
> > Path to the root directory.
> >
> > Path to the tests directory.
> >
> > Path to the temporary files directory.
> >
> > Full path to the webroot.

## Timing Definition Constants

> Unix timestamp in microseconds as a float from when the application started.
>
> Equals 1
>
> Equals 60
>
> Equals 3600
>
> Equals 86400
>
> Equals 604800
>
> Equals 2592000
>
> Equals 31536000
