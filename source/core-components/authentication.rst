5.2 Authentication
------------------

User authentication systems are a common part of many web
applications. In CakePHP there are several systems for
authenticating users, each of which provides different options. At
its core the authentication component will check to see if a user
has an account with a site. If they do, the component will give
access to that user to the complete site.

This component can be combined with the ACL (access control lists)
component to create more complex levels of access within a site.
The ACL Component, for example, could allow you to grant one user
access to public site areas, while granting another user access to
protected administrative portions of the site.

CakePHP's AuthComponent can be used to create such a system easily
and quickly. Let's take a look at how you would build a very simple
authentication system.

Like all components, you use it by adding 'Auth' to the list of
components in your controller:

::

    class FooController extends AppController {
        var $components = array('Auth');


#. ``class FooController extends AppController {``
#. ``var $components = array('Auth');``

Or add it to your AppController so all of your controllers will use
it:

::

    class AppController extends Controller {
        // AppController's components are NOT merged with defaults,
        // so session component is lost if it's not included here!
        var $components = array('Auth', 'Session');


#. ``class AppController extends Controller {``
#. ``// AppController's components are NOT merged with defaults,``
#. ``// so session component is lost if it's not included here!``
#. ``var $components = array('Auth', 'Session');``

Now, there are a few conventions to think about when using
AuthComponent. By default, the AuthComponent expects you to have a
table called 'users' with fields called 'username' and 'password'
to be used.

In some situations, databases don't let you use 'password' as a
column name. See
`Setting Auth Component Variables </view/1251/Setting-Auth-Component-Variables>`_
for an example how to change the default field names to work with
your own environment.

Let's set up our users table using the following SQL:

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(40),
        PRIMARY KEY (id)
    );


#. ``CREATE TABLE users (``
#. ``id integer auto_increment,``
#. ``username char(50),``
#. ``password char(40),``
#. ``PRIMARY KEY (id)``
#. ``);``

Something to keep in mind when creating a table to store all your
user authentication data is that the AuthComponent expects the
password value stored in the database to be hashed instead of being
stored in plaintext. Make sure that the field you will be using to
store passwords is long enough to store the hash (40 characters for
SHA1, for example).

If you want to add a user manually to the database, the simplest
method to get the right data is to attempt to log in and look at
the SQL log.

For the most basic setup, you'll only need to create two actions in
your controller:

::

    class UsersController extends AppController {
    
        var $name = 'Users';    
        var $components = array('Auth'); // Not necessary if declared in your app controller
     
        /**
         *  The AuthComponent provides the needed functionality
         *  for login, so you can leave this function blank.
         */
        function login() {
        }
    
        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }


#. ``class UsersController extends AppController {``
#. ``var $name = 'Users';``
#. ``var $components = array('Auth'); // Not necessary if declared in your app controller``
#. ````
#. ``/**``
#. ``*  The AuthComponent provides the needed functionality``
#. ``*  for login, so you can leave this function blank.``
#. ``*/``
#. ``function login() {``
#. ``}``
#. ``function logout() {``
#. ``$this->redirect($this->Auth->logout());``
#. ``}``
#. ``}``

While you can leave the login() function blank, you do need to
create the login view template (saved in
app/views/users/login.ctp). This is the only UsersController view
template you need to create, however. The example below assumes you
are already using the Form helper:

::

    <?php
        echo $session->flash('auth');
        echo $this->Form->create('User', array('action' => 'login'));
        echo $this->Form->input('username');
        echo $this->Form->input('password');
        echo $this->Form->end('Login');
    ?>


#. ``<?php``
#. ``echo $session->flash('auth');``
#. ``echo $this->Form->create('User', array('action' => 'login'));``
#. ``echo $this->Form->input('username');``
#. ``echo $this->Form->input('password');``
#. ``echo $this->Form->end('Login');``
#. ``?>``

This view creates a simple login form where you enter a username
and password. Once you submit this form, the AuthComponent takes
care of the rest for you. The session flash message will display
any notices generated by the AuthComponent. Upon successful login
the database record of the current logged in user is saved to
session.

Believe it or not, we're done! That's how to implement an
incredibly simple, database-driven authentication system using the
Auth component. However, there is a lot more we can do. Let's take
a look at some more advanced usage of the component.

5.2 Authentication
------------------

User authentication systems are a common part of many web
applications. In CakePHP there are several systems for
authenticating users, each of which provides different options. At
its core the authentication component will check to see if a user
has an account with a site. If they do, the component will give
access to that user to the complete site.

This component can be combined with the ACL (access control lists)
component to create more complex levels of access within a site.
The ACL Component, for example, could allow you to grant one user
access to public site areas, while granting another user access to
protected administrative portions of the site.

CakePHP's AuthComponent can be used to create such a system easily
and quickly. Let's take a look at how you would build a very simple
authentication system.

Like all components, you use it by adding 'Auth' to the list of
components in your controller:

::

    class FooController extends AppController {
        var $components = array('Auth');


#. ``class FooController extends AppController {``
#. ``var $components = array('Auth');``

Or add it to your AppController so all of your controllers will use
it:

::

    class AppController extends Controller {
        // AppController's components are NOT merged with defaults,
        // so session component is lost if it's not included here!
        var $components = array('Auth', 'Session');


#. ``class AppController extends Controller {``
#. ``// AppController's components are NOT merged with defaults,``
#. ``// so session component is lost if it's not included here!``
#. ``var $components = array('Auth', 'Session');``

Now, there are a few conventions to think about when using
AuthComponent. By default, the AuthComponent expects you to have a
table called 'users' with fields called 'username' and 'password'
to be used.

In some situations, databases don't let you use 'password' as a
column name. See
`Setting Auth Component Variables </view/1251/Setting-Auth-Component-Variables>`_
for an example how to change the default field names to work with
your own environment.

Let's set up our users table using the following SQL:

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(40),
        PRIMARY KEY (id)
    );


#. ``CREATE TABLE users (``
#. ``id integer auto_increment,``
#. ``username char(50),``
#. ``password char(40),``
#. ``PRIMARY KEY (id)``
#. ``);``

Something to keep in mind when creating a table to store all your
user authentication data is that the AuthComponent expects the
password value stored in the database to be hashed instead of being
stored in plaintext. Make sure that the field you will be using to
store passwords is long enough to store the hash (40 characters for
SHA1, for example).

If you want to add a user manually to the database, the simplest
method to get the right data is to attempt to log in and look at
the SQL log.

For the most basic setup, you'll only need to create two actions in
your controller:

::

    class UsersController extends AppController {
    
        var $name = 'Users';    
        var $components = array('Auth'); // Not necessary if declared in your app controller
     
        /**
         *  The AuthComponent provides the needed functionality
         *  for login, so you can leave this function blank.
         */
        function login() {
        }
    
        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }


#. ``class UsersController extends AppController {``
#. ``var $name = 'Users';``
#. ``var $components = array('Auth'); // Not necessary if declared in your app controller``
#. ````
#. ``/**``
#. ``*  The AuthComponent provides the needed functionality``
#. ``*  for login, so you can leave this function blank.``
#. ``*/``
#. ``function login() {``
#. ``}``
#. ``function logout() {``
#. ``$this->redirect($this->Auth->logout());``
#. ``}``
#. ``}``

While you can leave the login() function blank, you do need to
create the login view template (saved in
app/views/users/login.ctp). This is the only UsersController view
template you need to create, however. The example below assumes you
are already using the Form helper:

::

    <?php
        echo $session->flash('auth');
        echo $this->Form->create('User', array('action' => 'login'));
        echo $this->Form->input('username');
        echo $this->Form->input('password');
        echo $this->Form->end('Login');
    ?>


#. ``<?php``
#. ``echo $session->flash('auth');``
#. ``echo $this->Form->create('User', array('action' => 'login'));``
#. ``echo $this->Form->input('username');``
#. ``echo $this->Form->input('password');``
#. ``echo $this->Form->end('Login');``
#. ``?>``

This view creates a simple login form where you enter a username
and password. Once you submit this form, the AuthComponent takes
care of the rest for you. The session flash message will display
any notices generated by the AuthComponent. Upon successful login
the database record of the current logged in user is saved to
session.

Believe it or not, we're done! That's how to implement an
incredibly simple, database-driven authentication system using the
Auth component. However, there is a lot more we can do. Let's take
a look at some more advanced usage of the component.
