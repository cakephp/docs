Authentification
################

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = array())

Identifier, authentifier et autoriser des utilisateurs constitue une
partie courante de nombreuses applications Web. Le component Auth de
CakePHP fournit un moyen modulaire d'accomplir cette tâche.
Le component Auth vous permet de combiner l'authentification des objets,
l'autorisation des objets pour créer un moyen souple pour permettre
l'identification et le contrôle des autorisations de l'utilisateur.

.. _authentication-objects:

Authentification
================

L'authentification est le processus d'identification des utilisateurs
par des identifiants de connexion définis et permet de s'assurer que
l'utilisateur est bien celui qu'il prétend être. En général, cela se fait
à travers un nom d'utilisateur et un mot de passe, qui sont comparés
à une liste d'utilisateurs connus.
Dans CakePHP, il y a plusieurs façons intégrées pour l'authentification des
utilisateurs enregistrés dans votre application.

* ``FormAuthenticate`` vous permet d'authentifier les utilisateurs sur la
  base de formulaire de donnée POST. Habituellement il s'agit d'un formulaire
  de connexion ou les utilisateurs entrent des informations.
* ``BasicAuthenticate`` vous permet d'identifier les utilisateurs en
  utilisant l'authentification Basic HTTP.
* ``DigestAuthenticate`` vous permet d'identifier les utilisateurs en
  utilisant l'authentification Digest HTTP.

Par défaut Le component Auth (``AutComponent``) utilise ``FormAuthenticate``.

Choisir un type d'Authentification
----------------------------------

En général, vous aurez envie d'offrir l'authentification par formulaire.
C'est le plus facile pour les utilisateurs utilisant un navigateur Web.
Si vous construisez une API ou un service web, vous aurez peut-être à envisager
l'utilisation de l'authentification de base ou l'authentification Digest.
L'élément clé qui différencie l'authentification digest de l'authentification
basic est la plupart du temps liée à la façon dont les mots de passe sont gérés.
Avec l'authentification basic, le nom d'utilisateur et le mot de passe sont
transmis en clair sur le serveur. Cela rend l'authentification de base non
appropriée pour des applications sans SSL, puisque vous exposeriez sensiblement
vos mots de passe.
L'authentification Digest utilise un hachage condensé du nom d'utilisateur,
mot de passe, et quelques autres détails. Cela rend l'authentification
Digest plus approprié pour des applications sans cryptage SSL.

Vous pouvez également utiliser des systèmes d'authentification comme
OpenID, mais openid ne fait pas parti du cœur de CakePHP.

Configuration des gestionnaires d'authentification
--------------------------------------------------

Vous configurez les gestionnaires d'authentification en
utilisant ``$this->Auth->authenticate``.
Vous pouvez configurer un ou plusieurs gestionnaires pour l'authentification.
L'utilisation de plusieurs gestionnaires d'authentification vous permet de
supporter les différentes méthodes de connexion des utilisateurs.
Quand les utilisateurs se connectent, les gestionnaires d'authentification
sont utilisés dans l'ordre auquel ils ont été déclarés.
Une fois qu'un gestionnaire est capable d'identifier un utilisateur, les autres
gestionnaires ne seront pas utilisés. Inversement, vous pouvez mettre un terme
à tous les authentifications en levant une exception.Vous pourrez traiter
toutes les exceptions levées, et les gérer comme désiré.

Vous pouvez configurer le gestionnaire d'authentification dans les tableaux
``beforeFilter`` ou  ``$components``.
Vous pouvez passer l'information de configuration dans chaque objet
d'authentification en utilisant un tableau::

    // Configuration de base
    $this->Auth->config('authenticate', ['Form']);

    // Passer la configuration
    $this->Auth->config('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

Dans le deuxième exemple vous pourrez noter que nous avons à déclarer
la clé ``userModel`` deux fois. Pour vous aider à garder un code "propre",
vous pouvez utiliser la clé ``all``. Cette clé spéciale vous permet
de définir les réglages qui sont passés à chaque objet attaché.
La cle ``all`` est aussi utilisée comme cela
``AuthComponent::ALL``::

    // Passer la configuration en utilisant 'all'
    $this->Auth->config('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

Dans l'exemple ci-dessus, à la fois ``Form`` et ``Basic`` prendront
les paramétrages définis dans la clé "all".
Tous les paramètres transmis à un objet d'authentification particulier
remplaceront la clé correspondante dans la clé 'all'.
Les objets d'authentification supportent les clés de configuration suivante.

- ``fields`` Les champs à utiliser pour identifier un utilisateur.
- ``userModel`` Le nom du model de l'utilisateur, par défaut User.
- ``scope`` Des conditions supplémentaires à utiliser lors de la recherche et
  l'authentification des utilisateurs, ex ``array('User.is_active' => 1)``.
- ``passwordHasher`` La classe de hashage de mot de Passe. Par défaut à ``Blowfish``.

Configurer différents champs pour l'utilisateur dans le tableau ``$components``::

    // Passer la configuration dans le tableau $components
    public $components = [
        'Auth' => [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ]
        ]
    ];

Ne mettez pas d'autre clés de configuration de Auth(comme authError,
loginAction etc). Ils doivent se trouver au même niveau que la clé
d'authentification. La configuration ci-dessus avec d'autres configurations
ressemblerait à quelque chose comme.::

    // Passage de paramètre dans le tableau $components
    public $components = [
        'Auth' => [
            'loginAction' => [
                'controller' => 'users',
                'action' => 'login',
                'plugin' => 'users'
            ],
            'authError' => 'Did you really think you are allowed to see that?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ]
        ]
    ];

