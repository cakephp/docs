Components
##########

Components are packages of logic that are shared between controllers.
CakePHP comes with a fantastic set of core components you can use to aid in
various common tasks. You can also create your own components. If you find
yourself wanting to copy and paste things between controllers, you should
consider creating your own component to contain the functionality. Creating
components keeps controller code clean and allows you to reuse code between
different controllers.

For more information on the components included in CakePHP, check out the
chapter for each component:

.. toctree::
    :maxdepth: 1

    /controllers/components/flash
    /controllers/components/form-protection
    /controllers/components/check-http-cache

.. _configuring-components:

Configuring Components
======================

Many of the core components require configuration. One example would be
the :doc:`/controllers/components/form-protection`. Configuration for these components,
and for components in general, is usually done via ``loadComponent()`` in your
Controller's ``initialize()`` method or via the ``$components`` array::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection', [
                'unlockedActions' => ['index'],
            ]);
            $this->loadComponent('Flash');
        }
    }

You can configure components at runtime using the ``setConfig()`` method. Often,
this is done in your controller's ``beforeFilter()`` method. The above could
also be expressed as::

    public function beforeFilter(EventInterface $event): void
    {
        $this->FormProtection->setConfig('unlockedActions', ['index']);
    }

Like helpers, components implement ``getConfig()`` and ``setConfig()`` methods
to read and write configuration data::

    // Read config data.
    $this->FormProtection->getConfig('unlockedActions');

    // Set config
    $this->Flash->setConfig('key', 'myFlash');

As with helpers, components will automatically merge their ``$_defaultConfig``
property with constructor configuration to create the ``$_config`` property
which is accessible with ``getConfig()`` and  ``setConfig()``.

Aliasing Components
-------------------

One common setting to use is the ``className`` option, which allows you to
alias components. This feature is useful when you want to
replace ``$this->Flash`` or another common Component reference with a custom
implementation::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize(): void
        {
            $this->loadComponent('Flash', [
                'className' => 'MyFlash',
            ]);
        }
    }

    // src/Controller/Component/MyFlashComponent.php
    use Cake\Controller\Component\FlashComponent;

    class MyFlashComponent extends FlashComponent
    {
        // Add your code to override the core FlashComponent
    }

The above would *alias* ``MyFlashComponent`` to ``$this->Flash`` in your
controllers.

.. note::

    Aliasing a component replaces that instance anywhere that component is used,
    including inside other Components.

Loading Components on the Fly
-----------------------------

You might not need all of your components available on every controller
action. In situations like this you can load a component at runtime using the
``loadComponent()`` method in your controller::

    // In a controller action
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    Keep in mind that components loaded on the fly will not have missed
    callbacks called. If you rely on the ``beforeFilter`` or ``startup``
    callbacks being called, you may need to call them manually depending on when
    you load your component.

Using Components
================

Once you've included some components in your controller, using them is pretty
simple. Each component you use is exposed as a property on your controller. If
you had loaded up the :php:class:`Cake\\Controller\\Component\\FlashComponent`
in your controller, you could access it like so::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Post deleted.');

                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    Since both Models and Components are added to Controllers as
    properties they share the same 'namespace'. Be sure to not give a
    component and a model the same name.

.. versionchanged:: 5.1.0
    Components are able to use :doc:`/development/dependency-injection` to receive services.

.. _creating-a-component:

Creating a Component
====================

Suppose our application needs to perform a complex mathematical operation in
many different parts of the application.  We could create a component to house
this shared logic for use in many different controllers.

The first step is to create a new component file and class. Create the file in
**src/Controller/Component/MathComponent.php**. The basic structure for the
component would look something like this::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

    All components must extend :php:class:`Cake\\Controller\\Component`. Failing
    to do this will trigger an exception.

Components can use :doc:`/development/dependency-injection` to receive services
as constructor parameters::

    namespace App\Controller\Component;

    use Cake\Controller\Component;
    use App\Service\UserService;

    class SsoComponent extends Component
    {
        private Users $users;

        public function __construct(
            ComponentRegistry $registry,
            array $config = [],
            UserService $users
        ) {
            parent::__construct($registry, $config);
            $this->users = $users;
        }
    }

.. versionadded: 5.1.0
   DI container support for Components was added.

Including your Component in your Controllers
--------------------------------------------

Once our component is finished, we can use it in the application's
controllers by loading it during the controller's ``initialize()`` method.
Once loaded, the controller will be given a new attribute named after the
component, through which we can access an instance of it::

    // In a controller
    // Make the new component available at $this->Math,
    // as well as the standard $this->Flash
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Flash');
    }

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
constructor. These parameters can then be handled by
the Component::

    // In your controller.
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand',
        ]);
        $this->loadComponent('Flash');
    }

The above would pass the array containing precision and randomGenerator to
``MathComponent::initialize()`` in the ``$config`` parameter.

Using Other Components in your Component
----------------------------------------

Sometimes one of your components may need to use another component.
You can load other components by adding them to the `$components` property::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // The other component your component uses
        protected array $components = ['Existing'];

        // Execute any other additional setup for your component.
        public function initialize(array $config): void
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
        }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {
        public function foo()
        {
            // ...
        }
    }

.. note::

    In contrast to a component included in a controller
    no callbacks will be triggered on a component's component.

Accessing a Component's Controller
----------------------------------

From within a Component you can access the current controller through the
registry::

    $controller = $this->getController();

Component Callbacks
===================

Components also offer a few request life-cycle callbacks that allow them to
augment the request cycle.

.. php:method:: beforeFilter(EventInterface $event)

    Is called before the controller's
    beforeFilter() method, but *after* the controller's initialize() method.

.. php:method:: startup(EventInterface $event)

    Is called after the controller's beforeFilter()
    method but before the controller executes the current action
    handler.

.. php:method:: beforeRender(EventInterface $event)

    Is called after the controller executes the requested action's logic,
    but before the controller renders views and layout.

.. php:method:: afterFilter(EventInterface $event)

    Is called during the ``Controller.shutdown`` event, before output is sent to the browser.

.. php:method:: beforeRedirect(EventInterface $event, $url, Response $response)

    Is invoked when the controller's redirect
    method is called but before any further action. If this method
    returns ``false`` the controller will not continue on to redirect the
    request. The $url, and $response parameters allow you to inspect and modify
    the location or any other headers in the response.

.. _redirect-component-events:

Using Redirects in Component Events
===================================

To redirect from within a component callback method you can use the following::

    public function beforeFilter(EventInterface $event): void
    {
        if (...) {
            $event->setResult($this->getController()->redirect('/'));

            return;
        }

        ...
    }

By setting a redirect as event result you let CakePHP know that you don't want any other
component callbacks to run, and that the controller should not handle the action
any further. As of 4.1.0 you can raise a ``RedirectException`` to signal
a redirect::

    use Cake\Http\Exception\RedirectException;
    use Cake\Routing\Router;

    public function beforeFilter(EventInterface $event): void
    {
        throw new RedirectException(Router::url('/'))
    }

Raising an exception will halt all other event listeners and create a new
response that doesn't retain or inherit any of the current response's headers.
When raising a ``RedirectException`` you can include additional headers::

    throw new RedirectException(Router::url('/'), 302, [
        'Header-Key' => 'value',
    ]);

.. meta::
    :title lang=en: Components
    :keywords lang=en: array controller,core libraries,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
