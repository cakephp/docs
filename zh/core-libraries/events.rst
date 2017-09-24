事件系统（Events System）
##################################

创造一个可维持得应用既是一门科学也是一门艺术。让代码变得更加有质量的方式就是让你的对
象变得松耦合（loosely coupled）的同时保持强内聚（strongly cohesive）。内聚意味着一个
类的所有方法和属性都和类本身强烈关联并且该类不会去做其它对象
应该做的事。而相对应的松耦合是指一个类与外部对象的关联度有多低，这个类依赖于其它对象的程度。

确实有些时候你需要在没有太多的代码依赖的基础上与其它应用保持干净的交流，因此你让耦合变
得疏松同时增加类的内聚。使用观察者模式，让一些对象在变化时可以通知另外一些对象和匿名的
监听器，是一种达到该目的常用模式。

在观察者模式中监听器可以订阅事件并且选择在事件发生时要做出的动作。如果你已经使用
过JavaScript，那么很有可能你已经接触过并且熟悉了事件驱动的程序设计。

CakePHP 模拟了类似jQuery的流行的JavaScript库中，对于事件触发和管理的几个方面。在CakePHP实装的时候，
一个事件对象将会发送给所有监听者。事件对象掌握着关于事件的信息，并且可以在任意点上停止事件的传播。
监听器可以注册它们自身，可以将一个任务委任给其它对象并且可以用回调函数转换状态和事件本身。

事件辅助系统是模型（Model）、行为（Behavior）、控制器（Controller）、视图（View）和助件（Helper）的
回调的核心。如果你已经用过它们，那么你已经或多或少熟悉CakePHP中的事件了。

事件的使用例
===================

让我们假设你已经建立了一个购物车插件，你希望专注于完善订单的逻辑。不希望在购物逻辑中包含物流、邮件通知、或者
在库削减的逻辑。但是这些对于使用你的插件的人来说是非常重要的。如果你不使用事件，或许你会试着通过在模型中添加
行为来将这些包含进来，或者给你的控制器增加部件。做这些意味着花费大量时间，因为你将要让这些加载的行为来迎合你
的代码，或者来和你的插件控制器连接起来。

