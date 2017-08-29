Tutoriel de Bookmarker Part 2
#############################

Après avoir fini :doc:`la première partie de ce tutoriel
</tutorials-and-examples/bookmarks/intro>` vous devriez avoir une application
basique de bookmarking. Dans ce chapitre, nous ajouterons l'authentification
et nous allons restreindre les bookmarks pour que chaque utilisateur puisse
voir/modifier seulement ceux qui lui appartiennent.

Ajouter la Connexion
====================

Dans CakePHP, l'authentification est gérée par les
:doc:`/controllers/components`. Les components peuvent être imaginés comme des
façons de créer des parties réutilisables de code du controller pour une
fonctionnalité spécifique ou un concept. Les components peuvent aussi se lancer
dans le cycle de vie de l'event du controller et interagir avec votre
application de cette façon. Pour commencer, nous ajouterons :doc:`AuthComponent
</controllers/components/authentication>` à notre application. Nous voulons
que chaque méthode nécessite l'authentification, donc nous allons ajouter
AuthComponent dans notre AppController::

    // Dans src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
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
                // Si l'utilisateur arrive sur une page non-autorisée, on le
                // redirige sur la page précédente.
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Autorise l'action display pour que notre controller de pages
            // continue de fonctionner.
            $this->Auth->allow(['display']);
        }
    }

Nous avons seulement indiqué à CakePHP que nous souhaitions charger les
components ``Flash`` et ``Auth``. En plus, nous avons personnalisé la
configuration de AuthComponent, puisque notre table users utilise ``email``
comme username. Maintenant, si vous tapez n'importe quelle URL, vous serez
renvoyé vers **/users/login**, qui vous montrera une page d'erreur puisque
nous n'avons pas encore écrit ce code. Créons donc l'action login::

    // Dans src/Controller/UsersController.php

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Votre username ou mot de passe est incorrect.');
        }
    }

Et dans **src/Template/Users/login.ctp**, ajoutez ce qui suit::

    <h1>Connexion</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

.. note::

    La méthode ``control()`` est disponible depuis 3.4. Si vous utilisez une
    version précédente, utilisez la méthode ``input()``.

Maintenant que nous avons un formulaire simple de connexion, nous devrions
pouvoir nous connecter avec un de nos utilisateurs qui a un mot de passe
hashé.

.. note::

    Si aucun de vos utilisateurs n'a de mot de passe hashé, commentez la ligne
    ``loadComponent('Auth')``. Puis allez modifier l'utilisateur, créez-
    lui un nouveau mot de passe.

Ajouter la Déconnexion
======================

Maintenant que les personnes peuvent se connecter, vous voudrez aussi
probablement fournir un moyen de se déconnecter. Encore une fois, dans
``UsersController``, ajoutez le code suivant::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('Vous êtes maintenant déconnecté.');
        return $this->redirect($this->Auth->logout());
    }

Ce code autorise l'action ``logout`` en tant qu'action publique,
et implémente la méthode logout. Vous pouvez maintenant visiter la page
``/users/logout`` pour vous déconnecter. Vous devriez alors être renvoyé vers
la page de connexion.

Permettre de s'Enregistrer
==========================

Si vous n'êtes pas connecté et que vous essayez de visiter **/users/add** vous
serez renvoyés vers la page de connexion. Nous devrions régler cela puisque nous
voulons que les utilisateurs s'inscrivent à notre application. Dans
``UsersController``, ajoutez ce qui suit::

    public function initialize()
    {
        parent::initialize();
        // Ajoute l'action 'add' à la liste des actions autorisées.
        $this->Auth->allow(['logout', 'add']);
    }

Ce qui est au-dessus indique à ``AuthComponent`` que l'action ``add()`` *ne*
nécessite *pas* d'authentification ou d'autorisation. Vous pouvez prendre le
temps de nettoyer **Users/add.ctp** et de retirer les liens, ou continuez vers
la prochaine section. Nous ne ferons pas de fichier d'édition (edit) ou de vue
d'un utilisateur (view), ni de liste d'utilisateurs (index) dans ce tutoriel
donc ils ne fonctionneront pas puisque ``AuthComponent`` va vous refuser
l'accès pour ces actions de controller.

Restreindre l'Accès aux Bookmarks
=================================

Maintenant que les utilisateurs peuvent se connecter, nous voulons limiter
les bookmarks qu'ils peuvent voir à ceux qu'ils ont créés. Nous allons le faire
en utilisant un adaptateur 'authorization'. Puisque nos besoins sont
assez simples, nous pouvons écrire quelques lignes de code simple dans notre
``BookmarksController``. Mais avant de le faire, nous voulons dire à
AuthComponent comment notre application va autoriser les actions. Dans notre
``AppController``, ajoutez ce qui suit::

    public function isAuthorized($user)
    {
        return false;
    }

Ajoutez aussi ce qui suit dans la configuration de ``Auth`` dans
``AppController``::

    'authorize' => 'Controller',

Votre méthode ``initialize()`` doit maintenant ressembler à ceci::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',//added this line
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
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Allow the display action so our pages controller
            // continues to work.
            $this->Auth->allow(['display']);
        }

Nous allons par défaut refuser l'accès, et permettre un accès incrémental où
cela est utile. D'abord, nous allons ajouter la logique d'autorisation pour
les bookmarks. Dans notre ``BookmarksController``, ajoutez ce qui suit::

    public function isAuthorized($user)
    {
        $action = $this->request->params['action'];

        // Add et index sont toujours permises.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // Tout autre action nécessite un id.
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // Vérifie que le bookmark appartient à l'utilisateur courant.
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }


Maintenant, si vous essayez de voir, de modifier ou de supprimer un bookmark qui
ne vous appartient pas, vous devriez être redirigé vers la page d'où vous venez.
Si aucun message ne s'affiche, ajoutez la ligne suivante dans votre layout::

    // Dans src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

Vous devriez maintenant voir les messages d'erreur d'autorisation.

Régler la Vue de Liste et les Formulaires
=========================================

Alors que view et delete fonctionnent, edit, add et index ont quelques
problèmes:

#. Lors de l'ajout d'un bookmark, vous pouvez choisir l'utilisateur.
#. Lors de l'édition d'un bookmark vous pouvez choisir l'utilisateur.
#. La page de liste montre les bookmarks des autres utilisateurs.

Attaquons nous d'abord à add. Pour commencer, retirez ``control('user_id')`` de
**src/Template/Bookmarks/add.ctp**. Une fois retiré, nous allons aussi mettre à
jour l'action ``add()`` dans **src/Controller/BookmarksController.php** pour
ressembler à ceci::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('Le bookmark a été sauvegardé.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('Le bookmark ne peut être sauvegardé. Merci de réessayer.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

En définissant la propriété entity avec les données de session, nous retirons
la possibilité que l'utilisateur puisse modifier l'auteur d'un bookmark.
Nous ferons la même chose pour le formulaire et l'action edit. Votre action
``edit()`` dans **src/Controller/BookmarksController.php** devrait ressembler à
ceci::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('Le bookmark a été sauvegardé.');
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error('Le bookmark ne peut être sauvegardé. Merci de réessayer.');
            }
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

Vue de Liste
------------

Maintenant nous devons afficher les bookmarks pour l'utilisateur actuellement
connecté. Nous pouvons le faire en mettant à jour l'appel à ``paginate()``.
Faites en sorte que votre action ``index()`` dans
**src/Controller/BookmarksController.php** ressemble à ceci::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
        $this->set('_serialize', ['bookmarks']);
    }

Nous devrions aussi mettre à jour l'action ``tags()`` et la méthode finder
liée, mais nous vous laisserons ceci en exercice que vous pouvez faire
vous-même.

Améliorer l'Experience de Tag
=============================

Actuellement, ajouter des nouveaux tags est un processus difficile, puisque
``TagsController`` interdit tous les accès. Plutôt que de permettre l'accès,
nous pouvons améliorer l'UI de sélection de tag en utilisant un champ de texte
séparé par des virgules. Cela donnera une meilleure expérience à nos
utilisateurs, et utilisera quelques unes des super fonctionnalités de l'ORM.

Ajouter un Champ Computed
-------------------------

Comme nous voulons un accès simple vers les tags formatés pour une entity, nous
pouvons ajouter un champ virtuel/calculé à l'entity. Dans
**src/Model/Entity/Bookmark.php** ajoutez ce qui suit::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

Cela nous laissera l'accès à la propriété calculée ``$bookmark->tag_string``.
Nous utiliserons cette propriété dans controls plus tard. Rappelez-vous
d'ajouter la propriété ``tag_string`` dans la liste ``_accessible`` de votre
entity, puisque nous voulons la 'sauvegarder' plus tard.

Dans le fichier **src/Model/Entity/Bookmark.php**, ajoutez ``tag_string`` à
la propriété ``_accessible`` comme ceci::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];

Mettre à Jour les Vues
----------------------

Avec l'entity mise à jour, nous pouvons ajouter un nouveau *control* pour nos tags.
Dans **src/Template/Bookmarks/add.ctp** et **src/Template/Bookmarks/edit.ctp**,
remplacez l'input ``tags._ids`` existant avec ce qui suit::

    echo $this->Form->control('tag_string', ['type' => 'text']);

Persister la Chaîne Tag
-----------------------

Maintenant que nous pouvons voir les tags existants en chaîne, nous voudrions
aussi sauvegarder les données. Comme nous marquons les ``tag_string``
accessibles, l'ORM va copier ces données à partir de la requête dans notre
entity. Nous pouvons utiliser une méthode hook ``beforeSave()`` pour parser la
chaîne de tag et trouver/construire les entities liées. Ajoutez ce qui suit dans
**src/Model/Table/BookmarksTable.php**::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // Trim tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Retire tous les tags vides
        $newTags = array_filter($newTags);
        // Réduit les tags dupliqués
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // Retire les tags existants de la liste des tags nouveaux.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Ajoute les tags existants.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Ajoute les nouveaux tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

Alors que ce code est un peu plus compliqué que ce que nous avons déjà fait,
il permet de montrer la puissance de l'ORM de CakePHP. Vous pouvez facilement
manipuler les résultats de requête en utilisant les méthodes des
:doc:`/core-libraries/collections`, et gérer les scenarios où vous créez les
entities à la volée avec facilité.

Récapitulatif
=============

Nous avons élargi notre application de bookmarking pour gérer les scenarios de
contrôle d'authentification et d'autorisation/d'accès basique. Nous avons aussi
ajouté quelques améliorations UX en tirant parti du FormHelper et des capacités
de l'ORM.

Merci d'avoir pris le temps d'explorer CakePHP. Ensuite, vous pouvez finir le
tutoriel du :doc:`/tutorials-and-examples/blog/blog`, en apprendre plus sur
l':doc:`ORM </orm>` ou vous pouvez lire attentivement :doc:`/topics`.
