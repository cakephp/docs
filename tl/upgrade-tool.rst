Upgrade Tool
############

Upgrading to CakePHP 3 from CakePHP 2.x requires a number of transformations
that can be automated, such as adding namespaces. To assist in making
these mechanical changes easier, CakePHP provides a CLI based upgrade tool.

Installation
============

The upgrade tool is installed as a standalone application. You'll need to clone
the upgrade tool with git, and install the dependencies with composer::

    git clone https://github.com/cakephp/upgrade.git
    cd upgrade
    php ../composer.phar install

At this point you should be able to get the help for the upgrade tool::

    cd upgrade
    bin/cake upgrade --help

The above should output something like the following::

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
    all                 Run all tasks except for skeleton. That task should
                        only be run manually, and only for apps (not
                        plugins).

    To see help on a subcommand use `cake upgrade [subcommand] --help`

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

Usage
=====

Once you have correctly installed the upgrade tool, you are ready to start using
it on a 2.x application.

.. warning::
    Make sure you have backups/version control for your application's code.

    It is also a good idea to make a backup/commits after each sub-command.

To start off run the ``locations`` command::

    # View the options for the command
    bin/cake upgrade locations --help

    # Run the command in dry run mode.
    bin/cake upgrade locations --dry-run /path/to/app

The above will give a dry run output of what would happen. When you are ready to
run the command for real, remove the ``--dry-run`` flag. By using the ``--git``
flag the upgrade tool can automate moving files in git.

Once file locations have been updated, you can add namespaces to your code using
the ``namespaces`` command::

    # View the options for the command
    bin/cake upgrade namespaces --help

    # Run the command in dry run mode
    bin/cake upgrade namespaces --dry-run /path/to/app

    # Run the command for real
    bin/cake upgrade namespaces /path/to/app

After these two commands, you can run the remaining subcommands in any order.
