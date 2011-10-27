########################
Tutorial Criando um Blog
########################

Crie um Model Post
==================

A classe Model é o pão com manteiga das aplicações CakePHP. Ao criar um model
do CakePHP que irá interagir com nossa base de dados, teremos os alicerces
necessários para posteriormente fazer nossas operações de visualizar,
adicionar, editar e excluir.

Os arquivos da classe de model do CakePHP ficam em ``/app/Model`` e o arquivo
que iremos criar será salvo em ``/app/Model/Post.php``. O conteúdo completo
deste arquivo deve ficar assim::

    <?php
    
    class Post extends AppModel {
        public $name = 'Post';
    }

A nomenclatura da classe segue uma convenção que é muito importante no CakePHP.
Ao chamar nosso model de Post, o CakePHP pode automaticamente deduzier que este
model será usado num PostsController, e que manipulará os dados de uma tabela do
banco chamada de ``posts``.

.. note::
    
    O CakePHP irá criar um objeto (instância) do model dinamicamente para você,
    se não encontrar um arquivo correspondente na pasta /app/Model. Isto também
    significa que, se você acidentalmente der um nome errado ao seu arquivo
    (p.ex. post.php ou posts.php) o CakePHP não será capaz de reconhecer quais
    de suas configurações e passará usar seus padrões definidos ao invés disso. 

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

    <?php
    class PostsController extends AppController {
        public $helpers = array ('Html','Form');
        public $name = 'Posts';
    }

Agora, vamos adicionar uma action ao nosso controller. Actions quase sempre
representam uma única função ou interface numa aplicação. Por exemplo, quando os
usuários acessarem o endereço www.exemplo.com/posts/index (que, neste caso é o
mesmo que www.exemplo.com/posts/), eles esperam ver a listagem dos posts. O
código para tal ação deve se parecer com algo como::

    <?php
    class PostsController extends AppController {
        public $helpers = array ('Html','Form');
        public $name = 'Posts';
    
        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

Deixe-me explicar a ação um pouco. Definindo a função ``index()`` em nosso
PostsController, os usuários podem acessar a lógica aqui visitando o endereço
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
variável na view chamada 'posts' que vai conter o retorno da chamada ao método
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
criar uma pasta chamada 'Posts'). Para apresentar os dados do post num adequado
formato de tabela, o código de nossa view deve ser algo como::

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
na forma /controller/action/param1/param2.

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

    <?php
    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
        public $name = 'Posts';
    
        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }
    
        public function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

A chamada do método ``set()`` deve lhe parece familiar. Perceba que estamos
usando o método ``read()`` ao invés do ``find('all')`` porque nós realmente só
queremos informações de um único post.

Note que a action de nossa view recebe um parâmetro: O ID do post que queremos
ver. Este parâmetro é repassado à action por meio da URL requisitada. Se um
usuário acessar uma URL /posts/view/3, então o valor '3' será atribuído ao
parâmetro ``$id``.

Agora vamos criar a view para nossa nova action 'view' e colocá-la em
``/app/views/posts/view.ctp``::

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

