Coding Standards
################

CakePHP developers will use the `PSR-2 coding style guide
<http://www.php-fig.org/psr/psr-2/>`_ in addition to the following rules as
coding standards.

It is recommended that others developing CakeIngredients follow the same
standards.

You can use the `CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ to check that your code
follows required standards.

Adding New Features
===================

No new features should be added, without having their own tests – which
should be passed before committing them to the repository.

IDE Setup
=========

Please make sure your IDE is set up to "trim right" on whitespaces.
There should be no trailing spaces per line.

Most modern IDEs also support an ``.editorconfig`` file. The CakePHP app
skeleton ships with it by default. It already contains best practise defaults.

We recommend to use the `IdeHelper <https://github.com/dereuromark/cakephp-ide-helper>`_ plugin if you
want to maximize IDE compatibility. It will assist to keep the annotations up-to-date which will make
the IDE fully understand how all classes work together and provides better type-hinting and auto-completion.

Indentation
===========

Four spaces will be used for indentation.

So, indentation should look like this::

    // base level
        // level 1
            // level 2
        // level 1
    // base level

Or::

    $booleanVariable = true;
    $stringVariable = 'moose';
    if ($booleanVariable) {
        echo 'Boolean value is true';
        if ($stringVariable === 'moose') {
            echo 'We have encountered a moose';
        }
    }

In cases where you're using a multi-line function call use the following
guidelines:

*  Opening parenthesis of a multi-line function call must be the last content on
   the line.
*  Only one argument is allowed per line in a multi-line function call.
*  Closing parenthesis of a multi-line function call must be on a line by itself.

As an example, instead of using the following formatting::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

Use this instead::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

Line Length
===========

It is recommended to keep lines at approximately 100 characters long for better
code readability. A limit of 80 or 120 characters makes it necessary to
distribute complex logic or expressions by function, as well as give functions
and objects shorter, more expressive names. Lines must not be
longer than 120 characters.

In short:

* 100 characters is the soft limit.
* 120 characters is the hard limit.

Control Structures
==================

Control structures are for example "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. Below, an example with "``if``"::

    if ((expr_1) || (expr_2)) {
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2;
    } else {
        // default_action;
    }

*  In the control structures there should be 1 (one) space before the first
   parenthesis and 1 (one) space between the last parenthesis and the opening
   bracket.
*  Always use curly brackets in control structures, even if they are not needed.
   They increase the readability of the code, and they give you fewer logical
   errors.
*  Opening curly brackets should be placed on the same line as the control
   structure. Closing curly brackets should be placed on new lines, and they
   should have same indentation level as the control structure. The statement
   included in curly brackets should begin on a new line, and code contained
   within it should gain a new level of indentation.
*  Inline assignments should not be used inside of the control structures.

::

    // wrong = no brackets, badly placed statement
    if (expr) statement;

    // wrong = no brackets
    if (expr)
        statement;

    // good
    if (expr) {
        statement;
    }

    // wrong = inline assignment
    if ($variable = Class::function()) {
        statement;
    }

    // good
    $variable = Class::function();
    if ($variable) {
        statement;
    }

Ternary Operator
----------------

Ternary operators are permissible when the entire ternary operation fits on one
line. Longer ternaries should be split into ``if else`` statements. Ternary
operators should not ever be nested. Optionally parentheses can be used around
the condition check of the ternary for clarity::

    // Good, simple and readable
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Nested ternaries are bad
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


Template Files
--------------

In template files (.ctp files) developers should use keyword control structures.
Keyword control structures are easier to read in complex template files. Control
structures can either be contained in a larger PHP block, or in separate PHP
tags::

    <?php
    if ($isAdmin):
        echo '<p>You are the admin user.</p>';
    endif;
    ?>
    <p>The following is also acceptable:</p>
    <?php if ($isAdmin): ?>
        <p>You are the admin user.</p>
    <?php endif; ?>


Comparison
==========

Always try to be as strict as possible. If a non-strict test is deliberate it
might be wise to comment it as such to avoid confusing it for a mistake.

For testing if a variable is null, it is recommended to use a strict check::

    if ($value === null) {
        // ...
    }

The value to check against should be placed on the right side::

    // not recommended
    if (null === $this->foo()) {
        // ...
    }

    // recommended
    if ($this->foo() === null) {
        // ...
    }

Function Calls
==============

Functions should be called without space between function's name and starting
parenthesis. There should be one space between every parameter of a function
call::

    $var = foo($bar, $bar2, $bar3);

As you can see above there should be one space on both sides of equals sign (=).

Method Definition
=================

Example of a method definition::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }

        return $var;
    }

Parameters with a default value, should be placed last in function definition.
Try to make your functions return something, at least ``true`` or ``false``, so
it can be determined whether the function call was successful::

    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this->addError();
        }

        return true;
    }

There are spaces on both side of the equals sign.

Typehinting
-----------

Arguments that expect objects, arrays or callbacks (callable) can be typehinted.
We only typehint public methods, though, as typehinting is not cost-free::

    /**
     * Some method description.
     *
     * @param \Cake\ORM\Table $table The table class to use.
     * @param array $array Some array value.
     * @param callable $callback Some callback.
     * @param bool $boolean Some boolean value.
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

Here ``$table`` must be an instance of ``\Cake\ORM\Table``, ``$array`` must be
an ``array`` and ``$callback`` must be of type ``callable`` (a valid callback).

Note that if you want to allow ``$array`` to be also an instance of
``\ArrayObject`` you should not typehint as ``array`` accepts only the primitive
type::

    /**
     * Some method description.
     *
     * @param array|\ArrayObject $array Some array value.
     */
    public function foo($array)
    {
    }

Anonymous Functions (Closures)
------------------------------

