# Request Handling

`class` **RequestHandlerComponent**(ComponentCollection $collection, array $settings = array())

The Request Handler component is used in CakePHP to obtain
additional information about the HTTP requests that are made to
your applications. You can use it to inform your controllers about
AJAX as well as gain additional insight into content types that the
client accepts and automatically changes to the appropriate layout
when file extensions are enabled.

By default RequestHandler will automatically detect AJAX requests
based on the HTTP-X-Requested-With header that many javascript
libraries use. When used in conjunction with
`Router::parseExtensions()` RequestHandler will automatically switch
the layout and view files to those that match the requested type.
Furthermore, if a helper with the same name as the requested
extension exists, it will be added to the Controllers Helper array.
Lastly, if XML/JSON data is POST'ed to your Controllers, it will be
parsed into an array which is assigned to `$this->request->data`,
and can then be saved as model data. In order to make use of
RequestHandler it must be included in your \$components array:

``` php
class WidgetController extends AppController {

    public $components = array('RequestHandler');

    // Rest of controller
}
```

## Obtaining Request Information

Request Handler has several methods that provide information about
the client and its request.

`method` RequestHandlerComponent::**accepts**($type = null)

Other request 'type' detection methods include:

`method` RequestHandlerComponent::**isXml**()

`method` RequestHandlerComponent::**isRss**()

`method` RequestHandlerComponent::**isAtom**()

`method` RequestHandlerComponent::**isMobile**()

`method` RequestHandlerComponent::**isWap**()

All of the above request detection methods can be used in a similar
fashion to filter functionality intended for specific content
types. For example when responding to AJAX requests, you often will
want to disable browser caching, and change the debug level.
However, you want to allow caching for non-AJAX requests. The
following would accomplish that:

``` php
if ($this->request->is('ajax')) {
    $this->disableCache();
}
// Continue Controller action
```

## Obtaining Additional Client Information

`method` RequestHandlerComponent::**getAjaxVersion**()

## Automatically decoding request data

`method` RequestHandlerComponent::**addInputType**($type, $handler)

## Responding To Requests

In addition to request detection RequestHandler also provides easy
access to altering the output and content type mappings for your
application.

`method` RequestHandlerComponent::**setContent**($name, $type = null)

`method` RequestHandlerComponent::**prefers**($type = null)

`method` RequestHandlerComponent::**renderAs**($controller, $type)

`method` RequestHandlerComponent::**respondAs**($type, $options)

`method` RequestHandlerComponent::**responseType**()

## Taking advantage of HTTP cache validation

<div class="versionadded">

2.1

</div>

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
the client. The response status code is then set to <span class="title-ref">304 Not Modified</span>.

You can opt-out this automatic checking by setting the `checkHttpCache`
setting to false:

``` php
public $components = array(
    'RequestHandler' => array(
        'checkHttpCache' => false
));
```

## Using custom ViewClasses

<div class="versionadded">

2.3

</div>

When using JsonView/XmlView you might want to override the default serialization
with a custom View class, or add View classes for other types.

You can map existing and new types to your custom classes.

`method` RequestHandlerComponent::**viewClassMap**($type, $viewClass)

You can also set this automatically by using the `viewClassMap` setting:

``` php
public $components = array(
    'RequestHandler' => array(
        'viewClassMap' => array(
            'json' => 'ApiKit.MyJson',
            'xml' => 'ApiKit.MyXml',
            'csv' => 'ApiKit.Csv'
        )
));
```
