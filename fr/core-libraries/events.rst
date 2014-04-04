Événements système
##################

La création d'applications maintenables est à la fois une science et un art.
Il est connu que la clé pour avoir des codes de bonne qualité est d'avoir
un couplage plus lâche et une cohésion plus élevée. La cohésion signifie
que toutes les méthodes et propriétés pour une classe sont fortement
reliés à la classe elle même et non pas d'essayer de faire le travail
que d'autre objets devraient faire, tandis que un couplage plus lâche est la
mesure du degré de resserrement des interconnexions d'une classe aux objets
externes, et comment cette classe en dépend.

Tandis que la plupart des structures CakePHP et des librairies par défaut
vous aideront à atteindre ce but, il y a certains cas où vous avez besoin
de communiquer proprement avec les autres parties du système sans avoir à
coder en dur ces dépendances, ainsi réduire la cohésion et accroître le
couplage de classe. Un motif de conception (design pattern) très réussi dans
l'ingénierie software est le modèle obervateur (Observer pattern), où les
objets peuvent générer des événements et notifier à des écouteurs (listener)
possiblement anonymes des changements d'états internes.

Les écouteurs (listener) dans le modèle observateur (Observer pattern) peuvent
s'abonner à de tel événements et choisir d'interagir sur eux, modifier l'état
du sujet ou simplement faire des logs. Si vous avez utilisez JavaScript dans
le passé, vous avez la chance d'être déjà familier avec la programmation
événementielle.

CakePHP émule plusieurs aspects sur la façon dont les événements sont
déclenchés et managés dans des frameworks JavaScript comme le populaire
jQuery, tout en restant fidèle à sa conception orientée objet. Dans cette
implémentation, un objet événement est transporté a travers tous les écouteurs
qui détiennent l'information et la possibilité d'arrêter la propagation des
événements à tout moment. Les écouteurs peuvent s'enregistrer eux-mêmes ou
peuvent déléguer cette tâche a d'autres objets et avoir la chance de modifier
l'état et l'événement lui-même pour le reste des callbacks.

Le sous-système d'évènement est au coeur des callbacks du Model, du Behavior,
du Controller, de la View et du Helper. Si vous n'avez jamais utilisé aucun
d'eux, vous êtes quelque part déjà familiarisé avec les évènements dans
CakePHP.

Exemple d'Utilisation d'Evenement
=================================

Imaginons que vous être en train de construire un plugin Caddie, mais vous ne
voulez pas vraiment l'encombrer avec une logique d'expédition, expédier un mail
à l'utilisateur ou décrémenter les articles depuis le stock, c'est votre
souhait de traiter tout cela séparément dans un autre plugin ou dans le code de
l'application. Typiquement, quand vous n'utilisez pas directement le modèle
observateur(observer pattern) vous voudriez faire cela en attachant des
behaviors à la volée à vos modèles, et peut être quelques components aux
controllers.

A la place, vous pouvez utiliser les évènements pour vous permettre de séparer
clairement ce qui concerne votre code et permet des préoccupations
supplémentaires pour hook dans votre plugin en utilisant les évènements. Par
exemple dans votre plugin Cart, vous avez un model Order qui gère la création
des orders. Vous voulez notifier le reste de l'application qu'un order a été
créé. Pour garder votre model Order propre, vous pouvez utiliser les
évènements::

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

Le code ci-dessus vous permet de facilement notifier aux autres parties de
l'application qu'un order a été créé. Vous pouvez ensuite faire les tâches
comme envoyer les notifications par mail, mettre à jour le stock, log des
statistiques pertinents et d'autres tâches dans les objets séparés qui se
focalisent sur ces préoccupations.

Accéder aux Gestionnaires d'Evènement
=====================================

Dans CakePHP, les évènements sont attrapés par les gestionnaires d'évènement.
Les gestionnaires d'Evènement sont disponible dans chaque Table, View et
Controller en utilisant ``getEventManager()``::

    $events = $this->getEventManager();

Chaque model a un gestionnaire d'événement séparé, alors que View et
Controller en partagent un. Cela permet aux événements de model d'être
autonomes, et permet aux components ou aux controllers d'agir sur les
événements créés dans la vue si nécessaire.

Le gestionnaire d'événement global
==================================

In addition to instance level event managers, CakePHP provides a global event
manager that allows you to listen to any event fired in an application. This
is useful when attaching listeners to a specific instance might be cumbersome or
difficult. The global manager is a singleton instance of
:php:class:`Cake\\Event\\EventManager` that receives every event **before** the instance
managers do. In addition to receiving events first, the global manager also
maintains a separate priority stack for listeners. Once an event has been
dispatched to the global manager, it will be dispatched to the instance level
manager. You can access the global manager using a static method::

    // In any configuration file or piece of code that executes before the event
    use Cake\Event\EventManager;

    EventManager::instance()->attach(
        $aCallback,
        'Model.Order.afterPlace'
    );

One important thing you should consider is that there are events that will be
triggered having the same name but different subjects, so checking it in the
event object is usually required in any function that gets attached globally in
order to prevent some bugs. Remember that with the flexibility of using the
global manager, some additional complexity is incurred.

:php:meth:`Cake\\Event\\EventManager::dispatch()` method accepts the event object
as an argument and notifies all listener and callbacks passing this object
along. The listeners will handle all the extra logic around the
``afterPlace`` event, you can log the time, send emails, update user statistics
possibly in separate objects and even delegating it to offline tasks if you have
the need.

Dispatching Events
==================

