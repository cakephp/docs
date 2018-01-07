Cookie
######

.. php:namespace:: Cake\Controller\Component

.. php:class:: CookieComponent(ComponentRegistry $collection, array $config = [])

``CookieComponent`` - это оболочка вокруг собственного метода PHP ``setcookie()``.
Это упрощает манипулирование файлами cookie и автоматически шифрует данные cookie.
Куки, добавленные через ``CookieComponent``, будут отправляться только в том
случае, если экшен контроллера завершен.

The CookieComponent is a wrapper around the native PHP ``setcookie()`` method. It
makes it easier to manipulate cookies, and automatically encrypt cookie data.
Cookies added through CookieComponent will only be sent if the controller action
completes.

.. deprecated:: 3.5.0
    Вы должны использовать :ref:`encrypted-cookie-middleware` вместо
    ``CookieComponent``.

.. meta::
    :title lang=ru: Cookie
    :keywords lang=ru: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
