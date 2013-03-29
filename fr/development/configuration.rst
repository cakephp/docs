Configuration
#############

Configurer une application CakePHP c'est du gâteau. Après que vous ayez 
installé CakePHP, créer une application web basique nécessite seulement 
que vous définissiez une configuration à la base de données.

Il y a, toutefois, d'autres étapes optionnelles de configuration que vous 
pouvez suivre afin de tirer avantage de l'architecture flexible de CakePHP. 
Vous pouvez facilement ajouter des fonctionnalités héritant du cœur de 
CakePHP, configurer des URLs additionnelles/différentes (routes) et définir 
des inflexions additionnelles/différentes.

.. index:: database.php, database.php.default
.. _database-configuration:

Configuration de la Base de Données
===================================

CakePHP s'attend à trouver les détails de configuration de la base de données 
dans le fichier ``app/Config/database.php``. Un exemple de fichier de 
configuration de base de données peut être trouvé dans 
``app/Config/database.php.default``. Une configuration basique complète 
devrait ressembler à quelque chose comme cela::

    class DATABASE_CONFIG {
        public $default = array(
            'datasource'  => 'Database/Mysql',
            'persistent'  => false,
            'host'        => 'localhost',
            'login'       => 'cakephpuser',
            'password'    => 'c4k3roxx!',
            'database'    => 'my_cakephp_project',
            'prefix'      => ''
        );
    }

Le tableau de connexion $default est utilisé tant qu'aucune autre connexion 
n'est spécifiée dans un model, par la propriété ``$useDbConfig``. Par exemple, 
si mon application a une base de données pré-existante, outre celle par 
défaut, je pourrais l'utiliser dans mes models, en créant un nouveau tableau 
de connexion à la base de données, intitulé $ancienne, identique au tableau 
$default, puis en initialisant la propriété 
``public $useDbConfig = 'ancienne';`` dans les models appropriés. 

Complétez les couples clé/valeur du tableau de configuration pour répondre au 
mieux à vos besoins.

Clé
    Valeur
datasource
    Le nom de la source de données pour lequel ce tableau de configuration 
    est destiné. Exemples : Database/Mysql, Database/Sqlserver, 
    Database/Postgres, Database/Sqlite. Vous pouvez utiliser
    :term:`plugin syntax` pour indiquer la source de données du plugin à 
    utiliser.
persistent
    Indique si l'on doit ou non utiliser une connexion persistante à la base.
host
    Le nom du serveur de base de données (ou son adresse IP)
login
    Le nom d'utilisateur pour ce compte.
password
    Le mot de passe pour ce compte.
database
    Le nom de la base de données à utiliser pour cette connexion.
prefix (*optional*)
    La chaîne qui préfixe le nom de chaque table dans la base de données. 
    Si vos tables n'ont pas de préfixe, laissez une chaîne vide pour cette 
    valeur. 
port (*optional*)
    Le port TCP ou le socket Unix utilisé pour se connecter au serveur. 
encoding
    Indique quel jeu de caractères utiliser pour envoyer les instructions 
    SQL au serveur. Ces valeurs pour l'encodage par défaut de la base de 
    données sont valables pour toutes les bases autres que DB2. Si vous 
    souhaitez utiliser l'encodage UTF-8 avec des connexions mysql/mysqli, 
    vous devez écrire 'utf8' sans le tiret. 
schema
    Utilisé dans les paramètres d'une base PostgreSQL pour indiquer quel 
    schéma utiliser.    
datasource
    Source de données Non-DBO à utiliser, ex: 'ldap', 'twitter'.
unix_socket
    Utilisé par les pilotes qui le supportent pour connecter via les fichiers 
    socket unix. Si vous utilisez postgres et voulez utiliser les sockets 
    unix, laissez la clé host vide.

.. note::

    Le paramétrage du préfixe est valable pour les tables, **pas** pour les 
    models. Par exemple, si vous créez une table de liaison entre vos 
    models Pomme et Saveur, vous la nommerez "prefixe\_pommes\_saveurs" 
    (et **non pas** "prefixe\_pommes\_prefixe\_saveurs") et vous paramétrerez 
    votre propriété "prefix" sur "prefixe\_". 

A présent, vous aurez peut-être envie de jeter un œil aux 
:doc:`/getting-started/cakephp-conventions`. Le nommage correct de vos tables 
(et de quelques colonnes en plus) peut vous rapporter quelques fonctionnalités 
supplémentaires et vous éviter trop de configuration. Par exemple, si vous 
nommer votre table grosse\_boites, votre model GrosseBoite, votre controller 
GrosseBoitesController, tout marchera ensemble automatiquement. Par convention, 
utilisez les underscores, les minuscules et les formes plurielles pour les 
noms de vos tables - par exemple : cuisiniers, magasin\_de\_pates et 
bon\_biscuits.

.. todo::

    Ajouter des informations sur les options spécifiques pour différents 
    fournisseurs de base de données comme SQLServer, Postgres et MySQL.

Chemins de Classe Supplémentaires
=================================

Il est occasionnellement utilise d'être capable de partager des classes MVC entre 
des applications sur le même système. Si vous souhaitez le même controller dans 
les deux applications, vous pouvez utiliser le bootstrap.php de CakePHP pour 
amener ces classes additionnelles dans la vue.

En utilisant :php:meth:`App::build()` dans bootstrap.php nous pouvons définir des 
chemins supplémentaires où CakePHP va recherchez les classes::

    App::build(array(
        'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
        'Model' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
        'View' => array('/full/path/to/views/', '/next/full/path/to/views/'),
        'Controller' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
        'Model/Datasource' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
        'Model/Behavior' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
        'Controller/Component' => array('/full/path/to/components/', '/next/full/path/to/components/'),
        'View/Helper' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
        'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
        'Console/Command' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/'),
        'libs' => array('/full/path/to/libs/', '/next/full/path/to/libs/')
    ));

.. note::

    Tout chemin de configuration supplémentaire doit être fait en haut du 
    bootstrap.php de votre application. Cela s'assurera que les chemins sont 
    disponibles pour le reste de votre application.

.. index:: core.php, configuration

Configuration du Coeur
======================

Chaque application dans CakePHP contient un fichier de configuration pour 
déterminer le comportement interne de CakePHP.
``app/Config/core.php``. Ce fichier est une collection de définitions de 
variables et de constantes de la classe Configure qui déterminent comment 
votre application se comporte. Avant que nous creusions dans ces variables 
particulières, vous aurez besoin d'être familier avec la classe de 
configuration registry de CakePHP :php:class:`Configure`.

Configuration du Coeur de CakePHP
---------------------------------

La classe Configure est utilisée pour gérer un ensemble de variables de 
configuration du coeur de CakePHP. Ces variables peuvent être trouvées dans 
``app/Config/core.php``. Ci-dessous se trouve une description de chaque 
variable et comment elle affecte votre application CakePHP.

debug
    Change la sortie de debugging de CakePHP.
    0 = mode Production. Pas de sortie.
    1 = Montre les erreurs et les avertissements.
    2 = Montre les erreurs, avertissements, et le SQL. [le log SQL est 
    seulement montré quand vous ajoutez $this->element('sql\_dump') 
    à votre vue ou votre layout.]

Error
    Configure le getionnaire d'Error handler utilisé pour gérer les erreurs 
    pour votre application.  
    Par défaut :php:meth:`ErrorHandler::handleError()` est utilisé. Cela 
    affichera les erreurs en utilisant :php:class:`Debugger`, quand debug > 0
    et log d'erreurs avec :php:class:`CakeLog` quand debug = 0.

    Sub-keys:

    * ``handler`` - callback - Le callback pour gérer les erreurs. Vous pouvez 
      définir cela à n'importe quel callback, en incluant les fonctions 
      anonymes.
    * ``level`` - int - Le niveau d'erreurs pour lequel vous êtes intéressé 
      pour la capture.
    * ``trace`` - boolean - Inclut les traces de pile d'erreurs dans les 
      fichiers log.

