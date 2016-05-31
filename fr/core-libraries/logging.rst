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

Création et Configuration des flux d'un log (journal)
=====================================================

Les gestionnaires de flux de log peuvent faire partie de votre application,
ou partie d'un plugin. Si par exemple vous avez un enregistreur de logs de
base de données appelé ``DatabaseLog``. Comme faisant parti de votre
application il devrait être placé dans
``app/Lib/Log/Engine/DatabaseLog.php``. Comme faisant partie d'un plugin
il devrait être placé dans
``app/Plugin/LoggingPack/Lib/Log/Engine/DatabaseLog.php``. Une fois
configuré ``CakeLog`` va tenter de charger la configuration des flux de logs
en appelant``CakeLog::config()``. La configuration de notre ``DatabaseLog``
pourrait ressembler à ceci::

    // pour app/Lib
    CakeLog::config('otherFile', array(
        'engine' => 'Database',
        'model' => 'LogEntry',
        // ...
    ));

    // pour un plugin appelé LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ));

Lorsque vous configurez le flux d'un log le paramètre de ``engine`` est
utilisé pour localiser et charger le handler de log. Toutes les autres
propriétés de configuration sont passées au constructeur des flux de log comme
un tableau. ::

    App::uses('BaseLog', 'Log/Engine');

    class DatabaseLog extends BaseLog {
        public function __construct($options = array()) {
            parent::__construct($options);
            // ...
        }

        public function write($type, $message) {
            // écrire dans la base de données.
        }
    }

Alors que CakePHP n'a pas d'exigences pour les flux de Log sinon qu'il doit
implémenter une méthode ``write``, en étendant la classe ``BaseLog`` a
quelques bénéfices.

- Il gère automatiquement le scope et type argument casting.
- Il intègre la méthode ``config()`` qui est requise pour faire le travail du
  scope de logging.

Chaque méthode ``write`` doit prendre deux paramètres,
dans l'ordre ``$type, $message``.``$type`` est le type de chaîne du message
logué, les valeurs de noyau sont ``error``, ``warning``, ``info`` et ``debug``.
De plus vous pouvez définir vos propres types par leur utilisation en appelant
``CakeLog::write``.

.. _file-log:

.. versionadded:: 2.4

Depuis 2.4 le moteur de ``FileLog`` a quelques nouvelles configurations:

* ``size`` Utilisé pour implémenter la rotation de fichier de journal basic.
  Si la taille d'un fichier de log atteint la taille spécifiée, le fichier
  existant est renommé en ajoutant le timestamp au nom du fichier et un
  nouveau fichier de log est crée. Peut être une valeur de bytes en entier
  ou des valeurs de chaînes lisible par l'humain comme '10MB', '100KB' etc.
  Par défaut à 10MB. Définir size à false va désactiver l'option ``rotate``
  ci-dessous.
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

    Toujours configurer les loggers dans ``app/Config/bootstrap.php``
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
Définir ``Exception.log`` à true  pour loguer les exceptions non capturées.
Voir :doc:`/development/configuration` pour plus d'information.

Interagir avec les flux de log
==============================

Vous pouvez interroger le flux configurés avec
:php:meth:`CakeLog::configured()`. Le retour de ``configured()`` est un
tableau de tous les flux actuellement configurés. Vous pouvez rejeter
des flux en utilisant :php:meth:`CakeLog::drop()`. Une fois que le flux
d'un log à été rejeté il ne recevra plus de messages.

Utilisation de la classe par défaut FileLog
===========================================

Alors que Cakelog peut être configuré pour écrire à un certain nombre
d'adaptateurs de logging (journalisation) configurés par l'utilisateur, il
est également livré avec une configuration de logging par défaut qui sera
utilisée à chaque fois qu'il n'y a *pas d'autre* adaptateur de logging
configuré. Une fois qu'un adaptateur de logging a été configuré vous aurez
également à configurer Filelog si vous voulez que le logging de fichier continu.

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
    CakeLog::write('activity', 'Un message spécial pour l\'activité de logging');

    // Aboutit à ce que cela soit ajouté à app/tmp/logs/activity.log (au lieu de error.log)
    // 2007-11-02 10:22:02 Activity: Un message spécial pour l'activité de logging

Le répertoire configuré doit être accessible en écriture par le serveur web de
l'utilisateur pour que la journalisation fonctionne correctement.

Vous pouvez configurer/alterner la localisation de FileLog en utilisant
:php:meth:`CakeLog::config()`. FileLog accepte un ``chemin`` qui permet aux
chemins personnalisés d'être utilisés. ::

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
d'utiliser la méthode statique :php:meth:`CakeLog::write()`::

    CakeLog::write('debug', 'Quelque chose qui ne fonctionne pas');

La seconde est d'utiliser la fonction raccourcie log() disponible dans chacune
des classes qui étend ``Object``. En appelant log() cela appellera en
interne CakeLog::write()::

    // Exécuter cela dans une classe CakePHP:
    $this->log("Quelque chose qui ne fonctionne pas!", 'debug');

Tous les flux de log configurés sont écrits séquentiellement à chaque fois
que :php:meth:`CakeLog::write()` est appelée.

.. versionchanged:: 2.5

