Migrations
##########

Migrations é um plugin suportado pela equipe oficial do CakePHP que ajuda você a
fazer mudanças no **schema** do banco de dados utilizando arquivos PHP,
que podem ser versionados utilizando um sistema de controle de versão.

Ele permite que você atualize suas tabelas ao longo do tempo. Ao invés de
escrever modificações de **schema** via SQL, este plugin permite que você
utilize um conjunto intuitivo de métodos para fazer mudanças no seu banco de
dados.

Esse plugin é um **wrapper** para a biblioteca `Phinx <https://phinx.org/>`_.

Instalação
==========

Por padrão o plugin é instalado junto com o esqueleto da aplicação.
Se você o removeu e quer reinstalá-lo, execute o comando a seguir a partir do
diretório **ROOT** da sua aplicação
(onde o arquivo composer.json está localizado)::

    $ php composer.phar require cakephp/migrations "@stable"

    // Or if composer is installed globally

    $ composer require cakephp/migrations "@stable"

Para usar o plugin você precisa carregá-lo no arquivo **config/bootstrap.php**
da sua aplicação. Você pode usar o
:ref:`shell de plugins do CakePHP <plugin-shell>` para carregar e descarregar
plugins do seu arquivo **config/bootstrap.php**::

    $ bin/cake plugin load Migrations

Ou você pode carregar o plugin editando seu arquivo **config/bootstrap.php** e
adicionando a linha::

    Plugin::load('Migrations');

Adicionalmente, você precisará configurar o banco de dados padrão da sua
aplicação, no arquivo **config/app.php** como explicado na seção
:ref:`Configuração de banco de dados <database-configuration>`.

Visão Geral
===========

Uma migração é basicamente um arquivo PHP que descreve as mudanças a
serem feitas no banco de dados. Um arquivo de migração pode criar ou excluir 
tabelas, adicionar ou remover colunas, criar índices e até mesmo inserir 
dados em seu banco de dados.

Aqui segue um exemplo de migração::

    <?php
    use Migrations\AbstractMigration;

    class CreateProducts extends AbstractMigration
    {
        /**
         * Change Method.
         *
         * More information on this method is available here:
         * http://docs.phinx.org/en/latest/migrations.html#the-change-method
         * @return void
         */
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('description', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Essa migração irá adicionar uma tabela chamada ``products`` ao banco de dados
com as seguintes colunas::

- ``id`` coluna do tipo ``integer`` como chave primária
- ``name`` coluna do tipo ``string``
- ``description`` coluna do tipo ``text``
- ``created`` coluna do tipo ``datetime``
- ``modified`` coluna do tipo ``datetime``

.. tip::

    A coluna de chave primária ``id`` será adicionada **implicitamente**.

.. note::

    Note que este arquivo descreve como o banco de dados deve ser **após** a
    aplicação da migração. Neste ponto, a tabela ``products``ainda não existe 
    no banco de dados, nós apenas criamos um arquivo que é capaz de criar a 
    tabela ``products`` com seus devidos campos ou excluir a tabela caso uma 
    operação rollback seja executada.

Com o arquivo criado na pasta **config/MIgrations**, você será capaz de executar 
o comando abaixo para executar as migrações no seu banco de dados::

    bin/cake migrations migrate

O comando seguinte irá executar um **rollback** na migração e irá excluir a
tabela recém criada::

    bin/cake migrations rollback

Criando migrations
==================

Arquivos de migração são armazeados no diretório **config/Migrations** da 
sua aplicação. O nome dos arquivos de migração têm como prefixo a data 
em que foram criados, no formato **YYYYMMDDHHMMSS_MigrationName.php**. Aqui
estão exemplos de arquivos de migração::

* 20160121163850_CreateProducts.php
* 20160210133047_AddRatingToProducts.php

A maneira mais fácil de criar um arquivo de migrações é usando o 
:doc:`/bake/usage` a linha de comando.

Por favor, leia a `documentação do Phinx <http://docs.phinx.org/en/latest/migrations.html>`
a fim de conhecer a lista completa dos métodos que você pode usar para escrever
os arquivos de migração.

.. note::

    Ao gerar as migrações através do ``bake`` você ainda pode alterá-las antes
    da sua execução, caso seja necessário.

Sintaxe
-------

A sintaxe do ``bake`` para a geração de migrações segue o formato abaixo::

    $ bin/cake bake migration CreateProducts name:string description:text created modified

Quando utilizar o ``bake`` para criar as migrações, você normalmente precisará
informar os seguintes dados::

  * o nome da migração que você irá gerar (``CreateProducts`` por exemplo)
  * as colunas da tabela que serão adicionadas ou removidas na migração 
  (``name:string description:text created modified`` no nosso caso)

Devido às convenções, nem todas as alterações de schema podem ser realizadas
através destes comandos.

Além disso, você pode criar um arquivo de migração vazio caso deseje ter um 
controle total do que precisa ser executado. Para isto, apenas omita a definição
das colunas::

    $ bin/cake migrations create MyCustomMigration

Nomenclatura de migrations
~~~~~~~~~~~~~~~~~~~~~~~~~~

A nomenclatura das migrações pode seguir qualquer um dos padrões apresentados a
seguir:

* (``/^(Create)(.*)/``) Cria a tabela especificada.
* (``/^(Drop)(.*)/``) Exclui a tabela especificada.
  Ignora campos especificados nos argumentos
* (``/^(Add).*(?:To)(.*)/``) Adiciona campos a 
  tabela especificada
* (``/^(Remove).*(?:From)(.*)/``) Remove campos de uma
  tabela específica
* (``/^(Alter)(.*)/``) Altera a tabela especificada. Um apelido para
  um CreateTable seguido de um AlterTable

Você também pode usar  ``underscore_form`` como nome das suas **migrations**.
Ex.: ``create_products``.

.. versionadded:: cakephp/migrations 1.5.2

    A partir da versão 1.5.2 do `plugin migrations<https://github.com/cakephp/migrations/>`_,
    o nome dos arquivos de migrações são colocados automaticamente no padrão
    **camel case**.
    Esta versão do plugin está disponível apenas a partir da versão 3.1 do
    CakePHP.
    Antes disto, o padrão de nomes do plugin migrations utilizava a nomenclatura
    baseada em **underlines**, ex.:  ``20160121164955_create_products.php``.

.. warning::

    O nome das migrações são usados como nomes de classe, e podem colidir com
    outras migrações se o nome das classes não forem únicos. Neste caso, pode
    ser necessário sobreescrever manualmente os nomes mais tarde ou simplesmente
    mudar os nomes que você está especificando.

Definição de colunas
~~~~~~~~~~~~~~~~~~~~

Quando utilizar colunas na linha de comando, pode ser útil lembrar que eles seguem o
seguinte padrão::

    fieldName:fieldType[length]:indexType:indexName

Por exemplo, veja formas válidas de especificar um campo de e-mail:

* ``email:string:unique``
* ``email:string:unique:EMAIL_INDEX``
* ``email:string[120]:unique:EMAIL_INDEX``

O parâmetro ``length`` para o ``fieldType`` é opcional e deve sempre ser 
escrito entre colchetes

Os campos  ``created`` e ``modified`` serão automaticamente definidos
como ``datetime``.

Os tipos de campos são genericamente disponibilizados pela biblioteca ``Phinx``.
Eles podem ser:

* string
* text
* integer
* biginteger
* float
* decimal
* datetime
* timestamp
* time
* date
* binary
* boolean
* uuid

Há algumas heurísticas para a escolha de tipos de campos que não são especificados 
ou são definidos com valor inválido. O tipo de campo padrão é ``string``;

* id: integer
* created, modified, updated: datetime

Criando uma tabela
------------------

Você pode utilizar o ``bake`` para criar uma tabela::

    $ bin/cake bake migration CreateProducts name:string description:text created modified

A linha de comando acima irá gerar um arquivo de migração parecido com este::

    <?php
    use Migrations\AbstractMigration;

    class CreateProducts extends AbstractMigration
    {
        /**
         * Change Method.
         *
         * More information on this method is available here:
         * http://docs.phinx.org/en/latest/migrations.html#the-change-method
         * @return void
         */
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('description', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Adicionando colunas a uma tabela existente
------------------------------------------

Se o nome da migração na linha de comando estiver na forma "AddXXXToYYY" e
for seguido por uma lista de nomes de colunas e tipos, então o arquivo de
migração com o código para criar as colunas será gerado::

    $ bin/cake bake migration AddPriceToProducts price:decimal

A linha de comando acima irá gerar um arquivo com o seguinte conteúdo::

    <?php
    use Migrations\AbstractMigration;

    class AddPriceToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('price', 'decimal')
                  ->update();
        }
    }

Adicionando uma coluna como indice a uma tabela
-----------------------------------------------

Também é possível adicionar índices a colunas::

    $ bin/cake bake migration AddNameIndexToProducts name:string:index

irá gerar::

    <?php
    use Migrations\AbstractMigration;

    class AddNameIndexToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('name', 'string')
                  ->addIndex(['name'])
                  ->update();
        }
    }


Especificando o tamanho do campo
--------------------------------

.. versionadded:: cakephp/migrations 1.4

Se você precisar especificar o tamanho do campo, você pode fazer isto entre
colchetes logo após o tipo do campo, ex.::

    $ bin/cake bake migration AddFullDescriptionToProducts full_description:string[60]

Executar o comando acima irá gerar::

    <?php
    use Migrations\AbstractMigration;

    class AddFullDescriptionToProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->addColumn('full_description', 'string', [
                'default' => null,
                'limit' => 60,
                'null' => false,
            ])
            ->update();
        }
    }

Se o tamanho não for especificado, os seguintes padrões serão utilizados:

* string: 255
* integer: 11
* biginteger: 20

Removendo uma coluna de uma tabela
----------------------------------

Da mesma forma, você pode gerar uma migração para remover uma coluna
utilizando a linha de comando, se o nome da migração estiver na forma 
"RemoveXXXFromYYY"::

    $ bin/cake bake migration RemovePriceFromProducts price

Cria o arquivo::

    <?php
    use Migrations\AbstractMigration;

    class RemovePriceFromProducts extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products');
            $table->removeColumn('price');
        }
    }

Gerando migrações a partir de uma base de dados existente
=========================================================

Se você está trabalhando com um banco de dados pré-existente e quer começar 
a usar migrações, ou para versionar o schema inicial da base de dados da sua
aplicação, você pode executar o comando ``migration_snapshot``::

    $ bin/cake bake migration_snapshot Initial

Isto irá gerar um arquivo de migração chamado **YYYYMMDDHHMMSS_Initial.php**
contendo todas as instruções CREATE para todas as tabelas no seu banco de dados.

Por padrão, o snapshot será criado a partir da conexão ``default`` definida na
configuração.
Se você precisar fazer o bake de um snapshot de uma fonte de dados diferente, 
você pode utilizar a opção ``--connection``::

    $ bin/cake bake migration_snapshot Initial --connection my_other_connection

Você também pode definir que o snapshot inclua apenas as tabelas para as quais
você tenha definido models correspendentes, utilizando a flag
``require-table``::

    $ bin/cake bake migration_snapshot Initial --require-table

Quando utilizar a flag ``--require-table``, o shell irá olhar através das
classes do diretório ``Table`` da sua aplicação e apenas irá adicionar no
snapshot as tabelas lá definidas::

A mesma lógica será aplicada implicitamente se você quiser fazer o bake de um
snapshot para um plugin. Para fazer isso, você precisar usar a opção
``--plugin``::

    $ bin/cake bake migration_snapshot Initial --plugin MyPlugin

