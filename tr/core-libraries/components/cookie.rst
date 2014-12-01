Cookie
######

.. php:class:: CookieComponent(ComponentCollection $collection, array $settings = array())

The CookieComponent is a wrapper around the native PHP ``setcookie``
method. It also includes a host of delicious icing to make coding
cookies in your controllers very convenient. Before attempting to
use the CookieComponent, you must make sure that 'Cookie' is listed
in your controller's $components array.


Controller Setup
================

There are a number of controller variables that allow you to
configure the way cookies are created and managed. Defining these
special variables in the beforeFilter() method of your controller
allows you to define how the CookieComponent works.

+-----------------+--------------+------------------------------------------------------+
| Cookie variable | default      | description                                          |
+=================+==============+======================================================+
| string $name    |'CakeCookie'  | The name of the cookie.                              |
+-----------------+--------------+------------------------------------------------------+
| string $key     | null         | This string is used to encrypt                       |
|                 |              | the value written to the cookie.                     |
|                 |              | The string should be random and difficult to guess.  |
|                 |              |                                                      |
|                 |              | When using rijndael or aes encryption, this value    |
|                 |              | must be longer than 32 bytes.                        |
+-----------------+--------------+------------------------------------------------------+
| string $domain  | ''           | The domain name allowed to access the cookie. For    |
|                 |              | example, use '.yourdomain.com' to allow access from  |
|                 |              | all your subdomains.                                 |
+-----------------+--------------+------------------------------------------------------+
| int or string   | '5 Days'     | The time when your cookie will expire. Integers are  |
| $time           |              | interpreted as seconds. A value of 0 is equivalent   |
|                 |              | to a 'session cookie': i.e., the cookie expires when |
|                 |              | the browser is closed. If a string is set, this will |
|                 |              | be interpreted with PHP function strtotime(). You can|
|                 |              | set this directly within the write() method.         |
+-----------------+--------------+------------------------------------------------------+
| string $path    | '/'          | The server path on which the cookie will be applied. |
|                 |              | If $path is set to '/foo/', the cookie will          |
|                 |              | only be available within the /foo/ directory and all |
|                 |              | sub-directories of your domain, such as /foo/bar. The|
|                 |              | default value is the entire domain. You can set this |
|                 |              | directly within the write() method.                  |
+-----------------+--------------+------------------------------------------------------+
| boolean $secure | false        | Indicates that the cookie should only be transmitted |
|                 |              | over a secure HTTPS connection. When set to true, the|
|                 |              | cookie will only be set if a secure connection       |
|                 |              | exists. You can set this directly within the write() |
|                 |              | method.                                              |
+-----------------+--------------+------------------------------------------------------+
| boolean         | false        | Set to true to make HTTP only cookies. Cookies that  |
| $httpOnly       |              | are HTTP only are not accessible in Javascript.      |
+-----------------+--------------+------------------------------------------------------+

The following snippet of controller code shows how to include the
CookieComponent and set up the controller variables needed to write
a cookie named 'baker\_id' for the domain 'example.com' which needs
a secure connection, is available on the path
'/bakers/preferences/', expires in one hour and is HTTP only::

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

Next, let's look at how to use the different methods of the Cookie
Component.

Using the Component
===================

The CookieComponent offers a number of methods for working with Cookies.

.. php:method:: write(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

    The write() method is the heart of the cookie component. $key is the
    cookie variable name you want, and the $value is the information to
    be stored::

        $this->Cookie->write('name', 'Larry');

    You can also group your variables by using dot notation in the
    key parameter::

        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    If you want to write more than one value to the cookie at a time,
    you can pass an array::

        $this->Cookie->write('User',
            array('name' => 'Larry', 'role' => 'Lead')
        );

    All values in the cookie are encrypted by default. If you want to
    store the values as plain text, set the third parameter of the
    write() method to false. You should remember to set
    the encryption mode to 'aes' to ensure that values are securely
    encrypted::

        $this->Cookie->write('name', 'Larry', false);

    The last parameter to write is $expires – the number of seconds
    until your cookie will expire. For convenience, this parameter can
    also be passed as a string that the php strtotime() function
    understands::

        // Both cookies expire in one hour.
        $this->Cookie->write('first_name', 'Larry', false, 3600);
        $this->Cookie->write('last_name', 'Masters', false, '1 hour');

.. php:method:: read(mixed $key = null)

    This method is used to read the value of a cookie variable with the
    name specified by $key.::

        // Outputs "Larry"
        echo $this->Cookie->read('name');

        // You can also use the dot notation for read
        echo $this->Cookie->read('User.name');

        // To get the variables which you had grouped
        // using the dot notation as an array use the following
        $this->Cookie->read('User');

        // this outputs something like array('name' => 'Larry', 'role' => 'Lead')

.. php:method:: check($key)

    :param string $key: The key to check.

    Used to check whether a key/path exists and has a non-null value.

    .. versionadded:: 2.3
        ``CookieComponent::check()`` was added in 2.3

.. php:method:: delete(mixed $key)

    Deletes a cookie variable of the name in $key. Works with dot
    notation::

        // Delete a variable
        $this->Cookie->delete('bar');

        // Delete the cookie variable bar, but not everything under foo
        $this->Cookie->delete('foo.bar');

.. php:method:: destroy()

    Destroys the current cookie.

.. php:method:: type($type)

    Allows you to change the encryption scheme. By default the 'cipher' scheme is used for
    backwards compatibility. However, you should always use either the 'rijndael' or
    'aes' schemes.

    .. versionchanged:: 2.2
        The 'rijndael' type was added.

    .. versionadded:: 2.5
        The 'aes' type was added.


.. meta::
    :title lang=en: Cookie
    :keywords lang=en: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
