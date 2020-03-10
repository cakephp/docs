Pagination
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

Um dos principais obstáculos da criação de aplicativos Web flexíveis e fáceis de usar 
é o design de uma interface de usuário intuitiva. Muitos aplicativos tendem a crescer 
em tamanho e complexidade rapidamente, e designers e programadores acham que não conseguem 
lidar com a exibição de centenas ou milhares de registros. A refatoração leva tempo, e o 
desempenho e a satisfação do usuário podem sofrer.

A exibição de um número razoável de registros por página sempre foi uma parte crítica 
de todos os aplicativos e usada para causar muitas dores de cabeça aos desenvolvedores. 
O CakePHP facilita a carga para o desenvolvedor, fornecendo uma maneira rápida e fácil 
de paginar os dados.

A paginação no CakePHP é oferecida por um componente no controlador, para facilitar a 
criação de consultas paginadas. A View :php:class:`~Cake\\View\\Helper\\PaginatorHelper` 
é usada para simplificar a geração de links e botões de paginação.

Usando Controller::paginate()
=============================

No controlador, começamos definindo as condições de consulta padrão que a paginação usará 
na variável do controlador ``$paginate``. Essas condições servem como base para suas 
consultas de paginação. Eles são aumentados pelos parâmetros ``sort``, ``direction``, 
``limit`` e ``page`` transmitidos a partir da URL. É importante notar que a chave ``order`` 
deve ser definida em uma estrutura de matriz como abaixo::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Você também pode incluir qualquer uma das opções suportadas 
por :php:meth:`~Cake\\ORM\\Table::find()`, como ``fields``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'fields' => ['Articles.id', 'Articles.created'],
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Enquanto você pode passar a maioria das opções de consulta da propriedade 
paginate, geralmente é mais fácil e simples agrupar suas opções de paginação 
em :ref:`custom-find-methods`. Você pode definir o uso da paginação do 
localizador, definindo a opção ``finder``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

Como os métodos localizadores personalizados também podem receber opções, é assim 
que você passa as opções para um método find personalizado dentro da propriedade 
paginate::

    class ArticlesController extends AppController
    {
        // encontrar artigos por tag
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];
            // o método find personalizado é chamado findTagged dentro de ArticlesTable.php, 
            // e deve ter se parecer com: public function findTagged(Query $query, array $options) {
            // portanto, você usa tags como a chave
            $this->paginate = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles);
            $this->set(compact('articles', 'tags'));
        }
    }

Além de definir valores gerais de paginação, você pode definir mais de um 
conjunto de padrões de paginação no controlador, basta nomear as chaves da 
matriz após o modelo que deseja configurar::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Os valores das chaves ``Articles`` e ``Authors`` podem conter todas as propriedades 
que um modelo/chave menos a matriz ``$paginate``.

Depois de definida a propriedade ``$paginate``, podemos usar o método :php:meth:`~Cake\\Controller\\Controller::paginate()` 
para criar os dados de paginação e adicionar o ``PaginatorHelper `` se ainda não foi adicionado. 
O método paginado do controlador retornará o conjunto de resultados da consulta paginada e 
definirá os metadados de paginação para a solicitação. Você pode acessar os metadados da 
paginação em ``$this->request->getParam('paging')``. Um exemplo mais completo do uso de 
``paginate()`` seria::

    class ArticlesController extends AppController
    {
        public function index()
        {
            $this->set('articles', $this->paginate());
        }
    }

Por padrão, o método ``paginate()`` usará o modelo padrão para
um controlador. Você também pode passar a consulta resultante de um método find::

     public function index()
     {
        $query = $this->Articles->find('popular')->where(['author_id' => 1]);
        $this->set('articles', $this->paginate($query));
     }

Se você quiser paginar um modelo diferente, poderá fornecer uma consulta para ele, 
sendo o próprio objeto de tabela ou seu nome::

    // Usando a query.
    $comments = $this->paginate($commentsTable->find());

    // Usando o nome do modelo.
    $comments = $this->paginate('Comments');

    // Usando um objeto de tabela.
    $comments = $this->paginate($commentTable);

Usando o Paginator Diretamente
==============================

Se você precisar paginar os dados de outro componente, poderá usar o PaginatorComponent 
diretamente. O PaginatorComponent possui uma API semelhante ao método do controlador::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Ou
    $articles = $this->Paginator->paginate($articleTable, $config);

O primeiro parâmetro deve ser o objeto de consulta de um objeto de localização na tabela 
do qual você deseja paginar os resultados. Opcionalmente, você pode passar o objeto de 
tabela e permitir que a consulta seja construída para você. O segundo parâmetro deve ser 
a matriz de configurações a serem usadas para paginação. Essa matriz deve ter a mesma estrutura 
que a propriedade ``$paginate`` em um controlador. Ao paginar um objeto ``Query``, a opção 
``finder`` será ignorada. Supõe-se que você esteja passando a consulta que deseja paginar.

