Controllers (Contrôleurs)
#########################

Les Controllers sont le 'C' dans MVC. Après que le routage a été appliqué et
que le bon controller a été trouvé, l'action de votre controller est
appelée. Votre controller devra gérer l'interprétation des données requêtées,
s'assurer que les bons models sont appelés et que la bonne réponse ou vue est
rendue. Les controllers peuvent être imaginés comme un homme au milieu entre
le Model et la Vue. Le mieux est de garder des controllers peu chargés, et
des models plus fournis. Cela vous aidera à réutiliser plus facilement votre
code et facilitera le test de votre code.

Habituellement, les controllers sont utilisés pour gérer la logique autour
d'un seul model. Par exemple, si vous construisez un site pour gérer une
boulangerie en-ligne, vous aurez sans doute un RecettesController qui gère
vos recettes et un IngredientsController qui gère vos ingrédients. Cependant,
il est aussi possible d'avoir des controllers qui fonctionnent avec plus d'un
model. Dans CakePHP, un controller est nommé d'après le model principal qu'il
gère.

Les controllers de votre application sont des classes qui étendent la classe
CakePHP ``AppController``, qui hérite elle-même de la classe
:php:class:`Controller` du cœur. La classe ``AppController`` peut être définie
dans ``/app/Controller/AppController.php`` et elle devrait contenir les
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
``/app/Controller/AppController.php`` comme ceci::

    class AppController extends Controller {
    }

Les attributs et méthodes de controller créés dans ``AppController`` seront
disponibles dans tous les controllers de votre application. Les Components (que
vous découvrirez plus loin) sont mieux appropriés pour du code utilisé dans
la plupart (mais pas nécessairement tous) des controllers.

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

    public function beforeFilter() {
        parent::beforeFilter();
    }

Les paramètres de requête
=========================

Quand une requête est faîte dans une application CakePHP, Les classes
:php:class:`Router` et :php:class:`Dispatcher` de CakePHP utilisent la
:ref:`routes-configuration` pour trouver et créer le bon controller. La
requête de données est encapsulée dans un objet request.
CakePHP met toutes les informations importantes de la requête dans la
propriété ``$this->request``. Regardez la section :ref:`cake-request`
pour plus d'informations sur l'objet request de CakePHP.

Les Actions du Controller
=========================

Les actions du Controller sont responsables de la conversion des paramètres de
la requête dans une réponse pour le navigateur/utilisateur faisant la requête.
CakePHP utilise les conventions pour automatiser le processus et retirer
quelques codes boiler-plate que vous auriez besoin d'écrire autrement.

Par convention, CakePHP rend une vue avec une version inflectée du nom de
l'action. Revenons à notre boulangerie en-ligne par exemple, notre
RecipesController pourrait contenir les actions
``view()``, ``share()``, et ``search()``. Le controller serait trouvé dans
``/app/Controller/RecettesController.php`` et contiendrait::

        # /app/Controller/RecettesController.php

        class RecettesController extends AppController {
            public function view($id) {
                //la logique de l'action va ici..
            }

            public function share($client_id, $recette_id) {
                //la logique de l'action va ici..
            }

            public function search($query) {
                //la logique de l'action va ici..
            }
        }

Les fichiers de vue pour ces actions seraient ``app/View/Recettes/view.ctp``,
``app/View/Recettes/share.ctp``, et ``app/View/Recettes/search.ctp``. Le nom
du fichier de vue est par convention le nom de l'action en minuscules et avec
des underscores.

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
:php:meth:`~Controller::requestAction()`, vous voudrez souvent retourner les
données qui ne sont pas des chaînes de caractère. Si vous avez des méthodes
du controller qui sont utilisées pour des requêtes web normales + requestAction,
vous devrez vérifier le type de requête avant de retourner::

    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipe->popular();
            if (!empty($this->request->params['requested'])) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

