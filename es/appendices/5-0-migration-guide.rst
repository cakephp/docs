5.0 Guía de migración
#####################

CakePHP 5.0 contiene cambios importantes, y no es compatible con versiones anteriores
de 4.x. Antes de intentar actualizar a la version 5.0, primero actualice a la version 4.5 y resuelva
todas las advertencias de obsolescencia.

Consulte :doc:`/appendices/5-0-upgrade-guide` para obtener instrucciones paso a paso de
como actualizar a la versión 5.0.

Características obsoletas eliminadas
====================================

Todos los métodos, propiedades y funcionalidades que emitían advertencias de obsolencias
a partir de la versión 4.5 se han eliminado.

Cambios importantes
===================

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
- ``Shell`` Ha sido eliminado y debe ser sustituido por `Command <https://book.cakephp.org/5/es/console-commands/commands.html>`__
- Ahora ``BaseCommand`` emite los eventos ``Command.beforeExecute`` and ``Command.afterExecute``
  cuando el método ``execute()`` del comando es invocado por el framework.

Connection
----------

- Se ha eliminado ``Connection::prepare()``. En su lugar, puede utilizar ``Connection::execute()``
  para ejecutar una consulta SQL especificando en la cadena SQL los parámetros y los tipos en una sola llamada.
- Se ha eliminado ``Connection::enableQueryLogging()``. Si no ha habilitado el registro
  a través de la configuración de conexión, puedes configurar más adelante la instancia del registrador para que
  el controlador habilite el registro de consultas ``$connection->getDriver()->setLogger()``.

Controlador
-----------

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
-------------

- ``DateTimeType`` y ``DateType`` ahora siempre devuelven objetos inmutables.
  Además, la interfaz para los objetos ``Date`` refleja la interfaz ``ChronosDate``
  que carece de todos los métodos relacionados con el tiempo que estaban presentes en CakePHP 4.x.
- ``DateType::setLocaleFormat()`` ya no acepta array.
- ``Query`` ahora solo acepta parámetros ``\Closure`` en lugar de ``callable``. Los callables se pueden convertir
  a closures usando la nueva sintaxis de array de primera clase de PHP 8.1.
- ``Query::execute()`` ya no ejecuta el resultado de la ejeción de la consulta. Debe utilizar ``Query::all()`` en su lugar.
- ``TableSchemaAwareInterface`` fue eliminado.
- ``Driver::quote()`` fue eliminado. En su lugar, utiliza declaraciones preparadas.
- ``Query::orderBy()`` fue añadido para reemplazar ``Query::order()``.
- ``Query::groupBy()`` fue añadido para reemplazar ``Query::group()``.
- ``SqlDialectTrait`` se ha eliminado y toda su funcionalidad se ha movido a la propia clase ``Driver``.
- ``CaseExpression`` ha sido eliminado y debe ser reemplazado por
  ``QueryExpression::case()`` o ``CaseStatementExpression``
- ``Connection::connect()`` ha sido eliminado. Usar ``$connection->getDriver()->connect()`` en su lugar.
- ``Connection::disconnect()`` ha sido eliminado. Usar ``$connection->getDriver()->disconnect()`` en su lugar.
- ``cake.database.queries`` ha sido añadido como alternativa al scope ``queriesLog``.

Datasource
----------

- El método ``getAccessible()`` ha sido añadido a ``EntityInterface``. Las implementaciones que no son ORM
  tienen que implementar este método ahora.
- El método ``aliasField()`` ha sido añadido a ``RepositoryInterface``. Las implementaciones que no son ORM
  tienen que implementar este método ahora.

Eventos
-------

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

- El paquete de Filesystem se ha eliminado, y la clase ``Filesystem`` se ha movido al paquete de Utility.

Http
----

- ``ServerRequest`` ya no es compatible con ``files`` como arrays. Este
  behavior se ha deshabilitado de forma predeterminada desde la version 4.1.0. Los datos ``files``
  ahora siempre contendrán objetos ``UploadedFileInterfaces``.

I18n
----

- Se cambió el nombre de ``FrozenDate`` a `Date` y el de ``FrozenTime`` a `DateTime`.
- ``Time`` ahora extiende de ``Cake\Chronos\ChronosTime`` y. por lo tanto, es inmutable.
- ``Date::parseDateTime()`` ha sido eliminado.
- ``Date::parseTime()`` ha sido eliminado.
- ``Date::setToStringFormat()`` y ``Date::setJsonEncodeFormat()`` ya no aceptan un array.
- ``Date::i18nFormat()`` y ``Date::nice()`` ya no aceptan un parámetro de zona horaria.
- Los archivos de traducción en la carpeta de vendor con prefijo como (``FooBar/Awesome``) ahora tendrán
  ese prefijo en el nombre del archivo de traducción, por ejemplo, ``foo_bar_awesome.po`` para evitar colisiones
  con otro fichero ``awesome.po`` correspondiente con el plugin (``Awesome``).

Log
---

- La configuración del motor de registros ahora utiliza ``null`` en lugar de ``false`` para desactivar los scopes.
  Así que en lugar de ``'scopes' => false`` necesitas usar ``'scopes' => null`` en la configuración de tu log.

Mailer
------

- Se ha eliminado ``Email``. Usar `Mailer <https://book.cakephp.org/5/en/core-libraries/email.html>`__ en su lugar.
- ``cake.mailer`` se ha añadido como alternativa al scope ``email``.

ORM
---

- ``EntityTrait::has()`` ahora devuelve ``true`` cuando existe un atributo y es estable
  en ``null``. En versiones anteriores de CakePHP esto devolvía ``false``.
  Consulte las notas de la version 4.5.0 para saber como adoptar este comportamiento en 4.x.
- ``EntityTrait::extractOriginal()`` ahora devuelve solo los campos existentes, similar a ``extractOriginalChanged()``.
- Ahora se requiere que los argumentos de un `Finder` sean arrays asociativos, como siempre se esperó que fueran.
- ``TranslateBehavior`` ahora tiene como valor predeterminado la estrategia ``ShadowTable``. Si está
  utilizando la estrategia ``Eav`` deberá actualizar la configuración de tu behavior para conservar
  el comportamiento anterior.
- La opción ``allowMultipleNulls`` para la regla ``isUnique`` ahora es true de forma predeterminada,
  coincidiendo con el comportamiento original de 3.x.
- ``Table::query()`` se ha eliminado en favor de funciones específicas de tipo de consulta.
- ``Table::updateQuery()``, ``Table::selectQuery()``, ``Table::insertQuery()``, y
  ``Table::deleteQuery()`` se añadieron y ahora devuelven los nuevos objetos de consulta de tipo específico.
- Se añadieron ``SelectQuery``, ``InsertQuery``, ``UpdateQuery`` y ``DeleteQuery`` que representan
  solo un tipo de consulta y no permiten cambiar entre tipos de consulta, sin llamar a funciones no relacionadas
  con el tipo de consulta especifico.
- ``Table::_initializeSchema()`` ha sido eliminado y debe ser reemplazado llamando a
  ``$this->getSchema()`` dentro del método ``initialize()``.
- ``SaveOptionsBuilder`` ha sido eliminado. En su lugar, utilice un array normal para las opciones.

Enrutamiento
------------

- Los métodos estáticos ``connect()``, ``prefix()``, ``scope()`` y ``plugin()`` del ``Router`` han sido eliminados y
  deben ser reemplazados llamando a sus variantes de método no estáticos a través de la instancia ``RouteBuilder``.
- ``RedirectException`` ha sido eliminado. Usar ``\Cake\Http\Exception\RedirectException`` en su lugar.

TestSuite
---------

- ``TestSuite`` fue eliminado. En su lugar, los usuarios deben usar variables de entorno
  para personalizar la configuración de las pruebas unitarias.
