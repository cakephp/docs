Plugins
#######

CakePHP te permite configurar una combinación de controladores, modelos y vistas y liberarlos como un plugin de aplicación pre-empaquetado que otros pueden usar en sus aplicaciones CakePHP. Si has creado una gran gestión de usuarios, un blog sencillo, o adaptadores de servicios web en una de tus aplicaciones ¿por qué no empaquetarlo como un plugin CakePHP? De esta manera puedes utilizarlo en tus otras aplicaciones y compartirlo con la comunidad.

Un plugin de CakePHP es independiente de la aplicación principal y generalmente proporciona alguna funcionalidad bien definida que se puede empaquetar de forma ordenada y reutilizar con poco esfuerzo en otras aplicaciones. La aplicación y el plugin operan en sus respectivos espacios, pero comparten los datos de configuración de la aplicación (por ejemplo, conexiones de base de datos, transportes de correo electrónico).

Los plugins deben definir su propio espacio de nombres (namespace) de nivel superior. Por ejemplo: ``DebugKit``. Por convención, los plugins utilizan el nombre de su paquete como su espacio de nombres. Si deseas utilizar un espacio de nombres diferente, puedes configurarlo cuando se cargan los plugins.

Instalación de un plugin con Composer
=====================================

Muchos plugins están disponibles en `Packagist <https://packagist.org>`_
y se pueden instalar con ``Composer``. Para instalar DebugKit
debes hacer lo siguiente:

.. code-block:: console

    php composer.phar require cakephp/debug_kit

Esto instalará la última versión de DebugKit y actualizará tus archivos **composer.json** y **composer.lock**, también actualizará el archivo **vendor/cakephp-plugins.php** y tu cargador automático (autoloader).


Instalación manual de un Plugin
===============================

Si el complemento que deseas instalar no está disponible en packagist.org, puedes clonar o copiar el código del complemento en tu directorio de **plugins**. Supongamos que deseas instalar un complemento llamado 'ContactManager', debes tener una carpeta en **plugins** llamada 'ContactManager'. En este directorio se encuentran las carpetas src, tests y cualquier otra carpeta del complemento.

.. _autoloading-plugin-classes:

Carga automática manual de clases de Plugins
--------------------------------------------

Si instalas tus complementos mediante ``composer`` o ``bake``, no deberías necesitar configurar la carga automática de clases para tus plugins.

Si creas un plugin manualmente en el directorio ``plugins``, entonces necesitarás indicarle a ``composer`` que actualice su caché de carga automática:

.. code-block:: console

    php composer.phar dumpautoload

Si estás utilizando espacios de nombres de proveedores para tus plugins, deberás agregar el mapeo de espacio de nombres a la ruta en el archivo ``composer.json`` de la siguiente manera, antes de ejecutar el comando de composer mencionado anteriormente:

.. code-block:: json

    {
        "autoload": {
            "psr-4": {
                "AcmeCorp\\Users\\": "plugins/AcmeCorp/Users/src/",
            }
        },
        "autoload-dev": {
            "psr-4": {
                "AcmeCorp\\Users\\Test\\": "plugins/AcmeCorp/Users/tests/"
            }
        }
    }

.. _loading-a-plugin:

Cargar un Plugin
================

Si deseas utilizar las rutas, comandos de consola, middlewares, listeners de eventos, plantillas o assets de la carpeta web (webroot) de un plugin, deberás cargar el plugin.

Si solo deseas utilizar helpers, comportamientos o componentes de un plugin, no es necesario cargar explícitamente el plugin, aunque siempre es recomendable hacerlo.

También hay un práctico comando de consola para cargar el plugin. Ejecuta la siguiente línea:

.. code-block:: console

    bin/cake plugin load ContactManager

Esto actualizaría el array en el archivo ``config/plugins.php`` de tu aplicación con una entrada similar a ``'ContactManager' => []``.

.. _plugin-configuration:

Configuración de Hooks del Plugin
=================================

