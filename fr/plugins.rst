Plugins
#######

CakePHP vous permet de mettre en place une combinaison de controllers,
models et vues et de les distribuer comme un plugin d'application
packagé que d'autres peuvent utiliser dans leurs applications CakePHP.
Vous avez un module de gestion des utilisateurs sympa, un simple blog,
ou un module de service web dans une de vos applications ? Packagez le
en plugin CakePHP afin de pouvoir la mettre dans d'autres applications.

Le principal lien entre un plugin et l'application dans laquelle il a été
installé, est la configuration de l'application (connexion à la base de
données, etc.). Autrement, il fonctionne dans son propre espace, se comportant
comme il l'aurait fait s'il était une application à part entière.

Dans CakePHP 3.0 chaque plugin définit son namespace de top-niveau. Par exemple
``DebugKit``. Par convention, les plugins utilisent leur nom de package pour
leur namespace. Si vous souhaitez utiliser un namespace différent, vous pouvez
configurer le namespace du plugin, quand les plugins sont chargés.

Installer un Plugin Avec Composer
=================================

Plusieurs plugins sont disponibles sur `Packagist <http://packagist.org>`_
et peuvent être installés avec ``Composer``. Pour installer DebugKit, vous
feriez ce qui suit::

    php composer.phar require cakephp/debug_kit

Ceci installe la dernière version de DebugKit et met à jour vos
fichiers **composer.json**, **composer.lock**, met à jour
**vendor/cakephp-plugins.php** et met à jour votre autoloader.

Si le plugin que vous voulez installer n'est pas disponible sur
packagist.org. Vous pouvez cloner ou copier le code du plugin dans votre
répertoire ``plugins``. En supposant que vous voulez installer un plugin
appelé ``ContactManager``, vous auriez un dossier dans ``plugins``
appelé ``ContactManager``. Dans ce répertoire se trouvent les View, Model,
Controller, webroot, et tous les autres répertoires du plugin.

.. index:: vendor/cakephp-plugins.php

Plugin Map File
---------------

Lorsque vous installez des plugins via Composer, vous pouvez voir que
**vendor/cakephp-plugins.php** est créé. Ce fichier de configuration contient
une carte des noms de plugin et leur chemin dans le système de fichiers.
Cela ouvre la possibilité pour un plugin d'être installé dans le dossier vendor
standard qui est à l'extérieur des dossiers de recherche standards. La classe
``Plugin`` utilisera ce fichier pour localiser les plugins lorsqu'ils sont
chargés avec ``load()`` ou ``loadAll()``. Généralement vous n'aurez pas à éditer
ce fichier à la main car Composer et le package ``plugin-installer`` le feront
pour vous.

Charger un Plugin
=================

Après avoir installé un plugin et mis à jour l'autoloader, vous devrez charger
le plugin. Vous pouvez charger les plugins un par un, ou tous d'un coup avec une
méthode unique::

    // dans config/bootstrap.php
    // Charge un Plugin unique
    Plugin::load('ContactManager');

    // Charge un plugin unique, avec un namespace personnalisé.
    Plugin::load('AcmeCorp/ContactManager');

    // Charge tous les plugins d'un coup
    Plugin::loadAll();

``loadAll()`` charge tous les plugins disponibles, vous permettant de définir
certaines configurations pour des plugins spécifiques. ``load()`` fonctionne
de la même manière, mais charge seulement les plugins que vous avez spécifié
explicitement.

.. note::

    ``Plugin::loadAll()`` ne va pas charger les plugins se trouvant dans vendor
    qui ne sont pas définis dans **vendor/cakephp-plugins.php**.

Il existe aussi une commande shell très pratique qui va activer le plugin.
Exécutez la ligne suivante:

.. code-block:: bash

    bin/cake plugin load ContactManager

Ceci va vous ajouter le bout de code ``Plugin::load('ContactManager');`` dans le
fichier bootstrap.

.. _autoloading-plugin-classes:

Autochargement des Classes du Plugin
------------------------------------

Quand on utilise ``bake`` pour la création d'un plugin ou quand on en installe
un en utilisant Composer, vous n'avez typiquement pas besoin de faire des
changements dans votre application afin que CakePHP reconnaisse les classes qui
se trouvent dedans.

