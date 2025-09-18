# Request Handling

`class` **RequestHandlerComponent**(ComponentCollection $collection, array $config = [])

The Request Handler component is used in CakePHP to obtain additional
information about the HTTP requests that are made to your application. You can
use it to see what content types clients prefer, automatically parse request
input, define how content types map to view classes or template paths.

By default RequestHandler will automatically detect AJAX requests based on the
`X-Requested-With` HTTP header that many JavaScript libraries use. When used
in conjunction with `Cake\Routing\Router::extensions()`,
RequestHandler will automatically switch the layout and template files to those
that match non-HTML media types. Furthermore, if a helper with the same name as
the requested extension exists, it will be added to the Controllers Helper
array. Lastly, if XML/JSON data is POST'ed to your Controllers, it will be
parsed into an array which is assigned to `$this->request->getData()`, and can then
be accessed as you would standard POST data. In order to make use of
RequestHandler it must be included in your `initialize()` method:

``` php
class WidgetsController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

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
    $this->response = $this->response->withDisabledCache();

    // Prior to 3.4.0
    $this->response->disableCache();
}
// Continue Controller action
```

## Automatically Decoding Request Data

Add a request data decoder. The handler should contain a callback, and any
additional arguments for the callback. The callback should return
an array of data contained in the request input. For example adding a CSV
handler could look like:

``` php
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
```

You can use any [callable](https://php.net/callback) for the handling function.
You can also pass additional arguments to the callback, this is useful for
callbacks like `json_decode`:

``` php
$this->RequestHandler->addInputType('json', ['json_decode', true]);

// After 3.1.0 you should use
$this->RequestHandler->config('inputTypeMap.json', ['json_decode', true]);
```

The above will make `$this->request->getData()` an array of the JSON input data,
without the additional `true` you'd get a set of `stdClass` objects.

<div class="deprecated">

3.1.0
As of 3.1.0 the `addInputType()` method is deprecated. You should use
`config()` to add input types at runtime.

</div>

::: info Changed in version 3.6.0
You should prefer using  instead ofRequestHandlerComponent.
:::

## Checking Content-Type Preferences

`method` RequestHandlerComponent::**prefers**($type = null)

Determines which content-types the client prefers. If no parameter
is given the most likely content type is returned. If \$type is an
array the first type the client accepts will be returned.
Preference is determined primarily by the file extension parsed by
Router if one has been provided, and secondly by the list of
content-types in `HTTP_ACCEPT`:

``` php
$this->RequestHandler->prefers('json');
```

## Responding To Requests

`method` RequestHandlerComponent::**renderAs**($controller, $type)

Change the render mode of a controller to the specified type. Will
also append the appropriate helper to the controller's helper array
if available and not already in the array:

``` php
// Force the controller to render an xml response.
$this->RequestHandler->renderAs($this, 'xml');
```

This method will also attempt to add a helper that matches your current content
type. For example if you render as `rss`, the `RssHelper` will be added.

`method` RequestHandlerComponent::**respondAs**($type, $options)

Sets the response header based on content-type map names. This method lets you
set a number of response properties at once:

``` php
$this->RequestHandler->respondAs('xml', [
    // Force download
    'attachment' => true,
    'charset' => 'UTF-8'
]);
```

`method` RequestHandlerComponent::**responseType**()

Returns the current response type Content-type header or null if one has yet to
be set.

## Taking Advantage of HTTP Cache Validation

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

You can opt-out this automatic checking by setting the `checkHttpCache`
setting to `false`:

``` php
public function initialize()
{
    parent::initialize();
    $this->loadComponent('RequestHandler', [
        'checkHttpCache' => false
    ]);
}
```

## Using Custom ViewClasses

When using JsonView/XmlView you might want to override the default serialization
with a custom View class, or add View classes for other types.

You can map existing and new types to your custom classes. You can also set this
automatically by using the `viewClassMap` setting:

``` php
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
```

<div class="deprecated">

3.1.0
As of 3.1.0 the `viewClassMap()` method is deprecated. You should use
`config()` to change the viewClassMap at runtime.

</div>
