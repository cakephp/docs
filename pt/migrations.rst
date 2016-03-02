Migrations
##########

Migrations é outro plugin apoiado pela equipe principal que lhe ajuda a 
realizar alterações de esquema no banco de dados através de código PHP
que podem ser rastreados através de seus sistema de controle de versão.

Ele permite que você desenvolva suas tabelas de banco de dados ao longo do tempo.
Em vez de escrever esquemas de modificações em SQL, este plugin permite que
você use um conjunto intuitivo de métodos para implementar suas mudanças no
banco de dados.

Este plugin utiliza o pacote `Phinx <https://phinx.org/>`_
ELe

Instalação
==========

Por padraão o Migrations está instalado na estrutura padrão da aplicação. Se
você o removeu e desejar reinstalá-lo, pode fazer isso indo no diretório ROOT
(raíz) de sua aplicação (onde o composer.json está localizado)::

        php composer.phar require cakephp/migrations "@stable"

Você ira adicionar a seguinte linha ao arquivo bootstrap.php de sua aplicação::

        Plugin::load('Migrations');

Adicionalmente, será necessário definiar a configuração padrão de banco de dados
no arquivo config/app.php como explicado em :ref:`Database Configuration section <database-configuration>`.

Visão geral
===========

Uma migration é basicamente um arquivo PHP que descreve um nova 'versão' do banco de dados.
Um arquivo de migration pode criar tabelas, adicionar ou remover colunas, criar
indíces e até mesmo inserir dados no banco.

Segue abaixo o exemplo de uma migration::

        <?php

        use Migrations\AbstractMigration;

        class CreateProductsTable extends AbstractMigration
        {
            /**
             * Este métodos é executado ao aplicar as mudanças
             * ao banco de dados.
             *
             * Mudanças ao banco de dados também podem ser desfeitas
             * sem código adicional para operações não destrutivas.
             */
            public function change()
            {
                // create the table
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->create();
            }
        }


Esta migration adiciona uma tabela chamada 'products' com uma coluna string de nome ``name``,
uma coluna de texto ``description`` e uma coluna chamada ``created`` com o tipo datetime.
Uma coluna de chave primaria de nome ``id`` será adicionada automaticamente.

Perceba que o arquivo descreve como o banco de dados deve parecer após aplicado
as mudanças, neste ponto não existe a tabela ``produtos``, mas nós criamos um arquivo
que pode criá-la com as colunas assim como excluí-las se executarmos um rollback (reversão) na migration.

Depois que o arquivo foi criado na pasta **config/Migrations**, sua execução será possível
através do comando para criar a tabela no banco de dados::

        bin/cake migrations migrate

Criando Migrations
==================

Arquivos migration são salvos no dirertório **config/Migrations** de sua aplicação.
O nome do arquivo de migration possui um prefixo com a data em que foi criado, 
seguindo o formato **YYYYMMDDHHMMSS_my_new_migration.php**.

O caminho mais fácil de criar migrations é utilizando a linha de comando.
Imaginemos que você deseja adicionar uma nova tabela chamada ``products``::

        bin/cake bake migration CreateProducts name:string description:text created modified

.. perceba::

        Você também pode escolher utilizar padrao_underscore como migration label ie.::

            bin/cake bake migration create_products name:string description:text created modified

O comando acima irá criar um arquivo de migration parecido ou igual a::

        <?php

        use Migrations\AbstractMigration;

        class CreateProductsTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->addColumn('modified', 'datetime')
                      ->create();
            }
        }

Se o nome da migration na linha de comando está no padrão "AddXXXToYYY" ou "RemoveXXXFromYYY"
e seguido por uma lista de nomes de colunas e tipos então o arquivo irá conter
o código para criação de exclusão das colunas que serão gerados::

        bin/cake bake migration AddPriceToProducts price:decimal

Executando o comando acima teremos::

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

.. versionadded:: cakephp/migrations 1.4

Se você precisar especificar um tamanho do campo, basta adicionar colchetes ao tipo do campo, ie::

        bin/cake bake migration AddFullDescriptionToProducts full_description:string[60]

Executando o comando acima teremos::

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

Também é possível adicionar o indíce às colunas::

        bin/cake bake migration AddNameIndexToProducts name:string:index

gerando::

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

Ao usar campos na linha comando é útil lembrar que eles seguem
o seguinte padrão::

        campo:tipoDoCampo:tipoDeIndice:nomeIndice

Por exemplo, a seguinte são todas as formas válidas para especificar um campo:

* ``email:string:unique``
* ``email:string:unique:EMAIL_INDEX``

