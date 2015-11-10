Outil d'Upgrade
###############

L'upgrade de CakePHP 2.x vers CakePHP 3 nécessite de nombreuses transformations
qui peuvent être automatisées, comme l'ajout des namespaces. Pour faciliter ces
changements mécaniques, CakePHP fournit un outil d'upgrade en ligne de commande.

Installation
============

L'outil d'upgrade est installé en tant qu'application autonome. Vous devrez
cloner l'outil d'upgrade avec git, et installer ces dépendances avec composer::

    git clone https://github.com/cakephp/upgrade.git
    cd upgrade
    php ../composer.phar install

A cette étape, vous devriez pouvoir accéder à l'aide de l'outil d'upgrade::

    cd upgrade
    bin/cake upgrade --help

La commande ci-dessus doit générer quelque chose de similaire à ce qui suit::

    Welcome to CakePHP v3.0.8 Console
    ---------------------------------------------------------------
    App : src
    Path: /Users/markstory/Sites/cake_plugins/upgrade/src/
    ---------------------------------------------------------------
    A shell to help automate upgrading from CakePHP 2.x to 3.x. Be sure to
    have a backup of your application before running these commands.

    Usage:
    cake upgrade [subcommand] [-h] [-v] [-q]

    Subcommands:

    locations           Move files/directories around. Run this *before*
                        adding namespaces with the namespaces command.
    namespaces          Add namespaces to files based on their file path.
                        Only run this *after* you have moved files.
    app_uses            Replace App::uses() with use statements
    rename_classes      Rename classes that have been moved/renamed. Run
                        after replacing App::uses() with use statements.
    rename_collections  Rename HelperCollection, ComponentCollection, and
                        TaskCollection. Will also rename component
                        constructor arguments and _Collection properties on
                        all objects.
    method_names        Update many of the methods that were renamed during
                        2.x -> 3.0
    method_signatures   Update many of the method signatures that were
                        changed during 2.x -> 3.0
    fixtures            Update fixtures to use new index/constraint
                        features. This is necessary before running tests.
    tests               Update test cases regarding fixtures.
    i18n                Update translation functions regarding placeholders.
    skeleton            Add basic skeleton files and folders from the "app"
                        repository.
    prefixed_templates  Move view templates for prefixed actions.
    all                 Run all tasks expect for skeleton. That task should
                        only be run manually, and only for apps (not
                        plugins).

    To see help on a subcommand use `cake upgrade [subcommand] --help`

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

Utilisation
===========

Une fois que vous avez correctement installé l'outil d'upgrade, vous êtes prêt
à l'utiliser sur une application 2.x.

.. warning::
    Assurez-vous d'avoir des sauvegardes ou un système de versioning pour le
    code de votre application.

    Il est également préférable de faire une sauvegarde ou un commit entre
    chaque sous-commande.

Pour commencer, lancer la commande ``locations``::

    # Voir les options pour la commande
    bin/cake upgrade locations --help

    # Lancer la commande en mode simulation.
    bin/cake upgrade locations --dry-run /path/to/app

la commande ci-dessus générera une sortie sans modification de ce qui devrait
arriver. Lorsque vous êtes prêt à lancer réellement la commande, supprimez
l'option ``--dry-run``. En utilisant l'option ``--git``, l'outil d'upgrade
déplacera automatiquement les fichiers dans git.

Une fois que les emplacements des fichiers ont été mis à jour, vous pouvez
ajouter les namespaces à votre code en utilisant la commande ``namespaces``::

    # Voir les options pour la commande.
    bin/cake upgrade namespaces --help

    # Lancer la commande en mode simulation.
    bin/cake upgrade namespaces --dry-run /path/to/app

    # Lancer la commande réellement.
    bin/cake upgrade namespaces /path/to/app

Après ces deux changements, vous pouvez lancer les sous-commandes restantes
dans n'importe quel ordre.
