URL Rewriting
#############

Apache y mod\_rewrite (y .htaccess)
===================================

A pesar de que CakePHP está diseñado para funcionar con mod\_rewrite
por defecto, hemos notado que algunos usuarios sufren con el proceso
de lograr que todo vaya perfectamente bien en sus sistemas.

Aquí hay un par de cosas que puedes intentar para que funcione correctamente.
Primero, entra en tu http.conf. (Asegúrate de que estás editando el httpd.conf
del sistema general y no uno perteneciente a un sitio o usuario específico).

Este archivo puede variar dependiendo de tu distribución y versión de Apache.
También puedes echar un vistazo en http://wiki.apache.org/httpd/DistrosDefaultLayout
para más información.

#. Asegúrate de que un override en .htaccess está permitido y que
   AllowOverride está en 'All' para el DocumentRoot deseado. Deberías
   entonces ver algo así::

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

#. Asegúrate de que mod\_rewrite está siendo cargado correctamente.
   Deberías tener algo como::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   En muchos sistemas, estas líneas estarán comentadas por defecto, así que
   debes simplemente remover el símbolo # al principio de la línea.

   Después de hacer los cambios reinicia Apache para cerciorarte de que
   los cambios estén activos.

   Verifica que tus ficheros .htaccess están en el directorio correcto.
   Algunos sistemas operativos esconden por defecto los archivos que
   comienzan con '.' y pueden no copiarlos bajo ciertas circunstancias.

#. Asegúrate de que tu copia de CakePHP proviene de las secciones de descarga
   de la página web o del repositorio de Github y que ha sido desempacado
   correctamente chequeando los archivos .htaccess.

   En el directorio 'app' de CakePHP (será copiado en la raíz de tu aplicación
   por el comando bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   En el directorio 'webrot' de CakePHP (será copiado en tu aplicación
   por el comando bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Si tu sitio CakePHP aún tiene problemas con mod\_rewrite, podrías
   intentar modificar los parámetros de tus Hosts Virtuales. En Ubuntu,
   edita el fichero /etc/apache2/sites-available/default (la ubicación
   depende de tu distribución). En este fichero, asegúrate de que
   ``AllowOverride None`` está cambiado por ``AllowOverride All``, así::

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

   En Mac OSX, otra solución es utilizar la herramienta
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_
   para hacer que un host virtual apunte a tu aplicación.

   En muchos servicios de hosting (GoDaddy, 1and1), tu servidor web está
   en realidad siendo llamado desde un directorio de usuario que ya usa
   mod\_rewrite. Si estás instalando CakePHP en un directorio de usuario
   (http://example.com/~username/cakephp/), u otra estructura de URL que
   ya utiliza mod\_rewrite, necesitarás acceso para introducir reglas RewriteBase
   en los ficheros .htaccess utilizados por CakePHP uses (.htaccess,
   webroot/.htaccess).

   Esto puede ser añadido a la misma sección con la directiva de RewriteEngine
   así que por ejemplo, tu .htaccess del webroot .htaccess se vería así::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Los detalles de esos cambios dependerán de tu configuración, y pueden
   incluir cosas adicionales que no están relacionadas con CakePHP. Por favor
   visita la documentación online de Apache para más información.

#. (Opcional) Para mejorar la configuración de producción, deberías prevenir
   que fuentes inválidas sean leídas por CakePHP. Modifica el .htaccess de
   webroot para que parezca algo como::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   Lo anterior prevendrá que ficheros incorrectos sean enviados a index.php
   y desplegará un error 404 de tu servidor web.

   Adicionalmente, puedes crear un archivo 404 de HTML o utilizar el 
   archivo nativo de CakePHP para errores 404 al añadir la directiva::

       ErrorDocument 404 /404-not-found

nginx
=====

nginx no utiliza los archivos .htaccess como Apache, así que es necesario que
crees las URLs reescritas en la configuración de sites-available. Dependiendo
de tu configuración tendrás que modificar esto, pero en el menor de los casos
tendrás a PHP corriendo como una instancia de FastCGI::

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

URL Rewrites en IIS7 (Windows hosts)
====================================

IIS7 no soporta archivos .htacces de manera nativa. A pesar de que existen
add-ons que pueden añadir esta función, puedes también importar reglas
de htaccess en IIS para que utilicen los rewrites nativos de CakePHP.
Para hacer esto, sigue estos sencillos pasos:


#. Utiliza el `Instalador de Plataforma Web de Microsoft <http://www.microsoft.com/web/downloads/platform.aspx>`_ para instalar el
   `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ o descárgalo directamente (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Crea un nuevo fichero llamado web.config en tu raíz de CakePHP.
#. Utilizando un editor de XML confiable, copia lo siguiente en dicho archivo...

::

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

Una vez hayas modificado el web.config con las reglas correctas y compatibles
con IIS, podrás ver que los links, archivos CSS, archivos de Javascript y el
rerouting de CakePHP debe funcionar correctamente.

No me interesa / No puedo usar URL Rewriting
============================================

Si no puedes o no quieres utilizar URL Rewriting en tu servidor web
entra en :ref:`configuración de core <core-configuration-baseurl>`.


.. meta::
    :title lang=es: URL Rewriting
