Paginator
#########

El Paginator helper, se usa para imprimir los controles de los números
de página y de los links siguiente y previo.

Ve también `Tareas comunes con CakePHP -
Paginacion </es/view/164/pagination>`_ para más información.

Métodos
=======

options($options = array())

-  options() : Opciones por defecto de la paginación para los links. Si
   se suministra un string, éste se usa como el id del elemento DOM a
   updatear. Vea #options para la lista de las llaves posibles.

options() configura todas las opciones para el Paginator Helper. Las
opciones soportadas son:

**format**

Formato del contador. Los formatos soportados son 'range' y 'pages' y
custon (personalizado) que es el por defecto. En el modo por defecto el
string proporcionado es parseado y los tokens son reemplazados por sus
verdaderos valores. Los tokens disponibles son:

-  %page% - la página actual.
-  %pages% - número total de páginas.
-  %current% - número actual de registros mostrados.
-  %count% - número total de registros en el conjunto resultado.
-  %start% - numero del primer registro mostrado.
-  %end% - numero del ultimo registro mostrado.

Ahora que sabes los tokens disponibles, puedes usar el método counter()
para mostrar todos tipo de información retornada en los resultados, por
ejemplo:

::


    echo $paginator->counter(array(
            'format' => 'Pagina %page% de %pages%, 
                         mostrando %current% registros de un total de %count%, 
                         comenzando en el registro %start%, terminando en el %end%'
    )); 

**separator**

El separador entre la pagina actual y el numero de paginas. El valor por
defecto es ' of '. Esto se usa en conjunto con formato = 'pages'

**url**

La url de la accion de paginación. url tiene algunas sub opciones
también

-  sort - la llave por la cual los registros estan ordenados
-  direction - la dirección en la cual se ordena. Valor por defecto
   'ASC'
-  page - el número de página a mostrar

**model**

El nombre del modelo que esta siendo paginado.

**escape**

Define si el campo de título de los links debería ser sin HTML. Valor
por defecto true.

**update**

El id del elemento DOM a updatear con los resultados de una llamada
AJAX.. Si no esta especificada, se crearán links regulares.

**indicator**

El id del elemento DOM que será mostrado como indicador de descarga o
trabajo en curso mientras se ejecuta la llamada AJAX.

link($title, $url = array(), $options = array())

-  string $title - El título del link.
-  mixed $url Url para la acción. Ver Router::url()
-  array $options Opciones para el link. ver options() para la lista de
   llaves.

Crea un link regular o AJAX con los parametros de paginación.

::

    echo $paginator->link('Ordenados por título en pagina 5', 
            array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

Si se creó en la vista en ``/posts/index`` Debería crear un link
apuntando a '/posts/index/page:5/sort:title/direction:desc'
