Paginação
##########

Um dos principais obstáculos na criação de aplicações web flexíveis e amigáveis
é o design de uma interface de usuário intuitiva. Muitas aplicações tendem a
crescer rapidamente em tamanho e complexidade, e designers e programadores acabam
descobrindo que não conseguem lidar com a exibição de centenas ou milhares de registros.
A refatoração leva tempo, e o desempenho e a satisfação do usuário podem sofrer.

Exibir um número razoável de registros por página sempre foi uma parte crítica
de todas as aplicações e costumava causar muitas dores de cabeça para os desenvolvedores.
O CakePHP alivia o fardo do desenvolvedor fornecendo uma maneira concisa de
paginar dados.

A paginação nos controllers do CakePHP é feita através do método ``paginate()``. Você
então usa :php:class:`~Cake\\View\\Helper\\PaginatorHelper` nos seus view templates
para gerar controles de paginação.

Uso Básico
===========

Você pode chamar ``paginate()`` usando uma instância de tabela ORM ou objeto ``Query``::

    public function index()
    {
        // Paginar a tabela ORM.
        $this->set('articles', $this->paginate($this->Articles));

        // Paginar uma query select
        $query = $this->Articles->find('published')->contain('Comments');
        $this->set('articles', $this->paginate($query));
    }

Uso Avançado
==============

Casos de uso mais complexos são suportados através da configuração da propriedade
``$paginate`` do controller ou como argumento ``$settings`` para ``paginate()``. Essas
condições servem como base para suas queries de paginação. Elas são aumentadas
pelos parâmetros ``sort``, ``direction``, ``limit`` e ``page`` passados
da URL::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc',
            ],
        ];
    }

.. tip::
    As opções padrão de ``order`` devem ser definidas como um array.

Você também pode usar :ref:`custom-find-methods` na paginação usando a opção ``finder``::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'finder' => 'published',
        ];
    }

Nota: Isso funciona apenas com Table como entrada de string em ``$this->paginate('MyTable')``. Depois de usar ``$this->MyTable->find()`` como entrada para ``paginate()``, você deve usar diretamente esse objeto Query.

Se o seu método finder requer opções adicionais, você pode passá-las
como valores para o finder::

    class ArticlesController extends AppController
    {
        // encontrar artigos por tag
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];
            // Estamos usando o argumento $settings para paginate() aqui.
            // Mas a mesma estrutura poderia ser usada em $this->paginate
            //
            // Nosso finder customizado é chamado findTagged dentro de ArticlesTable.php
            // que é por isso que estamos usando `tagged` como chave.
            // Nosso finder deve ser assim:
            // public function findTagged(Query $query, array $tagged = [])
            $settings = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles, $settings);
            $this->set(compact('articles', 'tags'));
        }
    }

Além de definir valores gerais de paginação, você pode definir mais de um
conjunto de padrões de paginação no controller. O nome de cada model pode ser usado
como uma chave na propriedade ``$paginate``::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Os valores das chaves ``Articles`` e ``Authors`` podem conter todas as chaves
que um array ``$paginate`` básico conteria.

``Controller::paginate()`` retorna uma instância de ``Cake\Datasource\Paging\PaginatedResultSet``
que implementa a ``Cake\Datasource\Paging\PaginatedInterface``.

Este objeto contém os registros paginados e os parâmetros de paginação.

Paginação Simples
=================

Por padrão, ``Controller::paginate()`` usa a classe ``Cake\Datasource\Paging\NumericPaginator``
que faz uma query ``COUNT()`` para calcular o tamanho do conjunto de resultados para
que os links de número de página possam ser renderizados. Em conjuntos de dados muito grandes, essa query de contagem
pode ser muito cara. Em situações onde você quer mostrar apenas os links 'Próximo' e 'Anterior',
você pode usar o paginador 'simple' que não faz uma query de contagem::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'className' => 'Simple', // Ou use Cake\Datasource\Paging\SimplePaginator::class FQCN
        ];
    }

Ao usar o ``SimplePaginator``, você não será capaz de gerar números de
página, dados de contador, links para a última página ou controles de contagem total de registros.

.. _paginating-multiple-queries:

Paginando Múltiplas Queries
===========================

