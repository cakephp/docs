Entendiendo Modelo-Vista-Controlador
####################################

Las aplicaciones CakePHP bien escritas siguen el patrón de diseño de
software MVC (Modelo-Vista-Controlador). Programar utilizando MVC
consiste en separar la aplicación en tres partes principales. El modelo
representa los datos de la aplicación, la vista hace una presentación
del modelo de datos, y el controlador maneja y enruta las peticiones
[requests] hechas por los usuarios.

.. figure:: /_static/img/basic_mvc.png
   :align: center
   :alt: Figure 1

   Figura 1: Una petición MVC básica

La figura 1 muestra un ejemplo sencillo de una petición [request] MVC en
CakePHP. A efectos ilustrativos, supongamos que un usuario llamado
Ricardo acaba de hacer clic en el enlace "¡Comprar un pastel
personalizado ahora!" de la página de inicial de la aplicación.

#. Ricardo hace clic en el enlace apuntando a
   https://www.ejemplo.com/pasteles/comprar, y su navegador hace una
   petición al servidor web.
#. El despachador comprueba la URL de la petición (/pasteles/comprar), y
   le pasa la petición al controlador adecuado.
#. El controlador realiza lógica de aplicación específica. Por ejemplo,
   puede comprobar si Ricardo ha iniciado sesión.
#. El controlador también utiliza modelos para acceder a los datos de la
   aplicación. La mayoría de las veces los modelos representan tablas de
   una base de datos, aunque también pueden representar entradas LDAP,
   canales RSS, o ficheros en el sistema. En este ejemplo, el
   controlador utiliza un modelo para buscar la última compra de Ricardo
   en la base de datos.
#. Una vez que el controlador ha hecho su magia en los datos, se los
   pasa a la vista. La vista toma los datos y los deja listos para su
   presentación al usuario. La mayoría de las veces las vistas en
   CakePHP vienen en formato HTML, pero una vista puede ser fácilmente
   un PDF, un documento XML, o un objeto JSON, dependiendo de tus
   necesidades.
#. Una vez que el objeto encargado de procesar vistas en CakePHP ha
   utilizado los datos del controlador para construir una vista
   completa, el contenido se devuelve al navegador de Ricardo.

Casi todas las peticiones a tu aplicación seguirán este patrón básico.
Más adelante, vamos a completar algunos detalles específicos de Cake,
así que, por favor, ten esto en cuenta a medida que avanzamos.

Beneficios
==========

¿Por qué utilizar MVC? Porque es un patrón de diseño de software probado
y se sabe que funciona. Con MVC la aplicación se puede desarrollar
rápidamente, de forma modular y mantenible. Separar las funciones de la
aplicación en modelos, vistas y controladores hace que la aplicación sea
muy ligera. Estas características nuevas se añaden fácilmente y las
antiguas toman automáticamente una forma nueva.

El diseño modular permite a los diseñadores y a los desarrolladores
trabajar conjuntamente, así como realizar rápidamente el prototipado.
Esta separación también permite hacer cambios en una parte de la
aplicación sin que las demás se vean afectadas.

Aunque lleva algún tiempo acostumbrarse a construir aplicaciones así,
estamos seguros de que, una vez construyas tu primera aplicación con
CakePHP, no querrás volver a hacerlo de otra forma.