- ``TestListenerTrait`` fue eliminado. PHPUnit dejó de dar soporte a estos listeners.
  Ver documentación :doc:`/appendices/phpunit10`
- ``IntegrationTestTrait::configRequest()`` ahora fusiona la configuración cuando se llama varias
  veces en lugar de reemplazar la configuración actualmente presente.

Validaciones
------------

- ``Validation::isEmpty()`` ya no es compatible con la subida de ficheros en forma
  arrays. El soporte para la subida de ficheros en forma de array también se ha eliminado de
  ``ServerRequest`` por lo que no debería ver esto como un problema fuera de las pruebas.
- Anteriormente, la mayoría de los mensajes de error de validacion de datos eran simplemente ``El valor proporcionado no es válido``.
  Ahora, los mensajes de error de validación de datos están redactados con mayor precisión.
  Por ejemplo, ``El valor proporcionado debe ser mayor o igual que \`5\```.

Vistas
------

- Las opciones de ``ViewBuilder`` ahora son verdaderamente asociativas (string keys).
- ``NumberHelper`` y ``TextHelper`` ya no aceptan la configuración de ``engine``.
- ``ViewBuilder::setHelpers()`` el parámetro  ``$merge`` fue eliminado. Usar ``ViewBuilder::addHelpers()`` en su lugar.
- Dentro ``View::initialize()``, preferentemente usar ``addHelper()`` en lugar de ``loadHelper()``.
  De todas formas, todas las configuraciones de helpers se cargarán después.
- ``View\Widget\FileWidget`` ya no es compatible con la subida de ficheros en forma
  arrays. Esto está alineado con los cambios en ``ServerRequest`` y ``Validation``.
- ``FormHelper`` ya no estable ``autocomplete=off`` en los campos de token CSRF. Esto
  fue una solución para un error de Safari que no es relevante.

Obsolescencias
==============

A continuación se muestra una lista de métodos, propiedades y comportamientos en desuso. Estas
características seguirán funcionando en la versión 5.x y se eliminarán en la versión 6.0.

Base de datos
-------------

- ``Query::order()`` ha quedado obsoleto. Utiliza ``Query::orderBy()`` en su lugar
  ahora que los métodos ``Connection`` ya no son proxy. Esto alinea el nombre de la función
  con la instrucción SQL.
- ``Query::group()`` ha quedado obsoleto. Utiliza ``Query::groupBy()`` en su lugar
  ahora que los métodos ``Connection`` ya no son proxy. Esto alinea el nombre de la función
  con la instrucción SQL.

ORM
---

- Llamar a ``Table::find()`` con opciones de array está obsoleto. Utiliza `named arguments <https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments>`__
  en su lugar. Por ejemplo, en lugar de ``find('all', ['conditions' => $array])`` usar
  ``find('all', conditions: $array)``. De manera similar, para las opciones de finders personalizados, en lugar
  de ``find('list', ['valueField' => 'name'])`` usar ``find('list', valueField: 'name')``
  o varios argumentos como ``find(type: 'list', valueField: 'name', conditions: $array)``.

Nuevas características
======================

Comprobación de tipos mejorada
------------------------------

CakePHP 5 aprovecha la función de sistema de tipos expandidos disponible en PHP 8.1+.
CakePHP también usa ``assert()`` para proporcionar mensajes de error mejorados y una solidez de tipo adicional.
En el modo de producción, puede configurar PHP para que no genere código para ``assert()`` lo que mejora el rendimiento de la aplicación.
Consulte :ref:`symlink-assets` para saber cómo hacerlo.

Colecciones
-----------

- Se añadió ``unique()`` que filtra el valor duplicado especificado por la devolución de llamada proporcionada.
- ``reject()`` ahora soporta una devolución de llamada predeterminada que filtra los valores verdaderos,
  que es el inverso del comportamiento predeterminado de ``filter()``

Core
----

- El método ``services()`` se añadió a ``PluginInterface``.
- ``PluginCollection::addFromConfig()`` se ha añadido a :ref:`simplify plugin loading <loading-a-plugin>`.

Base de datos
-------------

- ``ConnectionManager`` ahora soporta roles de conexión de lectura y escritura. Los roles se pueden configurar
   con claves de ``read`` y ``write`` en la configuración de conexión que anulan la configuración compartida.
- Se añadió ``Query::all()`` que ejecuta devoluciones de llamada del decorador de resultados y devuelve un conjunto de resultados para consultas seleccionadas.
- Se añadió ``Query::comment()`` para agregar un comentario SQL a la consulta ejecutada. Esto facilita la depuración de consultas.
- ``EnumType`` fue añadido para permitir el mapeo entre enumeraciones respaldadas por PHP y una cadena o columna entera.
- ``getMaxAliasLength()`` y ``getConnectionRetries()`` se añadieron a ``DriverInterface``.
- Los drivers compatibles ahora agregan automáticamente el incremento automático solo a las claves primarias enteras denominadas "id"
  en lugar de a todas las claves primarias enteras. Si se establece 'autoIncrement' como false, siempre se deshabilita en todos los drivers compatibles.

Http
----

- Se ha añadido soporte para 'factories interface' `PSR-17 <https://www.php-fig.org/psr/psr-17/>`__.
  Esto permite ``cakephp/http`` proporcionar una implementación de cliente a
  bibliotecas que permiten la resolución automática de interfaces como php-http.
