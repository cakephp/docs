Commandes sur la Console
########################

.. php:namespace:: Cake\Console

En plus d'un framework web, CakePHP fournit aussi un framework de console pour
créer des outils et applications en ligne de commande. Les applications sur
console sont idéales pour traiter diverses tâches en arrière-plan ou opérations
de maintenance qui influent sur la configuration existante de votre application,
vos modèles, plugin et logique de domaine.

CakePHP propose plusieurs outils de console pour interagir avec les
fonctionnalités de CakePHP telles que l'internationalisation et le routage, qui
vous permettent d'introspecter votre application et des générer des fichiers
correspondant.

La Console CakePHP
==================

La console CakePHP utilise un système de type dispatcher pour charger des
commandes, parser leurs arguments et appeler la bonne commande. Les exemples
qui suivent utilisent bash ; cependant la console CakePHP est compatible avec
n'importe quel shell \*nix et Windows.

Une application CakePHP contient les répertoires **src/Command**, **src/Shell**
et **src/Shell/Task**, qui contiennent ses shells et ses tâches. Elle est aussi
livrée avec un exécutable dans le répertoire **bin**:

.. code-block:: console

    $ cd /path/to/app
    $ bin/cake

.. note::

    Pour Windows, il faut taper la commande ``bin\cake`` (notez le backslash).

Si vous lancez la Console sans arguments, vous obtiendrez la liste des commandes
disponibles. Vous pouvez ensuite lancer une de ces commandes en tapant son nom:

.. code-block:: console

    # lancer le shell du serveur
    bin/cake server

    # lancer le shell des migrations
    bin/cake migrations -h

    # lancer bake (avec un préfixe de plugin)
    bin/cake bake.bake -h

Vous pouvez appeler des commandes de plugin sans le préfixe du plugin si le nom
de la commande n'entre pas en collision avec un shell de l'application ou du
framework. Dans le cas où deux plugins proposent une commande avec le même nom,
l'alias court correspondra au plugin chargé en premier. Vous pouvez toujours
utiliser le format ``plugin.command`` pour faire référence à une commande de
manière non ambigüe.

Applications sur Console
========================

Par défaut, CakePHP cherchera automatiquement toutes les commandes dans votre
application et vos plugins. Quand vous créerez des applications autonoms sur
console, vous voudrez peut-être restreindre le nombre de commandes accessibles.
Vous pouvez utiliser le crochet ``console()`` de ``Application`` pour limiter et
renommer les commandes exposées::

    // dans src/Application.php
    namespace App;

    use App\Command\UserCommand;
    use App\Command\VersionCommand;
    use Cake\Console\CommandCollection;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console(CommandCollection $commands): CommandCollection
        {
            // Ajouter par nom de classe
            $commands->add('user', UserCommand::class);

            // Ajouter une instance
            $commands->add('version', new VersionCommand());

            return $commands;
        }
    }

Dans cet exemple, seules les commandes ``help``, ``version`` et ``user``
seraient disponibles. Consultez la section :ref:`plugin-commands` pour savoir
comment ajouter des commandes dans vos plugins.

.. note::

    Quand vous ajoutez plusieurs commandes qui utilisent la même classe Command,
    la commande ``help`` affichera l'option la plus courte.

.. _renaming-commands:
.. index:: nested commands, subcommands

Renommer des Commandes
======================

Dans certains cas, vous aurez besoin de renommer des commandes, ou de créer des
commandes imbriquées ou des sous-commandes. La découverte automatique des
commandes ne fera pas cela, cependant vous pouvez déclarer vos commandes pour
créer la dénomination désirée.

Vous pouvez personnaliser les noms de commandes en définissant chaque commande
dans votre plugin::

    public function console(CommandCollection $commands): CommandCollection
    {
        // Ajouter des commandes avec une dénomintaion imbriquée
        $commands->add('user dump', UserDumpCommand::class);
        $commands->add('user:show', UserShowCommand::class);

        // Renommer entièrement une commande
        $commands->add('lazer', UserDeleteCommand::class);

        return $commands;
    }

Quand vous réécrivez le crochet ``console()`` de votre application, pensez à
appeler ``$commands->autoDiscover()`` pour ajouter des commandes de CakePHP, de
votre application, et des plugins.

Si vous avez besoin de renommer ou supprimer une commande attachée, vous pouvez
utiliser l'événement ``Console.buildCommands`` dans le gestionnaire d'événements
de votre application  pour modifier les commandes disponibles.

Commandes
=========

Rendez-vous au chapitre :doc:`/console-commands/commands` pour créer votre
première commande. Puis, pour en savoir plus sur les commandes:

.. toctree::
    :maxdepth: 1

    console-commands/commands
    console-commands/input-output
    console-commands/option-parsers
    console-commands/cron-jobs

Commandes Fournies par CakePHP
==============================

.. toctree::
    :maxdepth: 1

    console-commands/cache
    console-commands/completion
    console-commands/i18n
    console-commands/plugin
    console-commands/schema-cache
    console-commands/routes
    console-commands/server
    console-commands/repl
    console-commands/shells

Routage dans l'Environnement de la Console
==========================================

En ligne de commande (CLI), et spécifiquement dans vos shells et vos tâches,
``env('HTTP_HOST')`` et les autres variables d'environnement spécifiques au
serveur web ne sont pas définies.

Si vous générez des rapports ou si vous envoyez des mails qui utilisent00
``Router::url()``, ils contiendront l'hôte par défaut ``http://localhost/``, et
donc ils produiront des URL invalides. Dans un tel cas, vous devez spécifier le
domaine manuellement. Vous pouvez utiliser pour cela la valeur
``App.fullBaseUrl`` de Configure depuis votre bootstrap ou votre configuration,
par exemple.

Pour envoyer des mails, vous devrez fournir une classe Email avec l'hôte à
partir duquel vous voulez envoyer le mail::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->setDomain('www.example.org');

Cela suppose que les IDs du message généré soient valides et correspondent au
domaine à partir duquel les mails sont envoyés.


.. meta::
    :title lang=fr: Shells, Tâches & Outils de Console
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
