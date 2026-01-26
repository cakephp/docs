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
reference.

::: info Changed in version 4.4.0
The `ServerRequest` is available via DI. So you can get it from container or use it as a dependency for your service.
:::

Some of the duties `ServerRequest` performs include:

- Processing the GET, POST, and FILES arrays into the data structures you are
  familiar with.
- Providing environment introspection pertaining to the request. Information
  like the headers sent, the client's IP address, and the subdomain/domain
  names the server your application is running on.
- Providing access to request parameters both as array indexes and object
  properties.

CakePHP's request object implements the [PSR-7
ServerRequestInterface](https://www.php-fig.org/psr/psr-7/) making it easier to
use libraries from outside of CakePHP.

<a id="request-parameters"></a>

### Request Parameters

The request exposes routing parameters through the `getParam()` method:

``` php
$controllerName = $this->request->getParam('controller');
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

`method` Cake\\Http\\ServerRequest::**getQuery**($name, $default = null)

Query string parameters can be read using the `getQuery()` method:

``` php
// URL is /posts/index?page=1&sort=title
$page = $this->request->getQuery('page');
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

You can use the casting utility functions to provide typesafe access to request
data and other input:

``` php
use function Cake\Core\toBool;
use function Cake\Core\toInt;
use function Cake\Core\toString;
use function Cake\I18n\toDate;
use function Cake\I18n\toDateTime;

// $active is bool|null.
$active = toBool($this->request->getQuery('active'));

// $page is int|null.
$page = toInt($this->request->getQuery('page'));

// $query is string|null.
$query = toString($this->request->getQuery('query'));

// Parse a date based on the format or null
$date = toDate($this->request->getQuery('date'), 'Y-m-d');

// Parse a datetime based on a format or null
$date = toDateTime($this->request->getQuery('datetime'), 'Y-m-d H:i:s');
```

::: info Added in version 5.1.0
Casting functions were added.
:::

### Request Body Data

`method` Cake\\Http\\ServerRequest::**getData**($name, $default = null)

All POST data normally available through PHP's `$_POST` global variable can be
accessed using `Cake\Http\ServerRequest::getData()`. For example:

``` php
// An input with a name attribute equal to 'title' is accessible at
$title = $this->request->getData('title');
```

You can use a dot separated names to access nested data. For example:

``` php
$value = $this->request->getData('address.street_name');
```

For non-existent names the `$default` value will be returned:

``` php
$foo = $this->request->getData('value.that.does.not.exist');
// $foo == null
```

You can also use [Body Parser Middleware](../controllers/middleware#body-parser-middleware) to parse request body of different
content types into an array, so that it's accessible through `ServerRequest::getData()`.

If you want to access all the data parameters you can use
`getParsedBody()`:

``` php
$data = $this->request->getParsedBody();
```

<a id="request-file-uploads"></a>

### File Uploads

Uploaded files can be accessed through the request body data, using the `Cake\Http\ServerRequest::getData()`
method described above. For example, a file from an input element with a name attribute of `attachment`, can
be accessed like this:

``` php
$attachment = $this->request->getData('attachment');
```

By default file uploads are represented in the request data as objects that implement
[\Psr\Http\Message\UploadedFileInterface](https://www.php-fig.org/psr/psr-7/#16-uploaded-files). In the current
implementation, the `$attachment` variable in the above example would by default hold an instance of
`\Laminas\Diactoros\UploadedFile`.

Accessing the uploaded file details is fairly simple, here's how you can obtain the same data as provided by the old
style file upload array:

``` php
$name = $attachment->getClientFilename();
$type = $attachment->getClientMediaType();
$size = $attachment->getSize();
$tmpName = $attachment->getStream()->getMetadata('uri');
$error = $attachment->getError();
```

Moving the uploaded file from its temporary location to the desired target
location, doesn't require manually accessing the temporary file, instead it can
be easily done by using the objects `moveTo()` method:

``` php
$attachment->moveTo($targetPath);
```

In an HTTP environment, the `moveTo()` method will automatically validate
whether the file is an actual uploaded file, and throw an exception in case
necessary. In an CLI environment, where the concept of uploading files doesn't
exist, it will allow to move the file that you've referenced irrespective of its
origins, which makes testing file uploads possible.

`method` Cake\\Http\\ServerRequest::**getUploadedFile**($path)

Returns the uploaded file at a specific path. The path uses the same dot syntax as the
`Cake\Http\ServerRequest::getData()` method:

``` php
$attachment = $this->request->getUploadedFile('attachment');
```

Unlike `Cake\Http\ServerRequest::getData()`, `Cake\Http\ServerRequest::getUploadedFile()` would
only return data when an actual file upload exists for the given path, if there is regular, non-file request body data
present at the given path, then this method will return `null`, just like it would for any non-existent path.

`method` Cake\\Http\\ServerRequest::**getUploadedFiles**()

Returns all uploaded files in a normalized array structure. For the above example with the file input name of
`attachment`, the structure would look like:

``` php
[
      'attachment' => object(Laminas\Diactoros\UploadedFile) {
          // ...
      }
]
```

`method` Cake\\Http\\ServerRequest::**withUploadedFiles**(array $files)

This method sets the uploaded files of the request object, it accepts an array of objects that implement
[\Psr\Http\Message\UploadedFileInterface](https://www.php-fig.org/psr/psr-7/#16-uploaded-files). It will
replace all possibly existing uploaded files:

``` php
$files = [
    'MyModel' => [
        'attachment' => new \Laminas\Diactoros\UploadedFile(
            $streamOrFile,
            $size,
            $errorStatus,
            $clientFilename,
            $clientMediaType
        ),
        'anotherAttachment' => new \Laminas\Diactoros\UploadedFile(
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

`method` Cake\\Http\\ServerRequest::**getBody**()

When building REST services, you often accept request data on `PUT` and
`DELETE` requests. Any `application/x-www-form-urlencoded` request body data
will automatically be parsed and available via `$request->getData()` for `PUT` and
`DELETE` requests. If you are accepting JSON or XML data, you can
access the raw data with `getBody()`:

``` php
// Get the stream wrapper on the request body
$body = $request->getBody();

// Get the request body as a string
$bodyString = (string)$request->getBody();
```

If your requests contain XML or JSON request content, you should consider using
[Body Parser Middleware](../controllers/middleware#body-parser-middleware) to have CakePHP automatically parse those content
types making the parsed data available in `$request->getData()` and
`$request->getParsedBody()`.

### Environment Variables (from \$\_SERVER and \$\_ENV)

`method` Cake\\Http\\ServerRequest::**getEnv**($key, $default = null)

`ServerRequest::getEnv()` is a wrapper for `getenv()` global function and acts as
a getter for environment variables without possible undefined keys:

``` php
$host = $this->request->getEnv('HTTP_HOST');
```

To access all the environment variables in a request use `getServerParams()`:

``` php
$env = $this->request->getServerParams();
```

`method` Cake\\Http\\ServerRequest::**withEnv**($key, $value)

`ServerRequest::withEnv()` is a wrapper for `putenv()` global function and acts as
a setter for environment variables without having to modify globals
`$_SERVER` and `$_ENV`:

``` php
// Set a value, generally helpful in testing.
$this->request->withEnv('REQUEST_METHOD', 'POST');
```

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
```

<a id="check-the-request"></a>

### Checking Request Conditions

`method` Cake\\Http\\ServerRequest::**is**($type, $args...)

The request object provides a way to inspect certain conditions in a given
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

// Add a detector that uses additional arguments.
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
- `is('json')` Check to see whether the request URL has 'json' extension or the
  <span class="title-ref">Accept</span> header is set to 'application/json'.
- `is('xml')` Check to see whether the request URL has 'xml' extension or the <span class="title-ref">Accept</span> header is set to
  'application/xml' or 'text/xml'.

`ServerRequest` also includes methods like
`Cake\Http\ServerRequest::domain()`,
`Cake\Http\ServerRequest::subdomains()` and
`Cake\Http\ServerRequest::host()` to make applications that use
subdomains simpler.

### Session Data

To access the session for a given request use the `getSession()` method or use the `session` attribute:

``` php
$session = $this->request->getSession();
$session = $this->request->getAttribute('session');

$data = $session->read('sessionKey');
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
```

While some apache installs don't make the `Authorization` header accessible,
CakePHP will make it available through apache specific methods as required.

`method` Cake\\Http\\ServerRequest::**referer**($local = true)

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

### Reading Cookies

Request cookies can be read through a number of methods:

``` php
// Get the cookie value, or null if the cookie is missing.
$rememberMe = $this->request->getCookie('remember_me');

// Read the value, or get the default of 0
$rememberMe = $this->request->getCookie('remember_me', 0);

// Get all cookies as an hash
$cookies = $this->request->getCookieParams();

// Get a CookieCollection instance
$cookies = $this->request->getCookieCollection()
```

See the `Cake\Http\Cookie\CookieCollection` documentation for how
to work with cookie collection.

### Uploaded Files

Requests expose the uploaded file data in `getData()` or
`getUploadedFiles()` as `UploadedFileInterface` objects:

``` php
// Get a list of UploadedFile objects
$files = $request->getUploadedFiles();

// Read the file data.
$files[0]->getStream();
$files[0]->getSize();
$files[0]->getClientFileName();

// Move the file.
$files[0]->moveTo($targetPath);
```

### Manipulating URIs

Requests contain a URI object, which contains methods for interacting with the
requested URI:

``` php
// Get the URI
$uri = $request->getUri();

// Read data out of the URI.
$path = $uri->getPath();
$query = $uri->getQuery();
$host = $uri->getHost();
```

<div class="index">

\$this-\>response

</div>

## Response

`class` Cake\\Http\\**Response**

`Cake\Http\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.

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
`setTypeMap()` as well:

``` php
// Add a vCard type
$this->response->setTypeMap('vcf', ['text/v-card']);

// Set the response Content-Type to vcard.
$this->response = $this->response->withType('vcf');
```

Usually, you'll want to map additional content types in your controller's
`~Controller::beforeFilter()` callback, so you can benefit from
automatic view switching provided by [Controller Viewclasses](../controllers#controller-viewclasses).

<a id="cake-response-file"></a>

### Sending Files

`method` Cake\\Http\\Response::**withFile**(string $path, array $options = [])

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

    // Inject string content into response body
    $response = $response->withStringBody($icsString);

    $response = $response->withType('ics');

    // Optionally force file download
    $response = $response->withDownload('filename_for_download.ics');

    // Return response object to prevent controller from trying to render
    // a view.
    return $response;
}
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

`method` Cake\\Http\\Response::**withBody**($body)

To set the response body, use the `withBody()` method, which is provided by the
`Laminas\Diactoros\MessageTrait`:

``` php
$response = $response->withBody($stream);
```

Be sure that `$stream` is a `Psr\Http\Message\StreamInterface` object.
See below on how to create a new stream.

You can also stream responses from files using `Laminas\Diactoros\Stream` streams:

``` php
// To stream from a file
use Laminas\Diactoros\Stream;

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
```

### Setting the Character Set

`method` Cake\\Http\\Response::**withCharset**($charset)

Sets the charset that will be used in the response:

``` php
$this->response = $this->response->withCharset('UTF-8');
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
`isNotModified()` method manually or include the
[Checking HTTP Cache](../controllers/components/check-http-cache) in your controller:

``` php
public function index()
{
    $articles = $this->Articles->find('all')->all();

    // Simple checksum of the article contents.
    // You should use a more efficient implementation
    // in a real world application.
    $checksum = md5(json_encode($articles));

    $response = $this->response->withEtag($checksum);
    if ($response->isNotModified($this->request)) {
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
`isNotModified()` method manually or include the
[Checking HTTP Cache](../controllers/components/check-http-cache) in your controller:

``` php
public function view()
{
    $article = $this->Articles->find()->first();
    $response = $this->response->withModified($article->modified);
    if ($response->isNotModified($this->request)) {
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

`method` Cake\\Http\\Response::**isNotModified**(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the <span class="title-ref">304 Not Modified</span> header:

``` php
// In a controller action.
if ($this->response->isNotModified($this->request)) {
    return $this->response;
}
```

<a id="response-cookies"></a>

### Setting Cookies

Cookies can be added to response using either an array or a `Cake\Http\Cookie\Cookie`
object:

``` php
use Cake\Http\Cookie\Cookie;
use DateTime;

// Add a cookie
$this->response = $this->response->withCookie(Cookie::create(
    'remember_me',
    'yes',
    // All keys are optional
    [
        'expires' => new DateTime('+1 year'),
        'path' => '',
        'domain' => '',
        'secure' => false,
        'httponly' => false,
        'samesite' => null // Or one of CookieInterface::SAMESITE_* constants
    ]
));
```

See the [Creating Cookies](#creating-cookies) section for how to use the cookie object. You
can use `withExpiredCookie()` to send an expired cookie in the response. This
will make the browser remove its local cookie:

``` php
$this->response = $this->response->withExpiredCookie(new Cookie('remember_me'));
```

<a id="cors-headers"></a>

### Setting Cross Origin Request Headers (CORS)

The `cors()` method returns a `CorsBuilder` instance which provides a fluent
interface for defining [HTTP Access Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
related headers:

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

#### CorsBuilder Methods

`class` Cake\\Http\\**CorsBuilder**

The `CorsBuilder` provides the following methods for configuring CORS:

`method` Cake\\Http\\CorsBuilder::**allowOrigin**(array|string $domains)

`method` Cake\\Http\\CorsBuilder::**allowMethods**(array $methods)

`method` Cake\\Http\\CorsBuilder::**allowHeaders**(array $headers)

`method` Cake\\Http\\CorsBuilder::**allowCredentials**()

`method` Cake\\Http\\CorsBuilder::**exposeHeaders**(array $headers)

`method` Cake\\Http\\CorsBuilder::**maxAge**(string|int $age)

`method` Cake\\Http\\CorsBuilder::**build**()

#### Practical CORS Examples

Here are some common CORS configurations:

**API accepting requests from a SPA frontend**:

``` php
// In your controller
public function beforeFilter(EventInterface $event)
{
    parent::beforeFilter($event);

    if ($this->request->is('options')) {
        // Handle preflight requests
        $this->response = $this->response->cors($this->request)
            ->allowOrigin(['https://app.example.com'])
            ->allowMethods(['GET', 'POST', 'PUT', 'DELETE'])
            ->allowHeaders(['Content-Type', 'Authorization'])
            ->allowCredentials()
            ->maxAge(86400)
            ->build();

        $event->setResult($this->response);
    }
}

public function index()
{
    // Apply CORS to regular requests
    $this->response = $this->response->cors($this->request)
        ->allowOrigin(['https://app.example.com'])
        ->allowCredentials()
        ->build();

    // Your regular controller logic...
}
```

**Public API with relaxed CORS**:

``` php
$this->response = $this->response->cors($this->request)
    ->allowOrigin('*')
    ->allowMethods(['GET'])
    ->exposeHeaders(['X-Total-Count', 'X-Page'])
    ->maxAge(3600)
    ->build();
```

#### Creating CORS Middleware

For consistent CORS handling across your application, create a middleware:

``` php
// src/Middleware/CorsMiddleware.php
namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CorsMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Handle preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            $response = new \Cake\Http\Response();
            $response = $response->cors($request)
                ->allowOrigin(['*.myapp.com'])
                ->allowMethods(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
                ->allowHeaders(['Content-Type', 'Authorization'])
                ->allowCredentials()
                ->maxAge(3600)
                ->build();

            return $response;
        }

        $response = $handler->handle($request);

        // Add CORS headers to regular requests
        return $response->cors($request)
            ->allowOrigin(['*.myapp.com'])
            ->allowCredentials()
            ->build();
    }
}
```

Then add it to your application middleware stack in `src/Application.php`:

``` php
public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
{
    $middlewareQueue
        // Add CORS middleware early in the stack
        ->add(new \App\Middleware\CorsMiddleware())
        // ... other middleware
        ->add(new ErrorHandlerMiddleware(Configure::read('Error')))
        ->add(new AssetMiddleware([
            'cacheTime' => Configure::read('Asset.cacheTime'),
        ]))
        ->add(new RoutingMiddleware($this));

    return $middlewareQueue;
}
```

### Running logic after the Response has been sent

In fastcgi based environments you can listen to the `Server.terminate` event
to run logic **after** the response has been sent to the client. The
`terminate` event will be passed a `request` and `response`. The
`request` is fetched from the applications' DI container, or from
`Router::getRequest()` if the DI container does not have a request registered.

> [!WARNING]
> In non fastcgi environments the `Server.terminate` event is fired before
> the response is sent.

::: info Added in version 5.1.0
:::

## Common Mistakes with Immutable Responses

Response objects offer a number of methods that treat
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

<a id="request-cookies"></a>

### Reading Cookies

Once you have a `CookieCollection` instance, you can access the cookies it
contains:

``` php
// Check if a cookie exists
$cookies->has('remember_me');

// Get the number of cookies in the collection
count($cookies);

// Get a cookie instance. Will throw an error if the cookie is not found
$cookie = $cookies->get('remember_me');

// Get a cookie or null
$cookie = $cookies->remember_me;

// Check if a cookie exists
$exists = isset($cookies->remember_me)
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
