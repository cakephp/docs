REST
####

Muchos de los nuevos programadores de aplicaciones se están dando cuenta
de la necesidad de abrir el núcleo de la funcionalidad a un mayor público.
Proporcionando acceso fácil y sin restricciones al núcleo de su API puede
ayudar a que su plataforma sea aceptada, y permite realizar mashups y fácil
integración con otros sistemas.

Si bien existen otras soluciones, REST es una excelente manera de
proporcionar un fácil acceso a la lógica que ha creado para su aplicación.
Es simple, generalmente basado en XML (estamos hablando de simple XML, nada
como un envoltorio de SOAP), y depende de los encabezados HTTP por dirección.
Exponer una API utilizando REST en CakePHP es simple.

La Configuración Simple
=======================

La forma más rapida para empezar a utilizar REST es agregar unas líneas para
configurar la `resource routes <resource-routes>` en su archivo **config/routes.php**.

Una vez que la ruta se ha configurado para mapear las solicitudes REST a
cierto controlador de acciones, se puede proceder a crear la lógica de nuestro
controlador de acciones. Un controlador básico podría visualizarse de la siguiente forma::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set('recipes', $recipes);
            $this->viewBuilder()->setOption('serialize', ['recipes']);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set('recipe', $recipe);
            $this->viewBuilder()->setOption('serialize', ['recipe']);
        }

        public function add()
        {
            $this->request->allowMethod(['post', 'put']);
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function edit($id)
        {
            $this->request->allowMethod(['patch', 'post', 'put']);
            $recipe = $this->Recipes->get($id);
            $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function delete($id)
        {
            $this->request->allowMethod(['delete']);
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set('message', $message);
            $this->viewBuilder()->setOption('serialize', ['message']);
        }
    }

Los controladores RESTful a menudo usan extensiones parseadas para mostrar diferentes vistas,
basado en diferentes tipos de solicitudes. Como estamos tratando con solicitudes REST,
estaremos haciendo vistas XML. Puedes realizar vistas en JSON usando el CakePHP
:doc:`/views/json-and-xml-views`. Mediante el uso de :php:class:`XmlView` se puede
definir una opción de ``serialize``. Esta opción se usa para definir qué variables de vistas
`` XmlView`` deben serializarse en XML.

Si se quiere modificar los datos antes de convertirlos en XML, no se debería definir la
opción ``serialize``, y en lugar de eso, se debería usar archivos plantilla. Colocaremos
las vistas REST de nuestro RecipesController dentro de **templates/Recipes/xml**. también
podemos utilizar el :php:class:`Xml` para una salida XML rápida y fácil en esas vistas.
De esta forma, así podría verse nuestra vista de índice::

    // templates/Recipes/xml/index.php
    // Realizar un formateo y manipulacion en
    // $recipes array.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();


Al entregar un tipo de contenido específico usando :php:meth:`Cake\\Routing\\Router::extensions()`,
CakePHP busca automáticamente un asistente de vista que coincida con el tipo. Como estamos utilizando
XML como tipo de contenido, no hay un asistente incorporado, sin embargo, si creara uno, se cargaría
automáticamente para nuestro uso en esas vistas.

El XML procesado terminará pareciéndose a esto::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

Crear la lógica para la acción de edición es un poco más complicado, pero no mucho.
Ya que se está proporcionando una API que genera XML como salida, es una opción natural
recibir XML como entrada. No te preocupes, las clases :php:class:`Cake\\Controller\\Component\\RequestHandler`
y :php:class:`Cake\\Routing\\Router` hacen las cosas mucho más fáciles. Si un POST o
una solicitud PUT tiene un tipo de contenido XML, entonces la entrada se ejecuta a través de la clase de CakePHP
:php:class:`Xml`, y la representación del arreglo de los datos se asigna a ``$this->request->getData()``.
Debido a esta característica, el manejo de datos XML y POST se hace en continuamente en paralelo: no se
requieren cambios en el controlador o el código del modelo. Todo lo que necesita debe terminar en
``$this->request->getData()``.

Aceptando Entradas en otros formatos
====================================

Por lo general, las aplicaciones REST no solo generan contenido en formatos de datos alternativos, sino que también
acepta datos en diferentes formatos. En CakePHP, el :php:class:`RequestHandlerComponent` ayuda a fácilitar esto.
Por defecto, decodificará cualquier entrada de datos en JSON / XML para solicitudes POST / PUT y proporcionar una
versión del arreglo de esos datos en ``$this->request->getData()``. También puedes conectar deserializadores
adicionales para formatos alternativos si los necesitas, usando: :php:meth:`RequestHandler::addInputType()`.

Enrutamiento RESTful
====================

El enrutador de CakePHP fácilita la conexión de rutas de recursos RESTful. Ver la sección
`resource-routes` para más información.

.. meta::
    :title lang=es: REST
    :keywords lang=es: programadores de aplicaciones,rutas por defecto,funcionalidad principal,formato resultante,mashups,base de datos de recetas,metodo de respuesta,fácil acceso,config,soap,recetas,lógica,audiencia,cakephp,ejecutandose,api
