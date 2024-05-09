Plugins
#######

CakePHP vous permet de mettre en place une combinaison de controllers, models
et vues et de les distribuer comme un plugin d'application pré-packagé que d'autres
peuvent utiliser dans leurs applications CakePHP. Vous avez développé un module de
gestion des utilisateurs sympa, un simple blog, ou un module de service web
dans une de vos applications ? Pourquoi ne pas en faire un plugin CakePHP ?
De cette manière, vous pourrez le réutiliser dans d'autres applications et le
partager avec la communauté.

Un plugin CakePHP est séparé de l'application qui l'héberge et fournit généralement
des fonctionnalités précises qui sont packagées de manière à être réutilisées très
facilement dans d'autres applications. L'application et le plugin fonctionnent dans
leurs espaces dédiés mais partage des propriétés spécifiques à l'application (comme
les paramètres de connexion à la base de données par exemple) qui sont définies et
partagées au travers de la configuration de l'application.

Chaque plugin est censé définir son namespace de top-niveau. Par exemple
``DebugKit``. Par convention, les plugins utilisent leur nom de package pour
leur namespace. Si vous souhaitez utiliser un namespace différent, vous pouvez
configurer le namespace du plugin, quand les plugins sont chargés.

Installer un Plugin Avec Composer
=================================

Plusieurs plugins sont disponibles sur `Packagist <https://packagist.org>`_
et peuvent être installés avec ``Composer``. Pour installer DebugKit, vous
feriez ce qui suit::

    php composer.phar require cakephp/debug_kit

Ceci installe la dernière version de DebugKit et met à jour vos fichiers
**composer.json**, **composer.lock**, met à jour **vendor/cakephp-plugins.php**
et met à jour votre autoloader.

Installer un Plugin Manuellement
================================

Si le plugin que vous voulez installer n'est pas disponible sur packagist.org.
Vous pouvez cloner ou copier le code du plugin dans votre répertoire
**plugins**. Si vous voulez installer un plugin appelé ``ContactManager``, vous
créez un sous-répertoire nommé ``ContactManager``  dans **plugins**. C'est dans
ce sous-répertoire que vous mettrez les répertoires src, tests, et tous les
autres répertoires du plugin.

.. _autoloading-plugin-classes:

Autoload Manuel des Classes de Plugin
-------------------------------------

Si vous installez vos plugins par ``composer`` ou ``bake``, vous ne devriez pas
avoir besoin de configurer l'autoload de classes pour vos plugins.

Si vous installez manuellemen un plugin appelé par exemple ``MyPlugin``, vous
devrez modifier le fichier **composer.json** de votre application pour qu'il
contienne les informations suivantes:

.. code-block:: json

    {
        "autoload": {
            "psr-4": {
                "MyPlugin\\": "plugins/MyPlugin/src/"
            }
        },
        "autoload-dev": {
            "psr-4": {
                "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
            }
        }
    }

Si vous utilisez un namespace pour vos plugins, le mappage du namespace vers le
chemin devra ressembler à:

.. code-block:: json

    {
        "autoload": {
            "psr-4": {
                "AcmeCorp\\Users\\": "plugins/AcmeCorp/Users/src/",
                "AcmeCorp\\Users\\Test\\": "plugins/AcmeCorp/Users/tests/"
            }
        }
    }

De plus, vous devrez dire à Composer de rafraîchir son cache d'autoload:

.. code-block:: console

    php composer.phar dumpautoload

Charger un Plugin
=================

Si vous voulez utiliser des routes du plugin, des commandes de console, des
middlewares, des écouteurs d'événements, des templates ou des ressources du
webroot, il faudra d'abord charger le plugin.
C'est la function ``bootstrap()`` de votre application qui devra s'en charger::

    // Dans src/Application.php
    use Cake\Http\BaseApplication;
    use ContactManager\ContactManagerPlugin;

    class Application extends BaseApplication {
        public function bootstrap()
        {
            parent::bootstrap();
            // Charge la plugin ContactManager d'après son nom
            $this->addPlugin(ContactManagerPlugin::class);

            // Charger un plugin avec un namespace d'après son "nom court"
            $this->addPlugin('AcmeCorp/ContactManager');

            // Charger ne dépendance de développement qui n'existera pas en environnement de production.
            $this->addOptionalPlugin('AcmeCorp/ContactManager');
        }
    }

Si vous voulez juste utiliser des helpers, behaviors ou components d'un plugin,
vous n'avez pas besoin de le charger explicitement, bien que nous recommandions
de toujours le faire.

Il existe aussi une commande de shell bien pratique pour activer un plugin.
Exécutez cette instruction:

.. code-block:: console

    bin/cake plugin load ContactManager

Cela va mettre à jour la méthode bootstrap de votre application, ou insérer le
code ``$this->addPlugin('ContactManager');`` dans le bootstrap à votre place.

.. versionadded:: 4.1.0
    Ajout de la méthode ``addOptionalPlugin()``.

.. _plugin-configuration:

Configuration du Plugin
=======================

Les plugins proposent plusieurs *hooks* permettant à un plugin de s'injecter
lui-même aux endroits appropriés de votre application. Les *hooks* sont:

* ``bootstrap`` Utilisé pour charger les fichiers de configuration par défaut
  d'un plugin, définir des constantes et d'autres fonctions globales.
* ``routes`` Utilisé pour charger les routes pour un plugin. Il est déclenché
  après le chargement des routes de l'application.
* ``middleware`` Utilisé pour ajouter un middleware de plugin à la file de
  middlewares de l'application.
* ``console`` Utilisé pour ajouter des commandes de console à la collection des
  commandes d'une application.

En chargeant les plugins, vous pouvez configurer quels *hooks* doivent être
activés. Par défaut, tous les *hooks* sont désactivés dans les plugins qui n'ont
pas de :ref:`plugin-objects`. Les plugins du nouveau style autorisent les
auteurs de plugins à définir des valeurs par défaut, que vous pouvez configurer
dans votre application::

    // Dans Application::bootstrap()
    use ContactManager\ContactManagerPlugin;

    // Désactiver les routes pour le plugin ContactManager
    $this->addPlugin(ContactManagerPlugin::class, ['routes' => false]);

Vous pouvez configurer les *hooks* avec un tableau d'options, ou par les
méthodes fournies par les classes de plugin::

    // Dans Application::bootstrap()
    use ContactManager\ContactManagerPlugin;

    // Utiliser disable/enable pour configurer les hooks.
    $plugin = new ContactManagerPlugin();

    $plugin->disable('bootstrap');
    $plugin->enable('routes');
    $this->addPlugin($plugin);

Les objets plugins connaissent aussi leurs noms et leurs informations de
chemin::

    $plugin = new ContactManagerPlugin();

    // Obtenir le nom du plugin.
    $name = $plugin->getName();

    // Chemin vers la racine du plugin, et autres chemins.
    $path = $plugin->getPath();
    $path = $plugin->getConfigPath();
    $path = $plugin->getClassPath();

Utiliser un Plugin
==================

Vous pouvez référencer les controllers, models, components, behaviors et
helpers du plugin en préfixant le nom du plugin.

Par exemple, Supposons que vous veuillez utiliser le ContactInfoHelper du plugin
ContactManager pour afficher des informations de contact formatées dans une de
vos vues. Dans votre controller, vous pouvez utiliser ``addHelper()`` de la
façon suivante::

    $this->viewBuilder()->addHelper('ContactManager.ContactInfo');

.. note::
    Ce nom de classe séparé par un point se réfère à la :term:`syntaxe de
    plugin`.

Vous serez ensuite capable d'accéder à ``ContactInfoHelper`` comme tout autre
helper dans votre vue, comme ceci::

    echo $this->ContactInfo->address($contact);

Le splugins peuvent utiliser des models, components, behaviors et helper fournis
par l'application, ou par d'autres plugins si nécessaire::

   // Utiliser un component d'application
   $this->loadComponent('AppFlash');

   // Utiliser un behavior d'un autre plugin
   $this->addBehavior('AutrePlugin.AuditLog');

.. _plugin-create-your-own:

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
                /ContactManagerPlugin.php
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
            /templates
                /layout
            /tests
                /TestCase
                /Fixture
            /webroot

Notez le nom du dossier du plugin, '**ContactManager**'. Il est important
que ce dossier ait le même nom que le plugin.

Dans le dossier plugin, vous remarquerez qu'il ressemble beaucoup à une
application CakePHP, et c'est au fond ce que c'est. Vous n'avez à inclure
aucun de vos dossiers si vous ne les utilisez pas. Certains plugins peuvent
ne contenir qu'un Component ou un Behavior, et dans ce cas ils peuvent
carrément ne pas avoir de répertoire 'templates'.

Un plugin peut aussi avoir n'importe quels autres répertoires similaires à ceux
d'une application comme Config, Console, webroot, etc...

Créer un Plugin en utilisant Bake
---------------------------------

Le processus de création des plugins peut être grandement simplifié en utilisant
le shell bake.

Pour "cuisiner" (*bake*) un plugin, utilisez la commande suivante:

.. code-block:: console

    bin/cake bake plugin ContactManager

Vous pouvez utiliser bake pour créer des classes dans votre plugin. Par exemple,
pour générer un contrôleur de plugin, vous pouvez lancer:

.. code-block:: console

    bin/cake bake controller --plugin ContactManager Contacts

Rendez-vous au chapitre
:doc:`/bake/usage` si vous avez le moindre
problème avec l'utilisation de la ligne de commande. Assurez-vous de
re-générer votre autoloader après avoir créé votre plugin:

.. code-block:: console

    php composer.phar dumpautoload

.. _plugin-objects:

Plugin Objects
==============

Les Objets Plugin permettent à un auteur de plugin de spécifier une logique de
démarrage, de définire des *hooks* par défaut, de charger des routes, un
middleware ou des commandes de console. Les objets Plugin se trouvent dans
**src/{PluginName}Plugin.php**. Pour notre plugin ContactManager, notre classe de plugin
pourrait ressembler à::

    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Core\ContainerInterface;
    use Cake\Core\PluginApplicationInterface;
    use Cake\Console\CommandCollection;
    use Cake\Http\MiddlewareQueue;

    class ContactManagerPlugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middleware): MiddlewareQueue
        {
            // Ajouter le middleware ici.
            $middleware = parent::middleware($middleware);

            return $middleware;
        }

        public function console(CommandCollection $commands): CommandCollection
        {
            // Ajouter les commandes de console ici.
            $commands = parent::console($commands);

            return $commands;
        }

        public function bootstrap(PluginApplicationInterface $app): void
        {
            // Ajouter des constantes, charger une configuration par défaut.
            // Par défaut, cela chargera `config/bootstrap.php` dans le plugin.
            parent::bootstrap($app);
        }

        public function routes($routes): void
        {
            // Ajouter des routes.
            // Par défaut, cela chargera `config/routes.php` dans le plugin.
            parent::routes($routes);
        }

        /**
         * Enregistrer des services de container d'application.
         *
         * @param \Cake\Core\ContainerInterface $container Le Container à mettre à jour.
         * @return void
         * @link https://book.cakephp.org/4/fr/development/dependency-injection.html#dependency-injection
         */
        public function services(ContainerInterface $container): void
        {
            // Ajoutez vos services ici
        }
    }

.. _plugin-routes:

Routes de Plugins
=================

Les plugins peuvent mettre à disposition des fichiers de routes contenant leurs
propres routes. Chaque plugin peut contenir un fichier **config/routes.php**. Ce
fichier de routes peut être chargé quand le plugin est ajouté, ou dans le
fichier de routes de l'application.
Pour créer les routes du plugin ContractManager, ajoutez le code suivant dans
**plugins/ContactManager/config/routes.php**::

    <?php
    use Cake\Routing\Route\DashedRoute;

    $routes->plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->setRouteClass(DashedRoute::class);

            $routes->get('/contacts', ['controller' => 'Contacts']);
            $routes->get('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'view']);
            $routes->put('/contacts/{id}', ['controller' => 'Contacts', 'action' => 'update']);
        }
    );

Le code ci-dessus connectera les routes par défaut de votre plugin. Vous pourrez
personnaliser ce fichier plus tard avec des routes plus spécifiques.

Avant de pouvoir accéder à vos controllers, assuez-vous que le plugin est bien
chargé et que les routes du plugin le sont également. Dans votre fichier
**src/Application.php**, ajoutez la ligne suivante::

    $this->addPlugin('ContactManager', ['routes' => true]);

Vous pouvez également charger les routes du plugin dans la liste des routes de votre
application. De cette manière, vous avez plus de contrôle sur le chargement des
routes de plugin et cela vous permet d'englober les routes du plugin
dans des préfixes et des 'scopes' supplémentaires::

    $routes->scope('/', function ($routes) {
        // Connect other routes.
        $routes->scope('/backend', function ($routes) {
            $routes->loadPlugin('ContactManager');
        });
    });

Le code ci-dessus vous permettrait d'avoir des URLs de la forme ``/backend/contact-manager/contacts``.

Controllers du Plugin
=====================

Les controllers pour notre plugin ContactManager seront stockés dans
**plugins/ContactManager/src/Controller/**. Puisque notre activité principale
est la gestion des contacts, nous aurons besoin d'un ContactsController pour ce
plugin.

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

Si vous souhaitez accéder à ce que nous avons fait jusqu'ici, visitez l'URL
``/contact-manager/contacts``. Vous aurez une erreur "Missing Model"
parce que nous n'avons pas encore défini de model Contact.

Si votre application inclut le routage par défaut fourni par CakePHP, vous
serez en mesure d'accéder aux controllers de votre plugin en utilisant des URLs
comme::

    // Accéder à la route index d'un controller de plugin.
    /contact-manager/contacts

    // Toute action sur un controller de plugin.
    /contact-manager/contacts/view/1

Si votre application définit des préfixes de routage, le routage par défaut de
CakePHP connectera aussi les routes qui utilisent le modèle suivant::

    /{prefix}/{plugin}/{controller}
    /{prefix}/{plugin}/{controller}/{action}

Consultez la section sur :ref:`plugin-configuration` pour plus d'informations
sur la façon de charger les fichiers de routes spécifiques à un plugin.

Pour les plugins que vous n'avez pas créés avec bake, vous devrez aussi modifier
le fichier ``composer.json`` pour ajouter votre plugin aux classes d'autoload.
Vous pouvez le faire en suivant la documentation
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
construction des associations ou la définition de classes d'entity, vous devrez
inclure le nom du plugin avec le nom de la classe, séparés par un point. Par
exemple::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

Si vous préférez que les clés du tableau pour l'association n'aient pas le
préfixe du plugin, utilisez la syntaxe alternative::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

Vous pouvez utiliser ``Cake\ORM\Locator\LocatorAwareTrait``` pour charger les
tables de votre plugin en utilisant l'habituelle :term:`syntaxe de plugin`::

    // Les controllers utilisent déjà LocatorAwareTrait, donc vous n'avez pas besoin d'ajouter ceci.
    use Cake\ORM\Locator\LocatorAwareTrait;

    $contacts = $this->fetchTable('ContactManager.Contacts');

Vues du Plugin
==============

Les Vues se comportent exactement comme elles le font dans les applications
normales. Placez-les juste dans le bon dossier à l'intérieur du dossier
``plugins/[PluginName]/templates/``. Pour notre plugin ContactManager, nous
aurons besoin d'une vue pour notre action ``ContactsController::index()``, donc
ajoutons-y ceci::

    // plugins/ContactManager/templates/Contacts/index.php:
    <h1>Contacts</h1>
    <p>Ce qui suit est une liste triable de vos contacts</p>
    <!-- Une liste triable de contacts irait ici....-->

Les Plugins peuvent fournir leurs propres layouts. Pour ajouter des layouts de
plugin, placez vos fichiers de template dans
``plugins/[PluginName]/templates/layout``. Pour utiliser le layout d'un plugin
dans votre controller, vous pouvez faire comme ceci::

    $this->viewBuilder()->setLayout('ContactManager.admin');

Si le préfix de plugin n'est pas précisé, le fichier de vue/layout sera localisé
normalement.

.. note::

    Pour des informations sur la façon d'utiliser les elements à partir d'un
    plugin, consultez :ref:`view-elements`.

Redéfinir des Templates de Plugin depuis l'Intérieur de votre Application
-------------------------------------------------------------------------

Vous pouvez redéfinir toutes les vues du plugin à partir de l'intérieur de
votre app en utilisant des chemins spéciaux. Si vous avez un plugin appelé
'ContactManager', vous pouvez redéfinir les fichiers de template du plugin avec
une logique de vue spécifique à l'application, en créant des fichiers sur le
modèle de **templates/plugin/[Plugin]/[Controller]/[view].php**. Pour le
controller Contacts, vous pourriez écrire le fichier suivant::

    templates/plugin/ContactManager/Contacts/index.php

La création de ce fichier vous permettra de redéfinir
**plugins/ContactManager/templates/Contacts/index.php**.

Si votre plugin fait partie d'une dépendence de Composer (ex:
'LeVendor/LePlugin'), le chemin vers la vue 'index' du controller Contacts
sera::

    templates/plugin/LeVendor/LePlugin/Custom/index.php

La création de ce fichier vous permettra de redéfinir
**vendor/levendor/leplugin/templates/Custom/index.php**.

Si le plugin implémente un préfixe de routing, vous devez inclure ce préfixe
dans le template réécrit par votre application. Par exemple, si le plugin
'ContactManager' implémente un préfixe 'Admin', le chemin du template réécrit
sera::

    templates/plugin/ContactManager/Admin/ContactManager/index.php

.. _plugin-assets:

Ressources de Plugin
====================

Les ressources web du plugin (mais pas les fichiers PHP) peuvent être servies
à travers le répertoire ``webroot`` du plugin, exactement comme les ressources
de l'application principale::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

Vous pouvez mettre n'importe quel type de fichier dans tout répertoire,
exactement comme un webroot habituel.

.. warning::

    La gestion des ressources statiques comme les fichiers images, Javascript et
    CSS à travers le Dispatcher est très inefficace. Consultez
    :ref:`symlink-assets` pour plus d'informations.

Liens vers les Ressources dans des Plugins
------------------------------------------

Vous pouvez utiliser la :term:`syntaxe de plugin` pour faire un lien vers les
ressources d'un plugin en utilisant les méthodes script, image ou css de
:php:class:`~Cake\\View\\Helper\\HtmlHelper`::

    // Génère une URL de /contact_manager/css/styles.css
    echo $this->Html->css('ContactManager.styles');

    // Génère une URL de /contact_manager/js/widget.js
    echo $this->Html->script('ContactManager.widget');

    // Génère une URL de /contact_manager/img/logo.jpg
    echo $this->Html->image('ContactManager.logo');

Les ressources de plugins sont servies par défaut en utilisant le midlleware
``AssetMiddleware``. Ce n'est recommandé que pour le développement.
En production vous devriez :ref:`symlinker vos assets <symlink-assets>` pour
améliorer la performance.

Si vous n'utilisez pas les helpers, vous pouvez préfixer l'URL par /plugin-name/
pour servir une ressource du plugin . Un lien vers
'/contact_manager/js/some_file.js' renverrait la ressource
**plugins/ContactManager/webroot/js/some_file.js**.

Components, Helpers et Behaviors
================================

Un plugin peut avoir des Components, Helpers et Behaviors tout comme une
application CakePHP classique. Vous pouvez soit créer des plugins qui sont
composés seulement de Components, Helpers ou Behaviors, ce qui peut être une
bonne façon de construire des Components réutilisables qui peuvent être
facilement déplacés dans n'importe quel projet.

On construit ces components est exactement de la même manière qu'à l'intérieur
d'une application habituelle, sans aucune convention spéciale de nommage.

Pour faire référence à votre component, que ce soit depuis l'intérieur ou
l'extérieur de votre plugin, vous devez seulement préfixer le nom du component
par le nom du plugin. Par exemple::

    // Component défini dans le plugin 'ContactManager'
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // dans vos controllers:
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }

La même technique s'applique aux Helpers et aux Behaviors.

.. _plugin-commands:

Commands
========

Les plugins peuvent enregistrer leurs commandes dans le *hook* ``console()``.
Par défaut, tous les shells et commandes du plugin sont découverts
automatiquement et ajoutés à la liste des commandes de l'application. Les
commandes de plugin sont préfixées par le nom du plugin. Par exemple, la
commande ``UserCommand`` fournie par le plugin ``ContactManager`` serait
enregistrée à la fois comme ``contact_manager.user`` et ``user``. Le nom non
préfixé sera retenu par un plugin seulement s'il n'est pas déjà utilisé par
l'application ou un autre plugin.

Vous pouvez personnaliser les noms de commandes au moment de définir chaque
commande dans votre plugin::

    public function console($commands)
    {
        // Créez des commandes imbriquées
        $commands->add('bake model', ModelCommand::class);
        $commands->add('bake controller', ControllerCommand::class);

        return $commands;
    }

Tester votre Plugin
===================

Si vous testez des controllers ou si vous générez des URLs, assurez-vous que
votre plugin connecte les routes ``tests/bootstrap.php``.

Pour plus d'informations, consultez la page
:doc:`testing plugins </development/testing>`.

Publier votre Plugin
====================

Les plugins CakePHP devraient être publiés dans `le packagist
<https://packagist.org>`__. De cette façon, d'autres personnes pourraient les
utiliser comme dépendances composer. Vous pouvez aussi proposer votre plugin
dans la `liste des outils formidables pour CakePHP
<https://github.com/FriendsOfCake/awesome-cakephp>`_.

Choisissez un nom qui ait du sens pour votre nom de package. Idéalement, il
faudrait le préfixer du nom de la dépendance, au cas présent "cakephp" comme le
nom du framework. Le nom de vendor sera généralement votre nom d'utilisateur
GitHub. **n'utilisez pas** le namespace de CakePHP (cakephp) car il est réservé
aux plugins appartenant à CakePHP. Par convention, on utilise des lettres en
minuscules et des traits d'union comme séparateurs.

Donc si vous avez créé un plugin "Logging" avec votre compte GitHub "FooBar",
`foo-bar/cakephp-logging` serait un nom judicieux. Et respectivement, le plugin
"Localized" appartenant à CakePHP peut se trouver sous `cakephp/localized`.

-.. index:: vendor/cakephp-plugins.php

Fichier de Mappage de Plugin
============================

Quand vous installez des plugins par Composer, vous noterez la création de
**vendor/cakephp-plugins.php**. Ce fichier de configuration contient un mappage
des noms de plugins et de leurs chemins sur le système de fichiers. Cela rend
possible l'installation des plugins dans le répertoire standard vendor, qui est
en-dehors de l'arborescence de recherche normale. La classe ``Plugin`` utilisera
ce fichier pour localiser les plugins lorsqu'ils sont chargés avec
``addPlugin()``. Vous n'aurez généralement pas besoin d'éditer ce fichier
manuellement, dans la mesure où Composer et le package ``plugin-installer`` s'en
chargeront pour vous.

Gérer Vos Plugins avec Mixer
============================

`Mixer <https://github.com/CakeDC/mixer>`_ est un autre moyen de découvrir et
gérer les plugins dans votre application CakePHP. C'est un plugin CakePHP qui
aide à installer des plugins depuis Packagist. Il vous aide aussi à gérer les
plugins existants.

.. note::

    IMPORTANT: Ne l'utilisez pas en environnement de production.


.. meta::
    :title lang=fr: Plugins
    :keywords lang=fr: dossier plugin,configuration de la base de données,bootstrap,module de gestion,peu d'espace,connexion base de données,webroot,gestion d'utilisateur,contactmanager,tableau,config,cakephp,models,php,répertoires,blog,plugins,applications
