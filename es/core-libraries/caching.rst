Caching
#######

.. php:namespace::  Cake\Cache

.. php:class:: Cache

El almacenamiento en caché se puede utilizar para acelerar la lectura de recursos caros o lentos, manteniendo una segunda copia de los datos requeridos en un sistema de almacenamiento más rápido o más cercano. Por ejemplo, puedes almacenar los resultados de consultas costosas o el acceso a servicios web remotos que no cambian con frecuencia en una caché. Una vez que los datos están en la caché, leerlos desde la caché es mucho más económico que acceder al recurso remoto.

En CakePHP, el almacenamiento en caché se facilita mediante la clase ``Cache``. Esta clase proporciona una interfaz estática y uniforme para interactuar con diversas implementaciones de almacenamiento en caché. CakePHP proporciona varios motores de caché y ofrece una interfaz sencilla si necesitas construir tu propio backend. Los motores de almacenamiento en caché integrados son:

- ``File``: el almacenamiento en caché de archivos es una caché simple que utiliza archivos locales. Es el motor de caché más lento y no proporciona muchas características para operaciones atómicas. Sin embargo, dado que el almacenamiento en disco a menudo es bastante económico, almacenar objetos grandes o elementos que rara vez se escriben funciona bien en archivos.
- ``Memcached``: utiliza la extensión `Memcached <https://php.net/memcached>`_.
- ``Redis``: utiliza la extensión `phpredis <https://github.com/phpredis/phpredis>`_. Redis proporciona un sistema de caché rápido y persistente similar a Memcached y también ofrece operaciones atómicas.
- ``Apcu``: la caché de APCu utiliza la extensión PHP `APCu <https://php.net/apcu>`_. Esta extensión utiliza memoria compartida en el servidor web para almacenar objetos. Esto lo hace muy rápido y capaz de proporcionar funciones de lectura/escritura atómicas.
- ``Array``: almacena todos los datos en una matriz. Este motor no proporciona almacenamiento persistente y está destinado a su uso en suites de pruebas de aplicaciones.
- ``Null``: el motor nulo en realidad no almacena nada y falla en todas las operaciones de lectura.

Independientemente del motor de caché que elijas usar, tu aplicación interactúa con :php:class:`Cake\\Cache\\Cache`.

.. _cache-configuration:

Configuración de los Motores de Caché
======================================

.. php:staticmethod:: setConfig($clave, $configuracion = null)

Tu aplicación puede configurar cualquier número de 'motores' durante su proceso de inicio. Las configuraciones del motor de caché se definen en **config/app.php**.

Para un rendimiento óptimo, CakePHP requiere que se definan dos motores de caché.

- ``_cake_core_`` se utiliza para almacenar mapas de archivos y resultados analizados de archivos de :doc:`/core-libraries/internationalization-and-localization`.
- ``_cake_model_`` se utiliza para almacenar descripciones de esquemas para los modelos de tu aplicación.

Usar múltiples configuraciones de motores también te permite cambiar incrementalmente el almacenamiento según sea necesario. Por ejemplo, en tu **config/app.php** podrías poner lo siguiente::

    // ...
    'Cache' => [
        'short' => [
            'className' => 'File',
            'duration' => '+1 hours',
            'path' => CACHE,
            'prefix' => 'cake_short_',
        ],
        // Usando un nombre completamente calificado.
        'long' => [
            'className' => 'Cake\Cache\Engine\FileEngine',
            'duration' => '+1 week',
            'probability' => 100,
            'path' => CACHE . 'long' . DS,
        ],
    ]
    // ...

Las opciones de configuración también se pueden proporcionar como una cadena :term:`DSN`. Esto es útil cuando se trabaja con variables de entorno o proveedores de :term:`PaaS`::

    Cache::setConfig('short', [
        'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
    ]);

Cuando usas una cadena DSN, puedes definir cualquier parámetro/opción adicional como argumentos de cadena de consulta.