Exception
    Configure le gestionnaire Exception utilisé pour les exceptions non 
    attrapées. Par défaut, ErrorHandler::handleException() est utilisée. 
    Elle va afficher une page HTML pour l'exception, et tant que debug > 0, 
    les erreurs du framework comme Missing Controller seront affichés. Quand 
    debug = 0, les erreurs du framework seront forcés en erreurs génériques 
    HTTP. Pour plus d'informations sur la gestion de d'Exception, regardez la 
    section :doc:`exceptions`.

.. _core-configuration-baseurl:

App.baseUrl
    Si vous ne souhaitez pas ou ne pouvez pas avoir le mod\_rewrite (ou 
    un autre module compatible) et ne pouvez pas le lancer sur votre 
    serveur, vous aurez besoin d'utiliser le système de belles URLs 
    construit dans Cake. Dans ``/app/Config/core.php``,
    décommentez la ligne qui ressemble à cela::
    
        Configure::write('App.baseUrl', env('SCRIPT_NAME'));
        
    Retirez aussi ces fichiers .htaccess::
    
        /.htaccess
        /app/.htaccess
        /app/webroot/.htaccess
    
    
    Cela fera apparaitre vos URLs de la façon suivante 
    www.example.com/index.php/controllername/actionname/param plutôt 
    que www.example.com/controllername/actionname/param.
    
    Si vous installez CakePHP sur un serveur web autre que Apache, vous 
    pouvez trouver des instructions pour faire fonctionner l'URL rewriting 
    pour d'autres serveurs dans la section 
    :doc:`/installation/url-rewriting`.
App.encoding
    Définit quel encodage votre application utilise. Cet encodage est utilisé 
    pour générer le charset dans le layout, et les entités d'encodage.
    Il doit correspondre aux valeurs encodées spécifiées pour votre base de 
    données.
Routing.prefixes
    Décommentez cette définition si vous souhaitez tirer profit des routes 
    préfixées de CakePHP comme admin. Définissez cette variable avec un 
    tableau de noms préfixés de routes que vous voulez utiliser. En savoir 
    plus sur cela plus tard.
Cache.disable
    Quand défini à true, la mise en cache persistente est désativée site-wide.
    Cela mettra toutes les lecture/écritures du :php:class:`Cache` en échec.
Cache.check
    Si défini à true, active la mise en cache de la vue. L'activation est 
    toujours necéssaire dans les controllers, mais cette variable permet 
    la détection de ces configurations.
Session
    Contient un tableau de configurations à utiliser pour la configuration 
    de session. La clé par défaut est utilisée pour définir un preset par 
    défaut pour utiliser les sessions, toute configuration déclarée ici va 
    écraser les configurations de la config par défaut.

    Sous-clés

    * ``name`` - Le nom du cookie à utiliser. Par défaut 'CAKEPHP'
    * ``timeout`` - Le nombre de minutes de vie des sessions. 
      Le timeout est géré par CakePHP
    * ``cookieTimeout`` - Le nombre de minutes de vie des cookies de session.
    * ``checkAgent`` - Voulez-vous que l'user agent soit vérifié quand on 
      démarre les sessions? Vous voudrez peut-être définir la valeur à false, 
      quand il s'agit de vieilles versions de IE, Chrome Frame ou certains 
      navigateurs et AJAX.
    * ``defaults`` - La configuration par défaut définie à utiliser comme base 
      pour votre session.
      Il y en a quatre intégrées: php, cake, cache, database.
    * ``handler`` - Peut être utilisé pour activer un gestionnaire de session 
      personnalisé. Attend un tableau de callables, qui peut être utilisé avec 
      `session_save_handler`. L'utilisation de cette option va automatiquement 
      ajouter `session.save_handler` au tableau ini.
    * ``autoRegenerate`` - Activer cette configuration, allume un renouveau 
      automatique des sessions, et des ids de session qui changent fréquemment.
      Regardez :php:attr:`CakeSession::$requestCountdown`.
    * ``ini`` - Un tableau associatif de valeurs ini supplémentaires à définir.

    Les paramètres par défaut intégrés sont:

    * 'php' - Utilise les configurations définies dans votre php.ini.
    * 'cake' - Sauvegarde les fichiers de session dans le répertoire /tmp de 
      CakePHP's /tmp.
    * 'database' - Utilise les sessions de base de données de CakePHP.
    * 'cache' - Utilise la classe de Cache pour sauvegarder les sessions.

    Pour définir un gestionnaire de session personnalisé, sauvegardez le dans 
    ``app/Model/Datasource/Session/<name>.php``. Assurez vous que la classe 
    implémente :php:interface:`CakeSessionHandlerInterface` et de définir 
    Session.handler à <name>

    Pour utiliser les sessions en base de données, lancez le schéma 
    ``app/Config/Schema/sessions.php`` en utilisant la commnde de shell de 
    cake: ``cake schema create Sessions``

