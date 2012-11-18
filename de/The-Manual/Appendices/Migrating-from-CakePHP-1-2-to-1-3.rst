Migrating from CakePHP 1.2 to 1.3
#################################

Diese Anleitung fasst viele der Änderungen zusammen, die notwendig sind
um von einem 1.2- auf einen 1.3-Kern zu migrieren. Jeder Abschnitt
enthält sowohl wichtige Informationen über die Modifikationen die an
existierenden Methoden zu machen sind als auch alle Methoden, die
entfernt oder umbenannt worden.

**Zu ersetzende Anwendungsdateien (wichtig)**

-  webroot/index.php: Muss wegen Änderungen im Bootstrapping-Prozess
   ersetzt werden.
-  config/core.php: Es wurden zusätzliche, von PHP 5.3 benötigte,
   Einstellungen hinzugefügt.

Entfernte Konstanten
====================

Die folgenden Konstanten sind aus CakePHP entfernt worden. Falls deine
Anwendung davon abhängig ist, musst du sie in
``app/config/bootstrap.php`` definieren.

-  ``CIPHER_SEED`` - Wurde durch die Configure-Klassenvariable
   ``Security.cipherSeed``, welche in ``app/config/core.php`` geändert
   werden sollte, ersetzt.
-  ``PEAR``
-  ``INFLECTIONS``
-  ``VALID_NOT_EMPTY``
-  ``VALID_EMAIL``
-  ``VALID_NUMBER``
-  ``VALID_YEAR``

Konfiguration und Anwendungs-bootstrapping.
===========================================

**Zusätzliche Bootstrapping-Pfade.**

In der ``app/config/bootstrap.php`` hast du eventuell Variablen wie
``$pluginPaths`` oder ``$controllerPaths`` definiert. Es gibt eine neue
Methode diese Pfade zu ändern. Seit 1.3-rc1 funktioniert die
``$pluginPaths``-variable nicht mehr. Du musst ``App::build()`` benutzen
um die Pfade zu verändern:

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
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/')
    ));

Die Reihenfolge in der das Bootstrapping stattfindet hat sich ebenfalls
geändert. Früher wurde die ``app/config/core.php`` geladen **nachdem**
die ``app/config/bootstrap.php`` geladen wurde. Das führte dazu, dass
jegliche ``App::import()``-aufrufe im Anwendungsbootstrapping nicht
gecached wurden und dadurch bemerkenswert langsamer als ein gecachter
Import waren. In 1.3 wird die ``app/config/core.php`` geladen und die
Kern-Cache-Konfigurationen erstellt **bevor** die
``app/config/bootstrap.php`` geladen wird.

**Benutzerdefinierte Flexionen laden**

Die ``inflections.php`` wurde entfernt. Es war ein unnötiger
Dateizugriff und die entsprechenden Eigenschaften wurden in eine Methode
refaktorisiert um die Flexibilität zu erhöhen. Ab jetz benutzt man
``Inflector::rules()`` um benutzerdefinierte Flexionen zu bestimmen.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

Das Codebeispiel wird die gegebenen Regeln in die bestehenden Flexionen
integrieren wobei die benutzerdefinierten Flexionen die Kern-Flexionen
überschreiben.

Dateiumbenennungen und interne Veränderungen
============================================

**Umbenennung der Bibliotheken**

Kernbibliotheken wie
``libs/session.php, libs/socket.php, libs/model/schema.php`` und
``libs/model/behaviour.php`` wurden umbenannt um eine bessere
Darstellung zwischen Dateinamen und der darin enthaltenen Klassen zu
schaffen (und gleichzeitig ein paar Namensraumprobleme zu lösen):

-  session.php ⇒ cake\_session.php

   -  App::import('Core', 'Session') ⇒ App::import('Core',
      'CakeSession')

-  socket.php ⇒ cake\_socket.php

   -  App::import('Core', 'Socket') ⇒ App::import('Core', 'CakeSocket')

-  schema.php ⇒ cake\_schema.php

   -  App::import('Model', 'Schema') ⇒ App::import('Model',
      'CakeSchema')

-  behavior.php ⇒ model\_behavior.php

   -  App::import('Core', 'Behavior') ⇒ App::import('Core',
      'ModelBehavior')

In den meisten Fällen sollten diese Umbenennungen Userland-Code nicht
beeinflussen.

**Erbschaft von Objekt**

Die folgenden Klassen erben nun nicht mehr von ``Object``:

