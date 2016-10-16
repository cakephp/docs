ElasticSearch
#############

O plugin ElasticSearch disponibiliza uma abstração semelhante a do ORM para
conversar com o
`elasticsearch <https://www.elastic.co/products/elasticsearch>`_. O plugin
disponibiliza recursos que tornam testes, indexação de documentos e busca por
seus índices uma tarefa mais fácil de se executar.

Instalação
==========

Para instalar o plugin ElasticSearch, você pode usar o ``composer``. A partir do
diretório raiz de sua aplicação (onde o arquivo composer.json está localizado)
execute o seguinte::

    php composer.phar require cakephp/elastic-search "@stable"

Você precisará adicionar a seguinte linha ao arquivo **config/bootstrap.php** da
sua aplicação::

    Plugin::load('Cake/ElasticSearch', ['bootstrap' => true]);

Adicionalmente, você precisará configurar a conexão como um *datasource* chamado
'elastic' no seu arquivo **config/app.php**. Um exemplo de configuração ficaria
assim::

    // No config/app.php
    'Datasources' => [
        // outros datasources
        'elastic' => [
            'className' => 'Cake\ElasticSearch\Datasource\Connection',
            'driver' => 'Cake\ElasticSearch\Datasource\Connection',
            'host' => '127.0.0.1',
            'port' => 9200,
            'index' => 'my_apps_index',
        ],
    ]

Visão geral
===========

O plugin ElasticSearch torna fácil interagir com um índice do *elasticsearch* e
disponibiliza uma interface similar ao :doc:`/orm`. Para começar, você deve
criar um objeto ``Type``. Objetos ``Type`` são a classe similar a um
"repositório" ou "tabela" no *elasticsearch*::

    // No src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
    }

Você pode então usar a sua classe *type* nos seus *controllers*::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        // Carrega o Type usando o provedor 'Elastic'
        $this->loadModel('Articles', 'Elastic');
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->data());
            if ($this->Articles->save($article)) {
                $this->Flash->success('It saved');
            }
        }
        $this->set(compact('article'));
    }

Nós também precisamos criar um *template* básico para exibir nossos artigos
indexados::

    // No src/Template/Articles/add.ctp
    <?= $this->Form->create($article) ?>
    <?= $this->Form->input('title') ?>
    <?= $this->Form->input('body') ?>
    <?= $this->Form->button('Save') ?>
    <?= $this->Form->end() ?>

Agora você deve conseguir submeter o formulário e ter um novo documento
adicionado ao *elasticsearch*.

Objetos Document
================

Como no ORM, o ODM do ElasticSearch usa classes semelhantes a
:doc:`/orm/entities`. A classe base a partir da qual você deve indicar herança é
a ``Cake\ElasticSearch\Document``. Classes de documento podem ser encontradas
sob o *namespace* ``Model\Document`` da sua aplicação ou *plugin*::

    namespace App\Model\Document;

    class Article extends Document
    {
    }

Fora da lógica do construtor que faz *Documents* trabalharem com dados do
*elasticsearch*, a interface e as funcionalidades disponibilizadas pelo objeto
``Document`` são as mesmas do :doc:`/orm/entities`.

Buscando documentos indexados
=============================

Depois que você indexar alguns documentos, é hora de buscar por eles. O plugin
ElasticSearch disponibiliza um *query builder* que permite a você construir
*queries* de busca::

    $query = $this->Articles->find()
        ->where([
            'title' => 'special',
            'or' => [
                'tags in' => ['cake', 'php'],
                'tags not in' => ['c#', 'java']
            ]
        ]);

    foreach ($query as $article) {
        echo $article->title;
    }

Você pode usar o ``FilterBuilder`` para adicionar condições de filtragem::

    $query->where(function ($builder) {
        return $builder->and(
            $builder->gt('views', 99),
            $builder->term('author.name', 'sally')
        );
    });

A lista completa de métodos com exemplos práticos pode ser encontradda no código
fonte do `FilterBuilder
<https://github.com/cakephp/elastic-search/blob/master/src/FilterBuilder.php>`_.

Validando dados & Usando regras da aplicação
============================================

Como no ORM, o plugin ElasticSearch permite validar dados ao ordenar documentos.
Validar dados da requisição e aplicar regras da aplicação funcionam da mesma
forma como no ORM relacional. Veja a seção :ref:`validating-request-data` e a
seção :ref:`application-rules` para mais informações.

.. Precisa de informações para validadores aninhados.

Salvando novos documentos
=========================

Quando você estiver pronto para indexar dados no *elasticsearch*, primeiramente
será necessário converter seus dados em um ``Document`` para que possam ser
indexados::

    $article = $this->Articles->newEntity($data);
    if ($this->Articles->save($article)) {
        // Document indexado
    }

