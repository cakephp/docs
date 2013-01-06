HTML
####

Der HtmlHelper wird in CakePHP benutzt, um HTML-basierte Ausgabe
einfacher, schneller und stabiler gegenüber Änderungen zu machen. Wenn
du diesen Helfer benutzt, dann wird deine Anwendung leichtgewichtiger
und flexibler werden wenn sie unter einer Domain in Einsatz kommt.

Die Aufgabe von HtmlHelper hat sich seit CakePHP 1.1 sehr stark
verändert. Die Methoden für Eingabeformulare wurden als veraltet
markiert und befinden sich nun im neuen FormHelper. Wenn du Fragen zu
HTML Eingabeformularen (*Forms*) hast, dann schau beim neuen FormHelper
nach.

Bevor wir uns die Methoden von HtmlHelper anschauen ist es wichtig die
Konfigurationen und Anwendungssituation von HtmlHelper zu kennen. Für
diejenigen, die nicht so viele *Shorttags* (<?= ?>) oder viele echo()
Aufrufe im Code mögen, wurde der HtmlHelper so geschrieben, dass alle
Methoden direkt der output() Methode übergeben werden. Wenn die Ausgabe
des HtmlHelpers direkt ausgegeben werden soll, dann kann man einfach die
output() methode der AppHelper-Klasse implementieren.

::

    function output($str) {
        echo $str;
    }

Wenn man diese Methode implementiert muss man keine echo Aufrufe im
*View* mehr schreiben.

Viele Methoden von HtmlHelper enthalten einen Parameter namens
$htmlAttributes. Der Parameter erlaubt es dem HTML-Tag welches
ausgegeben wird, beliebige weitere Attribute und Werte hinzuzufügen.
Hier ein paar Beispiele wie man diesen Parameter benutzt:

::

    Gewünschte Attribute: <tag class="someClass" />
    $htmlAttributes Parameter: array('class'=>'someClass')

    Gewünschte Attribute: <tag name="foo" value="bar" />  
    $htmlAttributes Parameter: array('name' => 'foo', 'value' => 'bar')

Der HtmlHelper ist in allen Views automatisch eingebunden und verfügbar.
Sollte trotzdem eine Fehlermeldung erscheinen, die behauptet, dass der
HtmlHelper fehlt, so liegt das meist daran, dass der HtmlHelper in der
$helpers Variablen des *Controller* nicht angegeben ist.

Einfügen von wohlgeformtem HTML
===============================

Die wichtigste Aufgabe von HtmlHelper ist die Generierung von
wohlgeformtem HTML. Zögere nicht, ihn oft zu benutzten - die *Views*
können in CakePHP zwischengespeichert werden (*Cache*) um
Prozessorzyklen zu sparen wenn die *Views* gerendert und ausgeliefert
werden. Dieser Abschnitt wird einige der Methoden des HtmlHelpers
beschreiben.

charset (Zeichensatz)
---------------------

``charset(string $charset=null)``

Diese Methode wird benutzt um ein Meta-Tag zu erzeugen, welches die
Zeichenkodierung des Dokuments angibt. Standard ist UTF-8.

::

    <?php echo $html->charset(); ?> 

Ausgabe:

::

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

Um einen anderen Zeichensatz auszugeben, kann man folgendes verwenden:

::

    <?php echo $html->charset('ISO-8859-1'); ?>

Ausgabe:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $htmlAttributes = array(), boolean $inline = true)``

Diese Methode erzeugt eine Verknüpfung zu CSS Dateien. Wenn der
Parameter $inline auf *false* gesetzt wird, dann werden die Link-Tags
der $scripts\_for\_layout Variable hinzugefügt, welche man im head-Tag
des Dokuments gesetzt werden kann.

Diese Methode erwartet, dass sich die CSS-Dateien im Verzeichnis
/app/webroot/css befinden.

::

    <?php echo $html->css('forms'); ?> 

Ausgabe:

::

    <link rel="stylesheet" type="text/css" href="/de/css/forms.css" />

Um mehrere Dateien einzubinden, kann ein Array als ersten Parameter
übergeben werden.

