Cookies
#######

The CookieComponent is a wrapper around the native PHP setcookie method.
It also includes a host of delicious icing to make coding cookies in
your controllers very convenient. Before attempting to use the
CookieComponent, you must make sure that 'Cookie' is listed in your
controllers' $components array.

Controller Setup
================

There are a number of controller variables that allow you to configure
the way cookies are created and managed. Defining these special
variables in the beforeFilter() method of your controller allows you to
define how the CookieComponent works.

Cookie variable

default

description

string $name

'CakeCookie'

The name of the cookie.

string $key

null

This string is used to encrypt the value written to the cookie. This
string should be random and difficult to guess.

string $domain

''

The domain name allowed to access the cookie. e.g. Use '.yourdomain.com'
to allow access from all your subdomains.

int or string $time

'5 Days'

The time when your cookie will expire. Integers are interpreted as
seconds and a value of 0 is equivalent to a 'session cookie': i.e. the
cookie expires when the browser is closed. If a string is set, this will
be interpreted with PHP function strtotime(). You can set this directly
within the write() method.

string $path

'/'

The server path on which the cookie will be applied. If $cookiePath is
set to '/foo/', the cookie will only be available within the /foo/
directory and all sub-directories such as /foo/bar/ of your domain. The
default value is the entire domain. You can set this directly within the
write() method.

boolean $secure

false

Indicates that the cookie should only be transmitted over a secure HTTPS
connection. When set to true, the cookie will only be set if a secure
connection exists. You can set this directly within the write() method.

The following snippet of controller code shows how to include the
CookieComponent and set up the controller variables needed to write a
cookie named 'baker\_id' for the domain 'example.com' which needs a
secure connection, is available on the path ‘/bakers/preferences/’, and
expires in one hour.

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

Using the Component
===================

The CookieComponent offers a number of methods for working with Cookies.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

The write() method is the heart of cookie component, $key is the cookie
variable name you want, and the $value is the information to be stored.

::

    $this->Cookie->write('name','Larry');

You can also group your variables by supplying dot notation in the key
parameter.

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  

If you want to write more than one value to the cookie at a time, you
can pass an array:

::

    $this->Cookie->write(
      array('name'=>'Larry','role'=>'Lead')
      );

All values in the cookie are encrypted by default. If you want to store
the values as plain-text, set the third parameter of the write() method
to false. The encryption performed on cookie values is fairly
uncomplicated encryption system. It uses Security.salt and a predefined
``CIPHER_SEED`` constant to encrypt values. To make your cookies more
secure you should define ``CIPHER_SEED`` in your bootstrap to ensure a
better encryption. The default value of ``CIPHER_SEED`` is
``76859309657453542496749683645``

::

    $this->Cookie->write('name','Larry',false);

The last parameter to write is $expires – the number of seconds before
your cookie will expire. For convenience, this parameter can also be
passed as a string that the php strtotime() function understands:

::

    //Both cookies expire in one hour.
      $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');

**read(mixed $key)**

This method is used to read the value of a cookie variable with the name
specified by $key.

::

    // Outputs “Larry”
      echo $this->Cookie->read('name');
      
      //You can also use the dot notation for read
      echo $this->Cookie->read('User.name');
      
      //To get the variables which you had grouped
      //using the dot notation as an array use something like  
      $this->Cookie->read('User');
      
      // this outputs something like array('name' => 'Larry', 'role'=>'Lead')

**del(mixed $key)**

Deletes a cookie variable of the name in $key. Works with dot notation.

::

      //Delete a variable
      $this->Cookie->del('bar')
      
      //Delete the cookie variable bar, but not all under foo
      $this->Cookie->del('foo.bar')
     

**destroy()**

Destroys the current cookie.
