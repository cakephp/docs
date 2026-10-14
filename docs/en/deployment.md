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

You can read the debug level from an environment variable, so that each
environment sets its own level. This will avoid deploying an application with
debug \> 0 and also save yourself from having to change the debug level each
time before deploying to a production environment.

Applications created from the `pieceofcake2/app` skeleton read the debug level
from the `DEBUG` environment variable, and use debug level 2 when it is not
set. Set it to `0` on the production server, for example in your Apache
configuration:

```apache
SetEnv DEBUG 0
```

In other applications, read the variable in `config/core.php`:

``` php
// config/core.php
Configure::write('debug', (int)env('DEBUG'));
```

The other settings that the skeleton reads from environment variables, such as
the security salts and the database credentials, are listed in
[Environment Variables](development/configuration#environment-variables).
Set them as real environment variables in production rather than in a `.env`
file. Real environment variables always take precedence over the `.env` files
that the skeleton loads in development.

## Improve your application's performance

Since handling static assets, such as images, JavaScript and CSS files of plugins,
through the Dispatcher is incredibly inefficient, it is strongly recommended to symlink
them for production. For example like this:

```bash
ln -s ../../plugins/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css
```

In the legacy layout, plugins are in `app/Plugin/` or `plugins/` and the
webroot is `app/webroot/`.

## Deploying to AWS Lambda

A CakePHP 2 application can also run on AWS Lambda without servers to manage,
with Bref and Docker container images. See
[Deploying to AWS Lambda](deployment/aws-lambda) for the changes to the
application, the AWS services to use for sessions, cache, email and files, and
deployment from GitHub Actions.