Los plugins ofrecen varios hooks (ganchos) que permiten que un plugin se inyecte en las partes apropiadas de tu aplicación. Los hooks son:

* ``bootstrap`` Se utiliza para cargar archivos de configuración predeterminados del plugin, definir constantes y otras funciones globales.
* ``routes`` Se utiliza para cargar las rutas de un plugin. Se activa después de que se cargan las rutas de la aplicación.
* ``middleware`` middleware Se utiliza para agregar el middleware del plugin a la cola de middlewares de una aplicación.
* ``console`` Se utiliza para agregar comandos de consola a la colección de comandos de una aplicación.
* ``services`` Se utiliza para registrar servicios del contenedor de aplicaciones.

Por defecto, todos los hooks de los plugins están habilitados. Puedes deshabilitar los hooks utilizando las opciones relacionadas del comando plugin load:

.. code-block:: console

    bin/cake plugin load ContactManager --no-routes

Esto actualizaría el array en el archivo ``config/plugins.php`` de tu aplicación con una entrada similar a ``'ContactManager' => ['routes' => false]``.

Opciones de Carga de Plugins
============================

Además de las opciones para los hooks de complementos, el comando ``plugin load`` tiene las siguientes opciones para controlar la carga del plugin:

- ``--only-debug`` Carga el plugin solo cuando el modo de depuración (debug) está habilitado.
- ``--only-cli`` Carga el plugin solo para CLI.
- ``--optional`` No arroja un error si el plugin no está disponible.

Cargar Plugins a través de ``Application::bootstrap()``
==============================================================

Además del array de configuración en ``config/plugins.php``, los plugins también se pueden cargar en el método ``bootstrap()``  de tu aplicación::

    // In src/Application.php
    use Cake\Http\BaseApplication;
    use ContactManager\ContactManagerPlugin;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            parent::bootstrap();

            // Load the contact manager plugin by class name
            $this->addPlugin(ContactManagerPlugin::class);

            // Load a plugin with a vendor namespace by 'short name' with options
            $this->addPlugin('AcmeCorp/ContactManager', ['console' => false]);

            // Load a dev dependency that will not exist in production builds.
            $this->addOptionalPlugin('AcmeCorp/ContactManager');
        }
    }

Puedes configurar hooks con opciones de array o utilizando los métodos proporcionados por las clases del plugin::

    // In Application::bootstrap()
    use ContactManager\ContactManagerPlugin;

    // Use the disable/enable to configure hooks.
    $plugin = new ContactManagerPlugin();

    $plugin->disable('bootstrap');
    $plugin->enable('routes');
    $this->addPlugin($plugin);

Los objetos del plugin también conocen sus nombres e información de la ruta::

    $plugin = new ContactManagerPlugin();

    // Get the plugin name.
    $name = $plugin->getName();

    // Path to the plugin root, and other paths.
    $path = $plugin->getPath();
    $path = $plugin->getConfigPath();
    $path = $plugin->getClassPath();

Uso de las Clases del Plugins
-----------------------------

Puedes hacer referencia a los controladores, modelos, componentes, comportamientos y helpers de un plugin prefijando el nombre del plugin.

Por ejemplo, supongamos que quieres usar el helper ``ContactInfoHelper`` del plugin ContactManager para mostrar información de contacto formateada en una de tus vistas. En tu controlador, usar ``addHelper()`` podría verse así::

    $this->viewBuilder()->addHelper('ContactManager.ContactInfo');

.. note::
    Este nombre de clase separado por puntos se denomina :term:`Sintaxis de plugin`.

Luego podrías acceder al ``ContactInfoHelper``  de la misma manera que cualquier otro helper en tu vista, como por ejemplo::

    echo $this->ContactInfo->address($contact);

Los plugins pueden utilizar los modelos, componentes, comportamientos y helpers proporcionados por la aplicación, o por otros plugins si es necesario::

   // Use an application component
   $this->loadComponent('AppFlash');

   // Use another plugin's behavior
   $this->addBehavior('OtherPlugin.AuditLog');

