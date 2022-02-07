Configuração
############

Configurar uma aplicação CakePHP é muito fácil! Depois de ter instalado
o CakePHP, para criar uma aplicação web básica é necessário apenas que
você defina uma configuração de banco de dados.

Existem, entretanto, outros passos opcionais de configuração que você
pode fazer para aproveitar ainda mais a arquitetura flexível do CakePHP.
Você pode facilmente adicionar funcionalidades inerentes ao núcleo do
CakePHP, configurar novos e/ou diferentes mapeamentos de URL (rotas) ou
ainda definir novas e/ou diferentes inflexões para seu idioma.

Configuração da base de dados
=============================

O CakePHP espera que os detalhes de configuração da base de dados
estejam no arquivo app/config/database.php. Um exemplo de configuração
da base de dados pode ser encontrado em app/config/database.php.default.
No final da configuração você deve ver algo assim:

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'my_cakephp_project',
                         'prefix'      => '');

A conexão $default é usada a menos que outra configuração seja
especificada pela propriedade $useDbConfig em um modelo. Por exemplo, se
minha aplicação tiver uma base de dados adicional do legacy além do
padrão, eu poderia usá-la em meus modelos criando uma nova conexão da
base de dados de $legacy similar a configuração $default, e ajustando a
var $useDbConfig = ‘legacy’; nos modelos apropriados.

Preencha corretamente os pares de chave/valor na configuração para
atender melhor às suas necessidades.

+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Chave                 | Valor                                                                                                                                                                                                                                                                                              |
+=======================+====================================================================================================================================================================================================================================================================================================+
| driver                | O nome do driver da base de dados para esta configuração. Exemplos: mysql, postgres, sqlite, pear-drivername, adodb-drivername, mssql, oracle, ou odbc. Note que para datasources que não são de database (ex.: LDAP, Twitter) este campo deve ficar em branco e preencher o campo "datasource".   |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| persistent            | Se usará ou não uma conexão persistente com a base de dados.                                                                                                                                                                                                                                       |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| host                  | O nome do servidor da base de dados (ou endereço IP).                                                                                                                                                                                                                                              |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| login                 | O usuário desta conta.                                                                                                                                                                                                                                                                             |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| password              | A senha desta conta.                                                                                                                                                                                                                                                                               |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| database              | O nome da base de dados que esta conexão irá usar.                                                                                                                                                                                                                                                 |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefix (*opcional*)   | Esta string será adicionada como prefixo no nome de todas tabelas de sua base de dados. Se suas tabelas não possuem prefixo, deixe esta string vazia.                                                                                                                                              |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| port (*opcional*)     | A porta TCP ou socket Unix usado para conectar com o servidor.                                                                                                                                                                                                                                     |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| encoding              | Indica qual caractere definido será usado para enviar indicações SQL ao servidor. Este padrão é o padrão para todas as bases de dados que não sejam DB2. Se você deseja usar UTF-8 com mysql/mysqli, você deve usar 'utf' sem aspas.                                                               |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| schema                | Usado em instalações de base de dados PostgreSQL para especificar qual schema usar.                                                                                                                                                                                                                |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| datasource            | Datasources que não usam banco de dados, ex. 'ldap', 'twitter'                                                                                                                                                                                                                                     |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Note que as configurações de prefixo são para as tabelas, **não** para
os modelos. Por exemplo, se você criou um relacionamento entre as
tabelas Apple e Flavor, o nome será prefixo\_apples\_flavors (**não**
prefixo\_apples\_prefixo\_flavors), isso se sua opção de prefixo estiver
como 'prefixo\_'.

A partir deste ponto, você deve dar uma olhada nas `Convenções
CakePHP </pt/view/22/cakephp-conventions>`_. A nomenclatura correta para
suas tabelas (e o nome de algumas colunas) pode livrar de algumas
implementações e configurações desnecessárias. Por exemplo, se você
nomear uma tabela como big\_boxes, sua classe de model como BigBox e seu
controller como BigBoxesController, tudo isso já estará funcionando
automaticamente. Por convenção, utilize caracteres underscore, letras em
minúsculas e nomes no plural para as tabelas de sua base de dados - por
exemplo: bakers, pastry\_stores e savory\_cakes.
**N.T.:** Em inglês, substantivos compostos mantêm a flexão no plural
sempre na última palavra (p.ex., savory\_cakes). O CakePHP por padrão
reconhece esta regra. Já em português, os substantivos compostos quase
sempre flexionam todas as palavras (p.ex., bolos\_salgados). Assim,
atente que para seguir estritamente as convenções do CakePHP de forma
natural em português, pode ser necessária alguma modificação nas
inflexões de sua aplicação.

Core Configuration
==================

A configuração da aplicação no CakePHP é encontrada no arquivo
/app/config/core.php. Este arquivo é uma coleção de definições de
variáveis e constantes da classe Configure, que determinam como sua
aplicação se comporta. Antes de mergulharmos nessas variáveis em
particular, você precisará familiarizar-se com o "Configure", a classe
registrada de configuração do CakePHP.

A Classe Configuration
======================

Ainda que poucas coisas precisem ser configuradas no CakePHP, às vezes é
útil ter suas próprias regras de configuração para sua aplicação. No
passado você definia valores de configuração customizados definindo
variáveis ou constantes em alguns arquivos. Fazendo assim, você era
forçado a incluir esse arquivo de configuração cada vez que precisasse
usar aqueles valores.

A nova classe "Configure" do CakePHP pode ser usada para armazenar e
retornar valores específicos da aplicação ou execução. Mas tenha
cuidado! Esta classe permite que você armazene qualquer coisa para ser
usada em outra parte do seu código: uma grande tentação para quebrar o
padrão MVC para o qual o CakePHP foi projetado. O objetivo principal da
classe Configure é manter centralizadas variáveis que podem ser
partilhadas entre vários objetos. Se lembre de usar o lema "convenção e
não configuração", e você não correrá o risco de quebrar a estrutura MVC
que construímos.

Esta classe possui apenas uma instância e seus métodos podem ser
chamados de qualquer parte dentro de sua aplicação, num contexto
estático.

::

    <?php Configure::read('debug'); ?>

Métodos de configuração
-----------------------

write
~~~~~

``write(string $key, mixed $value)``

Use ``write()`` para armazenar dados na configuração da aplicação.

::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

o uso do ponto no parâmetro ``$key``. Você pode usar essa notação para
organizar sua configuração dentro dos grupos lógicos.

O exemplo acima poderia também ser escrito em uma única chamada:

::

    Configure::write(
        'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')
    );

Você pode usar ``Configure::write('debug', $int)`` para alternar entre
modos de produção e compilação no fly. Isso é recomendado especialmente
para interações com AMF ou SOAP onde a informação do compilador pode
causar problemas de sintaxe.

read
~~~~

``read(string $key = 'debug')``

Usado para ler dados de configurações da aplicação. O padrão para
CakePHP é o importante valor *debug*. Se *key* é fornecido, o dado é
retornado. Usando nosso exemplo do write() acima, nós podemos ler o dado
de volta:

::

    Configure::read('Company.name');    //retorno: 'Pizza, Inc.'
    Configure::read('Company.slogan');  //retorno: 'Pizza for your body and soul'
     
    Configure::read('Company');
     
    //retorno: 
    array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

delete
~~~~~~

``delete(string $key)``

Utilizado para apagar informações de configuração do aplicativo.

::

    Configure::delete('Company.name');

load
~~~~

``load(string $path)``

Utilize este método para carregar informações de configuração de um
arquivo específico.

::

    // /app/config/messages.php:
    <?php
    $config['Company']['name'] = 'Pizza, Inc.';
    $config['Company']['slogan'] = 'Pizza for your body and soul';
    $config['Company']['phone'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Company.name');
    ?>

Cada configuração chave-valor é representada no arquivo com o array
``$config``. Quaisquer outras variáveis serão ignoradas pela função
``load()``.

version
~~~~~~~

``version()``

Retorna a versão do CakePHP para a aplicação corrente.

Variáveis de Configuração do Núcleo (Core) do CakePHP
-----------------------------------------------------

A classe Configure é usada para gerenciar um conjunto de variáveis de
configuração do núcleo(core) do CakePHP. Estas variáveis podem ser
encontradas em app/config/core.php. Abaixo está uma descrição de cada
variável e como ela afeta sua aplicação CakePHP.

Variável Configure

Descrição

debug

Muda a saída do depuração (debug) do CakePHP.
 0 = Modo Produção. Sem saídas.
 1 = Mostrar erros e avisos.
 2 = Mostrar error, avisos, e SQL.
 3 = Mostrar error, avisos, SQL, e dump completo do controlador.

App.baseUrl

Retire o comentário desta definição se você **não** planeja usar o
mod\_rewrite do Apache com CakePHP. Não esqueça de remover seus arquivos
.htaccess também.

Routing.admin

Retire o comentário desta definição se você gostaria de tirar vantagem
das rotas administrativas (admin routes) do CakePHP. Atribua esta
variável com o nome da rota administrativa (admin route) que você
gostaria de usar. Mais sobre isto depois.

Cache.disable

Quando atribuido para verdadeiro (true), o modo "caching" é desabilitado
em todo site (site-wide).

Cache.check

Se atribuido para verdadeiro (true), habilita "caching" na visão (view
caching). A habilitação é ainda necessária nos controladores, mas esta
variável habilita a detecção destas configurações.

Session.save

Diz ao CakePHP qual mecanismo de armazenamento de sessão usar.


Cache::config(). Muito útil em conjunto com Memcache (em instalações com
multiplos servidores de aplicação) para armazenar ambos dados em
cache(cached data) e sessões.


Tenha certeza de criar a tabela usando o arquivo SQL localizado em
/app/config/sql/sessions.sql.

Session.table

O nome da tabela (não incluindo nenhum prefixo) que armazenará a
informação de sessão.

Session.database

O nome do banco de dados que armazenará a informação de sessão.

Session.cookie

O nome do cookie usado para rastrear sessões.

Session.timeout

Tempo de expiração de sessão em segundos. O valor real depende do nível
de Segurança (Security.level).

Session.start

Inicia sessão automaticamente quando atribuido para verdadeiro (true).

Session.checkAgent

Quando atribuido para falso (false),sessões do CakePHP não irão
verificar para garantir que o agente usuário não mudou entre as
requisições.

Security.level

O nível de segurança do CakePHP. O Tempo de expiração de sessão definido
em 'Session.timeout' é multiplicado de acordo com as configurações aqui
presentes.

 'high' = x 10
 'medium' = x 100
 'low' = x 300

`session.referer\_check <https://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_

nível de segurança ('Security.level') é atribuido para alto ('high').

Security.salt

Uma cadeia de caracteres aleatória usada no hashing de segurança
(security hashing).

Asset.timestamp

Acrescenta um timestamp no final dos arquivos da url (CSS, JavaScript,
Imagem) que é o horário da última modificação do arquivo em específico.

Valores válidos:
 (bool) false - Não faça nada (padrão)
 (bool) true - Coloca o timestamp apenas quando debug > 0
 (string) 'force' - Coloca o timestamp sempre (debug >= 0)

Acl.classname, Acl.database

Constantes usadas para a funcionalidade lista de Controle de Acesso
(Access Control List) do CakePHP. Veja o capítulo Listas de Controle de
Acesso (Access Control Lists) para mais informações.

Configuração de Cache é também encontrada em core.php — Nós estaremos
abordando isto depois, logo fique atento.

A Classe Configure pode ser usada para ler e escrever itens de
configurações do núcleo (core) em execução (on the fly). Isto pode ser
especialmente útil se você quiser ativar o modo de depuração (debug)
para uma seção limitada da lógica de sua aplicação, por exemplo.

Configuration Constants
-----------------------

Enquanto muitas opções de configurações são manipuladas por *Configure*,
existem algumas constantes que CakePHP usa durante o tempo de execução.

+--------------+----------------------------------------------------------------------------------------------------------+
| Constante    | Descrição                                                                                                |
+==============+==========================================================================================================+
| LOG\_ERROR   | Constante de erro. Usada para diferenciar log e depuração de erros. Atualmente PHP suporta LOG\_DEBUG.   |
+--------------+----------------------------------------------------------------------------------------------------------+

A classe App
============

Carregar classes adicionais ficou mais racional no CakePHP. Nas versões
anteriores haviam funções diferentes para carregar uma classe necessária
baseada no tipo da classe que você queria carregar. Essas funcões foram
descontinuadas, todo carregamento de classes e bibliotecas agora deve
ser feito através do App::import(). App::import() assegura que a classe
foi carregada somente uma vez, que a classe pai apropriada foi carregada
e resolve caminhos automaticamente na maioria dos casos.

Usando App::import()
--------------------

``App::import($type, $name, $parent, $search, $file, $return);``

À primeira vista ``App::import`` parece complexo, entretanto, na maioria
dos casos, apenas 2 argumentos são necessários.

Importando Core Libs
--------------------

Bibliotecas do Core como Sanitize e Xml podem ser carregadas assim:

::

    App::import('Core', 'Sanitize');

O código acima tornaria a classe Sanitize disponível para uso.

Importando Controladores, Modelos, Componentes, Comportamentos (Behaviors), e Ajudantes (Helpers)
-------------------------------------------------------------------------------------------------

Todas as classes relacionadas a aplicação devem também ser carregadas
com o App::import(). Os seguintes exemplos ilustram como fazer isto.

Carregando Controllers
~~~~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MyController');``

Chamar ``App::import`` é equivalente a fazer ``require`` do arquivo. É
importante perceber que a classe precisa ser inicializada
posteriormente.

::

    <?php
    // O mesmo que require('controllers/users_controller.php');
    App::import('Controller', 'Users');

    // Precisamos carregar a classe
    $Users = new UsersController;

    // Se nós precisarmos que associação de models, componentes e etc, sejam carregadas
    $Users->constructClasses();
    ?>

Carregando Models
~~~~~~~~~~~~~~~~~

``App::import('Model', 'MyModel');``

Carregando Components
~~~~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

Carregando Behaviors
~~~~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Carregando Helpers
~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Carregando Helpers
~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Carregando Classes de Plugins
-----------------------------

Carregar classes de plugins funciona da mesma forma de carregar classes
de app e do core, exceto que você precisa especificar o plugin do qual
você está carregando.

::

    App::import('Model', 'PluginName.Comment');

Carregando Arquivos de Vendor
-----------------------------

A função vendor() foi descontinuada. Arquivos vendors agora também devem
ser carregadas usando App::import(). A sintaxe e argumentos adicionais
são ligeiramente diferentes, já que estruturas de arquivos vendors podem
mudar bastante, e nem todos os arquivos vendors contém classes.

Os exemplos abaixo ilustram como carregar arquivos vendor a partir de
uma série de estruturas de caminhos. Esses arquivos vendors podem estar
localizados em qualquer dos diretórios do vendor.

Exemplos de "Vendor"
~~~~~~~~~~~~~~~~~~~~

Para carregar **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

Para carregar **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

Para carregar **vendors/some.name.php**

::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

Para carregar **vendors/services/well.named.php**

::

    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

Configuração de rotas (routes)
==============================

Rotas são funcionalidades que mapeiam URLs em ações do controller. Foi
adicionado ao CakePHP para tornar URLs amigáveis, mais configuráveis e
flexíveis. Não é obrigatório o uso do mod\_rewrite para usar rotas, mas
usando-o fará sua barra de endereços muito mais limpa e arrumada.

Rotas no CakePHP 1.2 foi ampliada e pode ser muito mais poderosa.

Rota Padrão
-----------

Antes de você aprender sobre como configurar suas próprias rotas, você
deveria saber que o CakePHP vem configurado com um conjunto de rotas
padrão. A configuração padrão de rotas do CakePHP deixará as URLs mais
bonitas para qualquer aplicação. Você pode acessar diretamente uma ação
via URL colocando seu nome na requisição. Você pode também passar
paramêtros para suas ações no controller usando a própria URL.

::

        URL para a rota padrão: 
        http://example.com/controller/action/param1/param2/param3

A URL /noticias/ler mapeia para a ação ler() do controller Noticias
(NoticiasController), e /produtos/ver\_informacoes mapeia para a ação
verInformacoes() do controller Produto (ProdutosController). Se nenhuma
ação é especificada na URL, a ação index() será chamada.

A rota padrão também permite passar parâmetros para as ações usando a
URL. Uma requisição /noticias/ler/12 seria equivalente a chamar o método
ler(12) no controller Noticias (NoticiasController), por exemplo.

Argumentos passados
-------------------

Argumentos passados são argumentos adicionais ou segmentos de caminho
que são usados quando fazer um pedido. Eles são freqüentemente usados
para passar parâmetros aos métodos de seu controlador.

::

    http://localhost/calendars/view/recent/mark

No exemplo acima, tanto ``recent`` e ``mark`` são passados argumentos
para ``CalendarsController::view()``. argumentos passados são dadas aos
seus controladores de duas maneiras. Primeiro como argumentos para o
método de ação chamado e, por outro estão disponíveis em
``$this->params['pass']`` como uma matriz indexada numericamente. Ao
utilizar rotas personalizadas que você pode forçar determinados
parâmetros de ir para os argumentos passados também. Veja `passar
parâmetros para uma
ação </pt/view/945/Routes-Configuration#Passing-parameters-to-action-949>`_
para mais informações.

Parâmetros nomeados
-------------------

Uma novidade no CakePHP 1.2 é a possibilidade de usar parâmetros
nomeados. Você pode nomear parâmetros e enviar seus valores usando a
URL. Uma requisição
/noticias/ler/titulo:primeira+noticia/categoria:esportes teria como
resultado uma chamada a ação ler() do controller Noticias
(NoticiasController). Nesta ação, você encontraria os valores dos
parâmetros título e categoria dentro de $this->passedArgs['titulo'] e
$this->passedArgs['categoria'] respectivamente.

Alguns exemplos para a rota padrão:

::

    URL mapeadas para as ações dos controladores, usando rotas padrão:
        
    URL: /monkeys/jump
    Mapeado para: MonkeysController->jump();
     
    URL: /products
    Mapeado para: ProductsController->index();
     
    URL: /tasks/view/45
    Mapeado para: TasksController->view(45);
     
    URL: /donations/view/recent/2001
    Mapeado para: DonationsController->view('recent', '2001');

    URL: /contents/view/chapter:models/section:associations
    Mapeado para: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';

Definindo Rotas
---------------

Definindo suas próprias rotas permite você definir como sua aplicação
irá responder a uma dada URL. Defina suas próprias rotas no arquivo
/app/config/routes.php usando o método ``Router::connect()``.

O método ``connect()`` recebe três parâmetros: a URL que você deseja
casar, o valor padrão para os elementos de rota, e regras de expressões
regulares para ajudar a encontrar elementos na URL.

O formato básico para uma definição de rota é:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

O primeiro parâmetro é usado para informar o router sobre que tipo de
URL você está tentando controlar. A URL é uma string normal delimitada
por barras, as que também pode conter um caracter curinga (\*) ou
elementos de rota (nomes de variáveis iniciados por dois-pontos). Usar
um curinga indica para o roteador que tipo de URLs você quer casar, e
especificar elementos de rota permite a você obter parâmetros para as
ações de seu controller.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has been
matched. The second parameter is an associative array. The keys of the
array should be named after the route elements in the URL, or the
default elements: :controller, :action, and :plugin. The values in the
array are the default values for those keys. Let's look at some basic
examples before we start using the third parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and hands it
to the ``display()`` method of the ``PagesController();``; The request
/pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site that
features products for different categories of customers, you might
consider creating a route. This allows you link to /government rather
than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of that:

::

    Router::connect(r /> '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/ should be
sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as a url
will output /cooks/someAction/5 if the above route is the first match
found

If you are planning to use custom named arguments with your route, you
have to make the router aware of it using the ``Router::connectNamed``
function. So if you want the above route to match urls like
``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    />Router::connect(
    '/cooks/:action/*', array('controller' => 'users', 'action' =&gt; 'index')
    );

You can specify your own route elements, doing so gives you the power to
define places in the URL where parameters for controller actions should
lie. When a request is made, the values for these route elements are
found in $this->params of the controller. This is different than named
parameters are handled, so note the difference: named parameters
(/controller/action/name:value) are found in $this->passedArgs, whereas
custom route element data is found in $this->params. When you define a
custom route element, you also need to specify a regular expression -
this tells CakePHP how to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view models
from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two route
elements: :controller and :id. The :controller element is a CakePHP
default route element, so the router knows how to match and identify
controller names in URLs. The :id element is a custom route element, and
must be further clarified by specifying a matching regular expression in
the third parameter of connect(). This tells CakePHP how to recognize
the ID in the URL as opposed to something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same as
requesting /apples/view/5. Both would call the view() method of the
ApplesController. Inside the view() method, you would need to access the
passed ID at ``$this->params['id']``.

One more example, and you'll be a routing pro.

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '(0[1-9]|1[012])',
            'day' => '(0[1-9]|[12][0-9]|3[01])'
        )
    );

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is familiar
to us: it’s a default route element that tells CakePHP to expect a
controller name.

