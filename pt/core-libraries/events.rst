Sistema de Eventos
##################

Criar aplicações com facilidade de manutenção é uma ciência e uma arte ao mesmo tempo.
É de conhecimento geral que a chave para ter um código de qualidade é fazer
objetos desacoplados e coesos ao mesmo tempo. Coesão significa que todos os
metodos e propriedades de uma classe são fortemente relacionados entre classes em sí
e não estão tentando fazer o trabalho que deveria ser feito por outros objetos,
equanto o desacoplamento é a medida de quão "estranha" uma classe é para objetos
externos e o quanto essa classe depende desses objetos.

Existem alguns casos onde você precisa se comunicar com outras partes da
aplicação, sem existir dependências diretamente no código ("hardcoded"),
diminuindo, assim, a coesão e aumentando o acoplamento. Usar o padrão Observer,
que permite que objetos sejam notificados por outros objetos e ouvintes anônimos
sobre mudanças. Observer é um padrão que ajuda a atingir esse objetivo.

Ouvintes no padrão observer podem se inscrever para eventos e escolher se deve
agir, caso seja relevante. Se você já usou JavaScript tem uma boa chance de que
você já esteja familiarizado com programação orientada a eventos.

O CakePHP emula vários desses aspectos de quando objetos são engatilhados e
gerenciados em bibliotecas populares de JavaScript, como jQuery. Na implementação
do CakePHP um evento é disparado para todos os listeners (ouvintes). O objeto event
tem as informações do evento e a habilidade de parar a propagação de um evento em
qualquer ponto do evento. Ouvintes podem se registrar ou delegar essa tarefa
para outros objetos e tem a chance de alterar o estado do evento em si pelo
resto dos callbacks.

O subsistema de eventos é o coração dos callbacks de Model, Behavior, Controller,
View e Helper. Se você já usou um deles, você já está de alguma forma familiarizado com os
eventos no CakePHP.

Exemplo de Uso dos Eventos
==========================

Vamos assumir que você está construindo um plugin de carrinho de compras e gostaria
de focar somente na lógica de lidar com o pedido. Você não quer incluir nenhuma
lógica de envios, notificação dos usuários ou incrementar/remover um item do estoque.
Mas, essas são tarefas importantes para pessoas que vão usar o seu plugin. Se você não
estivesse usando eventos, você poderia tentar implementar isso incluindo Bahaviors no
seu Model, ou adicionando Components no seu Controller. Fazer isso é um desvio na
maioria das vezes, já que você teria que adicionar código para carregar externamente
esses Behaviors, ou adicionar hooks ao Controller do seu plugin.

Você pode usar eventos para permitir que você separe as responsabilidades do seu
código e permitir que outras responsabilidades se inscrevam nos eventos do seu plugin.
Por exemplo, no plugin de carrinho você tem um model Orders que cria os pedidos,
você gostaria de notificar o resto da aplicação que um pedido foi criado, para manter
o Model Orders limpo você poderia usar eventos::

    // Cart/Model/Table/OrdersTable.php
    namespace Cart\Model\Table;

    use Cake\Event\Event;
    use Cake\ORM\Table;

    class OrdersTable extends Table
    {
        public function place($order)
        {
            if ($this->save($order)) {
                $this->Cart->remove($order);
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);

                return true;
            }

            return false;
        }
    }

.. deprecated:: 3.5.0
    Use ``getEventManager()``.

O exemplo acima permite você notificar outras partes da aplicação em que um pedido foi feito
e você pode então, enviar emails, notificações, atualizar o estoque, fazer o log das
estatísticas relevantes e outras tarefas em um objeto separado que foca nessas
responsabilidades.

Acessando os Gerenciadores de Evento (Event Menagers)
=====================================================

No CakePHP os eventos são disparados para os gerenciadores de evento (event
managers). Gerenciadores de evento disponíveis estão em todas as Table, View e
Controller, utilizando ``getEventManager()``::

    $events = $this->getEventManager();

Cada Model tem o seu próprio gerenciador de evento, enquando View e Controller
compartilham o mesmo, Isso permite que os eventos dos Models sejam isolados, e
permitem os Components ou Controller reagirem a eventos criados na View, caso
necessário.

Gerenciador de Eventos Global
-----------------------------

Adicionado aos gerenciadores de evento no nível da instância, o CakePHP provê um
gerenciador de evento global, que permite ouvir a qualquer evento disparado pela
aplicação. isso é útil quando anexar Ouvintes a uma instancia pode ser incômodo ou
difícil. O gerenciador de eventos global é um singleton de
:php:class:`Cake\\Event\\EventManager`. Ouvintes anexados ao gerenciador de eventos
global são executados antes dos Ouvintes de instâncias com a mesma prioridade.
você pode acessar o gerenciador de eventos glocal utilizando o metodo estático::

    // Em qualquer arquivo de configuração ou arquivo que seja executado *antes* do evento
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Model.Order.afterPlace',
        $aCallback
    );

Uma coisa que deve ser levada em conta é que existem eventos com o mesmo nome, mas
com assuntos divergentes, então verificar se o evento é requerido em qualquer função
que é anexada globalmente, desse modo, evitando bugs, lembre-se que com a
flexibilidade de um gerenciador de evento global, uma certa complexidade é adicionada.

O metodo :php:meth:`Cake\\Event\\EventManager::dispatch()` aceita o objeto do evento
como um argumento, e notifica a todos os Ouvintes e Callbacks parando esse objeto
adiante. Os Ouvintes vão lidar com toda a lógica extra ligada ao evento
``afterPlace``, você pode, enviar emails, atualizar estatísticas do
usuário em objetos separados, ou também delegar isso para tarefas offline que você
possa precisar.

.. _tracking-events:

Rastreando Eventos
------------------

Para manter uma lista de eventos que são disparados em um ``EventManager``, você pode
habilitar o rastreamento de eventos (event tracking). Para fazer isso anexe um
:php:class:`Cake\\Event\\EventList` ao gerenciador::

    EventManager::instance()->setEventList(new EventList());

Após disparar um evento para o gerenciador você pode recuperar ele da lista de
eventos::

    $eventsFired = EventManager::instance()->getEventList();
    $firstEvent = $eventsFired[0];

O rastreamento de eventos pode ser desabilitado ao remover a lista de eventos ou
chamando :php:meth:`Cake\\Event\\EventManager::trackEvents(false)`.

Eventos do Core
===============

Existem vários eventos que fazem parte do core do framework o qual a sua aplicação pode
ouvir. Cada camada do CakePHP emite um evento que você pode utilizar na sua aplicação.

* :ref:`ORM/Model events <table-callbacks>`
* :ref:`Controller events <controller-life-cycle>`
* :ref:`View events <view-events>`

.. _registering-event-listeners:

Registrando Listeners
=====================

Listeners são o meio preferido para registrar callbacks de qualquer evento. Isso é
feito implementando a interface :php:class:`Cake\\Event\\EventListenerInterface`
em qualquer classe que você deseje registrar um callback. Classes implementando a
interface devem ter o metodo ``implementedEvents()``. Esse método deve retornar um
array associativo com o nome de todos os eventos que a classe vai gerenciar.

Para continuar o exemplo anterior, vamos imaginas que temos uma classe UserStatistic
responsável por calcular o histórico de compras do usuário, e compilar nas
estatísticas globais do site. Esse é um ótimo exemplo de onde usar uma classe
Listener. Fazendo isso permite você se concentrar nas lógica das estatísticas em um
local e responder ao eventos como necessários. Nosso listener ``UserStatistics`` pode
começar como abaixo::

    use Cake\Event\EventListenerInterface;

    class UserStatistic implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'updateBuyStatistic',
            ];
        }

        public function updateBuyStatistic($event, $order)
        {
            // Código para atualizar as estatísticas

            // Code to update statistics
        }
    }

    // Anexa o objeto UserStatistic para o gerenciador de evento da Order
    $statistics = new UserStatistic();
    $this->Orders->getEventManager()->on($statistics);

Como você pôde ver nó código acima, o metodo ``on()`` aceita instancias da interface
``EventListener``. Internamente o gerenciador de eventos vai utilizar os
``implementedEvents()`` para anexar ao callback corretamente.

Registrando Listeners Anônimos
------------------------------

Enquanto objeto de Event Listerners são geralmente um melhor método para implementar
Listeners você pode utilizar uma ``callable`` como Event Listener. Por exemplo, se nós
quisessemos colocar qualquer pedido nos arquivos de log, nós poderiamos utilizar
uma função anônima para isso::

    use Cake\Log\Log;

    $this->Orders->getEventManager()->on('Model.Order.afterPlace', function ($event) {
        Log::write(
            'info',
            'A new order was placed with id: ' . $event->getSubject()->id
        );
    });

Além de funções anônimas você pode usar qualquer outro callable no qual o PHP suporta::

    $events = [
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => [$this->InventoryManager, 'decrement'],
    ];
    foreach ($events as $callable) {
        $eventManager->on('Model.Order.afterPlace', $callable);
    }

Quando trabalhamos com plugins que não dispara eventos especificos, você pode
utilizar Event Listeners dos eventos padrão. Vamos pensar, por exemplo o plugin
'UserFeedback' que lida com o feedback dos usuários. A partir da sua aplicação, você
poderia querer saber quando um feedback foi salvo no banco de dados e intervir nele.
Você pode utilizar o gerenciador de eventos global para pegar o evento
``Model.afterSave``. No entendo, você pode pegar um caminho mais direto. e escutar
somente o que você realmente precisa::

    // Você pode criar o código a seguir antes de persistir os dados no banco
    // exemplo no config/bootstrap.php

    use Cake\ORM\TableRegistry;
    // Se está enviando emails
    use Cake\Mailer\Email;

    TableRegistry::getTableLocator()->get('ThirdPartyPlugin.Feedbacks')
        ->getEventManager()
        ->on('Model.afterSave', function($event, $entity)
        {
        	// Por exemplo, podemos mandar um email para o admin
		// Antes da versão 3.4 use os métodos from()/to()/subject()
            $email = new Email('default');
            $email->setFrom(['info@yoursite.com' => 'Your Site'])
                ->setTo('admin@yoursite.com')
                ->setSubject('New Feedback - Your Site')
                ->send('Body of message');
        });

Você pode usar esse mesmo método para ligar a objetos Listener.

Interagindo com Listeners Existentes
------------------------------------

Supondo que vários ouvintes de eventos tenham sido registrados, a presença ou ausência de um padrão de
evento específico pode ser usada como base de alguma ação::

    // Anexa Listeners ao EventManager.
    $this->getEventManager()->on('User.Registration', [$this, 'userRegistration']);
    $this->getEventManager()->on('User.Verification', [$this, 'userVerification']);
    $this->getEventManager()->on('User.Authorization', [$this, 'userAuthorization']);

    // Em algum outro local da sua aplicação.
    $events = $this->getEventManager()->matchingListeners('Verification');
    if (!empty($events)) {
        // Executa a lógica relacionada a precença do Event Listener 'Verification'.
        // Por exemplo, remover o Listener caso esteja presente.
        $this->getEventManager()->off('User.Verification');
    } else {
        // Executa a lógica relacionada a ausencia do event listener 'Verification'
    }

.. note::
    O padrão passado para o método ``matchingListeners`` é case sensitive.

.. _event-priorities:

Estabelecendo Prioridades
-------------------------

Em alguns casos você pode querer controlar a ordem em que os Listeners são
invocados, por exemplo, se nós voltarmos ao nosso exemplo das estatísticas do
usuários. Seria ideal se esse Listener fosse chamado no final da pilha. Ao chamar no
final do pilha de ouvintes, nós garantimos que o evento não foi cancelado e que,
nenhum outro listeners retornou exceptions. Nós podemos também pegar o estado final
dos objetos, no caso de outros ouvintes possam terem modificado o objeto de assunto ou
do evento.

Prioridades são definidas como inteiros (integer) quando adicionadas ao ouvinte.
Quando maior for o número, mais tarde esse metodo será disparado. A prioridade padrão
para todos os listeners é ``10``. Se você precisa que o seu método seja executado antes,
utilize um valor menor que o padrão. Por outro lado se você deseja
rodar o seu callback depois dos outros, usando um número acima de ``10`` será suficiente.

Se dois callbacks tiverem a mesma prioridade, eles serão executados de acordo com a
ordem em que foram adicionados. Você pode definir as prioridades utilizando o
método ``on()`` para callbacks, e declarando no método ``implementedEvents()`` para
os Event Listeners::

    // Definindo a prioridade para um callback
    $callback = [$this, 'doSomething'];
    $this->getEventManager()->on(
        'Model.Order.afterPlace',
        ['priority' => 2],
        $callback
    );

    // Definindo a prioridade para um Listener
    class UserStatistic implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => [
                    'callable' => 'updateBuyStatistic',
                    'priority' => 100
                ],
            ];
        }
    }

Como você pôde ver, a principal diferença entre objetos ``EventListener`` é que você
precisa usar uma array para especificar o metodo callable e a preferência de
prioridade. A chave ``callable`` é uma array especial que o gerenciador vai ler para
saber qual função na classe ele deverá chamar.

Obtendo Dados do Evento como Argumentos da Função
-------------------------------------------------

Quando eventos tem dados definidos no seu construtor, esses dados são convertidos em
argumentos para os ouvintes. Um exemplo da camada ViewView é o afterRender callback::

    $this->getEventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

Os ouvintes do callback ``View.afterRender`` devem ter a seguinte assinatura::

    function (Event $event, $viewFileName)

Cada valor fornecido ao construtor Event será convertido em parâmetros de função na
ordem em que aparecem na matriz de dados. Se você usar uma matriz associativa, o
resultado ``array_values`` determinará a ordem dos argumentos da função.

.. note::
    Diferente do CakePHP 2.x, converter dados para os arqumentos do listener é o
    comportamento padrão e não pode ser desativado.

Disparando Eventos
==================

Uma vez que você tem uma instancia do event manager você pode disparar eventos
utilizando :php:meth:`~Cake\\Event\\EventManager::dispatch()`. Esse método aceita uma
instancia da class :php:class:`Cake\\Event\\Event`. Vamos ver como disparar um evento::

    // Um event listener tem que ser instanciado antes de disparar um evento.
    // Crie um evento e dispare ele.
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->getEventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` aceita três argumentos no seu construtor. O primeiro é o
nome do evento, você deve tentar manter esse nome o mais único possível, ainda assim,
deve ser de fácil entendimento . Nós sugerimos a seguinte convenção:
``Camada.nomeDoEvento`` para eventos acontecendo a nível de uma camada (ex.
``Controller.startup``, ``View.beforeRender``) e ``Camada.Classe.NomeDoEvento`` para
eventos que acontecen em uma classe especifica em uma camada, exemplo
``Model.User.afterRegister`` ou ``Controller.Courses.invalidAccess``.

O segundo argumento é o ``subject``, ou seja, o objeto associado ao evento, geralmente
quando é a mesma classe que desencadeia eventos sobre si mesmo, o uso de ``$this`` será o
caso mais comum. Embora um componente também possa disparar eventos do controlador.
A classe de assunto é importante porque os ouvintes terão acesso imediato às propriedades
do objeto e terão a chance de inspecioná-las ou alterá-las rapidamente.

Finalmente o terceiro argumento é qualquer dado adicional que você deseja enviar ao
evento. Esses dados podem ser qualquer coisa que você considere útil enviar aos
listeners. Enquanto esse argumento pode ser de qualquer tipo, nós recomendamos que
seja uma array associativa.

O medoto :php:meth:`~Cake\\Event\\EventManager::dispatch()` aceita um objeto de
evento como argumento e notifica a todos os listeners inscritos.

.. _stopping-events:

Parando Eventos
---------------

Assim como nos eventos do DOM, você pode querer parar um evento para previnir que
outros listeners sejam notificados. Você pode ver isso em ação nos Callbacks do model
(ex. beforeSave) onde é possível parar o operação de persistir os dados se o código
decidir que não pode continuar

Para parar um evento você pode retornar ``false`` nos seus callbacks ou
chamar o método ``stopPropagation()`` no objeto do evento::

    public function doSomething($event)
    {
        // ...
        return false; // Para o evento
    }

    public function updateBuyStatistic($event)
    {
        // ...
        $event->stopPropagation();
    }

Parar um evento vai previnir que qualquer callback adicional seja chamado.
Além disso o código que disparou o evento pode se comportar de maneira diferente
baseado no evento sendo parado ou não. Geralmente não faz sentido parar 'depois' do evento,
mas parar 'antes' do evento costuma ser usado para impedir toda a operação de acontecer.

Para verificar se um evento foi parado você pode chamar o metodo ``isStopped()`` no
objeto do evento object::

    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->getEventManager()->dispatch($event);
        if ($event->isStopped()) {
            return false;
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

No exemplo anterior o pedido não será salvo se o evento for parado durante o
processamento do callback ``beforePlace``.

Parando o Resultado de um Evento
--------------------------------

Toda vez que um callback retorna um valor não nulo ou não falso, ele é armazenado na
propriedade ``$result`` do objeto do evento. Isso é útil quando você quer permitir
callbacks a modificar a execução do evento. Vajamos novamente nosso exemplo
``beforePlace``e vamos deixar os callbacks modififcar os dados de ``$order``.

Resultados de eventos podem ser alterados utilizando o resultado do objeto do evento
diretamente ou retornando o valor no próprio callback::

    // Um callback de ouvinte
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;

        return $alteredData;
    }
    // Outro callback
    public function doSomethingElse($event)
    {
        // ...
        $event->setResult(['order' => $alteredData] + $this->result());
    }

    // Utilizando o resultado do evento
    public function place($order)
    {
        $event = new Event('Model.Order.beforePlace', $this, ['order' => $order]);
        $this->getEventManager()->dispatch($event);
        if (!empty($event->getResult()['order'])) {
            $order = $event->getResult()['order'];
        }
        if ($this->Orders->save($order)) {
            // ...
        }
        // ...
    }

É possível alterar qualquer propriedade do objeto de evento e passar os novos
dados para o próximo retorno de chamada. Na maioria dos casos, fornecer objetos
como dados ou resultado de eventos e alterar diretamente o objeto é a melhor
solução, pois a referência é mantida a mesma e as modificações são compartilhadas
em todas as chamadas de retorno de chamada.

Removento Callbacks e Ouvintes
------------------------------

Se por qualquer motivo você desejar remover os callbacks do gerenciador de eventos é
só chamar o método :php:meth:`Cake\\Event\\EventManager::off()` utilizando como argumentos os
dois primeiros parâmetros usados para anexá-lo::

    // Adicionando uma função
    $this->getEventManager()->on('My.event', [$this, 'doSomething']);

    // Removendo uma função
    $this->getEventManager()->off('My.event', [$this, 'doSomething']);

    // Adicionando uma função anônima.
    $myFunction = function ($event) { ... };
    $this->getEventManager()->on('My.event', $myFunction);

    // Removendo uma função anônima
    $this->getEventManager()->off('My.event', $myFunction);

    // Adicionando um EventListener
    $listener = new MyEventLister();
    $this->getEventManager()->on($listener);

    // Removendo uma única chave de um evento em um ouvinte
    $this->getEventManager()->off('My.event', $listener);

    // Removento todos os callbacks implemantados por um ouvinte
    $this->getEventManager()->off($listener);

Eventos são uma ótima maneira de separar responsabilidades na sua aplicação e fazer
com que classes sejam coesas e desacopladas. Eventos podem ser utilizados para
desacoplar o código de uma aplicação e fazer extensão via plugins.

Lembre-se de que com grande poder vem uma grande responsabilidade. Usar muitos
eventos pode dificultar a depuração e exigir testes adicionais de integração.

Leitura Adicional
=================

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`

.. meta::
    :title lang=pt-br: Sistema de Eventos
    :keywords lang=pt-br: eventos, dispatch, desacoplar, cakephp, callbacks, gatilhos, hooks, php
