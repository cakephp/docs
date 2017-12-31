Views (Visualização)
####################

.. php:namespace:: Cake\View

.. php:class:: View

*Views* são o **V** no MVC. *Views* são responsáveis por gerar a saída específica
requerida para a requisição. Muitas vezes isso é um formulário Html, XML, ou JSON,
mas *streaming* de arquivos e criar PDF's que os usuários podem baixar também
são responsabilidades da camanda View.

O CakePHP vem com a algumas Classes View construídas para manipular os cenários de
renderização mais comuns:

- Para criar *webservices* XML ou JSON você pode usar a :doc:`views/json-and-xml-views`.
- Para servir arquivos protegidos, ou arquivos gerados dinamicamente, você pode usar :ref:`cake-response-file`.
- Para criar multiplas views com temas, você pode usar :doc:`views/themes`.

.. _app-view:

A App *View*
============

``AppView`` é sua Classe *View* default da aplicação. ``AppView`` extende a propria
``Cake\View\View``, classe incluída no CakePHP e é definida em
**src/View/AppView.php** como segue:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }

Você pode usar sua ``AppView`` para carregar *helpers* que serão usados por todas
as views renderizadas na sua aplicação. CakePHP provê um método ``initialize()`` que é
invocado no final do construtor da *View* para este tipo de uso:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {

        public function initialize()
        {
            // Sempre habilita o *helper* MyUtils
            $this->loadHelper('MyUtils');
        }

    }

.. _view-templates:

*View Templates*
================

A camada *View* do CakePHP é como você pode falar com seus usuários. A maior parte do tempo
suas views irão renderizar documentos HTML/XHTML para os browsers, mas você também pode precisar
responder uma aplicação remota via JSON, ou ter uma saída de um arquivo csv para o usuário.

Os arquivos de *template* CakePHP tem a extensão padrão **.ctp** (CakePHP Template) e utiliza a
`Sintaxe PHP alternativa <http://php.net/manual/en/control-structures.alternative-syntax.php>`_
para controlar estruturas e saídas. Esses arquivos contem a lógica necessária para preparar os
dados recebidos do *controller* para o formato de apresentação que estará pronto para o seu público.

*Echos* Alternativos
--------------------

Echo, ou imprime a variável no seu *template*::

  <?php echo $variable; ?>

Usando o suporte a Tag curta::

  <?= $variable ?>

Estruturas de controle alternativas
-----------------------------------

Estruturas de controle, como ``if``, ``for``, ``foreach``, ``switch``, e ``while``
podem ser escritas em um formato simplificado. Observe que não há chaves. Ao invés disso, a
chave de fim do``foreach`` é substituida por ``endforeach``. Cada uma das estruturas de
controle listadas anteriormente tem uma sintaxe de fechamento similar: ``endif``,
``endfor``, ``endforeach``, e ``endwhile``. Observe também que ao invés do uso
de ``ponto e virgula`` depois da estrutura do foreach (Exceto o último), existem
``dois pontos``.

O bloco a seguir é um exempo do uso de ``foreach``:

.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

Outro exemplo, usando if/elseif/else. Note os dois pontos:

.. code-block:: php

  <?php if ($username === 'sally'): ?>
     <h3>Olá Sally</h3>
  <?php elseif ($username === 'joe'): ?>
     <h3>Olá Joe</h3>
  <?php else: ?>
     <h3>Olá usuário desconhecido</h3>
  <?php endif; ?>

Se você preferir usar uma linguagem de template como
`Twig <http://twig.sensiolabs.org>`_, uma subclasse da *View* irá ligar
sua linguagem de template e o CakePHP.

