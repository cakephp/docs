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

Using Components
================

Once you've included some components in your controller, using them is
pretty simple.  Each component you use is exposed as a property on your
controller.  If you had loaded up the :php:class:`SessionComponent` and
the :php:class:`CookieComponent` in your controller, you could access
them like so::

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

    Since both Models and Components are added to Controllers as
    properties they share the same 'namespace'.  Be sure to not give a
    component and a model the same name.

Loading components on the fly
-----------------------------

You might not need all of your components available on every controller action.
In situations like this you can load a component at runtime using the
:doc:`Component Collection </core-libraries/collections>`.  From inside a
controller you can do the following::
    
    <?php
    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();


Component Callbacks
===================

Components also offer a few request life-cycle callbacks that allow them
to augment the request cycle.  See the base :ref:`component-api` for
more information on the callbacks components offer.

Creating a Component
====================

Suppose our online application needs to perform a complex
mathematical operation in many different parts of the application.
We could create a component to house this shared logic for use in
many different controllers.

The first step is to create a new component file and class. Create
the file in ``/app/Controller/Component/MathComponent.php``. The basic
structure for the component would look something like this::

    <?php
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    All components must extend :php:class:`Component`.  Failing to do this
    will trigger an exception. 

Including your component in your controllers
--------------------------------------------

Once our component is finished, we can use it in the application's
controllers by placing the component's name (minus the "Component"
part) in the controller's ``$components`` array. The controller will
automatically be given a new attribute named after the component,
through which we can access an instance of it::

    <?php
    /* Make the new component available at $this->Math,
    as well as the standard $this->Session */
    public $components = array('Math', 'Session');

Components declared in ``AppController`` will be merged with those
in your other controllers. So there is no need to re-declare the
same component twice.

When including Components in a Controller you can also declare a
set of parameters that will be passed on to the Component's
constructor. These parameters can then be handled by
the Component::

    <?php
    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

The above would pass the array containing precision and
randomGenerator to ``MathComponent::__construct()`` as the
second parameter.  By convention, any settings that have been passed
that are also public properties on your component will have the values
set based on the settings.


Using other Components in your Component
----------------------------------------

Sometimes one of your components may need to use another component.
In this case you can include other components in your component the exact same
way you include them in controllers - using the ``$components`` var::

    <?php
    // app/Controller/Component/CustomComponent.php
    class CustomComponent extends Component {
        // the other component your component uses
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

Component API
=============

.. php:class:: Component

    The base Component class offers a few methods for lazily loading other
    Components through :php:class:`ComponentCollection` as well as dealing
    with common handling of settings.  It also provides prototypes for all
    the component callbacks.

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    Constructor for the base component class.  All ``$settings`` that
    are also public properties will have their values changed to the
    matching value in ``$settings``.

Callbacks
---------

.. php:method:: initialize($controller)

    The initialize method is called before the controller's
    beforeFilter method.

.. php:method:: startup($controller)

    The startup method is called after the controller's beforeFilter
    method but before the controller executes the current action
    handler.

.. php:method:: beforeRender($controller)

    The beforeRender method is called after the controller executes the
    requested action's logic but before the controller's renders views
    and layout.

.. php:method:: shutdown($controller)

    The shutdown method is called before output is sent to browser.

.. php:method:: beforeRedirect($controller, $url, $status=null, $exit=true)

    The beforeRedirect method is invoked when the controller's redirect
    method is called but before any further action. If this method
    returns false the controller will not continue on to redirect the
    request. The $url, $status and $exit variables have same meaning as
    for the controller's method. You can also return a string which
    will be interpreted as the url to redirect to or return associative
    array with key 'url' and optionally 'status' and 'exit'.



.. meta::
    :title lang=en: Components
    :keywords lang=en: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
