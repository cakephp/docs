Authentification Simple et Autorisation de l'Application
########################################################

Suivez notre exemple :doc:`/tutorials-and-examples/blog/blog`, imaginons que 
nous souhaitions sécuriser l'accès de certaines urls, basées sur la connexion 
de l'utilisateur. Nous avons aussi une autre condition requise, qui est 
d'autoriser notre blog à avoir des auteurs multiples, afin que chacun d'eux 
puisse créer ses propres posts, les modifier et les supprimer selon le besoin  
interdisant d'autres auteurs à apporter des modifications sur ses messages.

Créer le code lié de tous les utilisateurs
==========================================

Premièrement, créeons une nouvelle table dans notre base de données du blog 
pour contenir les données de notre utilisateur::

    CREATE TABLE utilisateurs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nom_utilisateur VARCHAR(50),
        mot_de_passe VARCHAR(50),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nous avons respecté les conventions de CakePHP pour le nommage des tables, 
mais nous profitons d'une autre convention: en utilisant les colonnes du 
nom d'utilisateur et du mot de passe dans une table utilisateurs, CakePHP sera 
capable de configurer automatiquement la plupart des choses pour nous quand on 
réalisera la connexion de l'utilisateur.

La prochaine étape est de créer notre modèle Utilisateur, qui a la 
responsablilité de trouver, sauvegarder et valider toute donnée d'utilisateur::

    <?php
    // app/Model/Utilisateur.php
    class Utilisateur extends AppModel {
        public $name = 'Utilisateur';
        public $validate = array(
            'nom_utilisateur' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
                    'message' => 'Un nom d\'utilisateur est requis'
                )
            ),
            'mot_de_passe' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
                    'message' => 'Un mot de passe est requis'
                )
            ),
            'role' => array(
                'valid' => array(
                    'rule' => array('inList', array('admin', 'auteur')),
                    'message' => 'Merci de rentrer un rôle valide',
                    'allowEmpty' => false
                )
            )
        );
    }

Créeons aussi notre UtilisateursController, le contenu suivant correspond à la 
classe `cuisinée` basique UtilisateursController en utilisant les utilitaires 
de génération de code fournis avec CakePHP::

    <?php
    // app/Controller/UtilisateursController.php
    class UtilisateursController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add', 'logout');
        }

        public function index() {
            $this->Utilisateur->recursive = 0;
            $this->set('utilisateurs', $this->paginate());
        }

        public function view($id = null) {
            $this->Utilisateur->id = $id;
            if (!$this->Utilisateur->exists()) {
                throw new NotFoundException(__('Utilisateur invalide'));
            }
            $this->set('utilisateur', $this->Utilisateur->read(null, $id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->Utilisateur->create();
                if ($this->Utilisateur->save($this->request->data)) {
                    $this->Session->setFlash(__('L\'utilisateur a été sauvegardé'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('L\'utilisateur n\'a pas été sauvegardé. Merci de réessayer.'));
                }
            }
        }

        public function edit($id = null) {
            $this->Utilisateur->id = $id;
            if (!$this->Utilisateur->exists()) {
                throw new NotFoundException(__('Utilisateur Invalide'));
            }
            if ($this->request->is('post') || $this->request->is('put')) {
                if ($this->Utilisateur->save($this->request->data)) {
                    $this->Session->setFlash(__('L\'utilisateur a été sauvegardé'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('L\'utilisateur n\'a pas été sauvegardé. Merci de réessayer.'));
                }
            } else {
                $this->request->data = $this->Utilisateur->read(null, $id);
                unset($this->request->data['Utilisateur']['mot_de_passe']);
            }
        }

        public function delete($id = null) {
            if (!$this->request->is('post')) {
                throw new MethodNotAllowedException();
            }
            $this->Utilisateur->id = $id;
            if (!$this->Utilisateur->exists()) {
                throw new NotFoundException(__('Utilisateur invalide'));
            }
            if ($this->Utilisateur->delete()) {
                $this->Session->setFlash(__('Utilisateur supprimé'));
                $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('L\'utilisateur n'a pas été supprimé'));
            $this->redirect(array('action' => 'index'));
        }

De la même façon, nous avons crée les vues pour nos posts de blog ou en 
utilisant l'outil de génération de code, nous exécutons les vues. Dans 
le cadre de ce tutoriel, nous allons juste montrer le add.ctp::

    <!-- app/View/Utilisateurs/add.ctp -->
    <div class="utilisateurs form">
    <?php echo $this->Form->create('Utilisateur');?>
        <fieldset>
            <legend><?php echo __('Ajouter Utilisateur'); ?></legend>
        <?php
            echo $this->Form->input('nom_utilisateur');
            echo $this->Form->input('mot_de_passe');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'auteur' => 'Auteur')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Ajouter'));?>
    </div>

Authentification (Connexion et Deconnexion)
===========================================

Nous sommes maintenant prêt à ajouter notre couche d'authentification. Dans 
CakePHP, c'est géré par :php:class:`AuthComponent`, une classe responsable 
d'exiger la connexion pour certaines actions, de gérer la connexion et la 
déconnexion, et aussi d'autoriser aux utilisateurs connectés les actions 
que l'on souhaite leur voir autorisées.

Pour ajouter ce composant à votre application, ouvrez votre fichier 
``app/Controller/AppController.php`` et ajoutez les lignes suivantes::

    <?php
    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Session',
            'Auth' => array(
                'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
                'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home')
            )
        );

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

Il n'y a pas grand chose à configurer, puisque nous avons utilisé les 
conventions pour la table des utilisateurs. Nous avons juste configurer les 
urls qui seront chargées après que la connexion et la déconnexion des actions 
sont effectuées, dans notre cas, respectivement à ``/posts/`` et ``/``.

Ce que nous avons fait dans la fonction ``beforeFilter`` a été de dire au 
AuthComponent de ne pas exiger un login pour toutes les actions ``index`` 
et ``view``, dans chaque contrôleur. Nous voulons que nos visiteurs soient 
capables de lire et lister les entrées sans s'inscrire dans le site.

Maintenant, nous avons besoin d'être capable d'inscrire des nouveaux 
utilisateurs, de sauvegarder leur nom d'utilisateur et mot de passe, et plus 
important de hasher leur mot de passe afin qu'il ne soit pas stocké en 
texte plain dans notre base de données. Disons à AuthComponent de laisser 
des utilisateurs non-authentifiés d'accéder à la fonction add des utilisateurs 
et de réaliser l'action connexion et deconnexion::

    <?php
    // app/Controller/UtilisateursController.php

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('add'); // Laissons les utilisateurs d'enregistrer eux-memes
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                $this->redirect($this->Auth->redirect());
            } else {
                $this->Session->setFlash(__('Nom d\'utilisateur ou mot de passe invalide, réessayer'));
            }
        }
    }

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

Le hash du mot de passe n'est pas encore fait, ouvrez votre fichier de modèle
``app/Model/User.php`` et ajoutez ce qui suit::

    <?php
    // app/Model/Utilisateur.php
    App::uses('AuthComponent', 'Controller/Component');
    class Utilisateur extends AppModel {

    // ...

    public function beforeSave() {
        if (isset($this->data[$this->alias]['mot_de_passe'])) {
            $this->data[$this->alias]['mot_de_passe'] = AuthComponent::password($this->data[$this->alias]['mot_de_passe']);
        }
        return true;
    }

    // ...

Ainsi, maintenant à chaque fois qu'un utilisateur est sauvegardé, le mot de 
passe est hashé en utilisant le hashing fourni par défaut par la classe 
AuthComponent. Il nous manque juste un fichier template de vue pour la 
fonction de connexion, et le voilà::

    <div class="utilisateurs form">
    <?php echo $this->Session->flash('auth'); ?>
    <?php echo $this->Form->create('Utilisateur');?>
        <fieldset>
            <legend><?php echo __('Merci de rentrer votre nom d\'utilisateur et mot de passe'); ?></legend>
        <?php
            echo $this->Form->input('nom_utilisateur');
            echo $this->Form->input('mot_de_passe');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Connexion'));?>
    </div>

Vous pouvez maintenant inscrire un nouvel utilisateur en rentrant l'url 
``/users/add`` et vous connecter avec ce profil nouvellement créé en allant 
sur l'url ``/users/login``. Essayez aussi d'aller sur n'importe quel url 
qui n'a pas été explicitement autorisée telle que ``/posts/add``, vous verrez 
que l'application vous redirige automatiquement vers la page de connexion.

Et c'est tout! Cela semble trop simple pour être vrai. Retournons en arrière un 
peu pour expliquer ce qui s'est passé. La fonction ``beforeFilter`` dit au 
composant AuthComponent de ne pas exiger de connexion pour l'action ``add`` 
en plus des actions ``index`` and ``view`` qui étaient déjà autorisées dans 
la fonction ``beforeFilter`` de l'AppController.

L'action ``login`` appelle la fonction ``$this->Auth->login()`` dans 
AuthComponent, et cela fonctionne sans autre config car nous suivons les 
conventions comme mentionnées plus tôt. C'est-à-dire, avoir un modèle 
Utilisateur avec les colonnes nom_utilisateur et un mot_de_passe, et 
utiliser un formulaire posté à un contrôleur avec les données d'utilisateur. 
Cette fonction retourne si la connexion a réussi ou non, et en cas de succès, 
alors nous redirigeons l'utilisateur vers l'url configuré de redirection que 
nous utilisions quand nous avons ajouté AuthComponent à notre application.

La déconnexion fonctionne juste en allant à l'url ``/users/logout`` et 
redirigera l'utilisateur vers l'Url de Déconnexion configurée décrite 
précedemment. Cette url est le résultat de la fonction 
``AuthComponent::logout()`` en cas de succès.

Autorisation (Qui est autorisé à accéder à quoi)
================================================

Comme mentionné avant, nous convertissons ce blog en un outil multi-utilisateur 
à autorisation, et pour ce faire, nous avons besoin de modifier un peu la table 
posts pour ajouter la référence au modèle Utilisateur::

    ALTER TABLE posts ADD COLUMN utilisateur_id INT(11);

Aussi, un petit changement dans PostsController est nécessaire pour stocker 
l'utilisateur connecté courant en référence pour le post créé::

    <?php
    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            $this->request->data['Post']['utilisateur_id'] = $this->Auth->user('id'); //Ligne ajoutée
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Votre post a été sauvegardé.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

La fonction ``user()`` fournie par le composant retourne toute colonne à partir 
de l'utilisateur connecté courant. Nous avons utilisé cette méthode pour 
ajouter les données dans les infos requêtées qui sont sauvegardées.

Sécurisons maintenant notre app pour empêcher certains auteurs de modifier ou 
supprimer les posts des autres. Des règles basiques pour notre app son que les 
utilisateurs admin peuvent accéder à tout url, alors que les utilisateurs 
normaux (le role auteur) peuvent seulement accéder aux actions permises.
Ouvrez encore la classe AppController et ajoutez un peu plus d'options à la 
config de Auth::

    <?php
    // app/Controller/AppController.php

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'authorize' => array('Controller') // Ligne ajoutée
        )
    );

    public function isAuthorized($user) {
        // Admin peut accéder à toute action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Refus par défaut
        return false;
    }

