Text
####

Der TextHelper bietet Methoden um den Umgang mit Text in den Views zu
erleichtern. Er hilft dabei URLs in Links zu verwandeln und zu
formatieren, Textausschnitte um bestimmte Worte zu filtern,
Schlüsselwörter hervorzuheben und lange Textauszüge zu beschneiden.

**autolinkEmails (string $text, array $htmlOptions=array())**

Verlinkt, entsprechend den Optionen in $htmlOptions (siehe
HtmlHelper::link()), korrekt geschriebenen E-Mail-Adressen in $text.

::

    $mein_text = 'Für weitere Informationen wenden sie sich bitte an info@beispiel.org';
    $link_text = $text->autoLinkEmails($text);

    //Ausgabe:
    Für weitere Informationen wenden sie sich bitte an <a href="mailto:info@beispiel.org"><u>info@beispiel.org</u></a>

**autoLinkUrls (string $text, array $htmlOptions=array())**

Das gleiche wie bei autoLinkEmails(), nur dass diese Methode Strings,
die mit https, http, ftp oder nntp beginnen verlinkt.

**autoLink (string $text, array $htmlOptions=array())**

Führt sowohl autoLinkUrls() und autoLinkEmails() auf $text aus. Alle
URLs und E-Mails weren entsprechend den Optionen in $htmlOptions
verlinkt.

**excerpt (string $haystack, string $needle, int $radius=100, $string
$ending="...")**

Schneidet einen, auf beiden Seiten von $needle, $radius Zeichen breiten
Textausschnitt aus $haystack aus. Das ist besonders hilfreich für
Suchergebnisse.

::

    <?php    
        $heuhaufen = "Als ich gestern durch das Zimmer lief, trat ich auf eine Nadel. Das tat mir sehr weh";
        echo $text->excerpt($heuhaufen, 'Nadel', 15); ?> 
    //Ausgabe
    ...t ich auf eine Nadel. Das tat mir sehr w...

**highlight (string $haystack, string $needle, $highlighter= '< span
class="highlight">\\1</span >')**

Hebt $needle im $haystack hervor und nutzt dabei den $highlighter string
als Muster.

::

    <?php 
        $heuhafen = "Sollte ich die Nadel finden?";
        echo $text->highlight($heuhaufen, 'Nadel'); ?> 
    //Output
    Sollte ich die <span class="highlight">Nadel</span> finden?

**stripLinks ($text)**

Entfernt alle HTML-Links aus $text.

**toList (array $list, $and= 'and')**

Generiert eine Komma-separierte Liste, deren letzten zwei Elemente mit
‘and’ verbunden sind.

::

    <?php echo $text->toList($farben, 'und'); ?> 

    //Ausgabe
    rot, orange, gelb, grün, blau, indigo und violett

**truncate (string $text, int $length=100, string $ending= '...',
boolean $exact=true, boolean $considerHtml=false)**

**trim(); // ein Alias für truncate**

Beschneidet $text auf die Anzahl an Zeichen, die mit $length gegeben
ist, und hängt $ending hinten dran, falls $text länger als $length war.
Wenn $exact *false* ist, wird sichergestellt, dass das letzte Wort noch
ausgeschrieben wird. Wenn $considerHtml *true* ist, werden HTML-Tags
nicht abgeschnitten.

::

    <?php    
    echo $text->truncate(
        'Die Welt gerät aus den Fugen dachte er.',
        25,
        '...',
        false
    ); 
    ?> 

::

    //Ausgabe:
    Die Welt gerät aus den Fugen...

autoLinkEmails
==============

``autoLinkEmails(string $text, array $htmlOptions=array())``

Adds links to the well-formed email addresses in $text, according to any
options defined in ``$htmlOptions`` (see
`HtmlHelper::link() </de/view/1442>`_).

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

Same as in ``autoLinkEmails()``, only this method searches for strings
that start with https, http, ftp, or nntp and links them appropriately.

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
