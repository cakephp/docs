CMS Tutorial - Criando o Controller Articles
############################################

Com nosso modelo criado, precisamos de um controller para nossos artigos. 
Os controllers no CakePHP lidam com requisições HTTP e executam a lógica 
de negócios contida nos métodos do modelo para preparar a resposta. 
Colocaremos esse novo controlador em um arquivo chamado **ArticlesController.php** 
dentro do diretório **src/Controller**.
Veja como o controller básico deve se parecer::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Agora, vamos adicionar uma ação ao nosso controller. Ações são métodos do controller que
possuem rotas conectadas a eles. Por exemplo, quando um usuário solicita
**www.example.com/articles/index** (que também é o mesmo que
**www.example.com/articles**), o CakePHP chamará o método ``index`` do seu
``ArticlesController``. Este método deve consultar a camada do modelo e preparar
uma resposta renderizando um Template na View. O código para essa ação ficaria
assim::

    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate($this->Articles);
            $this->set(compact('articles'));
        }
    }

Ao definir a função ``index()`` em nosso ``ArticlesController``, os usuários agora podem
acessar a lógica solicitando **www.example.com/articles/index**.
Da mesma forma, se definíssemos uma função chamada ``foobar()``, os usuários poderiam
acessá-la em **www.example.com/articles/foobar**. Você pode se sentir tentado
a nomear seus controllers e ações de uma forma que permita obter URLs
específicas. Resista a essa tentação. Em vez disso, siga o :doc:`/intro/conventions`
para criar nomes de ações legíveis e significativos. Você pode então usar
:doc:`/development/routing` para conectar as URLs desejadas às ações que você
criou.

Nossa ação do controller é muito simples. Ela busca um conjunto paginado de artigos
do banco de dados, usando o Modelo de Artigos que é carregado automaticamente por meio de convenções
de nomenclatura. Em seguida, ela usa ``set()`` para passar os artigos para o Modelo (que
criaremos em breve). O CakePHP renderizará o modelo automaticamente após a conclusão da nossa
ação do controlador.

Crie o Template de Lista de Artigos
===================================

Agora que nosso controller extrai dados do modelo e prepara nosso
contexto de visualização, vamos criar um modelo de visualização para nossa ação de índice.

Os templates de visualização do CakePHP são códigos PHP com características de apresentação que são inseridos
dentro do layout do aplicativo. Embora criemos HTML aqui, as visualizações também podem
gerar arquivos JSON, CSV ou até mesmo binários, como PDFs.

Um layout é um código de apresentação que envolve uma visualização. Arquivos de layout
contêm elementos comuns do site, como cabeçalhos, rodapés e elementos de navegação. Seu
aplicativo pode ter vários layouts, e você pode alternar entre eles, mas,
por enquanto, vamos usar apenas o layout padrão.

Os arquivos de template do CakePHP são armazenados em **templates** dentro de uma pasta
correspondente ao controller. Portanto, teremos que criar
uma pasta chamada 'Articles' neste caso. Adicione o seguinte código à sua
aplicação:

.. code-block:: php

    <!-- File: templates/Articles/index.php -->

    <h1>Articles</h1>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- É aqui que iteramos em nosso objeto de consulta $articles, imprimindo informações do artigo -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

Na última seção, atribuímos a variável 'articles' à visualização usando
``set()``. As variáveis ​​passadas para a visualização estão disponíveis nos modelos de visualização como
variáveis ​​locais que usamos no código acima.

Você deve ter notado o uso de um objeto chamado ``$this->Html``. Esta é uma
instância do CakePHP :doc:`HtmlHelper </views/helpers/html>`. O CakePHP vem
com um conjunto de assistentes de visualização que realizam tarefas como criar links, formulários e
botões de paginação. Você pode aprender mais sobre :doc:`/views/helpers` no
capítulo deles, mas o importante a ser observado aqui é que o método ``link()`` irá
gerar um link HTML com o texto do link fornecido (o primeiro parâmetro) e a URL
(o segundo parâmetro).

Ao especificar URLs no CakePHP, é recomendável usar arrays ou
:ref:`rotas nomeadas <named-routes>`. Essas sintaxes permitem que você
aproveite os recursos de roteamento reverso oferecidos pelo CakePHP.

Neste ponto, você deve conseguir acessar seu navegador em
**http://localhost:8765/articles/index**. Você deverá ver sua visualização de lista,
formatada corretamente com o título e a lista de artigos na tabela.

