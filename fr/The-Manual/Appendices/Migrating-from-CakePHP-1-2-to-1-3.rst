Migration de CakePHP 1.2 vers 1.3
#################################

Ce guide résume les nombreux changements nécessaires à la migration de
CakePHP version 1.2 vers la version 1.3. Chaque section contient des
informations pertinentes sur les modifications apportées aux méthodes
existantes, ainsi que sur toutes les méthodes qui ont été supprimées /
renommées.

**Remplacement de fichiers (important)**

-  webroot/index.php : doit être remplacé suite aux changements
   effectués dans le processus de bootstrap.
-  config/core.php : des paramètres supplémentaires ont été mis en place
   car nécessaires pour PHP 5.3.
-  webroot/test.php : remplacer si vous voulez exécuter des tests
   unitaires.

Constantes supprimées
=====================

Les constantes suivantes ont été supprimées de CakePHP. Si votre
application dépend de celles-ci, vous devez les redéfinir dans
``app/config/bootstrap.php``

-  ``CIPHER_SEED`` - Il a été remplacé par la variable
   ``Security.cipherSeed`` de la classe Configure qui peut être modifiée
   dans ``app/config/core.php``
-  ``PEAR``
-  ``INFLECTIONS``
-  ``VALID_NOT_EMPTY``
-  ``VALID_EMAIL``
-  ``VALID_NUMBER``
-  ``VALID_YEAR``

Configuration and application bootstrapping
===========================================

**Bootstrapping Additional Paths.**

In your app/config/bootstrap.php you may have variables like
``$pluginPaths`` or ``$controllerPaths``.
 There is a new way to add those paths. As of 1.3 RC1 the
``$pluginPaths`` variables will no longer work. You must use
 ``App::build()`` to modify paths.

::

    App::build(array(
        'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
        'models' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
        'views' => array('/full/path/to/views/', '/next/full/path/to/views/'),
        'controllers' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
        'datasources' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
        'behaviors' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
        'components' => array('/full/path/to/components/', '/next/full/path/to/components/'),
        'helpers' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
        'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
        'shells' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/'),
        'libs' => array('/full/path/to/libs/', '/next/full/path/to/libs/')
    ));

Also changed is the order in which bootstrapping occurs. In the past
``app/config/core.php`` was loaded **after**
``app/config/bootstrap.php``. This caused any ``App::import()`` in an
application bootstrap to be un-cached and considerably slower than a
cached include. In 1.3 core.php is loaded and the core cache configs are
created **before** bootstrap.php is loaded.

**Loading custom inflections**

``inflections.php`` has been removed, it was an unnecessary file hit,
and the related features have been refactored into a method to increase
their flexibility. You now use ``Inflector::rules()`` to load custom
inflections.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

Will merge the supplied rules into the infection sets, with the added
rules taking precedence over the core rules.

Fichiers renommés et changements internes
=========================================

**Librairies renommées**

Les librairies suivantes du cœur de CakePHP : libs/session.php,
libs/socket.php, libs/model/schema.php et libs/model/behavior.php ont
été renommées, afin d'obtenir une meilleure cohérence entre les noms de
fichiers et les classes qui y sont incluses (ainsi que pour régler
certains problèmes avec les espaces de nom) :

-  session.php -> cake\_session.php

   -  App::import('Core', 'Session') -> App::import('Core',
      'CakeSession')

-  socket.php -> cake\_socket.php

   -  App::import('Core', 'Socket') -> App::import('Core', 'CakeSocket')

-  schema.php -> cake\_schema.php

   -  App::import('Model', 'Schema') -> App::import('Model',
      'CakeSchema')

-  behavior.php -> model\_behavior.php

   -  App::import('Core', 'Behavior') -> App::import('Core',
      'ModelBehavior')

Dans la plupart des cas, le renommage des fichiers ci-dessus n'affectera
en rien la manière de coder.

**L'héritage de la classe Object**

