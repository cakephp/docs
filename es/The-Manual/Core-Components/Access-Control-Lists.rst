Listas de Control de Acceso
###########################

La funcionalidad de listas de control de acceso en CakePHP es una de las
más comentadas, en parte porque es una de las más solicitadas, y en
parte porque puede ser algo confusa al principio. Si estás buscando un
buen lugar para comenzar a utilizar ACL en general, continúa leyendo.

Debes ser valiente, incluso cuando las cosas se compliquen. Una vez que
asimiles estos conceptos, las listas de control de acceso son una
herramienta extremadamente poderosa para tener a mano al desarrollar tu
aplicación.

Entendiendo cómo funciona ACL
=============================

Las listas de control de acceso permiten gestionar detalladamente los
permisos de una aplicación de forma sencilla y escalable.

Las listas de control de acceso, o ACL, manejan principalmente dos
cosas: las entidades que solicitan el control de algo y las entidades
que se quiere controlar. En la jerga de ACL, las entidades que quieren
controlar algo, que la mayoría de las veces son los usuarios, son los
ARO (en inglés *access request objects*), y las entidades del sistema
que se quiere controlar, que normalmente son acciones o datos, son los
ACO (en inglés *access control objects*). A los ARO se les llama
'objetos' porque quien realiza la petición no siempre es una persona;
los ACO son cualquier cosa que desees controlar: desde la acción de un
controlador o un servicio Web, hasta el diario en línea íntimo de tu
abuela.

En resumen:

-  ACO - Access Control Object - Objeto que se quiere controlar
-  ARO - Access Request Object - Objeto que solicita el control de algo

Esencialmente, las ACL se utilizan para decidir cuándo un ARO puede
acceder a un ACO.

Vamos a utilizar un ejemplo práctico para ver cómo encajan todas estas
piezas. Imaginemos que el grupo de aventureros de la novela de fantasía
*El señor de los Anillos* trabaja con una aplicación CakePHP, y que el
líder, Gandalf, se encarga de gestionar los elementos del grupo. Para
garantizar la privacidad y la seguridad de los miembros del grupo, pues,
lo primero que hace Gandalf es crear la lista de AROs involucrados:

-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

Fíjate que ACL *no* es lo mismo que la autenticación; ACL es lo que
ocurre *después* de que el usuario se autentica. Aunque suelen
utilizarse los dos a la vez, es importante ver la diferencia entre saber
quién es alguien (autenticación) y saber qué puede hacer (ACL).

A continuación, Gandalf tiene que crear una lista con las cosas, o ACOs,
que el sistema maneja. Esta lista puede ser como la siguiente:

-  Armas
-  El Anillo
-  Jamón
-  Diplomacia
-  Cerveza

Armas

El Anillo

Jamón

Diplomacia

Cerveza

Gandalf

Permitir

Permitir

Permitir

Aragorn

Permitir

Permitir

Permitir

Permitir

Bilbo

Permitir

Frodo

Permitir

Permitir

Gollum

Permitir

Legolas

Permitir

Permitir

Permitir

Permitir

Gimli

Permitir

Permitir

Pippin

Permitir

Permitir

Merry

Permitir

A simple vista, parece que este tipo de sistema funciona bastante bien.
En efecto, las asignaciones garantizan la seguridad (sólo Frodo puede
acceder al anillo) y previenen los accidentes (los Hobbits se mantienen
lejos del jamón y de las armas). Parece bastante detallado y fácil de
leer, ¿verdad?

Sin embargo, una matriz como esta sólo funciona en un sistema pequeño;
en un sistema que tenga previsto crecer, o que tenga muchos recursos
(ACOs) y usuarios (AROs), es difícil mantenerla. Ciertamente, ¿te
imaginas, en este ejemplo, cómo se controlaría el acceso a cientos de
campamentos de guerra, gestionándolos por unidad? Otro inconveniente de
las matrices es que no permiten formar grupos lógicos de usuarios ni
aplicar cambios de permiso en cascada a estos grupos. En otras palabras,
estaría muy bien que, una vez terminada la batalla, los hobbits pudieran
acceder a la cerveza y al jamón; en otras palabras, otorgar
individualmente permisos a hobbits es tedioso y propenso a errores,
mientras que aplicarles un cambio en cascada es mucho más fácil.

ACL se suele implementar en una estructura de árbol, y, generalmente,
existe un árbol de AROs y un árbol de ACOs. Organizando los objetos así,
los permisos se gestionan de forma granular y se mantiene una visión
general; en consecuencia, siendo el sabio líder que es, Gandalf decide
utilizar ACL en su sistema y organiza los objetos de la siguiente
manera:

-  Comunidad del Anillo™

   -  Guerreros

      -  Aragorn
      -  Legolas
      -  Gimli

   -  MAgos

      -  Gandalf

   -  Hobbits

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitantes

      -  Gollum

Utilizar una estructura de árbol en los AROs permite a Gandalf definir
permisos que se aplican a un grupo de usuarios, de una sola vez. Por lo
tanto, Gandalf añade ahora estos permisos a los grupos:

-  Comunidad del Anillo
   (**Denegar**: todo)

   -  Guerreros
      (**Permitir**: Armas, Cerveza, Raciones, Jamón)

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Magos
      (**Permitir**: Jamón, Diplomacia, Cerveza)

      -  Gandalf

   -  Hobbits
      (**Permitir**: Cerveza)

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitantes
      (**Permitir**: Jamón)

      -  Gollum

Para ver si Pippin tiene acceso a la cerveza, lo primero que tenemos que
hacer es obtener su camino en el árbol: Comunidad del
Anillo->Hobbits->Pippin. A continuación, hay que ver los permisos que
residen en cada uno de esos puntos, y, finalmente, se utiliza el más
específico relacionado con Pippin y la Cerveza.

+------------------------+---------------------------+-------------------------------------+
| Nodo ARO               | Información de Permisos   | Resultado                           |
+========================+===========================+=====================================+
| Comunidad del Anillo   | Denegar todo              | Acceso a la Cerveza denegado.       |
+------------------------+---------------------------+-------------------------------------+
| Hobbits                | Permitir 'Cerveza'        | Acceso a la Cerveza permitido!      |
+------------------------+---------------------------+-------------------------------------+
| Pippin                 | --                        | Todavía se le permite la Cerveza!   |
+------------------------+---------------------------+-------------------------------------+

Como el nodo de 'Pippin' del árbol ACL no deniega específicamente el
acceso al ACO 'Cerveza', el resultado final es que se permite el acceso
a ese ACO.

Además, el árbol permite realizar ajustes más finos para tener un
control más granular y no pierda la capacidad de realizar cambios
importantes en los grupos de AROs:

-  Comunidad del Anillo
   (**Denegar**: todo)

   -  Guerreros
      (**Permitir**: Armas, Cerveza, Raciones, Jamón)

      -  Aragorn
         (Permitir: Diplomacia)
      -  Legolas
      -  Gimli

   -  MAgos
      (**Permitir**: Jamón, Diplomacia, Cerveza)

      -  Gandalf

   -  Hobbits
      (**Permitir**: Cerveza)

      -  Frodo
         (Permitir: Anillo)
      -  Bilbo
      -  Merry
         (Denegar: Cerveza)
      -  Pippin
         (Permitir: Diplomacia)

   -  Visitantes
      (**Permitir**: Jamón)

      -  Gollum

Esta aproximación permite realizar cambios de permisos globales y, al
mismo tiempo, ajustes granulares. Por lo tanto, podemos decir que, a
excepción de Merry, todos los hobbits tienen acceso a la cerveza. De
nuevo, para saber si Merry tiene acceso a la Cerveza, primero debemos
encontrar su camino en el árbol, Comunidad del Anillo->Hobbits->Merry,
bajar, y analizar los premisos relacionados con la Cerveza:

+------------------------+---------------------------+----------------------------------+
| Nodo ARO               | Información de Permisos   | Resultado                        |
+========================+===========================+==================================+
| Comunidad del Anillo   | Denegar todo              | Acceso a la Cerveza denegado.    |
+------------------------+---------------------------+----------------------------------+
| Hobbits                | Permitir 'Cerveza'        | Acceso a la Cerveza permitido!   |
+------------------------+---------------------------+----------------------------------+
| Merry                  | Denegar 'Cerveza'         | Cerveza denegada.                |
+------------------------+---------------------------+----------------------------------+

Definiendo Permisos: ACL basado en INI
======================================

La primer implementación de ACL en Cake fue basada en archivos INI
almacenados en el directorio de instalación de Cake. Si bien es útil y
estable, recomendamos que utilices la solución de ACL apoyada en la base
de datos, sobre todo por la posibilidad de crear nuevos ACOs y AROs
dentro de la aplicación. La implementación con archivos INI fue pensada
para ser utilizada en aplicaciones simples, especialmente en aquellas
que por alguna razón podrían no utilizar una base de datos.

Por defecto, CakePHP utiliza el sistema de ACL apoyado en la base de
datos. Para habilitar el uso de ACL con archivos INI, tiene que decirle
a CakePHP qué sistema vas a usar editando las siguientes líneas en
app/config/core.php

::

    //Cambiar éstas líneas:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');

    //Para que se vean como éstas:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

Los permisos ARO/ACO son especificados en **/app/config/acl.ini.php**.
Básicamente los AROs se deben especificar en la sección del INI que
tiene tres propiedades: grupos, permitir y denegar.

-  grupos: nombres de los grupos de AROs a los que pertenece este ARO.
-  permitir: nombres de los ACOs a los que tiene acceso este ARO.
-  denegar: nombres de los ACOs a los que este ARO no tiene acceso.

Los ACOs se definen en la sección del INI que sólo incluye las
propiedades permitir y denegar.

Como ejemplo, veamos cómo se vería la estructura de AROs de la Comunidad
del Anillo en la sintaxis del INI:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    grupos = guerreros
    permitir = diplomacia

    [legolas]
    grupos = guerreros

    [gimli]
    grupos = guerreros

    [gandalf]
    grupos = magos

    [frodo]
    grupos = hobbits
    permitir = ring

    [bilbo]
    grupos = hobbits

    [merry]
    grupos = hobbits
    deny = cerveza

    [pippin]
    grupos = hobbits

    [gollum]
    grupos = visitantes

    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [guerreros]
    permitir = armas, cerveza, jamón

    [magos]
    permitir = jamón, diplomacia, cerveza

    [hobbits]
    permitir = cerveza

    [visitantes]
    permitir = jamón

Ahora que ya has definido los permisos, puede saltar a `la sección de
verificación de permisos </es/view/471/checking-permissions-the-acl-c>`_
utilizando el componente ACL.

Definiendo Permisos: ACL en la base de datos
============================================

Ahora que ya hemos cubierto los permisos de ACL basados en archivos INI,
veamos los permisos (más comúnmente utilizados) basados en base de
datos.

Comenzando
----------

La implementación de ACL por defecto está basada en la base de datos.
Ésta consiste en un conjunto de modelos y una aplicación de consola que
viene con la instalación de Cake. Los modelos son usados por Cake para
interactuar con la base de datos para poder almacenar y recuperar los
nodos en forma de árbol. La aplicación de consola se utiliza para
inicializar la base de datos e interacturar con los árboles de ACOs y
AROs

Para comenzar, lo primero que deber asegurarte es que
``/app/config/database.php`` exista y esté correctamente configurado.
Referirse a la sección 4.1 para más información acerca de la
configuración de la base de datos.

Una vez que hayas hecho esto, tienes que utilizar la consola de CakePHP
para crear las tablas de ACL:

::

    $ cake schema run create DbAcl

Ejecutando este comando recreará las tablas necesarias para almacenar
los árbols de ACOs y AROs (si las tablas ya existían, este comando las
elimina y las vuelve a crear). La salida de la consola debería verse
algo así:

::

    ---------------------------------------------------------------
    Cake Schema Shell
    ---------------------------------------------------------------

    The following tables will be dropped.
    acos
    aros
    aros_acos

    Are you sure you want to drop the tables? (y/n) 
    [n] > y
    Dropping tables.
    acos updated.
    aros updated.
    aros_acos updated.

    The following tables will be created.
    acos
    aros
    aros_acos

    Are you sure you want to create the tables? (y/n) 
    [y] > y
    Creating tables.
    acos updated.
    aros updated.
    aros_acos updated.
    End create.

Ésto reemplaza al viejo comando "initdb", el cuál ya es obsoleto.

También puedes utilizar el archivo SQL que se encuentra en
``app/config/sql/db_acl.sql``, pero está lejos de ser tan divertido.

Cuando finalices, deberías tener tres nuevas tablas en tu sistema: acos,
aros, and aros\_acos (la tabla de la relación n a n donde se definen los
permisos entre los dos árboles).

Si eres curioso en saber cómo Cake almacena la información de los
árboles en esas tablas, debes leer acerca del recorrido de árboles en
bases de datos (en inglés *modified database tree traversal*). El
componente ACL utiliza el `Comportamiento de
Árbol </es/view/91/tree-behavior>`_ para gestionar la herencia dentro
del árbol. Las clases pertenecientes a los modelos de ACL están
contenidas en un único archivo
`db\_acl.php <https://api.cakephp.org/1.2/cake_2libs_2model_2db__acl_8php-source.html>`_.

Ahora que ya hemos configurado todo, creemos algunos árboles de AROs y
ACOs

Creando Access Request Objects (AROs) y Access Control Objects (ACOs)
---------------------------------------------------------------------

Al crear nuevos objetos ACL (ACOs y AROs), hay dos formas de nombrar y
acceder a los nodos. El *primer* método consiste en realizar un enlace
entre el objeto ACL directamente con el registro de la base de datos,
especificando el nombre del modelo y el valor de la clave externa. El
*segundo* método puede usarse cuando un objeto no tiene relación con un
registro en la base de datos; puedes proveer un alias para este tipo de
objetos.

En general, cuando estás creando un grupo o un nivel más alto de
objetos, deber usar un alias. Si estás gestionando el acceso a un
registro específico de la base de datos, debes usar el método de
modelo/clave externa.

Para crear nuevos objetos ACL debes utilizar los modelos de ACL
provistos por CakePHP, en los cuales existen algunos campos que
necesitas conocer para almacenar la información: ``model``,
``foreign_key``, ``alias``, y ``parent_id``.

Los campos ``model`` y ``foreign_key`` de un objeto ACL te permiten
enlazar directamente el objeto con el correspondiente registro de la
base de datos (si existe alguno). Por ejemplo, muchos AROs tendrán su
correspondencia con registros de Usuarios en la base de datos.
Estableciendo el campo ``foreign_key`` del ARO con el ID del Usuario te
permitirá enlazar la información del ARO y del Usuario con una simple
llamada find() del modelo del Usuario si las relaciones fueron
configuradas correctamente. En cambio, si lo que quieres es gestionar
las operaciones de editar en un post específico en un blog o un listado
de recetas, podrías elegir enlazar un ACO a ese registro en particular.

El campo ``alias`` de un objeto ACL es sólo una etiqueta que puede ser
fácilmente interpretada por un ser humano, y se utiliza para identificar
un objeto ACL que no tiene una correlación directa con algún registro de
un modelo. Los alias son muy útiles para nombrar grupos de usuarios en
colecciones de ACOs.

El campo ``parent_id`` de un objeto ACL te permite completar la
estructura del árbol. Debes proveer el ID del nodo padre en el árbol
para crear un nuevo hijo.

Antes de crear nuevos objetos ACL, necesitamos cargar las respectivas
clases. La forma más fácil de hacer esto es incluir el componente ACL en
el *array* ``$components`` de tu controlador:

::

    var $components = array('Acl');

Una vez que haz hecho esto, veamos ejemplos de cómo sería la creación de
algunos objetos. El código siguiente puede ser colocado en la acción de
algún controlador:

Mientras los ejemplos se enfocan en la creación de AROs, las mismas
técnicas pueden ser usadas para crear el árbol de ACOs.

Siguiendo con la configuración de la Comunidad, creemos primero nuestro
grupo de ACOs. Debido a que nuestros grupos no tendrán registros
específicos asociados a ellos, usaremos alias en la creación de los
objetos ACL. Lo que estamos haciendo aquí es desde la perspectiva de la
acción de un controlador, pero puede realizarse en otro lugar. Lo que
vamos a usar es una aproximación algo artificial, pero deberías sentirte
cómodo usando estas técnicas para crear AROs y ACOs al vuelo.

Esto no debería ser algo drásticamente nuevo, sólo estamos utilizando
los modelos para guardar los datos como siempre hacemos:

::

    function algunaAccion()
    {
        $aro = new Aro();
        
        //Aquí tenemos la información de nuestros grupos en un array sobre el cual iteraremos luego
        $groups = array(
            0 => array(
                'alias' => 'guerreros'
            ),
            1 => array(
                'alias' => 'magos'
            ),
            2 => array(
                'alias' => 'hobbits'
            ),
            3 => array(
                'alias' => 'visitantes'
            ),
        );
        
        //Iterar para crear los ARO de los grupos
        foreach($groups as $data)
        {
            //Recuerda llamar a create() cuando estés guardando información dentro de bucles...
            $aro->create();
            
            //Guardar datos
            $aro->save($data);
        }

        //Aquí va otra lógica de la acción...
    }

Una vez creados, podemos utilizar la aplicación de consola de ACL para
verificar la estructura de los árboles.

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]guerreros

      [2]magos

      [3]hobbits

      [4]visitantes

    ---------------------------------------------------------------

Supongo que no se parece mucho a un árbol en este punto, pero al menos
pudimos verificar que tenemos los cuatro nodos de primer nivel.
Agreguemos algunos hijos a esos nodos agregando nuestros AROs
específicos de cada usuario dentro de esos grupos. Todo buen ciudadano
de la Tierra Media tiene una cuenta en nuestro nuevo sistema, entonces
nosotros referiremos esos AROs a los registros dentro del modelo
específico en la base de datos.

Cuando agregue hijos al árbol, asegúrese de utilizar el ID del nodo ACL
y no un valor de foreign\_key.

::

    function algunaAccion()
    {
        $aro = new Aro();
        
        //Aquí tenemos nuestros registros de usuario, listos para ser relacionados con nuevos registros ARO
        //Estos datos pueden venir de un modelo, pero en este caso estamos usando arrays estáticos
        //con propósitos de demostración.
        
        $users = array(
            0 => array(
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ),
            1 => array(
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ),
            2 => array(
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ),
            3 => array(
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ),
            4 => array(
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ),
            5 => array(
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ),
            6 => array(
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ),
            7 => array(
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ),
            8 => array(
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ),
        );
        
        //Iterar y crear los AROs (como hijos)
        foreach($users as $data)
        {
            ///Recuerda llamar a create() cuando estés guardando información dentro de bucles...
            $aro->create();

            //Guardar datos
            $aro->save($data);
        }
        
        //Aquí va otra lógica de la acción...
    }

Típicamente no usarás el alias y los campos model/foreing\_key al mismo
tiempo, pero aquí estamos utilizando los dos para que la estructura sea
más fácil de leer y para propósitos de demostración.

La salida de la aplicación de consola ahora debería ser un poco más
interesante. Veamos:

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]guerreros

        [5]Aragorn

        [6]Legolas

        [7]Gimli

      [2]magos

        [8]Gandalf

      [3]hobbits

        [9]Frodo

        [10]Bilbo

        [11]Merry

        [12]Pippin

      [4]visitantes

        [13]Gollum

    ---------------------------------------------------------------

Ahora que ya tenemos nuestro árbol de AROs configurado apropiadamente,
discutamos una posible aproximación para la estructura del árbol de
ACOs. Mientras que podemos estructurar más de una representación
abstracta de nuestros ACOs, a menudo es más práctico modelar un árbol de
ACOs después de configurar los controladores y acciones. Tenemos cindo
objetos principales que queremos manejar en este escenario, y la
configuración natural para una aplicación Cake es un grupo de modelos y
en segundo lugar, los controladores que los manipulan. Es en éstos
controladores donde queremos controlar el acceso a algunas acciones
específicas.

Basándonos en esa idea, vamos a crear un árbol de ACOs que imite una
aplicación Cake. Como tenenos cinco ACOs, vamos a crear un árbol de ACOs
que se verá algo así:

-  Armas
-  Anillo
-  Jamón
-  EsfuerzosDiplomáticos
-  Cervezas

Una buena característica de la implementación de ACL en Cake, es que
cada ACO automáticamente contiene cuatro propiedades relacionadas con
las acciones CRUD (en inglés *create, read, update, and delete*). Puedes
crear nodos dentro de cada uno de esos ACOs principales, pero usando la
gestión de acciones que provee Cake abarcarás las operaciones básicas de
CRUD sobre un objeto dado. Teniendo esto en mente hará que tu árbol de
ACOs sea más pequeño y fácil de mantener. Veremos cómo usadas esas
propiedades cuando hablemos acerca de cómo asignar permisos.

Como ya eres un profesional creando AROs, usa las mismas técnicas para
crear este árbol de ACOs. Crea esos grupos de nivel superior usando el
modelo básico de Aco

Asignando Permisos
------------------

Después de crear los ACOs y los AROs, finalmente podremos asignar los
permisos entre los dos grupos. Esto se realiza utilizando el componente
ACL de Cake. Sigamos con nuestro ejemplo

En este ejemplo trabajaremos en el contexto de una acción de un
controlador. Tenemos que hacer esto debido a que los permisos son
manejados por el componente ACL

::

    class AlgunController extends AppController
    {
        // Podrías colocar esta declaración en AppController
        // para que sea heredada por todos los controladores

        var $components = array('Acl');

    }

Asignemos algunos permisos básicos utilizando el componente ACL in la
acción dentro de este controlador

::

    function index()
    {
        //Permitirle a los guerreros acceso total a las armas
        //Ambos ejemplos usan la sintaxis de alias vista anteriormente
        $this->Acl->allow('guerreros', 'Armas');
        
        //Aunque el Rey puede no querer que todo el mundo tenga
        //acceso irrestricto
        $this->Acl->deny('guerreros/Legolas', 'Armas', 'delete');
        $this->Acl->deny('guerreros/Gimli',   'Armas', 'delete');
        
        die(print_r('hecho', 1));
    }

En la primer llamada que hicimos al componente ACL permitimos que
cualquier usuario dentro del grupo ARO denominado "guerreros" tenga
acceso irrestricto a cualquier arma dentro del grupo ACO denominado
"Armas". Esto lo realizamos referenciando a ambos grupos por sus alias.

¿Has notado el uso del tercer parámetro? Ahí es donde utilizamos esas
acciones pre-contruidos para todos los ACOs dentro de Cake. La opción
por defecto para ese parámetro son ``create``, ``read``, ``update``, y
``delete``, pero puedes agregar una columna en la tabla ``aros_acos``
(comenzando con el prefijo "\_", por ejemplo ``_admin``) y utilizarla
junto con las otras acciones.

La segunda llamada es un intento de realizar una asignación de permisos
mucho más granular. Nosotros queremos que Aragorn tenga acceso
irrestricto, pero no queremos que los otros guerreros pertenecientes al
grupo tengan la habilidad de borrar registros de Armas. En el ejemplo
utilizamos la sintaxis de alias, pero se puede usar también de la forma
model/foreign\_key. El ejemplo anterior es equivalente a este:

::

    // 6342 = Legolas
    // 1564 = Gimli

    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 6342), 'Armas', 'delete');
    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 1564), 'Armas', 'delete');

Para acceder a un nodo utilizando la sintaxis de alias, debemos usar una
cadena de caracteres delimitada por barras
('/usuarios/empleados/desarrolladores'). Para acceder a un nodo
utilizando la sintaxis model/foreign\_key debes utilizar un arreglo con
dos parámetros: ``array('model' => 'Usuario', 'foreign_key' => 8282)``.

La próxima sección nos ayudará a validar nuestra configuración
utilizando el componente ACL para verificar los permisos que acabamos de
asignar.

Verificando Permisos: El Componente ACL
---------------------------------------

Vamos a utilizar el componente ACL para asegurarnos que ni los enanos ni
los elfos pueden quitas armas de la armería. En este punto, deberíamos
ser capaces de utilizar ``AclComponent`` para verificar los permisos
entre los ACOs y AROs que hemos creado. La sintaxis básica para realizar
una verificación de permisos es:

::

    $this->Acl->check( $aro, $aco, $action = '*');

Vamos a intentarlo dentro de una acción en un controlador:

::

    function index()
    {
        //Todos estos devuelven true
        $this->Acl->check('guerreros/Aragorn', 'Armas');
        $this->Acl->check('guerreros/Aragorn', 'Armas', 'create');
        $this->Acl->check('guerreros/Aragorn', 'Armas', 'read');
        $this->Acl->check('guerreros/Aragorn', 'Armas', 'update');
        $this->Acl->check('guerreros/Aragorn', 'Armas', 'delete');
        
        //Recuerda que también podemos utilizar la sintaxis model/foreign_key
        //para los AROs de nuestro usuario
        $this->Acl->check(array('model' => 'User', 'foreign_key' => 2356), 'Armas');
        
        //Estos también deben devolver true:
        $result = $this->Acl->check('guerreros/Legolas', 'Armas', 'create');
        $result = $this->Acl->check('guerreros/Gimli', 'Armas', 'read');
        
        //Pero estos devuelven false:
        $result = $this->Acl->check('guerreros/Legolas', 'Armas','delete');
        $result = $this->Acl->check('guerreros/Gimli', 'Armas', 'delete');
    }

El uso que le dimos aquí es solamente con propósitos de demostración,
pero esperamos que puedas ver cómo la verificación de permisos de esta
forma puede ser utilizada para decidir cuándo permitir o no determinada
acción, mostrar un mensaje de error o redirigir al usuario a la pantalla
de autenticación.
