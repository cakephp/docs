CakePHP Konventionen
####################

Wir sind große Fans von festen Vereinbarungen über die Konfiguration.
Zwar dauert es ein bisschen mehr Zeit die Konventionen von CakePHP
kennen zu lernen, auf lange Sicht sparst du dir damit aber eine menge
Zeit: Wenn du dich an die Konventionen hältst, kannst du frei
erhältliche Funktionalitäten nutzen, und du befreist dich selbst von der
alptraumhaften Wartung die Übersicht über die Konfigurationsdateien zu
behalten. Konventionen erlauben auch eine sehr einheitliche System
Entwicklung, die Entwicklern den Einstieg und die Unterstützung
erleichtert.

Die CakePHP’s Konventionen entstanden aus aus jahrelanger Erfahrungen in
der Web-Entwicklung und bewährten Praktiken. Obwohl wir empfehlen diese
Konventionen bei der Entwicklung mit CakePHP zu verwenden, wollen wir
nicht unerwähnt lassen, dass viele dieser Grundsätze auch einfach außer
Kraft gesetzt werden können. Dies kann insbesondere bei der Arbeit mit
*Legacy* Systemen nützlich sein.

Konventionen der Datei und Klassennamen
=======================================

Üblicherweise werden in Dateinamen unterstriche verwendet, während
Klassennamen zusammenhängend Gross/Klein geschrieben sind. Die Klasse
KissesAndHugsController kann zum Beispiel in der Datei
kisses\_and\_hugs\_controller.php gefunden werden.

Der Name der Klasse die sich in einer Datei befindet, muss sich nicht
zwangsweise in dem Dateinamen wiederfinden. Die Klasse EmailComponent
befindet sich in der Datei mit dem Namen email.php, und die Klasse
HtmlHelper befindet sich in der Datei html.php.

Model and Database Conventions
==============================

Namen von Model-Klassen sind im Singular und GemischtKleinGross
geschrieben.

Person, BigPerson, und ReallyBigPerson sind Beispiele für Klassennamen,
die den Konventionen entsprechen.

Die Namen der Tabellen zu den Model-Klassen sind im Plural, mit
Unterstrichen und klein geschrieben. Die Tabellen zu den oben genannten
Modellen wären also people, big\_people, and really\_big\_people.

Foreign-keys in hasMany-, belongsTo- oder hasOne-Beziehungen werden per
default erkannt an dem Namen (im Singular) des entsprechenden Modells
gefolgt von \_id. Als Beispiel nehmen wir die Beziehung: baker hasMany
cakes. In der cakes-Tabelle gibt es dann eine foreign-key-Spalte
baker\_id die den baker referenziert.

Verknüpfungs-Tabellen, wie sie in hasAndBelongsToMany-Beziehungen
(HABTM) benötigt werden, sollten benannt werden, in dem die Namen der
verknüpften Modell-Tabellen in alphabetischer Reihenfolge und durch
Unterstrich verbunden werden (apples\_zebras statt zebras\_apples)

.

Alle Tabellen, mit denen CakePHP-Modelle interagieren, müssen eine
Spalte mit einem primary key haben damit jede Zeile der Tabelle
identifiziert werden kann. Solltest Du eine Tabelle benötigen, die keine
solche Spalte hat, wie z.B. die Verknüpfungs-Tabelle posts\_tags, so
wird nach der CakePHP-Konvention ein primary key zu der Tabelle
hinzugefügt.

CakePHP unterstützt keine composite primary keys. Wenn du die
Join-Tabelle direkt bearbeiten willst, benutze
`query </de/view/456/query>`_ - Aufrufe oder füge einen primary key zu
der Tabelle hinzu und arbeite auf ihr wie mit einem normalen Modell.
Z.B.:

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id)); 

Controller Conventions
======================

Controller Klassennamen sind im Plural, CamelCased (GroßKleinSchreibung)
und enden in ``Controller``. ``PeopleController`` und
``LatestArticlesController`` sind beides Beispiele von konventionellen
Controller Namen.