Apenas as tabelas que tiverem um objeto ``Table`` definido serão adicionadas
ao snapshot do seu plugin.

.. note::

    Quando fizer o bake de um snapshot para um plugin, os arquivos de migrações
    serão criados no diretório **config/Migrations** do seu plugin.

Fique atento que quando você faz o bake de um snapshot, ele é automaticamente
 adicionado ao log do phinx como migrado.

Os Comandos
===========

``migrate`` : Aplicando migrações
---------------------------------

Depois de ter gerado ou escrito seu arquivo de migração, você precisa executar
o seguinte comando para aplicar as mudanças a sua base de dados::

    # Executa todas as migrações
    $ bin/cake migrations migrate

    # Execute uma migração específica utilizando a opção ``--target`` ou ``-t``
    # O valor é um timestamp que serve como prefixo para cada migração::
    $ bin/cake migrations migrate -t 20150103081132

    # Por padrão, as migrações ficam no diretório **config/Migrations**. Você
    # pode especificar um diretório utilizando a opção ``--source`` ou ``-s``.
    # O comando abaixo executa as migrações no diretório **config/Alternate**
    $ bin/cake migrations migrate -s Alternate

    # Você pode executar as migrações de uma conexão diferente da ``default``
    # utilizando a opção ``--connection`` ou ``-c``.
    $ bin/cake migrations migrate -c my_custom_connection

    # Migrações também podem ser executadas para plugins. Simplesmente utilize 
    # a opção ``--plugin`` ou ``-p``
    $ bin/cake migrations migrate -p MyAwesomePlugin

``rollback`` : Revertendo migrações
-----------------------------------

O comando rollback é utilizado para desfazer migrações realizadas anteriormente
pelo plugin Migrations. É o inverso do comando ``migrate``::

    # Você pode desfazer uma migração anterior utilizando o
    # comando ``rollback``::
    $ bin/cake migrations rollback

    # Você também pode passar a versão da migração para voltar
    # para uma versão específica::
    $ bin/cake migrations rollback -t 20150103081132

Você também pode utilizar as opções ``--source``, ``--connection`` e
``--plugin`` exatamente como no comando ``migrate``.

``status`` : Status da migração
-------------------------------

O comando status exibe uma lista de todas as migrações juntamente com seu
status. Você pode utilizar este comando para ver quais migrações foram
executadas::

    $ bin/cake migrations status

Você também pode ver os resultados como JSON utilizando a opção
``--format`` (ou ``-f``)::

    $ bin/cake migrations status --format json

Você também pode utilizar as opções ``--source``, ``--connection`` e
``--plugin`` exatamente como no comando ``migrate``.


``mark_migrated`` : Marcando uma migração como migrada
------------------------------------------------------

.. versionadded:: 1.4.0

Algumas vezes pode ser útil marcar uma lista de migrações como migrada sem
efetivamente executá-las.
Para fazer isto, você pode usar o comando ``mark_migrated``. O comando é
bastante semelhante aos outros comandos.

Você pode marcar todas as migrações como migradas utilizando este comando::

    $ bin/cake migrations mark_migrated

Você também pode marcar todas as migrações de uma versão específica 
utilizando a opção ``--target``::

    $ bin/cake migrations mark_migrated --target=20151016204000

Se você não quer marcar a migração alvo como migrada durante o processo, você
pode utilizar a opção ``--exclude``::

    $ bin/cake migrations mark_migrated --target=20151016204000 --exclude

Finalmente, se você deseja marcar somente a migração alvo como migrada, 
você pode utilizar a opção ``--only``::

    $ bin/cake migrations mark_migrated --target=20151016204000 --only

Você também pode utilizar as opções ``--source``, ``--connection`` e
``--plugin`` exatamente como no comando ``migrate``.

.. note::

    Quando você criar um snapshot utilizando o bake com o comando 
    ``cake bake migration_snapshot``, a migração criada será automaticamente
    marcada como migrada.

