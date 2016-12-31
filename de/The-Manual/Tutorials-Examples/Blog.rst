Blog
####

Willkommen bei CakePHP! Du wirst dieses Tutorial vermutlich
durcharbeiten, um mehr darüber zu erfahren wie CakePHP arbeitet. Es ist
unser Ziel die Produktivität zu erhöhen und den Code freundlicher zu
machen: wir hoffen, dass Du dies erkennen wirst, wenn Du etwas tiefer in
den Code eintauchst.

Dieses Tutorial beschreibt die Erstellung einer simplen Blog-Anwendung.
Wir werden Cake beziehen, es installieren, die Datenbank konfigurieren
und gerade so viele Anwendungslogik entwickeln, dass wir Artikel
schreiben, bearbeiten, löschen und natürlich anzeigen können.

Hier ist das, was Du dafür benötigst:

#. Einen laufenden Webserver. Wir gehen davon aus, dass als Webserver
   Apache verwendet wird, wobei die Erklärungen für andere Webserver
   ähnlich sein sollten. Vielleicht muss etwas am Server geändert
   werden, aber der Großteil der Nutzer wird Cake ohne zusätzliche
   Konfiguration des Servers zum Laufen bringen.

#. Einen Datenbankserver. In diesem Tutorial werden wir MySQL verwenden.
   Du solltest genug über SQL wissen, um eine Datenbank anzulegen. Den
   Rest erledigt Cake.

#. Grundlegende Kenntnisse in PHP. Umso mehr Du bereits mit
   objektorientierer Programmierung zu tun hattest, desto besser. Aber
   habe keine Angst, wenn Du bislang nur prozedural gearbeitet haben
   solltest.

#. Zum Schluss benötigst Du noch grundlegende Kenntnisse über das
   MVC-Entwurfsmuster. Diesbezüglich findest Du einen schnellen
   Überblick im Kapitel "Der Anfang mit CakePHP", in der Sektion
   `Model-View-Controller
   verstehen </de/view/10/model-view-controller-verstehe>`_. Keine
   Sorge. Es handelt sich dabei nur um etwa eine halbe Seite.

Lass uns beginnen!

Cake beziehen
=============

Zunächst brauchen wir eine aktuelle Version des Cake-Codes.

Um diese aktuelle Version herunterzuladen, besuche das CakePHP-Projekt
auf Cakeforge:
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_
und wähle die stabile (*stable*) Version zum Download. Um dieses
Tutorial nachvollziehen zu können benötigst du die Version 1.2.x.x.

Du kannst ebenso gut die aktuelle Cake-Version aus dem
Subversion-repository auschecken oder exportieren:
`https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ <https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/>`_

Egal wie du den Code heruntergeladen hast, speichere ihn in dem von dir
für diese Anwendung gewählten Wurzelverzeichnis (*document root*).
Danach sollte die Verzeichnisstruktur in etwa so aussehen:

::

    /pfad_zum_wurzelverzeichnis
        /app
        /cake
        /docs
        /vendors
        .htaccess
        index.php

Nun ist ein guter Zeitpunkt, um etwas darüber zu lernen, wie die
Verzeichnisstruktur von Cake funktioniert. Siehe dazu das Kapitel
"Grundlagen von CakePHP", Sektion `CakePHP Datei
Struktur </de/view/19/cakephp-datei-struktur>`_.

Die Blog-Datenbank erstellen
============================

Als Nächstes setzen wir die Datenbank für unsere Blog-Anwendung auf.
Wenn nicht bereits geschehen, erstelle eine leere Datenbank mit einem
Namen deiner Wahl für dieses Tutorial. Zu diesem Zeitpunkt werden wir
nur eine einzige Tabelle erstellen, die die Blogartikel speichert. Wir
fügen zu Testzwecken einige Beispielartikel in die Tabelle ein. Führe
die folgende SQL-Anweisung in der, zuvor von dir erstellten, Datenbank
aus:

::

    /* Als Erstes: Erstellen der Artikel-Tabelle */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Danach fuegen wir einige Testartikel ein */
    INSERT INTO posts (title,body,created)
        VALUES ('Der Titel', 'Das ist der Artikeltext.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Ein weiterer Titel', 'Auch hier Artikeltext.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Der Titel, Teil 3', 'Sehr interessanter Text.', NOW());

Die Wahl der Namen für Tabellen und deren Spalten ist nicht beliebig.
Sofern man den Namenskonventionen von Cake für Datenbanken und Klassen
(beide in `"CakePHP Konventionen" </de/view/22/cakephp-konventionen>`_
beschrieben) folgt, so hat man die Möglichkeit eine Reihe von, in Cake
integrierten, Funktionalitäten zu seinem Vorteil zu nutzen und
zusätzliche Konfigurationen zu vermeiden. Cake ist flexibel genug, um
sogar das älteste Datenbankschema nutzen zu können, aber die Einhaltung
der Konventionen erspart einem sehr viel Zeit und Arbeit.

Siehe `"CakePHP Konventionen" </de/view/22/cakephp-konventionen>`_ für
weitere Informationen, aber es genügt wohl festzuhalten, dass eine
Tabelle, die "posts" genannt wird, automatisch mit unserem Post-Model in
Verbindung gesetzt wird, und dass diese Tabelle automatisch die beiden
Spalten "created" und "modified" von Cake hinzugefügt bekommt.

Cake Datenbankkonfiguration
===========================

Weiter geht es. Sagen wir Cake nun wo sich unsere Datenbank befindet und
wie es sich mit der Datenbank verbinden kann. Für viele Nutzer ist dies
das letzte Mal, dass überhaupt irgendetwas konfiguriert wird.

Eine Kopie der Datenbankkonfigurationsdatei von CakePHP ist in
``/app/config/database.php.default`` vorzufinden. Kopiere diese Datei in
das gleiche Verzeichnis (``/app/config/``) und nenne sie
``database.php``.

Die Konfigurationsdatei sollte sehr überschaubar und verständlich sein.
Ersetze einfach die Werte im ``$default``-Array mit denen, die der
eigenen Konfiguration entsprechen. Ein vollständig ausgefülltes
Konfigurations-Array könnte beispielsweise folgendermaßen aussehen:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Wurde die neue Datei ``database.php`` angelegt und die eigenen
Konfigurationsdaten gespeichert, solltest du im Browser die
CakePHP-Willkommensseite aufrufen können. Diese sollte dir ebenfalls
bestätigen, dass die Datenbankkonfigurationsdatei gefunden wurde und
dass sich CakePHP erfolgreich mit der Datenbank verbinden konnte.

Optionale Konfiguration
=======================

Es existieren zwei weitere Dinge, die konfiguriert werden können. Die
meisten Entwickler setzen auch diese Punkte der Liste um, allerdings
sind sie für dieses Tutorial nicht zwingend erforderlich. Zum Einen ist
dies die Definition einer beliebigen Zeichenkette (auch "salt" genannt)
für die Nutzung in Sicherheits-*Hashes*. Zum Anderen kann CakePHP
Schreibzugriff auf das, in der Standardverzeichnisstruktur enthaltende,
``tmp``-Verzeichnis gegeben werden.

Das *salt* wird bei der Generierung von *Hashes* verwendet. Ändere den
Standardwert der Zeichenkette durch Bearbeitung von Zeile 153 in der
Datei ``/app/config/core.php``. Es ist absolut beliebig, wie der neue
Wert aussieht, solange er nicht allzu leicht erraten werden kann.

