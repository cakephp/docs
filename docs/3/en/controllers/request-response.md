# Request & Response Objects

The request and response objects provide an abstraction around HTTP requests and
responses. The request object in CakePHP allows you to introspect an incoming
request, while the response object allows you to effortlessly create HTTP
responses from your controllers.

<div class="index">

\$this-\>request

</div>

<a id="cake-request"></a>

## Request

`class` Cake\\Http\\**ServerRequest**

`ServerRequest` is the default request object used in CakePHP. It centralizes a
number of features for interrogating and interacting with request data.
On each request one Request is created and then passed by reference to the
various layers of an application that use request data. By default the request
is assigned to `$this->request`, and is available in Controllers, Cells, Views
and Helpers. You can also access it in Components using the controller
reference. Some of the duties `ServerRequest` performs include:

- Processing the GET, POST, and FILES arrays into the data structures you are
  familiar with.
- Providing environment introspection pertaining to the request. Information
  like the headers sent, the client's IP address, and the subdomain/domain
  names the server your application is running on.
- Providing access to request parameters both as array indexes and object
  properties.

As of 3.4.0, CakePHP's request object implements the [PSR-7
ServerRequestInterface](https://www.php-fig.org/psr/psr-7/) making it easier to
use libraries from outside of CakePHP.

### Request Parameters

The request exposes routing parameters through the `getParam()` method:

``` php
$controllerName = $this->request->getParam('controller');

// Prior to 3.4.0
$controllerName = $this->request->param('controller');
```

To get all routing parameters as an array use `getAttribute()`:

``` php
$parameters = $this->request->getAttribute('params');
```

All [Route Elements](../development/routing#route-elements) are accessed through this interface.

In addition to [Route Elements](../development/routing#route-elements), you also often need access to
[Passed Arguments](../development/routing#passed-arguments). These are both available on the request object as
well:

``` php
// Passed arguments
$passedArgs = $this->request->getParam('pass');
```

Will all provide you access to the passed arguments. There
are several important/useful parameters that CakePHP uses internally, these
are also all found in the routing parameters:

- `plugin` The plugin handling the request. Will be null when there is no
  plugin.
- `controller` The controller handling the current request.
- `action` The action handling the current request.
- `prefix` The prefix for the current action. See [Prefix Routing](../development/routing#prefix-routing) for
  more information.

### Query String Parameters

`method` Cake\\Http\\ServerRequest::**getQuery**($name)

Query string parameters can be read using the `getQuery()` method:

``` php
// URL is /posts/index?page=1&sort=title
$page = $this->request->getQuery('page');

// Prior to 3.4.0
$page = $this->request->query('page');
```

You can either directly access the query property, or you can use
`getQuery()` method to read the URL query array in an error-free manner.
Any keys that do not exist will return `null`:

``` php
$foo = $this->request->getQuery('value_that_does_not_exist');
// $foo === null

// You can also provide default values
$foo = $this->request->getQuery('does_not_exist', 'default val');
```

If you want to access all the query parameters you can use
`getQueryParams()`:

``` php
$query = $this->request->getQueryParams();
```

<div class="versionadded">

3.4.0
`getQueryParams()` and `getQuery()` were added in 3.4.0

</div>

### Request Body Data

`method` Cake\\Http\\ServerRequest::**getData**($name, $default = null)

All POST data can be accessed using
`Cake\Http\ServerRequest::getData()`. Any form data that
contains a `data` prefix will have that data prefix removed. For example:

``` php
// An input with a name attribute equal to 'MyModel[title]' is accessible at
$title = $this->request->getData('MyModel.title');
```

Any keys that do not exist will return `null`:

``` php
$foo = $this->request->getData('Value.that.does.not.exist');
// $foo == null
```

<a id="request-file-uploads"></a>

### File Uploads

Uploaded files can be accessed through the request body data, using the `Cake\Http\ServerRequest::getData()`
method described above. For example, a file from an input element with a name attribute of `MyModel[attachment]`, can
be accessed like this:

``` php
$attachment = $this->request->getData('MyModel.attachment');
```

By default file uploads are represented in the request data as arrays, with a normalized structure that remains the same
even for nested inputs/names, which is different from how PHP represents them in the `$_FILES` superglobal (refer to
[the PHP manual](https://www.php.net/manual/en/features.file-upload.php) for more information), ie the
`$attachment` value would look something like this:

    [
        'name' => 'attachment.txt',
        'type' => 'text/plain',
        'size' => 123,
        'tmp_name' => '/tmp/hfz6dbn.tmp'
        'error' => 0
    ]

Alternatively it's possible to have CakePHP provide the uploads in the request data as objects that implement
[\Psr\Http\Message\UploadedFileInterface](https://www.php-fig.org/psr/psr-7/#16-uploaded-files). In order to
enable this behavior, set the configuration value `App.uploadedFilesAsObjects` to `true`, for example in your
`config/app.php` file:

    return [
        // ...
        'App' => [
            // ...
            'uploadedFilesAsObjects' => true,
        ],
        // ...
    ];

In the above example, `$attachment` would then hold an object, in the current implementation it would by default be an
instance of `\Zend\Diactoros\UploadedFile`.

<div class="versionadded">

3.9.0
Support for uploaded files as objects in the request data was added in version 3.9.0

</div>

Furthermore uploaded files can be accessed as objects separately from the request data via the
`Cake\Http\ServerRequest::getUploadedFile()` and
`Cake\Http\ServerRequest::getUploadedFiles()` methods. These methods will always return objects,
irrespectively of the `App.uploadedFilesAsObjects` configuration.

`method` Cake\\Http\\ServerRequest::**getUploadedFile**($path)

Returns the uploaded file at a specific path. The path uses the same dot syntax as the
`Cake\Http\ServerRequest::getData()` method:

``` php
$attachment = $this->request->getUploadedFile('MyModel.attachment');
```

Unlike `Cake\Http\ServerRequest::getData()`, `Cake\Http\ServerRequest::getUploadedFile()` would
only return data when an actual file upload exists for the given path, if there is regular, non-file request body data
present at the given path, then this method will return `null`, just like it would for any non-existent path.

`method` Cake\\Http\\ServerRequest::**getUploadedFiles**()

Returns all uploaded files in a normalized array structure. For the above example with the file input name of
`MyModel[attachment]`, the structure would look like:

    [
        'MyModel' => [
            'attachment' => object(Zend\Diactoros\UploadedFile) {
                // ...
            }
        ]
    ]

`method` Cake\\Http\\ServerRequest::**withUploadedFiles**(array $files)

This method sets the uploaded files of the request object, it accepts an array of objects that implement
[\Psr\Http\Message\UploadedFileInterface](https://www.php-fig.org/psr/psr-7/#16-uploaded-files). It will
replace all possibly existing uploaded files:

``` php
$files = [
    'MyModel' => [
        'attachment' => new \Zend\Diactoros\UploadedFile(
            $streamOrFile,
            $size,
            $errorStatus,
            $clientFilename,
            $clientMediaType
        ),
        'anotherAttachment' => new \Zend\Diactoros\UploadedFile(
            '/tmp/hfz6dbn.tmp',
            123,
            \UPLOAD_ERR_OK,
            'attachment.txt',
            'text/plain'
        ),
    ],
];

$this->request = $this->request->withUploadedFiles($files);
```

> [!NOTE]
> Uploaded files that have been added to the request via this method, will *not* be available in the request body
> data, ie you cannot retrieve them via `Cake\Http\ServerRequest::getData()`! If you need them in the
> request data (too), then you have to set them via `Cake\Http\ServerRequest::withData()` or
> `Cake\Http\ServerRequest::withParsedBody()`.

### PUT, PATCH or DELETE Data

`method` Cake\\Http\\ServerRequest::**input**($callback, [$options])

When building REST services, you often accept request data on `PUT` and
`DELETE` requests. Any `application/x-www-form-urlencoded` request body data
will automatically be parsed and set to `$this->data` for `PUT` and
`DELETE` requests. If you are accepting JSON or XML data, see below for how
you can access those request bodies.

When accessing the input data, you can decode it with an optional function.
This is useful when interacting with XML or JSON request body content.
Additional parameters for the decoding function can be passed as arguments to
`input()`:

``` php
$jsonData = $this->request->input('json_decode');
```

### Environment Variables (from \$\_SERVER and \$\_ENV)

`method` Cake\\Http\\ServerRequest::**env**($key, $value = null)

`ServerRequest::env()` is a wrapper for `env()` global function and acts as
a getter/setter for environment variables without having to modify globals
`$_SERVER` and `$_ENV`:

``` php
// Get the host
$host = $this->request->env('HTTP_HOST');

// Set a value, generally helpful in testing.
$this->request->env('REQUEST_METHOD', 'POST');
```

To access all the environment variables in a request use `getServerParams()`:

``` php
$env = $this->request->getServerParams();
```

<div class="versionadded">

3.4.0
`getServerParams()` was added in 3.4.0

</div>

### XML or JSON Data

Applications employing [REST](../development/rest) often exchange data in
non-URL-encoded post bodies. You can read input data in any format using
`Cake\Http\ServerRequest::input()`. By providing a decoding function,
you can receive the content in a deserialized format:

``` php
// Get JSON encoded data submitted to a PUT/POST action
$jsonData = $this->request->input('json_decode');
```

Some deserializing methods require additional parameters when called, such as
the 'as array' parameter on `json_decode`. If you want XML converted into a
DOMDocument object, `Cake\Http\ServerRequest::input()` supports
passing in additional parameters as well:

``` php
// Get XML encoded data submitted to a PUT/POST action
$data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);
```

### Path Information

The request object also provides useful information about the paths in your
application. The `base` and `webroot` attributes are useful for
generating URLs, and determining whether or not your application is in a
subdirectory. The attributes you can use are:

``` php
// Assume the current request URL is /subdir/articles/edit/1?page=1

// Holds /subdir/articles/edit/1?page=1
$here = $request->getRequestTarget();

// Holds /subdir
$base = $request->getAttribute('base');

// Holds /subdir/
$base = $request->getAttribute('webroot');

// Prior to 3.4.0
$webroot = $request->webroot;
$base = $request->base;
$here = $request->here();
```

<a id="check-the-request"></a>

### Checking Request Conditions

`method` Cake\\Http\\ServerRequest::**is**($type, $args...)

The request object provides an easy way to inspect certain conditions in a given
request. By using the `is()` method you can check a number of common
conditions, as well as inspect other application specific request criteria:

``` php
$isPost = $this->request->is('post');
```

You can also extend the request detectors that are available, by using
`Cake\Http\ServerRequest::addDetector()` to create new kinds of
detectors. There are different types of detectors that you can create:

- Environment value comparison - Compares a value fetched from `env()`
  for equality with the provided value.
- Header value comparison - If the specified header exists with the specified
  value, or if the callable returns true.
- Pattern value comparison - Pattern value comparison allows you to compare a
  value fetched from `env()` to a regular expression.
- Option based comparison - Option based comparisons use a list of options to
  create a regular expression. Subsequent calls to add an already defined
  options detector will merge the options.
- Callback detectors - Callback detectors allow you to provide a 'callback' type
  to handle the check. The callback will receive the request object as its only
  parameter.

`method` Cake\\Http\\ServerRequest::**addDetector**($name, $options)

Some examples would be:

``` php
// Add an environment detector.
$this->request->addDetector(
    'post',
    ['env' => 'REQUEST_METHOD', 'value' => 'POST']
);

// Add a pattern value detector.
$this->request->addDetector(
    'iphone',
    ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
);

// Add an option detector
$this->request->addDetector('internalIp', [
    'env' => 'CLIENT_IP',
    'options' => ['192.168.0.101', '192.168.0.100']
]);


// Add a header detector with value comparison
$this->request->addDetector('fancy', [
    'env' => 'CLIENT_IP',
    'header' => ['X-Fancy' => 1]
]);

// Add a header detector with callable comparison
$this->request->addDetector('fancy', [
    'env' => 'CLIENT_IP',
    'header' => ['X-Fancy' => function ($value, $header) {
        return in_array($value, ['1', '0', 'yes', 'no'], true);
    }]
]);

// Add a callback detector. Must be a valid callable.
$this->request->addDetector(
    'awesome',
    function ($request) {
        return $request->getParam('awesome');
    }
);

// Add a detector that uses multiple condition types
// If any type matches the check passes.
$this->request->addDetector(
    'csv',
    [
        'accept' => ['text/csv'],
        'param' => '_ext',
        'value' => 'csv',
    ]
);
```

There are several built-in detectors that you can use:

- `is('get')` Check to see whether the current request is a GET.
- `is('put')` Check to see whether the current request is a PUT.
- `is('patch')` Check to see whether the current request is a PATCH.
- `is('post')` Check to see whether the current request is a POST.
- `is('delete')` Check to see whether the current request is a DELETE.
- `is('head')` Check to see whether the current request is HEAD.
- `is('options')` Check to see whether the current request is OPTIONS.
- `is('ajax')` Check to see whether the current request came with
  X-Requested-With = XMLHttpRequest.
- `is('ssl')` Check to see whether the request is via SSL.
- `is('flash')` Check to see whether the request has a User-Agent of Flash.
- `is('requested')` Check to see whether the request has a query param
  'requested' with value 1.
- `is('json')` Check to see whether the request has 'json' extension and
  accept 'application/json' mimetype.
- `is('xml')` Check to see whether the request has 'xml' extension and accept
  'application/xml' or 'text/xml' mimetype.

<div class="versionadded">

3.3.0
Detectors can take additional parameters as of 3.3.0.

</div>

`ServerRequest` also includes methods like
`Cake\Http\ServerRequest::domain()`,
`Cake\Http\ServerRequest::subdomains()` and
`Cake\Http\ServerRequest::host()` to make applications that use
subdomains simpler.

### Session Data

To access the session for a given request use the `session()` method:

``` php
$userName = $this->request->session()->read('Auth.User.name');
```

For more information, see the [Sessions](../development/sessions) documentation for how
to use the session object.

### Host and Domain Name

`method` Cake\\Http\\ServerRequest::**domain**($tldLength = 1)

Returns the domain name your application is running on:

``` php
// Prints 'example.org'
echo $request->domain();
```

`method` Cake\\Http\\ServerRequest::**subdomains**($tldLength = 1)

Returns the subdomains your application is running on as an array:

``` php
// Returns ['my', 'dev'] for 'my.dev.example.org'
$subdomains = $request->subdomains();
```

`method` Cake\\Http\\ServerRequest::**host**()

Returns the host your application is on:

``` php
// Prints 'my.dev.example.org'
echo $request->host();
```

### Reading the HTTP Method

`method` Cake\\Http\\ServerRequest::**getMethod**()

Returns the HTTP method the request was made with:

``` php
// Output POST
echo $request->getMethod();

// Prior to 3.4.0
echo $request->method();
```

### Restricting Which HTTP method an Action Accepts

`method` Cake\\Http\\ServerRequest::**allowMethod**($methods)

Set allowed HTTP methods. If not matched, will throw
`MethodNotAllowedException`. The 405 response will include the required
`Allow` header with the passed methods:

``` php
public function delete()
{
    // Only accept POST and DELETE requests
    $this->request->allowMethod(['post', 'delete']);
    ...
}
```

### Reading HTTP Headers

Allows you to access any of the `HTTP_*` headers that were used
for the request. For example:

``` php
// Get the header as a string
$userAgent = $this->request->getHeaderLine('User-Agent');

// Get an array of all values.
$acceptHeader = $this->request->getHeader('Accept');

// Check if a header exists
$hasAcceptHeader = $this->request->hasHeader('Accept');

// Prior to 3.4.0
$userAgent = $this->request->header('User-Agent');
```

While some apache installs don't make the `Authorization` header accessible,
CakePHP will make it available through apache specific methods as required.

`method` Cake\\Http\\ServerRequest::**referer**($local = false)

Returns the referring address for the request.

`method` Cake\\Http\\ServerRequest::**clientIp**()

Returns the current visitor's IP address.

### Trusting Proxy Headers

If your application is behind a load balancer or running on a cloud service, you
will often get the load balancer host, port and scheme in your requests. Often
load balancers will also send `HTTP-X-Forwarded-*` headers with the original
values. The forwarded headers will not be used by CakePHP out of the box. To
have the request object use these headers set the `trustProxy` property to
`true`:

``` php
$this->request->trustProxy = true;

// These methods will now use the proxied headers.
$port = $this->request->port();
$host = $this->request->host();
$scheme = $this->request->scheme();
$clientIp = $this->request->clientIp();
```

Once proxies are trusted the `clientIp()` method will use the *last* IP
address in the `X-Forwarded-For` header. If your application is behind
multiple proxies, you can use `setTrustedProxies()` to define the IP addresses
of proxies in your control:

``` php
$request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);
```

After proxies are trusted `clientIp()` will use the first IP address in the
`X-Forwarded-For` header providing it is the only value that isn't from a trusted
proxy.

<div class="versionadded">

3.7.0
`setTrustedProxies()` was added.

</div>

### Checking Accept Headers

`method` Cake\\Http\\ServerRequest::**accepts**($type = null)

Find out which content types the client accepts, or check whether it accepts a
particular type of content.

Get all types:

``` php
$accepts = $this->request->accepts();
```

Check for a single type:

``` php
$acceptsJson = $this->request->accepts('application/json');
```

`method` Cake\\Http\\ServerRequest::**acceptLanguage**($language = null)

Get all the languages accepted by the client,
or check whether a specific language is accepted.

Get the list of accepted languages:

``` php
$acceptsLanguages = $this->request->acceptLanguage();
```

Check whether a specific language is accepted:

``` php
$acceptsSpanish = $this->request->acceptLanguage('es-es');
```

<a id="request-cookies"></a>

### Cookies

Request cookies can be read through a number of methods:

``` php
// Get the cookie value, or null if the cookie is missing.
$rememberMe = $this->request->getCookie('remember_me');

// Read the value, or get the default of 0
$rememberMe = $this->request->getCookie('remember_me', 0);

// Get all cookies as an hash
$cookies = $this->request->getCookieParams();

// Get a CookieCollection instance (starting with 3.5.0)
$cookies = $this->request->getCookieCollection()
```

See the `Cake\Http\Cookie\CookieCollection` documentation for how
to work with cookie collection.

<div class="versionadded">

3.5.0
`ServerRequest::getCookieCollection()` was added in 3.5.0

</div>

<div class="index">

\$this-\>response

</div>

## Response

`class` Cake\\Http\\**Response**

`Cake\Http\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like `Cake\Http\ServerRequest`, `Cake\Http\Response`
consolidates a number of methods previously found on `Controller`,
`RequestHandlerComponent` and `Dispatcher`. The old
methods are deprecated in favour of using `Cake\Http\Response`.

`Response` provides an interface to wrap the common response-related
tasks such as:

- Sending headers for redirects.
- Sending content type headers.
- Sending any header.
- Sending the response body.

### Dealing with Content Types

`method` Cake\\Http\\Response::**withType**($contentType = null)

You can control the Content-Type of your application's responses with
`Cake\Http\Response::withType()`. If your application needs to deal
with content types that are not built into Response, you can map them with
`type()` as well:

``` php
// Add a vCard type
$this->response->type(['vcf' => 'text/v-card']);

// Set the response Content-Type to vcard.
$this->response = $this->response->withType('vcf');

// Prior to 3.4.0
$this->response->type('vcf');
```

Usually, you'll want to map additional content types in your controller's
`~Controller::beforeFilter()` callback, so you can leverage the
automatic view switching features of `RequestHandlerComponent` if you
are using it.

<a id="cake-response-file"></a>

### Sending Files

`method` Cake\\Http\\Response::**withFile**($path, $options = [])

There are times when you want to send files as responses for your requests.
You can accomplish that by using `Cake\Http\Response::withFile()`:

``` php
public function sendFile($id)
{
    $file = $this->Attachments->getFile($id);
    $response = $this->response->withFile($file['path']);
    // Return the response to prevent controller from trying to render
    // a view.
    return $response;
}

// Prior to 3.4.0
$file = $this->Attachments->getFile($id);
$this->response->file($file['path']);
// Return the response to prevent controller from trying to render
// a view.
return $this->response;
```

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed
in <span class="title-ref">CakeHttpResponse::\$\_mimeTypes</span>. You can add new types prior to calling
`Cake\Http\Response::withFile()` by using the
`Cake\Http\Response::withType()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options:

``` php
$response = $this->response->withFile(
    $file['path'],
    ['download' => true, 'name' => 'foo']
);

// Prior to 3.4.0
$this->response->file(
    $file['path'],
    ['download' => true, 'name' => 'foo']
);
```

The supported options are:

name  
The name allows you to specify an alternate file name to be sent to
the user.

download  
A boolean value indicating whether headers should be set to force
download.

### Sending a String as File

You can respond with a file that does not exist on the disk, such as a pdf or an
ics generated on the fly from a string:

``` php
public function sendIcs()
{
    $icsString = $this->Calendars->generateIcs();
    $response = $this->response;

    // Inject string content into response body (3.4.0+)
    $response = $response->withStringBody($icsString);

    // Inject string content into response body (before 3.4.0)
    $response->body($icsString);

    $response = $response->withType('ics');

    // Optionally force file download
    $response = $response->withDownload('filename_for_download.ics');

    // Return response object to prevent controller from trying to render
    // a view.
    return $response;
}
```

Callbacks can also return the body as a string:

``` php
$path = '/some/file.png';
$this->response->body(function () use ($path) {
    return file_get_contents($path);
});
```

### Setting Headers

`method` Cake\\Http\\Response::**withHeader**($header, $value)

Setting headers is done with the `Cake\Http\Response::withHeader()`
method. Like all of the PSR-7 interface methods, this method returns a *new*
instance with the new header:

``` php
// Add/replace a header
$response = $response->withHeader('X-Extra', 'My header');

// Set multiple headers
$response = $response->withHeader('X-Extra', 'My header')
    ->withHeader('Location', 'http://example.com');

// Append a value to an existing header
$response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

// Prior to 3.4.0 - Set a header
$this->response->header('Location', 'http://example.com');
```

Headers are not sent when set. Instead, they are held until the response is
emitted by `Cake\Http\Server`.

You can now use the convenience method
`Cake\Http\Response::withLocation()` to directly set or get the
redirect location header.

### Setting the Body

`method` Cake\\Http\\Response::**withStringBody**($string)

To set a string as the response body, do the following:

``` php
// Set a string into the body
$response = $response->withStringBody('My Body');

// If you want a json response
$response = $response->withType('application/json')
    ->withStringBody(json_encode(['Foo' => 'bar']));
```

<div class="versionadded">

3.4.3
`withStringBody()` was added in 3.4.3

</div>

`method` Cake\\Http\\Response::**withBody**($body)

To set the response body, use the `withBody()` method, which is provided by the
`Zend\Diactoros\MessageTrait`:

``` php
$response = $response->withBody($stream);

// Prior to 3.4.0 - Set the body
$this->response->body('My Body');
```

Be sure that `$stream` is a `Psr\Http\Message\StreamInterface` object.
See below on how to create a new stream.

You can also stream responses from files using `Zend\Diactoros\Stream` streams:

``` php
// To stream from a file
use Zend\Diactoros\Stream;

$stream = new Stream('/path/to/file', 'rb');
$response = $response->withBody($stream);
```

You can also stream responses from a callback using the `CallbackStream`. This
is useful when you have resources like images, CSV files or PDFs you need to
stream to the client:

``` php
// Streaming from a callback
use Cake\Http\CallbackStream;

// Create an image.
$img = imagecreate(100, 100);
// ...

$stream = new CallbackStream(function () use ($img) {
    imagepng($img);
});
$response = $response->withBody($stream);

// Prior to 3.4.0 you can use the following to create streaming responses.
$file = fopen('/some/file.png', 'r');
$this->response->body(function () use ($file) {
    rewind($file);
    fpassthru($file);
    fclose($file);
});
```

### Setting the Character Set

`method` Cake\\Http\\Response::**withCharset**($charset)

Sets the charset that will be used in the response:

``` php
$this->response = $this->response->withCharset('UTF-8');

// Prior to 3.4.0
$this->response->charset('UTF-8');
```

### Interacting with Browser Caching

`method` Cake\\Http\\Response::**withDisabledCache**()

You sometimes need to force browsers not to cache the results of a controller
action. `Cake\Http\Response::withDisabledCache()` is intended for just
that:

``` php
public function index()
{
    // Disable caching
    $this->response = $this->response->withDisabledCache();

    // Prior to 3.4.0
    $this->response->disableCache();
}
```

> [!WARNING]
> Disabling caching from SSL domains while trying to send
> files to Internet Explorer can result in errors.

`method` Cake\\Http\\Response::**withCache**($since, $time = '+1 day')

You can also tell clients that you want them to cache responses. By using
`Cake\Http\Response::withCache()`:

``` php
public function index()
{
    // Enable caching
    $this->response = $this->response->withCache('-1 minute', '+5 days');
}
```

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience.
The `withCache()` method sets the `Last-Modified` value to the first
argument. `Expires` header and the `max-age` directive are set based on the
second parameter. Cache-Control's `public` directive is set as well.

<a id="cake-response-caching"></a>

### Fine Tuning HTTP Cache

One of the best and easiest ways of speeding up your application is to use HTTP
cache. Under this caching model, you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time and response entity tag.

Rather than forcing you to code the logic for caching and for invalidating
(refreshing) it once the data has changed, HTTP uses two models, expiration and
validation, which usually are much simpler to use.

Apart from using `Cake\Http\Response::withCache()`, you can also use
many other methods to fine-tune HTTP cache headers to take advantage of browser
or reverse proxy caching.

#### The Cache Control Header

`method` Cake\\Http\\Response::**withSharable**($public, $time = null)

Used under the expiration model, this header contains multiple indicators that
can change the way browsers or proxies use the cached content. A
`Cache-Control` header can look like this:

    Cache-Control: private, max-age=3600, must-revalidate

`Response` class helps you set this header with some utility methods that will
produce a final valid `Cache-Control` header. The first is the
`withSharable()` method, which indicates whether a response is to be
considered sharable across different users or clients. This method actually
controls the `public` or `private` part of this header. Setting a response
as private indicates that all or part of it is intended for a single user. To
take advantage of shared caches, the control directive must be set as public.

The second parameter of this method is used to specify a `max-age` for the
cache, which is the number of seconds after which the response is no longer
considered fresh:

``` php
public function view()
{
    // ...
    // Set the Cache-Control as public for 3600 seconds
    $this->response = $this->response->withSharable(true, 3600);
}

public function my_data()
{
    // ...
    // Set the Cache-Control as private for 3600 seconds
    $this->response = $this->response->withSharable(false, 3600);
}
```

`Response` exposes separate methods for setting each of the directives in
the `Cache-Control` header.

#### The Expiration Header

`method` Cake\\Http\\Response::**withExpires**($time)

You can set the `Expires` header to a date and time after which the response
is no longer considered fresh. This header can be set using the
`withExpires()` method:

``` php
public function view()
{
    $this->response = $this->response->withExpires('+5 days');
}
```

This method also accepts a `DateTime` instance or any string that can
be parsed by the `DateTime` class.

#### The Etag Header

`method` Cake\\Http\\Response::**withEtag**($tag, $weak = false)

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The `withEtag()` method (called entity tag) is a string
that uniquely identifies the requested resource, as a checksum does for a file,
in order to determine whether it matches a cached resource.

To take advantage of this header, you must either call the
`checkNotModified()` method manually or include the
[Request Handling](../controllers/components/request-handling) in your controller:

``` php
public function index()
{
    $articles = $this->Articles->find('all');

    // Simple checksum of the article contents.
    // You should use a more efficient implementation
    // in a real world application.
    $checksum = md5(json_encode($articles));

    $response = $this->response->withEtag($checksum);
    if ($response->checkNotModified($this->request)) {
        return $response;
    }

    $this->response = $response;
    // ...
}
```

> [!NOTE]
> Most proxy users should probably consider using the Last Modified Header
> instead of Etags for performance and compatibility reasons.

#### The Last Modified Header

`method` Cake\\Http\\Response::**withModified**($time)

Also, under the HTTP cache validation model, you can set the `Last-Modified`
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether the
response was modified or not based on their cache.

To take advantage of this header, you must either call the
`checkNotModified()` method manually or include the
[Request Handling](../controllers/components/request-handling) in your controller:

``` php
public function view()
{
    $article = $this->Articles->find()->first();
    $response = $this->response->withModified($article->modified);
    if ($response->checkNotModified($this->request)) {
        return $response;
    }
    $this->response;
    // ...
}
```

#### The Vary Header

`method` Cake\\Http\\Response::**withVary**($header)

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the `Vary`
header:

``` php
$response = $this->response->withVary('User-Agent');
$response = $this->response->withVary('Accept-Encoding', 'User-Agent');
$response = $this->response->withVary('Accept-Language');
```

#### Sending Not-Modified Responses

`method` Cake\\Http\\Response::**checkNotModified**(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the <span class="title-ref">304 Not Modified</span> header:

``` php
// In a controller action.
if ($this->response->checkNotModified($this->request)) {
    return $this->response;
}
```

<a id="response-cookies"></a>

## Setting Cookies

Cookies can be added to response using either an array or a `Cake\Http\Cookie\Cookie`
object:

``` php
use Cake\Http\Cookie\Cookie;
use DateTime;

// Add a cookie as an array using the immutable API (3.4.0+)
$this->response = $this->response->withCookie(new Cookie(
    'remember_me',
    'yes',
    new DateTime('+1 year'), // expiration time
    '/', // path
    '', // domain
    false, // secure
    true // httponly
));

// Before 3.4.0
$this->response->cookie('remember', [
    'value' => 'yes',
    'path' => '/',
    'httpOnly' => true,
    'secure' => false,
    'expire' => strtotime('+1 year')
]);
```

See the [Creating Cookies](../controllers/pages-controller#creating-cookies) section for how to use the cookie object. You
can use `withExpiredCookie()` to send an expired cookie in the response. This
will make the browser remove its local cookie:

``` php
// As of 3.5.0
$this->response = $this->response->withExpiredCookie('remember_me');
```

<a id="cors-headers"></a>

## Setting Cross Origin Request Headers (CORS)

As of 3.2 you can use the `cors()` method to define [HTTP Access Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
related headers with a fluent interface:

``` php
$this->response = $this->response->cors($this->request)
    ->allowOrigin(['*.cakephp.org'])
    ->allowMethods(['GET', 'POST'])
    ->allowHeaders(['X-CSRF-Token'])
    ->allowCredentials()
    ->exposeHeaders(['Link'])
    ->maxAge(300)
    ->build();
```

CORS related headers will only be applied to the response if the following
criteria are met:

1.  The request has an `Origin` header.
2.  The request's `Origin` value matches one of the allowed Origin values.

<div class="versionadded">

3.2
The `CorsBuilder` was added in 3.2

</div>

## Common Mistakes with Immutable Responses

As of CakePHP 3.4.0, response objects offer a number of methods that treat
responses as immutable objects. Immutable objects help prevent difficult to
track accidental side-effects, and reduce mistakes caused by method calls caused
by refactoring that change ordering. While they offer a number of benefits,
immutable objects can take some getting used to. Any method that starts with
`with` operates on the response in an immutable fashion, and will **always**
return a **new** instance. Forgetting to retain the modified instance is the most
frequent mistake people make when working with immutable objects:

``` php
$this->response->withHeader('X-CakePHP', 'yes!');
```

In the above code, the response will be lacking the `X-CakePHP` header, as the
return value of the `withHeader()` method was not retained. To correct the
above code you would write:

``` php
$this->response = $this->response->withHeader('X-CakePHP', 'yes!');
```

## Cookie Collections

`class` Cake\\Http\\Cookie\\**CookieCollection**

`CookieCollection` objects are accessible from the request and response objects.
They let you interact with groups of cookies using immutable patterns, which
allow the immutability of the request and response to be preserved.

<a id="creating-cookies"></a>

### Creating Cookies

`class` Cake\\Http\\Cookie\\**Cookie**

`Cookie` objects can be defined through constructor objects, or by using the
fluent interface that follows immutable patterns:

``` php
use Cake\Http\Cookie\Cookie;

// All arguments in the constructor
$cookie = new Cookie(
    'remember_me', // name
    1, // value
    new DateTime('+1 year'), // expiration time, if applicable
    '/', // path, if applicable
    'example.com', // domain, if applicable
    false, // secure only?
    true // http only ?
);

// Using the builder methods
$cookie = (new Cookie('remember_me'))
    ->withValue('1')
    ->withExpiry(new DateTime('+1 year'))
    ->withPath('/')
    ->withDomain('example.com')
    ->withSecure(false)
    ->withHttpOnly(true);
```

Once you have created a cookie, you can add it to a new or existing
`CookieCollection`:

``` php
use Cake\Http\Cookie\CookieCollection;

// Create a new collection
$cookies = new CookieCollection([$cookie]);

// Add to an existing collection
$cookies = $cookies->add($cookie);

// Remove a cookie by name
$cookies = $cookies->remove('remember_me');
```

> [!NOTE]
> Remember that collections are immutable and adding cookies into, or removing
> cookies from a collection, creates a *new* collection object.

Cookie objects can be added to responses:

``` php
// Add one cookie
$response = $this->response->withCookie($cookie);

// Replace the entire cookie collection
$response = $this->response->withCookieCollection($cookies);
```

Cookies set to responses can be encrypted using the
[Encrypted Cookie Middleware](../controllers/middleware#encrypted-cookie-middleware).

<div class="versionadded">

3.8.0
`Response::withCookieCollection()` was added.

</div>

### Reading Cookies

Once you have a `CookieCollection` instance, you can access the cookies it
contains:

``` php
// Check if a cookie exists
$cookies->has('remember_me');

// Get the number of cookies in the collection
count($cookies);

// Get a cookie instance
$cookie = $cookies->get('remember_me');
```

Once you have a `Cookie` object you can interact with it's state and modify
it. Keep in mind that cookies are immutable, so you'll need to update the
collection if you modify a cookie:

``` php
// Get the value
$value = $cookie->getValue()

// Access data inside a JSON value
$id = $cookie->read('User.id');

// Check state
$cookie->isHttpOnly();
$cookie->isSecure();
```

<div class="versionadded">

3.5.0
`CookieCollection` and `Cookie` were added in 3.5.0.

</div>
