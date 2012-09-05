Contrôleurs (Controllers)
#########################

Les Contrôleurs sont le 'C' dans MVC. Après que le routage a été appliqué et 
que le bon contrôleur a été trouvé, l'action de votre contrôleur est 
appelé. Votre contrôleur devra gérer l'interpretation des données requetées, 
s'assurer que les bon modèles sont appelés, et que la bonne réponse ou vue est 
rendue. Les contrôleurs peuvent être imaginés come un homme au milieu entre 
le Modèle et la Vue. Le mieux est de garder des contrôleurs peu chargés, et 
des modèles plus fournis. Cela vous aidera à réutiliser plus facilement votre 
code et facilitera le test de votre code.

Habituellement, les contrôleurs sont utilisés pour gérer la logique autour 
d'un seul modèle. Par exemple, si vous construisez un site pour gérer une 
boulangerie en-ligne, vous aurez sans doute un RecettesController et un 
IngredientsController qui gérent les recettes et leurs ingrédients. Dans 
CakePHP, les contrôleurs sont nommés d'après le modèle principal qu'ils 
gèrent. Il est aussi totalement possible d'avoir des contrôleurs qui 
travaillent avec plus d'un modèle. 

Les contrôleurs de votre application sont des classes qui étendent la classe 
CakePHP ``AppController``, qui hérite elle-même de la classe 
:php:class:`Controller` du cœur. La classe AppController peut être définie 
dans ``/app/Controller/AppController.php`` et elle devrait contenir les 
méthodes partagées par tous les contrôleurs de votre application. 

Les contrôleurs peuvent inclure un certain nombre de méthodes qui sont 
généralement appelées *actions*. Les actions sont les méthodes d'un contrôleur 
qui gère les requêtes. Par défaut, toutes les méthodes publiques d'un 
contrôleur sont des actions accessibles d'une url. Les actions sont 
responsables de l'interpretation des requêtes et de la création de 
la réponse. Habituellement, les réponses sont sous forme de vue rendue, mais 
il y a d'autres façons de créer des réponses aussi.

.. _app-controller:

Le Contrôleur App
=================

Comme indiqué dans l'introduction, la classe AppController est la classe 
mère de tous les contrôleurs de votre application. AppController étend 
elle-même la classe Controller incluse dans la librairie du cœur de CakePHP. 
Ainsi, AppController est définie dans ``/app/Controller/AppController.php`` 
comme ceci::

    <?php
    class AppController extends Controller {
    }
    

Les attributs et méthodes de contrôleur créés dans AppController seront 
disponibles dans tous les contrôleurs de votre application. C'est l'endroit 
idéal pour créer du code commun à tous vos contrôleurs. Les Composants (que 
vous découvrirez plus loin) sont mieux appropriés pour du code utilisé dans 
la plupart (mais pas nécessairement tous) des contrôleurs.

Bien que les règles habituelles d'héritage de la programmation orientée objet 
soient appliquées, CakePHP exécute également un travail supplémentaire si des 
attributs spécifiques des contrôleurs sont fournis, comme la liste des 
composants ou assistants utilisés par un contrôleur. Dans ces situations, les 
valeurs des tableaux de AppController sont fusionnées avec les tableaux de 
la classe contrôleur enfant.

.. note::

    CakePHP fusionne les variables suivantes de la classe AppController avec 
    celles des contrôleurs de votre application:

    -  $components
    -  $helpers
    -  $uses

N'oubliez pas d'ajouter les assistants Html et Form si vous avez défini var 
``$helpers`` dans la classe AppController.

Pensez à appeler les fonctions de retour (callbacks) de AppController dans 
celles du contrôleur enfant pour de meilleurs résultats::

    <?php
    public function beforeFilter() {
        parent::beforeFilter();
    }
 
Les paramètres de requête
=========================

Quand une requête est faite dans une application CakePHP, Les classes 
:php:class:`Router` et :php:class:`Dispatcher` de CakePHP utilisent 
:ref:`routes-configuration` pour trouver et créer le bon contrôleur. La 
requête de données est encapsulée dans un objet request.
CakePHP met toutes les informations importantes de la requête dans la 
propriété ``$this->request``. Regardez la section :ref:`cake-request` 
pour plus d'informations sur l'objet request de CakePHP.

Les actions du Contrôleur
=========================