Les classes suivantes n'étendent plus la classe Object :

-  Router
-  Set
-  Inflector
-  Cache
-  CacheEngine

Si vous utilisiez des méthodes de la classe Object depuis ces classes,
vous ne devrez plus utiliser ces méthodes.

Contrôleurs et Composants
=========================

**Contrôleurs**

-  ``Controller::set()`` ne change plus les variables ``$ma_variable``
   en ``$maVariable``. Les variables apparaissent toujours dans la vue
   exactement comme vous les avez définies.
-  ``Controller::set('titre', $var)`` ne définit plus
   ``$title_for_layout`` quand le layout est rendu.
   ``$title_for_layout`` est toujours rempli par défaut. Mais si vous
   voulez personnaliser cela, utilisez
   ``$this->set('title_for_layout', $var)``.
-  ``Controller::$pageTitle`` a été supprimé. Utilisez
   ``$this->set('title_for_layout', $var);`` à la place.
-  Le Contrôleur a deux nouvelles méthodes : ``startupProcess`` et
   ``shutdownProcess``. Ces méthodes sont responsables de la
   manipulation des processus de démarrage et d'arrêt du contrôleur.

**Composant**

-  ``Component::triggerCallback`` a été ajouté. C'est un maillon
   générique pour les processus de callbacks du composant. Il supplante
   ``Component::startup()``, ``Component::shutdown()`` et
   ``Component::beforeRender()`` comme façon privilégiée de déclencher
   les callbacks.

**Composant Cookie**

-  ``del`` est déprécié. Utilisez ``delete``

**Composant RequestHandler**

-  ``getReferrer`` est déprécié. Utilisez ``getReferer``

**Composant Session**

-  ``del`` est déprécié. Utilisez ``delete``

**Assistant Session et Composant Session**

Le second paramètre utilisé pour ``SessionComponent::setFlash()``, sert
à définir le layout et créer un fichier de rendu. Ceci a été modifié
pour utiliser un ``element``. Si vous spécifiez des gabarits de messages
"session flash" personnalisés dans vos applications, vous devrez
apporter les modifications suivantes :

#. Déplacez les fichiers de layouts requis dans app/views/elements
#. Renommez la variable $content\_for\_layout en $message

Le ``Helper Session`` et le ``Composant Session`` ne sont plus inclus
automatiquement si vous ne faites pas appel à eux. Ils se comportent
maintenant comme n'importe quel autre composant et doivent être déclarés
comme n'importe quel autre composant/assistant. Vous devriez mettre à
jour ``AppController::$components`` et ``AppController::$helpers`` afin
d'y inclure ces classes pour maintenir le comportement de votre
application.

::

    var $components = array('Session', 'Auth', ...);
    var $helpers = array('Session', 'Html', 'Form' ...);

Ces changements ont été faits pour rendre CakePHP plus explicite et
déclaratif au niveau des classes que vous, le développeur d'application,
voulez utiliser. Auparavant, il n'existait aucune façon d'éviter le
chargement automatique des classes Session sans modifier les fichiers du
cœur de CakePHP. Ce qui est une chose que nous vous permettre d'éviter.
Par ailleurs, les classes de Session étaient les seuls composants et
assistants magiques. Cette modification aide à uniformiser et normaliser
le comportement entre toutes les classes.

Library Classes
===============

**CakeSession**

-  ``del`` is deprecated use ``delete``

**SessionComponent**

-  ``SessionComponent::setFlash()`` now uses an *element* instead of a
   *layout* as its second parameter. Be sure to move any flash layouts
   from app/views/layouts to app/views/elements and change instances of
   $content\_for\_layout to $message.

**Folder**

-  ``mkdir`` is deprecated use ``create``
-  ``mv`` is deprecated use ``move``
-  ``ls`` is deprecated use ``read``
-  ``cp`` is deprecated use ``copy``
-  ``rm`` is deprecated use ``delete``

**Set**

-  ``isEqual`` is deprecated. Use == or ===.

**String**

-  ``getInstance`` is deprecated, call String methods statically.

**Router**

``Routing.admin`` is deprecated. It provided an inconsistent behavior
with other prefix style routes in that it was treated differently.
Instead you should use ``Routing.prefixes``. Prefix routes in 1.3 do not
require additional routes to be declared manually. All prefix routes
will be generated automatically. To update simply change your core.php.

::

    //from:
    Configure::write('Routing.admin', 'admin');

    //to:
    Configure::write('Routing.prefixes', array('admin'));

See the New features guide for more information on using prefix routes.
A small change has also been done to routing params. Routed params
should now only consist of alphanumeric chars, - and \_ or
``/[A-Z0-9-_+]+/``.

::

    Router::connect('/:$%@#param/:action/*', array(...)); // BAD
    Router::connect('/:can/:anybody/:see/:m-3/*', array(...)); //Acceptable

For 1.3 the internals of the Router were heavily refactored to increase
performance and reduce code clutter. The side effect of this is two
seldom used features were removed, as they were problematic and buggy
even with the existing code base. First path segments using full regular
expressions was removed. You can no longer create routes like

::

    Router::connect('/([0-9]+)-p-(.*)/', array('controller' => 'products', 'action' => 'show'));

These routes complicated route compilation and impossible to reverse
route. If you need routes like this, it is recommended that you use
route parameters with capture patterns. Next mid-route greedy star
support has been removed. It was previously possible to use a greedy
star in the middle of a route.

::

    Router::connect(
        '/pages/*/:event',
        array('controller' => 'pages', 'action' => 'display'), 
        array('event' => '[a-z0-9_-]+')
    );

This is no longer supported as mid-route greedy stars behaved
erratically, and complicated route compiling. Outside of these two
edge-case features and the above changes the router behaves exactly as
it did in 1.2

Also, people using the 'id' key in array-form URLs will notice that
Router::url() now treats this as a named parameter. If you previously
used this approach for passing the ID parameter to actions, you will
need to rewrite all your $html->link() and $this->redirect() calls to
reflect this change.

::

    // old format:
    $url = array('controller' => 'posts', 'action' => 'view', 'id' => $id);
    // use cases:
    Router::url($url);
    $html->link($url);
    $this->redirect($url);
    // 1.2 result:
    /posts/view/123
    // 1.3 result:
    /posts/view/id:123
    // correct format:
    $url = array('controller' => 'posts', 'action' => 'view', $id);

**Dispatcher**

``Dispatcher`` is no longer capable of setting a controller's
layout/viewPath with request parameters. Control of these properties
should be handled by the Controller, not the Dispatcher. This feature
was also undocumented, and untested.

**Debugger**

-  ``Debugger::checkSessionKey()`` has been renamed to
   ``Debugger::checkSecurityKeys()``
-  Calling ``Debugger::output("text")`` no longer works. Use
   ``Debugger::output("txt")``.

**Object**

-  ``Object::$_log`` has been removed. ``CakeLog::write`` is now called
   statically. See :doc:`/The-Manual/Common-Tasks-With-CakePHP/Logging` for more
   information on changes made to logging.

**Sanitize**

-  ``Sanitize::html()`` now actually always returns escaped strings. In
   the past using the ``$remove`` parameter would skip entity encoding,
   returning possibly dangerous content.
-  ``Sanitize::clean()`` now has a ``remove_html`` option. This will
   trigger the ``strip_tags`` feature of ``Sanitize::html()``, and must
   be used in conjunction with the ``encode`` parameter.

**Configure and App**

-  Configure::listObjects() replaced by App::objects()
-  Configure::corePaths() replaced by App::core()
-  Configure::buildPaths() replaced by App::build()
-  Configure no longer manages paths.
-  Configure::write('modelPaths', array...) replaced by
   App::build(array('models' => array...))
-  Configure::read('modelPaths') replaced by App::path('models')
-  There is no longer a debug = 3. The controller dumps generated by
   this setting often caused memory consumption issues making it an
   impractical and unusable setting. The ``$cakeDebug`` variable has
   also been removed from ``View::renderLayout`` You should remove this
   variable reference to avoid errors.
-  ``Configure::load()`` can now load configuration files from plugins.
   Use ``Configure::load('plugin.file');`` to load configuration files
   from plugins. Any configuration files in your application that use
   ``.`` in the name should be updated to use ``_``

**Cache**

In addition to being able to load CacheEngines from app/libs or plugins,
Cache underwent some refactoring for CakePHP1.3. These refactorings
focused around reducing the number and frequency of method calls. The
end result was a significant performance improvement with only a few
minor API changes which are detailed below.

The changes in Cache removed the singletons used for each Engine type,
and instead an engine instance is made for each unique key created with
``Cache::config()``. Since engines are not singletons anymore,
``Cache::engine()`` was not needed and was removed. In addition
``Cache::isInitialized()`` now checks cache *configuration names*, not
cache *engine names*. You can still use ``Cache::set()`` or
``Cache::engine()`` to modify cache configurations. Also checkout the
`New features guide </fr/view/1572/New-features-in-CakePHP-1-3>`_ for
more information on the additional methods added to ``Cache``.

It should be noted that using an app/libs or plugin cache engine for the
default cache config can cause performance issues as the import that
loads these classes will always be uncached. It is recommended that you
either use one of the core cache engines for your ``default``
configuration, or manually include the cache engine class before
configuring it. Furthermore any non-core cache engine configurations
should be done in ``app/config/bootstrap.php`` for the same reasons
detailed above.

Model Databases and Datasources
===============================

**Model**

-  ``Model::del()`` and ``Model::remove()`` have been removed in favor
   of ``Model::delete()``, which is now the canonical delete method.
-  ``Model::findAll``, findCount, findNeighbours, removed.
-  Dynamic calling of setTablePrefix() has been removed. tableprefix
   should be with the ``$tablePrefix`` property, and any other custom
   construction behavior should be done in an overridden
   ``Model::__construct()``.
-  ``DboSource::query()`` now throws warnings for un-handled model
   methods, instead of trying to run them as queries. This means, people
   starting transactions improperly via the ``$this->Model->begin()``
   syntax will need to update their code so that it accesses the model's
   DataSource object directly.
-  Missing validation methods will now trigger errors in development
   mode.
-  Missing behaviors will now trigger a cakeError.
-  ``Model::find(first)`` will no longer use the id property for default
   conditions if no conditions are supplied and id is not empty. Instead
   no conditions will be used
-  For Model::saveAll() the default value for option 'validate' is now
   'first' instead of true

**Datasources**

-  DataSource::exists() has been refactored to be more consistent with
   non-database backed datasources. Previously, if you set
   ``var $useTable = false; var $useDbConfig = 'custom';``, it was
   impossible for ``Model::exists()`` to return anything but false. This
   prevented custom datasources from using ``create()`` or ``update()``
   correctly without some ugly hacks. If you have custom datasources
   that implement ``create()``, ``update()``, and ``read()`` (since
   ``Model::exists()`` will make a call to ``Model::find('count')``,
   which is passed to ``DataSource::read()``), make sure to re-run your
   unit tests on 1.3.

**Databases**

Most database configurations no longer support the 'connect' key (which
has been deprecated since pre-1.2). Instead, set
``'persistent' => true`` or false to determine whether or not a
persistent database connection should be used

**SQL log dumping**

A commonly asked question is how can one disable or remove the SQL log
dump at the bottom of the page?. In previous versions the HTML SQL log
generation was buried inside DboSource. For 1.3 there is a new core
element called ``sql_dump``. ``DboSource`` no longer automatically
outputs SQL logs. If you want to output SQL logs in 1.3, do the
following:

::

    <?php echo $this->element('sql_dump'); ?>