Criando a Ação de Visualização
==============================

Se você clicar em um dos links "visualizar" na nossa página de lista de artigos,
verá uma página de erro informando que a ação não foi implementada. Vamos corrigir isso agora::

    // Adicione ao arquivo existente src/Controller/ArticlesController.php

    public function view($slug = null)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

Embora esta seja uma ação simples, utilizamos alguns recursos poderosos do CakePHP.
Iniciamos nossa ação usando ``findBySlug()``, que é
um :ref:`Dynamic Finder <dynamic-finders>`. Este método nos permite criar uma consulta básica que
encontra artigos de um determinado slug. Em seguida, usamos ``firstOrFail()`` para buscar
o primeiro registro ou lançar uma ``\Cake\Datasource\Exception\RecordNotFoundException``.

Nossa ação recebe um parâmetro ``$slug``, mas de onde vem esse parâmetro?
Se um usuário solicitar ``/articles/view/first-post``, o valor 'first-post' será
passado como ``$slug`` pelas camadas de roteamento e despacho do CakePHP. Se
recarregarmos nosso navegador com nossa nova ação salva, veremos outra página de erro do CakePHP
nos informando que falta um modelo de visualização; vamos corrigir isso.

Criando o Template View 
=======================

Vamos criar a visualização para nossa nova ação 'view' e colocá-la em
**templates/Articles/view.php**

.. code-block:: php

    <!-- File: templates/Articles/view.php -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>
    <p><?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?></p>

Você pode verificar se isso está funcionando tentando os links em ``/articles/index`` ou
solicitando manualmente um artigo acessando URLs como
``/articles/view/first-post``.

Adicionando Artigos
===================

