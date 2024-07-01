Sesiones
###########

CakePHP proporciona una envoltura y una serie de funciones de utilidad sobre la extensión nativa de sesión de PHP. Las sesiones te permiten identificar usuarios únicos a lo largo de las solicitudes y almacenar datos persistentes para usuarios específicos. A diferencia de las cookies, los datos de sesión no están disponibles en el lado del cliente. En CakePHP, se evita el uso de `$_SESSION` y se prefiere el uso de las clases de Sesión.

.. _session-configuration:

Configuración de Sesión
=========================

La configuración de sesión generalmente se define en **/config/app.php**. Las opciones disponibles son:

* ``Session.timeout`` - El número de *minutos* antes de que el manejador de sesiones de CakePHP expire la sesión.
* ``Session.defaults`` - Te permite usar las configuraciones de sesión predeterminadas incorporadas como base para tu configuración de sesión. Consulta a continuación para ver las configuraciones predeterminadas.
* ``Session.handler`` - Te permite definir un manejador de sesiones personalizado. Los manejadores de sesiones de base de datos y caché utilizan esto. Consulta a continuación para obtener información adicional sobre los manejadores de sesiones.
* ``Session.ini`` - Te permite establecer configuraciones adicionales de ini de sesión para tu configuración. Esto, combinado con ``Session.handler``, reemplaza las características de manejo de sesiones personalizadas de las versiones anteriores.
* ``Session.cookie`` - El nombre de la cookie que se utilizará. De forma predeterminada, se establece en el valor configurado para ``session.name`` en php.ini.
* ``Session.cookiePath`` - La ruta URL para la cual se establece la cookie de sesión. Se mapea a la configuración ``session.cookie_path`` de php.ini. De forma predeterminada, se establece en la ruta base de la aplicación.

Las configuraciones predeterminadas de CakePHP establecen ``session.cookie_secure`` en ``true``, cuando tu aplicación
está en un protocolo SSL. Si tu aplicación se sirve tanto desde protocolos SSL como no SSL, podrías tener problemas
con las sesiones que se pierden. Si necesitas acceder a la sesión en dominios SSL y no SSL, deberás deshabilitar esto::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

A partir de la versión 4.0 de CakePHP, también se establece el atributo `SameSite <https://owasp.org/www-community/SameSite>`__ en ``Lax`` de forma predeterminada para las cookies de sesión, lo que ayuda a proteger contra ataques CSRF. Puedes cambiar el valor predeterminado configurando la opción ``session.cookie_samesite`` en php.ini::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_samesite' => 'Strict',
        ],
    ]);


La ruta de la cookie de sesión se establece de forma predeterminada en la ruta base de la aplicación. Para cambiar esto, puedes usar el valor de ``session.cookie_path`` en ini. Por ejemplo, si quieres que tu sesión persista en todos los subdominios, puedes hacerlo así::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/',
            'session.cookie_domain' => '.tudominio.com',
        ],
    ]);

De forma predeterminada, PHP configura la cookie de sesión para que caduque tan pronto como se cierre el navegador, independientemente del valor configurado en ``Session.timeout``. El tiempo de espera de la cookie está controlado por el valor de ``session.cookie_lifetime`` en ini y se puede configurar así::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            // Invalidar la cookie después de 30 minutos sin visitar
            // ninguna página en el sitio.
            'session.cookie_lifetime' => 1800
        ]
    ]);

La diferencia entre ``Session.timeout`` y el valor de ``session.cookie_lifetime`` es que este último depende de que el cliente diga la verdad acerca de la cookie. Si necesitas una comprobación de tiempo de espera más estricta, sin depender de lo que el cliente informa, deberías usar ``Session.timeout``.

Ten en cuenta que ``Session.timeout`` corresponde al tiempo total de inactividad para un usuario (es decir, el tiempo sin visitar ninguna página donde se utilice la sesión), y no limita el total de minutos que un usuario puede permanecer en el sitio.

Manejadores de Sesiones Incorporados y Configuración
=====================================================

CakePHP viene con varias configuraciones de sesión incorporadas. Puedes usar estas configuraciones como base para tu configuración de sesión o crear una solución completamente personalizada. Para usar las configuraciones predeterminadas, simplemente configura la clave 'defaults' con el nombre del predeterminado que deseas utilizar. Luego puedes anular cualquier configuración secundaria declarándola en tu configuración de Sesión::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

Lo anterior usará la configuración de sesión 'php' incorporada. Puedes agregar partes o la totalidad de ella haciendo lo siguiente::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'mi_app',
        'timeout' => 4320 // 3 días
    ]);

Lo anterior anula el tiempo de espera y el nombre de la cookie para la configuración de sesión 'php'. Las configuraciones incorporadas son:

* ``php`` - Guarda sesiones con las configuraciones estándar en tu archivo php.ini.
* ``cake`` - Guarda sesiones como archivos dentro de ``tmp/sessions``. Esta es una buena opción cuando estás en hosts que no te permiten escribir fuera de tu propio directorio de inicio.
* ``database`` - Utiliza las sesiones de base de datos incorporadas. Consulta a continuación para obtener más información.
* ``cache`` - Utiliza las sesiones de caché incorporadas. Consulta a continuación para obtener más información.

Manejadores de Sesiones
---------------------------

Los manejadores de sesiones también se pueden definir en el array de configuración de la sesión. Al definir la clave de configuración 'handler.engine', puedes nombrar la clase o proporcionar una instancia del manejador. La clase/objeto debe implementar la interfaz nativa de PHP ``SessionHandlerInterface``. Implementar esta interfaz permitirá que ``Session`` mapee automáticamente los métodos para el manejador. Tanto los manejadores de sesiones de base de datos como de caché utilizan este método para guardar sesiones. Las configuraciones adicionales

Para el manejador deben colocarse dentro del array del manejador. Luego puedes leer esos valores desde dentro de tu manejador::

    'Session' => [
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'SesionesPersonalizadas',
        ],
    ]

Lo anterior muestra cómo podrías configurar el manejador de sesiones de base de datos con un modelo de aplicación. Al utilizar
nombres de clases como tu 'handler.engine', CakePHP esperará encontrar tu clase en el espacio de nombres ``Http\Session``.
Por ejemplo, si tenías una clase ``AppSessionHandler``, el archivo debería estar en **src/Http/Session/AppSessionHandler.php**,
y el nombre de la clase debería ser ``App\Http\Session\AppSessionHandler``. También puedes usar manejadores de sesiones desde
dentro de plugins, estableciendo el motor en ``MyPlugin.PluginSessionHandler``.

Sesiones de Base de Datos
-------------------------------

Si necesitas usar una base de datos para almacenar los datos de tu sesión, configúralo de la siguiente manera::

    'Session' => [
        'defaults' => 'database'
    ]

Esta configuración requiere una tabla de base de datos con este esquema::

    CREATE TABLE `sessions` (
      `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      `created` datetime DEFAULT CURRENT_TIMESTAMP, -- Opcional
      `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Opcional
      `data` blob DEFAULT NULL, -- para PostgreSQL, usa bytea en lugar de blob
      `expires` int(10) unsigned DEFAULT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

Puedes encontrar una copia del esquema para la tabla de sesiones en el `esqueleto de la aplicación <https://github.com/cakephp/app>`_ en **config/schema/sessions.sql**.

También puedes usar tu propia clase de ``Table`` para manejar el guardado de las sesiones::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'SesionesPersonalizadas',
        ],
    ]

Lo anterior le dirá a Session que use las configuraciones predeterminadas de 'database' y especifica que una tabla llamada ``SesionesPersonalizadas`` será la encargada de guardar la información de la sesión en la base de datos.

.. _sessions-cache-sessions:

Sesiones de Caché
------------------

