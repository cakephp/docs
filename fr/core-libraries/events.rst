Événements système
##################

.. versionadded:: 2.1

La création d'application maintenable est à la fois une science et un art.
Il est connu que la clef pour avoir des codes de bonne qualité est d'avoir
un couplage plus lâche et une cohésion plus élevée. La cohésion signifie 
que toutes les méthodes et propriétés pour une classe sont fortement
reliés à la classe elle même et non pas d'essayer de faire le travail
que d'autre objets devraient faire, tandis que un couplage plus lâche est la 
mesure du degré de resserrement des interconnexion d'une classe aux objets 
externes, et comment cette classe en dépend.

Tandis que la plupart des structures CakePHP et des librairies par défaut
vous aiderons à atteindre ce but, il y a certains cas où vous avez besoin
de communiquer proprement avec les autres partie du système sans avoir à
coder en dur ces dépendances, ainsi réduire la cohésion et accroître le
couplage de classe. Un motif de conception (design pattern) très réussi dans
l'ingénierie software est le modèle obervateur (Observer pattern) , où les
objets peuvent générés des événements et notifier à des écouteurs (listener)
possiblement anonymes des changements d'états internes.

Les écouteurs (listener) dans le modèle observateur (Observer pattern) peuvent 
s'abonner à de tel événements et choisir d'interagir sur eux, modifier l'état 
du sujet ou simplement faire des logs. Si vous avez utilisez javascript dans 
le passé, vous avez la chance d'être déjà familier avec la programmation 
événementielle.

CakePHP émule plusieurs aspects sur la façon dont les événements sont 
déclenchés et managés dans des frameworks javascript comme le populaire 
jQuery, tout en restant fidèle à sa conception orientée objet. Dans cette 
implémentation, un objet événement est transporté a travers tous les écouteurs 
qui détiennent l'information et la possibilité d'arrêter la propagation des 
événements à tout moment. Les écouteurs peuvent s'enregistrer eux-mêmes ou 
peuvent déléguer cette tâche a d'autres objets et avoir la chance de modifier 
l'état et l'événement lui-même pour le reste des callbacks.

Interagir avec le gestionnaire d'événement
==========================================

Imaginons que vous être en train de construire un plugin Caddie, mais vous ne 
voulez pas vraiment l'encombrer avec une logique d'expédition, expédier un mail 
à l'utilisateur ou décrémenter les articles depuis le stock, c'est votre 
souhait de traiter tout cela séparément dans un autre plugin ou dans le code de 
l'application. Typiquement, quand vous n'utilisez pas directement le modèle 
observateur(observer pattern) vous voudriez faire cela en attachant des 
behaviors à la volée à vos modèles, et peut être quelques components aux 
controllers.

Faire cela représente un challenge la plupart du temps, puisque vous allez
devoir aborder du code pour charger de manière externe ces behaviors ou 
d'attacher des hooks aux controllers de votre plugin . Avant CakePHP 2.1 
quelques développeurs choisissaient d'implémenter des événements systèmes 
génériques pour résoudre ce problème, et certain de ces systèmes étaient 
offerts comme plugins. Maintenant, vous pouvez bénéficier en standard d'un 
système d'événements qui vous laissera proprement séparer ce qui concerne vos 
plugins et le code de l'application avec le gestionnaire d'événements intégré.

Distribution des événements
---------------------------

Revenons à notre exemple, nous aurions un modèle `Order` qui gérera la logique 
d'achat, et probablement  une méthode `place` pour enregistrer les détails de 
la commande et faire d'autres logiques::

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

Bien, cela ne semble pas correct du tout. Un plugin ne devrait pas faire 
d'hypothèse sur l'envoi d'email, et devrait même ne pas avoir à décrémenter 
les données d'inventaire, et finalement le suivi statistique n'est pas le 
meilleur endroit pour le faire. Nous avons donc besoin d'une autre solution, 
ré-écrivons en utilisant le gestionnaire d'événements. ::

    // Cart/Model/Order.php
    App::uses('CakeEvent', 'Event');
    class Order extends AppModel {

        public function place($order) {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $this->getEventManager()->dispatch(new CakeEvent('Model.Order.afterPlace', $this, array(
                    'order' => $order
                )));
                return true;
            }
            return false;
        }
    }

Cela semble beaucoup plus clair, et nous donnes l'opportunité d'introduire 
des classes d'événement et des méthodes. La première chose que vous devriez 
noter c'est l'appel à ``getEventManager()`` qui est une méthode disponible 
par défaut dans tous les Modèles, Contrôleur, et Vues. Cette méthode ne 
retournera pas la même instance du gestionnaire aux travers les modèles, 
et n'est pas partagée entre les contrôleurs et les modèles, mais elle l'est 
entre les contrôleurs et les vues, cependant.Nous revérons plus tard comment 
surmonter ce détail d'implémentation.

La méthode ``getEventManager`` retourne une instance de 
:php:class:`CakeEventManager`, et pour dispatcher les événements vous utilisez 
:php:meth:`CakeEventManager::dispatch()` qui reçoit une instance de la classe 
:php:class:`CakeEvent`. Disséquons maintenant le processus de dispatching 
d'un événement::

    new CakeEvent('Model.Order.afterPlace', $this, array(
        'order' => $order
    ));

:php:class:`CakeEvent` reçois 3 arguments dans son constructeur. Le premier
est le nom de l'événement , vous devrez essayer de garder ce nom aussi unique
que possible, tout en le rendant lisible. Nous vous suggérons les conventions
suivantes: `Layer.eventName` pour les événements généraux qui surviennent à
un niveau de couche(ex:`Controller.startup`,`View.beforeRender` ) et 
`Layer.Class.eventName` pour les événements qui surviennent dans une classe
spécifique sur une couche, par exemple `Model.User.afterRegister` ou 
`Controller.Courses.invalidAccess`.

Le second argument est le sujet  `subject`,  ce qui signifie l'objet associé 
à l'événement, habituellement quand c'est la même classe de déclenchement 
d'événements que lui même, l'utilisation de  `$this` sera communement utilisé. 
Bien que  :php:class:`Component` pourrait lui aussi déclencher les événements
du contrôleur. La classe du sujet est importante parce que les écouteurs (listeners) 
auront des accès immédiats aux propriétés des objets et la chance de les 
inspecter ou de les changer à la volée. 

Finalement, le troisième argument est le paramètres d'événement. Ceci peut
être n'importe quelle donnée que vous considérez comme étant utile à passer 
avec laquelle les écouteurs peuvent interagir. Même si cela peut être 
n'importe quel type d'argument, nous vous recommandons de passer un tableau 
associatif, pour rendre l'inspection plus facile.  

La méthode :php:meth:`CakeEventManager::dispatch()`  accepte les objets 
événements comme arguments et notifie a tous les écouteurs et callbacks le 
passage de cet objet. Ainsi les écouteurs géreront toute la logique autour 
de l'événement `afterPlace`, vous pouvez enregistrer l'heure , envoyer des 
emails , éventuellement mettre à jour les statistiques de l'utilisateur dans 
des objets séparés et même déléguer cela à des tâches hors-ligne si vous 
en avez besoin.

Enregistrement des callbacks
----------------------------

