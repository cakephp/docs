11.1.3 Cake Database Configuration
----------------------------------

Onward and upward: let's tell Cake where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's database configuration file is found in
``/app/config/database.php.default``. Make a copy of this file in
the same directory, but name it ``database.php``.

The config file should be pretty straightforward: just replace the
values in the ``$default`` array with those that apply to your
setup. A sample completed configuration array might look something
like the following:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );


#. ``var $default = array(``
#. ``'driver' => 'mysql',``
#. ``'persistent' => 'false',``
#. ``'host' => 'localhost',``
#. ``'port' => '',``
#. ``'login' => 'cakeBlog',``
#. ``'password' => 'c4k3-rUl3Z',``
#. ``'database' => 'cake_blog_tutorial',``
#. ``'schema' => '',``
#. ``'prefix' => '',``
#. ``'encoding' => ''``
#. ``);``

Once you've saved your new ``database.php`` file, you should be
able to open your browser and see the Cake welcome page. It should
also tell you that your database connection file was found, and
that Cake can successfully connect to the database.

11.1.3 Cake Database Configuration
----------------------------------

Onward and upward: let's tell Cake where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's database configuration file is found in
``/app/config/database.php.default``. Make a copy of this file in
the same directory, but name it ``database.php``.

The config file should be pretty straightforward: just replace the
values in the ``$default`` array with those that apply to your
setup. A sample completed configuration array might look something
like the following:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );


#. ``var $default = array(``
#. ``'driver' => 'mysql',``
#. ``'persistent' => 'false',``
#. ``'host' => 'localhost',``
#. ``'port' => '',``
#. ``'login' => 'cakeBlog',``
#. ``'password' => 'c4k3-rUl3Z',``
#. ``'database' => 'cake_blog_tutorial',``
#. ``'schema' => '',``
#. ``'prefix' => '',``
#. ``'encoding' => ''``
#. ``);``

Once you've saved your new ``database.php`` file, you should be
able to open your browser and see the Cake welcome page. It should
also tell you that your database connection file was found, and
that Cake can successfully connect to the database.
