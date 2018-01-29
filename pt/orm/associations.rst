Associações - Conectando tabelas
################################

Definindo a relação entre diferentes objectos na sua aplicação deveria ser um processo natural. Por exemplo, um artigo deve ter muitos comentários, e pertencer a um autor. Autores deve ter muitos artigos e logo muitos comentários. O CakePHP torna fácil a gestão das relações entre os modelos. As quatro tipo de associações no CakePHP são:
hasOne, hasMany, belongsTo, and belongsToMany.

=================== ===================== =======================================
Relação              Tipo de associação    Exemplo
=================== ===================== =======================================
um para um           hasOne                A user has one profile.
------------------- --------------------- ---------------------------------------
um para muitos       hasMany               A user can have multiple articles.
------------------- --------------------- ---------------------------------------
muitos para um       belongsTo             Many articles belong to a user.
------------------- --------------------- ---------------------------------------
muitos para muitos   belongsToMany         Tags belong to many articles.
=================== ===================== =======================================

Associações são definidas durante o método  ``initialize()``  do objeto da sua tabela. Métodos que fechem com o tipo de associação permitem a você definir as associações da suaaplicação. Por exemplo se nós quisermos definir uma associação do tipo belongsTo em nosso ArticlesTable::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Authors');
        }
    }

A forma mais simples de definição de qualquer associação é usar o alias do modelo que você quer associar. Por padrão todos os detalhes das associações serão usadas as conveões do CakePHP. Se você quiser customizar a forma como as suas associações são trabalhadas, você pode modificar elas com os setters::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Authors', [
                    'className' => 'Publishing.Authors'
                ])
                ->setForeignKey('authorid')
                ->setProperty('person');
        }
    }

Você pode também usar arrays para customizar suas associações::

   $this->belongsTo('Authors', [
       'className' => 'Publishing.Authors',
       'foreignKey' => 'authorid',
       'propertyName' => 'person'
   ]);

Arrays, contudo, não oferecem o autocompletar, que uma IDE proporciona.

A mesma tabela pdoe ser usada multiplas vezes para definir difernetes tipos de associações. Por exemplo considere um caso onde você deseja separar os comentários aprovados daqueles que ainda não foram moderados ainda::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('Comments')
                ->setConditions(['approved' => true]);

            $this->hasMany('UnapprovedComments', [
                    'className' => 'Comments'
                ])
                ->setConditions(['approved' => false])
                ->setProperty('unapproved_comments');
        }
    }

Como você pode ver, por especificar a chave da ``className`` , é possível utilizar a mesma tabela em diferentes associações para a mesma tabela. Você até mesmo pode criar uma auto associação da tabela, criando uma estrutura de relação pai-filho::

    class CategoriesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('SubCategories', [
                'className' => 'Categories'
            ]);

            $this->belongsTo('ParentCategories', [
                'className' => 'Categories'
            ]);
        }
    }

Você também pode definir associações em massa ao criar uma única chamada, para
``Table::addAssociations()`` onde aceita um array contendo o nome das tabelas por associação como um argumento::

    class PostsTable extends Table
    {
        public function initialize(array $config)
        {
           $this->addAssociations([
               'belongsTo' => [
                   'Users' => ['className' => 'App\Model\Table\UsersTable']
               ],
               'hasMany' => ['Comments'],
               'belongsToMany' => ['Tags']
           ]);
        }
    }

Cada associação aceita multiplas associações onde a chave é o alias, e a o valir são os dados da configuração da associação. Se a chave for usada for numerica, os valores serão tratados como aliases de associações.

.. _has-one-associations:

Associação HasOne
==================

Vamos definir uma tabela Users com uma relação tem um para o endereço da tabela.

Primeiramente, a sua tabela do seu banco de dados precisa de uma chave correta. Para uma relação hasOne funcionar, uma tabela precisa conter uma chave estrangeira que aponte para um registro em otura tabela. Neste caso o endereço da tabela vai conter um campo chamado ``user_id``. O padrão básico é:

**hasOne:** o *outro* modelo contendo a chave estrangeira.

====================== ==================
Relação                Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    Não necessariamente precisa seguir as convenções do CakePHP, vocẽ pdoe sobrescrever o uso de qualquer chave estrangeira na definição das suas associações. Mesmo assim ao aderir as convenções o seu código se torna menos repetitivo, logo mais fácil de ler e de manter.

Se nos tivermos as classes ``UsersTable`` e ``AddressesTable`` fará com que possamos criar as associaões da seguinte forma::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses');
        }
    }

Se vocẽ necessitar mais controle, você pode definir as suas associações usando os setters.
Por exemplo, você deseja limitar as associações para incluir somente certos registros::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses')
                ->setName('Addresses')
                ->setConditions(['Addresses.primary' => '1'])
                ->setDependent(true);
        }
    }

As chaves possíveis para uma relação hasOne incluem:

- **className**: o nome da classe que está sendo associada com o modelo atual. Se você está definindo uma relação 'User hasOne Address', o nome da caheve da classe deve ser igual a 'Addresses'.
- **foreignKey**:  o nome da chave estrangeira na outra tabela. Este é especialmente acessivel se você precisa definir vários relacionamentos hasOne.
   O valor padrão para esta chave é o nome sublinhado, singular do modelo atual, seguido do sufixo com '\ _id'. No exemplo acima, seria o padrão para
   'user\_id'.
- **bindingKey**: O nome da coluna na tabela atual, que será usado
   para combinar com``foreignKey``. Se não for especificado, a chave primária (para
   exemplo, a coluna de identificação da tabela ``Users``) será usado.
- **conditions**: um array de find() compatível com as condições como
  ``['Addresses.primary' => true]``
- **joinType**: o tipo do join a ser usado para o SQL query, o padão é LEFT. Você pode usar o INNER se a sua associação é hasOne e estiver sempre presente.
- **dependent**: Quando a chave dependente é definida como ``true``, e uma entidade é deletada, os registros do modelo associado tabém devem ser excluídos. Neste caso nós precisamos definir isto para ``true`` então ao deletar um usuário fará excluir todos os resgistros associados aquele registro.
- **cascadeCallbacks**: Quando este e o **dependent** são ``true``, o deletar em cascata vai carregar e excluir todos os registros. Quando ``false``, ``deleteAll()`` deve ser usado para remover o dados associados e não haverá callback disparado.
- **propertyName**: O nome da propriedade deve ser preenchido com os dados de uma tabela associada para a tabela fonte. Por default este é o nome sublinhado e singulardas associações para ``address`` no nosso exemplo.
- **strategy**: Definindo a estratégia de query a ser utilizada . Por padrão o 'join'. O outro  valor válido é 'select', aos quais utiliza uma quesry separada.
- **finder**: O método finder a ser usado quando carregamos os registros associados.

Uma vez que as associações foram definidas, as operações de find na tabela de usuarios podem conter os registros de endereços se estes existirem::

    // No controlelr ou no método da table.
    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
    }

Abaixo emitirá um SQL similar a::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

.. _belongs-to-associations:

Associações BelongsTo 
======================

Agora que nós temos acessoaos registros de endereço através da tabela usuários, vamos criar a associação belongsTo em endereços a fim de ter acesso aos registros relacionados a usuário. A associação belongsTo é um complemento natural a associações do tipo hasOne e
hasMany - isto permite a nós vermos dados relacionados a partir da outra perspectiva.

Quando definindo as chaves do seu banco de dados para uma relação pertence a (belongsTo) na sua tabela siga estas convenções:

**belongsTo:** ao *atual* modelo contendo a chave estrangeira.

========================= ==================
Relação                   Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    Se a tabela contem uma chave estrangeira, isto pertence a outra tabela.

Nós podemos definir uma relação belongsTo em nosso Addresses table como::

    class AddressesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Users');
        }
    }

