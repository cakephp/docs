Instalación
###########

CakePHP se instala de forma fácil y rápidamente. Los requisitos mínimos son: un servidor
web y una copia de los archivos de CakePHP ¡Eso es todo! Aunque este manual se centra en
la configuración de Apache, ya que es el servidor web más común, se puede configurar
CakePHP para que funcione en otros servidores como lighttpd o Microsoft IIS.

Vamos a preparar el proceso de instalación, que consta de los siguientes pasos:

-  Descargar copia de CakePHP
-  Configurar el servidor web para que use PHP
-  Comprobar que los permisos de ficheros y carpetas son correctos

Descargar CakePHP
=================

Hay dos opciones: descargar un archivo comprimido con todo el código
(zip/tar.gz/tar.bz2) de la web oficial o realizar un *checkout* del código
directamente desde el repositorio de git.

Para descargar la última versión estable, puedes vistar la página oficial
`https://cakephp.org <https://cakephp.org>`_ y pichar en la opción
"Download Now".

Además, todas las versiones de CakePHP están hospedadas en `Github
<https://github.com/cakephp/cakephp>`_. Github almacena tanto el código de
CakePHP como muchos otros plugins para el sistema. Las versiones *release* de
CakePHP están disponibles aquí `Github tags
<https://github.com/cakephp/cakephp/tags>`_.

También se puede obtener la última versión, con las últimas correcciones de errores y mejoras
de última hora (o al menos en ese día). Para ello puedes
clonar el repositorio. `Github`_.

Permisos
========

CakePHP usa el directorio ``/app/tmp`` para varias cosas, como guardar las
descripciones de los modelos, la cache de las vistas y la información de sesión
de los usuarios.

Por ello debes, asegúrarte de que el directorio ``/app/tmp`` de tu instalación de
CakePHP puede ser escrito por el usuario que ejecuta tu servidor web. Ten en
cuenta que cuando tu servidor web se inicia, define un usuario como propietario
del servicio. Este usuario suele llamarse 'apache' o 'www-data' en algunas versiones de
sistemas \*nix. Por lo tanto la carpeta ``/app/tmp`` debe tener permisos de
escritura para que el usuario propietario del servidor web pueda escribir dentro
de ella.

Configuración
=============

Configurar CakePHP es tan sencillo como copiar la carpeta en la carpeta raíz de
tu servidor web (*document root*) o tan complejo y flexible como quieras para
que se adapte a tu sistema. En esta sección cubriremos los 3 modos más
frecuentes: desarrollo, producción, avanzado.

- Desarrollo: fácil y rápido. Las URL de tu aplicación incluyen la carpeta de
  instalación de CakePHP. Es menos seguro.
- Producción: Requiere poder cambiar el *document root* de su servidor web,
  proporciona URL amigables y es muy seguro.
- Avanzado: Te permite colocar la carpeta de CakePHP en otras partes de tu
  sistema de archivos, posiblemente para compartir el núcleo con varias
  aplicaciones web basadas en CakePHP.

Desarrollo
==========

Instalar CakePHP para desarrollo es el método más rápido de empezar. Este
ejemplo te ayudará a instalar una aplicación CakePHP y configurarla para que se
accesible desde http://www.example.com/cake\_2\_0/. Asumiremos que tu *document
root* (la carpeta raíz de tu servidor web) es ``/var/www/html``.

Descomprime los contenidos del archivo que contiene CakePHP en la carpeta
``/var/www/html``. Ahora tendrás un nuevo directorio con el nombre de la versión
que te has descargado (por ejemplo cake\_2.0.0). Cambia el nombre de este
directorio a algo más sencillo, por ejemplo a ``cake20``.
La estructura de directorios debería ser ahora similar a esta:

-  /var/www/html

  -  /cake20

     -  /app
     -  /lib
     -  /vendors
     -  /plugins
     -  /.htaccess
     -  /index.php
     -  /README

