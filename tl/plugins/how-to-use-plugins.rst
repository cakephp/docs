How To Use Plugins
##################

Before you can use a plugin, you must install and enable it first.
See :doc:`/plugins/how-to-install-plugins`.

Plugin Configuration
====================

There is a lot you can do with the load and loadAll methods to help with
plugin configuration and routing. Perhaps you want to load all plugins
automatically, while specifying custom routes and bootstrap files for
certain plugins.

No problem::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

With this style of configuration, you no longer need to manually
include() or require() a plugin's configuration or routes file--It happens
automatically at the right time and place. The exact same parameters could
have also been supplied to the load() method, which would have loaded only those
three plugins, and not the rest.

Finally, you can also specify a set of defaults for loadAll which will apply to
every plugin that doesn't have a more specific configuration.

Load the bootstrap file from all plugins, and additionally the routes from the Blog plugin::

    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));


Note that all files specified should actually exist in the configured
plugin(s) or PHP will give warnings for each file it cannot load. This is
especially important to remember when specifying defaults for all plugins.

CakePHP 2.3.0 added an ``ignoreMissing`` option, that allows you to ignore any
missing routes and bootstrap files when loading plugins. You can shorten the
code needed to load all plugins using this::

    // Loads all plugins including any possible routes and bootstrap files
    CakePlugin::loadAll(array(
        array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)
    ));

Some plugins additionally need to create one or more tables in your database. In
those cases, they will often include a schema file which you can
call from the cake shell like this::

    user@host$ cake schema create --plugin ContactManager

Most plugins will indicate the proper procedure for configuring
them and setting up the database in their documentation. Some
plugins will require more setup than others.

Advanced Bootstrapping
======================

If you like to load more than one bootstrap file for a plugin. You can specify
an array of files for the bootstrap configuration key::

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => array(
                'config1',
                'config2'
            )
        )
    ));

You can also specify a callable function that needs to be called when the plugin
has been loaded::


    function aCallableFunction($pluginName, $config) {

    }

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => 'aCallableFunction'
        )
    ));

Using a Plugin
==============

You can reference a plugin's controllers, models, components,
behaviors, and helpers by prefixing the name of the plugin before
the class name.

For example, say you wanted to use the ContactManager plugin's
ContactInfoHelper to output some pretty contact information in
one of your views. In your controller, your $helpers array
could look like this::

    public $helpers = array('ContactManager.ContactInfo');

You would then be able to access the ContactInfoHelper just like
any other helper in your view, such as::

    echo $this->ContactInfo->address($contact);


.. meta::
    :title lang=en: How To Use Plugins
    :keywords lang=en: plugin folder,configuration database,bootstrap,management module,webroot,user management,contactmanager,array,config,cakephp,models,php,directories,blog,plugins,applications