::

    <?php
    /**
     * Eine zufaellige Zeichenkette fuer die Nutzung von Sicherheitshashes.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

Die letzte Aufgabe ist es das Verzeichnis ``app/tmp`` auf dem Webserver
beschreibbar zu machen. Der beste Weg dies zu tun ist herauszufinden
unter welchem User der Webserver läuft (``<?php echo `whoami`; ?>``) und
dann die Benutzerrechte des Verzeichnisses auf den Nutzer zu übertragen.
Das entsprechende Kommando, um die Benutzerrechte zu setzen könnte unter
\*nix-Systemen folgendermaßen aussehen:

::

    $ chown -R www-data app/tmp

Sollte CakePHP aus irgendwelchen Gründen keine Schreibrechte in dem
Verzeichnis haben, so wirst du darüber in Form einer entsprechenden
Warnmeldung informiert. Diese Warnung wird nicht im Produktionsmodus
dargestellt.

Ein Hinweis zu mod\_rewrite
===========================

Gelegentlich wird ein neuer Nutzer in Probleme mit der Verwendung von
mod\_rewrite kommen, so dass ich auf diese an dieser Stelle eingehe.
Sollte die CakePHP-Willkommensseite etwas komisch aussehen (keine Bilder
oder CSS-Styles), so heißt das möglicherweise, dass mod\_rewrite nicht
oder zumindest nicht korrekt auf deinem System funktioniert. Hier also
einige Ratschläge, um dir dabei zu helfen mod\_rewrite zum Laufen zu
bekommen:

#. Stelle sicher, dass ein Überschreiben durch eine .htaccess-Datei
   erlaubt ist: in der httpd.conf-Datei des Webservers solltest du einen
   Bereich finden, der für jedes Verzeichnis auf dem Server eine Sektion
   definiert. Stelle sicher, dass die Option ``AllowOverride`` für das
   entsprechende Verzeichnis auf ``All`` gesetzt ist.

#. Stelle sicher, dass du die richtige httpd.conf bearbeitest und nicht
   eine nutzer- oder seitenspezifische httpd.conf.

#. Aus irgendwelchen Gründen könnte es sein, dass du eine Kopie von
   CakePHP ohne die benötigten .htaccess-Dateien bezogen hast. Dies
   passiert manchmal, da einige Betriebssysteme Dateien, die mit einem
   '.' beginnen, als vesteckt behandeln und diese in der Folge nicht
   kopieren. Stelle also sicher, dass die von dir bezogene Kopie von
   CakePHP aus der offiziellen Download-Sektion oder direkt aus unserem
   Subversion-repository stammt.

#. Stelle sicher, dass Apache dass mod\_rewrite-Modul korrekt läd. Du
   solltest in der httpd.conf so etwas wie
   ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``
   and ``AddModule             mod_rewrite.c`` finden.

Falls du mod\_rewrite (oder ein kompatibles Modul) auf deinem Webserver
nicht verwenden möchtest oder es nicht verwenden kannst, musst du auf
die in CakePHP integrierten *pretty URLs* zurückgreifen. Öffnen dazu die
Datei ``/app/config/core.php`` und entferne das Kommentar in der Zeile:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Entferne desweiteren die folgenden .htaccess-Dateien:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

Damit haben die URLs dann die Struktur
``www.example.com/index.php/controllername/actionname/param`` anstatt
``www.example.com/controllername/actionname/param``.

Erstellen eines Post-Models
===========================

*Model*-Klassen sind das A und O von CakePHP-Anwendungen. Erstellt man
ein CakePHP-*Model*, welches mit der von uns angelegten Datenbank
interagiert, so hat man Alles, was benötigt wird, um Artikeldatensätze
hinzuzufügen, zu bearbeiten, zu löschen und natürlich anzuzeigen.

Die *Model*-Klassen von CakePHP sind im Verzeichnis ``/app/models``
abgespeichert. Die Datei, die wir für unsere Zwecke erstellen, speichern
wir unter ``/app/models/post.php``. Die Datei sollte folgendermaßen
aussehen:

::

    <?php

    class Post extends AppModel
    {
        var $name = 'Post';
    }

    ?>

Die Einhaltung der Namenskonventionen ist sehr wichtig bei der
Verwendung von CakePHP. Indem wir das *Model* ``Post`` nennen, ist
CakePHP automatisch in der Lage daraus zu folgern, dass diese Klasse im
``PostsController`` (siehe nächstes Kapitel) verwendet wird und dass sie
mit der Datenbanktabelle ``posts`` in Verbindung steht.

Die Variable ``$name`` dient dazu unter PHP4 auftretende Probleme mit
Klassennamen zu umgehen. In PHP5 ist die Variable nicht zwingend
erforderlich, wobei es nicht schaden kann, wenn sie in der Klasse
gesetzt wird.

Für weitere Informationen zu *Models*, wie beispielsweise
Tabellenpräfixe, Callback-Funktionen oder Validation lese auch das
Kapitel über `Models </de/view/66/models>`_ hier im Kochbuch.

Erstellen eines Post-Controllers
================================

Als Nächstes erstellen wir einen *Controller* für unsere Artikel. Der
*Controller* ist der Ort, an dem die gesamte Anwendungslogik für die
Interaktion von Artikeln implementiert wird. Zusammengefasst heißt das,
dass dort auf die entsprechenden *Model*-Klassen zugegriffen und alle
Arbeit bezüglich der Blogartikel (Hinzufügen, Löschen, ..) geleistet
wird. Wir werden diesen neuen *Controller* in der Datei
``posts_controller.php`` im Verzeichnis ``/app/controllers``
abspeichern. Der ``PostsController`` sollte folgendermaßen aussehen:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';
    }
    ?>

Lass uns nun eine Aktion zu unserem *Controller* hinzufügen. Aktionen
repräsentieren häufig eine einzige Funktion oder Schnittstelle einer
Anwendung. Ruft ein User zum Beispiel den URL
www.example.com/posts/index auf (was gleichbedeutend mit
www.example.com/posts/ ist), könnte er eine Auflistung der Blogartikel
erwarten. Der entsprechende Code für eine solche Anzeige würde so
aussehen:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

Lass mich die Aktion ein klein wenig näher erklären. Indem man die
Methode index() im ``PostsController`` definiert, haben User die
Möglichkeit, auf die Anwendungslogik, die in dieser Methode
implementiert ist, über den Aufruf von www.example.com/posts/index
zuzugreifen. Definieren wir eine Methode namens foobar(), so haben User
gleichermaßen die Möglichkeit über den Aufruf von
www.example.com/posts/foobar auf die in dieser Methode enthaltenen Logik
zuzugreifen.

Es mag vorkommen, dass du die Versuchung verspürst, deinen *Controllern*
und *action*-Methoden gewisse Namen zu geben, um entsprechende,
spezielle URLs zu erhalten. Widerstehe der Versuchung! Folge den
Namenskonventionen von CakePHP (Namen von *Controllern* im Plural, etc.)
und erstelle lesbare und verständliche *action*-Namen. Du hast die
Möglichkeit mit Hilfe von Routen, auf die später noch eingegangen wird,
URLs nach deinen Wünschen zu erstellen und auf existierenden Code
abzubilden.

Die einzelne Anweisung in der Aktion verwendet ``set()`` um Daten vom
*Controller* zur *View* (welche wir als Nächstes erstellen werden) zu
übergeben. Die Zeile weist der *View*-Variablen 'posts' den Rückgabewert
der Methoden ``find('all')`` aus dem Post-Model zu. Unser Post-Model ist
automatisch über die Variable ``$this->Post`` verfügbar, da wir die
Namenskonvetionen von CakePHP eingehalten haben.

Weitere Informationen über *Controller* in CakePHP findet man im Kapitel
"Entwickeln mit CakePHP" in der Sektion `"Controller" </de/view/49/>`_.

Erstellen eines Post Views
==========================

Jetzt, wo unsere Daten in unser Model fließen und unsere Anwendungslogik
und der Datenfluss im Controller festgelegt sind, müssen wir einen View
für die index-Aktion, die wir eben erstellt haben, anlegen.

Cake Views sind die Präsentationsschicht unserer Anwendung. Im Endeffekt
handelt es sich um ein Fragment von Daten und Markup, das in das Layout
eingefügt wird. In den meisten Fällen also ein HTML-PHP-Gemisch. Denkbar
sind aber natürlich auch andere Formate, etwa XML, CSV oder
Binärformate.

Bei einem Layout hingegen handelt es sich um einen Rahmen aus Code, der
den View umgibt und der bei Bedarf durch anderen "Rahmen"-Code
ausgetauscht werden kann (auch zur Laufzeit!). Für den Anfang begnügen
wir uns mit einem einzelnen, dem "standard" Layout.

Erinnern Sie sich daran, wie wir im letzten Abschnitt die 'posts'
Variable dem View zugeordnet haben, indem wir die ``set()`` Methode
benutzt haben? Sie reicht die Daten zum View weiter, der dann in etwa so
aussehen könnte:

::

    // print_r($posts) output:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Die View-Dateien von Cake liegen in ``/app/views`` innerhalb eines
Unterverzeichnisses, der den Namen des jeweiligen Controllers trägt.
Diese Verzeichnisse müssen wir allerdings erst einmal per Hand anlegen
(wir legen nun also das Verzeichnis 'posts' im Views-Verzeichnis an). Um
die Daten aus der 'posts' Variable in einer hübschen Tabelle
darzustellen, könnte unser View-Code in etwa so aussehen:

::

    <!-- File: /app/views/posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Hier iterieren wir in einer Schleife durch den $posts Array und geben die Daten des aktuellen Elements ausHere -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], 
    "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Hoffentlich war das einigermaßen einleuchtend.

Ihnen ist vielleicht aufgefallen, dass der Code ein Objekt namens
``$html`` benutzt. Dabei handelt es sich um eine Instanz der CakePHP
``HtmlHelper``-Klasse. CakePHP liefert eine Reihe von Helferlein (für
die Views) mit, die Standardaufgaben, wie Verlinkung, Formulare,
JavaScript und AJAX, zum Kinderspiel machen. Um mehr über ihre
Möglichkeiten und die Verwendung der Helpers zu erfahren, schauen sie
ins Kapitel `"Eingebaute Helpers" </de/view/181/>`_ aber an dieser
Stelle ist es nur wichtig zu wissen, dass die ``link()``-Methode einen
HTML-Link mit dem im ersten Parameter übergebenen Titel und der als
zweiten Parameter übergebenen URL erzeugt.

Bei der Angabe von URLs in Cake wird einfach nur ein Pfad relativ zum
Hauptverzeichnis der Anwendung angegeben. URLs haben daher üblicherweise
die Form /controller/action/parameter1/parameter2.

An dieser Stelle sollten Sie in der Lage sein, unter der Adresse
http://www.yourhost.com/posts/index im Browser den View mit Titel und
Tabellendarstellung der Posts zu sehen.

Falls Sie auf einen der Links (die auf /posts/view/eine\_id verweisen)
geklickt haben sollten, wurden Sie möglicherweise von CakePHP darüber
informiert, dass die Methode nocht nicht definiert ist. Wenn sie bei
einem Klick auf einen dieser Links nicht informiert wurden, ging
entweder etwas schief oder sie haben schon heimlich vorgearbeitet und
einen entsprechenden View angelegt. Ansonsten legen wir die Methode im
PostsController jetzt an:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

Der Aufruf von ``set()`` sollte ihnen ja bereits bekannt sein. Neu ist
hier allerdings der Aufruf von ``read()`` anstatt ``find('all')``, weil
wir nur die Daten eines einzigen Posts benötigen.

Auch neu ist, dass unsere view-Methode einen Parameter nimmt, nämlich
die ID des Posts, den wir anzeigen wollen. Dieser Parameter wird über
die URL übertragen. Wenn ein Benutzer /posts/view/3 anfordert, dann wird
der Wert '3' als ``$id`` an unsere view-Methode übertragen (da es den
ersten Parameter in der URL darstellt und dieser von der Methode als $id
benannt ist).

Nun legen wir einen View für unsere view-Methode an - unter
/app/views/posts/view.ctp.

::

    <!-- File: /app/views/posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Überprüfen Sie, ob unsere Views funktionieren, in dem sie die Links auf
/posts/index anklicken oder per Hand die URL /posts/view/1 aufrufen.

Posts hinzufügen
================

Aus der Datenbank lesen und die Posts anzeigen ist ein guter Anfang aber
jetzt wollen wir es ermöglichen, neue Posts hinzuzufügen.

Zunächst beginnen wir damit, eine ``add()``-Methode im PostsController
anzulegen:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

Was tut der Code für die Methode? Falls die Formulardaten nicht leer
sind, versuchen wir die Daten über das Post-Model zu speichern. Sollte
das aus irgendeinem Grunde fehlschlagen, zeigen wir den View erneut an.
Das macht es z.B möglich, Validierungsfehler anzuzeigen und den Nutzer
diese korrigieren zu lassen.

Wenn ein Nutzer ein Formular benutzt um Daten per POST an unsere
Anwendung zu übermitteln, sind diese Daten in ``$this->data`` verfügbar.
Sie können die ``pr()`` oder ``debug()`` Funktionen nutzen, um die Daten
anzuzeigen, wenn sie möchten.

Wir nutzen die ```setFlash()`` </de/view/400/setFlash>`_-Methode der
``Session``-Komponente (Komponente := quasi Helper, bloß im Controller
statt im View), um nach der Weiterleitung eine einfache Nachricht in
einer Session-Variable zu setzen. Im Layout haben wir
```$session->flash()`` </de/view/568/flash>`_, womit die Nachricht
angezeigt und die entsprechende Session-Variable gelöscht wird. Die
```redirect`` </de/view/425/redirect>`_-Funktion des Controllers leitet
zu einer anderen URL weiter. Der Parameter ``array('action'=>'index)``
wird dabei in den URL /posts übersetzt, was der index-Methode des
PostsController entspricht. Nähere Informationen zu den möglichen
Formaten für URLs in verschiedenen Cake Funktionen finden sich unter
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_.

Der Aufruf der
``save()-Methode prüft zunächst auf Validierungsfehler und bricht das Speichern ab, falls einer oder mehrere dieser Fehler vorliegt. Wir werden uns diese Fehler und ihre Behandlung im folgenden Abschnitt näher ansehen.``

Validierung der Daten
=====================

Cake hilft uns viel dabei, die Monotonie der Validierung von
Formulardaten zu beseitigen. So gut wie jeder hasst es zahllose
Formulare und ihre Validierungsroutinen zu programmieren. CakePHP macht
diese Tätigkeit schneller und leichter.

Um in den Genuss der Validierungsmöglichkeiten zu kommen, muss Cakes
FormHelper in den Views eingesetzt werden. Der FormHelper ist
standardmäßig in den Views aktiviert, um allen Views die Verwendung von
``$form`` zu ermöglichen.

Hier unser add View:

::

    <!-- File: /app/views/posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Save Post');
    ?>

In der ersten PHP-Zeile haben wir den FormHelper dazu genutzt den
öffnenden Tag für ein HTML-Formular zu erzeugen. Hier die HTML-Ausgabe
von ``$form->create()``:

::

    <form id="PostAddForm" method="post" action="/posts/add">

Falls ``create()`` ohne Parameter aufgerufen wird, nimmt die Funktion
an, dass das aktuelle Formular an die ``add()`` (oder ``edit()``, wenn
ein ``id`` Feld im Formular enthalten ist)-Methode des aktuellen
Controllers via POST gesendet wird.

Die Aufrufe der ``$form->input()``-Methode erzeugen die Formularfelder
mit dem entsprechenden Namen. Der erste Parameter teilt CakePHP mit, auf
welches (Datenbanktabellen-)Feld sich das Formularelement bezieht. Der
zweite Parameter erlaubt es eine Vielzahl von optionen anzugeben — in
diesem Fall die Anzahl der Zeilen des Textarea. Bei ``input()`` ist ein
bisschen interne Magie am Werk: ``input()`` erzeugt unterschiedliche
Formularelemente in Abhängigkeit ihrer Eigenschaften im Modell.

Der Aufruf von ``$form->end()`` erzeugt einen Absenden-Button und
schließt das Formular ab. Falls ein String als erster Parameter
übergeben wurde, wird dieser als Aufschrift für den Absenden-Button
benutzt. Siehe auch `Kapitel "Kern Helper" </de/view/181/>`_ für weitere
Details zu den Helpern.

Nun aber zurück zu unserem ``/app/views/posts/index.ctp`` View. Hier
wollen wir nun einen neuen "Post hinzufügen"-Link einfügen. Vor
``<table>`` fügen wir folgende Zeile ein:

::

    <?php echo $html->link('Post hinzufügen',array('controller' => 'posts', 'action' => 'add'))?>

Sie werden sich vielleicht fragen: Wie teile ich CakePHP meine
Validierungsanforderungen mit? Validierungsregeln werden im Modell
definiert. Schauen wir nun zurück in unser Post-Modell und führen die
nötigen Anpassungen durch:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>

Das ``$validate`` Array teilt CakePHP mit, wie die Daten beim Aufruf der
``save()``-Methode validiert werden sollen. In diesem Fall wurde
spezifiziert, dass sowohl "body"- als "title"-Feld nicht leer sein
dürfen. CakePHPs Validierungsmechanismus ist sehr mächtig, verfügt über
eine Vielzahl vordefinierter Regeln (Kreditkartennummern,
Email-Adressen, etc.) und ist flexibel. Es können jederzeit eigene
Regeln eingefügt werden. Für weitere Informationen zur Validierung siehe
`Kapitel Daten Validierung </de/view/125/data-validation>`_.

Jetzt, wo die Validierungsregeln in das Modell eingepflegt sind,
versuchen Sie einen Post hinzuzufügen, ohne einen Titel oder "body"-Text
einzugeben und beobeachten Sie, was passiert. Da wir die
``input()``-Methode des FormHelper genutzt haben, um unsere
Formularelemente zu erzeugen, werden Validierungsfehler automatisch
angezeigt.

Posts löschen
=============

Als nächstes wollen wir es den Nutzern ermöglichen, Posts zu löschen.
Dazu legen wir eine ``delete()``-Methode im PostsController an:

::

    function delete($id) {
        $this->Post->delete($id);
        $this->Session->setFlash('The post with id: '.$id.' has been deleted.');
        $this->redirect(array('action'=>'index'));
    }

Dieses Stück Anwendungslogik löscht den Post mit der passenden $id und
nutzt ``$this->Session->setFlash()``, um dem Nutzer eine
Bestätigungsnachricht anzuzeigen und anschließend zu /posts umzuleiten.

Da wir nur etwas Code ausführen und dann umleiten benötigt und hat diese
Methode keinen View. Man kann nun auch gleich den index-View um Links
erweitern, die es dem Nutzer ermöglichen, die Einträge direkt zu
löschen:

::

    /app/views/posts/index.ctp

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
            <?php echo $html->link('Delete', array('action' => 'delete', $post['Post']['id']), null, 'Are you sure?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Dieser View-Code nutzt außerdem den HtmlHelper um den Nutzer mittels
JavaScript um Bestätigung des Löschvorganges zu bitten, bevor der Post
gelöscht wird.

Posts bearbeiten
================

Kümmern wir uns jetzt um das Bearbeiten von Posts. Wir benötigen eine
neue Action sowie ein neues View. Die ``edit()``-action des
*PostsControllers* sollte so aussehen:

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

Diese Methode überprüft die abgeschickten Formulardaten. Wurde nichts
übergeben, findet die Methode das Post und übergibt es dem View. Wenn
etwas übergeben wurde, wird versucht die Daten mit Hilfe des Post-model
zu speichern (Oder leitet zurück zum View und zeigt dem Benutzer einen
Fehler).

Das Edit-view sollte in etwa so aussehen:

::

    /app/views/posts/edit.ctp
        
    <h1>Edit Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
        echo $form->input('id', array('type'=>'hidden')); 
        echo $form->end('Save Post');
    ?>

Dieses View zeigt das Formular zum bearbeiten und eventuell auftretende
Fehlermeldungen.

Eine Anmerkung: CakePHP geht davon aus, dass ein Model bearbeitet werden
soll, falls eine 'id' übergeben wird. Sollte keine 'id' übergeben
werden, geht Cake davon aus das ein neues Model angelegt werden soll und
ruft die ``save()``-Methode auf.

Nun können wir noch das Index-View mit den Bearbeiten-Links ergänzen:

::

    /app/views/posts/index.ctp (edit links added)
        
    <h1>Blog posts</h1>
    <p><?php echo $html->link("Add Post", array('action'=>'add')); ?>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'],array('action'=>'view', 'id'=>$post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $html->link(
                    'Delete', 
                    array('action'=>'delete', 'id'=>$post['Post']['id']), 
                    null, 
                    'Are you sure?'
                )?>
                <?php echo $html->link('Edit', array('action'=>'edit', 'id'=>$post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Routes
======

Für einige Zwecke reicht CakePHPs Standard-Routing völlig aus.
Entwickler, die Wert auf Benutzerfreundlichkeit und
Suchmaschinenoptimierung legen, werden die Art und Weise, wie CakePHP
URLs zu bestimmten Actions transformiert, begrüßen. In diesem Tutorial
werden wir nun eine kleine Änderung am Routing vornehmen.

Für weiterführende Informationen zu fortgeschrittenen
Routing-Technologien, siehe `"Routes Configuration" </de/view/46/>`_.

Standardmäßig beantwortet CakePHP eine Anfrage nach dem
Wurzelverzeichnis Ihrer Seite (also z.B. http://www.example.com) mit der
Darstellung eines Views "home" über den PagesController. Stattdessen
wollen wir diese Route durch unseren PostsController ersetzen, in dem
wir eine entsprechende Route setzen.

Cakes Routing-Informationen liegen in ``/app/config/routes.php``. Sie
können die Zeile mit der Standardroute auskommentieren oder löschen.
Diese Zeile sieht in Etwa so aus:

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

Diese Zeile verbindet den URL '/' mit der Standard-Homepage
(/app/views/pages/home.ctp). Wir wollen den URL aber mit unserem eigenen
Controller verbinden, deshalb fügen wir diese Zeile hinzu:

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

Diese Zeile sollte Benutzer, die '/' abrufen zur index() Action unseres
noch zu schreibenden PostsControllers bringen.

CakePHP nutzt außerdem 'reverse routing' - wenn - mit der oben genannten
Route definiert - ``array('controller'=>'posts', 'action'=>'index')``
einer Funktion, die einen Array erwartet, übergeben wird, ergibt sich
daraus der URL '/'. Es ist daher eine gute Idee immer Arrays für URLs zu
nutzen, denn das bedeutet, dass die Routen definieren, wohin ein URL
wirklich zeigt und sie somit sicherstellen, dass ein Link immer auf die
richtige Stelle zeigt.

Schlusswort
===========

Auf diese Art und Weise Anwendungen zu erstellen bringt dir Frieden,
Anerkennung, Beliebtheit und Geld in ungeahntem Maße. Simpel, oder?
Behalte im Hinterkopf, dass dieses Tutorial nur die Grundzüge abgedeckt
hat. CakePHP hat *viele* weitere Features zu bieten und ist auf
vielfältige Weise flexibel, worauf wir hier aus Gründen der
Verständlichkeit nicht eingegangen sind. Nutze den Rest dieses Handbuchs
als Guide für das Erstellen umfangreicherer Anwendungen.

Jetzt, wo du eine erste Cake-Anwendung geschrieben hast, bist du bereit
für echte Anwendungen. Beginne ein eigenes Projekt, lies den Rest des
`Handbuchs </de/>`_ und studiere die
`API <https://api.cakephp.org>`_-Referenz.

Falls du Hilfe benötigst, besuche uns in #cakephp. Willkommen bei
CakePHP!

Suggested Follow-up Reading
---------------------------

These are common tasks people learning CakePHP usually want to study
next:

#. `Layouts: <https://book.cakephp.org/view/1080/Layouts>`_ Customizing
   your website layout
#. `Elements: <https://book.cakephp.org/view/1081/Elements>`_ Including
   and reusing view snippets
#. `Scaffolding: <https://book.cakephp.org/view/1103/Scaffolding>`_
   Prototyping before creating code
#. `Baking: <https://book.cakephp.org/view/1522/Code-Generation-with-Bake>`_
   Generating basic
   `CRUD <https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete>`_
   code
#. `Authentication: <https://book.cakephp.org/view/1250/Authentication>`_
   User registration and login

