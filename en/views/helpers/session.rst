Session
#######

.. php:namespace:: Cake\View\Helper

.. php:class:: SessionHelper(View $view, array $config = [])

.. deprecated:: 3.0.0
    The SessionHelper is deprecated in 3.x. Instead you should use either the
    :doc:`FlashHelper </views/helpers/flash>` or :ref:`access the
    session via the request <accessing-session-object>`.

As a natural counterpart to the Session object, the Session
Helper replicates most of the object's functionality and makes it
available in your view.

The major difference between the SessionHelper and the Session
object is that the helper does *not* have the ability to write
to the session.

As with the session object, data is read by using
:term:`dot notation` array structures::

    ['User' => [
        'username' => 'super@example.com'
    ]];

Given the previous array structure, the node would be accessed by
``User.username``, with the dot indicating the nested array. This
notation is used for all SessionHelper methods wherever a ``$key`` is
used.

.. php:method:: read(string $key)

    :rtype: mixed

    Read from the Session. Returns a string or array depending on the
    contents of the session.

.. php:method:: check(string $key)

    :rtype: boolean

    Check to see whether a key is in the Session. Returns a boolean representing the
    key's existence.

.. meta::
    :title lang=en: SessionHelper
    :description lang=en: The SessionHelper replicates most of the functionality and making it available in your view.
    :keywords lang=en: session helper,flash messages,session flash,session read,session check
