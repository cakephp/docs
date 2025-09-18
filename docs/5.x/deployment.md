# Deployment

Once your app is ready to be deployed there are a few things you should do.

## Moving files

You can clone your repository onto your production server and then checkout the
commit/tag you want to run. Then, run `composer install`. While this requires
some knowledge about git and an existing install of `git` and `composer`
this process will take care about library dependencies and file and folder
permissions.

Be aware that when deploying via FTP you will have to fix file and
folder permissions.

You can also use this deployment technique to setup a staging or demo-server
(pre-production) and keep it in sync with your local environment.

## Adjusting Configuration

You'll want to make a few adjustments to your application's configuration for
a production environment. The value of `debug` is extremely important.
Turning debug = `false` disables a number of development features that should
never be exposed to the Internet at large. Disabling debug changes the following
features:

- Debug messages, created with `pr()`, `debug()` and `dd()` are
  disabled.
- Core CakePHP caches duration are defaulted to 365 days, instead of 10 seconds
  as in development.
- Error views are less informative, and generic error pages are displayed
  instead of detailed error messages with stack traces.
- PHP Warnings and Errors are not displayed.

In addition to the above, many plugins and application extensions use `debug`
to modify their behavior.

You can check against an environment variable to set the debug level dynamically
between environments. This will avoid deploying an application with debug
`true` and also save yourself from having to change the debug level each time
before deploying to a production environment.

For example, you can set an environment variable in your Apache configuration:

    SetEnv CAKEPHP_DEBUG 1

And then you can set the debug level dynamically in **app_local.php**:

``` php
$debug = (bool)getenv('CAKEPHP_DEBUG');

return [
    'debug' => $debug,
    .....
];
```

It is recommended that you put configuration that is shared across all
of your application's environments in **config/app.php**. For configuration that
varies between environments either use **config/app_local.php** or environment
variables.

## Check Your Security

If you're throwing your application out into the wild, it's a good idea to make
sure it doesn't have any obvious leaks:

- Ensure you are using the [Csrf Middleware](security/csrf#csrf-middleware) component or middleware.
- You may want to enable the [Form Protection Component](controllers/components/form-protection) component.
  It can help prevent several types of form tampering and reduce the possibility
  of mass-assignment issues.
- Ensure your models have the correct [Validation](core-libraries/validation) rules
  enabled.
- Check that only your `webroot` directory is publicly visible, and that your
  secrets (such as your app salt, and any security keys) are private and unique
  as well.

## Set Document Root

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's `webroot`. This
makes the application and configuration files inaccessible through a URL.
Setting the document root is different for different webservers. See the
[Url Rewriting](installation#url-rewriting) documentation for webserver specific
information.

In all cases you will want to set the virtual host/domain's document to be
`webroot/`. This removes the possibility of files outside of the webroot
directory being executed.

<a id="symlink-assets"></a>

## Improve Your Application's Performance

Class loading can take a big share of your application's processing time.
In order to avoid this problem, it is recommended that you run this command in
your production server once the application is deployed:

    php composer.phar dumpautoload -o

Since handling static assets, such as images, JavaScript and CSS files of
plugins, through the `Dispatcher` is incredibly inefficient, it is strongly
recommended to symlink them for production. This can be done by using
the `plugin` command:

    bin/cake plugin assets symlink

The above command will symlink the `webroot` directory of all loaded plugins
to appropriate path in the app's `webroot` directory.

If your filesystem doesn't allow creating symlinks the directories will be
copied instead of being symlinked. You can also explicitly copy the directories
using:

    bin/cake plugin assets copy

CakePHP uses `assert()` internally to provide runtime type checking and
provide better error messages during development. You can have PHP skip these
assertions by updating your `php.ini` to include:

``` ini
; Turn off assert() code generation.
zend.assertions = -1
```

Skipping code generation for `assert()` will yield faster runtime performance,
and is recommended for applications that have good test coverage or that are
using a static analyzer.

## Deploying an update

On each deploy you'll likely have a few tasks to co-ordinate on your web server. Some typical ones
are:

1.  Install dependencies with `composer install`. Avoid using `composer update` when doing deploys as you could get unexpected versions of packages.
2.  Run database [migrations](/migrations/) with either the Migrations plugin
    or another tool.
3.  Clear model schema cache with `bin/cake schema_cache clear`. The [Schema Cache Tool](console-commands/schema-cache)
    has more information on this command.
