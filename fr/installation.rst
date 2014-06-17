Installation
############

CakePHP est rapide et facile à installer. Les conditions minimum requises sont
un serveur web et une copie de CakePHP, c'est tout! Bien que ce manuel se
focalise principalement sur la configuration avec Apache (parce que c'est le
plus utilisé couramment), vous pouvez configurer CakePHP pour lancer une
diversité de serveurs web tels que LightHTTPD ou Microsoft IIS.

Conditions requises
===================

- HTTP Server. Par exemple: Apache. mod\_rewrite est préférable, mais en
  aucun cas nécessaire.
- PHP 5.4.19 ou plus.
- extension mbstring
- extension mcrypt
- extension intl

Techniquement, un moteur de base de données n'est pas nécessaire, mais nous
imaginons que la plupart des applications vont en utiliser un. CakePHP
supporte une diversité de moteurs de stockage de données:

-  MySQL (5.1.10 ou supérieur)
-  PostgreSQL
-  Microsoft SQL Server (2008 ou supérieur)
-  SQLite 3

.. note::

    Tous les drivers intégrés requièrent PDO. Vous devez vous assurer que vous
    avez les bonnes extensions PDO installées.

Licence
=======

CakePHP est licencié sous la
`license MIT <http://www.opensource.org/licenses/mit-license.php>`_.
Cela signifie que vous êtes libre de modifier, distribuer et reproduire le code
source sous la condition que les informations de copyright restent intactes.
Vous êtes aussi libres d'incorporer CakePHP dans toute code source
d'application commerciale ou fermée.

Installer CakePHP
=================

CakePHP utilise `Composer <http://getcomposer.org>`_, un outil de gestion de
dépendance pour PHP 5.3+, comme la méthode officielle pour l'installation.

Tout d'abord, vous aurez besoin de télécharger et d'installer Composer si vous
ne l'avez pas encore fait. Si vous avez cURL installé, c'est aussi facile que de
lancer ce qui suit::

    curl -s https://getcomposer.org/installer | php

Ou vous pouvez télécharger ``composer.phar`` à partir de son
`site <https://getcomposer.org/download/>`_.

Pour les systèmes Windows, vous pouvez télécharger l'installeur Windows de
Composer `ici <https://github.com/composer/windows-setup/releases/>`_. D'autres
instructions pour l'installeur Windows de Composer se trouvent dans le README
`ici <https://github.com/composer/windows-setup>`_.

Maintenant que vous avez téléchargé et installé Composer, vous pouvez obtenir
une nouvelle application CakePHP en lançant::

    php composer.phar create-project -s dev cakephp/app

Une fois que Composer finit le téléchargement du squelette de l'application et
du coeur de la librairie de CakePHP, vous devriez avoir maintenant une
application CakePHP qui fonctionne, installée via composer. Assurez-vous de
garder les fichiers composer.json et composer.lock avec le reste de votre code
source.

Vous devriez être maintenant capable de visiter le chemin où vous avez installé
votre application CakePHP et voir les feux de signalisations de configuration.

Rester à jour avec les derniers changements de CakePHP
-----------------------------------------------------

Si vous voulez rester à jour avec les derniers changements de CakePHP, vous
pouvez ajouter ce qui suit dans le ``composer.json`` de votre application::

    "require": {
        "cakephp/cakephp": "dev-<branch>"
    }

Où ``<branch>`` est le nom de la branche que vous voulez suivre. Chaque fois
que vous exécutez ``php composer.phar update`` vous allez recevoir les derniers
changements de la branche choisie.

Permissions
===========

CakePHP utilise le répertoire ``tmp`` pour un certain nombre d'opérations.
Les descriptions de Model, les vues mises en cache, et les informations de
session en sont juste quelques exemples.

De même, assurez-vous que le répertoire ``tmp`` et tous ses
sous-répertoires dans votre installation Cake sont accessible en écriture pour
l'utilisateur du serveur web. Le processus d'installation avec Composer va
rendre ``tmp`` et ses sous-dossiers accessibles en écriture pour récupérer et
lancer rapidement, mais vous pouvez mettre à jour les permissions pour une
meilleur sécurité et les garder en écriture seulement pour l'utilisateur du
serveur web.

Un problème habituel est que les répertoires app/tmp et les sous-répertoires
doivent être accessible en écriture à la fois pour le serveur web et et pour
l'utilisateur des lignes de commande. Sur un système UNIX, si votre serveur
web est différent à partir de l'utilisateur en ligne de commande, vous pouvez
lancer les commandes suivantes juste une fois dans votre projet pour vous
assurer que les permissions sont bien configurées::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

Configuration
=============

Configurer CakePHP est aussi simple que de le placer dans le
document root de votre serveur web, ou aussi complexe et flexible
que vous le souhaitez.
Cette section couvrira les deux types principaux d'installation de CakePHP:
développement et production.

-  Développement: Facile à mettre en oeuvre, mais les URLs de l'application
   contiennent le nom du répertoire d'installation de CakePHP et c'est moins
   sécurisé.
-  Production: Nécessite d'être habilité à configurer le Document Root du
   serveur, URLs propres, très sécurisé.

Développement
=============

Une installation "développement" est la méthode la plus rapide pour lancer
CakePHP. Dans cet exemple, nous utiliserons la console de CakePHP pour executer
le serveur web PHP intégré qui va rendre votre application disponible sur
``http://host:port``. A partir du répertoire ``App``, lancez::

    Console/cake server

Par défaut, sans aucun argument fourni, cela va afficher votre application
sur ``http://localhost:8765/``.

Si vous avez quelque chose qui rentre en conflit avec ``localhost`` ou le ``port 8765``, vous
pouvez dire à la console CakePHP de lancer le seveur web sur un hôte spécifique
et/ou un port utilisant les arguments suivants::

    Console/cake server -H 192.168.13.37 -p 5673

Cela affichera votre application sur ``http://192.168.13.37:5673/``. 

C'est tout! Votre application CakePHP est ok et elle est lancée sans avoir
à configurer un serveur web.

.. warning::
    
    Ceci n'a pas vocation à être utilisé, ni ne devrait être utilisé dans un
    environnement de production.

Production
==========

Une installation "production" est une façon plus flexible de lancer CakePHP.
Utiliser cette méthode permet à tout un domaine d'agir comme une seule
application CakePHP. Cet exemple vous aidera à installer CakePHP n'importe où
dans votre système de fichiers et à le rendre disponible à l'adresse :
http://www.exemple.com. Notez que cette installation demande d'avoir les
droits pour modifier le ``DocumentRoot`` sur le serveur web Apache.

Après avoir installé votre application en utilisant une des méthodes ci-dessus
dans un répertoire de votre choix. Pour les besoins de cet exemple, nous
considérons que vous avez choisi d'installer CakePHP dans /cake\_install. Votre
installation de production devrait ressembler à quelque chose comme ceci dans
votre système de fichiers::

    /cake_install/
        App/
        Plugin/
        Test/
        tmp/
        vendor/
        webroot/ (ce répertoire est défini comme DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        README.md
        composer.json
        index.php
        phpunit.xml.dist

Les développeurs utilisant Apache devraient régler la directive
``DocumentRoot`` pour le domaine à::

    DocumentRoot /cake_install/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant
accéder à votre application CakePHP accessible à l'adresse
http://www.exemple.com.

Utiliser un CakePHP pour plusieurs applications
-----------------------------------------------

Il peut y avoir des situations où vous souhaitez placer les répertoires
de CakePHP dans différents endroits du système de fichier. Ceci est peut-être
dû à une restriction de domaine partagé. Cette section décrit comment étendre
vos répertoires CakePHP à travers votre système de fichier.

Tout d'abord, prenez conscience qu'il y a trois parties principales dans une application
CakePHP:

#. La librairie du coeur de CakePHP, dans /vendor/cakephp/cakephp.
#. Votre code d'application, dans /App.
#. Le webroot de l'application, usuellement dans /App/webroot.

Chacun de ces répertoires peut être localisé partout dans votre système de
fichiers, avec l'exception du webroot, ce qui nécessite d'être accessible par
votre serveur web. Vous pouvez même déplacer le dossier webroot en dehors
du dossier App tant que vous dites à CakePHP où vous l'avez mis.

Pour configurer votre installation CakePHP, vous aurez besoin de faire des
changements aux fichiers suivants.


-  /App/webroot/index.php
-  /App/webroot/test.php (si vous utilisez la fonctionnalité
   :doc:`Testing </development/testing>`.)

Il y a trois constantes que vous aurez besoin de modifier: ``ROOT``,
``APP_DIR``, et ``CAKE_CORE_INCLUDE_PATH``.


- ``ROOT`` devrait être défini comme le chemin du répertoire qui contient votre
  dossier app.
- ``APP_DIR`` devrait être défini comme le nom (de base) de votre dossier app.
- ``CAKE_CORE_INCLUDE_PATH`` devrait être défini comme le chemin de votre
  dossier de librairies CakePHP. Généralement vous aurez besoin de changer cela
  si vous utilisez chacune des méthodes d'
  :doc:`installation suggérées </installation>`.

Faisons un exemple pour que vous voyiez à quoi peut ressembler une installation
avancée en pratique. Imaginez que je veuille configurer CakePHP pour fonctionner
comme ce qui suit:

- Le répertoire webroot de mon application sera /var/www/mysite/.
- Le répertoire app de mon application sera /home/me/myapp.
- CakePHP est installé via Composer.

Etant donnée le type de configuration, j'aurai besoin de modifier mon fichier
webroot/index.php (qui finira dans /var/www/mysite/index.php, dans cet exemple)
pour ressembler à ce qui suit::

    // App/Config/paths.php (partial, comments removed)
    define('ROOT', '/home/me');
    define('APP_DIR', 'myapp');
    define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');

URL Rewriting
=============

.. toctree::
    :maxdepth: 1

    installation/url-rewriting

A vous de jouer !
=================

Ok, regardons CakePHP en action. Selon la configuration que vous utilisez,
vous pouvez pointer votre navigateur vers http://exemple.com/ ou
http://localhost:8765/. A ce niveau, vous serez sur la page home
par défaut de CakePHP, et un message qui vous donnera le statut de la
connexion de votre base de données courante.

Félicitations ! Vous êtes prêt à :doc:`créer votre première application CakePHP
</getting-started>`.


.. _Github: http://github.com/cakephp/cakephp
.. _composer: http://getcomposer.com

.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighthttpd,dépôt,améliorations,code source,cakephp,incorporate
