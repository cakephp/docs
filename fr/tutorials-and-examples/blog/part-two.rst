Blog Tutoriel - Ajouter la logique
**********************************

Créer un model Post
===================

La classe Model est le pain quotidien des applications CakePHP. En
créant un model CakePHP qui interagira avec notre base de données,
nous aurons mis en place les fondations nécessaires pour faire plus
tard nos opérations de lecture, d'insertion, d'édition et de suppression.

Les fichiers des classes Model de CakePHP se trouvent dans ``/app/Model``,
et le fichier que nous allons créer maintenant sera enregistré dans
``/app/Model/Post.php``. Le fichier complet devrait ressembler à ceci::

    class Post extends AppModel {
    }

La convention de nommage est vraiment très importante dans CakePHP. En nommant
notre model Post, CakePHP peut automatiquement déduire que ce model sera
utilisé dans le controller PostsController, et sera lié à la table ``posts``
de la base de données.

.. note::

    CakePHP créera dynamiquement un objet model pour vous, s'il ne trouve
    pas le fichier correspondant dans /app/Model. Cela veut aussi dire que
    si vous n'avez pas nommé correctement votre fichier (par ex. post.php ou
    posts.php au lieu de Post.php), CakePHP ne reconnaîtra pas votre
    configuration et utilisera ses objets model par défaut.

Pour plus d'informations sur les models, comme les préfixes des tables,
les callbacks, et la validation, consultez le chapitre :doc:`/models` du
manuel.


Créer un controller Posts
=========================

Nous allons maintenant créer un controller pour nos posts. Le controller est
l'endroit où s'exécutera toute la logique métier pour l'intéraction du
processus de post. En un mot, c'est l'endroit où vous jouerez avec les models
et où les tâches liées aux posts s'exécutent. Nous placerons ce nouveau
controller dans un fichier appelé ``PostsController.php`` à l'intérieur du
dossier ``/app/Controller``. Voici à quoi devrait ressembler le controller
de base::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
    }

Maintenant, ajoutons une action à notre controller. Les actions représentent
souvent une simple fonction ou une interface dans une application. Par exemple,
quand les utilisateurs requêtent www.exemple.com/posts/index (qui est
la même chose que www.exemple.com/posts/), ils pourraient s'attendre à voir une
liste de posts. Le code pour cette action devrait ressembler à quelque chose
comme ça::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

En définissant la fonction ``index()`` dans notre PostsController, les
utilisateurs peuvent accéder à cette logique en demandant
www.exemple.com/posts/index. De la même façon, si nous devions définir une
fonction appelée ``foobar()``, les utilisateurs pourrait y accéder en demandant
www.exemple.com/posts/foobar.

.. warning::

    Vous pourriez être tenté de nommer vos controllers et vos actions d'une
    certaine manière pour obtenir une certaine URL. Résistez à cette tentation.
    Suivez les conventions CakePHP (le nom des controllers au pluriel, etc.) et
    nommez vos actions de façon lisible et compréhensible. Vous pouvez lier les
    URLs à votre code en utilisant ce qu'on appelle des "routes", on le verra
    plus tard.

La seule instruction que cette action utilise est ``set()``, pour transmettre
les données du controller à la vue (que nous créerons à la prochaine étape).
La ligne définit la variable de vue appelée 'posts' qui est égale à la valeur
de retour de la méthode ``find('all')`` du model Post. Notre model Post est
automatiquement disponible via $this->Post, parce que nous avons suivi les
conventions de nommage de CakePHP.

Pour en apprendre plus sur les controllers de CakePHP, consultez le chapitre
:doc:`/controllers`.

Créer les Vues des Posts
========================

Maintenant que nous avons nos données en provenance du model, ainsi que la
logique applicative et les flux définis par notre controller, nous allons créer
une vue pour l'action "index" que nous avons créé ci-dessus.

Les vues de CakePHP sont juste des fragments de présentation "assaisonnée",
qui s'intègrent au sein d'un layout applicatif. Pour la plupart des
applications, elles sont un mélange de HTML et PHP, mais les vues peuvent aussi
être constituées de XML, CSV ou même de données binaires.

