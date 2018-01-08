Флэш
####

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

``FlashComponent`` предоставляет способ установки одноразовых уведомлений,
которые будут отображаться после обработки формы или подтверждения данных.
CakePHP ссылается на эти сообщения как «флэш-сообщения». ``FlashComponent``
записывает флэш-сообщения в ``$_SESSION`` для дальнейшего вывода в Виде
с помощью хелпера :doc:`FlashHelper </views/helpers/flash>`.

Настройка флэш-сообщений
========================

``FlashComponent`` предоставляет два способа установки флеш-сообщений: его
магический метод ``__call()`` и его метод ``set()``. Чтобы предотвратить
многословность в приложении, магический метод ``__call()`` компонента
``FlashComponent`` позволяет использовать имя метода, которое сопоставляется
с элементом, расположенным в каталоге **src/Template/Element/Flash**.
В соответствии соглашениями, имена методов в верблюжьем регистре будут
соотносится с именем элемента, написанном в нижнем регистре с разделением слов
с помощью знака подчеркивания::

    // Использует src/Template/Element/Flash/success.ctp
    $this->Flash->success('This was successful');

    // Использует src/Template/Element/Flash/great_success.ctp
    $this->Flash->greatSuccess('This was greatly successful');

В качестве альтернативы вы можете задавать текстовое сообщение без использования
заготовленного элемента вида, используя метод ``set()``::

    $this->Flash->set('Это текст сообщения');

.. versionadded:: 3.1
    Флэш-сообщения теперь складываются в стопку. Последовательные вызовы
    ``set()`` или ``__call()`` с тем же ключом будут добавлять сообщения
    в ``$_SESSION``. Если вы хотите сохранить прежнее поведение (одно
    сообщение даже после последовательных вызовов), установите параметр
    ``clear`` в ``true`` при настройке Компонента.

FlashComponent's ``__call()`` and ``set()`` methods optionally take a second
parameter, an array of options:

* ``key`` Defaults to 'flash'. The array key found under the ``Flash`` key in
  the session.
* ``element`` Defaults to ``null``, but will automatically be set when using the
  ``__call()`` magic method. The element name to use for rendering.
* ``params`` An optional array of keys/values to make available as variables
  within an element.

.. versionadded:: 3.1

    A new key ``clear`` was added. This key expects a ``bool`` and allows you
    to delete all messages in the current stack and start a new one.

An example of using these options::

    // In your Controller
    $this->Flash->success('The user has been saved', [
        'key' => 'positive',
        'params' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);

    // In your View
    <?= $this->Flash->render('positive') ?>

    <!-- In src/Template/Element/Flash/success.ctp -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

Note that the parameter ``element`` will be always overridden while using
``__call()``. In order to retrieve a specific element from a plugin, you should
set the ``plugin`` parameter. For example::

    // In your Controller
    $this->Flash->warning('My message', ['plugin' => 'PluginName']);

The code above will use the **warning.ctp** element under
**plugins/PluginName/src/Template/Element/Flash** for rendering the flash
message.

.. note::

    By default, CakePHP escapes the content in flash messages to prevent cross
    site scripting. User data in your flash messages will be HTML encoded and
    safe to be printed. If you want to include HTML in your flash messages, you
    need to pass the ``escape`` option and adjust your flash message templates
    to allow disabling escaping when the escape option is passed.

HTML in Flash Messages
======================

.. versionadded:: 3.3.3

It is possible to output HTML in flash messages by using the ``'escape'`` option
key::

    $this->Flash->info(sprintf('<b>%s</b> %s', h($highlight), h($message)), ['escape' => false]);

Make sure that you escape the input manually, then. In the above example
``$highlight`` and ``$message`` are non-HTML input and therefore escaped.

For more information about rendering your flash messages, please refer to the
:doc:`FlashHelper </views/helpers/flash>` section.
