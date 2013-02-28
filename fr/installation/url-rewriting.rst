URL Rewriting
#############

Apache et mod\_rewrite (et .htaccess)
=====================================

Alors que CakePHP est construit pour travailler avec mod\_rewrite –et
habituellement il l'est– nous avons remarqué que certains utilisateurs 
se battent pour obtenir un bon fonctionnement sur leurs systèmes.

Ici il y a quelques trucs que vous pourriez essayer pour que cela
fonctionne correctement. Premièrement, regardez votre fichier
httpd.conf (Assurez vous que vous avez éditer le httpd.conf du système 
plutôt que celui d'un utilisateur- ou le httpd.conf d'un site spécifique ).


#. Assurez vous qu'un .htaccess est permis et que AllowOverride est défini à 
   All pour le DocumentRoot correct. Vous devriez voir quelque chose comme::

       # Chaque répertoire auquel Apache a accès peut être configuré avec
       # respect pour lesquels les services et les fonctionnalités sont 
       # autorisés et/ou désactivés dans ce répertoire (et ses sous-répertoires).
       #
       # Premièrement, nous configurons "par défault" pour être un ensemble 
       # très restrictif de fonctionnalités
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

   Dans la plupart des systèmes, ceux-ci vont être commentés (en étant 
   précédé par un #) par défaut, donc vous aurez juste besoin de retirer 
   les symboles # du début.

   Après que vous ayez fait des changements, re-démarrez Apache pour être sur 
   que les paramètres soient actifs.

   Vérifiez que vos fichiers .htaccess sont effectivement dans le bon 
   répertoire.

   Cela peut arriver pendant la copie parce que certains systèmes 
   d'exploitation traitent les fichiers qui commencent par '.' en caché et du 
   coup ne les voient pas pour les copier.

#. Assurez-vous que votre copie de CakePHP vient de la section des 
   téléchargements du site de notre dépôt GIT, et a été dézippé correctement 
   en vérifiant les fichiers .htaccess.

   Le répertoire root de Cake (a besoin d'être copié dans votre document, cela 
   redirige tout vers votre app Cake)::
   
       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   Le répertoire app de Cake (sera copié dans le répertoire supérieur de votre 
   application avec Bake)::
   
       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Le répertoire webroot de Cake (sera copié dans le webroot de votre 
   application avec Bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
       </IfModule>

   Si votre site cakephp a toujours des problèmes avec mod\_rewrite, 
   essayez de modifier les paramètres pour les virtualhosts. Si vous 
   êtes sur ubuntu, modifiez le fichier /etc/apache2/sites-available/default 
   (l'endroit dépend de la distribution). Dans ce fichier, assurez-vous 
   que ``AllowOverride None`` a changé en ``AllowOverride All``, donc vous 
   avez::

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
   virtualhostx pour faire un hôte virtuel pour pointer vers votre dossier.

   Pour beaucoup de services s'hébergement (GoDaddy, 1and1), votre serveur web 
   est en fait est déjà distribué à partir d'un répertoire utilisateur qui 
   utilise déjà mod\_rewrite. Si vous installez CakePHP dans un répertoire 
   utiisateur (http://exemple.com/~username/cakephp/), ou tout autre structure 
   d'URL qui utilise déjà mod\_rewrite, vous aurez besoin d'ajouter les 
   requêtes (statements) RewriteBase aux fichiers .htaccess que CakePHP 
   utilise (/.htaccess, /app/.htaccess, /app/webroot/.htaccess).

   Ceci peut être ajouté à la même section avec la directive RewriteEngine, 
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

De belles URLs sur nginx
========================

nginx est un serveur populaire qui, comme Lighttpd, utilise moins 
de ressources système. Son inconvénient est qu'il ne fait pas usage de 
fichiers .htaccess comme Apache et Lighttpd, il est donc nécessaire de créer 
les URLs réécrites dans la configuration du site disponibles. selon 
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
            try_files $uri $uri/ /index.php?$uri&$args;
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
faire, suivez les étapes:

#. Utilisez l'installeur de la plateforme Web de Microsoft pour installer le
   Module de Rewrite 2.0.
#. Créez un nouveau fichier dans votre dossier CakePHP, appelé web.config.
#. Utilisez Notepad ou tout autre éditeur XML-safe, copiez le code suivant 
   dans votre nouveau fichier web.config...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
    
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
    
                </rule>
    
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php/{R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>


Il est également possible d'utiliser la fonctionnalité Import dans l'URL 
IIS de Réécriture du module pour importer des règles directement à 
partir des fichiers .htaccess de CakePHP dans la racine, /app/, et 
/app/webroot/ - même si quelques modifications dans IIS peuvent être 
nécessaires pour faire fonctionner ces applications. Lors de l'importation 
des règles de cette façon, IIS crée automatiquement votre fichier web.config 
pour vous.

Une fois que le fichier web.config est créé avec les bonnes règles de 
réécriture des liens de IIS, les liens CakePHP, les CSS, les JS, et 
le reroutage devraient fonctionner correctement.

Je ne veux / ne peux utiliser l'URL rewriting
=============================================

Si vous ne voulez ou ne pouvez pas utiliser l'URL rewriting sur votre serveur 
web, référez-vous à la section 
:ref:`core configuration<core-configuration-baseurl>`.



.. meta::
    :title lang=fr: URL Rewriting
    :keywords lang=fr: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
