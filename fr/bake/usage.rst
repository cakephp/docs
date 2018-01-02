Génération de Code avec Bake
############################

Suivant la configuration de votre installation, vous devrez peut être donner
les droits d'exécution au script bash cake ou l'appeler avec la commande
``./bin/cake bake``.
La console cake est exécutée en utilisant le CLI PHP
(Interface de Ligne de Commande). Si vous avez des problèmes en exécutant ce
script, vérifiez que :

#. le CLI PHP est installé et qu'il a les bons modules activés (ex: MySQL, intl).
#. Certains utilisateurs peuvent aussi rencontrer des problèmes si la base de
   données host est 'localhost' et devront essayer '127.0.0.1' à la place.
#. Selon la configuration de votre ordinateur, vous devrez peut-être permettre
   l'exécution du script bash pour permettre de lancer ``bin/cake bake``.

Avant de lancer bake, vous devrez vous assurer qu'au moins une connection à une
base de données est configurée. Regardez la section dans
:ref:`configuration de la base de données <database-configuration>` pour plus
d'informations.

Si vous exécutez la commande sans argument, ``bin/cake bake`` affichera la liste
des tâches disponibles. Vous devriez voir quelque chose comme ceci::

    $ bin/cake bake

    Welcome to CakePHP v3.x.x Console
    ---------------------------------------------------------------
    App : src
    Path: /var/www/cakephp.dev/src/
    ---------------------------------------------------------------
    Les commandes suivantes avec lesquelles vous pouvez générer un squelette de
    code pour votre application.

    Les commandes disponibles de bake:

    - all
    - behavior
    - cell
    - component
    - controller
    - fixture
    - form
    - helper
    - mailer
    - migration
    - migration_snapshot
    - model
    - plugin
    - shell
    - shell-helper
    - template
    - test

    En utilisant `cake bake [name]` vous pouvez faire appel à une tâche
    spécifique de bake.

Vous pouvez obtenir plus d'informations sur ce que chaque tâche fait et les
options disponibles en utilisant l'option ``--help``::

    $ bin/cake bake controller --help

    Welcome to CakePHP v3.x.x Console
    ---------------------------------------------------------------
    App : src
    Path: /var/www/cakephp.dev/src/
    ---------------------------------------------------------------
    Bake a controller skeleton.

    Usage:
    cake bake controller [subcommand] [options] [<name>]

    Subcommands:

    all  Bake all controllers with CRUD methods.

    To see help on a subcommand use `cake bake controller [subcommand] --help`

    Options:

    --help, -h        Display this help.
    --verbose, -v     Enable verbose output.
    --quiet, -q       Enable quiet output.
    --plugin, -p      Plugin to bake into.
    --force, -f       Force overwriting existing files without prompting.
    --connection, -c  The datasource connection to get data from.
                      (default: default)
    --theme, -t       The theme to use when baking code.
    --components      The comma separated list of components to use.
    --helpers         The comma separated list of helpers to use.
    --prefix          The namespace/routing prefix to use.
    --no-test         Do not generate a test skeleton.
    --no-actions      Do not generate basic CRUD action methods.

    Arguments:

    name  Name of the controller to bake. Can use Plugin.name to bake
        controllers into plugins. (optional)

Themes de Bake
==============

L'option theme est commune à toutes les commandes de bake, et permet de changer
les fichiers de template utilisés lors de la création avec bake. Pour créer vos
propres templates, référez-vous :ref:`à la documentation sur la création de
theme bake <creating-a-bake-theme>`.

.. meta::
    :title lang=fr: Génération de Code avec Bake
    :keywords lang=fr: interface ligne de commande,application fonctionnelle,base de données,configuration base de données,bash script,ingredients basiques,project,model,path path,génération de code,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
