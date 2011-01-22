4.7.3 Preparing test data
-------------------------

About fixtures
~~~~~~~~~~~~~~

When testing code that depends on models and data, one can use
**fixtures** as a way to generate temporary data tables loaded with
sample data that can be used by the test. The benefit of using
fixtures is that your test has no chance of disrupting live
application data. In addition, you can begin testing your code
prior to actually developing live content for an application.

CakePHP attempts to use the connection named ``$test`` in your
app/config/database.php configuration file. If this connection is
not usable, it will use the ``$default`` database configuration and
create the test tables in the database defined in that
configuration. In either case, it will add "test\_suite\_" to your
own table prefix (if any) to prevent collision with your existing
tables.

CakePHP performs the following during the course of a fixture based
test case:


#. Creates tables for each of the fixtures needed
#. Populates tables with data, if data is provided in fixture
#. Runs test methods
#. Empties the fixture tables
#. Removes fixture tables from database

Creating fixtures
~~~~~~~~~~~~~~~~~

When creating a fixture you will mainly define two things: how the
table is created (which fields are part of the table), and which
records will be initially populated to the test table. Let's then
create our first fixture, that will be used to test our own Article
model. Create a file named **article\_fixture.php** in your
**app/tests/fixtures** directory, with the following content:

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 
     ?> 

The ``$name`` variable is extremely significant. If you omit it,
cake will use the wrong table names when it sets up your test
database, and you'll get strange errors that are difficult to
debug. If you use PHP 5.2, you might be used to writing model
classes without ``$name``, but you must remember to include it in
your fixture files.
We use $fields to specify which fields will be part of this table,
on how they are defined. The format used to define these fields is
the same used in the function **generateColumnSchema()** defined on
Cake's database engine classes (for example, on file
dbo\_mysql.php.) Let's see the available attributes a field can
take and their meaning:

type
    CakePHP internal data type. Currently supported: string (maps to
    VARCHAR), text (maps to TEXT), integer (maps to INT), float (maps
    to FLOAT), datetime (maps to DATETIME), timestamp (maps to
    TIMESTAMP), time (maps to TIME), date (maps to DATE), and binary
    (maps to BLOB)
key
    set to primary to make the field AUTO\_INCREMENT, and a PRIMARY KEY
    for the table.
length
    set to the specific length the field should take.
null
    set to either true (to allow NULLs) or false (to disallow NULLs)
default
    default value the field takes.

We lastly can set a set of records that will be populated after the
test table is created. The format is fairly straight forward and
needs little further explanation. Just keep in mind that each
record in the $records array must have a key for **every** field
specified in the $fields array. If a field for a particular record
needs to have a NULL value, just specify the value of that key as
NULL.

Importing table information and records
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Your application may have already working models with real data
associated to them, and you might decide to test your model with
that data. It would be then a duplicate effort to have to define
the table definition and/or records on your fixtures. Fortunately,
there's a way for you to define that table definition and/or
records for a particular fixture come from an existing model or an
existing table.
Let's start with an example. Assuming you have a model named
Article available in your application (that maps to a table named
articles), change the example fixture given in the previous section
(**app/tests/fixtures/article\_fixture.php**) to:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

This statement tells the test suite to import your table definition
from the table linked to the model called Article. You can use any
model available in your application. The statement above does not
import records, you can do so by changing it to:

::

    <?php   
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

If on the other hand you have a table created but no model
available for it, you can specify that your import will take place
by reading that table information instead. For example:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

Will import table definition from a table called 'articles' using
your CakePHP database connection named 'default'. If you want to
change the connection to use just do:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'other'); 
       } 
       ?> 

Since it uses your CakePHP database connection, if there's any
table prefix declared it will be automatically used when fetching
table information. The two snippets above do not import records
from the table. To force the fixture to also import its records,
change it to:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

You can naturally import your table definition from an existing
model/table, but have your records defined directly on the fixture
as it was shown on previous section. For example:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
              ); 
       } 
     ?> 
