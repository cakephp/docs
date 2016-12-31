Entendiendo el Modelo - Vista - Controlador
###########################################

CakePHP sigue el patrón diseño de software llamado
`MVC <https://en.wikipedia.org/wiki/Model-view-controller>`_.
Programar usando MVC separa tu aplicación en tres partes principalmente:

La capa del Modelo
==================

El modelo representa la parte de la aplicación que
implementa la lógica de negocio. Ésto significa que es responsable
de la recuperación de datos convirtiéndolos en conceptos significativos para la
aplicación, así como su procesamiento, validación, asociación y cualquier
otra tarea relativa a la manipulación de dichos datos.

A primera vista los objetos del modelo puede ser considerados como la primera capa
de la interacción con cualquier base de datos que podría estar utilizando tu aplicación.
Pero en general representan los principales conceptos en torno a los cuales se
desea implementar un programa.

En el caso de una red social, la capa de modelo se haría cargo de
tareas tales como guardar datos del usuario, el amacenamiento de asociaciones
con amigos, el almacenamiento y la recuperación de fotos de los usuarios,
encontrar sugerencias de nuevos amigos, etc. Mientras que los objetos del modelo
pueden ser considerados como "Amigo", "Usuario", "Comentario" y "Foto".

La capa de la Vista
===================

La vista hace una presentación de los datos del modelo estando separada de 
los objetos del modelo. Es responsable del uso de la información de la cual dispone
para producir cualquier interfaz de presentación de cualquier petición que se presente.

Por ejemplo, como la capa de modelo devuelve un conjunto de datos, la vista los usaría
para hacer una página HTML que los contenga. O un resultado con formato XML para que otras
aplicaciones puedan consumir.

La capa de la Vista no se limita únicamente a HTML o texto que represente los datos,
sino que puede ser utilizada para ofrecer una amplia variedad de formatos en función
de sus necesidades tales como videos, música, documentos y cualquier otro formato
que puedas imaginar.

La capa del Controlador
=======================

La capa del controlador gestiona las peticiones de los usuarios. Es responsable
de responder la información solicitada con la ayuda tanto del modelo como de
la vista.

Los controladores pueden ser vistos como administradores cuidando de que todos
los recursos necesarios para completar una tarea se deleguen a los trabajadores
más adecuados. Espera peticiones de los clientes, comprueba su validez de acuerdo
a las normas de autenticación o autorización, delega la búsqueda de datos al modelo
y selecciona el tipo de respuesta más adecuado según las preferencias del cliente.
Finalmente delega este proceso de presentación a la capa de la Vista.

El ciclo de una petición en CakePHP
===================================

|Figure 1|
Figure: 1: Una petición MVC típica

Figure: 1 muestra el manejo de una petición típica a una aplicación CakePHP.

El ciclo de una petición típica en CakePHP comienza cuando un usuario solicita
una página o un recurso de tu aplicación. Esta solicitud es procesada por un
despachador que selecciona el controlador correcto para manejarlo.

Una vez que la solicitud llega al controlador, éste se comunicará con la capa del Modelo
para cualquier proceso de captación de datos o el guardado de los mismos según se requiera.
Una vez finalizada esta comunicación el controlador procederá a delegar en el
objeto de vista correcto la tarea de generar una presentación resultante de los datos
proporcionada por el modelo.

Finalmente, cuando esta presentación se genera, se envía de inmediato al usuario.

Casi todas las solicitudes para la aplicación van a seguir este patrón básico.
Vamos a añadir algunos detalles más adelante que son específicos a
CakePHP, así que mantén esto en mente a medida que avancemos.

Beneficios
==========

¿Por qué utilizar MVC? Debido a que es un patrón de diseño de software
verdaderamente probado que convierte una aplicación en un paquete modular
fácil de mantener y mejora la rapidez del desarrollo. La separación de las tareas
de tu aplicación en modelos, vistas y controladores hace que su aplicación sea
además muy ligeras de entender. Las nuevas características se añaden fácilmente
y agregar cosas nuevas a código viejo se hace muy sencillo. El diseño modular
también permite a los desarrolladores y los diseñadores trabajar simultáneamente,
incluyendo la capacidad de hacer
`prototipos rápidos <https://en.wikipedia.org/wiki/Software_prototyping>`_.

La separación también permite a los desarrolladores hacer cambios en una parte del
la aplicación sin afectar a los demás.

Si nunca has creado una aplicación de esta forma se necesita algún tiempo
para acostumbrarse, pero estamos seguros que una vez que hayas terminado tu
primera aplicación con CakePHP no vas a querer hacerlo de  cualquier otra
manera.

Para iniciarte con tu primera aplicación en CakePHP 
:doc:`haz este tutorial ahora </tutorials-and-examples/blog/blog>`

.. |Figure 1| image:: /_static/img/basic_mvc.png
