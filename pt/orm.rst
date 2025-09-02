Acesso a Banco de Dados e ORM
#############################

No CakePHP, o trabalho com dados por meio do banco de dados é feito com dois tipos principais de objetos:

- **Repositórios** ou **objetos de tabela** fornecem acesso a coleções de dados.
  Eles permitem salvar novos registros, modificar/excluir os existentes, definir
  relações e executar operações em massa.
- **Entidades** representam registros individuais e permitem que você defina o comportamento e a funcionalidade
  em nível de linha/registro.

Essas duas classes geralmente são responsáveis ​​por gerenciar quase tudo
que acontece em relação aos seus dados, sua validade, interações e evolução
do fluxo de trabalho de informações em seu domínio de trabalho.

O ORM integrado do CakePHP é especializado em bancos de dados relacionais, mas pode ser estendido
para oferecer suporte a fontes de dados alternativas.

O ORM CakePHP utiliza ideias e conceitos dos padrões ActiveRecord e Datamapper.
O objetivo é criar uma implementação híbrida que combine aspectos de
ambos os padrões para criar um ORM rápido e fácil de usar.

Antes de começarmos a explorar o ORM, certifique-se de :ref:`configurar suas
conexões de banco de dados <database-configuration>`.

Exemplo rápido
==============

Para começar, você não precisa escrever nenhum código. Se você seguiu as
:ref:`Convenções para Banco de Dados
<model-and-database-conventions>`, pode simplesmente começar a usar o ORM. Por exemplo,
se quiséssemos carregar alguns dados da nossa tabela ``articles``, começaríamos
criando nossa classe de tabela ``Articles``. Crie
**src/Model/Table/ArticlesTable.php** com o seguinte código::

    <?php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Então, em um controller ou command, podemos fazer com que o CakePHP crie uma instância para nós::

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

Dentro de um método estático, você pode usar :php:class:`~Cake\\Datasource\\FactoryLocator`
para obter o localizador da tabela::

    $articles = TableRegistry::getTableLocator()->get('Articles');

As classes de tabela representam **coleções** de **entidades**. Em seguida, vamos criar uma
classe de entidade para nossos Artigos. As classes de entidade permitem definir métodos de acesso e
mutadores, definir lógica personalizada para registros individuais e muito mais. Começaremos
adicionando o seguinte a **src/Model/Entity/Article.php** após a
tag de abertura ``<?php``::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

As entidades usam a versão singular CamelCase do nome da tabela como nome
de classe por padrão. Agora que criamos nossa classe de entidade, quando
carregarmos entidades do banco de dados, obteremos instâncias da nossa nova classe Article::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articles = $this->fetchTable('Articles');
    $resultset = $articles->find()->all();

    foreach ($resultset as $row) {
        // Each row is now an instance of our Article class.
        echo $row->title;
    }

O CakePHP usa convenções de nomenclatura para vincular as classes Table e Entity. Se
você precisar personalizar qual entidade uma tabela usa, pode usar o método
``entityClass()`` para definir um nome de classe específico.

Consulte os capítulos em :doc:`/orm/table-objects` e :doc:`/orm/entities` para obter mais
informações sobre como usar objetos de tabela e entidades em seu aplicativo.

Mais informações
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
