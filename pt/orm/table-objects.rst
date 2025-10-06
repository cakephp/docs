Objetos de Tabela
#################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Objetos de tabela fornecem acesso à coleção de entidades armazenadas em uma tabela específica.
Cada tabela em sua aplicação deve ter uma classe Table associada
que é usada para interagir com uma determinada tabela. Se você não precisa customizar
o comportamento de uma determinada tabela, o CakePHP gerará uma instância de Table para você
usar.

Antes de tentar usar objetos Table e o ORM, você deve garantir que
configurou sua :ref:`conexão de banco de dados <database-configuration>`.

Uso Básico
==========

Para começar, crie uma classe Table. Essas classes ficam em
**src/Model/Table**. Tables são um tipo de coleção de model específico para bancos de dados
relacionais, e a interface principal para seu banco de dados no ORM do CakePHP. A classe de tabela
mais básica se pareceria com::

    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Note que não dissemos ao ORM qual tabela usar para nossa classe. Por
convenção, os objetos de tabela usarão uma tabela que corresponde à versão em letra minúscula e
underscored do nome da classe. No exemplo acima, a tabela ``articles``
será usada. Se nossa classe de tabela fosse nomeada ``BlogPosts``, sua tabela deveria
ser nomeada ``blog_posts``. Você pode especificar a tabela a usar usando o método ``setTable()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->setTable('my_table');
        }
    }

Nenhuma convenção de inflexão será aplicada ao especificar uma tabela. Por convenção,
o ORM também espera que cada tabela tenha uma chave primária com o nome de ``id``.
Se você precisar modificar isso, pode usar o método ``setPrimaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->setPrimaryKey('my_id');
        }
    }

Customizando a Classe de Entidade que uma Tabela Usa
-----------------------------------------------------

Por padrão, os objetos de tabela usam uma classe de entidade baseada em convenções de nomenclatura. Por
exemplo, se sua classe de tabela se chama ``ArticlesTable``, a entidade seria
``Article``. Se a classe de tabela fosse ``PurchaseOrdersTable``, a entidade seria
``PurchaseOrder``. Se, no entanto, você quiser usar uma entidade que não siga as
convenções, pode usar o método ``setEntityClass()`` para mudar as coisas::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->setEntityClass('App\Model\Entity\PO');
        }
    }

Como visto nos exemplos acima, os objetos Table têm um método ``initialize()``
que é chamado no final do construtor. É recomendado que você use
este método para fazer lógica de inicialização em vez de sobrescrever o construtor.

Obtendo Instâncias de uma Classe Table
---------------------------------------

Antes de poder consultar uma tabela, você precisará obter uma instância da tabela. Você
pode fazer isso usando a classe ``TableLocator``::

    // Em um controller

    $articles = $this->fetchTable('Articles');

``TableLocator`` fornece as várias dependências para construir
uma tabela, e mantém um registro de todas as instâncias de tabela construídas, tornando
mais fácil construir relações e configurar o ORM. Veja
:ref:`table-locator-usage` para mais informações.

Se sua classe de tabela estiver em um plugin, certifique-se de usar o nome correto para sua
classe de tabela. Não fazer isso pode resultar em regras de validação, ou callbacks não
sendo acionados, pois uma classe padrão é usada em vez de sua classe real. Para
carregar corretamente classes de tabela de plugin, use o seguinte::

    // Tabela de plugin
    $articlesTable = $this->fetchTable('PluginName.Articles');

    // Tabela de plugin prefixada por vendor
    $articlesTable = $this->fetchTable('VendorName/PluginName.Articles');

.. _table-callbacks:

Callbacks de Ciclo de Vida
===========================

Como você viu acima, os objetos de tabela acionam vários eventos. Eventos são
úteis se você quiser se conectar ao ORM e adicionar lógica sem fazer subclasse ou
sobrescrever métodos. Listeners de eventos podem ser definidos em classes de tabela ou behavior.
Você também pode usar o gerenciador de eventos de uma tabela para vincular listeners.

Ao usar métodos de callback, behaviors anexados no
método ``initialize()`` terão seus listeners acionados **antes** dos métodos
de callback da tabela serem acionados. Isso segue a mesma sequência dos controllers
e components.

Para adicionar um listener de evento a uma classe Table ou Behavior, basta implementar as
assinaturas de método conforme descrito abaixo. Veja o :doc:`/core-libraries/events` para
mais detalhes sobre como usar o subsistema de eventos::

    // Em um controller
    $articles->save($article, ['customVariable1' => 'yourValue1']);

    // Em ArticlesTable.php
    public function afterSave(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $customVariable = $options['customVariable1'];	// 'yourValue1'
        $options['customVariable2'] = 'yourValue2';
    }

    public function afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        $customVariable = $options['customVariable1'];	// 'yourValue1'
        $customVariable = $options['customVariable2'];	// 'yourValue2'
    }


Lista de Eventos
----------------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.afterMarshal``
* ``Model.beforeFind``
* ``Model.buildValidator``
* ``Model.buildRules``
* ``Model.beforeRules``
* ``Model.afterRules``
* ``Model.beforeSave``
* ``Model.afterSave``
* ``Model.afterSaveCommit``
* ``Model.beforeDelete``
* ``Model.afterDelete``
* ``Model.afterDeleteCommit``

initialize
----------

.. php:method:: initialize(EventInterface $event, ArrayObject $data, ArrayObject $options)

O evento ``Model.initialize`` é disparado após o construtor e os métodos initialize
serem chamados. As classes ``Table`` não escutam este evento por
padrão, e em vez disso usam o método hook ``initialize``.

Para responder ao evento ``Model.initialize``, você pode criar uma classe listener
que implementa ``EventListenerInterface``::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents(): array
        {
            return [
                'Model.initialize' => 'initializeEvent',
            ];
        }

        public function initializeEvent($event): void
        {
            $table = $event->getSubject();
            // faça algo aqui
        }
    }

e anexe o listener ao ``EventManager`` como abaixo::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

Isso chamará o ``initializeEvent`` quando qualquer classe ``Table`` for construída.

beforeMarshal
-------------

.. php:method:: beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)

O evento ``Model.beforeMarshal`` é disparado antes que os dados da requisição sejam convertidos
em entidades. Veja a documentação :ref:`before-marshal` para mais informações.

afterMarshal
-------------

.. php:method:: afterMarshal(EventInterface $event, EntityInterface $entity, ArrayObject $data, ArrayObject $options)

O evento ``Model.afterMarshal`` é disparado após os dados da requisição serem convertidos
em entidades. Handlers de eventos receberão as entidades convertidas, os dados originais da requisição
e as opções fornecidas à chamada ``patchEntity()`` ou ``newEntity()``.

beforeFind
----------

.. php:method:: beforeFind(EventInterface $event, SelectQuery $query, ArrayObject $options, boolean $primary)

O evento ``Model.beforeFind`` é disparado antes de cada operação de busca. Ao parar
o evento, e alimentar a query com um conjunto de resultados customizado, você pode ignorar a operação de busca
completamente::

    public function beforeFind(EventInterface $event, SelectQuery $query, ArrayObject $options, $primary): void
    {
        if (/* ... */) {
            $event->stopPropagation();
            $query->setResult(new \Cake\Datasource\ResultSetDecorator([]));

            return;
        }
        // ...
    }

Neste exemplo, nenhum outro evento ``beforeFind`` será acionado na
tabela relacionada ou seus behaviors anexados (embora eventos de behavior sejam geralmente
invocados mais cedo dadas suas prioridades padrão), e a query retornará
o conjunto de resultados vazio que foi passado via ``SelectQuery::setResult()``.

Quaisquer mudanças feitas na instância ``$query`` serão retidas para o resto
da busca. O parâmetro ``$primary`` indica se esta é a query raiz
ou uma query associada. Todas as associações participando de uma query terão
um evento ``Model.beforeFind`` acionado. Para associações que usam joins,
uma query fictícia será fornecida. No seu listener de evento, você pode definir
campos adicionais, condições, joins ou formatadores de resultado. Essas opções/recursos serão
copiados para a query raiz.

Nas versões anteriores do CakePHP havia um callback ``afterFind``, este foi
substituído pelos recursos :ref:`map-reduce` e construtores de entidade.

buildValidator
--------------

.. php:method:: buildValidator(EventInterface $event, Validator $validator, $name)

O evento ``Model.buildValidator`` é disparado quando o validador ``$name`` é criado.
Behaviors podem usar este hook para adicionar métodos de validação.

buildRules
----------

.. php:method:: buildRules(RulesChecker $rules): RulesChecker

O evento ``Model.buildRules`` é disparado após uma instância de regras ter sido
criada e após o método ``Table::buildRules()`` ter sido chamado.

beforeRules
-----------

.. php:method:: beforeRules(EventInterface $event, EntityInterface $entity, ArrayObject $options, $operation)

O evento ``Model.beforeRules`` é disparado antes que uma entidade tenha tido regras aplicadas. Ao
parar este evento, você pode interromper a verificação de regras e definir o resultado
da aplicação de regras.

afterRules
----------

.. php:method:: afterRules(EventInterface $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

O evento ``Model.afterRules`` é disparado após uma entidade ter regras aplicadas. Ao
parar este evento, você pode retornar o valor final da operação de verificação de regras.

beforeSave
----------

.. php:method:: beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.beforeSave`` é disparado antes de cada entidade ser salva. Parar
este evento abortará a operação de salvamento. Quando o evento é parado, o resultado
do evento será retornado.

afterSave
---------

.. php:method:: afterSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.afterSave`` é disparado após uma entidade ser salva.

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.afterSaveCommit`` é disparado após a transação na qual a
operação de salvamento está envolvida ter sido confirmada. Também é acionado para salvamentos não atômicos
onde operações de banco de dados são confirmadas implicitamente. O evento é acionado
apenas para a tabela primária na qual ``save()`` é chamado diretamente. O evento não
é acionado se uma transação for iniciada antes de chamar save.

beforeDelete
------------

.. php:method:: beforeDelete(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.beforeDelete`` é disparado antes que uma entidade seja deletada. Ao
parar este evento, você abortará a operação de exclusão. Quando o evento é parado, o resultado
do evento será retornado.

afterDelete
-----------

.. php:method:: afterDelete(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.afterDelete`` é disparado após uma entidade ter sido deletada.

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(EventInterface $event, EntityInterface $entity, ArrayObject $options)

O evento ``Model.afterDeleteCommit`` é disparado após a transação na qual a
operação de exclusão está envolvida ter sido confirmada. Também é acionado para
exclusões não atômicas onde operações de banco de dados são confirmadas implicitamente. O evento é
acionado apenas para a tabela primária na qual ``delete()`` é chamado diretamente.
O evento não é acionado se uma transação for iniciada antes de chamar delete.

Parando Eventos de Tabela
--------------------------
Para evitar que o salvamento continue, simplesmente pare a propagação do evento no seu callback::

    public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options): void
    {
        if (...) {
            $event->stopPropagation();
            $event->setResult(false);

            return;
        }
        ...
    }

Alternativamente, você pode retornar false do callback. Isso tem o mesmo efeito de parar a propagação do evento.

Prioridades de Callback
------------------------

Ao usar eventos em suas tabelas e behaviors, esteja ciente da prioridade
e da ordem em que os listeners são anexados. Eventos de behavior são anexados antes dos eventos
de Table. Com as prioridades padrão, isso significa que callbacks de Behavior são
acionados **antes** do evento de Table com o mesmo nome.

Como exemplo, se sua Table estiver usando ``TreeBehavior``, o
método ``TreeBehavior::beforeDelete()`` será chamado antes do
``beforeDelete()`` da sua tabela, e você não será capaz de trabalhar com os nós filhos
do registro sendo deletado no método da sua Table.

Você pode gerenciar prioridades de eventos de algumas maneiras:

#. Altere a ``priority`` dos listeners de um Behavior usando a opção ``priority``.
   Isso modificará a prioridade de **todos** os métodos de callback no
   Behavior::

        // Em um método initialize() de Table
        $this->addBehavior('Tree', [
            // O valor padrão é 10 e os listeners são despachados do
            // menor para o maior prioridade.
            'priority' => 2,
        ]);

#. Modifique a ``priority`` em sua classe ``Table`` usando o
   método ``Model.implementedEvents()``. Isso permite que você atribua uma
   prioridade diferente por função de callback::

        // Em uma classe Table.
        public function implementedEvents(): array
        {
            $events = parent::implementedEvents();
            $events['Model.beforeDelete'] = [
                'callable' => 'beforeDelete',
                'priority' => 3
            ];

            return $events;
        }

Behaviors
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Behaviors fornecem uma maneira de criar partes de lógica horizontalmente
reutilizáveis relacionadas às classes de tabela. Você pode estar se perguntando
por que os behaviors são classes regulares e não traits. O principal motivo para
isso são listeners de eventos. Enquanto traits permitiriam partes reutilizáveis de
lógica, eles complicariam a vinculação de eventos.

Para adicionar um behavior à sua tabela, você pode chamar o método ``addBehavior()``.
Geralmente, o melhor lugar para fazer isso é no método ``initialize()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Timestamp');
        }
    }

