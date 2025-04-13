Controladores
#############

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Los controladores son la 'C' en MVC. Después de aplicar el enrutamiento y
que el controlador
ha sido encontrado, la acción de tu controlador es llamado. Tu controlador
debe manejar la interpretación de los datos de la solicitud,
asegurándose de que se llamen
a los modelos correctos y se muestre la respuesta o vista correcta.
Los controladores se pueden
considerar como una capa intermedia entre el Modelo y la Vista. Quieres mantener
tus controladores delgados, y tus modelos gruesos.
Esto te ayudará a reutilizar tu código y lo hará más fácil de probar.

Comúnmente, un controlador se usa para administrar la lógica en torno
a un solo modelo. Por
ejemplo, si estuvieras construyendo un sitio online para una panadería,
podrías tener un
RecipesController que gestiona tus recetas y un IngredientsController
que gestiona tus
ingredientes. Sin embargo, es posible hacer que los controladores trabajen
con más de
un modelo. En CakePHP, un controlador es nombrado a raíz del modelo que maneja.

Los controladores de tu aplicación extienden de la clase ``AppController``,
que a su vez extiende de la clase principal :php:class:`Controller`.
La clase ``AppController`` puede ser definida en **src/Controller/AppController.php**
y debería contener los métodos que se comparten entre todos los controladores
de tu aplicación.

Los controladores proveen una serie de métodos que manejan las peticiones. Estos
son llamadas *acciones*. Por defecto, cada método público en un controlador es
una acción, y es accesible mediante una URL. Una acción es responsable de
interpretar la petición y crear la respuesta. Por lo general, las respuestas
son de la forma de una vista renderizada, pero también, hay otras maneras de crear
respuestas.

.. _app-controller:

El App Controller
==================

Como se indicó en la introducción, la clase ``AppController`` es clase padre de
todos los controladores de tu aplicación.  ``AppController`` extiende de la clase
:php:class:`Cake\\Controller\\Controller` que está incluida en CakePHP.
``AppController`` se define en **src/Controller/AppController.php** como se
muestra a continuación::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Los atributos y métodos del controlador creados en tu ``AppController`` van a
estar disponibles en todos los controladores que extiendan de este. Los
componentes (que aprenderás más adelante) son mejor usados para código que se
encuentra en muchos (pero no necesariamente en todos) los componentes.

Puedes usar tu ``AppController`` para cargar componentes que van a ser utilizados
en cada controlador de tu aplicación. CakePHP proporciona un método ``initialize()``
que es llamado al final del constructor de un controlador para este tipo de uso::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize(): void
        {
            // Always enable the FormProtection component.
            $this->loadComponent('FormProtection');
        }
    }


Flujo de solicitud
==================

Cuando se realiza una solicitud a una aplicación CakePHP, las clases CakePHP
:php:class:`Cake\\Routing\\Router` y :php:class:`Cake\\Routing\\Dispatcher`
usan :ref:`routes-configuration` para encontrar y crear la instancia correcta
del controlador. Los datos de la solicitud son encapsulados en un objeto de
solicitud. CakePHP pone toda la información importante de la solicitud en la
propiedad ``$this->request``. Consulta la sección sobre :ref:`cake-request`
para obtener más información sobre el objeto de solicitud de CakePHP.

Acciones del controlador
========================

Las acciones del controlador son las responsables de convertir los parámetros
de la solicitud en una respuesta para el navegador/usuario que realiza la
petición. CakePHP usa convenciones para automatizar este proceso y eliminar
algunos códigos repetitivos que de otro modo se necesitaría escribir.

Por convención, CakePHP renderiza una vista con una versión en infinitivo del nombre
de la acción. Volviendo a nuestro ejemplo de la panadería online, nuestro
RecipesController podría contener las acciones ``view()``, ``share()``, y
``search()``. El controlador sería encontrado en
**src/Controller/RecipesController.php** y contiene::

    // src/Controller/RecipesController.php

    class RecipesController extends AppController
    {
        public function view($id)
        {
            // La lógica de la acción va aquí.
        }

        public function share($customerId, $recipeId)
        {
            // La lógica de la acción va aquí.
        }

        public function search($query)
        {
            // La lógica de la acción va aquí.
        }
    }

Las plantillas para estas acciones serían **templates/Recipes/view.php**,
**templates/Recipes/share.php**, y **templates/Recipes/search.php**. El nombre
convencional para un archivo de vista es con minúsculas y con el nombre de la
acción entre guiones bajos.

Las acciones de los controladores por lo general usan ``Controller::set()`` para
crear un contexto que ``View`` usa para renderizar la capa de vista. Debido
a las convenciones que CakePHP usa, no necesitas crear y renderizar la vista
manualmente. En su lugar, una vez que se ha completado la acción del controlador,
CakePHP se encargará de renderizar y entregar la vista.

