Компоненты
##########

Компоненты - это "пакеты" логики, которые доступны разным контроллерам.
Если вы часто делаете "копи паст" из контроллера в контроллер, то стоит
задуматься над созданием  компонентам, в котором будет описана часто используемая логика.
В CakePHP есть фантастический набор основных компонентов, которые упрощают
работу с такими задачами:

- Безопасность(Security)
- Сессии(Sessions)
- Уровни доступа(Access control lists)
- Почта(Emails)
- Куки(Cookies)
- Аутентификация(Authentication)
- Обработка запроса(Request handling)

Каждый из этих компонентов подробно описан в своей главе. А сейчас посмотрим, как создавать
свои собственные компоненты. Создание компонентов сохраняет код контроллера чистым и
позволяет повторно  использовать в разных проектах.

.. _configuring-components:

Конфигурация Компонентов
========================

Для многих компонентов доступна(или требуется) конфигурация.
Например, компоненты :doc:`/core-libraries/components/authentication`,
:doc:`/core-libraries/components/cookie` и :doc:`/core-libraries/components/email`
требуют конфигурации. Конфигурация для этих компонентов и компонентов в целом обычно делается в
``$components`` массиве или в вашем методе контроллера ``beforeFilter()``::

    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array('controller' => 'users', 'action' => 'login')
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

Would be an example of configuring a component with the
``$components`` array. All core components allow their
configuration settings to be set in this way. In addition you can
configure components in your controller's ``beforeFilter()``
method. This is useful when you need to assign the results of a
function to a component property. The above could also be expressed
as::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');

        $this->Cookie->name = 'CookieMonster';
    }

It's possible, however, that a component requires certain
configuration options to be set before the controller's
``beforeFilter()`` is run. To this end, some components allow
configuration options be set in the ``$components`` array::

    public $components = array('DebugKit.Toolbar' => array('panels' => array('history', 'session')));

Consult the relevant documentation to determine what configuration
options each component provides.

Использование компонентов
=========================

После того, как вы включили некоторые компоненты в контроллере, их использование
довольно просто. Каждый компонент используется как свойство вашего
контроллера. Если вы загрузили :php:class:`SessionComponent` и
:php:class:`CookieComponent` в контроллер, вы можете использовать их вот так::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    Так как и Модели и Компоненты добавляются к контроллеру как свойства, они имеюо одно и тоже 'пространство имен'.
    Необходимо проследить чтобы Компонент и Модель имели разные имена.

Загрузка компонентов 'на лету'
------------------------------

Часто бывает, что Компонент не требуется в каждом контроллере. В данной ситуации
вы можете загрузить компонент 'на лету' используя
:doc:`Component Collection </core-libraries/collections>`. 
Внутри контроллера вы должны сделать следующее::

You might not need all of your components available on every controller action.
In situations like this you can load a component at runtime using the
:doc:`Component Collection </core-libraries/collections>`.  From inside a
controller you can do the following::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();


Component Callbacks
===================

Components also offer a few request life-cycle callbacks that allow them
to augment the request cycle.  See the base :ref:`component-api` for
more information on the callbacks components offer.

Creating a Component
====================

Suppose our online application needs to perform a complex
mathematical operation in many different parts of the application.
We could create a component to house this shared logic for use in
many different controllers.

The first step is to create a new component file and class. Create
the file in ``/app/Controller/Component/MathComponent.php``. The basic
structure for the component would look something like this::

    class MathComponent extends Component {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    All components must extend :php:class:`Component`.  Failing to do this
    will trigger an exception.

Including your component in your controllers
--------------------------------------------

Once our component is finished, we can use it in the application's
controllers by placing the component's name (minus the "Component"
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
second parameter.  By convention, any settings that have been passed
that are also public properties on your component will have the values
set based on the settings.


Using other Components in your Component
----------------------------------------

Sometimes one of your components may need to use another component.
In this case you can include other components in your component the exact same
way you include them in controllers - using the ``$components`` var::

    // app/Controller/Component/CustomComponent.php
    class CustomComponent extends Component {
        // the other component your component uses
        public $components = array('Existing');

        function initialize($controller) {
            $this->Existing->foo();
        }

        function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    class ExistingComponent extends Component {

        function initialize($controller) {
            $this->Parent->bar();
        }

        function foo() {
            // ...
        }
    }

.. _component-api:

Component API
=============

.. php:class:: Component

    The base Component class offers a few methods for lazily loading other
    Components through :php:class:`ComponentCollection` as well as dealing
    with common handling of settings.  It also provides prototypes for all
    the component callbacks.

.. php:method:: __construct(ComponentCollection $collection, $config = array())

    Constructor for the base component class.  All ``$config`` that
    are also public properties will have their values changed to the
    matching value in ``$config``.

Callbacks
---------

.. php:method:: initialize($controller)

    The initialize method is called before the controller's
    beforeFilter method.

.. php:method:: startup($controller)

    The startup method is called after the controller's beforeFilter
    method but before the controller executes the current action
    handler.

.. php:method:: beforeRender($controller)

    The beforeRender method is called after the controller executes the
    requested action's logic but before the controller's renders views
    and layout.

.. php:method:: shutdown($controller)

    The shutdown method is called before output is sent to browser.

.. php:method:: beforeRedirect($controller, $url, $status=null, $exit=true)

    The beforeRedirect method is invoked when the controller's redirect
    method is called but before any further action. If this method
    returns false the controller will not continue on to redirect the
    request. The $url, $status and $exit variables have same meaning as
    for the controller's method. You can also return a string which
    will be interpreted as the url to redirect to or return associative
    array with key 'url' and optionally 'status' and 'exit'.



.. meta::
    :title lang=en: Components
    :keywords lang=en: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
