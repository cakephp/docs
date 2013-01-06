Configuración
#############

Configurar aplicaciones CakePHP es pan comido. Despues de instalar
CakePHP, crear una aplicación web básica solo requiere aplicar la
configuración de una base de datos. Existen, otras configuraciones
opcionales, que puedes realizar con el objetivo de aprovechar las
ventajas de la arquitectura flexible de CakePHP. Tu puedes agregar
facilmente elementos al núcleo de CakePHP, configurar URL personalizadas
y definir inflexiones.

Configuración de Base de Datos
==============================

CakePHP espera que los detalles de configuración de la base de datos
estén en app/config/database.php. Un ejemplo de configuración puede
encontrarse en el archivo app/config/database.php.default. Esta
configuración debería verse como sigue:

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'mi_proyecto',
                         'prefix'      => '');

El arreglo de configuración $default es el utilizado a menos que se
especifique algún otro en la propiedad $usDbConfig de los modelos. Por
ejemplo, si mi aplicación tiene aplicaciones legadas adicionales a la
que se va a utilizar por defecto, podría utilizarla en mis modelos
creando un nuevo arreglo de configuración $legada que sea similar a
$default, y asignado var $useDbConfig = 'legada'; en los modelos
correspondientes.

Rellena cada par clave/valor en el arreglo de configuración, como mejor
se ajuste a tus necesidades

+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Clave               | Valor                                                                                                                                                                 |
+=====================+=======================================================================================================================================================================+
| driver              | El nombre del controlador de base de datos que se desea utilizar. Ejemplo: mysql, postgres, sqlite, pear-nombrededriver, adodb-nombrededriver, mssql, oracle, odbc.   |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| persistent          | Si se debe usar o no una conexión persistente a la base de datos.                                                                                                     |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| host                | El nombre de servidor de la base de datos (o dirección IP).                                                                                                           |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| login               | El nombre de usuario para la cuenta.                                                                                                                                  |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| password            | La contraseña para la cuenta.                                                                                                                                         |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| database            | Nombre de la base de datos a usar para la conexión                                                                                                                    |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefix (opcional)   | El texto que prefija cada nombre de tabla en la base de datos. Útil si se comparte la base de datos con varias aplicaciones. Dejar vacío si no se desea ninguno.      |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| port (opcional)     | El puerto TCP o socket Unix a usarse para la conexión con el servidor de base de datos.                                                                               |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| encoding            | Indica la codificación de caracteres a usar para enviar las sentencias SQL al servidor.                                                                               |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| schema              | Usado en la configuración de PostgreSQL para especificar el esquema a utilizar.                                                                                       |
+---------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Nota que los prefijos son para las tablas, **no** para los modelos. Por
ejemplo, si creaste una tabla join para tus modelos Torta y Sabor, esta
debe llamarse prefijo\_sabor\_torta (**no**
prefijo\_sabor\_prefijo\_torta), y asignar la clave prefix con
‘prefijo\_’.

A este punto, pudieras querer echar un vistazo a las `Convenciones de
CakePHP </es/view/22/cakephp-conventions>`_, enunciadas en el apéndice
de este manual. Nombrar correctamente tus tablas (y algunas columnas)
según las convenciones puede librarte de mucho trabajo de configuración.
Por ejemplo, si nombras una tabla como tortas, el modelo Torta y el
controller TortasController, todo funcionará automáticamente si
necesidad de tu intervención. Por convención, utiliza guiones bajos,
minúsculas, y nombres en plural para los nombres de tus tablas - por
ejemplo: reposteros, reposterias, sabores.

Configuración del Core
======================

La configuración de la aplicación en CakePHP se encuentra en
/app/config/core.php. Este archivo es una colección de definiciones de
variables Configure y definiciones de constantes que determinan como ha
de comportarse la aplicación. Antes de sumergirse en cada una de estas
directivas, necesitarás familiarizarte con Configure, la clase de
registro de configuraciones de CakePHP

La Clase de Configuración
=========================

A pesar de que muy pocas cosas necesitan configuración en CakePHP, a
veces es útil tener tus propias reglas de configuración para tu
aplicación. En el pasado seguramente habrías definido alguno de estos
valores creando constantes en varios archivos. Hacerlo de esa manera te
obligaría a incluir estos archivos cada vez que desees utilizarlos

La nueva clase Configure de CakePHP puede ser utilizada para guardar y
recuperar valores específicos de la aplicación o de tiempo de ejecución.
Se cuidadoso, esta clase permite almacenar cualquier cosa en ella, para
luego usarla en cualquier lugar de tu código: una tentación segura para
romper el patrón MVC con el cual fue diseñado CakePHP. El objetivo
principal de la clase Configure es mantener centralizadas las variables
que pueden ser compartidas entre varios objetos. Recuerda tratar de
mantener la filosofía de "convención sobre configuración" y así no
terminarás rompiendo la estructura MVC que se ha diseñado

Esta clase actúa como un singletón, y sus métodos pueden ser llamados
desde cualquier lugar en tu aplicación, en un contexto estático

::

    <?php Configure::read('debug'); ?>

Métodos de la Clase Configure
-----------------------------

write
~~~~~

::

    write(string $clave, mixed $valor)

Utiliza write() para almacenar datos en la configuración de la
aplicación

::

    Configure::write('Empresa.nombre','Pizza, Inc.');
    Configure::write('Empresa.lema','Pizza para tu cuerpo y alma');

Nota el uso de la notación punto en el parámetro $clave. Puedes utilizar
esta notación para organizar tus configuraciones dentro de grupos
lógicos

El ejemplo anterior pudo ser escrito en una sola llamada:

::

    Configure::write(
        'Empresa',array('nombre'=>'Pizza, Inc.','lema'=>'Pizza para tu cuerpo y alma')
    );

Puedes utilizar Configure::write(‘debug’, $int) para cambiar entre
desarrollo y producción dentro de la ejecución de tu programa. Esto es
especialmente útil para interacciones AMF o SOAP donde la información de
depuración puede ocasionar problema de parseo.

read
~~~~

``read(string $clave = 'debug')``

Se usa para leer datos de configuración de la aplicación. Por defecto
devuelve el importante valor de "debug" (nivel de depuración). Si se
especifica una clave, los datos correspondientes son devueltos. Usando
nuestros anteriores ejemplos de ``write()``, podemos leer esos datos de
vuelta:

::

    Configure::read('Empresa.nombre');    //devuelve: 'Pizza, Inc.'
    Configure::read('Empresa.lema');      //devuelve: 'Pizza para tu cuerpo y alma'
     
    Configure::read('Empresa');
     
    //devuelve: 
    array('nombre' => 'Pizza, Inc.', 'lema' => 'Pizza para tu cuerpo y alma');

delete
~~~~~~

``delete(string $clave)``

Se usa para borrar información de configuración de la aplicación.

::

    Configure::delete('Empresa.nombre');

load
~~~~

::

    load(string $path)

Usa este método para cargar información de configuración desde una
archivo específico.

::

    // /app/config/mensajes.php:
    <?php
    $config['Empresa']['nombre'] = 'Pizza, Inc.';
    $config['Empresa']['lema'] = 'Pizza para tu cuerpo y alma';
    $config['Empresa']['telefono'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('mensajes');
    Configure::read('Empresa.nombre');
    ?>

Cada clave-valor de la configuración está representado en el archivo con
la variable $config. Cualquier otra variable que aparezca en el archivo
será ignorada por la función load().

version
~~~~~~~

``version()``

Devuelve la versión de CakePHP de la aplicación actual.

Variables de Configuración Principales de CakePHP
-------------------------------------------------

La clase Configure se usa para manejar un conjunto de variables de
configuración de CakePHP. Estas variables pueden ser encontradas en
app/config/core.php. Abajo se encuentra una descripción de cada variable
y cómo afecta tu aplicación CakePHP

+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Variable de Configuración     | Descripción                                                                                                                                                                         |
+===============================+=====================================================================================================================================================================================+
| debug                         | Cambia el nivel de depuración de cake                                                                                                                                               |
|                               |  0 = Modo produción. No produce ninguna salida.                                                                                                                                     |
|                               |  1 = Muestra los error y warnings.                                                                                                                                                  |
|                               |  2 = Muestra los error, warnings, y consultas SQL                                                                                                                                   |
|                               |  3 = Muestra los error, warnings, consultas SQL, y volcado completo del Controller.                                                                                                 |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| App.baseUrl                   | Descomenta esta definición si **no** deseas utilizar el mod\_rewrite de Apache. No te olvides de eliminar los archivos .htaccess también.                                           |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Routing.admin                 | Descomenta esta definición si deseas utilizar las rutas admin de CakePHP. Asigna la variable al nombre de la ruta que te gustaría utilizar. Más adelante se explicará en detalle.   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Cache.disable                 | Cuando se asigna true, el cache se deshabilita para toda la aplicación.                                                                                                             |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Cache.check                   | Si se asigna true, habilita el cache de las vistas. También es necesario activar el cache en los controllers, pero esta variable habilita la detección de dichas configuraciones.   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.save                  | Le indica a CakePHP qué mecanismo de almacenamiento de sesiones se debe utilizar                                                                                                    |
|                               |  php = Utiliza el almacenamiento por defecto de php                                                                                                                                 |
|                               |  cake = Guarda los datos de sesión en /app/tmp                                                                                                                                      |
|                               |  database = Guarda los datos en una tabla de la base de datos. Asegúrate de cargar el archivo SQL ubicado en /app/config/sql/sessions.sql.                                          |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.table                 | El nombre de la tabla (sin incluir el prefijo) que guarda los datos de la sesión.                                                                                                   |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.database              | El nombre de la base de datos que guarda los datos de sesión.                                                                                                                       |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.cookie                | El nombre del cookie utilizado para hacer seguimiento de las sesiones.                                                                                                              |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.timeout               | El tiempo base de validez de la sesión en segundos. El valor real depende de la variable Security.level                                                                             |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.start                 | Inicia automáticamente la sesión cuando se asigna true.                                                                                                                             |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Session.checkAgent            | Cuando se asigna false, Las sesiones de CakePHP no se asegurarán de que el "user agent" del usuario no cambie entre peticiones.                                                     |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security.level                | El nivel de seguridad de CakePHP. El tiempo de validez de la sesión definido en 'Session.timeout' se multiplica de acuerdo a lo siguiente.                                          |
|                               |  Valores válidos:                                                                                                                                                                   |
|                               |  'high' = x 10                                                                                                                                                                      |
|                               |  'medium' = x 100                                                                                                                                                                   |
|                               |  'low' = x 300                                                                                                                                                                      |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Security.salt                 | Una palabra aleatoria usada en sumas de seguridad.                                                                                                                                  |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Acl.classname, Acl.database   | Variables usadas para las Listas de Control de Acceso de CakePHP. Lee el capítulo de listas de control de acceso para más información.                                              |
+-------------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

*Nota:* La configuración de Cache también puede ser encontrada en el
archivo core.php — Más adelante cubriremos este tema.

La clase Configure puede ser utilizada para leer y escribir valores
durante la ejecución del programa. Esto puede ser especialmente útil si
desea deshabilitar el nivel de deburacion ("debug") para una sección
limita de lógica en tu aplicación, por ejemplo

Constantes de Configuración
---------------------------

A pesar de que la mayoría de las opciones de configuración se manejan
con la clase Configure, existen unas pocas constantes que utiliza
CakePHP durante su ejecución.

+--------------+-------------------------------------------------------------------------------------------------------------------------------------------+
| Constante    | Descripción                                                                                                                               |
+==============+===========================================================================================================================================+
| LOG\_ERROR   | Constante de error. Usada para diferenciar entre registros de depuración y registros de error. Actualmente PHP solo soporta LOG\_DEBUG.   |
+--------------+-------------------------------------------------------------------------------------------------------------------------------------------+

La Clase App
============

Cargar clases adicionales se ha vuelto mucho más sencillo con CakePHP.
En versiones anteriores existían funciones diferentes para cargar una
clase dependiendo de su tipo. Estas funciones han sido reemplazadas,
ahora toda la carga de clases debería hacerse a través de el método
App::import(). Éste método te asegura que una clase ha sido cargada sólo
una vez, que las clases que extiende se hayan cargado apropiadamente, y
resuelve las rutas de ubicación automáticamente en la gran mayoría de
los casos

Usando App::import()
--------------------

::

    App::import($type, $name, $parent, $search, $file, $return);

A primera vista App::import parece complejo, sin embargo, en la mayoría
de los casos es suficiente con tan sólo dos parámetros.

Importando librerías del Core
-----------------------------

Las librerías del Core, como Sanitize y Xml pueden ser cargadas
mediante:

::

    App::import('Core', 'Sanitize');

Lo anterior hará que la clase Sanitize esté disponible para su uso.

Importando Controladores, Modelos, Ayudantes, Comportamientos y Componentes
---------------------------------------------------------------------------

Todas las clases relacionadas con la aplicación pueden ser importadas
con App::import(). Los siguientes ejemplos muestran cómo hacerlo:

Cargando Controladores
~~~~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MyController');``

Llamando a ``App::import`` es equivalente a ``require``. Es importante
darse cuenta que la clase posteriormente necesita ser inicializada.

::

    <?php
    // Lo mismo que require('controllers/users_controller.php');
    App::import('Controller', 'Users');

    // Necesitamos cargar la clase
    $Users = new UsersController;

    // If we want the model associations, components, etc to be loaded
    $Users->constructClasses();
    ?>

Cargando Modelos
~~~~~~~~~~~~~~~~

``App::import('Model', 'MyModel');``

Cargando Componentes [Components]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

Cargando Comportamientos [Behaviors]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Cargando Ayudantes[Helpers]
~~~~~~~~~~~~~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Cargando desde Plugins
----------------------

Cargar clases en *plugins* funciona casi igual que cargar clases
ubicadas en el Core o en la aplicación principal, a excepción de que
debe especificarse el nombre del *plugin* donde reside la clase a
cargar.

::

    App::import('Modelo', 'NombrePlugin.Comentario');

Cargando Archivos de Terceros
-----------------------------

La función vendor() ha sido reemplazada. Los archivos de terceros deben
ser cargados también mediante App::import(). La sintaxis y los
argumentos adicionales son levemente diferentes, debido a que los
archivos de terceros y su estructura pueden variar inmensamente, y no
todos los archivos de terceros contienen clases.

Los siguientes ejemplos ilustran cómo cargar archivos de terceros en
diferentes rutas y estructuras. Los archivos de terceros deben estar
ubicados en cualquiera de los directorios *vendor*.

Ejemplos de archivos de terceros
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Para cargar **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

Para cargar **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

Para cargar **vendors/cierto.nombre.php**

::

    App::import('Vendor', 'CiertoNombre', array('file' => 'cierto.nombre.php'));

Para cargar **vendors/services/well.named.php**

::

    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

Configuración de Rutas
======================

El enrutamanieto permite hacer una relación entre URLs y acciones de los
controller. Fue añadido a CakePHP para hacer más bonitos los URLs, más
configurables, y más flexibles. Usar el mod\_rewrite de Apache no es un
requisito para utilizar el enrutamiento, pero hará lucir mucho mejor tu
barra de direcciones.

Las rutas en CakePHP 1.2 han sido mejoradas y pueden llegar a ser muy
poderosas.

Enrutamiento por Defecto
------------------------

Antes de que aprendas a configurar tus propias rutas, deberías saber que
CakePHP viene configurado con un conjunto de rutas por defecto. Estas
rutas te llevarán bastante lejos en cualquier aplicación. Puedes acceder
a una acción directamente desde el URL colocando su nombre en la
petición. También puedes pasar parámetros a las acciones de tus
controladores usando el URL.

::

        Patron URL de las rutas por defecto:
        http://example.com/controlador/accion/param1/param2/param3

El URL /articulos/ver dirige a la acciónver() action del
ArticulosController, y /productos/listaCompleta dirige a la accion to
the lista\_completa() de ProductosController. Si no se especifica
ninguna acción en el URL, se asume que se trata de la acción index().

La configuración inicial de enrutamiento permite pasar parámetros a tus
acciones usando el URL. Una petición para /articulos/ver/25 sería
equivalente a llamar ver(25) en el ArticulosController, por ejemplo.

Parámetros con Nombre
---------------------

Algo novedoso en CakePHP 1.2 es la habilidad de usar parámetros con
nombre (named parameters). Puedes nombrar parámetros y enviar sus
valores usando el URL. Una petición para
/articulos/ver/titulo:primer+articulo/categoria:general resultaría en
una llmada a la accion view() de ArticulosController. En dicha acción,
puedes encontrar los valores del título y la categoría dentro de
$this->passedArgs['titulo'] and $this->passedArgs['categoria']
respectivamente.

Algunos ejemplos que resuman las rutas por defecto puede resultar útil.

::

       
    URL: /monos/saltar
    Dirige a: MonosController->saltar();
     
    URL: /productos
    Dirige a: ProductosController->index();
     
    URL: /tareas/ver/45
    Dirige a: TareasController->ver(45);
     
    URL: /donaciones/ver/recientes/2001
    Dirige a: DonacionesController->ver('recientes', '2001');

    URL: /contenidos/ver/capitulo:modelos/seccion:asociaciones
    Dirige a: ContenidosController->ver();
    $this->passedArgs['capitulo'] = 'modelos';
    $this->passedArgs['seccion'] = 'asociaciones';

Definir Rutas
=============

Definir tus propias rutas te permite definir cómo va a responder tu
aplicación cuando se solicite un URL determinado. Tus rutas deben ser
definidas en el archivo /app/config/routes.php usando el método
Router::connect().

El método connect() toma hasta tres parámetros: el patron de URL que
deseas hacer coindicir, los valores por defecto para los elementos de
enrutamient propios, y expresiones regulares que ayuden al enrutador a
hacer coincidir elementos en el URL.

El formáto básico para una definición de ruta es:

::

    Router::connect(
        'URL',
        array('nombreParam' => 'valorPorDefecto'),
        array('nombreParam' => 'expresionRegular')
    )

El primer parámetro es usado para decirle al enrutador qué tipo de URL
estás tratando de controlar. El URL es una cadena de caracteres
separadas por barras inclinadas (slash), pero también pueden contener el
un comodín comodín (\*) o elementos de enrutamiento propios (Elementos
de URL prefijados con el caracter dos puntos ":"). Usar un comodín le
indica al enrutador qué tipos de URL quieres hacer coincidir, y
especificar elementos de enrutamiento te permite recolectar parámetros
para las acciones de tus controladores

Una vez que hayas especificado un URL, debes utilizar los últimos dos
parámetros del método connect() para decirle a CakePHP que hacer con esa
petición una vez que ha sido seleccionada la regla adecuada. El segundo
parámetro es una arreglo asociativo. Las claves de este arreglo deben
ser nombradas como los elementos de enrutamiento en el URL, o los
elementos por defecto, que son, :controller, :action y :plugin. Los
valores en este arreglo son los valores por omisión para cada una de las
claves. Veamos algunos ehjemplos básicos antes de empezar a usar el
tercer parámetro de connect()

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

Esta ruta se encuentra en el archivo routes.php distribuido con CakePHP
(linea 40). Esta ruta coincide con los URL que comienzan con /pages/ y
delega a la acción display() de PagesController el manejo de la
petición. La petición /pages/productos puede sería dirigida a
PagesController->display('productos'), por ejemplo.

::

    Router::connect(
        '/mujeres',
        array('controller' => 'productos', 'action' => 'mostrar', 5)
    );

Este segundo ejemplo muestra como usar el segundo parámetro de connect()
para definir parámetros por omisión. Si construiste un sitio que muestra
productos para diferentes categorías de clientes, puedes considerar el
hacer una ruta. Esto te ayuda a crear el enlace /mujeres en lugar de
/productos/mostrar/5

Para tener flexibilidad adicional, puedes especificar elementos de
enrutamiento propios. Hacer esto te da el poder de definir lugares en el
URL donde los parámentros para las acciones deben residir. Cuando se
hace una petición, los valores para estos elementos propios se
encuentran en $this-gt;params del controlador. Estos son diferentres de
los parametros con nombre, y esta es la diferencia: los parmámetros con
nombre (/controlador/accion/nombre:valor) se encuentran en
$this->passedArgs, mientras que los elementos propios de enrutamiento se
encuentran en $this->params. Cuando defines un elemento propio de
enrutamiento, también necesitas especificar una expresión regular. Esto
le indica a CakePHP cómo reconocer si el URL está bien formado o no.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'ver'),
        array('id' => '[0-9]+')
    );

Este ejemplo sencillo muestra cómo crear una manera sencilla de ver
registros desde cualquier controlador accediendo a un URL que luce como
/mincontrolador/id. El URL suministrado a connect() especifica dos
elementos de enrutamiento, :controller e :id, El primer elemento es uno
que viene por defecto con CakePHP, así que el enrutador sabe cómo
reconocer nombres de controladores en el URL. El elemento :id es propio,
y debe ser clarificado especificando una expresión regular en el tercer
parámetro de conenct(). Esto le dice a CakePHP cómo reconocer el ID en
el URL en contraposición a cualquier otra cosa que esté allí, como el
nombre de una acción.

Una vez que hayas definido esta ruta, solicitar /manzanas/5, sería lo
mismo que solicitar /manzanas/ver/5. Ambos harán una llamada al método
ver() de ManzanasController. Dentro del método ver(), podrías acceder al
id en $this->params['id'].

unejemplo más y serás un profesional del enrutador.

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'listar', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '(0[1-9]|1[012])',
            'day' => '(0[1-9]|[12][0-9]|3[01])'
        )
    );

Puede parecer un poco enredado, pero muestra lo poderosas que pueden ser
las rutas. El URL suministrado tiene cuatro elemento. El primero ya debe
resultarte familiar: el elemento que le dice a CakePHP que se trata de
un nombre de controlador.

A continuación, vamos a especificar algunos valores por defecto. Sin
importar el controlador, queremos que la acción listar() sea llamada.
Asignamos el parámetro day (día, que es el cuarto elemento en el URL) a
null, para marcarlo como opcional.

Finalmente especificamos algunas expresiones regulares que coindidiran
con años, meses y días en su forma numérica.

Una vez definda, esta ruta coindcidirá con /articulos/2007/02/01,
/escritos/2004/11/16 y /productos/2001/05 (¿recuerdas que el parametro
day era opcional?), enviando la petición a listar() de sus respectivos
controladores, con los parámetros de fecha definidos en $this->params.

Pasando parámetros a la acción
==============================

Asumiendo que tu acción fue definida como se muestra a continuación, y
que desea acceder a los argumentos usando $articuloID en lugar de
$this->params['id'], simplemente agrega el tercer parámetro de
Router::connect().

::

    // some_controller.php
    function ver($articuloID = null, $slug = null) {
        // mi codigo aqui...
    }

    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'ver'),
        array(
            // el orden importa, puesto que esto enviará ":id" como el parámetro $articuloID de tu acción.
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    )

Y ahora, gracias a las capacidades de enrutamiento inverso, puedes usar
el arreglo de url que se muestra a continuación y Cake sabrá cómo formar
el URL tal como fue definido en las rutas.

::

    // ver.ctp
    // Esto va a devolver un lik a /blog/3-CakePHP_Rocks
    link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )) ?>

Rutas con prefijos
==================

Muchas cplicaciones requieren una zona administrativa donde los usuarios
privilegiados puedan hacer cambios. Estos es comunment hecho a través de
un URL especial como ``/admin/usuarios/editar/5``. En CakePHP, las rutas
admin pueden ser habilitadas en el archivo core.php asignando la ruta
para Routing.admin.

::

    Configure::write('Routing.admin', 'admin');

En tu controlador, cualquier acción que empiece por ``admin_`` será
llamada. Usando nuestro ejemplo de usuarios, el nombre de la acción de
nuestro ``UsuariosController`` debe ser ``admin_editar``

Puedes usar el enrutador para usar prefijos propios para usos más allá
de la administraión

::

    Router::connect('/perfiles/:controller/:action', array('prefix' => 'perfiles')); 

Cualquier llamada a la sección de perfiles buscará el prefijo
``perfiles_`` en las llamadas a métodos. Nuestro ejemplo de usuarios
tendría una estructura de URL que luciría como
``/perfiles/usuarios/editar/5``, lo cual invocaría el método
``perfiles_editar`` del ``UsuariosController``. también es importante
reordar que usar el Ayudante HTML para construir tus enlaces te ayudará
a mantener los prefijos. Este es un ejemplo de un enlace usando el
ayudante HTML

::

    echo $html->link('Editat tu perfil', array('controller' => 'usuarios', 'action' => 'perfiles_editar')); 

Puedes utilizar múltiples prefijos de ruta para crar una muy flexible
estructura de URL para tu aplicación

Enrutamiento por defecto
------------------------

Antes de que leas como configurar tus rutas, deberías saber que CakePHP
incluye algunas por defecto. El enrutamiento en CakePHP te ofrece mucho
más que cualquier otra aplicación. Puedes acceder directamente a
cualquier acción poniéndola solo en la URL. Puedes enviar también
variables a la acción a través de la URL.

::

        Patrones de enrutamiento por defecto: 
        http://example.com/controller/action/param1/param2/param3

La URL /posts/view enruta hacia la accion view() del controlador
PostsController y /products/viewClearance enruta hacia la accion
view\_clearance() del controlador ProductsController. Si la acción no
esta definida en la URL, el método index() es asumido por defecto.

El enrutamiento por defecto te permite enviar parámetros a la acción a
través de la URL. Una petición hacia /posts/view/25 sería equivalente a
llamar a la acción view(25) en el controlador PostsController.

Parámetros con nombre
---------------------

Una nueva característica en CakePHP 1.2 es la posibilidad de setear
nombres de parámetros y su valor por la URL. Una petición a
/posts/view/title:first+post/category:general resultaría en una llamada
a la acción view() del controlador PostsController. En esta acción,
podrás encontrar los valores para title y category dentro de
$this->passedArgs['title'] y $this->passedArgs['category']
respectivamente.

Algunos ejemplos que pueden ser de utilidad.

::

    Acceder a la acción jump() del controlador MonkeysController desde la URL:  
        
    URL: /monkeys/jump
    Enrutado: MonkeysController->jump();
     
    URL: /products
    Enrutado: ProductsController->index();
     
    URL: /tasks/view/45
    Enrutado: TasksController->view(45);
     
    URL: /donations/view/recent/2001
    Enrutado: DonationsController->view('recent', '2001');

    URL: /contents/view/chapter:models/section:associations
    Enrutado: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';

Defining Routes
---------------

Defining your own routes allows you to define how your application will
respond to a given URL. Define your own routes in the
/app/config/routes.php file using the ``Router::connect()`` method.

The ``connect()`` method takes up to three parameters: the URL you wish
to match, the default values for your route elements, and regular
expression rules to help the router match elements in the URL.

The basic format for a route definition is:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

The first parameter is used to tell the router what sort of URL you're
trying to control. The URL is a normal slash delimited string, but can
also contain a wildcard (\*) or route elements (variable names prefixed
with a colon). Using a wildcard tells the router what sorts of URLs you
want to match, and specifying route elements allows you to gather
parameters for your controller actions.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has been
matched. The second parameter is an associative array. The keys of the
array should be named after the route elements in the URL, or the
default elements: :controller, :action, and :plugin. The values in the
array are the default values for those keys. Let's look at some basic
examples before we start using the third parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and hands it
to the ``display()`` method of the ``PagesController();`` The request
/pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site that
features products for different categories of customers, you might
consider creating a route. This allows you link to /government rather
than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of that:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/ should be
sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as a url
will output /cooks/someAction/5 if the above route is the first match
found

If you are planning to use custom named arguments with your route, you
have to make the router aware of it using the ``Router::connectNamed``
function. So if you want the above route to match urls like
``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

You can specify your own route elements, doing so gives you the power to
define places in the URL where parameters for controller actions should
lie. When a request is made, the values for these route elements are
found in $this->params of the controller. This is different than named
parameters are handled, so note the difference: named parameters
(/controller/action/name:value) are found in $this->passedArgs, whereas
custom route element data is found in $this->params. When you define a
custom route element, you also need to specify a regular expression -
this tells CakePHP how to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view models
from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two route
elements: :controller and :id. The :controller element is a CakePHP
default route element, so the router knows how to match and identify
controller names in URLs. The :id element is a custom route element, and
must be further clarified by specifying a matching regular expression in
the third parameter of connect(). This tells CakePHP how to recognize
the ID in the URL as opposed to something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same as
requesting /apples/view/5. Both would call the view() method of the
ApplesController. Inside the view() method, you would need to access the
passed ID at ``$this->params['id']``.

One more example, and you'll be a routing pro.

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is familiar
to us: it's a default route element that tells CakePHP to expect a
controller name.

Next, we specify some default values. Regardless of the controller, we
want the index() action to be called. We set the day parameter (the
fourth element in the URL) to null to flag it as being optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping) are
not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (as defined, the day parameter
is optional as it has a default), handing the requests to the index()
actions of their respective controllers, with the date parameters in
$this->params.

Pasando parámetros a las acciones
---------------------------------

Asumiendo que tu action fue definida así y quieres acceder los
argumentos usando ``$articleID`` en vez de ``$this->params['id']``, tan
solo agrega un array extra en el 3er parámetro de ``Router::connect()``.

::

    // some_controller.php
    function view($articleID = null, $slug = null) {
        // some code here...
    }

    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'view'),
        array(
         // el orden es importante ya que esto va a mapear ":id" con $articleID en tu action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

Y ahora, gracias a la capacidad de enrutamiento inverso podrás pasar la
url como se muestra abajo y Cake sabrá como formar la URL como se
definió en los routers.

::

    // view.ctp
    // esto devolverá un link a /blog/3-CakePHP_Rocks
    <?php echo $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )); ?>

Prefix Routing
--------------

Muchas aplicaciones necesitan una sección administrativa donde los
usuarios con privilegios puedan hacer cambios. Con frecuencia, esto se
hace con una URL especial como /admin/users/edit/5. En CakePHP, el admin
routing puede activarse dentro del archivo de configuración del core
ajustando la ruta de administración para Routing.admin.

::

    Configure::write('Routing.admin', 'admin');

En tu controlador, será llamada cualquier acción con un prefijo
``admin_``. Recurriendo a nuestro ejemplo de usuarios, acceder a la URL
/admin/users/edit/5 debería llamar al método ``admin_edit`` de nuestro
``UsersController`` pasando 5 como primer parámetro.

Puedes mapear la URL /admin a tu acción ``admin_index`` del pages
controller usando la ruta

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

Puedes configurar el Router usado múltiples prefijos:

::

    Router::connect('/profiles/:controller/:action/*', array('prefix' => 'profiles', 'profiles' => true)); 

Cualquier llamada a la sección Profiles buscaría el prefijo
``profiles_`` en las llamadas a los métodos. Nuestro ejemplo tendría una
URL como /profiles/users/edit/5 que llamaría al método ``profiles_edit``
en el ``UsersController``. Es también importante recordar que usar el
HTML helper para construir tus enlaces, te ayudará a mantener las
llamadas a los prefijos. He aquí cómo construir este enlace usando el
HTML helper:

::

    echo $html->link('Edit your profile', array('profiles' => true, 'controller' => 'users', 'action' => 'edit', 'id' => 5)); 

Puedes ajustar múltiples rutas con prefijos usando esta metodología para
crear una estructura de URL flexible para tu aplicación.

Rutas y plugins
---------------

Las rutas a Plugins utilizan la clave **plugin**. Puedes crear enlaces
que apunten a un plugin siempre que añadas la clave plugin al array de
la url.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Por el contrario, si la petición activa es un plugin y quieres crear un
enlace que no tiene plugin, puedes hacerlo como sigue.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

Al poner ``plugin => null`` le estás diciendo al Router que quieres
crear un enlace que no forma parte de un plugin.

Extensiones de archivo
----------------------

Para manejar diferentes extensiones de archivo con tus rutas, necesitas
una línea extra en el archivo de configuración de rutas:

::

    Router::parseExtensions('html', 'rss');

Esto le dirá al router que retire las extensiones de archivo
coincidentes y que procese entonces el resto..

Si quieres crear una url como /page/title-of-page.html podrías crear tu
ruta como se explica a continuación:

::

        Router::connect(
            '/page/:title',
            array('controller' => 'pages', 'action' => 'view'),
            array(
                'pass' => array('title')
            )
        );  

Para crear enlaces que se mapeen a esas rutas simplemente usamos:

::

    $html->link('Link title', array('controller' => 'pages', 'action' => 'view', 'title' => Inflector::slug('text to slug', '-'), 'ext' => 'html'))

Inflexiones Propias
===================

Las convenciones de nomenclatura de CakePHP pueden ser muy buenas.
Nombras la tabla de base de datos "usuarios", tu modelo "Usuario", tu
controlador "UsuariosController" y todo funcionará automáticamente. La
forma en que CakePHP sabe como atar unas cosas a otras es a través de
las inflexiones de palabras entre formas en singular y plural.

Hay ocasiones, sobre todo para usuarios de habla hispana, en que
encontrarás situaciones donde el inflector de CakePHP no funcione como
lo esperas. Si CakePHP no es capaz de reconocer tu Reloj o Ciudad,
editar el archivo de inflexiones propias es la manera de indicarle a
CakePHP que existen otros casos especiales. Este archivo se encuentra en
/app/config/inflections.php.

En este archivo encontrarás seis variables. Cada una de ellas te permite
definir a un grado muy fino el comportamiento de inflexiones de CakePHP.

+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Variable de inflections.php   | Descripción                                                                                                                                                                                                                                               |
+===============================+===========================================================================================================================================================================================================================================================+
| $pluralRules                  | Este arreglo contienen las expresiones regulares para pluralizar los casos especiales. Las claves del arreglo son los patrones y los valores los reemplazos.                                                                                              |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedPlural            | Un arreglo que contiene palabras que no han de ser modificadas para obtener su plural, como la palabra gente o dinero.                                                                                                                                    |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularPlural              | Un arreglo que contiene palabras y su respectivo plural. Las claves de este arreglo contienen la forma singular y los valores la forma plural. Este arreglo debe ser utilizado para colocar palabras que no sigan las reglas definidas en $pluralRules.   |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $singularRules                | Igual que $pluralRules, solo que contiene las reglas para singularizar palabras.                                                                                                                                                                          |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $uninflectedSingular          | Igual que $uninflectedPlural, solo que este arreglo contiene las palabras que no tienen singular. Por defecto es igual que $uninflectedPlural.                                                                                                            |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $irregularSingular            | Igual que $irregularPlural, solo que con palabras en forma singular.                                                                                                                                                                                      |
+-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Haciendo Bootstrap de CakePHP
=============================

Si tienes necesidades de configuración adicionales, usa el archivo de
bootstrap de CakePHP que se encuentra en /app/config/bootstrap.php. Este
archivo es ejecutado inmediatamente después de el bootstrap propio de
CakePHP.

Este archivo es ideal para un número de tareas comunes:

-  Definir funciones de conveniencia
-  Definir constantes globales
-  Definir rutas adicionales para modelos, controladores, vistas,
   plugins...

Sé cuidadoso de mantener el patron de diseño MVC cuando agregues cosas
al archivo bootstrap, puede resultar tentador colocar funciones para dar
formato a texto allí para luego usarlas en controladores.

Resiste la tentación. Te lo agradecerás más adelante a ti mismo.

Podrías considerar colocar cosas en la clase AppController. Esta clase
en poder de todos los controladores de la aplicación. AppController es
útil para colocar funciones que se ejecutan antes o después de eventos
definidos (callbacks), que serán usados en todos tus controladores.
