Views
#####

*Views* (ou Visões) são o **V** do MVC. *Views* são 
responsáveis por gerar a saída de dados específica para uma determinada
requisição. Geralmente esta saída é apresentada na forma de
HTML, XML ou JSON. No entanto, disponibilizar arquivos através de *streaming*
(fluxo de informação, geralmente multimídia, através de pacotes) ou
criar PDFs, que podem ser baixados, também são de responsabilidade
da Camada *View*.

O CakePHP traz incluso várias classes do tipo *View* para lidar com os
cenários mais comuns de renderização:

- Para criar *webservices* em XML ou JSON, você pode usar o :doc:`views/json-and-xml-views`
- Para prover arquivos protegidos ou arquivos criados dinamicamente, você pode usar :doc:`views/media-view`
- Para criar múltiplos temas para as visões, você pode usar :doc:`views/themes`

View Templates
==============

Em CakePHP, você fala com seus usuários através da camada *view* (visão).
Na maior parte do tempo, suas *views* exibirão documentos (X)HTML nos
navegadores, mas você pode também precisar prover dados AMF para um
objeto em Flash, responder a uma aplicação remota via SOAP ou gerar
um arquivo CSV para um usuário.

Por padrão, em CakePHP os arquivos do tipo *view* são escritos em
PHP comum e possuem a extensão .ctp (CakePHP *Template*). Estes
arquivos contém toda a lógica de apresentação necessária para
transformar os dados recebidos do *controller* em um formato pronto
o público. Caso você prefira usar uma linguagem de *template* como
Twig ou Smarty, uma subclasse da *View* irá fazer uma ponte entre
sua linguagem de *template* e o CakePHP.

Arquivos do tipo *view* são guardados em ``/app/View/``, dentro do
diretório com o nome do *controller* que usa os arquivos e nomeado
de acordo com a ação correspondente. Por exemplo, a ação “view()”
do *controller* Products será normalmente encontrada em
``/app/View/Products/view.ctp``.

A camada *view* no CakePHP pode ser composta por uma quantidade de
diferentes partes. Cada parte tem diferentes usos e serão cobertas
neste capítulo:

- **views**: *views* é a única parte da página que está em execução. Elas compõem a parte crucial da resposta da aplicação. 

- **elements**: pedaços de código pequenos e reutilizáveis.
  *Elements* geralmente são renderizados dentro de *views*.

- **layouts**: arquivos da *view* contendo código de apresentação
  que envolve várias interfaces da aplicação. A maior parte dos
  arquivos *views* é renderizada dentro de um *layout*.

- **helpers**: essas classes encapsulam lógica da *view* que seja
  necessária em vários lugares na camada *view*. *Helpers* no CakePHP
  podem ajudá-lo a construir formulários, construir funcionalidade
  AJAX, paginar dados da *model*, prover *feeds* RSS, dentre outras
  coisas.

.. _extending-views:

Extending Views
---------------

.. versionadded:: 2.1

Estender a *View* permite que você inclua uma *view* dentro de outra. Combinando
isto com :ref:`view blocks <view-blocks>` você tem uma maneira poderosa para
deixar suas *views*  :term:`DRY` (enxutas). Por exemplo, sua aplicação tem uma
barra lateral (*sidebar*) que precisa mudar a depender de quando uma *view* específica
é renderizada. Estendendo um mesmo arquivo de *view*, você pode evitar repetições
de marcações em comum e apenas definir as que mudam::

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

O arquivo de *view* acima pode ser usado como uma *view* pai. Esta espera
que a *view* que a estende definirá os blocos ``sidebar`` e ``title``. O bloco
``content`` é um bloco especial que o CakePHP cria. Nele conterá todo o conteúdo
não-capturado da *view* que a estende. Considerando que nosso arquivo *view*
tem uma variável ``$post`` com informação sobre nosso post, nossa *view*
poderá parecer como::

    // app/View/Posts/view.ctp
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post)

    $this->start('sidebar');
    ?>
    <li><?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    <?php

    // O conteúdo restante estará disponível como o bloco `content`
    // na view pai.
    echo h($post['Post']['body']);

A *view* de post acima mostra como você pode estender uma *view*  e
preenche-la com um conjunto de blocos. Qualquer conteúdo que não estiver
definido em um bloco será capturado e colocado em um bloco especial chamado
``content``. Quando uma *view* contém uma chamada para ``extend()``, a execução
continua até o fim do arquivo *view*  atual. Uma vez finalizada, a *view*
estendida será renderizada. Chamar ``extend()`` mais do que uma vez em um
arquivo *view* irá sobrescrever a *view* pai que será processada em seguida:: 

    <?php
    $this->extend('/Common/view');
    $this->extend('/Common/index');

