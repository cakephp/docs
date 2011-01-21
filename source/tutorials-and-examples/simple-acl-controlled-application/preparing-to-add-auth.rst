11.2.2 Preparing to Add Auth
----------------------------

We now have a functioning CRUD application. Bake should have setup
all the relations we need, if not add them in now. There are a few
other pieces that need to be added before we can add the Auth and
Acl components. First add a login and logout action to your
``UsersController``.

::

    function login() {
        //Auth Magic
    }
     
    function logout() {
        //Leave empty for now.
    }

Then create the following view file for login at
app/views/users/login.ctp:

::

    <?php
    $this->Session->flash('auth');
    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login', true),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');
    ?>

We don't need to worry about adding anything to hash passwords, as
AuthComponent will do this for us automatically when
creating/editing users, and when they login, once configured
properly. Furthermore, if you hash incoming passwords manually
``AuthComponent`` will not be able to log you in at all. As it will
hash them again, and they will not match.

Next we need to make some modifications to ``AppController``. If
you don't have ``/app/app_controller.php``, create it. Note that
this goes in /app/, not /app/controllers/. Since we want our entire
site controlled with Auth and Acl, we will set them up in
``AppController``.
::

    <?php
    class AppController extends Controller {
        var $components = array('Acl', 'Auth', 'Session');
        var $helpers = array('Html', 'Form', 'Session');
    
        function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }
    ?>

Before we set up the ACL at all we will need to add some users and
groups. With ``AuthComponent`` in use we will not be able to access
any of our actions, as we are not logged in. We will now add some
exceptions so ``AuthComponent`` will allow us to create some groups
and users. In **both** your ``GroupsController`` and your
``UsersController`` Add the following.

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allow(array('*'));
    }

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a
few users and groups into our database. Don't add any users or
groups just yet though.

11.2.2 Preparing to Add Auth
----------------------------

We now have a functioning CRUD application. Bake should have setup
all the relations we need, if not add them in now. There are a few
other pieces that need to be added before we can add the Auth and
Acl components. First add a login and logout action to your
``UsersController``.

::

    function login() {
        //Auth Magic
    }
     
    function logout() {
        //Leave empty for now.
    }

Then create the following view file for login at
app/views/users/login.ctp:

::

    <?php
    $this->Session->flash('auth');
    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login', true),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');
    ?>

We don't need to worry about adding anything to hash passwords, as
AuthComponent will do this for us automatically when
creating/editing users, and when they login, once configured
properly. Furthermore, if you hash incoming passwords manually
``AuthComponent`` will not be able to log you in at all. As it will
hash them again, and they will not match.

Next we need to make some modifications to ``AppController``. If
you don't have ``/app/app_controller.php``, create it. Note that
this goes in /app/, not /app/controllers/. Since we want our entire
site controlled with Auth and Acl, we will set them up in
``AppController``.
::

    <?php
    class AppController extends Controller {
        var $components = array('Acl', 'Auth', 'Session');
        var $helpers = array('Html', 'Form', 'Session');
    
        function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }
    ?>

Before we set up the ACL at all we will need to add some users and
groups. With ``AuthComponent`` in use we will not be able to access
any of our actions, as we are not logged in. We will now add some
exceptions so ``AuthComponent`` will allow us to create some groups
and users. In **both** your ``GroupsController`` and your
``UsersController`` Add the following.

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allow(array('*'));
    }

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a
few users and groups into our database. Don't add any users or
groups just yet though.
