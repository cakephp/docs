URL Rewriting
#############

Apache et mod\_rewrite (et .htaccess)
=====================================

Alors que CakePHP est construit pour travailler avec mod\_rewrite –et
habituellement il l'est– nous avons remarqué que certains utilisateurs
se battent pour obtenir un bon fonctionnement sur leurs systèmes.

Ici il y a quelques trucs que vous pourriez essayer pour que cela
fonctionne correctement. Premièrement, regardez votre fichier
httpd.conf (Assurez-vous que vous avez édité le httpd.conf du système
plutôt que celui d'un utilisateur- ou le httpd.conf d'un site spécifique).

Ces fichiers peuvent varier selon les différentes distributions et les versions
d'apache. Vous pouvez allez voir
http://wiki.apache.org/httpd/DistrosDefaultLayout pour plus d'informations.

#. Assurez-vous qu'un .htaccess est permis et que AllowOverride est défini à
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

   Dans la plupart des systèmes, ceux-ci vont être commentés donc vous aurez
   juste besoin de retirer les symboles # en début de ligne.

   Après que vous avez fait des changements, re-démarrez Apache pour être sûr
   que les paramètres soient actifs.

   Vérifiez que vos fichiers .htaccess sont effectivement dans le bon
   répertoire.

   Cela peut arriver pendant la copie parce que certains systèmes
   d'exploitation traitent les fichiers qui commencent par '.' en caché et du
   coup ne les voient pas pour les copier.

#. Assurez-vous que votre copie de CakePHP vient de la section des
   téléchargements du site de notre dépôt Git, et a été dézippé correctement
   en vérifiant les fichiers .htaccess.

   Le répertoire root de CakePHP (a besoin d'être copié dans votre document,
   cela redirige tout vers votre app CakePHP)::
   
       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

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
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
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
   utilise (/.htaccess, /app/.htaccess, /app/webroot/.htaccess).

   Ceci peut être ajouté dans la même section que la directive RewriteEngine,
   donc par exemple, votre fichier .htaccess dans webroot ressemblerait à ceci::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
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
           RewriteCond %{REQUEST_URI} !^/(app/webroot/)?(img|css|js)/(.*)$
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>
       
   Ce qui est au-dessus va simplement empêcher les assets incorrects d'être
   envoyés à index.php et à la place d'afficher la page 404 de votre serveur
   web.
   
   De plus, vous pouvez créer une page HTML 404 correspondante, ou utiliser la
   page 404 de CakePHP intégrée en ajoutant une directive ``ErrorDocument``::
       
       ErrorDocument 404 /404-not-found

De belles URLs sur nginx
========================

nginx est un serveur populaire qui, comme Lighttpd, utilise moins
de ressources système. Son inconvénient est qu'il ne fait pas usage de
fichiers .htaccess comme Apache et Lighttpd, il est donc nécessaire de créer
les URLs réécrites disponibles dans la configuration du site. selon
votre configuration, vous devrez modifier cela, mais à tout le moins,
vous aurez besoin de PHP fonctionnant comme une instance FastCGI.

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;
    
        # root directive should be global
        root   /var/www/example.com/public/app/webroot/;
        index  index.php;
        
        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            include /etc/nginx/fastcgi_params;
            try_files $uri =404;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

Rewrites d'URL sur IIS7 (serveurs Windows)
==========================================

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
   dans votre nouveau fichier web.config...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Rewrite requests to test.php"
                      stopProcessing="true">
                        <match url="^test.php(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="app/webroot/test.php{R:1}" />
                    </rule>
                    <rule name="Exclude direct access to app/webroot/*"
                      stopProcessing="true">
                        <match url="^app/webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="app/webroot/{R:1}{R:2}"
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

URL-Rewriting sur lighttpd
==========================

Lighttpd ne supporte pas les fonctions .htaccess, par conséquent vous pouvez
retirer tous les fichiers .htaccess. Dans la configuration lighttpd,
assurez-vous d'activer "mod_rewrite". Ajoutez une ligne:

::

    url.rewrite-if-not-file =(
        "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
    )

Je ne veux / ne peux utiliser l'URL rewriting
=============================================

Si vous ne voulez ou ne pouvez pas utiliser l'URL rewriting sur votre serveur
web, référez-vous à la section
:ref:`core configuration<core-configuration-baseurl>`.



.. meta::
    :title lang=fr: URL Rewriting
    :keywords lang=fr: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
