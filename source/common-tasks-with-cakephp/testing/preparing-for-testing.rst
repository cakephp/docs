4.7.1 Preparing for testing
---------------------------

Ready to start testing? Good! Lets get going then!

Installing SimpleTest
~~~~~~~~~~~~~~~~~~~~~

Installing SimpleTest
The testing framework provided with CakePHP 1.3 is built upon the
SimpleTest testing framework. SimpleTest is not shipped with the
default CakePHP installation, so we need to download it first. You
can find it here:
`http://simpletest.sourceforge.net/ <http://simpletest.sourceforge.net/>`_.

Fetch the latest version, and unzip the code to your vendors
folder, or your app/vendors folder, depending on your preference.
You should now have a vendors/simpletest directory with all
SimpleTest files and folders inside. Remember to have a DEBUG level
of at least 1 in your app/config/core.php file before running any
tests!

There is a new version of SimpleTest 1.1alpha that does not work
with CakePHP. Please use 1.0.1.

If you have no test database connection defined in your
app/config/database.php, test tables will be created with a
``test_suite_`` prefix. You can create a ``$test`` database
connection to contain any test tables like the one below:

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

If the test database is available and CakePHP can connect to it,
all tables will be created in this database.

Running Core test cases
~~~~~~~~~~~~~~~~~~~~~~~

After installing Simpletest, you can run the core test cases. They
are part of every packaged release and can also be found in the
`git repository <http://github.com/cakephp/cakephp>`_.

The tests can then be accessed by browsing to
http://your.cake.domain/test.php - depending on how your specific
setup looks. Try executing one of the core test groups by clicking
on the corresponding link. Executing a test group might take a
while, but you should eventually see something like "2/2 test cases
complete: 49 passes, 0 fails and 0 exceptions.".

Congratulations, you are now ready to start writing tests!

If you run all of the core tests at once or run core test groups
most of them will fail. This is known by the CakePHP developers and
is normal so don't panic. Instead, try running each of the core
test cases individually.

4.7.1 Preparing for testing
---------------------------

Ready to start testing? Good! Lets get going then!

Installing SimpleTest
~~~~~~~~~~~~~~~~~~~~~

Installing SimpleTest
The testing framework provided with CakePHP 1.3 is built upon the
SimpleTest testing framework. SimpleTest is not shipped with the
default CakePHP installation, so we need to download it first. You
can find it here:
`http://simpletest.sourceforge.net/ <http://simpletest.sourceforge.net/>`_.

Fetch the latest version, and unzip the code to your vendors
folder, or your app/vendors folder, depending on your preference.
You should now have a vendors/simpletest directory with all
SimpleTest files and folders inside. Remember to have a DEBUG level
of at least 1 in your app/config/core.php file before running any
tests!

There is a new version of SimpleTest 1.1alpha that does not work
with CakePHP. Please use 1.0.1.

If you have no test database connection defined in your
app/config/database.php, test tables will be created with a
``test_suite_`` prefix. You can create a ``$test`` database
connection to contain any test tables like the one below:

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

If the test database is available and CakePHP can connect to it,
all tables will be created in this database.

Running Core test cases
~~~~~~~~~~~~~~~~~~~~~~~

After installing Simpletest, you can run the core test cases. They
are part of every packaged release and can also be found in the
`git repository <http://github.com/cakephp/cakephp>`_.

The tests can then be accessed by browsing to
http://your.cake.domain/test.php - depending on how your specific
setup looks. Try executing one of the core test groups by clicking
on the corresponding link. Executing a test group might take a
while, but you should eventually see something like "2/2 test cases
complete: 49 passes, 0 fails and 0 exceptions.".

Congratulations, you are now ready to start writing tests!

If you run all of the core tests at once or run core test groups
most of them will fail. This is known by the CakePHP developers and
is normal so don't panic. Instead, try running each of the core
test cases individually.
