Estructura de Directorios de CakePHP
####################################

Una vez has descargado y extraído el fichero, estos son los
directorios y ficheros que verás:

- src
- config
- tests
- plugins
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README

Verás que tienes varios directorios principales:

- El directorio *src* que es donde harás tu magia: aquí guardarás
  los ficheros de tu aplicación.
- El directorio *config* es donde residen los (pocos) ficheros de
  :doc:`/development/configuration` que usa CakePHP, concretamente
  la conexión con la base de datos, "bootstrapping" o el fichero
  de arranque, la configuración del núcleo y otros ficheros también
  de configuración estarán aquí.
- El directorio *tests* que es donde pondrás los tests de tu aplicación.
- El directorio *plugins* donde se guardan los :doc:`/plugins` que utiliza
  tu aplicación.
- El directorio *vendor* es donde se instalan CakePHP y otras dependencias.
  Anota mentalmente que **no debes** editar ficheros en este directorio. No
  podemos ayudarte si has modificado el núcleo.
- El directorio *webroot* es la raíz pública de tu aplicación. Contiene
  todos los ficheros que quieres que sean accesibles públicamente.
- El directorio *tmp* es donde CakePHP guarda datos temporales. Los datos
  que guarda dependen en cómo hayas configurado CakePHP, pero este directorio
  es usualmente ulizado para guardar descripciones de modelos, logs y a veces
  información de sesión.

El Directorio Src
=================

En este directorio es donde realizarás la mayor parte del desarrollo de tu
aplicación. Veamos el contenido de esta carpeta:

Console
    Contiene los comandos de consola y las tareas de consola para tu
    aplicación. Este directorio también contiene una carpeta ``Templates``
    para personalizar la salida de bake. Para más información echa un vistazo
    a :doc:`/console-and-shells`.
Controller
    Contiene los ficheros donde están definidos los Controladores de tu
    aplicación y los componentes.
Locale
    Contiene ficheros de cadenas de texto para internacionalización.
Model
    Contiene las tablas, entidades y comportamientos (behaviors) de tu
    aplicación.
View
    Las clases de presentación (vistas) se colocan aquí: celdas (cells), helpers
    y ficheros de vistas.
Template
    Contiene los ficheros vistas: elementos, páginas de error, plantillas y
    ficheros de vista.
