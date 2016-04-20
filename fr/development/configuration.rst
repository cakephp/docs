Configuration
#############

Alors que les conventions enlèvent le besoin de configurer tout CakePHP, vous
aurez tout de même besoin de configurer quelques options de configurations
comme les accès à la base de données.

De plus, certaines options de configuration facultatives vous permettent de
changer les valeurs par défaut & les implémentations avec des options qui
conviennent à votre application.

.. index:: app.php, app.php.default

.. index:: configuration

Configurer votre Application
============================

La configuration est généralement stockée soit dans les fichiers PHP ou INI, et
chargée pendant le bootstrap de l'application. CakePHP est fourni avec un
fichier de configuration par défaut, mais si cela et nécessaire, vous pouvez
ajouter des fichiers supplémentaires de configuration et les charger dans
**config/bootstrap.php**. :php:class:`Cake\\Core\\Configure` est utilisée pour
la configuration générale, et les classes d'adaptateur fournissent les méthodes
``config()`` pour faciliter la configuration et la rendre plus transparente.

Charger les Fichiers de Configuration Supplémentaires
-----------------------------------------------------

Si votre application a plusieurs options de configuration, il peut être utile de
séparer la configuration dans plusieurs fichiers. Après avoir créé chacun des
fichiers dans votre répertoire **config/**, vous pouvez les charger dans
**bootstrap.php**::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

Vous pouvez aussi utiliser des fichiers de configuration supplémentaires pour
surcharger un environnement spécifique. Chaque fichier chargé après **app.php**
peut redéfinir les valeurs déclarées précédemment ce qui vous permet de
personnaliser la configuration pour les environnements de développement ou
intermédiaires.

Configuration Générale
----------------------

Ci-dessous se trouve une description des variables et la façon dont elles
modifient votre application CakePHP.

debug
    Change la sortie de debug de CakePHP. ``false`` = Mode Production. Pas de
    messages, d'erreurs ou d'avertissements montrés. ``true`` = Errors et
    avertissements montrés.
App.namespace
    Le namespace sous lequel se trouvent les classes de l'app.

    .. note::

        Quand vous changez le namespace dans votre configuration, vous devez
        aussi mettre à jour le fichier **composer.json** pour utiliser aussi
        ce namespace. De plus, créer un nouvel autoloader en lançant
        ``php composer.phar dumpautoload``.

.. _core-configuration-baseurl:

App.baseUrl
    Décommentez cette définition si vous **n'** envisagez **pas** d'utiliser le
    mod\_rewrite d'Apache avec CakePHP. N'oubliez pas aussi de retirer vos
    fichiers .htaccess.
App.base
    Le répertoire de base où l'app se trouve. Si à ``false``, il sera détecté
    automatiquement.
App.encoding
    Définit l'encodage que votre application utilise. Cet encodage est utilisé
    pour générer le charset dans le layout, et les entities encodés. Cela doit
    correspondre aux valeurs d'encodage spécifiées pour votre base de données.
App.webroot
    Le répertoire webroot.
App.wwwRoot
    Le chemin vers webroot.
App.fullBaseUrl
    Le nom de domaine complet (y compris le protocole) vers la racine de votre
    application. Ceci est utilisé pour la génération d'URLS absolues. Par
    défaut, cette valeur est générée en utilisant la variable d'environnement
    $_SERVER. Cependant, vous devriez la définir manuellement pour optimiser la
    performance ou si vous êtes inquiets sur le fait que des gens puissent
    manipuler le header ``Host``.
    Dans un contexte de CLI (à partir des shells), `fullBaseUrl` ne peut pas
    être lu dans $_SERVER, puisqu'il n'y a aucun serveur web impliqué. Vous
    devez le spécifier vous-même si vous avez besoin de générer des URLs à
    partir d'un shell (par exemple pour envoyer des emails).
App.imageBaseUrl
    Le chemin Web vers le répertoire public des images dans webroot. Si vous
    utilisez un :term:`CDN`, vous devez définir cette valeur vers la
    localisation du CDN.
App.cssBaseUrl
    Le chemin Web vers le répertoire public des css dans webroot. Si vous
    utilisez un :term:`CDN`, vous devez définir cette valeur vers la
    localisation du CDN.
App.paths
    Les chemins de Configure pour les ressources non basées sur les classes.
    Accepte les sous-clés ``plugins``, ``templates``, ``locales``, qui
    permettent la définition de chemins respectivement pour les plugins, les
    templates de view et les fichiers de locales.
App.jsBaseUrl
    Le chemin Web vers le répertoire public des js dans webroot. Si vous
    utilisez un :term:`CDN`, vous devriez définir cette valeur vers la
    localisation du CDN.
Security.salt
    Une chaîne au hasard utilisée dans les hashages. Cette valeur est aussi
    utilisée comme sel HMAC quand on fait des chiffrements symétriques.
Asset.timestamp
    Ajoute un timestamp qui est le dernier temps modifié du fichier particulier
    à la fin des URLs des fichiers d'asset (CSS, JavaScript, Image) lors de
    l'utilisation des helpers adéquats.
    Valeurs valides:

    - (bool) ``false`` - Ne fait rien (par défaut)
    - (bool) ``true`` - Ajoute le timestamp quand debug est à ``true``
    - (string) 'force' - Ajoute toujours le timestamp.

Configuration de la Base de Données
-----------------------------------

Regardez la :ref:`Configuration de la Base de Données <database-configuration>`
pour plus d'informations sur la configuration de vos connections à la base de
données.

Configuration de la Mise en Cache
---------------------------------

Consultez :ref:`cache-configuration` pour plus d'informations sur la
configuration de la mise en cache dans CakePHP.

Configuration de Gestion des Erreurs et des Exceptions
------------------------------------------------------

Consultez les sections sur :ref:`error-configuration` pour des informations sur
la configuration des gestionnaires d'erreur et d'exception.

Configuration des Logs
----------------------

Consultez :ref:`log-configuration` pour des informations sur la configuration
des logs dans CakePHP.

Configuration de Email
----------------------

Consultez :ref:`email-configuration` pour avoir des informations sur la
configuration prédéfinie d'email dans CakePHP.

Configuration de Session
------------------------

Consultez :ref:`session-configuration` pour avoir des informations sur la
configuration de la gestion des sessions dans CakePHP.

Configuration du Routing
------------------------

Consultez :ref:`routes-configuration` pour plus d'informations sur la
configuration du routing et de la création de routes pour votre application.

.. _additional-class-paths:

Chemins de Classe Supplémentaires
=================================

Les chemins de classe supplémentaires sont définis dans les autoloaders que
votre application utilise. Quand vous utilisez ``Composer`` pour générer votre
autoloader, vous pouvez faire ce qui suit, pour fournir des chemins à utiliser
pour les controllers dans votre application::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }

Ce qui est au-dessus va configurer les chemins pour les namespaces ``App`` et
``App\Controller``. La première clé va être cherchée, et si ce chemin ne
contient pas la classe/le fichier, la deuxième clé va être cherchée. Vous
pouvez aussi faire correspondre un namespace unique vers plusieurs répertoires
avec ce qui suit::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
        }
    }

Les chemins de Plugin, View Template et de Locale
-------------------------------------------------

Puisque les plugins, view templates et locales ne sont pas des classes, ils ne
peuvent pas avoir un autoloader configuré. CakePHP fournit trois variables de
configuration pour configurer des chemins supplémentaires pour vos ressources.
Dans votre **config/app.php**, vous pouvez définir les variables::

    return [
        // Plus de configuration
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/path/to/other/plugins/'
                ],
                'templates' => [
                    APP . 'Template' . DS,
                    APP . 'Template2' . DS
                ],
                'locales' => [
                    APP . 'Locale' . DS
                ]
            ]
        ]
    ];

Les chemins doivent finir par un séparateur de répertoire, ou ils ne
fonctionneront pas correctement.

Configuration de Inflection
===========================

Regardez :ref:`inflection-configuration` pour plus d'informations.

Classe Configure
================

.. php:namespace:: Cake\Core

.. php:class:: Configure

La nouvelle classe Configure de CakePHP peut être utilisée pour stocker et
récupérer des valeurs spécifiques d’exécution ou d’application. Attention,
cette classe vous permet de stocker tout dedans, puis de l’utiliser dans toute
autre partie de votre code: une tentative évidente de casser le modèle MVC avec
lequel CakePHP a été conçu. Le but principal de la classe Configure est de
garder les variables centralisées qui peuvent être partagées entre beaucoup
d’objets. Souvenez-vous d’essayer de suivre la règle “convention plutôt que
configuration” et vous ne casserez pas la structure MVC que nous avons mis en
place.

Vous pouvez accéder à ``Configure`` partout dans votre application::

    Configure::read('debug');

Ecrire des Données de Configuration
-----------------------------------

.. php:staticmethod:: write($key, $value)

Utilisez ``write()`` pour stocker les données de configuration de
l'application::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

.. note::

    La :term:`notation avec points` utilisée dans le paramètre ``$key`` peut
    être utilisée pour organiser vos paramètres de configuration dans des
    groupes logiques.

L'exemple ci-dessus pourrait aussi être écrit en un appel unique::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

Vous pouvez utiliser ``Configure::write('debug', $bool)`` pour intervertir les
modes de debug et de production à la volée. C'est particulièrement pratique pour
les interactions JSON quand les informations de debug peuvent entraîner des
problèmes de parsing.

Lire les Données de Configuration
---------------------------------

.. php:staticmethod:: read($key = null)

Utilisée pour lire les données de configuration à partir de l'application. Par
défaut, la valeur de debug de CakePHP est au plus important. Si une clé est
fournie, la donnée est retournée. En utilisant nos exemples du write()
ci-dessus, nous pouvons lire cette donnée::

    Configure::read('Company.name');    // Renvoie: 'Pizza, Inc.'
    Configure::read('Company.slogan');  // Renvoie: 'Pizza for your body and soul'

    Configure::read('Company');

    //yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

Si $key est laissée à null, toutes les valeurs dans Configure seront retournées.

.. php:staticmethod:: readOrFail($key)

Permet de lire les données de configuration tout comme
:php:meth:`Cake\\Core\\Configure::read` mais s'attend à trouver une paire
clé/valeur. Dans le cas où la paire demandée n'existe pas, une
:php:class:`RuntimeException` sera lancée::

    Configure::readOrFail('Company.name');    // Renvoie: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Lancera un exception

    Configure::readOrFail('Company');

    //  Renvoie:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

.. versionadded:: 3.1.7
    ``Configure::readOrFail()`` a été ajoutée dans 3.1.7

Vérifier si les Données de Configuration sont Définies
------------------------------------------------------

.. php:staticmethod:: check($key)

Utilisée pour vérifier si une clé/chemin existe et a une valeur non-null::

    $exists = Configure::check('Company.name');

Supprimer une Donnée de Configuration
-------------------------------------

.. php:staticmethod:: delete($key)

Utilisée pour supprimer l'information à partir de la configuration de
l'application::

    Configure::delete('Company.name');

Lire & Supprimer les Données de Configuration
---------------------------------------------

.. php:staticmethod:: consume($key)

Lit et supprime une clé de Configure. C'est utile quand vous voulez combiner la
lecture et la suppression de valeurs en une seule opération.

Lire et Ecrire les Fichiers de Configuration
============================================

CakePHP est fourni avec deux lecteurs de fichiers de configuration intégrés.
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` est capable de lire les
fichiers de config de PHP, dans le même format dans lequel Configure a lu
historiquement. :php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` est
capable de lire les fichiers de config ini du cœur.
Regardez la `documentation PHP <http://php.net/parse_ini_file>`_
pour plus d'informations sur les fichiers ini spécifiés. Pour utiliser un
lecteur de config du cœur, vous aurez besoin de l'attacher à Configure en
utilisant :php:meth:`Configure::config()`::

    use Cake\Core\Configure\Engine\PhpConfig;

    // Lire les fichiers de config à partir de config
    Configure::config('default', new PhpConfig());

    // Lire les fichiers de config à partir du chemin
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

Vous pouvez avoir plusieurs lecteurs attachés à Configure, chacun lisant
différents types de fichiers de configuration, ou lisant à partir de différents
types de sources. Vous pouvez interagir avec les lecteurs attachés en utilisant
certaines autres méthodes de Configure. Pour vérifier les alias qui sont
attachés au lecteur, vous pouvez utiliser :php:meth:`Configure::configured()`::

    // Récupère le tableau d'alias pour les lecteurs attachés.
    Configure::configured();

    // Vérifie si un lecteur spécifique est attaché
    Configure::configured('default');

.. php:staticmethod:: drop($name)

Vous pouvez aussi retirer les lecteurs attachés. ``Configure::drop('default')``
retirerait l'alias du lecteur par défaut. Toute tentative future pour charger
les fichiers de configuration avec ce lecteur serait en échec::

    Configure::drop('default');

.. _loading-configuration-files:

Chargement des Fichiers de Configuration
----------------------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

Une fois que vous attachez un lecteur de config à Configure, vous pouvez charger
les fichiers de configuration::

    // Charge my_file.php en utilisant l'objet de lecture 'default'.
    Configure::load('my_file', 'default');

Les fichiers de configuration chargés fusionnent leurs données avec la
configuration exécutée existante dans Configure. Cela vous permet d'écraser
et d'ajouter de nouvelles valeurs dans la configuration existante exécutée.
En configurant ``$merge`` à ``true``, les valeurs ne vont pas toujours écraser
la configuration existante.

Créer et Modifier les Fichiers de Configuration
-----------------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

Déverse toute ou quelques données de Configure dans un fichier ou un système de
stockage supporté par le lecteur. Le format de sérialisation est décidé en
configurant le lecteur de config attaché dans $config. Par exemple, si
l'adaptateur 'default' est
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`, le fichier généré sera
un fichier de configuration PHP qu'on pourra charger avec
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`.

Etant donné que le lecteur 'default' est une instance de PhpReader.
Sauvegarder toutes les données de Configure  dans le fichier `my_config.php`::

    Configure::dump('my_config', 'default');

Sauvegarde seulement les erreurs gérant la configuration::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` peut être utilisée pour soit modifier, soit surcharger
les fichiers de configuration qui sont lisibles avec
:php:meth:`Configure::load()`

Stocker la Configuration de Runtime
-----------------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

Vous pouvez aussi stocker les valeurs de configuration exécutées pour
l'utilisation dans une requête future. Comme configure ne se souvient seulement
que des valeurs pour la requête courante, vous aurez besoin de stocker toute
information de configuration modifiée si vous souhaitez l'utiliser dans des
requêtes suivantes::

    // Stocke la configuration courante dans la clé 'user_1234' dans le cache 'default'.
    Configure::store('user_1234', 'default');

Les données de configuration stockées persistent dans la configuration appelée
Cache. Consultez la documentation sur :doc:`/core-libraries/caching` pour plus
d'informations sur la mise en cache.

Restaurer la configuration de runtime
-------------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

Une fois que vous avez stocké la configuration exécutée, vous aurez
probablement besoin de la restaurer afin que vous puissiez y accéder à nouveau.
``Configure::restore()`` fait exactement cela::

    // restaure la configuration exécutée à partir du cache.
    Configure::restore('user_1234', 'default');

Quand on restaure les informations de configuration, il est important de les
restaurer avec la même clé, et la configuration de cache comme elle était
utilisée pour les stocker. Les informations restaurées sont fusionnées en haut
de la configuration existante exécutée.

Créer vos Propres Lecteurs de Configuration
===========================================

Comme les lecteurs de configuration sont une partie extensible de CakePHP, vous
pouvez créer des lecteurs de configuration dans votre application et plugins.
Les lecteurs de configuration ont besoin d'implémenter l'
:php:interface:`Cake\\Core\\Configure\\ConfigEngineInterface`. Cette interface
définit une méthode de lecture, comme seule méthode requise. Si vous aimez
vraiment les fichiers XML, vous pouvez créer un lecteur de config simple Xml
pour votre application::

    // Dans src/Configure/Engine/XmlConfig.php
    namespace App\Configure\Engine;

    use Cake\Core\Configure\ConfigEngineInterface;
    use Cake\Utility\Xml;

    class XmlConfig implements ConfigEngineInterface
    {

        public function __construct($path = null)
        {
            if (!$path) {
                $path = CONFIG;
            }
            $this->_path = $path;
        }

        public function read($key)
        {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }

        public function dump($key, array $data)
        {
            // Code to dump data to file
        }
    }

Dans votre **config/bootstrap.php**, vous pouvez attacher ce lecteur et
l'utiliser::

    use App\Configure\Engine\XmlConfig;

    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml', 'xml');

La méthode ``read()`` du lecteur de config, doit retourner un tableau
d'informations de configuration que la ressource nommée ``$key`` contient.

.. php:namespace:: Cake\Core\Configure

.. php:interface:: ConfigEngineInterface

    Définit l'interface utilisée par les classes qui lisent les données de
    configuration et les stockent dans :php:class:`Configure`.

.. php:method:: read($key)

    :param string $key: Le nom de la clé ou l'identifieur à charger.

    Cette méthode devrait charger/parser les données de configuration
    identifiées par ``$key`` et retourner un tableau de données dans le fichier.

.. php:method:: dump($key)

    :param string $key: L'identifieur dans lequel écrire.
    :param array $data: La donnée à supprimer.

    Cette méthode doit supprimer/stocker la donnée de configuration fournie à
    une clé identifié par ``$key``.

Moteurs de Configuration intégrés
=================================

.. php:namespace:: Cake\Core\Configure\Engine

Fichiers de Configuration PHP
-----------------------------

.. php:class:: PhpConfig

Vous permet de lire les fichiers de configuration de votre application qui sont
stockés en fichiers PHP simples. Vous pouvez lire soit les fichiers à partir de
votre config, soit des répertoires configs du plugin en utilisant la
:term:`syntaxe de plugin`. Les fichiers **doivent** retourner un tableau.
Un fichier de configuration d'exemple ressemblerait à cela::

    return [
        'debug' => 0,
        'Security' => [
            'salt' => 'its-secret'
        ],
        'App' => [
            'namespace' => 'App'
        ]
    ];

Chargez votre fichier de configuration personnalisé en insérant ce qui suit dans
**config/bootstrap.php**::

    Configure::load('customConfig');

Fichiers de Configuration Ini
-----------------------------

.. php:class:: IniConfig

Vous permet de lire les fichiers de configuration qui sont stockés en fichiers
.ini simples. Les fichiers ini doivent être compatibles avec la fonction php
``parse_ini_file()``, et bénéficie des améliorations suivantes:

* Les valeurs séparées par des points sont étendues dans les tableaux.
* Les valeurs de la famille des booléens comme 'on' et 'off' sont converties
  en booléens.

Un fichier ini d'exemple ressemblerait à cela::

    debug = 0

    [Security]
    salt = its-secret

    [App]
    namespace = App

Le fichier ini ci-dessus aboutirait aux mêmes données de configuration que dans
l'exemple PHP du dessus. Les structures de tableau peuvent être créées soit à
travers des valeurs séparées de point, soit des sections. Les sections peuvent
contenir des clés séparées de point pour des imbrications plus profondes.

Fichiers de Configuration Json
------------------------------

.. php:class:: JsonConfig

Vous permet de lire / effacer les fichiers de configuration qui sont stockés en
chaînes encodées JSON dans des fichiers .json.

Un exemple de fichier JSON ressemblerait à ceci::

    {
        "debug": false,
        "App": {
            "namespace": "MyApp"
        },
        "Security": {
            "salt": "its-secret"
        }
    }

Bootstrapping CakePHP
=====================

Si vous avez des besoins de configuration supplémentaires, utilisez le fichier
bootstrap de CakePHP dans **config/bootstrap.php**. Ce fichier est inclus juste
avant chaque requête et commande CLI.

Ce fichier est idéal pour un certain nombre de tâches de bootstrapping
courantes:

- Définir des fonctions commodes.
- Déclarer des constantes.
- Créer des configurations de cache.
- Configurer les inflections.
- Charger les fichiers de configuration.

Faîtes attention de maintenir le model MVC du logiciel quand vous ajoutez des
choses au fichier de bootstrap: il pourrait être tentant de placer des fonctions
de formatage ici afin de les utiliser dans vos controllers. Comme vous le verrez
dans les sections :doc:`/controllers` et :doc:`/views`, il y a de meilleurs
moyens d'ajouter de la logique personnalisée à votre application.

Environment Variables
=====================

Some of the modern cloud providers, like Heroku, let you define environment
variables. By defining environment variables, you can configure your CakePHP
app as an 12factor app. Following the
`12factor app instructions <http://12factor.net/>`_ is a good way to create a
stateless app, and to ease the deployment of your app.
This means for example, that if you need to change your database, you'll just
need to modify a DATABASE_URL variable on your host configuration without the
need to change it in your source code.

As you can see in your **app.php**, the following variables are concerned:

- ``DEBUG`` (``0`` or ``1``)
- ``APP_ENCODING`` (ie UTF-8)
- ``APP_DEFAULT_LOCALE`` (ie ``en_US``)
- ``SECURITY_SALT``
- ``CACHE_DEFAULT_URL`` (ie ``File:///?prefix=myapp_&serialize=true&timeout=3600&path=../tmp/cache/``)
- ``CACHE_CAKECORE_URL`` (ie ``File:///?prefix=myapp_cake_core_&serialize=true&timeout=3600&path=../tmp/cache/persistent/``)
- ``CACHE_CAKEMODEL_URL`` (ie ``File:///?prefix=myapp_cake_model_&serialize=true&timeout=3600&path=../tmp/cache/models/``)
- ``EMAIL_TRANSPORT_DEFAULT_URL`` (ie ``smtp://user:password@hostname:port?tls=null&client=null&timeout=30``)
- ``DATABASE_URL`` (ie ``mysql://user:pass@db/my_app``)
- ``DATABASE_TEST_URL`` (ie ``mysql://user:pass@db/test_my_app``)
- ``LOG_DEBUG_URL`` (ie ``file:///?levels[]=notice&levels[]=info&levels[]=debug&file=debug&path=../logs/``)
- ``LOG_ERROR_URL`` (ie ``file:///?levels[]=warning&levels[]=error&levels[]=critical&levels[]=alert&levels[]=emergency&file=error&path=../logs/``)

As you can see in the examples, we define some options configuration as
:term:`DSN` strings. This is the case for databases, logs, email transport and
cache configurations.

If the environment variables are not defined in your environment, CakePHP will
use the values that are defined in the **app.php**. You can use
`php-dotenv library <https://github.com/josegonzalez/php-dotenv>`_ to use
environment variables in a local development. See the Readme instructions of the
library for more information.

.. meta::
    :title lang=fr: Configuration
    :keywords lang=fr: configuration finie,legacy database,configuration base de données,value pairs,connection par défaut,configuration optionnelle,exemple base de données,classe php,configuration base de données,base de données par default,étapes de configuration,index base de données,détails de configuration,classe base de données,hôte localhost,inflections,valeur clé,connection base de données,facile,basic web
