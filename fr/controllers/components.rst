Components (Composants)
#######################

Les Components (Composants) sont des regroupements de logique applicative qui
sont partagés entre les controllers. CakePHP est également livré avec un
fantastique ensemble de components, que vous pouvez utiliser pour vous aider
dans de nombreuses tâches communes. Vous pouvez également créer votre propre
component. Si vous vous surprenez à vouloir copier et coller des choses entre
vos controllers, alors vous devriez envisager de regrouper celle-ci dans un
Component. Créer des components permet de garder un code de controller propre
et vous permet de réutiliser du code entre différents controllers.

Pour plus d'informations sur les components intégrés dans CakePHP, consultez
le chapitre de chaque component:

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling
    /controllers/components/form-protection
    /controllers/components/check-http-cache

.. _configuring-components:

Configuration des Components
============================

De nombreux components du cœur nécessitent une configuration. Quleques exemples de composants
qui requièrent une configuration sont :doc:`/controllers/components/security` et
:doc:`/controllers/components/request-handling`.
La configuration pour ces components, et pour les components en général, se fait
via ``loadComponent()`` dans la méthode ``initialize()`` de votre Controller ou
via le tableau ``$components``::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler', [
                'viewClassMap' => ['json' => 'AppJsonView'],
            ]);
            $this->loadComponent('Security', ['blackholeCallback' => 'blackhole']);
        }
    }

Vous pouvez configurer les components à la volée en utilisant la méthode
``setConfig()``. Souvent, ceci est fait dans la méthode ``beforeFilter()`` de votre
controller. Ceci peut aussi être exprimé comme ceci::

    public function beforeFilter(EventInterface $event)
    {
        $this->RequestHandler->setConfig('viewClassMap', ['rss' => 'MyRssView']);
    }

Comme les helpers, les components ont des méthodes ``getConfig()`` et ``setConfig()``
qui sont utilisées pour récupérer et définir toutes les configurations pour un component::

    // Lire des données de config.
     $this->RequestHandler->getConfig('viewClassMap');

    // Définir la config
    $this->Csrf->setConfig('cookieName', 'token');

Comme avec les helpers, les components vont automatiquement fusionner leur
propriété ``$_defaultConfig`` avec la configuration du constructeur pour créer
la propriété ``$_config`` qui est accessible avec ``getConfig()`` et  ``setConfig()``.

Faire des Alias avec les Components
-----------------------------------

Un paramètre commun à utiliser est l'option ``className``, qui vous autorise
à faire des alias des components. Cette fonctionnalité est utile quand vous
voulez remplacer ``$this->Auth`` ou une autre référence habituelle de Component
avec une implémentation sur mesure::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize('Auth', [
                'className' => 'MyAuth'
            ]);
        }
    }

    // src/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent
    {
        // Ajoutez votre code pour surcharge l'AuthComponent du cœur
    }

Le code ci-dessus fera un *alias* ``MyAuthComponent`` de ``$this->Auth`` dans
vos controllers.

.. note::

    Faire un alias à un component remplace cette instance n'importe où où le
    component est utilisé, en incluant l'intérieur des autres Components.

Charger les Components à la Volée
---------------------------------

Vous n'avez parfois pas besoin de rendre le component accessible sur chaque
action du controller. Dans ce cas là, vous pouvez le charger à la volée en
utilisant la méthode ``loadComponent()`` à l'intérieur de votre controller::

    // Dans l'action du controller
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    Gardez à l'esprit que le chargement d'un component à la volée n'appellera
    pas les callbacks manquants. Si vous souhaitez que les callbacks
    ``beforeFilter`` ou ``startup()`` soient appelées, vous devrez les appeler
    manuellement selon le moment où vous chargez votre component.

Utiliser les Components
=======================

Une fois que vous avez inclus quelques components dans votre controller, les
utiliser est très simple. Chaque component que vous utilisez est enregistré
comme propriété dans votre controller. Si vous avez chargé la
:php:class:`Cake\\Controller\\Component\\FlashComponent` dans votre controller,
vous pouvez y accéder comme ceci::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Publication effacée.');

                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    Puisque les Modèles et les Components sont tous deux ajoutés aux
    controllers en tant que propriétés, ils partagent le même 'espace de noms'.
    Assurez-vous de ne pas donner le même nom à un component et à un model.

.. _creating-a-component:

Créer un Component
==================

Supposons que notre application en ligne ait besoin de réaliser une opération
mathématique complexe dans plusieurs sections différentes de l'application.
Nous pourrions créer un component pour héberger cette logique partagée afin de
l'utiliser dans plusieurs controllers différents.

La première étape consiste à créer un nouveau fichier et une classe pour le
component. Créez le fichier dans **src/Controller/Component/MathComponent.php**.
La structure de base pour le component ressemblerait à quelque chose comme
cela::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

    Tous les components doivent étendre
    :php:class:`Cake\\Controller\\Component`. Ne pas le faire vous enverra une
    exception.

Inclure votre Component dans vos Controllers
--------------------------------------------

Une fois notre component terminé, nous pouvons l'utiliser dans le controller de
l'application en le chargeant durant la méthode ``initialize()`` du controller.
Une fois chargé, le controller sera automatiquement pourvu d'un nouvel attribut
nommé d'après le component, à travers lequel nous pouvons accéder à une instance
de celui-ci::

    // Dans un controller
    // Rend le nouveau component disponible avec $this->Math
    // ainsi que le component standard $this->Csrf
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Csrf');
    }

Quand vous incluez des Components dans un Controller, vous pouvez aussi déclarer
un ensemble de paramètres qui seront passés au constructeur du Component. Ces
paramètres peuvent alors être pris en charge par le Component::

    // Dans votre controller.
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ]);
        $this->loadComponent('Csrf');
    }

L'exemple ci-dessus passerait le tableau contenant precision et randomGenerator
dans le paramètre ``$config`` de ``MathComponent::initialize()``.

Utiliser d'autres Components dans votre Component
-------------------------------------------------

Parfois un de vos components a besoin d'utiliser un autre component. Dans ce
cas, vous pouvez inclure d'autres components dans votre component exactement de
la même manière que dans vos controllers - en utilisant la variable
``$components``::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // L'autre component que votre component utilise
        public $components = ['Existing'];

        // Exécute une autre configuration additionnelle pour votre component.
        public function initialize(array $config): void
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
       }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {

        public function foo()
        {
            // ...
        }
    }

.. note::

    Au contraire d'un component inclus dans un controller, aucun callback
    ne sera attrapé pour un component inclus dans un component.

Accéder au Controller du Component
-----------------------------------

À partir d'un component, vous pouvez accéder au controller courant via le
registre::

    $controller = $this->getController();

Callbacks des Components
========================

Les components vous offrent aussi quelques callbacks durant leur cycle de vie
qui vous permettent d'augmenter le cycle de la requête.

.. php:method:: beforeFilter(EventInterface $event)

    Est appelée avant la méthode du controller beforeFilter, mais *après*
    la méthode initialize() du controller.

.. php:method:: startup(EventInterface $event)

    Est appelée après la méthode du controller beforeFilter mais avant que
    le controller n'exécute l'action prévue.

.. php:method:: beforeRender(EventInterface $event)

    Est appelée après que le controller exécute la logique de l'action
    requêtée, mais avant le rendu de la vue et le layout du controller.

.. php:method:: shutdown(EventInterface $event)

    Est appelée avant que la sortie soit envoyée au navigateur.

.. php:method:: beforeRedirect(EventInterface $event, $url, Response $response)

    Est invoquée quand la méthode de redirection du controller est appelée,
    mais avant toute action qui suit. Si cette méthode retourne ``false``, le
    controller ne continuera pas à rediriger la requête. Les paramètres $url et
    $response vous permettent d'inspecter et de modifier la localisation ou
    toutes autres entêtes dans la réponse.

.. _redirect-component-events:

Utiliser des Redirections dans les Events des Components
========================================================

Pour rediriger à partir d'une méthode de rappel de composant, vous pouvez utiliser ce qui suit::

    public function beforeFilter(EventInterface $event)
    {
        $event->stopPropagation();

        return $this->getController()->redirect('/');
    }

En arrêtant l'événement, vous faites savoir à CakePHP que vous ne voulez pas que les autres
méthodes de callback de d'autres composants ne soient appelées ni que le controller ne
gère l'action plus avant. À partir de la version 4.1.0, vous pouvez déclencher une
``RedirectException`` pour signaler une redirection::

    use Cake\Http\Exception\RedirectException;
    use Cake\Routing\Router;

    public function beforeFilter(EventInterface $event)
    {
        throw new RedirectException(Router::url('/'))
    }

La levée d'une exception arrêtera tous les autres écouteurs d'événements et créera une
nouvelle réponse qui ne conserve ou n'hérite d'aucun des en-têtes de la réponse actuelle.
Lors de la levée d'une ``RedirectException``, vous pouvez inclure des en-têtes supplémentaires::

    throw new RedirectException(Router::url('/'), 302, [
        'Header-Key' => 'value',
    ]);

.. meta::
    :title lang=fr: Components (Composants)
    :keywords lang=fr: tableau controller,librairies du cœur,authentification requêtes,tableau de nom,Liste contrôle accès,public components,controller code,components du cœur,cookiemonster,cookie de connexion,paramètres de configuration,fonctionalité,logic,sessions,cakephp,doc