You can place this element anywhere in your layout or view. The
``sql_dump`` element will only generate output when
``Configure::read('debug')`` is equal to 2. You can of course customize
or override this element in your app by creating
``app/views/elements/sql_dump.ctp``.

View and Helpers
================

**View**

-  ``View::renderElement`` removed. Use ``View::element()`` instead.
-  Automagic support for ``.thtml`` view file extension has been removed
   either declare ``$this->ext = 'thtml';`` in your controllers, or
   rename your views to use ``.ctp``
-  ``View::set('title', $var)`` no longer sets ``$title_for_layout``
   when rendering the layout. ``$title_for_layout`` is still populated
   by default. But if you want to customize it, use
   ``$this->set('title_for_layout', $var)``.
-  ``View::$pageTitle`` has been removed. Use
   ``$this->set('title_for_layout', $var);`` instead.
-  The ``$cakeDebug`` layout variable associated with debug = 3 has been
   removed. Remove it from your layouts as it will cause errors. Also
   see the notes related to SQL log dumping and Configure for more
   information.

All core helpers no longer use ``Helper::output()``. The method was
inconsistently used and caused output issues with many of FormHelper's
methods. If you previously overrode ``AppHelper::output()`` to force
helpers to auto-echo you will need to update your view files to manually
echo helper output.

**TextHelper**

-  ``TextHelper::trim()`` is deprecated, used ``truncate()`` instead.
-  ``TextHelper::highlight()`` no longer has:
-  an ``$highlighter`` parameter. Use ``$options['format']`` instead.
-  an ``$considerHtml``\ parameter. Use ``$options['html']`` instead.
-  ``TextHelper::truncate()`` no longer has:
-  an ``$ending`` parameter. Use ``$options['ending']`` instead.
-  an ``$exact`` parameter. Use ``$options['exact']`` instead.
-  an ``$considerHtml``\ parameter. Use ``$options['html']`` instead.

**PaginatorHelper**

PaginatorHelper has had a number of enhancements applied to make styling
easier.
 ``prev()``, ``next()``, ``first()`` and ``last()``

The disabled state of these methods now defaults to ``<span>`` tags
instead of ``<div>`` tags.

passedArgs are now auto merged with url options in paginator.

``sort()``, ``prev()``, ``next()`` now add additional class names to the
generated html. ``prev()`` adds a class of prev. ``next()`` adds a class
of next. ``sort()`` will add the direction currently being sorted,
either asc or desc.

**FormHelper**

-  ``FormHelper::dateTime()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::year()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::month()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::day()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::minute()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::meridian()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::select()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  Default urls generated by form helper no longer contain 'id'
   parameter. This makes default urls more consistent with documented
   userland routes. Also enables reverse routing to work in a more
   intuitive fashion with default FormHelper urls.
-  ``FormHelper::submit()`` Can now create other types of inputs other
   than type=submit. Use the type option to control the type of input
   generated.
-  ``FormHelper::button()`` Now creates ``<button>`` elements instead of
   reset or clear inputs. If you want to generate those types of inputs
   use ``FormHelper::submit()`` with a ``'type' => 'reset'`` option for
   example.
-  ``FormHelper::secure()`` and ``FormHelper::create()`` no longer
   create hidden fieldset elements. Instead they create hidden div
   elements. This improves validation with HTML4.

Also be sure to check the :doc:`/The-Manual/Core-Helpers/Form` for additional changes and
new features in the FormHelper.

**HtmlHelper**

-  ``HtmlHelper::meta()`` no longer has an ``$inline`` parameter. It has
   been merged with the ``$options`` array.
-  ``HtmlHelper::link()`` no longer has an ``$escapeTitle`` parameter.
   Use ``$options['escape']`` instead.
-  ``HtmlHelper::para()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::div()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::tag()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::css()`` no longer has an ``$inline`` parameter. Use
   ``$options['inline']`` instead.

**SessionHelper**

-  ``flash()`` no longer auto echos. You must add an
   ``echo $session->flash();`` to your session->flash() calls. flash()
   was the only helper method that auto outputted, and was changed to
   create consistency in helper methods.

**CacheHelper**

CacheHelper's interactions with ``Controller::$cacheAction`` has changed
slightly. In the past if you used an array for ``$cacheAction`` you were
required to use the routed url as the keys, this caused caching to break
whenever routes were changed. You also could set different cache
durations for different passed argument values, but not different named
parameters or query string parameters. Both of these
limitations/inconsistencies have been removed. You now use the
controller's action names as the keys for ``$cacheAction``. This makes
configuring ``$cacheAction`` easier as its no longer coupled to the
routing, and allows cacheAction to work with all custom routing. If you
need to have custom cache durations for specific argument sets you will
need to detect and update cacheAction in your controller.

**TimeHelper**

TimeHelper has been refactored to make it more i18n friendly. Internally
almost all calls to date() have been replaced by strftime(). The new
method TimeHelper::i18nFormat() has been added and will take
localization data from a LC\_TIME locale definition file in app/locale
following the POSIX standard. These are the changes made in the
TimeHelper API:

-  TimeHelper::format() can now take a time string as first parameter
   and a format string as the second one, the format must be using the
   strftime() style. When called with this parameter order it will try
   to automatically convert the date format into the preferred one for
   the current locale. It will also take parameters as in 1.2.x version
   to be backwards compatible, but in this case format string must be
   compatible with date().
-  TimeHelper::i18nFormat() has been added

**Deprecated Helpers**

Both the JavascriptHelper and the AjaxHelper are deprecated, and the
JsHelper + HtmlHelper should be used in their place.

You should replace

-  ``$javascript->link()`` with ``$html->script()``
-  ``$javascript->codeBlock()`` with ``$html->scriptBlock()`` or
   ``$html->scriptStart()`` and ``$html->scriptEnd()`` depending on your
   usage.

Console and shells
==================

**Shell**

``Shell::getAdmin()`` has been moved up to ``ProjectTask::getAdmin()``

**Schema shell**

-  ``cake schema run create`` has been renamed to ``cake schema create``
-  ``cake schema run update`` has been renamed to ``cake schema update``

**Console Error Handling**

The shell dispatcher has been modified to exit with a ``1`` status code
if the method called on the shell explicitly returns ``false``.
Returning anything else results in a ``0`` status code. Before the value
returned from the method was used directly as the status code for
exiting the shell.

Shell methods which are returning ``1`` to indicate an error should be
updated to return ``false`` instead.

``Shell::error()`` has been modified to exit with status code 1 after
printing the error message which now uses a slightly different
formatting.

::

    $this->error('Invalid Foo', 'Please provide bar.');
    // outputs:
    Error: Invalid Foo
    Please provide bar.
    // exits with status code 1

``ShellDispatcher::stderr()`` has been modified to not prepend Error: to
the message anymore. It's signature is now similar to
``Shell::stdout()``.

**ShellDispatcher::shiftArgs()**

The method has been modified to return the shifted argument. Before if
no arguments were available the method was returning false, it now
returns null. Before if arguments were available the method was
returning true, it now returns the shifted argument instead.

Vendors, Test Suite & schema
============================

**vendors/css, vendors/js, and vendors/img**

Support for these three directories, both in ``app/vendors`` as well as
``plugin/vendors`` has been removed. They have been replaced with plugin
and theme webroot directories.

**Test Suite and Unit Tests**

Group tests should now extend TestSuite instead of the deprecated
GroupTest class. If your Group tests do not run, you will need to update
the base class.

**Vendor, plugin and theme assets**

Vendor asset serving has been removed in 1.3 in favour of plugin and
theme webroot directories.

Schema files used with the SchemaShell have been moved to
``app/config/schema`` instead of ``app/config/sql`` Although
``config/sql`` will continue to work in 1.3, it will not in future
versions, it is recommend that the new path is used.
