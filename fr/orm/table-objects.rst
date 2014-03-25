.. php:namespace:: Cake\ORM

.. _table-objects:

Les Objets Table
################

.. php:class:: Table

Les objets Table fournissent un accès à la collection des entities stockées
dans une table spécifique. Chaque table dans votre application devra avoir une
classe Table associée qui est sera utilisée pour interagir avec une table
donnée. Si vous n'avez pas besoin de personnaliser le behavior d'une table
donnée, CakePHP va générer une instance Table à utiliser pour vous.

Avant d'essayer d'utiliser les objets Table et l'ORM, vous devriez vous assurer
que vous avez configuré votre
:ref:`database connection <database-configuration>`.

Utilisation Basique
===================

Pour commencer, créez une classe Table. Ces classes se trouvent dans
``App/Model/Table``. Les Tables sont une collection de type model spécifique
aux bases de données relationnelles, et sont l'interface principal pour
votre base de données dans l'ORM de CakePHP. La classe table la plus
basique devrait ressembler à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

Notez que nous ne disons pas à l'ORM quelle table utiliser pour notre class. Par
convention, les objets table vont utiliser une table avec la notation en
minuscule et avec des underscores pour le nom de la classe. Dans l'exemple du
dessus, la table ``articles`` va être utilisée. Si notre classe table était
nommée ``BlogPosts``, votre table serait nommée ``blog_posts``. Vous pouvez
spécifier la table en utilisant la méthode ``table()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->table('my_table');
        }

    }

Aucune convention d'inflection ne sera appliquée quand on spécifie une table.
Par convention, l'ORM s'attend aussi à ce que chaque table ait une clé primaire
avec le nom de ``id``. Si vous avez besoin de modifier ceci, vous pouvez
utiliser la méthode ``primaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->primaryKey('my_id');
        }
    }

Comme vu dans les exemples ci-dessus, les objets Table ont une méthode
``initialize()`` qui est appelé à la fin du constructeur. Il est recommandé que
vous utilisiez cette méthode pour faire la logique d'initialisation au lieu
de surcharger le constructeur.

Obtenir les Instances d'une Classe Table
----------------------------------------

Avant de pouvoir requêter sur une table, vous aurez besoin d'obtenir une
instance de la table. Vous pouvez faire ceci en utilisant la classe
``TableRegistry``::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

La classe TableRegistry fournit les divers dépendances pour construire la table,
et maintenir un registry de toutes les instances de table construites en
le facilitant pour construire les relations et configurer l'ORM. Regardez
:ref:`table-registry-usage` pour plus d'informations.

Récupérer Toutes les Entities
-----------------------------

Le meilleur moyen de récupérer les entities à partir d'un objet table est
d'utiliser la méthode ``find``. Elle vous permet d'accéder aux divers méthodes
finder intégrées et à vos propres méthodes personnalisées. Regardez
:ref:`custom-find-methods` pour plus d'informations::

    $query = $articles->find('all');
    foreach ($query as $row) {
        // Faire quelque chose
    }

Les objets Entity représentent un enregitrement unique ou une ligne dans votre
base de données. Les Entities vous permettent de définir un comportement
personnalisé pour un enregistrement et le model  du domaine de votre
application. Regardez la documentation sur les :ref:`entities` pour plus
d'informations sur la création de vos objets entity.

Personnalisaliser la Classe Entity qu'une Table Utilise
-------------------------------------------------------

Par défaut, les objets table utilisent une classe entity basée sur les
conventions de nommage. Par exemple, si votre classe de table est appelée
``ArticlesTable`` l'entity sera ``Article``. Si la classe table ést
``PurchaseOrdersTable`` l'entity sera ``PurchaseOrder``. Cependant si vous
souhaitez utiliser une entity qui ne suit pas les conventions, vous pouvez
utiliser la méthode ``entityClass`` pour changer les choses::

    class PurchaseOrdersTable extends Table {
        public function initialize(array $config) {
            $this->entityClass('App\Model\PO');
        }
    }

.. _table-associations:

Construire les Associations
===========================

Définir les relations entre les différents objets dans votre application
devra être un processus naturel. Par exemple, un article peut avoir plusieurs
comments, et belong to à un author. Les Authors peuvent avoir many articles et
les comments. CakePHP rend la gestion de ces associations facilement. Les
quatres types d'association dans CakePHP sont:
hasOne, hasMany, belongsTo, and belongsToMany.

============= ===================== =======================================
Relationship  Association Type      Example
============= ===================== =======================================
one to one    hasOne                Un user a un profile.
------------- --------------------- ---------------------------------------
one to many   hasMany               Un user peut avoir plusieurs articles.
------------- --------------------- ---------------------------------------
many to one   belongsTo             Plusieurs articles appartiennent à un user.
------------- --------------------- ---------------------------------------
many to many  belongsToMany         Les Tags appartiennent aux articles.
============= ===================== =======================================

Les Associations sont définis durant la méthode ``inititalize()`` de votre objet
table. Les méthodes matchant le type d'association vous permet de définir les
associations dans votre application. Par exemple, si vous voulez définir une
association belongsTo dans notre ArticlesTable::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->belongsTo('Authors');
        }

    }

The simplest form of any association setup takes the table alias you want to
associate with. By default all of the details of an association will use the
CakePHP conventions. If you want to customize how your associations are handled
you can do so with the second parameter::

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'propertyName' => 'person'
            ]);
        }

    }

HasOne Associations
-------------------

Mettons en place un model User avec une relation de type hasOne vers un model
Address.

Tout d’abord, les tables de votre base de données doivent être saisies
correctement. Pour qu’une relation de type hasOne fonctionne, une table doit
contenir une clé étrangère qui pointe vers un enregistrement de l’autre. Dans
notre cas la table profiles contiendra un champ nommé ``user_id``. Le motif de
base est :

