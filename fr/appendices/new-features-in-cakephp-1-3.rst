Nouvelles caractéristiques dans CakePHP 1.3
-------------------------------------------

CakePHP 1.3 introduit un nombre de nouvelles fonctionnalités. Ce guide
tente de résumer ces changements et de pointer vers la documentation
nouvelle quand c'est nécessaire.

Components
~~~~~~~~~~

**SecurityComponent**

Les différentes méthodes requireXX comme ``requireGet`` et
``requirePost`` acceptent maintenant un tableau unique en argument ainsi
qu'une collection de noms en chaînes de caractère.

::

    $this->Security->requirePost(array('edit', 'update'));

**Paramètres du Component**

Les paramètres du Component pour tous les components du coeur peuvent
maintenant être définis à partir du tableau ``$components``. Un peu
comme les behaviors, vous pouvez déclarer les paramètres pour les
components quand vous déclarer le component.

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

Ceci devrait réduire le désordre dans vos méthodes ``beforeFilter()`` de
Controller.

**EmailComponent**

-  Vous pouvez maintenant récupérer les contenus rendus des messages Email
   envoyés, en lisant ``$this->Email->htmlMessage`` et
   ``$this->Email->textMessage``. Ces propriétés contiendront le contenu de
   l'email rendu correspondant à son nom.
-  Many of EmailComponent's private methods have been made
   protected for easier extension.
-  EmailComponent::$to peut maintenant être un tableau. Allowing easier setting
   of multiple recipients, and consistency with other properties.
-  ``EmailComponent::$messageId`` has been added, it allows control
   over the Message-ID header for email messages.

View & Helpers
~~~~~~~~~~~~~~

Les Helpers peuvent maintenant être traités par ``$this->Helper->func()`` en
plus de ``$helper->func()``. Cela permet aux variables de vue et aux helpers
de partager les noms et de ne pas créer de collisions.

**Le nouveau JsHelper et les nouvelles fonctionnalités dans HtmlHelper**

Regardez la :doc:`documentation de JsHelper </core-libraries/helpers/js>`
pour plus d'informations.

**Pagination Helper**

Le helper Pagination fournit des classes CSS supplémentaires pour le style et
vous pouvez configurer la direction de sort() par défaut.
``PaginatorHelper::next()`` et ``PaginatorHelper::prev()`` génèrent maintenant
des tags span par défaut, au lieu de divs.

**Helper**

``Helper::assetTimestamp()`` a été ajoutée. Elle ajoutera des timestamps
à tout asset sous WWW\_ROOT. Elle fonctionne avec
``Configure::read('Asset.timestamp');`` comme avant, mais la fonctionnalité
utilisée dans les helpers Html et Javascript a été rendué disponible pour
tous les helpers. En supposant que ``Asset.timestamp == force``

::

    $path = 'css/cake.generic.css'
    $stamped = $this->Html->assetTimestamp($path);

    //$stamped contient 'css/cake.generic.css?5632934892'

Le timestamp ajouté contient la dernière modification de temps du fichier.
Depuis que cette méthode est définie dans ``Helper``, elle est disponible à
toutes les sous-classes.

**TextHelper**

highlight() accepte maintenant un tableau de mots à surligner.

**NumberHelper**

Une nouvelle méthode ``addFormat()`` a été ajoutée. Cette méthode vous permet
de configurer des ensembles de paramètres de monnaie, pour que vous n'ayez pas
à les retaper.

::

    $this->Number->addFormat('NOK', array('before' => 'Kr. '));
    $formatted = $this->Number->currency(1000, 'NOK');

**FormHelper**

Le helper form a eu un certain nombre d'améliorations et de modifications de
l'API, regardez `les améliorations du Hemper Form <https://book.cakephp.org/1.3/en/The-Manual/Core-Helpers/Form.html#improvements>`_
pour plus d'informations.

Logging
~~~~~~~

La connexion et ``CakeLog`` ont été améliorés considérablement, les deux dans
les fonctionnalités et la flexibilité. Regardez
`New Logging features <https://book.cakephp.org/1.3/en/The-Manual/Common-Tasks-With-CakePHP/Logging.html/>`_ pour plus
d'informations.

Caching
~~~~~~~

Les moteurs de Cache ont été fabriqués plus flexibles dans 1.3. Vous pouvez
maintenant fournir des adapters de ``Cache`` personnalisés dans ``app/libs``
ainsi que dans les plugins en utilisant ``$plugin/libs``. Les moteurs de
cache App/plugin peuvent aussi surcharger les moteurs du coeur. Les adapters
de Cache doivent être dans un répertoire de cache. Si vous aviez un moteur
de cache nommé ``MyCustomCacheEngine``, cela serait placé soit dans
``app/libs/cache/my_custom_cache.php``, soit dans app/libs. Ou dans
``$plugin/libs/cache/my_custom_cache.php`` appartenant à un plugin. Les
configs de Cache à partir des plugins ont besoin d'utiliser la syntaxe avec
des points des plugins.

