Xml
###

Die Xml Klasse erlaubt auf einfache Weise XML Fragmente und Dokumente zu
parsen und zu generieren. Die Klasse ist komplett in PHP gelöst und
benötigt lediglich eine installierte Xml/Expat Erweiterung.

Parsen von Xml
==============

Um Xml mit der Xml Klasse zu parsen benötigst du eine Zeichenkette, die
das zu parsende XML enthält.

::

    $input = '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>
        <container>
            <element id="first-el">
                <name>My element</name>
                <size>20</size>
            </element>
            <element>
                <name>Your element</name>
                <size>30</size>
            </element>
        </container>';
    $xml = new Xml($input);

Dies würde ein Xml Dokument Objekt erstellen, welches dann manipuliert,
durchlaufen und wieder zurück in eine Zeichenkette konvertiert werden
kann.

Mit dem oberen Beispiel kannst du folgendes machen.

::

    echo $xml->children[0]->children[0]->name;
    // Gibt 'element' aus

    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // Gibt 'My Element' aus

    echo $xml->children[0]->child('element')->attributes['id'];
    // Gibt 'first-el' aus

