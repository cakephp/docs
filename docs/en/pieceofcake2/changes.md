# Changes from the Original Book

This book is based on the CakePHP 2.x Cookbook. This page summarizes how
CakePHP 2 on the Piece of Cake 2 fork differs from the original CakePHP 2.10.24,
and lists the pages of this book that were changed from the original.

## Differences from CakePHP 2.10.24

| Area | Original CakePHP 2.10.24 | Piece of Cake 2 fork | See |
|------|--------------------------|----------------------|-----|
| PHP | PHP 5.3 to 7.4 | PHP 8.0 to 8.5 | [Installation](/installation) |
| Installation | Archive download, PEAR or Composer | Composer only (`pieceofcake2/cakephp`) | [Installation](/installation) |
| Plugins via Composer | Optional | `composer/installers` settings are required | [Configuring composer.json](/installation#configuring-composer-json) |
| Application layout | `app/` | Modern layout (`src/`, `templates/`, `config/`, ...) or `app/` | [Folder Structure](/getting-started/cakephp-folder-structure) |
| Framework layout | `lib/Cake/` | `vendor/pieceofcake2/cakephp/src/Cake/` | [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10) |
| Class loading | `App::uses()` | Composer classmap; `App::uses()` only for classes Composer does not know | [Controllers](/controllers#autoloading-classes) |
| Bake | Core shell | [pieceofcake2/bake](https://github.com/pieceofcake2/bake) plugin | [Code Generation with Bake](/console-and-shells/code-generation-with-bake) |
| UpgradeShell | Core shell | [pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade) plugin | [Upgrade Shell](/console-and-shells/upgrade-shell) |
| Cache engines | Includes Xcache and Wincache | Xcache and Wincache removed | [Caching](/core-libraries/caching) |
| Tests | PHPUnit 3.7 | PHPUnit 9.6 | [Testing](/development/testing) |
| Coding standard | CakePHP 2 standard (tabs, `array()`) | CakePHP 5 codesniffer (4 spaces, `[]`) | [Coding Standards](/contributing/cakephp-coding-conventions) |
| CSRF protection | Unsigned tokens; some methods not validated | HMAC-signed tokens; all methods except GET/HEAD/OPTIONS validated | [Security Fixes](/appendices/security-fixes) |
| SSL certificates | Bundled `cacert.pem` (2016) | System CA bundle or composer/ca-bundle | [Security Fixes](/appendices/security-fixes) |
| `String` class | Alias of `CakeText` | Removed; use `CakeText` | [CakeText](/core-utility-libraries/string) |

For the complete list of breaking changes, see
[Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10) and the
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md).

## Pages Changed in This Book

Besides the changes listed below, all code samples follow the CakePHP 5 coding
standard (short array syntax, braces on their own line), and paths use the
modern directory layout.

### New pages

- [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10)
- [Migrating to the Modern Layout](/appendices/migrating-to-the-modern-layout)
- [Security Fixes](/appendices/security-fixes)
- [Migrating Tests to PHPUnit 9.6](/appendices/phpunit-9-migration-hints)
- [Maintained Plugins](/plugins/maintained-plugins)

### Getting Started

- [Installation](/installation)
  - Requirements: PHP 8.0-8.5, Composer, MySQL 5.6+/PostgreSQL 9.4+/SQLite 3/SQL Server 2022+, mbstring/intl/openssl notes
  - New application via `composer create-project pieceofcake2/app` (modern layout) with database.php and salt/cipherSeed setup
  - Existing applications: replace cakephp/cakephp with pieceofcake2/cakephp and update the dispatcher files
  - Removed archive/git downloads, include_path core sharing and the subdirectory "Development" setup
  - Permissions now cover tmp/ and logs/; added the built-in server (`bin/cake server`) and an Apache virtual host for webroot/
  - Added "Configuring composer.json": minimal composer.json; config.allow-plugins for composer/installers and extra.installer-paths to plugins/{$name}/ are required for cakephp-plugin packages
- [Advanced Installation](/installation/advanced-installation)
  - Removed PEAR installation, the old Composer/bake project setup and CAKE_CORE_INCLUDE_PATH core sharing
  - Added Composer setup details: replace directive, plugin installer-paths, classmap autoloading, exclude-from-classmap
  - Custom paths are now configured in config/define.php (ROOT, APP_DIR, WEBROOT_DIR, WWW_ROOT, VENDORS) with a moved-webroot example
- [URL Rewriting](/installation/url-rewriting)
  - Examples assume the document root is webroot/; .htaccess updated to the skeleton version; legacy root/app .htaccess explained briefly
  - nginx example updated for PHP-FPM sockets; IIS web.config placed in webroot/; removed dead links (Web Platform Installer, virtualhostx, Apache wiki)
- [CakePHP Conventions](/getting-started/cakephp-conventions)
  - File locations use src/ and templates/; String::uuid replaced by CakeText::uuid()
- [CakePHP Folder Structure](/getting-started/cakephp-folder-structure)
  - Describes the modern layout (bin, config, logs, plugins, resources/locales, src, templates, tests, tmp, vendor, webroot) with a legacy app/ mapping table
  - Added steps for moving a legacy app/ application to the modern layout
- [CakePHP Structure](/getting-started/cakephp-structure)
  - AppController/AppHelper/AppModel, routes, layouts and elements paths use the modern layout
  - Examples use AuthComponent and FormHelper instead of the deprecated EmailComponent and JsHelper

### CakePHP Overview

- [What is CakePHP? Why use it?](/cakephp-overview/what-is-cakephp-why-use-it)
  - Feature list: PHP 8.0-8.5, Bake plugin, Composer; note that Bake is no longer in the core
- [Where to Get Help](/cakephp-overview/where-to-get-help)
  - Added Piece of Cake 2 GitHub issue trackers; removed IRC (freenode) and Google Groups; test cases path updated

### Controllers

- [Controllers](/controllers)
  - Paths use the modern layout (src/Controller, templates/, plugins/); legacy app/ layout mentioned once
  - New "Loading classes" section: Composer classmap autoloading replaces App::uses(); when App::uses() is still needed
- [Request and Response objects](/controllers/request-response)
  - Dispatcher path is webroot/index.php; response mock example uses getMockBuilder() for PHPUnit 9
- [The Pages Controller](/controllers/pages-controller)
  - Paths updated to src/Controller and templates/Pages; skel source is the app skeleton or the Bake plugin instead of lib/Cake
- [Scaffolding](/controllers/scaffolding)
  - Paths updated to src/Model, config/core.php and templates/; Bake referred to as a plugin
- [Components](/controllers/components)
  - Component paths moved to src/Controller/Component; App::uses() removed from examples; code style fixed

### Views

- [Views](/views)
  - Template, layout and element paths use templates/; view classes in src/View; legacy app/View mapping table
  - Removed Flash/AMF and SOAP examples from the intro; linked the TwigView plugin
  - Fixed syntax errors in the element caching example; removed App::uses() from the custom view class example
- [Media Views](/views/media-view)
  - Example paths use ROOT and WWW_ROOT; corrected that relative paths resolve against APP (not webroot)
- [JSON and XML views](/views/json-and-xml-views)
  - View file path in example changed to templates/Posts/json/index.ctp
- [Themes](/views/themes)
  - Theme paths use templates/Themed and webroot/; plugin asset example uses plugins/
- [Helpers](/views/helpers)
  - Helper paths use src/View/Helper; App::uses() removed from examples with a note on classmap autoloading; Bakery reference replaced by plugin list

### Models

- [Models](/models)
  - Model files and AppModel live in `src/Model/`; AppModel is not shipped by the core; `App::uses()` only needed without a Composer classmap
- [Associations: Linking Models Together](/models/associations-linking-models-together)
  - Model file paths use src/Model/
- [Saving Your Data](/models/saving-your-data)
  - Example file comments use src/Controller/ and templates/
- [Data Validation](/models/data-validation)
  - Localized validation classes in src/Validation (autoloaded via classmap or App::uses()); Localized plugin link points to pieceofcake2/localized; removed Windows/mod_php note
- [Callback Methods](/models/callback-methods)
  - Example path uses src/Model/
- [Behaviors](/models/behaviors)
  - Behaviors go in src/Model/Behavior; core behaviors in vendor/pieceofcake2/cakephp/src/Cake/Model/Behavior
  - Community behaviors: link to maintained plugins instead of the CakePHP Bakery
- [DataSources](/models/datasources)
  - Supported databases, versions and PDO extensions table; new "Connection Settings" section (config/database.php, encoding in DSN, PostgreSQL sslmode, PHP 8.1 native int/float and ATTR_STRINGIFY_FETCHES)
  - SQL Server: ODBC driver on any OS instead of Windows-only Native Client; port, schema (default dbo), options, persistent settings
  - Datasource example and plugin paths moved to src/Model/Datasource and plugins/
  - Link to the pieceofcake2/datasources plugin instead of the old cakephp/datasources repository
- [Model Attributes](/models/model-attributes)
  - Database configuration file path is config/database.php

### Core Libraries

- [Caching](/core-libraries/caching)
  - Xcache and Wincache engines removed from the engine list (change note); Apc engine documented as APCu
  - Configuration paths changed to config/bootstrap.php, config/core.php and src/Lib/Cache/Engine; PHP 5.3 remarks removed
- [Events System](/core-libraries/events)
  - Examples use src/Lib/Event, config/bootstrap.php and config/events.php; App::uses and PHP 5.3 remarks removed; Composer classmap autoloading noted
- [Global Constants and Functions](/core-libraries/global-constants-and-functions)
  - Path constants documented with modern-layout values (APP=src/, CONFIG=config/, TESTS=tests/, TMP=tmp/, LOGS=logs/, WWW_ROOT=webroot/); legacy app/ values mentioned once
  - CAKE, CAKE_CORE_INCLUDE_PATH and CORE_PATH point into vendor/pieceofcake2/cakephp/src; new CORE_ROOT constant documented
- [Internationalization & Localization](/core-libraries/internationalization-and-localization)
  - Locale files in resources/locales (legacy app/Locale also searched); plugin translations in plugins/&lt;Plugin>/Locale
  - i18n extract example for the modern layout: bin/cake i18n extract --paths src,templates --output resources/locales
- [Logging](/core-libraries/logging)
  - Default log directory is logs/ (LOGS constant); custom log engines in src/Lib and plugins/; App::uses removed from examples
- [Welcome](/index)
  - Unsupported-version warning reworded for the fork (CakePHP 2 EOL upstream, use CakePHP 5 for new projects)
  - Removed the PDF/EPUB download block; added the book source link and an Installation entry
- [Translate](/core-libraries/behaviors/translate)
  - i18n table initialization command is bin/cake i18n
- [Tree](/core-libraries/behaviors/tree)
  - Example path src/Model/Category.php
- [Access Control Lists](/core-libraries/components/access-control-lists)
  - Paths changed to config/ (core.php, acl.ini.php, database.php, Schema/db_acl.sql); commands use bin/cake; core model path in vendor/pieceofcake2/cakephp/src/Cake/Model
- [Authentication](/core-libraries/components/authentication)
  - Custom auth/authorize/hasher classes in src/Controller/Component/Auth; layout in templates/Layouts; App::uses removed
- [Cookie](/core-libraries/components/cookie)
  - Example uses type('aes') with Security.useOpenSsl; warning that the default 'cipher' is insecure and 'rijndael' needs mcrypt
- [Flash](/core-libraries/components/flash)
  - Flash elements in templates/Elements/Flash
- [Security](/core-libraries/components/security-component)
  - Change note: HMAC-signed CSRF tokens (CVE-2020-15400) and validation of _method-overridden requests (CVE-2015-8379)
- [CacheHelper](/core-libraries/helpers/cache)
  - Cache.check setting in config/core.php
- [FlashHelper](/core-libraries/helpers/flash)
  - Flash elements in templates/Elements/Flash; core ships default/success/error elements that the app can override
- [JsHelper](/core-libraries/helpers/js)
  - Paths changed to webroot/js and templates/Layouts; PHP4/PHP5 method chaining remarks removed
- [PaginatorHelper](/core-libraries/helpers/paginator)
  - Example path templates/Posts/index.ctp
- [RssHelper](/core-libraries/helpers/rss)
  - Paths changed to config/routes.php, templates/Layouts/rss and templates/Posts/rss
- [TextHelper](/core-libraries/helpers/text)
  - String class reference replaced with CakeText
- [TimeHelper](/core-libraries/helpers/time)
  - Timezone setting in config/core.php

### Core Utility Libraries

- [App Class](/core-utility-libraries/app)
  - Loading classes rewritten around Composer classmap autoloading; App::uses() only for classes Composer does not know (app classes without classmap, non-Composer plugins)
  - Overriding core classes: src/Lib plus an explicit App::uses() call, exclude-from-classmap note
  - Vendor files: Composer libraries need no loading; hand-copied files in vendors/; plugin paths in plugins/; removed CakePHP 1.3 to 2.0 migration notes
- [CakeEmail](/core-utility-libraries/email)
  - Config in config/email.php, templates in templates/Emails and templates/Layouts/Emails, custom transports in src/Lib/Network/Email; removed EmailComponent comparisons and App::uses()
  - Gmail: app password instead of the defunct "less secure apps" setting; STARTTLS example uses port 587; change note for the typed MailTransport::_mail() signature
- [Folder & File](/core-utility-libraries/file-folder)
  - Folder and File are autoloaded; removed App::uses()
- [Hash](/core-utility-libraries/hash)
  - Removed the PHP 5.4 requirement note for natural sorting
- [HttpSocket](/core-utility-libraries/httpsocket)
  - CA certificates: system CA bundle with composer/ca-bundle fallback explained in the text; custom response/auth classes in src/Lib/Network/Http and extending HttpSocketResponse; removed App::uses() and Bakery URLs
- [CakeNumber](/core-utility-libraries/number)
  - Removed unneeded App::uses() from the example
- [Data Sanitization](/core-utility-libraries/sanitize)
  - Sanitize is not present in CakePHP 3.0 and later (instead of "will be removed")
- [Security](/core-utility-libraries/security)
  - Explain that mcrypt is not bundled since PHP 7.2 and Security.useOpenSsl should be enabled in config/core.php (compatible format); rijndael() needs PECL mcrypt; Cookie 'cipher' type warning
- [Set](/core-utility-libraries/set)
  - Test file path updated to tests/TestCase/Utility/SetTest.php
- [CakeText](/core-utility-libraries/string)
  - Removed String class deprecation note and App::uses() from the example; one change note about the removed String class
- [CakeTime](/core-utility-libraries/time)
  - strftime() formats now explained in the text (IntlDateFormatter via php81_bc/strftime, intl needed for non-English names); fixed syntax error and removed App::uses() in the example
- [Xml](/core-utility-libraries/xml)
  - Removed CakePHP 1.3 "old method" comparisons and App::uses(); documented Xml::build() options (return, loadEntities default false, readFile, parseHuge) and a warning about passing user input; fixed broken examples

### Console & Shells

- [Shells, Tasks & Console Tools](/console-and-shells)
  - Console started with `bin/cake` (or `vendor/bin/cake`); shells in `src/Console/Command/`, legacy `app/Console/cake` mentioned once
  - Updated console welcome output and core shell list for v2.12.2 (bake/upgrade are plugins now)
  - Removed instructions for adding `lib/Cake/Console` to the system PATH (Windows steps, cake.bat)
  - Task loading example uses an application task instead of the removed core ProjectTask
- [Code Generation with Bake](/console-and-shells/code-generation-with-bake)
  - Rewritten for the pieceofcake2/bake plugin: Composer install, `CakePlugin::load('Bake')`, `bin/cake bake` commands
  - Documented where Bake writes views, tests and fixtures in the modern layout and where to move them
  - Bake theme locations updated (`plugins/Bake/Console/Templates/default`, `src/Console/Templates/[theme]`); `lib/Cake/Console/Templates` removed
- [Schema management and migrations](/console-and-shells/schema-management-and-migrations)
  - Commands use `bin/cake schema`; schema files live in `config/Schema`
- [ACL Shell](/console-and-shells/acl-shell)
  - Commands use `bin/cake`
- [Completion Shell](/console-and-shells/completion-shell)
  - Commands use `bin/cake`; examples refer to the Bake plugin shell as `Bake.bake`; removed core `bake`/`upgrade` from the command list
- [Running Shells as cronjobs](/console-and-shells/cron-jobs)
  - Cron example uses `cd /path/to/my_app && bin/cake`
- [Shell Helpers](/console-and-shells/helpers)
  - Custom helper example fixed: class/file must use the `ShellHelper` suffix (`src/Console/Helper/HeadingShellHelper.php`), no `App::uses()`
  - `output()` examples pass arguments as an array (passing a string or closure directly causes a TypeError on PHP 8)
- [I18N shell](/console-and-shells/i18n-shell)
  - Extraction example scans `src` and `templates` and writes to `resources/locales`; noted that model validation messages are then not extracted
- [Test shell](/console-and-shells/testsuite-shell)
  - Added `bin/cake test app AllTests` example and PHPUnit 9.6 via Composer
- [Upgrade shell](/console-and-shells/upgrade-shell)
  - Rewritten for the pieceofcake2/upgrade plugin (Composer install, `CakePlugin::load('Upgrade')`); removed the manual download/copy walkthrough

### Development

- [Configuration](/development/configuration)
  - Config files described in `config/` (core, bootstrap, database, routes, email, acl, Schema); legacy `app/Config/` and the `CONFIG` constant explained in text
  - Database: built-in PDO drivers listed; `encoding` passed in the DSN; added `flags` (PHP 8.1 `ATTR_STRINGIFY_FETCHES`), `schema` (PostgreSQL/SQL Server), `sslmode`, `options`; removed PHP 5.3.7 notes
  - Change note: SQL Server driver targets SQL Server 2022+, `port`/`schema`/`options` handling
  - Class loading rewritten around Composer classmap (`composer dump-autoload`, `App::uses()` only for non-autoloaded plugins); change note on the framework's move to classmap
  - Core settings: Session sub-key `name` corrected to `cookie`, added `cacheLimiter`, modern handler/schema paths and `bin/cake`; `.htaccess` removal for App.baseUrl per layout
  - Security: `Security.salt` usage documented; change note on HMAC-signed CSRF tokens; `cipherSeed` only for weak Cookie 'cipher'; new `Security.useOpenSsl` entry (required on PHP 8 for encrypt()/Cookie 'aes')
  - Cache: available engines listed (File, Apc/APCu, Memcached, Memcache, Redis); change note on removed Xcache/Wincache
  - Config readers: readers default to `CONFIG`; custom reader example moved to `src/Lib/Configure`, declares its property (PHP 8.2), no `App::uses()`; ja example renamed from `XmlReader` (clashes with PHP's XMLReader) to `MyXmlReader`; ConfigReaderInterface/ConfigureException reference fixed
  - Inflector path `src/Cake/Utility/Inflector.php` and bootstrap `config/bootstrap.php` folded into text; era-specific examples (old IE/Chrome Frame, AMF/SOAP) modernized; ja: `$merge` description corrected, `Configure::consume()` added
- [Routing](/development/routing)
  - Routes file path changed to config/routes.php (legacy app/Config/routes.php noted with link to the folder structure page)
  - Built-in routes located in vendor/pieceofcake2/cakephp/config/routes.php; disabling them means removing the require line from config/routes.php
  - Prefix routing: Routing.prefixes in config/core.php, prefix view in templates/Users/admin_edit.ctp
  - Custom route classes go in src/Routing/Route and are autoloaded via Composer classmap (composer dump-autoload) instead of App::uses()
  - Code samples: modern path comments, valid PHP class in passed-arguments example
  - ja: added explicit anchors (routes-configuration, connecting-routes, route-elements, prefix-routing, route-conditions, passed-arguments, named-parameters) so links from other pages work
- [Sessions](/development/sessions)
  - Paths updated to modern layout (`tmp/sessions`, `src/Model/Datasource/Session/`, `config/Schema/sessions.php`, `bin/cake schema create sessions`) with legacy paths in text
  - Handler example fixed: 6 callables, `checkAgent` instead of `userAgent`, `session.`-prefixed ini keys; noted PHP 8.4 deprecation of the callables form
  - Change note: handlers support `session.use_strict_mode` (PHP 8.6 default) via `SessionHandlerAdapter`; requirements for custom `read()`/`destroy()`
  - Xcache removed from cache session text (APCu, Memcached, Redis); ComboSession example uses APCu, drops `App::uses()`, modern path; code blocks marked as PHP
- [Dispatcher Filters](/development/dispatch-filters)
  - Filters configured in config/bootstrap.php; app filter classes in src/Routing/Filter, plugin filters in plugins/MyPlugin/Routing/Filter
  - Removed App::uses() for framework classes and PHP 5.3 closure caveats; noted composer dump-autoload and class_exists() requirement for settings form
  - Fixed invalid closure placeholders in examples and broken markup
  - (ja) Corrected mistranslation about filter priority and plugin notation
- [Exceptions](/development/exceptions)
  - Restored the missing exception class names in the built-in exception lists (as tables)
  - Paths use the modern layout (templates/Errors, templates/Layouts, src/Lib/Error, config/core.php); documented Exception.skipLog
  - Exception handlers receive any Throwable; examples typed with Throwable, PHP 5.3 caveat removed, no App::uses() for framework classes
  - Change note: overriding CakeErrorController in the app is unreliable with Composer classmap autoloading; use _getController()
- [Error Handling](/development/errors)
  - Paths and examples use the modern layout (config/core.php, config/bootstrap.php, src/Lib/AppError.php)
  - Documented Error.extraFatalErrorMemory and where errors are logged (logs/error.log, logs/debug.log)
  - Change note: default handler checks error_reporting() & $code so @-suppressed errors are ignored on PHP 8
  - Explained that PHP 7/8 Error objects (TypeError etc.) go to the exception handler, and that PHP 8 no longer passes $context
  - Removed PHP 5.3 caveat; handler examples updated for PHP 8
- [Debugging](/development/debugging)
  - debug() signature updated; trace/excerpt examples use fork paths (APP/CORE/ROOT); invoke() replaced with getInstance()
  - Logs written to logs/ (debug.log/error.log); Object replaced with CakeObject; App::uses('CakeLog') removed
  - DebugKit: install pieceofcake2/debug_kit with Composer and load it in config/bootstrap.php
- [Testing](/development/testing)
  - PHPUnit 9.6 installed with Composer (require-dev); PHPUnit 3.7/4.x/5.x, .phar and autoloader workaround instructions removed
  - Test cases in tests/TestCase and fixtures in tests/Fixture; configuration in config/; legacy app/Test layout mentioned as fallback
  - Running tests: vendor/bin/phpunit with phpunit.xml.dist (bootstrap tests/bootstrap.php, CakeFixtureInjector listener, stderr) and bin/cake test; lib/Cake/Console/cake and --app examples removed
  - Documented that test case listing (bin/cake test app without a case, web runner list) only searches Test/Case and is empty with tests/TestCase
  - Web runner: webroot/test.php from the skeleton, run a case via ?case=; command line recommended
  - Code samples updated for PHPUnit 9: setUp()/tearDown(): void, assertStringContainsString, assertIsArray, assertMatchesRegularExpression, willReturn(), PHPUnit\Framework\TestCase
  - New section on createMock()/getMockBuilder(), deprecated CakeTestCase::getMock(), getMockForModel() signature and expectException()
  - staticExpects() example replaced with writing Auth.User to the session
  - Coverage requires Xdebug or PCOV; output to tmp/coverage
  - Test suites use TESTS . 'TestCase'; note that phpunit.xml.dist makes AllTests optional
  - Plugin tests in plugins/&lt;Name>/tests/TestCase (Test/Case fallback)
  - Jenkins: composer install step, config/database.php, vendor/bin/phpunit, jenkins.io links
- [REST](/development/rest)
  - Paths updated to config/routes.php, src/Controller and templates/Recipes/xml
  - Corrected HTTP method override precedence (X-HTTP-Method-Override header before _method)
  - ja: added explicit custom-rest-routing anchor

### Tutorials & Examples

- [Tutorials & Examples](/tutorials-and-examples)
  - Replaced links to CakePackages and the Bakery with a link to the maintained plugins page
- [Simple Authentication and Authorization Application](/tutorials-and-examples/blog-auth-example/auth)
  - Paths updated to `src/` and `templates/`; removed unneeded `App::uses()` calls; UsersController described as generated by the Bake plugin
  - `posts.user_id` added as `INT UNSIGNED` (integer display width is deprecated in MySQL 8)
- [Blog Tutorial](/tutorials-and-examples/blog/blog)
  - Setup rewritten: `composer create-project pieceofcake2/app blog`, PHP 8.0+, built-in server via `bin/cake server`; removed archive download/git clone steps
  - Paths updated to `config/database.php`, `config/core.php`, `tmp/` and `logs/`; MySQL example uses `utf8mb4`
  - mod_rewrite section replaced by a short "Using Apache" section (DocumentRoot = `webroot/`)
- [Blog Tutorial - Adding a layer](/tutorials-and-examples/blog/part-two)
  - Files placed in `src/Model`, `src/Controller`, `templates/Posts`, `config/routes.php`
  - `view()` and `delete()` take `$id = null` so a missing ID raises NotFoundException instead of an ArgumentCountError on PHP 8
- [Simple Acl controlled Application - part 2](/tutorials-and-examples/simple-acl-controlled-application/part-two)
  - AclExtras installed with Composer (`markstory/acl_extras`, same code as pieceofcake2/acl_extras) into `plugins/AclExtras`, run with `bin/cake AclExtras.AclExtras`
  - Session flash calls replaced with FlashComponent/FlashHelper; complete `login()` action shown
- [Simple Acl controlled Application](/tutorials-and-examples/simple-acl-controlled-application/simple-acl-controlled-application)
  - Setup via `composer create-project pieceofcake2/app acl`, Bake plugin loaded in `config/bootstrap.php`, `bin/cake` commands, modern paths
  - SQL works on MySQL 8: `groups` quoted (reserved word), no integer display widths
  - Passwords hashed with BlowfishPasswordHasher (VARCHAR(255) column) instead of deprecated `AuthComponent::password()`; beforeSave no longer touches a missing password
  - AppController loads FlashComponent/FlashHelper (used by baked controllers); login uses Flash and `Form->create()` with `url`; removed CakePHP 2.0 `allow('*')`

### Plugins

- [Plugins](/plugins)
  - Intro explains PHP 8 compatibility of CakePHP 2 plugins and links to the maintained Piece of Cake 2 forks
- [How To Create Plugins](/plugins/how-to-create-plugins)
  - Plugin paths use plugins/ and templates/Plugin overrides; internal plugin structure and test directories explained; App::uses() kept in plugin code with the reason
  - Bake commands use bin/cake with the Bake plugin; added the missing asset plugin-syntax example; removed flash/ asset folder
  - Publishing: removed plugins.cakephp.org/awesome-cakephp; added a composer.json example (type cakephp-plugin, composer/installers, installer-name)
- [How To Install Plugins](/plugins/how-to-install-plugins)
  - Composer is the primary method (pieceofcake2/debug_kit example, composer/installers and installer-paths for plugins/); manual and Git installs use plugins/ and https URLs
  - Plugins are loaded in config/bootstrap.php; when App::uses() is still needed for plugin classes
  - composer.json installer-paths and allow-plugins (composer/installers, Composer 2.2+) documented as required so plugins land in plugins/&lt;Name>/
- [How To Use Plugins](/plugins/how-to-use-plugins)
  - Plugin loading shown in config/bootstrap.php with plugin Config/ file locations; schema command uses bin/cake

### Contributing

- [Contributing](/contributing)
  - Contributions go to the pieceofcake2/* repositories on GitHub (framework, app skeleton, plugins, docs)
- [Documentation](/contributing/documentation)
  - Docs hosted at pieceofcake2/docs (2.x), Markdown + VitePress, deployed by GitHub Actions, local preview with bin/dev-server.sh; only en/ja maintained; Jenkins, IRC and docs mailing list removed
  - reStructuredText/Sphinx formatting guide replaced by a Markdown/VitePress guide (headings and anchors, links, code blocks, alerts, info/pieceofcake2 containers, includes)
- [Tickets](/contributing/tickets)
  - Issues go to pieceofcake2/* repositories; check CHANGELOG/upgrade guide before reporting; Stack Overflow for questions (IRC and Google Group removed)
  - Security issues reported via GitHub private vulnerability reporting (Security tab, Report a vulnerability) per SECURITY.md; security@cakephp.org removed
- [Code](/contributing/code)
  - Setup: PHP 8.0+, Composer; PHPUnit 9.6, PHP_CodeSniffer and PHPStan installed as dev dependencies; removed PHP 5.3, mcrypt and PHPUnit 3.7 requirements
  - New "Running the Tests" section: copy tests/config/database.php into vendor/pieceofcake2/app/config, select the database with DB, run vendor/bin/phpunit and vendor/bin/phpcs
  - Single maintained branch 2.x; branch from and target upstream/2.x; removed 2.next/4.0 targets and Cake Software Foundation ownership note
- [Coding Standards](/contributing/cakephp-coding-conventions)
  - Rewritten as the CakePHP 5 based standard (cakephp/cakephp-codesniffer ^5.0, PSR-12): 4 spaces, short arrays, trailing commas, braces on own line for classes/methods, elseif, no Yoda, ?? and ?:, visibility on constants, DocBlock rules
  - Added how to install and run phpcs/phpcbf, the CakePHP 2 exclusions of the framework phpcs.xml, the application phpcs.xml from pieceofcake2/app (with legacy layout paths), and a table of differences from the original CakePHP 2 standard
- [Backwards Compatibility Guide](/contributing/backwards-compatibility)
  - Rewritten: what to expect from fork releases (some included breaking changes, e.g. cache engines, directory layout, autoloading), migration guides, guidelines for contributors; upstream semver tables removed
- [CakePHP Development Process](/contributing/cakephp-development-process)
  - Rewritten for the fork's maintenance-only process: goals, single 2.x branch, releases as tags (2.10.24.x, 2.11.0, 2.12.x), CHANGELOG/UPGRADE; IRC and upstream branch model removed

### Appendices

- [Migrating from SimpleTest to PHPUnit 3.7](/appendices/phpunit-migration-hints)
  - Retitled "Migrating from SimpleTest to PHPUnit 3.7" and linked to the new PHPUnit 9.6 guide

### Additional Topics

- [Deployment](/deployment)
  - Document root, core.php and plugin symlink paths use the modern layout
  - Added "composer install --no-dev --optimize-autoloader" and conditional loading of development-only plugins

