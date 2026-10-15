# Deployment

Once your application is complete, or even before that you'll want to deploy it.
There are a few things you should do when deploying a CakePHP application.

## Check your security

Before you deploy, check at least these points. The
[Security](/security/) section and its
[Hardening Checklist](/security/hardening) describe them in more detail.

- `debug` is `0` in production; see [Update core.php](#update-core-php).
- `Security.salt` and `Security.cipherSeed` are secret values unique to your
  application, and `CookieComponent` uses the `'aes'` cipher type; see
  [Core Configuration](development/configuration#cakephp-core-configuration)
  and [CookieComponent cipher type](security/fixes#cookiecomponent-cipher-type).
- The document root is the `webroot/` directory only; see
  [Set document root](#set-document-root) and
  [Web Server Configuration](installation/url-rewriting).
- The application is served over HTTPS only; see [Use HTTPS](#use-https).
- Forms are protected against tampering and CSRF with the
  [Security component](core-libraries/components/security-component).
- Input is checked with [Data Validation](models/data-validation).
- Output is escaped with `h()`, and HTML written by users is sanitized with a
  maintained library; see
  [Output Escaping and HTML Sanitization](/security/escaping-and-sanitizing-html).
- The dependencies are up to date and installed without development
  packages; see
  [Install dependencies for production](#install-dependencies-for-production).
- The web server can write only to `tmp/` and `logs/`; see
  [Set file permissions](#set-file-permissions).
- Secrets come from environment variables, not from files in the
  repository; see [Environment Variables](development/configuration#environment-variables).

## Set document root

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's `webroot/` directory
(`app/webroot/` in the legacy layout). This makes the application and
configuration files, as well as the Composer packages in `vendor/`,
inaccessible through a URL. Setting the document root is different for
different webservers. See the [Web Server Configuration](installation/url-rewriting)
documentation for webserver specific information.

In all cases you will want to set the virtual host/domain's document root to be
`webroot/`. This removes the possibility of files outside of the webroot
directory being executed.

> [!WARNING]
> Never set the document root to the project directory, not even on a
> development or shared server. Files such as `.env`, `.git/config`,
> `composer.json`, `config/*.default`, `logs/error.log`, the templates and
> the files in `tmp/` and `vendor/` could then be downloaded. In the legacy
> layout, the root `.htaccess` file only protects them while mod_rewrite is
> active; see
> [The Legacy Root .htaccess Files](installation/url-rewriting#legacy-root-htaccess).

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

With nginx and PHP-FPM, set it in the `location` block that passes
`index.php` to PHP-FPM, or in the PHP-FPM pool configuration. PHP-FPM does
not pass the environment of the server to PHP unless `clear_env` is `no`:

```nginx
fastcgi_param DEBUG 0;
```

```ini
; PHP-FPM pool, for example /etc/php/8.3/fpm/pool.d/www.conf
env[DEBUG] = 0
```

> [!WARNING]
> If `DEBUG` is not set, the skeleton runs with debug level 2, which shows
> stack traces, SQL queries and configuration details, and enables the web
> test runner `webroot/test.php`. Check that `DEBUG` is `0` on every
> production server.

In other applications, read the variable in `config/core.php`:

```php
// config/core.php
Configure::write('debug', (int)env('DEBUG'));
```

The other settings that the skeleton reads from environment variables, such as
the security salts and the database credentials, are listed in
[Environment Variables](development/configuration#environment-variables).
Set them as real environment variables in production rather than in a `.env`
file, or load them from a secret store such as AWS Systems Manager Parameter
Store (see [Configuration and Secrets](deployment/aws-lambda#configuration-and-secrets)).
Real environment variables always take precedence over the `.env` files
that the skeleton loads in development. Do not commit secrets to the
repository, and do not write them to logs.

## Deploy only what you need

Deploy the application without the `.git/` directory, `.env` files, `tests/`
and other development files, and delete `webroot/test.php`, which is only
needed to run tests in the browser. Even outside the document root, these
files are not needed on the server, and `.git/` and `.env` can contain
secrets.

## Set file permissions

The web server user only needs to write to `tmp/` and `logs/`, as described in
[Permissions](installation#permissions). All other files, including
`config/` and `webroot/`, should be owned by the deploy user and only be
readable by the web server. Give write access to `tmp/` and `logs/` to the web
server user only (and to the user that runs console commands), for example
with the `setfacl` commands on that page or with a shared group and mode
`770`. Never use `chmod 777`: it lets every user on the server change your
files.

## Protect uploaded files

Store uploaded files outside of `webroot/` when possible, and send them with a
controller after checking that the user may see them. If uploads must be in
`webroot/`, configure the web server so that it never runs PHP files there;
see [Apache](installation/url-rewriting#apache-and-mod-rewrite-and-htaccess)
(step 5) and [nginx](installation/url-rewriting#pretty-urls-on-nginx).

## Use HTTPS

Serve the application only over HTTPS, and redirect HTTP requests to HTTPS.
CakePHP marks the session cookie as `secure` when the `HTTPS` server variable
is set. Behind a load balancer or proxy that terminates TLS, this variable is
usually not set, so set the cookie option yourself:

```php
// config/core.php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_secure' => true,
    ],
]);
```

Use a PHP version that still receives security fixes; see
[Supported Versions](https://www.php.net/supported-versions.php).

## Clear the cache after deploying

With debug level 0, CakePHP caches model schemas and other core data for a
long time. After deploying a new version, in particular one that changes the
database schema, delete the cached files in `tmp/cache/models/`,
`tmp/cache/persistent/` and `tmp/cache/views/`, or clear the cache
configurations that your application uses. If OPcache is configured with
`opcache.validate_timestamps=0`, also reload PHP-FPM so that it loads the new
code.

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
