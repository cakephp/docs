Plugins
#######

CakePHP allows you to set up a combination of controllers, models,
and views and release them as a pre-packaged application plugin that
others can use in their CakePHP applications. If you've created
great user management, a simple blog, or web service adapters in one of
your applications, why not package it as a CakePHP plugin? This way you
can reuse it in your other applications, and share with the community!

A CakePHP plugin is separate from the host application itself and generally
provides some well-defined functionality that can be packaged up neatly, and
reused with little effort in other applications. The application and the plugin
operate in their own respective spaces, but share the application's
configuration data (for example, database connections, email transports)

Plugin should define their own top-level namespace. For example:
``DebugKit``. By convention, plugins use their package name as their namespace.
If you'd like to use a different namespace, you can configure the plugin
namespace, when plugins are loaded.

Installing a Plugin With Composer
=================================

Many plugins are available on `Packagist <https://packagist.org>`_
and can be installed with ``Composer``. To install DebugKit, you
would do the following:

.. code-block:: console

    php composer.phar require cakephp/debug_kit

This would install the latest version of DebugKit and update your
**composer.json**, **composer.lock** file, update
**vendor/cakephp-plugins.php**, and update your autoloader.

Manually Installing a Plugin
============================

If the plugin you want to install is not available on
packagist.org, you can clone or copy the plugin code into your **plugins**
directory. Assuming you want to install a plugin named 'ContactManager', you
should have a folder in **plugins** named 'ContactManager'. In this directory
are the plugin's src, tests and any other directories.

.. _autoloading-plugin-classes:

Manually Autoloading Plugin Classes
-----------------------------------

If you install your plugins via ``composer`` or ``bake`` you shouldn't need to
configure class autoloading for your plugins.

If you create a plugin manually under the ``plugins`` folder then will need to
tell ``composer`` to refresh its autoloading cache:

.. code-block:: console

    php composer.phar dumpautoload

If you are using vendor namespaces for your plugins, you'll have to add the
namespace to path mapping to the ``composer.json`` resembling the following
before running the above composer command:

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

Loading a Plugin
================

If you want to use a plugin's routes, console commands, middlewares, event
listeners, templates or webroot assets you will need to load the plugin.

If you just want to use helpers, behaviors or components from a plugin you do
not need to explicitly load a plugin yet it's recommended to always do so.

There is also a handy console command to load the plugin. Execute the following
line:

.. code-block:: console

    bin/cake plugin load ContactManager

This would update the array in your application's ``config/plugins.php`` with
an entry similar to ``'ContactManager' => []``.

.. _plugin-configuration:

Plugin Hook Configuration
=========================

Plugins offer several hooks that allow a plugin to inject itself into the
appropriate parts of your application. The hooks are:

* ``bootstrap`` Used to load plugin default configuration files, define
  constants and other global functions. The ``bootstrap`` method is passed the
  current ``Application`` instance giving you broad access to the DI container
  and configuration.
* ``routes`` Used to load routes for a plugin. Fired after application routes
  are loaded.
* ``middleware`` Used to add plugin middleware to an application's middleware
  queue.
* ``console`` Used to add console commands to an application's command
  collection.
* ``services`` Used to register application container service. This is a good
  opportunity to setup additional objects that need acccess to the container.

By default all plugins hooks are enabled. You can disable hooks by using the
related options of the ``plugin load`` command:

.. code-block:: console

    bin/cake plugin load ContactManager --no-routes

This would update the array in your application's ``config/plugins.php`` with
an entry similar to ``'ContactManager' => ['routes' => false]``.

Plugin Loading Options
======================

Apart from the options for plugin hooks the ``plugin load`` command has the
following options to control plugin loading:

- ``--only-debug`` Load the plugin only when debug mode is enabled.
- ``--only-cli`` Load the plugin only for CLI.
- ``--optional`` Do not throw an error if the plugin is not available.

Loading plugins through ``Application::bootstrap()``
====================================================

Apart from the config array in ``config/plugins.php``, plugins can also be
loaded in your application's ``bootstrap()`` method::

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