Nós também podemos definir uma relação mais especifica usando os setters::

    class AddressesTable extends Table
    {
        public function initialize(array $config)
        {
            // Prior to 3.4 version, use foreignKey() and joinType()
            $this->belongsTo('Users')
                ->setForeignKey('user_id')
                ->setJoinType('INNER');
        }
    }

Chaves possiveis para associações belongsTo arrays inclui:

- **className**: o nome da classe do modelo que está sendo associado ao modelo atual. Se você está definindo que a relação 'Profile belongsTo User', a  chave da className deveria ser igual a 'Users'.
- **foreignKey**: o nome da chave estrangeira encontrada na tabela atual. Este é especialmente acessível, se você precisar definir multiplas relações belongsTo ao mesmo modelo. O valor padrão para esta chave é o sublinhado, e nome singular do outro modelo, com o sufixo ``_id``.
- **bindingKey**: O nome da coluna da outra tabela, este ser´a usado para o match de ``foreignKey``. Se não especificado, a chave primária (por exemplo o id da tabela ``Users``) será usado.
- **conditions**: como um array para o find(), compativel com as condições ou SQL como ``['Users.active' => true]``
- **joinType**: o tipo de join a ser usado na query SQL, por padrão é LEFT aos quais não deve atender as suas necessidades para todas as situações, INNER deve ajudar quando você quiser do seu modelo ou associados ou nenhum deles.
- **propertyName**: A propriedade nome deve preenchida com os dados das tabelas associadas e dos resultados. Pos padrão este é o sublinhado e nome singular da associação, então ``user`` em nosso exemplo.
- **strategy**: Define uma estratégia de query a ser usada. Por padrão o 'join'. O outro valor valido é 'select', aos quais utiliza uma query separada.
- **finder**: O método finder é usado quando carregamos registros associados.

Uma vez que esta associação é definida, operações to tipo dina para a tabela Addresses pode conter o registro de User se este existir::

    // No controller ou no metodo de table.
    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

Abaixo emite um SQL que é similar a::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;

.. _has-many-associations:

Associações HasMany
===================

Um exemplo de associações hasMany é "Article hasMany Comments". Definindo que esta associação irá permitir a nós costurar comentários a artigos quando artigo é carregado.

Quando criado a tabela do seu banco de dados para uma relação hasMany, siga estas convenções:

**hasMany:** o *outro* modelo contem uma chave estrangeira.

========================== ===================
Relação                    Schema
========================== ===================
Article hasMany Comment    Comment.article\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Patient     Patient.doctor\_id
========================== ===================

Nós podemos definir uma associação hasMany em noos modelo de Articles seguindo::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('Comments');
        }
    }

Nós também podemos definir uma relção mais especifica usando os setters::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('Comments')
                ->setForeignKey('article_id')
                ->setDependent(true);
        }
    }

As vezes você pode querer configurar chaves compostas em sua associação::

    // Within ArticlesTable::initialize() call
    $this->hasMany('Reviews')
        ->setForeignKey([
            'article_id',
            'article_hash'
        ]);

Confiando no exemplo acima, nos passamos uma array contendo as chaves desejadas para ``setForeignKey()``. Pos padrão o ``bindingKey`` seria automaticamente definido como ``id`` e ``hash`` respectivamente, mas vamos assimir que você precissa especificar diferentes campos como o padrão, vocẽ pdoe definir isto manualmente com ``setBindingKey()``::

    // Within ArticlesTable::initialize() call
    $this->hasMany('Reviews')
        ->setForeignKey([
            'article_id',
            'article_hash'
        ])
        ->setBindingKey([
            'whatever_id',
            'whatever_hash'
        ]);

É importante perceber que os valores de ``foreignKey`` reference a tabela e ``bindingKey`` os valores reference a tabela **articles**.

As chaves possiveis para as associações hasMany são:

- **className**: o nome da classe do modelo associado a
   o modelo atual. Se você estiver definindo um 'Usuário tem muitos comentários'
   relacionamento, a chave className deve ser igual a 'Comentários'.
