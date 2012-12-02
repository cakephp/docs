Authentification
################

.. php:class:: AuthComponent(ComponentCollection $collection, array $settings = array())

Identifier, authentifier et autoriser des utilisateurs constitue une 
partie courante de nombreuses applications Web. Le composant Auth de 
CakePHP fournit un moyen enfichable (pluggable) d'accomplir cette tâche. 
Le composant Auth vous permet de combiner l'authentification des objets , 
l'autorisation des objets  pour créer un moyen souple  pour permettre 
l'identification et le contrôle des autorisations de l'utilisateur.

.. _authentication-objects:

Authentification
================

L'authentification est le processus d'identification des utilisateurs 
par des identifiants de connexion définis et permet d'assurer que 
l'utilisateur est bien celui qu'il prétend être.En général, cela se fait 
à travers un nom d'utilisateur et mot de passe, qui sont comparés
à une liste d'utilisateur connus. 
Dans CakePHP il y a plusieurs construction pour l'authentification des 
utilisateurs enregistrés dans votre application.

* ``FormAuthenticate`` vous permet d'authentifier les utilisateurs sur la 
  base de formulaire de donnée POST. Habituellement il s'agit d'un formulaire 
  de connexion ou les utilisateurs entrent des informations.
* ``BasicAuthenticate`` vous permet d'identifier les utilisateurs en 
  utilisant l'authentification Basic HTTP.
* ``DigestAuthenticate`` vous permet d'identifier les utilisateurs en 
  utilisant l'authentification Digest HTTP.

Par défaut Le composant Auth (``AutComponent``) utilise ``FormAuthenticate``.

Choisir un type d'Authentification
----------------------------------

En général, vous aurez envie d'offrir l'authentification par formulaire. 
C'est le plus facile pour les utilisateurs utilisant un navigateur Web. 
Si vous construisez une API ou un webservice, vous aurez peut-être à envisager 
l'utilisation de l'authentification de base ou l'authentification Digest. 
L’élément clef qui différencie l'authentification digest de l'authentification 
basic est la plupart du temps lié à la façon dont les mots de passe sont gérés.
Avec l'authentification basic, le nom d'utilisateur et le mot de passe sont 
transmis  en clair sur le serveur. Cela rend l'authentification de base non 
approprié pour des applications sans SSL,vous exposeriez sensiblement vos 
mot de passe.
L'authentification Digest utilise un hachage condensé du nom d'utilisateur, 
mot de passe, et quelques autres détails. Cela rend l'authentification 
Digest plus approprié pour des applications sans cryptage SSL.

Vous pouvez également utiliser des systèmes d'authentification comme 
OpenID , mais openid ne fait pas partie du cœur de CakePHP.

Configuration des gestionnaires d'authentification
--------------------------------------------------

Vous configurez les gestionnaires d'authentification en 
utilisant ``$this->Auth->authenticate``.
Vous pouvez configurer un ou plusieurs gestionnaires pour l'authentification.
L'utilisation de plusieurs gestionnaire d'authentification vous permet de
supporter les différentes méthodes de connexion des utilisateurs. 
Quand les utilisateurs se connectent, les gestionnaires d'authentification
sont utilisés dans l'ordre auquel ils ont été déclarés.
Une fois qu'un gestionnaire est capable d'identifier un utilisateur, les autres
gestionnaires ne seront pas utilisés. Inversement, vous pouvez mettre un terme
à tous les authentifications en levant une exception.Vous pourrez traiter toutes
les exceptions levées, et les gérer comme désiré.

Vous pouvez configurer le gestionnaire d'authentification dans les tableaux
``beforeFilter`` ou  ``$components``.
Vous pouvez passer l'information de configuration dans chaque objet 
d'authentification en utilisant un tableau::

    // Configuration de base
    $this->Auth->authenticate = array('Form');

    // Passer la configuration 
    $this->Auth->authenticate = array(
        'Form' => array('userModel' => 'Membre'),
        'Basic' => array('userModel' => 'Membre')
    );

Dans le deuxième exemple vous pourrez noter que nous avons à déclarer
la clef ``userModel`` deux fois. Pour vous aider à garder un code "propre" ,
vous pouvez utiliser la clef ``all``. Cette clef spéciale vous permet 
de définir les réglages qui sont passés à chaque objet attaché.
La cle ``all`` est aussi utilisée comme cela
``AuthComponent::ALL``::

    // Passer la configuration en utilisant 'all'
    $this->Auth->authenticate = array(
        AuthComponent::ALL => array('userModel' => 'Membre'),
        'Form',
        'Basic'
    );

