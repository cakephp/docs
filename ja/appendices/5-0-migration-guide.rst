5.0 移行ガイド
###################

CakePHP 5.0 には、破壊的な変更が含まれており、4.x リリースとの後方互換性はありません。
5.0 にアップグレードする前に、最初に 4.5 にアップグレードし、すべての非推奨警告を解消してください。

5.0 にアップグレードする方法の段階的な手順については、
:doc:`/appendices/5-0-upgrade-guide` を参照してください。

非推奨機能の削除
===========================

4.5 で非推奨の警告を発していたすべてのメソッド、プロパティと機能が削除されました。


破壊的変更
================

非推奨機能の削除に加えて、破壊的変更が行われました。

全体
------

- 全ての関数について、可能な限り、引数や返り値の型が明示されるようになりました。DockBlockに書かれた注釈(annotation)に合致するように意図しましたが、DockBlock側を修正した箇所もあります。
- クラスのpropertyについても同様に型が可能な限り明示されるようになりました。こちらでも注釈を修正した箇所もあります。
- 次の定数が削除されました : ``SECOND``, ``MINUTE``, ``HOUR``, ``DAY``,  ``WEEK``, ``MONTH``, ``YEAR``
- 全ての ``#[\AllowDynamicProperties]`` 指定が削除されました。これは以下のクラスで使用されていました。
   - ``Command/Command``
   - ``Console/Shell``
   - ``Controller/Component``
   - ``Controller/Controller``
   - ``Mailer/Mailer``
   - ``View/Cell``
   - ``View/Helper``
   - ``View/View``
- サポート対象のデータベースエンジンのバージョンが更新されました。
   - MySQL (5.7 以上)
   - MariaDB (10.1 以上)
   - PostgreSQL (9.6 以上)
   - Microsoft SQL Server (2012 以上)
   - SQLite 3 (3.16 以上)

Auth
----

- `Auth` は削除されました。代わりにプラグイン `cakephp/authentication <https://book.cakephp.org/authentication/2/en/index.html>`__ および
  `cakephp/authorization <https://book.cakephp.org/authorization/2/en/index.html>`__ をお使い下さい。

Cache
-----

- ``Wincache`` エンジンは削除されました。wincache拡張は PHP 8 ではサポートされていないため、です。

Collection
----------

- `combine()` は、指定した key path や group path が存在しないまたは null 値の場合に、例外を投げるようになりました。
  この挙動は、 `indexBy()` や `groupBy()` と同じです。

Console
-------

- ``BaseCommand::__construct()`` は削除されました。
- ``ConsoleIntegrationTestTrait::useCommandRunner()`` は、もはや必要無いため削除されました。
- ``Shell`` は削除されました。代わりに `Command <https://book.cakephp.org/5/en/console-commands/commands.html>`__ をお使い下さい。
- ``BaseCommand`` は ``execute()`` メソッドがフレームワークから呼び出される前後に ``Command.beforeExecute`` および
  ``Command.afterExecute`` のイベントを発行するようになりました。

Connection
----------

- ``Connection::prepare()`` は削除されました。これは、SQL文、パラメータ、パラメータ型の情報を渡すことで ``Connection::execute()`` の1回の呼び出しに置き換えることができます。
- ``Connection::enableQueryLogging()`` は削除されました。データベース接続設定においてロギングを有効にしていない場合、 ``$connection->getDriver()->setLogger()`` を呼び出して logger インスタンスを設定することにより、後からロギングを有効にできます。

Controller
----------

- ``Controller::__construct()`` は削除されました。サブクラスでoverrideしていた場合は、コードの調整をお願いします。
- Component は、 Controller の読み込み後に dynamic property として設定されることは無くなりました。代わりに Controller は ``__get()`` を用いて Component へのアクセスを提供します。この変更は、 Component の存在有無を ``property_exists()`` でチェックしているアプリケーションに影響を与えます。
- The components' ``Controller.shutdown`` event callback has been renamed from
  ``shutdown`` to ``afterFilter`` to match the controller one. This makes the callbacks more consistent.
- ``PaginatorComponent`` has been removed and should be replaced by calling ``$this->paginate()`` in your controller or
  using ``Cake\Datasource\Paging\NumericPaginator`` directly
- ``RequestHandlerComponent`` has been removed. See the `4.4 migration <https://book.cakephp.org/4/en/appendices/4-4-migration-guide.html#requesthandlercomponent>`__ guide for how to upgrade
- ``SecurityComponent`` has been removed. Use ``FormProtectionComponent`` for form tampering protection
  or ``HttpsEnforcerMiddleware`` to enforce use of HTTPS for requests instead.
