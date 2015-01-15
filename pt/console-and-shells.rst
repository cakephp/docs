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

A validação de seleção é case-insensitive.

Criando Arquivos
================

.. php:method:: createFile($path, $contents)

Many Shell applications help automate development or deployment tasks. Creating
files is often important in these use cases. CakePHP provides an easy way to
create a file at a given path::

    $this->createFile('bower.json', $stuff);

If the Shell is interactive, a warning will be generated, and the user asked if
they want to overwrite the file if it already exists.  If the shell's
interactive property is ``false``, no question will be asked and the file will
simply be overwritten.

Console Output
==============

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

The ``Shell`` class provides a few methods for outputting content::

    // Write to stdout
    $this->out('normal message');

    // Write to stderr
    $this->err('error message');

    // Write to stderr and stop the process
    $this->error('Fatal error');

Shell also includes methods for clearing output, creating blank lines, or
drawing a line of dashes::

    // Output 2 newlines
    $this->out($this->nl(2));

    // Clear the user's screen
    $this->clear();

    // Draw a horizontal line
    $this->hr();

Lastly, you can update the current line of text on the screen using
``_io->overwrite()``::

    $this->out('Counting down');
    $this->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $this->_io->overwrite($i, 0, 2);
    }

It is important to remember, that you cannot overwrite text
once a new line has been output.

.. _shell-output-level:

Console Output Levels
---------------------

Shells often need different levels of verbosity. When running as cron jobs,
most output is un-necessary. And there are times when you are not interested in
everything that a shell has to say. You can use output levels to flag output
appropriately. The user of the shell, can then decide what level of detail
they are interested in by setting the correct flag when calling the shell.
:php:meth:`Cake\\Console\\Shell::out()` supports 3 types of output by default.

* QUIET - Only absolutely important information should be marked for quiet output.
* NORMAL - The default level, and normal usage
* VERBOSE - Mark messages that may be too noisy for everyday use, but helpful
  for debugging as VERBOSE

