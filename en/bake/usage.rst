Code Generation with Bake
#########################

The cake console is run using the PHP CLI (command line interface).
If you have problems running the script, ensure that:

#. You have the PHP CLI installed and that it has the proper modules enabled (eg: MySQL, intl).
#. Users also might have issues if the database host is 'localhost' and should try '127.0.0.1' instead, as localhost can cause issues with PHP CLI.
#. Depending on how your computer is configured, you may have to set execute rights on the cake bash script to call it using ``bin/cake bake``.

Before running bake you should make sure you have at least one database
connection configured. See the section on :ref:`database configuration
<database-configuration>` for more information.

When run with no arguments ``bin/cake bake`` will output a list of available
tasks.

For windows system try with ``bin\cake bake``.

You should see something like:

.. code-block:: bash

    $ bin/cake bake -h

    Bake generates code for your application. Different types of classes can
    be generated with the subcommands listed below. For example run
    bake controller --help to learn more about generating a
    controller.

    Usage:
    cake bake [subcommand] [-h] [-q] [-v]

    Subcommands:

    all             Generate all files.
    behavior        Generate behavior files.
    cell            Generate cell files.
    command         Generate command files.
    component       Generate component files.
    controller      Generate controller files.
    controller all  Generate controller files.
    fixture         Generate fixture files.
    fixture all     Generate fixture files.
    form            Generate form files.
    helper          Generate helper files.
    mailer          Generate mailer files.
    middleware      Generate middleware files.
    model           Generate model files.
    model all       Generate model files.
    plugin          Generate plugin files.
    shell           Generate shell files.
    shell_helper    Generate shell helper files.
    task            Generate task files.
    template        Generate template files.
    template all    Generate template files.
    test            Generate test files.

    To see help on a subcommand use `cake bake [subcommand] --help`

    Options:

    --help, -h     Display this help.
    --quiet, -q    Enable quiet output.
    --verbose, -v  Enable verbose output.

    Older Shell based tasks will not be listed here, but can still be run.

You can get more information on each command using the ``-h`` option. e.g:
``bin/cake controller -h``.

Bake Themes
===========

The theme option is common to all bake commands, and allows changing the bake
template files used when baking. To create your own templates, see the
:ref:`bake theme creation documentation <creating-a-bake-theme>`.

.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,database,database configuration,bash script,basic ingredients,project,model,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
