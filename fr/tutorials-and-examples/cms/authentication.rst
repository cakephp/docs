Tutoriel CMS - Authentification
###############################

Maintenant que nous avons des utilisateurs dans notre CMS, nous devons leur donner
la possibilité de se connecter en utilisant le plugin
`cakephp/authentication <https://book.cakephp.org/authentication/2>`__.Nous commencerons
par nous assurer que les mots de passe sont stockés en toute sécurité dans
notre base de données. Ensuite, nous allons fournir une connexion et une déconnexion en
état de marche, et permettre aux nouveaux utilisateurs de s'inscrire.

Installation du Plugin d'Authentication
=======================================

Utilisez composer pour installer le Plugin d'authentification:

.. code-block:: console

    composer require cakephp/authentication:^2.0


Ajout du Hash du Mot de Passe
-----------------------------

Vous devez avoir créé le ``Controller``, ``Table``, ``Entity`` et
les templates pour la table ``utilisateurs`` de votre base de données. Vous pouvez
le faire manuellement comme vous l'avez fait auparavant pour ArticlesController, ou
vous pouvez utiliser le Shell bake pour générer les classes pour vous en tapant:

.. code-block:: console

    bin/cake bake all users

Si vous créez ou mettez à jour un utilisateur, vous remarquerez que les mots de
passe sont stockés en clair, ce qui est évidemment très mauvais en terme de
sécurité, règlons cela.

Corriger ce point nous permet de parler un peu plus de la couche model de CakePHP.
Dans CakePHP, nous séparons les méthodes qui s'occupent des collections d'objets
et d'un seul objet en différentes classes. Les méthodes qui s'occupent de
collections d'entity sont dans les classes ``Table`` tandis que les fonctionnalités
liées à un seul enregistrement sont mises dans les classes ``Entity``.

Par exemple, hasher un mot de passe se fait enregistrement par enregistrement,
c'est pourquoi nous allons implémenter ce comportement dans l'objet Entity.
Puisque nous voulons hasher le mot de passe à chaque fois qu'il est défini, nous allons
utiliser une méthode mutator/setter. Par convention, CakePHP appellera les méthodes
de setter chaque fois qu'une propriété se voit affecter une valeur dans une entity.
Ajoutons un setter pour le mot de passe. Dans **src/Model/Entity/User.php**, ajoutez
le code suivant::

    <?php
    namespace App\Model\Entity;

    use Authentication\PasswordHasher\DefaultPasswordHasher; // Ajouter cette ligne
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // Tout le code de bake sera ici.

        // Ajoutez cette méthode
        protected function _setPassword(string $password) : ?string
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher())->hash($password);
            }
            return null;
        }
    }

Maintenant, rendez-vous sur **http://localhost:8765/users** pour voir une liste
des utilisateurs existants. N'oubliez pas que votre serveur local doit fonctionner.
Démarrez un serveur PHP autonome utilisant ``bin/cake server``.

Vous pouvez modifier l'utilisateur par défaut qui a été
créé pendant le chapitre :doc:`Installation <installation>` du tutoriel. Si vous
changez le mot de passe de l'utilisateur, vous devriez voir une version hashée du
mot de passe à la place de la valeur par défaut sur l'action index ou view. CakePHP
hashe les mots de passe, par défaut, avec `bcrypt
<https://codahale.com/how-to-safely-store-a-password/>`_. Nous recommandons
bcrypt pour toutes les nouvelles applications afin de garentir à votre application
un niveau de sécurité élevé. C'est l'
`algorithme de hachage de mot de passe recommandé pour PHP <https://www.php.net/manual/en/function.password-hash.php>`_.

.. note::

    Créez maintenant un mot de passe haché pour au moins un des comptes utilisateurs!
    Il sera nécessaire dans les prochaines étapes.
    Après avoir mis à jour le mot de passe, vous verrez une longue chaîne stockée dans la colonne du mot de passe.
    Notez que bcrypt générera un hachage différent même pour le même mot de passe enregistré deux fois.

Ajouter la Connexion
====================

Il est maintenant temps de configurer le Plugin d'authentification.
Le plugin gérera le processus d'authentification en utilisant 3 classes différentes:

* ``Application`` utilisera le middleware d'authentification et fournira un
  AuthenticationService contenant toute la configuration que nous voulons définir, comment
  nous allons vérifier les informations d'identification, et où les trouver.
* ``AuthenticationService`` sera une classe utilitaire pour vous permettre de configurer le
  processus d'authentification.
* ``AuthenticationMiddleware`` sera exécuté dans le cadre de la file d'attente du middleware,
  c'est à dire avant que vos contrôleurs ne soient traités par le framework, et collectera les
  informations d'identification et les traitera pour vérifier si l'utilisateur est authentifié.

Si vous vous en souvenez, par le passé nous utilisions :doc:`AuthComponent </controllers/components/authentication>`
afin de gérer toutes ces étapes. A présent, la logique est divisée en classes spécifiques et
le processus d'authentification se déroule avant votre couche de contrôleur. Il vérifie d'abord si l'utilisateur
est authentifié (en fonction de la configuration que vous avez fournie) et injecte l'utilisateur ainsi que le
résultat de l'authentification dans la requête afin que vous puissiez les utiliser ultérieurement.

Dans **src/Application.php**, ajoutez les imports suivants::

    // Dans src/Application.php, ajoutez les imports suivants
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Cake\Routing\Router;
    use Psr\Http\Message\ServerRequestInterface;

Ensuite, implémentez l'interface d'authentification pour votre classe ``Application```::

    // dans src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

Puis ajoutez le code suivant::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... other middleware added before
            ->add(new RoutingMiddleware($this))
            // add Authentication after RoutingMiddleware
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => Router::url('/users/login'),
            'queryParam' => 'redirect',
        ]);

        // Charge les authenticators, nous voulons celui de session en premier
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configure la vérification des données du formulaire pour choisir l'email et le mot de passe
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => Router::url('/users/login'),
            'identifier' => [
                'Authentication.Password' => [
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password',
                    ],
                ],
            ],
        ]);

        return $authenticationService;
    }

 Ajoutez le code suivant dans votre classe ``AppController``::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        // Ajoutez cette ligne pour vérifier le résultat de l'authentification et verrouiller votre site
        $this->loadComponent('Authentication.Authentication');

Désormais, à chaque demande, le ``AuthenticationMiddleware`` inspectera
la session contenue dans la requête afin d'y rechercher un utilisateur authentifié.
Si nous chargeons la page ``/users/login``, il inspectera également les données de formulaire
soumises (le cas échéant) pour extraire les informations d'identification. Par défaut, les informations
d'identification seront extraites des champs ``username`` and ``password`` dans les données de la demande.
Le résultat de l'authentification sera injecté dans un attribut de requête nommé
``authentification``. Vous pouvez consulter le résultat à tout moment en utilisant
``$this->request->getAttribute('authentication')`` à partir des actions de votre contrôleur.
Toutes vos pages seront restreintes car le ``AuthenticationComponent`` vérifie le
résultat à chaque demande. Lorsqu'il ne parvient pas à trouver un utilisateur authentifié, il redirige
l'utilisateur sur la page ``/users/login``.
Notez qu'à ce stade, le site ne fonctionnera pas car nous n'avons pas encore de page de connexion.
Si vous visitez votre site, vous obtiendrez une boucle de redirection infinie. Alors, réglons ça !

Dans votre ``UsersController``, ajoutez le code suivant::

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // Configurez l'action de connexion pour ne pas exiger d'authentification,
        // évitant ainsi le problème de la boucle de redirection infinie
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // indépendamment de POST ou GET, rediriger si l'utilisateur est connecté
        if ($result && $result->isValid()) {
            // rediriger vers /articles après la connexion réussie
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // afficher une erreur si l'utilisateur a soumis un formulaire
        // et que l'authentification a échoué
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Votre identifiant ou votre mot de passe est incorrect.'));
        }
    }

Ajoutez la logique du template pour votre action de connexion::

    <!-- dans /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Connexion</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Veuillez s\'il vous plaît entrer votre nom d\'utilisateur et votre mot de passe') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Ajouter un utilisateur", ['action' => 'add']) ?>
    </div>

Maintenant, la page de connexion nous permettra de nous connecter correctement à l'application.
Testez-le en affichant n'importe quelle page de votre site. Après avoir été redirigé
à la page ``/users/login``, saisissez l'email et le mot de passe
choisis lors de la création de votre utilisateur. Vous devriez être redirigé
avec succès après la connexion.

Nous devons ajouter quelques détails supplémentaires pour configurer notre application.
Nous voulons que toutes les pages ``view`` and ``index`` soient accessibles sans connexion,
nous allons donc ajouter cette configuration spécifique dans AppController ::

    // dans src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // pour tous les contrôleurs de notre application, rendre les actions
        // index et view publiques, en ignorant la vérification d'authentification
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

.. note::

    Si aucun de vos utilisateurs ne possède de mot de passe hashé, commentez le bloc
    ``$this->loadComponent('Authentication.Authentication')`` dans votre
    AppController ainsi que toutes les autres lignes dans lesquelles le
    composant Authenticationest est utilisé. Puis allez à ``/users/add``
    Après avoir sauvegardé le mot de passe pour l'utilisateur, décommentez les
    lignes que vous venez tout juste de commenter.

Essayez-le en visitant ``/articles/add`` avant de vous connecter! Puisque l'action
n'est pas autorisée, vous serez redirigé vers la page de connexion. Après vous être connecté
avec succès, CakePHP vous redirigera automatiquement vers ``/articles/add``.

Ajout de la Déconnexion
=======================

Ajoutez l'action de logout à la classe ``UsersController``::

    // dans src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // indépendamment de POST ou GET, rediriger si l'utilisateur est connecté
        if ($result && $result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

Vous pouvez maintenant visiter ``/users/logout`` pour vous déconnecter.
Vous devriez alors être envoyé à la page de connexion.

Autoriser la Création de Compte
===============================

Si vous n'êtes pas connecté et essayez de visiter **/users/add**, vous serez
redirigé sur la page de connexion. Puisque nous voulons autoriser nos utilisateurs
à créer un compte sur notre application, ajoutez ceci à votre ``UsersController``::

    // Ajoutez la méthode beforeFilter au UsersController
    $this->Authentication->addUnauthenticatedActions(['login', 'add']);

Le code ci-dessus indique à ``AuthenticationComponent`` que la méthode ``add()`` du
``UsersController`` peut être visitée *sans* être authentifié ou avoir besoin
d'autorisation. Vous pouvez prendre le temps de nettoyer **Users/add.php**
en retirant les liens qui n'ont plus de sens pour cette page ou passer à la section
suivante. Nous ne nous occuperons pas des actions d'édition, d'affichage ou de liste
spécifiques aux utilisateurs, mais c'est un exercice que vous
pouvez faire par vous-même.

Maintenant que les utilisateurs peuvent se connecter, nous voulons limiter les utilisateurs
à modifier uniquement les articles qui ils ont été créés par:
doc: `application des politiques d'autorisation <./autorisation>`.
