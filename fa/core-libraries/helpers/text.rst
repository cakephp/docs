TextHelper
##########

.. php:class:: TextHelper(View $view, array $settings = array())

The TextHelper contains methods to make text more usable and
friendly in your views. It aids in enabling links, formatting urls,
creating excerpts of text around chosen words or phrases,
highlighting key words in blocks of text, and to gracefully
truncating long stretches of text.


.. php:method:: autoLinkEmails(string $text, array $options=array())
    
    :param string $text: The text to convert.
    :param array $options: An array of :term:`html attributes` for the generated links.

    Adds links to the well-formed email addresses in $text, according
    to any options defined in ``$htmlOptions`` (see
    :php:meth:`HtmlHelper::link()`).::

        <?php
        $my_text = 'For more information regarding our world-famous pastries and desserts, contact info@example.com';
        $linked_text = $this->Text->autoLinkEmails($my_text);

    Output::

        For more information regarding our world-famous pastries and desserts,
        contact <a href="mailto:info@example.com">info@example.com</a>

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. php:method:: autoLinkUrls(string $text, array $htmlOptions=array())

    :param string $text: The text to convert.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Same as in ``autoLinkEmails()``, only this method searches for
    strings that start with https, http, ftp, or nntp and links them
    appropriately.

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. php:method:: autoLink(string $text, array $htmlOptions=array())

    :param string $text: The text to autolink.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Performs the functionality in both ``autoLinkUrls()`` and
    ``autoLinkEmails()`` on the supplied ``$text``. All URLs and emails
    are linked appropriately given the supplied ``$htmlOptions``.

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ending="...")

    :param string $haystack: The string to search.
    :param string $needle: The string to excerpt around.
    :param int $radius:  The number of characters on either side of $needle you want to include.
    :param string $ending: Text to append/prepend to the beginning or end of the result. 

    Extracts an excerpt from ``$haystack`` surrounding the ``$needle``
    with a number of characters on each side determined by ``$radius``,
    and prefix/suffix with ``$ending``. This method is especially handy for
    search results. The query string or keywords can be shown within
    the resulting document.::

        <?php
        echo $this->Text->excerpt($last_paragraph, 'method', 50, '...');

    Output::

        ... by $radius, and prefix/suffix with $ending. This method is 
        especially handy for search results. The query...

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
        echo $this->Text->highlight($last_sentence, 'using', array('format' => '<span class="highlight">\1</span>'));

    Output::

        Highlights $needle in $haystack <span class="highlight">using</span>
        the $options['format'] string specified  or a default string.

.. php:method:: stripLinks($text)

    Strips the supplied ``$text`` of any HTML links.

.. php:method:: toList(array $list, $and='and')

    :param array $list: Array of elements to combine into a list sentence.
    :param string $and: The word used for the last join.

    Creates a comma-separated list where the last two items are joined
    with ‘and’.::
        
        <?php
        echo $this->Text->toList($colors);

    Output::

        red, orange, yellow, green, blue, indigo and violet

.. php:method:: truncate(string $text, int $length=100, array $options)

    :param string $text: The text to truncate.
    :param int $length:  The length to trim to.
    :param array $options: An array of options to use.
    
    Cuts a string to the ``$length`` and adds a suffix with
    ``'ending'`` if the text is longer than ``$length``. If ``'exact'``
    is passed as ``false``, the truncation will occur after the next
    word ending. If ``'html'`` is passed as ``true``, html tags will be
    respected and will not be cut off.

    ``$options`` is used to pass all extra parameters, and has the
    following possible keys by default, all of which are optional::

        array(
            'ending' => '...',
            'exact' => true,
            'html' => false
        )

    Example::

        <?php
        echo $this->Text->truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ending' => '...',
                'exact' => false
            )
        );

    Output::

        The killer crept...


.. meta::
    :title lang=en: TextHelper
    :description lang=en: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=en: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
