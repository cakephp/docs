Journalisation (logging)
########################

Bien que les réglages de la Classe Configure du cœur de CakePHP puissent
vraiment vous aider à voir ce qui se passe en arrière plan, vous aurez
besoin certaines fois, de consigner des données sur le disque pour
découvrir ce qui se produit. Dans un monde devenu plus dépendant des
technologies comme SOAP et AJAX, déboguer peut s'avérer difficile.

La journalisation (*logging*) peut aussi être une façon de découvrir ce
qui s'est passé dans votre application à chaque instant. Quels termes de
recherche ont été utilisés ? Quelles sortes d'erreurs mes utilisateurs
ont-il vues ? A quelle fréquence est exécutée une requête particulière ?

La journalisation des données dans CakePHP est facile - la fonction
log() est un élément de la classe Object, qui est l'ancêtre commun de la
plupart des classes CakePHP. Si le contexte est une classe CakePHP
(Modèle, Contrôleur, Composant... n'importe quoi d'autre), vous pouvez
journaliser vos données. Vous pouvez aussi utiliser CakeLog::write()
directement.

Utiliser la fonction log
========================

La fonction log() prend deux paramètres. Le premier est le message que
vous aimeriez écrire dans le fichier de log. Par défaut, ce message
d'erreur est écrit dans le fichier de log "error", qui se trouve dans
app/tmp/logs/error.log.

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log("Quelque chose ne marche pas !");
     
    // Entraîne un ajout dans app/tmp/logs/error.log
     
    2007-11-02 10:22:02 Error: Quelque chose ne marche pas !

Le second paramètre est utilisé pour définir le type de fichier de log
dans lequel vous souhaitez écrire le message. S'il n'est pas précisé, le
type par défaut est LOG\_ERROR, qui écrit dans le fichier de log "error"
mentionné précédemment. Vous pouvez définir ce second paramètre à
LOG\_DEBUG pour écrire vos messages dans un fichier de log alternatif
situé dans app/tmp/logs/debug.log :

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log('Un message de débug', LOG_DEBUG);
     
    // Entraîne un ajout dans app/tmp/logs/debug.log (plutôt que dans error.log)
     
    2007-11-02 10:22:02 Error: un message de débug.

Vous pouvez aussi spécifier un nom différent pour le fichier de log, en
définissant le second paramètre avec le nom de ce fichier.

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log("Un message spécial pour la journalisation de l'activité", 'activite');
     
    // Entraîne un ajout dans app/tmp/logs/activite.log (plutôt que dans error.log)
     
    2007-11-02 10:22:02 Activite: Un message spécial pour la journalisation de l’activité

Votre dossier app/tmp doit être accessible en écriture par le serveur
web pour que la journalisation fonctionne correctement.

Using the default FileLog class
===============================

While CakeLog can be configured to write to a number of user configured
logging adapters, it also comes with a default logging configuration.
This configuration is identical to how CakeLog behaved in CakePHP 1.2.
The default logging configuration will be used any time there are *no
other* logging adapters configured. Once a logging adapter has been
configured you will need to also configure FileLog if you want file
logging to continue.

As its name implies FileLog writes log messages to files. The type of
log message being written determines the name of the file the message is
stored in. If a type is not supplied, LOG\_ERROR is used which writes to
the error log. The default log location is ``app/tmp/logs/$type.log``

::

    //Executing this inside a CakePHP class:
     $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Something didn't work!

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file you
wish to write logs to.

::

    //called statically
    CakeLog::write('activity', 'A special message for activity logging');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    2007-11-02 10:22:02 Activity: A special message for activity logging

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
``CakeLog::config()``. FileLog accepts a ``path`` which allows for
custom paths to be used.

::

    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ));

Creating and configuring log streams
====================================

Log stream handlers can be part of your application, or part of plugins.
If for example you had a database logger called ``DataBaseLogger`` as
part of your application it would be placed in
``app/libs/log/data_base_logger.php``; as part of a plugin it would be
placed in ``app/plugins/my_plugin/libs/log/data_base_logger.php``. When
configured, ``CakeLog`` will attempt to load. Configuring log streams is
done by calling ``CakeLog::config()``. Configuring our DataBaseLogger
would look like

::

    //for app/libs
    CakeLog::config('otherFile', array(
        'engine' => 'DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

    //for plugin called LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

When configuring a log stream the ``engine`` parameter is used to locate
and load the log handler. All of the other configuration properties are
passed to the log stream's constructor as an array.

::

    class DataBaseLogger {
        function __construct($options = array()) {
            //...
        }
    }

CakePHP has no requirements for Log streams other than that they must
implement a ``write`` method. This write method must take two parameters
``$type, $message`` in that order. ``$type`` is the string type of the
logged message, core values are ``error``, ``warning``, ``info`` and
``debug``. In addition you can define your own types by using them when
you call ``CakeLog::write``.

It should be noted that you will encounter errors when trying to
configure application level loggers from ``app/config/core.php``. This
is because paths are not yet bootstrapped. Configuring of loggers should
be done in ``app/config/bootstrap.php`` to ensure classes are properly
loaded.

Interacting with log streams
============================

You can introspect the configured streams with
``CakeLog::configured()``. The return of ``configured()`` is an array of
all the currently configured streams. You can remove streams using
``CakeLog::drop($key)``. Once a log stream has been dropped it will no
longer receive messages.

Error logging
=============

Errors are now logged when ``Configure::write('debug', 0);``. You can
use ``Configure::write('log', $val)``, to control which errors are
logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.
