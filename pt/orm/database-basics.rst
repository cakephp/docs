O básico sobre banco de dados
#############################

A camada de acesso a banco de dados do CakePHP abstrai e fornece auxilio com
a maioria dos aspectos de lidar com bancos de dados relacionais como, manter
conexões com o servidor, contruir consultas, prevenir injeções SQL, inspecionar
e alterar schemas, e com debugging e profiling de consultas enviadas ao banco
de dados.

Tour Rápido
===========

As funções descritas nesse capítulo ilustram o que é possível fazer com a API
de acesso a banco de dados de baixo-nível. Se ao invés, você deseja aprender
mais sobre o ORM completo, você pode ler as seções :doc:`/orm/query-builder` e
:doc:`/orm/table-objects`.

A maneira mais fácil de crir uma conexão de banco de dados é usando uma string 
``DSN``::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::config('default', ['url' => $dsn]);

Uma vez criada, você pode acessar o objeto da conexo para iniciar a usá-lo::

    $connection = ConnectionManager::get('default');

Bancos de Dados Suportados
--------------------------

O CakePHP suporta os seguintes servidores de banco de dados relacionais:

* MySQL 5.1+
* SQLite 3
* PostgreSQL 8+
* SQLServer 2008+
* Oracle (atravéz de um plugin da comunidade)

Você precisará da extensão PDO correta instalada para cada um dos drivers de
banco de dados acima. As APIs processuais não são suportadas.
O banco de dados Oracle é suportado atravéz do plugin da comunidade
`Driver para Banco de Dados Oracle <https://github.com/CakeDC/cakephp-oracle-driver>`_

The Oracle database is supported through the
`Driver for Oracle Database <https://github.com/CakeDC/cakephp-oracle-driver>`_.

.. _running-select-statements:

Executando Instruções de Consulta
---------------------------------

Executar consultas SQL é uma moleza::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

Você pode usar prepared statement para inserir parâmetros::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

Também é possível usar tipos de dados complexos como argumentos::

    $results = $connection
        ->execute(
            'SELECT * FROM articles WHERE created >= :created',
            ['created' => DateTime('1 day ago')],
            ['created' => 'datetime']
        )
        ->fetchAll('assoc');

Ao invés de escrever a SQL manualmente, você pode usar o query builder::

    $results = $connection
        ->newQuery()
        ->select('*')
        ->from('articles')
        ->where(['created >' => new DateTime('1 day ago'), ['created' => 'datetime']])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Executando Instruções de Inserção
---------------------------------

Inserir registros no banco de dados é geralmente uma questão de algumas linhas::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Executando Instruções de Atualização
------------------------------------

Atualizar registros no banco de dados é igualmente intuitivo, o exemplo a seguir
atualizará o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);


Executando Instruções de Exclusão
---------------------------------

Da mesma forma, o método ``delete()`` é usado para excluír registros do banco de
dados, o exemplo a seguir exclui o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->delete('articles', ['id' => 10]);

.. _database-configuration:

Configuração
============

Por convenção, as conexões de banco de dados são configuradas em **config/app.php**. As
informações de conexão definida nesse arquivo são alimentadas em 
:php:class:`Cake\\Datasource\\ConnectionManager`, criando a configuração de
conexão que sua aplicação usará. Exemplo de informação de conexão pode ser
encontrada em **config/app.default.php**. Um exemplo de configuração de conexão
poderia parecer com::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'sekret',
            'database' => 'my_app',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ]
    ],

O exemplo acima criará a conexão 'default', com os parâmetros fornecidos. Você pode
definir quantas conexões quiser no seu arquivo de configuração. Você também pode
definir conexões adicionais em tempo de execução usando o método
:php:meth:`Cake\\Datasource\\ConnectionManager::config()`. Um exemplo disso seria::

    use Cake\Datasource\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'sekret',
        'database' => 'my_app',
        'encoding' => 'utf8',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);


