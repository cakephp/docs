Blog
####

Bem-vindo ao CakePHP! Provavelmente você está checando esse tutorial
porque quer aprender mais sobre como o CakePHP funciona. É nosso
objetivo aumentar a produtividade e tornar o desenvolvimento mais
divertido: esperamos que você veja isso à medida que você mergulha no
código.

Esse tutorial irá conduzi-lo através da criação de uma aplicação de um
simples blog. Estaremos baixando e instalando o Cake, criando e
configurando um banco de dados e criando a lógica de aplicação
suficiente para listar, adicionar, editar e deletar posts do blog.

Aqui está o que você irá precisar:

#. Um servidor web rodando. Iremos assumir que você está usando o
   Apache, embora as instruções para usar outros servidores sejam muito
   semelhantes. Poderíamos ter que brincar um pouco com a configuração
   do servidor, mas a maioria das pessoas pode subir o Cake e colocá-lo
   rodando sem nenhuma configuração.

#. Um servidor de banco de dados. Estaremos utilizando o MySQL nesse
   tutorial. Você precisará conhecer o suficiente sobre SQL para poder
   criar um database: o Cake irá tomar as rédeas a partir daí.

#. Conhecimento básico de PHP. Quanto mais programação orientada a
   objetos você tiver feito, melhor: mas não tenha medo se você for um
   fanático da programação procedural.

#. Finalmente, você precisará de um conhecimento básico do padrão de
   programação MVC. Uma rápida visão geral pode ser encontrada no
   Capítulo "Começando com CakePHP", Seção: `Entendendo o
   Model-View-Controller (MVC) </pt/view/10/>`_. Não se preocupe: é só
   meia página, mais ou menos.

Vamos começar!

Download do CakePHP
===================

Primeiro, vamos fazer o download do CakePHP.

Para fazer o download, acesse o projeto CakePHP no github:
`https://github.com/cakephp/cakephp/downloads <https://github.com/cakephp/cakephp/downloads>`_
e faça o download da última versão estável do 1.3.

Você também pode clonar o repositório usando o
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Independente de como você fez o download, coloque o código dentro da
pasta DocumentRoot do seu servidor web. Após terminar de fazer o
download você terá uma estrutura de pastas e arquivos como esta:

::

    /path_to_document_root
        /app
        /cake
        /plugins
        /vendors
        .htaccess
        index.php
        README

Agora é um ótimo momento para você aprender mais sobre como estrutura de
pastas do CakePHP funciona: Veja o capítulo "Princípios Básicos do
CakePHP", Seção : `Estrutura de arquivos do CakePHP </pt/view/19/>`_.

Criando o banco de dados do Blog
================================

O próximo passo é criarmos nossa estrura do banco de dados para o blog.
Para isto, vamos criar uma tabela para armazenar os posts. Em seguida,
vamos também adicionar nesta tabela alguns posts para nossos testes.
Execute este script SQL em seu banco de dados:

::

    /* Primeiramente vamos criar a tabela: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Em seguida, inserir alguns registros de exemplo: */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

Não é obrigatório utiulizar estas mesmas opções e nomes das colunas, mas
se você utilizar as convenções do Cake para banco de dadso e classes
(ambas descritas em `"Convenções do CakePHP"`), você irá
tirar maior proveito das muitas funcionalidades do Cake. O Cake é
flexivel suficiente para se adaptar a qualquer estrutura de banco de
dados, entretanto, adotando as convenções você írá poupar muito tempo.

Veja `"Convenções do CakePHP"` para maiores informações.
Por agora, basta você saber que dando o nome de 'post' para nossa tabela
ela irá ser associada ao modelo Post automaticamente, e tendo campos
chamados de 'modified' e 'created' serão automaticamante gerenciados
pelo Cake.

Configuração do banco de dados
==============================

Continuando: vamos agora avisar ao Cake onde está nosso arquivo de
conexão com o banco de dados e como o Cake deve se conectar a ele. Para
muitos, esta é a única configuração de banco de dados que irá fazer para
toda a aplicação.

