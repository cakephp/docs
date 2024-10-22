Vistas JSON y XML
#################

La integración de ``JsonView`` y ``XmlView`` con las funcionalidades de :ref:`controller-viewclasses`
de CakePHP y te permite crear respuestas JSON y XML.

Éstas clases View son usadas de forma mas común junto con :php:meth:`\Cake\Controller\Controller::viewClasses()`.

Hay dos formas de generar vistas de datos. La primera es mediante el uso de
la opción ``serialize`` y la segunda es mediante la creación de archivos de
plantilla normales.

Definiendo clases View pata Negociar
====================================

En tu ``AppController`` o en un controlador individual puedes implementar la
función ``viewClasses()`` y proporcionarle todas las clases View que
quieras soportar::

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [JsonView::class, XmlView::class];
    }


Opcionalmente, puede habilitar las extensiones json y/o xml con
`file-extensions`. Esto le permitirá acceder a ``JSON``, ``XML`` o cualquier
otra vista de formato especial utilizando una URL personalizada que termine con
el nombre del tipo de respuesta como una extensión de archivo como
``http://example.com/articles.json``.

De forma predeterminada, cuando no se habilitan las `file-extensions`, se
utiliza la solicitud, seleccionando el encabezado ``Accept``, seleccionando qué
tipo de formato se debe presentar al usuario. Un ejemplo de formato ``Accept``
que se utiliza para representar respuestas ``JSON`` es ``application/json``.

Uso de vistas de datos con la clave Serialize
=============================================

La opción ``serialize`` indica qué variable(s) de vista se deben serializar
cuando se utiliza una vista de datos. Esto le permite omitir la definición de
archivos de plantilla para las acciones del controlador si no necesita realizar
ningún formateo personalizado antes de que los datos se conviertan en json/xml.

Si necesita realizar algún formateo o manipulación de las variables de vista
antes de generar la respuesta, debe usar archivos de plantilla. El valor de
``serialize`` puede ser un string o un array de variables de vista para
serializar::

    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Asigna las variables a la vista
            $this->set('articles', $this->paginate());
            // Especifica las variables de vista que JsonView deberá serializar
            $this->viewBuilder()->setOption('serialize', 'articles');
        }
    }

También puede definir ``serialize`` como un array de variables de vista para
combinar::

    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Código que crear las variables $articles y $comments

            // Asigna las variables a la vista
            $this->set(compact('articles', 'comments'));

            // Specify which view vars JsonView should serialize.
            $this->viewBuilder()->setOption('serialize', ['articles', 'comments']);
        }
    }

La definición de ``serialize`` como un array ha añadido la ventaja de anexar
automáticamente un elemento ``<response>`` de nivel superior cuando se utiliza
:php:class:`XmlView`. Si utiliza un valor de string para ``serialize`` y XmlView,
asegúrese de que la variable de vista tiene un único elemento de nivel superior.
Sin un solo elemento de nivel superior, el Xml no podrá generarse.

Uso de una vista de datos con archivos de plantilla
===================================================

Debe usar archivos de plantilla si necesita manipular el
contenido de la vista antes de crear el resultado final. Por ejemplo, si tuviéramos
artículos con un campo que contuviera HTML generado, probablemente
querríamos omitirlo de una respuesta JSON. Esta es una situación en la que un archivo
de vista sería útil::

    // Controller code
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // View code - templates/Articles/json/index.php
    foreach ($articles as $article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

Puede hacer manipulaciones más complejas o usar ayudantes para formatear también.
Las clases de vista de datos no admiten diseños. Asumen que el archivo de vista
generará el contenido serializado.

Creación de vistas XML
======================

.. php:class:: XmlView

De forma predeterminada, cuando se utiliza ``serialize``, XmlView ajustará
las variables de vista serializadas con un nodo ``<response>``. Puede
establecer un nombre personalizado para este nodo mediante la opción
``rootNode``.

La clase XmlView admite la opción ``xmlOptions`` que le permite personalizar
las opciones utilizadas para generar XML, por ejemplo, ``tags`` frente
``attributes``.

Un ejemplo de uso de ``XmlView`` sería generar un `sitemap.xml
<https://www.sitemaps.org/protocol.html>`_. Este tipo de documento requiere
que cambie ``rootNode`` y establezca atributos. Los atributos se definen
mediante el prefijo ``@``::

    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [XmlView::class];
    }

    public function sitemap()
    {
        $pages = $this->Pages->find()->all();
        $urls = [];
        foreach ($pages as $page) {
            $urls[] = [
                'loc' => Router::url(['controller' => 'Pages', 'action' => 'view', $page->slug, '_full' => true]),
                'lastmod' => $page->modified->format('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => '0.5',
            ];
        }

        // Define a custom root node in the generated document.
        $this->viewBuilder()
            ->setOption('rootNode', 'urlset')
            ->setOption('serialize', ['@xmlns', 'url']);
        $this->set([
            // Define an attribute on the root node.
            '@xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'url' => $urls,
        ]);
    }

Creación de vistas JSON
=======================

.. php:class:: JsonView

La clase JsonView admite la opción ``jsonOptions`` que permite personalizar
la máscara de bits utilizada para generar JSON. Consulte la documentación de
`json_encode <https://php.net/json_encode>`_ para conocer los valores válidos
de esta opción.

Por ejemplo, para serializar la salida de errores de validación de las entidades
CakePHP en una forma coherente de JSON::

    // In your controller's action when saving failed
    $this->set('errors', $articles->errors());
    $this->viewBuilder()
        ->setOption('serialize', ['errors'])
        ->setOption('jsonOptions', JSON_FORCE_OBJECT);

Respuestas JSONP
----------------

Al utilizar ``JsonView``, puede utilizar la variable de vista especial ``jsonp``
para habilitar la devolución de una respuesta JSONP. Si se establece en ``true`` la
clase de vista comprueba si se establece el parámetro de string de consulta denominado
"callback" y, de ser así, envuelve la respuesta json en el nombre de función
proporcionado. Si desea utilizar un nombre de parámetro de string de consulta
personalizado en lugar de "callback", establezca ``jsonp`` al nombre requerido en
lugar de ``true.``.

Eligiendo una clase View
========================

Aunque puedes usar la función ``viewClasses`` la mayoría de las veces, si quieres
un control total sobre la selección de la clase de vista, puedes elegir directamente
la clase::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Http\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Format to view mapping
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Error on unknown type
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Set Out Format View
            $this->viewBuilder()->setClassName($formats[$format]);

            // Get data
            $videos = $this->Videos->find('latest')->all();

            // Set Data View
            $this->set(compact('videos'));
            $this->viewBuilder()->setOption('serialize', ['videos']);

            // Set Force Download
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }

.. meta::
    :title lang=es: Vistas JSON y XML
    :keywords lang=es: json,xml,presentation layer,view,ajax,logic,syntax,templates,cakephp
