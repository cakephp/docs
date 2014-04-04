Plugins
#######

CakePHP allows you to set up a combination of controllers, models,
and views and release them as a packaged application plugin that
others can use in their CakePHP applications. Have a great user
management module, simple blog, or web services module in one of
your applications? Package it as a CakePHP plugin so you can reuse it
in other applications and share with the community.

The main tie between a plugin and the application it has been
installed into is the application's configuration (database
connection, etc.). Otherwise, it operates in its own space,
behaving much like it would if it were an application on its own.

In CakePHP 3.0 each plugin defines its own top-level namespace. For example:
``DebugKit``. By convention, plugins use their package name as their namespace.
If you'd like to use a different namespace, you can configure how plugins are
loaded.

Installing a Plugin
===================

Many plugins are available on `Packagist <http://packagist.org>`_
and can be installed with ``Composer``. To install DebugKit, you
would do the following::

    php composer.phar require cakephp/debug_kit

This would install the latest version of DebugKit and update your
``composer.json``, ``composer.lock`` file, and update your autoloader. If
the plugin you want to install is not available on packagist.org, you can clone
or copy the plugin code into your ``/Plugin`` directory. Assuming you want to install
a plugin named 'ContactManager', you should have a folder in ``/Plugin``
named 'ContactManager'. In this directory are the plugin's View, Model, Controller,
webroot, and any other directories.

By default the application skeleton will include catch-all autoloading for
plugins using PSR-0 standards. This means that a class called
``ContactManager\Controller\ContactsController`` would be located in
``/Plugin/ContactManager/Controller/ContactsController.php``. You can customize
the autoloader by updating your application's composer.json and re-generating
the autoloader. For example if you wanted your ContactManager's Controller
classname to be ``AcmeCorp\ContactManager\Controller\ContactsController.php``,
but keep the filename as it was in the previous example you would add the
following to your composer.json::

    "psr-4": {
        "App\\": "App",
        "App\\Test\\": "Test",
        "AcmeCorp\\ContactManager\\": "/Plugin/ContactManager",
        "": "./Plugin"
    }

Once added, you would need to regenerate your autoloader::

    $ php composer.phar dumpautoload

Loading a Plugin
================

After installing a plugin and setting up the autoloader, you may need to load
the plugin. You can load plugins one by one, or all of them with a single
method::

    // Loads a single plugin
    Plugin::load('ContactManager');

    // Loads a single plugin, with a custom namespace.
    Plugin::load('ContactManager', [
        'namespace' => 'AcmeCorp\ContactManager'
    ]);

    // Loads all plugins at once
    Plugin::loadAll();

``loadAll()`` loads all plugins available, while allowing you to set certain
settings for specific plugins. ``load()`` works similarly, but only loads the
plugins you explicitly specify.

When to Load Plugins
--------------------

You do not need to load every plugin your application uses. If your plugins use
the conventional namespace and filesystem layout you **do not** need to use
``Plugin::load()`` in order to load and use components, helpers, behaviors,
other class based code, or render views from the plugin.

You **do** need to load a plugin when you want to access its controllers,
webroot assets, or console commands. You will also need to load a plugin if the
plugin is using a non-conventional namespace.

.. _plugin-configuration:

Plugin Configuration
====================

There is a lot you can do with the ``load`` and ``loadAll`` methods to help with
plugin configuration and routing. Perhaps you want to load all plugins
automatically, while specifying custom routes and bootstrap files for
certain plugins::

    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

With this style of configuration, you no longer need to manually
``include()`` or ``require()`` a plugin's configuration or routes file -- it happens
automatically at the right time and place. The exact same parameters could
have also been supplied to the ``load()`` method, which would have loaded only those
three plugins, and not the rest.

Finally, you can also specify a set of defaults for ``loadAll()`` which will
apply to every plugin that doesn't have a more specific configuration.

