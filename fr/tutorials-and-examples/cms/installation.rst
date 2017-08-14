Tutoriel d'un système de gestion de contenu
###########################################

Ce tutoriel vous accompagnera dans la création d'une application de type
:abbr:`CMS (Content Management System)`. Pour commencer, nous installerons
CakePHP, créerons notre base de données et construirons un système simple
de gestion d'articles.

Voici les pré-requis:

#. Un serveur de base de données. Nous utiliserons MySQL dans ce tutoriel. Vous
   avez besoin de connaître assez de SQL pour créer une base de données et exécuter
   quelques requêtes SQL que nous fournirons dans ce tutoriel. CakePHP se chargera
   de construire les requêtes nécessaires pour votre application. Puisque nous allons
   utiliser MySQL, assurez-vous que ``pdo_mysql`` est bien activé dans PHP.
#. Les connaissances de base en PHP.

Avant de commencer, assurez-vous que votre version de PHP est à jour :

.. code-block:: bash

    php -v

Vous devez avoir au minimum PHP |minphpversion| installé (en CLI). Votre version
serveur de PHP doit au moins être aussi |minphpversion| et, dans l'idéal, devrait
également être la même que pour votre version en ligne de commande (CLI).

Récupérer CakePHP
=================

La manière la plus simple d'installer CakePHP est d'utiliser Composer. Composer
est une manière simple d'installer CakePHP via votre terminal. Premièrement, vous
devez télécharger et installer Composer si vous ne l'avez pas déjà fait. Si vous
avez cURL installé, il suffit simplement de lancer la commande suivante :

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

Ou vous pouvez télécharger ``composer.phar`` depuis le
`site de Composer <https://getcomposer.org/download/>`_.

Ensuite, tapez la commande suivante dans votre terminal pour installer le squelette
d'application CakePHP dans le dossier **cms** du dossier courant :

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app cms

Si vous avez téléchargé et utilisé `l'Installer de Composer pour Windows
<https://getcomposer.org/Composer-Setup.exe>`_, tapez la commande suivante dans
votre terminal depuis le dossier d'installation (par exemple C:\\wamp\\www\\dev\\cakephp3) :

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app cms

Utiliser Composer a l'avantage d'exécuter automatiquement certaines tâches
importantes d'installation, comme définir les bonnes permissions sur les dossiers
et créer votre fichier **config/app.php**.

Il existe d'autres moyens d'installer CakePHP. Si vous ne pouvez pas (ou ne
voulez pas) utiliser Composer, rendez-vous dans la section :doc:`/installation`.

Quelque soit la manière de télécharger et installer CakePHP, une fois que la mise
en place est terminée, votre dossier d'installation devrait ressembler à ceci::

    /cms
      /bin
      /config
      /logs
      /plugins
      /src
      /tests
      /tmp
      /vendor
      /webroot
      .editorconfig
      .gitignore
      .htaccess
      .travis.yml
      composer.json
      index.php
      phpunit.xml.dist
      README.md

C'est le bon moment pour en apprendre d'avantage sur le fonctionnement de la
structure des dossiers de CakePHP : rendez-vous dans la section :doc:`/intro/cakephp-folder-structure`
pour en savoir plus.

Vérifier l'installation
=======================

Il est possible de vérifier que l'installation est terminée en vous rendant sur
la page d'accueil. Avant de faire ça, vous allez devoir lancer le serveur de
développement :

.. code-block:: bash

    cd /path/to/our/app

    bin/cake server

.. note::

    Pour Windows, la commande doit être ``bin\cake server`` (notez le backslash).

Cela démarrera le serveur embarqué de PHP sur le port 8765. Ouvrez
**http://localhost:8765** dans votre navigateur pour voir la page d'accueil.
Tous les éléments de la liste devront être validés sauf le point indiquant si
CakePHP arrive à se connecter à la base de données. Si d'autres points ne sont
pas validés, vous avez peut-être besoin d'installer des extensions PHP supplémentaires
ou définir les bonnes permissions sur certains dossiers.

Ensuite, nous allons créer notre :doc:`base de données et créer notre premier model <database>`.
