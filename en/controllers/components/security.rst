Security
########

.. deprecated:: 4.0.0
    ``SecurityComponent`` has been deprecated. Use :doc:`/controllers/components/form-protection` instead
    for form tampering protection or :doc:`/security/https-enforcer` to enforce use of HTTPS (TLS) for requests.

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

The Security Component creates a way to integrate tighter
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
    the fields that are submitted in a POST request, such as disabling, deleting
    or creating new fields via JavaScript, is likely to cause the request to be
    send to the blackhole callback.

    You should always verify the HTTP method being used before executing to avoid
    side-effects. You should :ref:`check the HTTP method <check-the-request>` or
    use :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` to ensure the correct
    HTTP method is used.

Handling Blackhole Callbacks
============================

.. php:method:: blackHole(Controller $controller, string $error = '', ?SecurityException $exception = null)

If an action is restricted by the Security Component it is
'black-holed' as an invalid request which will result in a 400 error
by default. You can configure this behavior by setting the
``blackHoleCallback`` configuration option to a callback function
in the controller.

By configuring a callback method you can customize how the blackhole process
works::

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->Security->setConfig('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type, SecurityException $exception)
    {
        if ($exception->getMessage() === 'Request is not SSL and the action is required to be secure') {
            // Reword the exception message with a translatable string.
            $exception->setMessage(__('Please access the requested page through HTTPS'));
        }

        // Re-throw the conditionally reworded exception.
        throw $exception;

        // Alternatively, handle the error. For example, set a flash message &
        // redirect to HTTPS version of the requested page.
    }

The ``$type`` parameter can have the following values:

* 'auth' Indicates a form validation error, or a controller/action mismatch
  error.
* 'secure' Indicates an SSL method restriction failure.

Restrict Actions to SSL
=======================

This functionality was removed into :ref:`https-enforcer-middleware`.


Form Tampering Prevention
=========================

By default the ``SecurityComponent`` prevents users from tampering with forms in
specific ways. The ``SecurityComponent`` will prevent the following things:

* Unknown fields cannot be added to the form.
* Fields cannot be removed from the form.
* Values in hidden inputs cannot be modified.

Preventing these types of tampering is accomplished by working with the ``FormHelper``
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


Usage
=====

Configuring the security component is generally done in the controller's
``initialize`` or ``beforeFilter()`` callbacks::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->Security->setConfig('validatePost', false);
            }
        }
    }

The above example would disable form tampering prevention for admin prefixed
routes.

.. _security-csrf:

CSRF Protection
===============

CSRF or Cross Site Request Forgery is a common vulnerability in web
applications. It allows an attacker to capture and replay a previous request,
and sometimes submit data requests using image tags or resources on other
domains. To enable CSRF protection features use the
:ref:`csrf-middleware`.

Disabling Form Tampering for Specific Actions
=============================================

There may be cases where you want to disable form tampering prevention for an
action (ex. AJAX requests).  You may "unlock" these actions by listing them in
``$this->Security->unlockedActions`` in your ``beforeFilter()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->Security->setConfig('unlockedActions', ['edit']);
        }
    }

This example would disable all security checks for the edit action.

.. meta::
    :title lang=en: Security
    :keywords lang=en: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class,disable security,unlockActions