-  Router
-  Set
-  Inflector
-  Cache
-  CacheEngine

Falls bisher ``Object``-Methoden dieser Klassen verwendet wurden wird
man seinen Code nun anpassen müssen und diese Methoden nicht benutzen.

Controller & Components
=======================

**Controller**

-  ``Controller::set()`` ändert Variablennamen wie ``$var_name`` nicht
   mehr in ``$varName``. Variablen erscheinen im View genau so wie sie
   im Controller gesetzt worden sind.

-  ``Controller::set('title', $var)`` setzt nicht mehr
   ``$title_for_layout`` beim Rendern des Layouts. ``$title_for_layout``
   wird immernoch standardmäßig in die Symboltabelle eingetragen, aber
   wenn man sie verändern will muss man
   ``$this->set('title_for_layout', $var)`` verwenden.

-  ``Controller::$pageTitle`` wurde entfernt. Verwende stattdessen:
   ``$this->set('title_for_layout', $var);``.

-  *Controller* hat zwei neue Methoden ``startupProcess`` und
   ``shutdownProcess``. Diese Methoden sind dazu gedacht den Start und
   Beendeprozess des *Controllers* zu beeinflussen.

**Component**

-  ``Component::triggerCallback`` wurde hinzugefügt. Es ist eine
   allgemeine Möglichkeit in den Callback-Prozess einzugreifen. Es
   verdrängt ``Component::startup()``, ``Component::shutdown()`` und
   ``Component::beforeRender()`` als bevorzugte Methode um Callbacks
   auszulösen.

**CookieComponent**

-  ``del`` ist veraltet. Verwende: ``delete``

**RequestHandlerComponent**

-  ``getReferrer`` ist veraltet. Verwende: ``getReferer``

**SessionComponent**

-  ``del`` ist veraltet. Verwende: ``delete``

**SessionHelper & SessionComponent**

``SessionComponent::setFlash()``'s zweiter Parameter wurde bislang dazu
benutzt ein Layout zu bestimmen und die entsprechende Layout-Datei zu
rendern. Dies wurde dahin geändert, dass jetzt ein *Element* genutzt
wird. Falls du benutzerdefinierte Flash-Layouts in deinen Anwendungen
spezifiziert hast wirst du die folgenden Änderungen vornehmen müssen:

#. Verschiebe die benötigten Dateien nach ``app/views/elements``.
#. Nenne die $content\_for\_layout-Variable in $message um.
#. Stelle sicher, dass du ``echo $session->flash();`` in deinem Layout
   stehen hast.

Sowohl der ``SessionHelper`` als auch die ``SessionComponent`` werden
nicht mehr automatisch eingebunden, ohne, dass du danach fragst. Beide
verhalten sich nun wie jede andere Komponente/Helfer und müssen genauso
deklariert werden. Du solltest ``AppController::$components`` und
``AppController::$helpers`` aktualisieren, dass diese ``SessionHelper``
und ``SessionComponent`` einbinden um das bisherige Verhalten von
CakePHP wieder herzustellen.

::

    <code>var $components = array('Session', 'Auth', ...);
    var $helpers = array('Session', 'Html', 'Form' ...);</code>

Diese Änderung wurde gemacht um CakePHP transparenter zu machen bei der
Frage welche Klassen du - der Anwendungsentwickler - benutzen möchtest.
Früher gab es keine Möglichkeit zu verhindern, dass die Session-Klassen
geladen wurden ohne Kern-Dateien zu modifizieren, was etwas ist, was du
verhindern können solltest. Zusätzlich waren die Session-Klassen die
einzigen "magischen" Komponente und Helfer. Diese Änderung hilft dabei
das Verhalten über alle Klassen hinweg zu normalisieren und zu
vereinheitlichen.

Library Classes
===============

**CakeSession**

-  ``del`` ist veraltet. Verwende: ``delete``

**Folder**

-  ``mkdir`` ist veraltet. Verwende: ``create``
-  ``mv`` ist veraltet. Verwende: ``move``
-  ``ls`` ist veraltet. Verwende: ``read``
-  ``cp`` ist veraltet. Verwende: ``copy``
-  ``rm`` ist veraltet. Verwende: ``delete``

**Set**

-  ``isEqual`` ist veraltet. Verwende: == oder ===.

**String**

-  ``getInstance`` ist veraltet, rufe Stringmethoden statisch auf.

**Router**

``Routing.admin`` ist veraltet. Es führte zu einem inkonsistenten
Verhalten mit anderen Prefix-Routen weil es anders behandelt wurde.
Stattdessen sollte man ``Routing.prefixes`` verwenden. Prefix-Routen
brauchen in 1.3 keine zusätzlich deklarierten Routen. Alle Prefix-Routen
werden automatisch generiert. Für das updaten muss einfach nur die
``core.php`` geändert werden:

::

    //von:
    Configure::write('Routing.admin', 'admin');

    //zu:
    Configure::write('Routing.prefixes', array('admin'));

Weitere Informationen über das Benutzen von Prefix-Routen befinden sich
im *New Features Guide*. Eine kleine Änderung wurde auch an den
Route-Parametern gemacht. Diese sollten nun ausschließlich aus
alphanumerischen Zeichen, - und \_ oder einfach ``/[A-Za-z0-9\-_+]/``
bestehen.

::

    Router::connect('/:$%@#param/:action/*', array(...)); // FALSCH
    Router::connect('/:can/:anybody/:see/:m-3/*', array(...)); // OK

Für 1.3 wurde das Innenleben des Routers massiv refaktorisiert um sowohl
die Performance zu verbessern als auch das Code-Durcheinander zu
verringern. Der Nebeneffekt davon ist, dass zwei selten genutzte
Funktionen entfernt wurden, weil sie problematisch und buganfällig
waren, selbst mit der existierenden Code-Basis. Als erstes wurden
Pfad-Elemente mit regulären Ausdrücken entfernt. Man kann keine Routen
mehr definieren wie:

::

    Router::connect('/([0-9]+)-p-(.*)/', array('controller' => 'products', 'action' => 'show'));

Diese Routen haben die Routenkompilation erschwert und sind ausserdem
unmöglich zu reversieren. Falls derartige Routen benötigt werden sollte
man Parameter verwenden und mit regulären Ausdrücken versehen. Als
nächstes wurde der *greedy star* inmitten von Routen entfernt. In <=1.2
konnte man Routen definieren wie:

::

    Router::connect(
        '/pages/*/:event',
        array('controller' => 'pages', 'action' => 'display'), 
        array('event' => '[a-z0-9_-]+')
    );

Das wird nicht mehr unterstützt da sich *greedy stars* als
Routenelemente fehlerhaft verhalten und ebenfalls die Routenkompilation
erschweren. Ansonsten verhält sich der Router genau wie in 1.2.

**Dispatcher**

``Dispatcher`` ist nicht mehr dazu in der Lage das Layout/den viewPath
eines *Controllers* zu definieren. Die Kontrolle über diese
Eigenschaften, sollte dem *Controller* überlassen werden und nicht dem
``Dispatcher``. Diese Funktion war ausserdem undokumentiert und
ungetestet.

**Debugger**

-  ``Debugger::checkSessionKey()`` wurde umbenannt in
   ``Debugger::checkSecurityKeys()``
-  Calling ``Debugger::output("text")`` funktioniert nicht mehr.
   Verwende: ``Debugger::output("txt")``.

**Object**

-  ``Object::$_log`` wurde entfernt.
-  ``CakeLog::write`` wird nun statisch aufgerufen. Siehe `New Logging
   features </de/view/1194/Logging>`_ für mehr Informationen über
   Änderungen im *logging*.

**Sanitize**

-  ``Sanitize::html()`` gibt nun immer Escapte Strings zurück. In der
   Vergangenheit konnte man mit dem ``$remove``-Parameter das *Entity
   Encoding* überspringen und damit möglicherweise gefährlichen Inhalt
   zurückgeben.
-  ``Sanitize::clean()`` hat nun eine ``remove_html`` Option. Diese löst
   die ``strip_tags``-Funktion von ``Sanitize::html()``, aus und muss in
   Verbindung mit dem ``$encode``-Parameter benutzt werden.

**Configure und App**

-  Configure::listObjects() wurde ersetzt durch App::objects()
-  Configure::corePaths() wurde ersetzt durch App::core()
-  Configure::buildPaths() wurde ersetzt durch App::build()
-  Configure organisiert keine Pfade mehr.
-  Configure::write('modelPaths', array...) wurde ersetzt durch
   App::build(array('models' => array...))
-  Configure::read('modelPaths') wurde ersetzt durch App::path('models')
-  Es gibt kein debug = 3 mehr. Die *Controllerdumps* die damit
   generiert wurden haben sehr häufig Speicherverbrauchsprobleme
   verursacht und es damit zu einer unpraktischen Einstellung gemacht.
   Die ``$cakeDebug``-Variable wurde ebenfalls aus
   ``View::renderLayout`` entfernt. Eventuell vorhandene Referenzen zu
   dieser Variablen sollten entfernt werden um Fehler zu vermeiden.
-  ``Configure::load()`` Kann nun Konfigurationsdateien von Plugins
   laden. Benutze dazu ``Configure::load('plugin.file');``. Jegliche
   Konfigurationsdateien, die ``.`` im Dateinamen haben sollten,
   umbenannt werden und ``_`` anstattdessen verwenden.

**Cache**

Zusätzlich zur Möglichkeit CachEngines von ``app/libs`` oder plugins zu
laden wurde der Cache etwas refaktorisiert für CakePHP 1.3. Diese
Refaktorisierungen konzentrierten sich darauf die Anzahl und Häufigkeit
von Methodenaufrufen zu verringern. Das Resultat ist eine signifikante
Performancesteigerung mit nur wenig kleineren Änderungen der API, welche
unten näher aufgeführt sind.

Durch die Änderungen im Cache wurden die Singletons, die für jeden
Engine-Typen genutzt wurden entfernt und anstattdessen wird nun eine
Engine-Instanz für jeden *unique key*, der mit ``Cache::config()``
erstellt wurde gemacht. Da Engines nun keine einzelnen Einheiten mehr
sind wird ``Cache::engine()`` nicht mehr benötigt und wurde daher
entfernt. Zusätzlich überprüft ``Cache::isInitialized()`` nun cache
*configuration names*, und keine cache *engine names*. Man kann
immernoch ``Cache::set()`` oder ``Cache::engine()`` verwenden um die
Cache-Konfiguration zu verändern. Sieh dir auch den `New features
guide </de/view/1572/New-features-in-CakePHP-1-3>`_ an, um mehr
Informationen über die zusätzlichen Methoden von ``Cache`` zu erhalten.

Es sollte erwähnt werden, dass die Benutzung von ``app/libs`` oder
Plugin Cache-Engines als Standard-Cache-Engine Performanceprobleme mit
sich bringen kann da der Import der benötigten Klassen immer ungecacht
bleibt. Es wird empfohlen, dass man entweder eine Kern-Cache-Engine als
``default``-Konfiguration wählt oder die Klassen manuell lädt bevor sie
konfiguriert werden. Desweiteren sollten sämtliche
Nicht-Kern-Cache-Engine-Konfigurationen in ``app/config/bootstrap.php``
gemacht werden, aus den gleichen Gründen wie oben beschrieben.

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

-  ``View::renderElement`` wurde entfernt. Verwende stattdessen:
   ``View::element()``.
-  Automagische Unterstützung für ``.thtml`` View-Dateiendung wurde
   entfernt. Entweder kann man ``$this->ext = 'thtml';`` im *Controller*
   setzen oder die Viewdateien in ``*.ctp`` umbenennen.
-  ``View::set('title', $var)`` setzt nun nicht mehr
   ``$title_for_layout`` beim rendern des Layouts. ``$title_for_layout``
   wird immernoch in die Symboltabelle eingetragen. Wenn man es aber
   ändern will muss man das mit ``$this->set('title_for_layout', $var)``
   machen.
-  ``View::$pageTitle`` wurde entfernt. Stattdessen:
   ``$this->set('title_for_layout', $var);``.
-  Die ``$cakeDebug``-Layout-Variable, die mit ``debug = 3`` in
   Verbindung stand wurde entfernt. Man sollte es aus den Layouts
   entfernen, da es sonst Fehler produzieren wird. Siehe auch die
   Bemerkungen bezüglich den SQL-Log-Dumps und *Configure* für weitere
   Informationen.

Alle Kern-Helfer verwenden nun nicht mehr ``Helper::output()``. Die
Methode wurde inkonsistent benutzt und führte zu Ausgabeproblemen mit
vielen der *FormHelper*-Methoden. Falls ``AppHelper::output()``
überschrieben wurde um die Helfer dazu zu zwingen automatisch auszugeben
müssen die Viewdateien aktualisiert werden, sodass die Helferausgaben
manuell ausgegeben werden.

**TextHelper**

-  ``TextHelper::trim()`` ist veraltet, verwende stattdessen:
   ``truncate()``.
-  Aus ``TextHelper::highlight()`` wurden entfernt:

   -  Der ``$highlighter``-Parameter. Verwende stattdessen:
      ``$options['format']``.
   -  Der ``$considerHtml``-Parameter. Verwende stattdessen:
      ``$options['html']``.

-  Aus ``TextHelper::truncate()`` wurden entfernt:

   -  Der ``$ending``-Parameter. Verwende stattdessen:
      ``$options['ending']``.
   -  Der ``$exact``-Parameter. Verwende stattdessen:
      ``$options['exact']``.
   -  Der ``$considerHtml``-Parameter. Verwende stattdessen:
      ``$options['html']``.

**PaginatorHelper**

Der *PaginatorHelper* hat einiges an Verbesserungen erfahren um das
styling einfacher zu machen.

``prev()``, ``next()``, ``first()`` und ``last()``:

Der *disabled*-Status dieser Methoden gibt nun standardmäßig ``<span>``
anstatt ``<div>`` aus.

``passedArgs`` wird nun automatisch in die URL-Optionen des Paginators
eingefügt.

``sort()``, ``prev()`` und ``next()`` fügen nun zusätzliche Klassennamen
in das generierte HTML mit ein. ``prev()`` fügt eine Klasse *prev*,
``next()`` eine Klasse *next* und ``sort()`` eine Klasse - je nachdem
wie sortiert wird - *asc* oder *desc* ein.

**FormHelper**

-  ``FormHelper::dateTime()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::year()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::month()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::day()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::minute()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::meridian()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  ``FormHelper::select()`` hat keinen ``$showEmpty``-Parameter mehr.
   Verwende stattdessen: ``$attributes['empty']``
-  Standardurls, die vom Form-Helfer generiert werden enthalten keinen
   ``id``-Parameter mehr. Das erhöht die Konsistenz von Standardurls mit
   userland Routen. Ausserdem ermöglicht es *reverse routing* um
   intuitiver mit den Standardurls des Formhelpers arbeiten zu können.
-  ``FormHelper::submit()`` Kann nun andere ``<input>``-Typen erstellen
   als ``type=submit``. Dazu kann die ``type``-Option verwendet werden.
-  ``FormHelper::button()`` Erstellt nun ``<button>``-Elemente anstatt
   ``reset`` oder leere ``inputs``. Wenn solche ``<input>``-Typen
   erstellt werden sollen muss ``FormHelper::submit()`` mit zum Beispiel
   ``'type' => 'reset'`` verwendet werden.
-  ``FormHelper::secure()`` und ``FormHelper::create()`` erstellen keine
   versteckten ``<fieldset>``-Elemente mehr. Stattdessen versteckte
   ``<div>``-Elemente. Das verbessert die Validierung mit HTML 4.

Siehe unbedingt auch
`Form-Helfer-Verbesserungen </de/view/1616/x1-3-improvements>`_ für
weitere Änderungen und neue Funktionen im *FormHelper*.

**HtmlHelper**

-  ``HtmlHelper::meta()`` hat keinen ``$inline``-Parameter mehr. Dieser
   ist jetzt mit im ``$options``-Array.
-  ``HtmlHelper::link()`` hat keinen ``$escapeTitle``-Parameter mehr.
   Verwende statdessen: ``$options['escape']``
-  ``HtmlHelper::para()`` hat keinen ``$escape``-Parameter mehr.
   Verwende statdessen: ``$options['escape']``
-  ``HtmlHelper::div()`` hat keinen ``$escape``-Parameter mehr. Verwende
   statdessen: ``$options['escape']``
-  ``HtmlHelper::tag()`` hat keinen ``$escape``-Parameter mehr. Verwende
   statdessen: ``$options['escape']``
-  ``HtmlHelper::css()`` hat keinen ``$inline``-Parameter mehr. Verwende
   statdessen: ``$options['inline']``

**SessionHelper**

-  ``flash()`` gibt automatisch nichts mehr aus. Man muss ein
   ``echo $session->flash();`` zu den ``$session->flash()``-Aufrufen
   hinzufügen. ``flash()`` war die einzige Helfer-Methode, die
   automatisch etwas ausgegeben hat und wurde nun geändert um Konsistenz
   in den Helfer-Methoden zu schaffen.

**CacheHelper**

Die Interaktionen vom Cache-Helfer mit ``Controller::$cacheAction``
haben sich leicht verändert. Früher musste man wenn man einen Array für
``$cacheAction`` verwendete als Schlüssel eine Routenurl verwenden. Das
führte dazu, dass das Cachen dahin war, sobald sich die Routen geändert
haben. Man konnte ausserdem verschiedene Cache-Zeiten für verschiedene
Argumentwerte vergeben, aber keine verschiedenen *named parameters* oder
Parameter einer Query bestimmen. Beide Einschränkungen wurden entfernt.
Jetzt benutzt man die Namen der *Controller*-Aktionen als Schlüssel für
``$cacheAction``. Das macht die Konfiguration von ``$cacheAction``
einfacher, da es nicht mehr an das Routing gebunden ist und ermöglicht
es, dass ``$cacheAction`` mit jeglicher Routing-Konfiguration
funktioniert. Falls verschiedene Cache-Zeiten für bestimmte Argumente
benötigt werden, müssen diese im Controller gefiltert und
``$cacheAction`` entsprechend angepasst werden.

**TimeHelper**

Der Time-Helfer wurde refaktorisiert um ihn i18n-freundlicher zu machen.
Intern wurden fast alle Aufrufe von ``date()`` ersetzt durch
``strftime()``. Eine neue Methode ``TimeHelper::i18nFormat()`` wurde
hinzugefügt. Sie nimmt Lokalisierungsdaten von einer POSIX-kompatiblen
LC\_TIME-Datei aus ``app/locale``. An der API des Time-Helfers wurde
folgendes geändert:

-  TimeHelper::format() kann nun einen String als ersten Parameter und
   einen Formatierungsstring als zweiten nehmen. Das Format muss
   strftime()-stil sein. Wenn die Methode auf diese Weise aufgerufen
   wird wird sie versuchen das Datumsformat automatisch in das Format
   für die aktuelle *locale* zu konvertieren. Es können immernoch
   Parameter wie in 1.2 verwendet werden, aber dann muss das Format mit
   ``date()`` kompatibel sein.
-  TimeHelper::i18nFormat() wurde hinzugefügt.

**Veraltete Helfer**

Sowohl der JavaScript- als auch der Ajax-Helfer sind veraltet. Der
``JsHelper`` und der ``HtmlHelper`` sollten anstattdessen verwendet
werden.

Es sollten

-  ``$javascript->link()`` mit ``$html->script()``
-  ``$javascript->codeBlock()`` mit ``$html->scriptBlock()`` oder
   ``$html->scriptStart()`` und ``$html->scriptEnd()`` je nach Nutzung.

ersetzt werden.

Console and shells
==================

**Shell**

``Shell::getAdmin()`` wurde nach ``ProjectTask::getAdmin()`` verschoben.

**Schema shell**

-  ``cake schema run create`` wurde umbenannt in ``cake schema create``
-  ``cake schema run update`` wurde umbenannt in ``cake schema update``

**Console Error Handling**

Der *shell dispatcher* wurde dahin modifiziert, dass er mit Status ``1``
endet, falls die Methode in der Shell explizit ``false`` zurückgibt.
Alles andere gibt ``0`` als Status-Code zurück. Zuvor wurde der Wert,
der von der Methode zurückgegeben wurde direkt als Exit-Code der Shell
verwendet.

Shell-Methoden, die ``1`` zurückgeben um einen Fehler anzugeben, sollten
also bearbeitet werden und ``false`` zurückgeben.

``Shell::error()`` wurde bearbeitet und gibt nun Statuscode ``1`` zurück
nachdem die Fehlermeldung ausgegeben wurde, die jetzt ausserdem ein
etwas anderes Format hat.

::

    $this->error('Invalid Foo', 'Please provide bar.');
    // outputs:
    Error: Invalid Foo
    Please provide bar.
    // exits with status code 1

``ShellDispatcher::stderr()`` wurde bearbeitet um nicht mehr 'Error:'
vor die Nacricht zu setzen. Das Aussehen ist nun ähnlich zu
``Shell::stdout()``.

**ShellDispatcher::shiftArgs()**

Die Methode wurde verändert und gibt nun das rausgeschobene Argument
zurück. Zuvor wurde ``false`` zurückgegeben, falls keine Argumente
vorhanden waren, jetzt ``null``. Falls Argumente vorhanden waren, wurde
bisher ``true`` zurückgegeben, jetzt das rausgeschobene Argument.

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
