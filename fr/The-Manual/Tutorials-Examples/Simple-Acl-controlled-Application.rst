Application simple contrôlée par Acl
####################################

Bienvenue dans *CakePHP* si vous n'avez jamais utilisé *CakePHP*
commencer par le tutoriel sur le blog. Si vous avez déjà regardé le
tutoriel du blog et que vous avez lu des choses à propos de *bake*
(l'utilitaire en ligne de commande de *CakePHP*) ou que vous l'avez
utilisé, et si vous voulez mettre en place un système d'authentification
et de controle d'accès alors ce tutoriel est pour vous.

Comme mentionné ci-dessus, ce tutoriel suppose que vous avez une
certaine expérience de *CakePHP*. Vous êtes familier de tous les
concepts MVC du coeur de Cake. Vous êtes aussi à l'aise pour utiliser
*bake* et la console de *cake*. Si ce n'est pas le cas, vous devriez
apprendre ces concepts et reprendre ce tutoriel après. Ce tutoriel sera
ainsi plus facile à suivre et à comprendre. Dans ce tutoriel, nous
utiliserons le `Component Auth </fr/view/172/Authentication>`_ et le
`Component Acl </fr/view/171/Access-Control-Lists>`_. Si vous ne savez
pas ce qu'ils sont, regardez leurs pages dans le CookBook avant de
continuer.

Ce dont vous aurez besoin :

#. Un serveur web opérationnel. Nous allons supposer que vous utilisez
   Apache, cependant les instructions pour utiliser d'autres serveurs
   devraient être très similaires. Nous pourrions avoir à jouer un peu
   avec la configuration du serveur, mais la plupart de gens peuvent se
   procurer *CakePHP* et le faire fonctionner sans qu'aucune
   configuration soit nécessaire .
#. Une connaissance des bases PHP. Plus vous aurez pratiqué la
   programmation orientée objet, mieux ça vaudra : mais n'ayez pas peur
   si vous êtes un fan de programmation procédurale.

Préparation de notre application
================================

Premièrement, récupérons une copie fraîche de CakePHP

Pour obtenir un téléchargement à jour, visitez le projet CakePHP chez
CakeForge: et téléchargez la
version stable. Pour ce tutoriel vous aurez besoin de la 1.2.x.x

Vous pouvez aussi faire une extraction/un export SVN du *trunk* de notre
code à : https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/

Une fois que vous avez votre copie toute fraîche de Cake, configurez
votre fichier "app/config/database.php" et changez la valeur du
*Security.salt* ("grain" de sécurité) dans votre fichier
"app/config/core.php". A ce stade, nous construirons un schéma simple de
base de données sur lequel bâtir notre application. Exécutez les
commandes SQL suivantes sur votre base de données.

::

    CREATE TABLE utilisateurs (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        pseudo VARCHAR(255) NOT NULL UNIQUE,
        mot_passe CHAR(40) NOT NULL,
        groupe_id INT(11) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

     
    CREATE TABLE groupes (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        created DATETIME,
        modified DATETIME
    );


    CREATE TABLE posts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        utilisateur_id INT(11) NOT NULL,
        titre VARCHAR(255) NOT NULL,
        contenu TEXT,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE gadgets (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        numero VARCHAR(12),
        quantite INT(11)
    );

Ce sont les tables que nous utiliserons pour construire le reste de
notre application. Une fois que nous avons la structure des tables dans
notre base de données, nous pouvons commencer à cuisiner. Utilisez *cake
bake* pour créer rapidement vos modèles, contrôleurs et vues. Ne vous
occupez pas des routes "admin" pour l'instant, c'est un sujet déjà bien
compliqué sans elles. Assurez-vous également de **ne pas** ajouter le
composant Acl, ni le composant Auth à l'un ou l'autre de vos contrôleurs
pendant que vous les créez. Nous nous occuperons de cela bientôt. Vous
devriez maintenant avoir des modèles, des contrôleurs et des vues pour
les utilisateurs, les groupes, les posts et les gadgets.

Dans le mode ``actions``, cela désigne nos ARO (Objets de requêtes
d'accès) - les groupes et les utilisateurs - opposés aux objets ACO
(Objets de contrôle d'accès) - les contrôleurs & actions.

Préparation pour ajouter Auth
=============================

Nous avons maintenant une application CRUD (Créer Lire Editer Supprimer)
fonctionnelle. Bake devrait avoir mis en place toutes les relations dont
nous avons besoin, si ce n'est pas le cas, faites-le maintenant. Il y a
quelques autres éléments qui doivent être ajoutés avant de pouvoir
ajouter les composants Auth et Acl. Tout d'abord, ajoutez une action
login et une action logout à votre ``UtilisateursController``.

::

    function login() {
        // Magie du composant Auth
    }
     
    function logout() {
        // Laissez vide pour le moment.
    }

Ensuite, créez le fichier de vue suivant pour le login, dans
app/views/utilisateurs/login.ctp :

::

    $session->flash('auth');
    echo $form->create('Utilisateur', array('action' => 'login'));
    echo $form->inputs(array(
        'legend' => __('Identification', true),
        'username',
        'password'
    ));
    echo $form->end('Identifier');

Une fois que c'est configuré correctement, nous n'avons pas besoin de
nous inquiéter d'ajouter quoi que ce soit pour hacher les mots de passe,
puisque le composant Auth le fera pour nous automatiquement à la
création/édition des utilisateurs et lors de leur identification. De
plus, si vous hachez les mots de passe entrants manuellement, le
composant Auth ne sera pas capable de vous identifier. Car il les
hachera à nouveau et qu'ils ne correspondront pas.

Ensuite, nous devons faire quelques modifications dans
``AppController``. Si vous n'avez pas ``/app/app_controller.php``,
créez-le. Notez que cela doit aller dans /app/ et non pas dans
/app/controllers/. Du fait que nous souhaitons contrôler tout notre site
avec Auth et Acl, nous allons les définir dans ``AppController``.

::

    class AppController extends Controller {
        var $components = array('Acl', 'Auth');

        function beforeFilter() {
            // Configuration de AuthComponent
            $this->Auth->userModel = 'Utilisateur';
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'utilisateurs', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'utilisateurs', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }

Avant de mettre en place l'ACL, nous aurons besoin d'ajouter quelques
utilisateurs et groupes. Avec l'utilisation de ``AuthComponent``, nous
ne serons pas en mesure d'accéder à l'une de nos actions, puisque nous
ne sommes pas connectés. Nous allons maintenant ajouter quelques
exceptions, ainsi ``AuthComponent`` nous permettra de créer quelques
groupes et utilisateurs. Dans **chacun** de vos ``GroupesController`` et
``UtilisateursController``, ajoutez ce qui suit :

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('*');
    }

Ces déclarations indiquent au composant Auth qu'il doit permettre un
accès public à toutes les actions. C'est seulement temporaire et ce sera
supprimé une fois que nous aurons quelques utilisateurs et groupes dans
notre base de données. N'ajoutez pas d'utilisateurs ou de groupes pour
le moment.

Initialiser les tables Acl dans la BdD
======================================

Avant de créer des utilisateurs et groupes, nous voulons les connecter à
l'Acl. Cependant, nous n'avons pour le moment aucune tables d'Acl et si
vous essayez de visualiser les pages maintenant, vous aurez une erreur
de table manquante. Pour supprimer ces erreurs, nous devons exécuter un
fichier de schéma. Dans un shell, exécutez la commande suivante :
``cake schema run create DbAcl``. Ce schéma vous invite à supprimer et
créer les tables. Répondez Oui (Yes) à la suppression et création des
tables.

Pensez à spécifier le chemin du dossier de l'application si vous êtes en
dehors de celui-ci.

#. Dans votre dossier d'application:

   ``$ /chemin/vers/cake/console/cake schema run create DbAcl``

#. En dehors de votre dossier d'application :

   ``$ /chemin/vers/cake/console/cake -app /chemin/vers/dossier/app schema run create DbAcl``

Avec les controlleurs configurés pour l'entrée de données et les tables
Acl initialisées, nous sommes prêt à commencer, n'est-ce-pas ? Pas tout
à fait, nous avons encore un peu de travail à faire dans les modèles
utilisateurs et groupes. Concrêtement, faire qu'ils s'attachent
auto-magiquement à l'Acl.

Agir comme un Requêteur
=======================

Pour que Auth et Acl fonctionnent correctement, nous devons associer nos
utilisateurs et groupes dans les entrées de nos tables Acl. Pour ce
faire, nous allons utiliser le comportement ``AclBehavior``. Le
comportement ``AclBehavior`` permet de connecter automagiquement des
modèles avec l'Acl. Son utilisation requiert l'implémentation de
``parentNode()`` dans vos modèles. Dans notre Modèle ``Utilisateur``
nous allons ajouter le code suivant :

::

    var $name = 'Utilisateur';
    var $belongsTo = array('Groupe');
    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (!$data['Utilisateur']['groupe_id']) {
            return null;
        } else {
            return array('Groupe' => array('id' => $data['Utilisateur']['groupe_id']));
        }
    }

Ensuite dans notre Modèle ``Groupe`` ajoutons ce qui suit :

::

    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        return null;
    }

Cela permet de lier les modèles ``Groupe`` et ``Utilisateur`` à l'Acl,
et de dire à CakePHP que chaque fois que l'on créé un Utilisateur ou un
Groupe, nous voulons également ajouter une entrée dans la table
``aros``. Cela fait de la gestion des Acl un jeu d'enfant, puisque vos
AROs se lient de façon transparente à vos tables ``utilisateurs`` et
``groupes``. Ainsi, chaque fois que vous créez ou supprimez un
groupe/utilisateur, la table Aro est mise à jour.

Nos contrôleurs et modèles sont maintenant prêts à recevoir des données
initiales et nos modèles ``Groupe`` et ``Utilisateur`` sont reliés à la
table Acl. Ajoutez donc quelques groupes et utilisateurs en utilisant
les formulaires créés avec Bake. J'ai créé les groupes suivants :

-  administrateurs
-  managers
-  utilisateurs

J'ai également créé un utilisateur dans chaque groupe, de façon à avoir
un utilisateur de chaque niveau d'accès pour les tests ultérieurs.
Ecrivez tout sur du papier ou utilisez des mots de passe faciles, de
façon à ne pas les oublier. Si vous faites un ``SELECT * FROM aros;``
depuis une commande mysql, vous devriez recevoir quelque chose comme
cela :

::

    +----+-----------+--------------+-------------+-------+------+------+
    | id | parent_id | model        | foreign_key | alias | lft  | rght |
    +----+-----------+--------------+-------------+-------+------+------+
    |  1 |      NULL | Groupe       |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Groupe       |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Groupe       |           3 | NULL  |    9 |   12 |
    |  4 |         1 | Utilisateur  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | Utilisateur  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | Utilisateur  |           3 | NULL  |   10 |   11 |
    +----+-----------+--------------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

Cela nous montre que nous avons 3 groupes et 3 utilisateurs. Les
utilisateurs sont imbriqués dans les groupes, ce qui signifie que nous
pouvons définir des permissions sur une base par groupe ou par
utilisateur.

Lorsque l'on modifie l'appartenance d'un utilisateur à un groupe, vous
devez mettre à jour l'ARO manuellement. Ce code doit être exécuté
lorsque l'on met à jour les informations de l'utilisateur :

::

    // Vérifie si le groupe de permission change
    $anciengroupeid = $this->Utilisateur->field('groupe_id');
    if ($anciengroupeid !== $this->data['Utilisateur']['groupe_id']) {
        $aro =& $this->Acl->Aro;
        $utilisateur = $aro->findByForeignKeyAndModel($this->data['Utilisateur']['id'], 'Utilisateur');
        $groupe = $aro->findByForeignKeyAndModel($this->data['Utilisateur']['groupe_id'], 'Groupe');
                    
        // Sauvegarde de la table ARO
        $aro->id = $utilisateur['Aro']['id'];
        $aro->save(array('parent_id' => $groupe['Aro']['id']));
    }

Créer les ACOs
==============

Maintenant que nous avons nos utilisateur et groupes (aros), nous
pouvons commencer à intégrer nos contrôleurs existants dans l'Acl et
définir des permissions pour nos groupes et utilisateurs, et permettre
la connexion / déconnexion.

Nos AROs sont automatiquement créés lorsque de nouveaux utilisateurs et
groupes sont ajoutés. Qu'en est-t'il de l'auto-génération des ACOs pour
nos contrôleurs et leurs actions ? Et bien, il n'y a malheureusement pas
de solution magique dans le *core* de CakePHP pour réaliser cela. Les
classes du *core* offrent cependant quelques moyens pour créer
manuellement les ACOs. Vous pouvez créer des objets ACO depuis le shell
Acl, ou alors vous pouvez utiliser l'``AclComposant``. Créer les Acos
depuis le shell ressemble à cela :

::

    cake acl create aco root controllers

En utilisant l'AclComposant, cela ressemblera à :

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controleurs'));
    $this->Acl->Aco->save();

Ces deux exemples vont créer notre *root* ou ACO de plus haut niveau,
qui sera appelé 'controleurs'. L'objectif de ce nœud *root* est
d'autoriser/interdire l'accès à l'échelle globale de l'application, et
permet l'utilisation de l'Acl dans des objectifs non liés aux
contrôleurs/actions, tels que la vérification des permissions d'un
enregistrement d'un modèle. Puisque nous allons utiliser un ACO *root*
global, nous devons faire une petite modification à la configuration de
l'``AuthComposant``. L'``AuthComposant`` doit être renseigné sur
l'existence de ce nœud *root*, de sorte que lors des contrôles de l'ACL,
le composant puisse utiliser le bon chemin de nœud lors de la recherche
contrôleurs/actions. Dans l'``AppController``, ajouter ce qui suit à
``beforeFilter`` :

::

    $this->Auth->actionPath = 'controleurs/';

Un outil automatique pour créer les ACOs
========================================

Comme mentionné précédemment, il n'y a pas de méthode toute faite pour
importer tous vos contrôleurs et toutes vos actions dans l'Acl.
Cependant, nous détestons tous faire des choses répétitives, comme
saisir au clavier des centaines d'actions dans une grosse application.
J'ai cuisiné une fonction automatique pour construire ma table Aco.
Cette fonction regardera dans chaque contrôleur de votre application.
Elle ajoutera toutes les méthodes non-privées et non spécifiques du
``Contrôleur`` dans la table Acl, rangées gentiment sous le nom de leur
contrôleur. Vous pouvez ajouter et exécuter ceci dans votre
``AppController`` ou tout autre contrôleur d'ailleurs, assurez-vous
simplement de le supprimer avant de mettre en production votre
application.

::

    /**
     * Reconstruit l'Acl à partir des contrôleurs actuels de l'application
     *
     * @return void
     */
        function buildAcl() {
            $log = array();
            
            $aco =& $this->Acl->Aco;
            $root = $aco->node('controllers');
            if (!$root) {
                $aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
                $root = $aco->save();
                $root['Aco']['id'] = $aco->id; 
                $log[] = 'Nœud Aco créé pour les contrôleurs';
            } else {
                $root = $root[0];
            }
            
            App::import('Core', 'File');
            $controleurs = Configure::listObjects('controller');
            $appIndex = array_search('App', $controleurs);
            if ($appIndex !== false ) {
                unset($controleurs[$appIndex]);
            }
            $methodes_de_base = get_class_methods('Controller');
            $methodes_de_base[] = 'buildAcl';
            
            // regarde dans chaque contrôleur de app/controllers
            foreach ($controleurs as $nomCtrl) {
                App::import('Controller', $nomCtrl);
                $classectrl = $nomCtrl . 'Controller';
                $methodes = get_class_methods($classectrl);
                
                // trouve / crée le nœud contrôleur
                $noeudControleur = $aco->node('controllers/' . $nomCtrl);
                if (!$noeudControleur) {
                    $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $nomCtrl));
                    $noeudControleur = $aco->save();
                    $noeudControleur['Aco']['id'] = $aco->id;
                    $log[] = 'Nœud Aco créé pour '. $nomCtrl;
                } else {
                    $noeudControleur = $noeudControleur[0];
                }
                
                // nettoie les méthodes. pour supprimer celles qui sont dans Controller et les actions privées.
                foreach ($methodes as $k => $methode) {
                    if (strpos($methode, '_', 0) === 0) {
                        unset($methodes[$k]);
                        continue;
                    }
                    if (in_array($methode, $methodes_de_base)) {
                        unset($methodes[$k]);
                        continue;
                    }
                    $noeudMethode = $aco->node('controllers/' . $nomCtrl . '/' . $methode);
                    if (!$noeudMethode) {
                        $aco->create(array('parent_id' => $noeudControleur['Aco']['id'], 'model' => null, 'alias' => $methode));
                        $noeudMethode = $aco->save();
                        $log[] = 'Noeud Aco créé pour '. $methode;
                    }
                }
            }
            debug($log);
        }

