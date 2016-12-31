Controllers
###########

 

Introdução
==========

Um controller (controlador) é usado para gerenciar a lógica para uma
parte de sua aplicação. Mais comumente, controllers são usados para
gerenciar a lógica de um único model(modelo). Por exemplo, se você está
construindo um site para uma padaria online, você pode ter um
ReceitasController e um IngredientesController gerenciando suas receitas
e seus ingredientes. No CakePHP, controllers são nomeados de acordo com
o model que manipulam, no plural.

O model Receita é manipulado pelo ReceitasController, o model Produto é
manipulado pelo ProdutosController, e por aí vai.

Seus controllers de aplicação são classes que estendem a classe CakePHP
AppController, a qual por sua vez estende a classe núcleo Controller. A
classe AppController pode ser definida em app/app\_controller.php e deve
conter métodos que são compartilhados entre todos os seus controllers. A
classe AppController estende o Controller que é uma classe padrão da
biblioteca CakePHP.

Controllers podem incluir qualquer número de métodos que são geralmente
referidos como *actions* (ações). Actions são métodos do controlador
usados para mostrar views. Uma action é um único método de um
controlador. O despachante do CakePHP chama actions quando uma
requisição casa uma URL com uma action do controller. Retornando ao
nosso exemplo da padaria online, nosso ReceitasController pode conter as
actions ver(), compartilhar() e buscar(). O controller poderia ser
encontrado em app/controllers/receitas\_controller.php e poderia conter:

::

        <?php
        
        # /app/controllers/receitas_controller.php

        class ReceitasController extends AppController {
            function ver($id)     {
                // a lógica da action vai aqui...
            }

            function compartilhar($cliente_id, $receita_id) {
                // a lógica da action vai aqui...
            }

            function buscar($query) {
                // a lógica da action vai aqui...

            }
        }

        ?>

Para que você possa usar o controller de forma mais efetiva em sua
aplicação, vamos cobrir alguns dos principais atributos e métodos
fornecidos pelos controllers do CakePHP.

A classe AppController
======================

Como mencionado na introdução, a classe AppController é o pai de todos
os outros controladores da aplicação. A própria AppController é
extendida da classe Controller que faz parte das bibliotecas do CakePHP.
Assim sendo, AppController é definido em /app/app\_controller.php como:

::

    <?php
    class AppController extends Controller {
    }
    ?>

Os atributos e métodos criados em AppController vão estar disponíveis
para todos os controladores da aplicação. Este é o lugar ideal para
criar códigos que são comuns para todos os seus controladores.
Componentes (que você vai aprender mais tarde) são a melhor alternativa
para códigos que são usados por muitos (mas não obrigatoriamente em
todos) controladores.

Enquanto regras normais de orientação à objetos são aplicadas, CakePHP
também faz um pequeno trabalho extra quando se trata de atributos
especiais do controlador, como uma lista de componentes (*components*)
ou ajudante (*helpers*) usados no controlador. Nestes casos, as cadeias
de valores do AppController são mesclados com os valores do controlador
filho.

CakePHP mescla as seguinte variáveis do AppController com as de seus
controladores:

-  $components
-  $helpers
-  $uses

Também lembre de fazer as chamadas do AppController no controlador filho
para obter melhores resultados:

::

    function beforeFilter(){
        parent::beforeFilter();
    }

O Controller Pages
==================

O core do CakePHP possui um controlador padrão chamado Pages
(cake/libs/controller/pages\_controller.php). A página inicial que você
vê depois da instalações é gerada usando esse controle. Ex. Se você fez
um arquivo view app/views/pages/about\_us.ctp você pode acessá-lo usando
a url http://seudominio.com/pages/display/about\_us

Quando você "queimar" uma aplicação usando o console do CakePHP o
controlador Pages é copiado para o diretório app/controllers/ e você
pode modificá-lo para suas necessidades. Ou você poderia apenas copiar o
page\_controller.php do core para sua aplicação.

Não faça diretamente QUALQUER alteração dentro do diretório ``cake``
para evitar problemas quando atualizar o núcleo no futuro.

Atributos
=========

