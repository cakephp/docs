Ferramenta de Conclusão
#######################

Trabalhar com o console oferece muitas possibilidades ao desenvolvedor, mas ter
que conhecer e escrever completamente esses comandos pode ser tedioso. Especialmente ao
desenvolver novos shells, onde os comandos diferem a cada minuto de iteração. Os
Shells de Conclusão auxiliam nessa questão, fornecendo uma API para escrever scripts de conclusão
para shells como bash, zsh, fish etc.

Sub Comandos
============

O Shell de Conclusão consiste em vários subcomandos para auxiliar o
desenvolvedor na criação do seu script de conclusão. Cada um para uma etapa diferente no
processo de conclusão automática.

Comandos
--------

Para o primeiro passo, os comandos geram os Comandos Shell disponíveis, incluindo
o nome do plugin, quando aplicável. (Todas as possibilidades retornadas, para este e os outros
subcomandos, são separadas por um espaço.) Por exemplo::

    bin/cake Completion commands

Returns::

    acl api bake command_list conclusão console i18n esquema servidor teste suíte de testes atualização

Seu script de conclusão pode selecionar os comandos relevantes dessa lista para
continuar. (Para este e os subcomandos seguintes.)

subComandos
-----------

Uma vez escolhido o comando preferido, o comando subComandos entra como a segunda
etapa e gera o possível subcomando para o comando shell fornecido. Por
exemplo::

    bin/cake Completion subcommands bake

Returns::

    controller db_config modelo de fixação plugin projeto teste visualização

opções
------

Como a terceira e última opção, são geradas opções para o (sub)comando fornecido, conforme
definido em getOptionParser. (Incluindo as opções padrão herdadas do Shell.)
Por exemplo::

    bin/cake Completion options bake

Returns::

    --help -h --verbose -v --quiet -q --everything --connection -c --force -f --plugin -p --prefix --theme -t

Você também pode passar um argumento adicional, que é o subcomando do shell: ele irá
exibir as opções específicas deste subcomando.

Como Habilitar o Preenchimento Automático do Bash para o Console CakePHP
========================================================================

Primeiro, certifique-se de que a biblioteca **bash-completion** esteja instalada. Caso contrário, faça isso
com o seguinte comando::

    apt-get install bash-completion

Crie um arquivo chamado **cake** em **/etc/bash_completion.d/** e insira o
:ref:`bash-completion-file-content` dentro dele.

Salve o arquivo e reinicie o console.

.. note::

    Se estiver usando o MacOS X, você pode instalar a biblioteca **bash-completion**
    usando o **homebrew** com o comando ``brew install bash-completion``.
    O diretório de destino para o arquivo **cake** será
    **/usr/local/etc/bash_completion.d/**.

.. _bash-completion-file-content:

Conteúdo do arquivo Bash Conclusão
----------------------------------

Este é o código que você precisa inserir dentro do arquivo **cake** no local correto
para obter o preenchimento automático ao usar o console do CakePHP:

.. code-block:: bash

    #
    # Arquivo de conclusão Bash para console CakePHP
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

Usando autoconclusão
====================

Uma vez habilitado, a autoconclusão pode ser usado da mesma forma que para outros
comandos integrados, usando a tecla **TAB**.
São fornecidos três tipos de autoconclusão. A saída a seguir é de uma instalação recente do CakePHP.

Comandos
--------

Exemplo de saída para comandos de autoconclusão:

.. code-block:: console

    $ bin/cake <tab>
    bake        i18n        schema_cache   routes
    console     migrations  plugin         server

Subcommands
-----------

Exemplo de saída para subcomandos de autoconclusão:

.. code-block:: console

    $ bin/cake bake <tab>
    behavior            helper              command
    cell                mailer              command_helper
    component           migration           template
    controller          migration_snapshot  test
    fixture             model
    form                plugin

Opções
------

Exemplo de saída para subcomandos de autoconclusão:

.. code-block:: console

    $ bin/cake bake -<tab>
    -c            --everything  --force       --help        --plugin      -q            -t            -v
    --connection  -f            -h            -p            --prefix      --quiet       --theme       --verbose

