Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

O behavior timestamp permite que seus objetos atualizem um ou mais timestamps a cada evento. É utilizado principalmente para preencher os campos ``created`` e ``modified``. Entretanto, com algumas configurações adicionais, você pode atualizar qualquer coluna timestamp/datetime de qualquer tabela.

Uso Básico
==========

Você ativa o behavior timestamp como qualquer outro behavior::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

A configuração padrão fará o seguinte:

- Quando uma nova entidade é salva, os campos ``created`` e ``modified`` são preenchidos com a hora atual.
- Quando uma entidade é atualizada, o campo ``modified`` é preenchido com a hora atual.

Usando e Configurando o Behavior
================================

Se você precisar modificar campos com nomes diferentes ou quiser atualizar campos de timestamp em eventos personalizados, você pode usar uma configuração adicional::

    class OrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'updated_at' => 'always',
                    ],
                    'Orders.completed' => [
                        'completed_at' => 'always'
                    ]
                ]
            ]);
        }
    }

Como você pode ver acima, além do evento padrão ``Model.beforeSave``, nós também estamos atualizando a coluna ``completed_at`` quando os pedidos são concluídos.

Atualizando Timestamps em Entidades
===================================

Às vezes você vai querer atualizar apenas os timestamps em uma entidade sem alterar quaisquer outras propriedades. Isso é chamado de 'touching' uma informação. No CakePHP você pode usar o método ``touch ()`` para fazer exatamente isso::

    // Touch baseado no evento Model.beforeSave.
    $articles->touch($article);

    // Touch baseado em um evento específico.
    $orders->touch($order, 'Orders.completed');

Após você salvar a entidade, o campo é atualizado.

Registro 'touching' pode ser útil quando você deseja avisar que um recurso pai mudou quando um recurso filho é criado/atualizado. Por exemplo: atualizar um artigo quando um novo comentário é adicionado.

Salvando Atualizações Sem Alterar o Timestamp
=============================================

Para desativar a atualização automática do campo ``updated``, quando salvamos uma entidade, você pode marcar o atributo como 'dirty'::

    // Marca a coluna modified como dirty
    $order->setDirty('modified', true);

    // Anterior a versão 3.4.0
    $order->dirty('modified', true);