- **foreignKey**: o nome da chave estrangeira encontrada no outro
   mesa. Isto é especialmente útil se você precisar definir múltiplos
   tem muitos relacionamentos. O valor padrão para esta chave é o
   sublinhado, nome singular do modelo real, sufixo com
   '\_id'.
- **bindingKey**: O nome da coluna na tabela atual, que será usado
   para combinar o `` foreignKey``. Se não for especificado, a chave primária (para
   exemplo, a coluna de identificação da tabela `` Artigos '') será usada.
- **conditions**: uma série de condições compatíveis com find () ou SQL
   strings como `` ['Comments.visible' => true] ``
- **sort**: uma série de cláusulas de pedido compatíveis com find () ou SQL
   strings como `` ['Comments.created' => 'ASC'] ``
- **dependent**: Quando dependente é definido como `` true``, modelo recursivo
   a eliminação é possível. Neste exemplo, os registros de comentários serão
   excluído quando o registro do artigo associado foi excluído.
- **cascadeCallbacks**: Quando este e ** dependentes ** são `` true``, em cascata
   as exclusões carregarão e excluirão entidades para que as devoluções de chamada sejam corretamente
   desencadeada. Quando `` false``, `` deleteAll () `` é usado para remover dados associados
   e nenhuma devolução de chamada é desencadeada.
- **propertyName**: O nome da propriedade que deve ser preenchido com dados do
   Tabela associada aos resultados da tabela de origem. Por padrão, esta é a
   sublinhado e nome plural da associação para "comentários" no nosso exemplo.
- **strategy**: Define a estratégia de consulta a ser usada. Por padrão, selecione "selecionar". o
   outro valor válido é "subconsulta", que substitui a lista `` IN`` por uma
   subconsulta equivalente.
- **saveStrategy**: Ou "anexar" ou "substituir". Por padrão, "anexar". Quando 'anexar' a corrente
   os registros são anexados a qualquer registro no banco de dados. Quando "substituir" associado
   Os registros que não estão no conjunto atual serão removidos. Se a chave estrangeira for anulável
   coluna ou se "dependente" é verdadeira, os registros serão órfãos.
- **finder**: O método do buscador a ser usado ao carregar registros associados.

Uma vez que essa associação foi definida, encontre operações na tabela Artigos
pode conter os registros de comentários se eles existem::

    // In a controller or table method.
    $query = $articles->find('all')->contain(['Comments']);
    foreach ($query as $article) {
        echo $article->comments[0]->text;
    }

O anterior emitiria SQL que é semelhante ao::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);

Quando a estratégia de subconsulta é usada, SQL semelhante ao seguinte será
gerado::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);

Você pode querer armazenar em cache as contagens para suas associações hasMany. Isso é útil
quando você costuma mostrar o número de registros associados, mas não deseja
carregue todos os registros apenas para contabilizá-los. Por exemplo, o comentário conta com
O artigo dado geralmente é armazenado em cache para tornar a geração de listas de artigos mais
eficiente. Você pode usar o :doc:`CounterCacheBehavior
</orm/behaviors/counter-cache>` para armazenar contagens de registros associados.

Você deve certificar-se de que as tabelas do banco de dados não contenham colunas que correspondam
nomes de propriedade da associação. Se, por exemplo, você tiver campos de contador que conflitam
com propriedades de associação, você deve renomear a propriedade de associação ou
o nome da coluna.

.. _belongs-to-many-associations:

Associações BelongsToMany
=========================

.. note::

    Na versão 3.0 em diante ``hasAndBelongsToMany`` / ``HABTM``  foi renomeado para
    ``belongsToMany`` / ``BTM``.

Um exemplo de uma associação BelongsToMany é "Article BelongsToMany Tags", onde
as tags de um artigo são compartilhadas com outros artigos. BelongsToMany is
muitas vezes referido como "tem e pertence a muitos", e é um clássico "muitos a muitos"
Associação.

