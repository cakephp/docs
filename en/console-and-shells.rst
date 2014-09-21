Console and Shells
##################

CakePHP features not only a web framework but also a console framework
for creating console applications. Console applications are ideal for handling
a variety of background tasks such as maintenance, and completing work outside
of the request-response cycle. CakePHP console applications allow you
to reuse your application classes from the command line.

CakePHP comes with a number of console applications out of the box.
Some of these applications are used in concert with other CakePHP
features (like ACL or i18n), and others are for general use in
getting you working faster.

.. _the-cakephp-console:

The CakePHP console
===================

This section provides an introduction into CakePHP at the
command-line. If you've ever needed access to your CakePHP MVC
classes in a cron job or other command-line script, this section is
for you.

PHP provides a CLI client that makes interfacing with your
file system and applications much smoother. The CakePHP console
provides a framework for creating shell scripts. The Console uses a
dispatcher-type setup to load a shell or task, and provide its
parameters.

.. note::

    A command-line (CLI) build of PHP must be available on the system
    if you plan to use the Console.

Before we get into specifics, let's make sure we can run the
CakePHP console. First, you'll need to bring up a system shell. The
examples shown in this section will be in bash, but the CakePHP
Console is Windows-compatible as well. Let's execute the Console
program from bash. This example assumes that the user is currently
logged into a bash prompt and is currently at the root of a CakePHP
application.

CakePHP applications contain a ``Console`` directory that contains
all the shells and tasks for an application. It also comes with an
executable::

    $ cd /path/to/cakephp/app
    $ Console/cake

It's often wise to add the core cake executable to your system path
so you can use the cake command anywhere. This comes in handy when you are
creating new projects. See :ref:`adding-cake-to-your-path` for how to make ``cake``
available systemwide.

Running the Console with no arguments produces this help message::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /path/to/cakephp/app/
    ---------------------------------------------------------------
    Current Paths:

     -app: app
     -working: /path/to/cakephp/app
     -root: /path/to/cakephp/
     -core: /path/to/cakephp/core

    Changing Paths:

    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/cakephp/app or -app /absolute/path/to/cakephp/app

    Available Shells:

     acl [CORE]                              i18n [CORE]
     api [CORE]                              import [app]
     bake [CORE]                             schema [CORE]
     command_list [CORE]                     testsuite [CORE]
     console [CORE]                          upgrade [CORE]

    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

The first information printed relates to paths. This is especially
helpful if you're running the console from different parts of the
filesystem.

Since many users add the CakePHP console to their system's path so it can
be accessed easily. Printing out the working, root, app, and core
paths allows you to see where the console will be making changes.
To change the app folder you wish to work with, you can supply its
path as the first argument to the cake command. This next example
shows how to specify an app folder, assuming you've already added
the console folder to your ``PATH``::

    $ cake -app /path/to/cakephp/app

The path supplied can be relative to the current working directory
or supplied as an absolute path.


.. _adding-cake-to-your-path:

Adding cake to your system path
-------------------------------

If you are on a \*nix system (linux, MacOSX) the following steps will let you add the
cake executable to your system path.

#. Locate where your CakePHP install, and cake executable are. For example
   ``/Users/mark/cakephp/lib/Cake/Console/cake``
#. Edit your ``.bashrc`` or ``.bash_profile`` file in your home directory, and add the following::

    export PATH="$PATH:/Users/mark/cakephp/lib/Cake/Console"

#. Reload the bash configuration or open a new terminal, and ``cake`` should work anywhere.

If you are on Windows Vista or 7, you should follow the steps below.

#. Locate where your CakePHP install and cake executable are. For example
   ``C:\xampp\htdocs\cakephp\lib\Cake\Console``
#. Open System Properties window from My Computer. You want to try the shortcut Windows Key + Pause or Windows Key + Break. Or, from the Desktop, right-click My Computer, click Properties then click Advanced System Settings link in the left column
#. Go under Advanced tab and click on Environment Variables button
#. In the System Variables portion, reach Path variable and double-click on it to Edit
#. Add the ``cake`` install path string followed by a semi colon. Result example::

    %SystemRoot%\system32;%SystemRoot%;C:\xampp\htdocs\cakephp\lib\Cake\Console;

