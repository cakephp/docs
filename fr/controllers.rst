Controllers (Contrôleurs)
#########################

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Les Controllers sont le 'C' dans MVC. Après que le routage a été appliqué et
que le bon controller a été trouvé, l'action de votre controller est appelée.
Votre controller devra gérer l'interprétation des données requêtées, s'assurer
que les bons models sont appelés et que la bonne réponse ou vue est rendue. Les
controllers peuvent être imaginés comme une couche au milieu entre le Model et
la Vue. Le mieux est de garder des controllers peu chargés, et des models plus
fournis. Cela vous aidera à réutiliser votre code et facilitera le test de votre
code.

Habituellement, les controllers sont utilisés pour gérer la logique autour d'un
seul model. Par exemple, si vous construisez un site pour gérer une boulangerie
en-ligne, vous aurez sans doute un RecettesController qui gère vos recettes et
un IngredientsController qui gère vos ingrédients. Cependant, il est aussi
possible d'avoir des controllers qui fonctionnent avec plus d'un model. Dans
CakePHP, un controller est nommé d'après le model principal qu'il gère.

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

        public function initialize()
        {
            // Active toujours le component CSRF.
            $this->loadComponent('Csrf');
        }

    }

En plus de la méthode ``initialize()``, l'ancienne propriété ``$components``
vous permettra aussi de déclarer les components qui doivent être chargés. Bien
que les règles d'héritage en orienté objet s'appliquent, les components et
les helpers utilisés par un controller sont traités spécialement. Dans ces
cas, les valeurs de la propriété de ``AppController`` sont fusionnées avec les
tableaux de la classe de controller enfant. Les valeurs dans la classe enfant
seront toujours surchargées par celles de ``AppController``.

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
**src/Template/Recipes/view.ctp**, **src/Template/Recipes/share.ctp**, et
**src/Template/Recipes/search.ctp**. Le nom du fichier de vue est par convention
le nom de l'action en minuscules et avec des underscores.

Les actions du Controller utilisent généralement ``Controller::set()`` pour
créer un contexte que ``View`` utilise pour afficher la couche de vue. Du fait
des conventions que CakePHP utilise, vous n'avez pas à créer et rendre la vue
manuellement. Au lieu de ça, une fois qu'une action du controller est terminée,
CakePHP va gérer le rendu et la livraison de la Vue.

Si pour certaines raisons, vous voulez éviter le comportement par défaut, vous
pouvez retourner un objet de :php:class:`Cake\\Network\\Response` de l'action
avec la response complètement créée.

Afin que vous utilisiez efficacement le controller dans votre propre
application, nous couvrons certains des attributs et méthodes du cœur fournis
par les controllers de CakePHP.

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

.. versionadded:: 3.1
    ViewBuilder a été ajouté dans 3.1

Rendre une View
---------------

.. php:method:: render(string $view, string $layout)

La méthode ``Controller::render()`` est automatiquement appelée à
la fin de chaque action exécutée par le controller. Cette méthode exécute
toute la logique liée à la présentation (en utilisant les variables
transmises via la méthode ``Controller::set()``, place le contenu
de la vue à l'intérieur de son ``View::$layout`` et transmet le
tout à l'utilisateur final.

Le fichier de vue utilisé par défaut est déterminé par convention.
Ainsi, si l'action ``search()`` de notre controller RecipesController
est demandée, le fichier de vue situé dans **src/Template/Recipes/search.ctp**
sera utilisé::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Render the view in src/Template/Recipes/search.ctp
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
vue ou un élément dont le chemin est relatif au dossier **src/Template**.
Cela permet un affichage direct des éléments, ce qui est très pratique lors
d'appels AJAX::

    // Rend un élément dans src/Template/Element/ajaxreturn.ctp
    $this->render('/Element/ajaxreturn');

Le paramètre ``$layout`` de ``Controller::render()`` vous permet de spécifier
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
        public function my_action()
        {
            $this->render('custom_file');
        }
    }

Cela rendrait **src/Template/Posts/custom_file.ctp** au lieu de
**src/Template/Posts/my_action.ctp**.

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

Cela rendrait la vue **plugins/Users/src/Template/UserDetails/custom_file.ctp**

Rediriger vers d'Autres Pages
=============================

.. php:method:: redirect(string|array $url, integer $status)

La méthode de contrôle de flux que vous utiliserez le plus souvent est
``Controller::redirect()``. Cette méthode prend son premier
paramètre sous la forme d'une URL relative à votre application CakePHP.
Quand un utilisateur a réalisé un paiement avec succès, vous aimeriez le
rediriger vers un écran affichant le reçu::

    public function place_order()
    {
        // Logique pour finaliser la commande
        if ($success) {
            return $this->redirect(
                ['controller' => 'Orders', 'action' => 'thanks']
            );
        }
        return $this->redirect(
            ['controller' => 'Orders', 'action' => 'confirm']
        );
    }

La méthode va retourner l'instance de réponse avec les bons headers définis.
Vous devrez retourner l'instance de réponse à partir de votre action pour éviter
les rendus de view et laisser le dispatcher gérer la bonne redirection.

Vous pouvez aussi utiliser une URL relative ou absolue avec $url::

    return $this->redirect('/orders/thanks');
    return $this->redirect('http://www.example.com');

