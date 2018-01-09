Tutoriel CMS - Authentification
###############################

Maintenant que nous avons des utilisateurs dans notre CMS, nous devons leur donner
la possibilité de se connecter et appliquer une gestion basique de contrôle d'accès
à la création et à la modification d'articles.

Ajout du Hash du Mot de Passe
-----------------------------

Si vous créez ou mettez à jour un utilisateur, vous remarquerez que les mots de
passe sont stockés en clair, ce qui est évidemment très mauvais en terme de
sécurité.

Corriger ce point nous permet de parler un peu plus de la couche model de CakePHP.
Dans CakePHP, nous séparons les méthodes qui s'occupent des collections d'objets
et d'un seul objet en différentes classes. Les méthodes qui s'occupent de
collections d'entity sont dans les classes ``Table`` tandis que les fonctionnalités
liées à un seul enregistrement sont mises dans les classes ``Entity``.

Par exemple, hasher un mot de passe se fait par enregistrement, c'est pourquoi nous
allons implémenter ce comportement dans l'objet Entity. Puisque nous voulons hasher
le mot de passe à chaque fois qu'il est défini, nous allons utiliser une méthode
mutator / setter. Par convention, CakePHP appellera les méthodes de setter chaque fois
qu'une propriété se voit définie une valeur dans une entity. Ajoutons un setter pour
le mot de passe. Dans **src/Model/Entity/User.php**, ajoutez le code suivant::

    <?php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // Ajouter cette ligne
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Tout le code de bake sera ici.

        // Ajoutez cette méthode
        protected function _setPassword($value)
        {
            if (strlen($value)) {
                $hasher = new DefaultPasswordHasher();

                return $hasher->hash($value);
            }
        }
    }

Maintenant, rendez-vous sur **http://localhost:8765/users** pour voir une liste
des utilisateurs existants. Vous pouvez modifier l'utilisateur par défaut qui a été
créé pendant le chapitre :doc:`Installation <installation>` du tutoriel. Si vous
changez le mot de passe de l'utilisateur, vous devriez voir une version hashé du
mot de passe à la place de la valeur par défaut sur l'action index ou view. CakePHP
hash les mots de passe, par défaut, avec `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_. Vous pouvez aussi utiliser
SHA-1 ou MD5 si vous travaillez sur une base de données déjà existante mais nous
vous recommandons d'utiliser bcrypt pour toutes vos nouvelles applications.

Ajouter la Connexion
====================

Dans CakePHP, l'authentification est gérée via :doc:`/controllers/components`.
Les Components peuvent être considérés comme un moyen de créer des morceaux de
code réutilisables pour les controllers en leur donnant un concept ou une
fonctionnalité spécifique. Les Components peuvent se greffer aux événements
du cycle de vie des événements des controllers et intéragir avec l'application
de cette manière. Pour commencer, nous allons ajouter :doc:`AuthComponent
</controllers/components/authentication>` à notre application. Puisque nous
voulons que les méthodes create, update et delete requièrent l'authentification,
nous allons ajouter AuthComponent dans notre AppController::

    // Dans src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            // Code existant

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
                 // Si pas autorisé, on renvoit sur la page précédente
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

    Si aucun de vos utilisateurs a un mot de passe hashé, commentez le bloc
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
de se déconnecter. Ajoutez le code suivant dans le ``UsersController``::

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
à retirer les liens et autres contenus qui n'ont plus de sens pour cette page de
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
                 // Si pas autorisé, on renvoit sur la page précédente
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Permet à l'action "display" de notre PagesController de continuer
            // à fonctionner. Autorise également les actions "read-only".
            $this->Auth->allow(['display', 'view', 'index']);
        }

Par défaut, nous empêchons l'accès et nous allons donner accès au fur et à mesure,
en fonction des cas. Pour commencer, nous allons ajouter la logique d'autorisation
pour les articles. Dans votre ``ArticlesController``, ajoutez le code suivant::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // Les actions 'add' et 'tags' sont toujours autorisés pour les utilisateur
        // authentifiés sur l'application
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // Toutes les autres actions nécessitent un slug
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // On vérifie que l'article appartient à l'utilisateur connecté
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }

Maintenant, si vous essayez de modifier ou supprimer un article qui ne vous
appartient pas, vous serez redirigé sur la page où vous étiez avant. Si aucun
message d'erreur n'apparaît, ajoutez ceci à votre layout::

    // Dans src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

Bien que le code ci-dessus soit très simple, cela démontre comment vous pouvez
facilement construire des logiques d'autorisation flexibles qui impliquent
l'utilisateur connecté et / ou les données de la requête.

Renforcer les Action Add & Edit
===============================

Bien que nous ayons bloqué l'accès de l'action edit, nous sommes toujours
vulnérables aux utilisateurs qui changeraient l'attribut ``user_id`` des
articles pendant la modification. Mais nous allons commencer par nous occuper
de l'action ``add`` en premier.

Lorsque vous créez des articles, on veut forcer le ``user_id`` à celui de
l'utilisateur actuellement connecté. Remplacer le code de votre action ``add``
par le code suivant::

    // dans src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Changé : On force le user_id à celui de la session
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été sauvegardé.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible d\'ajouter votre article.'));
        }
        $this->set('article', $article);
    }

Ensuite, nous allons nous occuper de l'action ``edit``. Remplacez le code de
l'action par ceci::

    // Dans src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // Charge les tags associés
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Ajouté : Empêche la modification du user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été modifié.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible de mettre à jour l\'article.'));
        }
        $this->set('article', $article);
    }

Ici, nous avons modifier les propriétés qui peuvent être assignées en masse
via les options de ``patchEntity()``. Référez-vous à la section :ref:`changing-accessible-fields`
pour plus de détails. Pensez également à retirer l'élément de contrôle de
``user_id`` sur **src/Templates/Articles/edit.ctp**.

Conclusion
==========

Nous avons créer une application CMS simple qui permet à nos utilisateurs de se
connecter, de poster des articles, leur ajouter des tags, récupérer les articles
par leurs tags et nous avons fini par ajouter une couche de contrôle d'accès à nos
articles. Nous avons également ajouté des améliorations UX en tirant avantage du
FormHelper et de l'ORM.

Merci d'avoir pris le temps d'explorer CakePHP. Pour les prochaines étapes de votre
apprentissage, nous vous conseillons la documentations de :doc:`l'ORM </orm>` ou bien
de vous diriger vers la section :doc:`topics </topics>`.