La clase Cache se puede utilizar para almacenar sesiones también. Esto te permite almacenar sesiones en una caché como APCu o Memcached. Hay algunas advertencias al usar sesiones en caché, ya que si agotas el espacio de la caché, las sesiones comenzarán a caducar a medida que se eliminan registros.

Para usar sesiones basadas en caché, puedes configurar tu configuración de Sesión así::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session',
        ],
    ]);

Esto configurará Session para usar la clase ``CacheSession`` como el delegado para guardar las sesiones. Puedes usar la clave 'config' para especificar qué configuración de caché usar. La configuración de caché predeterminada es ``'default'``.

Bloqueo de Sesiones
--------------------

El esqueleto de la aplicación viene preconfigurado con una configuración de sesión como esta::

    'Session' => [
        'defaults' => 'php',
    ],

Esto significa que CakePHP manejará las sesiones según lo que esté configurado en tu ``php.ini``.
En la mayoría de los casos, esta será la configuración predeterminada, por lo que PHP guardará
cualquier sesión recién creada como un archivo en, por ejemplo, ``/var/lib/php/session``.

Pero esto también significa que cualquier tarea computacionalmente intensiva, como consultar un gran
conjunto de datos combinado con una sesión activa, **bloqueará ese archivo de sesión**, lo que
bloqueará a los usuarios para, por ejemplo, abrir una segunda pestaña de tu aplicación para
hacer algo más mientras tanto.

Para evitar este comportamiento, tendrás que cambiar la forma en que CakePHP maneja las sesiones
utilizando un manejador de sesiones diferente como :ref:`sessions-cache-sessions` combinado con
el :ref:`Motor Redis <caching-redisengine>` u otro motor de caché.

.. tip::

    Si deseas leer más sobre el Bloqueo de Sesiones, consulta `aquí <https://ma.ttias.be/php-session-locking-prevent-sessions-blocking-in-requests/>`_.

Configuración de Directivas de ini
====================================

Las configuraciones predeterminadas incorporadas intentan proporcionar una base común para la configuración de sesiones.
Es posible que necesites ajustar flags de ini específicos también. CakePHP expone la capacidad de personalizar las configuraciones
de ini tanto para las configuraciones predeterminadas como para las personalizadas. La clave ``ini`` en las configuraciones
de sesión te permite especificar valores de configuración individuales. Por ejemplo, puedes usarlo para controlar configuraciones como ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MiCookie',
            'session.cookie_lifetime' => 1800, // Válido por 30 minutos
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);

Creación de un Manejador de Sesiones Personalizado
===================================================

Crear un manejador de sesiones personalizado es sencillo en CakePHP. En este ejemplo, crearemos un
manejador de sesiones que almacene sesiones tanto en la Caché (APC) como en la base de datos. Esto
nos brinda lo mejor de ambas opciones: la entrada/salida rápida de APC, sin tener que preocuparnos
por las sesiones que desaparecen cuando la caché se llena.

Primero necesitamos crear nuestra clase personalizada y ponerla en **src/Http/Session/ComboSession.php**. La clase debería verse algo así::

    namespace App\Http\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Http\Session\DatabaseSession;

    class ComboSession extends DatabaseSession
    {
        protected $cacheKey;

        public function __construct()
        {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // Lee datos de la sesión.
        public function read($id): string
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }

            return parent::read($id);


        }

        // Escribe datos en la sesión.
        public function write($id, $data): bool
        {
            Cache::write($id, $data, $this->cacheKey);

            return parent::write($id, $data);
        }

        // Destruye una sesión.
        public function destroy($id): bool
        {
            Cache::delete($id, $this->cacheKey);

            return parent::destroy($id);
        }

        // Elimina sesiones caducadas.
        public function gc($expires = null): bool
        {
            return parent::gc($expires);
        }
    }