取而代之，你可以使用事件来干净地分离你代码的关系并且为你使用事件的插件提供附加的关联。举个例子，在你的购物车
插件中你有一个处理新增订单的模型。你可能会通知其它应用一个订单已经被新增了。你可以使用这些事件来让你的模型保
持干净::

    // Cart/Model/Table/OrdersTable.php
    namespace Cart\Model\Table;

    use Cake\Event\Event;
    use Cake\ORM\Table;

    class OrdersTable extends Table
    {

        public function place($order)
        {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

上述代码可以让你通知其它应用一个订单已经被创建。之后你可以在其它关注该事件的独立对象中执行像发送邮件通知、
更新在库、日志相关统计以及其它任务。

访问事件管理器（Event Managers）
==========================================

CakePHP事件会触发事件管理器。在各表、视图、控制器中使用 ``eventManager()`` 能够访问事件管理器::

    $events = $this->eventManager();

各模型都拥有一个独立的事件管理器，而视图和控制器共享一个。这使得模型的事件可以容纳自身，并且能够让部件
或者控制器基于视图中的事件来启动。 

全局事件管理器
-----------------------

除了实例级别的事件管理器，CakePHP还提供一个全局的事件管理器让你可以监听应用中发生的任意事件。这在添加一个监听
器到个别实例会很笨重或者困难的时候将会比较实用。全局管理器是一个 :php:class:`Cake\\Event\\EventManager`  的单子
实例。登录到全局发送者的监听器在同样的优先级下将会比实例监听器先发动。你可以使用静态方法进入全局管理器::

    // 在事件执行前的配置文件或者代码片段中
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Model.Order.afterPlace',
        $aCallback
    );

一个你应该考虑的重要事情是有些拥有相同名字但是不同内容的事件被发动的情况。因此需要在事件对象中检查以防止分配
到全局的任意机能中漏洞。记住使用全局管理者的柔软性，会让额外的复杂程度增加。

:php:meth:`Cake\\Event\\EventManager::dispatch()` 方法接受事件对象作为宣言并且通知所有的监听器，通过回填函数
单独传递这个对象。监听器将会掌握围绕着 ``afterPlace`` 事件的全部逻辑，你可以通过不同的独立对象记录时间、发送
邮件、更新用户统计，甚至委托线下任务如果你需要的话。

.. _tracking-events:

跟踪事件
---------------------

保持一个由特别的 ``EventManager`` 发动的事件列表，你可以使用事件追踪。只需要简单地登录一个
 :php:class:`Cake\\Event\\EventList` 到管理器::

    EventManager::instance()->setEventList(new EventList());

在管理器触发一个事件时，你可以从事件列表中回收掉它::

    $eventsFired = EventManager::instance()->getEventList();
    $firstEvent = $eventsFired[0];

追踪可以通过移除事件列表或者调用 :php:meth:`Cake\\Event\\EventList::trackEvents(false)` 来取消。

.. versionadded:: 3.2.11
    事件追踪和 :php:class:`Cake\\Event\\EventList` 被增加。

核心事件
=================

框架中有很多你的应用能够监听的核心事件。CakePHP的各层会发出你的应用能够监听的事件。

* :ref:`__ORM/Model events <table-callbacks>`
* :ref:`__Controller events <controller-life-cycle>`
* :ref:`__View events <view-events>`

.. _registering-event-listeners:

注册监听器
=====================

监听器是为事件注册回调函数的好方法。它通过包含任意你想注册回调函数的类中的 :php:class:`Cake\\Event\\EventListenerInterface` 
接口来实现。包含它的类需要实现 ``implementedEvents()`` 方法。该方法需要返回一个该类掌握的有所有事件的名字的关联数组。

继续我们之前的例子，让我们想象我们有一个用户统计类，负责计算用户的购买记录，并且编写成全局位置的统计。这是个非常适合使用监
听类的位置。这样做让你可以集中于一处的统计逻辑并且在必要情况下将其反应成事件。我们的 ``UserStatistics`` 监听器也许像下面那样开始::

    use Cake\Event\EventListenerInterface;

    class UserStatistic implements EventListenerInterface
    {

        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            ];
        }

        public function updateBuyStatistic($event, $order)
        {
            // 更新统计的代码
        }
    }

    // 将用户统计对象登录到事件管理者
    $statistics = new UserStatistic();
    $this->Orders->eventManager()->on($statistics);

像你在上面的代码中看到的，``on()`` 函数会接收 ``EventListener`` 接口的实例。在内部，事件管理器会使用 ``implementedEvents()`` 
来登录正确的回调函数。

注册匿名监听器
-------------------------------

事件监听器对象通常是一个实行监听器的好方法。同时你也可以捆绑任何的 ``callable`` 作为事件监听器。举例来说如果我们想要放任何订单
到日志文件里面，我们可以用一个简单的匿名函数来做这些::

    use Cake\Log\Log;

    $this->Orders->eventManager()->on('Model.Order.afterPlace', function ($event) {
        Log::write(
            'info',
            'A new order was placed with id: ' . $event->getSubject()->id
        );
    });

除了匿名函数，你也可以使用PHP支持的任何种类回调函数::

    $events = [
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => [$this->InventoryManager, 'decrement'],
    ];
    foreach ($events as $callable) {
        $eventManager->on('Model.Order.afterPlace', $callable);
    }

当使用不触发特殊事件的插件时，你可以触动默认事件的事件监听器。让我们举个掌管用户的反馈表单的'UserFeedback'插件的例子。从你的
应用开始，你可能会知道何时一个反馈记录会被存储并且最终处理它。你可以监听全局的 
``Model.afterSave`` 事件。然而，你可以取得一个更加直接的路径并且仅仅监听你需要的事件::

    // 在存储操作之前，你可以
    // 创建如下, ie. config/bootstrap.php
    use Cake\ORM\TableRegistry;
    // 如果发送邮件
    use Cake\Mailer\Email;

    TableRegistry::get('ThirdPartyPlugin.Feedbacks')
        ->eventManager()
        ->on('Model.afterSave', function($event, $entity)
        {
            // 比方说我们可以给管理者发送一封邮件
            $email = new Email('default');
            $email->from('info@yoursite.com' => 'Your Site')
                ->setTo('admin@yoursite.com')
                ->setSubject('New Feedback - Your Site')
                ->send('Body of message');
        });