::

    <?php echo $html->css(array('forms','tables','menu')); ?>

Ausgabe:

::

    <link rel="stylesheet" type="text/css" href="/de/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/de/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/de/css/menu.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

Diese Methode ist nützlich um externe Ressourcen wie RSS/Atom-Feeds oder
Favicons zu einzubinden. Wie bei der css() Methode kann mit dem
Parameter $inline angezeigt werden, ob der Tag direkt an der Stelle
(*inline*) oder im Kopf (*head*) an der Stelle der Variablen
$scripts\_for\_layouts erscheinen soll.

Der $type Parameter kann benutzt werden um das type-Attribut des Tags zu
erzeugen. Hierbei können ein paar Abkürzungen verwendet werden:

+--------+------------------------+
| type   | Erzeugter Wert         |
+========+========================+
| html   | text/html              |
+--------+------------------------+
| rss    | application/rss+xml    |
+--------+------------------------+
| atom   | application/atom+xml   |
+--------+------------------------+
| icon   | image/x-icon           |
+--------+------------------------+

::

      <?php echo $html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?>
    //Ausgabe (Zeilenumbrüche hinzugefügt) </p>
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $html->meta(
        'Comments',
        '/comments/index.rss',
        array('type' => 'rss'));
    ?>
    //Ausgabe (Zeilenumbrüche hinzugefügt)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

Mit dieser Methode kann man auch meta-Schlüsselwörter (*keywords*) und
-Beschreibung (*description*) hinzufügen:

::

    <?php echo $html->meta(
        'keywords',
        'Hier Schlüsselworte eintragen'
    );?>
    //Ausgabe <meta name="keywords" content="Hier Schlüsselworte eintragen"/>

    <?php echo $html->meta(
        'description',
        'Hier Beschreibung eintragen'
       );?>
    //Ausgabe <meta name="description" content="Hier Beschreibung eintragen"/>

doctype
-------

``docType(string $type = 'xhtml-strict')``

Diese Methode schreibt einen (X)HTML doctype Tag. Als $type kann
folgendes angegeben werden:

+----------------+-----------------------+
| type           | Ausgabewert           |
+================+=======================+
| html           | text/html             |
+----------------+-----------------------+
| html4-strict   | HTML4 Strict          |
+----------------+-----------------------+
| html4-trans    | HTML4 Transitional    |
+----------------+-----------------------+
| html4-frame    | HTML4 Frameset        |
+----------------+-----------------------+
| xhtml-strict   | XHTML1 Strict         |
+----------------+-----------------------+
| xhtml-trans    | XHTML1 Transitional   |
+----------------+-----------------------+
| xhtml-frame    | XHTML1 Frameset       |
+----------------+-----------------------+
| xhtml11        | XHTML 1.1             |
+----------------+-----------------------+

::

    <?php echo $html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      
    <?php echo $html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $inline = true)``

Mithilfe dieser Methode kann man CSS Stildefinitionen erzeugen. Die
gewünschten Schlüssel/Wert-Paare können über das Array $data übergeben
werden. Diese Methode ist besonders nützlich, wenn die CSS-Datei
dynamisch erzeugt wird.

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Ausgabe:

::

      background:#633;
      border-bottom:1px solid #000;
      padding:10px; 

image
-----

``image(string $path, array $htmlAttributes = array())``

Mit dieser Methode kann man ein Image-Tag erzeugen. Der Pfad in der
Variablen $path muss relativ zum Ordner /app/webroot/img/ angegeben
werden.

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Ausgabe:

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

Um eine Bildverknüpfung zu erzeugen kann die
``url Option des Parameter $htmlAttributes genutzt werden.``

::

    <?php echo $html->image("recipes/6.jpg", array(
        "alt" => "Kekse",
        'url' => array('controller' => 'recipes', 'action' => 'view', 6)
    )); ?>

Ausgabe:

::

    <a href="/de/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Kekse" />
    </a>

link
----

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

Allgemeine Methode zum Erzeugen von HTML Links. Der Parameter
``$htmlAttributes`` kann benutzt werden um die Attribute des Link-Tags
zu setzen.