- Se añadieron ``CookieCollection::__get()`` y ``CookieCollection::__isset()`` para añadir
  formas ergonómicas de acceder a las cookies sin excepciones.

ORM
---

Campos de entidad obligatorios
------------------------------

Las entidades tienen una nueva funcionalidad de opt-in que permite hacer que las entidades manejen
propiedades de manera más estricta. El nuevo comportamiento se denomina 'required fields'. Cuando
es habilitado, el acceso a las propiedades que no están definidas en la entidad generará
excepciones. Esto afecta a los siguientes usos::

    $entity->get();
    $entity->has();
    $entity->getOriginal();
    isset($entity->attribute);
    $entity->attribute;

Los campos se consideran definidos si pasan ``array_key_exists``. Esto incluye
valores nulos. Debido a que esta puede ser una característica tediosa de habilitar, se aplazó a
5.0. Nos gustaría recibir cualquier comentario que tenga sobre esta función,
ya que estamos considerando hacer que este sea el comportamiento predeterminado en el futuro.


Typed Finder Parameters
-----------------------

Los finders de las tablas ahora pueden tener argumentos escritos según sea necesario en lugar de un array de opciones.
Por ejemplo, un finder para obtener publicaciones por categoría o usuario::

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

Ahora se pueden escribir como::

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

El finder puede ser llamado como ``find('byCategoryOrUser', userId: $somevar)``.
Incluso puedes incluir los argumentos con nombre especial para establecer cláusulas de consulta.
``find('byCategoryOrUser', userId: $somevar, conditions: ['enabled' => true])``.

Un cambio similar se ha aplicado al método ``RepositoryInterface::get()``::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, [
            'contain' => ['Books'],
            'finder' => 'latest',
        ]);
    }

Ahora se pueden escribir como::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, contain: ['Books'], finder: 'latest');
    }

TestSuite
---------

- Se ha añadido ``IntegrationTestTrait::requestAsJson()`` para establecer encabezados JSON para la siguiente solicitud.

Instalador de plugins
---------------------
- El instalador de plugins se ha actualizado para manejar automáticamente la carga automática de clases para los plugins
  de tu aplicación. Por lo tanto, puedes eliminar el espacio de nombres para las asignaciones de rutas de
  tus plugins del ``composer.json`` y simplemente ejecutar ``composer dumpautoload``.

.. meta::
    :title lang=es: 5.0 Guía de migración
    :keywords lang=es: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
