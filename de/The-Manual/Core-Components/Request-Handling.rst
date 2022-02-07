Request Handling
################

Zusätzliche Informationen über die HTTP-Requests werden in CakePHP über
die RequestHandler-Komponente eingeholt. Durch den tieferen Einblick in
die Header kann man u.a. einen AJAX-Request von einem normalen Request
unterscheiden, vom Client akzeptierte Content-Typen herausfinden oder
auch automatisch das Layout der aktuellen Dateiendung anzupassen, sofern
gewünscht.

Der RequestHandler unterscheidet schon standardmäßig AJAX-Requests von
normalen Requests, er greift dazu auf den HTTP-X-Requested-With Header
zurück, den viele Javascript-Libraries benutzen.

Im Zusammenspiel mit
`Router::parseExtensions() <https://api13.cakephp.org/class/router#method-RouterparseExtensions>`_
wird der RequestHandler automatisch das Layout und die View-Files dem
gewünschten Typ anpassen - nicht nur das, wenn ein Helper existiert, der
den gleichen Namen wie die Dateiendung trägt, wird er der Helper-Liste
des Controllers hinzugefügt. Zu guter Letzt: an Controller gepostete
XML-Daten werden automatisch in ein XML-Objekt geparst und
Controller::data hinzugefügt (was natürlich unter einem Model
gespeichert werden kann). Wie gehabt muß die RequestHandler-Komponente
über das $components-Array inkludiert werden, um es zu benutzen.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        //Der Rest des Controllers
    }
    ?>

Informationen über die Anfrage einholen
=======================================

Der RequestHandler hat diverse Methoden, die Informationen über den
Request und den Client bereitstellen.

accepts ( $type = null)

$type kann ein String, ein Array oder Null sein.

#. Wenn es ein String ist, wird accepts true zurückgeben, sofern der
   Client den Content-Typ akzeptiert.
#. Wenn ein Array übergeben wird, gibt accepts true zurück, wenn ein
   Beliebiger der übergebenen Content-Typen vom Client akzeptiert wird.
#. Wenn Null übergeben wird, gibt accepts einen Array der akzeptierten
   Content-Typen zurück.

Beispiel:

::

    class PostsController extends AppController {
        
        var $components = array('RequestHandler');

        function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // Hier stehender Code wird nur ausgeführt, wenn der Client den
                // Content-typ text/html akzeptiert
            } elseif ($this->RequestHandler->accepts('xml')) {
                // "" für XML
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                //Hier stehender Code wird ausgeführt, wenn der Client XML, RSS oder Atom
                // akzeptiert
            }
        }
    }

Andere Methoden zur Überprüfung des Request-Typs

isAjax()

Gibt true zurück, wenn der X-Requested-Header "XMLHttpRequest" ist.

isSSL()

Gibt true zurück, wenn der Request über SSL gemacht wurde.

isXml()

Gibt true zurück, wenn XML akzeptiert wird.

isRss()

Gibt true zurück, wenn RSS akzeptiert wird

isAtom()

Gibt true zurück, wenn Atom unterstützt wird.

isMobile()

Gibt true zurück, wenn der als User Agent angegebene Browser als mobiler
Browser bekannt ist oder wenn der Client WAP-Inhalte akzeptiert.
Eingetragene Browser sind:

-  iPhone
-  MIDP
-  AvantGo
-  BlackBerry
-  J2ME
-  Opera Mini
-  DoCoMo
-  NetFront
-  Nokia
-  PalmOS
-  PalmSource
-  portalmmm
-  Plucker
-  ReqwirelessWeb
-  SonyEricsson
-  Symbian
-  UP.Browser
-  Windows CE
-  Xiino

isWap()

Gibt true zruück, wenn der Client WAP unterstützt.