Para uma lista completa de atributos do controller e suas descrições
visite a API do CakePHP. Dê uma olhada <a
href="https://api.cakephp.org/class/controller">https://api.cakephp.org/class/controller</a>.

$name
-----

Usuários PHP4 devem iniciar suas definições de controllers usando o
atributo $name. O atributo $name deve conter o nome do controller.
Geralmente é apenas a forma plural do nome do model. Isso cuida de
alguns dos problemas de nomes de classe do PHP4 e ajuda o CakePHP a
encontrar os nomes das coisas.

::

    <?php

    #   exemplo de uso do atributo $name do controller

    class RecipesController extends AppController {
       var $name = 'Recipes';
    }

    ?>   

$components, $helpers e $uses
-----------------------------

Os próximos atributos de controller usados com maior frequência dizem ao
CakePHP que helpers(Ajudantes), components(Componentes) e models você
usará junto com o controller atual. Usar esses atributos disponibiliza
essas classes MVC para o controller como variáveis de classe
(``$this->NomeDoModel``, por exemplo).

Cada controller tem algumas dessas classes disponíveis por padrão, então
você pode nem mesmo ter que configurá-lo.

Controllers tem, por padrão, seu model principal disponível. Nosso
ReceitasController terá o model Receita disponível em
``$this->Receita``, e nosso ProdutosController também tem acesso ao
model Produto em ``$this->Produto``. Entretanto ao permitir o acesso do
controller a models adicionais através da variável ``$uses``, o nome do
controller em que se está editando deve ser também incluído. Isto é
ilustrado no exemplo abaixo.

Os helpers Html, Form e Session estão sempre disponíveis por padrão,
assim como o componente Session. Para aprender mais sobre essas classes,
lembre-se de dar uma olhada em suas respectivas seções mais a frente
neste manual.

Vamos dar uma olhada em como dizer a um controlador do CakePHP que você
deseja usar classes MVC adicionais.

