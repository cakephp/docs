Completion du Shell
###################

.. versionadded:: 2.5

Travailler avec la console donne au développeur beaucoup de possibilités mais
devoir complètement connaître et écrire ces commandes peut être fastidieux.
Spécialement lors du développement de nouveaux shells où les commandes
diffèrent à chaque itération. Les Shells de Completion aident ce niveau-là
en fournissant une API pour écrire les scripts de completion pour les shells
comme like bash, zsh, fish etc...

Sous Commandes
==============

Les Shell de Completion se compose d'un certain nombre de sous-commandes pour
permettre au développeur de créer son script de completion. Chacun pour une
étape différente dans le processus d'autocompletion.

commandes
---------

Pour les premières étapes, les commandes sortent les Commandes de Shell
disponibles, y compris le nom du plugin quand il est valable. (Toutes les
possibilités retournées, pour celle-ci et les autres sous-commandes, sont
séparées par un espace.) Par exemple::

    ./Console/cake Completion commands

Retourne::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Votre script de completion peut selectionner les commandes pertinentes de cette
liste pour continuer avec. (Pour celle-là et les sous-commandes suivantes.)

subCommands
-----------

Une fois que la commande préférée a été choisie, les subCommands apparaissent
à la deuxième étape et sort la sous-commande possible pour la commande de
shell donnée. Par exemple::

    ./Console/cake Completion subcommands bake

Retourne::

    controller db_config fixture model plugin project test view

options
--------

En troisième et dernière options, les options de sortie pour une (sous)
commande donnée comme défini dans getOptionParser. (Y compris les options par
défaut héritées du Shell.)
Par exemple::

    ./Console/cake Completion options bake

Retourne::

    --help -h --verbose -v --quiet -q --connection -c --theme -t

Exemple de Bash
===============

L'exemple de bash suivant provient de l'auteur original::

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
