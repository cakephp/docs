5.2.5 AuthComponent Methods
---------------------------

action
~~~~~~

``action (string $action = ':controller/:action')``

If you are using ACO's as part of your ACL structure, you can get
the path to the ACO node bound to a particular controller/action
pair:

::

        $acoNode = $this->Auth->action('users/delete');

If you don't pass in any values, it uses the current controller /
action pair

allow
~~~~~

If you have some actions in your controller that you don't have to
authenticate against (such as a user registration action), you can
add methods that the AuthComponent should ignore. The following
example shows how to allow an action named 'register'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('register');
        }

If you wish to allow multiple actions to skip authentication, you
supply them as parameters to the allow() method:

::

        function beforeFilter() {
            ...
            $this->Auth->allow('foo', 'bar', 'baz');
        }

Shortcut: you may also allow all the actions in a controller by
using '\*'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('*');
        }

If you are using requestAction in your layout or elements you
should allow those actions in order to be able to open login page
properly.

The auth component assumes that your actions names
`follow conventions </view/905/URL-Considerations-for-Controller-Names>`_
and are underscored.

deny
~~~~

There may be times where you will want to remove actions from the
list of allowed actions (set using $this->Auth->allow()). Here's an
example:

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }
    
        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }
    
            ...
        }

hashPasswords
~~~~~~~~~~~~~

``hashPasswords ($data)``

This method checks if the ``$data`` contains the username and
password fields as specified by the variable ``$fields`` indexed by
the model name as specified by ``$userModel``. If the ``$data``
array contains both the username and password, it hashes the
password field in the array and returns the ``data`` array in the
same format. This function should be used prior to insert or update
calls of the user when the password field is affected.

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        pr($hashedPasswords);
        /* returns:
        Array
        (
            [User] => Array
            (
                [username] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )
    
        */

The *$hashedPasswords['User']['password']* field would now be
hashed using the ``password`` function of the component.

If your controller uses the Auth component and posted data contains
the fields as explained above, it will automatically hash the
password field using this function.

mapActions
~~~~~~~~~~

If you are using Acl in CRUD mode, you may want to assign certain
non-default actions to each part of CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('someAction'),
            'read' => array('someAction', 'someAction2'),
            'update' => array('someAction'),
            'delete' => array('someAction')
        )
    );

login
~~~~~

``login($data = null)``

If you are doing some sort of Ajax-based login, you can use this
method to manually log someone into the system. If you don't pass
any value for ``$data``, it will automatically use POST data passed
into the controller.

for example, in an application you may wish to assign a user a
password and auto log them in after registration. In an over
simplified example:

View:
::

    echo $this->Form->create('User',array('action'=>'register'));
    echo $this->Form->input('username');
    echo $this->Form->end('Register');

Controller:
::

    function register() {
        if(!empty($this->data)) {
            $this->User->create();
            $assigned_password = 'password';
            $this->data['User']['password'] = $assigned_password;
            if($this->User->save($this->data)) {
                // send signup email containing password to the user
                $this->Auth->login($this->data);
                $this->redirect('home');
        }
    }

One thing to note is that you must manually redirect the user after
login as loginRedirect is not called.

``$this->Auth->login($data)`` returns 1 on successful login, 0 on a
failure

logout
~~~~~~

Provides a quick way to de-authenticate someone, and redirect them
to where they need to go. This method is also useful if you want to
provide a 'Log me out' link inside a members' area of your
application.

Example:

::

    $this->redirect($this->Auth->logout());

password
~~~~~~~~

``password (string $password)``

Pass in a string, and you can get what the hashed password would
look like. This is an essential functionality if you are creating a
user registration screen where you have users enter their password
a second time to confirm it.

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {
    
        // Passwords match, continue processing
        ...
    } else {
        $this->flash('Typed passwords did not match', 'users/register');
    }

The auth component will automatically hash the password field if
the username field is also present in the submitted data

Cake appends your password string to a salt value and then hashes
it. The hashing function used depends on the one set by the core
utility class ``Security`` (sha1 by default). You can use the
``Security::setHash`` function to change the hashing method. The
salt value is used from your application's configuration defined in
your ``core.php``

user
~~~~

``user(string $key = null)``

This method provides information about the currently authenticated
user. The information is taken from the session. For example:

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('You have admin access');
    }

It can also be used to return the whole user session data like so:

::

    $data['User'] = $this->Auth->user();

If this method returns null, the user is not logged in.

In the view you can use the Session helper to retrieve the
currently authenticated user's information:

::

    $session->read('Auth.User'); // returns complete user record
    $session->read('Auth.User.first_name') //returns particular field value

The session key can be different depending on which model Auth is
configured to use. Eg. If you use model ``Account`` instead of
``User``, then the session key would be ``Auth.Account``

