Testing
#######

O CakePHP vem com suporte interno para testes e integração para o `PHPUnit
<https://phpunit.de>`_. Em adição aos recursos oferecidos pelo PHPUnit, o CakePHP
oferece alguns recursos adicionais para fazer testes mais facilmente. Esta seção
abordará a instalação do PHPUnit, começando com testes unitários e como você
pode usar as extensões que o CakePHP oferece.

Instalando o PHPUnit
====================

O CakePHP usa o PHPUnit como framework de teste básico. O PHPUnit é um padrão
para testes unitários em PHP. Ele oferece um profundo e poderoso conjunto de
recursos para você ter certeza que o seu código faz o que você acha que ele faz.
O PHPUnit pode ser instalado usando o `PHAR package
<https://phpunit.de/#download>`__ ou `Composer <https://getcomposer.org>`_.

Instalando o PHPUnit com Composer
---------------------------------

Para instalar o PHPUnit com Composer::

    $ php composer.phar require --dev phpunit/phpunit

Isto adicionará a dependência para a seção ``require-dev`` do seu
``composer.json``, e depois instalará o PHPUnit com qualquer outra dependência.

Agora você executa o PHPUnit usando::

    $ vendor/bin/phpunit

Usando o arquivo PHAR
---------------------

Depois de ter baixado o arquivo **phpunit.phar** , você pode usar ele para
executar seus testes::

    php phpunit.phar

.. tip::

    Como conveniência você pode deixar phpunit.phar disponivel globalmente em sistemas
    Unix ou Linux com os comandos::

        chmod +x phpunit.phar
        sudo mv phpunit.phar /usr/local/bin/phpunit
        phpunit --version

    Por favor, consulte a documentação do PHPUnit para instruções sobre `como
    instalar globalmente o PHPUnit PHAR em sistemas Windows
    <https://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Configuração do banco de dados de teste
=======================================

Lembre-se de ter o debug habilitado em seu arquivo **config/app.php** antes de
executar qualquer teste.  Antes de executar quaisquer testes você deve adicionar
um datasourse ``test`` para o arquivo **config/app.php**. Esta configuração é
usada pelo CakePHP para fixar tabelas e dados::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'username' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database'
        ],
    ],

.. note::

    É uma boa idéia tornar o banco de dados de teste e o banco de dados
    real diferentes. Isso evitará erros embaraçosos mais tarde.

Verificando a Configuração de Teste
===================================

Depois de instalar o PHPUnit e definir a configuração da fonte de dados ``test``,
você pode se certificar de que está pronto para escrever e executar seus próprios
testes executando os testes do aplicativo:

.. code-block:: console

    # Para phpunit.phar
    $ php phpunit.phar

    # Para phpunit instalado com Composer
    $ vendor/bin/phpunit

O exemplo acima deve executar todos os testes que você possui ou informar que nenhum
teste foi executado. Para executar um teste específico, você pode fornecer o caminho
para o teste como um parâmetro para o PHPUnit. Por exemplo, se você tiver um caso de
teste para a classe ArticlesTable, poderá executá-lo com

.. code-block:: console

    $ vendor/bin/phpunit tests/TestCase/Model/Table/ArticlesTableTest

Você deve ver uma barra verde com algumas informações adicionais sobre os testes
executados e o número passado.

.. note::

    Se você estiver em um sistema Windows, provavelmente não verá cores.

Convenções de Casos de Teste
============================

Como a maioria das coisas no CakePHP, os casos de teste têm algumas convenções. No que diz
respeito aos testes:

#. Os arquivos PHP que contêm testes devem estar nos seus diretórios ``tests/TestCase/[Type]``.
#. Os nomes desses arquivos devem terminar em **Test.php** em vez de apenas em .php.
#. As classes que contêm testes devem se estender das classes ``Cake\TestSuite\TestCase``,
   ``Cake\TestSuite\IntegrationTestCase`` ou ``\PHPUnit\Framework\TestCase``.
#. Como outros nomes de classe, os nomes de classe do caso de teste devem corresponder
   ao nome do arquivo. **RouterTest.php** deve conter ``classe RouterTest extends TestCase``.
#. O nome de qualquer método que contenha um teste (ou seja, que contenha uma asserção) deve
   começar com ``test``, como em ``testPublished()``. Você também pode usar a anotação
   ``@test`` para marcar métodos como métodos de teste.

Criando seu Primeiro Caso de Teste
==================================

No exemplo a seguir, criaremos um caso de teste para um método auxiliar muito simples. O auxiliar
que vamos testar estará formatando a barra de progresso HTML. Nosso ajudante se parece com::

    namespace App\View\Helper;

    use Cake\View\Helper;

    class ProgressHelper extends Helper
    {
        public function bar($value)
        {
            $width = round($value / 100, 2) * 100;

            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

Este é um exemplo muito simples, mas será útil mostrar como você pode criar um caso
de teste simples. Após criar e salvar nosso auxiliar, criaremos o arquivo de caso de
teste em **tests/TestCase/View/Helper/ProgressHelperTest.php**. Nesse arquivo
começaremos com o seguinte::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase
    {
        public function setUp()
        {

        }

        public function testBar()
        {

        }
    }

Vamos preparar esse esqueleto em um minuto. Adicionamos dois métodos para começar. Primeiro é ``setUp()``.
Este método é chamado antes de cada método *test* em uma classe de caso de teste. Os métodos de instalação
devem inicializar os objetos necessários para o teste e fazer qualquer configuração necessária. No nosso método
de configuração, adicionaremos o seguinte::

    public function setUp()
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

A chamada do método pai é importante nos casos de teste, pois ``TestCase::setUp()``
faz várias coisas, como fazer backup dos valores em :php:class:`~Cake\\Core\\Configure` e,
armazenar os caminhos em :php:class:`~Cake\\Core\\App`.

Em seguida, preencheremos o método de teste. Usaremos algumas asserções para garantir que
nosso código crie a saída que esperamos::

    public function testBar()
    {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

O teste acima é simples, mas mostra o benefício potencial do uso de casos de teste.
Usamos ``assertContains()`` para garantir que nosso assistente retorne uma string
que contenha o conteúdo que esperamos. Se o resultado não contiver o conteúdo esperado,
o teste falhará e saberemos que nosso código está incorreto.

Usando casos de teste, você pode descrever o relacionamento entre um conjunto de entradas
conhecidas e sua saída esperada. Isso ajuda você a ter mais confiança no código que está
escrevendo, pois pode garantir que o código que você escreveu atenda às expectativas e
afirmações feitas pelos seus testes. Além disso, como os testes são de código, eles são
fáceis de executar novamente sempre que você faz uma alteração. Isso ajuda a impedir a
criação de novos bugs.

.. note::

    O EventManager é atualizado para cada método de teste. Isso significa que,
    ao executar vários testes ao mesmo tempo, você perderá seus ouvintes de
    eventos que foram registrados no config/bootstrap.php, pois o bootstrap
    é executado apenas uma vez.

.. _running-tests:

Executando Testes
=================

Depois de instalar o PHPUnit e escrever alguns casos de teste, você deverá executá-los com muita
frequência. É uma boa ideia executar testes antes de confirmar quaisquer alterações para ajudar
a garantir que você não tenha quebrado nada.

Ao usar o ``phpunit``, você pode executar os testes do aplicativo. Para executar os testes do seu
aplicativo, você pode simplesmente executar:

.. code-block:: console

    # instalado pelo Composer
    $ vendor/bin/phpunit

    # arquivo phar
    php phpunit.phar

Se você clonou o código-fonte `CakePHP do GitHub <https://github.com/cakephp/cakephp>` __ e deseja
executar os testes de unidade do CakePHP, não se esqueça de executar o seguinte comando ``Composer``
antes de executar ``phpunit`` para que todas as dependências sejam instaladas:

