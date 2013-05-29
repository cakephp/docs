Securité
########

.. php:class:: SecurityComponent(ComponentCollection $collection, array $settings = array())

Le composant Security offre une manière simple d'inclure une sécurité 
renforcée à votre application. Il fournit des méthodes pour diverse tâche
comme:

* Restreindre quelle méthode HTTP que votre application accepte.
* Protection CSRF .
* Protection contre la falsification de formulaire
* Exiger l'utilisation du SSL.
* Limiter les communications croisées dans le contrôleur

Comme tous les composants il est configuré au travers plusieurs paramètres 
configurables.
Toutes ces propriétés peuvent être définies directement ou au travers de
"méthodes setter" du même nom dans la partie beforeFilter de votre contrôleur.

En utilisant le Composant Sécurité vous faites automatiquement
un  get `CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
et une protection contre la falsification de formulaire. 
Des champs jeton cachés seront automatiquement insérés  dans les
formulaires  et vérifiés par le composant Sécurité. En outre, une
soumission par formulaire ne sera pas acceptée après une certaine
période d'inactivité, qui est contrôler par le temps ``csrfExpires``.

Si vous utiliser la fonctionnalité de protection des formulaires 
par le composant Sécurité et que d'autre composants traitent des données 
de formulaire dans les callbacks ``startup()``, soyez sûre de placer
le composant Sécurité avant ces composant dans le tableau ``$components``

.. note::

    Quand vous utilisez le composant Sécurité vous **devez** utiliser
    le Helper Form (FormHelper) pour créé vos formulaires. 
    Le composant Sécurité regarde certains indicateurs qui sont créés et 
    gérer par le Helper form 
    (spécialement ceux créés dans :php:meth:`~FormHelper::create()`)
    et :php:meth:`~FormHelper::end()`). La modification dynamique des champs 
    qui lui sont soumis dans une requête POST (ex. désactiver, effacer, 
    créer des champs nouveau via Javascript) est susceptible de déclencher
    un black-holing (envoi dans le trou noir) de la requête. Voir les 
    paramètres de configuration
    de ``$validatePost`` ou ``$disabledFields``.
    
Manipulation des callbacks trou noir 
====================================

Si une action est restreinte par le composant Security, elle devient 
un trou noir, comme une requête invalide qui aboutira à une erreur 404 
par défaut.
Vous pouvez configurer ce comportement, en définissant la propriété 
$this->Security->blackHoleCallback par une fonction de rappel (callback) 
dans le contrôleur. 

.. php:method:: blackHole(object $controller, string $error)

    Met en "trou noir" (black-hole) une requête invalide, avec une 
    erreur 404 ou un callback personnalisé. Sans callback, la requête 
    sera abandonnée. Si un callback de contrôleur est défini pour 
    SecurityComponent::blackHoleCallback, il sera appelé et passera 
    toute information sur l'erreur. 
 
.. php:attr:: blackHoleCallback

    La fonction de rappel (callback) du contrôleur qui va gérer et requéter
    ce qui doit être mis dans un trou noir (blackholed).
    La fonction de rappel de mise en trou noir (blackhole callback) peut être 
    n'importe quelle méthode publique d'un contrôleur.
    La fonction de rappel doit s'attendre a un paramètre indiquant le type
    d'erreur::
    
        public function beforeFilter() {
            $this->Security->blackHoleCallback = 'blackhole';
        }

        public function blackhole($type) {
            // gestions des erreurs.
        }

    Le  paramètre ``$type`` peut avoir les valeurs suivantes:

    * 'auth' Indiques un erreur de validation de formulaire, ou une incohérence 
      contrôleur/action.
    * 'csrf' Indique une erreur CSRF.
    * 'get' Indique une problème sur la méthode de restriction HTTP.
    * 'post' Indique une problème sur la méthode de restriction HTTP.
    * 'put' Indique une problème sur la méthode de restriction HTTP.
    * 'delete' Indique une problème sur la méthode de restriction HTTP.
    * 'secure' Indique une problème sur la méthode de restriction SSL.

Restreindre les méthodes HTTP
==============================

.. php:method:: requirePost()

    Définit les actions qui nécessitent une requête POST. Prend un 
    nombre indéfini de paramètres. Peut être appelé sans argument, 
    pour forcer toutes les actions à requérir un POST.
    
.. php:method:: requireGet()

    Définit les actions qui nécessitent une requête GET. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions  à requérir un GET.
    
.. php:method:: requirePut()

    Définit les actions qui nécessitent une requête PUT. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions  à requérir un PUT.

.. php:method:: requireDelete()

    Définit les actions qui nécessitent une requête DELETE. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions  à requérir un DELETE.
   
Restreindre les actions à SSL
=============================

.. php:method:: requireSecure()

    Définit les actions qui nécessitent une requête SSL-securisée. Prend un 
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions  à requérir une  SSL-securisée.

.. php:method:: requireAuth()

    Définit les actions qui nécessitent un jeton valide généré par
    le composant Sécurité. Prend un nombre indéfini de paramètres. 
    Peut-être appelé sans argument, pour forcer toutes les actions
    à requérir une authentification valide.
    
Restreindre les demandes croisées de contrôleur
===============================================

.. php:attr:: allowedControllers

    Une liste de contrôleurs à partir desquelles les actions du 
    contrôleur courant sont autorisées à recevoir des requêtes. 
    Ceci peut être utilisé pour contrôler les demandes croisées de contrôleur.

.. php:attr:: allowedActions

    Les actions parmi celles du contrôleur courant qui sont autorisées 
    à recevoir des requêtes. Ceci peut être utilisé pour contrôler les 
    demandes croisées de contrôleur.
   
Prévention de la falsification de formulaire
=============================================

Par défaut le composant Sécurité ``SecurityComponent`` prévient les utilisateurs
de la falsification de formulaire. Il fait cela en travaillant avec le Helper
Form et en traquant quels fichiers sont dans un formulaire. il assure le suivi
des éléments d'entrée cachés. Toutes ses données son combinées et hachées.
Quand un formulaire est soumis, le composant de sécurité utilisera les données
POSTé pour construire la même structure et comparer le hachage.

.. php:attr:: unlockedFields

    Définit une liste de champs de formulaire à exclure de la validation POST.
    Les champs peuvent être déverrouillés dans le composant ou avec
    :php:meth:`FormHelper::unlockField()`. Les champs qui ont été déverrouillés 
    ne sont par requit faisant parti du POST et les champs cachés déverrouillés 
    n'ont pas leurs valeurs vérifiées.

.. php:attr:: validatePost

    Mis à ``false`` pour complètement éviter la validation des requêtes POST,
    essentiellement éteindre la validation de formulaire. 

configuration CSRF (Cross site request forgery)
===============================================

.. php:attr:: csrfCheck

    Si vous utilisez les formulaires de protection CSRF. Définit à 
    ``false`` pour désactivé la protection CSRF sur les formulaires.
    
.. php:attr:: csrfExpires

   La durée avant expiration d'un jeton CSRF.
   Chaque requête formulaire/page va générer un nouveau jeton qui ne
   pourra être soumis qu'une seule fois avant son expiration. Peut
   être une valeur compatible à ``strtotime()``. Par défaut 30 minutes.

.. php:attr:: csrfUseOnce

   Contrôle si oui ou non  les jetons CSRF sont utilisés et brûlés. 
   Définit à ``false`` pour ne pas générer de nouveau jetons sur chaque
   requête. Un jeton pourra être réutiliser jusqu’à ce qu'il expire.
   Ceci réduit les chances des utilisateurs d'avoir des requêtes invalides
   en raison de la consommation de jeton. Cela à pour effet de rendre 
   CSRF moins sécurisé, et les jetons réutilisable.

Utilisation
===========

Le component Security est généralement utilisé dans la méthode 
beforeFilter() de votre contrôleur. Vous pouvez spécifier les restrictions 
de sécurité que vous voulez et le composant Security les forcera 
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

protection CSRF
===============

CSRF ou Cross Site Request Forgery est une vulnérabilité commune pour
les applications Web. Cela permet à un attaquant de capturer et de rejouer 
une requête , et parfois de soumettre des demandes de données en utilisant 
les balises images ou des ressources sur d'autres domaines.

Les doubles soumissions et les attaques `replay` sont gérée par les 
fonctionnalités CSRF du composant Sécurité. Elle fonctionnent en ajoutant 
un jeton spécial pour chaque requête de formulaire. Ce jeton utilisé 
qu'une fois ne peux pas être utilisé à nouveau. Si une tentative est faite 
pour ré-utiliser un jeton expiré la requête sera mise dans le trou noir 
(blackholed)

Utilisation de la protection CSRF
---------------------------------

En ajoutant simplement la :php:class:`SecurityComponent` à votre tableau
de composant , vous pouvez bénéficier de la protection CSRF fournit.
Par défaut les jetons CSRF sont valides 30 minutes et expire à l'utilisation.
Vous pouvez contrôler la durée des jetons en paramétrant csrfExpires
dans le composant.::

    public $components = array(
        'Security' => array(
            'csrfExpires' => '+1 hour'
        )
    );

Vous pouvez aussi définir cette propriété dans la partie ``beforeFilter``
de votre contrôleur.::

    public function beforeFilter() {
        $this->Security->csrfExpires = '+1 hour';
        // ...
    }

La valeur de la propriété csrfExpires peut être n'importe quelle valeur
compatible à la propriété 
`strtotime() <http://php.net/manual/en/function.strtotime.php>`_.
Par défaut le Helper Form :php:class:`FormHelper` ajoutera une
``data[_Token][key]`` contenant le jeton CSRF pour tous les formulaires 
quand le composant est activé. 

Gérer les jetons manquants ou périmés
-------------------------------------

Les jetons manquants ou périmés sont gérés de la même façon que d'autre 
violation de sécurité. Le blackHoleCallback du composant Sécurité sera 
appelé avec un paramètre 'csrf'.
Ceci vous aide à filtrer en sortie les problèmes de jeton CSRF, des autres
erreurs .

Utilisation de jeton par-session au lieu de jeton une-fois 
----------------------------------------------------------

Par défaut un nouveau jeton est généré à chaque requête , et chaque jeton ne 
peut être utilisé qu'une seule fois. Si un jeton est utilisé une nouvelle 
fois, il sera mis dans le trou noir. Parfois , ce comportement est indésirable, 
et peut créer des problèmes avec les applications "une page". Vous pouvez 
activer la multi-utilisation des jetons en paramétrant ``csrfUseOnce`` à 
``false``. Ceci peut être effectué dans le tableau components, ou dans la 
partie ``beforeFilter`` de votre controller::

    public $components = array(
        'Security' => array(
            'csrfUseOnce' => false
        )
    );

Cela dira au composant que vous voulez ré-utiliser un jeton CSRF jusqu'à
ce qu'il expire - C'est contrôlé par les valeurs de ``csrfExpires``.
Si vous avez des problèmes avec les jetons expirés , ceci peut être une
bon équilibrage entre la sécurité et la facilité d'utilisation. 

Désactiver la protection CSRF
-----------------------------

Il peut y avoir des cas où vous souhaitez désactiver la protection CSRF 
sur vos formulaires. Si vous voulez désactiver cette fonctionnalité, vous 
pouvez définir ``$this->Security->csrfCheck = false;`` dans votre
``beforeFilter`` ou utiliser le tableau components. Par défaut la protection 
CSRF est activée , et paramétrée pour l'utilisation une-utilisation des jetons.

Désactiver le Component Security pour des Actions Spécifiques
=============================================================

Il peut arriver que vous souhaitiez désactiver toutes les vérifications de
sécurité pour une action (ex. ajax request). 
Vous pouvez "délocker" ces actions en les listant dans
``$this->Security->unlockedActions`` dans votre ``beforeFilter``.

.. versionadded:: 2.3

.. meta::
    :title lang=fr: Securité
    :keywords lang=fr: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,404 error,period of inactivity,csrf,array,submission,security class
