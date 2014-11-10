Comment Installer des Plugins
#############################

Il y a quatre moyens d'installer un plugin CakePHP:

- Par l'intermédiaire de Composer
- Manuellement
- Par sous-module Git
- Par clonage Git

Mais n'oubliez pas d':ref:`enable-plugins` après-ceci.

Manuellement
============

Pour installer un plugin manuellement, vous avez juste à déposer le dossier du
plugin dans votre répertoire app/Plugin/. Si vous installez un plugin nommé
'ContactManager', vous devez alors avoir un dossier nommé 'ContactManager' dans
le répertoire app/Plugin/ à l'intérieur duquel sont les View, Model, Controller,
webroot et tout autre répertoire de votre plugin.

Composer
========

Si vous n'êtes pas familier avec le gestionnaire de dépendances nommé Composer,
prenez le temps de lire la
`documentation de Composer <https://getcomposer.org/doc/00-intro.md>`_.

Pour installer le plugin imaginaire 'ContactManager' grâce à Composer,
ajoutez le en tant que dépendance dans le ``composer.json`` de votre projet::

    {
        "require": {
            "cakephp/contact-manager": "1.2.*"
        }
    }

Si le plugin CakePHP est de type ``cakephp-plugin``, comme il se devrait,
Composer l'installera à l'intérieur de votre répertoire /Plugin, au lieu
du répertoire vendors habituel.

.. note::

    Utilisez "require-dev" si vous  souhaitez uniquement inclure le plugin
    pour votre environnement de développement.

Sinon, vous pouvez utiliser l'
`outil CLI de Composer <https://getcomposer.org/doc/03-cli.md#require>`_
pour déclarer (et installer) le plugin::

    php composer.phar require cakephp/contact-manager:1.2.*

Clonage Git
===========

Si le plugin que vous souhaitez installer est hébergé en tant que dépôt Git,
vous pouvez également le cloner. Imaginons que le plugin 'ContactManager' est
hébergé sur Github. Vous pouvez le cloner en exécutant la ligne de commande
suivante depuis votre répertoire app/Plugin/::

    git clone git://github.com/cakephp/contact-manager.git ContactManager

Sous-module Git
===============

Si le plugin que vous souhaitez installer est hébergé en tant que dépôt Git
mais que vous ne voulez pas le cloner, vous pouvez également l'intégrer en tant
que sous-module. Exécutez la ligne de commande suivante depuis votre
répertoire app::

    git submodule add git://github.com/cakephp/contact-manager.git Plugin/ContactManager
    git submodule init
    git submodule update


.. _enable-plugins:

Activer les Plugins
===================

Les plugins nécessitent d'être chargés manuellement dans
``app/Config/bootstrap.php``.

Vous pouvez au choix les charger un par un ou bien tous en une seule fois::

    CakePlugin::loadAll(); // Charge tous les plugins d'un coup
    CakePlugin::load('ContactManager'); // Charge un seul plugin

``loadAll()`` charge tous les plugins disponibles, et vous laisse la possibilité
de régler certain paramètres pour des plugins spécifiques. ``load()`` fonctionne
de façon similaire mais charge uniquement le plugin spécifié explicitement.

.. meta::
    :title lang=fr: Installer un plugin
    :keywords lang=fr: plugin folder, install, installer, dossier plugin, git, zip, tar, submodule, manual, clone, contactmanager, enable