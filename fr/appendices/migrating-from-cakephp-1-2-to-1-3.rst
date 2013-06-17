Migrer de CakePHP 1.2 vers 1.3
##############################

Ce guide résume plusieurs des changements nécessaires quand on migre 
du coeur de Cake 1.2 vers 1.3. Chaque section contient des informations 
pertinentes pour les modifications faîtes aux méthodes existantes 
ainsi que toute méthode qui a été retirée/renommée.

**Remplacements du fichier App (important)**


-  webroot/index.php: Doit être remplacé à cause des changements dans le 
   processus de bootstrapping.
-  config/core.php: Des configurations additionnelles ont été mise en place
   qui sont requises pour PHP 5.3.
-  webroot/test.php: Remplacez si vous voulez lancer des tests unitiaires.

Constantes retirées
~~~~~~~~~~~~~~~~~~~

Les constantes suivantes ont été retirées de CakePHP. Si votre application
dépend d'eux, vous devez les définir dans ``app/config/bootstrap.php``

-  ``CIPHER_SEED`` - Cela a été remplacé par la variable 
   ``Security.cipherSeed`` de la classe de configuration qui doit être changée 
   dans ``app/config/core.php``
-  ``PEAR``
-  ``INFLECTIONS``
-  ``VALID_NOT_EMPTY``
-  ``VALID_EMAIL``
-  ``VALID_NUMBER``
-  ``VALID_YEAR``

Configuration et bootstrapping de l'application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Chemins de bootstrapping en plus.**

Dans votre fichier app/config/bootstrap.php il se peut que vous ayez des 
variables telles que ``$pluginPaths`` ou ``$controllerPaths``.
Il y a une nouvelle façon d'ajouter ces chemins. Comme dans la 1.3 RC1, les 
variables ``$pluginPaths`` ne fonctionneront plus. Vous devez utiliser 
``App::build()`` pour modifier les chemins.

::

    App::build(array(
        'plugins' => array('/chemin/complet/vers/plugins/', '/prochain/chemin/complet/vers/plugins/'),
        'models' =>  array('/chemin/complet/vers/models/', '/prochain/chemin/complet/vers/models/'),
        'views' => array('/chemin/complet/vers/vues/', '/prochain/chemin/complet/vers/vues/'),
        'controllers' => array('/chemin/complet/vers/controllers/', '/prochain/chemin/complet/vers/controllers/'),
        'datasources' => array('/chemin/complet/vers/sources_de_données/', '/prochain/chemin/complet/vers/source_de_données/'),
        'behaviors' => array('/chemin/complet/vers/behaviors/', '/prochain/chemin/complet/vers/behaviors/'),
        'components' => array('/chemin/complet/vers/components/', '/prochain/chemin/complet/vers/components/'),
        'helpers' => array('/chemin/complet/vers/helpers/', '/prochain/chemin/complet/vers/helpers/'),
        'vendors' => array('/chemin/complet/vers/vendors/', '/prochain/chemin/complet/vers/vendors/'),
        'shells' => array('/chemin/complet/vers/shells/', '/prochain/chemin/complet/vers/shells/'),
        'locales' => array('/chemin/complet/vers/locale/', '/prochain/chemin/complet/vers/locale/'),
        'libs' => array('/chemin/complet/vers/libs/', '/prochain/chemin/complet/vers/libs/')
    ));

Ce qui a aussi changé est l'ordre dans lequel apparait le bootstrapping.
Dans le passé, ``app/config/core.php`` était chargé **après**
``app/config/bootstrap.php``. Cela entraînait que n'importe quel 
``App::import()`` dans le bootstrap d'une application n'était plus en cache 
et ralentissait considérablement par rapport à une inclusion en cache. Dans 
1.3, le fichier core.php est chargé et les configurations du coeur mises en 
cache sont créées **avant** que bootstrap.php soit chargé.

**Chargement des inflections**

