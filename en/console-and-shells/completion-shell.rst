Completion Shell
################

Working with the console gives the developer a lot of possibilities but having
to completely know and write those commands can be tedious. Especially when
developing new shells where the commands differ per minute iteration. The
Completion Shells aids in this matter by providing an API to write completion
scripts for shells like bash, zsh, fish etc.

Sub Commands
============

The Completion Shell consists of a number of sub commands to assist the
developer creating its completion script. Each for a different step in the
autocompletion process.

Commands
--------

For the first step commands outputs the available Shell Commands, including
plugin name when applicable. (All returned possibilities, for this and the other
sub commands, are separated by a space.) For example::

    bin/cake Completion commands

Returns::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Your completion script can select the relevant commands from that list to
continue with. (For this and the following sub commands.)

subCommands
-----------

Once the preferred command has been chosen subCommands comes in as the second
step and outputs the possible sub command for the given shell command. For
example::

    bin/cake Completion subcommands bake

Returns::

    controller db_config fixture model plugin project test view

options
-------

As the third and final options outputs options for the given (sub) command as
set in getOptionParser. (Including the default options inherited from Shell.)
For example::

    bin/cake Completion options bake

Returns::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

You can also pass an additional argument being the shell sub-command : it will
output the specific options of this sub-command.

How to enable Bash autocompletion for the CakePHP Console
=========================================================

First, make sure the **bash-completion** library is installed. If not, you do it
with the following command::

    apt-get install bash-completion

Create a file named **cake** in **/etc/bash_completion.d/** and put the
:ref:`bash-completion-file-content` inside it.

Save the file, then restart your console.

.. note::

    If you are using MacOS X, you can install the **bash-completion** library
    using **homebrew** with the command ``brew install bash-completion``.
    The target directory for the **cake** file will be
    **/usr/local/etc/bash_completion.d/**.

.. _bash-completion-file-content:

Bash Completion file content
----------------------------

This is the code you need to put inside the **cake** file in the correct location
in order to get autocompletion when using the CakePHP console::

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

Using autocompletion
====================

Once enabled, the autocompletion can be used the same way than for other
built-in commands, using the **TAB** key.
Three type of autocompletion are provided. The following output are from a fresh CakePHP install.

Commands
--------

Sample output for commands autocompletion::

    $ bin/cake <tab>
    bake        i18n        schema_cache   routes
    console     migrations  plugin         server

Subcommands
-----------

Sample output for subcommands autocompletion::

    $ bin/cake bake <tab>
    behavior            helper              shell
    cell                mailer              shell_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

Options
-------

Sample output for subcommands options autocompletion::

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

