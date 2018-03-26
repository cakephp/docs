Views
#####

 

View Templates
==============

Em CakePHP, você fala com seus usuários através da camada das
views(vistas). A maoir parte do tempo, suas views estarão mostrando
documentos (X)HTML para os navegadores, mas você pode também precisar
servir dados AMF para um objeto Flash, responder a uma aplicação remota
via SOAP, ou exportar um arquivo CSV para um usuário.

Os arquivos de view do CakePHP são escritos em PHP comum e tem a
extensão padrão de .ctp (CakePHP Template). Esses arquivos contêm toda a
lógica de aprensentação necessária para transformar os dados recebidos
do controller em um formato que está pronto para a audiência.

Arquivos de view são guardados em /app/views/, em um diretório com o
nome do controller (controlador) que usa os arquivos, e nomeado de
acordo com a view a qual corresponde. Por exemplo, a action (ação) ver()
do controller Produtos será normalmente encontrada em
/app/views/produtos/ver.ctp.

A camada da view no CakePHP pode ser feita de algumas diferentes partes.
Cada parte tem diferentes usos, e será coberta em seu capítulo:

-  **layouts**: arquivos view que contém o código da apresentação que é
   encontrado envolvendo muitas interfaces em sua aplicação. A maior
   parte das views é renderizada dentro de um layout.
-  **elements (elementos)**: pedaços de código pequenos e reutilizáveis.
   Elements são geralmente renderizados dentro de views.
-  **helpers (ajudantes)**: essas classes encapsulam lógica da view que
   é necessária em muitos lugares na camada da view. Entre outras
   coisas, helpers no CakePHP podem ajudá-lo a construir formulários,
   construir funcionalidade Ajax, paginar dados do model, ou servir
   feeds RSS.

Layouts
=======

Um layout contém código de apresentação que envolve uma view. Qualquer
coisa que você quiser ver em todas as suas views deve ser colocada em um
layout.

Arquivos de layout devem ser colocados em /app/views/layouts. O layout
padrão pode ser sobrescrito criando um novo layout padrão em
/app/views/layouts/default.ctp. Uma vez que um novo layout foi criado,
código de view renderizado pelo controller é colocado dentro do layout
padrão quando a página é renderizada.

Quando você cria um layout, você precisa dizer ao CakePHP onde colocar o
código de suas views. Para tanto, garanta que seu layout tem um lugar
para o conteúdo do layout através da variável $content\_for\_layout (e
opcionalmente, título para o layout através da variável
$title\_for\_layout). Aqui vai um exemplo do que um layout padrão deve
parecer:

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title><?php echo $title_for_layout?></title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    </head>
    <body>

    <!-- Se você gostaria que algum tipo de menu seja
    mostrado em todas as suas views, insira ele aqui -->
    <div id="header">
        <div id="menu">...</div>
    </div>

    <!-- É aqui que eu quero que minhas views apareçam -->
    <?php echo $content_for_layout ?>

    <!-- Adicione um rodapé para cada página mostrada -->
    <div id="footer">...</div>

    </body>
    </html>

Para configurar um título para o layout, é mais fácil fazê-lo no
controller, usando a variável de controller $pageTitle.

::

    <?php

    class UsersController extends AppController {
        function viewActive() {
            $this->pageTitle = 'View Active Users';
        }
    }
    ?>

Você pode criar quantos layouts você desejar: apenas coloque-os no
diretório /app/views/layouts, e escolha entre eles o ideal para cada
action do controller usando a variável $layout ou a função setLayout().
Controllers que não tenham a variável $layout configurada usarão o
layout padrão.

Por exemplo, se uma sessão do meu site inluir um pequeno espaço para
banner, eu posso criar um novo layout com um pequeno espaço para
propaganda e especificá-lo como layout para todas as actions de
controller usando algo como:

var $layout = 'default\_small\_ad';

::

    <?php
    class UsersController extends AppController {
        function viewActive() {
            $this->pageTitle = 'Ver Usuários Ativos';
            $this->layout = 'default_small_ad';
        }

        function viewImage() {
            $this->layout = 'image';
            // imprimir a imagem para o usuário
        }
    }
    ?>

CakePHP tem em seu núcleo, dois layouts (além do layout padrão) que você
pode usar em suas aplicações: 'ajax' e 'flash'. O layout Ajax é ótimo
para criar respostas Ajax - é um layout vazio (a maior parte das
chamadas ajax requer pouca marcação em retorno, ao invés uma interface
totalmente renderizada). O layout flash é usado para mensagens mostradas
pelos métodos flash() dos controllers.

