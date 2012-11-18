Text
####

The TextHelper contains methods to make text more usable and friendly in
your views. It aids in enabling links, formatting urls, creating
excerpts of text around chosen words or phrases, highlighting key words
in blocks of text, and to gracefully truncating long stretches of text.

autoLinkEmails
==============

``autoLinkEmails(string $text, array $htmlOptions=array())``

Adds links to the well-formed email addresses in $text, according to any
options defined in ``$htmlOptions`` (see
`HtmlHelper::link() </es/view/1442>`_).

::

    $my_text = 'For more information regarding our world-famous pastries and desserts, contact info@example.com';
    $linked_text = $this->Text->autoLinkEmails($my_text);

Output:

::

    For more information regarding our world-famous pastries and desserts,
    contact <a href="mailto:info@example.com">info@example.com</a>

autoLinkUrls
============

``autoLinkUrls(string $text, array $htmlOptions=array())``

Igual que con ``autoLinkEmails()``, la única diferencia es que este
método busca las cadenas de texto que empiezan con https, http, ftp, o
nntp y las enlaza correctamente.

autoLink
========

``autoLink(string $text, array $htmlOptions=array())``

Performs the functionality in both ``autoLinkUrls()`` and
``autoLinkEmails()`` on the supplied ``$text``. All URLs and emails are
linked appropriately given the supplied ``$htmlOptions``.

excerpt
=======

``excerpt(string $haystack, string $needle, int $radius=100, string $ending="...")``

Extracts an excerpt from ``$haystack`` surrounding the ``$needle`` with
a number of characters on each side determined by ``$radius``, and
suffixed with ``$ending``. This method is especially handy for search
results. The query string or keywords can be shown within the resulting
document.

::

        echo $this->Text->excerpt($last_paragraph, 'method', 50);

Output:

::

    mined by $radius, and suffixed with $ending. This method is especially handy for
    search results. The query...

highlight
=========

``highlight(string $haystack, string $needle, array $options = array() )``

Highlights ``$needle`` in ``$haystack`` using the ``$options['format']``
string specified or a default string.

Options

-  'format' - string The piece of html with that the phrase will be
   highlighted
-  'html' - bool If true, will ignore any HTML tags, ensuring that only
   the correct text is highlighted

::

        echo $this->Text->highlight($last_sentence, 'using',array('format'=>'<span class="highlight">\1</span>');

Output:

::

    Highlights $needle in $haystack <span class="highlight">using</span>
    the $options['format'] string specified  or a default string.

stripLinks
==========

``stripLinks($text)``

Strips the supplied ``$text`` of any HTML links.

toList
======

``toList(array $list, $and='and', $separator=', ')``

Creates a comma-separated list where the last two items are joined with
‘and’.

::

        echo $this->Text->toList($colors);

Output:

::

    red, orange, yellow, green, blue, indigo and violet

truncate
========

``truncate(string $text, int $length=100, array $options)``

Cuts a string to the ``$length`` and adds a suffix with ``'ending'`` if
the text is longer than ``$length``. If ``'exact'`` is passed as
``false``, the truncation will occur after the next word ending. If
``'html'`` is passed as ``true``, html tags will be respected and will
not be cut off.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

::

    array(
        'ending' => '...',
        'exact' => true,
        'html' => false
    )

::

    echo $this->Text->truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        array(
            'ending' => '...',
            'exact' => false
        )
    );

Output:

::

    The killer crept...

trim
====

``trim()``

An alias for truncate.
