Tutorial Gestor de Contenidos
#############################

Este tutorial lo guiará a través de la creación de un :abbr:`CMS (Sistema
de Gestión de Contenidos)` simple. Para empezar, instalaremos CakePHP,
creando nuestra base de datos y construyendo una gestión simple de artículos.

Esto es lo que se necesitará:

#. Un servidor de base de datos. Vamos a utilizar el servidor MySQL en este tutorial.
   Necesitará saber lo suficiente sobre SQL para crear una base de datos y ejecutar
   fragmentos SQL del tutorial. CakePHP se encargará de construir todas las consultas que
   su aplicación necesita. Como estamos usando MySQL, también asegúrese de tener
   ``pdo_mysql`` habilitado en PHP.
#. Conocimientos básicos de PHP.

Antes de comenzar, debe asegurarse de tener una versión de PHP
actualizada:

.. code-block:: console

    php -v

Al menos debería haber instalado PHP |minphpversion| (CLI) o superior.
La versión PHP de su servidor web también debe ser de |minphpversion| o superior, y
debería ser la misma versión que su interfaz de línea de comando (CLI) de PHP.

Obteniendo CakePHP
==================

La forma más fácil de instalar CakePHP es usar Composer. Composer es una manera simple
de instalar CakePHP desde su terminal o línea de comandos. Primero,
necesita descargar e instalar Composer si aún no lo ha hecho. Si
tiene cURL instalado, es tan fácil como ejecutar lo siguiente:

.. code-block:: console

    curl -s https://getcomposer.org/installer | php

O, puede descargar ``composer.phar`` desde el
`sitio web de Composer  <https://getcomposer.org/download/>`_.

Luego simplemente escriba la siguiente línea en su terminal desde el
directorio de instalación para instalar el esqueleto de la aplicación CakePHP
en la carpeta **cms** del directorio de trabajo actual:

.. code-block:: console

    php composer.phar create-project cakephp/app:5 cms

Si ha descargado y ejecutado el `Instalador de Composer de Windows
<https://getcomposer.org/Composer-Setup.exe>`_, entonces, escriba la siguiente línea en el
terminal desde el directorio de instalación (ej.
C:\\wamp\\www\\dev):

.. code-block:: console

    composer self-update && composer create-project cakephp/app:5.* cms

La ventaja de usar Composer es que completará automáticamente algunas
tareas de configuración importantes, como establecer los permisos de archivo correctos y
crear el archivo **config/app.php** por usted.

Hay otras formas de instalar CakePHP. Si no puede o no quiere usar
Composer, consulte la sección :doc:`/installation`.

Independientemente de cómo haya descargado e instalado CakePHP, una vez que la configuración es
completada, la disposición de su directorio debería ser similar a la siguiente::

    cms/
      bin/
      config/
      logs/
      plugins/
      resources/
      src/
      templates/
      tests/
      tmp/
      vendor/
      webroot/
      .editorconfig
      .gitignore
      .htaccess
      composer.json
      index.php
      phpunit.xml.dist
      README.md

Ahora podría ser un buen momento para aprender un poco sobre cómo funciona la estructura de directorios
de CakePHP: consulte la sección :doc:`/intro/cakephp-folder-structure`.

Si se pierde durante este tutorial, puede ver el resultado final `en GitHub
<https://github.com/cakephp/cms-tutorial>`_.

Comprobando nuestra instalación
===============================

PPodemos verificar rápidamente que nuestra instalación es correcta, verificando la página de inicio
predeterminada. Antes de que pueda hacer eso, deberá iniciar el servidor de desarrollo:

.. code-block:: console

    cd /path/to/our/app
    bin/cake server

.. note::

     Para Windows, el comando debe ser ``bin\cake server`` (tenga en cuenta la barra invertida).

Esto iniciará el servidor web incorporado de PHP en el puerto 8765. Abra
**http://localhost:8765** en su navegador web para ver la página de bienvenida. Todos
las viñetas deben ser sombreros de chef verdes indicando que CakePHP puede conectarse a
De lo contrario, es posible que deba instalar extensiones adicionales de PHP o establecer
permisos de directorio.

A continuación, crearemos nuestra :doc:`Base de datos y crearemos nuestro primer modelo </tutorials-and-examples/cms/database>`.