Três outros layouts - xml, js, e rss - existem no núcleo para acelerar e
facilitar servir conteúdo diferente de text/html.

Elements
========

Muitas aplicações têm pequenos blocos de código de apresentação que
precisa ser repetido de página em página, algumas vezes em diferentes
lugares no layout. O CakePHP te ajuda a repetir partes do seu website
que precisam ser reutilizadas. Essas partes reutilizáveis são chamadas
Elements. Um element é basicamente uma mini-view que pode ser incluída
em outras views.

Elements vivem no diretório /app/views/elements/, e tem uma extensão
.ctp no nome de arquivo.

Por padrão, elements são estáticos. Você pode dar vida aos seus elements
e passar para eles variáveis da view usando um parâmetro adicional no
método renderElement().

::

    // Chamando um Element sem parâmetros
    // Esse element só contém código estático de view.
    <?php echo $this->element('helpbox'); ?>

    // Chamando um Element passando um array de dados,
    // permitindo que o element se comporte dinamicamente.
    <?php echo
    $this->element(
        'helpbox', 
        array("helptext" => "Ah, esse texto é realmente muito útil."));
    ?>

*Nota*: Você pode aproveitar o sistema de cache de view do CakePHP se
você fornecer "cache" como true no segundo parâmetro do método
element().

::

    // Renderiza o element e faz cache dele por um dia
    <?php echo $this->element('helpbox', array('cache' => true)); ?>

Dentro do arquivo Element, todos as variáveis estão disponíveis como os
nomes dos índices do array fornecido (muito parecido com como set()
funciona no controller com arquivos de view). No exemplo acima, o
arquivo /app/views/elements/ajuda.ctp pode usar a variável $mensagem.

Uma forma de aproveitar totalmente os elements é usar requestAction(). A
função requestAction() preenche a view com variáveis da action do
controller e as retorna como um array. Isso torna possível aos seus
elements agir realmente no estilo MVC. Crie uma action do controller que
prepara as variáveis da view para seus elements e chame requestAction()
dentro do segundo parâmetro de requestElement() para preencher o element
com as variáveis de view vindas do controller.

Elements podem ser usados para fazer a view mais legível, colocando os
elementos repetitivos em seus próprios arquivos. Eles podem também
ajudá-lo a reutilizar fragmentos de conteúdo em sua aplicação.

Passando Variáveis para um Elemento
-----------------------------------

Você pode passar dados para um elemento através o segundo argumento do
element:

::

    <?php echo
    $this->element('helpbox', 
        array("helptext" => "Oh, este texto é muito útil."));
    ?>

Dentro do arquivo de elemento, todas as variáveis passadas estão
disponíveis como membros do parâmetro array (da mesmo forma que
``set()`` no controller funciona com arquivos de view). No exemplo
acima, o arquivo /app/views/elements/helpbox.ctp pode usar a variável
``$helptext``

::

    <?php
    echo $helptext; //imprime "Oh, este texto é muito útil."
    ?>

A função ``element()`` combina opções para o elemento com os dados para
o elemento passar. As duas opções são 'cache' e 'plugin'. Um exemplo:

::

    <?php echo
    $this->element('helpbox', 
        array(
            "helptext" => "Isto é passado para o elemento como $helptext",
            "foobar" => "Isto é passado para o elemento como $foobar",
            "cache" => "+2 days", //define o cache (armazenamento) para +2 dias.
            "plugin" => "" //para renderizar um elemento de um plugin
        )
    );
    ?>

Para armazenar versões diferentes de um mesmo elemento em uma aplicação,
forneça um único valor de chave do cache usando o seguinte formato:

::

    <?php
    $this->element('helpbox',
        array(
            "cache" => array('time'=> "+7 days",'key'=>'unique value')
        )
    );
    ?>

Você pode aproveitar o máximo de elementos usando ``requestAction()``. A
função ``requestAction()`` busca variáveis de view de uma ação de
controller e as retorna como um array. Isto permite a seu elemento
representar um estilo MVC real. Crie uma ação de controller que prepara
as variáveis da view para seus elementos, então chame
``requestAction()`` dentro do segundo parâmentro do ``element()`` para
passar ao elemento as variáveis da view de seu controller.

Para fazer isto, em seu controller adicione algo como o seguinte para o
exemplo Post.