O trecho acima resultará em ``/Common/index.ctp`` sendo renderizada como a
*view* pai para a *view* atual.

Você pode aninhar *views* estendidas quantas vezes forem necessárias. Cada
*view* pode estender outra *view* se quiser. Cada *view* pai pegará a *view*
o conteúdo da *view* anterior como o bloco ``content``.

.. note::

    Você deve evitar o uso de ``content`` como o nome de um bloco em sua aplicação.
    CakePHP usa isto em *views*  estendidas para conteúdos não-capturados .

.. _view-blocks:

Usando Blocos de Views (Visões)
=================

.. versionadded:: 2.1

Blocos de *views* substituem ``$scripts_for_layout`` e provêm uma API flexível que 
permite criar slots ou blocos em suas *views*/layouts que podem ser definidas
em qualquer lugar. Por exemplo, blocos são ideais para implementar recursos como 
barras laterais ou regiões para carregar seções na parte de baixo ou no topo
do layout.
Blocos podem ser definidos de duas formas. Seja capturando um bloco ou por atribuição 
direta. Os métodos ``start()``, ``append()`` e ``end()`` permitem trabalhar com 
captura de blocos::

    <?php
    // cria um bloco lateral.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Concatena na barra lateral em seguida.
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

Também é possível concatenar em um bloco utilizando o método ``start()`` múltiplas vezes.
O método ``assign()`` pode ser usado para limpar ou sobrescrever o bloco::

    <?php
    // Limpa o conteúdo anterior da barra lateral.
    $this->assign('sidebar', '');


.. note::

    Você deve evitar o uso de ``content`` como o nome de um bloco em sua aplicação.
    CakePHP usa isto em *views* estendidas para conteúdos não-capturados .

Exibindo blocos
---------------

.. versionadded:: 2.1

Você pode exibir blocos usando o método ``fetch()``. ``fecht()`` irá retornar
um bloco de maneira segura, retornando '' se o bloco não existir"::

    <?php echo $this->fetch('sidebar'); ?>

Você também pode usar o *fetch* para exibir condicionalmente um conteúdo que deve
envolver um bloco que deveria existir. Isto é útil em *layouts* ou *views* estendidas,
nas quais você queira mostrar cabeçalhos e outras marcações condicionalmente:

    // em app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

Utilizando blocos para arquivos de script e CSS
-----------------------------------------------

.. versionadded:: 2.1

Blocos substituem a obsoleta variável ``$scripts_for_layout`` do *layout*. Em vez
disto, você deve usar blocos. A :php:class:`HtmlHelper` vincula-se aos blocos da
*view* e a cada um dos seus métodos php:meth:`~HtmlHelper::script()`, :php:meth:`~HtmlHelper::css()`
e :php:meth:`~HtmlHelper::meta()` quando o bloco com o mesmo nome utiliza a opção ``inline = false``::


    <?php
    // no seu arquivo de view
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', null, array('inline' => false));
    ?>

    // no seu arquivo de layout
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>

        // o resto do layout continua

A :php:meth:`HtmlHelper` também permite você controlar para que bloco os *scripts* e CSS vão::

    <?php
    // na sua view
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // no seu layout
    echo $this->fetch('scriptBottom');

.. _view-layouts:

Layouts
=======

Um *layout* contem o código de apresentação que envolve uma *view*. 
Qualquer coisa que você queira ver em todas as suas *views* deve ser 
colocada em um *layout*.

Arquivos de *layouts* devem ser colocados em ``/app/View/Layouts``. O
layout padrão do CakePHP pode ser sobrescrito criando um novo *layout* 
padrão em ``/app/View/Layouts/default.ctp``. Uma vez que um novo *layout* 
padrão tenha sido criado, o código da *view* renderizado pelo *controller* 
é colocado dentro do layout padrão quando a página é renderizada.

