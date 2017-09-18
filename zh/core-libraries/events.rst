事件系统（Events System）
##########################

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
---------------

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

* :ref:`ORM/Model events <table-callbacks>`
* :ref:`Controller events <controller-life-cycle>`
* :ref:`View events <view-events>`

.. _registering-event-listeners:

注册监听器
=====================

监听器是为事件注册回调函数的好方法。它通过包含任意你想注册回调函数的类中的 :php:class:`Cake\\Event\\EventListenerInterface` 
接口来实现。包含它的类需要实现 ``implementedEvents()`` 方法。该方法需要返回一个该类掌握的有所有事件的名字的关联数组。

继续我们之前的例子，让我们想象我们有一个用户统计类，负责计算用户的购买记录，并且编写成全局位置的统计。这是个非常适合使用监
听类的位置。这样做让你可以集中于一处的统计逻辑并且在必要情况下将其反应成事件。我们的 ``UserStatistics`` 监听器也许如下开始::

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

像你在上面的代码中看到的，``on()`` 函数会接收 ``EventListener`` 接口的实例。内部地，事件管理器会使用 ``implementedEvents()`` 
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

You can use this same approach to bind listener objects.

Interacting with Existing Listeners
-----------------------------------

Assuming several event listeners have been registered the presence or absence
of a particular event pattern can be used as the basis of some action.::

    // Attach listeners to EventManager.
    $this->eventManager()->on('User.Registration', [$this, 'userRegistration']);
    $this->eventManager()->on('User.Verification', [$this, 'userVerification']);
    $this->eventManager()->on('User.Authorization', [$this, 'userAuthorization']);

    // Somewhere else in your application.
    $events = $this->eventManager()->matchingListeners('Verification');
    if (!empty($events)) {
        // Perform logic related to presence of 'Verification' event listener.
        // For example removing the listener if present.
        $this->eventManager()->off('User.Verification');
    } else {
        // Perform logic related to absence of 'Verification' event listener
    }

.. note::

    The pattern passed to the ``matchingListeners`` method is case sensitive.

.. versionadded:: 3.2.3

    The ``matchingListeners`` method returns an array of events matching
    a search pattern.

.. _event-priorities:

Establishing Priorities
-----------------------

In some cases you might want to control the order that listeners are invoked.
For instance, if we go back to our user statistics example. It would be ideal if
this listener was called at the end of the stack. By calling it at the end of
the listener stack, we can ensure that the event was not cancelled, and that no
other listeners raised exceptions. We can also get the final state of the
objects in the case that other listeners have modified the subject or event
object.

Priorities are defined as an integer when adding a listener. The higher the
number, the later the method will be fired. The default priority for all
listeners is ``10``. If you need your method to be run earlier, using any value
below this default will work. On the other hand if you desire to run the
callback after the others, using a number above ``10`` will do.

If two callbacks happen to have the same priority value, they will be executed
with a the order they were attached. You set priorities using the ``on()``
method for callbacks, and declaring it in the ``implementedEvents()`` function
for event listeners::

    // Setting priority for a callback
    $callback = [$this, 'doSomething'];
    $this->eventManager()->on(
        'Model.Order.afterPlace',
        ['priority' => 2],
        $callback
    );

    // Setting priority for a listener
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

As you see, the main difference for ``EventListener`` objects is that you need
to use an array for specifying the callable method and the priority preference.
The ``callable`` key is a special array entry that the manager will read to know
what function in the class it should be calling.

Getting Event Data as Function Parameters
-----------------------------------------

When events have data provided in their constructor, the provided data is
converted into arguments for the listeners. An example from the View layer is
the afterRender callback::

    $this->eventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

The listeners of the ``View.afterRender`` callback should have the following
signature::

    function (Event $event, $viewFileName)

Each value provided to the Event constructor will be converted into function
parameters in the order they appear in the data array. If you use an associative
array, the result of ``array_values`` will determine the function argument
order.

.. note::

    Unlike in 2.x, converting event data to listener arguments is the default
    behavior and cannot be disabled.

Dispatching Events
==================

