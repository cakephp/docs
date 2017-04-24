Components
##########

Components are packages of logic that are shared between controllers.
CakePHP comes with a fantastic set of core components you can use to aid in
various common tasks. You can also create your own components. If you find
yourself wanting to copy and paste things between controllers, you should
consider creating your own component to contain the functionality. Creating
components keeps controller code clean and allows you to reuse code between projects.

Each of the core components is detailed in its own chapter. See :doc:`/core-libraries/toc-components`.
This section describes how to configure and use components, and how to create
your own components.

.. _configuring-components:

Configuring Components
======================

Many of the core components require configuration. Some examples of
components requiring configuration are
:doc:`/core-libraries/components/authentication` and :doc:`/core-libraries/components/cookie`.
Configuration for these components, and for components in general, is usually done in the
``$components`` array or your controller's ``beforeFilter()``
method::

    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login'
                )
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

The previous fragment of code would be an example of
configuring a component with the ``$components`` array.
All core components allow their
configuration settings to be set in this way. In addition, you can
configure components in your controller's ``beforeFilter()``
method. This is useful when you need to assign the results of a
function to a component property. The above could also be expressed
as::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array(
            'controller' => 'users',
            'action' => 'login'
        );

        $this->Cookie->name = 'CookieMonster';
    }

It's possible, however, that a component requires certain
configuration options to be set before the controller's
``beforeFilter()`` is run. To this end, some components allow
configuration options be set in the ``$components`` array::

    public $components = array(
        'DebugKit.Toolbar' => array('panels' => array('history', 'session'))
    );

Consult the relevant documentation to determine what configuration
options each component provides.

One common setting to use is the ``className`` option, which allows you to
alias components. This feature is useful when you want to
replace ``$this->Auth`` or another common Component reference with a custom
implementation::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'className' => 'MyAuth'
            )
        );
    }

    // app/Controller/Component/MyAuthComponent.php
    App::uses('AuthComponent', 'Controller/Component');
    class MyAuthComponent extends AuthComponent {
        // Add your code to override the core AuthComponent
    }

The above would *alias* ``MyAuthComponent`` to ``$this->Auth`` in your
controllers.

.. note::

    Aliasing a component replaces that instance anywhere that component is used,
    including inside other Components.

Using Components
================

Once you've included some components in your controller, using them is
pretty simple. Each component you use is exposed as a property on your
controller. If you had loaded up the :php:class:`SessionComponent` and
the :php:class:`CookieComponent` in your controller, you could access
them like so::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                return $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    Since both Models and Components are added to Controllers as
    properties they share the same 'namespace'. Be sure to not give a
    component and a model the same name.

Loading components on the fly
-----------------------------

You might not need all of your components available on every controller
action. In situations like this you can load a component at runtime using the
:doc:`Component Collection </core-libraries/collections>`. From inside a
controller's method you can do the following::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();

.. note::

    Keep in mind that loading a component on the fly will not call its
    initialize method. If the component you are calling has this method you
    will need to call it manually after load.


Component Callbacks
===================

Components also offer a few request life-cycle callbacks that allow them
to augment the request cycle. See the base :ref:`component-api` for
more information on the callbacks components offer.

.. _creating-a-component:

Creating a Component
====================

Suppose our online application needs to perform a complex
mathematical operation in many different parts of the application.
We could create a component to house this shared logic for use in
many different controllers.

The first step is to create a new component file and class. Create
the file in ``app/Controller/Component/MathComponent.php``. The basic
structure for the component would look something like this::

    App::uses('Component', 'Controller');
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    All components must extend :php:class:`Component`. Failing to do this
    will trigger an exception.

Including your component in your controllers
--------------------------------------------

Once our component is finished, we can use it in the application's
controllers by placing the component's name (without the "Component"
part) in the controller's ``$components`` array. The controller will
automatically be given a new attribute named after the component,
through which we can access an instance of it::

    /* Make the new component available at $this->Math,
    as well as the standard $this->Session */
    public $components = array('Math', 'Session');

Components declared in ``AppController`` will be merged with those
in your other controllers. So there is no need to re-declare the
same component twice.

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
constructor. These parameters can then be handled by
the Component::

    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

The above would pass the array containing precision and
randomGenerator to ``MathComponent::__construct()`` as the
second parameter. By convention, if array keys match component's public
properties, the properties will be set to the values of these keys.


Using other Components in your Component
----------------------------------------

Sometimes one of your components may need to use another component.
In this case you can include other components in your component the exact same
way you include them in controllers - using the ``$components`` var::

    // app/Controller/Component/CustomComponent.php
    App::uses('Component', 'Controller');
    class CustomComponent extends Component {
        // the other component your component uses
        public $components = array('Existing');

        public function initialize(Controller $controller) {
            $this->Existing->foo();
        }

        public function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    App::uses('Component', 'Controller');
    class ExistingComponent extends Component {

        public function foo() {
            // ...
        }
    }

.. note::
    In contrast to a component included in a controller
    no callbacks will be triggered on a component's component.

.. _component-api:

Component API
=============

.. php:class:: Component

    The base Component class offers a few methods for lazily loading other
    Components through :php:class:`ComponentCollection` as well as dealing
    with common handling of settings. It also provides prototypes for all
    the component callbacks.

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    Constructor for the base component class. All ``$settings`` that
    are also public properties will have their values changed to the
    matching value in ``$settings``.

Callbacks
---------

.. php:method:: initialize(Controller $controller)

    Is called before the controller's
    beforeFilter method.

.. php:method:: startup(Controller $controller)

    Is called after the controller's beforeFilter
    method but before the controller executes the current action
    handler.

.. php:method:: beforeRender(Controller $controller)

    Is called after the controller executes the requested action's logic,
    but before the controller's renders views and layout.

.. php:method:: shutdown(Controller $controller)

    Is called before output is sent to the browser.

.. php:method:: beforeRedirect(Controller $controller, $url, $status=null, $exit=true)

    Is invoked when the controller's redirect
    method is called but before any further action. If this method
    returns false the controller will not continue on to redirect the
    request. The $url, $status and $exit variables have same meaning as
    for the controller's method. You can also return a string which
    will be interpreted as the URL to redirect to or return an associative
    array with the key 'url' and optionally 'status' and 'exit'.



.. meta::
    :title lang=en: Components
    :keywords lang=en: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
