Console Tools, Shells & Tasks
#############################

.. php:namespace:: Cake\Console

CakePHP features not only a web framework but also a console framework for
creating console applications. Console applications are ideal for handling a
variety of background tasks such as maintenance, and completing work outside of
the request-response cycle. CakePHP console applications allow you to reuse your
application classes from the command line.

CakePHP comes with a number of console applications out of the box. Some of
these applications are used in concert with other CakePHP features (like i18n),
and others are for general use to get you working faster.

The CakePHP Console
===================

This section provides an introduction into CakePHP at the command-line. Console
tools are ideal for use in cron jobs, or command line based utilities that don't
need to be accessible from a web browser.

PHP provides a CLI client that makes interfacing with your file system and
applications much smoother. The CakePHP console provides a framework for
creating shell scripts. The Console uses a dispatcher-type setup to load a shell
or task, and provide its parameters.

.. note::

    A command-line (CLI) build of PHP must be available on the system
    if you plan to use the Console.

Before we get into specifics, let's make sure you can run the CakePHP console.
First, you'll need to bring up a system terminal. The examples shown in this
section will be in bash, but the CakePHP Console is compatible with Windows as
well.  This example assumes that you are currently logged into a bash prompt at
the root of your CakePHP application.

A CakePHP application contains **src/Command**, **src/Shell** and
**src/Shell/Task** directories that contain its shells and tasks. It also
comes with an executable in the **bin** directory:

.. code-block:: bash

    $ cd /path/to/app
    $ bin/cake

.. note::

    For Windows, the command needs to be ``bin\cake`` (note the backslash).

Running the Console with no arguments produces this help message::

    Welcome to CakePHP v3.6.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

    * app: src
    * root: /Users/markstory/Sites/cakephp-app
    * core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Available Commands:

    - version
    - help
    - cache
    - completion
    - i18n
    - schema_cache
    - plugin
    - routes
    - server
    - bug
    - console
    - event
    - orm
    - bake
    - bake.bake
    - migrations
    - migrations.migrations

    To run a command, type `cake shell_name [args|options]`
    To get help on a specific command, type `cake shell_name --help`

The first information printed relates to paths. This is helpful if you're
running the console from different parts of the filesystem.

You could then run the any of the listed commands by using its name:

.. code-block:: bash

    # run server shell
    bin/cake server

    # run migrations shell
    bin/cake migrations -h

    # run bake (with plugin prefix)
    bin/cake bake.bake -h

Plugin commands can be invoked without a plugin prefix if the commands's name
does not overlap with an application or framework shell. In the case that two
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

    use App\Shell\UserShell;
    use App\Shell\VersionShell;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console($commands)
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

.. versionadded:: 3.5.0
    The ``console`` hook was added.

.. renaming-commands::
.. index:: nested commands, subcommands

Renaming Commands
=================

There are cases where you will want to rename commands, to create nested
commands or subcommands.  While the default auto-discovery of commands will not
do this, you can register your commands to create any desired naming::

You can customize the command names by defining each command in your plugin::

    public function console($commands)
    {
        // Add commands with nested naming
        $commands->add('user dump', UserDumpCommand::class)
        $commands->add('user:show', UserShowCommand::class)

        // Rename a command entirely
        $commands->add('lazer', UserDeleteCommand::class)

        return $commands;
    }

When overriding the ``console()`` hook in your application, remember to
call ``discoverCakephp()`` to add commands from CakePHP.

If you need to rename/remove any attached commands, you can use the
``Console.buildCommands`` event on your application event manager to modify the
available commands.

Commands
========

See the :doc:`/console-and-shells/commands` chapter on how to create your first
command. Then learn more about commands:

.. toctree::
    :maxdepth: 1

    console-and-shells/commands
    console-and-shells/input-output
    console-and-shells/option-parsers
    console-and-shells/helpers
    console-and-shells/cron-jobs

CakePHP Provided Commands
=========================

.. toctree::
    :maxdepth: 1

    console-and-shells/cache
    console-and-shells/i18n-shell
    console-and-shells/completion-shell
    console-and-shells/plugin-shell
    console-and-shells/routes-shell
    console-and-shells/schema-cache
    console-and-shells/server-shell
    console-and-shells/upgrade-shell
    console-and-shells/shells

.. toctree::
    :hidden:

    console-and-shells/orm-cache

Routing in the Console Environment
==================================

In command-line interface (CLI), specifically your shells and tasks,
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
    // Prior to 3.4 use domain()
    $email->setDomain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the
emails are sent from.


.. meta::
    :title lang=en: Shells, Tasks & Console Tools
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
