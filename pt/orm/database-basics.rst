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

A maneira mais fácil de criar uma conexão de banco de dados é usando uma string 
``DSN``::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::config('default', ['url' => $dsn]);

Uma vez criada, você pode acessar o objeto da conexão para iniciar a usá-lo::

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
`Driver para Banco de Dados Oracle <https://github.com/CakeDC/cakephp-oracle-driver>`_.

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

Executando . de Atualização
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
    Se deve ou não usar uma conexão persistente com o banco de dados. Esta opção não
    é suportada pelo SqlServer. A partir da versão 3.4.13 do CakePHP, uma exceção é
    lançada se você tentar definir persistent como ``true`` com SqlServer.
host
    O nome de host do servidor de banco de dados (ou o endereço IP).
username
    O nome de usuário da conta.
password
    A senha da conta.
database
    O nome do banco de dados para essa conexão usar. Evite usar ``.`` no nome
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
    O caminho do arquivo de autoridade de certificação SSL. (Somente suportado pelo MySQL).
init
    Uma lista de queries que devem ser enviadas para o servidor de banco de dados 
    como quando a conexão é criada.
log
    Defina para ``true`` para habilitar o log de query. Quando habilitado, queries
    serão registradas(logged) em um nível ``debug`` com o escopo `` queriesLog``.
quoteIdentifiers
    Defina para ``true`` se você estiver usando palavras reservadas os caracteres
    especiais nos nomes de suas tabelas ou colunas. Habilitando essa configuração,
    resultará em consultas criadas usando o :doc:`/orm/query-builder` com identificadores
    citados (quoted) ao criar SQL. Deve ser notado, que isso diminui o desempenho
    porque cada consulta precisa ser percorrida e manipulada antes de ser executada.
flags
    Um array associativo de constantes PDO que devem ser passada para a instância PDO
    subjacente. Consulte a documentação do PDO sobre as flags suportadas pelo driver
    que você está usando.
cacheMetadata
    Tanto um boolean ``true``, ou uma string contendo a configuração de cache para
    armazenar metadados. Desativar o cache de metadados não é a aconselhado e pode
    resultar em desempenho muito fraco. Consulte a seção :ref:`database-metadata-cache`
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

Se você precisa usar tipos específicos do fornecedor que não estão incorporados no CakePHP,
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
* O método ``marshal`` lida com a conversão, de dados como os dados de requisição, em nosso
  objeto de valor.
  Nós vamos aceitar valores string como ``'10.24,12.34`` e array por enquanto.
* O método ``toExpression`` lida com a conversão do nosso objeto de valor para
  as expressões SQL equivalentes. No nosso exemplo, o SQL resultante seria algo como
  ``POINT(10.24, 12.34)``.

Uma vez que criamos nosso tipo personalizado, precisaremos :ref:`connectar nosso tipo
personalizado à nossa classe table <saving-complex-types>`.

.. _immutable-datetime-mapping:

Habilitando Objetos DataTime Imutáveis
--------------------------------------

.. versionadded:: 3.2
    Immutable date/time objetos foram adicionados na versão 3.2.

Como objetos Date/Time são facilmente modificados, o CakePHP permite você habilitar
objetos de valores imutáveis. Isso é melhor feito no arquivo
**config/bootstrap.php** da sua aplicação::

    Type::build('datetime')->useImmutable();
    Type::build('date')->useImmutable();
    Type::build('time')->useImmutable();
    Type::build('timestamp')->useImmutable();

.. note::
    Novas aplicações terão objetos imutáveis habilitado por padrão.

Classes de Conexão
==================

.. php:class:: Connection

As classes de conexão fornecem uma interface simples para interagir
com conexões de banco de dados de modo consistente. Elas servem como
uma interface mais abstrata para a camada do driver e fornece recursos
para executar consultas, logar (<em>logging</em>) consultas e realizar
operações transacionais.

.. _database-queries:

Executando Consultas
--------------------

.. php:method:: query($sql)