Faça uma cópia do arquivo de configuração de modelo do CakePHP
localizado em ``/app/config/database.php.default``. Copie este arquivo
para a mesma pasta, porém com o nome de ``database.php``.

O arquivo de configuração é bem simples: basta alterar os valores da
variável ``$default`` com os dados da nossa configuração. Um exemplo
completo desta configuração irá se parecer com esta:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Uma vez salva esta alteração no seu novo arquivo ``database.php`` , você
estará apto para abrir seu navegador e ver a página de boas vindas do
Cake. Esta deverá lhe mostrar a mensagem que seu arquivo de conexão com
o banco de dados foi encontrado, e que o Cake conseguiu se conectar com
seu banco de dados.

Configuração Opcional
=====================

Existem outros três itens que devem ser configurados. Muitos
desenvolvedores sempre configuram estes dois itens, mas eles não são
obrigatórios para este tutorial. Uma das configurações é customizar a
string (ou "salt") para ser utilizada nos hashes de segurança. O segundo
é definir um número (ou "seed") para uso em criptografia. E o terceiro é
dar permissão de escrita para o CakePHP na pasta ``tmp``.

O security salt é utilizado para gerar os hashes. Altere o valor padrão
do sal editando o arquivo ``/app/config/core.php`` na linha 203. Não
importa muito o que o novo valor seja, basta que não seja de facil
descoberta.

