Configuration
#############

Configurer une application CakePHP c'est du gâteau. Après avoir
installé CakePHP, la création d'une application web basique nécessite seulement
que vous définissiez une configuration à la base de données.

Il y a toutefois d'autres étapes optionnelles de configuration que vous
pouvez suivre afin de tirer profit de l'architecture flexible de CakePHP.
Vous pouvez facilement ajouter des fonctionnalités provenant du cœur de
CakePHP, configurer des mappings URLs supplémentaires/différentes (routes) et
définir des inflexions supplémentaires/différentes.

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

datasource
    Le nom de la source de données pour lequel ce tableau de configuration
    est destiné. Exemples : Database/Mysql, Database/Sqlserver,
    Database/Postgres, Database/Sqlite. Vous pouvez utiliser la
    :term:`syntaxe de plugin` pour indiquer la source de données du plugin à
    utiliser.
persistent
    Indique si l'on doit ou non utiliser une connexion persistante à la base.
    Si vous utilisez SQLServer, vous ne devriez pas activer les connections
    persistantes car cela entraîne des problèmes pour diagnostiquer des crashes.
host
    Le nom du serveur de base de données (ou son adresse IP).
login
    Le nom d'utilisateur pour ce compte.
password
    Le mot de passe pour ce compte.
database
    Le nom de la base de données à utiliser pour cette connexion.
prefix (*optionel*)
    La chaîne qui préfixe le nom de chaque table dans la base de données.
    Si vos tables n'ont pas de préfixe, laissez une chaîne vide pour cette
    valeur.
port (*optionel*)
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
    socket unix. Si vous utilisez PostgreSQL et voulez utiliser les sockets
    unix, laissez la clé host vide.
ssl_key
    Le chemin vers le fichier de clé SSL. (Seulement supporté par MySQL,
    nécessite PHP 5.3.7+).
ssl_cert
    Le chemin vers le fichier de certificat SSL. (Seulement supporté par MySQL,
    nécessite PHP 5.3.7+).
ssl_ca
    Le chemin vers l'autorité de certification SSL. (Seulement supporté par
    MySQL, nécessite PHP 5.3.7+).
settings
    Un tableau de clé/valeur qui doit être envoyé à la base de données du
    serveur en tant que commandes ``SET`` quand la connexion est créée.
    Cette option est seulement supportée par Mysql, Postgres, et Sqlserver en
    ce moment.

.. versionchanged:: 2.4
    Les clés ``settings``, ``ssl_key``, ``ssl_cert`` et ``ssl_ca`` ont été
    ajoutées dans 2.4.

.. note::

    Le paramétrage du préfixe est valable pour les tables, **pas** pour les
    models. Par exemple, si vous créez une table de liaison entre vos
    models Apple et Flavor, vous la nommerez "prefix\_apples\_flavors"
    (et **non pas** "prefix\_apples\_prefix\_flavors") et vous paramétrerez
    votre propriété "prefix" sur 'prefix\_'.

A présent, vous aurez peut-être envie de jeter un œil aux
:doc:`/getting-started/cakephp-conventions`. Le nommage correct de vos tables
(et de quelques colonnes en plus) peut vous rapporter quelques fonctionnalités
supplémentaires et vous éviter trop de configuration. Par exemple, si vous
nommer votre table big_boxes, votre model BigBox, votre controller
BigBoxesController, tout marchera ensemble automatiquement. Par convention,
utilisez les underscores, les minuscules et les formes plurielles pour les
noms de vos tables - par exemple : bakers, pastry_stores, et savory_cakes.

.. todo::

    Ajouter des informations sur les options spécifiques pour différents
    fournisseurs de base de données comme Microsoft SQL Server, PostgreSQL et MySQL.

Chemins de Classe Supplémentaires
=================================

Il est occasionnellement utile d'être capable de partager des classes MVC entre
des applications sur le même système. Si vous souhaitez le même controller dans
les deux applications, vous pouvez utiliser le bootstrap.php de CakePHP pour
amener ces classes supplémentaires dans la vue.

