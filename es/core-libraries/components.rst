Components
##########

CakePHP has a number of built-in components. They provide out of
the box functionality for several commonly used tasks.

- :doc:`/core-libraries/components/access-control-lists`
  The Acl component provides an easy to use interface for database
  and ini based access control lists.
- :doc:`/core-libraries/components/authentication`
  The auth component provides an easy to use authentication system
  using a variety of authentication processes, such as controller
  callbacks, Acl, or Object callbacks.
- :doc:`/core-libraries/components/cookie`
  The cookie component behaves in a similar fashion to the
  SessionComponent in that it provides a wrapper for PHP's native
  cookie support.
- :doc:`/core-libraries/components/email`
  An interface that can be used to send emails using one of several
  mail transfer agents including php's mail() and smtp.
- :doc:`/core-libraries/components/request-handling`
  The request handler allows you to introspect further into the
  requests your visitors and inform your application about the
  content types and requested information.
- :doc:`/core-libraries/components/security-component`
  The security component allows you to more tightly control security
  and implement features like :term:`CSRF` and form tampering protection.
- :doc:`/core-libraries/components/sessions`
  The session component provides a storage independent wrapper to
  PHP's sessions.

To learn more about each component see the menu below, or learn more about
:doc:`creating your own components </controllers/components>`.

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

You can override the settings in the controller's
``beforeFilter()``

::

    <?php
    class MembersController extends AppController {

        function beforeFilter() {
            $this->Email->from = 'support@domain.com';
        }
    }


.. toctree::
    :maxdepth: 2

    components/access-control-lists
    components/authentication
    components/cookie
    components/email
    components/request-handling
    components/pagination
    components/security-component
    components/sessions
