Gerenciamento de esquema e migrações
####################################

O SchemaShell disponibiliza uma funcionalidade para criar objetos de
esquema, geração de sql de um esquema, bem como criação de instantâneos
de banco de dados (snapshots) e restauração de banco de dados para dados
a partir de tais instantâneos.

Gerando e utilizando arquivos schema
====================================

Gerar um arquivo de schema permite a você converter facilmente uma base
de dados para um formato neutro, independente do gerenciador de banco de
dados. Você pode gerar um arquivo de schema de sua base de dados com:

::

    $ cake schema generate

Isto irá gerar um arquivo schema.php em seu diretório
``app/config/sql``.

O shell schema vai processar apenas as tabelas para as quais já haja
model definido. Para forçar o shell schema a processar todas as tabelas,
você deve adicionar a opção ``-f`` à linha de comando.

Para reconstruir o esquema de base de dados a partir de um arquivo
schema.php previamente existente, execute:

::

    $ cake schema create

Isto irá apagar e criar as tabelas definidas a partir do conteúdo do
arquivo schema.php.

Arquivos de schema também podem ser usados para gerar conteúdos de
arquivos sql. Para gerar um arquivo sql contendo declarações
``CREATE TABLE``, execute:

::

    $ cake schema dump -write filename.sql

Em que filename.sql é o nome de arquivo desejado que terá o conteúdo
sql. Se você omitir este nome de arquivo, o conteúdo sql gerado será
exibido na tela do console e não será criado nenhum arquivo.

Migrações com o CakePHP schema shell
====================================

Migrações (ou migrations) permitem que você versione o esquema de sua
base de dados, então, conforme você prossegue no desenvolvimento de sua
aplicação, você tem a possibilidade de distribuir as modificações em sua
base de dados de uma forma neutra e independente de um gerenciador de
banco de dados específico. Migrações podem ser obtidas tanto colocando
os arquivos de schema em um sistema de controle de versão ou ainda
através de instantâneos. Versionar um arquivo de schema gerado com o
schema shell é bem fácil. Se você já tiver um arquivo de schema gerado,
ao executar novamente

::

    $ cake schema generate

Serão mostradas a você as seguintes opções:

::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

Selecionar [s] (snapshot, ou instantâneo) irá gerar um arquivo
schema.php incrementado. Então, se você já tiver um schema.php, ele irá
gerar um arquivo schema\_2.php e assim por diante. Você pode então
restaurar qualquer um desses arquivos de schema a qualquer momento
executando:

::

    $ cake schema run update -s 2

Neste caso, 2 é o número do instantâneo para o qual você quer recuperar.
O schema shell vai lhe solicitar uma confirmação antes de executar os
comandos ``ALTER`` que representem a diferença entre a configuração
atual de sua base de dados e as definições no arquivo de schema em
questão.

Você também pode fazer uma execução "a seco" adicionando a opção
``-dry`` ao comando.