En utilisant :php:meth:`App::build()` dans bootstrap.php nous pouvons définir
des chemins supplémentaires où CakePHP va recherchez les classes::

    App::build(array(
        'Model' => array(
            '/path/to/models',
            '/next/path/to/models'
        ),
        'Model/Behavior' => array(
            '/path/to/behaviors',
            '/next/path/to/behaviors'
        ),
        'Model/Datasource' => array(
            '/path/to/datasources',
            '/next/path/to/datasources'
        ),
        'Model/Datasource/Database' => array(
            '/path/to/databases',
            '/next/path/to/database'
        ),
        'Model/Datasource/Session' => array(
            '/path/to/sessions',
            '/next/path/to/sessions'
        ),
        'Controller' => array(
            '/path/to/controllers',
            '/next/path/to/controllers'
        ),
        'Controller/Component' => array(
            '/path/to/components',
            '/next/path/to/components'
        ),
        'Controller/Component/Auth' => array(
            '/path/to/auths',
            '/next/path/to/auths'
        ),
        'Controller/Component/Acl' => array(
            '/path/to/acls',
            '/next/path/to/acls'
        ),
        'View' => array(
            '/path/to/views',
            '/next/path/to/views'
        ),
        'View/Helper' => array(
            '/path/to/helpers',
            '/next/path/to/helpers'
        ),
        'Console' => array(
            '/path/to/consoles',
            '/next/path/to/consoles'
        ),
        'Console/Command' => array(
            '/path/to/commands',
            '/next/path/to/commands'
        ),
        'Console/Command/Task' => array(
            '/path/to/tasks',
            '/next/path/to/tasks'
        ),
        'Lib' => array(
            '/path/to/libs',
            '/next/path/to/libs'
        ),
        'Locale' => array(
            '/path/to/locales',
            '/next/path/to/locales'
        ),
        'Vendor' => array(
            '/path/to/vendors',
            '/next/path/to/vendors'
        ),
        'Plugin' => array(
            '/path/to/plugins',
            '/next/path/to/plugins'
        ),
    ));

.. note::

    Tout chemin de configuration supplémentaire doit être fait en haut du
    bootstrap.php de votre application. Cela va assurer que les chemins sont
    disponibles pour le reste de votre application.

.. index:: core.php, configuration

Configuration du Coeur
======================

Chaque application dans CakePHP contient un fichier de configuration pour
déterminer le comportement interne de CakePHP.
``app/Config/core.php``. Ce fichier est une collection de définitions de
variables et de constantes de la classe Configure qui déterminent comment
votre application se comporte. Avant que nous creusions ces variables
particulières, vous aurez besoin d'être familier avec la classe de
configuration registry :php:class:`Configure` de CakePHP.

Configuration du Coeur de CakePHP
---------------------------------

La classe `Configure` est utilisée pour gérer un ensemble de variables de
configuration du coeur de CakePHP. Ces variables peuvent être trouvées dans
``app/Config/core.php``. Ci-dessous se trouve une description de chaque
variable et comment elle affecte votre application CakePHP.

debug
    Change la sortie de debug de CakePHP.

    * 0 = mode Production. Pas de sortie.
    * 1 = Montre les erreurs et les avertissements.
    * 2 = Montre les erreurs, avertissements, et le SQL. [le log SQL est
      seulement montré quand vous ajoutez $this->element('sql\_dump')
      à votre vue ou votre layout.]

Error
    Configure le gestionnaire d'Error handler utilisé pour gérer les erreurs
    pour votre application.
    Par défaut :php:meth:`ErrorHandler::handleError()` est utilisé. Cela
    affichera les erreurs en utilisant :php:class:`Debugger`, quand debug > 0
    et les logs d'erreurs avec :php:class:`CakeLog` quand debug = 0.

    Sous-clés:

    * ``handler`` - callback - Le callback pour gérer les erreurs. Vous pouvez
      définir cela à n'importe quel callback, en incluant les fonctions
      anonymes.
    * ``level`` - int - Le niveau d'erreurs pour lequel vous souhaitez faire
      une capture.
    * ``trace`` - boolean - Inclut les traces de pile d'erreurs dans les
      fichiers log.