En plus de la configuration courante, l'authentification de base
prend en charge les clés suivantes:

- ``realm`` Le domaine en cours d'authentification. Par défaut à
  ``env('SERVER_NAME')``.

En plus de la configuration courante, l'authentification Digest prend en charge
les clés suivantes:

- ``realm`` Le domaine en cours d'authentification. Par défaut à servername
- ``nonce`` Un nonce utiliser pour l'authentification. Par défaut à
  ``uniqid()``.
- ``qop`` Par défaut à auth, pas d'autre valeur supportée pour le moment.
- ``opaque`` Une chaîne qui doit être retourné à l'identique par les clients.
  Par Défaut à ``md5($config['realm'])``.

Identifier les utilisateurs et les connecter
--------------------------------------------

Par le passé le component Auth ``AuthComponent`` connectait les utilisateurs
automatiquement.
C'était un peu déroutant pour certain, et rendait la création au travers
du component Auth ``AuthComponent`` par moment un peu difficile.
Avec la version 2.0, vous avez besoin d'appeler manuellement
``$this->Auth->login()`` pour connecter un utilisateur.

Quand les utilisateurs s'identifient, les objets d'identification sont
vérifiés dans l'ordre où ils ont été attachés. Une fois qu'un objet
peut identifier un utilisateur, les autres objets ne sont pas vérifiés.
Une simple fonction de connexion pourrait ressembler à cela ::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Session->setFlash(
                    __('Username ou password est incorrect'),
                    'default',
                    array(),
                    'auth'
                );
            }
        }
    }

Le code ci-dessus (sans aucune donnée transmise à la méthode ``login``),
tentera de connecter un utilisateur en utilisant les données POST, et sera
redirigé en cas de succès sur la dernière page visitée, ou
:php:attr:`AuthComponent::$loginRedirect`. Si le login est en échec, un message
flash est défini.

.. warning::

    ``$this->Auth->login($this->request->data)`` connectera l'utilisateur avec
    les données postées. Elle ne va pas réellement vérifier les certificats avec
    une classe d'authentification.

Utilisation de l'authentification Digest et Basic pour la connexion
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Puisque les authentifications basic et digest ne nécessitent pas un POST
initial ou un form, ainsi si vous utilisez seulement les authentificators
basic / digest, vous n'avez pas besoin d'action login dans votre controller.
Aussi, vous pouvez définir ``AuthComponent::$sessionKey`` à false pour vous
assurer que AuthComponent n'essaie pas de lire les infos de l'user
à partir des sessions. L'authentification stateless va re-vérifier les
certificats de l'user à chaque requête, cela crée un petit montant de charges
supplémentaires, mais permet aux clients de se connecter sans utiliser les
cookies.

Créer des objets d'authentification personnalisés
-------------------------------------------------

Comme les objets d'authentification sont modulaires, vous pouvez créer des
objets d'authentification personnalisés pour votre application ou plugins.
Si par exemple vous vouliez créer un objet d'authentification OpenID.
Dans ``app/Controller/Component/Auth/OpenidAuthenticate.php``
vous pourriez mettre ce qui suit::

    App::uses('BaseAuthenticate', 'Controller/Component/Auth');

    class OpenidAuthenticate extends BaseAuthenticate {
        public function authenticate(CakeRequest $request, CakeResponse $response) {
            // Faire les trucs d'OpenID ici.
            // Retourne un tableau de l\'user si ils peuvent authentifier
            // l\'user
            // retourne false dans le cas contraire
        }
    }