Si la configuración de tu servidor web es correcta, ahora podrás acceder a tu aplicación accediendo
a: http://localhost/cake20 .

Usando una misma instalación de CakePHP para múltiples aplicaciones
-------------------------------------------------------------------

Si estás desarrollando varias aplicaciones a la vez, muchas veces tiene
sentido compartir la misma versión del núcleo de CakePHP. Hay varias formas
de conseguirlo. Una de las más sencillas es usar la directiva PHP
``include_path``. Para empezar, clona CakePHP en un directorio. Por ejemplo,
en ``/home/mark/projects``::

    git clone git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

Este comando clonará CakePHP en tu directorio ``/home/mark/projects``. Si no quieres
usar git, puedes descargar el archivo zip del repositorio, todos los demás
pasos serán los mismos. Lo siguiente es modificar el archivo de configuración
de PHP ``php.ini``. En sistemas \*nix, este archivo suele estar ubicado en la
ruta ``/etc/php.ini``, pero puedes localizarlo fácilmente mediante el comando
``php -i``, busca la ruta bajo el epígrafe 'Loaded Configuration File'. Cuando
hayas localizado el fichero correcto, modifica el parámetro ``include_path`` y
añade el directorio ``/home/mark/projects/cakephp/lib``. Ejemplo::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

Reinicia el servidor web, deberías ver los cambios aplicados en la salida de
``phpinfo()``.

.. note::

    Si utilizas Windows, separa las rutas en el include path con ; en vez de :

Tras modificar este parámetro y reiniciar el servidor web, tus aplicaciones
podrán utilizar CakePHP automáticamente.

Producción
==========

Se llama entorno de Producción porque es el lugar al que accederán los usuarios
finales de la aplicación web. Una instalación en Producción es una forma más flexible de configurar
CakePHP. Usando este método permite que un dominio completo actúe como una única aplicación CakePHP.
El siguiente ejemplo permitirá ayudar a instalar CakePHP en cualquier parte del sistema de archivos
y tener la aplicación disponible en http://www.example.com.
Ten en cuenta que esta instalación requiere que tengas permiso de escritura en el
directorio raíz de tu servidor web *document root*.

Descomprime los contenidos del paquete que has descargado con la última versión
de CakePHP en el directorio que prefieras. No es necesario que sea una carpeta
de tu *document root*. Por ejemplo vamos a suponer que quieres tener tus
archivos de CakePHP en la ruta ``/cake_install``. Tu sistema de archivos sería
entonces:

-  /cake\_install/

   -  /app

      -  /webroot (este directorio es el que configuraremos como ``DocumentRoot`` en el servidor web

   -  /lib
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README

Si usas Apache, ahora es el momento de configurar la directiva de configuración
``DocumentRoot`` de tu servidor web para que apunte a la carpeta /app/webroot de
tu instalación.

::

    DocumentRoot /cake_install/app/webroot

Si tu servidor está correctamente configurado, podrás acceder a tu aplicación
utilizando la url http://www.example.com.

Instalación avanzada y configuración flexible
=============================================

.. toctree::
    :maxdepth: 1

    installation/advanced-installation
    installation/url-rewriting

¡ A por todas !
===============

Vamos a ver de qué es capaz tu recientemente instalado CakePHP. Dependiendo de
qué opción de configuración hayas elegido, podrás acceder a tu aplicación
mediante http://www.example.com/ o http://example.com/cake\_install/. Verás una
página de bienvenida por defecto, que mostrará un mensaje que te dice el estado
actual de conexión a la Base de Datos.

¡ Enhorabuena ! Estás preparado para empezar.

¿ No funciona ? Bueno, estas cosas pasan. Si aparece un mensaje de error que
habla de la Zona Horaria *timezone*, quita el comentario en la siguiente línea del
fichero app/Config/core.php:

::

   /**
    * If you are on PHP 5.3 uncomment this line and correct your server timezone
    * to fix the date & time related errors.
    */
       date_default_timezone_set('UTC');
