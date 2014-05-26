Sessions
########

.. php:class:: SessionComponent(ComponentCollection $collection, array $settings = array())

The CakePHP SessionComponent provides a way to persist client data
between page requests. It acts as a wrapper for ``$_SESSION`` as
well as providing convenience methods for several ``$_SESSION``
related functions.

Sessions can be configured in a number of ways in CakePHP. For more
information, you should see the :doc:`Session configuration </development/sessions>`
documentation.

Interacting with Session data
=============================

The Session component is used to interact with session information.
It includes basic CRUD functions as well as features for creating
feedback messages to users.

It should be noted that Array structures can be created in the
Session by using :term:`dot notation`. So ``User.username`` would
reference the following::

    array('User' => array(
        'username' => 'clark-kent@dailyplanet.com'
    ));

Dots are used to indicate nested arrays. This notation is used for
all Session component methods wherever a name/key is used.

.. php:method:: write($name, $value)

    Write to the Session puts $value into $name. $name can be a dot
    separated array. For example::

        $this->Session->write('Person.eyeColor', 'Green');

    This writes the value 'Green' to the session under Person =>
    eyeColor.


.. php:method:: read($name)

    Returns the value at $name in the Session. If $name is null the
    entire session will be returned. E.g::

        $green = $this->Session->read('Person.eyeColor');

    Retrieve the value Green from the session. Reading data that does not exist
    will return null.

.. php:method:: check($name)

    Used to check if a Session variable has been set. Returns true on
    existence and false on non-existence.

.. php:method:: delete($name)

    Clear the session data at $name. E.g::

        $this->Session->delete('Person.eyeColor');

    Our session data no longer has the value 'Green', or the index
    eyeColor set. However, Person is still in the Session. To delete
    the entire Person information from the session use::

        $this->Session->delete('Person');

.. php:method:: destroy()

    The ``destroy`` method will delete the session cookie and all
    session data stored in the temporary file system. It will then
    destroy the PHP session and then create a fresh session::

        $this->Session->destroy();


.. _creating-notification-messages:

Creating notification messages
==============================

.. php:method:: setFlash(string $message, string $element = 'default', array $params = array(), string $key = 'flash')

    :rtype: void

    Often in web applications, you will need to display a one-time notification
    message to the user after processing a form or acknowledging data.
    In CakePHP, these are referred to as "flash messages". You can set flash
    message with the SessionComponent and display them with the
    :php:meth:`SessionHelper::flash()`. To set a message, use ``setFlash``::

        // In the controller.
        $this->Session->setFlash('Your stuff has been saved.');

    This will create a one-time message that can be displayed to the user,
    using the SessionHelper::

        // In the view.
        echo $this->Session->flash();

        // The above will output.
        <div id="flashMessage" class="message">
            Your stuff has been saved.
        </div>

    You can use the additional parameters of ``setFlash()`` to create
    different kinds of flash messages. For example, you may want error and positive
    notifications to look different from each other. CakePHP gives you a way to do that.
    Using the ``$key`` parameter, you can store multiple messages, which can be
    output separately::

        // set a bad message.
        $this->Session->setFlash('Something bad.', 'default', array(), 'bad');

        // set a good message.
        $this->Session->setFlash('Something good.', 'default', array(), 'good');

    In the view, these messages can be output and styled differently::

        // in a view.
        echo $this->Session->flash('good');
        echo $this->Session->flash('bad');

    The ``$element`` parameter allows you to control the element
    (located in ``/app/View/Elements``) in which the message should be
    rendered. Within the element, the message is available as ``$message``.
    First we set the flash in our controller::

        $this->Session->setFlash('Something custom!', 'flash_custom');

    Then we create the file ``app/View/Elements/flash_custom.ctp`` and build our
    custom flash element::

        <div id="myCustomFlash"><?php echo h($message); ?></div>

    ``$params`` allows you to pass additional view variables to the
    rendered layout. Parameters can be passed affecting the rendered div. For
    example, adding "class" in the $params array will apply a class to the
    ``div`` output using ``$this->Session->flash()`` in your layout or view::

        $this->Session->setFlash(
            'Example message text',
            'default',
            array('class' => 'example_class')
        );

    The output from using ``$this->Session->flash()`` with the above example
    would be::

        <div id="flashMessage" class="example_class">Example message text</div>

    To use an element from a plugin just specify the plugin in the
    ``$params``::

        // Will use /app/Plugin/Comment/View/Elements/flash_no_spam.ctp
        $this->Session->setFlash(
            'Message!',
            'flash_no_spam',
            array('plugin' => 'Comment')
        );

    .. note::
        By default CakePHP does not escape the HTML in flash messages. If you are using
        any request or user data in your flash messages, you should escape it
        with :php:func:`h` when formatting your messages.

.. meta::
    :title lang=en: Sessions
    :keywords lang=en: php array,dailyplanet com,configuration documentation,dot notation,feedback messages,reading data,session data,page requests,clark kent,dots,existence,sessions,convenience,cakephp