Você pode paginar múltiplos models em uma única ação de controller, usando a
opção ``scope`` tanto na propriedade ``$paginate`` do controller quanto na
chamada ao método ``paginate()``::

    // Propriedade Paginate
    protected array $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // Em uma ação do controller
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

A opção ``scope`` fará com que o paginador procure por
parâmetros de query string com escopo. Por exemplo, a seguinte URL poderia ser usada para
paginar tags e artigos ao mesmo tempo::

    /dashboard?article[page]=1&tag[page]=3

Veja a seção :ref:`paginator-helper-multiple` para saber como gerar elementos HTML
e URLs com escopo para paginação.

Paginando o Mesmo Model várias vezes
------------------------------------

Para paginar o mesmo model várias vezes dentro de uma única ação do controller você
precisa definir um alias para o model.::

    // Em uma ação do controller
    $this->paginate = [
        'Articles' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticles' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', scope: 'published_articles')
            ->where(['published' => true])
    );

    // Carregar um objeto de tabela adicional para permitir a diferenciação no paginador
    $unpublishedArticlesTable = $this->fetchTable('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $unpublishedArticles = $this->paginate(
        $unpublishedArticlesTable->find('all', scope: 'unpublished_articles')
            ->where(['published' => false])
    );

.. _control-which-fields-used-for-ordering:

Controlar quais Campos são Usados para Ordenação
================================================

Por padrão, a ordenação pode ser feita em qualquer coluna não virtual que uma tabela tenha. Isso às vezes
é indesejável, pois permite que os usuários ordenem por colunas não indexadas que podem
ser caras para ordenar. Você pode definir a lista de campos permitidos que podem ser ordenados
usando a opção ``sortableFields``. Esta opção é necessária quando você deseja
ordenar por quaisquer dados associados ou campos computados que possam fazer parte da sua
query de paginação::

    protected array $paginate = [
        'sortableFields' => [
            'id', 'title', 'Users.username', 'created',
        ],
    ];

Quaisquer requisições que tentem ordenar por campos que não estão na lista permitida serão
ignoradas.

Limitar o Número Máximo de Linhas por Página
============================================

O número de resultados que são buscados por página é exposto ao usuário como o
parâmetro ``limit``. Geralmente é indesejável permitir que os usuários busquem todas
as linhas em um conjunto paginado. A opção ``maxLimit`` garante que ninguém possa definir
esse limite muito alto de fora. Por padrão, o CakePHP limita o número máximo
de linhas que podem ser buscadas para 100. Se esse padrão não for apropriado
para sua aplicação, você pode ajustá-lo como parte das opções de paginação, por
exemplo, reduzindo-o para ``10``::

    protected array $paginate = [
        // Outras chaves aqui.
        'maxLimit' => 10
    ];

Se o parâmetro limit da requisição for maior que este valor, ele será reduzido para
o valor ``maxLimit``.

Requisições de Página Fora do Intervalo
=======================================

``Controller::paginate()`` lançará uma ``NotFoundException`` ao tentar
acessar uma página inexistente, ou seja, o número da página solicitado é maior que a
contagem total de páginas.

Então você pode deixar a página de erro normal ser renderizada ou usar um bloco try catch
e tomar a ação apropriada quando uma ``NotFoundException`` for capturada::

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Faça algo aqui como redirecionar para a primeira ou última página.
            // $e->getPrevious()->getAttributes('pagingParams') fornecerá as informações necessárias.
        }
    }

Usando uma classe de paginador diretamente
==========================================

Você também pode usar um paginador diretamente.::

        // Criar um paginador
        $paginator = new \Cake\Datasource\Paginator\NumericPaginator();

        // Paginar o model
        $results = $paginator->paginate(
            // Query ou instância de tabela que você precisa paginar
            $this->fetchTable('Articles'),
            // Parâmetros da requisição
            $this->request->getQueryParams(),
            // Array de configuração com a mesma estrutura das opções do Controller::$paginate
            [
                'finder' => 'latest',
            ]
        );

Paginação na View
======================

Verifique a documentação do :php:class:`~Cake\\View\\Helper\\PaginatorHelper` para
saber como criar links para navegação de paginação.

.. meta::
    :title lang=pt: Paginação
    :keywords lang=pt: paginate,pagination,paging