Security.level
    Le niveau de sécurité de CakePHP. Le time timeout de session défini dans 
    'Session.timeout' est multiplié selon les configurations d'ici.
    Valeurs valides:
    'high' = x 10
    'medium' = x 100
    'low' = x 300
    'high' et 'medium' sont aussi possible
    `session.referer\_check <http://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_
    Les IDs de session de CakePHP sont aussi regénérés entre les requêtes si 
    'Security.level' est défini à 'high'.
Security.salt
    Une chaîne au hasard est utilisée dans le hashage de sécurité.
Security.cipherSeed
    Une chaîne numérique au hasard (nombres seulement) est utilisée pour 
    crypter/décrypter les chaînes.
Asset.timestamp
    Appends a timestamp which is last modified time of the particular
    file at the end of asset files urls (CSS, JavaScript, Image) when
    using proper helpers.
    Valeurs valides:
    (bool) false - Ne fait rien (par défaut)
    (bool) true - Appends the timestamp when debug > 0
    (string) 'force' - Appends the timestamp when debug >= 0
Acl.classname, Acl.database
    Constantes utilisées pour la fonctionnalité d'Access Control List de 
    CakePHP. Regardez le chapitre sur les Access Control Lists pour plus 
    d'information.

.. note::
    La configuration de mise en Cache est aussi trouvée dans core.php — Nous 
    couvrirons cela plus tard, alors restez en alerte.

La classe :php:class:`Configure` peut être utilisée pour lire et écrire des 
paramètres de configuration du coeur à la volée. Cela peut être spécialement 
pratique si vous voulez changer le paramètre de debug sur une section limitée 
de logique dans votre application, par exemple.

Constantes de Configuration
---------------------------

Alors que la plupart des options de configuration sont gérées par Configure, il 
y a quelques constantes que CakePHP utilise durant le runtime.

.. php:const:: LOG_ERROR

    Constante d'Error. Utilisée pour différentier les erreurs de log et 
    celles de debug. Actuellement PHP supporte LOG\_DEBUG.

Configuration du Cache du Coeur
-------------------------------

CakePHP utilise deux configurations de cache en interne. ``_cake_model_`` et 
``_cake_core_``. ``_cake_core_`` est utilisé pour stocker les chemins de 
fichier et les localisations d'objet. ``_cake_model_`` est utilisé pour stocker 
les descriptions de schéma, et 
used to store schema descriptions, et sourcer les listes de sources de données. 
Utiliser un stockage de cache rapide comme APC ou Memcached est recommandé pour 
ces configurations, puisqu'elles sont lues à chaque requête. Par défaut, les 
deux configurations expirent toutes les 10 secondes quand debug est supérieur 
à 0.

Comme toutes les données de cache sont stockées dans :php:class:`Cache`, vous 
pouvez effacer les données en utilisant :php:meth:`Cache::clear()`.


Classe Configure
================

.. php:class:: Configure

Malgré quelques choses necéssitant d'être configurées dans CakePHP, il 
est parfois utilie d'avoir vos propres règles de configuration pour votre 
application. Dans le passé, vous deviez peut-être définir des valeurs 
de configuration personnalisées en définissant des variables ou des 
constantes dans certains fichiers. Faire cela, vous force à inclure ce 
fichier de configuration chaque fois que vous souhaitez utiliser 
ces valeurs.

La nouvelle classe Configure de CakePHP peut être utilisée pour stocker et 
récupèrer des valeurs spécifiques d'exécution ou d'application. Attention, 
cette classe vous permet de stocker tout dedans, puis de l'utiliser dans 
toute autre partie de votre code: une tentative évidente de casser le modèle 
MVC de CakePHP a été conçue. Le but principal de la classe Configure est de 
garder les variables centralisées qui peuvent être partagées entre beaucoup 
d'objets. Souvenez-vous d'essayer de suivre la règle "convention plutôt que 
configuration" et vous ne casserez pas la structure MVC que nous avons mis 
en place.

Cette classe peut être appelée de n'importe où dans l'application
dans un contexte statique::

    <?php Configure::read('debug'); ?>

.. php:staticmethod:: write($key, $value)

    :param string $key: La clé à écrire, peut utiliser une valeur de
        :term:`notation avec points`.
    :param mixed $value: La valeur à stocker.

    Utilisez ``write()`` pour stocker les données dans configuration de
    l'application::

        Configure::write('Company.name','Pizza, Inc.');
        Configure::write('Company.slogan','Pizza for your body and soul');

    .. note::

        La notation :term:`notation avec points` utilisée dans le paramètre 
        ``$key`` peut être utilisé pour organiser vos paramètres de 
        configuration dans des groupes logiques.

    L'exemple ci-dessus pourrait aussi être écrit en un appel unique::

        Configure::write(
            'Company', array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul')
        );

    Vous pouvez utiliser ``Configure::write('debug', $int)`` pour intervertir 
    les modes de debug et de production à la volée. C'est particulièrement 
    pratique pour les intéractions AMF et SOAP quand les informations de debug 
    peuvent entraîner des problèmes de parsing

.. php:staticmethod:: read($key = null)

    :param string $key: La clé à lire, peut utiliser une valeur avec
        :term:`notation avec points`

    Utilisée pour lire les données de configuration à partir de l'application. 
    Par défaut, la valeur de de bug de CakePHP est au plus important. Si une 
    clé est fournie, la donnée est retournée. En utilisant nos exemples du 
    write() ci-dessus, nous pouvons lire cette donnée::

        Configure::read('Company.name');    //yields: 'Pizza, Inc.'
        Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'

        Configure::read('Company');

        //yields: 
        array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

    Si $key est laissé à null, toutes les valeurs dans Configure seront 
    retournées.

.. php:staticmethod:: delete($key)

    :param string $key: La clé à supprimer, peut être utilisé avec une valeur
        :term:`notation avec points`

    Utilisé pour supprimer l'information à partir de la configuration de 
    l'application::

        Configure::delete('Company.name');

.. php:staticmethod:: version()

    Retourne la version de CakePHP pour l'application courante.

.. php:staticmethod:: config($name, $reader)

    :param string $name: Le nom du reader étant attaché.
    :param ConfigReaderInterface $reader: L'instance du reader étant attachée.

    Attachez un reader de configuration à Configure. Les readers attaché 
    peuvent ensuite être utilisés pour charger les fichiers de configuration. 
    Regardez :ref:`loading-configuration-files` pour plus d'informations sur 
    comment lire les fichiers de configuration.

.. php:staticmethod:: configured($name = null)

    :param string $name: Le nom du reader à vérifier, si null
        une liste de tous les readers attachés va être retournée.

    Soit vérifie qu'un reader avec un nom donnée est attaché, soit récupère 
    la liste des readers attachés.

.. php:staticmethod:: drop($name)

    Retire un objet reader connecté.

.. _loading-configuration-files:

Lire et écrire les fichiers de configuration
============================================

CakePHP est fourni avec deux fichiers readers de configuration intégrés.
:php:class:`PhpReader` est capable de lire les fichiers de config de PHP, dans 
le même format dans lequel Configure a lu historiquement. 
:php:class:`IniReader` est capable de lire les fichiers de config ini du coeur.
Regardez la `PHP documentation <http://php.net/parse_ini_file>`_ 
pour plus d'informations sur les fichiers ini spécifiés. Pour utiliser un 
reader de config du coeur, vous aurez besoin de l'attacher au Configure 
en utilisant :php:meth:`Configure::config()`::

    App::uses('PhpReader', 'Configure');
    // Lire les fichiers de config à partir de app/Config
    Configure::config('default', new PhpReader());

    // Lire les fichiers de config à partir du chemin
    Configure::config('default', new PhpReader('/path/to/your/config/files/'));

