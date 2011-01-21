5.6.4 Basic HTTP Authentication
-------------------------------

The SecurityComponent has some very powerful authentication
features. Sometimes you may need to protect some functionality
inside your application using
`HTTP Basic Authentication <http://en.wikipedia.org/wiki/Basic_access_authentication>`_.
One common usage for HTTP Auth is protecting a REST or SOAP API.

This type of authentication is called basic for a reason. Unless
you're transferring information over SSL, credentials will be
transferred in plain text.

Using the SecurityComponent for HTTP authentication is easy. The
code example below includes the SecurityComponent and adds a few
lines of code inside the controller's beforeFilter method.

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');
    
        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MyRealm'
            );
            $this->Security->loginUsers = array(
                'john'=>'johnspassword',
                'jane'=>'janespassword'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            //protected application logic goes here...
        }
    }


#. ``class ApiController extends AppController {``
#. ``var $name = 'Api';``
#. ``var $uses = array();``
#. ``var $components = array('Security');``
#. ``function beforeFilter() {``
#. ``$this->Security->loginOptions = array(``
#. ``'type'=>'basic',``
#. ``'realm'=>'MyRealm'``
#. ``);``
#. ``$this->Security->loginUsers = array(``
#. ``'john'=>'johnspassword',``
#. ``'jane'=>'janespassword'``
#. ``);``
#. ``$this->Security->requireLogin();``
#. ``}``
#. ````
#. ``function index() {``
#. ``//protected application logic goes here...``
#. ``}``
#. ``}``

The loginOptions property of the SecurityComponent is an
associative array specifying how logins should be handled. You only
need to specify the **type** as **basic** to get going. Specify the
**realm** if you want display a nice message to anyone trying to
login or if you have several authenticated sections (= realms) of
your application you want to keep separate.

The loginUsers property of the SecurityComponent is an associative
array containing users and passwords that should have access to
this realm. The examples here use hard-coded user information, but
you'll probably want to use a model to make your authentication
credentials more manageable.

Finally, requireLogin() tells SecurityComponent that this
Controller requires login. As with requirePost(), above, providing
method names will protect those methods while keeping others open.

5.6.4 Basic HTTP Authentication
-------------------------------

The SecurityComponent has some very powerful authentication
features. Sometimes you may need to protect some functionality
inside your application using
`HTTP Basic Authentication <http://en.wikipedia.org/wiki/Basic_access_authentication>`_.
One common usage for HTTP Auth is protecting a REST or SOAP API.

This type of authentication is called basic for a reason. Unless
you're transferring information over SSL, credentials will be
transferred in plain text.

Using the SecurityComponent for HTTP authentication is easy. The
code example below includes the SecurityComponent and adds a few
lines of code inside the controller's beforeFilter method.

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');
    
        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MyRealm'
            );
            $this->Security->loginUsers = array(
                'john'=>'johnspassword',
                'jane'=>'janespassword'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            //protected application logic goes here...
        }
    }


#. ``class ApiController extends AppController {``
#. ``var $name = 'Api';``
#. ``var $uses = array();``
#. ``var $components = array('Security');``
#. ``function beforeFilter() {``
#. ``$this->Security->loginOptions = array(``
#. ``'type'=>'basic',``
#. ``'realm'=>'MyRealm'``
#. ``);``
#. ``$this->Security->loginUsers = array(``
#. ``'john'=>'johnspassword',``
#. ``'jane'=>'janespassword'``
#. ``);``
#. ``$this->Security->requireLogin();``
#. ``}``
#. ````
#. ``function index() {``
#. ``//protected application logic goes here...``
#. ``}``
#. ``}``

The loginOptions property of the SecurityComponent is an
associative array specifying how logins should be handled. You only
need to specify the **type** as **basic** to get going. Specify the
**realm** if you want display a nice message to anyone trying to
login or if you have several authenticated sections (= realms) of
your application you want to keep separate.

The loginUsers property of the SecurityComponent is an associative
array containing users and passwords that should have access to
this realm. The examples here use hard-coded user information, but
you'll probably want to use a model to make your authentication
credentials more manageable.

Finally, requireLogin() tells SecurityComponent that this
Controller requires login. As with requirePost(), above, providing
method names will protect those methods while keeping others open.
