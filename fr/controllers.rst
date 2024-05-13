Controllers (Contrôleurs)
#########################

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Les Controllers sont le 'C' dans MVC. Après que le routage a été appliqué et
que le bon controller a été trouvé, l'action de votre controller est appelée.
Votre controller devra gérer l'interprétation des données requêtées, s'assurer
que les bons modèles sont appelés et que la bonne réponse ou vue est rendue. Les
controllers peuvent être imaginés comme une couche intercalée entre le Modèle et
la Vue. Le mieux est de garder des controllers peu chargés, et des modèles plus
fournis. Cela vous aidera à réutiliser votre code et facilitera le test de votre
code.

Habituellement, les controllers sont utilisés pour gérer la logique autour d'un
seul modèle. Par exemple, si vous construisez un site pour gérer une boulangerie
en-ligne, vous aurez sans doute un RecettesController qui gère vos recettes et
un IngredientsController qui gère vos ingrédients. Cependant, il est aussi
possible d'avoir des controllers qui fonctionnent avec plus d'un modèle. Dans
CakePHP, un controller est nommé d'après le modèle principal qu'il gère.

Les controllers de votre application sont des classes qui étendent la classe
CakePHP ``AppController``, qui hérite elle-même de la classe
:php:class:`Controller` du cœur. La classe ``AppController`` peut être définie
dans **src/Controller/AppController.php** et elle devra contenir les méthodes
partagées par tous les controllers de votre application.

Les controllers peuvent inclure un certain nombre de méthodes qui gèrent les
requêtes. Celles-ci sont appelées des *actions*. Par défaut, chaque méthode
publique dans un controller est une action accessible via une URL. Une action
est responsable de l'interprétation des requêtes et de la création de la
réponse. Habituellement, les réponses sont sous forme de vue rendue, mais il y a
aussi d'autres façons de créer des réponses.

.. _app-controller:

Le Controller App
=================

Comme indiqué dans l'introduction, la classe ``AppController`` est la classe
mère de tous les controllers de votre application. ``AppController`` étend
elle-même la classe :php:class:`Cake\\Controller\\Controller` incluse dans la
librairie du cœur de CakePHP. ``AppController`` est définie dans
**src/Controller/AppController.php** comme ceci::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Les attributs et méthodes de controller créés dans ``AppController`` seront
disponibles dans tous les controllers de votre application. Les Components (que
vous découvrirez plus loin) sont plus appropriés pour du code utilisé dans la
plupart des controllers (mais pas nécessairement tous).

Vous pouvez utiliser ``AppController`` pour charger les components qui seront
utilisés dans tous les controllers de votre application. CakePHP fournit une
méthode ``initialize()`` qui est appelée à la fin du constructeur du Controller
pour ce type d'utilisation::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {

        public function initialize(): void
        {
            // Active toujours le component CSRF.
            $this->loadComponent('Csrf');
        }

    }

En plus de la méthode ``initialize()``, l'ancienne propriété ``$components``
vous permettra aussi de déclarer les components qui doivent être chargés. Bien
que les règles d'héritage en orienté objet s'appliquent, les components et
les helpers utilisés par un controller sont traités spécifiquement. Dans ces
cas, les valeurs de la propriété de ``AppController`` sont fusionnées avec les
tableaux de la classe de controller enfant. Les valeurs dans la classe enfant
surchargeront toujours celles de ``AppController``.

Déroulement d'une Requête
=========================

Quand une requête est faîte dans une application CakePHP, les classes
:php:class:`Cake\\Routing\\Router` et :php:class:`Cake\\Routing\\Dispatcher` de
CakePHP utilisent la fonctionnalité :ref:`routes-configuration` pour trouver et créer le bon
controller. La requête de données est encapsulée dans un objet request.
CakePHP met toutes les informations importantes de la requête dans la
propriété ``$this->request``. Consultez la section :ref:`cake-request`
pour plus d'informations sur l'objet request de CakePHP.

Les Actions du Controller
=========================

Les actions du Controller sont responsables de la conversion des paramètres de
la requête dans une réponse pour le navigateur/utilisateur faisant la requête.
CakePHP utilise des conventions pour automatiser le processus et retirer
quelques codes boiler-plate que vous auriez besoin d'écrire autrement.

Par convention, CakePHP rend une vue avec une version inflectée du nom de
l'action. Revenons à notre boulangerie en ligne par exemple, notre
RecipesController pourrait contenir les actions
``view()``, ``share()``, et ``search()``. Le controller serait trouvé dans
**src/Controller/RecipesController.php** et contiendrait::

    // src/Controller/RecipesController.php

    class RecipesController extends AppController
    {
        public function view($id)
        {
            //la logique de l'action va ici.
        }

        public function share($customerId, $recipeId)
        {
            //la logique de l'action va ici.
        }

        public function search($query)
        {
            //la logique de l'action va ici.
        }
    }

Les fichiers de template pour ces actions seraient
**templates/Recipes/view.php**, **templates/Recipes/share.php**, et
**templates/Recipes/search.php**. Le nom du fichier de vue est par convention
le nom de l'action en minuscules et avec des underscores.

Les actions du Controller utilisent généralement ``Controller::set()`` pour
créer un contexte que ``View`` utilise pour afficher la couche de vue. Du fait
des conventions que CakePHP utilise, vous n'avez pas à créer et rendre la vue
manuellement. Au lieu de ça, une fois qu'une action du controller est terminée,
CakePHP va gérer le rendu et la livraison de la Vue.

Si pour certaines raisons, vous voulez éviter le comportement par défaut, vous
pouvez retourner un objet de :php:class:`Cake\\Http\\Response` de l'action
avec la response complètement créée.

Afin que vous utilisiez efficacement le controller dans votre propre
application, nous allons détailler certains des attributs et méthodes du cœur
fournis par les controllers de CakePHP.

Interactions avec les Vues
==========================

Les Controllers interagissent avec les vues de plusieurs façons.
Premièrement, ils sont capables de passer des données aux vues, en utilisant
``Controller::set()``. Vous pouvez aussi décider quelle classe de vue
utiliser, et quel fichier de vue doit être rendu à partir du controller.

.. _setting-view_variables:

Définir les Variables de View
-----------------------------

.. php:method:: set(string $var, mixed $value)

La méthode ``Controller::set()`` est la principale façon utilisée
pour transmettre des données de votre controller à votre vue. Une fois
``Controller::set()`` utilisée, la variable de votre controller
devient accessible dans la vue::

    // Dans un premier temps vous passez les données depuis le controller:

    $this->set('couleur', 'rose');

    // Ensuite vous pouvez les utiliser dans la vue de cette manière:
    ?>

    Vous avez sélectionné un glaçage <?= $couleur; ?> pour le gâteau.

La méthode ``Controller::set()`` peut également prendre un tableau
associatif comme premier paramètre. Cela peut souvent être une manière
rapide d'affecter en une seule fois un jeu complet d'informations à la vue::

    $data = [
        'couleur' => 'rose',
        'type' => 'sucre',
        'prix_de_base' => 23.95
    ];

    // donne $couleur, $type, et $prix_de_base
    // disponible dans la vue:

    $this->set($data);

Gardez à l'esprit que les variables de vue sont partagées entre toutes les parties rendues par votre vue.
Elles seront disponibles dans toutes les parties de la vue: le modèle, la mise en page et tous les éléments
à l'intérieur des deux premiers.

Définir les Options d'une View
------------------------------

Si vous voulez personnaliser la classe de vue, les dossiers de layout/template,
les helpers ou le thème qui seront utilisés lors du rendu de la vue, vous
pouvez utiliser la méthode ``viewBuilder()`` pour récupérer un constructeur. Ce
constructeur peut être utilisé pour définir les propriétés de la vue avant sa
création::

    $this->viewBuilder()
        ->helpers(['MyCustom'])
        ->theme('Modern')
        ->className('Modern.Admin');

Le code ci-dessus montre comment charger des helpers personnalisés, définir un
thème et utiliser une classe de vue personnalisée.

Rendre une View
---------------

.. php:method:: render(string $view, string $layout)

La méthode ``Controller::render()`` est automatiquement appelée à
la fin de chaque action exécutée par le controller. Cette méthode exécute
toute la logique liée à la présentation (en utilisant les variables
transmises via la méthode ``Controller::set()``), place le contenu
de la vue à l'intérieur de son ``View::$layout`` et transmet le
tout à l'utilisateur final.

Le fichier de vue utilisé par défaut est déterminé par convention.
Ainsi, si l'action ``search()`` de notre controller RecipesController
est demandée, le fichier de vue situé dans **templates/Recipes/search.php**
sera utilisé::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Rend la vue située dans  templates/Recipes/search.php
            $this->render();
        }
    // ...
    }

Bien que CakePHP appelle cette fonction automatiquement à la
fin de chaque action (à moins que vous n'ayez défini ``$this->autoRender``
à ``false``), vous pouvez l'utiliser pour spécifier un fichier de vue
alternatif en précisant le nom d'un fichier de vue en premier argument de la
méthode ``Controller::render()``.

Si ``$view`` commence par un '/' on suppose que c'est un fichier de
vue ou un élément dont le chemin est relatif au dossier **templates**.
Cela permet un affichage direct des éléments, ce qui est très pratique lors
d'appels AJAX::

    // Rend un élément dans templates/element/ajaxreturn.php
    $this->render('/element/ajaxreturn');

Le second paramètre ``$layout`` de ``Controller::render()`` vous permet de spécifier
le layout de la vue qui est rendue.

Rendre un Template de Vue Spécifique
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Dans votre controller, vous pourriez avoir envie de rendre une vue
différente de celle rendue par défaut. Vous pouvez le faire en appelant
directement ``Controller::render()``. Une fois que vous avez appelé
``Controller::render()``, CakePHP n'essaiera pas de re-rendre la vue::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function myAction()
        {
            $this->render('custom_file');
        }
    }

Cela rendrait **templates/Posts/custom_file.php** au lieu de
**templates/Posts/my_action.php**.

Vous pouvez aussi rendre les vues des plugins en utilisant la syntaxe suivante:
``$this->render('PluginName.PluginController/custom_file')``.
Par exemple::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('Users.UserDetails/custom_file');
        }
    }

Cela rendrait la vue **plugins/Users/templates/UserDetails/custom_file.php**

.. _controller-viewclasses:

Négociation de Contenu
======================

Les controllers peuvent définir une liste des classes de vue qu'ils proposent.
Une fois l'action du controller terminée, CakePHP utilisera cette liste de vues
pour réaliser une négociation de contenu. Ainsi, votre application peut
réutiliser la même action de controller pour rendre une vue HTML, ou une réponse
JSON ou XML. La liste des classes de vue supportées par un controller est
définie par la méthode ``viewClasses()``::

    namespace App\Controller;

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    class PostsController extends AppController
    {
        public function viewClasses()
        {
            return [JsonView::class, XmlView::class];
        }
    }

Si aucune autre vue ne peut être sélectionnée d'après l'en-tête ``Accept`` des
requêtes ou l'extension de routage, la classe basique ``View`` sera
automatiquement utilisée comme classe de repli. Si votre application a besoin
d'effectuer une logique différente selon les différents formats de réponse, vous
pouvez utiliser ``$this->request->is()`` pour construire la logique
conditionnelle dont vous avez besoin.


.. note::
    Les classes de vue doivent implémenter la méthode statique ``contentType()``
    pour pouvoir participer à la négociation de contenu.


Rediriger vers d'Autres Pages
=============================

.. php:method:: redirect(string|array $url, integer $status)

La méthode ``redirect()`` ajoute un en-tête ``Location`` et définit le
code d'état de la réponse et la renvoie. Vous devez renvoyer la réponse créée par
``redirect()`` pour que CakePHP envoie la redirection au lieu de terminer l'action
du contrôleur et rendre la vue.

vous pouvez rediriger en utilisant les valeurs du :term:`tableau de routing`::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        $order->id,
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

Ou utiliser une URL relative ou absolue::

    return $this->redirect('/orders/confirm');

    return $this->redirect('http://www.example.com');

Ou rediriger vers l'URL appelante (referer)::

    return $this->redirect($this->referer());

En utilisant le deuxième paramètre, vous pouvez définir un code d'état pour votre redirection::

    // Effectue un 301 (moved permanently)
    return $this->redirect('/order/confirm', 301);

    // Effectue un 303 (see other)
    return $this->redirect('/order/confirm', 303);

Voir la section :ref:`redirect-component-events` pour savoir comment rediriger hors de
un gestionnaire de cycle de vie.

Rediriger vers une Autre Action du Même Controller
--------------------------------------------------

.. php:method:: setAction($action, $args...)

Si vous devez rediriger l'action courante vers une autre action du *même*
controller, vous pouvez utiliser ``Controller::setAction()`` pour mettre à jour l'objet
request, modifier le template de vue qui va être rendu et rediriger l'exécution
vers l'action nommée::

    // Depuis l'action delete, vous pouvez rendre
    // la liste mise à jour.
    $this->setAction('index');

Chargement des Modèles Supplémentaires
======================================

.. php:method:: fetchTable(string $alias, array $config = [])

