New features in CakePHP 1.3
--------------------------------

CakePHP 1.3 introduced a number of new features. This guide
attempts to summarize those changes and point to expanded
documentation where necessary.

Components
~~~~~~~~~~

**SecurityComponent**

The various requireXX methods like ``requireGet`` and
``requirePost`` now accept a single array as their argument as well
as a collection of string names.

::

    $this->Security->requirePost(array('edit', 'update'));

**Component settings**

Component settings for all core components can now be set from the
``$components`` array. Much like behaviors, you can declare
settings for components when you declare the component.

::

    var $components = array(
        'Cookie' => array(
            'name' => 'MyCookie'
        ),
        'Auth' => array(
            'userModel' => 'MyUser',
            'loginAction' => array('controller' => 'users', 'action' => 'login')
        )
    );

This should reduce clutter in your Controller's ``beforeFilter()``
methods.

**EmailComponent**


-  You can now retrieve the rendered contents of sent Email
   messages, by reading ``$this->Email->htmlMessage`` and
   ``$this->Email->textMessage``. These properties will contain the
   rendered email content matching their name.
-  Many of EmailComponent's private methods have been made
   protected for easier extension.
-  EmailComponent::$to can now be an array. Allowing easier setting
   of multiple recipients, and consistency with other properties.
-  ``EmailComponent::$messageId`` has been added, it allows control
   over the Message-ID header for email messages.

View & Helpers
~~~~~~~~~~~~~~

Helpers can now be addressed at ``$this->Helper->func()`` in
addition to ``$helper->func()``. This allows view variables and
helpers to share names and not create collisions.

**New JsHelper and new features in HtmlHelper**

See :doc:`JsHelper documentation </core-libraries/helpers/js>` for more information

**Pagination Helper**

Pagination helper provides additional CSS classes for styling and
you can set the default sort() direction.
``PaginatorHelper::next()`` and ``PaginatorHelper::prev()`` now
generate span tags by default, instead of divs.

**Helper**

``Helper::assetTimestamp()`` has been added. It will add timestamps
to any asset under WWW\_ROOT. It works with
``Configure::read('Asset.timestamp');`` just as before, but the
functionality used in Html and Javascript helpers has been made
available to all helpers. Assuming ``Asset.timestamp == force``

::

    $path = 'css/cake.generic.css'
    $stamped = $this->Html->assetTimestamp($path);

    //$stamped contains 'css/cake.generic.css?5632934892'

The appended timestamp contains the last modification time of the
file. Since this method is defined in ``Helper`` it is available to
all subclasses.

**TextHelper**

highlight() now accepts an array of words to highlight.

**NumberHelper**

A new method ``addFormat()`` has been added. This method allows you
to set currency parameter sets, so you don't have to retype them::

    $this->Number->addFormat('NOK', array('before' => 'Kr. '));
    $formatted = $this->Number->currency(1000, 'NOK');

**FormHelper**

The form helper has had a number of improvements and API
modifications, see
`Form Helper improvements <http://book.cakephp.org/view/1616/x1-3-improvements>`_
for more information.

Logging
~~~~~~~

Logging and ``CakeLog`` have been enhanced considerably, both in
features and flexibility. See
`New Logging features <http://book.cakephp.org/view/1194/Logging>`_ for more information.

Caching
~~~~~~~

Cache engines have been made more flexible in 1.3. You can now
provide custom ``Cache`` adapters in ``app/libs`` as well as in
plugins using ``$plugin/libs``. App/plugin cache engines can also
override the core engines. Cache adapters must be in a cache
directory. If you had a cache engine named ``MyCustomCacheEngine``
it would be placed in either ``app/libs/cache/my_custom_cache.php``
as an app/libs. Or in ``$plugin/libs/cache/my_custom_cache.php`` as
part of a plugin. Cache configs from plugins need to use the plugin
dot syntax::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

App and Plugin cache engines should be configured in
``app/bootstrap.php``. If you try to configure them in core.php
they will not work correctly.

**New Cache methods**

Cache has a few new methods for 1.3 which make introspection and
testing teardown easier.


-  ``Cache::configured()`` returns an array of configured Cache
   engine keys.
-  ``Cache::drop($config)`` drops a configured Cache engine. Once
   dropped cache engines are no longer readable or writeable.
-  ``Cache::increment()`` Perform an atomic increment on a numeric
   value. This is not implemented in FileEngine.
-  ``Cache::decrement()`` Perform an atomic decrement on a numeric
   value. This is not implemented in FileEngine.

Models, Behaviors and Datasource
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**App::import(), datasources & datasources from plugins**

Datasources can now be included loaded with ``App::import()`` and
be included in plugins! To include a datasource in your plugin you
put it in ``my_plugin/models/datasources/your_datasource.php``. To
import a Datasource from a plugin use
``App::import('Datasource', 'MyPlugin.YourDatasource');``

**Using plugin datasources in your database.php**

You can use plugin datasources by setting the datasource key with
the plugin name. For example if you had a WebservicePack plugin
with a LastFm datasource
(plugin/webservice\_pack/models/datasources/last\_fm.php), you
could do::

    var $lastFm = array(
        'datasource' => 'WebservicePack.LastFm'
        ...

**Model**


-  Missing Validation methods now trigger errors, making debugging
   why validation isn't working easier.
-  Models now support
   `virtual fields <http://book.cakephp.org/view/1608/Virtual-fields>`_

**Behaviors**

Using behaviors that do not exist, now triggers a ``cakeError``
making missing behaviors easier to find and fix.

**CakeSchema**

CakeSchema can now locate, read and write schema files to plugins.
The SchemaShell also exposes this functionality, see below for
changes to SchemaShell. CakeSchema also supports
``tableParameters``. Table Parameters are non column specific table
information such as collation, charset, comments, and table engine
type. Each Dbo implements the tableParameters they support.

**tableParameters in MySQL**

MySQL supports the greatest number of tableParameters; You can use
tableParameters to set a variety of MySQL specific settings.


-  ``engine`` Control the storage engine used for your tables.
-  ``charset`` Control the character set used for tables.
-  ``encoding`` Control the encoding used for tables.

In addition to tableParameters MySQL dbo's implement
``fieldParameters``. ``fieldParameters`` allow you to control MySQL
specific settings per column.


-  ``charset`` Set the character set used for a column
-  ``encoding`` Set the encoding used for a column

See below for examples on how to use table and field parameters in
your schema files.

**tableParameters in Postgres**

....

**tableParameters in SQLite**

....

**Using tableParameters in schema files**

You use ``tableParameters`` just as you would any other key in a
schema file. Much like ``indexes``::

    var $comments => array(
        'id' => array(
          'type' => 'integer',
          'null' => false,
          'default' => 0,
          'key' => 'primary'
        ),
        'post_id' => array('type' => 'integer', 'null' => false, 'default' => 0),
        'comment' => array('type' => 'text'),
        'indexes' => array(
            'PRIMARY' => array('column' => 'id', 'unique' => true),
            'post_id' => array('column' => 'post_id'),
        ),
        'tableParameters' => array(
            'engine' => 'InnoDB',
            'charset' => 'latin1',
            'collate' => 'latin1_general_ci'
        )
    );

is an example of a table using ``tableParameters`` to set some
database specific settings. If you use a schema file that contains
options and features your database does not implement, those
options will be ignored. For example if you imported the above
schema to a PostgreSQL server, all of the tableParameters would be
ignore as PostgreSQL does not support any of the included options.

Console
~~~~~~~

**Bake**

Bake has had a number of significant changes made to it. Those
changes are detailed in
`the bake updates section <http://book.cakephp.org/view/1611/Bake-improvements-in-1-3>`_

**Subclassing**

The ShellDispatcher has been modified to not require shells and
tasks to have *Shell* as their immediate parent anymore.

**Output**

``Shell::nl()`` has been added. It returns a single or multiple
linefeed sequences. ``Shell::out()``, ``err()`` and ``hr()`` now
accept a ``$newlines`` parameter which is passed to ``nl()`` and
allows for controlling how newlines are appended to the output.

``Shell::out()`` and ``Shell::err()`` have been modified, allowing
a parameterless usage. This is especially useful if you're often
using ``$this->out('')`` for outputting just a single newline.

**Acl Shell**

All AclShell commands now take ``node`` parameters. ``node``
parameters can be either an alias path like
``controllers/Posts/view`` or Model.foreign\_key ie. ``User.1``.
You no longer need to know or use the aco/aro id for commands.

The Acl shell ``dataSource`` switch has been removed. Use the
Configure settings instead.

**SchemaShell**

The Schema shell can now read and write Schema files and SQL dumps
to plugins. It expects and will create schema files in
``$plugin/config/schema``

....

Router and Dispatcher
~~~~~~~~~~~~~~~~~~~~~

**Router**

Generating URLs with new style prefixes works exactly the same as
admin routing did in 1.2. They use the same syntax and
persist/behave in the same way. Assuming you have
``Configure::write('Routing.prefixes', array('admin', 'member'));``
in your core.php you will be able to do the following from a
non-prefixed URL::

    $this->Html->link(
      'Go',
      array('controller' => 'posts', 'action' => 'index', 'member' => true)
    );
    $this->Html->link(
      'Go',
      array('controller' => 'posts', 'action' => 'index', 'admin' => true)
    );

Likewise, if you are in a prefixed URL and want to go to a
non-prefixed URL, do the following::

    $this->Html->link(
      'Go',
      array(
        'controller' => 'posts',
        'action' => 'index',
        'member' => false
      )
    );
    $this->Html->link(
      'Go',
      array(
        'controller' => 'posts',
        'action' => 'index',
        'admin' => false
      )
    );

**Route classes**

For 1.3 the router has been internally rebuilt, and a new class
``CakeRoute`` has been created. This class handles the parsing and
reverse matching of an individual connected route. Also new in 1.3
is the ability to create and use your own Route classes. You can
implement any special routing features that may be needed in
application routing classes. Developer route classes must extend
``CakeRoute``, if they do not an error will be triggered. Commonly
a custom route class will override the ``parse()`` and/or
``match()`` methods found in ``CakeRoute`` to provide custom
handling.

**Dispatcher**


-  Accessing filtered asset paths, while having no defined asset
   filter will create 404 status code responses.

Library classes
~~~~~~~~~~~~~~~

**Inflector**

You can now globally customize the default transliteration map used
in Inflector::slug using Inflector::rules. Example
``Inflector::rules('transliteration', array('/å/' => 'aa', '/ø/' => 'oe'))``

The Inflector now also internally caches all data passed to it for
inflection (except slug method).

**Set**

Set has a new method ``Set::apply()``, which allows you to apply
`callbacks <http://ca2.php.net/callback>`_ to the results of
``Set::extract`` and do so in either a map or reduce fashion::

    Set::apply('/Movie/rating', $data, 'array_sum');

Would return the sum of all Movie ratings in ``$data``.

**L10N**

All languages in the catalog now have a direction key. This can be
used to determine/define the text direction of the locale being
used.

**File**


-  File now has a copy() method. It copies the file represented by
   the file instance, to a new location.

**Configure**


-  ``Configure::load()`` can now load configuration files from
   plugins. Use ``Configure::load('plugin.file');`` to load
   configuration files from plugins. Any configuration files in your
   application that use ``.`` in the name should be updated to used
   ``_``

**App/libs**

In addition to ``app/vendors`` a new ``app/libs`` directory has
been added. This directory can also be part of plugins, located at
``$plugin/libs``. Libs directories are intended to contain 1st
party libraries that do not come from 3rd parties or external
vendors. This allows you to separate your organization's internal
libraries from vendor libraries. ``App::import()`` has also been
updated to import from libs directories::

    App::import('Lib', 'ImageManipulation'); //imports app/libs/image_manipulation.php

You can also import libs files from plugins::

    App::import('Lib', 'Geocoding.Geocode'); //imports app/plugins/geocoding/libs/geocode.php

The remainder of lib importing syntax is identical to vendor files.
So if you know how to import vendor files with unique names, you
know how to import libs files with unique names.

**Configuration**


-  The default ``Security.level`` in 1.3 is **medium** instead of
   **high**
-  There is a new configuration value ``Security.cipherSeed`` this
   value should be customized to ensure more secure encrypted cookies,
   and a warning will be generated in development mode when the value
   matches its default value.

**i18n**

Now you can use locale definition files for the LC\_TIME category
to retrieve date and time preferences for a specific language. Just
use any POSIX compliant locale definition file and store it at
app/locale/*language*/ (do not create a folder for the category
LC\_TIME, just put the file in there).

For example, if you have access to a machine running debian or
ubuntu you can find a french locale file at:
/usr/share/i18n/locales/fr\_FR. Copy the part corresponding to
LC\_TIME into app/locale/fr\_fr/LC\_TIME file. You can then access
the time preferences for French language this way::

    Configure::write('Config.language','fr-fr'); // set the current language
    $monthNames = __c('mon',LC_TIME,true); // returns an array with the month names in French
    $dateFormat = __c('d_fmt',LC_TIME,true); // return the preferred dates format for France

You can read a complete guide of possible values in LC\_TIME
definition file in
`this page <http://sunsson.iptime.org/susv3/basedefs/xbd_chap07.html>`_

Miscellaneous
~~~~~~~~~~~~~

**Error Handling**

Subclasses of ErrorHandler can more easily implement additional
error methods. In the past you would need to override
``__construct()`` and work around ErrorHandler's desire to convert
all error methods into ``error404`` when debug = 0. In 1.3, error
methods that are declared in subclasses are not converted to
``error404``. If you want your error methods converted into
error404, then you will need to do it manually.

**Scaffolding**

With the addition of ``Routing.prefixes`` scaffolding has been
updated to allow the scaffolding of any one prefix::

    Configure::write('Routing.prefixes', array('admin', 'member'));

    class PostsController extends AppController {
        var $scaffold = 'member';
    }

Would use scaffolding for member prefixed URLs.

**Validation**

After 1.2 was released, there were numerous requests to add
additional localizations to the ``phone()`` and ``postal()``
methods. Instead of trying to add every locale to Validation
itself, which would result in large bloated ugly methods, and still
not afford the flexibility needed for all cases, an alternate path
was taken. In 1.3, ``phone()`` and ``postal()`` will pass off any
country prefix it does not know how to handle to another class with
the appropriate name. For example if you lived in the Netherlands
you would create a class like::

    class NlValidation {
        public function phone($check) {
            ...
        }
        public function postal($check) {
            ...
        }
    }

This file could be placed anywhere in your application, but must be
imported before attempting to use it. In your model validation you
could use your NlValidation class by doing the following::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl'))
    );

When your model data is validated, Validation will see that it
cannot handle the 'nl' locale and will attempt to delegate out to
``NlValidation::postal()`` and the return of that method will be
used as the pass/fail for the validation. This approach allows you
to create classes that handle a subset or group of locales,
something that a large switch would not have. The usage of the
individual validation methods has not changed, the ability to pass
off to another validator has been added.

**IP Address Validation**

Validation of IP Addresses has been extended to allow strict
validation of a specific IP Version. It will also make use of PHP
native validation mechanisms if available::

    Validation::ip($someAddress);         // Validates both IPv4 and IPv6
    Validation::ip($someAddress, 'IPv4'); // Validates IPv4 Addresses only
    Validation::ip($someAddress, 'IPv6'); // Validates IPv6 Addresses only

**Validation::uuid()**

A uuid() pattern validation has been added to the ``Validation``
class. It will check that a given string matches a UUID by pattern
only. It does not ensure uniqueness of the given UUID.


.. meta::
    :title lang=en: New features in CakePHP 1.3
    :keywords lang=en: component settings,array name,array controller,private methods,necessary components,core components,share names,collisions,func,message id,new features,clutter,consistency,messageid,email,htmlmessage,variables,doc
