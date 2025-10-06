O básico sobre banco de dados
#############################

A camada de acesso a banco de dados do CakePHP abstrai e fornece auxilio com
a maioria dos aspectos de lidar com bancos de dados relacionais como, manter
conexões com o servidor, construir consultas, prevenir injeções SQL, inspecionar
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
    ConnectionManager::setConfig('default', ['url' => $dsn]);

Uma vez criada, você pode acessar o objeto da conexão para iniciar a usá-lo::

    $connection = ConnectionManager::get('default');

.. note::
    Para bancos de dados suportados, veja :doc:`notas de instalação </installation>`.

.. _running-select-statements:

Executando Instruções de Consulta
----------------------------------

Executar consultas SQL brutas é muito fácil::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

Você pode usar prepared statements para inserir parâmetros::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

Também é possível usar tipos de dados complexos como argumentos::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
    $results = $connection
        ->execute(
            'SELECT * FROM articles WHERE created >= :created',
            ['created' => new DateTime('1 day ago')],
            ['created' => 'datetime']
        )
        ->fetchAll('assoc');

Ao invés de escrever a SQL manualmente, você pode usar o query builder::

    // Antes da 4.5 use $connection->query()
    $results = $connection
        ->selectQuery('*', 'articles')
        ->where(['created >' => new DateTime('1 day ago')], ['created' => 'datetime'])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Executando Instruções de Inserção
----------------------------------

Inserir registros no banco de dados é geralmente uma questão de algumas linhas::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Executando Instruções de Atualização
-------------------------------------

Atualizar registros no banco de dados é igualmente intuitivo, o exemplo a seguir
atualizará o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);

Executando Instruções de Exclusão
----------------------------------

Da mesma forma, o método ``delete()`` é usado para excluir registros do banco de
dados, o exemplo a seguir exclui o artigo com **id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->delete('articles', ['id' => 10]);

.. _database-configuration:

Configuração
============

Por convenção, as conexões do banco de dados são configuradas em **config/app.php**. As
informações de conexão definidas neste arquivo são alimentadas em
:php:class:`Cake\\Datasource\\ConnectionManager` criando a configuração de conexão que
sua aplicação usará. Exemplos de informações de conexão podem ser encontradas em
**config/app.default.php**. Uma configuração de exemplo seria mais ou menos assim::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'secret',
            'database' => 'my_app',
            'encoding' => 'utf8mb4',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ],
    ],

O exemplo acima criará a conexão 'default', com os parâmetros fornecidos. Você pode
definir quantas conexões quiser no seu arquivo de configuração. Você também pode
definir conexões adicionais em tempo de execução usando
:php:meth:`Cake\\Datasource\\ConnectionManager::setConfig()`. Um exemplo disso seria::

    use Cake\Datasource\ConnectionManager;

    ConnectionManager::setConfig('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'secret',
        'database' => 'my_app',
        'encoding' => 'utf8mb4',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);

As opções de configuração também podem ser fornecidas como uma string :term:`DSN`.
Isso é útil ao trabalhar com variáveis de ambiente ou provedores :term:`PaaS`::

    ConnectionManager::setConfig('default', [
        'url' => 'mysql://my_app:sekret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

Ao usar uma string DSN, você pode definir quaisquer parâmetros/opções adicionais como
argumentos de query string.

Por padrão, todos objetos Table usarão a conexão ``default``. Para usar
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
    usando :term:`sintaxe de plugin`, um nome de classe com seu namespace completo ou uma
    instância de driver construída.
    Exemplos de nomes de classes curtos são Mysql, Sqlite, Postgres e Sqlserver.
persistent
    Se deve ou não usar uma conexão persistente com o banco de dados. Esta opção não
    é suportada pelo SqlServer. Uma exceção é lançada se você tentar definir
    ``persistent`` como ``true`` com SqlServer.
host
    O nome de host do servidor de banco de dados (ou o endereço IP).
username
    O nome de usuário da conta.
password
    A senha da conta.
database
    O nome do banco de dados para essa conexão usar. Evite usar ``.`` no nome
    do seu banco de dados. Por causa de como isso complica a citação de identificadores, o CakePHP
    não suporta ``.`` em nomes de banco de dados. O caminho para o seu banco de dados SQLite
    deve ser um caminho absoluto (por exemplo, ``ROOT . DS . 'my_app.db'``) para evitar
    caminhos incorretos causados por caminhos relativos.
port (*opcional*)
    A porta TCP ou o soquete Unix usado para se conectar ao servidor.
encoding
    Indica o conjunto de caracteres a ser usado ao enviar instruções SQL para
    o servidor. O padrão é a codificação padrão do banco de dados para
    todos os bancos de dados exceto o DB2.
timezone
    Fuso horário do servidor para definir.
schema
    Usado em configurações de banco de dados do PostgreSQL para especificar qual schema usar.
unix_socket
    Usado por drivers que o suportam para se conectar via arquivos de soquete Unix.
    Se você estiver usando o PostgreSQL e quiser usar soquetes Unix, deixe a chave
    host em branco.
ssl_key
    O caminho para o arquivo de chave SSL. (Somente suportado pelo MySQL).
ssl_cert
    O caminho para o arquivo de certificado SSL. (Somente suportado pelo MySQL).
ssl_ca
    O caminho para o arquivo de autoridade de certificação SSL. (Somente suportado pelo MySQL).
init
    Uma lista de queries que devem ser enviadas para o servidor de banco de dados
    quando a conexão é criada.
log
    Defina como ``true`` para habilitar o log de query. Quando habilitado, queries serão registradas
    em um nível ``debug`` com o escopo ``queriesLog``.
quoteIdentifiers
    Defina como ``true`` se você estiver usando palavras reservadas ou caracteres
    especiais nos nomes de suas tabelas ou colunas. Habilitar essa configuração
    resultará em consultas criadas usando o :doc:`/orm/query-builder` com identificadores
    citados ao criar SQL. Deve ser notado que isso diminui o desempenho
    porque cada consulta precisa ser percorrida e manipulada antes de ser executada.
flags
    Um array associativo de constantes PDO que devem ser passadas para a
    instância PDO subjacente. Consulte a documentação do PDO sobre as flags suportadas
    pelo driver que você está usando.
cacheMetadata
    Tanto um boolean ``true``, ou uma string contendo a configuração de cache para
    armazenar metadados. Desativar o cache de metadados definindo-o como ``false``
    não é aconselhado e pode resultar em desempenho muito fraco. Consulte a seção
    :ref:`database-metadata-cache` para obter mais informações.
mask
    Defina as permissões no arquivo de banco de dados gerado. (Somente suportado pelo SQLite)
cache
    A flag ``cache`` para enviar ao SQLite.
mode
    O valor da flag ``mode`` para enviar ao SQLite.


Neste ponto, pode desejar dar uma olhada no :doc:`/intro/conventions`.
A correta nomenclatura para suas tables (e a adição de algumas colunas) podem
garantir algumas funcionalidades gratuitas e ajudá-lo a evitar configuração.
Por exemplo, se você nomear sua tabela de banco de dados big\_boxes, sua
table BigBoxesTable e o seu controller BigBoxesController, tudo funcionará
em conjunto automaticamente. Por convenção, use sublinhados, minúsculas e
plurais para os nomes de tabelas de banco de dados - por exemplo: bakers,
pastry\_stores e savory\_cakes.

.. note::

    Se o seu servidor MySQL estiver configurado com ``skip-character-set-client-handshake``
    então você DEVE usar a configuração ``flags`` para definir sua codificação de charset. Por exemplo::

        'flags' => [\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8']

.. _read-and-write-connections:

Conexões de Leitura e Escrita
==============================

As conexões podem ter funções de leitura e escrita separadas. As funções de leitura
são esperadas para representar réplicas somente leitura e as funções de escrita são esperadas
para serem a conexão padrão e suportarem operações de escrita.

As funções de leitura são configuradas fornecendo uma chave ``read`` na configuração de conexão.
As funções de escrita são configuradas fornecendo uma chave ``write``.

As configurações de função substituem os valores na configuração de conexão compartilhada. Se as configurações
de função de leitura e escrita forem as mesmas, uma única conexão ao banco de dados é usada
para ambas::

    'default' => [
        'driver' => 'mysql',
        'username' => '...',
        'password' => '...',
        'database' => '...',
        'read' => [
            'host' => 'read-db.example.com',
        ],
        'write' => [
            'host' => 'write-db.example.com',
        ]
    ];

Você pode especificar o mesmo valor para ambas as chaves ``read`` e ``write`` sem criar
múltiplas conexões ao banco de dados.

.. php:namespace:: Cake\Datasource

Gerenciando Conexões
=====================

.. php:class:: ConnectionManager

A classe `ConnectionManager`` atua como um registro para acessar conexões de
banco de dados que sua aplicação tem. Ela fornece um lugar onde outros objetos
podem obter referências às conexões existentes.

Acessando Conexões
-------------------

.. php:staticmethod:: get($name)

Uma vez configuradas, as conexões podem ser obtidas usando
:php:meth:`Cake\\Datasource\\ConnectionManager::get()`. Este método irá construir
e carregar uma conexão se não tiver sido construída antes ou retornar a conexão
conhecida existente::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');

Ao tentar carregar conexões que não existem, será lançada uma exceção.

Criando Conexões em Tempo de Execução
--------------------------------------

Usando ``setConfig()`` e ``get()`` você pode criar novas conexões que não estão
definidas em seus arquivos de configuração em tempo de execução::

    ConnectionManager::setConfig('my_connection', $config);
    $connection = ConnectionManager::get('my_connection');

Consulte a seção :ref:`database-configuration` para mais informações sobre os
dados de configuração usados ao criar conexões.

.. _database-data-types:

.. php:namespace:: Cake\Database

Tipos de Dados
==============

.. php:class:: TypeFactory

Como nem todos os fornecedores de banco de dados incluem o mesmo conjunto de tipos
de dados, ou os mesmos nomes para tipos de dados semelhantes, o CakePHP fornece um
conjunto de tipos de dados abstraídos para uso com a camada do banco de dados. Os
tipos suportados pelo CakePHP são:

string
    Mapeia para tipos ``VARCHAR``. No SQL Server os tipos ``NVARCHAR`` são usados.
char
    Mapeia para tipos ``CHAR``. No SQL Server o tipo ``NCHAR`` é usado.
text
    Mapeia para tipos de ``TEXT``.
uuid
    Mapeia para o tipo UUID se um banco de dados fornecer um, caso contrário, isso
    gerará um campo ``CHAR(36)``.
binaryuuid
    Mapeia para o tipo UUID se o banco de dados fornecer um, caso contrário isso
    gerará uma coluna ``BINARY(16)``. UUIDs binários fornecem armazenamento mais eficiente
    comparado a UUIDs de string ao armazenar o UUID como 16 bytes de dados binários em vez
    de uma string de 36 caracteres. Este tipo manipula automaticamente a conversão entre
    formato UUID de string (com traços) e formato binário.
nativeuuid
    Mapeia para o tipo UUID no MySQL com MariaDb. Em todos os outros bancos de dados,
    ``nativeuuid`` é um alias para ``uuid``.
integer
    Mapeia para o tipo ``INTEGER`` fornecido pelo banco de dados. BIT ainda não é
    suportado neste momento.
smallinteger
    Mapeia para o tipo ``SMALLINT`` fornecido pelo banco de dados.
tinyinteger
    Mapeia para os tipos ``TINYINT`` ou ``SMALLINT`` fornecidos pelo banco de dados. No MySQL
    ``TINYINT(1)`` é tratado como um boolean.
biginteger
    Mapeia para o tipo ``BIGINT`` fornecido pelo banco de dados.
float
    Mapeia para ``DOUBLE`` ou ``FLOAT``, dependendo do banco de dados. A opção ``precision``
    pode ser usada para definir a precisão utilizada.
decimal
    Mapeia para o tipo ``DECIMAL``. Suporta as opções ``length`` e ``precision``.
    Os valores para o tipo decimal são representados como strings (não como float
    como alguns poderiam esperar). Isso porque tipos decimais são usados para representar
    valores numéricos exatos em bancos de dados e usar tipo float para eles no PHP pode
    potencialmente levar à perda de precisão.

    Se você quiser que os valores sejam `float` no seu código PHP, então considere usar
    colunas de tipo `FLOAT` ou `DOUBLE` no seu banco de dados. Além disso, dependendo do seu caso
    de uso, você pode mapear explicitamente suas colunas decimais para tipo `float` no seu schema
    de tabela.
boolean
    Mapeia para ``BOOLEAN``, exceto no MySQL, onde ``TINYINT(1)`` é usado para representar
    booleans. ``BIT(1)`` ainda não é suportado neste momento.
binary
    Mapeia para os tipos ``BLOB`` ou ``BYTEA`` fornecidos pelo banco de dados.
date
    Mapeia para um tipo de coluna ``DATE`` nativo. O valor de retorno desse tipo
    de coluna é :php:class:`Cake\\I18n\\Date` que emula os métodos relacionados a data
    da classe ``DateTime`` do PHP.
datetime
    Veja :ref:`datetime-type`.
datetimefractional
    Veja :ref:`datetime-type`.
timestamp
    Mapeia para o tipo ``TIMESTAMP``.
timestampfractional
    Mapeia para o tipo ``TIMESTAMP(N)``.
time
    Mapeia para um tipo ``TIME`` em todos bancos de dados.
json
    Mapeia para um tipo ``JSON`` se disponível, caso contrário mapeia para ``TEXT``.
enum
    Veja :ref:`enum-type`.
geometry
    Mapeia para um tipo de armazenamento de geometria genérico.
point
    Mapeia para um único ponto no armazenamento geoespacial.
linestring
    Mapeia para uma única linha no armazenamento geoespacial.
polygon
    Mapeia para um único polígono no armazenamento geoespacial.

Esses tipos são usados tanto nos recursos de schema reflection que o CakePHP fornece,
quanto nos recursos de geração de schema que o CakePHP utiliza ao usar fixtures de testes.

Cada tipo também pode fornecer funções de tradução entre representações de PHP e SQL.
Esses métodos são invocados com base nos type hints fornecidos ao fazer consultas.
Por exemplo, uma coluna marcada como 'datetime' automaticamente converterá os parâmetros
de entrada das instâncias ``DateTime`` em timestamp ou string de data formatada. Da mesma
forma, as colunas 'binary' aceitarão manipuladores de arquivos e gerarão manipuladores de
arquivos ao ler dados.

.. versionchanged:: 5.1.0
   Os tipos ``geometry``, ``point``, ``linestring`` e ``polygon`` foram
   adicionados.

.. versionchanged:: 5.2.0
    O tipo ``nativeuuid`` foi adicionado.

.. _datetime-type:

Tipo DateTime
-------------

.. php:class:: DateTimeType

Mapeia para um tipo de coluna nativa ``DATETIME``. No PostgreSQL e SQL Server isto
se transforma em um tipo ``TIMESTAMP``. O valor de retorno padrão deste tipo de
coluna é :php:class:`Cake\\I18n\\DateTime` que estende `Chronos
<https://github.com/cakephp/chronos>`_ e o ``DateTimeImmutable`` nativo.

.. php:method:: setTimezone(string|\DateTimeZone|null $timezone)

Se o fuso horário de seu servidor de banco de dados não corresponder ao fuso horário
PHP de sua aplicação, então você pode usar este método para especificar o fuso
horário de seu banco de dados. Este fuso horário será então utilizado na conversão
de objetos PHP para a string de datetime do banco de dados e vice-versa.

.. php:class:: DateTimeFractionalType

Pode ser utilizado para mapear colunas de datetime que contenham microssegundos
como ``DATETIME(6)`` no MySQL. Para utilizar este tipo você precisa adicioná-lo
como um tipo mapeado::

    // em config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeFractionalType;

    // Sobrescrever o tipo datetime padrão com um mais preciso.
    TypeFactory::map('datetime', DateTimeFractionalType::class);

.. php:class:: DateTimeTimezoneType

Pode ser usado para mapear colunas de datetime que contenham fusos horários, tais
como ``TIMESTAMPTZ`` no PostgreSQL. Para utilizar este tipo você precisa adicioná-lo
como um tipo mapeado::

    // em config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeTimezoneType;

    // Sobrescrever o tipo datetime padrão com um mais preciso.
    TypeFactory::map('datetime', DateTimeTimezoneType::class);

.. _enum-type:

Tipo Enum
---------

.. php:class:: EnumType

Mapeia um `BackedEnum <https://www.php.net/manual/en/language.enumerations.backed.php>`_ para uma coluna de string ou inteiro.
Para usar este tipo você precisa especificar qual coluna está associada a qual BackedEnum dentro da classe table::

    use App\Model\Enum\ArticleStatus;
    use Cake\Database\Type\EnumType;

    // em src/Model/Table/ArticlesTable.php
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->getSchema()->setColumnType('status', EnumType::from(ArticleStatus::class));
    }

Um simples ``ArticleStatus`` poderia parecer com::

    namespace App\Model\Enum;

    enum ArticleStatus: string
    {
        case Published = 'Y';
        case Unpublished = 'N';
    }

O CakePHP também fornece a ``EnumLabelInterface`` que pode ser implementada por
Enums que querem fornecer um mapa de rótulos legíveis por humanos::

    namespace App\Model\Enum;

    use Cake\Database\Type\EnumLabelInterface;

    enum ArticleStatus: string implements EnumLabelInterface
    {
        case Published = 'Y';
        case Unpublished = 'N';

        public static function label(): string
        {
            return match ($this) {
                self::Published => __('Published'),
                self::Unpublished => __('Unpublished'),
            };
        }
    }

Isso pode ser útil se você quiser usar seus enums em inputs de seleção do ``FormHelper``.
Você pode usar `bake </bake>`_ para gerar uma classe enum::

    # gerar uma classe enum com dois casos e armazenada como um inteiro
    bin/cake bake enum UserStatus inactive:0,active:1 -i

    # gerar uma classe enum com dois casos como uma string
    bin/cake bake enum UserStatus published:Y,unpublished:N

O CakePHP recomenda algumas convenções para enums:

- Nomes de classes Enum devem seguir o estilo ``{Entity}{ColumnName}`` para habilitar
  detecção durante a execução do bake e para ajudar com a consistência do projeto.
- Casos de Enum devem usar o estilo CamelCase.
- Enums devem implementar a ``Cake\Database\Type\EnumLabelInterface`` para
  melhorar a compatibilidade com bake e ``FormHelper``.

Tipos Geoespaciais
------------------

Os tipos ``geometry``, ``point``, ``linestring`` e ``polygon`` também são conhecidos
como "tipos geoespaciais". O CakePHP oferece suporte limitado para colunas geoespaciais.
Atualmente elas podem ser definidas em migrations, lidas na reflexão de schema,
e ter valores definidos como texto.

.. versionadded:: 5.1.0
   Tipos de schema geoespaciais foram adicionados.

.. _adding-custom-database-types:

Adicionando Tipos Personalizados
---------------------------------

.. php:class:: TypeFactory
.. php:staticmethod:: map($name, $class)

Se você precisa usar tipos específicos do fornecedor que não estão incorporados no CakePHP,
você pode adicionar novos tipos adicionais ao sistema de tipos do CakePHP. As classes de tipos
são esperadas implementar os seguintes métodos:

* ``toPHP``: Converte valor dado de um tipo de banco de dados para um equivalente do PHP.
* ``toDatabase``: Converte valor dado de um tipo PHP para um aceitável por um banco de dados.
* ``toStatement``: Converte valor dado para seu equivalente Statement.
* ``marshal``: Converte dados simples em objetos PHP.

Para atender a interface básica, estenda :php:class:`Cake\\Database\\Type`.
Por exemplo, se quiséssemos adicionar um tipo PointMutation, poderíamos fazer a seguinte classe
de tipo::

    // em src/Database/Type/PointMutationType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type\BaseType;
    use PDO;

    class PointMutationType extends BaseType
    {
        public function toPHP(mixed $value, Driver $driver): mixed
        {
            if ($value === null) {
                return null;
            }

            return $this->pmDecode($value);
        }

        public function marshal(mixed $value): mixed
        {
            if (is_array($value) || $value === null) {
                return $value;
            }

            return $this->pmDecode($value);
        }

        public function toDatabase(mixed $value, Driver $driver): mixed
        {
            return sprintf('%d%s>%s', $value['position'], $value['from'], $value['to']);
        }

        public function toStatement(mixed $value, Driver $driver): int
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }

            return PDO::PARAM_STR;
        }

        protected function pmDecode(mixed $value): mixed
        {
            if (preg_match('/^(\d+)([a-zA-Z])>([a-zA-Z])$/', $value, $matches)) {
                return [
                    'position' => (int) $matches[1],
                    'from' => $matches[2],
                    'to' => $matches[3]
                ];
            }

            return null;
        }
    }

Por padrão, o método ``toStatement()`` tratará os valores como strings que
funcionarão para o nosso novo tipo.

Conectando Datatypes Personalizados à Reflexão e Geração de Schema
-------------------------------------------------------------------

Uma vez que criamos nosso novo tipo, nós
precisamos adicioná-lo ao mapeamento de tipo. Durante o bootstrap do nosso
aplicativo, devemos fazer o seguinte::

    use Cake\Database\TypeFactory;

    TypeFactory::map('point_mutation', \App\Database\Type\PointMutationType::class);


Nós então temos duas maneiras de usar nosso datatype nos nossos models.

#. O primeiro caminho é sobrescrever os dados de schema refletido para usar nosso novo tipo.
#. O segundo é implementar ``Cake\Database\Type\ColumnSchemaAwareInterface``
   e definir o tipo de coluna SQL e lógica de reflexão.

Sobrescrever o schema refletido com nosso tipo personalizado habilitará a
camada de banco de dados do CakePHP a converter automaticamente dados PointMutation ao
criar consultas. No método :ref:`getSchema() <saving-complex-types>` da sua
Table, adicione o seguinte::

    class WidgetsTable extends Table
    {
        public function initialize(array $config): void
        {
            return parent::getSchema()->setColumnType('mutation', 'point_mutation');

        }
    }

Implementar ``ColumnSchemaAwareInterface`` dá a você mais controle sobre
datatypes personalizados. Isso evita sobrescrever definições de schema se seu
datatype tem uma definição de coluna SQL sem ambiguidade. Por exemplo, poderíamos ter
nosso tipo PointMutation ser usado sempre que uma coluna ``TEXT`` com um comentário específico é
usada::

    // em src/Database/Type/PointMutationType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ColumnSchemaAwareInterface;
    use Cake\Database\Schema\TableSchemaInterface;
    use PDO;

    class PointMutationType extends BaseType
        implements ColumnSchemaAwareInterface
    {
        // outros métodos de antes

        /**
         * Converter definição de schema abstrata em um trecho SQL
         * específico do driver que pode ser usado em uma instrução CREATE TABLE.
         *
         * Retornar null cairá para os tipos incorporados do CakePHP.
         */
        public function getColumnSql(
            TableSchemaInterface $schema,
            string $column,
            Driver $driver
        ): ?string {
            $data = $schema->getColumn($column);
            $sql = $driver->quoteIdentifier($column);
            $sql .= ' JSON';
            if (isset($data['null']) && $data['null'] === false) {
                $sql .= ' NOT NULL';
            }

            return $sql;
        }

        /**
         * Converter os dados de coluna retornados da reflexão de schema
         * nos dados de schema abstratos.
         *
         * Retornar null cairá para os tipos incorporados do CakePHP.
         */
        public function convertColumnDefinition(
            array $definition,
            Driver $driver
        ): ?array {
            return [
                'type' => $this->_name,
                'length' => null,
            ];
        }
    }