Exception
    Configure le gestionnaire Exception utilisé pour les exceptions non
    attrapées. Par défaut, ErrorHandler::handleException() est utilisée.
    Elle va afficher une page HTML pour l'exception, et tant que debug > 0,
    les erreurs du framework comme Missing Controller seront affichées. Quand
    debug = 0, les erreurs du framework seront forcées en erreurs génériques
    HTTP. Pour plus d'informations sur la gestion de d'Exception, regardez la
    section :doc:`exceptions`.

.. _core-configuration-baseurl:

App.baseUrl
    Si vous ne souhaitez pas ou ne pouvez pas avoir le mod\_rewrite (ou
    un autre module compatible) et ne pouvez pas le lancer sur votre
    serveur, vous aurez besoin d'utiliser le système de belles URLs
    construit dans CakePHP. Dans ``/app/Config/core.php``,
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
App.fullBaseUrl
    Le nom de domaine complet (incluant le protocole) de la racine de votre application.
    Pour configurer CakePHP à utiliser une URL spécifique pour n'importe quelle
    génération d'URL dans votre application, utilisez cette variable de configuration.
    Cela écrasera la détection automatique du domaine et vous permettra également
    de faciliter la génération de lien depuis le CLI (par exemple, si vous envoyez
    des emails). Si l'application est dans un sous-dossier, vous devriez également
    définir ``App.base``.
App.base
    Le dossier de base où votre application est hébergée. Cette option doit être
    utilisée si l'application est dans un sous-dossier et que ``App.fullBaseUrl``
    est définie.
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
    Quand défini à true, la mise en cache persistante est désactivée côté-site.
    Cela mettra toutes les lectures/écritures du :php:class:`Cache` en échec.
Cache.check
    Si défini à true, active la mise en cache de la vue. L'activation est
    toujours nécessaire dans les controllers, mais cette variable permet
    la détection de ces configurations.
Session
    Contient un tableau de configurations à utiliser pour la configuration
    de session. La clé par défaut est utilisée pour définir un preset par
    défaut pour utiliser les sessions, toute configuration déclarée ici va
    écraser les configurations de la config par défaut.

    Sous-clés

    * ``name`` - Le nom du cookie à utiliser. Par défaut 'CAKEPHP'.
    * ``timeout`` - Le nombre de minutes de vie des sessions.
      Le timeout est géré par CakePHP.
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
    * ``autoRegenerate`` - Activer cette configuration allume un renouveau
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
    ``app/Model/Datasource/Session/<name>.php``. Assurez-vous que la classe
    implémente :php:interface:`CakeSessionHandlerInterface` et de définir
    Session.handler à <name>.

    Pour utiliser les sessions en base de données, lancez le schéma
    ``app/Config/Schema/sessions.php`` en utilisant la commande de shell de
    cake: ``cake schema create Sessions``.

Security.salt
    Une chaîne au hasard est utilisée dans le hashage de sécurité.
Security.cipherSeed
    Une chaîne numérique au hasard (nombres seulement) est utilisée pour
    crypter/décrypter les chaînes.
Asset.timestamp
    Ajoute un timestamp de dernière modification du fichier particulier
    à la fin des URLs des asset fichiers (CSS, JavaScript, Image) lors de
    l'utilisation de vos propres helpers.
    Valeurs valides:
    (boolean) false - Ne fait rien (par défaut).
    (boolean) true - Ajoute le timestamp quand debug > 0.
    (string) 'force' - Ajoute le timestamp quand debug >= 0.
Acl.classname, Acl.database
    Constantes utilisées pour la fonctionnalité d'Access Control List de
    CakePHP. Regardez le chapitre sur les Access Control Lists pour plus
    d'information.

.. note::
    La configuration de mise en Cache est aussi trouvée dans core.php — Nous
    couvrirons cela plus tard, donc restez concentrés.

La classe :php:class:`Configure` peut être utilisée pour lire et écrire des
paramètres de configuration du coeur à la volée. Cela peut être spécialement
pratique si vous voulez changer le paramètre de debug sur une section limitée
de logique dans votre application, par exemple.

Constantes de Configuration
---------------------------

Alors que la plupart des options de configuration sont gérées par Configure, il
y a quelques constantes que CakePHP utilise durant l'exécution.

