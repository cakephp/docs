Estructura de CakePHP
#####################

CakePHP implementa las clases para controladores, modelos y vistas, pero
también incluye otras clases y objetos que aceleran y facilitan el desarrollo
en un framework MVC y lo hacen más ameno. Componentes, Comportamientos
(Behaviors) y Helpers, son clases que favorecen la extensibilidad y
reutilización de tu código entre proyectos. Empezaremos con una visión de alto
nivel y luego examinaremos los detalles de cada parte.

.. _application-extensions:

Extensiones para las Aplicaciones
=================================

Los controladores, helpers y modelos tienen todos una clase padre que puedes
emplear para definir cambios en toda tu aplicación. AppController, que está
en ``/src/Controller/AppController.php``), AppHelper en
``/src/View/Helper/AppHelper.php`` y AppModel en ``/src/Model/AppModel.php``
son lugares apropiados para colocar métodos que quieras compartir entre todos
tus controladores, helpers y modelos.

Aunque no sean clases ni ficheros, las rutas juegan un papel importante en las
peticiones que se realizan a CakePHP. Las definiciones de rutas le indican al
sistema cómo debe mapear las URLs a las acciones de los controladores. El
comportamiento por defecto es asumir que la ruta
``/controller/action/var1/var2`` se mapea a Controller::action($var1, $var2),
pero puedes usar las rutas para personalizar esto y definir cómo quieres que
sea interpretada cada URL.

Algunas funcionalidades de tu aplicación se merecen ser empaquetadas para ser
usadas como un conjunto. Un plugin es un paquete de modelos, controladores,
vistas, etc. que siguen un objetivo común que puede reutilizarse en otros
proyectos. Un sistema de gestión de usuarios o un blog podrían ser buenos
candidatos para escribir un plugin y utilizarlo en múltiples proyectos.

Extensiones de Controladores ("Components")
============================================

Un Componente (Component) es una clase que da soporte a la lógica de los
controladores. Si tienes lógica que quieres reutilizar entre controladores, o
proyectos, un componentes es el lugar ideal para hacerlo. Por ejemplo,
EmailComponent es un componente de CakePHP que te permite crear y enviar emails
de forma sencilla. En vez de escribir el código para ello en un controlador o
varios, se ha empaquetado en un componente reutilizable.

Los controladores poseen "callbacks". Estos callbacks te permiten inyectar
funcionalidad en el proceso normal de CakePHP. Los callbacks disponibles
incluyen:

-  :php:meth:`~Controller::afterFilter()`, ejecutado después de toda la lógica
    del controlador, incluida la renderización de la vista.
-  :php:meth:`~Controller::beforeFilter()`, ejecutado antes de toda la lógica
    del controlador.
-  :php:meth:`~Controller::beforeRender()`, ejecutado tras la lógica del
    controlador, pero antes de que la vista sea renderizada.

Extensiones de Modelos ("Behaviors")
==========================================

De forma similar, los Comportamientos o "Behaviors" son formas de compartir
funcionalidades entre los modelos. Por ejemplo, si guardas datos de usuario
en una estructura tipo árbol, puedes especificar que tu modelo Usuario se
comporte como un árbol, y obtener gratis las funciones para eliminar, añadir,
e intercambiar nodos en tu estructura.

Los modelos también son potenciados por otra clase llamada fuente de datos o
DataSource. Las fuentes de datos son una abstracción que permite a los modelos
manipular diferentes tipos de datos de manera consistente. La fuente de datos
habitual en una aplicación CakePHP es una base de datos relacional. Puedes
escribir fuentes de datos adicionales para representar "feeds" RSS, ficheros
CSV, servicios LDAP o eventos iCal. Las fuentes de datos te permiten asociar
registros de diferentes orígenes: en vez de estar limitado a consultas SQL,
las fuentes de datos te permitirían decirle a tu modelo LDAP que está
asociado a múltiples eventos iCal.

Igual que los controladores, los modelos poseen callbacks:

-  beforeFind()
-  beforeValidate()
-  afterValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

Los nombres de estos métodos deberían ser descriptivos por sí mismos.
Encontrarás todos los detalles en el capítulo que habla sobre los modelos.

Extensiones de Vistas ("Helpers")
==================================

Un helper es una clase que sirve de apoyo a las vistas. De forma similar a
los componentes y los controladores, los helpers permiten que la lógica que
usas en las vistas se pueda acceder desde otras vistas o en otras aplicaciones.
Uno de los helpers que se distribuye con CakePHP es AjaxHelper, permite que se
realicen llamadas Ajax desde las vistas de forma mucho más sencilla.

La mayoría de aplicaciones tiene trozos de código que se usan una y otra vez.
CakePHP facilita la reutilización de código con plantillas y elementos. Por
defecto cada vista que se genera por un controlador se incrusta dentro de una
plantilla. Los elementos se usan como un modo sencillo de empaquetar código
para poder ser usado en cualquier vista.
