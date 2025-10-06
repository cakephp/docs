Acesso ao Banco de Dados & ORM
###############################

No CakePHP, o trabalho com dados através do banco de dados é realizado com dois tipos primários de objetos:

- **Repositórios** ou **objetos de tabela** fornecem acesso a coleções de dados.
  Eles permitem que você salve novos registros, modifique/exclua os existentes, defina
  relações e execute operações em massa.
- **Entidades** representam registros individuais e permitem que você defina comportamento e
  funcionalidade no nível de linha/registro.

Essas duas classes geralmente são responsáveis por gerenciar quase tudo
que acontece em relação aos seus dados, sua validade, interações e evolução
do fluxo de informações no seu domínio de trabalho.

O ORM integrado do CakePHP é especializado em bancos de dados relacionais, mas pode ser estendido
para suportar fontes de dados alternativas.

O ORM do CakePHP empresta ideias e conceitos tanto do ActiveRecord quanto do Datamapper
patterns. Ele visa criar uma implementação híbrida que combina aspectos de
ambos os padrões para criar um ORM rápido e simples de usar.

Antes de começarmos a explorar o ORM, certifique-se de :ref:`configurar suas
conexões de banco de dados <database-configuration>`.

Exemplo Rápido
==============

Para começar você não precisa escrever nenhum código. Se você seguiu as
:ref:`convenções do CakePHP para suas tabelas de banco de dados
<model-and-database-conventions>` você pode simplesmente começar a usar o ORM. Por exemplo,
se quiséssemos carregar alguns dados de nossa tabela ``articles`` começaríamos
criando nossa classe de tabela ``Articles``. Crie
**src/Model/Table/ArticlesTable.php** com o seguinte código::

    <?php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Então, em um controller ou comando, podemos fazer com que o CakePHP crie uma instância para nós::

    public function someMethod()
    {
        $resultset = $this->fetchTable('Articles')->find()->all();

        foreach ($resultset as $row) {
            echo $row->title;
        }
    }

Em outros contextos, você pode usar o ``LocatorAwareTrait`` que adiciona métodos de acesso para tabelas ORM::

    use Cake\ORM\Locator\LocatorAwareTrait;

    public function someMethod()
    {
        $articles = $this->fetchTable('Articles');
        // mais código.
    }

Dentro de um método estático você pode usar o :php:class:`~Cake\\Datasource\\FactoryLocator`
para obter o localizador de tabela::

    $articles = TableRegistry::getTableLocator()->get('Articles');

Classes de tabela representam **coleções** de **entidades**. Em seguida, vamos criar uma
classe de entidade para nossos Articles. Classes de entidade permitem que você defina métodos de acesso e
mutador, defina lógica personalizada para registros individuais e muito mais. Vamos
começar adicionando o seguinte em **src/Model/Entity/Article.php** após a
tag de abertura ``<?php``::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Entidades usam a versão singular CamelCase do nome da tabela como seu nome de classe
por padrão. Agora que criamos nossa classe de entidade, quando
carregamos entidades do banco de dados, obteremos instâncias de nossa nova classe Article::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articles = $this->fetchTable('Articles');
    $resultset = $articles->find()->all();

    foreach ($resultset as $row) {
        // Cada linha agora é uma instância de nossa classe Article.
        echo $row->title;
    }

O CakePHP usa convenções de nomenclatura para vincular as classes Table e Entity. Se
você precisar personalizar qual entidade uma tabela usa, pode usar o
método ``entityClass()`` para definir um nome de classe específico.

Consulte os capítulos sobre :doc:`/orm/table-objects` e :doc:`/orm/entities` para mais
informações sobre como usar objetos de tabela e entidades em sua aplicação.

Mais Informações
================

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/associations
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/behaviors
    orm/schema-system
    console-commands/schema-cache
