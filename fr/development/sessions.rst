Sessions
########

CakePHP fournit des fonctionnalités en plus et une suite d'utilitaires au-dessus
de l'extension native ``session`` de PHP. Les Sessions vous permettent
d'identifier les utilisateurs uniques pendant leurs requêtes et de stocker les
données persistantes pour les utilisateurs spécifiques. Au contraire des
Cookies, les données de session ne sont pas disponibles du coté client.
L'utilisation de ``$_SESSION`` est généralement à éviter dans CakePHP, et à
la place l'utilisation des classes de Session est préférable.

.. _session-configuration:

Session Configuration
=====================

La configuration de Session est stockée dans ``Configure`` dans la clé de top
niveau ``Session``, et un certain nombre d'options sont disponibles:

* ``Session.cookie`` - Change le nom du cookie de session.

* ``Session.timeout`` - Le nombre de *minutes* avant que le gestionnaire de
  session de CakePHP ne fasse expirer la session.
  Cela affecte ``Session.autoRegenerate`` (ci-dessous), et cela est geré par
  CakeSession.

* ``Session.cookieTimeout`` - Le nombre de *minutes* avant que le cookie de
  session n'expire. Si il n'est pas défini, il utilisera la même valeur que
  ``Session.timeout``. Cela affecte le cookie de session, et est geré
  directement par PHP.

* ``Session.defaults`` - Vous permet d'utiliser les configurations de session
  intégrées par défaut comme une base pour votre configuration de session.

* ``Session.handler`` - Vous permet de définir un gestionnaire de session
  personnalisé. La base de données du coeur et les gestionnaires de cache
  de session utilisent celui-ci. Cette option remplace ``Session.save``
  dans les versions précédentes. Regardez ci-dessous pour des informations
  supplémentaires sur les gestionnaires de Session.

* ``Session.ini`` - Vous permet de définir les configurations ini de session
  supplémentaire pour votre config. Ceci combiné avec ``Session.handler``
  remplace les fonctionnalités de gestionnaire de session personnalisé
  des versions précédentes.

CakePHP met par défaut la configuration de ``session.cookie_secure`` à true,
quand votre application est sur un protocole SSL. Si votre application sert
à partir des deux protocoles SSL et non-SSL, alors vous aurez peut-être
des problèmes avec les sessions étant perdues. Si vous avez besoin d'accéder
à la session sur les deux domaines SSL et non-SSL, vous aurez envie de
désactiver cela::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

Les chemins des cookies de Session sont par défaut ``/``. Pour changer
cela, vous pouvez utiliser le drapeau ini ``session.cookie_path`` vers le
chemin du répertoire de votre application::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/App/dir'
        ]
    ]);

Gestionnaires de Session intégrés & Configuration
=================================================

CakePHP est fourni avec plusieurs configurations de session intégrées. Vous
pouvez soit utiliser celles-ci comme base pour votre configuration de
session, soit vous pouvez créer une solution complètement personnalisée.
Pour utiliser les valeurs par défaut, définissez simplement la clé
'defaults' avec le nom par défaut, vous voulez utiliser. Vous pouvez
ensuite surcharger toute sous-configuration en la déclarant dans votre config
Session::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

Ce qui est au-dessus va utiliser la configuration de session intégrée dans
'php'. Vous pourriez augmenter tout ou partie de celle-ci en faisant
ce qui suit::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 // 3 days
    ]);

Ce qui est au-dessus surcharge le timeout et le nom du cookie pour la
configuration de session 'php'. Les configurations intégrées sont:

* ``php`` - Sauvegarde les sessions avec les configurations standard dans
  votre fichier php.ini.
* ``cake`` - Sauvegarde les sessions en tant que fichiers à l'intérieur de
  ``app/tmp/sessions``. Ceci est une bonne option quand les hôtes qui ne
  vous autorisent pas à écrire en dehors de votre propre dir home.
* ``database`` - Utiliser les sessions de base de données intégrées.
  Regardez ci-dessous pour plus d'informations.
* ``cache`` - Utiliser les sessions de cache intégrées. Regardez
  ci-dessous pour plus d'informations.

Gestionnaires de Session
------------------------

Les gestionnaires peuvent aussi être définis dans le tableau de config de
session. En définissant la clé de config 'handler.engine', vous pouvez nommer
le nom de la classe, ou fournir une instance de gestionnaire. La classe/objet
doit implémenter le ``SessionHandlerInterface`` natif de PHP. Implémenter
cette interface va permettre de faire le lien automatiquement de
``Session`` vers les méthodes du gestionnaire. Le Cache du coeur et les
gestionnaires de session de la Base de Données utilisent tous les deux cette
méthode pour sauvegarder les sessions. De plus, les configurations pour le
gestionnaire doivent être placées dans le tableau du gestionnaire. Vous
pouvez ensuite lire ces valeurs à partir de votre gestionnaire::

    'Session' => [
        'handler' => [
            'engine' => 'Database',
            'model' => 'CustomSessions'
        ]
    ]

Ce qui est au-dessus montre comment vous pouvez configurer le gestionnaire
de session de la Base de Données avec un model de l'application. Lors de
l'utilisation de noms de classe comme handler.engine, CakePHP va s'attendre
à trouver votre classe dans le namespace ``Network\\Session``. Par exemple,
si vous aviez une classe ``AppSessionHandler``, le fichier doit être
``App/Network/Session/AppSessionHandler.php``, et le nom de classe doit être
``App\\Network\\Session\\AppSessionHandler``. Vous pouvez aussi utiliser les
gestionnaires de session à partir des plugins. En configurant le moteur
avec ``MyPlugin.PluginSessionHandler``.

Les Sessions de la Base de Données
----------------------------------

Les changements dans la configuration de session changent la façon dont vous
définissez les sessions de base de données.
La plupart du temps, vous aurez seulement besoin de définir
``Session.handler.model`` dans votre configuration ainsi que
choisir la base de données par défaut::

    Configure::write('Session', [
        'defaults' => 'database',
        'handler' => [
            'model' => 'CustomSessions'
        ]
    ]);

Ce qui est au-dessus va dire à CakeSession d'utiliser le 'database' intégré
par défaut, et spécifier qu'un model appelé ``CustomSession`` sera celui
délégué pour la sauvegarde d'information de session dans la base de données.

Si vous n'avez pas besoin d'un gestionnaire de session complètement
personnalisable, mais que vous avez tout de même besoin de stockage de session
en base de donnée-backed, vous pouvez simplifier le code du dessus par
celui-ci::

    Configure::write('Session', [
        'defaults' => 'database'
    ]);

Cette configuration nécessitera qu'une table de base de données soit ajoutée
avec au moins ces champs::

    CREATE TABLE `sessions` (
      `id` varchar(255) NOT NULL DEFAULT '',
      `data` text,
      `expires` int(11) DEFAULT NULL,
      PRIMARY KEY (`id`)
    );

Vous pouvez trouver une copie du schéma pour la table de sessions dans le
squelette d'application.

Les Sessions de Cache
---------------------

La classe Cache peut aussi être utilisée pour stocker les sessions. Cela vous
permet de stocker les sessions dans un cache comme APC, memcache, ou Xcache.
Il y a some caveats dans l'utilisation des sessions en cache, puisque
si vous exhaust l'espace de cache, les sessions vont commencer à expirer
puisque les enregistrements sont évincés.

Pour utiliser les sessions basées sur le Cache, vous pouvez configurer votre
config Session comme ceci ::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session'
        ]
    ]);


Cela va configurer Session pour utiliser la classe ``CacheSession``
déléguée pour sauvegarder les sessions. Vous pouvez utiliser la clé 'config'
qui va mettre en cache la configuration à utiliser. La configuration par
défaut de la mise en cache est ``'default'``.

Configurer les directives ini
=============================

Celui intégré par défaut tente de fournir une base commune pour la
configuration de session. Vous aurez aussi besoin d'ajuster les flags ini
spécifiques. CakePHP donne la capacité de personnaliser les configurations
ini pour les deux configurations par défaut, ainsi que celles personnalisées.
La clé ``ini`` dans les configurations de session vous permet de spécifier les
valeurs de configuration individuelles. Par exemple vous pouvez l'utiliser
pour contrôler les configurations comme ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);


Créer un Gestionnaire de Session Personnalisé
=============================================

Créer un gestionnaire de session personnalisé est simple dans CakePHP. Dans cet
exemple, nous allons créer un gestionnaire de session qui stocke les sessions
à la fois dans le Cache (apc) et la base de données. Cela nous donne le
meilleur du IO rapide de apc, sans avoir à se soucier des sessions s'évaporant
quand le cache se remplit.

