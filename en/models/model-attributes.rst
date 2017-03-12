Model Attributes
################

Model attributes allow you to set properties that can override the
default model behavior.

For a complete list of model attributes and their descriptions
visit the `CakePHP API <https://api.cakephp.org/2.x/class-Model.html>`_.

useDbConfig
===========

The ``useDbConfig`` property is a string that specifies the name of
the database connection to use to bind your model class to the
related database table. You can set it to any of the database
connections defined within your database configuration file. The
database configuration file is stored in /app/Config/database.php.

The ``useDbConfig`` property is defaulted to the 'default' database
connection.

Example usage::

    class Example extends AppModel {
        public $useDbConfig = 'alternate';
    }

useTable
========

The ``useTable`` property specifies the database table name. By
default, the model uses the lowercase, plural form of the model's
class name. Set this attribute to the name of an alternate table,
or set it to ``false`` if you wish the model to use no database
table.

Example usage::

    class Example extends AppModel {
        public $useTable = false; // This model does not use a database table
    }

Alternatively::

    class Example extends AppModel {
        public $useTable = 'exmp'; // This model uses a database table 'exmp'
    }

tablePrefix
===========

The name of the table prefix used for the model. The table prefix
is initially set in the database connection file at
/app/Config/database.php. The default is no prefix. You can
override the default by setting the ``tablePrefix`` attribute in
the model.

Example usage::

    class Example extends AppModel {
        public $tablePrefix = 'alternate_'; // will look for 'alternate_examples'
    }

.. _model-primaryKey:

primaryKey
==========

Each table normally has a primary key, ``id``. You may change which
field name the model uses as its primary key. This is common when
setting CakePHP to use an existing database table.

Example usage::

    class Example extends AppModel {
        // example_id is the field name in the database
        public $primaryKey = 'example_id';
    }


.. _model-displayField:

displayField
============

The ``displayField`` attribute specifies which database field
should be used as a label for the record. The label is used in
scaffolding and in ``find('list')`` calls. The model will use
``name`` or ``title``, by default.

For example, to use the ``username`` field::

    class User extends AppModel {
        public $displayField = 'username';
    }

Multiple field names cannot be combined into a single display
field. For example, you cannot specify,
``array('first_name', 'last_name')`` as the display field. Instead
create a virtual field with the Model attribute virtualFields

recursive
=========

The recursive property defines how deep CakePHP should go to fetch
associated model data via ``find()``, and ``read()`` methods.

Imagine your application features Groups which belong to a domain
and have many Users which in turn have many Articles. You can set
$recursive to different values based on the amount of data you want
back from a $this->Group->find() call:

* -1 CakePHP fetches Group data only, no joins.
* 0  CakePHP fetches Group data and its domain
* 1  CakePHP fetches a Group, its domain and its associated Users
* 2  CakePHP fetches a Group, its domain, its associated Users, and the
  Users' associated Articles

Set it no higher than you need. Having CakePHP fetch data you
aren't going to use slows your app unnecessarily. Also note that
the default recursive level is 1.

.. note::

    If you want to combine $recursive with the ``fields``
    functionality, you will have to add the columns containing the
    required foreign keys to the ``fields`` array manually. In the
    example above, this could mean adding ``domain_id``.

The recommended recursive level for your application should be -1.
This avoids retrieving related data where that is unnecessary or even
unwanted. This is most likely the case for most of your find() calls.
Raise it only when needed or use Containable behavior.

You can achieve that by adding it to the AppModel::

    public $recursive = -1;

If you use events in your system, using the value -1 for recursive will
disable all event triggering in the associated model. This happens because
no relations are created when the value is set to -1.

order
=====

The default ordering of data for any find operation. Possible
values include::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
====

The container for the model's fetched data. While data returned
from a model class is normally used as returned from a find() call,
you may need to access information stored in $data inside of model
callbacks.

\_schema
========

Contains metadata describing the model's database table fields.
Each field is described by:

-  name
-  type

The types CakePHP supports are:

string
    Generally backed by CHAR or VARCHAR columns. In SQL Server, NCHAR and
    NVARCHAR types are used.
text
    Maps to TEXT, MONEY types.
uuid
    Maps to the UUID type if a database provides one, otherwise this will
    generate a CHAR(36) field.
integer
    Maps to the INTEGER, SMALLINT types provided by the database.
biginteger
    Maps to the BIGINT type provided by the database.
decimal
    Maps to the DECIMAL, NUMERIC types.
float
    Maps to the REAL, DOUBLE PRECISION types.
boolean
    Maps to BOOLEAN except in MySQL, where TINYINT(1) is used to represent
    booleans.
binary
    Maps to the BLOB or BYTEA type provided by the database.
date
    Maps to a timezone naive DATE column type.
datetime
    Maps to a timezone naive DATETIME column type. In PostgreSQL, and SQL
    Server this turns into a TIMESTAMP or TIMESTAMPTZ type.
timestamp
    Maps to the TIMESTAMP type.
time
    Maps to a TIME type in all databases.

-  null
-  default value
-  length

Example Usage::

    protected $_schema = array(
        'first_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
========

This attribute holds rules that allow the model to make data
validation decisions before saving. Keys named after fields hold
regex values allowing the model to try to make matches.

.. note::

    It is not necessary to call validate() before save() as save() will
    automatically validate your data before actually saving.

For more information on validation, see the :doc:`/models/data-validation`
later on in this manual.

virtualFields
=============

Array of virtual fields this model has. Virtual fields are aliased
SQL expressions. Fields added to this property will be read as
other fields in a model but will not be saveable.

Example usage for MySQL::

    public $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not
advisable to create virtual fields with the same names as columns
on the database, this can cause SQL errors.

For more information on the ``virtualFields`` property, its proper
usage, as well as limitations, see
:doc:`/models/virtual-fields`.

name
====

Name of the model. If you do not specify it in your model file it will
be set to the class name by constructor.

Example usage::

    class Example extends AppModel {
        public $name = 'Example';
    }

cacheQueries
============

If set to true, data fetched by the model during a single request
is cached. This caching is in-memory only, and only lasts for the
duration of the request. Any duplicate requests for the same data
is handled by the cache.


.. meta::
    :title lang=en: Model Attributes
    :keywords lang=en: alternate table,default model,database configuration,model example,database table,default database,model class,model behavior,class model,plural form,database connections,database connection,attribute,attributes,complete list,config,cakephp,api,class example
