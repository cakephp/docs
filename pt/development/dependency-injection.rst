Injeção de Dependências
#######################

O container de serviços do CakePHP permite que você gerencie dependências de classe para os
serviços de sua aplicação através da injeção de dependências. A injeção de dependências
automaticamente "injeta" as dependências de um objeto via construtor sem
precisar instanciá-las manualmente.

Você pode usar o container de serviços para definir 'serviços de aplicação'. Essas
classes podem usar models e interagir com outros objetos como loggers e mailers
para construir fluxos de trabalho reutilizáveis e lógica de negócios para sua aplicação.

O CakePHP usará o :term:`DI container` nas seguintes situações:

* Construindo controllers.
* Chamando actions em seus controllers.
* Construindo Components.
* Construindo Console Commands.
* Construindo Middleware por nome de classe.

Exemplo de Controller
=====================

::

    // Em src/Controller/UsersController.php
    class UsersController extends AppController
    {
        // O serviço $users será criado via container de serviços.
        public function ssoCallback(UsersService $users)
        {
            if ($this->request->is('post')) {
                // Use o UsersService para criar/obter o usuário de um
                // Provedor de Single Sign-on.
                $user = $users->ensureExists($this->request->getData());
            }
        }
    }

    // Em src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->add(UsersService::class);
    }

Neste exemplo, a action ``UsersController::ssoCallback()`` precisa buscar
um usuário de um provedor de Single-Sign-On e garantir que ele exista no banco de dados
local. Como este serviço é injetado em nosso controller, podemos facilmente
trocar a implementação por um objeto mock ou uma subclasse dummy ao
testar.

Exemplo de Command
==================

::

    // Em src/Command/CheckUsersCommand.php
    use Cake\Console\CommandFactoryInterface;

    class CheckUsersCommand extends Command
    {
        public function __construct(protected UsersService $users, ?CommandFactoryInterface $factory = null)
        {
            parent::__construct($factory);
        }

        public function execute(Arguments $args, ConsoleIo $io)
        {
            $valid = $this->users->check('all');
        }

    }

    // Em src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container
            ->add(CheckUsersCommand::class)
            ->addArgument(UsersService::class)
            ->addArgument(CommandFactoryInterface::class);
        $container->add(UsersService::class);
    }

O processo de injeção é um pouco diferente aqui. Em vez de adicionar o
``UsersService`` ao container, primeiro temos que adicionar o Command como
um todo ao Container e adicionar o ``UsersService`` como um argumento.
Com isso, você pode então acessar esse serviço dentro do construtor
do command.

Exemplo de Component
====================

::

    // Em src/Controller/Component/SearchComponent.php
    class SearchComponent extends Component
    {
        public function __construct(
            ComponentRegistry $registry,
            private UserService $users,
            array $config = []
        ) {
            parent::__construct($registry, $config);
        }

        public function something()
        {
            $valid = $this->users->check('all');
        }
    }

    // Em src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->add(SearchComponent::class)
            ->addArgument(ComponentRegistry::class)
            ->addArgument(UsersService::class);
        $container->add(UsersService::class);
    }

Adicionando Serviços
====================

Para que os serviços sejam criados pelo container, você precisa informar quais
classes ele pode criar e como construir essas classes. A
definição mais simples é via um nome de classe::

    // Adicionar uma classe pelo seu nome.
    $container->add(BillingService::class);

Sua aplicação e plugins definem os serviços que possuem no
método hook ``services()``::

    // em src/Application.php
    namespace App;

    use App\Service\BillingService;
    use Cake\Core\ContainerInterface;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function services(ContainerInterface $container): void
        {
            $container->add(BillingService::class);
        }
    }

Você pode definir implementações para interfaces que sua aplicação usa::

    use App\Service\AuditLogServiceInterface;
    use App\Service\AuditLogService;

    // no seu método Application::services().

    // Adicionar uma implementação para uma interface.
    $container->add(AuditLogServiceInterface::class, AuditLogService::class);

O container pode aproveitar funções de factory para criar objetos se necessário::

    $container->add(AuditLogServiceInterface::class, function (...$args) {
        return new AuditLogService(...$args);
    });

Funções de factory receberão todas as dependências resolvidas para a classe
como argumentos.

Uma vez que você definiu uma classe, você também precisa definir as dependências que ela
requer. Essas dependências podem ser objetos ou valores primitivos::

    // Adicionar um valor primitivo como string, array ou número.
    $container->add('apiKey', 'abc123');

    $container->add(BillingService::class)
        ->addArgument('apiKey');

Seus serviços podem depender de ``ServerRequest`` em actions de controller, pois será
adicionado automaticamente.

Adicionando Serviços Compartilhados
------------------------------------

Por padrão, os serviços não são compartilhados. Cada objeto (e dependências) é criado
cada vez que é obtido do container. Se você quiser reutilizar uma única
instância, frequentemente referida como singleton, você pode marcar um serviço como 'compartilhado'::

    // no seu método Application::services().

    $container->addShared(BillingService::class);

Estendendo Definições
---------------------

Uma vez que um serviço é definido, você pode modificar ou atualizar a definição do serviço
estendendo-o. Isso permite que você adicione argumentos adicionais a serviços definidos
em outro lugar::

    // Adicionar um argumento a um serviço parcialmente definido em outro lugar.
    $container->extend(BillingService::class)
        ->addArgument('logLevel');

Marcando Serviços com Tags
---------------------------

Ao marcar serviços com tags, você pode obter todos esses serviços resolvidos ao mesmo
tempo. Isso pode ser usado para construir serviços que combinam coleções de outros
serviços, como em um sistema de relatórios::

    $container->add(BillingReport::class)->addTag('reports');
    $container->add(UsageReport::class)->addTag('reports');

    $container->add(ReportAggregate::class, function () use ($container) {
        return new ReportAggregate($container->get('reports'));
    });

Usando Dados de Configuração
-----------------------------

Frequentemente você precisará de dados de configuração em seus serviços. Embora você possa adicionar
todas as chaves de configuração que seu serviço precisa no container, isso pode ser
tedioso. Para tornar a configuração mais fácil de trabalhar, o CakePHP inclui um
leitor de configuração injetável::

    use Cake\Core\ServiceConfig;

    // Use uma instância compartilhada
    $container->addShared(ServiceConfig::class);

A classe ``ServiceConfig`` fornece uma visualização somente leitura de todos os dados disponíveis
em ``Configure``, então você não precisa se preocupar em alterar acidentalmente a
configuração.

Provedores de Serviços
=======================

Provedores de serviços permitem que você agrupe serviços relacionados juntos, ajudando-o a
organizar seus serviços. Provedores de serviços podem ajudar a aumentar o desempenho de sua aplicação,
pois os serviços definidos são registrados preguiçosamente após
seu primeiro uso.

Criando Provedores de Serviços
-------------------------------

Um exemplo de ServiceProvider seria assim::

    namespace App\ServiceProvider;

    use Cake\Core\ContainerInterface;
    use Cake\Core\ServiceProvider;
    // Outras importações aqui.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function services(ContainerInterface $container): void
        {
            $container->add(StripeService::class);
            $container->add('configKey', 'some value');
        }
    }

Provedores de serviços usam seu método ``services()`` para definir todos os serviços que
irão fornecer. Além disso, esses serviços **devem ser** definidos na propriedade ``$provides``.
Falhar em incluir um serviço na propriedade ``$provides`` resultará
em ele não ser carregável do container.

Usando Provedores de Serviços
------------------------------

Para carregar um provedor de serviços, adicione-o ao container usando o
método ``addServiceProvider()``::

    // no seu método Application::services().
    $container->addServiceProvider(new BillingServiceProvider());

ServiceProviders Inicializáveis
--------------------------------

Se seu provedor de serviços precisa executar lógica quando é adicionado ao container,
você pode implementar o método ``bootstrap()``. Esta situação pode surgir quando seu
provedor de serviços precisa carregar arquivos de configuração adicionais, carregar provedores de
serviços adicionais ou modificar um serviço definido em outro lugar em sua aplicação. Um
exemplo de um serviço inicializável seria::

    namespace App\ServiceProvider;

    use Cake\Core\ServiceProvider;
    // Outras importações aqui.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function bootstrap($container)
        {
            $container->addServiceProvider(new InvoicingServiceProvider());
        }
    }


.. _mocking-services-in-tests:

Mockando Serviços em Testes
============================

Em testes que usam ``ConsoleIntegrationTestTrait`` ou ``IntegrationTestTrait``
você pode substituir serviços que são injetados via container por mocks ou
stubs::

    // Em um método de teste ou setup().
    $this->mockService(StripeService::class, function () {
        return new FakeStripe();
    });

    // Se você precisa remover um mock
    $this->removeMockService(StripeService::class);

Quaisquer mocks definidos serão substituídos no container de sua aplicação durante
os testes e automaticamente injetados em seus controllers e commands. Mocks
são limpos no final de cada teste.

Auto Wiring
===========

Auto Wiring está desativado por padrão. Para habilitá-lo::

    // Em src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->delegate(
            new \League\Container\ReflectionContainer()
        );
    }

Embora suas dependências agora sejam resolvidas automaticamente, esta abordagem não
armazenará em cache as resoluções, o que pode ser prejudicial ao desempenho. Para habilitar
o cache::

    $container->delegate(
         // ou considere usar o valor de Configure::read('debug')
        new \League\Container\ReflectionContainer(true)
    );

Leia mais sobre auto wiring na `documentação do PHP League Container
<https://container.thephpleague.com/4.x/auto-wiring/>`_.
