Events system
#############

.. versionadded:: 2.1

Creating maintainable applications is both a science and and art. It is
well-known that a key for having good quality code is making your objects
loosely coupled and strongly cohesive at the same time. Cohesion means that
all method and properties for a class are strongly related to the class
itself and it is not trying to do the job other object should be doing,
while loosely coupling is the measure of how little a class is "wired"
to external objects, and how much that class is depending on them.

While most of the CakePHP structure and default libraries will help you
achieve this goal, there are certain cases where you need to cleanly communicate
with other parts in the system without having to hard code those dependencies,
thus losing cohesion and increasing class coupling. A very successful design
patter in software engineering is the Observer pattern, where objects can
generate events and notify possibly anonymous listeners about changes in the
internal state.

Listeners in the observer pattern can subscribe to such events and choose to act
upon them, modify the subject state or simply log stuff. If you have used
javascript in the past, the chances are that you are already familiar with event
driven programming.

CakePHP emulates several aspects of how events are triggered and managed in
popular javascript frameworks such as jQuery, while remaining loyal to its
object oriented design. In this implementation, an event object is carried
across all listeners holding the information and the ability to stop the event
propagation at any point. Listeners can register themselves or can delegate this
task to other objects an have the chance to alter the state and the event itself
for the rest of the callbacks.

Interacting with the event managers
===================================

Let's suppose you are building a Cart plugin, but you don't really want to mess with
shipping logic, emailing the user or decrementing the item from the stock,
it is your wish to handle those things separately in other plugin or in app code.
Typically, when not directly using the observer pattern you would do this attaching
behaviors on the fly to your models, and perhaps some components to the controllers.

Doing so represents a challenge most of the time, since you would have to come up
with the code for externally loading those behaviors or attaching hooks to your
plugin controllers. Prior CakePHP 2.1 some developers chose to implement generic
event systems to solve this problem, and some of those system were offered as plugins.
Now, you can benefit from a standard general purpose event system that will let you
cleanly separate the concerns of your plugins and application code with the built in
events manager.

Dispatching events
------------------

So back to our example, we would have a `Order` model that will manage the buying logic,
and probably a `place` method to save the order details and do any other logic::

    <?php
    // Cart/Model/Order.php
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $this->sendNotificationEmail();
                $this->decrementFromStock();
                $this->updateUserStatistics();
                // ...
                return true;
            }
            return false;
        }
    }

Well, that does not look right at all. A plugin should not make any assumption
about sending emails, and may not even have the inventory data to decrement the
item from it, and definitely tracking usage statistics is not the best place to
do it. So we need another solution, let's rewrite that using the event manager::

    <?php
    // Cart/Model/Order.php
    App::uses('CakeEvent', 'Event');
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $this->getEventManager()->dispatch(new CakeEvent('Mode.Order.afterPlace', $this, array(
                    'order' => $order
                )));
                return true;
            }
            return false;
        }
    }

That looks a lot cleaner, at gives us the opportunity to introduce the event
classes and methods. The first thing you may notice is the call to ``getEventManager()``
this is a method that is available by default in all Models, Controller and Views.
This method will not return the same manager instance across models, and it is not
shared between controllers and models, but they are between controllers and views, 
nevertheless. We will review later how to overcome this implementation detail.

The ``getEventManager`` method return an instance of :php:class:`CakeEventManager`,
and to dispatch events you use :php:meth:`CakeEventManager::dispatch()` which
receives an instance of the :php:class:`CakeEvent` class. Let's dissect now the
process of dispatching an event::

    <?php
    new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));

:php:class:`CakeEvent` receives 3 arguments in its constructor. The first one
is the event name, you should try to keep this name as unique as possible, 
while making it readable. We suggest a convention as follows: `Layer.eventName`
for general events happening at a layer level (e.g. `Controller.startup`, `View.beforeRender`)
and `Layer.Class.eventName` for events happening in specific classes on a layer,
for example `Model.User.afterRegister` or `Controller.Courses.invalidAccess`.

The second argument is the `subject`, meaning the object associated to the event,
usually when it is the same class triggering events about itself, the using `$this`
will be the most common case. Although a :php:class:`Component` could trigger
controller events too. The subject class is important because listeners will get
immediate access to the object properties and have the chance to inspect or
change them on the fly.

Finally, the third argument is the event's params. This can be any data you consider
useful to pass around so listeners can act upon it. While this can be an argument
of any type, we recommend passing an associative array, to make inspection easier.

:php:meth:`CakeEventManager::dispatch()` method accepts the event object as argument
and notifies all listener and callbacks passing this abject along. So the listeners
will handle all the extra logic around the `afterPlace` event, you can log the time,
send emails, update user statistics possibly in separate objects and even delegating
it to offline tasks if you have the need.

Registering callbacks
---------------------

How do we register callbacks or observers to our new `afterPlace` event? This
is subject to a wide variety of different implementations, but they all have
to call the :php:meth:`CakeEventManager::attach()` method to register new actors.
For simplicity sake, let's imagine we know in the plugin what the callbacks are and
are available in the controller, and say this controller is responsible for
attaching them. A possible code would look like this::

    <?php
    // Listeners configured somewhere else, maybe a config file:
    Configure::write('Order.afterPlace', array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
        'logger' => function($event) {
            // Anonymous function are only available in PHP 5.3+
            CakeLog::write('info', 'A new order was placed with id: ' . $event->subject()->id);
        }
    ));

    // Cart/Controller/OrdersController.php
    class OrdersController extends AppController {

        public function finish() {
            foreach (Configure::read('Order.afterPlace') as $l) {
                $this->Order->getEventManager()->attach($l, 'Model.Order.afterPlace');
            }
            if ($this->Order->place($this->Cart->items())) {
                // ...
            }
        }
    }

