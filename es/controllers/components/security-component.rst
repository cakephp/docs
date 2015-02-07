Security
########

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

The Security Component creates an easy way to integrate tighter
security in your application. It provides methods for various tasks like:

* Restricting which HTTP methods your application accepts.
* Form tampering protection
* Requiring that SSL be used.
* Limiting cross controller communication.

Like all components it is configured through several configurable parameters.
All of these properties can be set directly or through setter methods of the
same name in your controller's beforeFilter.

By using the Security Component you automatically get `CSRF
<http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ and
form tampering protection. Hidden token fields will
automatically be inserted into forms and checked by the Security
component. Among other things, a form submission will not be accepted after a
certain period of inactivity, which is controlled by the
``csrfExpires`` time.

If you are using Security component's form protection features and
other components that process form data in their ``startup()``
callbacks, be sure to place Security Component before those
components in your ``$components`` array.

.. note::

    When using the Security Component you **must** use the FormHelper to create
    your forms. In addition, you must **not** override any of the fields' "name"
    attributes. The Security Component looks for certain indicators that are
    created and managed by the FormHelper (especially those created in
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` and
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`).  Dynamically altering
    the fields that are submitted in a POST request (e.g.  disabling, deleting
    or creating new fields via JavaScript) is likely to cause the request to be
    send to the blackhole callback. See the ``$validatePost`` or
    ``$disabledFields`` configuration parameters.

Handling Blackhole Callbacks
============================

.. php:method:: blackHole(object $controller, string $error)

If an action is restricted by the Security Component it is
'black-holed' as an invalid request which will result in a 400 error
by default. You can configure this behavior by setting the
``blackHoleCallback`` configuration option to a callback function
in the controller.

By configuring a callback method you can customize how the blackhole process
works::

    public function beforeFilter()
    {
        $this->Security->config('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type)
    {
        // Handle errors.
    }

The ``$type`` parameter can have the following values:

* 'auth' Indicates a form validation error, or a controller/action mismatch
  error.
* 'secure' Indicates an SSL method restriction failure.

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
    A List of Controller from which the actions of the current
    controller are allowed to receive requests from. This can be used
    to control cross controller requests.
allowedActions
    Actions from which actions of the current controller are allowed to
    receive requests. This can be used to control cross controller
    requests.

These configuration options allow you to restrict cross controller
communication. Set them with the ``config()`` method.

Form Tampering Prevention
=========================

By default ``SecurityComponent`` prevents users from tampering with forms in
specific ways. The ``SecurityComponent`` will prevent the following things:

* Unknown fields cannot be added to the form.
* Fields cannot be removed from the form.
* Values in hidden inputs cannot be modified.

Preventing these forms of tampering is accomplished by working with FormHelper
and tracking which fields are in a form. The values for hidden fields are
tracked as well. All of this data is combined and turned into a hash. When
a form is submitted, SecurityComponent will use the POST data to build the same
structure and compare the hash.

.. note::

    SecurityComponent will **not** prevent select options from being
    added/changed. Nor will it prevent radio options from being added/changed.

.. php:attr:: unlockedFields

    Set to a list of form fields to exclude from POST validation. Fields can be
    unlocked either in the Component, or with
    :php:meth:`FormHelper::unlockField()`. Fields that have been unlocked are
    not required to be part of the POST and hidden unlocked fields do not have
    their values checked.

.. php:attr:: validatePost

    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning off form validation.

Usage
=====

Using the security component is generally done in the controller
beforeFilter(). You would specify the security restrictions you
want and the Security Component will enforce them on its startup::

    class WidgetController extends AppController
    {

        public $components = ['Security'];

        public function beforeFilter()
        {
            if (isset($this->request->params['admin'])) {
                $this->Security->requireSecure();
            }
        }
    }

The above example would force all actions that had admin routing to
require secure SSL requests.

::

    class WidgetController extends AppController
    {

        public $components = ['Security'];

        public function beforeFilter()
        {
            if (isset($this->params['admin'])) {
                $this->Security->blackHoleCallback = 'forceSSL';
                $this->Security->requireSecure();
            }
        }

        public function forceSSL()
        {
            return $this->redirect('https://' . env('SERVER_NAME') . $this->here);
        }
    }

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
:doc:`/core-libraries/components/csrf-component`.

Disabling Security Component for Specific Actions
=================================================

There may be cases where you want to disable all security checks for an action
(ex. AJAX requests).  You may "unlock" these actions by listing them in
``$this->Security->unlockedActions`` in your ``beforeFilter``. The
``unlockedActions`` property will **not** affect other features of
``SecurityComponent``.

.. meta::
    :title lang=es: Security
    :keywords lang=es: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class,disable security,unlockActions
