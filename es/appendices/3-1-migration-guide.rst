Guía de Migración a 3.1
#######################

CakePHP 3.1 es completamente compatible con la versión 3.0. Esta página
contiene los cambios y mejoras hechas en la versión 3.1.

Enrutamiento
============

- La clase por de ruta por defecto ha sido cambiada a ``DashedRoute`` en el repositorio ``cakephp/app``.
  Tu código base actual no se verá afectado por esto, pero es recomendable usar
  esta clase desde ahora en adelante.
- Opciones de prefijos de nombre fueron añadidos a varios métodos del constructor de ruta.
  Ver la sección :ref:`named-routes` para obtener más información.

Consola
=======

- ``Shell::dispatchShell()`` ya no imprimirá el mensaje de bienvenida desde el intérprete
  de comandos emisor.
- La función ayudante ``breakpoint()`` ha sido añadida. Esta función provee
  un *snippet* de código que puede ser puesto en ``eval()`` para disparar una consola
  interactiva. Esta función es muy útil cuando se depuran los casos de prueba, o otros scripts desde
  la línea de comandos interactiva (CLI).
- Las opciones de consola ``--verbose`` y ``--quiet`` ahora controlan stdout/stderr
  como niveles de registros de salida.

Ayudantes agregados para la línea de comandos
---------------------------------------------

- Las aplicaciones de consola ahora pueden crear clases ayudantes que encapsulan bloques de salida
  lógica. Ver la sección :doc:`/console-and-shells/helpers` para mayor información.

RoutesShell
-----------

- RoutesShell ha sido añadido y ahora te permite un uso simple para depurar y testear desde CLI.
  Ver la sección :doc:`/console-and-shells/routes-shell` para más información.

Controlador
===========

- Las siguientes propiedades del Controlador están obsoletas:

  * layout
  * view - reemplazada con ``template``
  * theme
  * autoLayout
  * viewPath - reemplazada con ``templatePath``
  * viewClass - reemplazada con ``className``
  * layoutPath

  En lugar de ajustar estas propiedades en tu controlador, debes ajustarlos
  en la vista usando el método con el nombre de la propiedad::

    // En un controlador, en vez de
    $this->layout = 'avanzado';

    // Debes usar
    $this->viewBuilder()->layout('avanzado');

Estos métodos deben ser llamados después de determinar que clase de vista
será usada para un controlador/acción.

AuthComponent
-------------

- Una nueva opción de configuración ``storage`` ha sido añadida. Contiene el nombre de
  la clase de almacenamiento que ``AuthComponent`` utiliza para almacenar el registro de
  usuario, Por defecto se usa ``SessionStorage``. Si se usa un autenticador sin estado
  debes configurar ``AuthComponent`` para que use ``MemoryStorage`` en su lugar.
- Una nueva opción de configuración ``checkAuthIn`` ha sido añadida. Contiene el nombre del
  evento que la autenticación debe comprobar una vez realizada. Por defecto ``Controller.startup``
  es usado, pero tu puedes ajustar esto en ``Controller.initialize`` si deseas que la autenticación
  compruebe antes del método ``beforeFilter()`` del controlador a ejecutar.
- Las opciones ``scope`` y ``contain`` para las clases autenticadoras están obsoletas.
  En su lugar debes usar la opción ``finder`` para configurar un método localizador personalizado
  y modificar la consulta usada para buscar el usuario allí.
- La lógica para ajustar la variable de sesión ``Auth.redirect``, que se usa para obtener
  la URL de redirección luego de iniciar sesión, ha cambiado. Ahora se establece solo cuando
  se intenta acceder a una URL protegida sin autenticación. Entonces ``Auth::redirectUrl()``
  retornará la URL protegida después de iniciar sesión. Bajo circunstancias normales, cuando un
  usuario accede directamente a la página de inicio de sesión, ``Auth::redirectUrl()`` retornará
  el valor establecido en la configuración ``loginRedirect``.

FlashComponent
--------------

- ``FlashComponent`` ahora apila los mensajes Flash cuando los ajustas con el
  método ``set()`` o ``__call()``. Esto significa que la estructura en *Session* para
  guardar los mensajes Flash ha cambiado.

CsrfComponent
-------------

- El tiempo de expiración de la cookie CSRF ahora se podrá
  ajustar como un valor compatible con ``strtotime()``.
- Los tokens inválidos CSRF ahora arrojarán una excepción
  ``Cake\Network\Exception\InvalidCsrfTokenException`` en vez de
  ``Cake\Network\Exception\ForbiddenException``.

RequestHandlerComponent
-----------------------

