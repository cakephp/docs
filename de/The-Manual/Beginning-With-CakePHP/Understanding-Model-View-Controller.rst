Model-View-Controller verstehen
###############################

Gut geschriebene CakePHP Anwendungen folgen dem MVC
(Model-View-Controller) Software Entwurfsmuster. Programmierungen nach
MVC teilen die Anwendung in drei Haupt Bestandteile. Das Model
präsentiert die Anwendungsdaten, die View generiert eine Präsentation
der Model-Daten, und der Controller behandelt und steuert
Benutzeranfragen.

.. figure:: /_static/img/basic_mvc.png
   :align: center
   :alt: Abblidung 1

   Abbildung 1: Eine elementare MVC Anfrage

Abbildung 1 zeigt ein Beispiel einer einfachen MVC Anfrage in CakePHP.
Zur Veranschaulichung nehmen wir an, ein Benutzer namens Ricardo hat
gerade auf den "Kaufe einen eigenen Kuchen!"-Link deiner Webanwendung
geklickt.

#. Ricardo klickt auf den Link der zur Adresse
   http://www.example.com/cakes/buy führt, und der Browser sendet eine
   Anfrage an Deinen Webserver.
#. Der Dispatcher überprüft die angeforderte URL (/cakes/buy) und leitet
   die Anfrage zum zuständigen Controller weiter.
#. Der Controller verarbeitet Anwendungsspezifische Abläufe. Zum
   Beispiel überprüft die Anwendnung ob Ricardo eingeloggt ist.
#. Der Controller benutzt die Models um Zugang zu den Anwendungsdaten zu
   bekommen. In den meisten Fällen präsentieren Models die verschiedenen
   Tabellen einer Datenbank, aber es könnten genau so gut
   `LDAP <https://en.wikipedia.org/wiki/Ldap"%20title=>`_ Einträge,
   `RSS <https://en.wikipedia.org/wiki/Rss>`_ Feeds oder Dateien sein. In
   unserem Beispiel wird das Model benutzt um Ricardo's letzte Einkäufe
   aus der Datenbank auszulesen.
#. Sobald der Controller die Daten verarbeitet hat, werden diese an die
   View weitergeleitet. Die View formatiert die Daten und bereitet Sie
   zur Ausgabe vor. Views in CakePHP sind meistens im HTML Format. Es
   könnte aber auch einfach ein PDF, XML Dokument oder ein JSON Objekt,
   je nach Anforderung, ausgegeben werden.
#. Sobald die View die Ausgabe vorbereitet hat, wird der Inhalt an
   Ricardos Browser ausgegeben.

Fast jede Anfrage deiner Anwendung folgt diesem Grundmuster. Es kommen
später noch einige Cake-spezifische Details hinzu.

Warum MVC verwenden?
====================

Weil es ein bewährtes und effektives Software Entwurfsmuster ist, das
eine Webanwendung in eine wartbare, modulare und effizient entwickelte
Anwendung verwandelt. Anwendungsaufgaben in Models, Views und
Controllers zu teilen macht Deine Anwendung sehr schlank. Neue Features
sind einfach hinzugefügt, alte Features schnell in einer neuen
Oberfläche verpackt. Die modular und unterteilte Logik erlaubt
Entwicklern und Designern gleichzeitig an der Anwendung zu arbeiten.
Dies beinhaltet ebenso die schnelle Entwicklung eines ersten Prototyps.
Dadurch ist es ebenso möglich einen Teil der Anwendung zu verändern,
ohne einen anderen Teil zu beeinflussen.

Wenn Du noch nie eine Anwendung mit dieser Methode entwickelt hast, wird
es eine Weile dauern. Aber wir sind sehr zuversichtlich, dass wenn Du
Deine erste CakePHP Anwendung erstellt hast, Du nie wieder anders
Arbeiten möchtest.
