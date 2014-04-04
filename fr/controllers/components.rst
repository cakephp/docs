Components (Composants)
#######################

Les Components (Composants) sont des regroupements de logique applicative
qui sont partagés entre les controllers. CakePHP est également livré avec un
fantastique ensemble de components, que vous pouvez utiliser pour vous aider.
Si vous vous surprenez à vouloir copier et coller des choses entre vos
controllers, alors vous devriez envisager de regrouper plusieurs
fonctionnalités dans un Component. Créer des components permettent de garder
un code de controller propre et vous permet de réutiliser du code entre des
projets.

Chacun de ces components d'origine est détaillé dans son chapitre
spécifique. Regardez :doc:`/core-libraries/toc-components`. Cette section
décrit la façon de configurer et d'utiliser les components et la façon de
créer vos propres components.

.. _configuring-components:

Configuration des Components
============================

De nombreux components du cœur nécessitent une configuration. Quelques
exemples :
:doc:`/core-libraries/components/authentication` and
:doc:`/core-libraries/components/cookie`.
Toute configuration pour ces components, et pour les components en général,
se fait dans le tableau des ``$components`` de la méthode ``beforeFilter()``
de vos controllers::

    class PostsController extends AppController {
        public $components = [
            'Auth' => [
                'authorize' => ['controller'],
                'loginAction' => ['controller' => 'users', 'action' => 'login']
            ],
            'Cookie' => ['name' => 'CookieMonster']
        ];

La portion de code précédente est un exemple de configuration d'un component
avec le tableau ``$components``. Vous pouvez configurer les components à la
volée en utilisant la méthode ``config()``. Souvent, ceci est fait dans la
méthode ``beforeFilter()`` de votre controller. Ceci peut aussi être exprimé
comme ceci::

    public function beforeFilter() {
        $this->Auth->config('authorize', ['controller']);
        $this->Auth->config('loginAction', ['controller' => 'users', 'action' => 'login']);

        $this->Cookie->config('name', 'CookieMonster');
    }

Comme les helpers, les components ont une méthode ``config()`` qui est utilisée
pour récupérer et définir toutes les configurations pour un component::

    // Lire des données de config.
    $this->Auth->config('loginAction');

    // Définir la config
    $this->Csrf->config('cookieName', 'token');

Comme avec les helpers, les components vont automatiquement fusionner leur
propriété ``$_defaultConfig`` avec le configuration du constructeur pour créer
la propriété ``$_config`` qui est accessible avec ``config()``.

Faire des alias avec les Components
-----------------------------------

Un paramètre commun à utiliser est l'option ``className``, qui vous autorise
les alias des components. Cette fonctionnalité est utile quand vous voulez
remplacer ``$this->Auth`` ou une autre référence de Component commun avec
une implémentation sur mesure::

    // App/Controller/PostsController.php
    class PostsController extends AppController {
        public $components = [
            'Auth' => [
                'className' => 'MyAuth'
            ]
        ];
    }

    // App/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent {
        // Add your code to override the core AuthComponent
    }

Ce qu'il y a au-dessous donnerait un *alias* ``MyAuthComponent`` à
``$this->Auth`` dans vos controllers.

.. note::

    Faire un alias à un component remplace cette instance n'importe où où le
    component est utilisé, en incluant l'intérieur des autres Components.

Utiliser les Components
=======================

Une fois que vous avez inclu quelques components dans votre controller,
les utiliser est très simple. Chaque component que vous utilisez est enregistré
comme propriété dans votre controller. Si vous avez chargé la
:php:class:`SessionComponent` et le :php:class:`CookieComponent` dans votre
controller, vous pouvez y accéder comme ceci::

    class PostsController extends AppController {
        public $components = ['Session', 'Cookie'];

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    Puisque les Models et les Components sont tous deux ajoutés aux
    controllers en tant que propriété, ils partagent le même 'espace de noms'.
    Assurez vous de ne pas donner le même nom à un component et à un model.

Charger les components à la volée
---------------------------------

Vous n'avez parfois pas besoin de rendre le component accessible sur chaque
action. Dans ce cas là, vous pouvez charger à la volée en utilisant la
:doc:`Component Collection </core-libraries/collections>`. A partir de
l'intérieur d'un controller, vous pouvez faire comme ce qui suit::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();

.. note::

    Gardez à l'esprit que le chargement d'un component à la volée ne va pas
    appeler la méthode initialize. Si le component que vous appelez a cette
    méthode, vous devrez l'appeler manuellement après le chargement.

Callbacks des Components
========================

Les components vous offrent aussi quelques callbacks durant leur cycle de vie
qui vous permettent d'augmenter le cycle de la requête. Allez voir l'api
:ref:`component-api` et :doc:`/core-libraries/events` pour plus d'informations
sur les callbacks possibles des components.

.. _creating-a-component:

Créer un Component
==================

Supposons que notre application en ligne ait besoin de réaliser une opération
mathématique complexe dans plusieurs sections différentes de l'application.
Nous pourrions créer un component pour héberger cette logique partagée afin
de l'utiliser dans plusieurs controllers différents.

La première étape consiste à créer un nouveau fichier et une classe pour
le component. Créez le fichier dans
``/App/Controller/Component/MathComponent.php``. La structure de base pour
le component ressemblerait à quelque chose comme cela::

    use Cake\Controller\Component;

    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    Tous les components comme Math doivent étendre :php:class:`Component`.
    Ne pas le faire vous enverra une exception.

Inclure votre component dans vos controllers
--------------------------------------------

Une fois notre component terminé, nous pouvons l'utiliser au sein
des controllers de l'application en plaçant son nom
(sans la partie "Component") dans le tableau ``$components`` du controller.
Le controller sera automatiquement pourvu d'un nouvel attribut nommé
d'après le component, à travers lequel nous pouvons accéder à une instance
de celui-ci::

    /* Rend le nouveau component disponible par $this->Math
    ainsi que le component standard $this->Session */
    public $components = ['Math', 'Session'];;

Les Components déclarés dans ``AppController`` seront fusionnés avec ceux
déclarés dans vos autres controllers. Donc il n'y a pas besoin de re-déclarer
le même component deux fois.

Quand vous incluez des Components dans un Controller, vous pouvez
aussi déclarer un ensemble de paramètres qui seront passés au constructeur
du Component. Ces paramètres peuvent alors être pris en charge par le
Component::

    public $components = [
        'Math' => [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ],
        'Session', 'Auth'
    ];

L'exemple ci-dessus passerait le tableau contenant "precision"
et "generateurAleatoire" comme second paramètre au
``MathComponent::__construct()``. Par convention, si les clés du tableau
correspondent aux propriétés publiques du component, les propriétés seront
définies avec les valeurs de ces clés.

Utiliser d'autres Components dans votre Component
-------------------------------------------------

Parfois un de vos components a besoin d'utiliser un autre component.
Dans ce cas, vous pouvez inclure d'autres components dans votre component
exactement de la même manière que dans vos controllers - en utilisant la
variable ``$components``::

    // App/Controller/Component/CustomComponent.php
    use Cake\Controller\Component;

    class CustomComponent extends Component {
        // the other component your component uses
        public $components = ['Existing'];

        public function initialize(Controller $controller) {
            $this->Existing->foo();
        }

        public function bar() {
            // ...
       }
    }

    // App/Controller/Component/ExistingComponent.php
    use Cake\Controller\Component;

    class ExistingComponent extends Component {

        public function foo() {
            // ...
        }
    }

.. note::
    Au contraire d'un component inclu dans un controller, aucun callback
    ne sera attrapé pour un component inclu dans un component.

.. _component-api:

API de Component
================

.. php:class:: Component

    La classe de base de Component vous offre quelques méthodes pour le
    chargement facile des autres Components à travers
    :php:class:`Cake\\Controller\\ComponentRegistry` comme nous l'avons traité
    avec la gestion habituelle des paramètres. Elle fournit aussi des prototypes
    pour tous les callbacks des components.

.. php:method:: __construct(ComponentRegistry $registry, $config = [])

    Les Constructeurs pour la classe de base du component. Tous les
    paramètres se trouvent dans ``$config`` et ont des propriétés publiques.
    Ils vont avoir leur valeur changée pour correspondre aux valeurs de
    ``$config``.

Les Callbacks
-------------

.. php:method:: initialize(Event $event, Controller $controller)

    Est appelée avant la méthode du controller
    beforeFilter.

.. php:method:: startup(Event $event, Controller $controller)

    Est appelée après la méthode du controller
    beforeFilter mais avant que le controller n'exécute l'action prévue.

.. php:method:: beforeRender(Event $event, Controller $controller)

    Est appelée après que le controller exécute la
    logique de l'action requêtée, mais avant le rendu de la vue et le
    layout du controller.

.. php:method:: shutdown(Event $event, Controller $controller)

    Est appelée avant que la sortie soit envoyée au navigateur.

.. php:method:: beforeRedirect(Event $event, Controller $controller, $url, $response)

    Est invoquée quand la méthode de redirection du controller est appelée,
    mais avant toute action qui suit. Si cette méthode retourne false, le
    controller ne continuera pas de rediriger la requête. Les paramètres $url et
    $response vous permettent d'inspecter et de modifier la localisation de tout
    autre header dans la réponse.


.. meta::
    :title lang=fr: Components (Composants)
    :keywords lang=fr: tableau controller,librairies du coeur,authentification requêtes,tableau de nom,Liste contrôle accès,public components,controller code,components du coeur,cookiemonster,cookie de connexion,paramètres de configuration,fonctionalité,logic,sessions,cakephp,doc