Si por algún motivo deseas omitir el comportamiento predeterminado, puedes retornar
un objeto :php:class:`Cake\\Http\\Response` de la acción con la respuesta creada.

Para que puedas usar un controlador de manera efectiva en tu aplicación,
cubriremos algunos de los atributos y métodos principales proporcionados por los
controladores de CakePHP.

Interactuando con vistas
========================

Los controladores interactúan con las vistas de muchas maneras. Primero, los
controladores son capaces de pasar información a las vistas, usando ``Controller::set()``.
También puedes decidir qué clase de vista usar, y qué archivo de vista debería
ser renderizado desde el controlador.

.. _setting-view_variables:

Configuración de variables de vista
-----------------------------------

.. php:method:: set(string $var, mixed $value)

El método ``Controller::set()`` es la manera principal de mandar información
desde el controlador a la vista. Una vez que hayas utilizado ``Controller::set()``,
la variable puede ser accedida en tu vista::

    // Primero pasas las información desde el controlador:

    $this->set('color', 'rosa');

    // Después, en la vista, puede utilizar la información:
    ?>

    Has seleccionado cubierta <?= h($color) ?> para la tarta.

El método ``Controller::set()`` también toma un array asociativo como su primer
parámetro. A menudo, esto puede ser una forma rápida de asignar un conjunto de
información a la vista::

    $data = [
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95,
    ];

    // Hace $color, $type, y $base_price
    // disponible para la vista:

    $this->set($data);

Ten en cuenta que las variables de la vista se comparten entre todas las partes
renderizadas por tu vista. Estarán disponibles en todas las partes de la vista:
la plantilla y todos los elementos dentro de estas dos.

Configuración de las opciones de la vista
-----------------------------------------

Si deseas personalizar la clase vista, las rutas de diseño/plantillas, ayudantes
o el tema que se usarán para renderizar la vista, puede usar el método ``viewBuilder()``
para obtener un constructor. Este constructor se puede utilizar para definir
propiedades de la vista antes de crearlas::

    $this->viewBuilder()
        ->addHelper('MyCustom')
        ->setTheme('Modern')
        ->setClassName('Modern.Admin');

Lo anterior muestra cómo puedes cargar ayudantes personalizados, configurar el tema
y usar una clase vista personalizada.

Renderizando una vista
----------------------

.. php:method:: render(string $view, string $layout)

El método ``Controller::render()`` es llamado automáticamente al final de cada
solicitud de la acción del controlador. Este método realiza toda la lógica
de la vista (usando la información que has enviado usando el método ``Controller::set()``),
coloca la vista dentro de su ``View::$layout``, y lo devuelve al usuario final.

El archivo de vista por defecto utilizado para el renderizado es definido por
convención.
Si la acción ``search()`` de RecipesController es solicitada, el archivo vista en
**templates/Recipes/search.php** será renderizado::

    namespace App\Controller;

    class RecipesController extends AppController
    {
    // ...
        public function search()
        {
            // Renderiza la vista en templates/Recipes/search.php
            return $this->render();
        }
    // ...
    }

Aunque CakePHP va a llamarlo automáticamente después de cada acción de lógica
(a menos que llames a ``$this->disableAutoRender()``), puedes usarlo para
especificar un archivo de vista alternativo especificando el nombre de este como
primer argumento del método ``Controller::render()``.

Si ``$view`` empieza con '/', se asume que es una vista o un archivo relacionado
con la carpeta **templates**. Esto permite el renderizado directo de elementos,
muy útil en llamadas AJAX::

    // Renderiza el elemento en templates/element/ajaxreturn.php
    $this->render('/element/ajaxreturn');

El segundo parámetro ``$layout`` de ``Controller::render()`` te permita especificar
la estructura con la que la vista es renderizada.

Renderizando una plantilla específica
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

En tu controlador, puede que quieras renderizar una vista diferente a la que es
convencional. Puedes hacer esto llamando a ``Controller::render()`` directamente.
Una vez que hayas llamado a ``Controller::render()``, CakePHP no tratará de
re-renderizar la vista::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function my_action()
        {
            $this->render('custom_file');
        }
    }

Esto renderizará **templates/Posts/custom_file.php** en vez de
**templates/Posts/my_action.php**.

También puedes renderizar vistas dentro de plugins usando la siguiente sintaxis:
``$this->render('PluginName.PluginController/custom_file')``. Por ejemplo::

    namespace App\Controller;

    class PostsController extends AppController
    {
        public function myAction()
        {
            $this->render('Users.UserDetails/custom_file');
        }
    }

