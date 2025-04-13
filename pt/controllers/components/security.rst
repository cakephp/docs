Security (Segurança)
####################

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

O componente de segurança cria uma maneira fácil de integrar maior segurança ao
seu aplicativo. Ele fornece métodos para várias tarefas, como:

* Restringindo quais métodos HTTP seu aplicativo aceita.
* Proteção contra violação de formulário
* Exigindo que o SSL seja usado.
* Limitar a comunicação entre controladores.

Como todos os componentes, ele é ajustado através de vários parâmetros configuráveis.
Todas essas propriedades podem ser definidas diretamente ou através de métodos setter
com o mesmo nome no ``beforeFilter()`` do seu controlador.

Ao usar o componente de segurança, você obtém automaticamente proteção
contra violação de formulários. Os campos de token oculto são inseridos
automaticamente nos formulários e verificados pelo componente Security.

Se você estiver usando os recursos de proteção de formulário do componente
Security e outros componentes que processam dados do formulário em seus
retornos de chamada ``startup()``, certifique-se de colocar o Componente
de Segurança antes desses componentes no método ``initialize()``.

.. note::

    Ao usar o componente de segurança, você deve usar o FormHelper para criar seus
    formulários. Além disso, você não deve substituir nenhum dos atributos "name" dos
    campos. O componente de segurança procura determinados indicadores criados e
    gerenciados pelo FormHelper (especialmente aqueles criados em
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` e :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`).
    Alterar dinamicamente os campos que são enviados em uma solicitação POST (por exemplo,
    desativar, excluir ou criar novos campos via JavaScript) provavelmente fará com
    que a solicitação seja enviada como retorno a um blackhole.

    Você sempre deve verificar o método HTTP que está sendo usado antes da execução
    para evitar efeitos colaterais. Você deve :ref:`check the HTTP method <check-the-request>`
    ou usar :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` para garantir que
    o método HTTP correto seja usado.

Como Lidar com Retornos de Chamada Blackhole
============================================

.. php:method:: blackHole(Controller $controller, string $error = '', ?SecurityException $exception = null)

Se uma ação for restringida pelo Componente de Segurança, ela será 'ocultada em preto'
como uma solicitação inválida que resultará em um erro 400 por padrão. Você pode configurar
esse comportamento definindo a opção de configuração ``blackHoleCallback`` como uma função
de retorno de chamada no controlador.

Ao configurar um método de retorno de chamada, você pode personalizar como o processo do
blackhole funciona::

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->Security->setConfig('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type, SecurityException $exception)
    {
        if ($exception->getMessage() === 'Request is not SSL and the action is required to be secure') {
            // Reescreva a mensagem de exceção com uma sequência traduzível.
            $exception->setMessage(__('Please access the requested page through HTTPS'));
        }

        // Lance novamente a exceção reformulada condicionalmente.
        throw $exception;

        // Como alternativa, lide com o erro, ex.: defina uma mensagem flash e
        // redirecione para a versão HTTPS da página solicitada.
    }

O parâmetro ``$type`` pode ter os seguintes valores:

* 'auth' Indica um erro de validação do formulário ou um erro de incompatibilidade de controlador/ação.
* 'secure' Indica uma falha de restrição do método SSL.

Restringir Ações ao SSL
=======================

.. php:method:: requireSecure()

    Define as ações que requerem uma solicitação protegida por SSL.
    Leva qualquer número de argumentos. Pode ser chamado sem argumentos
    para forçar todas as ações a exigir um SSL protegido.

.. php:method:: requireAuth()

    Define as ações que requerem um token válido gerado pelo Componente de segurança.
    Leva qualquer número de argumentos. Pode ser chamado sem argumentos para forçar
    todas as ações a exigir uma autenticação válida.

Restringindo a Comunicação entre Controladores
==============================================

allowedControllers
    Uma lista de controladores que podem enviar solicitações para esse controlador.
    Isso pode ser usado para controlar solicitações entre controladores.
allowedActions
    Uma lista de ações que têm permissão para enviar solicitações para as ações deste controlador.
    Isso pode ser usado para controlar solicitações entre controladores.

Essas opções de configuração permitem restringir a comunicação entre controladores.

Prevenção de Adulteração de Formulários
=======================================

Por padrão, o ``SecurityComponent`` impede que os usuários adulterem formulários de
maneiras específicas. O `` SecurityComponent`` impedirá o seguinte:

* Campos desconhecidos não podem ser adicionados ao formulário.
* Os campos não podem ser removidos do formulário.
* Os valores nas entradas ocultas não podem ser modificados.

A prevenção desses tipos de adulteração é realizada trabalhando com o ``FormHelper`` e
rastreando quais campos estão em um formulário. Os valores para campos ocultos também
são rastreados. Todos esses dados são combinados e transformados em um hash. Quando um
formulário é enviado, o ``SecurityComponent`` usará os dados do POST para criar a mesma
estrutura e comparar o hash.

.. note::

    O SecurityComponent **não** impede que as opções selecionadas sejam adicionadas/alteradas.
    Nem impedirá que as opções de rádio sejam adicionadas/alteradas.

unlockedFields
    Defina para uma lista de campos de formulário a serem excluídos da validação
    do POST. Os campos podem ser desbloqueados no Component ou com :php:meth:`FormHelper::unlockField()`.
    Os campos que foram desbloqueados não precisam fazer parte do POST e os
    campos desbloqueados ocultos não têm seus valores verificados.

validatePost
    Defina como ``false`` para ignorar completamente a validação
    de solicitações POST, essencialmente desativando a validação de formulário.

Uso
===

Geralmente, o uso do componente de segurança é feito no ``beforeFilter()`` do
controlador. Você especificaria as restrições de segurança que deseja e o
Componente de Segurança as aplicará em sua inicialização::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }
    }

O exemplo acima forçaria todas as ações que tinham roteamento de
administrador a exigir solicitações SSL seguras::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security', ['blackHoleCallback' => 'forceSSL']);
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }

        public function forceSSL($error = '', SecurityException $exception = null)
        {
            if ($exception instanceof SecurityException && $exception->getType() === 'secure') {
                return $this->redirect('https://' . env('SERVER_NAME') . Router::url($this->request->getRequestTarget()));
            }

            throw $exception;
        }
    }

Este exemplo forçaria todas as ações que tinham roteamento de administrador a
exigir solicitações SSL seguras. Quando a solicitação é ocultada em preto, ele
chama o retorno de chamada ``forceSSL()``, que redirecionará solicitações não
seguras para proteger solicitações automaticamente.

.. _security-csrf:

Proteção CSRF
=============

CSRF ou falsificação de solicitação entre sites é uma vulnerabilidade comum em
aplicativos da web. Ele permite que um invasor capture e reproduza uma solicitação
anterior e, às vezes, envie solicitações de dados usando tags ou recursos de imagem
em outros domínios. Para habilitar os recursos de proteção CSRF, use :ref:`csrf-middleware`.

Desabilitando o Componente de Segurança para Ações Específicas
==============================================================

Pode haver casos em que você deseja desativar todas as verificações de
segurança de uma ação (por exemplo, solicitações AJAX). Você pode "desbloquear"
essas ações listando-as em ``$this->Security->unlockedActions`` em seu ``beforeFilter()``.
A propriedade ``unlockedActions`` **não** afeta outros recursos do ``SecurityComponent``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(EventInterface $event)
        {
            parent::beforeFilter($event);

            $this->Security->setConfig('unlockedActions', ['edit']);
        }
    }

Este exemplo desabilitaria todas as verificações de segurança da ação de edição.

.. meta::
    :title lang=pt: Segurança
    :keywords lang=pt: parâmetros configuráveis, componente de segurança, parâmetros de configuração, solicitação inválida, recursos de proteção, segurança mais rígida, holing, classe php, meth, erro 404, período de inatividade, csrf, matriz, envio, classe de segurança, desativar segurança, unlockActions
