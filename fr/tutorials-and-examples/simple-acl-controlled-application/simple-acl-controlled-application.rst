Application Simple contrôlée par Acl
####################################

.. note::

    Ce n'est pas un tutoriel pour débutants. Si vous commencez juste avec
    CakePHP, nous vous conseillons d'avoir un meilleur expérience d'ensemble
    des fonctionnalités du framework avant d'essayer ce tutoriel.

Dans ce tutoriel, vous allez créer une application simple avec
:doc:`/core-libraries/components/authentication` et
:doc:`/core-libraries/components/access-control-lists`. Ce tutoriel suppose que
vous avez lu le tutoriel du :doc:`/tutorials-and-examples/blog/blog`, et que
vous êtes familier avec :doc:`/console-and-shells/code-generation-with-bake`.
Vous devrez avoir un peu d'expérience avec CakePHP, et être familier avec les
concepts MVC. Ce tutoriel est une briève introduction à
:php:class:`AuthComponent` et :php:class:`AclComponent`.

Ce dont vous aurez besoin

#. Un serveur web opérationnel. Nous allons supposer que vous utilisez Apache,
   cependant les instructions pour utiliser d'autres serveurs devraient être
   très similaires. Nous pourrions avoir à jouer un peu avec la configuration
   du serveur, mais la plupart de gens peuvent se procurer CakePHP et le faire
   fonctionner sans qu'aucune configuration soit nécessaire.
#. Un serveur de base de données. Nous utiliserons MySQL dans ce tutoriel.
   Vous aurez besoin de connaître suffisamment de chose en SQL, notamment
   pour pouvoir créer une base de données : CakePHP prendra les rènes à partir
   d'ici.
#. Une connaissance des bases PHP. Plus vous aurez pratiqué la programmation
   orientée objet, mieux ça vaudra : mais n'ayez pas peur si vous êtes un fan
   de programmation procédurale.

Préparer notre Application
==========================

Premièrement, récupérons une copie récente de CakePHP

Pour obtenir un téléchargement à jour, visitez le projet CakePHP sur Github:
https://github.com/cakephp/cakephp/tags et téléchargez la version stable.
Pour ce tutoriel vous aurez besoin de la dernière version 2.x.

Vous pouvez aussi dupliquer le dépôt en utilisant
`git <http://git-scm.com/>`_::

    git clone git://github.com/cakephp/cakephp.git.

Une fois que vous avez votre copie toute récente de CakePHP, changez votre
branche vers la dernière version de 2.0, configurez votre fichier
``database.php`` et changez la valeur du Security.salt ("grain" de sécurité)
dans votre fichier ``app/Config/core.php``. A ce stade, nous construirons un
schéma simple de base de données sur lequel bâtir notre application. Exécutez
les commandes SQL suivantes sur votre base de données::

   CREATE TABLE users (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       password CHAR(40) NOT NULL,
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
       user_id INT(11) NOT NULL,
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
rapidement vos models, controllers et vues.

Pour utiliser cake bake, appelez ``cake bake all`` et cela listera les 4 tables
que vous avez inseré dans MySQL. Séléctionnez "1. Group", et suivez ce qui
est écrit sur l'écran. Répétez pour les 3 autres tables, et cela générera
les 4 controllers, models et vues pour vous.

Evitez d'utiliser le Scaffold ici. La génération des ACOs en sera sérieusement
affectée si vous cuisinez les controllers avec la fonctionnalité Scaffold.

Pendant la cuisson des Models, cake détectera auto-magiquement les
associations entre vos Models (ou relations entre vos tables). Laissez
CakePHP remplir les bonnes associations hasMany et belongsTo. Si vous êtes invité
à choisir hasOne ou hasMany, d'une manière générale, vous aurez besoin d'une
relation hasMany (seulement) pour ce tutoriel.

Laissez de côté les routing admin pour le moment, c'est déjà un assez compliqué
sujet comme cela sans eux. Assurez-vous aussi de **ne pas** ajouter les
Components Acl et Auth à aucun de vos controllers quand vous les cuisinez.
Nous le ferons bien assez tôt. Vous devriez maintenant avoir des models,
controllers, et des vues cuisinés pour vos users, groups, posts
et widgets.

Préparer l'ajout d'Auth
=======================

Nous avons maintenant une application CRUD (Créer Lire Editer Supprimer)
fonctionnelle. Bake devrait avoir mis en place toutes les relations dont
nous avons besoin, si ce n'est pas le cas, faites-le maintenant. Il y a
quelques autres éléments qui doivent être ajoutés avant de pouvoir ajouter
les components Auth et Acl. Tout d'abord, ajoutez une action login et une
action logout à votre ``UsersController``::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Session->setFlash(__('Votre nom d\'user ou mot de passe sont incorrects.'));
            }
        }
    }

    public function logout() {
        //Laissez vide pour le moment.
    }

Ensuite créer le fichier de vue suivant pour la connexion
``app/View/Users/login.ctp``::

    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'username',
        'password'
    ));
    echo $this->Form->end('Connexion');

Ensuite nous devrons mettre à jour notre model User pour hasher les passwords
avant qu'ils aillent dans la base de données. Stocker les passwords en brut
est extrémement non sécurisé et AuthComponent va s'attendre à ce que vos
passwords soient hashés. Dans ``app/Model/User.php`` ajoutez ce qui suit::

    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // autre code.

        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
            return true;
        }
    }

Ensuite nous devons faire quelques modifications dans ``AppController``. Si
vous n'avez pas ``/app/Controller/AppController.php``, créez le. Puisque nous
voulons que notre site entier soit contrôllé avec Auth et Acl, nous allons
les définir en haut dans ``AppController``::

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
            $this->Auth->loginAction = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->logoutRedirect = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->loginRedirect = array(
              'controller' => 'posts',
              'action' => 'add'
            );
        }
    }

Avant de configurer ACL, nous aurons besoin d'ajouter quelques users
et groups. Avec :php:class:`AuthComponent` en utilisation, nous ne serons pas
capable d'accéder à aucune de nos actions, puisque nous ne sommes pas
connectés. Nous allons maintenant ajouter quelques exceptions ainsi
:php:class:`AuthComponent` va nous autoriser à créer quelques groups
et users. Dans les **deux**, votre ``GroupsController`` et votre
``UsersController``, ajoutez ce qui suit::

    public function beforeFilter() {
        parent::beforeFilter();

        // Pour CakePHP 2.0
        $this->Auth->allow('*');

        // Pour CakePHP 2.1 et supérieurs
        $this->Auth->allow();
    }

Ces lignes disent à AuthComponent d'autoriser les accès publiques à toutes les
actions. C'est seulement temporaire et ce sera retiré une fois que nous aurons
quelques users et groups dans notre base de données. N'ajoutez pourtant encore
aucun user ou group.

Initialiser les tables Acl dans la BdD
======================================

Avant de créer des users et groups, nous voulons les connecter à l'Acl.
Cependant, nous n'avons pour le moment aucune table d'Acl et si vous essayez
de visualiser les pages maintenant, vous aurez peut-être une erreur de table
manquante ("Error: Database table acos for model Aco was not found.").
Pour supprimer ces erreurs, nous devons exécuter un fichier de schéma. Dans un
shell, exécutez la commande suivante::

    ./Console/cake schema create DbAcl

Ce schéma vous invite à supprimer et créer les tables. Répondez Oui (Yes) à la
suppression et création des tables.

Si vous n'avez pas d'accès au shell, ou si vous avez des problèmes pour
utiliser la console, vous pouvez exécuter le fichier sql se trouvant à
l'emplacement suivant :
/chemin/vers/votre/app/Config/Schema/db\_acl.sql.

Avec les controllers configurés pour l'entrée de données et les tables Acl
initialisées, nous sommes prêts à commencer, n'est-ce-pas ? Pas tout à fait,
nous avons encore un peu de travail à faire dans les models users et
groups. Concrètement, faire qu'ils s'attachent auto-magiquement à l'Acl.

Agir comme un requêteur
=======================

Pour que Auth et Acl fonctionnent correctement, nous devons associer nos
users et groups dans les entrées de nos tables Acl. Pour ce faire,
nous allons utiliser le behavior ``AclBehavior``. Le behavior
``AclBehavior`` permet de connecter automagiquement des models avec les
tables Acl. Son utilisation requiert l'implémentation de ``parentNode()``
dans vos models. Dans notre Model ``User`` nous allons ajouter le
code suivant::

    class User extends Model {
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            if (!$this->id && empty($this->data)) {
                return null;
            }
            if (isset($this->data['User']['group_id'])) {
                $groupId = $this->data['User']['group_id'];
            } else {
                $groupId = $this->field('group_id');
            }
            if (!$groupId) {
                return null;
            }
            return array('Group' => array('id' => $groupId));
        }
    }

Ensuite dans notre Model ``Group`` ajoutons ce qui suit::

    class Group extends Model {
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            return null;
        }
    }

Cela permet de lier les models ``Group`` et ``User`` à l'Acl, et de
dire à CakePHP que chaque fois que l'on créé un User ou un Group, nous
voulons également ajouter une entrée dans la table ``aros``. Cela fait de la
gestion des Acl un jeu d'enfant, puisque vos AROs se lient de façon
transparente à vos tables ``users`` et ``groups``. Ainsi, chaque fois
que vous créez ou supprimez un groupe/user, la table Aro est mise à jour.

Nos controllers et models sont maintenant prêts à recevoir des données
initiales et nos models ``Group`` et ``User`` sont reliés à la table
Acl. Ajoutez donc quelques groups et users en utilisant les
formulaires créés avec Bake en allant sur http://exemple.com/groups/add et
http://exemple.com/users/add. J'ai créé les groups suivants :

-  administrateurs
-  managers
-  users

J'ai également créé un user dans chaque groupe, de façon à avoir un
user de chaque niveau d'accès pour les tests ultérieurs. Ecrivez tout
sur du papier ou utilisez des mots de passe faciles, de façon à ne pas les
oublier. Si vous faites un `SELECT * FROM aros;`` depuis une commande MySQL,
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

Cela nous montre que nous avons 3 groups et 3 users. Les users
sont imbriqués dans les groups, ce qui signifie que nous pouvons définir des
permissions sur une base par groupe ou par user.

ACL basé uniquement sur les groupes
-----------------------------------

Dans la cas où nous souhaiterions simplifier en utilisant les permissions
par groups, nous avons besoin d'implémenter ``bindNode()`` dans le model
``User``::

    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

Ensuite modifiez le ``actsAs`` pour le model ``User`` et désactivez la directive
requester::

    public $actsAs = array('Acl' => array('type' => 'requester', 'enabled' => false));

Ces deux changements vont dire à ACL de ne pas vérifier les Aros des ``User``
Aro's et de vérifier seulement les Aros de ``Group``.

Note: Chaque user devra être assigné à un ``group_id`` pour que ceci fontionne
correctement.

Maintenant la table `aros`` va ressembler à ceci::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

Note: Si vous avez suivi le tutoriel jusqu'ici, vous devez effacer vos tables,
y compris ``aros``, ``groups`` et ``users``, et créer les tables groups et users
à nouveau de zéro pour obtenir la table ``aros`` ci-dessus.

Créer les ACOs (Access Control Objects)
=======================================

Maintenant que nous avons nos users et groups (aros), nous pouvons
commencer à intégrer nos controllers existants dans l'Acl et définir des
permissions pour nos groups et users, et permettre la
connexion / déconnexion.

Nos AROs sont automatiquement créés lorsque de nouveaux users et
groups sont ajoutés. Qu'en est-t'il de l'auto-génération des ACOs pour
nos controllers et leurs actions ? Et bien, il n'y a malheureusement pas
de solution magique dans le core de CakePHP pour réaliser cela. Les classes
du core offrent cependant quelques moyens pour créer manuellement les ACOs.
Vous pouvez créer des objets ACO depuis le shell Acl, ou alors vous pouvez
utiliser l'``AclComponent``. Créer les Acos depuis le shell ressemble à cela::

    ./Console/cake acl create aco root controllers

En utilisant l'AclComponent, cela ressemblera à::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Ces deux exemples vont créer notre root ou ACO de plus haut niveau, qui sera
appelé 'controllers'. L'objectif de ce nœud root est d'autoriser/interdire
l'accès à l'échelle globale de l'application, et permet l'utilisation de l'Acl
dans des objectifs non liés aux controllers/actions, tels que la vérification
des permissions d'un enregistrement d'un model. Puisque nous allons utiliser
un ACO root global, nous devons faire une petite modification à la
configuration de ``AuthComponent``. L'``AuthComponent`` doit être renseigné sur
l'existence de ce nœud root, de sorte que lors des contrôles de l'ACL, le
component puisse utiliser le bon chemin de nœud lors de la recherche
controllers/actions. Dans l'``AppController``, assurez vous que le tableau
``$components`` contient l'``actionPath`` défini avant::

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

Continuez à :doc:`part-two` pour continuer le tutoriel.

.. meta::
    :title lang=fr: Application Simple contrôlée par Acl
    :keywords lang=fr: librairies du coeur,incrémentation auto,programmation orientée objet,schéma de base de données,requêtes sql,classe php,version stable,génération de code,serveur de base de données,configuration du serveur,reins,contrôle d'accès,shells,mvc,authentification,serveur web,cakephp,serveurs,checkout,apache
