Installation avancée
####################

Il peut y avoir des situations où vous voulez placer les répertoires de CakePHP
à différents endroits du système de fichiers. Cela est peut être du à des 
restrictions de l'hôte partagé, ou peut-être souhaitez-vous juste que 
quelques-unes de vos apps puissent partager les mêmes librairies de CakePHP. 
Cette section décrit comment déployer vos répertoires de CakePHP à travers 
le système de fichiers.

Premièrement, réalisez qu'il y a trois parties principales d'une application 
Cake:

#. Les librairies du coeur de CakePHP, dans /lib/Cake.
#. Le code de votre application, dans /app.
#. Le webroot de l'application, habituellement dans /app/webroot.

Chacun de ces répertoires peut être situé n'importe où dans votre 
système de fichier, avec l'exception de webroot, qui a besoin d'être acessible 
pour votre serveur web. Vous pouvez même déplacer le dossier webroot en-dehors 
du dossier app tant que vous dîtes à Cake où vous le mettez.

Pour configurer votre installation de Cake, vous aurez besoin de faire quelques 
changements aux fichiers suivants.

-  /app/webroot/index.php
-  /app/webroot/test.php (si vous utilisez la fonctionnalité de 
   `Testing <view/1196/Testing>`\_.)

Il y a trois constantes que vous devrez modifier: ``ROOT``,
``APP_DIR``, et ``CAKE_CORE_INCLUDE_PATH``.


- ``ROOT`` doit être définie vers le chemin du répertoire qui contient le 
  dossier app.
- ``APP_DIR`` doit être définie vers le nom (de base) de votre dossier app.
- ``CAKE_CORE_INCLUDE_PATH`` doit être définie vers le chemin du dossier 
  des librairies de CakePHP.

Testons cela avec un exemple pour que vous puissiez voir ce à quoi peut 
ressembler une installation avancée en pratique. Imaginez que je souhaite 
configurer CakePHP pour travailler comme ce qui suit:

-  Les librairies du coeur de CakePHP seront placées dans /usr/lib/cake.
-  Le répertoire webroot de l'application sera /var/www/monsite/.
-  Le répertoire app de mon application sera /home/moi/monapp.

Etant donné ce type de configuration, j'aurais besoin de modifier mon fichier 
webroot/index.php (ce qui finira dans /var/www/mysite/index.php, dans cet 
exemple) pour ressembler à ce qui suit::

    <?php
    // /app/webroot/index.php (partiel, commentaires retirés) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'moi');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'monapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

Il est recommandé d'utiliser la constante ``DS`` plutôt que des slashes pour 
délimiter des chemins de fichier. Cela empêche les erreurs de fichiers 
manquants que vous pourriez obtenir en résultats en utilisant le mauvais
délimiteur, et cela rend votre code plus portable.

Apache et mod\_rewrite (et .htaccess)
=====================================

Tant que CakePHP est construit pour travailler avec mod\_rewrite –et
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

De belles URLs et Lighttpd
==========================

Alors que Lighttpd offre une fonctionnalité de module de rewrite, il n'est pas 
l'équivalent du mod\_rewrite de Apache. Pour obtenir de belles URLs en 
utilisant Lighty, vous avez deux options. La première option est l'utilisation 
de mod\_rewrite, la deuxième option est l'utilisation d'un script LUA et 
mod\_magnet.

**Utilisation de mod\_rewrite**
La manière la plus simple d'obtenir de belles URLs est d'ajouter le 
script à votre config lighty. Modifiez juste l'URL, et ça devrait 
être bon. Merci de noter que cela ne fonctionne pas sur les installations 
de Cake dans les sous-répertoires. 

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # si la requête est pour les css|fichiers etc, ne les passez pas à Cake
                    "^/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php/$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Utilisation de mod\_magnet**
Pour utiliser les belles URLs avec CakePHP et Lighttpd, placez ce script lua 
dans /etc/lighttpd/cake.

::

    -- Une petite fonction d\'aide
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end
    
    -- prefix without the trailing slash
    local prefix = ''
    
    -- the magic ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- file still missing. pass it to the fastcgi backend
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- fallthrough will put it back into the lighty request loop
    -- that means we get the 304 handling for free. ;)

.. note::

    Si vous lancez votre installation CakePHP depuis un sous-répertoire, vous 
    devez mettre prefix = 'subdirectory\_name' dans le script ci-dessus.

Ensuite dîtes vos vhost à Lighttpd::

    $HTTP["host"] =~ "exemple.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # Think about getting vim tmp files out of the way too
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }


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
        server_name www.exemple.com;
        rewrite ^(.*) http://exemple.com$1 permanent;
    }

    server {
        listen   80;
        server_name exemple.com;
    
        # root directive should be global
        root   /var/www/exemple.com/public/app/webroot/;

        access_log /var/www/exemple.com/log/access.log;
        error_log /var/www/exemple.com/log/error.log;

        location / {
            index  index.php index.html index.htm;
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ \.php$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/exemple.com/public/app/webroot$fastcgi_script_name;
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


.. meta::
    :title lang=fr: Installation avancée
    :keywords lang=fr: dossier des libraries,librairies du coeur,code de l'application,différents endroits,système de fichiers,constantes,webroot,restrictions,apps,serveur web,lib,cakephp,répertoires,chemin