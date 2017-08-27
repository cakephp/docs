Plugins
#######

O CakePHP permite que você configure uma combinação de controllers, models,e views, plugin de aplicativo empacotado que outros podem usar em suas aplicações CakePHP. 
Se você criou um módulo de gerenciamento de usuários, blog ou serviços da Web em uma das suas aplicações, por que não torna-lo um plugin CakePHP? Desta forma, você pode reutilizá-lo em seus outros aplicativos e compartilhar com a comunidade!

Um plugin do CakePHP é, em última instância, separado do próprio aplicativo host e, geralmente, oferece algumas funcionalidades bem definidas que podem ser embaladas de maneira ordenada e reutilizadas com pouco esforço em outras aplicações. O aplicativo e o plugin operam em seus respectivos espaços, mas compartilham propriedades específicas da aplicação (parâmetros de conectividade de banco de dados) que são definidos e compartilhados através da configuração do aplicativo.

No CakePHP 3.0 cada plugin define seu próprio namespace de nível superior. Por exemplo: ``DebugKit``. 
Por convenção, os plugins usam o nome do pacote como seu namespace. Se você quiser usar um espaço para nome diferente, você pode configurar o espaço para nome do plugin, quando os plugins são carregados.

Instalando um Plugin com Composer
=================================

Muitos plugins estão disponíveis no `Packagist <http://packagist.org>` _
E podem ser instalado com ``Composer``. Para instalar o DebugKit, você
deve fazer assim o assim ::

    php composer.phar require cakephp/debug_kit

Isso instalaria a versão mais recente do DebugKit e atualizaria seus arquivos **composer.json**,**composer.lock**, atualização
**vendor/cakephp-plugins.php**e atualize seu autoloader.

Se o plugin que deseja instalar não estiver disponível em
Packagist.org, você pode clonar ou copiar o código do plugin para seu diretório**plugins**. 
Supondo que você deseja instalar um plugin chamado 'ContactManager', você
Deve ter uma pasta em**plugins**chamado 'ContactManager'. Neste diretório
São o src do plugin, testes e outros diretórios.

.. index :: vendor/cakephp-plugins.php


Plugin Map File
---------------

Ao instalar plugins através do Composer, você pode notar que
**vendor/cakephp-plugins.php** é criado. Este arquivo de configuração contém
um mapa de nomes de plugins e seus caminhos no sistema de arquivos. Isso torna possível
para que os plugins sejam instalados no diretório padrão do vendor que está fora
dos caminhos de pesquisa normais. A classe ``Plugin`` usará este arquivo para localizar
plugins quando são carregados com ``load ()`` ou ``loadAll ()``. Você geralmente
não precisará editar este arquivo à mão, como Composer e ``plugin-installer``
O pacote o gerenciará para você.

Carregando um Plugin
====================

Depois de instalar um plugin e configurar o autoloader, você deve carregar
O plugin. Você pode carregar plugins um a um, ou todos eles com um único
método::

    // In config/bootstrap.php
    // Or in Application::bootstrap()

    // Carrega um único plugin
    Plugin::load('ContactManager');

    // Carrega um plugin com um namespace no nível superior.
    Plugin::load('AcmeCorp/ContactManager');

    // Carrega todos os plugins de uma só vez
    Plugin::loadAll();

``loadAll()`` carrega todos os plugins disponíveis, permitindo que você especifique determinadas
configurações para plugins. ``load()`` funciona de forma semelhante, mas apenas carrega o
Plugins que você especifica explicitamente.

    ``Plugin::loadAll()`` não irá carregar os plugins vendor namespaced que não são
     Definido em **vendor/cakephp-plugins.php**.

Há também um comando de shell acessível para habilitar o plugin. Execute a seguinte linha:

.. code-block:: bash

    bin/cake plugin load ContactManager

Isso colocará o plugin ``Plugin::load('ContactManager');`` no bootstrap para você.

.. _autoloading-plugin-classes:

Autoloading Plugin Classes
--------------------------

Ao usar ``bake`` para criar um plugin ou quando instalar um plugin usando o
Composer, você normalmente não precisa fazer alterações em seu aplicativo para
faça com que o CakePHP reconheça as classes que vivem dentro dele.