Vous pouvez avoir de multiples readers attachés à Configure, chacun lisant 
différentes façons de fichiers de configuration, ou lisant à partir de 
différents types de sources. Vous pouvez intéragir avec les readers attachés 
en utilisant quelques autres méthodes sur Configure. Pour voir, vérifier 
quels alias de reader sont attachés, vous pouvez utiliser 
:php:meth:`Configure::configured()`::

    // Récupère le tableau d'alias pour les readers attachés.
    Configure::configured()

    // Vérifie si un reader spécifique est attaché
    Configure::configured('default');

Vous pouvez aussi retirer les readers attachés. ``Configure::drop('default')``
retirerait l'alias du reader par défaut. Toute tentative future pour charger 
les fichiers de configuration avec ce reader serait en échec.

Chargement des fichiers de configuration
========================================

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

    :param string $key: L'identifieur du fichier de configuration à charger.
    :param string $config: L'alias du reader configuré.
    :param boolean $merge: Si oui ou non les contenus du fichier de lecture 
        devraient être fusionnés, ou écraser les valeurs existantes.

Une fois que vous attachez un reader de config à Configure, vous pouvez charger 
les fichiers de configuration::

    // Charge my_file.php en utilisant l'objet reader 'default'.
    Configure::load('my_file', 'default');