Un Layout est un code de présentation, encapsulé autour d'une vue. Ils peuvent
être définis et interchangés, mais pour le moment, utilisons juste celui par
défaut.

Vous souvenez-vous, dans la dernière section, comment nous avions assigné
la variable 'posts' à la vue en utilisant la méthode ``set()`` ?
Cela devrait transmettre les données à la vue qui ressemblerait à quelque
chose comme cela::

    // print_r($posts) affiche:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Le titre
                        [body] => Voici le contenu du post.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Encore un titre
                        [body] => Et le contenu du post qui suit.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Le retour du titre
                        [body] => C'est très excitant, non ?
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Les fichiers des vues de CakePHP sont stockés dans ``/app/View`` à l'intérieur
d'un dossier dont le nom correspond à celui du controller (nous aurons à créer
un dossier appelé 'Posts' dans ce cas). Pour mettre en forme les données de
ces posts dans un joli tableau, le code de notre vue devrait ressembler à
quelque chose comme cela

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Créé le</th>
        </tr>

        <!-- Here is where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'],
                array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
        <?php unset($post); ?>
    </table>

Vous avez sans doute remarqué l'utilisation d'un objet appelé ``$this->Html``.
C'est une instance de la classe CakePHP :php:class:`HtmlHelper`.
CakePHP est livré avec un ensemble de "helpers" (des assistants) pour les vues,
qui réalisent en un clin d'œil des choses comme le "linking" (mettre les liens
dans un texte), l'affichage des formulaires, du JavaScript et de l'AJAX. Vous
pouvez en apprendre plus sur la manière de les utiliser dans le chapitre
:doc:`/views/helpers`, mais ce qu'il est important de noter ici, c'est que la
méthode ``link()`` génèrera un lien HTML à partir d'un titre (le premier
paramètre) et d'une URL (le second paramètre).

Lorsque vous indiquez des URLs dans CakePHP, il est recommandé d'utiliser les
tableaux. Ceci est expliqué dans le chapitre des Routes. Utiliser les tableaux
dans les URLs vous permet de tirer profit des capacités de CakePHP à
ré-inverser les routes. Vous pouvez aussi utiliser les URLs relatives depuis
la base de l'application comme suit /controller/action/param1/param2.

A ce stade, vous devriez être en mesure de pointer votre navigateur sur la
page http://www.exemple.com/posts/index. Vous devriez voir votre vue,
correctement formatée avec le titre et le tableau listant les posts.

Si vous avez essayé de cliquer sur l'un des liens que nous avons créés dans
cette vue (le lien sur le titre d'un post mène à l'URL :
/posts/view/un_id_quelconque), vous avez sûrement été informé par CakePHP que
l'action n'a pas encore été définie. Si vous n'avez pas été informé, soit
quelque chose s'est mal passé, soit en fait vous aviez déjà défini l'action,
auquel cas vous êtes vraiment sournois ! Sinon, nous allons la créer sans plus
tarder dans le Controller Posts::

    // File: /app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }
    }

L'appel de ``set()`` devrait vous être familier. Notez que nous utilisons
``findById()`` plutôt que ``find('all')`` parce que nous voulons seulement
récupérer les informations d'un seul post.

Notez que notre action "view" prend un paramètre : l'ID du post que nous
aimerions voir. Ce paramètre est transmis à l'action grâce à l'URL demandée.
Si un utilisateur demande /posts/view/3, alors la valeur '3' est transmise
à la variable ``$id``.

Nous faisons aussi une petite vérification d'erreurs pour nous assurer qu'un
utilisateur accède bien à l'enregsitrement. Si un utilisateur requête
``/posts/view``, nous lancerons un ``NotFoundException`` et laisserons
le Gestionnaire d'Erreur de CakePHP ErrorHandler prendre le dessus. Nous
exécutons aussi une vérification similaire pour nous assurer que l'utilisateur
a accède à un enregistrement qui existe.

Maintenant, créons la vue pour notre nouvelle action "view" et plaçons-la
dans ``/app/View/Posts/view.ctp``.

