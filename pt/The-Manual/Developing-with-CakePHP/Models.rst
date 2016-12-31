Models
######

Models representam dados e são usados nas aplicações CakePHP para acesso
aos dados. Um Model normalmente representa uma tabela de um banco de
dados, mas pode ser usado para acessar qualquer coisa que guarde dados
como arquivos, registros do LDAP, eventos do iCal, ou linhas em um
arquivo CSV.

Um model pode ser associado a outros models. Um modelo pode ser
associado a outros modelos. Por exemplo, uma receita pode ser associado
com o autor da receita, bem como os ingredientes na receita.

Esta seção irá explicar quais as características de um model que podem
ser automatizadas, como substituir essas características, e quais
métodos e propriedades um model pode ter. Esta seção vai descrever a
forma de encontrar, guardar e apagar dados. Por último, vamos olhar para
os Datasources.

Introdução
==========

Um Model representa seu modelo de dados e em programação orientada a
objetos é um objeto que representa uma "coisa", como um carro, uma
pessoa ou uma casa. Um blog, por exemplo, deve ter vários posts e cada
post deve ter vários comentários. O Blog, o Post e os Comentários são
todos exemplos de models, cada um associado ao outro.

Aqui vai um exeplo de definição de model no CakePHP:

::

    <?php
    class Ingrediente extends AppModel {
        var $name = 'Ingrediente';
    }
    ?>

Com apenas esta simples declaração, o model Ingrediente é agraciado com
todas as funcionalidades que você precisa para criar consultas
(queries), salvar e excluir dados. Este método mágico vem da classe
Model do CakePHP pela magia da herança. O model Ingrediente estende o
application model, AppModel, que estende a classe interna do CakePHP
Model. É esta classe Model de núcleo (core Model class) que agracia as
funcionalidades para seu model Ingrediente.

Esta classe intermediária, AppModel, é vazia e se você não criou sua
própria é pega de dentro da pasta /cake/. Substituindo a AppModel
permite a você definir funcionalidades que devem ser feitas disponível a
todos o models dentro da aplicação. Para fazer isso, você precisa criar
seu próprio arquivo app\_model.php que deve se localizar na raiz da
pasta /app/. Criando um projeto usando
`Bake </pt/view/113/code-generation-with-bake>`_ irá automaticamente
gerar este arquivo para você.

Crie seu aruqivo model PHP no diretório /app/models/ ou em um
subdiretório de /app/model. O CakePHP o encontrará em qualquer lugar no
diretório. Por convenção ele deve ter o mesmo nome que a classe, por
exemplo ``ingrediente.php``.

CakePHP criará dinamicamente um objeto model para você se ele não puder
encontrar o arquivo correspondente em /app/models. Isso também significa
que se seu arquivo model não estiver nomeado corretamente (i.e.
Ingrediente.php ou ingredientes.php) o CakePHP usará uma instância do
AppModel em vez de seu arquivo model incorreto (ao modo de ver do
CakePHP). Se você estiver tentando usar um método você deve o definir em
seu model, ou um behavior (comportamento) anexado ao seu modelo e você
terá erros de SQL que serão o nome do método que você está chamando - é
um um sinal seguro que o CakePHP não pode encontrar seu model e você
também deve checar os nomes dos arquivos, limpar seus arquivos
temporários, ou ambos.

Veja também `Behaviors </pt/view/88/behaviors>`_ para mais informações
sobre como aplicar lógica similar a múltiplos models.

A propriedade ``$name`` é necessária para o PHP4 mas opcional para o
PHP5

Com seu model definido, ele pode ser acessado de dentro de seu
`Controller </pt/view/49/controllers>`_. O CakePHP automaticamente fará
o model disponível para acesso quando seu nome corresponde ao do
controller. Por exemplo, um controller nomeado IngredientesController
automaticamente iniciará o model Ingrediente e o anexará ao controller
em ``$this->Ingrediente``.

::

    <?php
    class IngredientesController extends AppController {
        function index() {
            //pega todos os ingredientes e os passa para a view
            $ingredientes = $this->Ingrediente->find('all');
            $this->set('ingredientes', $ingredientes);
        }
    }

    ?>

Models associados estão diponíveis através do módel principal. No
exemplo a seguir, Receita tem uma associação com o model Ingrediente.

::

    <?php
    class ReceitasController extends AppController {
        function index() {
            $ingredientes = $this->Receita->Ingrediente->find('all');
            $this->set('ingredientes', $ingredientes);
        }
    }
    ?>

Se os models NÃO ESTÃO absolutamente associados entre eles, você pode
usar Controller::loadModel() para pegar o model.

::

    <?php
    class ReceitasController extends AppController {
        function index() {
           $receitas = $this->Receita->find('all');
           
           $this->loadModel('Carro');
           $carros = $this->Carro->find('all');
           
           $this->set(compact('receitas', 'carros'));
        }
    }
    ?>

Criando Tabelas de Banco de Dados
=================================

Enquanto o CakePHP pode ter datasources que não são dirigidos a banco de
dados, a maioria das vezes, eles são. O CakePHP é desenvolvido para ser
agnóstico e funcionará com MySQL, MSSQL, Oracle, PostgreSQL e outros.
Você pode criar suas tabelas de banco de dados como normalmente faria.
Quando você cria suas classes Model, elas automaticamente mapearão às
tabelas que você criou.

Nomes de tabelas são por convenção em minúsculo e no plural com nomes de
tabelas com múltiplas palavras separadas por sublinhado. Por exemplo, um
Model chamado Ingrediente espera a tabela chamada ingredientes. Um Model
chamado de RegistroDeEvento espera uma tabela chamada de
registro\_de\_eventos. O CakePHP inspecionará suas tabelas para
determinar o tipo de dados de cada um dos campos e usa a informação para
automatizar vários recursos como saídas de campos de formulário na view.

Nomes de campos são por convenção minusculos e separados por sublinhado.

As associações de model para nome de tabela podem ser substituídas com o
atributo ``useTable`` do model explicado mais a frente neste capítulo.

NO restante deta sessão, você verá como CakePHP mapea os tipos de campo
do banco de dados para os tipos de dados do PHP e como o CakePHP pode
automatizar tarefas baseadas em como seus campos são definidos.

Tipos de dados associados à cada SGBD
-------------------------------------

Cada
`SGBD <http://pt.wikipedia.org/wiki/Sistema_de_gerenciamento_de_banco_de_dados>`_
define os tipos de dados de forma ligeiramente diferente. Dentro da
classe de dados para cada sistema de base de dados, o CakePHP possui
mapas, esses tipos de coisa que reconhece e cria uma interface
unificada, não importa qual sistema de base de dados que você irá usar.

Esta seção descreve como cada tipo de dado está mapeado para cada SGBD.

MySQL
~~~~~

+--------------------+----------------------------+
| Tipos do CakePHP   | Propriedades do Campo      |
+====================+============================+
| chave primária     | NOT NULL auto\_increment   |
+--------------------+----------------------------+
| string             | varchar(255)               |
+--------------------+----------------------------+
| texto              | text                       |
+--------------------+----------------------------+
| inteiro            | int(11)                    |
+--------------------+----------------------------+
| número flutuante   | float                      |
+--------------------+----------------------------+
| data e horário     | datetime                   |
+--------------------+----------------------------+
| timestamp          | datetime                   |
+--------------------+----------------------------+
| horário            | time                       |
+--------------------+----------------------------+
| data               | date                       |
+--------------------+----------------------------+
| binário            | blob                       |
+--------------------+----------------------------+
| boleano            | tinyint(1)                 |
+--------------------+----------------------------+

Um campo *tinyint(1)* é considerado um booleano pelo CakePHP.

MySQLi
~~~~~~

+--------------------+--------------------------------+
| Tipo do CakePHP    | Propriedades do Campo          |
+====================+================================+
| chave primária     | DEFAULT NULL auto\_increment   |
+--------------------+--------------------------------+
| string             | varchar(255)                   |
+--------------------+--------------------------------+
| texto              | text                           |
+--------------------+--------------------------------+
| inteiro            | int(11)                        |
+--------------------+--------------------------------+
| número flutuante   | float                          |
+--------------------+--------------------------------+
| data e horário     | datetime                       |
+--------------------+--------------------------------+
| timestamp          | datetime                       |
+--------------------+--------------------------------+
| horário            | time                           |
+--------------------+--------------------------------+
| data               | date                           |
+--------------------+--------------------------------+
| binário            | blob                           |
+--------------------+--------------------------------+
| boleano            | tinyint(1)                     |
+--------------------+--------------------------------+

ADOdb
~~~~~

+--------------------+-------------------------+
| Tipo do CakePHP    | Propriedades do Campo   |
+====================+=========================+
| chave primária     | R(11)                   |
+--------------------+-------------------------+
| string             | C(255)                  |
+--------------------+-------------------------+
| texto              | X                       |
+--------------------+-------------------------+
| inteiro            | I(11)                   |
+--------------------+-------------------------+
| número flutuante   | N                       |
+--------------------+-------------------------+
| data e horário     | T (Y-m-d H:i:s)         |
+--------------------+-------------------------+
| timestamp          | T (Y-m-d H:i:s)         |
+--------------------+-------------------------+
| horário            | T (H:i:s)               |
+--------------------+-------------------------+
| data               | T (Y-m-d)               |
+--------------------+-------------------------+
| binário            | B                       |
+--------------------+-------------------------+
| booleano           | L(1)                    |
+--------------------+-------------------------+

DB2
~~~

+--------------------+------------------------------------------------------------------------------------+
| Tipo do CakePHP    | Propriedades do Campo                                                              |
+====================+====================================================================================+
| chave primária     | not null gerado por padrão como identificador (começa com 1, incrementando em 1)   |
+--------------------+------------------------------------------------------------------------------------+
| string             | varchar(255)                                                                       |
+--------------------+------------------------------------------------------------------------------------+
| texto              | clob                                                                               |
+--------------------+------------------------------------------------------------------------------------+
| inteiro            | integer(10)                                                                        |
+--------------------+------------------------------------------------------------------------------------+
| número flutuante   | double                                                                             |
+--------------------+------------------------------------------------------------------------------------+
| data e horário     | timestamp (Y-m-d-H.i.s)                                                            |
+--------------------+------------------------------------------------------------------------------------+
| timestamp          | timestamp (Y-m-d-H.i.s)                                                            |
+--------------------+------------------------------------------------------------------------------------+
| horário            | time (H.i.s)                                                                       |
+--------------------+------------------------------------------------------------------------------------+
| data               | date (Y-m-d)                                                                       |
+--------------------+------------------------------------------------------------------------------------+
| binário            | blob                                                                               |
+--------------------+------------------------------------------------------------------------------------+
| booleano           | smallint(1)                                                                        |
+--------------------+------------------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+--------------------+--------------------------------------------------------+
| Tipo do CakePHP    | Propriedades do Campo                                  |
+====================+========================================================+
| chave primária     | IDENTITY (1, 1) NOT NULL                               |
+--------------------+--------------------------------------------------------+
| string             | varchar(255)                                           |
+--------------------+--------------------------------------------------------+
| texto              | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+--------------------+--------------------------------------------------------+
| inteiro            | integer                                                |
+--------------------+--------------------------------------------------------+
| número flutuante   | float                                                  |
+--------------------+--------------------------------------------------------+
| data e horário     | timestamp (d.m.Y H:i:s)                                |
+--------------------+--------------------------------------------------------+
| timestamp          | timestamp (d.m.Y H:i:s)                                |
+--------------------+--------------------------------------------------------+
| horário            | time (H:i:s)                                           |
+--------------------+--------------------------------------------------------+
| data               | date (d.m.Y)                                           |
+--------------------+--------------------------------------------------------+
| binário            | blob                                                   |
+--------------------+--------------------------------------------------------+
| booleano           | smallint                                               |
+--------------------+--------------------------------------------------------+

MS SQL
~~~~~~

+--------------------+----------------------------+
| Tipo do CakePHP    | Propriedades do Campo      |
+====================+============================+
| chave primária     | IDENTITY (1, 1) NOT NULL   |
+--------------------+----------------------------+
| string             | varchar(255)               |
+--------------------+----------------------------+
| text               | text                       |
+--------------------+----------------------------+
| inteiro            | int                        |
+--------------------+----------------------------+
| número flutuante   | numeric                    |
+--------------------+----------------------------+
| data e horário     | datetime (Y-m-d H:i:s)     |
+--------------------+----------------------------+
| timestamp          | timestamp (Y-m-d H:i:s)    |
+--------------------+----------------------------+
| horário            | datetime (H:i:s)           |
+--------------------+----------------------------+
| data               | datetime (Y-m-d)           |
+--------------------+----------------------------+
| binário            | image                      |
+--------------------+----------------------------+
| booleano           | bit                        |
+--------------------+----------------------------+

