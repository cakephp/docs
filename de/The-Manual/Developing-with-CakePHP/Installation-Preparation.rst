Installationsvorbereitungen
###########################

CakePHP lässt sich schnell und einfach installieren. Die
Mindestvorraussetzungen sind nur ein Webserver und eine Kopie von Cake,
das wars schon! Während diese Anleitung auf einen Apache Webserver
ausgelegt ist (weil dies meistens der Fall ist), lässt sich Cake auch
für die Verwendung auf einer Vielzahl anderer Webserversysteme wie
LightHTTPD oder Microsoft IIS konigurieren.

Die Installationsvorbereitung besteht aus folgenden Schritten:

-  Download einer aktuellen Version von CakePHP (`Hier zu
   finden <https://cakephp.org/downloads>`_)
-  Den Webserver für die Ausführung von PHP konfigurieren
-  Benutzerrechte auf dem Server checken

CakePHP herunterladen
=====================

Es gibt zwei Wege, eine frische Kopie von CakePHP zu erhalten. Zunächst
kannst Du Dir ein Archiv herunterladen (zip/tar.gz/tar.bz2), oder Du
kannst den Code aus unserem Repository auschecken (SVN).

Um ein frisches Archiv zu erhalten, besuche unsere Website unter
`https://cakephp.org <https://cakephp.org>`_. Folge dem großen
“Download Now!” link zum Paradies. CakePHP Downloads werden bei
CakeForge gehosted, Du kannst aber auch unsere Projektwebsite besuchen,
unter
`http://cakeforge.org/projects/cakephp <http://cakeforge.org/projects/cakephp>`_.

Wenn Du immer das Neueste haben willst, checke unsere nightly downloads
aus unter
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
CakePHP nightlies sind stabil, und beinhalten Korrekturen bis zum
nächsten Release.

Um eine frische Kopie aus unserem SVN-Repository zu erhalten, gehe zu
`https://svn.cakephp.org/repo/branches/1.2.x.x <https://svn.cakephp.org/repo/branches/1.2.x.x>`_
.

Dateizugriffsrechte
===================

CakePHP benutzt das /app/tmp Verzeichnis für eine Vielzahl verschiedener
Operationen. Model-Beschreibungen, gecachte views, und
Sessioninformationen sind nur einige wenige Beispiele.

Daher stelle sicher, dass das /app/tmp Verzeichnis in Deiner
cake-Installation vom Benutzer, der für den Webserver angelegt ist,
beschreibbar ist.
