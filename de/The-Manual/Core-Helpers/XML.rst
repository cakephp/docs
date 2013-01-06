XML
###

Der XML *Helper* vereinfacht die Ausgabe von XML Dokumenten.

serialize
=========

Die *serialize*-Methode benutzt ein *Array* und erstellt aus den Daten
einen XML *String*. Das wird üblicherweise verwendet um *Model*-Daten zu
serialisieren.

::

    <?php
    echo $xml->serialize($data); 
    // format will be similar to:
    // <model_name id="1" field_name="content" />
    ?>

Die *serialize*-Methode dient als *Shortcut* die *built-in* XML Klasse
zu instanziieren und benutzt die toString Methode dieser Klasse. Falls
man mehr Kontrolle über die Serilisation benltigt, kann man die XML
Klasse direkt aufrufen.

elem
====

Die **elem**-Methode erlaubt es einem, einen XML *String*-Knoten, mit
Attributen und enthaltenem *Content* zu erstellen

string elem (string $name, $attrib = array(), mixed $content = null,
$endTag = true)

::

    echo $xml->elem('count', array('namespace' => 'myNameSpace'), 'content');
    // generates: <myNameSpace:count>content</count>

Falls man den Knoten-Text mit CDATA umschließen möchte, sollte das
dritte Argument ein *Array* mit den beiden Schlüsseln '*cdata*\ ' und
'*value*\ ' sein.

::

    echo $xml->elem('count', null, array('cdata'=>true,'value'=>'content');
    // generates: <count><![CDATA[content]]></count>

header
======

Die ``header()`` Methode wird benutzt um die XML Deklaration auszugeben.

::

    <?php
    echo $xml->header(); 
    // generates: <?xml version="1.0" encoding="UTF-8" ?>
    ?>

Man kann eine andere Versionsnummer oder einen anderen *Encoding* Typ
als Paramter der ``header()`` Methode angeben.

::

    <?php
    echo $xml->header(array('version'=>'1.1')); 
    // generates: <?xml version="1.1" encoding="UTF-8" ?>
    ?>