Oracle
~~~~~~

+---------------------+-------------------------+
| Tipo do CakePHP     | Propriedades do Campo   |
+=====================+=========================+
| chave primária      | number NOT NULL         |
+---------------------+-------------------------+
| string              | varchar2(255)           |
+---------------------+-------------------------+
| texto               | varchar2                |
+---------------------+-------------------------+
| intiro              | numeric                 |
+---------------------+-------------------------+
| númeroo flutuante   | float                   |
+---------------------+-------------------------+
| data e horário      | date (Y-m-d H:i:s)      |
+---------------------+-------------------------+
| timestamp           | date (Y-m-d H:i:s)      |
+---------------------+-------------------------+
| horário             | date (H:i:s)            |
+---------------------+-------------------------+
| data                | date (Y-m-d)            |
+---------------------+-------------------------+
| binário             | bytea                   |
+---------------------+-------------------------+
| booleano            | boolean                 |
+---------------------+-------------------------+
| número              | numeric                 |
+---------------------+-------------------------+
| inet                | inet                    |
+---------------------+-------------------------+

PostgreSQL
~~~~~~~~~~

+--------------------+---------------------------+
| Tipo do CakePHP    | Propriedade do Campo      |
+====================+===========================+
| chave primária     | serial NOT NULL           |
+--------------------+---------------------------+
| string             | varchar(255)              |
+--------------------+---------------------------+
| texto              | text                      |
+--------------------+---------------------------+
| inteiro            | integer                   |
+--------------------+---------------------------+
| número flutuante   | float                     |
+--------------------+---------------------------+
| date e horário     | timestamp (Y-m-d H:i:s)   |
+--------------------+---------------------------+
| timestamp          | timestamp (Y-m-d H:i:s)   |
+--------------------+---------------------------+
| horário            | time (H:i:s)              |
+--------------------+---------------------------+
| data               | date (Y-m-d)              |
+--------------------+---------------------------+
| binário            | bytea                     |
+--------------------+---------------------------+
| booleano           | boolean                   |
+--------------------+---------------------------+
| número             | numeric                   |
+--------------------+---------------------------+
| inet               | inet                      |
+--------------------+---------------------------+

SQLite
~~~~~~

+--------------------+---------------------------+
| Tipo do CakePHP    | Propriedades do Campo     |
+====================+===========================+
| chave primária     | integer primary key       |
+--------------------+---------------------------+
| string             | varchar(255)              |
+--------------------+---------------------------+
| texto              | text                      |
+--------------------+---------------------------+
| inteiro            | integer                   |
+--------------------+---------------------------+
| número flutuante   | float                     |
+--------------------+---------------------------+
| data e horário     | datetime (Y-m-d H:i:s)    |
+--------------------+---------------------------+
| timestamp          | timestamp (Y-m-d H:i:s)   |
+--------------------+---------------------------+
| horário            | time (H:i:s)              |
+--------------------+---------------------------+
| data               | date (Y-m-d)              |
+--------------------+---------------------------+
| binário            | blob                      |
+--------------------+---------------------------+
| booleano           | boolean                   |
+--------------------+---------------------------+

Sybase
~~~~~~

+--------------------+-------------------------------------+
| Tipo do CakePHP    | Propriedade do Campo                |
+====================+=====================================+
| chave primária     | numeric(9,0) IDENTITY PRIMARY KEY   |
+--------------------+-------------------------------------+
| string             | varchar(255)                        |
+--------------------+-------------------------------------+
| texto              | text                                |
+--------------------+-------------------------------------+
| inteiro            | int(11)                             |
+--------------------+-------------------------------------+
| número flutuante   | float                               |
+--------------------+-------------------------------------+
| data e horário     | datetime (Y-m-d H:i:s)              |
+--------------------+-------------------------------------+
| timestamp          | timestamp (Y-m-d H:i:s)             |
+--------------------+-------------------------------------+
| horário            | datetime (H:i:s)                    |
+--------------------+-------------------------------------+
| data               | datetime (Y-m-d)                    |
+--------------------+-------------------------------------+
| binário            | image                               |
+--------------------+-------------------------------------+
| booleano           | bit                                 |
+--------------------+-------------------------------------+

Titles
------

Um objeto, no sentido físico, muitas vezes tem um nome ou um título para
se referir a ele. Uma pessoa tem um nome como João ou Mac ou Buddy. Um
blog tem um título. A categoria tem um nome.

Ao especificar um campo com o nome de

``title`` ou `` name `` o CakePHP irá automaticamente usar esse rótulo,
em várias circunstâncias:

-  Scaffolding - títulos das páginas, rótulos dos fieldset's
-  Lists - normalmente utilizadas para ``<select>`` drop-downs
-  TreeBehavior - reordenação, visualização em árvore

Se você tiver um title *e* um campo name em sua tabela, o título será
usado.

created and modified
--------------------

By defining a ``created`` or ``modified`` field in your database table
as ``datetime`` fields, CakePHP will recognize those fields and populate
them automatically whenever a record is created or saved to the database
(unless the data being saved already contains a value for these fields).

The ``created`` and ``modified`` fields will be set to the current date
and time when the record is initially added. The ``modified`` field will
be updated with the current date and time whenever the existing record
is saved.

Note: A field named ``updated`` will exhibit the same behavior as
``modified``. These fields need to be datetime fields with the default
value set to NULL to be recognized by CakePHP.

If you have ``updated``, ``created`` or ``modified`` data in your
``$this->data`` (e.g. from a ``Model::read`` or ``Model::set``) before a
``Model::save()`` then the values will be taken from ``$this->data`` and
not automagically updated.

Either use ``unset($this->data['Model']['modified'])``, etc.
Alternatively you can override the ``Model::save()`` to always do it for
you:-

::

    class AppModel extends Model {
    //
    //
        function save($data = null, $validate = true, $fieldList = array()) {

            //clear modified field value before each save
            if (isset($this->data) && isset($this->data[$this->name]))
                unset($this->data[$this->name]['modified']);
            if (isset($data) && isset($data[$this->name]))
                unset($data[$this->name]['modified']);

            return parent::save($data, $validate, $fieldList);
        }
    //
    //
    }

Usando UUIDs como Chaves Primárias
----------------------------------

Chaves primárias normalmente são definidas como campos INT. O banco de
dados irá automaticamente incrementar o campo, iniciando em 1, para cada
novo registro adicionado. Alternativamente, se você especificar sua
chave primária como CHAR(36) ou BINARY(36), CakePHP irá automaticamento
gerar `UUIDs <http://pt.wikipedia.org/wiki/Identificador_Único_Global>`_
quando novos registros forem criados.

Uma UUID é uma string de 32 byte separada por quatro hífens, com um
total de 36 caracteres. Por exemplo:

::

    550e8400-e29b-41d4-a716-446655440000

UUIDs foram desenvolvidas para serem únicas, não apenas dentro de uma só
tabela, mas também entre tabelas e banco de dados. Se você requer um
campo que permaneça único entre sistemas, então UUIDs são uma boa
pedida.

Recuperando seus dados
======================

findAll(string $conditions, array $fields, string $order, int $limit,
int $page, int $recursive);

Retorna no máximo $limite registros com as condições definidas em
$conditions (se houver), começando da página $page (o padrão é 1). Se
não houver registros, retornará um array vazio.

O $conditions deve ser formada apenas como eles são usados em SQL, por
exemplo:

::

    $conditions = "Pastry.type LIKE '%cake%' AND Pastry.created_on > ‘2007-01-01’"

Prefixando os campos com o nome dos models (‘Pastry.type’ ao invés de
‘type’) é uma boa prática, principalmente quando associa-se dados é
usado nas queries.

Configurando o parâmetro $recursive para um inteiro, força o findAll() a
buscar os dados de acordo com os behaviors descritos em Atributos
anteriormente.

Os dados de findAll() são retornados em um array, seguindo o modelo
básico abaixo:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
            )
        [1] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 85
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
            )
    )

find(string $conditions, array $fields, string $order, int $recursive)

Assim como em findAll(), exceto que esta busca retorna o primeiro
registro, seguindo as regras de $conditions.

findAllBy<fieldName>(string $value)

findBy<fieldName>(string $value);

Estas funções mágicas podem ser usadas como atalhos para procurar dados
nos campos especificados nas suas tabelas. Basta adicionar o nome do
campo, no formato CamelCased, no fim das funções e informar os critérios
de busca como primeiro parâmetro.

+-----------------------------------------------+--------------------------------+
| Exemplos de findAllBy<x> em PHP5              | Fragmento SQL correspondente   |
+===============================================+================================+
| $this->Product->findAllByOrderStatus(‘3’);    | Product.order\_status = 3      |
+-----------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+-----------------------------------------------+--------------------------------+
| $this->User->findAllByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                     | Cake.id = 7                    |
+-----------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);       | User.user\_name = ‘psychic’    |
+-----------------------------------------------+--------------------------------+

Usuários de PHP4 devem usar essa função com uma pequena diferença:

+-------------------------------------------------+--------------------------------+
| Exemplos de findAllBy<x> em PHP4                | Fragmento SQL correspondente   |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                       | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);       | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

O resultado retornado é um array formatado como descrito em find() e
findAll().

findNeighbours(string $conditions, array $field, string $value)

Retorna um array contendo os models vizinhos (com apenas os campos
especificados), especificados por $field e $value, filtrando pelas
condições de SQL em $conditions.

Isto é um atalho para criar links de ‘Anterior’ e ‘Próximo’ que os
usuários percorrem em alguma seqüência através das entradas do seu
model. Apenas funciona para campos baseados em números ou datas.

::

    class ImagesController extends AppController {
        function view($id) {
            // Diz o que é necessário para mostrar a imagem...
            $this->set('image', $this->Image->findById($id);

            // Mas também fala os links para a imagem anterior e próxima...
            $this->set(
                'vizinhos', 
                $this->Image->findNeighbours(null, 'id', $id);
            )
        }
    }

Isso nos retorna um array completo com $image[‘Image’], mas também com
$vizinhos[‘prev’][‘Image’][‘id’] e $vizinhos[‘next’][‘Image’][‘id’] para
ser usada na view.

field(string $name, string $conditions, string $order)

Retorna o valor de um simples campo, especificado em $name, para o
primeiro registro filtrado por $conditions e ordenado por $order.

findCount(string $conditions, int $recursive)

Retorna o número de registros que seguem a $conditions. Use o parâmetro
$recursive para que o CakePHP busque mais (ou menos) níveis dos models
associados.

generateList(string $conditions, string $order, int $limit, string
$keyPath, string $valuePath)

Esta função é um atalho para pegar a lista de chaves e seus valores –
principalmente utilizada para criar select de HTML com a lista dos seus
models. Use os parâmetros $conditions, $order e $limit, assim como você
usa nas requisições com findAll().

Se $primaryKey e $displayField estiverem configuradas no seu model, você
não precisa configurar os dois últimos parâmetros, pois eles agem como
$keyPath e $valuePath, respectivamente. Além disso, se você não definir
$keyPath e $valuePath, CakePHP tentará carregar as informações de
‘title’ ou ‘name’.

Os parâmetros $keyPath e $valuePath especifica qual será o campo para as
chaves e qual o campo dos valores para gerar a lista. Por exemplo, se
você deseja gerar a lista de roles baseada no model Role, chaveado com
suas id’s inteiras, uma chamada completa pode ser:

::

    $this->Role->generateList(
        null, 
        'role_name ASC', 
        null, 
        '{n}.Role.id', 
        '{n}.Role.role_name'
    );

    // Isto vai retornar algo como:
    array(
        '1' => 'Head Honcho',
        '2' => 'Marketing',
        '3' => 'Department Head',
        '4' => 'Grunt'
    );

Muitos estão perplexos pela sintaxe ‘{n}’ usada em generateList(). Fique
frio, isto serve de suporte para alterar os models do DataSource,
explicado mais adiante neste capítulo.

query(string $query), execute(string $query)

Chamadas personalizadas de SQLs podem ser feitas usando os métodos
query() ou execute(). A diferença entre os dois é que query() é usada
para fazer queries SQL personalizadas (o resultado será retornado) e
execute() é usado para fazer comandos SQL personalizados (não retornará
valor).

Se você está usando queries SQL na sua aplicação, lembre-se de usar a
biblioteca de Limpeza de dados (descrita mais além deste manual), que
ajuda na limpeza dos dados fornecidos pelo usuário, como injection code
e ataques de scripts cross-site.

find
----

``find($tipo, $parâmetros)``

Find (significa "encontrar" em português) é a função 10-em-1 de todas as
funções que retornam dados de um model. ``$tipo`` pode ser tanto
``'all'``, ``'first'``, ``'count'``, ``'list'``, ``'neighbors'`` or
``'threaded'``. O tipo de find padrão é ``'first'``.

``$parâmetros`` são usados para passar todos os parâmetros para vários
tipos de buscas, e têm os seguintes chaves por padrão - o qual todos são
opcionais:

::

    array(
        'conditions' => array('Model.campo' => $algumValor), //array com condições
        'recursive' => 1, //int, recursividade
        'fields' => array('Model.campo1', 'DISTINCT Model.campo2'), //array com os nomes dos campos
        'order' => array('Model.criado', 'Model.campo3 DESC'), //string ou array definindo a ordem
        'group' => array('Model.campo'), //campos do GROUP BY
        'limit' => n, //int, limite de resultados do SQL
        'page' => n, //int, página atual para buscas por paginação
        'callbacks' => true //outros possíveis valores são false, 'before', 'after'
    )

Também é possível adicionar e usar outros parâmetros, assim como ser
feito uso de alguns tipos, behaviors e é claro criar seus próprios
métodos nos models.

Mais informação sobre callbacks em models está disponível
`aqui </pt/view/76/Callback-Methods>`_

find('first')
~~~~~~~~~~~~~

``find('first', $parâmetros)``

'first' é o tipo de find padrão, e retornará um resultado. Você usaria
este tipo para qualquer circunstância aonde você espera somente um
resultado. A seguir estão alguns exemplos simples (código de um
controller):

::

    // Article significa Artigo em inglês

    function alguma_function() {
       ...
       $this->Article->order = null; // resetando se tiver algum valor
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulando que o model tenha uma ordem padrão
       $ultimoCriado = $this->Article->find();
       $tambemUltimoCriado = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $especificamenteEste = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

No primeiro exemplo, nenhum parâmetro foi passado para o find - tampouco
condições ou ordenação foi usado. O formato retornado quando chamamos
``find('first')`` é da seguinte forma:

::

    Array
    (
        [NomeDoModel] => Array
            (
                [id] => 83
                [campo1] => valor1
                [campo2] => valor2
                [campo3] => valor3
            )

        [NomeDoModelAssociado] => Array
            (
                [id] => 1
                [campo1] => valor1
                [campo2] => valor2
                [campo3] => valor3
            )
    )

Não há parâmetro adicionais usados por ``find('first')``.

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)`` retorna um valor inteiro. Abaixo dois exemplo
(código do controlador) simples:

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

Não passe ``fields`` como um vetor para ``find('count')``. Você somente
precisará especificar campos para um *DISTINCT count* (caso contrário, o
count é sempre o mesmo - ditado pelas condições).

Não existem parâmetro adicionais usados pelo ``find('count')``.

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')`` retorna um vetor (potencialmente múltiplo) de
resultados. Este é de fato o macanismo usado por todos as variantes do
``find()``, como o ``paginate``. Abaixo dois exemplos simples (código do
controlador):

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

No exemplo acima ``$allAuthors`` vai conter todo usuário da tabela
usuários, não serão aplicadas condições se nenhuma foi passada.

O resultado de uma chamada de ``find('all')`` vai ser da seguinte forma:

::

    Array
    (
        [0] => Array
            (
                [NomeModelo] => Array
                    (
                        [id] => 83
                        [campo1] => valor1
                        [campo2] => valor2
                        [campo3] => valor3
                    )

                [NomeModeloAssociado] => Array
                    (
                        [id] => 1
                        [campo1] => valor1
                        [campo2] => valor2
                        [campo3] => valor3
                    )

            )
    )

Não existem parâmetros adicionais usados por ``find('all')``.

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)`` retorna um array indexado, útil em qualquer
situação em que você precise de uma lista, como por exemplo para valores
de listas em elementos select. Abaixo estão alguns exemplos simples
(código de controller):

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('list');
       $pending = $this->Article->find('list', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('list');
       $allPublishedAuthors = $this->Article->User->find('list', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

No exemplo acima, ``$allAuthors`` irá conter cada usuário na tabela
users e nenhuma condição será aplicada ao conjunto dos resultados, já
que nenhuma foi passada.

Os resultados da chamada a ``find('list')`` estarão no seguinte formato:

::

    Array
    (
        //[id] => 'valor de exibição',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

Ao chamar ``find('list')`` os campos passados em ``fields`` serão usados
para determinar o que deveria ser usado como as chaves, os valores e os
valores do array, e opcionalmente como agrupar os resultados. O padrão é
que a chave primária do model seja usada como chave e que o campo
displayField seja usado como valor. Seguem alguns exemplos para
ilustrar:

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

Com o código do exemplo acima, as variáveis resultantes devem ficar
parecidas com:

::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['Uber'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)`` retorna um array de dados aninhados,
apropriados se você quiser usar o campo ``parent_id`` dos dados de seu
model para construir resultados aninhados. Abaixo estão alguns exemplos
(código de controller):

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42)); // desconsidera a raiz
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

Não é necessário utilizar o `Tree behavior </pt/view/91/Tree>`_ para
fazer uso deste método - mas é possível obter todos os resultados
desejados em uma única consulta.

No código de exemplo acima, ``$allCategories`` conterá um array aninhado
representando toda uma estrutura de categorias. O segundo exemplo
utiliza a estrutura de dados usada pelo `Tree
behavior </pt/view/91/Tree>`_ e retorna um resultado parcial para
``$aCategory`` e tudo o que esteja abaixo dela. Os resultados de uma
chamada a ``find('threaded')`` estarão no seguinte formato:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

A ordem em que os resultados aparecem pode ser modificada uma vez que
depende da ordem de processamento. Por exemplo, se
``'order' => 'name ASC'`` for passado como parâmetro para
``find('threaded')``, os resultados irão aparecer ordenados pelo campo
name. Qualquer campo pode ser usado para ordenação, e não há qualquer
requisito predefinido para que o resultado de mais alto nível seja
retornado primeiro.

Não existem parâmetros a serem usados pelo ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' (vizinhos em ingles) vai executar um find similar ao
'first', mas vai retornar a linha anterior e posterior a que você
requisitou. Abaixo um exemplo simples (código do controlador):

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

Você pode ver neste exemplo os dois elementos requiridos no vetor
``$params``: *field* e *value*. Outros elementos ainda são permitidos
como em outros find's (Ex: se o seu modelo funciona como limitador você
pode especificar 'contain' em ``$params``). O resultado de uma chamada
de ``find('neighbors')`` vai ser da seguinte forma:

::

    Array
    (
        [prev] => Array
            (
                [ModeloNome] => Array
                    (
                        [id] => 2
                        [campo1] => valor1
                        [campo2] => valor2
                        ...
                    )
                [ModeloNomeAssociado] => Array
                    (
                        [id] => 151
                        [campo1] => valor1
                        [campo2] => valor2
                        ...
                    )
            )
        [next] => Array
            (
                [ModeloNome] => Array
                    (
                        [id] => 4
                        [campo1] => valor1
                        [campo2] => valor2
                        ...
                    )
                [ModeloNomeAssociado] => Array
                    (
                        [id] => 122
                        [campo1] => valor1
                        [campo2] => valor2
                        ...
                    )
            )
    )

Note como o resultado sempre contém dois elementos: *prev* e *next*.

findAllBy
---------

``findAllBy<fieldName>(string $value)``

Estes métodos mágicos podem ser usados como atalho para fazer buscas em
suas tabelas por um determinado campo. Apenas adicione o nome do campo
(no formato CamelCase) ao final destes métodos, e informe o critério
para este campo como primeiro parâmetro.

+-----------------------------------------------+--------------------------------+
| Exemplo de findAllBy<x> em PHP5               | Trecho SQL Correspondente      |
+===============================================+================================+
| $this->Product->findAllByOrderStatus(‘3’);    | Product.order\_status = 3      |
+-----------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+-----------------------------------------------+--------------------------------+
| $this->User->findAllByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                     | Cake.id = 7                    |
+-----------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);       | User.user\_name = ‘psychic’    |
+-----------------------------------------------+--------------------------------+

Usuários de PHP4 precisam utilizar esta função de um jeito um pouco
diferente devido alguma indiferenciação de maiúsculas e minúsculas no
PHP4:

+-------------------------------------------------+--------------------------------+
| Exemplo de findAllBy<x> em PHP4                 | Trecho SQL Correspondente      |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                       | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);       | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

Os métodos findBy() funcionam como find('first',...), enquanto que os
métodos findAllBy() funcionam como find('all',...).

Em qualquer caso, o resultado é um array formatado tal como se tivesse
sido retornado pelos métodos find() ou findAll(), respectivamente.

findBy
------

``findBy<fieldName>(string $value)``

Estes métodos mágicos podem ser usados como um atalho para buscar suas
tabeças por um dado campo. Apenas adicione o nome do campo (no formato
CamelCase) ao final destes métodos e informe o critério de busca para
esse campo como primeiro parâmetros.

+-----------------------------------------------+--------------------------------+
| Exemplo de findBy<x> em PHP5                  | Trecho SQL Correspondente      |
+===============================================+================================+
| $this->Product->findAllByOrderStatus(‘3’);    | Product.order\_status = 3      |
+-----------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+-----------------------------------------------+--------------------------------+
| $this->User->findAllByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                     | Cake.id = 7                    |
+-----------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);       | User.user\_name = ‘psychic’    |
+-----------------------------------------------+--------------------------------+

Usuários de PHP4 precisam usar esta função de um jeito um pouco
diferente devido a alguma indiferenciação de maiúsculas/minúsculas no
PHP4:

+-------------------------------------------------+--------------------------------+
| Exemplo de findBy<x> em PHP4                    | Trecho SQL Correspondente      |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                       | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);       | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

Métodos findBy() funcionam como find('first',...), enquanto que os
métodos findAllBy() funcionam como find('all',...).

De qualquer maneira, o resultado é um array formatado tal como se fosse
retornado por find() ou findAll(), respectivamente.

query
-----

``query(string $query)``

Comandos SQL que você não possa ou não queira fazer por meio dos outros
métodos de model (atenção - serão poucas as circunstâncias que isso pode
acontecer) podem ser chamados usando-se o método ``query()`` do model.

Se você já estiver usando este método em sua aplicação, certifique-se de
olhar antes a `biblioteca Sanitize </pt/view/153/Data-Sanitization>`_,
que lhe ajuda a fazer uma limpeza nos dados informados pelo usuário e
livrá-los de ataques de injeção de SQL ou cross-site script.

O método ``query()`` não segue o $Model->cachequeries já que sua
funcionalidade é inerentemente disconexa daquela do model que o chama.
Para evitar de fazer cache das chamadas na consulta, passe false para o
segundo argumento, i.e.: ``query($query, $cachequeries = false)``

``query()`` usa o nome da tabela na consulta como chave do array para os
dados retornados ao invés do nome do nome do model. Por exemplo,

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

deve retornar

::

    Array
    (
        [0] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

Para fazer com que o nome do model seja chave do array, e obter
resultados consistentes com aqueles retornados pelos métodos find, a
consulta deve ser reescrita:

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

que retorna

::

    Array
    (
        [0] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

Esta sintaxe e a correspondente estrutura em array é válida para o MySQL
apenas. O Cake não dispõe de qualquer abstração de dados quando
manipulando consultas diretamente, de forma que os resultados podem
diferir entre sistemas de bancos de dados diferentes.

field
-----

``field(string $name, array $conditions = null, string $order = null)``

Retorna o valor de um campo simples, especificado como ``$name``, do
primeiro registro correspondendo as $conditions e ordenado por $order.
Se não são passadas condições e a identificação do modelo está definida,
vai retornar o valor do campo para o modelo corrente. Se não encontrar
registros correspondentes retorna false.

::

    $model->id = 22;
    echo $model->field('name'); // mostra o nome para a linha com identificação 22

    echo $model->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // mostra o nome da última instância criada

read()
------

``read($fields, $id)``

``read()`` é um método usado para definir os dados do modelo atual
(``Model::$data``)--como durante as edições--mas também pode ser usado
em outras circunstâncias para recuperar um simples registro da base de
dados.

``$fields`` é usado para passar um único nome de campo, como uma string,
ou um array de nomes de campos; se estiver vazio, todos os campos serão
buscados.

``$id`` especifica o ID do registro para ser lido. Por padrão, o
registro selecionado atualmente, como especificado por ``Model::$id``, é
usado. Passando um valor diferente para ``$id`` irá fazer que o registro
seja selecionado.

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // recebe a classificação do registro que está sendo excluído
       $name = $this->read('name', $id2); // recebe o nome do segundo registro.
       $rating = $this->read('rating'); // recebe a classificação do segundo registro.
       $this->id = $id3; //
       $this->Article->read(); // le o terceiro registro
       $record = $this->data // armazena o terceiro registro em $record
       ...
    }

Analise que a terceira chamada para ``read()`` busca a classificação do
mesmo registro antes de ler. Isso porque ``read()`` muda ``Model::$id``
para qualquer valor passado como ``$id``. Linhas 6-8 demonstram como
``read()`` muda o dado do modelo atual.

Condições de Busca Complexa
---------------------------

Muitas das buscas de model envolvem passar definições de condições de
uma maneira ou de outra. A simples proposta disto é usar um snippet
(cola) da condição WHERE do SQL. Se você precisar de mais controle, você
pode usar arrays.

Usar arrays é claro e facil de se ler, e também faz deixa muito fácil
contruir queries (consultas). Esta sintaxe também quebra os elementos de
sua query (campos, valores, operadores, ect.) em parte discretas e
manipuláveis. Isto permito o CakePHP gerar a query mais eficiente
possível, mantendo a sintaxe SQL adequada e adequadamente escapa cada
parte individual da query.

Basicamente, uma query baseada em array se parece com isto:

::

    $conditions = array("Post.title" => "This is a post");
    //Exemplo usado com o model:
    $this->Post->find($conditions);

A estrutura aqui é auto-explicativa: ela encontrará qualquer post que o
título seja igual a "This is a post". Note que poderiamos ter usado
apenas "title" como o nome do campo, mas ao construir queries, é uma boa
prática sempre especifica o nome do model, melhorando assim a clareza do
código, e ajuda a prevenir colisões no futuro, você de deveria escolher
mudar seu esquema.

Que tal outros tipos de combinações? Estas são igualmente simples. Vamos
dizer que queremos encontrar todos os posts que o título não é "This is
a post":

::

    array("Post.title <>" => "This is a post")

Veja o '<>' que segue o nome do campo. O CakePHP consegue analizar
qualquer operador de comparação SQL, incluindo expressões de combinação
usando LIKE, BETWEEN ou REGEX, enquanto você deixar um espaço entre o
nome do campo e o operador. A única exceção aqui é IN (...)-combinação
de estilo. Vamos dizer que você quer encontrar um post onde o título
estava em uma lista passada de valores:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

Para fazer uma combinação NOT IN(...) para encontrar posts que o título
não está na lista de valores passada:

::

    array(
        "NOT" => array( "Post.title" => array("First post", "Second post", "Third post") )
    )

Adicionar outros filtros à condição é tão simples quanto adicionar
outras chaves/valores no array:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

Você pode também criar buscas que comparam dois campos no banco de dados

::

    array("Post.created = Post.modified"

O exemplo acima retornará os posts que a data de criação é igual a data
de modificação (i.e. retornará os posts que nunca foram modificados).

Se lembre que se você não conseguir formar uma condição WHERE neste
método (ex. operadores booleanos), você pode sempre a especificar como
uma string:

::

    array(
        'Model.field & 8 = 1',
        //outra condição como o normal
    )

Por padrão o CakePHP junta múltiplas condições com booleano AND; o que
significa, o snippet acima apenas deverá combinar posts que foram
criados nas duas semanas passadas, e tenha um título que combine com um
listado. De qualquer maneira, poderiamos apenas simplesmente encontrar
posts que combinem com cada condição:

::

    array( "or" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

O CakePHP aceita todos os operados booleanos válidos do SQL, incluindo
AND, OR, NOT, XOR, etc., e eles podem estar em letras maiúsculas ou
minúsculas, como preferir. Estas condições também são infinitamente
aninhadas. Vamos dizer que você tem um relacionamento belongsTo
(pertence a) entre Posts e Autores. Vamos dizer que você quer encontrar
todos os posts que contem uma certa palavra chave ("magic") ou que foram
criados nas duas útlimas semanas, mas você quer restringir sua busca aos
posts criados por Bob:

::

    array (
        "Author.name" => "Bob", 
        "or" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

O CakePHP também pode procurar por campos null (nulos). Neste exemplo, a
query retornará registros que o título do post não é nulo:

::

    array ("not" => array (
            "Post.title" => null
        )
    )

Para manipular queries BETWEEN (entre), você pode usar o seguinte:

::

    array('Post.id BETWEEN ? AND ?' => array(1,10))

Nota: O CakePHP citará os valores numéricos dependendo do tipo de campo
do seu banco de dados.

E sobre GROUP BY (agrupar por)?:

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

Um exemplo rápido de fazer uma query DISTINCT. Você pode usar outros
operadores, como MIN(), MAX(), etc., de um jeito similar

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

Você pode criar condições muito complexas, aninhando arrays de múltiplas
condições:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.name' => 'Steel Mega Works')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

O qual produz a seguinte SQL:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

Salvando Seus Dados
===================

O CakePHP faz com da tarefa de salvar registros uma moleza. Os dados que
já estejam prontos para ser salvos podem ser passados para o método
``save()`` do model usando o seguinte formato básico:

::

    Array
    (
        [ModelName] => Array
            (
                [fieldname1] => 'value'
                [fieldname2] => 'value'
            )
    )

Na maioria das vezes você sequer precisa se preocupar com este formato:
os helper ``HtmlHelper``, ``FormHelper`` e os métodos find do CakePHP
todos trabalham com dados neste formato. Se você estiver usando esses
helpers, os dados já estarão convenientemente disponíveis em
``$this->data`` para pronta utilização.

Aqui está um breve exemplo de uma action de um controller que utiliza um
model do CakePHP para salvar dados para uma tabela de uma base de dados:

::

    function edit($id) {
        // algum dado foi POSTado pela view?
        if(!empty($this->data)) {
            // se os dados do formulário puderam ser validados e salvos...
            if($this->Recipe->save($this->data)) {
                // define uma mensagem de flash na sessão e redireciona.
                $this->Session->setFlash("Recipe Saved!");
                $this->redirect('/recipes');
            }
        }
     
        // se não há nenhum dado vindo do formulário, encontre a receita a ser editada
        // e passe-a para a view.
        $this->set('recipe', $this->Recipe->findById($id));
    }

Um detalhe adicional: quando o método save é chamado, os dados passados
para ele como primeiro parâmetro são validados a partir do mecanismo de
validação do CakePHP (veja o capítulo sobre `Validação de
Dados </pt/view/125/Data-Validation>`_ para mais informações). Se, por
alguma razão, seus dados não tiverem sido salvos, certifique-se de
conferir se alguma regra de validação não tenha sido quebrada.

Há poucos outros métodos relacionados a salvamento de dados que você
poderá achar úteis:

``set($one, $two = null)``

Model::set() pode ser usado para definir um ou mais campos de dadps do
array de dados para um model. Isto pode ser útil ao usar os recursos de
ActiveRecord disponibilizados pelo Model.

::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

É um exemplo de como você pode usar ``set()`` para atualizar e salvar um
único campo na abordagem ActiveRecord. Você também pode usar o método
``set()`` para atribuir novos valores para múltiplos campos.

::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

O trecho acima deve atualizar os campos title e published, e salvá-los
para a base de dados.

``save(array $data = null, boolean $validate = true, array $fieldList = array())``

Como mencionado acima, este método faz o salvamento a partir de dados
num formato em array. O segundo parâmetro permite desconsiderar a etapa
de validação e o terceiro parâmetro permite que você informa uma lista
de campos a serem salvos no model. Para aumentar a segurança, você pode
limitar os campos salvos à apenas aqueles listados em ``$fieldList``.

Se o parâmetro ``$fieldList`` não for informado, um usuário malicioso
pode incluir campos adicionais nos dados de formulário, e assim
modificar campos que não se pretendiam modificar.

O método save também possui uma sintaxe alternativa:

``save(array $data = null, array $params = array())``

O array ``$params`` pode ter qualquer uma das seguintes opções como
chaves:

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true // outros valores possíveis são false, 'before', 'after'
    )

Mais informações sobre callbacks de model estão
`aqui </pt/view/76/Callback-Methods>`_

Quando o método save tenha terminado, o ID do objeto pode ser obtido no
atributo ``$id`` do objeto model - algo especialmente útil ao se criar
novos objetos.

::

    $this->Ingredient->save($newData);

    $newIngredientId = $this->Ingredient->id;

A criação ou atualização é controlada pelo campo ``id`` do model. Se o
``$Model->id`` já estiver definido, o registro com esta chave primária
será atualizado. Caso contrário, um novo registro será criado.

::

    // Criação: id não está definido ou é null
    $this->Recipe->create();
    $this->Recipe->save($this->data);

    // Atualização: id está definido para um valor numérico
    $this->Recipe->id = 2;
    $this->Recipe->save($this->data);

Ao chamar o método save em um laço, não se esqueça de chamar o método
``create()``.

``create(array $data = array())``

Este método reinicializa o estado do model para salvar novos dados.

Se o parâmetro ``$data`` (usando o formato de array apresentado acima)
for passado, a instância do model estará pronta para fazer o salvamento
daqueles dados (acessível via ``$this->data``).

Se o valor ``false`` for passado ao invés de um array, a instância do
model não vai inicializar os campos que já não estavam definidos, a
partir do esquema do model, e ainda vai deixar os demais campos
indefinidos. Utilize isto para previnir que campos sejam atualizados na
base de dados que já estavam definidos e que se pretendia atualizar.

``saveField(string $fieldName, string $fieldValue, $validate = false)``

Utilizado para salvar um único campo. Defina o ID do model
(``$this->ModelName->id = $id``) logo antes de chamar o método
``saveField()``. Ao utilizar este método, ``$fieldName`` deveria conter
apenas o nome do campo, e não o nome do model e do campo juntos.

Por exemplo, para atualizar o título de um post do blog, a chamada a
``saveField`` a partir do controller deveria ser algo parecido com:

::

    $this->Post->saveField('title', 'A New Title for a New Day');

``updateAll(array $fields, array $conditions)``

Atualiza muitos registros numa única chamada. Os registros a serem
atualizados são identificados pelo array ``$conditions``, e os campos a
serem atualizados, juntamente com seus nomes, são identificados pelo
array ``$fields`` array.

Por exemplo, para aprovar todos os cozinheiros que sejam membros há mais
de um ano, a chamada ao método deveria ser algo parecido com:

::

    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => "$this_year")
    );

O array $fields aceita expressões SQL. Valores literais devem ser
colocados entre aspas manualmente.

Por exemplo, para fechar todos os tíquetes que pertençam a um
determinado cliente:

::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

``saveAll(array $data = null, array $options = array())``

Usado para salvar (a) múltiplos registros individuais para um único
model ou (b) este registro, bem como os registros associados.

As seguintes opções podem ser utilizadas:

validate: defina para false para desabilitar a validação e true para
validar cada registro antes de salvar, 'first' para validar \*todos\* os
registros antes de salvar ou 'only' para apenas validar os registros sem
salvá-los.

atomic: se definido para true (o valor padrão), o método tentará salvar
todos os registros numa única transação. Deve ser definido para false se
a base de dados/tabela não suportar transações. Se estiver com o valor
false, vamos retornar um array parecido com o array $data informado, mas
os valores serão definidos para true/false dependendo se cada registro
foi ou não salvo com sucesso.

fieldList: equivalente ao parâmetro $fieldList em ``Model::save()``

Para salvar múltiplos registros de um único model, $data precisa ser um
array de registros indexado numericamente, semelhante a:

::

    Array
    (
        [Article] => Array(
                [0] => Array
                    (
                                [title] => title 1
                            )
                [1] => Array
                    (
                                [title] => title 2
                            )
                    )
    )

O comando para salvar o array $data acima deve ser parecido com isto:

::

    $this->Article->saveAll($data['Article']);

Para salvar um registro juntamente com seus registros relacionados por
meio de uma associação hasOne ou belongsTo, o array $data deve ser algo
parecido com:

::

    Array
    (
        [User] => Array
            (
                [username] => billy
            )
        [Profile] => Array
            (
                [sex] => Male
            [occupation] => Programmer
            )
    )

O comando para salvar o array $data acima deve ser parecido com isto:

::

    $this->Article->saveAll($data);

Para salvar um registro juntamente com seus registros relacionados por
meio de uma associação hasMany, o array $data deve ser algo parecido
com:

::

    Array
    (
        [Article] => Array
            (
                [title] => My first article
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [comment] => Comment 1
                [user_id] => 1
                    )
            [1] => Array
                    (
                        [comment] => Comment 2
                [user_id] => 2
                    )
            )
    )

O comando para salvar o array $data acima deve ser parecido com isto:

::

    $this->Article->saveAll($data);

O salvamento de dados relacionados com ``saveAll()`` só irá funcionar
com models que estejam diretamente associados.

Salvando dados em tabelas relacionadas (hasOne, hasMany, belongsTo)
-------------------------------------------------------------------

Ao trabalhar com models associados, é importante perceber que salvar
dados em tabelas relacionadas sempre será feito pelo model do CakePHP
correspondente. Se você estiver salvando um novo Post e seus Comentários
associados, então vcoê deverá usar ambos model, Post e Comentario
durante a operação de salvar.

Se ainda nenhum dos registros de models associados exisiter no sistema
(por exemplo, você quer salvar os registros de um novo Usuario e seu
Perfil relacionado ao mesmo tempo), você precisará salvar primeiro o
model primário, ou pai.

Para ter uma idéia de como isto funciona, vamos imaginar que temos uma
action em seu UsuariosController que manipula o salvamento de um novo
Usuário e um Perfil relacionado. A action de exemplo mostrada a seguir
assume que você enviou via POST dados suficientes (usando o FormHelper)
para criar um único Usuário e um único Perfil.

::

    <?php
    function add() {
        if (!empty($this->data)) {
            // Nós podemos salvar os dados do usuário:
            // deve ser assim $this->data['Usuario']
     
            $usuario = $this->Usuario->save($this->data);

            // Se o usuário for salvo, agora nós adicionamos estes dados de informação
            // e salva o Perfil.
          
            if (!empty($usuario)) {
                // O ID do recem adicionado foi definido
                // como $this->Usuario->id.
                $this->data['Perfil']['usuario_id'] = $this->Usuario->id;

                // Porque nosso Usuário hasOne (tem um) Perfil, podemos acessar
                // o model Perfil através do model Usuário:
                $this->Usuario->Perfil->save($this->data);
            }
        }
    }
    ?>

Como regra geral, ao trabalhar com associações hasOne (tem um), hasMany
(tem muitos) e belongsTo (pertence a), é tudo sobre chaveamento. A idéia
básica é pegar a chave de um model e colocá-la no compo de chave
estrangeira no outro model. As vezes isso deve envolver usar o atributo
``$id`` da classe model depois de um ``save()``, mas outras vezes deve
apenas envolve coletar o ID de um campo oculto em um formulário que
acabou de ser POSTado para uma action do controller.

Para completar a aproximação básica acima, CakePHP também oferece um
método muito útil ``saveAll()``, o que lhe permite validar e salvar
múltiplos models de uma vez. Em adição, ``salveAll()`` fornece suporte
operacional para assegurar a integridade dos dados no banco de dados
(i.e. se um model falhar ao salvar, o outro model também não será
salvo).

Para operações funcionarem corretamento no MySQL suas tabelsa devem usar
InnoDB engine. Lembre que tabelas MyISAM não suportam operações.

Vamos ver como podemos usar ``saveAll()`` para salvar os models Empresa
e Conta ao mesmo tempo.

Primeiro, você precisa construir seu formulário para ambos os models,
Empresa e Conta (assumimos que Empresas hasMany (tem muitas) Conta).

::

    echo $form->create('Empresa', array('action'=>'add'));
    echo $form->input('Empresa.name', array('label'=>'Nome da Empresa'));
    echo $form->input('Empresa.descrição');
    echo $form->input('Company.local');

    echo $form->input('Conta.0.name', array('label'=>'Nome da Conta'));
    echo $form->input('Conta.0.usuario');
    echo $form->input('Conta.0.email');

    echo $form->end('Add');

Dê uma olhada na forma que nomeamos os campos do formulário para o model
Conta. Se Empresa é nosso model principal o ``saveAll()`` esperará os
dados do model relacionado (Conta) para chegar a um formato específico.
E tendo ``Conta.0.nomeDoCampo`` é exatamente o que precisamos.

Os nomeamentos de campos acima são necessários para associações hasMany.
Se a associação entre os models é hasOne, você deve usar a notação
NomeDoModel.nomeDoCampo para o model associado.

Agora, em nosso empresas\_controller podemos criar uma action ``add()``:

::

    function add() {
       if(!empty($this->data)) {
          $this->Empresa->saveAll($this->data, array('validate'=>'first'));
       }
    }

Isso é tudo que precisa. Agora suas models Empresa e Conta serão
validados e salvados tudo ao mesmo tempo. Um coisa a se notar aqui é o
uso do ``array('validate' => 'first')``; esta opção assegura que ambos
os models serão validadeos.

counterCache - Armazena seu count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Esta função o ajuda a armazenar o count (contagem) de dados
relacionados. Ao invés de contar os registros manualmente usando
``find('count')``, o model traça qualquer adição/exlcusão relativa ao
model associado ``$hasMany`` e aumenta/diminui um campo inteiro dedicado
dentro da tabela do model pai.

O nome dos campos consiste no nomde do model no singular seguido por um
sublinhado e a palavra "count".

::

    my_model_count

Vamos dizer que você tem um model chamado ``ImageComment`` e um model
chamado ``Image``, você deve adicionar um novo compo INT na tablea
``image_comments`` e nomea-lo ``image_count``

Mais alguns exemplos:

+-------------+--------------------+---------------------------------------------+
| Model       | Associated Model   | Example                                     |
+=============+====================+=============================================+
| User        | Image              | users.image\_count                          |
+-------------+--------------------+---------------------------------------------+
| Image       | ImageComment       | image.image\_comment\_count                 |
+-------------+--------------------+---------------------------------------------+
| BlogEntry   | BlogEntryComment   | blog\_entries.blog\_entry\_comment\_count   |
+-------------+--------------------+---------------------------------------------+

Uma vez adicionado o campo contador está pronto para seguir. Ative o
counter-chache em sua associação adicionando uma chave ``counterCache``
e defina o valor para ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

A partir de agora, toda vez que você adicionar ou remover uma ``Image``
associada ao ``ImageAlbum``, o número dentro do ``image_count`` é
ajustado automaticamente.

Você também pode especificar ``counterScope`` Ele permite a você
especificar uma condição simples que diz ao model quando atualizar (ou
quando não atualizar, dependendo de como você vê) o valor do counter.

Usando nosso exemplo do model Image, podemos especificar como a seguir:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('active' => 1) // apenas conta se "Image" está com active = 1
        ));
    }

Salvando dados em tabelas relacionadas (HABTM)
----------------------------------------------

Salvar models que são associados por hasOne, blongsTo e hasMany é muito
simples: você apenas popula seu campo de chave estrangeira com o ID do
model associado. Uma vez isso feito, você apenas chama o método save()
no model, e tudo se linka corretamento.

Com HABTM (has\_and\_belong\_to\_many), você precisa definir o ID do
model associado em seu array de dados. Nós contruiremos um formulário
que cria uma nova tag e a associa "na mosca"com alguma receita.

O formulário simples parece com algum como isto (assumimos que
$recipe\_id já está definido a algo):

::

    <?php echo $form->create('Tag');?>
    <?php echo $form->input(
        'Recipe.id',  // Recipe significa receita
         array('type'=>'hidden', 'value' => $recipe_id)); ?>
    <?php echo $form->input('Tag.name'); ?>
    <?php echo $form->end('Add Tag'); ?>

Neste exemplo, você pode ver o campo oculto ``Recipe.id`` o qual o valor
é definido para o ID da receita que queremos linkar a tag.

Quando o método ``save()`` é invocado dentro do controller, ele
automaticamente salva o os dados HABTM no banco de dados.

::

    function add() {
        
        //Salva a associação
        if ($this->Tag->save($this->data)) {
            //faz algo se salvo com sucesso
        }
    }

Como o código anterior, nossa nova Tag é criada e associada a Recipe
(receita), do qual o ID foi definido em
``$this  ->data['Recipe']['id']``.

Outras formas que podemos querer apresentar nossos dados associados pode
incluir uma lista select drop down. Os dados podem ser puxados do model
usando o método ``find('list')`` e enviado a uma váriavel da view do
nome do model. Um campo com o mesmo nome será automaticamente puxado com
estes dados dentro de uma ``<select>``.

::

    // no controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // na view:
    $form->input('tags');

Um cenário mais provável com um relacionamento HABTM deve incluir
``<select>`` definido para aceitar múltiplas seleções. Por exemplo, uma
Receita por ter múltiplas Tags atribuídas a ela. Neste caso, os dados
são puxados do model da mesma maneira, mas o campo do formulário é
declarado ligeiramente diferente. O nome da tag é definidos usando a
convenção ``ModelName``.

::

    // no controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // na view:
    $form->input('Tag');

Usando o código anterior, uma campo select dorp down múltiplo é criado,
permitindo que múltiplas escolhas sejam automaticamente salvas às
Receitas existentes sendo adicionada ou salva no banco de dados

**O que fazer quando HABTM se torna complicado?**

Por padrão ao salvar um relacionamento HasAndBelongsToMany, o CakePHP
excluirá todas as linhas na tabela juntada antes de salvar novas. Por
exemplo se você tem um Clube que tem 10 Crianças associadas. Você depois
atualiza o Clube com 2 crianças. O Clube setá apenas 2 Crianças, não 12.

Também note que se você quer adicionar mais campos ao juntamento (quando
ele foi criado ou meta informação)isto é possivelmente com tabelas
juntadas HABTM, mas é importante entender que uma opção fácil.

HasAndBelongsToMany entre dois models é na verdade um atalho para três
models associados entre ambos uma associação hasMany e uma belongsTo.

Considere este exemplo:

::

    Child hasAndBelongsToMany Club

Outra forma de olhar para isto é adicionando um model Membership:

::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

Estes dois exemplos são exatamente o mesmo. Eles usam o mesmo valor e
nomes de campos no banco de dados e o mesmo valor de models. A diferença
importante é que o modelo juntado está nomeado diferentemente e seu
comportamento é mais previsível.

Excluindo Dados
===============

Estes métodos podem ser usados para remover dados.

delete
------

``delete(int $id = null, boolean $cascade = true);``

Exclui o registro identificado por $id. Por padrão, também deleta
registros que dependem do registro especificado para exclusão.

Por exemplo, quando excluindo um registro de Usuário que está
relacionado com vário registros de Receitas:

-  Se $cascade está definido como verdadeiro (*true*), os registros de
   Receitas também serão excluídos se no modelo o valor *dependent* está
   definido como verdadeiro (*true*).
-  Se $cascade está definido como falso(\ *false*), os registros de
   Receita serão mantidos depois Usuário ser excluído.

remove
------

``remove(int $id = null, boolean $cascade = true);``

Um sinônimo para ``delete()``.

deleteAll
---------

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

Parecido com ``delete()`` e ``remove()``, exeto que ``deleteAll()``
deleta todos os registros que atendem as condições epecificadas. O
parâmetro ``$conditions`` pode ser um fraqmento SQL ou um vetor.

Associações: Linkando Modelos Juntos
====================================

Um dos recursos mais poderosos do CakePHP é a habilidade de linkar
mapeamentos relacionais pelo model. No CakePHP, os links entres os
models são manipulados através de associações.

Definindo relações entre objetos em sua aplicação deve ser um processo
natural. Por exemplo: em um banco de dados de receita, uma receita deve
ter vários comentários, comentários tem um único autor, e autores devem
ter várias receitas. Definindo o modo de trabalho destas relações lhe
permite aessar seus dados de uma maneira intuitiva e poderosa.

A proposta desta seção é lhe mostrar como planejar para, definir e
utilizare utilizar associações entre models no CakePHP

Enquanto dados podem vir de uma variedade de fontes, a forma mais comum
de armazenamento em aplicações web é uma tabela relacional. A maioria do
que esta seção cobre será nesse contexto.

Para informação sobre associações com Plugin models, veja `Plugin
Model </pt/view/117/Plugin-Models>`_

Introdução
----------

Um dos mais poderosos recursos do CakePHP é o mapeamento relacional
fornecido pelos modelos. No CakePHP, as ligações entre os modelos são
manipuladas através de associações.

Definir as relações entre os diversos objetos em sua aplicação deve ser
um processo natural. Por exemplo: em uma base de dados de receitas, uma
receita pode ter muitas opiniões, opiniões têm um único autor, e os
autores podem ter muitas receitas. Definir a forma como estas relações
trabalham permite o acesso aos seus dados de uma forma intuitiva e
poderosa.

O objetivo desta seção é para mostrar-lhe como planejar, definir,
utilizar as associações entre os modelos no CakePHP. Porque a forma mais
comum de armazenamento em aplicações web é uma base relacional, a maior
parte daquilo que nós vamos cobrir neste manual será, em um banco de
dados com um contexto relacionado.

Os quatro tipos de associação no CakePHP são: hasOne, hasMany,
belongsTo, e hasAndBelongsToMany (HABTM).

+-----------------------+----------------------------------------------------+
| Tipo de associação    | Exemplo                                            |
+=======================+====================================================+
| hasOne                | Um usuário tem um perfil.                          |
+-----------------------+----------------------------------------------------+
| hasMany               | Usuários em um sistema pode ter várias receitas.   |
+-----------------------+----------------------------------------------------+
| belongsTo             | Uma receita pertence a um usuário.                 |
+-----------------------+----------------------------------------------------+
| hasAndBelongsToMany   | Receitas tem, e pertencem a muitas tags.           |
+-----------------------+----------------------------------------------------+

Associações são definidas através da criação de uma classe variável com
o nome da associação que você está definindo. A classe variável às vezes
pode ser tão simples como uma string, mas pode ser tão completa como um
array multidimensional utilizado para definir associações específicas.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $hasOne = 'Profile';
        var $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recipe',
                'conditions' => 'Recipe.approved = 1',
                'order'      => 'Recipe.created DESC'
            )
        );
    }

    ?>

No exemplo acima, a primeira instância da palavra 'Recipe' é o que é
chamado de 'Alias'. Este é o identificador para o relacionamento e pode
ser qualquer coisa que você escolher. Geralmente, você escolherá o mesmo
nome da classe que ele referencia. De qualquer forma, o alias deve ser
único dentre de um único model e em ambos os lados de um relacionamento
belongsTo/hasMany ou um belongsTo/hasOne. Escolhendo nomes não-únicos
para um model alias pode causar um comportamento inesperado.

O CakePHP automaticamente criará links entre os objetos dos models
associados. Por exemplo, em seu model ``User`` você pode acessar o model
``Recipe`` como:

::

    $this->User->Recipe->algumaFuncao();

Igualmente em seu controller você pode acessar um model associado
simplismente seguindo suas associações de model e sem adicioná-lo no
``$users`` array:

::

    $this->User->Recipe->algumaFuncao();

Lembre que associação são definidas como 'mão única'. Se você definir
User hasMany Recipe não há efeito no Model Recipe. Você precisa definir
Recipe belongsTo User para poder acessar o model User de seu model
Recipe.

hasOne
------

Vamos criar um modelo User que tenha a relação hasOne com o modelo
Profile.

Primeiro, suas tabelas da base de dados devem ser introduzidas
corretamente. Para uma relação hasOne trabalhar, uma tabela tem de
incluir uma chave estrangeira que aponta para um registro na outra.
Neste caso, A tabela profiles deverá conter um campo chamado user\_id. O
padrão básico é:

+------------------------+----------------------+
| Relação                | Esquema              |
+========================+======================+
| Apple hasOne Banana    | bananas.apple\_id    |
+------------------------+----------------------+
| User hasOne Profile    | profiles.user\_id    |
+------------------------+----------------------+
| Doctor hasOne Mentor   | mentors.doctor\_id   |
+------------------------+----------------------+

Table: **hasOne:** os *outros* modelos contém a chave estrangeira.

O arquivo do modelo User será salvo em /app/models/user.php. Para
definir a associação “User hasOne Profile”, adicione a propriedade
$hasOne a classe do modelo. Lembre-se de ter um modelo Profile em
/app/models/profile.php, ou a associação não irá funcionar.

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasOne = 'Profile';   
    }
    ?>

Existem duas formas de descrever essa relação nos seus modelos. O método
mais simples consiste em definir o atributo $hasOne para uma string
contendo o nome da classe do modelo associado, como fizemos
anteriormente.

Se você precisa de mais controle, você pode definir suas associações
usando arrays. Por exemplo, você pode querer limitar a associação para
incluir apenas certos registros.

::

    <?php

    class User extends AppModel {
        var $name = 'User';          
        var $hasOne = array(
            'Profile' => array(
                'className'    => 'Profile',
                'conditions'   => array('Profile.published' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

As possíveis chaves do array para associações hasOne são:

-  **className**: o nome da classe do modelo a ser associado ao modelo
   atual. Se você estiver definindo um relacionamento “User hasOne
   Profile”, o valor da chave className deve ser igual a 'Profile';
-  **foreignKey**: o nome da chave estrangeira encontrada no outro
   modelo. Isto é especialmente útil se você precisa definir múltiplos
   relacionamentos hasOne. O valor padrão para esta chave é sublinhado,
   nome do model atual no singular, seguido de '\_id'. No exemplo acima
   ele deve ser padronizado para 'user\_id'.
-  **conditions**: Um fragmento SQL utilizado para filtrar registros
   relacionados do modelo. É uma boa prática a utilização dos nomes dos
   modelos nos fragmentos SQL: “Profile.approved = 1” é sempre melhor do
   que apenas “approved = 1”.
-  **fields**: A lista de campos da tabela a serem recuperados quando os
   dados do modelo associado são coletados. Retorna todos os campos por
   padrão.
-  **order**: Um fragmento SQL que define a ordem de sorteio para as o
   retorno das linhas associadas.
-  **dependent**: Quando dependent é true, e o método delete() do modelo
   é chamado com o parâmetro cascade(cascata) para true, os registros
   associados do modelo também são apagados. Neste caso, defini-lo true
   , a exclusão do User também vai apagar o seu Profile associado.

Uma vez que esta associação tenha sido definida, operações de busca
sobre o modelo User também vai buscar um registro relacionado de
Profile, se existir:

::

    // Exemplo de resultados de uma chamada $this->User->find();

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Agora que temos o acesso aos dados do Profile pelo modelo User, vamos
definir uma associação belongsTo no modelo Profile, a fim de obter
acesso aos dados relacionados de User. A associação belongsTo é um
complemento natural à associações hasOne e hasMany : ele nos permite ver
os dados da outra direção.

Quando você estiver fazendo suas tabelas na base de dados, com um
relacionamento belongsTo, seguir esta convenção:

+---------------------------+----------------------+
| Relação                   | Esquema              |
+===========================+======================+
| Banana belongsTo Apple    | bananas.apple\_id    |
+---------------------------+----------------------+
| Profile belongsTo User    | profiles.user\_id    |
+---------------------------+----------------------+
| Mentor belongsTo Doctor   | mentors.doctor\_id   |
+---------------------------+----------------------+

Table:  **belongsTo:** o model *atual* contém a chave estrangeira.

Se um model (tabela) contém ma chave estrangeira, ele pertenceA
(belongsTo) outro model (tabela).

Podemos definir a associação belongsTo no nosso modelo Profile em
/app/models/profile.php usando a sintaxe de string como segue:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = 'User';   
    }
    ?>

Nós também podemos definir um relacionamento mais específico, utilizando
a sintaxe do array abaixo:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'    => 'user_id'
            )
        );  
    }
    ?>

As possíveis chaves do array para associações belongsTo são:

-  **className**: o nome da classe do modelo a ser associado ao modelo
   atual. Se você estiver definindo um relacionamento “Profile belongsTo
   User”, o valor da chave className deve ser igual a 'User';
-  **foreignKey**: O nome da chave estrangeira encontrada no modelo
   atual. Isto é especialmente útil se você precisa definir múltiplos
   relacionamentos belongsTo. O valor padrão para esta chave é o
   singular do nome do outro modelo, seguida de '\_id'.
-  **conditions**: Um fragmento SQL utilizado para filtrar registros
   relacionados do modelo. É uma boa prática a utilização dos nomes dos
   modelos nos fragmentos SQL: “User.active = 1” é sempre melhor do que
   apenas “active = 1”.
-  **fields**: A lista de campos da tabela a serem recuperados quando os
   dados do modelo associado são coletados. Retorna todos os campos por
   padrão.
-  **order**:Um fragmento SQL que define a ordem de sorteio para as
   linhas associadas retornadas.
-  **counterCache**: Se definido como ``true`` o Modelo associado
   automaticamente aumentará ou dmininuirá o campo
   "[nome\_do\_model\_no\_singular]\_count" na tabela estrangeira sempre
   que você fizer ``save()`` ou ``delete()``. Se é uma string então é o
   nome do campo a utilizar. O valor no campo counter representa o
   número de linhas relacionadas.
-  **counterScope**: Array de condições opcional usado para atualizar o
   campo counter cache.

Uma vez que esta associação tenha sido definida, As operações de busca
sobre o modelo Profile também vai buscar um registro ligado ao registro
de User se existir:

::

    // Exemplo de resultados de uma chamada $this->Profile->find().

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Próximo passo: definir uma associação “User hasMany Comment”. A
associação hasMany nos permitirá buscar comentários de um usuário quando
faz uma operação de busca no modelo User.

Quando você estiver fazendo suas tabelas na base de dados, com um
relacionamento hasMany, seguir esta convenção:

**hasMany:** o *outro* modelo cotém a chave estrangeira.

Relation

Schema

User hasMany Comment

Comment.user\_id

Cake hasMany Virtue

Virtue.cake\_id

Product hasMany Option

Option.product\_id

Podemos definir a associação hasMany no nosso modelo User
/app/models/user.php usando a sintaxe string como segue:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = 'Comment';   
    }
    ?>

Nós também podemos definir uma relação mais específica utilizando
sintaxe de array:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'    => 'Comment.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

As possíveis chaves do array para associações hasMany são:

-  **className**: o nome da classe do modelo a ser associado ao modelo
   atual. Se você estiver definindo um relacionamento “User hasMany
   Comment” , a chave className deve ser igual “Comment”.
-  **foreignKey**: o nome da chave estrangeira encontrada no outro
   modelo. Isto é especialmente útil se você precisa definir múltiplos
   relacionamentos hasMany. O valor padrão para esta chave é o nome do
   modelo atual no singular, seguida de “\_id”.
-  **conditions**: Um fragmento SQL utilizado para filtrar registros no
   modelo relacionado. É uma boa prática a utilização nome do modelo nos
   fragmentos SQL: “Comment.status = 1” é sempre melhor do que apenas
   “status = 1”.
-  **fields**: A lista de campos a serem recuperados quando os dados do
   modelo associado são coletados. Retorna todos os campos por padrão.
-  **order**: Um fragmento SQL que define a classificação para a ordem
   para o retorno de linhas associadas.
-  **limit**: O número máximo de linhas associadas que você quer que
   retorne.
-  **offset**: O número de linhas associadas para saltar sobre (dadas as
   atuais condições e ordem), antes de ir buscar e associar.
-  **dependent**: Quando dependent for true, é possível a eliminação
   recursiva. Neste exemplo, Os registros de Comment serão apagados
   quando o seu associado registro de User for excluído.
-  **exclusive**: Quando exclusive está definido como true, a exclusão
   recursiva de modelo faz a exclusão com uma chamada ``deleteAll()``,
   em vez de excluir cada entidade separadamente. Isto melhora a
   performance, mas pode não ser ideal para todas as circunstancias.
-  **finderQuery**: Uma completa consulta SQL CakePHP que pode-se usar
   para buscar registros associados. Isto deve ser utilizado em
   situações que exijam muito resultado personalizado.
   Se uma consulta que vocês está constuindo requer uma referência ao
   ID do modelo associado, use o marcador especial ``{$__cakeID__$}`` na
   consulta. Por exemplo, se seu modelo Apple hasMany Orange, a consulta
   deve se parecer com isto:

   ::

       SELECT Orange.* FROM oranges AS Orange WHERE Orange.apple_id = {$__cakeID__$};

Uma vez que esta associação tenha sido definida, As operações de busca
sobre o modelo User também vai buscar registros relacionados em Comment
se existirem:

