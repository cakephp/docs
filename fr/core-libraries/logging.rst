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

La journalisation des données dans CakePHP passe par la fonction log()
fournie par ``LogTrait``, qui est l'ancêtre commun de beaucoup de classes
CakePHP. Si le contexte est une classe CakePHP (Controller, Component, View...),
vous pouvez loguer (journaliser) vos données. Vous pouvez aussi utiliser
``Log::write()`` directement. Consultez :ref:`writing-to-logs`.

.. _log-configuration:

Configuration des flux d'un log (journal)
=========================================

La configuration de ``Log`` doit être faite pendant la phase de bootstrap
de votre application. Le fichier **config/app.php** est justement prévu pour
ceci. Vous pouvez définir autant de jounaux que votre application nécessite.
Les journaux doivent être configurés en utilisant :php:class:`Cake\\Log\\Log`.
Un exemple serait::

    use Cake\Log\Engine\FileLog;
    use Cake\Log\Log;

    // Nom de classe à partir de la constante 'class' du logger
    Log::setConfig('info', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => ['info'],
        'file' => 'info',
    ]);

    // Nom de classe court
    Log::setConfig('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // Nom avec le namespace complet.
    Log::setConfig('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

Le code ci-dessus crée deux journaux. Un appelé ``debug``, l'autre appelé
``error``. Chacun est configuré pour gérer différents niveaux de message. Ils
stockent aussi leurs messages de journal dans des fichiers séparés, ainsi il est
possible de séparer les logs de debug/notice/info des erreurs plus sérieuses.
Regardez la section sur :ref:`logging-levels` pour plus d'informations sur les
différents niveaux et ce qu'ils signifient.

Une fois qu'une configuration est créée, vous ne pouvez pas la changer. A la
place, vous devez retirer la configuration et la re-créer en utilisant
:php:meth:`Cake\\Log\\Log::drop()` et
:php:meth:`Cake\\Log\\Log::setConfig()`.

Il est aussi possible de créer des loggers en fournissant une closure. C'est
utile quand vous devez avoir un contrôle complet sur la façon dont l'objet est
construit. La closure doit retourner l'instance de logger construite. Par
exemple::

    Log::setConfig('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

Les options de configuration peuvent également être fournies en tant que chaine
:term:`DSN`. C'est utile lorsque vous travaillez avec des variables
d'environnement ou des fournisseurs :term:`PaaS`::

    Log::setConfig('error', [
        'url' => 'file:///full/path/to/logs/?levels[]=warning&levels[]=error&file=error',
    ]);

.. warning::

    Si vous ne configurez pas les moteurs de logs, les messages de log ne seront
    pas enregistrés.

Journalisation des Erreurs et des Exception
===========================================

Les erreurs et les exception peuvent elles aussi être journalisées. En
configurant les valeurs correspondantes dans votre fichier **config/app.php**.
Les erreurs seront affichées quand debug est à ``true`` et loguées quand debug
est à ``false``. Définissez l'option ``log`` à ``true`` pour loguer les
exceptions non capturées. Consultez :doc:`/development/configuration` pour plus
d'information.

.. _writing-to-logs:

Ecrire dans les logs
====================

Ecrire dans les fichiers peut être réalisé de deux façons. La première est
d'utiliser la méthode statique :php:meth:`Cake\\Log\\Log::write()`::

    Log::write('debug', 'Quelque chose ne fonctionne pas');

La seconde est d'utiliser la fonction raccourcie ``log()`` disponible dans chacune
des classes qui utilisent ``LogTrait``. En appelant ``log()`` cela appellera en
interne ``Log::write()``::

    // Exécuter cela dans une classe qui utilise LogTrait:
    $this->log("Quelque chose ne fonctionne pas!", 'debug');

Tous les flux de log configurés sont écrits séquentiellement à chaque fois
que :php:meth:`Cake\\Log\\Log::write()` est appelée. Si vous n'avez pas
configuré de moteurs de log, ``log()`` va retourner false et aucun
message de log ne sera écrit.

Utiliser des Placeholders dans les Messages
-------------------------------------------

Si vous avez besoin de loguer des données définies dynamiquement, vous pouvez
utiliser des placeholders dans vos messages de log et fournir un tableau de
paires clé/valeur dans le paramètre ``$context``::

    // Enverra le log `Traitement impossible pour userid=1`
    Log::write('error', 'Traitement impossible pour userid={user}', ['user' => $user->id]);

Les placeholders pour lesquels aucune clé n'a été définie ne seront pas
remplacés. Si vous avez besoin d'utiliser des mots entre accolades, vous devez
les échapper::

    // Enverra le log `Pas de {remplacement}`
    Log::write('error', 'Pas de \\{remplacement}', ['remplacement' => 'no']);

Si vous incluez des objets dans vos placeholders de logs, ces objets devront
implémenter une des méthodes suivantes:

* ``__toString()``
* ``toArray()``
* ``__debugInfo()``

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

    use Cake\Log\Engine\FileLog;

    // Configure logs/magasins.log pour recevoir tous les types (niveaux de log),
    // mais seulement ceux avec les scopes `commandes` et `paiements`
    Log::setConfig('magasins', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['commandes', 'paiements'],
        'file' => 'magasins.log',
    ]);

    // Configure logs/paiements.log pour recevoir tous les types, mais seulement
    // ceux qui ont un scope `paiements`
    Log::setConfig('paiements', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['paiements'],
        'file' => 'paiements.log',
    ]);

    Log::warning('ceci sera écrit seulement dans magasins.log', ['scope' => ['commandes']]);
    Log::warning('ceci sera écrit dans magasins.log et dans paiements.log', ['scope' => ['paiements']]);

Les scopes peuvent aussi être passées dans une chaîne de texte ou un tableau
indexé numériquement.
Notez que si vous utilisez cette forme, cela limitera la possibilité de passer
d'autres données de contexte::

    Log::warning('Ceci est un avertissement', ['commandes']);
    Log::warning('Ceci est un avertissement', 'paiements');

.. note::
    Quand l'option ``scopes`` est un tableau vide ou ``null`` dans la configuration d'un
    logger, les messages de tous les ``scopes`` seront capturés. Définir l'option
    à ``false`` captura seulement les messages sans scope.

.. _file-log:

Utilisation de l'Adaptateur FileLog
===================================

Comme son nom l'indique FileLog écrit les messages log dans des fichiers. Le
type des messages de log en cours d'écriture détermine le nom du fichier où le
message sera stocké. Si le type n'est pas fourni, :php:const:`LOG_ERR` est
utilisé ce qui a pour effet d'écrire dans le log error. Le chemin par défaut est
**logs/$level.log**::

    // Exécuter ceci dans une classe CakePHP
    $this->log("Quelque chose ne fonctionne pas!");

    // Aboutit à ce que cela soit ajouté à logs/error.log
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

Le moteur ``FileLog`` prend en charge les options suivantes:

* ``size`` Utilisé pour implémenter une rotation basique de fichiers. Si la
  taille du fichier de log atteint la taille spécifiée, le fichier existant est
  renommé en ajoutant à son nom un horodatage, et un nouveau fichier de log est
  créé. Cela peut être un nombre entier d'octets, ou des valeurs lisibles par
  l'homme telles que '10MB', '100KB' etc. Par défaut 10MB.
* ``rotate`` Les fichiers de log sont supprimés après un certain nombre de
  rotations, correspondant à la valeur spécifiée. Si la valeur est 0, les
  anciennes versions sont supprimées sans rotation. Par défaut 10.
* ``mask`` Définit les permissions pour les fichiers créés. S'il est vide, ce
  seront les permissions par défaut qui seront utilisées.

.. note::

    En mode debug, les répertoires inexistants seront créés automatiquement afin
    d'éviter l'apparition d'erreurs superflues lors de l'utilisation de
    FileEngine.

.. _syslog-log:

Logging vers Syslog
===================

Dans les environnements de production, il est fortement recommandé que vous
configuriez votre système pour utiliser syslog plutôt que le logger de
fichiers. Cela va fonctionner bien mieux parce que tout sera écrit de façon
(presque) non bloquante et le logger de votre système d'exploitation peut
être configuré séparément pour faire des rotations de fichier, pré-lancer
les écritures ou utiliser un stockage complètement différent pour vos logs.

Utiliser syslog est à peu près comme utiliser le moteur par défaut FileLog,
vous devez juste spécifier ``Syslog`` comme moteur à utiliser pour la
journalisation. Le bout de configuration suivant va remplacer le logger
par défaut avec syslog, ceci va être fait dans le fichier
**config/bootstrap.php**::

    Log::setConfig('default', [
        'engine' => 'Syslog'
    ]);

Le tableau de configuration accepté pour le moteur de journalisation Syslog
comprend les clés suivantes:

* `format`: Un template de chaînes sprintf avec deux placeholders, le premier
  pour le type d'erreur, et le second pour le message lui-même. Cette clé est
  utile pour ajouter des informations supplémentaires à propos du serveur ou du
  processus dans le message de log. Par exemple:
  ``%s - Web Server 1 - %s`` va ressembler à
  ``error - Web Server 1 - Une erreur s'est produite dans cette requête`` après
  avoir remplacé les placeholders. Cette option est dépréciée. Utilisez
  :ref:`logging-formatters` à la place.
* `prefix`: Une chaîne qui va préfixer tous les messages de log.
* `flag`: Un drapeau de type integer utilisé pour l'ouverture de la connexion au
  logger. La valeur par défaut est `LOG_ODELAY`. Regardez la documentation
  de ``openlog`` pour plus d'options.
* `facility`: Le slot de journalisation à utiliser dans syslog. Par défaut
  ``LOG_USER`` est utilisé. Regardez la documentation de ``syslog`` pour plus
  d'options.

Créer des Moteurs de Log
------------------------

Les moteurs de log peuvent faire partie de votre application, ou faire partie
d'un plugin. Supposons par exemple que vous ayez un enregistreur de logs sous
forme de bases de données appelé ``DatabaseLog``. S'il fait partie de votre
application il serait placé dans **src/Log/Engine/DatabaseLog.php**. S'il fait
partie d'un plugin il serait être placé dans
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. Pour configurer un
moteur de logs, vous devez utiliser :php:meth:`Cake\\Log\\Log::setConfig()`. Par
example, la configuration de notre DatabaseLog pourrait ressembler à ceci::

    // Pour src/Log
    Log::setConfig('autreFichier', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // Pour un plugin appelé LoggingPack
    Log::setConfig('autreFichier', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

Lorsque vous configurez un moteur de log le paramètre de ``className`` est
utilisé pour localiser et charger le handler de log. Toutes les autres
propriétés de configuration sont passées au constructeur du moteur de log sous
forme de tableau::

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

CakePHP a besoin que tous les moteurs de log implémentent
``Psr\Log\LoggerInterface``. La classe :php:class:`Cake\Log\Engine\BaseLog` est
un moyen simple de satisfaire l'interface puisqu'elle nécessite seulement
que vous implémentiez la méthode ``log()``.

.. _logging-formatters:

Formateurs de Logs
------------------

Les formateurs de logs vous permettent de contrôler la façon dont sont formatés
les messages de logs indépendamment du moteur de stockage. Chaque moteur de log
fourni avec le cœur de CakePHP est accompagné d'un formateur configuré pour
maintenir une compatibilité descendante. Cela étant, vous pouvez ajuster les
formateurs pour les faire coller à vos besoins. Les formateur sont configurés
en même temps que le moteur de log::

    use Cake\Log\Engine\SyslogLog;
    use App\Log\Formatter\CustomFormatter;

    // Configuration simple de formatage sans autre option.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => CustomFormatter::class,
    ]);

    // Configurer un formateur avec des options supplémentaires.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => [
            'className' => CustomFormatter::class,
            'key' => 'value',
        ],
    ]);

