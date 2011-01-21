5 Core Components
-----------------

CakePHP has a number of built-in components. They provide out of
the box functionality for several commonly used tasks.

`Acl </view/1242/Access-Control-Lists>`_
The Acl component provides an easy to use interface for database
and ini based access control lists.
`Auth </view/1250/Authentication>`_
The auth component provides an easy to use authentication system
using a variety of authentication processes, such as controller
callbacks, Acl, or Object callbacks.
`Cookie </view/1280/Cookies>`_
The cookie component behaves in a similar fashion to the
SessionComponent in that it provides a wrapper for PHP's native
cookie support.
`Email </view/1283/Email>`_
An interface that can be used to send emails using one of several
mail transfer agents including php's mail() and smtp.
`RequestHandler </view/1291/Request-Handling>`_
The request handler allows you to introspect further into the
requests your visitors and inform your application about the
content types and requested information.
`Security </view/1296/Security-Component>`_
The security component allows you to set tighter security and use
and manage HTTP authentication.
`Session </view/1310/Sessions>`_
The session component provides a storage independent wrapper to
PHP's sessions.
To learn more about each component see the menu on the left, or
learn more about
`creating your own components </view/62/components>`_.

All core components now can be configured in the ``$components``
array of a controller.

::

    <?php
    class AppController extends Controller {
    
        var $components = array(
            'Auth' => array(
                'loginAction' => array('controller' => 'users', 'action' => 'signOn'),
                'fields' => array('username' => 'email', 'password' => 'password'),
            ),
            'Security',
            'Email' => array(
                'from' => 'webmaster@domain.com',
                'sendAs' => 'html',
            ),
        );
    }


#. ``<?php``
#. ``class AppController extends Controller {``
#. ``var $components = array(``
#. ``'Auth' => array(``
#. ``'loginAction' => array('controller' => 'users', 'action' => 'signOn'),``
#. ``'fields' => array('username' => 'email', 'password' => 'password'),``
#. ``),``
#. ``'Security',``
#. ``'Email' => array(``
#. ``'from' => 'webmaster@domain.com',``
#. ``'sendAs' => 'html',``
#. ``),``
#. ``);``
#. ``}``

You can override the settings in the controller's
``beforeFilter()``

::

    <?php
    class MembersController extends AppController {
    
        function beforeFilter() {
            $this->Email->from = 'support@domain.com';
        }
    }


#. ``<?php``
#. ``class MembersController extends AppController {``
#. ``function beforeFilter() {``
#. ``$this->Email->from = 'support@domain.com';``
#. ``}``
#. ``}``

5 Core Components
-----------------

CakePHP has a number of built-in components. They provide out of
the box functionality for several commonly used tasks.

`Acl </view/1242/Access-Control-Lists>`_
The Acl component provides an easy to use interface for database
and ini based access control lists.
`Auth </view/1250/Authentication>`_
The auth component provides an easy to use authentication system
using a variety of authentication processes, such as controller
callbacks, Acl, or Object callbacks.
`Cookie </view/1280/Cookies>`_
The cookie component behaves in a similar fashion to the
SessionComponent in that it provides a wrapper for PHP's native
cookie support.
`Email </view/1283/Email>`_
An interface that can be used to send emails using one of several
mail transfer agents including php's mail() and smtp.
`RequestHandler </view/1291/Request-Handling>`_
The request handler allows you to introspect further into the
requests your visitors and inform your application about the
content types and requested information.
`Security </view/1296/Security-Component>`_
The security component allows you to set tighter security and use
and manage HTTP authentication.
`Session </view/1310/Sessions>`_
The session component provides a storage independent wrapper to
PHP's sessions.
To learn more about each component see the menu on the left, or
learn more about
`creating your own components </view/62/components>`_.

All core components now can be configured in the ``$components``
array of a controller.

::

    <?php
    class AppController extends Controller {
    
        var $components = array(
            'Auth' => array(
                'loginAction' => array('controller' => 'users', 'action' => 'signOn'),
                'fields' => array('username' => 'email', 'password' => 'password'),
            ),
            'Security',
            'Email' => array(
                'from' => 'webmaster@domain.com',
                'sendAs' => 'html',
            ),
        );
    }


#. ``<?php``
#. ``class AppController extends Controller {``
#. ``var $components = array(``
#. ``'Auth' => array(``
#. ``'loginAction' => array('controller' => 'users', 'action' => 'signOn'),``
#. ``'fields' => array('username' => 'email', 'password' => 'password'),``
#. ``),``
#. ``'Security',``
#. ``'Email' => array(``
#. ``'from' => 'webmaster@domain.com',``
#. ``'sendAs' => 'html',``
#. ``),``
#. ``);``
#. ``}``

You can override the settings in the controller's
``beforeFilter()``

::

    <?php
    class MembersController extends AppController {
    
        function beforeFilter() {
            $this->Email->from = 'support@domain.com';
        }
    }


#. ``<?php``
#. ``class MembersController extends AppController {``
#. ``function beforeFilter() {``
#. ``$this->Email->from = 'support@domain.com';``
#. ``}``
#. ``}``
