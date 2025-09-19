# Completion シェル

::: info Added in version 2.5
:::

コンソールを使うことは開発者に多くの可能性を与えます。しかし、コマンドを完全に覚えて
記述することは退屈です。特に、異なるコマンドを緻密に繰り返しながら、新しいシェルを
開発する時などです。Completion シェルは、bash ・ zsh ・ fish などのシェルの
補完スクリプトを書くための API を提供することによって、この問題を支援します。

## サブコマンド

Completion シェルは、開発者が補完スクリプトの作成を支援するためのいくつかのサブコマンドを
含みます。それぞれオートコンプリート順序の中の異なるステップのためのものです。

### commands

最初のステップは、利用可能なシェルコマンドをプラグイン名が必要な場合は付加して出力します。
(出力結果は、このコマンド自身や他のサブコマンド全てがスペースで区切られています。) 例:

    ./Console/cake Completion commands

実行結果:

    acl api bake command_list completion console i18n schema server test testsuite upgrade

あなたの補完スクリプトは、一連のリストから関連するコマンドを選ぶことができます。
(このコマンドや以下のサブコマンドなど)

### subCommands

いったん気に入ったコマンドが選ばれると、次の段階として subCommands に入ります。そして、
与えられたシェルコマンドのために利用可能なサブコマンドを出力します。例:

    ./Console/cake Completion subcommands bake

実行結果:

    controller db_config fixture model plugin project test view

### options

三番目で最後の options は getOptionParser で設定されるような
与えられた (サブ) コマンドのためのオプションを出力します。 (Shell から継承された
デフォルトのオプションを含みます。) 例:

    ./Console/cake Completion options bake

実行結果:

    --help -h --verbose -v --quiet -q --connection -c --theme -t

## Bash の例

以下の bash の例は、原著作者によるものです:

``` php
# bash completion for CakePHP console

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
            COMPREPLY=( $(compgen -df -- ${cur}) )
            return 0
        fi
        return 0
    fi


    opts=$(${cake} Completion fuzzy "${COMP_WORDS[@]:1}")
    COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
    if [[ $COMPREPLY = "" ]] ; then
        COMPREPLY=( $(compgen -df -- ${cur}) )
        return 0
    fi
    return 0;
}

complete -F _cake cake Console/cake
```
