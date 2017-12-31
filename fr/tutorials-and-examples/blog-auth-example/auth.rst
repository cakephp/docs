Tutoriel d'un Blog - Authentification et Autorisations
######################################################

Suivez notre exemple :doc:`/tutorials-and-examples/blog/blog`, imaginons que
nous souhaitions sécuriser l'accès de certaines URLs, basées sur la connexion de
l'utilisateur. Nous avons aussi un autre impératif : permettre à notre blog
d'avoir plusieurs auteurs, afin que chacun d'eux puisse créer ses propres
articles, les modifier et les supprimer mais ne laisser la possibilité de ne
modifier que ses propres messages.

Créer le code lié à tous les utilisateurs
=========================================

Premièrement, créons une nouvelle table dans notre base de données blog pour
enregistrer les données de notre utilisateur::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nous avons respecté les conventions de CakePHP pour le nommage des tables, mais
nous profitons d'une autre convention: en utilisant les colonnes du nom
d'utilisateur et du mot de passe dans une table users, CakePHP sera capable de
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

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', "Un nom d'utilisateur est nécessaire")
                ->notEmpty('password', 'Un mot de passe est nécessaire')
                ->notEmpty('role', 'Un role est nécessaire')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Merci de rentrer un role valide'
                ]);
        }

    }

Créons aussi notre UsersController, le contenu suivant correspond à la
classe obtenue grâce à l'utilitaire de génération de code fournis par CakePHP::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                // Avant 3.4.0 $this->request->data() etait utilisée.
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__("L'utilisateur a été sauvegardé."));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__("Impossible d'ajouter l'utilisateur."));
            }
            $this->set('user', $user);
        }

    }

De la même façon, nous avons créé les vues pour nos articles de blog en
utilisant l'outil de génération de code. Dans
le cadre de ce tutoriel, nous allons juste montrer le add.ctp:

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Ajouter un utilisateur') ?></legend>
            <?= $this->Form->control('username') ?>
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

Nous sommes maintenant prêt à ajouter notre couche d'authentification. Dans
CakePHP, c'est géré par :php:class:`Cake\\Controller\\Component\\AuthComponent`,
une classe responsable d'exiger la connexion pour certaines actions, de gérer
la connexion et la déconnexion, et aussi d'autoriser aux utilisateurs connectés
les actions que l'on souhaite leur voir autorisées.

Pour ajouter ce component à votre application, ouvrez votre fichier
**src/Controller/AppController.php** et ajoutez les lignes suivantes::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

Il n'y a pas grand chose à configurer, puisque nous avons utilisé les
conventions pour la table users. Nous avons juste configuré les
URLs qui seront chargées après que la connexion et la déconnexion des actions
sont effectuées, dans notre cas, respectivement à ``/articles/`` et ``/``.

Ce que nous avons fait dans la fonction ``beforeFilter()`` a été de dire au
AuthComponent de ne pas exiger un login pour toutes les actions ``index()``
et ``view()``, dans chaque controller. Nous voulons que nos visiteurs soient
capables de lire et lister les entrées sans s'inscrire sur le site.

Maintenant, nous avons besoin d'être capable d'inscrire des nouveaux
utilisateurs, de sauvegarder leur nom d'utilisateur et mot de passe, et plus
important de hasher leur mot de passe afin qu'il ne soit pas stocké en
clair dans notre base de données. Disons à AuthComponent de laisser
certains utilisateurs non-authentifiés accéder à la fonction add des
utilisateurs et de réaliser l'action connexion et déconnexion::

    // src/Controller/UsersController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {
        // Other methods..

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            // Allow users to register and logout.
            // You should not add the "login" action to allow list. Doing so would
            // cause problems with normal functioning of AuthComponent.
            $this->Auth->allow(['add', 'logout']);
        }

        public function login()
        {
            if ($this->request->is('post')) {
                $user = $this->Auth->identify();
                if ($user) {
                    $this->Auth->setUser($user);
                    return $this->redirect($this->Auth->redirectUrl());
                }
                $this->Flash->error(__('Invalid username or password, try again'));
            }
        }

        public function logout()
        {
            return $this->redirect($this->Auth->logout());
        }
    }

