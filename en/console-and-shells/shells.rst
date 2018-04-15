Shells
######

.. php:namespace:: Cake\Console

.. php:class:: Shell

.. deprecated:: 3.6.0
    Shells are deprecated as of 3.6.0, but will not be removed until 5.x

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

Using Models in Your Shells
===========================

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
       'command' => 'schema create Blog --plugin Blog',
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

    // Using a command array
    $this->dispatchShell([
       'command' => ['schema', 'create', 'Blog', '--plugin', 'Blog'],
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

Parameters passed through ``extra`` will be merged in the ``Shell::$params``
property and are accessible with the ``Shell::param()`` method.
By default, a ``requested`` extra param is automatically added when a Shell
is dispatched using ``dispatchShell()``. This ``requested`` parameter prevents
the CakePHP console welcome message from being displayed on dispatched shells.

Parsing CLI Options
===================

Shells use :doc:`/console-and-shells/option-parsers` to define their options,
arguments and automate help generation.

Interacting with Input/Output
=============================

Shells allow you to access a ``ConsoleIo`` instance via the ``getIo()`` method.
See the :doc:`/console-and-shells/input-output` section for more information.

In addition to the ``ConsoleIo`` object, Shell classes offer a suite of shortcut
methods. These methods are shortcuts and aliases to those found on ``ConsoleIo``::

    // Get arbitrary text from the user.
    $color = $this->in('What color do you like?');

    // Get a choice from the user.
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

    // Create a file
    $this->createFile('bower.json', $stuff);

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
======================

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

    Avoid exit codes 64 - 78, as they have specific meanings described by
    ``sysexits.h``.
    Avoid exit codes above 127, as these are used to indicate process exit
    by signal, such as SIGKILL or SIGSEGV.
