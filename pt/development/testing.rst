Testing
#######

O CakePHP vem com suporte interno para testes e integração para o `PHPUnit
<http://phpunit.de>`_. Em adição aos recursos oferecidos pelo PHPUnit, o CakePHP
oferece alguns recursos adicionais para fazer testes mais facilmente. Esta seção
abordará a instalação do PHPUnit, começando com testes unitários e como você
pode usar as extensões que o CakePHP oferece.

Instalando o PHPUnit
====================

O CakePHP usa o PHPUnit como framework de teste básico. O PHPUnit é um padrão
para testes unitários em PHP. Ele oferece um profundo e poderoso conjunto de
recursos para você ter certeza que o seu código faz o que você acha que ele faz.
O PHPUnit pode ser instalado usando o `PHAR package
<http://phpunit.de/#download>`__ ou `Composer <http://getcomposer.org>`_.

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
    <http://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Configuração do banco de dados de teste
=======================================

Lembre-se de ter o debug abilitado em seu arquivo **config/app.php** antes de
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

.. code-block:: bash

    # Para phpunit.phar
    $ php phpunit.phar

    # Para phpunit instalado com Composer
    $ vendor/bin/phpunit

O exemplo acima deve executar todos os testes que você possui ou informar que nenhum 
teste foi executado. Para executar um teste específico, você pode fornecer o caminho 
para o teste como um parâmetro para o PHPUnit. Por exemplo, se você tiver um caso de 
teste para a classe ArticlesTable, poderá executá-lo com

.. code-block:: bash

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

.. versionadded:: 3.4.1
    Suporte para PHPUnit 6 foi adicionado. Se você estiver usando uma versão do PHPUnit menor que 
    5.7.0, suas classes de teste devem estender as classes CakePHP ou ``PHPUnit_Framework_TestCase``.

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

.. code-block:: bash

    # instalado pelo Composer
    $ vendor/bin/phpunit

    # arquivo phar 
    php phpunit.phar

Se você clonou o código-fonte `CakePHP do GitHub <https://github.com/cakephp/cakephp>` __ e deseja 
executar os testes de unidade do CakePHP, não se esqueça de executar o seguinte comando ``Composer`` 
antes de executar ``phpunit`` para que todas as dependências sejam instaladas:

.. code-block:: bash

    $ composer install

No diretório raiz do seu aplicativo. Para executar testes para um plug-in que faz parte da fonte do 
aplicativo, primeiro execute ``cd`` para o diretório do plug-in, depois use o comando ``phpunit`` que 
corresponde à maneira como você instalou o phpunit:

.. code-block:: bash

    cd plugins

    # Usando o phpunit instalado pelo compositor
    ../vendor/bin/phpunit

    # Usando o arquivo phar
    php ../phpunit.phar

Para executar testes em um plug-in independente, você deve primeiro instalar o projeto 
em um diretório separado e instalar suas dependências:

.. code-block:: bash

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    php ~/phpunit.phar

Filtrando Casos de Teste
------------------------

Quando você tem casos de teste maiores, geralmente deseja executar um subconjunto 
dos métodos de teste ao tentar trabalhar em um único caso com falha. Com o corredor 
da CLI, você pode usar uma opção para filtrar os métodos de teste:

.. code-block:: bash

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

O parâmetro filter é usado como uma expressão regular com distinção entre maiúsculas e minúsculas para
filtrar quais métodos de teste executar.

Gerando Cobertura de Código
---------------------------

Você pode gerar relatórios de amostras de código a partir da linha de comando usando as 
ferramentas internas de cobertura de código do PHPUnit. O PHPUnit irá gerar um conjunto de 
arquivos HTML estáticos contendo os resultados da cobertura. Você pode gerar cobertura para 
um caso de teste, fazendo o seguinte:

.. code-block:: bash

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Isso colocará os resultados da cobertura no diretório webroot do seu aplicativo. 
Você deve conseguir visualizar os resultados acessando ``http://localhost/your_app/coverage``.

Se você estiver usando o PHP 5.6.0 ou superior, poderá usar o ``phpdbg`` para gerar cobertura 
em vez do xdebug. O ``phpdbg`` geralmente é mais rápido na geração de cobertura:

.. code-block:: bash

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
conteúdo:

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
reflitam a data de hoje, faça o seguinte:

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

.. versionadded:: 3.1.7

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
diretório fixture do aplicativo. Você também pode carregar fixture do core do CakePHP ou plugins:

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

.. versionadded:: 3.7.0

    A classe ``IntegrationTestCase`` foi movida para a trait ``IntegrationTestTrait``.

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
        public $helpers = ['Form', 'Html'];

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

.. versionadded:: 3.5.0
    ``options()`` e ``head()`` foram adicionados no 3.5.0.

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
ambiente que o `PHP cria <http://php.net/manual/en/features.http-auth.php>` 
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

Testando Ações Protegidas por CsrfComponent ou SecurityComponent
---------------------------------------------------------------

Ao testar ações protegidas por SecurityComponent ou CsrfComponent, você pode ativar 
a geração automática de token para garantir que seus testes não falhem devido a 
incompatibilidades de token::

    public function testAdd()
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'Exciting news!']);
    }

Também é importante habilitar a depuração em testes que usam tokens para impedir 
que o SecurityComponent pense que o token de depuração está sendo usado em um 
ambiente sem depuração. Ao testar com outros métodos como ``requireSecure()``, 
você pode usar ``configRequest()`` para definir as variáveis de ambiente corretas::

    // Falsificar conexões SSL.
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

.. versionadded:: 3.1.2
    Os métodos ``enableCsrfToken()`` e ``enableSecurityToken()`` foram adicionados no 3.1.2

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

.. versionadded:: 3.3.0
    O Middleware PSR-7 e o método ``useHttpServer()`` foram adicionados no 3.3.0.

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

.. versionadded:: 3.1.7

    ``assertCookieEncrypted`` e ``cookieEncrypted`` foi adicionado 3.1.7.

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

.. versionadded:: 3.4.7
    ``enableRetainFlashMessages()`` foi adicionado em 3.4.7

.. versionadded:: 3.7.0
    Asserções de mensagens em Flash foram adicionadas.

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

Now we create the file **tests/TestCase/Controller/MarkersControllerTest.php**
and make sure our web service is returning the proper response::

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

We use the ``JSON_PRETTY_PRINT`` option as CakePHP's built in JsonView will use
that option when ``debug`` is enabled.

Disabling Error Handling Middleware in Tests
--------------------------------------------

When debugging tests that are failing because your application is encountering
errors it can be helpful to temporarily disable the error handling middleware to
allow the underlying error to bubble up. You can use
``disableErrorHandlerMiddleware()`` to do this::

    public function testGetMissing()
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

In the above example, the test would fail and the underlying exception message
and stack trace would be displayed instead of the rendered error page being
checked.

.. versionadded:: 3.5.0

Assertion methods
-----------------

The ``IntegrationTestTrait`` trait provides a number of assertion methods that
make testing responses much simpler. Some examples are::

    // Check for a 2xx response code
    $this->assertResponseOk();

    // Check for a 2xx/3xx response code
    $this->assertResponseSuccess();

    // Check for a 4xx response code
    $this->assertResponseError();

    // Check for a 5xx response code
    $this->assertResponseFailure();

    // Check for a specific response code, e.g. 200
    $this->assertResponseCode(200);

    // Check the Location header
    $this->assertRedirect(['controller' => 'Articles', 'action' => 'index']);

    // Check that no Location header has been set
    $this->assertNoRedirect();

    // Check a part of the Location header
    $this->assertRedirectContains('/articles/edit/');

    // Added in 3.7.0
    $this->assertRedirectNotContains('/articles/edit/');

    // Assert not empty response content
    $this->assertResponseNotEmpty();

    // Assert empty response content
    $this->assertResponseEmpty();

    // Assert response content
    $this->assertResponseEquals('Yeah!');

    // Assert response content doesn't equal
    $this->assertResponseNotEquals('No!');

    // Assert partial response content
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');
    
    // Assert file sent back
    $this->assertFileResponse('/absolute/path/to/file.ext');

    // Assert layout
    $this->assertLayout('default');

    // Assert which template was rendered (if any)
    $this->assertTemplate('index');

    // Assert data in the session
    $this->assertSession(1, 'Auth.User.id');

    // Assert response header.
    $this->assertHeader('Content-Type', 'application/json');
    $this->assertHeaderContains('Content-Type', 'html');

    // Added in 3.7.0
    $this->assertHeaderNotContains('Content-Type', 'xml');

    // Assert view variables
    $user =  $this->viewVariable('user');
    $this->assertEquals('jose', $user->username);

    // Assert cookies in the response
    $this->assertCookie('1', 'thingid');

    // Check the content type
    $this->assertContentType('application/json');

In addition to the above assertion methods, you can also use all of the
assertions in `TestSuite
<https://api.cakephp.org/3.x/class-Cake.TestSuite.TestCase.html>`_ and those
found in `PHPUnit
<https://phpunit.de/manual/current/en/appendixes.assertions.html>`__.

Comparing test results to a file
--------------------------------

For some types of test, it may be easier to compare the result of a test to the
contents of a file - for example, when testing the rendered output of a view.
The ``StringCompareTrait`` adds a simple assert method for this purpose.

Usage involves using the trait, setting the comparison base path and calling
``assertSameAsFile``::

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

The above example will compare ``$result`` to the contents of the file
``APP/tests/comparisons/example.php``.

A mechanism is provided to write/update test files, by setting the environment
variable ``UPDATE_TEST_COMPARISON_FILES``, which will create and/or update test
comparison files as they are referenced:

.. code-block:: bash

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


Console Integration Testing
===========================

See :ref:`console-integration-testing` for information on testing shells and
commands.


Testing Views
=============

Generally most applications will not directly test their HTML code. Doing so is
often results in fragile, difficult to maintain test suites that are prone to
breaking. When writing functional tests using :php:class:`IntegrationTestTrait`
you can inspect the rendered view content by setting the ``return`` option to
'view'. While it is possible to test view content using ``IntegrationTestTrait``,
a more robust and maintainable integration/view testing can be accomplished
using tools like `Selenium webdriver <http://seleniumhq.org>`_.

Testing Components
==================

Let's pretend we have a component called PagematronComponent in our application.
This component helps us set the pagination limit value across all the
controllers that use it. Here is our example component located in
**src/Controller/Component/PagematronComponent.php**::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // Make sure the controller is using pagination
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

Now we can write tests to ensure our paginate ``limit`` parameter is being set
correctly by the ``adjust()`` method in our component. We create the file
**tests/TestCase/Controller/Component/PagematronComponentTest.php**::

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
            // Setup our component and fake test controller
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
            // Test our adjust method with different parameter settings
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
            // Clean up after we're done
            unset($this->component, $this->controller);
        }
    }

Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's
important to make sure those classes are covered by test cases.

First we create an example helper to test. The ``CurrencyRendererHelper`` will
help us display currencies in our views and for simplicity only has one method
``usd()``::

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

Here we set the decimal places to 2, decimal separator to dot, thousands
separator to comma, and prefix the formatted number with 'USD' string.

Now we create our tests::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase
    {
        public $helper = null;

        // Here we instantiate our helper
        public function setUp()
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // Testing the usd() function
        public function testUsd()
        {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // We should always have 2 decimal digits
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // Testing the thousands separator
            $this->assertEquals(
              'USD 12,000.70',
              $this->helper->usd(12000.70)
            );
        }
    }

Here, we call ``usd()`` with different parameters and tell the test suite to
check if the returned values are equal to what is expected.

Save this and execute the test. You should see a green bar and messaging
indicating 1 pass and 4 assertions.

When you are testing a Helper which uses other helpers, be sure to mock the
View clases ``loadHelpers`` method.

.. _testing-events:

Testing Events
==============

The :doc:`/core-libraries/events` is a great way to decouple your application
code, but sometimes when testing, you tend to test the results of events in the
test cases that execute those events. This is an additional form of coupling
that can be removed by using ``assertEventFired`` and ``assertEventFiredWith``
instead.

Expanding on the Orders example, say we have the following tables::

    class OrdersTable extends Table
    {
        public function place($order)
        {
            if ($this->save($order)) {
                // moved cart removal to CartsTable
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
    To assert that events are fired, you must first enable
    :ref:`tracking-events` on the event manager you wish to assert against.

To test the ``OrdersTable`` above, we enable tracking in ``setUp()`` then assert
that the event was fired, and assert that the ``$order`` entity was passed in
the event data::

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
            // enable event tracking
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

By default, the global ``EventManager`` is used for assertions, so testing
global events does not require passing the event manager::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

.. versionadded:: 3.2.11

    Event tracking, ``assertEventFired()``, and ``assertEventFiredWith`` were
    added.

Testing Email
=============

See :ref:`email-testing` for information on testing email.

Creating Test Suites
====================

If you want several of your tests to run at the same time, you can create a test
suite. A test suite is composed of several test cases.  You can either create
test suites in your application's **phpunit.xml** file. A simple example
would be:

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

Creating Tests for Plugins
==========================

Tests for plugins are created in their own directory inside the plugins
folder. ::

    /src
    /plugins
        /Blog
            /tests
                /TestCase
                /Fixture

They work just like normal tests but you have to remember to use the naming
conventions for plugins when importing classes. This is an example of a testcase
for the ``BlogPost`` model from the plugins chapter of this manual. A difference
from other tests is in the first line where 'Blog.BlogPost' is imported. You
also need to prefix your plugin fixtures with ``plugin.Blog.BlogPosts``::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {
        // Plugin fixtures located in /plugins/Blog/tests/Fixture/
        public $fixtures = ['plugin.Blog.BlogPosts'];

        public function testSomething()
        {
            // Test something.
        }
    }

If you want to use plugin fixtures in the app tests you can
reference them using ``plugin.pluginName.fixtureName`` syntax in the
``$fixtures`` array. Additionally if you use vendor plugin name or fixture
directories you can use the following: ``plugin.vendorName/pluginName.folderName/fixtureName``.

Before you can use fixtures you should double check that your ``phpunit.xml``
contains the fixture listener::

    <!-- Setup a listener for fixtures -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

You should also ensure that your fixtures are loadable. Ensure the following is
present in your **composer.json** file::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
        }
    }

.. note::

    Remember to run ``composer.phar dumpautoload`` when adding new autoload
    mappings.

Generating Tests with Bake
==========================

If you use :doc:`bake </bake/usage>` to
generate scaffolding, it will also generate test stubs. If you need to
re-generate test case skeletons, or if you want to generate test skeletons for
code you wrote, you can use ``bake``:

.. code-block:: bash

    bin/cake bake test <type> <name>

``<type>`` should be one of:

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

While ``<name>`` should be the name of the object you want to bake a test
skeleton for.

Integration with Jenkins
========================

`Jenkins <http://jenkins-ci.org>`_ is a continuous integration server, that can
help you automate the running of your test cases. This helps ensure that all
your tests stay passing and your application is always ready.

Integrating a CakePHP application with Jenkins is fairly straightforward. The
following assumes you've already installed Jenkins on \*nix system, and are able
to administer it. You also know how to create jobs, and run builds. If you are
unsure of any of these, refer to the `Jenkins documentation <http://jenkins-ci.org/>`_ .

Create a Job
------------

Start off by creating a job for your application, and connect your repository
so that jenkins can access your code.

Add Test Database Config
------------------------

Using a separate database just for Jenkins is generally a good idea, as it stops
bleed through and avoids a number of basic problems. Once you've created a new
database in a database server that jenkins can access (usually localhost). Add
a *shell script step* to the build that contains the following:

.. code-block:: bash

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

Then uncomment the following line in your **config/bootstrap.php** file::

    //Configure::load('app_local', 'default');

By creating an **app_local.php** file, you have an easy way to define
configuration specific to Jenkins. You can use this same configuration file to
override any other configuration files you need on Jenkins.

It's often a good idea to drop and re-create the database before each build as
well. This insulates you from chained failures, where one broken build causes
others to fail. Add another *shell script step* to the build that contains the
following:

.. code-block:: bash

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

Add your Tests
--------------

Add another *shell script step* to your build. In this step install your
dependencies and run the tests for your application. Creating a junit log file,
or clover coverage is often a nice bonus, as it gives you a nice graphical view
of your testing results:

.. code-block:: bash

    # Download Composer if it is missing.
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer | php
    # Install dependencies
    php composer.phar install
    vendor/bin/phpunit --log-junit junit.xml --coverage-clover clover.xml

If you use clover coverage, or the junit results, make sure to configure those
in Jenkins as well. Failing to configure those steps will mean you won't see the
results.

Run a Build
-----------

You should be able to run a build now. Check the console output and make any
necessary changes to get a passing build.

.. meta::
    :title lang=en: Testing
    :keywords lang=en: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
