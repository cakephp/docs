# Cookie

`class` **CookieComponent**(ComponentCollection $collection, array $settings = array())

The CookieComponent is a wrapper around the native PHP `setcookie`
method. It also includes a host of delicious icing to make coding
cookies in your controllers very convenient. Before attempting to
use the CookieComponent, you must make sure that 'Cookie' is listed
in your controller's \$components array.

## Controller Setup

There are a number of controller variables that allow you to
configure the way cookies are created and managed. Defining these
special variables in the beforeFilter() method of your controller
allows you to define how the CookieComponent works.

<table style="width:99%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 16%" />
<col style="width: 61%" />
</colgroup>
<thead>
<tr>
<th>Cookie variable</th>
<th>default</th>
<th>description</th>
</tr>
</thead>
<tbody>
<tr>
<td>string $name</td>
<td>'CakeCookie'</td>
<td>The name of the cookie.</td>
</tr>
<tr>
<td>string $key</td>
<td>null</td>
<td><p>This string is used to encrypt the value written to the cookie. The string should be random and difficult to guess.</p>
<p>When using rijndael or aes encryption, this value must be longer than 32 bytes.</p></td>
</tr>
<tr>
<td>string $domain</td>
<td>''</td>
<td>The domain name allowed to access the cookie. For example, use '.yourdomain.com' to allow access from all your subdomains.</td>
</tr>
<tr>
<td>int or string $time</td>
<td>'5 Days'</td>
<td>The time when your cookie will expire. Integers are interpreted as seconds. A value of 0 is equivalent to a 'session cookie': i.e., the cookie expires when the browser is closed. If a string is set, this will be interpreted with PHP function strtotime(). You can set this directly within the write() method.</td>
</tr>
<tr>
<td>string $path</td>
<td>'/'</td>
<td>The server path on which the cookie will be applied. If $path is set to '/foo/', the cookie will only be available within the /foo/ directory and all sub-directories of your domain, such as /foo/bar. The default value is the entire domain. You can set this directly within the write() method.</td>
</tr>
<tr>
<td>boolean $secure</td>
<td>false</td>
<td>Indicates that the cookie should only be transmitted over a secure HTTPS connection. When set to true, the cookie will only be set if a secure connection exists. You can set this directly within the write() method.</td>
</tr>
<tr>
<td>boolean $httpOnly</td>
<td>false</td>
<td>Set to true to make HTTP only cookies. Cookies that are HTTP only are not accessible in Javascript.</td>
</tr>
</tbody>
</table>

The following snippet of controller code shows how to include the
CookieComponent and set up the controller variables needed to write
a cookie named 'baker_id' for the domain 'example.com' which needs
a secure connection, is available on the path
'/bakers/preferences/', expires in one hour and is HTTP only:

``` php
public $components = array('Cookie');

public function beforeFilter() {
    parent::beforeFilter();
    $this->Cookie->name = 'baker_id';
    $this->Cookie->time = 3600;  // or '1 hour'
    $this->Cookie->path = '/bakers/preferences/';
    $this->Cookie->domain = 'example.com';
    $this->Cookie->secure = true;  // i.e. only sent if using secure HTTPS
    $this->Cookie->key = 'qSI232qs*&sXOw!adre@34SAv!@*(XSL#$%)asGb$@11~_+!@#HKis~#^';
    $this->Cookie->httpOnly = true;
    $this->Cookie->type('aes');
}
```

Next, let's look at how to use the different methods of the Cookie
Component.

## Using the Component

The CookieComponent offers a number of methods for working with Cookies.

`method` CookieComponent::**write**(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

`method` CookieComponent::**read**(mixed $key = null)

`method` CookieComponent::**check**($key)

`method` CookieComponent::**delete**(mixed $key)

`method` CookieComponent::**destroy**()

`method` CookieComponent::**type**($type)
