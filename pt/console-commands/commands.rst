Objetos de Comando
##################

.. php:namespace:: Cake\Console
.. php:class:: Command

O CakePHP vem com uma série de comandos integrados para acelerar seu
desenvolvimento e automatizar tarefas rotineiras. Você pode usar essas mesmas bibliotecas para
criar comandos para sua aplicação e plugins.

Criando um Comando
==================

Vamos criar nosso primeiro Comando. Para este exemplo, criaremos um
comando simples "Olá, mundo". No diretório **src/Command** do seu aplicativo, crie
**HelloCommand.php**. Insira o seguinte código dentro dele::

    <?php
    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;

    class HelloCommand extends Command
    {
        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $io->out('Olá, mundo.');

            return static::CODE_SUCCESS;
        }
    }

As classes de comando devem implementar um método ``execute()`` que realiza a maior parte
do seu trabalho. Este método é chamado quando um comando é invocado. Vamos chamar nosso primeiro
diretório de aplicativo de comando, execute:

.. code-block:: console

    bin/cake hello

Você deverá ver a seguinte saída::

    Olá, mundo.

Nosso método ``execute()`` não é muito interessante, vamos ler algumas entradas da
linha de comando::

    <?php
    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class HelloCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser->addArgument('name', [
                'help' => 'What is your name',
            ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $name = $args->getArgument('name');
            $io->out("Hello {$name}.");

            return static::CODE_SUCCESS;
        }
    }


Depois de salvar este arquivo, você poderá executar o seguinte comando:

.. code-block:: console

    bin/cake hello jillian

    # Outputs
    Hello jillian

Alterando o Nome do Comando Padrão
==================================

O CakePHP usará convenções para gerar o nome que seus comandos usarão na
linha de comando. Se você quiser sobrescrever o nome gerado, implemente o método
``defaultName()`` no seu comando::

    public static function defaultName(): string
    {
        return 'oh_hi';
    }

O comando acima tornaria nosso ``HelloCommand`` acessível por ``cake oh_hi`` em vez de ``cake hello``.

Definindo Argumentos e Opções
=============================

Como vimos no último exemplo, podemos usar o método de gancho ``buildOptionParser()``
para definir argumentos. Também podemos definir opções. Por exemplo, poderíamos
adicionar uma opção ``yell`` ao nosso ``HelloCommand``::

    // ...
    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser
            ->addArgument('name', [
                'help' => 'What is your name',
            ])
            ->addOption('yell', [
                'help' => 'Shout the name',
                'boolean' => true,
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if ($args->getOption('yell')) {
            $name = mb_strtoupper($name);
        }
        $io->out("Hello {$name}.");

        return static::CODE_SUCCESS;
    }

Veja a seção :doc:`/console-commands/option-parsers` para mais informações.

Criando saída
=============

Os comandos recebem uma instância ``ConsoleIo`` quando executados. Este objeto permite
que você interaja com ``stdout``, ``stderr`` e crie arquivos. Consulte a seção
:doc:`/console-commands/input-output` para obter mais informações.

Usando Modelos em Comandos
==========================

Frequentemente, você precisará acessar a lógica de negócios do seu aplicativo em comandos
de console. Você pode carregar modelos em comandos, assim como faria em um controller
usando ``$this->fetchTable()``, já que o comando usa o ``LocatorAwareTrait``::

    <?php
    declare(strict_types=1);

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        // Defina a tabela padrão. Isso permite que você use `fetchTable()` sem nenhum argumento.
        protected $defaultTable = 'Users';

        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->addArgument('name', [
                    'help' => 'Qual o seu nome'
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $name = $args->getArgument('name');
            $user = $this->fetchTable()->findByUsername($name)->first();

            $io->out(print_r($user, true));

            return static::CODE_SUCCESS;
        }
    }

O comando acima buscará um usuário pelo nome de usuário e exibirá as informações
armazenadas no banco de dados.

Códigos de Saída e Interrupção da Execução
==========================================

Quando seus comandos apresentam um erro irrecuperável, você pode usar o método ``abort()``
para encerrar a execução::

    // ...
    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Interrompa a execução, envie para stderr e defina o código de saída como 1
            $io->error('O nome deve ter pelo menos 4 caracteres.');
            $this->abort();
        }

        return static::CODE_SUCCESS;
    }

Você também pode usar ``abort()`` no objeto ``$io`` para emitir uma mensagem e código::

    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Interrompa a execução, envie para stderr e defina o código de saída como 99
            $io->abort('O nome deve ter pelo menos 4 caracteres.', 99);
        }

        return static::CODE_SUCCESS;
    }

