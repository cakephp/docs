Views
#####

*Views* (ou Visões) são o **V** do MVC. *Views* são 
responsáveis por gerar a saída de dados específica solicitada por
uma requisição. Geralmente esta saída é apresentada em forma de
HTML, XML ou JSON. No entanto, disponibilizar arquivos através de *streaming*
(fluxo de informação, geralmente multimídia, através de pacotes) ou
criar PDFs que podem ser baixados também são de responsabilidade
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
objeto em Flash,responder a uma aplicação remota via SOAP ou gerar
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
partes diferentes. Cada parte tem diferentes usos e será coberta
neste capítulo:

- **views**: *views* são a parte da página que é única para a
*action* em execução. Elas compõem a parte crucial da resposta da
aplicação. 

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
``content`` é um block especial que o CakePHP cria. Nele conterá todo o conteúdo
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
    CakePHP usa isto em * views*  estendidas para conteúdos não-capturados .

.. _view-blocks:

Using view blocks
=================

.. versionadded:: 2.1

View blocks replace ``$scripts_for_layout`` and provide a flexible API that
allows you to define slots or blocks in your views/layouts that will be defined
elsewhere.  For example blocks are ideal for implementing things such as
sidebars, or regions to load assets at the bottom/top of the layout.
Blocks can be defined in two ways.  Either as a capturing block, or by direct
assignment.  The ``start()``, ``append()`` and ``end()`` methods allow to to
work with capturing blocks::

    <?php
    // create the sidebar block.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // Append into the sidebar later on.
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

You can also append into a block using ``start()`` multiple times.  ``assign()``
can be used to clear or overwrite a block at any time::

    <?php
    // Clear the previous content from the sidebar block.
    $this->assign('sidebar', '');

.. note::

    You should avoid using ``content`` as a block name.  This is used by CakePHP
    internally for extended views, and view content in the layout.

Exibindo blocos
---------------

.. versionadded:: 2.1

Você pode exibir blocos usando o método ``fetch()``. ``fecht()`` irá retornar
um bloco de maneira segura, retornando '' se o bloco não existir::

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

A :php:meth:`HtmlHelper` também permite você controlar para que bloco os scripts e CSS vão::

    <?php
    // na sua view
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // no seu layout
    echo $this->fetch('scriptBottom');

.. _view-layouts:

Layouts
=======

Um layout contem o código de apresentação que envolve uma view. 
Qualquer coisa que você queira ver em todas as suas views deve ser 
colocada em um layout.

Arquivos de layouts devem ser colocados em ``/app/View/Layouts``. O
layout padrão do CakePHP pode ser sobrescrito criando um novo layout 
padrão em ``/app/View/Layouts/default.ctp``. Uma vez que um novo layout 
padrão tenha sido criado, o código da view renderizado pelo controller 
é colocado dentro do layout padrão quando a página é renderizada.

Quando você cria um layout, você precisa dizer ao CakePHP onde colocar 
o código de suas views. Para isso, garanta que o seu layout inclui
um lugar para ``$this->fetch('content')``. A seguir, um exemplo de como 
um layout padrão deve parecer:: 

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

.. nota::

    Na versão anterior a 2.1, o método fetch() não estava disponível, ``fetch('content')``
    é uma substituição para ``$content_for_layout`` e as linhas ``fetch('meta')``,
    ``fetch('css')`` and ``fetch('script')`` estavam contidas na variável ``$scripts_for_layout``
    na versão 2.0.

Os blocos ``script``, ``css`` e ``meta`` contém qualquer conteúdo definido
nas views usando o helper HTML embutido. Útil na inclusão de arquivos javascript 
e CSS de views. 


.. nota::

    Quando usar :php:meth:`HtmlHelper::css()` ou :php:meth:`HtmlHelper::script()`
    em views, especifique 'false' para a opção 'inline' para colocar o código html
    em um bloco de mesmo nome. (Veja a API para mais detalhes de uso)

O bloco ``content`` contem o conteúdo da view renderizada.

``$title_for_layout`` contém o título da página, Esta variável é gerada automaticamente,
mas você poderá sobrescrevê-la definindo-a em seu controller/view.

