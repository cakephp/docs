Una petición típica de CakePHP
##############################

Hemos cubierto los ingredientes básicos de CakePHP, así que echemos un
vistazo a cómo los objetos trabajan juntos para completar una petición
básica. Continuando con nuestro ejemplo de petición original, imaginemos
que nuestro amigo Ricardo acaba de hacer clic en el enlace "¡Comprar un
pastel personalizado ahora!" en una página de bienvenida de una
aplicación CakePHP.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request
   
   Figura 2. Petición típica de Cake.

Negro = elemento requerido, Gris = elemento opcional, Azul = callback

-  Ricardo hace clic en el enlace apuntando a
   https://www.ejemplo.com/tortas/comprar, y su navegador hace una
   petición a su servidor Web.
-  El enrutador analiza la URL para extraer los parámetros para esta
   petición: el controlador, la acción, y cualquier otro argumento(s)
   que pueda afectar a la lógica de negocio durante esta petición.
-  Usando las rutas, una petición URL es mapeada a una acción de
   controlador (un método en una clase de controlador específica). En
   este caso, es el método comprar() del controlador PastelesController.
   El callback beforeFilter() del controlador es llamado antes de que
   cualquier acción lógica del controlador sea ejecutada.
-  El controlador puede usar modelos para ganar acceso a los datos de la
   aplicación. En este ejemplo, el controlador usa un modelo para
   obtener información de la base de datos de las últimas compras de
   Ricardo. Cualquier callback de modelo, comportamiento [behavior], y
   orígenes de datos [DataSources] aplicables pueden activarse durante
   esta operación. Mientras que el uso del modelo no es requerido, todos
   los controladores de CakePHP inicialmente requieren al menos un
   modelo, salvo que el desarrollador indique lo contrario.
-  Después que el modelo ha obtenido toda la información, ésta es
   devuelta al controlador. Pueden activarse callbacks del modelo.
-  El controlador puede usar componentes para refinar aun más los datos
   o realizar otras operaciones (manipulación de sesiones,
   autenticación, o envíos de email, por ejemplo).
-  Una vez que el controlador ha usado modelos y componentes para
   preparar suficientemente la información, ésta es entregada a la vista
   usando el método set() del controlador. Los callbacks de controlador
   pueden ser aplicados antes de que la información sea enviada. La
   lógica de vista es ejecutada, la cual puede incluir el uso de
   elementos y/o ayudantes [helpers]. Por defecto, la vista es creada
   dentro del diseño [layout].
-  Callbacks del controlador adicionales (como afterFilter) pueden ser
   aplicados. El código completo creado por la vista es enviado al
   navegador de Ricardo.

