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

Файлы cookie можно настроить как глобально, так и для каждого имени верхнего
уровня. Данные глобальной конфигурации будут объединены с конфигурацией верхнего
уровня. Поэтому нужно только переопределить те части, которые отличаются друг от
друга. Чтобы настроить глобальные параметры, используйте метод ``config()``::

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

Существует некоторое количество параметров конфигурации для
файлов куки:

expires
    Как долго куки должен существовать. По умолчанию 1 месяц.
path
    Путь на сервере, по которому куки будет доступен. Если, к примеру,
    путь задан как '/foo/', то файлы куки будут доступны только внутри
    каталога ``/foo/`` и всех его подкаталогах, например в папке домена
    ``/foo/bar/ ``.Значением по умлчанию является базовый путь приложения.
domain
    Домен, для которого куки доступны. Чтобы сделать куки доступными на
    всех поддоменах ``example.com``, установите значение '.example.com'.
secure
    Показывает, что куки должны передаваться только по защищенному соединению,
    через протокол HTTPS. Когда установлено значение ``true``, куки будут
    созданы только в случае если защищенное соединение существует.
key
    Ключ шифрования, используемый в случае если включено шифрование куки.
    По умолчанию ``Security.salt``.
httpOnly
    Установите в ``true``, если хотите сделать куки доступными только по
    протоколу HTTP. В таком случае куки будут недоступны из JavaScript.
    По умолчанию ``false``.
encryption
    Тип используемого шифрования. Значение по умолчанию 'aes'. Можно также
    установить 'rijndael' для обратной совместимости.
    
Использование компонента
========================

Компонент ``CookieComponent`` предлагает некоторое количество методов для
работы с куки-файлами.

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
    :title lang=ru: Cookie
    :keywords lang=ru: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