Die erste Methode, die du für einen Controller schreibst wird sicherlich
die ``index()`` Methode sein. Falls eine Anfrage einen Controller aber
keine Action beschreibt, führt CakePHP standardmäßig die ``index()``
Methode des Controllers aus. Beispielsweise führt die Anfrage der URL
http://www.example.com/apples/ zum Aufruf der ``index()`` Methode des
``ApplesController``, wobei http://www.example.com/apples/view/ die
``view()`` Methode des ``ApplesController`` aufruft.

Du kannst auch die Sichtbarkeit von Controller Methoden in CakePHP
verändern, indem du die Controller Methoden um Unterstriche ergänzt,
dann wird die Methode nicht mehr direkt über das Web, aber für interne
Zwecke weiterhin zugänglich. Ein kleines Beispiel:

::

    <?php
    class NewsController extends AppController {

        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //Logic to find latest news articles
        }
    }

    ?>

Während die Seite http://www.example.com/news/lates/ weiterhin für den
User normal erreichbar ist, bekommt jemand, der die Seite
http://www.example.com/news/\_findNewArticles/ einen Fehler erhalten,
weil die Methode mit einem Unterstrich versehen wurde.

URL Considerations for Controller Names
---------------------------------------

Wie du gesehen hast, Ein-Wort-Controller werden zu einem einfachen URL
Pfad weitergeleitet. Zum Beispiel: ``ApplesController`` (der in der
Datei 'apples\_controller.php' definiert ist) ist über
http://example.com/apples zugänglich.

Mehr-Wort-Controller *können* irgendeine Form habe, die ähnlich dem
Controller Namen ist:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

Diese werden alle zum index des RedApples Controller aufgelöst. Wie auch
immer, die Konvention lautet, dass deine URLs immer klein geschrieben
und mit Unterstrichen versehen sind, deshalb ist /red\_apples/go\_pick
die korrekte Form um die ``RedApplesController::go_pick`` Action
aufzurufenl.

Weitere Informationen zu CakePHP URLs und Parameterbehandlung findest du
unter `Routes Configuration </de/view/945/Routes-Configuration>`_.

View Konventionen
=================

Die Vorlagendateien (template) der Views werden nach den
Controllerfunktionen die sie anzeigen - die Wörter werden durch
Unterstriche getrennt - benannt. Für die Funktion getReady() des
PeopleController würde die Viewvorlage /app/views/people/get\_ready.ctp
erwartet werden.

Das Muster für die Vorlagendateien ist ganz einfach:
/app/views/controller/funktions\_name\_mit\_unterstrichen.ctp.

Indem du die Dateien und Klassen deiner Applikation nach den CakePHP
Konventionen benennst, bekommst du schnell und einfach eine
funktionierendes System ohne in Konfigurationen wühlen zu müssen. Hier
noch ein abschließendes Beispiel um die Konventionen zu festigen:

-  Tabelle in der Datenbank: "people"
-  Modellklasse: "Person", in der Datei /app/models/person.php
-  Kontrollerklasse: "PeopleController", in der Datei
   /app/controllers/people\_controller.php
-  Viewvorlage in der Datei /app/views/people/index.ctp

Wenn man diese Konventionen befolgt, dann weiß CakePHP das eine Anfrage
an die Adresse http://example.com/people/ einen Aufruf der Funktion
index() des PeopleController bedeutet. Weiterhin wird das Modell von
Person (welches an die Datenbanktabelle people gebunden ist) automatisch
verfügbar gemacht und das Ergebnis mit der Viewvorlage
/app/views/people/index.ctp ausgegeben. Diese Zusammenhänge wurden
vollautomatisch erstellt und müssen nicht von Hand erzeugt werden.

Nachdem dir die Grundlagen von CakePHP bekannt sind, kannst du dich am
`CakePHP Blog Tutorial </de/view/219/blog>`_ versuchen und sehen wie das
ganze in der Praxis funktioniert.
