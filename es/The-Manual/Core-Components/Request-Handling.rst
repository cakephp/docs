Request Handling
################

El componente *Request Handler* (manejador de la petición) es usado en
CakePHP para obtener información adicional sobre las peticiones HTTP que
son realizadas a tus aplicaciones. Puedes usarlo para informar a tus
controladores sobre Ajax, como también para obtener información
adicional sobre tipos de contenido que el cliente acepta y cambiar
automáticamente al *layout* apropiado cuando estén activadas las
extensiones de ficheros.

Por defecto, RequestHandler detectará automáticamente las peticiones
Ajax basadas en la cabecera HTTP-X-Requested-With que utilizan muchas
librerías javascript. Cuando se utiliza junto con
Router::parseExtensions(), RequestHandler cambiará automáticamente los
ficheros de *layout* y vista a aquellos que coincidan con el tipo
pedido. Además, si existe un *helper* con el mismo nombre que la
extensión pedida, se añadirá al array de *helpers* del controlador.
Finalmente, si son "POSTeados" datos XML a tus controladores, se
parsearán en un objecto XML que se asigna a Controller::data, y que
puede entonces ser salvado como datos de modelo. Para poder hacer uso de
*Request handler*, debe ser incluído en tu array $components.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        //resto del controlador
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

getReferrer()

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

-  $name string - The name of the Content-type ie. html, css, json, xml.
-  $type mixed - The mime-type(s) that the Content-type maps to.

setContent adds/sets the Content-types for the given name. Allows
content-types to be mapped to friendly aliases and or extensions. This
allows RequestHandler to automatically respond to requests of each type
in its startup method. Furthermore, these content types are used by
prefers() and accepts().

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
first type the client accepts will be returned. Preference os determined
primarily by the file extension parsed by Router if one has been
provided. and secondly by the list of content-types in HTTP\_ACCEPT.

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
