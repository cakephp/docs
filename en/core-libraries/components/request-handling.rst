Request Handling
################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $settings = array())

The Request Handler component is used in CakePHP to obtain
additional information about the HTTP requests that are made to
your applications. You can use it to inform your controllers about
AJAX as well as gain additional insight into content types that the
client accepts and automatically changes to the appropriate layout
when file extensions are enabled.

By default RequestHandler will automatically detect AJAX requests
based on the HTTP-X-Requested-With header that many javascript
libraries use. When used in conjunction with
:php:meth:`Router::parseExtensions()` RequestHandler will automatically switch
the layout and view files to those that match the requested type.
Furthermore, if a helper with the same name as the requested
extension exists, it will be added to the Controllers Helper array.
Lastly, if XML/JSON data is POST'ed to your Controllers, it will be
parsed into an array which is assigned to ``$this->request->data``,
and can then be saved as model data. In order to make use of
RequestHandler it must be included in your $components array::

    class WidgetController extends AppController {

        public $components = array('RequestHandler');

        // Rest of controller
    }

Obtaining Request Information
=============================

Request Handler has several methods that provide information about
the client and its request.

.. php:method:: accepts($type = null)

    $type can be a string, or an array, or null. If a string, accepts
    will return true if the client accepts the content type. If an
    array is specified, accepts return true if any one of the content
    types is accepted by the client. If null returns an array of the
    content-types that the client accepts. For example::

        class PostsController extends AppController {

            public $components = array('RequestHandler');

            public function beforeFilter() {
                if ($this->RequestHandler->accepts('html')) {
                    // Execute code only if client accepts an HTML (text/html)
                    // response
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // Execute XML-only code
                }
                if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                    // Executes if the client accepts any of the above: XML, RSS
                    // or Atom
                }
            }
        }

Other request 'type' detection methods include:

.. php:method:: isXml()

    Returns true if the current request accepts XML as a response.

.. php:method:: isRss()

    Returns true if the current request accepts RSS as a response.

.. php:method:: isAtom()

    Returns true if the current call accepts an Atom response, false
    otherwise.

.. php:method:: isMobile()

    Returns true if user agent string matches a mobile web browser, or
    if the client accepts WAP content. The supported Mobile User Agent
    strings are:

    -  Android
    -  AvantGo
    -  BlackBerry
    -  DoCoMo
    -  Fennec
    -  iPad
    -  iPhone
    -  iPod
    -  J2ME
    -  MIDP
    -  NetFront
    -  Nokia
    -  Opera Mini
    -  Opera Mobi
    -  PalmOS
    -  PalmSource
    -  portalmmm
    -  Plucker
    -  ReqwirelessWeb
    -  SonyEricsson
    -  Symbian
    -  UP.Browser
    -  webOS
    -  Windows CE
    -  Windows Phone OS
    -  Xiino

.. php:method:: isWap()

    Returns true if the client accepts WAP content.

All of the above request detection methods can be used in a similar
fashion to filter functionality intended for specific content
types. For example when responding to AJAX requests, you often will
want to disable browser caching, and change the debug level.
However, you want to allow caching for non-AJAX requests. The
following would accomplish that::

        if ($this->request->is('ajax')) {
            $this->disableCache();
        }
        // Continue Controller action



Obtaining Additional Client Information
=======================================

.. php:method:: getAjaxVersion()

    Gets Prototype version if call is AJAX, otherwise empty string. The
    Prototype library sets a special "Prototype version" HTTP header.

Automatically decoding request data
===================================

.. php:method:: addInputType($type, $handler)

    :param string $type: The content type alias this attached decoder is for.
        e.g. 'json' or 'xml'
    :param array $handler: The handler information for the type.

    Add a request data decoder. The handler should contain a callback, and any
    additional arguments for the callback. The callback should return
    an array of data contained in the request input. For example adding a CSV
    handler in your controllers' beforeFilter could look like::

        $parser = function ($data) {
            $rows = str_getcsv($data, "\n");
            foreach ($rows as &$row) {
                $row = str_getcsv($row, ',');
            }
            return $rows;
        };
        $this->RequestHandler->addInputType('csv', array($parser));

    The above example requires PHP 5.3, however you can use any
    `callable <http://php.net/callback>`_ for the handling function. You can
    also pass additional arguments to the callback, this is useful for callbacks
    like ``json_decode``::

        $this->RequestHandler->addInputType('json', array('json_decode', true));

    The above will make ``$this->request->data`` an array of the JSON input data,
    without the additional ``true`` you'd get a set of ``StdClass`` objects.

Responding To Requests
======================

In addition to request detection RequestHandler also provides easy
access to altering the output and content type mappings for your
application.

.. php:method:: setContent($name, $type = null)

    :param string $name: The name or file extension of the Content-type
       ie. html, css, json, xml.
    :param mixed $type: The mime-type(s) that the Content-type maps to.

    setContent adds/sets the Content-types for the given name. Allows
    content-types to be mapped to friendly aliases and or extensions.
    This allows RequestHandler to automatically respond to requests of
    each type in its startup method. If you are using
    Router::parseExtension, you should use the file extension as the
    name of the Content-type. Furthermore, these content types are used
    by prefers() and accepts().

    setContent is best used in the beforeFilter() of your controllers,
    as this will best leverage the automagicness of content-type
    aliases.

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
    -  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript,
       image/vnd.wap.wbmp
    -  **wml** text/vnd.wap.wml
    -  **wmlscript** text/vnd.wap.wmlscript
    -  **wbmp** image/vnd.wap.wbmp
    -  **pdf** application/pdf
    -  **zip** application/x-zip
    -  **tar** application/x-tar

.. php:method:: prefers($type = null)

    Determines which content-types the client prefers. If no parameter
    is given the most likely content type is returned. If $type is an
    array the first type the client accepts will be returned.
    Preference is determined primarily by the file extension parsed by
    Router if one has been provided, and secondly by the list of
    content-types in HTTP\_ACCEPT.

.. php:method:: renderAs($controller, $type)

    :param Controller $controller: Controller Reference
    :param string $type: friendly content type name to render content for ex.
       xml, rss.

    Change the render mode of a controller to the specified type. Will
    also append the appropriate helper to the controller's helper array
    if available and not already in the array.

.. php:method:: respondAs($type, $options)

    :param string $type: Friendly content type name ex. xml, rss or a full
       content type like application/x-shockwave
    :param array $options: If $type is a friendly type name that has more than
       one content association, $index is used to select the content
       type.

    Sets the response header based on content-type map names.

.. php:method:: responseType()

    Returns the current response type Content-type header or null if
    one has yet to be set.


Taking advantage of HTTP cache validation
=========================================

.. versionadded:: 2.1

The HTTP cache validation model is one of the processes used for cache
gateways, also known as reverse proxies, to determine if they can serve a
stored copy of a response to the client. Under this model, you mostly save
bandwidth, but when used correctly you can also save some CPU processing,
reducing this way response times.

Enabling the RequestHandlerComponent in your controller automatically activates
a check done before rendering the view. This check compares the response object
against the original request to determine whether the response was not modified
since the last time the client asked for it.

If response is evaluated as not modified, then the view rendering process is
stopped, saving processing time, saving bandwidth and no content is returned to
the client. The response status code is then set to `304 Not Modified`.

You can opt-out this automatic checking by setting the ``checkHttpCache``
setting to false::

    public $components = array(
        'RequestHandler' => array(
            'checkHttpCache' => false
    ));

Using custom ViewClasses
========================

.. versionadded:: 2.3

When using JsonView/XmlView you might want to override the default serialization
with a custom View class, or add View classes for other types.

You can map existing and new types to your custom classes.

.. php:method:: viewClassMap($type, $viewClass)

    :param string|array $type: The type string or map array with format ``array('json' => 'MyJson')``
    :param string $viewClass: The viewClass to be used for the type without `View` appended

You can also set this automatically by using the ``viewClassMap`` setting::

    public $components = array(
        'RequestHandler' => array(
            'viewClassMap' => array(
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            )
    ));

.. meta::
    :title lang=en: Request Handling
    :keywords lang=en: handler component,javascript libraries,public components,null returns,model data,request data,content types,file extensions,ajax,meth,content type,array,conjunction,cakephp,insight,php