Vous pouvez aussi passer des données à l'action::

    return $this->redirect(['action' => 'edit', $id]);

Le second paramètre de la fonction ``Controller::redirect()``
vous permet de définir un code de statut HTTP accompagnant la redirection.
Vous aurez peut-être besoin d'utiliser le code 301 (document
déplacé de façon permanente) ou 303 (voir ailleurs), en fonction
de la nature de la redirection.

Si vous avez besoin de rediriger à la page appelante, vous pouvez
utiliser::

    return $this->redirect($this->referer());

Un exemple d'utilisation des requêtes en chaînes et hashés ressemblerait
à ceci::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

L'URL générée serait::

    http://www.example.com/orders/confirm?product=pizza&quantity=5#top

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

Chargement des Models Supplémentaires
=====================================

.. php:method:: loadModel(string $modelClass, string $type)

La fonction ``loadModel()`` devient pratique quand
vous avez besoin d'utiliser une table de model/collection qui n'est pas le
model du controller par défaut ou un de ses models associés::

    // Dans une méthode de controller.
    $this->loadModel('Articles');
    $recentArticles = $this->Articles->find('all', [
        'limit' => 5,
        'order' => 'Articles.created DESC'
    ]);

Si vous utilisez un provider de table différent de l'ORM intégré, vous
pouvez lier ce système de table dans les controllers de CakePHP en
connectant sa méthode factory::

    // Dans une méthode de controller.
    $this->modelFactory(
        'ElasticIndex',
        ['ElasticIndexes', 'factory']
    );

Après avoir enregistré la table factory, vous pouvez utiliser ``loadModel()``
pour charger les instances::

    // Dans une méthode de controller.
    $this->loadModel('Locations', 'ElasticIndex');

.. note::

    La TableRegistry intégrée dans l'ORM est connectée par défaut comme
    provider de 'Table'.

Paginer un Model
================

.. php:method:: paginate()

Cette méthode est utilisée pour paginer les résultats retournés par vos
models. Vous pouvez définir les tailles de la page, les conditions à
utiliser pour la recherche de ces données et bien plus encore. Consultez la
section :doc:`pagination <controllers/components/pagination>`
pour plus de détails sur l'utilisation de la pagination.

L'attribut paginate vous donne une façon facile de personnaliser la façon dont
``paginate()`` se comporte::

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

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. php:attr:: components

La propriété ``$components`` de vos controllers vous permet de configurer les
components. Les components configurés et leurs dépendances vont être créés par
CakePHP pour vous. Lisez la section :ref:`configuring-components` pour plus
d'informations. Comme mentionné plus tôt, la propriété ``$components`` sera
fusionnée avec la propriété définie dans chacune des classes parentes de votre
controller.

Configurer les Helpers à Charger
================================

.. php:attr:: helpers

Voyons comment dire à un controller de CakePHP que vous avez prévu d'utiliser
les classes MVC supplémentaires::

    class RecipesController extends AppController
    {
        public $helpers = ['Form'];
    }

Chacune de ces variables sont fusionnées avec leurs valeurs héritées,
ainsi il n'est pas nécessaire (par exemple) de redéclarer ``FormHelper``, ou
bien tout ce qui est déclaré dans votre ``AppController``.

.. deprecated:: 3.0
    Le chargement des helpers depuis le controller est fourni pour des raisons
    de rétrocompatibilité. Référez-vous à la section suivante pour apprendre à
    :ref:`configuring-helpers`.

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

.. php:method:: beforeFilter(Event $event)

    Cette méthode est appelée pendant l'event ``Controller.initialize`` qui se
    produit avant chaque action du controller. C'est un endroit pratique pour
    vérifier le statut d'une session ou les permissions d'un utilisateur.

    .. note::

        La méthode beforeFilter() sera appelée pour les actions manquantes.

    Retourner une réponse à partir d'une méthode ``beforeFilter`` ne va pas
    empêcher l'appel des autres écouteurs du même event. Vous devez
    explicitement :ref:`stopper l'event <stopping-events>`.

.. php:method:: beforeRender(Event $event)

    Cette méthode est appelée pendant l'event ``Controller.beforeRender`` qui
    se produit après l'action du controller mais avant que la vue ne soit
    rendue. Ce callback n'est pas souvent utilisé, mais peut-être nécessaire si
    vous appelez :php:meth:`~Controller::render()` manuellement à la fin d'une
    action donnée.

.. php:method:: afterFilter(Event $event)

    Cette méthode est appelée pendant l'event ``Controller.shutdown`` qui se
    produit après chaque action du controller, et après que l'affichage est
    terminé. C'est la dernière méthode du controller qui est exécutée.

En plus des callbacks des controllers, les :doc:`/controllers/components`
fournissent aussi un ensemble similaire de callbacks.

N'oubliez pas d'appeler les callbacks de ``AppController`` dans les callbacks
des controllers enfant pour avoir de meilleurs résultats::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
    }

Plus sur les Controllers
========================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=fr: Controllers (Contrôleurs)
    :keywords lang=fr: bons modèles,classe controller,controller controller,librairie du cœur,modèle unique,donnée requêtée,homme du milieu,boulangerie,mvc,attributs,logique,recettes
