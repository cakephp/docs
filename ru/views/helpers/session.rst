Сессия
######

.. php:namespace:: Cake\View\Helper

.. php:class:: SessionHelper(View $view, array $config = [])

.. deprecated:: 3.0.0
    SessionHelper не используется с версии 3.x. Вместо этого необходимо использовать
    :doc:`FlashHelper </views/helpers/flash>` или :ref:`получить доступ к сессии через
    request <accessing-session-object>`.

Как обычный аналог объекта Session, SessionHelper копирует большинство функций объекта
и предоставляет к нему доступ в представлении.

Наибольшая разница между SessionHelper и объектом Session в том, что хэлпер *не*
имеет доступа к записи в сессию.

Как и в случае с объектом сессии, доступ к данным осуществляется с использованием
структуры массива :term:`dot notation`::

    ['User' => [
        'username' => 'super@example.com'
    ]];

Учитывая предыдущую структуру массива, доступ к элементу осуществляется через точку
``User.username``, указывая на вложенный массив. Эта нотация используется для всех методов
SessionHelper, где используется ``$key``.

.. php:method:: read(string $key)

    :rtype: mixed

    Читает из сессии. Возвращает строку или массив в зависимости от её содержания.

.. php:method:: check(string $key)

    :rtype: boolean

    Проверяет, есть ли такой ключ в сессии. Возвращает логическое значение, отображая
    существование ключа.

.. meta::
    :title lang=ru: SessionHelper
    :description lang=ru: The SessionHelper replicates most of the functionality and making it available in your view.
    :keywords lang=ru: session helper,флэш сообщения,session flash,чтение сессии,проверка сессии