.. _plugin-create-your-own:

Creación de tus propios Plugins
-------------------------------

Como ejemplo práctico, comencemos a crear el plugin ContactManager mencionado anteriormente. Para empezar, configuraremos la estructura básica del directorio de nuestro complemento. Debería verse así::

    /src
    /plugins
        /ContactManager
            /config
            /src
                /ContactManagerPlugin.php
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
            /templates
                /layout
            /tests
                /TestCase
                /Fixture
            /webroot

Ten en cuenta el nombre de la carpeta del plugin, '**ContactManager**'. Es importante que esta carpeta tenga el mismo nombre que el plugin.

Dentro de la carpeta del plugin, notarás que se parece mucho a una aplicación de CakePHP, y básicamente eso es lo que es. En lugar de un archivo ``Application.php``, tienes un archivo ``ContactManagerPlugin.php``. No es necesario incluir ninguna de las carpetas que no estés usando. Algunos plugins solo pueden definir un Component y un Behavior, y en ese caso pueden omitir completamente el directorio 'templates'.

Un plugin también puede tener prácticamente cualquiera de los otros directorios que puede tener tu aplicación, como Config, Console, webroot, etc.

Crear un Plugin Utilizando Bake
-------------------------------

El proceso de creación de plugins puede simplificarse enormemente utilizando Bake.

Para hornear (bakear) un plugin, utiliza el siguiente comando:

.. code-block:: console

    bin/cake bake plugin ContactManager

Bake puede utilizarse para crear clases en tu plugin. Por ejemplo, para generar
un controlador de plugin podrías ejecutar:

.. code-block:: console

    bin/cake bake controller --plugin ContactManager Contacts


Por favor, consulta el capítulo
:doc:`/bake/usage` si tienes
problemas al utilizar la línea de comandos. Asegúrate de regenerar tu
cargador automático (autoloader) una vez que hayas creado tu plugin:

.. code-block:: console

    php composer.phar dumpautoload

.. _plugin-objects:

Objetos del Plugin
==================

Los Objetos de Plugin permiten a un autor de plugin definir lógica de configuración, ganchos (hooks) predeterminados, cargar rutas, middleware y comandos de consola. Los objetos de plugin se encuentran en
**src/<PluginName>Plugin.php**. Para nuestro plugin ContactManager, nuestra clase de plugin podría verse así::

    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Core\ContainerInterface;
    use Cake\Core\PluginApplicationInterface;
    use Cake\Console\CommandCollection;
    use Cake\Http\MiddlewareQueue;
    use Cake\Routing\RouteBuilder;

    class ContactManagerPlugin extends BasePlugin
    {

        /**
         * @inheritDoc
         */
        public function middleware(MiddlewareQueue $middleware): MiddlewareQueue
        {
            // Add middleware here.
            $middleware = parent::middleware($middleware);

            return $middleware;
        }

        /**
         * @inheritDoc
         */
        public function console(CommandCollection $commands): CommandCollection
        {
            // Add console commands here.
            $commands = parent::console($commands);

            return $commands;
        }

        /**
         * @inheritDoc
         */
        public function bootstrap(PluginApplicationInterface $app): void
        {
            // Add constants, load configuration defaults.
            // By default will load `config/bootstrap.php` in the plugin.
            parent::bootstrap($app);
        }

        /**
         * @inheritDoc
         */
        public function routes(RouteBuilder $routes): void
        {
            // Add routes.
            // By default will load `config/routes.php` in the plugin.
            parent::routes($routes);
        }

        /**
         * Register application container services.
         *
         * @param \Cake\Core\ContainerInterface $container The Container to update.
         * @return void
         * @link https://book.cakephp.org/5/en/development/dependency-injection.html#dependency-injection
         */
        public function services(ContainerInterface $container): void
        {
            // Add your services here
        }
    }

.. _plugin-routes:

Rutas del Plugin
================

