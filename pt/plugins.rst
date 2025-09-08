Plugins
#######

O CakePHP permite que você configure uma combinação de controllers, models e views, 
e os libere como um plugin de aplicativo pré-empacotado que
outros podem usar em seus aplicativos CakePHP. Se você criou
um ótimo gerenciamento de usuários, um blog simples ou adaptadores de serviços web em um de
seus aplicativos, por que não empacotá-lo como um plugin do CakePHP? Dessa forma, você
pode reutilizá-lo em seus outros aplicativos e compartilhar com a comunidade!

Um plugin do CakePHP é separado do próprio aplicativo host e geralmente
fornece algumas funcionalidades bem definidas que podem ser empacotadas de forma organizada e
reutilizadas com pouco esforço em outros aplicativos. O aplicativo e o plugin
operam em seus respectivos espaços, mas compartilham os dados de configuração do aplicativo
(por exemplo, conexões de banco de dados, transportes de e-mail).

O plugin deve definir seu próprio namespace de nível superior. Por exemplo:
``DebugKit``. Por convenção, os plugins usam o nome do pacote como seu namespace.
Se desejar usar um namespace diferente, você pode configurar o namespace do plugin
quando os plugins forem carregados.

Instalando um Plugin com Composer
=================================

Muitos plugins estão disponíveis no `Packagist <https://packagist.org>` _
E podem ser instalados com o ``Composer``. Para instalar o DebugKit, você
deve fazer assim o assim:

.. code-block:: console

    php composer.phar require cakephp/debug_kit

Isso instalaria a versão mais recente do DebugKit e atualizaria seus arquivos **composer.json**, **composer.lock**, 
atualiza **vendor/cakephp-plugins.php** e atualize seu autoloader.

Instalando um Plugin Manualmente
================================

Se o plugin que você deseja instalar não estiver disponível em
packagist.org, você pode clonar ou copiar o código do plugin para o seu diretório **plugins**
. Supondo que você queira instalar um plugin chamado 'ContactManager', você
deve ter uma pasta em **plugins** chamada 'ContactManager'. Neste diretório
estão os diretórios src, tests e quaisquer outros diretórios do plugin.

.. _autoloading-plugin-classes:

Autoloading Manual das Classes do Plugin
----------------------------------------

Se você instalar seus plugins via ``composer`` ou ``bake``, não precisará
configurar o carregamento automático de classes para seus plugins.

Se você criar um plugin manualmente na pasta ``plugins``, precisará
informar ao ``composer`` para atualizar o cache de carregamento automático:

.. code-block:: console

    php composer.phar dumpautoload

Se estiver usando namespaces de fornecedores para seus plugins, você terá que adicionar o
namespace ao mapeamento de caminho para o ``composer.json``, semelhante ao seguinte,
antes de executar o comando composer acima:

.. code-block:: json

    {
        "autoload": {
            "psr-4": {
                "AcmeCorp\\Users\\": "plugins/AcmeCorp/Users/src/",
            }
        },
        "autoload-dev": {
            "psr-4": {
                "AcmeCorp\\Users\\Test\\": "plugins/AcmeCorp/Users/tests/"
            }
        }
    }

.. _loading-a-plugin:

Carregando um Plugin
====================

Se você quiser usar as rotas, comandos de console, middlewares, middlewares, event
listeners, templates or webroot assets de um plugin, precisará carregar o plugin.

Se você quiser usar apenas auxiliares, comportamentos ou componentes de um plugin,
não precisa carregá-lo explicitamente, mas é recomendável sempre fazê-lo.

Há também um comando de console útil para carregar o plugin. Execute a seguinte
linha:

.. code-block:: console

    bin/cake plugin load ContactManager

Isso atualizará o array no arquivo ``config/plugins.php`` do seu aplicativo com
uma entrada semelhante a ``'ContactManager' => []``.

.. _plugin-configuration:

Configuração do Hook do Plugin
==============================

Os plugins oferecem vários hooks que permitem que um plugin se injete nas
partes apropriadas da sua aplicação. Os hooks são:

* ``bootstrap`` Usado para carregar os arquivos de configuração padrão do plugin, definir
    constantes e outras funções globais. O método ``bootstrap`` recebe a
    instância atual de ``Application``, dando a você amplo acesso ao contêiner DI
    e à configuração.
* ``routes`` Usado para carregar rotas para um plugin. Disparado após as rotas do aplicativo
    serem carregadas.
* ``middleware`` Usado para adicionar o middleware do plugin à fila de middleware
    de um aplicativo.
* ``console`` Usado para adicionar comandos de console à coleção de comandos
    de um aplicativo.
* ``services`` Usado para registrar o serviço do contêiner do aplicativo. Esta é uma boa
    oportunidade para configurar objetos adicionais que precisam de acesso ao contêiner.

Por padrão, todos os hooks de plugins estão habilitados. Você pode desabilitá-los usando as
opções relacionadas do comando ``plugin load``:

.. code-block:: console

    bin/cake plugin load ContactManager --no-routes

Isso atualizaria o array no ``config/plugins.php`` do seu aplicativo com
uma entrada semelhante a ``'ContactManager' => ['routes' => false]``.

Opções de Carregamento de Plugins
=================================

Além das opções para ganchos de plugins, o comando ``plugin load`` possui as seguintes opções 
para controlar o carregamento de plugins:

- ``--only-debug`` Carrega o plugin somente quando o modo de depuração estiver habilitado.
- ``--only-cli`` Carrega o plugin somente para CLI.
- ``--optional`` Não gera erro se o plugin não estiver disponível.

Carregando plugins através de ``Application::bootstrap()``
==========================================================

Além do array de configuração em ``config/plugins.php``, os plugins também podem ser
carregados no método ``bootstrap()`` do seu aplicativo::

    // In src/Application.php
    use Cake\Http\BaseApplication;
    use ContactManager\ContactManagerPlugin;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            parent::bootstrap();

            // Carregue o plugin do contact manager pelo nome da classe
            $this->addPlugin(ContactManagerPlugin::class);

            // Carregar um plugin com um namespace de fornecedor por 'short name' com opções
            $this->addPlugin('AcmeCorp/ContactManager', ['console' => false]);

            // Carregue uma dependência de desenvolvimento que não existirá em compilações de produção.
            $this->addOptionalPlugin('AcmeCorp/ContactManager');
        }
    }

Você pode configurar hooks com opções de array ou com os métodos fornecidos pelo plugin
classes::

    // In Application::bootstrap()
    use ContactManager\ContactManagerPlugin;

    // Use  disable/enable para configurar os hooks.
    $plugin = new ContactManagerPlugin();

    $plugin->disable('bootstrap');
    $plugin->enable('routes');
    $this->addPlugin($plugin);

As classes de plugin também conhecem seus nomes e informações de caminho::

    $plugin = new ContactManagerPlugin();

    // Obtenha o nome do plugin.
    $name = $plugin->getName();

    // Caminho para raiz do plugin e outros caminhos.
    $path = $plugin->getPath();
    $path = $plugin->getConfigPath();
    $path = $plugin->getClassPath();

Usando Plugin Classes
=====================

Você pode referenciar controllers, models, components, behaviors e
helpers de um plugin prefixando o nome do plugin.

Por exemplo, digamos que você queira usar o
``ContactInfoHelper`` do plugin ContactManager para gerar informações de contato formatadas em
uma de suas visualizações. No seu controller, usar ``addHelper()``
poderia ter a seguinte aparência::

    $this->viewBuilder()->addHelper('ContactManager.ContactInfo');

.. note::
    Este nome de classe separado por pontos é chamado de :term:`sintaxe plugin`.

Você poderá então acessar o ``ContactInfoHelper`` como qualquer outro auxiliar 
em sua visualização, como::

    echo $this->ContactInfo->address($contact);

Os plugins podem usar os models, components, behaviors and helpers fornecidos
pelo aplicativo ou outros plugins, se necessário::

   // Use um componente de applicação
   $this->loadComponent('AppFlash');

   // Use o comportamento de outro plugin
   $this->addBehavior('OtherPlugin.AuditLog');

.. _plugin-create-your-own:

Criando seus Próprios Plugins
=============================

Como exemplo prático, vamos começar a criar o plugin ContactManager
referenciado acima. Para começar, vamos configurar a
estrutura básica de diretórios do nosso plugin. Deve ficar assim::

    /src
    /plugins
        /ContactManager
            /config
            /src
                /ContactManagerPlugin.php
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
            /templates
                /layout
            /tests
                /TestCase
                /Fixture
            /webroot

Observe o nome da pasta do plugin, '**ContactManager**'. É importante
que esta pasta tenha o mesmo nome do plugin.

Dentro da pasta do plugin, você notará que ela se parece muito com um aplicativo CakePHP,
e é basicamente isso que ele é. Só que em vez de ``Application.php``,
você tem um ``ContactManagerPlugin.php``. Você não precisa
incluir nenhuma das pastas que não estiver usando. Alguns plugins podem
definir apenas um Componente e um Comportamento e, nesse caso, podem
omitir completamente o diretório 'templates'.

Um plugin também pode ter basicamente qualquer um dos outros diretórios que seu
aplicativo pode ter, como Config, Console, webroot, etc.

Criando um Plugin Usando Bake
-----------------------------

O processo de criação de plugins pode ser bastante simplificado usando o bake.

Para criar um plugin, use o seguinte comando:

.. code-block:: console

    bin/cake bake plugin ContactManager

O Bake pode ser usado para criar classes no seu plugin. Por exemplo, para gerar
um controller de plugin, você pode executar:

.. code-block:: console

    bin/cake bake controller --plugin ContactManager Contacts

Consulte o capítulo
:doc:`/bake/usage` se tiver
algum problema ao usar a linha de comando. Certifique-se de gerar novamente o seu
carregador automático após criar o plugin:

.. code-block:: console

    php composer.phar dumpautoload

.. _plugin-objects:

Classes do Plugin
=================

As classes de plugin permitem que o autor defina a lógica de configuração, defina hooks
padrão, rotas de carregamento, middleware e comandos de console. As classes de plugin estão em
**src/{PluginName}Plugin.php**. Para o nosso plugin ContactManager, 
nossa classe de plugin poderia ter a seguinte aparência::

    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Core\ContainerInterface;
    use Cake\Core\PluginApplicationInterface;
    use Cake\Console\CommandCollection;
    use Cake\Http\MiddlewareQueue;
    use Cake\Routing\RouteBuilder;

    class ContactManagerPlugin extends BasePlugin
    {
        /**
         * @inheritDoc
         */
        public function middleware(MiddlewareQueue $middleware): MiddlewareQueue
        {
            // Coloque o middleware aqui.
            $middleware = parent::middleware($middleware);

            return $middleware;
        }

        /**
         * @inheritDoc
         */
        public function console(CommandCollection $commands): CommandCollection
        {
            // Coloque os comandos de console aqui.
            $commands = parent::console($commands);

            return $commands;
        }

        /**
         * @inheritDoc
         */
        public function bootstrap(PluginApplicationInterface $app): void
        {
            // Adicionar constantes, carregar padrões de configuração.
            // Por padrão, carregará `config/bootstrap.php` no plugin.
            parent::bootstrap($app);
        }

        /**
         * @inheritDoc
         */
        public function routes(RouteBuilder $routes): void
        {
            // Adicionar rotas.
            // Por padrão, carregará `config/routes.php` no plugin.
            parent::routes($routes);
        }

        /**
         * Registrar serviços de contêiner de aplicativos.
         *
         * @param \Cake\Core\ContainerInterface $container The Container to update.
         * @return void
         * @link https://book.cakephp.org/5/en/development/dependency-injection.html#dependency-injection
         */
        public function services(ContainerInterface $container): void
        {
            // Adicione seus serviços aqui.
        }
    }

.. _plugin-routes:

Rotas do Plugin
===============

Os plugins podem fornecer arquivos de rotas contendo suas rotas. Cada plugin pode
conter um arquivo **config/routes.php**. Este arquivo de rotas pode ser carregado quando o plugin
é adicionado ou no arquivo de rotas do aplicativo. Para criar as rotas do plugin
ContactManager, insira o seguinte em
**plugins/ContactManager/config/routes.php**::

    <?php
    use Cake\Routing\Route\DashedRoute;

    $routes->plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->setRouteClass(DashedRoute::class);

            $routes->get('/contacts', ['controller' => 'Contacts']);
            $routes->get('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'view']);
            $routes->put('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'update']);
        }
    );

O exemplo acima conectará as rotas padrão do seu plugin. Você pode personalizar este
arquivo com rotas mais específicas posteriormente.

Você também pode carregar rotas de plugin na lista de rotas do seu aplicativo. Isso
fornece mais controle sobre como as rotas de plugin são carregadas e permite que você envolva
as rotas de plugin em escopos ou prefixos adicionais::

    $routes->scope('/', function ($routes) {
        // Connect other routes.
        $routes->scope('/backend', function ($routes) {
            $routes->loadPlugin('ContactManager');
        });
    });

A URL acima resultaria em algo como ``/backend/contact-manager/contacts``.

Controllers do Plugin
=====================

Os controllers para o nosso plugin ContactManager serão armazenados em
**plugins/ContactManager/src/Controller/**. Como a principal tarefa que faremos
é gerenciar contatos, precisaremos de um ContactsController para
este plugin.

Então, colocamos nosso novo ContactsController em
**plugins/ContactManager/src/Controller** e ele ficará assim::

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

Crie também o ``AppController`` se você ainda não tiver um::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

O ``AppController`` de um plugin pode conter a lógica do controller comum a todos os controllers
de um plugin, mas não é necessário se você não quiser usar um.

Se quiser acessar o que fizemos até agora, visite
``/contact-manager/contacts``. Você deverá receber um erro "Modelo Ausente"
porque ainda não temos um modelo de Contato definido.

Se sua aplicação incluir o roteamento padrão fornecido pelo CakePHP, você poderá
acessar os controllers do seu plugin usando URLs como::

    // Acesse a rota de índice de um controller de plugin.
    /contact-manager/contacts

    // Qualquer ação em um controller de plugin.
    /contact-manager/contacts/view/1

Se sua aplicação definir prefixos de roteamento, o roteamento padrão do CakePHP
também conectará rotas que usam o seguinte padrão::

    /{prefix}/{plugin}/{controller}
    /{prefix}/{plugin}/{controller}/{action}

Consulte a seção :ref:`plugin-configuration` para obter informações sobre como carregar
arquivos de rota específicos do plugin.

.. _plugin-models:

Modelos do Plugin
=================

Os modelos para o plugin são armazenados em **plugins/ContactManager/src/Model**.
Já definimos um ContactsController para este plugin, então vamos
criar a tabela e a entidade para esse controller::

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

Se você precisar referenciar um modelo dentro do seu plugin ao construir associações
ou definir classes de entidade, você precisa incluir o nome do plugin com o nome da classe
separados por um ponto. Por exemplo::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

Se você preferir que as chaves do array para a associação não tenham o prefixo
do plugin, use a sintaxe alternativa::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

Você pode usar ``Cake\ORM\Locator\LocatorAwareTrait`` para carregar suas tabelas de plugins usando a conhecida
:term:`sintaxe plugin`::

    // Os controladores já usam LocatorAwareTrait, então você não precisa disso.
    use Cake\ORM\Locator\LocatorAwareTrait;

    $contacts = $this->fetchTable('ContactManager.Contacts');

Templates do Plugin 
===================

As visualizações se comportam exatamente como em aplicativos normais. Basta colocá-las na
pasta correta dentro da pasta ``plugins/[NomeDoPlugin]/templates/``. Para o nosso
plugin ContactManager, precisaremos de uma visualização para a nossa ação ``ContactsController::index()``,
então vamos incluí-la também::

    //plugins/ContactManager/templates/Contacts/index.php:
    <h1>Contatos</h1>
    <p>A seguir, uma lista classificável dos seus contatos</p>
    <!-- Uma lista classificável de contatos seria inserida aqui....-->

Os plugins podem fornecer seus próprios layouts. Para adicionar layouts de plugin, 
coloque seus arquivos de template dentro de ``plugins/[NomeDoPlugin]/templates/layout``. 
Para usar um layout de plugin no seu controller você pode fazer o seguinte::

    $this->viewBuilder()->setLayout('ContactManager.admin');

Se o prefixo do plugin for omitido, o arquivo de layout/visualização será localizado normalmente.

Elementos do Plugin
-------------------

Para renderizar um elemento de um plugin, use o :term:`sintaxe plugin` para referenciar
um plugin. Você não precisa usar a sintaxe plugin para elementos no plugin ativo no momento.

Se o elemento não existir no plugin, ele procurará na pasta principal do APP::

    echo $this->element('Contacts.helpbox');

Se a sua visualização fizer parte de um plugin, você pode omitir o nome do plugin. Por exemplo,
se você estiver no ``ContactsController`` do plugin Contacts, o seguinte::

    echo $this->element('helpbox');
    // e
    echo $this->element('Contacts.helpbox');

são equivalentes e resultarão na renderização do mesmo elemento.

Para elementos dentro de uma subpasta de um plugin
(por exemplo, **plugins/Contacts/Template/element/sidebar/helpbox.php**), use o
seguinte::

    echo $this->element('Contacts.sidebar/helpbox');

.. note::
    Veja :ref:`view-elements` para mais informações sobre renderização de elementos.

Substituindo Templates de Plugin de Dentro do seu Aplicativo
------------------------------------------------------------

Você pode sobrescrever qualquer visualização de plugin de dentro do seu aplicativo usando caminhos especiais. Se
você tiver um plugin chamado "ContactManager", poderá sobrescrever os arquivos de template do
plugin com a lógica de visualização específica do aplicativo, criando arquivos usando o
seguinte template: **templates/plugin/[Plugin]/[Controller]/[view].php**. Para o
controller de contatos, você pode criar o seguinte arquivo::

    templates/plugin/ContactManager/Contacts/index.php

A criação deste arquivo permitirá que você substitua
**plugins/ContactManager/templates/Contacts/index.php**.

Para substituir elementos do plugin, crie um elemento com o mesmo nome em::

    templates/plugin/ContactManager/element/helpbox.php

Este arquivo substituirá
**plugins/ContactManager/templates/element/helpbox.ctp**.

Se o seu plugin estiver em uma dependência do composer (por exemplo, 'Empresa/ContactManager'), o
caminho para a visualização 'index' do controller de contatos será::

    templates/plugin/TheVendor/ThePlugin/Custom/index.php

A criação deste arquivo permitirá que você sobrescreva
**vendor/thevendor/theplugin/templates/Custom/index.php**.

Se o plugin implementar um prefixo de roteamento, você deverá incluí-lo
nas substituições de modelo do seu aplicativo. Por exemplo, se o plugin "ContactManager"

implementou um prefixo "Admin", o caminho de sobreposição seria::

    templates/plugin/ContactManager/Admin/ContactManager/index.php

.. _plugin-assets:

Plugin Assets
=============

Os recursos da web de um plugin (mas não os arquivos PHP) podem ser servidos por meio do diretório
``webroot`` do plugin, assim como os recursos do aplicativo principal::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Você pode colocar qualquer tipo de arquivo em qualquer diretório, como um webroot comum.

.. warning::

    Lidar com ativos estáticos (como imagens, arquivos JavaScript e CSS)
    por meio do Dispatcher é muito ineficiente. Consulte :ref:`symlink-assets`
    para mais informações.

Linkando os Assets no Plugin
----------------------------

Você pode usar o plugin :term:`sintaxe plugin` ao vincular aos recursos do plugin usando os 
métodos de script, imagem ou css do :php:class:`~Cake\\View\\Helper\\HtmlHelper`::

    // Gera uma URL de /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Gera uma URL de /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Gera uma URL de /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Os recursos do plugin são servidos usando o middleware ``AssetMiddleware`` por padrão.
Isso é recomendado apenas para desenvolvimento. Em produção, você deve
:ref:`symlink plugin assets <symlink-assets>` para melhorar o desempenho.

Se não estiver usando os helpers, você pode adicionar /nome-do-plugin/ ao início
da URL de um recurso dentro desse plugin para servi-lo. Vincular a
'/contact_manager/js/some_file.js' serviria o recurso
**plugins/ContactManager/webroot/js/some_file.js**.

Componentes, Helpers e Behaviors
================================

Um plugin pode ter Componentes, Helpers e Behaviors, assim como uma aplicação CakePHP.
Você pode até criar plugins que consistem apenas em Componentes,
Helpers ou Behaviors, o que pode ser uma ótima maneira de construir componentes reutilizáveis ​​que
podem ser inseridos em qualquer projeto.

Construir esses componentes é exatamente o mesmo que criá-los dentro de uma aplicação
normal, sem nenhuma convenção de nomenclatura especial.

Referir-se ao seu componente de dentro ou de fora do seu plugin requer apenas
que você prefixe o nome do plugin antes do nome do componente. Por exemplo::

    // Componente definido no plugin 'ContactManager'
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // Dentro de seus controllers
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }

A mesma técnica se aplica a Helpers e Behaviors.

.. _plugin-commands:

Commands
========

Os plugins podem registrar seus comandos dentro do hook ``console()``. Por padrão,
todos os comandos de console no plugin são descobertos automaticamente e adicionados à
lista de comandos do aplicativo. Os comandos do plugin são prefixados com o nome do plugin.
Por exemplo, o ``UserCommand`` fornecido pelo plugin ``ContactManager`` seria
registrado como ``contact_manager.user`` e ``user``. O nome sem prefixo
só será usado por um plugin se não for usado pelo aplicativo ou
por outro plugin.

Você pode personalizar os nomes dos comandos definindo cada comando no seu plugin::

    public function console($commands)
    {
        // Criar comandos aninhados
        $commands->add('bake model', ModelCommand::class);
        $commands->add('bake controller', ControllerCommand::class);

        return $commands;
    }


Testando seu Plugin
===================

Se você estiver testando controllers ou gerando URLs, certifique-se de que seu
plugin conecte as rotas ``tests/bootstrap.php``.

Para mais informações, consulte a página :doc:`testando plugins </development/testing>`.

Publicando seu Plugin
=====================

Os plugins do CakePHP devem ser publicados no `packagist
<https://packagist.org>`__. Dessa forma, outras pessoas podem usá-lo como dependência do composer.
Você também pode propor seu plugin à lista `awesome-cakephp
<https://github.com/FriendsOfCake/awesome-cakephp>`_.

Escolha um nome semanticamente significativo para o nome do pacote. Idealmente, este deve
ser prefixado com a dependência, neste caso "cakephp" como o framework.
O nome do fornecedor geralmente será seu nome de usuário do GitHub.
**Não** use o namespace CakePHP (cakephp), pois ele é reservado para plugins
de propriedade do CakePHP. A convenção é usar letras minúsculas e hífens como separadores.

Portanto, se você criou um plugin "Logging" com sua conta do GitHub "FooBar", um bom
nome seria `foo-bar/cakephp-logging`.
E o plugin "Localized", de propriedade do CakePHP, pode ser encontrado em `cakephp/localized`
respectivamente.

.. index:: vendor/cakephp-plugins.php

Arquivo de Mapa de Plugin
=========================

Ao instalar plugins via Composer, você pode notar que
**vendor/cakephp-plugins.php** é criado. Este arquivo de configuração contém
um mapa de nomes de plugins e seus caminhos no sistema de arquivos. Ele possibilita
que plugins sejam instalados no diretório padrão do vendor, que está fora
dos caminhos de busca normais. A classe ``Plugin`` usará este arquivo para localizar
plugins quando eles forem carregados com ``addPlugin()``. Geralmente,
você não precisará editar este arquivo manualmente, pois o Composer e o pacote ``plugin-installer``
o gerenciarão para você.


Gerencie Seus Plugins Usando o Mixer
====================================

Outra maneira de descobrir e gerenciar plugins em sua aplicação CakePHP é o
`Mixer <https://github.com/CakeDC/mixer>`_. É um plugin do CakePHP que ajuda
você a instalar plugins do Packagist. Ele também ajuda a gerenciar seus plugins
existentes.

.. note::

    IMPORTANTE: Não use isso em ambiente de produção.

.. meta::
    :title lang=pt: Plugins
    :keywords lang=pt: pasta de plugins, plugins, controllers, models, views, pacote, aplicativo, conexão de banco de dados, pouco espaço