Ang Paggenerate ng Code kasama ang Bake
#########################

Ang cake na console ay pinapatakbo gamit ang PHP na CLI (command line interface).
Kung may mga problema ka sa pagpapatakbo ng script, siguraduhin na:

#. Mayroon kang naka-install na PHP CLI at mayroon itong wastong mga modyul na pinagana (eg: MySQL, intl).
#. Ang mga gumagamit ay maaaring magkaroon ng mga isyu kung ang host ng database ay 'localhost' at dapat subukan ang '127.0.0.1' sa halip, dahil ang localhost ay maaaring maging sanhi ng mga isyu sa CLI ng PHP.
#. Dependi kung paano naka-configure ang iyong computer, maaari mong itakda ang mga karapatan sa pag-execute sa script ng cake na bash upang tawagin ito gamit ang ``bin/cake bake``.

Bago patakbuhin ang bake dapat mong tiyakin na mayroon kang hindi bababa sa isang database
na koneksyon na naka-configure. Tingnan ang seksyon sa :ref:`database configuration
<database-configuration>` para sa karagdagang impormasyon.

Kapag pinatakbo na walang mga argumento ang ``bin/cake bake`` ay mag-output ng isang listahan ng magagamit na 
mga gawain. Dapat mong makita ang isang bagay tulad ng::

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

Makakakuha ka ng karagdagang impormasyon kung ano ang ginagawa ng bawat gawain, at kung anung mga opsyon ang 
magagamit gamit ang ``--help`` option::

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

Mga Tema ng Bake
===========

Ang opsyon ng tema ay pangkaraniwan sa lahat ng mga command ng bake, at nagpapahintulot sa pagbabago ng bake 
na template na mga file na ginagamit sa pagbi-bake. Para lumikha ng iyong sariling mga templates, tingnan ang 
:ref:`bake theme creation documentation <creating-a-bake-theme>`.

.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,database,database configuration,bash script,basic ingredients,project,model,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