Los plugins pueden proporcionar archivos de rutas que contienen sus propias rutas. Cada plugin puede contener un archivo **config/routes.php**. Este archivo de rutas se puede cargar cuando se agrega el plugin o en el archivo de rutas de la aplicación. Para crear las rutas del plugin ContactManager, coloca lo siguiente en **plugins/ContactManager/config/routes.php**::

    <?php
    use Cake\Routing\Route\DashedRoute;

    $routes->plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->setRouteClass(DashedRoute::class);

            $routes->get('/contacts', ['controller' => 'Contacts']);
            $routes->get('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'view']);
            $routes->put('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'update']);
        }
    );

Lo anterior conectará las rutas predeterminadas para tu plugin. Más adelante, puedes personalizar este archivo con rutas más específicas.

También puedes cargar las rutas del plugin en la lista de rutas de tu aplicación. Hacer esto te proporciona un mayor control sobre cómo se cargan las rutas del plugin y te permite envolver las rutas del plugin en ámbitos o prefijos adicionales::

    $routes->scope('/', function ($routes) {
        // Connect other routes.
        $routes->scope('/backend', function ($routes) {
            $routes->loadPlugin('ContactManager');
        });
    });

Lo anterior resultaría en URLs como ``/backend/contact-manager/contacts``.

Controladores del Plugin
========================