::

    <?php
    class ReceitasController extends AppController {
        var $name = 'Receitas';

        var $uses = array('Receita', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }

    ?>   

Cada uma destas variáveis são mescladas com seus respectivos valores
herdados; não é necessário, portanto, declarar novamente o Form helper
(por exemplo), ou qualquer outra coisa já declarada no seu
AppController.

Se você não deseja utilizar um model no seu controler, ajuste para var
$uses = null ou var $uses = array(). Isso vai permitir você usar um
controller sem a necessidade de um arquivo de model correspondente.

Relativo a página: $layout e $pageTitle
---------------------------------------

Alguns atributos existem nos controllers do CakePHP que dão maior
controle sobre como suas views são embutidas em um layout.

O atributo ``$layout`` pode conter o nome do layout salvo em
/app/views/layouts. Você especifica um layout atribuindo ao atributo
``$layout`` o nome do arquivo de layout menos a extensão .ctp. Se esse
atributo não for definido, o CakePHP renderiza o layout padrão,
default.ctp. Se você não definiu um em /app/views/default.ctp, o layout
default do núcleo do CakePHP será renderizado.

::

    <?php

    //   Usando $layout para definir um layout alternativo

    class ReceitasController extends AppController {
        function quickSave() {
            $this->layout = 'ajax';
        }
    }

    ?>

Você também pode mudar o título da página usando ``$pageTitle``. Para
isso funcionar devidamente, é preciso incluir no seu layout a variável
``$title_for_layout`` entre as tags ``<title>`` e ``</title>`` no
cabeçalho(\ ``<head>``) do seu documento HTML

::

    <?php

    //   Usando $pageTitle para definir o título da página

    class ReceitasController extends AppController {
        function quickSave() {
            $this->pageTitle = 'Meu título otimizado para mecanismos de busca';
        }
    }

    ?>

Você pode definir o título da página a partir de um view usando
``$this->pageTitle`` (é necessário incluir o ``$this->``). Para uma
página estática você deve usar ``$this->pageTitle`` no view se quiser um
título personalizado.

Se ``$this->pageTitle`` não estiver definido, um título será
automaticamente gerado baseando-se no nome do controlador ou no nome do
arquivo da view, caso se trate de uma página estática.

Atributos dos parâmetros ($params)
----------------------------------

Parâmetros do controller estão disponíveis em $this->params no seu
controller CakePHP. Essa variável é usada para dar acesso à informação
sobre a requisição atual. O uso mais comum do $this>params é obter
acesso à informação que foi enviada ao controller via operações POST ou
GET.

form
~~~~

``$this->params['form']``

Qualquer dado do POST de qualquer formulário é guardado aqui, incluindo
também informação encontrada em $\_FILES.

admin
~~~~~

``$this->params['admin']``

Possui o valor 1 caso a action atual seja invocada via admin routing.

bare
~~~~

``$this->params['bare']``

Guarda 1 se o layout atual está vazio, 0 se não.

isAjax
~~~~~~

``$this->params['isAjax']``

Guarda 1 se o layout atual é 'ajax', 0 se não. Essa variável só é
configurada se o component RequestHandler está sendo usado no
controller.

controller
~~~~~~~~~~

``$this->params['controller']``

Guarda o nome do controller atual manipulando a requisição. Por exemplo,
se a URL /posts/ver/1 foi requisitada, $this->params['controller'] será
igual à 'posts'.

action
~~~~~~

``$this->params['action']``

Guarda o nome da action atual manipulando a requisição. Por exemplo, se
a URL /posts/ver/1 é requisitada, ``$this->params['action']`` será igual
'ver'.

pass
~~~~

``$this->params['pass']``

Retorna um array (de índice numérico) dos parâmetros da URL depois da
Action

::

    // URL: /posts/view/12/print/narrow

    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
~~~

``$this->params['url']``

Guarda a URL atual requisitada, com os pares chave-valor das variáveis
GET. Por exemplo, se a URL /posts/view/?var1=3&var2=4 foi chamada,
``$this->params['url']`` conterá:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

Usado para manipular os dados POST enviados dos formulários FormHelper
ao controller.

::

    // O FormHelper é usado para criar um elemento form:
    $form->text('Usuario.primeiro_nome');

Que fica assim após ser renderizado:

::

    <input name="data[Usuario][primeiro_nome]" value="" type="text" />

Quando o formulário é enviado para o controller via POST, os dados são
mostrados em ``$this->data``.

::

    // O nome enviado pode ser encontrado aqui:
    $this->data['Usuario']['primeiro_nome'];

prefix
~~~~~~

``$this->params['prefix']``

Contém o valor do prefixo do routing. Este atributo, por exemplo, deverá
conter a string "admin" durante a requisição de
/admin/posts/algumaaction.

named
~~~~~

``$this->params['named']``

Armazena qualquer parâmetro nomeado da url no formato /chave:valor/. Por
exemplo: se a URL /posts/ver/var1:3/var2:4 fosse requisitada,
``$this->params['named']`` seria uma array contendo:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Outros atributos
----------------

Ainda que você possa dar uma olhada nos detalhes de todos atributos de
controllers na API, existem outros atributos de controllers que merecem
suas próprias seções no manual.

O atributo $cacheAction serve para criar cache das views, e o atributo
$paginate é usado para criar a paginação padrão para o controller. Para
mais informação sobre como usar esses atributos, dê uma olhada em suas
respectivas seções mais a frente nesse manual.

persistModel
------------

Usado para criar instâncias de modelos em cache um controlador utiliza.
Quando definido para true, todos os modelos relacionados com o
controlador será armazenada. Isto pode aumentar o desempenho, em muitos
casos.

Métodos
=======

Para uma lista completa de métodos do controller e suas descrições
visite a API CakePHP. Dê uma olhada
`https://api.cakephp.org/class/controller <https://api.cakephp.org/class/controller>`_.

Interagindo com as views
------------------------

set(string $var, mixed $value)

O método set() é a principal forma de enviar dados do seu controller
para sua view. Um vez que você usou set(), a variável pode ser acessada
na sua view.

::

    <?php
        
    // Primeiro você passa os dados do controller:

    $this->set('cor', 'rosa');

    // Então, na view, você pode utilizar os dados:

    Você selecionou a cor <?php echo $cor; ?> para colorizar o cake.

    ?>

O método set() também pega um array associativo como seu primeiro
parâmetro. Esse pode ser geralmente um caminho rápido para atribuir um
grupo de informações para a view. Perceba que os índices de seu array
sofrerão inflection antes de serem atribuídos à view
('indice\_com\_underline' se torna 'indiceComUnderline', etc.):

::

    <?php
        
    $dados = array(
        'cor' => 'rosa',
        'tipo' => 'açucar'’,
        'preco_base' => 23.95
    );

    // fazem $cor, $tipo, e $precoBase
    // disponíveis na view:

    $this->set($data);  

    ?>

render(string $action, string $layout, string $file)

O método render() é automaticamente chamado ao final de cada action do
controller requisitada. Esse método executa toda a lógica da view
(usando dados que você forneceu usando o método set()), insere a view
dentro do layout e o serve de volta para o usuário final.

O arquivo de view padrão renderizado é determinado por convenção. Se a
action buscar() do ReceitasController é requisitada, o arquivo de view
/app/views/receitas/buscar.ctp será renderizado.

Ainda que o CakePHP vá automaticamente chamá-lo (a menos que você
configure $this->autoRender para false) depois de cada lógica de action,
você pode usá-lo para especificar um arquivo de view alternativo
configurando o nome da action no controller usando $action. Você pode
também especificar um arquivo alternativo um terceiro parâmetro, $file.
Quando usar $file, lembre-se de utilizar um pouco das constantes globais
do CakePHP (como a VIEWS).

O parâmetro $layout permite especificar o layout na qual a view é
renderizada.

set
~~~

``set(string $var, mixed $value)``

O método set() é a principal forma de enviar dados do seu controller
para sua view. Um vez que você usou set(), a variável pode ser acessada
na sua view.

::

    <?php
        
    // Primeiro você passa os dados do controller:

    $this->set('cor', 'rosa');

    // Então, na view, você pode utilizar os dados:

    Você selecionou a cor <?php echo $cor; ?> para colorizar o cake.

    ?>

O método set() também pega um array associativo como seu primeiro
parâmetro. Esse pode ser geralmente um caminho rápido para atribuir um
grupo de informações para a view. Perceba que os índices de seu array
sofrerão inflection antes de serem atribuídos à view
('indice\_com\_underline' se torna 'indiceComUnderline', etc.):

::

    <?php
        
    $dados = array(
        'cor' => 'rosa',
        'tipo' => 'açucar'’,
        'preco_base' => 23.95
    );

    // fazem $cor, $tipo, e $precoBase
    // disponíveis na view:

    $this->set($dados);  

    ?>

render
~~~~~~

``render(string $action, string $layout, string $file)``

O método ``render()`` é automaticamente chamado ao final de cada action
do controller requisitada. Esse método executa toda a lógica da view
(usando dados que você forneceu usando o método ``set()``), insere a
view dentro do layout e o serve de volta para o usuário final.

O arquivo final de view padrão renderizado é determinado por convenção.
Se a action ``buscar()`` do ReceitasController é requisitada, o arquivo
de view /app/views/receitas/buscar.ctp será renderizado.

::

    class ReceitasController extends AppController {
    ...
        function buscar() {
            // Renderiza a view em /views/recipes/busca.ctp
            $this->render();
        }
    ...
    }

Ainda que o CakePHP vá automaticamente chamá-lo (a menos que você
configure ``$this->autoRender`` para false) depois de cada lógica de
action, você pode usá-lo para especificar um arquivo de view alternativo
configurando o nome da action no controller usando ``$action``.

Se ``$action`` inicia com '/' é assumido ser uma view ou um arquivo
relativo a pasta /app/view. Isto permite rederização direto de
elementos, muito útil em chamadas ajax.

::

    // Renderiza o elemento em /views/elements/ajaxreturn.ctp
    $this->render('/elements/ajaxreturn');

Você pode também especificar um arquivo alternativo um terceiro
parâmetro, $file. Quando usar $file, lembre-se de utilizar um pouco das
constantes globais do CakePHP (como a VIEWS).

O parâmetro $layout permite especificar o layout na qual a view é
renderizada.

Fluxo de controle
-----------------

redirect(string $url, integer $status, boolean $exit)

O método de controle de fluxo que você vai usar com maior freqüência é o
redirect(). Esse método pega seu primeiro parâmetro na forma de uma URL
relativa CakePHP. Quando um usuário fez uma compra com sucesso, você
provavelmente irá redirecioná-lo para a tela de recibo.

::

    <?php
        
    function comprar() {

        // A lógica para finalizar a compra vai aqui...

        if($sucesso) {
            $this->redirect('/compras/obrigado');
        } else {
            $this->redirect('/compras/confirmar');
        }
    }

    ?>

O segundo parâmetro do redirect() lhe permite definir um código de
status HTTP para acompanhar o redirecionamento. Você pode querer usar
301 (movido permanentemente) ou 303 (veja outro), dependendo da natureza
do redirecionamento.

Esse método não chama exit() depois de redirecionar a menos que você
configure o terceiro parâmetro para true.

flash(string $message, string $url, integer $pause)

Similarmente, o método flash() é usado para direcionar o usuário para
uma nova página depois de uma operação. O método flash() é diferente
pelo fato de mostrar uma mensagem antes de passar o usuário para uma
outra URL.

O primeiro parâmetro deve guardar a mensagem a ser mostrada, e o segundo
parâmetro é uma URL relativa CakePHP. CakePHP vai mostrar a mensagem na
variável $message, por um tempo definido em segundos na variável $pause
antes de direcionar o usuário.

Para mensagens flash dentro da página, dê uma olhada no método
setFlash() do component Session.

redirect
~~~~~~~~

``redirect(string $url, integer $status, boolean $exit)``

O controle de fluxo que você vai utilizar com maior frequência é o
``redirect()``. Este método tem seu primeiro parâmetro em forma de uma
URL relativa do CakePHP. Quando um usuário finaliza uma operação com
sucesso, você pode desejar apresentar uma página de saudação ou
confirmação.

::

    function placeOrder() {

        //A lógica da operação vai aqui

        if($success) {
            $this->redirect(array('controller' => 'ordens', 'action' => 'obrigado'));
        } else {
            $this->redirect(array('controller' => 'ordens', 'action' => 'confirma'));
        }
    }

Você também pode usar uma URL relativa ou absoluta no parâmetro $url:

::

    $this->redirect('/ordens/obrigado'));
    $this->redirect('http://www.exemplo.com');

