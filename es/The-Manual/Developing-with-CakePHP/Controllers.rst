Controladores
#############

 

Introducción
============

Un controlador (Controller) se usa para manejar la lógica de cierta
sección de su aplicación. Comúnmente, los controladores (Controllers)
son usados para manejar la lógica de un solo modelo (Model). Por
ejemplo, si estás construyendo un sitio de una pastelería, podrías tener
un RecetasController y un IngredientesController para manejar las
recetas y sus ingredientes. En CakePHP, los controladores se nombran
según el modelo que manejan, y se ponen siempre en plural.

El modelo Receta es manejado por el RecetasController, el modelo
Producto es manejado por el ProductosController, y así sucesivamente.

Los controladores de su aplicación son sub-clases de la clase
AppController de CakePHP, que a su vez extiende la clase principal
Controller. La clase AppController puede ser definida en
/app/app\_controller.php y debe contener métodos que son compartidos
entre todos los controladores de su aplicación. AppController es una
sub-clase de Controller que es una clase de la biblioteca estándar de
Cake.

Los controladores pueden tener cualquier cantidad de métodos a los que
normalmente se les llama *acciones*. Las acciones son métodos de
controladores en tu aplicación web para mostrar vistas. Una acción es un
único método de un controlador. El Dispatcher de CakePHP ejecuta
acciones cuando una solicitud entrante contiene en su URL el nombre de
una acción del controlador. El controlador estaría ubicado en
/app/controllers/recetas\_controller.php con el siguiente contenido:

::

        <?php
        
        # /app/controllers/recetas_controller.php

        class RecetasController extends AppController {
            function ver($id)     {
                //la lógica de la acción va aqui...
            }

            function compartir($cliente_id, $receta_id) {
                //la lógica de la acción va aqui...
            }

            function buscar($query) {
                //la lógica de la acción va aqui...
            }
        }

        ?>

Para que puedas usar un controlador de manera productiva en tu propia
aplicación, repasaremos algunos de los atributos y métodos provistos por
los controladores de CakePHP.

The App Controller
==================

Como se comentó en la introducción, la clase AppController es la clase
superior a todos los controladores de tu aplicación. AppController
extiende la clase Controller incluida en la libreria base de CakePHP.
Así, AppController es definida en /app/app\_controller.php como:

::

    <?php
    class AppController extends Controller {
    }
    ?>

Las propiedades y métodos creados en tu AppController estarán
disponibles para todos los controladores de tu aplicación. Es el sitio
ideal para poner el código que será común a todos los controladpres de
tu aplicación. Los Componentes (los cuales veremos después) son lo más
utilizado para el código que se utiliza en la mayoría (pero no
necesariamente en todos) los controladores

Cuando se aplica la herencia a los objetos, CakePHP también realiza un
trabajo extra cuando existen atributos especiales en el controlador,
como una lista de componentes o ayudantes utilizados por un controlador.
En estos casos, los arrays del AppControler son combinados con los
arrays de la clase hijo

CakePHP combina las siguientes variables de AppController con los
controladores de tu aplicación:

-  $components
-  $helpers
-  $uses

Por favor, recuerda realizar las llamadas a los callbacks de
AppController desde los controladores de tu aplicación para que todo
funcione correctamente:

::

    function beforeFilter(){
        parent::beforeFilter();
    }

The Pages Controller
====================

El núcleo de CakePHP viene con un controlador por defecto llamado *the
Pages Controller* (el Controlador de Páginas)
(cake/libs/controller/pages\_controller.php). La página de inicio que
ves luego de la instalación, es generada utilizando este controlador.
Por ejemplo: Sí creas un archivo de vista app/views/pages/about\_us.ctp
puedes accesarlo utilizando la url http://example.com/pages/about\_us

Cuando "cocinas" una aplicación utilizando la consola de CakePHP el
controlador de páginas es copiado a tu carpeta app/controllers/ y puedes
modificarla a tus necesidades si es necesario. O simplemente puedes
copiar el archivo page\_controller.php del núcleo a tu app.

No modifiques directamente NINGUN archivo dentro de la carpeta ``cake``
para evitar problemas futuros en la actualización del núcleo

Atributos del Controlador
=========================

Para ver la lista completa de atributos visite la API de CakePHP en la
sección
`https://api.cakephp.org/class/controller <https://api.cakephp.org/class/controller>`_.

$name
-----

Los usuarios de PHP4 deberían empezar la definición de sus controladores
con el atributo $name. Este atributo debería ser asignado con el nombre
del controlador. Usualmente este es simplemente el plural del modelo
principal al que el controlador está asociado. Esto previene algunos
problemas de distinción de mayúsculas que tiene PHP4 para los nombres de
las clases.

::

    <?php

    #   $name Ejemplo de uso del atributo $name

    class RecetasController extends AppController {
       var $name = 'Recetas';
    }

    ?>   

$components, $helpers y $uses
-----------------------------

Los siguientes atributos más comunmente utilizados del controlador
indican a CakePHP qué ayudantes (*helpers*), componentes (*components*),
y modelos (*models*) utilizarás en conjunción con el controlador actual.
Utilizar esos atributos hace que las clases MVC estén disponibles al
controlador como variable de clase(\ ``$this->ModelName``, por ejemplo).

Cada controlador tiene alguna de esas clases disponibles por defecto,
así que no necesitarás configurar tu controlador.

Los controladores tienen acceso a su modelo primario disponible por
defecto. Nuestro *RecipesController* tendrá disponible la clase modelo
*Recipe* en ``$this->Recipe``, y nuestro *ProductsController* también
posee el modelo *Product* en ``$this->Product``.

Los ayudantes (*Helpers*) *Html*, *Form*, y *Session* están siempre
disponibles por defecto, como lo es *SessionComponent*. Para aprender
más sobre estas clases, no olvides leer sus respectivas secciones más
adelante en este manual.

Veamos cómo decirle a un controlador de CakePHP que planeas utilizar
clases MVC adicionales.

::

    <?php
    class RecipesController extends AppController {
        var $name = 'Recipes';

        var $uses = array('Recipe', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>

Cada una de estas variables es fusionada con sus valores heredados, por
lo tanto no es necesario (por ejemplo) declarar le ayudante (*helper*)
*Form*, o cualquier cosa que es declarada en tu controlador *App*.

Atributos Relacionados con la Página: "$layout" y "$pageTitle"
--------------------------------------------------------------

Existen unos pocos atributos en los controladores de CakePHP que te dan
control sobre cómo se colocan tus vistas (*views*) dentro del diseño
(*layout*).

Al atributo ``$layout`` se le puede asignar el nombre de un diseño
(*layout*) guardado en ``/app/views/layouts``. Especificas un diseño al
igualar ``$layout`` al nombre del archivo con el diseño excluyendo la
extensión ``.ctp``. Si este atributo no ha sido definido, CakePHP
renderiza el diseño por defecto, ``default.ctp``. Si no has definido un
diseño en ``/app/views/layouts/default.ctp``, el diseño por defecto del
núcleo de CakePHP’s será renderizado.

::

    <?php

    //   Usando <em>$layout</em> para definir un diseño alternativo

    class RecipesController extends AppController {
        function quickSave() {
            $this->layout = 'ajax';
        }
    }

    ?>

También puedes cambiar el título de la página (que está localizado en la
barra en la parte superior de tu navegador) utilizando ``$pageTitle``.
Para que esto funcione apropiadamente, tu diseño (*layout*) necesita
incluir la variable ``$title_for_layout`` como mínimo entre las
etiquetas <title> y </title> en la cabecera del documento HTML.

::

    <?php

    //   Usando <em>$pageTitle</em> para definir el título de la página

    class RecipesController extends AppController {
        function quickSave() {
            $this->pageTitle = 'Mi título del motor de búsquedas optimizado';
        }
    }

    ?>

También puedes establecer el título desde la vista (*view*) usando
``$this->pageTitle`` (Has de incluir la parte ``$this->``; se
recomienda, ya que separa la lógica del diseño y el contenido). Para una
página estática has de usar ``$this->pageTitle`` en la vista si quieres
un título personalizado.

Si ``$this->pageTitle`` no está establecido, se generará automáticamente
un título basado en el nombre del controlador, o el nombre del fichero
de la vista en el caso de una página estática.

El Atributo de Parámetros ("$params")
-------------------------------------

Los parámetros del controlador están disponibles en ``$this->params`` en
tu controlador de CakePHP. Esta variables es usada para proporcionar
acceso a la información sobre la petición actual. El uso más común de
``$this->params`` es obtener acceso a información que ha sido entregada
al controlador a través de las operaciones POST o GET.

form
~~~~

``$this->params['form']``

Cualquier dato POST de cualquier formulario se almacena aquí, incluyendo
información también hallada en ``$_FILES``.

admin
~~~~~

``$this->params['admin']``

Contiene el valor 1 si la acción (*action*) actual fue invocada mediante
enrutamiento "admin".

bare
~~~~

``$this->params['bare']``

Almacena un 1 si el diseño (*layout*) actual está vacío; 0 si no.

isAjax
~~~~~~

``$this->params['ajax']``

Almacena un 1 si la petición actual es una llamada ajax; 0 si no. Esta
variables sólo se establece si el componente ``RequestHandler`` es usado
en el controlador.

controller
~~~~~~~~~~

``$this->params['controller']``

Almacena el nombre del controlador actual que está sirviendo la
petición. Por ejemplo, si fue pedida la URL /posts/view/1,
``$this->params['controller']`` será igual a "posts".

action
~~~~~~

``$this->params['action']``

Almacena el nombre de la acción actual sirviendo la petición. Por
ejemplo, si fue pedida la URL /posts/view/1, entonces
``$this->params['action']`` será igual a "view".

pass
~~~~

``$this->params['pass']``

Almacena la cadena de consulta GET enviada con la petición actual. Por
ejemplo, si fue pedida la URL /posts/view/?var1=3&var2=4, entonces
``$this->params['pass']`` será igual a "?var1=3&var2=4".

url
~~~

``$this->params['url']``

Almacena la URL actual pedida, junto con los pares clave-valor de
variables *get*. Por ejemplo, si se llamó a la URL
/posts/view/?var1=3&var2=4, entonces ``$this->params['url']`` debería
contener:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

Usado para manejar datos POST enviados desde los formularios de
``FormHelper`` al controlador.

::

    // El helper FormHelper es usado para crear un elemento de formulario:
    $form->text('User.first_name');

El cual al ser renderizado, se ve parecido a:

::

    <input name="data[User][first_name]" value="" type="text" />

Cuando el formulario es enviado al controlador mediante POST, los datos
aparecen en ``this->data``

::

    // El valor first_name enviado se puede encontrar aquí:
    $this->data['User']['first_name'];

prefix
~~~~~~

``$this->params['prefix']``

Establecido al prefijo de enrutado. Por ejemplo, este atributo
contendría la cadena "admin" durante una petición a
/admin/posts/someaction.

named
~~~~~

``$this->params['named']``

Almacena cualquier parámetro con nombre /clave:valor/ de la cadena de
petición de la URL. Por ejemplo, si se pidió la URL
/posts/view/var1:3/var2:4, entonces ``$this->params['named']`` debería
contener el array:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Otros Atributos
---------------

Aunque puedes ojear todos los detalles para todos los atributos del
controlador en el API, hay otros atributos del controlador que merecen
sus propias secciones en el manual.

El atributo ``$cacheAction`` ayuda en el "cacheado" (*caching*) de
vistas (*views*), y el atributo ``$paginate`` es usado para establecer
las opciones por defecto de paginado para el controlador. Para más
información sobre cómo utilizar esos atributos, écha un vistazo a sus
respectivas secciones más adelante en este manual.

persistModel
------------

Usado para crear instancias almacenadas en caché de modelos (Models) un
uso de Controlador (Controller). Cuando se coloca en verdadero (true),
todos los modelos relacionados con el controlador (Controller) se
almacenan en caché. Esto puede incrementar el desempeño en muchos casos.

Métodos del Controlador
=======================

Para una lista completa de los métodos del controlador y sus
descripciones visita el API de CakePHP. Echa un vistazo a
`https://api.cakephp.org/class/controller <https://api.cakephp.org/class/controller>`_.

Interactuando con Vistas
------------------------

set
~~~

``set(string $variable, mixed $valor)``

El método ``set()`` es la principal manera de enviar datos desde tu
controlador a tu vista (*view*). Una vez que has utilizado ``set()``, la
variable puede ser accedida en tu vista.

::

    <?php
        
    // Primero pasas datos desde el controlador:

    $this->set('color', 'azul');

    // Despueś, en las vista, puedes utilizar el dato:
    ?>

    Has seleccionado <?php echo $color; ?>ar la tarta.

El método ``set()`` también toma una array asociativo como primer
parámetro. A menudo, esto puede ser una manera rápida de asignar un
conjunto de información a la vista.

Las claves (*keys*) serán flexionadas (*inflected*) antes de ser
asignadas a la vista ('clave\_con\_subrayado' se convierte en
'claveConSubrayado', etc.):

::

    <?php
        
    $data = array(
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95
    );

    // hace que $color, $type, y $basePrice
    // estén disponibles a la vista:

    $this->set($data);  

    ?>

render
~~~~~~

``render(string $action, string $layout, string $file)``

El método ``render()`` es llamado automáticamente al final de cada
acción de controlador pedida. Este método lleva a cabo toda la lógica de
la vista (usando los datos que has proporcionado con el método
``set()``), coloca la vista (*view*) dentro de su diseño (*layout*) y lo
sirve de vuelta al usuario final.

El fichero de vista por defecto utilizado por ``render`` es determinado
por convenio. Por ejemplo, si se pide la acción ``search()`` del
controlador ``RecipesController``, será renderizado el fichero de vista
en /app/views/recipes/search.ctp.

::

    class RecipesController extends AppController {
        function search() {
            // Render the view in /views/recipes/search.ctp
            $this->render();
        }
    ...
    }

A pesar de que CakePHP lo llamará automáticamente (a menos que hayas
establecido ``$this->autoRender`` a falso) después de cada lógica de las
acciones, puedes utilizar ``render`` para especificar un fichero de
vista alternativo indicando un nombre de acción en el controlador usando
``$action``.

Si ``$action`` comienza por '/' se asume que es un fichero de vista o
elemento relativo a la carpeta ``/app/views``. Esto permite el
renderizado inmediato de elementos, algo muy útil en las llamadas ajax.

::

    // Render the element in /views/elements/ajaxreturn.ctp
    $this->render('/elements/ajaxreturn');

También puedes especificar un fichero de vista alternativo usando el
tercer parámetro, ``$file``. Cuando estés usando ``$file``, no olvides
utilizar unas pocas de las constantes globales de CakePHP (como
``VIEWS``).

El parámetro ``$layout`` te permite especificar el diseño en el que la
vista es renderizada.

Control de Flujo
----------------

redirect
~~~~~~~~

``redirect(string $url, integer $status, boolean $exit)``

El método de control de flujo que más frecuentemente utilizarás es
``redirect()``. Este método toma su primer parámetro en forma de URL
relativa con formato de CakePHP. Por ejemplo, cuando un usuario ha hecho
un pedido satisfactoriamente, probablemente desearás redirigirle a una
ventana de recibo.

::

    function realizarPedido() {

        // La lógina para finalizar el pedido va aquí

        if($satisfactorio) {
            $this->redirect(array('controller' => 'pedidos', 'action' => 'gracias'));
        } else {
            $this->redirect(array('controller' => 'pedidos', 'action' => 'confirmar'));
        }
    }

También puedes utilizar una URL absoluta o relativa como argumento
``$url``:

::

    $this->redirect('/pedidos/agradecimientos'));
    $this->redirect('http://www.ejemplo.com');

También puedes pasar datos a la acción:

::

    $this->redirect(array('action' => 'editar', $id));

El segundo parámetro de ``redirect()`` te permite definir un código de
estado HTTP que acompañe la redirección. Puede que desees usar 301
(movido permanentemente) o 303 (mirar otro), dependiendo de la
naturaleza de la redirección.

El metodo ejecutará ``exit()`` tras la redirección a menos que
establezcas el tercer parámetro a ``false``.

Si necesitas redirigir a la página origen(\ *referer page*) puedes usar:

::

    $this->redirect($this->referer());

flash
~~~~~

``flash(string $message, string $url, integer $pause)``

De manera similar a ``redirect()``, el método ``flash()`` es usado para
redirigir un usuario a una nueva página tras una operación. El método
``flash()`` es diferente en cuanto que muestra un mensaje antes de
enviar al usuario a otra URL.

El primer parámetro debería contener el mensaje a mostrar, y el segundo
parámetro es una URL relativa con formato CakePHP. CakePHP mostrará el
mensaje en ``$message`` durante el número de segundos en ``$pause``
antes de reenviar al usuario a otra página.

Para mensajes flash en la página, cerciónate de echarle un ojo al método
``setFlash()`` del componente ``SessionComponent``.

Retrollamadas ("Callbacks")
---------------------------

Los controladores de CakePHP vienen con retrollamas (*callbacks*)
empotradas que puedes usar para insertar lógica justo antes o después de
que las acciones del controlador sean llevadas a cabo.

``beforeFilter()``

Esta función se ejecuta antes de toda acción en el controlador. Es un
lugar práctico para comprobar una sesión activa o inspeccionar los
permisos del usuario.

``beforeRender()``

Llamada tras la lógica de acción del controlador, pero antes de que la
vista es renderizada. Este *callback* no es utilizado a menudo, pero
puedes necesitarlo si estás llamando a ``render()`` manualmente antes
del final de una acción dada.

``afterFilter()``

Llamada tras toda acción del controlador.

``afterRender()``

Llamada tras haber sido renderizada una acción.

CakePHP también soporta *callbacks* relacionados con el *scaffolding*.

``_beforeScaffold($metodo)``

``$metodo`` es el nombre del método llamado, por ejemplo: ``index``,
``edit``, etc.

``_afterScaffoldSave($metodo)``

``$metodo`` es el nombre del método llamado tras ``edit`` o ``update``.

``_afterScaffoldSaveError($metodo)``

``$metodo`` es el nombre del método llamado tras ``edit`` o ``update``.

``_scaffoldError($metodo)``

``$metodo`` es el nombre del método llamado, por ejemplo: ``index``,
``edit``, etc.

Otros Métodos Útiles
--------------------

constructClasses
~~~~~~~~~~~~~~~~

Este método carga los modelos requeridos por el controlador. El proceso
de carga es realizado por CakePHP normalmente, pero hay que tener a mano
este método cuando se accede a los controladores desde una perspectiva
diferente. Si necesitas CakePHP en un script de línea de comando o algún
otro uso externo, ``constructClasses()`` será útil.

referer
~~~~~~~

Devuelve la URL remitente de la petición actual. Ver
*`referer <https://en.wikipedia.org/wiki/Referer>`_* en la wikipedia para
más información.

disableCache
~~~~~~~~~~~~

Usado para indicarle al **navegador** del usuario que no guarde en caché
los resultados de la petición actual. Esto es diferente a guardar en
caché una vista (*view caching*), tratado en un capítulo posterior.

Las cabeceras enviadas para conseguir esto son:

-  ``Expires: Mon, 26 Jul 1997 05:00:00 GMT``
-  ``Last-Modified: [current datetime] GMT``
-  ``Cache-Control: no-store, no-cache, must-revalidate``
-  ``Cache-Control: post-check=0, pre-check=0``
-  ``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $datos, mixed $operadores, string $bool, boolean $exclusivo)``