Le controller ci-dessus est un exemple montrant comment la méthode peut être
utilisée avec :php:meth:`~Controller::requestAction()` et des requêtes normales.
Retourner un tableau de données à une requête non-requestAction va entraîner
des erreurs et devra être évité. Regardez la section sur
:php:meth:`~Controller::requestAction()` pour plus d'astuces sur l'utilisation
de :php:meth:`~Controller::requestAction()`.

Afin que vous utilisiez efficacement le controller dans votre propre
application, nous couvrons certains des attributs et méthodes du coeur fournis
par les controllers de CakePHP.

.. _controller-life-cycle:

Request Life-cycle callbacks
============================

.. php:class:: Controller

Les controllers de CakePHP sont livrés par défaut avec des méthodes de rappel
(ou callback) que vous pouvez utiliser pour insérer de la logique juste avant
ou juste après que les actions du controller soient effectuées:

.. php:method:: beforeFilter()

    Cette fonction est exécutée avant chaque action du controller. C'est
    un endroit pratique pour vérifier le statut d'une session ou les
    permissions d'un utilisateur.

    .. note::

        La méthode beforeFilter() sera appelée pour les actions manquantes et
        les actions de scaffolding.

.. php:method:: beforeRender()

    Cette méthode est appelée après l'action du controller mais avant
    que la vue ne soit rendue. Ce callback n'est pas souvent utilisé,
    mais peut-être nécessaire si vous appellez :php:meth:`~Controller::render()`
    manuellement à la fin d'une action donnée.

.. php:method:: afterFilter()

    Cette méthode est appelée après chaque action du controller, et après
    que l'affichage soit terminé. C'est la dernière méthode du controller
    qui est exécutée.

En plus des callbacks des controllers, les :doc:`/controllers/components`
fournissent aussi un ensemble similaire de callbacks.

.. _controller-methods:

Les Méthodes du Controller
==========================

Pour une liste complète des méthodes de controller avec leurs descriptions,
consultez
`l'API de CakePHP <https://api.cakephp.org/2.4/class-Controller.html>`_.

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

        Vous avez sélectionné un glaçage <?php echo $couleur; ?> pour le gâteau.

    La méthode :php:meth:`~Controller::set()` peut également prendre un tableau
    associatif comme premier paramètre. Cela peut souvent être une manière
    rapide d'affecter en une seule fois un jeu complet d'informations à la vue::

        $data = array(
            'couleur' => 'rose',
            'type' => 'sucre',
            'prix_de_base' => 23.95
        );

        // donne $couleur, $type, et $prix_de_base
        // disponible dans la vue:

        $this->set($data);


    L'attribut ``$pageTitle`` n'existe plus. Utilisez
    :php:meth:`~Controller::set()` pour définir le titre::

        $this->set('title_for_layout', 'Ceci est la page titre');

    Depuis 2.5 la variable $title_for_layout est dépréciée, utilisez les blocks de vues à la place.

.. php:method:: render(string $view, string $layout)

    La méthode :php:meth:`~Controller::render()` est automatiquement appelée à
    la fin de chaque action exécutée par le controller. Cette méthode exécute
    toute la logique liée à la présentation (en utilisant les variables
    transmises via la méthode :php:meth:`~Controller::set()`), place le contenu
    de la vue à l'intérieur de son :php:attr:`~View::$layout` et transmet le
    tout à l'utilisateur final.

    Le fichier de vue utilisé par défaut est déterminé par convention.
    Ainsi, si l'action ``search()`` de notre controller RecettesController
    est demandée, le fichier de vue situé dans /app/view/recettes/search.ctp
    sera utilisé::

        class RecettesController extends AppController {
        // ...
            public function search() {
                // Rend la vue dans /View/Recettes/search.ctp
                $this->render();
            }
        // ...
        }

    Bien que CakePHP appelle cette fonction automatiquement à la
    fin de chaque action (à moins que vous n'ayez défini ``$this->autoRender``
    à false), vous pouvez l'utiliser pour spécifier un fichier de vue
    alternatif en précisant le nom d'une action dans le controller, via
    le paramètre ``$view``.

    Si ``$view`` commence avec un '/' on suppose que c'est un fichier de
    vue ou un élément dont le chemin est relatif au dossier ``/app/View``. Cela
    permet un affichage direct des éléments, ce qui est très pratique lors
    d'appels AJAX.
    ::

        // Rend un élément dans /View/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

    Le paramètre :php:attr:`~View::$layout` vous permet de spécifier le layout
    de la vue qui est rendue.

