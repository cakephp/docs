Shells, Tasks & Console Tools
#############################

.. php:namespace:: Cake\Console

CakePHP features not only a web framework but also a console framework for
creating console applications. Console applications are ideal for handling a
variety of background tasks such as maintenance, and completing work outside of
the request-response cycle. CakePHP console applications allow you to reuse your
application classes from the command line.

CakePHP comes with a number of console applications out of the box. Some of
these applications are used in concert with other CakePHP features (like i18n),
and others are for general use to get you working faster.

The CakePHP Console
===================

This section provides an introduction into CakePHP at the command-line. Console
tools are ideal for use in cron jobs, or command line based utilities that don't
need to be accessible from a web browser.

PHP provides a CLI client that makes interfacing with your file system and
applications much smoother. The CakePHP console provides a framework for
creating shell scripts. The Console uses a dispatcher-type setup to load a shell
or task, and provide its parameters.

.. note::

    A command-line (CLI) build of PHP must be available on the system
    if you plan to use the Console.

Before we get into specifics, let's make sure you can run the CakePHP console.
First, you'll need to bring up a system shell. The examples shown in this
section will be in bash, but the CakePHP Console is Windows-compatible as well.
This example assumes that the user is currently logged into a bash prompt and is
currently at the root of a CakePHP application.

A CakePHP application contains **src/Shell** and **src/Shell/Task** directories
that contain all of its shells and tasks. It also comes with an executable in
the **bin** directory::

    $ cd /path/to/app
    $ bin/cake

.. note::

    For Windows, the command needs to be ``bin\cake`` (note the backslash).

Running the Console with no arguments produces this help message::

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

    [Bake] bake

    [Migrations] migrations

    [CORE] i18n, orm_cache, plugin, routes, server

    [app] behavior_time, console, orm

    To run an app or core command, type cake shell_name [args]
    To run a plugin command, type cake Plugin.shell_name [args]
    To get help on a specific command, type cake shell_name --help

The first information printed relates to paths. This is helpful if you're
running the console from different parts of the filesystem.

You could then run the any of the listed shells by using its name::

    # run server shell
    bin/cake server

    # run migrations shell
    bin/cake migrations -h

    # run bake (with plugin prefix)
    bin/cake bake.bake -h

Plugin shells can be invoked without a plugin prefix if the shell's name does
not overlap with an application or framework shell. In the case that two plugins
provide a shell with the same name, the first loaded plugin will get the short
alias. You can always use the ``plugin.shell`` format to unambiguously reference
a shell.

.. php:class:: Shell

Creating a Shell
================

Let's create a shell for use in the Console. For this example, we'll create a
simple Hello world shell. In your application's **src/Shell** directory create
**HelloShell.php**. Put the following code inside it::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }
    }

The conventions for shell classes are that the class name should match the file
name, with the suffix of Shell. In our shell we created a ``main()`` method.
This method is called when a shell is called with no additional commands. We'll
add some more commands in a bit, but for now let's just run our shell. From your
application directory, run::

    bin/cake hello

You should see the following output::

    Welcome to CakePHP Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/src/
    ---------------------------------------------------------------
    Hello world.

As mentioned before, the ``main()`` method in shells is a special method called
whenever there are no other commands or arguments given to a shell. Since our
main method wasn't very interesting let's add another command that does
something::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }

        public function heyThere($name = 'Anonymous')
        {
            $this->out('Hey there ' . $name);
        }
    }

After saving this file, you should be able to run the following command and see
your name printed out::

    bin/cake hello hey_there your-name

Any public method not prefixed by an ``_`` is allowed to be called from the
command line. As you can see, methods invoked from the command line are
transformed from the underscored shell argument to the correct camel-cased
method name in the class.

In our ``heyThere()`` method we can see that positional arguments are provided
to our ``heyThere()`` function. Positional arguments are also available in the
``args`` property.
You can access switches or options on shell applications, which are available at
``$this->params``, but we'll cover that in a bit.

When using a ``main()`` method you won't be able to use the positional
arguments. This is because the first positional argument or option is
interpreted as the command name. If you want to use arguments, you should use
method names other than ``main``.

Using Models in Your Shells
---------------------------

You'll often need access to your application's business logic in shell
utilities; CakePHP makes that super easy. You can load models in shells, just as
you would in a controller using ``loadModel()``. The loaded models are set as
properties attached to your shell::

    namespace App\Shell;

    use Cake\Console\Shell;

    class UserShell extends Shell
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function show()
        {
            if (empty($this->args[0])) {
                // Use error() before CakePHP 3.2
                return $this->abort('Please enter a username.');
            }
            $user = $this->Users->findByUsername($this->args[0])->first();
            $this->out(print_r($user, true));
        }
    }

