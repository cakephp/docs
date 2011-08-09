Security Component
##################

.. php:class:: SecurityComponent

The Security Component creates an easy way to integrate tighter
security in your application. An interface for managing
HTTP-authenticated requests can be created with Security Component.
It is configured in the beforeFilter() of your controllers. It has
several configurable parameters. All of these properties can be set
directly or through setter methods of the same name.

If an action is restricted using the Security Component it is
black-holed as an invalid request which will result in a 404 error
by default. You can configure this behavior by setting the
$this->Security->blackHoleCallback property to a callback function
in the controller. Keep in mind that black holes from all of the
Security Component's methods will be run through this callback
method.

By using the Security Component you automatically get
`CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
and form tampering protection. Hidden token fields will
automatically be inserted into forms and checked by the Security
component. Among other things, a form submission will not be
accepted after a certain period of inactivity, which depends on the
setting of ``Security.level``. On 'high', this timeout is as short
as 10 minutes. Other token fields include a randomly generated
nonce (one-time id) and a hash of fields which (and only which)
must be present in the submitted POST data.

If you are using Security component's form protection features and
other components that process form data in their ``startup()``
callbacks, be sure to place Security Component before those
components in your ``$components`` array.

.. note::

    When using the Security Component you **must** use the FormHelper
    to create your forms. The Security Component looks for certain
    indicators that are created and managed by the FormHelper
    (especially those created in create() and end()). Dynamically
    altering the fields that are submitted in a POST request (e.g.
    disabling, deleting or creating new fields via JavaScript) is
    likely to trigger a black-holing of the request. See the
    ``$validatePost`` or ``$disabledFields`` configuration parameters.

Configuration
=============

.. php:attr:: blackHoleCallback

    A Controller callback that will handle and requests that are
    blackholed.

.. php:attr:: requirePost

    A List of controller actions that require a POST request to occur.
    An array of controller actions or '\*' to force all actions to
    require a POST.

.. php:attr:: requireGet

    A List of controller actions that require a GET request to occur.
    An array of controller actions or '\*' to force all actions to
    require a GET.

.. php:attr:: requirePut

    A List of controller actions that require a PUT request to occur.
    An array of controller actions or '\*' to force all actions to
    require a PUT.

.. php:attr:: requireDelete

    A List of controller actions that require a DELETE request to occur.
    An array of controller actions or '\*' to force all actions to
    require a DELETE.

.. php:attr:: requireSecure

    List of actions that require an SSL connection to occur. An array
    of controller actions or '\*' to force all actions to require a SSL
    connection.

.. php:attr:: requireAuth

    List of actions that requires a valid authentication key. This
    validation key is set by Security Component.

.. php:attr:: allowedControllers

    A List of Controller from which the actions of the current
    controller are allowed to receive requests from. This can be used
    to control cross controller requests.

.. php:attr:: allowedActions

    Actions from which actions of the current controller are allowed to
    receive requests. This can be used to control cross controller
    requests.

.. php:attr:: disabledFields

    List of form fields that shall be ignored when validating POST -
    The value, presence or absence of these form fields will not be
    taken into account when evaluating whether a form submission is
    valid. Specify fields as you do for the Form Helper
    (``Model.fieldname``).

.. note::

    Deprecated property, superseded by unlockedFields

.. php:attr:: unlockedFields

    Form fields to exclude from POST validation. Fields can be unlocked
    either in the Component, or with FormHelper::unlockField().
    Fields that have been unlocked are not required to be part of the POST
    and hidden unlocked fields do not have their values checked.
    
.. php:attr:: validatePost

    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning CSRF protection off.

.. php:attr:: crsfCheck

    Whether to use CSRF protected forms. Set to ``false`` to disable 
    CSRF protection on forms.

.. php:attr:: crsfExpires

   The duration from when a CSRF token is created that it will expire on.
   Each form/page request will generate a new token that can only 
   be submitted once unless it expires.  Can be any value compatible 
   with strtotime(). Default is +30 minutes.

.. php:attr:: crsfUseOnce

   Controls whether or not CSRF tokens are use and burn.  Set to 
   ``false`` to not generate new tokens on each request.  One token 
   will be reused until it expires. This reduces the chances of 
   users getting invalid requests because of token consumption.
   It has the side effect of making CSRF less secure, as tokens are reusable.


.. todo::

    Missing CSRF properties added in 2.0

Methods
=======

.. todo::

    Update to reflect API changes in 2.0

.. php:method:: requirePost()

    Sets the actions that require a POST request. Takes any number of
    arguments. Can be called with no arguments to force all actions to
    require a POST.

.. php:method:: requireGet()

    Sets the actions that require a GET request. Takes any number of
    arguments. Can be called with no arguments to force all actions to
    require a GET.

.. php:method:: requirePut()

    Sets the actions that require a PUT request. Takes any number of
    arguments. Can be called with no arguments to force all actions to
    require a PUT.

.. php:method:: requireDelete()

    Sets the actions that require a DELETE request. Takes any number of
    arguments. Can be called with no arguments to force all actions to
    require a DELETE.

.. php:method:: requireSecure()

    Sets the actions that require a SSL-secured request. Takes any
    number of arguments. Can be called with no arguments to force all
    actions to require a SSL-secured.

.. php:method:: requireAuth()

    Sets the actions that require a valid Security Component generated
    token. Takes any number of arguments. Can be called with no
    arguments to force all actions to require a valid authentication.

.. php:method:: blackHole(object $controller, string $error)

    Black-hole an invalid request with a 404 error or a custom
    callback. With no callback, the request will be exited. If a
    controller callback is set to SecurityComponent::blackHoleCallback,
    it will be called and passed any error information.

Usage
=====

Using the security component is generally done in the controller
beforeFilter(). You would specify the security restrictions you
want and the Security Component will enforce them on its startup.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

In this example the delete action can only be successfully
triggered if it recieves a POST request.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

This example would force all actions that had admin routing to
require secure SSL requests.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->blackHoleCallback = 'forceSSL';
                $this->Security->requireSecure();
            }
        }
    
        function forceSSL() {
            $this->redirect('https://' . env('SERVER_NAME') . $this->here);
        }
    }
    ?>

This example would force all actions that had admin routing to
require secure SSL requests. When the request is black holed, it
will call the nominated forceSSL() callback which will redirect
non-secure requests to secure requests automatically.

Basic HTTP Authentication
=========================

.. todo::

    Update to reflect API changes in 2.0

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

    <?php
    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');
    
        function beforeFilter() {
            $this->Security->blackHoleCallback = 'secure';
            $this->Security->requireAuth();
        }
        
        function secure(){
            $this->redirect(array('controller' => 'pages', 'action' => 'home'));
        }
         
        function index() {
            //protected application logic goes here...
        }
    }

The requireAuth() method above would blackhole any non authenticated 
request to this controller. You can also set only some actions
of the current controller to require this authentication, just
pass them as arguments of requireAuth() method. On the
example below only the edit action requires authentication.

::

    <?php
        $this->Security->requireAuth('edit');


