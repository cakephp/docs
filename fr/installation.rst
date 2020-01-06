Installation
############

CakePHP est rapide et facile à installer. Les conditions minimales requises sont
un serveur web et une copie de CakePHP, c'est tout! Bien que ce manuel se
focalise principalement sur la configuration avec Apache (parceque c'est la plus
simple à installer et configurer), CakePHP fonctionnera sur une diversité de
serveurs web tels que nginx, LightHTTPD ou Microsoft IIS.

Exigences
=========

- Un serveur HTTP. Par exemple: Apache. mod\_rewrite est préférable, mais en
  aucun cas nécessaire.
- PHP |minphpversion| ou plus (y compris PHP |phpversion|)
- L'extension PHP mbstring
- L'extension PHP intl
- L'extension PHP simplexml

.. note::

    Avec XAMPP et WAMP, l'extension mbstring fonctionne par défaut.

    Dans XAMPP, l'extension intl est incluse mais vous devez décommenter
    ``extension=php_intl.dll`` dans **php.ini** et redémarrer le serveur dans
    le Panneau de Contrôle de XAMPP.

    Dans WAMP, l'extension intl est "activée" par défaut mais ne fonctionne pas.
    Pour la rendre fonctionnelle, dirigez-vous dans le dossier php (par défaut)
    **C:\\wamp\\bin\\php\\php{version}**, copiez tous les fichiers qui
    ressemblent à **icu*.dll** et collez-les dans le répertoire bin d'apache
    **C:\\wamp\\bin\\apache\\apache{version}\\bin**. Ensuite redémarrez tous les
    services et tout devrait être bon.

Techniquement, un moteur de base de données n'est pas nécessaire, mais nous
imaginons que la plupart des applications vont en utiliser un. CakePHP
supporte une diversité de moteurs de stockage de données:

-  MySQL (5.5.3 ou supérieur)
-  MariaDB (5.5 ou supérieur)
-  PostgreSQL
-  Microsoft SQL Server (2008 ou supérieur)
-  SQLite 3

.. note::

    Tous les drivers intégrés requièrent PDO. Vous devez vous assurer que vous
    avez les bonnes extensions PDO installées.

Installer CakePHP
=================

Avant de commencer, vous devez vous assurer que votre version de PHP est à jour:

.. code-block:: bash

    php -v

Vous devez avoir PHP |minphpversion| (CLI) ou supérieur. Le serveur web doit
utiliser la même version de PHP que votre interface en ligne de commande.

Installer Composer
------------------

CakePHP utilise `Composer <http://getcomposer.org>`_, un outil de gestion de
dépendances comme méthode officielle supportée pour l'installation.

- Installer Composer sur Linux et macOS

  #. Exécutez le script d'installation comme décrit dans la
     `documentation officielle de Composer <https://getcomposer.org/download/>`_
     et suivez les instructions pour installer Composer.
  #. Exécutez la commande suivante pour déplacer composer.phar vers un
     répertoire qui est dans votre path::

         mv composer.phar /usr/local/bin/composer

- Installer Composer sur Windows

  Pour les systèmes Windows, vous pouvez télécharger l'installeur Windows de
  Composer `ici <https://github.com/composer/windows-setup/releases/>`__.
  D'autres instructions pour l'installeur Windows de Composer se trouvent dans
  le README `ici <https://github.com/composer/windows-setup>`__.

Créer un Projet CakePHP
-----------------------

Maintenant que vous avez téléchargé et installé Composer, imaginons que vous
souhaitiez créer une nouvelle application CakePHP dans le dossier my_app_name.
Pour ceci vous pouvez lancer la commande suivante:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app:4.* my_app_name

Ou si Composer est installé globalement:

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app:4.* my_app_name

Une fois que Composer finit le téléchargement du squelette de l'application et
du cœur de la librairie de CakePHP, vous devriez avoir une application CakePHP
fonctionnelle, installée via Composer. Assurez-vous de garder les fichiers
composer.json et composer.lock avec le reste de votre code source.

Vous pouvez maintenant naviguer vers le chemin où vous avez installé
votre application CakePHP et voir la page d'accueil par défaut. Pour changer
le contenu de cette page, modifiez: **src/Template/Pages/home.ctp**.

Bien que Composer soit la méthode d'installation recommandée, il existe des
versions pré-installées disponibles sur
`Github <https://github.com/cakephp/cakephp/tags>`__.
Ces téléchargements contiennent le squelette d'une application avec toutes
les dépendances installées.
Le ``composer.phar`` est aussi inclus donc vous avez tout ce qui est nécessaire
pour pouvoir l'utiliser.

Rester à jour avec les derniers changements de CakePHP
------------------------------------------------------

Par défaut le **composer.json** de l'application ressemble à cela::

    "require": {
        "cakephp/cakephp": "3.8.*"
    }

A chaque fois que vous exécutez ``php composer.phar update``, vous recevrez
des correctifs pour cette version mineure. Vous pouvez cependant modifier la
version de CakePHP en ``^4.0`` pour recevoir également les dernières versions
mineures stables de la branche 3.x.

Si vous voulez rester à jour avec les derniers changements non stables de
CakePHP, vous pouvez changer la version en ``dev-master`` le
**composer.json** de votre application::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

Notez que ce n'est pas recommandé, puisque votre application peut cesser de
fonctionner quand la prochaine version majeure sera déployée. De plus,
Composer ne met pas en cache les branches de développement, ce qui ralentit
les Composer installs/updates consécutifs.

Installation en utilisant Oven
------------------------------

Une autre manière rapide d'installer CakePHP est d'utiliser `Oven <https://github.com/CakeDC/oven>`_.
Il s'agit d'un simple script PHP qui vérifie si vous respectez les
recommandations systèmes, installe le squelette d'application CakePHP et met
en place l'environnement de développement.

Après l'installation, votre application CakePHP est prête !

.. note::

    IMPORTANT : Ceci n'est pas un script de déploiement. Il est destiné
    à aider les développeur à installer CakePHP pour la première fois et
    à rapidement mettre en place un environnement de développement. Les
    environnements de production devraient prendre en compte d'autres
    facteurs comme les permissions de fichiers, les configurations
    de vhost, etc.

Permissions
===========

CakePHP utilise le répertoire **tmp** pour un certain nombre d'opérations.
Les descriptions de model, les vues mises en cache, et les informations de
session en sont juste quelques exemples.
Le répertoire **logs** est utilisé pour écrire les fichiers de log par le
moteur par défaut ``FileLog``.

De même, assurez-vous que les répertoires **logs**, **tmp** et tous ses
sous-répertoires dans votre installation CakePHP sont accessibles en
écriture pour l'utilisateur du serveur web. Le processus d'installation
avec Composer va rendre **tmp** et ses sous-dossiers accessibles en écriture
pour que l'application fonctionne rapidement, mais vous pouvez mettre à jour
les permissions pour une meilleur sécurité et les garder en écriture seulement
pour l'utilisateur du serveur web.

Un problème habituel est que les répertoires **logs** et **tmp** et les
sous-répertoires doivent être accessibles en écriture à la fois pour le serveur
web et pour l'utilisateur des lignes de commande. Sur un système UNIX, si
votre utilisateur du serveur web est différent de l'utilisateur des lignes
de commande, vous pouvez lancer les commandes suivantes, une seule fois,
dans votre projet pour vous assurer que les permissions sont bien configurées:

.. code-block:: bash

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Si vous souhaitez utiliser les outils de la console CakePHP, vous devez vous
assurer que le fichier ``bin/cake`` (ou ``bin/cake.php``) est exécutable. Sur
\*nix ou macOS, vous pouvez simplement exécuter la commande suivante:

.. code-block:: bash

    chmod +x bin/cake

Sur Windows, le fichier **.bat** devrait déjà être exécutable. Si vous utilisez
Vagrant ou un autre environnement virtualisé, tous les dossiers partagés devront
être partagés avec des permissions d'exécutions (veuillez vous référer à la
documentation de votre environnement virtualisé pour savoir comment procéder).

Si, pour une quelconque raison, vous ne pouvez pas changer les permissions du
fichier ``bin/cake``, vous pouvez lancer la console CakePHP avec la commande
suivante:

.. code-block:: bash

    php bin/cake.php

Serveur de Développement
========================

Une installation de développement est la méthode la plus rapide pour lancer
CakePHP. Dans cet exemple, nous utiliserons la console de CakePHP pour exécuter
le serveur web PHP intégré qui va rendre votre application disponible sur
**http://host:port**. A partir du répertoire de l'application, lancez:

.. code-block:: bash

    bin/cake server

Par défaut, sans aucun argument fourni, cela rendra accessible votre
application sur **http://localhost:8765/**.

Si vous avez quelque chose qui rentre en conflit avec **localhost** ou le
port 8765, vous pouvez dire à la console CakePHP de démarrer le serveur web
sur un hôte et/ou un port spécifique utilisant les arguments suivants:

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

Cela affichera votre application sur **http://192.168.13.37:5673/**.

C'est tout ! Votre application CakePHP est lancée sans avoir à configurer
un serveur web.

.. note::

    Essayez ``bin/cake server -H 0.0.0.0`` si le serveur est inaccessible depuis d'autres hôtes.

.. warning::

    Ce serveur *n'a pas* vocation à être utilisé, ni ne devrait être utilisé
    dans un environnement de production. Il est juste à utiliser pour un serveur
    de développement basique.

Si vous préférez utiliser un vrai serveur web, vous pouvez déplacer votre
installation CakePHP (ainsi que les fichiers cachés) dans le
document root de votre serveur web. Vous pouvez pointer votre navigateur vers
le répertoire dans lequel vous avez déplacé les fichiers et voir votre
application en action.

Production
==========

Une installation de production est une façon plus flexible de lancer CakePHP.
Utiliser cette méthode permet à tout un domaine d'agir comme une seule
application CakePHP. Cet exemple vous aidera à installer CakePHP n'importe où
dans votre système de fichiers et à le rendre disponible à l'adresse:
http://www.exemple.com. Notez que cette installation demande d'avoir les
droits pour modifier le ``DocumentRoot`` sur le serveur web Apache.

Après avoir installé votre application en utilisant une des méthodes ci-dessus
dans un répertoire de votre choix, nous considérerons que vous avez choisi
le répertoire /cake_install, votre installation de production devrait
ressembler à quelque chose comme ceci dans votre système de fichiers::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (ce répertoire est défini comme DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Les développeurs utilisant Apache devront définir la directive
``DocumentRoot`` pour le domaine à:

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

Si votre serveur web est correctement configuré, vous devriez maintenant
pouvoir accéder à votre application CakePHP à l'adresse
http://www.exemple.com.

A vous de jouer !
=================

Ok, regardons CakePHP en action. Selon la configuration que vous utilisez,
vous pouvez pointer votre navigateur vers http://exemple.com/ ou
http://localhost:8765/. A ce niveau, vous serez sur la page d'accueil
par défaut de CakePHP, et un message qui vous donnera le statut de la
connexion de votre base de données courante.

Félicitations ! Vous êtes prêt à :doc:`créer votre première application CakePHP
</quickstart>`.

.. _url-rewriting:

Réécriture d'URL
================

Apache
------

Bien que CakePHP soit conçu pour fonctionner avec mod\_rewrite, et c'est
généralement le cas, nous avons remarqué que quelques utilisateurs ont du
mal à faire en sorte que tout se passe bien sur leurs systèmes.

Voici quelques choses que vous pourriez essayer pour que cela
fonctionne correctement. Premièrement, regardez votre fichier
httpd.conf (assurez-vous que vous avez édité le httpd.conf du système
plutôt que celui d'un utilisateur ou d'un site spécifique).

Ces fichiers peuvent varier selon les différentes distributions et les versions
d'Apache. Vous pouvez consulter
http://wiki.apache.org/httpd/DistrosDefaultLayout pour plus d'informations.

#. Assurez-vous que l'utilisation des fichiers .htaccess est permise et que
   AllowOverride est défini à All pour le bon DocumentRoot. Vous devriez voir
   quelque chose comme:

   .. code-block:: apacheconf

       # Chaque répertoire auquel Apache a accès peut être configuré en
       # fonction des services et fonctionnalités autorisés et/ou
       # désactivés dans ce répertoire (et ses sous-répertoires).
       #
       # Tout d'abord, nous configurons le "défaut" pour qu'il s'agisse
       # d'un ensemble très restrictif de fonctionnalités.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Assurez-vous que vous avez chargé correctement mod\_rewrite. Vous devriez
   voir quelque chose comme:

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Dans de nombreux systèmes, ces lignes seront commentées par défaut, vous
   devrez donc simplement supprimer le symbole # en début de ligne.

   Après avoir effectué les changements, redémarrez Apache pour être sûr
   que les paramètres soient effectifs.

   Vérifiez que vos fichiers .htaccess sont effectivement dans le bon
   répertoire.

   Vérifiez que vos fichiers .htaccess sont bien dans les bons répertoires.
   Certains systèmes d'exploitation traitent les fichiers qui commencent par
   '.' comme cachés et ne les copient donc pas.

#. Assurez-vous que votre copie de CakePHP provient de la section
   téléchargements du site ou de notre dépôt Git, et qu'elle a été
   décompressée correctement, en vérifiant les fichiers.htaccess.

   Le répertoire app de CakePHP (sera copié dans le répertoire supérieur de
   votre application par bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Le répertoire webroot de CakePHP (sera copié dans la racine web de votre
   application par bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [QSA,L]
       </IfModule>

   Si votre site CakePHP a toujours des problèmes avec mod\_rewrite,
   vous pouvez essayer de modifier les paramètres des Hôtes Virtuels. Sur
   Ubuntu, éditez le fichier **/etc/apache2/sites-available/default**
   (l'endroit dépend de la distribution). Dans ce fichier, assurez-vous
   que ``AllowOverride None`` a été changé en ``AllowOverride All``,
   donc vous avez:

   .. code-block:: apacheconf

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options FollowSymLinks
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   Sur macOS, une autre solution est d'utiliser l'outil
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_ pour créer un Hôte
   Virtuel pour pointer vers votre dossier.

   Pour de nombreux services d'hébergement (GoDaddy, 1and1), votre serveur web
   est distribué à partir d'un répertoire utilisateur qui utilise déjà
   mod\_rewrite. Si vous installez CakePHP dans un répertoire
   utilisateur (http://exemple.com/~username/cakephp/), ou toute autre
   structure URL qui utilise déjà mod\_rewrite, vous aurez devrez ajouter
   des instructions RewriteBase aux fichiers .htaccess que CakePHP
   utilise (.htaccess, webroot/.htaccess).

   Ceci peut être ajouté dans la même section que la directive RewriteEngine,
   par exemple, votre fichier .htaccess dans webroot ressemblerait à:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Les détails de ces changements dépendront de votre configuration, et
   peuvent inclure des choses supplémentaires qui ne sont pas liées à
   CakePHP. Veuillez vous référer sur la documentation en ligne d'Apache
   pour plus d'informations.

#. (Facultatif) Pour améliorer la configuration de production, vous devez
   empêcher les ressources invalides d'être analysées par CakePHP. Modifiez
   votre .htaccess dans webroot pour quelque chose comme:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   Ce qui précède empêchera l'envoi de ressources incorrectes à index.php
   et affichera à la place la page 404 de votre serveur web.

   De plus, vous pouvez créer une page HTML 404 correspondante, ou utiliser la
   page 404 de CakePHP intégrée en ajoutant une directive ``ErrorDocument``:

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found

nginx
-----

nginx n'utilise pas les fichiers .htaccess comme Apache, il est donc
nécessaire de créer ces URL réécrites dans la configuration disponible sur
le site. Ceci se trouve généralement dans
``/etc/nginx/sites-available/your_virtual_host_conf_file``. En fonction de votre
configuration, vous devrez modifier ceci, mais au minimum, vous aurez besoin de
PHP fonctionnant comme une instance FastCGI. La configuration suivante redirige
la requête vers ``webroot/index.php``:

.. code-block:: nginx

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

Un exemple de la directive server est le suivant:

.. code-block:: nginx

    server {
        listen   80;
        listen   [::]:80;
        server_name www.example.com;
        return 301 http://example.com$request_uri;
    }

    server {
        listen   80;
        listen   [::]:80;
        server_name example.com;

        root   /var/www/example.com/public/webroot;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include fastcgi_params;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_intercept_errors on;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

.. note::
    Les configurations récentes de PHP-FPM sont configurées pour écouter le
    socket unix php-fpm au lieu du port TCP 9000 sur l'adresse 127.0.0.0.1.
    Si vous avez des erreurs 502 bad gateway avec la configuration ci-dessus,
    essayez de mettre à jour ``fastcgi_pass`` pour utiliser le socket unix
    (ex: fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;) au lieu du port
    TCP.

IIS7 (serveurs Windows)
-----------------------

IIS7 ne supporte pas nativement les fichiers .htaccess. Bien qu'il existe des
add-ons qui peuvent ajouter ce support, vous pouvez également importer des
règles htaccess dans IIS pour utiliser les réécritures natives de CakePHP.
Pour ce faire, suivez les étapes suivantes:

#. Utilisez `l'installeur de la plateforme Web de Microsoft
   <http://www.microsoft.com/web/downloads/platform.aspx>`_ pour installer
   l'URL
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   ou téléchargez-le directement (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Créez un nouveau fichier appelé web.config dans votre dossier racine de CakePHP.
#. Utilisez Notepad ou tout autre éditeur XML-safe, copiez le code suivant
   dans votre nouveau fichier web.config:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Exclude direct access to webroot/*"
                      stopProcessing="true">
                        <match url="^webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="webroot/{R:1}{R:2}"
                          appendQueryString="false" />
                    </rule>
                    <rule name="Rewrite requested file/folder to index.php"
                      stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="index.php"
                          appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

Une fois que le fichier web.config est créé avec les bonnes règles de
réécriture IIS, les liens CakePHP, les CSS, le JavaScript, et
le reroutage devraient fonctionner correctement.

Je ne peux pas utiliser la réécriture d'URL
-------------------------------------------

Si vous ne voulez pas ou ne pouvez pas obtenir mod\_rewrite (ou un autre
module compatible) sur votre serveur, vous devrez utiliser les belles URLs
intégrées à CakePHP. Dans **config/app.php**, décommentez la ligne qui
ressemble à::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Supprimez ces fichiers .htaccess::

    /.htaccess
    webroot/.htaccess

Vos URLs ressembleront à
www.example.com/index.php/controllername/actionname/param plutôt qu'à
www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighthttpd,dépôt,améliorations,code source,cakephp,incorporate
