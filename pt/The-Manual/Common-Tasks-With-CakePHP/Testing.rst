Testes
######

A partir da versão 1.2, o CakePHP passou a dar suporte a um intuitivo
framework de testes embutido dentro do próprio CakePHP. Este framework
de testes é uma extensão do SimpleTest para PHP. Esta seção irá discutir
como preparar para realização de testes e como criar e executar testes
em suas aplicações CakePHP.

Preparando para testar
======================

Pronto para começar a testar? Ótimo! Então vamos lá!

Instalando o SimpleTest
-----------------------

Instalando o SimpleTest

O framework de testes disponível com o CakePHP 1.2 foi construído com
base no framework de testes SimleTest. O SimpleTest não é
disponibilizado numa instalação padrão do CakePHP, então primeiramente
precisamos fazer obtê-lo. Você pode fazer o download do SimpleTest aqui:
`http://simpletest.sourceforge.net/ <http://simpletest.sourceforge.net/>`_.

Pegue a versão mais recente e descompacte o conteúdo para sua pasta
vendors, ou para app/vendors, dependendo de sua preferência. Agora então
deve haver um diretório vendors/simpletest dentro do qual estão todos os
arquivos e pastas do SimpleTest. Lembre-se de ter definido o nível de
DEBUG de sua aplicação pelo menos em 1 em seu arquivo
app/config/core.php antes de executar quaisquer testes!

Se você não tiver uma conexão de testes definida em seu
app/config/database.php, as tabelas de testes serão criadas com um
prefixo ``test_suite_`` no nome. Você pode criar uma conexão ``$test``
na sua base de dados para conter suas tabelas de testes com uma
configuração parecida com esta abaixo:

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

Se a base de dados test estiver disponível e se o CakePHP puder conectar
a ela, todas as tabelas de testes serão criadas nesta base de dados.

Executando casos de teste principais
------------------------------------

