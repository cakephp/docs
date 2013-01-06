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

