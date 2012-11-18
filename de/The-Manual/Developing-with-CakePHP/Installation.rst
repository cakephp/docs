Installation
############

Die Installation von CakePHP kann so einfach sein, es einfach in das
Dokumentenvereichnis Deines Webservers zu schieben, oder so komplex und
flexibel, wie Du es gerne hättest. Dieser Abschnitt deckt die drei
Hauptarten einer CakePHP-Installation ab: development
(Entwicklungsumgebung), production (Produktionsumgebung), und advanced
(erweitert).

-  Entwicklung: Einfach zum Laufen zu bekommen, URLs für die Applikation
   beinhalten den Namen des Installationsverzeichnisses von CakePHP,
   weniger sicher.
-  Production: Erfordert die Möglichkeit, das
   Haupt-Dokumentenverzeichnis des Webservers einzustellen, saubere
   URLs, sehr sicher.
-  Advanced: Viel Konfiguration, die Schlüsselverzeichnisse von CakePHP
   können an verschiedenen Stellen im Dateisystem liegen, hierdurch kann
   ein zentrales Verzeichnis mit den CakePHP Kerndateien für mehrere
   Applikationen verwendet werden.

Entwicklung
===========

Eine Entwicklungs-Installation ist die schnellste Cake-Installationsart.
Dieses Beispiel wird Dir helfen eine CakePHP-Applikation zu installieren
und unter http://www.example.com/cake\_1\_2/ verfügbar zu machen. Zu
diesem Zweck nehmen wir an, dass Dein Wurzelverzeichnis /var/www/html
lautet.

Entpacke den Inhalt des Cake-Archivs nach /var/www/html. Du hast jetzt
einen Ordner in Deinem Wurzelverzeichnis, welcher entsprechend dem
Release benannt ist, welches Du heruntergeladen hast (z.B.
cake\_1.2.0.7962). Benenne den Ordner in cake\_1\_2 um. Deine
Entwicklungsumgebung auf dem Dateisystem wird wie folgt aussehen:

-  /var/www/html

   -  /cake\_1\_2

      -  /app
      -  /cake
      -  /vendors
      -  /.htaccess
      -  /index.php
      -  /README

Wenn Dein Webserver korrekt konfiguriert ist, solltest Du Deine
Cake-Applikation unter http://www.example.com/cake\_1\_2/ finden können.

Produktion
==========

Um eine Produktivinstallation verwenden zu können, benötigst Du das
Recht, das Wurzelverzeichnis Deines Webservers ändern zu dürfen. Wenn Du
eine Produktivinstallation einsetzt, fungiert die gesamte Domain als
eine einzige CakePHP-Applikation.

Eine Produktivinstallation basiert auf folgendem Aufbau:

-  /path\_to\_cake\_install/

   -  /app

      -  /webroot (dieses Verzeichnis wird als Wurzelverzeichnis
         verwendet)

   -  /cake
   -  /docs
   -  /index.php
   -  /vendors

Wenn die Applikation auf einem Apache gehostet werden soll, sieht die
Konfigurationsdirektive DocumentRoot für diese Domain wie folgt aus:

::

    DocumentRoot /path_to_cake_install/app/webroot

Deine CakePHP-Applikation erreichst Du über die Adresse
http://www.example.com.

Fortgeschrittene Installation
=============================

Unter Umständen willst du die CakePHP-Verzeichnisse an anderen Stellen
im Dateisystem ablegen. Dies könnte aufgrund von Einschränkungen auf
Shared-Host-Servern sein oder weil du einfach einige Cake-Bibliotheken
mit verschiedenen Anwendnungen verwenden willst. Dieser Abschnitt
beschreibt, wie du die CakePHP-Verzeichniss über das Dateisystem
verteilen kannst.

Zuerst musst du verstehen, dass es drei Hauptteile einer Cake-Anwendnung
gibt:

#. Die CakePHP-Kernbibliotheken in /cake.
#. Deinen Anwendungscode in /app.
#. Das Webroot der Anwendnung, normalerweise in /app/webroot.

Jedes dieser drei Verzeichnisse kann überall im Dateisystem liegen,
lediglich das Webroot muss vom Webserver zugreifbar sein. Du kannst
sogar das Webroot-Verzeichnis aus dem app-Verzeichnis verschieben,
solange du Cake informierst, wohin.

Um deine Cake-Installation zu konfigurieren, musst du ein paar
Änderungen in /app/webroot/index.php vornehmen. Es gibt dort drei
Konstanten, die du bearbeiten musst: ROOT, APP\_DIR, und
CAKE\_CORE\_INCLUDE\_PATH.

-  ROOT muss auf das Verzeichnis verweisen, dass deinen app-Ordner
   enthält.
