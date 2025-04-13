Logging
#######

Si bien la configuración de la clase Configure de CakePHP puede ayudarte a ver
lo que está sucediendo en el sistema, hay momentos en los que necesitarás registrar
datos en el disco para averiguar lo que está ocurriendo. Con tecnologías como SOAP, AJAX y API REST,
la depuración puede ser bastante difícil.

Logging también puede ser una forma de averiguar lo que ha estado ocurriendo
en tu aplicación con el tiempo. ¿Qué términos de búsqueda se están utilizando?
¿Qué tipos de errores están viendo mis usuarios? ¿Con qué frecuencia se ejecuta
una consulta en particular?

Logging data in CakePHP is done with the ``log()`` function. It is provided by the
``LogTrait``, which is the common ancestor for many CakePHP classes. If the
context is a CakePHP class (Controller, Component, View,...), you can log your
data.  You can also use ``Log::write()`` directly.  See :ref:`writing-to-logs`.

El registro de datos en CakePHP se realiza con la función "log()". Esta función es proporcionada por el
"LogTrait", que es el ancestro común de muchas clases de CakePHP. Si el contexto es una clase de CakePHP
(Controlador, Componente, Vista, etc.), puedes registrar tus datos. También puedes usar "Log::write()"
directamente. Consulta la sección :ref:`writing-to-logs` para obtener más información.

.. _log-configuration:

Logging Configuration
=====================

La configuración de ``Log`` debe realizarse durante la fase de arranque de tu aplicación.
El archivo **config/app.php** está diseñado precisamente para esto. Puedes definir tantos
``loggers`` como necesite tu aplicación. Los ``loggers`` deben configurarse utilizando la clase
:php:class:`Cake\\Log\\Log`. Un ejemplo sería::

    use Cake\Log\Engine\FileLog;
    use Cake\Log\Log;

    // Nombre de la clase utilizando la constante 'class' del logger.
    Log::setConfig('info', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => ['info'],
        'file' => 'info',
    ]);

    // Nombre de clase corto
    Log::setConfig('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'debug'],
        'file' => 'debug',
    ]);

    // Fully namespaced name.
    Log::setConfig('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

Lo anterior crea tres loggers, llamados ``info``, ``debug`` and ``error``.
Cada uno está configurado para manejar diferentes niveles de mensajes.
También almacenan sus mensajes de registro en archivos separados, de esta manera,
podemos separar los registros de depuración/aviso/información de los errores más graves.
Consulta la sección sobr :ref:`logging-levels` para obtener más información sobre
los diferentes niveles y lo que significan.

Una vez que se crea una configuración, no se puede cambiar. En su lugar, debes eliminar
la configuración y volver a crearla utilizando :php:meth:`Cake\\Log\\Log::drop()` y
:php:meth:`Cake\\Log\\Log::setConfig()`.

También es posible crear loggers proporcionando un cierre (closure). Esto es útil
cuando necesitas un control completo sobre cómo se construye el objeto del logger. El cierre
debe devolver la instancia del logger. Por ejemplo::

    Log::setConfig('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });


Las opciones de configuración también se pueden proporcionar como una cadena :term:`DSN`. Esto es
útil cuando se trabaja con variables de entorno o proveedores :term:`PaaS`::

    Log::setConfig('error', [
        'url' => 'file:///full/path/to/logs/?levels[]=warning&levels[]=error&file=error',
    ]);

.. warning::
    Si no configuras motores de registro (logging), los mensajes de log no se almacenarán.

Registro de Errores y Excepciones
=================================

Los errores y excepciones también pueden registrarse configurando los valores correspondientes en tu archivo **config/app.php**.
Los errores se mostrarán cuando el modo de depuración esté en ``true`` y se registrarán en los archivos de log cuando el modo de depuración esté en ``false``.
Para registrar excepciones no capturadas, configura la opción ``log`` como ``true``.
Consulta ::doc:`/development/configuration` para obtener más información.

.. _writing-to-logs:

Escribiendo en los archivos de Log
===================================

Escribir en los archivos de registro se puede hacer de dos maneras diferentes. La primera es
utilizando el método estático ::php:meth:`Cake\\Log\\Log::write()`::

    Log::write('debug', 'Something did not work');

La segunda opción es utilizar la función de acceso directo ``log()`` disponible en cualquier clase
que utilice el ``LogTrait``. Llamar a``log()`` llamará internamente a``Log::write()``::

    // Ejecutando esto dentro de una clase que utiliza LogTrait
    $this->log('Something did not work!', 'debug');

Todos los ``log`` configurados se escriben secuencialmente cada vez que se llama a
:php:meth:`Cake\\Log\\Log::write()`. Si no has configurado ningún motor de registro,
``log()`` devolverá "false" y no se escribirán mensajes de registro.

Usando marcadores de posición (placeholders) en mensajes
---------------------------------------------------------

Si necesitas registrar datos definidos dinámicamente, puedes utilizar marcadores de posición en tus
mensajes de registro y proporcionar un array de pares clave/valor en el parámetro ``$context``
como sigue::


    // Se registrará `No se pudo procesar para el usuario id = 1`
    Log::write('error', 'No se pudo procesar para el usuario id ={user}', ['user' => $user->id]);

Los marcadores (placeholders) que no tienen claves definidas no serán reemplazados.
Si necesitas utilizar una palabra entre llaves de forma literal, debes escapar el marcador::


    // Se registrará `No {replace}`
    Log::write('error', 'No \\{replace}', ['replace' => 'no']);

Si incluyes objetos en los marcadores, esos objetos deben implementar
uno de los siguientes métodos:

* ``__toString()``
* ``toArray()``
* ``__debugInfo()``

.. _logging-levels:

Usando Niveles
---------------

CakePHP admite el conjunto estándar de niveles de registro POSIX. Cada nivel representa un aumento
en el nivel de gravedad:

* Emergency: el sistema no es utilizable
* Alert: se debe tomar una acción inmediata
* Critical: condiciones críticas
* Error: condiciones de error
* Warning: condiciones de advertencia
* Notice: condiciones normales pero significativas
* Info: mensajes informativos
* Debug:  mensajes de depuración

Puedes hacer referencia a estos niveles por nombre al configurar lo ``loggers`` y al escribir
mensajes de registro. Alternativamente, puedes utilizar métodos de conveniencia como :
:php:meth:`Cake\\Log\\Log::error()` para indicar claramente el nivel de registro.
Utilizar un nivel que no esté en la lista de niveles anteriores resultará en una excepción.

.. note::
    Cuando ``levels`` se establece en un valor vacío en la configuración de un ``logger``,
    aceptará mensajes de cualquier nivel.

.. _logging-scopes:

Ámbitos de Registro (scope)
----------------------------

En muchas ocasiones, querrás configurar diferentes comportamientos de registro para diferentes
subsistemas o partes de tu aplicación. Tomemos como ejemplo una tienda en línea.
Probablemente, quieras manejar el registro de pedidos y pagos de manera diferente a como lo haces
con otros registros menos críticos.

CakePHP expone este concepto como ámbitos de registro. Cuando se escriben mensajes de registro,
puedes incluir un nombre de ámbito ``scope``. Si hay un registrador configurado para ese ámbito,
los mensajes de registro se dirigirán a esos ``loggers``. Por ejemplo::

    use Cake\Log\Engine\FileLog;

    // Configura logs/shops.log para recibir todos los niveles, pero solo aquellos con ``scope``
    // `orders` y `payments`.
    Log::setConfig('shops', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // Configura logs/payments.log para recibir todos los niveles, pero solo aquellos con ``scope``
    // `payments`.
    Log::setConfig('payments', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', ['scope' => ['orders']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['payments']]);

Los ``scopes`` también se pueden pasar como una cadena única o como una matriz indexada numéricamente.
Ten en cuenta que al usar esta forma, se limitará la capacidad de pasar más datos como contexto::

    Log::warning('This is a warning', ['orders']);
    Log::warning('This is a warning', 'payments');

.. note::
   Cuando ``scopes`` se establece como un arreglo vacío o null en la configuración de un ``logger``,
   aceptará mensajes de cualquier ``scope``. Establecerlo como false solo coincidirá con mensajes sin ``scope``.

.. _file-log:

Guardando logs en Archivos
===========================

Como su nombre indica, ``FileLog`` escribe mensajes de registro en archivos. El nivel del mensaje
de registro que se está escribiendo determina el nombre del archivo en el que se almacena el mensaje.
Si no se proporciona un nivel, se utiliza :php:const:`LOG_ERR`, que escribe en el registro de errores.
La ubicación de registro predeterminada es **logs/$level.log**::

    // Es ejecutado asi dentro de una clase CakePHP
    $this->log("Something didn't work!");

    // Se añadirá lo siguiente al archivo logs/error.log.
    // 2007-11-02 10:22:02 Error: Something didn't work!

El directorio configurado debe tener permisos de escritura por el usuario del servidor web para
que el registro funcione correctamente.

Puedes configurar ubicaciones adicionales o alternativas para FileLog al configurar un registrador.
FileLog acepta un "path" que permite utilizar rutas personalizadas::

    Log::setConfig('custom_path', [
        'className' => 'File',
        'path' => '/path/to/custom/place/'
    ]);

El motor de ``FileLog`` toma las siguientes opciones:

* ``size`` Se utiliza para implementar una rotación básica de archivos de registro. Si el tamaño
   del archivo de registro alcanza el tamaño especificado, el archivo existente se renombra agregando
   una marca de tiempo al nombre de archivo y se crea un nuevo archivo de registro. Puede ser un valor
   entero en bytes o valores como '10MB', '100KB', etc. El valor predeterminado es 10MB.
* ``rotate`` Los archivos de registro se rotan un número especificado de veces antes de ser eliminados.
  Si el valor es 0, se eliminan las versiones antiguas en lugar de rotarlas. El valor predeterminado es 10.
* ``mask`` Establece los permisos de archivo para los archivos creados. Si se deja vacío, se utilizan
   los permisos predeterminados.

.. note::

    Los directorios faltantes se crearán automáticamente para evitar errores innecesarios
    cuando se utiliza FileEngine.

.. _syslog-log:

Guardando logs en Syslog
=========================

En entornos de producción, se recomienda encarecidamente configurar tu sistema para utilizar el
syslog en lugar del guardar los logs en archivos. Esto mejorará el rendimiento, ya que cualquier
escritura se realizará de manera (casi) no bloqueante y el ``logger`` del sistema operativo se
puede configurar de forma independiente para rotar archivos, preprocesar escrituras o
utilizar un almacenamiento completamente diferente para tus registros.

Usar syslog es prácticamente como usar el motor de registro de archivos predeterminado, simplemente
necesitas especificar ``Syslog`` como el motor a utilizar para el registro de logs. El siguiente
fragmento de configuración reemplazará el ``logger`` predeterminado con syslog, esto se debe hacer
en el archivo **config/bootstrap.php**::

    Log::setConfig('default', [
        'engine' => 'Syslog'
    ]);

El arreglo de configuración aceptado para el motor de registro Syslog comprende
las siguientes claves:

* ``format``: Una cadena de plantilla sprintf con dos marcadores de posición (placeholdes),
  el primero para el nivel de error y el segundo para el mensaje en sí. Esta clave es
  útil para agregar información adicional sobre el servidor o el proceso en el mensaje
  registrado. Por ejemplo: ``%s -Servidor web 1  - %s`` se verá como
  ``error - Servidor web 1 - Ocurrió un error en esta solicitud`` después de reemplazar
  los placeholders. Esta opción está obsoleta. Deberías usar :ref:`logging-formatters` en su lugar.
* ``prefix``: Una cadena que se utilizará como prefijo para cada mensaje registrado.
* ``flag``: Una bandera tipo ``int`` que se usará para abrir la conexión al registro,
   por defecto se usará ``LOG_ODELAY```. Consulta la documentación de ``openlog`` para ver más opciones.
* ``facility``: El espacio de registro a utilizar en syslog. Por defecto se utiliza ``LOG_USER``.
   Consulta la documentación de ``syslog`` para ver más opciones.

Creación de Motores de Logs
=================================

Los motores de registro pueden formar parte de tu aplicación o de plugins. Por ejemplo,
si tuvieras un registro en base de datos llamado ``DatabaseLog``, como parte de tu aplicación
se colocaría en **src/Log/Engine/DatabaseLog.php**. Como parte de un plugin se colocaría en
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. Para configurar el motor de registro,
debes usar :php:meth:`Cake\\Log\\Log::setConfig()`. Por ejemplo, la configuración de nuestro
DatabaseLog se vería así::

    // Para src/Log
    Log::setConfig('otherFile', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // Para el plugin llamado LoggingPack
    Log::setConfig('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

Al configurar un motor de registro, el parámetro ``className`` se utiliza para localizar
y cargar el controlador de registro. Todas las demás propiedades de configuración se pasan
al constructor del motor de registro como un array.::

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct(array $config = [])
        {
            parent::__construct($config);
            // ...
        }

        public function log($level, string $message, array $context = [])
        {
            // Write to the database.
        }
    }

CakePHP requiere que todos los motores de registro implementen Psr\Log\LoggerInterface.
La clase :php:class:`Cake\Log\Engine\BaseLog` es una forma sencilla de cumplir con la interfaz,
ya que solo requiere que implementes el método log().

.. _logging-formatters:


Formateadores de Logs
---------------------------
Los formateadores de registro te permiten controlar cómo se formatean los mensajes de registro
de forma independiente al motor de almacenamiento. Cada motor de registro proporcionado por
defecto viene con un formateador configurado para mantener una salida compatible con versiones
anteriores. Sin embargo, puedes ajustar los formateadores para satisfacer tus requisitos.
Los formateadores se configuran junto al motor de registro::

    use Cake\Log\Engine\SyslogLog;
    use App\Log\Formatter\CustomFormatter;

    // Configuración de formato simple sin opciones.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => CustomFormatter::class,
    ]);

    // Configurar un formateador con algunas opciones.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => [
            'className' => CustomFormatter::class,
            'key' => 'value',
        ],
    ]);


Para implementar tu propio formateador de registro, necesitas extender
``Cake\Log\Format\AbstractFormatter`` o una de sus subclases. El método principal que
debes implementar es ``format($level, $message, $context)`` que es responsable de
formatear los mensajes de log.


Log API
=======

.. php:namespace:: Cake\Log

.. php:class:: Log

Una clase sencilla para escribir logs.

.. php:staticmethod:: setConfig($key, $config)

    :param string $name: Nombre para el registro al que se está conectando, utilizado para
        eliminar un registro más adelante.
    :param array $config: Arreglo de configuración y argumentos del constructor para el ``logger``.

    Devuelve o establece la configuración de un ``logger``. Para mas información ver :ref:`log-configuration`.

.. php:staticmethod:: configured()

    :returns: Arreglo de los ``loggers`` configurados

    Devuelve los nombres de los ``loggers`` configurados.

.. php:staticmethod:: drop($name)

    :param string $name: Nombre del ``logger`` del que ya no deseas recibir mensajes.

.. php:staticmethod:: write($level, $message, $scope = [])

    Escribe un mensaje en todos los ``loggers`` configurados
    ``$level`` indica el nivel del mensaje de registro que se está creando.
    ``$message`` es el mensaje de la entrada del registro que se está escribiendo.
    ``$scope`` es el(los) ámbito(s) en el que se está creando un mensaje de registro.

.. php:staticmethod:: levels()


Llama a este método sin argumentos, por ejemplo: `Log::levels()` para obtener
la configuración actual del nivel.


Métodos de conveniencia
------------------------

Se agregaron los siguientes métodos útiles para registrar `$message` con el nivel
de registro apropiado.

.. php:staticmethod:: emergency($message, $scope = [])
.. php:staticmethod:: alert($message, $scope = [])
.. php:staticmethod:: critical($message, $scope = [])
.. php:staticmethod:: error($message, $scope = [])
.. php:staticmethod:: warning($message, $scope = [])
.. php:staticmethod:: notice($message, $scope = [])
.. php:staticmethod:: info($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])

Logging Trait
==============

.. php:trait:: LogTrait

    Un ``trait`` que proporciona métodos abreviados para el registro de mensajes.

.. php:method:: log($msg, $level = LOG_ERR)

    Agregar un mensaje al log. De forma predeterminada, los mensajes se registran
    como mensajes de ERROR.


Usando Monolog
================

Monolog es una librería de logging popular en PHP. Dado que implementa las mismas interfaces
que los ``loggers`` de CakePHP, puedes usarlos en tu aplicación como el ``logger`` predeterminado.

Una vez instalado Monolog utilizando composer, configura el ``logger`` usando el método
``Log::setConfig()``::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
        $log = new Logger('app');
        $log->pushHandler(new StreamHandler('ruta/a/tu/combined.log'));

        return $log;
    });

    // Opcionalmente deja de usar los ``loggers`` predeterminados que ahora son redundantes.
    Log::drop('debug');
    Log::drop('error');

Utiliza métodos similares si deseas configurar un ``logger`` diferente para tu consola::

    // config/bootstrap_cli.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('ruta/a/tu/combined-cli.log'));

        return $log;
    });

    // Opcionalmente deja de usar los ``logger`` predeterminados redundantes para la línea de comando.
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

   Cuando uses un ``logger`` específico para la consola, asegúrate de configurar condicionalmente tu ``logger`` de aplicación.
   Esto evitará entradas de registro duplicadas.

.. meta::
    :title lang=es: Logging
    :description lang=en: Registra datos de CakePHP a disco para ayudar a depurar la aplicación a lo largo de largos períodos de tiempo
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs, bitácora de eventos, registro de datos, registro, depuración