5.2.5 AuthComponent Methods
---------------------------

action
~~~~~~

``action (string $action = ':controller/:action')``

If you are using ACO's as part of your ACL structure, you can get
the path to the ACO node bound to a particular controller/action
pair:

::

        $acoNode = $this->Auth->action('users/delete');

If you don't pass in any values, it uses the current controller /
action pair

allow
~~~~~

If you have some actions in your controller that you don't have to
authenticate against (such as a user registration action), you can
add methods that the AuthComponent should ignore. The following
example shows how to allow an action named 'register'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('register');
        }

If you wish to allow multiple actions to skip authentication, you
supply them as parameters to the allow() method:

::

        function beforeFilter() {
            ...
            $this->Auth->allow('foo', 'bar', 'baz');
        }

Shortcut: you may also allow all the actions in a controller by
using '\*'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('*');
        }

If you are using requestAction in your layout or elements you
should allow those actions in order to be able to open login page
properly.

The auth component assumes that your actions names
`follow conventions </view/905/URL-Considerations-for-Controller-Names>`_
and are underscored.

deny
~~~~

There may be times where you will want to remove actions from the
list of allowed actions (set using $this->Auth->allow()). Here's an
example:

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }
    
        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }
    
            ...
        }

hashPasswords
~~~~~~~~~~~~~

``hashPasswords ($data)``

This method checks if the ``$data`` contains the username and
password fields as specified by the variable ``$fields`` indexed by
the model name as specified by ``$userModel``. If the ``$data``
array contains both the username and password, it hashes the
password field in the array and returns the ``data`` array in the
same format. This function should be used prior to insert or update
calls of the user when the password field is affected.

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        pr($hashedPasswords);
        /* returns:
        Array
        (
            [User] => Array
            (
                [username] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )
    
        */

The *$hashedPasswords['User']['password']* field would now be
hashed using the ``password`` function of the component.

If your controller uses the Auth component and posted data contains
the fields as explained above, it will automatically hash the
password field using this function.

mapActions
~~~~~~~~~~

If you are using Acl in CRUD mode, you may want to assign certain
non-default actions to each part of CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('someAction'),
            'read' => array('someAction', 'someAction2'),
            'update' => array('someAction'),
            'delete' => array('someAction')
        )
    );

login
~~~~~

``login($data = null)``

If you are doing some sort of Ajax-based login, you can use this
method to manually log someone into the system. If you don't pass
any value for ``$data``, it will automatically use POST data passed
into the controller.

for example, in an application you may wish to assign a user a
password and auto log them in after registration. In an over
simplified example:

View:
::

    echo $this->Form->create('User',array('action'=>'register'));
    echo $this->Form->input('username');
    echo $this->Form->end('Register');

Controller:
::

    function register() {
        if(!empty($this->data)) {
            $this->User->create();
            $assigned_password = 'password';
            $this->data['User']['password'] = $assigned_password;
            if($this->User->save($this->data)) {
                // send signup email containing password to the user
                $this->Auth->login($this->data);
                $this->redirect('home');
        }
    }

One thing to note is that you must manually redirect the user after
login as loginRedirect is not called.

``$this->Auth->login($data)`` returns 1 on successful login, 0 on a
failure

logout
~~~~~~

Provides a quick way to de-authenticate someone, and redirect them
to where they need to go. This method is also useful if you want to
provide a 'Log me out' link inside a members' area of your
application.

Example:

::

    $this->redirect($this->Auth->logout());

password
~~~~~~~~

``password (string $password)``

Pass in a string, and you can get what the hashed password would
look like. This is an essential functionality if you are creating a
user registration screen where you have users enter their password
a second time to confirm it.

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {
    
        // Passwords match, continue processing
        ...
    } else {
        $this->flash('Typed passwords did not match', 'users/register');
    }

The auth component will automatically hash the password field if
the username field is also present in the submitted data

Cake appends your password string to a salt value and then hashes
it. The hashing function used depends on the one set by the core
utility class ``Security`` (sha1 by default). You can use the
``Security::setHash`` function to change the hashing method. The
salt value is used from your application's configuration defined in
your ``core.php``

user
~~~~

``user(string $key = null)``

This method provides information about the currently authenticated
user. The information is taken from the session. For example:

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('You have admin access');
    }

It can also be used to return the whole user session data like so:

::

    $data['User'] = $this->Auth->user();

If this method returns null, the user is not logged in.

In the view you can use the Session helper to retrieve the
currently authenticated user's information:

::

    $session->read('Auth.User'); // returns complete user record
    $session->read('Auth.User.first_name') //returns particular field value

The session key can be different depending on which model Auth is
configured to use. Eg. If you use model ``Account`` instead of
``User``, then the session key would be ``Auth.Account``
