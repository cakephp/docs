Coding Standards
################

CakePHP developers will use the following coding standards.

It is recommended that others developing CakeIngredients follow the same
standards.

You can use the `CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ to check that your code
follows required standards.

Language
========

All code and comments should be written in English.

Adding New Features
===================

No new features should be added, without having their own tests – which
should be passed before committing them to the repository.

Indentation
===========

One tab will be used for indentation.

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

In cases where you're using a multi-line function call use the following guidelines:

*  Opening parenthesis of a multi-line function call must be the last content on the line.
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

It is recommended to keep lines at approximately 100 characters long for better code readability.
Lines must not be longer than 120 characters.

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

*  In the control structures there should be 1 (one) space before the
   first parenthesis and 1 (one) space between the last parenthesis and
   the opening bracket.
*  Always use curly brackets in control structures, even if they are not
   needed. They increase the readability of the code, and they give you
   fewer logical errors.
*  Opening curly brackets should be placed on the same line as the
   control structure. Closing curly brackets should be placed on new
   lines, and they should have same indentation level as the control
   structure. The statement included in curly brackets should begin on a
   new line, and code contained within it should gain a new level of
   indentation.
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

Ternary operators are permissible when the entire ternary operation fits
on one line. Longer ternaries should be split into ``if else``
statements. Ternary operators should not ever be nested. Optionally
parentheses can be used around the condition check of the ternary for
clarity::

    // Good, simple and readable
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Nested ternaries are bad
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


View Files
----------

In view files (.ctp files) developers should use keyword control structures.
Keyword control structures are easier to read in complex view files. Control
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

We allow PHP closing tags (``?>``) at the end of .ctp files.

Comparison
==========

Always try to be as strict as possible. If a none strict test is deliberate it might be wise to
comment it as such to avoid confusing it for a mistake.

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

Functions should be called without space between function's name and
starting bracket. There should be one space between every parameter of a
function call::

    $var = foo($bar, $bar2, $bar3);

As you can see above there should be one space on both sides of equals
sign (=).

Method Definition
=================

Example of a method definition::

    public function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }

Parameters with a default value, should be placed last in function
definition. Try to make your functions return something, at least ``true``
or ``false``, so it can be determined whether the function call was
successful::

    public function connection($dns, $persistent = false) {
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

Arguments that expect objects or arrays can be typehinted::

    /**
     * Some method description.
     *
     * @param Model $Model The model to use.
     * @param array $array Some array value.
     * @param bool $boolean Some boolean value.
     */
    public function foo(Model $Model, array $array, $boolean) {
    }

Here ``$Model`` must be an instance of ``Model`` and ``$array`` must be an ``array``.

Note that if you want to allow ``$array`` to be also an instance of ``ArrayObject``
you should not typehint as ``array`` accepts only the primitive type::

    /**
     * Some method description.
     *
     * @param array|ArrayObject $array Some array value.
     */
    public function foo($array) {
    }

Method Chaining
===============

Method chaining should have multiple methods spread across separate lines, and
indented with one tab::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

DocBlocks
=========

All comment blocks, with the exception of the first block in a file, should
always be preceded by a newline.

File Header DocBlock
--------------------

All PHP files should contain a file header DocBlock,
which should look like this::

    <?php
    /**
    * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
    * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
    *
    * Licensed under The MIT License
    * For full copyright and license information, please see the LICENSE.txt
    * Redistributions of files must retain the above copyright notice.
    *
    * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
    * @link          https://cakephp.org CakePHP(tm) Project
    * @since         X.Y.Z
    * @license       http://www.opensource.org/licenses/mit-license.php MIT License
    */

The included `phpDocumentor <https://phpdoc.org>`_ tags are:

*  `@copyright <https://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@license <https://phpdoc.org/docs/latest/references/phpdoc/tags/license.html>`_

Class DocBlocks
---------------

Class DocBlocks should look like this::

    /**
     * Short description of the class.
     *
     * Long description of class.
     * Can use multiple lines.
     *
     * @deprecated 3.0.0 Deprecated in 2.6.0. Will be removed in 3.0.0. Use Bar instead.
     * @see Bar
     * @link https://book.cakephp.org/2.0/en/foo.html
     */
    class Foo {

    }

