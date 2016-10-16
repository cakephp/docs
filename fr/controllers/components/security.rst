SecurityComponent (Sécurité)
############################

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

Le Component Security offre une manière simple d'inclure une sécurité renforcée
à votre application. Il fournit des méthodes pour diverses tâches comme:

* Restreindre les méthodes HTTP que votre application accepte.
* Protection contre la falsification de formulaire.
* Exiger l'utilisation du SSL.
* Limiter les communications croisées dans le controller.

Comme tous les components, il est configuré au travers de plusieurs paramètres
configurables.
Toutes ces propriétés peuvent être définies directement ou au travers de
"méthodes setter" du même nom dans la partie ``beforeFilter()`` de votre
controller.

En utilisant le Component Security vous obtenez automatiquement une protection
contre la falsification de formulaire. Des jetons de champs cachés seront
automatiquement insérés dans les formulaires et vérifiés par le component
Security.

Si vous utilisez la fonctionnalité de protection des formulaires par le
component Security et que d'autres components traitent des données de formulaire
dans les callbacks ``startup()``, assurez-vous de placer le component Security
avant ces components dans la méthode ``initialize()``.

.. note::

    Quand vous utilisez le component Security vous **devez** utiliser le Helper
    Form (FormHelper) pour créer vos formulaires. De plus, vous **ne** devez
    surcharger **aucun** des attributs des champs ' "name". Le component
    Security regarde certains indicateurs qui sont créés et gérés par le Helper
    form. (spécialement ceux créés dans
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()`) et
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). La modification
    dynamique des champs qui lui sont soumis dans une requête POST (ex.
    désactiver, effacer, créer des nouveaux champs via Javascript) est
    susceptible de déclencher un black-holing (envoi dans le trou noir) de la
    requête. Voir les paramètres de configuration de ``$validatePost`` ou
    ``$disabledFields``.

    Vous devez toujours vérifier les méthodes HTTP utilisées avant d'exécuter
    d'autre code. Vous devez :ref:`vérifier la méthode HTTP <check-the-request>`
    ou utiliser :php:meth:`Cake\\Network\\Request::allowMethod()` pour vous
    assurer que la bonne méthode HTTP est utilisée.

Gestion des callbacks Blackhole
===============================

.. php:method:: blackHole(object $controller, string $error = '', SecurityException $exception = null)

Si une action est restreinte par le component Security, elle devient un
black-hole (trou noir), comme une requête invalide qui aboutira à une erreur 400
par défaut. Vous pouvez configurer ce comportement, en définissant l'option de
configuration ``blackHoleCallback`` par une fonction de rappel (callback) dans
le controller.

En configurant la fonction de rappel, vous pouvez personnaliser le processus de
mise en trou noir (blackhole callback)::

    public function beforeFilter(Event $event)
    {
        $this->Security->config('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type)
    {
        // Gère les erreurs.
    }

Le  paramètre ``$type`` peut avoir les valeurs suivantes:

* 'auth' Indique une erreur de validation de formulaire, ou une incohérence
  controller/action.
* 'secure' Indique un problème sur la méthode de restriction SSL.

.. versionadded:: cakephp/cakephp 3.2.6

    Depuis la version 3.2.6, un paramètre supplémentaire est inclus dans le callback blackHole, une instance de
    ``Cake\Controller\Exception\SecurityException`` est incluse dans le deuxième
    paramètre.

Restreindre les actions aux actions SSL
=======================================

.. php:method:: requireSecure()

    Définit les actions qui nécessitent une requête SSL-securisée. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument, pour forcer
    toutes les actions à requérir une SSL-securisée.

.. php:method:: requireAuth()

    Définit les actions qui nécessitent un jeton valide généré par le component
    Security. Prend un nombre indéfini de paramètres. Peut-être appelé sans
    argument, pour forcer toutes les actions à requérir une authentification
    valide.

Restreindre les Demandes croisées de Controller
===============================================

.. php:attr:: allowedControllers

    Une liste de controllers qui peuvent envoyer des requêtes vers ce
    controller. Ceci peut être utilisé pour contrôler les demandes croisées de
    controller.

.. php:attr:: allowedActions

    Une liste des actions qui peuvent envoyer des requêtes vers les actions de
    ce controller. Ceci peut être utilisé pour contrôler les demandes croisées
    de controller.

Prévention de la Falsification de Formulaire
============================================

Par défaut le component Security ``SecurityComponent`` empêche l'utilisation de
la falsification de formulaire. Le ``SecurityComponent`` va empêcher les choses
suivantes:

* Les champs inconnus ne peuvent être ajoutés au formulaire.
* Les champs ne peuvent être retirés du formulaire.
* Les valeurs dans les inputs cachés ne peuvent être modifiées.

La prévention de ces types de falsification est faite de concert avec
FormHelper, en recherchant les champs qui sont dans un formulaire. Les valeurs
pour les champs cachés sont aussi utilisées. Toutes ces données sont combinées
et il en ressort un hash. Quand un formulaire est soumis, SecurityComponent va
utiliser les données POSTées pour construire la même structure et comparer le
hash.


.. note::

    SecurityComponent **ne** va **pas** empêcher aux options sélectionnées
    d'être ajoutées/changées. Ni ne va empêcher les options radio d'être
    ajoutées/changées.

.. php:attr:: unlockedFields

    Définit une liste de champs de formulaire à exclure de la validation POST.
    Les champs peuvent être déverrouillés dans le component ou avec
    :php:meth:`FormHelper::unlockField()`. Les champs qui ont été déverrouillés
    ne sont pas requis faisant parti du POST et les champs cachés déverrouillés
    n'ont pas leur valeur vérifiée.

.. php:attr:: validatePost

    Défini à ``false`` pour complètement éviter la validation des requêtes POST,
    essentiellement éteindre la validation de formulaire.

Utilisation
===========

Le component Security est généralement utilisé dans la méthode
``beforeFilter()`` de votre controller. Vous pouvez spécifier les restrictions
de sécurité que vous voulez et le component Security les forcera au démarrage::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
            if ($this->request->param('admin')) {
                $this->Security->requireSecure();
            }
        }
    }

Cette exemple forcera toutes les actions qui proviennent de la "route" Admin à
être effectuées via des requêtes sécurisées::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security', ['blackHoleCallback' => 'forceSSL']);
        }

        public function beforeFilter(Event $event)
        {
            if (isset($this->params['admin'])) {
                $this->Security->requireSecure();
            }
        }

        public function forceSSL()
        {
            return $this->redirect('https://' . env('SERVER_NAME') . $this->request->here());
        }
    }

Cet exemple forcera toutes les actions qui proviennent de la "route" admin à
requérir des requêtes sécurisés SSL. Quand la requête est placée dans un trou
noir, elle appellera le callback ``forceSSL()`` qui redirigera automatiquement
les requêtes non sécurisées vers les requêtes sécurisées.

.. _security-csrf:

Protection CSRF
===============

CSRF ou Cross Site Request Forgery est une vulnérabilité courante pour les
applications Web. Cela permet à un attaquant de capturer et de rejouer une
requête, et parfois de soumettre des demandes de données en utilisant les
balises images ou des ressources sur d'autres domaines.
Pour activer la protection CSRF, utilisez :doc:`/controllers/components/csrf`.

Désactiver le Component Security pour des Actions Spécifiques
=============================================================

Il peut arriver que vous souhaitiez désactiver toutes les vérifications de
sécurité pour une action (ex. ajax request).
Vous pouvez "délocker" ces actions en les listant dans
``$this->Security->unlockedActions`` dans votre ``beforeFilter()``. La propriété
``unlockedActions`` **ne** va **pas** avoir d'effets sur les autres
fonctionnalités de ``SecurityComponent``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
             $this->Security->config('unlockedActions', ['edit']);
        }
    }

Cet exemple désactiverait toutes les vérifications de sécurité pour une action
edit.

.. meta::
    :title lang=fr: Security (Sécurité)
    :keywords lang=fr: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class
