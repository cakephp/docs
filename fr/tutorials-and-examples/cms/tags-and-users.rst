Tutoriel CMS - Tags et Users
############################

Maintenant que nous avons implémenté une gestion basique de la création d'articles,
il est temps de permettre à plusieurs auteurs de travailler sur notre CMS. Dans les
étapes précédentes, nous avons créé nos models, nos views et nos controllers à la
main. Cette fois, nous allons utiliser :doc:`/bake` pour créer la base de notre
code. Bake est un outil :abbr:`CLI (Command Line Interface)` de génération de
code qui se base sur les conventions de CakePHP pour créer des applications
:abbr:`CRUD (Create, Read, Update, Delete)` basique très rapidement. Nous allons
utiliser ``bake`` pour créer le code relatif à la gestion d'utilisateurs :

.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

Ces 3 commandes vont générer :

* Les fichiers de Table, Entity, et Fixture.
* Le Controller
* Les templates CRUD.
* Les fichiers de Tests pour chaque classe générée.

Bake va aussi utiliser les conventions CakePHP pour définir les associations
et les validations pour vos models.

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

Ajouter un système de Tags aux Articles
=======================================

Il serait utile et pratique d'avoir, pour notre application :abbr:`CMS`, un moyen
de catégoriser notre contenu. Nous allons donc utiliser des tags pour permettre aux
utilisateurs d'ajouter des catégories et des labels à leurs contenus. Une fois de plus,
nous allons utiliser ``bake`` pour générer rapidement un code de base :

.. code-block:: bash

    # Génère tout le code d'un coup.
    bin/cake bake all tags

Une fois que le code de base est généré, créez quelques tags en vous rendant sur
la page **http://localhost:8765/tags/add**.

Maintenant que nous avons une table Tags, nous pouvons créer une association entre
la table Articles et la table Tags. Nous pouvons le faire en ajoutant le code suivant
à la méthode ``initialize`` de ArticlesTable::

    public function initialize(array $config)
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
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
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
``control()`` dans **src/Template/Articles/add.ctp**::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

Cela rendra un select multiple qui utilisera la variable ``$tags`` pour générer
les options du select. Vous devriez maintenant créer quelques articles en leur
mettant des tags car dans la section suivante, nous allons ajouter la possibilité
de trouver des articles par leurs tags.

Vous devriez également mettre à jour la méthode ``edit`` pour permettre l'ajout
et la modification de tags sur les articles existant. La méthode ``edit`` devrait
maintenant ressemble à ceci::

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
comme nous l'avons fait dans le template **add.ctp** au template
**src/Template/Articles/edit.ctp**.

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
devra ressembler à::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // Ceci est la route à ajouter pour notre nouvelle action.
    // Le `*` à la fin permet de préciser à CakePHP que cette action
    // a des paramètres qui lui seront passés
    Router::scope(
        '/articles',
        ['controller' => 'Articles'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // Connect the default home and /pages/* routes.
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // Connect the conventions based default routes.
        $routes->fallbacks();
    });

    Plugin::routes();

Le code ci-dessus définit une nouvelle 'route' qui permet de connecter le chemin
URL **/articles/tagged/** à ``ArticlesController::tags()``. En définissant une nouvelle
route, vous pouvez isoler le format de vos URLs de la manière dont elles sont implémentées.
Si nous venions à visiter **http://localhost:8765/articles/tagged**, nous verrions
une page d'erreur de CakePHP vous indiquant que l'action du controller n'existe
pas. Créons de ce pas cette nouvelle méthode. Dans **src/Controller/ArticlesController.php**,
ajoutez ce qui suit::

    // Ajouter ce 'use' juste sous la déclaration du namespace pour importer
    // la classe Query
    use Cake\ORM\Query;

    public function tags()
    {
        // La clé 'pass' est fournie par CakePHP et contient tous les
        // segments d'URL passés dans la requête
        $tags = $this->request->getParam('pass');

        // Utilisation de ArticlesTable pour trouver les articles taggés
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // Passage des variable dans le contexte de la view du template
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
        ]);

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

Création de la view
-------------------

Si vous visitez à nouveau **/articles/tagged**, CakePHP vous affichera une nouvelle
erreur qui vous fait savoir qu'il manque le fichier de view. Créez le fichier
**src/Template/Articles/tags.ctp** et ajoutez le contenu suivant::

    <h1>
        Articles avec les tags
        <?= $this->Text->toList(h($tags), 'ou') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Utilisation du HtmlHelper pour créer le lien -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?>
        </article>
    <?php endforeach; ?>
    </section>

Dans le code ci-dessus, nous utilisons les Helpers :doc:`/views/helpers/html` et
:doc:`/views/helpers/text` pour nous aider à générer le contenu de notre view.
Nous utilisons également la fonction raccourcie :php:func:`h` pour échapper le
contenu HTML. Pensez à utiliser ``h()`` quand vous affichez des données pour
éviter les injections de HTML.

Le fichier **tags.ctp** que nous venons de créer suit les conventions CakePHP
pour les templates de view. La convention est d'utiliser le nom de l'action du
controller en minuscule et avec un underscore en séparateur.

Vous avez peut-être remarqué que nous utilisons les variables ``$tags`` et
``$articles`` dans notre template de view. Quand nous utilisons la méthode
``set()`` dans notre controller, nous définissons les variables qui doivent
être envoyées à notre view. La classe View fera alors en sorte de passer les
variables au scope du template comme variables "locales".

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
entity, nous ajoutons un champ virtuel / pré-calculé pour l'entity. Dans
**src/Model/Entity/Article.php** ajoutez la méthode suivante::

    // Ajouter ce 'use' juste sous la déclaration du namespace pour importer
    // la classe Collection
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

Cela nous permettra d'accéder à la propriété virtuelle ``$article->tag_string``.
Nous utiliserons cette propriété plus tard.

Mettre à jour nos View
----------------------

Maintenant que notre entity est mise à jour, nous pouvons ajouter un nouvel
élément de contrôle pour nos tags. Dans
**src/Template/Articles/add.ctp** et **src/Template/Articles/edit.ctp**,
remplacez l'élément de contrôle existant ``tags._ids`` avec la déclaration
suivante::

    echo $this->Form->control('tag_string', ['type' => 'text']);

Persister la Chaîne de Tags
---------------------------

Maintenant que nous voyons les tags existant sous forme d'une chaîne, nous avons
besoin de sauvegarder les tags sous ce format. Puisque que nous avons rendu ``tag_string``
accessible, l'ORM copiera les données de la requête dans notre entity. Nous
pouvons utiliser le hook ``beforeSave()`` pour parser la chaîne de tags et trouver /
construire les entities correspondantes. Ajoutez le code suivant à
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
            ->where(['Tags.title IN' => $newTags]);

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

Bien que ce code soit plus compliqué que tout ce que nous avons fait jusqu'ici,
il permet de mettre en avant les fonctions avancées de l'ORM : vous pouvez manipuler
le résultat de la requête en utilisant les méthodes de la classe Collection
(voir la section :doc:`/core-libraries/collections`) et pouvez également gérer
les scénarios où vous avez besoin de créer des entities à la volée.

Dans le chapitre suivant, nous ajouter une couche :doc:`d'authentification <authentication>`.