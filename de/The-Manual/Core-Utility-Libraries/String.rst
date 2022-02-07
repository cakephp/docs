String
######

Die String Klasse beinhaltet komfortable Methoden zur Erstellung und
Manipulation von Zeichenketten. Normalerweise werden diese statisch
aufgerufen. Beispiel: ``String::uuid()``.

uuid
====

Die ``uid``-Methode generiert eindeutige 128bit-UUIDs nach `RFC
4122 <https://www.ietf.org/rfc/rfc4122.txt>`_.

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

``string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound = ')')``

Spaltet eine Zeichenkette mit Hilfe von ``$separator`` in Token auf.
Dabei werden alle Vorkommen von ``$separator`` ignoriert, wenn diese
zwischen ``$leftBound`` und ``$rightBound`` auftreten.

insert
======

string insert ($string, $data, $options = array())

Die insert Methode wird zum Erzeugen von Zeichenkettenvorlagen benutzt
und ermöglicht Schlüssel/Wert-Ersetzungen.

::

    String::insert('Mein Name ist :name und ich bin :age Jahre alt.', array('name' => 'Bob', 'age' => '65'));
    // erzeugt: "Mein Name ist Bob und ich bin 65 Jahre alt."

cleanInsert
===========

string cleanInsert ($string, $options = array())

Säubert eine mit Set::insert formatierte Zeichenkette mit Hilfe von den
übergebenen $options und anhand des 'clean' Schlüssels in $options.
Standardmäßig wird als Methode text benutzt, html ist aber auch
verfügbar. Das Ziel der Funktion ist alle Leerzeichen, sowie nicht
benötigtes Markup um Platzhalter herum, welches nicht bereits durch
Set::insert ersetzt wurde, zu ersetzen.
