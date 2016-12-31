Tutorial - Criando um Blog - Parte 2
####################################

Criando o model
===============

Após criar um model (modelo) no CakePHP, nós teremos a base necessária para
interagirmos com o banco de dados e executar operações.

Os arquivos de classes, correspondentes aos models, no CakePHP estão divididos
entre os objetos ``Table`` e ``Entity``. Objetos ``Table`` provêm acesso à
coleção de entidades armazenada em uma tabela e são alocados em
**src/Model/Table**.

O arquivo que criaremos deverá ficar salvo em
**src/Model/Table/ArticlesTable.php**::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Convenções de nomenclatura são muito importantes no CakePHP. Ao nomear nosso
objeto como ``ArticlesTable``, o CakePHP automaticamente deduz que o mesmo
utilize o ``ArticlesController`` e seja relacionado à tabela ``articles``.

.. note::

    O CakePHP criará automaticamente um objeto model se não puder encontrar um
    arquivo correspondente em **src/Model/Table**. Se você nomear incorretamente
    seu arquivo (isto é, artciclestable.php ou ArticleTable.php), o CakePHP não
    reconhecerá suas definições e usará o model gerado como alternativa.

Para mais informações sobre models, como callbacks e validação, visite o
capítulo :doc:`/orm` do manual.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake através do console do CakePHP para criar o model
    ``ArticlesTable``::

        bin/cake bake model Articles

Para mais informações sobre o bake e suas características relacionadas a
geração de código, visite o capítulo :doc:`/bake/usage` do manual.

Criando o controller
====================

A seguir, criaremos um controller (controlador) para nossos artigos. O
controller é responsável pela lógica de interação da aplicação. É o lugar onde
você utilizará as regras contidas nos models e executará tarefas relacionadas
aos artigos. Criaremos um arquivo chamado **ArticlesController.php** no
diretório **src/Controller**::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Agora, vamos adicionar uma action (ação) ao nosso controller. Actions
frequentemente, representam uma função ou interface em uma aplicação.
Por exemplo, quando os usuários requisitarem www.example.com/articles/index
(sendo o mesmo que www.example.com/articles/), eles esperam ver uma lista de
artigos::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

Ao definir a função ``index()`` em nosso ``ArticlesController``, os usuários
podem acessá-la requisitando www.example.com/articles/index. Similarmente, se
definíssemos uma função chamada ``foobar()``, os usuários poderiam acessá-la em
www.example.com/articles/foobar.

.. warning::

    Vocês podem ser tentados a nomear seus controllers e actions para obter uma
    certa URL. Resista a essa tentação. Siga as :doc:`/intro/conventions` e crie
    nomes de action legíveis e compreensíveis. Você pode mapear URLs para o seu
    código utilizando :doc:`/development/routing`.

A instrução na action usa ``set()`` para passar dados do controller para a view.
A variável é definida como 'articles', sendo igual ao valor retornado do método
``find('all')`` do objeto ``ArticlesTable``.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake através do console do CakePHP para criar o
    controller ``ArticlesController``::

        bin/cake bake controller Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.

Criando as views
================

Agora que nós temos os dados fluindo pelo nosso model, e nossa lógica da
aplicação definida em nosso controller, vamos criar uma view
(visualização) para a action ``index()``.

As views do CakePHP são camadas de apresentação que se encaixam nos layouts
da aplicação. Para a maioria das aplicações, elas são uma mescla entre HTML e
PHP, mas também podem ser distribuídas como XML, CSV, ou ainda dados binários.

Um layout é um conjunto de códigos encontrado ao redor das views. Múltiplos
layouts podem ser definidos, e você pode alterar entre eles, mas agora, vamos
usar o default, localziado em **src/Template/Layout/default.ctp**.

Lembra que na última sessão atribuímos a variável 'articles' à view usando o
método ``set()``? Isso levará a coleção de objetos gerada pela query a ser
invocada numa iteração ``foreach``.

Arquivos de template do CakePHP são armazenados em **src/Template** dentro de
uma pasta com o nome do controller correspondente (nós teremos que criar a
pasta 'Articles' nesse caso). Para distribuir os dados de artigos em uma tabela,
precisamos criar uma view assim:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Aqui é onde iremos iterar nosso objeto de solicitação $articles, exibindo informações de artigos -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