Rendre une vue spécifique
~~~~~~~~~~~~~~~~~~~~~~~~~

Dans votre controller, vous pourriez avoir envie de rendre une vue
différente de celle rendue par défaut. Vous pouvez faire cela en appelant
directement :php:meth:`~Controller::render()`. Une fois que vous avez appelé
:php:meth:`~Controller::render()` CakePHP n'essaiera pas de re-rendre la vue::

    class PostsController extends AppController {
        public function mon_action() {
            $this->render('fichier_personnalise');
        }
    }

Cela rendrait ``app/View/Posts/fichier_personnalise.ctp`` au lieu de
``app/View/Posts/mon_action.ctp``.

Vous pouvez aussi rendre les vues des plugins en utilisant la syntaxe suivante:
``$this->render('PluginName.PluginController/custom_file')``.
Par exemple::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('Users.UserDetails/custom_file');
        }
    }
    
Cela rendrait la vue ``app/Plugin/Users/View/UserDetails/custom_file.ctp``

Contrôle de Flux
----------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    La méthode de contrôle de flux que vous utiliserez le plus souvent est
    :php:meth:`~Controller::redirect()`. Cette méthode prend son premier
    paramètre sous la forme d'une URL relative à votre application CakePHP.
    Quand un utilisateur a réalisé un paiement avec succès, vous aimeriez le
    rediriger vers un écran affichant le reçu. ::

        public function regler_achats() {
            // Placez ici la logique pour finaliser l'achat...
            if ($success) {
                return $this->redirect(
                    array('controller' => 'paiements', 'action' => 'remerciements')
                );
            } else {
                return $this->redirect(
                    array('controller' => 'paiements', 'action' => 'confirmations')
                );
            }
        }

    Vous pouvez aussi utiliser une URL relative ou absolue avec $url::

        $this->redirect('/paiements/remerciements');
        $this->redirect('http://www.exemple.com');

    Vous pouvez aussi passer des données à l'action::

        $this->redirect(array('action' => 'editer', $id));

    Le second paramètre de la fonction :php:meth:`~Controller::redirect()`
    vous permet de définir un code de statut HTTP accompagnant la redirection.
    Vous aurez peut-être besoin d'utiliser le code 301 (document
    déplacé de façon permanente) ou 303 (voir ailleurs), en fonction
    de la nature de la redirection.

    Cette méthode réalise un ``exit()`` après la redirection, tant que vous
    ne mettez pas le troisième paramètre à false.

    Si vous avez besoin de rediriger à la page appelante, vous pouvez
    utiliser::

        $this->redirect($this->referer());

    Cette méthode supporte aussi les paramètres nommés de base. Si vous
    souhaitez être redirigé sur une URL comme:
    ``http://www.example.com/commandes/confirmation/produit:pizza/quantite:5``
    vous pouvez utiliser::

        $this->redirect(array(
            'controller' => 'commandes',
            'action' => 'confirmation',
            'produit' => 'pizza',
            'quantite' => 5
        ));

    Un exemple d'utilisation des requêtes en chaînes et hashés ressemblerait
    à ceci::

        $this->redirect(array(
            'controller' => 'commandes',
            'action' => 'confirmation',
            '?' => array(
                'produit' => 'pizza',
                'quantite' => 5
            ),
            '#' => 'top'
        ));

    L'URL généré serait:
        ``http://www.example.com/commandes/confirmation?produit=pizza&quantite=5#top``