Os pacotes do CakePHP 1.2 não vêm com casos de testes principais do
núcleo do framework. Para obter estes testes você precisa fazer o
download do pacote do CakePHP disponibilizado diariamente (nightly)
disponível em
`https://cakephp.org/downloads/nightly/1.2.x.x <https://cakephp.org/downloads/nightly/1.2.x.x>`_
ou obtê-los dos fontes do Subversion, fazendo checkout do ramo 1.2.x.x
do repositório. (Para mais detalhes sobre como obter o CakePHP, veja
`/view/30/Getting-CakePHP <view/30/Getting-CakePHP>`_

Para adicionar os tests principais do CakePHP à sua aplicação,
descompacte o pacote diário (nightly) em algum local temporário.
Verifique a subpasta ``1.2.x.x_dd.mm.yyyy/cake/tests`` e copie-a
inteiramente para dentro da pasta ``/cake/tests`` de sua aplicação
CakePHP.

Feito isto, então os testes podem ser acessados via browser acessando-se
http://seu.dominio.cake/test.php - dependendo de sua instalação
específica do CakePHP. Tente executar um dos grupos de testes do núcleo
(Core Tests) clicando no link correspondente. Executr um grupo de testes
pode demorar um pouco, mas ao final você eventualmente deve ver algo
como "2/2 test cases complete: 49 passes, 0 fails and 0 exceptions.".

Parabéns, agora você está pronto para começar a escrever seus próprios
casos de testes para sua aplicação!

Visão geral sobre testes - Testes unitários e Testes funcionais (web)
=====================================================================

O framework de testes do CakePHP dá suporte a dos tipos de testes. Sejam
Testes Unitários, em que você testa pequenas partes de seu código, tais
como um método dentro de um componente ou uma action em um controller. O
outro tipo de testes suportado é o Teste Funcional (Web Test), em que
você automatiza o trabalho de testar sua aplicação navegando nas págnas,
preenchendo formulários, clicando em links e assim por diante.

Preparando dados de teste
=========================

Entendendo fixtures
-------------------

Ao testar código que depende de modelos e de dados, pode-se usar o que
chamamos de **fixtures** como uma forma de gerar dados temporários em
tabelas carregadas com dados de registros de exemplo que podem ser
usados apenas para teste. A vantagem de usar fixtures é que seu teste
não tem como corromper dados reais em produção. Além disso, você pode
começar a testar seu código antes carregar conteúdo de dados efetivos em
sua aplicação.

O CakePHP tenta usar a conexão ``$test`` definida em seu arquivo de
configuração app/config/database.php. Se esta conexão não existir ou não
for possível usá-la, a conexão ``$default`` será então utilizada. Neste
caso, o CakePHP adicionará "test\_suite\_" como prefixo de suas próprias
tabelas para evitar colisão com de nomes com tabelas existentes.

Durante o curso de um caso de testes baseado em fixtures, o CakePHP
realiza os seguintes passos:

#. Cria tabelas para cada um dos fixtures necessários
#. Popula as tabelas com dados, se houver dados definidos no fixture
#. Executa os métodos de teste
#. Empties the fixture tables
#. Remove as tabelas de fixtures da base de dados

Criando fixtures
----------------

Para criar um fixture, você vai definir principalmente duas coisas: como
a tabela é criada (quas campos são parte da tabela) e quais registros de
testes serão inicialmente populados nas tabelas. Vamos então criar nosso
primeiro fixture, que será usado para testar nosso model Article. Crie
um arquivo chamado **article\_fixture.php** em seu diretório
**app/tests/fixtures** com o seguinte conteúdo:

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'title' => 'Primeiro artigo', 'body' => 'Texto do primeiro artigo', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => 'Segundo artigo', 'body' => 'Texto do segundo artigo', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => 'Terceiro artigo', 'body' => 'Texto do terceiro artigo', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 
     ?> 

Usamos o atribut $fields para especificar quais campos serão parte desta
tabela e como são definidos. O formato usado para definir estes campos é
o mesmo usado pela função **generateColumnSchema()** definida nas
classes do mecanismo de base de dados do Cake (por exemplo, no arquivo
dbo\_mysql.php). Vejamos os atributos disponíveis que um campo pode
levar e seus significados:

type
    tipo de dados interno do CakePHP. Atulmente são suportdos: string
    (mapeia para VARCHAR), text (mapeia para TEXT), integer (mapeia para
    INT), float (mapeia para FLOAT), datetime (mapeia para DATETIME),
    timestamp (mapeia para TIMESTAMP), time (mapeia para TIME), date
    (mapeia para DATE) e binary (mapeia para BLOB)
key
    defina como "primary" para fazer o campo como AUTO\_INCREMENT e seja
    a PRIMARY KEY da tabela.
length
    define o comprimento específico que o campo deve ter.
null
    atribua true (para dizer que o campo pode conter valores NULL) ou
    false (se o campo dever ser NOT NULL)
default
    o valor padrão que o campo deve ter se nada for informado.

Por último podemos definir um conjunto de registros que serão populador
depois que a tabela de teste for criada. O formato para definição de
registros é bastante intuitivo e não precisa de muita explicação. Apenas
tenha em mente que cada registro no array $records deve ter um índice
para **cada um dos campos** especificados no array $fields. Se um campo
em um dado registro precisar assumir um valor NULL, defina
explicitamente o campo específico como índice e seu valor como NULL.

Importando definições e registros das tabelas
---------------------------------------------

Sua aplicação pode já ter models funcionando com dados reais associados
a eles e você pode decidir testar seus models com tais dados. Seria um
grande retrabalho ter de replicar a definição da tabela e/ou os
registros presentes para seus fixtures. Felizmente, é possível fazer com
que a definição de tabelas e/ou os registros presentes sejam utilizados
por um dado fixture a partir de um model exstente ou mesmo a partir
diretamente das tabelas no banco de dados.
Vamos começar com um exemplo. Considerando que você já tenha um model
chamado Article disponível em sua aplicação (referente à tabela no banco
chamada articles), modifique o fixture criado na seção anterior
(**app/tests/fixtures/article\_fixture.php**) para:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

Esta declaração indica que a suíte de testes deve importar a definição
de tabela a partir da tabela que está linkada ao model chamado Article.
Você pode usar qualquer model disponível em sua aplicação. A declaração
acima não vai importar os registros presentes na tabela, mas se quiser,
você pode importar também os dados da tabela alterando o fixture:

::

    <?php   
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

Se por outro lado você já tiver uma tabela criada mas sem o respectivo
model para ela, você pode então fazer com que que as informações sejam
importadas diretamente da tabela. Por exemplo:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

Isto irá importar a definição de tabela para o fixture a partir de uma
tabela chamada 'articles' usando a conexão 'default' do CakePHP. Se você
quiser trocar a conexão a ser utilizada, você pode faze:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'other'); 
       } 
       ?> 