-  APP\_DIR musst auf dein app-Verzeichnis verweisen
-  CAKE\_CORE\_INCLUDE\_PATH muss auf die CakePHP-Libraries verweisen.

Lass uns nun an einem Beispiel durchgehen, wie eine solche Installation
in der Praxis aussehen könnte. Nehmen wir an, wir wollen, dass CakePHP
wie folgt funktioniert:

-  Die CakePHP-Kernbibliotheken liegen in /usr/lib/cake.
-  Das Webroot liegt untern /var/www/mysite/.
-  Das Anwenundsverzeichnis lautet /home/me/mysite.

Unter diesen Bedinungen, würde die Datei webroot/index.php wie folgt
aussehen:

::

    // /app/webroot/index.php (Auschnitt, Kommentare entfernt) 

    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'me');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'mysite');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib'.DS.'cake');
    }

Es wird empfohlen, die Konstante DS (directory separator) statt
Schrägstrichen zu verwenden. Dies beugt Fehlern wegen nicht gefundenen
Dateien vor, die bei Verwendung der falschen Pfadtrennzeichen entstehen
könnten und macht deinen Code portabler.

Weitere Klassenpfade
--------------------

Manchmal ist es sinnvoll MVC Klassen zwischen unterschiedlichen
Anwendungen zu teilen. Wenn Du in zwei Deiner Anwendungen den gleichen
Controller benutzen möchtest, kannst Du die bootstrap.php Datei dazu
benutzen, diese mit ins Spiel zu bringen.

In der Datei bootstrap.php müssen dazu nur bestimmte Variablen definiert
werden, damit CakePHP die Pfade zu den anderen MVC Klassen erkennt und
nutzen kann:

::

    $viewPaths        = array();
    $controllerPaths  = array();
    $modelPaths       = array();
    $helperPaths      = array();
    $componentPaths   = array();
    $behaviorPaths    = array();

Jede dieser besonderen Variablen kann ein Array mit weiteren, absoluten
Pfaden zu Klassen beinhalten. Beachte hierbei, dass Du das letzte Slash
mit angibst.

Apache und mod\_rewrite
=======================

Während CakePHP so gebaut ist, dass es „out of the box“ mit dem Apache
Modul ``mod_rewrite`` zusammenarbeitet –was normal auch funktioniert–
haben wir festgestellt, dass einige Nutzer kämpfen müssen, um alles zum
Laufen zu bekommen. Hier sind einige Dinge, die Du beachten solltest,
wenn Du es korrekt zum Laufen bringen willst:

-  Stelle sicher, dass das Überschreiben mittels .htaccess erlaubt ist.
   In Deiner httpd.conf solltest Du eine Sektion haben, welche das
   Verzeichnis auf deinem Server definiert. Stelle auch sicher, dass
   ``AllowOverride`` für den korrekten ``DocumentRoot`` auf ``All``
   gesetzt wurde.
-  Stelle sicher, dass Du die httpd.conf des Systems und nicht die,
   eines Benutzers, oder eine seitenspezifische Datei bearbeitest.
-  Vermisst CakePHP seine benötigten .htaccess Dateien? Das kann beim
   kopieren oder verschieben vorkommen, da bei manchen Betriebssystemen
   Dateien, welche mit einem '.' anfangen, versteckt sind. Stelle
   sicher, dass deine CakePHP Kopie von der Downloadsektion auf unserer
   Seite oder aus unserem SVN-Repository stammen und richtig entpackt
   wurden.
