Événements système
##################

.. versionadded:: 2.1

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
l'ingénierie software est le modèle observateur (Observer pattern), où les
objets peuvent générer des événements et notifier à des écouteurs (listener)
possiblement anonymes des changements d'états internes.

Les écouteurs (listener) dans le modèle observateur (Observer pattern) peuvent
s'abonner à de tels événements et choisir d'interagir sur eux, modifier l'état
du sujet ou simplement faire des logs. Si vous avez utilisez JavaScript dans
le passé, vous avez la chance d'être déjà familier avec la programmation
événementielle.

CakePHP émule plusieurs aspects sur la façon dont les événements sont
déclenchés et managés dans des frameworks JavaScript comme le populaire
jQuery, tout en restant fidèle à sa conception orientée objet. Dans cette
implémentation, un objet événement est transporté à travers tous les écouteurs
qui détiennent l'information et la possibilité d'arrêter la propagation des
événements à tout moment. Les écouteurs peuvent s'enregistrer eux-mêmes ou
peuvent déléguer cette tâche a d'autres objets et avoir la chance de modifier
l'état et l'événement lui-même pour le reste des callbacks.

Le sous-système d'event est au coeur des callbacks de Model, de Behavior, de
Controller, de View et de Helper. Si vous n'avez jamais utilisé aucun d'eux,
vous êtes déjà quelque part familier avec les events dans CakePHP.

Exemple d'Utilisation d'Event
=============================

Supposons que vous codez un Plugin de gestion de panier, et que vous vouliez
vous focaliser sur la logique lors de la commande. Vous ne voulez pas à ce
moment là inclure la logique pour l'expédition, l'email ou la décrémentation
du produit dans le stock, mais ce sont des tâches importantes pour les personnes
utilisant votre plugin. Si vous n'utilisiez pas les évènements vous auriez pu
implémenter cela en attachant des behaviors à vos modèles ou en ajoutant des
composants à votre controller. Typiquement, quand vous n’utilisez pas
directement le modèle observateur (observer pattern) vous feriez cela en
attachant des behaviors à la volée à vos models, et peut être quelques
components aux controllers.

A la place, vous pouvez utiliser les événements pour vous permettre de séparer
clairement ce qui concerne votre code et permettre d’ajouter des besoins
supplémentaires dans votre plugin en utilisant les événements. Par exemple dans
votre plugin Cart, vous avez un model Order qui gère la création des commandes.
Vous voulez notifier au reste de l’application qu’une commande a été créée. Pour
garder votre model Order propre, vous pouvez utiliser les événements::

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

Le code ci-dessus vous permet de notifier aux autres parties de l’application
qu’une commande a été créée. Vous pouvez ensuite faire des tâches comme envoyer
les notifications par mail, mettre à jour le stock, créer un fichier de log des
statistiques pertinentes et d’autres tâches dans des objets séparés qui se
focalisent sur ces préoccupations.

Accéder aux Gestionnaires d'Event
=================================

Dans CakePHP, les événements sont attrapés par les gestionnaires d’événements.
Les gestionnaires d’événements sont disponibles dans chaque Table, View et
Controller en utilisant ``getEventManager()``::

    $events = $this->getEventManager();

Chaque Model a un gestionnaire d’événements séparé, alors que View et Controller
en partagent un. Cela permet aux événements de Model d’être autonomes, et permet
aux components ou aux controllers d’agir sur les événements créés dans la vue si
nécessaire.

Le gestionnaire d'Event global
------------------------------

En plus des gestionnaires au niveau des instances d’événement, CakePHP fournit
un gestionnaire d’événements global qui vous permet d’écouter tout événement
déclenché dans une application. C’est utile quand attacher des écouteurs à une
instance spécifique semble lent ou difficile. Le gestionnaire global est une
instance singleton de :php:class:`CakeEventManager` qui reçoit chaque événement
avant que les gestionnaires d’instance ne le reçoivent. En plus de recevoir les
événements en premier, le gestionnaire global maintient aussi une pile de
priorité distincte pour les écouteurs. Une fois qu’un événement a été dispatché
au gestionnaire global, il sera dispatché au gestionnaire au niveau de
l’instance. Vous pouvez accéder au gestionnaire global en utilisant une méthode
statique::

    // Dans n'importe quel fichier de config ou morceau de code qui s'exécute avant l'événement
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach(
        $aCallback,
        'Model.Order.afterPlace'
    );

Un élément important que vous devriez considérer est qu'il y a des événements
qui seront déclenchés en ayant le même nom mais différents sujets, donc les
vérifier dans l'objet événement est généralement requis dans chacune des
fonctions qui sont attachées globalement pour éviter quelques bugs.
Souvenez-vous qu'une extrême flexibilité implique une extrême complexité.