You can configure hooks with array options, or the methods provided by plugin
classes::

    // In Application::bootstrap()
    use ContactManager\ContactManagerPlugin;

    // Use the disable/enable to configure hooks.
    $plugin = new ContactManagerPlugin();

    $plugin->disable('bootstrap');
    $plugin->enable('routes');
    $this->addPlugin($plugin);

Plugin classes also know their names and path information::

    $plugin = new ContactManagerPlugin();

    // Get the plugin name.
    $name = $plugin->getName();

    // Path to the plugin root, and other paths.
    $path = $plugin->getPath();
    $path = $plugin->getConfigPath();
    $path = $plugin->getClassPath();

Using Plugin Classes
====================

You can reference a plugin's controllers, models, components, behaviors, and
helpers by prefixing the name of the plugin.

For example, say you wanted to use the ContactManager plugin's
``ContactInfoHelper`` to output formatted contact information in
one of your views. In your controller, using ``addHelper()``
could look like this::

    $this->viewBuilder()->addHelper('ContactManager.ContactInfo');

.. note::
    This dot separated class name is referred to as :term:`plugin syntax`.

You would then be able to access the ``ContactInfoHelper`` just like
any other helper in your view, such as::

    echo $this->ContactInfo->address($contact);

Plugins can use the models, components, behaviors and helpers provided by the
application, or other plugins if necessary::

   // Use an application component
   $this->loadComponent('AppFlash');

   // Use another plugin's behavior
   $this->addBehavior('OtherPlugin.AuditLog');

.. _plugin-create-your-own:

Creating Your Own Plugins
=========================

As a working example, let's begin to create the ContactManager
plugin referenced above. To start out, we'll set up our plugin's
basic directory structure. It should look like this::

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

Note the name of the plugin folder, '**ContactManager**'. It is important
that this folder has the same name as the plugin.

Inside the plugin folder, you'll notice it looks a lot like a CakePHP
application, and that's basically what it is. Just instead of an ``Application.php``
you have a ``ContactManagerPlugin.php``. You don't have to
include any of the folders you are not using. Some plugins might
only define a Component and a Behavior, and in that case they can completely
omit the 'templates' directory.

A plugin can also have basically any of the other directories that your
application can, such as Config, Console, webroot, etc.

Creating a Plugin Using Bake
----------------------------

The process of creating plugins can be greatly simplified by using bake.

In order to bake a plugin, use the following command:

.. code-block:: console

    bin/cake bake plugin ContactManager

Bake can be used to create classes in your plugin. For example to generate
a plugin controller you could run:

.. code-block:: console

    bin/cake bake controller --plugin ContactManager Contacts

Please refer to the chapter
:doc:`/bake/usage` if you
have any problems with using the command line. Be sure to re-generate your
autoloader once you've created your plugin:

.. code-block:: console

    php composer.phar dumpautoload

.. _plugin-objects:

Plugin Classes
==============

Plugin classes allow a plugin author to define set-up logic, define default
hooks, load routes, middleware and console commands. Plugin classes live in
**src/{PluginName}Plugin.php**. For our ContactManager plugin, our plugin class could look
like::

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

Plugin Routes
=============

Plugins can provide routes files containing their routes. Each plugin can
contain a **config/routes.php** file. This routes file can be loaded when the
plugin is added, or in the application's routes file. To create the
ContactManager plugin routes, put the following into
**plugins/ContactManager/config/routes.php**::

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

The above will connect default routes for your plugin. You can customize this
file with more specific routes later on.

You can also load plugin routes in your application's routes list. Doing this
provides you more control on how plugin routes are loaded and allows you to wrap
plugin routes in additional scopes or prefixes::

    $routes->scope('/', function ($routes) {
        // Connect other routes.
        $routes->scope('/backend', function ($routes) {
            $routes->loadPlugin('ContactManager');
        });
    });

The above would result in URLs like ``/backend/contact-manager/contacts``.

Plugin Controllers
==================