Para definir o título para o layout, o modo mais fácil é no controller, setando
a variável ``$title_for_layout``::

   <?php
   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
       }
   }

Você também pode setar a variável title_for_layout no arquivo de view::

    <?php
    $this->set('title_for_layout', $titleContent);

Você pode criar quantos layouts você desejar: apenas coloque-os no 
diretório ``app/View/Layouts``, e defina qual deles usar dentro das ações 
do seu controller usando a propriedade :php:attr:`~View::$layout` do 
controller ou view::

    <?php
    // from a controller
    public function admin_view() {
        // stuff
        $this->layout = 'admin';
    }

    // from a view file
    $this->layout = 'loggedin';

Por exemplo, se a seção do meu site incluir um pequeno espaço para banner,
eu posso criar um novo layout com um pequeno espaço para propaganda e especificá-lo 
como layout para as ações de todos os controllers usando algo como::

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

O CakePHP tem em seu núcleo, dois layouts (além do layout padrão) 
que você pode usar em suas próprias aplicações: 'ajax' e 'flash'. 
O layout Ajax é útil para elaborar respostas Ajax - é um layout vazio 
(a maior parte das chamadas ajax requer pouca marcação de retorno, 
preferencialmente a uma interface totalmente renderizada). O layout 
flash é usado para mensagens mostradas pelo método :php:meth:`Controller::flash()`.

Outros três layouts, xml, js, e rss, existem no núcleo como um modo 
rápido e fácil de servir conteúdo que não seja text/html.

Using layouts from plugins
--------------------------

.. versionadded:: 2.1

If you want to use a layout that exists in a plugin, you can use
:term:`plugin syntax`.  For example to use the contact layout from the
Contacts plugin::

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

Passing Variables into an Element
---------------------------------

You can pass data to an element through the element's second
argument::

    <?php
    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

Inside the element file, all the passed variables are available as
members of the parameter array (in the same way that :php:meth:`Controller::set()` in
the controller works with view files). In the above example, the
``/app/View/Elements/helpbox.ctp`` file can use the ``$helptext``
variable::

    <?php
    // inside app/View/Elements/helpbox.ctp
    echo $helptext; //outputs "Oh, this text is very helpful."

The :php:meth:`View::element()` method also supports options for the element.
The options supported are 'cache' and 'callbacks'. An example::

    <?php
    echo $this->element('helpbox', array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ),
        array(
            "cache" => "long_view", // uses the "long_view" cache configuration
            "callbacks" => true // set to true to have before/afterRender called for the element
        )
    );

Element caching is facilitated through the :php:class:`Cache` class.  You can
configure elements to be stored in any Cache configuration you've setup.  This
gives you a great amount of flexibility to decide where and for how long elements
are stored.  To cache different versions of the same element in an application,
provide a unique cache key value using the following format::

    <?php
    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

You can take full advantage of elements by using
``requestAction()``. The ``requestAction()`` function fetches view
variables from a controller action and returns them as an array.
This enables your elements to perform in true MVC style. Create a
controller action that prepares the view variables for your
elements, then call ``requestAction()`` inside the second parameter
of ``element()`` to feed the element the view variables from your
controller.

To do this, in your controller add something like the following for
the Post example::

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

