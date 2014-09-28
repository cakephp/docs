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
- PHP 5.4.16 ou plus.
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

    php composer.phar create-project --prefer-dist -s dev cakephp/app [app_name]

Une fois que Composer finit le téléchargement du squelette de l'application et
du coeur de la librairie de CakePHP, vous devriez avoir maintenant une
application CakePHP qui fonctionne, installée via Composer. Assurez-vous de
garder les fichiers composer.json et composer.lock avec le reste de votre code
source.

Vous devriez être maintenant capable de visiter le chemin où vous avez installé
votre application CakePHP et voir les feux de signalisations de configuration.

Rester à jour avec les derniers changements de CakePHP
------------------------------------------------------

Si vous voulez rester à jour avec les derniers changements de CakePHP, vous
pouvez ajouter ce qui suit dans le ``composer.json`` de votre application::

    "require": {
        "cakephp/cakephp": "3.0.*-dev"
    }

Où ``<branch>`` est le nom de la branche que vous voulez suivre. Chaque fois
que vous exécutez ``php composer.phar update`` vous allez recevoir les derniers
changements de la branche choisie.

Permissions
===========

CakePHP utilise le répertoire ``tmp`` pour un certain nombre d'opérations.
Les descriptions de Model, les vues mises en cache, et les informations de
session en sont juste quelques exemples.
Le répertoire ``logs`` est utilisé pour écrire les fichiers de log par le
moteur par défaut ``FileLog``.

De même, assurez-vous que les répertoires ``logs``, ``tmp`` et tous ses
sous-répertoires dans votre installation Cake sont accessible en écriture pour
l'utilisateur du serveur web. Le processus d'installation avec Composer va
rendre ``tmp`` et ses sous-dossiers accessibles en écriture pour récupérer et
lancer rapidement, mais vous pouvez mettre à jour les permissions pour une
meilleur sécurité et les garder en écriture seulement pour l'utilisateur du
serveur web.

Un problème habituel est que les répertoires ``logs`` et ``tmp`` et les sous-répertoires
doivent être accessible en écriture à la fois pour le serveur web et et pour
l'utilisateur des lignes de commande. Sur un système UNIX, si votre serveur
web est différent à partir de l'utilisateur en ligne de commande, vous pouvez
lancer les commandes suivantes juste une fois dans votre projet pour vous
assurer que les permissions sont bien configurées::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Serveur de Développement
========================

Une installation "développement" est la méthode la plus rapide pour lancer
CakePHP. Dans cet exemple, nous utiliserons la console de CakePHP pour executer
le serveur web PHP intégré qui va rendre votre application disponible sur
``http://host:port``. A partir du répertoire de l'app, lancez::

    bin/cake server

Par défaut, sans aucun argument fourni, cela va afficher votre application
sur ``http://localhost:8765/``.

Si vous avez quelque chose qui rentre en conflit avec ``localhost`` ou le
``port 8765``, vous pouvez dire à la console CakePHP de lancer le seveur web
sur un hôte spécifique et/ou un port utilisant les arguments suivants::

    bin/cake server -H 192.168.13.37 -p 5673

Cela affichera votre application sur ``http://192.168.13.37:5673/``.

C'est tout! Votre application CakePHP est ok et elle est lancée sans avoir
à configurer un serveur web.

.. warning::

    Ceci *n'a pas* vocation à être utilisé, ni ne devrait être utilisé dans un
    environnement de production. Il est juste à utiliser pour un serveur de
    développement basique.

Si vous préférez utiliser un vrai serveur web, vous pouvez déplacer votre
installation CakePHP (ainsi que les fichiers cachés) dans le
document root de votre serveur web. Vous pouvez pointer votre navigateur vers
le répertoire dans lequel vous avez déplacé les fichiers et voir votre
application en action.

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
considérons que vous avez choisi d'installer CakePHP dans /cake_install. Votre
installation de production devrait ressembler à quelque chose comme ceci dans
votre système de fichiers::

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
``DocumentRoot`` pour le domaine à::

    DocumentRoot /cake_install/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant
accéder à votre application CakePHP accessible à l'adresse
http://www.exemple.com.

A vous de jouer !
=================

Ok, regardons CakePHP en action. Selon la configuration que vous utilisez,
vous pouvez pointer votre navigateur vers http://exemple.com/ ou
http://localhost:8765/. A ce niveau, vous serez sur la page home
par défaut de CakePHP, et un message qui vous donnera le statut de la
connexion de votre base de données courante.

Félicitations ! Vous êtes prêt à :doc:`créer votre première application CakePHP
</quickstart>`.

.. _url-rewriting:

URL Rewriting
=============

Apache
------

Alors que CakePHP est construit pour travailler avec mod\_rewrite –et
habituellement il l'est– nous avons remarqué que certains utilisateurs
se battent pour obtenir un bon fonctionnement sur leurs systèmes.

Ici il y a quelques trucs que vous pourriez essayer pour que cela
fonctionne correctement. Premièrement, regardez votre fichier
httpd.conf (Assurez-vous que vous avez édité le httpd.conf du système
plutôt que celui d'un utilisateur- ou le httpd.conf d'un site spécifique).

Ces fichiers peuvent varier selon les différentes distributions et les versions
d'Apache. Vous pouvez consulter
http://wiki.apache.org/httpd/DistrosDefaultLayout pour plus d'informations.

