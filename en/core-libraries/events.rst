Events System
#############

.. versionadded:: 2.1

Creating maintainable applications is both a science and an art. It is
well-known that a key for having good quality code is making your objects
loosely coupled and strongly cohesive at the same time. Cohesion means that
all methods and properties for a class are strongly related to the class
itself and it is not trying to do the job other objects should be doing,
while loosely coupling is the measure of how little a class is "wired"
to external objects, and how much that class is depending on them.

While most of the CakePHP structure and default libraries will help you
achieve this goal, there are certain cases where you need to cleanly communicate
with other parts in the system without having to hard code those dependencies,
thus losing cohesion and increasing class coupling. Using the Observer pattern,
which allows objects to notify other objects and anonymous listeners about
changes, is a successful pattern to acheive this goal.

Listeners in the observer pattern can subscribe to events and choose to act upon
them if they are relevant. If you have used javascript in the past, the chances
are that you are already familiar with event driven programming.

CakePHP emulates several aspects of how events are triggered and managed in
popular javascript libraries such as jQuery. In the CakePHP implementation, an event
object is carried across all listeners holding the information and the ability
to stop the event propagation at any point. Listeners can register themselves or
can delegate this task to other objects and have the chance to alter the state
and the event itself for the rest of the callbacks.

The event subsystem is at the heart of Model, Behavior, Controller, View and
Helper callbacks. If you've ever used any of them, you are already somewhat
familiar with the events subsystem.

Example event usage
===================

Let's suppose you are building a Cart plugin, but you don't really want to
include shipping logic, emailing the user or decrementing the item from the
stock. Instead, you would prefer to handle those concerns separately elsewhere
in your application. If you were not using events, you may try to implement this
by attaching behaviors to models, or adding components to your controllers.
Doing the above represents a challenge most of the time, since you would have to
come up with the code for externally loading those behaviors or attaching hooks
to your plugin controllers. Instead, you can use the events system to allow you
to cleanly separate the concerns of your code and build in additional concerns
using events. For example in your Cart plugin you have an Order model that deals
with creating orders. You'd like to notify the rest of the application that an
order has been created. To keep your Order model clean you could use events::

    // Cart/Model/Order.php
    App::uses('CakeEvent', 'Event');
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $event = new CakeEvent('Model.Order.afterPlace', $this, array(
                    'order' => $order
                ));
                $this->getEventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

The above code allows you to easily notify the other parts of the application
that an order has been created allowing you to do tasks like send email
notifications, update stock, log relevant statistics and other tasks separately.

Accessing event managers
========================

In CakePHP events are triggered against event managers. Event managers are
available in every Model, View and Controller using ``getEventManager()``::

    $events = $this->getEventManager();

Each model has a separate event manager, while the View and Controller
share one. This allows model events to be self contained, and allow components
or controllers to act upon events created in the view if necessary.

Global event manager
--------------------

In addition to instance level event managers, CakePHP provides a global event
manager that allows you to listen to any event fired in an application. This
is useful when attaching listeners to a specific instance might be cumbersome or
difficult. The global manager is a singleton instance of
:php:class:`CakeEventManager` that receives every event **before** the instance
managers do. In addition to receiving events first, the global manager also
maintains a separate priority stack for listeners. Once an event has been
dispatched to the global manager, it will be dispatched to the instance level
manager. You can access the global manager using a static method::

    // In any configuration file or piece of code that executes before the event
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach(
        $aCallback,
        'Model.Order.beforePlace'
    );

One important thing you should consider is that there are events that will be
triggered having the same name but different subjects, so checking it in the
event object is usually required in any function that gets attached globally in
order to prevent some bugs. Remember that with the flexibility of using the
global manager, some additional complexity is incurred.


Dispatching events
==================

Once you have obtained an instance of an event manager you can dispatch events
using :php:meth:`~CakeEventManager::dispatch()`. This method takes an instance
of the :php:class:`CakeEvent` class. Let's look at dispatching an event::

    // Create a new event and dispatch it.
    $event = new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->getEventManager()->dispatch($event);

:php:class:`CakeEvent` receives 3 arguments in its constructor. The first one is
the event name, you should try to keep this name as unique as possible, while
making it readable. We suggest a convention as follows: ``Layer.eventName`` for
general events happening at a layer level (e.g. ``Controller.startup``,
``View.beforeRender``) and ``Layer.Class.eventName`` for events happening in
specific classes on a layer, for example ``Model.User.afterRegister`` or
``Controller.Courses.invalidAccess``.

The second argument is the ``subject``, meaning the object associated to the event,
usually when it is the same class triggering events about itself, using ``$this``
will be the most common case. Although a :php:class:`Component` could trigger
controller events too. The subject class is important because listeners will get
immediate access to the object properties and have the chance to inspect or
change them on the fly.

Finally, the third argument is any additional event data.This can be any data you consider
useful to pass around so listeners can act upon it. While this can be an argument
of any type, we recommend passing an associative array.

The :php:meth:`~CakeEventManager::dispatch()` method accepts an event object as an argument
and notifies all subscribed listeners.

Registering listeners
=====================

Listeners the preferred way to register callbacks for an event. This is done by
implementing the :php:class:`CakeEventListener` interface in any class you wish
to register some callbacks. Classes implementing it need to provide the
``implementedEvents()`` method. This method must return an associative array
with all event names that the class will handle.

To continue our previous example, let's imagine we have a UserStatistic class
responsible for calculating a user's purchasing history, and compiling into global site
statistics. This is a great place to use a listener class. Doing so allows you concentrate the statistics
logic in one place and react to events as necessary. Our ``UserStatistics``
listener might start out like::

    App::uses('CakeEventListener', 'Event');
    class UserStatistic implements CakeEventListener {

        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            );
        }

        public function updateBuyStatistic($event) {
            // Code to update statistics
        }
    }

    // Attach the UserStatistic object to the Order's event manager
    $statistics = new UserStatistic();
    $this->Order->getEventManager()->attach($statistics);

As you can see in the above code, the ``attach`` function will accept instances
of the ``CakeEventListener`` interface. Internally, the event manager will use
``implementedEvents`` to attach the correct callbacks.

Registering anonymous listeners
-------------------------------

While event listener objects are generally a better way to implement listeners,
you can also bind any ``callable`` as an event listener. For example if we
wanted to put any orders into the log files, we could use a simple anonymous
function to do so::

    // Anonymous functions require PHP 5.3+
    $this->Order->getEventManager()->attach(function($event) {
        CakeLog::write('info', 'A new order was placed with id: ' . $event->subject()->id);
    }, 'Model.Order.afterPlace');

In addition to anonymous functions you can use any other callable type that PHP
supports::

    $events = array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
    );
    foreach ($events as $callable) {
        $eventManager->attach($callable, 'Model.Order.afterPlace');
    }

.. todo::
    Continue here.

.. _event-priorities:

Establishing priorities
-----------------------

In some cases you'd want to run a callback and make sure it gets executed before,
or after all the other callbacks have been run. For instance, think again about
our user statistics example. It would make sense to run this method only
when we can make sure the event was not cancelled, there were no errors and the
other callbacks did not change the state of the order itself. For those cases you
use priorities.

Priorities are handled using a number associated to the callback itself. The higher
the number, the later the method will be fired. Default priority for all callbacks
and listener methods are set to `10`. If you need your method to be run before, then
using any value below this default will help you do it, even setting the priority
to `1` or a negative value should work. On the other hand if you desire to run the
callback after the others, using a number above `10` will do.

If two callbacks happen to be allocated in the same priority queue, they will be
executed with a `FIFO` policy, the first listener method to be attached is called
first and so on. You set priorities using the `attach` method for callbacks, and
declaring it in the `implementedEvents` function for event listeners::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('priority' => 2));

    // Setting priority for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array('callable' => 'updateBuyStatistic', 'priority' => 100),
            );
        }
    }

As you see, the main difference for `CakeEventListener` objects is that you need
to use an array for specifying the callable method and the priority preference.
The `callable` key is an special array entry that the manager will read to know
what function in the class it should be calling.

Getting event data as function params
-------------------------------------

Some developers might prefer having the event data passed as function parameters
instead of receiving the event object. While this is an odd preference and using
the event object is a lot more powerful, this was needed to provide backwards
compatibility with the previous event system and to offer seasoned developers an
alternative to what they were used to.

In order to toggle this option you have to add the `passParams` option to the
third argument of the `attach` method, or declare it in the `implementedEvents`
returned array similar to what you do with priorities::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('passParams' => true));

    // Setting priority for a listener
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array('callable' => 'updateBuyStatistic', 'passParams' => true),
            );
        }

        public function updateBuyStatistic($orderData) {
            // ...
        }
    }

In the above code the `doSomething` function and `updateBuyStatistic` method will
receive `$orderData` instead of the `$event` object. This is so, because in our
previous example we trigger the `Model.Order.afterPlace` event with some data::

    $this->getEventManager()->dispatch(new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    )));

.. note::

    The params can only be passed as function arguments if the event data is an array.
    Any other data type cannot be converted to function parameters, thus not using
    this option is often the most adequate choice.

Stopping events
---------------

There are circumstances where you will need to stop events so the operation that
started it is cancelled. You see examples of this in the model callbacks
(e.g. beforeSave) in which it is possible to stop the saving operation if
the code detects it cannot proceed any further.