Defining anonymous functions follows the `PSR-2
<http://www.php-fig.org/psr/psr-2/>`_ coding style guide, where they are
declared with a space after the `function` keyword, and a space before and after
the `use` keyword::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // code
    };

Method Chaining
===============

Method chaining should have multiple methods spread across separate lines, and
indented with four spaces::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

Commenting Code
===============

All comments should be written in English, and should in a clear way describe
the commented block of code.

Comments can include the following `phpDocumentor <http://phpdoc.org>`_
tags:

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version``
   and ``description`` are mandatory. Version refers to the one it got deprecated in.
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

PhpDoc tags are very much like JavaDoc tags in Java. Tags are only processed if
they are the first thing in a DocBlock line, for example::

    /**
     * Tag example.
     *
     * @author this tag is parsed, but this @version is ignored
     * @version 1.0 this tag is also parsed
     */

::

    /**
     * Example of inline phpDoc tags.
     *
     * This function works hard with foo() to rule the world.
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Foo function.
     *
     * @return void
     */
    function foo()
    {
    }

Comment blocks, with the exception of the first block in a file, should always
be preceded by a newline.

Variable Types
--------------

Variable types for use in DocBlocks:

Type
    Description
mixed
    A variable with undefined (or multiple) type.
int
    Integer type variable (whole number).
float
    Float type (point number).
bool
    Logical type (true or false).
string
    String type (any value in " " or ' ').
null
    Null type. Usually used in conjunction with another type.
array
    Array type.
object
    Object type. A specific class name should be used if possible.
resource
    Resource type (returned by for example mysql\_connect()).
    Remember that when you specify the type as mixed, you should indicate
    whether it is unknown, or what the possible types are.
callable
    Callable function.

You can also combine types using the pipe char::

    int|bool

For more than two types it is usually best to just use ``mixed``.

When returning the object itself, e.g. for chaining, one should use ``$this``
instead::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

Including Files
===============

``include``, ``require``, ``include_once`` and ``require_once`` do not have
parentheses::

    // wrong = parentheses
    require_once('ClassFileName.php');
    require_once ($class);

    // good = no parentheses
    require_once 'ClassFileName.php';
    require_once $class;

When including files with classes or libraries, use only and always the
`require\_once <http://php.net/require_once>`_ function.

PHP Tags
========

Always use long tags (``<?php ?>``) instead of short tags (``<? ?>``). The short
echo should be used in template files (**.ctp**) where appropriate.

Short Echo
----------

The short echo should be used in template files in place of ``<?php echo``. It
should be immediately followed by a single space, the variable or function value
to ``echo``, a single space, and the php closing tag::

    // wrong = semicolon, no spaces
    <td><?=$name;?></td>

    // good = spaces, no semicolon
    <td><?= $name ?></td>

As of PHP 5.4 the short echo tag (``<?=``) is no longer to be consider a 'short
tag' is always available regardless of the ``short_open_tag`` ini directive.

Naming Convention
=================

Functions
---------

Write all functions in camelBack::

    function longFunctionName()
    {
    }

Classes
-------

Class names should be written in CamelCase, for example::

    class ExampleClass
    {
    }

Variables
---------

Variable names should be as descriptive as possible, but also as short as
possible. All variables should start with a lowercase letter, and should be
written in camelBack in case of multiple words. Variables referencing objects
should in some way associate to the class the variable is an object of.
Example::

    $user = 'John';
    $users = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

Member Visibility
-----------------

Use PHP's ``public``, ``protected`` and ``private`` keywords for methods and variables.

Example Addresses
-----------------

For all example URL and mail addresses use "example.com", "example.org" and
"example.net", for example:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

The "example.com" domain name has been reserved for this (see :rfc:`2606`) and
is recommended for use in documentation or as examples.

Files
-----

File names which do not contain classes should be lowercased and underscored,
for example::

    long_file_name.php

Casting
-------

For casting we use:

Type
    Description
(bool)
    Cast to boolean.
(int)
    Cast to integer.
(float)
    Cast to float.
(string)
    Cast to string.
(array)
    Cast to array.
(object)
    Cast to object.

Please use ``(int)$var`` instead of ``intval($var)`` and ``(float)$var`` instead
of ``floatval($var)`` when applicable.

Constants
---------

Constants should be defined in capital letters::

    define('CONSTANT', 1);

If a constant name consists of multiple words, they should be separated by an
underscore character, for example::

    define('LONG_NAMED_CONSTANT', 2);

Careful when using empty()/isset()
==================================

While ``empty()`` is an easy to use function, it can mask errors and cause
unintended effects when ``'0'`` and ``0`` are given. When variables or
properties are already defined, the usage of ``empty()`` is not recommended.
When working with variables, it is better to rely on type-coercion to boolean
instead of ``empty()``::

    function manipulate($var)
    {
        // Not recommended, $var is already defined in the scope
        if (empty($var)) {
            // ...
        }

        // Use boolean type coercion
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

When dealing with defined properties you should favour ``null`` checks over
``empty()``/``isset()`` checks::

    class Thing
    {
        private $property; // Defined

        public function readProperty()
        {
            // Not recommended as the property is defined in the class
            if (!isset($this->property)) {
                // ...
            }
            // Recommended
            if ($this->property === null) {

            }
        }
    }

When working with arrays, it is better to merge in defaults over using
``empty()`` checks. By merging in defaults, you can ensure that required keys
are defined::

    function doWork(array $array)
    {
        // Merge defaults to remove need for empty checks.
        $array += [
            'key' => null,
        ];

        // Not recommended, the key is already set
        if (isset($array['key'])) {
            // ...
        }

        // Recommended
        if ($array['key'] !== null) {
            // ...
        }
    }

.. meta::
    :title lang=en: Coding Standards
    :keywords lang=en: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers
