Authentification
################

Les systèmes d'authentification utilisateur constituent une partie
courante de nombreuses applications Web. Dans CakePHP, il y a plusieurs
systèmes pour authentifier des utilisateurs, chacun fournissant des
options différentes. Au cœur du composant d'authentification, on vérifie
si l'utilisateur possède un compte sur le site. Si c'est le cas, le
composant donnera accès au site complet à l'utilisateur.

Ce composant peut être combiné avec le composant ACL (access control
lists) pour créer des niveaux d'accès plus complexes à l'intérieur d'un
site. Le composant ACL pourrait par exemple, vous permettre d'autoriser
un utilisateur à accéder aux zones publiques du site, tout en autorisant
un autre utilisateur d'accéder aux portions administratives protégées du
site.

Le composant AuthComponent de CakePHP peut servir à créer un tel système
rapidement et facilement. Regardons comment vous construiriez un système
d'authentification vraiment simple.

Comme n'importe quel composants, vous l'utilisez en ajoutant 'Auth' à la
liste des composants de votre contrôleur :

::

    class FooController extends AppController {
        var $components = array('Auth');

Ou ajoutez-le à votre AppController, ainsi tous vos contrôleurs
l'utiliseront :

::

    class AppController extends Controller {
        var $components = array('Auth');

Maintenant, il y a quelques conventions auxquelles penser quand on
utilise le composant AuthComponent. Par défaut, AuthComponent s'attend à
ce que vous ayez une table appelée 'users' avec des champs nommées
'username' et 'password'.

Dans certaines situations, les bases de données ne vous laissent pas
utiliser 'password' comme nom de colonne. Voyez `Définir les variables
du composant
Auth <https://book.cakephp.org/fr/view/1251/Setting-Auth-Component-Variables>`_,
pour trouver un exemple sur la façon de changer le nom par défaut des
champs afin de travailler avec votre propre environnement.

Définissons notre table users en utilisant le SQL suivant :

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(50),
        PRIMARY KEY (id)
    );

Quelque chose à garder à l'esprit lors de la création d'une table pour
stocker toutes vos données d'authentification d'un utilisateur, c'est
que le composant Auth s'attend à ce que la valeur du mot de passe stocké
dans la base de données soit hashée, plutôt que d'être stockée en texte
brut. Assurez-vous que le champ que vous utiliserez pour stocker les
mots de passe est assez long pour stocker le hash (40 caractères pour
SHA1, par exemple).

Si vous voulez ajouter un utilisateur manuellement dans la base de
données, la méthode la plus simple pour obtenir la bonne donnée est de
tenter de s'identifier et de regarder le log sql.

Pour le paramétrage le plus basique, il vous faudra seulement créer deux
actions dans votre contrôleur :

::

    class UsersController extends AppController {

        var $name = 'Users';
        var $components = array('Auth'); // Pas nécessaire si déclaré dans votre contrôleur app
        
        /**
        * Le Composant Auth fournit la fonctionnalité nécessaire
        * pour le login, donc vous pouvez laisser cette fonction vide.
        */
        function login() {
        }
        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }

Bien que vous puissiez laisser la fonction login() vide, vous avez
besoin de créer la template de vue login (sauvegardée dans
app/views/users/login.ctp). C'est toutefois la seule template de vue du
contrôleur Users que vous avez besoin de créer. L'exemple ci-dessous
présuppose que vous utilisez l'assistant Form :

::

    <?php
        echo $session->flash('auth');
        echo $form->create('User', array('action' => 'login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>

Cette vue crée un formulaire d'identification où vous entrez un nom
d'utilisateur et un mot de passe. Une fois que vous soumettez ce
formulaire, le composant Auth s'occupe du reste pour vous. Le message de
session flash affichera les notices générées par AuthComponent. Dès que
l'identification est réussie, l'enregistrement de la base de données
correspondant à l'utilisateur actuellement identifié est sauvegardé en
session.

Croyez le ou non, on en a terminé ! Voici comment écrire un système
d'authentification incroyablement simple, fondé sur la base de données,
avec le composant Auth. Cependant, il y a encore plus de choses que nous
pouvons faire. Intéressons-nous maintenant à quelques usages avancés du
composant.

Configurer les variables du composant Auth
==========================================

Chaque fois que vous voulez modifier une option par défaut du composant
Auth, vous devez le faire en créant une méthode beforeFilter() dans
votre contrôleur, puis en appelant les différentes méthodes
pré-existantes ou en configurant les variables du composant.

Par exemple, pour changer le nom du champ utilisé pour le mot de passe
de 'password' à 'mot\_secret', vous devez faire ceci :

::

    class UsersController extends AppController {
        var $components = array('Auth');

        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'mot_secret'
                );
        }
    }

Dans cette situation particulière, vous devrez aussi penser à changer le
nom du champ dans la vue correspondante !

Une autre utilisation commune des variables du composant Auth est
d'autoriser l'accès à certaines méthodes sans que l'utilisateur ne soit
identifié (par défaut, Auth interdit l'accès à toutes les actions sauf
aux méthodes login et logout).

Par exemple, si nous voulions autoriser tous les utilisateurs à accéder
aux méthodes index et voir (mais à aucune autre), nous ferions comme çà
:

::

    function beforeFilter() {
            $this->Auth->allow('index','voir');
    }

Afficher les messages d'erreur du composant Auth
================================================

Pour afficher les messages d'erreur que Auth renvoie, vous devez ajouter
le code suivant à votre vue. Dans ce cas, le message apparaîtra à la
suite des messages flash normaux.

Pour voir tous les messages flash normaux et les messages flash auth
dans toutes les vues, ajoutez les deux lignes suivantes au fichier
views/layouts/default.ctp, dans la section body, de préférence avant la
ligne content\_for\_layout.

::

    <?php
        $session->flash();
        $session->flash('auth');
    ?>

Pour personnaliser les messages d'erreur de Auth, placez le code suivant
dans le contrôleur AppController ou partout où vous avez placé les
paramètres de Auth.

::

    <?php
    $this->Auth->loginError = "Ce message apparaît lorsque les informations d'identifications sont mauvaises ";

    $this->Auth->authError = "Cette erreur se présente quand l'utilisateur tente d'accéder à une partie du site qui est protégée";
    ?>

Diagnostic des problèmes avec Auth
==================================

Il peut être parfois un peu difficile de diagnostiquer les problèmes
quand ça ne marche pas comme prévu, voici donc quelques points à se
rappeler.

*Hâchage du mot de passe*

Quand vous postez des informations à une action via un formulaire, le
composant Auth hâche (crypte) automatiquement le contenu de votre champ
mot de passe, si vous avez également une donnée dans le champ
'username'. Donc, si vous essayez de créer une page d'inscription
quelconque, assurez-vous que l'utilisateur ait rempli le champ
'confirmation du mot de passe' pour comparer les deux. Voici un exemple
de code :

::

    <?php 
    function enregistrer() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Hashage du mot de passe
-----------------------

Le hashage automatique de votre champ mot de passe se produit
**seulement** si les données postées contiennent à la fois les champs
'username' et 'password'.

Quand vous postez des informations à une action via un formulaire, le
composant Auth hashe (crypte) automatiquement le contenu de votre champ
mot de passe, si les données postées contiennent aussi le champ
'username'. Donc, si vous essayez de créer une page d'inscription
quelconque, assurez-vous que l'utilisateur ait rempli un champ
'confirmation du mot de passe' pour comparer les deux. Voici un exemple
de code :

::

    <?php 
    function enregistrer() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Changer la fonction de hâchage
==============================

Le composant Auth utilise la classe Security pour hacher un mot de
passe. La classe Security utilise le procédé SHA1 par défaut. Pour
changer la fonction de hash utilisée par le composant Auth, servez-vous
de la méthode ``setHash`` en lui passant ``md5``, ``sha1`` ou ``sha256``
comme premier et unique paramètre.

::

    Security::setHash('md5'); // ou sha1 ou sha256. 

La classe Security utilise une valeur *salt* (définie dans
/app/config/core.php) pour hacher le mot de passe.

Si vous voulez utiliser une logique de hachage du mot de passe
différente, autre que md5/sha1 ajouté au *salt* de l'application, vous
devrez surcharger le mécanisme standard de hashPassword. Vous aurez
besoin de faire cela si vous avez, par exemple, une base de données
existante, qui utilisait précédemment un procédé de hachage sans *salt*.
Pour faire cela, créez la méthode ``hashPasswords`` dans la classe à
laquelle vous souhaitez confier le hachage de vos mots de passe
(habituellement le modèle User) et définissez ``authenticate`` par
l'objet sur lequel vous réalisez l'authentification (habituellement,
c'est User), comme ceci :

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

Avec le code ci-dessus, la méthode hashPasswords() du modèle User sera
appelée chaque fois que Cake appelle AuthComponent::hashPasswords().

Les Méthodes du composant Auth
==============================

action
------

``action (string $action = ':controller/:action')``

Si vous utilisez les ACOs dans le cadre de votre structure ACL, vous
pouvez obtenir le chemin jusqu'au nœud ACO relié à un couple
contrôleur/action particulier :

::

        $acoNode = $this->Auth->action('users/delete');

Si vous ne passez pas de valeur, le couple contrôleur/action courant est
utilisé.

allow
-----

Si vous avez des actions dans votre contrôleur que vous n'avez pas
besoin d'authentifier (comme une action d'enregistrement d'un
utilisateur), vous pouvez ajouter des méthodes que le composant Auth
devrait ignorer. L'exemple suivant montre comment autoriser une action
intitulée 'enregistrer'.

::

    function beforeFilter() {
        ...
        $this->Auth->allow('enregistrer');
    }

Si vous souhaitez autoriser plusieurs actions qui échapperont à
l'authentification, passez-les en paramètres à la méthode allow() :

::

    function beforeFilter() {
        ...
        $this->Auth->allow('foo', 'bar', 'baz');
    }

Raccourci : vous pouvez aussi autoriser toutes les actions d'un
contrôleur en utilisant '\*'.

::

    function beforeFilter() {
        ...
        $this->Auth->allow('*');
    }

Si vous utilisez requestAction dans votre layout ou vos éléments, vous
devriez autoriser ces actions de façon à être capable d'ouvrir la page
de login proprement.

Le composant Auth suppose que les noms de vos actions respectent `les
conventions </fr/view/905/Considerations-sur-les-URL-pour-les-noms-de-Controleur>`_
et qu'elles sont "underscorées".

deny
----

Il peut arriver que vous vouliez retirer des actions de la liste des
actions autorisées (déclarée en utilisant $this->Auth->allow()). Voici
un exemple :

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }

        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }

            ...
        }

hashPasswords
-------------

``hashPasswords ($data)``

Cette méthode vérifie si ``$data`` contient les champs *username* et
*password*, comme spécifié par la variable ``$fields``, elle même
indexée par le nom du modèle, comme spécifié dans ``$userModel``. Si le
tableau ``$data`` contient à la fois *username* et *password*, la
méthode encode le champ *password* du tableau et retourne le tableau
``$data`` dans le même format. Cette fonction devrait être utilisée en
priorité pour les requêtes d'insertion ou de mise à jour de
l'utilisateur, quand le champ *password* est affecté.

::

        $data['User']['username'] = 'moi@moi.com';
        $data['User']['password'] = 'changemoi';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        print_r($hashedPasswords);
        /* retourne :
        Array
        (
            [User] => Array
            (
                [username] => moi@moi.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )

        */

Le champ *$hashedPasswords['User']['password']* sera maintenant encodé
en utilisant la fonction ``password`` du composant.

Si votre contrôleur utilise le composant Auth et que les données postées
contiennent les champs mentionnés ci-dessus, il encodera automatiquement
le mot de passe en utilisant cette fonction.

mapActions
----------

Si vous utilisez les Acl en mode CRUD, vous aimeriez peut-être assigner
certaines actions non-standards à chaque partie du CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('uneAction'),
            'read' => array('uneAction', 'uneAction2'),
            'update' => array('uneAction'),
            'delete' => array('uneAction')
        )
    );

login
-----

``login($data = null)``

Si vous souhaitez une authentification depuis un composant Ajax, vous
pouvez utiliser cette méthode pour authentifier manuellement un
utilisateur dans le système. Si vous ne passez aucune valeur pour
``$data``, les données reçues en POST seront alors automatiquement
passées au controlleur.

logout
------

Cette méthode fournit une manière rapide de désauthentifier quelqu'un et
de le rediriger là où il a besoin d'aller.

Cette méthode est également pratique si vous voulez proposer un lien
'Déconnexion' dans la partie membres de votre application.

Exemple :

::

    $this->redirect($this->Auth->logout());

password
--------

``password (string $password)``

Passez une chaîne à cette méthode et vous pourrez voir à quoi
ressemblera le mot de passe crypté. C'est une fonctionnalité essentielle
si vous créez un écran d'inscription où les utilisateurs doivent entrer
deux fois leur mot de passe pour le confirmer.

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {

        // Les mots de passe correspondent, on continue
        ...
    } else {
        $this->flash('Les mots de passe saisis ne correspondent pas', 'users/register');
    }

Le composant Auth encryptera automatiquement le champ ``password`` si le
champ ``username`` est aussi présent dans les données envoyées.

Cake ajoute un "grain de sécurité" (``Security.salt``) à votre chaîne de
mot de passe et crypte le tout ensuite. La fonction de cryptage utilisée
dépend de celle définie dans la classe utilitaire ``Security`` de
CakePHP (sha1 par défaut). Vous pouvez utiliser la fonction
``Security::setHash`` pour changer la méthode de cryptage. Le "grain de
sécurité" est configuré dans le fichier ``core.php`` de votre
application.

user
----

``user(string $key = null)``

Cette méthode fournit des informations sur l'utilisateur connecté. Ces
informations sont issues de la session. Par exemple :

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('Vous avez un accès administrateur');
    }

Elle peut aussi être utilisée pour obtenir des informations complètes
sur la session de l'utilisateur, de cette façon :

::

    $data['User'] = $this->Auth->user();

Si cette méthode renvoie null, l'utilisateur n'est pas connecté.

Dans les vues, vous pouvez utiliser l'assistant Session, pour retrouver
les informations sur l'utilisateur actuellement connecté :

::

    $session->read('Auth.User'); // renvoie l'ensemble des informations sur l'utilisateur
    $session->read('Auth.User.first_name') // renvoie la valeur d'un champ en particulier

La clé de session peut être différente en fonction du modèle configuré
pour utiliser Auth. Par exemple, si vous utilisez le modèle ``Compte``
au lieu de ``User``, alors la clé de session sera ``Auth.Compte``.

Variables du composant Auth
===========================

Désormais, il y a plusieurs variables liées à Auth que vous pouvez
utiliser. Habituellement, vous ajoutez ces configurations dans la
méthode beforeFilter() de votre contrôleur. Ou bien, si vous devez
appliquer ces règles dans tout le site, vous aurez envie de les ajouter
au beforeFilter() du contrôleur App.

userModel
---------

Vous ne voulez pas utiliser un modèle Utilisateur pour vous authentifier
? Pas de problème, modifiez ce comportement en configurant cette
variable avec le nom du modèle que vous voulez utiliser.

::

    <?php
        $this->Auth->userModel = 'Membre';
    ?>

fields
------

Pour outrepasser les champs utilisateur et mot de passe utilisés par
défaut pour l'authentification.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'motdepasse');
    ?>

userScope
---------

Utilisez cette propriété pour ajouter des contraintes supplémentaires
afin que l'authentification réussisse.

::

    <?php
        $this->Auth->userScope = array('Utilisateur.actif' => true);
    ?>

loginAction
-----------

Vous pouvez changer l'adresse de connexion par défaut */users/login* par
toute action de votre choix.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'membres', 'action' => 'login');
    ?>

loginRedirect
-------------

Le Composant Auth mémorise quelle paire contrôleur/action vous essayiez
d'obtenir avant que l'on vous demande de vous authentifier, en stockant
cette valeur dans la Session, sous la clé Auth.redirect. Cependant, si
cette valeur de session n'est pas définie (par exemple, si vous arrivez
à la page d'identification depuis un lien externe), alors l'utilisateur
sera redirigé à l'URL spécifiée dans loginRedirect.

Exemple :

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'membres', 'action' => 'accueil');
    ?>

logoutRedirect
--------------

Vous pouvez également spécifier où vous voulez que l'utilisateur soit
redirigé après sa déconnexion, ayant pour action par défaut l'action de
login.

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'membres', 'action' => 'logout');
    ?>

loginError
----------

Change le message d'erreur par défaut affiché lorsque quelqu'un ne
s'authentifie pas correctement.

::

    <?php
        $this->Auth->loginError = "Non, vous vous êtes trompé! Ce n'est pas le bon mot de passe!";
    ?>

authError
---------

Change le message d'erreur par défaut affiché lorsque quelqu'un essaye
d'accéder à une ressource ou une action qu'il n'est pas autorisé à
accéder.

::

    <?php
        $this->Auth->authError = "Désolé, vous n'avez pas les droits suffisants.";
    ?>

autoRedirect
------------

Normalement, le Composant Auth vous redirige automatiquement dès lors
qu'il vous authentifie. Parfois, vous souhaitez faire d'autres
vérifications avant de rediriger les utilisateurs :

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }

        ...

        function login() {
        //-- le code de cette fonction ne s'exécute que lorsque autoRedirect est défini à false (i.e. dans un beforeFilter).
            if ($this->Auth->user()) {
                if (!empty($this->data['Utilisateur']['se_souvenir_de_moi'])) {
                    $cookie = array();
                    $cookie['nom'] = $this->data['Utilisateur']['nom'];
                    $cookie['motdepasse'] = $this->data['Utilisateur']['motdepasse'];
                    $this->Cookie->write('Auth.Utilisateur', $cookie, true, '+2 weeks');
                    unset($this->data['Utilisateur']['se_souvenir_de_moi']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.Utilisateur');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Efface le message auth, seulement si nous l'utilisons
                        $this->Session->delete('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>

Le code de la fonction login ne s'exécutera pas *sauf si* vous
définissez $autoRedirect à *false* dans un beforeFilter. Le code présent
dans la fonction de login ne s'exécutera *qu'après* un essai
d'authentification. C'est le meilleur endroit pour déterminer si oui ou
non une connexion réussie a été effectuée par le Composant Auth (vous
aurez peut-être envie d'enregistrer la dernière date d'authentification
réussie, etc.).

authorize
---------

Normalement, le Composant Auth essaiera de vérifier que les critères de
login que vous avez saisis sont exacts, en les comparant à ce qui a été
stocké dans votre modèle utilisateur. Cependant, vous voudrez peut-être
certaines fois effectuer du traitement additionnel, en déterminant vos
propres critères. En assignant à cette variable l'une des nombreuses
valeurs possibles, vous pouvez faire différentes choses. En voici
quelques-unes, parmi les plus communes, que vous souhaiterez peut-être
utiliser.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>

Lorsque authorize est défini à 'controller', vous aurez besoin d'ajouter
une méthode appelée isAuthorized() à votre contrôleur. Cette méthode
vous permet de faire plus de vérifications d'authentification et de
retourner ensuite soit true, soit false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } else {
                    return false;
                }
            }

            return true;
        }
    ?>

Souvenez-vous que cette méthode sera inspectée, après que vous ayez déjà
passé la vérification d'authentification simple du modèle utilisateur.

::

    <?php
        $this->Auth->authorize = 'model';
    ?>

Vous ne souhaitez rien ajouter à votre contrôleur et peut-être utiliser
les ACO's ? Vous pouvez demander au Composant Auth d'appeler une
méthode, nommée isAuthorized(), dans votre modèle utilisateur, pour
faire le même genre de choses :

::

    <?php
        class Utilisateur extends AppModel {
            ...

            function isAuthorized($utilisateur, $controleur, $action) {

                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($utilisateur['Utilisateur']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>

Enfin, vous pouvez utiliser authorize avec les actions, comme montré
ci-dessous :

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>

En utilisant actions, Auth utilisera l'ACL et vérifiera avec
AclComponent::check(). Une fonction isAuthorized n'est pas nésessaire.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>

En utilisant crud, Auth utilisera l'ACL et vérifiera avec
AclComponent::check(). Les actions devraient correspondre aux CRUD (voir
`mapActions <https://book.cakephp.org/fr/view/813/mapActions>`_).

sessionKey
----------

Nom de la clé du tableau de session où l'enregistrement de l'utilisateur
actuellement authentifié est stocké.

Par défaut, vaut "Auth", donc si non spécifié, l'enregistrement est
stocké dans "Auth.{nom $modeleUtilisateur}".

::

    <?php
        $this->Auth->sessionKey = 'Autorise';
    ?>

ajaxLogin
---------

Si vous faites des requêtes Ajax ou Javascript qui nécessitent des
sessions authentifiées, donnez à cette variable le nom d'un élément de
vue que vous souhaiteriez rendre et retourner quand vous avez une
session invalide ou expirée.

Comme dans toute partie de CakePHP, soyez certains d'avoir jeté une œil
à `la classe
AuthComponent <https://api.cakephp.org/class/auth-component>`_ dans
l'API, pour avoir une vision plus approfondie du composant Auth.

authenticate
------------

Cette variable contient une référence à l'objet responsable du hashage
des mots de passe, s'il est nécessaire de changer/surcharger le
mécanisme de hashage des mots de passe par défaut. Voyez `Changer le
type de cryptage </fr/view/566/Changing-Encryption-Type>`_ pour plus
d'info.

actionPath
----------

Si vous utilisez le contrôle d'accès basé sur les actions, ceci définit
la façon dont sont déterminés les chemins vers les nœuds ACO de
l'action. Si, par exemple, tous les nœuds de contrôleur sont imbriqués
sous un nœud ACO nommé 'Controllers', $actionPath devrait être défini à
'Controllers/'.

5.2.6.15 flashElement
---------------------

Si vous voulez utiliser un autre layout pour votre message d'erreur
d'Authentification, vous pouvez le définir avec la variable
flashElement. Cet autre élément sera utilisé pour l'affichage.

::

    <?php
        $this->Auth->flashElement    = "message_erreur";
    ?>

allowedActions
==============

Set the default allowed actions to allow if setting the component to
'authorize' => 'controller'

::

    var $components = array(
      'Auth' => array(
        'authorize' => 'controller',
        'allowedActions' => array('index','view','display');
      )
    );

index, view, and display actions are now allowed by default.
