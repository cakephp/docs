Security (Sécurité)
###################

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = array())

Le component Security offre une manière simple d'inclure une sécurité
renforcée à votre application. Il fournit des méthodes pour diverses tâches
comme:

* Restreindre les méthodes HTTP que votre application accepte.
* Protection CSRF.
* Protection contre la falsification de formulaire.
* Exiger l'utilisation du SSL.
* Limiter les communications croisées dans le controller.

Comme tous les components, il est configuré au travers de plusieurs paramètres
configurables.
Toutes ces propriétés peuvent être définies directement ou au travers de
"méthodes setter" du même nom dans la partie beforeFilter de votre controller.

En utilisant le Component Security vous obtenez automatiquement une protection
`CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
et une protection contre la falsification de formulaire.
Des jetons de champs cachés seront automatiquement insérés dans les
formulaires et vérifiés par le component Security. En outre, une
soumission par formulaire ne sera pas acceptée après une certaine
période d'inactivité, qui est contrôler par le temps ``csrfExpires``.

Si vous utilisez la fonctionnalité de protection des formulaires
par le component Security et que d'autres components traitent des données
de formulaire dans les callbacks ``startup()``, assurez-vous de placer
le component Security avant ces components dans le tableau ``$components``.

.. note::

    Quand vous utilisez le component Security vous **devez** utiliser
    le Helper Form (FormHelper) pour créer vos formulaires. De plus, vous
    **ne** devez surcharger **aucun** des attributs des champs ' "name".
    Le component Security regarde certains indicateurs qui sont créés et
    gérés par le Helper form.
    (spécialement ceux créés dans
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()`) et
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). La modification
    dynamique des champs qui lui sont soumis dans une requête POST (ex.
    désactiver, effacer, créer des nouveaux champs via Javascript) est
    susceptible de déclencher un black-holing (envoi dans le trou noir) de la
    requête. Voir les paramètres de configuration de ``$validatePost`` ou
    ``$disabledFields``.

Gestion des callbacks Blackhole
===============================

Si une action est restreinte par le component Security, elle devient
un black-hole (trou noir), comme une requête invalide qui aboutira à une
erreur 404 par défaut.
Vous pouvez configurer ce comportement, en définissant l'option de configuration
``blackHoleCallback`` par une fonction de rappel (callback)
dans le controller.

.. php:method:: blackHole(object $controller, string $error)

    Met en "trou noir" (black-hole) une requête invalide, avec une
    erreur 404 ou un callback personnalisé. Sans callback, la requête
    sera abandonnée. Si un callback de controller est défini pour
    SecurityComponent::blackHoleCallback, il sera appelé et passera
    toute information sur l'erreur.

    La fonction de rappel (callback) du controller qui va gérer et requéter
    ce qui doit être mis dans un trou noir (blackholed).
    La fonction de rappel de mise en trou noir (blackhole callback) peut être
    n'importe quelle méthode publique d'un controller.
    La fonction de rappel doit s'attendre a un paramètre indiquant le type
    d'erreur::

        public function beforeFilter() {
            $this->Security->config('blackHoleCallback', 'blackhole');
        }

        public function blackhole($type) {
            // handle errors.
        }

    Le  paramètre ``$type`` peut avoir les valeurs suivantes:

    * 'auth' Indique une erreur de validation de formulaire, ou une incohérence
      controller/action.
    * 'secure' Indique un problème sur la méthode de restriction SSL.

Restreindre les actions aux actions SSL
=======================================

.. php:method:: requireSecure()

    Définit les actions qui nécessitent une requête SSL-securisée. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions à requérir une SSL-securisée.

.. php:method:: requireAuth()

    Définit les actions qui nécessitent un jeton valide généré par
    le component Security. Prend un nombre indéfini de paramètres.
    Peut-être appelé sans argument, pour forcer toutes les actions
    à requérir une authentification valide.

Restreindre les demandes croisées de controller
===============================================

allowedControllers
    Une liste de controllers à partir desquelles les actions du
    controller courant sont autorisées à recevoir des requêtes.
    Ceci peut être utilisé pour contrôler les demandes croisées de controller.
allowedActions
    Les actions parmi celles du controller courant qui sont autorisées
    à recevoir des requêtes. Ceci peut être utilisé pour contrôler les
    demandes croisées de controller.

Ces options de configuration vous permettent de restreindre les demandes
croisées de controller. Définissez les avec la méthode ``config()``.

Prévention de la falsification de formulaire
============================================

Par défaut le component Security ``SecurityComponent`` empêche l'utilisation
de la falsification de formulaire. Il fait cela en travaillant
avec le Helper Form et en traquant quels fichiers sont dans un formulaire. il
assure le suivi des éléments d'entrée cachés. Toutes ces données sont combinées
et hachées. Quand un formulaire est soumis, le component de sécurité utilisera
les données POSTé pour construire la même structure et comparer le hachage.

* Les champs inconnus ne peuvent être ajoutés au formulaire.
* Les champs ne peuvent être retirés du formulaire.
* Les valeurs dans les inputs cachés ne peuvent être modifiées.

La prévention de falsification de ces formulaires est faite de concert avec
FormHelper et en recherchant les champs qui sont dans un formulaire. Les valeurs
pour les champs cachés sont aussi utilisés. Toutes ces données sont combinées
et il en ressort un hash. Quand un formulaire est soumis, SecurityComponent
va utiliser les données POSTées pour construire la même structure et
comparer le hash.


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
beforeFilter() de votre controller. Vous pouvez spécifier les restrictions
de sécurité que vous voulez et le component Security les forcera
au démarrage::

    class WidgetController extends AppController {

        public $components = array('Security');

        public function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }

Dans cette exemple, l'action delete peut être effectuée
avec succès si celui ci reçoit une requête POST::

    class WidgetController extends AppController {

        public $components = array('Security');

        public function beforeFilter() {
            if (isset($this->request->params['admin'])) {
                $this->Security->requireSecure();
            }
        }
    }

Cette exemple forcera toutes les actions qui proviennent de la
"route" Admin à être effectuées via des requêtes sécurisées SSL::

    class WidgetController extends AppController {

        public $components = array('Security');

        public function beforeFilter() {
            if (isset($this->params['admin'])) {
                $this->Security->blackHoleCallback = 'forceSSL';
                $this->Security->requireSecure();
            }
        }

        public function forceSSL() {
            $this->redirect('https://' . env('SERVER_NAME') . $this->here);
        }
    }

Cet exemple forcera toutes les actions qui proviennent de la "route"
admin à requérir des requêtes sécurisés SSL. Quand la requête est placée
dans un trou noir, elle appellera le callback forceSSL() qui redirigera
les requêtes non sécurisées vers les requêtes sécurisées automatiquement.

.. _security-csrf:

Protection CSRF
===============

CSRF ou Cross Site Request Forgery est une vulnérabilité courante pour
les applications Web. Cela permet à un attaquant de capturer et de rejouer
une requête, et parfois de soumettre des demandes de données en utilisant
les balises images ou des ressources sur d'autres domaines.

Les doubles soumissions et les attaques `replay` sont gérées par les
fonctionnalités CSRF du component Security. Elles fonctionnent en ajoutant
un jeton spécial pour chaque requête de formulaire. Ce jeton utilisé
qu'une fois ne peut pas être utilisé à nouveau. Si une tentative est faîte
pour ré-utiliser un jeton expiré la requête sera mise dans le trou noir
(blackholed)

Désactiver le Component Security pour des Actions Spécifiques
=============================================================

Il peut arriver que vous souhaitiez désactiver toutes les vérifications de
sécurité pour une action (ex. ajax request).
Vous pouvez "délocker" ces actions en les listant dans
``$this->Security->unlockedActions`` dans votre ``beforeFilter``. La propriété
``unlockedActions`` **ne** va **pas** avoir d'effets sur les autres
fonctionnalités de ``SecurityComponent``.

.. versionadded:: 2.3

.. meta::
    :title lang=fr: Security (Securité)
    :keywords lang=fr: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class
