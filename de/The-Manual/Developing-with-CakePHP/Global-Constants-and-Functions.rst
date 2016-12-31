Globale Konstanten und Funktionen
#################################

Obwohl während der täglichen Arbeit mit CakePHP hautpsächlich die
Kern-Klassen und Methoden benutzt werden, existieren in CakePHP einige
nützliche globale Funktionen die ganz praktisch sein können. Viele
dieser Funktionen zielen auf CakePHP Klassen (z.B. laden von Modell oder
Komponentenklassen) ab. Viele andere unterstützen die Arbeit mit Arrays
oder Strings.

Es werden auch einige der Konstanten die in CakePHP Anwendungen
verfügbar sind besprochen. Diese Konstanten erlauben es zum einen,
Updates eleganter durchzuführen, sind aber auch nützlich um wichtige
Dateien oder Ordner in der CakePHP Anwendung zu erreichen.

Globale Funktionen
==================

Hier finden sich die global verfügbaren Funktionen von CakePHP. Viele
sind nützliche Wrapper (Abkürzungen) für PHP Funktionen mit langen
Namen, aber einige (z.B. ``uses()``) können benutzt werden um Quelltext
einzubinden oder andere nützliche Dinge zu machen. Falls Du eine
Funktion suchst, die dir eine oft benötigt Aufgabe abnimmt, ist es gut
möglich, dass Du sie hier findest.

\_\_
----

``__(string $string_id, boolean $return =  false)``

Mithilfe dieser Funktion kann man CakePHP Anwendungen lokalisieren. Der
Parameter ``$string_id`` gibt die Kennung für eine Übersetzung an. Wird
der zweite Parameter auf false gesetzt (Standard), so wird das Ergebnis
der Funktion automatisch über ein echo() Aufruf ausgegeben. Wird true
übergeben, wird das Ergebnis zurückgegeben.

Im Abschintt `Internationalisierung &
Lokalisierung </de/view/161/localization-internationalizat>`_ finden
sich weitere Informationen.

a
-

``a(mixed $one, $two, $three...)``

Liefert ein Array der Parameter zurück, mit denen die Wrapper-Funktion
aufgerufen wurde.

::

    print_r(a('foo', 'bar')); 

    // Ergebnis:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

Die Methode ist veraltet und wird in der der CakePHP 2.0 Version
gelöscht. Nutze stattdessen **array()**

aa
--

``aa(string $one, $two, $three...)``

Used to create associative arrays formed from the parameters used to
call the wrapping function.

::

    print_r(aa('a','b')); 

    // output:
    array(
        'a' => 'b'
    )

This has been Deprecated and will be removed in 2.0 version.

am
--

``am(array $one, $two, $three...)``

Merges all the arrays passed as parameters and returns the merged array.

Example:

::

        $arrTest1 = array('1'=>'Test1','2'=>'Test2');
        $arrTest2 = array('4'=>'Test4','5'=>'Test5');
        $arrFinal = am($arrTest1,$arrTest2);
        debug($arrFinal);

Output :

::

    Array
    (
        [0] => Test1
        [1] => Test2
        [2] => Test4
        [3] => Test5
    )

**am()** is similar **to array\_merge**

config
------

Can be used to load files from your application ``config``-folder via
include\_once. Function checks for existance before include and returns
boolean. Takes an optional number of arguments.

Example: ``config('some_file', 'myconfig');``

convertSlash
------------

``convertSlash(string $string)``

Converts forward slashes to underscores and removes the first and last
underscores in a string. Returns the converted string.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

If the application's DEBUG level is non-zero, $var is printed out. If
``$showHTML`` is true, the data is rendered to be browser-friendly.

Also see `Basic
Debugging <https://book.cakephp.org/view/1190/Basic-Debugging>`_

e
-

``e(mixed $data)``

Convenience wrapper for ``echo()``.

This has been Deprecated and will be removed in 2.0 version. Use
**echo()** instead

env
---

``env(string $key)``