Os dados de ``$definition`` passados para ``convertColumnDefinition()`` conterão
as seguintes chaves. Todas as chaves existirão mas podem conter ``null`` se a chave não tiver
valor para o driver de banco de dados atual:

- ``length`` O comprimento de uma coluna se disponível.
- ``precision`` A precisão da coluna se disponível.
- ``scale`` Pode ser incluído para conexões SQLServer.

.. _mapping-custom-datatypes-to-sql-expressions:

Mapeando Datatypes Personalizados para Expressões SQL
------------------------------------------------------

O exemplo anterior mapeia um datatype personalizado para um tipo de coluna 'point_mutation'
que é facilmente representado como uma string em uma instrução SQL. Tipos complexos de dados SQL
não podem ser representados como strings/integers em consultas SQL. Ao trabalhar
com esses datatypes, sua classe Type precisa implementar a
interface ``Cake\Database\Type\ExpressionTypeInterface``. Essa interface permite
que seu tipo personalizado represente um valor como uma expressão SQL. Como exemplo, vamos
construir uma simples classe Type para manipular dados do tipo ``POINT`` do MySQL. Primeiramente, vamos definir um
objeto 'value' que podemos usar para representar dados ``POINT`` no PHP::

    // em src/Database/Point.php
    namespace App\Database;

    // Nosso objeto de valor é imutável.
    class Point
    {
        protected $_lat;
        protected $_long;

        // Método de fábrica.
        public static function parse($value)
        {
            // Analise os dados WKB do MySQL.
            $unpacked = unpack('x4/corder/Ltype/dlat/dlong', $value);

            return new static($unpacked['lat'], $unpacked['long']);
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
    use Cake\Database\Driver;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\ExpressionInterface;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, Driver $d): mixed
        {
            return $value === null ? null : Point::parse($value);
        }

        public function marshal($value): mixed
        {
            if (is_string($value)) {
                $value = explode(',', $value);
            }
            if (is_array($value)) {
                return new Point($value[0], $value[1]);
            }

            return null;
        }

        public function toExpression($value): ExpressionInterface
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
            // Lidar com outros casos.
        }

        public function toDatabase($value, Driver $driver): mixed
        {
            return $value;
        }
    }