Les actions du Contrôleur sont responsables de la conversion des paramètres de 
la requête dans une réponse pour le navigateur/utilisateur faisant la requête.
CakePHP utilise les conventions pour automatiser le processus et retirer 
quelques codes boiler-plate que vous auriez besoin d'écrire autrement.

Par convention, CakePHP rend une vue avec une version inflectée du nom de 
l'action. Revenons à notre boulangerie en-ligne par exemple, notre 
RecipesController pourrait contenir les actions 
``view()``, ``share()``, et ``search()``. Le contrôleur serait trouvé dans 
``/app/Controller/RecettesController.php`` et contiendrait::

        <?php
        # /app/Controller/RecettesController.php
        
        class RecettesController extends AppController {
            public function view($id) {
                //la logique de l'action logic va ici..
            }
        
            public function share($client_id, $recette_id) {
                //la logique de l'action logic va ici..
            }
        
            public function search($query) {
                //la logique de l'action logic va ici..
            }
        }

Les fichiers de vue pour ces actions seraient ``app/View/Recettes/view.ctp``,
``app/View/Recettes/share.ctp``, et ``app/View/Recettes/search.ctp``.  Le nom 
du fichier de vue est par convention le nom de l'action en minuscules et avec 
des underscores 

Controller actions generally use :php:meth:`~Controller::set()` to create a
context that :php:class:`View` uses to render the view.  Because of the
conventions that CakePHP uses, you don' need to create and render the view
manually. Instead once a controller action has completed, CakePHP will handle
rendering and delivering the View.

If for some reason you'd like to skip the default behavior.  Both of the
following techniques will by-pass the default view rendering behavior.

* If you return a string, or an object that can be converted to a string from 
  your controller action, it will be used as the response body.
* You can return a :php:class:`CakeResponse` object with the completely created
  response.

When controller methods are used with :php:meth:`~Controller::requestAction()`
you will often want to return data that isn't a string.  If you have controller
methods that are used for normal web requests + requestAction you should check
the request type before returning::

    <?php
    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipe->popular();
            if (!empty($this->request->params['requested'])) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

The above controller action is an example of how a method can be used with
``requestAction()`` and normal requests. Returning an array data to a
non-requestAction request will cause errors and should be avoided.  See the
section on :php:meth:`Controller::requestAction()` for more tips on using
``requestAction()``

In order for you to use a controller effectively in your own application, we'll
cover some of the core attributes and methods provided by CakePHP's controllers.

.. _controller-life-cycle:

Request Life-cycle callbacks
============================

.. php:class:: Controller

Les contrôleurs de CakePHP sont livrés par défaut avec des méthodes de rappel 
(ou callback) qui vous pouvez utiliser pour insérer de la logique juste avant 
ou juste après que les actions du contrôleur soient effectuées:

.. php:method:: beforeFilter()

    Cette fonction est exécutée avant chaque action du contrôleur. C'est 
    un endroit pratique pour vérifier le statut d'une session ou les 
    permissions d'un utilisateur.

    .. note::

        La méthode beforeFilter() sera appelée pour les actions manquantes et 
        les actions de scaffolding.

.. php:method:: beforeRender()

    Cette méthode est appelée après l'action du contrôleur mais avant 
    que la vue ne soit rendue. Ce callback n'est pas souvent utilisé, 
    mais peut-être nécessaire si vous appellez render() manuellement à 
    la fin d'une action donnée.

.. php:method:: afterFilter()

    Cette méthode est appelée après chaque action du contrôleur, et après 
    que l'affichage soit terminé. C'est la dernière méthode du contrôleur 
    qui est exécutée.

En plus des callbacks, :doc:`/controllers/components` fournit aussi un ensemble 
similaire de callbacks.

.. _controller-methods:

Les Méthodes du Contrôleur
==========================

Pour une liste complète des méthodes de contrôleur avec leurs descriptions, 
consultez l'API CakePHP 
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

Interactions avec les vues
--------------------------

Les Contrôleurs interagissent avec la vue d'un certain nombre de façons. 
Premièrement, ils sont capables de passer des données aux vues, en utilisant 
``set()``. Vous pouvez aussi décider quelle classe de vue utiliser, et quel 
fichier de vue doit être rendu à partir du contrôleur.

