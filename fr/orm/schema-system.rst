Système de Schéma
#################

.. php:namespace:: Cake\Database\Schema

CakePHP dispose d'un système de schéma qui est capable de montrer et de générer
les informations de schéma des tables dans les stockages de données SQL. Le
système de schéma peut générer/montrer un schéma pour toute plateforme SQL
que CakePHP supporte.

Les principales parties du système de schéma sont ``Cake\Database\Schema\Collection``
et ``Cake\Database\Schema\TableSchema``. Ces classes vous donnent accès
respectivement à la base de donnée toute entière et aux fonctionnalités de
l'objet TableSchema.

L'utilisation première du système de schéma est pour les :ref:`test-fixtures`.
Cependant, il peut aussi être utilisé dans votre application si nécessaire.

Objets Schema\\TableSchema
==========================

.. php:class:: TableSchema

Le sous-système de schéma fournit un objet TableSchema pour récupérer les données d'une
table dans la base de données. Cet objet est retourné par les fonctionnalités
de réflection de schéma::

    use Cake\Database\Schema\TableSchema;

    // Crée une table colonne par colonne.
    $schema = new TableSchema('posts');
    $schema->addColumn('id', [
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

    // Les classes Schema\TableSchema peuvent aussi être créées avec des données de tableau
    $schema = new TableSchema('posts', $columns);

Les objets ``Schema\TableSchema`` vous permettent de construire des informations sur
le schéma d'une table. Il aide à normaliser et à valider les données utilisées
pour décrire une table. Par exemple, les deux formulaires suivants sont
équivalents::

    $schema->addColumn('title', 'string');
    // et
    $schema->addColumn('title', [
      'type' => 'string'
    ]);

Bien qu'équivalent, le 2ème formulaire donne plus de détails et de contrôle.
Ceci émule les fonctionnalités existantes disponibles dans les fichiers de
Schéma + le schéma de fixture dans 2.x.

Accéder aux Données de Colonne
------------------------------

Les colonnes sont soit ajoutées en argument du constructeur, soit via
`addColumn()`. Une fois que les champs sont ajoutés, les informations peuvent
être récupérées en utilisant `column()` ou `columns()`::

    // Récupère le tableau de données d'une colonne
    $c = $schema->column('title');

    // Récupère la liste de toutes les colonnes.
    $cols = $schema->columns();

Index et Contraintes
--------------------

Les index sont ajoutés en utilisant ``addIndex()``. Les contraintes sont
ajoutées en utilisant ``addConstraint()``. Les index et contraintes ne
peuvent pas être ajoutés pour les colonnes qui n'existent pas puisque cela
donnerait un état invalide. Les index sont différents des contraintes et
des exceptions seront levées si vous essayez de mélanger les types entre
les méthodes. Un exemple des deux méthodes est::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
      ->addColumn('author_id', 'integer')
      ->addColumn('title', 'string')
      ->addColumn('slug', 'string');

    // Ajoute une clé primaire.
    $schema->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);
    // Ajoute une clé unique
    $schema->addConstraint('slug_idx', [
      'columns' => ['slug'],
      'type' => 'unique',
    ]);
    // Ajoute un indice
    $schema->addIndex('slug_title', [
      'columns' => ['slug', 'title'],
      'type' => 'index'
    ]);
    // Ajoute une clé étrangère
    $schema->addConstraint('author_id_idx', [
      'columns' => ['author_id'],
      'type' => 'foreign',
      'references' => ['authors', 'id'],
      'update' => 'cascade',
      'delete' => 'cascade'
    ]);

Si vous ajoutez une contrainte de clé primaire à une colonne unique integer,
elle va automatiquement être convertie en une colonne auto-incrémentée/série
selon la plateforme de la base de données::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
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

    $schema = new TableSchema('posts');
    $schema->addColumn('id', [
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

Lire les Index et les Contraintes
---------------------------------

Les index et les contraintes peuvent être lus d'un objet table en utilisant
les méthodes d'accesseur. En supposant que ``$schema`` est une instance de table
remplie, vous pourriez faire ce qui suit::

    // Récupère les contraintes. Va retourner les noms de toutes les
    // contraintes.
    $constraints = $schema->constraints()

    // Récupère les données sur une contrainte unique.
    $constraint = $schema->constraint('author_id_idx')

    // Récupère les index. Va retourner les noms de tous les index
    $indexes = $schema->indexes()

    // Récupère les données d'un index unique.
    $index = $schema->index('author_id_idx')


Ajouter des Options de Table
----------------------------

Certains drivers (principalement MySQL) supportent et nécessitent des
meta données de table supplémentaires. Dans le cas de MySQL, les propriétés
``CHARSET``, ``COLLATE`` et ``ENGINE`` sont nécessaires pour maintenir une
structure de table dans MySQL. Ce qui suit pourra être utilisé pour ajouter
des options de table::

    $schema->options([
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
    $schema = new TableSchema('posts', $fields, $indexes);

    // Crée une table
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // Supprime une table
    $sql = $schema->dropSql($db);
    $db->execute($sql);

En utilisant un driver de connection, les données de schéma peuvent être
converties en SQL spécifique à la plateforme. Le retour de ``createSql`` et
``dropSql`` est une liste de requêtes SQL nécessaires pour créer une table et
les index nécessaires. Certaines plateformes peuvent nécessiter plusieurs
lignes pour créer des tables avec des commentaires et/ou index. Un tableau
de requêtes est toujours retourné.


Collections de Schéma
=====================

.. php:class:: Collection

``Collection`` fournit un accès aux différentes tables disponibles pour une
connection. Vous pouvez l'utiliser pour récupérer une liste des tables ou
envoyer les tables dans les objets :php:class:`TableSchema`. Une utilisation
habituelle de la classe ressemble à::

    $db = ConnectionManager::get('default');

    // Crée une collection de schéma.
    $collection = $db->schemaCollection();

    // Récupère les noms des tables
    $schemaables = $collection->listTables();

    // Récupère une table unique (instance de Schema\TableSchema)
    $schemaable = $collection->describe('posts');

