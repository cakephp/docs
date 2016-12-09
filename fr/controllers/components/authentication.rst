Authentification
################

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Identifier, authentifier et autoriser des utilisateurs constitue une partie
courante de nombreuses applications Web. Le component Auth de CakePHP fournit un
moyen modulaire d'accomplir cette tâche. Le component Auth vous permet de
combiner l'authentification des objets, l'autorisation des objets pour créer un
moyen souple pour permettre l'identification et le contrôle des autorisations de
l'utilisateur.

.. _authentication-objects:

Lectures Suggérées Avant de Continuer
=====================================

La Configuration de l'authentification nécessite quelques étapes, notamment la
définition d'une table users, la création d'un model, du controller et des vues,
etc..

Tout ceci est couvert étape par étape dans le
:doc:`Tutorial du Blog </tutorials-and-examples/blog-auth-example/auth>`.

Authentification
================

L'authentification est le processus d'identification des utilisateurs par des
identifiants de connexion définis et permet de s'assurer que l'utilisateur est
bien celui qu'il prétend être. En général, cela se fait à travers un nom
d'utilisateur et un mot de passe, qui sont comparés à une liste d'utilisateurs
connus. Dans CakePHP, il y a plusieurs façons intégrées pour l'authentification
des utilisateurs enregistrés dans votre application.

* ``FormAuthenticate`` vous permet d'authentifier les utilisateurs sur la base
  de formulaire de donnée POST. Habituellement il s'agit d'un formulaire de
  connexion où les utilisateurs entrent des informations.
* ``BasicAuthenticate`` vous permet d'identifier les utilisateurs en utilisant
  l'authentification Basic HTTP.
* ``DigestAuthenticate`` vous permet d'identifier les utilisateurs en utilisant
  l'authentification Digest HTTP.

Par défaut Le component Auth (``AuthComponent``) utilise ``FormAuthenticate``.

Choisir un Type d'Authentification
----------------------------------

En général, vous aurez envie d'offrir l'authentification par formulaire. C'est
le plus facile pour les utilisateurs utilisant un navigateur Web. Si vous
construisez une API ou un service web, vous aurez peut-être à envisager
l'utilisation de l'authentification de base ou l'authentification Digest.
L'élément clé qui différencie l'authentification digest de l'authentification
basic est la plupart du temps liée à la façon dont les mots de passe sont gérés.
Avec l'authentification basic, le nom d'utilisateur et le mot de passe sont
transmis en clair sur le serveur. Cela rend l'authentification de base non
appropriée pour des applications sans SSL, puisque vous exposeriez sensiblement
vos mots de passe. L'authentification Digest utilise un hachage condensé du nom
d'utilisateur, mot de passe, et quelques autres détails. Cela rend
l'authentification Digest plus appropriée pour des applications sans cryptage
SSL.

Vous pouvez également utiliser des systèmes d'authentification comme OpenID,
mais openid ne fait pas parti du cœur de CakePHP.

Configuration des Gestionnaires d'Authentification
--------------------------------------------------

Vous configurez les gestionnaires d'authentification en utilisant la config
``authenticate``. Vous pouvez configurer un ou plusieurs gestionnaires pour
l'authentification. L'utilisation de plusieurs gestionnaires d'authentification
vous permet de supporter les différentes méthodes de connexion des utilisateurs.
Quand les utilisateurs se connectent, les gestionnaires d'authentification sont
utilisés dans l'ordre selon lequel ils ont été déclarés. Une fois qu'un
gestionnaire est capable d'identifier un utilisateur, les autres gestionnaires
ne seront pas utilisés. Inversement, vous pouvez mettre un terme à toutes les
authentifications en levant une exception. Vous devrez traiter toutes les
exceptions levées, et les gérer comme désiré.

Vous pouvez configurer le gestionnaire d'authentification dans la méthode
``beforeFilter()`` ou dans la méthode ``initialize()``. Vous pouvez passer
l'information de configuration dans chaque objet d'authentification en utilisant
un tableau::

    // Configuration simple
    $this->Auth->config('authenticate', ['Form']);

    // Passer la configuration
    $this->Auth->config('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

Dans le deuxième exemple vous pourrez noter que nous avons à déclarer la clé
``userModel`` deux fois. Pour vous aider à garder un code "propre", vous pouvez
utiliser la clé ``all``. Cette clé spéciale vous permet de définir les réglages
qui sont passés à chaque objet attaché. La clé ``all`` est aussi utilisée comme
cela ``AuthComponent::ALL``::

    // Passer la configuration en utilisant 'all'
    $this->Auth->config('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

Dans l'exemple ci-dessus, à la fois ``Form`` et ``Basic`` prendront les
paramétrages définis dans la clé "all". Tous les paramètres transmis à un objet
d'authentification particulier remplaceront la clé correspondante dans la clé
'all'. Les objets d'authentification supportent les clés de configuration
suivante.

- ``fields`` Les champs à utiliser pour identifier un utilisateur. Vous pouvez
  utiliser les mots clés ``username`` et ``password`` pour spécifier
  respectivement les champs de nom d'utilisateur et de mot de passe.
- ``userModel`` Le nom du model de la table users, par défaut Users.
- ``finder`` la méthode finder à utiliser pour récupérer l'enregistrement de
  l'utilisateur. 'all' par défaut.
- ``passwordHasher`` La classe de hashage de mot de Passe. Par défaut à
  ``Default``.
- ``storage`` Classe de stockage. Par défaut à ``Session``.
- Les options ``scope`` et ``contain`` sont dépréciées dans 3.1. Utilisez un
  finder personnalisé à la place pour modifier la requête qui récupère
  l'utilisateur.
- L'option ``userFields`` a été dépréciée depuis la version 3.1. Utilisez
  ``select()`` dans vos finders personnalisés.

Pour configurer les différents champs de l'utilisateur dans la méthode
``initialize()``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email', 'password' => 'passwd']
                ]
            ]
        ]);
    }

Ne mettez pas d'autre clés de configuration de Auth (comme authError,
loginAction, ...) au sein d'élément ``authenticate`` ou ``Form``. Ils doivent
se trouver au même niveau que la clé d'authentification. La configuration
ci-dessus avec d'autres configurations ressemblerait à quelque chose comme::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authError' => 'Vous croyez vraiment que vous pouvez faire cela?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ],
            'storage' => 'Session'
        ]);
    }

En plus de la configuration courante, l'authentification de base prend en charge
les clés suivantes:

- ``realm`` Le domaine en cours d'authentification. Par défaut à
  ``env('SERVER_NAME')``.

En plus de la configuration courante, l'authentification Digest prend en charge
les clés suivantes:

- ``realm`` Le domaine en cours d'authentification. Par défaut à servername.
- ``nonce`` Un nom à usage unique utilisé pour l'authentification. Par défaut à
  ``uniqid()``.
- ``qop`` Par défaut à auth, pas d'autre valeur supportée pour le moment.
- ``opaque`` Une chaîne qui doit être retournée à l'identique par les clients.
  Par Défaut à ``md5($config['realm'])``.

.. note::
    Pour récupérer l'enregistrement utilisateur, la requête à la base de
    données est faite seulement sur le champ "username".
    La vérification du mot de passe est faite via PHP. Ceci est nécessaire
    car les algorithmes de hash comme bcrypt (qui est utilisé par défaut)
    génèrent un nouveau hash à chaque fois, et ce, pour la même chaîne de
    caractères. Ceci entraîne l'impossibilité de faire une simple comparaison
    de chaînes via SQL pour vérifier si le mots de passe correspond.

Personnaliser la Requête de Recherche
-------------------------------------

Vous pouvez personnaliser la requête utilisée pour chercher l'utilisateur en
utilisant l'option ``finder`` dans la configuration de la classe
d'authentification::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth'
                ]
            ],
        ]);
    }

Cela nécessitera que votre table ``UsersTable`` ait une méthode ``findAuth()``.
Dans l'exemple ci-dessous, la requête est modifiée pour récupérer uniquement
les champs et ajouter une condition. Vous devez vous assurer que vous avez
fait un select sur les champs pour lesquels vous souhaitez authentifier un
utilisateur, par exemple ``username`` et ``password``::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

.. note::
    L'option ``finder`` est disponible depuis 3.1. Pour les versions
    antérieures, vous pouvez utiliser les options ``scope`` et ``contain``
    pour modifier la requête.

Identifier les Utilisateurs et les Connecter
--------------------------------------------

.. php:method:: identify()

Vous devez appeler manuellement ``$this->Auth->identify()`` pour connecter un
utilisateur en utilisant les clés fournies dans la requête. Ensuite utilisez
``$this->Auth->setUser()`` pour connecter l'utilisateur et sauvegarder les infos
de l'utilisateur dans la session par exemple.

Quand les utilisateurs s'identifient, les objets d'identification sont vérifiés
dans l'ordre où ils ont été attachés. Une fois qu'un objet peut identifier un
utilisateur, les autres objets ne sont pas vérifiés. Une simple fonction de
connexion pourrait ressembler à cela::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__("Nom d'utilisateur ou mot de passe incorrect"), [
                    'key' => 'auth'
                ]);
            }
        }
    }

Le code ci-dessus va d'abord tenter d'identifier un utilisateur en utilisant les
données POST. En cas de succès, nous définissons les informations de
l'utilisateur dans la session afin qu'elle persiste au cours des requêtes et
redirige en cas de succès vers la dernière page visitée ou vers une URL
spécifiée dans la config ``loginRedirect``. Si la connexion est un échec, un
message flash est défini.

.. warning::

    ``$this->Auth->setUser($data)`` connectera l'utilisateur avec les données
    postées. Elle ne va pas réellement vérifier les certificats avec une classe
    d'authentification.

Rediriger les Utilisateurs Après Connexion
-------------------------------------------

.. php:method:: redirectUrl

Après avoir connecté un utilisateur, vous voudrez généralement le rediriger vers
l'endroit d'où il vient. Passez une URL pour définir la destination vers
laquelle l'utilisateur doit être redirigé après s'être connecté.

Si aucun paramètre n'est passé, elle obtient l'URL de redirection
d'authentification. L'URL retournée correspond aux règles suivantes:

- Retourne l'URL normalisée de valeur ``Auth.redirect`` si elle est présente en
  session et pour le même domaine que celui sur lequel application est exécuté.
- S'il n'y a pas de valeur en session et qu'il y a une configuration
  ``loginRedirect``, la valeur de ``loginRedirect`` est retournée.
- S'il n'y a pas de valeur en session et pas de ``loginRedirect``, ``/``
  est retournée.

Création de Systèmes d'Authentification Stateless
-------------------------------------------------

Les authentifications basic et digest sont des schémas d'authentification
sans état (stateless) et ne nécessitent pas un POST initial ou un form. Si
vous utilisez seulement les authentificateurs basic / digest, vous n'avez pas
besoin d'action login dans votre controller. L'authentication stateless va
re-vérifier les autorisations de l'utilisateur à chaque requête, ceci crée un
petit surcoût mais permet aux clients de se connecter sans utiliser les
cookies et rend AuthComponent plus adapté pour construire des APIs.

Pour des authentificateurs stateless, la config ``storage`` doit être définie
à ``Memory`` pour que AuthComponent n'utilise pas la session pour stocker
l'enregistrement utilisateur. Vous pouvez aussi définir la config
``unauthorizedRedirect`` à ``false`` pour que AuthComponent lance une
``ForbiddenException`` plutôt que le comportement par défaut qui est de
rediriger vers la page référente.

Les objets d'authentification peuvent implémenter une méthode ``getUser()``
qui peut être utilisée pour supporter les systèmes de connexion des
utilisateurs qui ne reposent pas sur les cookies. Une méthode getUser
typique regarde l'environnement de la requête (request/environnement) et
utilise les informations contenues pour confirmer l'identité de l'utilisateur.
L'authentification HTTP Basic utilise par exemple
``$_SERVER['PHP_AUTH_USER']`` et ``$_SERVER['PHP_AUTH_PW']`` pour les champs
username et password.

.. note::

    Dans le cas ou l'authentification ne fonctionne pas tel qu'espéré,
    vérifiez si les requêtes sont exécutées (voir
    ``BaseAuthenticate::_query($username)``). Dans le cas où aucune
    requête n'est exécutée, vérifiez si ``$_SERVER['PHP_AUTH_USER']`` et
    ``$_SERVER['PHP_AUTH_PW']`` sont renseignés par le serveur web.
    Si vous utilisez Apache avec PHP-FastCGI, vous devrez peut être ajouter
    cette ligne dans le **.htaccess** de votre webroot::

        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

Pour chaque requête, ces valeurs sont utilisées pour ré-identifier
l'utilisateur et s'assurer que c'est un utilisateur valide. Comme avec les
méthodes d'authentification de l'objet ``authenticate()``, la méthode
``getuser()`` devrait retourner un tableau d'information utilisateur en cas de
succès et ``false`` en cas d'échec::

    public function getUser(Request $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

Le contenu ci-dessus montre comment vous pourriez mettre en œuvre la méthode
getUser pour les authentifications HTTP Basic.
La méthode ``_findUser()`` fait partie de ``BaseAuthenticate`` et identifie un
utilisateur en se basant sur un nom d'utilisateur et un mot de passe.

.. _basic-authentication:

Utiliser l'Authentification Basic
---------------------------------

L'Authentification Basic vous permet de créer une authentification stateless
qui peut être utilisée pour des applications en intranet ou pour des scénarios
d'API simple. Les certificats d'identification de l'authentification Basic
seront revérifiés à chaque requête.

.. warning::
    L'authentification Basic transmet les certificats d'identification en clair.
    Vous devez utiliser HTTPS quand vous utilisez l'authentification Basic.


Pour utiliser l'authentification basic, vous devez configurer AuthComponent::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Basic' => [
                'fields' => ['username' => 'username', 'password' => 'api_key'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Ici nous voulons utiliser le username + clé API pour nos champs, et utiliser le
model Users.

Créer des clés d'API pour une Authentification Basic
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme le HTTP basic envoie les certificats d'identification en clair, il n'est
pas sage que les utilisateurs envoient leur mot de passe de connexion. A la
place, une clé d'API opaque est généralement utilisée. Vous pouvez générer
de façon aléatoire ces tokens d'API en utilisant les libraries de CakePHP::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->data['entity'];

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // Generate an API 'token'
                $entity->api_key_plain = sha1(Text::uuid());

                // Bcrypt the token so BasicAuthenticate can check
                // it during login.
                $entity->api_key = $hasher->hash($entity->api_key_plain);
            }
            return true;
        }
    }

Ce qui est au-dessus va générer un hash aléatoire pour chaque utilisateur quand
il est sauvegardé. Le code ci-dessus fait l'hypothèse que vous avez deux
``api_key`` - pour stocker la clé API hashée, et ``api_key_plain`` - vers la
version en clair de la clé API, donc vous pouvez l'afficher à l'utilisateur
plus tard. Utiliser une clé plutôt qu'un mot de passe, signifie que même
en HTTP en clair, vos utilisateurs peuvent utiliser un token opaque plutôt que
leur mot de passe original. Il est aussi sage d'inclure la logique permettant
aux clés API d'être régénérées lors de la requête d'un utilisateur.

Utiliser l'Authentification Digest
----------------------------------

L'authentification Digest est un modèle qui améliore la sécurité par rapport
à l'authentification basic, puisque les certificats d'identification de
l'utilisateur ne sont jamais envoyés dans l'en-tête de la requête. A la place,
un hash est envoyé.

Pour utiliser l'authentification digest, vous devez configurer AuthComponent::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Digest' => [
                'fields' => ['username' => 'username', 'password' => 'digest_hash'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Ici nous utilisons le username + digest_hash pour nos champs, et nous utilisons
le model Users.

Hasher les Mots de Passe pour l'Authentification Digest
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme l'authentification Digest nécessite un mot de passe hashé au format
défini par la RFC, afin de correctement hasher un mot de passe pour pouvoir
l'utiliser avec l'authentification Digest, vous devez utiliser la fonction
de hashage de mot de passe spéciale dans ``DigestAuthenticate``. Si vous allez
combiner l'authentification digest avec une autre stratégie d'authentication,
il est aussi recommandé que vous stockiez le mot de passe digest dans une
colonne séparée du mot de passe standard hashé::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->data['entity'];

            // Make a password for digest auth.
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

Les mots de passe pour l'authentification digest ont besoin d'un peu plus
d'informations que les autres mots de passe hashés, selon la RFC sur
l'authentification digest.

.. note::

    Le troisième paramètre de DigestAuthenticate::password() doit correspondre
    à la valeur de config 'realm' définie quand DigestAuthentication a été
    configurée dans AuthComponent::$authenticate. Celle-ci est
    ``env('SCRIPT_NAME')`` par défaut. Vous pouvez souhaiter utiliser une
    chaîne static si vous voulez des hashs cohérents dans plusieurs
    environnements.

Créer des Objets d'Authentification Personnalisés
-------------------------------------------------

Comme les objets d'authentification sont modulaires, vous pouvez créer des
objets d'authentification personnalisés pour votre application ou plugins.
Si par exemple vous vouliez créer un objet d'authentification OpenID, dans
**src/Auth/OpenidAuthenticate.php**, vous pourriez mettre ce qui suit::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Network\Request;
    use Cake\Network\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(Request $request, Response $response)
        {
            // Faire les trucs d'OpenID ici.
            // Retourne un tableau de l user si ils peuvent authentifier
            // l utilisateur
            // Retourne false dans le cas contraire
        }
    }

Les objets d'authentification devraient retourner ``false`` s'ils ne peuvent
identifier l'utilisateur et un tableau d'information utilisateur s'ils le
peuvent. Il n'est pas utile d'étendre ``BaseAuthenticate``, simplement
votre objet d'identification doit implémenter
``Cake\Event\EventListenerInterface``. La class ``BaseAuthenticate`` fournit un
nombre de méthode très utiles communément utilisées. Vous pouvez aussi
implémenter une méthode ``getUser()`` si votre objet d'identification doit
supporter des authentifications sans cookie ou sans état (stateless). Regardez
les sections portant sur l'authentification digest et basic plus bas pour plus
d'information.

``AuthComponent`` lance maintenant deux événements``Auth.afterIdentify`` et
``Auth.logout`` respectivement après qu'un utilisateur a été identifié et
avant qu'un utilisateur ne soit déconnecté. Vous pouvez définir une fonction de
callback pour ces événements en retournant un tableau de mapping depuis la
méthode ``implementedEvents()`` de votre classe d'authentification::

    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterIdentify',
            'Auth.logout' => 'logout'
        ];
    }

Utilisation d'Objets d'Authentification Personnalisés
-----------------------------------------------------

Une fois votre objet d'authentification créé, vous pouvez les utiliser
en les incluant dans le tableau d'authentification AuthComponents::

    $this->Auth->config('authenticate', [
        'Openid', // objet d'authentification de app
        'AuthBag.Openid', // objet d'identification de plugin.
    ]);

.. note::
    Notez qu'en utilisant la notation simple, il n'y a pas le mot
    'Authenticate' lors de l'instantiation de l'objet d'authentification. A la
    place, si vous utilisez les namespaces, vous devrez définir le namespace
    complet de la classe (y compris le mot 'Authenticate').

Gestion des Requêtes non Authentifiées
--------------------------------------

Quand un utilisateur non authentifié essaie d'accéder à une page protégée en
premier, la méthode ``unauthenticated()`` du dernier authentificateur dans la
chaîne est appelée. L'objet d'authentification peut gérer la réponse d'envoi
ou la redirection appropriée en retournant l'objet response pour indiquer
qu'aucune action suivante n'est nécessaire du fait de l'ordre dans lequel vous
spécifiez l'objet d'authentification dans les propriétés de ``authenticate``.

Si l'authentificateur retourne null, `AuthComponent` redirige l'utilisateur vers
l'action login. Si c'est une requête ajax et ``ajaxLogin`` est spécifiée,
cet element est rendu sinon un code de statut HTTP 403 est retourné.

Afficher les Messages Flash de Auth
-----------------------------------

Pour afficher les messages d'erreur de session que Auth génère, vous devez
ajouter les lignes de code suivante dans votre layout. Ajoutez les deux lignes
suivantes au fichier **src/Template/Layouts/default.ctp** dans la section body::

    echo $this->Flash->render();
    echo $this->Flash->render('auth');

Vous pouvez personnaliser les messages d'erreur et les réglages que le
component Auth ``AuthComponent`` utilise. En utilisant ``flash``,
vous pouvez configurer les paramètres que le component Auth utilise pour
envoyer des messages flash. Les clés disponibles sont

- ``key`` - La clé à utiliser, 'auth' par défaut.
- ``params`` - Le tableau des paramètres supplémentaires à utiliser, [] par
  défaut.

En plus des paramètres de message flash, vous pouvez personnaliser les autres
messages d'erreurs que le component AuthComponent utilise. Dans la partie
beforeFilter de votre controller ou dans le paramétrage du component, vous
pouvez utiliser ``authError`` pour personnaliser l'erreur à utiliser quand
l'authentification échoue::

    $this->Auth->config('authError', "Désolé, vous n'êtes pas autorisés à accéder à cette zone.");

Parfois, vous voulez seulement afficher l'erreur d'autorisation après que
l'user se soit déjà connecté. Vous pouvez supprimer ce message en configurant
sa valeur avec le booléen ``false``.

Dans le beforeFilter() de votre controller ou dans les configurations du
component::

    if (!$this->Auth->user()) {
        $this->Auth->config('authError', false);
    }

.. _hashing-passwords:

Hachage des Mots de Passe
-------------------------

Vous êtes responsable du hashage des mots de passe avant qu'ils soient stockés
dans la base de données, la façon la plus simple est d'utiliser une fonction
directrice (setter) dans votre entity User::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
              return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

AuthComponent est configuré par défaut pour utiliser ``DefaultPasswordHasher``
lors de la validation des informations d'identification de l'utilisateur si
aucune configuration supplémentaire est requise afin d'authentifier les
utilisateurs.

``DefaultPasswordHasher`` utilise l'algorithme de hashage bcrypt en interne,
qui est l'une des solutions les plus fortes pour hasher un mot de passe dans
l'industrie. Bien qu'il soit recommandé que vous utilisiez la classe de hash
de mot de passe, il se peut que vous gériez une base de données d'utilisateurs
dont les mots de passe ont été hashés différemment.

Créer des Classes de Hash de Mot de Passe Personnalisé
------------------------------------------------------

Pour utiliser un hasher de mot de passe différent, vous devez créer la classe
dans **src/Auth/LegacyPasswordHasher.php** et intégrer les méthodes ``hash()``
et ``check()``. Cette classe doit étendre la classe ``AbstractPasswordHasher``::

    namespace App\Auth;

    use Cake\Auth\AbstractPasswordHasher;

    class LegacyPasswordHasher extends AbstractPasswordHasher
    {

        public function hash($password)
        {
            return sha1($password);
        }

        public function check($password, $hashedPassword)
        {
            return sha1($password) === $hashedPassword;
        }
    }

Ensuite, vous devez configurer AuthComponent pour utiliser votre propre
hasher de mot de passe::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Legacy',
                    ]
                ]
            ]
        ]);
    }

Supporter des systèmes légaux est une bonne idée mais il est encore mieux de
garder votre base de données avec les derniers outils de sécurité. La section
suivante va expliquer comment migrer d'un algorithme de hash vers celui par
défaut de CakePHP.

Changer les Algorithmes de Hashage
----------------------------------

CakePHP fournit un moyen propre de migrer vos mots de passe utilisateurs
d'un algorithme vers un autre, ceci est possible avec la classe
``FallbackPasswordHasher``. Supposons que vous migriez votre application depuis
CakePHP 2.x qui utilise des hash de mot de passe ``sha1``, vous pouvez
configurer le AuthComponent comme suit::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    }

Le premier nom qui apparait dans la clé ``hashers`` indique quelle classe
est la préférée et elle réservera les autres dans la liste si la
vérification n'est pas un succès.

Quand vous utilisez ``WeakPasswordHasher``, vous devez définir la valeur de
configuration ``Security.salt`` pour vous assurer que les mots de passe sont
bien chiffrés avec cette valeur salt.

Afin de mettre à jour les anciens mot de passe des utilisateurs à la volée, vous
pouvez changer la fonction login selon::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                if ($this->Auth->authenticationProvider()->needsPasswordRehash()) {
                    $user = $this->Users->get($this->Auth->user('id'));
                    $user->password = $this->request->data('password');
                    $this->Users->save($user);
                }
                return $this->redirect($this->Auth->redirectUrl());
            }
            ...
        }
    }

Comme vous pouvez le voir, nous définissons le mot de passe en clair à nouveau
pour que la fonction directrice (setter) dans l'entity hashe le mot de passe
comme montré dans les exemples précédents et sauvegarde ensuite l'entity.

