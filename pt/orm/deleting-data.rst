Excluindo Dados
###############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

.. php:method:: delete(Entity $entity, $options = [])

Depois que você carregou uma entidade, você pode excluir ela chamando o
o método delete da tabela de origem::

    // Num a controller.
    $entity = $this->Articles->get(2);
    $result = $this->Articles->delete($entity);

Ao excluir entidades algumas coisas acontecem:

1. As :ref:`delete rules <application-rules>` serão aplicadas. Se as regras
   falharem, a exclusão será impedida.
2. O evento ``Model.beforeDelete`` é disparado. Se esse evento for interrompido, a
   exclusão será cancelada e o resultado do evento será retornado.
3. A entidade será excluída.
4. Todas as associações dependentes serão excluídas. Se as associações estão
   sendo excluídas como entidades, eventos adicionais serão disparados.
5. Qualquer registro da tabela de ligação para associação BelongsToMany serão
   removidos.
6. O evento ``Model.afterDelete`` será disparado.

Por padrão, todas as exclusões acontecem dentro de uma transação. Você pode
desativar a transação com a opção atomic::

    $result = $this->Articles->delete($entity, ['atomic' => false]);

Exclusão em Cascata
-------------------

Ao excluir entidades, os dados associados também podem ser excluídos. Se suas
associações HasOne e HasMany estão configurados como ``dependent``, as operações
de exclusão serão 'cascate' para essas entidades também. Por padrão entidades
em tabelas associadas são removidas usando :php:meth:`Cake\\ORM\\Table::deleteAll()`.
Você pode optar que o ORM carregue as entidades relacionadas, para então
excluir individualmente, definindo a opção ``cascadeCallbacks`` como ``true``::

    // No método initialize de alguma modelo Table
    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    Configurando ``cascadeCallbacks`` para ``true``, resulta em exclusões
    consideravelmente mais lentos quando comparado com exclusão em masa. A
    opção cascadeCallbacks apenas deve ser ativada quando sua aplicação
    tem trabalho importante manipulado por event listeners.

Exclusão em Massa
-----------------

.. php:method:: deleteAll($conditions)

Pode ter momentos em que excluir linhas individualmente não é eficiente ou útil.
Nesses casos, é mais eficiente usar uma exclusão em massa para remover várias
linhas de uma vez só::

    // Exclui todos oss spam
    function destroySpam()
    {
        return $this->deleteAll(['is_spam' => true]);
    }

Uma exclusão em massa será considerada bem-sucedida se uma ou mais linhas forem
excluídas.

.. warning::

    deleteAll *não* dispara os eventos beforeDelete/afterDelete. Se você precisa
    deles, você precisa, primeiro carregar uma coleção de registros e então
    excluí-las.

Exclusões Estrita
-----------------

.. php:method:: deleteOrFail($entity, $options = [])

Usar esse método lançará uma
:php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException` se:

* a entidade é nova
* a entidade não tem valor de chave primária
* as verificações das regras da aplicação falharam
* a exclusão foi interrompida por um callback.

Se você deseja rastrear a entidade que falhou ao salvar, você pode usar o método
:php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()`::

        try {
            $table->deleteOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

Como isso executa internamente uma chamada ao :php:meth:`Cake\\ORM\\Table::delete()`, todos eventos de exclusão
correspondentes serão disparados.

.. versionadded:: 3.4.1
