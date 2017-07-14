Installation
############

CakePHP est rapide et facile à installer. Les conditions minimum requises sont
un serveur web et une copie de CakePHP, c'est tout! Bien que ce manuel se
focalise principalement sur la configuration avec Apache (parce que c'est le
plus utilisé couramment), vous pouvez configurer CakePHP pour lancer une
diversité de serveurs web tels que lighttpd ou Microsoft IIS.

Conditions requises
===================

-  HTTP Server. Par exemple: Apache. mod\_rewrite est préférable, mais en
   aucun cas nécessaire.
- PHP 5.3.0 ou supérieur (La version 2.6 de CakePHP et les versions inférieures
  supportent PHP 5.2.8 et supérieur). La version 2.8.0 de CakePHP et les
  versions supérieures supportent PHP 7. Pour utiliser une version PHP
  supérieure à 7.1, vous aurez sans doute besoin d'installer mcrypt avec PECL.
  Consultez :doc:`/core-utility-libraries/security` pour plus d'informations.

Techniquement, un moteur de base de données n'est pas nécessaire, mais nous
imaginons que la plupart des applications vont en utiliser un. CakePHP supporte
une diversité de moteurs de stockage de données:

-  MySQL (4 ou plus)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    Tous les drivers intégrés requièrent PDO. Vous devez vous assurer que vous
    avez les bonnes extensions PDO installées.

Licence
=======

CakePHP est licencié sous la licence MIT. Cela signifie que vous êtes libre de
modifier, distribuer et reproduire le code source sous la condition que les
informations de copyright restent intactes. Vous êtes aussi libres d'incorporer
CakePHP dans toute code source d'application commerciale ou fermée.

Télécharger CakePHP
===================

Il y a deux façons d'obtenir une copie récente de CakePHP. Vous pouvez soit
télécharger une copie archivée de (zip/tar.gz/tar.bz2) à partir du site web
principal, soit faire un check out du code sur dépôt de git.

Pour télécharger la dernière version majeure de CakePHP, visitez le site web
principal `https://cakephp.org <https://cakephp.org>`_ et suivez le lien
"Télécharger maintenant".

Toutes les versions actuelles de CakePHP sont hébergées sur
`Github <https://github.com/cakephp/cakephp>`_. Github héberge CakePHP lui-même
ainsi que plusieurs autres plugins pour CakePHP. Les versions de CakePHP sont
disponibles sur `Téléchargements Github <https://github.com/cakephp/cakephp/tags>`_.

Sinon, vous pouvez obtenir du code frais avec tous les correctifs de bug et à
jour des améliorations de dernière minute. Celui-ci peut être accessible à
partir de GitHub en clonant le répertoire de `Github`_ ::

    git clone -b 2.x git://github.com/cakephp/cakephp.git


Permissions
===========

CakePHP utilise le répertoire ``app/tmp`` pour un certain nombre d'opérations.
Les descriptions de Model, les vues mises en cache, et les informations de
session en sont juste quelques exemples.

De même, assurez-vous que le répertoire ``app/tmp`` et tous ses sous-répertoires
dans votre installation cake sont en écriture pour l'utilisateur du serveur web.

Un problème habituel est que les répertoires app/tmp et les sous-répertoires
doivent être accessible en écriture à la fois pour le serveur web et et pour
l'utilisateur des lignes de commande. Sur un système UNIX, si votre serveur web
est différent à partir de l'utilisateur en ligne de commande, vous pouvez lancer
les commandes suivantes juste une fois dans votre projet pour vous assurer que
les permissions sont bien configurées::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

Configuration
=============

Configurer CakePHP est aussi simple que de le flanquer dans le document root de
votre serveur web, ou aussi complexe et flexible que vous le souhaitez.
Cette section couvrira les trois types principaux d'installation de CakePHP:
développement, production, et avancé.

-  Développement: Facile à mettre en oeuvre, mais les URLs de l'application
   contiennent le nom du répertoire d'installation de CakePHP et c'est moins
   sécurisé.
-  Production: Nécessite d'être habilité à configurer le Document Root du
   serveur, URLs propres, très sécurisé.
-  Avancé: Avec un peu de configuration, vous permet de placer les répertoires
   clés de CakePHP à différents endroits du système de fichiers, avec la
   possibilité de partager un seul répertoire de la librairie centrale CakePHP
   entre plusieurs applications.

Développement
=============

