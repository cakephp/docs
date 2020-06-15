Paginación
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

Uno de los mayores obstaculos para crear aplicaciones web flexibles y 
amigables para el usuario es diseñar una interfaz de usuario intuitiva. 
Muchas aplicaciones tienen a crecer en tamaño y complejidad rapidamente, 
y los diseñadores y programadores por igual no pueden hacer frente 
a la visualización de cientos o miles de registros. Refactorizar lleva 
tiempo, y el rendimiento y la satisfación del usuario pueden verse afectados.

Mostrar un número razonable de registros por página siempre ha sido una parte crítica 
para cada aplicación y suele causar muchos dolores de cabeza a los desarrolladores. 
CakePHP alivia la carga del desarrollador al proporcionar una manera rapida y fácil 
de paginar datos.

La paginación en CakePHP es ofrecida por un componente de un controlador. Puedes utilizar 
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` en la vista de tu plantilla para generar 
los controles de paginación.

Uso Básico
==========

Para paginar una consulta primero debemos cargar el ``PaginatorComponent``::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Una vez cargado podemos paginar una tabla de clase ORM o un objeto ``Query``::

    public function index()
    {
        // Paginate the ORM table.
        $this->set('articles', $this->paginate($this->Articles));

        // Paginate a partially completed query
        $query = $this->Articles->find('published');
        $this->set('articles', $this->paginate($query));
    }

Uso Avanzado
============

El componente ``PaginatorComponent`` admite casos de uso más complejos mediante la 
configuración de la propiedad del controlador ``$paginate`` o como el argumento ``$settings`` 
para ``paginate()``. Estas condiciones sirven como base para tus consultas de paginación. 
Son aumentados por los parametros ``sort``, ``direction``, ``limit``, y ``page`` pasados 
dentro de la URL::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

.. tip:: 
    Las opciones predeterminadas de ``order`` deben definirse como un array.

Si bien puedes incluir cualquiera de las opciones soportadas por :php:meth:`~Cake\\ORM\\Table::find()` 
como ``fields`` en tus ajustes de paginación. Es más limpio y sencillo agrupar tus opciones de 
paginación dentro de :ref:`custom-find-methods`. Puedes usar tu buscador en la paginación utilizando la 
opción ``finder`` ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

Si tu metodo de busqueda requiere opciones adicionales, puedes pasarlas como como valores 
para el buscador::

    class ArticlesController extends AppController
    {
        // find articles by tag
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];
            // Estamos utilizando el argumento $settings para paginate() aqui.
            // Pero la misma estructura puede ser utilizada para $this->paginate
            //
            // Nuestro buscador personalizado se llama findTagged dentro ArticlesTable.php
            // por eso estamos usando `tagged` como clave.
            // Nuestro buscador deberia verse como:
            // public function findTagged(Query $query, array $options) {
            $settings = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles, $settings);
            $this->set(compact('articles', 'tags'));
        }
    }

Además de definir valores generales de paginación, puedes definir mas de un conjunto de 
valores predeterminados para la paginación en el controlador. El nombre de cada modelo 
puede ser usado como clave en la propiedad ``$paginate``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Los valores de las claves de ``Articles`` y ``Authors`` podrían contener todas las
propiedades que tendría una matriz básica ``$paginate``.

Una vez que hayas utilizado ``paginate()`` para crear resultados. La solicitud del 
controlador se actualizará con los parámetros de paginación. Puedes acceder a los 
metadatos de paginación en ``$this->request->getParam('paging')``.

Paginación Simple
=================

Por defecto, la paginación utiliza una consulta ``count()`` para calcular el tamaño 
del conjunto de resultados para que puedan ser renderizados los enlaces de número de 
página. En conjuntos de datos muy grandes, esta consulta de conteo puede ser muy costosa.
En situaciones donde solo quieres mostrar los enlaces "Siguiente" y "Anterior" puedes 
utilizar el paginador 'simple' que realiza una consulta de conteo::

    public function initialize(): void
    {
        parent::initialize();

        // Load the paginator component with the simple paginator strategy.
        $this->loadComponent('Paginator', [
            'paginator' => new \Cake\Datasource\SimplePaginator(),
        ]);
    }

Cuando se utilice el ``SimplePaginator`` no se podra generar los números de pagina, 
datos de contador, enlaces a la ultima pagina, o controles de recuento total de registros.

Utilizando Directamente PaginatorComponent
==========================================

Si necesitas paginar datos de otro componente, puedes utilizar el ``PaginatorComponent`` directamente. 
Cuenta con una API similar al método controlador::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Or
    $articles = $this->Paginator->paginate($articleTable, $config);

El primer parámetro debe ser el objeto de consulta a encontrar en la tabla de objetos de la que se 
desea paginar los resultados. Opcionalmente, puedes pasar el tabla de objetos y dejar la consulta 
se construirá para usted. El segundo parametro deberia ser el array de los ajustes para usar en la 
paginación. Este array deberia tener la misma estructura que la propiedad ``$paginate`` en el 
controlador. Al paginar un objeto ``Query``, la opción ``finder`` sera ignorada. Se da por asumido 
que se esta pasando la consulta que desas que sea paginada.

.. _paginating-multiple-queries:

Paginando Multiples Consultas
=============================

Puedes paginar multiples modelos en una sola accion del controlador, usando la opción ``scope`` 
tanto en la propiedad ``$paginate`` del controlador y en la llamada al metodo ``paginate()``::

    // Propiedad paginado
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // En una acción del controlador
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

La opción ``scope`` dará como resultado el aspecto de ``PaginatorComponent`` en parámetros de cadena 
de consulta con ámbito. Por ejemplo, el siguiente URL podría ser utilizado para paginar tags y articles 
al mismo tiempo::

    /dashboard?article[page]=1&tag[page]=3

Consulte la sección :ref:`paginator-helper-multiple` para saber como generar elementos HTML con ambito 
y URLs para paginación.

Paginar el Mismo Modelo Varias Veces
------------------------------------

Para paginar el mismo modelo multiples veces dentro de una sola acción del controlador necesitas definir 
un alias para el modelo. Consulte ref:`table-registry-usage` para detalles adicionales sobre como 
utilizar la tabla de registros:: 

    // En una acción del controlador
    $this->paginate = [
        'ArticlesTable' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticlesTable' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];

    // Registrar una tabla de objetos adicional para permitir la diferenciación en el componente de paginación
    TableRegistry::getTableLocator()->setConfig('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', [
            'scope' => 'published_articles'
        ])->where(['published' => true])
    );

    $unpublishedArticles = $this->paginate(
        TableRegistry::getTableLocator()->get('UnpublishedArticles')->find('all', [
            'scope' => 'unpublished_articles'
        ])->where(['published' => false])
    );

.. _control-which-fields-used-for-ordering:

Controlar que Campos se utilizan para Ordenar
=============================================

Por defecto, el ordenamiento se puede realizar en cualquier columna no virtual que la tabla tenga. 
Esto es, a veces no deseable ya que permite a los usuarios ordenar por columnas no indexadas que pueden 
provocar gran trabajo para ser ordenadas. Puedes establecer una lista blanca de campos que se pueden 
ordenar utilando la opción ``sortWhitelist``. Esta opción es necesaria cuando quieres ordenar datos asociados 
o campos calculados que pueden formar parte de la consulta de paginación:: 

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Cualquier solicitud que intente ordenar campos que no se encuentren en el lista blanca será ignorada.

Limitar el Número Máximo de Filas por Página
============================================

El número de resultados que se obtienen por página se expone al usuario como el parametro ``limit``.
Generalmente no es deseable permitir que los usuarios obtengan todas las filas en un conjunto paginado.
La opción ``maxLimit`` establece que nadie puede configurar este límite demasiado alto desde afuera.
Por defecto, CakePHP limita el número maximo de filas que pueden ser obtenidas a 100. Si este limite por 
defecto no es apropiado para tu aplicación, puedes ajustarlo en las opciones de paginación, por ejemplo, 
reduciendolo a ``10``::

    public $paginate = [
        // Other keys here.
        'maxLimit' => 10
    ];

Si el parametro de la solictud es mayor a este valor, se reducirá al valor de ``maxLimit``.

Uniendo Asociaciones Adicionales
================================

Se pueden cargar asociaciones adicionales en la tabla paginada utilizando el parametro ``contain``:: 

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

Solicitudes de Página Fuera de Rango
====================================

El PaginatorComponent lanzará un ``NotFoundException`` cuando trate de acceder a una página no existente, 
es decir, cuando el número de página solicitado sea mayor al número de páginas.

Por lo tanto, puedes dejar que se muestre la página de error normal o utilizar un bloque try catch y 
tomar las medidas apropiadas cuando se detecta un ``NotFoundException``:: 

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Has algo aquí como redirigir a la primera página o a la ultima página.
            // $this->request->getAttribute('paging') te dara la información requerida.
        }
    }
 
Paginación en la Vista
======================

Consulte la documentación :php:class:`~Cake\\View\\Helper\\PaginatorHelper` para saber como crear 
enlaces para la navegación de paginación.

.. meta::
    :title lang=es: Paginación
    :keywords lang=es: array ordenado,condiciones de consulta,clase php,aplicaciones web,dolores de cabeza,obstaculos,complejidad,programadores,parametros,paginado,diseñadores,cakephp,satisfacción,desarrolladores
