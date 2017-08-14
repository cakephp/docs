Tutoriel CMS - Création de la base de données
#############################################

Maintenant que CakePHP est installé, il est temps d'installer la base de données
pour notre application :abbr:`CMS (Content Management System)`. Si vous ne l'avez
pas encore fait, créez une base de données vide qui servira pour ce tutoriel, avec
le nom de votre choix (par exemple ``cake_cms``). Exécutez ensuite la requête suivante
pour créer les premières tables nécessaires au tutoriel::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'sekret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());

Vous avez peut-être remarqué que la table ``articles_tags`` utilise une clé primaire
composée. CakePHP supporte les clés primaires composées presque partout, rendant
facile la construction d'application multi-entité.

Les noms de tables et de colonnes utilisés ne sont pas arbitraires. En utilisant les
:doc:`conventions de nommages </intro/conventions>` de CakePHP, nous allons bénéficier
des avantages de CakePHP de manière plus efficace et allons éviter d'avoir trop de
configuration à effectuer. Bien que CakePHP soit assez flexible pour supporter presque
n'importe quel schéma de base de données, adhérer aux conventions va vous faire gagner
du temps.

Configuration de la base de données
===================================

Ensuite, disons à CakePHP où est notre base de données et comment nous y connecter.
Remplacer les valeurs dans le tableau ``Datasources.default`` de votre fichier
**config/app.php** avec celle de votre installation de base de données. Un exemple
de configuration complétée ressemblera à ceci::

    <?php
    return [
        // D'autres configurations au dessus
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'encoding' => 'utf8mb4',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // D'autres configurations en dessous
    ];

Une fois que vous avez sauvegardé votre fichier **config/app.php**, vous devriez
voir que CakePHP est capable de se connecter à la base de données sur la page d'accueil
de votre projet.

.. note::

    Une copie du fichier de configuration par défaut peut être trouvée dans
    **config/app.default.php**.

Création du premier Model
=========================

Les models font partie du coeur des applications CakePHP. Ils nous permettent
de lire et modifier les données, de construire des relations entre nos données,
de valider les données et d'appliquer les règles spécifiques à notre application.
Les models sont les fondations nécessaires pour construire nos actions de controllers
et nos templates.

Les models de CakePHP sont composés d'objets ``Table`` et ``Entity``. Les objets
``Table`` nous permettent d'accéder aux collections d'entities stockées dans une
table spécifique. Ils sont stockés dans le dossier **src/Model/Table**. Le fichier
que nous allons créer sera sauvegardé dans **src/Model/Table/ArticlesTable.php**.
Le fichier devra contenir ceci::

    <?php
    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Nous y avons attaché le behavior :doc:`/orm/behaviors/timestamp` qui remplira
automatiquement les colonnes ``created`` et ``modified`` de notre table. En
nommant notre objet Table ``ArticlesTable``, CakePHP va utiliser les conventions
de nommages pour savoir que notre model va utiliser la table ``articles``. Toujours
en utilisant les conventions, il saura que la colonne ``id`` est notre clé primaire.

.. note::

    CakePHP créera dynamiquement un objet model s'il n'en trouve pas un qui
    correspond dans le dossier **src/Model/Table**. Cela veut dire que si vous
    faites une erreur lors du nommage du fichier (par exemple articlestable.php ou
    ArticleTable.php), CakePHP ne reconnaitra pas votre configuration et utilisera
    ce model généré à la place.

Nous allons également créer une classe Entity pour notre Articles. Les Entities
représentent un enregistrement spécifique en base et donnent accès aux données
d'une ligne de notre base. Notre Entity sera sauvegardée dans **src/Model/Entity/Article.php**.
Le fichier devra ressembler à ceci::

    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

Notre entity est assez simple pour l'instant et nous y avons seulement défini la
propriété ``_accessible`` qui permet de contrôler quelles propriétés peuvent être
modifier via :ref:`entities-mass-assignment`.

Pour l'instant, nous ne pouvons pas faire grande chose avec notre model. Pour
intéragir avec notre model, nous allons ensuite créer nos premiers
Controllers et Templates.
