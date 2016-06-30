组件
####

组件(*Components*)是在控制器之间共享的封装了的逻辑。CakePHP 附带一套非常棒的核心
组件，可帮你完成各种常见任务。你也可以创建自己的组件。如果你发现自己要在控制器间
复制粘贴代码，就应当考虑创建自己的组件，封装这些功能。创建组件可以保持控制器代码
简洁，并且让你可以在不同的项目中重用代码。

每个核心组件都会在各自的章节中详细介绍，请参看 
:doc:`/core-libraries/toc-components` 。本节将描述如何配置和使用组件，以及如何创
建你自己的组件。

.. _configuring-components:

配置组件
========

许多核心组件需要进行配置。一些要求配置的组件的例子为 
:doc:`/core-libraries/components/authentication` 以及
:doc:`/core-libraries/components/cookie` 。这些组件以及一般组件的配置，通常都是用 
``$components`` 数组、或者控制器的 ``beforeFilter()`` 方法来进行::

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

上面的代码片段是使用 ``$components`` 数组配置组件的例子。所有的核心组件都可以使用
这种方式进行配置。此外，你也可以在控制器的 ``beforeFilter()`` 方法中配置组件。这
种方式适用于你需要将一个函数的结果赋值给一个组件属性的情况下。上面的例子也可以这
样::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array(
            'controller' => 'users',
            'action' => 'login'
        );

        $this->Cookie->name = 'CookieMonster';
    }

然而，也有这种可能：一个组件的特定配置选项要在控制器的 ``beforeFilter()`` 运行前
设置。为此，一些组件允许在 ``$components`` 数组中设置配置选项::

    public $components = array(
        'DebugKit.Toolbar' => array('panels' => array('history', 'session'))
    );

请查阅相关文档来确定每个组件提供的配置选项。

常用的一个设置是 ``className``，这让你可以赋予组件别名。这个选项可用于当你想要用
定制实现的组件来替换 ``$this->Auth`` 或者其它常用组件时::

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
        // 添加你的代码来重载核心 AuthComponent
    }

上面的例子，将在控制器中赋予 ``$this->Auth`` 别名 ``MyAuthComponent`` 。

.. note::

    赋予组件别名，会在任何用到该组件的地方，替换原来的实例，包括在其它组件内。

使用组件
========

一旦你已经在控制器中引入了一些组件，用起来是非常简单的。每个组件都作为控制器中的
属性可供调用。如果你已经在控制器中加载了 :php:class:`SessionComponent` 和 
:php:class:`CookieComponent` ，你就可以像下面这样访问它们::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                return $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    由于模型和组件都是作为属性被引入到控制器中，它们共享相同的'命名空间'。确保
    不要给组件和模型起相同的名字。

动态加载组件
------------

你可能不需要在控制器的所有动作中让所有组件可以使用。这种情况下，你可以使用 
:doc:`Component Collection </core-libraries/collections>` 在运行时(即动态)加载组
件。在控制器方法中，你可以这样做::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();

.. note::

    切记，动态加载组件并不会调用它的 initialize 方法。如果调用的组件有这个方法，
    就需要在加载后手动调用。


组件回调
========

组件提供了一些请求生命周期的回调函数，来增强请求周期(的操作)。欲知组件提供的回调
函数的更多信息，请参考 :ref:`component-api`。

.. _creating-a-component:

创建组件
========

设想我们的在线应用需要在程序的很多不同地方执行一个复杂的数学运算。我们可以创建一
个组件把这个共享的逻辑封装起来，从而可以在很多不同的控制器中使用。

首先要创建一个新组件的文件和类。创建 
``app/Controller/Component/MathComponent.php`` 文件。组件的基本构造如下::

    App::uses('Component', 'Controller');
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    所有的组件必须继承自 :php:class:`Component`。如果不这样做，就会导致异常。

在控制器中引入组件
------------------

一旦编写好了组件，就可以在应用程序的控制器的 ``$components`` 数组中引用组件的名称
(不包括 "Component")来使用它。控制器会自动获得一个以组件名称命名的属性，通过这个
属性就可以访问组件实例了::

    /* 让新的组件可以通过 $this->Math 访问，以及标准的 $this->Session */
    public $components = array('Math', 'Session');

在 ``AppController`` 控制器中声明的组件会与其它控制器中声明的组件进行合并。因此没
有必要重复声明同一组件。

在控制器中引用组件时，也可以声明一些参数，传递给组件的构造函数。这些参数可以被组
件处理::

    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

上面的例子会将包含 precision 和 randomGenerator 的数组作为第二个参数传递给 
``MathComponent::__construct()`` 。按照约定，如果数组的键与组件的公共属性吻合，属
性将被设置为该键对应的值。


在组件中使用其他组件
--------------------

有时候组件可能会用到其它组件。这种情况下，可以在组件中引入其它组件，方式和在控制
器中引入组件完全一样—使用 ``$components`` 变量::

    // app/Controller/Component/CustomComponent.php
    App::uses('Component', 'Controller');
    class CustomComponent extends Component {
        // 你的组件使用的其它组件
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
    与控制器中引入的组件不同，组件中的组件不会触发回调。

.. _component-api:

组件 API
========

.. php:class:: Component

    Component 基类提供了一些方法，用于通过 ComponentCollection 延迟加载其它组件，
    以及设置的常见处理。它也提供所有组件回调函数的原型。

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    Component 基类的构造函数。所有与 ``$settings`` 中的键同名的公共属性，其值会变
    成 ``$settings`` 中该键对应的值。

回调方法
---------

.. php:method:: initialize(Controller $controller)

    在控制器的 beforeFilter() 方法执行前被调用。

.. php:method:: startup(Controller $controller)

    在控制器的 beforeFilter 方法执行之后、但在控制器的当前动作执行之前被调用。

.. php:method:: beforeRender(Controller $controller)

    在控制器执行请求的动作逻辑之后、但在控制器渲染视图和布局之前被调用。

.. php:method:: shutdown(Controller $controller)

    在输出被送往浏览器之前被调用。

.. php:method:: beforeRedirect(Controller $controller, $url, $status=null, $exit=true)

    在控制器的 redirect 方法调用时、但在进行任何操作之前被调用。如果该方法返回 
    false，则控制器就不会继续重定向该请求。$url、$status 和 $exit 参数与控制器方
    法中相应的参数含义相同。也可以返回一个字符串作为重定向的网址，或者返回包括键
    'url' 和可选的键 'status'、'exit' 的关联数组。



.. meta::
    :title lang=zh: Components
    :keywords lang=zh: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
