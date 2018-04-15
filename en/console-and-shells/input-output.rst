Command Input/Output
====================

.. php:namespace:: Cake\Console
.. php:class:: ConsoleIo

CakePHP provides the ``ConsoleIo`` object to commands so that they can
interactively read user input and output information to the user.

Command Helpers
===============

Command Helpers can be accessed and used from any command, shell or task::

    // Output some data as a table.
    $io->helper('Table')->output($data);

    // Get a helper from a plugin.
    $io->helper('Plugin.HelperName')->output($data);

You can also get instances of helpers and call any public methods on them::

    // Get and use the Progress Helper.
    $progress = $io->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Creating Helpers
================

While CakePHP comes with a few command helpers you can create more in your
application or plugins. As an example, we'll create a simple helper to generate
fancy headings. First create the **src/Command/Helper/HeadingHelper.php** and put
the following in it::

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

We can then use this new helper in one of our shell commands by calling it::

    // With ### on either side
    $this->helper('Heading')->output(['It works!']);

    // With ~~~~ on either side
    $this->helper('Heading')->output(['It works!', '~', 4]);

Helpers generally implement the ``output()`` method which takes an array of
parameters. However, because Console Helpers are vanilla classes they can
implement additional methods that take any form of arguments.

.. note::
    Helpers can also live in ``src/Shell/Helper`` for backwards compatibility.

Built-In Helpers
================

Table Helper
------------

The TableHelper assists in making well formatted ASCII art tables. Using it is
pretty simple::

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

Progress Helper
---------------

The ProgressHelper can be used in two different ways. The simple mode lets you
provide a callback that is invoked until the progress is complete::

    $io->helper('Progress')->output(['callback' => function ($progress) {
        // Do work here.
        $progress->increment(20);
        $progress->draw();
    }]);

You can control the progress bar more by providing additional options:

- ``total`` The total number of items in the progress bar. Defaults
  to 100.
- ``width`` The width of the progress bar. Defaults to 80.
- ``callback`` The callback that will be called in a loop to advance the
  progress bar.

An example of all the options in use would be::

    $io->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

The progress helper can also be used manually to increment and re-render the
progress bar as necessary::

    $progress = $io->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();


Getting User Input
==================

.. php:method:: ask($question, $choices = null, $default = null)

When building interactive console applications you'll need to get user input.
CakePHP provides an easy way to do this::

    // Get arbitrary text from the user.
    $color = $io->ask('What color do you like?');

    // Get a choice from the user.
    $selection = $io->ask('Red or Green?', ['R', 'G'], 'R');

Selection validation is case-insensitive.

Creating Files
==============

.. php:method:: createFile($path, $contents)

Creating files is often important part of many console commands that help
automate development and deployment. The ``createFile()`` method gives you
a simple interface for creating files with interactive confirmation::

    // Create a file with confirmation on overwrite
    $io->createFile('bower.json', $stuff);

    // Force overwriting without asking
    $io->createFile('bower.json', $stuff, true);

Creating Output
===============

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

Writing to ``stdout`` and ``stderr`` is another routine operation CakePHP makes
easy::

    // Write to stdout
    $io->out('Normal message');

    // Write to stderr
    $io->err('Error message');

In addition to vanilla output methods, CakePHP provides wrapper methods that
style output with appropriate ANSI colours::

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

It also provides two convenience methods regarding the output level::

    // Would only appear when verbose output is enabled (-v)
    $io->verbose('Verbose message');

    // Would appear at all levels.
    $io->quiet('Quiet message');

You can also create blank lines or draw lines of dashes::

    // Output 2 newlines
    $io->out($this->nl(2));

    // Draw a horizontal line
    $io->hr();

Lastly, you can update the current line of text on the screen::

    $io->out('Counting down');
    $io->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $io->overwrite($i, 0, 2);
    }

.. note::
    It is important to remember, that you cannot overwrite text
    once a new line has been output.

.. _shell-output-level:

Output Levels
=============

Console applications often need different levels of verbosity. For example, when
running as a cron job, most output is un-necessary. You can use output levels to
flag output appropriately. The user of the shell, can then decide what level of
detail they are interested in by setting the correct flag when calling the
command. There are 3 levels:

* ``QUIET`` - Only absolutely important information should be marked for quiet
  output.
* ``NORMAL`` - The default level, and normal usage.
* ``VERBOSE`` - Mark messages that may be too noisy for everyday use, but
  helpful for debugging as ``VERBOSE``.

You can mark output as follows::

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

You can control the output level of shells, by using the ``--quiet`` and
``--verbose`` options. These options are added by default, and allow you to
consistently control output levels inside your CakePHP comands.

The ``--quiet`` and ``--verbose`` options also control how logging data is
output to stdout/stderr. Normally info and higher log messages are output to
stdout/stderr. When ``--verbose`` is used, debug logs will be output to stdout.
When ``--quiet`` is used, only warning and higher log messages will be output to
stderr.

Styling Output
==============

Styling output is done by including tags - just like HTML - in your output.
These tags will be replaced with the correct ansi code sequence, or
stripped if you are on a console that doesn't support ansi codes. There
are several built-in styles, and you can create more. The built-in ones are

* ``success`` Success messages. Green text.
* ``error`` Error messages. Red text.
* ``warning`` Warning messages. Yellow text.
* ``info`` Informational messages. Cyan text.
* ``comment`` Additional text. Blue text.
* ``question`` Text that is a question, added automatically by shell.

You can create additional styles using ``$io->styles()``. To declare a
new output style you could do::

    $io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

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
=====================

Although colouring is pretty, there may be times when you want to turn it off,
or force it on::

    $io->outputAs(ConsoleOutput::RAW);

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
