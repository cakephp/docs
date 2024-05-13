Tutoriel CMS - Tags et Users
############################

Maintenant que nous avons implémenté une gestion basique de la création d'articles,
il est temps de permettre à plusieurs auteurs de travailler sur notre CMS. Dans les
étapes précédentes, nous avons créé nos models, nos views et nos controllers à la
main. Cette fois, nous allons utiliser :doc:`/bake` pour créer la base de notre
code. Bake est un outil :abbr:`CLI (Command Line Interface)` de génération de
code qui se base sur les conventions de CakePHP pour créer des applications
:abbr:`CRUD (Create, Read, Update, Delete)` basique très rapidement. Nous allons
utiliser ``bake`` pour créer le code relatif à la gestion d'utilisateurs:

.. code-block:: console

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

Ces 3 commandes vont générer:

* Les fichiers de Table, Entity, et Fixture.
* Le Controller
* Les templates CRUD.
* Les fichiers de Tests pour chaque classe générée.

Bake va aussi utiliser les conventions CakePHP pour définir les associations
et les validations pour vos models.

Ajouter un système de Tags aux Articles
=======================================

Avec plusieurs utilisateurs capables d'accéder à notre petit CMS, il serait bien d'avoir,
pour notre application :abbr:`CMS`, un moyen de catégoriser notre contenu. Nous allons donc
utiliser des tags pour permettre aux utilisateurs d'ajouter des catégories et des labels à
leurs contenus. Une fois de plus, nous allons utiliser ``bake`` pour générer rapidement un
code de base:

.. code-block:: console

    bin/cake bake all tags

Une fois que le code de base est généré, créez quelques tags en vous rendant sur
la page **http://localhost:8765/tags/add**.

Maintenant que nous avons une table Tags, nous pouvons créer une association entre
la table Articles et la table Tags. Nous pouvons le faire en ajoutant le code suivant
à la méthode ``initialize`` de ArticlesTable::

    public function initialize(array $config): void
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // Ajoutez cette ligne
    }

Cette association fonctionnera avec cette définition qui tient sur une seule ligne
car nous avons suivi les conventions de CakePHP lors de la création de nos tables.
Pour plus d'informations, rendez-vous dans la section :doc:`/orm/associations`.

Mettre à jour la gestion des Articles pour permettre d'ajouter des Tags
=======================================================================

Maintenant que notre application gère les tags, nous devons donner la possibilité
à nos utilisateurs d'ajouter les tags sur les articles. Premièrement, mettez à jour
l'action ``add`` pour qu'elle ressemble à ceci::

    <?php
    // dans src/Controller/ArticlesController.php
    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function add()
        {
            $article = $this->Articles->newEmptyEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

                // L'écriture de 'user_id' en dur est temporaire et
                // sera supprimée quand nous aurons mis en place l'authentification.
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Votre article a été sauvegardé.'));

                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Impossible de sauvegarder l\'article.'));
            }
            // Récupère une liste des tags.
            $tags = $this->Articles->Tags->find('list');

            // Passe les tags au context de la view
            $this->set('tags', $tags);

            $this->set('article', $article);
        }

        // Les autres actions
    }

Les lignes de code ajoutées chargent une liste des tags sous forme de tableau associatif
de la forme ``id => title``. Ce format nous permet de créer un nouvel input de tags dans
notre template. Ajoutez la ligne suivante dans le bloc PHP avec les autres appels à
``control()`` dans **templates/Articles/add.php**::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

Cela rendra un select multiple qui utilisera la variable ``$tags`` pour générer
les options du select. Vous devriez maintenant créer quelques articles en leur
mettant des tags car dans la section suivante, nous allons ajouter la possibilité
de trouver des articles par leurs tags.

Vous devriez également mettre à jour la méthode ``edit`` pour permettre l'ajout
et la modification de tags sur les articles existant. La méthode ``edit`` devrait
maintenant ressembler à ceci::

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // charge les Tags associés
            ->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été modifié.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible de mettre à jour votre article.'));
        }

        // Récupère une liste des tags.
        $tags = $this->Articles->Tags->find('list');

        // Passe les tags au context de la view
        $this->set('tags', $tags);

        $this->set('article', $article);
    }

Pensez à ajouter le nouveau select multiple qui permet de sélectionner les tags
comme nous l'avons fait dans le template **add.php** au template
**templates/Articles/edit.php**.

Trouver des Articles via les Tags
=================================

Une fois que les utilisateurs ont catégorisé leurs contenus, ils voudront probablement
retrouver ces contenus en fonction des tags utilisés. Pour développer ces fonctionnalités,
nous allons implémenter une nouvelle route, une nouvelle action de controller et une
fonction de finder pour chercher les articles par tags.

Idéalement, nous voulons une URL qui ressemblera à
**http://localhost:8765/articles/tagged/funny/cat/gifs**. Cela nous permettra
de trouver tous les articles avec le tag 'funny', 'cat' ou 'gifs'. Nous avons tout
d'abord besoin d'ajouter une nouvelle route. Votre fichier **config/routes.php**
(avec les commentaires générés par bake supprimés) devra ressembler à::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    $routes->scope('/', function (RouteBuilder $builder) {
        $builder->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);
        $builder->connect('/pages/*', ['controller' => 'Pages', 'action' => 'display']);

        // Ceci est la route à ajouter pour notre nouvelle action.
        // Le `*` à la fin permet de préciser à CakePHP que cette action
        // a des paramètres qui lui seront passés
        $builder->scope('/articles', function (RouteBuilder $builder) {
            $builder->connect('/tagged/*', ['controller' => 'Articles', 'action' => 'tags']);
        });

        $builder->fallbacks();
    });

Le code ci-dessus définit une nouvelle 'route' qui permet de connecter le chemin
URL **/articles/tagged/** à ``ArticlesController::tags()``. En définissant des routes,
vous pouvez isoler le format de vos URLs de la manière dont elles sont implémentées.
Si nous venions à visiter **http://localhost:8765/articles/tagged**, nous verrions
une page d'erreur de CakePHP vous indiquant que l'action du controller n'existe
pas. Créons de ce pas cette nouvelle méthode. Dans **src/Controller/ArticlesController.php**,
ajoutez ce qui suit::

    public function tags()
    {
        // La clé 'pass' est fournie par CakePHP et contient tous les
        // segments d'URL passés dans la requête
        $tags = $this->request->getParam('pass');

        // Utilisation de ArticlesTable pour trouver les articles taggés
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ])
        ->all();

        // Passage des variables dans le contexte de la view du template
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

Pour accéder aux autres parties des données de la requête, consultez la section
:ref:`cake-request`.

Puisque les arguments passés sont aussi fournis comme paramètres de la méthode
d'action, nous pourrions également écrire l'action en utilisant les arguments
variadic de PHP::

    public function tags(...$tags)
    {
        // Utilisation de ArticlesTable pour trouver les articles taggés
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ])
        ->all();

        // Passage des variable dans le contexte de la view du template
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

Création de la Méthode Finder
-----------------------------

Dans CakePHP, nous aimons garder nos actions de controller le plus minimaliste
possible et mettons la majorité de la logique de notre application dans la couche
model. Si vous veniez à visiter l'URL **/articles/tagged**, vous verriez une erreur
vous indiquant que la méthode ``findTagged()`` n'existe pas. Dans
**src/Model/Table/ArticlesTable.php**, ajoutez le code suivant::

    // Ajouter ce 'use' juste sous la déclaration du namespace pour importer
    // la classe Query
    use Cake\ORM\Query;

    // L'argument $query est une instance du Query builder.
    // Le tableau $options va contenir l'option 'tags' que nous avons passé
    // à find('tagged') dans notre action de controller.
    public function findTagged(Query $query, array $options)
    {
        $columns = [
            'Articles.id', 'Articles.user_id', 'Articles.title',
            'Articles.body', 'Articles.published', 'Articles.created',
            'Articles.slug',
        ];

        $query = $query
            ->select($columns)
            ->distinct($columns);

        if (empty($options['tags'])) {
            // si aucun tag n'est fourni, trouvons les articles qui n'ont pas de tags
            $query->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            // Trouvons les articles qui ont au moins un des tags fourni
            $query->innerJoinWith('Tags')
                ->where(['Tags.title IN' => $options['tags']]);
        }

        return $query->group(['Articles.id']);
    }

Nous venons d'implémenter :ref:`un custom finder <custom-find-methods>`. Ce concept
très pratique de CakePHP vous permet de définir des requêtes réutilisables. Les
méthodes finder récupèrent toujours en paramètres un objet :doc:`/orm/query-builder`
et un tableau d'options. Les finders peuvent manipuler la requête et ajouter
n'importe quels condition ou critère. Une fois la logique terminée, le finder doit
retourner une instance modifiée de l'objet query. Dans notre finder, nous utilisons
les méthodes ``distinct()`` et ``leftJoin()`` qui nous permettent de trouver les articles
différents qui ont les tags correspondant.

Création de la View
-------------------

Si vous visitez à nouveau **/articles/tagged**, CakePHP vous affichera une nouvelle
erreur qui vous fait savoir qu'il manque le fichier de view. A présent, créons le fichier
de vue pour notre action ``tags()`` action::

    <!-- Dans templates/Articles/tags.php -->
    <h1>
        Articles avec les tags
        <?= $this->Text->toList(h($tags), 'or') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Utilisation du HtmlHelper pour créer le lien -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?></span>
        </article>
    <?php endforeach; ?>
    </section>

Dans le code ci-dessus, nous utilisons les Helpers :doc:`/views/helpers/html` et
:doc:`/views/helpers/text` pour nous aider à générer le contenu de notre view.
Nous utilisons également la fonction raccourcie :php:func:`h` pour échapper le
contenu HTML. Pensez à utiliser ``h()`` quand vous affichez des données pour
éviter les injections de HTML.

Le fichier **tags.php** que nous venons de créer suit les conventions CakePHP
pour les templates de view. La convention est d'utiliser le nom de l'action du
controller en minuscule et avec un underscore en séparateur.

Vous avez peut-être remarqué que nous utilisons les variables ``$tags`` et
``$articles`` dans notre template de view. Quand nous utilisons la méthode
``set()`` dans notre controller, nous définissons les variables qui doivent
être envoyées à notre view. La classe View fera alors en sorte de passer les
variables au scope du template comme variables locales.

Vous devriez maintenant être capable de visiter la page **/articles/tagged/funny**
et voir tous les articles avec le tag 'funny'.

Améliorer la Gestion des Tags
=============================

Pour le moment, ajouter des tags est assez fastidieux puisque les rédacteurs auront
besoin de créer les tags à utiliser avant de les assigner. Nous pouvons améliorer
l'UI de notre gestion de tag en utilisant une liste de valeurs séparées par des
virgules. Cela nous permettra d'améliorer l'expérience utilisateur et de découvrir
d'autres fonctionnalités de l'ORM.

Ajouter un Champ Pré-calculé
----------------------------