Controllers for our ContactManager plugin will be stored in
**plugins/ContactManager/src/Controller/**. Since the main thing we'll
be doing is managing contacts, we'll need a ContactsController for
this plugin.

So, we place our new ContactsController in
**plugins/ContactManager/src/Controller** and it looks like so::

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

Also make the ``AppController`` if you don't have one already::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

A plugin's ``AppController`` can hold controller logic common to all controllers
in a plugin but is not required if you don't want to use one.

If you want to access what we've got going thus far, visit
``/contact-manager/contacts``. You should get a "Missing Model" error
because we don't have a Contact model defined yet.

If your application includes the default routing CakePHP provides you will be
able to access your plugin controllers using URLs like::

    // Access the index route of a plugin controller.
    /contact-manager/contacts

    // Any action on a plugin controller.
    /contact-manager/contacts/view/1

If your application defines routing prefixes, CakePHP's default routing will
also connect routes that use the following pattern::

    /{prefix}/{plugin}/{controller}
    /{prefix}/{plugin}/{controller}/{action}

See the section on :ref:`plugin-configuration` for information on how to load
plugin specific route files.

.. _plugin-models:

Plugin Models
=============

Models for the plugin are stored in **plugins/ContactManager/src/Model**.
We've already defined a ContactsController for this plugin, so let's
create the table and entity for that controller::

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

If you need to reference a model within your plugin when building associations
or defining entity classes, you need to include the plugin name with the class
name, separated with a dot. For example::

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

If you would prefer that the array keys for the association not have the plugin
prefix on them, use the alternative syntax::

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

You can use ``Cake\ORM\Locator\LocatorAwareTrait`` to load your plugin tables using the familiar
:term:`plugin syntax`::

    // Controllers already use LocatorAwareTrait, so you don't need this.
    use Cake\ORM\Locator\LocatorAwareTrait;

    $contacts = $this->fetchTable('ContactManager.Contacts');

Plugin Templates
================

Views behave exactly as they do in normal applications. Just place them in the
right folder inside of the ``plugins/[PluginName]/templates/`` folder. For our
ContactManager plugin, we'll need a view for our ``ContactsController::index()``
action, so let's include that as well::

    // plugins/ContactManager/templates/Contacts/index.php:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

Plugins can provide their own layouts. To add plugin layouts, place your template files inside
``plugins/[PluginName]/templates/layout``. To use a plugin layout in your controller
you can do the following::

    $this->viewBuilder()->setLayout('ContactManager.admin');

If the plugin prefix is omitted, the layout/view file will be located normally.

Plugin Elements
---------------

To render an element from a plugin, use the :term:`plugin syntax` to reference
a plugin. You do not need to use plugin syntax for elements in the current active plugin.

If the element doesn't exist in the plugin, it will look in the main APP
folder::

    echo $this->element('Contacts.helpbox');

If your view is a part of a plugin, you can omit the plugin name. For example,
if you are in the ``ContactsController`` of the Contacts plugin, the following::

    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

are equivalent and will result in the same element being rendered.

For elements inside subfolder of a plugin
(for example, **plugins/Contacts/Template/element/sidebar/helpbox.php**), use the
following::

    echo $this->element('Contacts.sidebar/helpbox');

.. note::
    See :ref:`view-elements` for more information on rendering elements.


Overriding Plugin Templates from Inside Your Application
--------------------------------------------------------

You can override any plugin views from inside your app using special paths. If
you have a plugin called 'ContactManager' you can override the template files of the
plugin with application specific view logic by creating files using the
following template **templates/plugin/[Plugin]/[Controller]/[view].php**. For the
Contacts controller you could make the following file::

    templates/plugin/ContactManager/Contacts/index.php

Creating this file would allow you to override
**plugins/ContactManager/templates/Contacts/index.php**.

To override plugin elements, create an element with the same name in::

    templates/plugin/ContactManager/element/helpbox.php

This file would override
**plugins/ContactManager/tempaltes/element/helpbox.ctp**.

If your plugin is in a composer dependency (i.e. 'Company/ContactManager'), the
path to the 'index' view of the Contacts controller will be::

    templates/plugin/TheVendor/ThePlugin/Custom/index.php

Creating this file would allow you to override
**vendor/thevendor/theplugin/templates/Custom/index.php**.

If the plugin implements a routing prefix, you must include the routing prefix
in your application template overrides. For example, if the 'ContactManager'
plugin implemented an 'Admin' prefix the overriding path would be::

    templates/plugin/ContactManager/Admin/ContactManager/index.php

.. _plugin-assets:

Plugin Assets
=============

A plugin's web assets (but not PHP files) can be served through the plugin's
``webroot`` directory, just like the main application's assets::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

You may put any type of file in any directory, just like a regular webroot.

.. warning::

    Handling static assets (such as images, JavaScript and CSS files)
    through the Dispatcher is very inefficient. See :ref:`symlink-assets`
    for more information.

Linking to Assets in Plugins
----------------------------

You can use the :term:`plugin syntax` when linking to plugin assets using the
:php:class:`~Cake\\View\\Helper\\HtmlHelper`'s script, image, or css methods::

    // Generates a URL of /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Generates a URL of /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Generates a URL of /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Plugin assets are served using the ``AssetMiddleware`` middleware by default.
This is only recommended for development. In production you should
:ref:`symlink plugin assets <symlink-assets>` to improve performance.

If you are not using the helpers, you can prepend /plugin-name/ to the beginning
of the URL for an asset within that plugin to serve it. Linking to
'/contact_manager/js/some_file.js' would serve the asset
**plugins/ContactManager/webroot/js/some_file.js**.

Components, Helpers and Behaviors
=================================

A plugin can have Components, Helpers and Behaviors just like a CakePHP
application. You can even create plugins that consist only of Components,
Helpers or Behaviors which can be a great way to build reusable components that
can be dropped into any project.

Building these components is exactly the same as building it within a regular
application, with no special naming convention.

Referring to your component from inside or outside of your plugin requires only
that you prefix the plugin name before the name of the component. For example::

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

The same technique applies to Helpers and Behaviors.

.. _plugin-commands:

Commands
========

Plugins can register their commands inside the ``console()`` hook. By default
all console commands in the plugin are auto-discovered and added to the
application's command list. Plugin commands are prefixed with the plugin name.
For example, the ``UserCommand`` provided by the ``ContactManager`` plugin would
be registered as both ``contact_manager.user`` and ``user``. The un-prefixed
name will only be taken by a plugin if it is not used by the application, or
another plugin.

You can customize the command names by defining each command in your plugin::

    public function console($commands)
    {
        // Create nested commands
        $commands->add('bake model', ModelCommand::class);
        $commands->add('bake controller', ControllerCommand::class);

        return $commands;
    }


Testing your Plugin
===================

If you are testing controllers or generating URLs, make sure your
plugin connects routes ``tests/bootstrap.php``.

For more information see :doc:`testing plugins </development/testing>` page.

Publishing your Plugin
======================

CakePHP plugins should be published to `the packagist
<https://packagist.org>`__. This way other people can use it as composer
dependency.  You can also propose your plugin to the `awesome-cakephp list
<https://github.com/FriendsOfCake/awesome-cakephp>`_.

Choose a semantically meaningful name for the package name. This should ideally
be prefixed with the dependency, in this case "cakephp" as the framework.
The vendor name will usually be your GitHub username.
Do **not** use the CakePHP namespace (cakephp) as this is reserved to CakePHP
owned plugins. The convention is to use lowercase letters and dashes as separator.

So if you created a plugin "Logging" with your GitHub account "FooBar", a good
name would be `foo-bar/cakephp-logging`.
And the CakePHP owned "Localized" plugin can be found under `cakephp/localized`
respectively.

.. index:: vendor/cakephp-plugins.php

Plugin Map File
===============

When installing plugins via Composer, you may notice that
**vendor/cakephp-plugins.php** is created. This configuration file contains
a map of plugin names and their paths on the filesystem. It makes it possible
for plugins to be installed into the standard vendor directory which is outside
of the normal search paths. The ``Plugin`` class will use this file to locate
plugins when they are loaded with ``addPlugin()``. You generally
won't need to edit this file by hand, as Composer and the ``plugin-installer``
package will manage it for you.


Manage Your Plugins using Mixer
===============================

Another way to discover and manage plugins into your CakePHP application is
`Mixer <https://github.com/CakeDC/mixer>`_. It is a CakePHP plugin which helps
you to install plugins from Packagist. It also helps you to manage your existing
plugins.

.. note::

    IMPORTANT: Do not use this in production environment.

.. meta::
    :title lang=en: Plugins
    :keywords lang=en: plugin folder,plugins,controllers,models,views,package,application,database connection,little space