Les fichiers de configuration chargés fusionnent leurs données avec la 
configuration exécutée existante dans Configure. Cela vous permet d'écraser 
et d'ajouter de nouvelles valeurs dans la configuration existante exécutée. 
En configurant ``$merge`` à true, les valeurs ne vont pas toujours écraser 
la configuration existante.

Créer et modifier les fichiers de configuration
-----------------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = array())

    :param string $key: Le nom du fichier/configuration stockée à créer.
    :param string $config: Le nom du reader avec lequel stocker les données.
    :param array $keys: La liste des clés de haut-niveau à sauvegarder. Par 
     défaut, pour toutes les clés.

Déverse toute ou quelques données de Configure dans un fichier ou un système de
stockage supporté par le reader. Le format de sérialisation est décidé en 
configurant le reader de config attaché dans $config. Par exemple, si l'adaptateur
'default' est un :php:class:`PhpReader`, le fichier généré sera un fichier de 
configuration PHP qu'on pourra charger avec :php:class:`PhpReader`

Etant donné que le reader 'default' est une instance de PhpReader.
Sauvegarder toutes les données de Configure  dans le fichier `my_config.php`::

    Configure::dump('my_config.php', 'default');

Sauvegarder seulement les erreur gérant la configuration::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` peut être utilisé pour soit modifier, soit surcharger 
les fichiers de configuration qui sont en lisibles avec 
:php:meth:`Configure::load()`

.. versionadded:: 2.2
    ``Configure::dump()`` a été ajouté dans 2.2.
    
Stocker la configuration de runtime
-----------------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

    :param string $name: La clé de stockage pour le fichier de cache.
    :param string $cacheConfig: Le nom de la configuration de cache pour y 
        stocker les données de configuration.
    :param mixed $data: Soit la donnée à stocker, soit laisser à null pour 
        stocker toutes les données dans Configure.

Vous pouvez aussi stocker les valeurs de configuration exécutées pour 
l'utilisation dans une requête future. Depuis que configure ne se souvient 
seulement que des valeurs pour la requête courante, vous aurez besoin de 
stocker toute information de configuration modifiée si vous souhaitez 
l'utiliser dans des requêtes suivantes::

    // Stocke la configuration courante dans la clé 'user_1234' dans le cache 'default'.
    Configure::store('user_1234', 'default');

Les données de configuration stockées persistent dans la classe 
:php:class:`Cache`. Cela vous permet de stocker les informations de 
Configuration dans tout moteur de stockage avec lequel :php:class:`Cache` peut 
parler.

Restaurer la configuration de runtime
-------------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

    :param string $name: La clé de stockage à charger.
    :param string $cacheConfig: La configuration de cache à partir de laquel 
        on charge les données.

Une fois que vous avez stocké la configuration executée, vous aurez 
probablement besoin de la restaurer afin que vous puissiez y accéder à nouveau.
``Configure::restore()`` fait exactement cela::

    // restaure la configuration exécutée à partir du cache.
    Configure::restore('user_1234', 'default');

Quand on restaure les informations de configuration, il est important de 
les restaurer avec la même clé, et la configuration de cache comme elle 
était utilisée pour les stocker. Les informations restaurées sont fusionnées 
en haut de la configuration existante exécutée.

Créer vos propres readers de Configuration
==========================================

Depuis que les readers de configuration sont une partie extensible de CakePHP, 
vous pouvez créer des readers de configuration dans votre application et 
plugins. Les readers de configuration ont besoin d'implémenter l' 
:php:interface:`ConfigReaderInterface`. Cette interface définit une méthode de 
lecture, comme seule méthode requise. Si vous aimez vraiment les fichiers XML, 
vous pouvez créer un reader de config simple Xml pour votre application::

    // dans app/Lib/Configure/XmlReader.php
    App::uses('Xml', 'Utility');
    class XmlReader implements ConfigReaderInterface {
        public function __construct($path = null) {
            if (!$path) {
                $path = APP . 'Config' . DS;
            }
            $this->_path = $path;
        }

        public function read($key) {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }
    }

Dans votre ``app/Config/bootstrap.php``, vous pouvez attacher ce reader et 
l'utiliser::

    App::uses('XmlReader', 'Configure');
    Configure::config('xml', new XmlReader());
    ...

    Configure::load('my_xml');

La méthode ``read()`` du reader de config, doit retourner un tableau 
d'information de configuration que la ressource nommé ``$key`` contient.

.. php:interface:: ConfigReaderInterface

    Définit l'interface utilisée par les classes qui lisent les données de 
    configuration et les stocke dans :php:class:`Configure`

.. php:method:: read($key)

    :param string $key: Le nom de la clé ou l'identifieur à charger.

    Cette méthode devrait charger/parser les données de configuration 
    identifiées par ``$key`` et retourner un tableau de données dans le fichier.

.. php:exception:: ConfigureException

    Lancé quand les erreurs apparaissent quand le 
    chargement/stockage/restauration des données de configuration.
    Les implémentations de :php:interface:`ConfigReaderInterface` devraient 
    lancer cette erreur quand elles rencontrent une erreur.

Readers de Configuration intégrés
---------------------------------

.. php:class:: PhpReader

    Vous permet de lire les fichiers de configuration qui sont stockés en fichiers 
    PHP simples. Vous pouvez lire soit les fichiers à partir de votre 
    ``app/Config``, soit des répertoires configs du plugin en utilisant la 
    :term:`syntaxe de plugin`. Les fichiers **doivent** contenir une variable 
    ``$config``. Un fichier de configuration d'exemple ressemblerait à cela::

        $config = array(
            'debug' => 0,
            'Security' => array(
                'salt' => 'its-secret'
            ),
            'Exception' => array(
                'handler' => 'ErrorHandler::handleException',
                'renderer' => 'ExceptionRenderer',
                'log' => true
            )
        );

    Des fichiers sans ``$config`` entraîneraient un 
    :php:exc:`ConfigureException`

    Charger votre fichier de configuration personnalisé en insérant ce qui suit 
    dans app/Config/bootstrap.php:

        Configure::load('customConfig');

.. php:class:: IniReader

    Vous permet de lire les fichiers de configuration qui sont stockés en 
    fichiers .ini simples. Les fichiers ini doivent être compatibles avec la 
    fonction php ``parse_ini_file``, et bénéficie des améliorations suivantes 

    * Les valeurs séparées par des points sont étendues dans les tableaux.
    * Les valeurs de la famille des boléens comme 'on' et 'off' sont converties 
      en boléens.

    Un fichier ini d'exemple ressemblerait à cela::

        debug = 0

        Security.salt = its-secret

        [Exception]
        handler = ErrorHandler::handleException
        renderer = ExceptionRenderer
        log = true

    Le fichier ini ci-dessus aboutirait aux mêmes données de configuration que 
    dans l'exemple PHP du dessus. Les structures de tableau peuvent être créées 
    soit à travers des valeurs séparées de point, soit des sections. Les 
    sections peuvent contenir des clés séparées de point pour des imbrications 
    plus profondes.

.. _inflection-configuration:

Configuration de Inflection
===========================

Les conventions de nommage de Cake peuvent être vraiment sympas - vous pouvez 
nommer votre table de base de données big\_boxes, votre model BigBox, votre 
controller BigBoxesController, et tout fonctionne ensemble automatiquement. 
La façon dont CakePHP connait la manière de lier les choses ensemble est 
en *infléctant* les mots entre leurs formes singulière et plurielle.

Il y a des occasions (spécialement pour nos amis ne parlant pas Anglais) où 
vous pouvez être dans des situations où l'inflecteur de CakePHP (la classe 
qui met au pluriel, au singulier, en CamelCase, et en underscore) ne fonctionne 
pas comme vous voulez. Si CakePHP ne reconnait pas vos Foci ou Fish, vous 
pouvez dire à CakePHP vos cas spéciaux.

Chargement d'inflections personnalisées
---------------------------–-----------

Vous pouvez utiliser :php:meth:`Inflector::rules()` dans le fichier 
``app/Config/bootstrap.php`` pour charger des inflections personnalisées::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

ou::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

Va fusionner les règles fournies dans les ensembles d'inflection définies dans 
lib/Cake/Utility/Inflector.php, avec les règles ajoutées prenant le pas sur 
les règles du coeur.

Bootstrapping CakePHP
=====================

Si vous avez des besoins de configuration en plus, utilisez le fichier 
bootstrap de CakePHP, trouvé dans app/Config/bootstrap.php. Ce fichier est 
exécuté juste après le bootstrapping du coeur de CakePHP.

Ce fichier est idéal pour un certain nombre de tâches de bootstrapping communes:

- Définir des fonctions commodes.
- Enregistrer les constantes globales.
- Définir un model supplémentaire, une vue, et des chemins de controller.
- Créer des configurations de cache.
- Configurer les inflections.
- Charger les fichiers de configuration.

Attention de maintenir le model MVC du logiciel quand vous ajoutez des 
choses au fichier de bootstrap: il pourrait être tentant de placer des 
fonctions de formatage ici afin de les utiliser dans vos controllers.

Résister à la tentation. Vous serez content plus tard d'avoir suivi cette 
ligne de conduite.

Vous pouvez aussi envisager de placer des choses dans la classe 
:php:class:`AppController`. Cette class est une classe parente pour tous les 
controllers dans votre application. :php:class:`AppController` est un endroit 
pratique pour utiliser les callbacks de controller et définir des méthodes à 
utiliser pour tous les controllers.


.. meta::
    :title lang=fr: Configuration
    :keywords lang=fr: configuration finie,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