.. versionchanged:: 2.5

    Avant 2.5, les listeners du gestionnaire global étaient gardés dans une
    liste séparée et déclenchés **avant** que les instances de listeners le
    soient.

Distribution des Events
=======================

Une fois obtenue l'instance d'un gestionnaire d'événement, vous pourrez distribuer
les événements via :php:meth:`~CakeEventManager::dispatch()`. Cette méthode prend en argument un instance
de la classe :php:class:`CakeEvent`. Regardons comment distribuer un événement::

    // Create a new event and dispatch it.
    $event = new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));
    $this->getEventManager()->dispatch($event);

:php:class:`CakeEvent` reçoit 3 arguments dans son constructeur. Le premier
est le nom de l'événement, vous devrez essayer de garder ce nom aussi unique
que possible, tout en le rendant lisible. Nous vous suggérons les conventions
suivantes: `Layer.eventName` pour les événements généraux qui surviennent à
un niveau de couche(ex:`Controller.startup`,`View.beforeRender` ) et
`Layer.Class.eventName` pour les événements qui surviennent dans une classe
spécifique sur une couche, par exemple `Model.User.afterRegister` ou
`Controller.Courses.invalidAccess`.

Le second argument est le sujet `subject`, ce qui signifie l'objet associé
à l'événement, habituellement quand c'est la même classe de déclenchement
d'événements que lui même, `$this` sera communément utilisé.
Bien que :php:class:`Component` pourrait lui aussi déclencher les événements
du controller. La classe du sujet est importante parce que les écouteurs
(listeners) auront des accès immédiats aux propriétés des objets et la chance
de les inspecter ou de les changer à la volée.

Finalement, le troisième argument est le paramètre d'événement. Ceci peut
être n'importe quelle donnée que vous considérez comme étant utile à passer
avec laquelle les écouteurs peuvent interagir. Même si cela peut être
n'importe quel type d'argument, nous vous recommandons de passer un tableau
associatif, pour rendre l'inspection plus facile.

La méthode :php:meth:`CakeEventManager::dispatch()` accepte les objets
événements comme arguments et notifie a tous les écouteurs et callbacks le
passage de cet objet. Ainsi les écouteurs géreront toute la logique autour
de l'événement `afterPlace`, vous pouvez enregistrer l'heure, envoyer des
emails, éventuellement mettre à jour les statistiques de l'utilisateur dans
des objets séparés et même déléguer cela à des tâches hors-ligne si vous
en avez besoin.

Enregistrer les écouteurs
-------------------------

Les écouteurs (Listeners) sont une alternative, et souvent le moyen le plus
propre d'enregistrer les callbacks pour un événement. Ceci est fait en
implémentant l'interface :php:class:`CakeEventListener` dans chacune de classes
ou vous souhaitez enregistrer des callbacks. Les classes l'implémentant doivent
fournir la méthode ``implementedEvents()`` et retourner un tableau associatif
avec tous les noms d'événements que la classe gérera.

Pour en revenir à notre exemple précédent, imaginons que nous avons une classe
UserStatistic responsable du calcul d'information utiles et de la compilation
de statistiques dans le site global. Ce serait naturel de passer une instance
de cette classe comme un callback, au lien d'implémenter une fonction statique
personnalisé ou la conversion de n'importe quel autre contournement
pour déclencher les méthodes de cette classe. Un écouteur (listener)
``UserStatistics`` est créé comme ci-dessous::

    // Dans app/Lib/Event/UserStatistic.php
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

    // Dans un controller ou à n'importe quel endroit où $this->Order est accessible
    // Attache l'objet UserStatistic au gestionnaire d'événement 'Order' (commande)
    $statistics = new UserStatistic();
    $this->Order->getEventManager()->attach($statistics);

Comme vous pouvez le voir dans le code ci-dessus, la fonction `attach` peut
manipuler les instances de l'interface `CakeEventListener`. En interne, le
gestionnaire d'événement lira le tableau retourné par la méthode
``implementedEvents`` et relie les callbacks en conséquence.

Enregistrer les Écouteurs Globaux
---------------------------------

Comme montré dans l'exemple ci-dessus, les écouteurs d'événement sont placés
par convention dans ``app/Lib/Event``. Suivre cette convention vous permet
de facilement localiser vos classes d'écouteurs. Il est aussi recommandé
d'attacher les écouteurs globaux pendant le processus de bootstrap de votre
application::

    // Dans app/Config/bootstrap.php

    // Charge les écouteurs d'événement globaux.
    require_once APP . 'Config' . DS . 'events.php'

Un exemple de fichier de bootstrap d'événement pour notre application de caddie
ressemblerait à ceci::

    // Dans app/Config/events.php

    // Charge les écouteurs d'événement
    App::uses('UserStatistic', 'Lib/Event');
    App::uses('ProductStatistic', 'Lib/Event');
    App::uses('CakeEventManager', 'Event');

    // Attache les écouteurs.
    CakeEventManager::instance()->attach(new UserStatistic());
    CakeEventManager::instance()->attach(new ProductStatistic());

Enregistrer les Écouteurs Anonymes
----------------------------------

Tandis que les objects d'écoute d'événements sont généralement une meilleure
manière d'implémenter les écouteurs, vous pouvez aussi attacher n'importe quel
``callable`` comme écouteur d'événement. Par exemple, si nous voulions
enregistrer chaque commande dans les fichiers de journalisation, nous
utiliserions une simple fonction anonyme pour le faire::

    // Les fonctions anonymes requièrent PHP 5.3+
    $this->Order->getEventManager()->attach(function($event) {
        CakeLog::write(
            'info',
            'A new order was placed with id: ' . $event->subject()->id
        );
    }, 'Model.Order.afterPlace');

En plus des fonctions anonymes, vous pouvez utiliser n'importe quel type de ``callable`` supporté par PHP::

    $events = array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
    );
    foreach ($events as $callable) {
        $eventManager->attach($callable, 'Model.Order.afterPlace');
    }

.. _event-priorities:

Établir des Priorités
---------------------

Dans certains cas, vous souhaitez exécuter un callback et être sûre qu'il sera
exécuté avant, ou après tous les autres callbacks déjà lancés. Par exemple,
repensons à notre exemple de statistiques utilisateur. Il serait judicieux
de n'exécuter cette méthode que si nous sommes sûrs que l'événement n'a pas
été annulé, qu'il n'y a pas d'erreur et que les autres callbacks n'ont pas
changés l'état de 'order' lui même. Pour ces raisons vous pouvez utiliser les
priorités.

Les priorités sont gérés en utilisant un nombre associé au callback lui même.
Plus haut est le nombre, plus tard sera lancée la méthode. Les priorités par
défaut des méthodes des callbacks et écouteurs sont définis à '10'. Si vous
voulez que votre méthode soit lancée avant, alors l'utilisation de n'importe
quelle valeur plus basse que cette valeur par défaut vous aidera à le faire,
même en mettant la priorité à `1` ou une valeur négative pourrait fonctionner.
D'une autre façon si vous désirez exécuter le callback après les autres,
l'usage d'un nombre au dessus de `10` fonctionnera.

Si deux callbacks se trouvent alloués avec le même niveau de priorité, ils
seront exécutés avec une règle `FIFO`, la première méthode d'écouteur
(listener) attachée est appelée en premier et ainsi de suite. Vous définissez
les priorités en utilisant la méthode `attach` pour les callbacks, et les
déclarer dans une fonction `implementedEvents` pour les écouteurs
d'événements::

    // Paramétrage des priorités pour un callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('priority' => 2));

    // Paramétrage des priorité pour un écouteur(listener)
    class UserStatistic implements CakeEventListener {
        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => array('callable' => 'updateBuyStatistic', 'priority' => 100),
            );
        }
    }

Comme vous pouvez le voir, la principale différence pour les objets
`CakeEventListener` c'est que vous avez à utiliser un tableau pour spécifier
les méthodes appelables et les préférences de priorités. La clé appelable
`callable` est une entrée de tableau spéciale que le gestionnaire (manager)
lira pour savoir quelle fonction dans la classe il devrait appeler.

Obtenir des Données d'Event comme Paramètres de Fonction
--------------------------------------------------------

Certain développeurs pourraient préférer avoir les données d'événements
passées comme des paramètres de fonctions au lieu de recevoir l'objet
événement. Bien que ce soit une préférence étrange et que l'utilisation d'objet
événement est bien plus puissant, ceci a été nécessaire pour fournir une
compatibilité ascendante avec le précédent système d'événement et pour offrir
aux développeurs chevronnés une alternative pour ce auquel ils sont habitués.

Afin de changer cette option, vous devez ajouter l'option `passParams` au
troisième argument de la méthode `attach`, ou le déclarer dans le tableau
de retour `implementedEvents` de la même façon qu'avec les priorités::

    // Paramétrage des priorités pour le callback
    $callback = array($this, 'doSomething');
    $this->getEventManager()->attach($callback, 'Model.Order.afterPlace', array('passParams' => true));

    // Paramétrage des priorités pour l'écouteur (listener)
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

