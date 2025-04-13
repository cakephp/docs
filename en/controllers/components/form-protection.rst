Form Protection Component
#########################

.. php:class:: FormProtection(ComponentCollection $collection, array $config = [])

The FormProtection Component provides protection against form data tampering.

Like all components it is configured through several configurable parameters.
All of these properties can be set directly or through setter methods of the
same name in your controller's ``initialize()`` or ``beforeFilter()`` methods.

If you are using other components that process form data in their ``startup()``
callbacks, be sure to place FormProtection Component before those components
in your ``initialize()`` method.

.. note::

    When using the FormProtection Component you **must** use the FormHelper to create
    your forms. In addition, you must **not** override any of the fields' "name"
    attributes. The FormProtection Component looks for certain indicators that are
    created and managed by the FormHelper (especially those created in
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` and
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`).  Dynamically altering
    the fields that are submitted in a POST request, such as disabling, deleting
    or creating new fields via JavaScript, is likely to cause the form token
    validation to fail.

Form tampering prevention
=========================

By default the ``FormProtectionComponent`` prevents users from tampering with
forms in specific ways. It will prevent the following things:

* Form's action (URL) cannot be modified.
* Unknown fields cannot be added to the form.
* Fields cannot be removed from the form.
* Values in hidden inputs cannot be modified.

Preventing these types of tampering is accomplished by working with the ``FormHelper``
and tracking which fields are in a form. The values for hidden fields are
tracked as well. All of this data is combined and turned into a hash and hidden
token fields are automatically be inserted into forms. When a form is submitted,
the ``FormProtectionComponent`` will use the POST data to build the same structure
and compare the hash.

.. note::

    The FormProtectionComponent will **not** prevent select options from being
    added/changed. Nor will it prevent radio options from being added/changed.

Usage
=====

Configuring the form protection component is generally done in the controller's
``initialize()`` or ``beforeFilter()`` callbacks

Available options are:

validate
    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning off form validation.

unlockedFields
    Set to a list of form fields to exclude from POST validation. Fields can be
    unlocked either in the Component, or with
    :php:meth:`FormHelper::unlockField()`. Fields that have been unlocked are
    not required to be part of the POST and hidden unlocked fields do not have
    their values checked.

unlockedActions
    Actions to exclude from POST validation checks.

validationFailureCallback
    Callback to call in case of validation failure. Must be a valid Closure.
    Unset by default in which case exception is thrown on validation failure.

Disabling form tampering checks
===============================

::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();

            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->FormProtection->setConfig('validate', false);
            }
        }
    }

The above example would disable form tampering prevention for admin prefixed
routes.

Disabling form tampering for specific actions
=============================================

There may be cases where you want to disable form tampering prevention for an
action (ex. AJAX requests).  You may "unlock" these actions by listing them in
``$this->FormProtection->setConfig('unlockedActions', ['edit']);`` in your ``beforeFilter()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->FormProtection->setConfig('unlockedActions', ['edit']);
        }
    }

This example would disable all security checks for the edit action.

Handling validation failure through callbacks
=============================================

If form protection validation fails it will result in a 400 error by default.
You can configure this behavior by setting the ``validationFailureCallback``
configuration option to a callback function in the controller.

By configuring a callback method you can customize how the failure handling process
works::

    use Cake\Controller\Exception\FormProtectionException;

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->FormProtection->setConfig(
            'validationFailureCallback',
            // Prior to 5.2 use Cake\Http\Exception\BadRequestException.
            function (FormProtectionException $exception) {
                // You can either return a response instance or throw the exception
                // received as argument.
            }
        );
    }

.. meta::
    :title lang=en: FormProtection
    :keywords lang=en: configurable parameters,form protection component,configuration parameters,protection features,tighter security,php class,meth,array,submission,security class,disable security,unlockActions
