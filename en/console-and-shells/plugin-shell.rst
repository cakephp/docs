.. _plugin-shell:

Plugin Shell
############

The plugin shell allows you to load and unload plugins via the command prompt.
If you need help, run::

    bin/cake plugin --help

Loading Plugins
---------------

Via the ``Load`` task you are able to load plugins in your
**config/bootstrap.php**. You can do this by running::

    bin/cake plugin load MyPlugin

This will add the following to your **config/bootstrap.php**::

    Plugin::load('MyPlugin');

Adding the ``-b`` or ``-r`` switch to the load task will enable loading of the plugin's
``bootstrap`` and ``routes`` values::

    bin/cake plugin load -b MyPlugin

    // Load the bootstrap.php from the plugin
    Plugin::load('MyPlugin', ['bootstrap' => true]);

    bin/cake plugin load -r MyPlugin

    // Load the routes.php from the plugin
    Plugin::load('MyPlugin', ['routes' => true]);

If you are loading a plugin that only provides CLI tools (like bake, or
migrations) you can update your ``bootstrap_cli.php`` with::

    bin/cake plugin load --cli MyPlugin
    bin/cake plugin unload --cli MyPlugin

.. versionadded:: 3.4.0
    As of 3.4.0 the ``--cli`` option is supported

Unloading Plugins
-----------------

You can unload a plugin by specifying its name::

    bin/cake plugin unload MyPlugin

This will remove the line ``Plugin::load('MyPlugin',...)`` from your
**config/bootstrap.php**.

Plugin Assets
-------------

CakePHP by default serves plugins assets using the ``AssetFilter`` dispatcher
filter. While this is a good convenience, it is recommended to symlink / copy
the plugin assets under app's webroot so that they can be directly served by the
web server without invoking PHP. You can do this by running::

    bin/cake plugin assets symlink

Running the above command will symlink all plugins assets under app's webroot.
On Windows, which doesn't support symlinks, the assets will be copied in
respective folders instead of being symlinked.

You can symlink assets of one particular plugin by specifying its name::

    bin/cake plugin assets symlink MyPlugin

.. meta::
    :title lang=en: Plugin Shell
    :keywords lang=en: plugin,assets,shell,load,unload