Usa este método para convertir un conjunto de datos de modelo recibidor
mediante POST (de *inputs* compatibles con ``HtmlHelper``) en un
conjunto de condiciones de búsqueda para un modelo. Esta función ofrece
un atajo rápido para la construcción de la lógica de búqueda. Por
ejemplo, un usuario administrativo puede querer buscar pedidos para
saber qué elementos necesitan ser enviados. Puedes utilizar los
ayudantes ``FormHelper`` y ``HtmlHelper`` para crear un formulario
rápido basado en el modelo Pedido. Entonces, una acción de un
controlador puede usar los datos recibidos desde ese formulario para
encauzar las condiciones de búsqueda:

::

    function index() {
        $condiciones = $this->postConditions($this->data);
        $pedidos = $this->Pedido->find("all",compact('condiciones'));
        $this->set('pedidos', $pedidos);
    }

Si $this->data[‘Pedido’][‘destino’] es igual a *“Old Towne Bakery”*,
postConditions convierte esa condición en un array compatible para ser
usado en un método ``Model->find()``. En este caso,
``array(“pedido.destino” => “Old Towne Bakery”)``.

Si deseas usar un operador SQL distinto entre términos, proporciónalos
usando el segundo parámetro.

::

    /*
    contenidos de $this->data
    array(
        'Pedido' => array(
            'num_items' => '4',
            'referrer' => 'Ye Olde'
        )
    )
    */

    //Obtengamos los pedidos que tiene como mínimo 4 elementos y contienen ‘Ye Olde’
    $condiciones=$this->postConditions(
        $this->data,
        array(
            'num_items' => '>=',
            'referrer' => 'LIKE'
        )
    $pedidos = $this->Pedido->find("all",compact('condiciones'));

El tercer parámetro te permite decirle a CakePHP qué operador booleano
SQL usar entre condiciones de búsqueda. Una cadena de carateres como
‘AND’, ‘OR’ y ‘XOR’ son valores válidos.

Finalmente, si el último parámetro se establece a ``true`` y el
parámetro ``$operadores`` es un array, los campos no incluidos en
``$operadores`` no se incluirán en las condiciones devueltas.

paginate
~~~~~~~~

Este método es usado para paginar resultados cargados por tus modelos.
Puedes especificar tamaño de páginas, condiciones de búsqueda del modelo
y más. Mira la sección `paginación <es/view/164/paginación>`_ para más
detalles sobre cómo usar ``paginate``.

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $opciones)``