Dans tous les autres cas, vous avez peut-être besoin de modifier le fichier
composer.json de votre application pour contenir les informations suivantes::

    "psr-4": {
        (...)
        "MyPlugin\\": "./plugins/MyPlugin/src",
        "MyPlugin\\Test\\": "./plugins/MyPlugin/tests"
    }

Si vous utilisez des namespaces pour vos plugins, le mapping des namespaces
vers les dossiers doit ressembler à ceci::

    "psr-4": {
        (...)
        "AcmeCorp\\Users\\": "./plugins/AcmeCorp/Users/src",
        "AcmeCorp\\Users\\Test\\": "./plugins/AcmeCorp/Users/tests"
    }

De plus, vous aurez besoin de dire à Composer de refraichir le cache de
l'autochargement::

    $ php composer.phar dumpautoload

Si vous ne pouvez pas utiliser Composer pour toute raison, vous pouvez aussi
utiliser un autochargement fallback pour votre plugin::

    Plugin::load('ContactManager', ['autoload' => true]);

.. _plugin-configuration:

Configuration du Plugin
=======================

Les méthodes ``load`` et ``loadAll`` peuvent vous aider pour la configuration et
le routing d'un plugin. Peut-être souhaiterez vous charger tous les plugins
automatiquement, en spécifiant des routes et des fichiers de bootstrap pour
certains plugins::

    // dans config/bootstrap.php

    // En utilisant loadAll()
    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

Ou vous pouvez charger les plugins individuellement::

    // Charge seulement le blog et inclut les routes
    Plugin::load('Blog', ['routes' => true]);

    // Inclut le fichier de démarrage pour la configuration/initialisation.
    Plugin::load('ContactManager', ['bootstrap' => true]);

Avec ces deux approches, vous n'avez plus à faire manuellement un ``include()``
ou un ``require()`` du fichier de configuration ou du fichier de routes du
plugin -- cela arrive automatiquement au bon moment et au bon endroit.

Vous pouvez spécifier un ensemble de valeurs par défaut pour ``loadAll()`` qui
vont s'appliquer à chaque plugin qui n'a pas de configuration spécifique.

