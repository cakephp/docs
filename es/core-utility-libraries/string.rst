String
######

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:namespace:: Cake\Utility

.. php:class:: String

The String class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
``String::uuid()``.

If you need :php:class:`Cake\\View\\Helper\\TextHelper` functionalities outside
of a ``View``, use the ``String`` class::

    namespace App\Controller;

    use Cake\Utility\String;

    class UsersController extends AppController
    {

        public $components = array('Auth');

        public function afterLogin()
        {
            $message = $this->User->find('new_message');
            if (!empty($message)) {
                // Notify user of new message
                $this->Flash->success(__(
                    'You have a new message: {0}',
                    String::truncate($message['Message']['body'], 255, array('html' => true))
                ));
            }
        }
    }

Generating UUIDs
================

.. php:staticmethod:: uuid()

The UUID method is used to generate unique identifiers as per :rfc:`4122`. The
UUID is a 128bit string in the format of 485fc381-e790-47a3-9794-1337c0a8fe68. ::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68


Simple String Parsing
=====================

.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

Tokenizes a string using ``$separator``, ignoring any instance of
``$separator`` that appears between ``$leftBound`` and ``$rightBound``.

This method can be useful when splitting up data in that has regular
formatting such as tag lists::

    $data = "cakephp 'great framework' php";
    $result = String::tokenize($data, ' ', "'", "'");
    // Result contains
    array('cakephp', "'great framework'", 'php');

.. php:method:: parseFileSize(string $size, $default)

This method unformats a number from a human readable byte size
to an integer number of bytes::

    $int = String::parseFileSize('2GB');

Formatting Strings
==================

.. php:staticmethod:: insert($string, $data, $options = array())

The insert method is used to create string templates and to allow
for key/value replacements::

    String::insert(
        'My name is :name and I am :age years old.',
        array('name' => 'Bob', 'age' => '65')
    );
    // Returns: "My name is Bob and I am 65 years old."

.. php:staticmethod:: cleanInsert($string, $options = array())

Cleans up a ``String::insert`` formatted string with given $options
depending on the 'clean' key in $options. The default method used
is text but html is also available. The goal of this function is to
replace all whitespace and unneeded markup around placeholders that
did not get replaced by ``String::insert``.

You can use the following options in the options array::

    $options = array(
        'clean' => array(
            'method' => 'text', // or html
        ),
        'before' => '',
        'after' => ''
    );

Wrapping Text
=============

.. php:staticmethod:: wrap($text, $options = array())

Wraps a block of text to a set width, and indent blocks as well.
Can intelligently wrap text so words are not sliced across lines::

    $text = 'This is the song that never ends.';
    $result = String::wrap($text, 22);

    // Returns
    This is the song
    that never ends.

You can provide an array of options that control how wrapping is done. The
supported options are:

* ``width`` The width to wrap to. Defaults to 72.
* ``wordWrap`` Whether or not to wrap whole words. Defaults to true.
* ``indent`` The character to indent lines with. Defaults to ''.
* ``indentAt`` The line number to start indenting text. Defaults to 0.

.. start-string

Highlighting Substrings
=======================

.. php:method:: highlight(string $haystack, string $needle, array $options = array() )

Highlights ``$needle`` in ``$haystack`` using the ``$options['format']`` string
specified or a default string.

Options:

-  'format' - string The piece of HTML with that the phrase will be
   highlighted
-  'html' - bool If true, will ignore any HTML tags, ensuring that
   only the correct text is highlighted

Example::

    // Called as TextHelper
    echo $this->Text->highlight(
        $lastSentence,
        'using',
        array('format' => '<span class="highlight">\1</span>')
    );

    // Called as String
    use Cake\Utility\String;
    
    echo String::highlight(
        $lastSentence,
        'using',
        array('format' => '<span class="highlight">\1</span>')
    );

Output::

    Highlights $needle in $haystack <span class="highlight">using</span>
    the $options['format'] string specified  or a default string.

Removing Links
==============

.. php:method:: stripLinks($text)

Strips the supplied ``$text`` of any HTML links.


Truncating Text
===============

.. php:method:: truncate(string $text, int $length = 100, array $options)

If ``$text`` is longer than ``$length``, this method truncates it at ``$length``
and adds a prefix consisting of ``'ellipsis'``, if defined. If ``'exact'`` is
passed as ``false``, the truncation will occur at the first whitespace after the
point at which ``$length`` is exceeded. If ``'html'`` is passed as ``true``,
HTML tags will be respected and will not be cut off.

``$options`` is used to pass all extra parameters, and has the
following possible keys by default, all of which are optional::

    array(
        'ellipsis' => '...',
        'exact' => true,
        'html' => false
    )

Example::

    // Called as TextHelper
    echo $this->Text->truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        array(
            'ellipsis' => '...',
            'exact' => false
        )
    );

    // Called as String
    use Cake\Utility\String;
    
    echo String::truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        array(
            'ellipsis' => '...',
            'exact' => false
        )
    );

Output::

    The killer crept...

Truncating the Tail of a String
===============================

.. php:method:: tail(string $text, int $length = 100, array $options)

If ``$text`` is longer than ``$length``, this method removes an initial
substring with length consisting of the difference and prepends a suffix
consisting of ``'ellipsis'``, if defined. If ``'exact'`` is passed as ``false``,
the truncation will occur at the first whitespace prior to the point at which
truncation would otherwise take place.

``$options`` is used to pass all extra parameters, and has the
following possible keys by default, all of which are optional::

    array(
        'ellipsis' => '...',
        'exact' => true
    )

Example::

    $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
        'a C# program that can divide by zero, death metal t-shirts'

    // Called as TextHelper
    echo $this->Text->tail(
        $sampleText,
        70,
        array(
            'ellipsis' => '...',
            'exact' => false
        )
    );

    // Called as String
    use Cake\Utility\String;
    
    echo String::tail(
        $sampleText,
        70,
        array(
            'ellipsis' => '...',
            'exact' => false
        )
    );

Output::

    ...a TV, a C# program that can divide by zero, death metal t-shirts

Extracting an Excerpt
=====================

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

Extracts an excerpt from ``$haystack`` surrounding the ``$needle``
with a number of characters on each side determined by ``$radius``,
and prefix/suffix with ``$ellipsis``. This method is especially handy for
search results. The query string or keywords can be shown within
the resulting document. ::

    // Called as TextHelper
    echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

    // Called as String
    use Cake\Utility\String;
    
    echo String::excerpt($lastParagraph, 'method', 50, '...');

Output::

    ... by $radius, and prefix/suffix with $ellipsis. This method is
    especially handy for search results. The query...

Converting an Array to Sentence Form
====================================

.. php:method:: toList(array $list, $and='and')

Creates a comma-separated list where the last two items are joined
with 'and'. ::

    // Called as TextHelper
    echo $this->Text->toList($colors);

    // Called as String
    use Cake\Utility\String;
    
    echo String::toList($colors);

Output::

    red, orange, yellow, green, blue, indigo and violet

.. end-string

.. meta::
    :title lang=es: String
    :keywords lang=es: array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates
