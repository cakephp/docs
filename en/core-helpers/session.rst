SessionHelper
#############

.. php:class:: SessionHelper

    As a natural counterpart to the Session Component, the Session
    Helper replicates most of the components functionality and makes it
    available in your view. The Session Helper is no longer
    automatically added to your view — so it is necessary to add it to
    the ``$helpers`` array in the controller.

    The major difference between the Session Helper and the Session
    Component is that the helper does *not* have the ability to write
    to the session.

    As with the Session Component, data is written to and read by using
    dot separated array structures::

        <?php
        array('User' => 
                array('username' => 'super@example.com')
        );

    Given the previous array structure, the node would be accessed by
    User.username, with the dot indicating the nested array. This
    notation is used for all Session helper methods wherever a $key is
    used.

    .. note::

        If you have ``Session.start`` set to false in your config/core.php,
        you need to call ``$session->activate();`` in your view before you
        can use any other method of Session helper. Just like you need to
        call ``$this->Session->activate();`` in your controller to activate
        Session component.

    .. todo::

        Review this section, its kind of pointless right now.

.. php:method:: read($key)

    Read from the Session. Returns a string or array depending on the
    contents of the session.

.. php:method:: id()

    Returns the current session ID.

.. php:method:: check($key)

    Check to see if a key is in the Session. Returns a boolean on the
    key's existence.

.. php:method:: flash($key, $options = array())

    The flash method uses the default key set by ``setFlash()``. You
    can also retrieve specific keys in the session. For example, the
    Auth component sets all of its Session messages under the 'auth'
    key::

         <?php
        // Controller code
        $this->Session->setFlash('My Message');
    
        // In view
        echo $this->Session->flash();
        // outputs "<div id='flashMessage' class='message'>My Message</div>"
    
        // output the AuthComponent Session message, if set.
        echo $this->Session->flash('auth');

.. php:method:: error()

    Returns the last error in the session if one exists.

Using Flash for Success and Failure
-----------------------------------

In some web sites, particularly administration backoffice web
applications it is often expected that the result of an operation
requested by the user has associated feedback as to whether the
operation succeeded or not. This is a classic usage for the flash
mechanism since we only want to show the user the result once and
not keep the message.

One way to achieve this is to use Session->flash() with the layout
parameter. With the layout parameter we can be in control of the
resultant html for the message.

In the controller you might typically have code::

    <?php
    if ($user_was_deleted) {
        $this->Session->setFlash('The user was deleted successfully.', 'flash_success');
    } else {
        $this->Session->setFlash('The user could not be deleted.', 'flash_failure');
    }

The flash\_success and flash\_failure parameter represents an
element file to place in the root app/views/elements folder, e.g.
app/views/elements/flash\_success.ctp,
app/views/elements/flash\_failure.ctp

Inside the flash\_success element file would be something like
this::

    <div class="flash flash_success">
        <?php echo $message ?>
    </div>

The final step is in your main view file where the result is to be
displayed to add simply::

    <?php echo $this->Session->flash(); ?>

And of course you can then add to your CSS a selector for
div.flash, div.flash\_success and div.flash\_failure