.. php:const:: LOG_ERROR

    Constante d'Error. Utilisée pour différencier les erreurs de log et
    celles de debug. Actuellement PHP supporte LOG\_DEBUG.

Configuration du Cache du Coeur
-------------------------------

CakePHP utilise deux configurations de cache en interne. ``_cake_model_`` et
``_cake_core_``. ``_cake_core_`` est utilisé pour stocker les chemins de
fichier et les localisations d'objet. ``_cake_model_`` est utilisé pour stocker
les descriptions de schéma, et sourcer les listes pour les sources de
données. L'utilisation d'un stockage de cache rapide comme APC ou MemCached est
recommandée pour ces configurations, puisqu'elles sont lues à chaque requête.
Par défaut, ces eux configurations expirent toutes les 10 secondes quand le
debug est supérieur à 0.

Comme toutes les données de cache sont stockées dans :php:class:`Cache`, vous
pouvez effacer les données en utilisant :php:meth:`Cache::clear()`.


Classe Configure
================

.. php:class:: Configure

Malgré quelques petites choses à configurer dans CakePHP, il
est parfois utile d'avoir vos propres règles de configuration pour votre
application. Dans le passé, vous aviez peut-être défini des valeurs
de configuration personnalisées en définissant des variables ou des
constantes dans certains fichiers. Faire cela, vous force à inclure ce
fichier de configuration chaque fois que vous souhaitez utiliser
ces valeurs.

La nouvelle classe Configure de CakePHP peut être utilisée pour stocker et
récupéré des valeurs spécifiques d'exécution ou d'application. Attention,
cette classe vous permet de stocker tout dedans, puis de l'utiliser dans
toute autre partie de votre code: une tentative évidente de casser le modèle
MVC avec lequel CakePHP a été conçu. Le but principal de la classe Configure
est de garder les variables centralisées qui peuvent être partagées entre
beaucoup d'objets. Souvenez-vous d'essayer de suivre la règle "convention
plutôt que configuration" et vous ne casserez pas la structure MVC que nous
avons mis en place.

Cette classe peut être appelée de n'importe où dans l'application
dans un contexte statique::

    Configure::read('debug');

.. php:staticmethod:: write($key, $value)

    :param string $key: La clé à écrire, peut utiliser une valeur de
        :term:`notation avec points`.
    :param mixed $value: La valeur à stocker.

    Utilisez ``write()`` pour stocker les données dans configuration de
    l'application::

        Configure::write('Company.name','Pizza, Inc.');
        Configure::write('Company.slogan','Pizza for your body and soul');

    .. note::

        La :term:`notation avec points` utilisée dans le paramètre
        ``$key`` peut être utilisée pour organiser vos paramètres de
        configuration dans des groupes logiques.

    L'exemple ci-dessus pourrait aussi être écrit en un appel unique::

        Configure::write(
            'Company', array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul')
        );

    Vous pouvez utiliser ``Configure::write('debug', $int)`` pour intervertir
    les modes de debug et de production à la volée. C'est particulièrement
    pratique pour les intéractions AMF et SOAP quand les informations de debug
    peuvent entraîner des problèmes de parsing.

.. php:staticmethod:: read($key = null)

    :param string $key: La clé à lire, peut utiliser une valeur avec
        :term:`notation avec points`

    Utilisée pour lire les données de configuration à partir de l'application.
    Par défaut, la valeur de debug de CakePHP est au plus important. Si une
    clé est fournie, la donnée est retournée. En utilisant nos exemples du
    write() ci-dessus, nous pouvons lire cette donnée::

        Configure::read('Company.name');    //yields: 'Pizza, Inc.'
        Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'

        Configure::read('Company');

        //yields:
        array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

    Si $key est laissé à null, toutes les valeurs dans Configure seront
    retournées. Si la valeur correspondant à la $key spécifiée n'existe pas
    alors null sera retourné.

.. php:staticmethod:: consume($key)

    :param string $key: La clé à lire, peut utiliser une
        valeur en :term:`notation avec points`

    Lit et supprime une clé de Configure. C'est utile quand vous voulez
    combiner la lecture et la suppression de valeurs en une seule opération.

