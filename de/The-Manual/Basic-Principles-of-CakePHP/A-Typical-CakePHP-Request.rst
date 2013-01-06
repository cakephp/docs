Eine normale CakePHP Anfrage
############################

Wir haben uns die grundlegenden Bestandteile von CakePHP angesehen. Nun
laßt uns gemeinsam anschauen, wie die Objekte bei einer normalen Anfrage
zusammenarbeiten. Nehmen wir unser ursprüngliches Beispiel wieder auf
und erinnern uns, dass unser Freund Ricardo gerade auf den “Buy A Custom
Cake Now!” Link der Seite einer CakePHP Anwendung geklickt hat.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request

   Figure: 2. Standardmässige Cake Anfrage.

Schwarz = benötiges Element, Grau = optionales Element, Blau = callback

#. Ricardo klickt auf den Link der nach http://www.example.com/cakes/buy
   verweist und sein Browser startet eine Anfrage zu deinem Webserver.
#. Der Router analysiert die URL um die Parameter der Anfrage zu
   bestimmen: Den controller, action, und alle anderen Argumente dieser
   Anfrage, die Auswirkung auf die Business-Logik haben.
#. Das Routing verweist die Anfrage an die Controller Action (die
   Methode der Controller Klasse). In diesem Falle die buy() Methode des
   CakeController. Der Controllers beforeFilter Callback wird
   aufgerufen, bevor irgendeine Action Logik ausgeführt wird
#. Der Controller kann das Model nutzen, um auf die Applikationsdaten
   zuzugreifen. In unserem Beispiel nutzt der Controller das Modell um
   Ricardos letzte Käufe aus der Datenbank zu lesen. Alle Model
   Callbacks, Behaviours und Datenquellen können dabei verwendet werden.
   Obwohl es nicht notwendig ist, dass eine Action überhaupt auf ein
   Model zurückgreift, braucht jede CakePHP Controllerklasse mindestens
   ein Model.
#. Nun hat das Modell die Daten an den Controller zurückgeliefert.
#. Der Controller kann Components nutzen, um weitere Aktionen
   durchzuführen(Sessionmanipulation, Authentifizierung oder Emails
   versenden beispielsweise).
#. Nachdem der Controller mittels Model und Components die Daten
   vorbereitet hat, werden diese Daten mittels der set() Methode an den
   View weitergeleitet. Controller Callbacks müssen eventuell noch
   bearbeitet werden, bevor die Daten verschickt werden. Die View Logik
   wird ausgeführt, welche Elements und/oder Helpers nutzen kann. Nach
   Voreinstellung wird der View in einem Layout gerendert.
#. Zusätzliche Controller Callbacks (afterFilter() können nun
   durchgeführt werden. Die Seite wird zu Ricardo geschickt.