::

    <?php
    class PostsController extends AppController {
        ...
        function index() {
            $posts = $this->paginate();
            if (isset($this->params['requested'])) {
                return $posts;
            } else {
                $this->set('posts', $posts);
            }
        }
    }
    ?>

E então no elemento podemos acessar o modelo de paginação de posts. Para
pegar os últimos cinco posts em uma lista ordenada devemos fazer algo
como o seguinte:

::

    <h2>Últimos Posts</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/direction:asc/limit:5'); ?>
    <?php foreach($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

Caching Elements
----------------

Você pode aproveitar do CakePHP view caching se você fornecer um
parâmetro cache. Se definido como true, ele armazenará por 1 dia. Ou
então você pode definir tempos de expiração alternativos. Veja
`Caching </pt/view/156/caching>`_ para mais informações em definir
expiração.

::

    <?php echo $this->element('helpbox', array('cache' => true)); ?>

Se você renderizar o mesmo elemento mais de uma vez em um view e tiver o
cache ativado tenha certeza de definir o parâmentro 'key' (chave) para
um nome diferente em cada vez. Isto previnirá cada chamada sucessiva de
substituir o resultado armazenado da chamada element() anterior. E.g.

::

    <?php
    echo $this->element('helpbox', array('cache' => array('key' => 'first_use', 'time' => '+1 day'), 'var' => $var));

    echo $this->element('helpbox', array('cache' => array('key' => 'second_use', 'time' => '+1 day'), 'var' => $differentVar));
    ?>

O código acima assegura que ambos os elementos são armazenados
separadamente.

Solicitar Elementos de um Plugin
--------------------------------

Se você estiver usando um plugin e deseja usar elementos de dentro do
plugin, apenas especifique o parâmetro do plugin. Se a view está sendo
renderizada para um plugin controller/action, ela automaticamente
apontará para o elemento para o plugin. Se o elemento não existir no
plugin, ela irá procurar na pastar principal APP.

::

    <?php echo $this->element('helpbox', array('plugin' => 'pluginname')); ?>

Métodos de View
===============

Métodos de view são acessíveis em todos arquivos de view, element e
layout. Para chamar qualquer método de view use ``$this->method()``

set()
-----

``set(string $var, mixed $value)``

Views tem um método ``set()`` que é análogo ao ``set()`` encontrado em
objetos do Controller. Ele lhe permite adicionar variáveis ao
`viewVars <#>`_. Usando set() de seu arquivo view adicionará as
variáveis ao layout e elementos que serão renderizados depois. Veja
`Controller::set() </pt/view/57/Controller-Methods#set-427>`_ para mais
informações sobre usar set().

Em sua view você pode fazer

::

        $this->set('activeMenuButton', 'posts');

Então em seu layout a variável ``$activeMenuButton`` estará disponível e
terá o valor 'posts'.

getVar()
--------

``getVar(string $var)``

Pega o valor de viewVar com o nome $var

getVars()
---------

``getVars()``

Pega uma lista de todas as variáveis disponíveis na view no escopo
atualmente renderizado. Retorna um array dos nomes das variáveis.

error()
-------

``error(int $code, string $name, string $message)``

Mostra uma página de erro ao usuário. Usa layouts/error.ctp par para
renderizar a página.

::

        $this->error(404, 'Not found', 'This page was not found, sorry');

Isto irá denderizar uma página de erro com o título e a mensagem
especificada. É importante notar que a execução do script não é parada
por ``View::error()``. Então você mesmo terá que parar a execução do
código se quizer parar o script.

element()
---------

``element(string $elementPath, array $data, bool $loadHelpers)``

Renderiza um elemento ou uma parte da view. Veja a seção `Elementos da
View </pt/view/97/Elements>`_ para mais informações e exemplos.

uuid
----

``uuid(string $object, mixed $url)``

Gera uma DOM ID única não randomica para um objeto, baseado no tipo de
objeto e url. Este método é geralmente usado por helpers que precisam
gerar DOM ID's únicos para elementos como o AjaxHelper.

::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

addScript()
-----------

``addScript(string $name, string $content)``

Adiciona conteúdo para o buffer interno dos scripts. Este buffer é
disponibilizado no layout como ``$scripts_for_layout``. Este método é
útil ao criar helpers que precisam adicionar javascript ou css
diretamente no layout. Tenha em mente que scripts adicionados no layout
ou elementos no layout não serão adicionado ao ``$scripts_for_layout``
Este método é mais frequentemente usado por helpers internos, como os
Helpers `Javascript </pt/view/207/Javascript>`_ e
`Html </pt/view/205/HTML>`_.

Temas (Themes)
==============

Você pode aproveitar os temas, tornando mais fácil trocar o visual e
sentido de sua página rapidamente.

Para usar temas, você precisa dizer ao seu controller para usar a classe
ThemeView em vez da classe View padrão.

::

    class ExampleController extends AppController {
        var $view = 'Theme';
    }

Para declarar qual tema usar como padrão, especifique o nome do tema em
seu controller.

::

    class ExampleController extends AppController {
        var $view = 'Theme';
        var $theme = 'example';
    }

Você também pode definir ou mudar o nome do tema dentro de uma action ou
dentro de funções de callback ``beforeFilter`` ou ``beforeRender``.

::

    $this->theme = 'another_example';

Arquivos temas de view precisam estar dentro da pasta /app/views/themed.
Dentro da pasta themed, crie uma pasta usando o mesmo nome de seu tema.
Além disso, a estrutura da pasta dentro da pasta
/app/views/themed/exemaple/ é exatamente a mesma de /app/views/.

Por exemplo, o arquivo de view para uma action edit de um controller
Posts deve ficar em /app/views/themed/exemple/posts/edit.ctp. Arquivos
de layout devem ficar em /app/views/themed/example/layouts/.

Se um arquivo de view não pode ser encontrado em um tema, o CakePHP
tentará encontrar o arquivo de view em /app/views/. Desta forma, você
pode criar arquivos views mestres e simplesmente sobrescrevê-los
baseando-se caso-por-caso dentro de sua pasta tema.

Se você tem arquivos CSS ou JavaScript que são específicos de seu tema,
você pode armazená-los em uma pasta theme dentro de webroot. Por
exemplo, suas folhas de estilos devem ser armazenadas em
/app/webroot/themed/example/css/ e seus arquivos JavaScript devem ser
armazenados em /app/webroot/themed/example/js/.

Todos os helpers do CakePHP embutidos são informados de temas e criarão
os caminhos certos automaticamente. Como arquivos view, se um arquivo
não estiver na pasta tema, será padrão a pasta webroot principal.

Media Views
===========

Media views lhe permitem enviar arquivos binários ao usuário. Por
exemplo, você pode desejar ter um diretório de arquivos fora do webroot
para prevenir usuários de usar links diretos para eles. Você pode usar
Media view para puxar o arquivo de uma pasta especial dentro de /app/,
pertimitindo a você realizar autenticação antes de entregar o arquivo ao
usuário.

Para usar o Media view, você precisa dizer ao controller para usar a
classe MediaView ao invés da classe View padrão. Depois disso, apenas
passe parâmetros adicionais para especificar onde seu arquivo está
localizado.

::

    class ExampleController extends AppController {
        function download () {
            $this->view = 'Media';
            $params = array(
                  'id' => 'example.zip',
                  'name' => 'example',
                  'download' => true,
                  'extension' => 'zip',
                  'path' => 'files' . DS
           );
           $this->set($params);
        }
    }

+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Parâmetros   | Descrição                                                                                                                                                                                                                                          |
+==============+====================================================================================================================================================================================================================================================+
| id           | O ID é o nome do arquivo como ele se encontra no servidor de arquivo incluindo a extensão do arquivo.                                                                                                                                              |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| name         | O name lhe permite especificar um nome de arquivo alternativo para ser enviado ao usuário. Especifique o nome sem a extensão do arquivo.                                                                                                           |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| download     | Um valor booleano indicando se headers devem ser enviados forçando o download.                                                                                                                                                                     |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| extension    | A extensão do arquivo. Isto é igualado a uma lista interna de tipos de mime aceitáveis. Se o tipo de mime especificado não está na lista, o arquivo não será baixado.                                                                              |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| path         | O nome da pasta, incluindo o separador final de diretório. O caminho pode ser absoluto ou relativo à pasta APP.                                                                                                                                    |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| mimeType     | Um array com tipos de mime adicionais para serem mesclados com a lista interna MediaView de tipos de mime aceitáveis.                                                                                                                              |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| cache        | Um valor booleano inteiro - Se definido como verdadeiro ele permitirá aos navegadores armazenar o arquivo em cache (o padrão para falso é não definir); de outro forma defína-o o número de segundos no futuro para quando o cache deve expirar.   |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

