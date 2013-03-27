Sessions
########

CakePHP fournit un wrapper and suite of utility features on top of PHP's native 
``session`` extension. Les Sessions vous permettent d'identifier les 
utilisateurs uniques pendant leurs requêtes et de stocker les données 
persistantes pour les utilisateurs spécifiques. Au contraire des Cookies, les 
données de session ne sont pas disponibles du coté client. L'utilisation de 
``$_SESSION`` est généralement à éviter dans CakePHP, et à la place 
l'utilisation des classes de Session est à préferer.

Session Configuration
=====================

La configuration de Session est stockée dans ``Configure``, et les classes de 
session la récupéreront de là quand c'est nécessaire. La configuration de 
Session est stockée dans la clé de top niveau ``Session``, et un certain nombre 
d'options sont disponibles:

* ``Session.cookie`` - Change le nom du cookie de session.

* ``Session.timeout`` - Le nombre de *minutes* avant que le gestionnaire de
  session de CakePHP ne fasse expirer la session.
  Cela affecte ``Session.autoRegenerate`` (ci-dessous), et cela est geré par
  CakeSession.

* ``Session.cookieTimeout`` - Le nombre de *minutes* avant que le cookie de
  session n'expire. Si il n'est pas défini, il utilisera la même valeur que
  ``Session.timeout``. Cela affecte le cookie de session, et est geré
  directement par PHP.

* ``Session.checkAgent`` - Le user agent doit il être verifié, sur chaque 
  requête. Si le useragent ne matche pas, la session sera détruite.

* ``Session.autoRegenerate`` - Activer cette configuration, turns on automatic
  renewal of sessions, and sessionids that change frequently. Activer cette 
  valeur va utiliser la valeur ``Config.countdown`` de la session pour garder 
  une trace des demandes. Une fois que le compte à rebours atteint 0, l'id de 
  session sera regénéré. C'est une bonne option à utiliser pour les 
  applications qui necéssitent de changer fréquemment les ids de session pour 
  des raisons de sécurité. Vous pouvez contrôler le nombre de requêtes 
  necéssaires pour regénérer la session en modifiant 
  :php:attr:`CakeSession::$requestCountdown`.

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

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_secure' => false
        )
    ));

Gestionnaires de Session intégrés & configuration
=================================================

CakePHP est fourni avec plusieurs configurations de session intégrées. Vous 
pouvez soit utiliser celles-ci comme base pour votre configuration de 
session, soit vous pouvez créer une solution complètement personnalisée. 
Pour utiliser les valeurs par défaut, définissez simplement la clé 
'defaults' avec le nom par défaut, vous devrez utiliser. Vous pouvez 
ensuite écraser toute sous-configuration en la déclarant dans votre config 
Session::

    Configure::write('Session', array(
        'defaults' => 'php'
    ));

Ce qui est au-dessus va utiliser la configuration de session intégrée dans 
'php'. Vous pourriez augmenter tout ou partie de celle-ci en faisant 
ce qui suit::

    Configure::write('Session', array(
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 //3 days
    ));

Ce qui est au-dessus écrase le timeout et le nom du cookie pour la 
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

Les gestionniaires de Session peuvent être aussi définis dans le tableau de 
config de session. Quand ils sont définis, ils vous permettent de mapper 
les valeurs divers ``session_save_handler`` vers une classe ou un objet 
que vous souhaitez utiliser pour sauvegarder la session. Il y a deux façons 
d'utiliser le 'handler'. La première est de fournir un tableau avec 5 
callables. Ces callables sont ensuite appliqués à ``session_set_save_handler``::

    Configure::write('Session', array(
        'userAgent' => false,
        'cookie' => 'my_cookie',
        'timeout' => 600,
        'handler' => array(
            array('Foo', 'open'),
            array('Foo', 'close'),
            array('Foo', 'read'),
            array('Foo', 'write'),
            array('Foo', 'destroy'),
            array('Foo', 'gc'),
        ),
        'ini' => array(
            'cookie_secure' => 1,
            'use_trans_sid' => 0
        )
    ));

Le deuxième mode est de définir une clé 'engine'. Cette clé devrait être un 
nom de classe qui implémente ``CakeSessionHandlerInterface``. Implémenter 
cette interface va autoriser CakeSession à mapper automatiquement les méthodes 
pour le gestionnaire. Les deux gestionnaires de Session du Cache du Coeur et 
de la base de données utilisent cette méthode pour sauvegarder les sessions.
Les configurations supplémentaires pour le gestionnaire doivent être placées 
à l'intérieur du tableau handler. Vous pouvez ensuite lire ces valeurs à 
partir de l'intérieur de votre handler.

Vous pouvez aussi utiliser les gestionnaires de session à partir des plugins. 
En configurant le moteur avec quelque chose comme 
``MyPlugin.PluginSessionHandler``. Cela ca charger et utiliser la classe 
``PluginSessionHandler`` à partir de l'intérieur du MyPlugin de votre
application.


CakeSessionHandlerInterface
---------------------------

Cette interface est utilisée pour tous les gestionnaires de session 
personnalisés à l'intérieur de CakePHP, et peut être utilisé pour créer 
des gestionnaires de session personnalisées user land. En implémentant 
simplement l'interface dans votre classe et en définissant 
``Session.handler.engine`` au nom de classe que vous avez crée. CakePHP 
va tenter de charger le gestionnaire à partir de l'intérieur de 
``app/Model/Datasource/Session/$classname.php``. Donc si votre nom de classe 
est ``AppSessionHandler``, le fichier devrait être 
``app/Model/Datasource/Session/AppSessionHandler.php``.