Alle oben erwähnten Methoden zur Requestanalyse können in einer
ähnlichen Art und Weise verwendet werden, um bestimmte Funktionalitäten
nur für spezifische Content-Typen zu nutzen. Beispielsweise wird man bei
AJAX-Requests häufig das Browser-Caching deaktivieren oder auch das
Debug-Level ändern wollen - normale Requests sind davon dann nicht
betroffen. Folgender Code ermöglicht genau das:

::

        if ($this->RequestHandler->isAjax()) {
            Configure::write('debug', 0);
            $this->header('Pragma: no-cache');
            $this->header('Cache-control: no-cache');
            $this->header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        }
        //Weiterer Code im Controller

Man kann das natürlich auch in eine extra Methode auslagern:
``Controller::disableCache``

::

        if ($this->RequestHandler->isAjax()) {
            $this->disableCache();
        }
        //Weiterer Code im Controller

Request Type Detection
======================

RequestHandler also provides information about what type of HTTP request
has been made and allowing you to respond to each Request Type.

isPost()

Returns true if the request is a POST request.

isPut()

Returns true if the request is a PUT request.

isGet()

Returns true if the request is a GET request.

isDelete()

Returns true if the request is a DELETE request.

Obtaining Additional Client Information
=======================================

getClientIP()

Get the remote client IP address

getReferer()

Returns the domain name from which the request originated

getAjaxVersion()

Gets Prototype version if call is Ajax, otherwise empty string. The
Prototype library sets a special "Prototype version" HTTP header.

Responding To Requests
======================

In addition to request detection RequestHandler also provides easy
access to altering the output and content type mappings for your
application.

setContent($name, $type = null)

-  $name string - The name or file extension of the Content-type ie.
   html, css, json, xml.
-  $type mixed - The mime-type(s) that the Content-type maps to.

setContent adds/sets the Content-types for the given name. Allows
content-types to be mapped to friendly aliases and or extensions. This
allows RequestHandler to automatically respond to requests of each type
in its startup method. If you are using Router::parseExtension, you
should use the file extension as the name of the Content-type.
Furthermore, these content types are used by prefers() and accepts().

setContent is best used in the beforeFilter() of your controllers, as
this will best leverage the automagicness of content-type aliases.

The default mappings are:

-  **javascript** text/javascript
-  **js** text/javascript
-  **json** application/json
-  **css** text/css
-  **html** text/html, \*/\*
-  **text** text/plain
-  **txt** text/plain
-  **csv** application/vnd.ms-excel, text/plain
-  **form** application/x-www-form-urlencoded
-  **file** multipart/form-data
-  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
-  **xhtml-mobile** application/vnd.wap.xhtml+xml
-  **xml** application/xml, text/xml
-  **rss** application/rss+xml
-  **atom** application/atom+xml
-  **amf** application/x-amf
-  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript, image/vnd.wap.wbmp
-  **wml** text/vnd.wap.wml
-  **wmlscript** text/vnd.wap.wmlscript
-  **wbmp** image/vnd.wap.wbmp
-  **pdf** application/pdf
-  **zip** application/x-zip
-  **tar** application/x-tar

prefers($type = null)

Determines which content-types the client prefers. If no parameter is
given the most likely content type is returned. If $type is an array the
first type the client accepts will be returned. Preference is determined
primarily by the file extension parsed by Router if one has been
provided, and secondly by the list of content-types in HTTP\_ACCEPT.

renderAs($controller, $type)

-  $controller - Controller Reference
-  $type - friendly content type name to render content for ex. xml,
   rss.

Change the render mode of a controller to the specified type. Will also
append the appropriate helper to the controller's helper array if
available and not already in the array.

respondAs($type, $options)

-  $type - Friendly content type name ex. xml, rss or a full content
   type like application/x-shockwave
-  $options - If $type is a friendly type name that has more than one
   content association, $index is used to select the content type.

Sets the response header based on content-type map names. If DEBUG is
greater than 1, the header is not set.

responseType()

Returns the current response type Content-type header or null if one has
yet to be set.

mapType($ctype)

Maps a content-type back to an alias
