Estructura de CakePHP
#####################

CakePHP incluye las clases Controlador [Controller], Modelo [Model] y
Vista [View], pero también incluye otras clases y objetos que hacen que
el desarrollo en MVC sea un poco más rápido y agradable. Los Componentes
[Components], Comportamientos [Behaviors], y Ayudantes [Helpers] son
clases que proporcionan extensibilidad y reusabilidad; agregan
rápidamente funcionalidad a las clases base MVC de las aplicaciones.
Como de momento nos vamos a mantener en este nivel de dificultad, ve
preparando los detalles acerca de cómo usar estas herramientas.

Extensiones de los Controladores ("Componentes")
================================================

Un componente es una clase que ayuda a la lógica de un controlador. Si
tienes alguna lógica y la quieres compartir entre varios controladores
(o aplicaciones), un componente suele ser una buena elección. A modo de
ejemplo, la clase del núcleo EmailComponent hace que la creación y el
envío de mensajes de correo electrónico sea tan sencillo como coser y
cantar. En lugar de escribir lógica en el método de un controlador,
puedes empaquetarla en un componente para poder compartirla.

Los Controladores también están equipados con callbacks. Puedes utilizar
estos callbacks si necesitas insertar alguna lógica en las operaciones
del núcleo de CakePHP. Los Callbacks disponibles incluyen:

-  beforeFilter(), se ejecuta antes que cualquier otra acción del
   controlador
-  beforeRender(), se ejecuta después de la lógica del controlador, pero
   antes de que la vista se renderice
-  afterFilter(), se ejecuta después de toda la lógica del controlador,
   incluido el renderizado de la vista. Puede que no haya ninguna
   diferencia entre afterRender() y afterFilter(), a menos que hayas
   llamado manualmente a render() en el controlador y hayas incluido
   alguna lógica después de esa llamada.

Extensiones de las Vistas
=========================

Un ayudante [Helper] es una clase que ayuda a la lógica de una vista.
Del mismo modo que varios controladores utilizan un componente, los
ayudantes [helpers] hacen que varias vistas accedan y compartan lógica
presentacional. Con uno de los ayudantes del núcleo, el AjaxHelper, el
manejo de las peticiones Ajax en las vistas es mucho más fácil.

La mayoría de las aplicaciones repiten piezas de código en sus vistas.
CakePHP facilita la reutilización de este código con diseños [layouts] y
elementos [elements]. Por defecto, toda vista renderizada por un
controlador se coloca en un diseño [layout]; los elementos entran en
juego cuando hay que reutilizar estos fragmentos pequeños de contenido.

Extensiones de los Modelos
==========================

Del mismo modo, los Comportamientos [Behaviors] son formas de añadir
funcionalidad común entre los modelos. Por ejemplo, si almacena datos de
los usuarios en una estructura de árbol, puede especificar que su modelo
de usuario se comporte como un árbol, y obtener libre funcionalidad para
eliminar, añadir, y mover nodos en la estructura de árbol subyacente.

Los modelos también cuentan con el apoyo de otra clase llamada
DataSource (Origen de datos). Los DataSources son una abstracción que
permite a los modelos manipular diferentes tipos de datos en forma
consistente. Si bien la principal fuente de datos en una aplicación
CakePHP es a menudo una base de datos, puede escribir DataSources
adicionales que le permitan a sus modelos representar canales RSS,
archivos CSV, entradas LDAP, o eventos iCal. Los DataSources le permiten
asociar registros de diferentes fuentes: en lugar de limitarse sólo a
uniones [joins] SQL, los DataSources le permiten decirle a su modelo
LDAP que está asociado a muchos eventos iCal.

Así como los controladores, los modelos también incluyen callbacks:

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

Los nombres de estos métodos deben ser lo suficientemente descriptivos
para que sepa lo que hacen. Asegúrese de obtener los detalles en el
capítulo acerca de los modelos.

Extensiones de la Aplicación
============================

Tanto los controladores como los ayudantes [helpers] y modelos tienen
una clase padre que puede usarse para definir cambios a nivel global de
la aplicación. AppController (localizado en /app/app\_controller.php),
AppHelper (localizado en /app/app\_helper.php) y AppModel (localizado en
/app/app\_model.php) son magníficos lugares donde colocar métodos que
desee compartir entre todos los controladores, ayudantes [helpers] o
modelos.

Las rutas juegan un rol en las peticiones hechas a CakePHP. Las
definiciones de rutas le dicen a CakePHP cómo mapear URLs a acciones de
controladores. El comportamiento por defecto asume que la URL
"/controller/action/var1/var2/" mapea a Controller::action($var1,
$var2), pero puede usar rutas para personalizar URLs y la forma en que
éstas son interpretadas por su aplicación.

Algunas características en una aplicación merecen ser empaquetadas como
un todo. Un plugin es un paquete de modelos, controladores y vistas que
cumplen un propósito específico que puede abarcar múltiples
aplicaciones. Un sistema de administración de usuarios o un blog
simplificado pueden ser buenos ejemplos para plugins de CakePHP.
