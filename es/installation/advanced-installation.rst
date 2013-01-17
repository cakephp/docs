Instalación Avanzada
####################

Hay muchas situaciones en las que te gustaría colocar los archivos de CakePHP en
otro directorio de tu sistema de ficheros. Esto puede pasarte por restricciones
en tu hosting compartido, o simplemente quieres que varias aplicaciones
compartan la misma versión de CakePHP. Esta sección describe cómo configurar los
directorios de CakePHP para que se ajusten a tus requistos.

Lo primero, ten en cuenta que hay tres partes en toda aplicación CakePHP:

#. Los ficheros propios del framework, en /cake
#. El código específico de tu aplicación, en /app
#. El directorio raíz de tu aplicación, habitualmente en /app/webroot

Cada uno de estos directorios puede estar donde quieras dentro de tu sistema de
ficheros, con la excepción del directorio raíz (*webroot*), que tiene que ser
accesible por tu servidor web. Puedes moverlo fuera de /app siempre que le digas
a CakePHP dónde está.

Cambia los siguientes ficheros si quieres configurar CakePHP para que funcione
con una estructura de directorios diferente.

-  /app/webroot/index.php
-  /app/webroot/test.php (si usas tests
   `Testing <view/1196/Testing>`_ .)

Hay 3 constantes que necesitarás cambiar:  ``ROOT``,
``APP_DIR`` y ``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` debe apuntar a la carpeta que contiene tu directorio app.
-  ``APP_DIR`` debería ser el nombre base de tu directorio app.
-  ``CAKE_CORE_INCLUDE_PATH`` debe apuntar al directorio que contiene CakePHP.

Veamos todo esto con un ejemplo. Imagina que quiero crear una estructura de
directorios como sigue:

-  La instalación de CakePHP la quiero en /usr/lib/cake.
-  Mi directorio raíz *webroot* lo colocaré en /var/www/mysite/.
-  Mi directorio app con el código de mi aplicación lo colocaré en /home/me/myapp.

Para llevar esto a cabo, necesitaré editar el fichero /var/www/mysite/index.php
para que se parezca a este:

::

 // /app/webroot/index.php (partial, comments removed) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

Recomendamos utilizar la constante ``DS`` en vez del caracter '/' para delimitar
las rutas de directorios. Esto permite que tu código sea más portable ya que
este caracter cambia en algunos sistemas operativos. Usa ``DS``.

Apache, mod\_rewrite y .htaccess
================================

CakePHP está escrito para funcionar con mod\_rewrite sin tener que realizar
ningún cambio. Normalmente ni te darás cuenta de que ya está funcionando, aunque
hemos visto que para algunas personas es un poco más complicado configurarlo
para que funcione bien en su sistema.

Te proponemos algunas cosas que te pueden ayudar a que quede bien configurado.

Lo primero: echa un vistazo a tu fichero de configuración de Apache httpd.conf
(asegúrate de estar editando el fichero correcto, ya que puede haber ficheros de
este tipo por usuario o por sitio web. Edita el fichero de configuración
principal).

#. Debe estar permitido la reescritura de ficheros .htaccess (*override*), y el
   parámetro AllowOverride debe estar fijado a 'All' para el DocumentRoot en el que
   reside tu aplicación web. Deberías ver algo similar a esto:

::

       # Cada directorio al que tiene acceso Apache debe ser configurado
       # para indicar qué funciones están habilitadas y deshabilitadas 
       #
       # Primero se configura un directorio por defecto restringido por seguridad  
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Comprueba que efectivamente se está cargando mod\_rewrite ya que en algunos
   sistemas viene desactivado por defecto en Apache. Para ello deberías ver la
   siguiente línea *sin* comentario ('#') al principio:

::

    LoadModule rewrite_module libexec/apache2/mod_rewrite.so

Si ves que tiene un comentario al principio de la línea, quítalo. Si has tenido
que hacer algún cambio a este fichero, necesitarás reiniciar el servicio Apache.

Verifica que los ficheros .htaccess están ahí.

A veces, al copiar archivos de un lugar a otro los ficheros con un nombre que
empieza por '.' se consideran ocultos y no se copian. Hay que forzar la copia de
estos ficheros.

#. Asegúrate de que tu copia de CakePHP es de nuestro sitio oficial o del
   repositorio oficial de GIT, y que la has descomprimido correctamente.

En el directorio raíz de CakePHP (necesita ser copiado a tu carpeta, esto
redirige todo a tu aplicación CakePHP):

::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

En el directorio app (será copiado en tu directorio de aplicación por bake):

::

     <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
        </IfModule>

En el directorio raíz *webroot* (será copiado allí por bake):

::

     <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

Muchos de las empresas de hosting (GoDaddy, 1and1) ya tienen mod\_rewrite activo
y su servidor web ya utiliza un directorio de usuario para servir el contenido.
Si estás instalando CakePHP en un directorio de usuario, por ejemplo
(http://example.com/~username/cakephp/) o cualquier otra ruta que ya utilice
mod\_rewrite necesitarás añadir una directiva ``RewriteBase`` al los ficheros
.htaccess que se utilizan (todos).


.. note::

    Si al cargar la página de bienvenida de CakePHP ves que no se aplican bien los
    estilos, puede que necesites esta directiva ``RewriteBase`` en tus ficheros
    .htaccess.

Para añadir la directiva, abre los 3 ficheros .htaccess y escribe la nueva
directiva bajo la línea RewriteEngine (dentro del IfModule para que tu fichero
de configuración sólo se aplique si mod\_rewrite está cargado):

::

     <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

Este cambio dependerá de tu configuración. Puede que debas realizar otros
cambios en función de tu servidor. Para aclarar dudas, consulta la documentación
de Apache.

URLs amigables y Lighttpd
=========================

Aunque Lighttpd incluye un módulo de redirección, no es igual que mod\_rewrite
de Apache. Para que funcionen las URLs del mismo modo, tienes dos opciones:

- Usar mod\_rewrite
- Usar un script LUA y mod\_magnet

**Usando mod\_rewrite**
La manera más sencilla es añadir este script a la configuración de lighty. Sólo
edita la URL y todo debería ir bien. Ten en cuenta que esto no funciona si
CakePHP ha sido instalado en subdirectorios.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # if the request is for css|files etc, do not pass on to Cake
                    "^/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php/$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Usando mod\_magnet**
Coloca este script lua en /etc/lighttpd/cake.

::

    -- little helper function
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

y escribe la nueva directiva bajo la línea RewriteEngine (dentro del IfModule
para que tu fichero de configuración sólo se aplique si mod\_rewrite está
cargado):

::

     <IfModule mod_rewrite.c>
         RewriteEngine On
         RewriteBase /path/to/cake/app
         RewriteCond %{REQUEST_FILENAME} !-d
         RewriteCond %{REQUEST_FILENAME} !-f
         RewriteRule ^(.*)$ index.php/$1 [QSA,L]
     </IfModule>

Este cambio dependerá de tu configuración. Puede que debas realizar otros
cambios en función de tu servidor. Para aclarar dudas, consulta la documentación
de Apache.

.. note::

  Si has instalado CakePHP en un subdirectorio, debes colocar
  set prefix = 'nombre-del-subdirectorio' el el script anterior.

Luego Lighttpd para tu host virtual:

::

    $HTTP["host"] =~ "example.com" {
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

¡ y listo !


URLs amigables en nginx
=======================

nginx es un servidor web que está ganando mucha popularidad. Igual que Lighttpd, usa eficientemente los recursos del sistema. En el caso de nginx, no hay ficheros .htaccess, así que es necesario crear esas reglas de redirección directamente en la configuración del servidor. Dependiendo de tu configuración igual tendrás que ajustar un poco este fichero. Como mínimo necesitarás PHP funcionando como instancia FastCGI. Puedes ver los detalles en la documentación de instalación de nginx.

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

IIS7 También existe (Windows hosts)
===================================

No nos olvidamos de que muchos utilizan IIS como servidor web.
IIS no soporta de forma nativa los ficheros .htaccess. Hay algunos 'add-ons' que
te permiten añadir esta funcionalidad. También puedes importar las reglas de
redirección de los ficheros .htaccess en IIS y usar la reescritura nativa de
CakePHP. Para hacer esto último, sigue estos pasos:

#. Usa el *Microsoft's Web Platform Installer* para instalar el módulo *URL
   Rewrite Module 2.0*.
#. Crea un nuevo fichero en la carpeta de CakePHP, llamado web.config.
#. Usa notepad o cualquier otro editor 'seguro' para ficheros xml que conserve el formato. Copia el siguiente código:

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

También puedes usar la funcionalidad 'Importar' en el módulo de reescritura de
IIS, para importar directamente las reglas de todos los ficheros .htaccess de
CakePHP. Si importas las reglas de este modo, IIS creará el fichero web.config.
Es posible que neceites retocar un poco esta configuración hasta que funcione.

Una vez creado el archivo web.config con la configuración correcta de reglas de
reescritura para IIS, los links, css, js y enrutado de CakePHP deberían
funcionar correctamente.
