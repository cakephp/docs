La Classe Plugin
################

.. php:namespace:: Cake\Core

.. php:class:: Plugin

La classe Plugin est responsable de la localisation des ressources et de la
gestion des chemins des plugins.

Localiser les Plugins
=====================

.. php:staticmethod:: path(string $plugin)

Les plugins peuvent être localisés avec Plugin. Utiliser
``Plugin::path('DebugKit');`` vous donne par exemple le chemin complet vers le
plugin DebugKit::

    $path = Plugin::path('DebugKit');

Vérifier si un Plugin est Chargé
================================

Vous pouvez vérifier dynamiquement dans votre code si un plugin a été chargé::

    $isLoaded = Plugin::isLoaded('DebugKit');

Utilisez ``Plugin::loaded()`` si vous voulez avoir la liste de tous les plugins
actuellement chargés.

Trouver les Chemins vers les Namespaces
=======================================

.. php:staticmethod:: classPath(string $plugin)

Utilisée pour obtenir la localisation des fichiers de classes du plugin::

    $path = App::classPath('DebugKit');

Trouver les Chers vers les Ressources
=====================================

.. php:staticmethod:: templatePath(string $plugin)

La méthode renvoie le chemin vers les templates du plugin::

    $path = Plugin::templatePath('DebugKit');

Même chose pour le chemin vers la configuration::

    $path = Plugin::configPath('DebugKit');

.. meta::
    :title lang=fr: Classe Plugin
    :keywords lang=fr: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
