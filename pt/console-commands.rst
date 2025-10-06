Console Commands
################

.. php:namespace:: Cake\Console

Além de um framework web, o CakePHP também fornece um framework de console para
criar ferramentas e aplicações de linha de comando. Aplicações de console são ideais para
lidar com uma variedade de tarefas de background e manutenção que aproveitam sua
configuração de aplicação, models, plugins e lógica de domínio existentes.

O CakePHP fornece várias ferramentas de console para interagir com recursos do CakePHP
como i18n e roteamento que permitem introspectar sua aplicação e
gerar arquivos relacionados.

O Console do CakePHP
====================

O Console do CakePHP usa um sistema tipo dispatcher para carregar comandos, analisar
seus argumentos e invocar o comando correto. Embora os exemplos abaixo usem
bash, o console do CakePHP é compatível com qualquer shell \*nix e windows.

Uma aplicação CakePHP contém o diretório **src/Command** que contém seus comandos.
Ela também vem com um executável no diretório **bin**:

.. code-block:: console

    $ cd /path/to/app
    $ bin/cake

.. note::

    Para Windows, o comando precisa ser ``bin\cake`` (observe a barra invertida).

Executar o Console sem argumentos listará os comandos disponíveis. Você
pode então executar qualquer um dos comandos listados usando seu nome:

.. code-block:: console

    # executar comando server
    bin/cake server

    # executar comando migrations
    bin/cake migrations -h

    # executar bake (com prefixo de plugin)
    bin/cake bake.bake -h

Comandos de plugin podem ser invocados sem um prefixo de plugin se o nome do comando
não sobrepõe um comando da aplicação ou do framework. No caso de dois
plugins fornecerem um comando com o mesmo nome, o primeiro plugin carregado terá
o alias curto. Você sempre pode usar o formato ``plugin.command`` para
referenciar inequivocamente um comando.

Aplicações de Console
======================

Por padrão, o CakePHP descobrirá automaticamente todos os comandos em sua
aplicação e seus plugins. Você pode querer reduzir o número de comandos expostos
ao construir aplicações de console standalone. Você pode usar o hook ``console()``
da sua ``Application`` para limitar quais comandos são expostos e
renomear comandos que são expostos::

    // em src/Application.php
    namespace App;

    use App\Command\UserCommand;
    use App\Command\VersionCommand;
    use Cake\Console\CommandCollection;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console(CommandCollection $commands): CommandCollection
        {
            // Adicionar por nome de classe
            $commands->add('user', UserCommand::class);

            // Adicionar instância
            $commands->add('version', new VersionCommand());

            return $commands;
        }
    }

No exemplo acima, os únicos comandos disponíveis seriam ``help``, ``version``
e ``user``. Veja a seção :ref:`plugin-commands` para saber como adicionar comandos em
seus plugins.

.. note::

    Ao adicionar múltiplos comandos que usam a mesma classe Command, o comando ``help``
    exibirá a opção mais curta.

.. _renaming-commands:
.. index:: nested commands, subcommands

Renomeando Comandos
===================

Há casos em que você desejará renomear comandos, para criar comandos aninhados
ou subcomandos. Embora a descoberta automática padrão de comandos não faça
isso, você pode registrar seus comandos para criar qualquer nomenclatura desejada.

Você pode personalizar os nomes dos comandos definindo cada comando em seu plugin::

    public function console(CommandCollection $commands): CommandCollection
    {
        // Adicionar comandos com nomenclatura aninhada
        $commands->add('user dump', UserDumpCommand::class);
        $commands->add('user:show', UserShowCommand::class);

        // Renomear um comando completamente
        $commands->add('lazer', UserDeleteCommand::class);

        return $commands;
    }

Ao sobrescrever o hook ``console()`` em sua aplicação, lembre-se de
chamar ``$commands->autoDiscover()`` para adicionar comandos do CakePHP, sua
aplicação e plugins.

Se você precisar renomear/remover quaisquer comandos anexados, você pode usar o
evento ``Console.buildCommands`` no gerenciador de eventos da sua aplicação para modificar os
comandos disponíveis.

Commands
========

Veja o capítulo :doc:`/console-commands/commands` sobre como criar seu primeiro
comando. Então aprenda mais sobre comandos:

.. toctree::
    :maxdepth: 1

    console-commands/commands
    console-commands/input-output
    console-commands/option-parsers
    console-commands/cron-jobs

Comandos Fornecidos pelo CakePHP
=================================

.. toctree::
    :maxdepth: 1

    console-commands/cache
    console-commands/completion
    console-commands/counter-cache
    console-commands/i18n
    console-commands/plugin
    console-commands/schema-cache
    console-commands/routes
    console-commands/server
    console-commands/repl

Roteamento no Ambiente de Console
==================================

Na interface de linha de comando (CLI), especificamente seus comandos de console,
``env('HTTP_HOST')`` e outras variáveis de ambiente específicas do navegador web não são
definidas.

Se você gerar relatórios ou enviar e-mails que façam uso de ``Router::url()``, eles
conterão o host padrão ``http://localhost/`` e, portanto, resultarão em
URLs inválidas. Neste caso, você precisa especificar o domínio manualmente.
Você pode fazer isso usando o valor Configure ``App.fullBaseUrl`` do seu
bootstrap ou config, por exemplo.

Para enviar e-mails, você deve fornecer à classe Email o host que deseja usar para
enviar o e-mail::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->setDomain('www.example.org');

Isso garante que os IDs de mensagem gerados são válidos e se ajustam ao domínio
de onde os e-mails são enviados.


.. meta::
    :title lang=pt: Shells, Tasks & Console Tools
    :keywords lang=pt: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,commands,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
