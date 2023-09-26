Tutorial - Gerenciador de Conteúdo - Criando o Banco de Dados
#############################################################

Agora que temos o CakePHP instalado, vamos configurar o banco de dados para nossa
aplicação :abbr:`CMS (Sistema Gerenciador de Conteúdo)`. Se você ainda não tiver
feito, crie um banco de dados vazio para usar neste tutorial, com um nome de sua
escolha, ex. ``cake_cms``.
Se você está usando MySQL/MariaDB, você pode executar o SQL abaixo para criar
as tabelas necessárias:

.. code-block:: SQL

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, NOW(), NOW());

Se você está usando PostgreSQL, conecte ao banco de dados ``cake_cms`` e execute
o SQL abaixo:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created TIMESTAMP,
        modified TIMESTAMP
    );

    CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (slug),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        title VARCHAR(191),
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (title)
    );

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id),
        FOREIGN KEY (article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', TRUE, NOW(), NOW());


Você deve ter reparado que a tabela ``articles_tags`` usa uma chave primária
composta. CakePHP suporta chaves primária compostas praticamente em todo lugar
permitindo que você tenha esquemas que não dependem de uma coluna adicional ``id``.

O nome das tabelas e colunas que nós utilizamos não são arbitrárias. Ao
utilizar a :doc:`convenção de nomes </intro/conventions>`, nós aproveitamos
melhor o CakePHP e evitamos a necessidade de configurar o framewok. Apesar do
CakePHP ser flexível suficiente para atender praticamente todo esquema de
banco de dados, aderindo as convenções você economizará seu tempo aproveitando
a convenção baseada em valores padrões que o CakePHP oferece.

.. note::

    Os nomes das tabelas e colunas estão em inglês para que as convenções funcionem
    sem nenhuma configuração extra, mas é possível :doc:`configurar as inflexões
    </core-libraries/inflector>` do CakePHP para reconhecer as convenções em português.

Configuração do Banco de Dados
==============================

A seguir vamos dizer ao CakePHP onde nosso banco de dados está e como se conectar a ele.
Substitua os valores no array ``Datasources.default`` dentro do arquivo **config/app_local.php**
pelos que se aplicam a sua instalação. Um exemplo completo de como deve ficar o array de
configuração segue abaixo::

    <?php
    return [
        // Mais configurações acima.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                // Substitua Mysql por Postgres se você estiver usando PostgreSQL
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'sua_senha',
                'database' => 'cake_cms',
                // Comente a linha abaixo se estiver usando PostgreSQL
                'encoding' => 'utf8mb4',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // Mais configurações abaixo.
    ];


Uma vez que você tenha salvo seu arquivo **config/app_local.php**,
você deve ver a mensagem 'CakePHP is able to connect to the database'
com o chapéu de chefe na cor verde.

.. note::

    Se você não tiver o arquivo **config/app_local.php** na sua aplicação,
    você deve configurar sua conexão no arquivo **config/app.php**.


Criando nosso Primeiro Modelo
=============================

Modelos são o coração de uma aplicação CakePHP. Ele permite a nós ler e
escrever nossos dados. Eles possibilitam a criação de relacionamentos
entre nossos dados, validar dados, e aplicar regras da aplicação. Modelos
formam a fundação necessária para construir nossas ações de controles e
templates.

Modelos no CakePHP são compostos dos objetos ``Table`` (Tabela) e ``Entity``
(Entidade). Objetos ``Table`` fornecem acesso a coleção de entidades armazenadas
em uma tabela específica. Elas ficam salvas em **src/Model/Table**. O arquivo
que iremos criar ficará salvo em **src/Model/Table/ArticlesTable.php**. O arquivo
completo deve se parecer com isso::

    <?php
    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Timestamp');
        }
    }

Nós vinculamos o behavior :doc:`/orm/behaviors/timestamp` que irá preencher
automaticamente as colunas ``created`` (criado) e ``modified`` (modificado)
de nossa tabela.
Ao nomear nosso objeto Table ``ArticlesTable``, o CakePHP se baseia nas
convenções de nomes para saber que nosso modelo utiliza a tabela ``articles``.
O CakePHP também usa as convenções para saber que a coluna ``id`` é a chave
primária da tabela.

.. note::

    O CakePHP criará dinamicamente um objeto de modelo para você se ele
    não conseguir encontrar o arquivo correspondente em **src/Model/Table**.
    Isso significa que se você acidentalmente nomear errado o arquivo (ex.
    articlestable.php ou ArticleTable.php), o CakePHP não reconhecerá nenhuma
    de suas configurações e utilizará o modelo dinâmicamente gerado no lugar.

Nós também vamos criar uma classe Entity para nossa Articles. Entidades
representam um único registro do nosso banco de dados, e implementam
comportamento a nível de linha para nossos dados. Nossa entidade será
salva em **src/Model/Entity/Article.php**. O arquivo complete deve parecer
com este::

    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected array $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

Nossa entidade está bem curta agora, e nós iremos configurar apenas a
propriedade ``_accessible`` que controla quais propriedades podem ser
modificadas com :ref:`entities-mass-assignment`.

Nós não podemos fazer muito com nossos modelos agora, então a seguir
iremos criar nossos :doc:`Controller e Template
</tutorials-and-examples/cms/articles-controller>` que nos permitirá
interagir com nosso modelo.