- ``Controller::paginate()`` no longer accepts query options like ``contain`` for
  its ``$settings`` argument. You should instead use the ``finder`` option
  ``$this->paginate($this->Articles, ['finder' => 'published'])``. Or you can
  create required select query before hand and then pass it to ``paginate()``
  ``$query = $this->Articles->find()->where(['is_published' => true]); $this->paginate($query);``.

Core
----

- The function ``getTypeName()`` has been dropped. Use PHP's ``get_debug_type()`` instead.
- The dependency on ``league/container`` was updated to ``4.x``. This will
  require the addition of typehints to your ``ServiceProvider`` implementations.
- ``deprecationWarning()`` now has a ``$version`` parameter.
- The ``App.uploadedFilesAsObjects`` configuration option has been removed
  alongside of support for PHP file upload shaped arrays throughout the
  framework.
- ``ClassLoader`` has been removed. Use composer to generate autoload files instead.

Database
--------

- The ``DateTimeType`` and ``DateType`` now always return immutable objects.
  Additionally the interface for ``Date`` objects reflects the ``ChronosDate``
  interface which lacks all of the time related methods that were present in
  CakePHP 4.x.
- ``DateType::setLocaleFormat()`` no longer accepts an array.
- ``Query`` now accepts only ``\Closure`` parameters instead of ``callable``. Callables can be converted
  to closures using the new first-class array syntax in PHP 8.1.
- ``Query::execute()`` no longer runs results decorator callbacks. You must use ``Query::all()`` instead.
- ``TableSchemaAwareInterface`` was removed.
- ``Driver::quote()`` was removed. Use prepared statements instead.
- ``Query::orderBy()`` was added to replace ``Query::order()``.
- ``Query::groupBy()`` was added to replace ``Query::group()``.
- ``SqlDialectTrait`` has been removed and all its functionality has been moved
  into the ``Driver`` class itself.
- ``CaseExpression`` has been removed and should be replaced with
  ``QueryExpression::case()`` or ``CaseStatementExpression``
- ``Connection::connect()`` has been removed. Use
  ``$connection->getDriver()->connect()`` instead.
- ``Connection::disconnect()`` has been removed. Use
  ``$connection->getDriver()->disconnect()`` instead.
- ``cake.database.queries`` has been added as an alternative to the ``queriesLog`` scope
- The ability to enable/disable ResultSet buffering has been removed. Results are always buffered.

Datasource
----------

- The ``getAccessible()`` method was added to ``EntityInterface``. Non-ORM
  implementations need to implement this method now.
- The ``aliasField()`` method was added to ``RepositoryInterface``. Non-ORM
  implementations need to implement this method now.

Event
-----

- Event payloads must be an array. Other object such as ``ArrayAccess`` are no longer cast to array and will raise a ``TypeError`` now.
- It is recommended to adjust event handlers to be void methods and use ``$event->setResult()`` instead of returning the result

Error
-----

- ``ErrorHandler`` and ``ConsoleErrorHandler`` have been removed. See the `4.4 migration <https://book.cakephp.org/4/en/appendices/4-4-migration-guide.html#errorhandler-consoleerrorhandler>`__ guide for how to upgrade
- ``ExceptionRenderer`` has been removed and should be replaced with ``WebExceptionRenderer``
- ``ErrorLoggerInterface::log()`` has been removed and should be replaced with ``ErrorLoggerInterface::logException()``
- ``ErrorLoggerInterface::logMessage()`` has been removed and should be replaced with ``ErrorLoggerInterface::logError()``

Filesystem
----------

- The Filesystem package was removed, and ``Filesystem`` class was moved to the Utility package.

Http
----

- ``ServerRequest`` is no longer compatible with ``files`` as arrays. This
  behavior has been disabled by default since 4.1.0. The ``files`` data will now
  always contain ``UploadedFileInterfaces`` objects.

I18n
----

- ``FrozenDate`` was renamed to `Date` and ``FrozenTime`` was renamed to `DateTime`.
- ``Time`` now extends ``Cake\Chronos\ChronosTime`` and is therefore immutable.
- ``Date::parseDateTime()`` was removed.
- ``Date::parseTime()`` was removed.
- ``Date::setToStringFormat()`` and ``Date::setJsonEncodeFormat()`` no longer accept an array.
- ``Date::i18nFormat()`` and ``Date::nice()`` no longer accept a timezone parameter.
- Translation files for plugins with vendor prefixed names (``FooBar/Awesome``) will now have that
  prefix in the file name, e.g. ``foo_bar_awesome.po`` to avoid collision with a ``awesome.po`` file
  from a corresponding plugin (``Awesome``).