.. code-block:: php

    <!-- Fichier : /app/View/Posts/view.ctp -->

    <h1><?php echo h($post['Post']['title']); ?></h1>

    <p><small>Créé le : <?php echo $post['Post']['created']; ?></small></p>

    <p><?php echo h($post['Post']['body']); ?></p>

Vérifiez que cela fonctionne en testant les liens de la page /posts/index
ou en affichant manuellement un post via ``/posts/view/1``.

Ajouter des Posts
=================

Lire depuis la base de données et nous afficher les posts est un bon début,
mais lançons-nous dans l'ajout de nouveaux posts.

Premièrement, commençons par créer une action ``add()`` dans le
PostsController::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Flash');
        public $components = array('Flash');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->Flash->success(__('Your post has been saved.'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(__('Unable to add your post.'));
            }
        }
    }

.. note::

    ``$this->request->is()`` prend un unique argument, qui peut être la METHOD
    request (``get``, ``put``, ``post``, ``delete``) ou toute identifier de
    request (``ajax``). Ce **n'est pas** une façon de vérifier une data postée
    spécifique. Par exemple, ``$this->request->is('book')`` ne retournera pas
    true si les data du book ont été postées.

.. note::

   Vous avez besoin d'inclure le component Flash (FlashComponent) et
   le helper Flash (FlashHelper) dans chaque controller que vous
   utiliserez. Si nécessaire, incluez-les dans le controller principal
   (AppController) pour qu'ils soient accessibles à tous les controllers.

Voici ce que fait l'action ``add()`` : si la requête HTTP est de type POST,
essayez de sauvegarder les données en utilisant le model "Post". Si pour une
raison quelconque, la sauvegarde a échouée, affichez simplement la vue. Cela
nous donne une chance de voir les erreurs de validation de l'utilisateur et
d'autres avertissements.

Chaque requête de CakePHP contient un objet ``CakeRequest`` qui est accessible
en utilisant ``$this->request``. Cet objet contient des informations utiles
sur la requête qui vient d'être reçue, et permet de contrôler les flux de votre
application. Dans ce cas, nous utilisons la méthode
:php:meth:`CakeRequest::is()` pour vérifier que la requête est de type POST.

Lorsqu'un utilisateur utilise un formulaire pour poster des données dans votre
application, ces informations sont disponibles dans ``$this->request->data``.
Vous pouvez utiliser les fonctions :php:func:`pr()` ou :php:func:`debug()` pour
les afficher si vous voulez voir à quoi cela ressemble.