Nuestra clase extiende el ``DatabaseSession`` incorporado para no tener que duplicar toda su lógica y comportamiento. Envolvemos
cada operación con una operación de :php:class:`Cake\\Cache\\Cache`. Esto nos permite obtener sesiones de la caché rápida y no
tener que preocuparnos por lo que sucede cuando llenamos la caché. En **config/app.php** haz que el bloque de sesión se vea así::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc',
        ],
    ],
    // Asegúrate de agregar una configuración de caché apc
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Ahora nuestra aplicación comenzará a usar nuestro manejador de sesiones personalizado para leer y escribir datos de sesión.

.. php:class:: Sesión

.. _accessing-session-object:

Acceso al Objeto de Sesión
===========================

Puedes acceder a los datos de sesión en cualquier lugar donde tengas acceso a un objeto de solicitud. Esto significa que la sesión es accesible desde:

* Controladores
* Vistas
* Ayudantes (Helpers)
* Celdas (Cells)
* Componentes

Un ejemplo básico de uso de sesión en controladores, vistas y celdas sería::

    $nombre = $this->request->getSession()->read('Usuario.nombre');

    // Si accedes a la sesión varias veces,
    // probablemente querrás una variable local.
    $sesion = $this->request->getSession();
    $nombre = $sesion->read('Usuario.nombre');

En los ayudantes, usa ``$this->getView()->getRequest()`` para obtener el objeto de solicitud;
en los componentes, usa ``$this->getController()->getRequest()``.

Lectura y Escritura de Datos de Sesión
=======================================

.. php:method:: read($clave, $predeterminado = null)

Puedes leer valores de la sesión utilizando una sintaxis compatible con :php:meth:`Hash::extract()`. Ejemplo::

    $sesion->read('Config.idioma', 'es');

.. php:method:: readOrFail($clave)

Lo mismo que una envoltura de conveniencia alrededor de un valor de retorno no nulo::

    $sesion->readOrFail('Config.idioma');

Esto es útil cuando sabes que esta clave debe estar configurada y no deseas tener que comprobar su existencia en el código mismo.

.. php:method:: write($clave, $valor)

``$clave`` debería ser la ruta separada por puntos a la que deseas escribir ``$valor``::

    $sesion->write('Config.idioma', 'es');

También puedes especificar uno o varios hashes así::

    $sesion->write([
      'Config.tema' => 'azul',
      'Config.idioma' => 'es',
    ]);

.. php:method:: delete($clave)

Cuando necesitas eliminar datos de la sesión, puedes usar ``delete()``::

    $sesion->delete('Algo.valor');

.. php:staticmethod:: consume($clave)

Cuando necesitas leer y eliminar datos de la sesión, puedes usar ``consume()``::

    $sesion->consume('Algo.valor');

.. php:method:: check($clave)

Si deseas ver si los datos existen en la sesión, puedes usar ``check()``::

    if ($sesion->check('Config.idioma')) {
        // Config.idioma existe y no es nulo.
    }

Destrucción de la Sesión
=========================

.. php:method:: destroy()

Destruir la sesión es útil cuando los usuarios cierran sesión. Para destruir una sesión, usa el método ``destroy()``::

    $sesion->destroy();

Destruir una sesión eliminará todos los datos del lado del servidor en la sesión, pero **no** eliminará la cookie de la sesión.

Rotación de Identificadores de Sesión
======================================

.. php:method:: renew()

Mientras que el ``Plugin de Autenticación`` renueva automáticamente el ID de sesión cuando los usuarios inician sesión y cierran sesión, es posible que necesites rotar los ID de sesión manualmente. Para hacerlo, usa el método ``renew()``::

    $sesion->renew();

Mensajes Flash
===============

Los mensajes flash son pequeños mensajes que se muestran a los usuarios una vez. A menudo se utilizan para presentar mensajes de error o confirmar que las acciones se realizaron con éxito.

Para establecer y mostrar mensajes flash, debes usar el :doc:`Componente Flash </controllers/components/flash>` y :doc:`Ayudante Flash </views/helpers/flash>`.

.. meta::
    :title lang=es: Sesiones
    :keywords lang=en: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