-  Stelle sicher, dass Du ``mod_rewrite`` korrekt lädst. Du solltest in
   Deiner httpd.conf Datei, etwas ähnliches wie *LoadModule
   rewrite\_module libexec/httpd/mod\_rewrite.so* sehen (Unix/Linux
   Nutzer sollten ebenfalls etwas wie *AddModule mod\_rewrite.c* sehen).
   Stelle auch sicher, dass diese Zeilen nicht auskommentiert wurden
   (das ist der Fall, wenn Du eine # voranstellst). Starte Deinen Apache
   neu, um sicherzustellen, dass die neue Konfiguration geladen wurde.
-  Wenn Du CakePHP in ein Benutzerverzeichnis installierst
   (http://example.com/~username), musst Du Deine .htaccess Datei des
   Hauptverzeichnisses Deiner CakePHP Installation anpassen. Füge
   einfach die Zeile "RewriteBase /~myusername/" hinzu.

'Pretty URLs' und Lighttpd
==========================

Obwohl lighttpd ein Rewrite-Modul mitbringt, unterscheidet es sich von
dem von Apache. Um 'pretty URLs' beim Einsatz von Lighty zu ermöglichen
gibt es zwei Optionen. Die erste Möglichkeit ist es mod\_rewrite zu
benutzen. Die zweite ist ein LUA Script in Kombination mit mod\_magnet
zu nehmen.

**Benutzung von mod\_rewrite**

Der einfachste Weg an 'Pretty URLs' zu kommen, ist dieses Script zur
Lighty Konfiguration hinzuzufügen. Bearbeiten Sie einfach die URL und es
sollte funktionieren. Dabei sollten Sie beachten, dass dieser Weg nicht
mit Cake Installationen in Unterverzeichnissen funktioniert.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # Wenn der Request für css|Dateien etc stattfindet, nicht an Cake weiterleiten
                    "/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Benutzung von mod\_magnet**

Um 'Pretty URLs' mit CakePHP und Lighttpd zu ermöglichen, legen Sie
dieses Lua-Script in /etc/lighttpd/cake ab.

::

    -- Kleine Helfer Funktion
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end

    -- Präfix ohne angehaengten slash
    local prefix = ''

    -- the magic ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- Datei fehlt immernoch. Alles an das fastcgi backend weiterleiten
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- Fallthrough wird alles wieder zurueck in den 'lighty request loop' versetzen
    -- Das bedeuted, wir bekommen die 304 Behandlung umsonst ;)

Wenn Sie eine CakePHP Installation aus einem Unterverzeichnis betreiben,
müssen Sie das Präfix = 'subdirectory\_name' im vorigen Script setzen.

Dann Lighttpd über den vhost in Kenntniss setzen:

::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # Ebenfalls daran denken die vim tmp-Dateien zu uebergehen
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }

'Pretty URLs' und nginx
=======================

nginx ist ein beliebter Server, der genau wie Lighttpd weniger
System-Resourcen benötigt. Sein Nachteil ist, dass er keine .htaccess
Dateien wie Apache und Lighttpd bietet, so dass es notwendig ist die
umgeschriebenen('rewritten') URLs in der 'site-available' Konfiguration
zu erstellen. Abhängig von der Installationsart, müssen Sie dieses in
der Konfiguration ändern, aber als Grundvorraussetzung müssen sie PHP
als FastCGI-Instanz betreiben.

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            root   /var/www/example.com/public/app/webroot/;
            index  index.php index.html index.htm;
            if (-f $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?url=$1 last;
        }

        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }

'URL Rewrites' unter IIS7 (Windows hosts)
=========================================

IIS7 bringt keine Unterstütztung von .htaccess Dateien mit. Auch wenn es
Add-ons gibt, die diese Unterstützung ermöglichen, können Sie 'htaccess
rules' in Ihre IIS-Konfiguration importieren, um die 'rewrites' von
CakePHP's zu nutzen. Um diesen Weg zu gehen, gehen Sie bitte folgende
Schritte durch:

#. Benutzen Sie 'Microsoft's Web Platform Installer' um das 'URL Rewrite
   Module 2.0' zu installieren.
#. Legen Sie eine neue Datei im CakePHP Verzeichnis an und nennen Sie
   diese web.config
#. Benutzen Sie Notepad oder einen anderen XML fähigen Editor und
   kopieren Sie folgenden Code in die neue Datei web.config

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Redirect static resources" stopProcessing="true">
                <match url="^(ico|img|css|files|js)(.*)$" />
                <action type="Rewrite" url="app/webroot/{R:1}{R:2}" appendQueryString="false" />
                </rule>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

Es ist ebenso möglich die Import Funktionalität in IIS's 'URL Rewrite
module' zu nutzen um Regeln direkt aus CakePHP's .htaccess Dateien aus
den Root-Verzeichnissen, /app/, sowie /app/webroot/ zu importieren -
obwohl einiges an manueller Bearbeitung innerhalb vom IIS notwendig ist
um es so ans Laufen zu bekommen. Wenn man die Regeln auf diesem Wege
importiert, wird ISS automatisch eine web.config Datei für Sie
erstellen.

Sobald die web.config Datei mit den korrekten IIS kompatiblen 'Rewrite
Rules' erstellt wurde, sollten CakePHP's Links, CSS, JS, sowie das
'Rerouting' funktionieren.

Fire It Up
==========

Alles klar, lass uns CakePHP mal in Aktion sehen. Je nachdem, welche
Einstellungen Du gewählt hast, findest Du auf http://example.de/ oder
http://example.de/cake\_install/ die Standard CakePHP-Startseite. Auf
dieser wird Dir auch der Status der Datenbank-Verbindung angezeigt.

Glückwunsch! Du bist bereit, Deine eigene CakePHP-Anwendung zu kreieren!
