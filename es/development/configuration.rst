Configuración
#############

Aunque las convenciones eliminan la necesidad de configurar todas las partes de CakePHP,
todavía necesitarás configurar algunas cosas, como las credenciales de tu base de datos.

Además, existen opciones de configuración opcionales que te permiten cambiar los valores
y las implementaciones predeterminadas por otros personalizados para tu aplicación.

.. index:: app.php, app_local.example.php

.. index:: configuration

Configurando tu Aplicación
============================

La configuración generalmente se almacena en archivos PHP o INI, y se carga durante el inicio
de la aplicación. CakePHP viene con un archivo de configuración por defecto, pero si es necesario,
puedes agregar archivos de configuración adicionales y cargarlos en el código de inicio de tu
aplicación. La clase :php:class:`Cake\\Core\\Configure` se utiliza para la configuración global,
y clases como ``Cache`` proporcionan métodos como ``setConfig()`` para hacer que la configuración
sea simple y transparente.

El esqueleto de la aplicación incluye un archivo **config/app.php** que debería contener configuraciones
que no varían en los diversos entornos en los que se despliega tu aplicación. El archivo **config/app_local.php**
debería contener datos de configuración que varían entre los entornos y deben ser gestionados por
herramientas de gestión de configuración o tus herramientas de implementación. Ambos archivos hacen
referencia a variables de entorno a través de la función ``env()`` que permite establecer valores
de configuración a través del entorno del servidor.

Cargar Archivos de Configuración Adicionales
---------------------------------------------