Gets an environment variable from available sources. Used as a backup if
``$_SERVER`` or ``$_ENV`` are disabled.

This function also emulates PHP\_SELF and DOCUMENT\_ROOT on unsupporting
servers. In fact, it's a good idea to always use ``env()`` instead of
``$_SERVER`` or ``getenv()`` (especially if you plan to distribute the
code), since it's a full emulation wrapper.

fileExistsInPath
----------------

``fileExistsInPath(string $file)``

Checks to make sure that the supplied file is within the current PHP
include\_path. Returns a boolean result.

h
-

``h(string $text, string $charset = null)``

Convenience wrapper for ``htmlspecialchars()``.

ife
---

``ife($condition, $ifNotEmpty, $ifEmpty)``

Used for ternary-like operations. If the ``$condition`` is non-empty,
``$ifNotEmpty`` is returned, else ``$ifEmpty`` is returned.

This has been Deprecated and will be removed in 2.0 version.

low
---

``low(string $string)``

Convenience wrapper for ``strtolower()``.

This has been Deprecated and will be removed in 2.0 version. Use
**strtolower()** instead

pr
--

``pr(mixed $var)``

Convenience wrapper for ``print_r()``, with the addition of wrapping
<pre> tags around the output.

r
-

``r(string $search, string $replace, string  $subject)``

Convenience wrapper for ``str_replace()``.

This has been Deprecated and will be removed in 2.0 version. Use
**str\_replace()** instead

stripslashes\_deep
------------------

``stripslashes_deep(array $value)``

Recursively strips slashes from the supplied ``$value``. Returns the
modified array.

up
--

``up(string $string)``

Convenience wrapper for ``strtoupper()``.

This has been Deprecated and will be removed in 2.0 version. Use
**strtoupper()** instead

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Used to load CakePHP's core libraries (found in cake/libs/). Supply the
name of the library's file name without the '.php' extension.

This has been Deprecated and will be removed in 2.0 version.

Core Definition Constants
=========================

constant

Absoluter Pfad zur Anwendung’s...

APP

*root*-Verzeichnis

APP\_PATH

*app*-Verzeichnis

CACHE

Verzeichnis für den Datei-Cache

CAKE

CakePHP-Verzeichnis (cake).

COMPONENTS

Verzeichnis für die Komponenten (components).

CONFIGS

Konfigurations-Verzeichnis.

CONTROLLER\_TESTS

Test-Verzeichnis für Controller.

CONTROLLERS

Verzeichnis für Controller.

CSS

CSS-Verzeichnis.

DS

Abkürzung für PHPs *DIRECTORY\_SEPARATOR*. Gibt das Trennzeichen für
Verzeichnise zurück (in Linux / und in Windows \\).

ELEMENTS

Elemente-Verzeichnis.

HELPER\_TESTS

Test-Verzeichnis für Helfer.

HELPERS

Helfer-Verzeichnis.

IMAGES

Bilder-Verzeichnis.

INFLECTIONS

Inflections-Verzeichnis (normalerweise innerhalb des
Konfigurationsverzeichnisses).

JS

Verzeichnis, dass JavaScript-Dateien enthält (im *webroot*-Verzeichnis).

LAYOUTS

Layout-Verzeichnis.

LIB\_TESTS

CakePHP Bibliothek Test-Verzeichnis.

LIBS

CakePHP *libs*-Verzeichnis.

LOGS

Protokoll-Verzeichnis (im *app*-Verzeichnis).

MODEL\_TESTS

Model Tests-Verzeichnis.

MODELS

Models-Verzeichnis.

SCRIPTS

CakePHP Skript-Verzeichnis.

TESTS

Test-Verzeichnis (Übergeordnetes Verzeichnis für die Test-Verzeichnisse
der Models, Controller, etc.)

TMP

Temporäres Verzeichnis.

VENDORS

Vendors-Verzeichnis.

VIEWS

Views-Verzeichnis.

WWW\_ROOT

Absoluter Pfad zum *webroot*-Verzeichnis.
