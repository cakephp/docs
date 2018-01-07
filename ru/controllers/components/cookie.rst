Куки
####

.. php:namespace:: Cake\Controller\Component

.. php:class:: CookieComponent(ComponentRegistry $collection, array $config = [])

``CookieComponent`` - это оболочка вокруг собственного метода PHP ``setcookie()``.
Это упрощает манипулирование файлами cookie и автоматически шифрует данные cookie.
Куки, добавленные через ``CookieComponent``, будут отправляться только в том
случае, если экшен контроллера завершен.

.. deprecated:: 3.5.0
    Вы должны использовать :ref:`encrypted-cookie-middleware` вместо
    ``CookieComponent``.
    
Настройка куки
==============

Cookies can be configured either globally or per top-level name. The global
configuration data will be merged with the top-level configuration. So only need
to override the parts that are different. To configure the global settings use
the ``config()`` method::

    $this->Cookie->config('path', '/');
    $this->Cookie->config([
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

Для настройки определенного ключа используйте метод ``configKey()``::

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


.. meta::
    :title lang=ru: Cookie
    :keywords lang=ru: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
