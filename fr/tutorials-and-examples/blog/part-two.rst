Blog Tutoriel - Ajouter la logique
##################################

Créer un Model Article
======================

Les Models sont le pain quotidien des applications CakePHP. En
créant un model CakePHP qui interagira avec notre base de données,
nous aurons mis en place les fondations nécessaires pour faire plus
tard nos opérations de lecture, d'insertion, d'édition et de suppression.

Les fichiers des classes de model de CakePHP sont séparés entre des objets
``Table`` et ``Entity``. Les objets ``Table`` fournissent un accès à la
collection des entities stockées dans une table spécifique et vont dans
``/App/Model/Table``. Le fichier que nous allons créé sera sauvegardé dans
``/App/Model/Table/ArticlesTable.php``. Le fichier complété devrait ressembler
à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

La convention de nommage est vraiment très importante dans CakePHP. En nommant
notre objet Table ``ArticlesTable``, CakePHP va automatiquement supposer que
cet objet Table sera utilisé dans le ArticlesController, et sera lié à une table
de la base de données appelée ``articles``.

.. note::

    CakePHP créera dynamiquement un objet model pour vous, s'il ne trouve
    pas le fichier correspondant dans /App/Model/Table. Cela veut aussi dire que
    si vous n'avez pas nommé correctement votre fichier (par ex.
    articlestable.php ou ArticleTable.php). CakePHP ne reconnaîtra pas votre
    configuration et utilisera les objets par défaut.

Pour plus d'informations sur les models, comme les préfixes des tables,
les callbacks, et la validation, consultez le chapitre :doc:`/models` du
manuel.


Créer un controller Articles
============================

Nous allons maintenant créer un controller pour nos articles. Le controller est
l'endroit où toute interaction avec les articles va se faire. En un mot, c'est
l'endroit où vous jouerez avec les models et où vous ferez les tâches liées aux
articles. Nous placerons ce nouveau controller dans un fichier appelé
``ArticlesController.php`` à l'intérieur du dossier ``/App/Controller``. Voici
à quoi devrait ressembler le controller de base ::

    namespace App\Controller;

    class ArticlesController extends AppController {
    }

