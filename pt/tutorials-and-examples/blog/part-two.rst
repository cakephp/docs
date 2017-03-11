##################
Blog - Continuação
##################

Crie um Model Post
==================

A classe Model é o pão com manteiga das aplicações CakePHP. Ao criar um model
do CakePHP que irá interagir com nossa base de dados, teremos os alicerces
necessários para posteriormente fazer nossas operações de visualizar,
adicionar, editar e excluir.

Os arquivos de classe do tipo model do CakePHP ficam em ``/app/Model`` e o
arquivo que iremos criar será salvo em ``/app/Model/Post.php``. O conteúdo
completo deste arquivo deve ficar assim::


    class Post extends AppModel {
        public $name = 'Post';
    }

A nomenclatura da classe segue uma convenção que é muito importante no CakePHP.
Ao chamar nosso model de Post, o CakePHP pode automaticamente deduzir que este
model será usado num PostsController, e que manipulará os dados de uma tabela do
banco chamada de ``posts``.

.. note::

    O CakePHP irá criar um objeto (instância) do model dinamicamente para você,
    se não encontrar um arquivo correspondente na pasta /app/Model. Isto também
    significa que, se você acidentalmente der um nome errado ao seu arquivo
    (p.ex. post.php ou posts.php) o CakePHP não será capaz de reconhecer nenhuma
    de suas configurações adicionais e ao invés disso, passará a usar seus
    padrões definidos internamente na classe Model.

Para saber mais sobre models, como prefixos de nomes de tabelas, callbacks e
validações, confira o capítulo sobre :doc:`/models` deste manual.

Crie o Controller Posts
=======================

A seguir, vamos criar um controller para nossos posts. O controller é onde toda
a lógica de negócio para interações vai acontecer. De uma forma geral, é o local
onde você vai manipular os models e lidar com o resultado das ações feitas sobre
nossos posts. Vamos pôr este novo controller num arquivo chamado
``PostsController.php`` dentro do diretório ``/app/Controller``. Aqui está como
um controller básico deve se parecer::

    class PostsController extends AppController {
        public $helpers = array ('Html','Form');
        public $name = 'Posts';
    }