Como é usada a conexão da base de dados do CakePHP, caso haja algum
prefixo de tabela ele será usado automaticamente quando as informações
forem lidas da tabela. Os dois exemplos de código mostrados acima não
importam os registros da tabela. Para forçar que o fixture importe
também os registros de dados, modifique-o para:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

Você também pode importar suas definições de tabelas a partir de um
model ou de uma tabela existentes mas tendo seus registros definidos
diretamente no fixture tal como visto na seção anterior. Por exemplo:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'title' => 'Primeiro artigo', 'body' => 'Texto do primeiro artigo', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'title' => 'Segundo artigo', 'body' => 'Texto do segundo artigo', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'title' => 'Terceiro artigo', 'body' => 'Texto do terceiro artigo', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
              ); 
       } 
     ?> 

Criando testes
==============

Primeiro, vamos conferir o conjunto de regras ou orientações
relacionadas a testes:

#. Os arquivos PHP contendo testes devem ficar em
   **app/tests/cases/[alguma\_pasta]**.
#. Os nomes dos arquivos de teste devem terminar em **.test.php** ao
   invés de apenas em .php.
#. As classes contendo testes deve estender de **CakeTestCase** ou de
   **CakeWebTestCase**.
#. O nome de qualquer método contendo um teste (quer dizer, contendo
   asserções) devem começar com **test**, como por exemplo
   **testPublished()**.

Quando você criar um caso de teste, você pode executá-lo navegando até
**http://your.cake.domain/cake\_folder/test.php** (dependendo de como
esteja sua instalação), clicando em casos de teste da aplicação (App
Test Cases) e então clicando no link de seu arquivo especifico.

Métodos de Callback do CakeTestCase
-----------------------------------

Se você quiser definir alguma lógica logo antes ou depois de um método
individual do CakeTestCase, ou mesmo antes ou depois de seu CakeTestCase
todo, os seguintes callbacks estão disponíveis:

**start()**
 Primeiro método chamado em um *caso de teste*.

**end()**
 Último método chamado em um *caso de teste*.

**startCase()**
 Chamado logo antes de um *caso de teste* ser iniciado.

**endCase()**
 Chamado logo depois que um *caso de teste* tenha sido executado.

**before($method)**
 Anuncia o início de um *caso de teste*.

**after($method)**
 Anuncia o final de um *caso de teste*.

**startTest($method)**
 Chamado logo antes que um *método de teste* seja executado.

**endTest($method)**
 Chamado logo depois que um *método de teste* tenha terminado.

Testando models
===============

Criando um caso de teste
------------------------

Digamos que já temos nosso model Article definido em
app/models/article.php, parecido com isto:

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $conditions = array( 
                      $this->name . '.published' => 1 
                  ); 
                   
                  return $this->findAll($conditions, $fields); 
              } 
       } 
     ?> 

Agora queremos configurar um teste que iremos usar para este model, mas
através de fixtures, para testar alguma funcionalidade no model. A suíte
de teste do CakePHP carrega um conjunto mínimo de arquivos (para manter
os testes isolados), assim temos de começar carregando o model em
questão a ser testado (neste caso, o model Article) e então informar a
suíte de teste que queremos testar este model especificando que
configuração de banco de dados deve ser usada. A suíte de teste do
CakePHP habilita uma configuração de banco de dados chamada
**test\_suite** que é usada por todos os models que dependem de
fixtures. Definir $useDbConfig para esta configuração fará com que o
CakePHP saiba que este model usa a conexão de banco de dados da suíte de
teste.
Como queremos reutilizar todo o código de nosso model existente, vamos
criar um model de teste que estenda de Article, definindo $useDbConfig e
$name apropriadamente. Agora crie um arquivo chamado
**article.test.php** em seu diretório **app/tests/cases/models**, com o
seguinte conteúdo:

::

     <?php  
       App::import('Model','Article'); 

       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

Criamos assim o ArticleTestCase. Na veriável **$fixtures**, definimos o
conjunto de fixtures que iremos usar.

Se seu model estiver associado com outros models, você precisará incluir
**TODOS** os fixtures para cada model associado, mesmo se você não for
utilzá-los. Por exemplo: dados os models A, B, C e D, se tivermos os
relacionamentos que A hasMany B, B hasMany C e C hasMany D, ao criar um
caso de teste ATestCase, você terá que incluir fixtures para os models
A, B, C e D.

Criando um método de teste
--------------------------

Vamos agora adicionar um método para testar a função published() no
model Article. Edite o arquivo
**app/tests/cases/models/article.test.php** deixando-o para algo como o
mostrado abaixo:

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article = ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => 'Primeiro artigo' )),
                    array('Article' => array( 'id' => 2, 'title' => 'Segundo artigo' )),
                    array('Article' => array( 'id' => 3, 'title' => 'Terceiro artigo' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    

Como você pode ver, adicionamos um método chamado **testPublished()** ao
nosso caso de teste. Começamos criando uma instância de nosso fixture
baseada no model **Article**, e então executamos nosso método
**published()**. Atribuímos à **$expected** aquilo que esperamos ser o
resultado correto (que já sabemos, uma vez que nós mesmos definimos
quais registros são inicialmente populados na tabela articles). Então
verificamos se o resultado é igual a o que esperamos com uma chamada ao
método **assertEqual**. Veja a seção `Criando
testes </pt/view/362/Creating-tests>`_ para informações sobre como
executar os testes.

Testando controllers
====================

Criando um caso de teste
------------------------

Digamos que você tenha um típico ArticlesController, com seu model
correspondente, como algo parecido com isto:

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>

Crie um arquivo chamado articles\_controller.test.php no seu diretório
app/tests/cases/controllers com o seguinte código:

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Iniciando Caso de Teste</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Terminando Caso de Teste</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>Iniciando método ' . $method . '</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => 'Novo Artigo', 'body' => 'Novo Texto de Artigo')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 

O método testAction
-------------------

A novidade agora é o método **testAction**. O primeiro argumento deste
método é a url (no formato do Cake) do controller e da action a ser
testada, como em '/articles/index/short'.

O segundo argumento é um array de parâmetros, contendo:

return
    defina para o que você quer retornar.
     Valores válidos são:

    -  'vars' - Devolve os valores das variáveis da view (view vars)
       atribuídas após da execução da action
    -  'view' - Devolve o conteúdo da view renderizada em si, sem o
       layout
    -  'contents' - Devolve o conteúdo html completo da view, incluindo
       o layout
    -  'result' - Devolve o valor retornado quando a action utiliza
       $this->params['requested'].

    O default é 'result'.
fixturize
    defina como true se você quiser que seus models sejam
    autofixturizados (ou seja, que as tabelas de sua aplicação sejam
    copiadas juntamente com seus dados, para testar tabelas; assim se
    você modificar seus dados eles não irão afetar sua aplicação real).
    Se você definir 'fixturize' para um array de models, apenas os
    models discriminados serão autofixturizados enquanto que os demais
    continuarão usando dados das tabelas reais. Entretanto, se você
    quiser usar seus arquivos de fixtures com o método testAction()
    então não utilize este recurso de fixturize. Ao invés disso, apenas
    utilize fixtures como você faria normalmente.
method
    atribua para 'post' ou 'get' informando como você quer passar os
    dados para o controller
data
    os dados a serem passados. Defina-o como um array associativo
    contendo pares campo => valor. Dê uma olhada no método
    ``function testIndexPostFixturized()`` no caso de teste acima para
    ver como emulamos dados do formulário para submissão de um novo
    artigo.

Problemas conhecidos
--------------------

Se você usar testAction para testar um método que faça um redirect em um
controller, seu teste irá encerrar imediatamente sem sequem mostrar
nenhum resultado.
Veja
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
para uma possível correção.

Testando helpers
================

Como classes de Helper também contém uma considerável quantidade de
códgo, é importante ter certeza de que elas também estejam cobertas por
casos de testes.

O teste de helpers é um pouco semelhante à abordagem para componentes.
Suponha que temos um helper chamado CurrencyRendererHelper localizado em
``app/views/helpers/currency_renderer.php`` com seu respectivo arquivo
de caso de teste em
``app/tests/cases/helpers/currency_renderer.test.php``

Criando testes de helper, parte I
---------------------------------

Antes de mais nada, nós vamos definir as responsabilidades de nosso
CurrencyRendererHelper. Basicamente, este helper terá dois métodos
apenas para fins de demonstração:

function usd($amount)

Este método irá receber o total a renderizar. Ele leva 2 casa decimais,
preenchendo espaços vazios com zeros e incluindo o prefixo 'USD'.

function euro($amount)

Este método fará o mesmo que o usd() exceto que o prefixo incluído na
saída será 'EUR'. Só para deixar as cosas um pouco mais complexas,
também vamos exibir o resultado dentro de uma tag span:

::

    <span class="euro"></span> 

Vamos criar os testes primeiro:

::

    <?php

    // Importa o helper a ser testado.
    // Se o helper testado estiver usando outros helpers, como Html, 
    // estes também devem ser importados nesta linha e inicializados em startTest().
    App::import('Helper', 'CurrencyRenderer');

    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;

        // Aqui instanciamos nosso helper, bem como todos os outros helpers que precisarmos.
        public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }

        // testando o método usd().
        public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            // Devemos sempre ter 2 casas decimais.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            // Testando o separador de milhar.
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }

Aqui, chamamos ``usd()`` com diferentes parâmetros e dizemos para a
suíte de testes checar se os valores retornados são iguais aos
esperados.

Executar o teste agora irá resultar em erros (já que o
currencyRendererHelper nem sequer existe ainda), mostrando que temos 3
falhas.

Uma vez que saibamos o que nosso método deve fazer, podemos escrever o
método propriamente dito:

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Aqui definimos a quantidade de casas decimais como sendo 2, o separador
decimal sendo o ponto, o separador de milhar como a vírgula e o prefixo
do número formatado como a string 'USD'.

Salve este código em app/views/helpers/currency\_renderer.php e então
execute o teste. Você deve ver uma barra verde e uma mensagem indicando
4 itens que passaram.

Testando componentes
====================

Suponha que queremos testar um componente chamado TransporterComponent,
o qual utiliza um model chamado Transporter para prover funcionalidade a
outros controllers. Neste cenário, vamos usar quatro arquivos:

-  Um componente chamado Transporters encontrado em
   **app/controllers/components/transporter.php**
-  Um model chamado Transporter encontrado em
   **app/models/transporter.php**
-  Um fixture chamado TransporterTestFixture encontrado em
   **app/tests/fixtures/transporter\_fixture.php**
-  O código de teste, em **app/tests/cases/transporter.test.php**

Inicializando o componente
--------------------------

Como o `CakePHP não recomenda importar models diretamente dentro de
componentes </pt/view/62/components>`_, nós precisamos de um controller
para acessar os dados no model.

Se o método startup() do componente for parecido com isto:

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }

...então nós podemos criar uma classe falsa bem simples:

::

    class FakeTransporterController {} 

...e associar valores nela dessa forma:

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 

Criando um método de teste
--------------------------

Apenas crie uma classe que estenda CakeTestCase e comece a escrever seus
testes!

::

    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');  
        function testGetTransporter() { 
              $this->TransporterComponentTest = new TransporterComponent(); 
              $controller = new FakeTransporterController(); 
              $controller->Transporter = new TransporterTest(); 
              $this->TransporterComponentTest->startup(&$controller); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden"); 
              $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx"); 
               
              $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden"); 
              $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden"); 
              $this->assertEqual($result, 3, "GL is best for 410xx-419xx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway"); 
              $this->assertEqual($result, 0, "Noone can service Norway");         
       }
    }
     

Web testing - Testando views
============================

A maior parte dos (se não todos os) projetos em CakePHP resultam em uma
aplicação web. Ainda que testes unitários sejam uma forma excelente de
testar partes pequenas de funcionaidade, você também pode querer testar
a funcionalidade em larga escala. A classe **CakeWebTestCase**
representa uma boa maneira de fazer testes a partir do ponto de vista de
um usuário da aplicação.

Sobre a CakeWebTestCase
-----------------------

