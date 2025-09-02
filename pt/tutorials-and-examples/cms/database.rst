Tutorial - Gerenciador de Conteúdo - Criando o Banco de Dados
#############################################################

Agora que temos o CakePHP instalado, vamos configurar o banco de dados para nossa
aplicação :abbr:`CMS (Sistema Gerenciador de Conteúdo)`. Se você ainda não tiver
feito, crie um banco de dados vazio para usar neste tutorial, com um nome de sua
escolha, ex. ``cake_cms``.
Se você está usando MySQL/MariaDB, você pode executar o SQL abaixo para criar
as tabelas necessárias:

.. code-block:: SQL

    CREATE DATABASE cake_cms;

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
    // config/app_local.php
    return [
        // Mais configurações acima.
        'Datasources' => [
            'default' => [
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'url' => env('DATABASE_URL', null),
            ],
        ],
        // Mais configurações abaixo.
    ];


Uma vez que você tenha salvo seu arquivo **config/app_local.php**,
você deve ver a mensagem 'CakePHP is able to connect to the database'
com o chapéu de chefe na cor verde.

.. note::

    O arquivo **config/app_local.php** é uma substituição local do arquivo **config/app.php**
    usado para configurar seu ambiente de desenvolvimento rapidamente.

Migrations
==========

As instruções SQL para criar as tabelas deste tutorial também podem ser geradas
usando o plugin Migrations. As migrações oferecem uma maneira independente de plataforma de
executar consultas, de modo que as diferenças sutis entre MySQL, PostgreSQL, SQLite, etc.
não se tornem obstáculos.

.. code-block:: console

    bin/cake bake migration CreateUsers email:string password:string created modified
    bin/cake bake migration CreateArticles user_id:integer title:string slug:string[191]:unique body:text published:boolean created modified
    bin/cake bake migration CreateTags title:string[191]:unique created modified
    bin/cake bake migration CreateArticlesTags article_id:integer:primary tag_id:integer:primary created modified

.. note::
    Alguns ajustes no código gerado podem ser necessários. Por exemplo, a
    chave primária composta em ``articles_tags`` será definida para incrementar automaticamente
    ambas as colunas::

        $table->addColumn('article_id', 'integer', [
            'autoIncrement' => true,
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->addColumn('tag_id', 'integer', [
            'autoIncrement' => true,
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);

    Remova essas linhas para evitar problemas com chaves estrangeiras. Assim que os ajustes estiverem
    concluídos::

        bin/cake migrations migrate

Da mesma forma, os registros de dados iniciais podem ser feitos com seeds.

.. code-block:: console

    bin/cake bake seed Users
    bin/cake bake seed Articles

Preencha os dados iniciais acima nas novas classes ``UsersSeed`` e ``ArticlesSeed``
e então::

    bin/cake migrations seed

Saiba mais sobre migrações de construção e semeadura de dados: `Migrations
<https://book.cakephp.org/migrations/4/>`__

Com o banco de dados construído, agora podemos construir :doc:`Models
</tutorials-and-examples/cms/articles-model>`.
