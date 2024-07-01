Componentes
###########

Componentes são pacotes de lógica compartilhados entre controladores. O CakePHP
vem com um conjunto fantástico de componentes principais que você pode usar para
ajudar em várias tarefas comuns. Você também pode criar seus próprios componentes.
Se você deseja copiar e colar coisas entre controladores, considere criar seu próprio
componente para conter a funcionalidade. A criação de componentes mantém o código do
controlador limpo e permite reutilizar o código entre diferentes controladores.

Para mais informações sobre os componentes incluídos no CakePHP, consulte o
capítulo para cada componente:

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling

.. _configuring-components:

Configurando Componentes
========================

Muitos dos componentes principais requerem configuração. Alguns exemplos de componentes
que requerem configuração são :doc:`/controllers/components/security` e
:doc:`/controllers/components/request-handling`. A configuração desses componentes e dos
componentes em geral é geralmente feita via ``loadComponent()`` no método ``initialize()``
do seu Controlador ou através do array ``$components``::

    class PostsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler', [
                'viewClassMap' => ['json' => 'AppJsonView'],
            ]);
            $this->loadComponent('Security', ['blackholeCallback' => 'blackhole']);
        }

    }

Você pode configurar componentes em tempo de execução usando o método ``setConfig()``.
Muitas vezes, isso é feito no método ``beforeFilter()`` do seu controlador. O exemplo acima
também pode ser expresso como::

    public function beforeFilter(EventInterface $event)
    {
        $this->RequestHandler->setConfig('viewClassMap', ['rss' => 'MyRssView']);
    }

Como os auxiliares, os componentes implementam os métodos ``getConfig()`` e
``setConfig()`` para ler e gravar dados de configuração::

    // Leia os dados de configuração.
    $this->RequestHandler->getConfig('viewClassMap');

    // Definir configuração
    $this->Csrf->setConfig('cookieName', 'token');

Assim como os auxiliares, os componentes mesclam automaticamente sua propriedade
``$ _defaultConfig`` com a configuração do construtor para criar a propriedade
``$_config`` que pode ser acessada com ``getConfig()`` e ``setConfig()``.

Alias em Componentes
--------------------

Uma configuração comum a ser usada é a opção ``className``, que permite o alias
de componentes. Esse recurso é útil quando você deseja substituir ``$this->Auth``
ou outra referência de componente comum por uma implementação personalizada::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize(): void
        {
            $this->loadComponent('Auth', [
                'className' => 'MyAuth'
            ]);
        }
    }

    // src/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent
    {
        // Adicione seu código para substituir o principal AuthComponent
    }

O exemplo acima seria *alias* ``MyAuthComponent`` para ``$this->Auth`` em seus controladores.

.. note::

    O alias de um componente substitui essa instância em qualquer lugar em que esse componente
    seja usado, inclusive dentro de outros componentes.

Carregando Componentes em Tempo Real
------------------------------------

Você pode não precisar de todos os seus componentes disponíveis em todas as ações do controlador.
Em situações como essa, você pode carregar um componente em tempo de execução usando o método
``loadComponent()`` no seu controlador::

    // Em um método do controlador
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    Lembre-se de que os componentes carregados em tempo real não terão retornos de chamada perdidos.
    Se você confiar nos retornos de chamada ``beforeFilter`` ou ``startup`` que estão sendo chamados,
    pode ser necessário chamá-los manualmente, dependendo de quando você carregar o componente.

Usando Componentes
==================

Depois de incluir alguns componentes no seu controlador, usá-los é bastante simples.
Cada componente usado é exposto como uma propriedade no seu controlador. Se você
carregou a classe :php:class:`Cake\\Controller\\Component\\FlashComponent` no seu
controlador, é possível acessá-lo da seguinte maneira::

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
                $this->Flash->success('Post deleted.');

                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    Como os Modelos e os Componentes são adicionados aos Controladores
    como propriedades, eles compartilham o mesmo 'namespace'. Certifique-se
    de não dar o mesmo nome a um componente de um modelo.

.. _creating-a-component:

Criando um Componente
=====================

Suponha que nosso aplicativo precise executar uma operação matemática complexa
em muitas partes diferentes do aplicativo. Poderíamos criar um componente para
hospedar essa lógica compartilhada para uso em muitos controladores diferentes.

O primeiro passo é criar um novo arquivo e classe de componente. Crie o arquivo em
**src/Controller/Component/MathComponent.php**. A estrutura básica do componente
será semelhante a isso::

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

    Todos os componentes devem estender :php:class:`Cake\\Controller\\Component`.
    Não fazer isso acionará uma exceção.

Incluindo seu Componente em seus Controladores
----------------------------------------------

Depois que nosso componente é concluído, podemos usá-lo nos controladores
do aplicativo carregando-o durante o método ``initialize()`` do controlador.
Uma vez carregado, o controlador receberá um novo atributo com o nome do componente,
através do qual podemos acessar uma instância dele::

    // Em um controlador
    // Disponibilize o novo componente em $this->Math,
    // bem como o padrão $this->Csrf
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Csrf');
    }

Ao incluir componentes em um controlador, você também pode declarar
um conjunto de parâmetros que serão passados para o construtor do componente.
Esses parâmetros podem ser manipulados pelo componente::

    // Em seu controlador
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ]);
        $this->loadComponent('Csrf');
    }

O exemplo acima passaria um array contendo precision e randomGenerator
para ``MathComponent::initialize()`` no parâmetro ``$config``.

Usando Outros Componentes em seu Componente
-------------------------------------------

Às vezes, um de seus componentes pode precisar usar outro componente.
Nesse caso, você pode incluir outros componentes no seu componente
exatamente da mesma maneira que os inclui nos controladores - usando o
atributo ``$components``::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // O outro componente que seu componente usa
        public $components = ['Existing'];

        // Execute qualquer outra configuração adicional para o seu componente.
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

    Ao contrário de um componente incluído em um controlador,
    nenhum retorno de chamada será acionado no componente de um componente.

Acessando o Controlador de um Componente
----------------------------------------

De dentro de um componente, você pode acessar o controlador atual através do
registro::

    $controller = $this->_registry->getController();

Você pode acessar o controlador em qualquer método de retorno de chamada do objeto de
evento::

    $controller = $event->getSubject();

Callback de Componentes
=======================

Os componentes também oferecem alguns retornos de chamada do ciclo de vida da solicitação que
permitem aumentar o ciclo da solicitação.

.. php:method:: beforeFilter(EventInterface $event)

    É chamado antes do método beforeFilter do controlador,
    mas *após* o método initialize() do controlador.

.. php:method:: startup(EventInterface $event)

    É chamado após o método beforeFilter do controlador,
    mas antes que o controlador execute o manipulador de ações atual.

.. php:method:: beforeRender(EventInterface $event)

    É chamado após o controlador executar a lógica da ação solicitada,
    mas antes de o controlador renderizar visualizações e layout.

.. php:method:: shutdown(EventInterface $event)

    É chamado antes que a saída seja enviada ao navegador.

.. php:method:: beforeRedirect(EventInterface $event, $url, Response $response)

    É chamado quando o método de redirecionamento do controlador é chamado,
    mas antes de qualquer ação adicional. Se esse método retornar ``false``,
    o controlador não continuará redirecionando a solicitação. Os parâmetros
    $url e $response permitem inspecionar e modificar o local ou qualquer outro
    cabeçalho na resposta.

.. meta::
    :title lang=pt: Componentes
    :keywords lang=pt: array controlador,bibliotecas principais, solicitação de autenticação, nome de array, listas de controle de acesso, componentes públicos, código do controlador, componentes principais, cookiemonster, cookie de login, definições de configuração, funcionalidade, lógica, sessões, cakephp, doc
