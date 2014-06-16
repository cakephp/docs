Événements système
##################

La création d'applications maintenables est à la fois une science et un art.
Il est connu que la clé pour avoir des codes de bonne qualité est d'avoir
un couplage plus lâche et une cohésion plus élevée. La cohésion signifie
que toutes les méthodes et propriétés pour une classe sont fortement
liés à la classe elle-même et qu'elles n'essaient pas de faire le travail
que d'autre objets devraient faire, alors qu'un couplage plus lâche est la
mesure du degré de connexions d'une classe par rapport aux objets externes, et
comment cette classe en dépend.

Alors que la plupart des structures CakePHP et des librairies par défaut
vous aideront à atteindre ce but, il y a certains cas où vous avez besoin
de communiquer proprement avec les autres parties du système sans avoir à
coder en dur ces dépendances, ce qui réduit la cohésion et augmente le
couplage de classe. Un motif de conception (design pattern) fonctionnant très
bien dans l'ingénierie software est le modèle obervateur (Observer pattern), où
les objets peuvent générer des événements et notifier à des écouteurs (listener)
possiblement anonymes des changements d'états internes.

Les écouteurs (listener) dans le modèle observateur (Observer pattern) peuvent
s'abonner à de tels événements et choisir d'agir sur eux, modifier l'état
du sujet ou simplement créer des fihiers de logs. Si vous avez utilisé
JavaScript dans le passé, vous avez la chance d'être déjà familier avec la
programmation événementielle.

CakePHP émule plusieurs aspects sur la façon dont les événements sont
déclenchés et managés dans des frameworks JavaScript comme le populaire
jQuery, tout en restant fidèle à sa conception orientée objet. Dans cette
implémentation, un objet événement est transporté a travers tous les écouteurs
qui détiennent l'information et la possibilité d'arrêter la propagation des
événements à tout moment. Les écouteurs peuvent s'enregistrer eux-mêmes ou
peuvent déléguer cette tâche a d'autres objets et peuvent modifier
l'état et l'événement lui-même pour le reste des callbacks.

Le sous-système d'évènement est au coeur des callbacks de Model, de Behavior,
de Controller, de View et de Helper. Si vous avez déjà utilisé l'un
d'eux, vous êtes quelque part déjà familiarisé avec les évènements dans
CakePHP.

Exemple d'Utilisation d'Evenement
=================================

Imaginons que vous être en train de construire un plugin Caddie, mais que vous
ne voulez pas vraiment l'encombrer avec une logique d'expédition, expédier un
mail à l'utilisateur ou décrémenter les articles depuis le stock, c'est votre
souhait de traiter tout cela séparément dans un autre plugin ou dans le code de
l'application. Typiquement, quand vous n'utilisez pas directement le modèle
observateur (observer pattern) vous feriez cela en attachant des
behaviors à la volée à vos models, et peut être quelques components aux
controllers.

A la place, vous pouvez utiliser les évènements pour vous permettre de séparer
clairement ce qui concerne votre code et permettre d'ajouter des besoins
supplémentaires dans votre plugin en utilisant les évènements. Par
exemple dans votre plugin Cart, vous avez un model Order qui gère la création
des commandes. Vous voulez notifier au reste de l'application qu'une commande a
été créée. Pour garder votre model Order propre, vous pouvez utiliser les
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
                $this->eventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

Le code ci-dessus vous permet de facilement notifier aux autres parties de
l'application qu'une commande a été créée. Vous pouvez ensuite faire des tâches
comme envoyer les notifications par mail, mettre à jour le stock, créer un
fichier de log des statistiques pertinents et d'autres tâches dans les objets
séparés qui se focalisent sur ces préoccupations.

Accéder aux Gestionnaires d'Evènement
=====================================

Dans CakePHP, les évènements sont attrapés par les gestionnaires d'évènement.
Les gestionnaires d'Evènement sont disponible dans chaque Table, View et
Controller en utilisant ``eventManager()``::

    $events = $this->eventManager();

Chaque Model a un gestionnaire d'événement séparé, alors que View et
Controller en partagent un. Cela permet aux événements de Model d'être
autonomes, et permet aux components ou aux controllers d'agir sur les
événements créés dans la vue si nécessaire.

Le gestionnaire d'événement global
==================================