``inflections.php`` a été retiré, c'était un fichier non nécessaire et les 
fonctionnalités liées ont été reconstruites dans une méthode pour augmenter 
leur flexibilité. Vous pouvez maintenant utiliser ``Inflector::rules()`` pour 
charger les différentes inflections.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

Fusionnera les règles fournies dans un ensemble d'inflections, avec les règles 
ajoutées prenant le pas sur les règles de base.

Renommages de fichier et changements internes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Renommage des Librairies**

Les librairies du coeur de libs/session.php, libs/socket.php,
libs/model/schema.php et libs/model/behavior.php ont été renommées
afin qu'il y ait une meilleure correspondance entre les noms de fichiers 
et les principales classes contenues (ainsi que la gestion avec les problèmes 
d'espaces de noms):

-  session.php ⇒ cake\_session.php

   
   -  App::import('Core', 'Session') ⇒ App::import('Core',
      'CakeSession')

-  socket.php ⇒ cake\_socket.php

   
   -  App::import('Core', 'Socket') ⇒ App::import('Core',
      'CakeSocket')

-  schema.php ⇒ cake\_schema.php

   
   -  App::import('Model', 'Schema') ⇒ App::import('Model',
      'CakeSchema')

-  behavior.php ⇒ model\_behavior.php

   
   -  App::import('Core', 'Behavior') ⇒ App::import('Core',
      'ModelBehavior')


Dans la plupart des cas, le renommage ci-dessus, n'affectera pas les codes 
existants.

**Héritage de Object**

Les classes suivantes ne vont plus étendre Object:


-  Router
-  Set
-  Inflector
-  Cache
-  CacheEngine

Si vous utilisiez les méthodes de Object à partir de ces classes, vous devrez 
ne plus utiliser ces méthodes.

Controllers & Components
~~~~~~~~~~~~~~~~~~~~~~~~

**Controller**


-  ``Controller::set()`` ne change plus les variables à partir de
   ``$var_name`` vers ``$varName``. Les variables apparaissent toujours
   dans la vue exactement comme vous l'aviez fixée.

-  ``Controller::set('title', $var)`` ne fixe plus
   ``$title_for_layout`` quand il rend le layout.
   ``$title_for_layout`` est toujours rempli par défaut. Mais si vous voulez 
   le modifier, utilisez
   ``$this->set('title_for_layout', $var)``.

-  ``Controller::$pageTitle`` a été retiré. Utilisez
   ``$this->set('title_for_layout', $var);`` à la place.

-  Controller a deux nouvelles méthodes ``startupProcess`` et
   ``shutdownProcess``. Ces méthodes sont responsables de la gestion du startup 
   du controller et des processus de shutdown.
   
**Component**

- ``Component::triggerCallback`` a été ajouté. C'est un hook générique 
  dans le processus de callback du component. Il supplante
  ``Component::startup()``, ``Component::shutdown()`` et
  ``Component::beforeRender()`` comme manière préférentielle pour
  déclencher les callbacks.

**CookieComponent**

- ``del`` est dépreciée, utilisez ``delete``

**AclComponent + DbAcl**

La vérification de la référence du Noeud faite avec les chemins sont 
maintenant moins gourmands et ne consommeront plus les noeuds intermédiaires 
quand on fait des recherches. Dans le passé, étant donné la structure:

::

    ROOT/
        Users/
              Users/
                    edit

Le chemin ``ROOT/Users`` correspondrait au dernier noeud Users 
au lieu du premier. Dans 1.3, si vous vous attenidez à obtenir le dernier 
noeud, vous deviez utiliser le chemin ``ROOT/Users/Users``

**RequestHandlerComponent**


-  ``getReferrer`` est déprecié, utilisez ``getReferer``

**SessionComponent & SessionHelper**


-  ``del`` est déprecié, utilisez ``delete``

``SessionComponent::setFlash()`` Le second paramètre utilisé habituellement 
pour configurer le layout et par conséquence le rendu du fichier layout.
Cela a été modifié pour utiliser un élément. Si vous spécifiez des flash de 
session dans vos applications vous aurez besoin de faire les changements 
suivants.

#. Déplacer les fichiers de layout requis dans app/views/elements
#. Renommer la variable $content\_for\_layout en $message
#. Assurez vous d'avoir ``echo $session->flash();`` dans votre layout

``SessionComponent`` et ``SessionHelper`` ne sont pas chargés automatiquement.
Les deux helpers ``SessionComponent`` et ``SessionHelper`` ne sont plus inclus
automatiquement sans que vous le demandiez. SessionHelper
et SessionComponent se comportent maintenant comme chaque autre component et 
doivent être déclarés comme tout autre helper/component. Vous devriez mettre
à jour ``AppController::$components`` et ``AppController::$helpers`` pour
inclure ces classes pour conserver les behaviors existants.

::

    var $components = array('Session', 'Auth', ...);
    var $helpers = array('Session', 'Html', 'Form' ...);

Ces changements ont été faits pour rendre CakePHP plus explicites et
déclaratifs dans quelles classes, vous le développeur d'applications,
veut l'utiliser. Dans le passé, il n'y avait aucun moyen d'éviter le
chargement des classes de Session sans modifier les fichiers du coeur.
Ce qui est quelque chose que nous souhaitions que vous soyez capable
d'éviter. De plus, les classes de Session étaient le seul component
ou helper magique. Ce changement aide à unifier et normaliser
le behavior pour toutes les classes.

Classes de Librairie
~~~~~~~~~~~~~~~~~~~~

**CakeSession**


-  ``del`` est déprecié, utilisez ``delete``

**SessionComponent**


-  ``SessionComponent::setFlash()`` utilise maintenant un *élément* 
   au lieu d'un *layout* en second paramètre. Assurez vous de déplacer 
   tout flash layout de app/views/layouts vers app/views/elements et de 
   changer les instances de $content\_for\_layout en $message.

**Folder**


-  ``mkdir`` est déprecié, utilisez ``create``
-  ``mv`` est déprecié, utilisez ``move``
-  ``ls`` est déprecié, utilisez ``read``
-  ``cp`` est déprecié, utilisez ``copy``
-  ``rm`` est déprecié, utilisez ``delete``

**Set**


-  ``isEqual`` est déprecié, utilisez == ou ===.

**String**


-  ``getInstance`` est déprecié, appelez les méthodes String statiquement.

**Router**

``Routing.admin`` est déprecié. Il fournit un behavior incompatible avec 
les autres styles de prefix de routes puisqu'il était traité différemment. 
A la place, vous devez utiliser ``Routing.prefixes``. Les préfixes de routes 
dans 1.3 ne nécessitent pas la déclaration manuelle de routes supplémentaires. 
Tous les préfixes de routes seront générés automatiquement. Pour mettre à 
jour, changez simplement votre core.php.

::

    //Forme ancienne:
    Configure::write('Routing.admin', 'admin');
    
    //à changer en:
    Configure::write('Routing.prefixes', array('admin'));

Voir le guide des nouvelles fonctionnalités pour plus d'informations
sur l'utilisation des préfixes de routes.
Un petit changement a aussi été fait pour router les paramètres. Les 
paramètres routés doivent maintenant seulement être des caractères
alphanumériques, - et \_ ou ``/[A-Z0-9-_+]+/``.

::

    Router::connect('/:$%@#param/:action/*', array(...)); // BAD
    Router::connect('/:can/:anybody/:see/:m-3/*', array(...)); //Acceptable

Dans 1.3, les entrailles du Router étaient hautement reconstruites pour 
améliorer la performance et réduire le fouillis du code. L'effet secondaire 
de cela est que deux fonctions rarement utilisées ont été supprimées, car ils 
étaient problématique et entraînait des bugs même avec le code de base 
existant. Les premiers segments de chemin utilisant les expressions régulières 
ont été retirés. Vous ne pouvez plus créer des routes comme

::

    Router::connect('/([0-9]+)-p-(.*)/', array('controller' => 'products', 'action' => 'show'));

Ces routes compliquent la compilation des routes et rendent impossibles les 
routes inversées. Si vous avez besoin de routes comme cela, il est recommandé 
que vous utilisiez les paramètres de route avec des patrons de capture. Le 
support de la next mid-route greedy star a été retirée. Il a été précedemment 
possible d'utiliser une greedy star dans le milieu de la route.

::

    Router::connect(
        '/pages/*/:event',
        array('controller' => 'pages', 'action' => 'display'), 
        array('event' => '[a-z0-9_-]+')
    );

This is no longer supported as mid-route greedy stars behaved
erratically, and complicated route compiling. Outside of these two
edge-case features and the above changes the router behaves exactly
as it did in 1.2.

Aussi, les personnes utilisant la clé 'id' dans les URLs en forme de tableau 
remarqueront que Router::url() traite maintenant ceci en paramètre nommé. Si 
vous utilisiez précedemment cette approche pour passer le paramètre ID aux 
actions, vous aurez besoin de réécrire tous vos appels $html->link() et 
$this->redirect() pour refléter ce changement.

::

    // format ancien:
    $url = array('controller' => 'posts', 'action' => 'view', 'id' => $id);
    // utilisations des cases:
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

``Dispatcher`` n'est plus capable de définir un layout/viewPath de controller 
avec les paramètres de requête. Le Contrôle de ces propriétés devrait être 
géré par le Controller, pas le Dispatcher. Cette fonctionnalité n'était aussi 
pas documenté, et pas testé.

**Debugger**


-  ``Debugger::checkSessionKey()`` a été renommé au profit de 
   ``Debugger::checkSecurityKeys()``
-  Calling ``Debugger::output("text")`` ne fonctionne plus. Utilisez 
   ``Debugger::output("txt")``.

**Object**


-  ``Object::$_log`` a été retiré. ``CakeLog::write`` est maintenant appelé 
   statiquement. Regardez :doc:`/core-libraries/logging`
   pour plus d'informations sur les changements faits pour se connecter.

**Sanitize**


-  ``Sanitize::html()`` retourne en général toujours des chaînes de caractère 
   echappées. Dans le passé, utiliser le paramètre ``$remove`` would skip
   entity encoding, en retournant possiblement le contenu dangereux.
-  ``Sanitize::clean()`` a maintenant une option ``remove_html``. Cela 
   déclenchera la fonctionnalité ``strip_tags`` de ``Sanitize::html()``,
   et doit être utilisé en conjonction avec le paramètre ``encode``.

**Configure and App**


-  Configure::listObjects() remplacé par App::objects()
-  Configure::corePaths() remplacé par App::core()
-  Configure::buildPaths() remplacé par App::build()
-  Configure ne gère plus les chemins.
-  Configure::write('modelPaths', array...) remplacé par
   App::build(array('models' => array...))
-  Configure::read('modelPaths') remplacé par App::path('models')
-  Il n'y a plus de debug = 3. Le controller dumps generated
   by this setting often caused memory consumption issues making it an
   impractical and unusable setting. The ``$cakeDebug`` variable has
   also been removed from ``View::renderLayout`` You should remove
   this variable reference to avoid errors.
-  ``Configure::load()`` can now load configuration files from
   plugins. Use ``Configure::load('plugin.file');`` to load
   configuration files from plugins. Any configuration files in your
   application that use ``.`` in the name should be updated to use
   ``_``

**Cache**

In addition to being able to load CacheEngines from app/libs or
plugins, Cache underwent some refactoring for CakePHP1.3. These
refactorings focused around reducing the number and frequency of
method calls. The end result was a significant performance
improvement with only a few minor API changes which are detailed
below.

The changes in Cache removed the singletons used for each Engine
type, and instead an engine instance is made for each unique key
created with ``Cache::config()``. Since engines are not singletons
anymore, ``Cache::engine()`` was not needed and was removed. In
addition ``Cache::isInitialized()`` now checks cache
*configuration names*, not cache *engine names*. You can still use
``Cache::set()`` or ``Cache::engine()`` to modify cache
configurations. Also checkout the
:doc:`/appendices/new-features-in-cakephp-1-3` for
more information on the additional methods added to ``Cache``.

It should be noted that using an app/libs or plugin cache engine
for the default cache config can cause performance issues as the
import that loads these classes will always be uncached. It is
recommended that you either use one of the core cache engines for
your ``default`` configuration, or manually include the cache
engine class before configuring it. Furthermore any non-core cache
engine configurations should be done in
``app/config/bootstrap.php`` for the same reasons detailed above.

Model Databases and Datasources
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Model**


-  ``Model::del()`` and ``Model::remove()`` have been removed in
   favor of ``Model::delete()``, which is now the canonical delete
   method.
-  ``Model::findAll``, findCount, findNeighbours, removed.
-  Dynamic calling of setTablePrefix() has been removed.
   tableprefix should be with the ``$tablePrefix`` property, and any
   other custom construction behavior should be done in an overridden
   ``Model::__construct()``.
-  ``DboSource::query()`` now throws warnings for un-handled model
   methods, instead of trying to run them as queries. This means,
   people starting transactions improperly via the
   ``$this->Model->begin()`` syntax will need to update their code so
   that it accesses the model's DataSource object directly.
-  Missing validation methods will now trigger errors in
   development mode.
-  Missing behaviors will now trigger a cakeError.
-  ``Model::find(first)`` will no longer use the id property for
   default conditions if no conditions are supplied and id is not
   empty. Instead no conditions will be used
-  For Model::saveAll() the default value for option 'validate' is
   now 'first' instead of true

**Datasources**


-  DataSource::exists() has been refactored to be more consistent
   with non-database backed datasources. Previously, if you set
   ``var $useTable = false; var $useDbConfig = 'custom';``, it was
   impossible for ``Model::exists()`` to return anything but false.
   This prevented custom datasources from using ``create()`` or
   ``update()`` correctly without some ugly hacks. If you have custom
   datasources that implement ``create()``, ``update()``, and
   ``read()`` (since ``Model::exists()`` will make a call to
   ``Model::find('count')``, which is passed to
   ``DataSource::read()``), make sure to re-run your unit tests on
   1.3.

**Databases**

Most database configurations no longer support the 'connect' key
(which has been deprecated since pre-1.2). Instead, set
``'persistent' => true`` or false to determine whether or not a
persistent database connection should be used

**SQL log dumping**

A commonly asked question is how can one disable or remove the SQL
log dump at the bottom of the page?. In previous versions the HTML
SQL log generation was buried inside DboSource. For 1.3 there is a
new core element called ``sql_dump``. ``DboSource`` no longer
automatically outputs SQL logs. If you want to output SQL logs in
1.3, do the following:

::

    <?php echo $this->element('sql_dump'); ?>

You can place this element anywhere in your layout or view. The
``sql_dump`` element will only generate output when
``Configure::read('debug')`` is equal to 2. You can of course
customize or override this element in your app by creating
``app/views/elements/sql_dump.ctp``.

View and Helpers
~~~~~~~~~~~~~~~~

**View**


-  ``View::renderElement`` removed. Use ``View::element()``
   instead.
-  Automagic support for ``.thtml`` view file extension has been
   removed either declare ``$this->ext = 'thtml';`` in your
   controllers, or rename your views to use ``.ctp``
-  ``View::set('title', $var)`` no longer sets
   ``$title_for_layout`` when rendering the layout.
   ``$title_for_layout`` is still populated by default. But if you
   want to customize it, use ``$this->set('title_for_layout', $var)``.
-  ``View::$pageTitle`` has been removed. Use
   ``$this->set('title_for_layout', $var);`` instead.
-  The ``$cakeDebug`` layout variable associated with debug = 3 has
   been removed. Remove it from your layouts as it will cause errors.
   Also see the notes related to SQL log dumping and Configure for
   more information.

All core helpers no longer use ``Helper::output()``. The method was
inconsistently used and caused output issues with many of
FormHelper's methods. If you previously overrode
``AppHelper::output()`` to force helpers to auto-echo you will need
to update your view files to manually echo helper output.

**TextHelper**


-  ``TextHelper::trim()`` is deprecated, used ``truncate()``
   instead.
-  ``TextHelper::highlight()`` no longer has:
-  an ``$highlighter`` parameter. Use ``$options['format']``
   instead.
-  an ``$considerHtml``parameter. Use ``$options['html']`` instead.
-  ``TextHelper::truncate()`` no longer has:
-  an ``$ending`` parameter. Use ``$options['ending']`` instead.
-  an ``$exact`` parameter. Use ``$options['exact']`` instead.
-  an ``$considerHtml``parameter. Use ``$options['html']``
   instead.

**PaginatorHelper**

PaginatorHelper has had a number of enhancements applied to make
styling easier.
``prev()``, ``next()``, ``first()`` and ``last()``

The disabled state of these methods now defaults to ``<span>`` tags
instead of ``<div>`` tags.

passedArgs are now auto merged with url options in paginator.

``sort()``, ``prev()``, ``next()`` now add additional class names
to the generated html. ``prev()`` adds a class of prev. ``next()``
adds a class of next. ``sort()`` will add the direction currently
being sorted, either asc or desc.

**FormHelper**


-  ``FormHelper::dateTime()`` no longer has a ``$showEmpty``
   parameter. Use ``$attributes['empty']`` instead.
-  ``FormHelper::year()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::month()`` no longer has a ``$showEmpty``
   parameter. Use ``$attributes['empty']`` instead.
-  ``FormHelper::day()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::minute()`` no longer has a ``$showEmpty``
   parameter. Use ``$attributes['empty']`` instead.
-  ``FormHelper::meridian()`` no longer has a ``$showEmpty``
   parameter. Use ``$attributes['empty']`` instead.
-  ``FormHelper::select()`` no longer has a ``$showEmpty``
   parameter. Use ``$attributes['empty']`` instead.
-  Default urls generated by form helper no longer contain 'id'
   parameter. This makes default urls more consistent with documented
   userland routes. Also enables reverse routing to work in a more
   intuitive fashion with default FormHelper urls.
-  ``FormHelper::submit()`` Can now create other types of inputs
   other than type=submit. Use the type option to control the type of
   input generated.
-  ``FormHelper::button()`` Now creates ``<button>`` elements
   instead of reset or clear inputs. If you want to generate those
   types of inputs use ``FormHelper::submit()`` with a
   ``'type' => 'reset'`` option for example.
-  ``FormHelper::secure()`` and ``FormHelper::create()`` no longer
   create hidden fieldset elements. Instead they create hidden div
   elements. This improves validation with HTML4.

Also be sure to check the :ref:`form-improvements-1-3` for additional changes and 
new features in the FormHelper.

**HtmlHelper**


-  ``HtmlHelper::meta()`` no longer has an ``$inline`` parameter.
   It has been merged with the ``$options`` array.
-  ``HtmlHelper::link()`` no longer has an ``$escapeTitle``
   parameter. Use ``$options['escape']`` instead.
-  ``HtmlHelper::para()`` no longer has an ``$escape`` parameter.
   Use ``$options['escape']`` instead.
-  ``HtmlHelper::div()`` no longer has an ``$escape`` parameter.
   Use ``$options['escape']`` instead.
-  ``HtmlHelper::tag()`` no longer has an ``$escape`` parameter.
   Use ``$options['escape']`` instead.
-  ``HtmlHelper::css()`` no longer has an ``$inline`` parameter.
   Use ``$options['inline']`` instead.

**SessionHelper**


-  ``flash()`` no longer auto echos. You must add an
   ``echo $session->flash();`` to your session->flash() calls. flash()
   was the only helper method that auto outputted, and was changed to
   create consistency in helper methods.

**CacheHelper**

CacheHelper's interactions with ``Controller::$cacheAction`` has
changed slightly. In the past if you used an array for
``$cacheAction`` you were required to use the routed url as the
keys, this caused caching to break whenever routes were changed.
You also could set different cache durations for different passed
argument values, but not different named parameters or query string
parameters. Both of these limitations/inconsistencies have been
removed. You now use the controller's action names as the keys for
``$cacheAction``. This makes configuring ``$cacheAction`` easier as
it's no longer coupled to the routing, and allows cacheAction to
work with all custom routing. If you need to have custom cache
durations for specific argument sets you will need to detect and
update cacheAction in your controller.

**TimeHelper**

TimeHelper has been refactored to make it more i18n friendly.
Internally almost all calls to date() have been replaced by
strftime(). The new method TimeHelper::i18nFormat() has been added
and will take localization data from a LC\_TIME locale definition
file in app/locale following the POSIX standard. These are the
changes made in the TimeHelper API:


-  TimeHelper::format() can now take a time string as first
   parameter and a format string as the second one, the format must be
   using the strftime() style. When called with this parameter order
   it will try to automatically convert the date format into the
   preferred one for the current locale. It will also take parameters
   as in 1.2.x version to be backwards compatible, but in this case
   format string must be compatible with date().
-  TimeHelper::i18nFormat() has been added

**Deprecated Helpers**

Both the JavascriptHelper and the AjaxHelper are deprecated, and
the JsHelper + HtmlHelper should be used in their place.

You should replace


-  ``$javascript->link()`` with ``$html->script()``
-  ``$javascript->codeBlock()`` with ``$html->scriptBlock()`` or
   ``$html->scriptStart()`` and ``$html->scriptEnd()`` depending on
   your usage.

Console and shells
~~~~~~~~~~~~~~~~~~

**Shell**

``Shell::getAdmin()`` has been moved up to
``ProjectTask::getAdmin()``

**Schema shell**


-  ``cake schema run create`` has been renamed to
   ``cake schema create``
-  ``cake schema run update`` has been renamed to
   ``cake schema update``

**Console Error Handling**

The shell dispatcher has been modified to exit with a ``1`` status
code if the method called on the shell explicitly returns
``false``. Returning anything else results in a ``0`` status code.
Before the value returned from the method was used directly as the
status code for exiting the shell.

Shell methods which are returning ``1`` to indicate an error should
be updated to return ``false`` instead.

``Shell::error()`` has been modified to exit with status code 1
after printing the error message which now uses a slightly
different formatting.

::

    $this->error('Invalid Foo', 'Please provide bar.');
    // outputs:
    Error: Invalid Foo
    Please provide bar.
    // exits with status code 1

``ShellDispatcher::stderr()`` has been modified to not prepend
Error: to the message anymore. It's signature is now similar to
``Shell::stdout()``.

**ShellDispatcher::shiftArgs()**

The method has been modified to return the shifted argument. Before
if no arguments were available the method was returning false, it
now returns null. Before if arguments were available the method was
returning true, it now returns the shifted argument instead.

Vendors, Test Suite & schema
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**vendors/css, vendors/js, and vendors/img**

Support for these three directories, both in ``app/vendors`` as
well as ``plugin/vendors`` has been removed. They have been
replaced with plugin and theme webroot directories.

**Test Suite and Unit Tests**

Group tests should now extend TestSuite instead of the deprecated
GroupTest class. If your Group tests do not run, you will need to
update the base class.

**Vendor, plugin and theme assets**

Vendor asset serving has been removed in 1.3 in favour of plugin
and theme webroot directories.

Schema files used with the SchemaShell have been moved to
``app/config/schema`` instead of ``app/config/sql`` Although
``config/sql`` will continue to work in 1.3, it will not in future
versions, it is recommend that the new path is used.


.. meta::
    :title lang=fr: Migrer de CakePHP 1.2 vers 1.3
    :keywords lang=fr: inflections,bootstrap,tests unitaires,constantes,cipher,php 5,remplacements,pear,tableau,variables,models,cakephp,plugins
