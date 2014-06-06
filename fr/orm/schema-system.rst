Système de Schema
#################

.. php:namespace:: Cake\Database\Schema

CakePHP dispose d'un système de schema qui est capable de montrer et de générer
les informations de schema des tables dans les stockages de données SQL. Le
système de schema peut générer/montrer un schema pour toute plateforme SQL
que CakePHP supporte.

Les principales parties du système de schema sont ``Cake\Database\Schema\Table``
et ``Cake\Database\Schema\Collection``. Ces classes vous donnent accès
respectivement à la base de donnée toute entière et aux fonctionnalités de
l'objet Table.

L'utilisation première du système de schema est pour les :ref:`test-fixtures`.
Cependant, il peut aussi être utilisé dans votre application si nécessaire.

Objets Schema\\Table
====================

.. php:class:: Table

Le sous-système de schema fournit un objet Table pour avoir les données d'une
table dans la base de données. Cet objet est retourné par les fonctionnalités
de reflection de schema::

    use Cake\Database\Schema\Table;

    // Créé une table colonne par colonne.
    $t = new Table('posts');
    $t->addColumn('id', [
      'type' => 'integer',
      'length' => 11,
      'null' => false,
      'default' => null,
    ])->addColumn('title', [
      'type' => 'string',
      'length' => 255,
      // Create a fixed length (char field)
      'fixed' => true
    ])->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);

    // Classes Schema\Table peuvent aussi être créées avec des données de tableau
    $t = new Table('posts', $columns);

Les objets ``Schema\Table`` vous permettent de construire des informations sur
le schema d'une table. Il aide à normaliser et à valider les données utilisés
pour décrire une table. Par exemple, les deux formulaires suivants sont
équivalents::

    $t->addColumn('title', 'string');
    // et
    $t->addColumn('title', [
      'type' => 'string'
    ]);

 Bien qu'équivalent, le 2ème formulaire donne plus de détails et de contrôle.
Ceci émule les fonctionnalités existantes disponibles dans les fichiers de
Schema + le schema de fixture dans 2.x.

Accéder aux Données de Colonne
------------------------------

Les colonnes sont soit ajoutées en argument du constructeur, soit via
`addColumn()`. Une fois que les champs sont ajoutés, les informations peuvent
être récupérées en utilisant `column()` ou `columns()`::

    // Récupère le tableau de données d'une colonne
    $c = $t->column('title');

    // Récupère la liste de toutes les colonnes.
    $cols = $t->columns();


Indices et Contraintes
----------------------

Les indices sont ajoutés en utilisant ``addIndex()``. Les contraintes sont
ajoutées en utilisant ``addConstraint()``.  Les indices & contraintes peuvent
être ajoutés pour les colonnes qui n'existent pas, puisque cela donnera un
état invalide. Les indices sont différents des contraintes et les exceptions
seront levées si vous essayez de mélanger les types entre les méthodes. Un
exemple des deux méthodes est::

    $t = new Table('posts');
    $t->addColumn('id', 'integer')
      ->addColumn('author_id', 'integer')
      ->addColumn('title', 'string')
      ->addColumn('slug', 'string');

    // Ajoute une clé primaire.
    $t->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);
    // Ajoute une clé unique
    $t->addConstraint('slug_idx', [
      'columns' => ['slug'],
      'type' => 'unique',
    ]);
    // Ajoute un indice
    $t->addIndex('slug_title', [
      'columns' => ['slug', 'title'],
      'type' => 'index'
    ]);
    // Ajoute une clé étrangère
    $t->addConstraint('author_id_idx', [
      'columns' => ['author_id'],
      'type' => 'foreign',
      'references' => ['authors', 'id'],
      'update' => 'cascade',
      'delete' => 'cascade'
    ]);

Si vous ajoutez une contrainte de clé primaire à une colonne unique integer,
elle va automatiquement être convertie en une colonne auto-incrémentée/serial
selon la plateforme de la base de données::

    $t = new Table('posts');
    $t->addColumn('id', 'integer')
        ->addConstraint('primary', [
            'type' => 'primary',
            'columns' => ['id']
        ]);

Dans l'exemple ci-dessus, la colonne ``id`` générerait le SQL suivant dans
MySQL::

    CREATE TABLE `posts` (
        `id` INTEGER AUTO_INCREMENT,
        PRIMARY KEY (`id`)
    )

Si votre clé primaire contient plus d'une colonne, aucune d'elle ne sera
automatiquement convertie en une valeur auto-incrémentée. A la place, vous
devrez dire à l'objet table quelle colonne dans la clé composite vous voulez
auto-incrémenter::

    $t = new Table('posts');
    $t->addColumn('id', [
        'type' => 'integer',
        'autoIncrement' => true,
    ])
    ->addColumn('account_id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id', 'account_id']
    ]);

L'option ``autoIncrement`` ne fonctionne qu'avec les colonnes ``integer`` et
``biginteger``.

Lire les Indices et les Contraintes
-----------------------------------

Les indices et les contraintes peuvent être lus d'un objet table en utilisant
les méthodes d'accesseur. En supposant que ``$t`` est une instance de table
remplie, vous pourriez faire ce qui suit::

    // Récupère les contraintes. Va retourner les noms de toutes les
    // contraintes.
    $constraints = $t->constraints()

    // Récupère les données sur une contrainte unique.
    $constraint = $t->constraint('author_id_idx')

    // Récupère les indices. Va retourner les noms de tous les indices
    $indexes = $t->indexes()

    // Récupère les données d'un indice unique.
    $index = $t->index('author_id_idx')


Ajouter des Options de Table
----------------------------

Certains drivers (principalement MySQL) supportent & nécessitent des
meta données de table supplémentaires. Dans le cas de MySQL, les propriétés
``CHARSET``, ``COLLATE`` et ``ENGINE`` sont nécessaires pour maintenir une
structure de table dans MySQL. Ce qui suit pourra être utilisée pour ajouter
des options de table::

    $t->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

Les languages de plateforme ne gèrent que les clés qui les intéressent et
ignorent le reste. Toutes les options ne sont pas supportées sur toutes les
plateformes.

Convertir les Tables en SQL
---------------------------

En utilisant ``createSql()`` ou ``dropSql()`` vous pouvez récupérer du SQL
spécifique à la plateforme pour créer ou supprimer une table spécifique::

    $db = ConnectionManager::get('default');
    $schema = new Table('posts', $fields, $indexes);

    // Créé une table
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // Supprime une table
    $sql = $schema->dropSql($db);
    $db->execute($sql);

En utilisant un driver de connection, les données de schema peuvent être
converties en SQL spécifique à la plateforme. Le retour de ``createSql`` et
``dropSql`` est une liste de requêtes SQL nécessaires pour créer une table et
les indices nécessaires. Certaines plateformes peuvent nécessiter plusieurs
lignes pour créer des tables avec des commentaires et/ou indices. Un tableau
de requêtes est toujours retourné.


Collections de Schema
=====================

.. php:class:: Collection

``Collection`` fournit un accès aux différentes tables disponibles pour une
connection. Vous pouvez l'utiliser pour récupérer une liste des tables ou
envoyer les tables dans les objets :php:class:`Table`. Une utilisation
habituelle de la classe ressemble à::

    $db = ConnectionManager::get('default');

    // Créé une collection de schema.
    $collection = $db->schemaCollection();

    // Récupère les noms des tables
    $tables = $collection->listTables();

    // Récupère une table unique (instance de Schema\Table)
    $table = $collection->describe('posts')