En plus d'instancier des gestionnaires au niveau evenement, CakePHP fournit un
gestionnaire d'evenement global qui vous permettent d'écouter tout evenement
déclenché dans une application. C'est utile quand attacher des écouteurs à une
instance spécifique peut être lent ou difficile. Le gestionnaire global
est une instance singleton de :php:class:`Cake\\Event\\EventManager` qui reçoit
chaque évenement **avant** que les gestionnaires d'instance le reçoivent. En
plus de recevoir les évenements en premier, le gestionnaire global maintient
aussi une pile de priorité distincte pour les écouteurs. Une fois qu'un
évenement a été dispatché au gestionnaire global, il sera dispatché au
gestionnaire au niveau de l'instance. Vous pouvez accéder au gestionnaire global
en utilisant une méthode statique::

    // Dans tout fichier de configuration ou partie de code qui s'execute avant l'evenement
    use Cake\Event\EventManager;

    EventManager::instance()->attach(
        $aCallback,
        'Model.Order.afterPlace'
    );

Une chose importante que vous devriez considérer est que les evenements qui
seront attrapés auront le même nom mais des sujets différents, ainsi le vérifier
dans l'objet event est habituellement nécessaire dans toute fonction qui
devient attachée globalement afin d'éviter tout bug. Rappelez-vous qu'avec la
flexibilité de l'utilisation de gestionnaire global, une complexité
supplémentaire est subie.

La méthode :php:meth:`Cake\\Event\\EventManager::dispatch()` accepte l'objet
event en argument et notifie à tous les écouteurs et les callbacks qui passent
cet object. Les écouteurs vont gérer toute la logique supplémentaire autour
de l'evenement ``afterPlace``, vous pouvez faire le log du time, envoyer les
emails, mettre à jour les statistiques d'utilisateur si possible dans des
objets séparés et même le déleguer à des tâches offlline si vous avez ce
besoin.

Dispatcher les Evenements
=========================

Une fois que vous avez obtenu une instance du gestionnaire d'event, vous pouvez
dispatcher les evenements en utilisant
:php:meth:`~Cake\\Event\\EventManager::dispatch()`. Cette méthode prend une
instance de la classe :php:class:`Cake\\Event\\Event`. Regardons le dispatch
d'un evenement::

    // Créé un nouvel évenement et le dispatch.
    $event = new Event('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->eventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` accepte 3 arguments dans son constructeur. Le
premier est le nom de l'event, vous devriez essayer de garder ce nom aussi
unique que possible, en le rendant lisible. Nous vous suggérons une convention
comme suit: ``Layer.eventName`` pour les évenements généraux qui arrivent
au niveau couche (par ex ``Controller.startup``,
``View.beforeRender``) et ``Layer.Class.eventName`` pour les evenements
qui arrivent dans des classes spécifiques sur une couche, par exemple
``Model.User.afterRegister`` ou ``Controller.Courses.invalidAccess``.

Le deuxième argument est le ``subject``, ce qui signifie que l'objet associé
à l'évenement, habituellement quand c'est la même classe attrapant les
évenements sur lui-même, en utilisant ``$this`` sera le cas le plus commun.
D'ailleurs un :php:class:`Component` puisse attraper aussi les evenements de
controller. La classe subject est importante parce que les écouteurs auront
un accès immédiat aux propriétés de l'objet et pourront les inspecter ou
les changer à la volée.

Au final, le troisième argument est une donnée d'evenement supplémentaire. Ceci
peut être tout donnée que vous considérez utile de passer autour pour que les
écouteurs puissent agir sur eux. Alors que ceci peut être un argument de tout
type, nous vous recommandons de passer un tableau associatif.

La méthode :php:meth:`~Cake\\Event\\EventManager::dispatch()` accepte un objet
event en argument et notifie à tous les écouteurs qui sont abonnés.

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
    $this->Order->eventManager()->attach($statistics);

As you can see in the above code, the ``attach`` function will accept instances
of the ``EventListener`` interface. Internally, the event manager will use
``implementedEvents`` to attach the correct callbacks.

Registering Anonymous Listeners
-------------------------------

While event listener objects are generally a better way to implement listeners,
you can also bind any ``callable`` as an event listener. For example if we
wanted to put any orders into the log files, we could use a simple anonymous
function to do so::

    $this->Order->eventManager()->attach(function($event) {
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
    $this->eventManager()->attach(
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

    $this->eventManager()
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
        $this->eventManager()->dispatch($event);
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
        $this->eventManager()->dispatch($event);
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
    $this->eventManager()->attach([$this, 'doSomething'], 'My.event');

    // Detaching the function
    $this->eventManager()->detach([$this, 'doSomething'], 'My.event');

    // Attaching an anonymous function.
    $myFunction = function($event) { ... };
    $this->eventManager()->attach($myFunction, 'My.event');

    // Detaching the anonymous function
    $this->eventManager()->detach($myFunction, 'My.event');

    // Attaching a CakeEventListener
    $listener = new MyEventLister();
    $this->eventManager()->attach($listener);

    // Detaching a single event key from a listener
    $this->eventManager()->detach($listener, 'My.event');

    // Detaching all callbacks implemented by a listener
    $this->eventManager()->detach($listener);

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