Ao ordenar um documento, você pode especificar quais incorporações você deseja
processar usando a chave ``associated``::

    $article = $this->Articles->newEntity($data, ['associated' => ['Comments']]);

Salvar um documento irá disparar os seguintes eventos:

* ``Model.beforeSave`` - Disparado antes do documento ser salvo. Você pode
  prevenir a operação ao parar este evento.
* ``Model.buildRules`` - Disparado quando o verificador de regras é construído
  pela primeira vez.
* ``Model.afterSave`` - Disparado depois do documento ser salvo.

.. note::
    Não existem eventos para documentos incorporados devido ao documento pai e todos
    os seus documentos incorporados serem salvos em uma única operação.

Atualizando documentos existentes
=================================

Quando você precisar re-indexar dados, você pode acrescentar informações a
*entities* existentes e salvá-las novamente::

    $query = $this->Articles->find()->where(['user.name' => 'jill']);
    foreach ($query as $doc) {
        $doc->set($newProperties);
        $this->Articles->save($doc);
    }

Deletando documentos
====================

Depois de requisitar um documento, você pode deletá-lo::

    $doc = $this->Articles->get($id);
    $this->Articles->delete($doc);

Você também pode deletar documentos que correspondem condições específicas::

    $this->Articles->deleteAll(['user.name' => 'bob']);

Incorporando documentos
=======================

Ao definir documentos incorporados, você pode anexar classes de entidade a
caminhos de propriedade específicos em seus documentos. Isso permite a você
sobrescrever o comportamento padrão dos documentos relacionados a um
parente. Por exemplo, você pode querer ter os comentários incorporados a um
artigo para ter acesso a métodos específicos da aplicação. Você pode usar os
métodos ``embedOne`` e ``embedMany`` para definir documentos incorporados::

    // No src/Model/Type/ArticlesType.php
    namespace App\Model\Type;

    use Cake\ElasticSearch\Type;

    class ArticlesType extends Type
    {
        public function initialize()
        {
            $this->embedOne('User');
            $this->embedMany('Comments', [
                'entityClass' => 'MyComment'
            ]);
        }
    }

O código acima deve criar dois documentos incorporados ao documento ``Article``.
O ``User`` incorporado irá converter a propriedade ``user`` em instâncias de
``App\Model\Document\User``. Para que os comentários incorporados usem um nome
de classe que não correspondem ao nome da propriedade, podemos usar a opção
``entityClass`` para configurar um nome de classe opcional.

Uma vez que configuramos nossos documentos incorporados, os resultados do
``find()`` e ``get()`` retornarão objetos com as classes de documentos
incorporados corretas::

    $article = $this->Articles->get($id);
    // Instância de App\Model\Document\User
    $article->user;

    // Array das instâncias App\Model\Document\Comment
    $article->comments;

Recebendo instâncias Type
=========================

Como no ORM, o plugin ElasticSearch disponibiliza um *factory/registry* para
receber instâncias ``Type``::

    use Cake\ElasticSearch\TypeRegistry;

    $articles = TypeRegistry::get('Articles');

Descarregando o Registry
------------------------

Durante casos de testes você pode querer descarregar o *registry*. Fazê-lo é
frequentemente útil quando

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a type's dependencies::

    TypeRegistry::flush();

Suites de testes
================

O plugin ElasticSearch disponibiliza integração com suites de testes sem
remendos. Tais como nas suites de banco de dados, você criar suites de testes
para o *elasticsearch*. Podemos definir uma suite de teste para nosso *articles
type* com o seguinte código::

    namespace App\Test\Fixture;

    use Cake\ElasticSearch\TestSuite\TestFixture;

    /**
     * Articles fixture
     */
    class ArticlesFixture extends TestFixture
    {
        /**
         * A table/type para essa fixture.
         *
         * @var string
         */
        public $table = 'articles';

        /**
         * O mapeamento de dados.
         *
         * @var array
         */
        public $schema = [
            'id' => ['type' => 'integer'],
            'user' => [
                'type' => 'nested',
                'properties' => [
                    'username' => ['type' => 'string'],
                ]
            ]
            'title' => ['type' => 'string'],
            'body' => ['type' => 'string'],
        ];

        public $records = [
            [
                'user' => [
                    'username' => 'birl'
                ],
                'title' => 'Primeiro post',
                'body' => 'Conteúdo'
            ]
        ];
    }

A propriedade ``Schema`` usa o `formato de mapeamento para elasticsearch nativo
<https://www.elastic.co/guide/en/elasticsearch/reference/1.5/mapping.html>`_.
Você pode seguramente omitir o *type name* e a chave ``propertires``. Uma vez
que suas *fixtures* estejam criadas, você pode usá-las nos seus casos de testes
ao incluí-las nas propriedades dos seus ``fixtures`` de testes::

    public $fixtures = ['app.articles'];
