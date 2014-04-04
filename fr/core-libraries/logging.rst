Journalisation (logging)
########################

Bien que les réglages de la Classe Configure du cœur de CakePHP puissent
vraiment vous aider à voir ce qui se passe sous le capot, vous aurez besoin
certaines fois de consigner des données sur le disque pour découvrir ce qui
se produit. Dans un monde devenu plus dépendant des technologies comme SOAP et
AJAX, déboguer peut s'avérer difficile.

Le logging (journalisation) peut aussi être une façon de découvrir ce qui
s'est passé dans votre application à chaque instant. Quels termes de recherche
ont été utilisés ? Quelles sortes d'erreurs ont été vues par mes utilisateurs ?
A quelle fréquence est exécutée une requête particulière ?

La journalisation des données dans CakePHP est facile - la fonction log()
est un élément de la classe Object, qui est l'ancêtre commun de la plupart
des classes CakePHP. Si le contexte est une classe CakePHP (Model, Controller,
Component... n'importe quoi d'autre), vous pouvez loguer (journaliser) vos
données. Vous pouvez aussi utiliser ``CakeLog::write()`` directement.
voir :ref:`writing-to-logs`

.. _log-configuration:

Configuration des flux d'un log (journal)
=========================================

La configuration de ``Log`` doit être faite pendant la phase de bootstrap
de votre application. Le fichier ``App/Config/app.php`` est justement prévu pour
ceci. Vous pouvez définir autant de jounaux que votre application nécessite.
Les journaux doivent être configurés en utilisant :php:class:`Cake\\Core\\Log`.
Un exemple serait::

    use Cake\Log\Log;

    // Short classname
    Log::config('debug', [
        'className' => 'FileLog',
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // nom namespace complet.
    Log::config('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

Ce qui est au-dessus crée deux journaux. Un appelé ``debug``, l'autre appelé
``error``. Chacun est configuré pour gérer différents niveaux de message. Ils
stockent aussi leurs messages de journal dans des fichiers séparés, ainsi il
est facile de séparer les logs de debug/notice/info des erreurs plus sérieuses.
Regardez la section sur :ref:`logging-levels` pour plus d'informations sur les
différents niveaux et ce qu'ils signifient.

Une fois qu'une configuration est créée, vous ne pouvez pas la changer. A la
place, vous devez retirer la configuration et la re-créer en utilisant
:php:meth:`Cake\\Log\\Log::drop()` et
:php:meth:`Cake\\Log\\Log::config()`.

Créer des Adaptateurs de Log
----------------------------

Les gestionnaires de flux de log peuvent faire partie de votre application,
ou parti d'un plugin. Si par exemple vous avez un enregistreur de logs de
base de données appelé ``DatabaseLog``. Comme faisant parti de votre
application il devrait être placé dans
``App/Log/Engine/DatabaseLog.php``. Comme faisant partie d'un plugin
il devrait être placé dans
``App/Plugin/LoggingPack/Log/Engine/DatabaseLog.php``. Une fois
configuré ``CakeLog`` va tenter de charger la configuration des flux de logs
en appelant :php:meth:`Cake\\Log\\Log::config()`. La configuration de notre
``DatabaseLog`` pourrait ressembler à ceci::

    // pour App/Log
    Log::config('otherFile', [
        'className' => 'DatabaseLog',
        'model' => 'LogEntry',
        // ...
    ]);

    // pour un plugin appelé LoggingPack
    Log::config('otherFile', [
        'className' => 'LoggingPack.DatabaseLog',
        'model' => 'LogEntry',
        // ...
    ]);

Lorsque vous configurez le flux d'un log le paramètre de ``className`` est
utilisé pour localiser et charger le handler de log. Toutes les autres
propriétés de configuration sont passées au constructeur des flux de log comme
un tableau.::

    use Cake\Log\LogInterface;

    class DatabaseLog implements LogInterface {
        public function __construct($options = []) {
            // ...
        }

        public function write($level, $message, $scope = []) {
            // write to the database.
        }
    }

CakePHP a besoin que tous les adaptateurs de logging intégrent
:php:class:`Cake\\Log\\LogInterface`.

.. _file-log:

.. versionadded:: 2.4

Depuis 2.4 le moteur de ``FileLog`` a quelques nouvelles configurations:

* ``size`` Utilisé pour implémenter la rotation de fichier de journal basic.
  Si la taille d'un fichier de log atteint la taille spécifiée, le fichier
  existant est renommé en ajoutant le timestamp au nom du fichier et un
  nouveau fichier de log est crée. Peut être une valeur de bytes en entier
  ou des valeurs de chaînes lisible par l'humain comme '10MB', '100KB' etc.
  Par défaut à 10MB.
* ``rotate`` Les fichiers de log font une rotation à un temps spécifié
  avant d\'être retiré.
  Si la valeur est 0, les versions anciennes seront retirées plutôt que
  mises en rotation. Par défaut à 10.
* ``mask`` Définit les permissions du fichier pour les fichiers créés. Si
  laissé vide, les permissions par défaut sont utilisées.

.. warning::

    Avant 2.4 vous deviez inclure le suffixe ``Log`` dans votre configuration
    (``LoggingPack.DatabaseLog``). Ce n'est plus nécessaire maintenant.
    Si vous avez utilisé un moteur de Log comme ``DatabaseLogger`` qui ne suit
    pas la convention d'utiliser un suffixe ``Log`` pour votre nom de classe,
    vous devez ajuster votre nom de classe en ``DatabaseLog``. Vous devez
    aussi éviter les noms de classe comme ``SomeLogLog`` qui inclut le suffixe
    deux fois à la fin.

.. note::

    Toujours configurer les loggers dans ``App/Config/app.php``
    Essayer de configurer les loggers ou les loggers de plugin dans
    core.php provoquera des problèmes, les chemins d'applications
    n'étant pas encore configurés.

    Aussi nouveau dans 2.4: En mode debug, les répertoires manquants vont
    maintenant être automatiquement créés pour éviter le lancement des erreurs
    non nécessaires lors de l'utilisation de FileEngine.

Journalisation des Erreurs et des Exception
===========================================

Les erreurs et les exception peuvent elles aussi être journalisées. En
configurant les valeurs correspondantes dans votre fichier core.php.
Les erreurs seront affichées quand debug > 0 et loguées quand debug == 0.
Définir ``log`` à true  pour loguer les exceptions non capturées.
Voir :doc:`/development/configuration` pour plus d'information.

Interagir avec les flux de log
==============================

Vous pouvez interroger le flux configurés avec
:php:meth:`Cake\\Log\\Log::configured()`. Le retour de ``configured()`` est un
tableau de tous les flux actuellement configurés. Vous pouvez rejeter
des flux en utilisant :php:meth:`Cake\\Log\\Log::drop()`. Une fois que le flux
d'un log à été rejeté il ne recevra plus de messages.

Utilisation de l'adaptateur FileLog
===================================

Comme son nom l'indique FileLog écrit les messages log dans des fichiers. Le
type des messages de log en court d'écriture détermine le nom du fichier ou le
message sera stocker. Si le type n'est pas fourni, LOG\_ERROR est utilisé ce
qui à pour effet d'écrire dans le log error. Le chemin par défaut est
``app/tmp/logs/$type.log``::

    // Execute cela dans une classe CakePHP
    $this->log("Quelque chose ne fonctionne pas!");

    // Aboutit à ce que cela soit ajouté à  app/tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Quelque chose ne fonctionne pas!

Vous pouvez spécifier un nom personnalisé en utilisant le premier paramètre.
La classe Filelog intégrée par défaut traitera ce nom de log comme le fichier
dans lequel vous voulez écrire les logs::

    // appelé de manière statique
    CakeLog::write('activity', 'Un message spécial pour l'activité de logging');

    // Aboutit à ce que cela soit ajouté à app/tmp/logs/activity.log (au lieu de error.log)
    // 2007-11-02 10:22:02 Activity: Un message spécial pour l'activité de logging

Le répertoire configuré doit être accessible en écriture par le serveur web de
l'utilisateur pour que la journalisation fonctionne correctement.

Vous pouvez configurer/alterner la localisation de FileLog en utilisant
:php:meth:`CakeLog::config()`. FileLog accepte un ``chemin`` qui permet aux
chemins personnalisés d'être utilisés.::

    CakeLog::config('chemin_perso', array(
        'engine' => 'FileLog',
        'path' => '/chemin/vers/endroit/perso/'
    ));

.. _syslog-log:

Logging to Syslog
=================

.. versionadded:: 2.4

Dans les environnements de production, il est fortement recommandé que vous
configuriez votre système pour utiliser syslog plutôt que le logger de
fichiers. Cela va fonctionner bien mieux que ceux écrits et sera fait (presque)
d'une manière  non-blocking et le logger de votre système d'exploitation peut
être configuré séparément pour faire des rotations de fichier, pré-lancer
les écritures ou utiliser un stockage complètement différent pour vos logs.

Utiliser syslog est à peu près comme utiliser le moteur par défaut FileLog,
vous devez juste spécifier `Syslog` comme moteur à utiliser pour la
journalisation. Le bout de configuration suivant va remplacer le logger
par défaut avec syslog, ceci va être fait dans le fichier `bootstrap.php`::

    CakeLog::config('default', array(
        'engine' => 'Syslog'
    ));

Le tableau de configuration accepté pour le moteur de journalisation Syslog
comprend les clés suivantes:

* `format`: Un template de chaînes sprintf avec deux placeholders, le premier
  pour le type d\'erreur, et le second pour le message lui-même. Cette clé est
  utile pour ajouter des informations supplémentaires sur le serveur ou
  la procédure dans le message de log. Par exemple:
  ``%s - Web Server 1 - %s`` va ressembler à
  ``error - Web Server 1 - An error occurred in this request`` après avoir
  remplacé les placeholders.
* `prefix`: Une chaine qui va être préfixée à tous les messages de log.
* `flag`: Un drapeau entier utilisé pour l'ouverture de la connexion à
  logger, par défaut `LOG_ODELAY` sera utilisée. Regardez la documentation
  de `openlog` pour plus d'options.
* `facility`: Le slot de journalisation à utiliser dans syslog. Par défaut
  `LOG_USER` est utilisé. Regardez la documentation de `syslog` pour plus
  d'options.

.. _writing-to-logs:

Ecrire dans les logs
====================

Ecrire dans les fichiers peut être réalisé de deux façons. La première est
d'utiliser la méthode statique :php:meth:`Cake\\Log\\Log::write()`::

    CakeLog::write('debug', 'Quelque chose qui ne fonctionne pas');

La seconde est d'utiliser la fonction raccourcie log() disponible dans chacune
des classes qui étend ``Object``. En appelant log() cela appellera en
interne ``Log::write()``::

    // Exécuter cela dans une classe CakePHP:
    $this->log("Quelque chose qui ne fonctionne pas!", 'debug');

Tous les flux de log configurés sont écrits séquentiellement à chaque fois
que :php:meth:`Cake\\Log\\Log::write()` est appelée. Vous n'avez pas besoin de
configurer un flux pour utiliser la journalisation. Si vous n'avez pas
configuré d'adaptateurs de log, ``log()`` va retourner false et aucun
message de log ne sera écrit.

.. _logging-levels:

Utiliser les Niveaux
--------------------

CakePHP prend en charge les niveaux de log standards définis par POSIX. Chaque
niveau représente un niveau plus fort de sévérité:

* Emergency: system is inutilisable
* Alert: l'action doit être prise immédiatement
* Critical: Conditions critiques
* Error: conditions d'erreurs
* Warning: conditions d'avertissements
* Notice: condition normale mais importante
* Info: messages d'information
* Debug: messages de niveau-debug

Vous pouvez vous référer à ces niveaux par nom en configurant les journaux, et
lors de l'écriture des messages de log. Sinon vous pouvez utiliser
des méthodes pratiques comme :php:meth:`Cake\\Log\\Log::error()` pour
indiquer clairement et facilement le niveau de journalisation. Utiliser un
niveau qui n'est pas dans les niveaux ci-dessus va entraîner une exception.

.. _logging-scopes:

Scopes de journalisation
========================

Souvent, vous voudrez configurer différents comportements de journalisation
pour différents sous-systèmes ou parties de votre application. Prenez l'exemple
d'un magasin e-commerce. Vous voudrez probablement gérer la journalisation
pour les commandes et les paiements différemment des autres opérations de
journalisation moins critiques.

CakePHP expose ce concept dans les scopes de journalisation. Quand les messages
d'erreur sont écrits, vous pouvez inclure un nom scope. Si il y a un logger
configuré pour ce scope, les messages de log seront dirigés vers ces loggers.
Si un message de log est écrit vers un scope inconnu, les loggers qui gèrent
ce niveau de message va journaliser le message. Par exemple::

    // configurez tmp/logs/shops.log pour recevoir tous les types (niveaux de log), mais seulement
    // ceux avec les scope `orders` et `payments`
    Log::config('shops', [
        'className' => 'FileLog',
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // configurez tmp/logs/payments.log pour recevoir tous les types, mais seulement
    // ceux qui ont un scope `payments`
    Log::config('payments', [
        'className' => 'FileLog',
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops stream', 'orders');
    Log::warning('this gets written to both shops and payments streams', 'payments');
    Log::warning('this gets written to both shops and payments streams', 'unknown');

Depuis 3.0 le scope de logging passé à :php:meth:`Cake\\Log\\Log::write()` est
transferé à la méthode ``write()`` du moteur de log pour fournir un meilleur
contexte aux moteurs.

l'API de CakeLog
================

.. php:namespace:: Cake\Log

.. php:class:: Log

    Une simple classe pour écrire dans les logs (journaux).

.. php:staticmethod:: config($name, $config)

    :param string $name: Nom du journal en cours de connexion, utilisé
        pour rejeter un journal plus tard.
    :param array $config: Tableau de configuration de l'information et
        des arguments du constructeur pour le journal.

    Récupère ou définit la configuration pour un Journal. Regardez
    :ref:`log-configuration` pour plus d'informations.

.. php:staticmethod:: configured()

    :returns: Un tableau des journaux configurés.

    Obtient les noms des journaux configurés.

.. php:staticmethod:: drop($name)

    :param string $name: Nom du journal pour lequel vous ne voulez plus
        recevoir de messages.

.. php:staticmethod:: write($level, $message, $scope = array())

    Écrit un message dans tous les journaux configurés.
    ``$level`` indique le niveau de message log étant créé.
    ``$message`` est le message de l'entrée de log qui est en train d'être
    écrite.
    ``$scope`` est le scope(s) dans lequel un message de log est créé.

.. php:staticmethod:: levels()

Appelle cette méthode sans arguments, ex: `Log::levels()` pour
obtenir le niveau de configuration actuel.

.. php:staticmethod:: engine($name, $engine = null)

    Récupère un journal connecté par un nom de configuration.

    .. versionadded: 3.0

Méthodes pratiques
------------------

Les méthodes pratiques suivantes ont été ajoutées au log ``$message`` avec le
niveau de log approprié.

.. php:staticmethod:: emergency($message, $scope = array())
.. php:staticmethod:: alert($message, $scope = array())
.. php:staticmethod:: critical($message, $scope = array())
.. php:staticmethod:: error($message, $scope = array())
.. php:staticmethod:: warning($message, $scope = array())
.. php:staticmethod:: notice($message, $scope = array())
.. php:staticmethod:: debug($message, $scope = array())
.. php:staticmethod:: info($message, $scope = array())

Log Adapter Interface
=====================

.. php:interface:: LogInterface

    Cette interface est nécessaire pour les adaptateurs de logging. Lors de la
    création d'un nouvel adaptateur de logging, vous aurez besoin d'intégrer
    cette interface.

.. php:method:: write($level, $message, $scope = [])

    Ecrit un message vers le système de stockage de log. ``$level`` va être
    le niveau du message de log. ``$message`` va être le contenu du message de
    log. ``$scope`` est le scope(s) dans lequel un message de log est créé.

Logging Trait
=============

.. php:trait:: LogTrait

    Un trait qui fournit les méthodes raccourcis pour le logging

    .. versionadded:: 3.0

.. php:method:: log($msg, $level = LOG_ERR)

    Log un message dans les logs. Par défaut, les messages sont loggés en
    messages ERROR. Si ``$msg`` n'est pas une chaîne, elle sera convertie avec
    ``print_r`` avant d'être loggé.


.. meta::
    :title lang=fr: Journalisation (Logging)
    :description lang=fr: Journal Log de CakePHP de données du disque pour vous aider à debugger votre application sur des longues périodes de temps.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
