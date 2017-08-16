Tutoriel CMS - Création du Controller Articles
##############################################

Maintenant que notre model est créé, nous avons besoin d'un controller pour nos
articles. Dans CakePHP, les controllers se chargent de gérer les requêtes HTTP et
exécutent la logique métier des méthodes des models pour préparer une réponse. Nous
placerons le code de ce controller dans un nouveau fichier **ArticlesController.php**,
dans le dossier **src/Controller**. La base du controller ressemblera à ceci::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Ajoutons maintenant une action à notre controller. Les actions sont les méthodes
des controllers qui sont connectées aux routes. Par exemple, quand un utilisateur
appelle la page **www.example.com/articles/index** (ce qui est la même chose qu'appeler
**www.example.com/articles**), CakePHP appelera la méthode ``index`` de votre controller
``ArticlesController``. Cette méthode devra à son tour faire appel à la couche Model
et préparer une réponse en faisant le rendu d'un Template via la couche de View.
Le code de notre action index sera le suivant::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function index()
        {
            $this->loadComponent('Paginator');
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }
    }

Maintenant que nous avons une méthode ``index()`` dans notre ``ArticlesController``,
les utilisateurs peuvent maintenant y accéder via **www.example.com/articles/index**.
De la même manière, si nous définissions une méthode ``foobar()``, les utilisateurs
pourraient y accéder via **www.example.com/articles/foobar**. Vous pourriez être tenté
de nommer vos controllers et vos actions afin d'obtenir des URL spécifiques. Cependant,
ceci est déconseillé. Vous devriez plutôt suivre les :doc:`/intro/conventions`
et créer des noms d'actions lisibles ayant un sens pour votre application. Vous pouvez
ensuite utiliser le :doc:`/development/routing` pour obtenir les URLs que vous
souhaitez et les connecter aux actions que vous avez créées.

Notre action est très simple. Elle récupère un jeu d'articles paginés dans la base de
données en utilisant l'objet model Articles qui est chargé automatiquement via les
conventions de nommage. Elle utilise ensuite la méthode ``set()`` pour passer les
articles récupérés au Template (que nous créerons par la suite). CakePHP va
automatiquement rendre le Template une fois que notre action de Controller sera
entièrement exécutée.

Création du Template de liste des Articles
==========================================

Maintenant que notre controller récupère les données depuis le model et qu'il
prépare le contexte pour la view, créons le template pour notre action index.

Les templates de view de CakePHP sont des morceaux de PHP qui sont insérés dans
le layout de votre application. Bien que nous créerons du HTML ici, les Views
peuvent générer du JSON, du CSV ou même des fichiers binaires comme des PDFs.

Un layout est le code de présentation qui englobe la view d'une action. Les fichiers
de layout contiennent les éléments communs comme les headers, les footers et les
éléments de navigation. Votre application peut très bien avoir plusieurs layouts et
vous pouvez passer de l'un à l'autre. Mais pour le moment, utilisons seulement le
layout par défaut.

Les fichiers de template de CakePHP sont stockés dans **src/Template** et dans
un dossier au nom du controller auquel ils sont attachés. Nous devons donc
créer un dossier nommé 'Articles' dans notre cas. Ajouter le code suivant
dans ce fichier:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Articles</h1>
    <table>
        <tr>
            <th>Titre</th>
            <th>Créé le</th>
        </tr>

        <!-- C'est ici que nous bouclons sur notre objet Query $articles pour afficher les informations de chaque article -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

Dans la précédente section, nous avons assigné la variable 'articles' à la view en
utilisant la méthode ``set()``. Les variables passées à la view sont disponible dans
les templates de view comme des "variables locales", comme nous l'avons fait ci-dessus.

Vous avez peut-être remarqué que nous utilisons un objet appelé ``$this->Html``.
C'est une instance du :doc:`HtmlHelper </views/helpers/html>`. CakePHP inclut
plusieurs helpers de view qui rendent les tâches comme créer des liens, des
formulaires et des éléments de paginations très faciles. Vous pouvez en apprendre
plus à propos des :doc:`/views/helpers` dans le chapitre de la documentation qui
leur est consacré, mais le plus important ici est la méthode ``link()``, qui générera
un lien HTML avec le texte fourni (le premier paramètre) et l'URL (le second paramètre).

Quand vous spécifiez des URLs dans CakePHP, il est recommandé d'utiliser des
tableaux ou des :ref:`routes nommées<named-routes>`. Ces syntaxes vous permettent
de bénéficier du reverse routing fourni par CakePHP.

A partir de maintenant, si vous accédez à **http://localhost:8765/articles/index**,
vous devriez voir votre view qui liste les articles avec leur titre et leur lien.

Création de l'action View
=========================

Si vous cliquez sur le lien d'un article dans la page qui liste nos articles,
vous tombez sur une page d'erreur vous indiquant que l'action n'a pas été implémentée.
Vous pouvez corrigez cette erreur en créant l'action manquante correspondante::

    // Ajouter au fichier existant src/Controller/ArticlesController.php

    public function view($slug = null)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

Bien que cette action soit simple, nous avons utilisez quelques-unes des fonctionnalités
de CakePHP. Nous commençons par utiliser la méthode ``findBySlug()`` qui est un
:ref:`finder dynamique <dynamic-finders>`. Cette méthode nous permet de créer
une requête basique qui permet de récupérer des articles par un "slug" donné.
Nous utilisons ensuite la méthode ``firstOrFail()`` qui nous permet de récupérer
le premier enregistrement ou lancera une ``NotFoundException`` si aucun article
correspondant n'est trouvé.

Notre action attend un paramètre ``$slug``, mais d'où vient-il ? Si un utilisateur
requête ``/articles/view/first-post``, alors la valeur 'first-post' sera passé
à ``$slug`` par la couche de routing et de dispatching de CakePHP. Si nous rechargeons
notre navigateur, nous aurons une nouvelle erreur, nous indiquant qu'il mange un template
de View.

Création du template View
=========================

Créons le template de view pour notre action "view" dans
**src/Template/Articles/view.ctp**.

.. code-block:: php

    <!-- Fichier : src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Créé le : <?= $article->created->format(DATE_RFC850) ?></small></p>
    <p><?= $this->Html->link('Modifier', ['action' => 'edit', $article->slug]) ?></p>

Vous pouvez vérifier que tout fonctionne en essayant de cliquer sur un lien de
``/articles/index`` ou en vous rendant manuellement sur une URL de la forme
``/articles/view/slug-name``.

Ajouter des articles
====================

Maintenant que les views de lecture ont été créées, il est temps de rendre possible
la création d'articles. Commencez par créer une action ``add()`` dans le
``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // Inclusion du FlashComponent
        }

        public function index()
        {
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }

        public function view($slug)
        {
            $article = $this->Articles->findBySlug($slug)->firstOrFail();
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Votre article a été sauvegardé.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Impossible d\'ajouter votre article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    Vous devez inclure le :doc:`/controllers/components/flash` dans tous les controllers
    où vous avez besoin de l'utiliser. Il est souvent conseillé de le charger
    directement dans le ``AppController``.

Voici ce que l'action ``add()`` fait :

* Si la méthode HTTP de la requête est un POST, cela tentera de sauvergarder les données
  en utilisant le model Articles.
* Si pour une quelconque raison la sauvegarde ne se fait pas, cela rendra juste la view.
  Cela nous donne ainsi une chance de montrer les erreurs de validation ou d'autres
  messages à l'utilisateur.

Toutes les requêtes de CakePHP incluent un objet request qui est accessible via
``$this->request``. L'objet request contient des informations à propos de la
requête qui vient d'être reçue. Nous utilisons la méthode
:php:meth:`Cake\\Http\\ServerRequest::is()` pour vérifier que la requête possède
bien le verbe HTTP POST.

Les données passées en POST sont disponibles dans ``$this->request->getData()``.
Vous pouvez utiliser les fonctions :php:func:`pr()` ou :php:func:`debug()` pour
afficher les données si vous voulez voir à quoi elles ressemblent. Pour sauvegarder
les données, nous devons tout d'abord "marshaller" les données du POST en une
Entity Article. L'Entity sera ensuite persistée en utilisant la classe ArticlesTable
que nous avons créée plus tôt.

Après la sauvegarde de notre article, nous utilisons la méthode ``success()`` du
FlashComponent pour définir le message en Session. La méthode ``success`` est
fournie via `les méthodes magiquesde PHP
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_.
Les messages Flash seront affichés sur la page suivante après redirection. Dans
notre layout, nous avons ``<?= $this->Flash->render() ?>`` qui affichera un message
Flash et le supprimera du stockage de Session. Enfin, après la sauvegarde, nous
utilisons :php:meth:`Cake\\Controller\\Controller::redirect` pour renvoyer
l'utilisateur à la liste des articles. Le paramètre ``['action' => 'index']``
correspond à l'URL ``/articles``, c'est-à-dire l'action index du ``ArticlesController``.
Vous pouvez vous référer à la méthode :php:func:`Cake\\Routing\\Router::url()` dans
la `documentation API <https://api.cakephp.org>`_ pour voir les formats dans lesquels
vous pouvez spécifier une URL.

Création du Template Add
========================

Voici le code de notre template de la view "add" :

.. code-block:: php

    <!-- Fichier : src/Template/Articles/add.ctp -->

    <h1>Ajouter un article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Sauvegarder l'article'));
        echo $this->Form->end();
    ?>

Nous utilisons le FormHelper pour générer l'ouverture du form HTML.
Voici le HTML que ``$this->Form->create()`` génère :

.. code-block:: html

    <form method="post" action="/articles/add">

Puisque nous appelons ``create()`` sans passer d'option URL, le ``FormHelper``
va partir du principe que le formulaire doit être soumis sur l'action courante.

La méthode ``$this->Form->control()`` est utilisée pour créer un élément de
formulaire du même nom. Le premier paramètre indique à CakePHP à quel champ
il correspond et le second paramètre vous permet de définir un très grand nombre
d'options - dans notre cas, le nombre de lignes (rows) pour le textarea. Il y a
un peu d'instrospection et de conventions utilisées ici. La méthode ``control()``
affichera des éléments de formulaire différents en fonction du champ du model
spécifié et utilisera une inflection automatique pour définir le label associé.
Vous pouvez personnaliser le label, les inputs ou tout autre aspect du formulaire
en utilisant les options. La méthode ``$this->Form->end()`` ferme le formulaire.

Retournons à notre template **src/Template/Articles/index.ctp** pour ajouter
un lien "Ajouter un article". Avant le ``<table>``, ajoutons la ligne
suivante::

    <?= $this->Html->link('Ajouter un article', ['action' => 'add']) ?>

Ajout de la génération de slug
==============================

Si nous sauvons un article tout de suite, la sauvegarde échouerait car nous ne
créons pas l'attribut "slug" et la colonne correspondante est définie comme
``NOT NULL``. Un slug est généralement une version "URL compatible" du titre
d'un article. Nous pouvons utiliser le :ref:`callback beforeSave() <table-callbacks>`
de l'ORM pour créer notre slug::

    // dans src/Model/Table/ArticlesTable.php

    // Ajoutez ce "use" juste sous la déclaration du namespace
    // pour importer la classe Text
    use Cake\Utility\Text;

    // Ajouter la méthode suivante

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->isNew() && !$entity->slug) {
            $sluggedTitle = Text::slug($entity->title);
            // On ne garde que le nombre de caractère correspondant à la longueur
            // maximum définie dans notre schéma
            $entity->slug = substr($sluggedTitle, 0, 191)
        }

        // Ceci est temporaire, nous le retirerons quand nous
        // construirons l'authentification.
        if (!$entity->user_id) {
            $entity->user_id = 1;
        }
    }

Ce code est simple et ne prend pas en compte les potentiels doublons de slug.
Mais nous nous occuperons de ceci plus tard.

Ajout de l'action Edit
======================

Notre application peut maintenant sauvegarder des articles, mais nous ne pouvons
pas modifier les articles existants. Ajoutez l'action suivante dans votre
``ArticlesController``::

    // dans src/Controller/ArticlesController.php

    // Ajouter la méthode suivante.

    public function edit($slug)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été mis à jour.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible de mettre à jour l'article.'));
        }

        $this->set('article', $article);
    }

Cette action va d'abord s'assurer que l'utilisateur essaie d'accéder à un
enregistrement existant. Si vous n'avez pas passé de paramètre ``$slug`` ou que
l'article n'existe pas, une ``NotFoundException`` sera lancée et le ErrorHandler
rendra la page d'erreur appropriée.

Ensuite l'action va vérifier si la requête est une requête POST ou PUT. Si c'est le cas,
nous utiliserons alors les données du POST/PUT pour mettre à jour l'entity de l'article
en utilisant la méthode ``patchEntity()``. Enfin, nous appelons la méthode ``save()``,
nous définissons un message Flash approprié et soit nous redirigeons, soit nous affichons
les erreurs de validation en fonction du résultat de l'opération de sauvegarde.

Création du template Edit
=========================

Le template edit devra ressembler à ceci :

.. code-block:: php

    <!-- Fichier : src/Template/Articles/edit.ctp -->

    <h1>Modifier un article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Sauvegarder l'article'));
        echo $this->Form->end();
    ?>

Ce template affiche le formulaire de modification (avec les valeurs déjà remplies),
ainsi que les messages d'erreurs de validation.

Vous pouvez maintenant mettre à jour notre view index avec les liens pour modifier
les articles :

.. code-block:: php

    <!-- Fichier : src/Template/Articles/index.ctp (liens de modification ajoutés) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Ajouter un article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Titre</th>
            <th>Créé le</th>
            <th>Action</th>
        </tr>

        <!-- C'est ici que nous bouclons sur notre objet Query $articles pour afficher les informations de chaque article -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Modifier', ['action' => 'edit', $article->slug]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Mise à jour des règles de validation pour les Articles
======================================================

Jusqu'à maintenant, nos Articles n'avaient aucune validation de données. Occupons-nous
de ça en utilisant un :ref:`validator <validating-request-data>`::

    // src/Model/Table/ArticlesTable.php

    // Ajouter ce "use" juste sous la déclaration du namespace pour importer
    // la classe Validator
    use Cake\Validation\Validator;

    // Ajouter la méthode suivante.
    public function validationDefault(Validator $validator)
    {
        $validator
            ->notEmpty('title')
            ->minLength('title', 10)
            ->maxLength('title', 255)

            ->notEmpty('body')
            ->minLength('body', 10);

        return $validator;
    }

La méthode ``validationDefault()`` indique à CakePHP comment valider les données
quand la méthode ``save()`` est appelée. Ici, il est spécifié que les champs title
et body ne peuvent pas être vides et qu'ils ont aussi des contraintes sur la taille.

Le moteur de validation de CakePHP est à la fois puissant et flexible. Il vous fournit
un jeu de règles sur des validations communes comme les adresses emails, les adresses IP,
etc. mais aussi la flexibilité d'ajouter vos propres règles de validation. Pour plus
d'informations, rendez-vous dans la section :doc:`/core-libraries/validation` de
la documentation.

Maintenant que nos règles de validation sont en place, utilisons l'application
et essayons d'ajouter un article avec un title ou un body vide pour voir ce qu'il
se passe. Puisque nous avons utiliser la méthode :php:meth:`Cake\\View\\Helper\\FormHelper::control()`
du FormHelper pour créer les éléments de formulaire, nos messages d'erreurs de
validation seront affichés automatiquement.

Ajout de l'Action de Suppression
================================

Donnons maintenant la possibilité à nos utilisateurs de supprimer des articles.
Commencez par créer une action ``delete()`` dans ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('L\'article {0} a été supprimé.', $article->title));
            return $this->redirect(['action' => 'index']);
        }
    }

Ce code va supprimer l'article ayant le slug ``$slug`` et utilisera la méthode
``$this->Flash->success()`` pour afficher un message de confirmation à l'utilisateur
après l'avoir redirigé sur ``/articles``. Si l'utilisateur essaie d'aller supprimer
un article avec une requête GET, la méthode ``allowMethod()`` lancera une exception.
Les exceptions non capturées sont récupérées par le gestionnaire d'exception de CakePHP
qui affichera une belle page d'erreur. Il existe plusieurs :doc:`Exceptions </development/errors>`
intégrées qui peuvent être utilisées pour remonter les différentes erreurs HTTP
que votre application aurait besoin de générer.

.. warning::

    Permettre de supprimer des données via des requêtes GET est très dangereux, car
    il est possible que des crawlers suppriment accidentellement du contenu. C'est
    pourquoi nous utilisons la méthode ``allowMethod()`` dans notre controller.

Puisque nous exécutons seulement de la logique et redirigeons directement sur une
autre action, cette action n'a pas de template. Vous devez ensuite mettre à jour
votre template index pour ajouter les liens qui permettront de supprimer les
articles :

.. code-block:: php

    <!-- Fichier : src/Template/Articles/index.ctp (ajout des liens de suppression) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Titre</th>
            <th>Créé le</th>
            <th>Action</th>
        </tr>

        <!-- C'est ici que nous bouclons sur notre objet Query $articles pour afficher les informations de chaque article -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Modifier', ['action' => 'edit', $article->slug]) ?>
                <?= $this->Form->postLink(
                    'Supprimer',
                    ['action' => 'delete', $article->slug],
                    ['confirm' => 'Êtes-vous sûr ?'])
                ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Utiliser :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` va créer un lien
qui utilisera du JavaScript pour faire une requête POST et supprimer notre article.

.. note::

    Ce code de view utilise également le ``FormHelper`` pour afficher à l'utilisateur
    une boîte de dialogue de confirmation en JavaScript avant la suppression
    effective de l'article.

Maintenant que nous avons un minimum de gestion sur nos articles, il est temps
de créer des actions basiques pour nos tables Tags et Users.