#. Assurez-vous que l'utilisation des fichiers .htaccess est permise et que AllowOverride est défini à
   All pour le bon DocumentRoot. Vous devriez voir quelque chose comme::

       # Chaque répertoire auquel Apache a accès peut être configuré avec
       # respect pour lesquels les services et les fonctionnalités sont
       # autorisés et/ou désactivés dans ce répertoire (et ses sous-répertoires).
       #
       # Premièrement, nous configurons "par défault" pour être un ensemble
       # très restrictif de fonctionnalités.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Assurez-vous que vous avez chargé correctement mod\_rewrite. Vous devriez
   voir quelque chose comme::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Dans la plupart des systèmes, cette ligne est commentée donc vous aurez
   juste besoin de retirer le symbole # en début de ligne.

   Après avoir effectué les changements, re-démarrez Apache pour être sûr
   que les paramètres soient actifs.

   Vérifiez que vos fichiers .htaccess sont effectivement dans le bon
   répertoire.

   Cela peut arriver pendant la copie parce que certains systèmes
   d'exploitation traitent les fichiers qui commencent par '.' en caché et du
   coup ne les voient pas pour les copier.

#. Assurez-vous que votre copie de CakePHP vient de la section des
   téléchargements du site de notre dépôt Git, et a été dézippé correctement
   en vérifiant les fichiers .htaccess.

   Le répertoire app de CakePHP (sera copié dans le répertoire supérieur de votre
   application avec Bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Le répertoire webroot de CakePHP (sera copié dans le webroot de votre
   application avec Bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [QSA,L]
       </IfModule>

   Si votre site Cakephp a toujours des problèmes avec mod\_rewrite,
   essayez de modifier les paramètres pour les Hôtes Virtuels. Si vous
   êtes sur Ubuntu, modifiez le fichier /etc/apache2/sites-available/default
   (l'endroit dépend de la distribution). Dans ce fichier, assurez-vous
   que ``AllowOverride None`` a été changé en ``AllowOverride All``, donc vous
   devez avoir::

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options Indexes FollowSymLinks MultiViews
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   Si vous êtes sur Mac OSX, une autre solution est d'utiliser l'outil
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_ pour faire un Hôte
   Virtuel pour pointer vers votre dossier.

   Pour beaucoup de services d'hébergement (GoDaddy, 1and1), votre serveur web
   est en fait déjà distribué à partir d'un répertoire utilisateur qui
   utilise déjà mod\_rewrite. Si vous installez CakePHP dans un répertoire
   utilisateur (http://exemple.com/~username/cakephp/), ou toute autre
   structure d'URL qui utilise déjà mod\_rewrite, vous aurez besoin d'ajouter
   les requêtes (statements) RewriteBase aux fichiers .htaccess que CakePHP
   utilise (.htaccess, webroot/.htaccess).

   Ceci peut être ajouté dans la même section que la directive RewriteEngine,
   donc par exemple, votre fichier .htaccess dans webroot ressemblerait à ceci::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [QSA,L]
       </IfModule>

   Les détails de ces changements dépendront de votre configuration, et
   pourront inclure des choses supplémentaires qui ne sont pas liées à
   CakePHP. Merci de vous renseigner sur la documentation en ligne d'Apache
   pour plus d'informations.

#. (Optionel) Pour améliorer la configuration de production, vous devriez
   empêcher les assets invalides d'être parsés par CakePHP. Modifiez votre
   webroot .htaccess pour quelque chose comme::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [QSA,L]
       </IfModule>
       
   Ce qui est au-dessus va simplement empêcher les assets incorrects d'être
   envoyés à index.php et à la place d'afficher la page 404 de votre serveur
   web.
   
   De plus, vous pouvez créer une page HTML 404 correspondante, ou utiliser la
   page 404 de CakePHP intégrée en ajoutant une directive ``ErrorDocument``::
       
       ErrorDocument 404 /404-not-found

nginx
-----

nginx ne fait pas usage de fichiers .htaccess comme Apache et Lighttpd, il est
donc nécessaire de créer les URLs réécrites disponibles dans la configuration
du site. selon votre configuration, vous devrez modifier cela, mais à tout le
moins, vous aurez besoin de PHP fonctionnant comme une instance FastCGI::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

IIS7 (serveurs Windows)
-----------------------

IIS7 ne supporte pas nativement les fichiers .htaccess. Bien qu'il existe des
add-ons qui peuvent ajouter ce support, vous pouvez aussi importer les règles
des .htaccess dans IIS pour utiliser les rewrites natifs de CakePHP. Pour ce
faire, suivez ces étapes:

#. Utilisez `l'installeur de la plateforme Web de Microsoft
   <http://www.microsoft.com/web/downloads/platform.aspx>`_ pour installer
   l'URL
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   ou téléchargez le directement (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Créez un nouveau fichier dans votre dossier CakePHP, appelé web.config.
#. Utilisez Notepad ou tout autre éditeur XML-safe, copiez le code suivant
   dans votre nouveau fichier web.config::

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
réécriture des liens de IIS, les liens CakePHP, les CSS, le JavaScript, et
le reroutage devraient fonctionner correctement.

Je ne veux / ne peux utiliser l'URL rewriting
---------------------------------------------

Si vous ne voulez pas ou ne pouvez pas avoir mod\_rewrite (ou tout autre
module compatible) sur votre serveur, vous devrez utiliser les belles URLs
intégrées à CakePHP. Dans ``config/app.php``, décommentez la ligne qui ressemble à::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Retirez aussi ces fichiers .htaccess::

    /.htaccess
    webroot/.htaccess

Ceci affichera vos URLs comme ceci
www.example.com/index.php/controllername/actionname/param plutôt que comme ceci
www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=fr: Installation
    :keywords lang=fr: apache mod rewrite,serveur sql microsoft,tar bz2,répertoire tmp,stockage de base de données,copie d'archive,tar gz,source application,versions courantes,serveurs web,microsoft iis,copyright notices,moteur de base de données,bug fixes,lighthttpd,dépôt,améliorations,code source,cakephp,incorporate
