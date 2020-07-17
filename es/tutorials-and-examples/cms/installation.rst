Tutorial de gestión de contenido
################################

Este tutorial lo guiará a través de la creación de una aplicacion simple
Para empezar, instalaremos CakePHP, crearemos nueestra propia base de datos
y crearemos una administracion simple de artículos.

Esto es lo que necesitarás:

#. Un servidor de base de datos. En este tutorial vamos a utilizar MySQL.
   Necesitara saber lo suficiente sobre SQL para crear una base de datos
   y ejecutar fragmentos de SQL desde el tutorial. CakePHP se encargará de
   construir todas las consultas que su aplicación necesite. Ya que estamos
   usando MySQL, también asegúrese de tener pdo_mysql habilitado en PHP.
#. Conocimientos básicos de PHP.

Antes de comenzar, debe asegurarse de tener una vérsion actualizada de PHP:

.. code-block:: bash

    php -v

Debería al menos tener instalado PHP |minphpversion| (CLI) o superior. La
versión de PHP de su servidor web también debe ser de |minphpversion| o
superior, y debe ser la misma versión que su interfaz de linea de comandos
(CLI) PHP.

Obteniendo CakePHP
==================

La forma más facil de instalar CakePHP es usar "Composer". "Composer" es una
forma sencilla de instalar CakePHP desde su termianal o linea de comand.
Primero, debará descargar e instalar "Composer" si aún no lo ha hecho. Si tiene
instalado "Curl", es tan fácil como ejecutar lo siguiente:

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

o puedes descargar "composer.pher" desde el sitio web de "Composer".

Luego simplemente escriba la siguiente linea en su terminal desde su directorio
de instalación para instalar el esqueleto de la aplicación CakePHP en el
directorio "cms" del directorio de trabajo actual:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app:4.* cms

Si descargaste y ejecutaste el instalador de Windows de "Composer", escribí la
siguiente linea en tu terminal desde el directorio de instalación.

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app:4.* cms

La ventaja de usar "Composer" es que completará automáticamente algunas tareas
de configuración importantes, como configurar los permisos de archivo correctos
y crear su archivo config/app.php para usted.

Hay otras formas de instalar CakePHP.
Si no puedes, o no quieres usar "Composer", consulta la sección: doc '/installation'

Independientemente de cómo se descargó e instaló CakePHP, una vez que se complete su configuración, la conafiguración de su directorio debería ser similar a la siguiente::

    /cms
     /bin
     /config
     /logs
     /plugins
     /src
     /tests
     /tmp
     /vendor
     /webroot
     .editorconfig
     .gitignore
     .htaccess
     .travis.yml
     .composer.json
     index.php
     phpunit.xml.dist
     README.md

Ahora puede ser un buen momento para aprender un poco sobre cómo funciona la
estructura de directorios de CakePHP: consulte la sección: doc:
'/intro/cakephp-folder-structure'.

Si se pierde durante este tutorial, puede ver el resultado final en GitHub.

Comprobando nuestra instalación
===============================

Podemos verificar rápidamente que nuestra instalación es correcta, verificando la página de inicio predetermianda. ANtes de poder hacerlo, deberá iniciar el servidor de desarrollo:

.. code-block:: bash

    cd /path/to/our/app
    bin/cake server

.. note::

    Para Windows, el comando necesita ser bincake server

Esto iniciará el servidor web incorporado de PHP en el puerto 8765.
ABra **http://localhost:8765** en su navegador web para ver la página de bienvenida. Todos los puntos de bala deben ser sombreros de chef ecológicos distintos de a CakePHP que puedan conectarse a su base de datos. De lo contrario, es posible que necesite instalar extensiones PHP adicionales o establecer permisos de directorio.

A continuación, construiremos nuestro: :doc:`Database and create our first model </tutorials-and-examples/cms/database>`.
