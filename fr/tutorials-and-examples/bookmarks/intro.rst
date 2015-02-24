Tutoriel de Bookmarker
######################

Ce tutoriel va vous montrer la création d'une application simple
de bookmarking (bookmarker). Pour commencer, nous allons installer CakePHP,
créer notre base de données et utiliser les outils que CakePHP nous fournit pour
créer une application rapidement.

Voici ce dont vous allez avoir besoin:

#. Un serveur de base de données. Nous allons utiliser un serveur MySQL dans
   ce tutoriel. Vous devrez en savoir assez sur SQL pour créer une base de
   données: CakePHP prendra les rênes à partir de là. Puisque nous utilisons
   MySQL, assurez-vous aussi d'avoir ``pdo_mysql`` activé dans PHP.
#. Des connaissances de base en PHP.

C'est parti !

Récupérer CakePHP
=================

La façon la plus simple pour installer CakePHP est d'utiliser Composer. Composer
est un moyen simple d'installer CakePHP depuis votre terminal ou votre
prompteur de ligne de commandes. D'abord, vous aurez besoin de télécharger et
d'installer Composer si vous ne l'avez pas déjà fait. Si vous avez cURL
installé, c'est aussi facile que de lancer ce qui suit::

    curl -s https://getcomposer.org/installer | php

Ou alors vous pouvez télécharger ``composer.phar`` depuis le
`site de Composer <https://getcomposer.org/download/>`_.

Ensuite tapez simplement la ligne suivante dans votre terminal à partir
du répertoire d'installation pour installer le squelette d'application
CakePHP dans le répertoire **bookmarker**. ::

    php composer.phar create-project --prefer-dist -s dev cakephp/app bookmarker

L'avantage d'utiliser Composer est qu'il va automatiquement faire des tâches
de configuration importantes, comme de définir les bonnes permissions de
fichier et créer votre fichier **config/app.php** pour vous.

Il y a d'autres façons d'installer CakePHP. Si vous ne pouvez ou ne voulez pas
utiliser Composer, consultez la section :doc:`/installation`.

Peu importe la façon dont vous avez téléchargé et installé CakePHP, une fois
que votre configuration est faite, votre répertoire devrait ressembler à
ce qui suit::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

C'est le bon moment pour en apprendre un peu plus sur la façon dont la
structure du répertoire de CakePHP fonctionne. Consultez la section
:doc:`/intro/cakephp-folder-structure`.

Vérifions notre Installation
============================

Nous pouvons rapidement vérifier que notre installation fonctionne, en
vérifiant la page d'accueil par défaut. Avant de faire ceci, vous devrez
démarrer le serveur de développement::

    bin/cake server

Ceci va lancer le serveur web intégré de PHP sur le port 8765. Ouvrez
**http://localhost:8765** dans votre navigateur web pour voir la page d'accueil.
Tous les points devront être cochés sauf pour CakePHP qui n'est pas encore
capable de se connecter à votre base de données. Si ce n'est pas le cas, vous
devrez installer des extensions PHP supplémentaires ou définir des permissions de
répertoire.

Créer la Base de Données
========================

Ensuite, configurons la base de données pour notre application de bookmarking.
Si vous ne l'avez pas déjà fait, créez une base de données vide que nous
allons utiliser dans ce tutoriel, avec un nom de votre choix, par exemple
``cake_bookmarks``. Vous pouvez exécuter le SQL suivant pour créer les
tables nécessaires::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        updated DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        updated DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        updated DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        INDEX tag_idx (tag_id, bookmark_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

Vous avez peut-être remarqué que la table ``bookmarks_tags`` utilisait une
clé primaire composite. CakePHP accepte les clés primaires composites presque
partout, facilitant la construction des applications multi-tenanted.

La table et les noms de colonnes que nous avons utilisés n'étaient pas
arbitraires. En utilisant les
:doc:`conventions de nommage </intro/conventions>` de CakePHP, nous pouvons
mieux contrôler CakePHP et éviter d'avoir à configurer le framework. CakePHP est
assez flexible pour s'accommoder de tout schéma de base de données, mais
suivre les conventions va vous faire gagner du temps.

Configuration de Base de Données
================================

Ensuite, indiquons à CakePHP où se trouve notre base de données et comment
s'y connecter.
Pour la plupart d'entre vous, ce sera la première et la dernière fois que vous
devrez configurer quelque chose.

La configuration est assez simple: remplacez juste les valeurs dans le
tableau ``Datasources.default`` dans le fichier **config/app.php** avec
ceux qui correspondent à votre configuration. Un exemple simple de tableau
de configuration pourrait ressembler à ce qui suit::

    return [
        // Plus de configuration au-dessus.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // Plus de configuration en dessous.
    ];

Une fois que vous avez sauvegardé votre fichier **config/app.php**, vous
devriez voir la section 'CakePHP est capable de se connecter à la base de
données' cochée.

.. note::

    Une copie du fichier de configuration par défaut de CakePHP se trouve dans
    **config/app.default.php**.

Génération de Code Scaffold
===========================

Comme notre base de données suit les conventions de CakePHP, nous pouvons
utiliser l'application de
:doc:`console bake </bake/usage>` pour
générer rapidement une application basique. Dans votre terminal, lancez
les commandes suivantes::

    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

Ceci va générer les controllers, models, views, leurs cas de tests
correspondants et les fixtures pour nos ressources users, bookmarks et tags.
Si vous avez stoppé votre serveur, relancez-le et allez sur
**http://localhost:8765/bookmarks**.

Vous devriez voir une application basique mais fonctionnelle fournissant
des accès aux données vers les tables de la base de données de votre
application. Une fois que vous avez la liste des bookmarks, ajoutez quelques
users, bookmarks, et tags.

Ajouter un Hashage de Mot de Passe
==================================

Quand vous créez vos users, vous avez probablement remarqué que les mots de
passe sont stockés en clair. C'est très mauvais d'un point du vue
sécurité, donc réglons ceci.

C'est aussi un bon moment pour parler de la couche model dans CakePHP. Dans
CakePHP, nous séparons les méthodes qui agissent sur une collection
d'objets, et celles qui agissent sur un objet unique, dans des classes
différentes. Les méthodes qui agissent sur la collection des entities sont
mises dans la classe ``Table``, alors que les fonctionnalités correspondant
à un enregistrement unique sont mises dans la classe ``Entity``.

Par exemple, le hashage des mots de passe se fait pour un enregistrement
individuel, donc nous allons intégrer ce comportement sur l'objet entity.
Comme nous voulons hasher le mot de passe à chaque fois qu'il est défini
nous allons utiliser une méthode mutateur/setter. CakePHP va appeler
les méthodes setter basées sur les conventions à chaque fois qu'une
propriété est définie dans une de vos entities. Ajoutons un setter pour le
mot de passe. Dans **src/Model/Entity/User.php**, ajoutez ce qui suit::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Auth\DefaultPasswordHasher;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Maintenant mettez à jour un des users que vous avez créé précédemment, si vous
changez son mot de passe, vous devriez voir un mot de passe hashé à la
place de la valeur originale sur la liste ou les pages de vue. CakePHP hashe les
mots de passe avec
`bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ par défaut.
Vous pouvez aussi utiliser sha1 ou md5 si vous travaillez avec une
base de données existante.

Récupérer les Bookmarks avec un Tag Spécifique
==============================================

Maintenant que vous avez stocké les mots de passe de façon sécurisé, nous
pouvons construire quelques fonctionnalités intéressantes dans notre
application. Une fois que vous avez une collection de bookmarks, il peut
être pratique de pouvoir les chercher par tag. Ensuite nous allons
intégrer une route, une action de controller, et une méthode finder pour
chercher les bookmarks par tag.

Idéalement, nous aurions une URL qui ressemble à
**http://localhost:8765/bookmarks/tagged/funny/cat/gifs** Cela nous aide
à trouver tous les bookmarks qui ont les tags 'funny', 'cat' et 'gifs'. Avant
de pouvoir intégrer ceci, nous allons ajouter une nouvelle route. Dans
**config/routes.php**, ajoutez ce qui suit en haut du fichier::

    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

Ce qui est au-dessus définit une nouvelle 'route' qui connecte le
chemin **/bookmarks/tagged/***, vers ``BookmarksController::tags()``. En
définissant les routes, vous pouvez isoler la définition de vos URLs, de la façon
dont elles sont intégrées. Si nous visitions
**http://localhost:8765/bookmarks/tagged**, nous verrions une page d'erreur
de CakePHP. Intégrons maintenant la méthode manquante. Dans
**src/Controller/BookmarksController.php**, ajoutez ce qui suit::

    public function tags()
    {
        $tags = $this->request->params['pass'];
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);
        $this->set(compact('bookmarks', 'tags'));
    }

Créer la Méthode Finder
-----------------------

Dans CakePHP, nous aimons garder les actions de notre controller légères, et
mettre la plupart de la logique de notre application dans les models. Si vous
visitez l'URL **/bookmarks/tagged** maintenant, vous verrez une erreur comme quoi
la méthode ``findTagged()`` n'a pas été encore intégrée, donc faisons-le. Dans
**src/Model/Table/BookmarksTable.php** ajoutez ce qui suit::

    public function findTagged(Query $query, array $options)
    {
        $fields = [
            'Bookmarks.id',
            'Bookmarks.title',
            'Bookmarks.url',
        ];
        return $this->find()
            ->distinct($fields)
            ->matching('Tags', function ($q) use ($options) {
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }

Nous intégrons juste :ref:`des finders personnalisés <custom-find-methods>`. C'est
un concept très puissant dans CakePHP qui vous permet de faire un package
réutilisable de vos requêtes. Dans notre finder nous avons amené la méthode
``matching()`` qui nous permet de trouver les bookmarks qui ont un tag
qui 'match'.

Créer la Vue
------------

Maintenant si vous vous rendez à l'url **/bookmarks/tagged**, CakePHP va afficher
une erreur vous disant que vous n'avez pas de fichier de vue. Construisons
donc le fichier de vue pour notre action ``tags()``. Dans
**src/Template/Bookmarks/tags.ctp** mettez le contenu suivant::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList($tags) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>
            <?= $this->Text->autoParagraph($bookmark->description) ?>
        </article>
    <?php endforeach; ?>
    </section>

CakePHP s'attend à ce que nos templates suivent la convention de nommage où
le template a la version en minuscule et en underscore du nom de l'action du
controller.

Vous avez peut-être remarqué que nous pouvions utiliser les variables
``$tags`` et ``$bookmarks`` dans notre vue. Quand nous utilisons la méthode
``set()`` dans notre controller, nous définissons les variables spécifiques à
envoyer à la vue. La vue va rendre disponible toutes les variables passées
dans les templates en variables locales.

Dans notre vue, nous avons utilisé quelques uns des :doc:`helpers
</views/helpers>` intégrés. Les helpers sont utilisés pour rendre de la
logique réutilisable pour le formatage des données, pour la création de
HTML ou pour l'affichage d'autre vue.

Vous devriez maintenant pouvoir visiter l'URL **/bookmarks/tagged/funny** et
voir tous les bookmarks taggés avec 'funny'.

Ainsi nous avons créé une application basique pour gérer des bookmarks, des
tags et des users.
Cependant, tout le monde peut voir tous les tags de tout le monde. Dans le
prochain chapitre, nous allons intégrer une authentification et restreindre
la visibilité des bookmarks à ceux qui appartiennent à l'utilisateur courant.

Maintenant continuons avec
:doc:`/tutorials-and-examples/bookmarks/part-two`
pour construire votre application ou :doc:`plongez dans la documentation
</topics>` pour en apprendre plus sur ce que CakePHP peut faire pour vous.
