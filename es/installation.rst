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
- PHP 5.4.16 o mayor.
- extensión mbstring.
- extensión mcrypt.
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
signigica que eres libre para modificar, distribuir y republicar el código
fuente con la condición de que las notas de copyright queden intactas. También
eres libre para incorporar CakePHP en cualquier aplicación comercial o de código
cerrado.

Instalando CakePHP
==================

CakePHP utiliza `Composer <http://getcomposer.org>`_, una herramienta de manejo
de dependicias para PHP 5.3+, como el método de instalación oficialmente
soportado.

Primero, necesitas descargar e instalar Composer, si no lo has hecho ya.
Si tienes instalado cURL, es tan fácil como correr esto en un terminal::

    curl -s https://getcomposer.org/installer | php

O, puedes descargar ``composer.phar`` desde el sitio web de
`Composer <https://getcomposer.org/download/>`_.

Para sistemas Windows, puedes descargar el Instalador de Composer para Windows
`aquí <https://github.com/composer/windows-setup/releases/>`__.  Para más
instrucciones acerca de esto, puedes leer el README del instalador de Windows
`aquí <https://github.com/composer/windows-setup>`__.

Ya que has decargado e instalado Composer puedes generar una aplicación
CakePHP ejecutando::

    php composer.phar create-project --prefer-dist -s dev cakephp/app [app_name]

O si tienes Composer definido globalmente::

    composer create-project --prefer-dist -s dev cakephp/app [app_name]

Una vez que Composer termine de descargar el esqueleto y la librería core
de CakePHP, deberías tener una aplicación funcional de CakePHP instalada
vía Composer. Asegúrate de que los ficheros composer.json y composer.lock
se mantengan junto con el resto de tu código fuente.

Ahora puedes visitar el destino donde instalaste la aplicación y ver los
diferentes avisos de setup.

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

CakePHP utiliza el directorio ``tmp`` para varias operaciones. Descripciones de
Modelos, el caché de las vistas y la información de la sesión son algunos
ejemplos de lo anterior. El directorio ``logs`` es utilizado para para escribir
ficheros de log por el motor de ``FileLog`` por defecto.

Asegúrate de que los directorios ``logs``, ``tmp`` y todos sus subdirectorios
tengan permisos de escritura por el usuario del Servidor Web. La instalación
de CakePHP a través de Composer se encarga de este proceso haciendo que dichos
directorios tengan los permisos abiertos globalmente con el fin de que puedas
tener el setup de manera más rápida. Obviamente es recomendable que revises, y
modifiques si es necesario, los permisos tras la instalación vía Composer para
mayor seguridad.

Un problema común es que ``logs``, ``tmp`` y sus subdirectorios deben poder
ser modificados tanto por el usuario del Servidor Web como por el usuario de la
línea de comandos. En un sistema UNIX, si los usuarios mencionados difieren,
puedes ejecutar los siguientes comandos desde el directorio de tu aplicación
para asegurarte de que todo esté configurado correctamente::

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
de PHP para hacer que tu aplicación esté disponible en ``http://host:port``.
Para ello ejecuta desde el directorio ``src``::

    bin/cake server

Por defecto, sin ningún argumento, esto colocará tu aplicación en
``http://localhost:8765/``.

Si tienes algún conflicto con ``localhost`` o ``port 8765``, puedes indicarle
a la consola de CakePHP que corra el servidor de manera más específica
utilizando los siguientes argumentos::

    bin/cake server -H 192.168.13.37 -p 5673

Esto colocará tu aplicación en ``http://192.168.13.37:5673/``.

Eso es todo! Tu aplicación de CakePHP está corriendo perfectamente sin tener que
haber configurado el servidor web manualmente.

.. warning::

    El servidor de desarrollo *nunca* debe ser utilizado en un ambiente de
    producción. Se supone que esto es un servidor básico de desarrollo y nada
    más.

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
        webroot/ (this directory is set as DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Si utilizas Apache debes configurar la directiva ``DocumentRoot`` del
dominio a::

    DocumentRoot /cake_install/webroot

Si tu configuración del Servidor Web es correcta debes tener tu
aplicación disponible aora en http://www.example.com.

URL Rewriting
=============

Si quieres utilizar URL rewriting, entra en la sección dedicada a ello:

A rodar!
========

Muy bien, ahora veamos a CakePHP en acción. Dependiendo del setup
que hayas utilizado, deberías dirigirte en tu navegador a http://example.com/
o http://localhost:8765/. En este punto, encontrás el home principal de
CakePHP y un mensaje que te dice el status actual de tu conexión a la base
de datos.

Felicidades! Estás listo para
:doc:`Crear tu primera aplicación de CakePHP </intro>`.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=es: Instalación