Você deve ter notado o uso de um objeto chamado ``$this->Html``, uma
instância da classe :php:class:`Cake\\View\\Helper\\HtmlHelper` do CakePHP.
O CakePHP vem com um conjunto de view helpers que simplificam tarefas como gerar
links e formulários. Você pode aprender como usá-los em :doc:`/views/helpers`,
mas aqui é importante notar que o método ``link()`` irá gerar um link HTML
com o referido título (primeiro parâmetro) e URL (segundo parâmetro).

Quando se especifíca URLs no CakePHP, é recomendado o uso do formato de array.
Isto será melhor explicado posteriormente na seção Rotas. Usando o formato de
array para URLs, você toma vantagem das capacidades de roteamento
reverso do CakePHP. Você também pode especificar URLs relativas a base da
aplicação com o formato ``/controller/action/param1/param2`` ou usar
:ref:`named routes <named-routes>`.

Neste ponto, você pode visitar http://www.example.com/articles/index no seu
navegador. Você deve ver sua view corretamente formatada listando os artigos.

Se você clicar no link do título de um artigo listado, provavelmente será
informado pelo CakePHP que a action ainda não foi definida, então vamos criá-la
no ``ArticlesController`` agora::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

O uso do ``set()`` deve parecer familiar. Repare que você está usando
``get()`` ao invés de ``find('all')`` porquê nós queremos a informação de apenas
um artigo.

Repare que nossa action recebe um parâmetro: o ID do artigo que gostariamos de
visualizar. Esse parâmetro é entregue para a action através da URL solicitada.
Se o usuário requisitar ``/articles/view/3``, então o valor '3' é passado como
``$id`` para a action.

Ao usar a função ``get()``, fazemos também algumas verificações para garantir
que o usuário realmente está acessando um registro existente , se não
ou se o ``$id`` for indefinido, a função irá lançar uma ``NotFoundException``.

Agora vamos criar a view para nossa action em
**src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Criado: <?= $article->created->format(DATE_RFC850) ?></small></p>

Verifique se está tudo funcionando acessando os links em ``/articles/index`` ou
manualmente solicite a visualização de um artigo acessando ``articles/view/{id}``.
Lembre-se de substituir ``{id}`` por um 'id' de um artigo.

Adicionando artigos
===================

Primeiro, comece criando a action ``add()`` no ``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // Inclui o FlashComponent
        }

        public function index()
        {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Seu artigo foi salvo.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Não é possível adicionar o seu artigo.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    Você precisa incluir o :doc:`/controllers/components/flash` component em qualquer
    controller que vá usá-lo. Se necessário, inclua no ``AppController`` e
    assim o ``FlashComponent`` estará disponível para todos os controllers da
    aplicação.

A action ``add()`` checa se o método HTTP da solicitação foi POST, e então tenta
salvar os dados utilizando o model Articles. Se por alguma razão ele não salvar,
apenas renderiza a view. Isto nos dá a chance de exibir erros de validação ou
outros alertas.

Cada requisição do CakePHP instancia um objeto ``Request`` que é acessível
usando ``$this->request``. O objeto contém informações úteis sobre a requisição
que foi recebida e pode ser usado para controlar o fluxo de sua aplicação. Nesse
caso, nós usamos o método :php:meth:`Cake\\Network\\Request::is()` para checar
se a requisição é do tipo HTTP POST.

Quando se usa um formulário para postar dados, essa informação fica disponível
em ``$this->request->getData()``. Você pode usar as funções :php:func:`pr()` ou
:php:func:`debug()` caso queira verificar esses dados.

Usamos os métodos ``success()`` e ``error()`` do ``FlashComponent`` para definir
uma mensagem que será armazenada numa variável de sessão. Esses métodos são
gerados usando os `recursos de métodos mágicos
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_ do PHP.
Mensagens flash serão exibidas na página após um redirecionamento. No layout nós
temos ``<?= $this->Flash->render() ?>`` que exibe a mensagem e limpa a variável
de sessão. A função do controller
:php:meth:`Cake\\Controller\\Controller::redirect` redireciona para qualquer
outra URL. O parâmetro ``['action' => 'index']`` corresponde a URL /articles,
isto é, a action ``index()`` do ``ArticlesController``. Você pode consultar a
função
:php:func:`Cake\\Routing\\Router::url()` na `API <https://api.cakephp.org>`_ e
checar os formatos a partir dos quais você pode montar uma URL.

Chamar o método ``save()`` vai checar erros de validação e abortar o processo
caso os encontre. Nós vamos abordar como esses erros são tratados nas sessões
a seguir.

Validando artigos
=================

O CakePHP torna mais prática e menos monótona a validação de dados de
formulário.

Para tirar proveito dos recursos de validação, você vai precisar usar o
:doc:`/views/helpers/form` helper em suas views. O
:php:class:`Cake\\View\\Helper\\FormHelper` está disponível por padrão em todas
as views pelo uso do ``$this->Form``.

Segue a view correspondente a action add:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->input('title');
        echo $this->Form->input('body', ['rows' => '3']);
        echo $this->Form->button(__('Salvar artigo'));
        echo $this->Form->end();
    ?>

Nós usamos o ``FormHelper`` para gerar a tag de abertura HTML de um formulário.
Segue o HTML gerado por ``$this->Form->create()``:

.. code-block:: html

    <form method="post" action="/articles/add">

Se ``create()`` é chamado sem parâmetros fornecidos, assume-se a construção de
um formulário que submete dados via POST para a action ``add()`` (ou ``edit()``
no caso de um ``id`` estar incluído nos dados do formulário).

O método ``$this->Form->input()`` é usado para criar elementos do formulário do
mesmo nome. O primeiro parâmetro diz ao CakePHP qual é o campo correspondente, e
o segundo parâmetro permite que você especifique um vasto array de opções,
nesse, o número de linhas para o textarea. ``input()`` vai gerar diferentes
elementos de formulários baseados no tipo de campo especificado no model.

O ``$this->Form->end()`` fecha o formulário, entregando também elementos ocultos
caso a prevenção contra CSRF/Form Tampering esteja habilitada.

Agora vamos voltar e atualizar nossa view **src/Template/Articles/index.ctp**
para incluir um novo link. Antes do ``<table>``, adicione a seguinte linha:

.. code-block:: php

    <?= $this->Html->link('Adicionar artigo', ['action' => 'add']) ?>

Você deve estar se perguntando: como eu digo ao CakePHP meus critérios de
validação? Regras de validação são definidas no model. Vamos fazer alguns
ajustes no nosso model::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator)
        {
            $validator
                ->notEmpty('title')
                ->notEmpty('body');

            return $validator;
        }
    }

