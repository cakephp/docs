Migrations
##########

.. note::
    Atualmente, a documentação desta página não é suportada em português.

    Por favor, sinta-se a vontade para nos enviar um *pull request* no
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **IMPROVE THIS DOC** para propor suas mudanças diretamente.

    Você pode consultar a versão em inglês desta página através do seletor de
    idioma localizado ao lado direito do campo de buscas da documentação.

Migrations é um plugin suportado pela equipe oficial que ajuda você a
fazer mudanças no schema do banco de dados utilizando arquivos PHP,
que podem ser versionados utilizando um sistema de controle de versão.

Ele permite que você evolua suas tabelas ao longo do tempo. Ao invés de
escrever modificações de schema via SQL, este plugin permite que você utilize
um conjunto intuitivo de métodos para fazer mudanças no seu banco de dados.

Este plugin é um wrapper para a biblioteca de migrações `Phinx <https://phinx.org/>`_.

Instalação
============

Por padrão o plugin Migrations é instalado junto com a aplicação esqueleto.
Se você removeu e quer reinstalá-lo, você pode executar o comando a seguir
a partir do diretório ROOT da sua aplicação
(onde o arquivo composer.json está localizado)::

    $ php composer.phar require cakephp/migrations "@stable"

    // Or if composer is installed globally

    $ composer require cakephp/migrations "@stable"

Para usar o plugin você precisa carregá-lo no arquivo **config/bootstrap.php** da sua aplicação.
Você pode usar o :ref:`CakePHP's Plugin shell <plugin-shell>` para carregar e descarregar
plugins do seu arquivo **config/bootstrap.php**::

    $ bin/cake plugin load Migrations

Ou você pode carregar o plugin editando seu arquivo **config/bootstrap.php** e adicionando a linha::

    Plugin::load('Migrations');


Adicionalmente, você irá precisar configurar o banco de dados padrão da sua aplicação,
no arquivo **config/app.php** como explicado em :ref:`Database Configuration section
<database-configuration>`.

Visão Geral
============

Uma migração é basicamente um único arquivo PHP que descreve as mudanças a
serem feitas no banco de dados. Um arquivo de migração pode criar ou excluir
tabelas, adicionar ou remover colunas, criar índices e até mesmo inserir
dados em seu banco de dados.

Aqui um exemplo de migração::

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

Esta migração irá adicionar uma tabela chamada ``products`` ao banco de dados com as
seguintes colunas::

- ``id`` column of type ``integer`` as primary key
- ``name`` column of type ``string``
- ``description`` column of type ``text``
- ``created`` column of type ``datetime``
- ``modified`` column of type ``datetime``

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

O comando seguinte irá executar um rollback na migração e irá excluir a tabela recém criada::

    bin/cake migrations rollback

Criando Migrations
===================

Arquivos de migração são armazeados no diretório **config/Migrations** da
sua aplicação. O nome dos arquivos de migração têm como prefixo a data
em que foram criados, no formato **YYYYMMDDHHMMSS_MigrationName.php**. Aqui estão exemplos de arquivos de migração::

* 20160121163850_CreateProducts.php
* 20160210133047_AddRatingToProducts.php

A maneira mais fácil de criar um arquivo de migrações é usando o
:doc:`/bake/usage` a linha de comando.

Por favor, leia `Phinx documentation <http://docs.phinx.org/en/latest/migrations.html>`
a fim de conhecer a lista completa dos métodos que você pode usar para escrever os arquivos de migração.

.. note::

    Ao gerar as migrações através do ``bake`` você ainda pode alterá-las antes da sua execução, caso seja necessário.

Sintaxe
--------

A sintaxe do ``bake`` para a geração de migrações segue o formato abaixo::

    $ bin/cake bake migration CreateProducts name:string description:text created modified

When using ``bake`` to create tables, add columns and so on, to your
database, you will usually provide two things:
Quando utilizar o ``bake`` para criar as migrações, você normalmente precisará informar os seguintes dados::

  * o nome da migração que você irá gerar (``CreateProducts`` por exemplo)
  * as colunas da tabela que serão adicionadas ou removidas na migração
  (``name:string description:text created modified`` no nosso caso)

Devido às convenções, nem todas as alterações de schema podem ser realizadas através destes comandos.

Além disso, você pode criar um arquivo de migração vazio caso deseje ter um
controle total do que precisa ser executado. Para isto, apenas omita a definição das colunas::

    $ bin/cake migrations create MyCustomMigration