.. code-block:: console

    $ composer install

No diretório raiz do seu aplicativo. Para executar testes para um plug-in que faz parte da fonte do
aplicativo, primeiro execute ``cd`` para o diretório do plug-in, depois use o comando ``phpunit`` que
corresponde à maneira como você instalou o phpunit:

.. code-block:: console

    cd plugins

    # Usando o phpunit instalado pelo compositor
    ../vendor/bin/phpunit

    # Usando o arquivo phar
    php ../phpunit.phar

Para executar testes em um plug-in independente, você deve primeiro instalar o projeto
em um diretório separado e instalar suas dependências:

.. code-block:: console

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    vendor/bin/phpunit

Filtrando Casos de Teste
------------------------

Quando você tem casos de teste maiores, geralmente deseja executar um subconjunto
dos métodos de teste ao tentar trabalhar em um único caso com falha. Com o corredor
da CLI, você pode usar uma opção para filtrar os métodos de teste:

.. code-block:: console

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

O parâmetro filter é usado como uma expressão regular com distinção entre maiúsculas e minúsculas para
filtrar quais métodos de teste executar.

Gerando Cobertura de Código
---------------------------

Você pode gerar relatórios de amostras de código a partir da linha de comando usando as
ferramentas internas de cobertura de código do PHPUnit. O PHPUnit irá gerar um conjunto de
arquivos HTML estáticos contendo os resultados da cobertura. Você pode gerar cobertura para
um caso de teste, fazendo o seguinte:

.. code-block:: console

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Isso colocará os resultados da cobertura no diretório webroot do seu aplicativo.
Você deve conseguir visualizar os resultados acessando ``http://localhost/your_app/coverage``.

Se você estiver usando o PHP 5.6.0 ou superior, poderá usar o ``phpdbg`` para gerar cobertura
em vez do xdebug. O ``phpdbg`` geralmente é mais rápido na geração de cobertura:

.. code-block:: console

    $ phpdbg -qrr phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Combinando Conjuntos de Testes para Plug-ins
--------------------------------------------

Muitas vezes, seu aplicativo será composto de vários plugins. Nessas situações,
pode ser bastante entediante executar testes para cada plug-in. Você pode fazer
testes em execução para cada um dos plugins que compõem seu aplicativo adicionando
seções adicionais ``<testsuite>`` ao arquivo **phpunit.xml.dist** do seu aplicativo:

.. code-block:: xml

    <testsuites>
        <testsuite name="app">
            <directory>./tests/TestCase/</directory>
        </testsuite>

        <!-- Adicione seus pacotes de plugins -->
        <testsuite name="forum">
            <directory>./plugins/Forum/tests/TestCase/</directory>
        </testsuite>
    </testsuites>

Quaisquer suítes de teste adicionais vinculados ao elemento ``<testsuites>`` serão
executados automaticamente quando você usar ``phpunit``.

Se você estiver usando ``<testsuites>`` para usar acessórios de plug-ins que você
instalou com o composer, o arquivo ``composer.json`` do plugin deve adicionar o
espaço para nome do fixture à seção de carregamento automático. Exemplo::

    "autoload-dev": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests/Fixture/"
        }
    },

Retornos de Chamada do Ciclo de Cida do Caso de Teste
=====================================================

Os casos de teste têm vários retornos de chamada do ciclo de vida que você pode usar ao fazer o teste:

* ``setUp`` é chamado antes de cada método de teste. Deve ser usado para criar os objetos que serão
  testados e inicializar quaisquer dados para o teste. Lembre-se sempre de chamar ``parent::setUp()``
* ``tearDown`` é chamado após cada método de teste. Deve ser usado para limpeza após a conclusão do
  teste. Lembre-se sempre de chamar ``parent::tearDown()``.
* ``setupBeforeClass`` é chamado uma vez antes do início dos métodos de teste em um caso.
  Este método deve ser *estático*.
* ``tearDownAfterClass`` é chamado uma vez depois que os métodos de teste em um caso são iniciados.
  Este método deve ser *estático*.

.. _test-fixtures:

Fixtures
========

Ao testar o código que depende dos modelos e do banco de dados, pode-se usar **fixtures**
como uma maneira de gerar tabelas de dados temporárias carregadas com dados de amostra que
podem ser usados pelo teste. O benefício do uso de fixtures é que seu teste não tem chance
de interromper os dados do aplicativo ao vivo. Além disso, você pode começar a testar seu
código antes de realmente desenvolver conteúdo ao vivo para um aplicativo.

O CakePHP usa a conexão chamada ``test`` no seu arquivo de configuração **config/app.php**.
Se essa conexão não for utilizável, uma exceção será gerada e você não poderá usar fixtures
de banco de dados.

O CakePHP executa o seguinte durante o curso de uma fixture no caso de teste:

#. Cria tabelas para cada um dos fixtures necessários.
#. Preenche tabelas com dados, se os dados forem fornecidos no fixture.
#. Executa métodos de teste.
#. Esvazia as tabelas de fixtures.
#. Remove tabelas de fixtures do banco de dados.


Conexões de Teste
-----------------

Por padrão, o CakePHP fará o pseudônimo de cada conexão em sua aplicação. Cada
conexão definida no bootstrap do seu aplicativo que não inicia com ``test`` terá
um alias prefixado criado com ``test``. As conexões com aliasing garantem que você
não use acidentalmente a conexão errada nos casos de teste. O alias de conexão é
transparente para o restante do seu aplicativo. Por exemplo, se você usar a conexão
'padrão', receberá a conexão ``test`` nos casos de teste. Se você usar a conexão 'replica',
o conjunto de testes tentará usar 'test_replica'.

Criando Fixtures
----------------

Ao criar um dispositivo elétrico, você definirá principalmente duas coisas: como
a tabela é criada (quais campos fazem parte da tabela) e quais registros serão
preenchidos inicialmente na tabela. Vamos criar nosso primeiro fixture, que
será usado para testar nosso próprio modelo de artigo. Crie um arquivo chamado
**ArticlesFixture.php** no seu diretório **tests/Fixture**, com o seguinte
conteúdo::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
          // Opcional. Configure esta propriedade para carregar fixtures
          // em uma fonte de dados de teste diferente
          public $connection = 'test';

          public $fields = [
              'id' => ['type' => 'integer'],
              'title' => ['type' => 'string', 'length' => 255, 'null' => false],
              'body' => 'text',
              'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
              'created' => 'datetime',
              'modified' => 'datetime',
              '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']]
              ]
          ];
          public $records = [
              [
                  'title' => 'First Article',
                  'body' => 'First Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:39:23',
                  'modified' => '2007-03-18 10:41:31'
              ],
              [
                  'title' => 'Second Article',
                  'body' => 'Second Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:41:23',
                  'modified' => '2007-03-18 10:43:31'
              ],
              [
                  'title' => 'Third Article',
                  'body' => 'Third Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:43:23',
                  'modified' => '2007-03-18 10:45:31'
              ]
          ];
     }

.. note::

    Recomenda-se não adicionar valores manualmente a colunas incrementais automáticas,
    pois isso interfere na geração de sequência no PostgreSQL e SQLServer.

A propriedade ``$connection`` define a fonte de dados que a fixture usará. Se seu
aplicativo usa várias fontes de dados, você deve fazer com que as fixtures
correspondam às fontes de dados do modelo, mas prefixados com ``test``. Por exemplo,
se o seu modelo usa a fonte de dados ``mydb``, sua fixture deve usar a fonte de dados
``test_mydb``. Se a conexão ``test_mydb`` não existir, seus modelos usarão a fonte de
dados ``test`` padrão. As fontes de dados da fixture devem ser prefixadas com ``test``
para reduzir a possibilidade de truncar acidentalmente todos os dados do seu aplicativo
ao executar testes.

Usamos ``$fields`` para especificar quais campos farão parte desta tabela e como eles são
definidos. O formato usado para definir esses campos é o mesmo usado com :php:class:`Cake\\Database\\Schema\\Table`.
As chaves disponíveis para definição da tabela são:

type
    Tipo de dados interno do CakePHP. Atualmente suportado:

    - ``string``: mapeia para ``VARCHAR`` ou ``CHAR``
    - ``uuid``: mapeia para ``UUID``
    - ``text``: mapeia para ``TEXT``
    - ``integer``: mapeia para ``INT``
    - ``biginteger``: mapeia para ``BIGINTEGER``
    - ``decimal``: mapeia para ``DECIMAL``
    - ``float``: mapeia para ``FLOAT``
    - ``datetime``: mapeia para ``DATETIME``
    - ``timestamp``: mapeia para ``TIMESTAMP``
    - ``time``: mapeia para ``TIME``
    - ``date``: mapeia para ``DATE``
    - ``binary``: mapeia para ``BLOB``
fixed
    Usado com tipos de sequência para criar colunas CHAR em plataformas que as
    suportam.
length
    Defina para o comprimento específico que o campo deve ter.
precision
   Defina o número de casas decimais usadas nos campos flutuante e decimal.
null
   Defina como ``true`` (para permitir NULLs) ou ``false`` (para desabilitar NULLs).
default
    Valor padrão que o campo assume.

Podemos definir um conjunto de registros que serão preenchidos após a criação da
tabela de fixtures. O formato é bastante simples, ``$records`` é uma matriz de
registros. Cada item em ``$records`` deve ser uma única linha. Dentro de cada linha,
deve haver uma matriz associativa das colunas e valores para a linha. Lembre-se de que
cada registro na matriz $records deve ter uma chave para **todos** os campos especificados
na matriz ``$fields``. Se um campo para um registro específico precisar ter um valor
``null``, basta especificar o valor dessa chave como ``null``.

Dados Dinâmicos e Fixtures
--------------------------

Como os registros de uma fixture são declarados como uma propriedade de classe,
você não pode usar funções ou outros dados dinâmicos para definir fixtures.
Para resolver esse problema, você pode definir ``$records`` na função ``init()`` de sua
fixture. Por exemplo, se você quiser que todos os carimbos de data e hora criados e modificados
reflitam a data de hoje, faça o seguinte::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
        public $fields = [
            'id' => ['type' => 'integer'],
            'title' => ['type' => 'string', 'length' => 255, 'null' => false],
            'body' => 'text',
            'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
            'created' => 'datetime',
            'modified' => 'datetime',
            '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']],
            ]
        ];

        public function init()
        {
            $this->records = [
                [
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'modified' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

Ao substituir ``init()`` lembre-se de sempre chamar ``parent::init()``.

Importando Informações da Tabela
--------------------------------

Definir o esquema nos arquivos de fixture pode ser realmente útil ao criar plug-ins
ou bibliotecas se você estiver criando um aplicativo que precise ser portátil entre
os fornecedores de banco de dados. Redefinir o esquema em acessórios pode se tornar
difícil de manter em aplicativos maiores. Devido a isso, o CakePHP fornece a capacidade
de importar o esquema de uma conexão existente e usar a definição de tabela refletida para
criar a definição de tabela usada no conjunto de testes.

Vamos começar com um exemplo. Supondo que você tenha uma tabela com os artigos disponíveis
no seu aplicativo, altere o exemplo de dispositivo fornecido na seção anterior
(**tests/Fixture/ArticlesFixture.php**) para::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
    }

Se você deseja usar uma conexão diferente, use::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

Normalmente, você também tem uma classe de tabela com sua fixture. Você também pode usar isso para
recuperar o nome da tabela::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['model' => 'Articles'];
    }

Como isso usa ``TableRegistry::getTableLocator()->get()``, ele também suporta a sintaxe do plugin.

Naturalmente, você pode importar sua definição de tabela de um modelo/tabela existente, mas ter
seus registros definidos diretamente no aparelho, como foi mostrado na seção anterior. Por exemplo::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
        public $records = [
            [
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'modified' => '2007-03-18 10:41:31'
            ],
            [
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'modified' => '2007-03-18 10:43:31'
            ],
            [
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'modified' => '2007-03-18 10:45:31'
            ]
        ];
    }

Finalizando, não é possível carregar/criar nenhum esquema em uma fixture. Isso é útil se
você já tiver uma configuração de banco de dados de teste com todas as tabelas vazias criadas.
Ao não definir ``$fields`` nem ``$import``, um equipamento apenas inserirá seus registros e
truncará os registros em cada método de teste.

Carregando Fixtures em seus Casos de Teste
------------------------------------------

Depois de criar suas fixtures, convém usá-los em seus casos de teste. Em cada
caso de teste, você deve carregar as fixtures necessárias. Você deve carregar
uma fixture para cada modelo que terá uma consulta executada nele. Para carregar a fixture,
defina a propriedade ``$fixtures`` no seu modelo::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['app.Articles', 'app.Comments'];
    }

O item acima carregará os fixtures de Article e Coment do
diretório fixture do aplicativo. Você também pode carregar fixture do core do CakePHP ou plugins::

    class ArticlesTest extends TestCase
    {
        public $fixtures = [
            'plugin.DebugKit.Articles',
            'plugin.MyVendorName/MyPlugin.Messages',
            'core.Comments'
        ];
    }

Usar o prefixo ``core`` carregará fixtures do CakePHP e, usando o nome de um plugin
como prefixo, carregará o fixture do plugin nomeado.

Você pode controlar quando seus fixtures são carregados configurando :php:attr:`Cake\\TestSuite\\TestCase::$autoFixtures`
para ``false`` e carregá-los posteriormente usando :php:meth:`Cake\\TestSuite\\TestCase::loadFixtures()`::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['app.Articles', 'app.Comments'];
        public $autoFixtures = false;

        public function testMyFunction()
        {
            $this->loadFixtures('Articles', 'Comments');
        }
    }

Você pode carregar fixtures em subdiretórios. O uso de vários diretórios pode
facilitar a organização de suas fixtures, se você tiver um aplicativo maior.
Para carregar fixtures em subdiretórios, basta incluir o nome do subdiretório
no nome do fixtures::

    class ArticlesTest extends CakeTestCase
    {
        public $fixtures = ['app.Blog/Articles', 'app.Blog/Comments'];
    }

No exemplo acima, ambos os aparelhos seriam carregados a partir de ``tests/Fixture/Blog/``.

Classes de Tabela de Teste
==========================

Digamos que já temos nossa classe de tabela de artigos definida em
**src/Model/Table/ArticlesTable.php** e se parece com::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table
    {
        public function findPublished(Query $query, array $options)
        {
            $query->where([
                $this->alias() . '.published' => 1
            ]);

            return $query;
        }
    }

Agora, queremos configurar um teste que verifique esta classe de tabela. Vamos
agora criar um arquivo chamado **ArticlesTableTest.php** no seu diretório **tests/TestCase/Model/Table**,
com o seguinte conteúdo::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.Articles'];
    }

Na variável de nossos casos de teste ``$fixtures``, definimos o conjunto de
fixtures que usaremos. Lembre-se de incluir todas as fixtures que terão consultas
executadas em comparação a eles.

Criando um Método de Teste
--------------------------

Vamos agora adicionar um método para testar a função ``publish()`` na tabela Articles.
Edite o arquivo **tests/TestCase/Model/Table/ArticlesTableTest.php** para que agora fique assim::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.Articles'];

        public function setUp()
        {
            parent::setUp();
            $this->Articles = TableRegistry::getTableLocator()->get('Articles');
        }

        public function testFindPublished()
        {
            $query = $this->Articles->find('published');
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->enableHydration(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

Você pode ver que adicionamos um método chamado ``testFindPublished()``. Começamos
criando uma instância da classe ``ArticlesTable`` e, em seguida, executamos o método
``find('Published')``. Em ``$expected``, definimos o que esperamos que seja o resultado
adequado (que sabemos desde que definimos quais registros são preenchidos inicialmente na
tabela de artigos). Testamos que o resultado é igual à nossa expectativa usando o método
``assertEquals()``. Veja a seção :ref:`running-tests` para obter mais informações sobre como
executar seu caso de teste.

Métodos Mocks de Modelo
------------------------

Haverá momentos em que você desejará burlar métodos nos modelos ao testá-los. Você
deve usar ``getMockForModel`` para criar simulações de teste de classes de tabela.
Isso evita problemas com propriedades refletidas que as burlações (mocking) normais possuem::

    public function testSendingEmails()
    {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

No método ``tearDown()``, remova o mock com::

    TableRegistry::clear();

.. _integration-testing:

Teste de Integração do Controlador
==================================

Embora você possa testar as classes de controladores de maneira semelhante aos Helpers,
Models e Components, o CakePHP oferece uma trait especializada de nome ``IntegrationTestTrait``.
O uso dessa trait nos casos de teste do controlador permite realizar testes de alto nível.

Se você não está familiarizado com o teste de integração, o teste de integração é uma abordagem
que facilita a verificação de várias unidades em conjunto. Os recursos de teste de integração
no CakePHP simulam uma solicitação HTTP sendo tratada pelo seu aplicativo. Por exemplo, testar
seu controlador também exercitará quaisquer componentes, modelos e auxiliares envolvidos no
processamento de uma determinada solicitação. Isso oferece um teste de alto nível da sua aplicação
e de todas as suas partes de trabalho.

Digamos que você tenha um ArticlesController típico e seu modelo correspondente. O código do
controlador se parece com::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function index($short = null)
        {
            if ($this->request->is('post')) {
                $article = $this->Articles->newEntity($this->request->getData());
                if ($this->Articles->save($article)) {
                    // Redirect as per PRG pattern
                    return $this->redirect(['action' => 'index']);
                }
            }
            if (!empty($short)) {
                $result = $this->Articles->find('all', [
                    'fields' => ['id', 'title']
                ]);
            } else {
                $result = $this->Articles->find();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

Crie um arquivo chamado **ArticlesControllerTest.php** em seu
diretório **tests/TestCase/Controller** e coloque o seguinte dentro::

    namespace App\Test\TestCase\Controller;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\IntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class ArticlesControllerTest extends TestCase
    {
        use IntegrationTestTrait;

        public $fixtures = ['app.Articles'];

        public function testIndex()
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // Mais asserts.
        }

        public function testIndexQueryData()
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // Mais asserts.
        }

        public function testIndexShort()
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // Mais asserts.
        }

        public function testIndexPostData()
        {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles', $data);

            $this->assertResponseSuccess();
            $articles = TableRegistry::getTableLocator()->get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

Este exemplo mostra alguns dos métodos de envio de solicitação e algumas das
asserções que o ``IntegrationTestTrait`` fornece. Antes de fazer qualquer
afirmação, você precisará enviar uma solicitação. Você pode usar um dos seguintes
métodos para enviar uma solicitação:

* ``get()`` Envia uma solicitação GET.
* ``post()`` Envia uma solicitação POST.
* ``put()`` Envia uma solicitação PUT.
* ``delete()`` Envia uma solicitação DELETE.
* ``patch()`` Envia uma solicitação PATCH.
* ``options()`` Envia uma solicitação OPTIONS.
* ``head()`` Envia uma solicitação HEAD.

Todos os métodos, exceto ``get()`` e ``delete()``, aceitam um segundo parâmetro que
permite enviar um corpo de solicitação. Depois de enviar uma solicitação, você pode
usar as várias asserções fornecidas por ``IntegrationTestTrait`` ou PHPUnit para
garantir que sua solicitação tenha os efeitos colaterais corretos.

Configurando a Solicitação
--------------------------

A trait ``IntegrationTestTrait`` vem com vários métodos auxiliares para facilitar a
configuração das solicitações que você enviará ao seu aplicativo em teste::

    // Configura cookies
    $this->cookie('name', 'Uncle Bob');

    // Defina um valor na sessão
    $this->session(['Auth.User.id' => 1]);

    // Configura cabeçalhos
    $this->configRequest([
        'headers' => ['Accept' => 'application/json']
    ]);

O estado definido por esses métodos auxiliares é redefinido no método ``tearDown()``.

.. _testing-authentication:

Testando Ações que Exigem Autenticação
--------------------------------------

Se você estiver usando ``AuthComponent``, precisará remover os dados da sessão que o
AuthComponent usa para validar a identidade de um usuário. Você pode usar métodos
auxiliares em ``IntegrationTestTrait`` para fazer isso. Supondo que você tivesse um
``ArticlesController`` que continha um método add e que exigisse autenticação com o
método add, você poderia escrever os seguintes testes::

    public function testAddUnauthenticatedFails()
    {
        // Nenhum conjunto de dados da sessão.
        $this->get('/articles/add');

        $this->assertRedirect(['controller' => 'Users', 'action' => 'login']);
    }

    public function testAddAuthenticated()
    {
        // Define dados da sessão
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => 1,
                    'username' => 'testing',
                    // outras chaves
                ]
            ]
        ]);
        $this->get('/articles/add');

        $this->assertResponseOk();
        // Outras asserts.
    }