Class DocBlocks may contain the following `phpDocumentor <https://phpdoc.org>`_ tags:

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version`` and ``description`` are mandatory.
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@property <https://phpdoc.org/docs/latest/references/phpdoc/tags/property.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@uses <https://phpdoc.org/docs/latest/references/phpdoc/tags/uses.html>`_

Property DocBlocks
------------------

Property DocBlocks should look like this::

    /**
     * @var string|null Description of property.
     *
     * @deprecated 3.0.0 Deprecated as of 2.5.0. Will be removed in 3.0.0. Use $_bla instead.
     * @see Bar::$_bla
     * @link https://book.cakephp.org/2.0/en/foo.html#properties
     */
    protected $_bar = null;

Property DocBlocks may contain the following `phpDocumentor <https://phpdoc.org>`_ tags:

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version`` and ``description`` are mandatory.
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@var <https://phpdoc.org/docs/latest/references/phpdoc/tags/var.html>`_

Method/Function DocBlocks
-------------------------

Method and functions DocBlocks should look like this::

    /**
     * Short description of the method.
     *
     * Long description of method.
     * Can use multiple lines.
     *
     * @param string $param2 first parameter.
     * @param array|null $param2 Second parameter.
     * @return array An array of cakes.
     * @throws Exception If something goes wrong.
     *
     * @link https://book.cakephp.org/2.0/en/foo.html#bar
     * @deprecated 3.0.0 Deprecated as of 2.5.0. Will be removed in 3.0.0. Use Bar::baz instead.
     * @see Bar::baz
     */
     public function bar($param1, $param2 = null) {
     }

Method and function DocBLocks may contain the following `phpDocumentor <https://phpdoc.org>`_ tags:

*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version`` and ``description`` are mandatory.
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@param <https://phpdoc.org/docs/latest/references/phpdoc/tags/param.html>`_
*  `@return <https://phpdoc.org/docs/latest/references/phpdoc/tags/return.html>`_
*  `@throws <https://phpdoc.org/docs/latest/references/phpdoc/tags/throws.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@uses <https://phpdoc.org/docs/latest/references/phpdoc/tags/uses.html>`_

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

When returning the object itself, e.g. for chaining, one should use ``$this`` instead::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo() {
        return $this;
    }

Including Files
===============

``include``, ``require``, ``include_once`` and ``require_once`` do not have parentheses::

    // wrong = parentheses
    require_once('ClassFileName.php');
    require_once ($class);

    // good = no parentheses
    require_once 'ClassFileName.php';
    require_once $class;

When including files with classes or libraries, use only and always the
`require\_once <https://secure.php.net/require_once>`_ function.

PHP Tags
========

Always use long tags (``<?php ?>``) Instead of short tags (``<? ?>``).

Naming Convention
=================

Functions
---------

Write all functions in camelBack::

    function longFunctionName() {
    }

Classes
-------

Class names should be written in CamelCase, for example::

    class ExampleClass {
    }

Variables
---------

Variable names should be as descriptive as possible, but also as short
as possible. All variables should start with a lowercase letter, and
should be written in camelBack in case of multiple words. Variables
referencing objects should in some way associate to the class the
variable is an object of. Example::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $dispatcher = new Dispatcher();

Member Visibility
-----------------

Use PHP5's private and protected keywords for methods and variables. Additionally,
protected method or variable names start with a single underscore (``_``). Example::

    class A {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod() {
           /* ... */
        }
    }

Private methods or variable names start with double underscore (``__``). Example::

    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /* ... */
        }
    }

Try to avoid private methods or variables, though, in favor of protected ones.
The latter can be accessed or modified by subclasses, whereas private ones
prevent extension or re-use. Private visibility also makes testing much more difficult.

Example Addresses
-----------------

For all example URL and mail addresses use "example.com", "example.org"
and "example.net", for example:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

The "example.com" domain name has been reserved for this (see :rfc:`2606`) and is recommended
for use in documentation or as examples.

Files
-----

File names which do not contain classes should be lowercased and underscored, for
example::

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

Please use ``(int)$var`` instead of ``intval($var)`` and ``(float)$var`` instead of ``floatval($var)`` when applicable.

Constants
---------

Constants should be defined in capital letters::

    define('CONSTANT', 1);

If a constant name consists of multiple words, they should be separated
by an underscore character, for example::

    define('LONG_NAMED_CONSTANT', 2);


.. meta::
    :title lang=en: Coding Standards
    :keywords lang=en: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers
