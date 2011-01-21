3.9 DataSources
---------------

DataSources are the link between models and the source of data that
models represent. In many cases, the data is retrieved from a
relational database such as MySQL, PostgreSQL or MSSQL. CakePHP is
distributed with several database-specific datasources (see the
dbo\_\* class files in cake/libs/model/datasources/dbo/), a summary
of which is listed here for your convenience:


-  dbo\_mssql.php
-  dbo\_mysql.php
-  dbo\_mysqli.php
-  dbo\_oracle.php
-  dbo\_postgres.php
-  dbo\_sqlite.php

Additional DataSources and those that were removed from the core in
1.3 can be found in the community-maintained
`CakePHP DataSources repository at github <http://github.com/cakephp/datasources>`_.

When specifying a database connection configuration in
app/config/database.php, CakePHP transparently uses the
corresponding database datasource for all model operations. So,
even though you might not have known about datasources, you've been
using them all along.

All of the above sources derive from a base ``DboSource`` class,
which aggregates some logic that is common to most relational
databases. If you decide to write a RDBMS datasource, working from
one of these (e.g. dbo\_mysql.php or dbo\_mssql.php is your best
bet.

Most people, however, are interested in writing datasources for
external sources of data, such as remote REST APIs or even an LDAP
server. So that's what we're going to look at now.

3.9 DataSources
---------------

DataSources are the link between models and the source of data that
models represent. In many cases, the data is retrieved from a
relational database such as MySQL, PostgreSQL or MSSQL. CakePHP is
distributed with several database-specific datasources (see the
dbo\_\* class files in cake/libs/model/datasources/dbo/), a summary
of which is listed here for your convenience:


-  dbo\_mssql.php
-  dbo\_mysql.php
-  dbo\_mysqli.php
-  dbo\_oracle.php
-  dbo\_postgres.php
-  dbo\_sqlite.php

Additional DataSources and those that were removed from the core in
1.3 can be found in the community-maintained
`CakePHP DataSources repository at github <http://github.com/cakephp/datasources>`_.

When specifying a database connection configuration in
app/config/database.php, CakePHP transparently uses the
corresponding database datasource for all model operations. So,
even though you might not have known about datasources, you've been
using them all along.

All of the above sources derive from a base ``DboSource`` class,
which aggregates some logic that is common to most relational
databases. If you decide to write a RDBMS datasource, working from
one of these (e.g. dbo\_mysql.php or dbo\_mssql.php is your best
bet.

Most people, however, are interested in writing datasources for
external sources of data, such as remote REST APIs or even an LDAP
server. So that's what we're going to look at now.