- ``RequestHandlerComponent`` ahora intercambia el diseño y la plantilla basado en la extensión
  o la cabecera ``Accept`` en la llamada ``beforeRender()`` en lugar de ``startup()``.
- ``addInputType()`` and ``viewClassMap()`` están obsoletos. En su lugar debes usar
  ``config()`` para modificar estas configuraciones en tiempo de ejecución.
- Cuando ``inputTypeMap`` o ``viewClassMap`` están definidas en el componente de configuraciones,
  *sobrescribirá* los valores por defecto. Este cambio permite
  remover las configuraciones por defecto.

Network
=======

Http\Client
-----------

- El tipo mime por defecto usado para enviar peticiones ha cambiado. Previamente
  usaba siempre ``multipart/form-data``. En la versión 3.1, ``multipart/form-data``
  sólo es usado cuando hay archivos subidos presentes. Cuando no hay archivos subidos,
  ``application/x-www-form-urlencoded`` será usado en su lugar.

ORM
===

Ahora puedes *`Lazily Eager Load Associations`*. Esta característica
te permite cargar asociaciones adicionales de manera condicional dentro del resultado ajustado,
entidad o colección de entidades.

Los métodos ``patchEntity()`` y ``newEntity()`` ahora soportan la opción ``onlyIds``.
Esta opción te permite restringir que las asociaciones *hasMany/belongsToMany* sólo usen
la lista ``_ids``. Esta opción por defecto es ``false``.

Query
-----

- ``Query::notMatching()`` ha sido añadido.
- ``Query::leftJoinWith()`` ha sido añadido.
- ``Query::innerJoinWith()`` ha sido añadido.
- ``Query::select()`` ahora soporta los objetos ``Table`` y ``Association`` como
  parámetros. Estos tipos de parámetros seleccionarán todas las columnas
  de la tabla prevista o en la instancia asociada de la tabla de destino.
- ``Query::distinct()`` ahora acepta una cadena para diferenciar una sola columna.
- ``Table::loadInto()`` ha sido añadido.
- Las funciones nativas SQL ``EXTRACT``, ``DATE_ADD`` y ``DAYOFWEEK`` han sido
  abstraídas a ``extract()``, ``dateAdd()`` y ``dayOfWeek()`` respectivamente.

Vista
=====

- Ahora puedes configurar ``_serialized`` a ``true`` para ``JsonView`` y ``XmlView``
  y así serializar todas las variables en vez de especificar una por una.
- ``View::$viewPath`` está obsoleto. Debes usar ``View::templatePath()``
  en su lugar.
- ``View::$view`` está obsoleto. Debes usar ``View::template()``
  en su lugar.
- ``View::TYPE_VIEW`` está obsoleto. Debes usar ``View::TYPE_TEMPLATE``
  en su lugar.

Helper
======

SessionHelper
-------------

- ``SessionHelper`` está obsoleta. Puedes usar
  ``$this->request->session()`` directamente.

FlashHelper
-----------

- ``FlashHelper`` ahora permite mostrar múltiples mensajes si fueron configuradas
  múltiples mensajes con ``FlashComponent``. Cada mensaje será mostrado en su propio
  elemento. Los mensajes serán mostrados en el orden que fueron configurados.

FormHelper
----------

- Nueva opción ``templateVars`` ha sido añadida. ``templateVars`` permite pasar
  variables adicionales a tu plantilla de control de formulario personalizado.

Email
=====

- Las clases ``Email`` y ``Transport`` han sido movidas bajo el nombre de espacio ``Cake\Mailer``.
  Sus antiguos espacios de nombre aún son utilizables como alias.
- El perfil ``default`` de email es ahora automáticamente ajustado cuando una instancia de ``Email``
  cuando es creada. Este comportamiento es similar a como era en la versión 2.x.

Mailer
------

- La clase ``Mailer`` ha sido añadida. Esta clase ayuda a crear *emails* reusables
  en una aplicación.

I18n
====

Tiempo
------

- ``Time::fromNow()`` ha sido añadido. Este método hace fácil calcular la diferencia
  de tiempo desde 'ahora'.
- ``Time::i18nFormat()`` ahora soporta calendarios no-gregorianos cuando formatea
  fechas.

Validaciones
============

- ``Validation::geoCoordinate()`` ha sido añadido.
- ``Validation::latitude()`` ha sido añadido.
- ``Validation::longitude()`` ha sido añadido.
- ``Validation::isInteger()`` ha sido añadido.
- ``Validation::ascii()`` ha sido añadido.
- ``Validation::utf8()`` ha sido añadido.