Você pode passar qualquer código de saída desejado para ``abort()``.

.. tip::

    Evite os códigos de saída 64 a 78, pois eles têm significados específicos descritos por
    ``sysexits.h``. Evite códigos de saída acima de 127, pois eles são usados ​​para indicar
    a saída do processo por sinal, como SIGKILL ou SIGSEGV.

    Você pode ler mais sobre códigos de saída convencionais na página do manual do sysexit
    na maioria dos sistemas Unix (``man sysexits``) ou na página de ajuda ``Códigos de Erro do Sistema``
    no Windows.

Chamando Outros Comandos
========================

Você pode precisar chamar outros comandos a partir do seu comando. Você pode usar
``executeCommand`` para fazer isso::

    // Você pode passar uma série de opções e argumentos da CLI.
    $this->executeCommand(OtherCommand::class, ['--verbose', 'deploy']);

    // Pode passar uma instância do comando se ele tiver argumentos de construtor
    $command = new OtherCommand($otherArgs);
    $this->executeCommand($command, ['--verbose', 'deploy']);

.. note::

    Ao chamar ``executeCommand()`` em um loop, é recomendável passar a instância ``ConsoleIo`` 
    do comando pai como o terceiro argumento opcional para
    evitar um potencial limite de "arquivos abertos" que pode ocorrer em alguns ambientes.

Descrição do Comando de Configuração
====================================

Você pode querer definir uma descrição de comando via::

    class UserCommand extends Command
    {
        public static function getDescription(): string
        {
            return 'Minha descrição personalizada';
        }
    }

Isso mostrará sua descrição no Cake CLI:

.. code-block:: console

    bin/cake

    App:
      - user
      └─── Minha descrição personalizada

Bem como na seção de ajuda do seu comando:

.. code-block:: console

    cake user --help
    Minha descrição personalizada

    Usage:
    cake user [-h] [-q] [-v]

.. _console-integration-testing:

Comandos de Teste
=================

Para facilitar o teste de aplicações de console, o CakePHP vem com um trait
``ConsoleIntegrationTestTrait`` que pode ser usado para testar aplicações de console
e validar seus resultados.

Para começar a testar sua aplicação de console, crie um caso de teste que use o trait
``Cake\TestSuite\ConsoleIntegrationTestTrait``. Este trait contém um método
``exec()`` que é usado para executar seu comando. Você pode passar a mesma string
que usaria na CLI para este método.

Vamos começar com um comando bem simples, localizado em
**src/Command/UpdateTableCommand.php**::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser->setDescription('Meu aplicativo legal de console');

            return $parser;
        }
    }

Para escrever um teste de integração para este comando, criaríamos um caso de teste em
**tests/TestCase/Command/UpdateTableTest.php** que usa a trait
``Cake\TestSuite\ConsoleIntegrationTestTrait``. Este comando não faz muita coisa no
momento, mas vamos apenas testar se a descrição do nosso comando é exibida em ``stdout``::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('Meu aplicativo legal de console');
        }
    }

