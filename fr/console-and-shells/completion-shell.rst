Complétion du Shell
###################

Travailler avec la console donne au développeur beaucoup de possibilités mais
devoir complètement connaître et écrire ces commandes peut être fastidieux.
Spécialement lors du développement de nouveaux shells où les commandes
diffèrent à chaque itération. Les Shells de complétion aident à ce niveau-là
en fournissant une API pour écrire les scripts de complétion pour les shells
comme bash, zsh, fish etc...

Sous-Commandes
==============

Les Shells de complétion se composent d'un certain nombre de sous-commandes qui
permettent au développeur de créer son propre script de complétion. Chacun pour
une étape différente dans le processus d'autocomplétion.

Commandes
---------

Pour les premières étapes, les commandes affichent les Commandes de Shell
disponibles, y compris le nom du plugin quand il est valable. (Toutes les
possibilités retournées, pour celle-ci et les autres sous-commandes, sont
séparées par un espace.) Par exemple::

    bin/cake completion commands

Retourne::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Votre script de complétion peut sélectionner les commandes pertinentes de cette
liste pour continuer avec. (Pour celle-là et les sous-commandes suivantes.)

Sous-Commandes
--------------

Une fois que la commande préférée a été choisie, les Sous-commandes apparaissent
à la deuxième étape et affiche la sous-commande possible pour la commande de
shell donnée. Par exemple::

    bin/cake completion subcommands bake

Retourne::

    controller db_config fixture model plugin project test view

Options
-------

En troisième et dernière option, les options de sortie pour une (sous)
commande donnée comme définies dans getOptionParser. (Y compris les options par
défaut héritées du Shell.)
Par exemple::

    bin/cake completion options bake

Retourne::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

Vous pouvez passer un autre argument représentant une sous-commande du shell :
cela vous retournera les options spécifiques à cette sous-commande.

Activer l'autocomplétion Bash pour la console CakePHP
=====================================================

Tout d'abord, assurez-vous que la librairie **bash-completion** est installée.
Si elle ne l'est pas, vous pouvez le faire en exécutant la commande suivante::

    apt-get install bash-completion

Créez un fichier **cake** dans **/etc/bash_completion.d/** et placez-y le
:ref:`bash-completion-file-content`.

Sauvegardez le fichier et rédémarrez la console.

.. note::

    Si vous utilisez MacOS X, vous pouvez installer la librairie
    **bash-completion** en utilisant **homebrew** avec la commande suivante :
    ``brew install bash-completion``. Le répertoire cible du fichier **cake**
    devra être **/usr/local/etc/bash_completion.d/**.

.. _bash-completion-file-content:

Contenu du fichier bash d'autocomplétion
----------------------------------------

Voici le code que vous devez saisir dans le fichier **cake** (préalablement créé
au bon emplacement pour bénéficier de l'autocomplétion quand vous utilisez la
console CakePHP::

    #
    # Fichier de completion Bash pour la console CakePHP
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
                opts=$(${cake} completion options)
            elif [[ ${COMP_CWORD} = 2 ]] ; then
                opts=$(${cake} completion options "${COMP_WORDS[1]}")
            else
                opts=$(${cake} completion options "${COMP_WORDS[1]}" "${COMP_WORDS[2]}")
            fi

            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            return 0
        fi

        if [[ ${COMP_CWORD} = 1 ]] ; then
            opts=$(${cake} completion commands)
            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            return 0
        fi

        if [[ ${COMP_CWORD} = 2 ]] ; then
            opts=$(${cake} completion subcommands $prev)
            COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            if [[ $COMPREPLY = "" ]] ; then
                _filedir
                return 0
            fi
            return 0
        fi

        opts=$(${cake} completion fuzzy "${COMP_WORDS[@]:1}")
        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        if [[ $COMPREPLY = "" ]] ; then
            _filedir
            return 0
        fi
        return 0;
    }

    complete -F _cake cake bin/cake

Utilisez l'autocompletion
=========================

Une fois activée, l'autocompletion peut être utilisée de la même manière que
pour les autres commandes natives du système, en utilisant la touche **TAB**.
Trois types d'autocompletion sont fournis. Les examples de retour qui suivent
proviennent d'une installation fraîche de CakePHP.

Commandes
---------

Exemple de rendu pour l'autocomplétion des commandes::

    $ bin/cake <tab>
    bake        i18n        orm_cache   routes
    console     migrations  plugin      server

Sous-commandes
--------------

Exemple de rendu pour l'autocomplétion des sous-commandes::

    $ bin/cake bake <tab>
    behavior            helper              shell
    cell                mailer              shell_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

Options
-------

Exemple de rendu pour l'autocomplétion des options d'une sous-commande::

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

