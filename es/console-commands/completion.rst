Herramienta de completación
###########################

Trabajar con la consola le brinda al desarrollador muchas posibilidades, pero tener que conocer y escribir
completamente esos comandos puede resultar tedioso. Especialmente cuando se desarrollan nuevos shells donde
los comandos difieren por minuto de iteración. Completion Shells ayuda en este asunto al proporcionar una
API para escribir scripts de completación para shells como bash, zsh, fish, etc.

Sub Comandos
============

El Shell de completación consta de varios subcomandos para ayudar al desarrollador a crear su script
de finalización. Cada uno para un paso diferente en el proceso de autocompletar.

Comandos
--------

Para los comandos del primer paso, se generan los comandos de Shell disponibles, incluido el nombre del
complemento cuando corresponda. (Todas las posibilidades devueltas, para este y otros subcomandos, están
separadas por un espacio). Por ejemplo::

    bin/cake Completion commands

Regresará::

    acl api bake command_list completion console i18n schema server test testsuite upgrade

Su secuencia de comandos de completación puede seleccionar los comandos relevantes de esa lista para continuar.
(Para este y los siguientes subcomandos).

subcomandos
-----------

Una vez que se ha elegido el comando preferido, los subCommands entran como segundo paso y generan
el posible subcomando para el comando de shell dado. Por ejemplo::

    bin/cake Completion subcommands bake

Regresará::

    controller db_config fixture model plugin project test view

opciones
--------

Como tercera y última opción, genera opciones para el (sub)comando dado, tal como se establece en ``getOptionParser``.
(Incluidas las opciones predeterminadas heredadas de Shell).
Por ejemplo::

    bin/cake Completion options bake

Regresará::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

También puede pasar un argumento adicional que sea el subcomando del shell: generará las opciones
específicas de este subcomando.

Cómo habilitar el autocompletado de Bash para la consola CakePHP
================================================================

Primero, asegúrese de que la biblioteca **bash-completion** esté instalada.
Si no, lo haces con el siguiente comando::

    apt-get install bash-completion

Cree un archivo llamado **cake** en **/etc/bash_completion.d/** y coloque el
:ref:`bash-completion-file-content` dentro de él.

Guarde el archivo y luego reinicie su consola.

.. note::

    Si está utilizando MacOS X, puede instalar la biblioteca **bash-completion** usando **homebrew**
    con el comando ``brew install bash-completion``.
    El directorio de destino para el archivo **cake** será **/usr/local/etc/bash_completion.d/**.

.. _bash-completion-file-content:

Contenido del archivo de completación de Bash
----------------------------------------------

Este es el código que debes colocar dentro del archivo **cake** en la ubicación correcta para obtener el autocompletado al usar la consola CakePHP:

.. code-block:: bash

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

Usando el autocompletado
========================

Una vez habilitado, el autocompletado se puede usar de la misma manera que para otros comandos integrados,
usando la tecla **TAB**.
Se proporcionan tres tipos de autocompletado. El siguiente resultado proviene de una nueva instalación de CakePHP.

Comandos
--------

Salida de muestra para comandos de autocompletar:

.. code-block:: console

    $ bin/cake <tab>
    bake        i18n        schema_cache   routes
    console     migrations  plugin         server

Subcomandos
-----------

Salida de muestra para el autocompletado de subcomandos:

.. code-block:: console

    $ bin/cake bake <tab>
    behavior            helper              command
    cell                mailer              command_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

Opciones
--------

Salida de muestra para el autocompletado de opciones de subcomandos:

.. code-block:: console

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