CakeLog ne s'auto-configure plus lui-même. En résultat, les fichiers de log,
ne seront plus auto-créés si aucun flux n'est écouté. Assurez-vous que vous
ayez au moins un flux ``default`` configuré si vous souhaitez écouter tous
les types et les niveaux. Habituellement, vous pouvez juste définir la classe
``FileLog`` du coeur pour le sortir dans ``app/tmp/logs/``::

    CakeLog::config('default', array(
        'engine' => 'File'
    ));

.. _logging-scopes:

Scopes de journalisation
========================

.. versionadded:: 2.2

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
    CakeLog::config('shops', array(
        'engine' => 'FileLog',
        'types' => array('warning', 'error'),
        'scopes' => array('orders', 'payments'),
        'file' => 'shops.log',
    ));

    // configurez tmp/logs/payments.log pour recevoir tous les types, mais seulement
    // ceux qui ont un scope `payments`
    CakeLog::config('payments', array(
        'engine' => 'SyslogLog',
        'types' => array('info', 'error', 'warning'),
        'scopes' => array('payments')
    ));

    CakeLog::warning('this gets written only to shops stream', 'orders');
    CakeLog::warning('this gets written to both shops and payments streams', 'payments');
    CakeLog::warning('this gets written to both shops and payments streams', 'unknown');

Pour que les scope fonctionnent correctement, vous **devrez** définir les
``types`` acceptés sur tous les loggers avec lesquels vous voulez utiliser les scopes.

l'API de CakeLog
================

.. php:class:: CakeLog

    Une simple classe pour écrire dans les logs (journaux).

.. php:staticmethod:: config($name, $config)

    :param string $name: Nom du logger en cours de connexion, utilisé
        pour rejeter un logger plus tard.
    :param array $config: Tableau de configuration de l'information et
        des arguments du constructeur pour le logger.

    Connecte un nouveau logger a CakeLog. Chacun des logger connecté
    reçoit tous les messages de log à chaque fois qu'un message de log est
    écrit.

.. php:staticmethod:: configured()

    :returns: Un tableau des loggers configurés.

    Obtient les noms des loggers configurés.

.. php:staticmethod:: drop($name)

    :param string $name: Nom du logger duquel vous ne voulez plus recevoir de messages.

.. php:staticmethod:: write($level, $message, $scope = array())

    Écrit un message dans tous les loggers configurés.
    $log indique le type de message créé.
    $message est le message de l'entrée de log en cours d'écriture.

    .. versionchanged:: 2.2 ``$scope`` a été ajouté.

.. versionadded:: 2.2 Log levels et scopes

.. php:staticmethod:: levels()

    Appelle cette méthode sans arguments, ex: ``CakeLog::levels()`` pour
    obtenir un niveau de configuration actuel.

    Pour ajouter les niveaux supplémentaires 'user0' et 'user1' aux niveaux de
    log par défaut, utilisez::

        CakeLog::levels(array('user0', 'user1'));
        // ou
        CakeLog::levels(array('user0', 'user1'), true);

    Calling ``CakeLog::levels()`` va entraîner::

        array(
            0 => 'emergency',
            1 => 'alert',
            // ...
            8 => 'user0',
            9 => 'user1',
        );

    Pour définir/remplcaer une configuration existante, passez un tableau avec le second
    argument défini à false::

        CakeLog::levels(array('user0', 'user1'), false);

    Calling ``CakeLog::levels()`` va entraîner::

        array(
            0 => 'user0',
            1 => 'user1',
        );

.. php:staticmethod:: defaultLevels()

    :returns: Un tableau des valeurs des niveaux de log par défaut.

    Efface les niveaux de lof à leurs valeurs originales::

        array(
            'emergency' => LOG_EMERG,
            'alert'     => LOG_ALERT,
            'critical'  => LOG_CRIT,
            'error'     => LOG_ERR,
            'warning'   => LOG_WARNING,
            'notice'    => LOG_NOTICE,
            'info'      => LOG_INFO,
            'debug'     => LOG_DEBUG,
        );

.. php:staticmethod:: enabled($streamName)

    :returns: boolean

    Vérifie si ``$streamName`` a été activé.

.. php:staticmethod:: enable($streamName)

    :returns: void

    Active le flux ``$streamName``.

.. php:staticmethod:: disable($streamName)

    :returns: void

    Disable the stream ``$streamName``.

.. php:staticmethod:: stream($streamName)

    :returns: Instance de ``BaseLog`` ou ``false`` si non retrouvée.

    Récupère ``$streamName`` à partir des flux actifs.

Méthodes pratiques
------------------

.. versionadded:: 2.2

Les méthodes pratiques suivantes ont été ajoutées au log ``$message`` avec le
niveau de log approprié.

.. php:staticmethod:: emergency($message, $scope = array())
.. php:staticmethod:: alert($message, $scope = array())
.. php:staticmethod:: critical($message, $scope = array())
.. php:staticmethod:: error($message, $scope = array())
.. php:staticmethod:: warning($message, $scope = array())
.. php:staticmethod:: notice($message, $scope = array())
.. php:staticmethod:: info($message, $scope = array())
.. php:staticmethod:: debug($message, $scope = array())

.. meta::
    :title lang=fr: Journalisation (Logging)
    :description lang=fr: Journal Log de CakePHP de données du disque pour vous aider à debugger votre application sur des longues périodes de temps.
    :keywords lang=fr: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
