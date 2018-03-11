Console Commands
################

.. php:namespace:: Cake\Console
.. php:class:: Command

CakePHP comes with a number of built-in commands for speeding up your
development, and automating routine tasks. You can use these same libraries to
create commands for your application and plugins.

Creating a Command
==================

Let's create our first Command. For this example, we'll create a
simple Hello world command. In your application's **src/Command** directory create
**HelloCommand.php**. Put the following code inside it::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;

    class HelloCommand extends Command
    {
        public function execute(Arguments $args, ConsoleIo $io)
        {
            $io->out('Hello world.');
        }
    }

Command classes must implement an ``execute()`` method that does the bulk of
their work. This method is called when a command is invoked. Lets call our first
command application directory, run:

.. code-block:: bash

    bin/cake hello

You should see the following output::

    Hello world.

Our ``execute()`` method isn't very interesting let's read some input from the
command line::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class HelloCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser->addArgument('name', [
                'help' => 'What is your name'
            ]);
            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $name = $args->getArgument('name');
            $io->out("Hello {$name}.");
        }
    }


After saving this file, you should be able to run the following command:

.. code-block:: bash

    bin/cake hello jillian

    # Outputs
    Hello jillian

Defining Arguments and Options
==============================

As we saw in the last example, we can use the ``buildOptionParser()`` hook
method to define arguments. We can also define options. For example, we could
add a ``yell`` option to our ``HelloCommand``::

    // ...
    public function buildOptionParser(ConsoleOptionParser $parser)
    {
        $parser
            ->addArgument('name', [
                'help' => 'What is your name'
            ])
            ->addOption('yell', [
                'help' => 'Shout the name',
                'boolean' => true
            ]);

        return $parser;
    }

    public function execute(Arguments $args, ConsoleIo $io)
    {
        $name = $args->getArgument('name');
        if ($args->getOption('yell')) {
            $name = mb_strtoupper($name);
        }
        $io->out("Hello {$name}.");
    }

See the :doc:`/console-and-shells/option-parser` section for more information.

Creating Output
===============

Commands are provided a ``ConsoleIo`` instance when executed. This object allows
you to interact with ``stdout``, ``stderr`` and create files.  See the
:doc:`/console-and-shells/input-output` section for more information.

Using Models in Commands
========================

You'll often need access to your application's business logic in console
commands.  You can load models in commands, just as you would in a controller
using ``loadModel()``. The loaded models are set as properties attached to your
commands::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;

    class UserCommand extends Command
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->addArgument('name', [
                    'help' => 'What is your name'
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $name = $args->getArgument('name');
            $user = $this->Users->findByUsername($name)->first();

            $io->out(print_r($user, true));
        }
    }

The above command, will fetch a user by username and display the information
stored in the database.

Exit Codes and Stopping Execution
=================================

When your commands hit an unrecoverable error you can use the ``abort()`` method
to terminate execution::

    // ...
    public function execute(Arguments $args, ConsoleIo $io)
    {
        $name = $args->getArgument('name');
        if (strlen($name) < 5) {
            // Halt execution, output to stderr, and set exit code to 1
            $io->error('Name must be at least 4 characters long.');
            $this->abort();
        }
    }

You can pass any desired exit code into ``abort()``.

.. tip::

    Avoid exit codes 64 - 78, as they have specific meanings described by
    ``sysexits.h``. Avoid exit codes above 127, as these are used to indicate
    process exit by signal, such as SIGKILL or SIGSEGV.

    You can read more about conventional exit codes in the sysexit manual page
    on most Unix systems (``man sysexits``), or the ``System Error Codes`` help
    page in Windows.

.. _console-integration-testing:

Testing Commands
================

To make testing console applications easier, CakePHP comes with a
``ConsoleIntegrationTestCase`` class that can be used to test console applications
and assert against their results.

.. versionadded:: 3.5.0

    The ``ConsoleIntegrationTestCase`` was added.

To get started testing your console application, create a test case that extends
``Cake\TestSuite\ConsoleIntegrationTestCase``. This class contains a method
``exec()`` that is used to execute your command. You can pass the same string
you would use in the CLI to this method.

Let's start with a very simple command, located in
**src/Shell/UpdatTableCommand.php**::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\Console\Command;

    class UpdateTableCommand extends Shell
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser->setDescription('My cool console app');

            return $parser;
        }
    }

To write an integration test for this shell, we would create a test case in
**tests/TestCase/Command/UpdateTableTest.php** that extends
``Cake\TestSuite\ConsoleIntegrationTestCase``. This shell doesn't do much at the
moment, but let's just test that our shell's description is displayed in ``stdout``::

    namespace App\Test\TestCase\Command;

    use Cake\TestSuite\ConsoleIntegrationTestCase;

    class UpdateTableCommandTest extends ConsoleIntegrationTestCase
    {
        public function setUp()
        {
            parent::setUp();
            $this->useCommandRunner();
        }

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }
    }

Our test passes! While this is very trivial example, it shows that creating an
integration test case for console applications is quite easy. Let's continue by
adding more logic to our command::

    namespace App\Command;

    use Cake\Console\Arguments;
    use Cake\Console\ConsoleIo;
    use Cake\Console\ConsoleOptionParser;
    use Cake\Console\Command;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $table = $args->getArgument('table');
            $this->loadModel($table);
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

This is a more complete shell that has required options and relevant logic.
Modify your test case to the following snippet of code::

    namespace Cake\Test\TestCase\Command;

    use Cake\Console\Command;
    use Cake\I18n\FrozenTime;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\ConsoleIntegrationTestCase;

    class UpdateTableCommandTest extends ConsoleIntegrationTestCase
    {
        public $fixtures = [
            // assumes you have a UsersFixture
            'app.users'
        ];

        public function testDescriptionOutput()
        {
            $this->exec('update_table --help');
            $this->assertOutputContains('My cool console app');
        }

        public function testUpdateModified()
        {
            $now = new FrozenTime('2017-01-01 00:00:00');
            FrozenTime::setTestNow($now);

            $this->loadFixtures('Users');

            $this->exec('update_table Users');
            $this->assertExitCode(Shell::CODE_SUCCESS);

            $user = TableRegistry::get('Users')->get(1);
            $this->assertSame($user->modified->timestamp, $now->timestamp);

            FrozenTime::setTestNow(null);
        }
    }

As you can see from the ``testUpdateModified`` method, we are testing that our
command updates the table that we are passing as the first argument. First, we
assert that the command exited with the proper status code, ``0``. Then we check
that our command did its work, that is, updated the table we provided and set
the ``modified`` column to the current time.

Remember, ``exec()`` will take the same string you type into your CLI, so you
can include options and arguments in your command string.

Testing Interactive Shells
--------------------------

Consoles are often interactive. Testing interactive shells with the
``Cake\TestSuite\ConsoleIntegrationTestCase`` class only requires passing the
inputs you expect as the second parameter of ``exec()``. They should be
included as an array in the order that you expect them.

Continuing with our example command, let's add an interactive confirmation.
Update the command class to the following::

    namespace App\Command;

    use Cake\Console\ConsoleOptionParser;
    use Cake\Console\Shell;
    use Cake\I18n\FrozenTime;

    class UpdateTableCommand extends Command
    {
        public function buildOptionParser(ConsoleOptionParser $parser)
        {
            $parser
                ->setDescription('My cool console app')
                ->addArgument('table', [
                    'help' => 'Table to update',
                    'required' => true
                ]);

            return $parser;
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $table = $args->getArgument('table');
            $this->loadModel($table);
            if ($io->ask('Are you sure?', 'n', ['y', 'n']) === 'n') {
                $io->error('You need to be sure.');
                $this->abort();
            }
            $this->{$table}->query()
                ->update()
                ->set([
                    'modified' => new FrozenTime()
                ])
                ->execute();
        }
    }

Now that we have an interactive subcommand, we can add a test case that tests
that we receive the proper response, and one that tests that we receive an
incorrect response. Remove the ``testUpdateModifed`` mehod and, add the following methods to
**tests/TestCase/Shell/UpdateTableCommandTest.php**::


    public function testUpdateModifiedSure()
    {
        $now = new FrozenTime('2017-01-01 00:00:00');
        FrozenTime::setTestNow($now);

        $this->loadFixtures('Users');

        $this->exec('update_table Users', ['y']);
        $this->assertExitCode(Command::CODE_SUCCESS);

        $user = TableRegistry::get('Users')->get(1);
        $this->assertSame($user->modified->timestamp, $now->timestamp);

        FrozenTime::setTestNow(null);
    }

    public function testUpdateModifiedUnsure()
    {
        $user = TableRegistry::get('Users')->get(1);
        $original = $user->modified->timestamp;

        $this->exec('my_console best_framework', ['n']);
        $this->assertExitCode(Command::CODE_ERROR);
        $this->assertErrorContains('You need to be sure.');

        $user = TableRegistry::get('Users')->get(1);
        $this->assertSame($original, $user->timestamp);
    }

In the first test case, we confirm the question, and records are updated. In the
second test we don't confirm and records are not updated, and we can check that
our error message was written to ``stderr``.


Testing the CommandRunner
-------------------------

To test shells that are dispatched using the ``CommandRunner`` class, enable it
in your test case with the following method::

    $this->useCommandRunner();

.. versionadded:: 3.5.0

    The ``CommandRunner`` class was added.

Assertion methods
-----------------

The ``Cake\TestSuite\ConsoleIntegrationTestCase`` class provides a number of
assertion methods that make it easy to assert against console output::

    // assert that the shell exited with the expected code
    $this->assertExitCode($expected);

    // assert that stdout contains a string
    $this->assertOutputContains($expected);

    // assert that stderr contains a string
    $this->assertErrorContains($expected);

    // assert that stdout matches a regular expression
    $this->assertOutputRegExp($expected);

    // assert that stderr matches a regular expression
    $this->assertErrorRegExp($expected);
