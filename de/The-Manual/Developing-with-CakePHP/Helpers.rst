Helpers
#######

Helper sind Componenten-ähnliche Klassen zur Erweiterung der
Präsentationsschicht deiner Applikation. Helper enthalten Logik, die
sowohl von Views als auch Elements oder Layouts genutzt werden kann.
Dieser Abschnitt zeigt dir, wie du eigene Helper entwerfen und CakePHP’s
Kern-Helper einsetzen kannst. Nähere Informationen zu den Kern-Helpers
findest du in der Rubrik `Built-in
Helpers </de/view/181/built-in-helpers>`_.

Using Helpers
=============

You use helpers in CakePHP by making a controller aware of them. Each
controller has a $helpers property that lists the helpers to be made
available in the view. To enable a helper in your view, add the name of
the helper to the controller’s $helpers array.

::

    <?php
    class BakeriesController extends AppController {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

You can also add helpers from within an action, so they will only be
available to that action and not the other actions in the controller.
This saves processing power for the other actions that do not use the
helper as well as help keep the controller better organized.

::

    <?php
    class BakeriesController extends AppController {
        function bake {
            $this->helpers[] = 'Time';
        }
        function mix {
            // The Time helper is not loaded here and thus not available
        }
    }
    ?>

If you need to enable a helper for all controllers add the name of the
helper to the $helpers array in */app/app\_controller.php* (or create if
not present). Remember to include the default Html and Form helpers.

::

    <?php
    class AppController extends Controller {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

You can pass options to helpers. These options can be used to set
attribute values or modify behavior of a helper.

::

    <?php
    class AwesomeHelper extends AppHelper {
        function __construct($options = null) {
            parent::__construct($options);
            debug($options);
        }
    }
    ?>
    <?php
    class AwesomeController extends AppController {
        var $helpers = array('Awesome' => array('option1' => 'value1'));
    }
    ?>

Creating Helpers
================

If a core helper (or one showcased on Cakeforge or the Bakery) doesn’t
fit your needs, helpers are easy to create.

Let's say we want to create a helper that could be used to output a
specifically crafted CSS-styled link you need in many different places
in your application. In order to fit your logic into CakePHP's existing
helper structure, you'll need to create a new class in
/app/views/helpers. Let's call our helper LinkHelper. The actual PHP
class file would look something like this:

::

    <?php
    /* /app/views/helpers/link.php */

    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // Logic to create specially formatted link goes here...
        }
    }

    ?>

Verwendung von bestehenden Helpern
----------------------------------

Vielleicht möchtest Du auch die Funktionen bereits bestehender Helper
aus dem Core von CakePHP benutzen? Um dies zu bewerkstelligen musst Du
nur den Helper im $helpers-Array, wie bei der normalen Verwendung in
einem Controller deklarieren.

::

    <?php
    /* /app/views/helpers/link.php (using other helpers) */
    class LinkHelper extends AppHelper {
        var $helpers = array('Html');

        function makeEdit($title, $url) {
            // Use the HTML helper to output
            // formatted data:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return $this->output("<div class=\"editOuter\">$link</div>");
        }
    }
    ?>

Callback method
---------------

Helpers feature a callback used by the parent controller class.

``beforeRender()``

The beforeRender method is called after the controller's beforeRender
method but before the controller's renders views and layout.

Helper benutzen
---------------

Wenn du erst eimal einen Helper erstellt und in /app/views/helpers/
platziert hast, wirst du es in deinen Contoller mittels der
Spezialvariable $helpers einbauen können.

Und wenn du dies gemacht hast, kannst du deinen Hepler in jedem deiner
Views verwenden, indem du die Variable, die genau wieder Hepler heißt,
ansprichst:

::

    <!-- Einen Link mittels des neuen Helpers erstellen -->
    <?php echo $link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>

Der HTML-, Form- und Session-Helper (solange Sessions eingeschaltet
sind) sind immer verfügbar.

Eigene Funktionen für alle Helper erstellen
===========================================

Alle Helper erweitern (extend) die Klasse AppHelper (genauso, wie
Modelle die Klasse appModel erweitern und Controller die Klasse
AppController). Um nun eine Funktion für alle Helper zu erstellen,
erstelle einfach eine AppHelper-Klasse in /app/app\_helper.php.

::

    <?php
    class AppHelper extends Helper {
        function customMethod () {
        }
    }
    ?>

System Helper
=============

In CakePHP sind bereits einige Helper vorinstalliert, die dir bei der
Erstellen von Views helfen werden. Sie unterstüzten dich beim Schrebien
von wohlgeformten (well-formed) Markup, beim Formatieren von Text,
Zeiten und Zahlen. Sie können sogar die Geschwindigkeit deiner
Ajax-Anwendungen erhöhen. Hier ist eine Auflistung aller vorinstallieren
Helper. Für mehr Informationen siehe: `Core
Helpers </de/view/181/Core-Helpers>`_.

+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| CakePHP Helper                            | Beschreibung                                                                                                                                                                              |
+===========================================+===========================================================================================================================================================================================+
| `Ajax </de/view/208/AJAX>`_               | Kann benutzt werden um - Hand in Hand mit Prototype JavaScript - Ajax Funktionen in Views zu erstellen. Enthällt auch Funktionen für Drag & Drop, Ajax forms und Links und vieles mehr.   |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Cache </de/view/213/Cache>`_             | Kann benutz werden für Cache Inhalt.                                                                                                                                                      |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Form </de/view/182/Form>`_               | Erstellt HTML Forulare und Formularelemente, die eigenständig Validationsprobleme behandeln.                                                                                              |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Html </de/view/205/HTML>`_               | Bequemer Helper, um wohlgeformtes (well-formed) Markup zu schreiben. Bilder, Links, Tabelle, Header-Tags und vieles mehr.                                                                 |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Javascript </de/view/207/Javascript>`_   | Kann benutzt werden um Inhalte für JavaScript zu escapen, um Daten in JSON Objekte zu schreiben und formatiert Codeblocks.                                                                |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Number </de/view/215/Number>`_           | Zahlen- und Währungsformatierung.                                                                                                                                                         |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Paginator </de/view/496/Paginator>`_     | Sortierung und Nummerierung von Modelldaten.                                                                                                                                              |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Rss </de/view/494/RSS>`_                 | Einfacher Helper für RSS Feed und XML daten Ausgaben.                                                                                                                                     |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Session </de/view/484/Session>`_         | Helper um Sessioninformationen in Views zu schreiben.                                                                                                                                     |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Text </de/view/216/Text>`_               | Helper für Einfaches Verbinden und Hervorheben von Text, sowie automatische Zeilenumbrüch.                                                                                                |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Time </de/view/217/Time>`_               | Näherungsangaben, Schöne Sringformatierungen (Heute, 10:30) und Zeit Zonen Konvertionen.                                                                                                  |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Xml </de/view/380/XML>`_                 | Einfacher Helper um XML headers und Elemente zu erstellen.                                                                                                                                |
+-------------------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