Si tu aplicación tiene muchas opciones de configuración, puede ser útil dividir la configuración
en varios archivos. Después de crear cada uno de los archivos en tu directorio **config/**, puedes
cargarlos en **bootstrap.php**::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::setConfig('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

.. _environment-variables:

Variables de Entorno
=====================

Muchos proveedores de servicios en la nube modernos, como Heroku, te permiten definir variables de
entorno para datos de configuración. Puedes configurar tu aplicación CakePHP a través de variables
de entorno en el estilo de aplicación `12factor <https://12factor.net/>`. Las variables de entorno
permiten que tu aplicación sea fácil de gestionar cuando se implementa en varios entornos.

Como puedes ver en tu archivo **app.php**, la función ``env()`` se utiliza para leer la configuración
del entorno y construir la configuración de la aplicación. CakePHP utiliza cadenas de conexión :term:`DSN`
para bases de datos, registros, transportes de correo electrónico y configuraciones de caché, lo que
te permite variar fácilmente estas bibliotecas en cada entorno.

Para el desarrollo local, CakePHP utiliza `dotenv <https://github.com/josegonzalez/php-dotenv>`_ para
recargar automáticamente las variables de entorno locales. Utiliza Composer para requerir esta biblioteca
y luego hay un bloque de código en ``bootstrap.php`` que debe descomentarse para aprovecharla.

Encontrarás un archivo ``config/.env.example`` en tu aplicación. Al copiar este archivo en ``config/.env``
y personalizar los valores, puedes configurar tu aplicación.

Debes evitar incluir el archivo ``config/.env`` en tu repositorio y, en su lugar, utilizar
``config/.env.example`` como una plantilla con valores predeterminados para que todos
en tu equipo sepan qué variables de entorno se están utilizando y qué debe ir en cada una.

Una vez que se hayan establecido tus variables de entorno, puedes usar ``env()`` para leer datos del entorno::

    $debug = env('APP_DEBUG', false);

El segundo valor pasado a la función env es el valor predeterminado. Este valor se utilizará si no existe una
variable de entorno para la clave dada.

.. _general-configuration:

Configuración General
----------------------

A continuación se muestra una descripción de las variables y cómo afectan a tu aplicación CakePHP.

- **debug**
  Cambia la salida de depuración de CakePHP. ``false`` = Modo de producción. No se muestran mensajes de error o advertencias. ``true`` = Se muestran errores y advertencias.

- **App.namespace**
  El espacio de nombres para encontrar las clases de la aplicación.

  .. note::

      Al cambiar el espacio de nombres en tu configuración, también deberás actualizar tu archivo **composer.json** para usar este espacio de nombres. Además, crea un nuevo autoloader ejecutando ``php composer.phar dumpautoload``.

- **App.baseUrl**
  Descomenta esta definición si **no** planeas usar mod_rewrite de Apache con CakePHP. No olvides eliminar tus archivos .htaccess también.

- **App.base**
  El directorio base en el que reside la aplicación. Si es ``false``, se detectará automáticamente. Si no es ``false``, asegúrate de que tu cadena comience con un `/` y **NO** termine con un `/`. Por ejemplo, `/basedir` es un valor válido para App.base.

- **App.encoding**
  Define qué codificación utiliza tu aplicación. Esta codificación se utiliza para definir la codificación en las vistas y codificar entidades. Debería coincidir con los valores de codificación especificados para tu base de datos.

- **App.webroot**
  El directorio webroot.

- **App.wwwRoot**
  La ruta de archivo al directorio webroot.

- **App.fullBaseUrl**
  El nombre de dominio completamente cualificado (incluyendo el protocolo) hasta la raíz de tu aplicación. Se utiliza al generar URLs absolutas. Por defecto, este valor se genera utilizando la variable ``$_SERVER`` del entorno. Sin embargo, debes definirlo manualmente para optimizar el rendimiento o si te preocupa que las personas manipulen el encabezado "Host". En un contexto CLI (desde la línea de comandos), el `fullBaseUrl` no se puede leer de $_SERVER, ya que no hay un servidor web involucrado. Debes especificarlo tú mismo si necesitas generar URLs desde una terminal (por ejemplo, al enviar correos electrónicos).

- **App.imageBaseUrl**
  Ruta web al directorio público de imágenes dentro del webroot. Si estás utilizando un :term:`CDN`, debes configurar este valor con la ubicación del CDN.

- **App.cssBaseUrl**
  Ruta web al directorio público de CSS dentro del webroot. Si estás utilizando un :term:`CDN`, debes configurar este valor con la ubicación del CDN.

- **App.jsBaseUrl**
  Ruta web al directorio público de JavaScript dentro del webroot. Si estás utilizando un :term:`CDN`, debes configurar este valor con la ubicación del CDN.

- **App.paths**
  Configura rutas para recursos que no son de clase. Admite las subclaves ``plugins``, ``templates``, ``locales``, que permiten la definición de rutas para los archivos de plugins, plantillas de vista y archivos de traducción, respectivamente.

- **App.uploadedFilesAsObjects**
  Define si los archivos cargados se representan como objetos (``true``) o como arrays (``false``). Esta opción está habilitada de forma predeterminada. Consulta la sección :ref:`File Uploads <request-file-uploads>` en el capítulo de Objetos de Request & Response para obtener más información.

- **Security.salt**
  Una cadena aleatoria utilizada en el cifrado. Esta cadena también se utiliza como la sal de HMAC al hacer cifrado simétrico.

- **Asset.timestamp**
  Añade una marca de tiempo, que es la última vez que se modificó el archivo en particular, al final de las URLs de los archivos de activos (CSS, JavaScript, Imagen) cuando se utilizan los ayudantes adecuados. Valores válidos:

  - (bool) ``false`` - No hace nada (predeterminado)
  - (bool) ``true`` - Añade la marca de tiempo cuando el modo de depuración es ``true``
  - (string) 'force' - Siempre añade la marca de tiempo.

- **Asset.cacheTime**
  Establece el tiempo de caché del archivo de activo. Esto determina el encabezado ``Cache-Control``, ``max-age`` y el tiempo de ``Expire`` del encabezado de HTTP para los activos. Esto puede tomar cualquier valor que la función `strtotime <https://php.net/manual/es/function.strtotime.php>`_ tu versión de PHP pueda tomar. El valor predeterminado es ``+1 día``.

Usar un CDN
-----------

Para utilizar un CDN para cargar tus activos estáticos, cambia las variables ``App.imageBaseUrl``, ``App.cssBaseUrl``, ``App.jsBaseUrl`` para que apunten a la URI del CDN, por ejemplo: ``https://micdn.ejemplo.com/`` (nota la barra diagonal al final ``/``).

Todas las imágenes, scripts y estilos cargados a través de HtmlHelper agregarán la ruta absoluta del CDN, coincidiendo con la misma ruta relativa utilizada en la aplicación. Ten en cuenta que hay un caso de uso específico cuando se utilizan activos basados en plugins: los plugins no utilizarán el prefijo del plugin cuando se utiliza una URI absoluta ``...BaseUrl``, por ejemplo, por defecto:

* ``$this->Helper->assetUrl('TestPlugin.logo.png')`` resuelve a ``test_plugin/logo.png``

Si configuras ``App.imageBaseUrl`` como ``https://micdn.ejemplo.com/``:

* ``$this->Helper->assetUrl('TestPlugin.logo.png')`` se resuelve a ``https://micdn.ejemplo.com/logo.png``.

Configuración de la Base de Datos
---------------------------------

Consulta la :ref:`Configuración de la Base de Datos <database-configuration>` para obtener información sobre cómo configurar las conexiones a tu base de datos.

Configuración de Caché
-----------------------

Consulta la :ref:`Configuración de Caché <cache-configuration>` para obtener información sobre cómo configurar la caché en CakePHP.

Configuración de Manejo de Errores y Excepciones
------------------------------------------------

Consulta la :ref:`Configuración de Errores y Excepciones <error-configuration>` para obtener información sobre cómo configurar los manejadores de errores y excepciones.

Configuración de Registro (Logs)
--------------------------------

Consulta la :ref:`Configuración de Registro <log-configuration>` para obtener información sobre cómo configurar el registro (logs) en CakePHP.

Configuración de Correo Electrónico
------------------------------------

Consulta la :ref:`Configuración de Correo Electrónico <email-configuration>` para obtener información sobre cómo configurar preajustes de correo electrónico en CakePHP.

Configuración de Sesión
------------------------

Consulta la :ref:`Configuración de Sesión <session-configuration>` para obtener información sobre cómo configurar el manejo de sesiones en CakePHP.

Configuración de Enrutamiento
------------------------------

Consulta la :ref:`Configuración de Rutas <routes-configuration>` para obtener más información sobre cómo configurar el enrutamiento y crear rutas para tu aplicación.

.. _additional-class-paths:

Rutas de Clases Adicionales
============================

Las rutas de clases adicionales se configuran a través de los cargadores automáticos que utiliza tu aplicación. Cuando utilizas `composer` para generar tu cargador automático, puedes hacer lo siguiente para proporcionar rutas alternativas para los controladores en tu aplicación::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/ruta/a/directorio/con/carpetas/de/controladores/",
            "App\\": "src/"
        }
    }

El ejemplo anterior establecería rutas para los espacios de nombres `App` y `App\Controller`. Se buscará la primera clave y, si esa ruta no contiene la clase/archivo, se buscará la segunda clave. También puedes asignar un solo espacio de nombres a múltiples directorios de la siguiente manera::

    "autoload": {
        "psr-4": {
            "App\\": ["src/", "/ruta/a/directorio/"]
        }
    }

Rutas de Plugins, Plantillas de Vista y Localizaciones
-----------------------------------------------------------

Dado que los plugins, las plantillas de vista y las localizaciones no son clases, no pueden tener un cargador automático configurado. CakePHP proporciona tres variables de configuración para establecer rutas adicionales para estos recursos. En tu **config/app.php**, puedes configurar estas variables::

    return [
        // Otras configuraciones
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/ruta/a/otros/plugins/',
                ],
                'templates' => [
                    ROOT . DS . 'templates' . DS,
                    ROOT . DS . 'templates2' . DS,
                ],
                'locales' => [
                    ROOT . DS . 'resources' . DS . 'locales' . DS,
                ],
            ],
        ],
    ]

Las rutas deben terminar con un separador de directorio, o no funcionarán correctamente.

Configuración de Inflexión
==============================

Consulta la documentación de :ref:`inflection-configuration` para obtener más información.

Clase Configure
===================

.. php:namespace:: Cake\Core

.. php:class:: Configure

La clase Configure de CakePHP se puede utilizar para almacenar y recuperar valores específicos de la aplicación o en
tiempo de ejecución. Sin embargo, debes tener cuidado, ya que esta clase te permite almacenar cualquier cosa y usarla
en cualquier parte de tu código, lo que puede ser una tentación para romper el patrón MVC para el que CakePHP fue diseñado.
El principal objetivo de la clase Configure es mantener variables centralizadas que puedan compartirse entre varios objetos.
Recuerda intentar seguir el principio "convención sobre configuración" para no terminar rompiendo la estructura MVC que
CakePHP proporciona.

Escritura de Datos de Configuración
-----------------------------------

.. php:staticmethod:: write($clave, $valor)

Utiliza ``write()`` para almacenar datos en la configuración de la aplicación::

    Configure::write('Company.name', 'Pizza, Inc.');
    Configure::write('Company.slogan', 'Pizza for your body and soul');

.. note::

    La :term:`notación de punto` utilizada en el parámetro ``$clave`` se puede utilizar para organizar tus configuraciones en grupos lógicos.

El ejemplo anterior también se podría escribir en una sola llamada::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

Puedes utilizar ``Configure::write('debug', $boolean)`` para alternar entre los modos de depuración y producción sobre la marcha.

.. note::

    Cualquier cambio en la configuración realizado mediante ``Configure::write()`` se mantiene en memoria y no persistirá entre solicitudes.

Lectura de Datos de Configuración
---------------------------------

.. php:staticmethod:: read($clave = null, $predeterminado = null)

Se utiliza para leer datos de configuración de la aplicación. Si se proporciona una clave, se devolverán los datos. Usando nuestros ejemplos anteriores de ``write()``, podemos leer esos datos de la siguiente manera::

    # Devuelve 'Pizza, Inc.'
    Configure::read('Company.name');

    # Devuelve 'Pizza for your body and soul'
    Configure::read('Company.slogan');

    Configure::read('Company');
    # Devuelve:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

    # Devuelve 'fallback' ya que Company.nope no está definido.
    Configure::read('Company.nope', 'fallback');

Si se deja el parámetro ``$clave`` como nulo, se devolverán todos los valores en Configure.

.. php:staticmethod:: readOrFail($clave)

Lee datos de configuración igual que :meth:`Cake\\Core\\Configure::read`, pero espera encontrar un par clave/valor. Si el par solicitado no existe, se lanzará una :class:`RuntimeException`.

    Configure::readOrFail('Company.name');    # Devuelve: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  # Lanzará una excepción

    Configure::readOrFail('Company');

    # Devuelve:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

Comprobación para ver si los Datos de Configuración están Definidos
--------------------------------------------------------------------

.. php:staticmethod:: check($clave)

Se utiliza para comprobar si una clave/ruta existe y tiene un valor distinto de nulo::

    $existe = Configure::check('Company.name');

Eliminación de Datos de Configuración
-------------------------------------

.. php:staticmethod:: delete($clave)

Se utiliza para eliminar información de la configuración de la aplicación::

    Configure::delete('Company.name');

Lectura y Eliminación de Datos de Configuración
------------------------------------------------

.. php:staticmethod:: consume($clave)

Lee y elimina una clave de Configure. Esto es útil cuando deseas combinar la lectura y eliminación de valores en una sola operación.

.. php:staticmethod:: consumeOrFail($clave)

Consume datos de configuración de la misma manera que :meth:`Cake\\Core\\Configure::consume`, pero espera encontrar un par clave/valor. Si el par solicitado no existe, se lanzará una :class:`RuntimeException`.

    Configure::consumeOrFail('Company.name');    # Devuelve: 'Pizza, Inc.'
    Configure::consumeOrFail('Company.geolocation');  # Lanzará una excepción

    Configure::consumeOrFail('Company');

    # Devuelve:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul']

Lectura y Escritura de Archivos de Configuración
------------------------------------------------

.. php:staticmethod:: setConfig($nombre, $motor)

CakePHP viene con dos motores de archivos de configuración integrados.
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` es capaz de leer archivos
de configuración PHP, en el mismo formato que Configure ha leído históricamente.
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` es capaz de leer archivos
de configuración ini. Consulta la `documentación de PHP <https://php.net/parse_ini_file>`_ para
obtener más información sobre los detalles de los archivos ini. Para utilizar un
motor de configuración central, debes adjuntarlo a Configure utilizando :php::meth:`Configure::config()`::

    use Cake\Core\Configure\Engine\PhpConfig;

    # Leer archivos de configuración desde config
    Configure::config('default', new PhpConfig());

    # Leer archivos de configuración desde otra ruta.
    Configure::config('default', new PhpConfig('/ruta/a/tus/archivos/de/configuración/'));

Puedes tener varios motores adjuntos a Configure, cada uno leyendo diferentes tipos o fuentes de archivos de configuración. Puedes interactuar con los motores adjuntos usando los métodos definidos en Configure. Para verificar qué alias de motor están adjuntos, puedes usar :meth:`Configure::configured()`::

    # Obtén el array de alias para los motores adjuntos.
    Configure::configured();

    # Comprueba si un motor específico está adjunto
    Configure::configured('default');

.. php:staticmethod:: drop($nombre)

También puedes eliminar motores adjuntos. ``Configure::drop('default')`` eliminaría el alias del motor predeterminado. Cualquier intento futuro de cargar archivos de configuración con ese motor fallaría::

    Configure::drop('default');

Carga de Archivos de Configuración
----------------------------------

.. php:staticmethod:: load($clave, $config = 'default', $merge = true)

Una vez que hayas adjuntado un motor de configuración a Configure, puedes cargar archivos de configuración::

    # Cargar my_file.php usando el objeto de motor 'default'.
    Configure::load('my_file', 'default');

Los archivos de configuración cargados fusionan sus datos con la configuración en tiempo de ejecución existente en Configure. Esto te permite sobrescribir y agregar nuevos valores a la configuración en tiempo de ejecución existente. Al establecer ``$merge`` en ``true``, los valores nunca sobrescribirán la configuración existente.

.. warning::
    Al fusionar archivos de configuración con `$merge = true`, la notación de puntos en las claves no se expande::

        # config1.php
        'Clave1' => [
            'Clave2' => [
                'Clave3' => ['ClaveAnidada1' => 'Valor'],
            ],
        ],

        # config2.php
        'Clave1.Clave2' => [
            'Clave3' => ['ClaveAnidada2' => 'Valor2'],
        ]

        Configure::load('config1', 'default');
        Configure::load('config2', 'default', true);

        # Ahora Clave1.Clave2.Clave3 tiene el valor ['ClaveAnidada2' => 'Valor2']
        # en lugar de ['ClaveAnidada1' => 'Valor', 'ClaveAnidada2' => 'Valor2']

Creación o Modificación de Archivos de Configuración
-----------------------------------------------------

.. php:staticmethod:: dump($clave, $config = 'default', $claves = [])

Vuelca todos o algunos de los datos en Configure en un archivo o sistema de almacenamiento compatible con un motor de configuración. El formato de serialización lo decide el motor de configuración adjunto como $config. Por ejemplo, si el motor 'default' es una :class:`Cake\\Core\\Configure\\Engine\\PhpConfig`, el archivo generado será un archivo de configuración PHP que se puede cargar mediante el :class:`Cake\\Core\\Configure\\Engine\\PhpConfig`

Dado que el motor 'default' es una instancia de PhpConfig. Guarda todos los datos en Configure en el archivo `mi_configuracion.php`::

    Configure::dump('mi_configuracion', 'default');

Guarda solo la configuración de manejo de errores::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` se puede utilizar para modificar o sobrescribir archivos de configuración que se pueden leer con :meth:`Configure::load()`

Almacenamiento de Configuración en Tiempo de Ejecución
------------------------------------------------------

.. php:staticmethod:: store($nombre, $configuracionCache = 'default', $datos = null)

También puedes almacenar valores de configuración en tiempo de ejecución para usarlos en solicitudes futuras. Dado que configure solo recuerda valores para la solicitud actual, deberás almacenar cualquier información de configuración modificada si deseas usarla en solicitudes posteriores::

    # Almacena la configuración actual en la clave 'usuario_1234' en la caché 'default'.
    Configure::store('usuario_1234', 'default');

Los datos de configuración almacenados persisten en la configuración de caché con el nombre especificado. Consulta la documentación sobre :doc:`/core-libraries/caching` para obtener más información sobre el almacenamiento en caché.

Restauración de Configuración en Tiempo de Ejecución
-----------------------------------------------------

.. php:staticmethod:: restore($nombre, $configuracionCache = 'default')

Una vez que hayas almacenado la configuración en tiempo de ejecución, probablemente necesitarás restaurarla para poder acceder a ella nuevamente. ``Configure::restore()`` hace precisamente eso::

    # Restaura la configuración en tiempo de ejecución desde la caché.
    Configure::restore('usuario_1234', 'default');

Al restaurar información de configuración, es importante restaurarla con la misma clave y configuración de caché que se usó para almacenarla. La información restaurada se fusiona con la configuración en tiempo de ejecución existente.

Motores de Configuración
------------------------

CakePHP proporciona la capacidad de cargar archivos de configuración desde varias fuentes diferentes y cuenta con un sistema plugable para `crear tus propios motores de configuración
<https://api.cakephp.org/5.x/interface-Cake.Core.Configure.ConfigEngineInterface.html>`__. Los motores de configuración integrados son:

* `JsonConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.JsonConfig.html>`__
* `IniConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.IniConfig.html>`__
* `PhpConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.PhpConfig.html>`__

Por defecto, tu aplicación utilizará ``PhpConfig``.

Desactivación de Tablas Genéricas
==================================

Aunque utilizar clases de tabla genéricas, también llamadas auto-tablas, al crear rápidamente nuevas aplicaciones y hornear
modelos es útil, las clases de tabla genéricas pueden dificultar la depuración en algunos escenarios.

Puedes verificar si se emitió alguna consulta desde una clase de tabla genérica a través del panel SQL de DebugKit. Si
aún tienes problemas para diagnosticar un problema que podría ser causado por las auto-tablas, puedes lanzar una excepción
cuando CakePHP utiliza implícitamente una ``Cake\ORM\Table`` genérica en lugar de tu clase concreta de la siguiente manera::

    # En tu bootstrap.php
    use Cake\Event\EventManager;
    use Cake\Http\Exception\InternalErrorException;

    $seEjecutaCakeBakeShell = (PHP_SAPI === 'cli' && isset($argv[1]) && $argv[1] === 'bake');
    if (!$seEjecutaCakeBakeShell) {
        EventManager::instance()->on('Model.initialize', function($event) {
            $subject = $event->getSubject();
            if (get_class($subject) === 'Cake\ORM\Table') {
                $mensaje = sprintf(
                    'Clase de tabla faltante o alias incorrecto al registrar la clase de tabla para la tabla de base de datos %s.',
                    $subject->getTable());
                throw new InternalErrorException($mensaje);
            }
        });
    }

.. meta::
    :title lang=es: Configuración
    :keywords lang=es: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