Le hash du mot de passe n'est pas encore fait, nous avons besoin d'une classe
Entity pour notre User afin de gérer sa propre logique spécifique. Créons
fichier entity dans **src/Model/Entity/User.php** et ajoutons ce qui suit::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Rend les champs assignables en masse sauf pour le champ clé primaire "id".
        protected $_accessible = [
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

Ainsi, maintenant à chaque fois qu'un utilisateur est sauvegardé, le mot de
passe est hashé en utilisant la classe ``DefaultPasswordHasher``. Il nous
manque juste un fichier template de vue pour la fonction de connexion. Ouvrez
votre fichier **src/Template/Users/login.ctp** et ajoutez les lignes suivantes:

.. code-block:: php

    <!-- src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render() ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __("Merci de rentrer vos nom d'utilisateur et mot de passe") ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Se Connecter')); ?>
    <?= $this->Form->end() ?>
    </div>

Vous pouvez maintenant inscrire un nouvel utilisateur en rentrant l'URL
``/users/add`` et vous connecter avec ce profil nouvellement créé en allant
sur l'URL ``/users/login``. Essayez aussi d'aller sur n'importe quel URL
qui n'a pas été explicitement autorisée telle que ``/articles/add``, vous verrez
que l'application vous redirige automatiquement vers la page de connexion.

Et c'est tout! Cela semble trop simple pour être vrai. Retournons en arrière un
peu pour expliquer ce qui s'est passé. La fonction ``beforeFilter()`` dit au
component AuthComponent de ne pas exiger de connexion pour l'action ``add()``
en plus des actions ``index()`` et ``view()`` qui étaient déjà autorisées dans
la fonction ``beforeFilter()`` de l'AppController.

L'action ``login()`` appelle la fonction ``$this->Auth->identify()`` dans
AuthComponent, et cela fonctionne sans autre config car nous suivons les
conventions comme mentionnées plus tôt. C'est-à-dire, avoir un model
User avec les colonnes username et password, et
utiliser un formulaire posté à un controller avec les données d'utilisateur.
Cette fonction retourne si la connexion a réussi ou non, et en cas de succès,
alors nous redirigeons l'utilisateur vers l'URL de redirection configurée que
nous utilisions quand nous avons ajouté AuthComponent à notre application.

La déconnexion fonctionne juste en allant à l'URL ``/users/logout`` et
redirigera l'utilisateur vers l'Url de Déconnexion configurée décrite
précédemment. Cette URL est le résultat de la fonction
``AuthComponent::logout()`` en cas de succès.

Autorisation (Qui est autorisé à accéder à quoi)
================================================

Comme mentionné avant, nous convertissons ce blog en un outil multi-utilisateur
à autorisation, et pour ce faire, nous avons besoin de modifier un peu la table
articles pour ajouter la référence à la table Users::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Aussi, un petit changement dans ArticlesController est nécessaire pour stocker
l'utilisateur connecté courant en référence pour l'article créé::

    // src/Controller/ArticlesController.php
    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            // Avant 3.4.0 $this->request->data() etait utilisée.
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // Ajout de cette ligne
            $article->user_id = $this->Auth->user('id');
            // Vous pourriez aussi faire ce qui suit
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été sauvegardé.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__("Impossible d'ajouter votre article."));
        }
        $this->set('article', $article);

        // Ajoute seulement la liste des catégories pour pouvoir choisir
        // une catégorie pour un article
        $categories = $this->Articles->Categories->find('treeList');
        $this->set(compact('categories'));
    }

La fonction ``user()`` fournie par le component retourne toute colonne à partir
de l'utilisateur connecté courant. Nous avons utilisé cette méthode pour
ajouter les données dans les infos requêtées qui sont sauvegardées.

Sécurisons maintenant notre app pour empêcher certains auteurs de modifier ou
supprimer les articles des autres. Des règles basiques pour notre app sont que
les utilisateurs admin peuvent accéder à tout URL, alors que les utilisateurs
normaux (le role auteur) peuvent seulement accéder aux actions permises.
Ouvrez encore la classe AppController et ajoutez un peu plus d'options à la
config de Auth::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // Ajout de cette ligne
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ]
        ]);
    }

    public function isAuthorized($user)
    {
        // Admin peuvent accéder à chaque action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Par défaut refuser
        return false;
    }

Nous venons de créer un mécanisme très simple d'autorisation. Les utilisateurs
avec le role ``admin`` pourront accéder à toutes les URL du site quand ils
sont connectés. Tous les autres utilisateurs -- ceux avec le role ``author`` --
auront le même accès que les utilisateurs qui ne sont pas loggés.

Ce n'est pas exactement ce que nous souhaitons. Nous devons fournir plus de
règles à notre méthode ``isAuthorized()``. Cependant au lieu de le faire
dans AppController, nous déléguons la gestion de ces règles supplémentaires
à chaque controller individuellement. Les règles que nous allons ajouter à
ArticlesController devraient permettre aux auteurs de créer des articles mais
évitent aux auteurs de modifier les articles qui ne leur appartiennent pas.
Ajoutez le contenu suivant à votre ``ArticlesController.php``::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // Tous les utilisateurs enregistrés peuvent ajouter des articles
        // Avant 3.4.0 $this->request->param('action') etait utilisée.
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // Le propriétaire d'un article peut l'éditer et le supprimer
        // Avant 3.4.0 $this->request->param('action') etait utilisée.
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            // Avant 3.4.0 $this->request->params('pass.0')
            $articleId = (int)$this->request->getParam('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Nous surchargeons maintenant l'appel ``isAuthorized()`` de AppController's et
vérifions à l'intérieur si la classe parente autorise déjà l'utilisateur.
Si elle ne le fait pas, alors nous ajoutons juste l'autorisation d'accéder
à l'action add, et éventuellement autorisons l'accès pour modifier et supprimer.
Une dernière chose à que nous avons oubliée de faire est de dire si
l'utilisateur à l'autorisation ou non de modifier l'article, nous appelons
une fonction ``isOwnedBy()`` dans la table Articles. Intégrons la fonction
suivante::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

Ceci conclut notre tutoriel simple sur l'authentification et les autorisations.
Pour sécuriser le Controller UsersController, vous pouvez suivre la même
technique que nous faisions pour ArticlesController, vous pouvez aussi être
plus créatif et coder quelque chose de plus général dans AppController basé sur
vos propres règles.

Si vous avez besoin de plus de contrôle, nous vous suggérons de lire le guide
complet de Auth dans la section
:doc:`/controllers/components/authentication` où vous en trouverez plus sur
la configuration du component, la création de classes d'autorisation
personnalisée, et bien plus encore.

Lectures suivantes suggérées
----------------------------

#. :doc:`/bake/usage` Génération basique CRUD de code
#. :doc:`/controllers/components/authentication`: Inscription d'utilisateur et connexion

.. meta::
    :title lang=fr: Authentification Simple et Autorisation de l'Application
    :keywords lang=fr: incrémentation auto,autorisation application,modèle user,tableau,conventions,authentification,urls,cakephp,suppression,doc,colonnes
