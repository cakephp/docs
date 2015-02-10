Construindo um blog
###################

Este tutorial irá orientá-lo na criação de um simples aplicativo de blog. 
Estaremos instalando CakePHP, criando um banco de dados e criando a lógica de aplicação suficiente para listar, 
adicionar, editar e apagar posts.

Aqui está o que você vai precisar:

#. Um servidor web rodando. Vamos supor que você está usando o Apache, 
   embora as instruções para usar outros servidores sejam muito semelhantes. 
   Poderíamos ter que brincar um pouco com a configuração do servidor, 
   mas a maioria das pessoas pode ter o CakePHP instalado e funcionando sem 
   qualquer configuração em tudo. 
   Certifique-se de que você tem o PHP 5.4.16 ou superior, e que os ``mbstring`` e ``intl`` 
   extensões são ativadas no PHP.
#. Um servidor de banco de dados. Nós vamos estar usando servidor MySQL neste tutorial. 
   Você precisa saber o suficiente sobre SQL para criar um banco de dados: CakePHP 
   vai tomar as rédeas a partir daí. Desde que nós estamos usando o MySQL, 
   também certificar-se de que você ``pdo_mysql`` habilitado no PHP.
#. Conhecimento básico de PHP.

Vamos começar!

Instalando o CakePHP
====================

A maneira mais fácil de instalar o CakePHP é usar o Composer. Composer é uma forma simples 
de instalar CakePHP de seu terminal ou linha de comando. 
Primeiro, você precisa baixar e instalar o Composer, se você não tiver feito isso. 
Se você tiver instalado cURL, é tão fácil quanto executar o seguinte::

    curl -s https://getcomposer.org/installer | php

Ou, você pode baixar ``composer.phar`` diretamente do 
`site Composer <https://getcomposer.org/download/>`_.

Em seguida, basta digitar a seguinte linha no seu terminal a partir 
do seu diretório de instalação para instalar o esqueleto de aplicação 
CakePHP no diretório [app_name]. ::

    php composer.phar create-project --prefer-dist -s dev cakephp/app [app_name]

A vantagem de usar Composer é que ele irá completar automaticamente um conjunto 
importante de tarefas, como configurar as permissões de arquivo correto e 
criar o arquivo config/app.php para você.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Há outras maneiras de instalar o CakePHP. Se você não puder ou não quiser usar Composer, 
veja a sessão de :doc:`/installation`.

Independentemente de como você baixou e instalou CakePHP, uma vez que seu setup for concluído, 
a configuração do diretório deve ficar parecido com o seguinte::

    /cake_install
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

Now might be a good time to learn a bit about how CakePHP's directory
structure works: check out the
:doc:`/intro/cakephp-folder-structure` section.

Agora pode ser um bom momento para aprender um pouco sobre como a estrutura de 
diretórios do CakePHP funciona: confira a sessão :doc:`/intro/cakephp-folder-structure`.

Directory Permissions on tmp and logs
=====================================

The ``tmp`` and ``logs`` directories need to have proper permissions to be writable
by your webserver. If you used Composer for the install, this should have been done
for you and confirmed with a "Permissions set on <folder>" message. If you instead
got an error message or want to do it manually, the best way would be to find out
what user your webserver runs as (``<?= `whoami`; ?>``) and change the ownership of
these two directories to that user. The final command you run (in \*nix)
might look something like this::

    chown -R www-data tmp
    chown -R www-data logs

If for some reason CakePHP can't write to these directories, you'll be
informed by a warning while not in production mode.

While not recommended, if you are unable to set the permissions to the same as
your webserver, you can simply set write permissions on the folder by running a
command such as::

    chmod 777 -R tmp
    chmod 777 -R logs

Creating the Blog Database
==========================

Next, let's set up the underlying MySQL database for our blog. If you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice, e.g. ``cake_blog``. Right now,
we'll just create a single table to store our articles. We'll also throw
in a few articles to use for testing purposes. Execute the following
SQL statements into your database::

    /* First, create our articles table: */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Then insert some articles for testing: */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow CakePHP's database naming conventions, and CakePHP's class naming
conventions (both outlined in
:doc:`/intro/conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
CakePHP is flexible enough to accommodate even inconsistent legacy
database schemas, but adhering to the conventions will save you time.

Check out :doc:`/intro/conventions` for more
information, but it's suffice to say that naming our table 'articles'
automatically hooks it to our Articles model, and having fields called
'modified' and 'created' will be automatically managed by CakePHP.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it.
For many, this will be the first and last time you will need to configure
anything.

The configuration should be pretty straightforward: just replace the
values in the ``Datasources.default`` array in the ``config/app.php`` file
with those that apply to your setup. A sample completed configuration
array might look something like the following::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // More configuration below.
    ];

Once you've saved your ``config/app.php`` file, you should be able to open
your browser and see the CakePHP welcome page. It should also tell
you that your database connection file was found, and that CakePHP
can successfully connect to the database.

.. note::

    A copy of CakePHP's default configuration file is found in
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
    :title lang=pt: Blog Tutorial
    :keywords lang=pt: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