.. php:staticmethod:: check($key)

    :param string $key: La clé à vérifier.

    Utilisé pour vérifier si une clé/chemin existe et a une valeur non-null.

    .. versionadded:: 2.3
        ``Configure::check()`` a été ajoutée dans 2.3.

.. php:staticmethod:: delete($key)

    :param string $key: La clé à supprimer, peut être utilisée avec une valeur
        en :term:`notation avec points`

    Utilisé pour supprimer l'information à partir de la configuration de
    l'application::

        Configure::delete('Company.name');

.. php:staticmethod:: version()

    Retourne la version de CakePHP pour l'application courante.

.. php:staticmethod:: config($name, $reader)

    :param string $name: Le nom du reader étant attaché.
    :param ConfigReaderInterface $reader: L'instance du reader étant attachée.

    Attachez un reader de configuration à Configure. Les readers attachés
    peuvent ensuite être utilisés pour charger les fichiers de configuration.
    Regardez :ref:`loading-configuration-files` pour plus d'informations sur
    la façon de lire les fichiers de configuration.

.. php:staticmethod:: configured($name = null)

    :param string $name: Le nom du reader à vérifier, si null
        une liste de tous les readers attachés va être retournée.

    Soit vérifie qu'un reader avec un nom donnée est attaché, soit récupère
    la liste des readers attachés.

.. php:staticmethod:: drop($name)

    Retire un objet reader connecté.


Lire et écrire les fichiers de configuration
============================================

CakePHP est fourni avec deux fichiers readers de configuration intégrés.
:php:class:`PhpReader` est capable de lire les fichiers de config de PHP, dans
le même format dans lequel Configure a lu historiquement.
:php:class:`IniReader` est capable de lire les fichiers de config ini du coeur.
Regardez la `documentation PHP <https://secure.php.net/parse_ini_file>`_
pour plus d'informations sur les fichiers ini spécifiés. Pour utiliser un
reader de config du coeur, vous aurez besoin de l'attacher à Configure
en utilisant :php:meth:`Configure::config()`::

    App::uses('PhpReader', 'Configure');
    // Lire les fichiers de config à partir de app/Config
    Configure::config('default', new PhpReader());

    // Lire les fichiers de config à partir du chemin
    Configure::config('default', new PhpReader('/path/to/your/config/files/'));

Vous pouvez avoir de multiples readers attachés à Configure, chacun lisant
différents types de fichiers de configuration, ou lisant à partir de
différents types de sources. Vous pouvez intéragir avec les readers attachés
en utilisant quelques autres méthodes de Configure. Pour voir, vérifier
quels alias de reader sont attachés, vous pouvez utiliser
:php:meth:`Configure::configured()`::

    // Récupère le tableau d'alias pour les readers attachés.
    Configure::configured()

    // Vérifie si un reader spécifique est attaché
    Configure::configured('default');

Vous pouvez aussi retirer les readers attachés. ``Configure::drop('default')``
retirerait l'alias du reader par défaut. Toute tentative future pour charger
les fichiers de configuration avec ce reader serait en échec.


.. _loading-configuration-files:

Chargement des fichiers de configuration
========================================

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

    :param string $key: L'identifieur du fichier de configuration à charger.
    :param string $config: L'alias du reader configuré.
    :param boolean $merge: Si oui ou non les contenus du fichier de lecture
        doivent être fusionnés, ou écraser les valeurs existantes.

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
configurant le reader de config attaché dans $config. Par exemple, si
l'adaptateur 'default' est un :php:class:`PhpReader`, le fichier généré sera un
fichier de configuration PHP qu'on pourra charger avec :php:class:`PhpReader`

Etant donné que le reader 'default' est une instance de PhpReader.
Sauvegarder toutes les données de Configure  dans le fichier `my_config.php`::

    Configure::dump('my_config.php', 'default');

