Objetos de Solicitud y Respuesta
################################

.. php:namespace:: Cake\Http

Los objetos de solicitud y respuesta proporcionan una abstracción en torno a las solicitudes y respuestas HTTP. El objeto
de solicitud en CakePHP le permite realizar una introspección de una solicitud entrante, mientras que el objeto de
respuesta le permite crear respuestas HTTP sin esfuerzo desde sus controladores.

.. index:: $this->request
.. _cake-request:

Solicitud (Request)
===================

.. php:class:: ServerRequest

``ServerRequest`` es el objeto de solicitud predeterminado utilizado en CakePHP. Centraliza una serie de funciones para
interrogar e interactuar con los datos de la solicitud. En cada solicitud, se crea un Request y luego se pasa por
referencia a las distintas capas de una aplicación que utiliza datos de solicitud. De forma predeterminada, la solicitud
se asigna a ``$this->request`` y está disponible en Controladores, Celdas, Vistas y Ayudantes. También puede acceder a él
en Componentes usando la referencia del controlador.

Algunas de las tareas que realiza ``ServerRequest`` incluyen:

* Procesar los arreglos GET, POST y FILES en las estructuras de datos con las que está familiarizado.
* Proporcionar una introspección del entorno correspondiente a la solicitud. Información como los encabezados enviados,
  la dirección IP del cliente y los nombres de subdominio/dominio en el servidor en el que se ejecuta su aplicación.
* Proporcionar acceso a los parámetros de solicitud tanto como índices de matriz como propiedades de objetos.

El objeto de la solicitud de CakePHP implementa `PSR-7 ServerRequestInterface <https://www.php-fig.org/psr/psr-7/>`_, lo que
facilita el uso de bibliotecas desde fuera de CakePHP.

.. _request-parameters:

Parámetros de la solicitud
--------------------------

La solicitud expone los parámetros de enrutamiento a través del método ``getParam()``::

    $controllerName = $this->request->getParam('controller');

Para obtener todos los parámetros de enrutamiento como una matriz, use ``getAttribute()``::

    $parameters = $this->request->getAttribute('params');

Se accede a todos los :ref:`route-elements` a través de esta interfaz.

Además de :ref:`route-elements`, a menudo también necesita acceso a :ref:`passed-arguments`. Ambos también están
disponibles en el objeto de solicitud:

    // Argumentos pasados
    $passedArgs = $this->request->getParam('pass');

Todos le proporcionarán acceso a los argumentos pasados. Hay varios parámetros importantes/útiles que CakePHP usa
internamente, y todos ellos también se encuentran en los parámetros de enrutamiento:

* ``plugin`` El complemento que maneja la solicitud. Será nulo cuando no haya ningún complemento.
* ``controller`` El controlador que maneja la solicitud actual.
* ``action`` La acción que maneja la solicitud actual.
* ``prefix`` El prefijo de la acción actual. Consulte :ref:`prefix-routing` para obtener más información.

Parámetros de cadena de consulta
--------------------------------

.. php:method:: getQuery($name, $default = null)

Los parámetros de la cadena de consulta se pueden leer usando el método ``getQuery()``::

    // URL es /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

Puede acceder directamente a la propiedad de consulta o puede utilizar el método ``getQuery()`` para leer la matriz de
consulta de URL sin errores. Cualquier clave que no exista devolverá ``null``::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // También puede proporcionar valores predeterminados
    $foo = $this->request->getQuery('does_not_exist', 'default val');

Si desea acceder a todos los parámetros de consulta, puede utilizar ``getQueryParams()``:

    $query = $this->request->getQueryParams();

Datos del cuerpo de la solicitud
--------------------------------

.. php:method:: getData($name, $default = null)

Se puede acceder a todos los datos POST normalmente disponibles a través de la variable global ``$_POST`` de PHP usando
:php:meth:`Cake\\Http\\ServerRequest::getData()`. Por ejemplo::

    // Se puede acceder a una entrada con un atributo de nombre 'título'
    $title = $this->request->getData('title');

Puede utilizar nombres separados por puntos para acceder a datos anidados. Por ejemplo::

    $value = $this->request->getData('address.street_name');

Para nombres inexistentes se devolverá el valor ``$default``::

    $foo = $this->request->getData('value.that.does.not.exist');
    // $foo == null

También puede utilizar :ref:`body-parser-middleware` para analizar el cuerpo de la solicitud de diferentes tipos de
contenido en una matriz, de modo que sea accesible a través de ``ServerRequest::getData()``.

Si desea acceder a todos los parámetros de datos, puede utilizar
``getParsedBody()``::

    $data = $this->request->getParsedBody();

.. _request-file-uploads:

Cargas de archivos
------------------

