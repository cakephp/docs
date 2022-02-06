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
Zum Beispiel, wenn meine Anwendungen eine zweite Datenbank zusätzlich
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
Zum Beispiel wenn Du Deine Datenbank big\_boxes nennst, Dein Model
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
|                               |  'high' und 'medium' aktivieren auch die PHP-Einstellung `session.referer\_check <https://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_                                                                                             |
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

Defining Routes
---------------

Defining your own routes allows you to define how your application will
respond to a given URL. Define your own routes in the
/app/config/routes.php file using the ``Router::connect()`` method.

The ``connect()`` method takes up to three parameters: the URL you wish
to match, the default values for your route elements, and regular
expression rules to help the router match elements in the URL.

The basic format for a route definition is:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

The first parameter is used to tell the router what sort of URL you're
trying to control. The URL is a normal slash delimited string, but can
also contain a wildcard (\*) or route elements (variable names prefixed
with a colon). Using a wildcard tells the router what sorts of URLs you
want to match, and specifying route elements allows you to gather
parameters for your controller actions.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has been
matched. The second parameter is an associative array. The keys of the
array should be named after the route elements in the URL, or the
default elements: :controller, :action, and :plugin. The values in the
array are the default values for those keys. Let's look at some basic
examples before we start using the third parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and hands it
to the ``display()`` method of the ``PagesController();`` The request
/pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site that
features products for different categories of customers, you might
consider creating a route. This allows you link to /government rather
than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of that:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/ should be
sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as a url
will output /cooks/someAction/5 if the above route is the first match
found

If you are planning to use custom named arguments with your route, you
have to make the router aware of it using the ``Router::connectNamed``
function. So if you want the above route to match urls like
``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

You can specify your own route elements, doing so gives you the power to
define places in the URL where parameters for controller actions should
lie. When a request is made, the values for these route elements are
found in $this->params of the controller. This is different than named
parameters are handled, so note the difference: named parameters
(/controller/action/name:value) are found in $this->passedArgs, whereas
custom route element data is found in $this->params. When you define a
custom route element, you also need to specify a regular expression -
this tells CakePHP how to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view models
from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two route
elements: :controller and :id. The :controller element is a CakePHP
default route element, so the router knows how to match and identify
controller names in URLs. The :id element is a custom route element, and
must be further clarified by specifying a matching regular expression in
the third parameter of connect(). This tells CakePHP how to recognize
the ID in the URL as opposed to something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same as
requesting /apples/view/5. Both would call the view() method of the
ApplesController. Inside the view() method, you would need to access the
passed ID at ``$this->params['id']``.

One more example, and you'll be a routing pro.

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

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is familiar
to us: it's a default route element that tells CakePHP to expect a
controller name.

Next, we specify some default values. Regardless of the controller, we
want the index() action to be called. We set the day parameter (the
fourth element in the URL) to null to flag it as being optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping) are
not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (as defined, the day parameter
is optional as it has a default), handing the requests to the index()
actions of their respective controllers, with the date parameters in
$this->params.

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
to a plugin by adding the plugin key to your url array.

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

Falls du irgendwelchen Bedarf an zusätzlichen Konfigurationen hast,
kannst du dafuer CakePHPs *bootstrap* Datei benutzen. Diese befindet
sich in /app/config/bootstrap.php. Sie wird direkt nach CakePHPs
Kern-*bootstrapping* aufgerufen.

Diese Datei ist ideal für eine ganze Reihe allgemeiner
*Bootstrapping*-Aufgaben:

-  Eigene Funktionen definieren.
-  Globale Konstanten registrieren.
-  Zusätzliche *Model*-, *View*- oder *Controller*\ pfade definieren.

Achte darauf, das MVC-Design-Muster beizubehalten, wenn du solche oder
andere Dinge in die *bootstrap.php* einfügst: es mag beispielsweise
verlockend sein Formatierfunktionen zu definieren um sie dann im
*Controller* zu benutzen. Dafür sind jedoch die Helfer in den *Views*
gedacht.

Widerstehe dem Drang. Du wirst später froh darüber sein.

Eine weitere Möglichkeit ist Dinge in die *AppController*-Klasse zu
stecken. Diese Klasse ist die Elternklasse aller *Controller* deiner
Anwendung. Es ist eine nützliche Stelle um *Controller-Callbacks* sowie
Methoden, die von allen *Controllern* verwendet werden zu definieren.