Hachage des Mots de Passe pour l'Authentification Digest
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Puisque l'authentification Digest nécessite un mot de passe haché dans un
format défini par la RFC, afin d'hacher correctement un mot de
passe pour l'utilisation de l'authentification Digest, vous devriez utilisez
la fonction spéciale ``DigestAuthenticate``. Si vous vous apprêtez à combiner
l'authentification Digest avec d'autres stratégies d'authentifications, il
est aussi recommandé de stocker le mot de passe  Digest dans une colonne
séparée, pour le hachage normal de mot de passe::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {

        public function beforeSave(Event $event)
        {
            $entity = $event->data['entity'];

            // Make a password for digest auth.
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

Les mots de passe pour l'authentification Digest ont besoin d'un peu plus
d'information que pour d'autres mots de passe hachés, basé sur le RFC pour
l'authentification Digest.

.. note::

    Le troisième paramètre de DigestAuthenticate::password() doit correspondre
    à la valeur de la configuration 'realm' définie quand DigestAuthentication
    était configuré dans AuthComponent::$authenticate. Par défaut à
    ``env('SCRIPT_NAME')``. Vous devez utiliser une chaîne statique si vous
    voulez un hachage permanent dans des environnements multiples.

Connecter les Utilisateurs Manuellement
---------------------------------------

.. php:method:: setUser(array $user)

Parfois, le besoin se fait sentir de connecter un utilisateur manuellement,
par exemple juste après qu'il se soit enregistré dans votre application. Vous
pouvez faire cela en appelant ``$this->Auth->setUser()`` avec les données
utilisateur que vous voulez pour la 'connexion'::

    public function register()
    {
        $user = $this->Users->newEntity($this->request->data);
        if ($this->Users->save($user)) {
            $this->Auth->setUser($user->toArray());
            return $this->redirect([
                'controller' => 'Users',
                'action' => 'home'
            ]);
        }
    }

.. warning::

    Assurez-vous d'ajouter manuellement le nouveau User id au tableau passé
    à la méthode de ``setUser()``. Sinon vous n'aurez pas l'id utilisateur
    disponible.

Accéder à l'Utilisateur Connecté
--------------------------------

.. php:method:: user($key = null)

Une fois que l'utilisateur est connecté, vous avez souvent besoin
d'information particulière à propos de l'utilisateur courant. Vous pouvez
accéder à l'utilisateur en cours de connexion en utilisant
``AuthComponent::user()``::

    // Depuis l'intérieur du controler
    $this->Auth->user('id');

Si l'utilisateur courant n'est pas connecté ou que la clé n'existe pas,
la valeur null sera retournée.

Déconnexion des Utilisateurs
----------------------------

.. php:method:: logout()

Éventuellement, vous aurez besoin d'un moyen rapide pour dés-authentifier
les utilisateurs et les rediriger où ils devraient aller. Cette méthode
est aussi très pratique si vous voulez fournir un lien 'Déconnecte-moi'
à l'intérieur de la zone membres de votre application::

    public function logout()
    {
        $this->redirect($this->Auth->logout());
    }

La déconnexion des utilisateurs connectés avec l'authentification Basic
ou Digest est difficile à accomplir pour tous les clients. La plupart
des navigateurs retiennent les autorisations pendant qu'il restent ouvert.
Certains navigateurs peuvent être forcés en envoyant un code 401. Le
changement du realm de l'authentification est une autre solution qui
fonctionne pour certain clients.

Décider quand lancer l'Authentification
---------------------------------------

Dans certains cas, vous aurez peut-être envie d'utiliser ``$this->Auth->user()``
dans la méthode ``beforeFilter(Event $event)``. C'est possible en utilisant la
clé de config ``checkAuthIn``. Ce qui suit modifie les vérifications initiales
d'authentification qui doivent être faites pour un event en particulier::

    //Définit AuthComponent pour authentifier dans initialize()
    $this->Auth->config('checkAuthIn', 'Controller.initialize');

La valeur par défaut pour ``checkAuthIn`` est ``'Controller.startup'`` - mais en
utilisant ``'Controller.initialize'``, l'authentification initiale est faite
avant la méthode ``beforeFilter()``.

.. _authorization-objects:

Autorisation
============

L'autorisation est le processus qui permet de s'assurer qu'un utilisateur
identifié/authentifié est autorisé à accéder aux ressources qu'il demande.
S'il est activé, ``ÀuthComponent`` peut vérifier automatiquement des
gestionnaires d'autorisations et veiller à ce que les utilisateurs connectés
soient autorisés à accéder aux ressources qu'ils demandent. Il y a plusieurs
gestionnaires d'autorisations intégrés et vous pouvez créer vos propres
gestionnaires pour votre application ou comme faisant partie d'un plugin par
exemple.

- ``ControllerAuthorize`` appelle ``isAuthorized()`` sur le controller actif
  et utilise ce retour pour autoriser un utilisateur. C'est souvent le moyen
  le plus simple d'autoriser les utilisateurs.

.. note::

    Les adaptateurs ``ActionsAuthorize`` & ``CrudAuthorize`` disponibles dans
    CakePHP 2.x ont été déplacés dans un plugin séparé
    `cakephp/acl <https://github.com/cakephp/acl>`_.

Configurer les Gestionnaires d'Autorisation
-------------------------------------------

Vous configurez les gestionnaires d'autorisation en utilisant la clé de config
``authorize``. Vous pouvez configurer un ou plusieurs gestionnaires pour
l'autorisation. L'utilisation de plusieurs gestionnaires vous donne la
possibilité d'utiliser plusieurs moyens de vérifier les autorisations. Quand les
gestionnaires d'autorisation sont vérifiés, ils sont appelés dans l'ordre où ils
sont déclarés. Les gestionnaires devraient retourner ``false``, s'il ne sont pas
capable de vérifier les autorisations ou bien si la vérification a échoué. Les
gestionnaires devraient retourner ``true`` s'ils sont capables de vérifier avec
succès les autorisations. Les gestionnaires seront appelés dans l'ordre jusqu'à
ce que l'un d'entre eux retourne ``true``. Si toutes les vérifications échouent,
l'utilisateur sera redirigé vers la page d'où il vient. Vous pouvez également
stopper les autorisations en levant une exception. Vous aurez besoin de traiter
toutes les exceptions levées et de les manipuler.

Vous pouvez configurer les gestionnaires d'autorisations dans l'une des méthodes
``beforeFilter()`` ou ``initialize()`` de votre controller. Vous pouvez passer
les informations de configuration dans chaque objet d'autorisation en utilisant
un tableau::

    // paramétrage Basique
    $this->Auth->config('authorize', ['Controller']);

    // passage de paramètre
    $this->Auth->config('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Tout comme avec ``authenticate``, ``authorize``, vous pouvez utiliser la clé
``all`` pour vous aider à garder un code propre. Cette clé spéciale vous aide à
définir les paramètres qui sont passés à chaque objet attaché. La clé ``all``
est aussi exposée comme ``AuthComponent::ALL``::

    // Passer la configuration en utilisant 'all'
    $this->Auth->config('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

Dans l'exemple ci-dessus, à la fois l'``Action`` et le ``Controller`` auront
les paramètres définis pour la clé 'all'. Chaque paramètre passé à un objet
d'autorisation spécifique remplacera la clé correspondante dans la clé 'all'.

Si un utilisateur authentifié essaie d'aller à une URL pour laquelle il n'est
pas autorisé, il est redirigé vers l'URL de référence. Si vous ne voulez pas
cette redirection (souvent nécessaire quand vous utilisez un adaptateur
d'authentification stateless), vous pouvez définir l'option de configuration
``unauthorizedRedirect`` à ``false``. Cela fait que AuthComponent lance une
``ForbiddenException`` au lieu de rediriger.

Création d'Objets Authorize Personnalisés
-----------------------------------------

Parce que les objets authorize sont modulables, vous pouvez créer des objets
authorize personnalisés dans votre application ou plugins. Si par exemple
vous voulez créer un objet authorize LDAP dans **src/Auth/LdapAuthorize.php**,
vous pourriez mettre cela::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Network\Request;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, Request $request)
        {
            // Faire des choses pour ldap ici.
        }
    }

Les objets Authorize devraient retourner ``false`` si l'utilisateur se voit
refuser l'accès ou si l'objet est incapable de faire un contrôle. Si l'objet
est capable de vérifier l'accès de l'utilisateur, ``true`` devrait être
retourné. Il n'est pas nécessaire d'étendre ``BaseAuthorize``,  il faut
simplement que votre objet authorize implémente la méthode ``authorize()``.
La classe ``BaseAuthorize`` fournit un nombre intéressant de méthodes utiles
qui sont communément utilisées.

Utilisation d'Objets Authorize Personnalisés
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fois que vous avez créé votre objet authorize personnalisé, vous pouvez
l'utiliser en l'incluant dans le tableau authorize::

    $this->Auth->config('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Ne pas Utiliser d'Autorisation
------------------------------

Si vous souhaitez ne pas utiliser les objets d'autorisation intégrés et que vous
voulez gérer les choses entièrement à l'extérieur du Component Auth
(AuthComponent), vous pouvez définir
``$this->Auth->config('authorize', false);``. Par défaut, le component Auth
démarre avec ``authorize`` à ``false``. Si vous n'utilisez pas de schéma
d'autorisation, assurez-vous de vérifier les autorisations vous-même dans la
partie beforeFilter de votre controller ou avec un autre component.

Rendre des Actions Publiques
----------------------------

.. php:method:: allow($actions = null)

Il y a souvent des actions de controller que vous souhaitez laisser entièrement
publiques ou qui ne nécessitent pas de connexion utilisateur. Le component Auth
(AuthComponnent) est pessimiste et par défaut interdit l'accès. Vous pouvez
marquer des actions comme publique en utilisant ``AuthComponent::allow()``. En
marquant les actions comme publique, le component Auth ne vérifiera pas la
connexion d'un utilisateur, ni n'autorisera la vérification des objets::

    // Permet toutes les actions
    $this->Auth->allow();

    // Ne permet que l'action view.
    $this->Auth->allow('view');

    // Ne permet que les actions view et index.
    $this->Auth->allow(['view', 'index']);

En l'appellant sans paramètre, vous autorisez toutes les actions à être
publique. Pour une action unique, vous pouvez fournir le nom comme une chaine,
sinon utiliser un tableau.

.. note::

    Vous ne devez pas ajouter l'action "login" de votre ``UsersController``
    dans la liste des allow. Le faire entraînera des problèmes sur le
    fonctionnement normal de ``AuthComponent``.

Fabriquer des Actions qui requièrent des Autorisations
------------------------------------------------------

.. php:method:: deny($actions = null)

Par défaut, toutes les actions nécessitent une authorisation. Cependant, si
après avoir rendu les actions publiques, vous voulez révoquer les accès publics,
vous pouvez le faire en utilisant ``AuthComponent::deny()``::

    // retire toutes les actions .
    $this->Auth->deny();

    // retire une action
    $this->Auth->deny('add');

    // retire un groupe d'actions.
    $this->Auth->deny(['add', 'edit']);

En l'appellant sans paramètre, cela interdira toutes les actions. Pour une
action unique, vous pouvez fournir le nom comme une chaine, sinon utiliser un
tableau.

Utilisation de ControllerAuthorize
----------------------------------

ControllerAuthorize vous permet de gérer les vérifications d'autorisation dans
le callback d'un controller. C'est parfait quand vous avez des autorisations
très simples ou que vous voulez utiliser une combinaison models + components
pour faire vos autorisations et que vous ne voulez pas créer un objet authorize
personnalisé.

Le callback est toujours appelé  ``isAuthorized()`` et devrait retourner un
booléen pour indiquer si l'utilisateur est autorisé ou pas à accéder aux
ressources de la requête. Le callback est passé à l'utilisateur actif, ainsi
il peut donc être vérifié::

    class AppController extends Controller
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // Chacun des utilisateurs enregistrés peut accéder aux fonctions publiques
            if (empty($this->request->params['prefix'])) {
                return true;
            }

            // Seulement les administrateurs peuvent accéder aux fonctions d'administration
            if ($this->request->params['prefix'] === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // Par défaut n'autorise pas
            return false;
        }
    }

Le callback ci-dessus fournirait un système d'autorisation très simple où seuls
les utilisateurs ayant le rôle d'administrateur pourraient accéder aux actions
qui ont le préfixe admin.

Options de Configuration
========================

Les configurations suivantes peuvent toutes être définies soit dans la méthode
``initialize()`` de votre controller, soit en utilisant
``$this->Auth->config()`` dans votre ``beforeFilter()``:

ajaxLogin
    Le nom d'une vue optionnelle d'un élément à rendre quand une requête AJAX
    est faite avec une session expirée invalide.
allowedActions
    Les actions du controller pour lesquelles la validation de l'utilisateur
    n'est pas nécessaire.
authenticate
    Défini comme un tableau d'objets d'identifications que vous voulez utiliser
    quand les utilisateurs de connectent. Il y a plusieurs objets
    d'authentification dans le noyau, cf la section
    :ref:`authentication-objects`.
authError
    Erreur à afficher quand les utilisateurs font une tentative d'accès à un
    objet ou une action à laquelle ils n'ont pas accès.

    Vous pouvez supprimer les messages authError de l'affichage par défaut
    en mettant cette valeur au booléen ``false``.
authorize
    Défini comme un tableau d'objets d'autorisation que vous voulez utiliser
    quand les utilisateurs sont autorisés sur chaque requête, cf la section
    :ref:`authorization-objects`
flash
    Paramétrage à utiliser quand Auth à besoin de faire un message flash avec
    ``FlashComponent::set()``. Les clés disponibles sont:

    - ``element`` - L'élément à utiliser , par défaut à 'default'.
    - ``key`` - La clé à utiliser, par défaut à 'auth'.
    - ``params`` - Un tableau de paramètres supplémentaires à utiliser par
      défaut à []

loginAction
    Une URL (définie comme une chaîne de caractères ou un tableau) pour
    l'action du controller qui gère les connexions. Par défaut à
    ``/users/login``.
loginRedirect
    L' URL (définie comme une chaîne de caractères ou un tableau) pour l'action
    du controller où les utilisateurs doivent être redirigés après la
    connexion. Cette valeur sera ignorée si l'utilisateur à une valeur
    ``Auth.redirect`` dans sa session.
logoutRedirect
    L'action par défaut pour rediriger l'utilisateur quand il se déconnecte.
    Lorsque le component Auth ne gère pas les redirection post-logout,
    une URL de redirection sera retournée depuis
    :php:meth:`AuthComponent::logout()`. Par défaut à ``loginAction``.
unauthorizedRedirect
    Contrôle la gestion des accès non autorisés. Par défaut, un utilisateur
    non autorisé est redirigé vers l'URL référente, ``loginAction`` ou ``/``.
    Si défini à ``false``, une exception ForbiddenException est lancée au lieu
    de la redirection.
storage
    Classe de stockage à utiliser pour faire persister les enregistrements
    utilisateurs. Lors de l'utilisation d'un authenticator personnalisé,
    vous devriez définir cette option à ``Memory``. Par défaut à ``Session``.
    Vous pouvez passer des options de config pour stocker une classe en
    utilisant le format de tableau. Par exemple, pour utiliser une clé de
    session personnalisée, vous pouvez définir ``storage`` avec
    ``['className' => 'Session', 'key' => 'Auth.Admin']``.
checkAuthIn
    Le nom de l'event pour lequel les vérifications de l'authentification
    doivent être faites. Défaut à ``Controller.startup``. Vous pouvez le
    spécifier à ``Controller.initialize`` si vous souhaitez que les
    vérifications soient faites avant que l'action ``beforeFilter()`` du
    controller soit executée.

Aussi, ``$this->Auth->config()`` vous permet d'obtenir une valeur de
configuration en appelant seulement l'option de configuration::

    $this->Auth->config('loginAction');

    $this->redirect($this->Auth->config('loginAction'));

Utile si vous souhaitez rediriger un utilisateur sur la page ``login`` par
exemple. Sans option, la configuration complète sera retournée.

Tester des Actions Protégées par AuthComponent
==============================================

Regardez la section :ref:`testing-authentication` pour avoir des astuces sur
la façon de tester les actions de controller qui sont protégées par
``AuthComponent``.

.. meta::
    :title lang=fr: Authentification
    :keywords lang=fr: authentication handlers,array php,basic authentication,web application,different ways,credentials