::

    <?php echo $html->link('Enter', '/pages/home', array('class'=>'button','target'=>'_blank')); ?>

Ausgabe:

::

      
    <a href="/de/pages/home" class="button" target="_blank">Enter</a>

Wenn eine Bestätigungsnachricht in ``$confirmMessage`` angegeben ist,
dann wird ein javascript ``confirm()`` Dialog mit dieser Nachricht
angezeigt.

::

    <?php echo $html->link(
        'Löschen',
        array('controller'=>'recipes', 'action'=>'delete', 6),
        array(),
        "Sind sie sicher dass sie dieses Rezept löschen möchten?"
    );?>

Ausgabe:

::

      
    <a href="/de/recipes/delete/6" onclick="return confirm('Sind sie sicher dass sie dieses Rezept löschen möchten?');">Löschen</a>

``link()`` kann auch dazu benutzt werden Seitenanfragestrings zu
erzeugen:

::

    <?php echo $html->link('Bild anzeigen', array(
        'controller' => 'images',
        'action' => 'view',
        1,
        '?' => array( 'height' => 400, 'width' => 500))
    );

Ausgabe:

::

      
    <a href="/de/images/view/1?height=400&width=500">Bild anzeigen</a>

HTML-Sonderzeichen die in ``$title`` vorkommen, werden automatisch in
HTML *entities* konvertiert. Die Konvertierung kann ausgeschalten werden
indem entweder die escape Option des Parameter ``$htmlAttributes`` oder
der Parameter ``$escapeTitle`` auf false gesetzt wird.

::

    <?php 
    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Kekse")),
        "recipes/view/6",
        array('escape'=>false)
    );

    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Kekse")),
        "recipes/view/6",
        null, null, false
    );
    ?>

Beide echo geben folgendes aus:

::

    <a href="/de/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Kekse" />
    </a>

tag
---

``tag(string $tag, string $text, array $htmlAttributes, boolean $escape = false)``

Mit dieser Methode kann ein Tag mit beliebigem Inhalt erzeugt werden.
Wenn kein Text in ``$text`` angegeben ist, wird nur das öffnende Tag
<tag> zurückgegeben.

::

    <?php echo $html->tag('span', 'Hallo Welt!.', array('class' => 'willkommen'));?>
     
    // Ausgabe
    <span class="willkommen">Hallo Welt!</span>
     
    // Kein Text angegeben
    <?php echo $html->tag('span', null, array('class' => 'willkommen'));?>
     
    // Ausgabe
    <span class="willkommen">

div
---

``div(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Mithilfe dieser Funktion können Abschnitte erzeugt werden, die von einem
``div``-Tag umschlossen sind. Der erste Parameter gibt eine CSS-Klasse
an und der zweite Parameter den Text, der zwischen dem öffnenden und
schließenden Tag eingeschlossen werden soll. Wenn der letzte Parameter
auf true gesetzt wird, wird $text HTML-escaped dargestellt.

Wird kein Text angegeben, wird nur das öffnende div Tag ausgegeben.

::

     
    <?php echo $html->div('fehler', 'Bitte geben Sie Ihre Kreditkartennummer ein.');?>

    //Output
    <div class="fehler">Bitte geben Sie Ihre Kreditkartennummer ein.</div>

para
----

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Diese Funktion gibt einen Text zurück der in <p>-Tags eingeschlossen
ist. Ist kein Text angegeben, wird nur das öffnende <p> Tag
zurückgegeben..

::

    <?php echo $html->para(null, 'Hallo Welt!');?>
     
    //Ausgabe
    <p>Hallo Welt!</p>

tableHeaders
------------

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

Erzeugt eine Kopfzeile welche in einem <table> Tag verwendet werden
kann.

::

    <?php echo $html->tableHeaders(array('Datum','Titel','Aktiv'));?>

    //Ausgabe
    <tr><th>Date</th><th>Title</th><th>Active</th></tr>
     
    <?php echo $html->tableHeaders(
        array('Datum','Titel','Aktiv'),
        array('class' => 'status'),
        array('class' => 'product_table')
    );?>
     
    //Ausgabe
    <tr class="status">
         <th class="product_table">Datum</th>
         <th class="product_table">Titel</th>
         <th class="product_table">Aktiv</th>
    </tr>

tableCells
----------

``tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)``