A principal diferença entre hasMany e BelongsToMany é que o link entre
Os modelos de uma associação BelongsToMany não são exclusivos. Por exemplo, estamos
juntando-se à nossa tabela de Artigos com uma tabela de Tags. Usando 'engraçado' como Tag para meu
Artigo, não "use" a etiqueta. Eu também posso usá-lo no próximo artigo
Eu escrevo.

São necessárias três tabelas de banco de dados para uma associação BelongsToMany. No
exemplo acima, precisaríamos de tabelas para `` articles``, `` tags`` e
`` articles_tags``. A tabela `` articles_tags`` contém os dados que ligam
tags e artigos juntos. A tabela de junção é nomeada após as duas tabelas
envolvido, separado com um sublinhado por convenção. Na sua forma mais simples, isso
a tabela consiste em `` article_id`` e `` tag_id``.

**belongsToMany** requer uma tabela de junção separada que inclui ambos * modelo *
nomes.

============================ ================================================================
Relação                      Join Table Fields
============================ ================================================================
Article belongsToMany Tag    articles_tags.id, articles_tags.tag_id, articles_tags.article_id
---------------------------- ----------------------------------------------------------------
Patient belongsToMany Doctor doctors_patients.id, doctors_patients.doctor_id,
                             doctors_patients.patient_id.
============================ ================================================================

Podemos definir a associação belongsToMany em ambos os modelos da seguinte forma::

    // In src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Tags');
        }
    }

    // In src/Model/Table/TagsTable.php
    class TagsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Articles');
        }
    }

Também podemos definir uma relação mais específica usando a configuração::

    // In src/Model/Table/TagsTable.php
    class TagsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Articles', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

Chaves possiveis para uma associação pertence a muitos inclui:

- **className**: ome da classe do modelo associado a
   o modelo atual. Se você estiver definindo um 'Artigo que pertence a outra etiqueta'
   relacionamento, a chave className deve igualar 'Tags'.
- **joinTable**: O nome da tabela de junção usada neste
   associação (se a tabela atual não aderir à nomeação
   convenção para as mesas JoinToMany join). Por padrão, esta tabela
   O nome será usado para carregar a instância da tabela para a tabela de junção.
- **foreignKey**: O nome da chave estrangeira que faz referência ao modelo atual
   encontrado na tabela de junção, ou lista no caso de chaves externas compostas.
   Isto é especialmente útil se você precisar definir múltiplos
   pertence a muitos relacionamentos. O valor padrão para esta chave é o
   sublinhado, nome singular do modelo atual, sufixo com '\ _id'.
- **bindingKey**: O nome da coluna na tabela atual, que será usado
   para combinar o `` foreignKey``. Predefinições para a chave primária.
- **targetForeignKey**: O nome da chave estrangeira que faz referência ao alvo
   modelo encontrado no modelo de junção, ou lista no caso de chaves externas compostas.
   O valor padrão para esta chave é o nome sublinhado, singular de
   o modelo alvo, sufixo com '\ _id'.
- **conditions**: uma série de condições compatíveis com `` find () ``. Se você tem
   condições em uma tabela associada, você deve usar um modelo 'through', e
   defina as participações necessárias para as associações nela.
- **sort**: uma série de cláusulas de ordem compatíveis com find ().
- **dependent**: Quando a chave dependente é definida como `` false``, e uma entidade é
   excluído, os dados da tabela de junção não serão excluídos.
- **through**: Permite que você forneça o apelido da instância da tabela que você
   quer usado na tabela de junção, ou a instância em si. Isso torna a personalização
   as chaves de tabela de junção possíveis e permite que você personalize o comportamento do
   tabela dinâmica.
- **cascadeCallbacks**: Quando isso é `` true``, os apagados em cascata serão carregados e
   Elimine entidades de modo que as devoluções de chamada sejam ativadas corretamente na tabela de junção
   registros. Quando `` false``, `` deleteAll () `` é usado para remover dados associados e
   nenhum retorno de chamada é desencadeado. Este padrão é "falso" para ajudar a reduzir
   a sobrecarga.