También puedes configurar los motores de caché en tiempo de ejecución::

    // Usando un nombre corto
    Cache::setConfig('short', [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ]);

    // Usando un nombre completamente calificado.
    Cache::setConfig('long', [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]);

    // Usando un objeto construido.
    $objeto = new FileEngine($configuracion);
    Cache::setConfig('otro', $objeto);

Los nombres de estas configuraciones de motor ('short' y 'long') se utilizan como el parámetro ``$config``
para :php:meth:`Cake\\Cache\\Cache::write()` y
:php:meth:`Cake\\Cache\\Cache::read()`. Al configurar los motores de caché, puedes
referenciar el nombre de la clase utilizando las siguientes sintaxis::

    // Nombre corto (en App\ o en los espacios de nombres de Cake)
    Cache::setConfig('long', ['className' => 'File']);

    // Nombre corto del plugin
    Cache::setConfig('long', ['className' => 'MyPlugin.SuperCache']);

    // Espacio de nombres completo
    Cache::setConfig('long', ['className' => 'Cake\Cache\Engine\FileEngine']);

    // Un objeto que implementa CacheEngineInterface
    Cache::setConfig('long', ['className' => $miCache]);

.. note::

    Al utilizar FileEngine, es posible que necesites usar la opción ``mask`` para
    asegurarte de que los archivos de caché se creen con los permisos correctos.

Opciones del Motor
------------------

Cada motor acepta las siguientes opciones:

- ``duration``: especifica cuánto tiempo duran los elementos en esta configuración de caché. Se especifica como una expresión compatible con ``strtotime()``.
- ``groups``: lista de grupos o 'etiquetas' asociados a cada clave almacenada en esta configuración. Útil cuando necesitas eliminar un subconjunto de datos de una caché.
- ``prefix``: se antepone a todas las entradas. Bueno cuando necesitas compartir
  un espacio de claves con otra configuración de caché o con otra aplicación.
- ``probability``: probabilidad de activar una limpieza de la caché. Establecerlo en 0 deshabilitará automáticamente la llamada a ``Cache::gc()``

Opciones del Motor de FileEngine
--------------------------------

FileEngine utiliza las siguientes opciones específicas del motor:

- ``isWindows``: se rellena automáticamente con si el host es Windows o no.
- ``lock``: ¿deberían bloquearse los archivos antes de escribir en ellos?
- ``mask``: la máscara utilizada para los archivos creados.
- ``path``: ruta donde deben guardarse los archivos de caché. Por defecto, es el directorio temporal del sistema.

.. _caching-redisengine:

Opciones del Motor RedisEngine
------------------------------

RedisEngine utiliza las siguientes opciones específicas del motor:

- ``port``: el puerto en el que se está ejecutando tu servidor Redis.
- ``host``: el host en el que se está ejecutando tu servidor Redis.
- ``database``: el número de base de datos a usar para la conexión.
- ``password``: contraseña del servidor Redis.
- ``persistent``: ¿se debe realizar una conexión persistente a Redis?
- ``timeout``: tiempo de espera de conexión para Redis.
- ``unix_socket``: ruta a un socket Unix para Redis.

Opciones del Motor MemcacheEngine
---------------------------------

- ``compress``: si comprimir datos o no.
- ``username``: usuario para acceder al servidor Memcache.
- ``password``: contraseña para acceder al servidor Memcache.
- ``persistent``: el nombre de la conexión persistente. Todas las configuraciones que usan
  el mismo valor persistente compartirán una única conexión subyacente.
- ``serialize``: el motor de serialización utilizado para serializar datos. Los motores disponibles son php,
  igbinary y json. Además de php, la extensión memcached debe estar compilada con el
  soporte adecuado para el serializador correspondiente.
- ``servers``: cadena o array de servidores memcached. Si es un array, MemcacheEngine los usará
  como un grupo.
- ``duration``: ten en cuenta que cualquier duración mayor de 30 días se tratará como un valor de tiempo Unix real
  en lugar de un desfase desde el tiempo actual.
- ``options``: opciones adicionales para el cliente memcached. Debe ser un array de opción => valor.
  Usa las constantes ``\Memcached::OPT_*`` como claves.