.. _paginating-multiple-queries:

Paginando Múltiplas Queries
===========================

Você pode paginar vários modelos em uma única ação do controlador, usando a opção 
``scope`` na propriedade ``$paginate`` do controlador e na chamada para o 
método ``paginate()``::

    // Propriedade Paginar
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // Em um método do controlador
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

A opção ``scope`` resultará na ``PaginatorComponent`` procurando nos parâmetros da 
string de consulta com escopo definido. Por exemplo, o URL a seguir pode ser usado 
para paginar tags e artigos ao mesmo tempo::

    /dashboard?article[page]=1&tag[page]=3

Veja a seção :ref:`paginator-helper-multiple` para saber como gerar elementos HTML 
com escopo e URLs para paginação.

Paginando o Mesmo Modelo Várias Vezes
-------------------------------------

Para paginar o mesmo modelo várias vezes em uma única ação do controlador, é 
necessário definir um alias para o modelo. Consulte :ref:`table-registry-usage` 
para obter detalhes adicionais sobre como usar o registro da tabela::

    // Em um método do controlador
    $this->paginate = [
        'ArticlesTable' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticlesTable' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];
    
    // Registre um objeto de tabela adicional para permitir a diferenciação no componente de paginação
    TableRegistry::getTableLocator()->setConfig('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', [
            'scope' => 'published_articles'
        ])->where(['published' => true])
    );
    
    $unpublishedArticles = $this->paginate(
        TableRegistry::getTableLocator()->get('UnpublishedArticles')->find('all', [
            'scope' => 'unpublished_articles'
        ])->where(['published' => false])
    );

.. _control-which-fields-used-for-ordering:

Controlar Quais Campos Usados para Ordenamento
==============================================

Por padrão, a classificação pode ser feita em qualquer coluna não virtual que uma 
tabela tenha. Às vezes, isso é indesejável, pois permite que os usuários classifiquem 
em colunas não indexadas que podem ser caras de solicitar. Você pode definir a lista de 
permissões dos campos que podem ser classificados usando a opção ``sortWhitelist``. Essa 
opção é necessária quando você deseja classificar os dados associados ou os campos computados 
que podem fazer parte da sua consulta de paginação::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Quaisquer solicitações que tentem classificar campos que não estão na lista de permissões serão ignoradas.

Limitar o Número Máximo de Linhas por Página
============================================

The number of results that are fetched per page is exposed to the user as the
``limit`` parameter. It is generally undesirable to allow users to fetch all
rows in a paginated set. The ``maxLimit`` option asserts that no one can set
this limit too high from the outside. By default CakePHP limits the maximum
number of rows that can be fetched to 100. If this default is not appropriate
for your application, you can adjust it as part of the pagination options, for
example reducing it to ``10``

O número de resultados que são buscados por página é exposto ao usuário como o 
parâmetro ``limit``. Geralmente, é indesejável permitir que os usuários busquem 
todas as linhas em um conjunto paginado. A opção ``maxLimit`` afirma que ninguém 
pode definir esse limite muito alto do lado de fora. Por padrão, o CakePHP limita 
o número máximo de linhas que podem ser buscadas para 100. Se esse padrão não for 
apropriado para a sua aplicação, você poderá ajustá-lo como parte das opções de paginação, 
por exemplo, reduzindo-o para ``10``::

    public $paginate = [
        // Outras chaves aqui.
        'maxLimit' => 10
    ];

If the request's limit param is greater than this value, it will be reduced to
the ``maxLimit`` value.

Joining Additional Associations

Outras chaves aqui. Se o parâmetro de limite da solicitação for maior que esse valor, 
ele será reduzido ao valor ``maxLimit``.

Juntando Associações Adicionais
===============================

Associações adicionais podem ser carregadas na tabela paginada usando o 
parâmetro ``contains``::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

Solicitações de Página Fora do Intervalo
========================================

O PaginatorComponent lançará uma ``NotFoundException`` ao tentar acessar uma página 
inexistente, ou seja, o número da página solicitada é maior que a contagem total de páginas.

Portanto, você pode permitir que a página de erro normal seja renderizada ou usar um 
bloco try catch e executar a ação apropriada quando um ``NotFoundException`` for capturado::

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Faça algo aqui como redirecionar para a primeira ou a última página. 
            // $this->request->getParam('paging') fornecerá as informações necessárias.
        }
    }

Paginação na View
=================

Verifique a documentação :php:class:`~Cake\\View\\Helper\\PaginatorHelper` 
para saber como criar links para navegação de paginação.

.. meta::
    :title lang=pt: Paginação
    :keywords lang=pt: matriz de pedidos, condições de consulta, classe php, aplicativos web, dores de cabeça, obstáculos, complexidade, programadores, parâmetros, paginar, designers, cakephp, satisfação, desenvolvedores