Les objets d'authentification devraient retourner ``false`` si ils ne peuvent
identifier l'utilisateur. Et un tableau d'information utilisateur si ils le
peuvent.Il n'est pas utile d'étendre (extend) ``BaseAuthenticate``, simplement
votre objet d'identification doit implémenter la méthode ``authenticate()``.
La class ``BaseAuthenticate`` fournie un nombre de méthode très utiles
communément utilisées. Vous pouvez aussi implémenter une méthode ``getUser()``
si votre objet d'identification doit supporter des authentifications sans
cookie ou sans état (stateless). Regardez les sections portant sur
l'authentification digest et basic plus bas pour plus d'information.

Utilisation d'objets d'authentification personnalisés
-----------------------------------------------------

Une fois votre objet d'authentification créer, vous pouvez les utiliser
en les incluant dans le tableau d'authentification AuthComponents::

    $this->Auth->authenticate = array(
        'Openid', // objet d'authentification app
        'AuthBag.Combo', // plugin objet d'identification.
    );

Création de systèmes d'authentification stateless
-------------------------------------------------

Les objets d'authentification peuvent implémenter une méthode ``getUser()``
qui peut être utilisée pour supporter les systèmes de connexion des
utilisateurs qui ne reposent pas sur les cookies. Une méthode getUser
typique regarde l'environnement de la requête (request/environnement) et
y utilise les informations d'identification de l'utilisateur.
L'authentification HTTP Basic utilise par exemple
``$_SERVER['PHP_AUTH_USER']`` et ``$_SERVER['PHP_AUTH_PW']`` pour les champs
username et password. Pour chaque requête, si un client ne supporte pas les
cookies, ces valeurs sont utilisées pour ré-identifier l'utilisateur et
s'assurer que c'est un utilisateur valide. Comme avec les méthodes
d'authentification de l'objet ``authenticate()``, la méthode ``getuser()``
devrait retourner un tableau d'information utilisateur en cas de succès,
et ``false`` en cas d'echec.::

    public function getUser($request) {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

Le contenu ci-dessus montre comment vous pourriez mettre en œuvre la méthode
getUser  pour les authentifications HTTP Basic.
La méthode ``_findUser()`` fait partie de ``BaseAuthenticate`` et identifie un
utilisateur en se basant sur un nom d'utilisateur et un mot de passe.

Gestion des requêtes non authentifiées
--------------------------------------

Quand un user non authentifié essaie d'accéder à une page protégée en premier,
la méthode `unauthenticated()` du dernier authenticator dans la chaîne est
appelée. L'objet d'authentification peut gérer la réponse d'envoi ou la
redirection appropriée et retourne `true` pour indiquer qu'aucune action
suivante n'est nécessaire. Du fait de l'ordre dans lequel vous spécifiez
l'objet d'authentification dans les propriétés de
`AuthComponent::$authenticate`.

Si authenticator retourne null, `AuthComponent` redirige l'user vers l'action
login. Si c'est une requête ajax et `AuthComponent::$ajaxLogin` est spécifiée,
cet element est rendu, sinon un code de statut HTTP 403 est retourné.

Afficher les messages flash de Auth
-----------------------------------

Pour afficher les messages d'erreur de session que Auth génère, vous devez
ajouter les lignes de code suivante dans votre layout. Ajoutez les deux lignes
suivantes au fichier ``app/View/Layouts/default.ctp`` dans la section body de
préférence avant la ligne content_for_layout.::

    echo $this->Session->flash();
    echo $this->Session->flash('auth');

Vous pouvez personnaliser les messages d'erreur, et les réglages que le
component Auth ``AuthComponent`` utilise. En utilisant ``$this->Auth->flash``
vous pouvez configurer les paramètres que le component Auth utilise pour
envoyer des messages flash. Les clés disponibles sont :

- ``element`` - L'élément à utiliser , 'default' par défaut.
- ``key`` - La clé a utiliser , 'auth' par défaut
- ``params`` - Le tableau des paramètres additionnels à utiliser, array() par défaut

En plus des paramètres de message flash, vous pouvez personnaliser d'autres
messages d'erreurs que le component AuthComponent utilise. Dans la partie
beforeFilter de votre controller, ou dans le paramétrage du component vous
pouvez utiliser ``authError`` pour personnaliser l'erreur à utiliser quand
l'authentification échoue ::

    $this->Auth->authError = "Cette erreur se présente à l'utilisateur qui tente d'accéder à une partie du site qui est protégé.";

   Parfois, vous voulez seulement afficher l'erreur d'autorisation après que
   l'user se soit déja connecté. Vous pouvez supprimer ce message en
   configurant sa valeur avec le boléen `false`.

Dans le beforeFilter() de votre controller, ou les configurations du component::

    if (!$this->Auth->loggedIn()) {
        $this->Auth->authError = false;
    }

.. _hashing-passwords:

Hachage des mots de passe
-------------------------

Authenticating objects use a new setting ``passwordHasher`` which specifies the
password hasher class to use. It can be a string specifying class name or an
array with key ``className`` stating the class name and any extra keys will be
passed to password hasher constructor as config. The default hasher class
``Simple`` can be used for sha1, sha256, md5 hashing. By default the hash type
set in Security class will be used. You can use specific hash type like this::

    public $components = array(
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'passwordHasher' => array(
                        'className' => 'Simple',
                        'hashType' => 'sha256'
                    )
                )
            )
        )
    );

