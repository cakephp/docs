Tutoriel CMS - Authentification
###############################

Maintenant que nous avons des utilisateurs dans notre CMS, nous devons leur donner
la possibilité de se connecter et appliquer une gestion basique de contrôle d'accès
à la création et à la modification d'articles.

Ajouter la Connexion
====================

Dans CakePHP, l'authentification est généré via :doc:`/controllers/components`.
Les Components peuvent être considérés comme un moyen de créer des morceaux de
code réutilisables pour les controllers en leur donnant un concept ou une
fonctionnalité spécifique. Les Components peuvent se greffer au cycle de vie des
événements des controllers et intéragir avec l'application de cette manière.
Pour commencer, nous allons ajouter :doc:`AuthComponent
</controllers/components/authentication>` à notre application. Puisque nous
voulons que les méthodes create, update et delete requierent l'authentification,
nous allons ajouter AuthComponent dans notre AppController::

    // Dans src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            // Code existant

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // Si pas authorisé, on les renvoit sur la page sur laquelle ils étaient
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Permet à l'action "display" de notre PagesController de continuer
            // à fonctionner. Autorise également les actions "read-only".
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }

De cette manière, nous disons à CakePHP de charger les Components ``Flash`` et
``Auth``. De plus, nous avons personnaliser la configuration de AuthComponent
car notre tables d'utilisateurs (users), utilise le champ ``email`` comme
identifiant. À partir de maintenant, si vous vous rendez sur n'importe laquelle
des URLs protégées, comme ``/articles/add``, vous allez être redirigé sur
**/users/login**, ce qui devrait vous afficher une page d'erreur puisque nous
n'avons pas encore écrit le code qui gère cette page. Créons maintenant l'action
login::

    // Dans src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Votre identifiant ou votre mot de passe est incorrect.');
        }
    }

Et dans **src/Template/Users/login.ctp**, ajoutez::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Connexion') ?>
    <?= $this->Form->end() ?>

.. note::

   La méthode ``control()`` est disponible depuis 3.4. Pour les versions précédentes,
   utilisez la méthode ``input()`` à la place.

Maintenant que nous avons un formulaire de connexion basique, nous devrions être
capable de nous connecter avec un utilisateur qui a un mot de passe hashé.

.. note::

    Si aucun de vos utilisateur a un mot de passe hashé, commentez le bloc
    ``loadComponent('Auth')`` et les appels à ``$this->Auth->allow()``.
    Puis allez éditer un utilisateur pour lui sauvegarder un nouveau mot de passe.
    Après avoir sauvegardé le mot de passe pour l'utilisateur, décommentez les
    lignes que vous venez tout juste de commenter.

Avant de vous connectez, visitez ``/articles/add``. Puisque l'action n'est pas
autorisée, vous serez redirigé sur la page de connexion. Après vous être connecté
CakePHP vous redirigera automatiquement sur ``/articles/add``.

Ajout de la Déconnexion
=======================

Maintenant que vos utilisateurs peuvent se connecter, il faut leur donner la possibilité
de se connecter. Ajoutez le code suivant dans le ``UsersController``::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('Vous avez été déconnecté.');
        return $this->redirect($this->Auth->logout());
    }

Ce code ajoute l'action ``logout`` à la liste des actions qui ne nécessitent pas
d'être authentifié et implémente la logique de déconnexion. Vous pouvez vous rendre
à l'adresse ``/users/logout`` pour vous déconnecter. Vous serez ensuite redirigé
sur la page de connexion.

Autoriser la Création de Compte
===============================

Si vous n'êtes pas connecté et essayez de visiter **/users/add**, vous serez
redirigé sur la page de connexion. Puisque nous voulons autoriser nos utilisateurs
à créer un compte sur notre application, ajoutez ceci à votre ``UsersController``::

    public function initialize()
    {
        parent::initialize();
        // Ajoute l'action 'add' à la liste des actions autorisées.
        $this->Auth->allow(['logout', 'add']);
    }

Le code ci-dessus indique à ``AuthComponent`` que la méthode ``add()`` du
``UsersController`` peut être visitée sans être authentifié ou avoir besoin
d'autorisation. Pour avoir une page de création plus propre, nous vous invitons
à retirer les liens et autre contenus qui n'ont plus de sens pour cette page de
création de compte. De même, nous ne nous occuperons pas des autres actions
spécifiques aux utilisateurs, mais c'est quelque chose que vous pouvez faire vous
même comme exercice.

Restreindre l'Accès aux Articles
================================

Maintenant que nos utilisateurs peuvent se connecter, nous souhaitons limiter
l'édition seulement aux articles qu'ils ont rédigé. Nous allons implémenter cette
fonctionnalité à l'aide d'un adapter 'authorization'. Puisque nos besoins sont
assez limités, nous pouvons rediger cette logique dans le  ``ArticlesController``.
Mais avant, nous devons indiquer à ``AuthComponent`` comment notre application
va gérer l'accès à nos actions. Mettez à jour votre ``AppController`` avec ceci::

    public function isAuthorized($user)
    {
        // Par défaut, on refuse l'accès.
        return false;
    }

Ensuite, nous allons indiquer à ``AuthComponent`` que nous voulons utiliser les
méthodes de hooks des controllers pour gérer *l'authorization*. Votre méthode
``AppController::initialize()`` devrait maintenant ressembler à ceci::

        public function initialize()
        {
            // Code existant code

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                // La ligne suivante a été ajoutée
                'authorize'=> 'Controller',
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // Si pas authorisé, on les renvoit sur la page sur laquelle ils étaient
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Permet à l'action "display" de notre PagesController de continuer
            // à fonctionner. Autorise également les actions "read-only".
            $this->Auth->allow(['display', 'view', 'index']);
        }

We'll default to denying access, and incrementally grant access where it makes
sense. First, we'll add the authorization logic for articles. In your
``ArticlesController`` add the following::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // The add and tags actions are always allowed to logged in users.
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // All other actions require a slug.
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // Check that the article belongs to the current user.
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }

Now if you try to edit or delete an article that does not belong to you,
you should be redirected back to the page you came from. If no error message is
displayed, add the following to your layout::

    // In src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

While the above is fairly simplistic it illustrates how you could build more
complex logic that combines the current user and request data to build flexible
authorization logic.

Fixing the Add & Edit Actions
=============================

While we've blocked access to the edit action, we're still open to users
changing the ``user_id`` attribute of articles on creation or during edit. We
will solve these problems next. First up is the ``add`` action.

When creating articles, we want to fix the ``user_id`` to be the currently
logged in user. Replace your add action with the following::

    // in src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Added: Set the user_id from the session.
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

Remember to remove the ``user_id`` control from
**src/Templates/Articles/add.ctp** as well. Next we'll update the ``edit``
action. Replace the edit method with the following::

    // in src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Added: Disable modification of user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // Get a list of tags.
        $tags = $this->Articles->Tags->find('list');

        // Set article & tags to the view context
        $this->set('tags', $tags);
        $this->set('article', $article);
    }

Here we're modifying which properties can be mass-assigned, via the options
for ``patchEntity()``. See the :ref:`changing-accessible-fields` section for
more information. Remember to remove the ``user_id`` control from
**src/Templates/Articles/edit.ctp** as we no longer need it.

Wrapping Up
===========

We've built a simple CMS application that allows users to login, post articles,
tag them, explore posted articles by tag, and applied basic access control to
articles. We've also added some nice UX improvements by leveraging the
FormHelper and ORM capabilities.

Thank you for taking the time to explore CakePHP. Next, you should learn more about
the :doc:`/orm`, or you peruse the :doc:`/topics`.
