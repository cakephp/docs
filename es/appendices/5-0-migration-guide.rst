5.0 Guía de migración
###################

CakePHP 5.0 contiene cambios importantes, y no es compatible con versiones anteriores
de 4.x. Antes de intentar actualizar a la version 5.0, primero actualice a la version 4.5 y resuelva
todas las advertencias de obsolescencia.

Consulte :doc:`/appendices/5-0-upgrade-guide` para obtener instrucciones paso a paso de
como actualizar a la versión 5.0.

Características obsoletas eliminadas
===========================

Todos los métodos, propiedades y funcionalidades que emitían advertencias de obsolencias
a partir de la versión 4.5 se han eliminado.

Cambios importantes
================

Además de la eliminación de características obsoletas, se han realizado
cambios importantes:

Global
------

- Se han añadido declaraciones de tipo a todos los parámetros de función y devoluciones siempre que ha sido posible. Estos
  están pensados para que coincidan con las anotaciones de docblock, pero incluyen correcciones para anotaciones incorrectas.
- Se han añadido declaraciones de tipo a todas las propiedades de clase siempre que ha sido posible. También se han corregido
  algunas anotaciones incorrectas.
- Se han eliminado las constantes ``SECOND``, ``MINUTE``, ``HOUR``, ``DAY``,  ``WEEK``, ``MONTH``, ``YEAR``.
- Las funciones globales son ahora opcionales. Si tu aplicación utiliza alias de funciones globales, asegúrase
  de añadir ``require CAKE . 'functions.php'`` al ``config/bootstrap.php`` de tu aplicación.
- Se ha eliminado el uso de ``#[\AllowDynamicProperties]`` en todas las partes. Se utilizaba para las siguientes clases:
   - ``Command/Command``
   - ``Console/Shell``
   - ``Controller/Component``
   - ``Controller/Controller``
   - ``Mailer/Mailer``
   - ``View/Cell``
   - ``View/Helper``
   - ``View/View``
- Se han actualizado las versiones compatibles del motor de base de datos:
   - MySQL (5.7 o superior)
   - MariaDB (10.1 o superior)
   - PostgreSQL (9.6 o superior)
   - Microsoft SQL Server (2012 o superior)
   - SQLite 3

Auth
----

- `Auth` ha sido eliminado. Usa los plugins `cakephp/authentication <https://book.cakephp.org/authentication/2/es/index.html>`__ y
  `cakephp/authorization <https://book.cakephp.org/authorization/2/es/index.html>`__ en su lugar.

Cache
-----

- El motor ``Wincache`` ha sido eliminado. La extension wincache no es compatible
  con PHP 8.

Consola
-------

- ``BaseCommand::__construct()`` ha sido eliminado.
- Se ha eliminado ``ConsoleIntegrationTestTrait::useCommandRunner()`` porque ya no es necesario.
- ``Shell`` Ha sido eliminado  y debe ser sustituido por `Command <https://book.cakephp.org/5/es/console-commands/commands.html>`__
- Ahora ``BaseCommand`` emite los eventos ``Command.beforeExecute`` and ``Command.afterExecute``
  cuando el método ``execute()`` del comando es invocado por el framework.

Connection
----------

- Se ha elimiando ``Connection::prepare()``. En su lugar, puede utilizar ``Connection::execute()``
  para ejecutar una consulta SQL especificando en la cadena SQL los parámetros y los tipos en una sola llamada.
- Se ha eliminado ``Connection::enableQueryLogging()``. Si no ha habilitado el registro
  a través de la configuración de conexión, puedes configurar más adelante la instancia del registrador para que
  el controlador habilite el registro de consultas ``$connection->getDriver()->setLogger()``.

Controlador
----------

- La firma del método para ``Controller::__construct()`` ha cambiado.
  Por lo tanto, tienes que ajustar el código en consecuencia si estás sobreescribiendo el constructor.
- Después de la carga, los componentes ya no se establecen como propiedades dinámicas. En su lugar
  ``Controller`` usa ``__get()`` para proporcionar acceso a las propiedades de los componentes. Este
  cambio puede afectar a las aplicaciones que usan ``property_exists()`` en los componentes.
- Se ha renombrado la devolución de llamada del evento ``Controller.shutdown`` de los componentes de
  ``shutdown`` a ``afterFilter`` para que coincida con el del controlador. Esto hace que las devoluciones de llamada
  sean más coherentes.
- ``PaginatorComponent`` ha sido eliminado y tienes que reemplazarlo llamando a ``$this->paginate()`` en tu controlador o
  usando ``Cake\Datasource\Paging\NumericPaginator`` directamente.
- ``RequestHandlerComponent`` ha sido eliminado. Consulte la guía `4.4 migration <https://book.cakephp.org/4/es/appendices/4-4-migration-guide.html#requesthandlercomponent>`__ para saber como actualizarlo.
- Se ha eliminado ``SecurityComponent``. Usa ``FormProtectionComponent`` para la protección contra la manipulación de formularios
  o ``HttpsEnforcerMiddleware`` para forzar el uso de solicitudes HTTPS en su lugar.
- ``Controller::paginate()`` ya no acepta opciones de consulta como ``contain`` para su
  argumento ``$settings``. En su lugar debes usar la opción ``finder``
  ``$this->paginate($this->Articles, ['finder' => 'published'])``. O puede
  crear la consulta requerida de antemano y luego pasarla a ``paginate()``
  ``$query = $this->Articles->find()->where(['is_published' => true]); $this->paginate($query);``.

Core
----

- La función ``getTypeName()`` ha sido desechada. En su lugar usa ``get_debug_type()`` de PHP.
- La dependencia de ``league/container`` se actualizó a ``4.x``. Esto requerirá
  la adición de typehints a tus implementaciones de ``ServiceProvider``.
- ``deprecationWarning()`` ahora tiene un parámetro ``$version``.
- La opción de configuración ``App.uploadedFilesAsObjects`` se ha eliminado
  junto con el soporte para arrays con forma carga de archivos PHP en todo el framework.
- ``ClassLoader`` ha sido eliminado. En su lugar, utiliza composer para generar archivos de carga automática.

Base de datos
--------

- ``DateTimeType`` y ``DateType`` ahora siempre devuelven objetos inmutables.
  Además, la interfaz para los objetos ``Date`` refleja la interfaz ``ChronosDate``
  que carece de todos los métodos relacionados con el tiempo que estaban presentes en CakePHP 4.x.
- ``DateType::setLocaleFormat()`` ya no acepta array.
- ``Query`` ahora solo acepta parámetros ``\Closure`` en lugar de ``callable``. Los callables se pueden convertir
  a closures usando la nueva sintaxis de array de primera clase de PHP 8.1.
- ``Query::execute()`` ya no ejecuta los resultados de la devoluciones de llamadas. Debe utilizar ``Query::all()`` en su lugar.
- ``TableSchemaAwareInterface`` fue eliminado.
- ``Driver::quote()`` fue eliminado. En su lugar, utiliza declaraciones preparadas.
- ``Query::orderBy()`` fue añadido para reemplazar ``Query::order()``.
- ``Query::groupBy()`` fue añadido para reemplazar ``Query::group()``.
- ``SqlDialectTrait`` se ha eliminado y toda su funcionalidad se ha movido a la propia clase ``Driver``.
- ``CaseExpression`` ha sido eliminado y debe ser reemplazado por
  ``QueryExpression::case()`` o ``CaseStatementExpression``
- ``Connection::connect()`` ha sido eliminado. Usa
  ``$connection->getDriver()->connect()`` en su lugar.
- ``Connection::disconnect()`` ha sido eliminado. Usa
  ``$connection->getDriver()->disconnect()`` en su lugar.
- ``cake.database.queries`` ha sido añadido como alternativa al scope ``queriesLog``.

Datasource
----------

- El método ``getAccessible()`` ha sido añadido a ``EntityInterface``. Las implementaciones que no son ORM
  tienen que implementar este método ahora.
- El método ``aliasField()`` ha sido añadido a ``RepositoryInterface``. Las implementaciones que no son ORM
  tienen que implementar este método ahora.

Event
-----

- Las cargas útiles de eventos deben ser un array. Otros objetos como ``ArrayAccess`` ya no se convierten en array y ahora lanzarán un ``TypeError``.
- Se recomienda ajustar los handlers de eventos para que sean métodos void y usar ``$event->setResult()`` en lugar de devolver el resultado.

Error
-----

- ``ErrorHandler`` y ``ConsoleErrorHandler`` han sido eliminados. Consulte la guía `4.4 migration <https://book.cakephp.org/4/es/appendices/4-4-migration-guide.html#errorhandler-consoleerrorhandler>`__ para saber como actualizarlo.
- ``ExceptionRenderer`` ha sido eliminado y debe ser reemplazado por ``WebExceptionRenderer``
- ``ErrorLoggerInterface::log()`` ha sido eliminado y debe ser reemplazado por ``ErrorLoggerInterface::logException()``
- ``ErrorLoggerInterface::logMessage()`` ha sido eliminado y debe ser reemplazado por ``ErrorLoggerInterface::logError()``

Filesystem
----------

- El paquete de Filesystem ha eliminado, y la clase ``Filesystem`` se ha movido al paquete de Utility.

Http
----

- ``ServerRequest`` ya no es compatible con ``files`` como arrays. Este
  behavior se ha deshabilitado de forma predeterminada desde la version 4.1.0. Los datos ``files``
  ahora siempre contendrán objetos ``UploadedFileInterfaces``.

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
- ``PluginCollection::addFromConfig()`` has been added to :ref:`simplify plugin loading <loading-a-plugin>`.

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

.. meta::
    :title lang=es: 5.0 Guía de migración
    :keywords lang=es: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
