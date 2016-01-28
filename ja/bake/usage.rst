Bakeでコード生成
#########################

..
    Code Generation with Bake

..
    Depending on how your computer is configured, you may have to set
    execute rights on the cake bash script to call it using ``bin/cake
    bake``. The cake console is run using the PHP CLI (command line
    interface). If you have problems running the script, ensure that
    you have the PHP CLI installed and that it has the proper modules
    enabled (eg: MySQL, intl). Users also might have issues if the
    database host is 'localhost' and should try '127.0.0.1' instead, as localhost
    can cause issues with PHP CLI.

使っているコンピュータの設定に応じて、``bin/cake bake`` の実行権限を設定する必要があります。
cake bakeはPHP CLI(CommandLineInterface)上で動作します。
もしスクリプトに問題がおこった場合は、PHP CLIがインストールされているかモジュールが有効か確認してください。
ユーザーはまた問題の可能性がある、もしデータベースが'localhost'の代わりに '127.0.0.1' を使って下さい。PHP CLIが原因でこの問題がおこる可能性があります。

..
    Before running bake you should make sure you have at least one database
    connection configured. See the section on :ref:`database configuration
    <database-configuration>` for more information.

cake bakeが走る前にデータベースとの接続を確認するべきです。
詳しくは :ref:`データベースアクセス & ORM 内の設定 <database-configuration>` をご参照ください。

..
    When run with no arguments ``bin/cake bake`` will output a list of available
    tasks. You should see something like:

``bin/cake bake`` を引数無しで実行すると可能なタスクを表示できます。
それは以下のような表示のものです::

    $ bin/cake bake

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : src
    Path: /var/www/cakephp.dev/src/
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
    - model
    - plugin
    - shell
    - template
    - test

    By using `cake bake [name]` you can invoke a specific bake task.

..
    You can get more information on what each task does, and what options are
    available using the ``--help`` option:

より詳しい各コマンドの情報を得るには、``--help`` オプションをつけ実行してください。::

    $ bin/cake bake controller --help

    Welcome to CakePHP v3.0.0 Console
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

Bake テーマオプション
=======================
.. 
    Bake Themes

..
    The theme option is common to all bake commands, and allows changing the bake
    template files used when baking. To create your own templates, see the
    :ref:`bake theme creation documentation <creating-a-bake-theme>`.

テーマオプションは全bakeで一般的です。また、bake テンプレートファイルを変更することができます。
テーマを作るには、 :ref:`bake theme creation documentation <creating-a-bake-theme>` を参照してください。

.. meta::
    :title lang=ja: Code Generation with Bake
    :keywords lang=ja: command line interface,functional application,database,database configuration,bash script,basic ingredients,project,model,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql
