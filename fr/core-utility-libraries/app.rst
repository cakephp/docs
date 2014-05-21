Classe App
##########

.. php:namespace:: Cake\Core

.. php:class:: App

La classe App est responsable de la localisation des ressources et de la
gestion des chemins.

Trouver les Classes
===================

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

    Cette méthode est utilisée pour trouver les noms de classe dans CakePHP.
    Elle retrouve les noms courts que CakePHP utilise et retourne le nom de
    classe entier.

        // Retourne un nom de classe court avec le namespace + suffix
        App::classname('Auth', 'Controller/Component', 'Component');
        // Returns Cake\Controller\Component\AuthComponent

        // Retourne un nom de plugin.
        App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
        // Retourne DebugKit\Controller\Component\ToolbarComponent

        // Noms contenant \ seront retournés non modifiés.
        App::classname('App\Cache\ComboCache');
        // Returns App\Cache\ComboCache

    Quand vous retrouvez les classes, le namespace ``App`` sera essayé, et si
    la classe n'existe pas, le namespace ``Cake`` sera tenté. Si les deux noms
    de classe n'existent pas, ``false`` sera retourné.

Trouver les Chemins vers les Namespaces
=======================================

.. php:staticmethod:: path(string $package, string $plugin = null)

    :rtype: array

    Utilisée pour obtenir les localisations pour les chemins basés sur les
    conventions::

        // Obtenir le chemin vers Controller/ dans votre application
        App::path('Controller');

    Ceci peut être fait pour tous les namespaces qui font parti de votre
    application. Vous pouvez aussi récupérer les chemins pour un plugin::

        // retourne les chemins de component dans DebugKit
        App::path('Component', 'DebugKit');

    ``App::path()`` va seulement retourner le chemin par défaut, et ne sera pas
    capable de fournir toutes les informations sur les chemins supplémentaires
    pour lesquels l'autoloader est configuré.

.. php:staticmethod:: core(string $package)

    :rtype: array

    Utilisé pour trouver le chemin vers un package dans CakePHP::

        // Obtenir le chemin des moteurs de Cache.
        App::core('Cache/Engine');


Trouver les Objets que CakePHP connaît
======================================

.. php:staticmethod:: objects(string $type, mixed $path = null, boolean $cache = true)

    :rtype: mixed Retourne un tableau d'objets du type donné ou false si incorrect.

    Vous pouvez trouver les objets que App connaît en utilisant
    ``App::objects('Controller')`` par exemple pour trouver les controllers
    d'application que App connaît.

    Exemple d'utilisation::

        //retourne ['DebugKit', 'Blog', 'User'];
        App::objects('plugin');

        // retourne ['PagesController', 'BlogController'];
        App::objects('Controller');

    Vous pouvez aussi chercher seulement dans les objets d'un plugin en
    utilisant la syntaxe de notation de plugin.::

        // retourne ['MyPluginPost', 'MyPluginComment'];
        App::objects('MyPlugin.Model');


Localiser les Plugins
=====================

.. php:staticmethod:: pluginPath(string $plugin)

    :rtype: string

    Les plugins peuvent aussi être localisés avec App. En utilisant
    ``App::pluginPath('DebugKit');`` par exemple, cela vous donnera le chemin
    complet vers le plugin DebugKit::

        $path = App::pluginPath('DebugKit');

Localiser les Themes
====================

.. php:staticmethod:: themePath(string $theme)

    :rtype: string

    Les Themes peuvent être trouvés avec ``App::themePath('purple');``, cela
    donne le chemin complet vers le theme `purple`.

Surcharger les Classes dans CakePHP
===================================

Vous pouvez surcharger presque toutes les classes dans le framework, les
exceptions sont les classes :php:class:`Cake\\Core\\App` et
:php:class:`Cake\\Core\\Configure`. Lorque vous souhaitez faire ce genre de
surcharge, ajoutez simplement votre classe à votre dossier app/Lib
en copiant la structure interne du framework. Quelques exemples à suivre

* Pour surcharger la classe :php:class:`Dispatcher`, créez
  ``App/Routing/Dispatcher.php``
* Pour surcharger la classe :php:class:`CakeRoute`, créez
  ``App/Routing/Route/CakeRoute.php``

Lorque vous chargez les fichiers remplacés, les App/fichiers vont être chargés
à la place des classes intégrés au coeur.

Charger les Fichiers de Vendor
==============================

Idéalement les fichiers de vendor devront être auto-chargés avec ``Composer``,
si vous avez des fichiers de vendor qui ne peuvent pas être auto-chargés ou
installés avec Composer, vous devrez utiliser
``require``pour les charger.

Si vous ne pouvez pas installer une librairie avec Composer, il est mieux
d'installer chaque librairie dans un répertoire en suivant les conventions de
Composer de ``vendor/$author/$package``.
Si vous avez une librairie appelée AcmeLib, vous pouvez l'installer dans
``/vendor/Acme/AcmeLib``. En supposant qu'il n'utilise pas des noms de classe
compatible avec PSR-0, vous pouvez auto-charger les classes qu'il contient en
utilisant ``classmap`` dans le ``composer.json`` de votre application::

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

Si votre librairie de vendor n'utilise pas de classes, et fournit plutôt des
fonctions, vous pouvez configurer Composer pour charger ces fichiers au début
de chaque requête en utilisant la stratégie d'auto-chargement ``files``::

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

Après avoir configuré les librairies de vendor, vous devrez regénérer
l'autoloader de votre application en utilisant::

    $ php composer.phar dump-autoload

Si vous n'utilisez pas Composer dans votre application, vous devrez manuellement
charger toutes les librairies de vendor vous-même.


Les Méthodes Init/Load/Shutdown de App
======================================

.. php:staticmethod:: init( )

    :rtype: void

    Initialise le cache pour App, enregistre une fonction shutdown.

.. php:staticmethod:: shutdown( )

    :rtype: void

    Destructeur d'objet. Ecrit le fichier de cache si les changements ont été
    faits dans ``$_objects``.

.. meta::
    :title lang=fr: Classe App
    :keywords lang=fr: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