::

    // Exemplo de resultados de uma chamada $this->User->find();

    Array
    (  
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

Uma coisa para se lembrar é que você precisará de um nova associação
“Comment belongsTo User”, a fim de obter os dados de ambos os sentidos.
O que temos esboçado nesta seção lhe dá poderes para obter os dados dos
comentários do usuário. Adicionando a associação Comment belongsTo User
no modelo Comment lhe dá poderes para obter os dados do usuário a partir
do modelo Comment - completa a ligação e permitindo que haja o fluxo de
informação a partir de qualquer perspectiva de modelo.

hasAndBelongsToMany (HABTM)
---------------------------

Tudo bem. Neste ponto, você já pode chamar você mesmo de profissional em
associações de modelos no CakePHP. Você já está bem versado(experiente)
nas três associações que ocupam a maior parte das relações entre
objetos.

Vamos resolver o último tipo de relacionamento: hasAndBelongsToMany, ou
HABTM. Esta associação é usada quando você tem dois modelos que precisam
se juntar, várias vezes, muitas vezes, de muitas formas diferentes.

A principal diferença entre hasMany e HABTM é que a ligação entre os
modelos em HABTM não é exclusiva. Por exemplo, estamos prestes a juntar
nosso modelo Recipe(Receita) com o modelo Tag usando HABTM. Anexando a
tag “Italian” a minha receita “grandma's Gnocci” não “esgota” o registro
do Tag. Também posso marcar o meu churrasco Honey Glazed Spaghettio's
com a tag “Italian” se eu quiser.

Ligações entre objetos associados com hasMany são exclusivos. Se User
hasMany Comment, um comentário é apenas ligado a um usuário específico.
Deixou-se para ganhar.

Avancemos. É preciso criar uma tabela extra no banco de dados para
manipular associações HABTM. Esta nova tabela deve juntar o nome das
tabelas associadas, incluindo os nomes de ambos os modelos envolvidos,
em ordem alfabética. O conteúdo da tabela deve ser de pelo menos dois
campos, cada um com uma chave estrangeira (que devem ser inteiros)
apontando para ambas as chaves primárias dos modelos envolvidos. Para
evitar qualquer dúvida - não defina uma chave primária combianda para
estes dois campos, se sua aplicação a requer você pode definir um único
índice. Se você planeja adicionar qualquer informação extra a esta
tabela, é uma boa idéia adicionar um campo de chave primária adicional
(por convenção 'id') para fazer agir na tabela tão fácil quanto qualquer
outro modelo.

**HABTM** requer uma tabela de junção separada que inclui ambos nomes de
*modelo*.

+--------------------+---------------------------------------------------------------------------------------+
| Relação            | Esquema (tabela HABTM em negrito)                                                     |
+====================+=======================================================================================+
| Recipe HABTM Tag   | **recipes\_tags.**\ id, **recipes\_tags.**\ recipe\_id, **recipes\_tags.**\ tag\_id   |
+--------------------+---------------------------------------------------------------------------------------+
| Cake HABTM Fan     | **cakes\_fans.**\ id, **cakes\_fans.**\ cake\_id, **cakes\_fans.**\ fan\_id           |
+--------------------+---------------------------------------------------------------------------------------+
| Foo HABTM Bar      | **bars\_foos.**\ id, **bars\_foos.**\ foo\_id, **bars\_foos.**\ bar\_id               |
+--------------------+---------------------------------------------------------------------------------------+

Nomes de tabela são por convenção em ordem alfabética.

Uma vez que esta nova tabela foi criada, podemos definir a associação
HABTM nos arquivos dos modelos. Estamos indo saltar diretamente a
sintaxe array desta vez:

::

    <?php

    class Recipe extends AppModel {
        var $name = 'Recipe';   
        var $hasAndBelongsToMany = array(
            'Tag' =>
                array('className'            => 'Tag',
                    'joinTable'              => 'recipes_tags',
                    'foreignKey'             => 'recipe_id',
                    'associationForeignKey'  => 'tag_id',
                    'unique'                 => true,
                    'conditions'             => '',
                    'fields'                 => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'offset'                 => '',
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
            );             
    }
    ?>

As possíveis chaves do array para associações hasAndBelongsToMany são:

-  **className**: o nome da classe do modelo a ser associado ao modelo
   atual. Se você estiver definindo um relacionamento “Recipe HABTM Tag”
   , a chave className deve ser igual “Tag”.
-  **joinTable**: O nome da tabela usada para ingressar nesta associação
   (se a atual tabela usada para fazer esse tipo de relacionamento não
   aderir à convenção citada acima para nomear tabelas HABTM).
-  **with**: Define o nome do modelo para a tabela de junção. Por padrão
   o CakePHP auto-criará um modelo por você. Usando o exemplo a cima ele
   se chamaria RecipesTag. Usando esta chave você pode substituir este
   nome padrão. O modelo da tabela de junção pode ser usado simplesmente
   como qualquer modelo "regular" para acessar a tabela de junção
   diretamente.
-  **foreignKey**: O nome da chave estrangeira encontrada no outro
   modelo. Isto é especialmente útil se você precisa definir múltiplos
   relacionamentos HABTM. O valor padrão para esta chave é o nome do
   outro modelo no singular, seguida de “\_id”.
-  **associationForeignKey**: O nome da chave estrangeira encontrada no
   modelo atual. Isto é especialmente útil se você precisa definir
   múltiplos relacionamentos HABTM. O valor padrão para esta chave é o
   nome do atual modelo no singular, seguida de '\_id'.
-  **unique**: Se ``true`` (valor padrão) o CakePHP primeiro excluirá os
   registro do relacionamento existente na tabela com a chave
   estrangeira antes de inserir novos registros, quando atualizar um
   registro. Então associações existentes precisam ser passadas
   novamente quando atualizar.
-  **conditions**: Um fragmento SQL utilizado para filtrar registros no
   modelo relacionado. É uma boa prática a utilização nome do modelo nos
   fragmentos SQL: “Recipe.status = 1” é sempre melhor do que apenas
   “status = 1”.
-  **fields**: A lista de campos a serem recuperados quando os dados do
   modelo associado são coletados. Retorna todos os campos por padrão.
-  **order**: Um fragmento SQL que define a classificação para a ordem
   para o retorno de linhas associadas.
-  **limit**: O número máximo de linhas associadas que você quer que
   retorne.
-  **offset**: O número de linhas associadas para saltar sobre (dadas as
   atuais condições e ordem), antes de ir buscar e associar.
-  **finderQuery, deleteQuery, insertQuery**: Uma completa consulta SQL
   CakePHP que pode-se usar para buscar registros associados. Isto deve
   ser utilizado em situações que exijam muito resultado personalizado.

Uma vez que esta associação tenha sido definida, operações de busca
sobre o modelo Recipe(Receita) também vai buscar registros relacionados
em Tag caso existam:

::

    // Exemplo de resultados de uma chamada $this->Recipe->find();

    Array
    (  
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    )

Lembre-se de definir uma associação HABTM no modelo Tag se quiser buscar
dados do modelo Recipe, quando se utiliza o modelo Tag para pesquisas.

Também é possíve executar consultas personalizadas baseado em
relacionamentos HABTM. Considere os exemplos a seguir:

Assumindo a mesma estrutura do exemplo acima (Recipe HABTM Tag), vamos
dizer que queremos buscar todas as Receitas com a tag 'Dessert'
(sobremesa), uma maneira (erro) potencial para realizar isto seria
aplicar a condição à prórpia associação:

::

    $this->Recipe->bindModel(array(
        'hasAndBelongsToMany' => array(
            'Tag' => array('conditions'=>array('Tag.name'=>'Dessert'))
    )));
    $this->Recipe->find('all');

::

    // Dados Retornados
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
            [Tag] => Array
                (
                   [0] => Array
                        (
                            [id] => 124
                            [name] => Dessert
                        )
                )
        )
        1 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Crab Cakes
                    [created] => 2008-05-01 10:31:01
                    [user_id] => 2349
                )
            [Tag] => Array
                (
                }
            }
    }

Repare que este exemplo retorna TODAS receitas mas apenas as tags
"Dessert". Para realizar corretamente nossa meta, existem vários modos
de fazê-la. Uma opção é buscar o modelo Tag (em vez de Recipe), o que
sempre nos dará todas as Receitas associadas.

::

    $this->Recipe->Tag->find('all', array('conditions'=>array('Tag.name'=>'Dessert')));

Também podemos usar o modelo de tabela de junção (que o CakePHP fornece
para nós), para pesquisar por um ID dado.

::

    $this->Recipe->bindModel(array('hasOne' => array('RecipesTag')));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('RecipesTag.tag_id'=>124) // id de Dessert
    ));

Também é possível criar uma associação exótica para o propósito de criar
tantas junções quanto necessárias para permitir a filtragem, por
exemplo:

::

    $this->Recipe->bindModel(array(
        'hasOne' => array(
            'RecipesTag',
            'FilterTag' => array(
                'className' => 'Tag',
                'foreignKey' => false,
                'conditions' => array('FilterTag.id = RecipesTag.tag_id')
    ))));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('FilterTag.name'=>'Dessert')
    ));

Ambos retornarão os seguintes dados:

::

    //Dados Retornados
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    }

O mesmo truque de ligação pode ser usado para facilmente paginar seus
modelos HABTM. Apenas um cuidado: desde que paginar precisar de duas
consultas (uma para contar os registros e outra para pegar os dados
atuais), teha certeza de fornecer o parâmetro ``false`` ao seu
``bindModel();`` que essencialmente diz ao CakePHP para manter a ligação
persistente através de múltiplas consultas, em vez de uma como no
comportamento padrão. Por favor consulte a API para mais detalhes.

Para mais informações sobre associação de ligação de modelos na mosca
veja `Creating and destroying associations on the
fly </pt/view/86/creating-and-destroying-associations-on-the-fly>`_

Criando e removendo relações durante execução
---------------------------------------------

Por vezes, torna-se necessário criar e destruir associações no modelo
durante a execução. Isso pode acontecer por algum número de razões:

-  Você deseja reduzir a quantidade coletada de dados associados, mas
   todas as suas associações estão no primeiro nível de recursão.
-  Você quer mudar o modo como uma associação é definida, a fim de
   ordenar ou filtrar dados associados.

Esta criação e destruição de associação é feita usando os métodos
bindModel() e unbindModel() do modelo CakePHP. (Também há um behavior
muito útil chamado "Containable", favor consultar a seção do manual
sobre Built-in behaviors para mais informações) Vamos configurar alguns
modelos, para que possamos ver como bindModel() e unbindModel()
trabalham. Nós vamos começar com dois modelos:

::

    <?php

    class Leader extends AppModel {
        var $name = 'Leader';

        var $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }

    ?>

    <?php

    class Follower extends AppModel {
        var $name = 'Follower';
    }

    ?>

Agora, no LeadersController, podemos usar o método find() do modelo
Leader para buscar um líder e seus seguidores associados. Como você pode
ver acima, a associação em sintaxe de array no modelo Leader define um
relacionamento "Leader hasMany Follower". Para fins de demonstração,
vamos usar unbindModel() para remover esta associação em uma função do
controlador.

::

    function someAction() {
        // Isto recupera Líderes, e seus seguidores associados
        $this->Leader->find('all');

        // Vamos remover o hasMany...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );

        // Agora usando a função find() irá retornar
        // Líderes, sem os seus seguidores
        $this->Leader->find('all');

        // NOTA: unbindModel() afeta somente a mais próxima
        // função find(). Uma nova chamada find() será usada
        // a informação configurada na associação do modelo.

        // Já utilizando find('all'), após unbindModel(),
        // esta vai buscar Líderes com seguidores
        // associados mais uma vez...
        $this->Leader->find('all');
    }

Remover ou adicionar associações usando bind- e unbindModel() apenas
funciona para a *próxima* operação do modelo exceto o se o segundo
parâmetro seja definido para ``false``. Se o segundo parâmentro foi
definido para *false*, o bind mantém no lugar para o restante da
requisição.

Aqui está a base para o uso padrão de unbindModel():

::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

    // associationType => O tipo de associação com o outro modelo (associatedModelClassName) que você quer remover.

Agora que removida com êxito uma associação durante a execução, vamos
adicionar uma. Como ainda temos Líderes sem princípios necessitamos
alguns Princípios associados. O arquivo do modelo para o nosso modelo
Principle está vazio, com exceção para a declaração var $name. Vamos
associar alguns princípios para ao nosso modelo Leader durante a
execução (mas lembre-apenas servirá a próxima operação de busca). Esta
função aparece no LeadersController:

::

    function anotherAction() {
        // Não há "Leader hasMany Principles" no
        // arquivo do modelo leader.php,
        // aqui somente vamos encontrar Líderes.
        $this->Leader->find('all');

        // Vamos usar bindModel() para adicionar uma nova associação
        // para o modelo Leader.
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );

        // Agora que está ligado corretamente,
        // Podemos utilizar uma única função find() para buscar
        // Líderes com seus associados princípios:
        $this->Leader->find('all');
    }

Isto é o que você tem. A base para uso do bindModel() é o encapsulamento
de uma associação normal dentro de um array cuja chave é nomeada após o
tipo de associação que você está tentando criar:

::

    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // Aqui você pode usar normalmente as chaves e/ou opções de associação.
                    )
                )
            )
        );

