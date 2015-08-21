Métodos e Propriedades Adicionais (Additional Methods and Properties)
#####################################################################

Enquanto as funções do modelo (model) do CakePHP's levam você onde você precisa, não esqueça que as classes modelos são apenas: classes que permitem a você escrever seus próprios métodos ou definir suas próprias propriedades.

Qualquer operação que manipula o salvamento ou busca dos dados são melhores definidas na sua classe modelo (model). Costumamos nos referenciar a este conceito como modelagem gorda.

::

    class Example extends AppModel {
        public function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day)' .
                ' and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

O método ``getRecent()`` agora pode ser usado no seu respectivo controller.

::

    $recent = $this->Example->getRecent();

:php:meth:`Model::associations()`
=================================

Buscar associações::

    $result = $this->Example->associations();
    // $result equals array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

Builds the query array that is used by the data source to generate the query to
fetch the data.

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

Desconstrói um tipo complexo de data (array ou objeto) em um campo de valor unico.

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

Escapes the field name and prepends the model name. Escaping is done according
to the current database driver's rules.

:php:meth:`Model::exists($id)`
==============================

Retorna true se é encontrado um registro com o ID informado.

Se não é informado um ID então é chamado :php:meth:`Model::getID()` para obter o ID atual para verificação, e então executar ``Model::find('count')`` na fonte de dados configurada no momento para verificar a existência do registro no armazenamento persistente

.. note ::

    Parameter $id was added in 2.1. Prior to that it does not take any parameter.

::

    $this->Example->id = 9;
    if ($this->Example->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

Retorna o número de linhas afetada pela última query.

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

Busca todos os modelos (models) ao qual este modelo (model) é associado.

:php:meth:`Model::getColumnType(string $column)`
================================================

Retorna o tipo de uma coluna no modelo (model).

:php:meth:`Model::getColumnTypes()`
===================================

Retorna um array de nome de campos e tipos de colunas associados.

:php:meth:`Model::getID(integer $list = 0)`
===========================================

Retorna o ID do registro atual.

:php:meth:`Model::getInsertID()`
================================

Retorna o ID do último registro que este modelo (model) inseriu.

:php:meth:`Model::getLastInsertID()`
====================================

Alias to ``getInsertID()``.


.. meta::
    :title lang=pt: Métodos e Propriedades Adicionais
    :keywords lang=pt: modelagem de classes,metodos do model,classe modelo,interval,array