CakePHP Folder Structure
########################

Después de haber descargado y extraido la aplicación CakePHP, estos son los
archivos y directorios que podrás ver:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

Notarás unos cuantos directorios de primer nivel:

- La carpeta *bin* contiene los ejecutables por consola de Cake.
- La carpeta *config* contiene los documentos de
  :doc:`/development/configuration` que utiliza CakePHP. Detalles de la conexión
  a la Base de Datos, bootstrapping, arhivos de configuración del core y otros,
  serán almacenados aquí.
- La carpeta *plugins* es donde se almacenan los :doc:`/plugins` que utiliza tu
  aplicación.
- La carpeta de *logs* contiene normalmente tus archivos de log, dependiendo de
  tu configuración de log.
- La carpeta *src* será donde tu crearás tu mágia: es donde se almacenarán los
  archivos de tu aplicación.
- La carpeta *tests* será donde pondrás los test para tu aplicación.
- La carpeta *tmp* es donde CakePHP almacenará temporalmente la información. La
  información actual que almacenará dependerá de cómo se configure CakePHP, pero
  esta carpeta es normalmente utilizada para almacenar descripciones de modelos
  y a veces información de sesión.
- La carpeta *vendor* es donde CakePHP y otras dependencias de la aplicación
  serán instaladas. Comprométete a **no** editar los archivos de esta carpeta.
  No podremos ayudarte si modificas el core.
- El directorio *webroot* es la raíz de los documentos públicos de tu
  aplicación. Contiene todos los archivos que quieres que sean accesibles
  públicamente.

Asegúrate de que las carpetas *tmp* y *logs* existen y permiten escritura, en
caso contrario el rendimiento de tu aplicación se verá gravemente perjudicado.
En modo debug, CakePHP te avisará si este no es el caso.


La carpeta src
==============

La carpeta *src* de CakePHP es donde tú harás la mayor parte del desarrollo de
tu aplicación. Observemos más detenidamente dentro de la carpeta *src*.

Console
    Contiene los comandos de consola y las tareas de consola de tu aplicación.
    Para más información mirar :doc:`/console-and-shells`.
Controller
    Contiene los controladores de tu aplicación y sus componentes.
Locale
    Almacena los ficheros de string para la internacionalización.
Model
    Contiene las tablas, entidades y funcionamiento de tu aplicación.
View
    Las clases de presentación se ubican aquí: cells, helpers y templates.
Template
    Los archivos de presentación se almacenan aquí: elementos, páginas de error,
    layouts, y templates.


.. meta::
    :title lang=es: CakePHP Structura de Carpetas
    :keywords lang=es: librerias internas,configuracion core,descripciones de modelos, vendors externos,detalles de conexión,estructura de carpetas,librerías,compromiso personal,conexión base de datos,internacionalización,archivos de configuración,carpetas,desarrollo de aplicaciones,léeme,lib,configurado,logs,config,third party,cakephp
