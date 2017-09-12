Instalación
###########

CakePHP se instala rápida y fácilmente. Los requisitos mínimos son
un servidor web y una copia de CakePHP, y ya! Aunque este manual se enfoca
principalmente en configurar Apache (ya que es el más utilizado),
puedes configurar CakePHP para que corra con una variedad de servidores web
como nginx, LightHTHPD o Microsoft IIS.

Requisitos
==========

- Servidor HTTP. Por ejemplo: Apache. mod\_rewrite es recomendado, pero
  no requerido.
- PHP |minphpversion| o mayor.
- extensión mbstring.
- extensión intl.

Técnicamente una base de datos no es necesaria, pero imaginamos que la
mayoría de aplicaciones utiliza alguna. CakePHP soporta una gran variedad
de sistemas de bases de datos:

-  MySQL (5.1.10 o mayor).
-  PostgreSQL.
-  Microsoft SQL Server (2008 o mayor).
-  SQLite 3.

.. note::

    Todos los drivers nativos necesitan PDO. Debes asegurarte de tener
    las extensiones de PDO correctas.

Licencia
========

CakePHP está licenciado bajo la
`Licencia MIT <http://www.opensource.org/licenses/mit-license.php>`_. Esto
significa que eres libre para modificar, distribuir y republicar el código
fuente con la condición de que las notas de copyright queden intactas. También
eres libre para incorporar CakePHP en cualquier aplicación comercial o de código
cerrado.

Instalando CakePHP
==================

CakePHP utiliza `Composer <http://getcomposer.org>`_, una herramienta de manejo
de dependencias para PHP 5.3+, como el método de instalación oficialmente
soportado.

Primero, necesitas descargar e instalar Composer, si no lo has hecho ya.
Si tienes instalado cURL, es tan fácil como correr esto en un terminal::

    curl -s https://getcomposer.org/installer | php

O, puedes descargar ``composer.phar`` desde el sitio web de
`Composer <https://getcomposer.org/download/>`__.

Para sistemas Windows, puedes descargar el Instalador de Composer para Windows
`aquí <https://github.com/composer/windows-setup/releases/>`__.  Para más
instrucciones acerca de esto, puedes leer el README del instalador de Windows
`aquí <https://github.com/composer/windows-setup>`__.

Ya que has descargado e instalado Composer puedes generar una aplicación
CakePHP ejecutando::

    php composer.phar create-project --prefer-dist cakephp/app [app_name]

O si tienes Composer definido globalmente::

    composer create-project --prefer-dist cakephp/app [app_name]

Una vez que Composer termine de descargar el esqueleto y la librería core
de CakePHP, deberías tener una aplicación funcional de CakePHP instalada
vía Composer. Asegúrate de que los ficheros composer.json y composer.lock
se mantengan junto con el resto de tu código fuente.

Ahora puedes visitar el destino donde instalaste la aplicación y ver los
diferentes avisos tipo semáforo de los ajustes.

Mantente al día con los últimos cambios de CakePHP
--------------------------------------------------

Si quieres mantenerte al corriente de los últimos cambios en CakePHP puedes
añadir las siguientes líneas al ``composer.json`` de tu aplicación::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

Donde ``<branch>`` es el nombre del branch que quieres seguir. Cada vez que
ejecutes ``php composer.phar update`` recibirás las últimas actualizaciones del
branch seleccionado.

Permisos
========

CakePHP utiliza el directorio **tmp** para varias operaciones. Descripciones de
Modelos, el caché de las vistas y la información de la sesión son algunos
ejemplos de lo anterior. El directorio **logs** es utilizado para para escribir
ficheros de log por el motor de ``FileLog`` por defecto.

Asegúrate de que los directorios **logs**, **tmp** y todos sus subdirectorios
tengan permisos de escritura por el usuario del Servidor Web. La instalación
de CakePHP a través de Composer se encarga de este proceso haciendo que dichos
directorios tengan los permisos abiertos globalmente con el fin de que puedas
tener ajustado todo de manera más rápida. Obviamente es recomendable que revises, y
modifiques si es necesario, los permisos tras la instalación vía Composer para
mayor seguridad.

Un problema común es que **logs**, **tmp** y sus subdirectorios deben poder
ser modificados tanto por el usuario del Servidor Web como por el usuario de la
línea de comandos. En un sistema UNIX, si los usuarios mencionados difieren,
puedes ejecutar los siguientes comandos desde el directorio de tu aplicación
para asegurarte de que todo esté configurado correctamente:

.. code-block:: bash

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Configuración
=============

Configurar una aplicación de CakePHP puede ser tan simple como
colocarla en el directorio raíz de tu Servidor Web, o tan complejo
y flexible como lo desees. Esta sección cubrirá los dos tipos
principales de instalación de CakePHP: Desarrollo y Producción.

-  Desarrollo: fácil de arrancar, las URLs de la aplicación incluyen
   el nombre del directorio de la aplicación de CakePHP y es menos segura.
-  Producción: Requiere tener la habilidad de configurar el directorio raíz
   del Servidor Web, cuenta con URLs limpias y es bastante segura.

Desarrollo
==========

Este es el método más rápido para configurar CakePHP. En este ejemplo
utilizaremos la consola de CakePHP para ejecutar el servidor web nativo
de PHP para hacer que tu aplicación esté disponible en **http://host:port**.
Para ello ejecuta desde el directorio de la aplicación:

.. code-block:: bash

    bin/cake server

Por defecto, sin ningún argumento, esto colocará tu aplicación en
**http://localhost:8765/**.

Si tienes algún conflicto con **localhost** o el puerto **8765**, puedes indicarle
a la consola de CakePHP que corra el servidor de manera más específica
utilizando los siguientes argumentos:

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

Esto colocará tu aplicación en **http://192.168.13.37:5673/**.

¡Eso es todo! Tu aplicación de CakePHP está corriendo perfectamente sin tener que
haber configurado el servidor web manualmente.

.. note::

    Prueba ``bin/cake server -H 0.0.0.0`` si el servidor no es accesible desde otra máquina.

.. warning::

    El servidor de desarrollo *nunca* debe ser utilizado en un ambiente de
    producción. Se supone que esto es un servidor básico de desarrollo y nada
    más.

Si prefieres usar un servidor web "real", Debes poder mover todos tus archivos
de la instalación de CakePHP (incluyendo los archivos ocultos) dentro la carpeta
raíz de tu servidor web. Debes entonces ser capaz de apuntar tu navegador al
directorio donde moviste los archivos y ver tu aplicación en acción.

Producción
==========

Una instalación de producción es una manera más flexible de montar una
aplicación de CakePHP. Utilizando este método, podrás tener un dominio entero
actuando como una sola aplicación de CakePHP. Este ejemplo te ayudará a instalar
CakePHP donde quieras en tu sistema de ficheros y tenerlo disponible en
``http://www.example.com``. Toma en cuenta que esta instalación requiere que
tengas los derechos de cambiar el directorio raíz (``DocumentRoot``) del
servidor web Apache.

Después de instalar tu aplicación utilizando cualquiera de los métodos
mencionados en el directorio elegido - asumiremos que has escogido /cake_install
- tu estructura de ficheros debe ser la siguiente::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (este directorio es ajutado como el DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Si utilizas Apache debes configurar la directiva ``DocumentRoot`` del
dominio a:

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

Si tu configuración del Servidor Web es correcta debes tener tu
aplicación disponible ahora en http://www.example.com.

A rodar!
========

Muy bien, ahora veamos a CakePHP en acción. Dependiendo de los ajustes
que hayas utilizado, deberías dirigirte en tu navegador a http://example.com/
o http://localhost:8765/. En este punto, encontrarás la página principal de
CakePHP y un mensaje que te dice el estado actual de tu conexión a la base
de datos.

¡Felicidades! Estás listo para
:doc:`Crear tu primera aplicación de CakePHP </intro>`.

.. _url-rewriting:

URL Rewriting
=============

Apache
------


Mientras que CakePHP está diseñado para trabajar con mod\_rewrite
recién sacado del horno, usualmente hemos notado que algunos usuarios
tienen dificultades para lograr que todo funcione bien en sus sistemas.

Aquí hay algunas cosas que puedes tratar de conseguir para que
funcione correctamente.
La primera mirada debe ir a httpd.conf. (Asegura de que estás editando el
httpd.conf del sistema en lugar del httpd.conf de un usuario o sitio específico)

Hay archivos que pueden variar entre diferentes distribuciones y versiones de Apache.
Debes también mirar en http://wiki.apache.org/httpd/DistrosDefaultLayout para
obtener información.

#. Asegura de que un archivo .htaccess de sobreescritura esté permitido
   y que *AllowOverride* esté ajustado en *All* para el correcto *DocumentRoot*.
   Debes ver algo similar a:

   .. code-block:: apacheconf

       # Cada directorio al que Apache puede acceder puede ser configurado
       # con sus respectivos permitidos/denegados servicios y características
       # en ese directorios (y subdirectorios).
       #
       # Primero, configuramos el por defecto para ser muy restrictivo con sus
       # ajustes de características.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Asegura que tu estás cargando mod\_rewrite correctamente. Debes
   ver algo similar a esto:

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   En muchos sistemas esto estará comentado por defecto, así que
   solo debes remover el símbolo # al comienzo de la línea.

   Después de hacer los cambios, reinicia Apache para asegurarte que los
   ajustes estén activados.

   Verifica que tus archivos .htaccess está actualmente en directorio
   correcto. Algunos sistemas operativo tratan los archivos que empiezan
   con '.' como oculto y por lo tanto no podrás copiarlos.

#. Asegúrate que tu copia de CakePHP provenga desde la sección descargas del
   sitio o de nuestro repositorio de Git, y han sido desempacados correctamente,
   revisando los archivos .htaccess.

   El directorio app de CakePHP (Será copiado en la raíz de tu
   aplicación por bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   El directorio webroot de CakePHP (Será copiado a la raíz de tu aplicación web
   por bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Si tu sitio aún tiene problemas con mod\_rewrite, querrás probar
   modificar los ajustes para el Servidor Virtual. En Ubuntu, edita el
   archivo **/etc/apache2/sites-available/default** (la ubicación
   depende de la distribución). En este archivo, debe estar
   ``AllowOverride None`` cambiado a``AllowOverride All``, así tendrás:

   .. code-block:: apacheconf

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

   En macOS, otra solución es usar la herramienta
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_
   para crear servidores virtuales y apuntarlos a tu carpeta.

   Para muchos servicios de alojamiento (GoDaddy, 1and1), tu servidor
   web estará actualmente sirviendo desde un directorio de usuario que
   actualmente usa mod\_rewrite. Si tu estás instalando CakePHP en la carpeta
   de usuario (http://example.com/~username/cakephp/), o alguna otra
   estructura de URL que ya utilice mod\_rewrite, necesitarás agregar una
   declaración a los archivos .htaccess que CakePHP usa (.htaccess,
   webroot/.htaccess).

   Esto puede ser agregado a la misma sección con la directiva
   RewriteEngine, entonces por ejemplo, tu .htaccess en el webroot
   debería verse algo así:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Los detalles de estos cambios dependerán de tu configuración, y puede
   incluir algunas líneas adicionales que no están relacionadas con CakePHP.
   Por favor dirígete a la documentación en línea de Apache para más información.

#. (Opcional) Para mejorar la configuración de producción, debes prevenir
   archivos adicionales inválidos que sean tomados por CakePHP. Modificando tu .htaccess
   del webroot a algo cómo esto:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   Lo anterior simplemente previene que archivos adicionales incorrectos sean enviados
   a index.php en su lugar muestre la página 404 de tu servidor web.

   Adicionalmente puedes crear una página 404 que concuerde, o usar la página 404
   incluida en CakePHP agregando una directiva ``ErrorDocument``:

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found

nginx
-----

nginx no hace uso de un archivo .htaccess como Apache, por esto es necesario
crear la reescritura de URL en la configuraciones de *site-available*. Esto
usualmente se encuentra en ``/etc/nginx/sites-available/your_virtual_host_conf_file``.
Dependiendo de la configuración, tu necesitarás modificar esto, pero por lo menos,
necesitas PHP corriendo como una instancia FastCGI:

.. code-block:: nginx

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

En algunos servidores (Como Ubuntu 14.04) la configuración anterior no funcionará
recién instalado, y de todas formas la documentación de nginx recomienda
una forma diferente de abordar esto
(http://nginx.org/en/docs/http/converting_rewrite_rules.html). Puedes intentar
lo siguiente (Notarás que esto es un bloque de servidor {}, en vez de dos,
pese a que si quieres que example.com resuelva a tu aplicación CakePHP en adición
a www.example.com consulta el enlace de nginx anterior):

.. code-block:: nginx

    server {
        listen   80;
        server_name www.example.com;
        rewrite 301 http://www.example.com$request_uri permanent;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }


IIS7 (Windows)
--------------

IIS7 no soporta de manera nativa los archivos .htaccess. Mientras hayan
*add-ons* que puedan agregar soporte a estos archivos, puedes también importar
las reglas htaccess en IIS para usar las redirecciones nativas de CakePHP. Para hacer
esto, sigue los siguientes pasos:

#. Usa el `Intalador de plataforma Web de Microsoft <http://www.microsoft.com/web/downloads/platform.aspx>`_
   para instalar el `Modulo de Redirreción 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ de URLs
   o descarga directamente (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Crear un nuevo archivo llamado web.config en tu directorio de raíz de CakePHP.
#. Usando Notepad o cualquier editor de XML, copia el siguiente código
   en tu nuevo archivo web.config:

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

Una vez el archivo web.config es creado con las reglas de redirección amigables
de IIS, los enlaces, CSS, JavaScript y redirecciones de CakePHP deberían
funcionar correctamente.

No puedo usar Redireccionamientos de URL
----------------------------------------

Si no quieres o no puedes obtener mod\_rewirte (o algun otro modulo
compatible) en el servidor a correr, necesitarás usar
el decorador de URL incorporado en CakePHP. En **config/app.php**,
descomentar la línea para que se vea así::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

También remover estos archivos .htaccess::

    /.htaccess
    webroot/.htaccess

Esto hará tus URL verse así
www.example.com/index.php/controllername/actionname/param antes que
www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=es: Instalación
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,directorio tmp,base de datos,copiar archivos,tar gz,fuente de la aplicación,actual liberación,servidores web,microsoft iis,anuncios de derechos de autor,motor de base de datos,reparación de errores,lighthttpd,repositorio,mejoras,código fuente,cakephp,incorporate
