Composants (Components)
########################

Les composants (Components) sont des regroupements de logique applicative
qui sont partagés entre les contrôleurs. Si vous vous surprenez à vouloir 
copier et coller des choses entre vos contrôleurs, alors vous devriez envisager
de regrouper plusieurs fonctionnalités dans un Composant. 

CakePHP est également livré avec un fantastique ensemble de composants,
que vous pouvez utiliser pour vous aider : 

- Sécurité
- Sessions
- Listes de contrôle d'accès (ACL)
- Emails
- Cookies
- Authentification
- Traitement de requêtes
- Pagination

Chacun de ces composants d’origine est détaillé dans des chapitres
spécifiques. Pour l’heure, nous allons vous montrer comment créer 
vos propres composants. La création de composants vous permet de garder
le code de vos contrôleurs propre et vous permet de réutiliser 
du code entre vos projet.

.. _configuring-components:

Configuration des Composants
============================

De nombreux composants du cœur nécessitent une configuration. Quelques exemples :
:doc:`/core-libraries/components/authentication`, :doc:`/core-libraries/components/cookie`
et :doc:`/core-libraries/components/email`.
Toute configuration pour ces composants, et pour les composants en général, 
se fait dans le tableau des ``$components`` de la méthode ``beforeFilter()`` de vos contrôleurs::

    <?php
    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array('controller' => 'users', 'action' => 'login')
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

Serait un exemple de configuration d'un composant avec le tableau 
``$components``. Tous les composants du coeur permettent aux paramètres
d'être configurés dans la méthode de votre controlleur ``beforeFilter()``.
C'est utile quand vous avez besoin d'assigner les résultats d'une fonction
à la propriété d'un composant. Ceci peut aussi être exprimé comme::

    <?php
    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');

        $this->Cookie->name = 'CookieMonster';
    }

C'est possible, cependant, que le composant requièrt certaines options de 
configuration avant que le contrôleur ``beforeFilter()`` soit lancé.
Pour cela, certains composants permettent aux options de configuration
d'être définies dans le tableau ``$components``::

    <?php
    public $components = array('DebugKit.Toolbar' => array('panels' => array('history', 'session')));

Consulter la documentation pertiente pour connaître les options de configuration
que chaque composant fournit.

Un paramètre commun à utiliser est l'option ``className``, qui vous autorise les 
alias des composants. Cette fonctionnalité est utile quand vous voulez remplacer
``$this->Auth`` ou à une autre référence de Composant commun avec une impémentation
sur mesure::

    <?php
    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'className' => 'MyAuth'
            )
        );
    }

    // app/Controller/Component/MyAuthComponent.php
    App::uses('AuthComponent', 'Controller/Component');
    class MyAuthComponent extends AuthComponent {
        // Ajouter votre code pour écraser le AuthComponent du coeur
    }

Ce qu'il y a au-dessous donnerait un *alias* ``MyAuthComponent`` à ``$this->Auth`` dans vos
controlleurs.

.. note::

    Faire un alias à un composant remplace
Aliasing a component replaces that instance anywhere that component is used,
    including inside other Components.

Utiliser les Composants
=======================

Une fois que vous avez inclu quelques composants dan votre controlleur,
les utiliser est très simple. Chaque composant que vous utilisez est enregistré
comme propriété dans votre controlleur. Si vous avez chargé la
:php:class:`SessionComponent` et le :php:class:`CookieComponent` dans votre
controlleur, vous pouvez y accèder comme ceci::

    <?php
    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');
        
        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    Depuis que les Modèles et les Composants sont tous deux ajoutés aux
    controlleurs en tant que propriété, ils partagent le même 'espace de noms'.
    Assurez vous de ne pas donner le même nom à un composant et un modèle

Charger les composants à la volée
---------------------------------

Vous n'avez parfois pas besoin de rendre le composant accessible sur chaque action.
Dans ce cas là, vous pouvez charger à la volée en utilisant la 
:doc:`Component Collection </core-libraries/collections>`. A partie de l'intérieur 
d'un controlleur, vous pouvez faire comme ce qui suit::
    
    <?php
    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();


Callbacks des composants
========================

Les composants vous offrent aussi quelques callbacks durant le cycle de vie
qui vous permettent d'augmenter le cycle de la requête. Allez voir l'api
:ref:`component-api` pour plus d'informations sur les callbacks possibles 
des composants.

Créer un Composant
==================

Supposons que notre application en ligne ait besoin de réaliser une opération 
mathématique complexe dans plusieurs sections différentes de l'application.
Nous pourrions créer un composant pour héberger cette logique partagée afin 
de l'utiliser dans plusieurs contrôleurs différents.

La première étape consiste à créer un nouveau fichier et une classe pour 
le composant. Créez le fichier dans ``/app/Controller/Component/MathComponent.php``.
La structure de base pour le composant ressemblerait à quelque chose comme ça ::

    <?php
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    Tous les composant Math doivent étendre :php:class:`Component`. Ne pas le faire
    vous enverra une exception.

Inclure votre composant dans vos controlleurs
---------------------------------------------

Une fois notre composant terminé, nous pouvons l’utiliser au sein
des contrôleurs de l’application en plaçant son nom 
(sans la partie "Component") dans le tableau ``$components`` du contrôleur.
Le contrôleur sera automatiquement pourvu d'un nouvel attribut nommé 
d'après le composant, à travers lequel nous pouvons accéder à une instance 
de celui-ci::

    <?php
    /* Rend le nouveau composant disponible par $this->Math
    ainsi que le composant standard $this->Session */
    public $components = array('Math', 'Session');

Les Composants déclarés dans ``AppController`` seront fusionnés avec ceux 
déclarés dans vos autres contrôleurs. Donc il n'y a pas besoin de re-déclarer 
le même composant deux fois.

Quand vous incluez des Composants dans un Contrôleur, vous pouvez 
aussi déclarer un ensemble de paramètres qui seront passés à la 
méthode initialize() du Composant. Ces paramètres peuvent alors être 
pris en charge par le Composant::

    <?php
    public $components = array(
        'Math' => array(
            'precision' => 2,
            'generateurAleatoire' => 'srand'
        ),
        'Session', 'Auth'
    );

L'exemple ci-dessus passerait le tableau contenant "precision"
et "generateurAleatoire" comme second paramètre au
``MathComponent::__construct()``. Par convention, tout paramètre passé
qui sont aussi des propriétés publiques sur votre composant auront
les valeurs basés sur ces paramètres.

Utiliser d'autres Composants dans votre Composant
-------------------------------------------------

Parfois un de vos composants a besoin d'utiliser un autre composant.
Dans ce cas, vous pouvez inclure d'autres composants dans votre composant
exactement de la même manière que dans vos contrôleurs - en utilisant
``$components`` var::

    <?php
    // app/Controller/Component/CustomComponent.php
    class CustomComponent extends Component {
        // l'autre composant que votre composant utilise
        public $components = array('Existing'); 

        public function initialize($controller) {
            $this->Existing->foo();
        }

        public function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    class ExistingComponent extends Component {

        public function initialize($controller) {
            $this->Parent->bar();
        }

        public function foo() {
            // ...
        }
    }

.. _component-api:

API de Component
================

.. php:class:: Component

    La classe de base de Component vous offre quelques méthodes pour le chargement
    de faignant des autres Composants à travers :php:class:`ComponentCollection` 
    comme nous l'avons traité avec la gestion habituelle des paramètres. Elle fournit
    aussi des prototypes pour tous les callbacks des composants.

.. php:method:: __construct(ComponentCollection $collection, $parametres = array())

    Les Constructeurs pour la classe de base du composant. Tous les ``$parametres`` qui
    sont aussi des propriétés publiques, vont avoir leurs valeurs changées pour matcher
    avec les valeurs de ``$settings``.

Les Callbacks
-------------

.. php:method:: initialize($controller)

    La méthode initialize est appelée avant la méthode du contrôleur beforeFilter.

.. php:method:: startup($controller)

    La méthode startup est appelée après la méthode du contrôleur beforeFilter
    mais avant que le controlleur n'execute l'action prévue.

.. php:method:: beforeRender($controller)

    La méthode beforeRender est appelée après que le contrôleur exécute la logique de
    l'action requêté, mais avant que le rendu de la vue et le layout du contrôleur.

.. php:method:: shutdown($controller)

    La méthode shutdown est appelée avant que la sortie soit envoyé au navigateur.

.. php:method:: beforeRedirect($controller, $url, $status=null, $exit=true)

    La méthode beforeRedirect est invoquée quand la méthode de redirection du contrôleur
    est appelée, mais avant toute action qui suit. Si cette méthode retourne false, le
    contrôleur ne continuera pas de rediriger la requête. Les variables $url, $status
    et $exit ont la même signification que pour la méthode du contrôleur. Vous pouvez
    aussi retourner une chaîne de caractère qui sera interpretée comme une url pour
    rediriger ou retourner un array associatif avec la clé 'url' et éventuellement
    'status' et 'exit'.


.. meta::
    :title lang=fr: Composants (Components)
    :keywords lang=fr: tableau contrôleur,librairies du coeur,authentification requêtes,tableau de nom,Liste contrôle accès,public components,contrôleur code,components du coeur,cookiemonster,cookie de connexion,paramètres de configuration,fonctionalité,logic,sessions,cakephp,doc
