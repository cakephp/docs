String
######

.. php:class:: String

The String class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
``String::uuid()``.

.. php:staticmethod:: uuid()

    The uuid method is used to generate unique identifiers as per
    :rfc:`4122`. The uuid is a
    128bit string in the format of
    485fc381-e790-47a3-9794-1337c0a8fe68.

    ::

        String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68


.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

    Tokenizes a string using ``$separator``, ignoring any instance of
    ``$separator`` that appears between ``$leftBound`` and ``$rightBound``.

    This method can be useful when splitting up data in that has regular
    formatting such as tag lists::
        
        <?php
        $data = "cakephp 'great framework' php";
        $result = String::tokenize($data, ' ', "'", "'");
        // result contains
        array('cakephp', "'great framework'", 'php');

.. php:staticmethod:: insert($string, $data, $options = array())

    The insert method is used to create string templates and to allow
    for key/value replacements::

        String::insert('My name is :name and I am :age years old.', array('name' => 'Bob', 'age' => '65'));
        // generates: "My name is Bob and I am 65 years old."

.. php:staticmethod:: cleanInsert($string, $options = array())

    Cleans up a ``String::insert`` formatted string with given $options
    depending on the 'clean' key in $options. The default method used
    is text but html is also available. The goal of this function is to
    replace all whitespace and unneeded markup around placeholders that
    did not get replaced by Set::insert.

    You can use the following options in the options array::

        <?php
        $options = array(
            'clean' => array(
                'method' => 'text', // or html
            ),

            'before' => '',
            'after' => ''
        );

.. php:staticmethod:: wrap($text, $options = array())

    Wraps a block of text to a set width, and indent blocks as well.
    Can intelligently wrap text so words are not sliced across lines::

        <?php
        $text = 'This is the song that never ends.';
        $result = String::wrap($text, 22);

        // returns
        This is the song 
        that never ends.

    You can provide an array of options that control how wrapping is done.  The
    supported options are:

    * ``width`` The width to wrap to. Defaults to 72.
    * ``wordWrap`` Whether or not to wrap whole words. Defaults to true.
    * ``indent`` The character to indent lines with. Defaults to ''.
    * ``indentAt`` The line number to start indenting text. Defaults to 0.







.. meta::
    :title lang=en: String
    :keywords lang=en: array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates