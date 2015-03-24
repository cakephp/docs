.. _plugin-shell:

Plugin Shell
############

The plugin shell allows you to load and unload plugins via the command prompt.
If you need help, run::

    bin/cake plugin --help


Loading Plugins
---------------

Via the `Load` task you are able to load plugins in your
``config/bootstrap.php``. You can do this by running::

    bin/cake plugin load MyPlugin

This will add the following to your ``config/bootstrap.php``::

    Plugin::load('MyPlugin', ['bootstrap' => false, 'routes' => false, 'autoload' => true]);

By adding `-r` or `-b` to your command you can enable to `bootstrap` and
`routes` value::

    bin/cake plugin load -b MyPlugin

    // will return
    Plugin::load('MyPlugin', ['bootstrap' => true, 'routes' => false, 'autoload' => true]);

    bin/cake plugin load -r MyPlugin

    // will return
    Plugin::load('MyPlugin', ['bootstrap' => false, 'routes' => true, 'autoload' => true]);

Unloading Plugins
-----------------

You can unload a plugin by specifying its name::

    bin/cake plugin unload MyPlugin

This will remove the line ``Plugin::load('MyPlugin',...`` from your
``config/bootstrap.php``.

.. meta::
    :title lang=en: Plugin Shell
    :keywords lang=en: api docs,shell,plugin,load,unload