.. php:method:: set(string $var, mixed $value)

    La méthode ``set()`` est la voie principale utilisée pour transmettre des 
    données de votre contrôleur à votre vue. Une fois ``set()`` utilisée, la 
    variable de votre contrôleur devient accessible par la vue::

        <?php
        // Dans un premier temps vous passez les données depuis le contrôleur:

        $this->set('couleur', 'rose');

        // Ensuite vous pouvez les utiliser dans la vue de cette manière:
        ?>

        Vous avez sélectionné un glaçage <?php echo $couleur; ?> pour le gâteau.

    La méthode ``set()`` peut également prendre un tableau associatif comme 
    premier paramètre. Cela peut souvent être une manière rapide d'affecter 
    en une seule fois un jeu complet d'informations à la vue. 

    .. versionchanged:: 1.3
        Les clefs de votre tableau ne seront plus infléchies avant d'être 
        assignées à la vue (‘clef\_avec\_underscore’ ne devient plus 
        ‘clefAvecUnderscore’, etc...).

    ::

        <?php
        $data = array(
            'couleur' => 'rose',
            'type' => 'sucre',
            'prix_de_base' => 23.95
        );

        // donne $couleur, $type, et $prix_de_base 
        // disponible dans la vue:

        $this->set($data);  


    L'attribut ``$pageTitle`` n'existe plus, utilisez ``set()`` pour définir 
    le titre::

        <?php
        $this->set('title_for_layout', 'Ceci est la page titre');


.. php:method:: render(string $action, string $layout, string $file)

    La méthode ``render()`` est automatiquement appelée à la fin de 
    chaque action exécutée par le contrôleur. Cette méthode exécute 
    toute la logique liée à la présentation (en utilisant les variables 
    transmises via la méthode ``set()``), place le contenu de la vue 
    à l'intérieur de sa mise en page et transmet le tout à l'utilisateur 
    final.

    Le fichier de vue utilisé par défaut est déterminé par convention. 
    Ainsi, si l'action ``search()`` de notre contrôleur RecettesController 
    est demandée, le fichier de vue situé dans /app/view/recettes/search.ctp 
    sera utilisé::

        <?php
        class RecettesController extends AppController {
        // ...
            public function search() {
                // Rend la vue dans /View/Recettes/search.ctp
                $this->render();
            }
        // ...
        }

    Bien que CakePHP appellera cette fonction automatiquement à la 
    fin de chaque action (à moins que vous n'ayez défini ``$this->autoRender``
    à false), vous pouvez l'utiliser pour spécifier un fichier de vue 
    alternatif en précisant le nom d'une action dans le contrôleur, via 
    le paramètre ``$action``.

    Si ``$action`` commence avec un '/' on suppose que c'est un fichier de 
    vue ou un élément dont le chemin est relatif au dossier ``/app/View``. Cela 
    permet un affichage direct des éléments, ce qui est très pratique lors 
    d'appels ajax.
    ::

        <?php
        // Rend un élément dans /View/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

    Vous pouvez aussi spécifier une vue alternative ou un fichier element en 
    utilisant le troisième paramètre, ``$file``. Le paramètre ``$layout`` 
    vous permet de spécifier le layout de la vue qui est rendue.

Rendre une vue spécifique
~~~~~~~~~~~~~~~~~~~~~~~~~

Dans votre contrôleur, vous pourriez avoir envie de rendre une vue 
différente que celle rendue par défaut. Vous pouvez faire cela en appelant 
directement ``render()``. Une fois que vous avez appelé ``render()`` CakePHP 
n'essaiera pas de re-rendre la vue::

    <?php
    class PostsController extends AppController {
        public function mon_action() {
            $this->render('fichier_personnalise');
        }
    }

Cela rendrait ``app/View/Posts/fichier_personnalise.ctp`` au lieu de 
``app/View/Posts/mon_action.ctp``