你可以用这个相同的路径去绑定监听器对象。

和既存监听器互相作用
-----------------------------------

假设几个事件监听器已经被登录的情况下，某个特定事件模式的有无可以当作有些动作的基础使用。::

    // 登录监听器到事件管理器
    $this->eventManager()->on('User.Registration', [$this, 'userRegistration']);
    $this->eventManager()->on('User.Verification', [$this, 'userVerification']);
    $this->eventManager()->on('User.Authorization', [$this, 'userAuthorization']);

    // 应用的其它地方。
    $events = $this->eventManager()->matchingListeners('Verification');
    if (!empty($events)) {
        // 实行存在'Verification'事件监听器的逻辑
        // 比方说如果存在就移除该监听器
        $this->eventManager()->off('User.Verification');
    } else {
        // 实行不存在'Verification'事件监听器的逻辑
    }

.. note::

    传递到 ``matchingListeners`` 方法的模式区分大小写。

.. versionadded:: 3.2.3

    ``matchingListeners`` 方法返回一个与检索模式一致的数组。

.. _event-priorities:

优先顺序设置
------------------------------------

在某些情况下你可能会想要控制监听器的调用顺序。比方说，如果你返回我们用户统计的例子。监听器在堆（stack）的最后被调用会
比较理想。在监听器堆的最后调用它，我们可以确保事件没有被取消，以及其它监听器没有发生例外。在其它监听器修改标题或者事件
对象时，我们也能得到对象的最后状态。

当增加一个监听器时，优先级被定义成了一个整数值。数值越高，方法越晚被调用。所有监听器的默认优先级都是 ``10``。如果你想要你的方法更早调用，可以使用一个低于默认值的整数。在另一方面，如果你想要比其它方法更晚调用，可以使用一个比 ``10`` 大的数字。

两个回调函数拥有相同优先级的情况下，它们将会按照我们登录的顺序执行。你可以用 ``on()`` 方法来为回调函数设定优先级，
在 ``implementedEvents()`` 函数内宣言给事件监听器设定优先级::

    // 给回调函数设定优先级
    $callback = [$this, 'doSomething'];
    $this->eventManager()->on(
        'Model.Order.afterPlace',
        ['priority' => 2],
        $callback
    );

    // 给监听器设定优先级
    class UserStatistic implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => [
                    'callable' => 'updateBuyStatistic',
                    'priority' => 100
                ],
            ];
        }
    }

如你所见， ``EventListener`` 对象的主要不同是需要用一个数组来确定回调方法和选择优先级。 
``callable`` 键是一个管理器可以读取以确定调用类中哪个方法的特殊数组输入。

将事件数据作为函数参数取得
--------------------------------------------------------

当给事件的构造函数提供数据时，被提供的数据会转化成监听器的参数。一个视图层的例子是afterRender回调函数::

    $this->eventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

``View.afterRender`` 回调函数的监听器有以下签名::

    function (Event $event, $viewFileName)

提供给事件构造函数的各值会按照它们在数据数组的顺序转化成函数的参数。如果你使用一个关联数组， 
``array_values`` 的结果将会决定函数参数的顺序。

.. note::

	和2.x不同，将事件数据转化成监听器参数是一个不可取消的默认行为。

发送事件
====================

