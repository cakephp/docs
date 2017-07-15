Gestion des Schémas et migrations
#################################

Le shell Schema permet de créer des objets, des dumps sql et de créer et
restaurer des vues instantanées de votre base de données.

Générer et utiliser les fichiers Schema
=======================================

Un fichier de génération de schéma vous permet de facilement
transporter un schéma de base de données agnostique.
Vous pouvez générer un fichier de schéma de votre base de données en
utilisant::

    $ Console/cake schema generate

Cela générera un fichier schema.php dans votre dossier ``app/Config/Schema``.

.. note::

    Le shell schema n'utilise que les tables pour lesquelles des models
    sont définis.
    Pour forcer le shell à considérer toutes les tables,
    vous devez ajouter l'option ``-f`` à votre ligne de commande.

Pour reconstruire plus tard votre schéma de base de données
à partir d'un fichier schema.php précédemment réalisé, lancez::

    $ Console/cake schema create

Cela va supprimer et créer les tables en se basant sur le contenu de
schema.php.

Les fichiers de schéma peuvent aussi être utilisés pour générer des dumps sql.
Pour générer un fichier sql comprenant les définitions ``CREATE TABLE``,
lancez::

    $ Console/cake schema dump --write filename.sql

filename.sql est le nom souhaité pour le fichier contenant le dump sql.
Si vous omettez filename.sql, le dump sql sera affiché sur la console,
mais ne sera pas écrit dans un fichier.

callbacks de CakeSchema
=======================

Après avoir généré un schema, vous voudrez peut-être insérer des données de
départ à des tables de votre application. Ceci peut être accompli avec les
callbacks de CakeSchema.
Chaque fichier de schema est généré avec les méthodes
``before($event = array())`` et ``after($event = array())``.

Le paramètre ``$event`` contient un tableau avec deux clés. Une pour dire si
une table a été supprimée ou créée et une autre pour les erreurs. Exemples::

    array('drop' => 'posts', 'errors' => null)
    array('create' => 'posts', 'errors' => null)

Ajouter des données à une table posts par exemple donnerait ceci::

    App::uses('Post', 'Model');
    public function after($event = array()) {
        if (isset($event['create'])) {
            switch ($event['create']) {
                case 'posts':
                    App::uses('ClassRegistry', 'Utility');
                    $post = ClassRegistry::init('Post');
                    $post->create();
                    $post->save(
                        array('Post' =>
                            array('title' => 'CakePHP Schema Files')
                        )
                    );
                    break;
            }
        }
    }

Les callbacks ``before()`` et ``after()`` se lancent à chaque fois qu'une
table est créée ou supprimée sur le schema courant.

Quand vous insérez des données à plus d'une table, vous devrez faire un flush
du cache de la base de données après la création de chaque table. Le Cache
peut être désactivé en configurant
``$db->cacheSources = false`` dans l'action before(). ::

    public $connection = 'default';

    public function before($event = array()) {
        $db = ConnectionManager::getDataSource($this->connection);
        $db->cacheSources = false;
        return true;
    }

Si vous utilisez les models dans vos callbacks, assurez-vous de les initialiser
avec la bonne source de données, pour ne pas qu'ils s'exécutent sur leurs
sources de données par défaut::

    public function before($event = array()) {
        $articles = ClassRegistry::init('Articles', array(
            'ds' => $this->connection
        ));
        // Do things with articles.
    }

Ecrire un Schema CakePHP à la main
==================================

La classe CakeSchema est la classe de base pour tous les schémas de base de
données. Chaque classe schema est capable de générer un ensemble de tables. La
classe de console shell schema ``SchemaShell`` dans le répertoire
``lib/Cake/Console/Command`` interprète la ligne de commande, et la classe
schema de base peut lire la base de données, ou générer la table de la base de
données.

CakeSchema peut maintenant localiser, lire et écrire les fichiers schema pour
les plugins. SchemaShell permet aussi cette fonctionnalité.