Lors de la création de nouveaux enregistrements d'utilisateurs, vous pouvez
hasher un mot de passe dans le callback beforeSave de votre model en utilisant
la classe de hasher de mot de passe appropriée::

    App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

    class User extends AppModel {
        public function beforeSave($options = array()) {
            if (!$this->id) {
                $passwordHasher = new BlowfishPasswordHasher();
                $this->data['User']['password'] = $passwordHasher->hash($this->data['User']['password']);
            }
            return true;
        }
    }

Vous n'avez pas besoin de hacher le mot de passe avant d'appeler
``$this->Auth->login()``.
Les différents objets d'authentification hacherons les mots de passe
individuellement.

Hachage de mots de passe pour l'authentification Digest
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Puisque l'authentification Digest nécessite un mot de passe haché dans un
format défini par la RFC. Respectivement pour hacher correctement un mot de
passe pour l'utilisation de l'authentification Digest vous devriez utilisez
la fonction spéciale ``DigestAuthenticate``. Si vous vous apprêtez à combiner
l'authentification Digest avec d'autres stratégies d'authentifications, il
est aussi recommandé de stocker le mot de passe  Digest dans une colonne
séparée, pour le hachage normal de mot de passe::

    class User extends AppModel {
        public function beforeSave($options = array()) {
            // fabrique un mot de passe pour l'auth Digest.
            $this->data['User']['digest_hash'] = DigestAuthenticate::password(
                $this->data['User']['username'], $this->data['User']['password'], env('SERVER_NAME')
            );
            return true;
        }
    }

Les mots de passe pour l'authentification Digest ont besoin d'un peu plus
d'information que pour d'autres mots de passe hachés. Si vous utilisez le
component AuthComponent::password() pour le hachage Digest vous ne pourrez pas
vous connecter.

