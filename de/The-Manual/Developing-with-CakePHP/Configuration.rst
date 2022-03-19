Konfiguration
#############

 

Datenbank Konfiguration
=======================

CakePHP geht davon aus, dass Datenbank-Konfigurations-Details in einer
Datei unter app/config/database.php enthalten sind. Eine
Beispiel-Kofigurations-Datei kann unter app/config/database.php.default
gefunden werden. Eine fertige Konfig-Datei sollte in etwa
folgendermassen aussehen:

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'my_cakephp_project',
                         'prefix'      => '');

Der *$default*-Verbindung-Datensatz wird gebraucht, solange keine
weitere Verbindung durch *$useDbConfig*-Inhalte in ein Model
spezifiziert wurde.

zur Standart-DB verwenden, dann könnte man diese in den Models verwenden
in dem man einen neuen *$legacy*-Datensatz zum *$default*-Datensatz
hinzu fügt und die Einstellung var $useDbConfig = ‘legacy’; in den
entsprechenden Models.

Passe die folgenden Parameter/Schlüssel in Deinen
Konfigurations-Datensatz an Deine optimalen Anforderungen an:

+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Key                   | Value                                                                                                                                                                                                                                                                                                      |
+=======================+============================================================================================================================================================================================================================================================================================================+
| driver                | Der Name der Datenbank-Treiber, für welche diese Konfiguration gebraucht wird. Beispiele: mysql, postgres, sqlite, pear-drivername, adodb-drivername, mssql, oracle, oder odbc. Beachte, dies bei Nicht-Datenbank-Quellen (z.B. LDAP, Twitter) leer zu lassen und statt dessen "datasource" zu benutzen.   |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| persistent            | Eine beharrliche Verbindung zur Datenbank, ungeachtet dessen ob die genutzt wird oder nicht.                                                                                                                                                                                                               |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| host                  | Adresse des Datenbankservers (oder dessen IP-Adresse).                                                                                                                                                                                                                                                     |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| login                 | Der Benutzername zur DB.                                                                                                                                                                                                                                                                                   |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| password              | Das Passwort zum DB-Account.                                                                                                                                                                                                                                                                               |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| database              | Der Datenbankname, welcher bei dieser Verbindung benutzt wird.                                                                                                                                                                                                                                             |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefix (*optional*)   | Die Zeichenfolge welche Deine Datensätze in der Datenbank bezeichnet. Wenn Deine Datensätze keine Zeichenfolge haben, dann lass' diese Anweisung leer.                                                                                                                                                     |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| port (*optional*)     | Der TCP port oder Unix socket welcher möglicherweise gebraucht wird um eine Verbindung zu DB aufzubauen                                                                                                                                                                                                    |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| encoding              | Gibt an mit welchem Zeichensatz auf die Datenbank geschrieben wird. Dies ist standardmäßig das Standard-Encoding der Datenbank (außer DB2). Wenn Du das UTF-8-Encoding mit mysql/mysqli-Verbindungen nutzen möchtest, musst Du 'utf8' (ohne Anführungszeichen) verwenden.                                  |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| schema                | Wird in PostgreSQL Datenbanksetups genutzt um zu definieren welches Schema genutzt wird.                                                                                                                                                                                                                   |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| datasource            | nicht-DBO Datenquellen, z.B. 'ldap', 'twitter'                                                                                                                                                                                                                                                             |
+-----------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Die *prefix*-Einstellung ist nur für Tabellen(tables) und **nicht** für
Models. Zum Beispiel, wenn Du eine Zugangs-Tabelle für Deine "apfel" und
"birne" Models erstellst, dann sollte es *prefix\_apfel\_birne*
(**nicht** *prefix\_apfel\_prefix\_birne*) heißen, und setze Deine
*prefix-Einstellung* auf 'prefix\_'.

An diesem Punkt solltest Du einen Blick auf `CakePHP
Gepflogenheiten </de/view/22/cakephp-conventions>`_ werfen. Die korrekte
Benennung der Datensätze (und einiger zugehöriger Sparten) kann Dich
durch einige zusätzliche Funktionen belohnen und hilft Dir,
Konfiguration zu vermeiden.

BigBox, Deinen Controller BigBoxesController, dann arbeiten alle
automatisch zusammen. Falls möglich, nutze Unterstriche,
Einzahl(Singular) und Mehrzahl(Plural) für Deine Datensatz(table)-Namen
- zum Beispiel: baecker, konditor\_laden und leckere\_kuchen.

Core (Kern) Konfiguration
=========================

Anwendungs-Einstellungen bei CakePHP können in der Datei
/app/config/core.php gefunden werden. Diese Datei ist eine Ansammlung
von Einstellungs-Klassen für variable Definitionen und konstante
Definitionen welche bestimmen, wie Deine Anwendung sich verhält. Bevor
wir jetzt in diese Variablen abtauchen, solltest Du Dich erst mit der
Einstellung von CakePHPs Einstellungs-Registry-Klassen vertraut machen.

Die Konfigurations Klasse
=========================

Trotz weniger Dinge, die in CakePHP konfiguriert werden müssen, ist es
manchmal nützlich, Deine eigenen Konfigurationsregeln für Deine
Anwendung zu haben. In der Vergangenheit magst Du zwar einige
benutzerdefinierte Einstellungen durch das definieren von Variablen und
Konstanten in einigen Dateien eingestellt haben. Diese Vorgehensweise
zwingt Dich allerdings dazu, diese Konfigurations-Dateien immer wieder
einzufügen, wenn Du diese Angaben brauchst.

CakePHP’s neue Konfig-Klasse kann dazu genutzt werden um Anwendungs-
oder Laufzeitspezifische Angaben zu speichern oder abzurufen. Sei
vorsichtig - diese Klasse erlaubt es Dir darin alles abzulegen und
überall im Code anzuwenden: Eine klare Versuchung, das MVC-Muster zu
unterwandern - und damit das, wozu CakePHP eigentlich gemacht wurde. Das
Primärziel der Konfigurations-Klassen liegt darin, zentralisierte
Variablen bereitzustellen, die von vielen Objekten geteilt werden.
Versuche Dir das Konzept der "Konvention vor Konfiguration" immer im
Hinterkopf zu behalten und Du wirst die MVC-Struktur beibehalten, die
wir entworfen haben.

Die folgende Klasse fungiert als einzellige Menge (singleton) und ihre
Methoden können von überall aus Deiner Anwendung in einem festen
Zusammenhang aufgerufen werden.

::

    <?php Configure::read('debug'); ?>

Configure Methods
-----------------

write
~~~~~

``write(string $key, mixed $value)``

Nutze ``write()``, um Daten in der Konfiguration Deiner Anwendung zu
speichern.

::

    Configure::write('Company.name','Pizza GmbH');
    Configure::write('Company.slogan','Pizza für den Körper und die Seele');

Die Verwendung der Punkt Notation im ``$key`` Parameter. Nutze diese
Notation um Deine Konfiguration in logischen Gruppen zu verwalten.

Das obige Beispiel könnte auch mit einem einzigen Aufruf geschrieben
werden:

::

    Configure::write(
        'Company',array('name'=>'Pizza GmbH','slogan'=>'Pizza für den Körper und die Seele')
    );

Du kannst ``Configure::write('debug', $int)`` benutzen, um zwischen
Debugmodus und Produktivumgebung zu wechseln. Das ist besonders
praktisch bei AMF- oder auch SOAP-Interaktion, bei welchen die
Debugging-Information Probleme verursachen kann.

read
~~~~

``read(string $key = 'debug')``

Wird benutzt, um Daten aus der Konfiguration der Anwendung zu lesen.
Enthält standardmäßig CakePHP’s wichtigen "debug"-Wert. Wird ein
Schlüssel übergeben, werden dessen Daten zurückgegeben. Wenn wir unser
Beispiel zu write() von oben verwenden, können wir die Daten so wieder
auslesen:

::

    Configure::read('Company.name');    //yields: 'Pizza GmbH'
    Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'
     
    Configure::read('Company');
     
    //Rückgabewert: 
    array('name' => 'Pizza GmbH', 'slogan' => 'Pizza for your body and soul');

delete
~~~~~~

``delete(string $key)``

Wird benutzt, um Informationen aus der Konfiguration Deiner Anwendung zu
löschen.

::

    Configure::delete('Company.name');

load
~~~~

``load(string $path)``

Benutze diese Methode um Konfigurations-Informationen aus einer Datei zu
laden.

::

    // /app/config/messages.php:
    <?php
    $config['Company']['name'] = 'Pizza, Inc.';
    $config['Company']['slogan'] = 'Pizza für deine Seele und deinen Körper.';
    $config['Company']['telefon'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Company.name');
    ?>

Jedes Schlüssel-Wert-Paar wird in der Datei durch das ``$config``-Array.
Alle anderen Variablen in der Datei werden durch die ``load()``-Methode
ignoriert.

version
~~~~~~~

``version()``

Gibt die Version der aktuell installierten CakePHP Version zurück.

CakePHP Kernkonfiguration
-------------------------

Die Klasse *Configure* wird benutzt, um einen Satz von Variablen mit
CakePHPs Kernconfiguration zu verwalten. Diese Variablen findet man in
app/config/core.php. Es folgt eine Beschreibung der Variablen und
inwiefern sie CakePHP-Anwendung beeinflussen.

+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Konfigurationsvariable        | Beschreibung                                                                                                                                                                                                                                                      |
+===============================+===================================================================================================================================================================================================================================================================+
| debug                         | Beeinflusst die Menge an *debug*-Ausgaben.                                                                                                                                                                                                                        |
|                               |  0 = Produktionsmodus. Keine Debug-Ausgaben.                                                                                                                                                                                                                      |
|                               |  1 = Zeige Fehler- und Warnmeldungen.                                                                                                                                                                                                                             |
|                               |  2 = Zeige Fehler- und Warnmeldungen sowie eine Übersicht über die ausgeführten SQL-Anfragen.                                                                                                                                                                     |
|                               |  3 = Zeige Fehler- und Warnmeldungen, eine Übersicht über die ausgeführten SQL-Anfragen und eine komplette Auflistung der Kontroller-Klasse.                                                                                                                      |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| App.baseUrl                   | Entferne die Kommentare für diese Zeile, wenn du *Apaches mod\_rewrite* **nicht** verwenden willst. Vergesse nicht, auch deine .htaccess-Dateien zu entfernen.                                                                                                    |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Routing.admin                 | Entferne die Kommentare für diese Zeile, wenn du die CakePHP *Admin Routes* verwendne willst. Setze diese Variable dann auf den Namen der Admin-Route, die du verwenden möchtest. Weitere Informationen zum Admin Routing findest du in den folgenden Kapiteln.   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Cache.disable                 | Wenn diese Variable auf *true* gesetzt ist, wird das *Caching* applikationsweit abgeschalten.                                                                                                                                                                     |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Cache.check                   | Wenn diese Variable auf *true* gesetzt ist, wird das *View Caching* aktiviert. Du musst das *View Caching* immer noch in deinem Kontroller aktivieren, aber erst mit dieser Variable werden diese Einstellungen berücksichtigt.                                   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.save                  | Legt denn Speichermechanismus für die Sessions fest.                                                                                                                                                                                                              |
|                               |  php = Benutze den standardmäßigen Speichermechanismus von PHP.                                                                                                                                                                                                   |
|                               |  cache = Benutze die *Caching engine* (konfiguriert mit Cache::config()). Sehr nützlich in Zusammenarbeit mit Memcache (in Installationen mit mehreren Applikationsservern) um dort sowohl die gecachten Daten als auch die Sessions zu speichern.                |
|                               |  cake = Speichere Sitzungsdaten in /app/tmp                                                                                                                                                                                                                       |
|                               |  database = Speichere die Sitzungdaten in einer Datenbanktabelle. Stelle sicher, dass du die Datenbanktabellen mit der SQL-Dateien in /app/config/sql/sessions.sql eingerichtet hast.                                                                             |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.table                 | Der Name der Tabelle (ohne irgendein Prefix), die die Sitzungsdaten speichert.                                                                                                                                                                                    |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.database              | Der Name der Datenbank, die die Sitzungsdaten speichert.                                                                                                                                                                                                          |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.cookie                | Der Name des Cookies, mit dem die Zuordnung zur entsprechenden Sitzung hergestellt wird.                                                                                                                                                                          |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.timeout               | Ablaufzeit der Sitzung in Sekunden. Achtung: Die wirkliche Ablaufzeit der Sitzung hängt von Security.level ab.                                                                                                                                                    |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.start                 | Starte die Sitzung automatisch, wenn es auf *true* gesetzt ist.                                                                                                                                                                                                   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.checkAgent            | Wenn die Variable *false* ist, wird CakePHP in den Sessions nicht sicher stellen, dass der User-Agent zwischen zwei Anfragen nicht geändert hat.                                                                                                                  |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security.level                | Der Grad der Sicherheit von CakePHP. Die Ablaufzeit der Sitzung (wie sie in 'Session.timeout' definiert wurde), wird je nach Wert dieser Einstellung mit dem entsprechenden Wert multipliziert .                                                                  |
|                               |  Gültige Werte:                                                                                                                                                                                                                                                   |
|                               |  'high' = x 10                                                                                                                                                                                                                                                    |
|                               |  'medium' = x 100                                                                                                                                                                                                                                                 |
|                               |  'low' = x 300                                                                                                                                                                                                                                                    |
|                               |  'high' und 'medium' aktivieren auch die PHP-Einstellung `session.referer\_check <https://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_                                                                                            |
|                               |  Wenn 'Security.level' auf 'high' gestellt ist, werden die Session-IDs von CakePHP außerdem zwischen zwei Anfragen neu generiert.                                                                                                                                 |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security.salt                 | Ein zufälliger String, der für das Hashing in den Sicherheitsfunktionen benutzt wird.                                                                                                                                                                             |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Acl.classname, Acl.database   | Konstaten, die für CakePHPs *Access Control Listen* verwendet werden. Mehr Informationen im Kapitel *Access Control Lists*.                                                                                                                                       |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Die Cache-Konfiguration findet sich auch in core.php - wir sprechen das
später nochmal an, also bleib dran.

Die Klasse *Configure* kann benutzt werden, um die Kernkonfiguration "im
Fluge" (also mitten in deiner Anwendung) zu ändern. Das kann zum
Beispiel dann besonders praktisch sein, wenn du die
*Debug*-Einstellungen für einen bestimmten Bereich deiner Anwendung
aktivieren möchtest.

Konfigurationskonstanten
------------------------

Obwohl die meisten Konfigurationseinstellungen über Configure gesetzt
werden, gibt es ein paar Konstanten, die CakePHP während der Laufzeit
benutzt.

+--------------+--------------------------------------------------------------------------------------------------------------------------------------------------------+
| Konstante    | Beschreibung                                                                                                                                           |
+==============+========================================================================================================================================================+
| LOG\_ERROR   | Fehlerkonstanten. Diese Konstante wird benutzt um Fehlerausgabe und Debuggingausgabe zu differenzieren. Aktuell wird LOG\_DEBUG von PHP unterstützt.   |
+--------------+--------------------------------------------------------------------------------------------------------------------------------------------------------+

Die App Klasse
==============

Mit CakePHP zusätzliche Klassen zu laden ist recht einfach geworden. In
vorherigen Versionen gab es noch verschiedene Funktionen für
unterschiedliche Arten von Klassen. Diese Funktionen sind mittlerweile
veraltet. Das laden von Klassen und Bibliotheken sollte über
App::import() laufen. App::import() stellt sicher, dass eine Klasse nur
einmal geladen wird, dass die entsprechende Überklasse geladen wurde und
findet die richtigen Pfade in den meisten Fällen automatisch.

Benutzung von App::import()
---------------------------

``App::import($type, $name, $parent, $search, $file, $return);``

Auf den ersten Blick sieht ``App::import`` sehr komplex aus, aber in den
meisten Fällen sind nur zwei Argumente nötig.

Importieren von Kern-Bibliotheken
---------------------------------

Kern-Bibliotheken wie Sanitize oder Xml können wie folgt geladen werden:

::

    App::import('Core', 'Sanitize');

Diese Zeile Code stellt die Sanitize-Klasse bereit.

Importieren von Controllers, Models, Components, Behaviors und Helpers
----------------------------------------------------------------------

Sämtliche mit der Anwendung verbundenen Klassen sollten mit
App::import() geladen werden. Die folgenden Beispiele zeigen wie.

Laden eines Controllers
~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MyController');``

Das Aufrufen von ``App::import`` ist ist gleichbedeutend mit dem Befehl
``require``. Wichtig ist, dass eine importierte Klasse trotzdem
initialisiert werden muss.

::

    <?php
    // Gleichbedeutend mit require('controllers/users_controller.php');
    App::import('Controller', 'Users');

    // Initialisierung der Klasse
    $Users = new UsersController;

    // Zum laden der Model-Associations, Komponenten, etc.
    $Users->constructClasses();
    ?>

Laden eines Model
~~~~~~~~~~~~~~~~~

``App::import('Model', 'MyModel');``

Einbinden von Komponenten
~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

Einbinden von Verhalten (Behavior)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Einbinden von Helfern (Helpers)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Einbinden von Helfern (Helpers)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Laden von Klassen in einem Plugin
---------------------------------

Das Laden von Klassen in einem Plugin funktioniert ähnlich, wie das
Laden von Anwendungs- oder Kern-Klassen, bis auf die Angabe, von welchem
Plugin die Klasse geladen werden soll.

::

    App::import('Model', 'PluginName.Comment');

Laden von Vendor-Dateien
------------------------

Die vendor() Funktion ist veraltet. Vendor-Dateien sollten ebenfalls mit
App::import() geladen werden. Syntax und Argumente unterscheiden sich
minimal vom Laden anderer Klassen, da Vendor-Klassen sehr
unterschiedlich aussehen können und nicht unbedingt Klassen beinhalten
müssen.

Die folgenden Beispiele veranschaulichen, wie Vendor-Klassen aus
unterschiedlichen Pfaden geladen werden. Die Vendor-Dateien könnten in
jedem Vedor-Verzeichnis liegen.

Vendor-Beispiele
~~~~~~~~~~~~~~~~

Zum Laden von **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

Zum laden von **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

Zum laden von **vendors/irgendein.name.php**

::

    App::import('Vendor', 'IrgendeinName', array('file' => 'irgendein.name.php'));

Zum laden von **vendors/services/toller.name.php**

::

    App::import('Vendor', 'TollerName', array('file' => 'services'.DS.'toller.name.php'));

Routen Konfiguration
====================

*Routing* ist eine Funktion die URLs schneller zum controller führt. Sie
wurde hinzugefügt zu CakePHP um "schmutzige" URL\`s konfigurierbarer und
flexibler zu machen. Apache’s *mod\_rewrite* wird nicht gebraucht um
Routen zu benutzen, aber dadurch wird deine Adresszeile deutlich
aufgeräumter.

Routen wurde in CakePHP 1.2 ausgebaut und kann sehr mächtig sein.

Vordefinierte Routen
--------------------

Bevor du lernst wie man eigene Routen definiert, ist es wichtig zu
wissen, dass CakePHP einige vordefinierte Routen hat. Mit den
vordefinierten Routen von CakePHP kommt man in den meisten Applikationen
schon ziemlich weit. Du kannst auf eine Aktion direkt zugreifen indem du
den Namen der Aktion direkt in der URL angibst. Man kann auch die
Parameter die für die Aktion möglich sind direkt in der URL angeben.

::

        URL Muster durch die vordefinierten Routen:
        http://example.com/controller/action/param1/param2/param3

Die URL /posts/view zeigt direkt auf die view() Aktion (und auch
Methode) des ``PostsController``, und /products/view\_clearance zeigt
auf die viewClearance() Aktion bzw. Methode des ``ProductsController``.
Ist keine Aktion in der URL angegeben so wird die index() Aktion
implizit benutzt.

Mit den vordefinierten Routen ist es möglich über die URL Parameter an
die Aktion zu übergeben. Eine Anfrage wie /posts/view/25 würde die
Aktion view() des PostsControllers mit dem Parameter 25 aufrufen:
view(25).

Übergebene Argumente
--------------------

Übergebene Argumente sind zusätzliche Argumente oder Pfadteile, die beim
Erstellen einer Anfrage häufig benutzt werden, um Parameter an die
Controller-Methoden zu übergeben.

::

    http://localhost/calendars/view/recent/mark

Im obigen Beispiel sind sowohl ``recent`` als auch ``mark`` übergebene
Argumente an ``CalendarsController::view()``. Es gibt insgesamt drei
Möglichkeiten,auf zusätzliche Argumente im Controller zuzugreifen:
Erstens als Argumente der aufgerufenen Action(-methode), zweitens über
``$this->params['pass']`` (als numerisch indiziertes Array) oder
drittens in ``$this->passedArgs`` in derselben Form wie in der zweiten
Variante. Es ist über individuelle Routes auch möglich, bestimmte
Parameter in "zusätzliche Argumente" umzuwandeln, siehe `passing
parameters to an
action </de/view/945/Routes-Configuration#Passing-parameters-to-action-949>`_
für weitere Informationen dazu.

**Argumente der aufgerufenen Action**

::

    CalendarsController extends AppController{
        function view($arg1, $arg2){
            debug($arg1);
            debug($arg2);
            debug(func_get_args());
        }
    }

Das wird Folgendes ergeben:

::

    recent

::

    mark

::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->params['pass'] als numerisch indizierter Array**

::

    debug($this->params['pass'])

Das ergibt...

::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->passedArgs als numerisch indiziertes Array**

::

    debug($this->passedArgs)

::

    Array
    (
        [0] => recent
        [1] => mark
    )

$this->passedArgs kann auch benannte Parameter (engl. "named
parameters") enthalten, die sich dann in einem Array mit numerischen und
nicht-numerischen Keys bemerkbar machen.

Benannte Parameter
------------------

In CakePHP 1.2 ist die Möglichkeit benannte Parameter zu benutzen neu
hinzugekommen. Man kann nun die Parameter benennen und die Werte mit
Namen über die URL an den Controller senden. Beispielsweise würde eine
Anfrage wie /posts/view/titel:erster+eintrag/Kategorie:allgemein einen
Aufruf von der view() Aktion des PostsController zur Folge haben. In
dieser Aktion fände man die Parameter "titel" und "kategorie" im Array
$this->passedArgs[‘titel’] und $this->passedArgs[‘kategorie’].

::

    Einige Beispiele wie die URL mit vordefinierten Routen ausgewertet wird:
        
    URL: /affen/spring
    Mapping: AffenController->spring();
     
    URL: /produkte
    Mapping: produkteController->index();
     
    URL: /aufgabe/view/45
    Mapping: AufgabenController->view(45);
     
    URL: /spenden/view/neueste/2001
    Mapping: SpendenController->view('neueste', '2001');

    URL: /contents/view/kapitel:modelle/abschnitt:vereinigung
    Mapping: ContentsController->view();
    $this->passedArgs['kapitel'] = 'models';
    $this->passedArgs['abschnitt'] = 'vereinigung';

Benutzerdefinierte Routen definieren
------------------------------------

Das Definieren eigener Routes erlaubt es, festzulegen, wie eine
Applikation auf eine gegebene URL antwortet. routes werden in
/app/config/routes.php über ``Router::connect()`` definiert.

Die Methode ``Router::connect()`` übernimmt bis zu drei Parameter: das
abzugleichende URL-Muster, Vorgabewerte für die Elemente der neuen Route
und REGEX-Regeln für einzelne Elemente der URL.

Das Grundgerüst einer Routedefinition siehte wie folgt aus:

::

    Router::connect(
        'URL',
        array('Name eines Parameters' => 'Vorgabewert'),
        array('Name eines Parameters' => 'zugehöriges Muster')
    )

Der erste Parameter teilt dem Router mit, auf welche URLs sich die neue
Route beziehen soll. Die URL ist ein normaler, durch Schrägstriche
eingerahmter String. Er darf jedoch durchaus Wildcards oder dynamische
Elemente (Variablennamen mit einem Doppelpunkt gekennzeichnet)
enthalten. Wildcards ermöglichen der Route, beliebig viele URLs eines
Typs zu erfassen, während dynamische Elemente es ermöglichen, Paramter
für die Controller-Actions zu extrahieren.

Die beiden letzteren Parameter von ``Router::connect()`` legen fest, was
mit der Anfrage geschehen soll, wenn die Route auf die URL angewandt
werden soll. Der zweite Parameter ist ein assoziatives Array, dessen
Schlüssel nach den dynamischen Elementen in der URL oder nach
Standardelementen (:controller, :action und :plugin) benannt sein sind.
Die zugehörigen Werte sind die entsprechenden Vorgaben. Schauen wir uns
einige einfache Beispiele an, bevor wir uns mit dem dritten Parameter
von ``Router::connect()`` beschäftigen.

::

    Router::connect(
        '/pages/*', //URL-Muster
        array('controller' => 'pages', 'action' => 'display')
        // Der Controller ist "pages" und die Action "display", was 
        // hier nicht überschrieben werden kann
    );

Genau diese Route befindet sich in routes.php Zeile 40, die mit CakePHP
ausgeliefert wird (Standardroute). Sie wird auf alle URLs, die mit
/pages/ beginnen, angewendet und ruft die
``display()PagesController()/pages/products würde beispielsweise zu Pagescontroller::display('products')``
aufgelöst werden.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', <strong>5</strong>)
    );

Dieses zweite Beispiel zeigt eine exemplarische Verwendung des zweiten
Parameters von ``Router::connect()``, nämlich um Standardparameter
festzulegen. Angenommen eine Seite bietet Produkte für verschiedene
Kategorien von Kunden an. Dann bietet sich beispielsweise eine Route á
la /government eher als/ als Ersatz zu /products/display/5 an.

Eine andere häufig genutzte Möglichkeit einer Route ist die Definition
von Stellvertretern ("Aliase") für Controller. Sagen wir, statt der
regulären URL /users/someAction/5 wollen wir den Zugriff über
/cooks/someAction/5 vornehmen, dann lässt sich das ganz einfach mit
Hilfe der folgenden Route lösen:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

Das bewirkt, dass jede URL, die mit /cooks/ beginnt, an den
Users-Controller weitergereicht wird.

Bei der Generierung von URLs werden Routes ebenfalls genutzt ("Reverse
Routing").
``array('controller' => 'users', 'action' => 'someAction', 5)`` als URL
wird zu /cooks/someAction/5 aufgelöst, sofern die obige Route die erste
auf diese URL passende Route ist.

Sowohl beim Routing als auch beim Reverse Routing wird immer die erste
"passende" Route für die Auflösung/Generierung benutzt, d.h es empfiehlt
sich, die **speziellen/restriktiven Routen am Anfang** und die
**allgemeinen Routen am Ende** zu definieren, sodass eine allgemeine
Route keine spezielle Route überdecken kann.

Wenn benutzerdefinierte dynamische benannte (engl. "named") Argumente in
einer Route benutzt werden, muß das dem Router über
``Router::connectNamed`` mitgeteilt werden. Wenn also in obiger Route
URLs des Typs /cooks/someAction/type:chef erfasst werden sollen, wird
das wie folgt realisiert:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

Es ist möglich, eigene Elemente in der Route zu definieren. Dadurch
ergibt sich die Möglichkeit, Stellen in der URL festzulegen, an denen
Parameter für Controller-Actions liegen. Wenn eine Anfrage bearbeitet
wird, finden sich die Werte dieser Elemente in ``$this->params`` des
Controllers wieder. Dies steht im Gegensatz zu benannten Parametern:
benannte Parameter (/controller/action/name:value$this->passedArgs oder
auch ``$this->params['named']`` angesprochen, wohingegen
benutzerdefinierte Elemente nur über ``$this->params`` zugänglich sind.
Wenn ein benutzerdefiniertes Element benutzt wird, muss auch ein
regulärer Ausdruck hinzugefügt werden. Diese Information verwendet
CakePHP zur Erstellung des mit der Route definierten Musters, welches
wiederum zum Abgleich mit den URLs benötigt wird.

Die Trennung von *benutzerdefinierten Elementen* und *benannten
Parametern* mag auf den ersten Blick verwirren. *Benutzerdefinierte
Elemente* sind nichts Anderes als (script- aber nicht clientseitig
benannte) positionsabhängige Argumente und auf sie wird daher über
``$this->params`` zugegriffen. Auf *positionsabhängige, unbenannte
Argumente* greift man entweder direkt über die Funktionsargumente der
Action zu oder über ``$this->params['pass']`` oder ``$this->passedArgs``
*Benannte Parameter* hingegen sind nicht zwingend erforderlich
(zumindest nicht für das Matching des Routers) und besitzen keine feste
Position, daher werden sie über ``$this->passedArgs`` und
``$this->params['named']`` übergeben. Es ist wichtig zu wissen, dass
*benutzerdefinierte Elemente* im Gegensatz zu *positionsabhängigen,
unbenannten Argumenten* **nicht** über ``$this->passedArgs``, sondern
nur über ``$this->params`` übergeben werden.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

Dieses einfache Beispiel veranschaulicht, wie man schnell einen Weg
ebnen kann, um Models von einem beliebigen Controller über eine URL des
Typs /controllername/id zu betrachten. Die an ``Router::connect()``
übergebene URL definiert zwei Routen-Elemente: :controller und :id. Das
Element :controller ist ein Standard-CakePHP-Routenelement, das den
Router anweist, den dort befindlichen String als Controllernamen zu
interpretieren. Das :id-Element ist ein *benutzerdefiniertes Element*
und muss daher anschließend mit einem zugehörigen regulären Ausdruck im
dritten Parameter von ``Router::connect()`` definiert werden. (CakePHP
benötigt den regulären Ausdruck, um die ID von ihrer Umgebung
unterscheiden zu können)

Mit dieser Route wird ein Zugriff auf /apples/5 zu apples/view/5. Beides
ruft ``ApplesController::view()`` auf. Innerhalb dieser view()-Methode
greift man auf die ID über ``$this->params['id']`` oder auch
``$this->passedArgs['id']`` zu.

Wenn nur ein einzelner Controller in der Applikation verendwet wird und
aus Gründen der Einfachheit nicht in der URL auftauchen soll, sprich aus
/home/demo soll /demo werden, dann könnte die Lösung etwa so aussehen:

::

     Router::connect('/:action', array('controller' => 'home')); 

Noch ein Beispiel:

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

Das ist schon eher kompliziert, zeigt aber seher anschaulich, wie
mächtig Routes eingesetzt werden können. Die URL oben hat vier
Routen-Elemente: Der erste kommt uns bekannt vor: Es ist ein
Standard-Routenelement, das CakePHP als Controllername verwendet. Die
anderen drei sind erst einmal nur dynamische Elemente der URL, auf die
gleich noch Bezug genommen wird.

Als Nächstes werden einige Vorgabewerte definiert. Unabhängig vom
Controller soll die ``*::index()`` Methode aufgerufen werden - also wird
sie kurzerhand als Standard und nicht überschreibbar (da sie nicht in
der URL auftaucht) definiert. Der Day-Parameter (deutsch: Tag), das
vierte Element in der URL) wird per default auf null gesetzt und ist
damit optional.

Zum Schluß werden einige reguläre Ausdrücke für die Jahre, Monate und
Tage in numerischer Form festgelegt. Es ist anzumerken, dass
**Klammerung (Gruppierung)** in diesen regulären Ausdücken **nicht
erlaubt** ist.

Diese Route wird auf /articles/2007/02/01, /posts/2004/11/16 und
/products/2001/05 angewandt (der Day-Parameter ist als optional
definiert) und leitet die Anfragen an die index()-Actions der
entsprechenden Controller weiter, wobei sie die Parameter u.a. in
``Controller::params['pass']`` zur Verfügung stellt.

Passing parameters to action
----------------------------

Assuming your action was defined like this and you want to access the
arguments using ``$articleID`` instead of ``$this->params['id']``, just
add an extra array in the 3rd parameter of ``Router::connect()``.

::

    // some_controller.php
    function view($articleID = null, $slug = null) {
        // some code here...
    }

    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // order matters since this will simply map ":id" to $articleID in your action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

And now, thanks to the reverse routing capabilities, you can pass in the
url array like below and Cake will know how to form the URL as defined
in the routes.

::

    // view.ctp
    // this will return a link to /blog/3-CakePHP_Rocks
    <?php echo $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )); ?>

Routen mit Präfix
-----------------

Viele Anwendungen benötigen eine Administrationsoberfläche in der
privilegierte Benutzer Änderungen vornehmen können. Oft wird das über
eine spezielle URL wie zum Beispiel /admin/users/edit/5 geregelt. In
CakePHP ist ein spezielles Adminrouting eingebaut. Es kann in der
Kern-Konfigurationsdatei (core) aktiviert werden, indem man die
Einstellung Routing.admin setzt:

::

    Configure::write('Routing.admin', 'admin');

Wenn Adminrouting aktiviert ist, werden Aktionen mit dem Präfix
``admin_`` aufgerufen. Wird beispielsweise die URL /admin/users/edit/5
angefragt, dann wird die Methode ``admin_edit`` des ``UsersController``
mit 5 als Parameter aufgerufen.

Die URL /admin kann durch folgende Route an die ``admin_index`` Aktion
des Pages Controller gebunden werden:

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

Es können auch multiple Präfixe verwendet werden:

::

    Router::connect('/profiles/:controller/:action/*', array('prefix' => 'profiles', 'profiles' => true)); 

Jede beliebige Anfrage an die URL '/Profiles/...' sucht nach
``profiles_`` Präfixen im Methodenaufruf des Controllers. In unserem
Beispiel würde die URL /profiles/users/edit/5 die Methode
``profiles_edit`` im ``UsersController`` aufrufen. Es ist sehr wichtig,
dass der HtmlHelper benutzt wird um die Links zu erzeugen. Dann werden
die Präfixaufrufe automatisch umgesetzt. Hier ein Beispiel wie die Links
mit dem HtmlHelper generiert werden können:

::

    echo $html->link('Edit your profile', array('profiles' => true, 'controller' => 'users', 'action' => 'edit', 'id' => 5)); 

Es können mehrere Routen mit Präfixen erstellt werden um eine flexible
URL Struktur in der Anwendung zu erreichen.

Plugin routing
--------------

Plugin routing uses the **plugin** key. You can create links that point
to a plugin, but adding the plugin key to your url array.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Conversely if the active request is a plugin request and you want to
create a link that has no plugin you can do the following.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

Dateiendungen
-------------

Um verschiedene Dateiendungen mit den Routen verarbeiten zu können muss
man folgende Extrazeile in der Routenkonfiguration hinzufügen:

::

    Router::parseExtensions('html', 'rss');

Diese Zeile sagt dem Router, dass er alle passenden Dateiendungen
entfernen und dann den Rest verarbeiten soll.

Wenn du eine URL wie zum Beispiel /page/name-der-seite.html erzeugen
wolltest, dann würde man folgende Routen anlegen:

::

        Router::connect(
            '/page/:title',
            array('controller' => 'pages', 'action' => 'view'),
            array(
                'pass' => array('title')
            )
        );  

Um links zu erzeugen die zurück auf die Route zeigen, kann man einfach
folgendes benutzen:

::

    $html->link('Link title', array('controller' => 'pages', 'action' => 'view', 'title' => Inflector::slug('text to slug', '-'), 'ext' => 'html'))

[STRIKEOUT:]

Custom Route classes
--------------------

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A route class should
extend ``CakeRoute`` and implement one or both of ``match()`` and
``parse()``. Parse is used to parse requests and match is used to handle
reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route before
trying to use it.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

This route would create an instance of ``SlugRoute`` and allow you to
implement custom parameter handling

Beugungen
=========

Cake's Namenskonventionen können sehr nett sein - nenne deine
Datenbanktabelle big\_boxes, dein Model BigBox, deinen Controller
BigBoxesController und alles wird ganz automatisch zusammenarbeiten.
CakePHP weiß, wie es diese Dinge zusammenbringt, indem es die Wörter zum
Plural und Singular *beugt*.

Es gibt Gelegenheiten (besonders für unsere Freunde, die nicht Englisch
sprechen), bei denen man in Situationen gerät, wo CakePHP's Inflector
(das ist die Klasse, die Plural- und Singualformen, camelCased- und
Unterstrichsversionen bildet) vielleicht nicht so arbeitet, wie man es
sich wünscht. Wenn CakePHP deine Foci oder Bücher nicht erkennt,
editiere die Konfigurationsdatei für den Inflector, um CakePHP deine
Spezialfälle mitzuteilen. Du kannst die Datei unter
/app/config/inflections.php finden.

In dieser Datei findest du sechs Variablen. Jede von ihnen erlaubt dir
das Verhalten des CakePHP Inflector abzustimmen.

+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| inflections.php Variable   | Beschreibung                                                                                                                                                                                                                                            |
+============================+=========================================================================================================================================================================================================================================================+
| $pluralRules               | Dieses Array enthält Regeln in Form von regulären Ausdrücken für die Bildung von Pluralformen von Spezialfällen. Die Schlüssel des Arrays sind Muster und die Werte deren Ersetzung.                                                                    |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedPlural         | Ein Array, das Wörter beinhaltet die nicht modifiziert werden müssen um den Plural zu bilden (endungsloser Plural, etc.).                                                                                                                               |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularPlural           | Ein Array, das Wörter und deren Pluralform enthält. Die Schlüssel des Arrays enthalten die Singularform, die Werte die Pluralform. Dieses Array sollte für Wörter benutzt werden, die nicht den Regeln, die in $pluralRules definiert wurden, folgen.   |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $singularRules             | Es gilt dasselbe wie für $pluralRules, mit der Ausnahme, dass dieses Array die Regeln zum Bilden der Singularform enthält.                                                                                                                              |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedSingular       | Es gilt dasselbe wie für $uninflectedPlural, mit der Ausnahme, dass dieses Array Wörter beinhaltet, die keine Singularform haben. Standartmäßig ist dies mit $uninflectedPlural gleichgesetzt.                                                          |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularSingular         | Es gilt dasselbe wie für $irregularPlural, mit der Ausnahme, dass es sich um Wörter im Singular handelt.                                                                                                                                                |
+----------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Bootstrapping CakePHP
=====================

If you have any additional configuration needs, use CakePHP’s bootstrap
file, found in /app/config/bootstrap.php. This file is executed just
after CakePHP’s core bootstrapping.

This file is ideal for a number of common bootstrapping tasks:

-  Defining convenience functions
-  Registering global constants
-  Defining additional model, view, and controller paths

Be careful to maintain the MVC software design pattern when you add
things to the bootstrap file: it might be tempting to place formatting
functions there in order to use them in your controllers.

Resist the urge. You’ll be glad you did later on down the line.

You might also consider placing things in the AppController class. This
class is a parent class to all of the controllers in your application.
AppController is a handy place to use controller callbacks and define
methods to be used by all of your controllers.