CakeSchema supporte aussi ``tableParameters``. Les paramètres de Table sont
les informations non spécifiques aux colonnes de la table comme collation,
charset, comments, et le type de moteur de la table. Chaque Dbo implémente
le tableParameters qu'ils supportent.

Exemple
-------

Voici un exemple complet à partir de la classe acl::

    /**
     * ACO - Access Control Object - Quelque chose qui est souhaité
     */
        public $acos = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'default' => null,
                'length' => 10,
                'key' => 'primary'
            ),
            'parent_id' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'model' => array('type' => 'string', 'null' => true),
            'foreign_key' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'alias' => array('type' => 'string', 'null' => true),
            'lft' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'rght' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
        );


Colonnes
--------
Chaque colonne est encodée comme un tableau associatif avec clé et valeur.
Le nom du champ est la clé du champ, la valeur est un autre tableau avec
certains des attributs suivants.

Exemple de colonne::

    'id' => array(
        'type' => 'integer',
        'null' => false,
        'default' => null,
        'length' => 10,
        'key' => 'primary'
     ),

key
    La clé ``primary`` définit l'index de clé primaire.

null
    Est-ce que le champ peut être null?

default
    Quel est la valeur par défaut du champ?

limit
    La limit du type de champ.

length
    Quelle est la longueur du champ?

type
    Un des types suivants

    * integer
    * smallinteger
    * tinyinteger
    * biginteger
    * date
    * time
    * datetime
    * timestamp
    * boolean
    * biginteger
    * float
    * string
    * text
    * binary

.. versionchanged:: 2.10.0
    Les types ``smallinteger`` et ``tinyinteger`` ont été ajoutés dans 2.10.0

La clé de Table `indexes`
=========================
Le nom de clé `indexes` est mise dans le tableau de table plutôt que dans celui
d'un nom de champ.

column
    C'est soit un nom de colonne unique, soit un tableau de colonnes.

    par exemple Unique::

        'indexes' => array(
            'PRIMARY' => array(
                 'column' => 'id',
                 'unique' => 1
                )
        )

    par exemple Multiple::

        'indexes' => array(
            'AB_KEY' => array(
                'column' => array(
                     'a_id',
                     'b_id'),
                 'unique' => 1
                )
        )


unique
    Si l'index est unique, définissez ceci à 1, sinon à 0.


La clé de Table `tableParameters`
=================================

tableParameters sont supportés uniquement dans MySQL.

Vous pouvez utiliser tableParameters pour définir un ensemble de paramètres
spécifiques à MySQL.


-  ``engine`` Controle le moteur de stockage utilisé pour vos tables.
-  ``charset`` Controle le character set utilisé pour les tables.
-  ``encoding`` Controle l'encodage utilisé pour les tables.

En plus du tableParameters de MySQL, dbo's implémente ``fieldParameters``.
``fieldParameters`` vous permet de contrôler les paramètres spécifiques à MySQL
par colonne.


-  ``charset`` Définit le character set utilisé pour une colonne
-  ``encoding`` Définit l'encodage utilisé pour une colonne

Regardez ci-dessous pour des exemples sur la façon d'utiliser les paramètres
de table et de champ dans vos fichiers de schema.

**Utilisation de tableParameters dans les fichiers de schema**

Vous utilisez ``tableParameters`` comme vous le feriez avec toute autre clé dans
un fichier de schema. Un peu comme les ``indexes``::

    var $comments => array(
        'id' => array(
            'type' => 'integer',
            'null' => false,
            'default' => 0,
            'key' => 'primary'
        ),
        'post_id' => array('type' => 'integer', 'null' => false, 'default' => 0),
        'comment' => array('type' => 'text'),
        'indexes' => array(
            'PRIMARY' => array('column' => 'id', 'unique' => true),
            'post_id' => array('column' => 'post_id'),
        ),
        'tableParameters' => array(
            'engine' => 'InnoDB',
            'charset' => 'latin1',
            'collate' => 'latin1_general_ci'
        )
    );