#. Click Ok and ``cake`` should work anywhere.

Creating a shell
================

Let's create a shell for use in the Console. For this example,
we'll create a simple Hello world shell. In your applications
``Console/Command`` directory create ``HelloShell.php``. Put the following
code inside it::

    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }
    }

The conventions for shell classes are that the class name should match
the file name, with the suffix of Shell. In our shell we created a ``main()`` method.
This method is called when a shell is called with no additional commands. We'll add
some more commands in a bit, but for now let's just run our shell. From your application
directory, run::

    Console/cake hello

You should see the following output::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/app/
    ---------------------------------------------------------------
    Hello world.

As mentioned before, the ``main()`` method in shells is a special method called
whenever there are no other commands or arguments given to a shell. You may have also
noticed that HelloShell is extending ``AppShell``. Much like :ref:`app-controller`, AppShell
gives you a base class to contain all your common functions or logic. You can define an AppShell,
by creating ``app/Console/Command/AppShell.php``. If you don't have one, CakePHP will use the
built-in one. Since our main method wasn't very interesting let's add another command
that does something::

    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }

        public function hey_there() {
            $this->out('Hey there ' . $this->args[0]);
        }
    }

After saving this file you should be able to run ``Console/cake hello hey_there your-name``
and see your name printed out. Any public method not prefixed by an ``_`` is allowed to be
called from the command line. In our ``hey_there`` method we also used ``$this->args``, this
property contains an array of all the positional arguments provided to a command. You can
also use switches or options on shell applications, these are available at ``$this->params``,
but we'll cover that in a bit.

When using a ``main()`` method you won't be able to use the positional arguments
or parameters. This is because the first positional argument or option is
interpreted as the command name. If you want to use arguments and options, you
should use method names other than ``main``.

Using Models in your shells
---------------------------

You'll often need access to your application's business logic in shell utilities;
CakePHP makes that super easy. By setting a ``$uses`` property, you can define an
array of models you want to have access to in your shell. The defined models
are loaded in as properties attached to your shell, just like a controller gets
models attached to it::

    class UserShell extends AppShell {
        public $uses = array('User');

        public function show() {
            $user = $this->User->findByUsername($this->args[0]);
            $this->out(print_r($user, true));
        }
    }

The above shell, will fetch a user by username and display the information
stored in the database.

Shell tasks
===========

There will be times when building more advanced console applications, you'll want
to compose functionality into re-usable classes that can be shared across many shells.
Tasks allow you to extract commands into classes. For example the ``bake`` is made
almost entirely of tasks. You define a shell's tasks by using the ``$tasks`` property::

    class UserShell extends AppShell {
        public $tasks = array('Template');
    }

You can use tasks from plugins using the standard :term:`plugin syntax`.
Tasks are stored in ``Console/Command/Task/`` in files named after
their classes. So if we were to create a new 'FileGenerator' task, you would create
``Console/Command/Task/FileGeneratorTask.php``.

Each task must at least implement an ``execute()`` method. The ShellDispatcher,
will call this method when the task is invoked. A task class looks like::

    class FileGeneratorTask extends Shell {
        public $uses = array('User');
        public function execute() {

        }
    }

A shell can also access it's tasks as properties, which makes tasks great for
making re-usable chunks of functionality similar to :doc:`/controllers/components`::

    // found in Console/Command/SeaShell.php
    class SeaShell extends AppShell {
        public $tasks = array('Sound'); // found in Console/Command/Task/SoundTask.php
        public function main() {
            $this->Sound->execute();
        }
    }

You can also access tasks directly from the command line::

    $ cake sea sound

.. note::

    In order to access tasks directly from the command line, the task
    **must** be included in the shell class' $tasks property.
    Therefore, be warned that a method called "sound" in the SeaShell
    class would override the ability to access the functionality in the
    Sound task specified in the $tasks array.

Loading tasks on the fly with TaskCollection
--------------------------------------------

You can load tasks on the fly using the Task collection object. You can load tasks that
were not declared in $tasks this way::

    $Project = $this->Tasks->load('Project');

Would load and return a ProjectTask instance. You can load tasks from plugins using::

    $ProgressBar = $this->Tasks->load('ProgressBar.ProgressBar');

