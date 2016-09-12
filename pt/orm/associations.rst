Associações - Conectando tabelas
######################################

Definindo relações entre diferentes objetos de sua aplicação deve ser
um processo natural. Por exemplo, um artigo pode ter muitos comentários, e pertencem
a um autor. Os autores podem ter muitas artigos e comentários. CakePHP faz
gestão destas associações fácil. Os quatro tipos de associação no CakePHP são:
hasOne, hasMany, belongsTo, e belongsToMany.

=============== ===================== =======================================
Relacionamento   Tipo de associação   Exemplo
=============== ===================== =======================================
one to one      hasOne                 Um usuário possui um perfil.
-------------   ---------------------  ---------------------------------------
one to many     hasMany                Um usário possui muitos artigos.
-------------   ---------------------  ---------------------------------------
many to one     belongsTo              Muitos artigos pertence a um usuário.
-------------   ---------------------  ---------------------------------------
many to many    belongsToMany          Tags pertencem a muitos artigos.
=============== =====================  =======================================

Associações são definidas durante o método `` initialize () `` de seu objeto Table. 
Métodos que correspondem ao tipo de associação permitem definir as
associações na sua aplicação. Por exemplo, se quiséssemos definir uma associação belongsTo
em nosso ArticlesTable ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors');
        }

    }

A forma mais simples de qualquer configuração de associação leva o alias de tabela que você deseja
associar. Por padrão todos os detalhes de uma associação usará o
convenções do CakePHP. Se você quiser personalizar a forma como as suas associações são tratadas
você pode fazê-lo com o segundo parâmetro ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'propertyName' => 'person'
            ]);
        }

    }

A mesma tabela pode ser utilizada várias vezes para definir os diferentes tipos de
associações. Por exemplo, considere um caso em que você deseja separar
comentários aprovados e os que não foram moderados ainda ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'className' => 'Comments',
                'conditions' => ['approved' => true]
            ]);

            $this->hasMany('UnapprovedComments', [
                'className' => 'Comments',
                'conditions' => ['approved' => false],
                'propertyName' => 'unapproved_comments'
            ]);
        }
    }

Como você pode ver, especificando a tecla `` className``, é possível usar a
mesma tabela de associações como diferentes para a mesma tabela. Você pode até criar
as mesas auto-associado para criar relações pai-filho ::

    class CategoriesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('SubCategories', [
                'className' => 'Categories',
            ]);

            $this->belongsTo('ParentCategories', [
                'className' => 'Categories',
            ]);
        }
    }

Você pode também criar associações de configuração em massa, fazendo uma única chamada para
`` Table :: addAssociations () ``, que aceita um array contendo um conjunto de
nomes de tabela indexada por tipo de associação como um argumento ::

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

Cada tipo de associação aceita várias associações onde estão as chaves dos
aliases e os valores são dados associação de configuração. Se são utilizadas teclas numéricas
os valores serão tratados como aliases associados.

Associações HasOne
===================

Vamos criar uma tabela de usuários com uma relação hasOne para uma tabela endereços.

Primeiro, suas tabelas de banco de dados precisam ser digitados corretamente. Para uma relação hasOne, 
uma tabela tem de conter uma chave estrangeira que aponta para um
registro na outra. Neste caso, a tabela de endereços conterá um campo
chamado `` user_id ``. O padrão básico é:

**hasOne:** o *outo* model contém a chave estrangeira.

====================== ==================
Relacionamentos         Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    Não é obrigatório seguir as convenções do CakePHP, você pode substituir o uso
     de qualquer foreignKey nas definições de associações. No entanto seguir
     às convenções fará seu código menos repetitivo, mais fácil de ler e
     manter.

Se tivéssemos a as classes ``UsersTable`` e ``AddressesTable``  poderíamos fazer
a associação com o seguinte código ::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses');
        }
    }

Se você precisar de mais controle, você pode definir suas associações usando a sintaxe de array.
Por exemplo, você pode querer limitar a associação para incluir apenas certos
registros ::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses', [
                'className' => 'Addresses',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }

As possíveis chaves do array para associações hasOne incluem:

- **className**: o nome da classe da tabela a ser associado ao modelo atual. 
    Se você estiver definindo um relacionamento 'User hasOne Address', 
    a chave de classe Nome deve ser igual a ' Address '.