Contrôle de FLux
----------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    La méthode de contrôle de flux que vous utiliserez le plus souvent est 
    ``redirect()``. Cette méthode prend son premier paramètre sous la forme 
    d'une URL relative à votre application CakePHP. Quand un utilisateur a 
    réalisé un paiement avec succès, vous aimeriez le rediriger vers un 
    écran affichant le reçu.::

        <?php
        public function regler_achats() {
            // Placez ici la logique pour finaliser l'achat...
            if ($success) {
                $this->redirect(array('controller' => 'paiements', 'action' => 'remerciements'));
            } else {
                $this->redirect(array('controller' => 'paiements', 'action' => 'confirmations'));
            }
        }

    Vous pouvez aussi utiliser une URL relative ou absolue avec $url::

        <?php
        $this->redirect('/paiements/remerciements'));
        $this->redirect('http://www.exemple.com');

    Vous pouvez aussi passer des données à l'action::

        <?php
        $this->redirect(array('action' => 'editer', $id));

    Le second paramètre de la fonction ``redirect()`` vous permet de 
    définir un code de statut HTTP accompagnant la redirection. 
    Vous aurez peut-être besoin d'utiliser le code 301 (document 
    déplacé de façon permanente) ou 303 (voir ailleurs), en fonction 
    de la nature de la redirection.

    Cette méthode réalise un ``exit()`` après la redirection, tant que vous 
    ne mettez pas le troisième paramètre à false.

    Si vous avez besoin de rediriger à la page appelante, vous pouvez 
    utiliser::

        <?php
        $this->redirect($this->referer());

    Cette méthode supporte aussi les paramètres nommés de base. Si vous 
    souhaitez être redirigé sur une URL comme: 
    ``http://www.example.com/commandes/confirmation/produit:pizza/quantite:5``
    vous pouvez utiliser::

        <?php
        $this->redirect(array('controller' => 'commandes', 'action' => 'confirmation', 'produit' => 'pizza', 'quantite' => 5));

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    Tout comme ``redirect()``, la méthode ``flash()`` est utilisée pour 
    rediriger un utilisateur vers une autre page à la fin d'une opération. 
    La méthode ``flash()`` est toutefois différente en ce sens qu'elle affiche 
    un message avant de diriger l'utilisateur vers une autre url.

    Le premier paramètre devrait contenir le message qui sera affiché et le 
    second paramètre une URL relative à votre application CakePHP. CakePHP 
    affichera le ``$message`` pendant ``$pause`` secondes avant de rediriger 
    l'utilisateur.

    Si vous souhaitez utiliser un template particulier pour messages flash,
    vous pouvezspécifier le nom du layout dans le paramètre ``$layout``.
    
    Pour définir des messages flash dans une page, regardez du côté de la 
    méthode setFlash() du composant Session (SessionComponent).

Callbacks
---------

En plus des :ref:`controller-life-cycle`, CakePHP supporte aussi les 
callbacks liés au scaffolding.

.. php:method:: beforeScaffold($method)

    $method nom de la méthode appelée, par exemple index, edit, etc.

.. php:method:: afterScaffoldSave($method)

    $method nom de la méthode appelée soit edit soit update.

.. php:method:: afterScaffoldSaveError($method)

    $method nom de la méthode appelée soit edit soit update.

.. php:method:: scaffoldError($method)

    $method nom de la méthode appelée , par exemple index, edit, etc...

Autres Méthodes utiles
----------------------