Once you have obtained an instance of an event manager you can dispatch events
using :php:meth:`~Cake\\Event\\EventManager::dispatch()`. This method takes an instance
of the :php:class:`Cake\\Event\\Event` class. Let's look at dispatching an event::

    // Create a new event and dispatch it.
    $event = new Event('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->getEventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` accepts 3 arguments in its constructor. The first one is
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

The :php:meth:`~Cake\\Event\\EventManager::dispatch()` method accepts an event object as an argument
and notifies all subscribed listeners.

Registering Listeners
=====================

Listeners are the preferred way to register callbacks for an event. This is done by
implementing the :php:class:`Cake\\Event\\EventListener` interface in any class you wish
to register some callbacks. Classes implementing it need to provide the
``implementedEvents()`` method. This method must return an associative array
with all event names that the class will handle.

To continue our previous example, let's imagine we have a UserStatistic class
responsible for calculating a user's purchasing history, and compiling into global site
statistics. This is a great place to use a listener class. Doing so allows you concentrate the statistics
logic in one place and react to events as necessary. Our ``UserStatistics``
listener might start out like::

    use Cake\Event\EventListener;

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
of the ``EventListener`` interface. Internally, the event manager will use
``implementedEvents`` to attach the correct callbacks.

Registering Anonymous Listeners
-------------------------------

While event listener objects are generally a better way to implement listeners,
you can also bind any ``callable`` as an event listener. For example if we
wanted to put any orders into the log files, we could use a simple anonymous
function to do so::

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

.. _event-priorities:

Establishing Priorities
-----------------------

In some cases you might want to control the order that listeners are invoked.
For instance, if we go back to our user statistics example. It would ideal if
this listener was called at the end of the stack. By calling it at the end of
the listener stack, we can ensure that the event was not canceled, and that no
other listeners raised exceptions. We can also get the final state of the
objects in the case that other listeners have modified the subject or event
object.

Priorities are defined as an integer when adding a listener. The higher the
number, the later the method will be fired. The default priority for all
listeners is ``10``. If you need your method to be run earlier, using any value
below this default will work. On the other hand if you desire to run the
callback after the others, using a number above ``10`` will do.

If two callbacks happen to have the same priority value, they will be executed
with a the order they were attached. You set priorities using the ``attach``
method for callbacks, and declaring it in the ``implementedEvents`` function for
event listeners::

    // Setting priority for a callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach(
        $callback,
        'Model.Order.afterPlace',
        array('priority' => 2)
    );

    // Setting priority for a listener
    class UserStatistic implements EventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array(
                    'callable' => 'updateBuyStatistic',
                    'priority' => 100
                ),
            );
        }
    }

As you see, the main difference for ``EventListener`` objects is that you need
to use an array for specifying the callable method and the priority preference.
The ``callable`` key is an special array entry that the manager will read to know
what function in the class it should be calling.

Getting Event Data as Function Parameters
-----------------------------------------

When events have data provided in their constructor, the provided data is
converted into arguments for the listeners. An example from the View layer is
the afterRender callback::

    $this->getEventManager()
        ->dispatch(new Event('View.afterRender', $this, [$viewFileName]));

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


Stopping Events
---------------

Much like DOM events, you may want to stop an event to prevent additional
listeners from being notified. You can see this in action during model callbacks
(e.g. beforeSave) in which it is possible to stop the saving operation if
the code detects it cannot proceed any further.

In order to stop events you can either return ``false`` in your callbacks or call
the ``stopPropagation`` method on the event object::

    public function doSomething($event) {
        // ...
        return false; // stops the event
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

Stopping an event will prevent any additional callbacks from being called.
Additionally the code triggering the event may behave differently based on the
event being stopped or not. Generally it does not make sense to stop 'after'
events, but stopping 'before' events is often used to prevent the entire
operation from occurring.

To check if an event was stopped, you call the ``isStopped()`` method in the event object::

    public function place($order) {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
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
during the ``beforePlace`` process.

Getting Event Results
---------------------

Every time a callback returns a value, it gets stored in the ``$result``
property of the event object. This is useful when you want to allow callbacks to
modify the event execution. Let's take again our ``beforePlace`` example and let
callbacks modify the $order data.

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
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->getEventManager()->dispatch($event);
        if (!empty($event->result['order'])) {
            $order = $event->result['order'];
        }
        if ($this->Order->save($order)) {
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

If for any reason you want to remove any callback from the event manager just call
the :php:meth:`Cake\\Event\\EventManager::detach()` method using as arguments the first two
params you used for attaching it::

    // Attaching a function
    $this->getEventManager()->attach([$this, 'doSomething'], 'My.event');

    // Detaching the function
    $this->getEventManager()->detach([$this, 'doSomething'], 'My.event');

    // Attaching an anonymous function.
    $myFunction = function($event) { ... };
    $this->getEventManager()->attach($myFunction, 'My.event');

    // Detaching the anonymous function
    $this->getEventManager()->detach($myFunction, 'My.event');

    // Attaching a CakeEventListener
    $listener = new MyEventLister();
    $this->getEventManager()->attach($listener);

    // Detaching a single event key from a listener
    $this->getEventManager()->detach($listener, 'My.event');

    // Detaching all callbacks implemented by a listener
    $this->getEventManager()->detach($listener);

Conclusion
==========

Les événements sont une bonne façon de séparer les préoccupations dans
votre application et rend les classes a la fois cohérentes et découplées des
autres, néanmoins l'utilisation des événements n'est pas la solution
à tous les problèmes. Les Events peuvent être utilisés pour découpler le code
de l'application et rendre les plugins extensibles.

Gardez à l'esprit que beaucoup de pouvoir implique beaucoup de responsabilité.
Utiliser trop d'events peut rendre le debug plus difficile et nécessite des
tests d'intégration supplémentaires.

Lecture Supplémentaire
======================

.. toctree::
    :maxdepth: 1

    /orm/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=fr: Événements système
    :keywords lang=fr: events, événements, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
