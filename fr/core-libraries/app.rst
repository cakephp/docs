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
classe entier::

    // Retourne un nom de classe court avec le namespace + suffixe
    App::classname('Auth', 'Controller/Component', 'Component');
    // Retourne Cake\Controller\Component\AuthComponent

    // Retourne un nom de plugin.
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Retourne DebugKit\Controller\Component\ToolbarComponent

    // Noms contenant \ seront retournés non modifiés.
    App::classname('App\Cache\ComboCache');
    // Retourne App\Cache\ComboCache

Quand vous retrouvez les classes, le namespace ``App`` sera essayé, et si
la classe n'existe pas, le namespace ``Cake`` sera tenté. Si les deux noms
de classe n'existent pas, ``false`` sera retourné.

Trouver les Chemins vers les Namespaces
=======================================

.. php:staticmethod:: path(string $package, string $plugin = null)

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

Utilisée pour trouver le chemin vers un package dans CakePHP::

    // Obtenir le chemin des moteurs de Cache.
    App::core('Cache/Engine');

Localiser les Plugins
=====================

.. php:staticmethod:: Plugin::path(string $plugin)

Les plugins peuvent être localisés avec Plugin. En utilisant
``Plugin::path('DebugKit');`` par exemple, cela vous donnera le chemin
complet vers le plugin DebugKit::

    $path = Plugin::path('DebugKit');

Localiser les Themes
====================

Puisque les themes sont les plugins, vous pouvez utiliser les méthodes
ci-dessus pour récupérer le chemin vers un theme.

Charger les Fichiers de Vendor
==============================

Idéalement les fichiers de vendor devront être auto-chargés avec ``Composer``,
si vous avez des fichiers de vendor qui ne peuvent pas être auto-chargés ou
installés avec Composer, vous devrez utiliser ``require`` pour les charger.

Si vous ne pouvez pas installer une librairie avec Composer, il est mieux
d'installer chaque librairie dans un répertoire en suivant les conventions de
Composer de ``vendor/$author/$package``.
Si vous avez une librairie appelée AcmeLib, vous pouvez l'installer dans
``vendor/Acme/AcmeLib``. En supposant qu'il n'utilise pas des noms de classe
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

.. meta::
    :title lang=fr: Classe App
    :keywords lang=fr: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
