11.2.8 Logging in
-----------------

Our application is now under access control, and any attempt to
view non-public pages will redirect you to the login page. However,
we will need to create a login view before anyone can login. Add
the following to ``app/views/users/login.ctp`` if you haven't done
so already.

::

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');
    ?>


#. ``<h2>Login</h2>``
#. ``<?php``
#. ``echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));``
#. ``echo $this->Form->input('User.username');``
#. ``echo $this->Form->input('User.password');``
#. ``echo $this->Form->end('Login');``
#. ``?>``

If a user is already logged in, redirect him by adding this to your
UsersController:

::

    function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            $this->redirect('/', null, false);
        }
    }       


#. ``function login() {``
#. ``if ($this->Session->read('Auth.User')) {``
#. ``$this->Session->setFlash('You are logged in!');``
#. ``$this->redirect('/', null, false);``
#. ``}``
#. ``}``

You may also want to add a flash() for Auth messages to your
layout. Copy the default core layout - found at
``cake/libs/view/layouts/default.ctp`` - to your app layouts folder
if you haven't done so already. In
``app/views/layouts/default.ctp`` add

::

    echo $this->Session->flash('auth');


#. ``echo $this->Session->flash('auth');``

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be
displayed if you added the ``echo $this->Session->flash('auth')``

11.2.8 Logging in
-----------------

Our application is now under access control, and any attempt to
view non-public pages will redirect you to the login page. However,
we will need to create a login view before anyone can login. Add
the following to ``app/views/users/login.ctp`` if you haven't done
so already.

::

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');
    ?>


#. ``<h2>Login</h2>``
#. ``<?php``
#. ``echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));``
#. ``echo $this->Form->input('User.username');``
#. ``echo $this->Form->input('User.password');``
#. ``echo $this->Form->end('Login');``
#. ``?>``

If a user is already logged in, redirect him by adding this to your
UsersController:

::

    function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            $this->redirect('/', null, false);
        }
    }       


#. ``function login() {``
#. ``if ($this->Session->read('Auth.User')) {``
#. ``$this->Session->setFlash('You are logged in!');``
#. ``$this->redirect('/', null, false);``
#. ``}``
#. ``}``

You may also want to add a flash() for Auth messages to your
layout. Copy the default core layout - found at
``cake/libs/view/layouts/default.ctp`` - to your app layouts folder
if you haven't done so already. In
``app/views/layouts/default.ctp`` add

::

    echo $this->Session->flash('auth');


#. ``echo $this->Session->flash('auth');``

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be
displayed if you added the ``echo $this->Session->flash('auth')``
