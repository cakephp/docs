Completion シェル
#################

コンソールで作業する開発者は多くの可能性を提供しますが、コマンドを完全に覚えて
記述することは退屈です。特に、異なるコマンドを緻密に繰り返しながら、
新しいシェルを開発する時などです。Completion シェルは、bash ・ zsh ・ fish
などのシェルの補完スクリプトを書くための API を提供することによって、
この問題を支援します。

サブコマンド
============

Completion シェルは、開発者が補完スクリプトの作成を支援するためのいくつかの
サブコマンドを含みます。それぞれ自動補完プロセスの中の異なるステップのための
ものです。

commands
--------

最初のステップは、利用可能なシェルコマンドをプラグイン名が必要な場合は付加して
出力します。(出力結果は、このコマンド自身や他のサブコマンド全てがスペースで
区切られています。) 例えば::

    bin/cake Completion commands

実行結果::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

あなたの補完スクリプトは、一連のリストから関連するコマンドを選ぶことができます。
(このコマンドや以下のサブコマンドなど)

subCommands
-----------

いったん気に入ったコマンドが選ばれると、次の段階として subCommands に入ります。
そして、与えられたシェルコマンドのために利用可能なサブコマンドを出力します。
例えば::

    bin/cake Completion subcommands bake

実行結果::

    controller db_config fixture model plugin project test view

options
-------

三番目で最後の options は getOptionParser で設定されるような与えられた
(サブ) コマンドのためのオプションを出力します。
(Shell から継承されたデフォルトのオプションを含みます。)
例えば::

    bin/cake Completion options bake

実行結果::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

また、シェルのサブコマンドである追加の引数を渡すことができます。それが、
このサブコマンドの特定のオプションを出力します。

CakePHP コンソール用の Bash 自動補完を有効にする方法
=====================================================

まず、**bash-completion** ライブラリーがインストールされていることを確認します。
もし、ない場合は、次のコマンドでインストールします。 ::

    apt-get install bash-completion

**/etc/bash_completion.d/** に **cake** をという名前のファイルを作成し、配置します。
そのファイル中に :ref:`bash-completion-file-content` を記述してください。

ファイルを保存して、コンソールを再起動してください。

.. note::

    MacOS X を使用している場合は、**homebrew** で ``brew install bash-completion`` を使って
    **bash-completion** ライブラリーをインストールすることができます。
    **cake** ファイルの対象ディレクトリーは、 **/usr/local/etc/bash_completion.d/** になります。

.. _bash-completion-file-content:

Bash 補完ファイルの内容
-----------------------

これは、CakePHP コンソールを使用しているときに自動補完を得るために正しい位置の
**cake** ファイルの内側に配置する必要があるコードです。 ::

    #
    # Bash completion file for CakePHP console
    #

    _cake()
    {
        local cur prev opts cake
        COMPREPLY=()
        cake="${COMP_WORDS[0]}"
        cur="${COMP_WORDS[COMP_CWORD]}"
        prev="${COMP_WORDS[COMP_CWORD-1]}"

        if [[ "$cur" == -* ]] ; then
            if [[ ${COMP_CWORD} = 1 ]] ; then
                opts=$(${cake} Completion options)
            elif [[ ${COMP_CWORD} = 2 ]] ; then
                opts=$(${cake} Completion options "${COMP_WORDS[1]}")
            else
                opts=$(${cake} Completion options "${COMP_WORDS[1]}" "${COMP_WORDS[2]}")
            fi

            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            return 0
        fi

        if [[ ${COMP_CWORD} = 1 ]] ; then
            opts=$(${cake} Completion commands)
            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            return 0
        fi

        if [[ ${COMP_CWORD} = 2 ]] ; then
            opts=$(${cake} Completion subcommands $prev)
            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            if [[ $COMPREPLY = "" ]] ; then
                _filedir
                return 0
            fi
            return 0
        fi

        opts=$(${cake} Completion fuzzy "${COMP_WORDS[@]:1}")
        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        if [[ $COMPREPLY = "" ]] ; then
            _filedir
            return 0
        fi
        return 0;
    }

    complete -F _cake cake bin/cake

自動補完の利用
==============

有効にすると、**TAB** キーを使用することで、他のビルトインコマンドと同じ方法で
自動補完を使用することができます。自動補完の 3 つのタイプが用意されています。
インストールしたばかりの CakePHP から次の出力があります。

コマンド
--------

コマンドの自動補完のためのサンプル出力::

    $ bin/cake <tab>
    bake        i18n        orm_cache   routes
    console     migrations  plugin      server

サブコマンド
------------

サブコマンドの自動補完のためのサンプル出力::

    $ bin/cake bake <tab>
    behavior            helper              shell
    cell                mailer              shell_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

オプション
----------

サブコマンドのオプションの自動補完のためのサンプル出力::

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

