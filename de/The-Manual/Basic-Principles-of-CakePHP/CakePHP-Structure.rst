Die Struktur von CakePHP
########################

CakePHP verfügt über Controller-, Model- und View-Klassen, bietet aber
darüber hinaus auch einige zusätzliche Klassen und Objekte, um die
Entwicklung mittels des MVC-Entwurfsmuster zu beschleunigen und zu
erleichtern. Komponenten, Behaviors und Helper sind erweiterbare und
wiederverwendbare Klassen, die es ermöglichen die MVC Basis-Klassen
schnell um eine gewünschte Funktionalität zu erweitern. Details zur
Benutzung dieser Werkzeuge befinden sich in den nachfolgenden Kapiteln.
In diesem wollen wir uns zunächst einen Überblick verschaffen.

Controller-Erweiterungen
========================

Eine Komponente ist eine Klasse, die uns bei der Controller-Logik
unterstützt. Soll eine Programm-Logik von verschiedenen Controllern
(oder Applikationen) gemeinsam benutzt werden, ist eine Komponente in
der Regel die richtige Wahl. Als Beispiel sei die Core-Klasse
EmailComponent erwähnt, mit der das Erstellen und Versenden von E-Mails
ein Kinderspiel ist. Anstatt eine Methode die diese Aufgabe erfüllt in
einem Controller zu implementieren, kann diese Logik gebündelt werden um
sie gemeinsam benutzen zu können.

Controller verfügen des Weiteren über Callback-Routinen. Diese Callbacks
sind für den Fall gedacht, daß Programmlogik zwischen CakePHP's internen
Transaktionen eingefügt werden soll. Verfügbare Callbacks sind:

-  ``beforeFilter()``, wird vor jeglicher Controller-Aktion ausgeführt
-  ``beforeRender()``, wird nach der Controller-Logik, aber vor dem
   Rendern des Views ausgeführt
-  ``afterFilter()``, wird nach allen Controller-Aktionen einschließlich
   dem Rendern des Views ausgeführt. Zwischen afterRender() und
   afterFilter() gibt es keinen Unterschied, außer wenn die Funktion
   render() manuell in einer Controller-Methode aufgerufen wurde und
   anschließend noch Code ausgeführt wird.

View Extensions
===============

Ein *Helper* ist eine Klasse die die Ansichtslogik unterstützt. Ähnlich
wie eine Komponente in einem *Controller* verwendet wird, ermöglichen
Helfer den Zugriff und Aufteilung der Präsentations-Logik zwischen den
*Views*. Eine der Haupthelfer, *AjaxHelper*, macht Ajax requests
innerhalb der *Views* viel einfacher.

Viele Programme haben Teile von *View* code die wiederholt verwendet
werden. CakePHP erleichtert die Wiederverwendung von *View* Code mit
Layouts und Elementen. Normalerweise wird jeder *View* der von einem
*Controller* erstellt wird in ein Layout eingefügt. Elemente werden
verwendet wenn kleine Teile von Inhalten in mehreren *Views*
wiederverwendet werden sollen.

Model Extensions
================

In ähnlicher weise arbeiten Behaviors als der Weg gemeinsame
Funktionalitäten zwischen den Modellen hinzuzufügen. Wenn du zum
Beispiel Nutzerdaten in einer Baumstruktur speicherst, kannst du das
Verhalten deines Nutzer-Modell wie ein Baum definieren und freie
Funktionalitäten für das Entfernen, Einfügen und Verlagerung der Knoten
in deiner zugrundeliegenden Baumstruktur hinzufügen.

Modelle werden auch von einer anderen Klasse genannt DataSource
verwendet. DataSources sind Abstraktionen, die es Modellen ermöglichen,
verschiedene Arten von Daten konsistent zu verändern. Während die
Hauptquelle der Daten in einer CakePHP Anwendung oft eine Datenbank ist,
könntest du auch weitere DataSources schreiben, die es deinen Modellen
ermöglichen RSS feeds, CSV files, LDAP entries, oder iCal events
darzustellen. DataSources erlaubt es dir aus verschiedenen Quellen
Datensätze zu assoziieren: anstatt auf SQL-Joins beschränkt zu sein,
ermöglichen es dir die DataSources festzulegen, daß dein LDAP model mit
vielen iCal events verbunden ist.

Genau wie bei den Kontrollern, sind Modelle mit Call-Back
Funktionalitäten ausgestattet:

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

Die Namen dieser Methoden sollte beschreibend genug sein, um zu wissen,
was sie tun. Die weiteren Details werden im Kapitel über die Modelle
behandelt.

Application Extensions
======================

Controller, Helper und Modelle haben alle eine Elternklasse, welche du
nutzen kannst um applikationsweite Veränderungen zu definieren.
AppController (hier: /app/app\_controller.php), AppHelper (hier:
/app/app\_helper.php) und AppModel (hier: /app/app\_model.php) sind gute
Plätze um dort Methoden, die du zwischen den Controllern, Helpers oder
Modellen teilen willst, einzufügen.

Obwohl sie keine Klassen oder Dateien sind spielen Routen eine Rolle in
den Requests an CakePHP. Eine Route definiert wie CakePHP die URL den
ControllerAktionen zuordnet. Das Standardverhalten für diese URL
“/controller/action/var1/var2” mapt zu Controller
Controller::action($var1, $var2), aber du kannst Routen auch bearbeiten
um die URLs und ihre Verarbeitung anzupassen.

Manche Funktionen in einer Applikation werden als ein ganzes
zusammengepackt. Ein Plugin ist ein Packet aus Modellen, Controllern und
Views welches einen bestimmten Bereich abdeckt. Ein
Userverwaltungssystem oder ein einfacher Blog passen möglicherweise gut
als CakePHP-Plugins.
