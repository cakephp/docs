Console e Shells
################

.. php:namespace:: Cake\Console

O CakePHP não oferece um framework apenas para desenvolvimento web,
mas também um framework para criação de aplicações de console. Estas
aplicações são ideais para manipular variadas tarefas em segundo plano como
manutenção e complementação de trabalho fora do ciclo requisição-resposta.
As aplicações de console do CakePHP permitem a vocë reutilizar suas classes
de aplicação a partir da linha de comando.

O CakePHP traz consigo algumas aplicações de console nativas. Algumas dessas
aplicações são utilizadas em conjunto com outros recursos do CakePHP (como i18n),
e outros de uso geral para aceleração de trabalho.

O Console do CakePHP
====================

Esta seção provê uma introdução à linha de comando do CakePHP.
Ferramentas de console são ideais para uso em cron jobs, ou utilitários
baseados em linha de comando que não precisam ser acessíveis por um navegador web.

O PHP provê um cliente CLI que faz interface com o seu
sistema de arquivos e aplicações de forma muito mais suave. O console do CakePHP
provê um framework para criar scripts shell. O console utiliza uma configuração
tipo dispatcher para carregar uma shell ou tarefa, e prover seus parâmetros.

.. note::

    Uma linha de comando (CLI) constutuída a partir do PHP deve estar
    disponível no sistema se você planeja utilizr o Console.

Antes de entrar em detalhes, vamos ter certeza de que você pode executar o console do CakePHP.
Primeiro, você vai precisar executar um sistema shell. Os exemplos apresentados nesta
seção serão em bash, mas o Console do CakePHP é compatível com o Windows também.
Este exemplo assume que o usuário está conectado em um prompt do bash e está
atualmente na raiz de uma aplicação CakePHP.

Aplicações CakePHP possuem um diretório `Console``` que contém todas as
shells e tarefas para uma aplicação. Ele também vem com um executável::

    $ cd /path/to/app
    $ bin/cake

Executar o Console sem argumentos produz esta mensagem de ajuda::

    Welcome to CakePHP v3.0.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

     -app: src
     -root: /Users/markstory/Sites/cakephp-app
     -core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Changing Paths:

    Your working path should be the same as your application path. To change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp

    Available Shells:

    [CORE] bake, i18n, server, test

    [app] behavior_time, console, orm

    To run an app or core command, type cake shell_name [args]
    To run a plugin command, type cake Plugin.shell_name [args]
    To get help on a specific command, type cake shell_name --help

A primeira informação impressa refere-se a caminhos. Isso é útil se você estiver
executando o console a partir de diferentes partes do sistema de arquivos.

Criando uma Shell
=================

Vamos criar uma shell para utilizar no Console. Para este exemplo,
criaremos uma simples Hello World (Olá Mundo) shell. No diretório
``Shell`` de sua aplicação crie ``HelloShell.php``. Coloque o seguinte
código dentro do arquivo recem criado::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell {
        public function main() {
            $this->out('Hello world.');
        }
    }

As convenções para as classes de shell são de que o nome da classe deve corresponder
ao nome do arquivo, com o sufixo de Shell. No nosso shell criamos um método ``main()``.
Este método é chamado quando um shell é chamado sem comandos adicionais. Vamos adicionar
alguns comandos daqui a pouco, mas por agora vamos executar a nossa shell. A partir do diretório
da aplicação, execute::

    bin/cake hello

Você deve ver a seguinte saída::

    Welcome to CakePHP Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/src/
    ---------------------------------------------------------------
    Hello world.

Como mencionado antes, o método ``main()`` em shells é um método especial chamado
sempre que não há outros comandos ou argumentos dados para uma shell. Por nosso
método principal não ser muito interessante, vamos adicionar outro comando que faz algo::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell {
        public function main() {
            $this->out('Hello world.');
        }

        public function heyThere($name = 'Anonymous') {
            $this->out('Hey there ' . $name);
        }
    }

Depois de salvar o arquivo, você deve ser capaz de executar o seguinte comando e
ver o seu nome impresso::

    bin/cake hello hey_there your-name

Qualquer método público não prefixado por um ``_`` é permitido para ser chamado a partir da
linha de comando. Como você pode ver, os métodos invocados a partir da linha de comando são
transformados do argumento prefixado para a forma correta do nome camel-cased (camelizada)
na classe.

