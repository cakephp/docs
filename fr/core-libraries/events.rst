Événements système
##################

La création d'applications maintenables est à la fois une science et un art.
Il est bien connu que la clé pour avoir un code de bonne qualité est d'avoir
un couplage plus lâche et une cohésion plus élevée. La cohésion signifie
que toutes les méthodes et propriétés pour une classe sont fortement liées à la
classe elle-même et qu'elles n'essaient pas de faire le travail que d'autre
objets devraient faire, alors qu'un couplage plus lâche est la mesure du degré
de connexions d'une classe par rapport aux objets externes, et comment cette
classe en dépend.

Alors que la plupart des structures CakePHP et des librairies par défaut vous
aideront à atteindre ce but, il y a certains cas où vous avez besoin de
communiquer proprement avec les autres parties du système sans avoir à coder en
dur ces dépendances, ce qui réduit la cohésion et augmente le couplage de
classe. Un motif de conception (design pattern) fonctionnant très bien dans
l'ingénierie software est le modèle obervateur (Observer pattern), où les objets
peuvent générer des événements (events) et notifier à des écouteurs (listener)
possiblement anonymes des changements d'états internes.

Les écouteurs (listener) dans le modèle observateur (Observer pattern) peuvent
s'abonner à de tels événements et choisir d'agir sur eux, modifier l'état du
sujet ou simplement créer des fichiers de logs. Si vous avez utilisé JavaScript
dans le passé, vous avez la chance d'être déjà familier avec la programmation
événementielle.

CakePHP émule plusieurs aspects sur la façon dont les événements sont déclenchés
et managés dans des frameworks JavaScript comme le populaire jQuery, tout en
restant fidèle à sa conception orientée objet. Dans cette implémentation, un
objet événement est transporté a travers tous les écouteurs qui détiennent
l'information et la possibilité d'arrêter la propagation des événements à tout
moment. Les écouteurs peuvent s'enregistrer eux-mêmes ou peuvent déléguer cette
tâche a d'autres objets et peuvent modifier l'état et l'événement lui-même pour
le reste des callbacks.

Le sous-système d'événement est au cœur des callbacks de Model, de Behavior, de
Controller, de View et de Helper. Si vous avez déjà utilisé l'un d'eux, vous
êtes quelque part déjà familiarisé avec les événements dans CakePHP.

Exemple d'Utilisation d'Événement
=================================

Imaginons que vous être en train de construire un plugin Caddie, mais que vous
ne voulez pas vraiment l'encombrer avec une logique d'expédition, expédier un
mail à l'utilisateur ou décrémenter les articles depuis le stock, c'est votre
souhait de traiter tout cela séparément dans un autre plugin ou dans le code de
l'application. Typiquement, quand vous n'utilisez pas directement le modèle
observateur (observer pattern) vous feriez cela en attachant des behaviors à la
volée à vos models, et peut être quelques components aux controllers.

A la place, vous pouvez utiliser les événements pour vous permettre de séparer
clairement ce qui concerne votre code et permettre d'ajouter des besoins
supplémentaires dans votre plugin en utilisant les événements. Par exemple dans
votre plugin Cart, vous avez un model Order qui gère la création des commandes.
Vous voulez notifier au reste de l'application qu'une commande a été créée. Pour
garder votre model Order propre, vous pouvez utiliser les événements::

    // Cart/Model/Table/OrdersTable.php
    namespace Cart\Model\Table;

    use Cake\Event\Event;
    use Cake\ORM\Table;

    class Order extends Table
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

Le code ci-dessus vous permet de notifier aux autres parties de l'application
qu'une commande a été créée. Vous pouvez ensuite faire des tâches comme envoyer
les notifications par mail, mettre à jour le stock, créer un fichier de log des
statistiques pertinents et d'autres tâches dans les objets séparés qui se
focalisent sur ces préoccupations.

Accéder aux Gestionnaires d'Événements
======================================

Dans CakePHP, les événements sont attrapés par les gestionnaires d'événements.
Les gestionnaires d'événements sont disponible dans chaque Table, View et
Controller en utilisant ``eventManager()``::

    $events = $this->eventManager();

Chaque Model a un gestionnaire d'événements séparé, alors que View et Controller
en partagent un. Cela permet aux événements de Model d'être autonomes, et permet
aux components ou aux controllers d'agir sur les événements créés dans la vue si
nécessaire.

Le Gestionnaire d'Événement Global
----------------------------------

En plus des gestionnaires au niveau des instances d'événement, CakePHP fournit
un gestionnaire d'événements global qui vous permet d'écouter tout événement
déclenché dans une application. C'est utile quand attacher des écouteurs à une
instance spécifique semble lent ou difficile. Le gestionnaire global est une
instance singleton de :php:class:`Cake\\Event\\EventManager` qui reçoit chaque
événement **avant** que les gestionnaires d'instance ne le reçoivent. En plus de
recevoir les événements en premier, le gestionnaire global maintient aussi une
pile de priorité distincte pour les écouteurs. Une fois qu'un événement a été
dispatché au gestionnaire global, il sera dispatché au gestionnaire au niveau de
l'instance. Vous pouvez accéder au gestionnaire global en utilisant une méthode
statique::

    // Dans tout fichier de configuration ou partie de code qui s'execute avant l'événement
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Model.Order.afterPlace',
        $aCallback
    );

Une chose importante que vous devriez considérer est que les événements qui
seront attrapés auront le même nom mais des sujets différents, ainsi le vérifier
dans l'objet event est habituellement nécessaire dans toute fonction qui devient
attachée globalement afin d'éviter tout bug. Rappelez-vous que la flexibilité du
gestionnaire global entraîne une complexité supplémentaire à gérer.

La méthode :php:meth:`Cake\\Event\\EventManager::dispatch()` accepte l'objet
event en argument et notifie à tous les écouteurs et les callbacks qui passent
cet objet. Les écouteurs vont gérer toute la logique supplémentaire autour de
l'événement ``afterPlace``, vous pouvez faire le log du time, envoyer les
emails, mettre à jour les statistiques d'un utilisateur, si possible dans des
objets séparés et même le déléguer à des tâches offline si vous avez ce
besoin.

.. _tracking-events:

Suivre la Trace des Événements
------------------------------

Pour garder une liste des événements qui sont déclenchés pour un
``EventManager`` en particulier, vous pouvez activer le tracking d'événements.
Pour ce faire, attachez simplement une :php:class:`Cake\\Event\\EventList` au
gestionnaire::

    EventManager::instance()->setEventList(new EventList());

Après avoir déclenché un événement sur le gestionnaire, vous pouvez le récupérer
à partir de la liste d'événements::

    $eventsFired = EventManager::instance()->getEventList();
    $firstEvent = $eventsFired[0];

Le tracking peut être désactivé en retirant la liste d'événements ou en appelant
:php:meth:`Cake\\Event\\EventList::trackEvents(false)`

.. versionadded:: 3.2.11
    Le tracking d'événements et :php:class:`Cake\\Event\\EventList` ont été
    ajoutés.

Events du Cœur
==============

Il y a de certain nombre d'événements du cœur du framework que votre application
peut écouter. Chaque couche de CakePHP émet des événements que vous pouvez
écouter dans votre application.

* :ref:`Events de l'ORM et du Model<table-callbacks>`
* :ref:`Events du Controller<controller-life-cycle>`
* :ref:`Events de View<view-events>`

.. _registering-event-listeners:

Enregistrer les Listeners
=========================

Les listeners (écouteurs) sont le meilleur moyen d'enregistrer les callbacks
pour un événement. Ceci est fait en intégrant l'interface
:php:class:`Cake\\Event\\EventListenerInterface` dans toute classe dans laquelle
vous souhaitez enregistrer des callbacks. Les classes l'intégrant ont besoin de
fournir la méthode ``implementedEvents()``. Cette méthode doit retourner un
tableau associatif avec tous les noms d'événement que la classe va gérer.

Pour continuer notre exemple précédent, imaginons que nous ayons une classe
UserStatistic qui s'occupe de calculer l'historique des achats d'un utilisateur
et les compile dans des statistiques globales du site. C'est un bon cas pour
utiliser une classe listener. Faire ceci vous permet aussi de vous concentrer
sur la logique des statistiques à un endroit et de réagir aux événements si
nécessaire. Notre écouteur ``UserStatistics`` pourrait commencer comme ceci::

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
            // Code to update statistics
        }
    }

    // Attache l'objet UserStatistic au gestionnaire globale d'événements de la Commande
    $statistics = new UserStatistic();
    $this->Order->eventManager()->on($statistics);

Comme vous pouvez le voir dans le code ci-dessus, la fonction ``on()`` va
accepter les instances de l'interface ``EventListener``. En interne, le
gestionnaire d'événements va utiliser ``implementedEvents()`` pour attacher
les bons callbacks.

Enregistrer des Écouteurs Anonymes
----------------------------------

Alors que les objets listener d'événement sont généralement une meilleure façon
d'intégrer des listeners, vous pouvez aussi lier tout ``callable`` comme un
listener d'événement. Par exemple si nous souhaitons mettre toutes les commandes
dans des fichiers de log, nous pourrions utiliser une simple fonction anonyme
pour le faire::

    use Cake\Log\Log;

    $this->Orders->eventManager()->on('Model.Order.afterPlace', function ($event) {
        Log::write(
            'info',
            'A new order was placed with id: ' . $event->getSubject()->id
        );
    });

En plus des fonctions anonymes, vous pouvez utiliser tout autre type callable
que PHP supporte::

    $events = [
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => [$this->InventoryManager, 'decrement'],
    ];
    foreach ($events as $callable) {
        $eventManager->on('Model.Order.afterPlace', $callable);
    }

Quand vous travaillez avec des plugins qui ne déclenchent pas d'événement
spécifique, vous pouvez utiliser les listeners d'événements sur les événements
utilisés par défaut. Prenons un exemple d'un plugin 'UserFeedback' qui gère les
formulaires de feedback des utilisateurs. A partir de votre application, vous
voudrez savoir quand un enregistrement Feedback a été enregistré et en
définitive agir sur lui. Vous pourriez écouter l'événement global
``Model.afterSave``. Cependant, vous pouvez utiliser une approche plus directe
et écouter seulement l'événement dont vous avez réellement besoin::

    // Vous pouvez créer ce qui suit avant l'opération de sauvegarde
    // par exemple dans config/bootstrap.php
    use Cake\ORM\TableRegistry;
    // Si envoi d'emails
    use Cake\Mailer\Email;

    TableRegistry::get('ThirdPartyPlugin.Feedbacks')
        ->eventManager()
        ->on('Model.afterSave', function($event, $entity)
        {
            // Par exemple nous pouvons envoyer un email à l'admin
            $email = new Email('default');
            $email->from('info@yoursite.com' => 'Your Site')
                ->setTo('admin@yoursite.com')
                ->setSubject('New Feedback - Your Site')
                ->send('Body of message');
        });

Vous pouvez utiliser cette même approche pour lier les objets listener.

Interagir avec les Listeners Existants
--------------------------------------

En supposant que plusieurs écouteurs d'événements ont été enregistrés, la
présence ou l'absence d'un modèle d'événements particulier peut être utilisé
comme base de certaines actions::

    // Attacher les écouteurs au EventManager.
    $this->eventManager()->on('User.Registration', [$this, 'userRegistration']);
    $this->eventManager()->on('User.Verification', [$this, 'userVerification']);
    $this->eventManager()->on('User.Authorization', [$this, 'userAuthorization']);

    // Quelque part ailleurs dans votre application.
    $events = $this->eventManager()->matchingListeners('Verification');
    if (!empty($events)) {
        // Perform logic related to presence of 'Verification' event listener.
        // For example removing the listener if present.
        $this->eventManager()->off('User.Verification');
    } else {
        // Logique liée à l'absence de l'écouteur d'événement 'Verification'
    }

.. note::

    Le modèle passé à la méthode ``matchingListeners`` n'est pas sensible à la
    casse.

.. versionadded:: 3.2.3

    La méthode ``matchingListeners`` retourne un tableau d'événements qui
    matchent un patron de recherche.

.. _event-priorities:

Etablir des Priorités
---------------------

Dans certains cas vous voulez contrôler la commande que les listeners appellent.
Par exemple, si nous retournons à notre exemple des statistiques d'utilisateur.
Ce serait idéal si le listener était appelé à la fin de la pile. En l'appelant
à la fin de la pile, nous pouvons assurer que l'événement n'a pas été annulé
et qu'aucun autre listener ne lève d'exception. Nous pouvons aussi obtenir
l'état final des objets dans le cas où d'autres listeners ont modifié le sujet
ou l'objet event.

Les priorités sont définies comme un nombre entier lors de l'ajout d'un
listener. Plus le nombre est haut, plus la méthode sera lancée tardivement. La
priorité par défaut pour tous les listeners est ``10``. Si vous avez besoin que
votre méthode soit lancée plus tôt, en utilisant toute valeur avant que celle
par défaut ne fonctionne. D'un autre côté, si vous souhaitez lancer le callback
après les autres, utiliser un nombre au-dessus de ``10`` le fera.

Si deux callbacks ont la même valeur de priorité, elles seront exécutées selon
l'ordre dans lequel elles ont été attachées. Vous définissez les priorités en
utilisant la méthode ``on`` pour les callbacks et en la déclarant dans la
fonction ``implementedEvents()`` pour les listeners d'événement::

    // Définir la priorité pour un callback
    $callback = [$this, 'doSomething'];
    $this->eventManager()->on(
        'Model.Order.afterPlace',
        ['priority' => 2],
        $callback
    );

    // Définir la priorité pour un listener
    class UserStatistic implements EventListener
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

Comme vous le voyez, la principale différence pour les objets ``EventListener``
est que vous avez besoin d'utiliser un tableau pour spécifier la méthode
callable et la préférence de priorité. La clé ``callable`` est une entrée de
tableau spécial que le gestionnaire va lire pour savoir quelle fonction dans la
classe il doit appeler.

Obtenir des Données d'Event en Paramètres de Fonction
-----------------------------------------------------

Quand les événements ont des données fournies dans leur constructeur, les
données fournies sont converties en arguments pour les listeners. Un exemple
de la couche View est la callback afterRender::

    $this->eventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

Les listeners de la callback ``View.afterRender`` doivent avoir la signature
suivante::

    function (Event $event, $viewFileName)

Chaque valeur fournie au constructeur d'Event sera convertie dans les paramètres
de fonction afin qu'ils apparaissent dans le tableau de données. Si vous
utilisez un tableau associatif, les résultats de ``array_values`` vont
déterminer l'ordre des arguments de la fonction.

.. note::

    Au contraire de 2.x, convertir les données d'événement en arguments du
    listener est le comportement par défaut et ne peut pas être désactivé.

Dispatcher les Events
=====================