Com as views de leitura básicas criadas, precisamos possibilitar a criação de novos artigos.
Comece criando uma ação ``add()`` no
``ArticlesController``. Nosso controller agora deve se parecer com::

    <?php
    // src/Controller/ArticlesController.php
    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate($this->Articles);
            $this->set(compact('articles'));
        }

        public function view($slug)
        {
            $article = $this->Articles->findBySlug($slug)->firstOrFail();
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEmptyEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

                // A codificação do user_id é temporária e será removida posteriormente
                // quando construirmos a autenticação.
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Seu artigo foi salvo.'));

                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Não é possível adicionar seu artigo.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    Você precisa incluir o componente :doc:`/controllers/components/flash` em
    qualquer controlador onde for usá-lo. Muitas vezes, faz sentido incluí-lo em
    seu ``AppController``, que já está lá para este tutorial.

Veja o que a ação ``add()`` faz:

* Se o método HTTP da solicitação for POST, tente salvar os dados usando o modelo Articles.
* Se, por algum motivo, não for possível salvar, basta renderizar a visualização. Isso nos dá a chance de mostrar ao usuário erros de validação ou outros avisos.

Cada requisição do CakePHP inclui um objeto de requisição que pode ser acessado usando
``$this->request``. O objeto de requisição contém informações sobre a
requisição que acabou de ser recebida. Usamos o método
:php:meth:`Cake\\Http\\ServerRequest::is()` para verificar se a requisição
é uma requisição HTTP POST.

Nossos dados POST estão disponíveis em ``$this->request->getData()``. Você pode usar as funções
:php:func:`pr()` ou :php:func:`debug()` para imprimi-los, se quiser
ver como ficam. Para salvar nossos dados, primeiro 'marshal' os dados POST em
uma Entidade de Artigo. A Entidade é então persistida usando a Tabela de Artigos que
criamos anteriormente.

Após salvar nosso novo artigo, usamos o método ``success()`` do FlashComponent para definir
uma mensagem na sessão. O método ``success`` é fornecido usando os
`recursos do método mágico do PHP
<https://php.net/manual/en/language.oop5.overloading.php#object.call>`_. As mensagens em Flash 
serão exibidas na próxima página após o redirecionamento. Em nosso layout, temos
``<?= $this->Flash->render() ?>``, que exibe mensagens em Flash e limpa a
variável de sessão correspondente. Finalmente, após a conclusão do salvamento, usamos
:php:meth:`Cake\\Controller\\Controller::redirect` para enviar o usuário de volta à
lista de artigos. O parâmetro ``['action' => 'index']`` traduz para a URL
``/articles``, ou seja, a ação de índice do ``ArticlesController``. Você pode consultar
a função :php:func:`Cake\\Routing\\Router::url()` na `API
<https://api.cakephp.org>`_ para ver os formatos nos quais você pode especificar uma URL
para várias funções do CakePHP.

Criando o Template Add
======================

Aqui está nosso template de visualização para 'add':

.. code-block:: php

    <!-- File: templates/Articles/add.php -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        // Codifique o usuário por enquanto.
        echo $this->Form->control('user_id', ['type' => 'hidden', 'value' => 1]);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Salvar Artigo'));
        echo $this->Form->end();
    ?>

Usamos o FormHelper para gerar a tag de abertura para um formulário HTML.
Aqui está o HTML que ``$this->Form->create()`` gera:

.. code-block:: html

    <form method="post" action="/articles/add">

Como chamamos ``create()`` sem uma opção de URL, ``FormHelper`` assume que
queremos que o formulário seja enviado de volta para a ação atual.

O método ``$this->Form->control()`` é usado para criar elementos de formulário
com o mesmo nome. O primeiro parâmetro informa ao CakePHP a qual campo
eles correspondem, e o segundo parâmetro permite especificar
uma ampla gama de opções - neste caso, o número de linhas para a
textarea. Há um pouco de introspecção e convenções usadas aqui. O método ``control()`` 
gerará diferentes elementos de formulário com base no campo
do modelo especificado e usará a inflexão para gerar o texto do rótulo(label). Você pode
personalizar o rótulo(label), a entrada ou qualquer outro aspecto dos controles do formulário usando
opções. A chamada ``$this->Form->end()`` fecha o formulário.

Agora, vamos voltar e atualizar nossa view **templates/Articles/index.php**
para incluir um novo link "Adicionar Artigo". Antes de ``<table>``, adicione
a seguinte linha::

    <?= $this->Html->link('Adicionar Artigo', ['action' => 'add']) ?>

Adicionando Geração Simples de Slug
===================================

Se salvássemos um artigo agora, o salvamento falharia, pois não estamos
criando um atributo slug e a coluna é ``NOT NULL``. Valores slug são
tipicamente uma versão segura para URL do título de um artigo. Podemos usar o retorno de chamada
:ref:`beforeSave() <table-callbacks>` do ORM para preencher nosso slug::

    <?php
    // in src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    // the Text class
    use Cake\Utility\Text;
    // the EventInterface class
    use Cake\Event\EventInterface;

    // Adicione o seguinte método.

    public function beforeSave(EventInterface $event, $entity, $options): void
    {
        if ($entity->isNew() && !$entity->slug) {
            $sluggedTitle = Text::slug($entity->title);
            // aparar o slug até o comprimento máximo definido no esquema
            $entity->slug = substr($sluggedTitle, 0, 191);
        }
    }

Este código é simples e não leva em conta slugs duplicados. Mas vamos
consertar isso mais tarde.

Adicionar Ação de Edição
========================

Nossa aplicação agora pode salvar artigos, mas não podemos editá-los. Vamos corrigir isso
agora. Adicione a seguinte ação ao seu ``ArticlesController``::

    // in src/Controller/ArticlesController.php

    // Adicione o seguinte método.

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi atualizado.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Não é possível atualizar seu artigo.'));
        }

        $this->set('article', $article);
    }

Esta ação primeiro garante que o usuário tentou acessar um registro existente.
Se o parâmetro ``$slug`` não tiver sido passado ou o artigo não existir,
uma ``RecordNotFoundException`` será lançada e o ErrorHandler do CakePHP renderizará
a página de erro apropriada.

Em seguida, a ação verifica se a solicitação é uma solicitação POST ou PUT. Se for, 
usamos os dados POST/PUT para atualizar nossa entidade de artigo usando o método
``patchEntity()``. Por fim, chamamos ``save()``, definimos a mensagem flash apropriada
e redirecionamos ou exibimos os erros de validação.

Criando o Template Edit
=======================

O template de edição deve ficar assim:

.. code-block:: php

    <!-- File: templates/Articles/edit.php -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('user_id', ['type' => 'hidden']);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Salvar Artigo'));
        echo $this->Form->end();
    ?>

Este modelo exibe o formulário de edição (com os valores preenchidos), juntamente
com quaisquer mensagens de erro de validação necessárias.

Agora você pode atualizar sua visualização de índice com links para editar artigos
específicos:

.. code-block:: php

    <!-- File: templates/Articles/index.php  (edit links added) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- É aqui que iteramos em nosso objeto de consulta $articles, imprimindo informações do artigo -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Atualizar Regras de Validação para Artigos
==========================================

Até este ponto, nossos artigos não tiveram nenhuma validação de entrada realizada. Vamos corrigir isso
usando :ref:`um validador <validating-request-data>`::

    // src/Model/Table/ArticlesTable.php

    // adicione esta instrução use logo abaixo da declaração do namespace para importar
    // a classe Validator
    use Cake\Validation\Validator;

    // Adicione o seguinte método.
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->notEmptyString('title')
            ->minLength('title', 10)
            ->maxLength('title', 255)

            ->notEmptyString('body')
            ->minLength('body', 10);

        return $validator;
    }

O método ``validationDefault()`` informa ao CakePHP como validar seus dados quando
o método ``save()`` é chamado. Aqui, especificamos que os campos ``title`` e ``body`` 
não devem estar vazios e têm certas restrições de comprimento.

O mecanismo de validação do CakePHP é poderoso e flexível. Ele oferece um conjunto de
regras frequentemente usadas para tarefas como endereços de e-mail, endereços IP, etc., além da
flexibilidade para adicionar suas próprias regras de validação. Para mais informações sobre essa
configuração, consulte a documentação :doc:`/core-libraries/validation`.

Agora que suas regras de validação estão definidas, use o aplicativo para tentar adicionar
um artigo com título ou corpo vazio para ver como funciona. Como usamos o método
:php:meth:`Cake\\View\\Helper\\FormHelper::control()` do FormHelper para
criar nossos elementos de formulário, nossas mensagens de erro de validação serão exibidas
automaticamente.

Adicionar Ação de Delete
=========================

Em seguida, vamos criar uma maneira para os usuários excluírem artigos. Comece com uma ação
``delete()`` no ``ArticlesController``::

    // src/Controller/ArticlesController.php

    // Adicione o seguinte método.

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('O artigo {0} foi excluído.', $article->title));

            return $this->redirect(['action' => 'index']);
        }
    }

Esta lógica exclui o artigo especificado por ``$slug`` e usa
``$this->Flash->success()`` para mostrar ao usuário uma mensagem de confirmação
após redirecioná-lo para ``/articles``. Se o usuário tentar
excluir um artigo usando uma requisição GET, ``allowMethod()`` lançará uma exceção.
Exceções não capturadas são capturadas pelo manipulador de exceções do CakePHP e uma bela
página de erro é exibida. Há muitas
:doc:`Exceções </development/errors>` integradas que podem ser usadas para indicar os vários
erros HTTP que seu aplicativo pode precisar gerar.

.. warning::

    Permitir que conteúdo seja excluído usando solicitações GET é *muito* perigoso, pois rastreadores
    da web podem excluir acidentalmente todo o seu conteúdo. É por isso que usamos
    ``allowMethod()`` em nosso controlador.

Como estamos apenas executando a lógica e redirecionando para outra ação, esta
ação não tem modelo. Você pode querer atualizar seu modelo de índice com links
que permitam aos usuários excluir artigos:

.. code-block:: php

    <!-- File: templates/Articles/index.php  (delete links added) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Adicionar Artigo", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- É aqui que iteramos em nosso objeto de consulta $articles, imprimindo informações do artigo -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
                <?= $this->Form->deleteLink(
                    'Deletar',
                    ['action' => 'delete', $article->slug],
                    ['confirm' => 'Are you sure?'])
                ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

Usar :php:meth:`~Cake\\View\\Helper\\FormHelper::deleteLink()` criará um link
que usa JavaScript para fazer uma solicitação DELETE, excluindo nosso artigo.
Anterior ao CakePHP 5.2, você precisa usar ``postLink()``.

.. note::

    Este código de visualização também usa o ``FormHelper`` para exibir ao usuário uma
    caixa de diálogo de confirmação em JavaScript antes que ele tente excluir um
    artigo.

.. tip::

    O ``ArticlesController`` também pode ser construído com ``bake``:

    .. code-block:: console

        /bin/cake bake controller articles

    Entretanto, isso não cria os arquivos **templates/Articles/*.php**.

Com uma configuração básica de gerenciamento de artigos, criaremos as :doc:`ações básicas
para nossas tabelas de Tags e Usuários </tutorials-and-examples/cms/tags-and-users>`.