.. deprecated:: 1.4.0

    A seguinte maneira de utilizar o comando foi depreciada. Use somente se
    você estiver utilizando uma versão do plugin inferior a 1.4.0.

Este comando espera um número de versão de migração como argumento::

Se você deseja marcar todas as migrações como migradas, você pode utilizar
o valor especial ``all``. Se você o utilizar, ele irá marcar todas as migrações
como migradas::

    $ bin/cake migrations mark_migrated all

``seed`` : Seeding your database
--------------------------------

As of 1.5.5, you can use the ``migrations`` shell to seed your database. This
leverages the `Phinx library seed feature <http://docs.phinx.org/en/latest/seeding.html>`_.
By default, seed files will be looked for in the ``config/Seeds`` directory of
your application. Please make sure you follow
`Phinx instructions to build your seed files <http://docs.phinx.org/en/latest/seeding.html#creating-a-new-seed-class>`_.

As for migrations, a ``bake`` interface is provided for seed files::

    # This will create a ArticlesSeed.php file in the directory config/Seeds of your application
    # By default, the table the seed will try to alter is the "tableized" version of the seed filename
    $ bin/cake bake seed Articles

    # You specify the name of the table the seed files will alter by using the ``--table`` option
    $ bin/cake bake seed Articles --table my_articles_table

    # You can specify a plugin to bake into
    $ bin/cake bake seed Articles --plugin PluginName

    # You can specify an alternative connection when generating a seeder.
    $ bin/cake bake seed Articles --connection connection

To seed your database, you can use the ``seed`` subcommand::

    # Without parameters, the seed subcommand will run all available seeders
    # in the target directory, in alphabetical order.
    $ bin/cake migrations seed

    # You can specify only one seeder to be run using the `--seed` option
    $ bin/cake migrations seed --seed ArticlesSeed

    # You can run seeders from an alternative directory
    $ bin/cake migrations seed --source AlternativeSeeds

    # You can run seeders from a plugin
    $ bin/cake migrations seed --plugin PluginName

    # You can run seeders from a specific connection
    $ bin/cake migrations seed --connection connection

Be aware that, as opposed to migrations, seeders are not tracked, which means
that the same seeder can be applied multiple times.

Using Migrations In Plugins
===========================

Plugins can also provide migration files. This makes plugins that are intended
to be distributed much more portable and easy to install. All commands in the
Migrations plugin support the ``--plugin`` or ``-p`` option that will scope the
execution to the migrations relative to that plugin::

    $ bin/cake migrations status -p PluginName

    $ bin/cake migrations migrate -p PluginName

Running Migrations in a non-shell environment
=============================================

.. versionadded:: cakephp/migrations 1.2.0

Since the release of version 1.2 of the migrations plugin, you can run
migrations from a non-shell environment, directly from an app, by using the new
``Migrations`` class. This can be handy in case you are developing a plugin
installer for a CMS for instance.
The ``Migrations`` class allows you to run the following commands from the
migrations shell:

* migrate
* rollback
* markMigrated
* status
* seed

Each of these commands has a method defined in the ``Migrations`` class.

Here is how to use it::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Will return an array of all migrations and their status
    $status = $migrations->status();

    // Will return true if success. If an error occurred, an exception will be thrown
    $migrate = $migrations->migrate();

    // Will return true if success. If an error occurred, an exception will be thrown
    $rollback = $migrations->rollback();

    // Will return true if success. If an error occurred, an exception will be thrown
    $markMigrated = $migrations->markMigrated(20150804222900);

    // Will return true if success. If an error occurred, an exception will be thrown
    $seeded = $migrations->seed();