As opções de configuração também podem ser fornecidas como uma string :term:`DSN`.
Isso é útil ao trabalhar com variáveis de ambiente ou :term:`PaaS` providers::

    ConnectionManager::config('default', [
        'url' => 'mysql://my_app:sekret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

Ao usar uma string DSN, você pode definir qualquer parâmetros/opções adicionais como
argumentos de query string.

Por padrão, todos objetos Table usará a conexão ``default``. Para usar
uma conexão não-padrão, consulte :ref:`configuring-table-connections`.

Existem várias keys suportadas na configuração de banco de dados. Uma lista
completa é a seguinte:

className
    O nome completo de classe incluindo namespace da classe que representa a
    conexão a um servidor de banco de dados. Esta classe é responsável por 
    carregar o driver do banco de dados, fornecendo mecanismos de transação SQL
    e preparando instruções SQL entre outras coisas.
driver
    O nome da classe do driver usado para implementar todas as especificidades
    para um mecanismo de banco de dados. Isso pode ser um nome de classe curto
    usando :term:`plugin syntax`, um nome de classe com seu namespace ou uma
    instância de driver. 
    Exemplos de nomes de classes curtos são Mysql, Sqlite, Postgres e Sqlserver.   
persistent
    Se deve ou não usar uma conexão persistente com o banco de dados.
host
    O nome de host do servidor de banco de dados (ou o endereço IP).
username
    O nome de usuário da conta.
password
    A senha da conta.
database
    O noma do banco de dados para essa conexão usar. Evite usar ``.`` no nome
    do seu banco de dados. Por causa de como isso complica citação de 
    identificadores, o CakePHP não suporta ``.``  em nomes de banco de dados.
    O caminho para o seu banco de dados SQLite deve ser um caminho absoluto
    (ex: ``ROOT . DS . 'my_app.db'``) para evitar caminhos incorretos
    causados por caminhos relativos.
port (*opcional*)
    A porta TCP ou o soquete Unix usado para se conectar ao servidor.
encoding
    Indica a configuração de charset usado ao enviar instruções SQL ao servidor.
    Seu padrão é a codificação padrão do banco de dados para todos os banco de
    dados exceto o DB2. Se você deseja usar a codificação UTF-8 com conexões 
    MySQL, você deve usar 'utf8' sem o hífen.
timezone
    Fuso horário do servidor para definir.
schema
    Usado em configurações de banco de dados do PostgreSQL para especificar qual schema usar.
unix_socket
    Usado por drivers que o suportam para se conectar via arquivos de soquete Unix.
    Se você estiver usando o PostgreSQL e quiser usar os soquetes Unix, deixe a chave
    do host em branco.
ssl_key
    O caminho para o arquivo de chave SSL. (Somente suportado pelo MySQL).
ssl_cert
    O caminho para o arquivo de certificado SSL. (Somente suportado pelo MySQL).
ssl_ca
    O caminho do arquivo de a autoridade de certificação SSL. (Somente suportado pelo MySQL).
init
    Uma lista de queries que devem ser enviadas para o servidor de banco de dados 
    como quando a conexão é criada.
log
    Defina para ``true`` para habilitar o log de query. Quando habilitado, queries
    serão registradas(logged) em um nível ``debug`` com o escopo `` queriesLog``.
quoteIdentifiers
    Defina para ``true`` se você estiver usando palavras reservadas os caracteres
    especiais nos nomes de suas tabelas ou colunas. Habilitando essa configuração,
    resultará em consultas criadas usando o :doc:`/orm/query-builder`com identificadores
    citados (quoted) ao criar SQL. Deve ser notado, que isso diminui o desempenho
    porque cada consulta precisa ser percorrida e manipulada antes de ser executada.
flags
    Um array associativo de constantes PDO que devem ser passada para a instância PDO
    subjacente. Consulte a documentação do PDO sobre as flags suportadas pelo driver
    que você está usando.
cacheMetadata
    Tanto um boolean ``true``, ou uma string contendo a configuração de cache para
    armazenar metaddos. Desativar o cache de metadados não é a aconselhado e pode
    resultar em desempenho muito frato. Consulte a seção :ref:`database-metadata-cache`
    para obter mais informações.

Neste ponto, pode desejar dar uma olhada no :doc:`/intro/conventions`.
A correta nomenclatura para suas tables (e a adição de algumas colunas) podem
garantir algumas funcionalidades gratuitas e ajudá-lo a evitar configuração.
Por exemplo, se você nomear sua tabela de banco de dados big\_boxes, sua
tabela BigBoxesTable e o seu controller BigBoxesController, tudo funcionará
em conjunto automaticamente. Por convenção, use sublinhados, minúsculas e 
plurais para os nomes de tabelas de banco de dados - por exemplo: bakers,
pastry\_stores, and savory\_cakes.

.. php:namespace:: Cake\Datasource

Gerenciando Conexões
====================

.. php:class:: ConnectionManager

A classe `ConnectionManager`` atua como um registro para acessar conexões de
banco de dados que seu aplicativo tem. Ele fornece um lugar onde outros objetos
podem obter referências às conexões existentes.

Acessando Conexões
------------------

.. php:staticmethod:: get($name)

Uma vez configurada, as conexões podem ser obtidas usando 
:php:meth:`Cake\\Datasource\\ConnectionManager::get()`. Este método irá construir
e carregar uma conexão se não tiver sido construído antes ou retornar a conexão
conhecida existente::

    use Cake\Datasource\ConnectionManager;

    $conn = ConnectionManager::get('default');

Ao tentar carregar conexões que não existem será lançado uma exceção.

Criando Conexões em Tempo de Execução
-------------------------------------

Usando ``config()`` e ``get()`` você pode criar novas conexões que não estão
definadas em seus arquivos de configuração em tempo de execução::

    ConnectionManager::config('my_connection', $config);
    $conn = ConnectionManager::get('my_connection');

Consulte a seção :ref:`database-configuration` para mais informações sobre os
dados de configuração usados ao criar conexões.

.. _database-data-types:

.. php:namespace:: Cake\Database

Tipos de Dados
==============

.. php:class:: Type

Como nem todos os fornecedores de banco de dados incluem o mesmo conjunto de tipos
de dados, ou os mesmos nomes para tipos de dados semelhantes, o CakePHP fornece um
conjunto de tipos de dados abstraídos para uso com a camada do banco de dados. Os
tipos suportados pelo CakePHP são:

string
    Geralmente usado para colunas dos tipos CHAR ou VARCHAR. Ao usar a opção ``fixed``
    forçará uma coluna CHAR. No SQL Server, os tipos NCHAR e NVARCHAR são usados.    
text
    Mapeia para tipos de TEXT.
uuid
    Mapeia para o tipo UUID se um banco de dados fornecer um, caso contrário, isso
    gerará um campo CHAR(36).
integer
    Mapeia para o tipo INTEGER fornecido pelo banco de dados. O BIT ainda não é
    suportado neste momento.
biginteger
    Mapeia para o tipo BIGINT fornecido pelo banco de dados.
float
    Mapeia para DOUBLE ou FLOAT, dependendo do banco de dados. A opção  ``precision``
    pode ser usada para definir a precisão utilizada.
decimal
    Mapeia para o tipo DECIMAL. Suporta as opções ``length`` e ``precision``.
boolean
    Mapeia para BOOLEAN, exceto no MySQL, onde TINYINT(1) é usado para representar
    booleans. BIT(1) ainda não é suportado neste momento.
binary
    Mapeia para os tipos BLOB ou BYTEA fornecido pelo banco de dados.
date
    Mapeia para o tipo de coluna DATE de fuso horario nativo. O valor de retorno
    desse tipo de coluna é :php:class:`Cake\\I18n\\Date` que estende a classe
    nativa ``DateTime``.
datetime
    Mapeia para o tipo de coluna DATETIME de fuso horario nativo. No PostgreSQL
    e no SQL Server, isso se transforma em um tipo TIMESTAMP. O valor de retorno
    padrão desse tipo de coluna é :php:class:`Cake\\I18n\\Date` que estende a classe
    nativa ``DateTime`` e `Chronos <https://github.com/cakephp/chronos>`_.
timestamp
    Mapeia para o tipo TIMESTAMP.
time
    Mapeia para um tipo TIME em todos bancos de dados.
json
    Mapeia para um tipo JSON se disponível, caso contrário mapeia para TEXT. 
    O tipo 'json' foi adicionado na versão 3.3.0

Esses tipos são usados tanto nos recursos de schema reflection que o CakePHP fornece,
quanto nos recursos de geração de schema que o CakePHP utiliza ao usar fixtures de testes.

Cada tipo também pode fornecer funções de tradução entre representações de PHP e SQL. 
Esses métodos são invocados com base nos type hints fornecidos ao fazer consultas. 
Por exemplo, uma coluna marcada como 'datetime' automaticamente converterá os parâmetros
de entrada das instâncias ``DateTime`` em timestamp ou string de data formatada. Da mesma
forma, as colunas 'binary' aceitarão manipuladores de arquivos e gerarão manipuladores de
arquivos ao ler dados.

.. _adding-custom-database-types:

Adicionando Tipos Personalizados
--------------------------------

.. php:staticmethod:: map($name, $class)

Se você precisar usar tipos específicos do fornecedor que não estão incorporados no CakePHP,
você pode adicionar novos tipos adicionais ao sistema de tipos do CakePHP. As classes de tipos
devem implementar os seguintes métodos:

* ``toPHP``: Converte valor vindo do banco de dados em um tipo equivalente do PHP.
* ``toDatabase``: Converte valor vindo do PHP em um tipo aceitável por um banco de dados.
* ``toStatement``: Converte valor para seu equivalente Statement.
* ``marshal``: Converte dados simples em objetos PHP.

Uma maneira fácil de atender a interface básica é estender
:php:class:`Cake\\Database\\Type`. Por exemplo, se quiséssemos adicionar um tipo JSON, 
poderíamos fazer a seguinte classe de tipo::

    // in src/Database/Type/JsonType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type;
    use PDO;

    class JsonType extends Type
    {

        public function toPHP($value, Driver $driver)
        {
            if ($value === null) {
                return null;
            }
            return json_decode($value, true);
        }

        public function marshal($value)
        {
            if (is_array($value) || $value === null) {
                return $value;
            }
            return json_decode($value, true);
        }

        public function toDatabase($value, Driver $driver)
        {
            return json_encode($value);
        }

        public function toStatement($value, Driver $driver)
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }
            return PDO::PARAM_STR;
        }

    }

Por padrão, o método ``toStatement()`` tratará os valores como strings que
funcionarão para o nosso novo tipo. Uma vez que criamos nosso novo tipo, nós
precisamos adicioná-lo ao mapeamento de tipo. Durante o bootstrap do nosso
aplicativo, devemos fazer o seguinte::

    use Cake\Database\Type;

    Type::map('json', 'App\Database\Type\JsonType');

.. versionadded:: 3.3.0
    A classe JsonType descrita neste exemplo foi adicionada ao core.

Nós podemos então sobrecarregar os dados de schema refletido para usar nosso novo tipo, e
a camada de banco de dados do CakePHP converterá automaticamente nossos dados JSON ao
criar consultas. Você pode usar os tipos personalizados que você criou mapeando os tipos
no seu método :ref:`_initializeSchema() <saving-complex-types>` da Tabela::

    use Cake\Database\Schema\TableSchema;

    class WidgetsTable extends Table
    {

        protected function _initializeSchema(TableSchema $schema)
        {
            $schema->columnType('widget_prefs', 'json');
            return $schema;
        }

    }

.. _mapping-custom-datatypes-to-sql-expressions:

Mapeando Tipos de Dados Personalizados para Expressões SQL
----------------------------------------------------------

.. versionadded:: 3.3.0
   O suporte de mapeamento de tipos de dados personalizados para expressões SQL
   foi adicionado na versão 3.3.0.

