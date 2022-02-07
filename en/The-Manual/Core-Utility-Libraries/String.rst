String
######

The String class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
``String::uuid()``.

uuid
====

The uuid method is used to generate unique identifiers as per `RFC
4122 <https://www.ietf.org/rfc/rfc4122.txt>`_. The uuid is a 128bit
string in the format of 485fc381-e790-47a3-9794-1337c0a8fe68.

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

``string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound = ')')``

Tokenizes a string using ``$separator``, ignoring any instance of
``$separator`` that appears between ``$leftBound`` and ``$rightBound``.

insert
======

string insert ($string, $data, $options = array())

The insert method is used to create string templates and to allow for
key/value replacements.

::

    String::insert('My name is :name and I am :age years old.', array('name' => 'Bob', 'age' => '65'));
    // generates: "My name is Bob and I am 65 years old."

cleanInsert
===========

string cleanInsert ($string, $options = array())

Cleans up a Set::insert formatted string with given $options depending
on the 'clean' key in $options. The default method used is text but html
is also available. The goal of this function is to replace all
whitespace and unneeded markup around placeholders that did not get
replaced by Set::insert.

You can use the following options in the options array:

::

    $options = array(
        'clean' => array(
            'method' => 'text', // or html
        ),

        'before' => '',
        'after' => ''
    );

