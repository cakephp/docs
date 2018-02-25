Pagkumpleto ng Shell
################

Ang paggawa sa console ay nagbibigay sa developer ng maraming mga posibilidad ngunit ang pagkakaroon na
upang lubos na malaman at maisulat ang mga command na iyon ay maaaring nakakapagod. Lalo na kapag 
nagbubuo ng mga bagong shell kung saan ang mga command ay naiiba sa bawat minuto ng pag-uulit. Ang 
Pagkumpleto ng mga Shell ay tumutulong sa bagay na ito sa pamamagitan ng pagbibigay ng isang API upang magsulat ng kumpletong 
mga script para sa mga shell tulad ng bash, zsh, fish atbp.

Mga Sub na Command
============

Ang Pagkumpleto ng Shell ay binubuo ng isang bilang ng mga sub na command upang tulungan ang 
developer na lumikha ng kumpletong script. Bawat isa para sa ibang hakbang sa 
autocompletion na proseso.

Mga Command
--------

Para sa unang hakbang ng mga command ay nag-output ng magagamit na mga Command ng Shell, kasama ang 
pangalan ng plugin kapag naaangkop. (Lahat ng ibinalik ng mga posibilidad, para dito at sa iba pang 
mga sub na command, ay pinaghihiwalay ng isang puwang.) Halimbawa::

    bin/cake Completion commands

Ibabalik::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Ang iyong script ng pagkumpleto ay maaaring pumili ng may katuturang mga command mula sa listahang iyon para
magpagtuloy. (Para dito at sa sumusunod na mga sub na command.)

mga subCommand
-----------

Kapang ang preferred na command ay napili na ang mga subCommand dadating bilang ang pangalawang 
hakbang at i-output ang posibleng sub na command para sa ibinigay na command ng shell. 
Halimbawa::

    bin/cake Completion subcommands bake

Ibabalik::

    controller db_config fixture model plugin project test view

mga opsyon
-------

Habang ang pangatlo at pangwakas ay mag-output ng mga opsyon para sa ibinigay na (sub) command bilang
na-set sa getOptionParser. (Kabilang ang default na mga opsyon na na-inherit mula sa Shell.)
Halimbawa::

    bin/cake Completion options bake

Ibabalik::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

Maaari mo ring ipasa ang karagdagang argumento bilang sub-command ng shell : ito ay 
mag-output ng tiyak na mga opsyon ng sub-command na ito.

Paano paganahin ang autocompletion ng Bash para sa Console ng CakePHP
=========================================================

Una, siguraduhin na ang **bash-completion** na library ay naka-install. Kung hindi, gagawin mo ito 
kasama ang sumusunod na command::

    apt-get install bash-completion

Lumikha ng file na pinangalanang **cake** in **/etc/bash_completion.d/** at ilagay ang 
:ref:`bash-completion-file-content` sa loob nito.

I-save ang file, pagkatapas ay i-restart ang iyong console.

.. tandaan::

    Kung ikaw ay gumagamit ng MacOS X, maaari mong i-install ang **bash-completion** na library
    gamit ang **homebrew** na may command na ``brew install bash-completion``.
    Ang target na directory para sa **cake** na file ay magiging 
    **/usr/local/etc/bash_completion.d/**.

.. _bash-completion-file-content:

Pagkumpleto ng Bash na nilalaman ng file
----------------------------

Ito ang code na kailangan mong ilagay sa loob ng **cake** na file sa tamang lokasyon
upang makakuha ng autocompletion kapag ginagamit ang console ng CakePHP::

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

Paggamit ng autocompletion
====================

Kapag na-enable, ang autocompletion ay maaaring gamitin sa parehong paraan kaysa sa ibang 
built-in na mga command, gamit ang **TAB** na key.
Tatlong uri ng autocompletion ang ibibigay. Ang sumusunod na output ay mula sa isang sariwang pag-install ng CakePHP.

Mga Command
--------

Sample na output para sa autocompletion ng mga command::

    $ bin/cake <tab>
    bake        i18n        orm_cache   routes
    console     migrations  plugin      server

Mga Subcommand
-----------

Sample na output para sa autocompletion ng mga subcommand::

    $ bin/cake bake <tab>
    behavior            helper              shell
    cell                mailer              shell_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

Mga Opsyon
-------

Sample na output para sa autocompletion ng mga opsyon ng mga subcommand::

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