Esto renderizará **plugins/Users/templates/UserDetails/custom_file.php**

.. _controller-viewclasses:

Negociación del tipo de contenido
=================================

.. php:method:: viewClasses()

Los controladores pueden definir una lista de clases de vistas que soportan.
Después de que la acción del controlador este completa, CakePHP usará la lista de
vista para realizar negociación del tipo de contenido. Esto permite a tu aplicación
rehusar la misma acción del controlador para renderizar una vista HTML o
renderizar una respuesta JSON o XML. Para definir la lista de clases de vista que
soporta un controlador se utiliza el método ``viewClasses()``::

    namespace App\Controller;

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    class PostsController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class, XmlView::class];
        }
    }

La clase ``View`` de la aplicación se usa automáticamente como respaldo cuando
no se puede seleccionar otra vista en función del encabezado de la petición ``Accept``
o de la extensión del enrutamiento. Si tu aplicación sólo soporta tipos de contenido
para una acción específica, puedes definir esa lógica dentro de ``viewClasses()``::

    public function viewClasses(): array
    {
        if ($this->request->getParam('action') === 'export') {
            // Usa una vista CSV personalizada para exportación de datos
            return [CsvView::class];
        }

        return [JsonView::class];
    }

Si dentro de las acciones de tu controlador necesitas procesar la petición o cargar datos
de forma diferente dependiendo del tipo de contenido puedes usar
:ref:`check-the-request`::

    // En la acción de un controlador

    // Carga información adicional cuando se preparan respuestas JSON
    if ($this->request->is('json')) {
        $query->contain('Authors');
    }

También puedes definir las clases View soportadas por tu controlador usando
el método ``addViewClasses()`` que unirá la vista proporcionada con
aquellas que están actualmente en la propiedad ``viewClasses``.

.. note::
    Las clases de vista deben implementar el método estático ``contentType()``
    para participar en las negociaciones del tipo de contenido.

Negociación de tipo de contenido alternativos
=============================================

Si ninguna vista puede coincidir con las preferencias del tipo de contenido de la
petición, CakePHP usará la clase base ``View``. Si deseas solicitar una negociación
del tipo de contenido, puedes usar ``NegotiationRequiredView`` que setea un código
de estatus 406::

    public function viewClasses(): array
    {
        // Requiere aceptar la negociación del encabezado o devuelve una respuesta 406.
        return [JsonView::class, NegotiationRequiredView::class];
    }

Puede usar el valor del tipo de contenido ``TYPE_MATCH_ALL`` para crear tu lógica
de vista alternativa::

    namespace App\View;

    use Cake\View\View;

    class CustomFallbackView extends View
    {
        public static function contentType(): string
        {
            return static::TYPE_MATCH_ALL;
        }

    }

Es importante recordar que las vistas coincidentes se aplican sólo *después* de
intentar la negociación del tipo de contenido.


Redirigiendo a otras páginas
============================

.. php:method:: redirect(string|array $url, integer $status)

El método ``redirect()`` agrega un encabezado ``Location`` y establece un código
de estado de una respuesta y la devuelve. Deberías devolver la respuesta creada
por ``redirect()`` para que CakePHP envíe la redirección en vez de completar
la acción del controlador y renderizar la vista.

Puedes redigir usando los valores de un array ordenado::

    return $this->redirect([
        'controller' => 'Orders',
        'action' => 'confirm',
        $order->id,
        '?' => [
            'product' => 'pizza',
            'quantity' => 5
        ],
        '#' => 'top'
    ]);

O usando una URL relativa o absoluta::

    return $this->redirect('/orders/confirm');

    return $this->redirect('http://www.example.com');

O la referencia de la página::

    return $this->redirect($this->referer());

Usando el segundo parámetro puede definir un código de estatus para tu redirección::

    // Haz un 301 (movido permanentemente)
    return $this->redirect('/order/confirm', 301);

    // Haz un 303 (Ver otro)
    return $this->redirect('/order/confirm', 303);

Reenviando a un acción en el mismo controlador
----------------------------------------------

.. php:method:: setAction($action, $args...)

Si necesitas reenviar la acción actual a una acción diferente en el *mismo* controlador,
puedes usar ``Controller::setAction()`` para actualizar el objeto de la solicitud,
modifica la plantilla de vista que será renderizada y reenvía la ejecución a la
nombrada acción::

    // Desde una acción de eliminación, puedes renderizar a lista de página
    // actualizada.
    $this->setAction('index');

Cargando modelos adicionales
============================

.. php:method:: fetchModel(string $alias, array $config = [])

