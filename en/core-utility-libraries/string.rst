String
######

.. php:class:: String

The String class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
``String::uuid()``.

If you need :php:class:`TextHelper` functionalities outside of a ``View``,
use the ``String`` class::

    <?php
    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('String', 'Utility');
            $message = $this->User->find('new_message');
            if (!empty($message)) {
                // notify user of new message
                $this->Session->setFlash(__('You have a new message: %s', String::truncate($message['Message']['body'], 255, array('html' => true))));
            }
        }
    }

.. versionchanged:: 2.1
   Several methods from :php:class:`TextHelper` have been moved to
   ``String`` class.

.. php:staticmethod:: uuid()

    The uuid method is used to generate unique identifiers as per
    :rfc:`4122`. The uuid is a
    128bit string in the format of
    485fc381-e790-47a3-9794-1337c0a8fe68.

    ::

        <?php
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

        <?php
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

.. start-string

.. php:method:: highlight(string $haystack, string $needle, array $options = array() )

    :param string $haystack: The string to search.
    :param string $needle: The string to find.
    :param array $options: An array of options, see below.

    Highlights ``$needle`` in ``$haystack`` using the
    ``$options['format']`` string specified or a default string.

    Options:

    -  'format' - string The piece of html with that the phrase will be
       highlighted
    -  'html' - bool If true, will ignore any HTML tags, ensuring that
       only the correct text is highlighted

    Example::

        <?php
        // called as TextHelper
        echo $this->Text->highlight($lastSentence, 'using', array('format' => '<span class="highlight">\1</span>'));

        // called as String
        App::uses('String', 'Utility');
        echo String::highlight($lastSentence, 'using', array('format' => '<span class="highlight">\1</span>'));

    Output::

        Highlights $needle in $haystack <span class="highlight">using</span>
        the $options['format'] string specified  or a default string.

.. php:method:: stripLinks($text)

    Strips the supplied ``$text`` of any HTML links.

.. php:method:: truncate(string $text, int $length=100, array $options)

    :param string $text: The text to truncate.
    :param int $length:  The length to trim to.
    :param array $options: An array of options to use.

    Cuts a string to the ``$length`` and adds a suffix with
    ``'ellipsis'`` if the text is longer than ``$length``. If ``'exact'``
    is passed as ``false``, the truncation will occur after the next
    word ending. If ``'html'`` is passed as ``true``, html tags will be
    respected and will not be cut off.

    ``$options`` is used to pass all extra parameters, and has the
    following possible keys by default, all of which are optional::

        array(
            'ellipsis' => '...',
            'exact' => true,
            'html' => false
        )

    Example::

        <?php
        // called as TextHelper
        echo $this->Text->truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // called as String
        App::uses('String', 'Utility');
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

.. versionchanged:: 2.3
   ``ending`` has been replaced by ``ellipsis``. ``ending`` is still used in 2.2.1


.. php:method:: tail(string $text, int $length=100, array $options)

    :param string $text: The text to truncate.
    :param int $length:  The length to trim to.
    :param array $options: An array of options to use.

    Cuts a string to the ``$length`` and adds a prefix with
    ``'ellipsis'`` if the text is longer than ``$length``. If ``'exact'``
    is passed as ``false``, the truncation will occur before the next
    word ending.

    ``$options`` is used to pass all extra parameters, and has the
    following possible keys by default, all of which are optional::

        array(
            'ellipsis' => '...',
            'exact' => true
        )
        
    .. versionadded:: 2.3

    Example::

        <?php
        // called as TextHelper
        echo $this->Text->tail(
            'I packed my bag and in it I put a PSP, a PS3, a TV, a C# program that can divide by zero, death metal t-shirts',
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // called as String
        App::uses('String', 'Utility');
        echo String::tail(
            'I packed my bag and in it I put a PSP, a PS3, a TV, a C# program that can divide by zero, death metal t-shirts',
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

    Output::

        ...a TV, a C# program that can divide by zero, death metal t-shirts
        
.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

    :param string $haystack: The string to search.
    :param string $needle: The string to excerpt around.
    :param int $radius:  The number of characters on either side of $needle you want to include.
    :param string $ellipsis: Text to append/prepend to the beginning or end of the result.

    Extracts an excerpt from ``$haystack`` surrounding the ``$needle``
    with a number of characters on each side determined by ``$radius``,
    and prefix/suffix with ``$ellipsis``. This method is especially handy for
    search results. The query string or keywords can be shown within
    the resulting document.::

        <?php
        // called as TextHelper
        echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

        // called as String
        App::uses('String', 'Utility');
        echo String::excerpt($lastParagraph, 'method', 50, '...');

    Output::

        ... by $radius, and prefix/suffix with $ellipsis. This method is
        especially handy for search results. The query...

.. php:method:: toList(array $list, $and='and')

    :param array $list: Array of elements to combine into a list sentence.
    :param string $and: The word used for the last join.

    Creates a comma-separated list where the last two items are joined
    with ‘and’.::

        <?php
        // called as TextHelper
        echo $this->Text->toList($colors);

        // called as String
        App::uses('String', 'Utility');
        echo String::toList($colors);

    Output::

        red, orange, yellow, green, blue, indigo and violet

.. end-string

.. meta::
    :title lang=en: String
    :keywords lang=en: array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates