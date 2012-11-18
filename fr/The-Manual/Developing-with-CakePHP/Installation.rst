Installation
############

Installer CakePHP peut-être aussi simple que le déposer dans le Document
Root de votre serveur web ou bien aussi complexe et souple que vous le
souhaitez. Cette section couvrira les 3 types d’installations principaux
: développement, production et avancé.

-  Développement : facile à mettre en oeuvre, mais les URLs de
   l’application contiennent le nom du répertoire d’installation de
   CakePHP et c’est moins sécurisé.
-  Production : nécessite d’être habilité à configurer le Document Root
   du serveur, URLs propres, très sécurisé.
-  Avancé : avec un peu de configuration, vous permet de placer les
   répertoires clés de CakePHP à différents endroits du système de
   fichiers, avec la possibilité de partager un seul répertoire de la
   librairie centrale CakePHP entre plusieurs applications.

Développement
=============

Une installation "développement" est la méthode la plus rapide pour
lancer Cake. Cet exemple vous aidera à installer une application CakePHP
et à la rendre disponible à http://www.exemple.com/cake\_1\_3/. Nous
considérons pour les besoins de cet exemple que votre *document root*
pointe sur /var/www/html.

Décompressez le contenu de l'archive Cake dans /var/www/html. Vous avez
maintenant un dossier dans votre *document root*, nommé d'après la
version que vous avez téléchargée (par exemple : cake\_1.3.0). Renommez
ce dossier en "cake\_1\_3". Votre installation "développement" devrait
ressembler à quelque chose comme çà dans votre système de fichiers :

-  /var/www/html

   -  /cake\_1\_3

      -  /app
      -  /cake
      -  /vendors
      -  /.htaccess
      -  /index.php
      -  /README

Si votre serveur web est correctement configuré, vous devriez maintenant
accéder à votre application Cake à l'adresse :
http://www.exemple.com/cake\_1\_3/

Production
==========

Une installation "production" est une façon plus flexible de lancer
Cake. Utiliser cette méthode permet à tout un domaine d'agir comme une
seule application CakePHP. Cet exemple vous aidera à installer Cake
n'importe où dans votre système de fichiers et à le rendre disponible à
l'adresse : http://www.exemple.com. Notez que cette installation demande
d'avoir les droits pour modifier le DocumentRoot sur le serveur web
Apache.

Décompressez les contenus de l'archive Cake dans un répertoire de votre
choix. Pour les besoins de cet exemple, nous considérons que vous avez
choisi d'installer Cake dans /cake\_install. Votre installation de
production devrait ressembler à quelque chose comme çà dans votre
système de fichiers :

/cake\_install/

-  /app

   -  /webroot (répertoire défini comme le DocumentRoot du serveur)

-  /cake
-  /vendors
-  /.htaccess
-  /index.php
-  /README

Les développeurs utilisant Apache devraient régler la directive
``DocumentRoot`` pour le domaine à :

::

    DocumentRoot /cake_install/app/webroot

Si votre serveur web est configuré correctement, vous devriez maintenant
accéder à votre application Cake accessible à l'adresse :
http://www.exemple.com.

Installation avancée
====================

Il peut y avoir des situations où vous souhaitez placer les répertoires
de CakePHP à différents endroits du système de fichiers. Cela peut être
du à des restrictions en hébergement mutualisé ou peut-être que vous
voulez simplement partager vos librairies Cake entre plusieurs de vos
applications. Cette section décrit comment dérouler vos répertoires
CakePHP à travers un système de fichiers.

D’abord, sachez qu’il y a 3 parties principales dans une application
Cake :

#. Les librairies du cœur de CakePHP, dans /cake.
#. Le code de votre application, dans /app
#. La racine web de l’application, habituellement dans /app/webroot

Chacun de ces répertoires peut être situé n’importe où dans votre
système de fichier, à l’exception de webroot, qui doit être accessible
via votre serveur web. Vous pouvez même déplacer ce répertoire webroot
en dehors du répertoire app, tant que vous dites à Cake où vous l'avez
mis.

Pour configurer votre installation Cake, vous aurez besoin de faire
quelques modifications dans le fichier /app/webroot/index.php. Il y a
trois constantes que vous devrez éditer : ``ROOT``, ``APP_DIR``, et
``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` devrait être défini sur le chemin du répertoire qui contient
   votre dossier /app
-  ``APP_DIR`` devrait être défini sur le nom (de base) de votre dossier
   /app
-  ``CAKE_CORE_INCLUDE_PATH`` devrait être défini sur le chemin de votre
   dossier des librairies CakePHP

Lançons-nous dans un exemple, ainsi vous pourrez voir à quoi doit
ressembler, en pratique, une installation avancée. Imaginez que je
veuille configurer CakePHP pour fonctionner de la manière suivante :

-  Les librairies du cœur de CakePHP seront placées dans /usr/lib/cake.
-  Le répertoire webroot de mon application sera placé dans
   /var/www/monsite/
-  Le répertoire app de mon application sera placé dans
   /home/moi/monsite.

Etant donné ce type de configuration, j’aurais besoin d’éditer mon
fichier /webroot/index.php (qui se trouvera à
/var/www/monsite/index.php, dans cet exemple) afin qu’il ressemble à ce
qui suit :

::

    // /app/webroot/index.php (partiel, commentaires supprimés) 

    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'moi');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'monsite');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

Il est recommandé d'utiliser la constante DS (*Directory Separator*)
plutôt que les slashs pour délimiter les chemins de fichier. Cela évite
toute erreur de fichier introuvable que vous pourriez avoir en utilisant
un mauvais délimiteur et cela rend votre code davantage portable.

Chemins de classes additionnels
-------------------------------

C’est parfois pratique de pouvoir partager les classes MVC entre
applications au sein d’un même système. Si vous voulez le même
contrôleur dans 2 applications, vous pouvez utiliser le fichier
bootstrap.php de CakePHP pour disposer de ces classes additionelles dans
une vue.

Dans bootstrap.php, définissez quelques variables nommées de façon
particulière pour rendre CakePHP conscient des autres emplacements de
classes MVC à explorer :

::

    App::build(array(
    'plugins' => array('/chemin/complet/vers/plugins/', '/chemin/complet/suivant/vers/plugins/'),
    'models' => array('/chemin/complet/vers/models/', '/chemin/complet/suivant/vers/models/'),
    'views' => array('/chemin/complet/vers/views/', '/chemin/complet/suivant/vers/views/'),
    'controllers' => array('/chemin/complet/vers/controllers/', '/chemin/complet/suivant/vers/controllers/'),
    'datasources' => array('/chemin/complet/vers/datasources/', '/chemin/complet/suivant/vers/datasources/'),
    'behaviors' => array('/chemin/complet/vers/behaviors/', '/chemin/complet/suivant/vers/behaviors/'),
    'components' => array('/chemin/complet/vers/components/', '/chemin/complet/suivant/vers/components/'),
    'helpers' => array('/chemin/complet/vers/helpers/', '/chemin/complet/suivant/vers/helpers/'),
    'vendors' => array('/chemin/complet/vers/vendors/', '/chemin/complet/suivant/vers/vendors/'),
    'shells' => array('/chemin/complet/vers/shells/', '/chemin/complet/suivant/vers/shells/'),
    'locales' => array('/chemin/complet/vers/locale/', '/chemin/complet/suivant/vers/locale/')
    ));

L'ordre dans lequel le *bootstrapping* est fait a également changé. Dans
le passé, ``app/config/core.php`` était lu **après**
``app/config/bootstrap.php``. Ceci avait pour effet d'empêcher la mise
en cache de tous les appels à ``App::import()`` dans le bootstrap, et
ralentissait considérablement l'application. Dans la version 1.3,
core.php est chargé et les configurations de mise en cache sont créées
**avant** que le bootstrap.php soit chargé.

Apache et mod\_rewrite
======================

Bien que CakePHP soit architecturé pour travailler avec *mod\_rewrite*
tel quel – et il le fait – nous avons remarqué que certains utilisateurs
se battent pour obtenir quelque chose qui marche bien sur leurs
systèmes.

Voici quelques astuces que vous devriez essayer pour le faire
fonctionner correctement. Regardez d'abord votre fichier httpd.conf
(Assurez-vous que vous avez édité le httpd.conf du système et non celui
d’un utilisateur ou d’un site spécifique).

#. Assurez-vous qu’une réécriture .htaccess est permise et que
   *AllowOverride* est défini sur *All* pour le *DocumentRoot* adéquat.
   Vous devriez voir quelque chose comme :

   ::

       #
       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories). 
       #
       # First, we configure the "default" to be a very restrictive set of 
       # features.  
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

   #. ``#``
   #. ``# Each directory to which Apache has access can be configured with respect``
   #. ``# to which services and features are allowed and/or disabled in that``
   #. ``# directory (and its subdirectories). ``
   #. ``#``
   #. ``# First, we configure the "default" to be a very restrictive set of ``
   #. ``# features.  ``
   #. ``#``
   #. ``<Directory />``
   #. ``    Options FollowSymLinks``
   #. ``    AllowOverride All``
   #. ``#    Order deny,allow``
   #. ``#    Deny from all``
   #. ``</Directory>``

#. Assurez-vous que vous chargez *mod\_rewrite* correctement. Vous
   devriez voir quelque chose comme :

   ::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   #. ``LoadModule rewrite_module libexec/apache2/mod_rewrite.so``

   Dans la plupart des systèmes ceci sera commenté (en étant précédé du
   signe #) par défault, donc vous aurez juste besoin de supprimer ces
   symboles #.

   Après avoir effectué vos modifications, redémarrez Apache pour être
   sûr que les paramètres seront activés.

   Vérifiez que vos fichiers .htaccess sont bien dans les bons
   répertoires.

   Ceci peut arriver pendant la copie car certains systèmes
   d'exploitation traitent les fichiers commençant '.' comme des
   fichiers cachés et donc on ne les voit pas après la copie.

#. Assurez-vous que votre copie de CakePHP provient bien de la section
   téléchargements de ce site ou bien de notre dépôt GIT et qu'elle a
   été décompressée correctement en vérifiant les fichiers .htaccess.

   celui du répertoire principal de Cake (qui a besoin d'être copié dans
   votre document, ceci redirige tout vers votre application Cake):

   ::

       <IfModule mod_rewrite.c>

          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   #. ``<IfModule mod_rewrite.c>``
   #. ``   RewriteEngine on``
   #. ``   RewriteRule    ^$ app/webroot/    [L]``
   #. ``   RewriteRule    (.*) app/webroot/$1 [L]``
   #. ``</IfModule>``

   Celui du répertoire app de Cake (qui sera copié au début du
   répertoire de votre application par le script bake) :

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
        </IfModule>

   #. ``<IfModule mod_rewrite.c>``
   #. ``    RewriteEngine on``
   #. ``    RewriteRule    ^$    webroot/    [L]``
   #. ``    RewriteRule    (.*) webroot/$1    [L]``
   #. `` </IfModule>``

   Celui du répertoire webroot de Cake (qui sera copié à la racine web
   de votre application par le script bake) :

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   #. ``<IfModule mod_rewrite.c>``
   #. ``    RewriteEngine On``
   #. ``    RewriteCond %{REQUEST_FILENAME} !-d``
   #. ``    RewriteCond %{REQUEST_FILENAME} !-f``
   #. ``    RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]``
   #. ``</IfModule>``

   Chez la plupart des hébergeurs (GoDaddy, 1and1), votre serveur web
   est en fait exécuté depuis un répertoire utilisateur qui utilise déjà
   *mod\_rewrite*. Si vous installez CakePHP dans un répertoire
   utilisateur (http://exemple.com/~pseudo/cakephp/) ou tout autre
   structure d'URL qui utilise déjà *mod\_rewrite*, vous devrez ajouter
   des déclarations RewriteBase aux fichiers .htaccess que CakePHP
   utilise (/.htaccess, /app/.htaccess, /app/webroot/.htaccess).

   Ceci peut être ajouté dans la même section que la directive
   RewriteEngine, ainsi, votre fichier .htaccess du webroot devrait
   ressembler à quelque chose comme çà :

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   #. ``<IfModule mod_rewrite.c>``
   #. ``    RewriteEngine On``
   #. ``    RewriteBase /``
   #. ``    RewriteCond %{REQUEST_FILENAME} !-d``
   #. ``    RewriteCond %{REQUEST_FILENAME} !-f``
   #. ``    RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]``
   #. ``</IfModule>``

   Les détails de ces modifications dépendront de votre configuration et
   pourront inclure des choses supplémentaires qui ne sont pas liées à
   Cake. Merci de vous référez à la documentation en ligne d'Apache pour
   plus d'information.

Lighttpd et Pretty\_URLs
========================

Bien que Lighttpd propose un module de réécriture, il n'est pas
équivalent au mod\_rewrite d'Apache. Pour obtenir des 'pretty urls' en
utilisant Lighty, vous avez deux possibilités. La première est
d'utiliser mod\_rewrite, la seconde est d'utiliser un script LUA et
mod\_magnet.

**Avec mod\_rewrite**

La manière la plus simple pour avoir des 'pretty urls' est d'ajouter ce
script dans votre configuration de Lighty. Changez l'URL, et tout
devrait bien se passer. Attention ! Ceci ne marche pas lorsque Cake est
installé dans un sous-répertoire.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # Cette requête est pour les css|fichiers etc, ne le passer pas dans Cake
                    "/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Avec mod\_magnet**

Pour utiliser 'pretty URLs' avec CakePHP et Lighttpd, placez ce script
lua dans /etc/lighttpd/cake.

::

    -- Une petite fonction assistance
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

    -- prefix sans le slash
    local prefix = ''

    -- Magie ! ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- Le fichier est toujours manquant. passez le avec le backend fastcgi
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
    -- fallthrough va le remettre dans la boucle de requête de Lighty
    -- ce qui permet la gestion du message 304 Not Modified. ;)

Si vous lancez votre installation CakePHP depuis un sous-répertoire,
vous devez paramétrer prefix = 'nom\_du\_sous\_repertoire' dans le
script ci-dessus.

Ensuite expliquez à Lighttpd où se trouve votre vhost :

::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # Pensez également à retirer les fichiers tmp de vim
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }

Jolies URLs avec nginx
======================

nginx est un serveur populaire qui, comme Lighttpd, utilise moins de
ressources système. Son inconvénient est qu'il ne fait pas usage des
fichiers .htaccess comme Apache et Lighttpd, il est donc nécessaire de
créer ces URLs réécrites dans la configuration disponible du site. En
fonction de votre paramètrage, vous devrez modifier ceci, mais vous
aurez besoin, au minimum, de lancer PHP comme une instance FastCGI.

::

    server {
        listen   80;
        server_name www.exemple.com;
        rewrite ^(.*) http://exemple.com$1 permanent;
    }

    server {
        listen   80;
        server_name exemple.com;

        access_log /var/www/exemple.com/log/access.log;
        error_log /var/www/exemple.com/log/error.log;

        location / {
            root   /var/www/exemple.com/public/app/webroot/;
            index  index.php index.html index.htm;
            if (-f $request_filename) {
                break;
            }
            if (-d $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?q=$1 last;
        }

        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/exemple.com/public/app/webroot$fastcgi_script_name;
        }
    }

URL Rewrites on IIS7 (Windows hosts)
====================================

IIS7 does not natively support .htaccess files. While there are add-ons
that can add this support, you can also import htaccess rules into IIS
to use CakePHP's native rewrites. To do this, follow these steps:

#. Use Microsoft's Web Platform Installer to install the URL Rewrite
   Module 2.0.
#. Create a new file in your CakePHP folder, called web.config
#. Using Notepad or another XML-safe editor, copy the following code
   into your new web.config file...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Redirect static resources" stopProcessing="true">
                <match url="^(ico|img|css|files|js)(.*)$" />
                <action type="Rewrite" url="app/webroot/{R:1}{R:2}" appendQueryString="false" />
                </rule>
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
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

It is also possible to use the Import functionality in IIS's URL Rewrite
module to import rules directly from CakePHP's .htaccess files in root,
/app/, and /app/webroot/ - although some editing within IIS may be
necessary to get these to work. When Importing the rules this way, IIS
will automatically create your web.config file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.

Faites chauffer !
=================

Parfait, voyons CakePHP à l'œuvre. Selon la configuration que vous avez
utilisé, vous devriez pointer votre navigateur web à l’adresse :
http://exemple.com/ ou bien : http://exemple.com/installation\_cake/.
Vous vous trouvez alors en présence de la page d’accueil par défaut de
CakePHP et un message vous informe du statut actuel de votre connexion à
la base de données.

Félicitations ! Vous êtes prêts à créer votre première application
CakePHP.