- **foreignKey**: o nome da chave estrangeira encontrada na outra tabela. Isto é
   muito útil se você precisa definir múltiplos relacionamentos hasOne. 
   O valor padrão para esta chave é o nome sublinhado, singular da corrente
   modelo, seguida de '\ _id'. 
   No exemplo acima, seria padrão para 'user\_id'.
- **bindingKey**: O nome da coluna na tabela atual, que será utilizada para igualar a 
   `` foreignKey `` externa. Se não for especificado, será usada a chave primária (por exemplo, a coluna id da tabela ``Users``).
- **conditions**: um array de find() com condições compatíveis, tais como
  ``['Addresses.primary' => true]``
- **joinType**: o tipo de join a usar na consulta SQL. 
  Você pode usar INNER se a sua associação hasOne está sempre presente.
- **dependent**: Quando a chave dependente é definida como `` True``, e uma entidade é
   excluída, os registros associados também são apagados. Neste caso, defini-lo
   para `` True`` fará com que a exclusão de um usuário também apague o endereço associado.
- **cascadeCallbacks**: Quando isso e ** dependent ** são `` True``,irá carregar e excluir 
   entidades em cascata de modo a que as chamadas de retorno são propriamente
   disparados. Quando `` False``, `` deleteAll () `` é usado para remover dados associados
   e as chamadas de retorno são acionadas.
- **propertyName**: O nome da propriedade que deve ser preenchido com os dados da
   tabela associada para os resultados da tabela de origem. Por padrão, esta é o
   nome sublinhado e singular da associação de modo `` address`` em nosso exemplo.
- **strategy**: Define a estratégia de consulta para usar. O padrão é 'join'. 
   O outro valor válido é 'select', que utiliza subconsultas.
- **finder**: O método finder para usar ao carregar registros associados.

Uma vez que esta associação tenha sido definida, As operações na tabela, usuários podem
conter o registro de endereço se ele existir ::

    // Em um controller ou método Table
    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
   }

O SQL acima resultaria em ::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

Associações BelongsTo
======================

Agora que temos acesso a dados de endereços da tabela do usuário, vamos definir um
associação belongsTo na tabela de endereços a fim de obter acesso aos dados relacionados
a tabela User. A associação belongsTo é naturalmente complementada por associações hasOne e 
hasMany.

Ao introduzir as suas tabelas de banco de dados para um relacionamento belongsTo, seguir esta
convenção:

**belongsTo:** o *current* model contém a chave estrangeira.

========================= ==================
Relacionamento              Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    Se uma tabela contém uma chave estrangeira, a que pertence a outra Tabela.

Podemos definir a associação belongsTo em nossa tabela endereços da seguinte forma ::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users');
        }
    }

Nós também podemos definir uma relação mais específica utilizando um array de 
sintaxe::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users', [
                'foreignKey' => 'user_id',
                'joinType' => 'INNER',
            ]);
        }
    }

As possíveis chaves do array para associações belongsTo são:    

- **className**: the class name of the model being associated to the current
  model. If you're defining a 'Profile belongsTo User' relationship, the
  className key should equal 'Users'.
- **foreignKey**: the name of the foreign key found in the current table. This
  is especially handy if you need to define multiple belongsTo relationships to
  the same model. The default value for this key is the underscored, singular
  name of the other model, suffixed with ``_id``.
- **bindingKey**: The name of the column in the other table, that will be used
  for matching the ``foreignKey``. If not specified, the primary key (for
  example the id column of the ``Users`` table) will be used.
- **conditions**: an array of find() compatible conditions or SQL strings such
  as ``['Users.active' => true]``
- **joinType**: the type of the join to use in the SQL query, default is LEFT
  which may not fit your needs in all situations, INNER may be helpful when you
  want everything from your main and associated models or nothing at all.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & singular name of the association so ``user`` in our example.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    // In a controller or table method.
    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

The above would emit SQL that is similar to::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


HasMany Associations
====================

An example of a hasMany association is "Article hasMany Comments". Defining this
association will allow us to fetch an article's comments when the article is
loaded.

When creating your database tables for a hasMany relationship, follow this
convention:

**hasMany:** the *other* model contains the foreign key.

========================== ===================
Relation                   Schema
========================== ===================
Article hasMany Comment    Comment.article\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Patient     Patient.doctor\_id
========================== ===================

We can define the hasMany association in our Articles model as follows::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments');
        }
    }

We can also define a more specific relationship using array syntax::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'foreignKey' => 'article_id',
                'dependent' => true,
            ]);
        }
    }

Sometimes you may want to configure composite keys in your associations::

    // Within ArticlesTable::initialize() call
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ]
    ]);

Relying on the example above, we have passed an array containing the desired
composite keys to ``foreignKey``. By default the ``bindingKey`` would be
automatically defined as ``id`` and ``hash`` respectively, but let's assume that
you need to specify different binding fields than the defaults, you can setup it
manually in your ``bindingKeys`` array::

    // Within ArticlesTable::initialize() call
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ],
        'bindingKey' => [
            'whatever_id',
            'whatever_hash'
        ]
    ]);

It is important to note that ``foreignKey`` values refers to the **reviews**
table and ``bindingKey`` values refers to the **articles** table.

Possible keys for hasMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'User hasMany Comment'
  relationship, the className key should equal 'Comments'.
- **foreignKey**: the name of the foreign key found in the other
  table. This is especially handy if you need to define multiple
  hasMany relationships. The default value for this key is the
  underscored, singular name of the actual model, suffixed with
  '\_id'.
- **bindingKey**: The name of the column in the current table, that will be used
  for matching the ``foreignKey``. If not specified, the primary key (for
  example the id column of the ``Articles`` table) will be used.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Comments.visible' => true]``
- **sort**  an array of find() compatible order clauses or SQL
  strings such as ``['Comments.created' => 'ASC']``
- **dependent**: When dependent is set to ``true``, recursive model
  deletion is possible. In this example, Comment records will be
  deleted when their associated Article record has been deleted.
- **cascadeCallbacks**: When this and **dependent** are ``true``, cascaded
  deletes will load and delete entities so that callbacks are properly
  triggered. When ``false``, ``deleteAll()`` is used to remove associated data
  and no callbacks are triggered.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association so ``comments`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The
  other valid value is 'subquery', which replaces the ``IN`` list with an
  equivalent subquery.
- **saveStrategy**: Either 'append' or 'replace'. When 'append' the current
  records are appended to any records in the database. When 'replace' associated
  records not in the current set will be removed. If the foreign key is a null
  able column or if ``dependent`` is true records will be orphaned.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the Articles table
can contain the Comment records if they exist::

    // In a controller or table method.
    $query = $articles->find('all')->contain(['Comments']);
    foreach ($query as $article) {
        echo $article->comments[0]->text;
    }

The above would emit SQL that is similar to::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);

When the subquery strategy is used, SQL similar to the following will be
generated::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);

You may want to cache the counts for your hasMany associations. This is useful
when you often need to show the number of associated records, but don't want to
load all the records just to count them. For example, the comment count on any
given article is often cached to make generating lists of articles more
efficient. You can use the :doc:`CounterCacheBehavior
</orm/behaviors/counter-cache>` to cache counts of associated records.

You should make sure that your database tables do not contain columns that match
association property names. If for example you have counter fields that conflict
with association properties, you must either rename the association property, or
the column name.

BelongsToMany Associations
==========================

An example of a BelongsToMany association is "Article BelongsToMany Tags", where
the tags from one article are shared with other articles.  BelongsToMany is
often referred to as "has and belongs to many", and is a classic "many to many"
association.

The main difference between hasMany and BelongsToMany is that the link between
the models in a BelongsToMany association are not exclusive. For example, we are
joining our Articles table with a Tags table. Using 'funny' as a Tag for my
Article, doesn't "use up" the tag. I can also use it on the next article
I write.

Three database tables are required for a BelongsToMany association. In the
example above we would need tables for ``articles``, ``tags`` and
``articles_tags``.  The ``articles_tags`` table contains the data that links
tags and articles together. The joining table is named after the two tables
involved, separated with an underscore by convention. In its simplest form, this
table consists of ``article_id`` and ``tag_id``.

**belongsToMany** requires a separate join table that includes both *model*
names.

============================ ================================================================
Relationship                 Pivot Table Fields
============================ ================================================================
Article belongsToMany Tag    articles_tags.id, articles_tags.tag_id, articles_tags.article_id
---------------------------- ----------------------------------------------------------------
Patient belongsToMany Doctor doctors_patients.id, doctors_patients.doctor_id,
                             doctors_patients.patient_id.
============================ ================================================================

We can define the belongsToMany association in our Articles model as follows::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags');
        }
    }

We can also define a more specific relationship using array
syntax::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

Possible keys for belongsToMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Article belongsToMany Tag'
  relationship, the className key should equal 'Tags.'
- **joinTable**: The name of the join table used in this
  association (if the current table doesn't adhere to the naming
  convention for belongsToMany join tables). By default this table
  name will be used to load the Table instance for the join/pivot table.
- **foreignKey**: the name of the foreign key found in the current
  model or list in case of composite foreign keys.
  This is especially handy if you need to define multiple
  belongsToMany relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with '\_id'.
- **targetForeignKey**: the name of the foreign key found in the target
  model or list in case of composite foreign keys.
  The default value for this key is the underscored, singular name of
  the target model, suffixed with '\_id'.
- **conditions**: an array of find() compatible conditions.  If you have
  conditions on an associated table, you should use a 'through' model, and
  define the necessary belongsTo associations on it.
- **sort** an array of find() compatible order clauses.
- **dependent**: When the dependent key is set to ``false``, and an entity is
  deleted, the data of the join table will not be deleted.
- **through** Allows you to provide a either the name of the Table instance you
  want used on the join table, or the instance itself. This makes customizing
  the join table keys possible, and allows you to customize the behavior of the
  pivot table.
- **cascadeCallbacks**: When this is ``true``, cascaded deletes will load and
  delete entities so that callbacks are properly triggered on join table
  records. When ``false``, ``deleteAll()`` is used to remove associated data and
  no callbacks are triggered. This defaults to ``false`` to help reduce
  overhead.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association, so ``tags`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The
  other valid value is 'subquery', which replaces the ``IN`` list with an
  equivalent subquery.
