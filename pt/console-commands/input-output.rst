Entrada/Saída de Comandos
#########################

.. php:namespace:: Cake\Console
.. php:class:: ConsoleIo

O CakePHP fornece o objeto ``ConsoleIo`` para comandos, permitindo que eles
leiam a entrada do usuário de forma interativa e exibam informações para o usuário.

.. _command-helpers:

Helpers de Comandos
===================

Os Helpers de Comandos podem ser acessados e usados a partir de qualquer comando::

    // Output some data as a table.
    $io->helper('Table')->output($data);

    // Get a helper from a plugin.
    $io->helper('Plugin.HelperName')->output($data);

Você também pode obter instâncias de helpers e chamar quaisquer métodos públicos neles::

    // Get and use the Progress Helper.
    $progress = $io->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Criando Helpers
===============

Embora o CakePHP venha com alguns helpers de comando, você pode criar mais em sua
aplicação ou plugins. Como exemplo, vamos criar um helper simples para gerar
cabeçalhos elegantes. Primeiro crie o arquivo **src/Command/Helper/HeadingHelper.php** e coloque
o seguinte nele::

    <?php
    namespace App\Command\Helper;

    use Cake\Console\Helper;

    class HeadingHelper extends Helper
    {
        public function output($args)
        {
            $args += ['', '#', 3];
            $marker = str_repeat($args[1], $args[2]);
            $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
        }
    }

Podemos então usar este novo helper em um de nossos comandos shell chamando-o::

    // With ### on either side
    $this->helper('Heading')->output(['It works!']);

    // With ~~~~ on either side
    $this->helper('Heading')->output(['It works!', '~', 4]);

Os Helpers geralmente implementam o método ``output()`` que recebe um array de
parâmetros. No entanto, como os Console Helpers são classes comuns, eles podem
implementar métodos adicionais que aceitam qualquer forma de argumentos.

.. note::
    Os Helpers também podem estar em ``src/Shell/Helper`` para compatibilidade com versões anteriores.

Helpers Integrados
==================

Helper Table
------------

O TableHelper ajuda a criar tabelas ASCII art bem formatadas. Usá-lo é
bastante simples::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $io->helper('Table')->output($data);

        // Outputs
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Você pode usar a tag de formatação ``<text-right>`` em tabelas para alinhar
o conteúdo à direita::

        $data = [
            ['Name', 'Total Price'],
            ['Cake Mix', '<text-right>1.50</text-right>'],
        ];
        $io->helper('Table')->output($data);

        // Outputs
        +----------+-------------+
        | Name 1   | Total Price |
        +----------+-------------+
        | Cake Mix |        1.50 |
        +----------+-------------+

Helper Progress
---------------

O ProgressHelper pode ser usado de duas maneiras diferentes. O modo simples permite que você
forneça um callback que é invocado até que o progresso esteja completo::

    $io->helper('Progress')->output(['callback' => function ($progress) {
        // Do work here.
        $progress->increment(20);
        $progress->draw();
    }]);

Você pode controlar a barra de progresso melhor fornecendo opções adicionais:

- ``total`` O número total de itens na barra de progresso. Padrão
  é 100.
- ``width`` A largura da barra de progresso. Padrão é 80.
- ``callback`` O callback que será chamado em um loop para avançar a
  barra de progresso.

Um exemplo de todas as opções em uso seria::

    $io->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

O helper de progresso também pode ser usado manualmente para incrementar e re-renderizar a
barra de progresso conforme necessário::

    $progress = $io->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();

Helper Banner
-------------

O ``BannerHelper`` pode ser usado para formatar uma ou mais linhas de texto em
um banner com plano de fundo e preenchimento horizontal::

    $io->helper('Banner')
        ->withPadding(5)
        ->withStyle('success.bg')
        ->output(['Work complete']);

.. versionadded:: 5.1.0
   O ``BannerHelper`` foi adicionado na versão 5.1

Obtendo Entrada do Usuário
===========================

.. php:method:: ask($question, $choices = null, $default = null)

Ao construir aplicações de console interativas, você precisará obter entrada do usuário.
O CakePHP fornece uma forma de fazer isso::

    // Get arbitrary text from the user.
    $color = $io->ask('What color do you like?');

    // Get a choice from the user.
    $selection = $io->askChoice('Red or Green?', ['R', 'G'], 'R');

A validação de seleção não diferencia maiúsculas de minúsculas.

Criando Arquivos
================

.. php:method:: createFile($path, $contents)

Criar arquivos é frequentemente uma parte importante de muitos comandos de console que ajudam
a automatizar o desenvolvimento e implantação. O método ``createFile()`` oferece uma
interface simples para criar arquivos com confirmação interativa::

    // Create a file with confirmation on overwrite
    $io->createFile('bower.json', $stuff);

    // Force overwriting without asking
    $io->createFile('bower.json', $stuff, true);

Criando Saída
=============

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

Escrever para ``stdout`` e ``stderr`` é outra operação comum no CakePHP::

    // Write to stdout
    $io->out('Normal message');

    // Write to stderr
    $io->err('Error message');

Além dos métodos de saída convencionais, o CakePHP fornece métodos wrapper que
estilizam a saída com cores ANSI apropriadas::

    // Green text on stdout
    $io->success('Success message');

    // Cyan text on stdout
    $io->info('Informational text');

    // Blue text on stdout
    $io->comment('Additional context');

    // Red text on stderr
    $io->error('Error text');

    // Yellow text on stderr
    $io->warning('Warning text');

A formatação de cores será automaticamente desabilitada se ``posix_isatty`` retornar
true, ou se a variável de ambiente ``NO_COLOR`` estiver definida.

O ``ConsoleIo`` fornece dois métodos de conveniência relacionados ao nível de saída::

    // Would only appear when verbose output is enabled (-v)
    $io->verbose('Verbose message');

    // Would appear at all levels.
    $io->quiet('Quiet message');

Você também pode criar linhas em branco ou desenhar linhas de traços::

    // Output 2 newlines
    $io->out($io->nl(2));

    // Draw a horizontal line
    $io->hr();

Por fim, você pode atualizar a linha atual de texto na tela::

    $io->out('Counting down');
    $io->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $io->overwrite($i, 0, 2);
    }

.. note::
    É importante lembrar que você não pode sobrescrever texto
    uma vez que uma nova linha tenha sido exibida.

.. _shell-output-level:

Níveis de Saída
===============

As aplicações de console frequentemente precisam de diferentes níveis de verbosidade. Por exemplo, quando
executado como um cron job, a maior parte da saída é desnecessária. Você pode usar níveis de saída para
marcar a saída adequadamente. O usuário do shell pode então decidir qual nível de
detalhe lhe interessa configurando a flag correta ao chamar o
comando. Existem 3 níveis:

* ``QUIET`` - Apenas informações absolutamente importantes devem ser marcadas para saída
  silenciosa.
* ``NORMAL`` - O nível padrão e uso normal.
* ``VERBOSE`` - Marque mensagens que podem ser muito ruidosas para uso diário, mas
  úteis para depuração como ``VERBOSE``.

Você pode marcar a saída da seguinte forma::

    // Would appear at all levels.
    $io->out('Quiet message', 1, ConsoleIo::QUIET);
    $io->quiet('Quiet message');

    // Would not appear when quiet output is toggled.
    $io->out('normal message', 1, ConsoleIo::NORMAL);
    $io->out('loud message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

    // Would only appear when verbose output is enabled.
    $io->out('extra message', 1, ConsoleIo::VERBOSE);
    $io->verbose('Verbose output');

Você pode controlar o nível de saída dos comandos usando as opções ``--quiet`` e
``--verbose``. Essas opções são adicionadas por padrão e permitem que você
controle consistentemente os níveis de saída dentro dos seus comandos CakePHP.

As opções ``--quiet`` e ``--verbose`` também controlam como os dados de log são
exibidos em stdout/stderr. Normalmente, mensagens de log de nível info e superior são exibidas em
stdout/stderr. Quando ``--verbose`` é usado, logs de depuração serão exibidos em stdout.
Quando ``--quiet`` é usado, apenas mensagens de log de warning e superior serão exibidas em
stderr.

Estilizando a Saída
===================

A estilização da saída é feita incluindo tags - assim como HTML - em sua saída.
Essas tags serão substituídas pela sequência de código ansi correta, ou
removidas se você estiver em um console que não suporta códigos ansi. Existem
vários estilos integrados, e você pode criar mais. Os integrados são

* ``success`` Mensagens de sucesso. Texto verde.
* ``error`` Mensagens de erro. Texto vermelho.
* ``warning`` Mensagens de aviso. Texto amarelo.
* ``info`` Mensagens informativas. Texto ciano.
* ``comment`` Texto adicional. Texto azul.
* ``question`` Texto que é uma pergunta, adicionado automaticamente pelo shell.
* ``info.bg`` Fundo branco com texto ciano.
* ``warning.bg`` Fundo amarelo com texto preto.
* ``error.bg`` Fundo vermelho com texto preto.
* ``success.bg`` Fundo verde com texto preto.

Você pode criar estilos adicionais usando ``$io->setStyle()``. Para declarar um
novo estilo de saída, você pode fazer::

    $io->setStyle('flashy', ['text' => 'magenta', 'blink' => true]);

Isso permitiria que você usasse uma tag ``<flashy>`` em sua saída de shell, e se
as cores ansi estiverem habilitadas, o seguinte seria renderizado como texto magenta
piscando ``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. Ao
definir estilos, você pode usar as seguintes cores para os atributos ``text`` e
``background``:

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

Você também pode usar as seguintes opções como switches booleanos, definindo-os para um
valor verdadeiro os habilita.

* blink
* bold
* reverse
* underline

Adicionar um estilo o torna disponível em todas as instâncias de ConsoleOutput também,
então você não precisa redeclarar estilos para os objetos stdout e stderr.

.. versionchanged:: 5.1.0
    Os estilos ``info.bg``, ``warning.bg``, ``error.bg`` e ``success.bg`` foram adicionados.

Desativando a Colorização
==========================

Embora a colorização seja interessante, pode haver momentos em que você queira desativá-la
ou forçar sua ativação::

    $io->outputAs(ConsoleOutput::RAW);

O exemplo acima colocará o objeto de saída no modo de saída bruta. No modo de saída bruta,
nenhuma estilização é feita. Existem três modos que você pode usar.

* ``ConsoleOutput::COLOR`` - Saída com códigos de escape de cor no lugar.
* ``ConsoleOutput::PLAIN`` - Saída de texto simples, tags de estilo conhecidas serão
  removidas da saída.
* ``ConsoleOutput::RAW`` - Saída bruta, nenhuma estilização ou formatação será feita.
  Este é um bom modo para usar se você estiver gerando XML ou quiser depurar por que
  sua estilização não está funcionando.

Por padrão, em sistemas \*nix, os objetos ConsoleOutput usam saída colorida por padrão.
Em sistemas Windows, a saída simples é o padrão, a menos que a variável de
ambiente ``ANSICON`` esteja presente.
