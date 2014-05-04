Authentification Simple et Autorisation de l'Application
########################################################

Suivez notre exemple :doc:`/tutorials-and-examples/blog/blog`, imaginons que
nous souhaitions sécuriser l'accès de certaines URLs, basées sur la connexion
de l'user. Nous avons aussi un autre impératif : permettre à notre
blog d'avoir plusieurs auteurs, afin que chacun d'eux puisse créer ses propres
articles, les modifier et les supprimer mais ne laisser la possibilité de ne
modifier que ses propres messages.

Créer le code lié à tous les users
==================================

Premièrement, créons une nouvelle table dans notre base de données blog
pour enregistrer les données de notre user::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nous avons respecté les conventions de CakePHP pour le nommage des tables,
mais nous profitons d'une autre convention: en utilisant les colonnes du
nom d'user et du mot de passe dans une table users, CakePHP sera
capable de configurer automatiquement la plupart des choses pour nous quand nous
réaliserons la connexion de l'user.

La prochaine étape est de créer notre table Users, qui a la
responsablilité de trouver, sauvegarder et valider toute donnée d'user::

    // App/Model/Repository/UsersTable.php
    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class UsersTable extends Table {

        public function validationDefault(Validator $validator) {
            return $validator
                ->allowEmpty('username', false, 'A username is required')
                ->allowEmpty('password', false, 'A password is required')
                ->allowEmpty('role', false, 'A password is required')
                ->add('role', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

Créons aussi notre UsersController, le contenu suivant correspond à la
classe `cuisinée` basique UsersController en utilisant les utilitaires
de génération de code fournis par CakePHP::

    // App/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Error\NotFoundException;

    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

         public function index() {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid user'));
            }

            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add() {
            $user = $this->Users->newEntity($this->request->data);
            if ($this->request->is('post')) {
                if ($this->Users->save($user)) {
                    $this->Session->setFlash(__('The user has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Session->setFlash(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }

    }

De la même façon, nous avons créé les vues pour nos articles de blog ou en
utilisant l'outil de génération de code, nous pouvons ajouter les vues. Dans
le cadre de ce tutoriel, nous allons juste montrer le add.ctp:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
            <?= $this->Form->input('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
        ?>
        </fieldset>
    <?= $this->Form->submit(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Authentification (Connexion et Deconnexion)
===========================================

Nous sommes maintenant prêt à ajouter notre couche d'authentification. Dans
CakePHP, c'est géré par :php:class:`AuthComponent`, une classe responsable
d'exiger la connexion pour certaines actions, de gérer la connexion et la
déconnexion, et aussi d'autoriser aux users connectés les actions
que l'on souhaite leur voir autorisées.

Pour ajouter ce component à votre application, ouvrez votre fichier
``App/Controller/AppController.php`` et ajoutez les lignes suivantes::

    // App/Controller/AppController.php

    namespace App\Controller;

    class AppController extends Controller {
        //...

        public $components = [
            'Session',
            'Auth' => [
                'loginRedirect' => [
                    'controller' => 'articles', 
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'pages', 
                    'action' => 'display', 
                    'home'
                ]
            ]
        ];

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

Il n'y a pas grand chose à configurer, puisque nous avons utilisé les
conventions pour la table users. Nous avons juste configuré les
URLs qui seront chargées après que la connexion et la déconnexion des actions
sont effectuées, dans notre cas, respectivement à ``/articles/`` et ``/``.

Ce que nous avons fait dans la fonction ``beforeFilter`` a été de dire au
AuthComponent de ne pas exiger un login pour toutes les actions ``index``
et ``view``, dans chaque controller. Nous voulons que nos visiteurs soient
capables de lire et lister les entrées sans s'inscrire dans le site.

Maintenant, nous avons besoin d'être capable d'inscrire des nouveaux
users, de sauvegarder leur nom d'user et mot de passe, et plus
important de hasher leur mot de passe afin qu'il ne soit pas stocké en
clair dans notre base de données. Disons à AuthComponent de laisser
certains users non-authentifiés accéder à la fonction add des users
et de réaliser l'action connexion et deconnexion::

    // App/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        // Allow users to register and logout.
        $this->Auth->allow('add', 'logout');
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            }
            $this->Session->setFlash(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        return $this->redirect($this->Auth->logout());
    }

Le hash du mot de passe n'est pas encore fait, nous avons besoin d'une classe
Entity pour notre User afin de gérer sa propre logique spécifique. Créons
fichier entity dans ``App/Model/Entity/User.php`` et ajoutons ce qui suit::

    // App/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Controller\Component\Auth\SimplePasswordHasher;

    class User extends Entity {

        // ...

        public function setPassword($password) {
            return (new SimplePasswordHasher)->hash($password);
        }

        // ...
    }

Ainsi, maintenant à chaque fois qu'un user est sauvegardé, le mot de
passe est hashé en utilisant la classe SimplePasswordHasher. Il nous manque
juste un fichier template de vue pour la fonction de connexion. Ouvrez votre
fichier ``App/Template/Users/login.ctp`` et ajoutez les lignes suivantes:

.. code-block:: php

    //app/View/Users/login.ctp

    <div class="users form">
    <?= $this->Session->flash('auth') ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->input('username') ?>
            <?= $this->Form->input('password') ?>
        </fieldset>
    <?= $this->Form->end(__('Login')) ?>
    </div>

Vous pouvez maintenant inscrire un nouvel user en rentrant l'URL
``/users/add`` et vous connecter avec ce profil nouvellement créé en allant
sur l'URL ``/users/login``. Essayez aussi d'aller sur n'importe quel URL
qui n'a pas été explicitement autorisée telle que ``/articles/add``, vous verrez
que l'application vous redirige automatiquement vers la page de connexion.

Et c'est tout! Cela semble trop simple pour être vrai. Retournons en arrière un
peu pour expliquer ce qui s'est passé. La fonction ``beforeFilter`` dit au
component AuthComponent de ne pas exiger de connexion pour l'action ``add``
en plus des actions ``index`` et ``view`` qui étaient déjà autorisées dans
la fonction ``beforeFilter`` de l'AppController.

L'action ``login`` appelle la fonction ``$this->Auth->login()`` dans
AuthComponent, et cela fonctionne sans autre config car nous suivons les
conventions comme mentionnées plus tôt. C'est-à-dire, avoir un model
User avec les colonnes username et password, et
utiliser un formulaire posté à un controller avec les données d'user.
Cette fonction retourne si la connexion a réussi ou non, et en cas de succès,
alors nous redirigeons l'user vers l'URL configuré de redirection que
nous utilisions quand nous avons ajouté AuthComponent à notre application.

La déconnexion fonctionne juste en allant à l'URL ``/users/logout`` et
redirigera l'user vers l'Url de Déconnexion configurée décrite
précedemment. Cette URL est le résultat de la fonction
``AuthComponent::logout()`` en cas de succès.

Autorisation (Qui est autorisé à accéder à quoi)
================================================

Comme mentionné avant, nous convertissons ce blog en un outil multi-user
à autorisation, et pour ce faire, nous avons besoin de modifier un peu la table
articles pour ajouter la référence à la table Users::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Aussi, un petit changement dans ArticlesController est nécessaire pour stocker
l'user connecté courant en référence pour l'article créé::

    // App/Controller/ArticlesController.php
    public function add() {
        $article = $this->Articles->newEntity($this->request->data);
        if ($this->request->is('post')) {
            // Added this line
            $article->user_id = $this->Auth->user('id');
            if ($this->Articles->save($article)) {
                $this->Session->setFlash(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Session->setFlash(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

La fonction ``user()`` fournie par le component retourne toute colonne à partir
de l'user connecté courant. Nous avons utilisé cette méthode pour
ajouter les données dans les infos requêtées qui sont sauvegardées.

Sécurisons maintenant notre app pour empêcher certains auteurs de modifier ou
supprimer les articles des autres. Des règles basiques pour notre app sont que
les users admin peuvent accéder à tout URL, alors que les users
normaux (le role auteur) peuvent seulement accéder aux actions permises.
Ouvrez encore la classe AppController et ajoutez un peu plus d'options à la
config de Auth::

    // App/Controller/AppController.php

    public $components = [
        'Session',
        'Auth' => [
            'loginRedirect' => [
                'controller' => 'articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'pages',
                'action' => 'display',
                'home'
            ],
            'authorize' => ['Controller'] // Added this line
        ]
    ];

    public function isAuthorized($user) {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

Nous venons de créer un mécanisme très simple d'autorisation. Dans ce cas, les
users avec le role ``admin`` sera capable d'accéder à tout URL dans le
site quand ils sont connectés, mais les autres (par ex le role ``author``) ne
peut rien faire d'autre par rapport aux users non connectés.

Ce n'est pas exactement ce que nous souhaitions, donc nous avons besoin de
déterminer et fournir plus de règles à notre méthode ``isAuthorized()``. Mais
plutôt que de le faire dans AppController, déleguons à chaque controller la
gestion de ces règles supplémentaires. Les règles que nous allons ajouter
à ArticlesController permettront aux auteurs de créer des articles mais
empêcheront l'édition des articles si l'auteur ne correspond pas. Ouvrez le
fichier ``ArticlesController.php`` et ajoutez le contenu suivant::

    // App/Controller/ArticlesController.php

    public function isAuthorized($user) {
        // All registered users can add articles
        if ($this->action === 'add') {
            return true;
        }

        // The owner of an article can edit and delete it
        if (in_array($this->action, ['edit', 'delete'])) {
            $articleId = (int)$this->request->params['pass'][0];
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Nous surchargeons maintenant l'appel ``isAuthorized()`` de AppController's et
vérifions à l'intérieur si la classe parente autorise déjà l'user.
Si elle ne le fait pas, alors nous ajoutons juste l'autorisation d'accéder
à l'action add, et éventuellement accés pour modifier et de supprimer.
Une dernière chose à que nous avons oubliée d'exécuter est de dire si
l'user à l'autorisation ou non de modifier l'article, nous appelons
une fonction ``isOwnedBy()`` dans la table Articles. Laissons la fonction
s'exécuter::

    // App/Model/Repository/ArticlesTable.php

    public function isOwnedBy($articleId, $userId) {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }


Ceci conclut notre tutoriel simple sur l'authentification et les autorisations.
Pour sécuriser l'UsersController, vous pouvez suivre la même technique que nous
faisions pour ArticlesController, vous pouvez aussi être plus créatif et coder
quelque chose de plus général dans AppController basé sur vos propres règles.

Si vous avez besoin de plus de contrôle, nous vous suggérons de lire le guide
complet Auth dans la section
:doc:`/core-libraries/components/authentication` où vous en trouverez plus sur
la configuration du component, la création de classes d'autorisation
personnalisée, et bien plus encore.

Lectures suivantes suggérées
----------------------------

1. :doc:`/console-and-shells/code-generation-with-bake` Génération basique CRUD de code
2. :doc:`/core-libraries/components/authentication`: Inscription d'user et connexion


.. meta::
    :title lang=fr: Authentification Simple et Autorisation de l'Application
    :keywords lang=fr: incrémentation auto,autorisation application,modèle user,tableau,conventions,authentification,urls,cakephp,suppression,doc,colonnes
