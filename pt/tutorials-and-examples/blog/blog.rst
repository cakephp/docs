Tutorial de Blog
################

Este tutorial irá orientá-lo através da criação de um aplicativo simples de blog.
Estaremos instalando o CakePHP, criando um banco de dados e gerando a lógica de
aplicação capaz de listar, adicionar, editar e apagar posts.

Aqui está o que você vai precisar:

#. Um servidor web rodando. Vamos supor que você está usando o Apache,
   embora as instruções para usar outros servidores sejam muito semelhantes.
   Poderíamos ter que brincar um pouco com a configuração do servidor, mas a
   maioria das pessoas pode ter o CakePHP instalado e funcionando sem qualquer
   trabalho extra. Certifique-se de que você tem o PHP 5.4.16 ou superior,
   e que as extensões ``mbstring`` e ``intl`` estão habilitadas no PHP.

#. Um servidor de banco de dados. Nós vamos usar o servidor MySQL neste
   tutorial. Você precisa saber o suficiente sobre SQL para criar um banco de
   dados: O CakePHP vai tomar as rédeas a partir daí. Por nós estarmos
   usando o MySQL, também certifique-se que você tem a extensão ``pdo_mysql`
   habilitada no PHP.

#. Conhecimento básico sobre PHP.

Vamos começar!

Instalação do CakePHP
=====================

A maneira mais fácil de instalar o CakePHP é usando Composer, um gerenciador
de dependências para o PHP. É uma forma simples de instalar o CakePHP a
partir de seu terminal ou prompt de comando. Primeiro, você precisa baixar e
instalar o Composer. Se você tiver instalada a extensão cURL do PHP, execute
o seguinte comando::

    curl -s https://getcomposer.org/installer | php

Ao invés disso, você também pode baixar o arquivo ``composer.phar`` do
`site <https://getcomposer.org/download/>`_ oficial.

Em seguida, basta digitar a seguinte linha no seu terminal a partir do diretório
onde se localiza o arquivo ``composer.phar`` para instalar o esqueleto de
aplicações do CakePHP no diretório ``bookmarker``. ::

    php composer.phar create-project --prefer-dist -s dev cakephp/app bookmarker

A vantagem de usar Composer é que ele irá completar automaticamente um conjunto
importante de tarefas, como configurar as permissões de arquivo e criar a sua
``config/app.php``.

Há outras maneiras de instalar o CakePHP. Se você não puder ou não quiser usar
Composer, veja a seção :doc:`/installation`.

Independentemente de como você baixou o CakePHP, uma vez que sua instalação
for concluída, a estrutura dos diretórios deve ficar parecida com o seguinte::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Agora pode ser um bom momento para aprender sobre como a estrutura de diretórios
do CakePHP funciona: Confira a seção :doc:`/intro/cakephp-folder-structure`.

Directory Permissions on tmp and logs
=====================================

Os diretórios ``tmp`` e ``logs`` precisa ter permissões adequadas para serem
escritos pelo seu servidor web. Se você usou Composer para a instalação, ele deve
ter feito isso para você e confirmado com uma mensagem "Permissions set on <folder>".
Se você ao invés disso, recebeu uma mensagem de erro ou se quiser fazê-lo manualmente,
a melhor forma seria descobrir por qual usuário o seu servidor web é executado
(``<?= `whoami`; ?>``) e alterar a propriedade desses dois diretórios para este usuário.
O comando final a ser executado (em \*nix) poderia ser algo como::

    chown -R www-data tmp
    chown -R www-data logs

Se por alguma razão o CakePHP não puder escrever nesses diretórios, você será
informado por uma advertência enquanto não estiver em modo de produção.

Embora não seja recomendado, se você é incapaz de definir as permissões
compatíveis com o seu servidor web, você pode simplesmente definir
permissões de gravação diretamente no diretório, executando::

    chmod 777 -R tmp
    chmod 777 -R logs

Criando o banco de dados
========================

Em seguida, vamos criar o banco de dados para a nossa aplicação. Se você
ainda não tiver feito isso, crie um banco de dados vazio para uso
nesse tutorial, com um nome de sua escolha, por exemplo, ``cake_blog``.
Você pode executar o seguinte SQL para criar as tabelas necessárias::

    /* Primeiro, criamos nossa tabela articles: */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Então inserimos articles para teste: */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

Os nomes de tabelas e colunas que usamos não foram arbitrárias. Usando
:doc:`convenções de nomenclatura </intro/conventions>` do CakePHP, podemos
alavancar o desenvolvimento e evitar ter de configurar o framework. O CakePHP
é flexível o suficiente para acomodar até mesmo esquemas de banco de dados
legados inconsistentes, mas aderir às convenções vai lhe poupar tempo.

Configurando o banco de dados
=============================

Em seguida, vamos dizer ao CakePHP onde o nosso banco de dados está como se
conectar a ele. Para muitos, esta será a primeira e última vez que você vai
precisar configurar qualquer coisa.

A configuração é bem simples: basta alterar os valores do array
``Datasources.default`` no arquivo ``config/app.php`` pelos que se
aplicam à sua configuração. A amostra completa da gama de configurações pode
ser algo como o seguinte::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

Depois de salvar o seu arquivo ``config/app.php``, você deve notar que a
mensagem 'CakePHP is able to connect to the database' tem uma marca de
verificação.

.. note::

    Uma cópia do arquivo de configuração padrão do CakePHP é encontrado em
    ``config/app.default.php``.

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes.

The security salt is used for generating hashes. If you used Composer this too is taken
care of for you during the install. Else you'd need to change the default salt value
by editing ``config/app.php``. It doesn't matter much what the new value is, as long as
it's not easily guessed::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],


A Note on mod\_rewrite
======================

Occasionally new users will run into mod\_rewrite issues. For example
if the CakePHP welcome page looks a little funny (no images or CSS styles).
This probably means mod\_rewrite is not functioning on your system. Please refer
to the :ref:`url-rewriting` section to help resolve any issues you are having.

Now continue to :doc:`/tutorials-and-examples/blog/part-two` to start building
your first CakePHP application.

.. meta::
    :title lang=en: Blog Tutorial
    :keywords lang=en: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