Você também pode passar dados para a próxima ação:

::

    $this->redirect(array('action' => 'edit', $id));

O segundo parâmetro do ``redirect()`` permite você definir um código de
status HTTP para acompanhar o redirecionamento. Você pode querer usar
301 (mover permanentemente) ou 303 (ver outro), dependendo da natureza
do redirecionamento.

O método irá emitir um ``exit()`` após o redirecionamento, a menos que
você defina o terceiro parâmetro como ``false``.

Se você precisa fazer um redirecionamento para um página de referência
você pode usar:

::

    $this->redirect($this->referer());

flash
~~~~~

``flash(string $message, string $url, integer $pause)``

Como o ``redirect()``, o método ``flash()`` é usado para direcionar um
usuário à uma nova página depois de uma operação. O método ``flash()``
se diferencia por apresentar uma mensagem antes de direcionar o usuário
a outra URL

O primeiro parâmetro refere-se a mensagem que deve ser apresentada, e o
segundo parâmetro é uma URL relativa do CakePHP. CakePHP vai apresentar
a ``$message`` por ``$pause`` segundos antes de apresentar a próxima
página.

Para mensagens fixas na página, verifique o método ``setFlash()`` do
*SessionComponent*.

Callbacks
---------

Controllers CakePHP vem com callbacks para inserir lógica exatamente
antes ou depois das actions serem rederizadas.