Arquivos de template são armazenados em **src/Template/**, em uma pasta nomeada com o
nome do *controller*, e com o nome da ação a que corresponde.
Por exemplo, o arquivo da *View* da ação "view()" do controller *Products*, seria
normalmente encontrada em **src/Template/Products/view.ctp**.

A camada *view* do CakePHP pode ser constituida por um número diferente de partes. Cada
parte tem diferentes usos, e serão abordadas nesse capítulo:

- **views**: Templates são a parte da página que é única para a ação sendo executada.
  Eles formam o cerne da resposta da aplicação.
- **elements**: pequenos bits reúsaveis do código da *view*. *Elements* são usualmente
  renderizados dentro das *views*.
- **layouts**: Arquivos de modelo que contem código de apresentação que envolve interfaces
  da sua aplicação. A maioria das *Views* são renderizadas em um layout.
- **helpers**: Essas classes encapsulam lógica de *View* que é necessária em vários lugares
  na camada *view*. Entre outras coisas, *helpers* em CakePHP podem ajudar você a
  construir formulários, construir funcionalidades AJAX, paginar dados do *Model*,
  ou servir *feed* RSS.
- **cells**: Essas classes proveem uma miniatura de funcionalidades de um controller para criar
  conponentes de interface de usuário independentes. Veja a documentação :doc:`/views/cells`
  para mais informações.

Variáveis da *View*
-------------------

Quaisquer variáveis que você definir no seu controller com ``set()`` ficarão disponíveis
tanto na view quanto no layout que sua view renderiza. Além do mais, quaisquer variáveis
definidas também ficarão disponíveis em qualquer *element*. Se você precisa passar variáveis
adicionais da *view* para o layout você pode chamar o ``set()`` no template da *view*,
ou use os :ref:`view-blocks`.

Você deve lembrar de **sempre** escapar dados do usuário antes de fazer a saída,
pois, o CakePHP não escapa automaticamente a saída. Você pode escapar o conteúdo do usuário
com a função ``h()``::

    <?= h($user->bio); ?>

Definindo Variáveis da View
---------------------------

.. php:method:: set(string $var, mixed $value)

*Views* tem um método ``set()`` que é análogo com o ``set()`` encontrado nos objetos
*Controller*. Usando set() no arquivo da sua *view* irá adicionar as variáveis para o layout
e *elements* que irão ser renderizadas mais tarde. Veja
:ref:`setting-view_variables` para mais informações para usar o método ``set()``.

Em seu arquivo da *view* você pode fazer::

    $this->set('activeMenuButton', 'posts');

Então, em seu layout, a variável ``$activeMenuButton`` ficará disponível e conterá o valor 'posts'.

Estendendo *Views*
------------------

Estender *Views* permite a você utilizar uma view em outra. Combinando isso com os
:ref:`view blocks <view-blocks>` dá a você uma forma poderosa para deixar suas *views*
:term:`DRY`. Por Exemplo, sua aplicação tem uma *sidebar* que precisa mudar dependendo da *view*
especifica que está sendo renderizada. Ao estender um arquivo de exibição comum,
Você pode evitar repetir a marcação comum para sua barra lateral e apenas definir as partes que mudam:

.. code-block:: php

    <!-- src/Template/Common/view.ctp -->
    <h1><?= $this->fetch('title') ?></h1>
    <?= $this->fetch('content') ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?= $this->fetch('sidebar') ?>
        </ul>
    </div>

O arquivo *view* acima poderia ser usado como uma view pai. Espera-se que a view
estendida irá definir os *blocks* ``sidebar`` e ``title``. O *block* ``content``
é um *block* especial que o CakePHP cria. Irá conter todo o conteúdo não capturado
da view extendida. Assumindo que nosso arquivo da *view* tem a variável ``$post`` com
os dados sobre nosso *post*, a view poderia se parecer com isso:

.. code-block:: php

    <!-- src/Template/Posts/view.ctp -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', [
        'action' => 'edit',
        $post->id
    ]); ?>
    </li>
    <?php $this->end(); ?>

    // O conteúdo restante estará disponível como o bloco 'content'
    // na view pai.
    <?= h($post->body) ?>

A *view* do post acima mostra como você pode estender uma view, e preencher
um conjunto de *blocks*. Qualquer elemento que ainda não esteja em um *block*
definido será capturado e colocado em um *block* especial chamado ``content``.
Quando uma *view* contém uma chamada ``extend()``, a execução continua até o final
do arquivo da *view* atual. Uma vez completado, a view estendida será renderizada.
Chamando ``extend()`` mais de uma vez em um arquivo da *view* irá substituir
a view pai processada em seguida::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

A view acima irá resultar em **/Common/index.ctp** sendo renderizada como a *view*
para a view atual.

Você pode aninhar as view estendidas quantas vezes achar necessário. Cada *view* pode extender
outra *view* se necessário. Cada *view* pai irá pegar o conteúdo da *view* anterior com
o *block* ``content``.

.. note::

    Você deve evitar usar ``content`` como um nome de bloco em seu aplicativo.
    O CakePHP usa isso para conteúdo não capturado em exibições estendidas.


