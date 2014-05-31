Controllers (Contrôleurs)
#########################

Les controllers sont le 'C' dans MVC. Après que le routage a été effectué et que
le bon controller a été trouvé, l'action de votre controller est appelée. Votre
controller devra gérer l'interpretation des données requêtées, s'assurer que
les bons models sont appelés et que la bonne réponse ou vue est rendue. Les
controllers peuvent être imaginés comme un homme au milieu, entre le Model et la
Vue. Le mieux est de garder des controllers peu chargés, et des models plus
fournis. Cela vous aidera à réutiliser plus facilement votre code et facilitera
le test de votre code.

Habituellement, un controller est utilisé pour gérer la logique autour
d'un seul model. Par exemple, si vous construisez un site pour gérer une
boulangerie en ligne, vous aurez sans doute un RecipesController qui gère
vos recettes et un IngredientsController qui gére vos ingrédients. Cependant,
il est aussi possible d'avoir des controllers qui fonctionnent avec plus d'un
model. Dans CakePHP, un controller est nommé d'après le model principal qu'il
gère.

Les controllers de votre application sont des classes qui étendent la classe
CakePHP ``AppController``, qui hérite elle-même de la classe
:php:class:`Controller` du cœur. La classe ``AppController`` peut être définie
dans ``/App/Controller/AppController.php`` et elle devra contenir les
méthodes partagées par tous les controllers de votre application.

Les controllers peuvent inclure un certain nombre de méthodes qui gèrent les
requêtes. Celles-ci sont appelées des *actions*. Par défaut, chaque méthode
publique dans un controller est une action accessible via une URL. Une action
est responsable de l'interprétation des requêtes et de la création de
la réponse. Habituellement, les réponses sont sous forme de vue rendue, mais
il y a aussi d'autres façons de créer des réponses.

.. _app-controller:

Le Controller App
=================

Comme indiqué dans l'introduction, la classe ``AppController`` est la classe
mère de tous les controllers de votre application. ``AppController`` étend
elle-même la classe :php:class:`Controller` incluse dans la librairie du cœur
de CakePHP. ``AppController`` est définie dans
``/App/Controller/AppController.php`` comme ceci::

    class AppController extends Controller {
    }

Les attributs et méthodes de controller créés dans ``AppController`` seront
disponibles dans tous les controllers de votre application. Les Components (que
vous découvrirez plus loin) sont plus appropriés pour du code utilisé dans
la plupart des controllers (mais pas nécessairement tous).

Bien que les règles habituelles d'héritage de la programmation orientée objet
soient appliquées, CakePHP exécute également un travail supplémentaire si des
attributs spécifiques des controllers sont fournis, comme les
components ou helpers utilisés par un controller. Dans ces situations, les
valeurs des tableaux de ``AppController`` sont fusionnées avec les tableaux de
la classe controller enfant. Les valeurs dans la classe enfant vont toujours
surcharger celles dans ``AppController``.

.. note::

    CakePHP fusionne les variables suivantes de la classe ``AppController`` avec
    celles des controllers de votre application:

    -  :php:attr:`~Controller::$components`
    -  :php:attr:`~Controller::$helpers`
    -  :php:attr:`~Controller::$uses`

N'oubliez pas d'ajouter les helpers Html et Form si vous avez défini la
propriété :php:attr:`~Controller::$helpers` dans votre classe ``AppController``.

Pensez aussi à appeler les fonctions de rappel (callbacks) de AppController dans
celles du controller enfant pour de meilleurs résultats::

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);
    }

Les paramètres de requête
=========================

Quand une requête est faîte dans une application CakePHP, Les classes
:php:class:`Router` et :php:class:`Dispatcher` de CakePHP utilisent la
:ref:`routes-configuration` pour trouver et créer le bon controller. La
requête de données est encapsulée dans un objet request.
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
``/app/Controller/RecipesController.php`` et contiendrait::

        # /App/Controller/RecipesController.php
        
        class RecipesController extends AppController {
            public function view($id) {
                //la logique de l'action va ici..
            }
        
            public function share($customerId, $recipeId) {
                //la logique de l'action va ici..
            }
        
            public function search($query) {
                //la logique de l'action va ici..
            }
        }

Les fichiers de vue pour ces actions seraient ``app/Template/Recipes/view.ctp``,
``app/Template/Recipes/share.ctp``, et ``app/Template/Recipes/search.ctp``. Le
nom du fichier de vue est par convention le nom de l'action en minuscules et
avec des underscores.

Les actions du Controller utilisent généralement :php:meth:`~Controller::set()`
pour créer un contexte que :php:class:`View` utilise pour rendre la vue. Du
fait des conventions que CakePHP utilise, vous n'avez pas à créer et rendre
la vue manuellement. Au lieu de ça, une fois qu'une action du controller est
terminée, CakePHP va gérer le rendu et la livraison de la Vue.

Si pour certaines raisons, vous voulez éviter le comportement par défaut, les
deux techniques suivantes ne vont pas appliquer le comportement de rendu par
défaut de la vue.

* Si vous retournez une chaîne de caractères, ou un objet qui peut être
  converti en une chaîne de caractères à partir d'une action du controller,
  elle sera utilisée comme contenu de réponse.
* Vous pouvez retourner un objet :php:class:`CakeResponse` avec la réponse
  complètement créée.

Quand vous utilisez les méthodes du controller avec
:php:meth:`~Cake\\Routing\\RequestActionTrait::requestAction()`, vous voudrez
souvent retourner les données qui ne sont pas des chaînes de caractère. Si vous
avez des méthodes du controller qui sont utilisées pour des requêtes web
normales + requestAction, vous devrez vérifier le type de requête avant de
retourner::

    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipes->find('popular');
            if (!$this->request->is('requested')) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

Le controller ci-dessus est un exemple montrant comment la méthode peut être
utilisée avec :php:meth:`~Controller::requestAction()` et des requêtes normales.
Retourner un tableau de données à une requête non-requestAction va entraîner
des erreurs et devra être évité. Consultez la section sur
:php:meth:`Cake\\Controller\\Controller::requestAction()` pour plus d'astuces
sur l'utilisation de :php:meth:`~Controller::requestAction()`.

Afin que vous utilisiez efficacement le controller dans votre propre
application, nous couvrons certains des attributs et méthodes du coeur fournis
par les controllers de CakePHP.

.. _controller-life-cycle:

Request Life-cycle callbacks
============================

.. php:class:: Controller

Les controllers de CakePHP sont livrés par défaut avec des méthodes de rappel
(ou callback) que vous pouvez utiliser pour insérer de la logique juste avant
ou juste après que les actions du controller ont été effectuées :

.. php:method:: beforeFilter(Event $event)

    Cette fonction est exécutée avant chaque action du controller. C'est
    un endroit pratique pour vérifier le statut d'une session ou les
    permissions d'un utilisateur.

    .. note::

        La méthode beforeFilter() sera appelée pour les actions manquantes.

.. php:method:: beforeRender(Event $event)

    Cette méthode est appelée après l'action du controller mais avant
    que la vue ne soit rendue. Ce callback n'est pas souvent utilisé,
    mais peut-être nécessaire si vous appellez :php:meth:`~Controller::render()`
    manuellement à la fin d'une action donnée.

.. php:method:: afterFilter(Event $event)

    Cette méthode est appelée après chaque action du controller, et après
    que l'affichage soit terminé. C'est la dernière méthode du controller
    qui est exécutée.

En plus des callbacks des controllers, les :doc:`/controllers/components`
fournissent aussi un ensemble similaire de callbacks.

.. _controller-methods:

Les méthodes du Controller
==========================

Pour une liste complète des méthodes de controller avec leurs descriptions,
consultez
`l'API de CakePHP <http://api.cakephp.org/3.0/class-Cake.Controller.Controller.html>`_.

Interactions avec les vues
--------------------------

Les Controllers interagissent avec les vues de plusieurs façons.
Premièrement, ils sont capables de passer des données aux vues, en utilisant
:php:meth:`~Controller::set()`. Vous pouvez aussi décider quelle classe de vue
utiliser, et quel fichier de vue doit être rendu à partir du controller.

.. php:method:: set(string $var, mixed $value)

    La méthode :php:meth:`~Controller::set()` est la voie principale utilisée
    pour transmettre des données de votre controller à votre vue. Une fois
    :php:meth:`~Controller::set()` utilisée, la variable de votre controller
    devient accessible par la vue::

        // Dans un premier temps vous passez les données depuis le controller:

        $this->set('couleur', 'rose');

        // Ensuite vous pouvez les utiliser dans la vue de cette manière:
        ?>

        Vous avez sélectionné un glaçage <?= $couleur; ?> pour le gâteau.

    La méthode :php:meth:`~Controller::set()` peut également prendre un tableau
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


    L'attribut ``$pageTitle`` n'existe plus. Utilisez
    :php:meth:`~Controller::set()` pour définir le titre::

        $this->set('title_for_layout', 'Ceci est la page titre');


.. php:method:: render(string $view, string $layout)

    La méthode :php:meth:`~Controller::render()` est automatiquement appelée à
    la fin de chaque action exécutée par le controller. Cette méthode exécute
    toute la logique liée à la présentation (en utilisant les variables
    transmises via la méthode :php:meth:`~Controller::set()`), place le contenu
    de la vue à l'intérieur de son :php:attr:`~View::$layout` et transmet le
    tout à l'utilisateur final.

    Le fichier de vue utilisé par défaut est déterminé par convention.
    Ainsi, si l'action ``search()`` de notre controller RecipesController
    est demandée, le fichier de vue situé dans /App/Template/Recipes/search.ctp
    sera utilisé::

        class RecipesController extends AppController {
        // ...
            public function search() {
                // Rend la vue dans /Template/Recipes/search.ctp
                $this->render();
            }
        // ...
        }

    Bien que CakePHP appelle cette fonction automatiquement à la
    fin de chaque action (à moins que vous n'ayez défini ``$this->autoRender``
    à false), vous pouvez l'utiliser pour spécifier un fichier de vue
    alternatif en précisant le nom d'une action dans le controller, via
    le paramètre ``$action``.

    Si ``$view`` commence avec un '/' on suppose que c'est un fichier de
    vue ou un élément dont le chemin est relatif au dossier ``/app/Template``.
    Cela permet un affichage direct des éléments, ce qui est très pratique lors
    d'appels AJAX.
    ::

        // Rend un élément dans /Template/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

    Le paramètre :php:attr:`~View::$layout` vous permet de spécifier le layout
    de la vue qui est rendue.

Rendre une vue spécifique
~~~~~~~~~~~~~~~~~~~~~~~~~

Dans votre controller, vous pourriez avoir envie de rendre une vue
différente de celle rendue par défaut. Vous pouvez le faire en appelant
directement :php:meth:`~Controller::render()`. Une fois que vous avez appelé
:php:meth:`~Controller::render()` CakePHP n'essaiera pas de re-rendre la vue::

    class PostsController extends AppController {
        public function mon_action() {
            $this->render('fichier_personnalise');
        }
    }

Cela rendrait ``app/Template/Posts/fichier_personnalise.ctp`` au lieu de
``app/Template/Posts/mon_action.ctp``.

Vous pouvez aussi rendre les vues des plugins en utilisant la syntaxe suivante:
``$this->render('PluginName.PluginController/custom_file')``.
Par exemple::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('Users.UserDetails/custom_file');
        }
    }
    
Cela rendrait la vue ``app/Plugin/Users/Template/UserDetails/custom_file.ctp`` 

Contrôle de Flux
----------------

.. php:method:: redirect(string|array $url, integer $status)

    La méthode de contrôle de flux que vous utiliserez le plus souvent est
    :php:meth:`~Controller::redirect()`. Cette méthode prend son premier
    paramètre sous la forme d'une URL relative à votre application CakePHP.
    Quand un utilisateur a réalisé un paiement avec succès, vous aimeriez le
    rediriger vers un écran affichant le reçu.::

        public function regler_achats() {
            // Placez ici la logique pour finaliser l'achat...
            if ($success) {
                return $this->redirect(
                    ['controller' => 'paiements', 'action' => 'remerciements']
                );
            } else {
                return $this->redirect(
                    ['controller' => 'paiements', 'action' => 'confirmations']
                );
            }
        }

    Vous pouvez aussi utiliser une URL relative ou absolue avec $url::

        return $this->redirect('/paiements/remerciements');
        return $this->redirect('http://www.exemple.com');

    Vous pouvez aussi passer des données à l'action::

        return $this->redirect(['action' => 'editer', $id]);

    Le second paramètre de la fonction :php:meth:`~Controller::redirect()`
    vous permet de définir un code de statut HTTP accompagnant la redirection.
    Vous aurez peut-être besoin d'utiliser le code 301 (document
    déplacé de façon permanente) ou 303 (voir ailleurs), en fonction
    de la nature de la redirection.

    Si vous avez besoin de rediriger à la page appelante, vous pouvez
    utiliser::

        return $this->redirect($this->referer());

    Cette méthode accepte aussi les paramètres nommés de base. Si vous
    souhaitez être redirigé sur une URL comme:
    ``http://www.example.com/commandes/confirmation/produit:pizza/quantite:5``
    vous pouvez utiliser::

        return $this->redirect([
            'controller' => 'commandes',
            'action' => 'confirmation',
            'produit' => 'pizza',
            'quantite' => 5
        ]);

    Un exemple d'utilisation des requêtes en chaînes et hashés ressemblerait
    à ceci::

        return $this->redirect([
            'controller' => 'commandes',
            'action' => 'confirmation',
            '?' => [
                'produit' => 'pizza',
                'quantite' => 5
            ],
            '#' => 'top'
        ]);

    L'URL généré serait:
        ``http://www.example.com/commandes/confirmation?produit=pizza&quantite=5#top``

Autres Méthodes utiles
----------------------

.. php:method:: constructClasses

    Cette méthode charge en mémoire les models nécessaires au controller.
    Cette procédure de chargement est normalement effectuée par CakePHP,
    mais cette méthode est à garder sous le coude quand vous avez besoin
    d'accéder à certains controllers dans une autre perspective. Si
    vous avez besoin de CakePHP dans un script utilisable en ligne de
    commande ou d'autres utilisations externes,
    :php:meth:`~Controller::constructClasses()` peut devenir pratique.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Retourne l'URL référente de la requête courante. Le paramètre
    ``$default`` peut être utilisé pour fournir une URL par défaut à
    utiliser si HTTP\_REFERER ne peut pas être lu par les headers. Donc,
    au lieu de faire ceci::

        class UserController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                if ($this->referer() != '/') {
                    return $this->redirect($this->referer());
                }
                return $this->redirect(['action' => 'index']);
            }
        }

    vous pouvez faire ceci::

        class UserController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                return $this->redirect(
                    $this->referer(['action' => 'index'])
                );
            }
        }

    Si ``$default`` n'est pas définie, la fonction se met par défaut 
    à la racine (root) de votre domaine - '/'.

    Le paramètre ``$local``, si il est défini à ``true``, restreint les URLs se
    référant au serveur local.

.. php:method:: disableCache

    Utilisée pour indiquer au **navigateur** de l'utilisateur de ne pas
    mettre en cache le résultat de la requête courante. Ceci est différent
    du système de cache de vue couvert dans le chapitre suivant.

    Les en-têtes HTTP envoyés à cet effet sont::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: paginate()

    Cette méthode est utilisée pour paginer les résultats retournés par vos
    models. Vous pouvez définir les tailles de la page, les conditions à
    utiliser pour la recherche de ces données et bien plus encore. Consultez la
    section :doc:`pagination <core-libraries/components/pagination>`
    pour plus de détails sur l'utilisation de la pagination.

.. php:method:: requestAction(string $url, array $options)

    Regardez la documentation pour
    :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` pour plus
    d'informations sur cette méthode.

.. php:method:: loadModel(string $modelClass, string $type)

    La fonction ``loadModel`` devient pratique quand
    vous avez besoin d'utiliser un model qui n'est pas le model du controller
    par défaut ou un de ses models associés::
    
        $this->loadModel('Articles');
        $recentArticles = $this->Articles->find('all', [
            'limit' => 5,
            'order' => 'Articles.created DESC'
        ]);

    Si vous utilisez un provider de table différent de l'ORM intégré, vous
    pouvez lier ce système de table dans les controllers de CakePHP en
    connectant sa méthode factory::

        $this->modelFactory(
            'ElasticIndex',
            ['ElasticIndexes', 'factory']
        );

    Après avoir enregistré la table factory, vous pouvez utiliser ``loadModel``
    pour charger les instances::

        $this->loadModel('Locations', 'ElasticIndex');

    .. note::

        La TableRegistry intégrée dans l'ORM est connectée par défaut comme
        provider de 'Table'.


Les attributs du Controller
===========================

Pour une liste complète des attributs du controller et ses descriptions,
consultez `l'API de CakePHP <http://api.cakephp.org/3.0/class-Cake.Controller.Controller.html>`_.

.. php:attr:: name

    L'attribut :php:attr:`~Controller::$name` doit être défini selon le nom du
    controller. Habituellement, c'est juste la forme plurielle du model
    principal que le controller utilise. Cette propriété n'est pas requise,
    mais évite à CakePHP d'inflecter dessus::

        // Exemple d'utilisation d'attribut $name du controller
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }


$components, $helpers
---------------------

Les autres attributs les plus souvent utilisés permettent d'indiquer à
CakePHP quels :php:attr:`~Controller::$helpers`,
:php:attr:`~Controller::$components` et models vous utiliserez avec le
controller courant. Utiliser ces attributs rend ces classes MVC, fournies
par :php:attr:`~Controller::$components` et :php:attr:`~Controller::$uses`,
disponibles pour le controller, sous la forme de variables de classe
(``$this->ModelName``, par exemple) et celles fournies par
:php:attr:`~Controller::$helpers`, disponibles pour la vue comme une variable
référence à l'objet (``$this->{$helpername}``).

.. note::

    Chaque controller a déjà accès, par défaut, à certaines de ces classes,
    donc vous n'avez pas besoin de les redéfinir.

.. php:attr:: helpers

    Les Helpers :php:class:`HtmlHelper`, :php:class:`FormHelper` et
    :php:class:`SessionHelper` sont toujours accessibles par défaut, tout
    comme le :php:class:`SessionComponent`. Mais si vous choisissez de définir
    votre propre tableau :php:attr:`~Controller::$helpers` dans AppController,
    assurez-vous d'y inclure :php:class:`HtmlHelper` et :php:class:`FormHelper`
    si vous voulez qu'ils soient toujours disponibles par défaut dans vos
    propres controllers. Pour en savoir plus au sujet de ces classes,
    consultez leurs sections respectives plus loin dans le manuel.

    Jetons maintenant un œil sur la façon d'indiquer à un
    :php:class:`Controller` CakePHP que vous avez dans l'idée d'utiliser
    d'autres classes MVC::

        class RecipesController extends AppController {
            public $helpers = ['Js'];
            public $components = ['RequestHandler'];
        }

    Toutes ces variables sont fusionnées avec leurs valeurs héritées,
    par conséquent ce n'est pas nécessaire de re-déclarer (par exemple) le
    helper :php:class:`FormHelper` ou tout autre déclaré dans votre
    ``AppController``.

.. php:attr:: components

    Le tableau de components vous permet de définir quel
    :doc:`/controllers/components` un controller va utiliser. Comme les
    :php:attr:`~Controller::$helpers` et :php:attr:`~Controller::$uses`, les
    components dans vos controllers sont fusionnés avec ceux dans
    ``AppController``. Comme pour les :php:attr:`~Controller::$helpers`,
    vous pouvez passer les paramètres dans les components. Consultez
    :ref:`configuring-components` pour plus d'informations.

Autres Attributs
----------------

Tandis que vous pouvez vérifier les détails pour tous les attributs des
controllers dans l'`API <http://api.cakephp.org>`_, il y a d'autres attributs
du controller qui méritent leurs propres sections dans le manuel.

.. php:attr: cacheAction

    L'attribut cacheAction est utilisé pour définir la durée et d'autres
    informations sur la mise en cache d'une page complète. Vous pouvez lire
    plus d'informations sur la mise en cache d'une page complète dans la
    documentation :php:class:`CacheHelper`.

.. php:attr: paginate

    L'attribut paginate est une propriété avec une compatibilité dépréciée.
    L'utiliser charge et configure le :php:class:`PaginatorComponent`. Il est
    recommandé que vous mettiez à jour votre code en utilisant les paramètres
    normaux du component::

        class ArticlesController extends AppController {
            public $components = [
                'Paginator' => [
                    'Article' => [
                        'conditions' => ['published' => 1]
                    ]
                ]
            ];
        }

.. todo::

    Ce chapitre devrait être moins sur l'API de controller et plus sur les
    exemples, la section des attributs du controller est trop chargée et
    difficile à comprendre au premier abord. Le chapitre devrait commencer avec
    quelques exemples de controllers et ce qu'ils font.

En savoir plus sur les controllers
==================================

.. toctree::
    :maxdepth: 1

    controllers/request-response
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=fr: Controllers (Contrôleurs)
    :keywords lang=fr: bons modèles,classe controller,controller controller,librairie du coeur,modèle unique,donnée requêtée,homme du milieu,boulangerie,mvc,attributs,logique,recettes