Les sessions de la Base de Données
----------------------------------

Les changements dans la configuration de session changent la façon dont vous  
définissez les sessions de base de données.
La plupart du temps, vous aurez seulement besoin de définir 
``Session.handler.model`` dans votre configuration ainsi que 
choisir la base de données par défaut::

    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'model' => 'CustomSession'
        )
    ));

Ce qui est au-dessus va dire à CakeSession d'utiliser le 'database' intégré 
par défaut, et spécifier qu'un model appelé ``CustomSession`` sera celui 
délégué pour la sauvegarde d'information de session dans la base de données. 

Les Sessions de Cache
---------------------

La classe Cache peut être utilisée pour aussi stocker les sessions. Cela vous 
permet de stocker les sessions dans un cache comme APC, memcache, ou Xcache. 
Il y a some caveats pour utiliser les sessions en cache, 
using cache sessions, in that if you exhaust the cache space, sessions will
start to expire as records are evicted.

Pour utiliser les sessions basées sur le Cache, vous pouvez configurer votre 
config Session comme ceci ::

    Configure::write('Session', array(
        'defaults' => 'cache',
        'handler' => array(
            'config' => 'session'
        )
    ));


Cela va configurer CakeSession pour utiliser la classe ``CacheSession`` 
déléguée pour sauvegarder les sessions. Vous pouvez utiliser la clé 'config' 
qui va mettre en cache la configuration à utiliser. La configuration par 
défaut de la mise en cache est ``'default'``.

Configurer les directives ini
=============================

Celui intégré par défaut tente de fournir une base commune poue la 
configuration de session. Vous aurez aussi besoin d'ajuster les flags ini 
spécifiques. CakePHP donne la capacité de personnaliser les configurations 
ini pour les deux configurations par défaut, ainsi que celles personnalisées.
La clé ``ini`` dans les configurations de session vous permet de spécifier les 
valeurs de configuration individuelles. Par exemple vous pouvez l'utiliser 
pour contrôler les configurations comme ``session.gc_divisor``::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        )
    ));


Créer un gestionnaire de session personnalisé
=============================================

Créer un gestionnaire de session personnalisé est simple dans CakePHP. Dans cet 
exemple, nous allons créer un gestionnaire de session qui stocke les sessions
à la fois dans le Cache (apc) et la base de données. Cela nous donne le 
meilleur du IO rapide de apc, sans avoir à se soucier des sessions s'évaporant 
quand le cache se remplit.

D'abord, nous aurons besoin de créer notre classe personnalisée et de la 
mettre dans ``app/Model/Datasource/Session/ComboSession.php``. La classe 
devrait ressembler à::

    App::uses('DatabaseSession', 'Model/Datasource/Session');

    class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface {
        public $cacheKey;

        public function __construct() {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // Lit les données à partir d'une session.
        public function read($id) {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // écrit les données dans la session.
        public function write($id, $data) {
            $result = Cache::write($id, $data, $this->cacheKey);
            if ($result) {
                return parent::write($id, $data);
            }
            return false;
        }

        // destroy a session.
        public function destroy($id) {
            $result = Cache::delete($id, $this->cacheKey);
            if ($result) {
                return parent::destroy($id);
            }
            return false;
        }

        // retire les sessions expirées.
        public function gc($expires = null) {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Notre classe étend la classe intégrée ``DatabaseSession`` donc nous ne devons pas 
dupliquer toute sa logique et son comportement. Nous entourons chaque opération 
avec une opération :php:class:`Cache`. Cela nous laisse récupèrer les sessions 
de la mise en cache rapide, et nous évite de nous inquiéter sur ce qui arrive 
quand nous remplissons le cache. Utilisez le gestionnaire de session est aussi 
facile. Dans votre ``core.php`` imitez le block de session ressemblant 
à ce qui suit::

    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        )
    ));

    // Assurez vous d'ajouter une config apc cache
    Cache::config('apc', array('Engine' => 'Apc'));

Maintenant notre application va commencer en utilisant notre gestionnaire 
de session personnalisé pour la lecture & l'écriture des données de session.

.. php:class:: CakeSession

Lire & écrire les données de session
====================================

Selon le contexte dans lequel vous êtes dans votre application, 
vous avez différentes classes qui fournissent un accès à la session. Dans 
les controllers, vous pouvez utiliser :php:class:`SessionComponent`. 
Dans la vue, vous pouvez utiliser :php:class:`SessionHelper`. Dans 
tout autre partie de votre application, vous pouvez utiliser
``CakeSession`` pour accéder aussi à la session. Comme les autres interfaces 
de session, ``CakeSession`` fournit une interface simple de CRUD.

.. php:staticmethod:: read($key)

Vous pouvez lire les valeurs de session en utilisant la syntaxe 
compatible :php:meth:`Set::classicExtract()`::

    CakeSession::read('Config.language');

.. php:staticmethod:: write($key, $value)

``$key`` devrait être le chemin séparé de point et ``$value`` sa valeur::

    CakeSession::write('Config.language', 'eng');

.. php:staticmethod:: delete($key)

Quand vous avez besoin de supprimer des données à partir de la session, 
vous pouvez utiliser delete::

    CakeSession::delete('Config.language');

Vous devriez aussi voir la documentation sur 
:doc:`/core-libraries/components/sessions` et 
:doc:`/core-libraries/helpers/session` sur la façon d'accéder aux données de 
Session dans le controller et la vue.


.. meta::
    :title lang=fr: Sessions
    :keywords lang=fr: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