Quando você cria um layout, você precisa dizer ao CakePHP onde colocar 
o código de suas *views*. Para isso, garanta que o seu *layout* inclui
um lugar para ``$this->fetch('content')``. A seguir, um exemplo de como 
um *layout* padrão deve parecer:: 

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $title_for_layout?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Include external files and scripts here (See HTML helper for more info.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- If you'd like some sort of menu to
   show up on all of your views, include it here -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Here's where I want my views to be displayed -->
   <?php echo $this->fetch('content'); ?>

   <!-- Add a footer to each displayed page -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    Na versão anterior a 2.1, o método fetch() não estava disponível, ``fetch('content')``
    é uma substituição para ``$content_for_layout`` e as linhas ``fetch('meta')``,
    ``fetch('css')`` and ``fetch('script')`` estavam contidas na variável ``$scripts_for_layout``
    na versão 2.0.

Os blocos ``script``, ``css`` e ``meta`` contém qualquer conteúdo definido
nas views usando o helper HTML embutido. Útil na inclusão de arquivos *javascript* 
e CSS de *views*. 


.. note::

    Quando usar :php:meth:`HtmlHelper::css()` ou :php:meth:`HtmlHelper::script()`
    em views, especifique 'false' para a opção 'inline' para colocar o código html
    em um bloco de mesmo nome. (Veja a API para mais detalhes de uso)

O bloco ``content`` contem o conteúdo da *view* renderizada.

``$title_for_layout`` contém o título da página, Esta variável é gerada automaticamente,
mas você poderá sobrescrevê-la definindo-a em seu controller/view.

Para definir o título para o *layout*, o modo mais fácil é no controller, setando
a variável ``$title_for_layout``::

   <?php
   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
       }
   }

Você também pode setar a variável title_for_layout no arquivo de *view*::

    <?php
    $this->set('title_for_layout', $titleContent);

Você pode criar quantos *layouts* você desejar: apenas coloque-os no 
diretório ``app/View/Layouts``, e defina qual deles usar dentro das ações 
do seu controller usando a propriedade :php:attr:`~View::$layout` do 
*controller* ou *view*::

    <?php
    // from a controller
    public function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // from a view file
    $this->layout = 'loggedin';

Por exemplo, se a seção do meu *site* incluir um pequeno espaço para banner,
eu posso criar um novo *layout* com um pequeno espaço para propaganda e especificá-lo 
como *layout* para as ações de todos os *controllers* usando algo como::

   <?php
   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //output user image
       }
   }

O CakePHP tem em seu núcleo, dois *layouts* (além do layout padrão) 
que você pode usar em suas próprias aplicações: 'ajax' e 'flash'. 
O *layout* Ajax é útil para elaborar respostas Ajax - é um *layout* vazio 
(a maior parte das chamadas ajax requer pouca marcação de retorno, 
preferencialmente a uma interface totalmente renderizada). O *layout* 
flash é usado para mensagens mostradas pelo método :php:meth:`Controller::flash()`.

Outros três *layouts*, XML, JS, e RSS, existem no núcleo como um modo 
rápido e fácil de servir conteúdo que não seja text/html.

Usando layouts a partir de plugins
--------------------------

.. versionadded:: 2.1

Para usar um *layout* que existe em um *plugin*, basta utilizar :term:`plugin syntax`.  
Por exemplo, para usar o *layout* de contato do *plugin* de contatos::

    <?php
    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

Elements
========

Muitas aplicações possuem pequenos blocos de códigos de apresentação
que precisam ser repetidos a cada página, às vezes em diferentes
lugares no *layout*. CakePHP ajuda você a repetir partes do seu *website*
que precisam ser reutilizados. Estas partes reutilizáveis são chamadas de
*Elements* (ou Elementos). Propagandas, caixas de ajuda, controles de navegação, menus
extras, formulários de login e chamadas geralmente são implementadas como
*elements*. Um *element* é básicamente uma *mini-view* que pode ser inclusa
em outras *views*, *layouts* e até mesmo em outros *elements*. *Elements*
podem ser usados para criar uma *view* mais legível, colocando o processamento
de elementos repetidos em seu próprio arquivo. Eles também podem ajudá-lo
a re-usar conteúdos fragmentados pela sua aplicação.

*Elements* vivem na pasta ``/app/View/Elements/`` e possuem a extensão .ctp
no nome do arquivo. Eles são exibidos através do uso do método *element*
da *view*::

    <?php echo $this->element('helpbox'); ?>

Passando variáveis em um *Element*
---------------------------------

Você pode passar dados para um *element* através do segundo argumento do *element*::

    <?php
    echo $this->element('helpbox', array(
        "helptext" => "Oh, este texto é muito útil."
    ));