Agora, vamos adicionar uma action ao nosso controller. Actions quase sempre
representam uma única função ou interface numa aplicação. Por exemplo, quando os
usuários acessarem o endereço www.exemplo.com/posts/index (que, neste caso é o
mesmo que www.exemplo.com/posts/), eles esperam ver a listagem dos posts. O
código para tal ação deve se parecer com algo assim::

    class PostsController extends AppController {
        public $helpers = array ('Html','Form');
        public $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

Deixe-me explicar a ação um pouco. Definindo a função ``index()`` em nosso
PostsController, os usuários podem acessar esta lógica visitando o endereço
www.exemplo.com/posts/index. De maneira semelhante, se definirmos um método
chamado ``foobar()`` dentro do controller, os usuários deveriam ser capazes de
acessá-lo pelo endereço www.exemplo.com/posts/foobar.

.. warning::

    Você pode ficar tentado a nomear seus controller e actions de uma certa
    maneira visando obter uma certa URL. Mas resista a esta tentação. Siga as
    convenções do CakePHP (nomes de controllers no plural, etc) e crie nomes de
    actions e controllers que sejam legíveis e também compreensíveis. Você
    sempre vai poder mapear URLs para seu código utilizando "rotas", conforme
    mostraremos mais à frente.

A única declaração na nossa action utiliza o método ``set()`` para passar dados
do controller para a view (que vamos criar logo mais). A linha define uma
variável na view chamada 'posts' que vai conter o retorno da chamada do método
``find('all')`` do model Post. Nosso model Post está automaticamente disponível
como ``$this->Post`` uma vez que seguimos as convenções de nomenclatura do Cake.

Para aprender mais sobre controllers do CakePHP, confira a seção
:doc:`/controllers`.

Criando as Views de Posts
=========================

Agora que temos nossos dados chegando ao nosso model e com a lógica da nossa
aplicação definida em nosso controller, vamos criar uma view para a ação
``index()`` que criamos acima.

As views do Cake são meros fragmentos voltados à apresentação de dados que vão
dentro do layout da aplicação. Para a maioria das aplicações, as views serão
marcações HTML intercalados com código PHP, mas as views também podem ser
renderizadas como XML, CVS ou mesmo como dados binários.

Os layouts são páginas que encapsulam as views e que podem ser intercambiáveis,
mas por agora, vamos apenas usar o layout padrão.

Lembra da última seção, em que associamos a variável 'posts' para a view usando
o método ``set()``? Com aquilo, os dados foram repassados para a view num
formato parecido com este::

    // print_r($posts) output:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Os arquivos de view do Cake são armazenados na pasta ``/app/View`` dentro de uma
pasta com o mesmo nome do controller a que correspondem (em nosso caso, vamos
criar uma pasta chamada 'Posts'). Para apresentar os dados do post num formato
adequado de tabela, o código de nossa view deve ser algo como:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Posts do Blog</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Data de Criação</th>
        </tr>

        <!-- Aqui é onde nós percorremos nossa matriz $posts, imprimindo
             as informações dos posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'],
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Isto é tão simples quanto parece!

Você deve ter notado o uso de um objeto chamado ``$this->Html``.
Esta é uma instância da classe :php:class:`HtmlHelper` do CakePHP.
O CakePHP vem com um conjunto de helpers que tornam uma moleza fazer coisas como
criar links, gerar formulários, Javascript e elementos dinâmicos com Ajax.
Você pode aprender mais sobre como usá-los na seção :doc:`/views/helpers`, mas o
importante a ser notado aqui é que o método ``link()`` irá gerar um link em HTML
com o título (o primeiro parâmetro) e URL (o segundo parâmetro) dados.

Ao especificar URLs no Cake, é recomendado que você use o formato de array. Este
assunto é explicado com mais detalhes na seção sobre Rotas. Usar o formato de
array para URLs, permite que você tire vantagens da capacidade do CakePHP de
reverter este formato de URL em URLs relativas e vice versa.
você também pode simplesmente informar um caminho relativo à base da aplicação
na forma /controller/action/parametro_1/parametro_2.

Neste ponto, você deve ser capaz de apontar seu navegador para
http://www.exemplo.com/posts/index. Você deve ver sua view, corretamente
formatada com o título e a tabela listando os posts.

Se lhe ocorreu clicar num dos links que criamos nesta view
(no título do post e que apontam para uma URL /posts/view/algum_id),
você provavelmente recebeu uma mensagem do CakePHP dizendo que a action ainda
não foi definida. Se você não tiver visto um aviso assim, então ou alguma coisa
deu errado ou então você já tinha definido uma action anteriormente, e neste
caso, você é muito afoito. Se não, vamos criá-la em nosso PostsController
agora::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
        public $name = 'Posts';

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            $this->set('post', $this->Post->findById($id));
        }
    }

A chamada do método ``set()`` deve lhe parece familiar. Perceba que estamos
usando o método ``read()`` ao invés do ``find('all')`` porque nós realmente só
queremos informações de um único post.

Note que a action de nossa view recebe um parâmetro: O ID do post que queremos
ver. Este parâmetro é repassado à action por meio da URL requisitada. Se um
usuário acessar uma URL /posts/view/3, então o valor '3' será atribuído ao
parâmetro ``$id``.

Agora vamos criar a view para nossa nova action 'view' e colocá-la em
``/app/View/Posts/view.ctp``:

.. code-block:: php

    <!-- File: /app/View/Posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Confira se está funcionando tentando acessar os links em ``/posts/index`` ou
requisitando diretamente um post acessando ``/posts/view/1``.

Adicionando Posts
=================

Ler a partir da base de dados e exibir os posts foi um grande começo, mas
precisamos permitir também que os usuários adicionem novos posts.

