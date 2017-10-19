Geração de código com bake
##########################

O console do cake é executado usando a CLI do PHP (interface da linha de comando).
Se você tiver problemas para executar o script, assegure-se de que:

#. Você instalou a CLI do PHP e possui os módulos apropriados habilitados (por exemplo: MySQL, intl).
#. Os usuários também podem ter problemas se o host do banco de dados for 'localhost' e deve tentar '127.0.0.1', em vez disso, como localhost pode causar problemas com CLI PHP.
#. Dependendo de como o seu computador está configurado, você pode ter que definir direitos de execução no script cake bash para chamá-lo usando ``bin/cake bake``.

Antes de executar o Bake você deve certificar-se de ter pelo menos um banco de dados
conexão configurada. Veja a seção sobre :ref:`database configuration
<database-configuration>` para mais informações.

Quando executado sem argumentos ``bin/cake bake`` irá exibir uma lista de
tarefas. Você deve ver algo como::

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


Você pode obter mais informações sobre o que cada tarefa faz e quais são as opções
disponível usando o ``--help`` option::

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

Temas para o Bake
=================

A opção de tema é comum a todos os comandos do bake, e permite mudar os arquivos de modelo usados no bake. Para criar seus próprios modelos, veja a
:ref:`documentação de criação de themes para o bake <criando-um-theme-para-o-bake>`.

.. meta::
    :title lang=pt: Geração de código com bake
    :keywords lang=pt: command line interface,functional application,database,database configuration,bash script,basic ingredients,project,model,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
