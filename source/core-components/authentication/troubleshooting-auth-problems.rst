5.2.3 Troubleshooting Auth Problems
-----------------------------------

It can sometimes be quite difficult to diagnose problems when it's
not behaving as expected, so here are a few pointers to remember.

*Password hashing*

The automatic hashing of your password input field happens **only**
if posted data contains both username and password fields

When posting information to an action via a form, the Auth
component automatically hashes the contents of your password input
field if posted data also contains username field. So, if you are
trying to create some sort of registration page, make sure to have
the user fill out a 'confirm password' field so that you can
compare the two. Here's some sample code:

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>