Sauvegarder seulement les erreur gérant la configuration::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` peut être utilisé pour soit modifier, soit surcharger
les fichiers de configuration qui sont lisibles avec
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
    :param string $cacheConfig: La configuration de cache à partir de laquelle
        on charge les données.

Une fois que vous avez stocké la configuration exécutée, vous aurez
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

    // dans app/Lib/Configure/MyXmlReader.php
    App::uses('Xml', 'Utility');
    class MyXmlReader implements ConfigReaderInterface {
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

        // Depuis 2.3 une méthode dump() est ausi requise
        public function dump($key, $data) {
            // code pour supprimer les données d'un fichier
        }
    }

Dans votre ``app/Config/bootstrap.php``, vous pouvez attacher ce reader et
l'utiliser::

    App::uses('MyXmlReader', 'Configure');
    Configure::config('xml', new MyXmlReader());
    ...

    Configure::load('my_xml');

.. warning::

        Ce n'dest pas une bonne idée de nommer votre classe de configuration
        ``XmlReader`` car ce nom de classe est déjà utilisé en interne par PHP
        `XMLReader <https://secure.php.net/manual/fr/book.xmlreader.php>`_

La méthode ``read()`` du reader de config, doit retourner un tableau
d'informations de configuration que la ressource nommé ``$key`` contient.

.. php:interface:: ConfigReaderInterface

    Définit l'interface utilisée par les classes qui lisent les données de
    configuration et les stocke dans :php:class:`Configure`.

.. php:method:: read($key)

    :param string $key: Le nom de la clé ou l'identifieur à charger.

    Cette méthode devrait charger/parser les données de configuration
    identifiées par ``$key`` et retourner un tableau de données dans le
    fichier.

.. php:method:: dump($key, $data)

    :param string $key: L'identifieur dans lequel écrire.
    :param array $data: La donnée à supprimer.

    Cette méthode doit supprimer/stocker la donnée de configuration fournie à
    une clé identifié par ``$key``.

.. versionadded:: 2.3
    ``ConfigReaderInterface::dump()`` a été ajoutée dans 2.3.

.. php:exception:: ConfigureException

    Lancé quand les erreurs apparaissent quand le
    chargement/stockage/restauration des données de configuration.
    Les implémentations de :php:interface:`ConfigReaderInterface` devraient
    lancer cette exception quand elles rencontrent une erreur.

Readers de Configuration intégrés
---------------------------------

.. php:class:: PhpReader

    Vous permet de lire les fichiers de configuration qui sont stockés en
    fichiers PHP simples. Vous pouvez lire soit les fichiers à partir de votre
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

    Des fichiers sans ``$config`` entraîneraient une
    :php:exc:`ConfigureException`.

    Charger votre fichier de configuration personnalisé en insérant ce qui suit
    dans app/Config/bootstrap.php::

        Configure::load('customConfig');

.. php:class:: IniReader

    Vous permet de lire les fichiers de configuration qui sont stockés en
    fichiers .ini simples. Les fichiers ini doivent être compatibles avec la
    fonction PHP ``parse_ini_file``, et bénéficie des améliorations suivantes:

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

Les conventions de nommage de CakePHP peuvent être vraiment sympas - vous
pouvez nommer votre table de base de données big_boxes, votre model BigBox,
votre controller BigBoxesController, et tout fonctionne ensemble
automatiquement. La façon dont CakePHP sait comment lier les choses ensemble
est en *infléctant* les mots entre leurs formes singulière et plurielle.

Il y a des occasions (spécialement pour nos amis ne parlant pas Anglais) où
vous pouvez être dans des situations où l':php:class:`Inflector` de CakePHP (la
classe qui met au pluriel, au singulier, en CamelCase, et en underscore) ne
fonctionne pas comme vous voulez. Si CakePHP ne reconnait pas vos Foci ou Fish,
vous pouvez dire à CakePHP vos cas spéciaux.

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
bootstrap de CakePHP dans app/Config/bootstrap.php. Ce fichier est
exécuté juste après le bootstrapping du coeur de CakePHP.

Ce fichier est idéal pour un certain nombre de tâches de bootstrapping
courantes:

- Définir des fonctions commodes.
- Enregistrer les constantes globales.
- Définir un model supplémentaire, une vue, et des chemins de controller.
- Créer des configurations de cache.
- Configurer les inflections.
- Charger les fichiers de configuration.

Faîtes attention de maintenir le model MVC du logiciel quand vous ajoutez des
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
