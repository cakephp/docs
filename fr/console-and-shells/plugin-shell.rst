.. _plugin-shell:

Shell Plugin
############

Le shell plugin vous permet de charger et décharger les plugins avec le
prompteur de commandes.
Si vous avez besoin d'aide, lancez::

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

.. meta::
    :title lang=fr: Plugin Shell
    :keywords lang=fr: api docs,shell,plugin,load,unload
