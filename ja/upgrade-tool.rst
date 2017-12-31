アップグレードツール
####################

CakePHP 2.x から CakePHP 3 にアップグレードするためには、多くの変換が必要となります。
それは、名前空間を追加するなど、自動化することができます。これらの機械的な変換を容易に
作成することを支援するために、CakePHP は CLI ベースのアップグレードツールを提供します。

インストール
============

アップグレードツールは、スタンドアロンアプリケーションとしてインストールされています。
アップグレードツールを git clone して、composer で依存関係をインストールする必要があります。 ::

    git clone https://github.com/cakephp/upgrade.git
    cd upgrade
    php ../composer.phar install

この時点で、アップグレードツールのヘルプを確認することができます。 ::

    cd upgrade
    bin/cake upgrade --help

上記の出力は次のようになります。 ::

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
    all                 Run all tasks expect for skeleton. That task should
                        only be run manually, and only for apps (not
                        plugins).

    To see help on a subcommand use `cake upgrade [subcommand] --help`

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

使用法
=======

アップグレードツールを正しくインストールしたら、2.x のアプリケーションに対して
使用を開始する準備ができています。

.. warning::
    アプリケーションのコードのバックアップやバージョン管理していることを確認してください。

    各サブコマンドの後にバックアップやコミットすることも良いアイデアです。

``locations`` コマンドの実行を開始するには::

    # コマンドのオプションを表示
    bin/cake upgrade locations --help

    # dry run モードでコマンドを実行
    bin/cake upgrade locations --dry-run /path/to/app

上記は、何が起こるかの予行演習の出力が得られます。実際にコマンドを実行する準備ができたら、
``--dry-run`` フラグを削除します。 ``--git`` フラグを使用することにより、
アップグレードツールは git の内のファイルの移動を自動化することができます。

ファイルの場所が更新されたら、 ``namespaces`` コマンドを使用してコードに名前空間を
追加することができます。 ::

    # コマンドのオプションを表示
    bin/cake upgrade namespaces --help

    # dry run モードでコマンドを実行
    bin/cake upgrade namespaces --dry-run /path/to/app

    # 実際にコマンドを実行
    bin/cake upgrade namespaces /path/to/app

この2つのコマンドの後、任意の順序で残りのサブコマンドを実行することができます。