.. _invoking-other-shells-from-your-shell:

Invoking other shells from your shell
=====================================

Shells no longer have direct access to the ShellDispatcher any more through `$this->Dispatch`.
There are still many cases where you will want to invoke one shell from another though.
`Shell::dispatchShell()` gives you the ability to call other shells by providing the
`argv` for the sub shell. You can provide arguments and options either
as var args or as a string::

    // As a string
    $this->dispatchShell('schema create Blog --plugin Blog');

    // As an array
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

The above shows how you can call the schema shell to create the schema for a plugin
from inside your plugin's shell.

.. _shell-output-level:

Console output levels
=====================

Shells often need different levels of verbosity. When running as cron jobs,
most output is un-necessary. And there are times when you are not interested in
everything that a shell has to say. You can use output levels to flag output
appropriately. The user of the shell, can then decide what level of detail
they are interested in by setting the correct flag when calling the shell.
:php:meth:`Shell::out()` supports 3 types of output by default.

* QUIET - Only absolutely important information should be marked for quiet output.
* NORMAL - The default level, and normal usage
* VERBOSE - Mark messages that may be too noisy for everyday use, but helpful
  for debugging as VERBOSE

You can mark output as follows::

    // would appear at all levels.
    $this->out('Quiet message', 1, Shell::QUIET);

    // would not appear when quiet output is toggled
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);

    // would only appear when verbose output is enabled.
    $this->out('extra message', 1, Shell::VERBOSE);

You can control the output level of shells, by using the ``--quiet`` and ``--verbose``
options. These options are added by default, and allow you to consistently control
output levels inside your CakePHP shells.

Styling output
==============

Styling output is done by including tags - just like HTML - in your output.
ConsoleOutput will replace these tags with the correct ansi code sequence, or
remove the tags if you are on a console that doesn't support ansi codes. There
are several built-in styles, and you can create more. The built-in ones are

* ``error`` Error messages. Red underlined text.
* ``warning`` Warning messages. Yellow text.
* ``info`` Informational messages. Cyan text.
* ``comment`` Additional text. Blue text.
* ``question`` Text that is a question, added automatically by shell.

You can create additional styles using `$this->stdout->styles()`. To declare a
new output style you could do::

    $this->stdout->styles('flashy', array('text' => 'magenta', 'blink' => true));

This would then allow you to use a ``<flashy>`` tag in your shell output, and if ansi
colours are enabled, the following would be rendered as blinking magenta text
``$this->out('<flashy>Whoooa</flashy> Something went wrong');``. When defining
styles you can use the following colours for the `text` and `background` attributes:

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

Turning off colouring
---------------------

Although colouring is pretty awesome, there may be times when you want to turn it off,
or force it on::

    $this->output->outputAs(ConsoleOutput::RAW);

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

Configuring options and generating help
=======================================

.. php:class:: ConsoleOptionParser

Console option parsing in CakePHP has always been a little bit different
from everything else on the command line. In 2.0 ``ConsoleOptionParser``
helps provide a more familiar command line option and argument parser.

OptionParsers allow you to accomplish two goals at the same time.
First they allow you to define the options and arguments, separating
basic input validation and your code. Secondly, it allows you to provide
documentation, that is used to generate well formatted help file.

The console framework gets your shell's option parser by calling
``$this->getOptionParser()``. Overriding this method allows you to
configure the OptionParser to match the expected inputs of your shell.
You can also configure subcommand option parsers, which allow you to
have different option parsers for subcommands and tasks.
The ConsoleOptionParser implements a fluent interface and includes
methods for easily setting multiple options/arguments at once.::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        //configure parser
        return $parser;
    }

Configuring an option parser with the fluent interface
------------------------------------------------------

All of the methods that configure an option parser can be chained,
allowing you to define an entire option parser in one series of method calls::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', array(
            'help' => 'Either a full path or type of class.'
        ))->addArgument('className', array(
            'help' => 'A CakePHP core class name (e.g: Component, HtmlHelper).'
        ))->addOption('method', array(
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ))->description(__('Lookup doc block comments for classes in CakePHP.'));
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
    $parser->description(array('line one', 'line two'));

    // read the current value
    $parser->description();