Puisque nous souhaitons une manière simple d'accéder aux tags formattés pour une
entity, nous ajoutons un champ virtuel/pré-calculé pour l'entity. Dans
**src/Model/Entity/Article.php** ajoutez la méthode suivante::

    // Ajouter ce 'use' juste sous la déclaration du namespace pour importer
    // la classe Collection
    use Cake\Collection\Collection;

    // Mettez à jour la propriété accessible pour qu'elle contienne `tag_string`
    protected array $_accessible = [
        //autres champs...
        'tag_string' => true
    ];
    protected function _getTagString()
    {
        if (isset($this->_fields['tag_string'])) {
            return $this->_fields['tag_string'];
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

Cela nous permettra d'accéder à la propriété virtuelle ``$article->tag_string``.
Nous utiliserons cette propriété plus tard dans nos contrôles (control).

Mettre à jour nos View
----------------------

Maintenant que notre entity est mise à jour, nous pouvons ajouter un nouvel
élément de contrôle pour nos tags. Dans
**templates/Articles/add.php** et **templates/Articles/edit.php**,
remplacez l'élément de contrôle existant ``tags._ids`` avec la déclaration
suivante::

    echo $this->Form->control('tag_string', ['type' => 'text']);


Nous devrons également mettre à jour le modèle de vue d'article. Dans
**templates/Articles/view.php**, ajoutez la ligne comme indiqué::

    <!-- Fichier: templates/Articles/view.php -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    // Add the following line
    <p><b>Tags:</b> <?= h($article->tag_string) ?></p>

Vous devriez aussi mettre à jour la méthode de vue pour permettre de récupérer
les tags existants::

    // fichier src/Controller/ArticlesController.php

    public function view($slug = null)
    {
       // Mettre à jour la récupération des tags avec contain()
       $article = $this->Articles
           ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
        $this->set(compact('article'));
    }

Persister la Chaîne de Tags
---------------------------

Maintenant que nous voyons les tags existant sous forme d'une chaîne, nous avons
besoin de sauvegarder les tags sous ce format. Puisque que nous avons rendu ``tag_string``
accessible, l'ORM copiera les données de la requête dans notre entity. Nous
pouvons utiliser le hook ``beforeSave()`` pour parser la chaîne de tags et
trouver/construire les entities correspondantes. Ajoutez le code suivant à
**src/Model/Table/ArticlesTable.php**::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }

        // Le code déjà existant
    }

    protected function _buildTags($tagString)
    {
        // Trim des tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Retire les tags vides
        $newTags = array_filter($newTags);
        // Dé-doublonne les tags
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags])
            ->all();

        // Retire les tags existant de la liste des nouveaux tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Ajout des tags existant.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Ajout des nouveaux tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }

        return $out;
    }

Si vous créez ou modifiez maintenant des articles, vous devriez pouvoir enregistrer les balises
sous forme de liste de balises séparées par des virgules et créer automatiquement les balises et
les enregistrements de liaison.

Bien que ce code soit plus compliqué que tout ce que nous avons fait jusqu'ici,
il permet de mettre en avant les fonctions avancées de l'ORM : vous pouvez manipuler
le résultat de la requête en utilisant les méthodes de la classe Collection
(voir la section :doc:`/core-libraries/collections`) et pouvez également gérer
les scénarios où vous avez besoin de créer des entities à la volée.


Remplir automatiquement les Tags
================================

Avant de terminer, nous aurons besoin d'un mécanisme qui chargera les Tag associés (le cas échéant)
chaque fois que nous chargerons un article.

Dans votre **src/Model/Table/ArticlesTable.php**, changez::

    public function initialize(array $config): void
    {
        $this->addBehavior('Timestamp');
        // Modifiez cette ligne
        $this->belongsToMany('Tags', [
            'joinTable' => 'articles_tags',
            'dependent' => true
        ]);
    }


Cela indiquera au modèle de table Articles qu'une table de jointure est associée
avec des tags. L'option 'dépendent' indique à la table de supprimer tout
enregistrement associé de la table de jointure si un article est supprimé.

Enfin, mettez à jour les appels de la méthode ``findBySlug()`` dans
**src/Controller/ArticlesController.php**::

    public function edit($slug)
    {
        // Mettez à jour cette ligne
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
    ...
    }

    public function view($slug = null)
    {
        // Mettez à jour cette ligne
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
        $this->set(compact('article'));
    }

La méthode ``contain ()`` indique à l'objet ``ArticlesTable`` de remplir également l'association
Tags lorsque l'article est chargé. Maintenant, quand tag_string est appelé pour
une entité Article, il y aura des données présentes pour créer la chaîne!

Dans le chapitre suivant, nous ajouter une couche
:doc:`d'authentification </tutorials-and-examples/cms/authentication>`.
