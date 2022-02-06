Testing
#######

A partir de CakePHP 1.2 disponemos de soporte para un completo entorno
de testing incorporado en CakePHP. Este entorno es una extensión del
entorno SimpleTest para PHP. En esta sección discutiremos cómo preparar
la aplicación para testing y cómo construir y ejecutar tus tests.

Preparándose para el testing
============================

¿Preparado/a para empezar a hacer test? ¡Bien! ¡Vamos allá entonces!

Installing SimpleTest
---------------------

Instalación de SimpleTest

El entorno de testing provisto con CakePHP 1.2 está construido sobre el
entorno de testing SimpleTest. SimpleTest no se distribuye con la
instalación por defecto de CakePHP por lo que debemos descargarlo
primero. Lo puedes encontrar aquí:
`https://simpletest.sourceforge.net/ <https://simpletest.sourceforge.net/>`_

Consigue la última versión y descomprime el código en tu carpeta
cake/vendors, o en tu carpeta app/vendors, según tus preferencias. Ahora
deberías tener un directorio vendors/simpletest con todos los archivos y
carpetas de SimpleTest dentro. ¡Recuerda tener el nivel de DEBUG al
menos a 1 en tu archivo app/config/core.php antes de ejecutar cualquier
test!

Si no tienes una conexión de base de datos para test definida en
app/config/database.php, las tablas de test se crearán con un prefijo
``test_suite_``. Puedes crear una conexión de base de adtos ``$test``
para que contenga sólo las tablas de test como la que te mostramos
debajo:

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

Si la base de datosd e test está disponible y CakePHP puede conectarse a
ella, todas las tablas serán creadas en esta base de datos.

Ejecutando los test-cases incorporados
--------------------------------------

CakePHP 1.2 se distribuye con un gran paquete de test-cases sobre la
funcionalidad del núcleo de CakePHP

Puedes acceder a estos test navegando a
http://your.cake.domain/cake\_folder/test.php - dependiendo de como sea
la disposición específica de tu aplicación. Intenta ejecutar alguno de
los grupos de test del núcleo haciendo click en el enlace
correspondiente. Ejecutar un test puede llevar un rato, pero deberías
ver algo parecido a "2/2 test casese complete: 49 passes, 0 fails and 0
exceptions.".

¡Felicidades, ya estás listo/a para empezar a escribir tests!

Introducción a los test - Unit testing vs. Web testing
======================================================

El entorno de test de CakePHP soporta dos tipos de testing. Uno es el
Unit Testing, en el cual tú pruebas pequeñas partes de tu código, como
pueden ser un método en un componente o una acción en un controlador. El
otro tipo de testing soportado es el Web Testing, en el cual automatizas
el trabajo de evaluar tu aplicación mediante la navegación por las
páginas, relleno de formularios, hacer clic en enlaces y demás.

Preparando datos de prueba
==========================

Acerca de las fixtures
----------------------

Cuando pruebes código que dependa de modelos y datos, puedes usar
**fixtures** como una forma de generar tablas temporales de datos
cargados con datos de ejemplo que pueden ser utilizados por el test. El
beneficio de usar fixtures es que tus test no pueden de ningún modo
alterar los datos de la aplicación en marcha. Además, así puedes empezar
a probar tu código antes de desarrollar contenido en vivo para tu
aplicación.

CakePHP intenta utilizar la conexión denominada ``$test`` en tu archivo
app/config/database.php. Si esta conexión no es utilizable, usará la
configuración de base de datos ``$default`` y creará las tablas de test
en la base de datos definida en esa configuración. En cualquier caso,
añadirá el prefijo "test\_suite\_" a tu propio prefijo para las tablas
(si es que hay alguno) para evitar colisiones con las tablas existentes.

CakePHP realiza los siguientes pasos durante el curso de un test case
basado en fixture:

#. Crea tablas para cada una de las fixtures necesarias
#. Rellena las tablas con datos, si es que se han proporcionado éstos en
   la fixture
#. Ejecuta los métodos de los test
#. Vacía las tablas fixture
#. Elimina las tablas fixture de la base de datos

Creando fixtures
----------------

Cuando se crea un fixture se deben definir 2 cosas:

1. cómo se crea la tabla (que campos serán parte de la tabla)
2. cómo se guardarán los registros en la tabla de prueba.

Luego podremos crear nuestro primer fixture, que utilizaremos para testear
nuestro modelo Article. Creamos un archivo llamado
**article\_fixture.php** en la carpeta **app/tests/fixtures**, con el
siguiente código:

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 
     ?> 

Usamos $fields para indicar los campos que serán parte de la tabla, y
cómo serán definidos. El formato que se usa para definir los campos es
el mismo que usamos en la funcion **generateColumnSchema()** definida en
el motor de base de datos de Cake (por ejemplo en dbo\_mysql.php.) Los
atributos que un campo puede tenes son los siguientes:

type
    es el tipo de dato de CakePHP. Actualmente los soportados son:
    string (mapea como VARCHAR), text (mapea como TEXT), integer (mapea
    como INT), float (mapea como FLOAT), datetime (mapea como DATETIME),
    timestamp (mapea como TIMESTAMP), time (mapea como TIME), date
    (mapea como DATE), y binary (mapea como BLOB)
key
    setea el campo como primary para hacerlo auto-incrementable
    (AUTO\_INCREMENT), y clave primaria (PRIMARY KEY) de la tabla.
length
    setea el tamaño del campo.
null
    setea true o false. Si puede ser nulo indicamos true, si no se
    permiten nulos va false
default
    el valor por defecto del campo.

Finalmente podemos setear un conjunto de registros que seran cargados
luego de que la tabla de testeo se crea. El formato es bastante simple,
sin embargo necesita un poco más de expilcación. Solo ten en cuenta que
cada registro del array $records debe tener una key para **cada** campo
del array $fields. Si un campo para un registro en particular necesita
tener el valor nulo, solo especifica el valor de ese campo como nulo
(NULL true).

Importar información de tabla y registros
-----------------------------------------

Tu aplicación puede tener ya modelos funcionando con datos reales
asociados, y puedes decidir probar tu modelo con esos datos. Sería
entonces un esfuerzo doble tener que definir la tabla y/o los registros
en tus fixtures. Por suerte, hay una forma de hacer que la definición de
la tabla y/o los registros para una fixture en particular vengan de un
modelo o una tabla ya existentes.

Comencemos con un ejemplo. Asumiento que tienes un modelo llamado
Article disponible en tu aplicación (que se corresponde con una tabla
llamada articles), cambiamos la fixture de ejemplo que dimos en la
sección anterior (**app/tests/fixtures/article\_fixture.php**) a:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

Esta sentencia le dice a la test suite que importe tu definición de
tabla de la tabla asociada al modelo llamado Article. Puedes usar
cualquier modelo disponible en tu aplicación. La expresión anterior no
importa registros, pero puedes hacerlo cambiandola para que sea:

::

    <?php   
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

Si, por otro lado, tienes una tabla creada pero no un modelo disponible
para ella, puedes especificar que tu importación consistirá en leer la
información de la tabla. Por ejemplo:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

Esto importará la definición de una tabla llamada 'articles' usando tu
conexión de base de datos denominada 'default'. Si quieres cambiar la
conexión sólo tienes que hacer:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'other'); 
       } 
       ?> 

Ya que se usa tu conexión a la base de datos, si hay algún prefijo de
tabla declarado, este será usado automáticamente al recabar la
información de tabla. Los dos fragmentos anteriores no importan
registros de la tabla. Para forzar a la fixture a importar también los
registros, cambialo a:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

Naturalmente puedes importar tus definiciones de tabla de un modelo o
tabla existente, pero tener tus registros definidos directamente en la
fixture, como se mostraba en la sección anterior. Por ejemplo:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'title' => 'First Article', 'body' => 'First Article Body', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'title' => 'Second Article', 'body' => 'Second Article Body', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'title' => 'Third Article', 'body' => 'Third Article Body', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
              ); 
       } 
     ?> 

Creando los tests
=================

En primer lugar, revisar una serie de normas y directrices para los
tests:

#. Los archivos de PHP que contiene los tests deben estar en :
   app/tests/cases/[algun\_ archivo].
#. Los nombres de estos archivos deben terminar con un **.test.php** en
   lugar de sólo .php.
#. Las clases que contienen los tests debe extender o heredar de
   **CakeTestCase** o **CakeWebTestCase**.
#. El nombre de cualquier método que contenga un test (por ejemplo, que
   contiene una afirmación) debería comenzar con **test**, como en
   **testPublished()**.

Cuando se crea un caso test, puede ejecutarce por medio del navegador en
la siguiente dirección **https://tu.dominio.cake/carpeta\_cake/test.php**
(dependiendo de cómo se ve específicamente tu configuración) y haciendo
clic en App casos de test, y a continuación, haga clic en el enlace a su
archivo.

CakeTestCase Callback Methods
-----------------------------

If you want to sneak in some logic just before or after an individual
CakeTestCase method, and/or before or after your entire CakeTestCase,
the following callbacks are available:

**start()**
 First method called in a *test case*.

**end()**
 Last method called in a *test case*.

**startCase()**
 called before a *test case* is started.

**endCase()**
 called after a *test case* has run.

**before($method)**
 Announces the start of a *test method*.

**after($method)**
 Announces the end of a *test method*.

**startTest($method)**
 Called just before a *test method* is executed.

**endTest($method)**
 Called just after a *test method* has completed.

Testing models
==============

Creating a test case
--------------------

Let's say we already have our Article model defined on
app/models/article.php, which looks like this:

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $conditions = array( 
                      $this->name . '.published' => 1 
                  ); 
                   
                  return $this->findAll($conditions, $fields); 
              } 
       
       } 
     ?> 

We now want to set up a test that will use this model definition, but
through fixtures, to test some functionality in the model. CakePHP test
suite loads a very minimum set of files (to keep tests isolated), so we
have to start by loading our parent model (in this case the Article
model which we already defined), and then inform the test suite that we
want to test this model by specifying which DB configuration it should
use. CakePHP test suite enables a DB configuration named **test** that
is used for all models that rely on fixtures. Setting $useDbConfig to
this configuration will let CakePHP know that this model uses the test
suite database connection.

CakePHP Models will only use the test DB config if they rely on fixtures
in your testcase!

Since we also want to reuse all our existing model code we will create
a test model that will extend from Article, set $useDbConfig and $name
appropiately. Let's now create a file named **article.test.php** in your
**app/tests/cases/models** directory, with the following contents:

::

     <?php  
       App::import('Model','Article'); 

       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

We have created the ArticleTestCase. In variable **$fixtures** we define
the set of fixtures that we'll use.

If your model is associated with other models, you will need to include
ALL the fixtures for each associated model even if you don't use them.
For example: A hasMany B hasMany C hasMany D. In ATestCase you will have
to include fixtures for a, b, c and d.

Creating a test method
----------------------

Let's now add a method to test the function published() in the Article
model. Edit the file **app/tests/cases/models/article.test.php** so it
now looks like this:

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article =& ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => 'First Article' )),
                    array('Article' => array( 'id' => 2, 'title' => 'Second Article' )),
                    array('Article' => array( 'id' => 3, 'title' => 'Third Article' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    

You can see we have added a method called **testPublished()**. We start
by creating an instance of our fixture based **Article** model, and then
run our **published()** method. In **$expected** we set what we expect
should be the proper result (that we know since we have defined which
records are initally populated to the article table.) We test that the
result equals our expectation by using the **assertEqual** method. See
the section Creating Tests for information on how to run the test.

Testing controllers
===================

Creando un test case
--------------------

Digamos que tienes un típico controlador de artículos, con su
correspondiente modelo, y que se parece a éste:

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>

Crea un archivo llamado articles\_controller.test.php y pon lo siguiente
dentro:

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Comenzando Test Case</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Terminado Test Case</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>Comenzando método ' . $method . '</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 

El método testAction
--------------------

La novedad aquí es el método **testAction**. El primer argumento de este
método es la URL "en formato Cake" de la acción del controlador que se
quiere probar, como en '/articles/index/short'.

El segundo argumento es un array de parámetros, consistente en:

return
    Indica lo que se va a devolver.
     Los valores válidos son:

    -  'vars' - Obtienes las variables de la vista disponibles tras
       ejecutar la acción
    -  'view' - Obtienes la vista generada, sin layout
    -  'contents' - Obtienes todo el html de la vista, incluyendo layout
    -  'result' - Obtienes el valor de retorno de la acción como cuando
       se usa $this->params['requested'].

    El valor por defecto es 'result'.
fixturize
    Ponlo a true si quieres que tus modelos se "auto-simulen" (de modo
    que las tablas de la aplicación se copian, junto con los registros,
    para que al probar las tablas si cambias datos no afecten a tu
    aplicación real.) Si en 'fixturize' pones un array de modelos,
    entonces sólo esos modelos se auto-simularán mientras que los demás
    utilizarán las tablas reales. Si quieres usar tus archivos de
    fixtures con testAction() no uses fixturize, y en su lugar usa las
    fixtures como harías normalmente.
method
    Ajustalo a 'post' o 'get' si quieres pasarle datos al controlador
data
    Los datos que se pasarán. Será un array asociativo consistente en
    pares de campo => valor. Échale un vistazo a
    ``function testIndexPostFixturized()`` en el case test de arriba
    para ver cómo emulamos pasar datos de formulario como post para un
    nuevo artículo.

Pitfalls
--------

If you use testAction to test a method in a controller that does a
redirect, your test will terminate immediately, not yielding any
results.
See
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
for a possible fix.

For an in-depth explanation of controller testing please see this blog
post by Mark Story `Testing CakePHP Controllers the hard
way <https://mark-story.com/posts/view/testing-cakephp-controllers-the-hard-way>`_.

Testing Helpers
===============

Since a decent amount of logic resides in Helper classes, it's important
to make sure those classes are covered by test cases.

Helper testing is a bit similar to the same approach for Components.
Suppose we have a helper called CurrencyRendererHelper located in
``app/views/helpers/currency_renderer.php`` with its accompanying test
case file located in
``app/tests/cases/helpers/currency_renderer.test.php``

Creating Helper test, part I
----------------------------

First of all we will define the responsibilities of our
CurrencyRendererHelper. Basically, it will have two methods just for
demonstration purpose:

function usd($amount)

This function will receive the amount to render. It will take 2 decimal
digits filling empty space with zeros and prefix 'USD'.

function euro($amount)

This function will do the same as usd() but prefix the output with
'EUR'. Just to make it a bit more complex, we will also wrap the result
in span tags:

::

    <span class="euro"></span> 

Let's create the tests first:

::

    <?php

    //Import the helper to be tested.
    //If the tested helper were using some other helper, like Html, 
    //it should be impoorted in this line, and instantialized in startTest().
    App::import('Helper', 'CurrencyRenderer');

    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;

        //Here we instantiate our helper, and all other helpers we need.
        public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }

        //testing usd() function.
        public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            //We should always have 2 decimal digits.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            //Testing the thousands separator
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }
    }

Here, we call ``usd()`` with different parameters and tell the test
suite to check if the returned values are equal to what is expected.

Executing the test now will result in errors (because
currencyRendererHelper doesn't even exist yet) showing that we have 3
fails.

Once we know what our method should do, we can write the method itself:

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Here we set the decimal places to 2, decimal separator to dot, thousands
separator to comma, and prefix the formatted number with 'USD' string.

Save this in app/views/helpers/currency\_renderer.php and execute the
test. You should see a green bar and messaging indicating 4 passes.

Probando componentes
====================

Supongamos que queremos hacer test a un componente llamado
TransporterComponent, el cual usa un modelo llamado Transporter para
proporcionar funcionalidad a otros controladores. Utilizaremos cuatro
archivos:

-  Un componente llamado Transporters que se encuentra en
   **app/controllers/components/transporter.php**
-  Un modelo llamado Transporte que está en
   **app/models/transporter.php**
-  Una fixture llamada TransporterTestFixture situada en
   **app/tests/fixtures/transporter\_fixture.php**
-  El código para el test, en **app/tests/cases/transporter.test.php**

Initializing the component
--------------------------

Ya que `CakePHP desaliante importar modelos directamente en los
componentes </es/view/62/components>`_ necesitamos un controlador para
acceder a los datos en el mmodelo.

Si el método startup() del componente tiene este aspecto:

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }

entonces podemos simplemente crear una clase sencilla:

::

    class FakeTransporterController {} 

y asignarle valores dentro de ella como aquí:

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 

Creando un método de prueba
---------------------------

Simplemente crea una clase que extienda CakeTestCase y ¡comienza a
escribir tests!

::

    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');  
        function testGetTransporter() { 
              $this->TransporterComponentTest = new TransporterComponent(); 
              $controller = new FakeTransporterController(); 
              $controller->Transporter = new TransporterTest(); 
              $this->TransporterComponentTest->startup(&$controller); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden"); 
              $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx"); 
               
              $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden"); 
              $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden"); 
              $this->assertEqual($result, 3, "GL is best for 410xx-419xx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway"); 
              $this->assertEqual($result, 0, "Noone can service Norway");         
       }
    }
     

Web testing - Testeando las vistas
==================================

La mayoria, si no es que lo son todos, los proyectos CakePHP son
aplicaciones web. Aunque el testeo unitario es una excelente manera de
testear pequeñas porciones de nuestro código, hay ocaciones en la que
querriamos hacer un testeo a gran escala. La clase **CakeWebTestCase**
nos brinda una muy buena manera de hacer éste tipo de testing, desde el
punto de vista del usuario.

About CakeWebTestCase
---------------------

**CakeWebTestCase** es una extensión directa de SimpleTest WebTestCase,
sin ninguna funcionalidad extra. Toda la funcionalidad encontrada en `la
documentación de SimpleTest para Testeo Web (Web
testing) <https://simpletest.sourceforge.net/en/web_tester_documentation.html>`_
tambien están disponibles aqui. Esto quiere decir que no se pueden usar
los fixtures, y que **todos los casos de testeo involucrados en un ABM
(alta, baja o modificación) a la base de datos modificarán
permanentemente los valores**. Los resultados del Test son comparados
frecuentemente con los qe tiene la base de datos, por lo tanto,
asegurarse que la bd tenga los valores que se esperan, es parte del
proceso de construcción del test.

Creando un test
---------------

Manteniendo las convenciones de los otros tests, los archivos de testeo
de vistas se deberán crear en la carpeta tests/cases/views. Claro que se
podrian guardar en otra ubicación, pero siempre es bueno seguir las
convenciones. Entonces, crearemos el archivo:
tests/cases/views/complete\_web.test.php

Para escribir testeos web, deberás extender la clase **CakeWebTestCase**
y no CakeTestCase, tal como era en los otros tests:

::

    class CompleteWebTestCase extends CakeWebTestCase

Si necesitas hacer alguna inicialización antes de que comience el test,
crea el constructor:

::

    function CompleteWebTestCase(){
      //Do stuff here
    }

Cuando escribes los test cases, lo primero que vas a necesitar hacer es
capturar algun tipo de salida o resultado donde ver y analizar. Ésto
puede ser realizado haciendo un request **get** o **post**, usando los
métodos **get()**\ o **post()** respectivamente. A ambos métodos se le
pasa como primer parámetro la url, aunque puede ser traida dinámicamente
si asumimos que script de testing está en
http://your.domain/cake/folder/webroot/test.php tipeando:

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));

Entonces podremos hacer gets y posts usando las urls de Cake, por
ejemplo:

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);

El segundo parámetro del método post, **$data**, es un array asociativo
que contiene post data en el formato de Cake:

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");

Una vez que se hizo el request a la página, se pueden utilizar todos los
mismos asserts que veniamos usando en SimpleTest.

Walking through a page
----------------------

CakeWebTest also gives you an option to navigate through your page by
clicking links or images, filling forms and clicking buttons. Please
refer to the SimpleTest documentation for more information on that.

Testing plugins
===============

Tests for plugins are created in their own directory inside the plugins
folder.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

They work just like normal tests but you have to remember to use the
naming conventions for plugins when importing classes. This is an
example of a testcase for the PizzaOrder model from the plugins chapter
of this manual. A difference from other tests is in the first line where
'Pizza.PizzaOrder' is imported. You also need to prefix your plugin
fixtures with '``plugin.plugin_name.``\ '.

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');

    class PizzaOrderCase extends CakeTestCase {

        // Plugin fixtures located in /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;
        
        function testSomething() {
            // ClassRegistry makes the model use the test database connection
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');

            // do some useful test here
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>

If you want to use plugin fixtures in the app tests you can reference
them using 'plugin.pluginName.fixtureName' syntax in the $fixtures
array.

That is all there is to it.

Miscellaneous
=============

Customizing the test reporter
-----------------------------

The standard test reporter is **very** minimalistic. If you want more
shiny output to impress someone, fear not, it is actually very easy to
extend.
The only danger is that you have to fiddle with core Cake code,
specifically **/cake/tests/libs/cake\_reporter.php**.

To change the test output you can override the following methods:

paintHeader()
    Prints before the test is started.
paintPass()
    Prints everytime a test case has passed. Use $this->getTestList() to
    get an array of information pertaining to the test, and $message to
    get the test result. Remember to call parent::paintPass($message).
paintFail()
    Prints everytime a test case has failed. Remember to call
    parent::paintFail($message).
paintFooter()
    Prints when the test is over, i.e. when all test cases has been
    executed.

If, when running paintPass and paintFail, you want to hide the parent
output, enclose the call in html comment tags, as in:

::

    echo "\n<!-- ";
    parent::paintFail($message);
    echo " -->\n";

A sample **cake\_reporter.php**\ setup that creates a table to hold the
test results follows:

::

    <?php
     /**
     * CakePHP(tm) Tests <https://trac.cakephp.org/wiki/Developement/TestSuite>
     * Copyright 2005-2008, Cake Software Foundation, Inc.
     *                              1785 E. Sahara Avenue, Suite 490-204
     *                              Las Vegas, Nevada 89104
     *
     *  Licensed under The Open Group Test Suite License
     *  Redistributions of files must retain the above copyright notice.
     */
     class CakeHtmlReporter extends HtmlReporter {
     function CakeHtmlReporter($characterSet = 'UTF-8') {
     parent::HtmlReporter($characterSet);
     }
     
    function paintHeader($testName) {
      $this->sendNoCacheHeaders();
      $baseUrl = BASE;
      print "<h2>$testName</h2>\n";
      print "<table style=\"\"><th>Res.</th><th>Test case</th><th>Message</th>\n";
      flush();
     }

     function paintFooter($testName) {
       $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
       print "</table>\n";
       print "<div style=\"";
       print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
       print "\">";
       print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
       print " test cases complete:\n";
       print "<strong>" . $this->getPassCount() . "</strong> passes, ";
       print "<strong>" . $this->getFailCount() . "</strong> fails and ";
       print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
       print "</div>\n";
     }

     function paintPass($message) {
       parent::paintPass($message);
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden;                  border-right: hidden\">\n";
       print "\t\t<span style=\"color: green;\">Pass</span>: \n";
       echo "\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       array_shift($breadcrumb);
       array_shift($breadcrumb);
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $message = split('at \[', $message);
       print "-&gt;$message[0]<br />\n\n";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function paintFail($message) {
       echo "\n<!-- ";
       parent::paintFail($message);
       echo " -->\n";
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "\t\t<span style=\"color: red;\">Fail</span>: \n";
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "$message";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function _getCss() {
       return parent::_getCss() . ' .pass { color: green; }';
     }
     
     }
     ?>

Grouping tests
--------------

If you want several of your test to run at the same time, you can try
creating a test group. Create a file in **/app/tests/groups/** and name
it something like **your\_test\_group\_name.group.php**. In this file,
extend **GroupTest** and import test as follows:

::

    <?php 
    class TryGroupTest extends GroupTest { 
      var $label = 'try'; 
      function tryGroupTest() { 
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models'); 
      } 
    } 
    ?> 

The code above will group all test cases found in the
**/app/tests/cases/models/** folder. To add an individual file, use
**TestManager::addTestFile**\ ($this, filename).

Running tests in the Command Line
=================================

If you have simpletest installed you can run your tests from the command
line of your application.

from **app/**

::

    cake testsuite help

::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix

    Examples: 
            cake testsuite app all
            cake testsuite core all

            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller

            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set

            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket

            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'

    Code Coverage Analysis: 


    Append 'cov' to any of the above in order to enable code coverage analysis

As the help menu suggests, you'll be able to run all, part, or just a
single test case from your app, plugin, or core, right from the command
line.

If you have a model test of **test/models/my\_model.test.php** you'd run
just that test case by running:

::

    cake testsuite app case models/my_model

