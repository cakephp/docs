Security
########

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

The Security Component creates an easy way to integrate tighter
security in your application. It provides methods for various tasks like:

* Restricting which HTTP methods your application accepts.
* Form tampering protection
* Requiring that SSL be used.
* Limiting cross controller communication.

Like all components it is configured through several configurable parameters.
All of these properties can be set directly or through setter methods of the
same name in your controller's ``beforeFilter()``.

By using the Security Component you automatically get form tampering protection.
Hidden token fields will automatically be inserted into forms and checked by the
Security component.

If you are using Security component's form protection features and
other components that process form data in their ``startup()``
callbacks, be sure to place Security Component before those
components in your ``initialize()`` method.

.. note::

    When using the Security Component you **must** use the FormHelper to create
    your forms. In addition, you must **not** override any of the fields' "name"
    attributes. The Security Component looks for certain indicators that are
    created and managed by the FormHelper (especially those created in
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` and
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`).  Dynamically altering
    the fields that are submitted in a POST request (e.g.  disabling, deleting
    or creating new fields via JavaScript) is likely to cause the request to be
    send to the blackhole callback.

    You should always verify the HTTP method being used before executing
    side-effects. You should :ref:`check the HTTP method <check-the-request>` or
    use :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` to ensure the correct
    HTTP method is used.

Handling Blackhole Callbacks
============================

.. php:method:: blackHole(object $controller, string $error = '', SecurityException $exception = null)

If an action is restricted by the Security Component it is
'black-holed' as an invalid request which will result in a 400 error
by default. You can configure this behavior by setting the
``blackHoleCallback`` configuration option to a callback function
in the controller.

By configuring a callback method you can customize how the blackhole process
works::

    public function beforeFilter(Event $event)
    {
        $this->Security->setConfig('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type)
    {
        // Handle errors.
    }

Note: use ``$this->Security->config()`` for CakePHP versions prior to 3.4

The ``$type`` parameter can have the following values:

* 'auth' Indicates a form validation error, or a controller/action mismatch
  error.
* 'secure' Indicates an SSL method restriction failure.

.. versionadded:: cakephp/cakephp 3.2.6

    As of v3.2.6 an additional parameter is included in the blackHole callback,
    an instance of the ``Cake\Controller\Exception\SecurityException`` is
    included as a second parameter.

Restrict Actions to SSL
=======================

.. php:method:: requireSecure()

    Sets the actions that require a SSL-secured request. Takes any
    number of arguments. Can be called with no arguments to force all
    actions to require a SSL-secured.

.. php:method:: requireAuth()

    Sets the actions that require a valid Security Component generated
    token. Takes any number of arguments. Can be called with no
    arguments to force all actions to require a valid authentication.

Restricting Cross Controller Communication
==========================================

allowedControllers
    A list of controllers which can send requests
    to this controller.
    This can be used to control cross controller requests.
allowedActions
    A list of actions which are allowed to send requests
    to this controller's actions.
    This can be used to control cross controller requests.

These configuration options allow you to restrict cross controller
communication. Set them with the ``setConfig()`` method, or
``config()`` if you are using a CakePHP version below 3.4.

Form Tampering Prevention
=========================

By default the ``SecurityComponent`` prevents users from tampering with forms in
specific ways. The ``SecurityComponent`` will prevent the following things:

* Unknown fields cannot be added to the form.
* Fields cannot be removed from the form.
* Values in hidden inputs cannot be modified.

Preventing these types of tampering is accomplished by working with the FormHelper
and tracking which fields are in a form. The values for hidden fields are
tracked as well. All of this data is combined and turned into a hash. When
a form is submitted, the ``SecurityComponent`` will use the POST data to build the same
structure and compare the hash.

.. note::

    The SecurityComponent will **not** prevent select options from being
    added/changed. Nor will it prevent radio options from being added/changed.

unlockedFields
    Set to a list of form fields to exclude from POST validation. Fields can be
    unlocked either in the Component, or with
    :php:meth:`FormHelper::unlockField()`. Fields that have been unlocked are
    not required to be part of the POST and hidden unlocked fields do not have
    their values checked.

validatePost
    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning off form validation.

The above configuration options can be set with ``setConfig()`` or
``config()`` for CakePHP versions below 3.4.

Usage
=====

Using the security component is generally done in the controllers
``beforeFilter()``. You would specify the security restrictions you
want and the Security Component will enforce them on its startup::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }
    }

The above example would force all actions that had admin routing to
require secure SSL requests::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security', ['blackHoleCallback' => 'forceSSL']);
        }

        public function beforeFilter(Event $event)
        {
            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }

        public function forceSSL()
        {
            return $this->redirect('https://' . env('SERVER_NAME') . $this->request->getRequestTarget());
        }
    }

Note: use ``$this->request->here()`` for CakePHP versions prior to 3.4.0

This example would force all actions that had admin routing to require secure
SSL requests. When the request is black holed, it will call the nominated
``forceSSL()`` callback which will redirect non-secure requests to secure
requests automatically.

.. _security-csrf:

CSRF Protection
===============

CSRF or Cross Site Request Forgery is a common vulnerability in web
applications. It allows an attacker to capture and replay a previous request,
and sometimes submit data requests using image tags or resources on other
domains. To enable CSRF protection features use the
:doc:`/controllers/components/csrf`.

Disabling Security Component for Specific Actions
=================================================

There may be cases where you want to disable all security checks for an action
(ex. AJAX requests).  You may "unlock" these actions by listing them in
``$this->Security->unlockedActions`` in your ``beforeFilter()``. The
``unlockedActions`` property will **not** affect other features of
``SecurityComponent``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
             $this->Security->setConfig('unlockedActions', ['edit']);
        }
    }

Note: use ``$this->Security->config()`` for CakePHP versions prior to 3.4.0

This example would disable all security checks for the edit action.

.. meta::
    :title lang=en: Security
    :keywords lang=en: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class,disable security,unlockActions
