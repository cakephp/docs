# New Features in CakePHP 2.0

## Models

The model construction process has been made lighter. Model associations are
now lazy loaded, applications with lots of models and associations will see
great time reductions in the bootstrap process.

Now models won't require a database connection in the construction process.
The database will be accessed for the first time only when a find operation is
issued or information for one of the columns is required.

## View

### View::\$output

View will now always have the last rendered content (view or layout) accessible
through `$this->output`. In helpers you can use `$this->_View->output`. Modifying
this property will change the content that comes out of the view rendering.

## Helpers

### HtmlHelper

- `getCrumbList()` Creates breadcrumb links wrapped in `<li>` elements.
- `loadConfig()` has moved from `Helper` to `HtmlHelper`
  class. This method now uses the new reader classes (see 2.0 `Configure`)
  to load your config file. As an option you can pass the path as second parameter
  (`app/Config` is default). To simplify, you can set the configuration file
  (and the reader) in `Controller::$helpers` (example below) to load on helper
  constructor. In configuration file you can set the below keys:

> - `tags` Should be an array with key value;
> - `minimizedAttributes` Should be a list;
> - `docTypes` Should be an array with key value;
> - `attributeFormat` Should be a string;
> - `minimizedAttributeFormat` Should be a string.

Example of how to set configuration file on controller:

``` php
public $helpers = array(
    'Html' => array(
        // Option one: an array with filename and reader name
        'configFile' => array('config_file', 'php')
        // Option two: a string with filename. The PhpReader will be used
        'configFile' => 'config_file'
    )
);
```

### FormHelper

- `FormHelper` now supports all HTML5 input types and custom input
  types. Just use the input type you want as the method on the helper. For
  example `range()` would create an input with type = range.
- `postLink()` and `postButton()` Creates link/button to
  access some page using HTTP method POST. With this, in your controller you can
  avoid some action, like delete, to be accessed by GET method.
- `select()` with multiple = checkbox, now treats the `'id'`
  attribute as a prefix for all the generated options.

## Libs

### CakeRequest

`CakeRequest` is a new class introduced in 2.0. It encapsulates
commonly used request introspection methods and replaces the params array with a
more useful object. Read more about `CakeRequest`.

### CakeResponse

`CakeResponse` is a new class introduced in 2.0. It encapsulates
commonly used methods and properties in the HTTP response your application
generates. It consolidates several features in CakePHP. Read more about
`CakeResponse`.

### CakeSession, SessionComponent

`CakeSession` and the `SessionComponent` have had a number
of changes, see the session section for more information.

### Router

#### Routes can return full URLs

Route objects can now return full URLs, and `Router` will not further
modify them beyond adding the query string and fragment elements. For example
this could be used to create routes to handle subdomains, or enabling https/http
flags. An example of a route class that supports subdomains would be:

``` php
class SubdomainRoute extends CakeRoute {

    public function match($params) {
        $subdomain = isset($params['subdomain']) ? $params['subdomain'] : null;
        unset($params['subdomain']);
        $path = parent::match($params);
        if ($subdomain) {
            $path = 'http://' . $subdomain . '.localhost' . $path;
        }
        return $path;
    }
}
```

When creating links you could do the following to make links pointing at other
subdomains.

``` php
echo $this->Html->link(
    'Other domain',
     array('subdomain' => 'test', 'controller' => 'posts', 'action' => 'add')
);
```

The above would create a link with <http://test.localhost/posts/add> as the url.

### Xml

`Xml` has had a number of changes. Read more about
[Xml](../core-utility-libraries/xml) class.

## New Lib features

### Configure readers

`Configure` can now be configured to load configuration files from a
variety of sources and formats. The [Configuration](../development/configuration) section
contains more information about the changes made to configure.

`Configure::read()` without any arguments allows you to read all
values from configure, instead of just the debug value.

### Error and exception handling

CakePHP 2.0 has had [Exceptions](../development/exceptions) and [Error Handling](../development/errors)
handling rebuilt, to be more flexible and give more power to developers.

### String::wrap()

`String::wrap()` was added to help make fixed width formatting of
text easier. It's used in Shells whenever you use `Shell::wrapText()`.

### debug()

`debug()` no longer outputs HTML in the console. Instead it makes
output like the following:

``` text
########## DEBUG ##########
Array
(
    [0] => test
)
###########################
```

This should improve readability of `debug()` on the command line.

## Components

Components received a similar treatment to helpers and behaviors,
`Component` is now the base class for components. Read more about the
component changes.

### RequestHandler

`RequestHandler` was heavily refactored due to the introduction of
`CakeRequest`. These changes allowed for some new features to be
introduced as well.

#### Automatic parsing of Accept headers

If a client sends a single Accept mime type that matches one of the extensions
enabled in :php:class\`Router\`, `RequestHandler` will treat it the
same an extension. This expands CakePHP's support for REST style endpoints. To
use this feature start off by enabling extensions in `app/Config/routes.php`:

``` php
Router::parseExtensions('json', 'xml');
```

Once you have created layouts and views for your extensions, you will be able to
visit a url like posts/view/1 and send Accept: `application/json` in the
headers to receive the JSON version of that URL.

### CookieComponent

`CookieComponent` now supports HTTP only cookies. You can enable
their use by setting `$this->Cookie->httpOnly = true;`. Having HTTP only
cookies will make them inaccessible from the browser.

### Security Component CSRF separation

CakePHP has had CSRF protection since 1.2. For 2.0 the existing CSRF has a new
more paranoid mode, and is its own standalone feature. In the past CSRF features
were coupled with form tampering safe-guards. Developers often disabled
validatePost in order to do dynamic forms, disabling the CSRF protection at the
same time. For 2.0 CSRF checking has been separated from form tampering giving
you greater control.

For more information see [Security Csrf](../core-libraries/components/security-component#security-csrf)

## Controller

Controllers now have access to request and response objects. You can read more
about these objects on their specific pages.

## Console

The console for CakePHP 2.0 was almost entirely rebuilt. Several new features as
well as some backwards incompatible changes were made. Read more about console
changes.

## Pagination

Pagination now provides a default maxLimit for pagination at 100.

This limit can be overridden with the paginate variable on Controller:

``` php
$this->paginate = array('maxLimit' => 1000);
```

This default is provided to prevent user URL manipulation causing excessive
strain on the database for subsequent requests, where a user would edit the
'limit' parameter to a very large number.

## Aliasing

You can now alias helpers, components and behaviors to use your class instead of
a different one. This means that you can very easily make a `MyHtml` helper
and not need to replace every instance of `$this->Html` in your views. To do
this, pass the 'className' key along with your class, like you would with
models:

``` php
public $helpers = array(
    'Html' => array(
        'className' => 'MyHtml'
    )
);
```

Similarly, you can alias components for use in your controllers:

``` php
public $components = array(
    'Email' => array(
        'className' => 'QueueEmailer'
    )
);
```

Calls to the Email component would call the QueueEmailer component instead.
Finally, you can alias behaviors as well:

``` php
public $actsAs = array(
    'Containable' => array(
        'className' => 'SuperContainable'
    )
);
```

Because of the way 2.0 utilizes collections and shares them across the
application, any classes you alias will be used throughout your application.
Whenever your application tries to access the alias, it will access your class.
For instance, when we aliased the Html helper in the example above, any helpers
that use the Html helper or elements that load the Html helper, will use MyHtml
instead.

## ConnectionManager

A new method `ConnectionManager::drop()` was added to allow
removing connections at runtime.