Maintenant, ajoutons une action à notre controller. Les actions représentent
souvent une simple fonction ou une interface dans une application. Par exemple,
quand les utilisateurs requêtent www.exemple.com/articles/index (qui est
également la même chose que www.exemple.com/articles/), ils pourraient
s'attendre à voir une liste d'articles. Le code pour cette action devrait
ressembler à quelque chose comme ça::

    namespace App\Controller;

    class ArticlesController extends AppController {

        public function index() {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

En définissant la fonction ``index()`` dans notre ArticlesController, les
utilisateurs peuvent maintenant accéder à cette logique en demandant
www.exemple.com/articles/index. De la même façon, si nous devions définir une
fonction appelée ``foobar()``, les utilisateurs pourrait y accéder en demandant
www.exemple.com/articles/foobar.

.. warning::

    Vous pourriez être tenté de nommer vos controllers et vos actions d'une
    certaine manière pour obtenir une certaine URL. Résistez à cette tentation.
    Suivez les conventions CakePHP (le nom des controllers au pluriel, etc.) et
    nommez vos actions de façon lisible et compréhensible. Vous pouvez lier les
    URLs à votre code en utilisant ce qu'on appelle des "routes", on le verra
    plus tard.

La seule instruction que cette action utilise est ``set()``, pour transmettre
les données du controller à la vue (que nous créerons à la prochaine étape).
La ligne définit la variable de vue appelée 'articles' qui est égale à la valeur
de retour de la méthode ``find('all')`` de l'objet table Articles.

Pour en apprendre plus sur les controllers de CakePHP, consultez le chapitre
:doc:`/controllers`.

Créer les Vues des Articles
===========================

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
la variable 'articles' à la vue en utilisant la méthode ``set()`` ?
Cela devrait transmettre les données à la vue qui ressemblerait à quelque
chose comme cela ::

Les fichiers des vues de CakePHP sont stockés dans ``/App/Template`` à
l'intérieur d'un dossier dont le nom correspond à celui du controller (nous
aurons à créer un dossier appelé 'Articles' dans ce cas). Pour mettre en forme les
données de ces articles dans un joli tableau, le code de notre vue devrait
ressembler à quelque chose comme cela::

.. code-block:: php

    <!-- File: /App/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Créé le</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title,
                ['controller' => 'articles', 'action' => 'view', $article->id]) ?>
            </td>
            <td><?= $article->created->format(DATE_RFC850) ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

Vous avez sans doute remarqué l'utilisation d'un objet appelé ``$this->Html``.
C'est une instance de la classe CakePHP
:php:class:`Cake\\View\\Helper\\HtmlHelper`. CakePHP est livré avec un ensemble
de "helpers" (des assistants) pour les vues, qui réalisent en un clin d'oeil
des choses comme le "linking" (mettre les liens dans un texte), l'affichage des
formulaires, du JavaScript et de l'AJAX. Vous pouvez en apprendre plus sur la
manière de les utiliser dans le chapitre :doc:`/views/helpers`, mais ce qu'il
est important de noter ici, c'est que la méthode ``link()`` génèrera un
lien HTML à partir d'un titre (le premier paramètre) et d'une URL (le second
paramètre).

Lorsque vous indiquez des URLs dans CakePHP, il est recommandé d'utiliser les
tableaux. Ceci est expliqué dans le chapitre des Routes. Utiliser les tableaux
dans les URLs vous permet de tirer profit des capacités de CakePHP à
ré-inverser les routes. Vous pouvez aussi utiliser les URLs relatives depuis
la base de l'application comme suit /controller/action/param1/param2.

A ce stade, vous devriez être en mesure de pointer votre navigateur sur la
page http://www.exemple.com/articles/index. Vous devriez voir votre vue,
correctement formatée avec le titre et le tableau listant les articles.

Si vous avez essayé de cliquer sur l'un des liens que nous avons créés dans
cette vue (le lien sur le titre d'un article mène à l'URL :
/articles/view/un_id_quelconque), vous avez sûrement été informé par CakePHP que
l'action n'a pas encore été définie. Si vous n'avez pas été informé, soit
quelque chose s'est mal passé, soit en fait vous aviez déjà défini l'action,
auquel cas vous êtes vraiment sournois ! Sinon, nous allons la créer sans plus
tarder dans le Controller Articles::

    namespace App\Controller;

    use Cake\Error\NotFoundException;

    class ArticlesController extends AppController {

        public function index() {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null) {
            if (!$id) {
                throw new NotFoundException(__('Invalid article'));
            }

            $article = $this->Articles->get($id);

            $this->set(compact('article'));
        }
    }

L'appel de ``set()`` devrait vous être familier. Notez que nous utilisons
``findById()`` plutôt que ``find('all')`` parce que nous voulons seulement
récupérer les informations d'un seul article.

Notez que notre action "view" prend un paramètre : l'ID de l'article que nous
aimerions voir. Ce paramètre est transmis à l'action grâce à l'URL demandée.
Si un utilisateur demande ``/articles/view/3``, alors la valeur '3' est
transmise à la variable ``$id``.

Nous faisons aussi une petite vérification d'erreurs pour nous assurer qu'un
utilisateur accède bien à l'enregsitrement. Si un utilisateur requête
``/articles/view``, nous lancerons un ``NotFoundException`` et laisserons
le Gestionnaire d'Erreur de CakePHP ErrorHandler prendre le dessus. Nous
exécutons aussi une vérification similaire pour nous assurer que l'utilisateur
a accède à un enregistrement qui existe.

Maintenant, créons la vue pour notre nouvelle action 'view' et plaçons-la
dans ``/App/Template/Articles/view.ctp``.

.. code-block:: php

    <!-- File: /App/Template/Articles/view.ctp -->
    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>

Vérifiez que cela fonctionne en testant les liens de la page ``/articles/index``
ou en affichant manuellement un article via ``/articles/view/1``.

Ajouter des Articles
====================

Lire depuis la base de données et nous afficher les articles est un bon début,
mais lançons-nous dans l'ajout de nouveaux articles.

Premièrement, commençons par créer une action ``add()`` dans le
ArticlesController::

    namespace App\Controller;

    use Cake\Error\NotFoundException;

    class ArticlesController extends AppController {
        public $components = ['Session'];

        public function index() {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid article'));
            }

            $article = $this->Articles->get($id);

            $this->set(compact('article'));
        }

        public function add() {
            $article = $this->Articles->newEntity($this->request->data);
            if ($this->request->is('post')) {
                if ($this->Articles->save($article)) {
                    $this->Session->setFlash(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Session->setFlash(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    ``$this->request->is()`` prend un unique argument, qui peut être la METHOD
    request (``get``, ``put``, ``post``, ``delete``) ou toute identifier de
    request (``ajax``). Ce **n'est pas** une façon de vérifier une data postée
    spécifique. Par exemple, ``$this->request->is('book')`` ne retournera pas
    true si les data du book ont été postées.

.. note::

   Vous avez besoin d'inclure le component Session (SessionComponent) et
   le helper Session (SessionHelper) dans chaque controller où vous voulez
   les utiliser. Si nécessaire, incluez-les dans le controller principal
   (AppController) pour qu'ils soient accessibles à tous les controllers.

Voici ce que fait l'action ``add()`` : si la requête HTTP est de type POST,
essayez de sauvegarder les données en utilisant le model "Articles". Si pour une
raison quelconque, la sauvegarde a échouée, affichez simplement la vue. Cela
nous donne une chance de voir les erreurs de validation de l'utilisateur et
d'autres avertissements.

Chaque requête de CakePHP contient un objet ``Request`` qui est accessible
en utilisant ``$this->request``. Cet objet contient des informations utiles
sur la requête qui vient d'être reçue, et permet de contrôler les flux de votre
application. Dans ce cas, nous utilisons la méthode
:php:meth:`Cake\\Network\\Request::is()` pour vérifier que la requête est de
type POST.

Lorsqu'un utilisateur utilise un formulaire pour poster des données dans votre
application, ces informations sont disponibles dans ``$this->request->data``.
Vous pouvez utiliser les fonctions :php:func:`pr()` ou :php:func:`debug()` pour
les afficher si vous voulez voir à quoi cela ressemble.

Nous utilisons la méthode
:php:meth:`Cake\\Controller\\Component\\SessionComponent::setFlash()` pour
définir un message dans une variable session et qui sera affiché dans la page
juste après la redirection. Dans le layout, nous trouvons la fonction
:php:func:`Cake\\View\Helper\\SessionHelper::flash` qui permet
d'afficher et de nettoyer la variable correspondante. La méthode
:php:meth:`Cake\\Controller\\Controller::redirect` du controller permet de
rediriger vers une autre URL. Le paramètre ``array('action' => 'index')`` sera
traduit vers l'URL /articles, c'est à dire l'action "index" du controller
"Articles" (ArticlesController). Vous pouvez vous référer à l'
`API<http://api.cakephp.org>`_ de la fonction
:php:func:`Cake\\Routing\\Router::url()` pour voir les différents formats
d'URL acceptés dans les différentes fonctions de CakePHP.

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
le helper "Form" (FormHelper) dans vos vues.
:php:class:`Cake\\View\\Helper\\FormHelper` est disponible par défaut dans
toutes les vues avec la variables ``$this->Form``.

Voici le code de notre vue "add" (ajout)

.. code-block:: php

    <!-- File: /App/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
    echo $this->Form->create($article);
    echo $this->Form->input('title');
    echo $this->Form->input('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
    ?>

Nous utilisons le :php:class:`FormHelper` pour générer la balise
d'ouverture d'une formulaire HTML. Voici le code HTML généré par
``$this->Form->create()`` ::

.. code-block:: html

    <form method="post" action="/articles/add">

Si ``create()`` est appelée sans aucun paramètre, CakePHP suppose que vous
construisez un formulaire qui envoie les données en POST à l'action ``add()``
(ou ``edit()`` quand ``id`` est dans les données du formulaire) du controller
actuel.

La méthode ``$this->Form->input()`` est utilisée pour créer des élements de
formulaire du même nom. Le premier paramètre dit à CakePHP à quels champs ils
correspondent et le second paramètre vous permet de spécifier un large éventail
d'options - dans ce cas, le nombre de lignes du textarea. Il y a un peu
d'introspection et "d'automagie" ici : ``input()`` affichera différents
éléments de formulaire selon le champ spécifié du model.

L'appel de la méthode ``$this->Form->end()`` cloture le formulaire. Encore
une fois, référez-vous au chapitre :doc:`/views/helpers` pour en savoir plus
sur les helpers.

A présent, revenons en arrière et modifions notre vue
``/App/Template/Articles/index.ctp`` pour ajouter un lien "Ajouter un article".
Ajoutez la ligne suivante avant ``<table>`` ::

    <?= $this->Html->link(
        'Ajouter un article',
        ['controller' => 'articles', 'action' => 'add']
    ) ?>

Vous vous demandez peut-être : comment je fais pour indiquer à CakePHP mes
exigences de validation ? Les règles de validation sont définies dans le
model. Retournons donc à notre model Articles et procédons à quelques
ajustements::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table {

        public function validationDefault(Validator $validator) {
            $validator
                ->allowEmpty('title', false)
                ->allowEmpty('body', false);

            return $validator;
        }
    }

Le méthode ``validationDefault`` indique à CakePHP comment valider vos données
lorsque la méthode ``save()`` est appelée. Ici, j'ai spécifié que les
deux champs "body" et "title" ne doivent pas être vides. Le moteur de
validation de CakePHP est puissant, il dispose d'un certain nombre de
règles intégrées (code de carte bancaire, adresse emails, etc.)
et d'une souplesse pour ajouter vos propres règles de validation. Pour
plus d'informations sur cette configuration, consultez le chapitre
:doc:`/core-libraries/validation`.

Maintenant que vos règles de validation sont en place, utilisez l'application
pour essayer d'ajouter un article avec un titre et un contenu vide afin de voir
comment cela fonctionne. Puisque que nous avons utilisé la méthode
:php:meth:`Cake\\View\\Helper\\FormHelper::input()` du helper "Form" pour
créer nos éléments de formulaire, nos messages d'erreurs de validation seront
affichés automatiquement.

Editer des Articles
===================

L'édition de articles : nous y voilà. Vous êtes un pro de CakePHP maintenant,
vous devriez donc avoir adopté le principe. Créez d'abord l'action puis la vue.
Voici à quoi l'action ``edit()`` du controller Articles (ArticlesController)
devrait ressembler::

    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid article'));
        }

        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->data);
            if ($this->Articles->save($article)) {
                $this->Session->setFlash(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Session->setFlash(__('Unable to update your article.'));
        }

        $this->set('article', $article);
    }

Cette action s'assure d'abord que l'utilisateur a essayé d'accéder à un
enregistrement existant. Si il n'y a pas de paramètre ``$id`` passé, ou si le
article n'existe pas, nous lançons une ``NotFoundException`` pour que le
gestionnaire d'Erreurs ErrorHandler de CakePHP s'en occupe.

Ensuite l'action vérifie si la requête est une requête POST ou PUT. Si elle
l'est, alors nous utilisons les données POST pour mettre à jour notre
entity article en utilisant la méthode 'patchEntity'. Finalement nous utilisons
l'objet table pour sauvegarder l'entity back ou kick back et montrer les erreurs
de validation de l'utilisateur.

La vue d'édition devrait ressembler à quelque chose comme cela:

.. code-block:: php

    <!-- File: /App/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?= $this->Form->create($article) ?>
    <?= $this->Form->input('title') ?>
    <?= $this->Form->input('body', ['rows' => '3']) ?>
    <?= $this->Form->button(__('Save Article')) ?>
    <?= $this->Form->end() ?>

Cette vue affiche le formulaire d'édition (avec les données pré-remplies) avec
les messages d'erreur de validation nécessaires.

Une chose à noter ici : CakePHP supposera que vous éditez un model si le champ
'id' est présent dans le tableau de données. S'il n'est pas présent (ce qui
revient à notre vue "add"), CakePHP supposera que vous insérez un nouveau model
lorsque ``save()`` sera appelée.

Vous pouvez maintenant mettre à jour votre vue "index" avec des liens pour
éditer des articles :

.. code-block:: php

    <!-- File: /App/Template/Articles/index.ctp  (edit links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we iterate through our $articles query object, printing out article info -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id']) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Supprimer des Articles
======================

A présent, mettons en place un moyen de supprimer les articles pour les
utilisateurs. Démarrons avec une action ``delete()`` dans le controller
Articles (ArticlesController)::

    public function delete($id) {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Session->setFlash(__('The article with id: %s has been deleted.', h($id)));
            return $this->redirect(['action' => 'index']);
        }
    }

Cette logique supprime l'article spécifié par $id, et utilise
``$this->Session->setFlash()`` pour afficher à l'utilisateur un message de
confirmation après l'avoir redirigé sur ``/articles``. Si l'utilisateur tente
une suppression en utilisant une requête GET, une exception est levée.
Les exceptions manquées sont capturées par le gestionnaire d'exceptions de
CakePHP et un joli message d'erreur est affiché. Il y a plusieurs
:doc:`/development/exceptions` intégrées qui peuvent être utilisées pour
indiquer les différentes erreurs HTTP que votre application pourrait
rencontrer.

Etant donné que nous exécutons juste un peu de logique et de redirection,
cette action n'a pas de vue. Vous voudrez peut-être mettre à jour votre vue
"index" avec des liens pour permettre aux utilisateurs de supprimer des
articles, ainsi :

.. code-block:: php

    <!-- File: /App/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link('Add Article', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Delete',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Are you sure?'])
                ?>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

Utiliser :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` permet de
créer un lien qui utilise du Javascript pour supprimer notre post en faisant
une requête POST. Autoriser la suppression par une requête GET est dangereux à
cause des robots d'indexation qui peuvent tous les supprimer.

.. note::

    Ce code de vue utilise aussi le helper "Form" pour demander à l'utilisateur
    une confirmation avant de supprimer un article.

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
cela, nous voudrions la remplacer avec notre controller Articles
(ArticlesController).

Le routage de CakePHP se trouve dans ``/App/Config/routes.php``. Vous devrez
commenter ou supprimer la ligne qui définit la route par défaut. Elle
ressemble à cela ::

    Router::connect('/', ['controller' => 'pages', 'action' => 'display', 'home']);

Cette ligne connecte l'URL '/' à la page d'accueil par défaut de CakePHP. Nous
voulons que cette URL soit connectée à notre propre controller, remplacez donc
la ligne par celle-ci ::

    Router::connect('/', ['controller' => 'articles', 'action' => 'index']);

Cela devrait connecter les utilisateurs demandant '/' à l'action ``index()`` de
notre controller Articles (ArticlesController).

.. note::

    CakePHP peut aussi faire du 'reverse routing' (ou routage inversé).
    Par exemple, pour la route définie plus haut, en ajoutant
    ``['controller' => 'articles', 'action' => 'index']`` à la fonction
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
    :keywords lang=fr: doc models,vérification validation,controller actions,model article,php class,classe model,objet model,business logic,table base de données,convention de nommage,bread et butter,callbacks,prefixes,nutshell,intéraction,array,cakephp,interface,applications,suppression