Once you have obtained an instance of an event manager you can dispatch events
using :php:meth:`~Cake\\Event\\EventManager::dispatch()`. This method takes an
instance of the :php:class:`Cake\\Event\\Event` class. Let's look at dispatching
an event::

    // An event listener has to be instantiated before dispatching an event.
    // Create a new event and dispatch it.
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->eventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` accepts 3 arguments in its constructor. The
first one is the event name, you should try to keep this name as unique as
possible, while making it readable. We suggest a convention as follows:
``Layer.eventName`` for general events happening at a layer level (e.g.
``Controller.startup``, ``View.beforeRender``) and ``Layer.Class.eventName`` for
events happening in specific classes on a layer, for example
``Model.User.afterRegister`` or ``Controller.Courses.invalidAccess``.

The second argument is the ``subject``, meaning the object associated to the
event, usually when it is the same class triggering events about itself, using
``$this`` will be the most common case. Although a Component could trigger
controller events too. The subject class is important because listeners will get
immediate access to the object properties and have the chance to inspect or
change them on the fly.

Finally, the third argument is any additional event data.This can be any data
you consider useful to pass around so listeners can act upon it. While this can
be an argument of any type, we recommend passing an associative array.

The :php:meth:`~Cake\\Event\\EventManager::dispatch()` method accepts an event
object as an argument and notifies all subscribed listeners.

.. _stopping-events:

Stopping Events
---------------

Much like DOM events, you may want to stop an event to prevent additional
listeners from being notified. You can see this in action during model callbacks
(e.g. beforeSave) in which it is possible to stop the saving operation if
the code detects it cannot proceed any further.

In order to stop events you can either return ``false`` in your callbacks or
call the ``stopPropagation()`` method on the event object::

    public function doSomething($event)
    {
        // ...
        return false; // Stops the event
    }

    public function updateBuyStatistic($event)
    {
        // ...
        $event->stopPropagation();
    }

Stopping an event will prevent any additional callbacks from being called.
Additionally the code triggering the event may behave differently based on the
event being stopped or not. Generally it does not make sense to stop 'after'
events, but stopping 'before' events is often used to prevent the entire
operation from occurring.

To check if an event was stopped, you call the ``isStopped()`` method in the
event object::

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

In the previous example the order would not get saved if the event is stopped
during the ``beforePlace`` process.

Getting Event Results
---------------------

Every time a callback returns a non-null non-false value, it gets stored in the
``$result`` property of the event object. This is useful when you want to allow
callbacks to modify the event execution. Let's take again our ``beforePlace``
example and let callbacks modify the ``$order`` data.

Event results can be altered either using the event object result property
directly or returning the value in the callback itself::

    // A listener callback
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;
        return $alteredData;
    }

    // Another listener callback
    public function doSomethingElse($event)
    {
        // ...
        $event->setResult(['order' => $alteredData] + $this->result());
    }

    // Using the event result
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

It is possible to alter any event object property and have the new data passed
to the next callback. In most of the cases, providing objects as event data or
result and directly altering the object is the best solution as the reference is
kept the same and modifications are shared across all callback calls.

Removing Callbacks and Listeners
--------------------------------

If for any reason you want to remove any callback from the event manager just
call the :php:meth:`Cake\\Event\\EventManager::off()` method using as
arguments the first two params you used for attaching it::

    // Attaching a function
    $this->eventManager()->on('My.event', [$this, 'doSomething']);

    // Detaching the function
    $this->eventManager()->off('My.event', [$this, 'doSomething']);

    // Attaching an anonymous function.
    $myFunction = function ($event) { ... };
    $this->eventManager()->on('My.event', $myFunction);

    // Detaching the anonymous function
    $this->eventManager()->off('My.event', $myFunction);

    // Adding a EventListener
    $listener = new MyEventLister();
    $this->eventManager()->on($listener);

    // Detaching a single event key from a listener
    $this->eventManager()->off('My.event', $listener);

    // Detaching all callbacks implemented by a listener
    $this->eventManager()->off($listener);

Events are a great way of separating concerns in your application and make
classes both cohesive and decoupled from each other. Events can be utilized to
de-couple application code and make extensible plugins.

Keep in mind that with great power comes great responsibility. Using too many
events can make debugging harder and require additional integration testing.

Additional Reading
==================

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`


.. meta::
    :title lang=en: Events system
    :keywords lang=en: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