A classe acima faz algumas coisas interessantes:

* O método ``toPHP`` lida com o parse de resultados de consulta SQL em um objeto de valor.
* O método ``marshal`` lida com a conversão de dados, como dados de requisição fornecidos, em nosso objeto de valor.
  Nós vamos aceitar valores string como ``'10.24,12.34`` e arrays por enquanto.
* O método ``toExpression`` lida com a conversão do nosso objeto de valor para
  as expressões SQL equivalentes. No nosso exemplo, o SQL resultante seria algo como
  ``POINT(10.24, 12.34)``.

Uma vez que criamos nosso tipo personalizado, precisaremos :ref:`conectar nosso tipo
à nossa classe table <saving-complex-types>`.

Classes de Conexão
==================

.. php:class:: Connection

As classes de conexão fornecem uma interface simples para interagir
com conexões de banco de dados de modo consistente. Elas servem como
uma interface mais abstrata para a camada do driver e fornece recursos
para executar consultas, registrar consultas e realizar
operações transacionais.

.. _database-queries:

Executando Consultas
---------------------

.. php:method:: execute(string $sql, array $params = [], array $types = []): \Cake\Database\StatementInterface

Uma vez que você obteve um objeto de conexão, você provavelmente quererá
executar algumas consultas com ele. A camada de abstração de banco de dados
do CakePHP fornece recursos de wrapper em cima do PDO e drivers nativos.
Esses wrappers fornecem uma interface similar ao PDO. Há algumas formas
diferentes de executar consultas, dependendo do tipo de consulta que você
precisa executar e do tipo de resultados que você precisa receber. O método
mais básico é ``execute()`` que lhe permite executar consultas SQL completas::

    $statement = $connection->execute('UPDATE articles SET published = 1 WHERE id = 2');

