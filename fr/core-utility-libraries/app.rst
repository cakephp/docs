Classe App
##########

.. php:class:: App

La classe App est responsable de la gestion des chemins, la classe de 
localisation et la classe de chargement.
Assurez-vous que vous suivez les :ref:`file-and-classname-conventions`.

Packages
========

CakePHP est organisé autour de l'idée de packages, chaque classe appartient à 
un package ou dossier où d'autres classes se trouvent. Vous pouvez configurer 
chaque localisation de package dans votre application en utilisant 
``App::build('APackage/SubPackage', $paths)`` pour informer le framework où 
chaque classe doit être chargée. Presque toute classe dans le framework 
CakePHP peut être échangée avec une des votres compatible. Si vous souhaitez 
utiliser votre propre classe à la place des classes que le framework fournit, 
ajoutez seulement la classe à vos dossiers libs émulant la localisation du 
répertoire à partir duquel CakePHP s'attend à le trouver.

Par exemple, si vous voulez utiliser votre propre classe HttpSocket, mettez la 
sous::

    app/Lib/Network/Http/HttpSocket.php

Une fois ceci fait, cette App va charger votre fichier à la place du fichier 
de l'intérieur de CakePHP.

Chargement des classes
======================

.. php:staticmethod:: uses(string $class, string $package)

    :rtype: void

    Les classes sont chargées toutes seules dans CakePHP, cependant avant que 
    l'autoloader puisse trouver vos classes que vous avez besoin de dire à App, 
    où il peut trouver les fichiers. En disant à App dans quel package une 
    classe peut être trouvée, il peut bien situer le fichier et le charger 
    la première fois qu'une classe est utilisée.

    Quelques exemples pour les types courants de classes sont:

    Controller
        ``App::uses('PostsController', 'Controller');``
    Component
        ``App::uses('AuthComponent', 'Controller/Component');``
    Model
        ``App::uses('MyModel', 'Model');``
    Behaviors
        ``App::uses('TreeBehavior', 'Model/Behavior');``
    Views
        ``App::uses('ThemeView', 'View');``
    Helpers
        ``App::uses('HtmlHelper', 'View/Helper');``
    Libs
        ``App::uses('PaymentProcessor', 'Lib');``
    Vendors
        ``App::uses('Textile', 'Vendor');``
    Utility
        ``App::uses('String', 'Utility');``

    Donc au fond, le deuxième paramètre devrait simplement correspondre 
    au chemin du dossier de la classe de fichier dans core ou app.

.. note::

    Charger des vendors signifie généralement que vous chargez des packages 
    qui ne suivent pas les conventions. Pour la plupart des packages vendor, 
    l'utilisation de ``App::import()`` est recommandée.

Chargement des fichiers à partir des plugins
--------------------------------------------

Le chargement des classes dans les plugins fonctionnnent un peu de la 
même façon que le chargement des classes app et des classes du coeur sauf 
que vous devez spécifier le plugin à partir du quel vous chargez::

    // Charge la classe Comment dans app/Plugin/PluginName/Model/Comment.php
    App::uses('Comment', 'PluginName.Model');

    // Charge la classe class CommentComponent dans app/Plugin/PluginName/Controller/Component/CommentComponent.php
    App::uses('CommentComponent', 'PluginName.Controller/Component');


Trouver des chemins vers les packages en utilisant App::path()
==============================================================

.. php:staticmethod:: path(string $package, string $plugin = null)

    :rtype: array

    Utilisé pour lire les informations sur les chemins stockés::

        // retourne les chemins de model dans votre application
        App::path('Model');

    Ceci peut être fait pour tous les packages qui font parti de votre 
    application. VOus pouvez aussi récupérer des chemins pour un plugin::

        // retourne les chemins de component dans DebugKit
        App::path('Component', 'DebugKit');

.. php:staticmethod:: paths( )

    :rtype: array

    Récupère tous les chemins chargés actuellement à partir de App. Utile pour 
    inspecter ou stocker tous les chemins que App connait. Pour un chemin 
    vers un package spécifique, utilisez :php:meth:`App::path()`

.. php:staticmethod:: core(string $package)

    :rtype: array

    Utilisé pour trouver le chemin vers un package à l'intérieur de CakePHP::

        // Récupère le chemin vers les moteurs de Cache.
        App::core('Cache/Engine');

.. php:staticmethod:: location(string $className)

    :rtype: string

    Retourne le nom du package d'où une classe a été localisée.

Ajoutez des chemins dans App pour trouver des packages dans
===========================================================

.. php:staticmethod:: build(array $paths = array(), mixed $mode = App::PREPEND)

    :rtype: void

    Définit chaque localisaiton de package dans le système de fichier. Vous 
    pouvez configurer des chemins de recherche multiples pour chaque package, 
    ceux-ci vont être utilisés pour rechercher les fichiers, un dossier à la 
    fois, dans l'ordre spécifié. Tous les chemins devraient être terminés par 
    un séparateur de répertoire.

    Ajouter des chemins de controller supplémentaires pourraient par exemple 
    modifier où CakePHP regarde pour les controllers. Cela vous permet de 
    séparer votre application à travers le système de fichier.

    Utilisation::

        //Va configurer un nouveau chemin de recherche pour le package Model
        App::build(array('Model' => array('/a/full/path/to/models/'))); 

        //Va configurer le chemin comme le seule chemin valide pour chercher 
        les models
        App::build(array('Model' => array('/path/to/models/')), App::RESET); 

        //Va configurer les chemins de recherche multiple pour les helpers
        App::build(array('View/Helper' => array('/path/to/helpers/', '/another/path/'))); 


    Si reset est défini à true, tous les plugins chargés seront oubliés et ils 
    devront être rechargés.

    Exemples::

        App::build(array('controllers' => array('/full/path/to/controllers'))) 
        //devient 
        App::build(array('Controller' => array('/full/path/to/Controller')))

        App::build(array('helpers' => array('/full/path/to/views/helpers'))) 
        //devient 
        App::build(array('View/Helper' => array('/full/path/to/View/Helper')))

    .. versionchanged:: 2.0
        ``App::build()`` will not merge app paths with core paths anymore.


.. _app-build-register:

Ajoutez de nouveaux packages vers une application
-------------------------------------------------

``App::build()`` peut être utilisé pour ajouter de nouvelles localisations 
de package. Ceci est utile quand vous voulez ajouter de nouveaux packages 
de niveaux supérieurs ou, des sous-packages à votre application::

    App::build(array(
        'Service' => array('%s' . 'Service' . DS)
    ), App::REGISTER);

Le ``%s`` dans les packages nouvellement enregistrés, sera remplacé par 
le chemin :php:const:`APP`. Vous devez inclure un trailing ``/`` dans les 
packages enregistrés. Une fois que les packages sont enregistrés, vous 
pouvez utiliser ``App::build()`` pour ajouter/préfixer/remettre les chemins 
comme dans tout autre package.

.. versionchanged:: 2.1
    Registering packages was added in 2.1

Trouver quels objets CakePHP connaît
====================================

.. php:staticmethod:: objects(string $type, mixed $path = null, boolean $cache = true)

    :rtype: mixed Returns an array of objects of the given type or false if incorrect.

    Vous pouvez trouver quels objets App connaît en utilisant 
    ``App::objects('Controller')`` par exemple pour trouver quels controllers 
    de l'application App connaît.

    Exemple d'utilisation::

        //retourne array('DebugKit', 'Blog', 'User');
        App::objects('plugin');

        //retourne array('PagesController', 'BlogController');
        App::objects('Controller');

    Vous pouvez aussi chercher seulement dans les objets de plugin en utilisant 
    la syntaxe de plugin avec les points.::

        // retourne array('MyPluginPost', 'MyPluginComment');
        App::objects('MyPlugin.Model');

    .. versionchanged:: 2.0

    1. Retourne ``array()`` au lieu de false pour les résultats vides ou les types invalides
    2. Ne retourne plus les objets du coeur, ``App::objects('core')`` retournera ``array()``.
    3. Retourne le nom de classe complète

Localiser les plugins
=====================

.. php:staticmethod:: pluginPath(string $plugin)

    :rtype: string

    Les Plugins peuvent être localisés aussi avec App. En utilisant 
    ``App::pluginPath('DebugKit');`` par exemple, vous donnera le chemin 
    complet vers le plugin DebugKit::

        $path = App::pluginPath('DebugKit');

Localiser les thèmes
====================

.. php:staticmethod:: themePath(string $theme)

    :rtype: string

    Les Thèmes peuvent être trouvés ``App::themePath('purple');``, vous 
    donnerait le chemin complet vers le thème `purple`.

.. _app-import:

Inclure les fichiers avec App::import()
=======================================

.. php:staticmethod:: import(mixed $type = null, string $name = null, mixed $parent = true, array $search = array(), string $file = null, boolean $return = false)

    :rtype: boolean

    Au premier coup d'oeil, ``App::import`` a l'air compliqué, cependant pour 
    la plupart des utilisations, seuls 2 arguments sont nécéssaires.

    .. note::

        Cette méthode est équivalente à faire un ``require`` sur le fichier.
        Il est important de réaliser que la classe doit ensuite être 
        initialisée.

    ::

        // La même chose que require('Controller/UsersController.php');
        App::import('Controller', 'Users');
        
        // Nous avons besoin de charger la classe
        $Users = new UsersController;
        
        // Si nous voulons que les associations de model, les components, etc 
        soient chargées
        $Users->constructClasses();

    **Toutes les classes qui sont chargées dans le passé utilisant 
    App::import('Core', $class) devront être chargées en utilisant App::uses() 
    se référant au bon package. Ce changement a fourni de grands gains de 
    performances au framework.**

    .. versionchanged:: 2.0

    * Cette méthode ne regarde plus les classes de façon récursive, elle 
      utilise strictement les valeurs pour les chemins définis dans 
      :php:meth:`App::build()`
    * Elle ne sera pas capable de charger ``App::import('Component', 'Component')``, 
      utilisez ``App::uses('Component', 'Controller');``.
    * Utilisez ``App::import('Lib', 'CoreClass');`` pour charger les classes 
      du coeur n'est plus possible.
    * Importer un fichier non existant, fournir un mauvais type ou un mauvais 
      nom de package, ou des valeurs null pour les paramètres ``$name`` et 
      ``$file`` entraînera une valeur de retour à false.
    * ``App::import('Core', 'CoreClass')`` n'est plus supporté, utilisez 
      :php:meth:`App::uses()` à la place et laissez la classe d'autochargement 
      faire le reste.
    * Charger des fichiers de Chargement ne regarde pas de façon récursive dans 
      le dossier vendors, il ne convertira plus aussi le fichier avec des 
      underscores comme il le faisait dans le passé.

Ecraser les classes dans CakePHP
================================

Vous pouvez écraser preques toute classe dans le framework, les exceptions sont 
les classes :php:class:`App` et :php:class:`Configure`. Quelque soit le moment 
où vous souhaitez effectuer l'écrasement, ajoutez seulement votre classe dans 
votre dossier app/Lib en imitant la structure interne du framework. Quelques 
exemples suivants

* Pour écraser la classe :php:class:`Dispatcher`, créer ``app/Lib/Routing/Dispatcher.php``
* Pour écraser la classe :php:class:`CakeRoute`, créer ``app/Lib/Routing/Route/CakeRoute.php``
* Pour écraser la classe :php:class:`Model`, créer ``app/Lib/Model/Model.php``

Quand vous chargez les fichiers remplacés, les fichiers de app/Lib seront 
chargés à la place des classes intégrés au coeur.

Charger des fichiers Vendor
===========================

Vous pouvez utiliser ``App::uses()`` pour charger des classes provenant des 
répertoires vendors. Elle suit les mêmes conventions que pour le chargement 
des autres fichiers::

    // Charge la classe Geshi dans app/Vendor/Geshi.php
    App::uses('Geshi', 'Vendor');

Pour charger les classes se trouvant dans des sous-répertoires, vous devrez 
ajouter ces chemins avec ``App::build()``::

    // Charge la classe ClassInSomePackage dans app/Vendor/SomePackage/ClassInSomePackage.php
    App::build(array('Vendor' => array(APP . 'Vendor' . DS . 'SomePackage')));
    App::uses('ClassInSomePackage', 'Vendor');

Vos fichiers vendor ne suivent peut-être pas les conventions, ont une classe 
qui diffère du nom de fichier ou ne contiennent pas de classes. Vous pouvez 
charger ces fichiers en utilisant ``App::import()``. Les exemples siuvants 
montrent comment charger les fichiers de vendor à partir d'un certain nombre 
de structures de chemin. Ces fichiers vendor pourrraient être localisés dans 
n'importe quel dossier vendor.

Pour charger **app/Vendor/geshi.php**::

    App::import('Vendor', 'geshi');

.. note::

    Le nom du fichier geshi doit être en minuscule puisque Cake ne le trouvera 
    pas sinon.

Pour charger **app/Vendor/flickr/flickr.php**::

    App::import('Vendor', 'flickr/flickr');

Pour charger **app/Vendor/some.name.php**::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

Pour charger **app/Vendor/services/well.named.php**::

    App::import('Vendor', 'WellNamed', array('file' => 'services' . DS . 'well.named.php'));

Cela ne ferait pas de différence si vos fichiers vendor étaient à l'intérieur 
du répertoire /vendors. Cake le trouvera automatiquement.

Pour charger **vendors/vendorName/libFile.php**::

    App::import('Vendor', 'aUniqueIdentifier', array('file' => 'vendorName' .DS . 'libFile.php'));

Les Méthodes Init/Load/Shutdown de App
======================================

.. php:staticmethod:: init( )

    :rtype: void

    Initialise le cache pour App, enregistre une fonction shutdown (fermeture).

.. php:staticmethod:: load(string $className)

    :rtype: boolean

    Méthode pour la gestion automatique des classes. Elle cherchera chaque 
    package de classe défini en utilisant :php:meth:`App::uses()` et avec 
    cette information, elle va transformer le nom du package en un chemin 
    complet pour charger la classe. Le nom de fichier pour chaque classe 
    devrait suivre le nom de classe. Par exemple, si une classe est nommée 
    ``MyCustomClass`` le nom de fichier devrait être ``MyCustomClass.php``

.. php:staticmethod:: shutdown( )

    :rtype: void

    Desctructeur de l'Objet. Ecrit le fichier de cache si les changements ont 
    été faits à ``$_map``.


.. meta::
    :title lang=fr: Classe App
    :keywords lang=fr: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