Você pode resgatar a lista de todos os blocos populados usand o método ``blocks()``::

    $list = $this->blocks();

.. _view-blocks:

Usando View Blocks
==================

*View blocks* provê uma API flexível que lhe permite definir slots ou blocos em
suas *views/layouts* que serão definidas em outro lugar. Por exemplo, *blocks*
são ideais para implementar coisas como *sidebars*, ou regiões para carregar *assets*
ao final/inicio do seu *layout*. *Blocks* podem ser definidos de duas formas:
Capturando um bloco, ou por atribuição direta. Os métodos ``start()``, ``append()``,
``prepend()``, ``assign()``, ``fetch()``, e ``end()`` permitem que você trabalhe
capturando blocos::

    // Cria o bloco *sidebar*.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();

    // Anexa ao *sidebar* posteriormente.
    $this->start('sidebar');
    echo $this->fetch('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

Você também pode anexar em um *block* usando ``append()``::

    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

    // O mesmo que acima.
    $this->append('sidebar', $this->element('sidebar/popular_topics'));

Se você precisa limpar ou sobrescrever um *block* há algumas alternativas.
O método ``reset()`` irá limpar ou sobrescrever um bloco em qualquer momento. O método
``assign()`` com uma string vazia também pode ser usado para limpar um *block* expecifico.::

    // Limpa o conteúdo anterior do *block* sidebar.
    $this->reset('sidebar');

    // Atribuir uma string vazia também limpará o bloco *sidebar*.
    $this->assign('sidebar', '');

.. versionadded:: 3.2
    View::reset() foi adicionado na versão 3.2

Atribuir um conteúdo de um *block* muitas vezes é usado quando você
quer converter uma varável da *view* em um bloco. Por exemplo, você pode
querer usar um *block* para a página Título e às vezes atribuir o título como uma
variável da *view* no *controller*::

    // No arquivo da *view* ou *layout* acima $this->fetch('title')
    $this->assign('title', $title);

O método ``prepend()`` permite que você prefixe conteúdo para um *block* existente::

    // Prefixa para *sidebar*
    $this->prepend('sidebar', 'this content goes on top of sidebar');

.. note::

    Você deve evitar usar ``content`` como um nome de *block*. Isto é utilizado pelo CakePHP
    Internamente para exibições estendidas e exibir conteúdo no layout.


Exibindo *Blocks*
-----------------

Você pode exibir *blocks* usando o método ``fetch()``. ``fetch()`` irá dar saída ao *block*,
retornando '' se um *block* não existir::

    <?= $this->fetch('sidebar') ?>

Você também pode usar *fetch* para condicionalmente mostrar o conteúdo que deverá caso o
*block* existir. Isso é útil em layouts, ou estender view onde você quer condicionalmente mostrar
titulos ou outras marcações:

.. code-block:: php

    // In src/Template/Layout/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?= $this->fetch('menu') ?>
    </div>
    <?php endif; ?>

Você também pode fornecer um valor padrão para o bloco se ele não existir.
Isso lhe permiti adicionar um conteúdo *placeholder* quando o *block* não existe.
Você pode definir um valor default usando o segundo argumento:

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?= $this->fetch('cart', 'Seu carrinho está vazio') ?>
    </div>

Usando *Blocks* para arquivos de script e css
---------------------------------------------

O ``HtmlHelper`` se baseia em *view blocks*, e os métodos ``script()``, ``css()``, e
``meta()`` cada um atualizam um bloco com o mesmo nome quando usados com a opção ``block = true``:

.. code-block:: php

    <?php
    // No seu arquivo da *view*
    $this->Html->script('carousel', ['block' => true]);
    $this->Html->css('carousel', ['block' => true]);
    ?>

    // No seu arquivo do *layout*.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?= $this->fetch('title') ?></title>
        <?= $this->fetch('script') ?>
        <?= $this->fetch('css') ?>
        </head>
        // Restante do seu layout abaixo

O :php:meth:`Cake\\View\\Helper\\HtmlHelper` também lhe permite controlar qual *block* o css ou script irá::

    // Na sua *view*
    $this->Html->script('carousel', ['block' => 'scriptBottom']);

    // No seu *layout*
    <?= $this->fetch('scriptBottom') ?>

.. _view-layouts:

*Layouts*
=========

Um layout contém códigos de apresentação que envolvem uma *view*. Qualquer coisa que você quer ver em todas
as suas *views* deve ser colocada em um *layout*.

O layout default do CakePHP está localizado em **src/Template/Layout/default.ctp**.
Se você quer alterar a aparência geral da sua aplicação, então este é o lugar certo para começar,
porque o código de exibição processado pelo controlador é colocado dentro do
layout padrão quando a página é processada.

Outros arquivos de *layout* devem estar localizados em **src/Template/Layout**. Quando você cria
um *layout*, você precisa dizer para o cakePHP onde colocar o resultado de suas *views*. Para fazer isso,
tenha certeza que seu *layout* inclui um lugar para ``$this->fetch('content')``.
Aqui um exemplo do que um layout padrão pode parecer:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?= h($this->fetch('title')) ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Inclui arquivos externos e scripts aqui. (Veja HTML helper para mais informações.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- Se você quiser algum tipo de menu para mostrar no topo
   de todas as suas *views*, inclua isso aqui -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Aqui é onde eu quero que minhas views sejam exibidas -->
   <?= $this->fetch('content') ?>

   <!-- Adicione um rodapé para cada página exibida -->
   <div id="footer">...</div>

   </body>
   </html>

Os blocos ``script``, ``css`` e ``meta`` contém qualquer conteúdo definido nas views usando o
HTML helper do CakePHP. Útil para incluir arquivos JavaScript e CSS das suas views.

.. note::

    Quando usado ``HtmlHelper::css()`` ou ``HtmlHelper::script()`` em arquivos de template,
    especifique ``'block' => true`` para colocar o código HTML em um bloco com o mesmo nome.
    (Veja API para mais detalhes de como utilizar).

O bloco ``content`` contém os conteúdos da view renderizada.

Você pode definir o conteúdo do bloco ``title`` de dentro do seu arquivo da *view*::

    $this->assign('title', 'Visualizar Usuários Ativos');

Você pode criar quantos layouts você quiser: somente os coloque no diretório
**src/Template/Layout**, a troca entre eles dentro das suas ações do *controller* ocorre
usando a propriedade do *controller* ou *view* ``$layout``::

    // Em um controller
    public function admin_view()
    {
        // Define o layout.
        $this->viewBuilder()->setLayout('admin');

        // Antes da versão 3.4
        $this->viewBuilder()->layout('admin');

        // Antes da versão 3.1
        $this->layout = 'admin';
    }

    // Em um arquivo de *view*
    $this->layout = 'loggedin';

Por exemplo, se uma seção de meu site inclui um pequeno espaço para um banner de propaganda, Eu devo
criar um novo layout com o pequeno espaço de propaganda e especificá-lo para todas as ações dos *controllers*
usando algo parecido com::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function viewActive()
        {
            $this->set('title', 'Visualizar Usuários Ativos');
            $this->viewBuilder()->setLayout('default_small_ad');

            // Antes da versão 3.4
            $this->viewBuilder()->layout('default_small_ad');

            // Antes da versão 3.1
            $this->layout = 'default_small_ad';
        }

        public function viewImage()
        {
            $this->viewBuilder()->setLayout('image');

            // Exibe a imagem do usuário
        }
    }

Além do layout padrão, A aplicação esqueleto CakePHP também tem um layout 'ajax.
O layout Ajax é útil para criar resposta AJAX - É um layout vazio.
(A maioria das chamadas AJAX somente necessitam retornar uma porção de marcação, ao invés de uma
interface totalmente renderizada.)

A aplicação esqueleto também tem um layout padrão para ajudar a gerar RSS.

Usando Layouts de Plugins
-------------------------

Se você quer usar um layout existente em um plugin, você pode usar :term:`sintaxe plugin`.
Por exemplo, para usar o layout contact do plugin Contacts::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function view_active()
        {
            $this->viewBuilder()->layout('Contacts.contact');
            // ou o seguinte para a versão anterior a 3.1
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

*Elements*
==========

.. php:method:: element(string $elementPath, array $data, array $options = [])

Muitas aplicações tem pequenos blocos de código de apresentação que precisam ser repetidos página a página,
algumas vezes em diferentes lugares do layout. O CakePHP
pode ajudar você repetir partes do seu website que precisam ser reusadas. Essas partes reusáveis são chamadas
de Elements. Publicidade, Caixas de ajuda, controles de navegação, menus extras, formulários de login, e callouts
são muitas vezes implementados em CakePHP como *elements*. Um elemento é basicamente uma mini-view que pode ser
incluída em outras *views*, em *layouts*, e mesmo em outros *elements*. *Elements* podem ser usados
para fazer uma *view* mais legível, colocando a renderização de elementos repetitivos em seu próprio arquivo.
Eles também podem ajudá-lo a reusar conteúdos fragmentados em sua aplicação.

*Elements* estão na pasta **src/Template/Element/**, e tem a extensão .ctp.
Eles são exibidos usando o método *element* da *view*::

    echo $this->element('helpbox');

Passando variáveis para um *Element*
------------------------------------

Você pode passar dados para um *element* através do segundo parâmetro do método *element*::

    echo $this->element('helpbox', [
        "helptext" => "Ah, Este texto é muito útil."
    ]);

Dentro do arquivo do *element*, todas as variáveis estarão disponíveis como membros de um
array de parâmetros (da mesma forma que ``Controller::set()`` no *controller*
funciona com arquivos de template). No exemplo a seguir, no arquivo
**src/Template/Element/helpbox.ctp** pode usar a variável ``$helptext``::

    // Dentro do arquivo src/Template/Element/helpbox.ctp
    echo $helptext; // Resulta em "Ah, Esse texto  muito útil."

O método ``View::element()`` também suporta opções para o elemento.
As opções suportadas são 'cache' e 'callbacks'. Um exemplo::

    echo $this->element('helpbox', [
            "helptext" => "Isso é passado para o *element* como $helptext",
            "foobar" => "Isso é passado para o *element* como $foobar",
        ],
        [
            // Usa a configuração de cache "long_view"
            "cache" => "long_view",
            // Define como true para ter before / afterRender chamado para o elemento
            "callbacks" => true
        ]
    );

Cache de Elementos é facilidatado através da Classe ``Cache``. Você pode configurar *elements*
para serem armazenados em qualquer configuração de cache que você possua. Isso dá a você uma grande
flexibilidade para decidir onde e por quanto tempo *elements* serão armazenados.
Para fazer cache de diferentes versões do mesmo *element* em uma aplicação, forneça um valor para a chave única de cache usando o seguinte formato::

    $this->element('helpbox', [], [
            "cache" => ['config' => 'short', 'key' => 'unique value']
        ]
    );

Se você precisa de mais lógica em seu *element*, como dados dinamicos de uma fonte de dados,
considere usar uma *View Cell* ao invés de um *element*. Encontre mais :doc:`sobre View
Cells </views/cells>`.

Fazendo Cache de *Elements*
---------------------------

Você pode tirar vantagem do cache de *view* do CakePHP se você fornecer um parametro de cache.
Se definido como ``true``, isso irá fazer cache do *element* na Configuração de cache 'default'.
De qualquer forma, você pode escolher a configuração de cache que será usada.
Veja :doc:`/core-libraries/caching` para mais informações ao configurar
``Cache``. Um simples exemplo de caching de *element* poderia ser::

    echo $this->element('helpbox', [], ['cache' => true]);

Se você renderizar o mesmo *element* mais de uma vez em uma *view* e tiver o cache habilitado,
tenha certeza de definir o parâmetro 'key' com um nome diferente a cada vez. Isso impedirá que cada chamada
sucessiva sobrescreva o resultado do cache do *element* anterior. Por exemplo::

    echo $this->element(
        'helpbox',
        ['var' => $var],
        ['cache' => ['key' => 'first_use', 'config' => 'view_long']]
    );

    echo $this->element(
        'helpbox',
        ['var' => $differenVar],
        ['cache' => ['key' => 'second_use', 'config' => 'view_long']]
    );

O bloco acima assegurará que o resultado dos *elements* terão o cache armazenados separadamente. Se você quer
todos os *elements* usando a mesma configuração de cache, você pode evitar a repetição
definindo ``View::$elementCache`` para a configuração que deseja utilizar. O CakePHP irá usar essa configuração
quando nenhuma for fornecida.

Requisitando *Elements* de um plugin
------------------------------------

Se você está usando um plugin e deseja usar *elements* de dentro do plugin, simplesmente use
a familiar :term:`sintaxe plugin`. Se a *view* está sendo renderizada de um
controller/action de um plugin, o nome do plugin será automaticamente prefixado em todos os *elements*
a não ser que outro nome de plugin esteja presente.
Se o *element* não existe no plugin, irá buscar na pasta principal da aplicação::

    echo $this->element('Contacts.helpbox');

Se sua *view* é uma parte de um plugin, você pode omitir o nome do plugin. Por exemplo,
se você está em ``ContactsController`` do plugin Contacts, terá o seguinte::

    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

São equivalentes e irá resultar no mesmo elementos sendo renderizado.

Para *elements* dentro de uma subpasta de um plugin
(e.g., **plugins/Contacts/Template/Element/sidebar/helpbox.ctp**), use o seguinte::

    echo $this->element('Contacts.sidebar/helpbox');


Requisitando *Elements* do App
------------------------------

Se você está dentro de um arquivos de template de um plugin e quer renderizar um *element* residido em sua aplicação principal ou outro plugin, use o seguinte::

  echo $this->element('some_global_element', [], ['plugin' => false]);
  // or...
  echo $this->element('some_global_element', ['localVar' => $someData], ['plugin' => false]);

*Routing prefix* e *Elements*
-----------------------------

.. versionadded:: 3.0.1

Se você tiver um Routing prefix configurado, o caminho do *Element* pode ser trocado
para a localização do prefixo, como layouts e *actions* da *View* fazem.
Assumindo que você tem um prefixo "Admin" configurado e vocẽ chama::

    echo $this->element('my_element');

O primeiro *element* procurado será em **src/Template/Admin/Element/**. Se o arquivo não existir,
será procurado na localizaço padrão.

Fazendo Cache de Seções da sua *View*
-------------------------------------

.. php:method:: cache(callable $block, array $options = [])

As vezes gerar uma seção do resultado da sua view pode ser custoso porque foram renderizados :doc:`/views/cells`
ou operações de *helper's* custosas. Para ajudar sua aplicação a rodar mais rapidamente o CakePHP fornece
uma forma de fazer cache de seções de *view*::

    // Assumindo algumas variáveis locais
    echo $this->cache(function () use ($user, $article) {
        echo $this->cell('UserProfile', [$user]);
        echo $this->cell('ArticleFull', [$article]);
    }, ['key' => 'my_view_key']);

Por padrão um conteúdo da view em cache irá ir para a configuração de cache ``View::$elementCache``,
mas você pode usar a opção ``config`` para alterar isso.

.. _view-events:

Eventos da *View*
=================

Como no *Controller*, *view* dispara vários eventos/callbacks que você pode usar para inserir
lógica em torno do ciclo de vida da renderização:

Lista de Eventos
----------------

* ``View.beforeRender``
* ``View.beforeRenderFile``
* ``View.afterRenderFile``
* ``View.afterRender``
* ``View.beforeLayout``
* ``View.afterLayout``

Você pode anexar à aplicação :doc:`event listeners </core-libraries/events>`
para esses eventos ou usar :ref:`Helper Callbacks <helper-api>`.

Criando suas próprias Classes View
==================================

Talvez você precise criar classes *view* personalizadas para habilitar novos tipos de visualizações de dados ou
adicione uma lógica de exibição de visualização personalizada adicional à sua aplicação. Como a maioria dos
Componentes do CakePHP, as classes view têm algumas convenções:

* Arquivos das Classes View devem ser colocados em **src/View**. Por exemplo: **src/View/PdfView.php**
* Classes View devem ter o sufixo ``View``. Por Exemplo: ``PdfView``.
* Quando referenciar nome de Classes *view* você deve omitir o sufixo ``View``. Por Exemplo: ``$this->viewBuilder()->className('Pdf');``.

Você também vai querer estender a Classe ``View`` para garantir que as coisas funcionem corretamente::

    // Em src/View/PdfView.php
    namespace App\View;

    use Cake\View\View;

    class PdfView extends View
    {
        public function render($view = null, $layout = null)
        {
            // Custom logic here.
        }
    }

Substituir o método de renderização permite que você tome controle total sobre como seu conteúdo é
Processado.

Mais sobre *Views*
==================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=pt: Views
    :keywords lang=pt: Lógica de visualização,arquivo csv,elementos de resposta,elementos de código,extensão padrão,json,objeto flash,aplicação remota,twig,subclasse,ajax,resposta,soap,funcionalidade,cakephp,público,xml,mvc
