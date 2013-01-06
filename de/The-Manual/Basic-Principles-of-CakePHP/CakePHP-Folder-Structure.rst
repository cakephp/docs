CakePHP Ordnerstruktur
######################

Nachdem du CakePHP heruntergeladen und entpackt hast, solltest du diese
Dateien und Ordner sehen:

-  app
-  cake
-  vendors
-  .htaccess
-  index.php
-  README

 

Du wirst 3 Hauptordner bemerken:

-  Der *app*-Ordner ist der Ordner, in dem du deine Wunder wirkst: Hier
   werden deine Anwendungsdateien abgelegt.
-  Der *cake*-Ordner ist der Ordner in dem wir unsere Magie wirken
   lassen. Merke dir, in diesem Ordner keine Dateien oder Ordner zu
   verändern. Wenn du in diesem Kernbereich Veränderungen vornimmst,
   können wir dir bei der Lösung von Problemen nicht mehr weiterhelfen.
-  Der *vendors*-Ordner schließlich ist der Ort an dem du die
   *third-party PHP libraries* (Dritt-Anbieter PHP-Bibliotheken)
   ablegst, welche du für dein CakePHP benötigst.

Der App Ordner
==============

Der CakePHP’s app Ordner ist der Ort, in dem du den größten Teil deiner
Anwendungsentwicklung vornimmst. Lass uns einen genaueren Blick in den
Ordner werfen.

config
    Enthält die (wenigen) Konfigurationsdateien die CakePHP benötigt.
    Details der Datenbankverbindung, bootstrapping,
    Hauptkonfigurationsdateien und weiteres mehr sollte hier gespeichert
    sein.
controllers
    Enthält deine Anwendungscontroller und ihre Komponenten.
locale
    Beinhaltet Textdateien für die Internationalisierung (I18N).
models
    Enthält deine Anwendungsmodelle, behaviors und Datenquellen.
plugins
    Enthält plugin Pakete.
tmp
    Dies ist der Ort an dem CakePHP temporäre Daten ablegt. Wo aktuell
    die Daten gespeichert werden hängt davon ab, wie du CakePHP
    konfiguriert hast, aber dieser Ordner wird normalerweise dazu
    verwendet, um Modellbeschreibungen, Logdateien und manchmal auch
    Sessioninformationen zu speichern.

    Stelle sicher, dass dieses Verzeichnis existiert und Schreibrechte
    besitzt, anderenfalls wird die Ausführbarkeit deiner
    App::import('application') ernsthaft angeschlagen. Im *debug mode*,
    warnt dich CakePHP, wenn das nicht der Fall ist.

vendors
    Jede third-party Klasse oder Bibliothek kann hier abgelegt werden.
    Dies vereinfacht den Zugriff durch die Nutzung der
    App::import('vendor', 'name') Funktion. Einigen Beobachtern wird die
    als scheinbar überflüssig erscheinen, da es auf der obersten
    Verzeichnissebene bereits einen vendors Ordner in der
    Verzeichnisstruktur gibt. Wir werden später die Unterschiede dieser
    Ordner näher beleuchten, wenn wir über die Verwaltung mehrerer
    Anwendungen und komplexeren System-Setups sprechen.
views
    Präsentationsdatein sind hier abgelegt: Elemente, error pages,
    helpers, layouts und view Dateien.
webroot
    In einer Produktionsumgebung wird dieser Ordner für die
    Bereitstellung des Stammordners für deine Anwendung dienen. Weitere
    darin enthaltene Ordner dienen als Platzhalter für die
    Bereitstellung von CSS stylesheets, Bildern und JavaScript Dateien.