Nous venons de créer un mécanisme très simple d'autorisation. Dans ce cas, les 
utilisateurs avec le role ``admin`` sera capable d'accéder à tout url dans le 
site quand ils sont connectés, mais les autres (par ex le role ``auteur``) ne 
peut rien faire d'autre par rapport aux utilisateurs non connectés.

Ce n'est pas exactement ce que nous souhaitions, donc nous avons besoin de 
déterminer et fournir plus de règles à notre méthode ``isAuthorized()``. Mais 
plutôt que de le faire dans AppController, déleguons à chaque contrôleur la 
fourniture de ces règles supplémentaires. Les règles que nous allons ajouter 
à PostsController permettront aux auteurs de créer des posts mais empêcheront 
l'édition des posts si l'auteur ne correspond pas. Ouvrez le fichier 
``PostsController.php`` et ajoutez le contenu suivant::

    <?php
    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        // Tous les utilisateurs inscrits peuvent ajouter les posts
        if ($this->action === 'add') {
            return true;
        }

        // Le propriétaire du post peut l'éditer et le supprimer
        if (in_array($this->action, array('edit', 'delete'))) {
            $postId = $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $utilisateur['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Nous écrasons maintenant l'appel ``isAuthorized()`` de AppController's et 
vérifions à l'intérieur si la classe parente autorise déjà l'utilisateur.
Si elle ne le fait pas, alors nous ajoutons juste l'autorisation d'accéder 
à l'action add, et éventuellement accés pour modifier et de supprimer.
Une dernière chose à que nous avons oubliée d'exécuter est de dire si 
l'utilisateur à l'autorisation ou non de modifier le post, nous appelons 
une fonction ``isOwnedBy()`` dans le modèle Post. C'est généralement une 
bonne pratique de déplacer autant que possible la logique dans les modèles. 
Laissons la fonction s'exécuter::

    <?php
    // app/Model/Post.php

    public function isOwnedBy($post, $utilisateur) {
        return $this->field('id', array('id' => $post, 'user_id' => $utilisateur)) === $post;
    }


Ceci conclut notre tutoriel simple sur l'authentification et les autorisations.
Pour sécuriser l'UsersController, vous pouvez suivre la même technique que nous 
faisions pour PostsController, vous pouvez aussi être plus créatif et coder 
quelque chose de plus général dans AppController basé sur vos propres règles.

Si vous avez besoin de plus de contrôle, nous vous suggérons de lire le guide 
complet Auth dans la section 
:doc:`/core-libraries/components/authentication` où vous en trouverez plus sur 
la configuration du composant, la création de classes d'autorisation 
personnalisée, et bien plus encore.

Lectures suivantes suggérées
----------------------------

1. :doc:`/console-and-shells/code-generation-with-bake` Génération basique CRUD de code
2. :doc:`/core-libraries/components/authentication`: Inscription d'utilisateur et connexion


.. meta::
    :title lang=fr: Authentification Simple et Autorisation de l'Application
    :keywords lang=fr: incrémentation auto,autorisation application,modèle utilisateur,tableau,conventions,authentification,urls,cakephp,suppression,doc,colonnes