Em qualquer outro caso, você precisará modificar o arquivo do composer.json do seu aplicativo.
Para conter as seguintes informações ::

    "psr-4": {
        (...)
        "MyPlugin\\": "./plugins/MyPlugin/src",
        "MyPlugin\\Test\\": "./plugins/MyPlugin/tests"
    }

Se você estiver usando o vendor namespaces para seus plugins, o espaço para nome para mapeamento de caminho
deve se parecer com o seguinte ::

    "psr-4": {
        (...)
        "AcmeCorp\\Users\\": "./plugins/AcmeCorp/Users/src",
        "AcmeCorp\\Users\\Test\\": "./plugins/AcmeCorp/Users/tests"
    }

Além disso, você precisará dizer ao Composer para atualizar o cache de autoloading ::

    $ php composer.phar dumpautoload

Se você não conseguir usar o Composer por qualquer outro motivo, você também pode usar um recurso alternativo
Autoloading para o seu plugin ::

    Plugin::load('ContactManager', ['autoload' => true]);

.. _plugin-configuration:

Configuração do Plugin
======================

Os métodos ``load()`` e ``loadAll()`` podem ajudar na configuração do plugin
E roteamento. Talvez você queira carregar todos os plugins automaticamente enquanto especifica
Rotas personalizadas e arquivos bootstrap para determinados plugins ::

    // No config/bootstrap.php,
    // ou in Application::bootstrap()

    // Usando loadAll()
    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

Ou você pode carregar os plugins individualmente ::

    // Carregando apenas o blog e inclui rotas
    Plugin::load('Blog', ['routes' => true]);

	// Inclua o arquivo configuration/initializer do bootstrap.
    Plugin::load('ContactManager', ['bootstrap' => true]);

Com qualquer uma das abordagens, você não precisa mais manualmente ``include()`` ou
``Require()`` configuração de um plugin ou arquivo de rotas - acontece
Automaticamente no momento e no lugar certos.

Você pode especificar um conjunto de padrões para ``loadAll()`` que irá
aplicar a cada plugin que não tenha uma configuração mais específica.