**CakeWebTestCase** é uma extensão direta da classe WebTestCase do
SimpleTest, sem qualquer funcionalidade extra. Toda a funcionalidade
encontrada na `documentação do SimpleTest para testes
Web <http://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
também está disponível. Isto também significa que nenhuma funcionalidade
além das presentes no SimpleTest está disponível. Isso quer dizer que
você não pode usar fixtures, e que **todos os casos de teste que
envolvam atualizar/inserir registros na base de dados irá modificar
permanentemente os registros em sua base de dados**. Os resultados dos
testes quase sempre serão baseados nos valores presentes na base de
dados, então uma etapa para certificar-se de que sua base de dados
contenha os valores que você espera faz parte de seu procedimento de
teste.

Criando um teste
----------------

Para se ater às prévias convenções de testes, você deve criar seus
testes de views na pasta tests/cases/views. Obviamente você pode colocar
estes testes em qualquer lugar, mas seguir as convenções sempre que
possível é sempre uma boa ideia. Então vamos criar o arquivo
tests/cases/views/complete\_web.test.php

Primeiramente, quando você quiser criar testes web, você deve se lembrar
de estender **CakeWebTestCase** ao invés de CakeTestCase:

::

    class CompleteWebTestCase extends CakeWebTestCase

Se você precisar de algum preparativo antes de iniciar o teste, crie um
construtor:

::

    function CompleteWebTestCase(){
      // Seus preparativos iniciais aqui
    }

Para escrever casos para testes web, a primeira coisa que você precisa
fazer é obter alguma saída à qual analisar. Isto pode ser feito com uma
requisição **get** ou **post**, usando-se os métodos **get()** ou
**post()**, respectivamente. Ambos métodos recebem uma url completa como
primeiro parâmetro. Esta url pode ser obtida dinamicamente. Neste caso,
supondo que o script de teste esteja localizado em
http://seu.dominio/cake/pasta/webroot/test.php , poder-se-ia obter esta
url com:

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));

Você pode, então, fazer requisições gets e posts usando urls no formato
do Cake, como por exemplo:

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);

O segundo parâmetro para o método post, **$data**, é um array
associativo contendo os dados para a requisição no formato do Cake:

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");

Quando você tiver requisitado a página, você pode fazer diversos tipos
de asserções com ela, usando os métodos disponíveis por padrão no
próprio SimpleTest.

Navegando-se por uma página
---------------------------

A classe CakeWebTest também permite navegar-se por uma página, clicando
em links ou imagens, preenchendo formulários e clicando em botões. Por
favor, confira a `documentação do
SimpleTest <http://www.simpletest.org/en/web_tester_documentation.html#navigation>`_
para mais informações sobre isto.

Testando plugins
================

Testes para plugins são criados em seu próprio diretório dentro da pasta
plugins.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

Testes para plugins são como testes normais, exceto que você deve se
lembrar de usar a convenção de nomenclatura para plugins ao importar as
classes. Este é um exemplo de um caso de teste para o model PizzaOrder
criado `no capítulo de plugins </pt/view/117/Plugin-Models>`_ deste
manual. Uma diferença para os outros testes é a primeira linha que faz a
importação de 'Pizza.PizzaOrder'. Você também precisa prefixar os
fixtures de seu plugin com '``plugin.plugin_name.``\ '.

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');

    class PizzaOrderCase extends CakeTestCase {

        // Fixtures de plugin localizados em /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;
        
        function testSomething() {
            // ClassRegistry faz com que o model use a conexão de teste da base de dados
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');

            // faz algum teste útil aqui
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>

Se você quiser usar o fixtures de plugin nos testes da aplicação, você
pode referenciá-los usando a sintaxe 'plugin.pluginName.fixtureName' no
array $fixtures.

E isso é tudo!

Miscelânea
==========

Personalizando o relatório de testes
------------------------------------

O relatório de testes padrão é **muito** minimalista. Se você quiser uma
saída mais elaborada para impressionar alguém, não tema. Atualmente é
muito fácil estender a saída do relatório de testes do CakePHP.
O único risco é que você vai precisar dispender mais tempo com o código
do núcleo do Cake, especificamente o
**/cake/tests/libs/cake\_reporter.php**.

Para modificar a saída dos testes você pode sobrescrever os seguintes
métodos:

paintHeader()
    Exibe conteúdo antes do teste ser iniciado.
paintPass()
    Exibe conteúdo a cada caso de teste que passe. Utilize
    $this->getTestList() para obter um array de informações pertinentes
    ao teste, e $message para obter o resultado do teste. Lembre-se de
    fazer uma chamada a parent::paintPass($message).
paintFail()
    Exibe conteúdo a cada caso de teste que falhe. Lembre-se de fazer
    uma chamada a parent::paintFail($message).
paintFooter()
    Exibe conteúdo quando o texte tiver terminado, i.e., quando todos os
    casos de teste tiverem sido executados.

Se, ao chamar paintPass e paintFail, você quiser esconder a saída um
nível acima, faça a chamada dentro de tags html de comentário, como em:

::

    echo "\n<!-- ";
    parent::paintFail($message);
    echo " -->\n";

Uma configuração de exemplo de **cake\_reporter.php** que cria uma
tabela para armazenar os resultados dos testes poderia ser a seguinte:

::

    <?php
     /**
     * CakePHP(tm) Tests <https://trac.cakephp.org/wiki/Developement/TestSuite>
     * Copyright 2005-2008, Cake Software Foundation, Inc.
     *                              1785 E. Sahara Avenue, Suite 490-204
     *                              Las Vegas, Nevada 89104
     *
     *  Licensed under The Open Group Test Suite License
     *  Redistributions of files must retain the above copyright notice.
     */
     class CakeHtmlReporter extends HtmlReporter {
     function CakeHtmlReporter($characterSet = 'UTF-8') {
     parent::HtmlReporter($characterSet);
     }
     
    function paintHeader($testName) {
      $this->sendNoCacheHeaders();
      $baseUrl = BASE;
      print "<h2>$testName</h2>\n";
      print "<table style=\"\"><th>Res.</th><th>Test case</th><th>Message</th>\n";
      flush();
     }

     function paintFooter($testName) {
       $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
       print "</table>\n";
       print "<div style=\"";
       print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
       print "\">";
       print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
       print " test cases complete:\n";
       print "<strong>" . $this->getPassCount() . "</strong> passes, ";
       print "<strong>" . $this->getFailCount() . "</strong> fails and ";
       print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
       print "</div>\n";
     }

     function paintPass($message) {
       parent::paintPass($message);
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden;                  border-right: hidden\">\n";
       print "\t\t<span style=\"color: green;\">Pass</span>: \n";
       echo "\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       array_shift($breadcrumb);
       array_shift($breadcrumb);
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $message = split('at \[', $message);
       print "-&gt;$message[0]<br />\n\n";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function paintFail($message) {
       echo "\n<!-- ";
       parent::paintFail($message);
       echo " -->\n";
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "\t\t<span style=\"color: red;\">Fail</span>: \n";
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "$message";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function _getCss() {
       return parent::_getCss() . ' .pass { color: green; }';
     }
     
     }
     ?>

Agrupando testes
----------------

Se você quiser que vários de seus testes sejam executados ao mesmo
tempo, você pode tentar criar um grupo de testes. Crie um arquivo em
**/app/tests/groups/** e dê-lhe um nome como
**nome\_de\_seu\_grupo\_de\_teste.group.php**. Neste arquivo, estenda a
classe **GroupTest** e importe seus testes como se segue:

::

    <?php 
    class TryGroupTest extends GroupTest { 
      var $label = 'try'; 
      function tryGroupTest() { 
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models'); 
      } 
    } 
    ?> 

O código acima irá agrupar todos os casos de teste encontrados na pasta
**/app/tests/cases/models/**. Para adicionar um arquivo individual,
utilize **TestManager::addTestFile**\ ($this, filename).

Executando os testes a partir da linha de comandos
==================================================

Se você tiver o SimpleTest instalado, você pode executar seus testes em
sua aplicação a partir da linha de comando.

no diretório **app/**, digite

::

    cake testsuite help

::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix

    Examples: 
            cake testsuite app all
            cake testsuite core all

            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller

            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set

            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket

            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'

    Code Coverage Analysis: 


    Append 'cov' to any of the above in order to enable code coverage analysis

Como o menu de ajuda sugere, você será capaz de executar todos os
testes, apenas um subconjunto deles ou até um único caso de teste de sua
aplicação, de seu plugin ou do core, direto da linha de comando.

Se você tiver um teste de model em **test/models/meu\_model.test.php**,
para executar apenas este caso de teste você poderia digitar o seguinte
na linha de comando:

::

    cake testsuite app models/meu_model

