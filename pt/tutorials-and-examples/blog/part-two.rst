Tutorial - Criando um Blog - Parte 2
####################################

Criando o Article Model
=======================

Ao criar um model (modelo) no CakePHP, nós teremos a fundação necessária para
interagirmos com o banco de dados e executar operações posteriormente.

Os arquivos de classes correspondentes aos models no CakePHP estão divididos
entre os objetos ``Table`` e ``Entity``. Objetos ``Table`` provêm acesso à
coleção de entities (entidades) armazenada em uma tabela específica e são
alocados em **src/Model/Table**.

O arquivo que criaremos ficará salvo em **src/Model/Table/ArticlesTable.php** e
deve se parecer com isto::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Convenções de nomenclatura são muito importantes no CakePHP. Ao nomear nosso
objeto como ``ArticlesTable``, o CakePHP automaticamente infere que o mesmo
utilize o ``ArticlesController`` e seja atado à tabela ``articles``.

.. note::

    O CakePHP criará automaticamente um objeto model se não puder encontrar um
    arquivo correspondente em **src/Model/Table**. Se você nomear incorretamente
    seu arquivo (i.e. artciclestable.php ou ArticleTable.php), o CakePHP não
    reconhecerá suas definições e usará o model gerado como alternativa.

Para mais informações sobre models, como callbacks e validação, visite o
capítulo :doc:`/orm` do manual.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake console do CakePHP para criar o model
    ``ArticlesTable``::

        bin/cake bake model Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.