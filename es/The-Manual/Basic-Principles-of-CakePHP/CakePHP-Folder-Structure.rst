Estructura de archivos de CakePHP
#################################

Tras descargar y extraer CakePHP, estos serán los ficheros y carpetas
que deberías ver:

-  app
-  cake
-  vendors
-  .htaccess
-  index.php
-  README

Observarás 3 carpetas principales:

-  La carpeta *app* será donde haremos nuestra magia: es donde se
   ubicarán los ficheros de tu aplicación.
-  La carpeta *cake* es donde nosotros hemos hecho nuestra magia.
   Comprométete a no modificar los ficheros de esta carpeta. No podremos
   ayudarte si has modificado el núcleo.
-  Finalmente, la carpeta *vendors* es donde ubicarás las librerías PHP
   de terceros que necesites usar con tus aplicaciones en CakePHP.

La Carpeta App
==============

La carpeta app de CakePHP es donde realizarás la mayor parte del
desarrollo de tu aplicación. Veámos un poco más de cerca las carpetas
dentro de app.

config

Contiene los (pocos) archivos de configuración que usa CakePHP. Detalles
de conexión a bases de datos, arranque (*bootstrapping*), archivos de
configuración del núcleo y demás deberían ser almacenados aquí.

controllers

Contiene los controladores de tu aplicación y sus componentes.

locale

Almacena archivos de cadenas de texto para la internacionalización.

models

Contiene los modelos de tu aplicación, comportamientos (*behaviors*) y
orígenes de datos (*datasources*).

plugins

Contiene los paquetes de plugins.

tmp

Aquí es donde CakePHP almacena datos temporales. La información que
realmente se almacena depende de cómo hayas configurado CakePHP, pero
normalmente esta carpeta es usada para almacenar descripciones de
modelos, registros (*logs*) y algunas veces información de sesiones.

Asegúrate de que esta carpeta existe y tiene permisos de escritura, ya
que de lo contrario el rendimiento de tu aplicación se verá muy
afectado. En modo debug CakePHP te avisará si este no es el caso.

vendors

Cualesquiera clases o librerías de terceros deberían ser ubicadas aquí.
Hacerlo así hace que sea más fácil de acceder a ellas usando la función
``App::Import('vendor','nombre')``. Los observadores meticulosos notarán
que esto parece redundante, ya que también existe una carpeta vendors en
el nivel superior de nuestra estructura de directorios. Veremos las
diferencias entre las dos cuando discutamos acerca de la administración
de múltiples aplicaciones y configuraciones de sistemas más complejos.

views

Los archivos de presentación son ubicados aquí: elementos (*elements*),
páginas de error, ayudantes (*helpers*), layouts y archivos de vistas.

webroot

En una configuración de producción, esta carpeta debería servir como la
raíz del sitio (*document root*) para tu aplicación. Las carpetas aquí
también sirven como lugares de almacenamiento para hojas de estilo en
cascada (*CSS stylesheets*), imágenes y archivos JavaScript.