You can mark output as follows::

    // Would appear at all levels.
    $this->out('Quiet message', 1, Shell::QUIET);
    $this->quiet('Quiet message');

    // Would not appear when quiet output is toggled.
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

    // Would only appear when verbose output is enabled.
    $this->out('extra message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

You can control the output level of shells, by using the ``--quiet`` and ``--verbose``
options. These options are added by default, and allow you to consistently control
output levels inside your CakePHP shells.

Styling Output
--------------

Styling output is done by including tags - just like HTML - in your output.
ConsoleOutput will replace these tags with the correct ansi code sequence, or
remove the tags if you are on a console that doesn't support ansi codes. There
are several built-in styles, and you can create more. The built-in ones are

* ``error`` Error messages. Red underlined text.
* ``warning`` Warning messages. Yellow text.
* ``info`` Informational messages. Cyan text.
* ``comment`` Additional text. Blue text.
* ``question`` Text that is a question, added automatically by shell.

You can create additional styles using ``$this->stdout->styles()``. To declare a
new output style you could do::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

This would then allow you to use a ``<flashy>`` tag in your shell output, and if ansi
colours are enabled, the following would be rendered as blinking magenta text
``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. When defining
styles you can use the following colours for the ``text`` and ``background`` attributes:

* black
* red
* green
* yellow
* blue
* magenta
* cyan
* white

You can also use the following options as boolean switches, setting them to a
truthy value enables them.

* bold
* underline
* blink
* reverse

Adding a style makes it available on all instances of ConsoleOutput as well,
so you don't have to redeclare styles for both stdout and stderr objects.

Turning Off Colouring
---------------------

Although colouring is pretty awesome, there may be times when you want to turn it off,
or force it on::

    $this->_io->outputAs(ConsoleOutput::RAW);

The above will put the output object into raw output mode. In raw output mode,
no styling is done at all. There are three modes you can use.

* ``ConsoleOutput::RAW`` - Raw output, no styling or formatting will be done.
  This is a good mode to use if you are outputting XML or, want to debug why
  your styling isn't working.
* ``ConsoleOutput::PLAIN`` - Plain text output, known style tags will be stripped
  from the output.
* ``ConsoleOutput::COLOR`` - Output with color escape codes in place.

By default on \*nix systems ConsoleOutput objects default to colour output.
On windows systems, plain output is the default unless the ``ANSICON`` environment
variable is present.

Configuring Options and Generating Help
=======================================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` provides a command line option and
argument parser.

OptionParsers allow you to accomplish two goals at the same time.  First, they
allow you to define the options and arguments for your commands.  This allows
you to separate basic input validation and your console commands. Secondly, it
allows you to provide documentation, that is used to generate a well formatted
help file.

The console framework in CakePHP gets your shell's option parser by calling
``$this->getOptionParser()``. Overriding this method allows you to
configure the OptionParser to define the expected inputs of your shell.
You can also configure subcommand option parsers, which allow you to
have different option parsers for subcommands and tasks.
The ConsoleOptionParser implements a fluent interface and includes
methods for easily setting multiple options/arguments at once::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        // Configure parser
        return $parser;
    }

Configuring an Option Parser with the Fluent Interface
------------------------------------------------------

All of the methods that configure an option parser can be chained,
allowing you to define an entire option parser in one series of method calls::

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

The methods that allow chaining are:

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

Gets or sets the description for the option parser. The description
displays above the argument and option information. By passing in
either an array or a string, you can set the value of the description.
Calling with no arguments will return the current value::

    // Set multiple lines at once
    $parser->description(['line one', 'line two']);

    // Read the current value
    $parser->description();

.. php:method:: epilog($text = null)

Gets or sets the epilog for the option parser. The epilog
is displayed after the argument and option information. By passing in
either an array or a string, you can set the value of the epilog.
Calling with no arguments will return the current value::

    // Set multiple lines at once
    $parser->epilog(['line one', 'line two']);

    // Read the current value
    $parser->epilog();

Adding Arguments
----------------

.. php:method:: addArgument($name, $params = [])

Positional arguments are frequently used in command line tools,
and ``ConsoleOptionParser`` allows you to define positional
arguments as well as make them required. You can add arguments
one at a time with ``$parser->addArgument();`` or multiple at once
with ``$parser->addArguments();``::

    $parser->addArgument('model', ['help' => 'The model to bake']);

You can use the following options when creating an argument:

* ``help`` The help text to display for this argument.
* ``required`` Whether this parameter is required.
* ``index`` The index for the arg, if left undefined the argument will be put
  onto the end of the arguments. If you define the same index twice the
  first option will be overwritten.
* ``choices`` An array of valid choices for this argument. If left empty all
  values are valid. An exception will be raised when parse() encounters an
  invalid value.

Arguments that have been marked as required will throw an exception when
parsing the command if they have been omitted. So you don't have to
handle that in your shell.

.. php:method:: addArguments(array $args)

If you have an array with multiple arguments you can use ``$parser->addArguments()``
to add multiple arguments at once.::

    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true]
    ]);

As with all the builder methods on ConsoleOptionParser, addArguments
can be used as part of a fluent method chain.

Validating Arguments
--------------------

When creating positional arguments, you can use the ``required`` flag, to
indicate that an argument must be present when a shell is called.
Additionally you can use ``choices`` to force an argument to
be from a list of valid choices::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

The above will create an argument that is required and has validation
on the input. If the argument is either missing, or has an incorrect
value an exception will be raised and the shell will be stopped.

Adding Options
--------------

.. php:method:: addOption($name, $options = [])

Options or flags are also frequently used in command line tools.
``ConsoleOptionParser`` supports creating options
with both verbose and short aliases, supplying defaults
and creating boolean switches. Options are created with either
``$parser->addOption()`` or ``$parser->addOptions()``.::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

The above would allow you to use either ``cake myshell --connection=other``,
``cake myshell --connection other``, or ``cake myshell -c other``
when invoking the shell. You can also create boolean switches, these switches do not
consume values, and their presence just enables them in the
parsed parameters.::

    $parser->addOption('no-commit', ['boolean' => true]);

With this option, when calling a shell like ``cake myshell --no-commit something``
the no-commit param would have a value of ``true``, and 'something'
would be a treated as a positional argument.
The built-in ``--help``, ``--verbose``, and ``--quiet`` options
use this feature.

When creating options you can use the following options to
define the behavior of the option:

* ``short`` - The single letter variant for this option, leave undefined for none.
* ``help`` - Help text for this option. Used when generating help for the option.
* ``default`` - The default value for this option. If not defined the default will be ``true``.
* ``boolean`` - The option uses no value, it's just a boolean switch.
  Defaults to ``false``.
* ``choices`` An array of valid choices for this option. If left empty all
  values are valid. An exception will be raised when parse() encounters an invalid value.

.. php:method:: addOptions(array $options)

If you have an array with multiple options you can use ``$parser->addOptions()``
to add multiple options at once.::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

As with all the builder methods on ConsoleOptionParser, addOptions is can be used
as part of a fluent method chain.

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
