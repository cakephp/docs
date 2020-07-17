.. _plugin-shell:

Shell Plugin
############

Le shell plugin vous permet de charger et décharger les plugins avec le
prompteur de commandes. Si vous avez besoin d'aide, lancez::

    bin/cake plugin --help

Charger les Plugins
-------------------

Avec la tâche ``Load`` vous pouvez charger les plugins dans votre
**config/bootstrap.php**. Vous pouvez aussi le faire en lançant::

    bin/cake plugin load MyPlugin

Ceci va ajouter ce qui suit dans votre **config/bootstrap.php**::

    Plugin::load('MyPlugin');

Ajouter ``-r`` ou ``-b`` à la tâche de chargement va activer le chargement des
valeurs ``bootstrap`` et ``routes`` du plugin::

    bin/cake plugin load -b MyPlugin

    // Charge le bootstrap.php du plugin
    Plugin::load('MyPlugin', ['bootstrap' => true]);

    bin/cake plugin load -r MyPlugin

    // Charge le routes.php du plugin
    Plugin::load('MyPlugin', ['routes' => true]);

Si vous chargez un plugin qui ne fournit que des outils CLI - comme bake - vous
pouvez mettre à jour votre fichier ``bootstrap_cli.php`` avec::

    bin/cake plugin load --cli MyPlugin
    bin/cake plugin unload --cli MyPlugin

.. versionadded:: 3.4.0
    A partir de 3.4.0, l'option ``--cli`` est supportée.

Décharger les Plugins
---------------------

Vous pouvez décharger un plugin en spécifiant son nom::

    bin/cake plugin unload MyPlugin

Ceci va retirer la ligne ``Plugin::load('MyPlugin',...)`` de votre
**config/bootstrap.php**.

Assets des Plugins
------------------

CakePHP sert par défaut les assets des plugins en utilisant le filtre de
dispatcher ``AssetFilter``. Bien que ce soit pratique, il est recommandé de
faire des liens symboliques / copier les assets des plugins dans le dossier
webroot de l'application pour qu'ils puissent être directement servis par le
serveur web dans invoquer PHP. Vous pouvez faire ceci en lançant::

    bin/cake plugin_assets symlink

Lancer la commande ci-dessus va faire faire un lien symbolique pour tous les
assets des plugins dans le dossier webroot de l'application.
Sur Windows, qui ne supporte pas les liens symboliques, les assets seront
copiés dans les dossiers respectifs plutôt que mis en liens symboliques.

Vous pouvez faire des liens symboliques des assets d'un plugin en particulier en
spécifiant son nom::

    bin/cake plugin_assets symlink MyPlugin

.. meta::
    :title lang=fr: Plugin Shell
    :keywords lang=fr: plugin,assets,shell,load,unload