.. php:method:: epilog($text = null)

Gets or sets the epilog for the option parser. The epilog
is displayed after the argument and option information. By passing in
either an array or a string, you can set the value of the epilog.
Calling with no arguments will return the current value::

    // Set multiple lines at once
    $parser->epilog(array('line one', 'line two'));

    // read the current value
    $parser->epilog();

Adding arguments
----------------

.. php:method:: addArgument($name, $params = array())

Positional arguments are frequently used in command line tools,
and ``ConsoleOptionParser`` allows you to define positional
arguments as well as make them required. You can add arguments
one at a time with ``$parser->addArgument();`` or multiple at once
with ``$parser->addArguments();``::

    $parser->addArgument('model', array('help' => 'The model to bake'));

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

    $parser->addArguments(array(
        'node' => array('help' => 'The node to create', 'required' => true),
        'parent' => array('help' => 'The parent node', 'required' => true)
    ));

As with all the builder methods on ConsoleOptionParser, addArguments
can be used as part of a fluent method chain.

Validating arguments
--------------------

When creating positional arguments, you can use the ``required`` flag, to
indicate that an argument must be present when a shell is called.
Additionally you can use ``choices`` to force an argument to
be from a list of valid choices::

    $parser->addArgument('type', array(
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => array('aro', 'aco')
    ));

The above will create an argument that is required and has validation
on the input. If the argument is either missing, or has an incorrect
value an exception will be raised and the shell will be stopped.

Adding Options
--------------

.. php:method:: addOption($name, $options = array())

Options or flags are also frequently used in command line tools.
``ConsoleOptionParser`` supports creating options
with both verbose and short aliases, supplying defaults
and creating boolean switches. Options are created with either
``$parser->addOption()`` or ``$parser->addOptions()``.::

    $parser->addOption('connection', array(
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ));

The above would allow you to use either ``cake myshell --connection=other``,
``cake myshell --connection other``, or ``cake myshell -c other``
when invoking the shell. You can also create boolean switches, these switches do not
consume values, and their presence just enables them in the
parsed parameters.::

    $parser->addOption('no-commit', array('boolean' => true));

With this option, when calling a shell like ``cake myshell --no-commit something``
the no-commit param would have a value of true, and 'something'
would be a treated as a positional argument.
The built-in ``--help``, ``--verbose``, and ``--quiet`` options
use this feature.

When creating options you can use the following options to
define the behavior of the option:

* ``short`` - The single letter variant for this option, leave undefined for none.
* ``help`` - Help text for this option. Used when generating help for the option.
* ``default`` - The default value for this option. If not defined the default will be true.
* ``boolean`` - The option uses no value, it's just a boolean switch.
  Defaults to false.
* ``choices`` An array of valid choices for this option. If left empty all
  values are valid. An exception will be raised when parse() encounters an invalid value.

.. php:method:: addOptions(array $options)

If you have an array with multiple options you can use ``$parser->addOptions()``
to add multiple options at once.::

    $parser->addOptions(array(
        'node' => array('short' => 'n', 'help' => 'The node to create'),
        'parent' => array('short' => 'p', 'help' => 'The parent node')
    ));

As with all the builder methods on ConsoleOptionParser, addOptions is can be used
as part of a fluent method chain.

Validating options
------------------

Options can be provided with a set of choices much like positional arguments
can be. When an option has defined choices, those are the only valid choices
for an option. All other values will raise an ``InvalidArgumentException``::

    $parser->addOption('accept', array(
        'help' => 'What version to accept.',
        'choices' => array('working', 'theirs', 'mine')
    ));

Using boolean options
---------------------

Options can be defined as boolean options, which are useful when you need to create
some flag options. Like options with defaults, boolean options always include
themselves into the parsed parameters. When the flags are present they are set
to true, when they are absent false::

    $parser->addOption('verbose', array(
        'help' => 'Enable verbose output.',
        'boolean' => true
    ));

The following option would result in ``$this->params['verbose']`` always
being available. This lets you omit ``empty()`` or ``isset()``
checks for boolean flags::

    if ($this->params['verbose']) {
        // do something
    }

