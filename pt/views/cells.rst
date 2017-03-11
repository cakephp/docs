View Cells (Células de Visualização)
####################################

View cells são pequenos *mini-controllers* que podem invocar lógica de visualização
e renderizar templates. A ideia de *cells* é emprestada das `cells do Ruby
<https://github.com/apotonick/cells>`_, onde desempenham papel e finalidade semelhantes.

Quando usar *Cells*
===================

*Cells* são ideais para construir componentes de páginas reutilizáveis que requerem
interação com modelos, lógica de visualização, e lógica de renderizaço. Um exemplo simples
seria o carinho em uma loja online, ou um menu de navegação *data-driven* em um CMS.

Para criar uma *cell*, defina uma classe em **src/View/Cell** e um *template* 
em **src/Template/Cell/**. Nesse exemplo, nós estaremos fazendo uma *cell* para exibir
o número de mensagens em uma caixa de notificações do usuário. Primeiro, crie o arquivo da 
classe. O seu conteúdo deve se parecer com::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
        }

    }

Salve esse arquivo dentro de **src/View/Cell/InboxCell.php**. Como você pode ver, como em 
outras classes no CakePHP, *Cells* tem algumas convenções:

* As *Cells* ficam no *namespace* ``App\View\Cell``. Se você está fazendo uma *cell* em
  um *plugin*, o *namespace* seria ``NomeDoPlugin\View\Cell``.
* Os nomes das classes devem terminar com *Cell*.
* Classes devem herdar de ``Cake\View\Cell``.

Nós adicionamos um método ``display()`` vazio para nossa *cell*; esse é o método padrão 
convencional quando a *cell* é renderizada. Nós vamos abordar o uso de outros métodos
mais tarde na documentaço. Agora, crie o arquivo **src/Template/Cell/Inbox/display.ctp**. 
Esse será nosso *template* para a nossa nova *cell*.

Vocẽ pode gerar este esboço de código rapidamente usando o ``bake``::

    bin/cake bake cell Inbox

Gera o cdigo que digitamos acima.

Implementando a *Cell*
----------------------

Assumindo que nós estamos trabalhando em uma aplicação que permite que usuários enviem mensagens
um para o outro. Nós temos o modelo ``Messages``, e nós queremos mostrar a quantidade de mensagens
não lidas sem ter que poluir o *AppController*. Este é um perfeito caso de uso para uma *cell*. 
Na classe que acabamos de fazer, adicione o seguinte::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
            $this->loadModel('Messages');
            $unread = $this->Messages->find('unread');
            $this->set('unread_count', $unread->count());
        }

    }

Porque as *Cells* usam o ``ModelAwareTrait`` e o ``ViewVarsTrait``, Elas tem um comportamento
muito parecido com um *controller*. Nós podemos usar os métodos ``loadModel()`` e ``set()``
como faríamos em um *controller*. Em nosso arquivo de *template*, adicione o seguinte::

    <!-- src/Template/Cell/Inbox/display.ctp -->
    <div class="notification-icon">
        Você tem <?= $unread_count ?> mensagen não lidas.
    </div>

.. note::

    *Cell templates* têm um escopo isolado que não compartilha a mesma instância
    da view utilizada para processar o *template* e o *layout* para o
    *controller* ou outras *cells*. Assim, eles não sabem de nenhuma chamada de helper
    feita ou blocos definidos no *template* / layout da *action* e vice-versa.
    
Carregando *Cells*
==================

*Cells* podem ser carregadas nas *views* usando o método ``cell()`` e funciona da mesma
forma em ambos os contextos::

    // Carrega uma *cell* da aplicação
    $cell = $this->cell('Inbox');

    // Carrega uma *cell* de um plugin
    $cell = $this->cell('Messaging.Inbox');

O código acima irá carregar a célula nomeada e executar o método ``display()``.
Você pode executar outros método usando o seguinte::

    // Executa o método *Run* na *cell* *Inbox*
    $cell = $this->cell('Inbox::expanded');

Se você precisa de lógica no *controller* para decidir quais *cells* serão carregadas em uma requisição,
você pode usar o ``CellTrait`` no seu *controller* para habilitar o método ``cell()`` lá::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\View\CellTrait;

    class DashboardsController extends AppController
    {
        use CellTrait;

        // More code.
    }

Passando argumento para a *Cell*
--------------------------------

Você muitas vezes vai querer parametrizar métodos da *cell* para fazer *cells* mais flexíveis.
Usando o segundo e terceiro argumento do método ``cell()``, você pode passar parametros de ação
e opções adicionais para suas classes de *cell*, como um array indexado::

    $cell = $this->cell('Inbox::recent', ['-3 days']);

O código acima corresponderia a seguinte assinatura de função::

    public function recent($since)
    {
    }
    
Renderizando uma Cell
=====================

Uma vez a célula carregada e executada, você provavelmente vai querer renderizá-la. A maneira mais fácil
para renderizar uma *cell* é dando um *echo*::

    <?= $cell ?>

Isso irá renderizar o *template* correspondente a versão minuscula e separada com underscore do nome da 
nossa action, e.g. **display.ctp**.

Porque as *cells* usam ``View`` para renderizar *templates*, você pode carregar *cells* adicionais
dentro do template da *cell* se necessário.

.. note::

    O *echo* da *cell* usa o método PHP mágico ``__toString()`` para prevenir o PHP
    de mostrar o nome do arquivo e o número da linha caso algum erro fatal seja disparado. 
    Para obter uma mensagem de erro significativa, é remomendado usar o método ``Cell::render()``,
    por exemplo ``<?= $cell->render() ?>``.
    
Renderizando template alternativos
----------------------------------

Por convenção *cells* renderizam *templates* que correspondem a *action* que está sendo executada.
Se você precisar renderizar um *template* de visualizaço diferente, você pode especificar o *template* 
para usar quando estiver renderizando a *cell*::

    // Chamando render() explicitamente
    echo $this->cell('Inbox::recent', ['-3 days'])->render('messages');

    // Especificando o template antes de executar *echo* da *cell*
    $cell = $this->cell('Inbox');
    $cell->template = 'messages';
    echo $cell;

Caching Cell Output
-------------------

Ao renderizar uma célula, você pode querer armazenar em cache a saída renderizada se o conteúdo
não mudar frequentemente ou para ajudar a melhorar o desempenho do sua aplicação. Você pode
definir a opção ``cache`` ao criar uma célula para ativar e configurar o cache::

    // Faz cache usando a configuração padrão e uma chave gerada
    $cell = $this->cell('Inbox', [], ['cache' => true]);

    // Faz cache usando uma configuração especifica a uma chave gerada
    $cell = $this->cell('Inbox', [], ['cache' => ['config' => 'cell_cache']]);

    // Especificando a chave e a configuração utilizada
    $cell = $this->cell('Inbox', [], [
        'cache' => ['config' => 'cell_cache', 'key' => 'inbox_' . $user->id]
    ]);

Se uma chave é gerada a versão sublinhada da classe da *cell* e o nome do *template* 
serão usados

.. note::

    Uma nova instância da ``View`` é usada para cada *cell* e esses novos objetos não 
    compartilham o contexto com o *template* principal/*layout*. Cada *cell* é *self-contained* 
    e somente tem acesso as variaveis passadas como argumento pelo chamada do método ``View::cell()``.