Nosso teste passou! Embora este seja um exemplo bastante trivial, ele mostra que a criação de um
caso de teste de integração para aplicativos de console pode seguir as convenções
da linha de comando. Vamos continuar adicionando mais lógica ao nosso comando::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\DateTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('Meu aplicativo legal de console')
                ->addArgument('table', [
                    'help' => 'Tabela para atualizar',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            $this->fetchTable($table)->updateQuery()
                ->set([
                    'modified' => new DateTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

Este é um comando mais completo que possui as opções necessárias e a lógica relevante.
Modifique seu caso de teste para o seguinte trecho de código::

    namespace Cake\Test\TestCase\Command;

    use Cake\Command\Command;
    use Cake\I18n\DateTime;
    use Cake\TestSuite\ConsoleIntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class UpdateTableCommandTest extends TestCase
    {
        use ConsoleIntegrationTestTrait;

        protected $fixtures = [
            // assume que você tem um UsersFixture
            'app.Users',
        ];

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('Meu aplicativo legal de console');
        }

        public function testUpdateModified()
        {
            $now = new DateTime('2017-01-01 00:00:00');
            DateTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Command::CODE_SUCCESS);

            $user = $this->getTableLocator()->get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            DateTime::setTestNow(null);
        }
    }

Como você pode ver no método ``testUpdateModified``, estamos testando se nosso
comando atualiza a tabela que estamos passando como primeiro argumento. Primeiro,
afirmamos que o comando saiu com o código de status correto, ``0``. Em seguida, verificamos
se nosso comando fez seu trabalho, ou seja, atualizou a tabela que fornecemos e definiu
a coluna ``modified`` para a hora atual.

Lembre-se de que ``exec()`` receberá a mesma string que você digitar na sua CLI, para que você
possa incluir opções e argumentos na sua string de comando.

Testando Comandos Interativos
-----------------------------

Consoles costumam ser interativos. Testar comandos interativos com a característica 
``Cake\TestSuite\ConsoleIntegrationTestTrait`` requer apenas a passagem das
entradas esperadas como o segundo parâmetro de ``exec()``. Elas devem ser
incluídas como um array na ordem em que você as espera.

Continuando com nosso comando de exemplo, vamos adicionar uma confirmação interativa.
Atualize a classe de comando para o seguinte::

    namespace App\Command;

    use Cake\Command\Command;
    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\I18n\DateTime;

    class UpdateTableCommand extends Command
    {
        protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
        {
            $parser
                ->setDescription('Meu aplicativo legal de console')
                ->addArgument('table', [
                    'help' => 'Tabela para atualizar',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io): int
        {
            $table = $args->getArgument('table');
            if ($io->ask('Tem certeza?', 'n', ['y', 'n']) !== 'y') {
                $io->error('Você precisa ter certeza.');
                $this->abort();
            }
            $this->fetchTable($table)->updateQuery()
                ->set([
                    'modified' => new DateTime()
                ])
                ->execute();

            return static::CODE_SUCCESS;
        }
    }

Agora que temos um comando interativo, podemos adicionar um caso de teste que testa
se recebemos a resposta correta e outro que testa se recebemos uma
resposta incorreta. Remova o método ``testUpdateModified`` e adicione os seguintes métodos a
**tests/TestCase/Command/UpdateTableCommandTest.php**::


    public function testUpdateModifiedSure()
    {
        $now = new DateTime('2017-01-01 00:00:00');
        DateTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['y']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        DateTime::setTestNow(null);
    }

    public function testUpdateModifiedUnsure()
    {
        $user = $this->getTableLocator()->get('Users')->get(1);
        $original = $user->modified->timestamp;

        $this->exec('my_console best_framework', ['n']);
        $this->assertExitCode(Command::CODE_ERROR);
        $this->assertErrorContains('You need to be sure.');

        $user = $this->getTableLocator()->get('Users')->get(1);
        $this->assertSame($original, $user->timestamp);
    }

No primeiro caso de teste, confirmamos a pergunta e os registros são atualizados. No
segundo teste, não confirmamos e os registros não são atualizados, e podemos verificar se
nossa mensagem de erro foi escrita em ``stderr``.

Métodos de Asserção
-------------------

O atributo ``Cake\TestSuite\ConsoleIntegrationTestTrait`` fornece uma série de
métodos de asserção que ajudam a fazer a asserção na saída do console::

    // afirmar que o comando saiu como sucesso
    $this->assertExitSuccess();

    // afirmar que o comando saiu como um erro
    $this->assertExitError();

    // afirmar que o comando saiu com o código esperado
    $this->assertExitCode($expected);

    // afirmar que stdout contém uma string
    $this->assertOutputContains($expected);

    // afirmar que stderr contém uma string
    $this->assertErrorContains($expected);

    // afirmar que stdout corresponde a uma expressão regular
    $this->assertOutputRegExp($expected);

    // afirmar que stderr corresponde a uma expressão regular
    $this->assertErrorRegExp($expected);

Debug Helpers
-------------

Você pode usar ``debugOutput()`` para gerar o código de saída, stdout e stderr do
último comando executado::

    $this->exec('update_table Users');
    $this->assertExitCode(Command::CODE_SUCCESS);
    $this->debugOutput();

.. versionadded:: 4.2.0
   O método ``debugOutput()`` foi adicionado.


Retornos de Ciclo de Vida
=========================

Assim como os Controllers, os Comandos oferecem eventos de ciclo de vida que permitem observar
o framework chamando o código da sua aplicação. Os Comandos possuem:

- ``Command.beforeExecute`` É chamado antes do método ``execute()`` de um comando.
    O evento recebe o parâmetro ``ConsoleArguments`` como ``args``. Este
    evento não pode ser interrompido ou ter seu resultado substituído.
- ``Command.afterExecute`` É chamado após o método ``execute()`` de um comando ser
    concluído. O evento contém ``ConsoleArguments`` como ``args`` e o resultado
    do comando como ``result``. Este evento não pode ser interrompido ou ter seu resultado
    substituído.