beforeFilter()

Essa função é executada antes de qualquer action no controller. É o
lugar ideal para checar uma sessão ativa ou inspecionar permissões.

beforeRender()

Chamada após a lógica da action do controller, mas antes da view ser
renderizada. Esse callback não é usado geralmente, mas pode ser
necessário se você está chamando render() manualmente antes do final de
uma dada action.

afterFilter()

Chamada depois de toda action do controller.

afterRender()

Chamada após toda ação do controller, e depois da rederização ser
completa. Este é o último método de controller a ser rodado.

O CakePHP também suporta callbacks relacionadas a scaffolding

\_beforeScaffold($method)

$method é o nome do método chamado, exemplo: index, edit, etc.

\_afterScaffoldSave($method)

$method é o nome do método chamado a cada edição ou atualização.

\_afterScaffoldSaveError($method)

$method é o nome do método chamado a cada edição ou atualização.

\_scaffoldError($method)

$method é o nome do método chamado, exemplo: index, edit, etc.

Outros métodos úteis
--------------------

constructClasses()

Esse método carrega os models requeridos pelo controller. Esse processo
de carregamento é feito pelo CakePHP normalmente, mas o método é uma boa
quando estiver acessando controllers de diferentes perspectivas. Se você
precisa do CakePHP em um script de linha de comando ou outro uso de
fora, constructClasses() pode ser uma boa.