Une fois que vous avez obtenu une instance du gestionnaire d'événements, vous
pouvez dispatcher les événements en utilisant
:php:meth:`~Cake\\Event\\EventManager::dispatch()`. Cette méthode prend une
instance de la classe :php:class:`Cake\\Event\\Event`. Regardons le dispatch
d'un événement::

    // Crée un nouvel événement et le dispatch.
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->eventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` accepte 3 arguments dans son constructeur. Le
premier est le nom de l'événement, vous devriez essayer de garder ce nom aussi
unique que possible, en le rendant lisible. Nous vous suggérons une convention
comme suit: ``Layer.eventName`` pour les événements généraux qui arrivent
au niveau couche (par ex ``Controller.startup``, ``View.beforeRender``) et
``Layer.Class.eventName`` pour les événements qui arrivent dans des classes
spécifiques sur une couche, par exemple ``Model.User.afterRegister`` ou
``Controller.Courses.invalidAccess``.

Le deuxième argument est le ``subject``, c'est à dire l'objet associé à
l'événement, comme une classe attrape les événements sur elle-même, utiliser
``$this`` sera le cas le plus commun.
Même si un :php:class:`Component` peut aussi déclencher les événements d'un
controller. La classe subject est importante parce que les écouteurs auront un
accès immédiat aux propriétés de l'objet et pourront les inspecter ou les
changer à la volée.

Au final, le troisième argument est une donnée d'événement supplémentaire. Ceci
peut être toute donnée que vous considérez utile de passer pour que les
écouteurs puissent agir sur eux. Alors que ceci peut être un argument de tout
type, nous vous recommandons de passer un tableau associatif.

La méthode :php:meth:`~Cake\\Event\\EventManager::dispatch()` accepte un objet
event en argument et notifie à tous les écouteurs qui sont abonnés.

.. _stopping-events:

Stopper les Events
------------------

Un peu comme les événements DOM, vous voulez peut-être stopper un événement pour
éviter aux autres listeners d'être notifiés. Vous pouvez voir ceci pendant les
callbacks de mode(par ex beforeSave) dans lesquels il est possible de stopper
l'opération de sauvegarde si le code détecte qu'il ne peut pas continuer.

Afin de stopper les événements, vous pouvez soit retourner ``false`` dans vos
callbacks ou appeler la méthode ``stopPropagation()`` sur l'objet event::

    public function doSomething($event)
    {
        // ...
        return false; // stoppe l'event
    }

    public function updateBuyStatistic($event)
    {
        // ...
        $event->stopPropagation();
    }

Stopper un événement va éviter à toute callback supplémentaire d'être appelée.
En plus, le code attrapant l'événement peut se comporter différemment selon que
l'événement est stoppé ou non. Généralement il n'est pas sensé stopper 'après'
les événements, mais stopper 'avant' les événements est souvent utilisé pour
empêcher toutes les opérations de se passer.

Pour vérifier si un événement a été stoppé, vous appelez la méthode
``isStopped()`` dans l'objet event::

    public function place($order)
    {
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

Dans l'exemple précédent, l'ordre ne serait pas sauvegardé si l'événement est
stoppé pendant le processus ``beforePlace``.

Obtenir des Résultats d'Evenement
---------------------------------

A chaque fois qu'un callback retourne une valeur non nulle et non false, elle
sera stockée dans la propriété ``$result`` de l'objet event. C'est utile quand
vous voulez permettre aux callbacks de modifier l'exécution de l'événement.
Prenons à nouveau notre exemple ``beforePlace`` et laissons les callbacks
modifier la donnée ``$order``.

Les résultats d'Event peuvent être modifiés soit en utilisant directement la
propriété de résultat de l'objet event, soit en retournant la valeur dans le
callback elle-même::

    // Un callback listener
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;
        return $alteredData;
    }

    // Un autre callback listener
    public function doSomethingElse($event)
    {
        // ...
        $event->setResult(['order' => $alteredData] + $this->result());
    }

    // Utiliser les résultats d'event
    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->eventManager()->dispatch($event);
        if (!empty($event->getResult()['order'])) {
            $order = $event->getResult()['order'];
        }
        if ($this->Order->save($order)) {
            // ...
        }
        // ...
    }

Il est possible de modifier toute propriété d'un objet event et d'avoir les
nouvelles données passées à la prochaine callback. Dans la plupart des cas,
fournir des objets en données d'event ou en résultat et directement modifier
l'objet est la meilleure solution puisque la référence est la même et les
modifications sont partagées à travers tous les appels de callback.

Retirer les Callbacks et les Listeners
--------------------------------------

Si pour certaines raisons, vous voulez retirer toute callback d'un gestionnaire
d'événements, appelez seulement la méthode
:php:meth:`Cake\\Event\\EventManager::off()` en utilisant des arguments les deux
premiers paramètres que vous utilisiez pour l'attacher::

    // Attacher une fonction
    $this->eventManager()->on('My.event', [$this, 'doSomething']);

    // Détacher une fonction
    $this->eventManager()->off([$this, 'doSomething']);

    // Attacher une fonction anonyme.
    $myFunction = function ($event) { ... };
    $this->eventManager()->on('My.event', $myFunction);

    // Détacher la fonction anonyme
    $this->eventManager()->off('My.event', $myFunction);

    // Attacher un EventListener
    $listener = new MyEventLister();
    $this->eventManager()->on($listener);

    // Détacher une clé d'événement unique d'un listener
    $this->eventManager()->off('My.event', $listener);

    // Détacher tous les callbacks intégrés par un listener
    $this->eventManager()->off($listener);

Les événements sont une bonne façon de séparer les préoccupations dans votre
application et rend les classes à la fois cohérentes et découplées des autres,
néanmoins l'utilisation des événements n'est pas la solution à tous les
problèmes. Les Events peuvent être utilisés pour découpler le code de
l'application et rendre les plugins extensibles.

Gardez à l'esprit que beaucoup de pouvoir implique beaucoup de responsabilité.
Utiliser trop d'événements peut rendre le debug plus difficile et nécessiter des
tests d'intégration supplémentaires.

Lecture Supplémentaire
======================

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`

.. meta::
    :title lang=fr: Événements système
    :keywords lang=fr: events, événements, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
