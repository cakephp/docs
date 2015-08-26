Tutorial - Criando um Blog - Parte 2
####################################

Criando um Article Model
========================

Ao criar um model (modelo) no CakePHP, nós teremos a fundação necessária para
interagirmos com o banco de dados e executar operações posteriormente.

Os arquivos de classes, correspondentes aos models, no CakePHP estão divididos
entre os objetos ``Table`` e ``Entity``. Objetos ``Table`` provêm acesso à
coleção de entities (entidades) armazenada em uma tabela específica e são
alocados em **src/Model/Table**.

O arquivo que criaremos ficará salvo em **src/Model/Table/ArticlesTable.php** e
deve se parecer com isto::

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
objeto como ``ArticlesTable``, o CakePHP automaticamente infere que o mesmo
utilize o ``ArticlesController`` e seja atado à tabela ``articles``.

.. note::

    O CakePHP criará automaticamente um objeto model se não puder encontrar um
    arquivo correspondente em **src/Model/Table**. Se você nomear incorretamente
    seu arquivo (i.e. artciclestable.php ou ArticleTable.php), o CakePHP não
    reconhecerá suas definições e usará o model gerado como alternativa.

Para mais informações sobre models, como callbacks e validação, visite o
capítulo :doc:`/orm` do manual.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake console do CakePHP para criar o model
    ``ArticlesTable``::

        bin/cake bake model Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.

Criando o Articles Controller
=============================

A seguir, criaremos um controller (controlador) para nossos articles. O
controller é responsável pela lógica de interação com dados. É o lugar onde você
utilizará as regras contidas nos models e executará tarefas relacionadas aos
articles. Criaremos um arquivo chamado ``ArticlesController.php`` no diretório
**src/Controller**::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Agora, vamos adicionar uma action (ação) ao nosso controller. Actions
frequentemente, representam uma função ou interface em uma aplicação.
Por exemplo, quando os usuários requisitarem www.example.com/articles/index
(sendo o mesmo que www.example.com/articles/), eles esperam ver uma lista de
articles::

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

    Vocês podem ser tentados a nomear seus controllers e actions de certa forma
    para obter uma certa URL. Resista a essa tentação. Siga as
    :doc:`/intro/conventions` e crie nomes de action legíveis e compreensíveis.
    Você pode mapear URLs para o seu código utilizando
    :doc:`/development/routing`.

A instrução na action usa ``set()`` para passar dados do controller para a view.
A variável é definida como 'articles', sendo igual ao valor retornado do método
``find('all')`` do objeto ``ArticlesTable``.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake console do CakePHP para criar o controller
    ``ArticlesController``::

        bin/cake bake controller Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.

Criando as Article Views
========================

Agora que nós temos nossos dados fluindo pelo nosso model, e nossa lógica da
aplicação está definida pelo nosso controller, vamos criar uma view
(visualização) para a action index criada acima.

As views do CakePHP são camadas de apresentação que se encaixam nos layouts
da aplicação. Para a maioria das aplicações, elas são uma mescla entre HTML e
PHP, mas também podem ser distribuídas como XML, CSV, ou ainda dados binários.

Um layout é um conjunto de códigos encontrado ao redor das views. Múltiplos
layouts podem ser definidos, e você pode alterar entre eles, mas agora, vamos
usar o default.

Lembra que na última sessão atribuímos a variável 'articles' a view usando o
método ``set()``? Isso levará a coleção de objetos gerada pela query a ser
invocada uma iteração ``foreach``.

Arquivos de template do CakePHP são armazenados em **src/Template** dentro de
uma pasta com o nome do controller correspondente (nós teremos que criar a
pasta 'Articles' nesse caso). Para formatar os dados de artigo em uma tabela,
nossa view ficará assim:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

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
mas o que é importante notar é que o método ``link()`` irá gerar um link HTML
com o referido título (primeiro parâmetro) e URL (segundo parâmetro).

Quando se especifíca URLs no CakePHP, é recomendado o uso do formato de array.
Isto será melhor explicado posteriormente na seção Routes. Usando o formato de
array para URLs, você toma vantagem das capacidades de roteamento
reverso do CakePHP. Você também pode especificar URLs relativas a base da
aplicação com o formato ``/controller/action/param1/param2`` ou usar
:ref:`named routes <named-routes>`.

Nesse ponto, você pode visitar http://www.example.com/articles/index no seu
navegador. Você deve ver sua view corretamente formatada listando os articles.

Se você clicar no link do título de um article listado, provavelmente será
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

A chamada do ``set()`` deve parecer familiar. Repare que você está usando
``get()`` ao invés de ``find('all')`` porquê nós queremos a informação de apenas
um article.

Repare que nossa action recebe um parâmetro: o ID do article que gostariamos de
visualizar. Este parâmetro é entregue para a action através da URL solicitada.
Se o usuário requisitar ``/articles/view/3``, então o valor '3' é passado como
``$id`` para a action.