Since the boolean options are always defined as ``true`` or
``false`` you can omit additional check methods.

Adding subcommands
------------------

.. php:method:: addSubcommand($name, $options = array())

Console applications are often made of subcommands, and these subcommands
may require special option parsing and have their own help. A perfect
example of this is ``bake``. Bake is made of many separate tasks that all
have their own help and options. ``ConsoleOptionParser`` allows you to
define subcommands and provide command specific option parsers so the
shell knows how to parse commands for its tasks::

    $parser->addSubcommand('model', array(
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ));

The above is an example of how you could provide help and a specialized
option parser for a shell's task. By calling the Task's ``getOptionParser()``
we don't have to duplicate the option parser generation, or mix concerns
in our shell. Adding subcommands in this way has two advantages.
First it lets your shell easily document its subcommands in the
generated help, and it also allows easy access to the subcommand
help. With the above subcommand created you could call
``cake myshell --help`` and see the list of subcommands, and
also run ``cake myshell model --help`` to view the help for
just the model task.

When defining a subcommand you can use the following options:

* ``help`` - Help text for the subcommand.
* ``parser`` - A ConsoleOptionParser for the subcommand. This allows you
  to create method specific option parsers. When help is generated for a
  subcommand, if a parser is present it will be used. You can also
  supply the parser as an array that is compatible with
  :php:meth:`ConsoleOptionParser::buildFromArray()`

Adding subcommands can be done as part of a fluent method chain.

Building a ConsoleOptionParser from an array
--------------------------------------------

.. php:method:: buildFromArray($spec)

As previously mentioned, when creating subcommand option parsers,
you can define the parser spec as an array for that method. This can help
make building subcommand parsers easier, as everything is an array::

    $parser->addSubcommand('check', array(
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        )
    ));

Inside the parser spec, you can define keys for ``arguments``, ``options``,
``description`` and ``epilog``. You cannot define ``subcommands`` inside an
array style builder. The values for arguments, and options, should follow the
format that :php:func:`ConsoleOptionParser::addArguments()` and
:php:func:`ConsoleOptionParser::addOptions()` use. You can also use
buildFromArray on its own, to build an option parser::

    public function getOptionParser() {
        return ConsoleOptionParser::buildFromArray(array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        ));
    }

Getting help from shells
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

Getting help as XML
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

Routing in shells / CLI
=======================

In command-line interface (CLI), specifically your shells and tasks, ``env('HTTP_HOST')`` and
other webbrowser specific environment variables are not set.

If you generate reports or send emails that make use of ``Router::url()`` those will contain
the default host ``http://localhost/``  and thus resulting in invalid URLs. In this case you need to
specify the domain manually.
You can do that using the Configure value ``App.fullBaseURL`` from your bootstrap or config, for example.

For sending emails, you should provide CakeEmail class with the host you want to send the email with:

    $Email = new CakeEmail();
    $Email->domain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the emails are sent from.

Shell API
=========

.. php:class:: AppShell

    AppShell can be used as a base class for all your shells. It should extend
    :php:class:`Shell`, and be located in ``Console/Command/AppShell.php``

.. php:class:: Shell($stdout = null, $stderr = null, $stdin = null)

    Shell is the base class for all shells, and provides a number of functions for
    interacting with user input, outputting text a generating errors.

.. php:attr:: tasks

    An array of tasks you want loaded for this shell/task.

.. php:attr:: uses

    An array of models that should be loaded for this shell/task.

.. php:method:: clear()

    Clears the current output being displayed.

.. php:method:: createFile($path, $contents)

    :param string $path: Absolute path to the file you want to create.
    :param string $contents: Contents to put in the file.

    Creates a file at a given path. If the Shell is interactive, a warning will be
    generated, and the user asked if they want to overwrite the file if it already exists.
    If the shell's interactive property is false, no question will be asked and the file
    will simply be overwritten.

.. php:method:: dispatchShell()

    Dispatch a command to another Shell. Similar to
    :php:meth:`Controller::requestAction()` but intended for running shells
    from other shells.

    See :ref:`invoking-other-shells-from-your-shell`.

.. php:method:: err($message = null, $newlines = 1)

    :param string $method: The message to print.
    :param integer $newlines: The number of newlines to follow the message.

    Outputs a method to ``stderr``, works similar to :php:meth:`Shell::out()`