Campos nomeados ``created`` e ``modified`` irá automaticamente configurados com o tipo
``datetime``.

Da mesma forma, você pode gerar uma migration para remover uma coluna usando o
comando::

         bin/cake bake migration RemovePriceFromProducts price

gerando o arquivo::

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

Nomes de Migraton podem seguir qualquer dos seguintes padrões:

* Cria uma tabela: (``/^(Create)(.*)/``) Cria uma tabela específica.
* Exclui uma tabela: (``/^(Drop)(.*)/``) Exclui uma tabela específica. Ignora argumentos de campos específicos.Drops the specified table. Ignores specified field arguments.
* Adiciona um campo: (``/^(Add).*(?:To)(.*)/``) Adds fields to the specified table. Adiciona campos à uma tabela específica.
* Remove um campo: (``/^(Remove).*(?:From)(.*)/``) Remove campos de uma tabela específica.
* Altera uma tabela:  (``/^(Alter)(.*)/``) Altera um tabela específica. Um pseudônimo para CreateTable e AddField.


Tipos de campos feitos genericamente e disponível pelo pacote ``Phinx``. Segue abaixo:

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

Adicionalmente você pode criar um arquivo de migration vazia se quer ter controle
completo sobre o que precisa ser executado::

        bin/cake migrations create MyCustomMigration

Por favor certifique-se de ler a documentação oficial do `Phinx <http://docs.phinx.org/en/latest/migrations.html>`_
a fim de conhecer a lista completa de métodos que você pode utilizar na alteração dos arquivos migration.

Gerando Migrations De Um Banco Existente
----------------------------------------

Se você está lidando com um banco de dados pré-existente e quer começar
utilizando migrations, você pode executar o comando ``migration_snapshot``:

        bin/cake bake migration_snapshot Initial

Ele irá gerar um arquivo de migration chamado **Initial** contendo todas
as declarações criadas nas tabelas do banco de dados existente.

Criando Chaves Primárias Customizadas
-------------------------------------

Se você precisa evitar a criação automática da chave primária ``id`` quando
adiciona novas tabelas ao banco, você pode utilizar o segundo argumento do
método ``table()``::

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

Acima será criado uma coluna ``CHAR(36)`` ``id`` que também é uma chave primária.

.. observe::

        Ao especificar uma chave primária personalizada na linha de comando, você deve notar como a chave primária no campo id, caso contrário deve retornar um erro em relação da duplicidade dos campos id, i.e.::

            bin/cake bake migration CreateProducts id:uuid:primary name:string description:text created modified


Adicionalmente, desde o Migrations 1.3, uma nova maneira de lidar com chave primária
foi introduzido. Para fazer isso, sua classe migration deve herdar a nova classe ``Migrations\AbstractMigration``.
Você pode especificar uma propriedade ``autoId`` na classe Migration e defini-lo
para ``false``, se deseja desligar a criação automática da coluna ``id``. Você precisará
manualmente criar a coluna que será usada como chave estrangeira e adicioná-la na declação da tabela::

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

Comparado a forma anterior de como trabalhar com chave primária, este método
lhe dá a capacidade de ter controle sobre a definicção de chave primária :
unsigned ou não, limit, comentário, etc.


Todas as migrations e snapshot serão utilizados nesta nova forma quando necessário.

.. cuidado::

    Lidar com chave primária pode apenas ser feito em operações de criação.
    Isto ocorre devido as limitações de alguns servidores que suportam o plugin.

Collations
----------

Se você precisa criar uma tabela com uma collation diferente do padrão de
banco de dados, pode ser definido no método ``table()``, como uma opção::

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

Only ``MySQL`` and ``SqlServer`` supports this configuration key for the time being.
Note porém que isso só pode ser feito na criação da tabela : não há nenhuma maneira
de adicionar uma coluna a uma tabela existente com uma collation diferente da tabela
ou banco de dados.
Apenas ``MySQL`` e ``SqlServer`` suportam esta chave de configuração no momento.

Aplicando Migrations
====================

Após ter gerado ou escrito seu arquivo de migration, será necessário executá-lo
e aplicar suas mudanças a partir do comando::

        bin/cake migrations migrate

Para migrar a uma versão expecífica use o parâmetro ``--target`` ou na forma contraída -t::

        bin/cake migrations migrate -t 20150103081132

Isso corresponde ao timestamp que é prefixado ao arquivo de migration.

Revertendo Migrations
=====================

O comando Rollback é usado para desfazer executadas migrations anteriormente
pelo plugin. É a ação inversa do comando ``migrate``.

