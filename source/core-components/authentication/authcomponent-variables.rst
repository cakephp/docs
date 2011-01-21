5.2.6 AuthComponent Variables
-----------------------------

Now, there are several Auth-related variables that you can use as
well. Usually you add these settings in your Controller's
beforeFilter() method. Or, if you need to apply such settings
site-wide, you would add them to App Controller's beforeFilter()

userModel
~~~~~~~~~

Don't want to use a User model to authenticate against? No problem,
just change it by setting this value to the name of the model you
want to use.

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>


#. ``<?php``
#. ``$this->Auth->userModel = 'Member';``
#. ``?>``

fields
~~~~~~

Overrides the default username and password fields used for
authentication.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>


#. ``<?php``
#. ``$this->Auth->fields = array('username' => 'email', 'password' => 'passwd');``
#. ``?>``

userScope
~~~~~~~~~

Use this to provide additional requirements for authentication to
succeed.

::

    <?php
        $this->Auth->userScope = array('User.active' => true);
    ?>


#. ``<?php``
#. ``$this->Auth->userScope = array('User.active' => true);``
#. ``?>``

loginAction
~~~~~~~~~~~

You can change the default login from */users/login* to be any
action of your choice.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');
    ?>


#. ``<?php``
#. ``$this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');``
#. ``?>``

loginRedirect
~~~~~~~~~~~~~

The AuthComponent remembers what controller/action pair you were
trying to get to before you were asked to authenticate yourself by
storing this value in the Session, under the ``Auth.redirect`` key.
However, if this session value is not set (if you're coming to the
login page from an external link, for example), then the user will
be redirected to the URL specified in loginRedirect.

Example:

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');
    ?>


#. ``<?php``
#. ``$this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');``
#. ``?>``

logoutRedirect
~~~~~~~~~~~~~~

You can also specify where you want the user to go after they are
logged out, with the default being the login action.

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>


#. ``<?php``
#. ``$this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');``
#. ``?>``

loginError
~~~~~~~~~~

Change the default error message displayed when someone does not
successfully log in.

::

    <?php
        $this->Auth->loginError = "No, you fool!  That's not the right password!";
    ?>


#. ``<?php``
#. ``$this->Auth->loginError = "No, you fool!  That's not the right password!";``
#. ``?>``

authError
~~~~~~~~~

Change the default error message displayed when someone attempts to
access an object or action to which they do not have access.

::

    <?php
        $this->Auth->authError = "Sorry, you are lacking access.";
    ?>


#. ``<?php``
#. ``$this->Auth->authError = "Sorry, you are lacking access.";``
#. ``?>``

autoRedirect
~~~~~~~~~~~~

Normally, the AuthComponent will automatically redirect you as soon
as it authenticates. Sometimes you want to do some more checking
before you redirect users:

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }
    
        ...
    
        function login() {
        //-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).
            if ($this->Auth->user()) {
                if (!empty($this->data['User']['remember_me'])) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Clear auth message, just in case we use it.
                        $this->Session->delete('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>


#. ``<?php``
#. ``function beforeFilter() {``
#. ``...``
#. ``$this->Auth->autoRedirect = false;``
#. ``}``
#. ``...``
#. ``function login() {``
#. ``//-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).``
#. ``if ($this->Auth->user()) {``
#. ``if (!empty($this->data['User']['remember_me'])) {``
#. ``$cookie = array();``
#. ``$cookie['username'] = $this->data['User']['username'];``
#. ``$cookie['password'] = $this->data['User']['password'];``
#. ``$this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');``
#. ``unset($this->data['User']['remember_me']);``
#. ``}``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``if (empty($this->data)) {``
#. ``$cookie = $this->Cookie->read('Auth.User');``
#. ``if (!is_null($cookie)) {``
#. ``if ($this->Auth->login($cookie)) {``
#. ``//  Clear auth message, just in case we use it.``
#. ``$this->Session->delete('Message.auth');``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

The code in the login function will not execute *unless* you set
$autoRedirect to false in a beforeFilter. The code present in the
login function will only execute *after* authentication was
attempted. This is the best place to determine whether or not a
successful login occurred by the AuthComponent (should you desire
to log the last successful login timestamp, etc.).

With autoRedirect set to false, you can also inject additional code
such as keeping track of the last successful login timestamp

::

    <?php
        function login() { 
            if( !(empty($this->data)) && $this->Auth->user() ){
                $this->User->id = $this->Auth->user('id');
                $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                $this->redirect($this->Auth->redirect());
            }
        }
    ?>


#. ``<?php``
#. ``function login() {``
#. ``if( !(empty($this->data)) && $this->Auth->user() ){``
#. ``$this->User->id = $this->Auth->user('id');``
#. ``$this->User->saveField('last_login', date('Y-m-d H:i:s') );``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``}``
#. ``?>``

authorize
~~~~~~~~~

Normally, the AuthComponent will attempt to verify that the login
credentials you've entered are accurate by comparing them to what's
been stored in your user model. However, there are times where you
might want to do some additional work in determining proper
credentials. By setting this variable to one of several different
values, you can do different things. Here are some of the more
common ones you might want to use.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'controller';``
#. ``?>``

When authorize is set to 'controller', you'll need to add a method
called isAuthorized() to your controller. This method allows you to
do some more authentication checks and then return either true or
false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } else {
                    return false;
                }
            }
    
            return true;
        }
    ?>


