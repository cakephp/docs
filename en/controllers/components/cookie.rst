Cookie
######

.. php:namespace:: Cake\Controller\Component

.. php:class:: CookieComponent(ComponentRegistry $collection, array $config = [])

The CookieComponent is a wrapper around the native PHP ``setcookie()`` method. It
makes it easier to manipulate cookies, and automatically encrypt cookie data.

.. deprecated:: 3.5.0
    You should use :ref:`encrypted-cookie-middleware` instead of
    ``CookieComponent``.

Configuring Cookies
===================

Cookies can be configured either globally or per top-level name. The global
configuration data will be merged with the top-level configuration. So only need
to override the parts that are different. To configure the global settings use
the ``config()`` method::

    $this->Cookie->config('path', '/');
    $this->Cookie->config([
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

To configure a specific key use the ``configKey()`` method::

    $this->Cookie->configKey('User', 'path', '/');
    $this->Cookie->configKey('User', [
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

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
    connection. When set to ``true``, the cookie will only be set if a
    secure connection exists.
key
    Encryption key used when encrypted cookies are enabled. Defaults to Security.salt.
httpOnly
    Set to ``true`` to make HTTP only cookies. Cookies that are HTTP only
    are not accessible in JavaScript. Defaults to ``false``.
encryption
    Type of encryption to use. Defaults to 'aes'. Can also be 'rijndael' for
    backwards compatibility.

Using the Component
===================

The CookieComponent offers a number of methods for working with Cookies.

.. php:method:: write(mixed $key, mixed $value = null)

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
            ['name' => 'Larry', 'role' => 'Lead']
        );

    All values in the cookie are encrypted with AES by default. If you want to
    store the values as plain text, be sure to configure the key space::

        $this->Cookie->configKey('User', 'encryption', false);

.. php:method:: read(mixed $key = null)

    This method is used to read the value of a cookie variable with the
    name specified by $key. ::

        // Outputs "Larry"
        echo $this->Cookie->read('name');

        // You can also use the dot notation for read
        echo $this->Cookie->read('User.name');

        // To get the variables which you had grouped
        // using the dot notation as an array use the following
        $this->Cookie->read('User');

        // This outputs something like ['name' => 'Larry', 'role' => 'Lead']

    .. warning::
        CookieComponent cannot interact with bare strings values that contain
        ``,``. The component will attempt to interpret these values as
        arrays, leading to incorrect results. Instead you should use
        ``$request->getCookie()``.

.. php:method:: check($key)

    :param string $key: The key to check.

    Used to check whether a key/path exists and has a non-null value.

.. php:method:: delete(mixed $key)

    Deletes a cookie variable of the name in $key. Works with dot
    notation::

        // Delete a variable
        $this->Cookie->delete('bar');

        // Delete the cookie variable bar, but not everything under foo
        $this->Cookie->delete('foo.bar');

.. meta::
    :title lang=en: Cookie
    :keywords lang=en: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
