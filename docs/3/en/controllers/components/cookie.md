# Cookie

`class` Cake\\Controller\\Component\\**CookieComponent**(ComponentRegistry $collection, array $config = [])

The CookieComponent is a wrapper around the native PHP `setcookie()` method. It
makes it easier to manipulate cookies, and automatically encrypt cookie data.
Cookies added through CookieComponent will only be sent if the controller action
completes.

<div class="deprecated">

3.5.0
Cookies are available in the `ServerRequest` see [Request Cookies](../../controllers/request-response#request-cookies).
For encrypted cookies see the [Encrypted Cookie Middleware](../../controllers/middleware#encrypted-cookie-middleware).

</div>

## Configuring Cookies

Cookies can be configured either globally or per top-level name. The global
configuration data will be merged with the top-level configuration. So only need
to override the parts that are different. To configure the global settings use
the `config()` method:

``` php
$this->Cookie->config('path', '/');
$this->Cookie->config([
    'expires' => '+10 days',
    'httpOnly' => true
]);
```

To configure a specific key use the `configKey()` method:

``` php
$this->Cookie->configKey('User', 'path', '/');
$this->Cookie->configKey('User', [
    'expires' => '+10 days',
    'httpOnly' => true
]);
```

There are a number of configurable values for cookies:

expires  
How long the cookies should last for. Defaults to 1 month.

path  
The path on the server in which the cookie will be available on.
If path is set to '/foo/', the cookie will only be available within the
/foo/ directory and all sub-directories such as /foo/bar/ of domain.
The default value is app's base path.

domain  
The domain that the cookie is available. To make the cookie
available on all subdomains of example.com set domain to '.example.com'.

secure  
Indicates that the cookie should only be transmitted over a secure HTTPS
connection. When set to `true`, the cookie will only be set if a
secure connection exists.

key  
Encryption key used when encrypted cookies are enabled. Defaults to Security.salt.

httpOnly  
Set to `true` to make HTTP only cookies. Cookies that are HTTP only
are not accessible in JavaScript. Defaults to `false`.

encryption  
Type of encryption to use. Defaults to 'aes'. Can also be 'rijndael' for
backwards compatibility.

## Using the Component

The CookieComponent offers a number of methods for working with Cookies.

`method` Cake\\Controller\\Component\\CookieComponent::**write**(mixed $key, mixed $value = null)

`method` Cake\\Controller\\Component\\CookieComponent::**read**(mixed $key = null)

`method` Cake\\Controller\\Component\\CookieComponent::**check**($key)

`method` Cake\\Controller\\Component\\CookieComponent::**delete**(mixed $key)