#. ``<?php``
#. ``function isAuthorized() {``
#. ``if ($this->action == 'delete') {``
#. ``if ($this->Auth->user('role') == 'admin') {``
#. ``return true;``
#. ``} else {``
#. ``return false;``
#. ``}``
#. ``}``
#. ``return true;``
#. ``}``
#. ``?>``

Remember that this method will be checked after you have already
passed the basic authentication check against the user model.

::

    <?php
        $this->Auth->authorize = array('model'=>'User');
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = array('model'=>'User');``
#. ``?>``

Don't want to add anything to your controller and might be using
ACO's? You can get the AuthComponent to call a method in your user
model called isAuthorized() to do the same sort of thing:

::

    <?php
        class User extends AppModel {
            ...
    
            function isAuthorized($user, $controller, $action) {
    
                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>


#. ``<?php``
#. ``class User extends AppModel {``
#. ``...``
#. ``function isAuthorized($user, $controller, $action) {``
#. ``switch ($action) {``
#. ``case 'default':``
#. ``return false;``
#. ``break;``
#. ``case 'delete':``
#. ``if ($user['User']['role'] == 'admin') {``
#. ``return true;``
#. ``}``
#. ``break;``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

Lastly, you can use authorize with actions such as below

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'actions';``
#. ``?>``

By using actions, Auth will make use of ACL and check with
AclComponent::check(). An isAuthorized function is not needed.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'crud';``
#. ``?>``

By using crud, Auth will make use of ACL and check with
AclComponent::check(). Actions should be mapped to CRUD (see
`mapActions <http://book.cakephp.org/view/1260/mapActions>`_).

sessionKey
~~~~~~~~~~

Name of the session array key where the record of the current
authed user is stored.

Defaults to "Auth", so if unspecified, the record is stored in
"Auth.{$userModel name}".

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>


#. ``<?php``
#. ``$this->Auth->sessionKey = 'Authorized';``
#. ``?>``

ajaxLogin
~~~~~~~~~

If you are doing Ajax or Javascript based requests that require
authenticated sessions, set this variable to the name of a view
element you would like to be rendered and returned when you have an
invalid or expired session.

As with any part of CakePHP, be sure to take a look at
`AuthComponent class <http://api.cakephp.org/class/auth-component>`_
for a more in-depth look at the AuthComponent.

authenticate
~~~~~~~~~~~~

This variable holds a reference to the object responsible for
hashing passwords if it is necessary to change/override the default
password hashing mechanism. See
`Changing the Encryption Type </view/566/Changing-Encryption-Type>`_
for more info.

actionPath
~~~~~~~~~~

If using action-based access control, this defines how the paths to
action ACO nodes is computed. If, for example, all controller nodes
are nested under an ACO node named 'Controllers', $actionPath
should be set to 'Controllers/'.

flashElement
~~~~~~~~~~~~

In case that you want to have another layout for your
Authentication error message you can define with the flashElement
variable that another element will be used for display.

::

    <?php
        $this->Auth->flashElement    = "message_error";
    ?>


#. ``<?php``
#. ``$this->Auth->flashElement    = "message_error";``
#. ``?>``

5.2.6 AuthComponent Variables
-----------------------------

Now, there are several Auth-related variables that you can use as
well. Usually you add these settings in your Controller's
beforeFilter() method. Or, if you need to apply such settings
site-wide, you would add them to App Controller's beforeFilter()

userModel
~~~~~~~~~

Don't want to use a User model to authenticate against? No problem,
just change it by setting this value to the name of the model you
want to use.

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>


#. ``<?php``
#. ``$this->Auth->userModel = 'Member';``
#. ``?>``

fields
~~~~~~

Overrides the default username and password fields used for
authentication.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>


#. ``<?php``
#. ``$this->Auth->fields = array('username' => 'email', 'password' => 'passwd');``
#. ``?>``

userScope
~~~~~~~~~

Use this to provide additional requirements for authentication to
succeed.

::

    <?php
        $this->Auth->userScope = array('User.active' => true);
    ?>


#. ``<?php``
#. ``$this->Auth->userScope = array('User.active' => true);``
#. ``?>``

loginAction
~~~~~~~~~~~

You can change the default login from */users/login* to be any
action of your choice.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');
    ?>


#. ``<?php``
#. ``$this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');``
#. ``?>``

loginRedirect
~~~~~~~~~~~~~

The AuthComponent remembers what controller/action pair you were
trying to get to before you were asked to authenticate yourself by
storing this value in the Session, under the ``Auth.redirect`` key.
However, if this session value is not set (if you're coming to the
login page from an external link, for example), then the user will
be redirected to the URL specified in loginRedirect.

Example:

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');
    ?>


#. ``<?php``
#. ``$this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');``
#. ``?>``

logoutRedirect
~~~~~~~~~~~~~~

You can also specify where you want the user to go after they are
logged out, with the default being the login action.

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>


#. ``<?php``
#. ``$this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');``
#. ``?>``

loginError
~~~~~~~~~~

Change the default error message displayed when someone does not
successfully log in.

::

    <?php
        $this->Auth->loginError = "No, you fool!  That's not the right password!";
    ?>


#. ``<?php``
#. ``$this->Auth->loginError = "No, you fool!  That's not the right password!";``
#. ``?>``

authError
~~~~~~~~~

Change the default error message displayed when someone attempts to
access an object or action to which they do not have access.

::

    <?php
        $this->Auth->authError = "Sorry, you are lacking access.";
    ?>


#. ``<?php``
#. ``$this->Auth->authError = "Sorry, you are lacking access.";``
#. ``?>``

autoRedirect
~~~~~~~~~~~~

Normally, the AuthComponent will automatically redirect you as soon
as it authenticates. Sometimes you want to do some more checking
before you redirect users:

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }
    
        ...
    
        function login() {
        //-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).
            if ($this->Auth->user()) {
                if (!empty($this->data['User']['remember_me'])) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Clear auth message, just in case we use it.
                        $this->Session->delete('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>


#. ``<?php``
#. ``function beforeFilter() {``
#. ``...``
#. ``$this->Auth->autoRedirect = false;``
#. ``}``
#. ``...``
#. ``function login() {``
#. ``//-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).``
#. ``if ($this->Auth->user()) {``
#. ``if (!empty($this->data['User']['remember_me'])) {``
#. ``$cookie = array();``
#. ``$cookie['username'] = $this->data['User']['username'];``
#. ``$cookie['password'] = $this->data['User']['password'];``
#. ``$this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');``
#. ``unset($this->data['User']['remember_me']);``
#. ``}``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``if (empty($this->data)) {``
#. ``$cookie = $this->Cookie->read('Auth.User');``
#. ``if (!is_null($cookie)) {``
#. ``if ($this->Auth->login($cookie)) {``
#. ``//  Clear auth message, just in case we use it.``
#. ``$this->Session->delete('Message.auth');``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

The code in the login function will not execute *unless* you set
$autoRedirect to false in a beforeFilter. The code present in the
login function will only execute *after* authentication was
attempted. This is the best place to determine whether or not a
successful login occurred by the AuthComponent (should you desire
to log the last successful login timestamp, etc.).

With autoRedirect set to false, you can also inject additional code
such as keeping track of the last successful login timestamp

::

    <?php
        function login() { 
            if( !(empty($this->data)) && $this->Auth->user() ){
                $this->User->id = $this->Auth->user('id');
                $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                $this->redirect($this->Auth->redirect());
            }
        }
    ?>


#. ``<?php``
#. ``function login() {``
#. ``if( !(empty($this->data)) && $this->Auth->user() ){``
#. ``$this->User->id = $this->Auth->user('id');``
#. ``$this->User->saveField('last_login', date('Y-m-d H:i:s') );``
#. ``$this->redirect($this->Auth->redirect());``
#. ``}``
#. ``}``
#. ``?>``

authorize
~~~~~~~~~

Normally, the AuthComponent will attempt to verify that the login
credentials you've entered are accurate by comparing them to what's
been stored in your user model. However, there are times where you
might want to do some additional work in determining proper
credentials. By setting this variable to one of several different
values, you can do different things. Here are some of the more
common ones you might want to use.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'controller';``
#. ``?>``

When authorize is set to 'controller', you'll need to add a method
called isAuthorized() to your controller. This method allows you to
do some more authentication checks and then return either true or
false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } else {
                    return false;
                }
            }
    
            return true;
        }
    ?>


#. ``<?php``
#. ``function isAuthorized() {``
#. ``if ($this->action == 'delete') {``
#. ``if ($this->Auth->user('role') == 'admin') {``
#. ``return true;``
#. ``} else {``
#. ``return false;``
#. ``}``
#. ``}``
#. ``return true;``
#. ``}``
#. ``?>``

Remember that this method will be checked after you have already
passed the basic authentication check against the user model.

::

    <?php
        $this->Auth->authorize = array('model'=>'User');
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = array('model'=>'User');``
#. ``?>``

Don't want to add anything to your controller and might be using
ACO's? You can get the AuthComponent to call a method in your user
model called isAuthorized() to do the same sort of thing:

::

    <?php
        class User extends AppModel {
            ...
    
            function isAuthorized($user, $controller, $action) {
    
                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>


#. ``<?php``
#. ``class User extends AppModel {``
#. ``...``
#. ``function isAuthorized($user, $controller, $action) {``
#. ``switch ($action) {``
#. ``case 'default':``
#. ``return false;``
#. ``break;``
#. ``case 'delete':``
#. ``if ($user['User']['role'] == 'admin') {``
#. ``return true;``
#. ``}``
#. ``break;``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

Lastly, you can use authorize with actions such as below

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'actions';``
#. ``?>``

By using actions, Auth will make use of ACL and check with
AclComponent::check(). An isAuthorized function is not needed.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>


#. ``<?php``
#. ``$this->Auth->authorize = 'crud';``
#. ``?>``

By using crud, Auth will make use of ACL and check with
AclComponent::check(). Actions should be mapped to CRUD (see
`mapActions <http://book.cakephp.org/view/1260/mapActions>`_).

sessionKey
~~~~~~~~~~

Name of the session array key where the record of the current
authed user is stored.

Defaults to "Auth", so if unspecified, the record is stored in
"Auth.{$userModel name}".

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>


#. ``<?php``
#. ``$this->Auth->sessionKey = 'Authorized';``
#. ``?>``

ajaxLogin
~~~~~~~~~

If you are doing Ajax or Javascript based requests that require
authenticated sessions, set this variable to the name of a view
element you would like to be rendered and returned when you have an
invalid or expired session.

As with any part of CakePHP, be sure to take a look at
`AuthComponent class <http://api.cakephp.org/class/auth-component>`_
for a more in-depth look at the AuthComponent.

authenticate
~~~~~~~~~~~~

This variable holds a reference to the object responsible for
hashing passwords if it is necessary to change/override the default
password hashing mechanism. See
`Changing the Encryption Type </view/566/Changing-Encryption-Type>`_
for more info.

actionPath
~~~~~~~~~~

If using action-based access control, this defines how the paths to
action ACO nodes is computed. If, for example, all controller nodes
are nested under an ACO node named 'Controllers', $actionPath
should be set to 'Controllers/'.

flashElement
~~~~~~~~~~~~

In case that you want to have another layout for your
Authentication error message you can define with the flashElement
variable that another element will be used for display.

::

    <?php
        $this->Auth->flashElement    = "message_error";
    ?>


#. ``<?php``
#. ``$this->Auth->flashElement    = "message_error";``
#. ``?>``
