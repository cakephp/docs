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

Gibt ein Array der Parameter zurück, mit denen die wrapping-Funktion
aufgerufen wurde.

::

    print_r(a('foo', 'bar')); 

    // output:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

aa
--

``aa(string $one, $two, $three...)``

Wird benutzt um assoziative Arrays aus den Parametern zu bilden, mit
denen die wrapping-Funktion aufgerufen wurde.

::

    print_r(aa('a','b')); 

    // output:
    array(
        'a' => 'b'
    )

am
--

``am(array $one, $two, $three...)``

Vereinigt alle Arrays die als Parameter angegeben werden und gibt das
vereinigte Array zurück.

config
------

Kann benutzt werden, um Dateien aus dem ``config``-Ordner der Anwendung
via include\_once zu laden. Die Funktion überprüft vor dem include die
Existenz und gibt einen boolean zurück. Nimmt eine optionale Zahl an
Argumenten an.

Beispiel: ``config('some_file', 'myconfig');``

convertSlash
------------

``convertSlash(string $string)``

Konvertiert Schrägstriche in Unterstriche und entfernt führende sowie
Unterstriche am Ende. Gibt den konvertierten String zurück..

countdim
--------

``countdim(array $array)``

Gibt die Anzahl der Dimensionen des übergebenen Arrays zurück.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

If the application's DEBUG level is non-zero, $var is printed out. If
``$showHTML`` is true, the data is rendered to be browser-friendly.

e
-

``e(mixed $data)``

Convenience wrapper for ``echo()``.

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

low
---

``low(string $string)``

Convenience wrapper for ``strtolower()``.

paths
-----

``paths()``

Get CakePHP basic paths as an indexed array. Resulting array will
contain array of paths indexed by: Models, Behaviors, Controllers,
Components, and Helpers.

This has been Deprecated and is no longer available in RC2. Use
**Configure::corePaths();** instead.

pr
--

``pr(mixed $var)``

Convenience wrapper for ``print_r()``, with the addition of wrapping
<pre> tags around the output.

r
-

``r(string $search, string $replace, string  $subject)``

Convenience wrapper for ``str_replace()``.

stripslashes\_deep
------------------

``stripslashes_deep(array $value)``

Recursively strips slashes from the supplied ``$value``. Returns the
modified array.

up
--

``up(string $string)``

Convenience wrapper for ``strtoupper()``.

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Used to load CakePHP's core libraries (found in cake/libs/). Supply the
name of the library's file name without the '.php' extension.

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