In order to stop events you can either return `false` in your callbacks or call
the `stopPropagation` method on the event object::

    public function doSomething($event) {
        // ...
        return false; // stops the event
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

Stopping an event can have two different effects. The first one can always be
expected: any callback after the event was stopped will not be called. The second
consequence is optional and it depends on the code triggering the event, for
instance, in our `afterPlace` example it would not make any sense to cancel the
operation since the data was already saved and the cart emptied. Nevertheless, if
we had a `beforePlace` stopping the event would have a valid meaning.

To check if an event was stopped, you call the `isStopped()` method in the event object::

    public function place($order) {
        $event = new CakeEvent('Model.Order.beforePlace', $this, array('order' => $order));
        $this->getEventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

In the previous example the order would not get saved if the event is stopped
during the `beforePlace` process.

Getting event results
---------------------

Every time a callback returns a value, it gets stored in the `$result` property
of the event object. This is useful in some cases where letting callbacks modify
the main process params enhances the ability of altering the execution aspect of
any process. Let's take again our `beforePlace` example and let callbacks modify
the $order data.

Event results can be altered either using the event object result property
directly or returning the value in the callback itself::

    // A listener callback
    public function doSomething($event) {
        // ...
        $alteredData = $event->data['order'] + $moreData;
        return $alteredData;
    }

    // Another listener callback
    public function doSomethingElse($event) {
        // ...
        $event->result['order'] = $alteredData;
    }

    // Using the event result
    public function place($order) {
        $event = new CakeEvent('Model.Order.beforePlace', $this, array('order' => $order));
        $this->getEventManager()->dispatch($event);
        if (!empty($event->result['order'])) {
            $order = $event->result['order'];
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

As you also may have noticed it is possible to alter any event object property
and be sure that this new data will get passed to the next callback. In most of
the cases, providing objects as event data or result and directly altering the
object is the best solution as the reference is kept the same and modifications
are shared across all callback calls.

Removing callbacks and listeners
--------------------------------

If for any reason you want to remove any callback from the event manager just call
the :php:meth:`CakeEventManager::detach()` method using as arguments the first two
params you used for attaching it::

    // Attaching a function
    $this->getEventManager()->attach(array($this, 'doSomething'), 'My.event');

    // Detaching the function
    $this->getEventManager()->detach(array($this, 'doSomething'), 'My.event');

    // Attaching an anonymous function (PHP 5.3+ only);
    $myFunction = function($event) { ... };
    $this->getEventManager()->attach($myFunction, 'My.event');

    // Detaching the anonymous function
    $this->getEventManager()->detach($myFunction, 'My.event');

    // Attaching a CakeEventListener
    $listener = new MyCakeEventLister();
    $this->getEventManager()->attach($listener);

    // Detaching a single event key from a listener
    $this->getEventManager()->detach($listener, 'My.event');

    // Detaching all callbacks implemented by a listener
    $this->getEventManager()->detach($listener);

The global event manager
========================

As previously noted, it might get hard to attach observers to a particular
event manager in an object. There are certain cases where having the ability
to attach callbacks for an event is needed without having access to the object
instance that will trigger it. Also, to prevent people from implementing each
of them a different mechanism for loading callbacks into managers based on
configuration, CakePHP provides the concept of the global event manager.

The global manager is a singleton instance of a ``CakeEventManager`` class that
receives every event that any event manager in the app dispatches. This is both
powerful and flexible, but if you use it you need to take more precautions when
dealing with events.

To set the concept right once again, and using our `beforePlace` example let's
recall that we were using the local event manager that is returned by the `getEventManager`
function. Internally this local event manager dispatches the event into the global
one before it triggers the internal attached callbacks. The priority for each manager is
independent, the global callbacks will fire in their own priority queue and then
the local callbacks will get called in the respective priority order.

Accessing the global event manager is as easy as calling a static function,
the following example will attach a global event to the `beforePlace` event::

    // In any configuration file or piece of code that executes before the event
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach($aCallback, 'Model.Order.beforePlace');

As you can see, we just change how we get access to an event manager instance,
and we can apply the same concepts we learned before about triggering, attaching,
detaching, stopping events, etc.

One important thing you should consider is that there are events that will be
triggered having the same name but different subjects, so checking it in the event
object is usually required in any function that gets attached globally in order
to prevent some bugs. Remember that extreme flexibility implies extreme complexity.

Consider this callback that wants to listen for all Model beforeFinds but in
reality, it cannot do its logic if the model is the Cart::

    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach('myCallback', 'Model.beforeFind');

    public function myCallback($event) {
        if ($event->subject() instanceof Cart) {
            return;
        }
        return array('conditions' => ...);
    }

Conclusion
==========

Events are a great way of separating concerns in your application and make
classes both cohesive and decoupled from each other, nevertheless using events
is not the solution to all problems. Most applications actually won't need this
feature at all, we recommend looking into other options when it comes to
implementing callbacks such as using behaviors, components or helpers.

Keep in mind that with great power comes great responsibility, decoupling your
classes this way also means that you need to perform more and better integration
testing on your code. Abusing this tool won't make your apps have a better architecture,
quite the opposite, it will make the code harder to read. Whereas in contrast, if you
use it wisely, only for the stuff your really need, it will make you code easier
to work with, test and integrate.

Additional Reading
==================

.. toctree::

    /core-libraries/collections
    /models/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=en: Events system
    :keywords lang=en: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
