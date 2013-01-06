Request Handling
################

The Request Handler component is used in CakePHP to obtain additional
information about the HTTP requests that are made to your applications.
You can use it to inform your controllers about Ajax as well as gain
additional insight into content types that the client accepts and
automatically changes to the appropriate layout when file extensions are
enabled.

By default RequestHandler will automatically detect Ajax requests based
on the HTTP-X-Requested-With header that many javascript libraries use.
When used in conjunction with Router::parseExtensions() RequestHandler
will automatically switch the layout and view files to those that match
the requested type. Furthermore, if a helper with the same name as the
requested extension exists, it will be added to the Controllers Helper
array. Lastly, if XML data is POST'ed to your Controllers, it will be
parsed into an XML object which is assigned to Controller::data, and can
then be saved as model data. In order to make use of Request Handler it
must be included in your $components array.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        //rest of controller
    }
    ?>

Obtaining Request Information
=============================

Request Handler has several methods that provide information about the
client and its request.

accepts ( $type = null)

$type can be a string, or an array, or null. If a string, accepts will
return true if the client accepts the content type. If an array is
specified, accepts return true if any one of the content types is
accepted by the client. If null returns an array of the content-types
that the client accepts. For example:

::

    class PostsController extends AppController {
        
        var $components = array('RequestHandler');

        function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // Execute code only if client accepts an HTML (text/html) response
            } elseif ($this->RequestHandler->accepts('xml')) {
                // Execute XML-only code
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                // Executes if the client accepts any of the above: XML, RSS or Atom
            }
        }
    }

Other request 'type' detection methods include:

isAjax()

Returns true if the request contains the X-Requested-Header equal to
XMLHttpRequest.

isSSL()

Returns true if the current request was made over an SSL connection.

isXml()

Returns true if the current request accepts XML as a response.

isRss()

Returns true if the current request accepts RSS as a response.

isAtom()

Returns true if the current call accepts an Atom response, false
otherwise.

isMobile()

Returns true if user agent string matches a mobile web browser, or if
the client accepts WAP content. The supported Mobile User Agent strings
are:

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

Returns true if the client accepts WAP content.

All of the above request detection methods can be used in a similar
fashion to filter functionality intended for specific content types. For
example when responding to Ajax requests, you often will want to disable
browser caching, and change the debug level. However, you want to allow
caching for non-ajax requests. The following would accomplish that:

::

        if ($this->RequestHandler->isAjax()) {
            Configure::write('debug', 0);
            $this->header('Pragma: no-cache');
            $this->header('Cache-control: no-cache');
            $this->header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        }
        //Continue Controller action

You could also disable caching with the functionally analogous
``Controller::disableCache``

::

        if ($this->RequestHandler->isAjax()) {
            $this->disableCache();
        }
        //Continue Controller action

Request Type-Erkennung
======================

Der RequestHandler liefert ebenfalls Informationen darüber, welcher Typ
von HTTP-Request gemacht wurde und erlaubt so, auf jeden Request Type zu
antworten.

isPost()

Gibt true zurück, wenn der Request ein POST-Request ist.

isPut()

Gibt true zurück, wenn der Request ein PUT-Request ist.

isGet()

Gibt true zurück, wenn der Request ein GET-Request ist.

isDelete()

Gibt true zurück, wenn der Request ein DELETE-Request ist.

Zusätzliche Informationen über den Client erhalten
==================================================

getClientIP()

Gibt die IP-Adresse des remote-Clients zurück.

getReferrer()

Gibt den Domainnamen zurück, von dem der Request ursprünglich ausgelöst
wurde.

getAjaxVersion()

Gibt die Prototype-Version zurück, wenn der Aufruf von Ajax kommt und
ansonsten einen leeren String. Die Prototype-Bibliothek setzez einen
speziellen "Prototype version" HTTP header.

Auf Requests antworten
======================

Zusätzlich zur Request-Erkennung ermöglicht der RequestHandler einen
einfachen Zugang zum Ändern des Mappings für die Output- und
Content-Types der Anwendung.

setContent($name, $type = null)

-  $name string - Der Name des Content-Types, d.h. html, css, json, xml.
-  $type mixed - Die mime-type(s), zu denen der Content-type gehört.

setContent setzt bzw. fügt den Content-Type für einen gegebenen Namen
hinzu und erlaubt das Mappen der Content-Types zu benutzerfreundlicheren
Abkürzungen und Aliassen. Dies erlaubt dem RequestHandler automatisch
auf jeden Requesttyp in seiner startup-Methode zu antworten. Weiterhin
werden diese Content-Types von prefers() und accepts() verwendet.

setContent wird am besten in der beforeFilter()-Methode der Controller
benutzt, da dies am ehesten der Automatisierung der Content-Type-Aliasse
dient.

Das Standard-Mapping sieht folgendermaßen aus:

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

Gibt an, welchen Content-Type der Client bevorzugt. Wenn kein Parameter
angegeben ist, wird der wahrscheinlichste Wert zurückgegeben. Wenn $type
ein Array ist, wird der erste Typ zurückgegeben, den der Client
aktzeptiert. Das bevorzugte Betriebssystem wird hauptsächlich durch die
Dateiendung ermittelt, falls diese vom Router geparst und übermittelt
wird. Als Alternative wird die Liste von Content-Types in HTTP\_ACCEPT
genutzt.

renderAs($controller, $type)

-  $controller - Controller-Referenz
-  $type - Benutzerfreundlicher Name für den Content-Type, um den
   Content z.B. auf xml oder rss zu rendern.

Ändert den Render-Modus des Controllers auf den angegebenen Typ. Hängt,
falls verfügbar und noch nicht im Array vorhanden, ebenfalls den
passenden Helper zum Helper-Array des Controllers hinzu.

respondAs($type, $options)

-  $type - Benutzerfreundlicher Name für den Content-Type wie xml, rss
   oder ein kompletter Content-Type wie application/x-shockwave.
-  $options - Wenn $type ein benutzerfreundlicher Name ist, der mehr als
   eine Content-Assoziation hat, wird $index verwendet um einen
   Content-Type auszuwählen.

Setzt den Response-Header basierend auf dem Namen der Content-Type-Map.
Falls DEBUG größer als 2 ist, wird dieser Header nicht gesetzt.

responseType()

Gibt den aktuellen Response-Type des Content-Type zurück oder null, wenn
dieser noch gesetzt werden muss.

mapType($ctype)

Mapt einen Content-Type auf ein Alias zurück.