Se puede acceder a los archivos cargados a través de los datos del cuerpo de la solicitud, utilizando el método
:php:meth:`Cake\\Http\\ServerRequest::getData()` descrito anteriormente. Por ejemplo, se puede acceder a un archivo desde
un elemento de entrada con un atributo de nombre ``attachment`` de esta manera::

    $attachment = $this->request->getData('attachment');

De forma predeterminada, las cargas de archivos se representan en los datos de la solicitud como objetos que implementan
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded -archivos>`__. En la
implementación actual, la variable ``$attachment`` en el ejemplo anterior contendría de forma predeterminada una
instancia de ``\Laminas\Diactoros\UploadedFile``.

Acceder a los detalles del archivo cargado es bastante simple, así es como puede obtener los mismos datos que proporciona
la matriz de carga de archivos de estilo antiguo:

    $name = $attachment->getClientFilename();
    $type = $attachment->getClientMediaType();
    $size = $attachment->getSize();
    $tmpName = $attachment->getStream()->getMetadata('uri');
    $error = $attachment->getError();

Mover el archivo cargado desde su ubicación temporal a la ubicación de destino deseada no requiere acceder manualmente al
archivo temporal, sino que se puede hacer fácilmente usando el método ``moveTo()`` del objeto::

    $attachment->moveTo($targetPath);

En un entorno HTTP, el método ``moveTo()`` validará automáticamente si el archivo es un archivo cargado real y generará
una excepción en caso de que sea necesario. En un entorno CLI, donde no existe el concepto de cargar archivos, permitirá
mover el archivo al que ha hecho referencia independientemente de sus orígenes, lo que hace posible probar la carga de
archivos.

.. php:method:: getUploadedFile($path)

Devuelve el archivo cargado en una ruta específica. La ruta utiliza la misma sintaxis de puntos que el método
:php:meth:`Cake\\Http\\ServerRequest::getData()`::

    $attachment = $this->request->getUploadedFile('attachment');

A diferencia de :php:meth:`Cake\\Http\\ServerRequest::getData()`, :php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()`
solo devolvería datos cuando exista una carga de archivo real para la ruta dada, si hay datos regulares del cuerpo de la
solicitud que no son archivos presentes en la ruta dada, entonces este método devolverá "nulo", tal como lo haría para
cualquier ruta inexistente.

.. php:method:: getUploadedFiles()

Devuelve todos los archivos cargados en una estructura de matriz normalizada. Para el ejemplo anterior con el nombre de
entrada del archivo ``attachment``, la estructura se vería así::

    [
          'attachment' => object(Laminas\Diactoros\UploadedFile) {
              // ...
          }
    ]

.. php:method:: withUploadedFiles(array $files)

Este método establece los archivos cargados del objeto de solicitud, acepta una matriz de objetos que implementan
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7 /#16-uploaded-files>`__. Reemplazará
todos los archivos cargados posiblemente existentes::

    $files = [
        'MyModel' => [
            'attachment' => new \Laminas\Diactoros\UploadedFile(
                $streamOrFile,
                $size,
                $errorStatus,
                $clientFilename,
                $clientMediaType
            ),
            'anotherAttachment' => new \Laminas\Diactoros\UploadedFile(
                '/tmp/hfz6dbn.tmp',
                123,
                \UPLOAD_ERR_OK,
                'attachment.txt',
                'text/plain'
            ),
        ],
    ];

    $this->request = $this->request->withUploadedFiles($files);

.. note::

    Los archivos cargados que se agregaron a la solicitud a través de este método *no* estarán disponibles en los datos
    del cuerpo de la solicitud, es decir, no puede recuperarlos a través de
    :php:meth:`Cake\\Http\\ServerRequest::getData()` ! Si los necesita en los datos de la solicitud (también), entonces
    debe configurarlos mediante :php:meth:`Cake\\Http\\ServerRequest::withData()` o
    :php:meth:`Cake\\Http\ \ServerRequest::withParsedBody()`.

PUT, PATCH o DELETE Datos
-------------------------

.. php:method:: input($callback, [$options])

Al crear servicios REST, a menudo se aceptan datos de solicitud en solicitudes ``PUT`` y ``DELETE``. Cualquier dato del
cuerpo de solicitud ``application/x-www-form-urlencoded`` se analizará automáticamente y se establecerá en
``$this->data`` para las solicitudes ``PUT`` y ``DELETE``. Si acepta datos JSON o XML, consulte a continuación cómo puede
acceder a esos cuerpos de solicitud.

Al acceder a los datos de entrada, puede decodificarlos con una función opcional. Esto resulta útil al interactuar con el
contenido del cuerpo de la solicitud XML o JSON. Se pueden pasar parámetros adicionales para la función de decodificación
como argumentos a ``input()``::

    $jsonData = $this->request->input('json_decode');

Variables de entorno (de $_SERVER y $_ENV)
------------------------------------------

.. php:method:: putenv($key, $value = null)

``ServerRequest::getEnv()`` es un contenedor para la función global ``getenv()`` y actúa como un captador/establecedor de
variables de entorno sin tener que modificar los globales ``$_SERVER`` y ``$_ENV``::

    // Obtener el host
    $host = $this->request->getEnv('HTTP_HOST');

    // Establecer un valor, generalmente útil en las pruebas.
    $this->request->withEnv('REQUEST_METHOD', 'POST');

Para acceder a todas las variables de entorno en una solicitud, utilice ``getServerParams()``::

    $env = $this->request->getServerParams();

Datos XML o JSON
----------------

Las aplicaciones que emplean :doc:`/development/rest` a menudo intercambian datos en cuerpos de publicaciones sin
codificación URL. Puede leer datos de entrada en cualquier formato usando :php:meth:`~Cake\\Http\\ServerRequest::input()`.
Al proporcionar una función de decodificación, puede recibir el contenido en un formato deserializado::

    // Obtenga datos codificados en JSON enviados a una acción PUT/POST
    $jsonData = $this->request->input('json_decode');

Algunos métodos de deserialización requieren parámetros adicionales cuando se llaman, como el parámetro 'as array' en
``json_decode``. Si desea convertir XML en un objeto DOMDocument, :php:meth:`~Cake\\Http\\ServerRequest::input()` también
admite el paso de parámetros adicionales::

    // Obtener datos codificados en XML enviados a una acción PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Información de ruta
-------------------

El objeto de solicitud también proporciona información útil sobre las rutas de su aplicación. Los atributos ``base`` y
``webroot`` son útiles para generar URL y determinar si su aplicación está o no en un subdirectorio. Los atributos que
puedes utilizar son:

    // Supongamos que la URL de solicitud actual es /subdir/articles/edit/1?page=1

    // Contiene /subdir/articles/edit/1?page=1
    $here = $request->getRequestTarget();

    // Contiene /subdir
    $base = $request->getAttribute('base');

    // Contiene /subdir/
    $base = $request->getAttribute('webroot');

.. _check-the-request:

Comprobación de las condiciones de la solicitud
-----------------------------------------------

.. php:method:: is($type, $args...)

El objeto de solicitud proporciona una forma de inspeccionar ciertas condiciones en una solicitud determinada. Al
utilizar el método ``is()``, puede comprobar una serie de condiciones comunes, así como inspeccionar otros criterios de
solicitud específicos de la aplicación:

    $isPost = $this->request->is('post');

También puede ampliar los detectores de solicitudes que están disponibles, utilizando
:php:meth:`Cake\\Http\\ServerRequest::addDetector()` para crear nuevos tipos de detectores. Hay diferentes tipos de
detectores que puedes crear:

* Comparación de valores del entorno: compara un valor obtenido de :php:func:`env()` para determinar su igualdad con el
  valor proporcionado.
* Comparación del valor del encabezado: si el encabezado especificado existe con el valor especificado o si el invocable
  devuelve verdadero.
* Comparación de valores de patrón: la comparación de valores de patrón le permite comparar un valor obtenido de
  :php:func:`env()` con una expresión regular.
* Comparación basada en opciones: las comparaciones basadas en opciones utilizan una lista de opciones para crear una
  expresión regular. Las llamadas posteriores para agregar un detector de opciones ya definido fusionarán las opciones.
* Detectores de devolución de llamada: los detectores de devolución de llamada le permiten proporcionar un tipo de
  "callback" para manejar la verificación. La devolución de llamada recibirá el objeto de solicitud como único parámetro.

.. php:method:: addDetector($name, $options)

Algunos ejemplos serían::

    // Agregue un detector de entorno.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Agregue un detector de valor de patrón.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Agregar un detector de opciones
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);


    // Agregue un detector de encabezado con comparación de valores
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => 1]
    ]);

    // Agregue un detector de encabezado con comparación invocable
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => function ($value, $header) {
            return in_array($value, ['1', '0', 'yes', 'no'], true);
        }]
    ]);

    // Agregue un detector de devolución de llamada. Debe ser un invocable válido.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Agregue un detector que use argumentos adicionales.
    $this->request->addDetector(
        'csv',
        [
            'accept' => ['text/csv'],
            'param' => '_ext',
            'value' => 'csv',
        ]
    );

Hay varios detectores integrados que puedes utilizar:

* ``is('get')`` Verifique si la solicitud actual es un GET.
* ``is('put')`` Verifique si la solicitud actual es un PUT.
* ``is('patch')`` Verifique si la solicitud actual es un PATCH.
* ``is('post')`` Verifique si la solicitud actual es una POST.
* ``is('delete')`` Verifique si la solicitud actual es DELETE.
* ``is('head')`` Verifique si la solicitud actual es HEAD.
* ``is('options')`` Verifique si la solicitud actual es OPTIONS.
* ``is('ajax')`` Verifique si la solicitud actual vino con X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Compruebe si la solicitud se realiza a través de SSL.
* ``is('flash')`` Verifique si la solicitud tiene un User-Agent de Flash.
* ``is('json')`` Verifique si la solicitud tiene la extensión 'json' y acepte el tipo mime 'application/json'.
* ``is('xml')`` Verifique si la solicitud tiene la extensión 'xml' y acepte el tipo mime 'application/xml' o 'text/xml'.

``ServerRequest`` También incluye métodos como :php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` y :php:meth:`Cake\\Http\\ServerRequest::host()` para simplificar las
aplicaciones que utilizan subdominios.

Datos de sesión
---------------

Para acceder a la sesión para una solicitud determinada utilice el método ``getSession()`` o utilice el atributo
``session``::

    $session = $this->request->getSession();
    $session = $this->request->getAttribute('session');

    $data = $session->read('sessionKey');

Para obtener más información, consulte la documentación :doc:`/development/sessions` sobre cómo utilizar el objeto de
sesión.

Host y nombre de dominio
------------------------

.. php:method:: domain($tldLength = 1)

Devuelve el nombre de dominio en el que se ejecuta su aplicación::

    // Muestra 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Devuelve los subdominios en los que se ejecuta su aplicación como una matriz::

    // Regresa ['my', 'dev'] de 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Devuelve el host en el que se encuentra su aplicación::

    // Muestra 'my.dev.example.org'
    echo $request->host();

Leyendo el método HTTP
----------------------

.. php:method:: getMethod()

Devuelve el método HTTP con el que se realizó la solicitud::

    // Salida POST
    echo $request->getMethod();

Restringir qué método HTTP acepta una acción
--------------------------------------------

.. php:method:: allowMethod($methods)

Establecer métodos HTTP permitidos. Si no coincide, arrojará ``MethodNotAllowedException``. La respuesta 405 incluirá el
encabezado ``Allow`` requerido con los métodos pasados::

    public function delete()
    {
        // Solo acepte solicitudes POST y DELETE
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Lectura de encabezados HTTP
---------------------------

Le permite acceder a cualquiera de los encabezados ``HTTP_*`` que se utilizaron para la solicitud. Por ejemplo::

    // Obtener el encabezado como una cadena
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Obtenga una matriz de todos los valores.
    $acceptHeader = $this->request->getHeader('Accept');

    // Comprobar si existe un encabezado
    $hasAcceptHeader = $this->request->hasHeader('Accept');

Si bien algunas instalaciones de Apache no hacen que el encabezado ``Authorization`` sea accesible, CakePHP lo hará
disponible a través de métodos específicos de Apache según sea necesario.

.. php:method:: referer($local = true)

Devuelve la dirección de referencia de la solicitud.

.. php:method:: clientIp()

Devuelve la dirección IP del visitante actual.

Confiar en los encabezados de proxy
-----------------------------------

Si su aplicación está detrás de un balanceador de carga o se ejecuta en un servicio en la nube, a menudo obtendrá el
host, el puerto y el esquema del balanceador de carga en sus solicitudes. A menudo, los balanceadores de carga también
enviarán encabezados ``HTTP-X-Forwarded-*`` con los valores originales. CakePHP no utilizará los encabezados reenviados
de fábrica. Para que el objeto de solicitud utilice estos encabezados, establezca la propiedad ``trustProxy`` en ``true``::

    $this->request->trustProxy = true;

    // Estos métodos ahora utilizarán los encabezados proxy.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Una vez que se confía en los servidores proxy, el método ``clientIp()`` utilizará la *última* dirección IP en el
encabezado ``X-Forwarded-For``. Si su aplicación está detrás de varios servidores proxy, puede usar
``setTrustedProxies()`` para definir las direcciones IP de los servidores proxy bajo su control::

    $request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);

Después de que los servidores proxy sean confiables, ``clientIp()`` usará la primera dirección IP en el encabezado
``X-Forwarded-For`` siempre que sea el único valor que no provenga de un proxy confiable.

Comprobando encabezados aceptados
---------------------------------

.. php:method:: accepts($type = null)

Descubra qué tipos de contenido acepta el cliente o compruebe si acepta un tipo de contenido en particular.

Consigue todos los tipos::

    $accepts = $this->request->accepts();

Consulta por un solo tipo::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Obtenga todos los idiomas aceptados por el cliente o verifique si se acepta un idioma específico.

Obtenga la lista de idiomas aceptados::

    $acceptsLanguages = $this->request->acceptLanguage();

Compruebe si se acepta un idioma específico::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. _request-cookies:

Leyendo Cookies
---------------

Las cookies de solicitud se pueden leer a través de varios métodos:

    // Obtenga el valor de la cookie, o nulo si falta la cookie.
    $rememberMe = $this->request->getCookie('remember_me');

    // Lea el valor u obtenga el valor predeterminado de 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Obtener todas las cookies como hash
    $cookies = $this->request->getCookieParams();

    // Obtener una instancia de CookieCollection
    $cookies = $this->request->getCookieCollection()

Consulte la documentación :php:class:`Cake\\Http\\Cookie\\CookieCollection` para saber cómo trabajar con la recopilación
de cookies.

Archivos cargados
-----------------

Las solicitudes exponen los datos del archivo cargado en ``getData()`` o ``getUploadedFiles()`` como objetos
``UploadedFileInterface``::

    // Obtener una lista de objetos UploadedFile
    $files = $request->getUploadedFiles();

    // Lea los datos del archivo.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Mover el archivo
    $files[0]->moveTo($targetPath);

Manipulación de URI
-------------------

Las solicitudes contienen un objeto URI, que contiene métodos para interactuar con el URI solicitado::

    // Obtener la URI
    $uri = $request->getUri();

    // Leer datos de la URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();


.. index:: $this->response

Respueta (Response)
===================

.. php:class:: Response

:php:class:`Cake\\Http\\Response` es la clase de respuesta predeterminada en CakePHP. Encapsula una serie de
características y funcionalidades para generar respuestas HTTP en su aplicación. También ayuda en las pruebas, ya que se
puede simular o eliminar, lo que le permite inspeccionar los encabezados que se enviarán.

``Response`` proporciona una interfaz para envolver las tareas comunes relacionadas con la respuesta, como por ejemplo:

* Envío de encabezados para redireccionamientos.
* Envío de encabezados de tipo de contenido.
* Envío de cualquier encabezado.
* Envío del cuerpo de la respuesta.

Tratar con tipos de contenido
-----------------------------

.. php:method:: withType($contentType = null)

Puede controlar el tipo de contenido de las respuestas de su aplicación con :php:meth:`Cake\\Http\\Response::withType()`.
Si su aplicación necesita manejar tipos de contenido que no están integrados en Response, también puede asignarlos con
``setTypeMap()``::

    // Agregar un tipo de vCard
    $this->response->setTypeMap('vcf', ['text/v-card']);

    // Establezca el tipo de contenido de respuesta en vcard
    $this->response = $this->response->withType('vcf');

Por lo general, querrás asignar tipos de contenido adicionales en la devolución de llamada de tu controlador
:php:meth:`~Controller::beforeFilter()`, para poder aprovechar las funciones de cambio automático de vista de
:php:class:`RequestHandlerComponent` si lo están usando.

.. _cake-response-file:

Enviando arhivos
----------------

.. php:method:: withFile(string $path, array $options = [])

Hay ocasiones en las que desea enviar archivos como respuesta a sus solicitudes. Puedes lograrlo usando
:php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Devuelve la respuesta para evitar que el controlador intente representar una vista.
        return $response;
    }

Como se muestra en el ejemplo anterior, debe pasar la ruta del archivo al método. CakePHP enviará un encabezado de tipo
de contenido adecuado si es un tipo de archivo conocido que figura en `Cake\\Http\\Response::$_mimeTypes`. Puede agregar
nuevos tipos antes de llamar a :php:meth:`Cake\\Http\\Response::withFile()` usando el método
:php:meth:`Cake\\Http\\Response::withType()` .

Si lo desea, también puede forzar la descarga de un archivo en lugar de mostrarlo en el navegador especificando las
opciones::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

Las opciones admitidas son:

name
    El nombre le permite especificar un nombre de archivo alternativo para enviarlo al usuario.
download
    Un valor booleano que indica si los encabezados deben configurarse para forzar la descarga.

Enviar una cadena como archivo
------------------------------

Puedes responder con un archivo que no existe en el disco, como un pdf o un ics generado sobre la marcha a partir de una
cadena::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;

        // Inyectar contenido de cadena en el cuerpo de la respuesta
        $response = $response->withStringBody($icsString);

        $response = $response->withType('ics');

        // Opcionalmente forzar la descarga de archivos
        $response = $response->withDownload('filename_for_download.ics');

        // Devuelve un objeto de respuesta para evitar que el controlador intente representar una vista.
        return $response;
    }

Configuración de encabezados
----------------------------

.. php:method:: withHeader($header, $value)

La configuración de los encabezados se realiza con el método :php:meth:`Cake\\Http\\Response::withHeader()`. Como todos
los métodos de la interfaz PSR-7, este método devuelve una instancia *nueva* con el nuevo encabezado::

    // Agregar/reemplazar un encabezado
    $response = $response->withHeader('X-Extra', 'My header');

    // Establecer múltiples encabezados
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Agregar un valor a un encabezado existente
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

Los encabezados no se envían cuando se configuran. En cambio, se retienen hasta que ``Cake\Http\Server`` emite la
respuesta.

Ahora puede utilizar el método conveniente :php:meth:`Cake\\Http\\Response::withLocation()` para configurar u obtener
directamente el encabezado de ubicación de redireccionamiento.

Configurando el cuerpo
----------------------

.. php:method:: withStringBody($string)

Para establecer una cadena como cuerpo de respuesta, haga lo siguiente:

    // Coloca una cadena en el cuerpo.
    $response = $response->withStringBody('My Body');

    // Si quieres una respuesta json
    $response = $response->withType('application/json')->withStringBody(json_encode(['Foo' => 'bar']));

.. php:method:: withBody($body)

Para configurar el cuerpo de la respuesta, use el método ``withBody()``, que es proporcionado por
:php:class:`Laminas\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

Asegúrese de que ``$stream`` sea un objeto :php:class:`Psr\\Http\\Message\\StreamInterface`. Vea a continuación cómo
crear un nuevo stream.

También puedes transmitir respuestas desde archivos usando :php:class:`Laminas\\Diactoros\\Stream` streams::

    // Para transmitir desde un archivo
    use Laminas\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

También puedes transmitir respuestas desde una devolución de llamada usando ``CallbackStream``. Esto es útil cuando tiene
recursos como imágenes, archivos CSV o PDF que necesita transmitir al cliente::

    // Transmisión desde una devolución de llamada
    use Cake\Http\CallbackStream;

    // Crea una imagen.
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

Configuración del juego de caracteres
-------------------------------------

.. php:method:: withCharset($charset)

Establece el juego de caracteres que se utilizará en la respuesta::

    $this->response = $this->response->withCharset('UTF-8');

Interactuar con el almacenamiento en caché del navegador
--------------------------------------------------------

.. php:method:: withDisabledCache()

A veces es necesario obligar a los navegadores a no almacenar en caché los resultados de una acción del controlador.
:php:meth:`Cake\\Http\\Response::withDisabledCache()` está destinado precisamente a eso::

    public function index()
    {
        // Deshabilitar el almacenamiento en caché
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Deshabilitar el almacenamiento en caché de dominios SSL al intentar enviar archivos a Internet Explorer puede
    generar errores.

.. php:method:: withCache($since, $time = '+1 day')

También puede decirles a los clientes que desea que almacenen en caché las respuestas. Usando
:php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Habilitar el almacenamiento en caché
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

Lo anterior les indicaría a los clientes que guarden en caché la respuesta resultante durante 5 días, con la esperanza
de acelerar la experiencia de sus visitantes. El método ``withCache()`` establece el valor ``Última modificación`` en el
primer argumento. El encabezado ``Expires`` y la directiva ``max-age`` se establecen en función del segundo parámetro.
La directiva "pública" de Cache-Control también está configurada.

.. _cake-response-caching:

Ajuste fino de la caché HTTP
----------------------------

Una de las mejores y más sencillas formas de acelerar su aplicación es utilizar la caché HTTP. Según este modelo de
almacenamiento en caché, solo debe ayudar a los clientes a decidir si deben usar una copia en caché de la respuesta
configurando algunos encabezados, como la hora de modificación y la etiqueta de entidad de respuesta.

En lugar de obligarlo a codificar la lógica para el almacenamiento en caché y para invalidarla (actualizarla) una vez que
los datos han cambiado, HTTP utiliza dos modelos, caducidad y validación, que generalmente son mucho más simples de usar.

Además de usar :php:meth:`Cake\\Http\\Response::withCache()`, también puedes usar muchos otros métodos para ajustar los
encabezados de caché HTTP para aprovechar el almacenamiento en caché del navegador o del proxy inverso.

El encabezado de control de caché
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Utilizado bajo el modelo de vencimiento, este encabezado contiene múltiples indicadores que pueden cambiar la forma en
que los navegadores o servidores proxy usan el contenido almacenado en caché. Un encabezado ``Cache-Control`` puede
verse así::

    Cache-Control: private, max-age=3600, must-revalidate

La clase ``Response`` le ayuda a configurar este encabezado con algunos métodos de utilidad que producirán un encabezado
``Cache-Control`` final válido. El primero es el método ``withSharable()``, que indica si una respuesta debe considerarse
compartible entre diferentes usuarios o clientes. Este método en realidad controla la parte "pública" o "privada" de este
encabezado. Establecer una respuesta como privada indica que toda o parte de ella está destinada a un solo usuario. Para
aprovechar las cachés compartidas, la directiva de control debe configurarse como pública.

El segundo parámetro de este método se utiliza para especificar una ``max-age`` para el caché, que es el número de
segundos después de los cuales la respuesta ya no se considera nueva::

    public function view()
    {
        // ...
        // Configure Cache-Control como público durante 3600 segundos
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Configure Cache-Control como privado durante 3600 segundos
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` expone métodos separados para configurar cada una de las directivas en el encabezado ``Cache-Control``.

El encabezado de vencimiento
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

Puede configurar el encabezado ``Expires`` en una fecha y hora después de la cual la respuesta ya no se considera nueva.
Este encabezado se puede configurar usando el método ``withExpires()``::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

Este método también acepta una instancia :php:class:`DateTime` o cualquier cadena que pueda ser analizada por la clase
:php:class:`DateTime`.

El encabezado de la etiqueta electrónica
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

La validación de caché en HTTP se usa a menudo cuando el contenido cambia constantemente y le pide a la aplicación que
solo genere el contenido de la respuesta si el caché ya no está actualizado. Bajo este modelo, el cliente continúa
almacenando páginas en el caché, pero pregunta a la aplicación cada vez si el recurso ha cambiado, en lugar de usarlo
directamente. Esto se usa comúnmente con recursos estáticos como imágenes y otros activos.

El método ``withEtag()`` (llamado etiqueta de entidad) es una cadena que identifica de forma única el recurso solicitado,
como lo hace una suma de comprobación para un archivo, para determinar si coincide con un recurso almacenado en caché.

Para aprovechar este encabezado, debe llamar al método ``isNotModified()`` manualmente o incluir
:doc:`/controllers/components/check-http-cache` en su controlador::

    public function index()
    {
        $articles = $this->Articles->find('all')->all();

        // Suma de comprobación simple del contenido del artículo.
        // Debería utilizar una implementación más eficiente en una aplicación del mundo real.
        $checksum = md5(json_encode($articles));

        $response = $this->response->withEtag($checksum);
        if ($response->isNotModified($this->request)) {
            return $response;
        }

        $this->response = $response;
        // ...
    }

.. note::

    La mayoría de los usuarios de proxy probablemente deberían considerar usar el encabezado de última modificación en
    lugar de Etags por razones de rendimiento y compatibilidad.

El último encabezado modificado
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

Además, bajo el modelo de validación de caché HTTP, puede configurar el encabezado ``Last-Modified`` para indicar la
fecha y hora en la que se modificó el recurso por última vez. Configurar este encabezado ayuda a CakePHP a decirle a los
clientes de almacenamiento en caché si la respuesta se modificó o no según su caché.

Para aprovechar este encabezado, debe llamar al método ``isNotModified()`` manualmente o incluir
:doc:`/controllers/components/check-http-cache` en su controlador::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->isNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

El encabezado variable
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withVary($header)

En algunos casos, es posible que desee publicar contenido diferente utilizando la misma URL. Este suele ser el caso si
tiene una página multilingüe o responde con HTML diferente según el navegador. En tales circunstancias, puede utilizar
el encabezado ``Vary``::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Envío de respuestas no modificadas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: isNotModified(Request $request)

Compara los encabezados de la caché del objeto de solicitud con el encabezado de la caché de la respuesta y determina
sitodavía se puede considerar nuevo. Si es así, elimina el contenido de la respuesta y envía el encabezado
`304 Not Modified`::

    // En una acción del controlador.
    if ($this->response->isNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Configuración de cookies
------------------------

Las cookies se pueden agregar a la respuesta usando una matriz o un objeto :php:class:`Cake\\Http\\Cookie\\Cookie`::

    use Cake\Http\Cookie\Cookie;
    use DateTime;

    // Agregar una cookie
    $this->response = $this->response->withCookie(Cookie::create(
        'remember_me',
        'yes',
        // Todas las claves son opcionales.
        [
            'expires' => new DateTime('+1 year'),
            'path' => '',
            'domain' => '',
            'secure' => false,
            'httponly' => false,
            'samesite' => null // O una de las constantes CookieInterface::SAMESITE_*
        ]
    ));

Consulte la sección :ref:`creating-cookies` para saber cómo utilizar el objeto cookie. Puede utilizar
``withExpiredCookie()`` para enviar una cookie caducada en la respuesta. Esto hará que el navegador elimine su cookie
local::

    $this->response = $this->response->withExpiredCookie(new Cookie('remember_me'));

.. _cors-headers:

Configuración de encabezados de solicitud de origen cruzado (CORS)
==================================================================

El método ``cors()`` se utiliza para definir `Control de acceso HTTP
<https://developer.mozilla.org/es/docs/Web/HTTP/CORS>`__ encabezados relacionados con una interfaz fluida::

    $this->response = $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

Los encabezados relacionados con CORS solo se aplicarán a la respuesta si se cumplen los siguientes criterios:

#. The request has an ``Origin`` header.
#. The request's ``Origin`` value matches one of the allowed Origin values.

.. tip::

    CakePHP no tiene middleware CORS incorporado porque manejar solicitudes CORS es muy específico de la aplicación.
    Le recomendamos que cree su propio ``CORSMiddleware`` si lo necesita y ajuste el objeto de respuesta como desee.

Errores comunes con respuestas inmutables
=========================================

Los objetos de respuesta ofrecen varios métodos que tratan las respuestas como objetos inmutables. Los objetos inmutables
ayudan a prevenir efectos secundarios accidentales difíciles de rastrear y reducen los errores causados por llamadas a
métodos causadas por la refactorización que cambia el orden. Si bien ofrecen una serie de beneficios, es posible que sea
necesario algo de tiempo para acostumbrarse a los objetos inmutables. Cualquier método que comience con ``with`` opera
en la respuesta de forma inmutable y **siempre** devolverá una **nueva** instancia. Olvidar conservar la instancia
modificada es el error más frecuente que cometen las personas cuando trabajan con objetos inmutables:

    $this->response->withHeader('X-CakePHP', 'yes!');

En el código anterior, a la respuesta le faltará el encabezado ``X-CakePHP``, ya que el valor de retorno del método
``withHeader()`` no se retuvo. Para corregir el código anterior escribirías::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

Colección de Cookies
=====================

.. php:class:: CookieCollection

Se puede acceder a los objetos ``CookieCollection`` desde los objetos de solicitud y respuesta. Le permiten interactuar
con grupos de cookies utilizando patrones inmutables, que permiten preservar la inmutabilidad de la solicitud y la
respuesta.

.. _creating-cookies:

Creando cookies
---------------

.. php:class:: Cookie

Los objetos ``Cookie`` se pueden definir a través de objetos constructores o utilizando la interfaz fluida que sigue
patrones inmutables::

    use Cake\Http\Cookie\Cookie;

    // Todos los argumentos en el constructor.
    $cookie = new Cookie(
        'remember_me', // nombre
        1, // valor
        new DateTime('+1 year'), // tiempo de vencimiento, si corresponde
        '/', // ruta, si corresponde
        'example.com', // dominio, si corresponde
        false, // ¿Solo seguro?
        true // ¿Solo http?
    );

    // Usando los métodos constructores
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Una vez que haya creado una cookie, puede agregarla a una ``CookieCollection`` nueva o existente::

    use Cake\Http\Cookie\CookieCollection;

    // Crear una nueva colección
    $cookies = new CookieCollection([$cookie]);

    // Agregar a una colección existente
    $cookies = $cookies->add($cookie);

    // Eliminar una cookie por nombre
    $cookies = $cookies->remove('remember_me');

.. note::
    Recuerde que las colecciones son inmutables y agregar o eliminar cookies de una colección crea un *nuevo* objeto
    de colección.

Se pueden agregar objetos cookie a las respuestas::

    // Agregar una cookie
    $response = $this->response->withCookie($cookie);

    // Reemplazar toda la colección de cookies
    $response = $this->response->withCookieCollection($cookies);

Las cookies configuradas para las respuestas se pueden cifrar utilizando :ref:`encrypted-cookie-middleware`.

Leyendo Cookies
---------------

Una vez que tenga una instancia ``CookieCollection``, podrá acceder a las cookies que contiene::

    // Comprobar si existe una cookie
    $cookies->has('remember_me');

    // Obtener el número de cookies de la colección.
    count($cookies);

    // Obtener una instancia de cookie. Lanzará un error si no se encuentra la cookie.
    $cookie = $cookies->get('remember_me');

    // Obtener una cookie o nulo
    $cookie = $cookies->remember_me;

    // Comprobar si existe una cookie
    $exists = isset($cookies->remember_me)

Una vez que tenga un objeto ``Cookie``, puede interactuar con su estado y modificarlo. Tenga en cuenta que las cookies
son inmutables, por lo que deberá actualizar la colección si modifica una cookie::

    // Obtener el valor
    $value = $cookie->getValue()

    // Acceder a datos dentro de un valor JSON
    $id = $cookie->read('User.id');

    // Comprobar estado
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. meta::
    :title lang=es: Objetos Request y Response
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,parameters,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
