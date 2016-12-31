Modelos
#######

 

La Comprensión de Modelos
=========================

Un Modelo representa tu modelo de datos y, en programación orientada a
objetos, es un objeto que representa una "cosa", como un coche, una
persona, o una casa. Un blog, por ejemplo, puede contener varios
artículos (*posts*) y cada artículo puede contener varios comentarios.
Los objetos Blog, Artículo (*Post*) y Comentario son ejemplos de
modelos, cada uno asociado con el otro.

Aquí presentamos un ejemplo simple de definición de modelo en CakePHP:

::

    <?php

    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }

    ?>

Simplemente con esta declaración, se le otorga al modelo *Ingredient*
toda la funcionalidad que necesitarás para crear consultas junto con
guardado y borrado de datos. Estos métodos mágicos provienen del modelo
de herencia de CakePHP. El modelo *Ingredient* extiende el modelo de
aplicaciónm *AppModel*, el cual extiende la clase *Model*, interna de
CakePHP. Es esta clase *Model* interna la que otorga la funcionalidad a
nuestro modelo pesonalizado, *Ingredient*.

La clase intermedia *AppModel* está vacía y reside por defecto dentro de
la carpeta /cake/. Redefinir *AppModel* te permitirá definir
funcionalidad que debería estar disponible a todos los modelos dentro de
tu aplicación. Para hacer eso, necesitas crear tu propio fichero
app\_model.php que reside en la raíz de la carpeta /app/. Creando un
proyecto utilizando *`Bake </es/view/113/code-generation-with-bake>`_*,
*Bake* generará automáticamente este fichero por ti.

Crea tu fichero modelo en PHP en el directorio /app/models/ o en un
subdirectorio de /app/models/. CakePHP lo encontrará en cualquier lugar
en el directorio. Por convención, debería tener el mismo nombre que la
clase; para este ejemplo, ingredient.php.

CakePHP creará dinamicamente un objeto modelo por ti si no puede
encontrar un archivo correspondiente en /app/models. Esto también
significa que si, accidentalmente, nombras tu archivo de manera errónea
(p.ej. Ingredient.php o ingredients.php) CakePHP utilizará *AppModel* en
lugar de tu archivo de modelo con nombre incorrecto. Si estás tratando
de utilizar un método de un modelo personalizado y estás obteniendo
errores SQL, normalmente es porque CakePHP no puede encontrar tu modelo.

Ver también `Comportamientos </es/view/88/Comportamientos>`_ para más
información sobre cómo aplicar lógica similar para múltiples modelos.

La propiedad ``$name`` es necesaria para PHP4 pero opcional para PHP5.

Con tu modelo definido, este puede ser accedido dentro de tu
`Controlador </es/view/49/Controladores>`_. CakePHP automaticamente hará
que se pueda acceder al modelo cuando su nombre concuerde con el del
controloador. Por ejemplo, un controlador llamado
*IngredientsController* automaticamente inicializará el modelo
*Ingredient* y será accesible por el controlador mediante
``$this->Ingredient``.

::

    <?php

    class IngredientsController extends AppController {
        function index() {
            //obtiene todos los ingredientes y los pasa a la vista:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

    ?>

Están disponibles los modelos asociados a través del modelo principal.
En el siguiente ejemplo, el modelo Receta (*Recipe*) tiene una
asociación con el modelo Ingrediente (*Ingredient*).

::

    $this->Recipe->Ingredient->find('all');

Como podrás ver en *Controllers*, puedes atar múltiples modelos al
controlador y acceder directamente desde él. En el siguiente ejemplo,
ambos modelos *Recipe* y *User* son accesibles desde el controlador
actual.

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe', 'User');
        function index() {
           $this->Recipe->find('all');
           $this->User->find('all');
        }
    }
    ?>

Si no has añadido el modelo a través de la propiedad ``$uses`` entonces
necesitarás importar el modelo manualmente e instanciarlo dentro de la
acción.

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe');
        function index() {
           $this->Recipe->find('all');

           App::import('Model', 'User');
           $user = new User();
           $user->find('all');
        }
    }
    ?>

Creando Tablas de Bases de Datos
================================

A pesar de que CakePHP puede tener orígenes de datos (*datasources*) que
no son manejadas por sistemas de gestión de bases de datos, la mayoría
de las veces lo son. CakePHP está diseñado para ser agnóstico y
funcionará con MySQL, MSSQL, Oracle, PostgreSQL y otros. Puedes crear
tus tablas de base de datos como lo harías normalmente. Cuando creas tus
clases del Modelo, automáticamente se mapean a las tablas que has
creado.

Los nombres de las tablas son, por convención, en minúsculas y en
plural, con las palabras de los nombres de tablas de varias palabras
separadas por guiones de subrayado (\_). Por ejemplo, un nombre de
Modelo de *Ingredient* espera el nombre de tabla *ingredients*. un
nombre de Modelo de *EventRegistration* debería esperar un nombre de
tabla *event\_registrations*. CakePHP inspeccionará tus tablas para
determinar el tipo de dato de cada campo y utiliza esta información para
automatizar varias características como la salida de campos de
formulario en la vista.

Los nombres de los campos son, por convención, en minúscula y separados
por guiones de subrayado (\_).

Las asociaciones del modelo con el nombre de la tabla pueden ser
anuladas con el atributo ``useTable`` del modelo, explicado más adelante
en este capítulo.

En el resto de esta sección verás cómo CakePHP "mapea" tipos de campos
de bases de datos en tipos de datos PHP y cómo CakePHP puede automatizar
tareas basandose en cómo tus campos están definidos.

CakePHP viene preparado para el inglés. En caso de desear flexiones para
el español es necesario modificar eL fichero ``cake/libs/inflector.php``

Asociaciones de Tipo de Dato por Base de Datos
----------------------------------------------

Todo
`RDMS <http://es.wikipedia.org/wiki/Sistema_administrador_de_bases_de_datos_relacionales>`_
define tipos de datos de manera ligeramente diferente. Dentro de la
clase de origen de datos (o "fuente de datos", *datasource*) para cada
sistema de base de datos, CakePHP "mapea" dichos tipos a algo que
reconoce y crea una interfaz unificada sin importar en qué sistema de
bases de datos necesitas ejecutarlo.

El siguiente desglose describe cómo está "mapeado" cada uno.

MySQL
~~~~~

+----------------+----------------------------+
| Tipo CakePHP   | Propiedades del Campo      |
+================+============================+
| primary\_key   | NOT NULL auto\_increment   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int(11)                    |
+----------------+----------------------------+
| float          | float                      |
+----------------+----------------------------+
| datetime       | datetime                   |
+----------------+----------------------------+
| timestamp      | datetime                   |
+----------------+----------------------------+
| time           | time                       |
+----------------+----------------------------+
| date           | date                       |
+----------------+----------------------------+
| binary         | blob                       |
+----------------+----------------------------+
| boolean        | tinyint(1)                 |
+----------------+----------------------------+

Un campo de tipo *tinyint(1)* es considerado *booleano* por CakePHP.

MySQLi
~~~~~~

+----------------+--------------------------------+
| Tipo CakePHP   | Propiedades del Campo          |
+================+================================+
| primary\_key   | DEFAULT NULL auto\_increment   |
+----------------+--------------------------------+
| string         | varchar(255)                   |
+----------------+--------------------------------+
| text           | text                           |
+----------------+--------------------------------+
| integer        | int(11)                        |
+----------------+--------------------------------+
| float          | float                          |
+----------------+--------------------------------+
| datetime       | datetime                       |
+----------------+--------------------------------+
| timestamp      | datetime                       |
+----------------+--------------------------------+
| time           | time                           |
+----------------+--------------------------------+
| date           | date                           |
+----------------+--------------------------------+
| binary         | blob                           |
+----------------+--------------------------------+
| boolean        | tinyint(1)                     |
+----------------+--------------------------------+

ADOdb
~~~~~

+----------------+-------------------------+
| Tipo CakePHP   | Propiedades del Campo   |
+================+=========================+
| primary\_key   | R(11)                   |
+----------------+-------------------------+
| string         | C(255)                  |
+----------------+-------------------------+
| text           | X                       |
+----------------+-------------------------+
| integer        | I(11)                   |
+----------------+-------------------------+
| float          | N                       |
+----------------+-------------------------+
| datetime       | T (Y-m-d H:i:s)         |
+----------------+-------------------------+
| timestamp      | T (Y-m-d H:i:s)         |
+----------------+-------------------------+
| time           | T (H:i:s)               |
+----------------+-------------------------+
| date           | T (Y-m-d)               |
+----------------+-------------------------+
| binary         | B                       |
+----------------+-------------------------+
| boolean        | L(1)                    |
+----------------+-------------------------+

DB2
~~~

+----------------+----------------------------------------------------------------------------+
| Tipo CakePHP   | Propiedades del Campo                                                      |
+================+============================================================================+
| primary\_key   | not null generated by default as identity (start with 1, increment by 1)   |
+----------------+----------------------------------------------------------------------------+
| string         | varchar(255)                                                               |
+----------------+----------------------------------------------------------------------------+
| text           | clob                                                                       |
+----------------+----------------------------------------------------------------------------+
| integer        | integer(10)                                                                |
+----------------+----------------------------------------------------------------------------+
| float          | double                                                                     |
+----------------+----------------------------------------------------------------------------+
| datetime       | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| timestamp      | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| time           | time (H.i.s)                                                               |
+----------------+----------------------------------------------------------------------------+
| date           | date (Y-m-d)                                                               |
+----------------+----------------------------------------------------------------------------+
| binary         | blob                                                                       |
+----------------+----------------------------------------------------------------------------+
| boolean        | smallint(1)                                                                |
+----------------+----------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+----------------+--------------------------------------------------------+
| Tipo CakePHP   | Propiedades del Campo                                  |
+================+========================================================+
| primary\_key   | IDENTITY (1, 1) NOT NULL                               |
+----------------+--------------------------------------------------------+
| string         | varchar(255)                                           |
+----------------+--------------------------------------------------------+
| text           | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+----------------+--------------------------------------------------------+
| integer        | integer                                                |
+----------------+--------------------------------------------------------+
| float          | float                                                  |
+----------------+--------------------------------------------------------+
| datetime       | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| timestamp      | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| time           | time (H:i:s)                                           |
+----------------+--------------------------------------------------------+
| date           | date (d.m.Y)                                           |
+----------------+--------------------------------------------------------+
| binary         | blob                                                   |
+----------------+--------------------------------------------------------+
| boolean        | smallint                                               |
+----------------+--------------------------------------------------------+

MS SQL
~~~~~~

+----------------+----------------------------+
| Tipo CakePHP   | Propiedades del Campo      |
+================+============================+
| primary\_key   | IDENTITY (1, 1) NOT NULL   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int                        |
+----------------+----------------------------+
| float          | numeric                    |
+----------------+----------------------------+
| datetime       | datetime (Y-m-d H:i:s)     |
+----------------+----------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)    |
+----------------+----------------------------+
| time           | datetime (H:i:s)           |
+----------------+----------------------------+
| date           | datetime (Y-m-d)           |
+----------------+----------------------------+
| binary         | image                      |
+----------------+----------------------------+
| boolean        | bit                        |
+----------------+----------------------------+

Oracle
~~~~~~

+----------------+-------------------------+
| Tipo CakePHP   | Propiedades del Campo   |
+================+=========================+
| primary\_key   | number NOT NULL         |
+----------------+-------------------------+
| string         | varchar2(255)           |
+----------------+-------------------------+
| text           | varchar2                |
+----------------+-------------------------+
| integer        | numeric                 |
+----------------+-------------------------+
| float          | float                   |
+----------------+-------------------------+
| datetime       | date (Y-m-d H:i:s)      |
+----------------+-------------------------+
| timestamp      | date (Y-m-d H:i:s)      |
+----------------+-------------------------+
| time           | date (H:i:s)            |
+----------------+-------------------------+
| date           | date (Y-m-d)            |
+----------------+-------------------------+
| binary         | bytea                   |
+----------------+-------------------------+
| boolean        | boolean                 |
+----------------+-------------------------+
| number         | numeric                 |
+----------------+-------------------------+
| inet           | inet                    |
+----------------+-------------------------+

PostgreSQL
~~~~~~~~~~

+----------------+---------------------------+
| Tipo CakePHP   | Propiedades del Campo     |
+================+===========================+
| primary\_key   | serial NOT NULL           |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | bytea                     |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+
| number         | numeric                   |
+----------------+---------------------------+
| inet           | inet                      |
+----------------+---------------------------+

SQLite
~~~~~~

+----------------+---------------------------+
| Tipo CakePHP   | Propiedades del Campo     |
+================+===========================+
| primary\_key   | integer primary key       |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | datetime (Y-m-d H:i:s)    |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | blob                      |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+

Sybase
~~~~~~

+----------------+-------------------------------------+
| Tipo CakePHP   | Propiedades del Campo               |
+================+=====================================+
| primary\_key   | numeric(9,0) IDENTITY PRIMARY KEY   |
+----------------+-------------------------------------+
| string         | varchar(255)                        |
+----------------+-------------------------------------+
| text           | text                                |
+----------------+-------------------------------------+
| integer        | int(11)                             |
+----------------+-------------------------------------+
| float          | float                               |
+----------------+-------------------------------------+
| datetime       | datetime (Y-m-d H:i:s)              |
+----------------+-------------------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)             |
+----------------+-------------------------------------+
| time           | datetime (H:i:s)                    |
+----------------+-------------------------------------+
| date           | datetime (Y-m-d)                    |
+----------------+-------------------------------------+
| binary         | image                               |
+----------------+-------------------------------------+
| boolean        | bit                                 |
+----------------+-------------------------------------+

Titulos
-------

Un objeto, en sentido físico, a menudo tiene un nombre o un título con
el que referirse. Una persona tiene un nombre como Juan o Ambrosio o
Colega. Una entrada de un blog tiene un título. Una categoría tiene un
nombre.

Al especificar el campo ``title`` (título) o ``name`` (nombre), CakePHP
automáticamente utilizará esta etiqueta en varias circunstancias:

-  `Scaffolding <https://en.wikipedia.org/wiki/Scaffold_(programming)>`_
   — títulos de páginas, etiquetas de *fieldset*
-  Listas - normalmente utilizado para los desplegables ``<select>``
-  TreeBehavior — reordenación, vistas de árbol

Si tienes un campo *title* *y* un campo *name* en tu tabla, el campo
*title* será el utilizado.

Creado y modificado ("created" y "modified")
--------------------------------------------

Al definir un campo ``created`` (creado) o ``modified`` (modificado) en
tu tabla de la base de datos como campo de tipo ``datetime``, CakePHP
reconocerá esos campos y los rellenará automaticamente cuando un
registro sea creado o grabado en la base de datos.

Los campos ``created`` y ``modified`` serán establecidos a la fecha y
hora actuales cuando el registro es inicialmente añadido. El campo
``modified`` será actualizado con la fecha y hora actuales cuando el
registro existente sea grabado.

Nota: Un campo llamado ``updated`` (actualizado) exhibirá el mismo
comportamiento que ``modified``. Estos campos necesitan ser del tipo
*datetime* con el valor por defecto establecido a NULL para ser
reconocidos por CakePHP.

Utilizando UUIDs como Claves Primarias
--------------------------------------

Las claves primarias son normalmente definidas como campos ``INT``. La
base de datos incrementará automáticamente el campo, comenzando en 1,
para cada nuevo registro que se añade. Alternativamente, si especificas
tu clave primaria como ``CHAR(36)``, CakePHP generará automáticamente
*`UUIDs <https://en.wikipedia.org/wiki/UUID>`_* (Identificadores Únicos
Universales) cuando son creados nuevos registros.

Un UUID es una cadena de 32 bytes separada por guiones, con un total de
36 caracteres. Por ejemplo:

::

    550e8400-e29b-41d4-a716-446655440000

Los UUIDs están diseñados para ser únicos, no sólo dentro de una tabla
dada, sino también a través de tablas y bases de datos. Si necesitas que
un campo permanezca único a través de sistemas, los UUIDs son un genial
enfoque.

Recuperando tus Datos
=====================

find
----

``find($tipo, $parametros)``

``$tipo`` es ``'all'``, ``'first'``, ``'count'``, ``'neighbors'``,
``'list'`` o ``'threaded'``. ``'first'`` es el tipo de búsqueda
predeterminado.

``$parametros`` es un array con cualquiera de las siguientes opciones
disponibles como claves:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //array de condiciones
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'Model.field2'), //array de nombres de campos
        'order' => 'Model.created', //string o array definiendo el orden
        'group' => array('Model.field'), //campos para GROUP BY
        'limit' => n, //int
        'page' => n //int
    )

Si estás utilizando ``find('list')``, la clave ``'fields'`` en
``$parametros`` define la clave, valor y grupo

::

    // la lista generada será indexada por Post.id, con valor de Post.title
    $this->Post->find('list', array('fields'=>'Post.title'));
     
    // la lista generada será indexada por Post.slug, con valor de Post.title
    $this->Post->find('list',
                      array(
                        'fields'=>array('Post.slug',
                                        'Post.title')
                           )
                     );
     
    // la lista generada será agrupada por Post.author_id, y cada grupo indexado por Post.id, con valor de Post.title
    $this->Post->find('list',
                      array(
                        'fields'=> array('Post.id',
                                         'Post.title',
                                         'Post.author_id')
                           )
                     );

Si estás utilizando ``find('neighbors')``, la clave ``'field'`` en
``$parametros`` define el campo a analizar, y la clave ``'value'`` en el
array ``$parametros`` define el valor a mirar para determinar el
siguiente y el anterior. Notar que las claves ``'field'`` y ``'value'``
no son usadas para ``find('all')`` y este es un caso especial para
``find('neighbors')``.

::

    // asumiendo que tenermos id's de 1 a 10, veremos <em>prev</em> establecido a 1 y <em>next</em> establecido a 3
    $this->Post->id = 2;
    $one = $this->Post->find('neighbors');
    // para obtener los datos vecinos utilizando un campo diferente...
    $two = $this->Post->find('neighbors',
                             array(
                               'field'=> 'Post.title',
                               'value'=> $data['Post']['title'])
                            );

Para compatibilidad hacia atraś, *find* también acepta la sintasix
previa:

``find(string $condiciones, array $campos, string $orden, int $recursivo)``

find('first')
~~~~~~~~~~~~~

``find('first', $params)``

'first' es el tipo find por defecto, y devolverá un solo resultado,
deberías utilizar esto para cualquier caso donde esperes solo un
resultado. Abajo hay un par de ejemplos simples (código del controlador
[controller]):

::

    function some_function() {
       ...
       $this->Article->order = null; // reseteando si ya ha sido inicializado
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulando el modelo teniendo un órden por defecto
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

En este primer ejemplo, ningún parámetro se le ha pasado a find - por lo
tanto ningún criterio de condición o de ordenamiento será utilizado. El
formato devuelto por la llamada a ``find('first')`` será de la siguiente
forma:

::

    Array
    (
        [ModelName] => Array
            (
                [id] => 83
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

        [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )
    )

No hay parámetros adicionales usador por ``find('first')``.

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)`` Devuelve un valor entero. Debajo hay un par
de ejemplos sencillos (código controlador):

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

No pasar campos como arrays a ``find('count')``. Podrías necesitar
campos específicos para DISTINCT count (de lo contrario, count es
siempre lo mismo - dictatado por las conditions (condiciones)).

No hay parámetros adicionales usados con ``find('count')``.

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')``\ devuelve un array de resultados(potentially multiple);
es, de hecho, el mecanismo usado por todas las variantes del método
``find()``, como por ejemplo para ``paginar``. Debajo puedes ver un par
de (código controlador) ejemplos:

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

El ejemplo de abajo ``$allAuthors`` busca todos los campos de la tabla
users, no se le han aplicado condiciones a find.

Los resultados de llamar a ``find('all')`` serán de la siguiente forma:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

            )
    )

Aquí no hay parámetros condicionales usados por ``find('all')``.

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)`` Devuelve un array indexado, útil para
cualquier uso donde podrías querer una lista como los polulares campos
select de los formularios. Debajo hay un par de simples ejemplos (código
controlador):

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('list');
       $pending = $this->Article->find('list', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('list');
       $allPublishedAuthors = $this->Article->User->find('list', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

En el ejemplo siguiente ``$allAuthors`` va a contener todos los usuarios
de la tabalo usuers, no se le aplica ninguna condición para filtrar la
búsqueda que lleva a cabo find.

Los resultado tras llamar al método ``find('list')`` tendrán el
siguiente aspecto:

::

    Array
    (
        //[id] => 'displayValue',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

Cuando ``find('list')`` es llamado, los ``parámetros`` pasados son
usados para determinar que debería ser usado como la key del array,
value y opcionalmente a que grupo pertenecen los resultados. Por defecto
la clave primaria para el modelo es usada por la key, y el valor que se
muestra es el usado por el value. Algunos ejemplos aclarará un poco más:

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username'));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name'));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group'));
       ...
    }

En el anterior ejemplo, el resultado devuelto se parecería a esto:

::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['Uber'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)``\ Devuelve un array anidado, y es apropiado
si quieres usar el campo ``parent_id`` de tu modelo de datos para
construir resultados anidados. Abajo se muestran un par de ejemplos
(código controlador):

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42)); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

No es necesario utilizar `el comportamiento en
árbol </es/view/91/Tree>`_ para usar este método, pero todos los
resultados deseados deben poderse encontrar en una sencilla consulta.

El anterior ejemplo, ``$allCategories`` contendría un array anidado
representando la estuctura entera de la categoría. El segundo ejemplo
hace uso de la estructura de datos `Tree behavior </es/view/91/Tree>`_
the return a partial, nested, result for ``$aCategory`` and everything
below it. The results of a call to ``find('threaded')`` will be of the
following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

El orden en el que aparecen los resultados puede ser cambiado como lo es
la influencia de la orden de procesamiento. Por ejemplo, si
``'order' => 'name ASC'`` es pasado en los parámetros a
``find('threaded')``, los resultados van a aparecer en orden según el
nombre. Del mismo modo cualquier orden puede ser usado, there is no
inbuilt requirement of this method for the top result to be returned
first.

No hay parámetros adicionales usados por ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' realiza una búsqueda similar a 'first', a diferencia que
devuelve el registro precedente y posterior del solicitado. A
continuación un (código en controlador) ejemplo:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

En este ejemplo podemos ver dos elementos esenciales del arreglo
``$params``: 'field' y 'value'. Además de estos, se pueden utilizar
otros elementos que se utilizan en las demás implementaciones del método
``find`` (Por ejemplo: Si tu modelo actúa como contenedor, deberías de
utilizar 'contain' en el arreglo ``$params``). El formato de salida para
una llamada ``find('neighbors')`` es de la siguiente forma:

::

    Array
    (
        [prev] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 151
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
        [next] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 4
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 122
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
    )

Note que el resultado siempre tendrá dos arreglos principales: prev y
next.

findAllBy
---------

``findAllBy<nombreCampo>(string $valor)``

Estas funciones mágias pueden ser usadas como atajos para buscar en tus
tablas por cierto campo. Simplemente añade el nombre del campo (en
formato *CamelCase*) al final del nombre de esas funciones
(*<nombreCampo>*) y proporciona los criterios para ese campo como primer
parámetro.

findBy
------

``findBy<nombreCampo>(string $valor)``

Estas funciones mágicas pueden ser usadas como atajo en la búsqueda en
tus tablas por cierto campo. Simplemente añade el nombre del campo (en
forma *CamelCase*) al final de las funciones (<nombreCampo>), y
proporciona los criterios para ese campo como primer parámetro.

+-----------------------------------------------+---------------------------------+
| Ejemplo findAllBy<x> en PHP5                  | Fragmento SQL Correspondiente   |
+===============================================+=================================+
| $this->Product->findAllByOrderStatus(‘3’);    | Product.order\_status = 3       |
+-----------------------------------------------+---------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);       | Recipe.type = ‘Cookie’          |
+-----------------------------------------------+---------------------------------+
| $this->User->findAllByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’    |
+-----------------------------------------------+---------------------------------+
| $this->Cake->findById(7);                     | Cake.id = 7                     |
+-----------------------------------------------+---------------------------------+
| $this->User->findByUserName(‘psychic’);       | User.user\_name = ‘psychic’     |
+-----------------------------------------------+---------------------------------+

Los usuarios de PHP4 han de utilizar esta función de manera un poco
diferente debido a cierto *case-insensitivity* en PHP4:

+-------------------------------------------------+---------------------------------+
| Ejemplo findAllBy<x> en PHP4                    | Fragmento SQL Correspondiente   |
+=================================================+=================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3       |
+-------------------------------------------------+---------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’          |
+-------------------------------------------------+---------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’    |
+-------------------------------------------------+---------------------------------+
| $this->Cake->findById(7);                       | Cake.id = 7                     |
+-------------------------------------------------+---------------------------------+
| $this->User->findByUser\_name(‘psychic’);       | User.user\_name = ‘psychic’     |
+-------------------------------------------------+---------------------------------+

El resultado devuelto es un array formateado tal y como sería en
``find()`` o ``findAll()``.

query
-----

``query(string $consulta)``

Se pueden realizar llamadas SQL personalizadas usando el método
``query()`` del modelo.

Si alguna vez usas consultas SQL personalizadas en tu aplicación, no
olvides leer la sección `Desinfección de
Datos </es/view/153/Sanitizaci%C3%B3n-de-Datos>`_ (*Sanitization*) de
CakePHP, la cual ayuda a limpiar datos de usuario de *injection* y
ataques de *cross-site scripting*.

``query()`` utiliza el nombre de la tabla en la consulta como clave del
array de datos devueltos, en vez del nombre del modelo. Por ejemplo:

::

    $this->Fotografia->query("SELECT * FROM fotografias LIMIT 2;");

debería devolver

::

    Array
    (
        [0] => Array
            (
                [fotografías] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [fotografías] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

Para usar el nombre del modelo como clave del array, y obtener un
resultado consistente con el devuelto por los métodos *Find*, la
consulta puede ser reescrita:

::

    $this->Fotografia->query("SELECT * FROM fotografia AS Fotografia LIMIT 2;");

la cual devuelve

::

    Array
    (
        [0] => Array
            (
                [Fotografia] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Fotografia] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

field
-----

``field(string $nombre, string $condiciones, string $orden)``

Devuelve el valor de un campo singular, especificado en ``$name``, del
primer registro que cumpla ``$condiciones`` estando ordenado por
``$orden``.

read()
------

``read($fields, $id)``

``read()`` es un método usado para establecer los datos del modelo
actual (``Model::$data``)--así también mientras se está editando--pero
también puede ser usado en otras circunstancias para obtener un solo
registro de la base de datos.

``$fields`` es usado para especificar un nombre de campo, como cadena, o
un arreglo de nombres de campo que serán incluidos en la consulta; si no
se especifica un valor, entonces todos los campos serán incluidos.

``$id`` especifica el ID de registro que será leído. Por defecto, el
registro actualmente seleccionado, especificado por ``Model::$id``, es
usado. Si se especifica un valor diferente a ``$id`` causará que el
registro que cumpla con la condición será seleccionado.

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // obtiene el <em>rating</em> del registro que será borrado.
       $name = $this->read('name', $id2); // obtiene el nombre un segundo registro.
       $rating = $this->read('rating'); // obtiene el <em>rating</em> del segundo registro
       $this->id = $id3; //
       $this->Article->read(); // lee un tercer registro, especificado por <code>$id3</code>.
       $record = $this->data // almacena el tercer registro en <code>$record</code>
       ...
    }

Notar que la tercera llamada a ``read()`` obtiene el *rating* del mismo
registro leído anteriormente por la llamada
``$this->read('name', $id2)``. Esto es porque ``read()`` cambia el valor
en ``Model::$id`` a cualquier valor pasado como ``$id``. Las lineas 6-8
demuestran como ``read()`` cambia los datos del modelo actual.

Condiciones Complejas de Búsqueda
---------------------------------

La mayoría de las llamadas de búsqueda del modelo involucran pasar
conjuntos de condiciones de una u otra manera. La aproximación más
simple a ello es utilizar la cláusula ``WHERE`` de SQL. Si ves que
necesitas más control, puedes utilizar arrays.

Usar arrays permite una lectura más clara y fácil, y también hace muy
fácil la construcción de consultas. Esta sintaxis también particiona los
elementos de tu consulta (campos, valores, operadores, etc.) en partes
discretas y manipulables. Esto permite a CakePHP generar la consulta más
eficiente posible, asegurar una sintaxis SQL apropiada, y formatear
apropiadamente cada parte individual de la consulta.

En su forma más básica, una consulta basada en array es así:

::

    $condiciones = array("Articulo.title" => "Esto es un artículo");
    // Ejemplo de uso con un modelo:
    $this->Articulo->find($condiciones);

La estructura aquí es bastante autoexplicativa: buscará cualquier
artículo donde el título sea igual a "Esto es un artículo". Notar que
podríamos haber utilizado como nombre de campo simplemente *'title'*,
pero cuando se construyen consultas es buena práctica especificar
siempre el nombre del modelo (en este caso, Articulo), ya que mejora la
claridad del código y ayuda a prevenir colisiones en el futuro, en cuyo
caso deberías modificar tu esquema de tablas.

¿Qué hay sobre otros tipos de condiciones? Estas son igualmente simples.
Digamos que queremos buscar todos los artículos donde el título no sea
'Esto no es un artículo':

::

    array("Articulo.title <>" => "Esto no es un artículo")

Notar el '<>' que está detrás del nombre del campo. CakePHP puede
analizar sintácticamente cualquier operador de comparación en SQL,
incluyendo las expresiones usando ``LIKE``, ``BETWEEN``, o ``REGEX``,
siempre y cuando dejes un espacio entre el nombre del campo y el
operador. La unica excepción aquí es la condición de búsqueda del tipo
``IN (...)``. Digamos que querías buscar artículos donde el título
estaba dentro de un conjunto dado de valores:

::

    array(
        "Articulo.title" => array("Primer artículo", "Segundo artículo", "Tercer artículo")
    )

Para realizar una búsqueda con condición ``NOT IN(...)`` para encontrar
artículos cuyo título no está en el conjunto de valores dado:

::

    array(
        "NOT" => array( "Articulo.title" => array("Primer artículo", "Segundo artículo", "Tercer artículo") )
    )

Añadir filtros adicionales a las condiciones es tan simple como añadir
pares clave/valor adicionales al array:

::

    array (
        "Articulo.title" => array("Primer artículo", "Segundo artículo", "Tercer artículo"),
        "Articulo.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

También puedes crear búsquedas que comparen dos campos en la base de
datos:

::

    array("Articulo.created = Articulo.modified")

Este ejemplo de arriba devolverá artículos en los cuales la fecha de
creación es igual a la fecha de modificación (p.e. devolverá artículos
que nunca han sido modificados).

Por defecto, CakePHP junta múltiples condiciones con *AND* booleano; es
decir, las condiciones de más arriba sólo coincidirán con artículos que
han sido creados en las últimas dos semanas (*-2 weeks*), y posean un
título que coincida con alguno de los dados en el conjunto ("Primer
artículo",...). No obstante, podemos igualmente buscar artículos que
coincidan con cualquiera de las condiciones:

::

    array(
       "or" => array (
          "Articulo.title" => array("Primer artículo", "Segundo artículo", "Tercer artículo"),
          "Articulo.created >" => date('Y-m-d', strtotime("-2 weeks"))
       )
    )

Cake acepta todas las operaciones booleanas de SQL válidas, incluyendo
*AND*, *OR*, *NOT*, *XOR*, etc..., y pueden estar en mayúsculas o
minúsculas, como prefieras. Estas condiciones son también infinitamente
anidables. Digamos que tienes una relación *belongsTo* entre Articulos y
Autores. Digamos que quieres buscar todos los artículos que contienen
una cierta palabra (p.e. "magico") o que han sido creados en las últimas
dos semanas, pero quieres restringir tu búsqueda a artículos escritos
por Pedro:

::

    array (
        "Autor.name" => "Pedro", 
        "or" => array (
            "Articulo.title LIKE" => "%magico%",
            "Articulo.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake también puede comprobar campos nulos (*null*). En este ejemplo, la
consulta devolverá registros en los que el título del artículo no es
nulo:

::

    array (
        "not" => array (
            "Articulo.title" => null,
        )
    )

Para manejar consultas con *BETWEEN*, puedes usar lo siguiente:

::

    array('Articulo.id BETWEEN ? AND ?' => array(1,10))

Nota: CakePHP entrecomillará los valores numéricos dependiendo del tipo
de campo definido en tu base de datos.

Puedes crear condiciones muy complejas anidando múltiples arrays de
condiciones:

::

    array(
       'OR' => array(
          array('Compania.name' => 'Emporio Futuro'),
          array('Compania.name' => 'Megatrabajos de Acero')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Compania.status' => 'activo'),
                'NOT'=>array(
                   array('Compania.status'=> array('inactivo', 'suspendido'))
                )
             )
         )
       )
    );

Las cuales producen el siguiente código SQL:

::

    SELECT `Compania`.`id`, `Compania`.`name`, 
    `Compania`.`description`, `Compania`.`location`, 
    `Compania`.`created`, `Compania`.`status`, `Compania`.`size`

    FROM
       `companias` AS `Compania`
    WHERE
       ((`Compania`.`name` = 'Emporio Futuro')
       OR
       (`Compania`.`name` = 'Megatrabajos de Acero'))
    AND
       ((`Compania`.`status` = 'activo')
       OR (NOT (`Compania`.`status` IN ('inactivo', 'suspendido'))))

Guardando Tus Datos
===================

CakePHP hace que el salvado de los datos del modelo sea instantáneo. Los
datos listos para ser salvados deberán ser pasados al método ``save()``
del modelo usando el formato básico siguiente:

::

    Array
    (
        [NombreModelo] => Array
            (
                [nombrecampo1] => 'valor'
                [nombrecampo2] => 'valor'
            )
    )

La mayoría de las veces no necesitarás preocuparte por este formato: los
ayudantes de CakePHP ``HtmlHelper``, ``FormHelper``, y métodos de
búsqueda empaquetan los datos en este formato. Si estás usando alguno de
los ayudantes, los datos también están convenientemente disponibles en
``$this->data`` para su uso rápido.

Aquí está un ejemplo rápido de una acción de un controlador que usa un
modelo de CakePHP para salvar datos en una tabla de una base de datos:

::

    function edit($id) {
        // Ha POSTeado algún formulario datos?
        if(!empty($this->data)) {
            // Si el formulario puede ser validado y salvado...
            if($this->Receta->save($this->data)) {
                // Establede un mensaje flash y redirige.
                $this->Session->setFlash("Receta guardada!");
                $this->redirect('/recetas');
            }
        }
     
        // Si no hay datos de formulario, busca la receta a editar y la pasa a la vista
        $this->set('receta', $this->Receta->findById($id));
    }

Una nota adicional: cuando se llama a ``save()``, los datos pasados a la
función como primer parámetro son validados usando el mecanismo de
validación de CakePHP (ver el capítulo de validación de
datos para más información). Si por alguna razón tus
datos no se graban, comprueba si alguna regla de validación se está
incumpliendo.

Hay unos pocos métodos relacionados con el salvado que encontrarás
útiles:

``save(array $datos = null, boolean $validar = true, array $listaCampos = array())``

Mostrado arriba, este método graba datos formateados en array. El
segundo parámetro (``$validar``) te permite eludir la validación, y el
tercero (``$listaCampos``) te permite proveer una lista de campos del
modelo a ser grabados. Como seguridad añadida, puedes limitar los campos
grabados a aquellos listados en ``$listaCampos``.

Una vez que un salvado ha sido completado, el identificador ID del
objeto se encuentra en el atributo ``$id`` del objeto del modelo (algo
especialmente útil cuando se crean nuevos objetos).

::

    $this->Ingrediente->save($datosNuevos);

    $nuevoIngredienteId = $this->Ingrediente->id;

Cuando se llama a ``save()`` en un bucle, no olvides llamar a
``create()``.

``create(array $datos = array())``

Este método resetea el estado del modelo para grabar nueva información.

Si se pasa el parámetro ``$datos`` (usando el formato de array descrito
arriba), la instancia del modelo estará lista para salvar con esos datos
(accesibles en ``$this->data``).

``saveField(string $nombreCampo, string $valorCampo, $validar = false)``

Usado para salvar un único valor de un campo. Establece el ID del modelo
(``$this->nombreModelo->id = $id``) antes de llamar a ``saveField()``.
Cuando usas este método, ``$nombreCampo`` debería contener sólo el
nombre del campo, no el nombre del modelo y campo.

Por ejemplo, para actualizar el título de una entrada de un blog, la
llamada a ``saveField`` desde un controlador debería parecerse a esto:

::

    $this->Entrada->saveField('titulo', 'Un Nuevo Título para un Nuevo Día');

``updateAll(array $campos, array $condiciones)``

Actualiza varios registros en una única llamada. Los registros a ser
actalizados están identificados por el array ``$conditions``, y los
campos a ser actualizados, así como sus valores, están identificados por
el array ``$fields``.

Por ejemplo, para aprobar a todos los panaderos que han sido miembros
durante más de un año, la llamada de actualización debería ser algo
como:

::

    $este_año = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Panadero->updateAll(
        array('Panadero.approved' => true),
        array('Panadero.created <=' => "$este_año")
    );

El array ``$campos`` acepta expresiones SQL. Los valores literales
deberían ser entrecomillados manualmente.

Por ejemplo, para cerrar todos los tickets que pertenecen a cierto
vendedor:

::

    $this->Ticket->updateAll(
        array('Ticket.estado' => "'cerrado'"),
        array('Ticket.vendedor_id' => 453)
    );

``saveAll(array $datos = null, array $opciones = array())``

Usado para salvar (a) múltiples registros individuales para un único
modelo o (b) este registro así como todos los registros asociados.

Para salvar múltiples registros de un único modelo, ``$data`` necesita
ser un array de registros indexado numéricamente como esto:

::

    Array
    (
        [0] => Array
            (
                [titulo] => titulo 1
            )
        [1] => Array
            (
                [titulo] => titulo 2
            )
    )

Para salvar un registro junto con su registro relacionado teniendo una
asociación ``hasOne`` o ``belognsTo``, el array de datos debería ser
como:

::

    Array
    (
        [Usuario] => Array
            (
                [nombreusuario] => billy
            )
        [Perfil] => Array
            (
                [sexo] => Varon
                [ocupacion] => Programador
            )
    )

Para salvar un registro junto con sus registros relacionados teniendo
una asociación hasMany, el array de datos debería ser como:

::

    Array
    (
        [Articulo] => Array
            (
                [titulo] => Mi primer artículo
            )
        [Comentario] => Array
            (
                [0] => Array
                    (
                        [comentario] => Comment 1
                [user_id] => 1
                    )
            [1] => Array
                    (
                        [comentario] => Comment 2
                [user_id] => 2
                    )
            )
    )

Guardando Datos de Modelos Relacionados (hasOne, hasMany, belongsTo)
--------------------------------------------------------------------

Cuando estamos trabajando con modelos asociados, es importante tener en
cuenta que al guardar los datos de un modelo hay que hacerlo con el
correspondiente modelo de CakePHP. Si estás guardando una nueva Entrada
y sus Comentarios asociados, entonces deberías usar ambos modelos,
Entrada y Comentario, durante la operación de guardado.

Si ninguno de los registros de los modelos asociados existe aún (por
ejemplo, quieres guardar registros de un nuevo Usuario y su Perfil
relacionado a la vez ), primero necesitarás guardar el modelo primario o
padre.

Para tener una idea de cómo funciona esto, imaginemos que tenemos una
acción en nuestro controlador de usuarios ``UsersController`` que maneja
el guardado de un nuevo usuario y su perfil correspondiente. En la
acción de ejemplo mostrada abajo se asumirá que has POSTeado suficientes
datos (usando el ``FormHelper``) para crear un solo Usuario y un solo
Perfil.

::

    <?php
    function add() {
        if (!empty($this->data)) {
            // Podemos guardar los datos de Usuario
            // deberían estar en: $this->data['Usuario']
            $this->Usuario->save($this->data);

            // El ID del nuevo Usuario está ahora en $this->User->id, así que lo
            // añadimos a los datos a grabar y grabamos el Perfil
            $this->data['Perfil']['usuario_id'] = $this->Usuario->id;

            // Como nuestro "Usuario hasOne Perfil", podemos acceder
            // al modelo Perfil a través del modelo Usuario
            $this->Usuario->Perfil->save($this->data);
        }
    }
    ?>

Como norma general, cuando trabajamos con asociaciones *hasOne*,
*hasMany* y *belongsTo* ('tiene un', 'tiene varios', y 'pertenece a'),
todo es cuestión de las claves. La idea básica es coger la clave de un
modelo y ponerla en el campo de clave foránea en el otro. A veces esto
puede implica usar el atributo ``$id`` de la clase del modelo después de
``save()``, pero otras veces podría simplemente implicar obtener el ID
desde un campo oculto de un formulario POSTeado a una acción del
controlador.

Para complementar el enfoque básico usado arriba, CakePHP también ofrece
el método muy útil ``saveAll``, el cual te permite validar y grabar
múltiples modelos de golpe. Además, ``saveAll`` provee de soporte
transaccional para asegurar la integridad de los datos en tu base de
datos (p.ej. si un modelo falla en la grabación, los otros modelos
tampoco serán grabados).

Para que las transacciones funcionen correctamente en MySQL, tus tablas
han de usar el mecanismo InnoDB. Recuerda que las tablas MyISAM no
soportan transacciones.

Veamos cómo podemos usar ``saveAll()`` para grabar modelos de Compañía
(utilizamos este nombre incorrecto por motivos didácticos) y Cuenta al
mismo tiempo.

Primero, necesitas construir tu formulario tanto para el modelo Compañía
como el modelo Cuenta (asumimos que Compañía *hasMany* Cuenta).

::

    echo $form->create(Compañía, array('action'=>'add'));
    echo $form->input('Compañía.nombre', array('label'=>'Nombre de compañía'));
    echo $form->input('Compañía.descripción');
    echo $form->input('Compañía.localización');

    echo $form->input('Cuenta.0.nombre', array('label'=>'Nombre de cuenta'));
    echo $form->input('Cuenta.0.nombreusuario');
    echo $form->input('Cuenta.0.email');

    echo $form->end('Añadir');

Echemos un vistazo a la manera en que hemos nombrado los campos del
formulario para el modelo Cuenta. Si Compañía es nuestro modelo
principal, ``saveAll`` esperará que los datos de los modelos
relacionados (en este caso, Cuenta) llegue en un formado específico, y
teniendo ``Cuenta.0.nombreCampo`` es exactamente lo que necesitamos.

El nombrado de campos de arriba es necesario para la asociación
*hasMany*. Si la asociación entre los modelos es *hasOne*, necesitarás
usar la notación ``NombreModelo.nombreCampo`` para el modelo asociado.

Ahora, en nuestro compañias\_controler.php podemos crear una acción
``add()``:

::

    function add() {
       if(!empty($this->data)) {
          $this->Compañia->saveAll($this->data, array('validate'=>'first'));
       }
    }

Esto es todo para ello. Ahora nuestros modelos Compañía y Cuenta serán
validados y grabados al mismo tiempo. Una cosa rápida que comentar aquí
es el uso de ``array('validate'=>'first')``: esa opción asegurará que
ambos modelos son validados.

counterCache - Cache your count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model itself
tracks any addition/deleting towards the associated ``$hasMany`` model
and increases/decreases a dedicated integer field within the parent
model table.

The name of the field consists of the singular model name followed by a
underscore and the word "count".

::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model called
``Image``, you would add a new INT-field to the ``image`` table and name
it ``image_comment_count``.

Here are some more examples:

+-------------+--------------------+---------------------------------------------+
| Model       | Associated Model   | Example                                     |
+=============+====================+=============================================+
| User        | Image              | users.image\_count                          |
+-------------+--------------------+---------------------------------------------+
| Image       | ImageComment       | images.image\_comment\_count                |
+-------------+--------------------+---------------------------------------------+
| BlogEntry   | BlogEntryComment   | blog\_entries.blog\_entry\_comment\_count   |
+-------------+--------------------+---------------------------------------------+

Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key and
set the value to ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

From now on, every time you add or remove a ``Image`` associated to
``ImageAlbum``, the number within ``image_count`` is adjusted
automatically.

If you need to specify a custom counter field, set counterCache to the
name of that field:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => 'number_of_images')
        );
    }

You can also specify ``counterScope``. It allows you to specify a simple
condition which tells the model when to update (or when not to,
depending on how you look at it) the counter value.

Using our Image model example, we can specify it like so:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // only count if "Image" is active = 1
        ));
    }

Guardando Datos de Modelos Relacionados (HABTM)
-----------------------------------------------

Grabar modelos que están asociados por *hasOne*, *belongsTo* y *hasMany*
es bastante simple: simplemente rellenas el campo de clave foránea con
el ID del modelo asociado. Una vez que está hecho, simplemente llamas al
método ``save()`` del modelo y todo queda enlazado correctamente.

Con HABTM (*Has And Belongs To Many*), necesitas establecer el ID del
modelo asociado en tu array de datos. Construiremos un formulario que
crea una nueva etiqueta y la asocia al vuelo con alguna receta.

El formulario más simple debería parecerse al algo como esto (asumimos
que ``$receta_id`` ya está establecido a algo):

::

    <?php
        echo $form->create('Etiqueta');
        echo $form->input('Receta.id', array('type'=>'hidden', 'value' => $receta_id));
        echo $form->input('Etiqueta.nombre');
        echo $form->end('Añadir etiqueta');
    ?>

En este ejemplo, puedes ver el campo oculto ``Receta.id`` cuyo valor se
establece al ID de la receta a la que queremos enlazar la etiqueta. La
acción del controlador que se encarga de guardar este formulario es muy
simple:

::

    function add() {
        // Graba la asociación
        if ($this->Etiqueta->save($this->data)) {
            // Hacer algo si todo fue bien
        }
    }

Y de esa manera, nuestra nueva Etiqueta es creada y asociada con Receta,
cuyo ID estaba en $this->data['Receta']['id'].

Borrando Datos
==============

Estos métodos pueden ser usados para eliminar datos.

del
---

``del(int $id = null, boolean $cascada = true);``

Borra el registro identificado por ``$id``. Por defecto, también borra
los registros dependientes del registro especificado a ser borrado.

Por ejemplo, cuando se borra un registro ``Usuario`` que está ligado a
varios registros ``Receta``:

-  si ``$cascada`` está establecido a ``true``, los registros ``Receta``
   relacionados también son borrados si el valor de ``dependent`` (ver
   la sección `hasMany </es/view/82/hasMany>`_) en el modelo está
   establecida a ``true``.
-  si ``$cascada`` está establecido a ``false``, los registros
   ``Receta`` permanecerán después de que el ``Usuario`` haya sido
   borrado.

remove
------

``remove(int $id = null, boolean $cascada = true);``

Un sinónimo de ``del()``.

deleteAll
---------

``deleteAll(mixed $condiciones, $cascada = true, $callbacks = false)``

De la misma manera que ``delete()`` y ``remove()``, excepto que
``deleteAll()`` borra todos los registros que cumplen las condiciones
dadas. El array ``$condiciones`` debería ser pasado como un fragmento
SQL o array.

Asociaciones: Enlazando Modelos
===============================

Una de las características más potentes de CakePHP es la habilidad para
enlazar el mapeado relacional proporcionado por el modelo. En CakePHP,
los enlaces entre modelos son manejados mediante asociaciones.

Definir relaciones entre diferentes objetos en tu aplicación debería ser
un proceso natural. Por ejemplo, en una base de datos de recetas, una
receta puede tener varias revisiones, las revisiones tienen un único
autor, y los autores pueden tener varias recetas. El definir la manera
en que funcionan estas relaciones te permite acceder a tus datos de
manera intuitiva y potente.

El propósito de esta sección es mostrarte cómo diseñar, definir y
utilizar asociaciones entre modelos en CakePHP.

Mientras que los datos pueden provenir de una variedad de orígenes, la
formá más común de almacenamiento en aplicaciones web es una base de
datos relacional. La mayoría de cosas que cubre esta sección estará en
ese contexto.

Para obtener información sobre asociaciones con modelos de Plugin, ver
:doc:`/The-Manual/Developing-with-CakePHP/Plugins`.

Tipos de Relaciones
-------------------

Los cuatro tipos de relaciones en CakePHP son: *hasOne*, *hasMany*,
*belongsTo* y *hasAndBelongsToMany* (HABTM), "tiene un", "tiene muchos",
"pertenece a" y "tiene y pertenece a muchos", respectivamente.

+-------------------+--------------------------------------------------------+--------------------------------------------------------------+
| Relación          | Tipo de Asociación                                     | Ejemplo                                                      |
+===================+========================================================+==============================================================+
| uno a uno         | *hasOne* ("tiene un")                                  | Un usuario tiene un perfil.                                  |
+-------------------+--------------------------------------------------------+--------------------------------------------------------------+
| uno a muchos      | *hasMany* ("tiene muchos")                             | Los usuarios en un sistema pueden tener múltiples recetas.   |
+-------------------+--------------------------------------------------------+--------------------------------------------------------------+
| muchos a uno      | *belongsTo* ("pertenece a")                            | Una receta pertenece a un usuario.                           |
+-------------------+--------------------------------------------------------+--------------------------------------------------------------+
| muchos a muchos   | *hasAndBelongsToMany* ("tiene y pertenece a muchos")   | Las recetas tienen, y pertenecen, a muchas etiquetas.        |
+-------------------+--------------------------------------------------------+--------------------------------------------------------------+

Las asociaciones son definidas creando una variable de clase nombrada
tras la asociación que estás definiendo. La variable de clase puede, a
veces, ser tan simple como una cadena de caracteres, pero puede ser tan
completa como un array multidimensional usado para definir asociaciones
concretas.

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';
        var $hasOne = 'Perfil';
        var $hasMany = array(
            'Receta' => array(
                'className'  => 'Receta',
                'conditions' => array('Receta.aprobada' => '1'),
                'order'      => 'Receta.created DESC'
            )
        );
    }
    ?>

En el ejemplo de arriba, la primera instancia de la palabra 'Receta' es
lo que se llama un 'Alias'. Este es un identificador para la relación y
puede ser cualquier cosa que escojas. Normalmente, escogerás el mismo
nombre que la clase que referencia. De todos modos, los alias han de ser
únicos dentro de un modelo dado y en ambas partes de una relación
*belongsTo*/*hasMany* o *belongsTo/hasOne*. Escoger nombres no únicos
para alias puede causar comportamientos inesperados.

hasOne
------

Configuremos un modelo Usuario con una relación *hasOne* con un modelo
Perfil.

Primero, necesitas establecer las claves de tus tablas de base de datos
correctamente. Para que funcione una relación *hasOne* correctamente,
una tabla ha de contener una clave foránea que apunte a un registro en
la otra. En este caso, la tabla 'perfiles' contendrá un campo llamado
``usuario_id``. El patrón básico es:

+--------------------------+------------------------+
| Relación                 | Esquema                |
+==========================+========================+
| Manzana hasOne Plátano   | plananos.manzana\_id   |
+--------------------------+------------------------+
| Usuario hasOne Perfil    | perfiles.usuario\_id   |
+--------------------------+------------------------+
| Doctor hasOne Mentor     | mentores.doctor\_id    |
+--------------------------+------------------------+

Table: **hasOne:** el *otro* modelo contiene la clave foránea.

El archivo del modelo Usuario será grabado en /app/models/usuario.php.
Para definir la asociación 'Usuario *hasOne* Perfil', añade la propiedad
``$hasOne`` a la clase del modelo. Recuerda tener un modelo Perfil en
/app/models/perfil.php, o la asociación no funcionará.

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';
        var $hasOne = 'Perfil';   
    }
    ?>

Hay dos manera de describir esta relación en tus archivos del modelo. La
manera más simple es establecer el atributo ``$hasOne`` a una cadena de
caracteres conteniendo el nombre de la clase del modelo asociado, como
hemos hecho arriba.

Si necesitas más control, puedes definir tus asociaciones utilizando
sintaxis de arrays. Por ejemplo, podrías desear limitar la asociación
para incluir sólo ciertos registros.

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';          
        var $hasOne = array(
            'Perfil' => array(
                'className'    => 'Perfil',
                'conditions'   => array('Perfil.publicado' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

Las claves posibles para los arrays de asociaciones *hasOne* incluyen:

-  **className**: el nombre de la clase del modelo que está siendo
   asociado al modelo actual. si estás definiendo una relación 'Usuario
   *hasOne* Perfil', la clave ``className`` debería ser igual a
   'Perfil'.
-  **foreignKey**: el nombre de la clave foránea que se encuentra en el
   otro modelo. Esto es especialmente útil si necesitas definir
   múltiples relaciones *hasOne*. El valor por defecto para esta clave
   es el nombre en singular del modelo actual, seguido del sufijo
   '\_id'. En el ejemplo de arriba, debería ser por defecto
   'usuario\_id'.
-  **conditions**: Un fragmento SQL usado para filtrar registros del
   modelo relacionado. Es buena práctica usar nombres de modelos en los
   fragmentos SQL: 'Perfil.aprobado = 1' siempre es mejor que
   simplemente 'aprobado = 1'.
-  **fields**: Una lista de campos a ser devueltos cuando se traen los
   datos del modelo asociado. Por defecto devuelve todos los campos.
-  **dependent**: Cuando la clave ``dependent`` se establece a ``true``,
   y el método ``delete()`` del modelo es llamado con el parámetro
   ``$cascada`` con valor ``true``, los registros del modelo asociado
   también son borrados. En este caso lo ponemos a ``true`` de manera
   que borrando un Usuario también borrará su Perfil asociado.

Una vez que esta asociación ha sido definida, las operaciones de
búsqueda en el modelo usuario traerán también el registro Perfil
relacionado si existe:

::

    // Resultados de ejemplo de una llamada a $this->Usuario->find()
    Array
    (
        [Usuario] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Perfil] => Array
            (
                [id] => 12
                [user_id] => 121
                [habilidad] => Hornear Pasteles
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Ahora que tenemos acceso a los datos de Perfil desde el modelo Usuario,
definamos la asociación *belongsTo* (perteneceA) en el modelo Pefil para
tener acceso a los datos de Usario relacionados. La asociación
*belongsTo* es un complemento natural a las asociaciones *hasOne*
(tieneUn) y *hasMany* (tieneMuchos): nos permite ver los datos de la
otra dirección.

A la hora de establecer las claves de las tablas de tu base de datos
para una relación *belongsTo*, sigue estas convenciones:

+-----------------------------+-------------------------+
| Relación                    | Esquema                 |
+=============================+=========================+
| Platano belongsTo Manzana   | platanos.manzana\_id    |
+-----------------------------+-------------------------+
| Perfil belongsTo Usuario    | perfiles.usuarios\_id   |
+-----------------------------+-------------------------+
| Mentor belongsTo Doctor     | mentores.doctores\_id   |
+-----------------------------+-------------------------+

Table: ***belongsTo*:** el modelo **actual** contiene la clave foránea.

Si un modelo (tabla) contiene una clave foránea, "perteneceA"
(*belongsTo*) el otro modelo (tabla).

Podemos definir la asociación *belongsTo* en nuestro modelo Perfil en
/app/models/perfil.php usando la sintaxis de cadena de caracteres así:

::

    <?php
    class Perfil extends AppModel {
        var $name = 'Perfil';                
        var $belongsTo = 'Usuario';   
    }
    ?>

También podemos definir una relación más específica usando sintaxis de
arrays:

::

    <?php
    class Perfil extends AppModel {
        var $name = 'Perfil';
        var $belongsTo = array(
            'Usuario' => array(
                'className'    => 'Usuario',
                'foreignKey'   => 'usuario_id'
            )
        );  
    }
    ?>

Claves posibles para los arrays de la asociación *belongsTo* son:

-  **className**: el nombre de la clase del modelo que se está asociando
   al modelo actual. Si estás definiendo una relación 'Perfil
   *belongsTo* Usuario', la clave ``className`` ha de tener el valor
   'Usuario'.
-  **foreignKey**: el nombre de la clave foránea que se encuentra en el
   modelo actual. Esto es especialmente útil si necesitas definir
   múltiples relaciones *belongsTo*. El valor por defecto de esta clave
   es el nombre en singular del otro modelo (separado por guiones de
   subrayado) con el sufijo '\_id'.
-  **conditions**: el fragmento SQL filtra los registros del modelo
   relacionado. Es buena práctica usar el nombre de los modelos en los
   fragmentos SQL: ``'Usuario.activo = 1'`` siempre es mejor que
   simplemente ``'activo = 1'``.
-  **fields**: lista de campos a ser recuperados cuando los datos del
   modelo asociado se traen de la base de datos. Por defecto devuelve
   todos los campos.
-  **counterCache**: (booleano) si se establece a ``true``, el modelo
   asociado automáticamente incrementará o decrementará el campo
   ``'[nombre_modelo_en_singular]_count'`` de la tabla foránea siempre
   que hagas un ``save()`` o ``delete()`` (ver
   `counterCache </es/view/490/counterCache-Cachea-tu-count>`_). El
   valor en el campo contador representa el número de filas
   relacionadas.

Una vez que esta asociación ha sido definida, las operaciones de
búsqueda en el modelo Perfil también traerán el registro de Usuario
relacionado si existe:

::

    // Resultados de ejemplo de la llamada a $this->Perfil->find().
    Array
    (
       [Perfil] => Array
            (
                [id] => 12
                [usuario_id] => 121
                [habilidad] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [Usuario] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Siguiente paso: definiendo una asociación "Usuario *hasMany*
Comentario". Una asociación *hasMany* (tieneMuchos) nos permitirá traer
los comentarios del usuario cuando se trae un registro Usuario.

A la hora de establecer las claves de las tablas de tu base de datos
para una relación *hasMany*, sigue estas convenciones:

***hasMany*:** el **otro** modelo contiene la clave foránea.

Relación

Esquema

Usuario *hasMany* Comentario

comentarios.usuario\_id

Cake *hasMany* Virtud

virtudes.cake\_id

Producto *hasMany* Opcion

opciones.producto\_id

Podemos definir la asociación *hasMany* en nuestro modelo Usuario en
/app/models/usuario.php usando la sintaxis de cadena de caracteres así:

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';                
        var $hasMany = 'Comentario';   
    }
    ?>

También podemos definir una relación más específica usando sintaxis de
arrays:

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';                
        var $hasMany = array(
            'Comentario' => array(
                'className'     => 'Comentario',
                'foreignKey'    => 'usuario_id',
                'conditions'    => array('Comentario.estado' => '1'),
                'order'    => 'Comentario.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

Las claves posibles para los arrays de la asociación *hasMany* son:

-  **className**: el nombre de la clase del modelo que está siendo
   relacionado con el modelo actual. Si estás definiendo una relación
   'Usuario *hasMany* Comentario', el valor de ``clasName`` ha de ser
   'Comentario'.
-  **foreignKey**: el nombre de la clave foránea en el otro modelo. Esto
   es especialmente útil si necesitas definir múltiples relaciones
   *hasMany*. El valor por defecto para esta clave es el nombre en
   singular del otro modelo (separado por guiones de subrayado), con el
   sufijo '\_id'.
-  **conditions**: un fragmento SQL filtra los registros del modelo
   relacionado. Es buena práctica usar el nombre de los modelos en los
   fragmentos SQL: ``'Usuario.activo = 1'`` siempre es mejor que
   simplemente ``'activo = 1'``.
-  **fields**: lista de campos a ser recuperados cuando los datos del
   modelo asociado se traen de la base de datos. Por defecto devuelve
   todos los campos.
-  **order**: un fragmento SQL que define el orden de las filas
   asociadas devueltas.
-  **limit**: el número máximo de filas asociadas que quieres que
   devuelva.
-  **offset**: el número de filas asociadas que quieres saltarte (dadas
   las condiciones y orden actuales) antes de traer las filas y
   asociarlas.
-  **dependent**: Cuando ``dependent`` se establece a ``true``, es
   posible el borrado recursivo del modelo. En este ejemplo, los
   registros Comentario serán borrados cuando sus registros Usuario
   asociados han sido borrados.

   El segundo parámetro del método ``Modelo->delete()`` ha de
   establecerse a ``true`` para que ocurra un borrado recursivo.

-  **finderQuery**: Una consulta SQL completa que CakePHP puede usar
   para traer los registros del modelo asociado. Esto debería ser usado
   en situaciones que requieren unos resultados muy personalizados.

Una vez que esta asociación ha sido definida, las operaciones de
búsqueda en el modelo Usuario también traerán los registros Comentario
relacionados si existen:

::

    // Resultados de ejemplo de llamada a $this->Usuario->find().
    Array
    (  
        [Usuario] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comentario] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [usuario_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [cuerpo] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [usuario_id] => 121
                        [title] => More on Gwoo
                        [cuerpo] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

Algo a recordar es que necesitarás la asociación complementaria
'Comentario *belongsTo* Usuario' para obtener los datos en ambas
direcciones. Lo que hemos esbozado en esta sección te permite obtener
datos de Comentario desde Usuario. Añadir la asociación 'Comentario
*belongsTo* Usuario' en el modelo comentario te permite obtener los
datos de Usuario desde el modelo Comentario, completando la conexión y
permitiendo el flujo de la información desde ambas perspectivas del
modelo.

hasAndBelongsToMany (HABTM)
---------------------------

Perfecto. En este punto puedes llamarte "profesional de asociaciones del
modelo de CakePHP". Ya estás versado en tres de las asociaciones que
tratan la mayoría de las relaciones de objetos.

Tratemos el último tipo de relación: *hasAndBelongsToMany*
(tieneYPerteneceAMuchos), o *HABTM*. Esta asociación es usada cuando
tienes dos modelos que necesitas unir, repetidamente, muchas veces, de
muchas maneras distintas.

La principal diferencia entre *hasMany* y *HABTM* es que un enlace entre
modelos en *HABTM* no es exclusivo. Por ejemplo, vamos a unir nuestro
modelo Receta con un modelo Etiqueta usando *HABTM*. Atando la etiqueta
'Italiano' a la receta 'Gnocci' de mi abuela no 'acapara' la etiqueta;
también puedo etiquetar con 'Italiano' mis 'Espaguettis a la barbacoa
con miel glaseada".

Los enlaces entre objetos asociados mediante *hasMany* son exclusivos.
Si mi 'Usuario *hasMany* Comentarios', un comentario está sólo enlazado
a un usuario específico. Deja de estar disponible para todos.

Andando. Necesitaremos establecer una tabla extra en la base de datos
para manejar las asociaciones *HABTM*. El nombre de esta nueva tabla de
unión necesita incluir los nombres de ambos modelos involucrados en
plural, en orden alfabético, y separados por un guión de subrayado ( \_
). El esquema de la tabla debería contener como mínimo dos campos, cada
uno clave foránea (que deberían ser enteros) apuntando a ambas claves
primarias de los modelos involucrados.

***HABTM*** necesita una tabla de unión separada que incluya los nombres
de ambos modelos.

+---------------------------+----------------------------------------------------------------------+
| Relación                  | Esquema                                                              |
+===========================+======================================================================+
| Receta *HABTM* Etiqueta   | id, etiquetas\_recetas.receta\_id, etiquetas\_recetas.etiqueta\_id   |
+---------------------------+----------------------------------------------------------------------+
| Cake *HABTM* Fan          | id, cakes\_fans.cake\_id, cakes\_fans.fan\_id                        |
+---------------------------+----------------------------------------------------------------------+
| Foo *HABTM* Bar           | id, bars\_foos.foo\_id, bars\_foos.bar\_id                           |
+---------------------------+----------------------------------------------------------------------+

Los nombres de las tablas están, por convención, en orden alfabético.

Una vez que esta nueva tabla ha sido creada, podemos definir las
asociaciones *HABTM* en los ficheros del modelo. Vamos a saltar
directamente a la sintaxis de arrays esta vez:

::

    <?php
    class Receta extends AppModel {
        var $name = 'Receta';   
        var $hasAndBelongsToMany = array(
            'Etiqueta' =>
                array('className'            => 'Etiqueta',
                     'joinTable'              => 'etiquetas_recetas',
                     'foreignKey'             => 'receta_id',
                     'associationForeignKey'  => 'etiqueta_id',
                    'with'                   => '',
                    'conditions'             => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'unique'                 => true,
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
            );             
    }
    ?>

Claves posibles para los arrays de asociaciones *HABTM* son:

-  **className**: el nombre de la clase del modelo que se está asociando
   al modelo actual. Si estás definiendo una relación 'Usuario
   *hasAndBelongsToMany* Comentarios', ``className`` debería ser igual a
   'Comentario'.
-  **joinTable**: el nombre de la tabla de unión usuada en esta
   asociación (si si la tabla actual no se adhiere a la convención de
   nombrado para tablas de unión *HABTM*).
-  **foreignKey**: el nombre de la clave foránea que se encuentra en el
   modelo actual. Esto es especialmente útil si necesitas definir
   múltiples relaciones *HABTM*. El valor por defecto para esta clave es
   el nombre en singular, separado por guiones de subrayado (\_), del
   modelo actual con el sufijo '\_id'.
-  **associationForeignKey**: el nombre de la clave foránea que se
   encuentra en el otro modelo. Esto es especialmente útil si necesitas
   definir múltiples relaciones *HABTM*. El valor por defecto para esta
   clave es el nombre en singular, separado por guiones de subrayado
   (\_), del modelo actual con el sufijo '\_id'.
-  **with**: define el nombre del modelo para la tabla de unión. Por
   defecto, CakePHP autocreará un modelo por ti. Usando el ejemplo de
   arriba, se llamaría EtiquetaReceta. Usando esta clave puedes
   sustituir este nombre por defecto. El modelo de la tabla de unión
   puede ser usado como cualquier modelo 'regular' para acceder a la
   tabla de unión directamente
-  **conditions**: fragmento SQL usado para filtrar registros del modelo
   relacionado. Es buena práctica usar nombres de modelos en los
   fragmentos SQL: 'Comentario.estado = 1' siempre es preferible a
   simplemente 'estado = 1'.
-  **fields**: lista de campos a ser devueltos cuando los datos del
   modelo asociado son traídos. Devuelve todos los campos por defecto.
-  **order**: fragmento SQL que define el orden de las filas asociadas
   devueltas.
-  **limit**: el número máximo de filas asociadas que deseas que sean
   devueltas.
-  **unique**: si tiene el valor ``true`` (valor por defecto) Cake
   borrará primero los registros de relación existentes en la tabla de
   claves foráneas antes de insertar nuevas filas, cuando se actualiza
   un registro. Así, las asociaciones existentes deberán ser pasadas de
   nuevo durante las actualizaciones.
-  **offset**: el número de filas asociadas que omitir (dadas las
   condiciones actuales y orden) antes de buscar y asociar.
-  **finderQuery, deleteQuery, insertQuery**: una consulta SQL completa
   que CakePHP puede usar para buscar, borrar o crear nuevos registros
   del modelo asociado. Esto debería ser usado en situaciones que
   requieren resultados muy personalizados.

Una vez que esta asociación ha sido definida, las operaciones de
búsqueda en el modelo Receta también devolverán los registros Etiqueta
relacionados si existen:

::

    // Resultados de ejemplo de una llamada a $this->Receta->find().

    Array
    (  
        [Receta] => Array
            (
                [id] => 2745
                [name] => Bombas de Cholocate con Azúcar Glaseada
                [created] => 2007-05-01 10:31:01
                [usuario_id] => 2346
            )
        [Etiqueta] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Desayuno
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Postre
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Enfermedad del Corazón
                    )
            )
    )

Recuerda definir una asociación *HABTM* en el modelo Etiqueta si quieres
traer datos de Receta cuando uses el modelo Etiqueta.

También es posible ejecutar consultas de búsqueda personalizadas basadas
en relaciones *HABTM*. Considera los ejemplos siguientes:

Asumiendo la misma estructura en el ejemplo de arriba (Receta *HABTM*
Etiqueta), digamos que queremos obtener todas las Recetas con la
etiqueta 'Postre', una manera potencial (pero errónea) de conseguirlo
sería aplicar una condición a la misma asociación:

::

    $this->Receta->bindModel(array(
                  'hasAndBelongsToMany' => array(
                                   'Etiqueta' => array(
                                           'conditions'=>array('Etiqueta.name'=>'Postre') )
                                                )
                                  )
                            );
    $this->Receta->find('all');

::

    // Datos devueltos
    Array
    (  
        0 => Array
            {
            [Receta] => Array
                (
                    [id] => 2745
                    [name] => Bombas de Cholocate con Azúcar Glaseada
                    [created] => 2007-05-01 10:31:01
                    [usuario_id] => 2346
                )
            [Etiqueta] => Array
                (
                   [0] => Array
                        (
                            [id] => 124
                            [name] => Postre
                        )
                )
        )
        1 => Array
            {
            [Receta] => Array
                (
                    [id] => 2745
                    [name] => Pasteles de Cangrejo
                    [created] => 2008-05-01 10:31:01
                    [usuario_id] => 2349
                )
            [Etiqueta] => Array
                (
                }
            }
    }

Notar que este ejemplo devuelve TODAS las recetas pero sólo la etiqueta
'Postre'. Para conseguir nuestro objetivo adecuadamente, hay diversas
maneras de hacerlo. Una opción es buscar en el modelo Etiqueta (en vez
de Receta), lo que nos dará también todas las Recetas asociadas.

::

    $this->Receta->Tag->find('all', array('conditions'=>array('Etiqueta.name'=>'Postre')));

Podríamos también usar el modelo de tabla de unión (que CakePHP nos
provee), para buscar por un ID dado.

::

    $this->Receta->bindModel(array('hasOne' => array('EtiquetaReceta')));
    $this->Receta->find('all', array(
                                     'fields' => array('Receta.*'),
                                     'conditions'=>array('EtiquetaReceta.etiqueta_id'=>124) // id de Postre
    ));

También es posible crear una asociación exótica con el propósito de
crear tantas uniones como necesarias para permitir el filtrado, por
ejemplo:

::

    $this->Receta->bindModel(
               array(
                     'hasOne' => array(
                         'EtiquetaReceta',
                         'EtiquetaFiltro' => array(
                                    'className' => 'Tag',
                                    'foreignKey' => false,
                                    'conditions' => array('EtiquetaFiltro.id = EtiquetaReceta.id')
                                              )
                                      )
                    )
            );

    $this->Receta->find('all', array(
                                   'fields' => array('Receta.*'),
                                   'conditions'=>array('EtiquetaReceta.name'=>'Postre')
    ));

Ambos devolverán los siguientes datos:

::

    // Datos devueltos
    Array
    (  
        0 => Array
            {
            [Receta] => Array
                (
                    [id] => 2745
                    [name] => Bombas de Cholocate con Azúcar Glaseada
                    [created] => 2007-05-01 10:31:01
                    [usuario_id] => 2346
                )
        [Etiqueta] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Desayuno
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Postre
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Enfermedad del corazón
                    )
            )
    }

Para más información sobre asociaciones de modelo ligadas al vuelo mira
`Creando y Destruyendo Asociaciones al Vuelo </es/view/86/>`_

Mezcla y encaja técnicas para conseguir tu objetivo específico.

Creando y Destruyendo Asociaciones al Vuelo
-------------------------------------------

Algunas veces es necesario crear y destruir asociaciones del modelo al
vuelo. Esto puede ser por varias razones:

-  Quieres reducir la cantidad de datos asociados buscados, pero todas
   tus asociaciones están en el primer nivel de recursión.
-  Deseas cambiar la manera en que la asociación está definida para
   ordenar o filtar los datos asociados.

Esta creación y destrucción de asociaciones se realiza usando los
métodos del modelo de CakePHP ``bindModel()`` y ``unbindModel()``.
También hay un comportamiento muy útil llamado *'Containable'*, mirar la
sección del manual sobre comportamientos empotrados para más
información. Establezcamos unos pocos modelos para que podamos ver cómo
funcionan ``bindModel()`` y ``unbindModel()``. Empezaremos con dos
modelos:

::

    <?php
    class Lider extends AppModel {
        var $name = 'Lider';
     
        var $hasMany = array(
            'Seguidor' => array(
                'className' => 'Seguidor',
                'order'     => 'Seguidor.rango'
            )
        );
    }

    ?>

    <?php

    class Seguidor extends AppModel {
        var $name = 'Seguidor';
    }

    ?>

Ahora, en el ``LideresController`` podemos usar el método ``find()`` en
el modelo Lider para obtener un lider y sus seguidores asociados. Como
puedes ver arriba, el array de asociación en el modelo Lider define una
relación 'Lider *hasMany* Seguidores'. Por motivos demostrativos, usemos
``unbindModel()`` para eliminar esa asociación en una acción de un
controlador

::

    function algunaAccion() {
        // Esto obtiene Lideres, y sus Seguidores asociados
        $this->Lider->findAll();
      
        // Eliminemos el hasMany...
        $this->Lider->unbindModel(
            array('hasMany' => array('Seguidor'))
        );
      
        // Ahora usar una funcion find devolverá 
        // Lideres, sin Seguidores
        $this->Lider->findAll();
      
        // NOTE: unbindModel sólo afecta la siguiente función
        // function. Una llamada adicional a find usará la 
        // información de la asociación configurada.
      
        // Hemos uado findAll() tras unbindModel(), 
        // así que esto obtendrá Lideres con Seguidores asociados
        // una vez más...
        $this->Lider->findAll();
    }

Eliminar o añadir asociaciones usando ``bind-`` y ``unbindModel()`` sólo
funciona para la operación del modelo ``next()`` a menos que el segundo
parámetro haya sido establecido a ``false``. Si el segundo parámetro ha
sido establecido a ``false``, la unión se mantiene para el resto de la
petición.

Aquí está el patrón básico de uso para ``unbindModel()``:

::

    $this->Modelo->unbindModel(
        array('tipoAsociacion' => array('nombreDeClaseDelModeloAsociado'))
    );

Ahora que hemos eliminado satisfactoriamente una asociación al vuelo,
añadamos otra. Nuestro Lider 'sin todavía' principios necesita algunos
Principios asociados. El fichero del modelo para nuestro modelo
Principio está vacío, excepto por la declaración ``var $name``.
Asociemos algunos Principios a nuestro Lider al vuelo (pero recuerda,
sólo para la siguiente operación de búsqueda). Esta función aparece en
LiderController:

::

    function otraAccion() {
        // No hay 'Lider hasMany Principio' en 
        // el fichero de modelo lider.php, asi que una búsqueda
        // aquí sólo obtiene Lideres.
        $this->Lider->findAll();
     
        // Usemod bindModel() para añadir una nueva asociación
        // al modelo Lider:
        $this->Lider->bindModel(
            array('hasMany' => array(
                    'Principio' => array(
                        'className' => 'Principio'
                    )
                )
            )
        );
     
        // Ahora que hemos asociado correctamente,
        // podemos usar una función de búsqueda para obtener
        // Lideres con sus principios asociados:
        $this->Lider->findAll();
    }

Ahí lo tienes. El uso básico para ``bindModel()`` es la encapsulación de
un array normal de asociación dentro de un array cuya clave es nombrada
tras el tipo de asociación que estás tratando de crear:

::

    $this->Modelo->bindModel(
            array('nombreAsociacion' => array(
                    'nombreDeClaseDelModeloAsociado' => array(
                        // claves de asociacion normales van aquí...
                    )
                )
            )
        );

A pesar de que el nuevo modelo unido no necesita ningún tipo de
asociación en la definición de su fichero de modelo, todavía necesitará
tener la clave correcta para que la nueva asociación funcione
correctamente.

Multiples relaciones al mismo modelo
------------------------------------

Hay casos en los que un Modelo tiene más de una relación a otro Modelo.
Por ejemplo podrías tener un Modelo Mensaje que tiene dos relaciones al
Modelo Usuario. Una relación con el usuario que envía el mensaje y una
segunda relación con el usuario que recibe el mensaje. La tabla mensaje
tendrá el campo usuario\_id, pero tendrá además un campo receptor\_id.
Tu Modelo Mensaje luciría así::


    <?php
    class Mensaje extends AppModel {
        var $name = 'Mensaje';
        var $belongsTo = array(
            'Emisor' => array(
                'className' => 'Usuario',
                'foreignKey' => 'usuario_id'
            ),
            'Receptor' => array(
                'className' => 'Usuario',
                'foreignKey' => 'receptor_id'
            )
        );
    }
    ?>

Receptor es un alias para el Modelo Usuario. Ahora veamos como se vería
el Modelo Usuario.

::

    <?php
    class Usuario extends AppModel {
        var $name = 'Usuario';
        var $hasMany = array(
            'MensajeEnviado' => array(
                'className' => 'Mensaje',
                'foreignKey' => 'usuario_id'
            ),
            'MensajeRecibido' => array(
                'className' => 'Mensaje',
                'foreignKey' => 'receptor_id'
            )
        );
    }
    ?>

Joining tables
--------------

En SQL se pueden combinar las tablas relacionadas con la instrucción
JOIN. Esto le permite realizar búsquedas complejas a través de múltiples
tablas (i.e: search posts given several tags).

En CakePHP algunas asociaciones (belongsTo and hasOne) realiza
automática se unen para recuperar datos, así que usted puede realizar
consultas para recuperar los modelos basados en datos de la relación
uno.

Pero esto no es el caso de las asociaciones hasMany y
hasAndBelongsToMany. Aquí es donde se fuerza la unión. Sólo tienes que
definer la unión necesaria para combinar las tablas y obtener los
resultados deseados de tu consulta.

Para forzar una unión entre tablas que se necesitan se usa la "moderna"
sintaxis de Modelo:: find (), añadiendo un'joins' clave para la $options
array. Por ejemplo:

::

    $options['joins'] = array(
        array(
            'table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Note that the 'join' arrays are not keyed.

En el ejemplo anterior, la unión es establecida por los canales de las
tablas. Tu puedes poner un alias al modelo de la tabla por lo que los
datos recuperados se ajusta a la estructura de datos CakePHP.

Las claves que definen la unión son los siguientes:

-  **table**: La unión de la tabla.
-  **alias**: Un alias para la tabla. El nombre del modelo asociado a la
   tabla es la mejor apuesta.
-  **type**: Tipo de unión: inner, left or right.
-  **conditions**: Las condiciones para realizar la unión.

Con las uniones, podrías añadir condiciones basandose en los ámbitos
relacionados con el modelo:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $pirvateItems = $Item->find('all', $options);

Usted podría realizar varias uniones, según sea necesario en
hasBelongsToMany:

Supongamos que hasAndBelongsToMany etiquetada asociación. Esta relación
utiliza una tabla books\_tags como tabla de unión, por lo que necesita
para unirse a la mesa de libros a la mesa books\_tags, y gracias a las
etiquetas de tabla:

::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.books_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

Usando se une con el comportamiento de contener podría dar lugar a
algunos errores de SQL (duplicar las tablas), por lo que necesita para
utilizar el método se une como una alternativa para controlable si su
objetivo principal es realizar búsquedas sobre la base de datos
relacionados. Controlable es el más adecuado a la restricción de la
cantidad de datos relacionados con la traída por un hallazgo comunicado.

Métodos Callback
================

Si necesitas colar alguna lógica justo antes o después de una operación
de modelo de CakePHP, utiliza los *callbacks* del modelo (funciones de
retrollamada). Estas funciones pueden ser definidas en clases del modelo
(incluido tu AppModel). Asegúrate de mirar el valor de retorno esperado
para cada una de estas funciones especiales.

beforeFind
----------

``beforeFind(mixed $datosConsulta)``

Llamado antes de cualquier operación relacionada con búsquedas. Los
datos de consulta ``$datosConsulta`` pasados a este *callback* contienen
información sobre la consulta actual: condiciones, campos, etc.

Si no deseas que la operación de búsqueda comience (posiblemente basado
en una decisión relacionada con las opciones de ``$datosConsulta``),
devuelve ``false``. De lo contrario, devuleve ``$datosConsulta``
posiblemente modificado, o cualquier cosa que quieras pasar a la búsquea
y sus homólogos.

Deberías usar este *callback* para restringir las operaciones de
búsqueda basado en el rol de un usuario, o llevar a cabo decisiones de
cacheo basadas en la carga actual.

afterFind
---------

``afterFind(array $resultados, bool $primario)``

Usa este *callback* para modficar los resultados que han sido devueltos
de una operación de búsqueda, o para realizar cualquier otra lógica tras
la búsqueda. El parámetro ``$resultados`` pasado a este *callback*
contiene los resultados devueltos por la operación de búsqueda del
modelo, p.ej. algo como:

::

    $resultados = array(
      0 => array(
        'NombreModelo' => array(
          'campo1' => 'valor1',
          'campo2' => 'valor2',
        ),
      ),
    );

Los valores devueltos por este *callback* deberían ser los resulados
(posiblemente modificados) de la operación de búsqueda que dispararon
este *callback*.

Si ``$primario`` es ``false``, el formato de ``$resultados`` será un
poco diferente de lo que uno debería esperar; en vez del resultado que
obtendrías normalmente de una operación de búsqueda, obtendrías esto:

::

    $resultados = array(
      'campo_1' => 'valor',
      'campo_2' => 'valor2'
    );

El código que espera que ``$primario`` sea ``true`` probablemente
obtedrá un error falta *"Cannot use string offset as an array"* de PHP
si se usa una búsqueda recursiva

Abajo se muestra un ejemplo de cómo ``afterFind`` puede ser usado para
formateo de datos:

::

    function afterFind($resultados) {
        foreach ($resultados as $clave => $valor) {
            if (isset($valor['Evento']['fechainicio'])) {
                $resultados[$clave]['Evento']['fechainicio'] = $this->formatoFechaAfterFind($valor['Evento']['fechainicio']);
            }
        }
        return $resultados;
    }

    function formatoFechatAfterFind($cadenaFecha) {
        return date('d-m-Y', strtotime($cadenaFecha));
    }

beforeValidate
--------------

``beforeValidate()``

Usa este *callback* para modificar datos del modelo antes de que sean
validados. También puede ser usado para añadir reglas de validación
adicionales más complejas usando ``Model::invalidate()``. En este
contexto, los datos del modelo son accesibles via ``$this->data``. Esta
función también debe devolver *true*, de lo contrario la ejecución
actual de ``save()`` será abortada.

beforeSave
----------

``beforeSave()``

Sitúa cualquier lógica de antes de grabar en esta función. Esta función
se ejecuta inmediatamente después de que los datos del modelo han sido
satisfactoriamente validados, pero justo antes de que los datos sean
grabados. Esta función debería también devolver ``true`` si deseas que
continúe la operación de grabado.

Este *callback* es especialmente útil para cualquier lógica de
tratamiento de datos que necesita ocurrir antes de que tus datos sean
almacenados. Si tu mecanismo de almacenamiento necesita datos en un
formato específico, accede a ellos mediante ``$this->data`` y
modifícalos.

Abajo se muestra un ejemplo de cómo ``beforeSave`` puede ser usado para
conversión de fechas. El código en el ejemplo es usado para una
aplicación con una ``fechainicio`` formateada como AAAA-MM-DD en la base
de datos y es mostrada como DD-MM-AAAA en la aplicación. Por supuesto,
esto puede ser cambiado muy facilmente. Usa el código siguiente en el
modelo apropiado.

::

    function beforeSave() {
        if(!empty($this->data['Evento']['fechainicio']) && !empty($this->data['Evento']['fechafin'])) {
                $this->data['Evento']['fechainicio'] = $this->formatoFechaBeforeSave($this->data['Evento']['fechainicio']);
                $this->data['Evento']['fechafin'] = $this->formatoFechaBeforeSave($this->data['Evento']['fechafin']);
        }
        return true;
    }

    function formatoFechaBeforeSave($cadenaFecha) {
        return date('Y-m-d', strtotime($cadenaFecha)); // Direction is from
    }

Asegúrate de que ``beforeSave()`` devuelve ``true``, o tu grabado
fallará.

afterSave
---------

``afterSave(boolean $creado)``

Si tienes lógica que necesitas que sea ejecutada justo después de cada
operación de grabación, colócala en este método *callback*.

El valor de ``$creado`` será ``true`` si fue creado un nuevo objeto (en
vez de una actualización).

beforeDelete
------------

``beforeDelete(boolean $cascada)``

Coloca en esta función cualquier lógica de antes de borrar. Esta función
debería devolver ``true`` si deseas que continúe el borrado, y ``false``
si quieres que aborte.

El valor de ``$cascada`` será ``true`` si los registros que dependen de
este registro también serán borrados.

afterDelete
-----------

``afterDelete()``

Coloca en este método *callback* cualquier lógica que quieras que sea
ejecutada después de cada borrado.

onError
-------

``onError()``

*Callback* llamado si ocurre cualquier problema.

Atributos del Modelo
====================

Los atributos del modelo te permiten establecer propiedades que pueden
redefinir el comportamiento por defecto del modelo.

Para una lista completa de los atributos del modelo y sus respectivas
descripciones, visita la API del CakePHP. Echa un vistazo a
`https://api.cakephp.org/1.2/class\_model.html <https://api.cakephp.org/1.2/class_model.html>`_.

useDbConfig
-----------

La propiedad ``useDbConfig`` es un cadena de caracteres que especifica
el nombre de la conexión a la base de datos usada para enlazar tu clase
modelo a la tabla de la base de datos relacionada. Puedes estabecer el
valor a cualquiera de las conexiones definidas dentro de tu fichero de
configuración de tu base de datos. El fichero de configuración de la
base de datos se encuentra en ``/app/config/database.php``.

La propiedad ``useDbConfig`` tiene por defecto la conexión a la base de
datos ``'default'`` ( ``$useDbConfig = 'default';`` )

Ejemplo de uso:

::

    class Ejemplo extends AppModel {
       var $useDbConfig = 'alternativo';
    }

useTable
--------

La propiedad ``$useTable`` especifica el nombre de la tabla de la base
de datos. Por defecto, el modelo usa la forma plural y en minúsculas del
nombre de la clase del modelo. Establece este atributo al nombre de una
tabla alternativa, o dale el valor ``false`` si deseas que el modelo no
use una tabla de base de datos.

Ejemplo de uso:

::

    class Ejemplo extends AppModel {
       var $useTable = false; // Este modelo no usa una tabla de base de datos
    }

Alternativamente:

::

    class Ejemplo extends AppModel {
       var $useTable = 'exmp'; // Este modelo usa la tabla 'exmp' de la base de datos
    }

tablePrefix
-----------

El nombre del prefijo de tabla usado para el modelo. El prefijo de tabla
se establece inicialmente en el fichero de conexión a la base de datos
/app/config/database.php. Por defecto es sin prefijo. Puedes sustituir
la configuración por defecto estableciendo el atributo ``tablePrefix``
en el modelo.

Ejemplo de uso:

::

    class Ejemplo extends AppModel {
       var $tablePrefix = 'otros_'; // buscará la tabla 'otros_ejemplos'
    }

primaryKey
----------

Normalmente cada tabla tiene una clave primaria ``id``. Puedes cambiar
qué nombre de campo usará el modelo como clave primaria. Esto es común
cuando se configura CakePHP para usar una tabla de base de datos ya
existente.

Ejemplo de uso:

::

    class Ejemplo extends AppModel {
        var $primaryKey = 'ejemplo_id'; // ejemplo_id es el nombre del campo en la base de datos
    }

displayField
------------

El atributo ``displayField`` ('visualizarCampo') especifica qué campo de
la base de datos debería ser usado como etiqueta para el registro. La
etiqueta se utiliza en *scaffolding* y en llamadas ``find('lista')``. El
modelo usará por defecto el campo ``name`` o ``title``.

Por ejemplo, para utilizar el campo ``nombre_de_usuario``:

::

    class Ejemplo extends AppModel {
       var $displayField = 'nombre_de_usuario';
    }

No se pueden combinar nombres de campos múltiples en un único campo de
*display* (de visualización). Por ejemplo, no puedes especificar
``array('nombre', 'apellido')`` como campo de visualización.

recursive
---------

La propiedad ``$recursive`` define la profundidad a la que CakePHP ha de
llegar para obtener los datos de modelos asociados mediante los métodos
``find()`` y ``findAll()``.

Imagina que tu aplicación muestra Grupos que pertenecen a un Dominio que
tiene muchos Usuarios que, a su vez, tienen muchos Artículos. Puedes
establecer ``$recursive`` con diferentes valores basados en la cantidad
de datos quieres obtener con una llamada a $this->Grupo->find():

+---------------+------------------------------------------------------------------------------------------------------+
| Profundidad   | Descripción                                                                                          |
+===============+======================================================================================================+
| -1            | Cake obtiene sólo los datos de Grupo, no realiza uniones (*joins*).                                  |
+---------------+------------------------------------------------------------------------------------------------------+
| 0             | Cake obtiene datos de Grupo y su Dominio                                                             |
+---------------+------------------------------------------------------------------------------------------------------+
| 1             | Cake obtiene un Grupo, su Dominio y sus Usuarios asociados                                           |
+---------------+------------------------------------------------------------------------------------------------------+
| 2             | Cake obtiene un Grupo, su Dominio, sus Usuarios asociados y los Artículos asociados a los Usuarios   |
+---------------+------------------------------------------------------------------------------------------------------+

No lo establezcas a un valor mayor de lo que necesites. Hacer que
CakePHP obtenga datos que no vas a utilizar ralentiza tu aplicacióń
innecesariamente.

Si deseas combinar ``$recursive`` con la funcionalidad de ``$fields``,
necesitarás añadir las columnas que contienen las claves foráneas
necesarias al array ``fields`` manualmente. En el ejemplo de arriba,
esto podría significar añadir ``domain_id``.

order
-----

El criterio de ordenación de datos por defecto para cualquier operación
de búsqueda. Algunos valores posibles son:

::

    $order = "campo"
    $order = "Modelo.campo";
    $order = "Modelo.campo asc";
    $order = "Modelo.campo ASC";
    $order = "Modelo.campo DESC";
    $order = array("Modelo.campo" => "asc", "Modelo.campo2" => "DESC");

data
----

El contenedor para los datos del modelo que se han obtenido. A pesar de
que los datos devueltos por una clase del modelo normalmente se utilizan
como los devueltos por una llamada a ``find()``, dentro de un *callback*
del modelo necesitarás acceder a la información almacenadana a través de
``$data``.

\_schema
--------

Contiene metadatos describiendo los campos de tabla de la base de datos
del modelo. Cada campo es descrito por:

-  nombre
-  tipo (integer, string, datetime, etc.)
-  null
-  valor por defecto
-  longitud

validate
--------

Este atributo contiene reglas que permiten al modelo realizar decisiones
de validación de datos antes de grabar. Las claves nombradas tras los
campos contienen expresiones regulares permitiendo al modelo buscar
correspondencias.

Para más información, mira el capítulo Validación de
Datos más adelante en este manual.

name
----

Como habrás visto antes en este capítulo, el atributo ``$name`` es una
característica de compatibilidad para los usuarios de PHP4 y se
establece el valor al nombre del modelo.

Ejemplo de uso:

::

    class Ejemplo extends AppModel {
       var $name = 'Ejemplo';
    }

cacheQueries
------------

Si se establece a ``true``, los datos obtenidos por el modelo durante
una petición son *cacheados* (*cached*). Este *cacheo* es sólo en
memoria, y dura sólo el tiempo de duración de la petición. Cualquier
petición duplicada de los mismos datos es tratada por la *caché*.

Métodos Personalizados y Propiedades
====================================

Aunque las funciones de modelo de CakePHP deberían llevarte donde
necesites ir, no olvides que las clases modelos son justamente eso:
clases que te permiten escribir tus propios métodos o definir tus
propias propiedades.

Cualquier operación que maneja la grabación o búsqueda de datos es mejor
que esté alojada en tus clases modelo. Este concepto es a menudo
referido como *"fat model"*.

::

    class Ejemplo extends AppModel {

       function getReciente() {
          $condiciones = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
          );
          return $this->find('all', compact($condiciones));
       }
    }

Ahora, este método ``getReciente()`` puede ser usado dentro del
controlador.

::

    $reciente = $this->Ejemplo->getReciente();