Dans l'exemple ci-dessus, à la fois ```Form`` et ``Basic`` prendrons
les paramétrages définis dans la clef "all".
Tous les paramètres transmis à un objet d'authentification particulier 
remplacerons  la clef correspondante dans la clef 'all'.
Les objets d'authentification supportent les clefs de configuration suivante.

- ``fields`` Les champs à utiliser pour identifier un utilisateur .
- ``userModel`` Le nom du modèle de l'utilisateur, Par défaut User.
- ``scope`` Des conditions supplémentaires à utiliser lors de la recherche et 
  l'authentification des utilisateurs, ex ``array('User.is_active' => 1).``

Configurer différents champs pour l'utilisateur dans le tableau ``$component``::

    // Passer la configuration dans le tableau $components
    public $components = array(
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'fields' => array('username' => 'email')
                )
            )
        )
    );

.. note::

    Ne mettez pas d'autre clefs de configuration de Auth(comme authError, 
    loginAction etc). Ils doivent se trouver au même niveau que la clef d'authentification.
   
    La configuration ci-dessus avec d'autres configurations ressemblerait à quelque chose
    comme.::
    
        // Passage de paramètre dans le tableau $components
        public $components = array(
            'Auth' => array(
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login',
                    'plugin' => 'users'
                ),
                'authError' => 'Pensiez-vous réellement que vous étiez autorisés à voir cela ?',
                'authenticate' => array(
                    'Form' => array(
                        'fields' => array('username' => 'email')
                    )
                )
            )
        );
        
En plus de la configuration courante, l'authentification de base 
prend en charge les clefs suivantes:

- ``realm`` Le domaine en cours d'authentification.Par défaut à ``env('SERVER_NAME')``.

En plus de la configuration courante, l'authentification Digest prend 
en charge les clefs suivantes:


- ``realm`` Le domaine en cours d'authentification.Par défaut à servername
- ``nonce`` Un nonce utiliser pour l'authentification.  Par défaut à ``uniqid()``.
- ``qop`` Par défaut à auth, pas d'autre valeur supportée pour le moment.
- ``opaque`` Une chaîne qui doit être retourné à l'identique par les clients. 
  Par Défaut à ``md5($settings['realm'])``

Création d'objet 

Créer des objets d'authentification personnalisés
-------------------------------------------------

Comme les objets d'authentification sont modulaires (pluggable) ,
vous pouvez créer des objets d'authentification personnalisés pour
votre application ou plugins. Si par exemple vous vouliez créer un objet
d'authentification OpenID. 
Dans ``app/Controller/Component/Auth/OpenidAuthenticate.php``
vous pourriez mettre ce qui suit::

    App::uses('BaseAuthenticate', 'Controller/Component/Auth');

    class OpenidAuthenticate extends BaseAuthenticate {
        public function authenticate(CakeRequest $request, CakeResponse $response) {
            // Faire les trucs d'openid ici.
        }
    }

Les objets d'authentification devraient retournés ``false`` si ils ne peuvent
identifier l'utilisateur. Et un tableau d'information utilisateur si ils le
peuvent.Il n'est pas utile d'étendre (extend) ``BaseAuthenticate``, simplement
votre objet d'identification doit implémenter la méthode ``authenticate()``.
La class ``BaseAuthenticate`` fournie un nombre de méthode très utiles communément
utilisées. Vous pouvez aussi implémenter une méthode ``getUser()`` si votre 
objet d'identification doit supporter des authentifications sans cookie 
ou sans état (stateless). Regardez les sections portant sur l'authentification
digest et basic plus bas pour plus d'information.

Utilisation d'objets d'authentification personnalisés
-----------------------------------------------------

Une fois votre objet d'authentification créer, vous pouvez les utiliser
en les incluant dans le tableau d'authentification AuthComponents::

    $this->Auth->authenticate = array(
        'Openid', // objet d'authentification app 
        'AuthBag.Combo', // plugin objet d'identification.
    );

Identifier les utilisateurs et les connecter
--------------------------------------------

Par le passé le composant Auth ``AutComponent`` connectait les utilisateurs 
automatiquement.
C'était un peu déroutant pour certain, et rendait la création au travers
du composant Auth ``AuthComponent`` par moment un peu difficile.
Avec la version 2.0 , vous avez besoin d'appeler manuellement 
``$this->Auth->login()`` pour connecter un utilisateur.

Quand les utilisateurs s'identifient, les objets d'identification son
vérifier dans l'ordre ou il ont été attachés. Une fois qu'un objet
peut identifier un utilisateur, les autres objets ne sont pas vérifiés.
Une simple fonction fonctionnant au login pourrait ressemblé à cela ::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            } else {
                $this->Session->setFlash(__('Le nom d'utilisateur ou le mot de passe 
                est incorrect'), 'default', array(), 'auth');
            }
        }
    }

Le code ci-dessus (sans aucune donnée transmise à la méthode ``login``),tentera 
de connecter un utilisateur en utilisant les données POST, et sera redirigé en 
cas de succès sur la dernière page visitée, ou 
:php:attr:`AuthComponent::$loginRedirect`. Si le login est en échec un message 
flash est défini. 

.. warning::

    Dans la version 2.0 ``$this->Auth->login($this->request->data)`` 
    connectera l'utilisateur avec les données postées., tandis que avec la 
    version 1.3 ``$this->Auth->login($this->data)`` tentera
    d'identifier l'utilisateur en premier et le connectera seulement en cas 
    de succès.