referrer()

Retorna a URL referida pela requisição atual.

disableCache()

Usado para dizer ao navegador do usuário não fazer cache dos resultados
na requisição atual. Isso é diferente do cache da view, coberto no
capítulo anterior.

postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

Use esse método para tornar um grupo de dados enviados por POST (de
inputs compatíveis com o helper Html) em um grupo de condições de busca
para o model. Essa função oferece um atalho rápido para criar lógica de
busca. Por exemplo, um usuário administrativo pode querer ser capaz de
buscar compras para saber quais itens precisam ser enviados. Você pode
criar um rápido formulário baseado no model Compra. Então a action do
controller pode usar os dados enviados do formulário para criar as
condições de busca.

::

    function index() {
        $o = $this->Orders->findAll($this->postConditions($this->data));
        $this->set('compras', $o);
    }

Se $this->data['Compra']['destino'] é igual a "Padaria da Cidade Velha",
postConditions converte essa condição para um array compatível para uso
no método NomeDoModel->findAll(). Nesse caso, array("Compra.destino" =>
"Padaria da Cidade Velha").

Se você quer usar um operador SQL diferente entre os termos, forneça-os
usando o segundo parâmetro.

::


    /*
    Conteúdo de $this->data
    array(
        'Compra' => array(
            'num_de_itens' => '4',
            'fornecedor' => 'Trigo Integral LTDA'
        )
    )
    */
     
    // Vamos pegar compras que tem ao menos 4 itens e contém 'Trigo Integral LTDA'
    $c = $this->Compra->findAll($this->postConditions(
        $this->data,
        array('>=', 'LIKE')
    ));

O índice nas especificações de operadores é a ordem das colunas no array
$this->data. Já que num\_de\_itens é o primeiro, o operador >= aplica-se
a ele.

O terceiro parâmetro lhe permite dizer ao CakePHP que operador booleano
SQL usar entre as condições de busca. Strings com 'AND', 'OR', e 'XOR'
são todos valores válidos.

Finalmente, se o último parâmetro está configurado para true, e o
parâmetro $op é um array, os campos não incluídos em $op não serão
incluídos nas condições retornadas.

cleanUpFields(string $modelClass = null)

Esse método de conveniência concatena as várias partes de datas em
$this->data antes de salvar. Se você tem inputs de data do helper Form,
esse método concatena o ano, mês, dia e hora em uma string mais
compatível com banco de dados.

Esse método usa o model padrão do controller (por ex.: o model Cookie
para o controller CookiesController) como alvo para a concatenação, mas
uma classe alternativa pode ser usada como primeiro parâmetro.

paginate()

Esse método é usado para paginar os resultados divididos pelos seus
models. Você pode especificar tamanhos de páginas, condições de busca do
model e mais. Detalhes sobre esse método mais a frente. Dê uma olhada no
capítulo de paginação mais a frente nesse manual.

requestAction(string $url, array $options)

Essa função chama uma action de controller de qualquer lugar e retorna
os dados dessa action. A $url passada é uma URL relativa ao CakePHP
(/nomedocontroller/nomedaaction/parametros). Se o array $options incluir
um valor de retorno. AutoRender é automaticamente configurada para true
para a action do controller, tendo a requestAction te levando para a
view totalmente renderizada.

Nota: apesar de ser possível usar requestAction() para pegar uma view
totalmente renderizada, a perda performance que você obtem passando por
toda a camada da view novamente na realidade não faz valer a pena. O
método requestAction() é melhor usado em conjunto com elements - como um
caminho para enviar lógica de negócio para um element antes da
renderização.

