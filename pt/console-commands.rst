Console Commands
################

.. php:namespace:: Cake\Console

In addition to a web framework, CakePHP also provides a console framework for
creating command line tools & applications. Console applications are ideal for
handling a variety of background & maintenance tasks that leverage your existing
application configuration, models, plugins and domain logic.

CakePHP provides several console tools for interacting with CakePHP features
like i18n and routing that enable you to introspect your application and
generate related files.

The CakePHP Console
===================

The CakePHP Console uses a dispatcher-type system to load commands, parse
their arguments and invoke the correct command. While the examples below use
bash the CakePHP console is compatible with any \*nix shell and windows.

A CakePHP application contains **src/Command** directory that contain its commands.
It also comes with an executable in the **bin** directory:

.. code-block:: console

    $ cd /path/to/app
    $ bin/cake

.. note::

    For Windows, the command needs to be ``bin\cake`` (note the backslash).

Running the Console with no arguments will list out available commands. You
could then run the any of the listed commands by using its name:

.. code-block:: console

    # run server command
    bin/cake server

    # run migrations command
    bin/cake migrations -h

    # run bake (with plugin prefix)
    bin/cake bake.bake -h

Plugin commands can be invoked without a plugin prefix if the commands's name
does not overlap with an application or framework command. In the case that two
plugins provide a command with the same name, the first loaded plugin will get
the short alias. You can always use the ``plugin.command`` format to
unambiguously reference a command.

Console Applications
====================

By default CakePHP will automatically discover all the commands in your
application and its plugins. You may want to reduce the number of exposed
commands, when building standalone console applications. You can use your
``Application``'s ``console()`` hook to limit which commands are exposed and
rename commands that are exposed::

    // in src/Application.php
    namespace App;

    use App\Command\UserCommand;
    use App\Command\VersionCommand;
    use Cake\Console\CommandCollection;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console(CommandCollection $commands): CommandCollection
        {
            // Add by classname
            $commands->add('user', UserCommand::class);

            // Add instance
            $commands->add('version', new VersionCommand());

            return $commands;
        }
    }

In the above example, the only commands available would be ``help``, ``version``
and ``user``. See the :ref:`plugin-commands` section for how to add commands in
your plugins.

.. note::

    When adding multiple commands that use the same Command class, the ``help``
    command will display the shortest option.

.. _renaming-commands:
.. index:: nested commands, subcommands

Renaming Commands
=================

There are cases where you will want to rename commands, to create nested
commands or subcommands.  While the default auto-discovery of commands will not
do this, you can register your commands to create any desired naming.

You can customize the command names by defining each command in your plugin::

    public function console(CommandCollection $commands): CommandCollection
    {
        // Add commands with nested naming
        $commands->add('user dump', UserDumpCommand::class);
        $commands->add('user:show', UserShowCommand::class);

        // Rename a command entirely
        $commands->add('lazer', UserDeleteCommand::class);

        return $commands;
    }

When overriding the ``console()`` hook in your application, remember to
call ``$commands->autoDiscover()`` to add commands from CakePHP, your
application, and plugins.

If you need to rename/remove any attached commands, you can use the
``Console.buildCommands`` event on your application event manager to modify the
available commands.

Commands
========

See the :doc:`/console-commands/commands` chapter on how to create your first
command. Then learn more about commands:

.. toctree::
    :maxdepth: 1

    console-commands/commands
    console-commands/input-output
    console-commands/option-parsers
    console-commands/cron-jobs

CakePHP Provided Commands
=========================

.. toctree::
    :maxdepth: 1

    console-commands/cache
    console-commands/completion
    console-commands/counter-cache
    console-commands/i18n
    console-commands/plugin
    console-commands/schema-cache
    console-commands/routes
    console-commands/server
    console-commands/repl

Routing in the Console Environment
==================================

In command-line interface (CLI), specifically your console commands,
``env('HTTP_HOST')`` and other webbrowser specific environment variables are not
set.

If you generate reports or send emails that make use of ``Router::url()`` those
will contain the default host ``http://localhost/``  and thus resulting in
invalid URLs. In this case you need to specify the domain manually.
You can do that using the Configure value ``App.fullBaseUrl`` from your
bootstrap or config, for example.

For sending emails, you should provide Email class with the host you want to
send the email with::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->setDomain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the
emails are sent from.


.. meta::
    :title lang=en: Shells, Tasks & Console Tools
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,commands,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
