Instalación
###########

Instalar CakePHP puede ser tan simple como colocar el directorio en el
servidor, o tan complejo y flexible como necesites. Esta sección cubrirá
los tres tipos principales de instalación para CakePHP: desarrollo,
producción y avanzado

-  Desarrollo: fácil para iniciar, los URL de la aplicación incluyen el
   nombre del directorio, y es menos seguro.
-  Producción: Requiere la capacidad de configurar el servidor web para
   definir el "document root", muy seguro.
-  Avanzado: Con cierta configuración, permite ubicar los directorios
   clave de CakePHP en diferentes partes del sistema de archivos, para
   compartir una misma instalación de CakePHP para varias aplicaciones.

Desarrollo
==========

Usar una instalación de desarrollo es el método más rápido para montar
Cake. Este ejemplo te ayudará a instalar una aplicación de CakePHP y
hacerla disponible en https://www.ejemplo.com/cake\_1\_2/. Asumimos para
el fin de este ejemplo que tu raíz de documentos está establecido a
/var/www/html.

Descomprime los contenidos del archivo Cake en /var/www/html. Ahora
tienes una carpeta en tu raíz de documentos con un nombre dependiente de
la versión que te has descargado (p.ej. cake\_1.2.0.7962). Renombra esta
carpeta a cake\_1\_2. Tu configuración de desarrollo será como la
siguiente en el sistema de archivos:

/var/www/html

cake\_1\_2

-  /app
-  /cake
-  /vendors
-  .htaccess
-  /index.php
-  README

Si tu servidor web está configurado correctamente, deberías encontrar tu
aplicación de Cake accesible en https://www.ejemplo.com/cake\_1\_2/.

Producción
==========

Una instalación de producción es una manera más flexible de instalar
Cake. Usar este método permite que un dominio entero se comporte como
una aplicación CakePHP única. Este ejemplo te ayudará a installar Cake
en cualquier sitio de tu sistema de ficheros y ponerlo disponible en
https://www.ejemplo.com. Tener en cuenta que esta instalación puede
requerir los privilegios para cambiar el ``DocumentRoot`` (raíz de
documentos) en servidores web Apache.

Descomprime los contenidos del archivo Cake en un directorio a tu
elección. Por motivos de ejemplo, asumimos que escoges instalar Cake en
/cake\_install. Tu configuración de producción se verá de la siguiente
manera en el sistema de ficheros:

-  /cake\_install/

   -  /app

      -  /webroot (este directorio es el establecido con la directiva
         ``DocumentRoot``)

   -  /cake
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README

Los desarrolladores que usan Apache deberán establecer la directiva
``DocumentRoot`` para el dominio a:

::

    DocumentRoot /cake_install/app/webroot

Si tu servidor web está configurado correctamente, deberías encontrar tu
aplicación Cake accesible en https://www.ejemplo.com.

Instalación Avanzada
====================

Existen situaciones en las que querrás colocar los directorios de
CakePHP en lugares diferentes del sistema de archivos. Esto puede ser
debido a restricciones de un servidor compartido, o quizás simplemente
deseas que algunas de tus aplicaciones compartan las mismas librerías de
Cake. Esta sección describe cómo esparcir los directorios de CakePHP
sobre un sistema de archivos.

En primer lugar, date cuenta que existen tres partes principales de una
aplicación Cake:

#. Las librerías principales(\ *core*) de CakePHP, en /cake.
#. El código de tu aplicación, en /app.
#. El *webroot* de la aplicación, normalmente en /app/webroot.

Cada uno de estos directorios puede ser ubicado en cualquier lugar de tu
sistema de archivos, a excepción del *webroot*, que debe ser accesible
por el servidor web. Incluso puedes mover el directorio *webroot* fuera
de tu carpeta app siempre que le indiques a Cake en donde lo has puesto.

Para configurar tu instalación de Cake, necesitarás hacer algunos
cambios a /app/webroot/index.php. Hay tres constantes que deberás
editar: ``ROOT``, ``APP_DIR``, y ``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` debe contener la ruta del directorio que contiene la carpeta
   app (es decir, el padre de ``APP_DIR``).
-  ``APP_DIR`` debe ser establecida con el nombre(base) de tu carpeta
   app.
-  ``CAKE_CORE_INCLUDE_PATH`` debe contener la ruta al directorio que
   contiene las librerías de Cake.

Vamos a mostrar un ejemplo para ver cómo quedaría una instalación
avanzada en la práctica. Imagina que quiero configurar CakePHP para que
funcione de esta manera:

-  Las Librerías de CakePHP serán ubicadas en /usr/lib/cake.
-  El webroot de mi aplicación será /var/www/misitio/.
-  El directorio app de mi aplicación estará en /home/yo/misitio.

Dada esta configuración, necesitaré editar mi webroot/index.php (el cual
terminará ubicado en /var/www/misitio/index.php, en este ejemplo) para
que sea así:

::

    // /app/webroot/index.php (codigo parcial, sin comentarios)

    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'yo');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'misitio');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

Es recomendable utilizar la constante DS en lugar de barras inclinadas
para delimitar las rutas de los archivos. Esto evita errores por falta
de archivo como resultado de usar el delimitador equivocado, y además
hace tu código más portable.

Rutas de Clase Adicionales
--------------------------

Ocasionalmente es útil compartir clases MVC entre aplicaciones en el
mismo sistema. Si quieres el mismo controler en dos aplicaciones, puedes
usar el archivo bootstrap.php de CakePHP para traer estas clases
adicionales a la escena.

En el archivo bootstrap.php, define algunas variables especiales para
que CakePHP sepa otros lugares en donde buscar clases MVC:

::

    $viewPaths        = array();
    $controllerPaths  = array();
    $modelPaths       = array();
    $helperPaths      = array();
    $componentPaths   = array();
    $behaviorPaths    = array();
    $pluginPaths      = array();
    $vendorPaths      = array();
    $localePaths      = array();
    $shellPaths       = array();

Cada una de estas variables especiales pude ser establecida a un array
de rutas absolutas en el sistema de archivos donde las clases
adicionales pueden ser encontradas cuando se solicite. Asegúrate que
cada ruta contenga una barra inclinada (o preferiblemente la constante
DS) al final.

Apache y mod\_rewrite (y .htaccess)
===================================

A pesar de que CakePHP está hecho para funcionar con mod\_rewrite sin
tocar nada, y normalmente así es, hemos notado que algunos usuarios
tienen dificultades para lograr que todo funcione correctamente en sus
sistemas.

Aquí hay unas cuantas cosas que puedes probar para conseguir que
funcione correctamente. Primero mira en tu httpd.conf (asegúrate de
estar editando el httpd.conf del sistema y que no es httpd.conf
específico de un usuario o del *site*).

#. Asegúrate que la reescritura .htaccess esté permitida y que
   ``AllowOverride`` esté establecido a ``All`` para el ``DocumentRoot``
   adecuado. Deberías ver algo similar a:

   ::

       #
       # Cada directorio al que tiene acceso Apache puede ser configurado en
       # función de qué servicios y características están permitidas y/o 
       # desactivadas en dicho directorio (y sus subdirectorios).
       #
       # Primero, configuramos "por defecto" para que sea un conjunto de
       # características muy restrivo.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Asegúrate de estar cargando el módulo mod\_rewrite correctamente.
   Debes ver algo como:

   ::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   En muchos sistemas esto estará comentado (comenzando la línea con #)
   por defecto, así que sólo tendrás que quitar los símbolos # del
   principio.

   Tras realizar los cambios reinicia Apache para estar seguro de que
   las opciones de configuración están activas.

   Asegúrate de que tus ficheros .htaccess están en los directorios
   correctos. Esto puede pasar durante la copia porque algunos sistemas
   operativos consideran los archivos que comienzan por '.' como ocultos
   y por lo tanto no los copian.

#. Asegúrate de que tu copia de CakePHP es de las sección de descargas
   de nuestro *site* o nuestro repositorio GIT, y que ha sido
   desempaquetado correctamente verificando que existen los ficheros
   .htaccess:

   En el directorio raíz de Cake (necesita ser copiado al directorio,
   esto redirige todo a tu aplicación de Cake):

   ::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   En el directorio app de Cake (será copiado por bake):

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
        </IfModule>

   En el directorio webroot de Cake (será copiado a tu *webroot* de la
   aplicación por bake):

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   En muchos servicios de hosting (GoDaddy, 1and1), tu servidor web está
   realmente siendo servido desde un directorio de usuario que ya
   utiliza mod\_rewrite. Si estás instalando CakePHP en un directorio de
   usuario o en cualquier
   otra estructura que ya utilice mod\_rewrite necesitarás añadir
   sentencias ``RewriteBase`` a los archivos .htaccess que utiliza
   CakePHP (/.htaccess, /app/.htaccess, /app/webroot/.htaccess)

   Esto puede ser añadido a la misma sección con la directiva
   ``RewriteEngine``, así, por ejmplo, tu archivo .htaccess en el
   *webroot* devería ser así:

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   Los detalles de esos cambios dependen de tu configuración, y pueden
   incluir cosas adicionales que no están relacionadas con Cake.
   Consulta la documentación online de Apache para más información.

Lighttpd y mod\_magnet
======================

Aunque Lighttpd cuenta con un módulo de reescritura, no es equivalente
al mod\_rewrite de Apache. Las funcinalidades completas de mod\_rewrite
se reparten entre el mod\_rewrite de Lighttp, el mod\_magnet y el
mod\_proxy.

Sin embargo, CakePHP, mayoritariamente necesita mod\_magnet para
redirigir las solicitudes a fin de trabajar con bastantes URLs

Para utilizar bastantes URLs con CakePHP y Lighttp, sustituye este lua
script en /etc/lighttpd/cake.

::

    -- pequeña funcion helper
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

    -- prefijo sin la barra
    local prefix = ''

    -- la magia ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- fichero aún desaparecido, pasarlo al fastcgi Backend
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
    -- fallthrough pondrá de nuevo la solucititud en el bucle lighty
    -- eso significa que tenemos la manipulación 304 de forma gratuita. ;)

If you run your CakePHP installation from a subdirectory, you must set
prefix = 'subdirectory\_name' in the above script.

Then tell Lighttpd about your vhost:

::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # además piensa como coger los ficheros vim tmp fuera
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }

Pretty URLs en nginx
====================

nginx es un servidor popular que, del mismo modo que Lighttpd, consume
menos recursos del sistema. Su inconveniente es que no utiliza ficheros
.htaccess como Apache y Lighttpd, por lo que es necesario crear esas
reescrituras de URLs en la configuración de site-available. Dependiendo
de tu configuración, necesitarás modificar esto, pero como mínimo
necesitarás que PHP se ejecute como instancia de FastCGI.

::

    server {
        listen   80;
        server_name www.ejemplo.com;
        rewrite ^(.*) http://ejemplo.com$1 permanent;
    }

    server {
        listen   80;
        server_name ejemplo.com;

        access_log /var/www/ejemplo.com/log/access.log;
        error_log /var/www/ejemplo.com/log/error.log;

        location / {
            root   /var/www/ejemplo.com/public/app/webroot/;
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
            fastcgi_param SCRIPT_FILENAME /var/www/ejemplo.com/public/app/webroot$fastcgi_script_name;
        }
    }

Enciéndelo
==========

Muy bien, ahora veamos a CakePHP en acción. Dependiendo de la
configuración que hayas usado, deberías apuntar tu navegador a
http://example.com/ o http://example.com/mi\_aplicacion/. En este punto,
se te presentará la vista de bienvenida de CakePHP por omisión, y un
mensaje que indica el estado de conexión con la base de datos.

¡Felicidades! Ya estás listo para crear tu primera aplicación CakePHP