.. php:method:: constructClasses

    Cette méthode charge en mémoire les modèles requis par le contrôleur. 
    Cette procédure de chargement est normalement effectuée par CakePHP, 
    mais cette méthode est à garder sous le coude quand vous avez besoin 
    d'accéder à certains contrôleurs depuis une perspective différente. Si 
    vous avez besoin de CakePHP dans un script utilisable en ligne de 
    commande ou d'autres utilisations externes, constructClasses() peut 
    devenir pratique.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Retourne l'URL référente de la requête courante. Le Paramètre 
    ``$default`` peut être utilisé pour fournir une URL par défaut à 
    utiliser si HTTP\_REFERER ne peut pas être lu par les headers. Donc, 
    au lieu de faire ceci::

        <?php
        class UtilisateursController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                if ($this->referer() != '/') {
                    $this->redirect($this->referer());
                } else {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }

    vous pouvez faire ceci::

        <?php
        class UtilisateursController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    Si ``$default`` n'est pas défini, la fonction se met par défaut sur 
    à la racine (root) de votre domaine - '/'.

    Le paramètre ``$local`` si il est défini à ``true``, restreint les URLs se 
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

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    Utilisez cette méthode pour transformer des données de formulaire, 
    transmises par POST (depuis les inputs du Helper Form), en des 
    conditions de recherche pour un modèle. Cette fonction offre un 
    raccourci appréciable pour la construction de la logique de recherche. 
    Par exemple, un administrateur aimerait pouvoir chercher des commandes 
    dans le but de connaître quels produits doivent être emballés. Vous 
    pouvez utiliser les Helpers Form et Html pour construire un formulaire 
    rapide basé sur le modèle Commande. Ensuite une action du contrôleur 
    peut utiliser les données postées par ce formulaire pour construire 
    automatiquement les conditions de la recherche::
        <?php
        public function index() {
            $conditions = $this->postConditions($this->request->data);
            $commandes = $this->Commande->find('all', compact('conditions'));
            $this->set('commandes', $orders);
        }

    Si ``$this->data[‘Commande’][‘destination’]`` vaut "Boulangerie du village", 
    postConditions convertit cette condition en un tableau compatible avec 
    la méthode Model->find(). Soit dans notre cas, 
    ``array("Commande.destination" => "Boulangerie du village")``.

    Si vous voulez utiliser un opérateur SQL différent entre chaque 
    terme, remplacez-le en utilisant le second paramètre::

        <?php
        /*
        Contenu de $this->request->data
        array(
            'Commande' => array(
                'nb_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // Let's get orders that have at least 4 items and contain 'Ye Olde'
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=', 
                'referrer' => 'LIKE'
            )
        );
        $commandes = $this->Commande->find('all', compact('conditions'));

    Le troisième paramètre vous permet de dire à CakePHP quel opérateur 
    booléen SQL utilisé entre les conditions de recherche. Les chaînes 
    comme ‘AND’, ‘OR’ et ‘XOR’ sont des valeurs possibles.

    Enfin, si le dernier paramètre est défini à vrai et que $op est un tableau, 
    les champs non-inclus dans $op ne seront pas inclus dans les conditions 
    retournées.

.. php:method:: paginate()

    Cette méthode est utilisée pour paginer les résultats retournés par vos 
    modèles. Vous pouvez définir les tailles de la page, les conditions à 
    utiliser pour la recherche de ces données et bien plus. Consultez la 
    section :doc:`pagination <core-libraries/components/pagination>` 
    pour plus de détails sur l'utilisation de la pagination.

.. php:method:: requestAction(string $url, array $options)

    Cette fonction appelle l'action d'un contrôleur depuis tout endroit 
    du code et retourne les données associées à cette action. L'``$url`` 
    passée est une adresse relative à votre application CakePHP 
    (/nomducontroleur/nomaction/parametres). Pour passer des données 
    supplémentaires au contrôleur destinataire ajoutez le tableau $options.

    .. note::

        Vous pouvez utiliser ``requestAction()`` pour récupérer 
        l'intégralité de l'affichage d'une vue en passant la valeur 
        'return' dans les options : ``requestAction($url, array('return'))``.
        Il est important de noter que faire un requestAction en utilisant 
        'return' à partir d'une méthode d'un contrôleur peut entraîner des 
        problèmes de fonctionnement dans les script et tags css.

    .. warning::

        Si elle est utilisée sans cache, la méthode ``requestAction`` peut 
        engendrer des faibles performances. Il est rarement approprié de 
        l'utiliser dans un contrôleur ou un modèle.

    ``requestAction`` est plutôt utilisé en conjonction avec des éléments 
    (mis en cache) - comme moyen de récupérer les données pour un élément 
    avant de l'afficher. Prenons l'exemple de la mise en place d'un élément 
    "derniers commentaires" dans le gabarit (layout). Nous devons d'abord 
    créer une méthode de controller qui retourne les données::
    
        <?php
        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (empty($this->request->params['requested'])) {
                    throw new ForbiddenException();
                }
                return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            }
        }

    You should always include checks to make sure your requestAction methods are
    actually originating from ``requestAction``.  Failing to do so will allow
    requestAction methods to be directly accessible from a URL, which is
    generally undesirable.

    If we now create a simple element to call that function::

        <?php
        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    We can then place that element anywhere to get the output
    using::

        <?php
        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request
    will be made to the controller to get the data, the data will be
    processed, and returned. However in accordance with the warning
    above it's best to make use of element caching to prevent needless
    processing. By modifying the call to element to look like this::

        <?php
        echo $this->element('latest_comments', array('cache' => '+1 hour'));

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction now takes array based cake style urls::

        <?php
        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    This allows the requestAction call to bypass the usage of
    Router::url which can increase performance. The url based arrays
    are the same as the ones that :php:meth:`HtmlHelper::link()` uses with one
    difference - if you are using named or passed parameters, you must put them
    in a second array and wrap them with the correct key. This is because
    requestAction merges the named args array (requestAction's 2nd parameter)
    with the Controller::params member array and does not explicitly place the
    named args array into the key 'named'; Additional members in the ``$option``
    array will also be made available in the requested action's
    Controller::params array::
        
        <?php
        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        <?php
        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        Unlike other places where array urls are analogous to string urls,
        requestAction treats them differently.

    When using an array url in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, named and pass parameters must be done
    in the second array as seen above.


.. php:method:: loadModel(string $modelClass, mixed $id)

    The ``loadModel`` function comes handy when you need to use a model
    which is not the controller's default model or its associated
    model::
    
        <?php
        $this->loadModel('Article');
        $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

        $this->loadModel('User', 2);
        $user = $this->User->read();


Les attributs du Contrôleur
===========================

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

.. php:attr:: name

    The ``$name`` attribute should be set to the
    name of the controller. Usually this is just the plural form of the
    primary model the controller uses. This property is not required,
    but saves CakePHP from inflecting it::

        <?php
        // $name controller attribute usage example
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }
        

$components, $helpers and $uses
-------------------------------

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by ``$components`` and ``$uses`` available to the controller
as class variables (``$this->ModelName``, for example) and those
given by ``$helpers`` to the view as an object reference variable
(``$this->{$helpername}``).

.. note::

    Each controller has some of these classes available by default, so
    you may not need to configure your controller at all.

.. php:attr:: uses

    Controllers have access to their primary model available by
    default. Our RecipesController will have the Recipe model class
    available at ``$this->Recipe``, and our ProductsController also
    features the Product model at ``$this->Product``. However, when
    allowing a controller to access additional models through the
    ``$uses`` variable, the name of the current controller's model must
    also be included. This is illustrated in the example below.

    If you do not wish to use a Model in your controller, set
    ``public $uses = array()``. This will allow you to use a controller
    without a need for a corresponding Model file. However, the models
    defined in the ``AppController`` will still be loaded.  You can also use
    ``false`` to not load any models at all.  Even those defined in the
    ``AppController``

    .. versionchanged:: 2.1
        Uses now has a new default value, it also handles ``false`` differently.

.. php:attr:: helpers

    The Html, Form, and Session Helpers are available by
    default, as is the SessionComponent. But if you choose to define
    your own ``$helpers`` array in AppController, make sure to include
    ``Html`` and ``Form`` if you want them still available by default
    in your Controllers. To learn more about these classes, be sure
    to check out their respective sections later in this manual.

    Let’s look at how to tell a CakePHP controller that you plan to use
    additional MVC classes::

        <?php
        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Each of these variables are merged with their inherited values,
    therefore it is not necessary (for example) to redeclare the Form
    helper, or anything that is declared in your App controller.

.. php:attr:: components

    The components array allows you to set which :doc:`/controllers/components`
    a controller will use.  Like ``$helpers`` and ``$uses`` components in your 
    controllers are merged with those in ``AppController``.  As with
    ``$helpers`` you can pass settings into components.  See :ref:`configuring-components`
    for more information.

Autres Attributs
----------------

While you can check out the details for all controller attributes
in the API, there are other controller attributes that merit their
own sections in the manual.

.. php:attr: cacheAction

    The cacheAction attribute is used to define the duration and other
    information about full page caching.  You can read more about
    full page caching in the :php:class:`CacheHelper` documentation.

.. php:attr: paginate

    The paginate attribute is a deprecated compatibility property.  Using it
    loads and configures the :php:class:`PaginatorComponent`.  It is recommended
    that you update your code to use normal component settings::

        <?php
        class ArticlesController extends AppController {
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
        }

.. todo::

    This chapter should be less about the controller api and more about
    examples, the controller attributes section is overwhelming and difficult to
    understand at first. The chapter should start with some example controllers
    and what they do.

En savoir plus sur les contrôleurs
==================================

.. toctree::

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=fr: Controllers (Contrôleurs)
    :keywords lang=fr: bons modèles,classe controller,controller controller,librairie du coeur,modèle unique,donnée requêtée,homme du milieu,boulangerie,mvc,attributs,logique,recettes