**hasOne:** l'*autre* model contient la clé étrangère.

====================== ==================
Relation               Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    Il n’est pas obligatoire de suivre les conventions de CakePHP, vous pouvez
    facilement outrepasser l’utilisation de toute clé étrangère dans les
    définitions de vos associations. Néanmoins, coller aux conventions donnera
    un code moins répétitif, plus facile à lire et à maintenir.

Si nous avions les classes ``UsersTable`` et ``AddressesTable`` faites, nous
pourrions faire l'association avec le code suivant::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses');
        }
    }

Si vous avez besoin de plus de contrôle, vous pouvez définir vos associations
en utilisant la syntaxe des tableaux. Par exemple, vous voudrez peut-être
limiter l’association pour inclure seulement certains enregistrements::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses', [
                'className' => 'Addresses',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }

Les clés possibles pour les tableaux d’association incluent:

- **className**: le nom de la classe de la table que l’on souhaite associer au
  model actuel. Si l’on souhaite définir la relation 'User a une Address', la
  valeur associée à la clé ‘className’ devra être ‘Addresses’.
- **foreignKey**: le nom de la clé etrangère que l’on trouve dans l’autre model.
  Ceci sera particulièrement pratique si vous avez besoin de définir des
  relations hasOne multiples. La valeur par défaut de cette clé est le nom du
  model actuel (avec des underscores) suffixé avec '\_id'. Dans l’exemple
  ci-dessus la valeur par défaut aurait été 'user\_id'.
- **conditions**: un tableau des conditions compatibles avec find() ou un
  fragment de code SQL tel que ``['Addresses.primary' => true]``.
- **joinType**: le type de join à utiliser dans la requête SQL, par défaut
  à INNER. Vous voulez peut-être utiliser LEFT si votre association hasOne est
  optionnelle.
- **dependent**: Quand la clé dependent est définie à true, et qu'une
  entity est supprimée, les enregistrements du model associé sont aussi
  supprimés. Dans ce cas, nous le définissons à true pour que la suppression
  d'un User supprime aussi son Address associée.
- **cascadeCallbacks**: Quand ceci et **dependent** sont à true, les
  suppressions en cascade vont charger et supprimer les entities pour que les
  callbacks soient attrapés correctement. Quand il est à false, ``deleteAll()``
  est utilisée pour retirer les données associées et que aucun callbacks ne soit
  récupéré.
- **propertyName**: Le nom de la propriété qui doit être rempli avec les données
  d'une table associée dans les résultats d'une table source. Par défaut, c'est
  un nom en underscore et singulier de l'association, donc ``address`` dans
  notre exemple.

Une fois que cette association a été définie, les opérations find sur la table
Users peut contenir l'enregistrement Address, si il existe::

    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
   }

Ce qui est au-dessus rendra un SQL qui est similaire à::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

Associations BelongsTo
----------------------

Maintenant que nous avons un accès des données Address à partir de la table
User, définissons une association belongsTo dans la table Addresses afin
d'avoir un accès aux données liés de l'User. L'association belongsTo est un
complément naturel aux associations hasOne et hasMany.

When keying your database tables for a belongsTo relationship,
follow this convention:

**belongsTo:** the *current* model contains the foreign key.

========================= ==================
Relation                  Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    If a Table contains a foreign key, it belongs to the other
    Table.

We can define the belongsTo association in our Addresses table as follows::

    class Addresses extends Table {

        public function initialize(array $config) {
            $this->belongsTo('Users');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Addresses extends Table {

        public function initialize(array $config) {
            $this->belongsTo('Users', [
                'foreignKey' => 'userid',
                'joinType' => 'INNER',
            ]);
        }
    }

Possible keys for belongsTo association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Profile belongsTo User'
  relationship, the className key should equal 'Users'.
- **foreignKey**: the name of the foreign key found in the current model. This
  is especially handy if you need to define multiple belongsTo relationships to
  the same model. The default value for this key is the underscored, singular
  name of the other model, suffixed with ``_id``.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Users.active' => true]``
- **joinType**: the type of the join to use in the SQL query, default
  is LEFT which may not fit your needs in all situations, INNER may
  be helpful when you want everything from your main and associated
  models or nothing at all.
- **propertyName**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``user`` in our example.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

The above would emit SQL that is similar to::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


HasMany Associations
--------------------

An example of a hasMany association is "Article hasMany Comments".
Defining this association will allow us to fetch an article's comments
when the article is loaded.

When creating your database tables for a hasMany relationship, follow
this convention:

**hasMany:** the *other* model contains the foreign key.

========================== ===================
Relation                   Schema
========================== ===================
Article hasMany Comment    Comment.user\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Appointment Patient.doctor\_id
========================== ===================

We can define the hasMany association in our Articles model as follows::

    class Addresses extends Table {

        public function initialize(array $config) {
            $this->hasMany('Comments');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Addresses extends Table {

        public function initialize(array $config) {
            $this->hasMany('Comments', [
                'foreignKey' => 'articleid',
                'dependent' => true,
            ]);
        }
    }

Possible keys for hasMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'User hasMany Comment'
  relationship, the className key should equal 'Comment'.
- **foreignKey**: the name of the foreign key found in the other
  model. This is especially handy if you need to define multiple
  hasMany relationships. The default value for this key is the
  underscored, singular name of the actual model, suffixed with
  '\_id'.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Comments.visible' => true]``
- **sort**  an array of find() compatible order clauses or SQL
  strings such as ``['Comments.created' => 'ASC']``
- **dependent**: When dependent is set to true, recursive model
  deletion is possible. In this example, Comment records will be
  deleted when their associated Article record has been deleted.
- **cascadeCallbacks**: When this and **dependent** are true, cascaded deletes will
  load and delete entities so that callbacks are properly triggered. When false,
  ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered.
- **propertyName**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & plural name of
  the association so ``comments`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'SELECT'. The other
  valid value is 'subquery', which replaces the ``IN`` list with an equivalent
  subquery.

Once this association has been defined, find operations on the Articles table can
contain the Comment records if they exist::

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
</core-libraries/behaviors/counter-cache>` to cache counts of associated
records.

BelongsToMany Associations
--------------------------

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

    class Articles extends Table {

        public function initialize(array $config) {
            $this->belongsToMany('Tags');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Articles extends Table {

        public function initialize(array $config) {
            $this->belongsToMany('Tags', [
                'joinTable' => 'article_tag',
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
  model. This is especially handy if you need to define multiple
  belongsToMany relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with '\_id'.
- **targetForeignKey**: the name of the foreign key found in the target
  model. The default value for this key is the underscored, singular name of
  the target model, suffixed with '\_id'.
- **conditions**: an array of find() compatible conditions.  If you have
  conditions on an associated table, you should use a 'through' model, and
  define the necessary belongsTo associations on it.
- **sort** an array of find() compatible order clauses.
- **through** Allows you to provide a either the name of the Table instance you
  want used on the join table, or the instance itself. This makes customizing
  the join table keys possible, and allows you to customize the behavior of the
  pivot table.
- **cascadeCallbacks**: When this is true, cascaded deletes will load and delete
  entities so that callbacks are properly triggered on join table records. When
  false, ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered. This defaults to false to help reduce overhead.
- **propertyName**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & plural name of
  the association, so ``tags`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'SELECT'. The other
  valid value is 'subquery', which replaces the ``IN`` list with an equivalent
  subquery.
- **saveStrategy**: Either 'append' or 'replace'. Indicates the mode to be used
  for saving associated entities. The former will only create new links
  between both side of the relation and the latter will do a wipe and
  replace to create the links between the passed entities when saving.


Once this association has been defined, find operations on the Articles table can
contain the Tag records if they exist::

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

Using the 'through' Option
~~~~~~~~~~~~~~~~~~~~~~~~~~

If you plan on adding extra information to the join/pivot table, or if you
need to use join columns outside of the conventions, you will need to define the
``through`` option. The ``through`` option provides you full control over how the
belongsToMany association will be created.

It is sometimes desirable to store additional data with a many to
many association. Consider the following::

    Student BelongsToMany Course
    Course BelongsToMany Student

A Student can take many Courses and a Course can be taken by many Students. This
is a simple many to many association. The following table would suffice::

    id | student_id | course_id

Now what if we want to store the number of days that were attended
by the student on the course and their final grade? The table we'd
want would be::

    id | student_id | course_id | days_attended | grade

The way to implement our requirement is to use a **join model**,
otherwise known as a **hasMany through** association.
That is, the association is a model itself. So, we can create a new
model CoursesMemberships. Take a look at the following models.::

    class StudentsTable extends Table {
        public function initialize(array $config) {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table {
        public function initialize(array $config) {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table {
        public function initialize(array $config) {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

The CoursesMemberships join table uniquely identifies a given
Student's participation on a Course in addition to extra
meta-information.

Loading Entities
================

While table objects provide an abstraction around a 'repository' or collection of
objects, when you query for individual records you get 'entity' objects. While
this section discusses the different ways you can find and load entities, you
should read the :doc:`/orm/entities` section for more information on entities.

Getting a Single Entity by Primary Key
--------------------------------------

.. php:method:: get($id, $options = [])

It is often convienent to load a single entity from the database when editing or
view entities and their related data. You can do this easily by using
``get()``::

    // Get a single article
    $article = $articles->get($id);

    // Get a single article, and related comments
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

If the get operation does not find any results
a ``Cake\ORM\Error\RecordNotFoundException`` will be raised. You can either
catch this exception yourself, or allow CakePHP to convert it into a 404 error.

Using Finders to Load Data
--------------------------

.. php:method:: find($type, $options = [])

Before you can work with entities, you'll need to load them. The easiest way to
do this is using the ``find`` method. The find method provides an easy and
extensible way to find the data you are interested in::

    // Find all the articles
    $query = $articles->find('all');

The return value of any ``find`` method is always
a :php:class:`Cake\\ORM\\Query` object. The Query class allows you to further
refine a query after creating it. Query objects are evaluated lazily, and do not
execute until you start fetching rows, convert it to an array, or when the
``all()`` method is called::

    // Find all the articles.
    // At this point the query has not run.
    $query = $articles->find('all');

    // Iteration will execute the query.
    foreach ($query as $row) {
    }

    // Calling execute will execute the query
    // and return the result set.
    $results = $query->all();

    // Converting the query to an array will execute it.
    $results = $query->toArray();

Once you've started a query you can use the :doc:`/orm/query-builder` interface
to build more complex queries, adding additional conditions, limits, or include
associations using the fluent interface::

    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

You can also provide many commonly used options to ``find()``. This can help
with testing as there are fewer methods to mock::

    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

The list of options supported by find() are:

- ``conditions`` provide conditions for the WHERE clause of your query.
- ``limit`` Set the number of rows you want.
- ``offset`` Set the page offset you want. You can also use ``page`` to make
  the calculation simpler.
- ``contain`` define the associations to eager load.
- ``fields`` limit the fields loaded into the entity. Only loading some fields
  can cause entities to behave incorrectly.
- ``group`` add a GROUP BY clause to your query. This is useful when using
  aggregating functions.
- ``having`` add a HAVING clause to your query.
- ``join`` define additional custom joins.
- ``order`` order the result set.

Any options that are not in this list will be passed to beforeFind listeners
where they can be used to modify the query object. You can use the
``getOptions`` method on a query object to retrieve the options used.

.. _table-find-first:

Getting the First Result
------------------------

The ``first()`` method allows you to fetch only the first row from a query. If
the query has not been executed, a ``LIMIT 1`` clause will be applied::

    $query = $articles->find('all', [
        'order' => ['Article.created' => 'DESC']
    ]);
    $row = $query->first();

This approach replaces ``find('first')`` in previous versions of CakePHP. You
may also want to use the ``get()`` method if you are loading entities by primary
key.

.. _table-find-list:

Finding Key/Value Pairs
-----------------------

It is often useful to generate an associative array of data from your application's
data. For example, this is very useful when creating `<select>` elements. CakePHP
provides a simple to use method for generating 'lists' of data::

    $query = $articles->find('list');
    $data = $query->toArray();

    // Data now looks like
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

With no additional options the keys of ``$data`` will be the primary key of your
table, while the values will be the 'displayField' of the table. You can use the
``displayField()`` method on a table object to configure the display field on
a table::

    class Articles extends Table {

        public function initialize(array $config) {
            $this->displayField('title');
        }
    }

When calling ``list`` you can configure the fields used for the key and value with
the ``fields`` option::

    $query = $articles->find('list', [
        'fields' => ['slug', 'title']
    ]);
    $data = $query->toArray();

    // Data now looks like
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Results can be grouped into nested sets. This is useful when you want
bucketed sets, or want to build ``<optgroup>`` elements with FormHelper::

    $query = $articles->find('list', [
        'fields' => ['author_id', 'slug', 'title'],
        'groupField' => ['author_id']
    ]);
    $data = $query->toArray();

    // Data now looks like
    $data = [
        1 => [
            'first-post' => 'First post',
            'second-article-i-wrote' => 'Second article I wrote',
        ],
        2 => [
            // More data.
        ]
    ];

.. _custom-find-methods:

Custom Finder Methods
---------------------

The examples above show how to use the built-in ``all`` and ``list`` finders.
However, it is possible and recommended that you implement your own finder
methods. Finder methods are the ideal way to package up commonly used queries,
allowing you to abstract query details into a simple to use method. Finder
methods are defined by creating methods following the convention of ``findFoo``
where ``Foo`` is the name of the finder you want to create. For example if we
wanted to add a finder to our articles table for finding published articles we
would do the following::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function findPublished(Query $query, array $options = []) {
            $query->where([
                'Articles.published' => true,
                'Articles.moderated' => true
            ]);
            return $query;
        }

    }

    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published');

Finder methods can modify the query as required, or use the
``$options`` to customize the finder operation with relevant application logic.
You can also 'stack' finders, allowing you to express complex queries
effortlessly. Assuming you have both the 'published' and 'recent' finders, you
could do the following::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

While all the examples so far have show finder methods on table classes, finder
methods can also be defined on :doc:`/orm/behaviors`.

If you need to modify the results after they have been fetched you should use
a :ref:`map-reduce` function to modify the results. The map reduce features
replace the 'afterFind' callback found in previous versions of CakePHP.

Dynamic Finders
---------------

CakePHP's ORM provides dynamically constructed finder methods which allow you to
easily express simple queries with no additional code. For example if you wanted
to find a user by username you could do::

    // The following two calls are equal.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

When using dynamic finders you can constrain on multiple fields::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

You can also create ``OR`` conditions::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

While you can use either OR or AND conditions, you cannot combine the two in
a single dynamic finder. Other query options like ``contain`` are also not
supported with dynamic finders. You should use :ref:`custom-find-methods` to
encapsulate more complex queries.  Lastly, you can also combine dynamic finders
with custom finders::

    $query = $users->findTrollsByUsername('bro');

The above would translate into the following::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

.. note::

    While dynamic finders make it simple to express queries, they come with some
    additional performance overhead.


Eager Loading Associations
--------------------------

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results.

.. start-contain

Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you define eager loaded associations using the 'contain' method::

    // As an option to find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // As a method on the query objecy
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

The above will load the related author and comments for each article in the
result set. You can load nested associations using nested arrays to define the
associations to be loaded::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

Alternatively, you can express nested associations using the dot notation::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

You can eager load associations as deep as you like::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

Passing Conditions to Contain
-----------------------------

When using ``contain`` you are able to restrict the data returned by the
associations and filter them by conditions::

    $query = $articles->find()->contain([
        'Comments' => function($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

Is is also possible to restrict deeply nested associations using the dot
notation::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

If you have defined some custom finder methods in your associated table, you can
use them inside ``contain``::

    // Bring all articles, but only bring the comments that are approved and
    // popular
    $query = $articles->find()->contain([
        'Comments' => function($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    For ``BelongsTo`` and ``HasOne`` associations only the ``where`` and
    ``select`` clauses are used when loading the associated records. For the
    rest of the association types you can use every clause that the query object
    provides.

If you need full control over the query that is generated, you can tell ``contain``
to not append the ``foreignKey`` constraints to the generated query. In that
case you should use an array passing ``foreignKey`` and ``queryBuilder``::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => funtction($q) {
                return $q->where(...) // Full conditions for filtering
            }
        ]
    ]);

Using 'matching' when Finding Results
-------------------------------------

A fairly common query case with associations is finding records 'matching'
specific associated data. For example if you have 'Articles belongsToMany Tags'
you will probably want to find Articles that have the CakePHP tag. This is
extremely simple to do with the ORM in CakePHP::

    $query = $articles->find();
    $query->matching('Tags', function($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

You can apply this strategy to HasMany associations as well. For example if
'Authors HasMany Articles', you could find all the authors with recently
published articles using the following::

    $query = $authors->find();
    $query->matching('Articles', function($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

Filtering by deep associations is surprisingly easy, and the syntax should be
already familiar to you::

    $query = $products->find()->matching([
        'Shops.Cities.Countries' => function($q) {
            return $q->where(['Country.name' => 'Japan'])
        }
    ]);

    // Bring unique articles that were commented by 'markstory'
    $query = $articles->find()->matching('Comments.Users', function($q) {
        return $q->where(['username' => 'markstory'])
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't filter them already. This might be the case, for example,
    when the same users comments more than once on a single article.

.. end-contain

Lazy Loading Associations
-------------------------

While CakePHP makes it easy to eager load your associations, there may be cases
where you need to lazy-load associations. You should refer to the
:ref:`lazy-load-associations` section for more information.

Caching Loaded Results
----------------------

When fetching entities that don't change often you may want to cache the
results. The ``Query`` class makes this simple::

    $query->cache('recent_articles');

Will enable caching on the query's result set. If only one argument is provided
to ``cache()`` then the 'default' cache configuration will be used. You can
control which caching configuration is used with the second parameter::

    // String config name.
    $query->cache('recent_articles', 'dbResults');

    // Instance of CacheEngine
    $query->cache('recent_articles', $memcache);

In addition to supporting static keys, the ``cache()`` method accepts a function
to generate the key. The function you give it will receive the query as an
argument. You can then read aspects of the query to dynamically generate the
cache key::

    // Generate a key based on a simple checksum
    // of the query's where clause
    $query->cache(function($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

The cache method makes it simple to add cached results to your custom finders or
through event listeners.

When the results for a cached query are fetched the following happens:

1. The ``Model.beforeFind`` event is triggered.
2. If the query has results set, those will be returned.
3. The cache key will be resolved and cache data will be read. If the cache data
   is not empty, those results will be returned.
4. If the cache misses, the query will be executed and a new ``ResultSet`` will be
   created. This ``ResultSet`` will be written to the cache and returned.

.. note::

    You cannot cache a streaming query result.

Working with Result Sets
------------------------

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results. If you need to disable
buffering because you are working with a data set that does not fit into memory you
can disable buffering on the query to stream results::

    $query->bufferResults(false);

.. warning::

    Streaming results is not possible when using SQLite, or queries with eager
    loaded hasMany or belongsToMany associations.

Result sets allow you to easily cache/serialize or JSON encode results for API results::

    $results = $query->all();

    // serialized
    $serialized = serialize($results);

    // Cache
    Cache::write('my_results', $results);

    // json
    $json = json_encode($results);

Both serializing and JSON encoding result sets work as you would expect. The
serialized data can be unserialized into a working result set. Converting to
JSON respects hidden & virtual field settings on all entity objects
within a result set.

In addition to making serialization easy, result sets are a 'Collection' object and
support the same methods that :ref:`collection objects<collection-objects>`
do. For example, you can extract a list of unique tags on a collection of
articles quite easily::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find()->contain(['Tags']);

    $reducer = function($output, $value) {
        if (!in_array($value, $output)) {
            $output[] = $value;
        }
        return $output;
    };

    $uniqueTags = $query->all()
        ->extract('tags.name')
        ->reduce($reducer, []);

The :doc:`/core-libraries/collections` chapter has more detail on what can be
done with result sets using the collections features.

Validating Entities
===================

.. php:method:: validate(Entity $entity, array $options = [])

While entities are validated as they are saved, you may also want to validate
entities before attempting to do any saving. Validating entities before
saving is often useful from the context of a controller, where you want to show
all the error messages for an entity and its related data::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($this->request->data());
    $valid = $articles->validate($article, [
        'associated' => ['Comments', 'Author']
    ]);
    if ($valid) {
        $articles->save($article, ['validate' => false]);
    } else {
        // Do work to show error messages.
    }

The ``validate`` method returns a boolean indicating whether or not the entity
& related entities are valid. If they are not valid, any validation errors will
be set on the entities that had validation errors. You can use the
:php:meth:`~Cake\\ORM\\Entity::errors()` to read any validation errors.

When you need to pre-validate multiple entities at a time, you can use the
``validateMany`` method::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());
    if ($articles->validateMany($entities)) {
        foreach ($entities as $entity) {
            $articles->save($entity, ['validate' => false]);
        }
    } else {
        // Do work to show error messages.
    }

Much like the ``newEntity()`` method, ``validate()`` and ``validateMany()``
methods allow you to specify which associations are validated, and which
validation sets to apply using the ``options`` parameter::

    $valid = $articles->validate($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);

.. _saving-entities:

Saving Entities
===============

.. php:method:: save(Entity $entity, array $options = [])

When saving request data to your database you need to first hydrate a new entity
using ``newEntity()`` for passing into ``save()``. For example::
  
  // In a controller
  $articles = TableRegistry::get('Articles');
  $article = $articles->newEntity($this->request->data);
  if ($articles->save($article)) {
      // ...
  }

The ORM uses the ``isNew()`` method on an entity to determine whether or not an
insert or update should be performed. If the ``isNew()`` method returns ``null``
and the entity has a primary key value, an 'exists' query will be issued.

Once you've loaded some entities you'll probably want to modify them and update
your database. This is a pretty simple exercise in CakePHP::

    $articles = TableRegistry::get('Articles');
    $article = $articles->find('all')->where(['id' => 2])->first();

    $article->title = 'My new title';
    $articles->save($article);

When saving, CakePHP will apply your validation rules, and wrap the save operation
in a database transaction. It will also only update properties that have
changed. The above ``save()`` call would generate SQL like::

    UPDATE articles SET title = 'My new title' WHERE id = 2;

If you had a new entity, the following SQL would be generated::

    INSERT INTO articles (title) VALUES ('My new title');

When an entity is saved a few things happen:

1. Validation will be started if not disabled.
2. Validation will trigger the ``Model.beforeValidate`` event. If this event is
   stopped the save operation will fail and return false.
3. Validation will be applied. If validation fails, the save will be aborted,
   and save() will return false.
4. The ``Model.afterValidate`` event will be triggered.
5. The ``Model.beforeSave`` event is dispatched. If it is stopped, the save will
   be aborted, and save() will return false.
6. Parent associations are saved. For example, any listed belongsTo
   associations will be saved.
7. The modified fields on the entity will be saved.
8. Child associations are saved. For example, any listed hasMany, hasOne, or
   belongsToMany associations will be saved.
9. The ``Model.afterSave`` event will be dispatched.

The ``save()`` method will return the modified entity on success, and ``false``
on failure. You can disable validation and/or transactions using the ``$options`` argument for
save::

    $articles->save($article, ['validate' => false, 'atomic' => false]);

In addition to disabling validation you can choose which validation rule set you
want applied::

    $articles->save($article, ['validate' => 'update']);

The above would call the ``validationUpdate`` method on the table instance to
build the required rules.  By default the ``validationDefault`` method will be
used. A sample validator method for our articles table would be::

    class ArticlesTable extends Table {
        public function validationUpdate($validator) {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => 'You need to provide a title',
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => 'A body is required'
                ]);
            return $validator;
        }
    }

You can have as many validation sets as you need. See the :doc:`validation
chapter </core-libraries/validation>` for more information on building
validation rule-sets.

Validation rules can use functions defined on any known providers. By default
CakePHP sets up a few providers:

1. Methods on the table class, or its behaviors are available on the ``table``
   provider.
2. Methods on the entity class, are available on the ``entity`` provider.
3. The core :php:class:`~Cake\\Validation\\Validation` class is setup as the
   ``default`` provider.

When a validation rule is created you can name the provider of that rule. For
example, if your entity had a 'isValidRole' method you could use it as
a validation rule::

    class UsersTable extends Table {

        public function validationDefault($validator) {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => 'You need to provide a valid role',
                    'provider' => 'entity',
                ]);
            return $validator;
        }

    }


Saving Associations
-------------------

When you are saving an entity, you can also elect to save some or all of the
associated entities. By default all first level entities will be saved. For
example saving an Article, will also automatically update any dirty entities
that are directly related to articles table.

You can fine tune which associations are saved by using the ``associated``
option::

    // Only save the comments association
    $articles->save($entity, ['associated' => ['Comments']);

You can define nested ``associated`` options to save distant or deeply nested
associations::

    // Save the company, the employees and related addresses for each of them.
    // For employees use the 'special' validation group
    $companies->save($entity, [
      'associated' => [
        'Employees' => [
          'associated' => ['Addresses'],
          'validate' => 'special',
        ]
      ]
    ]);

Your entities should be in the structured in the same way as they are when
loaded from the database.

Saving BelongsTo Associations
-----------------------------

When saving belongsTo associations, the ORM expects a single nested entity at
the singular, camel cased version the association name. For
example::

    use App\Model\Entity\Article;
    use App\Model\Entity\User;

    $article = new Article(['title' => 'First post']);
    $article->user = new User(['id' => 1, 'username' => 'mark']);

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

Saving HasOne Associations
--------------------------

When saving hasOne associations, the ORM expects a single nested entity at the
singular, camel cased version the association name. For example::


    use App\Model\Entity\User;
    use App\Model\Entity\Profile;

    $user = new User(['id' => 1, 'username' => 'cakephp']);
    $user->profile = new Profile(['twitter' => '@cakephp']);

    $users = TableRegistry::get('Users');
    $users->save($user);

Saving HasMany Associations
---------------------------

When saving hasOne associations, the ORM expects an array of entities at the
plural, camel cased version the association name. For example::

    use App\Model\Entity\Article;
    use App\Model\Entity\Comment;

    $article = new Article(['title' => 'First post']);
    $article->comments = [
        new Comment(['body' => 'Best post ever']),
        new Comment(['body' => 'I really like this.']),
    ];

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

When saving hasMany associations, associated records will either be updated, or
inserted. The ORM will not remove or 'sync' a hasMany association.

Saving BelongsToMany Associations
---------------------------------

When saving hasOne associations, the ORM expects an array of entities at the
plural, camel cased version the association name. For example::

    use App\Model\Entity\Article;
    use App\Model\Entity\Tag;

    $article = new Article(['title' => 'First post']);
    $article->tags = [
        new Tag(['tag' => 'CakePHP']),
        new Tag(['tag' => 'Framework']),
    ];

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

When converting request data into entities, the ``newEntity`` and
``newEntities`` methods will handle both arrays of properties, as well as a list
of ids at the ``_ids`` key. Using the ``_ids`` key makes it easy to build a 
select box or checkbox based form controls for belongs to many associations. See
the :ref:`converting-request-data` section for more information.

When saving belongsToMany associations, you have the choice between 2 saving
strategies:

append
    Only new links will be created between each side of this association. It
    will not destroy existing links even though they may not be present in the
    array of entities to be saved.
replace
    When saving, existing links will be removed and new links will be created in
    the joint table. If there are existing link in the database to some of the
    entities intended to be saved, those links will be updated, not deleted and
    then re-saved.

By default the ``replace`` strategy is used.

Saving Additional Data to the Joint Table
-----------------------------------------

In some situations the table joining your BelongsToMany association, will have
additional columns on it. CakePHP makes it simple to save properties into these
columns. Each entity in a belongsToMany association has a ``_joinData`` property
that contains the additional columns on the joint table. This data can be either
an array or an Entity instance. For example if Students BelongsToMany Courses,
we could have a joint table that looks like::

    id | student_id | course_id | days_attended | grade

When saving data you can populate the additional columns on the joint table by
setting data to the ``_joinData`` property::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

The ``_joinData`` property can be either an entity, or an array of data if you
are saving entities built from request data.

Bulk Updates
------------

.. php:method:: updateAll($fields, $conditions)

There may be times when updating rows individually is not efficient or
necessary.  In these cases it is more efficient to use a bulk-update to modify
many rows at once::

    // Publish all the unpublished articles.
    function publishAllUnpublished() {
        $this->updateAll(['published' => true], ['published' => false]);
    }

If you need to do bulk updates and use SQL expressions, you will need to use an
expression object as ``updateAll()`` uses prepared statements under the hood::

    function incrementCounters() {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

A bulk-update will be considered successful if 1 or more rows are updated.

.. warning::

    updateAll will *not* trigger beforeSave/afterSave events. If you need those
    first load a collection of records and update them.

Deleting Entities
=================

.. php:method:: delete(Entity $entity, $options = [])

Once you've loaded an entity you can delete it by calling the originating
table's delete method::

    $entity = $articles->find('all')->where(['id' => 2]);
    $result = $articles->delete($entity);

When deleting entities a few things happen:

1. The ``Model.beforeDelete`` event is triggered. If this event is stopped, the
   delete will be aborted and the event's result will be returned.
2. The entity will be deleted.
3. All dependent associations will be deleted. If associations are being deleted
   as entities, additional events will be dispatched.
4. Any junction table records for BelongsToMany associations will be removed.
5. The ``Model.afterDelete`` event will be triggered.

By default all deletes happen within a transaction. You can disable the
transaction with the atomic option::

    $result = $articles->delete($entity, ['atomic' => false]);

Cascading Deletes
-----------------

When deleting entities, associated data can also be deleted. If your HasOne and
HasMany associations are configured as ``dependent``, delete operations will
'cascade' to those entities as well. By default entities in associated tables
are removed using :php:meth:`~Cake\\ORM\Table::deleteAll()`. You can elect to
have the ORM load related entities, and delete them individually by setting the
``cascadeCallbacks`` option to true. A sample HasMany association with both
these options enabled would be::

    $this->hasMany('Comments', [
        'dependent' => true,
        'cascadeCallbacks' => true,
    ]);

.. note::

    Setting ``cascadeCallbacks`` to true, results in considerably slower deletes
    when compared to bulk deletes. The cascadeCallbacks option should only be
    enabled when your application has important work handled by event listeners.

Bulk Deletes
------------

.. php:method:: deleteAll($conditions)

There may be times when deleting rows one by one is not efficient or useful.
In these cases it is more performant to use a bulk-delete to remove many rows at
once::

    // Delete all the spam
    function destroySpam() {
        return $this->deleteAll(['is_spam' => true]);
    }

A bulk-delete will be considered successful if 1 or more rows are deleted.

.. warning::

    deleteAll will *not* trigger beforeDelete/afterDelete events. If you need those
    first load a collection of records and delete them.

.. _table-callbacks:

Lifecycle Callbacks
===================

As you have seen above table objects trigger a number of events. Events are
useful if you want to hook into the ORM and add logic in without subclassing or
overriding methods. Event listeners can be defined in table or behavior classes.
You can also use a table's event manager to bind listeners in.

When using callback methods behaviors attached in the
``initialize`` method will have their listeners fired **before** the table
callback methods are triggered. This follows the same sequencing as controllers
& components.

To add an event listener to a Table class or Behavior simply implement the
method signatures as described below. See the :doc:`/core-libraries/events` for
more detail on how to use the events subsystem.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, array $options, boolean $primary)

The ``Model.beforeFind`` event is fired before each find operation. By stopping
the event and supplying a return value you can bypass the find operation
entirely. Any changes done to the $query instance will be retained for the rest
of the find. The ``$primary`` parameter indicates whether or not this is the root
query, or an associated query. All associations participating in a query will
have a ``Model.beforeFind`` event triggered. For associations that use joins,
a dummy query will be provided. In your event listener you can set additional
fields, conditions, joins or result formatters. These options/features will be
copied onto the root query.

You might use this callback to restrict find operations based on a user's role,
or make caching decisions based on the current load.

In previous versions of CakePHP there was an ``afterFind`` callback, this has
been replaced with the :ref:`map-reduce` features and entity constructors.

beforeValidate
--------------

.. php:method:: beforeValidate(Event $event, Entity $entity, array $options, Validator $validator)

The ``Model.beforeValidate`` method is fired before an entity is validated. By
stopping this event, you can abort the validate + save operations.

afterValidate
-------------

.. php:method:: afterValidate(Event $event, Entity $entity, array $options, Validator $validator)

The ``Model.afterValidate`` event is fired after an entity is validated.

beforeSave
----------

.. php:method:: beforeSave(Event $event, Entity $entity, array $options)

The ``Model.beforeSave`` event is fired before each entity is saved. Stopping
this event will abort the save operation. When the event is stopped the result
of the event will be returned.

afterSave
---------

.. php:method:: afterSave(Event $event, Entity $entity, array $options)

The ``Model.afterSave`` event is fired after an entity is saved.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, Entity $entity, array $options)

The ``Model.beforeDelete`` event is fired before an entity is deleted. By
stopping this event you will abort the delete operation.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, Entity $entity, array $options)

Fired after an entity has been deleted.

Behaviors
=========

.. php:method:: addBehavior($name, $config = [])

.. start-behaviors

Behaviors provide an easy way to create horizonally re-usable pieces of logic
related to table classes. You may be wondering why behaviors are regular classes
and not traits. The primary reason for this is event listeners. While traits
would allow for re-usable pieces of logic, they would complicate binding events.

To add a behavior to your table you can call the ``addBehavior`` method.
Generally the best place to do this is in the ``initialize`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }
    }

As with associations, you can use :term:`plugin syntax` and provide additional
configuration options::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

You can find out more about behaviors, including the behaviors provided by
CakePHP in the chapter on :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configuring Connections
=======================

By default all table instances use the ``default`` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the ``defaultConnectionName`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public static function defaultConnectionName() {
            return 'slavedb';
        }
    }

.. note::

    The ``defaultConnectionName`` method **must** be static.

.. _table-registry-usage:

Using the TableRegistry
=======================

.. php:class:: TableRegistry

As we've seen earlier, the TableRegistry class provides an easy to use
factory/registry for accessing your applications table instances. It provides a
few other useful features as well.

Configuring Table Objects
-------------------------

.. php:staticmethod:: get($alias, $config)

When loading tables from the registry you can customize their dependencies, or
use mock objects by providing an ``$options`` array::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connection,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

.. note::

    If your table also does additional configuration in its ``initialize()`` method,
    those values will overwrite the ones provided to the registry.

You can also pre-configure the registry using the ``config()`` method.
Configuration data is stored *per alias*, and can be overridden by an object's
``initialize()`` method::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    You can only configure a table before or during the **first** time you
    access that alias. Doing it after the registry is populated will have no
    effect.

Flushing the Registry
---------------------

.. php:staticmethod:: clear()

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies::

    TableRegistry::clear();

.. _converting-request-data:

Converting Request Data into Entities
=====================================

Before editing and saving data back into the database, you'll need to convert
the request data from the array format held in the request, and the entities
that the ORM uses. The Table class provides an easy way to convert one or many
entities from request data. You can convert a single entity using::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data());

The request data should follow the structure of your entities. For example if
you had an article, which belonged to a user, and had many comments, your
request data should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'First comment'],
            ['body' => 'Second comment'],
        ]
    ];

If you are saving belongsToMany associations you can either use a list of
entity data or a list of ids. When using a list of entity data your request data
should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Internet'],
        ]
    ];

When using a list of ids, your request data should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

The marshaller will handle both of these forms correctly, but only for
belongsToMany associations.

When building forms that save nested associations, you need to define which
associations should be marshalled::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'Tags', 'Comments' => ['associated' => ['Users']]
    ]);

The above indicates that the 'Tags', 'Comments' and 'Users' for the Comments
should be marshalled. You can convert multiple entities using::

    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());

When converting multiple entities, the request data for multiple articles should
look like::

    $data = [
        [
            'title' => 'First post',
            'published' => 1
        ],
        [
            'title' => 'Second post',
            'published' => 1
        ],
    ];

Once you've converted request data into entities you can ``save()`` or
``delete()`` them.

.. note::

    If you are using newEntity() and the resulting entities are missing some or
    all of the data they were passed, you should double check that the columns
    you want to set can be mass-assigned. By default fields cannot be modified
    through mass-assignment.

Merging Request Data Into Entities
----------------------------------

In order to update entities you may choose to apply request data directly to an
existing entity. This has the advantage that only the fields that actually
changed will be saved, as opposed to sending all fields to the database to be
persisted. You can merge an array of raw data into an existing entity using the
``patchEntity`` method::

    $articles = TableRegistry::get('Articles');
    $entity = $articles->get(1);
    $articles->patchEntity($article, $this->request->data());

As explained in the previous section, the request data should follow the
structure of your entity. The ``patchEntity`` method is equally capable of
merging associations, by default only the first level of associations are
merged, but if you wish to control the list of associations to be merged or
merge deeper to deeper levels, you can use the second parameter of the method::

    $entity = $articles->get(1);
    $articles->patchEntity($article, $this->request->data(), [
        'Tags', 'Comments' => ['associated' => ['Users']]
    ]);

Associations are merged by matching the primary key field in the source entities
to the corresponding fields in the data array. For belongsTo and hasOne
associations, new entities will be constructed if no previous entity is found
for the target property.

For example give some request data like the following::

    $data = [
        'title' => 'My title',
        'user' => [
            'username' => 'mark'
        ]
    ];

Trying to patch an entity without an entity in the user property will create
a new user entity::

    $entity = $articles->patchEntity(new Article, $data);
    echo $entity->user->username; // Echoes 'mark'

The same can be said about hasMany and belongsToMany associations, but an
important note should be made.

.. note::
    For  hasMany and belongsToMany associations, if there were any entities that
    could not be matched by primary key to any record in the data array, then
    those records will be discarded from the resulting entity.

For example, consider the following case::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'First comment', 'id' => 1],
            ['body' => 'Second comment', 'id' => 2],
        ]
    ];
    $entity = $articles->newEntity($data);

    $newData = [
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];
    $articles->patchEntity($entity, $newData);

At the end, if the entity is converted back to an array you will obtain the
following result::

    [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];

As you can see, the comment with id 2 is no longer there, as it could not be
matched to anything in the ``$newData`` array. This is done this way to better
capture the intention of a request data post, The sent data is reflecting the
new state that the entity should have.

Some additional advantages of this approach is that it reduces the number of
operations to be executed when persisting the entity again.

Please note that this does not mean that the comment with id 2 was removed from
the database, if you wish to remove the comments for that article that are not
present in the entity, you can collect the primary keys and execute a batch
delete for those not in the list::

    $present = (new Collection($entity->comments))->extract('id');
    TableRegistry::get('Comments')->deleteAll([
        'conditions' => ['article_id' => $article->id, 'id NOT IN' => $present]
    ]);

As you can see, this also helps creating solutions where an association needs to
be implemented like a single set.

You can also patch multiple entities at once. The consideration made for
patching hasMany and belongsToMany associations apply form patching multiple
entities: Matches are done by the primary key field value and missing matches in
the original entities array will be removed and not present in the result::

    $articles = TableRegistry::get('Articles');
    $list = $articles->find('popular')->toArray();
    $patched = $articles->patchEntities($list, $this->request->data());

Similarly to using ``patchEntity``, you can use the third argument for
controlling the associations that will be merged in each of the entities in the
array::

    $patched = $articles->patchEntities($list, $this->request->data(), [
        'Tags', 'Comments' => ['associated' => ['Users']]
    ]);
