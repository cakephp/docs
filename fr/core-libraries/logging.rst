Journalisation (logging)
########################

Bien que les réglages de la Classe Configure du cœur de CakePHP puissent
vraiment vous aider à voir ce qui se passe sous le capot, vous aurez besoin
certaines fois de consigner des données sur le disque pour découvrir ce qui
se produit. Avec des technologies comme SOAP, AJAX, et les APIs REST, déboguer
peut s'avérer difficile.

Le logging (journalisation) peut aussi être une façon de découvrir ce qui
s'est passé dans votre application à chaque instant. Quels termes de recherche
ont été utilisés ? Quelles sortes d'erreurs ont été vues par mes utilisateurs ?
A quelle fréquence est exécutée une requête particulière ?

La journalisation des données dans CakePHP est facile - la fonction log()
est fourni par ``LogTrait``, qui est l'ancêtre commun de beaucoup de classes
CakePHP. Si le contexte est une classe CakePHP (Controller, Component, View...),
vous pouvez loguer (journaliser) vos données. Vous pouvez aussi utiliser
``Log::write()`` directement. Consultez :ref:`writing-to-logs`.

.. _log-configuration:

Configuration des flux d'un log (journal)
=========================================

La configuration de ``Log`` doit être faite pendant la phase de bootstrap
de votre application. Le fichier **config/app.php** est justement prévu pour
ceci. Vous pouvez définir autant de jounaux que votre application nécessite.
Les journaux doivent être configurés en utilisant :php:class:`Cake\\Core\\Log`.
Un exemple serait::

    use Cake\Log\Log;

    // Nom de classe court
    Log::config('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // Nom avec le namespace complet.
    Log::config('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
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

Il est aussi possible de créer des loggers en fournissant une closure. C'est
utile quand vous devez avoir un contrôle complet sur la façon dont l'objet est
construit. La closure doit retourner l'instance de logger construite. Par
exemple::

    Log::config('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

Les options de configuration peuvent également être fournies en tant que chaine
:term:`DSN`. C'est utile lorsque vous travaillez avec des variables
d'environnement ou des fournisseurs :term:`PaaS`::

    Log::config('error', [
        'url' => 'file:///?levels[]=warning&levels[]=error&file=error',
    ]);

.. note::

    Les loggers sont nécessaires pour intégrer l'interface
    ``Psr\Log\LoggerInterface``.

Créer des Adaptateurs de Log
----------------------------

Les gestionnaires de flux de log peuvent faire partie de votre application,
ou parti d'un plugin. Si par exemple vous avez un enregistreur de logs de
base de données appelé ``DatabaseLog``. Comme faisant partie de votre
application il devrait être placé dans
**src/Log/Engine/DatabaseLog.php**. Comme faisant partie d'un plugin
il devrait être placé dans
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. Pour configurer des
flux de logs, vous devez utiliser :php:meth:`Cake\\Log\\Log::config()`. Par
example, la configuration de notre ``DatabaseLog`` pourrait ressembler à ceci::

    // Pour src/Log
    Log::config('otherFile', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // Pour un plugin appelé LoggingPack
    Log::config('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

Lorsque vous configurez le flux d'un log le paramètre de ``className`` est
utilisé pour localiser et charger le handler de log. Toutes les autres
propriétés de configuration sont passées au constructeur des flux de log comme
un tableau::

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct($options = [])
        {
            parent::__construct($options);
            // ...
        }

        public function log($level, $message, array $context = [])
        {
            // Write to the database.
        }
    }

CakePHP a besoin que tous les adaptateurs de logging intègrent
``Psr\Log\LoggerInterface``. La classe :php:class:`Cake\Log\Engine\BaseLog` est
un moyen facile de satisfaire l'interface puisqu'elle nécessite seulement
que vous intégriez la méthode ``log()``.

.. _file-log:

Le moteur de ``FileLog`` a quelques nouvelles configurations:

* ``size`` Utilisé pour implémenter la rotation de fichier de journal basic.
  Si la taille d'un fichier de log atteint la taille spécifiée, le fichier
  existant est renommé en ajoutant le timestamp au nom du fichier et un
  nouveau fichier de log est créé. Peut être une valeur de bytes en entier
  ou des valeurs de chaînes lisible par l'humain comme '10MB', '100KB' etc.
  Par défaut à 10MB.
* ``rotate`` Les fichiers de log font une rotation à un temps spécifié
  avant d'être retiré.
  Si la valeur est 0, les versions anciennes seront retirées plutôt que
  mises en rotation. Par défaut à 10.
* ``mask`` Définit les permissions du fichier pour les fichiers créés. Si
  laissé vide, les permissions par défaut sont utilisées.

.. warning::

    Les moteurs ont le suffixe ``Log``. Vous devrez éviter les noms de classe
    comme ``SomeLogLog`` qui inclut le suffixe deux fois à la fin.

.. note::

    Vous devrez configurer les loggers pendant le bootstrapping.
    **config/app.php** est l'endroit par convention pour configurer les
    adaptateurs de log.

    En mode debug, les répertoires manquants vont maintenant être
    automatiquement créés pour éviter le lancement des erreurs non nécessaires
    lors de l'utilisation de FileEngine.

Journalisation des Erreurs et des Exception
===========================================

Les erreurs et les exception peuvent elles aussi être journalisées. En
configurant les valeurs correspondantes dans votre fichier app.php.
Les erreurs seront affichées quand debug > 0 et loguées quand debug est à
`false`. Définir l'option ``log`` à ``true`` pour logger les exceptions non
capturées. Voir :doc:`/development/configuration` pour plus d'information.

Interagir avec les Flux de Log
==============================

Vous pouvez interroger le flux configurés avec
:php:meth:`Cake\\Log\\Log::configured()`. Le retour de ``configured()`` est un
tableau de tous les flux actuellement configurés. Vous pouvez rejeter
des flux en utilisant :php:meth:`Cake\\Log\\Log::drop()`. Une fois que le flux
d'un log à été rejeté il ne recevra plus de messages.

Utilisation de l'Adaptateur FileLog
===================================

Comme son nom l'indique FileLog écrit les messages log dans des fichiers. Le
type des messages de log en court d'écriture détermine le nom du fichier ou le
message sera stocker. Si le type n'est pas fourni, :php:const:`LOG_ERR` est
utilisé ce qui à pour effet d'écrire dans le log error. Le chemin par défaut est
``logs/$level.log``::

    // Execute cela dans une classe CakePHP
    $this->log("Quelque chose ne fonctionne pas!");

    // Aboutit à ce que cela soit ajouté à tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Quelque chose ne fonctionne pas!

Le répertoire configuré doit être accessible en écriture par le serveur web de
l'utilisateur pour que la journalisation fonctionne correctement.

Vous pouvez configurer/changer la localisation de FileLog lors de la
configuration du logger. FileLog accepte un ``path`` qui permet aux
chemins personnalisés d'être utilisés::

    Log::config('chemin_perso', [
        'className' => 'File',
        'path' => '/chemin/vers/endroit/perso/'
    ]);

.. warning::
    Si vous ne configurez pas d'adaptateur de logging, les logs ne seront pas
    stockés.

.. _syslog-log:

Logging vers Syslog
===================

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

    Log::config('default', [
        'engine' => 'Syslog'
    ]);

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
  de ``openlog`` pour plus d'options.
* `facility`: Le slot de journalisation à utiliser dans syslog. Par défaut
  ``LOG_USER`` est utilisé. Regardez la documentation de `syslog` pour plus
  d'options.

.. _writing-to-logs:

Ecrire dans les logs
====================

Ecrire dans les fichiers peut être réalisé de deux façons. La première est
d'utiliser la méthode statique :php:meth:`Cake\\Log\\Log::write()`::

    Log::write('debug', 'Quelque chose qui ne fonctionne pas');

La seconde est d'utiliser la fonction raccourcie log() disponible dans chacune
des classes qui utilisent ``LogTrait``. En appelant log() cela appellera en
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
lors de l'écriture des messages de log. Sinon vous pouvez utiliser des méthodes
pratiques comme :php:meth:`Cake\\Log\\Log::error()` pour indiquer clairement le
niveau de journalisation. Utiliser un niveau qui n'est pas dans les niveaux
ci-dessus va entraîner une exception.

.. note::
    Quand l'option ``levels`` est une valeur vide dans la configuration du logger,
    n'importe quel niveau de message sera capturé.

.. _logging-scopes:

Scopes de Journalisation
========================

Souvent, vous voudrez configurer différents comportements de journalisation
pour différents sous-systèmes ou parties de votre application. Prenez l'exemple
d'un magasin e-commerce. Vous voudrez probablement gérer la journalisation
pour les commandes et les paiements différemment des autres opérations de
journalisation moins critiques.

CakePHP expose ce concept dans les scopes de journalisation. Quand les messages
d'erreur sont écrits, vous pouvez inclure un nom scope. S'il y a un logger
configuré pour ce scope, les messages de log seront dirigés vers ces loggers.
Par exemple::

    // Configurez logs/shops.log pour recevoir tous les types (niveaux de log),
    // mais seulement ceux avec les scope `orders` et `payments`
    Log::config('shops', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // configurez logs/payments.log pour recevoir tous les types, mais seulement
    // ceux qui ont un scope `payments`
    Log::config('payments', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', ['scope' => ['orders']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['payments']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['unknown']]);

Les scopes peuvent aussi être passées en une chaine unique ou un tableau
numériquement indexé.
Notez que l'utilisation de ce formulaire va limiter la capacité de passer plus
de données en contexte::

    Log::warning('This is a warning', ['orders']);
    Log::warning('This is a warning', 'payments');

.. note::
    Quand l'option ``scopes`` est vide ou ``null`` dans la configuration d'un
    logger, les messages de tous les ``scopes`` seront capturés. Définir l'option
    à ``false`` captura seulement les messages sans scope.

l'API de Log
============

.. php:namespace:: Cake\Log

.. php:class:: Log

    Une simple classe pour écrire dans les logs (journaux).

.. php:staticmethod:: config($key, $config)

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

.. php:staticmethod:: write($level, $message, $scope = [])

    Écrit un message dans tous les journaux configurés.
    ``$level`` indique le niveau de message log étant créé.
    ``$message`` est le message de l'entrée de log qui est en train d'être
    écrite.
    ``$scope`` est le scope(s) dans lequel un message de log est créé.

.. php:staticmethod:: levels()

Appelle cette méthode sans arguments, ex: `Log::levels()` pour
obtenir le niveau de configuration actuel.

Méthodes pratiques
------------------

Les méthodes pratiques suivantes ont été ajoutées au journal ``$message`` avec
le niveau de log approprié.

.. php:staticmethod:: emergency($message, $scope = [])
.. php:staticmethod:: alert($message, $scope = [])
.. php:staticmethod:: critical($message, $scope = [])
.. php:staticmethod:: error($message, $scope = [])
.. php:staticmethod:: warning($message, $scope = [])
.. php:staticmethod:: notice($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])
.. php:staticmethod:: info($message, $scope = [])

Logging Trait
=============

.. php:trait:: LogTrait

    Un trait qui fournit des raccourcis pour les méthodes de journalisation

.. php:method:: log($msg, $level = LOG_ERR)

    Ecrit un message dans les logs. Par défaut, les messages sont écrits dans
    les messages ERROR. Si ``$msg`` n'est pas une chaîne, elle sera convertie
    avec ``print_r`` avant d'être écrite.

Utiliser Monolog
================

Monolog est un logger populaire pour PHP. Puisqu'il intègre les mêmes interfaces
que les loggers de CakePHP, il est facile de l'utiliser dans votre application
comme logger par défaut.

Après avoir installé Monolog en utilisant composer, configurez le logger en
utilisant la méthode ``Log::config()``::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('app');
        $log->pushHandler(new StreamHandler('path/to/your/combined.log'));
        return $log;
    });

    // Optionnellement, coupez les loggers par défaut devenus redondants
    Log::drop('debug');
    Log::drop('error');

Utilisez des méthodes similaires pour configurer un logger différent pour la console::

    // config/bootstrap_cli.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));
        return $log;
    });

    // Optionnellement, coupez les loggers par défaut devenus redondants
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

    Lorsque vous utilisez un logger spécifique pour la console, assurez-vous
    de configurer conditionnellement le logger de votre application. Cela
    évitera la duplication des entrées de log.

.. meta::
    :title lang=fr: Journalisation (Logging)
    :description lang=fr: Journal Log de CakePHP de données du disque pour vous aider à debugger votre application sur des longues périodes de temps.
    :keywords lang=fr: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