Embora o modelo recém-vinculado não precise de nenhum tipo de associação
na definição do modelo dentro do arquivo dele, ele ainda precisa ser
introduzido corretamente para que a nova associação funcione
corretamente.

Múltiplas relações para o mesmo modelo
--------------------------------------

Existem casos que um Modelo tem mais de uma relação com outro Modelo.
Por exemplo você pode ter um modelo Messagem que tem duas relações ao
modelo Usuario. Uma relação com o Usuario que envia a mensagem, e uma
segunda ao usuários que recebe a mensagem. A tabela mensagens deve ter
um campo usuario\_id, mas também um campo destinatario\_id. Agora seu
modelo Mensagem pode se parecer com algo assim:

::

    <?php
    // Message = Mensagem
    // Sender = Remente
    // User = Usuario
    // Recipiente = Destinatario
    class Message extends AppModel {
        var $name = 'Message';
        var $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Destinatário é um pseudônimo para o modelo Usuário. Agora vamos ver como
o modelo Usuário deve se parecer.

::

    <?php
    //MessageSent = MensagemEnviado
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement. This
allows you to perform complex searches across multiples tables (i.e:
search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) performs automatic
joins to retrieve data, so you can issue queries to retrieve models
based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You only
have to define the necessary joins to combine tables and get the desired
results for your query.

To force a join between tables you need to use the "modern" syntax for
Model::find(), adding a 'joins' key to the $options array. For example:

::

    $options['joins'] = array(
        array(
            'table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the channels
table. You can alias the table with the model name, so the retrieved
data complies with the CakePHP data structure.

The keys that define the join are the following:

-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model associated
   with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on related model fields:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $pirvateItems = $Item->find('all', $options);

You could perform several joins as needed in hasBelongsToMany:

Suppose a Book hasAndBelongsToMany Tag association. This relation uses a
books\_tags table as join table, so you need to join the books table to
the books\_tags table, and this with the tags table:

::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.book_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

Using joins with Containable behavior could lead to some SQL errors
(duplicate tables), so you need to use the joins method as an
alternative for Containable if your main goal is to perform searches
based on related data. Containable is best suited to restricting the
amount of related data brought by a find statement.

Métodos de Callbacks
====================

Se você quer colocar alguma lógica antes ou depois de uma operação do
model, use as funções de callback do model. Estas funções podem ser
definidas na classe do model (incluindo seu AppModel). Certifique-se de
notar o valor retornado para cada uma dessas funções especiais.

beforeFind
----------

``beforeFind(mixed $queryData)``

Chamada antes de qualquer operação de busca. A variável $queryData
contém informações sobre a busca atual, como: condições (conditions),
campos (fields), etc.

Se você não quer que a busca inicie (possivelmente relacionada a alguma
decisão tomada em cima da $queryData), retorne false. O valor do retorno
dessa função (possivelmente modificado) deve ser o retorno que você
deseja para a busca.

Você pode usar este callback para restringir funções de busca baseada em
regras de usuários ou guardar informações da busca atual.

afterFind
---------

``afterFind(array $results, bool $primary)``

Use este callback para modificar os resultados de uma busca realizada ou
para executar comandos após a operação busca. O parâmetro $results
contém as informações retornadas da busca. por exemplo :

::

    $results = array(
      0 => array(
        'ModelName' => array(
          'field1' => 'value1',
          'field2' => 'value2',
        ),
      ),
    );

O valor do retorno dessa função (possivelmente modificado) deve ser o
retorno que você deseja para a busca.

Se $primary é false, o conteúdo de $result também é um pouco diferente
do esperado; no resultado da operação de busca voce terá algo como :

::

    $results = array(
      'field_1' => 'value',
      'field_2' => 'value2'
    );

A variável ``$primary`` será true e provavelmente voce receberá "Cannot
use string offset as an array" um erro fatal do PHP se uma operação de
busca recursiva estiver sendo usada.

No exemplo abaixo é apresentado como utilizar afterfind para formatar
data.

::

    function afterFind($results) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }

    function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
--------------

``beforeValidate()``

Use este callback para modificar os dados do modelo antes dele ser
validado, ou para modifcar as regras de validação se necessário. Esta
função deve também retornar *true*, senão a execução ``save()`` atual
abortará.

beforeSave
----------

``beforeSave()``

Coloque qualquer lógica pre-save nesta função. Esta função executa
imeditamente depois dos dados do modelo serem validados com sucesso, mas
logo antes dos dados serem salvos. Esta função também deve retornar true
se você deseja que a operação de salvar continue.

Este callback é especialmente manipulado para qualquer lógica de
mensagem de dados que precisa acontecer antes de seus dados serem
armazenados. Se seu armazenamento precisa de datas em um formato
específico, acesse-a em ``$this->data`` e modifique-a.

Abaixo segue um exemplo de como o ``beforeSave`` pode ser usado para
conversão de data. O código no exemplo é usado por uma aplicação com uma
data de início formatada em YYYY-MM-DD no banco de dados e é mostrado
como DD-MM-YYYY na aplicação. Claro que isso pode ser mudado facilmente.
Use o código a seguir no model apropriado.

::

    function beforeSave() {
        if(!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
                $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
                $this->data['Event']['enddate'] = $this->dateFormatBeforeSave($this->data['Event']['enddate']);
        }
        return true;
    }

    function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString)); // A direção é de
    }

Tenha certeza que ``beforeSave()`` retorne *true*, ou seu salvamento
falhará

afterSave
---------

``afterSave(boolean $created)``

Se você tem alguma lógica que precisa ser executada logo após cada
operação de salvamento, coloque-a neste método callback.

O valor de ``$created`` será *true* se um novo objeto foi criado (em vez
de atualizado).

beforeDelete
------------

``beforeDelete(boolean $cascade)``

Local para colocar a lógica para excluir. Essa função deve retornar true
se desejar excluir, e false se desejar cancelar.

O valor de ``$cascade`` será ``true`` se os registros que dependem deste
registro também serão excluídos.

afterDelete
-----------

``afterDelete()``

Coloque qualquer lógica que pretende que seja executado depois de cada
chamada de callback neste método.

onError
-------

``onError()``

Chamado se qualquer problema ocorrer.

Atributos de Modelo
===================

Atributos de modelo lhe permite definir propriedades que podem
substituir o comportamento padrão do modelo.

Para uma lista completa dos atributos de modelo e suas descriçoes visite
a API do CakePHP. Confira
`https://api.cakephp.org/class/model <https://api.cakephp.org/class/model>`_.

useDbConfig
-----------

A propriedade ``useDbConfig`` especifica o database relacionado com as
tabelas de seu model class. Poderá ser armazenada uma conexão de
database dentro do arquivo de configuração em /app/config/database.php.

A propriedade ``useDbConfig`` assume uma conexão para database.

Examplo:

::

    class Example extends AppModel {
       var $useDbConfig = 'alternate';
    }

useTable
--------

A propriedade ``useTable`` especifica o nome da tabela do banco de
dados. Por padrão, o modelo usa letras minúsculas e plural do nome da
classe do modelo. Defina este atributo ao nome de uma tabela
alternativa, ou difina-o ``false`` se você não quer que o modelo use uma
tabela do banco de dados

Exemplo de uso:

::

    class Example extends AppModel {
       var $useTable = false; // Este modelo não usa uma tabela do banco de dados
    }

Alternativamente:

::

    class Example extends AppModel {
       var $useTable = 'exmp'; // Este modelo usa a tabela 'exmp'
    }

tablePrefix
-----------

O nome do prefixo da tabela usado para o modelo. O prefixo da tabela é
inicialmente defindo no arquivo de conexão com o banco de dados em
/ap/config/database.php. O padrão é sem prefixo. Você pode substituir o
padrão definindo o atributo ``tablePrefix`` no modelo.

Exemplo de Uso:

::

    class Example extends AppModel {
       var $tablePrefix = 'alternate_'; // irá procurar por 'alternate_examples'
    }

primaryKey
----------

Toda tabela normalmente tem uma chave primária, ``id``. Você pode mudar
qual o nome do campo que o modelo usa como sua chave primária. Isto é
comum ao definir o CakePHP para usar uma tabela já existente no banco de
dados.

Exemplo de Uso:

::

    class Example extends AppModel {
        var $primaryKey = 'example_id'; // example_id é o nome do campo na tabela
    }

displayField
------------

O atributo ``displayField`` especifica qual campo do banco de dados deve
ser usado como um rótulo para o registro. O rótulo é usado em
scaffolding e em chamadas ``find('list')``. Por padrão modelo usará
``name`` ou ``title``.

Por exemplo, para usar o campo ``username``

::

    class User extends AppModel {
       var $displayField = 'username';
    }

Múltiplos nomes de campos não podem ser combinados em um único display
field. Por exemplo, você nao pode especificar
``array('firs_name', 'last_name')`` como um display field.

recursive
---------

A propriedade recursive define o quão fundo o CakePHP deve ir para
buscar dados de modelo associado usando os métodos ``find()``,
``findAll()`` e ``read()``.

Imagine os recursos Grupos de sua aplicação que pertence a um domínio
que tem vários Usuários que por sua vez tem vários Artigos. Você pode
deifinir ``$recursive`` para diferetes valores baseados na quantidade de
dados que você quer retornar de uma chamada ``$this->Grupo->find()``.

+----------------+--------------------------------------------------------------------------------------------------------+
| Profundidade   | Descrição                                                                                              |
+================+========================================================================================================+
| -1             | O CakePHP busca dados apenas do Grupo, sem junção.                                                     |
+----------------+--------------------------------------------------------------------------------------------------------+
| 0              | O CakePHP busca os dados do Grupo e de seu domínio.                                                    |
+----------------+--------------------------------------------------------------------------------------------------------+
| 1              | O CakePHP busca um Grupo, seu domínio e seus Usuários associados.                                      |
+----------------+--------------------------------------------------------------------------------------------------------+
| 2              | O CakePHP busca um Grupo, seu domíno, seus Usuários associados e os Artigos associados aos Usuários.   |
+----------------+--------------------------------------------------------------------------------------------------------+

Defina-o não além do que você precisa. Tendo dados buscados pelo CakePHP
você não vai querer deixar sua aplicação lenta desnecessariamente.

Se você quer combinar ``$recursive`` com as funcionalidades de
``campos``, você terá que adicionar as colunas contendo as chaves
estrangeiras necessárias ao array ``campos`` manualmente. No exemplo
acima, pode significar adicionar ``domain_id``.

order
-----

A ordenação padrão de dados para qualquer operação de busca. Valores
possíveis incluem:

::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
----

O recipiente para os dados de busca do modelo. Quando dados são
retornados de uma classe de modelo é normalmente usado como retorno de
uma chamada ``find()`` você pode precisar acesar a informação
armazenadas em ``$data`` dentro de callbacks do modelo.

\_schema
--------

Contem metadados descrevendo os campos de tabelas do banco de dados do
modelo. Cada modelo é descrito por:

-  name
-  type (integer, string, datetime, etc.)
-  null
-  default value
-  length

validate
--------

Este atributo detem regras que permitem o modelo tomar decisões de
validadação de dados antes de salvar. Chaves nomeadas depois de campos
guardam valores de expressão regular permitindo ao modelo tentar fazer
combinações.

Não é necessário chamar ``validate()`` antes de ``save()``, o método
``save()`` irá validar automaticamente seus dados antes de efetivamente
salva-los.

Para mais informações sobre validação, veja o `capítulo de Validação de
Dados </pt/view/125/data-validation>`_ mais a frente neste manual.

name
----

Como você viu anteriormente neste capítulo, o atributo ``name`` é um
recurso de compatibilidade para usuários de PHP4 e é definido para o
mesmo valor que o nome do modelo.

Exemplo de uso:

::

    class Example extends AppModel {
       var $name = 'Example';
    }

cacheQueries
------------

Se definido como ``true``, dados buscados pelo modelo durante uma única
requisição são armazenados em cache. Este caching é apenas in-memory, e
dura apenas pela duração da requisição. Qualquer requisição duplicada
para os mesmos dados é manipulada pelo cache.

Métodos Adicionais e Propriedades
=================================

Enquanto as funções de modelo do CakePHP te levam onde você precisa ir,
não se esqueça que classes de modelo são apenas: classes que permitem
você escrever seus próprios métodos ou definir suas próprias
propriedades.

::

    class Example extends AppModel {
       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
          );
          return $this->find('all', compact('conditions'));
       }
    }

Este método ``getRecent() agora pode ser usado dentro do controller.``

::

    $recent = $this->Example->getRecent();

