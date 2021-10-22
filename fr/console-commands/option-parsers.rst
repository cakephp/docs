Option Parsers
##############

.. php:namespace:: Cake\Console
.. php:class:: ConsoleOptionParser

Console applications typically take options and arguments as the primary way to
get information from the terminal into your commands.

Defining an OptionParser
========================

Commands and Shells provide a ``buildOptionParser($parser)`` hook method that
you can use to define the options and arguments for your commands::

    protected function buildOptionParser($parser)
    {
        // Define your options and arguments.

        // Return the completed parser
        return $parser;
    }

Shell classes use the ``getOptionParser()`` hook method to define their option
parser::

    public function getOptionParser()
    {
        // Get an empty parser from the framework.
        $parser = parent::getOptionParser();

        // Define your options and arguments.

        // Return the completed parser
        return $parser;
    }


Using Arguments
===============

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

Adding Multiple Arguments
-------------------------

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

Using Options
=============

.. php:method:: addOption($name, $options = [])

Options or flags are used in command line tools to provide unordered key/value
arguments for your commands. Options can define both verbose and short aliases.
They can accept a value (e.g ``--connection=default``) or be boolean options
(e.g ``--verbose``). Options are defined with the ``addOption()`` method::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

The above would allow you to use either ``cake myshell --connection=other``,
``cake myshell --connection other``, or ``cake myshell -c other``
when invoking the shell.

Boolean switches do not accept or consume values, and their presence just
enables them in the parsed parameters::

    $parser->addOption('no-commit', ['boolean' => true]);

This option when used like ``cake mycommand --no-commit something`` would have
a value of ``true``, and 'something' would be a treated as a positional
argument.

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

Adding Multiple Options
-----------------------

.. php:method:: addOptions(array $options)

If you have an array with multiple options you can use ``$parser->addOptions()``
to add multiple options at once. ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

As with all the builder methods on ConsoleOptionParser, addOptions can be used
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

Options can be defined as boolean options, which are useful when you need to
create some flag options. Like options with defaults, boolean options always
include themselves into the parsed parameters. When the flags are present they
are set to ``true``, when they are absent they are set to ``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

The following option would always have a value in the parsed parameter. When not
included its default value would be ``false``, and when defined it will be
``true``.

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

Merging Option Parsers
----------------------

.. php:method:: merge($spec)

When building a group command, you maybe want to combine several parsers for
this::

    $parser->merge($anotherParser);

Note that the order of arguments for each parser must be the same, and that
options must also be compatible for it work. So do not use keys for different
things.

Getting Help from Shells
========================

By defining your options and arguments with the option parser CakePHP can
automatically generate rudimentary help information and add a ``--help`` and
``-h`` to each of your commands. Using one of these options will allow you to
see the generated help content:

.. code-block:: console

    bin/cake bake --help
    bin/cake bake -h

Would both generate the help for bake. You can also get help for nested
commands:

.. code-block:: console

    bin/cake bake model --help
    bin/cake bake model -h

The above would get you the help specific to bake's model command.

Getting Help as XML
-------------------

When building automated tools or development tools that need to interact with
CakePHP shells, it's nice to have help available in a machine parse-able format.
By providing the ``xml`` option when requesting help you can have help content
returned as XML:

.. code-block:: console

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

Customizing Help Output
=======================

You can further enrich the generated help content by adding a description, and
epilog.

Set the Description
-------------------

.. php:method:: setDescription($text)

The description displays above the argument and option information. By passing
in either an array or a string, you can set the value of the description::

    // Set multiple lines at once
    $parser->setDescription(['line one', 'line two']);

    // Read the current value
    $parser->getDescription();

Set the Epilog
--------------

.. php:method:: setEpilog($text)

Gets or sets the epilog for the option parser. The epilog is displayed after the
argument and option information. By passing in either an array or a string, you
can set the value of the epilog::

    // Set multiple lines at once
    $parser->setEpilog(['line one', 'line two']);

    // Read the current value
    $parser->getEpilog();