.. php:method:: error($title, $message = null)

    :param string $title: Title of the error
    :param string $message: An optional error message

    Displays a formatted error message and exits the application with status
    code 1

.. php:method:: getOptionParser()

    Should return a :php:class:`ConsoleOptionParser` object, with any
    sub-parsers for the shell.

.. php:method:: hasMethod($name)

    Check to see if this shell has a callable method by the given name.

.. php:method:: hasTask($task)

    Check to see if this shell has a task with the provided name.

.. php:method:: hr($newlines = 0, $width = 63)

    :param int $newlines: The number of newlines to precede and follow the line.
    :param int $width: The width of the line to draw.

    Create a horizontal line preceded and followed by a number of newlines.

.. php:method:: in($prompt, $options = null, $default = null)

    :param string $prompt: The prompt to display to the user.
    :param array $options: An array of valid choices the user can pick from.
       Picking an invalid option will force the user to choose again.
    :param string $default: The default option if there is one.

    This method helps you interact with the user, and create interactive shells.
    It will return the users answer to the prompt, and allows you to provide a
    list of valid options the user can choose from::

        $selection = $this->in('Red or Green?', array('R', 'G'), 'R');

    The selection validation is case-insensitive.

.. php:method:: initialize()

    Initializes the Shell acts as constructor for subclasses allows
    configuration of tasks prior to shell execution.

.. php:method:: loadTasks()

    Loads tasks defined in public :php:attr:`Shell::$tasks`

.. php:method:: nl($multiplier = 1)

    :param int $multiplier Number of times the linefeed sequence should be repeated

    Returns a number of linefeed sequences.

.. php:method:: out($message = null, $newlines = 1, $level = Shell::NORMAL)

    :param string $method: The message to print.
    :param integer $newlines: The number of newlines to follow the message.
    :param integer $level: The highest :ref:`shell-output-level` this message
        should display at.

    The primary method for generating output to the user. By using levels, you
    can limit how verbose a shell is. out() also allows you to use colour formatting
    tags, which will enable coloured output on systems that support it. There are
    several built-in styles for colouring text, and you can define your own.

    * ``error`` Error messages.
    * ``warning`` Warning messages.
    * ``info`` Informational messages.
    * ``comment`` Additional text.
    * ``question`` Magenta text used for user prompts

    By formatting messages with style tags you can display styled output::

        $this->out(
            '<warning>This will remove data from the filesystems.</warning>'
        );

    By default on \*nix systems ConsoleOutput objects default to colour output.
    On windows systems, plain output is the default unless the ``ANSICON`` environment
    variable is present.

.. php:method:: runCommand($command, $argv)

    Runs the Shell with the provided argv.

    Delegates calls to Tasks and resolves methods inside the class. Commands
    are looked up with the following order:

    - Method on the shell.
    - Matching task name.
    - main() method.

    If a shell implements a main() method, all missing method calls will be
    sent to main() with the original method name in the argv.

.. php:method:: shortPath($file)

    Makes absolute file path easier to read.

.. php:method:: startup()

    Starts up the Shell and displays the welcome message. Allows for checking
    and configuring prior to command or main execution.

    Override this method if you want to remove the welcome information, or
    otherwise modify the pre-command flow.

.. php:method:: wrapText($text, $options = array())

    Wrap a block of text. Allows you to set the width, and indenting on a
    block of text.

    :param string $text: The text to format
    :param array $options:

        * ``width`` The width to wrap to. Defaults to 72
        * ``wordWrap`` Only wrap on words breaks (spaces) Defaults to true.
        * ``indent`` Indent the text with the string provided. Defaults to null.

More topics
===========

.. toctree::
    :maxdepth: 1

    console-and-shells/cron-jobs
    console-and-shells/completion-shell
    console-and-shells/code-generation-with-bake
    console-and-shells/schema-management-and-migrations
    console-and-shells/i18n-shell
    console-and-shells/acl-shell
    console-and-shells/testsuite-shell
    console-and-shells/upgrade-shell


.. meta::
    :title lang=en: Console and Shells
    :keywords lang=en: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
