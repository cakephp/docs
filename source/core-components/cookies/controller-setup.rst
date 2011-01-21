5.3.1 Controller Setup
----------------------

There are a number of controller variables that allow you to
configure the way cookies are created and managed. Defining these
special variables in the beforeFilter() method of your controller
allows you to define how the CookieComponent works.

Cookie variable
default
description
string $name
'CakeCookie'
The name of the cookie.
string $key
null
This string is used to encrypt the value written to the cookie.
This string should be random and difficult to guess.
string $domain
''
The domain name allowed to access the cookie. e.g. Use
'.yourdomain.com' to allow access from all your subdomains.
int or string $time
'5 Days'
The time when your cookie will expire. Integers are interpreted as
seconds and a value of 0 is equivalent to a 'session cookie': i.e.
the cookie expires when the browser is closed. If a string is set,
this will be interpreted with PHP function strtotime(). You can set
this directly within the write() method.
string $path
'/'
The server path on which the cookie will be applied. If $cookiePath
is set to '/foo/', the cookie will only be available within the
/foo/ directory and all sub-directories such as /foo/bar/ of your
domain. The default value is the entire domain. You can set this
directly within the write() method.
boolean $secure
false
Indicates that the cookie should only be transmitted over a secure
HTTPS connection. When set to true, the cookie will only be set if
a secure connection exists. You can set this directly within the
write() method.
The following snippet of controller code shows how to include the
CookieComponent and set up the controller variables needed to write
a cookie named 'baker\_id' for the domain 'example.com' which needs
a secure connection, is available on the path
‘/bakers/preferences/’, and expires in one hour.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // or '1 hour'
      $this->Cookie->path = '/bakers/preferences/'; 
      $this->Cookie->domain = 'example.com';   
      $this->Cookie->secure = true;  //i.e. only sent if using secure HTTPS
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

Next, let’s look at how to use the different methods of the Cookie
Component.

5.3.1 Controller Setup
----------------------

There are a number of controller variables that allow you to
configure the way cookies are created and managed. Defining these
special variables in the beforeFilter() method of your controller
allows you to define how the CookieComponent works.

Cookie variable
default
description
string $name
'CakeCookie'
The name of the cookie.
string $key
null
This string is used to encrypt the value written to the cookie.
This string should be random and difficult to guess.
string $domain
''
The domain name allowed to access the cookie. e.g. Use
'.yourdomain.com' to allow access from all your subdomains.
int or string $time
'5 Days'
The time when your cookie will expire. Integers are interpreted as
seconds and a value of 0 is equivalent to a 'session cookie': i.e.
the cookie expires when the browser is closed. If a string is set,
this will be interpreted with PHP function strtotime(). You can set
this directly within the write() method.
string $path
'/'
The server path on which the cookie will be applied. If $cookiePath
is set to '/foo/', the cookie will only be available within the
/foo/ directory and all sub-directories such as /foo/bar/ of your
domain. The default value is the entire domain. You can set this
directly within the write() method.
boolean $secure
false
Indicates that the cookie should only be transmitted over a secure
HTTPS connection. When set to true, the cookie will only be set if
a secure connection exists. You can set this directly within the
write() method.
The following snippet of controller code shows how to include the
CookieComponent and set up the controller variables needed to write
a cookie named 'baker\_id' for the domain 'example.com' which needs
a secure connection, is available on the path
‘/bakers/preferences/’, and expires in one hour.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // or '1 hour'
      $this->Cookie->path = '/bakers/preferences/'; 
      $this->Cookie->domain = 'example.com';   
      $this->Cookie->secure = true;  //i.e. only sent if using secure HTTPS
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

Next, let’s look at how to use the different methods of the Cookie
Component.
