Completion Shell
################

.. versionadded:: 2.5

Working with the console gives the developer a lot of possibilities but having
to completely know and write those commands can be tedious. Especially when
developing new shells where the commands differ per minute iteration. The
Completion Shells aids in this matter by providing an API to write completion
scripts for shells like bash, zsh, fish etc.

Sub Commands
============

The Completion Shell consists of a number of sub commands to assist the
developer creating it's completion script. Each for a different step in the
autocompletion process.

commands
--------

For the first step commands outputs the available Shell Commands, including
plugin name when applicable. (All returned possibilities, for this and the other
sub commands, are separated by a space.) For example::

    ./Console/cake Completion commands

Returns::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Your completion script can select the relevant commands from that list to
continue with. (For this and the following sub commands.)

subCommands
-----------

Once the preferred command has been chosen subCommands comes in as the second
step and outputs the possible sub command for the given shell command. For
example::

    ./Console/cake Completion subcommands bake

Returns::

    controller db_config fixture model plugin project test view

options
--------

As the third and final options outputs options for the given (sub) command as
set in getOptionParser. (Including the default options inherited from Shell.)
For example::

    ./Console/cake Completion options bake

Returns::

    --help -h --verbose -v --quiet -q --connection -c --theme -t

Bash Example
============

The following bash example comes from the original author::

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
