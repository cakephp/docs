Security (Sécurité)
###################

.. php:class:: SecurityComponent(ComponentCollection $collection, array $settings = array())

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
`CSRF <https://en.wikipedia.org/wiki/Cross-site_request_forgery>`_
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
    (spécialement ceux créés dans :php:meth:`~FormHelper::create()`)
    et :php:meth:`~FormHelper::end()`). La modification dynamique des champs
    qui lui sont soumis dans une requête POST (ex. désactiver, effacer,
    créer des nouveaux champs via Javascript) est susceptible de déclencher
    un black-holing (envoi dans le trou noir) de la requête. Voir les
    paramètres de configuration de ``$validatePost`` ou ``$disabledFields``.

Gestion des callbacks trou noir
===============================

Si une action est restreinte par le component Security, elle devient
un trou noir, comme une requête invalide qui aboutira à une erreur 404
par défaut.
Vous pouvez configurer ce comportement, en définissant la propriété
$this->Security->blackHoleCallback par une fonction de rappel (callback)
dans le controller.

.. php:method:: blackHole(object $controller, string $error)

    Met en "trou noir" (black-hole) une requête invalide, avec une
    erreur 404 ou un callback personnalisé. Sans callback, la requête
    sera abandonnée. Si un callback de controller est défini pour
    SecurityComponent::blackHoleCallback, il sera appelé et passera
    toute information sur l'erreur.
 
.. php:attr:: blackHoleCallback

    La fonction de rappel (callback) du controller qui va gérer et requéter
    ce qui doit être mis dans un trou noir (blackholed).
    La fonction de rappel de mise en trou noir (blackhole callback) peut être
    n'importe quelle méthode publique d'un controller.
    La fonction de rappel doit s'attendre a un paramètre indiquant le type
    d'erreur::
    
        public function beforeFilter() {
            $this->Security->blackHoleCallback = 'blackhole';
        }

        public function blackhole($type) {
            // gestions des erreurs.
        }

    Le  paramètre ``$type`` peut avoir les valeurs suivantes:

    * 'auth' Indique une erreur de validation de formulaire, ou une incohérence
      controller/action.
    * 'csrf' Indique une erreur CSRF.
    * 'get' Indique un problème sur la méthode de restriction HTTP.
    * 'post' Indique un problème sur la méthode de restriction HTTP.
    * 'put' Indique un problème sur la méthode de restriction HTTP.
    * 'delete' Indique un problème sur la méthode de restriction HTTP.
    * 'secure' Indique un problème sur la méthode de restriction SSL.

Restreindre les méthodes HTTP
=============================

.. php:method:: requirePost()

    Définit les actions qui nécessitent une requête POST. Prend un
    nombre indéfini de paramètres. Peut être appelé sans argument,
    pour forcer toutes les actions à requérir un POST.
    
.. php:method:: requireGet()

    Définit les actions qui nécessitent une requête GET. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions à requérir un GET.
    
.. php:method:: requirePut()

    Définit les actions qui nécessitent une requête PUT. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions à requérir un PUT.

.. php:method:: requireDelete()

    Définit les actions qui nécessitent une requête DELETE. Prend un
    nombre indéfini de paramètres. Peut-être appelé sans argument,
    pour forcer toutes les actions à requérir un DELETE.
   
Restreindre les actions à SSL
=============================

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

.. php:attr:: allowedControllers

    Une liste de controllers qui peuvent envoyer des requêtes vers ce
    controller. Ceci peut être utilisé pour contrôler les demandes croisées de
    controller.

.. php:attr:: allowedActions

    Une liste des actions qui peuvent envoyer des requêtes vers les actions
    de ce controller. Ceci peut être utilisé pour contrôler les demandes
    croisées de controller.
   
Prévention de la falsification de formulaire
============================================

Par défaut le component Security ``SecurityComponent`` prévient les
utilisateurs de la falsification de formulaire dans certains cas.
``SecurityComponent`` va éviter les choses suivantes:

avec le Helper Form et en traquant quels champs sont dans un formulaire. il
assure le suivi des éléments d'entrée cachés. Toutes ces données sont combinées
et hachées. Quand un formulaire est soumis, le component de sécurité utilisera
les données POSTé pour construire la même structure et comparer le hachage.

* Les champs inconnus ne peuvent être ajoutés au formulaire.
* Les champs ne peuvent être retirés du formulaire.
* Les valeurs dans les inputs cachés ne peuvent être modifiées.

La prévention de ces types de falsification est faite de concert avec
FormHelper, en recherchant les champs qui sont dans un formulaire. Les valeurs
pour les champs cachés sont aussi utilisées. Toutes ces données sont combinées
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

    Mis à ``false`` pour complètement éviter la validation des requêtes POST,
    essentiellement éteindre la validation de formulaire.

configuration CSRF (Cross site request forgery)
===============================================

.. php:attr:: csrfCheck

    Si vous utilisez les formulaires de protection CSRF. Définit à
    ``false`` pour désactiver la protection CSRF sur les formulaires.
    
.. php:attr:: csrfExpires

   La durée avant expiration d'un jeton CSRF.
   Chaque requête formulaire/page va générer un nouveau jeton qui ne
   pourra être soumis qu'une seule fois avant son expiration. Peut
   être une valeur compatible avec ``strtotime()``. Par défaut 30 minutes.

.. php:attr:: csrfUseOnce

   Contrôle si oui ou non  les jetons CSRF sont utilisés et brûlés.
   Définit à ``false`` pour ne pas générer de nouveau jetons sur chaque
   requête. Un jeton pourra être réutilisé jusqu'à ce qu'il expire.
   Ceci réduit les chances des utilisateurs d'avoir des requêtes invalides
   en raison de la consommation de jeton. Cela à pour effet de rendre
   CSRF moins sécurisé, et les jetons réutilisables.

Utilisation
===========

Le component Security est généralement utilisé dans la méthode
``beforeFilter()`` de votre controller. Vous pouvez spécifier les restrictions
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
dans un trou noir, elle appellera le callback ``forceSSL()`` qui redirigera
les requêtes non sécurisées vers les requêtes sécurisées automatiquement.

.. _security-csrf:

protection CSRF
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

Utilisation de la protection CSRF
---------------------------------

En ajoutant simplement la ``SecurityComponent`` à votre tableau
de component, vous pouvez bénéficier de la protection CSRF fournie.
Par défaut les jetons CSRF sont valides 30 minutes et expire à l'utilisation.
Vous pouvez contrôler la durée des jetons en paramétrant csrfExpires
dans le component. ::

    public $components = array(
        'Security' => array(
            'csrfExpires' => '+1 hour'
        )
    );

Vous pouvez aussi définir cette propriété dans la partie ``beforeFilter``
de votre controller. ::

    public function beforeFilter() {
        $this->Security->csrfExpires = '+1 hour';
        // ...
    }

La valeur de la propriété csrfExpires peut être n'importe quelle valeur
compatible à la propriété
`strtotime() <https://secure.php.net/manual/en/function.strtotime.php>`_.
Par défaut le Helper Form :php:class:`FormHelper` ajoutera une
``data[_Token][key]`` contenant le jeton CSRF pour tous les formulaires
quand le component est activé.

Gérer les jetons manquants ou périmés
-------------------------------------

Les jetons manquants ou périmés sont gérés de la même façon que d'autres
violations de sécurité. Le ``blackHoleCallback`` du component ``Security`` sera
appelé avec un paramètre 'csrf'.
Ceci vous aide à filtrer en sortie les problèmes de jeton CSRF, des autres
erreurs.

Utilisation de jeton par-session au lieu de jeton à usage unique
----------------------------------------------------------------

Par défaut un nouveau jeton est généré à chaque requête, et chaque jeton ne
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

Cela dira au component que vous voulez ré-utiliser un jeton CSRF jusqu'à
ce que la requête expire - C'est contrôlé par les valeurs de ``csrfExpires``.
Si vous avez des problèmes avec les jetons expirés, ceci peut être une
bon équilibrage entre la sécurité et la facilité d'utilisation. 

Désactiver la protection CSRF
-----------------------------

Il peut y avoir des cas où vous souhaitez désactiver la protection CSRF
sur vos formulaires. Si vous voulez désactiver cette fonctionnalité, vous
pouvez définir ``$this->Security->csrfCheck = false;`` dans votre
``beforeFilter`` ou utiliser le tableau components. Par défaut la protection
CSRF est activée, et paramétrée pour l'utilisation de jetons à usage unique.

Désactiver CSRF et la Validation des Données Post pour des Actions Spécifiques
==============================================================================

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