Dentro do arquivo do *element*, todas as variáveis passadas estão disponíveis como
membros do array de parâmetros (da mesma forma que :php:meth:`Controller::set()` no
*controller* trabalha com arquivos de *views*). No exemplo acima, o arquivo 
``/app/View/Elements/helpbox.ctp`` pode usar a variável ``$helptext``::

    <?php
    // Dentro de app/View/Elements/helpbox.ctp
    echo $helptext; //outputs "Oh, este texto é muito útil."

O método :php:meth:`View::element()` também suporta opções para o *element*.
As opções suportadas são 'cache' e 'callbacks'. Um exemplo::

    <?php
    echo $this->element('helpbox', array(
            "helptext" => "Isto é passado para o *element * como $helptext",
            "foobar" => "TIsto é passado para o *element * como $foobar",
        ),
        array(
            "cache" => "long_view", // usa a configuração de cache "long_view"
            "callbacks" => true // atribue verdadeiro para ter before/afterRender chamado pelo *element*
        )
    );

O cache de *element* é facilitado através da classe :php:class:`Cache`.  Você pode 
configurar *elements* para serem guardados em qualquer configuração de cache que você 
tenha definido. Isto permite uma maior flexibilidade para decidir onde e por quantos
*elements* são guardados. Para fazer o cache de diferentes versões de um mesmo *element*
em uma aplicação, defina uma única chave de cache usando o seguinte formato::

    <?php
    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

Você pode tirar vantagem de *elements* usando 
``requestAction()``. A função ``requestAction()`` carrega variáveis da 
*views* a partir de ações do *controller* e as retorna como um array.
Isto habilita seus *elements* para atuar verdadeiramente no estilo MVC. Crie
uma ação de *controller* que prepara as variáveis da *view* para seu *element*, depois
chame ``requestAction()`` no segundo parâmetro do ``element()`` para carregar as variáveis
da *view* a partir do seu *controller*.

Para isto, em seu *controller*, adicione algo como segue no exemplo abaixo 
para Post::

    <?php
    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }

Em seguida, no *element*, você poderá acessar os modelos de posts paginados.
Para obter os últimos cinco posts em uma lista ordenadas, você pode fazer algo
como::

    <h2>Latest Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach ($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Caching de Elementos
--------------------


Você pode tomar proveito do CakePHP *view caching*, se você fornecer 
um parâmetro de *cache*. Se definido como true, o elemento será guardado 
na configuração de *cache* 'default'. Caso contrário, você poderá definir
qual configuração de cache deve ser usada. Veja :doc:`/core-libraries/caching` 
para mais informações de configuração :php:class:`Cache`. Um exemplo simples
de *caching* um elemento seria:: 

    <?php echo $this->element('helpbox', array(), array('cache' => true)); ?>


Se você renderiza o mesmo elemento mais que uma vez em uma *view* e tem *caching* 
ativado, esteja certo de definir o parâmetro chave (key) para um nome diferente 
cada vez. Isto irá prevenir que cada chamada sucessiva substitua o resultado 
armazenado da chamada element() anterior. E.g.::


    <?php
    echo $this->element(
        'helpbox',
        array('var' => $var),
        array('cache' => array('key' => 'first_use', 'config' => 'view_long')
    );

    echo $this->element(
        'helpbox',
        array('var' => $differenVar),
        array('cache' => array('key' => 'second_use', 'config' => 'view_long')
    );

O código acima garante que ambos os resultados do elemento serão armazenados separadamente.
Se você quiser que todos os elementos armazenados usem a mesma configuração de cache, você 
pode salvar alguma repetição, setando :php:attr:`View::$elementCache`para a configuração 
de cache que você quer usar. O CakePHP usará esta configuração, quando nenhuma outra for dada. 


Requisitando Elementos de um Plugin
---------------------------------

2.0
---

Para carregar um elemento de um plugin, use a opção `plugin` (retirada da opção `data` na versão 1.x)::

    <?php echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

Se você está usando um *plugin* e deseja usar elementos de dentro deste *plugin*
apenas use :term:`plugin syntax`. Se a view está renderizando para um 
controller/action de plugin, o nome do plugin será automaticamente prefixado 
antes de todos os elementos usados, ao menos que outro nome de *plugin* esteja 
presente. Se o elemento não existir no *plugin*, será procurado na pasta 
principal da APP.::

    <?php echo $this->element('Contacts.helpbox'); ?>

Se sua *view* é parte de um *plugin* você pode omitir o nome do *plugin*. Por exemplo, 
se você está no ``ContactsController`` do *plugin* Contacts:: 

    <?php
    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

São equivalentes e resultarão no mesmo elemento sendo renderizado.

.. versionchanged:: 2.1
    A opção ``$options[plugin]`` foi descontinuada e o suporte para 
    ``Plugin.element`` foi adicionado.


View API
========

.. php:class:: View

Métodos de Views são acessíveis por todas as views, elementos e arquivos de layout.
Para chamar qualquer método de uma view use ``$this->method()``.



.. php:method:: set(string $var, mixed $value)

    Views têm métodos ``set()`` que são análogos aos ``set()``
    encontrados nos objetos controllers. Usando set() em seu arquivo view
    serão adicionados variáveis para layouts e elementos que serão renderizados
    posteriormente. Veja :ref:`controller-methods` para maiores informações de como 
    usar o set().
    
    No seu arquivo de view, você pode::
  
        <?php
        $this->set('activeMenuButton', 'posts');

    Assim em seu layout a variável ``$activeMenuButton`` estará disponível 
    e conterá o valor 'posts'.

.. php:method:: getVar(string $var)

    Obtem o valor de viewVar com o nome $var

.. php:method:: getVars()

    Obtem uma lista de todas as variáveis disponíveis da view, no escopo 
    renderizado corrente. Retorna um array com os nomes das variáveis.
    
.. php:method:: element(string $elementPath, array $data, array $options = array())

    Renderiza um elemento ou parte de uma view. Veja a seção :ref:`view-elements` 
    para maiores informações e exemplos. 

.. php:method:: uuid(string $object, mixed $url)

    Gera um DOM ID não randômico único para um objeto, baseado no tipo
    do objeto e url. Este método é frequentemente usado por helpers que 
    precisam gerar DOM ID únicos para elementos como :php:class:`JsHelper`::

        <?php
        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Adiciona conteúdo para buffer de scripts internos. Este buffer
    é disponibilizado no layout como ``$scripts_for_layout``. Este 
    método auxilia na criação de helpers que necessitam adicionar 
    javascript or css diretamente para o layout. Ciente que scripts
    adicionados de layouts, or elementos do layout não serão adicionados 
    para ``$scripts_for_layout``. Este método é frequentemente usado dentro
    dos helpers, como nos Helpers `/core-libraries/helpers/js` e
    :doc:`/core-libraries/helpers/html`.

    

    .. deprecated:: 2.1
        Use a feature :ref:`view-blocks`, ao invés.

.. php:method:: blocks

    Obtem o nome de todos os blocos definidos como um array.

.. php:method:: start($name)

    Inicia a caputura de bloco para um bloco de view. Veja a seção em 
    :ref:`view-blocks` para exemplos.

    .. versionadded:: 2.1

.. php:method:: end

    Finaliza o mais recente bloco sendo capturado. Veja a seção em 
    :ref:`view-blocks` para exemplos.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Anexa no bloco com ``$name``.  Veja a seção em
    :ref:`view-blocks` para examplos.

    .. versionadded:: 2.1

.. php:method:: assign($name, $content)

    Atribui o valor de um bloco. Isso irá sobrescrever qualquer conteúdo existente.
    Veja a seção em :ref:`view-blocks` para exemplos.

    .. versionadded:: 2.1

.. php:method:: fetch($name)

    Fetch o valor do bloco. '' Serão retornados de blocos que não são definidos
    Veja a seção em :ref:`view-blocks` para exemplos.    

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Estende o view/element/layout corrente com o nome fornecido. Veja a seção em 
    :ref:`extending-views` para examplos.

    .. versionadded:: 2.1

.. php:attr:: layout

    Seta o layout onde a view corrente será envolvida.
   
.. php:attr:: elementCache

    A configuração de cache usada para armazenar elementos. Setando esta 
    propriedade a configuração padrâo usada para armazenar elementos será alterada
    Este padrão pode ser sobrescrito usando a opção 'cache' no método do elemento. 
   

.. php:attr:: request

    
    Uma instância de :php:class:`CakeRequest`.  Use esta instância para acessar 
    informaçãoes sobre a requisição atual.


.. php:attr:: output

    Contem o último conteúdo renderizado de uma view, seja um arquivo de view 
    ou conteúdo do layout.    


    .. deprecated:: 2.1
        Use ``$view->Blocks->get('content');`` instead.

.. php:attr:: Blocks

   Uma instância de :php:class:`ViewBlock`. Usada para prover um bloco 
   de funcionalidades de view na view renderizada.

    .. versionadded:: 2.1

Mais sobre Views
================

.. toctree::

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=en: Views
    :keywords lang=en: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