O método ``validationDefault()`` diz ao CakePHP como validar seus dados quando
o método ``save()`` for solicitado. Aqui, estamos especificando que tanto o
campo body quanto title não devem estar vazios. O CakePHP possui muitos recursos
de validação e um bom número de regras pré-determinadas (número de cartões,
endereços de email, etc), além de flexibilidade para adicionar regras de
validação customizadas. Para mais informações sobre configuração de validações,
visite a documentação em :doc:`/core-libraries/validation`.

Agora que suas regras de validação estão definidas, tente adicionar um artigo
sem definir o campo title e body para ver como a validação funciona. Desde que
tenhamos usado o método :php:meth:`Cake\\View\\Helper\\FormHelper::input()` do
``FormHelper`` para criar nossos elementos, nossas mensagens de alerta da
validação serão exibidas automaticamente.

Editando artigos
================

Edição, aí vamos nós! Você já é um profissional do CakePHP agora, então
possivelmente detectou um padrão... Cria-se a action e então a view. Aqui segue
a action ``edit()`` que deverá ser inserida no ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function edit($id = null)
    {
        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi atualizado.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Seu artigo não pôde ser atualizado.'));
        }

        $this->set('article', $article);
    }

Essa action primeiramente certifica-se que o registro apontado existe. Se o
parâmetro ``$id`` não foi passado ou se o registro é inexistente, uma
``NotFoundException`` é lançada pelo ``ErrorHandler`` do CakePHP.

Em seguida, a action verifica se a requisição é POST ou PUT e caso seja, os
dados são usados para atualizar a entidade de artigo em questão ao usar
o método ``patchEntity()``. Então finalmente usamos o ``ArticlesTable`` para
salvar a entidade.

Segue a view correspondente a action edit:

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->input('title');
        echo $this->Form->input('body', ['rows' => '3']);
        echo $this->Form->button(__('Salvar artigo'));
        echo $this->Form->end();
    ?>

Essa view retorna o formulário de edição com os dados populados, juntamente
com qualquer mensagem de erro proveniente de validações.

O CakePHP irá determinar se o ``save()`` vai inserir ou atualizar um registro
baseado nos dados da entidade.

Você pode atualizar sua view index com os links para editar artigos:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (edit links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link("Adicionar artigo", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Criado</th>
            <th>Ações</th>
        </tr>

    <!-- Aqui é onde iremos iterar nosso objeto de solicitação $articles, exibindo informações de artigos -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Editar', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Deletando artigos
=================

A seguir, vamos criar uma forma de deletar artigos. Comece com uma action
``delete()`` no ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function delete($id)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('O artigo com id: {0} foi deletado.', h($id)));
            return $this->redirect(['action' => 'index']);
        }
    }