And then in the element we can access the paginated posts model. To
get the latest five posts in an ordered list we would do something
like the following::

    <h2>Latest Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach ($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Caching Elements
----------------

You can take advantage of CakePHP view caching if you supply a
cache parameter. If set to true, it will cache the element in the
'default' Cache configuration. Otherwise, you can set which cache configuration
should be used. See :doc:`/core-libraries/caching` for more information on
configuring :php:class:`Cache`. A simple example of caching an element would be::

    <?php echo $this->element('helpbox', array(), array('cache' => true)); ?>

If you render the same element more than once in a view and have
caching enabled be sure to set the 'key' parameter to a different
name each time. This will prevent each successive call from
overwriting the previous element() call's cached result. E.g.::

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

The above will ensure that both element results are cached separately.  If
you want all element caching to use the same cache configuration, you can save
some repetition, by setting :php:attr:`View::$elementCache` to the cache
configuration you want to use.  CakePHP will use this configuration, when none
is given.

Requisitando Elementos de um Plugin
---------------------------------

2.0
---

Para carregar um elemento de um plugin, use a opção `plugin` (retirada da opção `data` na versão 1.x)::

    <?php echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

Se você está usando um plugin e deseja usar elementos de dentro deste plugin
apenas use :term:`plugin syntax`. Se a view está renderizando para um 
controller/action de plugin, o nome do plugin será automaticamente prefixado 
antes de todos os elementos usados, ao menos que outro nome de plugin esteja 
presente. Se o elemento não existir no plugin, será procurado na pasta 
principal da APP.::

    <?php echo $this->element('Contacts.helpbox'); ?>

Se sua view é parte de um plugin você pode omitir o nome do plugin. Por exemplo, 
se você está no ``ContactsController`` do plugin Contacts:: 

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

View methods are accessible in all view, element and layout files.
To call any view method use ``$this->method()``

.. php:method:: set(string $var, mixed $value)

    Views have a ``set()`` method that is analogous to the ``set()``
    found in Controller objects. Using set() from your view file will
    add the variables to the layout and elements that will be rendered
    later. See :ref:`controller-methods` for more information on using
    set().

    In your view file you can do::

        <?php
        $this->set('activeMenuButton', 'posts');

    Then in your layout the ``$activeMenuButton`` variable will be
    available and contain the value 'posts'.

.. php:method:: getVar(string $var)

    Gets the value of the viewVar with the name $var

.. php:method:: getVars()

    Gets a list of all the available view variables in the current
    rendering scope. Returns an array of variable names.

.. php:method:: element(string $elementPath, array $data, array $options = array())

    Renders an element or view partial. See the section on
    :ref:`view-elements` for more information and
    examples.

.. php:method:: uuid(string $object, mixed $url)

    Generates a unique non-random DOM ID for an object, based on the
    object type and url. This method is often used by helpers that need
    to generate unique DOM ID's for elements such as the :php:class:`JsHelper`::

        <?php
        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    Adds content to the internal scripts buffer. This buffer is made
    available in the layout as ``$scripts_for_layout``. This method is
    helpful when creating helpers that need to add javascript or css
    directly to the layout. Keep in mind that scripts added from the
    layout, or elements in the layout will not be added to
    ``$scripts_for_layout``. This method is most often used from inside
    helpers, like the :doc:`/core-libraries/helpers/js` and
    :doc:`/core-libraries/helpers/html` Helpers.

    .. deprecated:: 2.1
        Use the :ref:`view-blocks` features instead.

.. php:method:: blocks

    Get the names of all defined blocks as an array.

.. php:method:: start($name)

    Start a capturing block for a view block.  See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: end

    End the top most open capturing block.  See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    Append into the block with ``$name``.  See the section on
    :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: assign($name, $content)

    Assign the value of a block.  This will overwrite any existing content. See
    the section on :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: fetch($name)

    Fetch the value of a block. '' Will be returned for blocks that are not
    defined. See the section on :ref:`view-blocks` for examples.

    .. versionadded:: 2.1

.. php:method:: extend($name)

    Extend the current view/element/layout with the named one.  See the section
    on :ref:`extending-views` for examples.

    .. versionadded:: 2.1

.. php:attr:: layout

    Set the layout the current view will be wrapped in.

.. php:attr:: elementCache

    The cache configuration used to cache elements. Setting this
    property will change the default configuration used to cache elements.
    This default can be overridden using the 'cache' option in the element
    method.

.. php:attr:: request

    An instance of :php:class:`CakeRequest`.  Use this instance to access
    information about the current request.

.. php:attr:: output

    Contains the last rendered content from a view, either the view file, or the
    layout content.

    .. deprecated:: 2.1
        Use ``$view->Blocks->get('content');`` instead.

.. php:attr:: Blocks

    An instance of :php:class:`ViewBlock`.  Used to provide view block
    functionality in view rendering.

    .. versionadded:: 2.1

More about Views
================

.. toctree::

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=en: Views
    :keywords lang=en: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
