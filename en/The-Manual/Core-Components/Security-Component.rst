Security Component
##################

The Security Component creates an easy way to integrate tighter security
in your application. An interface for managing HTTP-authenticated
requests can be created with Security Component. It is configured in the
beforeFilter() of your controllers. It has several configurable
parameters. All of these properties can be set directly or through
setter methods of the same name.

If an action is restricted using the Security Component it is
black-holed as an invalid request which will result in a 404 error by
default. You can configure this behavior by setting the
$this->Security->blackHoleCallback property to a callback function in
the controller. Keep in mind that black holes from all of the Security
Component's methods will be ran through this callback method.

By using the Security Component you automatically get
`CSRF <https://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ and
form tampering protection. Hidden token fields will automatically be
inserted into forms and checked by the Security component. Among other
things, a form submission will not be accepted after a certain period of
inactivity, which depends on the setting of ``Security.level``. On
'high', this timeout is as short as 10 minutes. Other token fields
include a randomly generated nonce (one-time id) and a hash of fields
which (and only which) must be present in the submitted POST data.

If you are using Security component's form protection features and other
components that process form data in their ``startup()`` callbacks, be
sure to place Security Component before those components in your
``$components`` array.

When using the Security Component you **must** use the FormHelper to
create your forms. The Security Component looks for certain indicators
that are created and managed by the FormHelper (especially those created
in create() and end()). Dynamically altering the fields that are
submitted in a POST request (e.g. disabling, deleting or creating new
fields via JavaScript) is likely to trigger a black-holing of the
request. See the ``$validatePost`` or ``$disabledFields`` configuration
parameters.

Configuration
=============

$blackHoleCallback
    A Controller callback that will handle any requests that are
    blackholed.
$requirePost
    A List of controller actions that require a POST request to occur.
    An array of controller actions or '\*' to force all actions to
    require a POST.
$requireSecure
    List of actions that require an SSL connection to occur. An array of
    controller actions or '\*' to force all actions to require a SSL
    connection.
$requireAuth
    List of actions that requires a valid authentication key. This
    validation key is set by Security Component.
$requireLogin
    List of actions that require HTTP-Authenticated logins (basic or
    digest). Also accepts '\*' indicating that all actions of this
    controller require HTTP-authentication.
$loginOptions
    Options for HTTP-Authenticate login requests. Allows you to set the
    type of authentication and the controller callback for the
    authentication process.
$loginUsers
    An associative array of usernames => passwords that are used for
    HTTP-authenticated logins. If you are using digest authentication,
    your passwords should be MD5-hashed.
$allowedControllers
    A List of Controller from which the actions of the current
    controller are allowed to receive requests from. This can be used to
    control cross controller requests.
$allowedActions
    Actions from which actions of the current controller are allowed to
    receive requests. This can be used to control cross controller
    requests.
$disabledFields
    List of form fields that shall be ignored when validating POST - The
    value, presence or absence of these form fields will not be taken
    into account when evaluating whether a form submission is valid.
    Specify fields as you do for the Form Helper (``Model.fieldname``).
$validatePost
    Set to ``false`` to completely skip the validation of POST requests,
    essentially turning CSRF protection off.

Methods
=======

requirePost()
-------------

Sets the actions that require a POST request. Takes any number of
arguments. Can be called with no arguments to force all actions to
require a POST.

requireSecure()
---------------

Sets the actions that require a SSL-secured request. Takes any number of
arguments. Can be called with no arguments to force all actions to
require a SSL-secured.

requireAuth()
-------------

Sets the actions that require a valid Security Component generated
token. Takes any number of arguments. Can be called with no arguments to
force all actions to require a valid authentication.

requireLogin()
--------------

Sets the actions that require a valid HTTP-Authenticated request. Takes
any number of arguments. Can be called with no arguments to force all
actions to require valid HTTP-authentication.

loginCredentials(string $type)
------------------------------

Attempt to validate login credentials for a HTTP-authenticated request.
$type is the type of HTTP-Authentication you want to check. Either
'basic', or 'digest'. If left null/empty both will be tried. Returns an
array with login name and password if successful.

loginRequest(array $options)
----------------------------

Generates the text for an HTTP-Authenticate request header from an array
of $options.

$options generally contains a 'type', 'realm' . Type indicate which
HTTP-Authenticate method to use. Realm defaults to the current HTTP
server environment.

parseDigestAuthData(string $digest)
-----------------------------------

Parse an HTTP digest authentication request. Returns and array of digest
data as an associative array if succesful, and null on failure.

generateDigestResponseHash(array $data)
---------------------------------------

Creates a hash that to be compared with an HTTP digest-authenticated
response. $data should be an array created by
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
--------------------------------------------

Black-hole an invalid request with a 404 error or a custom callback.
With no callback, the request will be exited. If a controller callback
is set to SecurityComponent::blackHoleCallback, it will be called and
passed any error information.

Usage
=====

Using the security component is generally done in the controller
beforeFilter(). You would specify the security restrictions you want and
the Security Component will enforce them on its startup.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

In this example the delete action can only be successfully triggered if
it receives a POST request.

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

This example would force all actions that had admin routing to require
secure SSL requests.

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

This example would force all actions that had admin routing to require
secure SSL requests. When the request is black holed, it will call the
nominated forceSSL() callback which will redirect non-secure requests to
secure requests automatically.

Basic HTTP Authentication
=========================

The SecurityComponent has some very powerful authentication features.
Sometimes you may need to protect some functionality inside your
application using `HTTP Basic
Authentication <https://en.wikipedia.org/wiki/Basic_access_authentication>`_.
One common usage for HTTP Auth is protecting a REST or SOAP API.

This type of authentication is called basic for a reason. Unless you're
transferring information over SSL, credentials will be transferred in
plain text.

Using the SecurityComponent for HTTP authentication is easy. The code
example below includes the SecurityComponent and adds a few lines of
code inside the controller's beforeFilter method.

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

The loginOptions property of the SecurityComponent is an associative
array specifying how logins should be handled. You only need to specify
the **type** as **basic** to get going. Specify the **realm** if you
want display a nice message to anyone trying to login or if you have
several authenticated sections (= realms) of your application you want
to keep separate.

The loginUsers property of the SecurityComponent is an associative array
containing users and passwords that should have access to this realm.
The examples here use hard-coded user information, but you'll probably
want to use a model to make your authentication credentials more
manageable.

Finally, requireLogin() tells SecurityComponent that this Controller
requires login. As with requirePost(), above, providing method names
will protect those methods while keeping others open.
