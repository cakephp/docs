7.10 Session
------------

As a natural counterpart to the Session Component, the Session
Helper replicates most of the components functionality and makes it
available in your view. The Session Helper is no longer
automatically added to your view — so it is necessary to add it to
the ``$helpers`` array in the controller.

The major difference between the Session Helper and the Session
Component is that the helper does *not* have the ability to write
to the session.

As with the Session Component, data is written to and read by using
dot separated array structures.

::

        array('User' => 
                array('username' => 'super@example.com')
        );

Given the previous array structure, the node would be accessed by
User.username, with the dot indicating the nested array. This
notation is used for all Session helper methods wherever a $key is
used.

If you have ``Session.start`` set to false in your config/core.php,
you need to call ``$session->activate();`` in your view before you
can use any other method of Session helper. Just like you need to
call ``$this->Session->activate();`` in your controller to activate
Session component.

7.10 Session
------------

As a natural counterpart to the Session Component, the Session
Helper replicates most of the components functionality and makes it
available in your view. The Session Helper is no longer
automatically added to your view — so it is necessary to add it to
the ``$helpers`` array in the controller.

The major difference between the Session Helper and the Session
Component is that the helper does *not* have the ability to write
to the session.

As with the Session Component, data is written to and read by using
dot separated array structures.

::

        array('User' => 
                array('username' => 'super@example.com')
        );

Given the previous array structure, the node would be accessed by
User.username, with the dot indicating the nested array. This
notation is used for all Session helper methods wherever a $key is
used.

If you have ``Session.start`` set to false in your config/core.php,
you need to call ``$session->activate();`` in your view before you
can use any other method of Session helper. Just like you need to
call ``$this->Session->activate();`` in your controller to activate
Session component.