Nous utilisons la méthode :php:meth:`FlashComponent::success()` du component
Flash (FlashComponent) pour définir un message dans une variable session
et qui sera affiché dans la page juste après la redirection. Dans le layout,
nous trouvons la fonction :php:func:`FlashHelper::render()` qui permet
d'afficher et de nettoyer la variable correspondante. La méthode
:php:meth:`Controller::redirect` du controller permet de rediriger vers une
autre URL. Le paramètre ``array('action' => 'index')`` sera traduit vers l'URL
/posts (dans notre cas l'action "index" du controller "Posts").
Vous pouvez vous référer à la fonction :php:func:`Router::url()` dans
`l'API <http://api.cakephp.org>`_ pour voir les différents formats d'URL
acceptés dans les différentes fonctions de CakePHP.

L'appel de la méthode ``save()`` vérifiera les erreurs de validation et
interrompra l'enregistrement si une erreur survient. Nous verrons
la façon dont les erreurs sont traitées dans les sections suivantes.

Nous appelons la méthode ``create()`` en premier afin
de réinitialiser l'état du model pour sauvegarder les nouvelles informations.
Cela ne crée pas réellement un enregistrement dans la base de données mais
réinitialise Model::$id et définit Model::$data en se basant sur le champ par
défaut dans votre base de données.

Valider les données
===================

Cake place la barre très haute pour briser la monotonie de la validation des
champs de formulaires. Tout le monde déteste le dévelopement de formulaires
interminables et leurs routines de validations. Cake rend tout cela plus facile
et plus rapide.

Pour tirer profit des fonctionnalités de validation, vous devez utiliser
le helper "Form" (FormHelper) dans vos vues. :php:class:`FormHelper` est
disponible par défaut dans toutes les vues avec la variables ``$this->Form``.

Voici le code de notre vue "add" (ajout)

.. code-block:: php

    <!-- Fichier : /app/View/Posts/add.ctp -->

    <h1>Ajouter un post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Sauvegarder le post');
    ?>

Nous utilisons le :php:class:`FormHelper` pour générer la balise
d'ouverture d'une formulaire HTML. Voici le code HTML généré par
``$this->Form->create()``::

.. code-block:: html

    <form id="PostAddForm" method="post" action="/posts/add">

Si ``create()`` est appelée sans aucun paramètre, CakePHP suppose que vous
construisez un formulaire qui envoie les données en POST à l'action ``add()``
(ou ``edit()`` quand ``id`` est dans les données du formulaire) du controller
actuel.

La méthode ``$this->Form->input()`` est utilisée pour créer des éléments de
formulaire du même nom. Le premier paramètre dit à CakePHP à quels champs ils
correspondent et le second paramètre vous permet de spécifier un large éventail
d'options - dans ce cas, le nombre de lignes du textarea. Il y a un peu
d'introspection et "d'automagie" ici : ``input()`` affichera différents
éléments de formulaire selon le champ spécifié du model.

L'appel de la méthode ``$this->Form->end()`` génère un bouton de soumission
et ajoute la balise de fermeture du formulaire. Si une chaîne de caractères est
passée comme premier paramètre de la méthode ``end()``, le helper "Form"
affichera un bouton de soumission dont le nom correspond à celle-ci. Encore
une fois, référez-vous au chapitre :doc:`/views/helpers` pour en savoir plus
sur les helpers.

A présent, revenons en arrière et modifions notre vue
``/app/View/Posts/index.ctp`` pour ajouter un lien "Ajouter un post". Ajoutez
la ligne suivante avant ``<table>``::

    <?php echo $this->Html->link(
        'Ajouter un Post',
        array('controller' => 'posts', 'action' => 'add')
    ); ?>

Vous vous demandez peut-être : comment je fais pour indiquer à CakePHP mes
exigences de validation ? Les règles de validation sont définies dans le
model. Retournons donc à notre model Post et procédons à quelques
ajustements::

    class Post extends AppModel {
        public $validate = array(
            'title' => array(
                'rule' => 'notBlank'
            ),
            'body' => array(
                'rule' => 'notBlank'
            )
        );
    }

Le tableau ``$validate`` indique à CakePHP comment valider vos données
lorsque la méthode ``save()`` est appelée. Ici, j'ai spécifié que les
deux champs "body" et "title" ne doivent pas être vides. Le moteur de
validation de CakePHP est puissant, il dispose d'un certain nombre de
règles intégrées (code de carte bancaire, adresse emails, etc.)
et d'une souplesse pour ajouter vos propres règles de validation. Pour
plus d'informations sur cette configuration, consultez le chapitre
:doc:`/models/data-validation`.

Maintenant que vos règles de validation sont en place, utilisez l'application
pour essayer d'ajouter un post avec un titre et un contenu vide afin de voir
comment cela fonctionne. Puisque que nous avons utilisé la méthode
:php:meth:`FormHelper::input()` du helper "Form" pour créer nos éléments
de formulaire, nos messages d'erreurs de validation seront affichés
automatiquement.

Editer des Posts
================

L'édition de posts : nous y voilà. Vous êtes un pro de CakePHP maintenant, vous
devriez donc avoir adopté le principe. Créez d'abord l'action puis la vue.
Voici à quoi l'action ``edit()`` du controller Posts (PostsController) devrait
ressembler::

    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }

        if ($this->request->is(array('post', 'put'))) {
            $this->Post->id = $id;
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been updated.'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('Unable to update your post.'));
        }

        if (!$this->request->data) {
            $this->request->data = $post;
        }
    }

