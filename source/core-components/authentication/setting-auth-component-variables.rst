5.2.1 Setting Auth Component Variables
--------------------------------------

Whenever you want to alter a default option for AuthComponent, you
do that by creating a beforeFilter() method for your controller,
and then calling various built-in methods or setting component
variables.

For example, to change the field name used for passwords from
'password' to 'secretword', you would do the following:

::

    class UsersController extends AppController {
        var $components = array('Auth');
    
        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

In this particular situation, you would also need to remember to
change the field name in the view template!

Alternately, you can specify settings for Auth by placing them
inside the controller's $components property.

::

    class AppController extends Controller {
        var $components = array(
            'Auth' => array(
                'authorize' => 'actions',
                'actionPath' => 'controllers/',
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login',
                    'plugin' => false,
                   'admin' => false,
                    ),
                 ),
             'Acl',
             'Session',
             );
    }

Another common use of Auth component variables is to allow access
to certain methods without the user being logged in (by default
Auth restricts access to every action except the login and logout
methods).

For example if we want to allow all users access to the index and
view methods ( but not any other), we would do the following:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }

5.2.1 Setting Auth Component Variables
--------------------------------------

Whenever you want to alter a default option for AuthComponent, you
do that by creating a beforeFilter() method for your controller,
and then calling various built-in methods or setting component
variables.

For example, to change the field name used for passwords from
'password' to 'secretword', you would do the following:

::

    class UsersController extends AppController {
        var $components = array('Auth');
    
        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

In this particular situation, you would also need to remember to
change the field name in the view template!

Alternately, you can specify settings for Auth by placing them
inside the controller's $components property.

::

    class AppController extends Controller {
        var $components = array(
            'Auth' => array(
                'authorize' => 'actions',
                'actionPath' => 'controllers/',
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login',
                    'plugin' => false,
                   'admin' => false,
                    ),
                 ),
             'Acl',
             'Session',
             );
    }

Another common use of Auth component variables is to allow access
to certain methods without the user being logged in (by default
Auth restricts access to every action except the login and logout
methods).

For example if we want to allow all users access to the index and
view methods ( but not any other), we would do the following:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }
