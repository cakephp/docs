Sistema de Eventos
##################

Criar aplicações com facilidade de manutenção é ambos. uma ciência e uma arte
É de conhecimento geral que a chave para ter um código de qqualidade é fazer
objetos desacoplados e coesos ao mesmo tempo. Coesão significa que todos os
metodos e propriedades de uma classe são fortemente relacionados a classe em sí
e não está tentando fazer o trabalho que deveriam ser feitos por outros objetos,
equanto o desacoplamento é a medida de quão "estranha" uma classe é para objetos
externos. e quanto dessa classes depende desses objetos.

Existem alguns casos onde você precisa se comunicar com outras partes da
aplicação, sem existir dependencias diretamente no código ("hardcoded"), 
diminuindo, assim, a coesão e aumentando o acoplamento. Usar o padrão Observer ,
que permite que objetos sejam notificados por outros objetos e anonymous listeners
sobre mudanças é um padrão que ajuda a atingir esse objetivo.

Listeners no observer pattern podem se inscrever para eventos e escolher se deve
agir, caso seja relevante, Se você já usou JavaScript tem uma boa chance de que 
você já esteja familiar com programação orientada a eventos

O CakePHP emula vários desses aspectos de quando objetos são engatilhados e
gerenciados em bibliotecas populares de JavaScript, como Jquery. Na implementação
do CakePHP um evento é disparado para todos os listeners (ouvintes). O objeto event 
tem as informações do evento e a habilidade de parar a propagação de um evento em 
qualquer ponto do evento. Listeners podem se registrar ou delegar essa tarefa 
para outros objetos e tem a chance de alterar o estado  e do evento em si pelo 
resto dos callbacks

O subsistema de eventos é o coração dos callbacks do Model, Behavior, Controller, 
View e Helper. Se você já usou um deles, você já é de alguma forma familiar com os
eventos no CakePHP

Exemplo de uso dos eventos
==========================

Vamos assumir que você está construindo um plugin de carrinho de complas, e gostaria
de focar somente na lógica de lidar com o pedido. Você não quer incluir nenhuma 
lógica de envios, notificar os usuários ou incrementar/remover um item do estoque.
Mas essas são tarefas importantes para pessoas que vão usar o seu plugin. Se você não
estivesse usando eventos, você poderia tentar implementar isso incluindo Bahaviors no
seu Model, ou adicionando Components no seu Controller. Fazer isso é um desavio na 
maioria das vezes, já que você teria que adicionar código para carregar externamente
esses Behaviors, ou adicionar hooks ao Controller do seu plugin.

Você pode usar eventos para permitir que você separe as responsabilidades do seu 
código e permitir que outras responsabilidades se inscrevem nos eventos so seu plugin.
Por exemplo, no plugin de carrinho você tem um Model Orders que cria os pedidos, 
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

O exemplo acima permite você notificar outras partes da aplicação que um pedido foi 
e você pode, então, enviar emails, notificações, atualizar o estoque, fazer o log das
estatísticas relevantes e outras tarefas em um objeto separado que foca nessas 
responsabilidades.

Acessando os Gerenciadores de Evento (Event Menagers)
=====================================================

No CakePHP os eventos são disparados para os gerenciadores de evento (event 
managers). Gerenciadores de evento disponíveis estão em todas as Table, View e 
Controller, utilizando ``getEventManager()``::

    $events = $this->getEventManager();

Cada Model tem o seu próprio gerenciadoe de evento, enquando View e Controller 
compartilham o mesmo, Isso permite que os eventos dos Models sejam isolados, e
permitem os Components ou Controller reagirem a eventos criados na View, caso 
necessário.

Gerenciador de Eventos Global
-----------------------------

Adicionalmente aos gerenciadores de evento no nível da instância, CakePHP provê um 
gerenciador de evento global, que permite ouvir a qualquer evento disparado pela
aplicação. isso é útil quando anexar Listeners a uma instancia pode ser incômodo ou 
difícil. O gerenciador de eventos global é um singleton de
:php:class:`Cake\\Event\\EventManager`. Listeners anexados ao gerenciados de eventos
global são ser executados antes dos Listeners de instâncias com a mesma prioridade.
você pode acessar o gerenciador de eventos glocal utilizando o metodo estático::

    // Em qualquer arquivo de configuração ou arquivo que seja executado *antes* do evento
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Model.Order.afterPlace',
        $aCallback
    );

Uma coisa que deve ser levada em conta é que existem eventos com o mesmo nome, mas 
com assuntos digerentes, então verificar se o evento é requerido em qualquer função 
que é anexada globalmente, desse modo, evitando bugs, lembre-se que com a 
flexibilidade de um gerenciador de evento global, uma certa complexidade é adicionada.

O metodo :php:meth:`Cake\\Event\\EventManager::dispatch()` aceita o objeto do evento
como um argumento, e notifica a todos os Listener e Callbacks parrando esse objeto 
adiante. Os Listeners vão lidar com toda a lógica extra liagada ao evento 
``afterPlace``, você pode logar o horário, enviar emails atualizar estatísticas do 
usuário em objetos separados, ou menos deletar isso para tarefas offline que você 
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
chamando :php:meth:`Cake\\Event\\EventList::trackEvents(false)`.

.. versionadded:: 3.2.11
    Rastreamento de eventos e :php:class:`Cake\\Event\\EventList` foram adicionados.

Core Events
===========

Existem vários eventos que fazem parte do core do framework o qual a sua aplicação
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
estatísticas globais do site. Essa é uma ótimo exemplo de onde usar uma classe 
Listener. Fazendo isso permite você se concentrar nas lógica das estatísticas em um 
local e responder ao eventos como necessários. Nosso listener ``UserStatistics`` pode 
comoçar como abaixo::

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
-----------------------------

Enquanto objeto de Event Listerners são geralmente um melhor método para implementar 
Listeners você pode utilizar uma ``callable`` como Event Listener. Por exempl se nós 
quisessemos colocar qualquer pedido nos nos arquivos de log, nós poderiamos utilizar
uma função anomima para isso::

    use Cake\Log\Log;

    $this->Orders->getEventManager()->on('Model.Order.afterPlace', function ($event) {
        Log::write(
            'info',
            'A new order was placed with id: ' . $event->getSubject()->id
        );
    });

Além de funções anonimas você pode usar qualquer outro callable qual o PHP suporta::

    $events = [
        'email-sending' => 'EmailSender::sendBuyEmail',
        'inventory' => [$this->InventoryManager, 'decrement'],
    ];
    foreach ($events as $callable) {
        $eventManager->on('Model.Order.afterPlace', $callable);
    }

Quando trabalhamos com plugins que não dispara eventos especificos, você pode 
utilizar Event Listeners dos eventos padão. Vamos pensar no exemplo o plugin 
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

    TableRegistry::get('ThirdPartyPlugin.Feedbacks')
        ->getEventManager()
        ->on('Model.afterSave', function($event, $entity)
        {
        	// Por exemplo, podemos mandar um email para o admin
			Antes do 3.4 use os metodos from()/to()/subject()
            $email = new Email('default');
            $email->setFrom(['info@yoursite.com' => 'Your Site'])
                ->setTo('admin@yoursite.com')
                ->setSubject('New Feedback - Your Site')
                ->send('Body of message');
        });

Você pode usar esse mesmo método para ligar a objetos Listener.

Interagindo com Listeners Existentes
------------------------------------

Assumindo que você inúmeros Event Listeners estão registrados na precença ou ausencia 
de um padrão de eventos particular pode ser usando como base para alguma ação.::

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

.. versionadded:: 3.2.3
    O método ``matchingListeners`` retorna uma array com eventos que batem com o padrão
     de busca.

.. _event-priorities:

Estabelecendo Prioridades
-------------------------

Em alguns casos você pode querer controlar a ordem em que os Listeners são
invocados, pot exemplo, se nós voltarmos ao nosso exemplo das estatísticas do 
usuários. Seria ideal se esse Listener fosse chamado no final do stack. Ao chamar no 
final do stack de listener, nós garantimos que o evento não foi cancelado e que, 
nenhum outro listeners retornou exceptions. Nós podemos também pegar o estado final 
dos objetos, no caso de outros listeners possam ter modificado o objeto do assunto ou
do evento.

Prioridades são definidas como inteiros (integer) quando adicionadas ao listener. 
Quando maior for o número, mais tarde esse metodo será disparado. A prioridade padrão
para todos os listeners é ``10``. Se você precisa que o seu médoto rode antes,
utilizando um valor menor que o padrão vai funcionar. Por outro lado se você deseja 
rodar o seu callback depois dos outros, usando um número acima de 10 tamb´em vai 
funcionar.

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
precisa usar uma array para especificar o metodo callable e a preferencia de 
prioridade. A chave ``callable`` é uma array especial que o gerenciador vai ler para 
saber qual função na classe ele deverá chamar.

Pagando Dados do Evento como Argumentos da Função
-------------------------------------------------

Quando eventos tem dados definidos no seu construtor, esses dados são convertidos em 
argumentos para os listeners. Um exemplo da camada ViewView é o afterRender callback::

    $this->getEventManager()
        ->dispatch(new Event('View.afterRender', $this, ['view' => $viewFileName]));

Os listeners do callback ``View.afterRender`` devem ter a seguinte assinatura::

    function (Event $event, $viewFileName)

Cada valor provido no construtor to Event será convertido em um parametro da função
na ordem em que eles aparecem no array de dados. Se você usa uma array associativa 
o resultado de ``array_values`` determinará o argumento da função.

.. note::
    Diferente do CakePHP 2.x, converter dados para os arqumentos do listener é o 
    compartamento padrão e não pode ser alterado.

Disparando Eventos
==================

Uma vez que você tem uma instancia do event manager você pode disparar eventos 
utilizando :php:meth:`~Cake\\Event\\EventManager::dispatch()`. Esse método aceita uma
instancia da class :php:class:`Cake\\Event\\Event`. Camos ver como dispara um evento::

    // Um event listener tem que ser instanciado antes de disparar um evento.
    // Crie um evento e dispare ele.
    $event = new Event('Model.Order.afterPlace', $this, [
        'order' => $order
    ]);
    $this->getEventManager()->dispatch($event);

:php:class:`Cake\\Event\\Event` aceita 3 argumentos no seu construtor. O primeiro é o 
nome do evento, você deve tentar manter esse nome o mais único possível, ainda assim, 
deve ser de fácil entendimento . Nós sugerimos a seguinte convenção:
``Camada.nomeDoEvento`` para eventos acontecendo a nível de uma camada (ex.
``Controller.startup``, ``View.beforeRender``) e ``Camada.Classe.NomeDoEvento`` para 
eventos que acontecen em uma classe especifica em uma camada, exemplo 
``Model.User.afterRegister`` or ``Controller.Courses.invalidAccess``.

O segundo argumento é o ``assunto`` (subject), e significa o objeto associado ao 
evento, normalmente quando uma classe está acionando sobre ela mesma, usar ``$this``
será o caso mais comum. Apesar de um Component também poder disparar eventos do 
Controller. O assunto da classe é importante já que os listeners vão conseguir acesso
imediato para as propriedades do objeto e tem a chance de inspaciona ou alterar em
tempo de execução.

Finalmente o terceiro argumento é qualquer dado adicional que você deseja envias ao 
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
baseado no evento sendo parado ou não. Geralmente não faz sentido parar um evento 
'depois' do evento, mas parar 'antes' do evento é normalmente impede toda a operação 
de acontecer.

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

No exemplo anterior o pedido não será salvo se o eveto for parardo durante o 
processamento do callback ``beforePlace``.

Pagando o Resultado de um Evento 
--------------------------------

Toda vez que um callback retorna um valor não nulo ou não falso, ele é armazenado na 
propriedade ``$result`` do objeto do evento. Isso é útil quando você quer permitir 
callbacks a modificar a execução do evento. Vajamos novamente nosso exemplo 
``beforePlace``e vamos deixar os callbacks modififcar os dados de ``$order``.

Resultados de eventos podem ser alterados utilizando o resultado do objeto do evento 
diretamente ou retornando o valor no próprio callback::

    // Um listener callback
    public function doSomething($event)
    {
        // ...
        $alteredData = $event->getData('order') + $moreData;
        return $alteredData;
    }
    // Outro listener callback
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

É possível alterar qualquer propriedade do objeto do evento e ter novos dados 
passados para o próximo callback. Na maioria das vezes, prover objetos como dados de
eventos ou resultado, e diretamente alterar o objeto é a melhor solução como ja que a
referência é mantida e modificações são compartilhadas com todos os callbacks.

Removento Callbacks e Listeners
--------------------------------

Se por qualquer motivo você quiser remover os callbacks do gerenciados de eventos é 
só chamar o método :php:meth:`Cake\\Event\\EventManager::off()` utilizando os 
arqumentos dos primeiros 2 parametros e anexando::

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

    // Removendo uma única chave de um evento em um listener
    $this->getEventManager()->off('My.event', $listener);

    // Removento todos os callbacks implemantados por um listener
    $this->getEventManager()->off($listener);

Eventos são uma ótima maneira de separar responsabilidades na sua aplicação e fazer 
com que classes sejam coesivas e desacopladas. Eventos podem ser utilizados para 
desacoplar o código de uma aplicação e fazer extensivel via plugins.

Tenha em mente que com grandes poderes, vem grandes responsabilidades. Utilizar 
muitos eventos podem fazer com que seja difícil de debugar a sua aplicação e podem
requerer mais testes de integração.

Leia Mais
=========

* :doc:`/orm/behaviors`
* :doc:`/controllers/components`
* :doc:`/views/helpers`
* :ref:`testing-events`

.. meta::
    :title lang=en: Events system
    :keywords lang=en: events, dispatch, decoupling, cakephp, callbacks, triggers, hooks, php