Dans l'exemple ci-dessus la fonction `doSomething` et la méthode
`updateBuyStatistic` recevrons `$orderData` au lieu de l'objet `$event`.
C'est comme cela parce que dans notre premier exemple nous avons déclenché
l'événement `Model.Order.afterPlace` avec quelques données::

    $this->getEventManager()->dispatch(new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    )));

.. note::

    Les paramètres ne peuvent être passés comme arguments de fonction que
    si la donnée d'événement est un tableau. N'importe quel autre type de
    données sera converti en paramètre de fonction, ne pas utiliser cette
    option est souvent plus adéquate.

Stopper des Events
------------------

Il y a des circonstances ou vous aurez besoin de stopper des événements de
sorte que l'opération commencée est annulée. Vous voyez un exemple de cela
dans les callbacks des models (ex. beforesave) dans lesquels il est possible
de stopper une opération de sauvegarde si le code détecte qu'il ne peut pas
aller plus loin.

Afin de stopper les événements vous pouvez soit retourner `false` dans vos
callbacks ou appeler la méthode `stopPropagation` sur l'objet événement::

    public function doSomething($event) {
        // ...
        return false; // stoppe l'événement
    }

    public function updateBuyStatistic($event) {
        // ...
        $event->stopPropagation();
    }

Stopper un événement peut avoir deux effets différents. Le premier peut
toujours être attendu; n'importe quel callback après l'événement qui à
été stoppé ne sera appelé. La seconde conséquence est optionnelle et dépend
du code qui déclenche l'événement, par exemple, dans votre exemple
`afterPlace` cela n'aurait pas de sens d'annuler l'opération tant que les
données n'aurons pas toutes été enregistrées et le Caddie vidé. Néanmoins,
si nous avons une `beforePlace` arrêtant l'événement cela semble valable.

Pour vérifier qu'un événement a été stoppé, vous appelez la méthode
`isStopped()` dans l'objet événement::

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

Dans l'exemple précédent la vente ne serait pas enregistrée si l'événement
est stoppé durant le processus `beforePlace`.

Récupérer les Résultats d'Event
-------------------------------

Chacune des fois ou un callback retourne une valeur, celle ci est stockée
dans la propriété `$result` de l'objet événement. C'est utile dans certains cas
où laisser les callbacks modifier les paramètres principaux de processus
augmente la possibilité de modifier l'aspect d'exécution des processus.
Regardons encore notre exemple `beforePlace` et laissons les callbacks modifier
la donnée $order (commande).

Les résultats d'événement peuvent être modifiés soit en utilisant directement
la propriété result de l'objet event  ou en retournant une valeur dans le
callback lui même. ::

    // Un écouteur (listener) de callback
    public function doSomething($event) {
        // ...
        $alteredData = $event->data['order']  + $moreData;
        return $alteredData;
    }

    // Un autre écouteur (listener) de callback
    public function doSomethingElse($event) {
        // ...
        $event->result['order'] = $alteredData;
    }

    // Utilisation du résultat de l'événement
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

Comme vous l'avez peut-être aussi remarqué, il est possible de modifier
n'importe quelle propriété d'un objet événement et d'être sûr que ces
nouvelles données seront passées au prochain callback. Dans la majeur
partie des cas, fournir des objets comme donnée événement ou résultat et
modifier directement les objets est la meilleur solution puisque la référence
est maintenue et que les modifications sont partagées à travers les appels
callbacks.

Retirer des Callbacks et Écouteurs (listeners)
----------------------------------------------

Si pour quelque raison que ce soit, vous voulez retirer certains callbacks
depuis le gestionnaire d'événement, appelez juste la méthode
:php:meth:`CakeEventManager::detach()` en utilisant comme arguments les
deux premiers paramètres que vous avez utilisés pour les attacher::

    // Attacher une fonction
    $this->getEventManager()->attach(array($this, 'doSomething'), 'My.event');

    // Détacher la fonction
    $this->getEventManager()->detach(array($this, 'doSomething'), 'My.event');

    // Attacher une fonction anonyme (PHP 5.3+ seulement);
    $myFunction = function($event) { ... };
    $this->getEventManager()->attach($myFunction, 'My.event');

    // Détacher la fonction anonyme
    $this->getEventManager()->detach($myFunction, 'My.event');

    // Attacher un écouteur Cake (CakeEventListener)
    $listener = new MyEventListener();
    $this->getEventManager()->attach($listener);

    // Détacher une simple clé d'événement depuis un écouteur (listener)
    $this->getEventManager()->detach($listener, 'My.event');

    // Détacher tous les callbacks implémentés par un écouteur (listener)
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

    /core-libraries/collections
    /models/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=fr: Événements système
    :keywords lang=fr: events, événements, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
