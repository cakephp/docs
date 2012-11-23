Convenciones en CakePHP
#######################

(Nota del Traductor: Posiblemente la traducción de "conventions" sea muy
literal. Queremos expresar el uso por defecto de determinados acuerdos que
nos permiten establecer un marco común de trabajo).

Preferimos el uso de convenciones sobre la configuración. Aunque ocuparás
algo de tu tiempo aprendiendo las convenciones usadas en CakePHP, ahorrarás
mucho más en el camino. Cuando usas las convenciones, aprovechas funcionalidad
gratuita y te liberas de la pesadilla de mantener los ficheros de configuración.
Trabajar con convenciones también estandariza el proceso de despliegue de tu
aplicación, permitiendo a otros desarrolladores conocer tu estructura más
fácilmente.

Hemos empleado varios años y toda nuestra experiencia y buenas prácticas en 
la creación de estas convenciones. Ya sabes que, aunque te recomendamos que 
las sigas, puedes evitarlas con facilidad. Esto te resultará especialmente
útil cuando trates con sistemas legados.

Convenciones en los Controladores
=================================

Nombre del Controlador en plural, CamelCased, y colocando ``Controller`` al
final. ``PeopleController`` y ``LatestArticlesController`` son ejemplos que
siguen esta convención.

El primer método a escribir en el controlador es ``index()``. Cuando una petición
vaya dirigida a este controlador, pero no se especifique acción, CakePHP 
ejecutará por defecto el método ``index()``. Por ejemplo, la petición
http://example.com/apples/ será dirigida al método ``index()`` del controlador
``ApplesController``, así como la llamada a http://example.com/apples/view/ se
mapeará al método ``view()`` de este mismo controlador.

Puedes cambiar la visibilidad de los métodos de CakePHP usando el carácter 
subrayado "_" al principio para ocultar su acceso directo desde la web, aunque
será accesible internamente. Por ejemplo:

::

    class NewsController extends AppController {
    
        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //Logic to find latest news articles
        }
    }

El acceso a la url http://example.com/news/latest podrá realizarse con 
normalidad, mientras que al acceder a la url 
http://example.com/news/\_findNewArticles/ retornará un error, ya que 
este método está precedido por un "_". También puedes usar los modificadores
de visibilidad de PHP (private, protected, public) para esto. Los métodos
que no sean públicos, no podrán ser accedidos.

Consideraciones para las URL de los controladores
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como acabas de ver, los controladores que tienen nombres de una sóla palabra
se asignan a una URL en minúscula. Por ejemplo ``ApplesController`` (que se 
definirá en el fichero con nombre ApplesController.php) se accederá desde la 
URL http://example.com/apples.

Controladores cuyo nombre tiene varias palabras podrían ser asignados de 
cualquiera de estas formas

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

todos ellos resolverían al método index del controlador RedApples. De todos
la convención es que esa url sea minúscula y subrayada, de este modo

- /red\_apples/go\_pick sería la url correcta para acceder a  ``RedApplesController::go_pick``

Para más información sobre URLs y parámetros en CakePHP, consulta 
:ref:`routes-configuration`.

.. _file-and-classname-conventions:

Convenciones sobre nombres de fichero y nombres de clases
=========================================================

Como regla general, los nombres de fichero y los nombres de clase serán
iguales, en formato CamelCased. Si tienes una clase **MyNiftyClass**, el
fichero que la contiene se llamará **MyNiftyClass.php**. En el listado
siguiente se muestran algunos ejemplos:

-  El controlador con nombre **KissesAndHugsController** estará definida en el 
   fichero **KissesAndHugsController.php**
-  El componente con nombre **MyHandyComponent** estará definido en el fichero
   **MyHandyComponent.php**
-  El modelo con nombre **OptionValue** estará en el fichero **OptionValue.php**
-  El comportamiento (behavior) **EspeciallyFunkableBehavior** podrás encontrarlo
   en el fichero **EspeciallyFunkableBehavior.php**
-  La vista **SuperSimpleView** estará en el fichero **SuperSimpleView.php**
-  El helper **BestEverHelper** estará, seguro que lo has adivinado ya, en el 
   fichero **BestEverHelper.php**

Cada uno de estos ficheros estará en la carpeta correspondiente bajo el 
directorio /app.

Convenciones para modelos y bases de datos
==========================================