Testando Autenticação Stateless e APIs
--------------------------------------

Para testar APIs que usam autenticação sem estado, como autenticação Básica, você
pode configurar a solicitação para injetar condições do ambiente ou cabeçalhos que
simulam cabeçalhos de solicitação de autenticação reais.

Ao testar a autenticação Básica ou Digest, você pode adicionar as variáveis de
ambiente que o `PHP cria <https://php.net/manual/en/features.http-auth.php>`
automaticamente. Essas variáveis de ambiente usadas no adaptador de autenticação
descritas em :ref:`basic-authentication`::

    public function testBasicAuthentication()
    {
        $this->configRequest([
            'environment' => [
                'PHP_AUTH_USER' => 'username',
                'PHP_AUTH_PW' => 'password',
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

Se você estiver testando outras formas de autenticação, como OAuth2, poderá definir o
cabeçalho de Autorização diretamente::

    public function testOauthToken()
    {
        $this->configRequest([
            'headers' => [
                'authorization' => 'Bearer: oauth-token'
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

A chave de cabeçalhos em ``configRequest()`` pode ser usada para configurar
qualquer cabeçalho HTTP adicional necessário para uma ação.

Testando Ações Protegidas por CsrfProtectionMiddleware ou FormProtectionComponent
---------------------------------------------------------------------------------

Ao testar ações protegidas por ``CsrfProtectionMiddleware`` ou ``FormProtectionComponent``, você pode ativar
a geração automática de token para garantir que seus testes não falhem devido a
incompatibilidades de token::

    public function testAdd()
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'Exciting news!']);
    }

Também é importante habilitar a depuração em testes que usam tokens para impedir
que o ``FormProtectionComponent`` pense que o token de depuração está sendo usado em um
ambiente sem depuração. Ao testar com outros métodos como ``requireSecure()``,
você pode usar ``configRequest()`` para definir as variáveis de ambiente corretas::

    // Falsificar conexões SSL.
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

Teste de Integração PSR-7 Middleware
------------------------------------

O teste de integração também pode ser usado para testar todo o aplicativo PSR-7 e
:doc:`/controllers/middleware`. Por padrão, o ``IntegrationTestTrait`` detecta
automaticamente a presença de uma classe ``App\Application`` e habilita automaticamente
o teste de integração do seu aplicativo. Você pode alternar esse comportamento com o
método ``useHttpServer()``::

    public function setUp()
    {
        // Ative o teste de integração PSR-7.
        $this->useHttpServer(true);

        // Desative o teste de integração PSR-7.
        $this->useHttpServer(false);
    }

Você pode personalizar o nome da classe do aplicativo usado e os
argumentos do construtor, usando o método ``configApplication()``::

    public function setUp()
    {
        $this->configApplication('App\App', [CONFIG]);
    }

Depois de ativar o modo PSR-7 e, possivelmente, configurar sua classe de
aplicativo, você pode usar os recursos restantes do ``IntegrationTestTrait``
normalmente.

Você também deve tentar usar :ref:`application-bootstrap` para carregar qualquer
plug-in que contenha eventos/rotas. Isso garantirá que seus eventos/rotas
estejam conectados para cada caso de teste. Como alternativa, se você deseja carregar
plug-ins manualmente em um teste, pode usar o método ``loadPlugins()``.

Testando com Cookies Criptografados
-----------------------------------

Se você usar :php:class:`Cake\\Controller\\Component\\CookieComponent`
em seus controladores, é provável que seus cookies sejam criptografados.
A partir do 3.1.7, o CakePHP fornece métodos auxiliares para interagir
com cookies criptografados nos seus casos de teste::

    // Defina um cookie usando o AES e a chave padrão.
    $this->cookieEncrypted('my_cookie', 'Some secret values');

    // Suponha que esta ação modifique o cookie.
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('An updated value', 'my_cookie');

Testando Mensagens Flash
------------------------

Se você deseja testar a presença de mensagens flash na sessão e não o HTML
renderizado, pode usar ``enableRetainFlashMessages()`` em seus testes
para reter mensagens flash na sessão, para poder escrever as assertions::

    $this->enableRetainFlashMessages();
    $this->get('/bookmarks/delete/9999');

    $this->assertSession('That bookmark does not exist', 'Flash.flash.0.message');

A partir da versão 3.7.0, existem auxiliares de teste adicionais para mensagens flash::

    $this->enableRetainFlashMessages();
    $this->get('/bookmarks/delete/9999');

    // Coloque uma mensagem flash na chave 'flash'.
    $this->assertFlashMessage('Bookmark deleted', 'flash');

    // Afirme a segunda mensagem flash, também na chave 'flash'.
    $this->assertFlashMessageAt(1, 'Bookmark really deleted');

    // Afirme uma mensagem flash na chave 'auth' na primeira posição
    $this->assertFlashMessageAt(0, 'You are not allowed to enter this dungeon!', 'auth');

    // Afirmar que uma mensagem flash usa o elemento error
    $this->assertFlashElement('Flash/error');

    // Afirme o segundo elemento de mensagem flash
    $this->assertFlashElementAt(1, 'Flash/error');

Testando um Controlador Com Resposta em JSON
--------------------------------------------

JSON é um formato amigável e comum a ser usado ao criar um serviço da web.
Testar os pontos finais do seu serviço da web é muito simples com o CakePHP.
Vamos começar com um exemplo simples de controlador que responde em JSON::

    class MarkersController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set([
                '_serialize' => ['marker'],
                'marker' => $marker,
            ]);
        }
    }

Agora, criamos o arquivo **tests/TestCase/Controller/MarkersControllerTest.php** e
garantimos que nosso serviço da Web retorne a resposta adequada::

    class MarkersControllerTest extends IntegrationTestCase
    {
        public function testGet()
        {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // Check that the response was a 200
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, (string)$this->_response->getBody());
        }
    }

Nós usamos a opção ``JSON_PRETTY_PRINT``, pois o CakePHP
embutido no JsonView usará essa opção quando ``debug`` estiver ativado.

Teste com carregamentos de ficheiros
------------------------------------

A simulação de carregamentos de ficheiros é simples quando se utiliza o modo
padrão `arquivos carregados como objectos <request-file-uploads>`. Pode
simplesmente criar instâncias que implementem
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__
(a implementação padrão actualmente utilizada pelo CakePHP é
``\Laminas\Diactoros\UploadedFile``), e passá-los nos seus dados de pedido de
teste. No ambiente CLI, tais objectos irão, por defeito, passar na validação
que testa se o ficheiro foi carregado via HTTP. O mesmo não é verdade para os
dados de estilo array como os encontrados em ``$_FILES``, falharia essa
verificação.

A fim de simular exactamente como os objectos de ficheiro carregados estariam
presentes num pedido regular, é necessário não só passá-los nos dados do pedido,
mas também passá-los para a configuração do pedido de teste através da opção
``files``. Mas não é tecnicamente necessário, a menos que o seu código aceda
aos ficheiros carregados através dos métodos
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` ou
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()`.

Vamos assumir que os artigos têm uma imagem teaser, e uma associação
``Articles hasMany Attachments``, o formulário pareceria algo parecido com isto
em conformidade, onde um ficheiro de imagem, e múltiplos anexos/arquivos seriam
aceites::

    <?= $this->Form->create($article, ['type' => 'file']) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('teaser_image', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.description']) ?>
    <?= $this->Form->control('attachments.1.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.1.description']) ?>
    <?= $this->Form->button('Submit') ?>
    <?= $this->Form->end() ?>

O teste que simularia o pedido correspondente poderia parecer-se com o seguinte::

    public function testAddWithUploads(): void
    {
        $teaserImage = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.jpg', // fluxo ou caminho para o ficheiro que representa o ficheiro temporário
            12345,                    // os ficheiros em bytes
            \UPLOAD_ERR_OK,           // o estado de carregamento/erro
            'teaser.jpg',             // o nome do ficheiro tal como enviado pelo cliente
            'image/jpeg'              // a mimetype tal como enviada pelo cliente
        );

        $textAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.txt',
            'text/plain'
        );

        $pdfAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.pdf',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.pdf',
            'application/pdf'
        );

        // Estes são os dados acessíveis através de `$this->request->getUploadedFile()`
        // e `$this->request->getUploadedFiles()`.
        $this->configRequest([
            'files' => [
                'teaser_image' => $teaserImage,
                'attachments' => [
                    0 => [
                        'attachment' => $textAttachment,
                    ],
                    1 => [
                        'attachment' => $pdfAttachment,
                    ],
                ],
            ],
        ]);

        // Estes são os dados acessíveis através de  `$this->request->getData()`.
        $postData = [
            'title' => 'Novo Artigo',
            'teaser_image' => $teaserImage,
            'attachments' => [
                0 => [
                    'attachment' => $textAttachment,
                    'description' => 'Text attachment',
                ],
                1 => [
                    'attachment' => $pdfAttachment,
                    'description' => 'PDF attachment',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('O artigo foi salvo com sucesso');
        $this->assertFileExists('/path/to/uploads/teaser.jpg');
        $this->assertFileExists('/path/to/uploads/attachment.txt');
        $this->assertFileExists('/path/to/uploads/attachment.pdf');
    }

.. tip::

    Se configurar o pedido de teste com ficheiros, então ele *terá* de
    corresponder à estrutura dos seus dados POST (mas apenas incluir os
    objectos de ficheiro carregados)!

Da mesma forma, pode simular `erros de carregamento <https://www.php.net/manual/en/features.file-upload.errors.php>`_
ou ficheiros inválidos que não passem na validação::

    public function testAddWithInvalidUploads(): void
    {
        $missingTeaserImageUpload = new \Laminas\Diactoros\UploadedFile(
            '',
            0,
            \UPLOAD_ERR_NO_FILE,
            '',
            ''
        );

        $uploadFailureAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            1234567890,
            \UPLOAD_ERR_INI_SIZE,
            'attachment.txt',
            'text/plain'
        );

        $invalidTypeAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.exe',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.exe',
            'application/vnd.microsoft.portable-executable'
        );

        $this->configRequest([
            'files' => [
                'teaser_image' => $missingTeaserImageUpload,
                'attachments' => [
                    0 => [
                        'file' => $uploadFailureAttachment,
                    ],
                    1 => [
                        'file' => $invalidTypeAttachment,
                    ],
                ],
            ],
        ]);

        $postData = [
            'title' => 'Novo Artigo',
            'teaser_image' => $missingTeaserImageUpload,
            'attachments' => [
                0 => [
                    'file' => $uploadFailureAttachment,
                    'description' => 'Upload de anexo de falha',
                ],
                1 => [
                    'file' => $invalidTypeAttachment,
                    'description' => 'Fixação de tipo inválido',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('O artigo não pôde ser salvo');
        $this->assertResponseContains('É necessária uma imagem de teaser');
        $this->assertResponseContains('Tamanho máximo de ficheiros permitido excedido');
        $this->assertResponseContains('Tipo de ficheiro não suportado');
        $this->assertFileNotExists('/path/to/uploads/teaser.jpg');
        $this->assertFileNotExists('/path/to/uploads/attachment.txt');
        $this->assertFileNotExists('/path/to/uploads/attachment.exe');
    }

Desabilitando o Tratamento de Erros de Middlewares nos Testes
-------------------------------------------------------------

Ao depurar testes que estão falhando porque seu aplicativo está encontrando erros,
pode ser útil desativar temporariamente o middleware de manipulação de erros para
permitir que o erro subjacente seja exibido. Você pode usar o método ``disableErrorHandlerMiddleware()``
para fazer isso::

    public function testGetMissing()
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

No exemplo acima, o teste falharia e a mensagem de exceção subjacente e o
rastreamento da pilha seriam exibidos em vez da verificação da página de erro
renderizada.

Métodos Assertion
-----------------

A característica ``IntegrationTestTrait`` fornece vários métodos de asserção
que tornam as respostas de teste muito mais simples. Alguns exemplos são::

    // Verifica se o código da resposta é 2xx
    $this->assertResponseOk();

    // Verifica se o código de resposta é 2xx/3xx
    $this->assertResponseSuccess();

    // Verifica se o código de resposta é 4xx
    $this->assertResponseError();

    // Verifica se o código de resposta 5xx
    $this->assertResponseFailure();

    // Verifica se a resposta tem um código específico, exemplo: 200
    $this->assertResponseCode(200);

    // Verifica o cabeçalho do local
    $this->assertRedirect(['controller' => 'Articles', 'action' => 'index']);

    // Verifica se nenhum cabeçalho de redirecionamento foi definido
    $this->assertNoRedirect();

    // Verifique uma parte do cabeçalho Location
    $this->assertRedirectContains('/articles/edit/');

    // Adicionado em 3.7.0
    $this->assertRedirectNotContains('/articles/edit/');

    // Verifica se conteúdo de resposta não está vazio
    $this->assertResponseNotEmpty();

    // Verifica conteúdo de resposta vazio
    $this->assertResponseEmpty();

    // Afirmar conteúdo de resposta
    $this->assertResponseEquals('Yeah!');

    // Afirmar que o conteúdo da resposta não é igual ao especifícado
    $this->assertResponseNotEquals('No!');

    // Afirmar conteúdo de resposta parcialmente
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');

    // Afirmar arquivo enviado de volta
    $this->assertFileResponse('/absolute/path/to/file.ext');

    // Afirmar layout
    $this->assertLayout('default');

    // Afirme qual modelo foi renderizado (se houver)
    $this->assertTemplate('index');

    // Afirmar dados na sessão
    $this->assertSession(1, 'Auth.User.id');

    // Afirmar cabeçalho de resposta.
    $this->assertHeader('Content-Type', 'application/json');
    $this->assertHeaderContains('Content-Type', 'html');

    // Adicionado em 3.7.0
    $this->assertHeaderNotContains('Content-Type', 'xml');

    // Afirmar variáveis de exibição
    $user =  $this->viewVariable('user');
    $this->assertEquals('jose', $user->username);

    // Afirmar cookies na resposta
    $this->assertCookie('1', 'thingid');

    // Verifique o tipo de conteúdo
    $this->assertContentType('application/json');

Além dos métodos de asserção acima, você também pode usar todas as asserções no `TestSuite
<https://api.cakephp.org/4.x/class-Cake.TestSuite.TestCase.html>`__ e
os encontrados em `PHPUnit <https://phpunit.de/manual/current/en/appendixes. assertions.html>`__.

Comparando Resultados de Teste com um Arquivo
---------------------------------------------

Para alguns tipos de teste, pode ser mais fácil comparar o resultado de um teste
com o conteúdo de um arquivo - por exemplo, ao testar a saída renderizada de uma visualização.
O ``StringCompareTrait`` adiciona um método de declaração simples para essa finalidade.

O uso envolve o uso da característica, definindo o caminho base de comparação e
chamando ``assertSameAsFile``::

    use Cake\TestSuite\StringCompareTrait;
    use Cake\TestSuite\TestCase;

    class SomeTest extends TestCase
    {
        use StringCompareTrait;

        public function setUp()
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample()
        {
            $result = ...;
            $this->assertSameAsFile('example.php', $result);
        }
    }

O exemplo acima comparará ``$result`` com o conteúdo do arquivo ``APP/tests/comparisons/example.php``.

Um mecanismo é fornecido para gravar/atualizar arquivos de teste, configurando
a variável de ambiente ``UPDATE_TEST_COMPARISON_FILES``, que criará e/ou atualizará os
arquivos de comparação de testes à medida que forem referenciados:

.. code-block:: console

    phpunit
    ...
    FAILURES!
    Tests: 6, Assertions: 7, Failures: 1

    UPDATE_TEST_COMPARISON_FILES=1 phpunit
    ...
    OK (6 tests, 7 assertions)

    git status
    ...
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   tests/comparisons/example.php


Teste de Integração de Console
==============================

Veja `console-integration-testing` para obter informações sobre testes de shells e comandos.

Testando Views
==============

Geralmente a maioria dos aplicativos não testa diretamente seu código HTML.
Fazer isso geralmente resulta em conjuntos de testes frágeis e difíceis de
manter, com tendência a serem quebrados. Ao escrever testes funcionais usando
:php:class:`IntegrationTestTrait`, você pode inspecionar o conteúdo da
visualização renderizada configurando a opção` `return`` para 'view'. Embora
seja possível testar o conteúdo da visualização usando ``IntegrationTestTrait``,
um teste de integração/visualização mais robusto e sustentável pode ser realizado
usando ferramentas como `Selenium webdriver <https://www.selenium.dev/>`__.

Testando Componentes
====================

Vamos fingir que temos um componente chamado PagematronComponent em nosso aplicativo.
Esse componente nos ajuda a definir o valor limite de paginação em todos os
controladores que o utilizam. Aqui está o nosso exemplo de componente localizado
em **src/Controller/Component/PagematronComponent.php**::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // Verifique se o controlador está usando paginação
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(Event $event)
        {
            $this->setController($event->getSubject());
        }

        public function adjust($length = 'short')
        {
            switch ($length) {
                case 'long':
                    $this->controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->controller->paginate['limit'] = 50;
                break;
                default:
                    $this->controller->paginate['limit'] = 20;
                break;
            }
        }
    }

Agora podemos escrever testes para garantir que nosso parâmetro paginado ``limit``
esteja sendo definido corretamente pelo método ``Adjust()`` em nosso componente.
Criamos o arquivo **tests/TestCase/Controller/Component/PagematronComponentTest.php**::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentRegistry;
    use Cake\Event\Event;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {

        public $component = null;
        public $controller = null;

        public function setUp()
        {
            parent::setUp();
            // Configure nosso componente e o controlador de teste fake
            $request = new ServerRequest();
            $response = new Response();
            $this->controller = $this->getMockBuilder('Cake\Controller\Controller')
                ->setConstructorArgs([$request, $response])
                ->setMethods(null)
                ->getMock();
            $registry = new ComponentRegistry($this->controller);
            $this->component = new PagematronComponent($registry);
            $event = new Event('Controller.startup', $this->controller);
            $this->component->startup($event);
        }

        public function testAdjust()
        {
            // Teste nosso método de ajuste com diferentes configurações de parâmetros
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown()
        {
            parent::tearDown();
            // Limpar depois que terminarmos
            unset($this->component, $this->controller);
        }
    }

Testando Ajudantes
==================

Como uma quantidade decente de lógica reside nas classes Helper, é importante
garantir que essas classes sejam cobertas por casos de teste.

Primeiro, criamos um exemplo de auxiliar para testar. O ``CurrencyRendererHelper``
nos ajudará a exibir moedas em nossos pontos de vista e, por simplicidade, só possui
um método ``usd()``::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function usd($amount)
        {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Aqui, definimos as casas decimais como 2, separador decimal para ponto,
separador de milhares para vírgula e prefixamos o número formatado com a
string 'USD'.

Agora criamos nossos testes::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase
    {
        public $helper = null;

        // Aqui instanciamos nosso ajudante
        public function setUp()
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // Testando a função usd()
        public function testUsd()
        {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // Devemos sempre ter 2 dígitos decimais
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // Testando o separador de milhares
            $this->assertEquals(
              'USD 12,000.70',
              $this->helper->usd(12000.70)
            );
        }
    }

Aqui, chamamos ``usd()`` com parâmetros diferentes e dizemos ao conjunto
de testes para verificar se os valores retornados são iguais ao esperado.

Salve isso e execute o teste. Você deverá ver uma barra verde e mensagens
indicando 1 passe e 4 asserções.

Quando você estiver testando um Helper que use outros helpers, "mock" o método
``loadHelpers`` da classe View.

.. _testing-events:

Testando Eventos
================

O :doc:`/core-libraries/events` é uma ótima maneira de desacoplar o código do
aplicativo, mas às vezes ao testar, você tende a testar os resultados dos eventos
nos casos de teste que os executam. Esta é uma forma adicional de acoplamento que
pode ser removida usando ``assertEventFired`` e ``assertEventFiredWith``.

Expandindo no exemplo Orders, digamos que temos as seguintes tabelas::

    class OrdersTable extends Table
    {
        public function place($order)
        {
            if ($this->save($order)) {
                // remoção de carrinho movido para CartsTable
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);

                return true;
            }

            return false;
        }
    }

    class CartsTable extends Table
    {
        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'removeFromCart'
            ];
        }

        public function removeFromCart(Event $event)
        {
            $order = $event->getData('order');
            $this->delete($order->cart_id);
        }
    }

.. note::
    Para afirmar que os eventos foram disparados, você deve primeiro
    ativar :ref:`tracking-events` no gerenciador de eventos que deseja reivindicar.

Para testar o ``OrdersTable`` acima, habilitamos o rastreamento em ``setUp()``,
depois afirmamos que o evento foi disparado e afirmamos que a entidade ``$order``
foi passada nos dados do evento::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {
        public $fixtures = ['app.Orders'];

        public function setUp()
        {
            parent::setUp();
            $this->Orders = TableRegistry::getTableLocator()->get('Orders');
            // ativar o rastreamento de eventos
            $this->Orders->getEventManager()->setEventList(new EventList());
        }

        public function testPlace()
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->getEventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->getEventManager());
        }
    }

Por padrão, o global ``EventManager`` é usado para asserções, portanto, testar
eventos globais não requer a aprovação do gerenciador de eventos::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

Testando Email
==============

Veja :ref:`email-testing` para obter informações sobre o teste de email.

Criando Suítes de Teste
=======================

Se você deseja que vários de seus testes sejam executados ao mesmo tempo, é possível
criar um conjunto de testes. Um conjunto de testes é composto por vários casos de teste.
Você pode criar suítes de teste no arquivo **phpunit.xml** do seu aplicativo. Um exemplo
simples seria:

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

Criando Testes para Plugins
===========================

Os testes para plugins são criados em seu próprio diretório, dentro da pasta plugins.::

    /src
    /plugins
        /Blog
            /tests
                /TestCase
                /Fixture

Eles funcionam como testes normais, mas você deve se lembrar de usar as convenções de
nomenclatura para plug-ins ao importar classes. Este é um exemplo de uma caixa de teste
para o modelo ``BlogPost`` do capítulo de plugins deste manual. A diferença de outros
testes está na primeira linha em que 'Blog.BlogPost' é importado. Você também precisa
prefixar os dispositivos de seu plugin com ``plugin.Blog.BlogPosts``::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {
        // Acessórios para plug-ins localizados em /plugins/Blog/tests/Fixture/
        public $fixtures = ['plugin.Blog.BlogPosts'];

        public function testSomething()
        {
            // Teste alguma coisa.
        }
    }

Se você deseja usar fixtures de plug-in nos testes do aplicativo, pode referenciá-los usando a
sintaxe ``plugin.pluginName.fixtureName`` na matriz ``$fixtures``. Além disso, se você usar o
nome do plugin do fornecedor ou os diretórios do equipamento, poderá usar o seguinte:
``plugin.vendorName/pluginName.folderName/fixtureName``.

Antes de usar os equipamentos, verifique novamente se o seu ``phpunit.xml``
contém o ouvinte do equipamento::

    <!-- Configurar um ouvinte para fixtures -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

Você também deve garantir que suas fixtures sejam carregáveis. Verifique se o
seguinte arquivo está presente em seu arquivo **composer.json**::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
        }
    }

.. note::

    Lembre-se de executar o ``composer.phar dumpautoload`` ao adicionar novos
    mapeamentos de carregamento automático.

Gerando Testes com o Bake
==========================

Se você usar :doc:`bake </bake>` para gerar scaffolding, ele também gerará stubs
de teste. Se você precisar gerar novamente esqueletos de casos de teste ou se desejar
gerar esqueletos de teste para o código que escreveu, poderá usar o ``bake``:

.. code-block:: console

    bin/cake bake test <type> <name>

``<type>`` deve ser um dos:

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Task
#. ShellHelper
#. Cell
#. Form
#. Mailer
#. Command

