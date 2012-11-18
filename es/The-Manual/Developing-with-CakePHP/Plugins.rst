Plugins
#######

CakePHP nos permite combinar una serie de controladores, modelos y
vistas y publicarlos como una aplicación empaquetada, *plugin*, que
otros pueden integrar en sus aplicaciones CakePHP. ¿Has desarrolado un
módulo de administración de usuarios amigable, un blog sencillo o un
*web service* en alguna de tus aplicaciones? Empaquétalo como un plugin
de CakePHP e inclúyelo en otras aplicaciones.

El principal vínculo entre un plugin y la aplicación en la que se
instala es la configuración de la aplicación (conexión a la base de
datos, etc.). Por lo demás, el plugin opera en su propio espacio,
comportándose como si fuese una aplicación en sí mismo.

Crear un Plugin
===============

Como ejemplo, vamos a crear un nuevo plugin que encargue pizzas. Para
empezar tendremos que colocar todos los archivos de nuestro plugin en el
directorio /app/plugins. El nombre del directorio padre del plugin es
importante y se referenciará muy a menudo, así que conviene escogerlo
con prudencia. Para este ejemplo utilizaremos el nombre '**pizza**\ '.
La estructura de archivos será la siguiente:

::

    /app
         /plugins
             /pizza
                 /controllers                <- controladores del plugin
                 /models                     <- modelos del plugin
                 /views                      <- vistas del plugin
                 /pizza_app_controller.php   <- clase AppController del plugin
                 /pizza_app_model.php        <- clase AppModel del plugin 

Si queremos acceder a nuestro plugin a través de una URL, es necesario
definir las clases AppController y AppModel para el mismo. Estas dos
clases especiales tienen el nombre del plugin y extienden las clases
AppController y AppModel de la aplicación principal. En nuestro ejemplo:

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

Si olvidamos definir estas clases, CakePHP nos mostrará el error
"Missing Controller".

Controladores del Plugin
========================

Los controladores de nuestro plugin pizza se almacenan en
/app/plugins/pizza/controllers/. Puesto que las acciones que más
trataremos son las peticiones de pizza, necesitaremos el controlador
PeticionesController para este plugin.

Aunque no es necesario, conviene llamar los controladores de los plugin
con un nombre relativamente único, con el fin de evitar conflictos de
espacios de nombre con la aplicación principal. No es extraño pensar que
una aplicación podría tener controladores como UsuariosController,
PeticionesController o ProductosController: deberíamos ser creativos con
los nombres de los controladores, o anteponer el nombre del plugin al
nombre de la clase (PizzaPeticionesController en nuestro ejemplo).

Así, ubicamos nuestro nuevo controlador, PizzaPeticionesController, en
/app/plugins/pizza/controllers, quedando:

::

    // /app/plugins/pizza/controllers/pizza_peticiones_controller.php
    class PizzaPeticionesController extends PizzaAppController {
        var $name = 'PizzaPeticiones';
        var $uses = array('Pizza.PizzaPeticion');
        function index() {
            //...
        }
    }

Observa cómo este controlador extiende el controlador AppController del
plugin (llamado PizzaAppController) en lugar del controlador
AppController de la aplicación principal.

Además, al nombre del modelo se añade como prefijo el nombre del plugin.
Esta línea de código se añade por claridad, pero no es necesaria en este
caso.

Si quieres acceder a lo que hemos hecho hasta ahora, visita
/pizza/pizzaPeticiones. Deberías obtener un error “Missing Model”,
porque no hemos definido todavía el modelo PizzaPeticion.

Modelos del Plugin
==================

Los modelos de un plugin son almacenados en /app/plugins/pizza/models.
En el apartado anterior, definimos el controlador
PizzaPeticionesController para nuestro plugin de ejemplo. Ahora
crearemos el modelo para ese controlador, PizzaPeticion, definición
consistente con el esquema de nombres que establecimos previamente,
anteponiendo a todas las clases de nuestro plugin el nombre del mismo,
Pizza.

::

    // /app/plugins/pizza/models/pizza_peticion.php:
    class PizzaPeticion extends PizzaAppModel {
        var $name = 'PizzaPeticion';
    }
    ?>

Acceder a /pizza/pizzaPeticiones ahora (suponiendo que tenemos una tabla
en nuestra base de datos llamada ‘pizza\_peticiones’) nos debería dar un
error “Missing View”. Este será el próximo paso.

Si necesitamos referenciar un modelo dentro de nuestro plugin, tenemos
que incluir el nombre del plugin junto con el nombre del modelo,
separados por un punto.

::

    // /app/plugins/pizza/models/pizza_peticion.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaPeticion');
    }
    ?>