- **propertyName**: O nome da propriedade que deve ser preenchido com dados do
   Tabela associada aos resultados da tabela de origem. Por padrão, esta é a
   sublinhado e nome plural da associação, então "tags" no nosso exemplo.
- **strategy**: Define a estratégia de consulta a ser usada. Por padrão, selecione "selecionar". o
   outro valor válido é "subconsulta", que substitui a lista `` IN`` por uma
   subconsulta equivalente.
- **saveStrategy**:Ou "anexar" ou "substituir". Por padrão, 'substituir'.
   Indica o modo a ser usado para salvar entidades associadas. O primeiro
   apenas crie novas ligações entre ambos os lados da relação e o último
   faça uma limpeza e substitua para criar os links entre as entidades aprovadas quando
   poupança.
- **finder**: O método do buscador a ser usado ao carregar registros associados.

Uma vez definida esta associação, encontrar operações na tabela Artigos podem
conter os registros de tags se eles existirem::

    // Em um método de controlador ou tabela.
    $query = $articles->find('all')->contain(['Tags']);
    foreach ($query as $article) {
        echo $article->tags[0]->text;
    }

O anterior emitiria SQL que é semelhante ao::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (1, 2, 3, 4, 5)
    );

Quando a estratégia de subconsulta é usada, SQL semelhante ao seguinte será
gerado::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (SELECT id FROM articles)
    );

.. _using-the-through-option:

Usando a opção "através"
------------------------

Se você planeja adicionar informações adicionais à tabela de junção / pivô, ou se precisar
Para usar juntas colunas fora das convenções, você precisará definir a
`` through``. A opção `` through`` oferece controle total sobre como
A associação belongsToMany será criada..

Às vezes, é desejável armazenar dados adicionais com muitos
Associação. Considere o seguinte::

    Student BelongsToMany Course
    Course BelongsToMany Student

Um aluno pode fazer muitos cursos e um curso pode ser realizado por muitos estudantes. este
é uma associação simples de muitos a muitos. A tabela a seguir seria suficiente::

    id | student_id | course_id

Agora, e se quisermos armazenar o número de dias que foram atendidos pelo
Estudante no curso e a nota final? A tabela que queremos seria::

    id | student_id | course_id | days_attended | grade

A maneira de implementar nosso requisito é usar um **join model**, de outra forma conhecido
como um **hasMany through** Associação. Ou seja, a associação é um modelo
em si. Então, podemos criar um novo modelo de CursosMemberships. Dê uma olhada no
seguintes modelos::

    class StudentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Courses', [
                'through' => 'CoursesMemberships',
            ]);
        }
    }

    class CoursesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Students', [
                'through' => 'CoursesMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

A tabela de junção CoursesMemberships identifica de forma exclusiva um determinado Student's
Participação em um Curso, além de meta-informação extra.

Condições de associação padrão
------------------------------

A opção `` finder`` permite que você use um :ref:` finder customizado
<custom-find-methods>` para carregar registros associados. Isto permite a você encapsular as suas queries melhor e manter o seu codigo mais enxuto. Existem algumas limitações quando
usando finders para carregar dados em associações que são carregadas usando junções
(belongsTo/hasOne).Somente os seguintes aspectos da consulta serão aplicados a
a consulta do raiz:

- condições WHERE.
- joins adicionais.
- Associações contidas.

Outros aspectos da consulta, tais como colunas selecionadas, ordem, grupo, tendo
e outras sub-declarações, não serão aplicadas à consulta raiz. Associações
que * não * são carregados através de associações (hasMany / belongsToMany), não têm o
acima das restrições e também pode usar formatadores de resultados ou mapa / reduzir funções.

Carregando Associações
----------------------

Uma vez que você definiu as suas associações, você pode :ref:`associações de carga ansiosas
<eager-loading-associations>` ao obter resultados.
