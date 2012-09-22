Application Simple contrôlée par Acl
####################################

Dans ce tutoriel, vous allez créer une application simple avec
:doc:`/core-libraries/components/authentication` et
:doc:`/core-libraries/components/access-control-lists`. Ce 
tutoriel suppose que vous avez lu le tutoriel du 
:doc:`/tutorials-and-examples/blog/blog`, et que vous êtes familier 
avec :doc:`/console-and-shells/code-generation-with-bake`. Vous devrez avoir 
un peu d'expérience avec CakePHP, et être familier avec les concepts MVC.
Ce tutoriel est une briève introduction à :php:class:`AuthComponent` et 
:php:class:`AclComponent`\.

Ce dont vous aurez besoin


#. Un serveur web opérationnel. Nous allons supposer que vous utilisez Apache, 
   cependant les instructions pour utiliser d'autres serveurs devraient être 
   très similaires. Nous pourrions avoir à jouer un peu avec la configuration 
   du serveur, mais la plupart de gens peuvent se procurer CakePHP et le faire 
   fonctionner sans qu'aucune configuration soit nécessaire.
#. Un serveur de base de données. Nous utiliserons MySQL dans ce tutoriel. 
   Vous aurez besoin de connaître suffisamment de chose en SQL, notamment 
   pour pouvoir créer une base de données : Cake prendra les rènes à partir 
   d'ici. 
#. Une connaissance des bases PHP. Plus vous aurez pratiqué la programmation 
   orientée objet, mieux ça vaudra : mais n'ayez pas peur si vous êtes un fan 
   de programmation procédurale.

Préparer notre Application
==========================

Premièrement, récupérons une copie récente de CakePHP

Pour obtenir un téléchargement à jour, visitez le projet CakePHP sur Github: 
http://github.com/cakephp/cakephp/downloads et téléchargez la version stable. 
Pour ce tutoriel vous aurez besoin de la dernière version 2.x.

Vous pouvez aussi dupliquer le dépôt en utilisant 
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Une fois que vous avez votre copie toute récente de Cake, configurez votre 
fichier "app/Config/database.php" et changez la valeur du Security.salt 
("grain" de sécurité) dans votre fichier "app/Config/core.php". A ce stade, 
nous construirons un schéma simple de base de données sur lequel bâtir notre 
application. Exécutez les commandes SQL suivantes sur votre base de données::

   CREATE TABLE utilisateurs (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       nom_utilisateur VARCHAR(255) NOT NULL UNIQUE,
       mot_de_passe CHAR(40) NOT NULL,
       group_id INT(11) NOT NULL,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE groups (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE posts (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       utilisateur_id INT(11) NOT NULL,
       title VARCHAR(255) NOT NULL,
       body TEXT,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE widgets (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       part_no VARCHAR(12),
       quantity INT(11)
   );

Ce sont les tables que nous utiliserons pour construire le reste de notre 
application. Une fois que nous avons la structure des tables dans notre base 
de données, nous pouvons commencer à cuisiner. Utilisez 
:doc:`/console-and-shells/code-generation-with-bake` pour créer 
rapidement vos modèles, contrôleurs et vues. 

Pour utiliser cake bake, appelez "cake bake all" et cela listera les 4 tables 
que vous avez inseré dans mySQL. Séléctionnez "1. Group", et suivez ce qui 
est écrit sur l'écran. Répétez pour les 3 autres tables, et cela générera 
les 4 contrôleurs, modèles et vues pour vous.

Evitez d'utiliser le Scaffold ici. La génération des ACOs en sera sérieusement 
affectée si vous cuisinez les contrôleurs avec la fonctionnalité Scaffold.

Pendant la cuisson des Modèles, cake détectera auto-magiquement les 
associations entre vos Modèles (ou relations entre vos tables). Laissez 
Cake remplir les bonnes associations hasMany et belongsTo. Si vous êtes invité 
à choisir hasOne ou hasMany, d'une manière générale, vous aurez besoin d'une 
relation hasMany (seulement) pour ce tutoriel.

Laissez de côté les routing admin pour le moment, c'est déjà un assez compliqué 
sujet comme cela sans eux. Assurez-vous aussi de **ne pas** ajouter les 
Composants Acl et Auth à aucun de vos contrôleurs quand vous les cuisinez.
Nous le ferons bien assez tôt. Vous devriez maintenant avoir des modèles, 
contrôleurs, et des vues cuisinés pour vos utilisateurs, groupes, posts 
et widgets.

Préparer l'ajout d'Auth
=======================

Nous avons maintenant une application CRUD (Créer Lire Editer Supprimer) 
fonctionnelle. Bake devrait avoir mis en place toutes les relations dont 
nous avons besoin, si ce n'est pas le cas, faites-le maintenant. Il y a 
quelques autres éléments qui doivent être ajoutés avant de pouvoir ajouter 
les composants Auth et Acl. Tout d'abord, ajoutez une action login et une 
action logout à votre ``UtilisateursController``::

    <?php
    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                $this->redirect($this->Auth->redirect());
            } else {
                $this->Session->setFlash('Votre nom d\'utilisateur ou mot de passe sont incorrects.');
            }
        }
    }
     
    public function logout() {
        //Laissez vide pour le moment.
    }

