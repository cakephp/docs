Componentes
###########

Componentes (`components`) são pacotes com funções lógicas que são usadas para
serem compartilhadas entre os controllers. Se você está querendo copiar e colar
coisas entre seus controllers, talvez seja uma boa ideia considerar a
possibilidade de empacotar estas funcionalidades em componentes.

O CakePHP também já vem com uma quantidade fantástica de componentes incluídos,
que você pode usar para lhe ajudar com:

- Segurança
- Sessões
- Lista de Controle de Acesso (do inglês ACL, `Access control lists`)
- Emails
- Cookies
- Autenticação
- Tratamento de Requisições

Cada um destes componentes do Cake são detalhados em seus próprios capítulos.
Neste momento, nós lhe mostraremos como criar e usar seus próprios componentes.
Criar componentes mantem o código dos controllers limpos e permitem a
reutilização de códigos entre projetos.

.. _configuring-components:

Configurando Componentes
========================

Muitos dos componentes incluídos no Cake requerem alguma configuração. Exemplos
de componentes que requerem configuração são:
:doc:`/core-libraries/components/authentication`,
:doc:`/core-libraries/components/cookie` e
:doc:`/core-libraries/components/email`.
As configurações para estes componentes, e outros em geral, são feitas no array
``$components`` ou no método ``beforeFilter()`` do seu controller::

    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array('controller' => 'users', 'action' => 'login')
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

O exemplo acima seria um exemplo de como configurar um componente usando o array
``$components``. Todos os componentes incluídos no Cake permitem ser
configurados desta forma. Além disso, você pode configurar componentes no
método ``beforeFilter()`` de seus controllers. Isto é útil quando você precisa
atribuir os resultados de uma função para uma propriedade do componente. O
exemplo acima também pode ser expressado da seguinte maneira::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }

É possível, no entanto, que um componente requeira que certa configuração seja
feita antes do método ``beforeFilter()`` do controller ser executado. Para este
fim, alguns componentes permitem que configurações sejam feitas no array
``$components``::

    public $components = array('DebugKit.Toolbar' => array('panels' => array('history', 'session')));

Consulte a documentação relevante para determinar quais opções de configuração
cada componente oferece.

Usando Componentes
==================

Após ter incluído alguns componentes em seu controller, usá-los é muito simples.
Cada componente que você usa é exposto como uma propriedade em seu controller.
Se você carregou o :php:class:`SessionComponent` e o :php:class:`CookieComponent`
no seu controller, você pode acessá-los da seguinte maneira::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');
        
        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    Como os models e componentes são adicionados no controller como propriedades
    eles compartilham o mesmo espaço de nomes (``namespace``). Tenha certeza de
    não ter um componente e um model com o mesmo nome.

Carregando componentes sob demanda
----------------------------------

Você pode não precisar de todos os componentes disponibilizados em cada ação
dos controllers. Nestas situações você pode carregar um componente em tempo de
execução usando o :doc:`Component Collection </core-libraries/collections>`.
Dentro de um controller você pode fazer o seguinte::
    
    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();


Callbacks de Componentes
========================

Componentes também oferecem alguns callbacks do ciclo de vida de uma requisição,
permitindo acrescentar rotinas ao fluxo. Veja a
:ref:`component-api` para mais informações sobre os callbacks que os componentes
oferecem.

Criando um Componente
=====================

Suponhamos que nossa aplicação online precisa realizar uma operação matemática
complexa em diferentes partes da aplicação. Podemos criar um componente para
abrigar esta lógica para ser usada nos diferentes controllers.

O primeiro passo é criar um novo arquivo para a classe do componente.
Crie o arquivo em ``/app/Controller/Component/MathComponent.php``. A estrutura
básica para o componente irá se parecer com algo assim::

    
    class MathComponent extends Component {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    Todos os componentes devem estender a classe :php:class:`Component`.
    Se não fizer isto, o Cake irá disparar uma exceção.

Incluindo seus componentes nos seus controllers
-----------------------------------------------

Após nosso componente estiver pronto, podemos usá-lo nos controllers da nossa
aplicação pondo o nome do componente (sem o sufixo "Component") no array
``$components`` do controller. O controller irá receber um novo atributo com
o mesmo nome do componente, o qual poderemos acessá-lo como sendo uma instância
da classe componente que queremos.

::

    /* Torna o novo componente acessível em $this->Math,
    bem como o $this->Session */
    public $components = array('Math', 'Session');

Componentes declarados no ``AppController`` serão mesclados com os de outros
controllers. Então não há necessidade de redeclarar o mesmo componente duas
vezes.

Ao incluir componentes em um controller você também pode declarar um conjunto de
parâmetros que serão passados ​​para o construtor do componente. Estes parâmetros
podem ser usados pelo componente.

::

    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

O exemplo acima irá passar no segundo parâmetro do construtor
``MathComponent::__construct()`` um array contendo o atributo "precision" e
"randomGenerator".

Por convenção, qualquer configuração que você tenha passado e que também seja
um atributo público do seu componente, irá ter seu valor definido com base no
array.

Usando outros componentes nos seus Componentes
----------------------------------------------

Às vezes, um de seus componentes poderá precisar usar outro componente.
Neste caso você pode incluir outros componentes no seu da mesma forma que inclui
em controllers, usando o atributo ``$components``::

    // app/Controller/Component/CustomComponent.php
    class CustomComponent extends Component {
        // O outro componente que seu componente utiliza
        public $components = array('Existing'); 
    
        function initialize(Controller $controller) {
            $this->Existing->foo();
        }
    
        function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    class ExistingComponent extends Component {
    
        function initialize(Controller $controller) {
            $this->Parent->bar();
        }
     
        function foo() {
            // ...
       }
    }

.. _component-api:

API dos Componentes
===================

.. php:class:: Component

    A classe base ``Component`` oferece alguns métodos para carregar sob
    demanda (Lazy loading. Possibilita adiar a inicialização de um objeto até
    que este seja utilizado) outros componentes utilizando o
    :php:class:`ComponentCollection` assim como lidar com as configurações
    básicas. Esta classe também fornece os protótipos para todos os callbacks
    dos componentes.

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    O contrutor da classe ``Component``. Todos as propriedades públicas da
    classe terão seus valores alterados para corresponder com o valor de
    ``$settings``.

Callbacks
---------

.. php:method:: initialize($controller)

    O método ``initialize`` é chamado antes do método ``beforeFilter`` do
    controller.

.. php:method:: startup($controller)

    O método ``startup`` é chamado após o método ``beforeFilter`` do controller
    mas antes que o controller execute a ação.

.. php:method:: beforeRender($controller)

    O método ``beforeRender`` é chamado após o controller executar a lógica
    da ação requisitada mas antes que o controller renderize a view e o layout.

.. php:method:: shutdown($controller)

    O método ``shutdown`` é chamado antes que o conteúdo seja enviado para o
    browser.

.. php:method:: beforeRedirect($controller, $url, $status=null, $exit=true)

    O método ``beforeRedirect`` é invocado quando o método ``redirect`` de um
    controller é chamado mas antes de qualquer ação. Se este método retornar
    ``false`` o controller não irá continuar com o redirecionamento. As
    variáveis ``$url``, ``$status`` e ``$exit`` possuem o mesmo significado do
    método do controller. Você pode também retornar uma string que será
    interpretada como uma URL para ser usada no redirecionamento ou retornar um
    array associativo com a chave 'url' e opcionalmente com a chave 'status' e
    a chave 'exit'.