Maintenant lancez l'action dans votre navigateur, comme çà :
http://localhost/groups/buildacl, Ceci construira votre table ACO.

Vous pourriez vouloir conserver cette fonction sous la main, puisqu'elle
ajoutera les nouveaux ACOs pour tous les contrôleurs et actions qui sont
dans votre application, chaque fois que vous l'exécuterez. Elle ne
supprime pas les nœuds pour les actions qui n'existent plus. Maintenant
que le plus gros du travail est effectué, nous devons définir quelques
permissions et supprimer le code qui désactivait le composant ``Auth``
au départ.

Ensuite, une fois que vous avez réalisé ce travail, il se peut que vous
constatiez des problèmes d'accès aux plugins que vous utilisiez. Le truc
pour automatiser les ACOs de contrôleur des plugins, c'est que le
App::import doit suivre la convention pour le nommage de plugin
NomPlugin.NomControleurPlugin.

Donc ce dont nous avons besoin, c'est d'une fonction qui nous donnera
une liste des noms de contrôleur du plugin et de l'importer de la même
manière que nous l'avons fait pour les contrôleur normaux, dans le code
ci-dessus. La fonction ci-dessous réalisera justement cela :

::

    /**
     * Obtenir les noms des contrôleurs du plugin
     * 
     * Cette fonction prendra un tableau des noms de contrôleurs du plugin et
     * et s'assurera également que les contrôleurs sont disponibles pour nous permettre d'obtenir
     * les noms des méthodes, en faisant un App::import pour chaque contrôleur du plugin.
     *
     * @return array Liste des noms de plugin
     */
        function _getPluginControllerNames(){
            App::import('Core', 'File', 'Folder');
            $chemins = Configure::getInstance();
            $dossier =& new Folder();
            // change le répertoire pour celui des plugins
            $dossier->cd(APP . 'plugins');
            // récupère la liste des fichiers qui ont un nom se terminant par controller.php
            $fichiers = $dossier->findRecursive('.*_controller\.php');
            // Récupère la liste des plugins
            $plugins = Configure::listObjects('plugin');
            
            // boucle sur les contrôleurs que nous avons trouvés dans le répertoire des plugins
            foreach ($fichiers as $f => $nomFichier) {
                // récupère le nom de base du fichier
                $fichier = basename($nomFichier);
                // récupère le nom du contrôleur
                $fichier = Inflector::camelize(substr($fichier, 0, strlen($fichier) - strlen('_controller.php')));
                
                // boucle sur les plugins
                foreach ($plugins as $nomPlugin) {
                    if (preg_match('/^' . $nomPlugin . '/', $fichier)){
                        // premièrement, on se débarrasse du contrôleur App du plugin
                        // nous faisons cela parce que le contrôleur App n'est jamais appelé directement
                        if (preg_match('/^' . $nomPlugin . 'App/', $fichier)) {
                            unset($fichiers[$f]);
                        } else {
                            if (!App::import('Controller', $nomPlugin . '.' . $fichier)) {
                                debug('Erreur durant l'import de ' . $fichier . ' pour le plugin ' . $nomPlugin);
                            }
                            // maintenant on prépare le nom du Plugin
                            // ceci est nécessaire pour nous permettre de récupérer les noms de méthode
                            $fichiers[$f] = $fichier;
                        }
                        break;
                    }
                }
            }
            return $fichiers;
        }

Vous pouvez alors, soit modifier le code original pour inclure les
contrôleurs du plugin, en les mergant avec la liste que vous aviez
(placez ceci avant la boucle foreach):

::

    $plugins = $this->_getPluginControllerNames();
    $controleurs = array_merge($controleurs, $plugins);

Définir les permissions
=======================

Pour créer les permissions, à l'image de la création des ACOs, il n'y a
pas de solution magique et je n'en fournirai pas non plus. Pour
autoriser des AROs à accéder à des ACOs depuis l'interface en ligne de
commande, utilisez :

::

    cake acl grant $aroAlias $acoAlias [create|read|update|delete|'*']

\* doit être entouré de guillemets ('\*')

Pour autoriser avec ``AclComponent`` faites comme suit :

::

    $this->Acl->allow($aroAlias, $acoAlias);

Nous allons maintenant ajouter quelques déclarations
d'autorisation/interdiction. Ajoutez ce qui suit dans une fonction
temporaire de votre contrôleur ``UtilisateursController`` et rendez-vous
depuis votre navigateur à l'adresse pour l'exécuter. Si vous faites un
``SELECT * FROM aros_acos`` vous devriez voir une pile entière de 0 et
de 1. Une fois que vous avez vérifié que vos permissions sont définies,
supprimez la fonction.

::

    function initDB() {
        $groupe =& $this->Utilisateur->Groupe;
        // Autorise les admins à tout faire
        $groupe->id = 1;     
        $this->Acl->allow($groupe, 'controllers');
     
        // On autorise les responsables des billets (posts) et des widgets (gadgets)
        $groupe->id = 2;
        $this->Acl->deny($groupe, 'controllers');
        $this->Acl->allow($groupe, 'controllers/Posts');
        $this->Acl->allow($groupe, 'controllers/Gadgets');
     
        // On autorise aux utilisateurs seulement l'ajout et la modification de billets et gadgets
        $groupe->id = 3;
        $this->Acl->deny($groupe, 'controllers');        
        $this->Acl->allow($groupe, 'controllers/Posts/add');
        $this->Acl->allow($groupe, 'controllers/Posts/edit');        
        $this->Acl->allow($groupe, 'controllers/Gadgets/add');
        $this->Acl->allow($groupe, 'controllers/Gadgets/edit');
    }

Nous avons désormais configuré quelques règles basiques d'accès. Nous
avons autorisé les administrateurs à tout faire. Les responsables ont
accès à tout ce qui concerne les billets et gadgets. Alors que les
utilisateurs ne peuvent accéder qu'à l'ajout et la modification de
billets et de gadgets.

Nous avons du créer une référence au modèle ``Groupe`` et modifier son
id pour pouvoir spécifier l'ARO que nous voulions. Ceci est dû au
fonctionnement du comportement ``Acl``. ``AclBehavior`` ne fixe pas le
champ alias dans la table ``aros``, donc nous devons utiliser une
référence d'objet ou un tableau pour référencer l'ARO que nous voulons.

Vous avez pu remarqué que nous avions délibérément écarté index et voir
des permissions Acl. Nous allons rendre les actions voir et index
publiques dans ``PostsController`` et ``GadgetsController``. Cela permet
aux utilisateurs non-autorisés de voir ces pages, ce qui en fait des
pages publiques. Cependant, vous pouvez à tout moment supprimer ces
actions de ``AuthComponent::allowedActions`` et les permissions pour
voir et index redeviendront celles des Acl.

Maintenant nous voulons extraire la référence à ``Auth->allowedActions``
dans nos contrôleurs utilisateurs et groupes. Ensuite ajoutez ce qui
suit à vos contrôleurs Posts et Gadgets :

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('index', 'voir');
    }