Como acontece com as associações, você pode usar :term:`sintaxe de plugin` e fornecer
opções de configuração adicionais::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

Você pode descobrir mais sobre behaviors, incluindo os behaviors fornecidos
pelo CakePHP, no capítulo sobre :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configurando Conexões
======================

Por padrão, todas as instâncias de tabela usam a conexão de banco de dados ``default``. Se sua
aplicação usa múltiplas conexões de banco de dados, você vai querer configurar quais
tabelas usam quais conexões. Este é o método ``defaultConnectionName()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName(): string {
            return 'replica_db';
        }
    }

.. note::

    O método ``defaultConnectionName()`` **deve** ser estático.

.. _table-registry-usage:
.. _table-locator-usage:

Usando o TableLocator
=====================

.. php:class:: TableLocator

Como vimos anteriormente, a classe TableLocator fornece uma maneira de usar uma
factory/registry para acessar as instâncias de tabela da sua aplicação. Ela fornece alguns
outros recursos úteis também.

Configurando Objetos Table
---------------------------

.. php:method:: get($alias, $config)

Ao carregar tabelas do registro, você pode customizar suas dependências, ou
usar objetos mock fornecendo um array ``$options``::

    $articles = FactoryLocator::get('Table')->get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

Preste atenção às configurações de conexão e schema, elas não são
valores de string, mas objetos. A conexão receberá um objeto de
``Cake\Database\Connection`` e schema ``Cake\Database\Schema\Collection``.

.. note::

    Se sua tabela também faz configuração adicional em seu método ``initialize()``,
    esses valores sobrescreverão os fornecidos ao registro.

Você também pode pré-configurar o registro usando o método ``setConfig()``.
Os dados de configuração são armazenados *por alias*, e podem ser sobrescritos pelo método
``initialize()`` de um objeto::

    FactoryLocator::get('Table')->setConfig('Users', ['table' => 'my_users']);

.. note::

    Você só pode configurar uma tabela antes ou durante a **primeira** vez que você
    acessar esse alias. Fazer isso após o registro ser populado não terá
    efeito.

Limpando o Registro
--------------------

.. php:method:: clear()

Durante casos de teste, você pode querer limpar o registro. Fazer isso é frequentemente útil
quando você está usando objetos mock ou modificando as dependências de uma tabela::

    FactoryLocator::get('Table')->clear();

Configurando o Namespace para Localizar Classes ORM
----------------------------------------------------

Se você não seguiu as convenções, é provável que suas classes Table ou
Entity não sejam detectadas pelo CakePHP. Para corrigir isso, você pode
definir um namespace com o método ``Cake\Core\Configure::write``. Como exemplo::

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

Seria configurado com::

    Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');
