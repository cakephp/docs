3.4.3 The Configuration Class
-----------------------------

Despite few things needing to be configured in CakePHP, it’s
sometimes useful to have your own configuration rules for your
application. In the past you may have defined custom configuration
values by defining variable or constants in some files. Doing so
forces you to include that configuration file every time you needed
to use those values.

CakePHP’s new Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure we’ve set in place.

This class acts as a singleton and its methods can be called from
anywhere within your application, in a static context.

::

    <?php Configure::read('debug'); ?>


#. ``<?php Configure::read('debug'); ?>``

Configure Methods
~~~~~~~~~~~~~~~~~

write
^^^^^

``write(string $key, mixed $value)``

Use ``write()`` to store data in the application’s configuration.

::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');


#. ``Configure::write('Company.name','Pizza, Inc.');``
#. ``Configure::write('Company.slogan','Pizza for your body and soul');``

The dot notation used in the ``$key`` parameter can be used to
organize your configuration settings into logical groups.

The above example could also be written in a single call:

::

    Configure::write(
        'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')
    );


#. ``Configure::write(``
#. ``'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')``
#. ``);``

You can use ``Configure::write('debug', $int)`` to switch between
debug and production modes on the fly. This is especially handy for
AMF or SOAP interactions where debugging information can cause
parsing problems.

read
^^^^

``read(string $key = 'debug')``

Used to read configuration data from the application. Defaults to
CakePHP’s important debug value. If a key is supplied, the data is
returned. Using our examples from write() above, we can read that
data back:

::

    Configure::read('Company.name');    //yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'
     
    Configure::read('Company');
     
    //yields: 
    array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');


#. ``Configure::read('Company.name');    //yields: 'Pizza, Inc.'``
#. ``Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'``
#. ````
#. ``Configure::read('Company');``
#. ````
#. ``//yields:``
#. ``array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');``

delete
^^^^^^

``delete(string $key)``

Used to delete information from the application’s configuration.

::

    Configure::delete('Company.name');


#. ``Configure::delete('Company.name');``

load
^^^^

``load(string $path)``

Use this method to load configuration information from a specific
file.

::

    // /app/config/messages.php:
    <?php
    $config['Company']['name'] = 'Pizza, Inc.';
    $config['Company']['slogan'] = 'Pizza for your body and soul';
    $config['Company']['phone'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Company.name');
    ?>


#. ``// /app/config/messages.php:``
#. ``<?php``
#. ``$config['Company']['name'] = 'Pizza, Inc.';``
#. ``$config['Company']['slogan'] = 'Pizza for your body and soul';``
#. ``$config['Company']['phone'] = '555-55-55';``
#. ``?>``
#. ````
#. ``<?php``
#. ``Configure::load('messages');``
#. ``Configure::read('Company.name');``
#. ``?>``

Every configure key-value pair is represented in the file with the
``$config`` array. Any other variables in the file will be ignored
by the ``load()`` function.

version
^^^^^^^

``version()``

Returns the CakePHP version for the current application.

CakePHP Core Configuration Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Configure class is used to manage a set of core CakePHP
configuration variables. These variables can be found in
app/config/core.php. Below is a description of each variable and
how it affects your CakePHP application.

Configure Variable
Description
debug
Changes CakePHP debugging output.
0 = Production mode. No output.
1 = Show errors and warnings.
2 = Show errors, warnings, and SQL. [SQL log is only shown when you
add $this->element('sql\_dump') to your view or layout.]
App.baseUrl
Un-comment this definition if you **don’t** plan to use Apache’s
mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess
files too.
Routing.prefixes
Un-comment this definition if you’d like to take advantage of
CakePHP prefixed routes like admin. Set this variable with an array
of prefix names of the routes you’d like to use. More on this
later.
Cache.disable
When set to true, caching is disabled site-wide.
Cache.check
If set to true, enables view caching. Enabling is still needed in
the controllers, but this variable enables the detection of those
settings.
Session.save
Tells CakePHP which session storage mechanism to use.
php = Use the default PHP session storage.
cache = Use the caching engine configured by Cache::config(). Very
useful in conjunction with Memcache (in setups with multiple
application servers) to store both cached data and sessions.
cake = Store session data in /app/tmp
database = store session data in a database table. Make sure to set
up the table using the SQL file located at
/app/config/sql/sessions.sql.
Session.model
The model name to be used for the session model. The model name set
here should \*not\* be used elsewhere in your application.
Session.table
This value has been deprecated as of CakePHP 1.3

Session.database
The name of the database that stores session information.
Session.cookie
The name of the cookie used to track sessions.
Session.timeout
Base session timeout in seconds. Actual value depends on
Security.level.
Session.start
Automatically starts sessions when set to true.
Session.checkAgent
When set to false, CakePHP sessions will not check to ensure the
user agent does not change between requests.
Security.level
The level of CakePHP security. The session timeout time defined in
'Session.timeout' is multiplied according to the settings here.
Valid values:
'high' = x 10
'medium' = x 100
'low' = x 300
'high' and 'medium' also enable
`session.referer\_check <http://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_
CakePHP session IDs are also regenerated between requests if
'Security.level' is set to 'high'.
Security.salt
A random string used in security hashing.
Security.cipherSeed
A random numeric string (digits only) used to encrypt/decrypt
strings.
Asset.timestamp
Appends a timestamp which is last modified time of the particular
file at the end of asset files urls (CSS, JavaScript, Image) when
using proper helpers.

Valid values:
(bool) false - Doesn't do anything (default)
(bool) true - Appends the timestamp when debug > 0
(string) 'force' - Appends the timestamp when debug >= 0

Acl.classname, Acl.database
Constants used for CakePHP’s Access Control List functionality. See
the Access Control Lists chapter for more information.
Cache configuration is also found in core.php — We’ll be covering
that later on, so stay tuned.

The Configure class can be used to read and write core
configuration settings on the fly. This can be especially handy if
you want to turn the debug setting on for a limited section of
logic in your application, for instance.

Configuration Constants
~~~~~~~~~~~~~~~~~~~~~~~

While most configuration options are handled by Configure, there
are a few constants that CakePHP uses during runtime.

Constant
Description
LOG\_ERROR
Error constant. Used for differentiating error logging and
debugging. Currently PHP supports LOG\_DEBUG.
3.4.3 The Configuration Class
-----------------------------

Despite few things needing to be configured in CakePHP, it’s
sometimes useful to have your own configuration rules for your
application. In the past you may have defined custom configuration
values by defining variable or constants in some files. Doing so
forces you to include that configuration file every time you needed
to use those values.

CakePHP’s new Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure we’ve set in place.

This class acts as a singleton and its methods can be called from
anywhere within your application, in a static context.

::

    <?php Configure::read('debug'); ?>


#. ``<?php Configure::read('debug'); ?>``

Configure Methods
~~~~~~~~~~~~~~~~~

write
^^^^^

``write(string $key, mixed $value)``

Use ``write()`` to store data in the application’s configuration.

::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');


#. ``Configure::write('Company.name','Pizza, Inc.');``
#. ``Configure::write('Company.slogan','Pizza for your body and soul');``

The dot notation used in the ``$key`` parameter can be used to
organize your configuration settings into logical groups.

The above example could also be written in a single call:

::

    Configure::write(
        'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')
    );


#. ``Configure::write(``
#. ``'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')``
#. ``);``

You can use ``Configure::write('debug', $int)`` to switch between
debug and production modes on the fly. This is especially handy for
AMF or SOAP interactions where debugging information can cause
parsing problems.

read
^^^^

``read(string $key = 'debug')``

Used to read configuration data from the application. Defaults to
CakePHP’s important debug value. If a key is supplied, the data is
returned. Using our examples from write() above, we can read that
data back:

::

    Configure::read('Company.name');    //yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'
     
    Configure::read('Company');
     
    //yields: 
    array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');


#. ``Configure::read('Company.name');    //yields: 'Pizza, Inc.'``
#. ``Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'``
#. ````
#. ``Configure::read('Company');``
#. ````
#. ``//yields:``
#. ``array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');``

delete
^^^^^^

``delete(string $key)``

Used to delete information from the application’s configuration.

::

    Configure::delete('Company.name');


#. ``Configure::delete('Company.name');``

load
^^^^

``load(string $path)``

Use this method to load configuration information from a specific
file.

::

    // /app/config/messages.php:
    <?php
    $config['Company']['name'] = 'Pizza, Inc.';
    $config['Company']['slogan'] = 'Pizza for your body and soul';
    $config['Company']['phone'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Company.name');
    ?>


#. ``// /app/config/messages.php:``
#. ``<?php``
#. ``$config['Company']['name'] = 'Pizza, Inc.';``
#. ``$config['Company']['slogan'] = 'Pizza for your body and soul';``
#. ``$config['Company']['phone'] = '555-55-55';``
#. ``?>``
#. ````
#. ``<?php``
#. ``Configure::load('messages');``
#. ``Configure::read('Company.name');``
#. ``?>``

Every configure key-value pair is represented in the file with the
``$config`` array. Any other variables in the file will be ignored
by the ``load()`` function.

version
^^^^^^^

``version()``

Returns the CakePHP version for the current application.

CakePHP Core Configuration Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Configure class is used to manage a set of core CakePHP
configuration variables. These variables can be found in
app/config/core.php. Below is a description of each variable and
how it affects your CakePHP application.

Configure Variable
Description
debug
Changes CakePHP debugging output.
0 = Production mode. No output.
1 = Show errors and warnings.
2 = Show errors, warnings, and SQL. [SQL log is only shown when you
add $this->element('sql\_dump') to your view or layout.]
App.baseUrl
Un-comment this definition if you **don’t** plan to use Apache’s
mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess
files too.
Routing.prefixes
Un-comment this definition if you’d like to take advantage of
CakePHP prefixed routes like admin. Set this variable with an array
of prefix names of the routes you’d like to use. More on this
later.
Cache.disable
When set to true, caching is disabled site-wide.
Cache.check
If set to true, enables view caching. Enabling is still needed in
the controllers, but this variable enables the detection of those
settings.
Session.save
Tells CakePHP which session storage mechanism to use.
php = Use the default PHP session storage.
cache = Use the caching engine configured by Cache::config(). Very
useful in conjunction with Memcache (in setups with multiple
application servers) to store both cached data and sessions.
cake = Store session data in /app/tmp
database = store session data in a database table. Make sure to set
up the table using the SQL file located at
/app/config/sql/sessions.sql.
Session.model
The model name to be used for the session model. The model name set
here should \*not\* be used elsewhere in your application.
Session.table
This value has been deprecated as of CakePHP 1.3

Session.database
The name of the database that stores session information.
Session.cookie
The name of the cookie used to track sessions.
Session.timeout
Base session timeout in seconds. Actual value depends on
Security.level.
Session.start
Automatically starts sessions when set to true.
Session.checkAgent
When set to false, CakePHP sessions will not check to ensure the
user agent does not change between requests.
Security.level
The level of CakePHP security. The session timeout time defined in
'Session.timeout' is multiplied according to the settings here.
Valid values:
'high' = x 10
'medium' = x 100
'low' = x 300
'high' and 'medium' also enable
`session.referer\_check <http://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_
CakePHP session IDs are also regenerated between requests if
'Security.level' is set to 'high'.
Security.salt
A random string used in security hashing.
Security.cipherSeed
A random numeric string (digits only) used to encrypt/decrypt
strings.
Asset.timestamp
Appends a timestamp which is last modified time of the particular
file at the end of asset files urls (CSS, JavaScript, Image) when
using proper helpers.

Valid values:
(bool) false - Doesn't do anything (default)
(bool) true - Appends the timestamp when debug > 0
(string) 'force' - Appends the timestamp when debug >= 0

Acl.classname, Acl.database
Constants used for CakePHP’s Access Control List functionality. See
the Access Control Lists chapter for more information.
Cache configuration is also found in core.php — We’ll be covering
that later on, so stay tuned.

The Configure class can be used to read and write core
configuration settings on the fly. This can be especially handy if
you want to turn the debug setting on for a limited section of
logic in your application, for instance.

Configuration Constants
~~~~~~~~~~~~~~~~~~~~~~~

While most configuration options are handled by Configure, there
are a few constants that CakePHP uses during runtime.

Constant
Description
LOG\_ERROR
Error constant. Used for differentiating error logging and
debugging. Currently PHP supports LOG\_DEBUG.
