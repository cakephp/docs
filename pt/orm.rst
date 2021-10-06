Models (Modelos)
################

Models (Modelos) são as classes que servem como camada de negócio na sua
aplicação. Isso significa que eles devem ser responsáveis pela gestão de quase
tudo o que acontece em relação a seus dados, sua validade, interações e evolução
do fluxo de trabalho de informação no domínio do trabalho.

No CakePHP seu modelo de domínio da aplicação é dividido em 2 tipos de objetos
principais. Os primeiros são **repositories (repositórios)** ou **table objects
(objetos de tabela)**. Estes objetos fornecem acesso a coleções de dados. Eles
permitem a você salvar novos registros, modificar/deletar os que já existem,
definir relacionamentos, e executar operações em massa. O segundo tipo de
objetos são as **entities (entidades)**. Entities representam registros
individuais e permitem a você definir comportamento em nível de linha/registro
e funcionalidades.

O ORM (MOR - Mapeamento Objeto-Relacional) nativo do CakePHP especializa-se em
banco de dados relacionais, mas pode ser extendido para suportar fontes de dados
alternativas.

O ORM do Cakephp toma emprestadas ideias e conceitos dos padrões ActiveRecord e
Datamapper. Isso permite criar uma implementação híbrida que combina aspectos de
ambos padrões para criar uma ORM rápida e simples de utilizar.

Antes de nós começarmos explorando o ORM, tenha certeza que você
:ref:`configure your database connections <database-configuration>`.

Exemplo rápido
==============

Para começar você não precisa escrever código. Se você seguiu as convenções do
CakePHP para suas tabelas de banco de dados, você pode simplesmente começar a
usar o ORM. Por exemplo, se quiséssemos carregar alguns dados da nossa tabela
``articles`` poderíamos fazer::

    use Cake\ORM\TableRegistry;

    // Prior to 3.6 use TableRegistry::get('Articles')
    $articles = TableRegistry::getTableLocator()->get('Articles');
    $query = $articles->find();
    foreach ($query as $row) {
        echo $row->title;
    }

Nota-se que nós não temos que criar qualquer código ou definir qualquer
configuração. As convenções do CakePHP nos permitem pular alguns códigos clichê,
e permitir que o framework insera classes básicas enquanto sua aplicação não
criou uma classe concreta. Se quiséssemos customizar nossa classe ArticlesTable
adicionando algumas associações ou definir alguns métodos adicionais, deveriamos
acrescentar o seguinte a **src/Model/Table/ArticlesTable.php** após a tag de
abertura ``<?php``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

Classes de tabela usam a versão CamelCased do nome da tabela com o sufixo
``Table`` como o nome da classe. Uma vez que sua classe fora criada, você recebe
uma referência para esta utilizando o :php:class:`~Cake\\ORM\\TableRegistry`
como antes::

    use Cake\ORM\TableRegistry;

    // Agora $articles é uma instância de nossa classe ArticlesTable.
    // Prior to 3.6 use TableRegistry::get('Articles')
    $articles = TableRegistry::getTableLocator()->get('Articles');

Agora que temos uma classe de tabela concreta, nós provavelmente vamos querer
usar uma classe de entidade concreta. As classes de entidade permitem definir
métodos de acesso, métodos mutantes, definir lógica personalizada para os
registros individuais e muito mais. Vamos começar adicionando o seguinte para
**src/Model/Entity/Article.php** após a tag de abertura ``<?php``::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

    }

Entidades usam a versão singular CamelCase do nome da tabela como seu nome de
classe por padrão. Agora que nós criamos nossa classe de entidade, quando
carregarmos entidades do nosso banco de dados, nós iremos receber instâncias da
nossa nova classe Article::

    use Cake\ORM\TableRegistry;

    // Agora uma instância de ArticlesTable.
    // Prior to 3.6 use TableRegistry::get('Articles')
    $articles = TableRegistry::getTableLocator()->get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
        // Cada linha é agora uma instância de nossa classe Article.
        echo $row->title;
    }

CakePHP utiliza convenções de nomenclatura para ligar as classes de tabela e
entidade juntas. Se você precisar customizar qual entidade uma tabela utiliza,
você pode usar o método ``entityClass()`` para definir nomes de classe
específicos.

Veja os capítulos em :doc:`/orm/table-objects` e :doc:`/orm/entities` para mais
informações sobre como usar objetos de tabela e entidades em sua aplicação.

Mais informação
===============

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/associations
    orm/behaviors
    orm/schema-system
    console-and-shells/orm-cache