Fazemos também algumas verificações para garantir que o usuário realmente está
acessando um registro existente ao usar a função ``get()``, caso contrário, ou
se o ``$id`` é falso, a função irá lançar uma ``NotFoundException``.

Agora vamos criar a view para nossa action em
**src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Criado: <?= $article->created->format(DATE_RFC850) ?></small></p>

Verifique se está tudo funcionando acessando os links em ``/articles/index`` ou
manualmente requisite um article acessando ``articles/view/{id}``, substituindo
``{id}`` por uma 'id' de um article.

Adicionando Articles
====================

Primeiro, comece criando a action ``add()`` no ``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // Include the FlashComponent
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
                $article = $this->Articles->patchEntity($article, $this->request->data);
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

    Você precisa incluir o :doc:`/components/flash` component em qualquer
    controller em que vá usá-lo. Se necessário, inclua no ``AppController``.

A action ``add()`` checa se o método HTTP da solicitação era POST, tenta salvar
os dados utilizando o model Articles. Se por alguma razão ele não salvar, apenas
renderiza a view. Isto nos dá a chance de exibir erros de validação ou outros
alertas.

Cada requisição do CakePHP instancia um objeto ``Request`` que é acessível
usando ``$this->request``. O objeto contém informações úteis sobre a requisição
que foi recebida e pode ser usado para controlar o fluxo de sua aplicação. Nesse
caso, nós usamos o método :php:meth:`Cake\\Network\\Request::is()` para checar
se a requisição é do tipo HTTP POST.

Quando se usa um formulário para postar dados para a sua aplicação, essa
informação está disponível em ``$this->request->data``. Você pode usar as
funções :php:func:`pr()` ou :php:func:`debug()` para exibir esses dados caso
queira verificar.

Usamos os métodos ``success()`` e ``error()`` do ``FlashComponent`` para definir
uma mensagem numa variável de sessão. Esses métodos são gerados usando os
`recursos de métodos mágicos
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_ do PHP.
Mensagens flash serão exibidas na página após um redirecionamento. No layout nós
temos ``<?= $this->Flash->render() ?>``que exibe a mensagem e limpa a variável
de sessão. A função do controller
:php:meth:`Cake\\Controller\\Controller::redirect` redireciona para qualquer
outra URL. O parâmetro ``['action' => 'index']`` correspondo a URL /articles,
isto é, a action index do ``ArticlesController``. Você pode consultar a função
:php:func:`Cake\\Routing\\Router::url()` na `API <http://api.cakephp.org>`_ para
checar os formatos nos quais você pode montar uma URL.

Chamar o método ``save()`` vai checar erros de validação e abortar o processo
caso os encontre. Nós vamos abordar como esses erros são tratados nas sessões
a seguir.

Validação de dados
==================

O CakePHP torna mais prática e menos monótona a validação de dados de
formulário.

Para tirar proveito dos recursos de validação, você vai precisar usar o
:doc:`/helpers/form` helper em suas views. O
:php:class:`Cake\\View\\Helper\\FormHelper` está disponível por padrão em todas
as views pelo ``$this->Form``.

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
Segue o HTML gerado por ``$this->Form->create()``::

.. code-block:: html

    <form method="post" action="/articles/add">

Se ``create()`` é chamado sem parâmetros fornecidos, assume-se a construção de
um formulário que submete dados via POST para a action ``add()`` (ou ``edit()``
no caso de um ``id`` estar incluído nos dados do formulário).

O método ``$this->Form->input()`` é usado para criar elementos do formulário do
mesmo nome. O primeiro parâmetro diz ao CakePHP qual é o campo correspondente, e
o segundo parâmetro permite que você especifique um vasto array de opções -
nesse, o número de linhas para o textarea. ``input()`` vai gerar diferentes
elementos de formulários baseados no tipo de campo do model especificado.

O ``$this->Form->end()`` fecha o formulário, entregando elementos ocultos se
a prevenção contra CSRF/Form Tampering estiver habilitada.

Agora vamos voltar e atualizar nossa view **src/Template/Articles/index.ctp**
para incluir um novo link chamado "Adicionar artigo". Antes do ``<table>``,
adicione a seguinte linha::

    <?= $this->Html->link('Adicionar artigo', ['action' => 'add']) ?>

Você deve estar se perguntando: como eu digo ao CakePHP minhas necessidades de
validação? Regras de validação são definidas no model. Vamos fazer alguns
ajustes no nosso Articles model::

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
campo body quanto title não devem ser vazios. O CakePHP possui muitos recursos
de validação e um bom número de regras pré-determinadas (número de cartões,
endereços de email, etc) e flexibilidade para adicionar suas próprias regras de
validação. Para mais informações sobre essa configuração, visite a documentação
de :doc:`/core-libraries/validation`.

Agora que suas regras de validação estão definidas, use a aplicação e tente
adicionar um artigo sem definir o campo title e body para ver como funciona.
Desde que tenhamos usado o método
:php:meth:`Cake\\View\\Helper\\FormHelper::input()` do ``FormHelper`` para criar
nossos elementos, nossas mensagens de erro de validação serão exibidas
automaticamente.






