The methods can accept an array of parameters that should match options from
the commands::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Will return an array of all migrations and their status
    $status = $migrations->status(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

You can pass any options the shell commands would take.
The only exception is the ``markMigrated`` command which is expecting the
version number of the migrations to mark as migrated as first argument. Pass
the array of parameters as the second argument for this method.

Optionally, you can pass these parameters in the constructor of the class.
They will be used as default and this will prevent you from having to pass
them on each method call::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // All the following calls will be done with the parameters passed to the Migrations class constructor
    $status = $migrations->status();
    $migrate = $migrations->migrate();

If you need to override one or more default parameters for one call, you can
pass them to the method::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // This call will be made with the "custom" connection
    $status = $migrations->status();
    // This one with the "default" connection
    $migrate = $migrations->migrate(['connection' => 'default']);

Tips and tricks
===============

Creating Custom Primary Keys
----------------------------

If you need to avoid the automatic creation of the ``id`` primary key when
adding new tables to the database, you can use the second argument of the
``table()`` method::

    <?php
    use Migrations\AbstractMigration;

    class CreateProductsTable extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('products', ['id' => false, 'primary_key' => ['id']]);
            $table
                  ->addColumn('id', 'uuid')
                  ->addColumn('name', 'string')
                  ->addColumn('description', 'text')
                  ->create();
        }
    }

The above will create a ``CHAR(36)`` ``id`` column that is also the primary key.

.. note::

    When specifying a custom primary key on the command line, you must note
    it as the primary key in the id field, otherwise you may get an error
    regarding duplicate id fields, i.e.::

        $ bin/cake bake migration CreateProducts id:uuid:primary name:string description:text created modified

Additionally, since Migrations 1.3, a new way to deal with primary key was
introduced. To do so, your migration class should extend the new
``Migrations\AbstractMigration`` class.
You can specify a ``autoId`` property in the Migration class and set it to
``false``, which will turn off the automatic ``id`` column creation. You will
need to manually create the column that will be used as a primary key and add
it to the table declaration::

    <?php
    use Migrations\AbstractMigration;

    class CreateProductsTable extends AbstractMigration
    {

        public $autoId = false;

        public function up()
        {
            $table = $this->table('products');
            $table
                ->addColumn('id', 'integer', [
                    'autoIncrement' => true,
                    'limit' => 11
                ])
                ->addPrimaryKey('id')
                ->addColumn('name', 'string')
                ->addColumn('description', 'text')
                ->create();
        }
    }

Compared to the previous way of dealing with primary key, this method gives you
the ability to have more control over the primary key column definition:
unsigned or not, limit, comment, etc.

All baked migrations and snapshot will use this new way when necessary.

.. warning::

    Dealing with primary key can only be done on table creation operations.
    This is due to limitations for some database servers the plugin supports.

Collations
----------

If you need to create a table with a different collation than the database
default one, you can define it with the ``table()`` method, as an option::

    <?php
    use Migrations\AbstractMigration;

    class CreateCategoriesTable extends AbstractMigration
    {
        public function change()
        {
            $table = $this
                ->table('categories', [
                    'collation' => 'latin1_german1_ci'
                ])
                ->addColumn('title', 'string', [
                    'default' => null,
                    'limit' => 255,
                    'null' => false,
                ])
                ->create();
        }
    }

Note however this can only be done on table creation : there is currently
no way of adding a column to an existing table with a different collation than
the table or the database.
Only ``MySQL`` and ``SqlServer`` supports this configuration key for the time
being.

Updating columns name and using Table objects
---------------------------------------------

If you use a CakePHP ORM Table object to manipulate values from your database
along with renaming or removing a column, make sure you create a new instance of
your Table object after the ``update()`` call. The Table object registry is
cleared after an ``update()`` call in order to refresh the schema that is
reflected and stored in the Table object upon instantiation.

Migrations and Deployment
-------------------------

If you use the plugin when deploying your application, be sure to clear the ORM
cache so it renews the column metadata of your tables.
Otherwise, you might end up having errors about columns not existing when
performing operations on those new columns.
The CakePHP Core includes a :doc:`ORM Cache Shell <console-and-shells/orm-cache>`
that you can use to perform this operation::

    $ bin/cake orm_cache clear

Be sure to read the :doc:`ORM Cache Shell <console-and-shells/orm-cache>`
section of the cookbook if you want to know more about this shell.