``<name>`` deve ser o nome do objeto para o qual você deseja criar um esqueleto de teste.

Integração com Jenkins
======================

O `Jenkins <https://jenkins-ci.org>`_ é um servidor de integração contínua, que
pode ajudá-lo a automatizar a execução dos seus casos de teste. Isso ajuda a
garantir que todos os seus testes permaneçam aprovados e seu aplicativo esteja
sempre pronto.

A integração de um aplicativo CakePHP com o Jenkins é bastante direta. O seguinte
pressupõe que você já instalou o Jenkins no sistema \*nix e pode administrá-lo.
Você também sabe como criar jobs e executar builds. Se você não tiver certeza
disso, consulte a `documentação de Jenkins <https://jenkins-ci.org/>`.

Criando um Trabalho
-------------------

Comece criando um trabalho para seu aplicativo e conecte seu repositório para
que jenkins possa acessar seu código.

Adicionar Configuração do Banco de Dados de Teste
-------------------------------------------------

Usar um banco de dados separado apenas para Jenkins geralmente é uma boa idéia,
pois evita vários problemas básicos. Depois de criar um novo banco de dados em
um servidor de banco de dados que jenkins pode acessar (geralmente localhost).
Adicione um *shell script* à compilação que contém o seguinte:

.. code-block:: console

    cat > config/app_local.php <<'CONFIG'
    <?php
    return [
        'Datasources' => [
            'test' => [
                'datasource' => 'Database/Mysql',
                'host'       => 'localhost',
                'database'   => 'jenkins_test',
                'username'      => 'jenkins',
                'password'   => 'cakephp_jenkins',
                'encoding'   => 'utf8'
            ]
        ]
    ];
    CONFIG

Descomente a seguinte linha no seu arquivo **config/bootstrap.php**::

    //Configure::load('app_local', 'default');

Ao criar um arquivo **app_local.php**, você tem uma maneira fácil de definir
configurações específicas do Jenkins. Você pode usar esse mesmo arquivo de
configuração para substituir qualquer outro arquivo de configuração necessário
no Jenkins.

Geralmente, é uma boa ideia eliminar e recriar o banco de dados antes de cada
compilação também. Isso o isola de falhas encadeadas, onde uma construção quebrada
faz com que outras falhem. Adicione outra etapa do *shell script* à compilação que
contém o seguinte:

.. code-block:: console

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

Adicione seus Testes
--------------------

Adicione outra etapa do *shell script* à sua compilação. Nesta etapa, instale
suas dependências e execute os testes para seu aplicativo. Criar um arquivo de
log junit ou cobertura de código geralmente é um bom bônus, pois fornece uma
boa visualização gráfica dos resultados dos testes:

.. code-block:: console

    # Faça o download do Composer, se estiver faltando.
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer | php
    # Instale dependências
    php composer.phar install
    vendor/bin/phpunit --log-junit junit.xml --coverage-clover clover.xml

Se você usar a cobertura de código ou os resultados do JUnit, certifique-se de configurar
também o Jenkins. Não configurar essas etapas significa que você não verá os resultados.

Executando uma Build
--------------------

Agora você deve poder executar uma compilação. Verifique a saída do console e
faça as alterações necessárias para obter uma compilação de aprovação.

.. meta::
    :title lang=pt-br: Testando
    :keywords lang=pt-br: phpunit,teste banco de dados, configuraçãode de banco de dados,teste de banco de dados,teste publico, teste framework,executando um,configuração de teste,padrão de fato,pear,runners,array,banco de dados,cakephp,php,integração