Uma vez que você obteve um objeto de conexão, você provavelmente quererá
executar algumas consultas com ele. A camada de abstração de banco de dados
do CakePHP fornece recursos de wrapper em cima do PDO e drivers nativos.
Esses wrappers fornecem uma interface similar ao PDO. Há algumas formas
diferentes de executar consultas, dependendo do tipo de consulta que você
precisa executar e do tipo de resultados que você precisa receber. O método
mais básico é o ``query()`` que lhe permite executar consultas SQL já prontas::

    $stmt = $conn->query('UPDATE articles SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

O método ``query()`` não aceita parâmetros adicionais. Se você precisa de 
parâmetros adicionais, você deve usar o método ``execute()``, que permite que
placeholders sejam usados::

    $stmt = $conn->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Sem qualquer informação de indução de tipo, ``execute`` assumirá que todos os
placeholders são valores do tipo string. Se você precisa vincular tipos específicos
de dados, você pode usar seus nomes de tipos abstratos ao criar uma consulta::

    $stmt = $conn->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

Isso permite que você use tipos de dados ricos em suas aplicações e convertê-los
adequadamente em instruções SQL. A última e mais flexível maneira de criar consultas
é usar o :doc:`/orm/query-builder`. Essa abordagem lhe permite criar consultas
complexas e expressivas sem ter que usar SQL específico de plataforma::

    $query = $conn->newQuery();
    $query->update('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

Ao usar o construtor de consulta (<em>query builder</em>), nenhum SQL será enviado
para o servidor do banco de dados até que o método ``execute()`` é chamado ou a
consulta seja iterada. Iterar uma consulta irá primeiro executá-la e então começar a
iterar sobre o conjunto de resultados::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Faz alguma coisa com a linha.
    }

.. note::
    Quando você tem uma instância de :php:class:`Cake\\ORM\\Query` você pode
    usar o método ``all()`` para obter o conjunto de resultados de consultas SELECT.

Usando Transações
-----------------
Os objetos de conexão lhe fornecem algumas maneiras simples de realizar transações
de banco de dados. A maneira mais básica de fazer transações é através dos métodos
``begin()``, ``commit()`` e ``rollback()``, que mapeiam para seus equivalentes em SQL::

    $conn->begin();
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

Além disso, essas instâncias de interface de conexão também fornecem o método 
``transactional()`` que torna o tratamento das chamadas begin/commit/rollback muito mais simples::

    $conn->transactional(function ($conn) {
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    });

Além de consultas básicas, você pode executar consultas mais complexas usando 
:doc:`/orm/query-builder` ou :doc:`/orm/table-objects`. O método transactional vai fazer o seguinte:

- Chamar método ``begin``.
- Chamar a closure fornecida.
- Se a closure lançar uma exceção, um rollback será emitido. A exceção original será re-lançada.
- Se a closure retornar ``false``, um rollback será emitido.
- Se a closure for executada com sucesso, a transação será cometida (<em>committed</em>).


Interagindo com Instruções
==========================

Ao usar a API do banco de dados de baixo nível, você muitas vezes encontrará objetos de instrução.
Esses objetos lhe permitem manipular a instrução preparada subjacente do driver. Depois de criar e
executar um objeto de consulta, ou usando ``execute()`` você terá uma instância ``StatementDecorator``.
Isso envolve o objeto de instrução básico subjacente e fornece alguns recursos adicionais.

Preparando um Instrução
-----------------------

Você pode criar um objeto de instrução usando ``execute()`` ou ``prepare()```. O método ``execute()``
retorna uma instrução com os valores fornecidos ligados a ela. Enquanto que o ``prepare()`` retorna
uma instrução incompleta::

    // Instruções do ``execute`` terão valores já vinculados a eles.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Instruções do ``prepare``serão parâmetros para placeholders.
    // Você precisa vincular os parâmetros antes de executar.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Uma vez que você preparou uma instrução, você pode vincular dados adicionais e executá-lo.

.. _database-basics-binding-values:

Binding Values
--------------

Uma vez que você criou uma instrução preparada, você talvez precise vincular dados adicionais.
Você pode vincular vários valores ao mesmo tempo usando o método ``bind()``, ou vincular elementos
individuais usando ``bindValue``::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Vincular vários valores
    $stmt->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Vincular único valor
    $stmt->bindValue(1, true, 'boolean');
    $stmt->bindValue(2, new DateTime('2013-01-01'), 'date');

Ao criar instruções, você também pode usar chave de array nomeadas em vez de posicionais::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Vincular vários valores
    $stmt->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Vincular um valor único
    $stmt->bindValue('published', true, 'boolean');
    $stmt->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::
    
    Você não pode misturar posicionais e chave de array nomeadas na mesma instrução.

Executando & Obtendo Linhas
---------------------------

Depois de preparar uma instrução e vincular dados a ela, você pode executá-la e obter
linhas. As instruções devem ser executadas usando o método ``execute()``. Uma vez
executado, os resultados podem ser obtidos usando ``fetch()``, ``fetchAll()`` ou iterando 
a instrução::

    $stmt->execute();

    // Lê uma linha.
    $row = $stmt->fetch('assoc');

    // Lê todas as linhas.
    $rows = $stmt->fetchAll('assoc');

    // Lê linhas através de iteração.
    foreach ($rows as $row) {
        // Do work
    }

.. note::
    
    Lendo linhas através de iteração irá obter linhas no modo 'both'. Isso significa que você
    obterá os resultados indexados numericamente e indexados associativamente.

Obtendo Contagens de Linha
--------------------------

Depois de executar uma declaração, você pode buscar o número de linhas afetadas::

    $rowCount = count($stmt);
    $rowCount = $stmt->rowCount();


Verificando Códigos de Erro
---------------------------

Se a sua consulta não foi bem sucedida, você pode obter informações de erro relacionadas
usando os métodos ``errorCode()`` e ``errorInfo()``. Estes métodos funcionam da mesma 
maneira que os fornecidos pelo PDO::

    $code = $stmt->errorCode();
    $info = $stmt->errorInfo();

.. todo::
    Possibly document CallbackStatement and BufferedStatement

.. _database-query-logging:

Log de Consultas
================

O log de consultas pode ser habilitado ao configurar sua conexão definindo a opção ``log``
com o valor ``true``. Você também pode alternar o log de consulta em tempo de execução,
usando o método ``logQueries``::

    // Habilita log de consultas.
    $conn->logQueries(true);

    // Desabilita o log de consultas.
    $conn->logQueries(false);

Quando o log de consultas está habilitado, as consultas serão logadas em
:php:class:`Cake\\Log\\Log` usando o nível 'debug', e o escopo 'queriesLog'.
Você precisará ter um logger configurado para capturar esse nível e escopo. 
Logar no ``stderr`` pode ser útil quando se estiver trabalhando com testes
de unidade e logar em arquivos/syslog pode ser útil ao trabalhar com
requisições web::

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
    
    Log de consultas destina-se apenas para usos de depuração/desenvolvimento. 
    Você nunca deve habilitar o log de consultas em ambiente de produção, pois isso
    afetará negativamente o desempenho de sua aplicação.

.. _identifier-quoting:

Identifier Quoting
==================

Por padrão, o CakePHP **não** cita (<em>quote<em>) identificadores em consultas
SQL geradas. A razão disso é que a citação de identificadores tem algumas desvantagens:

* Sobrecarga de desempenho - Citar identificadores é muito mais lentos e complexos 
  do que não fazê-lo.
* Não é necessário na maioria dos casos - Em bancos de dados não legados que seguem as
  convenções do CakePHP não há motivo para citar identificadores.

Se você estiver usando um schema legado que requer citação de identificador, você pode 
habilitar isso usando a configuração ``quoteIdentifiers``` em seu 
:ref:`database-configuration`. Você também pode habilitar esse recurso em tempo de execução::

    $conn->driver()->autoQuoting(true);

Quando habilitado, a citação de identificador causará uma <em>traversal query</em> adicional
que converte todos os identificadores em objetos ``IdentifierExpression``.

.. note::
    
    Os fragmentos de SQL contidos em objetos QueryExpression não serão modificados.

.. _database-metadata-cache:

Metadata Caching
================

O ORM do CakePHP usa reflexão de banco de dados para determinar a schema, índices e
chaves estrangeiras que sua aplicação contém. Como esse metadado é alterado
com pouca frequência e pode ser caro de acessar, ele geralmente é armazenado em cache.
Por padrão, os metadados são armazenados na configuração de cache ``_cake_model_``. 
Você pode definir uma configuração de cache personalizada usando a opção ``cacheMetadata``
na sua configuração de <em>datasource</em>::

    'Datasources' => [
        'default' => [
            // Other keys go here.

            // Use the 'orm_metadata' cache config for metadata.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

Você também pode configurar o cache de metadados em tempo de execução
com o método ``cacheMetadata()``::

    // Desabilitar o cache
    $connection->cacheMetadata(false);

    // Habilitar tohe cache
    $connection->cacheMetadata(true);

    // Utilizar uma configuração de cache personalizada
    $connection->cacheMetadata('orm_metadata');

O CakePHP também inclui uma ferramenta CLI para gerenciar caches de metadados. 
Confira o capítulo :doc:`/console-and-shells/orm-cache` para obter mais informações.

Criando Banco de Dados
======================

Se você quer criar uma conexão sem selecionar um banco de dados, você pode omitir o
nome do banco de dados::

    $dsn = 'mysql://root:password@localhost/';

Agora você pode usar seu objeto de conexão para executar consultas que cria/modifica
bancos de dados. Por exemplo, para criar um banco de dados::

    $connection->query("CREATE DATABASE IF NOT EXISTS my_database");

.. note::
    
    Ao criar um banco de dados, é uma boa idéia definir o conjunto de caracteres e os 
    parâmetros de collation. Se esses valores estiverem faltando, o banco de dados 
    definirá quaisquer valores padrão de sistema que ele use.

.. meta::
    :title lang=en: Database Basics
    :keywords lang=en: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,database,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,caching