Une installation "développement" est la méthode la plus rapide pour lancer
CakePHP. Cet exemple vous aidera à installer une application CakePHP et à la
rendre disponible à l'adresse http://www.example.com/cake\_2\_0/. Nous
considérons pour les besoins de cet exemple que votre document root pointe sur
``/var/www/html``.

Décompressez le contenu de l'archive CakePHP dans ``/var/www/html``. Vous avez
maintenant un dossier dans votre document root, nommé d'après la version que
vous avez téléchargée (par exemple : cake\_2.0.0). Renommez ce dossier en
"cake\_2\_0". Votre installation "développement" devrait ressembler à quelque
chose comme cela dans votre système de fichiers::

    /var/www/html/
        cake_2_0/
            app/
            lib/
            plugins/
            vendors/
            .htaccess
            index.php
            README

Si votre serveur web est configuré correctement, vous devriez trouver maintenant
votre application CakePHP accessible à l'adresse
http://www.exemple.com/cake\_2\_0/.

Utiliser un CakePHP pour de multiples applications
--------------------------------------------------

Si vous développez un certain nombre d'applications il peut sembler être sensé
de partager le même coeur de CakePHP. Il y a peu de façon d'accomplir cela.
Souvent, le plus facile est d'utiliser le ``include_path`` de PHP. Pour
commencer, copiez CakePHP dans un répertoire. Pour cet exemple, nous utiliserons
``/home/mark/projects``::

    git clone -b 2.x git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

Cela copiera CakePHP dans votre répertoire ``/home/mark/projects``. Si vous ne
voulez pas utiliser git, vous pouvez télécharger un zipball et les étapes
restantes seront les mêmes. Ensuite, vous devrez localiser et modifier votre
``php.ini``.  Sur les systèmes \*nix, il se trouve souvent dans
``/etc/php.ini``, mais en utilisant ``php -i`` et en regardant 'Loaded
Configuration File' (Fichier de Configuration Chargé). Une fois que
vous avez trouvé le bon fichier ini, modifier la configuration de
``include_path`` pour inclure ``/home/mark/projects/cakephp/lib``. Un exemple
ressemblerait à cela::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

Après avoir redémarré votre serveur web, vous devriez voir les changements dans
``phpinfo()``.

.. note::

    Si vous êtes sur Windows, les chemins d'inclusion sont séparés par des
    ; au lieu de :

Une fois que vous avez configuré votre ``include_path``, vos applications
devraient être capable de trouver automatiquement CakePHP.

Production
==========

Une installation "production" est une façon plus flexible de lancer CakePHP.
Utiliser cette méthode permet à tout un domaine d'agir comme une seule
application CakePHP. Cet exemple vous aidera à installer CakePHP n'importe où
dans votre système de fichiers et à le rendre disponible à l'adresse :
http://www.exemple.com. Notez que cette installation demande d'avoir les droits
pour modifier le ``DocumentRoot`` sur le serveur web Apache.

Décompressez les contenus de l'archive CakePHP dans un répertoire de votre
choix. Pour les besoins de cet exemple, nous considérons que vous avez choisi
d'installer CakePHP dans /cake\_install. Votre installation de production
devrait ressembler à quelque chose comme ceci dans votre système de fichiers::

    /cake_install/
        app/
            webroot/ (ce répertoire est défini comme répertoire
            ``DocumentRoot``)
        lib/
        plugins/
        vendors/
        .htaccess
        index.php
        README

Les développeurs utilisant Apache devraient régler la directive
``DocumentRoot`` pour le domaine à::

    DocumentRoot /cake_install/app/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant
accéder à votre application CakePHP accessible à l'adresse :
http://www.exemple.com.

Installation avancée et URL Rewriting
=====================================

.. toctree::
    :maxdepth: 1

    installation/advanced-installation
    installation/url-rewriting

A vous de jouer!
================

Ok, voyons voir CakePHP en action. Selon la configuration que vous utilisez,
vous pouvez pointer votre navigateur vers http://exemple.com/ ou
http://exemple.com/cake\_install/. A ce niveau, vous serez sur la page home par
défaut de CakePHP, et un message qui vous donnera le statut de la connexion de
votre base de données courante.

Félicitations! Vous êtes prêt à :doc:`créer votre première application CakePHP
</getting-started>`.

Cela ne fonctionne pas? Si vous avez une erreur liée au timezone de PHP,
décommentez la ligne dans ``app/Config/core.php``::

   /**
    * Décommentez cette ligne et corrigez votre serveur de timezone pour régler
    * toute erreur liée à la date & au temps.
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighttpd,dépôt,améliorations,code source,cakephp,incorporate
