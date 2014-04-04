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

Techniquement, un moteur de base de données n'est pas nécessaire, mais nous
imaginons que la plupart des applications vont en utiliser un. CakePHP
supporte une diversité de moteurs de stockage de données:

-  MySQL (4 ou supérieur)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

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

Il y a plusieurs manières d'obtenir une copie fraiche de CakePHP. Vous pouvez
soit télécharger une copie archivée (zip/tar.gz/tar.bz2) à partir d'une version
de GitHub, soit utiliser Composer, soit cloner le squelette d'application
à partir du répertoire de Github.

Télécharger un Fichier Zip
--------------------------

Pour télécharger une version préconstruite de CakePHP, visitez le site web
principal `http://cakephp.org <http://cakephp.org>`_ et suivez le lien
"Télécharger maintenant".

Toutes les versions actuelles de CakePHP sont hébérgées sur `GitHub`_. GitHub
héberge à la fois CakePHP ainsi que plusieurs autres plugins pour CakePHP. Les
versions de CakePHP sont disponibles en
`GitHub tags <https://github.com/cakephp/cakephp/releases>`_.

Installer avec Composer
-----------------------

`Composer <http://getcomposer.org>`_ est un outil de gestion de dépendance
pour PHP 5.3+. Il résoud plusieurs des problèmes que l'installeur PEAR a, et
simplifie la gestion de versions multiples des librairies.

Tout d'abord, vous aurez besoin de télécharger et d'installer Composer si vous
ne l'avez pas encore fait. Si vous avez cURL installé, c'est aussi facile que de
lancer ce qui suit::

    curl -s https://getcomposer.org/installer | php

Maintenant que vous avez téléchargé et installé Composer, vous pouvez obtenir
une nouvelle application CakePHP en lançant::

    php composer.phar create-project -s dev cakephp/app

Une fois que Composer finit le téléchargement du squelette de l'application et
du coeur de la librairie de CakePHP, vous devriez avoir maintenant une
application CakePHP qui fonctionne, installée via composer. Assure-vous de
garder les fichiers composer.json et composer.lock avec le reste de votre code
source.

Installer avec Git & GitHub
---------------------------

Dans CakePHP 3.0, `le squelette d'application <https://github.com/cakephp/app>`_
et la `librairie du coeur de <https://github.com/cakephp/cakephp>`_ ont été
séparés en deux répertoires séparés. Vous pouvez forker et/ou cloner
le projet du squelette de l'application en utilisant Git + GitHub. Cela va
aussi vous permettre de facilement contribuer aux changements de nouveau
vers le squelette de l'application.

Une fois que vous avez cloné le squelette d'application, vous aurez besoin de
cloner la librairie de coeur de CakePHP dans ``vendor/cakephp/cakephp``. Après
avoir cloné la librairie du coeur de CakePHP, décommentez la section en
utilisant ``Cake\Core\ClassLoader`` dans ``App/Config/bootstrap.php``, et
copiez ``App/Config/app.default.php`` dans ``App/Config/app.php``.

Vous devriez être maintenant capable de visiter le chemin où vous avez installé
votre application CakePHP et voir les feux de signalisations de configuration.

Garder à jour avec les changements du dernier CakePHP
-----------------------------------------------------

Si vous voulez garder à jour avec les derniers changements de CakePHP, vous
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
sous-répertoires dans votre installation cake sont en écriture pour
l'utilisateur du serveur web.

Configuration
=============

Configurer CakePHP est aussi simple que de le flanquer dans le
document root de votre serveur web, ou aussi complexe et flexible
que vous le souhaitez.
Cette section couvrira les deux types principaux d'installation de CakePHP:
développement, production.

-  Développement: Facile à mettre en oeuvre, mais les URLs de l'application
   contiennent le nom du répertoire d'installation de CakePHP et c'est moins
   sécurisé.
-  Production: Nécessite d'être habilité à configurer le Document Root du
   serveur, URLs propres, très sécurisé.

Développement
=============

Une installation "développement" est la méthode la plus rapide pour lancer
CakePHP. Cet exemple vous aidera à installer une application CakePHP et à la
rendre disponible à l'adresse http://www.example.com/cake3/. Nous
considérons pour les besoins de cet exemple que votre document root pointe sur
``/var/www/html``.

Après avoir installé votre application en utilisant une des méthodes ci-dessus
dans ``/var/www/html``. Vous avez maintenant un dossier dans votre document
root, nommé d'après la version que vous avez téléchargée (par exemple : cake3).
Renommez ce dossier en cake3. Votre installation "développement" devrait
ressembler à quelque chose comme cela dans votre système de fichiers::

    /var/www/html/
        cake3/
            App/
            Plugin/
            Test/
            tmp/
            vendor/
            webroot/
            .gitignore
            .htaccess
            .travis.yml
            README.md
            composer.json
            index.php
            phpunit.xml.dist

Si votre serveur web est configuré correctement, vous devriez trouver
maintenant votre application CakePHP accessible à l'adresse
http://www.example.com/cake3/.

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
        tmp/
        vendor/
        webroot/ (ce répertoire est défini comme DocumentRoot)
        .htaccess
        index.php
        README.md

Les développeurs utilisant Apache devraient régler la directive
``DocumentRoot`` pour le domaine à::

    DocumentRoot /cake_install/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant
accéder à votre application CakePHP accessible à l'adresse :
http://www.exemple.com.

Utiliser un CakePHP pour de multiples applications
--------------------------------------------------

Il peut y avoir des situations où vous souhaitez placer les répertoires
de CakePHP dans différents endroits du système de fichier. Ceci est peut-être
dû à une restriction de domaine partagé. Cette section décrit comment étendre
vos répertoires CakePHP à travers votre système de fichier.

Tout d'abord, réalisez qu'il y a trois parties principales dans une application
CakePHP:

#. La librairie du coeur de CakePHP, dans /vendor/cakephp/cakephp.
#. Votre code d'application, dans /App.
#. Le webroot de l'application, usuellement dans /App/webroot.

Chacun de ces répertoires peut être localisé partout dans votre système de
fichier, avec l'exception du webroot, ce qui nécessite d'être accessible par
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

A vous de jouer!
================

Ok, voyons voir CakePHP en action. Selon la configuration que vous utilisez,
vous pouvez pointer votre navigateur vers http://exemple.com/ ou
http://exemple.com/cake3/. A ce niveau, vous serez sur la page home
par défaut de CakePHP, et un message qui vous donnera le statut de la
connexion de votre base de données courante.

Félicitations! Vous êtes prêt à :doc:`créer votre première application CakePHP
</getting-started>`.


.. _Github: http://github.com/cakephp/cakephp
.. _composer: http://getcomposer.com

.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighthttpd,dépôt,améliorations,code source,cakephp,incorporate