Esta función llama a una acción de un controlador de cualquier lugar y
devuelve los datos de la acción. La dirección ``$url`` pasada es una URL
relativa de CakePHP (/nombrecontrolador/nombreaccion/parametros). Para
pasar datos extras a la acción del controladores receptor, añádelos al
array ``$options``.

Puedes usar ``requestAction()`` para obtener una vista completamente
renderizada pasando ``'return'`` en las opciones:
``requestAction($url, array('return'));``

Si se utiliza sin *caché*, ``requestAction`` puede llevar a un pobre
rendimiento. Es ráramente apropiado usarlo en un controlador o modelo.

Es mejor usar ``requestAction`` junto con elementos en *caché*, como una
manera de obtener datos para un elemento antes de renderizar. Usemos el
ejemplo de poner un elemento "últimos comentarios" en el diseño
(*layout*). Primero necesitamos crear una función en un controlador que
devolverá los datos.

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            return $this->Comment->find('all',
                                        array(
                                              'order' => 'Comment.created DESC',
                                              'limit' => 10)
                                       );
        }
    }

Si ahora creamos un elemento simple para llamar a esa función:

::

    // views/elements/latest_comments.ctp

    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

Podemos colocar esos elementos en cualquier sitio para obtener la salida
usando:

::

    echo $this->element('latest_comments');