Utilisation de l'authentification Digest et Basic pour la connexion    
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Parce que l'authentification basic et digest ne demande pas d'effectuer un POST 
initial avant d'initier la séquence de connexion, votre fonction ``login()`` 
aura un aspect un petit peu différent qu'avec l'utilisation de 
``FormAuthentication``::

    public function login() {
        if ($this->Auth->login()) {
            return $this->redirect($this->Auth->redirect());
        } else {
            $this->Session->setFlash(__('Le nom d'utilisateur ou le mot de passe 
            est incorrect'), 'default', array(), 'auth');
        }
    }

Une fois connectés, les utilisateurs utilisant l'authentification digest et 
basic ne sont pas tenus d'avoir des cookies. En fait, tous les objets 
d'authentification sont capables de fournir une authentification *stateless* 
au travers l'implémentation de la méthode ``getUser()``. Si le client supporte 
les cookies, l'authentification basic et digest stockera un utilisateur dans 
une session comme n'importe quel autre objet d'authentification. Si le client 
ne supporte pas les cookies, (comme un simple client HTTP construit par dessus 
CURL) l'authentification stateless est aussi supportée. L'authentification 
stateless verifiera les informations d'identification à chaque requète, ce qui 
créé une petite quantité de charge supplémentaire, mais permet au client qui 
ne peuvent ou ne supportent pas les cookies de se connecter.

Création de systèmes d'authentification stateless 
-------------------------------------------------

Les objets d'authentification peuvent implémenter une méthode ``getUser()``
qui peut être utilisée pour supporter les systèmes de connexion des 
utilisateurs qui ne reposent pas sur les cookies. Une méthode getUser 
typique regarde l'environnement de la requête (request/environnement) et 
y utilise les informations d'identification de l'utilisateur. 
L'authentification HTTP Basic utilise par exemple 
``$_SERVER['PHP_AUTH_USER']`` et ``$_SERVER['PHP_AUTH_PW']`` pour les champs 
username et password. Pour chaque requête , si un client ne supporte pas les 
cookies, ces valeurs sont utilisées pour ré-identifier l'utilisateur et 
s'assurer que c'est un utilisateur valide. Comme avec les méthodes 
d'authentification de l'objet  ``authenticate()`` la méthode ``getuser()`` 
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

Afficher les messages flash de Auth
Pour afficher les messages d'erreur de session que Auth génère, vous devez 
ajouter les lignes de code suivante dans votre layout. Ajouter les deux lignes 
suivantes au fichier ``app/View/Layouts/default.ctp`` dans la section body de 
préférence  avant la ligne content_for_layout.::

    echo $this->Session->flash();
    echo $this->Session->flash('auth');
    ?>

Vous pouvez personnaliser les messages d'erreur, et les réglages  que le 
composant Auth ``AuthComponent`` utilise. En utilisant ``$this->Auth->flash`` 
vous pouvez configurer les paramètres que le composant Aut utilise pour 
envoyer des messages flash. Les clefs disponibles sont:

- ``element`` - L'élément à utiliser , 'default' par défaut.
- ``key`` - La clef a utiliser , 'auth' par défaut
- ``params`` - Le tableau des paramètres additionnels à utiliser, array() par défaut

En plus des paramètres de message flash, vous pouvez personnaliser d'autres 
messages d'erreurs que le composant auth utilise. Dans la partie beforeFilter
de votre contrôleur , ou paramétrage du composant vous pouvez utiliser 
``authError`` pour personnaliser l'erreur à utiliser quand l'authentification 
échoue ::

    $this->Auth->authError = "Cette erreur se présente à l'utilisateur qui 
    tente d'accéder à une partie du site qui est protégé.";

Hachage de mot de passe
-----------------------

Le composant Auth ne fait fait plus automatiquement le hachage de tous les mots 
de passe qu'il rencontre.
Ceci à été enlevé parce qu'il rendait un certain nombre de tâches communes 
comme la validation difficile. Vous ne devriez **jamais** stocker un mot de 
passe en clair, et avant de sauvegarder un utilisateur vous devez toujours 
hacher le mot de passe. Vous pouvez utiliser la statique 
``AuthComponent::password()`` pour hacher les mots de passes avant de les 
sauvegarder. Ceci utilisera la stratégie de hachage paramétrée pour votre 
application. 

Après avoir validé le mot de passe, vous pouvez hacher un mot de passe dans le 
callback beforeSave de votre modèle::

    class User extends AppModel {
        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
            return true;
        }
    }

Vous n'avez pas besoin de hacher le mot de passe avant d'appeler 
``$this->Auth->login()``.
Les différents objets d'authentification hacherons les mots de passe 
individuellement. Si vous utiliser l'authentification Digest, vous ne devriez 
pas  utiliser AuthComponent::password() pour la génération de mots de 
passes. Regardez ci-dessous comment générer des hachages Digest.

Hachage de mot de passe pour l'authentification Digest
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Parce que l'authentification Digest nécessite un mot de passe hacher dans un 
format défini par la RFC. Respectivement pour correctement hacher un mot de 
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

Les mots de passes pour l'authentification Digest ont besoin d'un peu plus 
d'information. Si vous utilisez le composant AuthComponent::password() pour 
le hachage Digest vous ne pourrez pas vous connecter.

.. note::

    le troisième paramètre de DigestAuthenticate::password() doit correspondre 
    à la valeur de la configuration 'realm' définie quand DigestAuthentication 
    était configuré dans  AuthComponent::$authenticate. Par défaut a 
    ``env('SCRIPT_NAME)``. Vous devez utiliser une chaîne statique si vous 
    voulez un hachage permanent dans des environnements multiples.
   
Connecter les utilisateurs manuellement

Quelquefois le besoin se fait sentir de connecter un utilisateur manuellement, 
comme juste après qu'il se soit enregistré dans votre application. Vous pouvez 
faire cela en appelant ``$this->Auth->login()`` avec les données utilisateur que 
vous voulez pour la 'connexion'::

    public function register() {
        if ($this->User->save($this->request->data)) {
            $id = $this->User->id;
            $this->request->data['User'] = array_merge($this->request->data['User'], array('id' => $id));
            $this->Auth->login($this->request->data['User']);
            $this->redirect('/users/home');
        }
    }

.. attention::

    Soyez certain d'ajouter manuellement le nouveau User id au tableau passé 
    à la méthode de login. Sinon vous n'aurez l'id utilisateur disponible.
    
Accéder à l'utilisateur connecté
--------------------------------

Une fois que l'utilisateur est connecté, vous devriez souvent avoir besoin 
d'information particulière à propos de l'utilisateur courant. Vous pouvez 
accéder à l'utilisateur en cours de connexion en utilisant 
``AuthComponent::user()``. Cette méthode est statique , et peut être utilisée 
globalement après le chargement du composant Auth. Vous pouvez y accéder à la 
fois avec l'instance d'une méthode ou comme une méthode statique::

    // Utilisez n'importe où
    AuthComponent::user('id')

    // Depuis l'interieur du controlleur
    $this->Auth->user('id');

Déconnexion des utilisateurs
----------------------------

Éventuellement vous aurez besoin d'un moyen rapide pour dés-authentifier 
les utilisateurs et de les rediriger ou il devraient aller. Cette méthode 
est aussi très pratique si vous voulez fournir un lien 'Déconnecte moi' 
à l'intérieur de la zone membres de votre application ::

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

La déconnexion des utilisateurs connectés avec l'authentification Basic 
ou Digest est difficile à accomplir pour tous les client. La plupart 
des navigateurs retiennent les autorisations pendant qu'il restent ouvert. 
Certains navigateurs peuvent être forcés en envoyant un code 401. Le 
changement du realm de l'authentification est une autre solution qui 
fonctionne pour certain clients.

.. _authorization-objects:

Autorisation
============

l'autorisation est le processus qui permet de s'assurer qu'un utilisateur 
identifier/authentifier est autorisé à accéder aux ressources qu'il demande.
Il y a plusieurs gestionnaires d'autorisation prés-construits , et vous 
pouvez créer vos propres gestionnaire comme faisant partie d'un plugin.

- ``ActionsAuthorize`` Utilise le Composant Acl pour vérifier les permissions 
  d'un niveau d'action.
- ``CrudAuthorize`` Utilise le Composant Acl et les action -> CRUD mappings 
  pour vérifier les permissions pour les ressources.
- ``ControllerAuthorize`` Appel ``isAuthorized()`` sur le contrôleur actif ,
  et utilise ce retour pour autoriser l'utilisateur.  C'est souvent le moyen 
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
levées , et les manipuler.

Vous pouvez configurer les gestionnaires d'autorisation dans le
``beforeFilter`` de votre contrôleur ou , dans  le tableau ``$components``.
Vous pouvez passer les informations de configuration dans chaque objet
d'autorisation, en utilisant un tableau::

    // paramétrage Basique
    $this->Auth->authorize = array('Controller');

    // passage de paramètre 
    $this->Auth->authorize = array(
        'Actions' => array('actionPath' => 'controllers/'),
        'Controller'
    );

Tout comme  ``Auth->authenticate``,  ``Auth->authorize``, vous aides
à garder un code "propre, en utilisant la clef ``all``. Cette clef spéciale
vous aides  à définir les paramètres qui sont passés à chaque objets attachés.
La clef all est aussi exposée comme ``AuthComponent::ALL``::


    // passage de paramètre en utilisant 'all'
    $this->Auth->authorize = array(
        AuthComponent::ALL => array('actionPath' => 'controllers/'),
        'Actions',
        'Controller'
    );

Dans l'exemple ci-dessus , à la fois ``L' Actions`` et ``Le Contrôleur`` auront 
les paramètres définis pour la clef 'all'. Chaque paramètres passés a un objet
d'autorisation spécifique remplacera la clef correspondante dans la clef 'all'.
Le noyau authorize objects supporte les clefs de configuration suivantes.


- ``actionPath`` Utilisé par ``ActionsAuthorize`` pour localiser le contrôleur 
  action ACO's dans l'arborescence ACO .
- ``actionMap`` Action -> CRUD mappings.  Utilisé par ``CrudAuthorize`` et 
  les objets d'autorisation qui veulent  mapper les actions aux rôles CRUD.
- ``userModel`` Le nom du nœud ARO/Model dans lequel l'information utilisateur 
  peut être trouvé.  Utilisé avec ActionsAuthorize.

Création d'objets Authorize personnalisés
-----------------------------------------

Parce que les objets authorize sons pluggable, vous pouvez créé des objets 
authorize personnalisés dans votre application, ou plugins. Si par exemple 
vous voulez créer un objet authorize LDAP. Dans 
``app/Controller/Component/Auth/LdapAuthorize.php``, vous pourriez mettre cela::


    App::uses('BaseAuthorize', 'Controller/Component/Auth');

    class LdapAuthorize extends BaseAuthorize {
        public function authorize($user, CakeRequest $request) {
            // Faire les trucs pour le LDAP ici.
        }
    }

L'objets Authorize devrait retourner `false ` si l'utilisateur se voit refuser 
l'accès, ou si l'objet est incapable de faire un contrôle. Si l'objet est 
capable de vérifier les accès de l'utilisateur, ``true`` devrait être retourné. 
Ça n'est pas nécessaire d'étendre ``BaseAuthorize``,  il faut simplement que 
votre objet authorize implémente la méthode ``authorize()``. La classe 
``BaseAuthorize`` fourni un nombre intéressant de méthodes utiles qui 
sont communément utilisées.

Utilisation d'objets Authorize personnalisés
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fois que vous avez créé votre objet authorize personnalisé, vous pouvez 
les utiliser en les incluant dans le tableau authorize::

    $this->Auth->authorize = array(
        'Ldap', // objet app authorize .
        'AuthBag.Combo', // plugin objet authorize .
    );

Ne pas utiliser d'autorisation
------------------------------

Si vous souhaitez ne pas utiliser les objets d'autorisation intégrés, et 
vous voulez gérer les chose entièrement à l'extérieur du Composant Auth 
(AuthComponent) vous pouvez définir ``$this->Auth->authorize = false;``. Par 
défaut le composant Auth démarre avec ``authorize = false``. Si vous n'utilisez 
pas de plan d'autorisation, assurez-vous de vérifier les autorisations vous 
même dans la partie beforFilter de votre controller ou avec un autre composant.

Rendre des actions publiques
----------------------------

Il y a souvent des actions de contrôleur que vous souhaitez laisser 
entièrement publique, ou qui ne nécessite pas de connexion utilisateur.
Le composant Auth (AuthComponnent) est pessimiste , et par défaut interdit 
l'accès. Vous pouvez marquer des actions comme publique en utilisant 
``AuthComponent::allow()``. En marquant les actions comme publique, le 
composant Auth , ne vérifiera pas la connexion d'un utilisateur, ni 
n'autorisera la vérification des objets ::

    // Permet toutes les actions. CakePHP 2.0
    $this->Auth->allow('*');

    // Permet toutes les actions. CakePHP 2.1
    $this->Auth->allow();

    // Ne permet que les actions view et index.
    $this->Auth->allow('view', 'index');

    // Ne permet que les actions view et index.
    $this->Auth->allow(array('view', 'index'));

Vous pouvez fournir autant de nom d'action dont vous avez besoin à ``allow()``.
Vous pouvez aussi fournir un  tableau contenant tous les noms d'action.

Fabriquer des actions qui requièrent des autorisations
------------------------------------------------------

Si après avoir rendu les actions publiques, et que vous voulez révoquer les 
accès publics. Vous pouvez le faire en utilisant ``AuthComponent::deny()``::

    // retire une action
    $this->Auth->deny('add');

    // retire toutes les actions .
    $this->Auth->deny();

    // retire un groupe d'actions.
    $this->Auth->deny('add', 'edit');
    $this->Auth->deny(array('add', 'edit'));

Vous pouvez fournir autant de nom d'action dont vous avez besoin à ``deny()``.
Vous pouvez aussi fournir un  tableau contenant tous les noms d'action.

Mapper les actions en utilisant CrudAuthorize
---------------------------------------------

Quand vous utilisez CrudAuthorize ou d'autres objets authorize qui utilisent 
le mapping d'action, il peut être nécessaire de mapper des méthodes 
additionnelles. vous pouvez mapper des actions --> CRUD permissions en 
utilisant mapAction(). En les appelant dans le composant Auth vous le 
déléguerez a tous objets authorize , ainsi vous pouvez être sûre que le 
paramétrage sera appliqué partout::   

    $this->Auth->mapActions(array(
        'create' => array('register'),
        'view' => array('show', 'display')
    ));

La clef pour mapActions devrait être les permissions CRUD que vous voulez 
définir, tandis que les valeurs devraient être un tableau de toutes les 
actions mapper vers les permissions CRUD.

Utilisation de ControllerAuthorize
----------------------------------

ControllerAuthorize vous permet de gérer les vérifications d'autorisation dans 
le callback d'un contrôleur. C'est parfait quand vous avez des autorisations 
très simples, ou vous voulez utiliser une combinaison modèles + composants à 
faire pour vos autorisation, et ne voulez pas créer un objet authorize 
personnalisés.

Le callback est toujours appelé  ``isAuthorized()`` et devrait retourner un 
booléen pour indiquer si l'utilisateur est autorisé ou pas à accéder aux 
ressources de la requête. Le callback est passé à l'utilisateur actif , il 
peut donc être vérifié. 

::

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

Le callback ci-dessus fournirait un très simple système d'autorisation
ou , simplement les utilisateurs ayant le rôle d'administrateur pourraient 
accéder aux actions qui sont dans le préfixe admin.

Utilisation de ActionsAuthorize
-------------------------------

ActionsAuthorize  s'intègre au composant ACL , et égraine finement chaque 
action ACL a chaque requête. ActionsAuthorize est souvent jumelé avec
DbAcl pour apporter un système de permissions dynamiques et flexibles 
qui peuvent être édités par les utilisateurs administrateurs au travers de 
l'application. Il peut en outre être combiner avec d'autres implémentation 
Acl comme IniAcl et des applications Acl backends personnalisées.

Utilisation de CrudAuthorize
----------------------------

``CrudAuthorize`` s'intègre au composant Acl , et fournit la possibilité de 
mapper les requêtes aux opérations CRUD. Fournit la possibilité d'autoriser 
l'utilisation du mapping CRUD. Les résultats mappés sont alors vérifiés dans 
le composant Acl comme des permissions spécifiques.

Par exemple, prendre ``/posts/index`` comme la requête courante. Le mapping
par défaut pour `index`, est une vérification de la permission de ``lire``.
La vérification de l'Acl serait alors pour le ``posts`` contrôleur avec les 
permissions de ``lecture``. Ceci vous permet de créer un système de permission 
qui met d'avantage l'accent sur ce qui est en train d'être fait aux ressources, 
plutôt que sur l'action spécifique en cours de visite.

AuthComponent API
=================

Le composant Auth est l'interface primaire à la  construction de mécanisme 
d'autorisation et d'authentification intégrés dans CakePHP.

.. php:attr:: ajaxLogin

    Le nom d'une vue optionnelle d'un élément à rendre quand une requête Ajax 
    est faite avec une session expirée invalide.
    
.. php:attr: allowedActions

    Le contrôleur action pour qui la validation de l'utilisateur n'est pas 
    nécessaire.

.. php:attr:: authenticate

    Définit à un tableau d'objets d’identifications que vous voulez utiliser
    quand les utilisateurs de connectent. Il y a plusieurs objets 
    d'authentification dans le noyau, cf la section 
    :ref:`authentication-objects`
    
.. php:attr:: authError

    Erreur à afficher quand les utilisateurs font une tentative d'accès à un 
    objet ou une action à laquelle ils n'ont pas accès.

.. php:attr:: authorize

    Définir un tableau d'objets d'autorisation que vous voulez utiliser quand 
    les utilisateurs sont autorisés sur chaque requête, cd la section 
    :ref:`authorization-objects`

.. php:attr:: components

    D'autre composants utilisés par le composant Auth

.. php:attr:: flash

    Paramétrage à utiliser quand Auth à besoin de faire un message flash avec 
    :php:meth:`SessionComponent::setFlash()`.

    Les clefs disponibles sont:

    - ``element`` - L'élement à utiliser , par défaut à  'default'.
    - ``key`` - La clef à utiliser, par défaut à 'auth'
    - ``params`` - Un tableau de paramêtres additionnels à utiliser par défaut 
      à array()

.. php:attr:: loginAction

    L' URL (définie comme une chaîne de caractères ou un tableau) pour le 
    controller action qui gère les connexions. par défaut à `/users/login`
    
.. php:attr:: loginRedirect

    L' URL (définie comme une chaîne de caractères ou un tableau) pour le 
    contrôleur action ou les utilisateurs seraient redirigés après la 
    connexion. Cette valeur sera ignorée si l'utilisateur à une valeur 
    ``Auth.redirect`` dans sa session.

.. php:attr:: logoutRedirect

    L'action par défaut pour rediriger vers .. l'utilisateur déconnecté.
    Tandis que le composant Auth ne gère pas les redirection post-logout,
    une URL de redirection sera retournée depuis
    :php:meth:`AuthComponent::logout()`. Par défaut à 
    :php:attr:`AuthComponent::$loginAction`.

.. php:attr:: request

    Objet Requête

.. php:attr:: response

    Objet Réponse

.. php:attr:: sessionKey

    Le nom de la clef de session ou les enregistrement de l'utilisateur courant 
    sont enregistrés.Si ça n'est pas spécifié cela sera "Auth.User".
    
.. php:method:: allow($action, [$action, ...])

    Définie une ou plusieurs actions comme publiques, cela signifie
    qu'aucun contrôle d'autorisation ne sera effectué pour les actions 
    spécifiées.
    La valeur spéciale  ``'*'`` marquera les actions du  contrôleur courant  
    comme publique. Sera mieux utilisé dans la méthode beforeFilter de votre 
    contrôleur.
   
.. php:method:: constructAuthenticate()

    Charge les objets d'authentifications configurés 
    
.. php:method:: constructAuthorize()

    Charge les objets d'autorisations configurés

.. php:method:: deny($action, [$action, ...])

    Basculer les actions précédemment déclarées comme publique 
    comme des méthodes non publiques, Ces méthode requièrent
    authorization. Sera mieux utilisé dans la méthode beforeFilter de votre
    contrôleur.

.. php:method:: flash($message)

    Défini un message flash. Utilise le composant Session, et prend les 
    valeurs depuis  :php:attr:`AuthComponent::$flash`.
    
.. php:method:: identify($request, $response)

    :param CakeRequest $request: La requête à utiliser.
    :param CakeResponse $response: La réponse à utiliser, les en-tête peuvent
      être envoyées si l'authentification échoue.

    Cette méthode est utilisée par le composant Auth pour identifier un 
    utilisateur en se basant sur les informations contenues dans la requête 
    courante.
   
.. php:method:: initialize($Controller)

   Initialise le composant Auth pour utilisation dans le contrôleur.

.. php:method:: isAuthorized($user = null, $request = null)

    Utilise les autorisations des adaptateurs configurés à vérifier ou pas
    qu'un utilisateur est configuré. Chaque adaptateur sera vérifié dans 
    l'ordre, si chacun d'eux retourne true, alors l'utilisateur sera autorisé 
    pour la requête.
  
.. php:method:: loggedIn()

    Retourne true si le client courant est un utilisateur connecté, ou false
    si il ne l'est pas.
    
.. php:method:: login($user)

    :param array $user: Un tableau de donnée d'utilisateur connectés.

    Prends un tableau de donnée utilisateur pour se connecter. 
    Permet la connexion manuelle des utilisateurss. 
    L'appel de user() va renseigner la valeur de la session
    avec les informations fournies. Si aucun utilisateur n'est fourni, le 
    composant Auth essayera d'identifier un utilisateur en utilisant les 
    informations de la requête en cours. cf 
    :php:meth:`AuthComponent::identify()` 
   
.. php:method:: logout()

    :return: Une chaine url où rediriger l'utilisateur déconnecté.

    Déconnecte l'utilisateur courant.

.. php:method:: mapActions($map = array())

    Mappe les noms d'action aux opérations CRUD. Utiliser par les 
    authentifications basées sur le contrôleur. Soyez certain d'avoir 
    configurer la propriété authorize avant d'appeler cette méthode. Ainsi 
    cela déléguera  $map a tous les objets autorize attachés.
    
.. php:staticmethod:: password($pass)

    Hache un mot de passe avec la valeur de la ``salt`` de l'application
    
.. php:method:: redirect($url = null)

    Si il n'y a pas de paramètre passé, obtient l'authentification de 
    redirection de l'URL. Passe une URL pour définir la destination ou un 
    utilisateur devrait être redirigé lors de la connexion.se repliera vers 
    :php:attr:`AuthComponent::$loginRedirect` si il n'y a pas de valeur de 
    redirection stockée.
    
.. php:method:: shutdown($Controller)

    Composant shutdown. si un utilisateur est connecté, effacé redirigé.
  
.. php:method:: startup($Controller)

    Méthode d’exécution principale. Gères la redirection des utilisateurs 
    invalides et traite les données des formulaires de connexion.
    
.. php:staticmethod:: user($key = null)

    :param string $key: La clef de la donné utilisateur que vous voulez 
      récupérer est null, tous les utilisateurs seront retournés. Peut aussi 
      être appelé comme une instance de méthode.

    Prend les données concernant l'utilisateur connecté, vous pouvez utiliser
    une clef propriétaire pour appeler une donnée spécifique à propos d'un 
    utilisateur::

        $id = $this->Auth->user('id');

    Si l'utilisateur courant n'est pas connecté ou que la clef n'existe pas 
    ``null`` sera retourné


.. meta::
    :title lang=fr: Authentification
    :keywords lang=fr: authentication handlers,array php,basic authentication,web application,different ways,credentials