::

    <?php
    /**
     * O texto aleatório utilizado para os metodos de criptografia de segurança.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

O cipher seed é usado para criptografar/descriptografar strings. Altere
o valor padrão editando o arquivo ``/app/config/core.php`` na linha 208.
Não importa muito o que o novo valor seja, basta que não seja de facil
descoberta.

::

    <?php
    /**
     * Uma sequência númerica aleatória (somente dígitos) usada para criptografar/descriptografar strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

A última tarefa é garantir acesso de estrita para a pasta ``app/tmp``. A
melhor maneira para fazer isto é localizar o usuário com que o seu
servidor web é executado (``<?php echo `whoami`; ?>``) e alterar o dono
da pasta ``app/tmp`` para este usuário. O último comando você pode
executar (em \*nix) para alterar o usuário dono da pasta.

::

    $ chown -R www-data app/tmp

Se por alguma razão o CakePHP não conseguir escrever nesta pasta, você
será receberá uma mensagem informativa enquanto estiver em modo de
desenvolvimento.

Uma Palavra Sobre o mod\_rewrite
================================

Ocasionalmente, um novo usuário irá esbarrar em problemas com o
mod\_rewrite, então vou abordá-los superficialmente aqui. Se a página de
boas-vindas do CakePHP parecer um pouco sem graça (sem imagens, sem
cores e sem os estilos css), isso é um indício de que o mod\_rewrite
provavelmente não esteja funcionando em seu sistema. Aqui estão algumas
dicas para lhe ajudar a deixar tudo funcionando corretamente:

#. Certifique-se de que a sobrescrita de opções do .htaccess está
   habilitada: em seu arquivo httpd.conf, você deve ter uma parte que
   define uma seção para cada Directory do seu servidor. Certifique-se
   de que a opção ``AllowOverride`` esteja com o valor ``All`` para o
   Directory correto. Por questões de segurança e performance, *não*
   defina ``AllowOverride`` para ``All`` para ``<Directory />``. Ao
   invés disso, procure o bloco ``<Directory>`` que se refere ao seu
   diretório raíz de seu website.

#. Certifique-se de estar editando o arquivo httpd.conf ao invés de
   algum específico, que seja válido apenas para um dado usuário ou para
   um dado site.

#. Por alguma razão, você pode ter obtido uma cópia do CakePHP sem os
   arquivos .htaccess. Isto algumas vezes acontece porque alguns
   sistemas operacionais tratam arquivos que começam com '.' como
   arquivos ocultos e normalmente não fazem cópias deles. Certifique-se
   de obter sua cópia do CakePHP diretamente da seção de downloads do
   site ou de nosso repositório SVN.

#. Certifique-se de que o Apache esteja carregando o mod\_rewrite
   corretamente! Você deve ver algo como
   ``LoadModule             rewrite_module libexec/httpd/mod_rewrite.so``
   ou (para o Apache 1.3) ``AddModule mod_rewrite.c`` em seu httpd.conf.

Se você não quiser ou não puder carregar o mod\_rewrite (ou algum outro
módulo compatível) em seu servidor de produção, você vai precisar usar o
recurso de URLs amigáveis do CakePHP. No arquivo
``/app/config/core.php``, descomente uma linha parecida com:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

E remova também os arquivos .htaccess em:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

Com isto, suas URLs ficarão parecidas com
www.exemplo.com/index.php/nomecontroller/nomeaction/param ao invés de
www.exemplo.com/nomecontroller/nomeaction/param.

Crie um model Post
==================

A classe Model é o pão e a manteiga das aplicações CakePHP. Ao criar um
model CakePHP que irá interagir com nossa base de dados, teremos os
alicerces necessários para posteriormente fazer nossas operações de
visualizar, adicionar, editar e excluir.

Os arquivos da classe de model do CakePHP ficam em ``/app/models`` e o
arquivo que iremos criar será salvo como ``/app/models/post.php``. O
conteúdo completo deste arquivo deve ser algo assim:

::

    <?php

    class Post extends AppModel {
        var $name = 'Post';
    }

    ?>

A nomenclatura da classe segue uma convenção e é muito importante no
CakePHP. Ao chamar nosso model de Post, o CakePHP pode automaticamente
deduzier que este model será usado num PostsController, e que manipulará
os dados de uma tabela do banco chamada de ``posts``.

O CakePHP irá criar um objeto (instância) do model dinamicamente para
você, se não encontrar um arquivo correspondente na pasta /app/models.
Isto também significa que, se você acidentalmente der um nome errado ao
seu arquivo (p.ex., Post.php ou posts.php) o CakePHP não será capaz de
reconhecer quais de suas configurações e passará usar seus padrões
definidos ao invés disso.

É sempre uma boa ideia definir a variável ``$name``, o que permite que o
sistema rode corretamente também em PHP4.

Para saber mais sobre models, como prefixos de nomes de tabelas,
callbacks e validações, confira o capítulo sobre
`Models </pt/view/66/>`_ deste manual.

Crie um Posts Controller
========================

A seguir, vamos criar um controller para nossos posts. O controller é
onde toda a lógica de negócio para interações vai acontecer. De uma
forma geral, é o local onde você vai manipular os models e lidar com o
resultado das ações feitas sobre nosso post. Vamos pôr este novo
controller num arquivo chamado ``posts_controller.php`` dentro do
diretório ``/app/controllers``. Aqui está como um controller básico deve
se parecer:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';
    }
    ?>

Agora, vamos adicionar uma action ao nosso controller. Actions quase
sempre representam uma única função ou interface numa aplicação. Por
exemplo, quando os usuários acessarem o endereço
www.exemplo.com/posts/index (que, neste caso é o mesmo que
www.exemplo.com/posts/), eles esperam ver a listagem dos posts. O código
para tal ação deve se parecer com algo como:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

Deixe-me explicar a ação um pouco. Definindo a função ``index()`` em
nosso PostsController, os usuários podem acessar a lógica aqui visitando
o endereço www.exemplo.com/posts/index. De maneira semelhante, se
definirmos um método chamado ``foobar()`` dentro do controller, os
usuários deveriam ser capazes de acessá-lo pelo endereço
www.exemplo.com/posts/foobar.

Você pode ser tentado a nomear seus controller e actions de uma certa
maneira visando obter uma certa URL. Mas resista a esta tentação. Siga
as convenções do CakePHP (nomes de controllers no plural, etc) e crie
nomes de actions e controllers que sejam legíveis e também
compreensíveis. Você sempre vai poder mapear URLs para seu código
utilizando "rotas", conforme mostraremos mais à frente.

A única declaração na nossa action utiliza o método ``set()`` para
passar dados do controller para a view (que vamos criar logo mais). A
linha define uma variável na view chamada 'posts' que vai conter o
retorno da chamada ao método ``find('all')`` do model Post. Nosso model
Post está automaticamente disponível como ``$this->Post`` uma vez que
seguimos as convenções de nomenclatura do Cake.

Para aprender mais sobre controllers do CakePHP, confira o capítulo
"Desenvolvendo com CakePHP" na seção `"Controllers" </pt/view/49/>`_.

Criando as Views de Posts
=========================

Agora que temos nossos dados chegando ao nosso model e com a lógica da
nossa aplicação definida em nosso controller, vamos criar uma view para
a action index que criamos acima.

As views do Cake são meros fragmentos voltados à apresentação de dados
que vão dentro do layout da aplicação. Para a maioria das aplicações, as
views serão código HTML embebido com PHP, mas as views também podem ser
renderizadas como XML, CVS ou mesmo como dados binários.

Os layouts são código de apresentação que encapsula a view e que pode
ser intercambiáveis, mas por agora, vamos apenas usar o layout default.

Lembra da última seção, em que associamos a variável 'posts' para a view
usando o método ``set()`` method? Com aquilo, os dados foram
repassadospara a view num formato parecido com este:

::

    // print_r($posts) exibe:

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

Os arquivos de view do Cake são armazenados na pasta ``/app/views``
dentro de uma pasta com o mesmo nome do controller a que correspondem
(em nosso caso, vamos criar uma pasta chamada 'posts'). Para apresentar
os dados do post num adequado formato de tabela, o código de nossa view
deve ser algo como:

::

    <!-- Arquivo: /app/views/posts/index.ctp -->

    <h1>Posts do Blog</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Criado em</th>
        </tr>

        <!-- Aqui varremos nosso array $posts, exibindo informações do post -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], 
    "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Isto é tão simples quanto parece!

Você deve ter notado o uso de um objeto chamado ``$html``. Esta é uma
instância da classe ``HtmlHelper`` do CakePHP. O CakePHP vem com um
conjunto de helpers que tornam uma moleza fazer cosas como criar links,
gerar formulários, Javascript e elementos dinâmicos com Ajax. Você pode
aprender mais sobre como usar helpers nas views no capítulo que aborda
os `Helpers Principais </pt/view/181/Helpers-Principais>`_ do CakePHP,
mas o importante a se notar aqui é que o método ``link()`` irá gerar um
link em HTML com o título e (o primeiro parâmetro) e URL (o segundo
parâmetro) dados.

Ao especificar URLs no Cake, você pode simplesmente informar um caminho
relativo à base da aplicação que o Cake preenche o resto. Dessa maneira,
suas URLs irão normalmente ter um formato como
/controller/action/param1/param2.

Neste ponto, você deve pode apontar seu navegador para
http://www.exemplo.com/posts/index. Você deve ver sua view, corretamente
formatada com o título e a tabela listando os posts.

Se lhe ocorreu clicar num dos links que criamos nesta view (no título do
post e que apontam para uma URL /posts/view/algum\_id), você
provavelmente recebeu uma mensagem do CakePHP dizendo que a action ainda
não foi definida. Se você não tiver visto um aviso assim, então ou
alguma coisa deu errado ou então você já tinha definido uma action
anteriormente, e neste caso, você é teimoso e afoito. De qualquer forma,
vamos criá-la em nosso PostsController agora:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

A chamada a ``set()`` deve lhe parece familiar. Perceba que estamos
usando ``read()`` ao invés de ``find('all')`` porque nós realmente só
queremos informações de um único post.

que a action de nossa view recebe um parâmetro: o ID do post que
queremos ver. Este parâmetro é repassado à action por meio da URL
requisitada. Se um usuário acessar uma URL /posts/view/3, então o valor
'3' será atribuído ao parâmetro ``$id``.

Agora vamos criar a view para nossa nova action 'view' e colocá-la em
/app/views/posts/view.ctp.

::

    <!-- Arquivo: /app/views/posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Criado em: <?php echo $post['Post']['created']?></small></p> 

    <p><?php echo $post['Post']['body']?></p>

Confira se isto está funcionando tentando acessar os links em
/posts/index ou requisitando diretamente um post acessando
/posts/view/1.

Adicionando Posts
=================

Ler a partir da base de dados e exibir os posts foi um grande começo,
mas precisamos permitir também que os usuários adicionem novos posts.

Primeiramente, comece criando uma action ``add()`` no PostsController:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Seu post foi salvo.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

Aqui está o que a action ``add()`` faz: se os dados submetidos do
formulário não estiverem vazios, tenta salvar os dados usando o model
Post. Se, por alguma razão ele não salvar, apenas renderize a view. Isto
nos dá uma oportunidade de mostrar erros de validação e outros avisos ao
usuário.

Quando um usuário utilizar um formulário para submeter (POSTar) dados
para sua aplicação, esta informação fica disponível em ``$this->data``.
Você pode usar as funções ``pr()`` ou ``debug`` para exibir os dados se
você quiser conferir como eles se parecem.

Nós usamos o método ```setFlash()`` </pt/view/400/setFlash>`_ do
componente ``Session`` para definir uma variável de sessão com uma
mensagem a ser exibida na página depois de ser redirecionada. No layout,
nós temos um código ```$session->flash()`` </pt/view/568/flash>`_ que
exibe a mensagem e limpa a variável de sessão correspondente. O método
```redirect`` </pt/view/425/redirect>`_ do controller redireciona para
outra URL. O parâmetro ``array('action'=>'index)`` é convertido para a
URL /posts, i.e., a action index do controller posts. Você pode conferir
a função
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_ na
API para ver os formatos que você pode usar ao especificar uma URL para
várias funções do CakePHP.

Chamar o método ``save()`` irá verificar por erros de validação e
abortar o salvamento se algum erro ocorrer. Vamos falar mais sobre erros
de validação e sobre como manipulá-los nas seções seguintes.

Validação de Dados
==================

O CakePHP percorreu uma longa estrada combatendo a monotonia da
validação de dados de formulário. Todo mundo detesta codificar
formulários intermináveis e suas rotinas de validação. O CakePHP torna
tudo isso mais fácil e mais rápido.

Para usufruir das vantagens dos recursos de validação, você vai precisar
usar o FormHelper do Cake em suas views. O FormHelper está disponível
por padrão em todas as suas views na variável ``$form``.

Aqui está nossa view add:

::

    <!-- Arquivo: /app/views/posts/add.ctp -->    
        
    <h1>Adicionar Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Salvar Post');
    ?>

Aqui, usamos o FormHelper para gerar a tag de abertura para um
formulário que o ``$form->create()`` gera:

::

    <form id="PostAddForm" method="post" action="/posts/add">

Se ``create()`` for chamado sem quaisquer parâmetros, o CakePHP assume
que você está criando um formulário que submete para a action ``add()``
do controller atual (ou para a action ``edit()`` se um campo ``id`` for
incluído nos dados do formulário), via POST.

O método ``$form->input()`` é usado para criar elementos de formulário
de mesmo nome. O primeiro parâmetro informa ao CakePHP qual o campo
correspondente e o segundo parâmetro permite que você especifique um
extenso array de opções - neste caso, o número de linhas para o
textarea. Há alguma introspecção automágica envolvida aqui: o
``input()`` irá exibir diferentes elementos de formulário com base no
campo do model em questão.

A chamada à ``$form->end()`` gera um botão de submissão e encerra o
formulário. Se uma string for informada como primeiro parâmetro para o
``end()``, o FormHelper exibe um botão de submit apropriadamente
rotulado junto com a tag de fechamento do formulário. Novamente, confira
o capítulo sobre os `"Helpers Principais" </pt/view/181/>`_ disponíveis
no CakePHP para mais informações sobre os helpers.

Agora vamos voltar e atualizar nossa view ``/app/views/posts/index.ctp``
para incluir um novo link para "Adicionar Post". Antes de ``<table>``,
adicione a seguinte linha:

::

    <?php echo $html->link('Adicionar Post',array('controller' =>
          'posts', 'action' => 'add'))?>

Você pode estar imaginando: como eu informo ao CakePHP sobre os
requisitos de validação de meus dados? Regras de validação são definidas
no model. Vamos olhar de volta nosso model Post e fazer alguns pequenos
ajustes:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>

O array ``$validate`` diz ao CakePHP sobre como validar seus dados
quando o método ``save()`` for chamado. Aqui, eu especifiquei que tanto
os campos body e title não podem ser vazios. O mecanismo de validação do
CakePHP é robusto, com diversas regras predefinidas (números de cartão
de crédito, endereços de e-mail, etc.) além de ser bastante flexível,
permitindo adicionar suas próprias regras de validação. Para mais
informações, confira o capítulo sobre `Validação de
Dados </pt/view/125/data-validation>`_.

Agora que você incluiu as devidas regras de validação, tente adicionar
um post com um título ou com o corpo vazio para ver como funciona. Uma
vez que usamos o método ``input()`` do FormHelper para criar nossos
elementos de formulário, nossas mensagens de erros de validação serão
mostradas automaticamente.

Excluindo Posts
===============

A seguir, vamos criar uma maneira para os usuários excluírem posts.
Comece com uma action ``delete()`` no PostsController:

::

    function delete($id) {
        $this->Post->delete($id);
        $this->Session->setFlash('O post com id: '.$id.' foi excluído.');
        $this->redirect(array('action'=>'index'));
    }

Esta lógica exclui o post dado por $id, e utiliza
``$this->Session->setFlash()`` para mostrar uma mensagem de confirmação
para o usuário depois de redirecioná-lo para /posts.

Como estamos executando uma lógica de negócio logo antes de
redirecionar, esta action não tem uma view. Você pode querer atualizar
sua view index com links que permitam ao usuários excluir posts:

::

    /app/views/posts/index.ctp

    <h1>Posts do Blog</h1>
    <p><?php echo $html->link('Adicionar Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
                    <th>Ações</th>
            <th>Criado em</th>
        </tr>

    <!-- Aqui é onde varremos nosso array $posts, exibindo informações do post -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $html->link($post['Post']['title'], array('action' => 'view',  $post['Post']['id']));?>
            </td>
            <td>
            <?php echo $html->link('Excluir', array('action' => 'delete', $post['Post']['id']), null, 'Deseja realmente excluir?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

O código desta view também utiliza o HtmlHelper para solicitar uma
confirmação ao usuário com um diálogo em Javascript antes de tentar
excluir o post.

Editando Posts
==============

Edição de Posts: aqui vamos nós. A partir de agora você já é um
profissional do CakePHP, então você deve ter identificado um padrão.
Criar a action e então criar a view. Aqui está como o código da action
``edit()`` do PostsController deve se parecer:

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data)) {
                $this->Session->setFlash('Seu post foi atualizado.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

Esta action primeiro verifica os dados submetidos do formulário. Se nada
tiver sido submetido, ele recupera o Post e o envia para a view. Se
algum dado *tiver sido* submetido, a action tenta salvar os dados usando
o model Post (ou manipula-os mostra os erros de validação de volta para
o usuário).

A view edit pode ser algo parecido com isto:

::

    /app/views/posts/edit.ctp
        
    <h1>Editar Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
        echo $form->input('id', array('type'=>'hidden')); 
        echo $form->end('Salvar o Post');
    ?>

Esta view exibe o formulário de edição (com os valores populados),
juntamente com quaisquer mensagens de erro de validação.

Uma coisa a atentar aqui: o CakePHP vai assumir que você está editando
um model se o campo 'id' estiver presente no array de dados. Se nenhum
'id' estiver presente (como a view add de inserção), o Cake irá assumar
que você está inserindo um novo model quando o método ``save()`` for
chamado.

Você agora pode atualizar sua view index com os links para editar os
posts específicos:

::

    /app/views/posts/index.ctp (com links de edição incluídos)
        
    <h1>Posts do Blog</h1>
    <p><?php echo $html->link("Add Post", array('action'=>'add')); ?>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
                    <th>Ação</th>
            <th>Criado em</th>
        </tr>

    <!-- Aqui é onde varremos nosso array de $posts, exibindo informações de cada post -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'],array('action'=>'view', $post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $html->link(
                    'Excluir', 
                    array('action'=>'delete', $post['Post']['id']), 
                    null, 
                    'Deseja realmente excluir?'
                )?>
                <?php echo $html->link('Editar', array('action'=>'edit', $post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Rotas
=====

Para alguns, o roteamento padrão do CakePHP funcionará muito bem. Os
desenvolvedores que estiverem mais afeitos a criar produtos ainda mais
amigáveis aos usuários e aos mecanismos de busca irão gostar da maneira
que as URLs do CakePHP são mapeadas para actions específicas. Então
vamos fazer uma pequenas alteração de rotas neste tutorial.

Para mais informações sobre técnicas avançadas de roteamento, veja
`"Configuração de Rotas" </pt/view/46/>`_.

Por padrão, o CakePHP responda a requisições para a raíz de seu site
(i.e. http://www.exemplo.com) usando seu PagesController e renderizando
uma view chamada de "home". Ao invés disso, vamos substituir isto por
nosso PostsController criando uma regra de roteamento.

As rotas do Cake são encontrada no arquivo ``/app/config/routes.php``.
Você vai querer comentar ou remover a linha que define a rota raíz
padrão. Ela se parece com:

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

Esta linha conecta a URL '/' com a home page default do CakePHP.
Queremos conectá-la com nosso próprio controller, então adicionamos uma
linha parecida com isto:

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

Isto deve conectar as requisições à '/' à action index() que criaremos
em nosso PostsController.

O CakePHP também faz uso de 'roteamento reverso' - se, com a rota
definida acima, você passar
``array('controller'=>'posts', 'action'=>'index')`` a um método que
espere um array, a URL resultante será '/'. É sempre uma boa ideia usar
arrays para URLs, já que é a partir disto que suas rotas definem para
onde suas URLs apontam, além de garantir que os links sempre apontem
para o mesmo lugar.

Conclusão
=========

Criar aplicações desta maneira irá lhe trazer paz, honra, amor e
dinheiro além de satisfazer às suas mais ousadas fantasias. Simples,
não? Tenha em mente que este tutorial foi muito básico. O CakePHP possui
*muito* mais recursos a oferecer e é flexível de tantas maneiras que não
conseguimos mostrar aqui por questões de simplicidade. Utilize o resto
deste manual como guia para construir mais aplicações ricas em recursos.

Agora que você criou uma aplicação básica em Cake, você está pronto para
a coisa real. Comece seu próprio projeto, leia o restante do
`Manual </pt/>`_ e da `API <https://api.cakephp.org>`_.

E se você precisar de ajuda, nos vemos no canal #cakephp (e no
#cakephp-pt). Seja bem-vindo ao CakePHP!

Suggested Follow-up Reading
---------------------------

These are common tasks people learning CakePHP usually want to study
next:

#. `Layouts: <https://book.cakephp.org/view/1080/Layouts>`_ Customizing
   your website layout
#. `Elements: <https://book.cakephp.org/view/1081/Elements>`_ Including
   and reusing view snippets
#. `Scaffolding: <https://book.cakephp.org/view/1103/Scaffolding>`_
   Prototyping before creating code
#. `Baking: <https://book.cakephp.org/view/1522/Code-Generation-with-Bake>`_
   Generating basic
   `CRUD <https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete>`_
   code
#. `Authentication: <https://book.cakephp.org/view/1250/Authentication>`_
   User registration and login

