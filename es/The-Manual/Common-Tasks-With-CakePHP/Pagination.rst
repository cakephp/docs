Paginación
##########

Uno de los obstáculos principales al crear aplicaciones web flexibles y
amigables al usuario (*user-friendly*) es diseñar una Interfaz de
Usuario intuitiva. Muchas aplicaciones tienden a crecer en tamaño y
complejidad rápidamente, y tanto diseñadores como programadores se
encuentran conque no pueden arreglárselas para visualizar cientos o
miles de registros. Refactorizar lleva tiempo, y el rendimiento y la
satisfacción del usuario pueden sufrir.

Visualizar un número razonable de registros por página ha sido siempre
una parte crítica de toda aplicación y solía causar muchos dolores de
cabeza a los desarrolladores. CakePHP aligera la carga del desarrollador
proveyendo una manera rápida y fácil de paginar los datos.

El ayudante ``PaginatorHelper`` ofrece una genial solución porque es
fácil de usar. Además de paginación, empaqueta algunas características
de ordenación muy fáciles de usar. Por último, pero no menos importante,
también están soportados el paginado y la ordenación Ajax.

Preparación del controlador
===========================

En el controlador comenzamos definiendo los valores de paginación por
defecto en la variable $paginate. Es importante señalar que la clave
'order' debe estar definida en la estructura de array dada.

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

También puedes incluir otras opciones para find(), como *fields*

::

    class RecipesController extends AppController {

        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

Pueden incluirse otras claves en el array *$paginate* similares a los
parámetos del método *Model->find('all')*, esto es: *conditons*,
*fields*, *order*, *limit*, *page*, *contain* y *recursive*. De hecho,
puedes definir más de un conjunto de valores de paginación por defecto
en el controllador, simplemente nombra cada parte del array según el
modelo que desees configurar:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'Recipe' => array (...),
            'Author' => array (...)
        );
    }

Ejemplo de sintaxis usando Containable Behavior:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

Una vez que la variable *$paginate* ha sido definida, podemos llamar al
método *paginate()* en las acciones del controlador. Este método
devuelve los resultados de *find('all')* del modelo (aplicándoles los
parámetros de la paginación), y obtiene algunas estadísticas de
paginación adicionales, que son pasadas a la Vista de forma invisible.
Este método también añade PaginatorHelper a la lista de helpers en tu
controlador, si es que no estaba ya.

::

    function list_recipes() {
        // similar to findAll(), but fetches paged results
        $data = $this->paginate('Recipe');
        $this->set(compact('data'));
    }

Puedes filtrar los registros pasando condiciones como segundo parámetro
al método ``paginate()``

::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));

O también puedes ajustar la clave *conditions* en la variable
``paginate``.

Pagination in Views
===================

Es cosa tuya decidir cómo mostrar los registros al usuario, aunque lo
más habitual es hacerlo mediante tablas HTML. Los ejemplos que siguen
asumen una disposición tabular, pero el PaginatorHelper, disponible en
las vistas, no siempre necesita restringirse de ese modo.

Como ya se ha dicho, PaginatorHelper ofrece capacidades para ordenación
que pueden integrarse fácilmente en las cabeceras de las columnas de tus
tablas:

::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

Los enlaces generados por el método sort() de PaginatorHelper permiten a
los usuarios hacer click en las cabeceras de las tablas y alternar la
ordenación de los datos por un campo dado.

También es posible ordenar una columna en base a asociaciones:

::

    <table>
        <tr> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

El ingrediente final de la paginación en las vistas es añadir la
navegación de páginas, que también viene proporcionada por
PaginationHelper.

::

    <!-- Muestra los números de página -->
    <?php echo $paginator->numbers(); ?>
    <!-- Muestra los enlaces para Anterior y Siguiente -->
    <?php
        echo $paginator->prev('« Previous ', null, null, array('class' => 'disabled'));
        echo $paginator->next(' Next »', null, null, array('class' => 'disabled'));
    ?> 
    <!-- Muestra X de Y, donde X es la página actual e Y el total del páginas -->
    <?php echo $paginator->counter(); ?>

El texto generado por el método counter() puede personalizarse usando
marcadores especiales:

::

    <?php
    echo $paginator->counter(array(
        'format' => 'Page %page% of %pages%, showing %current% records out of
                 %count% total, starting on record %start%, ending on %end%'
    )); 
    ?>

Para pasar todos los argumentos de la URL a las funciones del paginador,
añade lo siguiente a tu vista:

::

        $paginator->options(array('url' => $this->passedArgs));

También puedes especificar qué parámetros pasar manualmente:

::

        $paginator->options(array('url' =>  array("0", "1")));

Paginación AJAX
===============

Es muy fácil incorporar funcionalidad Ajax en la paginación. El único
código extra que necesitas es incluir la librería JavaScript Prototype,
ajustar el indicador (el icono de carga dentro la DIV) y especificar la
DIV que será actualizada en lugar de recargar la página.

No olvides añadir el componente RequestHandler para poder usar llamadas
Ajax en tu controlador:

::

    var $components = array('RequestHandler'); 

Cambios en el Layout
--------------------

Primero, incluiremos la biblioteca Prototype en la cabecera, ajustaremos
nuestra imagen para el indicador de estado (spinner.gif), y ajustaremos
nuestra DIV contenedora principal, "content" (cuyo contenido será
actualizado por la llamada Ajax).

He aquí un ejemplo de cómo podría ser este layout (parcialmente):

::

    <head>
        <title><?php echo $title_for_layout; ?></title>
            <?php echo $javascript->link(array('prototype')); ?>
            <style type="text/css">
                    div.disabled {
                            display: inline;
                            float: none;
                            clear: none;
                            color: #C0C0C0;
                    }
            </style>
    </head>
    <body>
    <div id="main">
            <div id="spinner" style="display: none; float: right;">
                    <?php echo $html->image('spinner.gif'); ?>
            </div>
            <div id="content">
                    <?php echo $content_for_layout; ?>
            </div>
    </div>
    </body>
    </html>

Cambios en la Vista
-------------------

La única configuración extra para la paginación Ajax se hace mediante el
método options() del PaginatorHelper, el cual especifica parámetros Ajax
requeridos. En este caso, estamos especificando que los enlaces de
paginación deberían actualizar el elemento con el ID 'content' con los
datos resultantes, y que queremos mostrar 'spinner' como indicador de
carga.

Si no se especifica la clave 'update', PaginatorHelper generará enlaces
de paginación y ordenación no Ajax.

::

    <?php 
    //Ajusta los elementos update e indicator mediante su DOM ID
    $paginator->options(array('update' => 'content', 'indicator' => 'spinner'));
     
    echo $paginator->prev('<< Previous', null, null, array('class' => 'disabled'));
     
    echo $paginator->next('Next >>', null, null, array('class' => 'disabled')); 
    ?>
     
    <!-- muestra X de Y, donde X es la página actual e Y es el número de páginas -->
    <?php echo $paginator->counter(); ?>

Custom Query Pagination
=======================

Fix me: Please add an example where overriding paginate is justified

A good example of when you would need this is if the underlying DB does
not support the SQL LIMIT syntax. This is true of IBM's DB2. You can
still use the CakePHP pagination by adding the custom query to the
model.

Should you need to create custom queries to generate the data you want
to paginate, you can override the ``paginate()`` and ``paginateCount()``
model methods used by the pagination controller logic.

Before continuing check you can't achieve your goal with the core model
methods.

The ``paginate()`` method uses the same parameters as ``Model::find()``.
To use your own method/logic override it in the model you wish to get
the data from.

::

    /**
     * Overridden paginate method - group by week, away_team_id and home_team_id
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

You also need to override the core ``paginateCount()``, this method
expects the same arguments as ``Model::find('count')``. The example
below uses some Postgres-specifc features, so please adjust accordingly
depending on what database you are using.

::

    /**
     * Overridden paginateCount method
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

The observant reader will have noticed that the paginate method we've
defined wasn't actually necessary - All you have to do is add the
keyword in controller's ``$paginate`` class variable.

::

    /**
    * Add GROUP BY clause
    */
    var $paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );
    /**
    * Or on-the-fly from within the action
    */
    function index() {
        $this->paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );

However, it will still be necessary to override the ``paginateCount()``
method to get an accurate value.