Log
---

- Log engine config now uses ``null`` instead of ``false`` to disable scopes.
  So instead of ``'scopes' => false`` you need to use ``'scopes' => null`` in your log config.

Mailer
------

- ``Email`` has been removed. Use `Mailer <https://book.cakephp.org/5/en/core-libraries/email.html>`__ instead.
- ``cake.mailer`` has been added as an alternative to the ``email`` scope

ORM
---

- ``EntityTrait::has()`` now returns ``true`` when an attribute exists and is
  set to ``null``. In previous versions of CakePHP this would return ``false``.
  See the release notes for 4.5.0 for how to adopt this behavior in 4.x.
- ``EntityTrait::extractOriginal()`` now returns only existing fields, similar to ``extractOriginalChanged()``.
- Finder arguments are now required to be associative arrays as they were always expected to be.
- ``TranslateBehavior`` now defaults to the ``ShadowTable`` strategy. If you are
  using the ``Eav`` strategy you will need to update your behavior configuration
  to retain the previous behavior.
- ``allowMultipleNulls`` option for ``isUnique`` rule now default to true matching
  the original 3.x behavior.
- ``Table::query()`` has been removed in favor of query-type specific functions.
- ``Table::updateQuery()``, ``Table::selectQuery()``, ``Table::insertQuery()``, and
  ``Table::deleteQuery()``) were added and return the new type-specific query objects below.
- ``SelectQuery``, ``InsertQuery``, ``UpdateQuery`` and ``DeleteQuery`` were added
  which represent only a single type of query and do not allow switching between query types nor
  calling functions unrelated to the specific query type.
- ``Table::_initializeSchema()`` has been removed and should be replaced by calling
  ``$this->getSchema()`` inside the ``initialize()`` method.
- ``SaveOptionsBuilder`` has been removed. Use a normal array for options instead.

Routing
-------

- Static methods ``connect()``, ``prefix()``, ``scope()`` and ``plugin()`` of the ``Router`` have been removed and
  should be replaced by calling their non-static method variants via the ``RouteBuilder`` instance.
- ``RedirectException`` has been removed. Use ``\Cake\Http\Exception\RedirectException`` instead.

TestSuite
---------

- ``TestSuite`` was removed. Users should use environment variables to customize
  unit test settings instead.
- ``TestListenerTrait`` was removed. PHPUnit dropped support for these listeners.
  See :doc:`/appendices/phpunit10`
- ``IntegrationTestTrait::configRequest()`` now merges config when called multiple times
  instead of replacing the currently present config.

Validation
----------

- ``Validation::isEmpty()`` is no longer compatible with file upload shaped
  arrays. Support for PHP file upload arrays has been removed from
  ``ServerRequest`` as well so you should not see this as a problem outside of
  tests.
- Previously, most data validation error messages were simply ``The provided value is invalid``.
  Now, the data validation error messages are worded more precisely.
  For example, ``The provided value must be greater than or equal to \`5\```.

View
----

- ``ViewBuilder`` options are now truly associative (string keys).
- ``NumberHelper`` and ``TextHelper`` no longer accept an ``engine`` config.
- ``ViewBuilder::setHelpers()`` parameter ``$merge`` was removed. Use ``ViewBuilder::addHelpers()`` instead.
- Inside ``View::initialize()``, prefer using ``addHelper()`` instead of ``loadHelper()``.
  All configured helpers will be loaded afterwards, anyway.
- ``View\Widget\FileWidget`` is no longer compatible with PHP file upload shaped
  arrays. This is aligned with ``ServerRequest`` and ``Validation`` changes.
- ``FormHelper`` no longer sets ``autocomplete=off`` on CSRF token fields. This
  was a workaround for a Safari bug that is no longer relevant.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function in 5.x and will be removed in 6.0.

Database
--------

- ``Query::order()`` was deprecated. Use ``Query::orderBy()`` instead now that
  ``Connection`` methods are no longer proxied. This aligns the function name
  with the SQL statement.
- ``Query::group()`` was deprecated. Use ``Query::groupBy()`` instead now that
  ``Connection`` methods are no longer proxied. This aligns the function name
  with the SQL statement.

ORM
---

- Calling ``Table::find()`` with options array is deprecated. Use `named arguments <https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments>`__
  instead. For e.g. instead of ``find('all', ['conditions' => $array])`` use
  ``find('all', conditions: $array)``. Similarly for custom finder options, instead
  of ``find('list', ['valueField' => 'name'])`` use ``find('list', valueField: 'name')``
  or multiple named arguments like ``find(type: 'list', valueField: 'name', conditions: $array)``.

New Features
============

Improved type checking
-----------------------

CakePHP 5 leverages the expanded type system feature available in PHP 8.1+.
CakePHP also uses ``assert()`` to provide improved error messages and additional
type soundness. In production mode, you can configure PHP to not generate
code for ``assert()`` yielding improved application performance. See the
:ref:`symlink-assets` for how to do this.

Collection
----------

- Added ``unique()`` which filters out duplicate value specified by provided callback.
- ``reject()`` now supports a default callback which filters out truthy values which is
  the inverse of the default behavior of ``filter()``

Core
----

- The ``services()`` method was added to ``PluginInterface``.
- ``PluginCollection::addFromConfig()`` has been added to :ref:`プラグインの読み込み <loading-a-plugin>`.

Database
--------

- ``ConnectionManager`` now supports read and write connection roles. Roles can be configured
  with ``read`` and ``write`` keys in the connection config that override the shared config.
- ``Query::all()`` was added which runs result decorator callbacks and returns a result set for select queries.
- ``Query::comment()`` was added to add a SQL comment to the executed query. This makes it easier to debug queries.
- ``EnumType`` was added to allow mapping between PHP backed enums and a string or integer column.
- ``getMaxAliasLength()`` and ``getConnectionRetries()`` were added
  to ``DriverInterface``.
- Supported drivers now automatically add auto-increment only to integer primary keys named "id" instead
  of all integer primary keys. Setting 'autoIncrement' to false always disables on all supported drivers.

Http
----

- Added support for `PSR-17 <https://www.php-fig.org/psr/psr-17/>`__ factories
  interface. This allows ``cakephp/http`` to provide a client implementation to
  libraries that allow automatic interface resolution like php-http.
- Added ``CookieCollection::__get()`` and ``CookieCollection::__isset()`` to add
  ergonomic ways to access cookies without exceptions.

ORM
---

Required Entity Fields
----------------------

Entities have a new opt-in functionality that allows making entities handle
properties more strictly. The new behavior is called 'required fields'. When
enabled, accessing properties that are not defined in the entity will raise
exceptions. This impacts the following usage::

    $entity->get();
    $entity->has();
    $entity->getOriginal();
    isset($entity->attribute);
    $entity->attribute;

Fields are considered defined if they pass ``array_key_exists``. This includes
null values. Because this can be a tedious to enable feature, it was deferred to
5.0. We'd like any feedback you have on this feature as we're considering making
this the default behavior in the future.


Typed Finder Parameters
-----------------------

Table finders can now have typed arguments as required instead of an options array.
For e.g. a finder for fetching posts by category or user::

    public function findByCategoryOrUser(SelectQuery $query, array $options)
    {
        if (isset($options['categoryId'])) {
            $query->where(['category_id' => $options['categoryId']]);
        }
        if (isset($options['userId'])) {
            $query->where(['user_id' => $options['userId']]);
        }

        return $query;
    }

can now be written as::

    public function findByCategoryOrUser(SelectQuery $query, ?int $categoryId = null, ?int $userId = null)
    {
        if ($categoryId) {
            $query->where(['category_id' => $categoryId]);
        }
        if ($userId) {
            $query->where(['user_id' => $userId]);
        }

        return $query;
    }

The finder can then be called as ``find('byCategoryOrUser', userId: $somevar)``.
You can even include the special named arguments for setting query clauses.
``find('byCategoryOrUser', userId: $somevar, conditions: ['enabled' => true])``.

A similar change has been applied to the ``RepositoryInterface::get()`` method::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, [
            'contain' => ['Books'],
            'finder' => 'latest',
        ]);
    }

can now be written as::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, contain: ['Books'], finder: 'latest');
    }

TestSuite
---------

- ``IntegrationTestTrait::requestAsJson()`` has been added to set JSON headers for the next request.

Plugin Installer
----------------
- The plugin installer has been updated to automatically handle class autoloading
  for your app plugins. So you can remove the namespace to path mappings for your
  plugins from your ``composer.json`` and just run ``composer dumpautoload``.