.. _configuracion-fallback-caché:

Configuración de la Caída de Caché
----------------------------------

En caso de que un motor no esté disponible, como el ``FileEngine`` que intenta
escribir en una carpeta no escribible o el ``RedisEngine`` que no puede conectarse a
Redis, el motor volverá al ``NullEngine`` y generará un error que se puede registrar.
Esto evita que la aplicación genere una excepción no capturada debido a un error de caché.

Puedes configurar las configuraciones de la caché para que vuelvan a una configuración especificada usando la clave de configuración ``fallback``::

    Cache::setConfig('redis', [
        'className' => 'Redis',
        'duration' => '+1 hours',
        'prefix' => 'cake_redis_',
        'host' => '127.0.0.1',
        'port' => 6379,
        'fallback' => 'default',
    ]);

Si falla la inicialización de la instancia ``RedisEngine``, la configuración de caché ``redis``
volverá a usar la configuración de caché ``default``. Si también falla la inicialización del
motor para la configuración de caché ``default`` en este escenario, el motor volvería nuevamente al ``NullEngine``
y evitaría que la aplicación genere una excepción no capturada.

Puedes desactivar las caídas de caché con ``false``::

    Cache::setConfig('redis', [
        'className' => 'Redis',
        'duration' => '+1 hours',
        'prefix' => 'cake_redis_',
        'host' => '127.0.0.1',
        'port' => 6379,
        'fallback' => false
    ]);

Cuando no hay una caída, los errores de caché se generarán como excepciones.

Eliminación de Motores de Caché Configurados
---------------------------------------------

.. php:staticmethod:: drop($clave)

Una vez que se crea una configuración, no puedes cambiarla. En su lugar, debes eliminar
la configuración y volver a crearla usando :php:meth:`Cake\\Cache\\Cache::drop()` y
:php:meth:`Cake\\Cache\\Cache::setConfig()`. Eliminar un motor de caché eliminará
la configuración y destruirá el adaptador si se construyó.

Escritura en Caché
==================

.. php:staticmethod:: write($clave, $valor, $configuracion = 'default')

``Cache::write()`` escribirá un $valor en la caché. Puedes leer o
eliminar este valor más tarde refiriéndote a él por ``$clave``. Puedes
especificar una configuración opcional para almacenar la caché también. Si
no se especifica ninguna ``$configuración``, se usará la predeterminada. ``Cache::write()``
puede almacenar cualquier tipo de objeto y es ideal para almacenar resultados de
búsquedas de modelos::

    $entradas = Cache::read('entradas');
    if ($entradas === null) {
        $entradas = $servicio->obtenerTodasLasEntradas();
        Cache::write('entradas', $entradas);
    }

Usar ``Cache::write()`` y ``Cache::read()`` para reducir el número
de consultas realizadas a la base de datos para obtener las entradas.

.. note::

    Si planeas almacenar en caché el resultado de las consultas realizadas con el ORM de CakePHP,
    es mejor utilizar las capacidades de almacenamiento en caché integradas del objeto de consulta
    como se describe en la sección de :ref:`caching-query-results`

Escritura de Múltiples Claves a la Vez
--------------------------------------

.. php:staticmethod:: writeMany($datos, $configuracion = 'default')

Puede que necesites escribir múltiples claves de caché a la vez. Aunque podrías usar múltiples llamadas a ``write()``, ``writeMany()`` permite a CakePHP utilizar
API de almacenamiento más eficientes cuando están disponibles. Por ejemplo, usando ``writeMany()``
ahorras múltiples conexiones de red cuando usas Memcached::

    $resultado = Cache::writeMany([
        'articulo-' . $slug => $articulo,
        'articulo-' . $slug . '-comentarios' => $comentarios
    ]);

    // $resultado contendrá
    ['articulo-primer-post' => true, 'articulo-primer-post-comentarios' => true]

Escrituras Atómicas
-------------------

.. php:staticmethod:: add($clave, $valor, $configuracion = 'default')