.. note::

    le troisième paramètre de DigestAuthenticate::password() doit correspondre
    à la valeur de la configuration 'realm' définie quand DigestAuthentication
    était configuré dans AuthComponent::$authenticate. Par défaut à
    ``env('SCRIPT_NAME)``. Vous devez utiliser une chaîne statique si vous
    voulez un hachage permanent dans des environnements multiples.

Creating custom password hasher classes
---------------------------------------
Custom password hasher classes need to extend the ``AbstractPasswordHasher``
class and need to implement the abstract methods ``hash()`` and ``check()``.
In ``app/Controller/Component/Auth/CustomPasswordHasher.php`` you could put
the following::

    App::uses('AbstractPasswordHasher', 'Controller/Component/Auth');

    class CustomPasswordHasher extends AbstractPasswordHasher {
        public function hash($password) {
            // stuff here
        }

        public function check($password, $hashedPassword) {
            // stuff here
        }
    }

Connecter les utilisateurs manuellement
---------------------------------------

Parfois, le besoin se fait sentir de connecter un utilisateur manuellement,
par exemple juste après qu'il se soit enregistré dans votre application. Vous
pouvez faire cela en appelant ``$this->Auth->login()`` avec les données
utilisateur que vous voulez pour la 'connexion'::

    public function register() {
        if ($this->User->save($this->request->data)) {
            $id = $this->User->id;
            $this->request->data['User'] = array_merge($this->request->data['User'], array('id' => $id));
            $this->Auth->login($this->request->data['User']);
            return $this->redirect('/users/home');
        }
    }

.. warning::

    Soyez certain d'ajouter manuellement le nouveau User id au tableau passé
    à la méthode de login. Sinon vous n'aurez pas l'id utilisateur disponible.

Accéder à l'utilisateur connecté
--------------------------------

Une fois que l'utilisateur est connecté, vous avez souvent besoin
d'information particulière à propos de l'utilisateur courant. Vous pouvez
accéder à l'utilisateur en cours de connexion en utilisant
``AuthComponent::user()``. Cette méthode est statique, et peut être utilisée
globalement après le chargement du component Auth. Vous pouvez y accéder à la
fois avec l'instance d'une méthode ou comme une méthode statique::

    // Utilisez n'importe où
    AuthComponent::user('id')

    // Depuis l'intérieur du controler
    $this->Auth->user('id');

Déconnexion des utilisateurs
----------------------------

Éventuellement vous aurez besoin d'un moyen rapide pour dés-authentifier
les utilisateurs et les rediriger ou il devraient aller. Cette méthode
est aussi très pratique si vous voulez fournir un lien 'Déconnecte moi'
à l'intérieur de la zone membres de votre application ::

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

La déconnexion des utilisateurs connectés avec l'authentification Basic
ou Digest est difficile à accomplir pour tous les clients. La plupart
des navigateurs retiennent les autorisations pendant qu'il restent ouvert.
Certains navigateurs peuvent être forcés en envoyant un code 401. Le
changement du realm de l'authentification est une autre solution qui
fonctionne pour certain clients.

.. _authorization-objects:

Autorisation
============

l'autorisation est le processus qui permet de s'assurer qu'un utilisateur
identifier/authentifier est autorisé à accéder aux ressources qu'il demande.
Il y a plusieurs gestionnaires d'autorisation intégrés, et vous
pouvez créer vos propres gestionnaires dans un plugin par exemple.

- ``ActionsAuthorize`` Utilise le Component AclComponent pour vérifier les
  permissions d'un niveau d'action.
- ``CrudAuthorize`` Utilise le Component Acl et les action -> CRUD mappings
  pour vérifier les permissions pour les ressources.
- ``ControllerAuthorize`` appelle ``isAuthorized()`` sur le controller actif,
  et utilise ce retour pour autoriser un utilisateur. C'est souvent le moyen
  le plus simple d'autoriser les utilisateurs.

Configurer les gestionnaires d'autorisation
-------------------------------------------

Vous configurez les gestionnaires d'autorisation en utilisant
``$this->Auth->authorize``. Vous pouvez configurer un ou plusieurs
gestionnaires . L'utilisation de plusieurs gestionnaires vous donnes la
possibilité d'utiliser plusieurs moyens de vérifier les autorisations.
Quand les gestionnaires d'autorisation sont vérifiés ils sont appelés
dans l'ordre ou ils sont déclarés. Les gestionnaires devraient retourner
false, s'il ne sont pas capable de vérifier les autorisation, ou bien si
la vérification a échouée. Le gestionnaire devrait retourner true si ils
sont capables de vérifier correctement les autorisations. Les gestionnaires
seront appelés dans l'ordre jusqu'à ce qu'un passe. Si toutes les
vérifications échoues , l'utilisateur sera redirigé vers la page
d'où il vient. Vous pouvez également stopper les autorisations
en levant une exception. Vous aurez besoin de traiter toutes les exceptions
levées, et les manipuler.

Vous pouvez configurer les gestionnaires d'autorisation dans le
``beforeFilter`` de votre controller ou , dans le tableau ``$components``.
Vous pouvez passer les informations de configuration dans chaque objet
d'autorisation, en utilisant un tableau::

    // paramétrage Basique
    $this->Auth->config('authorize', ['Controller']);

    // passage de paramètre
    $this->Auth->config('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Tout comme ``authenticate``, ``authorize``, vous aident
à garder un code "propre, en utilisant la clé ``all``. Cette clé spéciale
vous aide à définir les paramètres qui sont passés à chaque objet attaché.
La clé all est aussi exposée comme ``AuthComponent::ALL``::

    // Passer la configuration en utilisant 'all'
    $this->Auth->config('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

Dans l'exemple ci-dessus, à la fois les ``Actions`` et le ``Controller`` auront
les paramètres définis pour la clé 'all'. Chaque paramètres passés a un objet
d'autorisation spécifique remplacera la clé correspondante dans la clé 'all'.
Le noyau authorize objects supporte les clés de configuration suivantes.

- ``actionPath`` Utilisé par ``ActionsAuthorize`` pour localiser le controller
  action ACO's dans l'arborescence ACO.
- ``actionMap`` Action -> CRUD mappings. Utilisé par ``CrudAuthorize`` et
  les objets d'autorisation qui veulent mapper les actions aux rôles CRUD.
- ``userModel`` Le nom du nœud ARO/Model dans lequel l'information utilisateur
  peut être trouvé. Utilisé avec ActionsAuthorize.

Création d'objets Authorize personnalisés
-----------------------------------------

Parce que les objets authorize sont modulables, vous pouvez créer des objets
authorize personnalisés dans votre application, ou plugins. Si par exemple
vous voulez créer un objet authorize LDAP. Dans
``App/Controller/Component/Auth/LdapAuthorize.php``, vous pourriez mettre
cela::

    namespace App\Controller\Component\Auth;

    use Cake\Controller\Component\Auth\BaseAuthorize;
    use Cake\Network\Request;

    class LdapAuthorize extends BaseAuthorize {
        public function authorize($user, Request $request) {
            // Do things for ldap here.
        }
    }

L'objet Authorize devrait retourner ``false`` si l'utilisateur se voit refuser
l'accès, ou si l'objet est incapable de faire un contrôle. Si l'objet est
capable de vérifier les accès de l'utilisateur, ``true`` devrait être retourné.
Ça n'est pas nécessaire d'étendre ``BaseAuthorize``,  il faut simplement que
votre objet authorize implémente la méthode ``authorize()``. La classe
``BaseAuthorize`` fournit un nombre intéressant de méthodes utiles qui
sont communément utilisées.

Utilisation d'objets Authorize personnalisés
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fois que vous avez créé votre objet authorize personnalisé, vous pouvez
l'utiliser en l'incluant dans le tableau authorize::

    $this->Auth->config('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Ne pas utiliser d'autorisation
------------------------------

Si vous souhaitez ne pas utiliser les objets d'autorisation intégrés, et que
vous voulez gérer les choses entièrement à l'extérieur du Component Auth
(AuthComponent) vous pouvez définir
``$this->Auth->config('authorize', false);``. Par défaut le component Auth
démarre avec ``authorize = false``. Si vous n'utilisez pas de schéma
d'autorisation, assurez-vous de vérifier les autorisations vous-même dans la
partie beforeFilter de votre controller ou avec un autre component.

Rendre des actions publiques
----------------------------

Il y a souvent des actions de controller que vous souhaitez laisser
entièrement publiques, ou qui ne nécessitent pas de connexion utilisateur.
Le component Auth (AuthComponnent) est pessimiste, et par défaut interdit
l'accès. Vous pouvez marquer des actions comme publique en utilisant
``AuthComponent::allow()``. En marquant les actions comme publique, le
component Auth ne vérifiera pas la connexion d'un utilisateur, ni
n'autorisera la vérification des objets ::

    // Permet toutes les actions
    $this->Auth->allow();

    // Ne permet que les actions view et index.
    $this->Auth->allow('view', 'index');

    // Ne permet que les actions view et index.
    $this->Auth->allow(array('view', 'index'));

Vous pouvez fournir autant de nom d'action dont vous avez besoin à ``allow()``.
Vous pouvez aussi fournir un tableau contenant tous les noms d'action.

Fabriquer des actions qui requièrent des autorisations
------------------------------------------------------

Par défaut, toutes les actions nécessitent une authorisation.
Cependant, si après avoir rendu les actions publiques, vous voulez révoquer les
accès publics. Vous pouvez le faire en utilisant ``AuthComponent::deny()``::

    // retire une action
    $this->Auth->deny('add');

    // retire toutes les actions .
    $this->Auth->deny();

    // retire un groupe d'actions.
    $this->Auth->deny('add', 'edit');
    $this->Auth->deny(array('add', 'edit'));

Vous pouvez fournir autant de noms d'action que vous voulez à ``deny()``.
Vous pouvez aussi fournir un tableau contenant tous les noms d'action.

Utilisation de ControllerAuthorize
----------------------------------

ControllerAuthorize vous permet de gérer les vérifications d'autorisation dans
le callback d'un controller. C'est parfait quand vous avez des autorisations
très simples, ou que vous voulez utiliser une combinaison models + components à
faire pour vos autorisations, et ne voulez pas créer un objet authorize
personnalisé.

Le callback est toujours appelé  ``isAuthorized()`` et devrait retourner un
booléen pour indiquer si l'utilisateur est autorisé ou pas à accéder aux
ressources de la requête. Le callback est passé à l'utilisateur actif, il
peut donc être vérifié::

    class AppController extends Controller {
        public $components = array(
            'Auth' => array('authorize' => 'Controller'),
        );
        public function isAuthorized($user = null) {
            // Chacun des utilisateur enregistré peut accéder aux fonctions publiques
            if (empty($this->request->params['admin'])) {
                return true;
            }

            // Seulement les administrateurs peuvent accéder aux fonctions d'administration
            if (isset($this->request->params['admin'])) {
                return (bool)($user['role'] === 'admin');
            }

            // Par défaut n'autorise pas
            return false;
        }
    }

Le callback ci-dessus fournirait un système d'autorisation très simple
où seuls les utilisateurs ayant le rôle d'administrateur pourraient
accéder aux actions qui ont le préfixe admin.

Utilisation de ActionsAuthorize
-------------------------------

ActionsAuthorize s'intègre au component ACL, et fournit une vérification ACL
très fine pour chaque requête. ActionsAuthorize est souvent jumelé avec
DbAcl pour apporter un système de permissions dynamique et flexible
qui peuvent être éditées par les utilisateurs administrateurs au travers de
l'application. Il peut en outre être combiné avec d'autres implémentations
Acl comme IniAcl et des applications Acl backends personnalisées.

Utilisation de CrudAuthorize
----------------------------

``CrudAuthorize`` s'intègre au component Acl, et fournit la possibilité de
mapper les requêtes aux opérations CRUD. Fournit la possibilité d'autoriser
l'utilisation du mapping CRUD. Les résultats mappés sont alors vérifiés dans
le component Acl comme des permissions spécifiques.

Par exemple, en prenant la requête ``/posts/index``. Le mapping
par défaut pour ``index`` est une vérification de la permission de ``read``.
La vérification d'Acl se ferait alors avec les permissions de ``read`` pour le
controller ``posts``. Ceci vous permet de créer un système de permission
qui met d'avantage l'accent sur ce qui est en train d'être fait aux ressources,
plutôt que sur l'action spécifique en cours de visite.

Mapper les actions en utilisant CrudAuthorize
---------------------------------------------

Quand vous utilisez CrudAuthorize ou d'autres objets authorize qui utilisent
le mapping d'action, il peut être nécessaire de mapper des méthodes
supplémentaires. vous pouvez mapper des actions --> CRUD permissions en
utilisant mapAction(). En l'appelant dans le component Auth vous
déléguerez toutes les actions aux objets authorize configurés, ainsi vous
pouvez être sûr que le paramétrage sera appliqué partout::

    $this->Auth->mapActions(array(
        'create' => array('register'),
        'view' => array('show', 'display')
    ));

La clé pour mapActions devra être les permissions CRUD que vous voulez
définir, tandis que les valeurs devront être un tableau de toutes les
actions qui sont mappées vers les permissions CRUD.

API de AuthComponent
====================

Le component Auth est l'interface primaire à la construction de mécanisme
d'autorisation et d'authentification intégrée dans CakePHP.

ajaxLogin
    Le nom d'une vue optionnelle d'un élément à rendre quand une requête AJAX
    est faite avec une session expirée invalide.
allowedActions
    Les actions du controller pour qui la validation de l'utilisateur n'est pas
    nécessaire.
authenticate
    Défini comme un tableau d'objets d'identifications que vous voulez utiliser
    quand les utilisateurs de connectent. Il y a plusieurs objets
    d'authentification dans le noyau, cf la section
    :ref:`authentication-objects`
authError
    Erreur à afficher quand les utilisateurs font une tentative d'accès à un
    objet ou une action à laquelle ils n'ont pas accès.

    You can suppress authError message from being displayed by setting this
    value to boolean `false`.
authorize
    Défini comme un tableau d'objets d'autorisation que vous voulez utiliser
    quand les utilisateurs sont autorisés sur chaque requête, cf la section
    :ref:`authorization-objects`
flash
    Paramétrage à utiliser quand Auth à besoin de faire un message flash avec
    :php:meth:`SessionComponent::setFlash()`.
    Les clés disponibles sont:

    - ``element`` - L'élement à utiliser , par défaut à 'default'.
    - ``key`` - La clé à utiliser, par défaut à 'auth'.
    - ``params`` - Un tableau de paramètres supplémentaires à utiliser par
      défaut à array()

loginAction
    Une URL (définie comme une chaîne de caractères ou un tableau) pour
    l'action du controller qui gère les connexions. Par défaut à `/users/login`.
loginRedirect
    L' URL (définie comme une chaîne de caractères ou un tableau) pour l'action
    du controller où les utilisateurs doivent être redirigés après la
    connexion. Cette valeur sera ignorée si l'utilisateur à une valeur
    ``Auth.redirect`` dans sa session.
logoutRedirect
    L'action par défaut pour rediriger l'utilisateur quand il se déconnecte.
    Alors que le component Auth ne gère pas les redirection post-logout,
    une URL de redirection sera retournée depuis
    :php:meth:`AuthComponent::logout()`. Par défaut à
    :php:attr:`AuthComponent::$loginAction`.
unauthorizedRedirect
    Contrôle la gestion des accès non autorisés. Par défaut, un utilisateur
    non autorisé est redirigé vers l'URL référente ou vers
    ``AuthComponent::$loginAction`` ou '/'.
    Si défini à false, une exception ForbiddenException est lancée au lieu de
    la redirection.

.. php:attr:: components

    Les autres components utilisés par AuthComponent

.. php:attr:: sessionKey

    Le nom de la clé de session où les enregistrements de l'utilisateur actuel
    sont enregistrés. Si ça n'est pas spécifié, ce sera "Auth.User".

.. php:method:: allow($action, [$action, ...])

    Définit une ou plusieurs actions comme publiques, cela signifie
    qu'aucun contrôle d'autorisation ne sera effectué pour les actions
    spécifiées. La valeur spéciale  ``'*'`` marquera les actions du controller
    actuelle comme publique. Sera mieux utilisé dans la méthode beforeFilter de
    votre controller.

.. php:method:: constructAuthenticate()

    Charge les objets d'authentification configurés.

.. php:method:: constructAuthorize()

    Charge les objets d'autorisation configurés.

.. php:method:: deny($action, [$action, ...])

    Basculer une ou plusieurs actions précédemment déclarées comme publique
    en méthodes non publiques. Ces méthodes requièrent une authorization. Sera
    mieux utilisé dans la méthode beforeFilter de votre controller.

.. php:method:: flash($message)

    Définit un message flash. Utilise le component Session, et prend les
    valeurs depuis :php:attr:`AuthComponent::$flash`.

.. php:method:: identify($request, $response)

    :param CakeRequest $request: La requête à utiliser.
    :param CakeResponse $response: La réponse à utiliser, les en-tête peuvent
      être envoyées si l'authentification échoue.

    Cette méthode est utilisée par le component Auth pour identifier un
    utilisateur en se basant sur les informations contenues dans la requête
    courante.

.. php:method:: initialize($Controller)

   Initialise le component Auth pour une utilisation dans le controller.

.. php:method:: isAuthorized($user = null, $request = null)

    Utilise les adaptateurs d'autorisation configurés pour vérifier
    qu'un utilisateur est configuré ou non. Chaque adaptateur sera vérifié dans
    l'ordre, si chacun d'eux retourne true, alors l'utilisateur sera autorisé
    pour la requête.

.. php:method:: login($user)

    :param array $user: Un tableau de données d'utilisateurs connectés.

    Prends un tableau de données de l'utilisateur pour se connecter.
    Permet la connexion manuelle des utilisateurs.
    L'appel de user() va renseigner la valeur de la session avec les
    informations fournies. Si aucun utilisateur n'est fourni, le
    component Auth essaiera d'identifier un utilisateur en utilisant les
    informations de la requête en cours. cf
    :php:meth:`AuthComponent::identify()`.

.. php:method:: logout()

    :return: Une chaîne URL où rediriger l'utilisateur déconnecté.

    Déconnecte l'utilisateur actuel.

.. php:method:: mapActions($map = array())

    Mappe les noms d'action aux opérations CRUD. Utilisé par les
    authentifications basées sur le controller. Assurez-vous d'avoir
    configurée la propriété authorize avant d'appeler cette méthode. Ainsi
    cela déléguera $map à tous les objets autorize attachés.

.. php:method:: redirectUrl($url = null)

    Si il n'y a pas de paramètre passé, elle obtient l'authentification de
    redirection de l'URL. Passe une URL pour définir la destination ou un
    utilisateur devrait être redirigé lors de la connexion. Se repliera vers
    :php:attr:`AuthComponent::$loginRedirect` si il n'y a pas de valeur de
    redirection stockée.

.. php:method:: shutdown($Controller)

    Component shutdown. Si un utilisateur est connecté, liquide la redirection.

.. php:method:: startup($Controller)

    Méthode d'exécution principale. Gère la redirection des utilisateurs
    invalides et traite les données des formulaires de connexion.

.. php:staticmethod:: user($key = null)

    :param string $key: La clé des données utilisateur que vous voulez
      récupérer.Si elle est null, tous les utilisateurs seront retournés. Peut
      aussi être appelée comme une instance de méthode.

    Prend les données concernant de l'utilisateur connecté, vous pouvez
    utiliser une clé propriétaire pour appeler une donnée spécifique à propos
    d'un utilisateur::

        $id = $this->Auth->user('id');

    Si l'utilisateur courant n'est pas connecté ou que la clé n'existe pas
    null sera retourné.


.. meta::
    :title lang=fr: Authentification
    :keywords lang=fr: authentication handlers,array php,basic authentication,web application,different ways,credentials