D'abord, nous aurons besoin de créer notre classe personnalisée et de la
mettre dans ``App/Network/Session/ComboSession.php``. La classe
devrait ressembler à::

    namespace App\Network\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Network\Session\DatabaseSession;

    class ComboSession extends DatabaseSession {
        public $cacheKey;

        public function __construct() {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // lire des données de session.
        public function read($id) {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // écrire des données dans session
        public function write($id, $data) {
            $result = Cache::write($id, $data, $this->cacheKey);
            if ($result) {
                return parent::write($id, $data);
            }
            return false;
        }

        // détruire une session.
        public function destroy($id) {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // retire des sessions expirées.
        public function gc($expires = null) {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Notre classe étend la classe intégrée ``DatabaseSession`` donc nous ne devons
pas dupliquer toute sa logique et son comportement. Nous entourons chaque
opération avec une opération :php:class:`Cache`. Cela nous laisse récupérer les
sessions de la mise en cache rapide, et nous évite de nous inquiéter sur ce qui
arrive quand nous remplissons le cache. Utiliser le gestionnaire de session est
aussi facile. Dans votre ``core.php`` imitez le block de session ressemblant
à ce qui suit::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        ]
    ],
    // Assurez-vous d'ajouter une config de cache apc
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Maintenant notre application va commencer en utilisant notre gestionnaire
de session personnalisé pour la lecture & l'écriture des données de session.

.. php:class:: Session

Accéder à l'Objet Session
=========================

Vous pouvez accéder aux données session à tous les endroits où vous avez accès
à l'objet request. Cela signifie que la session est facilement accessible via::

* Controllers
* Views
* Helpers
* Cells
* Components

En plus de l'objet basique session, vous pouvez aussi utiliser
:php:class:`Cake\\Controller\\Component\\SessionComponent` et
:php:class:`Cake\\View\\Helper\\SessionHelper` pour intéragir avec la session
dans les controllers et les views. Un exemple simple de l'utilisation de
session serait::

    $name = $this->request->session()->read('User.name');

    // Si vous accédez à la session plusieurs fois,
    // vous voudrez probablement une variable locale.
    $session = $this->request->session();
    $name = $session->read('User.name');

Lire & écrire les Données de Session
====================================

.. php:staticmethod:: read($key)

Vous pouvez lire les valeurs de session en utilisant la syntaxe
compatible :php:meth:`Hash::extract()`::

    CakeSession::read('Config.language');

.. php:staticmethod:: write($key, $value)

``$key`` devrait être le chemin séparé de point et ``$value`` sa valeur::

    CakeSession::write('Config.language', 'eng');

.. php:staticmethod:: delete($key)

Quand vous avez besoin de supprimer des données de la session, vous pouvez
utiliser delete::

    CakeSession::delete('Config.language');

.. php:method:: check($key)

Si vous souhaitez voir si des données existent dans la session, vous pouvez
utiliser ``check()``::

    if ($session->check('Config.language')) {
        // Config.language existe et n'est pas null.
    }

Détruire la Session
===================

.. php:method:: destroy()

Détruire la session est utile quand les utilisateurs de déconnectent. Pour
détruire une session, utilisez la méthode ``destroy()``::

    $session->destroy();

Détruire une session va retirer toutes les données sur le serveur dans la
session, mais **ne va pas** retirer le cookie de session.

Faire une Rotation des Identificateurs de Session
=================================================

.. php:method:: renew()

Alors que ``AuthComponent`` réactualise automatiquement l'id de session quand
les utilisateurs se connectent et se déconnectent, vous aurez peut-être besoin
de faire une rotation de l'id de session manuellement. Pour ce faire, utilisez
la méthode ``renew()``::

    $session->renew();

Messages Flash
==============

Les messages flash sont des messages courts à afficher aux utilisateurs une
seule fois. Ils sont souvent utilisés pour afficher des messages d'erreur ou
pour confirmer que les actions se font avec succès.

Pour définir et afficher les messages flash, vous devez utiliser
:doc:`/core-libraries/components/flash` et
:doc:`/core-libraries/helpers/flash`:doc:`/core-libraries/helpers/flash`


.. meta::
    :title lang=fr: Sessions
    :keywords lang=fr: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
