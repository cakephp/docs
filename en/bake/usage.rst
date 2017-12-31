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
tasks. You should see something like::

    $ bin/cake bake

    Welcome to CakePHP v3.4.6 Console
    ---------------------------------------------------------------
    App : src
    Path: /var/www/cakephp.dev/src/
    PHP : 5.6.20
    ---------------------------------------------------------------
    The following commands can be used to generate skeleton code for your application.

    Available bake commands:

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
    - migration_diff
    - migration_snapshot
    - model
    - plugin
    - seed
    - shell
    - shell_helper
    - task
    - template
    - test

    By using `cake bake [name]` you can invoke a specific bake task.


You can get more information on what each task does, and what options are
available using the ``--help`` option::

    $ bin/cake bake --help

    Welcome to CakePHP v3.4.6 Console
    ---------------------------------------------------------------
    App : src
    Path: /var/www/cakephp.dev/src/
    PHP : 5.6.20
    ---------------------------------------------------------------
    The Bake script generates controllers, models and template files for
    your application. If run with no command line arguments, Bake guides the
    user through the class creation process. You can customize the
    generation process by telling Bake where different parts of your
    application are using command line arguments.

    Usage:
    cake bake.bake [subcommand] [options]

    Subcommands:

    all                 Bake a complete MVC skeleton.
    behavior            Bake a behavior class file.
    cell                Bake a cell class file.
    component           Bake a component class file.
    controller          Bake a controller skeleton.
    fixture             Generate fixtures for use with the test suite. You
                        can use `bake fixture all` to bake all fixtures.
    form                Bake a form class file.
    helper              Bake a helper class file.
    mailer              Bake a mailer class file.
    migration           Bake migration class.
    migration_diff      Bake migration class.
    migration_snapshot  Bake migration snapshot class.
    model               Bake table and entity classes.
    plugin              Create the directory structure, AppController class
                        and testing setup for a new plugin. Can create
                        plugins in any of your bootstrapped plugin paths.
    seed                Bake seed class.
    shell               Bake a shell class file.
    shell_helper        Bake a shell_helper class file.
    task                Bake a task class file.
    template            Bake views for a controller, using built-in or
                        custom templates.
    test                Bake test case skeletons for classes.

    To see help on a subcommand use `cake bake.bake [subcommand] --help`

    Options:

    --connection, -c   Database connection to use in conjunction with `bake
                       all`. (default: default)
    --everything       Bake a complete MVC skeleton, using all the available
                       tables. Usage: "bake all --everything"
    --force, -f        Force overwriting existing files without prompting.
    --help, -h         Display this help.
    --plugin, -p       Plugin to bake into.
    --prefix           Prefix to bake controllers and templates into.
    --quiet, -q        Enable quiet output.
    --tablePrefix      Table prefix to be used in models.
    --theme, -t        The theme to use when baking code. (choices:
                       Bake|Migrations)
    --verbose, -v      Enable verbose output.

Bake Themes
===========

The theme option is common to all bake commands, and allows changing the bake
template files used when baking. To create your own templates, see the
:ref:`bake theme creation documentation <creating-a-bake-theme>`.

.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,database,database configuration,bash script,basic ingredients,project,model,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