Usar ``Cache::add()`` te permitirá establecer atómicamente una clave en un valor si la clave
aún no existe en la caché. Si la clave ya existe en el backend de la caché o la escritura falla, ``add()`` devolverá ``false``::

    // Establecer una clave para actuar como bloqueo
    $resultado = Cache::add($claveBloqueo, true);
    if (!$resultado) {
        return;
    }
    // Realizar una acción donde solo puede haber un proceso activo a la vez.

    // Eliminar la clave de bloqueo.
    Cache::delete($claveBloqueo);

.. warning::

   La caché basada en archivos no admite escrituras atómicas.

Caché de Lectura Directa
------------------------

.. php:staticmethod:: remember($clave, $callable, $configuracion = 'default')

La caché ayuda con la caché de lectura directa. Si la clave de caché nombrada existe,
se devolverá. Si la clave no existe, se invocará la función de llamada
y los resultados se almacenarán en la caché en la clave proporcionada.

Por ejemplo, a menudo quieres cachear los resultados de las llamadas a servicios remotos. Puedes usar
``remember()`` para hacerlo simple::

    class ServicioDeAsunto
    {
        public function todasLasTemas($repositorio)
        {
            return Cache::remember($repositorio . '-temas', function () use ($repositorio) {
                return $this->obtenerTodos($repositorio);
            });
        }
    }

Lectura Desde la Caché
======================

.. php:staticmethod:: read($clave, $configuracion = 'default')

``Cache::read()`` se usa para leer el valor en caché almacenado bajo
``$clave`` desde la ``$configuración``. Si ``$configuración`` es nulo, se usará la configuración predeterminada
configuración. ``Cache::read()`` devolverá el valor en caché
si es una caché válida o ``null`` si la caché ha caducado o
no existe. Utiliza los operadores de comparación estricta ``===`` o ``!==``
para comprobar el éxito de la operación ``Cache::read()``.

Por ejemplo::

    $nube = Cache::read('nube');
    if ($nube !== null) {
        return $nube;
    }

    // Generar datos de la nube
    // ...

    // Almacenar datos en la caché
    Cache::write('nube', $nube);

    return $nube;

O si estás usando otra configuración de caché llamada ``corta``, puedes
especificarlo en las llamadas a ``Cache::read()`` y ``Cache::write()`` de la siguiente manera::

    // Leer la clave "nube", pero de la configuración corta en lugar de la predeterminada
    $nube = Cache::read('nube', 'corta');
    if ($nube === null) {
        // Generar datos de la nube
        // ...

        // Almacenar datos en la caché, usando la configuración de caché corta en lugar de la predeterminada
        Cache::write('nube', $nube, 'corta');
    }

    return $nube;

Lectura de Múltiples Claves a la Vez
-------------------------------------

.. php:staticmethod:: readMany($claves, $configuracion = 'default')

Después de haber escrito múltiples claves a la vez, probablemente querrás leerlas también. Aunque podrías usar múltiples llamadas a ``read()``, ``readMany()`` permite
a CakePHP utilizar API de almacenamiento más eficientes donde estén disponibles. Por ejemplo, usando
``readMany()`` ahorras múltiples conexiones de red cuando usas Memcached::

    $resultado = Cache::readMany([
        'articulo-' . $slug,
        'articulo-' . $slug . '-comentarios'
    ]);
    // $resultado contendrá
    ['articulo-primer-post' => '...', 'articulo-primer-post-comentarios' => '...']

Eliminación de la Caché
=======================

.. php:staticmethod:: delete($clave, $configuracion = 'default')

``Cache::delete()`` te permitirá eliminar completamente un objeto en caché
del almacén::

    // Eliminar una clave
    Cache::delete('mi_clave');

A partir de la versión 4.4.0, el ``RedisEngine`` también proporciona un método ``deleteAsync()`` que utiliza la operación ``UNLINK`` para eliminar las claves de caché::

    Cache::pool('redis')->deleteAsync('mi_clave');

Eliminación de Múltiples Claves a la Vez
----------------------------------------

.. php:staticmethod:: deleteMany($claves, $configuracion = 'default')

Después de haber escrito múltiples claves a la vez, es posible que desees eliminarlas. Aunque
podrías usar múltiples llamadas a ``delete()``, ``deleteMany()`` permite a CakePHP utilizar
API de almacenamiento más eficientes donde estén disponibles. Por ejemplo, usando ``deleteMany()``
ahorras múltiples conexiones de red cuando usas Memcached::

    $resultado = Cache::deleteMany([
        'articulo-' . $slug,
        'articulo-' . $slug . '-comentarios'
    ]);
    // $resultado contendrá
    ['articulo-primer-post' => true, 'articulo-primer-post-comentarios' => true]

Limpieza de Datos en Caché
==========================

.. php:staticmethod:: clear($configuracion = 'default')

Elimina todos los valores en caché para una configuración de caché. En motores como: Apcu,
Memcached, se utiliza el prefijo de la configuración de caché para eliminar
entradas de caché. Asegúrate de que las diferentes configuraciones de caché tengan diferentes
prefijos::

    // Eliminará todas las claves.
    Cache::clear();

A partir de la versión 4.4.0, el ``RedisEngine`` también proporciona un método ``clearBlocking()`` que utiliza la operación ``UNLINK`` para eliminar las claves de caché::

    Cache::pool('redis')->clearBlocking();

.. note::

    Debido a que APCu utiliza cachés aisladas para el servidor web y la interfaz de línea de comandos,
    deben ser limpiadas por separado (la CLI no puede limpiar el servidor web y viceversa).

Uso de Caché para Almacenar Contadores
=======================================

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

Los contadores en tu aplicación son buenos candidatos para ser almacenados en caché. Por ejemplo,
una contador de días para un evento puede ser guardado en la caché. La clase Cache
expone formas de incrementar y decrementar los valores del contador. El hecho de que estas
operaciones sean atómicas es importante para que se reduzca el riesgo de contención y la abilidad de que
dos usuarios simultaneamente incrementen o decrementen el mismo valor.

Después de guardar un valor entero en la caché, puedes manipularlo usando ``increment()`` y
``decrement()``::

    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    // Or
    Cache::increment('initial_count');


.. note::

    Recuerda que las operaciones de incremento y decremento no están disponibles en FileEngine. Debes usar APCu, Redis o Memcached.

.. _caching-query-results:

Utilizando la Caché para Almacenar Resultados Comunes de Consultas
===================================================================

Puedes mejorar significativamente el rendimiento de tu aplicación almacenando en caché los resultados
que rara vez cambian o que están sujetos a lecturas frecuentes. Un ejemplo perfecto de esto son los resultados de
:php:meth:`Cake\\ORM\\Table::find()`. El objeto de consulta te permite almacenar en caché
los resultados utilizando el método ``cache()``. Consulta la sección :ref:`caching-query-results`
para obtener más información.

.. _cache-groups:

Uso de Grupos
=============

A veces querrás marcar varias entradas en caché para que pertenezcan a cierto grupo o espacio de nombres. Esta es una necesidad común para invalidar masivamente claves cada vez que cambia alguna información que se comparte entre todas las entradas en el mismo grupo. Esto es posible declarando los grupos en la configuración de la caché::

    Cache::setConfig('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article'],
    ]);

.. php:method:: clearGroup($group, $config = 'default')

Digamos que quieres almacenar en caché el HTML generado para tu página de inicio, pero también quieres invalidar automáticamente esta caché cada vez que se agrega un comentario o una publicación a tu base de datos. Al agregar los grupos ``comment`` y ``article``, hemos etiquetado efectivamente cualquier clave almacenada en esta configuración de caché con ambos nombres de grupo.