一旦你得到一个事件管理器的实例，你可以使用 :php:meth:`~Cake\\Event\\EventManager::dispatch()` 来发送事件。
该方法接收一个 :php:class:`Cake\\Event\\Event` 实例。让我们看看发送事件::

    // 一个事件监听器在发送之前已经实例化。
    // 创建一个新事件并发送它。
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->eventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` 在构造函数中接收3个参数。第一个是事件名，你应该尽可能确保该名字是唯一可读的。我们推荐以下惯例: 
``Layer.eventName`` 对应发生在一个层级的事件（例如；``Controller.startup``，``View.beforeRender``），``Layer.Class.eventName`` 
对应发生在某个层的特定类中的事件，比方说 ``Model.User.afterRegister`` 或者 ``Controller.Courses.invalidAccess``。

第二个参数是 ``subject`` ，表明着对象与事件的关联，通常是触发与自身相关的事件的类，``$this`` 是最常见的使用例子。尽管一个
部件（Component）也能触发控制器事件。标题类（subject class）依然非常重要，因为监听器可以迅速访问对象的属性，有机会动态地检查
和变更它们。

最后，第三个参数是附加事件数据。这里可以是任意你认为有用的数据，因此监听器可以依据你传递的数据来发生动作。这个参数可以是任意
类型的，我们推荐传递一个关联数组。

The :php:meth:`~Cake\\Event\\EventManager::dispatch()` 方法接收一个事件对象作为参数并且通知所有订阅了的监听器。

.. _stopping-events:

停止事件
---------------

像DOM事件一样，你也许想停止一个事件让追加的监听器不会收到通知。当检测出处理不能再进行下去的代码的时候，中止保存操作
的模型回调函数(比方说 beforeSave)能够让你知道如何停止。

你也可以在你的回调函数中返回一个 ``false`` 来中止事件，或者在事件对象上调用 ``stopPropagation()`` 方法::

    public function doSomething($event)
    {
        // ...
        return false; // 停止事件
    }

    public function updateBuyStatistic($event)
    {
        // ...
        $event->stopPropagation();
    }

停止一个事件将会停止任何被调用的回调函数。触发事件的附加代码也许会根据事件是否被停止而有不同的表现。通常来说，
停止 'after' 事件没有意义，不过停止 'before' 事件经常被用来阻止整个操作的发生。

你可以使用 ``isStopped()`` 方法来检查是否事件被停止::

    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->eventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

在之前的例子，如果事件在 ``beforePlace`` 过程中被停止的话，订单不会被保存。

取得事件结果
----------------------------

每当回调函数返回一个非null和false的值，都会被保存在事件对象的 ``$result`` 属性里面。这在你想要让回调
函数调整事件的执行时比较有帮助。在让我们用 ``beforePlace`` 来举例子，让回调函数修改 ``$order`` 数据。

每个事件结果都可以通过直接使用事件对象结果属性或者返回回调函数自身的值来改变::

    // 一个监听器的回调函数
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;
        return $alteredData;
    }

    // 另一个监听器的回调函数
    public function doSomethingElse($event)
    {
        // ...
        $event->setResult(['order' => $alteredData] + $this->result());
    }

    // 使用事件结果
    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->eventManager()->dispatch($event);
        if (!empty($event->getResult()['order'])) {
            $order = $event->getResult()['order'];
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

转化任意事件对象的属性和拥有传递到下一个回调函数的新数据是可能的。在多数例子中，作为事件数据或者结果来提供
对象，直接转化对象，是保持相同参照和修改被共享到所有回调函数的调用的最优解决方案。

删除回调函数和监听器
-------------------------------------------

如果有任何理由你想要从事件管理器删除任意的回调函数，只需要使用你用来登录它的前两个参数来
调用 :php:meth:`Cake\\Event\\EventManager::off()` 方法::

    // 登录一个函数
    $this->eventManager()->on('My.event', [$this, 'doSomething']);

    // 删除一个函数
    $this->eventManager()->off('My.event', [$this, 'doSomething']);

    // 登录一个匿名函数
    $myFunction = function ($event) { ... };
    $this->eventManager()->on('My.event', $myFunction);

    // 删除匿名函数
    $this->eventManager()->off('My.event', $myFunction);

    // 添加一个事件监听器
    $listener = new MyEventLister();
    $this->eventManager()->on($listener);

    // 从监听器删除一个简单的事件键
    $this->eventManager()->off('My.event', $listener);

    // 删除监听器包含的所有回调函数
    $this->eventManager()->off($listener);

事件是让你在应用中把关心的东西分开的非常好的方法。它让类与其它类之间保持耦合与凝聚力。事件可以利用于应用代码
的疏结合和作成能够扩张的插件。

记住更大的能力带来更大的责任。使用太多的事件会让调试更困难并且需要额外的结合测试。

扩展阅读
==================

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`


.. meta::
    :title lang=zh: Events system
    :keywords lang=en: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
