Componentes
###########

Componentes são pacotes de lógica compartilhados entre controllers.
O CakePHP vem com um conjunto fantástico de componentes principais que você pode usar para auxiliar em
várias tarefas comuns. Você também pode criar seus próprios componentes. Se você
quiser copiar e colar coisas entre controllers, deve
considerar criar seu próprio componente para conter a funcionalidade. Criar
componentes mantém o código do controller limpo e permite que você reutilize código entre
diferentes controllers.

Para mais informações sobre os componentes incluídos no CakePHP, confira o
capítulo de cada componente:

.. toctree::
    :maxdepth: 1

    /controllers/components/flash
    /controllers/components/form-protection
    /controllers/components/check-http-cache

.. _configuring-components:

Configurando Componentes
========================

Muitos dos componentes principais exigem configuração. Um exemplo seria
o :doc:`/controllers/components/form-protection`. A configuração desses componentes,
e de componentes em geral, geralmente é feita via ``loadComponent()`` no método ``initialize()`` do seu
Controller ou via array ``$components``::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection', [
                'unlockedActions' => ['index'],
            ]);
            $this->loadComponent('Flash');
        }
    }

Você pode configurar componentes em tempo de execução usando o método ``setConfig()``. Frequentemente,
isso é feito no método ``beforeFilter()`` do seu controller. O exemplo acima
também poderia ser expresso como::

    public function beforeFilter(EventInterface $event): void
    {
        $this->FormProtection->setConfig('unlockedActions', ['index']);
    }

Assim como os helpers, os componentes implementam os métodos ``getConfig()`` e ``setConfig()``
para ler e escrever dados de configuração::

    // Ler dados de configuração.
    $this->FormProtection->getConfig('unlockedActions');

    // Definir configuração
    $this->Flash->setConfig('key', 'myFlash');

Assim como os auxiliares, os componentes mesclarão automaticamente sua propriedade ``$_defaultConfig``
com a configuração do construtor para criar a propriedade ``$_config``
que pode ser acessada com ``getConfig()`` e ``setConfig()``.

Aliasing Componentes
--------------------

Uma configuração comum é a opção ``className``, que permite
criar alias para componentes. Este recurso é útil quando você deseja
substituir ``$this->Flash`` ou outra referência comum a Componentes por uma
implementação personalizada::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize(): void
        {
            $this->loadComponent('Flash', [
                'className' => 'MyFlash',
            ]);
        }
    }

    // src/Controller/Component/MyFlashComponent.php
    use Cake\Controller\Component\FlashComponent;

    class MyFlashComponent extends FlashComponent
    {
        // Adicione seu código para substituir o FlashComponent principal
    }

O comando acima seria um *alias* de ``MyFlashComponent`` para ``$this->Flash`` em seus
controllers.

.. note::

    Criar um alias para um componente substitui essa instância em qualquer lugar em 
    que o componente seja usado, inclusive dentro de outros componentes.

Carregando Componentes em Rempo Real
-----------------------------

Você pode não precisar de todos os seus componentes disponíveis em todas as ações do controller.
Em situações como essa, você pode carregar um componente em tempo de execução usando o método
``loadComponent()`` no seu controller:

    // Na ação do controller
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    Lembre-se de que os componentes carregados em tempo real não terão chamadas de retorno de chamada
    perdidas. Se você depender da chamada dos retornos de chamada ``beforeFilter`` ou ``startup``
    , poderá ser necessário chamá-los manualmente, dependendo de quando
    você carregar seu componente.

Usando Componentes
==================

Depois de incluir alguns componentes no seu controller, usá-los é bem
simples. Cada componente usado é exposto como uma propriedade no seu controller. Se
você tivesse carregado a :php:class:`Cake\\Controller\\Component\\FlashComponent`
no seu controller, você poderia acessá-lo assim::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Post deletado.');

                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    Como Modelos e Componentes são adicionados aos Controllers como
    propriedades, eles compartilham o mesmo "namespace". Certifique-se de não dar a um
    componente e a um modelo o mesmo nome.

.. versionchanged:: 5.1.0
    Os componentes podem usar :doc:`/development/dependency-injection` para receber serviços.

.. _creating-a-component:

Criando um Componente
=====================

Suponha que nossa aplicação precise realizar uma operação matemática complexa em
várias partes diferentes da aplicação. Poderíamos criar um componente para abrigar
essa lógica compartilhada para uso em diversos controllers.

O primeiro passo é criar um novo arquivo de componente e uma nova classe. Crie o arquivo em
**src/Controller/Component/MathComponent.php**. A estrutura básica do
componente seria algo como isto::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

    Todos os componentes devem estender :php:class:`Cake\\Controller\\Component`. Caso contrário,
    uma exceção será acionada.

Os componentes podem usar :doc:`/development/dependency-injection` para receber serviços
como parâmetros do construtor::

    namespace App\Controller\Component;

    use Cake\Controller\Component;
    use App\Service\UserService;

    class SsoComponent extends Component
    {
        public function __construct(
            ComponentRegistry $registry,
            array $config = [],
            UserService $users
        ) {
            parent::__construct($registry, $config);
            $this->users = $users;
        }
    }

.. versionadded: 5.1.0
   Foi adicionado suporte ao contêiner DI para componentes.

Incluindo seu Componente no seu Controller
------------------------------------------

Assim que nosso componente estiver pronto, podemos usá-lo nos controllers
da aplicação, carregando-o durante o método ``initialize()`` do controllers.
Uma vez carregado, o controllers receberá um novo atributo com o nome do
componente, por meio do qual podemos acessar uma instância dele::

    // Em um controlador
    // Disponibilize o novo componente em $this->Math,
    // assim como o $this->Flash padrão
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Flash');
    }

Ao incluir Componentes em um Controller, você também pode declarar um
conjunto de parâmetros que serão passados ​​ao construtor
do Componente. Esses parâmetros podem então ser manipulados
pelo Componente::

    // No seu controller.
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand',
        ]);
        $this->loadComponent('Flash');
    }

O exemplo acima passaria o array contendo precision e randomGenerator para
``MathComponent::initialize()`` no parâmetro ``$config``.

Usando Outros Componentes no seu Componente
-------------------------------------------

Às vezes, um dos seus componentes pode precisar usar outro componente.
Você pode carregar outros componentes adicionando-os à propriedade `$components`::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // O outro componente que seu componente usa
        protected array $components = ['Existing'];

        // Execute qualquer outra configuração adicional para seu componente.
        public function initialize(array $config): void
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
        }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {
        public function foo()
        {
            // ...
        }
    }

.. note::

    Ao contrário de um componente incluído em um controller,
    nenhum retorno de chamada será acionado no componente de um componente.

Acessando um Componente de Controller
-------------------------------------

De dentro de um Componente, você pode acessar o controller atual por meio do
registro::

    $controller = $this->getController();

Retornos de Chamada de Componentes
==================================

Os componentes também oferecem alguns retornos de chamada do ciclo de vida da 
solicitação que lhes permitem aumentar o ciclo da solicitação.

.. php:method:: beforeFilter(EventInterface $event)

    É chamado antes do método
    beforeFilter() do controller, mas *depois* do método initialize() do controller.

.. php:method:: startup(EventInterface $event)

    É chamado após o método beforeFilter() do controller,
    mas antes que o controller execute o manipulador de ação
    atual.

.. php:method:: beforeRender(EventInterface $event)

    É chamado após o controller executar a lógica da ação solicitada,
    mas antes do controller renderizar as visualizações e o layout.

.. php:method:: afterFilter(EventInterface $event)

    É chamado durante o evento ``Controller.shutdown``, antes da saída ser enviada ao navegador.

.. php:method:: beforeRedirect(EventInterface $event, $url, Response $response)

    É invocado quando o método de redirecionamento
    do controller é chamado, mas antes de qualquer ação adicional. Se este método
    retornar ``false``, o controller não continuará redirecionando a
    solicitação. Os parâmetros $url e $response permitem que você inspecione e modifique
    a localização ou quaisquer outros cabeçalhos na resposta.

.. _redirect-component-events:

Usando Redirecionamentos em Eventos de Componentes
==================================================

Para redirecionar de dentro de um método de retorno de chamada de componente, você pode usar o seguinte::

    public function beforeFilter(EventInterface $event): void
    {
        if (...) {
            $event->setResult($this->getController()->redirect('/'));

            return;
        }

        ...
    }

Ao definir um redirecionamento como resultado do evento, você informa ao CakePHP que não deseja que nenhum outro
retorno de chamada de componente seja executado e que o controller não deve mais manipular a ação.
A partir da versão 4.1.0, você pode lançar uma ``RedirectException`` para sinalizar
um redirecionamento::

    use Cake\Http\Exception\RedirectException;
    use Cake\Routing\Router;

    public function beforeFilter(EventInterface $event): void
    {
        throw new RedirectException(Router::url('/'))
    }

Gerar uma exceção interromperá todos os outros ouvintes de eventos e criará uma nova
resposta que não retém ou herda nenhum dos cabeçalhos da resposta atual.
Ao gerar uma ``RedirectException``, você pode incluir cabeçalhos adicionais::

    throw new RedirectException(Router::url('/'), 302, [
        'Header-Key' => 'value',
    ]);

.. meta::
    :title lang=pt: Componentes
    :keywords lang=pt: array controlador,bibliotecas principais, solicitação de autenticação, nome de array, listas de controle de acesso, componentes públicos, código do controlador, componentes principais, cookiemonster, cookie de login, definições de configuração, funcionalidade, lógica, sessões, cakephp, doc