Você pode reverter para uma migration anterior usando o comando ``rollback``::

        bin/cake migrations rollback

Você também pode passar o número de versão da migration ao rollback para especificar a versão::

         bin/cake migrations rollback -t 20150103081132

Status da Migrations
====================

O comando Status imprime uma lista de todos os migrations, juntamente com seu status atual.
Você pode usar o comando para determinar quais migrations foram executadas::

        bin/cake migrations status

Marcando um migration como executada
====================================

.. versionadded:: 1.4.0

Isso pode apenas ser útil para marcar uma configuração de migrations como migrada
e atualmente não será executada.
Se deseja fazer isso, utilize o comando ``mark_migrated``.
O comando funciona perfeitamente como os outros.


Você pode marcar todoas as migrations como executadas usando o seguinte comando::

    bin/cake migrations mark_migrated

Você também pode marcar todas as migrations posteriores especificando sua
versão usando a opção``--target``::

    bin/cake migrations mark_migrated --target=20151016204000

Se você não quer escolher uma migration a ser marcado como executada durante
o processo, utilize a marcação ``--exclude``::

    bin/cake migrations mark_migrated --target=20151016204000 --exclude

Finalmente, se você deseja marcar apenas migration escolhidas como executadas,
você pode utilizar a opção ``--only``::

    bin/cake migrations mark_migrated --target=20151016204000 --only

.. observe::

    Quando você captura com o comando ``cake bake migration_snapshot``,
    a migration criada irá automaticamente ser marcado como executado.

.. depreciado:: 1.4.0

    A seguinte maneira de usar o comando foi depreciado. Use o apenas
    se você está usando uma versãod o plugin inferior a 1.4.0.

Este comando espera o número de versão da migration como argumento::

    bin/cake migrations mark_migrated 20150420082532

Se você deseja marcar todos migrations como executados, você pode usar o valor especial
``all``. Se usá-lo, irá marcar todos os migrations encontrado como executados::

    bin/cake migrations mark_migrated all

Usando Migrations Em Plugins
============================

Plugins também podem fornecer arquivos de migrations. Isto faz com que os plugins que
são voltado a distrubuição como portáteis e fácil de instalar. Todos os comandos
no plugin Migrations suportam as opções ``--plugin`` ou ``-p`` que são o topo de execução
para as migrations em relação ao plugin::

        bin/cake migrations status -p PluginName

        bin/cake migrations migrate -p PluginName


Executando Migrations em um ambiente não-shell
==============================================

.. versionadded:: cakephp/migrations 1.2.0

Desde o lançamento da versão 1.2 do plugin migrations, você pode executar
migration de um ambiente não-shell, diretamente de um app, usando a
nova classe ``Migrations``. Este pode ser útil em que você está desenvolvendo 
um instalador do plugin para um CMS por exemplo.


* migrate
* rollback
* markMigrated
* status

Cada um desse comandos tem um método definido na classe ``Migrations``.

Aqui está como usá-lo::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Irá retornar um array de todas as migrations e seus status
    $status = $migrations->status();

    // Irá retornar true se sucesso. I ocorreu um erro, um exeção será lançada
    $migrate = $migrations->migrate();

    // Irá retornar true se sucesso. I ocorreu um erro, um exeção será lançada
    $rollback = $migrations->rollback();

    // Irá retornar true se sucesso. I ocorreu um erro, um exeção será lançada
    $markMigrated = $migrations->markMigrated(20150804222900);

Os metodos podem receber um array de parâmetros que devem combinar opções dos
comandos::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Irá retornar um array de todas as migrations e seus status
    $status = $migrations->status(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

Você pode passar qualquer opções que o comando shell executaria.
A única exceção é o comando ``markMigrated`` que está esperando o número da versão
das migartions para marcar como executado um primeiro argumento. Passe
o array de parâmetros como o segundo argumento para este método.

Opcionalmente, você pode passar estes parâmetros na construção da classe.
Eles são usados como padrão e irão evitar que você tenha que passar
a cada chamada do método::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // Toda as seguintes chamadas serão executadas com os parâmetros passdos a classe contrutora Migrations
    $status = $migrations->status();
    $migrate = $migrations->migrate();

Se vocÊ precisa sobreescrever um ou mais parâmetros padrõres por uma chamada,
você pode os passar ao método::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // Esta chamada irá ser feita com a conexão "custom"
    $status = $migrations->status();
    // Este com a conexão "default"
    $migrate = $migrations->migrate(['connection' => 'default']);