Pour implémenter votre propre formateur, vous aurez besoin d'étendre
``Cake\Log\Format\AbstractFormatter`` ou une de ses classes filles. La première
méthode que vous aurez besoin d'implémenter est
``format($level, $message, $context)``, qui est responsable du formatage des
messages de log.

l'API de Log
============

.. php:namespace:: Cake\Log

.. php:class:: Log

    Une simple classe pour écrire dans les logs (journaux).

.. php:staticmethod:: setConfig($key, $config)

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

Appelez cette méthode sans arguments, ex: `Log::levels()` pour
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
.. php:staticmethod:: info($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])

Logging Trait
=============

.. php:trait:: LogTrait

    Un trait qui fournit des raccourcis pour les méthodes de journalisation

.. php:method:: log($msg, $level = LOG_ERR)

    Ecrit un message dans les logs. Par défaut, les messages sont écrits dans
    les messages ERROR.

Utiliser Monolog
================

Monolog est un logger populaire pour PHP. Puisqu'il intègre les mêmes interfaces
que les loggers de CakePHP, vous pouvez l'utiliser dans votre application
comme logger par défaut.

Après avoir installé Monolog en utilisant composer, configurez le logger en
utilisant la méthode ``Log::setConfig()``::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
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

    Log::setConfig('default', function () {
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