Ensuite créer le fichier de vue suivant pour la connexion 
``app/View/Users/login.ctp``::

    <?php
    echo $this->Form->create('Utilisateur', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'nom_utilisateur',
        'mot_de_passe'
    ));
    echo $this->Form->end('Connexion');

Next we'll have to update our User model to hash passwords before they go into
the database.  Storing plaintext passwords is extremely insecure and
AuthComponent will expect that your passwords are hashed.  In
``app/Model/User.php`` add the following::

    <?php
    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // other code.

        public function beforeSave() {
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
            return true;
        }
    }

Next we need to make some modifications to ``AppController``. If
you don't have ``/app/Controller/AppController.php``, create it. Note that
this goes in /app/Controller/, not /app/app_controllers.php. Since we want our entire
site controlled with Auth and Acl, we will set them up in
``AppController``::

    <?php
    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );
        public $helpers = array('Html', 'Form', 'Session');
    
        public function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }

Before we set up the ACL at all we will need to add some users and
groups. With :php:class:`AuthComponent` in use we will not be able to access
any of our actions, as we are not logged in. We will now add some
exceptions so :php:class:`AuthComponent` will allow us to create some groups
and users. In **both** your ``GroupsController`` and your
``UsersController`` Add the following::

    <?php
    public function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allow('*');
    }

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a
few users and groups into our database. Don't add any users or
groups just yet though.

Initialiser les tables Acl dans la BdD
======================================

Avant de créer des utilisateurs et groupes, nous voulons les connecter à l'Acl. 
Cependant, nous n'avons pour le moment aucune table d'Acl et si vous essayez 
de visualiser les pages maintenant, vous aurez une erreur de table manquante 
("Error: Database table acos for model Aco was not found.").
Pour supprimer ces erreurs, nous devons exécuter un fichier de schéma. Dans un 
shell, exécutez la commande suivante::

    ./Console/cake schema create DbAcl
    
Ce schéma vous invite à supprimer et créer les tables. Répondez Oui (Yes) à la 
suppression et création des tables.

Si vous n'avez pas d'accès au shell, ou si vous avez des problèmes pour 
utiliser la console, vous pouvez exécuter le fichier sql se trouvant à 
l'emplacement suivant : 
/chemin/vers/votre/app/Config/Schema/db\_acl.sql. 

Avec les contrôleurs configurés pour l'entrée de données et les tables Acl 
initialisées, nous sommes prêts à commencer, n'est-ce-pas ? Pas tout à fait, 
nous avons encore un peu de travail à faire dans les modèles utilisateurs et 
groupes. Concrètement, faire qu'ils s'attachent auto-magiquement à l'Acl.

Agir comme un requêteur
=======================

Pour que Auth et Acl fonctionnent correctement, nous devons associer nos 
utilisateurs et groupes dans les entrées de nos tables Acl. Pour ce faire, 
nous allons utiliser le comportement ``AclBehavior``. Le comportement 
``AclBehavior`` permet de connecter automagiquement des modèles avec les 
tables Acl. Son utilisation requiert l'implémentation de ``parentNode()`` 
dans vos modèles. Dans notre Modèle ``Utilisateur`` nous allons ajouter le 
code suivant ::

    <?php
    class Utilisateur extends Model {
        public $name = 'Utilisateur';
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));
         
        public function parentNode() {
            if (!$this->id && empty($this->data)) {
                return null;
            }
            if (isset($this->data['Utilisateur']['group_id'])) {
                $groupId = $this->data['Utilisateur']['group_id'];
            } else {
                $groupId = $this->field('group_id');
            }
            if (!$groupId) {
                return null;
            } else {
                return array('Group' => array('id' => $groupId));
            }
        }
    }

Ensuite dans notre Modèle ``Group`` ajoutons ce qui suit::

    <?php
    class Group extends Model {
        public $actsAs = array('Acl' => array('type' => 'requester'));
         
        public function parentNode() {
            return null;
        }
    }

Cela permet de lier les modèles ``Group`` et ``Utilisateur`` à l'Acl, et de 
dire à CakePHP que chaque fois que l'on créé un Utilisateur ou un Groupe, nous 
voulons également ajouter une entrée dans la table ``aros``. Cela fait de la 
gestion des Acl un jeu d'enfant, puisque vos AROs se lient de façon 
transparente à vos tables ``utilisateurs`` et ``groups``. Ainsi, chaque fois 
que vous créez ou supprimez un groupe/utilisateur, la table Aro est mise à jour.

Nos contrôleurs et modèles sont maintenant prêts à recevoir des données 
initiales et nos modèles ``Group`` et ``Utilisateur`` sont reliés à la table 
Acl. Ajoutez donc quelques groupes et utilisateurs en utilisant les 
formulaires créés avec Bake en allant sur http://exemple.com/groups/add et 
http://exemple.com/utilisateurs/add. J'ai créé les groupes suivants :

-  administrateurs
-  managers
-  utilisateurs

J'ai également créé un utilisateur dans chaque groupe, de façon à avoir un 
utilisateur de chaque niveau d'accès pour les tests ultérieurs. Ecrivez tout 
sur du papier ou utilisez des mots de passe faciles, de façon à ne pas les 
oublier. Si vous faites un `SELECT * FROM aros;`` depuis une commande mysql, 
vous devriez recevoir quelque chose comme cela::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

Cela nous montre que nous avons 3 groupes et 3 utilisateurs. Les utilisateurs 
sont imbriqués dans les groupes, ce qui signifie que nous pouvons définir des 
permissions sur une base par groupe ou par utilisateur.

ACL basé sur les groupe uniquement
----------------------------------

Dans la cas où nous souhaiterions simplifier en utilisant les permissions 
par groupes, nous avons besoin d'implémenter ``bindNode()`` dans le modèle 
``Utilisateur``::

    <?php
    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['Utilisateur']['group_id']);
    }

Cette méthode va demander à ACL de ne pas vérifier les AROs de ``Utilisateur`` 
mais de seulement vérifier les AROs de ``Group``.

Chaque utilisateur devra être assigné à un ``group_id`` pour que ceci fontionne 
correctement.

Dans ce cas, notre table `aros`` va ressembler à ceci ::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

Créer les ACOs (Access Control Objects)
=======================================

Maintenant que nous avons nos utilisateur et groupes (aros), nous pouvons 
commencer à intégrer nos contrôleurs existants dans l'Acl et définir des 
permissions pour nos groupes et utilisateurs, et permettre la 
connexion / déconnexion.

Nos AROs sont automatiquement créés lorsque de nouveaux utilisateurs et 
groupes sont ajoutés. Qu'en est-t'il de l'auto-génération des ACOs pour 
nos contrôleurs et leurs actions ? Et bien, il n'y a malheureusement pas 
de solution magique dans le core de CakePHP pour réaliser cela. Les classes 
du core offrent cependant quelques moyens pour créer manuellement les ACOs. 
Vous pouvez créer des objets ACO depuis le shell Acl, ou alors vous pouvez 
utiliser l'``AclComponent``. Créer les Acos depuis le shell ressemble à cela::

    ./Console/cake acl create aco root controllers

En utilisant l'AclComposant, cela ressemblera à::

    <?php
    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Ces deux exemples vont créer notre root ou ACO de plus haut niveau, qui sera 
appelé 'controllers'. L'objectif de ce nœud root est d'autoriser/interdire 
l'accès à l'échelle globale de l'application, et permet l'utilisation de l'Acl 
dans des objectifs non liés aux contrôleurs/actions, tels que la vérification 
des permissions d'un enregistrement d'un modèle. Puisque nous allons utiliser 
un ACO root global, nous devons faire une petite modification à la 
configuration de ``AuthComponent``. L'``AuthComponent`` doit être renseigné sur 
l'existence de ce nœud root, de sorte que lors des contrôles de l'ACL, le 
composant puisse utiliser le bon chemin de nœud lors de la recherche 
contrôleurs/actions. Dans l'``AppController``, assurez vous que le tableau 
``$components`` contient l'``actionPath`` défini avant.

Continuez à :doc:`part-two` pour continuer le tutoriel.


.. meta::
    :title lang=fr: Application Simple contrôlée par Acl
    :keywords lang=fr: librairies du coeur,incrémentation auto,programmation orientée objet,schéma de base de données,requêtes sql,classe php,version stable,génération de code,serveur de base de données,configuration du serveur,reins,contrôle d'accès,shells,mvc,authentification,serveur web,cakephp,serveurs,checkout,apache