Escrito de esta manera, siempre que el elemento sea renderizado, se
realizará una petición al controlador para obtener los datos, los datos
serán procesados y devueltos. De todos modos, de acuerdo con el aviso
anterior, es mejor utilizar *caché* de elementos para prevenir
procesamiento innecesario. Modificando la llamada a ``element`` para que
se vea así:

::

    echo $this->element('latest_comments', array('cache'=>'+1 hour'));

La llamada a ``requestAction`` no se realizará mientras que la el
archivo de la vista del elemento en cache exista y sea válido.

Además, ``requestAction`` ahora toma urls con estilo cake basadas en
arrays:

::

    echo $this->requestAction(
                              array(
                                    'controller' => 'articles',
                                    'action' => 'featured'
                                   ),
                              array('return')
                             );

Esto permite a la llamada a ``requestAction`` evitar el uso de
``Router::url`` lo que puede incrementar el rendimiento. Las urls
basadas en arrays son las mismas que las que ``HtmlHelper:link`` usa,
con una diferencia. Si estás usando parámetros con nombre en tu url,
entonces el array de url debe envolver los parámetros con nombre en la
clave 'named'. Esto es porque ``requestAction`` sólo combina los
argumentos nombrados del array en el array de miembros de
``Controller::params`` y no coloca los argumentos con nombre en la clave
'named'.

::

    echo $this->requestAction('/articles/featured/limit:3');

Este, como array en ``requestAction`` debería ser:

::

    echo $this->requestAction(
                              array(
                                    'controller' => 'articles',
                                    'action' => 'featured',
                                    'named' => array(
                                                     'limit' => 3
                                                    )
                                   )
                             );

A diferencia de otros lugares donde las urls de arrays son análogas a
urls de cadenas, ``requestAction`` las trata de manera diferente.

Cuando utilices una url de array junto con ``requestAction()`` has de
especificar **todos** los parámetros que necesitarás en la acción
pedida. Esto incluye parámetros como ``$this->data`` y
``$this->params['form']``

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

La función ``loadModel`` es útil cuando se necesita usar un modelo que
no es propiamente el modelo por defecto del controlador o uno de sus
modelos asociados.

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();