Para consultas parametrizadas use o 2º argumento::

    $statement = $connection->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Sem qualquer informação de tipo, ``execute`` assumirá que todos os
placeholders são valores de string. Se você precisa vincular tipos específicos
de dados, você pode usar seus nomes de tipos abstratos ao criar uma consulta::

    $statement = $connection->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: selectQuery()

Esses métodos permitem que você use tipos de dados ricos em suas aplicações e converta-os
adequadamente em instruções SQL. A última e mais flexível maneira de criar consultas
é usar o :doc:`/orm/query-builder`. Essa abordagem lhe permite criar consultas
complexas e expressivas sem ter que usar SQL específico de plataforma. Ao usar o
query builder, nenhum SQL será enviado para o servidor do banco de dados até que o método ``execute()``
seja chamado ou a consulta seja iterada. Iterar uma consulta irá primeiro executá-la
e então começar a iterar sobre o conjunto de resultados::

    $query = $connection->selectQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Faz alguma coisa com a linha.
    }

.. note::

    Em vez de iterar o ``$query`` você também pode chamar o método ``all()``
    para obter os resultados.

.. php:method:: updateQuery()

Este método fornece a você um construtor para consultas ``UPDATE``::

    $query = $connection->updateQuery('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $statement = $query->execute();

.. php:method:: insertQuery()

Este método fornece a você um construtor para consultas ``INSERT``::

    $query = $connection->insertQuery();
    $query->into('articles')
        ->columns(['title'])
        ->values(['1st article']);
    $statement = $query->execute();

.. php:method:: deleteQuery()

Este método fornece a você um construtor para consultas ``DELETE``::

    $query = $connection->deleteQuery();
    $query->delete('articles')
        ->where(['id' => 2]);
    $statement = $query->execute();

Usando Transações
------------------

Os objetos de conexão lhe fornecem algumas maneiras simples de realizar transações
de banco de dados. A maneira mais básica de fazer transações é através dos métodos
``begin()``, ``commit()`` e ``rollback()``, que mapeiam para seus equivalentes em SQL::

    $connection->begin();
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $connection->commit();

.. php:method:: transactional(callable $callback)

Além disso, essas instâncias de interface de conexão também fornecem o método
``transactional()`` que torna o tratamento das chamadas begin/commit/rollback muito mais simples::

    $connection->transactional(function ($connection) {
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    });

Além de consultas básicas, você pode executar consultas mais complexas usando
:doc:`/orm/query-builder` ou :doc:`/orm/table-objects`. O método transactional vai fazer o seguinte:

- Chamar método ``begin``.
- Chamar a closure fornecida.
- Se a closure lançar uma exceção, um rollback será emitido. A exceção original será re-lançada.
- Se a closure retornar ``false``, um rollback será emitido.
- Se a closure for executada com sucesso, a transação será commitada.

Interagindo com Instruções
===========================

Ao usar a API do banco de dados de baixo nível, você muitas vezes encontrará objetos de instrução.
Esses objetos lhe permitem manipular a instrução preparada subjacente do driver. Depois de criar e
executar um objeto de consulta, ou usando ``execute()`` você terá uma instância ``StatementInterface``.

Executando e Obtendo Linhas
----------------------------

Uma vez que uma consulta é executada usando ``execute()``, os resultados podem ser obtidos usando
``fetch()``, ``fetchAll()``::

    $statement->execute();

    // Lê uma linha.
    $row = $statement->fetch('assoc');

    // Lê todas as linhas.
    $rows = $statement->fetchAll('assoc');

Obtendo Contagens de Linha
---------------------------

Depois de executar uma instrução, você pode buscar o número de linhas afetadas::

    $rowCount = $statement->rowCount();

Verificando Códigos de Erro
----------------------------

Se a sua consulta não foi bem sucedida, você pode obter informações de erro relacionadas
usando os métodos ``errorCode()`` e ``errorInfo()``. Estes métodos funcionam da mesma
maneira que os fornecidos pelo PDO::

    $code = $statement->errorCode();
    $info = $statement->errorInfo();

.. _database-query-logging:

Log de Consultas
================

O log de consultas pode ser habilitado ao configurar sua conexão definindo a opção ``log``
com o valor ``true``.

Quando o log de consultas está habilitado, as consultas serão registradas em
:php:class:`Cake\\Log\\Log` usando o nível 'debug', e o escopo 'queriesLog'.
Você precisará ter um logger configurado para capturar esse nível e escopo.
Registrar no ``stderr`` pode ser útil quando se estiver trabalhando com testes
de unidade e registrar em arquivos/syslog pode ser útil ao trabalhar com
requisições web::

    use Cake\Log\Log;

    // Console logging
    Log::setConfig('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // File logging
    Log::setConfig('queries', [
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

Citação de Identificadores
===========================

Por padrão, o CakePHP **não** cita identificadores em consultas
SQL geradas. A razão disso é que a citação de identificadores tem algumas desvantagens:

* Sobrecarga de desempenho - Citar identificadores é muito mais lento e complexo
  do que não fazê-lo.
* Não é necessário na maioria dos casos - Em bancos de dados não legados que seguem as
  convenções do CakePHP não há motivo para citar identificadores.

Se você estiver usando um schema legado que requer citação de identificador, você pode
habilitar isso usando a configuração ``quoteIdentifiers`` em seu
:ref:`database-configuration`. Você também pode habilitar esse recurso em tempo de execução::

    $connection->getDriver()->enableAutoQuoting();

Quando habilitado, a citação de identificador causará uma travessia de query adicional
que converte todos os identificadores em objetos ``IdentifierExpression``.

.. note::

    Os fragmentos de SQL contidos em objetos QueryExpression não serão modificados.

.. _database-metadata-cache:

Cache de Metadados
==================

O ORM do CakePHP usa reflexão de banco de dados para determinar a schema, índices e
chaves estrangeiras que sua aplicação contém. Como esse metadado é alterado
com pouca frequência e pode ser caro de acessar, ele geralmente é armazenado em cache.
Por padrão, os metadados são armazenados na configuração de cache ``_cake_model_``.
Você pode definir uma configuração de cache personalizada usando a opção ``cacheMetadata``
na sua configuração de datasource::

    'Datasources' => [
        'default' => [
            // Outras chaves vão aqui.

            // Use a configuração de cache 'orm_metadata' para metadados.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

Você também pode configurar o cache de metadados em tempo de execução
com o método ``cacheMetadata()``::

    // Desabilitar o cache
    $connection->cacheMetadata(false);

    // Habilitar o cache
    $connection->cacheMetadata(true);

    // Utilizar uma configuração de cache personalizada
    $connection->cacheMetadata('orm_metadata');

O CakePHP também inclui uma ferramenta CLI para gerenciar caches de metadados.
Confira o capítulo :doc:`/console-commands/schema-cache` para obter mais informações.

Criando Bancos de Dados
========================

Se você quer criar uma conexão sem selecionar um banco de dados, você pode omitir o
nome do banco de dados::

    $dsn = 'mysql://root:password@localhost/';
    ConnectionManager::setConfig('setup', ['url' => $dsn]);

Agora você pode usar seu objeto de conexão para executar consultas que cria/modifica
bancos de dados. Por exemplo, para criar um banco de dados::

    $connection = ConnectionManager::get('setup');
    $connection->execute("CREATE DATABASE IF NOT EXISTS my_database");

.. note::

    Ao criar um banco de dados, é uma boa ideia definir o conjunto de caracteres e os
    parâmetros de collation (por exemplo, ``DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci``).
    Se esses valores estiverem faltando, o banco de dados
    definirá quaisquer valores padrão de sistema que ele use.

.. meta::
    :title lang=en: Database Basics
    :keywords lang=en: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,database,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,caching
