Diseccionando un Request típico en CakePHP
##########################################

Ya hemos cubierto los ingredientes básicos de CakePHP, así que ahora vamos a 
ver cómo interactúan sus componentes para completar una petición de usuario 
o Request. Continuando con nuestro ejemplo anterior, imaginemos que nuestro 
amigo Ricardo acaba de pinchar en el link "Compra un Pastel Personalizado"
en una aplicación CakePHP.

.. figure:: /_static/img/typical-cake-request.gif
   :align: center
   :alt: Diagrama de flujo que muestra un Request típico en CakePHP
   
   Diagrama de flujo que muestra un Request típico en CakePHP

Diagrama: 2. Request típico CakePHP.

Negro = elemento requerido, Gris = elemento opcional, Azul = retorno (callback)


#. Ricardo pincha en el enlace que apunta a 
   http://www.example.com/cakes/buy, y su navegador realiza una petición 
   (request) al servidor web.
#. El Router interpreta la URL para extraer los parámetros para esta petición:
   el controlador, la acción y cualquier otro argumento que afecte a la lógica 
   de negocio durante el request.
#. Usando las rutas, se construye una URL objetivo relacionada con una acción 
   de un controlador (un método específico en una clase controlador). En este
   caso se trata del método buy() del controlador CakesController. El callback
   beforeFilter() de este controlador es invocado antes de ejecutar ningún otro
   método.
#. El controlador puede utilizar uno o varios modelos para acceder a los datos.
   En este ejemplo, el controlador utiliza un modelo para recuperar las últimas
   compras que ha hecho Ricardo de la Base de Datos. Cualquier callback del 
   modelo, comportamiento (behavior), o DataSource que sea aplicable puede ser
   ejecutado en este momento. Aunque utilizar un modelo no es obligatorio, todos
   los controladores de CakePHP requieren inicialmente un modelo.
#. Una vez el modelo ha recuperado los datos, es devuelto al controlador. Se
   aplican aquí los callbacks del modelo.
#. El controlador puede utilizar componentes para refinar los datos o realizar 
   otras operaciones (manipular la sesión, autenticación o enviar emails, por 
   ejemplo).
#. Una vez el controlador ha empleado los modelos y componentes para preparar 
   los datos, se envían a la vista utilizando el método set(). Los callback 
   del controlador pueden ser ejecutados antes de que los datos sean enviados.
   La lógica de la vista se realiza en este punto. Esto puede incluír el uso de
   elementos (elements) y/o helpers. Por defecto, las vistas son generadas 
   dentro de una plantilla (layout).
#. Callback adicionales pueden ejecutarse ahora (como afterFilter) en el 
   controlador. La vista, ya generada por completo, se envía al navegador de
   Ricardo, que puede realizar su crítica compra de Pastel Personalizado.
   The Router parses the URL in order to extract the parameters for
   this request: the controller, action, and any other arguments that
   will affect the business logic during this request.
#. Using routes, a request URL is mapped to a controller action (a
   method in a specific controller class). In this case, it’s the
   buy() method of the CakesController. The controller’s
   beforeFilter() callback is called before any controller action
   logic is executed.
#. The controller may use models to gain access to the
   application’s data. In this example, the controller uses a model to
   fetch Ricardo’s last purchases from the database. Any applicable
   model callbacks, behaviors, and DataSources may apply during this
   operation. While model usage is not required, all CakePHP
   controllers initially require at least one model.
#. After the model has retrieved the data, it is returned to the
   controller. Model callbacks may apply.
#. The controller may use components to further refine the data or
   perform other operations (session manipulation, authentication, or
   sending emails, for example).
#. Once the controller has used models and components to prepare
   the data sufficiently, that data is handed to the view using the
   controller’s set() method. Controller callbacks may be applied
   before the data is sent. The view logic is performed, which may
   include the use of elements and/or helpers. By default, the view is
   rendered inside of a layout.
#. Additional controller callbacks (like afterFilter) may be
   applied. The complete, rendered view code is sent to Ricardo’s
   browser.