Vistas del Plugin
=================

Las vistas se comportan en un plugin exactamente igual a como lo hacen
en una aplicación normal. Basta con colocarlas en la carpeta adecuada en
/app/plugins/[plugin]/views/. Para nuestro plugin encargado de pedir
pizza, necesitaremos una vista para la acción
PizzaPeticionesController::index():

::

    // /app/plugins/pizza/views/pizza_peticiones/index.ctp:
    <h1>Pide una Pizza</h1>
    <p>¡Nada combina con Cake mejor que una buena pizza!</p>
    <!-- Aquí debería ir un formulario para solicitar pizza...-->

Overriding plugin views from inside your application
----------------------------------------------------

You can override any plugin views from inside your app using special
paths. If you have a plugin called 'Pizza' you can override the view
files of the plugin with more application specific view logic by
creating files using the following template
"app/views/plugins/$plugin/$controller/$view.ctp". For the pizza
controller you could make the following file:

::

    /app/views/plugins/pizza/pizza_orders/index.ctp

Creating this file, would allow you to override
"/app/plugins/pizza/views/pizza\_orders/index.ctp".

Componentes, Ayudantes y Comportamientos
========================================

Al igual que una aplicación típica, un plugin puede tener Componentes
(Components), Ayudantes (Helpers) y Comportamientos (Behaviors). Incluso
podemos crear plugins que incluyan únicamente estas clases, siendo un
mecanismo excelente para construir módulos reutilizables que pueden
añadirse fácilmente en cualquier proyecto.

Los componentes se desarrollan exactamente de la misma manera a como se
desarrollan en una aplicación normal, sin ninguna convención de nombres
especial. Hacer referencia a nuestros componentes desde el mismo plugin
no requiere ninguna notación especial.

::

    // Componente
    class EjemploComponent extends Object {

    }

    // desde los controladores de nuestro plugin:
    var $components = array('Ejemplo'); 

Para invocar el Componente desde fuera del entorno del plugin, tenemos
que indicar el nombre del mismo.

::

    var $components = array('PluginNombre.Ejemplo');
    var $components = array('Pizza.Ejemplo'); // referencia al componente EjemploComponent en el plugin Pizza.

La misma técnica se aplica a los Ayudantes y Comportamientos.

CSS y Javascript en los Plugins
===============================

Podemos incluir archivos CSS y Javascript en nuestros plugins,
colocándolos, respectivamente, en ``nuestro_plugin/vendors/css`` y
``nuestro_plugin/vendors/js``. Pueden incluirse en nuestras vistas
usando los ayudantes nativos del framework.

::

    <?php echo $html->css('/nuestro_plugin/css/mi_css'); ?>

    <?php echo $javascript->link('/nuestro_plugin/js/mi_javascript');

Las líneas anteriores son ejemplos de como incluir archivos javascript y
css en nuestro plugin.

Es importante observar como se incluye en la ruta del arhivo js o css
**/nuestro\_plugin/**. Esto hace que la magia funcione

Consejos para desarrollar Plugins
=================================

Una vez que ya hemos desarrollado todo lo necesario, nuestro plugin está
listo para ser distribuido (aunque sería conveniente añadir unos cuantos
extras, como un readme o un fichero SQL).

Después de instalar el plugin en /app/plugins, podemos acceder al mismo
siguiendo la URL /nombreplugin/nombrecontrolador/accion. En nuestro
plugin de ejemplo para ordenar pizza, accedemos a
PizzaPeticionesController en /pizza/pizzaPeticiones.

Algunos consejos útiles a tener en cuenta cuando trabajamos con plugins
en nuestras aplicaciones CakePHP:

-  Si no definimos [Plugin]AppController y [Plugin]AppModel, recibiremos
   errores "Missing Controller" cuando intentemos accede a un
   controlador del plugin.
-  Podemos tener un controlador por defecto con el mismo nombre de
   nuestro plugin. Podemos acceder a él via /[plugin]/accion. Por
   ejemplo, a un plugin llamado 'usuarios' con un controlador
   UsuariosController podemos acceder en /usuarios/add si no hay ningún
   plugin llamado AddController en la carpeta [plugin]/controllers.
-  Podemos definir el diseño de nuestros plugins en
   app/plugin/views/layouts. En caso contrario, los plugins usarán, por
   defecto, los diseños en /app/views/layouts folder by default.
-  Usando $this->requestAction('/plugin/controller/accion'); en los
   controladores logramos comunicar distintos plugins.
-  Si pretendemos usar requestAction, debemos asegurarnos de que los
   nombres de modelos y controladores son tan únicos como sea posible.
   Si no fuera así, pueden surgir errores PHP del tipo "clase redefinida
   ..."

