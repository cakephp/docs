# 4.0 Upgrade Guide

First, check that your application is running on latest CakePHP 3.x version.

> [!NOTE]
> The upgrade tool only works on applications running on latest CakePHP 3.x. You cannot run the upgrade tool after updating to CakePHP 4.0.

## Fix Deprecation Warnings

Once your application is running on latest CakePHP 3.x, enable deprecation warnings in **config/app.php**:

    'Error' => [
        'errorLevel' => E_ALL,
    ]

Now that you can see all the warnings, make sure these are fixed before proceeding with the upgrade.

## Upgrade to PHP 8.0

If you are not running on **PHP 8.0 or higher**, you will need to upgrade PHP before updating CakePHP.

> [!NOTE]
> Although CakePHP 4.0 requires **a minimum of PHP 7.2**, the upgrade tool requires **a minimum of PHP 8.0**.

<a id="upgrade-tool-use"></a>

## Use the Upgrade Tool

Because CakePHP 4 adopts strict mode and uses more typehinting, there are many
backwards incompatible changes concerning method signatures and file renames.
To help expedite fixing these tedious changes there is an upgrade CLI tool:

> [!WARNING]
> The `file_rename` command and rector rules for cakephp40, and phpunit80
> are intended to be run **before** you update your application's dependencies
> to 4.0. The `cakephp40` rector rules will not run correctly if your
> application already has its dependencies updated to 4.x or PHPUnit8.

``` bash
# Install the upgrade tool
git clone https://github.com/cakephp/upgrade
cd upgrade
git checkout 4.x
composer install --no-dev
```

With the upgrade tool installed you can now run it on your application or
plugin:

``` bash
# Rename locale files
bin/cake upgrade file_rename locales <path/to/app>

# Rename template files
bin/cake upgrade file_rename templates <path/to/app>
```

Once you've renamed your template and locale files, make sure you update
`App.paths.locales` and `App.paths.templates` paths in **/config/app.php**. If needed, refer to the [skeleton app config](https://github.com/cakephp/app/blob/4.x/config/app.php).

### Applying Rector Refactorings

Next use the `rector` command to automatically fix many deprecated CakePHP and
PHPUnit method calls. It is important to apply rector **before** you upgrade
your dependencies:

    bin/cake upgrade rector --rules phpunit80 <path/to/app/tests>
    bin/cake upgrade rector --rules cakephp40 <path/to/app/src>

You can also use the upgrade tool to apply new rector rules for each minor
version of CakePHP:

    # Run the rector rules for the 4.0 -> 4.1 upgrade.
    bin/cake upgrade rector --rules cakephp41 <path/to/app/src>

## Update CakePHP Dependency

After applying rector refactorings, upgrade CakePHP and PHPUnit with the following
composer commands:

``` bash
php composer.phar require --dev --update-with-dependencies "phpunit/phpunit:^8.0"
php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"
```

## Others

Next, ensure your files have been updated to have the same
method signatures as those found in cakephp/app.

1.  `src/Application.php` at [Application.php](https://github.com/cakephp/app/blob/4.x/src/Application.php) on GitHub.
2.  `config/app.php` at [app.php](https://github.com/cakephp/app/blob/4.x/config/app.php) on GitHub.
3.  `config/bootstrap.php` at [bootstrap.php](https://github.com/cakephp/app/blob/4.x/config/bootstrap.php) on GitHub.
4.  `config/paths.php` at [paths.php](https://github.com/cakephp/app/blob/4.x/config/paths.php) on GitHub, where `RESOURCES` needs to be defined.
5.  `config/routes.php` at [routes.php](https://github.com/cakephp/app/blob/4.x/config/routes.php) on GitHub.

If you are providing some kind of REST API, don't forget to include the
[Body Parser Middleware](../controllers/middleware#body-parser-middleware). Finally, you should consider upgrading to the new
[AuthenticationMiddleware](/authentication/2/en/index.html)
and [AuthorizationMiddleware](/authorization/2/en/index.html), if you are still
using `AuthComponent`.