O exemplo anterior mapeia um tipo de dados personalizado para um tipo de coluna
'json' que é facilmente representado como uma string em uma instrução SQL. Os
tipos complexos de dados SQL não podem ser representados como strings/integers
em consultas SQL. Ao trabalhar com esses tipos de dados, sua classe Type precisa
implementar a interface ``Cake\Database\Type\ExpressionTypeInterface``. Essa
interface permite que seu tipo personalizado represente um valor como uma
expressão SQL. Como exemplo, nós vamos construir uma simples classe Type para
manipular dados do tipo ``POINT`` do MySQL. Primeiramente, vamos definir um
objeto 'value' que podemos usar para representar dados ``POINT`` no PHP::

    // in src/Database/Point.php
    namespace App\Database;

    // Our value object is immutable.
    class Point
    {
        protected $_lat;
        protected $_long;

        // Factory method.
        public static function parse($value)
        {
            // Parse the data from MySQL.
            return new static($value[0], $value[1]);
        }

        public function __construct($lat, $long)
        {
            $this->_lat = $lat;
            $this->_long = $long;
        }

        public function lat()
        {
            return $this->_lat;
        }

        public function long()
        {
            return $this->_long;
        }
    }

Com o nosso objeto de valor criado, nós vamos precisar de uma classe Type para
mapear dados nesse objeto de valor e em expressões SQL::

    namespace App\Database\Type;

    use App\Database\Point;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\Type as BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, Driver $d)
        {
            return Point::parse($value);
        }

        public function marshal($value)
        {
            if (is_string($value)) {
                $value = explode(',', $value);
            }
            if (is_array($value)) {
                return new Point($value[0], $value[1]);
            }
            return null;
        }

        public function toExpression($value)
        {
            if ($value instanceof Point) {
                return new FunctionExpression(
                    'POINT',
                    [
                        $value->lat(),
                        $value->long()
                    ]
                );
            }
            if (is_array($value)) {
                return new FunctionExpression('POINT', [$value[0], $value[1]]);
            }
            // Handle other cases.
        }
    }