Primeiramente, comece criando uma action ``add()`` no PostsController::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Flash');
        public $components = array('Flash');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            $this->set('post', $this->Post->findById($id));
        }

        public function add() {
            if ($this->request->is('post')) {
                if ($this->Post->save($this->request->data)) {
                    $this->Flash->success('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }

.. note::

    Você precisa incluir o componente FlashComponent e o helper FlashHelper
    em qualquer controller que você manipula variáveis de sessão. Neste caso,
    incluímos apenas o componente porque ele carrega o helper automaticamente.
    Se você sempre utiliza sessões, inclua o componente no seu arquivo
    AppController.

Aqui está o que a action ``add()`` faz: se o método da requisição feita pelo cliente
for do tipo post, ou seja, se ele enviou dados pelo formulário, tenta salvar os
dados usando o model Post. Se, por alguma razão ele não salvar, apenas renderize
a view. Isto nos dá uma oportunidade de mostrar erros de validação e outros
avisos ao usuário.

Quando um usuário utiliza um formulário para submeter (POSTar) dados para sua
aplicação, esta informação fica disponível em ``$this->request->data``.Você pode
usar as funções :php:func:`pr()` ou :php:func:`debug()` para exibir os dados se
você quiser conferir como eles se parecem.

Nós usamos o método :php:meth:`FlashComponent::success()` do componente
FlashComponent para definir uma variável de sessão com uma mensagem a ser
exibida na página depois de ser redirecionada. No layout, nós temos
:php:func:`FlashHelper::render()` que exibe a mensagem e limpa a variável de
sessão correspondente. O método :php:meth:`Controller::redirect <redirect>` do
controller redireciona para outra URL. O parâmetro ``array('action' => 'index')``
é convertido para a URL /posts, em outras palavras, a action index do controller
posts. Você pode conferir a função :php:func:`Router::url()` na API para ver os
formatos que você pode usar ao especificar uma URL para actions do CakePHP.

Chamar o método ``save()`` irá verificar por erros de validação e abortar o
salvamento se algum erro ocorrer. Vamos falar mais sobre erros de validação e
sobre como manipulá-los nas seções seguintes.

Validação de Dados
==================

O CakePHP percorreu uma longa estrada combatendo a monotonia da validação de
dados de formulários. Todo mundo detesta codificar formulários intermináveis e
suas rotinas de validação. O CakePHP torna tudo isso mais fácil e mais rápido.

Para usufruir das vantagens dos recursos de validação, você vai precisar usar o
FormHelper do Cake em suas views. O :php:class:`FormHelper` está disponível por
padrão em todas as suas views na variável ``$this->Form``.

Aqui está nossa view add:

.. code-block:: php

    <!-- File: /app/View/Posts/add.ctp -->

    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');

Aqui, usamos o FormHelper para gerar a tag de abertura para um formulário. Aqui
está o HTML gerado pelo ``$this->Form->create()``:

.. code-block:: html

    <form id="PostAddForm" method="post" action="/posts/add">

Se o método ``create()`` for chamado sem quaisquer parâmetros, o CakePHP assume
que você está criando um formulário que submete para a action ``add()`` do
controller atual (ou para a action ``edit()`` se um campo id for incluído nos
dados do formulário), via POST.

O método ``$this->Form->input()`` é usado para criar elementos de formulário de
mesmo nome. O primeiro parâmetro informa ao CakePHP qual o campo correspondente
e o segundo parâmetro permite que você especifique um extenso array de opções.
Neste caso, o número de linhas para o textarea. Há alguma introspecção
"automágica" envolvida aqui: o ``input()`` irá exibir diferentes elementos de
formulário com base no campo do model em questão.

A chamada à ``$this->Form->end()`` gera um botão de submissão e encerra o
formulário. Se uma string for informada como primeiro parâmetro para o
``end()``, o FormHelper exibe um botão de submit apropriadamente rotulado junto
com a tag de fechamento do formulário. Novamente, confira o capítulo sobre os
:doc:`/views/helpers` disponíveis no CakePHP para mais informações sobre os
helpers.

Agora vamos voltar e atualizar nossa view ``/app/View/Post/index.ctp`` para
incluir um novo link para "Adicionar Post". Antes de <table>, adicione a
seguinte linha::

    echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add'));

Você pode estar imaginando: como eu informo ao CakePHP sobre os requisitos de
validação de meus dados? Regras de validação são definidas no model. Vamos olhar
de volta nosso model Post e fazer alguns pequenos ajustes::

    class Post extends AppModel {
        public $name = 'Post';

        public $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }

O array ``$validate`` diz ao CakePHP sobre como validar seus dados quando o
método ``save()`` for chamado. Aqui, eu especifiquei que tanto os campos body e
title não podem ser vazios. O mecanismo de validação do CakePHP é robusto, com
diversas regras predefinidas (números de cartão de crédito, endereços de e-mail,
etc.) além de ser bastante flexível, permitindo adicionar suas próprias regras
de validação. Para mais informações, confira o capítulo sobre
:doc:`/models/data-validation`.

Agora que você incluiu as devidas regras de validação, tente adicionar um post
com um título ou com o corpo vazio para ver como funciona. Uma vez que usamos o
método :php:meth:`FormHelper::input()` do FormHelper para criar nossos elementos
de formulário, nossas mensagens de erros de validação serão mostradas
automaticamente.


Editando Posts
==============

Edição de Posts: Aqui vamos nós. A partir de agora você já é um profissional do
CakePHP, então você deve ter identificado um padrão. Criar a action e então
criar a view. Aqui está como o código da action ``edit()`` do PostsController
deve se parecer::


    function edit($id = null) {
        $this->Post->id = $id;
        if ($this->request->is('get')) {
            $this->request->data = $this->Post->findById($id));
        } else {
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

Esta action primeiro verifica se a requisição é do tipo GET. Se for, nós
buscamos o Post e passamos para a view. Se a requisição não for do tipo GET,
provavelmente esta contém dados de um formulário POST. Nós usaremos estes dados
para atualizar o registro do nosso Post ou exibir novamente a view mostrando
para o usuário os erros de validação.

A view edit pode ser algo parecido com isto:

.. code-block:: php

    <!-- File: /app/View/Posts/edit.ctp -->

    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post', array('action' => 'edit'));
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden'));
        echo $this->Form->end('Save Post');

Esta view exibe o formulário de edição (com os valores populados), juntamente
com quaisquer mensagens de erro de validação.

Uma coisa a atentar aqui: o CakePHP vai assumir que você está editando um model
se o campo 'id' estiver presente no array de dados.
Se nenhum 'id' estiver presente (como a view add de inserção), o Cake irá
assumir que você está inserindo um novo model quando o método ``save()`` for
chamado.

Você agora pode atualizar sua view index com os links para editar os posts
específicos:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp  (links para edição adicionados) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Aqui é onde nós percorremos nossa matriz $posts, imprimindo
    as informações dos posts -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $this->Form->postLink(
                    'Delete',
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Are you sure?')
                )?>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Deletando Posts
===============

A seguir, vamos criar uma maneira para os usuários excluírem posts. Comece com
uma action ``delete()`` no PostsController::

    function delete($id) {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        if ($this->Post->delete($id)) {
            $this->Flash->success('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

Esta lógica exclui o post dado por $id, e utiliza ``$this->Flash->success()``
para mostrar uma mensagem de confirmação para o usuário depois de redirecioná-lo
para ``/posts``.

Se o usuário tentar deletar um post usando uma requisição do tipo GET, nós
lançamos uma exceção. Exceções não apanhadas são capturadas pelo manipulador de
exceções do CakePHP e uma página de erro amigável é mostrada. O CakePHP vem com
muitas :doc:`/development/exceptions` que você pode usar para indicar vários
tipos de erros HTTP que sua aplicação pode precisar gerar.

Como estamos executando apenas uma lógica de negócio e redirecionando, esta
action não tem uma view. Você pode querer atualizar sua view index com links que
permitam ao usuários excluir posts, porém, como um link executa uma requisição
do tipo GET, nossa action irá lançar uma exceção. Precisamos então criar um
pequeno formulário que enviará um método POST adequado. Para estes casos o
helper FormHelper fornece o método ``postLink()``:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Aqui é onde nós percorremos nossa matriz $posts, imprimindo
    as informações dos posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
            <?php echo $this->Form->postLink(
                'Delete',
                array('action' => 'delete', $post['Post']['id']),
                array('confirm' => 'Are you sure?'));
            ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

.. note::
    O código desta view também utiliza o HtmlHelper para solicitar uma
    confirmação do usuário com um diálogo em Javascript antes de tentar excluir
    o post.

Rotas
=====

Para alguns, o roteamento padrão do CakePHP funcionará muito bem. Os
desenvolvedores que estiverem mais afeitos a criar produtos ainda mais amigáveis
aos usuários e aos mecanismos de busca irão gostar da maneira que as URLs do
CakePHP são mapeadas para actions específicas. Então vamos fazer uma pequena
alteração de rotas neste tutorial.

Para mais informações sobre técnicas avançadas de roteamento, veja
:ref:`routes-configuration`.

Por padrão, o CakePHP responde a requisições para a raiz de seu site
(i.e. http://www.exemplo.com) usando seu PagesController e renderizando uma view
chamada de "home". Ao invés disso, vamos substituir isto por nosso
PostsController criando uma regra de roteamento.

As rotas do Cake são encontrada no arquivo ``/app/Config/routes.php``. Você vai
querer comentar ou remover a linha que define a rota raiz padrão. Ela se parece
com::

    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));

Esta linha conecta a URL '/' com a home page padrão do CakePHP. Queremos
conectá-la com nosso próprio controller, então adicionamos uma linha parecida
com isto::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

Isto deve conectar as requisições de '/' à action ``index()`` que criaremos em
nosso PostsController.

.. note::
    O CakePHP também faz uso do 'roteamento reverso' - se, com a rota definida
    acima, você passar ``array('controller' => 'posts', 'action' => 'index')`` a um
    método que espere um array, a URL resultante será '/'. É sempre uma boa
    ideia usar arrays para URLs, já que é a partir disto que suas rotas definem
    para onde suas URLs apontam, além de garantir que os links sempre apontem
    para o mesmo lugar.

Conclusão
=========

Criar aplicações desta maneira irá lhe trazer paz, honra, amor e dinheiro além
de satisfazer às suas mais ousadas fantasias. Simples, não? Tenha em mente que
este tutorial foi muito básico. O CakePHP possui *muito* mais recursos a
oferecer e é flexível de tantas maneiras que não conseguimos mostrar aqui por
questões de simplicidade. Utilize o resto deste manual como guia para construir
mais aplicações ricas em recursos.

Agora que você criou uma aplicação básica com o Cake, você está pronto para a
coisa real. Comece seu próprio projeto, leia o restante do `Manual </>`_ e da
`API <https://api.cakephp.org/2.x/>`_.

E se você precisar de ajuda, nos vemos no canal #cakephp (e no #cakephp-pt).
Seja bem-vindo ao CakePHP!

Leitura Recomendada
-------------------

Estas são as tarefas comuns que pessoas aprendendo o CakePHP geralmente querem
estudar:

1. :ref:`view-layouts`: Customizando o layout do seu website
2. :ref:`view-elements` Incluindo e reutilizando trechos de código
3. :doc:`/controllers/scaffolding`: Prototipando antes de programar
4. :doc:`/console-and-shells/code-generation-with-bake` Gerando código CRUD básico
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`: Tutorial de autenticação e autorização de usuários