No nosso método ``heyThere()`` podemos ver que os argumentos posicionais são providos para nossa
função ``heyThere()``. Argumentos posicionais também estão disponívels na propriedade ``args``.
Você pode acessar switches ou opções em aplicações shell, estando disponíveis em ``$this->params``,
mas nós iremos cobrir isso daqui a pouco.

Quando utilizando um método ``main()`` você não estará liberado para utilizar
argumentos posicionais. Isso se deve ao primeiro argumento posicional ou opção ser
interpretado(a) como o nome do comando. Se você quer utilizar argumentos, você
deve usar métodos diferentes de ``main()``.

Usando Models em suas shells
----------------------------

Você frequentemente precisará acessar a camada lógica de negócios em seus
utilitários shell; O CakePHP faz essa tarefa super fácil. Você pode carregar models em
shells assim como faz em um controller utilizando ``loadModel()``. Os models carregados
são definidos como propriedades anexas à sua shell::

    namespace App\Shell;

    use Cake\Console\Shell;

    class UserShell extends Shell {

        public function initialize() {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function show() {
            if (empty($this->args[0])) {
                return $this->error('Por favor, indique um nome de usuário.');
            }
            $user = $this->Users->findByUsername($this->args[0]);
            $this->out(print_r($user, true));
        }
    }

A shell acima, irá preencher um user pelo seu username e exibir a informação
armazenada no banco de dados.

Tasks de Shell
================

Haverão momentos construindo aplicações mais avançadas de console que você vai
querer compor funcionalidades em classes reutilizáveis que podem ser compartilhadas
através de muitas shells. Tasks permitem que você extraia comandos em classes. Por exemplo,
o ``bake`` é feito quase que completamente de tasks. Você define tasks para uma shell usando
a propriedade ``$tasks``::

    class UserShell extends Shell {
        public $tasks = ['Template'];
    }

Você pode utilizar tasks de plugins utilizando o padrão :term:`plugin syntax`.
Tasks são armazenadas sob ``Shell/Task/`` em arquivos nomeados depois de suas classes.
Então se nós estivéssemos criando uma nova task 'FileGenerator', você deveria criar
``src/Shell/Task/FileGeneratorTask.php``.

Cada task deve ao menos implementar um método ``main()``. O ShellDispatcher,
vai chamar esse método quando a task é invocada. Uma classe task se parece com::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class FileGeneratorTask extends Shell {
        public function main() {

        }
    }

Uma shell também pode prover acesso a suas tasks como propriedades, que fazem tasks
serem ótimas para criar punhados de funcionalidade reutilizáveis similares a :doc:`/controllers/components`::

    // Localizado em src/Shell/SeaShell.php
    class SeaShell extends Shell {
        // Localizado em src/Shell/Task/SoundTask.php
        public $tasks = ['Sound'];

        public function main() {
            $this->Sound->main();
        }
    }

Você também pode acessar tasks diretamente da linha de comando::

    $ cake sea sound

.. note::

    Para acessar tasks diretamente através da linha de comando, a task
    **deve** ser incluída na propriedade da classe shell ``$tasks``.
    Portanto, esteja ciente que um método chamado "sound" na classe SeaShell
    deve sobrescrever a habilidade de acessar a funcionalidade na task
    Sound, especificada no array $tasks.

Carregando Tasks em tempo-real com TaskRegistry
-----------------------------------------------

Você pode carregar arquivos em tempo-real utilizando o Task registry object. Você pode
carregar tasks que não foram declaradas no $tasks dessa forma::

    $project = $this->Tasks->load('Project');

Carregará e retornará uma instância ProjectTask. Você pode carregar tasks de plugins usando::

    $progressBar = $this->Tasks->load('ProgressBar.ProgressBar');

.. _invoking-other-shells-from-your-shell:

Invocando outras Shells a partir da sua Shell
=============================================

.. php:method:: dispatchShell($args)

Existem ainda muitos casos onde você vai querer invocar uma shell a partir de outra.
``Shell::dispatchShell()`` lhe dá a habilidade de chamar outras shells ao providenciar o
``argv`` para a sub shell. Você pode providenciar argumentos e opções tanto como variáveis ou
como strings::

    // Como uma string
    $this->dispatchShell('schema create Blog --plugin Blog');

    // Como um array
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

O conteúdo acima mostra como você pode chamar a shell schema para criar o schema
de um plugin de dentro da shell do próprio.

Recenendo Input de usuários
===========================

.. php:method:: in($question, $choices = null, $defaut = null)

Quando construir aplicações interativas pelo console você irá precisar receber
inputs dos usuários. CakePHP oferece uma forma fácil de fazer isso::

    // Receber qualquer texto dos usuários.
    $color = $this->in('What color do you like?');

    // Receber uma escolha dos usuários.
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

A validação de seleção é insensitiva a maiúsculas / minúsculas.

Criando Arquivos
================

.. php:method:: createFile($path, $contents)

Muitas aplicações Shell auxiliam tarefas de desenvolvimento e implementação. Criar
arquivos é frequentemente importante nestes casos de uso. O CakePHP oferece uma forma
fácil de criar um arquivo em um determinado diretório::

    $this->createFile('bower.json', $stuff);

Se a Shell for interativa, um alerta vai ser gerado, e o usuário questionado se
ele quer sobreescrever o arquivo caso já exista. Se a propriedade de interação da shell
for ``false``, nenhuma questão será disparada e o arquivo será simplesmente sobreescrito.

Saída de dados do Console
=========================

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

A classe ``Shell`` oferece alguns métodos para direcionar conteúdo::

    // Escreve para stdout
    $this->out('Normal message');

    // Escreve para stderr
    $this->err('Error message');

    // Escreve para stderr e para o processo
    $this->error('Fatal error');

A Shell também inclui métodos para limpar a saída de dados, criando linhas
em branco, ou desenhando uma linha de traços::

    // Exibe 2 linhas novas
    $this->out($this->nl(2));

    // Limpa a tela do usuário
    $this->clear();

    // Desenha uma linha horizontal
    $this->hr();

Por último, você pode atualizar a linha atual de texto na tela usando
``_io->overwrite()``::

    $this->out('Counting down');
    $this->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $this->_io->overwrite($i, 0, 2);
    }

É importante lembrar, que você não pode sobreescrever texto
uma vez que uma nova linha tenha sido exibida.

.. _shell-output-level:

Console Output Levels
---------------------

Shells frequentemente precisam de diferentes níveis de verbosidade. Quando executadas
como cron jobs, muitas saídas são desnecessárias. E há ocasiões que você não estará
interessado em tudo que uma shell tenha a dizer. Você pode usar os níveis de saída
para sinalizar saídas apropriadamente. O usuário da shell, pode então decidir qual
nível de detalhe ele está interessado ao sinalizar o chamado da shell.
:php:meth:`Cake\\Console\\Shell::out()` suporta 3 tipos de saída por padrão.

* QUIET - Apenas informação absolutamente importante deve ser sinalizada.
* NORMAL - O nível padrão, e uso normal.
* VERBOSE - Sinalize mensagens que podem ser irritantes em demasia para uso diário, mas informativas
  para depuração como VERBOSE.

Você pode sinalizar a saíde da seguinte forma::

    // Deve aparecer em todos os níveis.
    $this->out('Quiet message', 1, Shell::QUIET);
    $this->quiet('Quiet message');

    // Não deve aparecer quando a saída quiet estiver alternado.
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

    // Deve aparecer somente quando a saíde verbose estiver habilitada.
    $this->out('extra message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

Você pode controlar o nível de saída das shells, ao usar as opções ``--quiet`` e ``--verbose``.
Estas opções são adicionadas por padrão, e permitem a você controlar consistentemente
níveis de saída dentro das suas shells do CakePHP.

Estilizando a saída de dados
----------------------------

Estilizar a saída de dados é feito ao incluir tags - como no HTML - em sua saída.
O ConsoleOutput irá substituir estas tags com a seqüência correta de código ansi.
Hão diversos estilos nativos, e você pode criar mais. Os nativos são:

* ``error`` Mensagens de erro. Texto sublinhado vermelho.
* ``warning`` Mensagens de alerta. Texto amarelo.
* ``info`` Mensagens informativas. Texto ciano.
* ``comment`` Texto adicional. Texto azul.
* ``question`` Texto que é uma questão, adicionado automaticamente pela shell.

Você pode criar estilos adicionais usando ``$this->stdout->styles()``. Para declarar
um novo estilo de saíde você pode fazer::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

Isso deve então permití-lo usar uma ``<flashy>`` tag na saída de sua shell, e se
as cores ansi estiverem habilitadas, o seguinte pode ser renderizado como texto
magenta piscante ``$this->out('<flashy>Whoooa</flashy> Something went wrong');``.
Quando definir estilos você pode usar as seguintes cores para os atributos
``text`` e ``background``:

* black
* red
* green
* yellow
* blue
* magenta
* cyan
* white

Você também pode usar as seguintes opções através de valores boleanos, defini-los
com valor positivo os habilita.

* bold
* underline
* blink
* reverse

Adicionar um estilo o torna disponível para todas as instâncias do ConsoleOutput,
então você não tem que redeclarar estilos para os objetos stdout e stderr
respectivamente.

Desabilitando a colorização
---------------------------

Mesmo que a colorização seja incrível, haverão ocasiões que você quererá desabilitá-la,
ou forçá-la::

    $this->_io->outputAs(ConsoleOutput::RAW);

O citado irá colocar o objeto de saída em modo raw. Em modo raw,
nenhum estilo é aplicado. Existem três modos que você pode usar.

* ``ConsoleOutput::RAW`` - Saída raw, nenhum estilo ou formatação serão aplicados.
  Este é um modo indicado se você estiver exibindo XML ou, quiser depurar porquê
  seu estilo não está funcionando.
* ``ConsoleOutput::PLAIN`` - Saída de texto simples, tags conhecidas de estilo
  serão removidas da saída.
* ``ConsoleOutput::COLOR`` - Saída onde a cor é removida.

Por padrão em sistemas \*nix objetos ConsoleOutput padronizam-se a a saída de cores.
Em sistemas Windows, a saída simples é padrão a não ser que a variável de ambiente
``ANSICON`` esteja presente.

Opções de configuração e Geração de ajuda
=========================================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` oferece uma opção de CLI e analisador de argumentos.

OptionParsers permitem a você completar dois objetivos ao mesmo tempo. Primeiro,
eles permitem definir opções e argumentos para os seus comandos. Isso permite
separar validação básica de dados e seus comandos do console. Segundo,
permite prover documentação, que é usada para gerar arquivos de ajuda bem
formatados.

O console framework no CakePHP recebe as opções do seu interpetador shell ao
chamar ``$this->getOptionParser()``. Sobreescrever esse método permite configurar
o OptionParser para definir as entradas aguardadas da sua shell.
Você também pode configurar interpetadores de subcomandos, que permitem ter
diferentes interpretadores para subcomandos e tarefas.
O ConsoleOptionParser implementa uma interface fluida e inclui métodos para
facilmente definir múltiplas opções/argumentos de uma vez::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        // Configure parser
        return $parser;
    }

Configurando um interpretador de opção com a interface fluida
-------------------------------------------------------------

Todos os métodos que configuram um interpretador de opções podem ser
encadeados, permitindo definir um interpretador de opções completo em uma
série de chamadas de métodos::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', [
            'help' => 'Either a full path or type of class.'
        ])->addArgument('className', [
            'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
        ])->addOption('method', [
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ])->description(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

Os métodos que permitem encadeamento são:

- description()
- epilog()
- command()
- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()

.. php:method:: description($text = null)

Recebe ou define a descrição para o interpretador de opções. A
descrição é exibida acima da informação do argumento e da opção. Ao
instanciar tanto em array como em string, você pode definir o valor
da descrição. Instanciar sem argumentos vai retornar o valor atual::

    // Define múltiplas linhas de uma vez
    $parser->description(['line one', 'line two']);

    // Lê o valor atual
    $parser->description();

.. php:method:: epilog($text = null)

Recebe ou define o epílogo para o interpretador de opções. O epílogo
é exibido depois da informação do argumento e da opção. Ao instanciar
tanto em array como em string, você pode definir o valor do epílogo.
Instanciar sem argumentos vai retornar o valor atual::

    // Define múltiplas linhas de uma vez
    $parser->epilog(['line one', 'line two']);

    // Lê o valor atual
    $parser->epilog();

Adicionando argumentos
----------------------

.. php:method:: addArgument($name, $params = [])

Argumentos posicionais são frequentemente usados em ferramentas
de linha de comando, e ``ConsoleOptionParser`` permite definir
argumentos bem como torná-los requiríveis. Você pode adicionar
argumentos um por vez com ``$parser->addArgument();`` ou múltiplos
de uma vez com ``$parser->addArguments();``::

    $parser->addArgument('model', ['help' => 'The model to bake']);

Você pode usar as seguintes opções ao criar um argumento:

* ``help`` O texto de ajuda a ser exibido para este argumento.
* ``required`` Se esse parâmetro é requisito.
* ``index`` O índice do argumento, se deixado indefinido, o argumento será
  colocado no final dos argumentos. Se você definir o mesmo índice duas vezes,
  a primeira opção será sobreescrita.
* ``choices`` Um array de opções válidas para esse argumento. Se deixado vazio,
  todos os valores são válidos. Uma exceção será lançada quando parse() encontrar
  um valor inválido.

Argumentos que forem definidos como requisito lançarão uma exceção quando
interpretarem o comando se eles forem omitidos. Então você não tem que lidar
com isso em sua shell.

.. php:method:: addArguments(array $args)

Se você tem um array com múltiplos argumentos você pode usar ``$parser->addArguments()``
para adicioná-los de uma vez.::

    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true]
    ]);

Assim como todos os métodos de construção no ConsoleOptionParser, addArguments
pode ser usado como parte de um fluido método encadeado.

Validando argumentos
--------------------

Ao criar argumentos posicionais, você pode usar a marcação ``required`` para
indicar que um argumento deve estar presente quando uma shell é chamada.
Adicionalmente você pode usar o ``choices`` para forçar um argumento a
ser de uma lista de escolhas válidas::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

O código acima irá criar um argumento que é requisitado e tem validação
no input. Se o argumento está tanto indefinodo, ou possui um valor
incorreto, uma exceção será lançada e a shell parará.

Adicionando opções
------------------

.. php:method:: addOption($name, $options = [])

Opções são frequentemente usadas em ferramentas CLI.
``ConsoleOptionParser`` suporta a criação de opções com
verbose e aliases curtas, suprindo padrões e criando ativadores
boleanos. Opções são criadas tanto com
``$parser->addOption()`` ou ``$parser->addOptions()``.::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

O código citado permite a você usar tanto ``cake myshell --connection=other``,
``cake myshell --connection other``, ou ``cake myshell -c other``
quando invocando a shell. Você também criar ativadores boleanos. Estes ativadores não
consumem valores, e suas presenças apenas os habilitam nos parâmetros
interpretados.::

    $parser->addOption('no-commit', ['boolean' => true]);

Com essa opção, ao chamar uma shell como ``cake myshell --no-commit something``
o parâmetro no-commit deve ter um valor de ``true``, e `something`
deve ser tratado como um argumento posicional.
As opções nativas ``--help``, ``--verbose``, e ``--quiet``
usam essa funcionalidade.

Ao criar opções você pode usar os seguintes argumentos para definir
o seu comportamento:

* ``short`` - A variação de letra única para essa opção, deixe indefinido para none.
* ``help`` - Texto de ajuda para essa opção. Usado ao gerar ajuda para a opção.
* ``default`` - O valor padrão para essa opção. Se não estiver definido o valor padrão será ``true``.
* ``boolean`` - A opção não usa valor, é apenas um ativador boleano. Por padrão ``false``.
* ``choices`` - Um array de escolhas válidas para essa opção. Se deixado vazio, todos os
  valores são considerados válidos. Uma exceção será lançada quando parse() encontrar um valor inválido.

.. php:method:: addOptions(array $options)

Se você tem um array com múltiplas opções, você pode usar ``$parser->addOptions()``
para adicioná-las de uma vez.::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

Assim como com todos os métodos construtores, no ConsoleOptionParser, addOptions
pode ser usado como parte de um método fluente encadeado.

Validating Options
------------------

Options can be provided with a set of choices much like positional arguments
can be. When an option has defined choices, those are the only valid choices
for an option. All other values will raise an ``InvalidArgumentException``::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine']
    ]);

Using Boolean Options
---------------------

Options can be defined as boolean options, which are useful when you need to create
some flag options. Like options with defaults, boolean options always include
themselves into the parsed parameters. When the flags are present they are set
to ``true``, when they are absent they are set ot ``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

The following option would result in ``$this->params['verbose']`` always
being available. This lets you omit ``empty()`` or ``isset()``
checks for boolean flags::

    if ($this->params['verbose']) {
        // Do something.
    }

Since the boolean options are always defined as ``true`` or
``false`` you can omit additional check methods.

Adding Subcommands
------------------

.. php:method:: addSubcommand($name, $options = [])

Console applications are often made of subcommands, and these subcommands
may require special option parsing and have their own help. A perfect
example of this is ``bake``. Bake is made of many separate tasks that all
have their own help and options. ``ConsoleOptionParser`` allows you to
define subcommands and provide command specific option parsers so the
shell knows how to parse commands for its tasks::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

The above is an example of how you could provide help and a specialized
option parser for a shell's task. By calling the Task's ``getOptionParser()``
we don't have to duplicate the option parser generation, or mix concerns
in our shell. Adding subcommands in this way has two advantages.
First it lets your shell easily document its subcommands in the
generated help. It also gives easy access to the subcommand
help. With the above subcommand created you could call
``cake myshell --help`` and see the list of subcommands, and
also run ``cake myshell model --help`` to view the help for
just the model task.

.. note::

    Once your Shell defines subcommands, all subcommands must be explicitly
    defined.

When defining a subcommand you can use the following options:

* ``help`` - Help text for the subcommand.
* ``parser`` - A ConsoleOptionParser for the subcommand. This allows you
  to create method specific option parsers. When help is generated for a
  subcommand, if a parser is present it will be used. You can also
  supply the parser as an array that is compatible with
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()`

Adding subcommands can be done as part of a fluent method chain.

Building a ConsoleOptionParser from an Array
--------------------------------------------

.. php:method:: buildFromArray($spec)

As previously mentioned, when creating subcommand option parsers,
you can define the parser spec as an array for that method. This can help
make building subcommand parsers easier, as everything is an array::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]
    ]);

