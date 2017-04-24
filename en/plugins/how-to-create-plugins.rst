How To Create Plugins
#####################

As a working example from the :doc:`/plugins/how-to-use-plugins` section, let's
begin to create a ContactManager plugin. To start out, we'll set up our plugin's
basic directory structure. It should look like this::

    /app
        /Plugin
            /ContactManager
                /Controller
                    /Component
                /Model
                    /Behavior
                /View
                    /Helper
                    /Layouts

Note the name of the plugin folder, '**ContactManager**'. It is important
that this folder has the same name as the plugin.

Inside the plugin folder, you'll notice it looks a lot like a CakePHP
application, and that's basically what it is. You don't actually have to
include any of those folders if you do not use them. Some plugins might
only define a Component and a Behavior, and in that case they can completely
omit the 'View' directory.

A plugin can also have basically any of the other directories that your
application can, such as Config, Console, Lib, webroot, etc.

.. note::

    If you want to be able to access your plugin with a URL, defining
    an AppController and AppModel for the plugin is required. These
    two special classes are named after the plugin, and extend the
    parent application's AppController and AppModel. Here's what they
    should look like for our ContactManager example:

::

    // In /app/Plugin/ContactManager/Controller/ContactManagerAppController.php

    class ContactManagerAppController extends AppController {
    }

::

    // In /app/Plugin/ContactManager/Model/ContactManagerAppModel.php

    class ContactManagerAppModel extends AppModel {
    }

If you forgot to define these special classes, CakePHP will hand
you "Missing Controller" errors until you've done so.

Please note that the process of creating plugins can be greatly
simplified by using the Cake shell.

In order to bake a plugin please use the following command::

    user@host$ cake bake plugin ContactManager

Now you can bake using the same conventions which apply to the rest
of your app. For example - baking controllers::

    user@host$ cake bake controller Contacts --plugin ContactManager

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
/app/Plugin/ContactManager/Controller/. Since the main thing we'll
be doing is managing contacts, we'll need a ContactsController for
this plugin.

So, we place our new ContactsController in
/app/Plugin/ContactManager/Controller and it looks like so::

    // In app/Plugin/ContactManager/Controller/ContactsController.php

    class ContactsController extends ContactManagerAppController {
        public $uses = array('ContactManager.Contact');

        public function index() {
            // ...
        }
    }

.. note::

    This controller extends the plugin's AppController (called
    ContactManagerAppController) rather than the parent application's
    AppController.

    Also note how the name of the model is prefixed with the name of
    the plugin. This is required to differentiate between models in
    the plugin and models in the main application.

    In this case, the $uses array would not be required as
    ContactManager.Contact would be the default model for this
    controller, however it is included to demonstrate how to
    properly prepend the plugin name.

If you want to access what we've got going thus far, visit
/contact_manager/contacts. You should get a "Missing Model" error
because we don't have a Contact model defined yet.

.. _plugin-models:

Plugin Models
=============

Models for the plugin are stored in /app/Plugin/ContactManager/Model.
We've already defined a ContactsController for this plugin, so let's
create the model for that controller, called Contact::

    // In /app/Plugin/ContactManager/Model/Contact.php

    class Contact extends ContactManagerAppModel {
    }

Visiting /contact_manager/contacts now (given you've got a table in your
database called 'contacts') should give us a "Missing View" error.
Let's create that next.

.. note::

    If you need to reference a model within your plugin, you need to
    include the plugin name with the model name, separated with a dot.

For example::

    // In /app/Plugin/ContactManager/Model/Contact.php
    
    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

If you would prefer that the array keys for the association not
have the plugin prefix on them, use the alternative syntax::

    // In /app/Plugin/ContactManager/Model/Contact.php

    class Contact extends ContactManagerAppModel {
        public $hasMany = array(
            'AltName' => array(
                'className' => 'ContactManager.AltName'
            )
        );
    }
    
.. note::
    If you have __construct() method in your model don't forget to call parent::__construct() at the end. Failing to do so will create a lot of difficult to debug problems.

Plugin Views
============

Views behave exactly as they do in normal applications. Just place
them in the right folder inside of the /app/Plugin/[PluginName]/View/
folder. For our ContactManager plugin, we'll need a view for our
ContactsController::index() action, so let's include that as
well::

    <!-- /app/Plugin/ContactManager/View/Contacts/index.ctp: -->
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

.. note::

    For information on how to use elements from a plugin, look up
    :ref:`view-elements`

Overriding Plugin Views From Inside Your Application
----------------------------------------------------

You can override any plugin views from inside your app using
special paths. If you have a plugin called 'ContactManager' you
can override the view files of the plugin with more application
specific view logic by creating files using the following template
"app/View/Plugin/[Plugin]/[Controller]/[view].ctp". For the
Contacts controller you could make the following file::

    /app/View/Plugin/ContactManager/Contacts/index.ctp

Creating this file, would allow you to override
"/app/Plugin/ContactManager/View/Contacts/index.ctp".

.. _plugin-assets:

Plugin Assets
=============

A plugin's web assets (but not PHP files) can be served through the
plugin's 'webroot' directory, just like the main application's assets::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

You may put any type of file in any directory, just like a regular
webroot.

But keep in mind that handling static assets, such as images, Javascript
and CSS files of plugins, through the Dispatcher is incredibly inefficient.
It is strongly recommended to symlink them for production.
For example like this::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

Linking to Assets in Plugins
----------------------------

Simply prepend /plugin_name/ to the beginning of a request for an
asset within that plugin, and it will work as if the asset were
in your application's webroot.

For example, linking to '/contact_manager/js/some_file.js'
would serve the asset
'app/Plugin/ContactManager/webroot/js/some_file.js'.

.. note::

    It is important to note the **/your_plugin/** prefix before the
    asset path. That makes the magic happen!

.. versionchanged:: 2.1

    Use :term:`plugin syntax` to request assets. For example in your View::

        <?php echo $this->Html->css("ContactManager.style"); ?>

Components, Helpers and Behaviors
=================================

A plugin can have Components, Helpers and Behaviors just like a
regular CakePHP application. You can even create plugins that
consist only of Components, Helpers or Behaviors which can be a
great way to build reusable components that can easily be
dropped into any project.

Building these components is exactly the same as building it within
a regular application, with no special naming convention.

Referring to your component from inside or outside of your plugin
requires only that you prefix the plugin name before the name of the
component. For example::

    // Component defined in 'ContactManager' plugin

    class ExampleComponent extends Component {
    }

    // Within your controllers:

    public $components = array('ContactManager.Example');

The same technique applies to Helpers and Behaviors.

.. note::

    When creating Helpers you may find AppHelper is not automatically
    available. You should declare the resources you need with Uses::

        // Declare use of AppHelper for your Plugin's Helper

        App::uses('AppHelper', 'View/Helper');

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

Plugin Tips
===========

Once a plugin has been installed in /app/Plugin/, you can access it
at the URL /plugin_name/controller_name/action. In our ContactManager
plugin example, we'd access our ContactsController at
/contact_manager/contacts.

Some final tips on working with plugins in your CakePHP
applications:


-  When you don't have a [Plugin]AppController and
   [Plugin]AppModel, you'll get missing Controller errors when trying
   to access a plugin controller.
-  You can define your own layouts for plugins, inside
   app/Plugin/[Plugin]/View/Layouts. Otherwise, plugins will use the
   layouts from the /app/View/Layouts folder by default.
-  You can do inter-plugin communication by using
   ``$this->requestAction('/plugin_name/controller_name/action');`` in your
   controllers.
-  If you use requestAction, make sure controller and model names
   are as unique as possible. Otherwise you might get PHP "redefined
   class ..." errors.
-  When adding routes with extensions to your plugin, ensure you use
   ``Router::setExtensions()`` so you do not override application routing.

Publish Your Plugin
===================

You can add your plugin to `plugins.cakephp.org <https://plugins.cakephp.org>`_
or propose it to the
`awesome-cakephp list <https://github.com/FriendsOfCake/awesome-cakephp>`_.

Also, you might want to create a composer.json file and publish your plugin at
`packagist.org <https://packagist.org/>`_.
This way it can easily be used through Composer.

Choose a semantically meaningful name for the package name. This should ideally
be prefixed with the dependency, in this case "cakephp" as the framework.
The vendor name will usually be your GitHub username.
Do **not** use the CakePHP namespace (cakephp) as this is reserved to CakePHP
owned plugins.
The convention is to use lowercase letters and dashes as separator.

So if you created a plugin "Logging" with your GitHub account "FooBar", a good
name would be `foo-bar/cakephp-logging`.
And the CakePHP owned "Localized" plugin can be found under `cakephp/localized`
respectively.


.. meta::
    :title lang=en: How To Create Plugins
    :keywords lang=en: plugin folder,configuration database,management module,little space,webroot,contactmanager,array,config,cakephp,models,php,directories,blog,plugins,applications
