CMS Tutorial - Tags e Users
#############################

Com a funcionalidade básica de criação de artigos construída, precisamos permitir que múltiplos 
autores trabalhem em nosso CMS. Anteriormente, construíamos todos os models, views e 
controllers manualmente. Desta vez, usaremos o Bake para criar nosso esqueleto de código. 
O Bake é uma poderosa ferramenta de geração de código CLI (Interface de Linha de Comando) 
que utiliza as convenções que o CakePHP usa para criar esqueletos de aplicações CRUD (Criar, Ler, Atualizar,
Excluir) de forma muito eficiente. Usaremos o Bake para construir o código dos nossos usuários:

.. code-block:: console

    cd /path/to/our/app

    # Você pode substituir qualquer arquivo existente.
    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

Estes 3 comandos gerarão:

* Os arquivos de Tabela, Entidade e Fixture.
* O Controller
* Os templates CRUD.
* Casos de teste para cada classe gerada.

O Bake também usará as convenções do CakePHP para inferir as associações e
a validação que seus modelos possuem.

Adicionando Tags aos Artigos
============================

Com vários usuários acessando nosso pequeno :abbr:`CMS`, seria ótimo
ter uma maneira de categorizar nosso conteúdo. Usaremos tags e marcação para permitir que os usuários
criem categorias e rótulos livres para seu conteúdo. Novamente, usaremos
``bake`` para gerar rapidamente um esqueleto de código para nossa aplicação:

.. code-block:: console

    # Gere todo o código de uma só vez.
    bin/cake bake all tags

Após criar o código do scaffold, crie algumas tags de exemplo acessando
**http://localhost:8765/tags/add**.

Agora que temos uma tabela de Tags, podemos criar uma associação entre Artigos e
Tags. Podemos fazer isso adicionando o seguinte ao método ``initialize`` na
``ArticlesTable``::

    public function initialize(array $config): void
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // Adicione esta linha
    }

Esta associação funcionará com esta definição simples porque seguimos as convenções 
do CakePHP ao criar nossas tabelas. Para mais informações, leia
:doc:`/orm/associations`.

Atualizando Artigos para Habilitar o Tagueamento
================================================

Agora que nosso aplicativo possui tags, precisamos permitir que os usuários marquem seus
artigos. Primeiro, atualize a ação ``add`` para que fique assim::

    <?php
    // in src/Controller/ArticlesController.php
    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
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
            // Obtenha uma lista de tags.
            $tags = $this->Articles->Tags->find('list')->all();

            // Definir tags para o contexto de visualização
            $this->set('tags', $tags);

            $this->set('article', $article);
        }

        // Outras ações
    }

As linhas adicionadas carregam uma lista de tags como um array associativo de ``id => title``.
Este formato nos permitirá criar uma nova entrada de tag em nosso modelo.
Adicione o seguinte ao bloco de controles PHP em **templates/Articles/add.php**::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

Isso renderizará um elemento de seleção múltipla que usa a variável ``$tags`` para
gerar as opções da caixa de seleção. Agora você deve criar alguns novos artigos
com tags, pois na seção a seguir adicionaremos a capacidade de encontrar
artigos por tags.

Você também deve atualizar o método ``edit`` para permitir a adição ou edição de tags. O método
edit agora deve se parecer com::

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi atualizado.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Não é possível atualizar seu artigo.'));
        }

        // Obtenha uma lista de tags.
        $tags = $this->Articles->Tags->find('list')->all();

        // Definir tags para o contexto de visualização
        $this->set('tags', $tags);

        $this->set('article', $article);
    }

Lembre-se de adicionar o novo controle de seleção múltipla de tags que adicionamos ao template **add.php**
também ao template **templates/Articles/edit.php**.

Encontrar Artigos por Tags
==========================

Depois que os usuários categorizarem seu conteúdo, eles desejarão encontrá-lo
pelas tags que usaram. Para este recurso, implementaremos uma rota, uma ação
do controller e um método finder para pesquisar artigos por tag.

O ideal seria ter uma URL semelhante a
**http://localhost:8765/articles/tagged/funny/cat/gifs**. Isso nos permitiria
encontrar todos os artigos que possuem as tags 'engraçado', 'gato' ou 'gifs'. Antes de
implementarmos isso, adicionaremos uma nova rota. Seu **config/routes.php** (com
os comentários removidos) deve se parecer com::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\RouteBuilder;

    $routes->setRouteClass(DashedRoute::class);

    $routes->scope('/', function (RouteBuilder $builder) {
        $builder->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);
        $builder->connect('/pages/*', ['controller' => 'Pages', 'action' => 'display']);

        // Adicione isto
        // Nova rota que estamos adicionando para nossa ação marcada.
        // O `*` final informa ao CakePHP que esta ação tem
        // parâmetros passados.
        $builder->scope('/articles', function (RouteBuilder $builder) {
            $builder->connect('/tagged/*', ['controller' => 'Articles', 'action' => 'tags']);
        });

        $builder->fallbacks();
    });

O exemplo acima define uma nova 'rota' que conecta o caminho **/articles/tagged/**
a ``ArticlesController::tags()``. Ao definir rotas, você pode isolar a aparência das suas
URLs de como elas são implementadas. Se visitássemos
**http://localhost:8765/articles/tagged**, veríamos uma página de erro útil
do CakePHP informando que a ação do controlador não existe. Vamos
implementar esse método ausente agora. Em **src/Controller/ArticlesController.php**
adicione o seguinte::

    public function tags()
    {
        // A chave 'pass' é fornecida pelo CakePHP e contém todos os
        // segmentos de caminho de URL passados ​​na solicitação.
        $tags = $this->request->getParam('pass');

        // Use a ArticlesTable para encontrar artigos marcados.
        $articles = $this->Articles->find('tagged', tags: $tags)
            ->all();

        // Passe variáveis ​​para o contexto do template de visualização.
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

Para acessar outras partes dos dados da solicitação, consulte a seção :ref:`cake-request`.

Como os argumentos passados ​​são passados ​​como parâmetros do método, você também pode escrever a
ação usando o argumento variável do PHP::

    public function tags(...$tags)
    {
        // Use a ArticlesTable para encontrar artigos marcados.
        $articles = $this->Articles->find('tagged', tags: $tags)
            ->all();

        // Passe variáveis ​​para o contexto do template de visualização.
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

Criando o Método Finder
-----------------------

No CakePHP, gostamos de manter as ações do nosso controller enxutas e colocar a maior parte da lógica da nossa
aplicação na camada de modelo. Se você acessasse a URL
**/articles/tagged** agora, veria um erro informando que o método ``findTagged()``
ainda não foi implementado, então vamos fazer isso. Em
**src/Model/Table/ArticlesTable.php** adicione o seguinte::

    // adicione esta instrução use logo abaixo da declaração de namespace para importar
    // a classe Query
    use Cake\ORM\Query\SelectQuery;

    // O argumento $query é uma instância do construtor de consultas.
    // O array $options conterá a opção 'tags' que passamos
    // para find('tagged') em nossa ação do controlador.
    public function findTagged(SelectQuery $query, array $tags = []): SelectQuery
    {
        $columns = [
            'Articles.id', 'Articles.user_id', 'Articles.title',
            'Articles.body', 'Articles.published', 'Articles.created',
            'Articles.slug',
        ];

        $query = $query
            ->select($columns)
            ->distinct($columns);

        if (empty($tags)) {
            // Se não houver tags fornecidas, localize artigos que não tenham tags.
            $query->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            // Encontre artigos que tenham uma ou mais das tags fornecidas.
            $query->innerJoinWith('Tags')
                ->where(['Tags.title IN' => $tags]);
        }

        return $query->groupBy(['Articles.id']);
    }

Acabamos de implementar um :ref:`método localizador personalizado <custom-find-methods>`. Este é
um conceito muito poderoso no CakePHP que permite empacotar consultas
reutilizáveis. Os métodos localizadores sempre recebem um objeto :doc:`/orm/query-builder` e um
array de opções como parâmetros. Os localizadores podem manipular a consulta e adicionar quaisquer
condições ou critérios necessários. Quando concluídos, os métodos localizadores devem retornar
um objeto de consulta modificado. Em nosso localizador, utilizamos os métodos ``distinct()`` e
``leftJoin()``, que nos permitem encontrar artigos distintos que tenham
uma tag 'matching'.

Criando a Visualização
----------------------

Agora, se você visitar a URL **/articles/tagged** novamente, o CakePHP mostrará um novo erro
informando que você não criou um arquivo de visualização. Em seguida, vamos construir o
arquivo de visualização para nossa ação ``tags()``::

    <!-- In templates/Articles/tags.php -->
    <h1>
        Articles tagged with
        <?= $this->Text->toList(h($tags), 'or') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Use o HtmlHelper para criar um link -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?></span>
        </article>
    <?php endforeach; ?>
    </section>

No código acima, usamos os auxiliares :doc:`/views/helpers/html` e
:doc:`/views/helpers/text` para auxiliar na geração da saída da nossa view.
Também usamos a função de atalho :php:func:`h` para codificar a saída em HTML. Você deve
lembrar-se de sempre usar ``h()`` ao gerar dados para evitar problemas de injeção de HTML.

O arquivo **tags.php** que acabamos de criar segue as convenções do CakePHP para arquivos de template de view.
A convenção é que o template use a versão em letras minúsculas e
sublinhada do nome da ação do controller.

Você pode notar que conseguimos usar as variáveis ​​``$tags`` e ``$articles``
em nosso template de view. Quando usamos o método ``set()`` em nosso
controller, definimos variáveis ​​específicas a serem enviadas para a view. A View tornará
todas as variáveis ​​passadas disponíveis no escopo do template como variáveis ​​locais.

Agora você poderá visitar a URL **/articles/tagged/funny** e ver todos
os artigos marcados com 'funny'.

