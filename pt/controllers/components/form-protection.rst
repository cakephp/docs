Componente FormProtection
##########################

.. php:class:: FormProtection(ComponentCollection $collection, array $config = [])

O componente FormProtection fornece proteção contra adulteração de dados de formulário.

Como todos os componentes, ele é configurado por meio de diversos parâmetros configuráveis.
Todas essas propriedades podem ser definidas diretamente ou por meio de métodos setter
de mesmo nome nos métodos ``initialize()`` ou ``beforeFilter()`` do seu controller.

Se você estiver usando outros componentes que processam dados de formulário em seus retornos 
de chamada ``startup()``, certifique-se de colocar o componente FormProtection antes desses 
componentes no seu método ``initialize()``.

.. note::

    Ao usar o Componente FormProtection, você **deve** usar o FormHelper para criar
    seus formulários. Além disso, você **não** deve substituir nenhum dos atributos "name"
    dos campos. O Componente FormProtection procura por certos indicadores que são
    criados e gerenciados pelo FormHelper (especialmente aqueles criados em
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` e
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). Alterar dinamicamente
    os campos enviados em uma solicitação POST, como desabilitar, excluir
    ou criar novos campos via JavaScript, provavelmente causará falha na validação do token
    do formulário.

Prevenção de adulteração de formulários
=======================================

Por padrão, o ``FormProtectionComponent`` impede que os usuários alterem
formulários de maneiras específicas. Isso impedirá o seguinte:

* A ação do formulário (URL) não pode ser modificada.
* Campos desconhecidos não podem ser adicionados ao formulário.
* Campos não podem ser removidos do formulário.
* Valores em entradas ocultas não podem ser modificados.

A prevenção desses tipos de adulteração é realizada trabalhando com o ``FormHelper``
e rastreando quais campos estão em um formulário. Os valores dos campos ocultos também são
rastreados. Todos esses dados são combinados e transformados em um hash, e os campos de token ocultos
são inseridos automaticamente nos formulários. Quando um formulário é enviado,
o ``FormProtectionComponent`` usará os dados POST para construir a mesma estrutura
e comparar o hash.

.. note::

    O FormProtectionComponent **não** impedirá que opções selecionadas sejam
    adicionadas/alteradas. Também não impedirá que opções de rádio sejam adicionadas/alteradas.

Uso
===

A configuração do componente de proteção de formulário geralmente é feita nos 
callbacks ``initialize()`` ou ``beforeFilter()`` do controller.

As opções disponíveis são:

validate
    Defina como ``false`` para pular completamente a validação de solicitações POST
    , essencialmente desativando a validação do formulário.

unlockedFields
    Defina uma lista de campos de formulário a serem excluídos da validação POST. Os campos podem ser
    desbloqueados no Componente ou com
    :php:meth:`FormHelper::unlockField()`. Campos que foram desbloqueados
    não precisam fazer parte do POST e campos desbloqueados ocultos não têm
    seus valores verificados.

unlockedActions
    Ações a serem excluídas das verificações de validação POST.

validationFailureCallback
    Callback para chamar em caso de falha de validação. Deve ser um Closure válido.
    Não definido por padrão, caso em que uma exceção é lançada em caso de falha de validação.

Desabilitando verificações de adulteração de formulários
========================================================

::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();

            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event): void
        {
            parent::beforeFilter($event);

            if ($this->request->getParam('prefix') === 'Admin') {
                $this->FormProtection->setConfig('validate', false);
            }
        }
    }

O exemplo acima desabilitaria a prevenção de adulteração de formulários para rotas
prefixadas pelo administrador.

Desabilitando a adulteração de formulários para ações específicas
=================================================================

Pode haver casos em que você queira desabilitar a prevenção de adulteração de formulário para uma
ação (por exemplo, solicitações AJAX). Você pode "desbloquear" essas ações listando-as em
``$this->FormProtection->setConfig('unlockedActions', ['edit']);`` no seu ``beforeFilter()``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class WidgetController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('FormProtection');
        }

        public function beforeFilter(EventInterface $event): void
        {
            parent::beforeFilter($event);

            $this->FormProtection->setConfig('unlockedActions', ['edit']);
        }
    }

Este exemplo desabilitaria todas as verificações de segurança para a ação de edição.

Lidando com falhas de validação por meio de retornos de chamada
===============================================================

Se a validação da proteção do formulário falhar, resultará em um erro 400 por padrão.
Você pode configurar esse comportamento definindo a opção de configuração ``validationFailureCallback``
para uma função de retorno de chamada no controller.

Ao configurar um método de retorno de chamada, você pode personalizar como o processo de tratamento de falhas
funciona::

    use Cake\Controller\Exception\FormProtectionException;

    public function beforeFilter(EventInterface $event): void
    {
        parent::beforeFilter($event);

        $this->FormProtection->setConfig(
            'validationFailureCallback',
            // Antes do uso do 5.2 Cake\Http\Exception\BadRequestException.
            function (FormProtectionException $exception) {
                // Você pode retornar uma instância de resposta ou lançar a exceção
                // recebida como argumento.
            }
        );
    }

.. meta::
    :title lang=pt: FormProtection
    :keywords lang=pt: parâmetros configuráveis,form protection component,configuração de parâmetros,recursos de proteção,segurança mais apertada,php class,meth,array,submissão,security class,disable security,unlockActions
