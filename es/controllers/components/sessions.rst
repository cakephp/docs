Sessions
########

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:class:: SessionComponent(ComponentCollection $collection, array $config = [])

The CakePHP SessionComponent provides a way to persist client data
between page requests. It acts as a wrapper for ``$_SESSION`` as
well as providing convenience methods for several ``$_SESSION``
related functions.

Sessions can be configured in a number of ways in CakePHP. For more information,
you should see the :doc:`Session configuration </development/sessions>`
documentation.

Interacting with Session Data
=============================

The Session component is used to interact with session information.
It includes basic CRUD functions as well as features for creating
feedback messages to users.

It should be noted that Array structures can be created in the
Session by using :term:`dot notation`. So ``User.username`` would
reference the following::

    ['User' => [
        'username' => 'clark-kent@dailyplanet.com'
    ]];

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

.. meta::
    :title lang=es: Sessions
    :keywords lang=es: php array,dailyplanet com,configuration documentation,dot notation,feedback messages,reading data,session data,page requests,clark kent,dots,existence,sessions,convenience,cakephp