Cela enlève le "basculement à off" que nous avions mis plus tôt dans les
contrôleurs utilisateurs et groupes et cela rend public l'accès aux
actions index et voir dans les contrôleurs Posts et Gadgets. Dans
``AppController::beforeFilter()`` ajoutez ce qui suit :

::

     $this->Auth->allowedActions = array('display');

Ce qui rend l'action "display" publique. Cela rendra notre action
PagesController::display() publique. Ceci est important car le plus
souvent le routage par défaut désigne cette action comme page d'accueil
de votre application.

Connexion
=========

Notre application est désormais sous contrôle d'accès, et toute
tentative d'accès à des pages non publiques vous redirigera vers la page
de connexion. Cependant, vous devrez créer une vue login avant que
quelqu'un puisse se connecter. Ajoutez ce qui suit à
``app/views/utilisateurs/login.ctp`` si vous ne l'avez pas déjà fait.

::

    <h2>Connexion</h2>
    <?php
    echo $form->create('Utilisateur', array('url' => array('controller' => 'utilisateurs', 'action' =>'login')));
    echo $form->input('Utilisateur.pseudo');
    echo $form->input('Utilisateur.motdepasse');
    echo $form->end('Connexion');
    ?>

Vous pouvez également vouloir ajouter dans votre mise en page un flash()
pour les messages d'Auth. Copiez la mise en page par défaut du cœur -
trouvable dans ``cake/libs/views/layouts/default.ctp`` - dans le dossier
layouts de votre application si vous ne l'avez pas encore fait. Dans
``app/views/layouts/default.ctp`` ajoutez

