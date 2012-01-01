Estructura de directorios de CakePHP
####################################

Una vez descargado y cuando hayas descomprimido el fichero, estos son los
directorios y ficheros que verás:

-  app
-  lib
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

Verás que tienes tres directorios principales:

-  *app* que es donde harás tu magia: aquí guardarás los ficheros de tu 
   aplicación.
-  *lib* que es donde nosotros hemos hecho "nuestra" magia. Haz una promesa
   ahora mismo: que nunca modificarás ficheros en esta carpeta. Si lo haces
   no podremos ayudarte ya que estás modificando el núcleo de CakePHP por tu
   cuenta.
-  *vendors* que es donde puedes colocar los recursos externos que necesites
   para que tu aplicación funcione.

El directorio APP
=================

En este directorio es donde realizarás la mayor parte del desarrollo de tu 
aplicación. Veamos el contenido de esta carpeta:

Config
   Aquí están los (pocos) ficheros de configuración que usa CakePHP, 
   concretamente la conexión con la base de datos, "bootstrapping" o el 
   fichero de arranque, la configuración del núcleo y otros ficheros también
   de configuración estarán aquí.
Controller
   Contiene los ficheros donde están definidos los Controladores de tu 
   aplicación y los componentes.
Lib
   Contiene recursos que no son de terceros o externos a tu aplicación. Esto
   te ayuda a separar tus librerías internas de las externas que estarán en 
   la carpeta vendors.
Locale
   Aquí están los ficheros de traducción para facilitar la 
   internacionalización de tu proyecto.
Model
   Contiene los modelos de tu aplicación, comportamientos (behaviors) y 
   fuentes de datos (datasources).
Plugins
   Contiene los plugins, increíble ¿ verdad ?
tmp
   Aquí guarda CakePHP los datos temporales que se generan en ejecución. Los
   datos que se guardan dependen de tu configuración. Normalmente se almacenan
   las descripciones de los modelos, ficheros de registro (logs) y ficheros
   que almacenan las sesiones activas.

   Este directorio debe exisitr y el usuario que ejecuta el servidor web debe
   ser capaz de escribir en esta ruta, de otro modo el rendimiento de tu 
   aplicación puede reducirse enormemente. Cuando el parámetro *debug* está 
   activo, CakePHP te advertirá si no se puede escribir en este directorio.
Vendors
   Cualquier recurso de terceros o librerías PHP deben colocarse aquí. Si lo
   haces así, podrás importarlas luego cómodamente usando la función
   App::import('vendor', 'name'). Si eres atento, te habrás fijado en que hay
   dos carpetas "Vendors", una aquí y otra en el directorio raíz de esta 
   estructura. Entraremos en detalle sobre las diferencias cuando hablemos de 
   configuraciones complejas de instalación de CakePHP. Por ahora, ten en 
   cuenta que no nos gusta repetirnos, cada carpeta tiene un cometido distinto.
View
   Los ficheros de presentación (vistas) se colocan aquí: elementos, páginas
   de error, helpers y plantillas (templates).
webroot
   Este será el directorio raíz de tu aplicación web. Aquí habrá varias
   carpetas que te permitirán servir ficheros CSS, imágenes y JavaScript.
