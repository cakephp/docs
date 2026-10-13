# Deployment

Once your application is complete, or even before that you'll want to deploy it.
There are a few things you should do when deploying a CakePHP application.

## Check your security

If you're throwing your application out into the wild, it's a good idea to make
sure it doesn't have any leaks. Check the [Security](core-libraries/components/security-component) to guard against
CSRF attacks, form field tampering, and others. Doing [Data Validation](models/data-validation), and/or
[Data Sanitization](core-utility-libraries/sanitize) is also a great idea, for protecting your
database and also against XSS attacks. Check that only your `webroot` directory
is publicly visible, and that your secrets (such as your app salt and
any security keys) are private and unique as well!

## Set document root

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's `webroot/` directory
(`app/webroot/` in the legacy layout). This makes the application and
configuration files, as well as the Composer packages in `vendor/`,
inaccessible through a URL. Setting the document root is different for
different webservers. See the [URL Rewriting](installation/url-rewriting)
documentation for webserver specific information.

In all cases you will want to set the virtual host/domain's document root to be
`webroot/`. This removes the possibility of files outside of the webroot
directory being executed.

## Install dependencies for production

Install the Composer packages without the development dependencies, such as
Bake, DebugKit and PHPUnit, and with an optimized autoloader:

```bash
composer install --no-dev --optimize-autoloader
```

If your `config/bootstrap.php` loads development-only plugins, load them only
when they are installed, for example:

```php
// config/bootstrap.php
if (is_dir(ROOT . DS . 'plugins' . DS . 'DebugKit')) {
    CakePlugin::load('DebugKit');
}
```

## Update core.php

Updating `config/core.php` (`app/Config/core.php` in the legacy layout),
specifically the value of `debug` is extremely important.
Turning debug = 0 disables a number of development features that should never be
exposed to the Internet at large. Disabling debug changes the following types of
things:

- Debug messages, created with `pr()` and `debug()` are
  disabled.
- Core CakePHP caches are by default flushed every 999 days, instead of every
  10 seconds as in development.
- Error views are less informative, and give generic error messages instead.
- Errors are not displayed.
- Exception stack traces are disabled.

In addition to the above, many plugins and application extensions use `debug`
to modify their behavior.

You can check against an environment variable to set the debug level dynamically
between environments. This will avoid deploying an application with debug \> 0 and
also save yourself from having to change the debug level each time before deploying
to a production environment.

For example, you can set an environment variable in your Apache configuration:

    SetEnv CAKEPHP_DEBUG 2

And then you can set the debug level dynamically in `config/core.php`:

``` php
if (getenv('CAKEPHP_DEBUG')) {
    Configure::write('debug', 2);
} else {
    Configure::write('debug', 0);
}
```

## Improve your application's performance

Since handling static assets, such as images, JavaScript and CSS files of plugins,
through the Dispatcher is incredibly inefficient, it is strongly recommended to symlink
them for production. For example like this:

```bash
ln -s ../../plugins/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css
```

In the legacy layout, plugins are in `app/Plugin/` or `plugins/` and the
webroot is `app/webroot/`.