Primeiro, vamos ver como pegar dados da action do controller. Primeiro,
nós precisamos criar a action do controller que retorna algum dado que
precisamos em vários lugares através da aplicação:

::

    // Aqui está nosso controller simples:

    class UsuariosController extends AppController {
        function pegarListaDeUsuarios() {
            return $this->Usuario->findAll('Usuario.ativo = 1');
        }
    }

Imagine que nós precisamos criar uma simples tabela mostrando os
usuários ativos no sistema. Ao invés de duplicar o código de geração de
lista em outro controller, nós podemos pegar dados do
UsuariosController->pegarListaDeUsuarios() ao invés de usar
requestAction();

::

    class ProdutosController extends AppController {
        function mostrarProdutosDoUsuario() {
            $this->set(
                'usuarios', 
                $this->requestAction('/usuarios/pegarListaDeUsuarios')
            );

            // Agora a variável $usuarios na view vai ter dados do
            // UsuariosController::pegarListaDeUsuarios().
        }
    }   

Se você tem um element na sua aplicação que não é estático, você pode
querer usar requestAction() para enviar lógica equivalente à do
controller para o element a medida em que você o injeta nas suas views.
Apesar de elements sempre tem acesso a qualquer variável da view que o
controller passou, essa é uma forma de passar dados para o element
vindos de outro controller.

Se você criou uma action do controller que fornece a lógica necessária,
você pode pegar dados e passá-lo para o segundo parâmetro do método
renderElement() da view usando requestAction().

::

    <?php 
    echo $this->renderElement(
        'usuarios',
        $this->requestAction('/usuarios/pegarListaDeUsuarios')
    );
    ?>

Se o array '$options' contiver um valor "return", a action do controller
será renderizada dentro de um layout vazio e retornada. Dessa forma, a
função requestAction() é útil também em situações Ajax onde um pequeno
elemento de uma view precisa ser preenchido antes ou durante uma
atualização Ajax.

constructClasses
~~~~~~~~~~~~~~~~

Este método carrega os models requeridos pelo controller. O processo de
carregamento é feito pelo CakePHP normalmente, mas o método é uma boa
quando estiver acessando controllers a partir de uma perspectiva
diferente. Se você precisa do CakePHP em um script de linha de comando
ou outro uso de fora, constructClasses() pode ser bastante útil.

referer
~~~~~~~

Retorna a URL referenciada pela requisição atual.

disableCache
~~~~~~~~~~~~

Usado para dizer ao **navegador** do usuário não fazer cache dos
resultados na requisição atual. Isso é diferente do cache da view,
coberto no capítulo anterior.

Os headers a este efeito são:

``Expires: Mon, 26 Jul 1997 05:00:00 GMT``

``Last-Modified: [current datetime] GMT``

``Cache-Control: no-store, no-cache, must-revalidate``

``Cache-Control: post-check=0, pre-check=0``

``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $data, mixed $op, string $bool, boolean $exclusive)``

Use esse método para tornar um grupo de dados enviados por POST (de
inputs compatíveis com o helper Html) em um grupo de condições de busca
para o model. Essa função oferece um atalho rápido para criar lógica de
busca. Por exemplo, um usuário administrativo pode querer ser capaz de
buscar compras para saber quais itens precisam ser enviados. Você pode
usar os helpers Form e Html para criar um rápido formulário baseado no
model Compra. Então uma action do controller pode usar os dados enviados
do formulário para criar as condições de busca.

::

    function index() {
        $o = $this->Compra->findAll($this->postConditions($this->data));
        $this->set('compras', $o);
    }

Se $this->data['Compra']['destino'] é igual a "Padaria da Cidade Velha",
postConditions converte essa condição para um array compatível para uso
no método NomeDoModel->findAll(). Nesse caso, array("Compra.destino" =>
"Padaria da Cidade Velha").

Se você quer usar um operador SQL diferente entre os termos, forneça-os
usando o segundo parâmetro.