Next, we specify some default values. Regardless of the controller, we
want the index() action to be called. We set the day parameter (the
fourth element in the URL) to null to flag it as being optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (remember that the day
parameter is optional?), handing the requests to the index() actions of
their respective controllers, with the custom date parameters in
$this->params.

Passando parâmetros para "action"
---------------------------------

Assumindo que sua action foi definida como esta e você quer acessas os
argumentos usando ``$articleID`` ao invés de ``$this->params['id']``,
somente adicione um array extra no terceiro parâmetro de
``Router::connect()``.

::

    // some_controller.php
    function view($articleID = null, $slug = null) {
        // algum código aqui
    }

    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'view'),
        array(
            //A ordem importa pois isto irá mapear ":id" para $articleID na sua action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

E agora, graças as funcionalidades de roteamento reverso, você pode
passar na url um array como o abaixo e o Cake saberá como formar a URL
como definido nas rotas.

::

    // view.ctp
    // Isto irá retornar um link para /blog/3-CakePHP_Rocks
    <?php echo $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )); ?>

Roteando prefixos
-----------------

Várias aplicações necessitam de uma seção para usuários administradores
com privilégios de alteração de dados. Muitas vezes isso é definido na
url, como /admin/users/edit/5. No CakePHP é possível utilizar uma rota
para administradores mapeando a nossa seção no arquivo de configuração
para *Routing.admin*.

::

    Configure::write('Routing.admin', 'admin');

Você pode definir quais métodos do seu controller usarão a rota de
administrador bastando iniciar o nome do método com o prefixo
``admin_``. Usando o nosso exemplo para acessar uma url de administração
usuários /admin/users/edit/5 deveremos ter o o método ``admin_edit`` em
nosso ``UsersController`` informando que o primeiro parâmetro é o número
5.

Você pode mapear a url /admin para a sua ação inicial ``admin_index``
alterando o arquivo de configuração de rotas.

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

Você pode configurar o seu arquivo de configuração para utilizar vários
prefixos também:

::

    Router::connect('/profiles/:controller/:action/*', array('prefix' => 'profiles', 'profiles' => true)); 

As ações(métodos) que pertençam à seção de profiles devem ter seus nomes
iniciados com o prefixo ``profiles_``. A estrutura da url do nosso
exemplo da seção de profiles de usuários é /profiles/users/edit/5 que
fará chamada ao método profiles\_edit no nosso ``UsersController``. É
importante lembrar que usando o HTML Helper do cakePHP para montar
nossos links já estaremos montando o nosso link de forma correta. Abaixo
há um exemplo de como construir o nosso link utilizando o HTML helper.

::

    echo $html->link('Edite seu perfil', array('profiles' => true, 'controller' => 'users', 'action' => 'edit', 'id' => 5)); 

Você pode setar vários prefixos no roteador do cakePHP criando uma
estrutura flexível de URL's para a sua aplicação.

Plugin de roteamento
--------------------

Plugin de roteamento usa a chave **plugin**. Você pode criar links que
apontam para um plugin, mas acrescentando o plugin chave para a sua
matriz url.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Inversamente, se o pedido de ativos é um pedido plugin e quiser criar um
link que não tem plugin que você pode fazer o seguinte.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

Ao definir ``plugin => null`` diga o roteador que você deseja criar um
link que não faz parte de um plugin.

Extensões de Arquivos
---------------------

Para fazer com que suas rotas manipulem diferentes extensões de
arquivos, você precisa de uma linha a mais em seu arquivo de
configuração de rotas:

::

    Router::parseExtensions(array('html', 'rss'));

Isto vai informar ao router para desconsiderar as extensões que arquivos
correspondentes e então processar o restante.

Se você quiser criar uma URL como /pagina/titulo-da-pagina.html, você
deveria criar sua rota como mostrado abaixo:

::

        Router::connect(
            '/pagina/:title',
            array('controller' => 'pages', 'action' => 'view'),
            array(
                'pass' => array('title')
            )
        );  

E então para criar links que utilizem esta rota, simplesmente use:

::

    $html->link('Título do link', array('controller' => 'pages', 'action' => 'view', 'title' => Inflector::slug('titulo da pagina', '-'), 'ext' => 'html'))