La función ``fetchModel()`` es útil cuando se necesita cargar un modelo o tabla del ORM que
no es la predeterminada por el controlador. Modelos obtenidos de ésta manera no serán seteados
como propiedades en el controlador::

    // Obtiene un modelo de ElasticSearch
    $articles = $this->fetchModel('Articles', 'Elastic');

    // Obtiene un modelo de webservice
    $github = $this->fetchModel('GitHub', 'Webservice');

.. versionadded:: 4.5.0

.. php:method:: fetchTable(string $alias, array $config = [])

La función ``fetchTable()`` es útil cuando se necesita usar una tabla del ORM que no es
la predeterminada por el controlador::

    // En un método del controlador.
    $recentArticles = $this->fetchTable('Articles')->find('all',
            limit: 5,
            order: 'Articles.created DESC'
        )
        ->all();

.. versionadded:: 4.3.0
    ``Controller::fetchTable()`` fue añadido. Antes de 4.3 necesitas usar ``Controller::loadModel()``.

Paginación de un modelo
=======================

.. php:method:: paginate()

Este método se utiliza para paginar los resultados obtenidos por tus modelos.
Puedes especificar tamaño de páginas, condiciones de búsqueda del modelo y más.
Ve a la sección :doc:`pagination <controllers/pagination>` para más detalles
sobre como usar ``paginate()``.

El atributo ``$paginate`` te da una manera de personalizar cómo ``paginate()``
se comporta::

    class ArticlesController extends AppController
    {
        protected array $paginate = [
            'Articles' => [
                'conditions' => ['published' => 1],
            ],
        ];
    }

Configuración de componentes para cargar
========================================

.. php:method:: loadComponent($name, $config = [])

En el método ``initialize()`` de tu controlador, puedes definir cualquier componente
que deseas cargar, y cualquier dato de configuración para ellos::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');
        $this->loadComponent('Comments', Configure::read('Comments'));
    }

.. _controller-life-cycle:

Callbacks del ciclo de vida de la petición
=======================================================

Los controladores de CakePHP activan varios eventos/callbacks que puedes usar
para insertar lógica alrededor del ciclo de vida de la solicitud.

Lista de eventos
----------------

* ``Controller.initialize``
* ``Controller.startup``
* ``Controller.beforeRedirect``
* ``Controller.beforeRender``
* ``Controller.shutdown``

Métodos de callback del controlador
================================================

Por defecto, los siguientes métodos de callback están conectados a
eventos relacionados si los métodos son implementados por tus controladores.

.. php:method:: beforeFilter(EventInterface $event)

    Llamado durante el evento ``Controller.initialize`` que ocurre antes de cada
    acción en el controlador. Es un lugar útil para comprobar si hay una sesión
    activa o inspeccionar los permisos del usuario.

    .. note::
        El método beforeFilter() será llamado por acciones faltantes.

    Devolver una respuesta del método ``beforeFilter`` no evitará que otros oyentes
    del mismo evento sean llamados. Debes explícitamente parar el evento.

.. php:method:: beforeRender(EventInterface $event)

    Llamado durante el evento ``Controller.beforeRender`` que ocurre después
    de la lógica de acción del controlador, pero antes de que la vista sea renderizada.
    Este callback no se usa con frecuencia, pero puede ser necesaria
    si estas llamando :php:meth:`~Cake\\Controller\\Controller::render()` de forma
    manual antes del final de una acción dada.

.. php:method:: afterFilter(EventInterface $event)

    Llamado durante el evento ``Controller.shutdown`` que se desencadena después
    de cada acción del controlador, y después de que se complete el renderizado.
    Este es el último método del controlador para ejecutar.

Además de las devoluciones de llamada del ciclo de vida del controlador,
:doc:`/controllers/components` también proporciona un conjunto similar de devoluciones
de llamada.

Recuerda llamar a los callbacks de ``AppController`` dentro de los callbacks
del controlador hijo para mejores resultados::

    //use Cake\Event\EventInterface;
    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
    }

.. _controller-middleware:

Middleware del controlador
==========================

.. php:method:: middleware($middleware, array $options = [])

:doc:`Middleware </controllers/middleware>` puede ser definido globalmente, en
un ámbito de enrutamiento o dentro de un controlador. Para definir el middleware
para un controlador en específico usa el método  ``middleware()`` de tu método
``initialize()`` del controlador::

    public function initialize(): void
    {
        parent::initialize();

        $this->middleware(function ($request, $handler) {
            // Haz la lógica del middleware.

            // Verifica que devuelves una respuesta o llamas a handle()
            return $handler->handle($request);
        });
    }

El middleware definido por un controlador será llamado **antes** ``beforeFilter()``
y se llamarán a los métodos de acción.

Más sobre controladores
=======================

.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=es: Controllers
    :keywords lang=es: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