A classe acima faz algumas coisas interessantes:

* O método ``toPHP`` lida com o parse de resultados de consulta SQL em um objeto de valor.
* O método ``marshal`` lida com a conversão, de dados como dados de requisição, em nosso
  objeto de valor.
  Nós vamos aceitar valores string como ``'10.24,12.34`` e array por enquanto.
* O método ``toExpression`` lida com a conversão do nosso objeto de valor para
  as expressões SQL equivalentes. No nosso exemplo, o SQL resultante seria algo como
  ``POINT(10.24, 12.34)``.

Uma vez que criamos nosso tipo personalizado, precisaremos :ref:`connectar nosso tipo
personalizado à nossa classe table <saving-complex-types>`.

.. _immutable-datetime-mapping:

Enabling Immutable DateTime Objects
-----------------------------------

.. versionadded:: 3.2
    Immutable date/time objects were added in 3.2.

Because Date/Time objects are easily mutated in place, CakePHP allows you to
enable immutable value objects. This is best done in your application's
**config/bootstrap.php** file::

    Type::build('datetime')->useImmutable();
    Type::build('date')->useImmutable();
    Type::build('time')->useImmutable();
    Type::build('timestamp')->useImmutable();

.. note::
    New applications will have immutable objects enabled by default.

Connection Classes
==================

.. php:class:: Connection

Connection classes provide a simple interface to interact with database
connections in a consistent way. They are intended as a more abstract interface to
the driver layer and provide features for executing queries, logging queries, and doing
transactional operations.

.. _database-queries:

Executing Queries
-----------------

.. php:method:: query($sql)

