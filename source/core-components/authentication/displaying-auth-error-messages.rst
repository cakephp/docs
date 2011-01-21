5.2.2 Displaying Auth Error Messages
------------------------------------

In order to display the error messages that Auth spits out you need
to add the following code to your view. In this case, the message
will appear below the regular flash messages:

In order to show all normal flash messages and auth flash messages
for all views add the following two lines to the
views/layouts/default.ctp file in the body section preferable
before the content\_for\_layout line.

::

    <?php
        echo $session->flash();
        echo $session->flash('auth');
    ?>

To customize the Auth error messages, place the following code in
the AppController or wherever you have placed Auth's settings:
/p
::

    <?php
        $this->Auth->loginError = "This message shows up when the wrong credentials are used";
        $this->Auth->authError = "This error shows up with the user tries to access a part of the website that is protected.";
    ?>

5.2.2 Displaying Auth Error Messages
------------------------------------

In order to display the error messages that Auth spits out you need
to add the following code to your view. In this case, the message
will appear below the regular flash messages:

In order to show all normal flash messages and auth flash messages
for all views add the following two lines to the
views/layouts/default.ctp file in the body section preferable
before the content\_for\_layout line.

::

    <?php
        echo $session->flash();
        echo $session->flash('auth');
    ?>

To customize the Auth error messages, place the following code in
the AppController or wherever you have placed Auth's settings:
/p
::

    <?php
        $this->Auth->loginError = "This message shows up when the wrong credentials are used";
        $this->Auth->authError = "This error shows up with the user tries to access a part of the website that is protected.";
    ?>