Los controladores para nuestro plugin ContactManager se almacenarán en **plugins/ContactManager/src/Controller/**. Dado que la principal tarea que realizaremos es gestionar contactos, necesitaremos un ContactsController para este plugin.

Entonces, colocamos nuestro nuevo ContactsController en **plugins/ContactManager/src/Controller** y se verá así::

    // plugins/ContactManager/src/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\AppController;

    class ContactsController extends AppController
    {
        public function index()
        {
            //...
        }
    }

También crea el controlador ``AppController`` si aún no lo tienes::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

El ``AppController`` de un plugin puede contener lógica de controlador común a todos los controladores en un plugin, pero no es obligatorio usarlo.

Si deseas acceder a lo que hemos hecho hasta ahora, visita ``/contact-manager/contacts``. Deberías obtener un error de "Modelo faltante" porque aún no hemos definido un modelo Contact.

Si tu aplicación incluye el enrutamiento predeterminado que proporciona CakePHP, podrás acceder a los controladores de tu plugin utilizando URLs como::

    // Access the index route of a plugin controller.
    /contact-manager/contacts

    // Any action on a plugin controller.
    /contact-manager/contacts/view/1

Si tu aplicación define prefijos de enrutamiento, el enrutamiento predeterminado de CakePHP también conectará rutas que utilizan el siguiente patrón::

    /{prefix}/{plugin}/{controller}
    /{prefix}/{plugin}/{controller}/{action}

Consulta la sección sobre :ref:`plugin-configuration` para obtener información sobre cómo cargar archivos de rutas específicos del plugin.

.. _plugin-models:

Modelos del Plugin
==================

Los modelos para el plugin se almacenan en **plugins/ContactManager/src/Model**.
Ya hemos definido un ContactsController para este plugin, así que creemos
la tabla y entidad para ese controlador::

    // plugins/ContactManager/src/Model/Entity/Contact.php:
    namespace ContactManager\Model\Entity;

    use Cake\ORM\Entity;

    class Contact extends Entity
    {
    }

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
    }

Si necesitas hacer referencia a un modelo dentro de tu plugin al establecer asociaciones o definir clases de entidad, debes incluir el nombre del plugin con el nombre de la clase, separados por un punto. Por ejemplo::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

Si prefieres que las claves del array para la asociación no tengan el prefijo del plugin, puedes utilizar la sintaxis alternativa::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

Puedes utilizar ``Cake\ORM\Locator\LocatorAwareTrait`` para cargar las tablas de tu plugin utilizando la familiar :term:`Sintaxis de plugin`::

    // Controllers already use LocatorAwareTrait, so you don't need this.
    use Cake\ORM\Locator\LocatorAwareTrait;

    $contacts = $this->fetchTable('ContactManager.Contacts');

Plantillas de Plugin
====================

Las vistas se comportan exactamente como lo hacen en las aplicaciones normales. Solo colócalas en la carpeta correcta dentro de la carpeta ``plugins/[NombreDelPlugin]/templates/``. Para nuestro plugin ContactManager, necesitaremos una vista para nuestra acción ``ContactsController::index()``, así que incluyámosla también::

    // plugins/ContactManager/templates/Contacts/index.php:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

Los plugins pueden proporcionar sus propios diseños. Para añadir diseños de plugin, coloca tus archivos de plantilla dentro de
``plugins/[NombreDelPlugin]/templates/layout``. Para usar un diseño de plugin en tu controlador, puedes hacer lo siguiente::

    $this->viewBuilder()->setLayout('ContactManager.admin');

Si se omite el prefijo del plugin, el archivo de diseño/vista se ubicará de forma normal.

.. nota::

    Para obtener información sobre cómo usar elementos de un plugin, consulta :ref:`view-elements`

Sobrescribir Plantillas de Plugin desde dentro de tu Aplicación
---------------------------------------------------------------

Puedes sobrescribir cualquier vista de un plugin desde dentro de tu aplicación usando rutas especiales. Si tienes un plugin llamado 'ContactManager', puedes sobrescribir los archivos de plantilla del plugin con lógica de vista específica de la aplicación creando archivos utilizando la siguiente plantilla **templates/plugin/[Plugin]/[Controlador]/[vista].php**. Para el controlador Contacts podrías crear el siguiente archivo::

    templates/plugin/ContactManager/Contacts/index.php

Crear este archivo te permitiría sobrescribir **plugins/ContactManager/templates/Contacts/index.php**.

Si tu plugin está en una dependencia de Composer (por ejemplo, 'Company/ContactManager'), la ruta a la vista 'index' del controlador Contacts será::

    templates/plugin/TheVendor/ThePlugin/Custom/index.php

Crear este archivo te permitiría sobrescribir **vendor/elproveedor/elplugin/templates/Custom/index.php**.

Si el plugin implementa un prefijo de enrutamiento, debes incluir el prefijo de enrutamiento en las sobrescrituras de plantillas de tu aplicación. Por ejemplo, si el plugin 'ContactManager' implementara un prefijo 'Admin', la ruta de sobrescritura sería::

    templates/plugin/ContactManager/Admin/ContactManager/index.php

.. _plugin-assets:


Recursos de Plugin
==================

Los recursos web de un plugin (pero no los archivos PHP) se pueden servir a través del directorio ``webroot`` del plugin, al igual que los recursos de la aplicación principal::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Puedes colocar cualquier tipo de archivo en cualquier directorio, al igual que en un webroot regular.

.. advertencia::

    Manejar recursos estáticos (como imágenes, archivos JavaScript y CSS)
    a través del Dispatcher es muy ineficiente. Consulta :ref:`symlink-assets`
    para obtener más información.

Enlazar a Recursos en Plugins
-----------------------------

Puedes utilizar la :term:`Sintaxis de plugin` al enlazar a recursos de plugins utilizando los métodos script, image o css del :php:class:`~Cake\\View\\Helper\\HtmlHelper`::

    // Generates a URL of /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Generates a URL of /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Generates a URL of /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Los recursos de los plugins se sirven por defecto utilizando el middleware ``AssetMiddleware``. Esto solo se recomienda para desarrollo. En producción, debes :ref:`crear enlaces simbólicos para los recursos del plugin <symlink-assets>` para mejorar el rendimiento.

Si no estás usando los ayudantes (helpers), puedes agregar /nombre-del-plugin/ al principio de la URL para un recurso dentro del plugin y servirlo de esa manera. Enlazar a '/contact_manager/js/some_file.js' serviría el recurso **plugins/ContactManager/webroot/js/some_file.js**.

Componentes, Helpers y Behaviours
=================================

Un plugin puede tener Componentes, Helpers y Behaviours, al igual que una aplicación de CakePHP. Incluso puedes crear plugins que consistan solo en Componentes, Helpers y Behaviours, lo que puede ser una excelente manera de construir componentes reutilizables que se pueden integrar en cualquier proyecto.

La construcción de estos componentes es exactamente igual a construirlos dentro de una aplicación regular, sin ninguna convención de nomenclatura especial.

Hacer referencia a tu componente desde dentro o fuera de tu plugin solo requiere que agregues el nombre del plugin antes del nombre del componente. Por ejemplo::

    // Component defined in 'ContactManager' plugin
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // Within your controllers
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }

La misma técnica se aplica a Ayudantes y Comportamientos.

.. _plugin-commands:

Comandos
========

Los plugins pueden registrar sus comandos dentro del gancho ``console()``. Por defecto, todos los comandos de consola en el plugin se descubren automáticamente y se añaden a la lista de comandos de la aplicación. Los comandos de los plugins llevan el prefijo del nombre del plugin. Por ejemplo, el ``UserCommand`` proporcionado por el plugin ``ContactManager`` se registraría tanto como ``contact_manager.user`` como ``user``. El nombre sin prefijo solo será tomado por un plugin si no es utilizado por la aplicación o por otro plugin.

Puedes personalizar los nombres de los comandos definiendo cada comando en tu plugin::

    public function console($commands)
    {
        // Create nested commands
        $commands->add('bake model', ModelCommand::class);
        $commands->add('bake controller', ControllerCommand::class);

        return $commands;
    }

Probar tu Plugin
================

Si estás probando controladores o generando URL, asegúrate de que tu
plugin conecte las rutas en ``tests/bootstrap.php``.

Para obtener más información, consulta la página de :doc:`pruebas de plugins </development/testing>`.

Publicar tu Plugin
==================

Los plugins de CakePHP deben publicarse en `Packagist <https://packagist.org>`__. De esta manera, otras personas pueden usarlo como dependencia de Composer. También puedes proponer tu plugin a la lista de `awesome-cakephp <https://github.com/FriendsOfCake/awesome-cakephp>`_.

Elige un nombre semánticamente significativo para el nombre del paquete. Idealmente, este debería llevar el prefijo del framework, en este caso "cakephp" como el framework. El nombre del proveedor generalmente será tu nombre de usuario de GitHub. **No** uses el espacio de nombres de CakePHP (cakephp), ya que está reservado para los plugins propiedad de CakePHP. La convención es usar letras minúsculas y guiones como separadores.

Entonces, si creaste un plugin "Logging" con tu cuenta de GitHub "FooBar", un buen nombre sería `foo-bar/cakephp-logging`.
Y el plugin propiedad de CakePHP llamado "Localized" se puede encontrar bajo `cakephp/localized`, respectivamente.

.. index:: vendor/cakephp-plugins.php

Archivo de Mapeo del Plugin
===========================

Cuando instalas plugins a través de Composer, es posible que notes que se crea **vendor/cakephp-plugins.php**. Este archivo de configuración contiene un mapa de nombres de plugins y sus rutas en el sistema de archivos. Permite que los plugins se instalen en el directorio estándar del proveedor que está fuera de las rutas de búsqueda normales. La clase ``Plugin`` utilizará este archivo para localizar plugins cuando se carguen con ``addPlugin()``. En general, no necesitarás editar este archivo manualmente, ya que Composer y el paquete ``plugin-installer`` se encargarán de gestionarlo por ti.

Gestiona tus Plugins usando Mixer
=================================

Otra forma de descubrir y gestionar plugins en tu aplicación de CakePHP es a través de `Mixer <https://github.com/CakeDC/mixer>`_. Es un plugin de CakePHP que te ayuda a instalar plugins desde Packagist. También te ayuda a gestionar tus plugins existentes.

.. note::

    IMPORTANTE: No uses esto en un entorno de producción.

.. meta::
    :title lang=es: Plugins
    :keywords lang=es: plugins, controladores, modelos, vistas, paquete, aplicación