Melhorando a Experiência de Tagueamento
=======================================

No momento, adicionar novas tags é um processo trabalhoso, pois os autores precisam
pré-criar todas as tags que desejam usar. Podemos melhorar a interface de seleção de tags
usando um campo de texto separado por vírgula. Isso nos permitirá oferecer uma experiência melhor aos
nossos usuários e usar mais alguns recursos excelentes do ORM.

Adicionando um Campo Computado
------------------------------

Como queremos uma maneira simples de acessar as tags formatadas de uma entidade,
podemos adicionar um campo virtual/computado à entidade. Em
**src/Model/Entity/Article.php**, adicione o seguinte::

    // adicione esta instrução use logo abaixo da declaração de namespace para importar
    // a classe Collection
    use Cake\Collection\Collection;

    // Atualiza a propriedade acessível para conter `tag_string`
    protected array $_accessible = [
        //outros campos...
        'tag_string' => true
    ];

    protected function _getTagString()
    {
        if (isset($this->_fields['tag_string'])) {
            return $this->_fields['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');

        return trim($str, ', ');
    }

Isso nos permitirá acessar a propriedade computada ``$article->tag_string``. 
Usaremos essa propriedade em controles posteriormente.

Atualizando as Views
--------------------

Com a entidade atualizada, podemos adicionar um novo controle para nossas tags. Em
**templates/Articles/add.php** e **templates/Articles/edit.php**,
substitua o controle ``tags._ids`` existente pelo seguinte::

    echo $this->Form->control('tag_string', ['type' => 'text']);

Também precisaremos atualizar o template de visualização do artigo. Em
**templates/Articles/view.php**, adicione a linha conforme mostrado::

    <!-- File: templates/Articles/view.php -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    // Adicione a seguinte linha
    <p><b>Tags:</b> <?= h($article->tag_string) ?></p>

Você também deve atualizar o método de visualização para permitir a recuperação de tags existentes::

    // src/Controller/ArticlesController.php file

    public function view($slug = null)
    {
       // Atualizar a recuperação de tags com contain()
       $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
        $this->set(compact('article'));
    }

Persistindo a Sequência de Tags
-------------------------------

Agora que podemos visualizar as tags existentes como uma string, também queremos salvar esses dados. 
Como marcamos a ``tag_string`` como acessível, o ORM copiará esses dados da solicitação para a nossa 
entidade. Podemos usar um método de gancho ``beforeSave()``
para analisar a string da tag e encontrar/construir as entidades relacionadas. Adicione o seguinte
a **src/Model/Table/ArticlesTable.php**::

    public function beforeSave(EventInterface $event, $entity, $options): void
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }

        // Outro código
    }

    protected function _buildTags($tagString)
    {
        // Trim tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Removendo todas as tags vazias
        $newTags = array_filter($newTags);
        // Removendo tags duplicadas
        $newTags = array_unique($newTags);

        $out = [];
        $tags = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags])
            ->all();

        // Remova as tags existentes da lista de novas tags.
        foreach ($tags->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Adicionando tags existentes.
        foreach ($tags as $tag) {
            $out[] = $tag;
        }
        // Adicionando novas tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }

        return $out;
    }

Se você agora cria ou edita artigos, poderá salvar tags como uma lista de tags
separadas por vírgulas e ter as tags e os registros de vinculação
criados automaticamente.

Embora este código seja um pouco mais complexo do que o que fizemos até agora, ele ajuda
a demonstrar o quão poderoso é o ORM no CakePHP. Você pode manipular resultados de consulta
usando os métodos :doc:`/core-libraries/collections` e lidar
com cenários em que você cria entidades dinamicamente com facilidade.

Preenchimento Automático da Sequência de Tags
=============================================

Antes de terminarmos, precisaremos de um mecanismo que carregue as tags associadas
(se houver) sempre que carregarmos um artigo.

Em seu **src/Model/Table/ArticlesTable.php**, altere::

    public function initialize(array $config): void
    {
        $this->addBehavior('Timestamp');
        // Altere essa linha
        $this->belongsToMany('Tags', [
            'joinTable' => 'articles_tags',
            'dependent' => true
        ]);
    }

Isso informará ao modelo de tabela "Articles" que há uma tabela de junção associada
com tags. A opção "dependent" informa à tabela para excluir quaisquer registros
associados da tabela de junção se um artigo for excluído.

Por fim, atualize as chamadas do método findBySlug() em
**src/Controller/ArticlesController.php**::

    public function edit($slug)
    {
        // Atualize está linha
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
    ...
    }

    public function view($slug = null)
    {
        // Atualize está linha
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags')
            ->firstOrFail();
        $this->set(compact('article'));
    }

O método ``contain()`` informa ao objeto ``ArticlesTable`` para também preencher a
associação Tags quando o artigo for carregado. Agora, quando tag_string for chamada para
uma entidade Article, haverá dados presentes para criar a string!

Em seguida, adicionaremos :doc:`authentication </tutorials-and-examples/cms/authentication>`.
