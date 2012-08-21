Installation
############

CakePHP est rapide et facile à installer. Les conditions minimum requises sont 
un serveur web et une copie de Cake, c'est tout! Bien que ce manuel se focalise 
principalement sur la configuration avec Apache (parce que c'est le cas le plus 
commun), vous pouvez configurer Cake pour lancer une diversité de serveurs web 
tels que LightHTTPD ou Microsoft IIS.

Conditions requises
===================

-  HTTP Server. Par exemple: Apache. mod\_rewrite est préférable, mais en 
   aucun cas nécessaire. 
-  PHP 5.2.8 ou plus.

Techniquement, un moteur de base de données n'est pas nécessaire, mais nous 
imaginons que la plupart des applications vont en utiliser une. CakePHP 
supporte une diversité de moteurs de stockage de données:

-  MySQL (4 ou plus)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    Les drivers intégrés requièrent tous PDO. Vous devez vous assurer que vous 
    avez les bonnes extensions PDO installées.

Licence
=======

CakePHP est licencié sous la licence MIT. Cela signifie que vous êtes libre 
de modifier, distribuer et reproduire le code source sous la condition que 
les informations de copyright restent intactes. Vous êtes aussi libre 
d'incorporer CakePHP dans toute code source d'application commerciale ou 
fermée.

Télécharger CakePHP
===================

Il y a deux façons d'obtenir une copie récente de CakePHP. Vous pouvez soit 
télécharger une copie archivée de (zip/tar.gz/tar.bz2) à partir du site web 
principal, soit faire un check out du code sur dépôt de git.

Pour télécharger la dernière version majeure de CakePHP. Visitez le site web 
principal `http://www.cakephp.org <http://www.cakephp.org>`_ et
suivez le lien "Télécharger maintenant".

Toutes les version actuelles de CakePHP sont hébérgées sur 
`Github <http://github.com/cakephp/cakephp>`_. Github héberge CakePHP
lui-même ainsi que plusieurs autres plugins pour CakePHP. Les versions de 
CakePHP sont disponibles à 
`Téléchargements Github <http://github.com/cakephp/cakephp/downloads>`_.

Sinon, vous pouvez obtenir (Alternatively you can get fresh off the press 
code??), avec tous les correctifs de bug et à jour des améliorations de 
dernière minute. Ceux-ci peuvent être accessibles à partir de github en 
clonant le répertoire de `Github`_ ::

    git clone git://github.com/cakephp/cakephp.git


Permissions
===========

CakePHP utilise le répertoire ``app/tmp`` pour un certain nombre d'opérations.
Les descriptions de Modèle, les vues mises en cache, et les informations de 
session sont juste quelques exemples.

De même, assurez-vous que le répertoire ``app/tmp`` et tous ses 
sous-répertoires dans votre installation cake sont en écriture pour 
l'utilisateur du serveur web.

Configuration
=============

Configurer CakePHP est aussi simple que de le flanquer dans le 
document root de votre serveur web, ou aussi complexe et flexible 
que vous le souhaitez.
Cette section couvrira les trois types principaux d'installation pour CakePHP: 
développement, production, and avancé.

-  Développement: Facile à mettre en oeuvre, mais les URLs de l’application 
   contiennent le nom du répertoire d’installation de CakePHP et c’est moins 
   sécurisé.
-  Production: Nécessite d’être habilité à configurer le Document Root du 
   serveur, URLs propres, très sécurisé.
-  Avancé: Avec un peu de configuration, vous permet de placer les 
   répertoires clés de CakePHP à différents endroits du système de fichiers, 
   avec la possibilité de partager un seul répertoire de la librairie 
   centrale CakePHP entre plusieurs applications.

Développement
=============

Une installation "développement" est la méthode la plus rapide pour lancer 
Cake. Cet exemple vous aidera à installer une application CakePHP et à la 
rendre disponible à http://www.example.com/cake\_2\_0/. Nous considérons pour 
les besoins de cet exemple que votre document root pointe sur ``/var/www/html``.

Décompressez le contenu de l'archive Cake dans ``/var/www/html``. Vous avez 
maintenant un dossier dans votre document root, nommé d'après la version que 
vous avez téléchargée (par exemple : cake\_2.0.0). Renommez ce dossier en 
"cake\_2\_0". Votre installation "développement" devrait ressembler à quelque 
chose comme çà dans votre système de fichiers :

-  /var/www/html

  -  /cake\_2\_0

     -  /app
     -  /lib
     -  /vendors
     -  /plugins
     -  /.htaccess
     -  /index.php
     -  /README


Si votre serveur web est configuré correctement, vous devriez trouver 
maintenant votre application Cake accessible à 
http://www.example.com/cake\_2\_0/.

Utiliser un CakePHP pour de multiples applications
--------------------------------------------------

Si vous développez un certain nombre d'applicationsn il peut sembler être sensé 
de partager le même coeur de CakePHP. Il y a peu de façon d'accomplir cela. 
Souvent, le plus facile est d'utiliser le ``include_path`` de PHP. Pour 
commencer, copiez CakePHP dans un répertoire. Pour cet exemple, nous 
utiliserons ``~/projects``::

    git clone git://github.com/cakephp/cakephp.git ~/projects/cakephp

Cela copiera CakePHP dans votre répertoire de ``~/projects``. Si vous ne 
voulez pas utiliser git, vous pouvez télécharger un zipball et les étapes 
restantes seront les mêmes. Ensuite, vous devrez localiser et modifier 
votre ``php.ini``.  Sur les systèmes \*nix, il se trouve souvent dans 
``/etc/php.ini``, mais en utilisant ``php -i`` et en regardant 'Loaded
Configuration File' (Fichier de Configuration Chargé). Une fois que 
vous avez trouvé le bon fichier ini, modifier la configuration de 
``include_path`` pour inclure ``~/projects/cakephp/lib``. Un 
exemple ressemblerait à cela::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

Après avoir redémarré votre serveur web, vous devriez voir les changements 
dans ``phpinfo()``.

.. note::

    Si vous êtes sur windows, les chemins d'inclusion sont séparés par des 
    ; au lieu de :

Une fois que vous avez configuré votre ``include_path``, vos applications 
devraient être capable de trouver automatiquement CakePHP.

Production
==========

Une installation "production" est une façon plus flexible de lancer Cake. 
Utiliser cette méthode permet à tout un domaine d'agir comme une seule 
application CakePHP. Cet exemple vous aidera à installer Cake n'importe où 
dans votre système de fichiers et à le rendre disponible à l'adresse : 
http://www.exemple.com. Notez que cette installation demande d'avoir les 
droits pour modifier le ``DocumentRoot`` sur le serveur web Apache.

Décompressez les contenus de l'archive Cake dans un répertoire de votre 
choix. Pour les besoins de cet exemple, nous considérons que vous avez choisi 
d'installer Cake dans /cake\_install. Votre installation de production devrait 
ressembler à quelque chose comme çà dans votre système de fichiers :

-  /cake\_install/
   
   -  /app
      
      -  /webroot (répertoire défini comme le ``DocumentRoot`` du serveur)

   -  /lib
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README

Les développeurs utilisant Apache devraient régler la directive 
``DocumentRoot`` pour le domaine à::

    DocumentRoot /cake_install/app/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant 
accéder à votre application Cake accessible à l'adresse : 
http://www.exemple.com.

Installation avancée et configuration de serveur spécifique
===========================================================

.. toctree::

   installation/advanced-installation

A vous de jouer!
================

Ok, regardons CakePHP en action. Selon la configuration que vous utilisez, 
vous pouvez pointer votre navigateur vers http://example.com/ ou
http://example.com/cake\_install/. A ce niveau, vous serez sur le page home 
par défaut de CakePHP, et un message qui vous donne le statut de la connection 
de votre base de données courante.

Félicitations! Vous êtes prêt à :doc:`créer votre première application CakePHP 
</getting-started>`.

Cela ne fonctionne pas? Si vous avez une erreur lié au timezone de PHP, 
décommentez une ligne dans ``app/Config/core.php``::

   <?php
   /**
    * Décommentez cette ligne et corrigez votre serveur de timezone pour régler 
    * toute erreur liée à la date & au temps.
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighthttpd,dépôt,améliorations,code source,cakephp,incorporate