The above shell, will fetch a user by username and display the information
stored in the database.

Shell Tasks
===========

There will be times when building more advanced console applications, you'll
want to compose functionality into re-usable classes that can be shared across
many shells. Tasks allow you to extract commands into classes. For example the
``bake`` command is made almost entirely of tasks. You define a tasks for a
shell using the ``$tasks`` property::

    class UserShell extends Shell
    {
        public $tasks = ['Template'];
    }

You can use tasks from plugins using the standard :term:`plugin syntax`.
Tasks are stored in ``Shell/Task/`` in files named after their classes. So if
we were to create a new 'FileGenerator' task, you would create
**src/Shell/Task/FileGeneratorTask.php**.

Each task must at least implement a ``main()`` method. The ShellDispatcher,
will call this method when the task is invoked. A task class looks like::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class FileGeneratorTask extends Shell
    {
        public function main()
        {

        }
    }

A shell can also access its tasks as properties, which makes tasks great for
making re-usable chunks of functionality similar to
:doc:`/controllers/components`::

    // Found in src/Shell/SeaShell.php
    class SeaShell extends Shell
    {
        // Found in src/Shell/Task/SoundTask.php
        public $tasks = ['Sound'];

        public function main()
        {
            $this->Sound->main();
        }
    }

You can also access tasks directly from the command line::

    $ cake sea sound

.. note::

    In order to access tasks directly from the command line, the task
    **must** be included in the shell class' $tasks property.


Also, the task name must be added as a sub-command to the Shell's OptionParser::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addSubcommand('sound', [
            // Provide help text for the command list
            'help' => 'Execute The Sound Task.',
            // Link the option parsers together.
            'parser' => $this->Sound->getOptionParser(),
        ]);
        return $parser;
    }

Loading Tasks On The Fly with TaskRegistry
------------------------------------------

You can load tasks on the fly using the Task registry object. You can load tasks
that were not declared in $tasks this way::

    $project = $this->Tasks->load('Project');

Would load and return a ProjectTask instance. You can load tasks from plugins
using::

    $progressBar = $this->Tasks->load('ProgressBar.ProgressBar');

Shell Helpers
=============

If you have complex output generation logic, you can use
:doc:`/console-and-shells/helpers` to encapsulate this logic in a re-usable way.

.. _invoking-other-shells-from-your-shell:

Invoking Other Shells from Your Shell
=====================================

.. php:method:: dispatchShell($args)

There are still many cases where you will want to invoke one shell from another though.
``Shell::dispatchShell()`` gives you the ability to call other shells by providing the
``argv`` for the sub shell. You can provide arguments and options either
as var args or as a string::

    // As a string
    $this->dispatchShell('schema create Blog --plugin Blog');

    // As an array
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

The above shows how you can call the schema shell to create the schema for a plugin
from inside your plugin's shell.

Passing extra parameters to the dispatched Shell
------------------------------------------------

.. versionadded:: 3.1

It can sometimes be useful to pass on extra parameters (that are not shell arguments)
to the dispatched Shell. In order to do this, you can now pass an array to
``dispatchShell()``. The array is expected to have a ``command`` key as well
as an ``extra`` key::

    // Using a command string
    $this->dispatchShell([
       'command' => 'schema create Blog --plugin Blog'
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

    // Using a command array
    $this->dispatchShell([
       'command' => ['schema', 'create', 'Blog', '--plugin', 'Blog']
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

Parameters passed through ``extra`` will be merged in the ``Shell::$params``
property and are accessible with the ``Shell::param()`` method.
By default, a ``requested`` extra param is automatically added when a Shell
is dispatched using ``dispatchShell()``. This ``requested`` parameter prevents
the CakePHP console welcome message from being displayed on dispatched shells.

Getting User Input
==================

.. php:method:: in($question, $choices = null, $default = null)

When building interactive console applications you'll need to get user input.
CakePHP provides an easy way to do this::

    // Get arbitrary text from the user.
    $color = $this->in('What color do you like?');

    // Get a choice from the user.
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

Selection validation is case-insensitive.

Creating Files
==============

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
    $this->out('Normal message');

    // Write to stderr
    $this->err('Error message');

    // Write to stderr and raise a stop exception
    $this->abort('Fatal error');

    // Before CakePHP 3.2. Write to stderr and exit()
    $this->error('Fatal error');

It also provides two convenience methods regarding the output level::

    // Would only appear when verbose output is enabled (-v)
    $this->verbose('Verbose message');

    // Would appear at all levels.
    $this->quiet('Quiet message');

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

* ``QUIET`` - Only absolutely important information should be marked for quiet
  output.
* ``NORMAL`` - The default level, and normal usage.
* ``VERBOSE`` - Mark messages that may be too noisy for everyday use, but
  helpful for debugging as ``VERBOSE``.

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

You can control the output level of shells, by using the ``--quiet`` and
``--verbose`` options. These options are added by default, and allow you to
consistently control output levels inside your CakePHP shells.

The ``--quiet`` and ``--verbose`` options also control how logging data is
output to stdout/stderr. Normally info and higher log messages are output to
stdout/stderr. When ``--verbose`` is used, debug logs will be output to stdout.
When ``--quiet`` is used, only warning and higher log messages will be output to
stderr.

Styling Output
--------------

Styling output is done by including tags - just like HTML - in your output.
ConsoleOutput will replace these tags with the correct ansi code sequence, or
remove the tags if you are on a console that doesn't support ansi codes. There
are several built-in styles, and you can create more. The built-in ones are

* ``error`` Error messages. Red text.
* ``warning`` Warning messages. Yellow text.
* ``info`` Informational messages. Cyan text.
* ``comment`` Additional text. Blue text.
* ``question`` Text that is a question, added automatically by shell.

You can create additional styles using ``$this->stdout->styles()``. To declare a
new output style you could do::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

This would then allow you to use a ``<flashy>`` tag in your shell output, and if
ansi colours are enabled, the following would be rendered as blinking magenta
text ``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. When
defining styles you can use the following colours for the ``text`` and
``background`` attributes:

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

You can also use the following options as boolean switches, setting them to a
truthy value enables them.

* blink
* bold
* reverse
* underline

Adding a style makes it available on all instances of ConsoleOutput as well,
so you don't have to redeclare styles for both stdout and stderr objects.

Turning Off Colouring
---------------------

Although colouring is pretty awesome, there may be times when you want to turn it off,
or force it on::

    $this->_io->outputAs(ConsoleOutput::RAW);

The above will put the output object into raw output mode. In raw output mode,
no styling is done at all. There are three modes you can use.

* ``ConsoleOutput::COLOR`` - Output with color escape codes in place.
* ``ConsoleOutput::PLAIN`` - Plain text output, known style tags will be
  stripped from the output.
* ``ConsoleOutput::RAW`` - Raw output, no styling or formatting will be done.
  This is a good mode to use if you are outputting XML or, want to debug why
  your styling isn't working.

By default on \*nix systems ConsoleOutput objects default to colour output.
On Windows systems, plain output is the default unless the ``ANSICON``
environment variable is present.

Stopping Shell Execution
========================

When your shell commands have reached a condition where you want execution to
stop, you can use ``abort()`` to raise a ``StopException`` that will halt the
process::

    $user = $this->Users->get($this->args[0]);
    if (!$user) {
        // Halt with an error message and error code.
        $this->abort('User cannot be found', 128);
    }

.. versionadded:: 3.2
    The abort() method was added in 3.2. In prior versions you can use
    ``error()`` to output a message and stop execution.

Status and Error Codes
----------------------

Command-line tools should return 0 to indicate success, or a non-zero value to
indicate an error condition. Since PHP methods usually return ``true`` or
``false``, the Cake Shell ``dispatch`` function helps to bridge these semantics
by converting your ``null`` and ``true`` return values to 0, and all other
values to 1.

The Cake Shell ``dispatch`` function also catches the ``StopException`` and
uses its exception code value as the shell's exit code. As described above, you
can use the ``abort()`` method to print a message and exit with a specific
code, or raise the ``StopException`` directly as shown in the example::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class ErroneousShell extends Shell
    {
        public function main()
        {
            return true;
        }

        public function itFails()
        {
            return false;
        }

        public function itFailsSpecifically()
        {
            throw new StopException("", 2);
        }
    }

The example above will return the following exit codes when executed on a
command-line::

    $ bin/cake erroneousshell ; echo $?
    0
    $ bin/cake erroneousshell itFails ; echo $?
    1
    $ bin/cake erroneousshell itFailsSpecifically ; echo $?
    2

.. tip::

    Avoid exit codes 64 - 78, as they have specific meanings described by
    ``sysexits.h``.
    Avoid exit codes above 127, as these are used to indicate process exit
    by signal, such as SIGKILL or SIGSEGV.

.. note::

    You can read more about conventional exit codes in the sysexit manual page
    on most Unix systems (``man sysexits``), or the ``System Error Codes`` help
    page in Windows.

Hook Methods
============

.. php:method:: initialize()

    Initializes the Shell, acts as constructor for subclasses and allows
    configuration of tasks prior to shell execution.

.. php:method:: startup()

    Starts up the Shell and displays the welcome message. Allows for checking
    and configuring prior to command or main execution.

.. tip::

    Override the ``startup()`` method if you want to remove the welcome
    information, or otherwise modify the pre-command flow.

Configuring Options and Generating Help
=======================================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` provides a command line option and
argument parser.

OptionParsers allow you to accomplish two goals at the same time. First, they
allow you to define the options and arguments for your commands. This allows
you to separate basic input validation and your console commands. Secondly, it
allows you to provide documentation, that is used to generate a well formatted
help file.

The console framework in CakePHP gets your shell's option parser by calling
``$this->getOptionParser()``. Overriding this method allows you to configure the
OptionParser to define the expected inputs of your shell. You can also configure
subcommand option parsers, which allow you to have different option parsers for
subcommands and tasks. The ConsoleOptionParser implements a fluent interface and
includes methods for setting multiple options/arguments at once::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        // Configure parser
        return $parser;
    }

Configuring an Option Parser with the Fluent Interface
------------------------------------------------------

All of the methods that configure an option parser can be chained, allowing you
to define an entire option parser in one series of method calls::

    public function getOptionParser()
    {
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

- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()
- setCommand()
- setDescription()
- setEpilog()

Set the Description
~~~~~~~~~~~~~~~~~~~

.. php:method:: setDescription($text)

The description displays above the argument and option information. By passing
in either an array or a string, you can set the value of the description::

    // Set multiple lines at once
    $parser->setDescription(['line one', 'line two']);
    // Prior to 3.4
    $parser->description(['line one', 'line two']);

    // Read the current value
    $parser->getDescription();

The **src/Shell/ConsoleShell.php** is a good example of the ``description()``
method in action::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        return $parser;
    }

The console's ``description`` output can be seen by executing the following
command::

    $ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

Set the Epilog
--------------

.. php:method:: setEpilog($text)

Gets or sets the epilog for the option parser. The epilog is displayed after the
argument and option information. By passing in either an array or a string, you
can set the value of the epilog. Calling with no arguments will return the
current value::

    // Set multiple lines at once
    $parser->setEpilog(['line one', 'line two']);
    // Prior to 3.4
    $parser->epilog(['line one', 'line two']);

    // Read the current value
    $parser->getEpilog();

To illustrate the ``epilog()`` method in action lets add a call to the
``getOptionParser()`` method used above in the **src/Shell/ConsoleShell.php**::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        $parser->setEpilog('Thank you for baking with CakePHP!');
        return $parser;
    }

The text added with the ``setEpilog()`` method can be seen in the output from
the following console command::

    $ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

    Thank you for baking with CakePHP!

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

If you have an array with multiple arguments you can use
``$parser->addArguments()`` to add multiple arguments at once. ::

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
Additionally you can use ``choices`` to force an argument to be from a list of
valid choices::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

The above will create an argument that is required and has validation on the
input. If the argument is either missing, or has an incorrect value an exception
will be raised and the shell will be stopped.

Adding Options
--------------

.. php:method:: addOption($name, $options = [])

Options or flags are also frequently used in command line tools.
``ConsoleOptionParser`` supports creating options with both verbose and short
aliases, supplying defaults and creating boolean switches. Options are created
with either ``$parser->addOption()`` or ``$parser->addOptions()``. ::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

The above would allow you to use either ``cake myshell --connection=other``,
``cake myshell --connection other``, or ``cake myshell -c other``
when invoking the shell. You can also create boolean switches, these switches do
not consume values, and their presence just enables them in the parsed
parameters. ::

    $parser->addOption('no-commit', ['boolean' => true]);

With this option, when calling a shell like
``cake myshell --no-commit something`` the no-commit param would have a value of
``true``, and 'something' would be a treated as a positional argument.
The built-in ``--help``, ``--verbose``, and ``--quiet`` options use this
feature.

When creating options you can use the following options to define the behavior
of the option:

* ``short`` - The single letter variant for this option, leave undefined for
   none.
* ``help`` - Help text for this option. Used when generating help for the
   option.
* ``default`` - The default value for this option. If not defined the default
   will be ``true``.
* ``boolean`` - The option uses no value, it's just a boolean switch.
  Defaults to ``false``.
* ``choices`` - An array of valid choices for this option. If left empty all
  values are valid. An exception will be raised when parse() encounters an
  invalid value.

.. php:method:: addOptions(array $options)

If you have an array with multiple options you can use ``$parser->addOptions()``
to add multiple options at once. ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

As with all the builder methods on ConsoleOptionParser, addOptions can be used
as part of a fluent method chain.

Option values are stored in the ``$this->params`` array. You can also use the
convenience method ``$this->param()`` to avoid errors when trying to access
non-present options.

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

Options can be defined as boolean options, which are useful when you need to
create some flag options. Like options with defaults, boolean options always
include themselves into the parsed parameters. When the flags are present they
are set to ``true``, when they are absent they are set to ``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

The following option would result in ``$this->params['verbose']`` always being
available. This lets you omit ``empty()`` or ``isset()`` checks for boolean
flags::

    if ($this->params['verbose']) {
        // Do something.
    }

Since the boolean options are always defined as ``true`` or ``false`` you can
omit additional check methods when using the array access. The
``$this->param()`` method makes these checks unnecessary for all cases.

Adding Subcommands
------------------

.. php:method:: addSubcommand($name, $options = [])

Console applications are often made of subcommands, and these subcommands may
require special option parsing and have their own help. A perfect example of
this is ``bake``. Bake is made of many separate tasks that all have their own
help and options. ``ConsoleOptionParser`` allows you to define subcommands and
provide command specific option parsers so the shell knows how to parse commands
for its tasks::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

The above is an example of how you could provide help and a specialized option
parser for a shell's task. By calling the Task's ``getOptionParser()`` we don't
have to duplicate the option parser generation, or mix concerns in our shell.
Adding subcommands in this way has two advantages. First, it lets your shell
document its subcommands in the generated help. It also gives easy access to the
subcommand help. With the above subcommand created you could call
``cake myshell --help`` and see the list of subcommands, and also run
``cake myshell model --help`` to view the help for just the model task.

.. note::

    Once your Shell defines subcommands, all subcommands must be explicitly
    defined.

When defining a subcommand you can use the following options:

* ``help`` - Help text for the subcommand.
* ``parser`` - A ConsoleOptionParser for the subcommand. This allows you to
  create method specific option parsers. When help is generated for a
  subcommand, if a parser is present it will be used. You can also supply the
  parser as an array that is compatible with
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()`

Adding subcommands can be done as part of a fluent method chain.

Building a ConsoleOptionParser from an Array
--------------------------------------------

.. php:method:: buildFromArray($spec)

As previously mentioned, when creating subcommand option parsers, you can define
the parser spec as an array for that method. This can help make building
subcommand parsers easier, as everything is an array::

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
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` use. You can also
use buildFromArray on its own, to build an option parser::

    public function getOptionParser()
    {
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

Merging ConsoleOptionParsers
----------------------------

.. php:method:: merge($spec)

When building a group command, you maybe want to combine several parsers for
this::

    $parser->merge($anotherParser);

Note that the order of arguments for each parser must be the same, and that
options must also be compatible for it work. So do not use keys for different
things.

Getting Help from Shells
------------------------

With the addition of ConsoleOptionParser getting help from shells is done in a
consistent and uniform way. By using the ``--help`` or -``h`` option you
can view the help for any core shell, and any shell that implements a
ConsoleOptionParser::

    cake bake --help
    cake bake -h

Would both generate the help for bake. If the shell supports subcommands you can
get help for those in a similar fashion::

    cake bake model --help
    cake bake model -h

This would get you the help specific to bake's model task.

Getting Help as XML
-------------------

When building automated tools or development tools that need to interact with
CakePHP shells, it's nice to have help available in a machine parse-able format.
The ConsoleOptionParser can provide help in xml by setting an additional
argument::

    cake bake --help xml
    cake bake -h xml

The above would return an XML document with the generated help, options,
arguments and subcommands for the selected shell. A sample XML document would
look like:

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

In command-line interface (CLI), specifically your shells and tasks,
``env('HTTP_HOST')`` and other webbrowser specific environment variables are not
set.

If you generate reports or send emails that make use of ``Router::url()`` those
will contain the default host ``http://localhost/``  and thus resulting in
invalid URLs. In this case you need to specify the domain manually.
You can do that using the Configure value ``App.fullBaseURL`` from your
bootstrap or config, for example.

For sending emails, you should provide Email class with the host you want to
send the email with::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->domain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the
emails are sent from.

More Topics
===========

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/repl
    console-and-shells/cron-jobs
    console-and-shells/i18n-shell
    console-and-shells/completion-shell
    console-and-shells/plugin-shell
    console-and-shells/routes-shell
    console-and-shells/upgrade-shell
    console-and-shells/server-shell
    console-and-shells/cache

.. meta::
    :title lang=en: Shells, Tasks & Console Tools
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