::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        ...
    ));

Les moteurs de cahce de App et Plugin doivent être configurés dans
``app/bootstrap.php``. Si vous essayez de les configurer dans core.php,
ils ne fonctionneront pas correctement.

**Nouvelles méthodes de Cache**

Cache a quelques nouvelles méthodes pour 1.3 ce qui rend l'introspection et
le test bien plus facile.


-  ``Cache::configured()`` retourne un tableau des clés de moteur de Cache
   configurés.
-  ``Cache::drop($config)`` retire un moteur de Cache configuré. Une fois
   supprimé, les moteurs de cache ne sont plus lisible, et l'écriture n'est
   plus disponible.
-  ``Cache::increment()`` Perform an atomic increment on a numeric
   value. This is not implemented in FileEngine.
-  ``Cache::decrement()`` Perform an atomic decrement on a numeric
   value. This is not implemented in FileEngine.

Models, Behaviors and Datasource
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**App::import(), datasources & datasources from plugins**

Les sources de données peuvent maintenant être inclues chargées avec
``App::import()`` et être inclues dans les plugins! Pour inclure
un source de données dans votre plugin, vous pouvez la mettre
dans ``my_plugin/models/datasources/your_datasource.php``. Pour
importer une Source de données à partir d'un plugin, utilisez
``App::import('Datasource', 'MyPlugin.YourDatasource');``

**Utiliser les sources de données dans votre database.php**

Vous pouvez utiliser les sources de données de plugin en configurant la clé
de la source de données avec le nom du plugin. Par exemple, si vous avez un
plugin WebservicePack avec une source de données LastFm
(plugin/webservice\_pack/models/datasources/last\_fm.php), vous pouvez faire:

::

    var $lastFm = array(
        'datasource' => 'WebservicePack.LastFm'
        ...

**Model**


-  Missing Validation methods now trigger errors, making debugging
   why validation isn't working easier.
-  Models now support virtual fields.

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
``fieldParameters``. fieldParameters allow you to control MySQL
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
schema file. Much like ``indexes``:

::

    var $comments => array(
        'id' => array('type' => 'integer', 'null' => false, 'default' => 0, 'key' => 'primary'),
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
`the bake updates section <https://book.cakephp.org/1.3/en/The-Manual/Core-Console-Applications/Code-Generation-with-Bake.html#bake-improvements-in-1-3>`_

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
non-prefixed URL:

::

    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'member' => true));
    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'admin' => true));

Likewise, if you are in a prefixed URL and want to go to a
non-prefixed URL, do the following:

::

    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'member' => false));
    $this->Html->link('Go', array('controller' => 'posts', 'action' => 'index', 'admin' => false));

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
in Inflector::slug using Inflector::rules. eg.
``Inflector::rules('transliteration', array('/å/' => 'aa', '/ø/' => 'oe'))``

The Inflector now also internally caches all data passed to it for
inflection (except slug method).

**Set**

Set has a new method ``Set::apply()``, which allows you to apply
`callbacks <http://ca2.php.net/callback>`_ to the results of
``Set::extract`` and do so in either a map or reduce fashion.

::

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
updated to import from libs directories.

::

    App::import('Lib', 'ImageManipulation'); //imports app/libs/image_manipulation.php

You can also import libs files from plugins

::

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
the time preferences for French language this way:

::

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
updated to allow the scaffolding of any one prefix.

::

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
you would create a class like

::

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
could use your NlValidation class by doing the following.

::

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

La validation des adresses IP a été étendu pour autoriser une stricte
validation d'une Version d'IP spécifique. Cela utilisera aussi les
méchanismes de validation natifs de PHP si ils sont disponibles.

::

    Validation::ip($someAddress);         // Valide les deux IPv4 et IPv6
    Validation::ip($someAddress, 'IPv4'); // Valide les adresses IPv4 seulement
    Validation::ip($someAddress, 'IPv6'); // Valide les adresses IPv6 seulement

**Validation::uuid()**

Un pattern de validation uuid() a été ajouté à la classe ``Validation``.
Elle vérifiera qu'une chaîne donnée correspondra à un UUID par pattern
uniquement. Cela ne garantit pas l'unicité du UUID donné.


.. meta::
    :title lang=fr: Nouvelles caractéristiques dans CakePHP 1.3
    :keywords lang=fr: component settings,array name,array controller,private methods,necessary components,core components,share names,collisions,func,message id,new features,clutter,consistency,messageid,email,htmlmessage,variables,doc
