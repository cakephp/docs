Components
##########

 

Einleitung
==========

Komponenten (*Components*) sind Klassen, deren Funktionalität in
mehreren Kontrollklassen (*Controllers*) genutzt werden kann. Wenn du
dich dabei erwischt, wie du Funktionalität duplizierst, um sie in
mehreren Kontrollklassen verwenden zu können, ist es vielleicht
sinnvoller, diese Funktionalität in eine Komponente auszulagern.

CakePHP bietet außerdem eine fantastische Sammlung an Kern-Komponenten:

-  Security
-  Sessions
-  Access control lists
-  Emails
-  Cookies
-  Authentication
-  Request handling

Die Nutzung dieser Kern-Komponenten wird in eigenen Kapiteln erklärt.
Zunächst gehen wir aber darauf ein, wie man eigene Komponenten erstellt.
Eigene Komponenten helfen dabei, den Code der Kontrollklassen sauber zu
halten und oft verwendete Funktionalität wiederverwenden zu können.

Konfiguration von Komponenten
=============================

Viele der Kern-Komponenten müssen konfiguriert werden. Beispiele für
Komponenten die konfiguriert werden müssen sind
`Auth <https://book.cakephp.org/view/172/Authentication>`_,
`Cookie <https://book.cakephp.org/view/177/Cookies>`_ und
`Email <https://book.cakephp.org/view/176/Email>`_. Die Konfiguration
dieser und anderer Komponenten erfolgt meist in der ``beforeFilter()``
Methode deiner Kontrollklasse (*Controller*).

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');

        $this->Cookie->name = 'CookieMonster';
    }

Der Code dient als Beispiel zur Konfiguration von Variablen der
verwendeten Komponenten in der ``beforeFilter()>`` Methode einer
Kontrollklasse.

Es ist jedoch möglich, dass eine Komponente bestimmte
Konfigurationsoptionen benötigt bevor der *beforeFilter-Callback* des
*Controllers* ausgeführt wird. Zu diesem zweck erlauben es einige
Komponenten solche Optionen im *$components-Array* zu definieren.

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session'));

Um herauszufinden welche Optionen eine Komponente bietet solltest du die
jeweilige Dokumentation zu Rate ziehen.

Die Komponenten können *beforeRender*- und *beforeRedirect-Callbacks*
besitzen, die vor dem *Rendering* bzw. vor einem *Redirect*
(Weiterleitung) ausgeführt werden.

Man kann das Auslösen der Callbacks deaktivieren indem man die
*enabled*-Eigenschaft der Komponente auf *false* setzt.

Component callbacks
===================

Während Komponenten einerseits eine Möglichkeit bieten
wiederverwendbaren *Controller-Code*, der bestimmte Aufgaben erfüllt zu
erstellen bieten sie ausserdem noch eine Möglichkeit in den normalen
Anwendungsablauf einzugreifen. Es gibt fünf fest eingebaute sogenannte
*Callbacks* und es können auch weitere definiert werden indem man
``Component::triggerCallback`` verwendet.

Die Kern-*Callbacks* sind:

-  **initialize()** wird vor *beforeFilter* des *Controllers*
   ausgeführt, aber nachdem das *Model* erstellt worden ist.
-  **startup()** wird nach *beforeFilter*, aber vor der angeforderten
   *action* des *Controllers* ausgeführt.
-  **beforeRender()** wird vor dem rendern des *Views* ausgeführt.
-  **beforeRedirect()** wird vor einer Weiterleitung die vom Controller
   ausgelöst wird ausgeführt. Der Rückgabewert kann dazu verwendet
   werden um die URL zu der weitergeleitet werden soll zu ändern.
-  **shutdown()** wird nach dem Rendern des *Views* und bevor die
   Antwort an den User zurückgegeben wird ausgeführt.

Man kann zusätzliche Methoden zu den Komponenten hinzufügen und diese
jederzeit aufrufen indem man ``Component::triggerCallback()`` benutzt.
Falls man zum Beispiel einen ``onAccess``-*Callback* zu seinen
Komponenten hinzugefügt hat, kann man diesen im Controller auslösen
indem man ``$this->Component->triggerCallback('onAccess', $this);``
aufruft.

Das Auslösen der Callbacks kann verhindert werden indem man die
``enabled``-Eigenschaft der Komponente auf ``false`` setzt.

Erstellen von eigenen Komponenten
=================================

Nehmen wir an, dass unsere Anwendung eine komplizierte Mathematische
Berechnung in mehreren ganz unterschiedlichen Kontrollklassen
(*Controllers*) durchführen muss. In einem solchen Fall ist es sinnvoll,
diese Funktionalität in eine Komponente (*Component*) auszulagern,
anstatt sie zu duplizieren.

Im ersten Schritt erstellen wir die Komponente. Die entsprechende Datei
erstellen wir in /app/controllers/components/math.php. Die Klasse würde
im einfachsten Fall wie folgt aussehen:

::

    <?php

    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

    ?>

Einbinden von Komponenten in Kontrollklassen
--------------------------------------------

Wenn deine Komponente (*Component*) fertig ist, kannst du sie in deinen
Kontrollklassen (*Controllers*) verwenden, indem du den Namen der
Komponente (ohne "Component") dem $components Array der entsprechenden
Kontrollklasse hinzufügst. In der Kontrollklasse steht dir dann
automatisch ein neues Attrbut mit dem Namen deiner Komponente zur
Verfügung, über welches du eine Instanz deiner Komponente erreichst:

::

        /* Einbindung einer neuen "Math"-Komponente ($this->Math),
        sowie der Kern-Methode "Session" ($this->Session) */
        var $components = array('Math', 'Session');

Komponenten, die im ``AppController`` eingebunden werden, werden mit
denen in anderen (abgeleiteten) Kontrollklassen zusammengeführt. Es ist
also nicht nötig, die selbe Komponente zweimal zu deklarieren.

Beim Einbinden von Komponenten in Kontrollklassen können außerdem
Parameter an die ``initialize()`` Methode der Komponente übergeben
werden. Diese Parameter können dann von der Komponente verwendet werden.

::

        var $components = array(
            'Math' => array(
                    'precision' => 2,
                    'randomGenerator' => 'srand'
                ),
            'Session', 'Auth'
        );

Dieser Code übergibt ein Array mit den Werten für "precision" und
"randomGenerator" als zweiten Parameter an die ``initialize()`` Methode
der ``MathComponent``.

Die Möglichkeit Parameter an Kern-Komponenten zu übergeben besteht zur
Zeit noch nicht.

MVC Klassen-Zugriff in Komponenten
----------------------------------

Um aus deiner neuen Komponente (*Component*) heraus auf eine Instanz der
Kontrollklasse (*Controller*) zuzugreifen, muss deine Komponente über
eine ``initialize()`` oder ``startup()`` Methode verfügen. Diese
speziellen Methoden erwarten eine Referenz auf deine Kontrollklasse als
ersten Parameter. Die ``initialize()`` Methode wird vor der
``beforeFilter()`` Methode der Kontrollklasse aufgerufen, während die
``startup()`` Methode erst nach der ``beforeFilter()`` Methode
aufgerufen wird.
Falls du aus irgendeinem Grund *nicht* möchtest, dass die ``startup()``
Methode aufgerufen wird, kannst du die Klassenvariable
``$disableStartup`` auf *true* setzen.

Logik, die vor der ``beforeFilter()`` Methode der Kontrollklasse
ausgeführt werden muss, wird in der ``initialize()`` Methode einer
Komponente definiert.

::

    <?php
        class CheckComponent extends Object {
            // Wird vor Controller::beforeFilter() ausgeführt
            function initialize(&$controller) {
                // Speichern der Referenz auf die Kontrollklasse
                $this->controller =& $controller;
            }

            // Wird nach Controller::beforeFilter() ausgeführt
            function startup(&$controller) {
            }

            function redirectSomewhere($value) {
                // Aufruf einer Kontrollklassen-Methode
                $this->controller->redirect($value);
            }
        }
    ?>

Eventuell möchtest du in deiner Komponente auch auf andere Komponenten
zugreifen. In dem Fall nutzt du einfach die ``$components``
Klassenvariable in deiner Komponente. Diese funktioniert in Komponenten
genau so, wie in Kontrollklassen. Sie enthält ein Array mit den Namen
der zu ladenden Komponenten.

Ausschließlich die ``initialize()`` Methode von "Unterkomponenten" wird
automatisch aufgerufen.

::

    <?php
        class MyComponent extends Object {

            // Diese Komponente nutzt andere Komponenten
            var $components = array('Session', 'Math');

            function doStuff() {
                $result = $this->Math->doComplexOperation(1, 2);
                $this->Session->write('stuff', $result);
            }

        }
    ?>

Ein Model in einer Komponente zu nutzen wird grundsätzlich eher nicht
empfohlen. Solltest du dich nach Abwägung der Alternativen dennoch dazu
entscheiden, musst du deine Model-Klasse manuell instanzieren. Hier ein
Beispiel:

::

    <?php
        class MathComponent extends Object {
            function doComplexOperation($amount1, $amount2) {
                return $amount1 + $amount2;
            }

            function doUberComplexOperation ($amount1, $amount2) {
                $userInstance = ClassRegistry::init('User');
                $totalUsers = $userInstance->find('count');
                return ($amount1 + $amount2) / $totalUsers;
            }
        }
    ?>

Using other Components in your Component
----------------------------------------

Manchmal muss eine der eigenen Komponenten auch eine weitere Komponente
verwenden.

Weitere Komponenten kann man genau in der gleichen Weise einbinden, wie
sie auch von Controllern eingebunden werden: Durch Verwendung der
``$components``-Variable.

::

    <?php
    class CustomComponent extends Object {
        var $name = 'Custom'; // the name of your component
        var $components = array('Existing'); // the other component your component uses

        function initialize(&$controller) {
            $this->Existing->foo();
        }

        function bar() {
            // ...
       }
    }
    ?>

::

    <?php
    class ExistingComponent extends Object {
        var $name = 'Existing';

        function initialize(&$controller) {
            $this->Parent->bar();
        }
     
        function foo() {
            // ...
       }
    }
    ?>