Los nombres de clase para los modelos serán CamelCased. Persona, GranPersona, 
y SuperGranPersona son ejemplos válidos para modelos.

Para las tablas en la base de datos se utiliza plural y el carácter subrayado 
(underscored) de esta forma: ``gran_personas``, ``super_gran_personas``. 
Verás que al leer los plurales en español, no tienen el sentido correcto. 
Ten en cuenta que esta convención proviene del inglés y si escribes los 
nombres de tus modelos en inglés, todo cobra mucho más sentido. Puedes 
saltar esta convención en cualquier momento y escribir plurales más adecuados
al español.

Puedes también usar la clase de utilidad :php:class:`Inflector` para comprobar
el singular y plural de las palabras. Consulta la documentación aquí 
:doc:`/core-utility-libraries/inflector`.

Los nombres de los campos con más de una palabra se escriben en minúscula y 
subrayado, por ejemplo ``first_name``.

Las claves foráneas (foreign keys) en las relaciones hasMany, belongsTo y 
hasOne se reconocen por defecto si el nombre del campo se escribe usando
el singular de la tabla con la que se relaciona y terminando en \_id.
Por ejemplo en el modelo Baker tenemos una relación hasMany con el modelo
Cake, en la tabla cakes escribiremos un campo con el nombre baker_id. En 
caso de que el nombre de la tabla tenga varias palabras, como en 
category\_types, la clave sería category\_types\_id.

Cuando se trata de relaciones HABTM hasAndBelongsToMany, la tabla que hace de
unión entre las tablas de ambos modelos debe nombrarse utilizando a su vez el
nombre de cada tabla en orden alfabético y plural. Por ejemplo usaremos
apples\_zebras en vez de zebras\_apples.

Todas las tablas que utilicemos en CakePHP, salvo las tablas de unión de las 
relaciones HABTM, requieren una clave primaria en un único campo para 
identificar cada fila. Si necesitas que algún modelo no tenga clave primaria en un único campo, la convención es que añadas este campo a la tabla.

CakePHP no soporta claves primarias compuestas. Si quieres manipular 
directamente los datos de una tabla de unión, usa :ref:`query <model-query>`
y construye una query manualmente, o añade una clave primaria a la tabla
para poder trabajar con ella como con un modelo normal. Ejemplo:

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id)); 

En vez de utilizar una clave con autoincremento como clave primaria, recuerda 
que también puedes usar una clave char(36). Cuando CakePHP ve que has 
definido así tu clave primaria, gestionará esta clave añadiendo un UUID 
(String::uuid) que es un código único que identificará a cada registro, cada
vez que realices un Model::save en ese modelo.

Convenciones en la vistas
=========================

Los nombres de las vistas son iguales a los del método del controlador al que
hacen referencia, en formato subrayado. Por ejemplo el método getReady() del 
controlador PeopleController buscará el fichero de vista en la ruta
/app/View/People/get\_ready.ctp.

El patrón para nombrar las vistas es
/app/View/Controller/underscored\_function\_name.ctp.

Si usas las convenciones de CakePHP para tu aplicación, ganas inmediatamente
funcionalidad gratis, que se mantiene sola y no necesita tocar la 
configuración. Sirva para ilustrar esto un ejemplo:

-  Tabla en la base de datos: "people"
-  Nombre de Modelo: "Person" (es el singular de people para CakePHP), en 
   el fichero /app/Model/Person.php
-  Nombre del Controlador: "PeopleController", en el fichero 
   /app/Controller/PeopleController.php
-  Plantilla para la vista en el fichero /app/View/People/index.ctp

Si usas estas convenciones, CakePHP sabrá que una llamada a 
http://example.com/people/ se mapeará a una llamada al método index() del 
controlador PeopleController, donde el modelo Person será instanciado 
automáticamente para su uso (leerá los datos de la tabla 'people' en la base 
de datos). Ninguna de estas relaciones necesita ser creada ni configurada de
ninguna otra forma que creando los nombres correctos y los ficheros que tienes
que crear de todos modos para que tu aplicación funcione.

Ahora ya sabes los fundamentos y cómo utilizar las convenciones de CakePHP, 
te recomendamos que le eches un vistazo al :doc:`tutorial para hacer un blog</tutorials-and-examples/blog/blog>`
para ver cómo encajan estas piezas en una aplicación completa.