Essa lógica deleta o artigo especificado pelo ``$id`` e usa
``$this->Flash->success()`` para exibir uma mensagem de confirmação após
o redirecionamento para ``/articles``. Tentar excluir um registro usando uma
requisição GET, fará com que o ``allowMethod()`` lance uma exceção. Exceções
são capturadas pelo gerenciador de exceções do CakePHP e uma página de erro é
exibida. Existem muitos :doc:`Exceptions </development/errors>` embutidos que
podem indicar variados erros HTTP que sua aplicação possa precisar.

Por estarmos executando apenas lógica e redirecionando, essa action não
tem uma view. Vamos atualizar nossa view index com links para excluir artigos:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp (delete links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link('Adicionar artigo', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Criado</th>
            <th>Ações</th>
        </tr>

        <!-- Aqui é onde iremos iterar nosso objeto de solicitação $articles, exibindo informações de artigos -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Deletar',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Tem certeza?'])
                ?>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

Usar :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` vai criar um link
que usa JavaScript para criar uma requisição POST afim de deletar um artigo.

.. warning::

    Permitir que registros sejam deletados usando requisições GET é perigoso,
    pois rastreadores na web podem acidentalmente deletar todo o seu conteúdo.

.. note::

    Esse código da view também usa o ``FormHelper`` para confirmar a action
    através de JavaScript.

Rotas
=====

Para muitos o roteamento padrão do CakePHP funciona bem o suficiente.
Desenvolvedores que consideram facilidade de uso e SEO irão apreciar a forma
como o CakePHP mapeia determinadas URLs para actions específicas. Vamos realizar
uma pequena mudança nas rotas neste tutorial.

Para mais informações sobre técnicas avançadas de roteamento, visite
:ref:`routes-configuration`.

Por padrão, o CakePHP responde a uma requisição pela raíz do seu site usando o
``PagesController``, ao renderizar uma view chamada **home.ctp**.
Alternativamente, nós vamos substituir esse comportamento pelo
``ArticlesController`` ao criar uma regra de roteamento.

A configuração de rotas do CakePHP pode ser encontrada em **config/routes.php**.
Você deve comentar ou remover a linha que define o roteamento padrão:

.. code-block:: php

    $routes->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);

Essa linha conecta a URL '/' com a página padrão do CakePHP. Nós queremos que
ela conecte-se ao nosso próprio controller, então a substitua por esta:

.. code-block:: php

    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

Isso irá conectar requisições por '/' a action ``index()`` do nosso
``ArticlesController``

.. note::

    O CakePHP aproveita-se do uso de roteamento reverso. Se com a rota anterior
    definida você gerar um link com a seguinte estrutura de array:
    ``['controller' => 'Articles', 'action' => 'index']``, a URL resultante
    será '/'. Portanto, é uma boa ideia sempre usar arrays para URLs, pois assim
    suas rotas definem o endereço gerado e certificam-se que os links apontem
    sempre para o mesmo lugar.

Conclusão
=========

Simples, não é? Tenha em mente que esse foi um tutorial básico. O CakePHP tem
*muito* mais recursos a oferecer. Não abordamos outros tópicos aqui para manter
a simplicidade. Use o restante do manual como um guia para criar aplicações
mais ricas.

Agora que você criou uma aplicação básica no CakePHP, você pode continuar no
:doc:`/tutorials-and-examples/blog/part-three`, ou começar seu próprio projeto.
Você também pode folhear os :doc:`/topics` ou a
`API <https://api.cakephp.org/3.0>` para aprender mais sobre o CakePHP.

Se você precisar de ajuda, há muitas formas de conseguir, por favor, visite a
página :doc:`/intro/where-to-get-help` e bem-vindo(a) ao CakePHP!

Leitura complementar
--------------------

Existem tópicos comuns que as pessoas que estão estudando o CakePHP normalmente
visitam a seguir:

1. :ref:`view-layouts`: Customizando o layout da aplicação
2. :ref:`view-elements`: Inclusão e reutilização de elementos na view
3. :doc:`/bake/usage`: Gerando código CRUD
4. :doc:`/tutorials-and-examples/blog-auth-example/auth`: Tutorial de
    autorização e autenticação

.. meta::
    :title lang=pt: Tutorial - Criando um Blog - Parte 2
    :keywords lang=pt: actions,view,add,edit,delete,validation,model,post,request,validate,error