.. php:method:: flash(string $message, string|array $url, integer $pause, string $layout)

    Tout comme :php:meth:`~Controller::redirect()`, la méthode
    :php:meth:`~Controller::flash()` est utilisée pour rediriger un utilisateur
    vers une autre page à la fin d'une opération. La méthode
    :php:meth:`~Controller::flash()` est toutefois différente en ce sens
    qu'elle affiche un message avant de diriger l'utilisateur vers une autre
    url.

    Le premier paramètre devrait contenir le message qui sera affiché et le
    second paramètre une URL relative à votre application CakePHP. CakePHP
    affichera le ``$message`` pendant ``$pause`` secondes avant de rediriger
    l'utilisateur.

    Si vous souhaitez utiliser un template particulier pour messages flash,
    vous pouvez spécifier le nom du layout dans le paramètre
    :php:attr:`~View::$layout`.

    Pour définir des messages flash dans une page, regardez du côté de la
    méthode :php:meth:`SessionComponent::setFlash()` du component Session
    (SessionComponent).

Callbacks
---------

En plus des :ref:`controller-life-cycle`, CakePHP supporte aussi les
callbacks liés au scaffolding.

.. php:method:: beforeScaffold($method)

    $method nom de la méthode appelée, par exemple index, edit, etc.

.. php:method:: afterScaffoldSave($method)

    $method nom de la méthode appelée, soit edit soit update.

.. php:method:: afterScaffoldSaveError($method)

    $method nom de la méthode appelée, soit edit soit update.

.. php:method:: scaffoldError($method)

    $method nom de la méthode appelée, par exemple index, edit, etc...

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

        class UtilisateursController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                if ($this->referer() != '/') {
                    return $this->redirect($this->referer());
                }
                return $this->redirect(array('action' => 'index'));
            }
        }

    vous pouvez faire ceci::

        class UtilisateursController extends AppController {
            public function delete($id) {
                // le code de suppression va ici, et ensuite...
                return $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    Si ``$default`` n'est pas défini, la fonction se met par défaut sur
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

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    Utilisez cette méthode pour transformer des données de formulaire,
    transmises par POST (depuis les inputs du Helper Form), en des
    conditions de recherche pour un model. Cette fonction offre un
    raccourci appréciable pour la construction de la logique de recherche.
    Par exemple, un administrateur aimerait pouvoir chercher des commandes
    dans le but de connaître les produits devant être emballés. Vous
    pouvez utiliser les Helpers Form et Html pour construire un formulaire
    rapide basé sur le model Commande. Ensuite une action du controller
    peut utiliser les données postées par ce formulaire pour construire
    automatiquement les conditions de la recherche::

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

        /*
        Contenu de $this->request->data
        array(
            'Commande' => array(
                'nb_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // Récupérons maintenant les commandes qui ont au moins 4 items et
        contenant 'Ye Olde'
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'nb_items' => '>=',
                'referrer' => 'LIKE'
            )
        );
        $commandes = $this->Commande->find('all', compact('conditions'));

    Le troisième paramètre vous permet de dire à CakePHP quel opérateur
    booléen SQL utiliser entre les conditions de recherche. Les chaînes
    comme 'AND', 'OR' et 'XOR' sont des valeurs possibles.

    Enfin, si le dernier paramètre est défini à vrai et que $op est un tableau,
    les champs non-inclus dans $op ne seront pas inclus dans les conditions
    retournées.

.. php:method:: paginate()

    Cette méthode est utilisée pour paginer les résultats retournés par vos
    models. Vous pouvez définir les tailles de la page, les conditions à
    utiliser pour la recherche de ces données et bien plus encore. Consultez la
    section :doc:`pagination <core-libraries/components/pagination>`
    pour plus de détails sur l'utilisation de la pagination.

.. php:method:: requestAction(string $url, array $options)

    Cette fonction appelle l'action d'un controller depuis tout endroit
    du code et retourne les données associées à cette action. L'``$url``
    passée est une adresse relative à votre application CakePHP
    (/nomducontroleur/nomaction/parametres). Pour passer des données
    supplémentaires au controller destinataire, ajoutez le tableau $options.

    .. note::

        Vous pouvez utiliser :php:meth:`~Controller::requestAction()` pour
        récupérer l'intégralité de l'affichage d'une vue en passant la valeur
        'return' dans les options : ``requestAction($url, array('return'))``.
        Il est important de noter que faire un requestAction en utilisant
        'return' à partir d'une méthode d'un controller peut entraîner des
        problèmes de fonctionnement dans les script et tags CSS.

    .. warning::

        Si elle est utilisée sans cache, la méthode
        :php:meth:`~Controller::requestAction()` peut engendrer des faibles
        performances. Il est rarement approprié de l'utiliser dans un
        controller ou un model.

    :php:meth:`~Controller::requestAction()` est plutôt utilisée en conjonction
    avec des éléments (mis en cache) - comme moyen de récupérer les données
    pour un élément avant de l'afficher. Prenons l'exemple de la mise en place
    d'un élément "derniers commentaires" dans le layout. Nous devons d'abord
    créer une méthode de controller qui retourne les données::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (empty($this->request->params['requested'])) {
                    throw new ForbiddenException();
                }
                return $this->Comment->find(
                    'all',
                    array('order' => 'Comment.created DESC', 'limit' => 10)
                );
            }
        }

    Vous devriez toujours inclure des vérifications pour vous assurer que
    vos méthodes de requestAction sont en fait originaires de
    :php:meth:`~Controller::requestAction()`. Ne pas le faire va autoriser les
    méthodes :php:meth:`~Controller::requestAction()` à être directement
    accessible d'une URL, ce qui n'est généralement pas souhaité.

    Si nous créons un élément simple pour appeler cette fonction::

        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    On peut ensuite placer cet élément n'importe où pour obtenir la
    sortie en utilisant::

        echo $this->element('latest_comments');

    Ecrit de cette manière, dès que l'élément est affiché, une requête
    sera faite au controller pour obtenir les données, les données seront
    traitées, et retournées. Cependant, compte tenu de l'avertissement
    ci-dessus il vaut mieux utiliser des éléments mis en cache pour anticiper
    des traitements inutiles. En modifiant l'appel à l'élément pour qu'il
    ressemble à ceci::

        echo $this->element('latest_comments', array(), array('cache' => true));

    L'appel à :php:meth:`~Controller::requestAction()` ne sera pas effectué
    tant que le fichier de vue de l'élément en cache existe et est valide.

    De plus, :php:meth:`~Controller::requestAction()` prend désormais des URLs
    basées sur des tableau dans le style de cake::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    Cela permet à l'appel de :php:meth:`~Controller::requestAction()` d'éviter
    l'utilisation de Router::url ce qui peut améliorer la performance. Les urls
    basées sur des tableaux sont les mêmes que celles utilisées par
    :php:meth:`HtmlHelper::link()` avec une seule différence. Si vous utilisez
    des paramètres nommés ou passés dans vos urls, vous devez les mettre dans
    un second tableau et les inclure dans la clé correcte. La raison de cela
    est que :php:meth:`~Controller::requestAction()` fusionne seulement le
    tableau des arguments nommés avec les membres du tableau de
    ``Controller::params`` et ne place pas les arguments nommés dans la clé
    'named'. Des parties supplémentaires dans le tableau ``$option`` vont aussi
    être disponibles dans le tableau Controller::params de l'action requêtée::

        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    En array dans requestAction serait ainsi::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        Contrairement aux autres places où les URLs en tableau sont analogues
        aux URLs en chaîne de caractère, requestAction les traite différemment.

    Quand vous utilisez une url en tableau en conjonction avec
    :php:meth:`~Controller::requestAction()`, vous devez spécifier **tous** les
    paramètres dont vous aurez besoin dans l'action requêtée. Ceci inclut les
    paramètres comme ``$this->request->data``. En plus de passer tous les
    paramètres requis, les paramètres nommés et passés doivent être faits dans
    le second tableau comme vu ci-dessus.

.. php:method:: loadModel(string $modelClass, mixed $id)

    La fonction :php:meth:`~Controller::loadModel()` devient pratique quand
    vous avez besoin d'utiliser un model qui n'est pas le model du controller
    par défaut ou un de ses models associés::

        $this->loadModel('Article');
        $recentArticles = $this->Article->find(
            'all',
            array('limit' => 5, 'order' => 'Article.created DESC')
        );

        $this->loadModel('User', 2);
        $user = $this->User->read();


Les attributs du Controller
===========================

Pour une liste complète des attributs du controller et ses descriptions,
regardez `l'API de CakePHP <https://api.cakephp.org/2.4/class-Controller.html>`_.

.. php:attr:: name

    L'attribut :php:attr:`~Controller::$name` doit être défini selon le nom du
    controller. Habituellement, c'est juste la forme plurielle du model
    principal que le controller utilise. Cette propriété n'est pas requise,
    mais évite à CakePHP d'inflecter dessus::

        // Exemple d'utilisation d'attribut $name du controller
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }


$components, $helpers et $uses
------------------------------

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

.. php:attr:: uses

    Les controllers ont accès par défaut à leur model primaire respectif.
    Notre controller Recettes aura donc accès à son model Recette, disponible
    via ``$this->Recette``, et notre controller Produits proposera un accès à
    son model via ``$this->Produit``. Cependant, quand vous autorisez un
    controller à accéder à d'autres models via la variable
    :php:attr:`~Controller::$uses`, le nom du model primaire du controller
    courant doit également être inclu. Ceci est illustré dans l'exemple
    ci-dessous.

    Si vous ne souhaitez pas utiliser un Model dans votre controller,
    définissez ``public $uses = array()``. Cela vous permettra d'utiliser un
    controller sans avoir besoin d'un fichier Model correspondant. Cependant,
    les models définis dans ``AppController`` seront toujours chargés. Vous
    pouvez aussi utiliser ``false`` pour ne charger absolument aucun model.
    Même ceux définis dans ``AppController``.

    .. versionchanged:: 2.1
        :php:attr:`~Controller::$uses` a maintenant une nouvelle valeur par
        défaut, il gère aussi ``false`` différemment.

.. php:attr:: helpers

    Les Helpers :php:class:`HtmlHelper`, :php:class:`FormHelper` et
    :php:class:`SessionHelper` sont toujours accessibles par défaut, tout
    comme le :php:class:`SessionComponent`. Mais si vous choisissez de définir
    votre propre tableau :php:attr:`~Controller::$helpers` dans AppController,
    assurez-vous d'y inclure :php:class:`HtmlHelper` et :php:class:`FormHelper`
    si vous voulez qu'ils soient toujours disponibles par défaut dans vos
    propres controllers. Pour en savoir plus au sujet de ces classes,
    regardez leurs sections respectives plus loin dans le manuel.

    Jetons maintenant un œil sur la façon d'indiquer à un
    :php:class:`Controller` CakePHP que vous avez dans l'idée d'utiliser
    d'autres classes MVC::

        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Toutes ces variables sont fusionnées avec leurs valeurs héritées,
    par conséquent ce n'est pas nécessaire de re-déclarer (par exemple) le
    helper :php:class:`FormHelper` ou tout autre déclaré dans votre controller
    App.

.. php:attr:: components

    Le tableau de components vous permet de définir quel
    :doc:`/controllers/components` un controller va utiliser. Comme les
    :php:attr:`~Controller::$helpers` et :php:attr:`~Controller::$uses`, les
    components dans vos controllers sont fusionnés avec ceux dans
    ``AppController``. Comme pour les :php:attr:`~Controller::$helpers`,
    vous pouvez passer les paramètres dans les components. Regardez
    :ref:`configuring-components` pour plus d'informations.

Autres Attributs
----------------

Tandis que vous pouvez vérifier les détails pour tous les attributs des
controllers dans l'`API <https://api.cakephp.org>`_, il y a d'autres attributs
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
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
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
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=fr: Controllers (Contrôleurs)
    :keywords lang=fr: bons modèles,classe controller,controller controller,librairie du coeur,modèle unique,donnée requêtée,homme du milieu,boulangerie,mvc,attributs,logique,recettes
