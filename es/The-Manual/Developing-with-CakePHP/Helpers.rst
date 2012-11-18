Helpers
#######

Helpers son las clases simil-componentes para la capa de aplicación de
tu aplicación. Ellos contienen la lógica presentacional que es
compartida entre vistas, elementos, o layouts. Este capítulo te mostrará
cómo crear tus propios helpers, abarcando las tareas básicas en las que
los helpers del núcleo CakePHP pueden ayudarte a lograr. Para más
información sobre los helpers del núcleo, dirígete a `Helpers 'de
fábrica' </es/view/181/built-in-helpers>`_.

Usando Helpers
==============

Tú usas helpers en CakePHP haciendo que un controlador sepa de su
existencia. Cada controlador tiene una propiedad ``$helpers`` que lista
los helpers que estarán disponibles en la vista. Para habilitar un
helper en tu vista, agrega el nombre del helper en el arreglo
``$helpers`` del controlador.

::

    <?php
    class BakeriesController extends AppController {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

También pueden agregar helpers desde dentro de una acción, de esta forma
sólo estarán disponibles para esa acción y no para las demás acciones
que permanezcan a ese controlador. Esto ahorra poder de procesamiento
para las demás acciones que no usan el helper, y mantinen al controlador
mejor organizado.

::

    <?php
    class BakeriesController extends AppController {
        function bake {
            $this->helpers[] = 'Time';
        }
        function mix {
            // El helper Time no es cargado aquí, no estará disponible.
        }
    }
    ?>

Creando Helpers
===============

Si un helper del core (o alguno mostrado en Cakeforge o en la Bakery) no
se ajusta a tus necesidades, los helpers son fáciles de crear.

Digamos que quisieramos crear un helper que pudiera ser usado para
mostrar como salida un link específicamente creado con CSS que lo
necesitas en diferentes partes de tu aplicación. Para poder ajustar tu
lógica dentro de la estructura existente de helpers de CakePHP,
necesitarás crear una nueva clase en /app/views/helpers. Llamemos a
nuestro helper LinkHelper. El archivo de clase se verá algo como esto:

::

    <?php
    /* /app/views/helpers/link.php */

    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // Lógica para crear un link con un formato específico va aqui...
        }
    }

    ?>

Existen algunos métodos incluidos en la clase de Helper en CakePHP de la
cual quisieras sacar ventaja:

``output(string $string)``

Usa esta función para enviar cualquier información de regreso a tu
vista.

::

    <?php
    function makeEdit($title, $url) {
        // Usa la función de salida del helper para enviar
        // datos con formato de regreso a la vista:
        return $this->output(
            "<div class=\"editOuter\">
             <a href=\"$url\" class=\"edit\">$title</a>
             </div>"
        );
    }
    ?>

Including other Helpers
-----------------------

Es posible que necesites usar alguna funcionalidad existente en otro
helper. Para hacerlo, puedes especificar los helpers que deseas utilizar
con un arreglo $helpers, con el formato que usarías en un controlador.

::

    <?php
    /* /app/views/helpers/link.php (usando otros helpers) */
    class LinkHelper extends AppHelper {
        var $helpers = array('Html');

        function makeEdit($title, $url) {
            // Usa el helper de HTML para mostrar
            // información con formato:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return $this->output("<div class=\"editOuter\">$link</div>");
        }
    }
    ?>

Callback method
---------------

Helpers feature a callback used by the parent controller class.

``beforeRender()``

The beforeRender method is called after the controller's beforeRender
method but before the controller's renders views and layout.

Usando tu Helper
----------------

Una vez hayas creado tu helper y de haberlo colocado dentro de
/app/views/helpers/, podrás incluirlo dentro de tus controllers usando
la variable especial $helpers.

Una vez tu controller se haya dado cuenta de esta nueva clase, podrás
usarla en los views accesando mediante una variable llamada por ese
helper:

::

    <!-- crear un link usando el nuevo helper -->
    <?php echo $link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>

Recuerda incluir el FormHelper en el array de $helpers si es apropiado.
Los ayudantes Html y Session (si esta activa una sesión) siempre estarán
disponibles.

Creando Funcionalidad para todos los Helpers
============================================

Todos los helpers extienden a una clase especial, AppHelper (así como
los modelos extienden AppModel y los controladores extienden
AppController). Para crear funcionalidad que podría estar disponible
para todos los helpers, crea /app/app\_helper.php.

::

    <?php
    class AppHelper extends Helper {
        function customMethod () {
        }
    }
    ?>

Helpers del Core
================

CakePHP contiene un buen número de helpers que ayudan en la creación de
la vista. Ellos asisten en crear notación (markup) con buen formato
(incluyendo formas), ayudan a dar formato a texto, tiempo y números, y
también pueden acelerar la funcionalidad de Ajax. Aquí está un resumen
de los helpers disponibles por defecto. Para más imformación revisa
`Helpers del Core </es/view/181/Core-Helpers>`_.

+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Helper de CakePHP                         | Descripción                                                                                                                                                                                             |
+===========================================+=========================================================================================================================================================================================================+
| `Ajax </es/view/208/AJAX>`_               | Usado en conjunto con Prototype Javascript Library para crear funcionalidad en las vistas. Contiene métodos rápidos para drag/drop (levantar/tirar), formularios ajax & enlaces, observadores, y más.   |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Cache </es/view/213/Cache>`_             | Es usado por el núcleo (core) para almacenar el contenido de las vistas en caché.                                                                                                                       |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Form </es/view/182/Form>`_               | Crea formularios HTML y elementos de formulario que se poblan solas y manejan problemas de validación.                                                                                                  |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Html </es/view/205/HTML>`_               | Métodos convenientes para crear código (markup) bien formateado. Imágenes, links, tablas, tags de headers y más.                                                                                        |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Javascript </es/view/207/Javascript>`_   | Usado para 'escapar' valores para usarse en JavaScript, escribir tus propios objetos JSON, y dar formato a bloques de código.                                                                           |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Number </es/view/215/Number>`_           | Formato para números y tipo de cambio.                                                                                                                                                                  |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Paginator </es/view/496/Paginator>`_     | Paginar y ordenar información de modelos.                                                                                                                                                               |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Rss </es/view/494/RSS>`_                 | Métodos convenientes para regresar datos RSS feed XML.                                                                                                                                                  |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Session </es/view/484/Session>`_         | Aceso para escribir valores de la sesión en las vistas.                                                                                                                                                 |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Text </es/view/216/Text>`_               | Enlaces inteligentes, marcadores, truncado inteligente de palabras.                                                                                                                                     |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Time </es/view/217/Time>`_               | Detección de proximidad (es este siguiente año?), buen formateo de cadenas de caracteres (Hoy, 10:20 am) y conversiones de usos horarios.                                                               |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Xml </es/view/380/XML>`_                 | Métodos convenientes para crear elementos y headers XML.                                                                                                                                                |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