L'exemple suivant va charger le fichier de bootstrap de tous les plugins, et
aussi les routes du plugin Blog::

    Plugin::loadAll([
        ['bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);


Notez que tous les fichiers spécifiés doivent réellement exister dans le(s)
plugin(s) configurés ou PHP vous donnera des avertissements pour chaque
fichier qu'il ne peut pas charger. Vous pouvez éviter les avertissements
potentiels en utilisant l'option ``ignoreMissing``::

    Plugin::loadAll([
        ['ignoreMissing' => true, 'bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

Par défaut le namespace du Plugin doit correspondre au nom du plugin. Par
exemple si vous avez un plugin avec un namespace de haut niveau ``Users``, vous
le chargeriez en utilisant::

    Plugin::load('User');

Si vous préférez avoir votre nom de vendor en haut niveau et avoir un namespace
comme ``AcmeCorp/Users``, alors vous devrez charger le plugin comme suit::

    Plugin::load('AcmeCorp/Users');

Cela va assurer que les noms de classe sont résolus correctement lors de
l'utilisation de la :term:`syntaxe de plugin`.

La plupart des plugins vont indiquer la procédure correcte pour les configurer
et configurer la base de données dans leur documentation. Certains plugins
nécessitent plus de configurations que les autres.

Utiliser un Plugin
==================

Vous pouvez référencer les controllers, models, components, behaviors et
helpers du plugin en préfixant le nom du plugin avant le nom de classe.

Par exemple, disons que vous voulez utiliser le ContactInfoHelper du plugin
ContactManager pour sortir de bonnes informations de contact dans une de
vos vues. Dans votre controller, le tableau ``$helpers`` pourrait ressembler
à ceci::

    public $helpers = ['ContactManager.ContactInfo'];

.. note::
    Ce nom de classe séparé par un point se réfère à la :term:`syntaxe de
    plugin`.

Vous serez ensuite capable d'accéder à ``ContactInfoHelper`` comme tout autre
helper dans votre vue, comme ceci::

    echo $this->ContactInfo->address($contact);


Créer Vos Propres Plugins
=========================

En exemple de travail, commençons par créer le plugin ContactManager
référencé ci-dessus. Pour commencer, nous allons configurer votre structure
de répertoire basique. Cela devrait ressembler à ceci::

    /src
    /plugins
        /ContactManager
            /config
            /src
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
                /Template
                    /Layout
            /tests
                /TestCase
                /Fixture
            /webroot

Notez que le nom du dossier du plugin, '**ContactManager**'. Il est important
que ce dossier ait le même nom que le plugin.

Dans le dossier plugin, vous remarquerez qu'il ressemble beaucoup à une
application CakePHP, et c'est au fond ce que c'est. Vous n'avez à inclure
aucun de vos dossiers si vous ne les utilisez pas. Certains plugins peuvent
ne contenir qu'un Component ou un Behavior, et dans certains cas, ils peuvent
carrément ne pas avoir de répertoire 'Template'.

Un plugin peut aussi avoir tous les autres répertoires que votre application a,
comme Config, Console, Lib, webroot, etc...

Créer un Plugin en utilisant Bake
---------------------------------

Le processus de création des plugins peut être grandement simplifié en utilisant
le shell bake.

Pour cuisiner un plugin, utilisez la commande suivante:

.. code-block:: bash

    bin/cake bake plugin ContactManager

Maintenant vous pouvez cuisiner en utilisant les mêmes conventions qui
s'appliquent au reste de votre app. Par exemple - baking controllers:

.. code-block:: bash

    bin/cake bake controller --plugin ContactManager Contacts

Référez-vous au chapitre
:doc:`/bake/usage` si vous avez le moindre
problème avec l'utilisation de la ligne de commande. Assurez-vous de
re-générer votre autoloader une fois que vous avez créé votre plugin:

.. code-block:: bash

    php composer.phar dumpautoload

Controllers du Plugin
=====================

Les controllers pour notre plugin ContactManager seront stockés dans
**plugins/ContactManager/src/Controller/**. Puisque la principale chose que
nous souhaitons faire est la gestion des contacts, nous aurons besoin de créer
un ContactsController pour ce plugin.

Ainsi, nous mettons notre nouveau ContactsController dans
**plugins/ContactManager/src/Controller** et il ressemblerait à cela::

    // plugins/ContactManager/src/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\AppController;

    class ContactsController extends AppController
    {

        public function index()
        {
            //...
        }
    }

Créez également le ``AppController`` si vous n'en avez pas déjà un::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

Un ``AppController`` dédié à votre plugin peut contenir la logique commune à
tous les controllers de votre plugin, et n'est pas obligatoire si vous ne
souhaitez pas en utiliser.

Avant d'accéder à vos controllers, vous devrez vous assurez que le plugin est
chargé et que les routes du plugin sont chargées. Dans votre
**config/bootstrap.php**, ajoutez ce qui suit::

    Plugin::load('ContactManager', ['routes' => true]);

Si vous utilisez ``Plugin::loadAll()``, assurez-vous que les routes sont
chargées::

    Plugin::loadAll(['routes' => true]);

Ensuite créez les routes du plugin ContactManager. Mettez ce qui suit dans
**plugins/ContactManager/config/routes.php**::

    <?php
    use Cake\Routing\Router;

    Router::plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->fallbacks('DashedRoute');
        }
    );

Ce qui est au-dessus connecte les routes par défaut pour votre plugin. Vous
pouvez personnaliser ce fichier avec des routes plus spécifiques plus tard.

Si vous souhaitez accéder à ce qu'on a fait avant, visitez
``/contact-manager/contacts``. Vous aurez une erreur "Missing Model"
parce que nous n'avons pas de model Contact encore défini.

Si votre application inclut le routage par défaut que CakePHP fournit, vous
serez capable d'accéder aux controllers de votre plugin en utilisant les URLs
comme::

    // Accéder à la route index d'un controller de plugin.
    /contact-manager/contacts

    // Toute action sur un controller de plugin.
    /contact-manager/contacts/view/1

Si votre application définit des préfixes de routage, le routage par défaut de
CakePHP va aussi connecter les routes qui utilisent le modèle suivant::

    /:prefix/:plugin/:controller
    /:prefix/:plugin/:controller/:action

Consultez la section sur :ref:`plugin-configuration` pour plus d'informations
sur la façon de charger les fichiers de routes spécifiques à un plugin.

Pour les plugins que vous n'avez pas créés avec bake, vous devrez aussi modifier
le fichier ``composer.json`` pour ajouter votre plugin aux classes d'autoload,
ceci peut être fait comme expliqué dans la documentation
:ref:`autoloading-plugin-classes`.

.. _plugin-models:

Models du Plugin
================

Les Models pour le plugin sont stockés dans **plugins/ContactManager/src/Model**.
Nous avons déjà défini un ContactsController pour ce plugin, donc créons la
table et l'entity pour ce controller::

    // plugins/ContactManager/src/Model/Entity/Contact.php:
    namespace ContactManager\Model\Entity;

    use Cake\ORM\Entity;

    class Contact extends Entity
    {
    }

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
    }

Si vous avez besoin de faire référence à un model dans votre plugin lors de la
construction des associations, ou la définition de classes d'entity, vous devrez
inclure le nom du plugin avec le nom de la classe, séparé par un point. Par
exemple::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

Si vous préférez que les clés du tableau pour l'association n'aient pas le
préfix du plugin, utilisez la syntaxe alternative::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

Vous pouvez utiliser ``TableRegistry`` pour charger les tables de votre plugin
en utilisant l'habituelle :term:`syntaxe de plugin`::

    use Cake\ORM\TableRegistry;

    $contacts = TableRegistry::get('ContactManager.Contacts');

Vues du Plugin
==============

Les Vues se comportent exactement comme elles le font dans les applications
normales. Placez-les juste dans le bon dossier à l'intérieur du dossier
``plugins/[PluginName]/Template/``. Pour notre plugin ContactManager, nous
aurons besoin d'une vue pour notre action ``ContactsController::index()``, ainsi
incluons ceci aussi::

    // plugins/ContactManager/src/Template/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Ce qui suit est une liste triable de vos contacts</p>
    <!-- Une liste triable de contacts irait ici....-->

Les Plugins peuvent fournir leurs propres layouts. Ajoutez des layouts de
plugin, dans ``plugins/[PluginName]/src/Template/Layout``. Pour utiliser le
layout d'un plugin dans votre controller, vous pouvez faire ce qui suit::

    public $layout = 'ContactManager.admin';

Si le préfix de plugin n'est pas mis, le fichier de vue/layout sera localisé
normalement.

.. note::

    Pour des informations sur la façon d'utiliser les elements à partir d'un
    plugin, regardez :ref:`view-elements`.

Redéfinition des Template de Plugin depuis l'Intérieur de votre Application
---------------------------------------------------------------------------

Vous pouvez redéfinir toutes les vues du plugin à partir de l'intérieur de
votre app en utilisant des chemins spéciaux. Si vous avez un plugin appelé
'ContactManager', vous pouvez redéfinir les fichiers de template du plugin avec
une logique de vue de l'application plus spécifique, en créant des fichiers en
utilisant le template suivant
**src/Template/plugins/[Plugin]/[Controller]/[view].ctp**. Pour le controller
Contacts, vous pouvez faire le fichier suivant::

    src/Template/plugins/src/ContactManager/Contacts/index.ctp

Créer ce fichier vous permettra de redéfinir
**plugins/ContactManager/src/Template/Contacts/index.ctp**.

.. _plugin-assets:


Assets de Plugin
================

Les assets web du plugin (mais pas les fichiers de PHP) peuvent être servis
à travers le répertoire ``webroot`` du plugin, juste comme les assets de
l'application principale::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Vous pouvez mettre tout type de fichier dans tout répertoire, juste comme
un webroot habituel.

.. warning::

    La gestion des assets static, comme les fichiers images, Javascript et CSS,
    à travers le Dispatcher est très inéfficace. Regardez :ref:`symlink-assets`
    pour plus d'informations.

Lier aux plugins
----------------

Vous pouvez utiliser la :term:`syntaxe de plugin` pour lier les assets de plugin
en utilisant les méthodes script, image ou css de
:php:class:`~Cake\\View\\Helper\\HtmlHelper`::

    // Génère une URL de /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Génère une URL de /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Génère une URL de /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Les assets de Plugin sont servis en utilisant le filtre du dispatcheur
``AssetFilter`` par défaut. C'est seulement recommandé pour le développement.
En production vous devrez :ref:`symlinker vos assets <symlink-assets>` pour
améliorer la performance.

Si vous n'utilisez pas les helpers, vous pouvez préfixer /plugin_name/ au
début de l'URL pour servir un asset du plugin . Lier avec
'/contact_manager/js/some_file.js' servirait l'asset
**plugins/ContactManager/webroot/js/some_file.js**.

Components, Helpers et Behaviors
================================

Un plugin peut avoir des Components, Helpers et Behaviors tout comme une
application CakePHP classique. Vous pouvez soit créer des plugins qui sont
composés seulement de Components, Helpers ou Behaviors ce qui peut être une
bonne façon de construire des Components réutilisables qui peuvent être
facilement déplacés dans tout projet.

Construire ces components est exactement la même chose que de les construire
à l'intérieur d'une application habituelle, avec aucune convention spéciale
de nommage.

Faire référence avec votre component, depuis l'intérieur ou l'extérieur de
votre plugin nécessite seulement que vous préfixiez le nom du plugin avant le
nom du component. Par exemple::

    // Component défini dans le plugin 'ContactManager'
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // dans vos controllers:
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }

La même technique s'applique aux Helpers et aux Behaviors.

Etendez votre Plugin
====================

Cet exemple est un bon début pour un plugin, mais il y a beaucoup plus
à faire. En règle générale, tout ce que vous pouvez faire avec votre
application, vous pouvez le faire à l'intérieur d'un plugin à la place.

Continuez, incluez certaines librairies tierces dans 'vendor', ajoutez
de nouveaux shells à la console de cake, et n'oubliez pas de créer des cas
de test ainsi les utilisateurs de votre plugin peuvent automatiquement tester
les fonctionnalités de votre plugin!

Dans notre exemple ContactManager, nous pourrions créer des actions
add/remove/edit/delete dans le ContactsController, intégrer la validation
dans le model Contact, et intégrer la fonctionnalité à laquelle on
pourrait s'attendre quand on gère ses contacts. A vous de décider ce qu'il
faut intégrer dans vos plugins. N'oubliez juste pas de partager votre code
avec la communauté afin que tout le monde puisse bénéficier de votre
component génial et réutilisable!

Publiez votre Plugin
====================

Vous pouvez ajouter votre plugin sur
`plugins.cakephp.org <http://plugins.cakephp.org>`_. De cette façon, il peut
être facilement utilisé avec Composer.
Vous pouvez aussi proposer votre plugin à la liste `awesome-cakephp <https://github.com/FriendsOfCake/awesome-cakephp>`_

Aussi, vous pouvez créer un fichier composer.json et publier votre plugin
sur `packagist.org <https://packagist.org/>`_.

Choisissez un nom de package avec une sémantique qui a du sens. Il devra
idéalement être préfixé avec la dépendance, dans ce cas "cakephp" comme le
framework.
Le nom de vendor sera habituellement votre nom d'utilisateur sous GitHub.
**N'utilisez pas** le namespace CakePHP (cakephp) puisqu'il est reservé
aux plugins appartenant à CakePHP.
La convention est d'utiliser les lettres en minuscule et les tirets en
séparateur.

Donc si vous créez un plugin "Logging" avec votre compte GitHub "FooBar", un
bon nom serait `foo-bar/cakephp-logging`.
Et le plugin "Localized" appartenant à  CakePHP peut être trouvé dans
`cakephp/localized`.

.. meta::
    :title lang=fr: Plugins
    :keywords lang=fr: dossier plugin,configuration de la base de données,bootstrap,module de gestion,peu d'espace,connexion base de données,webroot,gestion d'utilisateur,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications
