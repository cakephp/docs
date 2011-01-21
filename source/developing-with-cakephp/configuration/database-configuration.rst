3.4.1 Database Configuration
----------------------------

CakePHP expects database configuration details to be in a file at
app/config/database.php. An example database configuration file can
be found at app/config/database.php.default. A finished
configuration should look something like this.

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'my_cakephp_project',
                         'prefix'      => '');

The $default connection array is used unless another connection is
specified by the $useDbConfig property in a model. For example, if
my application has an additional legacy database in addition to the
default one, I could use it in my models by creating a new $legacy
database connection array similar to the $default array, and by
setting var $useDbConfig = ‘legacy’; in the appropriate models.

Fill out the key/value pairs in the configuration array to best
suit your needs.

Key
Value
driver
The name of the database driver this configuration array is for.
Examples: mysql, postgres, sqlite, pear-drivername,
adodb-drivername, mssql, oracle, or odbc. Note that for
non-database sources (e.g. LDAP, Twitter), leave this blank and use
"datasource".
persistent
Whether or not to use a persistent connection to the database.
host
The database server’s hostname (or IP address).
login
The username for the account.
password
The password for the account.
database
The name of the database for this connection to use.
prefix (*optional*)
The string that prefixes every table name in the database. If your
tables don’t have prefixes, set this to an empty string.
port (*optional*)
The TCP port or Unix socket used to connect to the server.
encoding
Indicates the character set to use when sending SQL statements to
the server. This defaults to the database's default encoding for
all databases other than DB2. If you wish to use UTF-8 encoding
with mysql/mysqli connections you must use 'utf8' without the
hyphen.
schema
Used in PostgreSQL database setups to specify which schema to use.
datasource
non-DBO datasource to use, e.g. 'ldap', 'twitter'
The prefix setting is for tables, **not** models. For example, if
you create a join table for your Apple and Flavor models, you name
it prefix\_apples\_flavors (**not**
prefix\_apples\_prefix\_flavors), and set your prefix setting to
'prefix\_'.

At this point, you might want to take a look at the
`CakePHP Conventions </view/901/cakephp-conventions>`_. The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big\_boxes, your model
BigBox, your controller BigBoxesController, everything just works
together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry\_stores, and savory\_cakes.

3.4.1 Database Configuration
----------------------------

CakePHP expects database configuration details to be in a file at
app/config/database.php. An example database configuration file can
be found at app/config/database.php.default. A finished
configuration should look something like this.

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'my_cakephp_project',
                         'prefix'      => '');

The $default connection array is used unless another connection is
specified by the $useDbConfig property in a model. For example, if
my application has an additional legacy database in addition to the
default one, I could use it in my models by creating a new $legacy
database connection array similar to the $default array, and by
setting var $useDbConfig = ‘legacy’; in the appropriate models.

Fill out the key/value pairs in the configuration array to best
suit your needs.

Key
Value
driver
The name of the database driver this configuration array is for.
Examples: mysql, postgres, sqlite, pear-drivername,
adodb-drivername, mssql, oracle, or odbc. Note that for
non-database sources (e.g. LDAP, Twitter), leave this blank and use
"datasource".
persistent
Whether or not to use a persistent connection to the database.
host
The database server’s hostname (or IP address).
login
The username for the account.
password
The password for the account.
database
The name of the database for this connection to use.
prefix (*optional*)
The string that prefixes every table name in the database. If your
tables don’t have prefixes, set this to an empty string.
port (*optional*)
The TCP port or Unix socket used to connect to the server.
encoding
Indicates the character set to use when sending SQL statements to
the server. This defaults to the database's default encoding for
all databases other than DB2. If you wish to use UTF-8 encoding
with mysql/mysqli connections you must use 'utf8' without the
hyphen.
schema
Used in PostgreSQL database setups to specify which schema to use.
datasource
non-DBO datasource to use, e.g. 'ldap', 'twitter'
The prefix setting is for tables, **not** models. For example, if
you create a join table for your Apple and Flavor models, you name
it prefix\_apples\_flavors (**not**
prefix\_apples\_prefix\_flavors), and set your prefix setting to
'prefix\_'.

At this point, you might want to take a look at the
`CakePHP Conventions </view/901/cakephp-conventions>`_. The correct
naming for your tables (and the addition of some columns) can score
you some free functionality and help you avoid configuration. For
example, if you name your database table big\_boxes, your model
BigBox, your controller BigBoxesController, everything just works
together automatically. By convention, use underscores, lower case,
and plural forms for your database table names - for example:
bakers, pastry\_stores, and savory\_cakes.