La fonction ``fetchTable()`` devient pratique quand vous avez besoin d'utiliser
une table autre que la table par défaut du controller::

    // Dans une méthode de controller.
    $recentArticles = $this->fetchTable('Articles')->find('all', [
        'limit' => 5,
        'order' => 'Articles.created DESC'
    ]);

Paginer un Modèle
=================

.. php:method:: paginate()

Cette méthode est utilisée pour paginer les résultats retournés par vos
modèles. Vous pouvez définir les tailles de la page, les conditions à
utiliser pour la recherche de ces données et bien plus encore. Consultez la
section :doc:`pagination <controllers/components/pagination>`
pour plus de détails sur l'utilisation de la pagination.

L'attribut ``$paginate`` vous permet de de personnaliser le comportement de
``paginate()``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [
                'conditions' => ['published' => 1]
            ]
        ];
    }

Configurer les Components à Charger
===================================

.. php:method:: loadComponent($name, $config = [])

Dans la méthode ``initialize()`` de votre Controller, vous pouvez définir
tout component que vous voulez charger et toute donnée de configuration
pour eux::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Csrf');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. _controller-life-cycle:

Cycle de Vie des Callbacks de la Requête
========================================

Les controllers de CakePHP lancent plusieurs events/callbacks (méthodes de
rappel) que vous pouvez utiliser pour insérer de la logique durant tout le cycle
de vie de la requête:

Event List
----------

* ``Controller.initialize``
* ``Controller.startup``
* ``Controller.beforeRedirect``
* ``Controller.beforeRender``
* ``Controller.shutdown``

Callback des Controllers
------------------------

Par défaut, les méthodes de rappel (callbacks) suivantes sont connectées aux
events liés si les méthodes sont implémentées dans vos controllers.

.. php:method:: beforeFilter(EventInterface $event)

    Cette méthode est appelée pendant l'event ``Controller.initialize`` qui se
    produit avant chaque action du controller. C'est un endroit pratique pour
    vérifier le statut d'une session ou les permissions d'un utilisateur.

    .. note::

        La méthode beforeFilter() sera appelée pour les actions manquantes.

    Retourner une réponse à partir d'une méthode ``beforeFilter`` ne va pas
    empêcher l'appel des autres écouteurs du même event. Vous devez
    explicitement :ref:`stopper l'event <stopping-events>`.

.. php:method:: beforeRender(EventInterface $event)

    Cette méthode est appelée pendant l'event ``Controller.beforeRender`` qui
    se produit après l'action du controller mais avant que la vue ne soit
    rendue. Ce callback n'est pas souvent utilisé, mais peut-être nécessaire si
    vous appelez :php:meth:`~Cake\\Controller\\Controller::render()` manuellement
    à la fin d'une action donnée.

.. php:method:: afterFilter(EventInterface $event)

    Cette méthode est appelée pendant l'event ``Controller.shutdown`` qui se
    produit après chaque action du controller, et après que l'affichage soit
    terminé. C'est la dernière méthode du controller qui est exécutée.

En plus des callbacks des controllers, les :doc:`/controllers/components`
fournissent aussi un ensemble similaire de callbacks.

N'oubliez pas d'appeler les callbacks de ``AppController`` dans les callbacks
des controllers enfant pour avoir de meilleurs résultats::

    //use Cake\Event\EventInterface;
    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
    }

.. _controller-middleware:

Middleware de Controller
========================

.. php:method:: middleware($middleware, array $options = [])

Les :doc:`Middlewares </controllers/middleware>` peuvent être définis
globalement, dans le scope d'une routine ou dans un contrôleur. Pour définir un
middleware pour un contrôleur spécifique, utilisez la méthode ``middleware()``
depuis l'intérieur de la méthode ``initialize()`` de votre contrôleur::

    public function initialize(): void
    {
        parent::initialize();

        $this->middleware(function ($request, $handler) {
            // Faire la logique du middleware.

            // Assurez-vous de renvoyer une réponse ou d'appeler handle()
            return $handler->handle($request);
        });
    }

Les middlewares définis par un contrôleur seront appelés **avant** que
``beforeFilter()`` les méthodes d'action ne soient appelées.

Plus sur les Controllers
========================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=fr: Controllers (Contrôleurs)
    :keywords lang=fr: bons modèles,classe controller,controller controller,librairie du cœur,modèle unique,donnée requêtée,homme du milieu,boulangerie,mvc,attributs,logique,recettes