Cette action s'assure d'abord que l'utilisateur a essayé d'accéder à un
enregistrement existant. S'il n'y a pas de paramètre ``$id`` passé, ou si le
post n'existe pas, nous lançons une ``NotFoundException`` pour que le
gestionnaire d'Erreurs ErrorHandler de CakePHP s'en occupe.

Ensuite l'action vérifie si la requête est une requête POST ou PUT. Si elle
l'est, alors nous utilisons les données POST pour mettre à jour notre
enregistrement Post, ou sortir et montrer les erreurs de validation à
l'utilisateur.

S'il n'y a pas de données définies dans ``$this->request->data``, nous le
définissons simplement dans le post récupéré précédemment.

La vue d'édition devrait ressembler à quelque chose comme cela:

.. code-block:: php

    <!-- Fichier: /app/View/Posts/edit.ctp -->

    <h1>Editer le post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->input('id', array('type' => 'hidden'));
    echo $this->Form->end('Save Post');
    ?>

Cette vue affiche le formulaire d'édition (avec les données pré-remplies) avec
les messages d'erreur de validation nécessaires.

Une chose à noter ici : CakePHP supposera que vous éditez un model si le champ
'id' est présent dans le tableau de données. S'il n'est pas présent (ce qui
revient à notre vue "add"), CakePHP supposera que vous insérez un nouveau model
lorsque ``save()`` sera appelée.

Vous pouvez maintenant mettre à jour votre vue "index" avec des liens pour
éditer des posts :

.. code-block:: php

    <!-- Fichier: /app/View/Posts/index.ctp  (lien d\'édition ajouté) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Ajouter un Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Ici se trouve la boucle de notre tableau $posts, impression de l\'info du post -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link(
                    $post['Post']['title'],
                    array('action' => 'view', $post['Post']['id'])
                ); ?>
            </td>
            <td>
                <?php echo $this->Html->link(
                    'Editer',
                    array('action' => 'edit', $post['Post']['id'])
                ); ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Supprimer des Posts
===================

A présent, mettons en place un moyen de supprimer les posts pour les
utilisateurs. Démarrons avec une action ``delete()`` dans le controller
Posts (PostsController)::

    public function delete($id) {
        if ($this->request->is('get')) {
            throw new MethodNotAllowedException();
        }

        if ($this->Post->delete($id)) {
            $this->Flash->success(
                __('Le post avec id : %s a été supprimé.', h($id))
            );
        } else {
            $this->Flash->error(
                __('Le post avec l\'id: %s n\'a pas pu être supprimé.', h($id))
            );
        }

        return $this->redirect(array('action' => 'index'));
    }

Cette logique supprime le Post spécifié par $id, et utilise
``$this->Flash->success()`` pour afficher à l'utilisateur un message de
confirmation après l'avoir redirigé sur ``/posts``. Si l'utilisateur tente
une suppression en utilisant une requête GET, une exception est levée.
Les exceptions manquées sont capturées par le gestionnaire d'exceptions de
CakePHP et un joli message d'erreur est affiché. Il y a plusieurs
:doc:`/development/exceptions` intégrées qui peuvent être utilisées pour
indiquer les différentes erreurs HTTP que votre application pourrait
rencontrer.

Etant donné que nous exécutons juste un peu de logique et de redirection,
cette action n'a pas de vue. Vous voudrez peut-être mettre à jour votre vue
"index" avec des liens pour permettre aux utilisateurs de supprimer des Posts,
ainsi :

.. code-block:: php

    <!-- Fichier: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link(
        'Ajouter un Post',
        array('action' => 'add')
    ); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Actions</th>
            <th>Créé le</th>
        </tr>

    <!-- Ici, nous bouclons sur le tableau $post afin d'afficher les informations des posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link(
                    $post['Post']['title'],
                    array('action' => 'view', $post['Post']['id'])
                ); ?>
            </td>
            <td>
                <?php echo $this->Form->postLink(
                    'Supprimer',
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Etes-vous sûr ?'));
                ?>
                <?php echo $this->Html->link(
                    'Editer',
                    array('action' => 'edit', $post['Post']['id'])
                ); ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

Utiliser :php:meth:`~FormHelper::postLink()` permet de créer un lien qui
utilise du Javascript pour supprimer notre post en faisant une requête POST.
Autoriser la suppression par une requête GET est dangereux à cause des robots
d'indexation qui peuvent tous les supprimer.

.. note::

    Ce code utilise aussi le helper "Form" pour demander à l'utilisateur
    une confirmation avant de supprimer le post.

Routes
======

Pour certains, le routage par défaut de CakePHP fonctionne suffisamment bien.
Les développeurs qui sont sensibles à la facilité d'utilisation et à la
compatibilité avec les moteurs de recherches apprécieront la manière dont
CakePHP lie des URLs à des actions spécifiques. Nous allons donc faire une
rapide modification des routes dans ce tutoriel.

Pour plus d'informations sur les techniques de routages, consultez le chapitre
:ref:`routes-configuration`.

Par défaut, CakePHP effectue une redirection d'une personne visitant la racine
de votre site (par ex: http://www.exemple.com) vers le controller Pages
(PagesController) et affiche le rendu de la vue appelée "home". Au lieu de
cela, nous voudrions la remplacer avec notre controller Posts
(PostsController).

Le routage de CakePHP se trouve dans ``/app/Config/routes.php``. Vous devrez
commenter ou supprimer la ligne qui définit la route par défaut. Elle
ressemble à cela::

    Router::connect(
        '/',
        array('controller' => 'pages', 'action' => 'display', 'home')
    );

Cette ligne connecte l'URL '/' à la page d'accueil par défaut de CakePHP. Nous
voulons que cette URL soit connectée à notre propre controller, remplacez donc
la ligne par celle-ci::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

Cela devrait connecter les utilisateurs demandant '/' à l'action ``index()`` de
notre controller Posts (PostsController).

.. note::

    CakePHP peut aussi faire du 'reverse routing' (ou routage inversé).
    Par exemple, pour la route définie plus haut, en ajoutant
    ``array('controller' => 'posts', 'action' => 'index')`` à la fonction
    retournant un tableau, l'URL '/' sera utilisée. Il est d'ailleurs bien
    avisé de toujours utiliser un tableau pour les URLs afin que vos routes
    définissent où vont les URLs, mais aussi pour s'assurer qu'elles aillent
    dans la même direction.

Conclusion
==========

Créer des applications de cette manière vous apportera, paix, honneur, amour
et argent au-delà même de vos fantasmes les plus fous. Simple n'est ce pas ?
Gardez à l'esprit que ce tutoriel était très basique. CakePHP a *beaucoup* plus
de fonctionnalités à offrir et il est aussi souple dans d'autres domaines que
nous n'avons pas souhaité couvrir ici pour simplifier les choses. Utilisez
le reste de ce manuel comme un guide pour développer des applications plus
riches en fonctionnalités.

Maintenant que vous avez créé une application CakePHP basique, vous êtes prêt
pour les choses sérieuses. Commencez votre propre projet et lisez le reste du
:doc:`Cookbook </index>` et l'`API <http://api.cakephp.org>`_.

Si vous avez besoin d'aide, il y a plusieurs façons d'obtenir de l'aide -
merci de regarder la page :doc:`/cakephp-overview/where-to-get-help`
Bienvenue sur CakePHP !

Prochaines lectures suggérées
-----------------------------

Voici les différents chapitres que les gens veulent souvent lire après :

1. :ref:`view-layouts`: Personnaliser les Layouts de votre application.
2. :ref:`view-elements`: Inclure et ré-utiliser les portions de vues.
3. :doc:`/controllers/scaffolding`: Construire une ébauche d'application
   sans avoir à coder.
4. :doc:`/console-and-shells/code-generation-with-bake` Générer un code
   CRUD basique.
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`: Tutoriel sur
   l\'enregistrement et la connexion d'utilisateurs.


.. meta::
    :title lang=fr: Blog Tutoriel Ajouter la logique
    :keywords lang=fr: doc models,vérification validation,controller actions,model post,php class,classe model,objet model,business logic,table base de données,convention de nommage,bread et butter,callbacks,prefixes,nutshell,intéraction,array,cakephp,interface,applications,suppression
