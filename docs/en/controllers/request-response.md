# Request and Response objects

New in CakePHP 2.0 are request and response objects. In previous versions, these
objects were represented through arrays, and the related methods were spread
across `RequestHandlerComponent`, `Router`,
`Dispatcher` and `Controller`. There was no authoritative
object on what information the request contained. For 2.0,
`CakeRequest` and `CakeResponse` are used for this
purpose.

<div class="index">

\$this-\>request

</div>

<a id="cake-request"></a>

# CakeRequest

`CakeRequest` is the default request object used in CakePHP. It centralizes
a number of features for interrogating and interacting with request data.
On each request, one `CakeRequest` is created and then passed by reference to the various
layers of an application that use request data. By default, `CakeRequest` is assigned to
`$this->request`, and is available in Controllers, Views and Helpers. You can
also access it in Components by using the controller reference. Some of the duties
`CakeRequest` performs include:

- Process the GET, POST, and FILES arrays into the data structures you are
  familiar with.
- Provide environment introspection pertaining to the request. Things like the
  headers sent, the client's IP address, and the subdomain/domain information
  about the application the server is running on.
- Provide access to request parameters both as array indexes and object
  properties.

## Accessing request parameters

`CakeRequest` exposes several interfaces for accessing request parameters. The first uses object
properties, the second uses array indexes, and the third uses `$this->request->params`:

``` php
$this->request->controller;
$this->request['controller'];
$this->request->params['controller'];
```

All of the above will access the same value. Multiple ways of accessing the
parameters have been provided to ease migration for existing applications. All
[Route Elements](../development/routing#route-elements) are accessed through this interface.

In addition to [Route Elements](../development/routing#route-elements), you also often need access to
[Passed Arguments](../development/routing#passed-arguments) and [Named Parameters](../development/routing#named-parameters). These are both available
on the request object as well:

``` php
// Passed arguments
$this->request->pass;
$this->request['pass'];
$this->request->params['pass'];

// named parameters
$this->request->named;
$this->request['named'];
$this->request->params['named'];
```

All of these will provide you access to the passed arguments and named parameters. There
are several important/useful parameters that CakePHP uses internally. These
are also all found in the request parameters:

- `plugin` The plugin handling the request. Will be null when there is no plugin.
- `controller` The controller handling the current request.
- `action` The action handling the current request.
- `prefix` The prefix for the current action. See [Prefix Routing](../development/routing#prefix-routing) for
  more information.
- `bare` Present when the request came from `~Controller::requestAction()` and included the
  bare option. Bare requests do not have layouts rendered.
- `requested` Present and set to true when the action came from `~Controller::requestAction()`.

## Accessing Querystring parameters

Querystring parameters can be read using `CakeRequest::$query`:

``` php
// URL is /posts/index?page=1&sort=title
$this->request->query['page'];

// You can also access it via an array
// Note: BC accessor, will be deprecated in future versions
$this->request['url']['page'];
```

You can either directly access the `~CakeRequest::$query` property, or you can use
`CakeRequest::query()` to read the URL query array in an error-free manner.
Any keys that do not exist will return `null`:

``` php
$foo = $this->request->query('value_that_does_not_exist');
// $foo === null
```

## Accessing POST data

All POST data can be accessed using `CakeRequest::$data`. Any form data
that contains a `data` prefix will have that data prefix removed. For example:

``` php
// An input with a name attribute equal to 'data[MyModel][title]'
// is accessible at
$this->request->data['MyModel']['title'];
```

You can either directly access the `~CakeRequest::$data` property, or you can use
`CakeRequest::data()` to read the data array in an error-free manner.
Any keys that do not exist will return `null`:

``` php
$foo = $this->request->data('Value.that.does.not.exist');
// $foo == null
```

## Accessing PUT or POST data

::: info Added in version 2.2
:::

When building REST services, you often accept request data on `PUT` and
`DELETE` requests. As of 2.2, any `application/x-www-form-urlencoded`
request body data will automatically be parsed and set to `$this->data` for
`PUT` and `DELETE` requests. If you are accepting JSON or XML data, see
below for how you can access those request bodies.

## Accessing XML or JSON data

Applications employing [REST](../development/rest) often exchange data in non-URL-encoded
post bodies. You can read input data in any format using
`CakeRequest::input()`. By providing a decoding function, you can
receive the content in a deserialized format:

``` php
// Get JSON encoded data submitted to a PUT/POST action
$data = $this->request->input('json_decode');
```

Some deserializing methods require additional parameters when called,
such as the 'as array' parameter on `json_decode`. If you want XML converted
into a DOMDocument object, `CakeRequest::input()` supports passing
in additional parameters as well:

``` php
// Get Xml encoded data submitted to a PUT/POST action
$data = $this->request->input('Xml::build', array('return' => 'domdocument'));
```

## Accessing path information

`CakeRequest` also provides useful information about the paths in your
application. `CakeRequest::$base` and
`CakeRequest::$webroot` are useful for generating URLs, and
determining whether or not your application is in a subdirectory.

<a id="check-the-request"></a>

## Inspecting the request

Detecting various request conditions used to require using
`RequestHandlerComponent`. These methods have been moved to
`CakeRequest`, and offer a new interface alongside a more backwards-compatible
usage:

``` php
$this->request->is('post');
$this->request->isPost(); // deprecated
```

Both method calls will return the same value. For the time being, the methods
are still available on `RequestHandlerComponent`, but are deprecated and
will be removed in 3.0.0. You can also easily extend the request
detectors that are available by using `CakeRequest::addDetector()`
to create new kinds of detectors. There are four different types of detectors
that you can create:

- Environment value comparison - Compares a
  value fetched from `env()` for equality
  with the provided value.
- Pattern value comparison - Pattern value comparison allows you to compare a
  value fetched from `env()` to a regular expression.
- Option based comparison - Option based comparisons use a list of options to
  create a regular expression. Subsequent calls to add an already defined
  options detector will merge the options.
- Callback detectors - Callback detectors allow you to provide a 'callback' type
  to handle the check. The callback will receive the request object as its only
  parameter.

Some examples would be:

``` php
// Add an environment detector.
$this->request->addDetector(
    'post',
    array('env' => 'REQUEST_METHOD', 'value' => 'POST')
);

// Add a pattern value detector.
$this->request->addDetector(
    'iphone',
    array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i')
);

// Add an option detector.
$this->request->addDetector('internalIp', array(
    'env' => 'CLIENT_IP',
    'options' => array('192.168.0.101', '192.168.0.100')
));

// Add a callback detector. Can either be an anonymous function
// or a regular callable.
$this->request->addDetector(
    'awesome',
    array('callback' => function ($request) {
        return isset($request->awesome);
    })
);
```

`CakeRequest` also includes methods like `CakeRequest::domain()`,
`CakeRequest::subdomains()` and `CakeRequest::host()` to
help applications with subdomains.

There are several built-in detectors that you can use:

- `is('get')` Check to see whether the current request is a GET.
- `is('put')` Check to see whether the current request is a PUT.
- `is('post')` Check to see whether the current request is a POST.
- `is('delete')` Check to see whether the current request is a DELETE.
- `is('head')` Check to see whether the current request is HEAD.
- `is('options')` Check to see whether the current request is OPTIONS.
- `is('ajax')` Check to see whether the current request came with
  X-Requested-With = XMLHttpRequest.
- `is('ssl')` Check to see whether the request is via SSL
- `is('flash')` Check to see whether the request has a User-Agent of Flash
- `is('mobile')` Check to see whether the request came from a common list
  of mobile agents.

## CakeRequest and RequestHandlerComponent

Since many of the features `CakeRequest` offers used to be the realm of
`RequestHandlerComponent`, some rethinking was required to figure out how it
still fits into the picture. For 2.0, `RequestHandlerComponent`
provides a layer of sugar, such as switching layout
and views based on content, on top of the utility that
`CakeRequest` affords.
This separation of utility and sugar between the two classes lets you
more easily choose what you want.

## Interacting with other aspects of the request

You can use `CakeRequest` to introspect a variety of things about the request.
Beyond the detectors, you can also find out other information from various
properties and methods.

- `$this->request->webroot` contains the webroot directory.
- `$this->request->base` contains the base path.
- `$this->request->here` contains the full address to the current request.
- `$this->request->query` contains the query string parameters.

## CakeRequest API

`class` **CakeRequest**

`method` CakeRequest::**domain**($tldLength = 1)

`method` CakeRequest::**subdomains**($tldLength = 1)

`method` CakeRequest::**host**()

`method` CakeRequest::**method**()

`method` CakeRequest::**onlyAllow**($methods)

`method` CakeRequest::**allowMethod**($methods)

`method` CakeRequest::**referer**($local = false)

`method` CakeRequest::**clientIp**($safe = true)

`method` CakeRequest::**header**($name)

`method` CakeRequest::**input**($callback, [$options])

`method` CakeRequest::**data**($name)

`method` CakeRequest::**query**($name)

`method` CakeRequest::**is**($type)

`method` CakeRequest::**addDetector**($name, $options)

`method` CakeRequest::**accepts**($type = null)

`static` CakeRequest::**acceptLanguage**($language = null)

Get all the languages accepted by the client,
or check whether a specific language is accepted.

Get the list of accepted languages:

``` css
CakeRequest::acceptLanguage();
```

Check whether a specific language is accepted:

``` css
CakeRequest::acceptLanguage('es-es');
```

`method` CakeRequest::**param**($name)

<div class="index">

\$this-\>response

</div>

# CakeResponse

`CakeResponse` is the default response class in CakePHP. It
encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like `CakeRequest`, `CakeResponse` consolidates a number
of methods previously found on `Controller`,
`RequestHandlerComponent` and `Dispatcher`. The old
methods are deprecated in favour of using `CakeResponse`.

`CakeResponse` provides an interface to wrap the common response-related
tasks such as:

- Sending headers for redirects.
- Sending content type headers.
- Sending any header.
- Sending the response body.

## Changing the response class

CakePHP uses `CakeResponse` by default. `CakeResponse` is a flexible and
transparent class. If you need to override it with your own application-specific class,
you can replace `CakeResponse` in `app/webroot/index.php`.
This will make all the controllers in your application use `CustomResponse`
instead of `CakeResponse`. You can also replace the response
instance by setting `$this->response` in your controllers. Overriding the
response object is handy during testing, as it allows you to stub
out the methods that interact with `~CakeResponse::header()`. See the section on
[Cakeresponse Testing](#cakeresponse-testing) for more information.

## Dealing with content types

You can control the Content-Type of your application's responses with
`CakeResponse::type()`. If your application needs to deal with
content types that are not built into `CakeResponse`, you can map them
with `CakeResponse::type()` as well:

``` php
// Add a vCard type
$this->response->type(array('vcf' => 'text/v-card'));

// Set the response Content-Type to vcard.
$this->response->type('vcf');
```

Usually, you'll want to map additional content types in your controller's
`~Controller::beforeFilter()` callback, so you can leverage the automatic view switching
features of `RequestHandlerComponent` if you are using it.

<a id="cake-response-file"></a>

## Sending files

There are times when you want to send files as responses for your requests.
Prior to version 2.3, you could use `MediaView`.
As of 2.3, `MediaView` is deprecated and you can use `CakeResponse::file()`
to send a file as response:

``` php
public function sendFile($id) {
    $file = $this->Attachment->getFile($id);
    $this->response->file($file['path']);
    // Return response object to prevent controller from trying to render
    // a view
    return $this->response;
}
```

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed in
`CakeResponse::$_mimeTypes`. You can add new types prior to calling `CakeResponse::file()`
by using the `CakeResponse::type()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options:

``` php
$this->response->file(
    $file['path'],
    array('download' => true, 'name' => 'foo')
);
```

## Sending a string as file

You can respond with a file that does not exist on the disk, such as
a pdf or an ics generated on the fly from a string:

``` php
public function sendIcs() {
    $icsString = $this->Calendar->generateIcs();
    $this->response->body($icsString);
    $this->response->type('ics');

    //Optionally force file download
    $this->response->download('filename_for_download.ics');

    // Return response object to prevent controller from trying to render
    // a view
    return $this->response;
}
```

## Setting headers

Setting headers is done with the `CakeResponse::header()` method. It
can be called with a few different parameter configurations:

``` php
// Set a single header
$this->response->header('Location', 'http://example.com');

// Set multiple headers
$this->response->header(array(
    'Location' => 'http://example.com',
    'X-Extra' => 'My header'
));

$this->response->header(array(
    'WWW-Authenticate: Negotiate',
    'Content-type: application/pdf'
));
```

Setting the same `~CakeResponse::header()` multiple times will result in overwriting the previous
values, just as regular header calls do. Headers are not sent when
`CakeResponse::header()` is called; instead they are buffered
until the response is actually sent.

::: info Added in version 2.4
:::

You can now use the convenience method `CakeResponse::location()` to directly set or get
the redirect location header.

## Interacting with browser caching

You sometimes need to force browsers not to cache the results of a controller
action. `CakeResponse::disableCache()` is intended for just that:

``` php
public function index() {
    // do something.
    $this->response->disableCache();
}
```

> [!WARNING]
> Using disableCache() with downloads from SSL domains while trying to send
> files to Internet Explorer can result in errors.

You can also tell clients that you want them to cache responses. By using
`CakeResponse::cache()`:

``` php
public function index() {
    //do something
    $this->response->cache('-1 minute', '+5 days');
}
```

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience. `CakeResponse::cache()` sets the
`Last-Modified` value to the first argument.
`Expires` header and the `max-age` directive are set based on the second parameter.
Cache-Control's `public` directive is set as well.

<a id="cake-response-caching"></a>

## Fine tuning HTTP cache

One of the best and easiest ways of speeding up your application is to use HTTP
cache. Under this caching model, you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time and response entity tag.

Rather than forcing you to code the logic for caching and for invalidating (refreshing)
it once the data has changed, HTTP uses two models, expiration and validation,
which usually are much simpler to use.

Apart from using `CakeResponse::cache()`, you can also use many other
methods to fine-tune HTTP cache headers to take advantage of browser or reverse
proxy caching.

### The Cache Control header

::: info Added in version 2.1
:::

Used under the expiration model, this header contains multiple indicators
that can change the way browsers or proxies use the cached content. A
`Cache-Control` header can look like this:

    Cache-Control: private, max-age=3600, must-revalidate

`CakeResponse` class helps you set this header with some utility methods that
will produce a final valid `Cache-Control` header. The first is the `CakeResponse::sharable()`
method, which indicates whether a response is to be considered sharable across
different users or clients. This method actually controls the `public`
or `private` part of this header. Setting a response as private indicates that
all or part of it is intended for a single user. To take advantage of shared
caches, the control directive must be set as public.

The second parameter of this method is used to specify a `max-age` for the cache,
which is the number of seconds after which the response is no longer considered
fresh:

``` php
public function view() {
    ...
    // set the Cache-Control as public for 3600 seconds
    $this->response->sharable(true, 3600);
}

public function my_data() {
    ...
    // set the Cache-Control as private for 3600 seconds
    $this->response->sharable(false, 3600);
}
```

`CakeResponse` exposes separate methods for setting each of the directives in
the `Cache-Control` header.

### The Expiration header

::: info Added in version 2.1
:::

You can set the `Expires` header to a date and time after which the response is
no longer considered fresh. This header can be set using the
`CakeResponse::expires()` method:

``` php
public function view() {
    $this->response->expires('+5 days');
}
```

This method also accepts a `DateTime` instance or any string that can be parsed by the
`DateTime` class.

### The Etag header

::: info Added in version 2.1
:::

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The `~CakeResponse::etag()` method (called entity tag) is a string that uniquely identifies the
requested resource, as a checksum does for a file, in order to determine whether
it matches a cached resource.

To take advantage of this header, you must either call the
`CakeResponse::checkNotModified()` method manually or include the
`RequestHandlerComponent` in your controller:

``` php
public function index() {
    $articles = $this->Article->find('all');
    $this->response->etag($this->Article->generateHash($articles));
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }
    ...
}
```

### The Last Modified header

::: info Added in version 2.1
:::

Under the HTTP cache validation model, you can also set the `Last-Modified`
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether
the response was modified or not based on their cache.

To take advantage of this header, you must either call the
`CakeResponse::checkNotModified()` method manually or include the
`RequestHandlerComponent` in your controller:

``` php
public function view() {
    $article = $this->Article->find('first');
    $this->response->modified($article['Article']['modified']);
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }
    ...
}
```

### The Vary header

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the `Vary` header:

``` php
$this->response->vary('User-Agent');
$this->response->vary('Accept-Encoding', 'User-Agent');
$this->response->vary('Accept-Language');
```

<a id="cakeresponse-testing"></a>

## CakeResponse and testing

Probably one of the biggest wins from `CakeResponse` comes from how it makes
testing controllers and components easier. Instead of having methods spread across
several objects, you only have to mock a single object, since controllers and
components delegate to `CakeResponse`. This helps you to get closer to a unit
test and makes testing controllers easier:

``` php
public function testSomething() {
    $this->controller->response = $this->getMock('CakeResponse');
    $this->controller->response->expects($this->once())->method('header');
    // ...
}
```

Additionally, you can run tests from the command line more easily, as you can use
mocks to avoid the 'headers sent' errors that can occur when trying to set
headers in CLI.

## CakeResponse API

`class` **CakeResponse**

`method` CakeResponse::**header**($header = null, $value = null)

`method` CakeResponse::**location**($url = null)

`method` CakeResponse::**charset**($charset = null)

`method` CakeResponse::**type**($contentType = null)

`method` CakeResponse::**cache**($since, $time = '+1 day')

`method` CakeResponse::**disableCache**()

`method` CakeResponse::**sharable**($public = null, $time = null)

`method` CakeResponse::**expires**($time = null)

`method` CakeResponse::**etag**($tag = null, $weak = false)

`method` CakeResponse::**modified**($time = null)

`method` CakeResponse::**checkNotModified**(CakeRequest $request)

`method` CakeResponse::**compress**()

`method` CakeResponse::**download**($filename)

`method` CakeResponse::**statusCode**($code = null)

`method` CakeResponse::**body**($content = null)

`method` CakeResponse::**send**()

`method` CakeResponse::**file**($path, $options = array())
