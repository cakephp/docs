Estructura de carpetas de CakePHP
#################################

Después de haber descargado el esqueleto de aplicación de CakePHP, estos son los
directorios de primer nivel que deberías ver:

- La carpeta *bin* contiene los ejecutables por consola de Cake.
- La carpeta *config* contiene los documentos de
  :doc:`/development/configuration` que utiliza CakePHP. Detalles de la conexión
  a la Base de Datos, bootstrapping, archivos de configuración del core y otros,
  serán almacenados aquí.
- La carpeta *plugins* es donde se almacenan los :doc:`/plugins` que utiliza tu
  aplicación.
- La carpeta de *logs* contiene normalmente tus archivos de log, dependiendo de
  tu configuración de log.
- La carpeta *src* será donde tu crearás tu magia: es donde se almacenarán los
  archivos de tu aplicación.
- La carpeta *templates* contiene los archivos de presentación:
  elementos, páginas de error, plantillas generales y plantillas de vistas.
- La carpeta *resources* contiene sub carpetas para varios tipos de archivos.
- La carpeta *locales* contiene sub carpetas para los archivos de traducción a otros idiomas.
- La carpeta *tests* será donde pondrás los test para tu aplicación.
- La carpeta *tmp* es donde CakePHP almacenará temporalmente la información. La
  información actual que almacenará dependerá de cómo se configure CakePHP, pero
  esta carpeta es normalmente utilizada para almacenar descripciones de modelos
  y a veces información de sesión.
- La carpeta *vendor* es donde CakePHP y otras dependencias de la aplicación
  serán instaladas por `Composer <https://getcomposer.org>`_. Editar estos archivos no es
  recomendado, ya que Composer sobreescribirá tus cambios en la próxima actualización.
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

Command
    Contiene los comandos de consola de tu aplicación.
    Para más información mirar :doc:`/console-commands/commands`.
Console
    Contiene los 'scripts' de instalación ejecutados por Composer.
Controller
    Contiene los :doc:`/controllers` de tu aplicación y sus componentes.
Middleware
    Contiene cualquier :doc:`/controllers/middleware` para tu aplicación.
Model
    Contiene las tablas, entidades y comportamientos de tu aplicación.
View
    Las clases de presentación se ubican aquí: plantillas de vistas, células y ayudantes.

.. note::

    La carpeta ``Command`` no está creada por defecto.
    Puedes añadirla cuando la necesites.

.. meta::
    :title lang=es: CakePHP Estructura de Carpetas
    :keywords lang=es: librerías internas,configuración core,descripciones de modelos, vendors externos,detalles de conexión,estructura de carpetas,librerías,compromiso personal,conexión base de datos,internacionalización,archivos de configuración,carpetas,desarrollo de aplicaciones,léeme,lib,configurado,logs,config,third party,cakephp
