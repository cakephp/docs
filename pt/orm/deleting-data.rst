Excluindo Dados
###############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(EntityInterface $entity, array $options = [])

Depois que você carregou uma entidade, você pode excluí-la chamando o
método delete da tabela de origem::

    // Em um controller.
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

Ao excluir entidades algumas coisas acontecem:

1. As :ref:`regras de exclusão <application-rules>` serão aplicadas. Se as regras
   falharem, a exclusão será impedida.
2. O evento ``Model.beforeDelete`` é disparado. Se esse evento for interrompido, a
   exclusão será cancelada e o resultado do evento será retornado.
3. A entidade será excluída.
4. Todas as associações dependentes serão excluídas. Se as associações estão sendo
   excluídas como entidades, eventos adicionais serão disparados.
5. Qualquer registro da tabela de ligação para associação BelongsToMany será
   removido.
6. O evento ``Model.afterDelete`` será disparado.

Por padrão, todas as exclusões acontecem dentro de uma transação. Você pode
desativar a transação com a opção atomic::

    $result = $this->Articles->delete($entity, ['atomic' => false]);

O parâmetro ``$options`` suporta as seguintes opções:

- ``atomic`` Padrão é true. Quando true a exclusão acontece dentro
  de uma transação.
- ``checkRules`` Padrão é true. Verifica regras de exclusão antes de excluir
  registros.

Exclusão em Cascata
-------------------

Ao excluir entidades, os dados associados também podem ser excluídos. Se suas
associações HasOne e HasMany estão configuradas como ``dependent``, as operações
de exclusão serão 'cascateadas' para essas entidades também. Por padrão entidades
em tabelas associadas são removidas usando :php:meth:`Cake\\ORM\\Table::deleteAll()`.
Você pode optar que o ORM carregue as entidades relacionadas, e exclua-as
individualmente, definindo a opção ``cascadeCallbacks`` como ``true``. Uma
amostra de associação HasMany com ambas as opções habilitadas seria::

    // No método initialize de uma Table.
    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    Configurando ``cascadeCallbacks`` para ``true``, resulta em exclusões
    consideravelmente mais lentas quando comparado com exclusões em massa. A
    opção cascadeCallbacks apenas deve ser ativada quando sua aplicação
    tem trabalho importante manipulado por event listeners.

Exclusões em Massa
------------------

.. php:method:: deleteMany(iterable $entities, array $options = [])

Se você tem um array de entidades que deseja excluir, você pode usar ``deleteMany()``
para excluí-las em uma única transação::

    // Obter um booleano indicando sucesso
    $success = $this->Articles->deleteMany($entities);

    // Lançará uma PersistenceFailedException se qualquer entidade não puder ser excluída.
    $this->Articles->deleteManyOrFail($entities);

As ``$options`` para esses métodos são as mesmas que ``delete()``. Excluir
registros com estes métodos **irá** disparar eventos.

.. php:method:: deleteAll($conditions)

Pode haver momentos em que excluir linhas uma por uma não é eficiente ou útil.
Nesses casos, é mais performático usar uma exclusão em massa para remover várias
linhas de uma vez::

    // Exclui todos os spam
    public function destroySpam()
    {
        return $this->deleteAll(['is_spam' => true]);
    }

Uma exclusão em massa será considerada bem-sucedida se 1 ou mais linhas forem
excluídas. A função retorna o número de registros excluídos como um inteiro.

.. warning::

    deleteAll *não* dispara os eventos beforeDelete/afterDelete.
    Se você precisa de callbacks disparados, primeiro carregue as entidades com ``find()``
    e exclua-as em um loop.

Exclusões Estritas
------------------

.. php:method:: deleteOrFail(EntityInterface $entity, array $options = [])

Usar esse método lançará uma
:php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException` se:

* a entidade é nova
* a entidade não tem valor de chave primária
* as verificações das regras da aplicação falharam
* a exclusão foi interrompida por um callback.

Se você deseja rastrear a entidade que falhou ao excluir, você pode usar o método
:php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()`::

        try {
            $table->deleteOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

Como isso executa internamente uma chamada ao :php:meth:`Cake\\ORM\\Table::delete()`, todos
os eventos de exclusão correspondentes serão disparados.