::


    /*
    Conteúdo de $this->data
    array(
        'Compra' => array(
            'num_de_itens' => '4',
            'fornecedor' => 'Trigo Integral LTDA'
        )
    )
    */
     
    // Vamos pegar compras que tem ao menos 4 itens e contém 'Trigo Integral LTDA'
    $c = $this->Compra->findAll($this->postConditions(
        $this->data,
        array('>=', 'LIKE')
    ));

O índice nas especificações de operadores é a ordem das colunas no array
$this->data. Já que num\_de\_itens é o primeiro, o operador >= aplica-se
a ele.

O terceiro parâmetro lhe permite dizer ao CakePHP que operador booleano
SQL usar entre as condições de busca. Strings com 'AND', 'OR' e 'XOR'
são todos valores válidos.

Finalmente, se o último parâmetro está configurado para true, e o
parâmetro $op é um array, os campos não incluídos em $op não serão
incluídos nas condições retornadas.

paginate
~~~~~~~~

Este método é usado para paginar resultados trazidos pelos seus modelos
(*models*). Você pode especificar o tamanho das páginas, as condições da
consulta do modelo, etc. Veja a seção
`pagination </pt/view/164/pagination>`_ para mais detalhes de como usar
o método paginate.

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $options)``

Esta função chama uma ação do controlador de qualquer local da aplicação
e retorna os dados da ação. O parâmetro ``$url`` passado é uma URL
relativa do CakePHP (/controllername/actionname/params). Para passar
dados extras para o controlador do qual se está invocando a ação, é
necessário adicionar o vetor ``$options``.

Você pode usar ``requestAction()`` para retornar uma visão completamente
renderizada passando '*return*\ ' nas opções:
``requestAction($url, array('return'));``

Se usada sem a opção de cache ``requestAction`` pode levar a um mau
desempenho. Raramente é apropriado para usar em um controlador ou
modelo.

``requestAction`` é melhor usada em conjunto com (cached) elementos –
como maneira de trazer dados de um elemento antes da renderização. Vamos
usar um exemplo colocando um elemento "Últimos comentários" no layout.
Primeiro nos precisamos criar uma função no controlador que vai retornar
os dados.

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
        }
    }

Criando um simples elemento para chamar a função:

::

    // views/elements/latest_comments.ctp
    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

Então podemos colocar o elemento em qualquer lugar para obter o
resultado usando:

::

    echo $this->element('latest_comments');

Escrevendo desta maneira, sempre que o elemento é renderizado, uma
requisição vai fazer o controlador pegar os dados, eles vão ser
processados, e retornados. Modificando a chamada do elemento parecido
com isto:

::

    echo $this->element('latest_comments', array('cache'=>'+1 hour'));

A chamada de ``requestAction`` não vai ser feita enquanto o arquivo de
cache do elemento da visão exista e seja válido.

Em adição, requestAction pode utilizar urls no estilo do cake:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('return'));

Isto permite ignorar o uso de Router::url em chamadas de requestAction,
o que pode aumentar o desempenho. Este modelo de url é o mesmo que o
ajudante HtmlHelper::link usa, com uma diferença - se você está usando
parâmetros 'named' ou 'passed', você deve coloca-lós em um segundo vetor
e acomodá-los com a chave correta. Isto é necessário porque
requestAction só mescla o vetor de argumento nomeados em
Controller::params e não coloca os agumentos nomeados na chave 'named'.

::

    echo $this->requestAction('/articles/featured/limit:3');
    echo $this->requestAction('/articles/view/5');

Como um vetor em requestAction ficaria assim:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('named' => array('limit' => 3)));

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'view'), array('pass' => array(5)));

Ao contrário de outros lugares onde o vertor de urls são análogos as
string de urls, requestAction trata elas diferentemente.

Quando usando um vetor de url em conjunto com com requestAction() você
deve especificar **todos** os parâmetros que você vai precisar na ação
requisitada. Isto inclui parâmetros com ``$this->data`` e
``$this->params['form']``. Adicionalmente para passar parâmetros
requeridos, 'named' e 'passed', isto deve ser feito no segundo vetor
como apresentado acima.

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

A função ``loadModel`` vem ser útil quando você precisa usar um modelo
que não é o modelo padrão do controlador ou que não esta associado a
ele.

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();