Load the bootstrap file from all plugins, and the routes from the Blog plugin::

    Plugin::loadAll([
        ['bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

Note that all files specified should actually exist in the configured
plugin(s) or PHP will give warnings for each file it cannot load. You can avoid
potential warnings by using the ``ignoreMissing`` option::

    Plugin::loadAll([
        ['ignoreMissing' => true, 'bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

By default the namespace of the Plugin should match the plugin name. If this is
not the case, you can use the ``namespace`` option to provide a different
namespace. For example you have a Users plugin that actually uses
``Jose\\Users`` as its namespace::

    Plugin::load('Users', ['namespace' => 'Jose\Users']);

This will ensure that classnames are resolved properly when using
:term:`plugin syntax`.

Most plugins will indicate the proper procedure for configuring
them and setting up the database in their documentation. Some
plugins will require more setup than others.

Using Plugins
=============

You can reference a plugin's controllers, models, components,
behaviors, and helpers by prefixing the name of the plugin before
the class name.

For example, say you wanted to use the ContactManager plugin's
ContactInfoHelper to output some pretty contact information in
one of your views. In your controller, your ``$helpers`` array
could look like this::

    public $helpers = ['ContactManager.ContactInfo'];

You would then be able to access the ContactInfoHelper just like
any other helper in your view, such as::

    echo $this->ContactInfo->address($contact);

Creating Your Own Plugins
=========================

As a working example, let's begin to create the ContactManager
plugin referenced above. To start out, we'll set up our plugin's
basic directory structure. It should look like this::

    /App
    /Plugin
        /ContactManager
            /Controller
                /Component
            /Model
                /Table
                /Entity
                /Behavior
            /View
                /Helper
            /Template
                /Layout

Note the name of the plugin folder, '**ContactManager**'. It is important
that this folder has the same name as the plugin.

Inside the plugin folder, you'll notice it looks a lot like a CakePHP
application, and that's basically what it is. You don't have to
include any of the folders you are not using. Some plugins might
only define a Component and a Behavior, and in that case they can completely
omit the 'View' directory.

A plugin can also have basically any of the other directories that your
application can, such as Config, Console, webroot, etc.

If you want to be able to access your plugin with a URL, defining an
AppController and AppModel for the plugin is required. These two special classes
are named after the plugin, and extend the parent application's AppController
and AppModel. Here's what they should look like for our ContactManager example::

    // /Plugin/ContactManager/Controller/ContactManagerAppController.php:
    namespace ContactManager\Controller;

    use App\Controller\Controller;

    class ContactManagerAppController extends AppController {
    }

    // /Plugin/ContactManager/Model/ContactManagerAppModel.php:
    namespace ContactManager\Model;

    use App\Model\AppModel;

    class ContactManagerAppModel extends AppModel {
    }

If you forgot to define these special classes, CakePHP will hand
you "Missing Controller" errors until you've done so.

Please note that the process of creating plugins can be greatly
simplified by using the bake shell.

In order to bake a plugin please use the following command::

    $ Console/cake bake plugin ContactManager

Now you can bake using the same conventions which apply to the rest
of your app. For example - baking controllers::

    $ Console/cake bake controller --plugin ContactManager Contacts

Please refer to the chapter
:doc:`/console-and-shells/code-generation-with-bake` if you
have any problems with using the command line.

.. warning::

    Plugins do not work as namespacing to separate code.
    Due to PHP lacking namespaces in older versions 
    you cannot have the same class,
    or same filename, in your plugins.
    Even if it is two different plugins.
    So use unique classes and filenames, possible prefixing
    the class and filename with the plugin name.
    

Plugin Controllers
==================

Controllers for our ContactManager plugin will be stored in
``/Plugin/ContactManager/Controller/``. Since the main thing we'll
be doing is managing contacts, we'll need a ContactsController for
this plugin.

So, we place our new ContactsController in
``/Plugin/ContactManager/Controller`` and it looks like so::

    // /Plugin/ContactManager/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\ContactManagerAppController;

    class ContactsController extends ContactManagerAppController {

        public function index() {
            //...
        }
    }

.. note::

    This controller extends the plugin's AppController (called
    ContactManagerAppController) rather than the parent application's
    AppController.

    Also note how the name of the model is prefixed with the name of
    the plugin. This is required to differentiate between models in
    the plugin and models in the main application.

If you want to access what we've got going thus far, visit
``/contact_manager/contacts``. You should get a "Missing Model" error
because we don't have a Contact model defined yet.

If your application includes the default routing CakePHP provides you will be
able to access your plugin controllers using URLs like::

    // Access the index route of a plugin controller.
    /contact_manager/contacts

    // Any action on a plugin controller.
    /contact_manager/contacts/view/1

If your application defines routing prefixes, CakePHP's default routing will
also connect routes that use the following pattern::

    /:prefix/:plugin/:controller
    /:prefix/:plugin/:controller/:action

See the section on :ref:`plugin-configuration` for information on how to load
plugin specific route files.

.. _plugin-models:

Plugin Models
=============

Models for the plugin are stored in ``/Plugin/ContactManager/Model``.
We've already defined a ContactsController for this plugin, so let's
create the table and entity for that controller::

    // /Plugin/ContactManager/Model/Entity/Contact.php:
    namespace ContactManager\Model\Entity;

    use Cake\ORM\Entity;

    class Contact extends Entity {
    }

    // /Plugin/ContactManager/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table {
    }

If you need to reference a model within your plugin when building associations,
or defining entitiy classes, you need to include the plugin name with the class
name, separated with a dot. For example::

    // /Plugin/ContactManager/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table {
        public function initialize(array $config) {
            $this->hasMany('ContactManager.AltName');
        }
    }

If you would prefer that the array keys for the association not have the plugin
prefix on them, use the alternative syntax::

    // /Plugin/ContactManager/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table {
        public function initialize(array $config) {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

You can use ``TableRegistry`` to load your plugin tables using the familiar
:term:`plugin syntax`::

    use Cake\ORM\TableRegistry;

    $contacts = TableRegistry::get('ContactManager.Contacts');

Visiting ``/contact_manager/contacts`` now (given you've got a table in your
database called 'contacts') should give us a "Missing View" error.  Let's create
that next.


Plugin Views
============

Views behave exactly as they do in normal applications. Just place them in the
right folder inside of the ``/Plugin/[PluginName]/Template/`` folder. For our
ContactManager plugin, we'll need a view for our ``ContactsController::index()``
action, so let's include that as well::

    // /Plugin/ContactManager/Template/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

Plugins can provide their own layouts. Add plugin layouts, inside
``/Plugin/[PluginName]/Template/Layout``. To use a plugin layout in your controller
you can do the following::

    public $layout = 'ContactManager.admin';

If the plugin prefix is omitted, the layout/view file will be located normally.

.. note::

    For information on how to use elements from a plugin, look up
    :ref:`view-elements`

Overriding Plugin Views from Inside Your Application
----------------------------------------------------

You can override any plugin views from inside your app using special paths. If
you have a plugin called 'ContactManager' you can override the view files of the
plugin with more application specific view logic by creating files using the
following template ``App/Template/Plugin/[Plugin]/[Controller]/[view].ctp``. For the
Contacts controller you could make the following file::

    /App/Template/Plugin/ContactManager/Contacts/index.ctp

Creating this file, would allow you to override
``/Plugin/ContactManager/Template/Contacts/index.ctp``.

.. _plugin-assets:


Plugin Assets
=============

A plugin's web assets (but not PHP files) can be served through the plugin's
``webroot`` directory, just like the main application's assets::

    /Plugin/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

You may put any type of file in any directory, just like a regular webroot.

.. warning::

    Handling static assets, such as images, JavaScript and CSS files,
    through the Dispatcher is very inefficient. See :ref:`symlink-assets`
    for more information.


Linking to Assets in Plugins
----------------------------

You can use the :term:`plugin syntax` when linking to plugin assets using the
:php:class:`~Cake\\View\\Helper\\HtmlHelper`'s script, image, or css methods::

    // Generates a url of /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Generates a url of /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Generates a url of /contact_manager/img/logo.js
    echo $this->Html->image('ContactManager.logo');

Plugin assets are served using the ``AssetDispatcher`` middleware by default.
This is only recommended for development. In production you should
:ref:`symlink plugin assets <symlink-assets>` to improve performance.

If you are not using the helpers, you can prepend /plugin_name/ to the beginning
of a the URL for an asset within that plugin to serve it. Linking to
'/contact_manager/js/some_file.js' would serve the asset
``Plugin/ContactManager/webroot/js/some_file.js``.

Components, Helpers and Behaviors
=================================

A plugin can have Components, Helpers and Behaviors just like a regular CakePHP
application. You can even create plugins that consist only of Components,
Helpers or Behaviors which can be a great way to build reusable components that
can easily be dropped into any project.

Building these components is exactly the same as building it within a regular
application, with no special naming convention.

Referring to your component from inside or outside of your plugin requires only
that you prefix the plugin name before the name of the component. For example::

    // Component defined in 'ContactManager' plugin
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component {
    }

    // within your controllers:
    public $components = ['ContactManager.Example'];

The same technique applies to Helpers and Behaviors.


Expand Your Plugin
==================

This example created a good start for a plugin, but there is a lot
more that you can do. As a general rule, anything you can do with your
application, you can do inside of a plugin instead.

Go ahead, include some third-party libraries in 'Vendor', add some
new shells to the cake console, and don't forget to create test cases
so your plugin users can automatically test your plugin's functionality!

In our ContactManager example, we might create add/remove/edit/delete
actions in the ContactsController, implement validation in the Contact
model, and implement the functionality one might expect when managing
their contacts. It's up to you to decide what to implement in your
plugins. Just don't forget to share your code with the community so
that everyone can benefit from your awesome, reusable components!

.. meta::
    :title lang=en: Plugins
    :keywords lang=en: plugin folder,configuration database,bootstrap,management module,little space,database connection,webroot,user management,contactmanager,array,config,cakephp,models,php,directories,blog,plugins,applications
