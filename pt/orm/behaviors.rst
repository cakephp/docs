Behaviors (Comportamentos)
##########################

Os behaviors são um modo de organizar e habilitar o reuso de lógica da camada
do Model (Modelo). Conceitualmente, eles são semelhantes a traits. No entanto,
os behaviors são implementados como classes separadas. Isso permite que eles se
connectem aos callbacks de ciclo de vida que os modelos emitem, ao mesmo tempo
que fornecem recursos semelhantes a traits.

Os behaviors fornecem uma maneira conveniente de compor comportamentos que são
comuns em vários modelos. Por exemplo, CakePHP inclui um ``TimestampBehavior``.
Vários modelos irão querer campos de timestamp, e a lógica para gerenciar esses
campos não é especifica para nenhum modelo. São esses tipos de cenários em que
os behaviors são perfeitos.

Usando Behaviors
================

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

Core Behaviors
==============

.. toctree::
    :maxdepth: 1

    /orm/behaviors/counter-cache
    /orm/behaviors/timestamp
    /orm/behaviors/translate
    /orm/behaviors/tree


Criando Behavior
================
Nos exemplos a seguir, criaremos um bem simples ``SluggableBehavior``. Esse
behavior nos permitirá preencher um campo slug com o resultado de
``Text::slug()`` baseado em outro campo.

Antes de criar nosso behavior, devemos entender as convensão para
behaviors:

- Behavior estão localizados em **src/Model/Behavior**, ou
  ``MyPlugin\Model\Behavior``.
- Classes de Behavior devem estar no namespace ``App\Model\Behavior``, ou
  ``MyPlugin\Model\Behavior`` namespace.
- Classes de Behavior terminam com ``Behavior``.
- Behaviors estendem ``Cake\ORM\Behavior``.

Para criar nosso behavior sluggable. Coloque o seguinte em
**src/Model/Behavior/SluggableBehavior.php**::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {
    }

Semelhante a classes de tabela (table classes), behaviors também tem um método
``initialize()`` onde você pode colocar o código de inicialização do seu
behavior, se necessário::

    public function initialize(array $config)
    {
        // Algum código de inicialização aqui 
    }

Agora nós podemos adicionar esse behavior a uma de nossas classes de tabela
(table classes). Neste exemplo, nós usaremos um ``ArticlesTable``, pois artigos
normalmente tem propriedades de slug para criar URLs amigáveis::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Sluggable');
        }
    }

Nosso novo behavior não faz muita coisa no momento. Em seguida,, iremos adicionar um
método de mixin e um event listener para que, quando salvarmos entidades nós podemos
realizar slug automaticamento de um campo.

Definindo Métodos de Mixin
--------------------------

Qualquer método publico definido em um behavior será adicionado como um método 'mixin'
no objeto de tabela que está anexado. Se você anexar dois behavior fornecem os mesmos
métodos uma exceção será lançada. Se um comportamento fornecer o mesmo método que uma
classe de tabela, o método de comportamento não será chamado pela tabela. Os métodos
de mixin receberão exatamente os mesmo argumentos fornecidos à tabela. Por exemplo, se
o nosso SluggableBehavior definiu o seguinte método::

    public function slug($value)
    {
        return Text::slug($value, $this->_config['replacement']);
    }

Isto poderia ser invocado usando::

    $slug = $articles->slug('My article name');

Limitando ou Renomeando Métodos de Mixin Expostos
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ao criar behaviors, pode haver situações em que você não deseja expor métodos
públicos como métodos de 'mixin'. Nesses casos, você pode usar a chave de
configuração ``implementedMethods`` para renomear ou excluir métodos de 'mixin'.
Por exemplo, se quisermos prefixar nosso método slug(), nós poderíamos fazer o
seguinte::

    protected $_defaultConfig = [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ];

Aplicando essa configuração deixará ``slug()`` como não callable, no entanto,
ele adicionará um método 'mixin' ``superSlug`` à tabela. Notavelmente, se nosso
behavior implementasse outros métodos públicos eles **não** estariam disponíveis
como métodos 'mixin' com a configuração acima.

Desde que os métodos expostos são decididos por configuração, você também pode
renomear/remover métodos de 'mixin' ao adicionar um behavior à tabela. Por exemplo::

    // In a table's initialize() method.
    $this->addBehavior('Sluggable', [
        'implementedMethods' => [
            'superSlug' => 'slug',
        ]
    ]);

Defining Event Listeners
------------------------

Agora que nosso behavior tem um método de 'mixin' para campos de slug, nós
podemos implementar um listener de callback para automaticar gerar slug de um
campo quando entidades são salvas. Nós também iremos modificar nosso método
de slug para aceitar uma entidade ao invéz de apenas um valor simples. Nosso 
behavior agora deve parecer com::

    namespace App\Model\Behavior;

    use ArrayObject;
    use Cake\Datasource\EntityInterface;
    use Cake\Event\Event;
    use Cake\ORM\Behavior;
    use Cake\ORM\Entity;
    use Cake\ORM\Query;
    use Cake\Utility\Text;

    class SluggableBehavior extends Behavior
    {
        protected $_defaultConfig = [
            'field' => 'title',
            'slug' => 'slug',
            'replacement' => '-',
        ];

        public function slug(Entity $entity)
        {
            $config = $this->config();
            $value = $entity->get($config['field']);
            $entity->set($config['slug'], Text::slug($value, $config['replacement']));
        }

        public function beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)
        {
            $this->slug($entity);
        }

    }

O código acima mostra alguns recursos interessantes de behaviors:

- Behaviors podem definir métodos de callback definindo métodos que seguem as
  convensões de :ref:`table-callbacks`.
- Behaviors podem definir uma propriedade de configuração padrão. Essa propriedade é mesclada
  com as substituições quando um behavior é anexado à tabela.

Para evitar que o processo de gravação (save) continue, simplesmente pare a propagação do
evento em seu callback::

    public function beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)
    {
        if (...) {
            $event->stopPropagation();
            return;
        }
        $this->slug($entity);
    }

Definindo Finders
-----------------

Agora que somos capazes de salvar artigos com valores de slug, nós devemos
implementar um método de 'finder'(busca) para que possamos obter artigos por
seus slugs. Em métodos de busca de behaviors, use as mesmas convenções que
:ref:`custom-find-methods` usa. Nosso método ``find('slug')`` pareceria com::

    public function findSlug(Query $query, array $options)
    {
        return $query->where(['slug' => $options['slug']]);
    }

Uma vez que nosso behavior tem o método acima nós podemos chamá-lo::

    $article = $articles->find('slug', ['slug' => $value])->first();

Limitando ou Renomeando Métodos Finder Expostos
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ao criar behaviors, pode haver situações em que você não deseja expor métodos
finder, ou você precisa renomear o finder para evitar métodos duplicados.
Nesses casos, você pode usar a chave de configuração ``implementedFinders``
para renomear ou excluir métodos finder. Por exemplo, se quisermos renomear
nosso método ``find(slug)``, nós poderíamos fazer o seguinte::

    protected $_defaultConfig = [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ];

Aplicando esta configuração fará com ``find('slug')`` dispare um erro. No entanto,
ela deixara disponível ``find('slugged')``. Notavelmente, se nosso behavior
implementasse outros métodos finder, eles **não** estariam disponíveis, pois não
estão incluídos na configuração.

Desde que os métodos expostos são decididos por configuração, você também pode
renomear/remover métodos finder ao adicionar um behavior à tabela. Por exemplo::

    // In a table's initialize() method.
    $this->addBehavior('Sluggable', [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ]);

Transforming Request Data into Entity Properties
================================================

Behaviors podem definir lógica para como os campos personalizados que eles
fornecem são arrumados (marshalled) implementando a ``Cake\ORM\PropertyMarshalInterface``.
Esta interface requer um único método para ser implementado::

    public function buildMarshalMap($marshaller, $map, $options)
    {
        return [
            'custom_behavior_field' => function ($value, $entity) {
                // Transform the value as necessary
                return $value . '123';
            }
        ];
    }

O ``TranslateBehavior`` tem uma implementação não trivial desta interface
à qual você pode querer referir.

.. versionadded:: 3.3.0
    A capacidade de behaviors para participar do processo de marshalling foi adicionada em in 3.3.0

Removendo Behaviors Carregados
==============================

Para remover um behavior da sua tabela, você pode chamar o método ``removeBehavior()``::

    // Remove the loaded behavior
    $this->removeBehavior('Sluggable');

Acessando Behaviors Carregados
==============================

Uma vez que você anexou behaviors à sua instância da Table você pode conferir
os behaviors carregados ou acessar behaviors específicos usando o ``BehaviorRegistry``::

    // See which behaviors are loaded
    $table->behaviors()->loaded();

    // Check if a specific behavior is loaded.
    // Remember to omit plugin prefixes.
    $table->behaviors()->has('CounterCache');

    // Get a loaded behavior
    // Remember to omit plugin prefixes
    $table->behaviors()->get('CounterCache');

Re-configurando Behaviors Carregados
------------------------------------

Para modificar a configuração de um behavior já carregado, você pode combinar
o comando ``BehaviorRegistry::get`` com o comando ``config`` fornecido pela trait
``InstanceConfigTrait``.

Por exemplo, se uma classe pai (por exemplo uma, ``AppTable``) carregasse o
behavior ``Timestamp``, você poderia fazer o seguinte para adicionar, modificar
ou remover as configurações do behavior. Nesse caso, nós adicionaremos um evento
que queremos que o Timestamp responda::

    namespace App\Model\Table;

    use App\Model\Table\AppTable; // similar to AppController

    class UsersTable extends AppTable
    {
        public function initialize(array $options)
        {
            parent::initialize($options);

            // e.g. if our parent calls $this->addBehavior('Timestamp');
            // and we want to add an additional event
            if ($this->behaviors()->has('Timestamp')) {
                $this->behaviors()->get('Timestamp')->config([
                    'events' => [
                        'Users.login' => [
                            'last_login' => 'always'
                        ],
                    ],
                ]);
            }
        }
    }