Comment allons nous enregistrer les callbacks ou les observateurs 
(observers) dans notre nouvel événement `afterPlace`? Ceci est sujet à 
une grande variété d'implémentation, mais elles ont toutes à appeler la méthode 
:php:meth:`CakeEventManager::attach()` pour enregistrer les nouveaux acteurs.
Par souci de simplicité, imaginons que nous savons dans le plugin de quoi les 
callbacks sont capables dans le controller, et disons que ce controller 
est responsable de leur attachement. Le code possible pourrait être cela ::

    // Les écouteurs (Listeners) configurés quelque part ailleurs, un fichier de config par ex:
    Configure::write('Order.afterPlace', array(
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => array($this->InventoryManager, 'decrement'),
        'logger' => function($event) {
            // Les fonction Anonyme ne sont permises que dans PHP 5.3+
            CakeLog::write('info', 'Un nouvel achat à été placé avec l\'id: ' . $event->subject()->id);
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

Ce ne sera pas la façon la plus propre de la faire, ainsi nous pouvons arriver 
avec nos propres moyens pour attacher des écouteurs au gestionnaire d'événement 
d'un objet. Cette façon simple de les définir en utilisant la classe 
`Configure` est destinée a des fins didactiques seulement. Ce petit exemple 
nous permet de montrer quel type de callbacks peuvent être attachés au 
gestionnaire (manager). Comme vous vous en doutiez, la méthode `attach` prend 
n'importe quel type de `callback` PHP valide, c'est une chaîne représentant 
l'appel à une fonction statique, un tableau ayant une instance de classe et une 
méthode,  une fonction anonyme si vous utilisez PHP 5.3 ,etc...
Les callbacks attachés recevront l'objet événement comme premier argument.

:php:meth:`CakeEventManager::attach()` Accepte trois arguments. Le plus à 
gauche est le callback lui même , n'importe quoi que PHP peut traiter comme 
une fonction appelable. Le second argument est le nom de l'événement, et le 
callback ne sera envoyé que si l'objet  `CakeEvent` envoyé a un nom 
correspondant. Le dernier argument est un tableau d'options pour configurer 
la priorité du callback,et les arguments préférentiels à envoyer.

Enregistrer les écouteurs
-------------------------

Les écouteurs (Listeners) sont une alternative, et souvent le moyen le plus
propre d'enregistrer les callbacks pour un événement. Ceci est fait en 
implémentant l'interface :php:class:`CakeEventListener` dans chacune de classes 
ou vous souhaitez enregistrer des callbacks. Les classes l'implémentant doivent 
fournir la méthode ``implementedEvents()`` et retourner un tableau associatif 
avec tous les noms d'événements que la classe gérera.

Pour en revenir à notre exemple précédent , imaginons que nous avons une classe 
UserStatistic responsable du calcul d'information utiles et de la compilation 
de statistiques dans le site global. Ce serait naturel de passer une instance 
de cette classe comme un callback, au lien d'implémenter une fonction statique 
personnalisé ou la conversion de n'importe quel autre contournement
pour déclencher les méthodes de cette classe. Un écouteur (listener) est créé
comme ci-dessous :: 

    App::uses('CakeEventListener', 'Event');
    class UserStatistic implements CakeEventListener {

        public function implementedEvents() {
            return array(
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            );
        }

        public function updateBuyStatistic($event) {
            // Code pour mettre à jour les statistiques
        }
    }

    // Attache l'objet UserStatistic au gestionnaire d'événement 'Order' (commande)
    $statistics = new UserStatistic();
    $this->Order->getEventManager()->attach($statistics);

Comme vous pouvez le voir dans le code ci-dessus, la fonction `attach` peut 
manipuler les instances de l'interface `CakeEventListener`. En interne, le 
gestionnaire d'événement lira le tableau retourné par la méthode 
`implementedEvents` et relie les callbacks en conséquence.

Établir des priorités
---------------------

Dans certain cas vous voudriez exécuter un callback et être sûre qu'il serait 
exécuter avant , ou après tous les autres callbacks déjà lancés.Par exemple,
repensons a notre exemple de statistiques utilisateur.  Il serait judicieux 
de n'exécuter cette méthode que si nous sommes sûre que l'événement n'a pas 
été annulé, qu'il n'y a pas d'erreur et que les autres callbacks n'ont pas 
changés l'état de 'order' lui même. Pour ces raisons vous utilisez les 
priorités.

Les priorités sont gérés en utilisant un nombre associé au callback lui même. 
Plus haut est le nombre, plus tard sera lancée la méthode. Les priorités par 
défaut des méthodes des callbacks et écouteurs sont définis à '10'. Si vous 
voulez que votre méthode soit lancée avant , alors l'utilisation de n'importe 
quelle valeur plus basse que cette valeur par défaut vous aidera à le faire, 
même en mettant la priorité à `1` ou une valeur négative pourrait fonctionner. 
D'une autre façon si vous désirez exécuter le callback après les autres, 
l'usage d'un nombre au dessus de `10` fonctionnera.

Si deux callback se trouvent alloués avec le même niveau de priorité, ils 
seront exécutés avec une règle `FIFO`, la première méthode d'écouteur 
(listener) attachée est appelée en premier et ainsi de suite. Vous définissez 
les priorités en utilisant la méthode `attach` pour les callbacks, et les 
déclarer dans une fonction `implementedEvents` pour les écouteurs d'événements::

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
les méthodes appelables et les préférences de priorités. La clef appelable 
`callable` est une entrée de tableau spéciale que le gestionnaire (manager) 
lira pour savoir quelle fonction dans la classe il devrait appeler. 

Obtenir des données d'événements comme paramètres de fonction
-------------------------------------------------------------

Certain développeurs pourraient préférer avoir les données d'événements 
passés comme des paramètres de fonctions au lieu de recevoir l'objet événement. 
Bien que ce soit un préférence étrange et que l'utilisation d'objet événement 
est bien plus puissant, ceci a été nécessaire pour fournir une compatibilité 
ascendante avec le précédent système d'événement et pour offrir aux 
développeurs chevronnés une alternative pour ce auquel ils sont habitués.

Afin de changer cette option vous devez ajouter l'option `passParams` au 
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
    si la donnée d'événement est un tableau. N'importe quelle autre type de 
    donnée sera convertis en paramètre de fonction, ne pas utiliser cette 
    option est souvent plus adéquate.

Stopper des événements
----------------------

il y a des circonstances ou vous aurez besoin de stopper des événements de 
sorte que l'opération commencée est annulée. Vous voyez un exemple de cela 
dans les callbacks de modèle (ex. beforesave) dans lesquels il est possible 
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
été stoppé ne sera appelé. Le seconde conséquence est optionnelle et dépend 
du code qui déclenche l'événement, par exemple, dans votre exemple 
`afterPlace` cela n'aurait pas de sens d'annuler l'opération tant que les 
données n'aurons pas toutes été enregistrés et le Caddie vidé. Néanmoins, 
si nous avons une `beforePlace` arrêtant l'événement cela semble valable.

Pour vérifier qu'un événement à été stoppé, vous appelez la méthode 
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

Dans l'exemple précédent la vente ne seraient pas enregistrée si l'événement 
est stoppé durant le processus `beforePlace`. 

Récupérer les résultats d'événement
-----------------------------------

Chacune des fois ou un callback retourne une valeur, celle ci est stockée 
dans la propriété `$result` de l'objet événement. C'est utile dans certains cas 
ou laisser les callbacks modifier les paramètres principaux de processus 
augmente la possibilité de modifier l'aspect d'exécution des processus. 
Regardons encore notre exemple `beforePlace` et laissons les callbacks modifier 
la donnée $order (commande).

Les résultats d'événement peuvent être modifiés soit en utilisant directement 
la propriété result de l'objet event  ou en retournant une valeur dans le 
callback lui même.::

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

Comme vous l'avez peut-être aussi remarqués il est possible de modifier 
n'importe quelle propriété d'un objet événement et d'être sûre que ces 
nouvelles données seront passées au prochain callback. Dans la majeur 
partie des cas, fournir des objets comme donnée événement ou résultat et 
modifier directement les objets est la meilleur solution comme la référence 
est maintenu et que les modifications sont partagées à travers les appels 
callbacks.

Retirer des callbacks et écouteurs (listeners)
----------------------------------------------

Si pour quelque raisons vous voulez retirer certain callbacks depuis le 
gestionnaire d'événement appeler juste la méthode 
:php:meth:`CakeEventManager::detach()` en utilisant comme arguments les 
deux premiers paramètres que vous avez utilisé pour les attacher ::

    // Attacher une fonction
    $this->getEventManager()->attach(array($this, 'doSomething'), 'My.event');

    // Détacher la fonction
    $this->getEventManager()->detach(array($this, 'doSomething'), 'My.event');

    // Attacher une fonction anonyme (PHP 5.3+ seulement);
    $myFunction = function($event) { ... };
    $this->getEventManager()->attach($myFunction, 'My.event');

    // Detacher la fonction anonyme
    $this->getEventManager()->detach($myFunction, 'My.event');

    // Attacher un écouteur Cake (CakeEventListener)
    $listener = new MyCakeEventLister();
    $this->getEventManager()->attach($listener);
        
    // Détacher une simple clef d'événement depuis un écouteur (listener)
    $this->getEventManager()->detach($listener, 'My.event');

    // Détacher tous les callbacks implémentés par un écouteur (listener)
    $this->getEventManager()->attach($listener);

Le gestionnaire d'événement global
==================================

Comme noté précédemment, cela pourrait être difficile d'attacher les 
observateurs à un gestionnaire d'événement particulier dans un objet. il y 
a certain cas ou avoir la possibilité d'attacher des callbacks à un événement 
est nécessaire sans avoir accès à l'instance objet qui le déclenchera. Aussi, 
pour empêcher les gens d'implémenter pour chacun d'eux un mécanisme différent 
pour le chargement des callbacks dans les gestionnaires en fonction de la 
configuration, CakePHP fournit le concept du gestionnaire d'événement global 
`global event manager`.  

Le gestionnaire global est une instance singleton de la classe 
``CakeEventManager`` qui reçoit tous les événements que n'importe quel 
gestionnaire d'événement dans l'application dispatches. C'est à la fois 
flexible et puissant , mais si vous l'utilisez vous devez prendre plus 
de précautions avec le traitement des événements.

Pour définir le concept une fois de plus, et utiliser notre exemple 
`beforePlace` souvenons nous que nous utilisions le gestionnaire d'événement 
local qui est retourné par la fonction `getEventManager`. En interne ce 
gestionnaire d'événement local dispatche l'événement  dans le gestionnaire 
d'événement global avant de déclencher les callbacks internes attachés. La 
priorité de chacun des managers est indépendante, le callback global se 
lancera dans leur propre file d'attente et ainsi les callbacks locaux 
seront appelés dans l'ordre de priorité respectifs.

Accéder au gestionnaire d'événement global est aussi simple que d'appeler une
fonction statique, l'exemple suivant va attacher un événement global à l'événement
`beforePlace` ::

    // Dans n'importe quelle fichier de config ou morceau de code qui s'exécute avant l'événement
    App::uses('CakeEventManager', 'Event');
    CakeEventManager::instance()->attach($aCallback, 'Model.Order.beforePlace');

Comme vous pouvez le voir, nous avons juste changé comment nous avons accès à 
l'instance du gestionnaire d'événement, et nous pouvons appliquer les mêmes 
concepts que nous avons appris précédemment à propos du déclenchement, de 
l'attachement, du détachement, du stoppage d'événement, etc...

Un élément important que vous devriez considérer est qu'il y a des événements 
qui seront déclenchés en ayant le même nom mais différents sujets, donc les 
vérifier dans l'objet événement est généralement requis dans chacune des 
fonctions qui sont attachées globalement pour éviter quelques bugs.
Souvenez-vous qu'une extrême flexibilité implique une extrême complexité. 

Examinez ce callback qui veut écouter tous les modèles beforeFinds mais en 
réalité , il ne peut pas faire çà logique si le modèle est le caddie::

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

Les événements sont une bonne façon de séparer les préoccupations dans 
votre application et rend les classes a la fois cohésives et découplé des 
autres, néanmoins l'utilisation des événements n'est pas la solution 
à tous les problèmes. La plupart des applications n'auront pas réellement 
besoin de cette fonctionnalité, nous vous recommandons d'examiner d'autres 
options quand ils surviennent pour implémenter les callbacks comme 
l'utilisation des behaviors, des components et des helpers.

Garder à l'esprit que beaucoup de pouvoir implique beaucoup de responsabilité, 
découpler vos classes par ce moyen signifie également que vous avez besoin 
d'effectuer une plus grande et meilleur intégration en testant votre code.
Abuser de cet outil ne donnera pas à votre application une meilleure 
architecture, bien au contraire, cela sera beaucoup plus difficile à lire. En 
revanche si vous utilisez cet option à bon escient, seulement pour les choses 
dont vous avez besoin, Ce sera plus simple de travailler avec votre code, de 
le tester et de l'intégrer. 

Lecture Additionnelle
=====================

.. toctree::
    
    /core-libraries/collections
    /models/behaviors
    /controllers/components
    /views/helpers


.. meta::
    :title lang=fr: Événements système
    :keywords lang=fr: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
