Simple Acl controlled Application - part 2
##########################################

An Automated tool for creating ACOs
===================================

As mentioned before, there is no pre-built way to input all of our
controllers and actions into the Acl. However, we all hate doing
repetitive things like typing in what could be hundreds of actions
in a large application.

For this purpose exists a very handy plugin available on GitHub, called
`AclExtras <https://github.com/markstory/acl_extras/>`_ which can
be downloaded in `The GitHub Downloads page <https://github.com/markstory/acl_extras/zipball/master>`_.
We're going to briefly describe how to use it to generate all our ACO's

First grab a copy of the plugin and unzipped or clone it using git into
`app/Plugin/AclExtras`. Then activate the plugin in your `app/Config/boostrap.php`
file as shown below::

    //app/Config/boostrap.php
    // ...
    CakePlugin::load('AclExtras');

Finally execute the following command in the CakePHP console::


    ./Console/cake AclExtras.AclExtras aco_sync

You can get a complete guide for all available commands like this::

    ./Console/cake AclExtras.AclExtras -h
    ./Console/cake AclExtras.AclExtras aco_sync -h

Once populated your `acos` table proceed to create your application permissions.

Setting up permissions
======================

Creating permissions much like creating ACO's has no magic solution, nor will I
be providing one. To allow ARO's access to ACO's from the shell interface use
the AclShell. For more information on how to use it consult the AclShell help
which can be accessed by running::

    ./Console/cake acl --help

Note: \* needs to be quoted ('\*')

In order to allow with the ``AclComponent`` we would use the
following code syntax in a custom method::

    $this->Acl->allow($aroAlias, $acoAlias);

We are going to add in a few allow/deny statements now. Add the
following to a temporary function in your ``UsersController`` and
visit the address in your browser to run them (e.g.
http://localhost/cake/app/users/initdb). If you do a
``SELECT * FROM aros_acos`` you should see a whole pile of 1's and
-1's. Once you've confirmed your permissions are set, remove the
function::


    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('initDB'); // We can remove this line after we're finished
    }

    public function initDB() {
        $group = $this->User->Group;

        // Allow admins to everything
        $group->id = 1;
        $this->Acl->allow($group, 'controllers');

        // allow managers to posts and widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');

        // allow users to only add and edit on posts and widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
        
        // allow basic users to log out
        $this->Acl->allow($group, 'controllers/users/logout');

        // we add an exit to avoid an ugly "missing views" error message
        echo "all done";
        exit;
    }

We now have set up some basic access rules. We've allowed
administrators to everything. Managers can access everything in
posts and widgets. While users can only access add and edit in
posts & widgets.

We had to get a reference of a ``Group`` model and modify its id to
be able to specify the ARO we wanted, this is due to how
``AclBehavior`` works. ``AclBehavior`` does not set the alias field
in the ``aros`` table so we must use an object reference or an
array to reference the ARO we want.

You may have noticed that I deliberately left out index and view
from my Acl permissions. We are going to make view and index public
actions in ``PostsController`` and ``WidgetsController``. This
allows non-authorized users to view these pages, making them public
pages. However, at any time you can remove these actions from
``AuthComponent::allowedActions`` and the permissions for view and
edit will revert to those in the Acl.

Now we want to take out the references to ``Auth->allowedActions``
in your users and groups controllers. Then add the following to
your posts and widgets controllers::

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

This removes the 'off switches' we put in earlier on the users and
groups controllers, and gives public access on the index and view
actions in posts and widgets controllers. In
``AppController::beforeFilter()`` add the following::

     $this->Auth->allow('display');

This makes the 'display' action public. This will keep our
PagesController::display() public. This is important as often the
default routing has this action as the home page for your
application.

Logging in
==========

Our application is now under access control, and any attempt to
view non-public pages will redirect you to the login page. However,
we will need to create a login view before anyone can login. Add
the following to ``app/View/Users/login.ctp`` if you haven't done
so already:

.. code-block:: php

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array(
        'url' => array(
            'controller' => 'users', 
            'action' => 'login'
        )
    ));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');

If a user is already logged in, redirect him by adding this to your
UsersController::

    public function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            return $this->redirect('/');
        }
    }

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be
displayed if you added the ``echo $this->Session->flash('auth')``

Logout
======

Now onto the logout. Earlier we left this function blank, now is
the time to fill it. In ``UsersController::logout()`` add the
following::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

This sets a Session flash message and logs out the User using
Auth's logout method. Auth's logout method basically deletes the
Auth Session Key and returns a URL that can be used in a redirect.
If there is other session data that needs to be deleted as well add
that code here.

All done
========

You should now have an application controlled by Auth and Acl.
Users permissions are set at the group level, but you can set them
by user at the same time. You can also set permissions on a global
and per-controller and per-action basis. Furthermore, you have a
reusable block of code to easily expand your ACO table as your app
grows.


.. meta::
    :title lang=en: Simple Acl controlled Application - part 2
    :keywords lang=en: shell interface,magic solution,aco,unzipped,config,sync,syntax,cakephp,php,running,acl
