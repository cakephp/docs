Ferramenta de atualização
#########################

Atualizar sua versão do CakePHP 2 para o CakePHP 3 requer um número considerável
de alterações que podem ser automatizadas, como adicionar *namespaces*. Para
auxiliar a execução dessas tarefas, o CakePHP oferece uma ferramenta de
atualização via CLI (linha de comando).

Instalação
==========

A ferramenta de atualização é instalada como uma aplicação independente. Você
precisará clonar o repositório com o git e instalar as dependências com o
composer::

    git clone https://github.com/cakephp/upgrade.git
    cd upgrade
    php ../composer.phar install

Nesse ponto, você deve conseguir receber ajuda a partir da própria ferramenta::

    cd upgrade
    bin/cake upgrade --help

A referência acima deve entregar algo parecido com::

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

Uso
===

Uma vez que a ferramenta de atualização foi instalada corretamente, você pode
começar a usá-la numa aplicação 2.x.

.. warning::
    Certifique-se que você tem *backups*/controle de versão do código de sua
    aplicação.

    Também é uma boa ideia fazer *backups*/*commits* depois de cada sub-comando.

Para começar execute o comando ``locations``::

    # Vê as opções do comando
    bin/cake upgrade locations --help

    # Executa o comando em modo dry
    bin/cake upgrade locations --dry-run /caminho/do/app

Os comandos acima irão retornar uma saída emulada de tudo que pode acontecer.
Quando você estiver pronto para executar o comando de verdade, remova a *flag*
``--dry-run``. Ao usar a *flag* ``--git``, a ferramenta de atualização pode
automatizar a inclusão de arquivos no git.

Uma vez que a localização dos arquivos foi atualizada, você pode adicionar
*namespaces* ao seu código usando o comando ``namespaces``::

    # Vê as opções do comando
    bin/cake upgrade namespaces --help

    # Executa o comando em modo de emulação
    bin/cake upgrade namespaces --dry-run /caminho/do/app

    # Executa o comando em modo real
    bin/cake upgrade namespaces /caminho/do/app

Depois desses dois comandos, você pode executar os subcomandos restantes em
qualquer ordem.
