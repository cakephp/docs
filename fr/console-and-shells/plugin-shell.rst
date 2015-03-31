.. _plugin-shell:

Shell Plugin
############

Le shell plugin vous permet de charger et décharger les plugins avec le
prompteur de commandes. Si vous avez besoin d'aide, lancez::

    bin/cake plugin --help

Charger les Plugins
-------------------

Avec la tâche `Load` vous pouvez charger les plugins dans votre
``config/bootstrap.php``. Vous pouvez aussi le faire en lançant::

    bin/cake plugin load MyPlugin

Ceci va ajouter ce qui suit dans votre ``config/bootstrap.php``::

    Plugin::load('MyPlugin', ['bootstrap' => false, 'routes' => false, 'autoload' => true]);

En ajoutant `-r` ou `-b` à votre commande vous pouvez activer les valeurs
`bootstrap` et `routes`::

    bin/cake plugin load -b MyPlugin

    // va retourner
    Plugin::load('MyPlugin', ['bootstrap' => true, 'routes' => false, 'autoload' => true]);

    bin/cake plugin load -r MyPlugin

    // va retourner
    Plugin::load('MyPlugin', ['bootstrap' => false, 'routes' => true, 'autoload' => true]);

Décharger les Plugins
---------------------

Vous pouvez décharger un plugin en spécifiant son nom::

    bin/cake plugin unload MyPlugin

Ceci va retirer la ligne ``Plugin::load('MyPlugin',...`` de votre
``config/bootstrap.php``.

Plugin Assets
-------------

CakePHP by default serves plugins assets using the ``AssetFilter`` dispatcher
filter. While this is a good convenience, it is recommended to symlink / copy
the plugin assets under app's webroot so that they can be directly served by the
web server without invoking PHP. You can do this by running::

    bin/cake plugin_assets symlink

Running the above command will symlink all plugins assets under app's webroot.
On Windows, which doesn't support symlinks, the assets will be copied in
respective folders instead of being symlinked.

You can symlink assets of one particular plugin by specifying it's name::

    bin/cake plugin_assets symlink MyPlugin

.. meta::
    :title lang=fr: Plugin Shell
    :keywords lang=fr: plugin,assets,shell,load,unload