Erzeugt eine Reihe von Zellen für Tabellen. Je nach gerader oder
ungerader Zeilennummer werden die <tr>-Tags mit den Attributen
$oddTrOptions (ungerade) bzw. $evenTrOptions (gerade) versehen.

Um Attribute für die <td>-Tags anzugeben, muss ein array() mit
Attributwerten zusätzlich zum Textwert der Zelle in ein Array gesetzt
werden (siehe 2. Beispiel unten).

::

    <?php echo $html->tableCells(array(
        array('7. Juli 2007', 'Spitzenschokokuchen', 'Ja'),
        array('21. Juni 2007', 'Pfiffige Kekse', 'Ja'),
        array('1. August 2006', 'Anti-Java Kuchen', 'Nein'),
    ));
    ?>
     
    //Ausgabe
    <tr><td>7. Juli 2007</td><td>Spitzenschokokuchen</td><td>Ja</td></tr>
    <tr><td>21. Juni 2007</td><td>Pfiffige Kekse</td><td>Ja</td></tr>
    <tr><td>1. August 2006</td><td>Anti-Java Kuchen</td><td>Nein</td></tr>
     
    <?php echo $html->tableCells(array(
        array('7. Juli 2007', array('Spitzenschokokuchen', array('class'=>'highlight')) , 'Ja'),
        array('21. Juni 2007', 'Pfiffige Kekse', 'Ja'),
        array('1. August 2006', 'Anti-Java Kuchen', array('Nein', array('id'=>'special'))),
    ));
    ?>
     
    //Ausgabe
    <tr><td>7. Juli 2007</td><td class="highlight">Spitzenschokokuchen</td><td>Ja</td></tr>
    <tr><td>21. Juni 2007</td><td>Pfiffige Kekse</td><td>Ja</td></tr>
    <tr><td>1. August 2006</td><td>Anti-Java Kuchen</td><td id="special">Nein</td></tr>
     
    <?php echo $html->tableCells(
        array(
            array('Rot', 'Apfel'),
            array('Orange', 'Orange'),
            array('Gelb', 'Banane'),
        ),
        array('class' => 'dunkler')
    );
    ?>
     
    //Ausgabe
    <tr class="dunkler"><td>Rot</td><td>Apfel</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="dunkler"><td>Gelb</td><td>Banane</td></tr>

url
---

``url(mixed $url = NULL, boolean $full = false)``

Gibt eine CakePHP-typische URL zurück die auf einen *Controller* und
eine *Action* zeigt. Wenn $url leer ist, wird die Anfragende URL
(REQUEST\_URI) zurückgegeben. Ansonten wird die URL für die
Controller/Action Kombination erzeugt. Wird der Parameter full auf true
gesetzt, wird die URL inklusive Basisadresse zurückgeben.

::

    <?php echo $html->url(array("controller" => "posts",
                                 "action" => "foo",
                                 "bar" => 1));?>
     
    //Ausgabe
    /posts/foo/bar:1

Das nächste Beispiel gibt auch eine URL die mit '/' startet zurück aber
die komplette Basisadresse wird vorne angehängt.

::

    <?php echo $html->url('/posts/foo/bar:1'); ?>

    //Output
    /cakeinstall/posts/foo/bar:1

Verändern des Tag-Satzes mit dem HtmlHelper
===========================================

Die eingebauten Tag-Sätze für den ``HtmlHelper`` sind kompatibel zu
XHTML. Falls HTML für HTML4 erzeugt werden muss, muss man eine neue
Tag-Konfigurationsdatei mit den Tags erzeugen und laden, die man
verwenden möchte. Um die Tags zu wechseln, erzeugt man die Datei
``app/config/tags.php`` mit folgendem Inhalt:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );

Durch ``$html->loadConfig('tags');`` wird dieser Tag-Satz geladen.