Primeiramente, comece criando uma action add() no PostsController::

    <?php
    class PostsController extends AppController {
        public $name = 'Posts';
        public $components = array('Session');
    
        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    
        public function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
    
        }
    
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Post->save($this->request->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

.. note::

    Você precisa incluir o componente SessionComponent e o helper SessionHelper
    em qualquer controller que você manipula variáveis de sessão. Neste caso,
    incluimos apenas o componente porque ele carrega o helper automaticamente.
    Se você sempre utiliza sessões, inclua o componente no seu arquivo
    AppController.

Aqui está o que a action add() faz: se o método da requisição feita pelo cliente
for do tipo post, ou seja, se ele enviou dados pelo formulário, tenta salvar os
dados usando o model Post. Se, por alguma razão ele não salvar, apenas renderize
a view. Isto nos dá uma oportunidade de mostrar erros de validação e outros
avisos ao usuário.

Quando um usuário utiliza um formulário para submeter (POSTar) dados para sua
aplicação, esta informação fica disponível em ``$this->request->data``.Você pode
usar as funções :php:func:`pr()` ou :php:func:`debug()` para exibir os dados se
você quiser conferir como eles se parecem.

Nós usamos o método :php:meth:`SessionComponent::setFlash()` do componente
SessionComponent para definir uma variável de sessão com uma mensagem a ser
exibida na página depois de ser redirecionada. No layout, nós temos
:php:func:`SessionHelper::flash` que exibe a mensagem e limpa a variável de
sessão correspondente. O método :php:meth:`Controller::redirect <redirect>` do
controller redireciona para outra URL. O parâmetro ``array('action'=>'index')``
é convertido para a URL /posts, em outras palavras, a action index do controller
posts. Você pode conferir a função :php:func:`Router::url()` na API para ver os
formatos que você pode usar ao especificar uma URL para actions do CakePHP.

Chamar o método save() irá verificar por erros de validação e abortar o
salvamento se algum erro ocorrer. Vamos falar mais sobre erros de validação e
sobre como manipulá-los nas seções seguintes.

Validação de Dados
==================

O CakePHP percorreu uma longa estrada combatendo a monotonia da validação de
dados de formulário. Todo mundo detesta codificar formulários intermináveis e
suas rotinas de validação. O CakePHP torna tudo isso mais fácil e mais rápido.

Para usufruir das vantagens dos recursos de validação, você vai precisar usar o
FormHelper do Cake em suas views. O :php:class:`FormHelper` está disponível por
padrão em todas as suas views na variável ``$this->Form``.

Aqui está nossa view add::

    <!-- File: /app/View/Posts/add.ctp -->   
    
    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>

Aqui, usamos o FormHelper para gerar a tag de abertura para um formulário que o
``$this->Form->create()`` gera::

    <form id="PostAddForm" method="post" action="/posts/add">

Se o método ``create()`` for chamado sem quaisquer parâmetros, o CakePHP assume
que você está criando um formulário que submete para a action ``add()`` do 
controller atual (ou para a action ``edit()`` se um campo id for incluído nos
dados do formulário), via POST.

The ``$this->Form->input()`` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and automagic here:
``input()`` will output different form elements based on the model
field specified.

The ``$this->Form->end()`` call generates a submit button and ends
the form. If a string is supplied as the first parameter to
``end()``, the FormHelper outputs a submit button named accordingly
along with the closing form tag. Again, refer to
:doc:`/views/helpers` for more on helpers.

Now let's go back and update our ``/app/View/Post/index.ctp``
view to include a new "Add Post" link. Before the ``<table>``, add
the following line::

    <?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look
back at our Post model and make a few adjustments::

    <?php
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
    ?>

The ``$validate`` array tells CakePHP how to validate your data
when the ``save()`` method is called. Here, I've specified that
both the body and title fields must not be empty. CakePHP's
validation engine is strong, with a number of pre-built rules
(credit card numbers, email addresses, etc.) and flexibility for
adding your own validation rules. For more information on that
setup, check the :doc:`/models/data-validation`.

Now that you have your validation rules in place, use the app to
try to add a post with an empty title or body to see how it works.
Since we've used the :php:meth:`FormHelper::input()` method of the 
FormHelper to create our form elements, our validation error 
messages will be shown automatically.

Editing Posts
=============

Post editing: here we go. You're a CakePHP pro by now, so you
should have picked up a pattern. Make the action, then the view.
Here's what the ``edit()`` action of the PostsController would look
like::

    <?php
    function edit($id = null) {
        $this->Post->id = $id;
        if ($this->request->is('get')) {
            $this->request->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

This action first checks that the request is a GET request.  If it is, then
we find the Post and hand it to the view.  If the user request is not a GET, it
probably contains POST data.  We'll use the POST data to update our Post record 
with, or kick back and show the user the validation errors).

The edit view might look something like this::

    <!-- File: /app/View/Posts/edit.ctp -->
        
    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post', array('action' => 'edit'));
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden')); 
        echo $this->Form->end('Save Post');
    ?>

This view outputs the edit form (with the values populated), along
with any necessary validation error messages.

One thing to note here: CakePHP will assume that you are editing a
model if the 'id' field is present in the data array. If no 'id' is
present (look back at our add view), Cake will assume that you are
inserting a new model when ``save()`` is called.

You can now update your index view with links to edit specific
posts::

    <!-- File: /app/View/Posts/index.ctp  (edit links added) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

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

Deleting Posts
==============

Next, let's make a way for users to delete posts. Start with a
``delete()`` action in the PostsController::

    <?php
    function delete($id) {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        if ($this->Post->delete($id)) {
            $this->Session->setFlash('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

This logic deletes the post specified by $id, and uses
``$this->Session->setFlash()`` to show the user a confirmation
message after redirecting them on to ``/posts``.  If the user attempts to
do a delete using a GET request, we throw an Exception.  Uncaught exceptions
are captured by CakePHP's exception handler, and a nice error page is 
displayed.  There are many built-in :doc:`/development/exceptions` that can
be used to indicate the various HTTP errors your application might need
to generate.

Because we're just executing some logic and redirecting, this
action has no view. You might want to update your index view with
links that allow users to delete posts, however::

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
    
    <!-- Here's where we loop through our $posts array, printing out post info -->
    
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

    This view code also uses the FormHelper to prompt the user with a
    JavaScript confirmation dialog before they attempt to delete a
    post.

Routes
======

For some, CakePHP's default routing works well enough. Developers
who are sensitive to user-friendliness and general search engine
compatibility will appreciate the way that CakePHP's URLs map to
specific actions. So we'll just make a quick change to routes in
this tutorial.

For more information on advanced routing techniques, see
:ref:`routes-configuration`.

By default, CakePHP responds to a request for the root of your site
(i.e. http://www.example.com) using its PagesController, rendering
a view called "home". Instead, we'll replace this with our
PostsController by creating a routing rule.

Cake's routing is found in ``/app/Config/routes.php``. You'll want
to comment out or remove the line that defines the default root
route. It looks like this::

    <?php
    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));

This line connects the URL '/' with the default CakePHP home page.
We want it to connect with our own controller, so replace that line
with this one::

    <?php
    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

This should connect users requesting '/' to the index() action of
our PostsController.

.. note::

    CakePHP also makes use of 'reverse routing' - if with the above
    route defined you pass
    ``array('controller' => 'posts', 'action' => 'index')`` to a
    function expecting an array, the resultant URL used will be '/'.
    It's therefore a good idea to always use arrays for URLs as this
    means your routes define where a URL goes, and also ensures that
    links point to the same place too.

Conclusion
==========

Creating applications this way will win you peace, honor, love, and
money beyond even your wildest fantasies. Simple, isn't it? Keep in
mind that this tutorial was very basic. CakePHP has *many* more
features to offer, and is flexible in ways we didn't wish to cover
here for simplicity's sake. Use the rest of this manual as a guide
for building more feature-rich applications.

Now that you've created a basic Cake application you're ready for
the real thing. Start your own project, read the rest of the
`Manual </>`_ and `API <http://api20.cakephp.org>`_.

If you need help, come see us in #cakephp. Welcome to CakePHP!

Suggested Follow-up Reading
---------------------------

These are common tasks people learning CakePHP usually want to study next:

1. :ref:`view-layouts`: Customizing your website layout
2. :ref:`view-elements` Including and reusing view snippets
3. :doc:`/controllers/scaffolding`: Prototyping before creating code
4. :doc:`/console-and-shells/code-generation-with-bake` Generating basic CRUD code
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`: User authentication and authorization tutorial
