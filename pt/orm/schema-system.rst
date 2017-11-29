Schema
######

.. php:namespace:: Cake\Database\Schema

O CakePHP possui um sistema de schema que é capaz de refletir e gerar informaçes
de schema para tabelas em SQL datastores. O sistema de schema pode gerar/refletir
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

    // Criar uma tabela, uma coluna por vez.
    $schema = new TableSchema('posts');
    $schema->addColumn('id', [
      'type' => 'integer',
      'length' => 11,
      'null' => false,
      'default' => null,
    ])->addColumn('title', [
      'type' => 'string',
      'length' => 255,
      // Cria um campo de tamanho fixo (char field)
      'fixed' => true
    ])->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);

    // Classes Schema\TableSchema também podem ser criados com array de dados
    $schema = new TableSchema('posts', $columns);

Objetos ``Schema\TableSchema`` permitem você construir apartir de informações sobre schema de tabelas.
Isto ajuda a normalizar e validar os dados usados para descrever uma tabela. Por exemplo, as duas formas
a seguir são equivalentes::

    $schema->addColumn('title', 'string');
    // e
    $schema->addColumn('title', [
      'type' => 'string'
    ]);

Enquanto equivalete, a 2ª forma permite mais detalhes e controle. Isso emula
os recursos existentes disponíveis em arquivos de Schema + os schema de fixture em 2.x.

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

Lendo Índices e Restrições
--------------------------

Os índices e restrições podem ser lido de um objeto de tabela usando métodos
acessores. Assumindo que ``$schema`` é uma instância de TableSchema populada, você poderia
fazer o seguinte::

    // Obter restrições. Retornará os
    // nomes de todas as restrições.
    $constraints = $schema->constraints()

    // Obter dados sobre uma restrição.
    $constraint = $schema->constraint('author_id_idx')

    // Obter índices. Retornará os
    // nomes de todos os índices
    $indexes = $schema->indexes()

    // Obter dados sobre um índice
    $index = $schema->index('author_id_idx')


Adicionando Opções de Tabela
----------------------------

Alguns drivers (principalmente MySQL) suportam e requerem metadados de tabela
adicionais. No caso do MySQL as propriedades ``CHARSET``, ``COLLATE`` e ``ENGINE``
são requeridos para manter a estrutura de uma tabela no MySQL. O seguinte
pode ser usado para adicionar opções de tabela::

    $schema->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

Os dialetos de plataforma apenas cuidam das chaves que eles estão interessados
e ignoram o resto. Nem todas as opções são suportadas por todas as plataformas.

Convertendo TableSchema em SQL
------------------------------

Usando os métodos ``createSql()`` ou ``dropSql()`` você pode obter
SQL específico de plataforma para criar ou remover uma tabela específica::

    $db = ConnectionManager::get('default');
    $schema = new TableSchema('posts', $fields, $indexes);

    // Criar uma tabela
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // Remover um tabela
    $sql = $schema->dropSql($db);
    $db->execute($sql);

Ao usar o driver de conexão, os dados de schema podem ser convertidos em
SQL específico da plataforma. O retorno de ``createSql`` e ``dropSql`` é uma
lista de consultas SQL requeridas para criar uma tabela e os indices.
Algumas plataformas podem requerer várias declaraçes para criar tabelas com
comentários e/ou índices. Um array de consultas SQL é sempre retornado.


Schema Collections
==================

.. php:class:: Collection

``Collection`` fornece acesso as várias tabelas disponíveis numa conexão.
Você pode usar isto para obter a lista de tabelas ou refletir tabelas em 
objetos :php:class:`TableSchema`. O uso básico da classe parece com::

    $db = ConnectionManager::get('default');

    // Criar uma coleção de schema.
    $collection = $db->schemaCollection();

    // Obtem os nomes das tabelas.
    $tables = $collection->listTables();

    // Obtem uma tabela específica (instância de Schema\TableSchema)
    $tableSchema = $collection->describe('posts');