est un exemple d'une table utilisant ``tableParameters`` pour définir quelques
paramètres spécifiques de base de données. Si vous utilisez un fichier de
schema qui contient des options et des fonctionnalités que votre base de données
n'intègre pas, ces options seront ignorées.

Migrations avec le shell schema de CakePHP
==========================================

Les migrations permettent de "versionner" votre schéma de base de données,
de telle façon que lorsque vous développez des fonctionnalités,
vous avez une méthode facile et élégante pour relever les modifications
apportées à votre base. Les migrations sont réalisées soit grâce aux fichiers
de schémas, soit grâce aux vues instantanées. Versionner un fichier de schéma
avec le shell schema est assez facile. Si vous avez déjà un fichier schema
créé en utilisant::

    $ Console/cake schema generate

Vous aurez alors les choix suivants::

    Generating Schema... (Génération du Schema)
    Schema file exists. (Le fichier schema existe)
     [O]verwrite (Ecraser)
     [S]napshot  (Vue instantanée)
     [Q]uit      (Quitter)
    Would you like to do? (o/s/q) (Que voulez vous faire?)

Choisir [s] (snapshot - vue instantanée) va créer un fichier schema.php
incrémenté. Ainsi, si vous avez schema.php, cela va créer schema\_2.php et
ainsi de suite.
Vous pouvez ensuite restaurer chacun de ces schémas en utilisant::

    $ cake schema update -s 2

Où 2 est le numéro de la vue instantanée que vous voulez exécuter.
Le shell vous demandera de confirmer votre intention d'exécuter les définitions
``ALTER`` qui représentent les différences entre la base existante et le
fichier de schéma exécuté à ce moment.

Vous pouvez effectuer un lancement d'essai ("dry run") en ajoutant ``--dry`` à
votre commande.

Exemple d'application
=====================

Créer un schéma et committer
----------------------------

Sur un projet qui utilise le versioning,
l'utilisation du schema cake suivrait les étapes suivantes:

1. Créer ou modifier les tables de votre base de données.
2. Exécuter cake schema pour exporter une description complète de votre base de données.
3. Committer et créer ou modifier le fichier schema.php::

    $ # Une fois que votre base de données a été mise à jour
    $ Console/cake schema generate
    $ git commit -a

.. note::

    Si le projet n'est pas versionné, la gestion des schémas se fera à travers
    des vues instantanées.
    (voir la section précédente pour gérer les vues instantanées)

Récupérer les derniers changements
----------------------------------

Quand vous récupérez les derniers changements de votre répertoire,
et découvrez des changements dans la structure de la base de données
(par exemple vous avez un message d'erreur disant qu'il manque une table):

1. Exécuter cake schema pour mettre à jour votre base de données::

    $ git pull
    $ Console/cake schema create
    $ Console/cake schema update

Toutes ces opérations peuvent être faîtes en mode sans écriture ("dry-run")
via l'option ``--dry``.

Revenir en arrière
------------------

Si à un moment donné vous avez besoin de revenir en arrière et de retourner à
un état précédent à votre dernière mise à jour, vous devez être informé que ce
n'est pas pour l'instant pas possible avec cake schema.

Plus précisément, vous ne pouvez pas supprimer automatiquement vos tables
une fois qu'elles ont été créées.

L'utilisation de ``update`` supprimera, au contraire, n'importe quel champ
qui différera de votre fichier schema::

    $ git revert HEAD
    $ Console/cake schema update

Ceci vous proposera les choix suivants::

    The following statements will run. (Les requêtes suivantes vont être exécutées)
    ALTER TABLE `roles`
    DROP `position`;
    Are you sure you want to alter the tables? (y/n) (Êtes vous sur de vouloir modifier les tables?)
    [n] >


.. meta::
    :title lang=fr: Gestion des Schémas et migrations
    :keywords lang=fr: fichiers de schéma,gestion des schémas,Objets schema,base de données schema,requêtes sur table,changements de base de données,migrations,versioning,snapshots,sql,snapshot,shell,config,fonctionnalité,choix,modèles,fichiers php,fichier php,répertoire,lancement