Once you've gotten a connection object, you'll probably want to issue some
queries with it. CakePHP's database abstraction layer provides wrapper features
on top of PDO and native drivers. These wrappers provide a similar interface to
PDO. There are a few different ways you can run queries depending on the type of
query you need to run and what kind of results you need back. The most basic
method is ``query()`` which allows you to run already completed SQL queries::

    $stmt = $conn->query('UPDATE articles SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

The ``query()`` method does not allow for additional parameters. If you need
additional parameters you should use the ``execute()`` method, which allows for
placeholders to be used::

    $stmt = $conn->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Without any type hinting information, ``execute`` will assume all placeholders
are string values. If you need to bind specific types of data, you can use their
abstract type names when creating a query::

    $stmt = $conn->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

This allows you to use rich data types in your applications and properly convert
them into SQL statements. The last and most flexible way of creating queries is
to use the :doc:`/orm/query-builder`. This approach allows you to build complex and
expressive queries without having to use platform specific SQL::

    $query = $conn->newQuery();
    $query->update('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

When using the query builder, no SQL will be sent to the database server until
the ``execute()`` method is called, or the query is iterated. Iterating a query
will first execute it and then start iterating over the result set::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Do something with the row.
    }

.. note::

    When you have an instance of :php:class:`Cake\\ORM\\Query` you can use
    ``all()`` to get the result set for SELECT queries.

Using Transactions
------------------

The connection objects provide you a few simple ways you do database
transactions. The most basic way of doing transactions is through the ``begin()``,
``commit()`` and ``rollback()`` methods, which map to their SQL equivalents::

    $conn->begin();
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

In addition to this interface connection instances also provide the
``transactional()`` method which makes handling the begin/commit/rollback calls
much simpler::

    $conn->transactional(function ($conn) {
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    });

In addition to basic queries, you can execute more complex queries using either
the :doc:`/orm/query-builder` or :doc:`/orm/table-objects`. The transactional method will
do the following:

- Call ``begin``.
- Call the provided closure.
- If the closure raises an exception, a rollback will be issued. The original
  exception will be re-thrown.
- If the closure returns ``false``, a rollback will be issued.
- If the closure executes successfully, the transaction will be committed.

Interacting with Statements
===========================

When using the lower level database API, you will often encounter statement
objects. These objects allow you to manipulate the underlying prepared statement
from the driver. After creating and executing a query object, or using
``execute()`` you will have a ``StatementDecorator`` instance. It wraps the
underlying basic statement object and provides a few additional features.

Preparing a Statement
---------------------

You can create a statement object using ``execute()``, or ``prepare()``. The
``execute()`` method returns a statement with the provided values bound to it.
While ``prepare()`` returns an incomplete statement::

    // Statements from execute will have values bound to them already.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Statements from prepare will be parameters for placeholders.
    // You need to bind parameters before attempting to execute it.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Once you've prepared a statement you can bind additional data and execute it.

.. _database-basics-binding-values:

Binding Values
--------------

Once you've created a prepared statement, you may need to bind additional data.
You can bind multiple values at once using the ``bind()`` method, or bind
individual elements using ``bindValue``::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Bind multiple values
    $stmt->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Bind a single value
    $stmt->bindValue(1, true, 'boolean');
    $stmt->bindValue(2, new DateTime('2013-01-01'), 'date');

When creating statements you can also use named array keys instead of
positional ones::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Bind multiple values
    $stmt->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Bind a single value
    $stmt->bindValue('published', true, 'boolean');
    $stmt->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::

    You cannot mix positional and named array keys in the same statement.

Executing & Fetching Rows
-------------------------

After preparing a statement and binding data to it, you can execute it and fetch
rows. Statements should be executed using the ``execute()`` method. Once
executed, results can be fetched using ``fetch()``, ``fetchAll()`` or iterating
the statement::

    $stmt->execute();

    // Read one row.
    $row = $stmt->fetch('assoc');

    // Read all rows.
    $rows = $stmt->fetchAll('assoc');

    // Read rows through iteration.
    foreach ($rows as $row) {
        // Do work
    }

.. note::

    Reading rows through iteration will fetch rows in 'both' mode. This means
    you will get both the numerically indexed and associatively indexed results.


Getting Row Counts
------------------

After executing a statement, you can fetch the number of affected rows::

    $rowCount = count($stmt);
    $rowCount = $stmt->rowCount();


Checking Error Codes
--------------------

If your query was not successful, you can get related error information
using the ``errorCode()`` and ``errorInfo()`` methods. These methods work the
same way as the ones provided by PDO::

    $code = $stmt->errorCode();
    $info = $stmt->errorInfo();

.. todo::
    Possibly document CallbackStatement and BufferedStatement

.. _database-query-logging:

Query Logging
=============

Query logging can be enabled when configuring your connection by setting the
``log`` option to ``true``. You can also toggle query logging at runtime, using
``logQueries``::

    // Turn query logging on.
    $conn->logQueries(true);

    // Turn query logging off
    $conn->logQueries(false);

When query logging is enabled, queries will be logged to
:php:class:`Cake\\Log\\Log` using the 'debug' level, and the 'queriesLog' scope.
You will need to have a logger configured to capture this level & scope. Logging
to ``stderr`` can be useful when working on unit tests, and logging to
files/syslog can be useful when working with web requests::

    use Cake\Log\Log;

    // Console logging
    Log::config('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // File logging
    Log::config('queries', [
        'className' => 'File',
        'path' => LOGS,
        'file' => 'queries.log',
        'scopes' => ['queriesLog']
    ]);

.. note::

    Query logging is only intended for debugging/development uses. You should
    never leave query logging on in production as it will negatively impact the
    performance of your application.

.. _identifier-quoting:

Identifier Quoting
==================

By default CakePHP does **not** quote identifiers in generated SQL queries. The
reason for this is identifier quoting has a few drawbacks:

* Performance overhead - Quoting identifiers is much slower and complex than not doing it.
* Not necessary in most cases - In non-legacy databases that follow CakePHP's
  conventions there is no reason to quote identifiers.

If you are using a legacy schema that requires identifier quoting you can enable
it using the ``quoteIdentifiers`` setting in your
:ref:`database-configuration`. You can also enable this feature at runtime::

    $conn->driver()->autoQuoting(true);

When enabled, identifier quoting will cause additional query traversal that
converts all identifiers into ``IdentifierExpression`` objects.

.. note::

    SQL snippets contained in QueryExpression objects will not be modified.

.. _database-metadata-cache:

Metadata Caching
================

CakePHP's ORM uses database reflection to determine the schema, indexes and
foreign keys your application contains. Because this metadata changes
infrequently and can be expensive to access, it is typically cached. By default,
metadata is stored in the ``_cake_model_`` cache configuration. You can define
a custom cache configuration using the ``cacheMetatdata`` option in your
datasource configuration::

    'Datasources' => [
        'default' => [
            // Other keys go here.

            // Use the 'orm_metadata' cache config for metadata.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

You can also configure the metadata caching at runtime with the
``cacheMetadata()`` method::

    // Disable the cache
    $connection->cacheMetadata(false);

    // Enable the cache
    $connection->cacheMetadata(true);

    // Use a custom cache config
    $connection->cacheMetadata('orm_metadata');

CakePHP also includes a CLI tool for managing metadata caches. See the
:doc:`/console-and-shells/orm-cache` chapter for more information.

Creating Databases
==================

If you want to create a connection without selecting a database you can omit
the database name::

    $dsn = 'mysql://root:password@localhost/';

You can now use your connection object to execute queries that create/modify
databases. For example to create a database::

    $connection->query("CREATE DATABASE IF NOT EXISTS my_database");

.. note::

    When creating a database it is a good idea to set the character set and
    collation parameters. If these values are missing, the database will set
    whatever system default values it uses.

.. meta::
    :title lang=en: Database Basics
    :keywords lang=en: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,database,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,caching
