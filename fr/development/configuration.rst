Configuration
#############

Configurer une application CakePHP c'est du gâteau. Après avoir
installé CakePHP, la création d'une application web basique nécessite seulement
que vous définissiez une configuration pour la base de données.

Il y a toutefois d'autres étapes optionnelles de configuration que vous
pouvez suivre afin de tirer profit de l'architecture flexible de CakePHP.
Vous pouvez facilement ajouter des fonctionnalités provenant du cœur de
CakePHP, configurer des mappings URLs supplémentaires/différentes (routes) et
définir des inflexions supplémentaires/différentes.

.. index:: app.php, app.php.default

.. index:: configuration

Configurer votre Application
============================

Bien que CakePHP soit un framework qui privilègie les conventions par rapport
aux configurations, il reste tout de même quelques options de configuration
qui permettent d'accorder CakePHP à vos besoins. Nous avons essayé de
fournir CakePHP avec des valeurs par défaut utiles pour que vous puissiez
développer plus rapidement.

La configuration est généralement stockée soit dans les fichiers PHP ou INI,
et chargée pendant le bootstrap de l'application. CakePHP est fourni avec un
fichier de configuration par défaut, mais si cela et nécessaire, vous pouvez
ajouter des fichiers supplémentaires de configuration et les charger dans
``App/Config/bootstrap.php``. :php:class:`Cake\\Core\\Configure` est utilisée
pour la configuration générale, et les classes d'adaptateur fournissent
les méthodes ``config()`` pour faciliter la configuration et la rendre plus
transparente.

Charger les Fichiers de Configuration Supplémentaires
-----------------------------------------------------

Si votre application a plusieurs options de configuration, il peut être utile
de séparer la configuration dans plusieurs fichiers. Après avoir créé chacun
des fichiers dans votre répertoire ``App/Config/``, vous pouvez les charger
dans bootstrap.php::

    use Cake\Core\Configure;
    use Cake\Configure\Engine\PhpConfig;

    Configure::config('default', new PhpConfig());
    Configure::load('app.php', 'default', false);
    Configure::load('other_config.php', 'default');

Vous pouvez aussi utiliser des fichiers de configuration supplémentaires pour
surcharger un environement spécifique. Chaque fichier chargé après ``app.php``
peut redéfinir les valeurs déclarées précédemment ce qui vous permet de
personnaliser la configuration pour les environnements de développement ou
intermédiaires.

Configuration Générale
----------------------

Ci-dessous se trouve une description des variables et la façon dont elles
modifient votre application CakePHP.

debug
    Change la sortie de debug de CakePHP. 0 = Mode Production. Pas de sortie.
    1 = Montre les erreurs et les avertissements. 2 = Montre les erreurs, les
    avertissements, et active le logging SQL. Le log SQL est seulement montré
    quand vous ajoutez ``$this->element('sql_dump');`` à votre view ou votre
    layout.
App.namespace
    Le namespace sous lequel se trouvent les classes de l'app.
App.baseUrl
    Décommentez cette définition si vous **n'** envisagez **pas** d'utiliser
    le mod\_rewrite d'Apache avec CakePHP. N'oubliez pas aussi de retirer vos
    fichiers .htaccess.
App.base
    Le répertoire de base où l'app se trouve. Si à false, il sera detecté
    automatiquement.
App.encoding
    Définit l'encodage que votre application utilise. Cet encodage est utilisé
    pour générer le charset dans le layout, et les entities encodés. Cela
    doit correspondre aux valeurs d'encodage spécifiés pour votre base de
    données.
App.webroot
    Le répertoire webroot.
App.www_root
    Le chemin vers webroot.
App.fullBaseUrl
    Le nom de domaine complet (y compris le protocole) vers la racine de votre
    application. Ceci est utilisé pour la génération d'URLS absolues. Par
    défaut, cette valeur est générée en utilisant la variable d'environnement
    $_SERVER. Cependant, vous devriez la définir manuellement pour optimiser
    la performance ou si vous êtes inquiets sur le fait que des gens puissent
    manipuler le header ``Host``.
App.imageBaseUrl
    Le chemin Web vers le répertoire public des images dans webroot. Si vous
    utilisez un :term:`CDN`, vous devez définir cette valeur vers la
    localisation du CDN.
App.cssBaseUrl
    Le chemin Web vers le répertoire public des css dans webroot. Si vous
    utilisez un :term:`CDN`, vous devez définir cette valeur vers la
    localisation du CDN.
App.jsBaseUrl
    Le chemin Web vers le répertoire public des js dans webroot. Si vous
    utilisez un :term:`CDN`, vous devriez définir cette valeur vers la
    localisation du CDN.
Security.salt
    Une chaîne au hasard utilisée dans les hashages de sécurité. Cette valeur
    est aussi utilisée comme sel HMAC quand on fait des chiffrements
    symétriques.
Asset.timestamp
    Ajoute un timestamp qui est le dernier temps modifié du fichier particulier
    à la fin des URLs des fichiers d'asset (CSS, JavaScript, Image) lors de
    l'utilisation des helpers adéquats.
    Valeurs valides:
    (bool) false - Ne fait rien (par défaut)
    (bool) true - Ajoute le timestamp quand debug > 0
    (string) 'force' - Toujours ajouter le timestamp.
Acl.classname, Acl.database
    Utilisé pour la fonctionnalité d'Access Control List de CakePHP. Regardez
    le chapitre sur les Access Control Lists pour plus d'informations.

Configuration de la Base de Données
===================================

Regardez :ref:`database-configuration` pour plus d'informations sur la
configuration de vos connections à la base de données.

Configuration de la Mise en Cache
---------------------------------

Regardez :ref:`cache-configuration` pour plus d'informations sur la
configuration de la mise en cache dans CakePHP.

Configuration de Gestion des Erreurs et des Exceptions
------------------------------------------------------

Regardez les sections sur :ref:`error-configuration` pour des informations sur
la configuration des gestionnaires d'erreur et d'exception.

Configuration du Logging
------------------------

Regardez :ref:`log-configuration` pour des informations sur la configuration
du logging dans CakePHP.

Configuration de Email
----------------------

Regardez :ref:`email-configuration` pour des informations sur la configuration
prédéfini d'email dans CakePHP.

Configuration de Session
------------------------

See the :ref:`session-configuration` for information on configuring session
handling in CakePHP.

Routing configuration
---------------------

Regardez :ref:`routes-configuration` pour plus d'informations sur la
configuration du routing et de la création de routes pour votre application.

Les constantes de Configuration
-------------------------------

Alors que la plupart des options de configuration sont gérées par Configure,
il y a quelques constantes que CakePHP utilise pendant son execution.

.. php:const:: LOG_ERROR

    Constante d'Erreur. Utilisée pour différentier le logging d'erreur et le
    logging de debug. Actuellement, PHP prend en charge LOG\_DEBUG.

.. _additional-class-paths:

Chemins de Classe Supplémentaires
=================================

Les chemins de classe supplémentaires sont définis dans les autoloaders que
votre application utilise. Quand vous utilisez ``Composer`` pour générer votre
autoloader, vous pouvez faire ce qui suit, pour fournir des chemins à
utiliser pour les controllers dans votre application::

    "autoload": {
        "psr-4": {
            "App\\Controller": "/path/to/directory/with/controller/folders",
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

Les chemins de View et de Plugin
--------------------------------

Puisque les views et plugins ne sont pas des classes, ils ne peuvent pas avoir
un autoloader configuré. CakePHP fournit deux variables de configuration pour
configurer des chemins supplémentaires pour vos ressources. Dans votre
``App/Config/app.php``, vous pouvez définir les variables::

    $config = [
        // Plus de configuration
        'App' => [
            'paths' => [
                'views' => [APP . 'View/', APP . 'View2/'],
                'plugins' => [ROOT . '/Plugin/', '/path/to/other/plugins/']
            ]
        ]
    ];

Les chemins doivent être suffixés par ``/``, ou ils ne fonctionneront pas
correctement.


.. _inflection-configuration:

Configuration de Inflection
===========================

Les conventions de nommage de CakePHP peuvent être vraiment sympas - vous
pouvez nommer votre table de base de données big\_boxes, votre model BigBox,
votre controller BigBoxesController, et tout fonctionne ensemble
automatiquement. La façon dont CakePHP sait comment lier les choses ensemble
est en infléctant les mots entre leurs formes singulière et plurielle.

Il y a des occasions (spécialement pour nos amis ne parlant pas Anglais) où
vous pouvez être dans des situations où l’inflecteur de CakePHP (la classe qui
met au pluriel, au singulier, en CamelCase, et en under\_scores) ne fonctionne
pas comme vous voulez. Si CakePHP ne reconnait pas vos Foci ou Fish, vous pouvez
dire à CakePHP vos cas spéciaux.

Chargement d’inflections personnalisées
---------------------------------------

Vous pouvez utiliser :php:meth:`Cake\Utility\Inflector::rules()` dans le fichier
``app/Config/bootstrap.php`` pour charger des inflections personnalisées:

    Inflector::rules('singular', [
        'rules' => ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'],
        'uninflected' => ['singulars'],
        'irregular' => ['spins' => 'spinor']
    ]);

ou::

    Inflector::rules('plural', [
        'irregular' => ['phylum' => 'phyla']
    ]);

Va fusionner les règles fournies dans les ensembles d’inflection définies
dans lib/Cake/Utility/Inflector.php, avec les règles ajoutées prenant le pas
sur les règles du coeur.

Classe Configure
================

.. php:namespace:: Cake\Core

.. php:class:: Configure

Malgré quelques petites choses à configurer dans CakePHP, il est parfois utile
d’avoir vos propres règles de configuration pour votre application. Dans le
passé, vous aviez peut-être défini des valeurs de configuration personnalisées
en définissant des variables ou des constantes dans certains fichiers. Faire
cela, vous force à inclure ce fichier de configuration chaque fois que vous
souhaitez utiliser ces valeurs.

La nouvelle classe Configure de CakePHP peut être utilisée pour stocker et
récupèrer des valeurs spécifiques d’exécution ou d’application. Attention,
cette classe vous permet de stocker tout dedans, puis de l’utiliser dans toute
autre partie de votre code: une tentative évidente de casser le modèle MVC avec
lequel CakePHP a été conçu. Le but principal de la classe Configure est de
garder les variables centralisées qui peuvent être partagées entre beaucoup
d’objets. Souvenez-vous d’essayer de suivre la règle “convention plutôt que
configuration” et vous ne casserez pas la structure MVC que nous avons mis en
place.

Cette classe peut être appelée de n’importe où dans l’application dans un
contexte statique::

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

    Vous pouvez utiliser ``Configure::write('debug', $bool)`` pour intervertir
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
    retournées.

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

.. php:staticmethod:: consume($key)

    Lit et supprime une clé de Configure. C'est utile quand vous voulez combiner
    la lecture et la suppresssion de valeurs en une seule opération.

    .. versionadded:: 3.0

.. php:staticmethod:: config($name, $engine)

    :param string $name: Le nom du moteur étant attaché.
    :param ConfigReaderInterface $engine: L'instance du moteur étant attachée.

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
:php:class:`Cake\\Configure\\Engine\\PhpConfig` est capable de lire les
fichiers de config de PHP, dans le même format dans lequel Configure a lu
historiquement. :php:class:`Cake\\Configure\\Engine\\IniConfig` est capable de
lire les fichiers de config ini du coeur.
Regardez la `documentation PHP <http://php.net/parse_ini_file>`_
pour plus d'informations sur les fichiers ini spécifiés. Pour utiliser un
reader de config du coeur, vous aurez besoin de l'attacher à Configure
en utilisant :php:meth:`Configure::config()`::

    use Cake\\Configure\\Engine\\PhpConfig;
    // Lire les fichiers de config à partir de app/Config
    Configure::config('default', new PhpConfig());

    // Lire les fichiers de config à partir du chemin
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

Vous pouvez avoir plusieurs readers attachés à Configure, chacun lisant
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

Sauvegarde seulement les erreurs gérant la configuration::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` peut être utilisé pour soit modifier, soit surcharger
les fichiers de configuration qui sont lisibles avec
:php:meth:`Configure::load()`

    
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
:php:interface:`Cake\\Configure\\ConfigEngineInterface`. Cette interface définit
une méthode de lecture, comme seule méthode requise. Si vous aimez vraiment les
fichiers XML, vous pouvez créer un reader de config simple Xml pour votre
application::

    // dans app/Lib/Configure/Engine/XmlConfig.php
    use Cake\\Utility\\Xml;

    class XmlConfig implements ConfigEngineInterface {
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

        // Depuis 2.3 une méthode dump() est aussi nécessaire
        public function dump($key, $data) {
            // code to dump data to file
        }
    }

Dans votre ``app/Config/bootstrap.php``, vous pouvez attacher ce reader et
l'utiliser::

    use Cake\\Configure\\Engine\\XmlConfig;
    Configure::config('xml', new XmlConfig());
    ...

    Configure::load('my_xml');

La méthode ``read()`` du reader de config, doit retourner un tableau
d'informations de configuration que la ressource nommé ``$key`` contient.

.. php:namespace:: Cake\Configure

.. php:interface:: ConfigEngineInterface

    Définit l'interface utilisée par les classes qui lisent les données de
    configuration et les stocke dans :php:class:`Configure`.

.. php:method:: read($key)

    :param string $key: Le nom de la clé ou l'identifieur à charger.

    Cette méthode devrait charger/parser les données de configuration
    identifiées par ``$key`` et retourner un tableau de données dans le
    fichier.

.. php:method:: dump($key)

    :param string $key: L'identifieur dans lequel écrire.
    :param array $data: La donnée à supprimer.

    Cette méthode doit supprimer/stocker la donnée de configuration fournie à
    une clé identifié par ``$key``.

.. php:exception:: ConfigureException

    Lancé quand les erreurs apparaissent quand le
    chargement/stockage/restauration des données de configuration.
    Les implémentations de :php:interface:`ConfigEngineInterface` devraient
    lancer cette erreur quand elles rencontrent une erreur.

Moteurs de Configuration intégrés
---------------------------------

.. php:class:: PhpConfig

    Vous permet de lire les fichiers de configuration qui sont stockés en
    fichiers PHP simples. Vous pouvez lire soit les fichiers à partir de votre
    ``app/Config``, soit des répertoires configs du plugin en utilisant la
    :term:`syntaxe de plugin`. Les fichiers **doivent** contenir une variable
    ``$config``. Un fichier de configuration d'exemple ressemblerait à cela::

        $config = [
            'debug' => 0,
            'Security' => [
                'salt' => 'its-secret'
            ],
            'App' => [
                'namespace' => 'App'
            ]
        ];

    Des fichiers sans ``$config`` entraîneraient une
    :php:exc:`ConfigureException`.

    Charger votre fichier de configuration personnalisé en insérant ce qui suit
    dans app/Config/bootstrap.php:

        Configure::load('customConfig');

.. php:class:: IniConfig

    Vous permet de lire les fichiers de configuration qui sont stockés en
    fichiers .ini simples. Les fichiers ini doivent être compatibles avec la
    fonction php ``parse_ini_file``, et bénéficie des améliorations suivantes:

    * Les valeurs séparées par des points sont étendues dans les tableaux.
    * Les valeurs de la famille des boléens comme 'on' et 'off' sont converties
      en boléens.

    Un fichier ini d'exemple ressemblerait à cela::

        debug = 0

        [Security]
        salt = its-secret

        [App]
        namespace = App

    Le fichier ini ci-dessus aboutirait aux mêmes données de configuration que
    dans l'exemple PHP du dessus. Les structures de tableau peuvent être créées
    soit à travers des valeurs séparées de point, soit des sections. Les
    sections peuvent contenir des clés séparées de point pour des imbrications
    plus profondes.

Bootstrapping CakePHP
=====================

Si vous avez des besoins de configuration supplémentaires, utilisez le fichier
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