Por ejemplo, cada vez que se añade una nueva publicación, podríamos decirle al motor de caché que elimine todas las entradas asociadas al grupo ``article``::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` se puede utilizar para recuperar la asignación entre el grupo y las configuraciones, es decir, tener el mismo grupo::

    // src/Model/Table/ArticlesTable.php

    /**
     * Una variación del ejemplo anterior que limpia todas las configuraciones de caché
     * que tienen el mismo grupo
     */
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            $configs = Cache::groupConfigs('article');
            foreach ($configs['article'] as $config) {
                Cache::clearGroup('article', $config);
            }
        }
    }

Los grupos se comparten en todas las configuraciones de caché que utilizan el mismo motor y el mismo prefijo. Si estás usando grupos y quieres aprovechar la eliminación de grupos, elige un prefijo común para todas tus configuraciones.

Habilitar o Deshabilitar Globalmente la Caché
=============================================

.. php:staticmethod:: disable()

Puede que necesites deshabilitar todas las lecturas y escrituras en la caché cuando intentas resolver problemas relacionados con la expiración de la caché. Puedes hacerlo usando ``enable()`` y ``disable()``::

    // Deshabilitar todas las lecturas y escrituras en la caché.
    Cache::disable();

Una vez deshabilitada, todas las lecturas y escrituras devolverán ``null``.

.. php:staticmethod:: enable()

Una vez deshabilitada, puedes usar ``enable()`` para habilitar nuevamente la caché::

    // Habilitar nuevamente todas las lecturas y escrituras en la caché.
    Cache::enable();

.. php:staticmethod:: enabled()

Si necesitas verificar el estado de la caché, puedes usar ``enabled()``.

Creación de un Motor de Caché
=============================

Puedes proporcionar motores de ``Cache`` personalizados en ``App\Cache\Engine``, así como en plugins usando ``$plugin\Cache\Engine``. Los motores de caché deben estar en un directorio de caché. Si tuvieras un motor de caché llamado ``MyCustomCacheEngine``, se colocaría en **src/Cache/Engine/MyCustomCacheEngine.php**. O en **plugins/MyPlugin/src/Cache/Engine/MyCustomCacheEngine.php** como parte de un plugin. Las configuraciones de caché de los plugins deben utilizar la sintaxis de puntos del plugin::

    Cache::setConfig('custom', [
        'className' => 'MyPlugin.MyCustomCache',
        // ...
    ]);

Los motores de caché personalizados deben extender :php:class:`Cake\\Cache\\CacheEngine`, que define varios métodos abstractos y también proporciona algunos métodos de inicialización.

La API requerida para un CacheEngine es

.. php:class:: CacheEngine

    La clase base para todos los motores de caché utilizados con Cache.

.. php:method:: write($key, $value)

    :return: booleano para indicar el éxito.

    Escribe el valor de una clave en la caché, devuelve ``true`` si los datos se almacenaron correctamente, ``false`` en caso de fallo.

.. php:method:: read($key)

    :return: El valor en caché o ``null`` en caso de fallo.

    Lee una clave de la caché. Devuelve ``null`` para indicar que la entrada ha caducado o no existe.

.. php:method:: delete($key)

    :return: Booleano ``true`` en caso de éxito.

    Elimina una clave de la caché. Devuelve ``false`` para indicar que la entrada no existía o no se pudo eliminar.

.. php:method:: clear($check)

    :return: Booleano ``true`` en caso de éxito.

    Elimina todas las claves de la caché. Si $check es ``true``, debes validar que cada valor realmente ha caducado.

.. php:method:: clearGroup($group)

    :return: Booleano ``true`` en caso de éxito.

    Elimina todas las claves de la caché pertenecientes al mismo grupo.

.. php:method:: decrement($key, $offset = 1)

    :return: Booleano ``true`` en caso de éxito.

    Decrementa un número bajo la clave y devuelve el valor decrecido.

.. php:method:: increment($key, $offset = 1)

    :return: Booleano ``true`` en caso de éxito.

    Incrementa un número bajo la clave y devuelve el valor incrementado.

.. meta::
    :title lang=es: Almacenamiento en Caché
    :keywords lang=en: uniform api,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apcu,apc,memcache,queries,cakephp,elements,servers,memory