This may not be the cleanest way to do it, so you can come up with you own ways
for attaching listener to an object's event manager. This simple way of defining
them using the `Configure` class is intended for didactic purposes only. This
little example allows us to show case what type of callbacks can be attached to
the manager. As you may already have figured out, the `attach` method takes any
valid  PHP `callback` type, this is a string representing a static function call,
an array having a class instance and a method, an anonymous function if you use
PHP 5.3, etc. Attached callbacks will all receive the event object as first argument

:php:meth:`CakeEventManager::attach()` Accepts three arguments. The leftmost one is
the callback itself, anything that PHP can treat as a callable function. The second
argument is the event name, and the callback will only get fired if the `CakeEvent`
object dispatched has a matching name. The last argument is an array of options to
configure the callback priority, and the preference of arguments to be passed.

Registering listeners
---------------------

Listeners are an alternative, and often cleaner way of registering callbacks for
an event. This is done by implementing the :php:class:`CakeEventListener` interface
in any class you wish to register some callbacks. Classes implementing it need to
provide the ``implementedEvents()`` method and return an associative array with all
events names that the class will handle.

To keep up with our previous example, let's imagine we have a UserStatistic class
responsible for calculating useful information and compiling into the global site
statistics. It would be natural to pass an instance of this class as a callback,
instead of implementing a custom static function or converting any other workaround
to trigger methods in this class. A listener is created as follows::

    <?php
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
    $statistics = new UserStatistic;
    $this->Order->getEventManager($statistics);

As you can see in the above code, the `attach` function can handle instances of
the `CakeEventListener` interface. Internally the event manager will read the
array returned by `implementedEvents` method and wire the callbacks accordingly.

Establishing priorities
-----------------------

In some cases you'd want to run a callback and make sure it gets executed before,
or after all the other callbacks have been run. For instance, think again about
our user statistics example. It would make sense to only run this method only
when we can make sure the event was not cancelled, there were no errors and the
other callbacks did not change the state of the order itself. For those cases you
use priorities.

Priorities are handled using a number associated to the callback itself. The higher
the number, the later the method will be fired. Default priority for all callbacks
and listener method is set to `10`. If you need your method to be run before, then
using any value below this default will help you do it, even setting the priority
to `1` or a negative value should work. On the other hand if you desire to run the
callback after the others, using a number above `10` will do.

If two callbacks happen to be allocated in the same priority queue, they will be
executed with a `FIFO` policy, the first listener method to be attached is called
first and so on. You set priorities using the `attach` method for callbacks, and
declaring it in the `implementedEvents` function for event listeners::

    <?php
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
instead of receiving the event object. While this is a odd preference and using
the event object is a lot more powerful, this was needed to provide backwards
compatibility with the previous event system and to offer seasoned developers an
alternative to what they were used to.

In order to toggle this option you have to add the `passParams` options to the
third argument of the `attach` method, or declare it in the `implementedEvents`
returned array similar to what you do with priorities::

    <?php
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
receiving `$orderData` instead of the `$event` object. This is so, because in our
previous example we trigger the `Model.Order.afterPlace` event with some data::

    <?php
    $this->getEventManager()->dispatch(new CakeEvent('Mode.Order.afterPlace', $this, array(
        'order' => $order
    )));

.. note::

    The params can only be passed as function arguments if the event data is an array.
    Any other data type cannot be converted to function parameters, thus not using
    this option is often the most adequate choice.

Stopping events
---------------

There are circumstances where you will need to stop events so the operation that
started it is cancelled. You see example of this in the model callbacks
(e.g. beforeSave) in which it is possible to stop the saving operation if
the code detects it cannot proceed any further.

In order to stop events you can either return `false` in your callbacks or call
the `stopPropagation` method on the event object::

    <?php
    public function doSomething($event) {
        // ...
        return false; // stops the event
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

Stopping an event can have two different effects. The first one van always be
expected: any callback after the event was stopped will no be called. The second
consequence is optional and it depends on the code triggering the event, for
instance, in our `afterPlace` example it would not make any sense to cancel the
operation since the data was already saved and the cart emptied. Nevertheless, if
we had a `beforePlace` stopping the event has a valid meaning.

To check if an event was stopped, you call the `isStopped()` method in the event object::

    <?php
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

    <?php
    // A listener callback
    public function doSomething($event) {
        // ...
        $alteredData = $event->data['order']  + $moreData;
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

    <?php
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
    $this->getEventManager()->attach($listener);

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

Accessing the global event manager is as easy as calling an static function,
the following example will attach a global event to the `beforePlace` event::

    <?php
    // In any configuration file or piece of code that executes before the event
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach($aCallback, 'Model.Order.beforePlace');

As you can see, we just change how we get access to a event manager instance,
and we can apply the same concepts we learned before about triggering, attaching,
detaching, stopping events, etc.

One important thing you should consider is that there are events that will be
triggered having the same name but different subjects, so checking it in the event
object is usually required in any function that gets attached globally in order
to prevent some bugs. Remember that extreme flexibility implies extreme complexity.

Consider this callback that wants to listen for all Model beforeFinds but in
reality, it cannot do its logic if the model is the Cart::

    <?php
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach('myCallback', 'Model.beforeFind');

    function myCallback($event) {
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
quite the opposite, it will make the harder to read. Whereas in contrast, if you
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