Tutoriel d'un Blog - Authentification
#####################################

Poursuivant notre exemple :doc:`/tutorials-and-examples/blog/blog`, imaginons
que nous souhaitions interdire aux utilisateurs non connectés de créer des
articles.

Créer la Table et le Controller pour Users
==========================================

Premièrement, créons une nouvelle table dans notre base de données blog pour
enregistrer les données de nos utilisateurs:

.. code-block:: mysql

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Si vous utilisez PostgreSQL, connectez-vous à la base de données cake_blog et
exécutez plutôt la commande SQL suivante:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created TIMESTAMP DEFAULT NULL,
        modified TIMESTAMP DEFAULT NULL
    );

Nous avons respecté les conventions de CakePHP pour le nommage des tables, mais
nous profitons d'une autre convention: en utilisant les colonnes ``email`` et
``password`` dans une table ``users``, CakePHP sera capable de
configurer automatiquement la plupart des choses pour nous quand nous
réaliserons la connexion de l'utilisateur.

La prochaine étape est de créer notre classe ``UsersTable``, qui a la
responsabilité de trouver, sauvegarder et valider toute donnée d'utilisateur::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator): Validator
        {
            return $validator
                ->notEmpty('email', "Un email est nécessaire")
                ->email('email')
                ->notEmpty('password', 'Un mot de passe est nécessaire')
                ->notEmpty('role', 'Un rôle est nécessaire')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Merci d\'entrer un rôle valide'
                ]);
        }

    }

Créons aussi notre UsersController. Le contenu suivant correspond à la
classe obtenue grâce à l'utilitaire de génération de code fourni par CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class UsersController extends AppController
    {

        public function index()
        {
            $this->set('users', $this->Users->find()->all());
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__("L'utilisateur a été sauvegardé."));

                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__("Impossible d'ajouter l\'utilisateur."));
            }
            $this->set('user', $user);
        }

    }

De la même façon que nous avons créé les vues pour nos articles en utilisant
l'outil de génération de code, nous pouvons implémenter les vues des
utilisateurs. Dans le cadre de ce tutoriel, nous allons juste montrer le
**add.php**:

.. code-block:: php

    <!-- templates/Users/add.php -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Ajouter un utilisateur') ?></legend>
            <?= $this->Form->control('email') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
        </fieldset>
    <?= $this->Form->button(__('Ajouter')); ?>
    <?= $this->Form->end() ?>
    </div>

Authentification (Connexion et Déconnexion)
===========================================

Nous sommes maintenant prêts à ajouter notre couche d'authentification. Dans
CakePHP, cette couche est gérée par le plugin ``authentication``. Commençons par
l'installer. Utilisez composer pour l'installation du plugin:

.. code-block:: console

    composer require "cakephp/authentication:^2.0"

Puis ajoutez le code suivant à la méthode ``bootstrap()`` de votre application::

    // dans la méthode bootstrap() de src/Application.php
    $this->addPlugin('Authentication');

Hachage des Mots de Passe
=========================

Ensuite, nous allons créer l'entité ``User`` et ajouter un hachage de mots de
passe. Créez le fichier d'entité **src/Model/Entity/User.php** et ajoutez ce qui
suit::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Rend les champs assignables en masse sauf pour la clé primaire "id".
        protected array $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

Maintenant, à chaque fois qu'un mot de passe est assigné à l'entité utilisateur,
il est haché en utilisant la classe ``DefaultPasswordHasher``.

Configurer l'Authentification
=============================

Il est maintenant temps de configurer le Plugin Authentication.
Le Plugin va gérer le processus d'identification en utilisant 3 classes
différentes:

* ``Application`` utilisera le Middleware Authentication et fournira un
  AuthenticationService. Il comportera toute la configuration que nous voulons
  pour définir comment nous allons vérifier les identifiants fournis, et où nous
  allons trouver les informations avec lesquelles les comparer.
* ``AuthenticationService`` sera une classe utilitaire pour vous permettre de
  configurer le processus d'authentification.
* ``AuthenticationMiddleware`` sera exécuté comme une étape de la middleware
  queue. Il s'exécute avant que vos contrôleurs soient appelés par le framework,
  et va chercher les identifiants ou preuves de connexion pour vérifier si
  l'utilisateur est connecté.

La logique d'authentification est divisée en classes spécifiques et le processus
d'authentification se met en route avant la couche de vos contrôleurs. En tout
premier, l'authentification cherche à authentifier l'utilisateur (selon la
configuration que vous aurez définie) puis injecte l'utilisateur et les
résultats d'authentification dans la requête, pour qu'ils soient consultables
par la suite.

Dans **src/Application.php**, ajoutez les imports suivants::

    // Dans src/Application.php ajoutez les imports suivants
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Psr\Http\Message\ServerRequestInterface;

Puis implémentez l'interface d'authentification dans votre classe Application::

    // dans src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

Et ajoutez ce qui suit::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        $middlewareQueue
            // ... autres middlewares ajoutés auparavant
            ->add(new RoutingMiddleware($this))
            // ajoutez Authentication après RoutingMiddleware
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => '/users/login',
            'queryParam' => 'redirect',
        ]);

        // Charger les identificateurs. S'assurer que nous vérifions les champs email et password
        $authenticationService->loadIdentifier('Authentication.Password', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ]
        ]);

        // Charger les authentificateurs. En général vous voudrez mettre Session en premier.
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configurer la connexion par formulaire pour qu'elle aille chercher
        // les champs email et password.
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => '/users/login',
        ]);

        return $authenticationService;
    }

Dans votre classe ``AppController``, ajoutez ce code::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        // AJoutez cette ligne pour vérifier le résultat de l'authentification
        // et donc verrouiller l'accès à votre site.
        $this->loadComponent('Authentication.Authentication');

Maintenant, à chaque requête, l'\ ``AuthenticationMiddleware`` va examiner la
session de la requête pour y rechercher un utilisateur authentifié. Si nous
sommes en train de charger la page ``/users/login``, il va aussi inspecter les
données envoyées par formulaire (s'il y en a) pour en extraire les identifiants
utilisateur. Par défaut, les identifiants seront extraits des champs ``email``
et ``password`` dans les données de la requête.  Le résultat de
l'authentification sera injecté dans un attribut de la requête nommé
``authentication``. Vous pouvez consulter le résultat à n'importe quel moment en
utilisant ``$this->request->getAttribute('authentication')`` depuis les actions
de vos contrôleurs. Toutes vos pages auront un accès restreint puisque
l'\ ``AuthenticationComponent`` vérifie le résultat à chaque requête. Lorsqu'il
échouera à trouver un utilisateur authentifié, il redirigera l'utilisateur vers
la page ``/users/login``. Veuillez noter qu'à ce stade, le site ne fonctionnera
pas puisque nous n'avons pas encore de page de connexion. Si vous visitez le
site, vous obtiendrez une "boucle infinie de redirections". Alors, corrigeons
ça !

Dans votre ``UsersController``, ajoutez ce code::

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // Configurer l'action login pour ne pas exiger d'authentification, et
        // ainsi empêcher un problème de boucle infinie de redirections
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // Qu'on soit en POST ou en GET, rediriger l'utilisateur s'il est déjà connecté
        if ($result->isValid()) {
            // rediriger vers /articles après une connexion réussie
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // afficher une erreur si l'utilisateur a validé le formulaire mais que
        // l'authentification a échoué
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid email or password'));
        }
    }

Ajoutez la logique du template pour votre action login::

    <!-- dans /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Merci d\'entrer vos nom d'utilisateur et mot de passe') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Se Connecter')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Ajouter un utilisateur", ['action' => 'add']) ?>
    </div>

À présent, la page de connexion va nous permettre de nous connecter correctement
dans notre application.
Testez-le en essayant d'accéder à une page quelconque de votre site. Après avoir
été redirigé vers la page ``/users/login``, entrez l'e-mail et le mot de passe
que vous aviez choisis précédemment quand vous avez créé l'utilisateur. Vous
devriez être connecté sans problème et redirigé vers la bonne page.

Nous avons encore besoin de quelques détails pour configurer notre application.
Nous voulons que toutes les pages ``view`` et ``index`` soient accessibles sans
avoir à se connecter, donc nous allons ajouter cette configuration spécifique
dans ``AppController``::

    // dans src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // pour tous les contrôleurs de notre application, rendre les actions
        // index et viex publiques en sautant l'étape d'authentification.
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);

Déconnexion
===========

Ajoutez l'action logout à votre classe ``UsersController``::

    // dans src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // Qu'on soit en POST ou en GET, rediriger l'utilisateur s'il est déjà connecté
        if ($result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

À présent vous pouvez visiter l'URL ``/users/logout`` pour vous déconnecter.
Vous devriez alors être renvoyé vers la page de connexion. Si vous êtes arrivés
à ce point, félicitations, vous avez maintenant un blog simple qui:

* Autorise les utilisateurs connectés à créer et éditer des articles.
* Autorise les utilisateurs non connectés à consulter des articles et des tags.

Lectures suivantes suggérées
----------------------------

#. :doc:`/bake/usage` Génération basique CRUD de code
#. Documentation de `Authentication Plugin </authentication/>`__.

.. meta::
    :title lang=fr: Authentification Simple
    :keywords lang=fr: incrémentation auto,autorisation application,modèle user,tableau,conventions,authentification,urls,cakephp,suppression,doc,colonnes
