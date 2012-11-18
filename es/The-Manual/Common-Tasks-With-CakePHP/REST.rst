REST
####

Muchos de los nuevos programadores de aplicaciones se están percatando
de la necesidad de liberar las funcionalidades de su aplicación a una
audiencia más amplia. Proporcionar un acceso fácil y sin restricciones
al núcleo de tu aplicación puede ayudar a que esta sea mayormente
aceptada, además de facilitar la realización de mashups que la integren
y permitir una sencilla integración con otros sistemas.

Aunque existen otras soluciones, REST es una buena forma de proveer
fácil acceso a la capa lógica de tu aplicación. Es simple, está basado
normalmente en el lenguaje de marcado XML (XML simple, nada de
complicados envoltorios SOAP), y se vale de las cabeceras HTTP para el
direccionamiento. Exponer una API vía REST en CakePHP es simple.

Una configuración simple
========================

La forma más rápida de iniciar y utilizar REST es añadir una pocas
lineas a tu fichero routes.php, situado en app/config. El objeto Router
contiene un método llamado mapResources() que es utilizado para
configurar un número determinado de rutas para el acceso REST a tus
controladores. Si queremos permitir a REST acceder a una base de datos
de recetas, haríamos algo como esto:

::

    //En app/config/routes.php...
        
    Router::mapResources('recetas');
    Router::parseExtensions();

La primera linea establece varias rutas por defecto para un fácil acceso
REST donde el método especifica el formato deseado del resultado (p.ej.
xml, json, rss). Estas rutas son sensibles a los Métodos de Petición
HTTP.

+---------------+-------------------------+-----------------------------------+
| Método HTTP   | URL\ *.method*          | Acción invocada del Controlador   |
+===============+=========================+===================================+
| GET           | /recetas*.method*       | RecetasController::index()        |
+---------------+-------------------------+-----------------------------------+
| GET           | /recetas/*123.method*   | RecetasController::view(123)      |
+---------------+-------------------------+-----------------------------------+
| POST          | /recetas*.method*       | RecetasController::add()          |
+---------------+-------------------------+-----------------------------------+
| PUT           | /recetas/123*.method*   | RecetasController::edit(123)      |
+---------------+-------------------------+-----------------------------------+
| DELETE        | /recetas/*123.method*   | RecetasController::delete(123)    |
+---------------+-------------------------+-----------------------------------+
| POST          | /recetas/123*.method*   | RecetasController::edit(123)      |
+---------------+-------------------------+-----------------------------------+

La clase Router de CakePHP usa diferentes indicadores para detectar el
méotod HTTO que está siendo utilizado. Aquí están por orden de
preferencia:

#. La variable POST *\_method*
#. X\_HTTP\_METHOD\_OVERRIDE
#. La cabecera REQUEST\_METHOD

La variable POST *\_method* es útil cuando se utiliza un navegador como
cliente REST (o cualquier cosa que pueda hacer facilmente POST).
Establece el valor de \_method al nombre del método de petición HTTP que
desees emular.

Una vez que se ha configurado el router para mapear solicitudes REST
hacia determinadas acciones del controlador, podemos pasar a crear la
lógica de nuestras acciones de controlador. Un controlador básico puede
ser algo como esto:

::

    // controllers/recetas_controller.php

    class RecetasController extends AppController {

        var $components = array('RequestHandler');

        function index() {
            $recetas = $this->Receta->find('all');
            $this->set(compact('recetas'));
        }

        function view($id) {
            $receta = $this->Receta->findById($id);
            $this->set(compact('receta'));
        }

        function edit($id) {
            $this->Receta->id = $id;
            if ($this->Receta->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }

        function delete($id) {
            if($this->Receta->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Como hemos añadido una llamada a Router::parseExtensions(), el router
CakePHP tiene aun como prioridad servir vistas diferentes basadas en
diferentes tipos de peticiones. Como estamos tratando con peticiones
REST, el tipo de vista es XML. Situamos las vistas REST para nuestro
Recetas Controller dentro de app/views/xml. También podemos utilizar
XmlHelper para una salida rápida y facil de estas vistas. Aquí puedes
ver cómo sería nuestra vista index:

::

    // app/views/recetas/xml/index.ctp

    <recetas>
        <?php echo $xml->serialize($recetas); ?>
    </recetas>

Usuarios con experiencia en CakePHP pueden notar que no hemos incluido
XmlHelper en nuestro array $helpers en RecetasController. Esto tiene un
propósito - cuando se sirve un tipo de contenido específico usando
parseExtensions(), CakePHP busca automáticamente una vista de helper que
coincida con el tipo. Como estamos usando XML como tipo de contenido,
XmlHelper es cargado automáticamente para su uso en nuestras vistas.

La renderización del XML sería así:

::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="Esto es un comentario a esta entrada."></comment>
        </post>   
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="Esto es un comentario a esta entrada."></comment>
        </post>
    </posts>

Crear la lógica para la acción edit es un poco más complicado, pero no
demasiado. Como estás aportando una API que imprime XML, es una elección
natural recibir XML como entrada. No te preocupes, Since you're
providing an API that outputs XML, it's a natural choice to receive XML
as input. Not to worry, however: the RequestHandler and Router classes
make things much easier. If a POST or PUT request has an XML
content-type, then the input is taken and passed to an instance of
Cake's Xml object, which is assigned to the $data property of the
controller. Because of this feature, handling XML and POST data in
parallel is seamless: no changes are required to the controller or model
code. Everything you need should end up in $this->data.

Custom REST Routing
===================

If the default routes created by mapResources() don't work for you, use
the Router::connect() method to define a custom set of REST routes. The
connect() method allows you to define a number of different options for
a given URL. The first parameter is the URL itself, and the second
parameter allows you to supply those options. The third parameter allows
you to specify regex patterns to help CakePHP identify certain markers
in the specified URL.

We'll provide a simple example here, and allow you to tailor this route
for your other RESTful purposes. Here's what our edit REST route would
look like, without using mapResources():

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    )

Advanced routing techniques are covered elsewhere, so we'll focus on the
most important point for our purposes here: the [method] key of the
options array in the second parameter. Once that key has been set, the
specified route works only for that HTTP request method (which could
also be GET, DELETE, etc.)