O seguinte exemplo irá carregar o arquivo bootstrap de todos os plugins e
além disso, as rotas do Blog Plugin ::

    Plugin::loadAll([
        ['bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

Tenha em atenção que todos os arquivos especificados deveriam existir na configuração
o(s) plugin(s) ou PHP dará avisos para cada arquivo que não pode carregar. Você pode evitar
potenciais avisos usando a opção ``ignoreMissing`` ::

    Plugin::loadAll([
        ['ignoreMissing' => true, 'bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

Ao carregar os plugins, o nome do plugin usado deve corresponder ao namespace. Para
por exemplo, se você tiver um plugin com o namespace de nível superior ``Users`` você carregaria
Usando ::

    Plugin::load('User');

Se você preferir ter seu nome vendor como nível superior e ter um espaço para nome como
``AcmeCorp/Users``, então você carregaria o plugin como ::

    Plugin::load('AcmeCorp/Users');

Isso garantirá que os nomes das classes sejam resolvidos corretamente ao usar
:term: `sintaxe do plugin`.

A maioria dos plugins indicará o procedimento adequado para configurá-los e configurar
até o banco de dados em sua documentação. Alguns plugins exigirão mais configuração
do que outros.

Usando Plugins
==============

Você pode fazer referência aos controllers, models, components,
behaviors, e helpers, prefixando o nome do plugin antes

Por exemplo, vamos supor que você queria usar o plugin do ContactManager
ContactInfoHelper para produzir algumas informações de contato legítimas em
uma das suas opiniões. No seu controller, o ``$helpers`` array
poderia ficar assim ::

    public $helpers = ['ContactManager.ContactInfo'];

.. note::
	Esse nome de classe separado por pontos é denominado :term: `sintaxe de plugin '.

Você poderia então acessar o ``ContactInfoHelper`` como
qualquer outro helper em sua view, como ::

    echo $this->ContactInfo->address($contact);

Criando seus próprios complementos
=========================

Apenas como um exemplo, vamos começar a criar o ContactManager
plugin referenciado acima. Para começar, vamos configurar o nosso plugin
estrutura de diretório básico. Deve ser assim ::

    /src
    /plugins
        /ContactManager
            /config
            /src
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
                /Template
                    /Layout
            /tests
                /TestCase
                /Fixture
            /webroot

Observe o nome da pasta do plugin, '**ContactManager**'. É importante
Que esta pasta tem o mesmo nome que o plugin.

Dentro da pasta do plugin, você notará que se parece muito com um aplicativo
CakePHP, e é basicamente isso. Você não precisa incluir qualquer uma das pastas 
que você não está usando, ou seja, pode remover o que não for usar. 
Alguns plugins podem apenas define um Component e um Behavior, e nesse 
caso eles podem completamente omitir o diretório 'Template'.

Um plugin também pode ter basicamente qualquer um dos outros diretórios de seu
aplicativo, como Config, Console, webroot, etc.

Criando um plugin usando bake
-----------------------------

O processo de criação de plugins pode ser bastante simplificado usando o bake
shell.

.. note::
	Use sempre o bake para gerar código, isso evitará muitas dores de cabeça.

Para criar um plugin com o bake, use o seguinte comando:

.. code-block:: bash

    bin/cake bake plugin ContactManager

Agora você pode user o bake com as mesmas convenções que se aplicam ao resto
do seu aplicativo. Por exemplo - baking controllers:

.. code-block:: bash

    bin/cake bake controller --plugin ContactManager Contacts


Consulte o capítulo
:Doc: `/bake/usage` se você
tiver problemas para usar a linha de comando. Certifique-se de voltar a gerar o seu
autoloader uma vez que você criou seu plugin:

.. code-block:: bash

    $ php composer.phar dumpautoload

.. _plugin-routes:

Rotas para Plugin
=================

Os plugins podem fornecer arquivos de rotas contendo suas rotas. Cada plugin pode
conter um arquivo **config/routes.php**. Este arquivo de rotas pode ser carregado quando o
complemento é adicionado ou no arquivo de rotas do aplicativo. Para criar as
rotas de plugins do ContactManager, coloque o seguinte
**plugins/ContactManager/config/routes.php** ::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->get('/contacts', ['controller' => 'Contacts']);
            $routes->get('/contacts/:id', ['controller' => 'Contacts', 'action' => 'view']);
            $routes->put('/contacts/:id', ['controller' => 'Contacts', 'action' => 'update']);
        }
    );


O código acima irá conectar as rotas padrão para o seu plugin. Você pode personalizar isso
no arquivo com rotas mais específicas mais tarde.

    Plugin::load('ContactManager', ['routes' => true]);

Você também pode carregar rotas de plugins na lista de rotas do seu aplicativo. Fazendo isso
fornece mais controle sobre como as rotas do plugin são carregadas e permite que você envolva
as rotas de plugin em escopos ou prefixos adicionais ::

    Router::scope('/', function ($routes) {
        // Connect other routes.
        $routes->scope('/backend', function ($routes) {
            $routes->loadPlugin('ContactManager');
        });
    });


O código acima resultaria em URLs como ``/backend/contact_manager/contacts``.

.. versionadded:: 3.5.0
    ``RouteBuilder::loadPlugin()``was added in 3.5.0

Plugin Controllers
==================

Os Controllers para o nosso plug-in do ContactManager serão armazenados em
**plugins/ContactManager/src/Controller/**. Como a principal coisa que vamos
estar fazendo gerenciar contatos, precisaremos de um ContactsController para
este plugin.

Então, colocamos nosso new ContactsController em
**plugins/ContactManager/src/Controller** e parece ser assim::

    // plugins/ContactManager/src/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\AppController;

    class ContactsController extends AppController
    {

        public function index()
        {
            //...
        }
    }

Também faça o ``AppController`` se você não possuir um já::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

Um ``AppController`` do plugin pode manter a lógica do controller comum a todos os controllers
em um plugin, mas não é necessário se você não quiser usar um.

Se você deseja acessar o que temos chegado até agora, visite
``/contact-manager/contacts``. Você deve obter um erro "Missing Model"
porque ainda não temos um model de Contact definido.

Se o seu aplicativo incluir o roteamento padrão do CakePHP, você será
capaz de acessar seus controllers de plugins usando URLs como ::

    // Acesse a rota de índice de um controller de plugin.
    /contact-manager/contacts

    // Qualquer ação em um controller de plug-in.
    /contact-manager/contacts/view/1

Se o seu aplicativo definir prefixos de roteamento, o roteamento padrão do CakePHP
também conecte rotas que usam o seguinte padrão ::

    /:prefix/:plugin/:controller
    /:prefix/:plugin/:controller/:action

Consulte a seção em :ref:`plugin-configuration` para obter informações sobre como carregar
qrquivos de rota específicos do plugin.

Para os plugins que você não criou com bake, você também precisará editar o
**composer.json** para adicionar seu plugin às classes de autoload, isso pode ser
feito conforme a documentação :ref:`autoloading-plugin-classes`.

.. _plugin-models:

Plugin Models
=============

Os models para o plugin são armazenados em **plugins/ContactManager/src/Model**.
Nós já definimos um ContactsController para este plugin, então vamos
criar a tabela e a entidade para esse controlador ::

    // plugins/ContactManager/src/Model/Entity/Contact.php:
    namespace ContactManager\Model\Entity;

    use Cake\ORM\Entity;

    class Contact extends Entity
    {
    }

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
    }

Se você precisa fazer referência a um modelo no seu plugin ao criar associações
ou definindo classes de entidade, você precisa incluir o nome do plugin com a class
name, separado com um ponto. Por exemplo::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

Se você preferir que as chaves da array para a associação não tenham o prefixo plugin
sobre eles, use a sintaxe alternativa ::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

Você pode usar `TableRegistry`` para carregar suas tabelas de plugins usando o familiar
:term:`plugin syntax`::

    use Cake\ORM\TableRegistry;

    $contacts = TableRegistry::get('ContactManager.Contacts');

Alternativamente, a partir de um contexto de controller, você pode usar ::

    $this->loadModel('ContactsMangager.Contacts');

Plugin Views
============

As views se comportam exatamente como ocorrem em aplicações normais. Basta colocá-los na
pasta ``plugins/[PluginName]/src/Template/``. Para nós
o plugin ContactManager, precisamos de uma view para o nosso ``ContactsController::index()``
action, então incluamos isso também ::


    // plugins/ContactManager/src/Template/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

Os plugins podem fornecer seus próprios layouts. Para adicionar layouts em plugins, coloque seus arquivos de template dentro
``plugins/[PluginName]/src/Template/Layout``. Para usar um layout de plug-in em seu controller
você pode fazer o seguinte ::

    public $layout = 'ContactManager.admin';

Se o prefixo do plugin for omitido, o arquivo layout/view será localizado normalmente.

.. note::

    Para obter informações sobre como usar elementos de um plugin, procure
    :ref:`view-elements`

Substituindo Templates de plugins do na sua aplicação
-----------------------------------------------------

Você pode substituir todas as view do plugin do seu aplicativo usando caminhos especiais. E se
você tem um plugin chamado 'ContactManager', você pode substituir os arquivos do template do
plugin com lógica de visualização específica da aplicação criando arquivos usando o seguinte
template **src/Template/Plugin/[Plugin]/[Controller]/[view].ctp**. Para o
controller Contacts você pode fazer o seguinte arquivo ::

    src/Template/Plugin/ContactManager/Contacts/index.ctp

Criar este arquivo permitiria que você substituir
**plugins/ContactManager/src/Template/Contacts/index.ctp**.


Se o seu plugin estiver em uma dependência no composer (ou seja, 'TheVendor/ThePlugin'), o
caminho para da view 'index' do controller personalizado será ::

    src/Template/Plugin/TheVendor/ThePlugin/Custom/index.ctp

Criar este arquivo permitiria que você substituir
**vendor/thevendor/theplugin/src/Template/Custom/index.ctp**.

Se o plugin implementar um prefixo de roteamento, você deve incluir o prefixo de roteamento em seu
O template para substitui.

Se o plugin 'Contact Manager' implementou um prefixo 'admin', o caminho principal seria ::
    
    src/Template/Plugin/ContactManager/Admin/ContactManager/index.ctp

.. _plugin-assets:


Plugin Assets
=============

Os recursos da web de um plugin (mas não arquivos PHP) podem ser atendidos através do plugin no
diretório ``webroot``, assim como os assets da aplicação principal ::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Você pode colocar qualquer tipo de arquivo em qualquer no diretório webroot.

.. warning::

    Manipulação de assets estáticos (como imagens, JavaScript e arquivos CSS)
    Através do Dispatcher é muito ineficiente. Ver :ref:`symlink-assets`
    Para maiores informações.

Linking to Assets in Plugins
----------------------------

Você pode usar o :term: `plugin syntax` ao vincular aos recursos do plugin usando o
:php:class:`~Cake\\View\\Helper\\HtmlHelper`'s script, image ou css methods ::

    // Gera a URL /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Gera a URL  /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Gera a URL /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Os recursos do plugin são servidos usando o filtro ``AssetFilter`` dispatcher por padrão.
Isso só é recomendado para o desenvolvimento. Na produção, você deve
:ref:`symlink do plugin symlink <symlink-assets>` para melhorar o desempenho.

Se você não estiver usando os helpers, você pode /plugin_name/ para o início
da URL para um recurso dentro desse plugin para atendê-lo. Ligando para
'/contact_manager/js/some_file.js' serviria o asset
**plugins/ContactManager/webroot/js/some_file.js**.


Components, Helpers and Behaviors
=================================

Um plugin pode ter Components, Helpers e Behaviors, como uma aplicação CakePHP 
normal. Você pode até criar plugins que consistem apenas em Componentes,
Helpers ou Behaviors que podem ser uma ótima maneira de construir componentes reutilizáveis que
pode ser lançado em qualquer projeto.

Construir esses componentes é exatamente o mesmo que construí-lo dentro de uma aplicacao 
normal, sem convenção de nome especial.

Referir-se ao seu componente de dentro ou fora do seu plugin requer apenas
que você prefixa o nome do plugin antes do nome do componente. Por exemplo::


    // Component definido no 'ContactManager' plugin
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // Dentro de seus controllers
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }


A mesma técnica se aplica aos Helpers e Behaviors.


Expanda seu plugin
==================

Este exemplo criou um bom começo para um plugin, mas há muito
mais que você pode fazer. Como regra geral, qualquer coisa que você possa fazer com o seu
aplicativo que você pode fazer dentro de um plugin também.


Vá em frente - inclua algumas bibliotecas de terceiros em 'vendor', adicione algumas
novas shells para o cake console e não se esqueça de criar os testes
então seus usuários de plugins podem testar automaticamente a funcionalidade do seu plugin!


Em nosso exemplo do ContactManager, podemos criar as actions add/remove/edit/delete
no ContactsController, implementar a validação no model e implementar a funcionalidade 
que se poderia esperar ao gerenciar seus contatos. 
Depende de você decidir o que implementar no seu Plugins. Apenas não esqueça de compartilhar seu código com a comunidade, então
que todos possam se beneficiar de seus componentes incríveis e reutilizáveis!


Publish Your Plugin
===================

Certifique-se de adicionar o seu plug-in para
`Plugins.cakephp.org <https://plugins.cakephp.org>` _. Desta forma, outras pessoas podem
Use-o como dependência do compositor.
Você também pode propor seu plugin para o
Lista de "awesome-cakephp" <https://github.com/FriendsOfCake/awesome-cakephp> `_.

Escolha um nome semanticamente significativo para o nome do pacote. Isso deve ser ideal
prefixado com a dependência, neste caso "cakephp" como o framework.
O nome do vendor geralmente será seu nome de usuário do GitHub.
Não **não** use o espaço de nome CakePHP (cakephp), pois este é reservado ao CakePHP
Plugins de propriedade.

A convenção é usar letras minúsculas e traços como separador.

Então, se você criou um plugin "Logging" com sua conta do GitHub "FooBar", um bom
O nome seria `foo-bar/cakephp-logging`.
E o plugin "Localized" do CakePHP pode ser encontrado em ``cakephp/localized`
respectivamente.

.. meta::
    :title lang=en: Plugins
    :keywords lang=en: plugin folder,plugins,controllers,models,views,package,application,database connection,little space