- **saveStrategy**: Either 'append' or 'replace'. Defaults to 'replace'.
  Indicates the mode to be used for saving associated entities. The former will
  only create new links between both side of the relation and the latter will
  do a wipe and replace to create the links between the passed entities when
  saving.
- **finder**: The finder method to use when loading associated records.


Once this association has been defined, find operations on the Articles table can
contain the Tag records if they exist::

    // In a controller or table method.
    $query = $articles->find('all')->contain(['Tags']);
    foreach ($query as $article) {
        echo $article->tags[0]->text;
    }

The above would emit SQL that is similar to::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (1, 2, 3, 4, 5)
    );

When the subquery strategy is used, SQL similar to the following will be
generated::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (SELECT id FROM articles)
    );

.. _using-the-through-option:

Using the 'through' Option
--------------------------

If you plan on adding extra information to the join/pivot table, or if you need
to use join columns outside of the conventions, you will need to define the
``through`` option. The ``through`` option provides you full control over how
the belongsToMany association will be created.

It is sometimes desirable to store additional data with a many to many
association. Consider the following::

    Student BelongsToMany Course
    Course BelongsToMany Student

A Student can take many Courses and a Course can be taken by many Students. This
is a simple many to many association. The following table would suffice::

    id | student_id | course_id

Now what if we want to store the number of days that were attended by the
student on the course and their final grade? The table we'd want would be::

    id | student_id | course_id | days_attended | grade

The way to implement our requirement is to use a **join model**, otherwise known
as a **hasMany through** association. That is, the association is a model
itself. So, we can create a new model CoursesMemberships. Take a look at the
following models. ::

    class StudentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
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

The CoursesMemberships join table uniquely identifies a given Student's
participation on a Course in addition to extra meta-information.

Default Association Conditions
------------------------------

The ``finder`` option allows you to use a :ref:`custom finder
<custom-find-methods>` to load associated record data. This lets you encapsulate
your queries better and keep your code DRY'er. There are some limitations when
using finders to load data in associations that are loaded using joins
(belongsTo/hasOne). Only the following aspects of the query will be applied to
the root query:

- WHERE conditions.
- Additional joins.
- Contained associations.

Other aspects of the query, such as selected columns, order, group by, having
and other sub-statements, will not be applied to the root query. Associations
that are *not* loaded through joins (hasMany/belongsToMany), do not have the
above restrictions and can also use result formatters or map/reduce functions.

Loading Associations
--------------------

Once you've defined your associations you can :ref:`eager load associations
<eager-loading-associations>` when fetching results.