Classes Custom Route
--------------------

Classes Custom Route permitem você extender e alterar a forma como como
rotas individuais tratam pedidos e controlam roteamento reverso. Uma
classe de rota deve estender ``CakeRoute`` e implementar uma ou ambas as
``match()`` e ``parse()``. Parse é usado para tratar os pedidos e match
é usado para tratar o roteamento reverso.

Você também pode usar um classe de rota personalizada quando estiver
fazendo uma rota usando a opção ``routeClass``, e carregar o arquivo que
contém sua rota antes de tentar usá-la.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

Esta rota criará um instância de ``SlugRoute`` e permite você
implementar uma manipulação de parâmetros personalisada.

Inflexões
=========

As convenções de nomenclatura do Cake podem ser realmente legais. Você
pode nomear sua tabela big\_boxes, seu model BigBox, seu controller
BigBoxesController e tudo isso funciona em conjunto automaticamente. A
maneira que o CakePHP usa para associar todas juntas é através da
utilização de inflections (inflexões), que transformam as palavras do
singular em plural e vice-versa.

Existem ocasiões (especialmente para nossos amigos que não falam inglês
- nosso caso), onde você pode rodar o inflector do CakePHP (a classe que
pluraliza, singulariza, camelCases e under\_scores) e não funcionar como
você gostaria. Se o CakePHP não reconhecer seu Foci ou Fish, editando o
arquivo de inflexões você poderá indicar seus casos especiais. O arquivo
de configuração é encontrado em /app/config/inflections.php.

Neste arquivo, você irá encontrar seis variáveis. Cada uma permite você
fazer o ajuste fino das inflections do CakePHP.

+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Variáveis do inflections.php   | Descrição                                                                                                                                                                                                             |
+================================+=======================================================================================================================================================================================================================+
| $pluralRules                   | Este array contém regras de expressões regulares para pluralizar casos especiais. A chave do array são os patterns e o valor são as substituições.                                                                    |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedPlural             | Um array que contém palavras que não precisam ser alteradas quando passadas para o plural (lápis, etc.).                                                                                                              |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularPlural               | Um array que contém palavras e seus plurais. A chave do array contém a forma no singular e o valor a forma no plural. Este array deve ser usado para guardar palavras que não seguem as definições em $pluralRules.   |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $singularRules                 | Similar a $pluralRules, contém as regras para singularizar as palavras.                                                                                                                                               |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedSingular           | Similar a $uninflectedPlural, contém as palavras que não contém forma no singular. Por padrão, este array tem o mesmo valor de $uninflectedPlural.                                                                    |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularSingular             | Similar a $irregularPlural, contém as palavras que possuem apenas a forma singular.                                                                                                                                   |
+--------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Bootstrapping CakePHP
=====================

Se você tem necessidade de alguma configuração adicional, use o arquivo
*bootstrap* do CakePHP, encontrado em /app/config/bootstrap.php. Este
arquivo é executado logo após o carregamento do núcleo do CakePHP.

Este arquivo é ideal para muitas tarefas:

-  Definir funções convenientes
-  Registro de constantes globais
-  Definir diretórios adicionais de *models*, *views* e *controllers*

Certifique-se de manter o padrão de projeto de software MVC quando
adicionar coisas no arquivo *bootstrap*: pode ser tentador colocar
formatações de funções a fim de usá-las em seus *controllers*.

Resist the urge. You’ll be glad you did later on down the line.

You might also consider placing things in the AppController class. This
class is a parent class to all of the controllers in your application.
AppController is handy place to use controller callbacks and define
methods to be used by all of your controllers.
