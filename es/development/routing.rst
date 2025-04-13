Routing
#######

.. php:namespace:: Cake\Routing

.. php:class:: RouterBuilder

El enrutamiento te provee de herramientas que permiten mapear URLs a acciones
de un controlador. Al definir rutas, puedes separar cómo está implementada tu
aplicación y cómo están estructuradas sus URLs.

El enrutamiento en CakePHP también abarca la idea de enrutamiento inverso, donde
una matriz de parámetros se puede transformar en una cadena URL. Al utilizar el
enrutamiento inverso, puedes refactorizar la estructura de tus URLs sin necesidad
de actualizar todo tu código.

.. index:: routes.php

Vistazo rápido
==============

Esta sección te enseñará los usos más comunes del enrutamiento en CakePHP con
ejemplos. Normalmente, deseas mostrar algo como una página de destino, por lo que
tendrás que añadir esto a tu archivo **config/routes.php**::

    /** @var \Cake\Routing\RouteBuilder $routes */
    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

Esto ejecutará el método index que se encuentra en ``ArticlesController`` cuando
se visite la página principal de tu sitio. A veces necesitas rutas dinámicas que
aceptarán múltiples parámetos, por ejemplo cuando necesites una ruta para ver
el contenido de un artículo::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

La ruta anterior aceptará cualquier URL que se parezca a ``/article/15`` e invocará
el método ``view(15)`` de ``ArticlesController``. Esto no prevendrá que las personas
intenten acceder a URLs como ``/articles/foobar``. Si quieres, puedes restringir
algunos parámetros que se ajusten a una expresión regular::

    // Utilizando una interfaz fluida
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // Utilizando una matriz de opciones
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

En el ejemplo anterior se cambió el comparador asterisco por un nuevo marcador de
posición ``{id}``. Utilizar marcadores de posición nos permite valiadr partes de
la URL, en este caso utilizamos la expresión regular ``\d+`` por lo que sólo los
dígitos son comparados. Finalmente, le indicamos al enrutador que trate el marcador
de posición ``id`` como un argumento de función para el método ``view()``
especificando la opción ``pass``.
Hablaremos más sobre el uso de esta opción más adelante.

El enrutador de CakePHP también puede revertir rutas de coincidencia. Esto quiere
decir que desde una matriz que contiene parámetros de coincidencia es capaz de generar
una cadena de URL::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Obtendrás como salida
    /articles/15

Las rutas también pueden etiquetarse con un nombre único, esto te permite referenciarlas
rápidamente cuando creas enlaces en lugar de especificar cada uno de los parámetros de
la ruta::

    // En routes.php
    $routes->connect(
        '/upgrade',
        ['controller' => 'Subscriptions', 'action' => 'create'],
        ['_name' => 'upgrade']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'upgrade']);
    // Obtendrás como salida
    /upgrade

Para ayudar a mantener tu código de enrutamiento :term:`DRY`, el Enrutador tiene el concepto
de 'ámbitos'.
Un ámbito define un segmento de ruta común y, opcionalmente, rutas predeterminadas.
Cualquier ruta conectada dentro de un ámbito heredará la ruta y valores por defecto
de su ámbito::

    $routes->scope('/blog', ['plugin' => 'Blog'], function (RouteBuilder $routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

La rua anterior coincidiría con ``/blog/`` y la enviaría a
``Blog\Controller\ArticlesController::index()``.

El esqueleto de la aplicación viene con algunas rutas de inicio. Una vez has añadido
tus tuyas propias, puedes eliminar las rutas por defecto si no las necesitas.

.. index:: {controller}, {action}, {plugin}
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

Conectando Rutas
================

Para mantener tu código :term:`DRY` debes utilizar 'ámbitos de ruta'. Los ámbitos
de ruta no sólo te facilitan mantener tu código DRY, sino que ayudan al Enrutador a
optimizar sus operaciones. Este método se aplica por defecto al ámbito ``/``. Para
crear un ámbito y conectar algunas rutas utilizarás el método ``scope()``::

    // En config/routes.php
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Route\DashedRoute;

    $routes->scope('/', function (RouteBuilder $routes) {
        // Conecta las rutas alternativas genéricas.
        $routes->fallbacks(DashedRoute::class);
    });

El método ``connect()`` acepta hasta tres parámetros: la plantilla de URL para la que
deseas conincidencias, los valores predeterminados para los elementos de tu ruta.
Las opciones frecuentemente incluyen reglas de expresión regular que para ayudar al
enrutador a coincidir con elementos de la URL.

El formato básico para la definición de una ruta es::

    $routes->connect(
        '/url/template',
        ['targetKey' => 'targetValue'],
        ['option' => 'matchingRegex']
    );

El primer parámetro se utiliza para indicarle al enrutador qué tipo de URL se
está intentando controlar. La URL es una cadena normal delimitada por barras
diagonales, pero también puede contener un comodín (\*) o :ref:`route-elements`.
El uso de un comodín le indica al enrutador que puede aceptar cualquier argumento
adicional que se le proporcione. Las rutas sin \* sólo coincidirán con el patrón
de plantilla exacto proporcionado.

Una vez que hayas especificado una URL, utiliza los dos últimos parámetros de
``connect()`` para indicar a CakePHP qué debe hacer con la solicitud cuando
haya coincidencia. El segundo parámetro define la ruta 'objetivo'. Esto se puede
definir como una matriz o como una cadena de destino. Algunos ejemplos de ruta
objetivo son::

    // Matriz de destino a un controlador de aplicación
    $routes->connect(
        '/users/view/*',
        ['controller' => 'Users', 'action' => 'view']
    );
    $routes->connect('/users/view/*', 'Users::view');

    // Matriz de destino a un controlador de plugin con prefijo
    $routes->connect(
        '/admin/cms/articles',
        ['prefix' => 'Admin', 'plugin' => 'Cms', 'controller' => 'Articles', 'action' => 'index']
    );
    $routes->connect('/admin/cms/articles', 'Cms.Admin/Articles::index');

La primera ruta que conectamos coincide con las URL que comienzan con ``/users/view``
y asigna esas solucitudes al ``UsersController->view()``. El ``/*`` indica al enrutador
para pasar cualquier segmento adicional como argumentos del método. Por ejemplo,
``/users/view/123`` se asignaría a ``UsersController->view(123)``.

El ejemplo anterior también ilustra los destinos de cadena. Los destinos de cadena
proporcionan una forma compacta de definir el destino de una ruta. Los destinos de
cadena tienen la siguiente sintaxis::

    [Plugin].[Prefix]/[Controller]::[action]

Algunos ejemplos de destino de cadena son::

    // Controlador de aplicación
    'Articles::view'

    // Controlador de aplicación con prefijo
    Admin/Articles::view

    // Controlador de plugin
    Cms.Articles::edit

    // Controlador de plugin con prefijo
    Vendor/Cms.Management/Admin/Articles::view

Anteriormente, usamos el asterisco final (``/*``) para capturar segmentos de ruta adicionales,
también está el doble asterisco final (``/**``). Utilizando el doble asterisco final,
capturará el resto de una URL como un único argumento. Esto es útil cuando se desea
utilizar un argumento que incluye ``/``::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

La URL entrante ``/pages/the-example-/-and-proof`` daría como resultado el paso de un
único argumento ``the-example-/-and-proof``.

El segundo parámetro de ``connect()`` puede definir cualquier parámetro para componer
los parámetros de ruta po predeterminado::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

Este ejemplo utiliza el segundo parámetro de ``connect()`` para definir los parámetros
predeterminados. Si creas una aplicación que presenta productos para diferentes categorías
de clientes, podrías considerar crear una ruta. Esto permite enlazar ``/government`` en
lugar de ``/pages/display/5``.

Un uso común del enrutamiento es renombrar los controladores y sus acciones. En lugar de
acceder a nuestro controlador de usuarios como ``/users/some-action/5``, nos gustaría acceder
a él a través de ``/cooks/some-action/5``. La siguiente ruta se encarga de eso::

    $routes->connect(
        '/cooks/{action}/*', ['controller' => 'Users']
    );

Esto indica al enrutador que cualquier URL que empieze por ``/cooks/`` deberá ser
enviada al ``UsersController``. La acción invocada dependerá del valor del parámetro ``{action}``.
Utilizando :ref:`route-elements`, puedes crear rutas variables que aceptan entradas del usuario
o variables. La ruta anterior también utiliza el asteristo final. El asterisco final indica que
esta ruta debe aceptar cualquier argumento posicional adicional dado. Estos argumentos estarán
disponibles en la matriz :ref:`passed-arguments`.

Al generar URL también se utilizan rutas. Utilizando
``['controller' => 'Users', 'action' => 'some-action', 5]`` como una URL, generará
``/cooks/some-action/5`` si la ruta anterior es la primera coincidencia encontrada.

Las ruts que hemos conectado hasta ahora coincidirán con cualquier tipo de petición HTTP. Si estás
contruyendo un API REST, a menudo querrás asignar acciones HTTP a diferentes métodos de
controlador. El ``RouteBuilder`` proporciona métodos auxiliares que facilitan la definición
de rutas para tipos de peticiones HTTP específicas más simples::

    // Crea una ruta que sólo responde a peticiones GET.
    $routes->get(
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // Crea una ruta que sólo responde a peticiones PUT
    $routes->put(
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

Las rutas anteriores asignan la misma URL a diferentes acciones del controlador según
el tipo de petición HTTP utilizada. Las solicitudes GET irán a la acción 'view', mientras
que las solicitudes PUT irán a la acción UPDATE. Existen métodos auxiliares HTTP para:

* GET
* POST
* PUT
* PATCH
* DELETE
* OPTIONS
* HEAD

Todos estos métodos devuelven una instancia de ruta, lo que permite aprovechar la
:ref:`fluent setterts <route-fluent-methods>` para configurar aún más la ruta.

.. _route-elements:

Elementos de ruta
-----------------

Puedes especificar tus propios elementos de ruta y al hacerlo podrás definir los
lugares de la URL donde los parámetros para las acciones del controlador deben estar.
Cuando se realiza una solicitud, los valores para estos elementos de ruta se encuentran
en ``$this->request->getParam()`` en el controlador.
Cuando defines un elemento de ruta personalizado, opcionalmente puedes especificar
una expresión regular; esto le dice a CakePHP como saber si la URL está formada
correctamente o no. Si eliges no proporcionar una expresión regular, cualquier caracter
que no sea ``/`` será tratado como parte del parámetro::

    $routes->connect(
        '/{controller}/{id}',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    $routes->connect(
        '/{controller}/{id}',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

El ejemplo anterior ilustra cómo crear una forma rápida de ver modelos desde cualquier
controlador creando una URL que se parezca a ``/controllername/{id}``. La URL proporcionada
a ``connect()`` especifica dos elementos de ruta: ``{controller}`` y ``{id}``. El elemento
``{controller}`` es un elemento de ruta predeterminado de CakePHP, por lo que el enrutador
conoce cómo identificar y emparejar los nombres de controladores en la URL. El elemento
``{id}`` es un elemento de ruta personalizado y debe aclararse especificando una expresión
regular en el tercer parámetro de ``connect()``.

CakePHP no produce automáticamente URL en minúsculas y con guiones cuando utiliza el
parámetro ``{controller}``. Si necesitas hacer esto, el ejemplo anterior podría ser
reescrito así::

    use Cake\Routing\Route\DashedRoute;

    // Crea un constructor con una clase de ruta diferente
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/{controller}/{id}', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        $routes->connect(
            '/{controller}/{id}',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

La clase ``DashedRoute`` se asegurará de que los parámetros ``{controller}`` y
``{plugin}`` están correctamente en minúsculas y con guiones.

.. note::

    Los patrones utilizados por los elementos de ruta no deben contener
    ningún grupo de captura. Si lo hacen, el enrutador no funcionará
    correctamente.

Una vez que se ha definido esta ruta, al solicitar ``/apples/5`` se llamará al método
``view()`` de ApplesController. Dento del método ``view()``, necesitarás acceder al ID
pasado en ``$this->request->getParam('id')``.

Si tienes un único controlador en tu aplicación y no quieres que el nombre del
controlador aparezca en la URL, puedes asignar todas las URL a acciones en tu
controlador. Por ejemplo, para asignar todas las URL a acciones del contolador
``home``, para tener una URL como ``/demo`` en lugar de ``/home/demo``, puedes
hacer lo siguiente::

    $routes->connect('/{action}', ['controller' => 'Home']);

Si quieres proporcionar una URL que no distinga entre mayúsculas y minúsculas,
puedes utilizar modificadores en línea de expresiones regulares::

    $routes->connect(
        '/{userShortcut}',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

Un ejemplo más y serás un profesional del enrutamiento::

    $routes->connect(
        '/{controller}/{year}/{month}/{day}',
        ['action' => 'index']
    )->setPatterns([
        'year' => '[12][0-9]{3}',
        'month' => '0[1-9]|1[012]',
        'day' => '0[1-9]|[12][0-9]|3[01]'
    ]);

Esto es bastante complicado, pero muestra cuán poderosas pueden ser las rutas. La URL
proporcionada tiene cuatro elementos de ruta. El primero nos resulta familiar: es
un elemento de ruta por defecto que incica a CakePHP que espere un nombre de controlador.

A continuación, especificamos algunos valores predeterminados. Independientemente
del controlador, queremos que se llame a la acción ``index()``.

Finalmente, especificamos algunas expresiones regulares que coincidirán con año, mes
y día en forma numérica. Ten en cuenta que los paréntesis (captura de grupos) no se
admiten en expresiones regulares. Aún podemos especificar alternativas, como se
indicó anteriormente, pero no agrupadas entre paréntesis.

Una vez definida, esta ruta coincidirá con ``/articles/2007/02/01``,
``/articles/2004/11/16``, entregando las solicitudes a la acción ``index()``
de sus respectivos controladores, con los parámetros de fecha en
``$this->request->getParams()``.

Elementos de Ruta Reservados
----------------------------

Hay varios elementos de ruta que tienen un significado especial en CakePHP,
y no deben usarse a menos que desee un significado especial

* ``controller`` Se utiliza para nombrar el controlador de una ruta.
* ``action`` Se utiliza para nombrar la acción del controlador para una ruta.
* ``plugin`` Se utiliza para nombrar el complemento en el que se encuentra un controlador.
* ``prefix`` Usado para :ref:`prefix-routing`
* ``_ext`` Usado para :ref:`File extentions routing <file-extensions>`.
* ``_base`` Se establece a ``false`` para eliminar la ruta base de la URL generada. Si
  su aplicación no está en el directorio raíz, esto puede utilizarse para generar URL
  que son 'cake relative'.
* ``_scheme``  Configurado para crear enlaces en diferentes esquemas como `webcal` o `ftp`.
  El valor predeterminado es el esquema actual.
* ``_host`` Establece el host que se utilizará para el enlace. El valor predeterminado
  es el host actual.
* ``_port`` Establece el puerto si necesitamos crear enlaces en puertos no estándar.
* ``_full``  Si es ``true`` el valor de ``App.fullBaseUrl`` mencionado en
  :ref:`general-configuration` se atepondrá a la URL generada.
* ``#`` Permite configurar fragmentos de hash de URL.
* ``_https`` Establecerlo en ``true`` para convertir la URL generada a https o``false``
  para forzar http. Antes de 4.5.0 utilizar ``_ssl``.
* ``_method`` Define el tipo de petición/método a utilizar. Útil cuando trabajamos con
  :ref:`resource-routes`.
* ``_name`` Nombre de la ruta. Si has configurado rutas con nombre, puedes utilizar
  esta clave para especificarlo.

.. _route-fluent-methods:

Configurando Opciones de Ruta
-----------------------------

Hay varias opciones de ruta que se pueden configurar en cada ruta. Después de
conectar una ruta, puedes utilizar sus métodos de creación fluidos para configurar
aún más la ruta. Estos métodos reemplazan muchas de las claves en el parámetro
``$options`` de ``connect()``::

    $routes->connect(
        '/{lang}/articles/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    // Permite peticiones GET y POST.
    ->setMethods(['GET', 'POST'])

    // Sólo coincide con el subdominio del blog.
    ->setHost('blog.example.com')

    // Establecer los elementos de ruta que deben convertirse en argumentos pasados
    ->setPass(['slug'])

    // Establecer los patrones de coincidencia para los elementos de ruta
    ->setPatterns([
        'slug' => '[a-z0-9-_]+',
        'lang' => 'en|fr|es',
    ])

    // También permite archivos con extensión JSON
    ->setExtensions(['json'])

    // Establecer lang para que sea un parámetro persistente
    ->setPersist(['lang']);

Pasar Parámetros a una Acción
-----------------------------

Cuando conectamos rutas utilizando ::ref:`route-elements` es posible que desees
que los elementos enrutados se pasen como argumentos. La opción ``pass`` indica
qué elementos de ruta también deben estaar disponibles como argumentos pasados
a las funciones del controlador::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // Algún código aquí...
    }

    // routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->connect(
            '/blog/{id}-{slug}', // For example, /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view']
        )
        // Definir los elementos de ruta en la plantilla de ruta
        // para anteponerlos como argumentos de la función. El orden
        // es importante ya que esto pasará los elementos `$id` y `$slug`
        // como primer y segundo parámetro. Cualquier otro parámetro
        // adicional pasado en tu ruta se agregará después de los
        // argumentos de setPass().
        ->setPass(['id', 'slug'])
        // Definir un patrón con el que `id` debe coincidir.
        ->setPatterns([
            'id' => '[0-9]+',
        ]);
    });

Ahora, gracias a las capacidades de enturamiento inverso, puedes pasar la matriz
de URL como se muestra a continuación y CakePHP sabrá cómo formar la URL como se
define en las rutas::

    // view.php
    // Esto devolverá un enlace a /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

    // También podemos utilizar índices numéricos como parámetros.
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _path-routing:

Uso del Enrutamiento de Ruta
----------------------------

Hablamos de objetivos de cadena anteriormente. Lo mismo también funciona para la
generación de URL usando ``Router::pathUrl()``::

    echo Router::pathUrl('Articles::index');
    // salida: /articles

    echo Router::pathUrl('MyBackend.Admin/Articles::view', [3]);
    // salida: /admin/my-backend/articles/view/3

.. tip::

    La compatibilidad del IDE para el autocompletado del enrutamiento de ruta se puede habilitar con `CakePHP IdeHelper Plugin <https://github.com/dereuromark/cakephp-ide-helper>`_.

.. _named-routes:

Usar Rutas con Nombre
---------------------

A veces encontrarás que escribir todos los parámetros de la URL para una ruta es
demasiado detallado, o le gustaría aprovechar las mejoras de rendimiento que tienen
las rutas con nombre. Al conectar rutas, puedes especificar una opción ``_name``,
esta opción se puede utilizar en rutas inversas para identificar la ruta que deseas
utilizar::

    // Conectar una ruta con nombre.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Nombrar una ruta específica según el tipo de petición
    $routes->post(
        '/logout',
        ['controller' => 'Users', 'action' => 'logout'],
        'logout'
    );

    // Generar una URL utilizando una ruta con nombre.
    $url = Router::url(['_name' => 'logout']);

    // Generar una URL utilizando una ruta con nombre,
    // con algunos argumentos de cadena en la consulta.
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

Si tu plantilla de ruta contienen elementos de ruta como ``{controller}`` deberás
proporcionarlos como parte de las opciones de ``Router::url()``.

.. note::

    Los nombres de las rutas deben ser únicos en toda la aplicación. El mismo
    ``_name`` no se puede utilizar dos veces, incluso si los nombres aparecen
    dentro de un alcance de enrutamiento diferente.

Al crear rutas con nombre, probablemente querrás ceñirte a algunas convenciones
para los nombres de las rutas. CakePHP facilita la creación de nombres de rutas
al permitir definir prefijos de nombres en cada ámbito::

    $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
        // El nombre de esta ruta será `api:ping`
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });
    // Generar una URL para la ruta de ping
    Router::url(['_name' => 'api:ping']);

    // Utilizar namePrefix con plugin()
    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        // Conectar rutas.
    });

    // O con prefix()
    $routes->prefix('Admin', ['_namePrefix' => 'admin:'], function (RouteBuilder $routes) {
        // Conectar rutas.
    });

También puedes utilizar la opción ``_namePrefix`` dentro de ámbitos anidados y
funciona como se esperaba::

    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
            // Este nombre de ruta será `contacts:api:ping`
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // Generar una URL para la ruta de ping
    Router::url(['_name' => 'contacts:api:ping']);

Las rutas conectadas en ámbitos con nombre sólo se les agregarán nombres si la
ruta también tiene nombre. A las rutas sin nombre no se les aplicará el ``_namePrefix``.
Routes connected in named scopes will only have names added if the route is also
named. Nameless routes will not have the ``_namePrefix`` applied to them.

.. index:: admin routing, prefix routing
.. _prefix-routing:

Enrutamiento de Prefijo
-----------------------

.. php:staticmethod:: prefix($name, $callback)

Muchas aplicaciones requieren una sección de adminitración donde
los usuarios con privilegios puedan realizar cambios. Esto se hace
a menudo a través de una URL especial como ``/admin/users/edit/5``.
En CakePHP, el enrutamiento de prefijo puede ser habilitado utilizando
el método de ámbito ``prefix``::

    use Cake\Routing\Route\DashedRoute;

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // Todas las rutas aquí tendrán el prefijo `/admin`, y
        // tendrán el elemento de ruta `'prefix' => 'Admin'` agregado que
        // será necesario para generar URL para estas rutas
        $routes->fallbacks(DashedRoute::class);
    });

Los prefijos se asignan a subespacios de nombres en el espacio de nombres
``Controller`` en tu aplicación. Al tener prefijos como controladores separados,
puedes crear controladores más pequeños y simples. El comportamiento que es común
a los controladores con y sin prefijo se puede encapsular mediante herencia,
:doc:`/controllers/components`, o traits.  Utilizando nuestro ejemplo de usuarios,
acceder a la URL ``/admin/users/edit/5`` llamaría al médito ``edit()`` de nuestro
**src/Controller/Admin/UsersController.php** pasando 5 como primer parámetro.
El archivo de vista utilizado sería **templates/Admin/Users/edit.php**

Puedes asignar la URL /admin a tu acción ``index()`` del controlador pages utilizando
la siguiente ruta::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // Dado que te encuentras en el ámbito de admin,
        // no necesitas incluir el prefijo /admin ni el
        // elemento de ruta Admin.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

Al crear rutas de prefijo, puedes establecer parámetros de ruta adicionales
utilizando el argumento ``$options``::

    $routes->prefix('Admin', ['param' => 'value'], function (RouteBuilder $routes) {
        // Las rutas conectadas aquí tienen el prefijo '/admin' y
        // tienen configurada la clave de enrutamiento 'param'.
        $routes->connect('/{controller}');
    });

Los prefijos con varias palabras se convierten de forma predeterminada utilizando la
inflexión dasherize, es decir, ``MyPrefix`` se asignará a ``my-prefix`` en la URL.
Asegúrate de establecer una ruta para dichos prefijos si deseas utilizar un formato
diferente como, por ejemplo, subrayado::

    $routes->prefix('MyPrefix', ['path' => '/my_prefix'], function (RouteBuilder $routes) {
        // Las rutas conectadas aquí tiene el prefijo '/my_prefix'
        $routes->connect('/{controller}');
    });

También puedes definir prefijos dentro del alcance de un plugin::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

Lo anterior crearía una plantilla de ruta como ``/debug-kit/admin/{controller}``.
La ruta conectada tendría establecidos los elementos de ruta ``plugin`` y ``prefix``.

Al definir prefijos, puedes anidar varios prefijos si es necesario::

    $routes->prefix('Manager', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}/{action}');
        });
    });

Lo anterior crearía una plantilla de ruta como ``/manager/admin/{controller}/{action}``.
La ruta conectada tendría establecido el elemento de ruta ``prefix`` a ``Manager/Admin``.

El prefijo actual estará disponible desde los métodos del controlador a través de
``$this->request->getParam('prefix')``

Cuando usamos rutas de prefijo es importante configurar la opción ``prefix`` y
utilizar el mismo formato CamelCased que se utiliza in el método ``prefix()``.
A continuación se explica cómo crear este enlace utilizando el helper HTML::

    // Ve a una ruta de prefijo
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'Manager/Admin', 'controller' => 'Articles', 'action' => 'add']
    );

    // Deja un prefijo
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. index:: plugin routing

Crear Enlaces a Rutas de Prefijo
--------------------------------

Puedes crear enlaces que apunten a un prefijo añadiendo la clave del prefijo a la matriz
de URL::

    echo $this->Html->link(
        'New admin todo',
        ['prefix' => 'Admin', 'controller' => 'TodoItems', 'action' => 'create']
    );

Al utilizar anidamiento, es necesario encadenarlos entre sí::

    echo $this->Html->link(
        'New todo',
        ['prefix' => 'Admin/MyPrefix', 'controller' => 'TodoItems', 'action' => 'create']
    );

Esto se vincularía a un controlador con el espacio de nombre ``App\Controller\Admin\MyPrefix`` y
la ruta de archivo ``src/Controller/Admin/MyPrefix/TodoItemsController.php``.

.. note::

    Aquí el prefijo siempre es CamelCased, incluso si el resultado del enrutamiento
    es discontinuo.
    La propia ruta hará la inflexión si es necesario.

Enrutamiento de Plugin
----------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Las rutas para :doc:`/plugins` deben crearse utilizando el método ``plugin()``.
Este método crea un nuevo ámbito de enrutamiento para las rutas del plugin::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        // Las rutas conectadas aquí tienen el prefijo '/debug-kit' y
        // el elemento de ruta plugin configurado a 'DebugKit'.
        $routes->connect('/{controller}');
    });

Cuando creamos ámbitos de plugin, puedes personalizar el elemento de ruta utilizado
con la opción ``path``::

    $routes->plugin('DebugKit', ['path' => '/debugger'], function (RouteBuilder $routes) {
        // Las rutas conectadas aquí tiene el prefijo '/debugger' y
        // el elemento de ruta plugin configurado a 'DebugKit'.
        $routes->connect('/{controller}');
    });

Al utilizar ámbitos, puedes anidar ámbitos de plugin dentro de ámbitos de prefijos::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        $routes->plugin('DebugKit', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

Lo anteior crearía una ruta similar a ``/admin/debug-kit/{controller}``.
Tendría configurados los elementos de ruta ``prefix`` y ``plugin``. En la sección
:ref:`plugin-routes` hay más información sobre la creación de rutas de plugin.

Crear Enlaces a Rutas de Plugin
-------------------------------

Puedes crear enlaces que apunten a un plugin añadiendo la clave plugin a tu
matrix de URL::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

Por el contrario, si la solicitud activa es una solicitud de plugin y deseas crear
un enlace que no tenga plugin puedes hacer lo siguiente::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

Estableciendo ``'plugin' => null`` le indicas al Enrutador que quieres
crear un enlace que no forme parte de un plugin.

Enrutamiento SEO-Friendly
-------------------------

Algunos desarrolladores prefieren utilizar guiones en las URL, ya que se
percibe que dan un mejor posicionamiento en los motores de búsqueda.
La clase ``DashedRoute`` se puede utilizar en tu aplicación con la capacidad
de enrutar plugin, controlador y acciones camelizadas a una URL con guiones.

Por ejemplo, si tenemos un plugin ``ToDo``, con un controlador ``TodoItems``, y
una acción ``showItems()``, se podría acceder en ``/to-do/todo-items/show-items``
con la siguiente conexión de enrutador::

    use Cake\Routing\Route\DashedRoute;

    $routes->plugin('ToDo', ['path' => 'to-do'], function (RouteBuilder $routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Coincidencia de Métodos HTTP Específicos
----------------------------------------

Las rutas pueden coincidir con métodos HTTP específicos utilizando los métodos
del helper HTTP::

    $routes->scope('/', function (RouteBuilder $routes) {
        // Esta ruta sólo coincide con peticiones POST.
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // Coincide con múltiples tipos de peticiones
        $routes->connect(
            '/reviews/start',
            [
                'controller' => 'Reviews',
                'action' => 'start',
            ]
        )->setMethods(['POST', 'PUT']);
    });

Puedes hacer coincidir múltiples métodos HTTP utilizando una matriz. Dada que el
parámetro ``_method`` es una clave de enturamiento, participa tanto en el análisis
como en la generación de URL. Para generar URLs para rutas específicas de un método
necesitarás incluir la clave ``_method`` al generar la URL::

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

Coincidencia con Nombres de Dominio Específicos
-----------------------------------------------

Las rutas pueden utilizar la opción ``_host`` para coincidir sólo con dominios
específicos. Puedes utilizar el comodín ``*.`` para coincidir con cualquier
subdominio::

    $routes->scope('/', function (RouteBuilder $routes) {
        // Esta ruta sólo coincide en http://images.example.com
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // Esta ruta sólo coincide en http://*.example.com
        $routes->connect(
            '/images/old-logo.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('*.example.com');
    });

La opción ``_host`` también se utiliza en la generación de URL. Si tu opción
``_host`` especifica un dominio exacto, ese dominio se incluirá en la URL
generada. Sin embargo, si utilizas un comodín, tendrás que indicar el parámetro
``_host`` al generar la URL::

    // Si tienes esta ruta
    $routes->connect(
        '/images/old-logo.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // Necesitas esto para generar la URL
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. index:: file extensions
.. _file-extensions:

Enrutamiento de Extensiones de Archivo
--------------------------------------
.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

Para manejar diferentes extensiones de archivo en tus URL, puedes definir las
extensiones utilizando el método :php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()`::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml']);
    });

Esto habilitará ls extensiones nombradas para todas las rutas que se estén conectando
en ese ámbito **después** de la llamada a ``setExtensions()``, incluidas aquellas que
se estén conectando en ámbitos anidados.

.. note::

    Configurar las extensiones debe ser lo primero que hagas en un ámbito, ya que
    las extensiones sólo se aplicarán a rutas conectadas **después** de configurar
    las extensiones.

    También ten en cuenta que los ámbitos reabiertos **no** heredarán las extensiones
    definidas en ámbitos abiertos anteriormente.

Al utilizar extensiones, le indicas al enrutador que elimine cualquier extensión de
archivo coincidente en la URL y luego analice lo que queda. Si deseas crear una URL como
/page/title-of-page.html, crearías su ruta usando::

    $routes->scope('/page', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/{title}',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

Luego, para crear enlaces que correspondan con las rutas, simplemente usa::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

.. _route-scoped-middleware:

Middleware de Ámbito de Ruta
============================

Si bien el Middleware se puede aplicar a toda tu aplicación, aplicar middleware
a ámbitos de enrutamiento específicos ofrece más flexibilidad, ya que puedes aplicar
middleware sólo donde sea necesario, lo que permite que tu middleware no se preocupe
por cómo y dónde se aplica.

.. note::

    El middleware con ámbito aplicado se ejecutará mediante :ref:`RoutingMiddleware <routing-middleware>`,
    normalmente al final de la cola de middleware de tu aplicación.

Antes de que se pueda aplicar middleware a tu acplicación, es necesario
registrarlo en la colección de rutas::

    // en config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());

Una vez registrado, el middleware con ámbito se podrá aplicar
a ámbitos específicos::

    $routes->scope('/cms', function (RouteBuilder $routes) {
        // Activa CSRF y cookies middleware
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/{action}/*', ['controller' => 'Articles']);
    });

En situaciones en las que tienes ámbitos anidados, los ámbitos internos
heredarán el middleware aplicado en el ámbito contenedor::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function (RouteBuilder $routes) {
            $routes->applyMiddleware('v1compat');
            // Definir las rutas aquí.
        });
    });

En el ejemplo anterior, las rutas definidas en ``/v1`` tendrán aplicado el
middleware 'ratelimit', 'auth.api' y 'v1compat'. Si vuelves a abrir un ámbito,
el middleware aplicado a las rutas en cada ámbito quedará aislado::

    $routes->scope('/blog', function (RouteBuilder $routes) {
        $routes->applyMiddleware('auth');
        // Conecta las acciones authenticadas para el blog aquí.
    });
    $routes->scope('/blog', function (RouteBuilder $routes) {
        // Conecta las acciones públicas para el blog aquí.
    });

En el ejemplo anterior, los dos usos del alcance ``/blog`` no comparten middleware.
Sin embargo, ambos ámbitos heredarán el middleware definido en los ámbitos que los
engloban.

Agrupación de Middleware
------------------------

Para ayudar a mantener tu código de ruta :abbr:`DRY (Do not Repeat Yourself)` el middleware
se puede combinar en grupos. Una vez combinados, los grupos pueden aplicarse como middleware::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // Aplicar el grupo
    $routes->applyMiddleware('web');

.. _resource-routes:

Enrutamiento RESTful
====================

El enrutador ayuda a generar rutas RESTful para tus controladores. Las rutas RESTful
son útiles cuando estás creando API endpoints para tus aplicaciones. Si quisiéramos
permitir el acceso REST a un controlador de recetas, haríamos algo como esto::

    // En config/routes.php...

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

La primera línea configura una serie de rutas predeterminadas para el acceso REST
donde el método especifica el formato de resultado deseado, por ejemplo, xml, json
y rss. Estas rutas son sensible al método de solicitud HTTP.

=========== ===================== ================================
HTTP format URL.format            Acción del controlador invocada
=========== ===================== ================================
GET         /recipes.format       RecipesController::index()
----------- --------------------- --------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- --------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- --------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- --------------------------------
PATCH       /recipes/123.format   RecipesController::edit(123)
----------- --------------------- --------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ================================

.. note::

    El patrón predeterminado para los ID de recursos sólo coincide con números
    enterors o UUID. Si tus ID son diferentes, tendrás que proporcionar un
    patrón de expresión regular a través de la opción ``id``, por ejemplo
    ``$builder->resources('Recipes', ['id' => '.*'])``.

El método HTTP utilizado se detecta desde algunas fuentes diferentes.
Las fuentes en orden de preferencia son:

#. La variable POST ``_method``
#. El encabezado The ``X_HTTP_METHOD_OVERRIDE``.
#. El encabezado ``REQUEST_METHOD``

La variable POST ``_method`` es útil para utilizar un navegador como
cliente REST (o cualquier otra cosa que pueda realizar POST).
Simplemente, establece el valor de ``_method()`` con el nombre del
método de la solicitud HTTP que deseas emular.

Crear Rutas de Recursos Anidadas
--------------------------------

Una vez hayas conectado recursos en un alcance, también puedes conectar rutas para
subrecursos. Las rutas de subrecursos estarán precedidas por el nombre del recurso
original y un parámetro de identificación. Por ejemplo::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments');
        });
    });

Generará rutas de recursos tanto para ``articles`` como para ``comments``.
Las rutas de comments se verán así::

    /api/articles/{article_id}/comments
    /api/articles/{article_id}/comments/{id}

Puedes obtener el ``article_id`` en ``CommentsController`` mediante::

    $this->request->getParam('article_id');

De forma predeterminada, las rutas de recursos se asignan al mismo prefijo que el
ámbito contenedor. Si tienes controladores de recursos anidados y no anidados, puedes
utilizar un controlador diferente en cada contexto mediante el uso de prefijos::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments', ['prefix' => 'Articles']);
        });
    });

Lo anterior asignará el recurso 'Comments' a
``App\Controller\Articles\CommentsController``. Tener controladores separados
te permite mantener la lógica del controlador más simple. Los prefijos creados de
esta manera son compatibles con :ref:`prefix-routing`.

.. note::

    Si bien puedes anidar recursos con la profundidas que necesites, no se recomienda
    anidar más de dos recursos juntos.

Limitar las Rutas Creadas
-------------------------

Por defecto, CakePHP conectará 6 rutas para cada recurso. Si deseas conectar
sólo rutas de recursos específicas podrás utilizar la opción ``only``::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Crearía rutas de recurso de sólo lectura. Los nombres de las rutas son
``create``, ``update``, ``view``, ``index``, and ``delete``.

El **nombre de ruta y acción del controlador utilizados** predeterminados son
los siguientes:

============== =================================
Nombre de ruta  Acción del controlador utilizada
============== =================================
create          add
-------------- ---------------------------------
update          edit
-------------- ---------------------------------
view            view
-------------- ---------------------------------
index           index
-------------- ---------------------------------
delete          delete
============== =================================


Cambiar las Acciones del Controlador Utilizadas
-----------------------------------------------

Es posible que debas cambiar los nombres de las acciones del controlador que se
utilizan al conectar rutas. Por ejemplo, si tu acción ``edit()`` se llama ``put()``
puedes utilizar la clave ``actions`` para renombrar las acciones utilizadas::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

Lo anterior utilizaría ``put()`` para la acción ``edit()`` y ``add()``
en lugar de ``create()``.

Mapeo de Rutas de Recursos Adicionales
--------------------------------------

Puedes asignar métodos de recursos adicionales utilizando la opción ``map``::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // Esto conectaría /articles/deleteAll

Además de las rutas predeterminadas, esto también conectaría una ruta para
`/articles/delete-all`. De forma predeterminada, el segmento de ruta coincidirá
con el nombre de la clave. Puedes utilizar la clave 'path' dentro de la defición
del recurso para personalizar el nombre de la ruta::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'PUT',
                'path' => '/update-many',
            ],
        ],
    ]);
    // Esto conectaría /articles/update-many

Si defines 'only' and 'map', asegúrate de que tus métodos asignados también están
en la lista 'only'.

Enrutamiento de Recursos Prefijados
-----------------------------------

[[Continuar]]
Las rutas de recursos pueden conectarse a los controladores en prefijos de
enrutamiento conectando rutas en un ámbito prefijado or utilizando la opción ``prefix``::

    $routes->resources('Articles', [
        'prefix' => 'Api',
    ]);

.. _custom-rest-routing:

Clases de Ruta Personalizada para Rutas de Recursos
---------------------------------------------------

Puedes proporcionar la clave ``coneectOptions`` en la matriz ``$options`` para
``resources()`` para proporcionar la configuración personalizada utilizada por
``connect()``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });


Inflexión de URL para Rutas de Recursos
---------------------------------------

De forma predeterminada, los fragmentos de URL de los controladores con varias
palabras están en la forma con guiones del nombre del controlador. Por ejemplo,
el fragmento de URL de ``BlogPostsController`` sería **/blog-posts**.

Puedes especificar un tipo de inflexión alternativo utilizando la opción ``inflect``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'underscore' // Will use ``Inflector::underscore()``
        ]);
    });

Lo anterior generará una URL del tipo: **/blog_posts**.

Cambiar el Elemento de Ruta
---------------------------

De forma predeterminada, las rutas de recursos utilizan una forma inflexionada
del nombre del recurso para el segmento de URL. Puedes configurar un segmento
de ruta personalizado con la opción ``path``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

.. index:: passed arguments
.. _passed-arguments:

Argumentos Pasados
==================

Los argumentos pasados son argumentos adicionales or segmentos de ruta
que se utilizan al realizar una solicitud. A menudo se utilizan para
pasar parámetros a los métodos de tu controlador::

    http://localhost/calendars/view/recent/mark

En el ejemplo anterior, tanto ``recent`` como ``mark`` se pasan como argumentos a
``CalendarsController::view()``. Los argumentos pasados se entregan a tus
controladores de tres maneras. En primer lugar, como argumentos para el método de
acción llamado y, en segundo lugar, están disponibles en
``$this->request->getParams('pass')`` como una matriz indexada numéricamente. Al
utilizar rutas personalizadas, también puedes forzar que parámetros particulares
entren en los argumentos pasados.

Si visitara la URL mencionada anteriormente, y tuviera una acción de controlador
similar a::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

Otendrías el siguiente resultado::

    Array
    (
        [0] => recent
        [1] => mark
    )

Estos mismos datos también están disponibles en ``$this->request->getParam('pass')``
en tus controladores, vistas y helpers. Los valores en la matriz de paso están
indexados numéricamente según el orden en el que aparecen en la URL llamada::

    debug($this->request->getParam('pass'));

Cualquiera de los anteriores generaría::

    Array
    (
        [0] => recent
        [1] => mark
    )

Al generar URL, utilizando un :term:`arreglo de enrutamiento` agregas argumentos
pasados como valores sin claves de cadena en la matriz::

    ['controller' => 'Articles', 'action' => 'view', 5]

Dado que ``5`` es una clave numérica, se trata como un argumento pasado.

Generando URL
=============

.. php:staticmethod:: url($url = null, $full = false)
.. php:staticmethod:: reverse($params, $full = false)

Generar URL o enrutamiento inverso es una característica de CakePHP que se
utiliza para permitirte cambiar la estructura de tu URL sin tener que modificar
todo tu código.

Si creas URL utilizando cadenas como::

    $this->Html->link('View', '/articles/view/' . $id);

Y luego decides que ``/articles`` realmente debería llamarse ``posts``,
tendría que ir por toda tu aplicación renombrando las URL. Sin embargo,
si definiste tu enlace como::

    //`link()` utiliza internamente Router::url() y acepta una matriz de enrutamiento

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

o::

    //'Router::reverse()' opera en la matriz de parámetos de la petición
    //y producirá una cadena de url válida para `link()`

    $requestParams = Router::getRequest()->getAttribute('params');
    $this->Html->link('View', Router::reverse($requestParams));

Luego, cuando decidieras cambiar tus URL, podrías hacerlo definiendo una ruta.
Esto cambiaría tanto la asignación de URL entrante como las URL generadas.

La elección de la técnica está determinada por qué tan bien se pueden predecir
los elementos de la matriz de enrutamiento.

Utilizando ``Router::url()``
----------------------------

``Router::url()`` te permite utilizar :term:`routing arrays <arreglo de enrutamiento>`
en situaciones donde los elementos requeridos de la matriz son fijos o se deducen
fácilmente.

Proporcionará enrutamiento inverso cuando la url de destino esté bien definida::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

También es útil cuando el destino es desconocido, pero sigue un patrón bien definido::

    $this->Html->link(
        'View',
        ['controller' => $controller, 'action' => 'view', $id]
    );

Los elementos con claves numéricas se tratan como :ref:`passed-arguments`.

Al utilizar matrices de enrutamiento, puedes definir tanto los parámetros de
la cadena de consulta como los fragmentos de documentos utilizando claves
especiales::

    $routes->url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Generará una URL del tipo.
    /articles/index?page=1#top

También puedes utilizar cualquiera de los elementos de ruta especiales al generar URL:

* ``_ext`` Se utiliza para enrutamiento de :ref:`file-extensions`.
* ``_base`` Establecer en ``false`` para eliminar la ruta base de la URL generada.
  Si tu aplicación no está en el directorio raíz, esto se puede utilizar para generar
  URL relativas a cake.
* ``_scheme`` Configurado para crear enlaces en diferentes esquemas como ``webcal`` o
  ``ftp``. El valor predeterminado es el esquema actual.
* ``_host`` Establece el host que se utilizará en el enlace. El valor por defecto es el
  del host actual.
* ``_port`` Establece el puerto si necesitas crear enlaces a puestos no estándar.
* ``_method`` Define el verbo HTTP para el que es la URL.
* ``_full`` Si es ``true`` el valor de ``App.fullBaseUrl`` mencionado en
  :ref:`general-configuration` se antepondrá a las URL generadas.
* ``_https`` Establecer en ``true`` para convertir la URL generada a https o ``false``
  para forzar http.
* ``_name`` Nombre de la ruta. Si has configurado rutas con nombre, puedes utilizar esta
  clave para especificarlas.

Utilizando ``Router::reverse()``
--------------------------------

``Router::reverse()`` te permite utilizar los :ref:`request-parameters` en casos
donde la URL actual con algunas modificaciones es la base para el destino y los
elementos de la URL actual son impredecibles.

Como ejemplo, imagina un blog que permite a los usuarios crear **Articles** y
**Comments**, y marcar ambos como *published* o *draft*. Ambas URL de la página index
pueden incluir el ID del usuario. La URL de **Comments** también puede incluir el
ID de un **Article** para identificar a qué artículo se refieren los comentarios.

Aquí están las url para este escenario::

    /articles/index/42
    /comments/index/42/18

Cuando el autor utilice estas páginas, sería conveniente incluir enlaces que
permitan mostrar la página con todos los resultados, sólo publicados o sólo
borrador.

Para mantener el código DRY, sería mejor incluir los enlaces a través de un
elemento::

    // element/filter_published.php

    $params = $this->getRequest()->getAttribute('params');

    /* preparar la url para Borrador */
    $params = Hash::insert($params, '?.published', 0);
    echo $this->Html->link(__('Draft'), Router::reverse($params));

    /* Preparar la url para Publicados */
    $params = Hash::insert($params, '?.published', 1);
    echo $this->Html->link(__('Published'), Router::reverse($params));

    /* Preparar la url para Todos */
    $params = Hash::remove($params, '?.published');
    echo $this->Html->link(__('All'), Router::reverse($params));

Los enlaces generados por estas llamadas incluirían uno o dos parámetros
de paso dependiendo de la estructura de la URL actual. Y el código
funcionaría para cualquier URL futura, por ejemplo, si comenzara a usar
prefijos de ruta o si agregara más parámetros del paso.

Matrices de Enrutamiento vs Parámetros de Solicitud
---------------------------------------------------

La diferencia significativa entre las dos matrices y su uso en estos métodos
de enrutamiento inverso está la forma en la que incluyen los parámetros
de paso.

Las matrices de enrutamiento incluyen los parámetros de paso como valores
sin clave en la matriz::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        $id, //un parámetro de paso
        'page' => 3, //un argumento de consulta
    ];

Los parámetros de consulta incluyen parámtros de paso en la clave 'pass'
de la matriz::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        'pass' => [$id], //los parámetros de paso
        '?' => ['page' => 3], //los parámtros de consulta
    ];

Por lo tanto, si los deseas, es posible convertir los parámetros de solicitud
en una matriz de enrutamiento o viceversa.

.. _asset-routing:

Generando URL de Activos
========================

La clase ``Asset`` proporciona métodos para generar URL para los archivos css,
javascript, imágenes y otros archivos de activos estáticos de tu aplicación::

    use Cake\Routing\Asset;

    // Generar una URL para APP/webroot/js/app.js
    $js = Asset::scriptUrl('app.js');

    // Generar una URL para APP/webroot/css/app.css
    $css = Asset::cssUrl('app.css');

    // Generar una URL para APP/webroot/image/logo.png
    $img = Asset::imageUrl('logo.png');

    // Generar una URL para APP/webroot/files/upload/photo.png
    $file = Asset::url('files/upload/photo.png');

Los métodos anteriores también aceptan una matriz de opciones como segundo parámetro:

* ``fullBase`` Agrega la URL completa con el nombre de dominio.
* ``pathPrefix`` Prefijo de ruta para URL relativas.
* ``plugin`` Puedes añdirlo como ``false`` para evitar que las rutas se traten como
  un recurso de un plugin.
* ``timestamp`` Sobrescribe el valor de ``Asset.timestamp`` en Configure. Establecer
  a ``false`` para omitir la generación de la marca de tiempo. Establecer a ``true``
  para aplicar marcas de tiempo cuando el debug is true. Set to ``'force'`` para habilitar
  siempre la marca de tiempo independientemente del valor de debug.

::

    // Genera http://example.org/img/logo.png
    $img = Asset::url('logo.png', ['fullBase' => true]);

    // Genera /img/logo.png?1568563625
    // Donde la marca de tiempo es la ultima hora de modificación del archivo
    $img = Asset::url('logo.png', ['timestamp' => true]);

Para generar URL de activo para archivos en un plugin utiliza
:term:`Sintaxis de plugin`::

    // Genera `/debug_kit/img/cake.png`
    $img = Asset::imageUrl('DebugKit.cake.png');

.. _redirect-routing:

Redirección de Enrutamiento
===========================

La redirección de enrutamiento te permite emitir redirección de estado
HTTP 30x para rutas entrantes y apuntarlas a URL diferentes. Esto es útil
cuando deseas informar a las aplicaciones cliente que un recurso se ha
movido y no deseas exponer dos URL para el mismo contenido.

Las rutas de redireccionamiento son diferentes de las rutas normales en que
realizan una redirección de encabezado real si se encuentra una coincidencia.
La redirección puede ocurrir a un destino dentro de tu aplicación o a una
ubicación externa::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // O ['persist'=>['id']] para el enrutamiento predeterminado
            // donde la acción view espera $id como argumento.
        );
    })

Redirige ``/home/*`` a ``/articles/view`` y pasa los parámetros a
``/articles/view``. El uso de una matriz como destino de
redireccionamiento te permite utilizar otras rutas para definir
hacia dónde se debe dirigir una cadena de URL. Puedes redirigir a
ubicaciones externas utilizando una cadena de URL como destino::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

Esto redirigiría ``/articles/*`` a ``http://google.com`` con un estado
HTTP de 302.

.. _entity-routing:

Enrutamiento de Entidades
=========================

El enrutamiento de entidades te permite utilizar una entidad, una matriz o un objeto
que implemente ``ArrayAccess`` como una fuente de parámetros de enrutamiento. Esto
te permite refactorizar rutas fácilmente y generar URL con menos código. Por ejemplo,
si comienzas con una ruta similar a::

    $routes->get(
        '/view/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

Puedes generar URL para esta ruta utilizando::

    // $article es una entidad en el ámbito local.
    Router::url(['_name' => 'articles:view', 'id' => $article->id]);

Más adelante, es posible que desees exponer el slug del artículo en la URL con
fines de SEO. Para hacer esto necesitarás actualizar todos los lugares donde
generes una URL a la ruta ``articles:view``, lo que podría llevar algún tiempo.
Si utilizamos rutas de entidad, pasamos toda la entidad del artículo a la
generación de URL, lo que nos permite omitir cualquier reelaboración cuando las
URL requiren más parámetros::

    use Cake\Routing\Route\EntityRoute;

    // Crea más rutas de entidad para el resto de este ámbito.
    $routes->setRouteClass(EntityRoute::class);

    // Crea la ruta como antes.
    $routes->get(
        '/view/{id}/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

Ahora podemos generar URL utilizando la clave ``_entity``::

    Router::url(['_name' => 'articles:view', '_entity' => $article]);

Esto extraerá las propiedades ``id`` y ``slug`` de la entidad proporcionada.

.. _custom-route-classes:

Clases de Ruta Personalizadas
=============================

Las clases de ruta personalizadas te permiten ampliar y cambiar la forma en que
las rutas individuales analizan las solicitudes y manejan el enrutamiento inverso.
Las clases de ruta tienen algunas convenciones:

* Se espera que las clases de ruta se encuentren en el espacio de nombres ``Routing\Route`` de tu aplicación o plugin.
* Las clases de ruta deben extender :php:class:`Cake\\Routing\\Route\\Route`.
* Las clases de ruta deben implementar uno o ambos ``match()`` y/o ``parse()``.

El método ``parse()`` se utiliza para analizar una URL entrante. Debería generar
una matriz de parámetros de solicitud que pueda resolverse en un controlador
y acción. Este método devuelve ``null`` para indicar un error de coincidencia.

El método ``match()`` se utiliza para hacer coincidir una matriz de parámetros
de URL y crear una cadena de URL. Si los parámertos de la URL no coinciden, se
debe devolver la ruta ``false``.

Puedes utilizar una clase de ruta personalizada al realizar una ruta utilizando
la opción ``routeClass``::

    $routes->connect(
        '/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['routeClass' => 'SlugRoute']
    );

    // O configurando routeClass en su ámbito.
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
            '/{slug}',
            ['controller' => 'Articles', 'action' => 'view']
        );
    });

Esta ruta crearía una instancia de ``SlugRoute`` y te permitiría implementar
un manejo de parámetros personalizado. Puedes utilizar clases de ruta de plugin
utilizando el estándar :term:`Sintaxis de plugin`.

Clase de Ruta Predeterminada
----------------------------

.. php:staticmethod:: setRouteClass($routeClass = null)

Si desea utilizar una ruta de clase alternativa para tus rutas además de la
``Ruta`` predeterminada, puedes hacerlo llamando a ``RouterBuilder::setRouteClass()``
antes de configurar cualquier ruta y evitar tener que especificar la opción
``routeClass`` para cada ruta. Por ejemplo utilizando::

    use Cake\Routing\Route\DashedRoute;

    $routes->setRouteClass(DashedRoute::class);

Hará que todas las rutas conectadas después de esto utilicen la clase de ruta
``DashedRoute``. Llamando al método sin un argumento devolverá la clase de ruta
predeterminada actual.

Método de Respaldo/Alternativas
-------------------------------

.. php:method:: fallbacks($routeClass = null)

El método de respaldo es un atajo simple para definir rutas predeterminadas.
El método utiliza la clase de enrutamiento pasada para las reglas definidas o,
si no se proporciona ninguna clase, se utiliza la clase devuelta por
``RouterBuilder::setRouteClass()``.

Llamar a alternativas así::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Es equivalente a las siguientes llamadas explícitas::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/{controller}', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/{controller}/{action}/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    El uso de la clase de ruta predeterminada (``Route``) con alternativas,
    or cualquier ruta con elemento de ruta ``{plugin}`` o ``{controller}``
    dará como resultado una URL inconsistente.

.. warning::
    Las plantillas de ruta alternativas son muy genéricas y permites generar y
    analizar URL para controladore sy acciones que no existen. Las URL
    alternativas también pueden introducir ambigüedad y duplicidad en tus URL.

    A medida que tu aplicaicón crece, se recomienda alejarse de las URL alternativas
    y definir explícitamente las rutas en tu aplicación.

Crear Parámetros de URL Persistentes
====================================

Puedes conectarte al proceso de generación de URL utilizando funciones de filtro
de URL. Las funciones de filtro se llaman *antes* de que las URL coincidan con las
rutas, esto te permite preparar las URL antes de enrutarlas.

La devolución de llamada de las funciones de filtro deben contar con los siguientes
parámetos:

- ``$params`` La matriz de parámetros de URL que se está procensando.
- ``$request`` La petición actual (instancia de ``Cake\Http\ServerRequest``).

La función de filtro de URL *siempre* debería devolver los parámetros incluso si
no están modificados.

Los filtros de URL te permiten implementar funciones como parámetros persistentes::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }

        return $params;
    });

Las funciones de filtro se aplican en el orden en que están conectadas.

Otro caso de uso es cambiar una determinada ruta en tiempo de ejecución
(por ejemplo, rutas de plugin)::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
        if (empty($params['plugin']) || $params['plugin'] !== 'MyPlugin' || empty($params['controller'])) {
            return $params;
        }
        if ($params['controller'] === 'Languages' && $params['action'] === 'view') {
            $params['controller'] = 'Locations';
            $params['action'] = 'index';
            $params['language'] = $params[0];
            unset($params[0]);
        }

        return $params;
    });

Esto alterará la siguiente ruta::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

En esto::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

.. warning::
    Si estás utilizando las funcionees de almacenamiento de caché de
    :ref:`routing-middleware` debes definir los filtros de URL en tu aplicación
    ``bootstrap()`` ya que los filtros no son parte de los datos almacenados en
    caché.

.. meta::
    :title lang=es: Enrutamiento
    :keywords lang=es: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