::

    $session->flash('auth');

Vous devriez maintenant pouvoir vous connecter et tout devrait
fonctionner auto-magiquement. Quand l'accès est refusé, les messages
d'Auth seront affichés si vous avez ajouté le code
``$session->flash('auth')``

Déconnexion
===========

Abordons maintenant la déconnexion. Nous avions plus tôt laissé cette
fonction vide, il est maintenant temps de la remplir. Dans
``UtilisateursController::logout()`` ajoutez ce qui suit :

::

    $this->Session->setFlash('Au revoir');
    $this->redirect($this->Auth->logout());

Cela définit un message flash en Session et déconnecte l'Utilisateur en
utilisant la méthode logout de Auth. La méthode logout de Auth supprime
tout simplement la clé d'authentification en session et retourne une url
qui peut être utilisée dans une redirection. Si il y a d'autres données
en sessions qui doivent être également effacées, ajoutez le code ici.

C'est fini
==========

Vous devriez maintenant avoir une application contrôlée par Auth et Acl.
Les permissions Utilisateurs sont définies au niveau du groupe, mais on
peut également les définir en même temps par utilisateur. Vous pouvez
également définir les permissions sur une base globale ou par contrôleur
et par action. De plus, vous avez un bloc de code réutilisable pour
étendre facilement vos tables ACO lorsque votre application grandit.
