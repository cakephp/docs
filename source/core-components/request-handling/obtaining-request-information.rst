5.5.1 Obtaining Request Information
-----------------------------------

Request Handler has several methods that provide information about
the client and its request.

accepts ( $type = null)
$type can be a string, or an array, or null. If a string, accepts
will return true if the client accepts the content type. If an
array is specified, accepts return true if any one of the content
types is accepted by the client. If null returns an array of the
content-types that the client accepts. For example:

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
Returns true if the request contains the X-Requested-Header equal
to XMLHttpRequest.

isSSL()
Returns true if the current request was made over an SSL
connection.

isXml()
Returns true if the current request accepts XML as a response.

isRss()
Returns true if the current request accepts RSS as a response.

isAtom()
Returns true if the current call accepts an Atom response, false
otherwise.

isMobile()
Returns true if user agent string matches a mobile web browser, or
if the client accepts WAP content. The supported Mobile User Agent
strings are:


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
fashion to filter functionality intended for specific content
types. For example when responding to Ajax requests, you often will
want to disable browser caching, and change the debug level.
However, you want to allow caching for non-ajax requests. The
following would accomplish that:

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

5.5.1 Obtaining Request Information
-----------------------------------

Request Handler has several methods that provide information about
the client and its request.

accepts ( $type = null)
$type can be a string, or an array, or null. If a string, accepts
will return true if the client accepts the content type. If an
array is specified, accepts return true if any one of the content
types is accepted by the client. If null returns an array of the
content-types that the client accepts. For example:

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
Returns true if the request contains the X-Requested-Header equal
to XMLHttpRequest.

isSSL()
Returns true if the current request was made over an SSL
connection.

isXml()
Returns true if the current request accepts XML as a response.

isRss()
Returns true if the current request accepts RSS as a response.

isAtom()
Returns true if the current call accepts an Atom response, false
otherwise.

isMobile()
Returns true if user agent string matches a mobile web browser, or
if the client accepts WAP content. The supported Mobile User Agent
strings are:


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
fashion to filter functionality intended for specific content
types. For example when responding to Ajax requests, you often will
want to disable browser caching, and change the debug level.
However, you want to allow caching for non-ajax requests. The
following would accomplish that:

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
