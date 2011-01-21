11.2.9 Logout
-------------

Now onto the logout. Earlier we left this function blank, now is
the time to fill it. In ``UsersController::logout()`` add the
following:

::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

This sets a Session flash message and logs out the User using
Auth's logout method. Auth's logout method basically deletes the
Auth Session Key and returns a url that can be used in a redirect.
If there is other session data that needs to be deleted as well add
that code here.

11.2.9 Logout
-------------

Now onto the logout. Earlier we left this function blank, now is
the time to fill it. In ``UsersController::logout()`` add the
following:

::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

This sets a Session flash message and logs out the User using
Auth's logout method. Auth's logout method basically deletes the
Auth Session Key and returns a url that can be used in a redirect.
If there is other session data that needs to be deleted as well add
that code here.