Inside the parser spec, you can define keys for ``arguments``, ``options``,
``description`` and ``epilog``. You cannot define ``subcommands`` inside an
array style builder. The values for arguments, and options, should follow the
format that :php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` and
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` use. You can also use
buildFromArray on its own, to build an option parser::

    public function getOptionParser() {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]);
    }

Getting Help from Shells
------------------------

With the addition of ConsoleOptionParser getting help from shells is done
in a consistent and uniform way. By using the ``--help`` or -``h`` option you
can view the help for any core shell, and any shell that implements a ConsoleOptionParser::

    cake bake --help
    cake bake -h

Would both generate the help for bake. If the shell supports subcommands
you can get help for those in a similar fashion::

    cake bake model --help
    cake bake model -h

This would get you the help specific to bake's model task.

Getting Help as XML
-------------------

When building automated tools or development tools that need to interact
with CakePHP shells, its nice to have help available in a machine parse-able
format. The ConsoleOptionParser can provide help in xml by setting an
additional argument::

    cake bake --help xml
    cake bake -h xml

The above would return an XML document with the generated help, options,
arguments and subcommands for the selected shell. A sample XML document
would look like:

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <subcommands/>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

Routing in Shells / CLI
=======================

In command-line interface (CLI), specifically your shells and tasks, ``env('HTTP_HOST')`` and
other webbrowser specific environment variables are not set.

If you generate reports or send emails that make use of ``Router::url()`` those will contain
the default host ``http://localhost/``  and thus resulting in invalid URLs. In this case you need to
specify the domain manually.
You can do that using the Configure value ``App.fullBaseURL`` from your bootstrap or config, for example.

For sending emails, you should provide CakeEmail class with the host you want to send the email with::

    $Email = new CakeEmail();
    $Email->domain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the emails are sent from.

Hook Methods
============

.. php:method:: initialize()

    Initializes the Shell acts as constructor for subclasses allows
    configuration of tasks prior to shell execution.

.. php:method:: startup()

    Starts up the Shell and displays the welcome message. Allows for checking
    and configuring prior to command or main execution.

    Override this method if you want to remove the welcome information, or
    otherwise modify the pre-command flow.

More Topics
===========

.. toctree::
:maxdepth: 1

        console-and-shells/code-generation-with-bake
        console-and-shells/repl
        console-and-shells/cron-jobs
        console-and-shells/i18n-shell
        console-and-shells/completion-shell
        console-and-shells/upgrade-shell

.. meta::
    :title lang=en: Console and Shells
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
