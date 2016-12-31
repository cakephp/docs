Convenciones de CakePHP
#######################

Somos grandes fanáticos de convención sobre configuración. Aun cuando
toma un poco de tiempo aprender las convenciones de CakePHP, usted
ahorrará tiempo en la marcha: siguiendo las convenciones, usted obtiene
libre funcionalidad, y también se libera de la pesadilla del
mantenimiento del seguimiento de los archivos de configuración. Las
convenciones también hacen un sistema de desarrollo muy uniforme,
permitiendo a otros desarrolladores ayudar más fácilmente.

Las convenciones de CakePHP han sido destiladas de años de experiencia
de desarrollo web y mejores prácticas. Mientras que le sugerimos el uso
de estas convenciones durante el desarrollo con CakePHP, deberíamos
mencionar que muchos de estos postulados pueden ser anulados, esto es
especialmente útil cuando se trabaja con sistemas heredados.

Convenciones de los nombres de archivos y clases
================================================

En general, los nombres de archivo llevan el símbolo underscore "\_",
mientras que los nombres de las clases usan CamelCase. La clase
MyNiftyClass puede ser encontrada en el archivo my\_nifty\_class.php,
por ejemplo.

Sin embargo, el nombre de la clase que contiene un archivo puede no
necesariamente ser encontrada en el nombre de archivo. La clase
EmailComponent es encontrada en un archivo llamado email.php, y la clase
HtmlHelper es encontrada en un archivo llamado html.php.

Convenciones de Modelo y de la Base de datos
============================================

Los nombres de las clases de modelos están en singular y en formato
CamelCase. ``Persona``, ``PersonaGrande``, y ``PersonaMuyGrande`` son
todos ejemplos de nombres de modelos convencionales.

Los nombres de las tablas correspondientes a modelos de CakePHP están en
plural y usando guión bajo. Las tablas subyacentes para los modelos
arriba mencionados serían: ``personas``, ``personas_grandes``, y
``personas_muy_grandes`` respectivamente.

Puedes utilizar la librería de utilidades "Inflector" para verificar las
palabras singulares/plurales. Consulta la `documentación de
Inflector </es/view/491/Inflector>`_ para más información.

Los nombres de los campos con dos o más palabras se definen con guiones
bajos: ``nombre_y_apellidos``.

El nombre por defecto de las claves foráneas en relaciones hasMany,
belongsTo o hasOne, es el nombre de la tabla relacionada (en singular)
seguido de ``_id``. Así, si ``Panadero`` hasMany ``Tarta``, la tabla
``tartas`` referenciará la tabla ``panaderos`` mediante la clave foránea
``panadero_id``. Para una tabla compuesta por varias palabras como
``tipos_categorias``, la clave foránea sería ``tipo_categoria_id``.

El nombre de las tablas de unión entre modelos, usadas en relaciones
hasAndBelongToMany (HABTM), debería estar formado por el nombre de las
tablas que une puestos en orden alfabético (``cebras_manzanas`` en vez
de ``manzanas_cebras``).

Todas las tablas con las que interaccionan los modelos de CakePHP (con
excepción de las de unión de tablas) necesitan una clave primaria simple
que identifique inequívocamente cada fila. Si deseas modelar una tabla
que no tiene una clave primaria de un sólo campo, como por ejemplo las
filas de una tabla de unión ``posts_tags``, la convención de CakePHP
dicta que se añada una clave primaria de un solo campo a la tabla.

CakePHP no soporta claves primarias compuestas. Si deseas manipular
directamente los datos de tu tabla de unión, usa llamadas directas a
`query <https://book.cakephp.org/es/view/456/query>`_ o añade una clave
primaria para que actue como un modelo normal. Por ejemplo:

::

    CREATE TABLE posts_tags (
        id INT(10) NOT NULL AUTO_INCREMENT,
        post_id INT(10) NOT NULL,
        tag_id INT(10) NOT NULL,
        PRIMARY KEY(id)
    );

En vez de utilizar una clave autoincremental como clave primaria, puedes
utilizar char(36). De este modo CakePHP utilizará un uuid(String::uuid)
único de 36 caracteres siempre que grabes un nuevo registro utilizando
el método Model::save.

Convenciones de Controladores
=============================

Los nombres de las clases de los controladores son en plural, con
formato CamelCased, y Terminan en ``Controller``. ``PersonasController``
y ``UltimosArticulosController`` son ejemplos de nombres convencionales
de controladores.

El primer método que escribas para un controlador debe de ser el método
``index()``. Cuando la petición especifica un controlador pero no una
acción, el comportamiento por defecto de CakePHP es ejecutar el método
``index()`` de dicho controlador. Por ejemplo, una petición de
http://www.example.com/apples/ se corresponde con la llama al método
``index()`` del controlador ApplesController, mientras que
http://www.example.com/apples/view se corresponde con una llamada al
método view() del controlador ApplesController.

También puedes cambiar la visibilidad de los métodos de los
controladores en CakePHP anteponiendo al nombre del método guiones
bajos. Si un método de un controllador comienza por un guión bajo, el
método no será accesible diretamente desde la web, sino que estará
disponible sólo para uso interno. Por ejemplo:

::

    <?php
    class NoticiasController extends AppController {
        function ultimas() {
            $this->_buscaNuevosArticulos();
        }

        function _buscaNuevosArticulos() {
            //Lógica para encontrar los nuevos articulos.
        }
    }
    ?>

Mientras que la página http://www.example.com/noticias/ultimas/ está
accesible de manera normal, si alguien intenta acceder a la página
http://www.example.com/noticias/\_buscaNuevosArticulos/ obtendrá un
error porque el nombre del método está precedido por un guión bajo.

Consideraciones de URL para nombres de controladores
----------------------------------------------------

Como se puede ver, los controladores con un nombre simple (de una sola
palabra) pueden ser fácilmente mapeados a una url en minúsculas. Por
ejemplo, ``ApplesController`` (que se define en el archivo
'apples\_controller.php') y accedido desde http://example.com/apples.

Por otro lado múltiples combinaciones de palabras *pueden* ser
transformadas automáticamente en un mismo nombre de controlador:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

Todas resuelven la acción index de controlador RedApples. sin embargo,
la convención es que las urls sean en minúsculas y separadas con guión
bajo, por lo tanto /red\_apples/go\_pick es la forma correcta de acceder
a la acción. ``RedApplesController::go_pick``.

Para mas información sobre CakePHP URLs y sus parametros, ver
`Configuración de Rutas </es/view/46/Routes-Configuration>`_.

Convenciones de Vistas
======================

Los archivos de plantillas de Vistas (Views) deben ser nombradas después
de las funciones de los controladores con guión bajo "\_". La funcion
getReady() del controlador PeopleController se visualizara con la
plantilla de vista en /app/views/people/get\_ready.ctp por ejemplo.

El patrón básico es:
/app/views/controller/underscored\_function\_name.ctp

Al nombrar las piezas de su aplicación utilizando las convenciones de
CakePHP, usted adquiere funcionalidad sin mucho mantenimiento de la
configuración. Aquí encontramos un ejemplo final de las convenciones

-  Tabla de Base de Datos: ‘people’
-  Clase de Modelo: ‘Person’, encontrada en /app/models/person.php
-  Clase de Controlador: ‘PeopleController’, encontrada en
   /app/controllers/people\_controller.php
-  Plantilla de Vista, encontrada en /app/views/people/index.ctp

Usando estas convenciones, CakePHP entiende que la peticion
http://example.com/people/ apunta a la llamada de funcion index() en el
controlador , PeopleController, donde el modelo Person esta disponible
automaticamente (y apunta automaticamente a la tabla ‘people’ en la base
de datos), y se renderiza en el archivo. Ninguna de estas relaciones han
sido configuradas por otra razon que crear clases y archivos que usted
necesita crear.

Ahora que usted ya se ha involucrado con los fundamentos de CakePHP,
puede revisar el tutorial para realizar un Blog en CakePHP, que se
encuentra al final de este manual.
