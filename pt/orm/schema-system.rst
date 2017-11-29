Schema
######

.. php:namespace:: Cake\Database\Schema

O CakePHP possui um sistema de schema que é capaz de refletir e gerar informaçes
de schema para tabelas em SQL datastores. O sistema de schema pode gear/refletir
schema para qualquer plataforma que o CakePHP suporte.

As partes principais do sistema de schema são ``Cake\Database\Schema\Collection``
e ``Cake\Database\Schema\TableSchema``. Essas classes te oferecem acesso a
todo o banco de dados e recursos de tabela individual respectivamente.

O uso primário de sistema de schema é para :ref:`test-fixtures`. No entanto, isso
também ser usado em sua aplicação se requerido.

Objetos Schema\\TableSchema
===========================

.. php:class:: TableSchema

O subsistema de schema oferece um simples objeto TableSchema para guardar dados
sobre uma tabela do banco de dados. Este objeto é retornado pelos recursos de 
reflexão de schema::

    use Cake\Database\Schema\TableSchema;

    // Create a table one column at a time.
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

    // Schema\TableSchema classes could also be created with array data
    $schema = new TableSchema('posts', $columns);

Objetos ``Schema\TableSchema`` permitem você construir apartir de informações sobre schema de tabelas.
Isto ajuda a normalizar e validar os dados usados para descrever uma tabela. Por exemplo, as duas formas
a seguir são equivalentes::

    $schema->addColumn('title', 'string');
    // and
    $schema->addColumn('title', [
      'type' => 'string'
    ]);

Enquanto equivalete, a 2ª forma permite mais detalhes e controle. Isso emula
os recursos existentes disponíveis arquivos de Schema + os schema de fixture em 2.x.

Acessando Dados de Coluna
-------------------------

Colunas são adicionadas como argumentos do construtor, ou pelo método `addColumn()`.
Uma vez que os campos são adicionados, as informações podem ser obtidas usando o
método  `column()` ou `columns()`::

    // Obtem um array de dados sobre a coluna
    $c = $schema->column('title');

    // Obtem uma lista com todas as colunas.
    $cols = $schema->columns();


Índices e Restrições
--------------------

Os índices são adicionado usando ``addIndex()``. Restrições são adicionadas
usando ``addConstraint()``. Os índices e restriçes não podem ser adicionados
para colunas que não existem, já que isso resultaria em um estado ínvalido.
Os índices são difentes de restrições, e exceções serão disparadas se você
tentar misturar tipos entre os métodos. Um exemplo de ambos os métodos é::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
      ->addColumn('author_id', 'integer')
      ->addColumn('title', 'string')
      ->addColumn('slug', 'string');

    // Adiciona uma chave primária.
    $schema->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);
    // Adiciona uma chave única
    $schema->addConstraint('slug_idx', [
      'columns' => ['slug'],
      'type' => 'unique',
    ]);
    // Adiciona um index
    $schema->addIndex('slug_title', [
      'columns' => ['slug', 'title'],
      'type' => 'index'
    ]);
    // Adiciona uma chave estrangeira
    $schema->addConstraint('author_id_idx', [
      'columns' => ['author_id'],
      'type' => 'foreign',
      'references' => ['authors', 'id'],
      'update' => 'cascade',
      'delete' => 'cascade'
    ]);

Se você adicionar uma restrição de chave primária para uma coluna do tipo integer, ela 
será automaticamente convertida em uma coluna auto-increment/serial dependendo da
plataforma de banco de dados::

    $schema = new TableSchema('posts');
    $schema->addColumn('id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id']
    ]);

No exemplo abaixo a coluna ``id`` geraria o seguinte SQL em MySQL::

    CREATE TABLE `posts` (
        `id` INTEGER AUTO_INCREMENT,
        PRIMARY KEY (`id`)
    )

Se sua chave primária contêm mais que uma coluna, nenhuma delas serão
automaticamente convertidas para um valor auto-incremento. Em vez disso,
você precisará dizer ao objeto da tabela qual coluna na chave composta que você
deseja usar auto-incremento::

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

A opção ``autoIncrement`` apenas funciona com colunas do tipo ``integer``
e ``biginteger``.

Reading Indexes and Constraints
-------------------------------

Indexes and constraints can be read out of a table object using accessor
methods. Assuming that ``$schema`` is a populated TableSchema instance you could do the
following::

    // Get contraints. Will return the
    // names of all constraints.
    $constraints = $schema->constraints()

    // Get data about a single constraint.
    $constraint = $schema->constraint('author_id_idx')

    // Get indexes. Will return the
    // names of all indexes.
    $indexes = $schema->indexes()

    // Get data about a single index.
    $index = $schema->index('author_id_idx')


Adding Table Options
--------------------

Some drivers (primarily MySQL) support and require additional table metadata. In
the case of MySQL the ``CHARSET``, ``COLLATE`` and ``ENGINE`` properties are
required for maintaining a table's structure in MySQL. The following could be
used to add table options::

    $schema->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

Platform dialects only handle the keys they are interested in
and ignore the rest. Not all options are supported on all platforms.

Converting Tables into SQL
--------------------------

Using the ``createSql()`` or ``dropSql()`` you can get
platform specific SQL for creating or dropping a specific table::

    $db = ConnectionManager::get('default');
    $schema = new TableSchema('posts', $fields, $indexes);

    // Create a table
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // Drop a table
    $sql = $schema->dropSql($db);
    $db->execute($sql);

By using a connection's driver the schema data can be converted into platform
specific SQL. The return of ``createSql`` and ``dropSql`` is a list of SQL
queries required to create a table and the required indexes. Some platforms may
require multiple statements to create tables with comments and/or indexes. An
array of queries is always returned.


Schema Collections
==================

.. php:class:: Collection

``Collection`` provides access to the various tables available on a connection.
You can use it to get the list of tables or reflect tables into
:php:class:`TableSchema` objects. Basic usage of the class looks like::

    $db = ConnectionManager::get('default');

    // Create a schema collection.
    $collection = $db->schemaCollection();

    // Get the table names
    $tables = $collection->listTables();

    // Get a single table (instance of Schema\TableSchema)
    $tableSchema = $collection->describe('posts');

