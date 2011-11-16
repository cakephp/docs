Coding Standards
################

Cake Developers will use the following coding standards.

It is recommended that others developing CakeIngredients follow the same
standards.

Adding new features
===================

No new features should be added, without having their own tests – which
should be passed before committing them to the repository.

Indentation
===========

One tab will be used for indentation.

So, indentation should look like this::

    <?php
    // base level
        // level 1
            // level 2
        // level 1
    // base level

Or::

    <?php
    $booleanVariable = true;
    $stringVariable = "moose";
    if ($booleanVariable) {
        echo "Boolean value is true";
        if ($stringVariable == "moose") {
            echo "We have encountered a moose";
        }
    }

Control Structures
==================

Control structures are for example "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. Below, an example with "``if``"::

    <?php 
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

::

    <?php 
    // wrong = no brackets, badly placed statement
    if (expr) statement; 

    // wrong = no brackets
    if (expr) 
        statement; 

    // good
    if (expr) {
        statement;
    }

Ternary Operator
----------------

Ternary operators are permissible when the entire ternary operation fits
on one line. Longer ternaries should be split into ``if else``
statements. Ternary operators should not ever be nested. Optionally
parentheses can be used around the condition check of the ternary for
clarity::

    <?php
    //Good, simple and readable
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //Nested ternaries are bad
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

Function Calls
==============

Functions should be called without space between function's name and
starting bracket. There should be one space between every parameter of a
function call::

    <?php 
    $var = foo($bar, $bar2, $bar3); 

As you can see above there should be one space on both sides of equals
sign (=).

Method definition
=================

Example of a function definition::

    <?php 
    function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }

Parameters with a default value, should be placed last in function
definition. Try to make your functions return something, at least true
or false = so it can be determined whether the function call was
successful::

    <?php 
    function connection($dns, $persistent = false) {
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

Commenting code
===============

All comments should be written in English, and should in a clear way
describe the commented block of code.

Comments can include the following `phpDocumentor <http://phpdoc.org>`_
tags:

*  `@access <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.access.pkg.html>`_
*  `@author <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.author.pkg.html>`_
*  `@copyright <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.copyright.pkg.html>`_
*  `@deprecated <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.deprecated.pkg.html>`_
*  `@example <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.example.pkg.html>`_
*  `@ignore <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.ignore.pkg.html>`_
*  `@internal <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.internal.pkg.html>`_
*  `@link <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.link.pkg.html>`_
*  `@see <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.see.pkg.html>`_
*  `@since <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.since.pkg.html>`_
*  `@tutorial <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.tutorial.pkg.html>`_
*  `@version <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.version.pkg.html>`_

PhpDoc tags are very much like JavaDoc tags in Java. Tags are only
processed if they are the first thing in a DocBlock line, for example::

    <?php
    /**
     * Tag example.
     * @author this tag is parsed, but this @version is ignored
     * @version 1.0 this tag is also parsed
     */

::

    <?php 
    /**
     * Example of inline phpDoc tags.
     *
     * This function works hard with foo() to rule the world.
     */
    function bar() {
    }
     
    /**
     * Foo function
     */
    function foo() {
    }

Comment blocks, with the exception of the first block in a file, should
always be preceded by a newline.

Including files
===============

When including files with classes or libraries, use only and always the
`require\_once <http://php.net/require_once>`_ function.

PHP tags
========

Always use long tags (``<?php ?>``) Instead of short tags (<? ?>).

Naming convention
=================

Functions
---------

Write all functions in camelBack::

    <?php
    function longFunctionName() {
    }

Classes
-------

Class names should be written in CamelCase, for example::

    <?php
    class ExampleClass {
    }

Variables
---------

Variable names should be as descriptive as possible, but also as short
as possible. Normal variables should start with a lowercase letter, and
should be written in camelBack in case of multiple words. Variables
containing objects should start with a capital letter, and in some way
associate to the class the variable is an object of. Example::

    <?php
    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $Dispatcher = new Dispatcher();

Member visibility
-----------------

Use PHP5's private and protected keywords for methods and variables.  Additionally,
protected method or variable names start with a single underscore ("\_"). Example::

    <?php
    class A {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod() {
           /*...*/
        }
    }

Private methods or variable names start with double underscore ("\_\_"). Example::

    <?php
    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /*...*/
        }
    }

Method Chaining
---------------

Method chaining should have multiple methods spread across separate lines, and
indented with one tab::

    <?php
    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

Example addresses
-----------------

For all example URL and mail addresses use "example.com", "example.org"
and "example.net", for example:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

The ``example.com`` domain name has been reserved for this (see :rfc:`2606`) and is recommended
for use in documentation or as examples.

Files
-----

File names which do not contain classes should be lowercased and underscored, for
example:

::

    long_file_name.php

Variable types
--------------

Variable types for use in DocBlocks:

Type
    Description
mixed
    A variable with undefined (or multiple) type.
integer
    Integer type variable (whole number).
float
    Float type (point number).
boolean
    Logical type (true or false).
string
    String type (any value in "" or ' ').
array
    Array type.
object
    Object type.
resource
    Resource type (returned by for example mysql\_connect()).
    Remember that when you specify the type as mixed, you should indicate
    whether it is unknown, or what the possible types are.

Constants
---------

Constants should be defined in capital letters:

::

    <?php
    define('CONSTANT', 1);

If a constant name consists of multiple words, they should be separated
by an underscore character, for example:

::

    <?php
    define('LONG_NAMED_CONSTANT', 2);


.. meta::
    :title lang=en: Coding Standards
    :keywords lang=en: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers