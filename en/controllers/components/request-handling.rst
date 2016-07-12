Request Handling
################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $config = [])

The Request Handler component is used in CakePHP to obtain
additional information about the HTTP requests that are made to
your applications. You can use it to inform your controllers about
AJAX as well as gain additional insight into content types that the
client accepts and automatically changes to the appropriate layout
when file extensions are enabled.

By default RequestHandler will automatically detect AJAX requests
based on the HTTP-X-Requested-With header that many JavaScript
libraries use. When used in conjunction with
:php:meth:`Cake\\Routing\\Router::extensions()`, RequestHandler will
automatically switch the layout and template files to those that match the requested
type. Furthermore, if a helper with the same name as the requested
extension exists, it will be added to the Controllers Helper array.
Lastly, if XML/JSON data is POST'ed to your Controllers, it will be
parsed into an array which is assigned to ``$this->request->data``,
and can then be saved as model data. In order to make use of
RequestHandler it must be included in your ``initialize()`` method::

    class WidgetsController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        // Rest of controller
    }

Obtaining Request Information
=============================

Request Handler has several methods that provide information about
the client and its request.

.. php:method:: accepts($type = null)

    $type can be a string, or an array, or null. If a string, accepts
    will return ``true`` if the client accepts the content type. If an
    array is specified, accepts return ``true`` if any one of the content
    types is accepted by the client. If null returns an array of the
    content-types that the client accepts. For example::

        class ArticlesController extends AppController
        {

            public function initialize()
            {
                parent::initialize();
                $this->loadComponent('RequestHandler');
            }

            public function beforeFilter(Event $event)
            {
                if ($this->RequestHandler->accepts('html')) {
                    // Execute code only if client accepts an HTML (text/html)
                    // response.
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // Execute XML-only code
                }
                if ($this->RequestHandler->accepts(['xml', 'rss', 'atom'])) {
                    // Executes if the client accepts any of the above: XML, RSS
                    // or Atom.
                }
            }
        }

Other request 'type' detection methods include:

.. php:method:: isXml()

    Returns ``true`` if the current request accepts XML as a response.

.. php:method:: isRss()

    Returns ``true`` if the current request accepts RSS as a response.

.. php:method:: isAtom()

    Returns ``true`` if the current call accepts an Atom response, false
    otherwise.

.. php:method:: isMobile()

    Returns ``true`` if user agent string matches a mobile web browser, or
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

    Returns ``true`` if the client accepts WAP content.

All of the above request detection methods can be used in a similar
fashion to filter functionality intended for specific content
types. For example when responding to AJAX requests, you often will
want to disable browser caching, and change the debug level.
However, you want to allow caching for non-AJAX requests. The
following would accomplish that::

        if ($this->request->is('ajax')) {
            $this->response->disableCache();
        }
        // Continue Controller action

Automatically Decoding Request Data
===================================

Add a request data decoder. The handler should contain a callback, and any
additional arguments for the callback. The callback should return
an array of data contained in the request input. For example adding a CSV
handler could look like::

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $parser = function ($data) {
                $rows = str_getcsv($data, "\n");
                foreach ($rows as &$row) {
                    $row = str_getcsv($row, ',');
                }
                return $rows;
            };
            $this->loadComponent('RequestHandler', [
                'inputTypeMap' => [
                    'csv' => [$parser]
                ]
            ]);
        }
    }

You can use any `callable <http://php.net/callback>`_ for the handling function.
You can also pass additional arguments to the callback, this is useful for
callbacks like ``json_decode``::

    $this->RequestHandler->addInputType('json', ['json_decode', true]);

    // After 3.1.0 you should use
    $this->RequestHandler->config('inputTypeMap.json', ['json_decode', true]);

The above will make ``$this->request->data`` an array of the JSON input data,
without the additional ``true`` you'd get a set of ``StdClass`` objects.

.. deprecated:: 3.1.0
    As of 3.1.0 the ``addInputType()`` method is deprecated. You should use
    ``config()`` to add input types at runtime.

Checking Content-Type Preferences
=================================

.. php:method:: prefers($type = null)

Determines which content-types the client prefers. If no parameter
is given the most likely content type is returned. If $type is an
array the first type the client accepts will be returned.
Preference is determined primarily by the file extension parsed by
Router if one has been provided, and secondly by the list of
content-types in ``HTTP\_ACCEPT``::

    $this->RequestHandler->prefers('json');

Responding To Requests
======================

.. php:method:: renderAs($controller, $type)

Change the render mode of a controller to the specified type. Will
also append the appropriate helper to the controller's helper array
if available and not already in the array::

    // Force the controller to render an xml response.
    $this->RequestHandler->renderAs($this, 'xml');

This method will also attempt to add a helper that matches your current content
type. For example if you render as ``rss``, the ``RssHelper`` will be added.

.. php:method:: respondAs($type, $options)

Sets the response header based on content-type map names. This method lets you
set a number of response properties at once::

    $this->RequestHandler->respondAs('xml', [
        // Force download
        'attachment' => true,
        'charset' => 'UTF-8'
    ]);

.. php:method:: responseType()

Returns the current response type Content-type header or null if one has yet to
be set.


Taking Advantage of HTTP Cache Validation
=========================================

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
the client. The response status code is then set to ``304 Not Modified``.

You can opt-out this automatic checking by setting the ``checkHttpCache``
setting to ``false``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'checkHttpCache' => false
        ]);
    }

Using custom ViewClasses
========================

When using JsonView/XmlView you might want to override the default serialization
with a custom View class, or add View classes for other types.

You can map existing and new types to your custom classes. You can also set this
automatically by using the ``viewClassMap`` setting::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => [
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            ]
        ]);
    }

.. deprecated:: 3.1.0
    As of 3.1.0 the ``viewClassMap()`` method is deprecated. You should use
    ``config()`` to change the viewClassMap at runtime.

.. meta::
    :title lang=en: Request Handling
    :keywords lang=en: handler component,javascript libraries,public components,null returns,model data,request data,content types,file extensions,ajax,meth,content type,array,conjunction,cakephp,insight,php
